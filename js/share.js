import * as api from './api.js';
import { assembleShareSdp, messageSender, parseShareMessage } from './util.js';

const COLLECTION = 'com.libresky.share';
const ICE = [{ urls: ['stun:stun.l.google.com:19302', 'stun:stun.cloudflare.com:3478'] }];
const FRESH_MS = 10 * 60 * 1000;
const RKEY = /^[234567abcdefghijklmnopqrstuvwxyz]{13}$/;
const SDP_CHUNK = 900;
const FILE_CHUNK = 16 * 1024;
const MAX_BYTES = 20 * 1024 * 1024;

let notify = () => {};
let onFile = () => {};
let onStatus = () => {};
let session = null;
let epoch = 0;

export function setupShare(hooks) {
  notify = hooks.toast || notify;
  onFile = hooks.onFile || onFile;
  onStatus = hooks.onStatus || onStatus;
}

export function canShare() {
  return Boolean(window.isSecureContext && window.RTCPeerConnection);
}

export function isSharing() {
  return Boolean(session);
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
    if (parsed.kind === 'offer' && sender === peer && parsed.rkey) {
      offer = { ...parsed, sentAt: row.message.sentAt || '' };
      continue;
    }
    if (!offer || sender === me) continue;
    const same = !parsed.rkey || parsed.rkey === offer.rkey;
    if (parsed.kind === 'answer' || (same && (parsed.kind === 'decline' || parsed.kind === 'end'))) offer = null;
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
    const label = encodeURIComponent(String(name || 'file').slice(0, 80)) || 'file';
    return `Wants to send a file ${label} ${Number(size) || 0} ${link}`;
  }
  if (kind === 'answer') return `Accepted the file ${link}`;
  if (kind === 'decline') return `Declined the file ${link}`;
  return `File transfer ended ${link}`;
}

