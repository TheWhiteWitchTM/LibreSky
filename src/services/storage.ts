import { SessionData } from '../types/bsky';
import { AIProviderConfig } from '../types/ai';

const SESSION_KEY = 'libresky_session';
const AI_CONFIG_KEY = 'libresky_ai_config';
const DRAFTS_KEY = 'libresky_drafts';
const BOOKMARKS_KEY = 'libresky_bookmarks';
const ACCENT_KEY = 'libresky_accent';

export const storage = {
  // Session
  getSession(): SessionData | null {
    try {
      const data = localStorage.getItem(SESSION_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  setSession(session: SessionData | null) {
    if (session) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    } else {
      localStorage.removeItem(SESSION_KEY);
    }
  },

  // AI Configuration
  getAIConfig(): AIProviderConfig {
    try {
      const data = localStorage.getItem(AI_CONFIG_KEY);
      if (data) return JSON.parse(data);
    } catch {}

    return {
      provider: 'ollama',
      endpoint: 'http://127.0.0.1:11434',
      selectedModel: '',
      temperature: 0.7,
      systemPrompt: 'You are LibreSky AI, an intelligent, objective, sharp, and concise assistant embedded in LibreSky Bluesky client.',
      isCustom: false,
    };
  },

  setAIConfig(config: AIProviderConfig) {
    localStorage.setItem(AI_CONFIG_KEY, JSON.stringify(config));
  },

  // Drafts
  getDraft(): string {
    return localStorage.getItem(DRAFTS_KEY) || '';
  },

  setDraft(text: string) {
    localStorage.setItem(DRAFTS_KEY, text);
  },

  // Bookmarks
  getBookmarks(): string[] {
    try {
      const data = localStorage.getItem(BOOKMARKS_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  toggleBookmark(uri: string): boolean {
    const list = this.getBookmarks();
    const index = list.indexOf(uri);
    let added = false;
    if (index >= 0) {
      list.splice(index, 1);
      added = false;
    } else {
      list.unshift(uri);
      added = true;
    }
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(list));
    return added;
  },

  isBookmarked(uri: string): boolean {
    return this.getBookmarks().includes(uri);
  },

  // Accent Color
  getAccent(): string {
    return localStorage.getItem(ACCENT_KEY) || 'cyan'; // 'cyan' | 'purple' | 'emerald' | 'amber' | 'rose'
  },

  setAccent(accent: string) {
    localStorage.setItem(ACCENT_KEY, accent);
  },
};
