import { getPreferences, patchPreferences, readClientSettings, writeClientSettings } from './api.js';
import {
  AI_PREF_TYPE,
  adoptLocalFromCloud,
  aiAccountSynced,
  aiFromPreference,
  aiPreference,
  claimLegacyAi,
  listRemoteAi,
  loadAi,
  setAiAccountSynced,
  storeAiAccount,
  watchAiAccount,
} from './ai.js';
import { languagePrefs, saveLanguagePrefs } from './lang.js';
import {
  currentDid,
  draftSynced,
  loadDraft,
  mutedWords,
  saveDraft,
  setDraftSynced,
  setMutedWords,
  setSoundPrefs,
  signedIn,
  soundPrefs,
  watchDraft,
} from './session.js';
import { learnedWordList, replaceLearnedWords, watchWords } from './words.js';

const FEEDS_KEY = 'libresky.feedViews';
const THREAD_KEY = 'libresky.thread';
const SEARCH_KEY = 'libresky.search';
const VOICE_KEY = 'libresky.voice';
const EMOJI_KEY = 'libresky.emoji';
const THEME_KEY = 'libresky.theme';
const A11Y_KEY = 'libresky.a11y';
const THEMES = new Set(['light', 'dark', 'contrast-light', 'contrast-dark']);
const CALL_KEY = 'libresky.calls';
const CALL_ALLOWS = new Set(['all', 'following', 'none']);
const FOLLOW_KEY = 'libresky.followDesk';
const FOLLOW_HOLD_KEY = 'libresky.followHold';
const FOLLOW_DAY_KEY = 'libresky.followBackDay';
const FOLLOW_CAPS = new Set([20, 40, 100]);
const FEED_TYPE = 'app.bsky.actor.defs#feedViewPref';
const THREAD_TYPE = 'app.bsky.actor.defs#threadViewPref';
const MUTED_TYPE = 'app.bsky.actor.defs#mutedWordsPref';
const DRAFT_TYPE = 'app.bsky.actor.defs#libreskyDraft';
const WORDS_TYPE = 'app.bsky.actor.defs#libreskyWords';
const SORTS = new Set(['oldest', 'newest', 'most-likes', 'random', 'hotness']);
const SENSITIVE = new Set(['porn', 'sexual', 'nudity', 'graphic-media', 'gore']);

let mutedItems = [];
const dirtyFeeds = new Set();
let dirtyThread = false;
let dirtyMuted = false;
let dirtyAi = false;
let dirtyDraft = false;
let dirtyWords = false;
let aiEpoch = 0;
let draftEpoch = 0;
let wordsEpoch = 0;
let dirtyClient = false;
let clientMissing = false;
let pulledDid = '';
let pullPromise = null;
let pushTimer = 0;
let onError = () => {};

function readJson(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeJson(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* private mode keeps the in-memory copy */ }
}

function flag(value, fallback) {
  return typeof value === 'boolean' ? value : fallback;
}

function clamp(value, min, max, fallback) {
  const num = Number(value);
  if (!Number.isFinite(num)) return fallback;
  return Math.max(min, Math.min(max, Math.round(num)));
}

function feedMap() {
  const saved = readJson(FEEDS_KEY);
  return saved && typeof saved === 'object' && !Array.isArray(saved) ? saved : {};
}

export function feedView(feedId) {
  const id = feedId || 'home';
  const saved = feedMap()[id] || {};
  const home = id === 'home';
  return {
    hideReplies: flag(saved.hideReplies, false),
    hideRepliesByUnfollowed: flag(saved.hideRepliesByUnfollowed, home),
    hideReposts: flag(saved.hideReposts, false),
    hideQuotePosts: flag(saved.hideQuotePosts, false),
  };
}

export function saveFeedView(feedId, partial) {
  const id = feedId || 'home';
  const next = { ...feedView(id), ...partial };
  const all = feedMap();
  all[id] = {
    hideReplies: Boolean(next.hideReplies),
    hideRepliesByUnfollowed: Boolean(next.hideRepliesByUnfollowed),
    hideReposts: Boolean(next.hideReposts),
    hideQuotePosts: Boolean(next.hideQuotePosts),
  };
  writeJson(FEEDS_KEY, all);
  dirtyFeeds.add(id);
  queueBluesky();
  return feedView(id);
}

