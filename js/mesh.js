import { iceConfig } from './ice.js';
import { signalCode, signalPost } from './signal.js';

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
  const link = { id, pc, channel: null, pending: [] };
  mesh.stream?.getTracks?.().forEach((track) => {
    if (track.readyState === 'ended') return;
    pc.addTrack(track, mesh.stream);
  });
  pc.onicecandidate = (event) => {
    if (!mesh || mesh.stopped || !event.candidate) return;
    const body = JSON.stringify(event.candidate.toJSON ? event.candidate.toJSON() : event.candidate);
    signalPost({
      op: 'push',
      room: mesh.room,
      peer: mesh.peer,
      to: id,
      kind: 'ice',
      body,
    }).catch(() => {});
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

async function offerTo(other) {
  if (!mesh || mesh.stopped || !other?.id || mesh.peer <= other.id) return;
  const link = ensureLink(other.id);
  if (!link || link.pc.signalingState !== 'stable') return;
  wireChannel(link, link.pc.createDataChannel('play'));
  const offer = await link.pc.createOffer();
  await link.pc.setLocalDescription(offer);
  await signalPost({
    op: 'push',
    room: mesh.room,
    peer: mesh.peer,
    to: other.id,
    kind: 'offer',
    body: JSON.stringify({ type: 'offer', sdp: offer.sdp }),
  });
}

async function handleMail(item) {
  if (!mesh || !item || mesh.seen.has(item.id)) return;
  mesh.seen.add(item.id);
  if (item.kind === 'leave') {
    dropLink(item.from);
    return;
  }
  if (item.kind === 'game') {
    mesh.onData?.(item.from, item.body || '');
    return;
  }
  if (item.kind !== 'offer' && item.kind !== 'answer' && item.kind !== 'ice') return;
  const link = ensureLink(item.from);
  if (!link) return;
  let body = null;
  try { body = JSON.parse(item.body || ''); } catch { body = null; }
  if (!body) return;
  if (item.kind === 'ice') {
    if (!link.pc.remoteDescription) link.pending.push(body);
    else link.pc.addIceCandidate(body).catch(() => {});
    return;
  }
  if (item.kind === 'offer') {
    if (mesh.peer > item.from) return;
    if (link.pc.signalingState === 'have-local-offer') {
      await link.pc.setLocalDescription({ type: 'rollback' }).catch(() => {});
    }
    if (link.pc.signalingState !== 'stable' && link.pc.signalingState !== 'have-remote-offer') return;
    await link.pc.setRemoteDescription(body);
    flushIce(link);
    const answer = await link.pc.createAnswer();
    await link.pc.setLocalDescription(answer);
    await signalPost({
      op: 'push',
      room: mesh.room,
      peer: mesh.peer,
      to: item.from,
      kind: 'answer',
      body: JSON.stringify({ type: 'answer', sdp: answer.sdp }),
    });
    return;
  }
  if (link.pc.signalingState !== 'have-local-offer') return;
  await link.pc.setRemoteDescription(body);
  flushIce(link);
}

async function poll() {
  if (!mesh || mesh.busy || mesh.stopped) return;
  mesh.busy = true;
  try {
    const data = await signalPost({ op: 'pull', room: mesh.room, peer: mesh.peer, after: mesh.after });
    if (!mesh || mesh.stopped) return;
    const mail = data.mail || [];
    for (const item of mail) {
      if (item.at > mesh.after) mesh.after = item.at;
      await handleMail(item);
    }
    const peers = data.peers || [];
    mesh.onPeers?.(peers);
    const ids = new Set(peers.map((peer) => peer.id));
    [...mesh.links.keys()].forEach((id) => {
      if (!ids.has(id)) dropLink(id);
    });
    for (const other of peers) {
      if (mesh.peer > other.id && !mesh.links.has(other.id)) {
        await offerTo(other);
      }
    }
  } catch (error) {
    mesh?.onStatus?.(error?.message || 'The call server did not answer.');
  } finally {
    if (mesh) mesh.busy = false;
  }
}

function pulse() {
  if (!mesh || mesh.stopped || Date.now() - mesh.pulsed < 20000) return;
  mesh.pulsed = Date.now();
  signalPost({ op: 'push', room: mesh.room, peer: mesh.peer, kind: 'here', body: '' }).catch(() => {});
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
    after: 0,
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
  await signalPost({ op: 'join', room, peer, name: mesh.name });
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
    signalPost({
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
  current.links.forEach((link) => link.pc.close());
  current.links.clear();
  signalPost({ op: 'leave', room: current.room, peer: current.peer }).catch(() => {});
}
