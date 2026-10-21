import { currentDid } from './session.js';

const AI_KEY = 'libresky.ai';
const AI_MAP = 'libresky.aiAccounts';

// The PDS only stores private preferences whose type is under app.bsky.
// A repo record is public, so the key must not go in app.libresky.settings.
export const AI_PREF_TYPE = 'app.bsky.actor.defs#libreskyAi';

export const AI_SYSTEM = 'You are the assistant a person reaches in LibreSky by tagging @ai or @si. Those tags are not Bluesky accounts. Reply in plain text, usually one short paragraph, and stay under 700 characters unless the question needs more.';

export const AI_TIMEOUT_MS = 90000;

export const AI_PROVIDERS = [
  { id: 'gemini', label: 'Gemini', model: 'gemini-3.8-flash', kind: 'gemini' },
  { id: 'grok', label: 'Grok', model: 'grok-4.7', base: 'https://api.x.ai/v1', kind: 'responses' },
  { id: 'openai', label: 'OpenAI', model: 'gpt-5-mini', base: 'https://api.openai.com/v1', kind: 'chat' },
  { id: 'custom', label: 'Other', model: '', kind: 'chat' },
];

export function providerById(id) {
  return AI_PROVIDERS.find((item) => item.id === id) || AI_PROVIDERS[0];
}

let aiWatch = () => {};

export function watchAiAccount(fn) {
  aiWatch = typeof fn === 'function' ? fn : () => {};
}

function readMap() {
  try {
    const raw = localStorage.getItem(AI_MAP);
    const data = raw ? JSON.parse(raw) : null;
    return data && typeof data === 'object' && !Array.isArray(data) ? data : {};
  } catch {
    return {};
  }
}

function writeMap(map) {
  try {
    if (!Object.keys(map).length) localStorage.removeItem(AI_MAP);
    else localStorage.setItem(AI_MAP, JSON.stringify(map));
  } catch {
    /* private mode keeps the in-memory account */
  }
}

function dropLegacy() {
  try { localStorage.removeItem(AI_KEY); } catch { /* already gone */ }
}

function readLegacy() {
  try {
    const raw = localStorage.getItem(AI_KEY);
    const saved = raw ? JSON.parse(raw) : null;
    if (!saved || typeof saved !== 'object' || !saved.apiKey) return null;
    return prepareAi(saved);
  } catch {
    return null;
  }
}

function putAccount(did, config, synced) {
  const map = readMap();
  if (!did) return;
  if (!config) delete map[did];
  else map[did] = { ...config, synced: Boolean(synced) };
  writeMap(map);
  dropLegacy();
}

export function loadAi() {
  const did = currentDid();
  if (!did) return null;
  const saved = readMap()[did];
  if (!saved || typeof saved !== 'object' || !saved.apiKey) return null;
  try {
    return prepareAi(saved);
  } catch {
    return null;
  }
}

export function aiAccountSynced(did = currentDid()) {
  const saved = did ? readMap()[did] : null;
  return Boolean(saved?.synced);
}

export function setAiAccountSynced(did, synced) {
  if (!did || !readMap()[did]) return;
  const map = readMap();
  map[did] = { ...map[did], synced: Boolean(synced) };
  writeMap(map);
}

export function claimLegacyAi(did) {
  if (!did || readMap()[did]?.apiKey) return null;
  const legacy = readLegacy();
  if (!legacy) return null;
  putAccount(did, legacy, false);
  return legacy;
}

export function storeAiAccount(did, input, synced) {
  if (!did) return;
  if (!input) {
    putAccount(did, null, false);
    return;
  }
  putAccount(did, prepareAi(input), synced);
}

export function aiPreference(config) {
  if (!config?.apiKey) return null;
  return {
    $type: AI_PREF_TYPE,
    provider: config.provider,
    model: config.model,
    base: config.base || '',
    apiKey: config.apiKey,
  };
}

export function aiFromPreference(pref) {
  if (!pref || pref.$type !== AI_PREF_TYPE || !pref.apiKey) return null;
  try {
    return prepareAi(pref);
  } catch {
    return null;
  }
}

export function saveAi(input) {
  const did = currentDid();
  if (!did) throw new Error('Sign in to save the key on your account.');
  const next = prepareAi(input);
  putAccount(did, next, false);
  aiWatch();
  return next;
}

export function clearAi() {
  const did = currentDid();
  if (did) putAccount(did, null, false);
  else dropLegacy();
  aiWatch();
}

const AI_LOG_KEY = 'libresky.aiLog';
const aiListeners = new Set();

