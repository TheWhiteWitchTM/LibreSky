import * as api from './api.js';
import { iceConfig, waitForIce } from './ice.js';
import { startMesh, stopMesh } from './mesh.js';
import { signalCode, signalSend } from './signal.js';
import { assembleCallSdp, messageSender, parseCallMessage } from './util.js';

const COLLECTION = 'com.libresky.call';
const FRESH_MS = 10 * 60 * 1000;
const RKEY = /^[234567abcdefghijklmnopqrstuvwxyz]{13}$/;
const CHUNK = 900;

let notify = () => {};
let onStage = () => {};
let onClear = () => {};
let who = () => ({ did: '', name: 'Call' });
let session = null;
let epoch = 0;

export function setupCall(hooks) {
  notify = hooks.toast || notify;
  onStage = hooks.onStage || onStage;
  onClear = hooks.onClear || onClear;
  who = hooks.me || who;
}

export function canCall() {
  return Boolean(window.isSecureContext && navigator.mediaDevices?.getUserMedia && window.RTCPeerConnection);
}

export function isInCall() {
  return Boolean(session);
}

export function incomingCall(messages, me, peer) {
  if (!peer) return null;
  const rows = (messages || []).map((message) => ({ message, parsed: parseCallMessage(message?.text) })).filter((row) => row.parsed);
  rows.sort((a, b) => String(a.message?.sentAt || '').localeCompare(String(b.message?.sentAt || '')));
  let offer = null;
  for (const row of rows) {
    const parsed = row.parsed;
    const sender = messageSender(row.message);
    const sentAt = row.message.sentAt || '';
    if (sender && sender !== me && sender !== peer) continue;
    const fromPeer = sender === peer || !sender;
    if (parsed.kind === 'offer' && fromPeer && parsed.rkey) {
      offer = { kind: 'offer', media: parsed.media === 'video' ? 'video' : 'audio', rkey: parsed.rkey, room: parsed.room || '', sentAt };
      continue;
    }
    if (parsed.kind === 'data' && fromPeer && parsed.rkey) {
      const media = parsed.media === 'video' ? 'video' : 'audio';
      if (!offer || offer.rkey !== parsed.rkey) offer = { kind: 'offer', media, rkey: parsed.rkey, room: parsed.room || '', sentAt };
      else offer = { ...offer, media: parsed.media ? media : offer.media, room: parsed.room || offer.room || '', sentAt: sentAt || offer.sentAt };
      continue;
    }
    if (!offer) continue;
    const sameCall = !parsed.rkey || parsed.rkey === offer.rkey;
    if (parsed.kind === 'answer' || (sameCall && (parsed.kind === 'decline' || parsed.kind === 'end'))) offer = null;
  }
  if (!offer) return null;
  const then = new Date(offer.sentAt).getTime();
  if (!Number.isFinite(then) || Date.now() - then > FRESH_MS) return null;
  return offer;
}

function $(id) {
  return document.getElementById(id);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function caller() {
  const row = who() || {};
  const did = typeof row.did === 'string' ? row.did : '';
  const name = typeof row.name === 'string' && row.name.trim() ? row.name.trim().slice(0, 24) : 'Call';
  return { did, name };
}

async function sendLine(convoId, text) {
  if (!convoId || !text) return false;
  let last;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      await api.sendMessage(convoId, text);
      api.markConvoRead(convoId).catch(() => {});
      return true;
    } catch (error) {
      last = error;
      if (attempt < 2) await sleep(400 * (attempt + 1));
    }
  }
  throw last;
}

async function publishRing(room, targets, media, rkey, group) {
  const me = caller();
  const toDids = [...new Set((Array.isArray(targets) ? targets : [targets]).filter((did) => typeof did === 'string' && did.startsWith('did:') && did !== me.did))];
  if (!room || !toDids.length || !me.did) return false;
  try {
    await signalSend({
      op: 'ring',
      room,
      toDids,
      fromDid: me.did,
      name: me.name,
      media: media === 'video' ? 'video' : 'audio',
      group: Boolean(group),
      rkey,
    });
    return true;
  } catch {
    return false;
  }
}

