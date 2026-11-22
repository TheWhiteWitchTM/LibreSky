import { iceConfig } from './ice.js';
import { signalCode, signalPost, signalSend } from './signal.js';

let mesh = null;

export function meshActive() {
  return Boolean(mesh && !mesh.stopped);
}

export function meshRoom() {
  return mesh?.room || '';
}

function wireChannel(link, channel) {
  if (!channel) return;
  link.channel = channel;
  channel.onmessage = (event) => {
    if (!mesh || mesh.stopped) return;
    mesh.onData?.(link.id, String(event.data || ''));
  };
}

function flushIce(link) {
  if (!link?.pc?.remoteDescription) return;
  const queued = link.pending.splice(0);
  queued.forEach((candidate) => {
    link.pc.addIceCandidate(candidate).catch(() => {});
  });
}

function dropLink(id) {
  const link = mesh?.links.get(id);
  if (!link) return;
  link.pc.close();
  mesh.links.delete(id);
  mesh.onGone?.(id);
}

function ensureLink(id) {
  if (!mesh) return null;
  const known = mesh.links.get(id);
  if (known) return known;
  const pc = new RTCPeerConnection(mesh.config);
  const link = { id, pc, channel: null, pending: [], sentOffer: false, opened: Date.now() };
  mesh.stream?.getTracks?.().forEach((track) => {
    if (track.readyState === 'ended') return;
    pc.addTrack(track, mesh.stream);
  });
  pc.onicecandidate = (event) => {
    if (!mesh || mesh.stopped || !event.candidate) return;
    const body = JSON.stringify(event.candidate.toJSON ? event.candidate.toJSON() : event.candidate);
    queueIce(id, body);
  };
  pc.ontrack = (event) => {
    if (!mesh || mesh.stopped) return;
    const stream = event.streams?.[0] || new MediaStream([event.track]);
    mesh.onTrack?.(id, stream);
  };
  pc.ondatachannel = (event) => wireChannel(link, event.channel);
  pc.onconnectionstatechange = () => {
    if (!mesh || link.pc !== pc) return;
    if (pc.connectionState === 'failed' || pc.connectionState === 'closed') dropLink(id);
  };
  mesh.links.set(id, link);
  return link;
}

function queueIce(to, body) {
  if (!mesh || mesh.stopped) return;
  mesh.ice.push({ to, body });
  if (mesh.iceTimer) return;
  mesh.iceTimer = setTimeout(() => { flushIcePosts().catch(() => {}); }, 280);
}

async function flushIcePosts() {
  if (!mesh) return;
  mesh.iceTimer = 0;
  const batch = mesh.ice.splice(0, 12);
  for (let index = 0; index < batch.length; index += 1) {
    const item = batch[index];
    if (!mesh || mesh.stopped) return;
    try {
      await signalSend({
        op: 'push',
        room: mesh.room,
        peer: mesh.peer,
        to: item.to,
        kind: 'ice',
        body: item.body,
      });
    } catch {
      if (!mesh) return;
      mesh.ice.unshift(...batch.slice(index));
      mesh.iceTimer = setTimeout(() => { flushIcePosts().catch(() => {}); }, 900);
      return;
    }
  }
  if (mesh?.ice.length) mesh.iceTimer = setTimeout(() => { flushIcePosts().catch(() => {}); }, 280);
}

async function offerTo(other) {
  if (!mesh || mesh.stopped || !other?.id || mesh.peer <= other.id) return;
  const existing = mesh.links.get(other.id);
  if (existing?.sentOffer && existing.pc.signalingState === 'have-local-offer') return;
  if (existing && existing.pc.signalingState !== 'stable') dropLink(other.id);
  const link = ensureLink(other.id);
  if (!link || link.pc.signalingState !== 'stable') return;
  wireChannel(link, link.pc.createDataChannel('play'));
  const offer = await link.pc.createOffer();
  await link.pc.setLocalDescription(offer);
  const body = JSON.stringify({ type: 'offer', sdp: link.pc.localDescription?.sdp || offer.sdp });
  try {
    await signalSend({
      op: 'push',
      room: mesh.room,
      peer: mesh.peer,
      to: other.id,
      kind: 'offer',
      body,
    });
    link.sentOffer = true;
  } catch (error) {
    dropLink(other.id);
    throw error;
  }
}

async function handleMail(item) {
  if (!mesh || !item) return true;
  if (mesh.seen.has(item.id)) return true;
  const fail = () => {
    const count = (mesh.fails.get(item.id) || 0) + 1;
    mesh.fails.set(item.id, count);
    if (count >= 3) {
      mesh.seen.add(item.id);
      return true;
    }
    return false;
  };
  try {
    if (item.kind === 'leave') {
      dropLink(item.from);
      mesh.seen.add(item.id);
      return true;
    }
    if (item.kind === 'game') {
      mesh.onData?.(item.from, item.body || '');
      mesh.seen.add(item.id);
      return true;
    }
    if (item.kind !== 'offer' && item.kind !== 'answer' && item.kind !== 'ice') {
      mesh.seen.add(item.id);
      return true;
    }
    const link = ensureLink(item.from);
    if (!link) return fail();
    let body = null;
    try { body = JSON.parse(item.body || ''); } catch { body = null; }
    if (!body) {
      mesh.seen.add(item.id);
      return true;
    }
    if (item.kind === 'ice') {
      if (!link.pc.remoteDescription) link.pending.push(body);
      else await link.pc.addIceCandidate(body).catch(() => {});
      mesh.seen.add(item.id);
      return true;
    }
    if (item.kind === 'offer') {
      if (mesh.peer > item.from) {
        mesh.seen.add(item.id);
        return true;
      }
      if (link.pc.signalingState === 'have-local-offer') {
        await link.pc.setLocalDescription({ type: 'rollback' }).catch(() => {});
      }
      if (link.pc.signalingState !== 'stable' && link.pc.signalingState !== 'have-remote-offer') return fail();
      await link.pc.setRemoteDescription(body);
      flushIce(link);
      const answer = await link.pc.createAnswer();
      await link.pc.setLocalDescription(answer);
      await signalSend({
        op: 'push',
        room: mesh.room,
        peer: mesh.peer,
        to: item.from,
        kind: 'answer',
        body: JSON.stringify({ type: 'answer', sdp: link.pc.localDescription?.sdp || answer.sdp }),
      });
      mesh.seen.add(item.id);
      return true;
    }
    if (link.pc.signalingState !== 'have-local-offer') {
      mesh.seen.add(item.id);
      return true;
    }
    await link.pc.setRemoteDescription(body);
    flushIce(link);
    mesh.seen.add(item.id);
    return true;
  } catch {
    return fail();
  }
}

