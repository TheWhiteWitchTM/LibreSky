import * as api from './api.js';
import { takePeer, waitForIce } from './ice.js';
import { assembleShareSdp, messageSender, parseShareMessage } from './util.js';

const COLLECTION = 'com.libresky.share';
const FRESH_MS = 10 * 60 * 1000;
const RKEY = /^[234567abcdefghijklmnopqrstuvwxyz]{13}$/;
const SDP_CHUNK = 900;
const FILE_CHUNK = 16 * 1024;
const BUFFER_HIGH = 1024 * 1024;
const MAX_BYTES = 20 * 1024 * 1024;
const ANSWER_MS = 45 * 1000;

let notify = () => {};
let onFile = () => {};
let onStatus = () => {};
let onPhase = () => {};
let session = null;
let epoch = 0;

export function setupShare(hooks) {
  notify = hooks.toast || notify;
  onFile = hooks.onFile || onFile;
  onStatus = hooks.onStatus || onStatus;
  onPhase = hooks.onPhase || onPhase;
}

export function canShare() {
  return Boolean(window.isSecureContext && window.RTCPeerConnection);
}

export function isSharing() {
  return Boolean(session);
}

export function sharePhase() {
  if (!session) return 'off';
  return session.ready ? 'locked' : 'locking';
}

export function sharePeer() {
  if (!session) return null;
  return { peerDid: session.peerDid || '', convoId: session.convoId || '' };
}

export function shareLabel() {
  if (!session) return '';
  return session.label || (session.ready ? 'Direct session' : 'Waiting for them to lock the session…');
}

export function shareProgress() {
  return session?.progress;
}

export function prettySize(bytes) {
  const n = Math.max(0, Number(bytes) || 0);
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${Math.round(n / 1024)} KB`;
  return `${(n / (1024 * 1024)).toFixed(n >= 10 * 1024 * 1024 ? 0 : 1)} MB`;
}

export function incomingShare(messages, me, peer) {
  if (!peer) return null;
  const rows = (messages || []).map((message) => ({ message, parsed: parseShareMessage(message?.text) })).filter((row) => row.parsed);
  rows.sort((a, b) => String(a.message?.sentAt || '').localeCompare(String(b.message?.sentAt || '')));
  let offer = null;
  for (const row of rows) {
    const parsed = row.parsed;
    const sender = messageSender(row.message);
    if ((parsed.kind === 'offer' || parsed.kind === 'restart') && sender === peer && parsed.rkey) {
      offer = { ...parsed, sentAt: row.message.sentAt || '' };
      continue;
    }
    if (!offer || (sender !== peer && sender !== me)) continue;
    if (parsed.kind === 'answer' || parsed.kind === 'restarted' || parsed.kind === 'decline' || parsed.kind === 'end') offer = null;
  }
  if (!offer) return null;
  const then = new Date(offer.sentAt).getTime();
  if (!Number.isFinite(then) || Date.now() - then > FRESH_MS) return null;
  return offer;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function shareLink(rkey) {
  return `${location.origin}${location.pathname}#/f/${rkey}`;
}

function sentence(kind, rkey, name = '', size = 0) {
  const link = shareLink(rkey);
  if (kind === 'offer') {
    if (name) {
      const label = encodeURIComponent(String(name || 'file').slice(0, 80)) || 'file';
      return `Wants to send a file ${label} ${Number(size) || 0} ${link}`;
    }
    return `Wants a direct session ${link}`;
  }
  if (kind === 'answer') return name ? `Accepted the file ${link}` : `Locked the session ${link}`;
  if (kind === 'decline') return name ? `Declined the file ${link}` : `Declined the session ${link}`;
  if (kind === 'restart') return `Updates the session ${link}`;
  if (kind === 'restarted') return `Updated the session ${link}`;
  return name ? `File transfer ended ${link}` : `Session ended ${link}`;
}

function status(text, progress) {
  if (session) {
    session.label = text || '';
    session.progress = progress;
  }
  onStatus(text, progress);
}