function withdrawRing(room) {
  if (!room) return;
  signalSend({ op: 'unring', room, fromDid: caller().did }).catch(() => {});
}

async function pokeInvite() {
  if (!session?.room) return;
  if (!session.rang) {
    const targets = session.targets?.length ? session.targets : (session.peerDid ? [session.peerDid] : []);
    if (targets.length) session.rang = await publishRing(session.room, targets, session.media, session.rkey, session.group);
  }
  if (!session?.announced && session?.convoId && session.invite) {
    try {
      await sendLine(session.convoId, sentence(session.invite, session.media, session.rkey, session.room));
      if (session) session.announced = true;
    } catch {
      /* the next poll sends the line again */
    }
  }
}

function sentence(kind, media, rkey, room = '') {
  const key = RKEY.test(String(rkey || '')) ? ` ${rkey}` : '';
  const place = /^[a-z2-9]{8,24}$/.test(String(room || '')) ? ` room ${room}` : '';
  if (kind === 'group') {
    const mode = media === 'video' ? 'video' : 'audio';
    return `!ls call group ${mode}${key}${place}`;
  }
  if (kind === 'offer' || kind === 'answer') {
    const mode = media === 'video' ? 'video' : 'audio';
    return `!ls call ${kind} ${mode}${key}${place}`;
  }
  if (kind === 'decline') return `!ls call decline${key}`;
  return `!ls call end${key}`;
}

function setStatus(text) {
  const node = $('call-status');
  if (node) node.textContent = text;
}

export function formatCallClock(ms) {
  const total = Math.max(0, Math.floor(Number(ms) / 1000) || 0);
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;
  const sec = String(seconds).padStart(2, '0');
  if (hours > 0) return `${hours}:${String(minutes).padStart(2, '0')}:${sec}`;
  return `${minutes}:${sec}`;
}

export function setKindEnabled(stream, kind, enabled) {
  const tracks = typeof stream?.getTracks === 'function'
    ? stream.getTracks().filter((track) => track && track.kind === kind)
    : [];
  tracks.forEach((track) => { track.enabled = Boolean(enabled); });
  return tracks.length > 0;
}

let clockTimer = 0;
let connectedAt = 0;

function paintCallControls() {
  const mute = $('call-mute');
  const camera = $('call-camera');
  const local = $('call-local');
  const muted = Boolean(session?.muted);
  const cameraOff = Boolean(session?.cameraOff);
  const video = session?.media === 'video';
  if (mute) {
    mute.hidden = !session;
    mute.setAttribute('aria-pressed', muted ? 'true' : 'false');
    mute.setAttribute('aria-label', muted ? 'Unmute microphone' : 'Mute microphone');
    mute.dataset.tip = muted ? 'Unmute' : 'Mute';
  }
  if (camera) {
    camera.hidden = !video;
    camera.setAttribute('aria-pressed', cameraOff ? 'true' : 'false');
    camera.setAttribute('aria-label', cameraOff ? 'Turn camera on' : 'Turn camera off');
    camera.dataset.tip = cameraOff ? 'Camera on' : 'Camera off';
  }
  if (local) local.classList.toggle('is-off', cameraOff);
}

function startClock() {
  if (clockTimer || !session) return;
  connectedAt = Date.now();
  const node = $('call-clock');
  if (node) {
    node.hidden = false;
    node.textContent = formatCallClock(0);
  }
  clockTimer = setInterval(() => {
    const clock = $('call-clock');
    if (!session || !clock) return;
    clock.textContent = formatCallClock(Date.now() - connectedAt);
  }, 1000);
}

function stopClock() {
  if (clockTimer) clearInterval(clockTimer);
  clockTimer = 0;
  connectedAt = 0;
  const node = $('call-clock');
  if (node) {
    node.hidden = true;
    node.textContent = formatCallClock(0);
  }
}

export function toggleCallMute() {
  if (!session?.stream) return false;
  session.muted = !session.muted;
  setKindEnabled(session.stream, 'audio', !session.muted);
  paintCallControls();
  return session.muted;
}

export function toggleCallCamera() {
  if (!session?.stream || session.media !== 'video') return false;
  session.cameraOff = !session.cameraOff;
  setKindEnabled(session.stream, 'video', !session.cameraOff);
  paintCallControls();
  return session.cameraOff;
}

