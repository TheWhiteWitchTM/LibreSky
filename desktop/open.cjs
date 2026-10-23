const crypto = require('crypto');
const fs = require('fs');
const http = require('http');
const os = require('os');
const path = require('path');

const PORT = 47823;
const TOKEN_PATH = path.join(os.homedir(), '.config', 'thewhitewitch', 'libresky.token');
const API_PATH = path.join(os.homedir(), '.local', 'state', 'libresky', 'api.json');

function piece(value) {
  let text = String(value || '');
  try {
    text = decodeURIComponent(text);
  } catch {
    return '';
  }
  if (!text || text.length > 80 || /[\\/?#\s]/.test(text) || text === '.' || text === '..') return '';
  return encodeURIComponent(text);
}

function routeOf(input) {
  const raw = String(input || '').trim();
  if (!raw || raw.length > 2000) return '';
  let handle = '';
  let rkey = '';
  if (raw.startsWith('#/')) {
    const parts = raw.slice(2).split('/').filter(Boolean);
    if (parts.length !== 4 || parts[0] !== 'profile' || parts[2] !== 'post') return '';
    handle = parts[1];
    rkey = parts[3];
  } else {
    let parsed;
    try {
      parsed = new URL(raw);
    } catch {
      return '';
    }
    if (parsed.username || parsed.password) return '';
    const host = parsed.hostname.toLowerCase();
    if (host === 'bsky.app' || host === 'www.bsky.app') {
      const parts = parsed.pathname.split('/').filter(Boolean);
      if (parts.length < 4 || parts[0] !== 'profile' || parts[2] !== 'post') return '';
      handle = parts[1];
      rkey = parts[3];
    } else if (host === 'thewhitewitchtm.github.io' && /\/LibreSky\/?$/.test(parsed.pathname)) {
      const parts = parsed.hash.replace(/^#\/?/, '').split('/').filter(Boolean);
      if (parts.length !== 4 || parts[0] !== 'profile' || parts[2] !== 'post') return '';
      handle = parts[1];
      rkey = parts[3];
    } else {
      return '';
    }
  }
  const who = piece(handle);
  const key = piece(rkey);
  if (!who || !key) return '';
  return `#/profile/${who}/post/${key}`;
}

function ensureToken() {
  fs.mkdirSync(path.dirname(TOKEN_PATH), { recursive: true });
  try {
    const found = fs.readFileSync(TOKEN_PATH, 'utf8').trim();
    if (found) return found;
  } catch {
    /* a new token is written below */
  }
  const token = crypto.randomBytes(32).toString('base64url');
  fs.writeFileSync(TOKEN_PATH, `${token}\n`, { mode: 0o600 });
  fs.chmodSync(TOKEN_PATH, 0o600);
  return token;
}

function bearerOk(header, token) {
  const prefix = 'Bearer ';
  const givenHeader = String(header || '');
  if (!givenHeader.startsWith(prefix) || !token) return false;
  const given = givenHeader.slice(prefix.length).trim();
  const left = Buffer.from(given);
  const right = Buffer.from(token);
  if (left.length !== right.length || left.length === 0) return false;
  return crypto.timingSafeEqual(left, right);
}

function hostOk(req) {
  const host = String(req.headers.host || '').split(':')[0].replace(/^\[|\]$/g, '').toLowerCase();
  return host === '127.0.0.1' || host === 'localhost';
}

function sendJson(res, code, payload) {
  const body = Buffer.from(JSON.stringify(payload));
  res.writeHead(code, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': String(body.length),
    'Cache-Control': 'no-store',
  });
  res.end(body);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    req.on('data', (chunk) => {
      size += chunk.length;
      if (size > 8000) {
        reject(new Error('Bad request.'));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on('end', () => {
      const raw = Buffer.concat(chunks).toString('utf8');
      if (!raw) {
        resolve({});
        return;
      }
      try {
        const data = JSON.parse(raw);
        if (!data || typeof data !== 'object' || Array.isArray(data)) reject(new Error('Bad request.'));
        else resolve(data);
      } catch {
        reject(new Error('Bad request.'));
      }
    });
    req.on('error', () => reject(new Error('Bad request.')));
  });
}

function writeApi() {
  fs.mkdirSync(path.dirname(API_PATH), { recursive: true });
  const tmp = `${API_PATH}.tmp`;
  fs.writeFileSync(tmp, `${JSON.stringify({ port: PORT, pid: process.pid })}\n`);
  fs.renameSync(tmp, API_PATH);
}

function startControl(bridge) {
  const token = ensureToken();
  const server = http.createServer(async (req, res) => {
    if (!hostOk(req)) {
      sendJson(res, 403, { ok: false, error: 'LibreSky only answers on this machine.' });
      return;
    }
    const url = new URL(req.url || '/', 'http://127.0.0.1');
    const pathname = url.pathname;
    if (req.method === 'GET' && pathname === '/v1/health') {
      sendJson(res, 200, { ok: true, name: 'LibreSky', client: true });
      return;
    }
    if (!bearerOk(req.headers.authorization, token)) {
      sendJson(res, 401, { ok: false, error: 'LibreSky refused the token.' });
      return;
    }
    try {
      if (req.method === 'GET' && pathname === '/v1/session') {
        const where = await bridge.where();
        sendJson(res, 200, { ok: true, name: 'LibreSky', hash: where.hash || '', title: where.title || '' });
        return;
      }
      if (req.method === 'POST' && pathname === '/v1/focus') {
        bridge.focus();
        sendJson(res, 200, { ok: true });
        return;
      }
      if (req.method === 'POST' && pathname === '/v1/open') {
        const body = await readBody(req);
        const hash = routeOf(body.url);
        if (!hash) {
          sendJson(res, 400, { ok: false, error: 'That is not a Bluesky post.' });
          return;
        }
        const opened = await bridge.open(hash);
        sendJson(res, opened && opened.ok ? 200 : 400, opened || { ok: false, error: 'LibreSky did not open that post.' });
        return;
      }
    } catch {
      sendJson(res, 400, { ok: false, error: 'Bad request.' });
      return;
    }
    sendJson(res, 404, { ok: false, error: 'No such LibreSky route.' });
  });
  server.requestTimeout = 15000;
  return new Promise((resolve) => {
    const giveUp = () => resolve(null);
    server.once('error', giveUp);
    server.listen(PORT, '127.0.0.1', () => {
      server.off('error', giveUp);
      try {
        writeApi();
      } catch {
        /* the fixed port is enough for Skye */
      }
      resolve(server);
    });
  });
}

function forgetApi() {
  try {
    fs.unlinkSync(API_PATH);
  } catch {
    /* already gone */
  }
}

function selfcheck() {
  const post = 'https://bsky.app/profile/thewhitewitchtm.sociallydead.me/post/3myh7xykfx52f';
  const hash = '#/profile/thewhitewitchtm.sociallydead.me/post/3myh7xykfx52f';
  if (routeOf(post) !== hash) throw new Error('bsky');
  if (routeOf(`https://thewhitewitchtm.github.io/LibreSky/${hash}`) !== hash) throw new Error('site');
  if (routeOf(hash) !== hash) throw new Error('hash');
  if (routeOf('https://evil.example/profile/a/post/b') !== '') throw new Error('foreign');
  if (routeOf('javascript:alert(1)') !== '') throw new Error('script');
  if (routeOf('https://bsky.app/profile/a%2F..%2F/post/abc') !== '') throw new Error('slash');
  if (routeOf('https://www.bsky.app/profile/someone.bsky.social/post/abc') !== '#/profile/someone.bsky.social/post/abc') {
    throw new Error('www');
  }
  console.log('open.cjs ok');
}

module.exports = { PORT, routeOf, startControl, forgetApi };

if (require.main === module) selfcheck();
