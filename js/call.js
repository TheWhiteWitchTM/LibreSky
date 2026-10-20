import * as api from './api.js';
import { assembleCallSdp, messageSender, parseCallMessage } from './util.js';

const COLLECTION = 'com.libresky.call';
const ICE = [{ urls: ['stun:stun.l.google.com:19302', 'stun:stun.cloudflare.com:3478'] }];
const FRESH_MS = 10 * 60 * 1000;
const RKEY = /^[234567abcdefghijklmnopqrstuvwxyz]{13}$/;
const CHUNK = 900;

let notify = () => {};
let session = null;
let epoch = 0;

export function setupCall(hooks) {
  notify = hooks.toast || notify;
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
    if (parsed.kind === 'offer' && sender === peer && parsed.rkey) {
      offer = { ...parsed, sentAt: row.message.sentAt || '' };
      continue;
    }
    if (!offer || sender === me) continue;
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

function callLink(rkey) {
  return `${location.origin}${location.pathname}#/c/${rkey}`;
}

function sentence(kind, media, rkey) {
  const link = callLink(rkey);
  if (kind === 'offer') return `Started a ${media === 'video' ? 'video' : 'voice'} call ${link}`;
  if (kind === 'answer') return `Joined the ${media === 'video' ? 'video' : 'voice'} call ${link}`;
  if (kind === 'decline') return `Declined the call ${link}`;
  return `Call ended ${link}`;
}

function setStatus(text) {
  const node = $('call-status');
  if (node) node.textContent = text;
}

function showStage(media) {
  const dialog = $('call');
  const remote = $('call-remote');
  const local = $('call-local');
  const voice = $('call-voice');
  const title = $('call-title');
  const video = media === 'video';
  if (remote) remote.hidden = !video;
  if (local) local.hidden = !video;
  if (voice) voice.hidden = video;
  if (title) title.textContent = video ? 'Video call' : 'Voice call';
  if (dialog) dialog.dataset.media = video ? 'video' : 'audio';
  if (dialog && !dialog.open) dialog.showModal();
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
  });
  pc.addEventListener('connectionstatechange', () => {
    if (!session || session.pc !== pc) return;
    if (pc.connectionState === 'connected') setStatus('Connected');
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

function chunkSdp(rkey, sdp) {
  const packed = encodeSdp(sdp);
  const parts = [];
  for (let index = 0; index < packed.length; index += CHUNK) parts.push(packed.slice(index, index + CHUNK));
  if (parts.length > 24) throw new Error('The call details are too large for this chat.');
  return parts.map((part, index) => `Call data ${rkey} ${index + 1}/${parts.length} ${part}`);
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
    if (!uri) {
      for (const line of chunkSdp(rkey, sdp)) await api.sendMessage(convoId, line);
    }
    await api.sendMessage(convoId, sentence(kind === 'offer' ? 'offer' : 'answer', media, rkey));
  } catch (error) {
    if (uri) api.deleteRecord(uri).catch(() => {});
    throw error;
  }
  api.markConvoRead(convoId).catch(() => {});
  return { uri, rkey };
}

async function watch(token, convoId, peerDid, media, wantAnswer) {
  for (let i = 0; i < 40 && token === epoch && session; i += 1) {
    await sleep(1500);
    if (token !== epoch || !session) return;
    let data;
    try { data = await api.getConvo(convoId); } catch { continue; }
    for (const message of data.messages || []) {
      if (messageSender(message) !== peerDid) continue;
      const parsed = parseCallMessage(message.text);
      if (!parsed) continue;
      const sent = new Date(message.sentAt || 0).getTime();
      if (!Number.isFinite(sent) || sent + 20000 < (session.startedAt || 0)) continue;
      if (parsed.kind === 'decline' || parsed.kind === 'end') {
        if (!session.rkey || parsed.rkey !== session.rkey) continue;
        return finish(parsed.kind === 'decline' ? 'Call declined' : 'Call ended', false);
      }
      if (wantAnswer && !session.pc.remoteDescription && parsed.kind === 'answer' && parsed.rkey && parsed.media === media) {
        try {
          const sdp = await readSdp(peerDid, parsed.rkey, convoId, data.messages);
          if (sdp) {
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
  if (token === epoch && session && wantAnswer && !session.pc.currentRemoteDescription && !session.pc.remoteDescription) {
    notify('No answer');
    hangUp(true);
  }
}

function finish(status, tell) {
  setStatus(status);
  hangUp(tell);
}

export async function startCall({ convoId, peerDid, media }) {
  if (!canCall()) {
    notify('Calls need a secure page and a browser that can use the microphone.');
    return;
  }
  if (!convoId || !peerDid) return;
  if (session) await hangUp(true);
  const token = ++epoch;
  let stream;
  try {
    stream = await mediaStream(media);
    const pc = new RTCPeerConnection({ iceServers: ICE });
    session = { pc, stream, convoId, peerDid, media, announced: false, recordUri: '', rkey: '', startedAt: Date.now() };
    stream.getTracks().forEach((track) => pc.addTrack(track, stream));
    const local = $('call-local');
    if (local && media === 'video') local.srcObject = stream;
    attach(pc, media);
    showStage(media);
    setStatus(media === 'video' ? 'Starting video call…' : 'Calling…');
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    await waitIce(pc);
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
    stream?.getTracks?.().forEach((track) => track.stop());
    if (session?.pc) session.pc.close();
    session = null;
    const dialog = $('call');
    if (dialog?.open) dialog.close();
    notify(error?.message || 'The call could not start.');
  }
}

export async function acceptCall({ convoId, peerDid, rkey, media }) {
  if (!canCall()) {
    notify('Calls need a secure page and a browser that can use the microphone.');
    return;
  }
  if (session) await hangUp(false);
  const token = ++epoch;
  let stream;
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
      sdp = assembleCallSdp(data.messages, rkey, peerDid);
      const offer = (data.messages || []).find((message) => {
        const parsed = parseCallMessage(message?.text);
        return parsed?.kind === 'offer' && parsed.rkey === rkey && messageSender(message) === peerDid;
      });
      createdAt = offer?.sentAt || '';
    }
    if (!sdp) throw new Error('That call is missing its details.');
    const age = Date.now() - new Date(createdAt).getTime();
    if (!Number.isFinite(age) || age > FRESH_MS) throw new Error('That call has ended.');
    stream = await mediaStream(media || 'audio');
    const chosen = media === 'video' ? 'video' : 'audio';
    const pc = new RTCPeerConnection({ iceServers: ICE });
    session = { pc, stream, convoId, peerDid, media: chosen, announced: false, recordUri: '', rkey, startedAt: Date.now() };
    stream.getTracks().forEach((track) => pc.addTrack(track, stream));
    const local = $('call-local');
    if (local && chosen === 'video') local.srcObject = stream;
    attach(pc, chosen);
    showStage(chosen);
    setStatus('Connecting…');
    await pc.setRemoteDescription({ type: 'offer', sdp });
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    await waitIce(pc);
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
    session = null;
    const dialog = $('call');
    if (dialog?.open) dialog.close();
    notify(error?.message || 'The call could not be answered.');
  }
}

export async function declineCall(convoId, rkey) {
  if (!convoId) return false;
  try {
    const text = RKEY.test(rkey || '') ? sentence('decline', '', rkey) : 'Declined the call';
    await api.sendMessage(convoId, text);
    api.markConvoRead(convoId).catch(() => {});
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
  const remote = $('call-remote');
  const local = $('call-local');
  const audio = $('call-audio');
  if (remote) remote.srcObject = null;
  if (local) local.srcObject = null;
  if (audio) audio.srcObject = null;
  const dialog = $('call');
  if (dialog?.open) dialog.close();
  if (tell && current?.announced && current.convoId) {
    const text = RKEY.test(current.rkey || '') ? sentence('end', current.media, current.rkey) : 'Call ended';
    api.sendMessage(current.convoId, text).catch(() => {});
    api.markConvoRead(current.convoId).catch(() => {});
  }
  if (current?.recordUri) api.deleteRecord(current.recordUri).catch(() => {});
}