export function threadPrefs() {
  const saved = readJson(THREAD_KEY) || {};
  return {
    sort: SORTS.has(saved.sort) ? saved.sort : 'oldest',
    prioritizeFollowedUsers: flag(saved.prioritizeFollowedUsers, true),
  };
}

export function saveThreadPrefs(partial) {
  const next = { ...threadPrefs(), ...partial };
  const saved = {
    sort: SORTS.has(next.sort) ? next.sort : 'oldest',
    prioritizeFollowedUsers: Boolean(next.prioritizeFollowedUsers),
  };
  writeJson(THREAD_KEY, saved);
  dirtyThread = true;
  queueBluesky();
  return threadPrefs();
}

export function searchPrefs() {
  const saved = readJson(SEARCH_KEY) || {};
  return {
    sort: saved.sort === 'top' ? 'top' : 'latest',
    following: flag(saved.following, false),
    hideReplies: flag(saved.hideReplies, false),
    languagesOnly: flag(saved.languagesOnly, false),
    hideSensitive: flag(saved.hideSensitive, false),
  };
}

export function saveSearchPrefs(partial) {
  const next = { ...searchPrefs(), ...partial };
  const saved = {
    sort: next.sort === 'top' ? 'top' : 'latest',
    following: Boolean(next.following),
    hideReplies: Boolean(next.hideReplies),
    languagesOnly: Boolean(next.languagesOnly),
    hideSensitive: Boolean(next.hideSensitive),
  };
  writeJson(SEARCH_KEY, saved);
  queueClient();
  return searchPrefs();
}

export function voicePrefs() {
  const saved = readJson(VOICE_KEY) || {};
  return {
    volume: clamp(saved.volume, 0, 100, 100),
    rate: clamp(saved.rate, 50, 200, 100),
    voiceURI: typeof saved.voiceURI === 'string' ? saved.voiceURI.slice(0, 300) : '',
  };
}

export function saveVoicePrefs(partial) {
  const next = { ...voicePrefs(), ...partial };
  const saved = {
    volume: clamp(next.volume, 0, 100, 100),
    rate: clamp(next.rate, 50, 200, 100),
    voiceURI: typeof next.voiceURI === 'string' ? next.voiceURI.slice(0, 300) : '',
  };
  writeJson(VOICE_KEY, saved);
  queueClient();
  return voicePrefs();
}

export function callAllow() {
  const saved = readJson(CALL_KEY);
  return CALL_ALLOWS.has(saved?.allow) ? saved.allow : 'all';
}

export function saveCallAllow(allow) {
  const next = CALL_ALLOWS.has(allow) ? allow : 'all';
  writeJson(CALL_KEY, { allow: next });
  queueClient();
  return next;
}

export function followDeskPrefs() {
  const saved = readJson(FOLLOW_KEY) || {};
  const cap = Number(saved.cap);
  return {
    auto: flag(saved.auto, false),
    skipSpam: flag(saved.skipSpam, true),
    cap: FOLLOW_CAPS.has(cap) ? cap : 40,
  };
}

export function saveFollowDeskPrefs(partial) {
  const next = { ...followDeskPrefs(), ...partial };
  const cap = Number(next.cap);
  const saved = {
    auto: Boolean(next.auto),
    skipSpam: Boolean(next.skipSpam),
    cap: FOLLOW_CAPS.has(cap) ? cap : 40,
  };
  writeJson(FOLLOW_KEY, saved);
  queueClient();
  return followDeskPrefs();
}

function followMap(key) {
  const saved = readJson(key);
  return saved && typeof saved === 'object' && !Array.isArray(saved) ? saved : {};
}

export function followHoldSet(did) {
  if (!did) return new Set();
  const list = followMap(FOLLOW_HOLD_KEY)[did];
  return new Set((Array.isArray(list) ? list : []).filter((item) => typeof item === 'string' && item.startsWith('did:')));
}

export function holdFollowTargets(owner, targets) {
  if (!owner) return new Set();
  const map = followMap(FOLLOW_HOLD_KEY);
  const set = followHoldSet(owner);
  (targets || []).forEach((id) => {
    if (typeof id === 'string' && id.startsWith('did:')) set.add(id);
  });
  const list = [...set].slice(-400);
  map[owner] = list;
  writeJson(FOLLOW_HOLD_KEY, map);
  return new Set(list);
}

