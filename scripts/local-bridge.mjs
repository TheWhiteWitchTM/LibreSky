// Lets the LibreSky website ask the models on this computer.
// Chrome blocks a public https page from reading Ollama directly, so this
// loopback bridge answers for it and forwards the chat.
import http from 'node:http';

const PORT = 47320;
const HOST = '127.0.0.1';
const UPSTREAMS = [
  { origin: 'http://127.0.0.1:11434', base: 'http://127.0.0.1:11434/v1', tags: true, runtime: 'Ollama', api: 'ollama' },
  { origin: 'http://127.0.0.1:1234', base: 'http://127.0.0.1:1234/v1', runtime: 'LM Studio', api: 'openai' },
  { origin: 'http://127.0.0.1:8080', base: 'http://127.0.0.1:8080/v1', runtime: 'Local server', api: 'openai' },
  { origin: 'http://127.0.0.1:1337', base: 'http://127.0.0.1:1337/v1', runtime: 'Jan', api: 'openai' },
  { origin: 'http://127.0.0.1:4891', base: 'http://127.0.0.1:4891/v1', runtime: 'GPT4All', api: 'openai' },
  { origin: 'http://127.0.0.1:12434', base: 'http://127.0.0.1:12434/v1', runtime: 'Docker Model Runner', api: 'openai' },
  { origin: 'http://127.0.0.1:5000', base: 'http://127.0.0.1:5000/v1', runtime: 'Local server', api: 'openai' },
  { origin: 'http://127.0.0.1:5001', base: 'http://127.0.0.1:5001/v1', runtime: 'KoboldCpp', api: 'openai' },
  { origin: 'http://127.0.0.1:8000', base: 'http://127.0.0.1:8000/v1', runtime: 'vLLM', api: 'openai' },
  { origin: 'http://127.0.0.1:7860', base: 'http://127.0.0.1:7860/v1', runtime: 'Text generation web UI', api: 'openai' },
];

let cache = { at: 0, models: [], routes: new Map(), runtime: '', api: '' };

function originOk(origin) {
  if (!origin) return true;
  try {
    const url = new URL(origin);
    const host = url.hostname.replace(/^\[|\]$/g, '');
    const local = host === '127.0.0.1' || host === 'localhost' || host === '::1';
    if (local && (url.protocol === 'http:' || url.protocol === 'https:')) return true;
    return url.protocol === 'https:' && host === 'thewhitewitchtm.github.io';
  } catch {
    return false;
  }
}

function writeCors(req, res) {
  const origin = req.headers.origin;
  if (origin && originOk(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
  }
  res.setHeader('Access-Control-Allow-Private-Network', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type, Accept');
  res.setHeader('Access-Control-Max-Age', '600');
  res.setHeader('Private-Network-Access-Name', 'LibreSky');
  res.setHeader('Private-Network-Access-ID', 'libresky-local');
  res.setHeader('Cache-Control', 'no-store');
}

function sendJson(req, res, code, payload) {
  const body = Buffer.from(JSON.stringify(payload));
  writeCors(req, res);
  res.writeHead(code, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': String(body.length),
  });
  res.end(body);
}

function namesFrom(data) {
  const rows = Array.isArray(data?.models) ? data.models : (Array.isArray(data?.data) ? data.data : []);
  const names = [];
  for (const item of rows) {
    const name = String((typeof item === 'string' ? item : (item?.name || item?.model || item?.id || '')) || '').trim();
    if (!name || name.length > 120 || names.includes(name)) continue;
    names.push(name);
    if (names.length >= 40) break;
  }
  return names;
}

async function readJson(url) {
  const res = await fetch(url, { headers: { Accept: 'application/json' }, signal: AbortSignal.timeout(2000) });
  if (!res.ok) return null;
  const data = await res.json();
  return data && typeof data === 'object' ? data : null;
}

async function catalog() {
  if (Date.now() - cache.at < 4000) return cache;
  const models = [];
  const routes = new Map();
  const runtimes = new Set();
  for (const upstream of UPSTREAMS) {
    try {
      const tagged = upstream.tags ? await readJson(`${upstream.origin}/api/tags`) : null;
      const openai = tagged ? null : await readJson(`${upstream.base}/models`);
      const names = namesFrom(tagged || openai);
      if (!names.length) continue;
      runtimes.add(upstream.runtime);
      names.forEach((name) => {
        if (routes.has(name)) return;
        routes.set(name, upstream);
        models.push({ id: name, object: 'model', owned_by: upstream.runtime });
      });
    } catch {
      /* that server is not running */
    }
  }
  const runtime = runtimes.size === 1 ? [...runtimes][0] : (runtimes.size ? 'This computer' : '');
  const api = runtimes.size === 1 && [...routes.values()][0]?.api === 'ollama' ? 'ollama' : 'openai';
  cache = { at: Date.now(), models, routes, runtime, api };
  return cache;
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    req.on('data', (chunk) => {
      size += chunk.length;
      if (size > 1_000_000) {
        reject(new Error('too large'));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

async function forward(req, res, target, body) {
  const headers = { Accept: 'application/json' };
  if (req.headers['content-type']) headers['Content-Type'] = req.headers['content-type'];
  if (req.headers.authorization) headers.Authorization = req.headers.authorization;
  const up = await fetch(target, {
    method: 'POST',
    headers,
    body,
    signal: AbortSignal.timeout(120000),
  });
  const bytes = Buffer.from(await up.arrayBuffer());
  writeCors(req, res);
  res.writeHead(up.status, { 'Content-Type': up.headers.get('content-type') || 'application/json' });
  res.end(bytes);
}

const server = http.createServer(async (req, res) => {
  const origin = req.headers.origin;
  if (origin && !originOk(origin)) {
    sendJson(req, res, 403, { error: 'origin refused' });
    return;
  }
  if (req.method === 'OPTIONS') {
    writeCors(req, res);
    res.writeHead(204);
    res.end();
    return;
  }
  const path = (req.url || '/').split('?')[0].replace(/\/+$/, '') || '/';
  try {
    if (req.method === 'GET' && path === '/health') {
      sendJson(req, res, 200, { ok: true });
      return;
    }
    if (req.method === 'GET' && path === '/v1/models') {
      const found = await catalog();
      sendJson(req, res, 200, {
        object: 'list',
        data: found.models,
        libresky: { runtime: found.runtime, api: found.api },
      });
      return;
    }
    if (req.method === 'POST' && (path === '/v1/chat/completions' || path === '/api/chat' || path === '/api/generate')) {
      const body = await readBody(req);
      let model = '';
      try { model = JSON.parse(body.toString('utf8') || '{}').model || ''; } catch { model = ''; }
      const found = await catalog();
      const upstream = found.routes.get(model) || UPSTREAMS[0];
      const target = path === '/v1/chat/completions'
        ? `${upstream.base}/chat/completions`
        : `${upstream.origin}${path}`;
      await forward(req, res, target, body);
      return;
    }
    sendJson(req, res, 404, { error: 'not found' });
  } catch {
    if (!res.headersSent) sendJson(req, res, 502, { error: 'local server unreachable' });
    else res.end();
  }
});

server.listen(PORT, HOST, () => {
  process.stdout.write(`LibreSky local AI bridge on http://${HOST}:${PORT}\n`);
});
