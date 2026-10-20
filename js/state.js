// LibreSky Application State
const STORAGE_PREFIX = 'libresky:';

function loadJson(key, fallback) {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (err) {
    console.error('Failed to load ' + key, err);
    return fallback;
  }
}

function saveJson(key, val) {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(val));
  } catch (err) {
    console.error('Failed to save ' + key, err);
  }
}

export const state = {
  // Session & Authentication
  session: loadJson('session', null),
  savedAccounts: loadJson('accounts', []),
  pdsUrl: localStorage.getItem(STORAGE_PREFIX + 'pds') || 'https://bsky.social',

  // Navigation & Views
  view: 'timeline', // 'timeline', 'discover', 'search', 'notifications', 'chat', 'bookmarks', 'profile', 'thread', 'settings'
  feedTab: 'following', // 'following', 'discover', 'whatshot'
  activeThreadUri: null,
  activeProfileActor: null,
  activeSearchQuery: '',
  searchTab: 'posts', // 'posts' | 'actors'

  // Feeds & Cache
  timelinePosts: [],
  timelineCursor: null,
  discoverPosts: [],
  discoverCursor: null,
  notifications: [],
  notificationsCursor: null,
  unreadCount: 0,
  bookmarks: loadJson('bookmarks', []),
  savedDrafts: loadJson('drafts', []),

  // Local AI State
  ai: {
    endpoint: localStorage.getItem(STORAGE_PREFIX + 'ai_endpoint') || 'http://127.0.0.1:11434',
    type: 'ollama', // 'ollama' or 'lmstudio'
    connected: false,
    models: [],
    activeModel: localStorage.getItem(STORAGE_PREFIX + 'ai_model') || '',
    persona: localStorage.getItem(STORAGE_PREFIX + 'ai_persona') || 'grok',
    messages: [
      {
        role: 'system',
        content: 'You are LibreSky AI, a witty, sharp, and helpful local assistant inspired by Grok and paired with Bluesky. Be direct, sovereign, and concise.',
      },
    ],
    streaming: false,
  },

  // App Settings & Theme
  theme: localStorage.getItem(STORAGE_PREFIX + 'theme') || 'black',
  grokOpen: window.innerWidth >= 1200,
  lightbox: null, // { images: [], index: 0 }
};

export function setSession(newSession) {
  state.session = newSession;
  saveJson('session', newSession);
  if (newSession && newSession.did) {
    const list = state.savedAccounts.filter((a) => a.did !== newSession.did);
    list.unshift({
      did: newSession.did,
      handle: newSession.handle,
      avatar: newSession.avatar,
      displayName: newSession.displayName,
      pdsUrl: state.pdsUrl,
    });
    state.savedAccounts = list;
    saveJson('accounts', list);
  }
}

export function clearSession() {
  state.session = null;
  localStorage.removeItem(STORAGE_PREFIX + 'session');
}

export function saveBookmarks() {
  saveJson('bookmarks', state.bookmarks);
}

export function toggleBookmark(post) {
  const uri = post?.uri || post?.post?.uri;
  if (!uri) return false;
  const idx = state.bookmarks.findIndex((b) => (b.uri || b.post?.uri) === uri);
  if (idx >= 0) {
    state.bookmarks.splice(idx, 1);
    saveBookmarks();
    return false;
  } else {
    state.bookmarks.unshift(post);
    saveBookmarks();
    return true;
  }
}

export function isBookmarked(uri) {
  return state.bookmarks.some((b) => (b.uri || b.post?.uri) === uri);
}

export function saveAiSettings() {
  localStorage.setItem(STORAGE_PREFIX + 'ai_endpoint', state.ai.endpoint);
  localStorage.setItem(STORAGE_PREFIX + 'ai_model', state.ai.activeModel);
  localStorage.setItem(STORAGE_PREFIX + 'ai_persona', state.ai.persona);
}

export function setTheme(name) {
  state.theme = name;
  document.documentElement.setAttribute('data-theme', name);
  localStorage.setItem(STORAGE_PREFIX + 'theme', name);
}
