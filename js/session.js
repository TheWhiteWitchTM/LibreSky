const PASSWORD_KEY = 'libresky.passwordSession';
const MUTED_KEY = 'libresky.mutedWords';
const DRAFT_KEY = 'libresky.draft';
const HANDLE_KEY = 'libresky.handle';

let password = null;
let oauth = null;

function readJson(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function loadPassword() {
  const saved = readJson(PASSWORD_KEY);
  if (saved?.accessJwt && saved?.did) {
    password = saved;
    return password;
  }
  const legacy = readJson('libresky:session');
  if (legacy?.accessJwt && legacy?.did) {
    password = {
      accessJwt: legacy.accessJwt,
      refreshJwt: legacy.refreshJwt || '',
      did: legacy.did,
      handle: legacy.handle || '',
      pds: localStorage.getItem('libresky:pds') || 'https://bsky.social',
      displayName: legacy.displayName || legacy.handle || '',
      avatar: legacy.avatar || '',
    };
    localStorage.setItem(PASSWORD_KEY, JSON.stringify(password));
  }
  return password;
}

export function getPassword() {
  return password;
}

export function setPassword(next) {
  password = next;
  if (next) {
    localStorage.setItem(PASSWORD_KEY, JSON.stringify(next));
    if (next.handle) setLastHandle(next.handle);
  } else localStorage.removeItem(PASSWORD_KEY);
}

export function lastHandle() {
  return localStorage.getItem(HANDLE_KEY) || '';
}

export function setLastHandle(handle) {
  const clean = String(handle || '').trim().replace(/^@/, '');
  if (clean) localStorage.setItem(HANDLE_KEY, clean);
}

export function getOauth() {
  return oauth;
}

export function setOauth(next) {
  oauth = next;
}

export function currentDid() {
  return oauth?.sub || password?.did || '';
}

export function signedIn() {
  return Boolean(oauth || password?.accessJwt);
}

export function mutedWords() {
  const list = readJson(MUTED_KEY);
  return Array.isArray(list) ? list.filter((word) => typeof word === 'string' && word.trim()) : [];
}

export function setMutedWords(list) {
  localStorage.setItem(MUTED_KEY, JSON.stringify(list));
}

let draftWatch = () => {};

export function watchDraft(fn) {
  draftWatch = typeof fn === 'function' ? fn : () => {};
}

function draftKeyFor(did) {
  return did ? `${DRAFT_KEY}:${did}` : DRAFT_KEY;
}

function draftSyncedKey(did) {
  return did ? `${DRAFT_KEY}:synced:${did}` : '';
}

export function loadDraft() {
  const did = currentDid();
  const key = draftKeyFor(did);
  try {
    const own = localStorage.getItem(key);
    if (own != null) return own;
    if (!did) return '';
    const legacy = localStorage.getItem(DRAFT_KEY);
    if (!legacy) return '';
    localStorage.setItem(key, legacy);
    localStorage.removeItem(DRAFT_KEY);
    return legacy;
  } catch {
    return '';
  }
}

export function saveDraft(text, options = {}) {
  const did = currentDid();
  const key = draftKeyFor(did);
  const value = String(text || '').slice(0, 2000);
  try {
    if (value) localStorage.setItem(key, value);
    else localStorage.removeItem(key);
    if (did) localStorage.removeItem(DRAFT_KEY);
  } catch {
    /* private mode keeps the draft for this view */
  }
  if (!options.quiet) draftWatch();
}

export function draftSynced(did = currentDid()) {
  const key = draftSyncedKey(did);
  if (!key) return false;
  try { return localStorage.getItem(key) === '1'; } catch { return false; }
}

export function setDraftSynced(did, synced) {
  const key = draftSyncedKey(did);
  if (!key) return;
  try {
    if (synced) localStorage.setItem(key, '1');
    else localStorage.removeItem(key);
  } catch {
    /* the next pull can still compare the text */
  }
}

const ROSTER_KEY = 'libresky.accounts';
const ACTIVE_KEY = 'libresky.activeDid';

export function listAccounts() {
  const list = readJson(ROSTER_KEY);
  if (!Array.isArray(list)) return [];
  return list.filter((item) => item && item.did && (item.kind === 'oauth' || item.kind === 'password'));
}

export function rememberAccount(entry) {
  if (!entry?.did || (entry.kind !== 'oauth' && entry.kind !== 'password')) return;
  const next = [entry, ...listAccounts().filter((item) => item.did !== entry.did)].slice(0, 8);
  localStorage.setItem(ROSTER_KEY, JSON.stringify(next));
  localStorage.setItem(ACTIVE_KEY, entry.did);
}

export function forgetAccount(did) {
  const next = listAccounts().filter((item) => item.did !== did);
  localStorage.setItem(ROSTER_KEY, JSON.stringify(next));
  if (localStorage.getItem(ACTIVE_KEY) === did) {
    if (next[0]) localStorage.setItem(ACTIVE_KEY, next[0].did);
    else localStorage.removeItem(ACTIVE_KEY);
  }
}

export function activeDid() {
  return localStorage.getItem(ACTIVE_KEY) || '';
}

export function setActiveDid(did) {
  if (did) localStorage.setItem(ACTIVE_KEY, did);
  else localStorage.removeItem(ACTIVE_KEY);
}

const SOUND_KEY = 'libresky.sounds';

function soundLevel(saved, key) {
  const num = Number(saved?.volume?.[key]);
  if (!Number.isFinite(num)) return 70;
  return Math.max(0, Math.min(100, Math.round(num)));
}

export function soundPrefs() {
  const saved = readJson(SOUND_KEY);
  if (!saved || typeof saved !== 'object') {
    return { chat: true, notifications: true, posts: false, volume: { chat: 70, notifications: 70, posts: 70 } };
  }
  return {
    chat: saved.chat !== false,
    notifications: saved.notifications !== false,
    posts: saved.posts === true,
    volume: {
      chat: soundLevel(saved, 'chat'),
      notifications: soundLevel(saved, 'notifications'),
      posts: soundLevel(saved, 'posts'),
    },
  };
}

export function setSoundPrefs(next) {
  const current = soundPrefs();
  const volume = { ...current.volume };
  if (next?.volume && typeof next.volume === 'object') {
    ['chat', 'notifications', 'posts'].forEach((key) => {
      if (next.volume[key] == null) return;
      const num = Number(next.volume[key]);
      if (Number.isFinite(num)) volume[key] = Math.max(0, Math.min(100, Math.round(num)));
    });
  }
  const saved = {
    chat: typeof next?.chat === 'boolean' ? next.chat : current.chat,
    notifications: typeof next?.notifications === 'boolean' ? next.notifications : current.notifications,
    posts: typeof next?.posts === 'boolean' ? next.posts : current.posts,
    volume,
  };
  localStorage.setItem(SOUND_KEY, JSON.stringify(saved));
  return saved;
}
