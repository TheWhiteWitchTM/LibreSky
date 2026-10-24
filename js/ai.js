import { currentDid } from './session.js';
import { graphemeLength } from './util.js';

const AI_KEY = 'libresky.ai';
const AI_MAP = 'libresky.aiAccounts';
const LOCAL_AI_KEY = 'libresky.localAi';
const AI_SOURCE_KEY = 'libresky.aiSource';
const DESKTOP_PORT_MIN = 47321;
const DESKTOP_PORT_MAX = 47340;

// Private account preferences travel with the login. The profile record is public,
// so the key must not be written there or in app.libresky.settings.
export const AI_PREF_TYPE = 'app.bsky.actor.defs#libreskyAi';

const memory = new Map();

export const AI_SYSTEM = 'You are the assistant a person reaches in LibreSky by tagging @ai or @si. Those tags are not Bluesky accounts. Reply in plain text, usually one short paragraph, and stay under 700 characters unless the question needs more.';

export const AI_DRAFT_LIMIT = 300;

export const AI_DRAFT_SYSTEM = 'You rewrite a Bluesky post for LibreSky. Keep the author\'s meaning, language, and names. Return only the post text. Stay under 300 characters. Do not add hashtags, a preamble, or quotation marks.';

const DRAFT_LEAD = /^(?:here(?:'|’)s(?: the)?(?: rewritten)?(?: post| draft)?|here is(?: the)?(?: rewritten)?(?: post| draft)?|rewritten(?: post| draft)?|rewrite|draft|post)\s*:\s*/i;

export function draftRewriteMessages(text) {
  return [
    { role: 'system', content: AI_DRAFT_SYSTEM },
    { role: 'user', content: String(text || '').trim() },
  ];
}

function trimGraphemes(value, limit) {
  if (graphemeLength(value) <= limit) return value;
  const parts = typeof Intl !== 'undefined' && Intl.Segmenter
    ? [...new Intl.Segmenter().segment(value)].map((part) => part.segment)
    : [...value];
  let cut = parts.slice(0, limit).join('');
  const space = cut.lastIndexOf(' ');
  if (space > Math.floor(limit * 0.6)) cut = cut.slice(0, space);
  return cut.trim();
}

export function fitDraft(text, limit = AI_DRAFT_LIMIT) {
  let value = String(text || '').replace(/\r/g, '').trim();
  const fence = value.match(/^```[a-z]*\n?([\s\S]*?)\n?```$/i);
  if (fence) value = fence[1].trim();
  value = value.replace(DRAFT_LEAD, '').trim();
  const wrapped = (value.startsWith('"') && value.endsWith('"'))
    || (value.startsWith('“') && value.endsWith('”'))
    || (value.startsWith("'") && value.endsWith("'") && graphemeLength(value) > 2);
  if (wrapped) value = value.slice(1, -1).trim();
  value = value.replace(/[ \t]+\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim();
  return trimGraphemes(value, limit);
}

export const AI_TIMEOUT_MS = 90000;

export const AI_PROVIDERS = [
  { id: 'grok', label: 'Grok (xAI)', model: 'grok-4.7', base: 'https://api.x.ai/v1', kind: 'responses', keyUrl: 'https://console.x.ai/team/default/api-keys', keyLabel: 'console.x.ai' },
  { id: 'gemini', label: 'Gemini', model: 'gemini-3.8-flash', kind: 'gemini', keyUrl: 'https://aistudio.google.com/apikey', keyLabel: 'Google AI Studio' },
  { id: 'openai', label: 'OpenAI', model: 'gpt-5-mini', base: 'https://api.openai.com/v1', kind: 'chat', keyUrl: 'https://platform.openai.com/api-keys', keyLabel: 'platform.openai.com' },
  { id: 'anthropic', label: 'Claude', model: 'claude-sonnet-4-5', base: 'https://api.anthropic.com', kind: 'anthropic', keyUrl: 'https://console.anthropic.com/settings/keys', keyLabel: 'console.anthropic.com' },
  { id: 'deepseek', label: 'DeepSeek', model: 'deepseek-flash', base: 'https://api.deepseek.com', kind: 'chat', keyUrl: 'https://platform.deepseek.com/api_keys', keyLabel: 'platform.deepseek.com' },
  { id: 'groq', label: 'Groq', model: 'llama-3.3-70b-versatile', base: 'https://api.groq.com/openai/v1', kind: 'chat', keyUrl: 'https://console.groq.com/keys', keyLabel: 'console.groq.com' },
  { id: 'openrouter', label: 'OpenRouter', model: 'openrouter/auto', base: 'https://openrouter.ai/api/v1', kind: 'chat', keyUrl: 'https://openrouter.ai/keys', keyLabel: 'openrouter.ai' },
  { id: 'mistral', label: 'Mistral', model: 'mistral-small-latest', base: 'https://api.mistral.ai/v1', kind: 'chat', keyUrl: 'https://console.mistral.ai/api-keys', keyLabel: 'console.mistral.ai' },
  { id: 'together', label: 'Together', model: 'meta-llama/Llama-3.3-70B-Instruct-Turbo', base: 'https://api.together.xyz/v1', kind: 'chat', keyUrl: 'https://api.together.ai/settings/api-keys', keyLabel: 'api.together.ai' },
  { id: 'cerebras', label: 'Cerebras', model: 'llama3.1-8b', base: 'https://api.cerebras.ai/v1', kind: 'chat', keyUrl: 'https://cloud.cerebras.ai', keyLabel: 'cloud.cerebras.ai' },
  { id: 'pollinations', label: 'Pollinations (free)', model: 'openai', base: 'https://text.pollinations.ai', kind: 'pollinations', keyOptional: true, keyUrl: 'https://enter.pollinations.ai', keyLabel: 'enter.pollinations.ai' },
  { id: 'local', label: 'Local', model: '', base: 'http://127.0.0.1:11434/v1', kind: 'chat', keyOptional: true, local: true },
  { id: 'custom', label: 'Other', model: '', kind: 'chat' },
];

export function providerById(id) {
  return AI_PROVIDERS.find((item) => item.id === id) || AI_PROVIDERS[0];
}

export function fallbackAi() {
  const item = providerById('pollinations');
  return {
    provider: item.id,
    model: item.model,
    base: item.base,
    apiKey: '',
    kind: item.kind,
    fallback: true,
  };
}

export function cloudProviders() {
  return AI_PROVIDERS.filter((item) => !item.local);
}

export function onDesktopApp() {
  if (typeof location === 'undefined') return false;
  const n = Number(location.port);
  const local = location.hostname === '127.0.0.1' || location.hostname === 'localhost';
  return local && n >= DESKTOP_PORT_MIN && n <= DESKTOP_PORT_MAX;
}

export function rewriteLocalUrl(url) {
  if (!onDesktopApp()) return url;
  try {
    const parsed = new URL(url);
    if (parsed.hostname !== '127.0.0.1' && parsed.hostname !== 'localhost') return url;
    const port = parsed.port || (parsed.protocol === 'https:' ? '443' : '80');
    return `${location.origin}/local-ai/${port}${parsed.pathname}${parsed.search}`;
  } catch {
    return url;
  }
}

function readLocalRecord() {
  try {
    const raw = localStorage.getItem(LOCAL_AI_KEY);
    const saved = raw ? JSON.parse(raw) : null;
    return saved && typeof saved === 'object' && !Array.isArray(saved) ? saved : null;
  } catch {
    return null;
  }
}

export function loadLocalAi() {
  const saved = readLocalRecord();
  if (!saved) return null;
  try {
    return prepareAi({ ...saved, provider: 'local' });
  } catch {
    return null;
  }
}

export function saveLocalAi(input) {
  const next = prepareAi({ ...input, provider: 'local' });
  try {
    localStorage.setItem(LOCAL_AI_KEY, JSON.stringify({
      provider: 'local',
      model: next.model,
      base: next.base,
      apiKey: next.apiKey || '',
      api: next.api || '',
    }));
  } catch {
    /* this browser can still use the in-memory copy for the tab */
  }
  return next;
}

export function clearLocalAi() {
  try { localStorage.removeItem(LOCAL_AI_KEY); } catch { /* already gone */ }
}

export function aiSource() {
  try {
    const raw = localStorage.getItem(AI_SOURCE_KEY);
    if (raw === 'local' || raw === 'account') return raw;
  } catch {
    /* fall through */
  }
  if (loadAi()?.apiKey) return 'account';
  return loadLocalAi() ? 'local' : 'account';
}

export function setAiSource(source) {
  const next = source === 'local' ? 'local' : 'account';
  try { localStorage.setItem(AI_SOURCE_KEY, next); } catch { /* the next ask still reads the other store */ }
  return next;
}

export function adoptLocalFromCloud(config) {
  if (!config || config.provider !== 'local') return false;
  if (!loadLocalAi()) {
    try { saveLocalAi(config); } catch { /* keep going so the cloud copy can still drop */ }
  }
  try {
    if (!localStorage.getItem(AI_SOURCE_KEY)) localStorage.setItem(AI_SOURCE_KEY, 'local');
  } catch {
    /* source still defaults to local when a local record exists */
  }
  return true;
}

export function activeAi() {
  if (aiSource() === 'local') {
    const local = loadLocalAi();
    if (local) return local;
    return fallbackAi();
  }
  return resolveAi(loadAi());
}

function keyOptional(provider) {
  return Boolean(providerById(provider)?.keyOptional);
}

export function resolveAi(config) {
  if (config && (config.apiKey || keyOptional(config.provider))) {
    try { return prepareAi(config); } catch { /* a broken saved account still has the free model */ }
  }
  return fallbackAi();
}

let aiWatch = () => {};

export function watchAiAccount(fn) {
  aiWatch = typeof fn === 'function' ? fn : () => {};
}

function readLegacyMap() {
  try {
    const raw = localStorage.getItem(AI_MAP);
    const data = raw ? JSON.parse(raw) : null;
    return data && typeof data === 'object' && !Array.isArray(data) ? data : {};
  } catch {
    return {};
  }
}

function writeLegacyMap(map) {
  try {
    if (!Object.keys(map).length) localStorage.removeItem(AI_MAP);
    else localStorage.setItem(AI_MAP, JSON.stringify(map));
  } catch {
    /* the account copy is the record that matters */
  }
}

function dropLegacy() {
  try { localStorage.removeItem(AI_KEY); } catch { /* already gone */ }
}

function forgetBrowserCopy(did) {
  const map = readLegacyMap();
  if (did && map[did]) {
    delete map[did];
    writeLegacyMap(map);
  }
  dropLegacy();
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
  if (!did) return;
  if (!config) {
    memory.delete(did);
    forgetBrowserCopy(did);
    return;
  }
  memory.set(did, { ...config, synced: Boolean(synced) });
  if (synced) forgetBrowserCopy(did);
}

export function loadAi() {
  const did = currentDid();
  if (!did) return null;
  const saved = memory.get(did);
  if (!saved || typeof saved !== 'object') return null;
  if (saved.provider === 'local') {
    adoptLocalFromCloud(saved);
    memory.delete(did);
    return null;
  }
  if (!saved.apiKey && !keyOptional(saved.provider)) return null;
  try {
    return prepareAi(saved);
  } catch {
    return null;
  }
}

export function aiAccountSynced(did = currentDid()) {
  const saved = did ? memory.get(did) : null;
  return Boolean(saved?.synced);
}

export function setAiAccountSynced(did, synced) {
  if (!did || !memory.get(did)) return;
  memory.set(did, { ...memory.get(did), synced: Boolean(synced) });
  if (synced) forgetBrowserCopy(did);
}

export function claimLegacyAi(did) {
  if (!did || memory.get(did)?.apiKey) return null;
  const map = readLegacyMap();
  let legacy = null;
  if (map[did]?.apiKey) {
    try { legacy = prepareAi(map[did]); } catch { legacy = null; }
  }
  if (!legacy) legacy = readLegacy();
  if (!legacy) return null;
  memory.set(did, { ...legacy, synced: false });
  dropLegacy();
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
  if (!config) return null;
  if (config.provider === 'local' || config.local) return null;
  if (!config.apiKey && !keyOptional(config.provider)) return null;
  return {
    $type: AI_PREF_TYPE,
    provider: config.provider,
    model: config.model,
    base: config.base || '',
    apiKey: config.apiKey || '',
  };
}

export function aiFromPreference(pref) {
  if (!pref || pref.$type !== AI_PREF_TYPE) return null;
  if (pref.provider === 'local') {
    try { return prepareAi(pref); } catch { return null; }
  }
  if (!pref.apiKey && !keyOptional(pref.provider)) return null;
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
  const account = resolveAi(config);
  return Boolean(account?.model && account?.kind);
}

function cleanModel(value, fallback) {
  const model = String(value || fallback || '').trim();
  if (!model || model.length > 120 || /[\s\\]/.test(model) || !/^[A-Za-z0-9_./:+-]+$/.test(model)) {
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

export function localModelNames(data) {
  const rows = Array.isArray(data?.models) ? data.models : (Array.isArray(data?.data) ? data.data : []);
  const names = [];
  const seen = new Set();
  for (const item of rows) {
    const raw = typeof item === 'string' ? item : (item?.name || item?.model || item?.id || '');
    const name = String(raw || '').trim();
    if (!name || seen.has(name) || name.length > 120) continue;
    seen.add(name);
    names.push(name);
    if (names.length >= 40) break;
  }
  return names;
}

export function localProbes(extraBase = '') {
  const presets = [
    'http://127.0.0.1:11434/v1',
    'http://localhost:11434/v1',
    'http://127.0.0.1:1234/v1',
    'http://127.0.0.1:8080/v1',
    'http://127.0.0.1:1337/v1',
    'http://127.0.0.1:4891/v1',
    'http://127.0.0.1:12434/v1',
    'http://127.0.0.1:5000/v1',
  ];
  const list = [];
  const seen = new Set();
  const add = (value) => {
    let clean = '';
    try { clean = cleanBase(value); } catch { clean = ''; }
    if (!clean || seen.has(clean)) return;
    seen.add(clean);
    let tags = '';
    try {
      const url = new URL(clean);
      if (url.port === '11434') tags = `${url.origin}/api/tags`;
    } catch { tags = ''; }
    list.push({ base: clean, tags });
  };
  if (extraBase) add(extraBase);
  presets.forEach(add);
  return list;
}

async function readModelUrl(url, signal) {
  let res;
  try {
    res = await fetch(rewriteLocalUrl(url), {
      method: 'GET',
      headers: { Accept: 'application/json' },
      cache: 'no-store',
      credentials: 'omit',
      redirect: 'error',
      signal,
    });
  } catch {
    return null;
  }
  if (!res?.ok) return null;
  let data = null;
  try { data = await res.json(); } catch { return null; }
  if (!data || typeof data !== 'object') return null;
  if (!Array.isArray(data.models) && !Array.isArray(data.data)) return null;
  return localModelNames(data);
}

async function readLocalProbe(probe) {
  const signal = AbortSignal.timeout ? AbortSignal.timeout(3000) : undefined;
  if (probe.tags) {
    const tagged = await readModelUrl(probe.tags, signal);
    if (tagged) return { models: tagged, api: 'ollama' };
  }
  const openai = await readModelUrl(`${probe.base}/models`, signal);
  if (openai) return { models: openai, api: 'openai' };
  return null;
}

export async function detectLocalAi(extraBase = '') {
  const probes = localProbes(extraBase);
  const found = await Promise.all(probes.map(async (probe) => {
    try {
      const hit = await readLocalProbe(probe);
      return hit ? { base: probe.base, models: hit.models, api: hit.api } : null;
    } catch {
      return null;
    }
  }));
  return found.find((item) => item && item.models) || null;
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
  const adjustable = custom || provider.local;
  const model = cleanModel(input?.model, adjustable ? '' : provider.model);
  const skipBase = provider.kind === 'gemini' || provider.kind === 'pollinations';
  const base = skipBase ? (provider.base || '') : cleanBase(adjustable ? (input?.base || provider.base) : provider.base);
  const typed = String(input?.apiKey || '').trim();
  const apiKey = !typed && provider.keyOptional ? '' : cleanKey(input?.apiKey);
  const api = provider.local && (input?.api === 'ollama' || input?.api === 'openai') ? input.api : '';
  return { provider: provider.id, model, base, apiKey, kind: provider.kind, api };
}

function scrub(message, key) {
  let text = String(message || 'The account did not answer.').replace(/\s+/g, ' ').trim();
  if (key && text.includes(key)) text = text.split(key).join('the key');
  return text.slice(0, 180) || 'The account did not answer.';
}

export function replyText(data) {
  if (!data || typeof data !== 'object') throw new Error('The account sent an empty reply.');
  if (typeof data.message?.content === 'string' && data.message.content.trim()) return data.message.content.trim();
  if (typeof data.response === 'string' && data.response.trim()) return data.response.trim();
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
  const reasoning = data.choices?.[0]?.message?.reasoning_content;
  if (typeof reasoning === 'string' && reasoning.trim()) return reasoning.trim();
  const parts = data.candidates?.[0]?.content?.parts;
  if (Array.isArray(parts)) {
    const text = parts.filter((part) => !part?.thought).map((part) => part?.text || '').join('').trim();
    if (text) return text;
  }
  if (Array.isArray(data.content)) {
    const text = data.content.map((part) => (typeof part?.text === 'string' ? part.text : '')).join('').trim();
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

export function chatExtras(account) {
  if (account?.provider === 'openai') return { max_completion_tokens: 2000 };
  // DeepSeek thinks by default. A short LibreSky reply wants the answer, not a hidden chain of thought.
  if (account?.provider === 'deepseek') return { max_tokens: 800, thinking: { type: 'disabled' } };
  return { max_tokens: 800 };
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
    return 'xAI refused this key. The key from console.x.ai is the one api.x.ai accepts.';
  }
  if (provider === 'deepseek' && /invalid api key|authentication fails|unauthorized/i.test(message || '')) {
    return 'DeepSeek refused this key. The key from platform.deepseek.com is the one api.deepseek.com accepts.';
  }
  if (provider === 'pollinations' && /rate|limit|pollen|forbidden/i.test(message || '')) {
    return 'The free public model is busy. Try again in a moment, or save a key in Settings.';
  }
  return message;
}

async function readBody(res, key) {
  const raw = await res.text();
  let data = null;
  try { data = raw ? JSON.parse(raw) : null; } catch { data = null; }
  if (!res.ok) {
    const message = data?.error?.message || data?.error?.status || (typeof data?.error === 'string' ? data.error : '') || raw.slice(0, 180) || res.statusText || 'The account refused the request.';
    throw new Error(scrub(message, key));
  }
  if (data) return replyText(data);
  const text = String(raw || '').trim();
  if (text) return text.slice(0, 4000);
  throw new Error('The account sent an empty reply.');
}

function aborted(error) {
  return error?.name === 'AbortError' || error?.name === 'TimeoutError';
}

async function fetchLocalChat(account, chatMessages, headers, body, signal) {
  const origin = new URL(account.base).origin;
  const openaiUrl = rewriteLocalUrl(`${account.base}/chat/completions`);
  const ollamaUrl = rewriteLocalUrl(`${origin}/api/chat`);
  const ollamaBody = JSON.stringify({ model: account.model, messages: chatMessages, stream: false });
  const openai = () => fetch(openaiUrl, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
    redirect: 'error',
    signal,
  });
  const ollama = () => fetch(ollamaUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: ollamaBody,
    redirect: 'error',
    signal,
  });
  const preferOllama = account.api === 'ollama' || /:(11434)(?:\/|$)/.test(account.base);
  const first = preferOllama ? ollama : openai;
  const second = preferOllama ? openai : ollama;
  try {
    const res = await first();
    if (res?.ok) return res;
    try {
      const fallback = await second();
      return fallback?.ok ? fallback : res;
    } catch (error) {
      if (aborted(error)) throw error;
      return res;
    }
  } catch (error) {
    if (aborted(error)) throw error;
    return second();
  }
}

export async function askAi(config, messages, signal, note = '') {
  const started = Date.now();
  let account = null;
  const history = (messages || []).filter((item) => item && item.content).slice(-12);
  const asked = [...history].reverse().find((item) => item.role === 'user')?.content || '';
  try {
    account = resolveAi(config);
    if (!history.length) throw new Error('Write a question first.');
    const key = account.apiKey;
    let url = '';
    let headers = { 'Content-Type': 'application/json' };
    let body = null;
    const chatMessages = history.map((item) => ({
      role: item.role === 'assistant' || item.role === 'system' ? item.role : 'user',
      content: String(item.content || ''),
    }));
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
    } else if (account.kind === 'anthropic') {
      url = `${account.base}/v1/messages`;
      headers['x-api-key'] = key;
      headers['anthropic-version'] = '2023-06-01';
      const system = history.filter((item) => item.role === 'system').map((item) => item.content).join('\n');
      body = {
        model: account.model,
        max_tokens: 800,
        messages: history.filter((item) => item.role !== 'system').map((item) => ({
          role: item.role === 'assistant' ? 'assistant' : 'user',
          content: String(item.content || ''),
        })),
      };
      if (system) body.system = system;
    } else if (account.kind === 'pollinations') {
      url = `${account.base}/openai`;
      if (key) headers.Authorization = `Bearer ${key}`;
      body = {
        model: account.model || 'openai',
        messages: chatMessages,
        seed: Math.floor(Math.random() * 1e9),
      };
    } else if (account.kind === 'responses') {
      url = `${account.base}/responses`;
      headers.Authorization = `Bearer ${key}`;
      body = responsesBody(account, history);
    } else {
      url = `${account.base}/chat/completions`;
      if (key) headers.Authorization = `Bearer ${key}`;
      if (account.provider === 'openrouter') {
        headers['HTTP-Referer'] = typeof location !== 'undefined' ? location.origin : 'https://thewhitewitchtm.github.io/LibreSky';
        headers['X-Title'] = 'LibreSky';
      }
      body = {
        model: account.model,
        messages: chatMessages,
        ...chatExtras(account),
      };
    }
    const httpsPage = typeof location !== 'undefined' && location.protocol === 'https:' && !onDesktopApp();
    const unreachable = account.provider === 'local'
      ? (httpsPage
        ? 'This https page cannot reach a local http server. Use the LibreSky desktop app, or open a local copy of LibreSky.'
        : 'This browser could not reach the local server. Start it, then press Find local.')
      : 'This browser could not reach that account. Check the address and the key.';
    if (account.provider === 'local') url = rewriteLocalUrl(url);
    let res;
    try {
      if (account.provider === 'local') {
        res = await fetchLocalChat(account, chatMessages, headers, body, signal);
      } else {
        res = await fetch(url, {
          method: 'POST',
          headers,
          body: JSON.stringify(body),
          redirect: 'error',
          signal,
        });
      }
    } catch (error) {
      if (aborted(error)) throw error;
      if (account.kind === 'pollinations' && asked) {
        const getUrl = `${account.base}/${encodeURIComponent(asked.slice(0, 500))}?model=${encodeURIComponent(account.model || 'openai')}`;
        try {
          res = await fetch(getUrl, { signal, redirect: 'error' });
        } catch {
          throw new Error(unreachable);
        }
      } else {
        throw new Error(unreachable);
      }
    }
    if (!res) throw new Error(unreachable);
    const text = await readBody(res, key);
    logAiCall({ account, note, started, ok: true, asked, text });
    return text;
  } catch (error) {
    const timedOut = aborted(error);
    let message = timedOut ? 'The account took too long.' : (error?.message || 'The account did not answer.');
    if (!timedOut) message = explainAiError(account?.provider || config?.provider, message);
    logAiCall({
      account,
      note,
      started,
      ok: false,
      asked,
      error: timedOut ? 'Timed out or cancelled.' : message,
      key: account?.apiKey || config?.apiKey || '',
    });
    const wrapped = new Error(message);
    if (timedOut) wrapped.name = 'AbortError';
    throw wrapped;
  }
}