function playRemote(stream, media) {
  const remote = $('call-remote');
  const audio = $('call-audio');
  if (media === 'video' && remote) {
    remote.hidden = false;
    remote.srcObject = stream;
    remote.play().catch(() => {});
  }
  if (audio) {
    audio.srcObject = stream;
    audio.play().catch(() => {});
  }
  setStatus('Connected');
  startClock();
}

function mountPeer(id, stream) {
  const box = $('call-peers');
  if (!box) return playRemote(stream, session?.media);
  box.hidden = false;
  const escapeId = window.CSS?.escape || ((value) => String(value).replace(/"/g, '\\"'));
  let tile = box.querySelector(`[data-peer="${escapeId(id)}"]`);
  if (!tile) {
    tile = document.createElement('video');
    tile.autoplay = true;
    tile.playsInline = true;
    tile.dataset.peer = id;
    box.append(tile);
  }
  tile.srcObject = stream;
  tile.play().catch(() => {});
  setStatus('Connected');
  startClock();
}

function showStage(media, group = false) {
  const dialog = $('call');
  const remote = $('call-remote');
  const local = $('call-local');
  const voice = $('call-voice');
  const title = $('call-title');
  const peers = $('call-peers');
  const video = media === 'video';
  if (peers) {
    peers.hidden = !group;
    if (!group) peers.replaceChildren();
  }
  if (remote) remote.hidden = group || !video;
  if (local) local.hidden = !video;
  if (voice) voice.hidden = group || video;
  if (title) title.textContent = group ? (video ? 'Group video' : 'Group voice') : (video ? 'Video call' : 'Voice call');
  if (dialog) dialog.dataset.media = group ? 'group' : (video ? 'video' : 'audio');
  const presence = $('call-presence');
  if (presence) {
    presence.dataset.presence = session?.peerDid || '';
    presence.replaceChildren();
  }
  paintCallControls();
  if (dialog && !dialog.open) dialog.showModal();
  onStage(session?.peerDid || '');
}



async function mediaStream(media) {
  const video = media === 'video';
  try {
    return await navigator.mediaDevices.getUserMedia({ audio: true, video: video ? { facingMode: 'user' } : false });
  } catch (error) {
    if (!video) throw error;
    return navigator.mediaDevices.getUserMedia({ audio: true, video: true });
  }
}

function attach(pc, media) {
  pc.addEventListener('track', (event) => {
    const stream = event.streams[0];
    if (!stream) return;
    const remote = $('call-remote');
    const audio = $('call-audio');
    if (media === 'video' && remote) {
      remote.srcObject = stream;
      remote.play().catch(() => {});
    }
    if (audio) {
      audio.srcObject = stream;
      audio.play().catch(() => {});
    }
    setStatus('Connected');
    startClock();
  });
  pc.addEventListener('connectionstatechange', () => {
    if (!session || session.pc !== pc) return;
    if (pc.connectionState === 'connected') {
      setStatus('Connected');
      startClock();
    }
    if (pc.connectionState === 'disconnected') setStatus('Reconnecting…');
    if (pc.connectionState === 'failed') {
      notify('The call could not connect. Some networks block it.');
      hangUp(true);
    }
  });
}

function rkeyOf(uri) {
  return String(uri || '').split('/').pop();
}

function randomRkey() {
  const alphabet = '234567abcdefghijklmnopqrstuvwxyz';
  const bytes = new Uint8Array(13);
  crypto.getRandomValues(bytes);
  return [...bytes].map((byte) => alphabet[byte % alphabet.length]).join('');
}

function encodeSdp(sdp) {
  const bytes = new TextEncoder().encode(sdp);
  let binary = '';
  bytes.forEach((byte) => { binary += String.fromCharCode(byte); });
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function chunkSdp(rkey, sdp, media) {
  const mode = media === 'video' ? 'video' : 'audio';
  const packed = encodeSdp(sdp);
  const parts = [];
  for (let index = 0; index < packed.length; index += CHUNK) parts.push(packed.slice(index, index + CHUNK));
  if (parts.length > 30) throw new Error('The call details are too large for this chat.');
  return parts.map((part, index) => {
    const line = `!ls call sdp ${mode} ${rkey} ${index + 1}/${parts.length} ${part}`;
    if (line.length > 1000) throw new Error('The call details are too large for this chat.');
    return line;
  });
}

function latestSignalTime(messages, rkey, peerDid) {
  let latest = '';
  for (const message of messages || []) {
    if (peerDid && messageSender(message) !== peerDid) continue;
    const parsed = parseCallMessage(message?.text);
    if (!parsed || parsed.rkey !== rkey) continue;
    if (parsed.kind !== 'offer' && parsed.kind !== 'data') continue;
    const sent = String(message?.sentAt || '');
    if (sent > latest) latest = sent;
  }
  return latest;
}

async function readSdp(peerDid, rkey, convoId, messages) {
  try {
    const record = await api.getPublicRecord(peerDid, COLLECTION, rkey);
    if (record?.value?.sdp) return String(record.value.sdp);
  } catch {
    /* the chat copy is the backup */
  }
  let list = messages;
  if (!list && convoId) {
    try {
      const data = await api.getConvo(convoId);
      list = data.messages;
    } catch {
      list = [];
    }
  }
  return assembleCallSdp(list, rkey, peerDid);
}

async function announce(convoId, kind, media, sdp) {
  let uri = '';
  let rkey = '';
  try {
    const created = await api.createCallSignal({
      $type: COLLECTION,
      convoId,
      media,
      sdpType: kind,
      sdp,
      createdAt: new Date().toISOString(),
    });
    uri = created?.uri || '';
    rkey = rkeyOf(uri);
  } catch {
    uri = '';
    rkey = '';
  }
  if (!RKEY.test(rkey)) {
    if (uri) api.deleteRecord(uri).catch(() => {});
    rkey = randomRkey();
    uri = '';
  }
  try {
    const lines = chunkSdp(rkey, sdp, media);
    for (const line of lines) await sendLine(convoId, line);
    await sendLine(convoId, sentence(kind === 'offer' ? 'offer' : 'answer', media, rkey));
  } catch (error) {
    if (uri) api.deleteRecord(uri).catch(() => {});
    throw error;
  }
  return { uri, rkey };
}

async function watch(token, convoId, peerDid, media, wantAnswer) {
  const meshWatch = Boolean(session?.mesh);
  let spins = 0;
  while (token === epoch && session && (meshWatch || spins < 40)) {
    spins += 1;
    if (meshWatch && spins > 1800) return;
    await sleep(meshWatch ? 2000 : 1500);
    if (token !== epoch || !session) return;
    if (session.invite && (!session.rang || !session.announced)) await pokeInvite();
    if (token !== epoch || !session) return;
    if (!convoId) continue;
    let data;
    try { data = await api.getConvo(convoId); } catch { continue; }
    for (const message of data.messages || []) {
      const sender = messageSender(message);
      if (peerDid && sender !== peerDid) continue;
      const parsed = parseCallMessage(message.text);
      if (!parsed) continue;
      const sent = new Date(message.sentAt || 0).getTime();
      if (!Number.isFinite(sent) || sent + 20000 < (session.startedAt || 0)) continue;
      if (parsed.kind === 'decline' || parsed.kind === 'end') {
        if (session.rkey && parsed.rkey && parsed.rkey !== session.rkey) continue;
        if (session.group && parsed.kind !== 'end') continue;
        return finish(parsed.kind === 'decline' ? 'Call declined' : 'Call ended', false);
      }
      if (session.mesh || !session.pc) continue;
      if (wantAnswer && !session.pc.remoteDescription && parsed.kind === 'answer' && parsed.rkey && parsed.media === media) {
        try {
          const sdp = await readSdp(peerDid, parsed.rkey, convoId, data.messages);
          if (sdp && session?.pc) {
            await session.pc.setRemoteDescription({ type: 'answer', sdp });
            setStatus('Connecting…');
            wantAnswer = false;
          }
        } catch {
          /* the next poll can retry */
        }
      }
    }
  }
  if (token === epoch && session && wantAnswer && session.pc && !session.pc.currentRemoteDescription && !session.pc.remoteDescription) {
    notify('No answer');
    hangUp(true);
  }
}

async function openMesh(room, stream, media, group) {
  await startMesh({
    room,
    name: group ? 'group' : 'call',
    stream,
    onTrack: (_id, remote) => {
      if (!session) return;
      if (session.group) mountPeer(_id, remote);
      else playRemote(remote, media);
    },
  });
  return true;
}

function finish(status, tell) {
  setStatus(status);
  hangUp(tell);
}

function blankSession(extra) {
  return {
    pc: null,
    stream: null,
    convoId: '',
    peerDid: '',
    media: 'audio',
    announced: false,
    recordUri: '',
    rkey: '',
    room: '',
    mesh: false,
    group: false,
    startedAt: Date.now(),
    muted: false,
    cameraOff: false,
    rang: false,
    invite: '',
    targets: [],
    ...extra,
  };
}

export async function startCall({ convoId, peerDid, media }) {
  if (!canCall()) {
    notify('Calls need a secure page and a browser that can use the microphone.');
    return;
  }
  if (!convoId || !peerDid) return;
  if (session) await hangUp(true);
  else onClear();
  const token = ++epoch;
  let stream;
  try {
    stream = await mediaStream(media);
    const room = signalCode(12);
    const rkey = randomRkey();
    // The first poll can deliver a track before this function returns.
    session = blankSession({ mesh: true, room, stream, convoId, peerDid, media, rkey, invite: 'offer', targets: [peerDid] });
    let meshed = false;
    try {
      await openMesh(room, stream, media, false);
      meshed = true;
    } catch {
      await stopMesh();
      if (session?.room === room) session = null;
      meshed = false;
    }
    if (token !== epoch) {
      stream.getTracks().forEach((track) => track.stop());
      await stopMesh();
      if (session?.room === room) session = null;
      return;
    }
    if (meshed && session) {
      const local = $('call-local');
      if (local && media === 'video') local.srcObject = stream;
      showStage(media, false);
      setStatus(media === 'video' ? 'Starting video call…' : 'Calling…');
      session.rang = await publishRing(room, [peerDid], media, rkey, false);
      try {
        await sendLine(convoId, sentence('offer', media, rkey, room));
        if (session) session.announced = true;
      } catch {
        /* watch sends the line again */
      }
      if (token !== epoch || !session) return;
      setStatus('Ringing…');
      watch(token, convoId, peerDid, media, false);
      return;
    }
    const pc = new RTCPeerConnection(await iceConfig());
    session = blankSession({ pc, stream, convoId, peerDid, media });
    stream.getTracks().forEach((track) => pc.addTrack(track, stream));
    const local = $('call-local');
    if (local && media === 'video') local.srcObject = stream;
    attach(pc, media);
    showStage(media);
    setStatus(media === 'video' ? 'Starting video call…' : 'Calling…');
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    await waitForIce(pc);
    if (token !== epoch || !session) return;
    const announced = await announce(convoId, 'offer', media, pc.localDescription.sdp);
    if (token !== epoch || !session) {
      if (announced?.uri) api.deleteRecord(announced.uri).catch(() => {});
      return;
    }
    session.recordUri = announced.uri;
    session.rkey = announced.rkey;
    session.announced = true;
    setStatus('Ringing…');
    watch(token, convoId, peerDid, media, true);
  } catch (error) {
    const room = session?.room || '';
    stream?.getTracks?.().forEach((track) => track.stop());
    if (session?.pc) session.pc.close();
    if (session?.mesh) await stopMesh();
    session = null;
    withdrawRing(room);
    stopClock();
    paintCallControls();
    const dialog = $('call');
    if (dialog?.open) dialog.close();
    notify(error?.message || 'The call could not start.');
  }
}

export async function acceptCall({ convoId, peerDid, rkey, media, room }) {
  if (!canCall()) {
    notify('Calls need a secure page and a browser that can use the microphone.');
    return;
  }
  if (session) await hangUp(false);
  else onClear();
  const token = ++epoch;
  let stream;
  const chosen = media === 'video' ? 'video' : 'audio';
  if (room && /^[a-z2-9]{8,24}$/.test(room)) {
    try {
      stream = await mediaStream(chosen);
      session = blankSession({ mesh: true, room, stream, convoId, peerDid, media: chosen, rkey, invite: 'answer', rang: true });
      await openMesh(room, stream, chosen, false);
      if (token !== epoch) {
        stream.getTracks().forEach((track) => track.stop());
        await stopMesh();
        if (session?.room === room) session = null;
        return;
      }
      const local = $('call-local');
      if (local && chosen === 'video') local.srcObject = stream;
      showStage(chosen, false);
      setStatus('Connecting…');
      try {
        if (convoId) await sendLine(convoId, sentence('answer', chosen, rkey, room));
        if (session) session.announced = true;
      } catch {
        /* watch sends the line again */
      }
      if (token !== epoch || !session) return;
      watch(token, convoId, peerDid, chosen, false);
      return;
    } catch {
      stream?.getTracks?.().forEach((track) => track.stop());
      stream = null;
      await stopMesh();
      if (session?.room === room) session = null;
      if (token !== epoch) return;
    }
  }
  try {
    let createdAt = '';
    let sdp = '';
    try {
      const record = await api.getPublicRecord(peerDid, COLLECTION, rkey);
      const value = record?.value || {};
      if (value.sdp && value.sdpType === 'offer') {
        sdp = String(value.sdp);
        createdAt = value.createdAt || '';
      }
    } catch {
      sdp = '';
    }
    if (!sdp || !createdAt) {
      let messages = [];
      try {
        const data = await api.getConvo(convoId);
        messages = data?.messages || [];
      } catch {
        messages = [];
      }
      if (!messages.length) {
        const view = await api.getConvoView(convoId).catch(() => null);
        const last = view?.convo?.lastMessage;
        if (last) messages = [last];
      }
      if (!sdp) sdp = assembleCallSdp(messages, rkey, peerDid);
      if (!createdAt) createdAt = latestSignalTime(messages, rkey, peerDid);
    }
    if (!sdp) throw new Error('That call is missing its details.');
    const age = Date.now() - new Date(createdAt).getTime();
    if (!Number.isFinite(age) || age > FRESH_MS) throw new Error('That call has ended.');
    stream = await mediaStream(chosen);
    const pc = new RTCPeerConnection(await iceConfig());
    session = blankSession({ pc, stream, convoId, peerDid, media: chosen, rkey });
    stream.getTracks().forEach((track) => pc.addTrack(track, stream));
    const local = $('call-local');
    if (local && chosen === 'video') local.srcObject = stream;
    attach(pc, chosen);
    showStage(chosen);
    setStatus('Connecting…');
    await pc.setRemoteDescription({ type: 'offer', sdp });
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    await waitForIce(pc);
    if (token !== epoch || !session) return;
    const announced = await announce(convoId, 'answer', chosen, pc.localDescription.sdp);
    if (token !== epoch || !session) {
      if (announced?.uri) api.deleteRecord(announced.uri).catch(() => {});
      return;
    }
    session.recordUri = announced.uri;
    session.announced = true;
    watch(token, convoId, peerDid, chosen, false);
  } catch (error) {
    stream?.getTracks?.().forEach((track) => track.stop());
    if (session?.pc) session.pc.close();
    const room = session?.room || '';
    if (session?.mesh) await stopMesh();
    session = null;
    withdrawRing(room);
    stopClock();
    paintCallControls();
    const dialog = $('call');
    if (dialog?.open) dialog.close();
    notify(error?.message || 'The call could not be answered.');
  }
}

export async function startGroupCall({ convoId, media, dids }) {
  if (!canCall()) {
    notify('Calls need a secure page and a browser that can use the microphone.');
    return;
  }
  if (!convoId) return;
  if (session) await hangUp(true);
  else onClear();
  const token = ++epoch;
  const chosen = media === 'video' ? 'video' : 'audio';
  let stream;
  try {
    stream = await mediaStream(chosen);
    const room = signalCode(12);
    const rkey = randomRkey();
    const targets = (Array.isArray(dids) ? dids : []).filter((did) => typeof did === 'string' && did.startsWith('did:'));
    session = blankSession({ mesh: true, group: true, room, stream, convoId, media: chosen, rkey, invite: 'group', targets });
    await openMesh(room, stream, chosen, true);
    if (token !== epoch) {
      stream.getTracks().forEach((track) => track.stop());
      await stopMesh();
      if (session?.room === room) session = null;
      return;
    }
    const local = $('call-local');
    if (local && chosen === 'video') local.srcObject = stream;
    showStage(chosen, true);
    setStatus('Opening the room…');
    session.rang = await publishRing(room, targets, chosen, rkey, true);
    try {
      await sendLine(convoId, sentence('group', chosen, rkey, room));
      if (session) session.announced = true;
    } catch {
      /* watch sends the line again */
    }
    if (token !== epoch || !session) return;
    setStatus('Waiting for people…');
    watch(token, convoId, '', chosen, false);
  } catch (error) {
    const room = session?.room || '';
    stream?.getTracks?.().forEach((track) => track.stop());
    await stopMesh();
    session = null;
    withdrawRing(room);
    stopClock();
    const dialog = $('call');
    if (dialog?.open) dialog.close();
    notify(error?.message || 'The group call could not start.');
  }
}

export async function joinGroupCall({ convoId, rkey, media, room }) {
  if (!canCall()) {
    notify('Calls need a secure page and a browser that can use the microphone.');
    return;
  }
  if (!room) {
    notify('That group call has no room.');
    return;
  }
  if (session) await hangUp(false);
  else onClear();
  const token = ++epoch;
  const chosen = media === 'video' ? 'video' : 'audio';
  let stream;
  try {
    stream = await mediaStream(chosen);
    session = blankSession({ mesh: true, group: true, room, stream, convoId, media: chosen, rkey, announced: false });
    await openMesh(room, stream, chosen, true);
    if (token !== epoch) {
      stream.getTracks().forEach((track) => track.stop());
      await stopMesh();
      if (session?.room === room) session = null;
      return;
    }
    const local = $('call-local');
    if (local && chosen === 'video') local.srcObject = stream;
    showStage(chosen, true);
    setStatus('Joining…');
    watch(token, convoId, '', chosen, false);
  } catch (error) {
    stream?.getTracks?.().forEach((track) => track.stop());
    await stopMesh();
    session = null;
    stopClock();
    const dialog = $('call');
    if (dialog?.open) dialog.close();
    notify(error?.message || 'The group call could not be joined.');
  }
}

export async function declineCall(convoId, rkey, room = '') {
  withdrawRing(room);
  if (!convoId) return Boolean(room);
  try {
    await sendLine(convoId, sentence('decline', '', rkey));
    return true;
  } catch (error) {
    notify(error.message);
    return false;
  }
}

export async function hangUp(tell = true) {
  const current = session;
  epoch += 1;
  session = null;
  current?.stream?.getTracks?.().forEach((track) => track.stop());
  current?.pc?.close();
  if (current?.mesh) stopMesh();
  if (current?.room) withdrawRing(current.room);
  const remote = $('call-remote');
  const local = $('call-local');
  const audio = $('call-audio');
  const peers = $('call-peers');
  if (peers) {
    peers.replaceChildren();
    peers.hidden = true;
  }
  if (remote) remote.srcObject = null;
  if (local) {
    local.srcObject = null;
    local.classList.remove('is-off');
  }
  if (audio) audio.srcObject = null;
  const presence = $('call-presence');
  if (presence) {
    presence.dataset.presence = '';
    presence.replaceChildren();
  }
  stopClock();
  paintCallControls();
  const dialog = $('call');
  if (dialog?.open) dialog.close();
  if (tell && current?.convoId && (current.announced || current.rang || current.mesh)) {
    sendLine(current.convoId, sentence('end', current.media, current.rkey)).catch(() => {});
  }
  if (current?.recordUri) api.deleteRecord(current.recordUri).catch(() => {});
  onClear();
}

if (typeof document !== 'undefined') {
  document.getElementById('call-mute')?.addEventListener('click', () => { toggleCallMute(); });
  document.getElementById('call-camera')?.addEventListener('click', () => { toggleCallCamera(); });
}
