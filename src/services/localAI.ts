import { AIModel, AIProvider, AIProviderConfig, GrokActionMode } from '../types/ai';
import { BskyPost } from '../types/bsky';

// Known local endpoints to test
const DEFAULT_ENDPOINTS = {
  ollama: 'http://127.0.0.1:11434',
  lmstudio: 'http://127.0.0.1:1234',
  localai: 'http://127.0.0.1:8080',
};

declare global {
  interface Window {
    electronAPI?: {
      isElectron?: boolean;
      checkLocalServer: (args: { url: string }) => Promise<{ ok: boolean; data?: any; raw?: string; error?: string; status?: number }>;
      getPlatform: () => Promise<any>;
      onOAuthCallback: (callback: (url: string) => void) => () => void;
    };
  }
}

export class LocalAIService {
  private config: AIProviderConfig;

  constructor(initialConfig: AIProviderConfig) {
    this.config = initialConfig;
  }

  updateConfig(config: Partial<AIProviderConfig>) {
    this.config = { ...this.config, ...config };
  }

  getConfig(): AIProviderConfig {
    return this.config;
  }

  /**
   * Safe fetch checking both Electron IPC (zero CORS) and Web Fetch
   */
  private async safeGet(url: string): Promise<{ ok: boolean; data?: any }> {
    // If in Electron, IPC is fastest and avoids browser CORS restriction
    if (window.electronAPI?.checkLocalServer) {
      try {
        const res = await window.electronAPI.checkLocalServer({ url });
        return { ok: res.ok, data: res.data };
      } catch (e) {
        // Fall back to fetch below
      }
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);
      const res = await fetch(url, {
        method: 'GET',
        headers: { Accept: 'application/json' },
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      if (!res.ok) return { ok: false };
      const data = await res.json();
      return { ok: true, data };
    } catch {
      return { ok: false };
    }
  }

  /**
   * Auto-detect any running local AI server (Ollama, LM Studio, LocalAI)
   */
  async detectLocalAI(): Promise<{
    connected: boolean;
    provider: AIProvider;
    endpoint: string;
    models: AIModel[];
  }> {
    // 1. Check current configured endpoint first
    if (this.config.endpoint) {
      const activeRes = await this.probeEndpoint(this.config.provider, this.config.endpoint);
      if (activeRes.connected) {
        return activeRes;
      }
    }

    // 2. Scan Ollama (default port 11434)
    const ollamaRes = await this.probeEndpoint('ollama', DEFAULT_ENDPOINTS.ollama);
    if (ollamaRes.connected) {
      this.config.provider = 'ollama';
      this.config.endpoint = DEFAULT_ENDPOINTS.ollama;
      if (ollamaRes.models.length > 0 && !this.config.selectedModel) {
        this.config.selectedModel = ollamaRes.models[0].id;
      }
      return ollamaRes;
    }

    // 3. Scan LM Studio (port 1234)
    const lmRes = await this.probeEndpoint('lmstudio', DEFAULT_ENDPOINTS.lmstudio);
    if (lmRes.connected) {
      this.config.provider = 'lmstudio';
      this.config.endpoint = DEFAULT_ENDPOINTS.lmstudio;
      if (lmRes.models.length > 0 && !this.config.selectedModel) {
        this.config.selectedModel = lmRes.models[0].id;
      }
      return lmRes;
    }

    // 4. Scan LocalAI (port 8080)
    const localAiRes = await this.probeEndpoint('localai', DEFAULT_ENDPOINTS.localai);
    if (localAiRes.connected) {
      this.config.provider = 'localai';
      this.config.endpoint = DEFAULT_ENDPOINTS.localai;
      if (localAiRes.models.length > 0 && !this.config.selectedModel) {
        this.config.selectedModel = localAiRes.models[0].id;
      }
      return localAiRes;
    }

    return {
      connected: false,
      provider: this.config.provider,
      endpoint: this.config.endpoint,
      models: [],
    };
  }

  async probeEndpoint(
    provider: AIProvider,
    endpoint: string
  ): Promise<{
    connected: boolean;
    provider: AIProvider;
    endpoint: string;
    models: AIModel[];
  }> {
    try {
      const cleanEndpoint = endpoint.replace(/\/+$/, '');
      if (provider === 'ollama') {
        const res = await this.safeGet(`${cleanEndpoint}/api/tags`);
        if (res.ok && res.data?.models) {
          const models: AIModel[] = res.data.models.map((m: any) => ({
            id: m.name,
            name: m.name,
            size: m.size ? `${(m.size / (1024 * 1024 * 1024)).toFixed(1)} GB` : undefined,
            parameterSize: m.details?.parameter_size,
            family: m.details?.family,
          }));
          return { connected: true, provider: 'ollama', endpoint: cleanEndpoint, models };
        }
      } else {
        // OpenAI-compatible endpoint (LM Studio, LocalAI, vLLM, custom)
        const res = await this.safeGet(`${cleanEndpoint}/v1/models`);
        if (res.ok && res.data?.data) {
          const models: AIModel[] = res.data.data.map((m: any) => ({
            id: m.id,
            name: m.id,
            size: m.owned_by,
          }));
          return { connected: true, provider, endpoint: cleanEndpoint, models };
        }
      }
    } catch {}

    return { connected: false, provider, endpoint, models: [] };
  }

  /**
   * Build Grok-like prompt based on mode and post context
   */
  buildGrokPrompt(mode: GrokActionMode, post: BskyPost, threadContext?: string): string {
    const postText = post.record?.text || '';
    const authorHandle = post.author?.handle ? `@${post.author.handle}` : 'User';
    const authorName = post.author?.displayName || authorHandle;

    switch (mode) {
      case 'explain':
        return `Explain the context, background, and cultural/news references of this Bluesky post by ${authorName} (${authorHandle}):\n\n"${postText}"\n\nProvide a concise, insightful explanation highlighting why this is relevant, any subtext or terminology used, and background facts.`;

      case 'factcheck':
        return `Fact-check and critically analyze the claims or assertions in this Bluesky post by ${authorName} (${authorHandle}):\n\n"${postText}"\n\nBreak down:\n1. Key verifiable claims made\n2. Context or nuance often missed\n3. Objective reality or evidence status\nKeep the tone balanced, sharp, and factual.`;

      case 'summarize':
        return `Summarize this Bluesky discussion started by ${authorName}:\n\nOriginal Post: "${postText}"\n\n${
          threadContext ? `Discussion replies:\n${threadContext}\n\n` : ''
        }Give a punchy synopsis of the conversation, main arguments, and key viewpoints expressed.`;

      case 'reply':
        return `Draft 3 distinct, high-quality reply options to this Bluesky post by ${authorName}:\n\n"${postText}"\n\nProvide:\n1. [Clever / Witty Reply]\n2. [Thoughtful / Agreeing Reply]\n3. [Sharp / Counter-argument / Alternative perspective]\nKeep each under 280 characters so it fits a Bluesky post.`;

      case 'roast':
        return `Channel Grok Fun-Mode and write a sharp, hilarious, witty roast of this Bluesky post (and poster):\n\nAuthor: ${authorName} (${authorHandle})\nPost: "${postText}"\n\nMake it playful, savage, and funny without violating basic safety.`;

      case 'translate':
        return `Translate the following Bluesky post into clear, modern English (or if already in English, translate into Spanish, German, French, and Japanese):\n\n"${postText}"`;

      case 'freeform':
      default:
        return `Regarding this Bluesky post by ${authorName} (${authorHandle}):\n"${postText}"\n\nWhat would you like to know or discuss about it?`;
    }
  }

  /**
   * Stream completion from local AI (Ollama or OpenAI-compatible)
   */
  async streamChat(
    messages: { role: string; content: string }[],
    onChunk: (chunk: string) => void,
    signal?: AbortSignal
  ): Promise<string> {
    const cleanEndpoint = this.config.endpoint.replace(/\/+$/, '');
    const model = this.config.selectedModel;

    let fullText = '';

    if (this.config.provider === 'ollama') {
      const res = await fetch(`${cleanEndpoint}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: model || 'llama3',
          messages,
          stream: true,
          options: {
            temperature: this.config.temperature,
          },
        }),
        signal,
      });

      if (!res.ok) {
        throw new Error(`Ollama error: HTTP ${res.status} ${res.statusText}`);
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error('Response body is not readable');
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const text = decoder.decode(value, { stream: true });
        const lines = text.split('\n').filter(Boolean);
        for (const line of lines) {
          try {
            const parsed = JSON.parse(line);
            if (parsed.message?.content) {
              const delta = parsed.message.content;
              fullText += delta;
              onChunk(delta);
            }
          } catch {}
        }
      }
    } else {
      // OpenAI format (LM Studio, LocalAI, vLLM)
      const res = await fetch(`${cleanEndpoint}/v1/chat/completions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: model || 'local-model',
          messages,
          temperature: this.config.temperature,
          stream: true,
        }),
        signal,
      });

      if (!res.ok) {
        throw new Error(`Local AI error: HTTP ${res.status} ${res.statusText}`);
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error('Response body is not readable');
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');
        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed.startsWith('data: ')) {
            const dataStr = trimmed.slice(6);
            if (dataStr === '[DONE]') continue;
            try {
              const parsed = JSON.parse(dataStr);
              const delta = parsed.choices?.[0]?.delta?.content || '';
              if (delta) {
                fullText += delta;
                onChunk(delta);
              }
            } catch {}
          }
        }
      }
    }

    return fullText;
  }
}