function readAiLog() {
  try {
    const raw = sessionStorage.getItem(AI_LOG_KEY);
    const list = raw ? JSON.parse(raw) : [];
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

export function aiLog() {
  return readAiLog();
}

export function clearAiLog() {
  try { sessionStorage.removeItem(AI_LOG_KEY); } catch { /* this tab can still forget the list in memory */ }
  aiListeners.forEach((fn) => { try { fn([]); } catch { /* a listener can fail on its own */ } });
}

export function subscribeAiLog(fn) {
  aiListeners.add(fn);
  return () => aiListeners.delete(fn);
}

function scrubLog(value, key) {
  let text = String(value || '');
  if (key && text.includes(key)) text = text.split(key).join('[key]');
  return text.slice(0, 1500);
}

function pushAiLog(entry) {
  const next = [entry, ...readAiLog()].slice(0, 80);
  try { sessionStorage.setItem(AI_LOG_KEY, JSON.stringify(next)); } catch { /* the open panel still receives this call */ }
  aiListeners.forEach((fn) => { try { fn(next); } catch { /* a listener can fail on its own */ } });
}

function logAiCall({ account, note, started, ok, asked = '', text = '', error = '', key = '' }) {
  const secret = key || account?.apiKey || '';
  pushAiLog({
    at: new Date().toISOString(),
    note: String(note || 'call').slice(0, 40),
    provider: account?.provider || '',
    model: account?.model || '',
    kind: account?.kind || '',
    ok: Boolean(ok),
    ms: Math.max(0, Date.now() - started),
    asked: scrubLog(asked, secret).slice(0, 400),
    text: ok ? scrubLog(text, secret) : '',
    error: ok ? '' : scrubLog(error, secret),
  });
}

export function aiReady(config) {
  return Boolean(config?.apiKey && config?.model && config?.kind);
}

function cleanModel(value, fallback) {
  const model = String(value || fallback || '').trim();
  if (!model || model.length > 80 || /[\s/\\:]/.test(model)) {
    throw new Error('Enter a model name.');
  }
  return model;
}

function cleanBase(value) {
  let raw = String(value || '').trim();
  if (!raw) throw new Error('Enter the API address, starting with https://');
  raw = raw.replace(/\/+$/, '').replace(/\/chat\/completions$/i, '').replace(/\/responses$/i, '');
  let url;
  try { url = new URL(raw); } catch { throw new Error('Enter the API address, starting with https://'); }
  const local = url.hostname === 'localhost' || url.hostname === '127.0.0.1';
  if (url.protocol !== 'https:' && !(url.protocol === 'http:' && local)) {
    throw new Error('Use an https address.');
  }
  if (url.username || url.password) throw new Error('Put the key in the key field.');
  const path = url.pathname.replace(/\/$/, '');
  return `${url.origin}${path}`;
}

function cleanKey(value) {
  let key = String(value || '').replace(/[\u200B-\u200D\uFEFF]/g, '').trim();
  key = key.replace(/^bearer\s+/i, '').trim();
  if ((key.startsWith('"') && key.endsWith('"')) || (key.startsWith("'") && key.endsWith("'"))) {
    key = key.slice(1, -1).trim();
  }
  if (key.length < 8 || key.length > 2000 || /\s/.test(key)) {
    throw new Error('Paste the API key from that account.');
  }
  return key;
}

export function prepareAi(input) {
  const provider = providerById(input?.provider);
  const custom = provider.id === 'custom';
  const model = cleanModel(input?.model, custom ? '' : provider.model);
  const base = provider.kind === 'gemini' ? '' : cleanBase(custom ? input?.base : provider.base);
  const apiKey = cleanKey(input?.apiKey);
  return { provider: provider.id, model, base, apiKey, kind: provider.kind };
}

function scrub(message, key) {
  let text = String(message || 'The account did not answer.').replace(/\s+/g, ' ').trim();
  if (key && text.includes(key)) text = text.split(key).join('the key');
  return text.slice(0, 180) || 'The account did not answer.';
}

export function replyText(data) {
  if (!data || typeof data !== 'object') throw new Error('The account sent an empty reply.');
  if (typeof data.output_text === 'string' && data.output_text.trim()) return data.output_text.trim();
  if (Array.isArray(data.output)) {
    const parts = [];
    for (const item of data.output) {
      if (item?.type && item.type !== 'message') continue;
      const content = item?.content;
      if (typeof content === 'string') parts.push(content);
      else if (Array.isArray(content)) {
        for (const part of content) {
          if (part?.type && part.type !== 'output_text' && part.type !== 'text') continue;
          if (typeof part?.text === 'string') parts.push(part.text);
        }
      }
    }
    const text = parts.join('').trim();
    if (text) return text;
  }
  const choice = data.choices?.[0]?.message?.content;
  if (typeof choice === 'string' && choice.trim()) return choice.trim();
  if (Array.isArray(choice)) {
    const text = choice.map((part) => (typeof part?.text === 'string' ? part.text : '')).join('').trim();
    if (text) return text;
  }
  const parts = data.candidates?.[0]?.content?.parts;
  if (Array.isArray(parts)) {
    const text = parts.filter((part) => !part?.thought).map((part) => part?.text || '').join('').trim();
    if (text) return text;
  }
  const err = data.error?.message || (typeof data.error === 'string' ? data.error : '');
  if (err) throw new Error(scrub(err));
  const reason = data.incomplete_details?.reason || data.incomplete_details;
  if (data.status === 'incomplete' && reason === 'max_output_tokens') {
    throw new Error('The account used its reply limit before it wrote an answer.');
  }
  throw new Error('The account sent an empty reply.');
}

export function responsesBody(account, history) {
  const body = {
    model: account.model,
    input: (history || []).map((item) => ({
      role: item.role === 'assistant' || item.role === 'system' ? item.role : 'user',
      content: String(item.content || ''),
    })),
    max_output_tokens: 4000,
    store: false,
  };
  if (/^grok-4\.(?:5|6|7)(?:-|$)/.test(account?.model || '')) body.reasoning = { effort: 'low' };
  return body;
}

function explainAiError(provider, message) {
  if (provider === 'grok' && /incorrect api key|invalid api key/i.test(message || '')) {
    return 'xAI refused this key. Create one at console.x.ai. It starts with xai-. SuperGrok and an X login are not API keys.';
  }
  return message;
}

async function readBody(res, key) {
  const raw = await res.text();
  let data = null;
  try { data = raw ? JSON.parse(raw) : null; } catch { data = null; }
  if (!res.ok) {
    const message = data?.error?.message || data?.error?.status || (typeof data?.error === 'string' ? data.error : '') || res.statusText || 'The account refused the request.';
    throw new Error(scrub(message, key));
  }
  if (!data) throw new Error('The account sent an empty reply.');
  return replyText(data);
}

export async function askAi(config, messages, signal, note = '') {
  const started = Date.now();
  let account = null;
  const history = (messages || []).filter((item) => item && item.content).slice(-12);
  const asked = [...history].reverse().find((item) => item.role === 'user')?.content || '';
  try {
    account = prepareAi(config);
    if (!history.length) throw new Error('Write a question first.');
    const key = account.apiKey;
    let url = '';
    let headers = { 'Content-Type': 'application/json' };
    let body = null;
    if (account.kind === 'gemini') {
      url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(account.model)}:generateContent`;
      headers['x-goog-api-key'] = key;
      const system = history.filter((item) => item.role === 'system').map((item) => item.content).join('\n');
      const contents = history.filter((item) => item.role !== 'system').map((item) => ({
        role: item.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: String(item.content || '') }],
      }));
      body = {
        contents,
        generationConfig: { maxOutputTokens: 800 },
      };
      if (system) body.systemInstruction = { parts: [{ text: system }] };
    } else if (account.kind === 'responses') {
      url = `${account.base}/responses`;
      headers.Authorization = `Bearer ${key}`;
      body = responsesBody(account, history);
    } else {
      url = `${account.base}/chat/completions`;
      headers.Authorization = `Bearer ${key}`;
      body = {
        model: account.model,
        messages: history.map((item) => ({
          role: item.role === 'assistant' || item.role === 'system' ? item.role : 'user',
          content: String(item.content || ''),
        })),
      };
      if (account.provider === 'openai') body.max_completion_tokens = 2000;
      else body.max_tokens = 800;
    }
    let res;
    try {
      res = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
        redirect: 'error',
        signal,
      });
    } catch (error) {
      if (error?.name === 'AbortError') throw error;
      throw new Error('This browser could not reach that account. Check the address and the key.');
    }
    const text = await readBody(res, key);
    logAiCall({ account, note, started, ok: true, asked, text });
    return text;
  } catch (error) {
    const aborted = error?.name === 'AbortError';
    let message = aborted ? 'The account took too long.' : (error?.message || 'The account did not answer.');
    if (!aborted) message = explainAiError(account?.provider || config?.provider, message);
    logAiCall({
      account,
      note,
      started,
      ok: false,
      asked,
      error: aborted ? 'Timed out or cancelled.' : message,
      key: account?.apiKey || config?.apiKey || '',
    });
    const wrapped = new Error(message);
    if (aborted) wrapped.name = 'AbortError';
    throw wrapped;
  }
}
