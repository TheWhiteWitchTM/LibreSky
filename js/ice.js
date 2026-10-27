const STUN_URLS = [
  'stun:stun.l.google.com:19302',
  'stun:stun1.l.google.com:19302',
  'stun:stun.cloudflare.com:3478',
  'stun:stun.cloudflare.com:443',
  'stun:global.stun.twilio.com:3478',
  'stun:stun.relay.metered.ca:80',
  'stun:stun.sipgate.net:3478',
];

const TURN_USER = 'openrelayproject';
const TURN_PASS = 'openrelayproject';
const TURN_HOSTS = ['global.relay.metered.ca', 'standard.relay.metered.ca'];

let certsPromise = null;
let warm = null;
let warmAt = 0;
let warming = null;

export function stunServers() {
  return STUN_URLS.map((urls) => ({ urls }));
}

export function turnServers() {
  return TURN_HOSTS.map((host) => ({
    username: TURN_USER,
    credential: TURN_PASS,
    urls: [
      `turn:${host}:80`,
      `turn:${host}:80?transport=tcp`,
      `turn:${host}:443`,
      `turns:${host}:443?transport=tcp`,
    ],
  }));
}

function certificates() {
  const gen = globalThis.RTCPeerConnection?.generateCertificate;
  if (typeof gen !== 'function') return Promise.resolve(undefined);
  if (!certsPromise) {
    certsPromise = gen.call(globalThis.RTCPeerConnection, { name: 'ECDSA', namedCurve: 'P-256' })
      .then((cert) => [cert])
      .catch(() => undefined);
  }
  return certsPromise;
}

export async function iceConfig({ policy = 'all' } = {}) {
  const config = {
    iceServers: [...stunServers(), ...turnServers()],
    iceTransportPolicy: policy === 'relay' ? 'relay' : 'all',
    bundlePolicy: 'max-bundle',
    rtcpMuxPolicy: 'require',
    iceCandidatePoolSize: policy === 'relay' ? 0 : 2,
  };
  const certs = await certificates();
  if (certs?.length) config.certificates = certs;
  return config;
}

export function sdpFacts(sdp) {
  const facts = { relay: false, relayTcp: false, srflx: false, host: false };
  String(sdp || '').split(/\r?\n/).forEach((line) => {
    if (!line.startsWith('a=candidate:')) return;
    if (line.includes(' typ relay')) {
      facts.relay = true;
      if (line.includes(' tcp ') || /\s443\s/.test(line)) facts.relayTcp = true;
    } else if (line.includes(' typ srflx')) facts.srflx = true;
    else if (line.includes(' typ host')) facts.host = true;
  });
  return facts;
}

export function waitForIce(pc, { timeout = 8000, min = 2200 } = {}) {
  if (!pc || pc.iceGatheringState === 'complete') return Promise.resolve();
  return new Promise((resolve) => {
    const started = Date.now();
    const timer = setTimeout(finish, timeout);
    const tick = setInterval(() => {
      if (pc.iceGatheringState === 'complete') {
        finish();
        return;
      }
      const facts = sdpFacts(pc.localDescription?.sdp);
      const elapsed = Date.now() - started;
      if (facts.relayTcp && elapsed >= 600) finish();
      else if ((facts.relay || facts.srflx) && elapsed >= min) finish();
    }, 200);
    function finish() {
      clearTimeout(timer);
      clearInterval(tick);
      pc.removeEventListener('icegatheringstatechange', onState);
      resolve();
    }
    function onState() {
      if (pc.iceGatheringState === 'complete') finish();
    }
    pc.addEventListener('icegatheringstatechange', onState);
  });
}

export function warmIce() {
  if (warm || warming || !globalThis.RTCPeerConnection) return warming || Promise.resolve();
  warming = iceConfig().then((config) => {
    warming = null;
    if (warm) return;
    try {
      warm = new RTCPeerConnection(config);
      warmAt = Date.now();
    } catch {
      warm = null;
    }
  }).catch(() => {
    warming = null;
  });
  return warming;
}

export async function takePeer() {
  if (warm && Date.now() - warmAt < 45000) {
    const pc = warm;
    warm = null;
    warmAt = 0;
    warmIce();
    return pc;
  }
  return new RTCPeerConnection(await iceConfig());
}
