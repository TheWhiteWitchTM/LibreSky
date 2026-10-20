import { OLLAMA_HOST, pickModels } from '../shared/ollama.js';

export async function probeOllama(host = OLLAMA_HOST) {
  const empty = { ok: false, host, version: '', models: [], loaded: [], chatModel: '', completeModel: '' };
  const signal = AbortSignal.timeout(800);
  try {
    const versionRes = await fetch(`${host}/api/version`, { signal });
    if (!versionRes.ok) return empty;
    const versionBody = await versionRes.json();
    const tagsRes = await fetch(`${host}/api/tags`, { signal });
    const tags = tagsRes.ok ? await tagsRes.json() : { models: [] };
    const models = (tags.models || []).map((item) => item.name).filter(Boolean);
    return {
      ok: true,
      host,
      version: versionBody.version || '',
      models,
      loaded: [],
      ...pickModels(models),
    };
  } catch {
    return empty;
  }
}

export async function streamChat({ host = OLLAMA_HOST, model, messages, signal, onText }) {
  const response = await fetch(`${host}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      messages,
      stream: true,
    }),
    signal,
  });
  if (!response.ok) {
    const detail = await response.text();
    throw new Error(detail.slice(0, 280) || `Ollama returned ${response.status}`);
  }
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    let index = buffer.indexOf('\n');
    while (index >= 0) {
      const line = buffer.slice(0, index).trim();
      buffer = buffer.slice(index + 1);
      if (line) {
        const message = JSON.parse(line);
        if (message.error) throw new Error(String(message.error));
        const chunk = message.message?.content || '';
        if (chunk) onText(chunk);
      }
      index = buffer.indexOf('\n');
    }
  }
}