function waitIce(pc) {
  if (pc.iceGatheringState === 'complete') return Promise.resolve();
  return new Promise((resolve) => {
    const timer = setTimeout(resolve, 4000);
    pc.addEventListener('icegatheringstatechange', () => {
      if (pc.iceGatheringState === 'complete') {
        clearTimeout(timer);
        resolve();
      }
    });
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

function chunkSdp(rkey, sdp) {
  const packed = encodeSdp(sdp);
  const parts = [];
  for (let index = 0; index < packed.length; index += SDP_CHUNK) parts.push(packed.slice(index, index + SDP_CHUNK));
  if (parts.length > 24) throw new Error('The file details are too large for this chat.');
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
    await api.sendMessage(convoId, sentence(kind === 'offer' ? 'offer' : 'answer', rkey, extra.name, extra.size));
  } catch (error) {
    if (uri) api.deleteRecord(uri).catch(() => {});
    throw error;
  }
  api.markConvoRead(convoId).catch(() => {});
  return { uri, rkey };
}

function attachPc(pc, token) {
  pc.addEventListener('connectionstatechange', () => {
    if (!session || session.pc !== pc || token !== epoch) return;
    if (pc.connectionState === 'connected') onStatus(session.role === 'send' ? 'Connected. Sending…' : 'Connected. Receiving…');
    if (pc.connectionState === 'disconnected') onStatus('Reconnecting…');
    if (pc.connectionState === 'failed') {
      notify('The file could not connect. Some networks and HTTP proxies block it.');
      hangShare(true);
    }
  });
}

function bindChannel(channel, token) {
  if (!session) return;
  session.channel = channel;
  channel.binaryType = 'arraybuffer';
  channel.addEventListener('open', () => {
    if (token !== epoch || !session) return;
    if (session.role === 'send' && session.file) sendFile(token).catch((error) => {
      notify(error?.message || 'The file could not be sent.');
      hangShare(true);
    });
  });
  channel.addEventListener('close', () => {
    if (token !== epoch || !session) return;
    if (session.role === 'receive' && !session.done) {
      notify('The file transfer stopped.');
      hangShare(false);
    }
  });
  channel.addEventListener('error', () => {
    if (token !== epoch || !session) return;
    notify('The file transfer failed.');
    hangShare(true);
  });
  if (session.role === 'receive') {
    channel.addEventListener('message', (event) => {
      if (token !== epoch || !session) return;
      receiveChunk(event.data);
    });
  }
}

async function sendFile(token) {
  const current = session;
  const channel = current?.channel;
  const file = current?.file;
  if (!channel || !file || token !== epoch) return;
  onStatus(`Sending ${file.name}…`, 0);
  const meta = JSON.stringify({ t: 'meta', name: file.name, type: file.type || 'application/octet-stream', size: file.size });
  channel.send(meta);
  let offset = 0;
  while (offset < file.size) {
    if (token !== epoch || session !== current) return;
    while (channel.bufferedAmount > FILE_CHUNK * 32) await sleep(40);
    const slice = file.slice(offset, offset + FILE_CHUNK);
    const buf = await slice.arrayBuffer();
    if (token !== epoch || session !== current) return;
    channel.send(buf);
    offset += buf.byteLength;
    onStatus(`Sending ${file.name}…`, offset / file.size);
  }
  channel.send(JSON.stringify({ t: 'done' }));
  while (channel.bufferedAmount > 0 && token === epoch && session === current) await sleep(40);
  await sleep(250);
  if (token !== epoch || session !== current) return;
  onFile({ blob: file, name: file.name, type: file.type, size: file.size }, { mine: true });
  onStatus('');
  notify(`Sent ${file.name}`);
  hangShare(false);
}

function receiveChunk(data) {
  if (!session) return;
  if (typeof data === 'string') {
    let parsed;
    try { parsed = JSON.parse(data); } catch { return; }
    if (parsed?.t === 'meta') {
      const size = Number(parsed.size) || 0;
      if (size > MAX_BYTES) {
        notify('That file is too large.');
        hangShare(true);
        return;
      }
      session.meta = {
        name: String(parsed.name || 'file').slice(0, 180),
        type: String(parsed.type || 'application/octet-stream'),
        size,
      };
      session.chunks = [];
      session.got = 0;
      onStatus(`Receiving ${session.meta.name}…`, 0);
      return;
    }
    if (parsed?.t === 'done') {
      finishReceive();
    }
    return;
  }
  const bytes = data instanceof ArrayBuffer ? new Uint8Array(data) : new Uint8Array(data?.buffer || []);
  if (!bytes.length || !session.meta) return;
  session.chunks.push(bytes);
  session.got += bytes.length;
  const total = session.meta.size || 1;
  onStatus(`Receiving ${session.meta.name}…`, Math.min(1, session.got / total));
}

function finishReceive() {
  const current = session;
  if (!current?.meta || current.done) return;
  current.done = true;
  const size = current.got || 0;
  const bytes = new Uint8Array(size);
  let offset = 0;
  (current.chunks || []).forEach((part) => {
    bytes.set(part, offset);
    offset += part.length;
  });
  const blob = new Blob([bytes], { type: current.meta.type || 'application/octet-stream' });
  onFile({ blob, name: current.meta.name, type: current.meta.type, size: blob.size }, { mine: false });
  onStatus('');
  notify(`Received ${current.meta.name}`);
  hangShare(false);
}

async function watch(token, convoId, peerDid, wantAnswer) {
  for (let i = 0; i < 40 && token === epoch && session; i += 1) {
    await sleep(1500);
    if (token !== epoch || !session) return;
    let data;
    try { data = await api.getConvo(convoId); } catch { continue; }
    for (const message of data.messages || []) {
      if (messageSender(message) !== peerDid) continue;
      const parsed = parseShareMessage(message.text);
      if (!parsed) continue;
      const sent = new Date(message.sentAt || 0).getTime();
      if (!Number.isFinite(sent) || sent + 20000 < (session.startedAt || 0)) continue;
      if (parsed.kind === 'decline' || parsed.kind === 'end') {
        if (!session.rkey || parsed.rkey !== session.rkey) continue;
        notify(parsed.kind === 'decline' ? 'They declined the file.' : 'File transfer ended');
        hangShare(false);
        return;
      }
      if (wantAnswer && !session.pc.remoteDescription && parsed.kind === 'answer' && parsed.rkey) {
        try {
          const sdp = await readSdp(peerDid, parsed.rkey, convoId, data.messages);
          if (sdp) {
            await session.pc.setRemoteDescription({ type: 'answer', sdp });
            onStatus('Connecting…');
            wantAnswer = false;
          }
        } catch {
          /* the next poll can retry */
        }
      }
    }
  }
  if (token === epoch && session && wantAnswer && !session.pc.currentRemoteDescription && !session.pc.remoteDescription) {
    notify('No answer');
    hangShare(true);
  }
}

export async function startShare({ convoId, peerDid, file }) {
  if (!canShare()) {
    notify('Sending a file needs a secure page.');
    return;
  }
  if (!convoId || !peerDid || !file) return;
  if (file.size > MAX_BYTES) {
    notify(`Keep files under ${prettySize(MAX_BYTES)}.`);
    return;
  }
  if (session) await hangShare(true);
  const token = ++epoch;
  try {
    const pc = new RTCPeerConnection({ iceServers: ICE });
    session = {
      pc,
      convoId,
      peerDid,
      role: 'send',
      file,
      announced: false,
      recordUri: '',
      rkey: '',
      startedAt: Date.now(),
    };
    const channel = pc.createDataChannel('file', { ordered: true });
    bindChannel(channel, token);
    attachPc(pc, token);
    onStatus(`Waiting for them to accept ${file.name}…`);
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    await waitIce(pc);
    if (token !== epoch || !session) return;
    const announced = await announce(convoId, 'offer', pc.localDescription.sdp, {
      name: file.name,
      size: file.size,
      mime: file.type,
    });
    if (token !== epoch || !session) {
      if (announced?.uri) api.deleteRecord(announced.uri).catch(() => {});
      return;
    }
    session.recordUri = announced.uri;
    session.rkey = announced.rkey;
    session.announced = true;
    watch(token, convoId, peerDid, true);
  } catch (error) {
    if (session?.pc) session.pc.close();
    session = null;
    onStatus('');
    notify(error?.message || 'The file could not start.');
  }
}

export async function acceptShare({ convoId, peerDid, rkey }) {
  if (!canShare()) {
    notify('Sending a file needs a secure page.');
    return;
  }
  if (session) await hangShare(false);
  const token = ++epoch;
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
    if (!sdp) {
      const data = await api.getConvo(convoId);
      sdp = assembleShareSdp(data.messages, rkey, peerDid);
      const offer = (data.messages || []).find((message) => {
        const parsed = parseShareMessage(message?.text);
        return parsed?.kind === 'offer' && parsed.rkey === rkey && messageSender(message) === peerDid;
      });
      createdAt = offer?.sentAt || '';
    }
    if (!sdp) throw new Error('That file is missing its details.');
    const age = Date.now() - new Date(createdAt).getTime();
    if (!Number.isFinite(age) || age > FRESH_MS) throw new Error('That file offer has ended.');
    const pc = new RTCPeerConnection({ iceServers: ICE });
    session = {
      pc,
      convoId,
      peerDid,
      role: 'receive',
      announced: false,
      recordUri: '',
      rkey,
      startedAt: Date.now(),
      chunks: [],
      got: 0,
      done: false,
    };
    pc.addEventListener('datachannel', (event) => {
      if (token !== epoch || !session) return;
      bindChannel(event.channel, token);
    });
    attachPc(pc, token);
    onStatus('Connecting…');
    await pc.setRemoteDescription({ type: 'offer', sdp });
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    await waitIce(pc);
    if (token !== epoch || !session) return;
    const announced = await announce(convoId, 'answer', pc.localDescription.sdp);
    if (token !== epoch || !session) {
      if (announced?.uri) api.deleteRecord(announced.uri).catch(() => {});
      return;
    }
    session.recordUri = announced.uri;
    session.announced = true;
    watch(token, convoId, peerDid, false);
  } catch (error) {
    if (session?.pc) session.pc.close();
    session = null;
    onStatus('');
    notify(error?.message || 'The file could not be accepted.');
  }
}

export async function declineShare(convoId, rkey) {
  if (!convoId) return false;
  try {
    const text = RKEY.test(rkey || '') ? sentence('decline', rkey) : 'Declined the file';
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
  try { current?.channel?.close(); } catch { /* already closed */ }
  current?.pc?.close();
  onStatus('');
  if (tell && current?.announced && current.convoId) {
    const text = RKEY.test(current.rkey || '') ? sentence('end', current.rkey) : 'File transfer ended';
    api.sendMessage(current.convoId, text).catch(() => {});
    api.markConvoRead(current.convoId).catch(() => {});
  }
  if (current?.recordUri) api.deleteRecord(current.recordUri).catch(() => {});
}