export function dropFollowHold(owner, target) {
  if (!owner || !target) return;
  const map = followMap(FOLLOW_HOLD_KEY);
  const list = (Array.isArray(map[owner]) ? map[owner] : []).filter((id) => id !== target);
  if (list.length) map[owner] = list;
  else delete map[owner];
  writeJson(FOLLOW_HOLD_KEY, map);
}

export function releaseFollowHold(owner) {
  const map = followMap(FOLLOW_HOLD_KEY);
  if (owner) delete map[owner];
  writeJson(FOLLOW_HOLD_KEY, map);
}

function localDay(now = new Date()) {
  const date = now instanceof Date ? now : new Date(now);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

export function followBackToday(owner, now = new Date()) {
  if (!owner) return 0;
  const row = followMap(FOLLOW_DAY_KEY)[owner];
  if (!row || row.day !== localDay(now)) return 0;
  return Number(row.count) || 0;
}

export function noteFollowBack(owner, count = 1, now = new Date()) {
  if (!owner) return 0;
  const map = followMap(FOLLOW_DAY_KEY);
  const day = localDay(now);
  const prev = map[owner]?.day === day ? Number(map[owner].count) || 0 : 0;
  const next = prev + Math.max(0, Number(count) || 0);
  map[owner] = { day, count: next };
  writeJson(FOLLOW_DAY_KEY, map);
  return next;
}

export function callMayRing({ allow = 'all', followed = false, accepted = false } = {}) {
  if (allow === 'none') return false;
  if (allow === 'following') return Boolean(followed);
  return Boolean(followed || accepted);
}

export function callIsRequest({ allow = 'all', followed = false, accepted = false } = {}) {
  if (allow !== 'all') return false;
  return !followed && !accepted;
}

export function syncMutedWords(list) {
  const words = [];
  (Array.isArray(list) ? list : []).forEach((word) => {
    const clean = String(word || '').trim().slice(0, 100);
    if (!clean || words.some((item) => item.toLowerCase() === clean.toLowerCase())) return;
    words.push(clean);
  });
  mutedItems = words.map((word) => {
    const prev = mutedItems.find((item) => String(item?.value || '').toLowerCase() === word.toLowerCase());
    if (prev) return { ...prev, value: word };
    return {
      id: Math.random().toString(36).slice(2, 10),
      value: word,
      targets: ['content', 'tag'],
      actorTarget: 'all',
    };
  });
  setMutedWords(words);
  dirtyMuted = true;
  queueBluesky();
  return words;
}

export function syncClientPrefs() {
  queueClient();
}

export function setPrefsError(fn) {
  onError = typeof fn === 'function' ? fn : () => {};
}

function queueClient() {
  dirtyClient = true;
  schedule();
}

function queueBluesky() {
  schedule();
}

function schedule() {
  clearTimeout(pushTimer);
  pushTimer = setTimeout(() => { flush(); }, 450);
}

function followed(actor, did) {
  if (!actor?.did) return false;
  if (actor.did === did) return true;
  return Boolean(actor.viewer?.following);
}

export function homeAllows(item, prefs, did = '') {
  const reason = String(item?.reason?.$type || '');
  const repost = reason.includes('reasonRepost');
  if (repost && prefs?.hideReposts) return false;
  const post = item?.post || item;
  const embed = String(post?.embed?.$type || '');
  const quote = embed.includes('recordWithMedia') || embed.endsWith('record#view');
  if (quote && prefs?.hideQuotePosts) return false;
  if (repost) return true;
  const reply = item?.reply || post?.record?.reply;
  if (!reply) return true;
  if (prefs?.hideReplies) return false;
  if (!prefs?.hideRepliesByUnfollowed) return true;
  const parent = item?.reply?.parent?.author;
  const root = item?.reply?.root?.author;
  const authorDid = post?.author?.did;
  if (parent?.did && parent.did === authorDid) return true;
  if (!parent?.did && !root?.did) return true;
  return followed(parent, did) || followed(root, did);
}

export function searchAllows(post, prefs, context = {}) {
  if (!post) return false;
  if (prefs?.hideReplies && post.record?.reply) return false;
  if (prefs?.following) {
    const author = post.author || {};
    if (author.did !== context.did && !author.viewer?.following) return false;
  }
  if (prefs?.hideSensitive && (post.labels || []).some((label) => SENSITIVE.has(label?.val))) return false;
  if (prefs?.languagesOnly) {
    const langs = post.record?.langs || post.langs || [];
    const wanted = context.languages || [];
    if (wanted.length) {
      const known = langs.map((code) => String(code || '').toLowerCase().split('-')[0]);
      if (!known.length || !known.some((code) => wanted.includes(code))) return false;
    }
  }
  return true;
}

export function sortThreadReplies(replies, prefs, did = '') {
  const list = (replies || []).slice();
  const stamp = (node) => Date.parse(node?.post?.record?.createdAt || node?.post?.indexedAt || '') || 0;
  const likes = (node) => Number(node?.post?.likeCount) || 0;
  const close = (node) => {
    const author = node?.post?.author;
    if (!author?.did) return 0;
    if (author.did === did || author.viewer?.following) return 1;
    return 0;
  };
  if (prefs?.sort === 'random') {
    for (let i = list.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [list[i], list[j]] = [list[j], list[i]];
    }
    return list;
  }
  list.sort((a, b) => {
    if (prefs?.prioritizeFollowedUsers) {
      const delta = close(b) - close(a);
      if (delta) return delta;
    }
    if (prefs?.sort === 'newest') return stamp(b) - stamp(a);
    if (prefs?.sort === 'most-likes' || prefs?.sort === 'hotness') return likes(b) - likes(a);
    return stamp(a) - stamp(b);
  });
  return list;
}

function storeFeed(all, pref) {
  const id = String(pref?.feed || '');
  if (!id) return;
  const row = {};
  if (typeof pref.hideReplies === 'boolean') row.hideReplies = pref.hideReplies;
  if (typeof pref.hideRepliesByUnfollowed === 'boolean') row.hideRepliesByUnfollowed = pref.hideRepliesByUnfollowed;
  if (typeof pref.hideReposts === 'boolean') row.hideReposts = pref.hideReposts;
  if (typeof pref.hideQuotePosts === 'boolean') row.hideQuotePosts = pref.hideQuotePosts;
  all[id] = row;
}

function applyBluesky(preferences) {
  const list = Array.isArray(preferences) ? preferences : [];
  const feeds = feedMap();
  let sawFeed = false;
  list.forEach((pref) => {
    if (pref?.$type === FEED_TYPE && pref.feed) {
      storeFeed(feeds, pref);
      sawFeed = true;
    }
  });
  if (sawFeed) writeJson(FEEDS_KEY, feeds);
  const thread = list.find((pref) => pref?.$type === THREAD_TYPE);
  if (thread) {
    writeJson(THREAD_KEY, {
      sort: SORTS.has(thread.sort) ? thread.sort : 'oldest',
      prioritizeFollowedUsers: thread.prioritizeFollowedUsers !== false,
    });
  }
  const muted = list.find((pref) => pref?.$type === MUTED_TYPE);
  if (!muted) return false;
  const words = [];
  mutedItems = [];
  (muted.items || []).forEach((item) => {
    const value = String(item?.value || '').trim();
    if (!value || words.some((word) => word.toLowerCase() === value.toLowerCase())) return;
    words.push(value);
    mutedItems.push({ ...item, value });
  });
  setMutedWords(words);
  return true;
}

function recentEmoji() {
  const list = readJson(EMOJI_KEY);
  return Array.isArray(list) ? list.filter((item) => typeof item === 'string').slice(0, 24) : [];
}

function applyClient(record) {
  if (!record || typeof record !== 'object') return '';
  if (record.sounds && typeof record.sounds === 'object') {
    setSoundPrefs({
      chat: record.sounds.chat,
      notifications: record.sounds.notifications,
      posts: record.sounds.posts,
      volume: record.sounds.volume,
    });
  }
  if (record.voice && typeof record.voice === 'object') {
    writeJson(VOICE_KEY, {
      volume: clamp(record.voice.volume, 0, 100, 100),
      rate: clamp(record.voice.rate, 50, 200, 100),
      voiceURI: typeof record.voice.voiceURI === 'string' ? record.voice.voiceURI.slice(0, 300) : '',
    });
  }
  if (record.search && typeof record.search === 'object') {
    writeJson(SEARCH_KEY, {
      sort: record.search.sort === 'top' ? 'top' : 'latest',
      following: Boolean(record.search.following),
      hideReplies: Boolean(record.search.hideReplies),
      languagesOnly: Boolean(record.search.languagesOnly),
      hideSensitive: Boolean(record.search.hideSensitive),
    });
  }
  if (record.languages && typeof record.languages === 'object') saveLanguagePrefs(record.languages);
  if (Array.isArray(record.emoji)) writeJson(EMOJI_KEY, record.emoji.filter((item) => typeof item === 'string').slice(0, 24));
  if (record.calls && CALL_ALLOWS.has(record.calls.allow)) writeJson(CALL_KEY, { allow: record.calls.allow });
  if (record.follows && typeof record.follows === 'object') {
    const cap = Number(record.follows.cap);
    writeJson(FOLLOW_KEY, {
      auto: Boolean(record.follows.auto),
      skipSpam: typeof record.follows.skipSpam === 'boolean' ? record.follows.skipSpam : true,
      cap: FOLLOW_CAPS.has(cap) ? cap : 40,
    });
  }
  if (record.a11y && typeof record.a11y === 'object') {
    writeJson(A11Y_KEY, {
      reader: Boolean(record.a11y.reader),
      scale: snapScale(record.a11y.scale),
    });
  }
  if (THEMES.has(record.theme)) {
    try { localStorage.setItem(THEME_KEY, record.theme); } catch { /* the screen still follows the record */ }
    return record.theme;
  }
  return '';
}

function snapScale(value) {
  const num = clamp(value, 100, 200, 100);
  return Math.max(100, Math.min(200, Math.round(num / 25) * 25));
}

export function a11yPrefs() {
  const saved = readJson(A11Y_KEY) || {};
  return {
    reader: flag(saved.reader, false),
    scale: snapScale(saved.scale),
  };
}

export function saveA11yPrefs(partial) {
  const next = { ...a11yPrefs(), ...partial };
  const saved = {
    reader: Boolean(next.reader),
    scale: snapScale(next.scale),
  };
  writeJson(A11Y_KEY, saved);
  queueClient();
  return a11yPrefs();
}

function themeName() {
  try {
    const saved = localStorage.getItem(THEME_KEY);
    if (THEMES.has(saved)) return saved;
  } catch { /* the screen still follows the default */ }
  return 'light';
}

function clientRecord() {
  return {
    sounds: soundPrefs(),
    voice: voicePrefs(),
    search: searchPrefs(),
    languages: languagePrefs(),
    theme: themeName(),
    a11y: a11yPrefs(),
    emoji: recentEmoji(),
    calls: { allow: callAllow() },
    follows: followDeskPrefs(),
  };
}

function mutedPayload() {
  return { $type: MUTED_TYPE, items: mutedItems };
}

function writeFeed(list, feedId) {
  let pref = list.find((item) => item?.$type === FEED_TYPE && item.feed === feedId);
  if (!pref) {
    pref = { $type: FEED_TYPE, feed: feedId };
    list.push(pref);
  }
  const next = feedView(feedId);
  pref.hideReplies = next.hideReplies;
  pref.hideRepliesByUnfollowed = next.hideRepliesByUnfollowed;
  pref.hideReposts = next.hideReposts;
  pref.hideQuotePosts = next.hideQuotePosts;
}

function replacePref(list, type, payload) {
  const index = list.findIndex((item) => item?.$type === type);
  if (!payload) {
    if (index >= 0) list.splice(index, 1);
    return;
  }
  if (index >= 0) list[index] = payload;
  else list.push(payload);
}

function sameWords(left, right) {
  if (left.length !== right.length) return false;
  return left.every((word, index) => word.toLowerCase() === String(right[index] || '').toLowerCase());
}

function mergeWords(local, remote) {
  const next = [];
  [...local, ...remote].forEach((word) => {
    const clean = String(word || '').trim();
    if (!clean || next.some((item) => item.toLowerCase() === clean.toLowerCase())) return;
    next.push(clean);
  });
  return next.slice(0, 400);
}

function applyPulledAi(list, did) {
  if (dirtyAi) return false;
  claimLegacyAi(did);
  const remote = aiFromPreference(list.find((item) => item?.$type === AI_PREF_TYPE));
  if (remote?.provider === 'local') {
    adoptLocalFromCloud(remote);
    storeAiAccount(did, null, true);
    dirtyAi = true;
    return true;
  }
  if (remote) {
    const before = listRemoteAi().map((item) => `${item.id}:${item.provider}:${item.model}:${item.apiKey}`).join('|');
    const current = loadAi();
    storeAiAccount(did, remote, true);
    const after = listRemoteAi().map((item) => `${item.id}:${item.provider}:${item.model}:${item.apiKey}`).join('|');
    return before !== after || !current || current.apiKey !== remote.apiKey || current.provider !== remote.provider || current.model !== remote.model || current.base !== remote.base || current.id !== remote.id;
  }
  if (loadAi() && !aiAccountSynced(did)) {
    dirtyAi = true;
    return false;
  }
  if (loadAi() && aiAccountSynced(did)) {
    storeAiAccount(did, null, false);
    return true;
  }
  return false;
}

function applyPulledDraft(list, did) {
  if (dirtyDraft) return false;
  const pref = list.find((item) => item?.$type === DRAFT_TYPE);
  const remote = typeof pref?.text === 'string' ? pref.text.slice(0, 2000) : '';
  const local = loadDraft();
  if (remote) {
    if (local !== remote) saveDraft(remote, { quiet: true });
    setDraftSynced(did, true);
    return local !== remote;
  }
  if (local && !draftSynced(did)) {
    dirtyDraft = true;
    return false;
  }
  if (local && draftSynced(did)) {
    saveDraft('', { quiet: true });
    setDraftSynced(did, true);
    return true;
  }
  return false;
}

function applyPulledWords(list) {
  if (dirtyWords) return false;
  const pref = list.find((item) => item?.$type === WORDS_TYPE);
  const remote = Array.isArray(pref?.items) ? pref.items.filter((word) => typeof word === 'string') : [];
  const local = learnedWordList();
  if (!remote.length && !local.length) return false;
  const merged = mergeWords(local, remote);
  const changed = !sameWords(local, merged);
  if (changed) replaceLearnedWords(merged, { quiet: true });
  if (!sameWords(merged, remote)) dirtyWords = true;
  return changed;
}

export async function commitAiAccount(input) {
  const did = currentDid();
  if (!signedIn() || !did) throw new Error('Sign in to save the key on your account.');
  if (pullPromise) {
    try { await pullPromise; } catch { /* a failed read can still try to save */ }
  }
  if (currentDid() !== did) throw new Error('Sign in to save the key on your account.');
  if (input) storeAiAccount(did, input, false);
  else storeAiAccount(did, null, false);
  let wrote = false;
  try {
    await patchPreferences((list) => {
      if (currentDid() !== did) return list;
      replacePref(list, AI_PREF_TYPE, aiPreference(loadAi()));
      wrote = true;
      return list;
    });
    if (!wrote || currentDid() !== did) throw new Error('Sign in to save the key on your account.');
    setAiAccountSynced(did, Boolean(loadAi()));
    dirtyAi = false;
  } catch (error) {
    dirtyAi = true;
    schedule();
    throw error;
  }
}

async function pushBluesky() {
  const feeds = [...dirtyFeeds];
  const thread = dirtyThread;
  const muted = dirtyMuted;
  const ai = dirtyAi;
  const draft = dirtyDraft;
  const words = dirtyWords;
  if (!feeds.length && !thread && !muted && !ai && !draft && !words) return;
  dirtyFeeds.clear();
  dirtyThread = false;
  dirtyMuted = false;
  dirtyAi = false;
  dirtyDraft = false;
  dirtyWords = false;
  const did = currentDid();
  try {
    await patchPreferences((list) => {
      feeds.forEach((feedId) => writeFeed(list, feedId));
      if (thread) {
        let pref = list.find((item) => item?.$type === THREAD_TYPE);
        if (!pref) {
          pref = { $type: THREAD_TYPE };
          list.push(pref);
        }
        const next = threadPrefs();
        pref.sort = next.sort;
        pref.prioritizeFollowedUsers = next.prioritizeFollowedUsers;
      }
      if (muted) {
        const payload = mutedPayload();
        const pref = list.find((item) => item?.$type === MUTED_TYPE);
        if (!pref) list.push(payload);
        else pref.items = payload.items;
      }
      if (currentDid() !== did) return list;
      if (ai) replacePref(list, AI_PREF_TYPE, aiPreference(loadAi()));
      if (draft) {
        const text = loadDraft();
        replacePref(list, DRAFT_TYPE, text ? { $type: DRAFT_TYPE, text } : null);
      }
      if (words) {
        const items = learnedWordList();
        replacePref(list, WORDS_TYPE, items.length ? { $type: WORDS_TYPE, items } : null);
      }
      return list;
    });
    if (currentDid() === did) {
      if (ai) setAiAccountSynced(did, Boolean(loadAi()));
      if (draft) setDraftSynced(did, true);
    }
  } catch (error) {
    feeds.forEach((feedId) => dirtyFeeds.add(feedId));
    if (thread) dirtyThread = true;
    if (muted) dirtyMuted = true;
    if (ai) dirtyAi = true;
    if (draft) dirtyDraft = true;
    if (words) dirtyWords = true;
    throw error;
  }
}

async function pushClient() {
  if (!dirtyClient && !clientMissing) return;
  const record = clientRecord();
  dirtyClient = false;
  const missing = clientMissing;
  clientMissing = false;
  try {
    await writeClientSettings(record);
  } catch (error) {
    dirtyClient = true;
    if (missing) clientMissing = true;
    throw error;
  }
}

async function flush() {
  if (pullPromise) {
    try { await pullPromise; } catch { /* a failed read can still try to save */ }
  }
  if (!signedIn() || !pulledDid || currentDid() !== pulledDid) return;
  try {
    await pushBluesky();
    await pushClient();
  } catch (error) {
    onError(error);
  }
  if ((dirtyClient || clientMissing || dirtyThread || dirtyMuted || dirtyFeeds.size || dirtyAi || dirtyDraft || dirtyWords) && signedIn()) schedule();
}

export async function pullAccountPrefs() {
  const did = currentDid();
  if (!signedIn() || !did) {
    pulledDid = '';
    return null;
  }
  const run = (async () => {
    const seenAi = aiEpoch;
    const seenDraft = draftEpoch;
    const seenWords = wordsEpoch;
    let theme = '';
    let hadMuted = true;
    let preferences = [];
    let sawPreferences = false;
    try {
      const data = await getPreferences();
      if (currentDid() !== did) return null;
      preferences = Array.isArray(data?.preferences) ? data.preferences : [];
      hadMuted = applyBluesky(preferences);
      sawPreferences = true;
    } catch {
      hadMuted = true;
    }
    let sawRecord = false;
    let record = null;
    try {
      record = await readClientSettings();
      sawRecord = true;
    } catch {
      sawRecord = false;
    }
    if (currentDid() !== did) return null;
    if (!sawRecord) clientMissing = false;
    else if (record) {
      theme = applyClient(record);
      clientMissing = false;
      dirtyClient = false;
    } else clientMissing = true;
    pulledDid = did;
    let aiChanged = false;
    let draftChanged = false;
    if (sawPreferences && currentDid() === did) {
      if (aiEpoch === seenAi) aiChanged = applyPulledAi(preferences, did);
      if (draftEpoch === seenDraft) draftChanged = applyPulledDraft(preferences, did);
      if (wordsEpoch === seenWords) applyPulledWords(preferences);
    }
    if (hadMuted) dirtyMuted = false;
    else if (!dirtyMuted && !mutedItems.length && mutedWords().length) syncMutedWords(mutedWords());
    else if (!dirtyMuted) mutedItems = [];
    if (clientMissing || dirtyMuted || dirtyAi || dirtyDraft || dirtyWords) schedule();
    return { theme, aiChanged, draftChanged };
  })();
  pullPromise = run.finally(() => {
    if (pullPromise === run) pullPromise = null;
  });
  return pullPromise;
}

function queueAccountChange(mark) {
  if (!signedIn() || !currentDid()) return;
  mark();
  schedule();
}

watchAiAccount(() => {
  queueAccountChange(() => {
    aiEpoch += 1;
    dirtyAi = true;
  });
});

watchDraft(() => {
  queueAccountChange(() => {
    draftEpoch += 1;
    dirtyDraft = true;
    setDraftSynced(currentDid(), false);
  });
});

watchWords(() => {
  queueAccountChange(() => {
    wordsEpoch += 1;
    dirtyWords = true;
  });
});
