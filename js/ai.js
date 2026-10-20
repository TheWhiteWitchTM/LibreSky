// LibreSky Local AI & Grok Engine
import { state, saveAiSettings } from './state.js';

export const AI_PERSONAS = {
  grok: {
    name: 'Grok / Witty',
    prompt: 'You are Grok inside LibreSky. You are witty, sovereign, fiercely honest, sharp, and concise. No corporate hedge words. Provide deep context, humor, and intelligence.',
  },
  summarizer: {
    name: 'Thread Summarizer',
    prompt: 'You are an objective summarizer. Synthesize social discussions into clear, bulleted takeaways and identify the main disagreements or points.',
  },
  factcheck: {
    name: 'Fact & Context Analyst',
    prompt: 'You are an objective fact-checker. Examine claims made in the post, note context that might be missing, and reference verifyable points neutrally.',
  },
  writer: {
    name: 'Social Ghostwriter',
    prompt: 'You are an expert social media writer. Help draft, polish, or rewrite posts to be punchy, engaging, and under Bluesky’s 300-character limit.',
  },
};

/**
 * Scans local AI endpoints (Ollama on 11434 and LM Studio on 1234).
 */
export async function scanLocalAi() {
  const endpoints = [
    { url: state.ai.endpoint || 'http://127.0.0.1:11434', type: 'ollama' },
    { url: 'http://localhost:11434', type: 'ollama' },
    { url: 'http://127.0.0.1:1234', type: 'lmstudio' },
    { url: 'http://localhost:1234', type: 'lmstudio' },
  ];

  // Try custom or default endpoints
  for (const ep of endpoints) {
    try {
      if (ep.type === 'ollama') {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 1200);
        const res = await fetch(`${ep.url}/api/tags`, { signal: controller.signal });
        clearTimeout(timeout);

        if (res.ok) {
          const data = await res.json();
          const models = (data.models || []).map((m) => m.name || m.model);
          if (models.length > 0) {
            state.ai.connected = true;
            state.ai.endpoint = ep.url;
            state.ai.type = 'ollama';
            state.ai.models = models;
            if (!state.ai.activeModel || !models.includes(state.ai.activeModel)) {
              // Prefer writer or coder or first
              state.ai.activeModel =
                models.find((m) => m.startsWith('writer')) ||
                models.find((m) => m.startsWith('coder')) ||
                models.find((m) => /qwen/i.test(m)) ||
                models[0];
            }
            saveAiSettings();
            return { ok: true, endpoint: ep.url, type: 'ollama', models, activeModel: state.ai.activeModel };
          }
        }
      } else if (ep.type === 'lmstudio') {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 1200);
        const res = await fetch(`${ep.url}/v1/models`, { signal: controller.signal });
        clearTimeout(timeout);

        if (res.ok) {
          const data = await res.json();
          const models = (data.data || []).map((m) => m.id);
          if (models.length > 0) {
            state.ai.connected = true;
            state.ai.endpoint = ep.url;
            state.ai.type = 'lmstudio';
            state.ai.models = models;
            if (!state.ai.activeModel || !models.includes(state.ai.activeModel)) {
              state.ai.activeModel = models[0];
            }
            saveAiSettings();
            return { ok: true, endpoint: ep.url, type: 'lmstudio', models, activeModel: state.ai.activeModel };
          }
        }
      }
    } catch (e) {
      // Continue to next probe
    }
  }

  state.ai.connected = false;
  return { ok: false, error: 'No local AI endpoint responded on 127.0.0.1:11434 or 127.0.0.1:1234' };
}

/**
 * Sends a message stream to the active local AI model.
 */
