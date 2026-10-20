const AI_KEY = 'libresky.ai';

export const AI_SYSTEM = 'You are the assistant a person reaches in LibreSky by tagging @ai or @si. Those tags are not Bluesky accounts. Reply in plain text, usually one short paragraph, and stay under 700 characters unless the question needs more.';

export const AI_PROVIDERS = [
  { id: 'gemini', label: 'Gemini', model: 'gemini-3.8-flash', kind: 'gemini' },
  { id: 'grok', label: 'Grok', model: 'grok-4.7', base: 'https://api.x.ai/v1', kind: 'responses' },
  { id: 'openai', label: 'OpenAI', model: 'gpt-5-mini', base: 'https://api.openai.com/v1', kind: 'chat' },
  { id: 'custom', label: 'Other', model: '', kind: 'chat' },
];

export function providerById(id) {
  return AI_PROVIDERS.find((item) => item.id === id) || AI_PROVIDERS[0];
}

function readStore() {
  try {
    const raw = localStorage.getItem(AI_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function loadAi() {
  const saved = readStore();
  if (!saved || typeof saved !== 'object' || !saved.apiKey) return null;
  try {
    return prepareAi(saved);
  } catch {
    return null;
  }
}

export function saveAi(input) {
  const next = prepareAi(input);
  localStorage.setItem(AI_KEY, JSON.stringify(next));
  return next;
}

export function clearAi() {
  localStorage.removeItem(AI_KEY);
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
  const key = String(value || '').trim();
  if (key.length < 8 || key.length > 2000 || /[\s]/.test(key)) {
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
  throw new Error('The account sent an empty reply.');
}

function responsesInput(messages) {
  const system = messages.filter((item) => item.role === 'system').map((item) => item.content).join('\n');
  const rest = messages.filter((item) => item.role !== 'system').map((item) => ({
    role: item.role === 'assistant' ? 'assistant' : 'user',
    content: String(item.content || ''),
  }));
  if (system && rest[0]?.role === 'user') rest[0] = { role: 'user', content: `${system}\n\n${rest[0].content}` };
  else if (system) rest.unshift({ role: 'user', content: system });
  return rest;
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

export async function askAi(config, messages, signal) {
  const account = prepareAi(config);
  const history = (messages || []).filter((item) => item && item.content).slice(-12);
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
    body = { model: account.model, input: responsesInput(history), max_output_tokens: 800 };
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
  return readBody(res, key);
}