function noteCursor(item) {
  if (!mesh || !item) return;
  const at = Number(item.at) || 0;
  const id = String(item.id || '');
  if (at > mesh.after || (at === mesh.after && id > mesh.afterId)) {
    mesh.after = at;
    mesh.afterId = id;
  }
}

async function poll() {
  if (!mesh || mesh.busy || mesh.stopped) return;
  mesh.busy = true;
  try {
    const data = await signalPost({
      op: 'pull',
      room: mesh.room,
      peer: mesh.peer,
      after: mesh.after,
      afterId: mesh.afterId,
    });
    if (!mesh || mesh.stopped) return;
    mesh.misses = 0;
    const mail = (data.mail || []).slice().sort((a, b) => (Number(a.at) - Number(b.at)) || String(a.id).localeCompare(String(b.id)));
    for (const item of mail) {
      const ok = await handleMail(item);
      if (!mesh || mesh.stopped) return;
      if (!ok) break;
      noteCursor(item);
    }
    const peers = data.peers || [];
    mesh.onPeers?.(peers);
    const ids = new Set(peers.map((peer) => peer.id));
    [...mesh.links.keys()].forEach((id) => {
      if (!ids.has(id)) dropLink(id);
    });
    for (const other of peers) {
      if (!(mesh.peer > other.id)) continue;
      const link = mesh.links.get(other.id);
      const state = link?.pc?.connectionState || '';
      const dead = state === 'failed' || state === 'closed';
      const slow = Boolean(link) && state !== 'connected' && Date.now() - link.opened > 20000;
      if (link && (dead || slow || !link.sentOffer)) dropLink(other.id);
      if (!mesh.links.has(other.id)) await offerTo(other);
    }
  } catch (error) {
    if (!mesh) return;
    mesh.misses = (mesh.misses || 0) + 1;
    if (mesh.misses >= 3) mesh.onStatus?.(error?.message || 'The call server did not answer.');
  } finally {
    if (mesh) mesh.busy = false;
  }
}

function pulse() {
  if (!mesh || mesh.stopped || Date.now() - mesh.pulsed < 20000) return;
  mesh.pulsed = Date.now();
  signalSend({ op: 'push', room: mesh.room, peer: mesh.peer, kind: 'here', body: '' }).catch(() => {});
}

export async function startMesh({ room, name, stream, onTrack, onData, onGone, onPeers, onStatus }) {
  await stopMesh();
  if (!room || !globalThis.RTCPeerConnection) throw new Error('This browser cannot open that room.');
  const peer = signalCode(16);
  const config = await iceConfig();
  mesh = {
    room,
    peer,
    name: name || 'call',
    stream: stream || null,
    config,
    links: new Map(),
    seen: new Set(),
    fails: new Map(),
    ice: [],
    iceTimer: 0,
    after: 0,
    afterId: '',
    misses: 0,
    pulsed: Date.now(),
    stopped: false,
    busy: false,
    timer: 0,
    onTrack,
    onData,
    onGone,
    onPeers,
    onStatus,
  };
  await signalSend({ op: 'join', room, peer, name: mesh.name });
  if (!mesh || mesh.stopped || mesh.peer !== peer) return { room, peer };
  await poll();
  if (!mesh || mesh.stopped || mesh.peer !== peer) return { room, peer };
  mesh.timer = setInterval(() => {
    poll().catch(() => {});
    pulse();
  }, 700);
  return { room, peer };
}

export function sendMesh(text, to = '') {
  if (!mesh || mesh.stopped) return 0;
  let sent = 0;
  mesh.links.forEach((link) => {
    if (to && link.id !== to) return;
    if (link.channel?.readyState !== 'open') return;
    try {
      link.channel.send(String(text ?? ''));
      sent += 1;
    } catch {
      /* the next poll can carry it */
    }
  });
  if (!sent) {
    signalSend({
      op: 'push',
      room: mesh.room,
      peer: mesh.peer,
      to,
      kind: 'game',
      body: String(text ?? '').slice(0, 8000),
    }).catch(() => {});
  }
  return sent;
}

export async function stopMesh() {
  const current = mesh;
  mesh = null;
  if (!current) return;
  current.stopped = true;
  if (current.timer) clearInterval(current.timer);
  if (current.iceTimer) clearTimeout(current.iceTimer);
  current.links.forEach((link) => link.pc.close());
  current.links.clear();
  signalSend({ op: 'leave', room: current.room, peer: current.peer }).catch(() => {});
}