export async function streamChat(messages, onChunk, onDone) {
  if (!state.ai.activeModel) {
    throw new Error('No local AI model selected. Please start Ollama or configure an endpoint.');
  }

  const personaConfig = AI_PERSONAS[state.ai.persona] || AI_PERSONAS.grok;
  const fullMessages = [
    { role: 'system', content: personaConfig.prompt },
    ...messages,
  ];

  state.ai.streaming = true;

  try {
    if (state.ai.type === 'ollama') {
      const res = await fetch(`${state.ai.endpoint}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: state.ai.activeModel,
          messages: fullMessages,
          stream: true,
        }),
      });

      if (!res.ok) {
        throw new Error(`Ollama request failed with code ${res.status}`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let fullText = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n').filter((l) => l.trim().length > 0);
        for (const line of lines) {
          try {
            const parsed = JSON.parse(line);
            if (parsed.message?.content) {
              fullText += parsed.message.content;
              onChunk(fullText, parsed.message.content);
            }
          } catch (e) {
            // Line fragment
          }
        }
      }

      state.ai.streaming = false;
      if (onDone) onDone(fullText);
      return fullText;
    } else {
      // OpenAI / LM Studio format
      const res = await fetch(`${state.ai.endpoint}/v1/chat/completions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: state.ai.activeModel,
          messages: fullMessages,
          stream: true,
        }),
      });

      if (!res.ok) {
        throw new Error(`LM Studio request failed with code ${res.status}`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let fullText = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n').filter((l) => l.startsWith('data: '));
        for (const line of lines) {
          const payload = line.replace(/^data:\s*/, '').trim();
          if (payload === '[DONE]') break;
          try {
            const parsed = JSON.parse(payload);
            const delta = parsed.choices?.[0]?.delta?.content || '';
            if (delta) {
              fullText += delta;
              onChunk(fullText, delta);
            }
          } catch (e) {}
        }
      }

      state.ai.streaming = false;
      if (onDone) onDone(fullText);
      return fullText;
    }
  } catch (err) {
    state.ai.streaming = false;
    throw err;
  }
}

/**
 * One-shot query for post actions (summarize, explain, fact-check, smart reply).
 */
export async function queryAi(prompt, systemPrompt = null) {
  if (!state.ai.activeModel) {
    throw new Error('No local AI model available. Start Ollama with `ollama run writer` or `coder`.');
  }

  const messages = [];
  if (systemPrompt) {
    messages.push({ role: 'system', content: systemPrompt });
  } else {
    const persona = AI_PERSONAS[state.ai.persona] || AI_PERSONAS.grok;
    messages.push({ role: 'system', content: persona.prompt });
  }
  messages.push({ role: 'user', content: prompt });

  if (state.ai.type === 'ollama') {
    const res = await fetch(`${state.ai.endpoint}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: state.ai.activeModel,
        messages,
        stream: false,
      }),
    });
    if (!res.ok) throw new Error(`AI query failed: status ${res.status}`);
    const data = await res.json();
    return data.message?.content || '';
  } else {
    const res = await fetch(`${state.ai.endpoint}/v1/chat/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: state.ai.activeModel,
        messages,
        stream: false,
      }),
    });
    if (!res.ok) throw new Error(`AI query failed: status ${res.status}`);
    const data = await res.json();
    return data.choices?.[0]?.message?.content || '';
  }
}

/**
 * Pre-baked actions for posts and composer.
 */
export async function summarizeThread(threadText) {
  return queryAi(
    `Summarize the following Bluesky conversation thread into key takeaways, core perspectives, and any resolved conclusion:\n\n${threadText}`,
    AI_PERSONAS.summarizer.prompt
  );
}

export async function explainPost(postText, author = '') {
  return queryAi(
    `Explain the background, subtext, jargon, and cultural or technical context of this post by @${author}:\n"${postText}"`,
    AI_PERSONAS.grok.prompt
  );
}

export async function factCheckPost(postText) {
  return queryAi(
    `Perform a neutral, objective fact and context analysis on the claims made in this post:\n"${postText}"\nIdentify verifiable claims, missing nuance, or confirmable facts.`,
    AI_PERSONAS.factcheck.prompt
  );
}

export async function generateSmartReplies(postText, author = '') {
  return queryAi(
    `Generate 3 distinct, witty, engaging replies to this post by @${author}:\n"${postText}"\nFormat as 1., 2., 3. Keep each under 280 characters.`,
    AI_PERSONAS.grok.prompt
  );
}

export async function roastPost(postText, author = '') {
  return queryAi(
    `Deliver a lighthearted, savage, brilliant roast of this take by @${author}:\n"${postText}"`,
    AI_PERSONAS.grok.prompt
  );
}

export async function polishComposerText(draft, style = 'punchy') {
  let instruction = 'Make this punchier and sharper while keeping it under 290 characters.';
  if (style === 'concise') instruction = 'Condense this to be as clear and brief as possible without losing the main punch.';
  if (style === 'thread') instruction = 'Expand this concept into a compelling 3-post Bluesky thread separated by ---.';
  if (style === 'roast') instruction = 'Rewrite this with a more irreverent, hilarious edge.';
  if (style.startsWith('translate-')) {
    const lang = style.replace('translate-', '');
    instruction = `Translate this post accurately and naturally into ${lang}.`;
  }

  return queryAi(
    `Instruction: ${instruction}\n\nOriginal draft:\n"${draft}"\n\nOutput only the resulting text, no explanations.`,
    AI_PERSONAS.writer.prompt
  );
}