function phase(next) {
  onPhase(next || sharePhase());
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

function chunkSdp(rkey, sdp) {
  const packed = encodeSdp(sdp);
  const parts = [];
  for (let index = 0; index < packed.length; index += SDP_CHUNK) parts.push(packed.slice(index, index + SDP_CHUNK));
  if (parts.length > 24) throw new Error('The session details are too large for this chat.');
  return parts.map((part, index) => `File data ${rkey} ${index + 1}/${parts.length} ${part}`);
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
  return assembleShareSdp(list, rkey, peerDid);
}

async function announce(convoId, kind, sdp, extra = {}) {
  let uri = '';
  let rkey = '';
  try {
    const created = await api.createShareSignal({
      $type: COLLECTION,
      convoId,
      sdpType: kind,
      sdp,
      name: extra.name || '',
      size: extra.size || 0,
      mime: extra.mime || '',
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
    if (!uri) {
      for (const line of chunkSdp(rkey, sdp)) await api.sendMessage(convoId, line);
    }
    await api.sendMessage(convoId, sentence(kind, rkey, extra.name, extra.size));
  } catch (error) {
    if (uri) api.deleteRecord(uri).catch(() => {});
    throw error;
  }
  api.markConvoRead(convoId).catch(() => {});
  return { uri, rkey };
}

function clearDrop() {
  if (!session?.dropTimer) return;
  clearTimeout(session.dropTimer);
  session.dropTimer = 0;
}

function clearPing() {
  if (!session?.pingTimer) return;
  clearInterval(session.pingTimer);
  session.pingTimer = 0;
}

function armPing(token) {
  clearPing();
  if (!session) return;
  session.pingTimer = setInterval(() => {
    const channel = session?.channel;
    if (token !== epoch || !session || !channel || channel.readyState !== 'open' || session.sending) return;
    try { channel.send(JSON.stringify({ t: 'ping' })); } catch { /* the next tick can retry */ }
  }, 4000);
}

function attachPc(pc, token) {
  pc.addEventListener('connectionstatechange', () => {
    if (!session || session.pc !== pc || token !== epoch) return;
    const state = pc.connectionState;
    if (state === 'connected' || state === 'connecting') clearDrop();
    if (state === 'connected' && !session.ready) status(session.ready ? 'Direct session' : 'Connecting…');
    if (state === 'disconnected') {
      status('Reconnecting…');
      clearDrop();
      session.dropTimer = setTimeout(() => {
        if (token !== epoch || !session || session.pc !== pc) return;
        const now = pc.connectionState;
        if (now === 'disconnected' || now === 'failed') refreshIce(token);
      }, 5000);
    }
    if (state === 'failed') refreshIce(token);
  });
}

function drain(channel) {
  if (!channel || channel.readyState !== 'open' || channel.bufferedAmount < BUFFER_HIGH) return Promise.resolve();
  channel.bufferedAmountLowThreshold = 256 * 1024;
  return new Promise((resolve) => {
    const done = () => {
      channel.removeEventListener('bufferedamountlow', done);
      channel.removeEventListener('close', done);
      resolve();
    };
    channel.addEventListener('bufferedamountlow', done);
    channel.addEventListener('close', done);
  });
}

function bindChannel(channel, token) {
  if (!session) return;
  session.channel = channel;
  channel.binaryType = 'arraybuffer';
  channel.bufferedAmountLowThreshold = 256 * 1024;
  channel.addEventListener('open', () => {
    if (token !== epoch || !session) return;
    session.ready = true;
    clearDrop();
    armPing(token);
    status('Direct session');
    phase('locked');
    pump(token);
  });
  channel.addEventListener('close', () => {
    if (token !== epoch || !session || session.channel !== channel) return;
    if (session.oneshot || session.refreshing) return;
    if (session.ready) refreshIce(token);
  });
  channel.addEventListener('error', () => {
    if (token !== epoch || !session) return;
    if (session.ready) return;
    notify('The direct session failed.');
    hangShare(true);
  });
  channel.addEventListener('message', (event) => {
    if (token !== epoch || !session) return;
    onPipeMessage(event.data, token);
  });
}

function onPipeMessage(data, token) {
  if (!session || token !== epoch) return;
  if (typeof data === 'string') {
    let parsed;
    try { parsed = JSON.parse(data); } catch { return; }
    if (parsed?.t === 'ping' || parsed?.t === 'pong') return;
    if (parsed?.t === 'meta') {
      const size = Number(parsed.size) || 0;
      if (size > MAX_BYTES) {
        notify('That file is too large.');
        if (session.oneshot) hangShare(true);
        return;
      }
      session.meta = {
        id: String(parsed.id || ''),
        name: String(parsed.name || 'file').slice(0, 180),
        type: String(parsed.type || 'application/octet-stream'),
        size,
      };
      session.chunks = [];
      session.got = 0;
      status(`Receiving ${session.meta.name}…`, 0);
      return;
    }
    if (parsed?.t === 'done') finishReceive(token);
    if (parsed?.t === 'abort') {
      session.meta = null;
      session.chunks = [];
      session.got = 0;
      status(session.ready ? 'Direct session' : '');
    }
    return;
  }
  const bytes = data instanceof ArrayBuffer ? new Uint8Array(data) : new Uint8Array(data?.buffer || []);
  if (!bytes.length || !session.meta) return;
  session.chunks.push(bytes);
  session.got += bytes.length;
  const total = session.meta.size || 1;
  status(`Receiving ${session.meta.name}…`, Math.min(1, session.got / total));
}

function finishReceive(token) {
  const current = session;
  if (!current?.meta || token !== epoch) return;
  const meta = current.meta;
  const size = current.got || 0;
  if (meta.size && size !== meta.size) {
    notify('The file arrived incomplete.');
    current.meta = null;
    current.chunks = [];
    current.got = 0;
    status(current.ready ? 'Direct session' : '');
    if (current.oneshot) hangShare(true);
    return;
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  (current.chunks || []).forEach((part) => {
    bytes.set(part, offset);
    offset += part.length;
  });
  const blob = new Blob([bytes], { type: meta.type || 'application/octet-stream' });
  current.meta = null;
  current.chunks = [];
  current.got = 0;
  onFile({ blob, name: meta.name, type: meta.type, size: blob.size }, { mine: false });
  notify(`Received ${meta.name}`);
  if (current.oneshot) {
    hangShare(false);
    return;
  }
  status('Direct session');
}

async function pump(token) {
  const current = session;
  if (!current || current.sending || token !== epoch) return;
  const file = current.queue?.[0];
  if (!file) return;
  if (!current.channel || current.channel.readyState !== 'open') return;
  current.queue.shift();
  current.sending = true;
  try {
    await sendOne(token, file);
  } catch (error) {
    if (token === epoch && session) {
      session.queue = [];
      try { session.channel?.send(JSON.stringify({ t: 'abort' })); } catch { /* the channel may already be closed */ }
      notify(error?.message || 'The file could not be sent.');
    }
  } finally {
    if (session && token === epoch) {
      session.sending = false;
      if (!session.queue?.length && session.ready) status('Direct session');
    }
  }
  if (token === epoch && session?.queue?.length) pump(token);
}

async function sendOne(token, file) {
  const current = session;
  const channel = current?.channel;
  if (!channel || !file || token !== epoch) return;
  status(`Sending ${file.name}…`, 0);
  const id = randomRkey();
  channel.send(JSON.stringify({
    t: 'meta',
    id,
    name: file.name,
    type: file.type || 'application/octet-stream',
    size: file.size,
  }));
  let offset = 0;
  while (offset < file.size) {
    if (token !== epoch || session !== current || channel.readyState !== 'open') return;
    await drain(channel);
    if (token !== epoch || session !== current) return;
    const slice = file.slice(offset, offset + FILE_CHUNK);
    const buf = await slice.arrayBuffer();
    if (token !== epoch || session !== current || channel.readyState !== 'open') return;
    channel.send(buf);
    offset += buf.byteLength;
    status(`Sending ${file.name}…`, offset / file.size);
  }
  if (token !== epoch || session !== current || channel.readyState !== 'open') return;
  channel.send(JSON.stringify({ t: 'done', id }));
  await drain(channel);
  let idle = 0;
  while (channel.bufferedAmount > 0 && token === epoch && session === current && channel.readyState === 'open') {
    const before = channel.bufferedAmount;
    await sleep(40);
    idle = channel.bufferedAmount >= before ? idle + 40 : 0;
    if (idle > 15000) throw new Error('The file stalled.');
  }
  if (token !== epoch || session !== current) return;
  onFile({ blob: file, name: file.name, type: file.type, size: file.size }, { mine: true });
  notify(`Sent ${file.name}`);
  if (current.oneshot) {
    await sleep(250);
    if (token === epoch && session === current) hangShare(false);
    return;
  }
  status('Direct session');
}

async function refreshIce(token) {
  const current = session;
  if (!current || token !== epoch || current.refreshing) return;
  if (current.refreshed || !current.pc || current.pc.connectionState === 'closed' || current.pc.signalingState === 'closed') {
    notify('The direct session could not stay connected.');
    hangShare(true);
    return;
  }
  current.refreshing = true;
  current.refreshed = true;
  status('Reconnecting…');
  try {
    if (typeof current.pc.restartIce === 'function') current.pc.restartIce();
    const offer = await current.pc.createOffer({ iceRestart: true });
    await current.pc.setLocalDescription(offer);
    await waitForIce(current.pc);
    if (token !== epoch || session !== current) return;
    const announced = await announce(current.convoId, 'restart', current.pc.localDescription.sdp);
    if (token !== epoch || session !== current) {
      if (announced?.uri) api.deleteRecord(announced.uri).catch(() => {});
      return;
    }
    if (current.recordUri) api.deleteRecord(current.recordUri).catch(() => {});
    current.recordUri = announced.uri;
    current.restartRkey = announced.rkey;
  } catch {
    if (token === epoch && session === current) {
      notify('The direct session could not stay connected.');
      hangShare(true);
    }
  } finally {
    if (session === current) current.refreshing = false;
  }
}

async function applyRestart(token, peerDid, rkey, convoId, messages) {
  const current = session;
  if (!current || token !== epoch || !current.pc || current.pc.signalingState !== 'stable') return;
  const sdp = await readSdp(peerDid, rkey, convoId, messages);
  if (!sdp || token !== epoch || session !== current) return;
  await current.pc.setRemoteDescription({ type: 'offer', sdp });
  const answer = await current.pc.createAnswer();
  await current.pc.setLocalDescription(answer);
  await waitForIce(current.pc, { timeout: 3500, min: 800 });
  if (token !== epoch || session !== current) return;
  const announced = await announce(convoId, 'restarted', current.pc.localDescription.sdp);
  if (token !== epoch || session !== current) {
    if (announced?.uri) api.deleteRecord(announced.uri).catch(() => {});
  }
}

async function watch(token) {
  let ticks = 0;
  while (token === epoch && session) {
    await sleep(1500);
    if (token !== epoch || !session) return;
    ticks += 1;
    const current = session;
    if (!current.pc?.remoteDescription && !current.pc?.currentRemoteDescription && Date.now() - current.startedAt > ANSWER_MS && current.role === 'offer') {
      notify('No answer');
      hangShare(true);
      return;
    }
    if (ticks > 400) return;
    let data;
    try { data = await api.getConvo(current.convoId); } catch { continue; }
    const messages = data.messages || [];
    for (const message of messages) {
      if (token !== epoch || session !== current) return;
      if (messageSender(message) !== current.peerDid) continue;
      const parsed = parseShareMessage(message.text);
      if (!parsed) continue;
      const sent = new Date(message.sentAt || 0).getTime();
      if (!Number.isFinite(sent)) continue;
      const freshOffer = parsed.kind === 'offer' || parsed.kind === 'restart';
      if (freshOffer) {
        if (Date.now() - sent > FRESH_MS) continue;
      } else if (sent + 20000 < (current.startedAt || 0)) continue;
      if (parsed.kind === 'decline' || parsed.kind === 'end') {
        if (!current.rkey || parsed.rkey !== current.rkey) continue;
        notify(parsed.kind === 'decline' ? 'They declined the session.' : 'Direct session ended');
        hangShare(false);
        return;
      }
      if (parsed.kind === 'offer' && parsed.rkey && parsed.rkey !== current.rkey && !current.pc.remoteDescription && !current.yielded) {
        if (String(current.me || '') < String(current.peerDid || '')) {
          await yieldTo(parsed.rkey);
          return;
        }
        continue;
      }
      if (parsed.kind === 'restart' && parsed.rkey && current.ready) {
        try {
          await applyRestart(token, current.peerDid, parsed.rkey, current.convoId, messages);
        } catch {
          /* the next poll can retry */
        }
        continue;
      }
      const firstAnswer = current.role === 'offer' && !current.gotAnswer && !current.pc.remoteDescription && parsed.kind === 'answer' && parsed.rkey;
      const restartAnswer = current.restartRkey && !current.gotRestart && parsed.rkey === current.restartRkey && (parsed.kind === 'restarted' || parsed.kind === 'answer');
      if (!firstAnswer && !restartAnswer) continue;
      if (firstAnswer) current.gotAnswer = true;
      if (restartAnswer) current.gotRestart = true;
      try {
        const sdp = await readSdp(current.peerDid, parsed.rkey, current.convoId, messages);
        if (sdp && token === epoch && session === current) {
          await current.pc.setRemoteDescription({ type: 'answer', sdp });
          status(current.ready ? 'Direct session' : 'Connecting…');
        }
      } catch {
        /* the next poll can retry */
      }
    }
  }
}

async function yieldTo(theirRkey) {
  const current = session;
  if (!current || current.yielded) return;
  current.yielded = true;
  const { convoId, peerDid, me, rkey } = current;
  if (rkey) api.sendMessage(convoId, sentence('end', rkey)).catch(() => {});
  current.announced = false;
  await hangShare(false);
  await acceptShare({ convoId, peerDid, rkey: theirRkey, me, legacy: false });
}

function failStart(error) {
  if (session?.pc) {
    try { session.pc.close(); } catch { /* already closed */ }
  }
  clearPing();
  clearDrop();
  session = null;
  status('');
  phase('off');
  notify(error?.message || 'The direct session could not start.');
}

export async function openShare({ convoId, peerDid, me }) {
  if (!canShare()) {
    notify('A direct session needs a secure page.');
    return;
  }
  if (!convoId || !peerDid) return;
  if (session?.peerDid === peerDid && session?.convoId === convoId) return;
  if (session) await hangShare(true);
  const token = ++epoch;
  try {
    const pc = await takePeer();
    session = {
      pc,
      convoId,
      peerDid,
      me: me || '',
      role: 'offer',
      file: null,
      announced: false,
      recordUri: '',
      rkey: '',
      startedAt: Date.now(),
      ready: false,
      oneshot: false,
      queue: [],
      chunks: [],
      got: 0,
      label: '',
      token,
    };
    const channel = pc.createDataChannel('pipe', { ordered: true });
    bindChannel(channel, token);
    attachPc(pc, token);
    status('Waiting for them to lock the session…');
    phase('locking');
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    await waitForIce(pc);
    if (token !== epoch || !session) return;
    const announced = await announce(convoId, 'offer', pc.localDescription.sdp);
    if (token !== epoch || !session) {
      if (announced?.uri) api.deleteRecord(announced.uri).catch(() => {});
      return;
    }
    session.recordUri = announced.uri;
    session.rkey = announced.rkey;
    session.announced = true;
    watch(token);
  } catch (error) {
    if (token === epoch) failStart(error);
  }
}

export function sendShareFile(file) {
  if (!session?.ready || session.channel?.readyState !== 'open') {
    notify('Lock the session first.');
    return false;
  }
  if (!file) return false;
  if (file.size > MAX_BYTES) {
    notify(`Keep files under ${prettySize(MAX_BYTES)}.`);
    return false;
  }
  session.queue = session.queue || [];
  session.queue.push(file);
  pump(session.token);
  return true;
}

export async function acceptShare({ convoId, peerDid, rkey, me, legacy = false }) {
  if (!canShare()) {
    notify('A direct session needs a secure page.');
    return;
  }
  if (session) await hangShare(false);
  const token = ++epoch;
  try {
    let createdAt = '';
    let sdp = '';
    let legacyFile = Boolean(legacy);
    try {
      const record = await api.getPublicRecord(peerDid, COLLECTION, rkey);
      const value = record?.value || {};
      if (value.sdp && (value.sdpType === 'offer' || value.sdpType === 'restart')) {
        sdp = String(value.sdp);
        createdAt = value.createdAt || '';
        if (value.name) legacyFile = true;
      }
    } catch {
      sdp = '';
    }
    if (!sdp) {
      const data = await api.getConvo(convoId);
      sdp = assembleShareSdp(data.messages, rkey, peerDid);
      const offer = (data.messages || []).find((message) => {
        const parsed = parseShareMessage(message?.text);
        return (parsed?.kind === 'offer' || parsed?.kind === 'restart') && parsed.rkey === rkey && messageSender(message) === peerDid;
      });
      createdAt = offer?.sentAt || '';
      const parsed = parseShareMessage(offer?.text);
      if (parsed?.name) legacyFile = true;
    }
    if (!sdp) throw new Error('That session is missing its details.');
    const age = Date.now() - new Date(createdAt).getTime();
    if (!Number.isFinite(age) || age > FRESH_MS) throw new Error('That session offer has ended.');
    const pc = await takePeer();
    session = {
      pc,
      convoId,
      peerDid,
      me: me || '',
      role: 'answer',
      announced: false,
      recordUri: '',
      rkey,
      startedAt: Date.now(),
      ready: false,
      oneshot: legacyFile,
      queue: [],
      chunks: [],
      got: 0,
      label: '',
      token,
    };
    pc.addEventListener('datachannel', (event) => {
      if (token !== epoch || !session) return;
      bindChannel(event.channel, token);
    });
    attachPc(pc, token);
    status('Connecting…');
    phase('locking');
    await pc.setRemoteDescription({ type: 'offer', sdp });
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    await waitForIce(pc);
    if (token !== epoch || !session) return;
    const announced = await announce(convoId, 'answer', pc.localDescription.sdp, legacyFile ? { name: 'file' } : {});
    if (token !== epoch || !session) {
      if (announced?.uri) api.deleteRecord(announced.uri).catch(() => {});
      return;
    }
    session.recordUri = announced.uri;
    session.announced = true;
    watch(token);
  } catch (error) {
    if (token === epoch) failStart(error);
  }
}

export async function declineShare(convoId, rkey) {
  if (!convoId) return false;
  try {
    const text = RKEY.test(rkey || '') ? sentence('decline', rkey) : 'Declined the session';
    await api.sendMessage(convoId, text);
    api.markConvoRead(convoId).catch(() => {});
    return true;
  } catch (error) {
    notify(error.message);
    return false;
  }
}

export async function hangShare(tell = true) {
  const current = session;
  epoch += 1;
  session = null;
  clearTimeout(current?.dropTimer);
  clearInterval(current?.pingTimer);
  try { current?.channel?.close(); } catch { /* already closed */ }
  try { current?.pc?.close(); } catch { /* already closed */ }
  status('');
  phase('off');
  if (tell && current?.announced && current.convoId) {
    const text = RKEY.test(current.rkey || '') ? sentence('end', current.rkey, current.oneshot ? 'file' : '') : (current.oneshot ? 'File transfer ended' : 'Session ended');
    api.sendMessage(current.convoId, text).catch(() => {});
    api.markConvoRead(current.convoId).catch(() => {});
  }
  if (current?.recordUri) api.deleteRecord(current.recordUri).catch(() => {});
}
