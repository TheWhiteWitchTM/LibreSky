import * as api from './api.js';
import { acceptCall, canCall, declineCall, hangUp, incomingCall, isInCall, setupCall, startCall } from './call.js';
import {
  actorHtml,
  avatar,
  callBannerHtml,
  collectionCardHtml,
  callConvoHtml,
  callStartHtml,
  callToolsHtml,
  chatHeaderHtml,
  hoverCardHtml,
  convoHtml,
  drainPosts,
  emptyHtml,
  feedHtml,
  linkPreviewHtml,
  assistantHtml,
  messageHtml,
  notificationsHtml,
  packHtml,
  postHtml,
  profileHtml,
  resetPosts,
  skeletons,
  speechText,
  threadList,
  trendsHtml,
} from './render.js';
import {
  activeDid,
  currentDid,
  forgetAccount,
  getOauth,
  getPassword,
  lastHandle,
  listAccounts,
  loadDraft,
  loadPassword,
  mutedWords,
  rememberAccount,
  saveDraft,
  setActiveDid,
  setLastHandle,
  setOauth,
  setPassword,
  setSoundPrefs,
  signedIn,
  soundPrefs,
} from './session.js';
import { AI_PROVIDERS, AI_SYSTEM, aiReady, askAi, clearAi, loadAi, prepareAi, providerById, saveAi } from './ai.js';
import { accountGone, aiTag, caretToken, caretWord, convoUnread, escapeHtml, firstUrl, graphemeLength, hostOf, messageSender, ownUnread, parseCallMessage, parseHash, profileHash, richText } from './util.js';
import { LANGUAGES, languagePrefs, postInLanguages, saveLanguagePrefs } from './lang.js';
import { completeWord, rememberWords } from './words.js';
import { icon } from './icons.js';
import { emojiGroups } from './emoji.js';
import {
  feedView,
  homeAllows,
  pullAccountPrefs,
  saveFeedView,
  saveSearchPrefs,
  saveThreadPrefs,
  saveVoicePrefs,
  searchAllows,
  searchPrefs,
  setPrefsError,
  sortThreadReplies,
  syncClientPrefs,
  syncMutedWords,
  threadPrefs,
  voicePrefs,
} from './prefs.js';

const posts = new Map();
const me = { profile: null };
let client = null;
let oauthReady = null;
let generation = 0;
let pager = null;
let selected = -1;
let searchSort = 'latest';
let exploreTab = 'foryou';
const trendCache = { at: 0, list: null, pending: null };
const EXPLORE_TABS = [
  { id: 'foryou', label: 'For you', match: () => true },
  { id: 'news', label: 'News', match: (trend) => trend.category === 'news' },
  { id: 'politics', label: 'Politics', match: (trend) => trend.category === 'politics' },
  { id: 'sports', label: 'Sports', match: (trend) => trend.category === 'sports' },
  { id: 'entertainment', label: 'Entertainment', match: (trend) => trend.category === 'entertainment' },
  { id: 'culture', label: 'Culture', match: (trend) => trend.category === 'culture' },
  { id: 'tech', label: 'Tech', match: (trend) => trend.category === 'science-tech' || trend.category === 'tech' },
];
let reportTarget = null;
let chatTimer = 0;
let badgeMemory = { notifications: null, chat: null, ring: '' };
const ignoredRings = new Set();
let suggestTimer = 0;
let suggestSeq = 0;
let suggestArea = null;
let tipTimer = 0;
let pickerMode = '';
let gifSeq = 0;
let gifTimer = 0;
let hoverTimer = 0;
let hoverHideTimer = 0;
let hoverSeq = 0;
let hoverActor = '';
let hoverWait = '';
const hoverProfiles = new Map();

function $(id) { return document.getElementById(id); }

function toast(message) {
  const node = document.createElement('div');
  node.className = 'toast';
  node.textContent = message;
  $('toasts').append(node);
  setTimeout(() => node.remove(), 3400);
}

function remember() {
  drainPosts().forEach((item, uri) => posts.set(uri, item));
}

function myDid() {
  return currentDid();
}

function account() {
  return me.profile || getPassword() || null;
}

function applyTheme(theme, options = {}) {
  const next = theme === 'dark' ? 'dark' : 'light';
  document.documentElement.dataset.theme = next;
  localStorage.setItem('libresky.theme', next);
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.content = next === 'dark' ? '#000000' : '#ffffff';
  if (!options.quiet) syncClientPrefs();
}

const MORE_NAV = new Set(['feeds', 'feed', 'lists', 'list', 'settings', 'packs', 'pack', 'downloads']);

function setChrome({ title, back = false, tabs = [], nav = '', tools = '' }) {
  $('title').textContent = title;
  $('back').hidden = !back;
  const toolBox = $('title-tools');
  if (toolBox) {
    toolBox.innerHTML = tools || '';
    delete toolBox.dataset.peer;
  }
  const bar = $('tabs');
  if (!tabs.length) {
    bar.hidden = true;
    bar.innerHTML = '';
  } else {
    bar.hidden = false;
    bar.innerHTML = tabs.map((tab) => `<a href="${escapeHtml(tab.href)}" aria-selected="${tab.on ? 'true' : 'false'}">${escapeHtml(tab.label)}</a>`).join('');
  }
  const current = MORE_NAV.has(nav) ? 'more' : nav;
  document.querySelectorAll('[data-nav]').forEach((link) => {
    link.classList.toggle('active', link.dataset.nav === current);
  });
  document.title = title === 'Home' || title === 'Discover' ? 'LibreSky' : `${title} — LibreSky`;
}

function showSkeletons() {
  resetPosts();
  $('view').innerHTML = skeletons();
}

function cancelled(token, error) {
  return token !== generation || error?.name === 'AbortError';
}

function pagerFor(cursor, more) {
  pager?.disconnect();
  pager = null;
  document.querySelectorAll('#view .sentinel').forEach((node) => node.remove());
  if (!cursor) return;
  const sentinel = document.createElement('div');
  sentinel.className = 'sentinel';
  $('view').append(sentinel);
  pager = new IntersectionObserver((entries) => {
    if (entries.some((entry) => entry.isIntersecting)) {
      pager.disconnect();
      more(cursor);
    }
  }, { rootMargin: '600px' });
  pager.observe(sentinel);
}

function filterDiscover(items) {
  const wanted = languagePrefs().content;
  if (!wanted.length) return items || [];
  return (items || []).filter((item) => postInLanguages(item?.post || item, wanted));
}

function languageButtons(kind, selected) {
  const on = new Set(selected || []);
  return LANGUAGES.map(([code, name]) => `<button type="button" class="lang-pick" data-act="lang-toggle" data-lang-kind="${kind}" data-lang="${code}" aria-pressed="${on.has(code) ? 'true' : 'false'}"><span>${code.toUpperCase()}</span>${escapeHtml(name)}</button>`).join('');
}

function muted(post) {
  const words = mutedWords();
  if (!words.length || !post) return false;
  const hay = `${post.record?.text || ''}\n${post.author?.displayName || ''}\n${post.author?.handle || ''}`.toLowerCase();
  return words.some((word) => hay.includes(word.toLowerCase()));
}

function paintFeed(items, { append = false, post = null } = {}) {
  const prepared = (items || []).map((item) => (muted(item.post || item) ? { ...item, muted: true } : item));
  resetPosts();
  const html = feedHtml(prepared, post || undefined);
  if (append) {
    const sentinel = $('view').querySelector('.sentinel');
    if (sentinel) sentinel.insertAdjacentHTML('beforebegin', html);
    else $('view').insertAdjacentHTML('beforeend', html);
  } else $('view').innerHTML = html || emptyHtml('Nothing here', 'There are no posts to show.');
  remember();
}

function clearBoot() {
  $('boot')?.remove();
}

function openGate() {
  document.documentElement.dataset.signedOut = '1';
  const input = $('login-handle');
  const saved = lastHandle();
  if (saved && input && !input.value) input.value = saved;
  const error = $('login-error');
  if (error) error.hidden = true;
  const dialog = $('login');
  if (dialog && !dialog.open) dialog.showModal();
  input?.focus();
}

function closeGate() {
  document.documentElement.removeAttribute('data-signed-out');
  if ($('login')?.open) $('login').close();
}

function requireSignIn() {
  openGate();
}

function updateAccount() {
  const profile = account();
  const name = profile?.displayName || profile?.handle || 'Sign in';
  const handle = profile?.handle ? `@${profile.handle}` : 'Bluesky account';
  $('account-name').textContent = name;
  $('account-handle').textContent = handle;
  const avatar = $('account-avatar');
  avatar.dataset.initial = (name.trim().charAt(0) || 'L').toUpperCase();
  avatar.innerHTML = profile?.avatar ? `<img src="${escapeHtml(profile.avatar)}" alt="">` : '';
  const href = profile?.handle ? profileHash(profile) : '#/';
  const nav = document.querySelector('[data-nav="profile"]');
  if (nav) nav.href = href;
  const mobile = document.querySelector('.tabbar a[aria-label="Profile"]');
  if (mobile) mobile.href = href;
}

async function loadMe() {
  const did = myDid();
  if (!did) {
    me.profile = null;
    updateAccount();
    refreshBadge();
    loadRail();
    return;
  }
  try {
    me.profile = await api.getProfile(did);
    if (me.profile?.handle) setLastHandle(me.profile.handle);
    if (getPassword()) {
      const session = getPassword();
      setPassword({ ...session, displayName: me.profile.displayName || session.handle, avatar: me.profile.avatar || '' });
    }
  } catch {
    me.profile = getPassword();
  }
  try {
    const pulled = await pullAccountPrefs();
    if (pulled?.theme) applyTheme(pulled.theme, { quiet: true });
  } catch {
    /* this browser keeps the last saved settings */
  }
  updateAccount();
  rememberCurrent();
  refreshBadge();
  loadRail();
}

function rememberCurrent() {
  const did = myDid();
  if (!did) return;
  const profile = me.profile;
  const password = getPassword();
  if (password?.did === did) {
    rememberAccount({
      kind: 'password',
      did,
      handle: profile?.handle || password.handle || '',
      displayName: profile?.displayName || password.displayName || password.handle || '',
      avatar: profile?.avatar || password.avatar || '',
      session: getPassword(),
    });
    return;
  }
  const oauth = getOauth();
  if (oauth?.sub === did) {
    rememberAccount({
      kind: 'oauth',
      did,
      handle: profile?.handle || '',
      displayName: profile?.displayName || profile?.handle || '',
      avatar: profile?.avatar || '',
    });
  }
}

function keepPasswordCopy() {
  const session = getPassword();
  if (!session?.did) return;
  const previous = activeDid();
  rememberAccount({
    kind: 'password',
    did: session.did,
    handle: session.handle || '',
    displayName: session.displayName || session.handle || '',
    avatar: session.avatar || '',
    session,
  });
  if (previous && previous !== session.did) setActiveDid(previous);
}

function paintBadge(id, count) {
  const name = id.replace('-badge', '');
  const nodes = [...document.querySelectorAll(`[data-badge="${name}"]`)];
  if (!nodes.length && $(id)) nodes.push($(id));
  nodes.forEach((node) => {
    node.hidden = count < 1;
    node.textContent = count > 99 ? '99+' : String(count);
  });
}

function soundsEnabled(kind) {
  const prefs = soundPrefs();
  if (kind === 'posts') return prefs.posts === true;
  if (kind === 'notifications') return prefs.notifications !== false;
  return prefs.chat !== false;
}

function soundLevel(kind) {
  const key = kind === 'call' ? 'chat' : kind;
  const level = Number(soundPrefs().volume?.[key]);
  return Number.isFinite(level) ? Math.max(0, Math.min(1, level / 100)) : 0.7;
}

function playSound(kind, options = {}) {
  const preview = options.preview === true;
  if (!preview && !soundsEnabled(kind)) return;
  const level = soundLevel(kind);
  if (level <= 0) return;
  const nowMs = Date.now();
  if (!preview && nowMs - (playSound.at[kind] || 0) < 2500) return;
  if (!preview) playSound.at[kind] = nowMs;
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    if (!playSound.ctx) playSound.ctx = new Ctx();
    const ctx = playSound.ctx;
    ctx.resume?.().catch(() => {});
    const startAt = ctx.currentTime;
    const notes = kind === 'call'
      ? [[880, 0, 0.16, 0.07], [1175, 0.18, 0.2, 0.06]]
      : kind === 'notifications'
        ? [[784, 0, 0.14, 0.05], [1046, 0.1, 0.18, 0.045]]
        : kind === 'posts'
          ? [[660, 0, 0.08, 0.04], [880, 0.07, 0.12, 0.035]]
          : [[523, 0, 0.1, 0.045], [659, 0.09, 0.14, 0.04]];
    notes.forEach(([freq, delay, duration, gain]) => {
      const osc = ctx.createOscillator();
      const amp = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      const start = startAt + delay;
      const peak = Math.max(0.0008, gain * level);
      amp.gain.setValueAtTime(0.0001, start);
      amp.gain.exponentialRampToValueAtTime(peak, start + 0.02);
      amp.gain.exponentialRampToValueAtTime(0.0001, start + duration);
      osc.connect(amp);
      amp.connect(ctx.destination);
      osc.start(start);
      osc.stop(start + duration + 0.03);
    });
  } catch {
    /* this browser stayed quiet */
  }
}
playSound.at = {};

function spotIncoming(convos, mine) {
  for (const convo of convos || []) {
    const other = (convo.members || []).find((member) => member?.did && member.did !== mine);
    if (!other?.did || !convo.id) continue;
    const offer = incomingCall(convo.lastMessage ? [convo.lastMessage] : [], mine, other.did);
    if (!offer?.rkey) continue;
    const key = `${convo.id}:${offer.rkey}`;
    if (ignoredRings.has(key)) continue;
    return {
      ...offer,
      convoId: convo.id,
      peerDid: other.did,
      name: other.displayName || (other.handle ? `@${other.handle}` : 'Someone'),
      key,
    };
  }
  return null;
}

function paintIncomingBar(offer) {
  const bar = $('incoming-call');
  if (!bar) return;
  const [page, id] = parseHash();
  const onThisChat = Boolean(offer && page === 'messages' && id === offer.convoId);
  const show = Boolean(offer) && !isInCall() && !onThisChat;
  document.body.classList.toggle('ringing', show);
  if (!show) {
    bar.hidden = true;
    if (!offer) bar.dataset.key = '';
    return;
  }
  if (bar.dataset.key === offer.key && !bar.hidden) return;
  const video = offer.media === 'video';
  bar.dataset.key = offer.key;
  bar.classList.toggle('video', video);
  bar.hidden = false;
  const title = video ? 'Incoming video call' : 'Incoming voice call';
  bar.innerHTML = `<span class="incoming-call-copy"><strong>${escapeHtml(title)}</strong><span>${escapeHtml(offer.name || 'Someone')}</span></span><button type="button" class="primary small" data-act="call-accept" data-rkey="${escapeHtml(offer.rkey)}" data-media="${escapeHtml(offer.media || 'audio')}" data-convo="${escapeHtml(offer.convoId)}" data-peer="${escapeHtml(offer.peerDid)}">Accept</button><button type="button" class="danger mini" data-act="call-decline" data-rkey="${escapeHtml(offer.rkey)}" data-convo="${escapeHtml(offer.convoId)}">Decline</button>`;
}

function silenceRing(convoId, rkey) {
  if (convoId && rkey) ignoredRings.add(`${convoId}:${rkey}`);
  const bar = $('incoming-call');
  if (bar) bar.hidden = true;
  document.body.classList.remove('ringing');
}

async function refreshBadge() {
  if (!signedIn()) {
    paintBadge('notif-badge', 0);
    paintBadge('chat-badge', 0);
    paintIncomingBar(null);
    badgeMemory = { notifications: null, chat: null, ring: '' };
    return;
  }
  try {
    const data = await api.getUnreadCount();
    const count = data.count || 0;
    paintBadge('notif-badge', count);
    if (badgeMemory.notifications !== null && count > badgeMemory.notifications) playSound('notifications');
    badgeMemory.notifications = count;
  } catch {
    /* the badge is optional */
  }
  try {
    const data = await api.listConvos();
    const convos = data.convos || [];
    const mine = myDid();
    const count = convos.reduce((sum, convo) => sum + convoUnread(convo, mine), 0);
    paintBadge('chat-badge', count);
    const offer = spotIncoming(convos, mine);
    paintIncomingBar(offer);
    const ring = offer?.key || '';
    if (ring && ring !== badgeMemory.ring) playSound('call');
    else if (badgeMemory.chat !== null && count > badgeMemory.chat) playSound('chat');
    badgeMemory.chat = count;
    badgeMemory.ring = ring;
    convos.forEach((convo) => {
      if (ownUnread(convo, mine)) api.markConvoRead(convo.id).catch(() => {});
    });
  } catch {
    paintBadge('chat-badge', 0);
  }
}

function loadTrends() {
  if (Array.isArray(trendCache.list) && Date.now() - trendCache.at < 60_000) return Promise.resolve(trendCache.list);
  if (!trendCache.pending) {
    trendCache.pending = api.getTrends(25).then((data) => {
      const seen = new Set();
      const list = (data.trends || []).filter((trend) => {
        const key = trend?.link || trend?.displayName || '';
        if (!key || seen.has(key)) return false;
        seen.add(key);
        return true;
      });
      trendCache.at = Date.now();
      trendCache.list = list;
      trendCache.pending = null;
      return list;
    }).catch((error) => {
      trendCache.pending = null;
      throw error;
    });
  }
  return trendCache.pending;
}

function exploreTabsHtml(trends) {
  const visible = EXPLORE_TABS.filter((tab) => tab.id === 'foryou' || (trends || []).some(tab.match));
  if (!visible.some((tab) => tab.id === exploreTab)) exploreTab = 'foryou';
  return `<div class="explore-tabs" role="tablist">${visible.map((tab) => `<button type="button" role="tab" data-explore="${tab.id}" aria-selected="${exploreTab === tab.id ? 'true' : 'false'}">${escapeHtml(tab.label)}</button>`).join('')}</div>`;
}

function preferLive(trends) {
  const list = trends || [];
  const live = list.filter((trend) => trend?.status !== 'stale');
  const chosen = live.length ? live : list;
  const heat = { hot: 0, cooling: 1 };
  return [...chosen].sort((a, b) => (heat[a.status] ?? 2) - (heat[b.status] ?? 2));
}

function visibleTrends(trends) {
  const tab = EXPLORE_TABS.find((item) => item.id === exploreTab) || EXPLORE_TABS[0];
  return preferLive((trends || []).filter(tab.match));
}

function trendBlock(trends, limit) {
  const rows = trendsHtml((trends || []).slice(0, limit));
  return rows ? `<div class="trends">${rows}</div>` : '';
}

function matchingTrends(trends, query) {
  const needle = String(query || '').trim().toLowerCase();
  const list = preferLive(trends);
  if (!needle) return list;
  return list.filter((trend) => String(trend?.displayName || '').toLowerCase().includes(needle));
}

async function loadRail() {
  const card = $('rail-card');
  let trends = '';
  try {
    const list = await loadTrends();
    const rows = trendsHtml(preferLive(list).slice(0, 5), { compact: true });
    if (rows) trends = `<section class="panel"><h2>What's happening</h2><div class="trends">${rows}</div><a class="panel-more" href="#/search">Show more</a></section>`;
  } catch {
    trends = '';
  }
  if (!signedIn()) {
    card.innerHTML = `${trends}<section class="panel"><h2>LibreSky</h2><p>A Bluesky client. Sign in with your Bluesky account.</p><button type="button" class="primary" data-act="signin">Sign in</button></section>`;
    return;
  }
  try {
    const data = await api.getSuggestions();
    const people = data.actors || [];
    const follows = people.length
      ? `<section class="panel"><h2>Suggested follows</h2>${people.map((actor) => actorHtml(actor, { follow: true, self: myDid() })).join('')}</section>`
      : '';
    card.innerHTML = trends + follows;
  } catch {
    card.innerHTML = trends;
  }
}

const homeWatch = { timer: 0, token: 0, uris: new Set(), pending: [] };

function stopHomeWatch() {
  clearInterval(homeWatch.timer);
  homeWatch.timer = 0;
  homeWatch.token = 0;
  homeWatch.pending = [];
  hideFresh();
}

function noteHome(items) {
  (items || []).forEach((item) => {
    const uri = item?.post?.uri;
    if (uri) homeWatch.uris.add(uri);
  });
}

function visibleHome(items) {
  const prefs = feedView('home');
  const did = myDid();
  return (items || []).filter((item) => homeAllows(item, prefs, did));
}

function placeFresh() {
  const pill = $('fresh');
  if (!pill || pill.hidden) return;
  const column = document.querySelector('.center');
  const head = document.querySelector('.sticky-head');
  if (!column) return;
  const rect = column.getBoundingClientRect();
  const below = head ? head.getBoundingClientRect().bottom : 64;
  pill.style.left = `${rect.left + rect.width / 2}px`;
  pill.style.top = `${Math.max(8, below + 10)}px`;
}

function hideFresh() {
  const pill = $('fresh');
  if (!pill) return;
  pill.hidden = true;
  pill.innerHTML = '';
}

function paintFresh() {
  const pill = $('fresh');
  if (!pill) return;
  const items = homeWatch.pending;
  if (!items.length || parseHash()[0]) {
    hideFresh();
    return;
  }
  const seen = new Set();
  const actors = [];
  items.forEach((item) => {
    const reason = item?.reason;
    const actor = String(reason?.$type || '').includes('reasonRepost') && reason.by ? reason.by : item?.post?.author;
    const id = actor?.did || actor?.handle;
    if (!actor || !id || seen.has(id)) return;
    seen.add(id);
    actors.push(actor);
  });
  const faces = actors.slice(0, 3).map((actor) => avatar(actor.avatar, actor.displayName || actor.handle)).join('');
  const count = items.length;
  const label = count === 1 ? 'New post' : `${count} new posts`;
  const next = `<span class="fresh-faces">${faces}</span><span class="fresh-label">${escapeHtml(label)}</span><span class="fresh-link">Update</span>`;
  pill.hidden = false;
  if (pill.innerHTML !== next) pill.innerHTML = next;
  placeFresh();
}

function applyFresh() {
  const items = homeWatch.pending.splice(0);
  hideFresh();
  if (!items.length || parseHash()[0]) return;
  noteHome(items);
  const prepared = items.map((item) => (muted(item.post || item) ? { ...item, muted: true } : item));
  resetPosts();
  const html = feedHtml(prepared);
  remember();
  const view = $('view');
  view?.querySelector('.empty')?.remove();
  view?.querySelector('.lang-wait')?.remove();
  const prompt = view?.querySelector('.prompt');
  if (prompt) prompt.insertAdjacentHTML('afterend', html);
  else view?.insertAdjacentHTML('afterbegin', html);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function armHomeWatch(token, items) {
  clearInterval(homeWatch.timer);
  homeWatch.token = token;
  homeWatch.uris = new Set();
  homeWatch.pending = [];
  noteHome(items);
  hideFresh();
  homeWatch.timer = setInterval(() => { pollHome(token); }, 15000);
}

async function pollHome(token) {
  if (token !== generation || token !== homeWatch.token || document.hidden) return;
  if (parseHash()[0]) return;
  try {
    const data = await api.getTimeline(null);
    if (token !== generation || token !== homeWatch.token) return;
    const fresh = [];
    const prefs = feedView('home');
    const did = myDid();
    for (const item of data.feed || []) {
      const uri = item?.post?.uri;
      if (!uri) continue;
      if (homeWatch.uris.has(uri)) break;
      if (homeAllows(item, prefs, did)) fresh.push(item);
      else homeWatch.uris.add(uri);
    }
    if (!fresh.length) return;
    const known = new Set(homeWatch.pending.map((item) => item?.post?.uri).filter(Boolean));
    const added = fresh.filter((item) => item?.post?.uri && !known.has(item.post.uri));
    homeWatch.pending = fresh;
    paintFresh();
    if (added.length) playSound('posts');
  } catch {
    /* the pill waits for the next check */
  }
}

function gearButton(act, label, feed) {
  const attr = feed ? ` data-feed="${escapeHtml(feed)}"` : '';
  return `<button type="button" class="icon-btn" data-act="${act}"${attr} aria-label="${escapeHtml(label)}">${icon('gear')}</button>`;
}

async function showHome(mode) {
  const token = ++generation;
  const following = mode !== 'discover';
  setChrome({
    title: following ? 'Home' : 'Discover',
    nav: 'home',
    tools: following ? gearButton('home-settings', 'Home settings') : '',
    tabs: [
      { href: '#/', label: 'Following', on: following },
      { href: '#/discover', label: 'Discover', on: !following },
    ],
  });
  if (following && !signedIn()) {
    $('view').innerHTML = emptyHtml('Your home feed is on Bluesky', 'Sign in and LibreSky shows the people you follow.', '<button type="button" class="primary" data-act="signin">Sign in with Bluesky</button><a class="text-link" href="#/discover">See Discover</a>');
    return;
  }
  showSkeletons();
  try {
    const data = following ? await api.getTimeline(null) : await api.getFeed(api.WHATS_HOT);
    if (token !== generation) return;
    const banner = following ? homePrompt() : '';
    const raw = data.feed || [];
    const items = following ? visibleHome(raw) : filterDiscover(raw);
    resetPosts();
    const posted = feedHtml(items);
    const empty = emptyHtml('No posts yet', following ? 'Follow a few people, or change Home settings with the gear.' : 'Nothing in your content languages yet. Settings can show every language.');
    const waiting = '<p class="dim lang-wait">Looking through more posts…</p>';
    $('view').innerHTML = banner + (posted || (data.cursor ? waiting : empty));
    remember();
    document.documentElement.dataset.ready = '1';
    if (following) armHomeWatch(token, raw);
    const more = async (cursor) => {
      const page = following ? await api.getTimeline(cursor) : await api.getFeed(api.WHATS_HOT, cursor);
      if (token !== generation) return;
      const nextRaw = page.feed || [];
      const nextItems = following ? visibleHome(nextRaw) : filterDiscover(nextRaw);
      if (following) noteHome(nextRaw);
      if (!(nextItems || []).length && !page.cursor && !$('view')?.querySelector('.post')) {
        $('view').innerHTML = empty;
        pagerFor(null, more);
        return;
      }
      paintFeed(nextItems, { append: true });
      if ((nextItems || []).length || !page.cursor) $('view')?.querySelector('.lang-wait')?.remove();
      pagerFor(page.cursor, more);
    };
    pagerFor(data.cursor, more);
  } catch (error) {
    if (token !== generation) return;
    $('view').innerHTML = emptyHtml('Could not load the feed', error.message, '<button type="button" class="primary" data-act="retry">Try again</button>');
  }
}

function homePrompt() {
  if (!signedIn()) return '';
  const profile = account();
  const initial = escapeHtml((profile?.displayName || profile?.handle || 'You').charAt(0).toUpperCase());
  const src = profile?.avatar ? `<img src="${escapeHtml(profile.avatar)}" alt="">` : '';
  return `<button type="button" class="prompt" data-act="compose"><span class="avatar" data-initial="${initial}">${src}</span><span>What's up?</span></button>`;
}

function sortHtml() {
  searchSort = searchPrefs().sort === 'top' ? 'top' : 'latest';
  return `<div class="segmented search-sort"><button type="button" data-sort="latest" aria-pressed="${searchSort === 'latest'}">Latest</button><button type="button" data-sort="top" aria-pressed="${searchSort === 'top'}">Top</button></div>`;
}

function searchContext() {
  return { languages: languagePrefs().content, did: myDid() };
}

function visibleSearchPosts(posts) {
  const prefs = searchPrefs();
  const context = searchContext();
  return (posts || []).filter((post) => searchAllows(post, prefs, context));
}

async function showSearch(query, options = {}) {
  const focus = options.focus !== false;
  const token = ++generation;
  searchSort = searchPrefs().sort === 'top' ? 'top' : 'latest';
  setChrome({ title: 'Search', nav: 'search', tools: gearButton('search-settings', 'Search settings') });
  const known = Array.isArray(trendCache.list) ? trendCache.list : null;
  const controls = query ? sortHtml() : (known ? exploreTabsHtml(known) : '');
  const placeholder = query
    ? skeletons(4)
    : (known ? (trendBlock(visibleTrends(known)) || emptyHtml('Nothing trending', 'Nothing is happening in this tab right now.')) : skeletons(6));
  $('view').innerHTML = `<form class="search-page" id="search-form"><div class="search-bar"><label class="search"><input id="search-q" value="${escapeHtml(query)}" placeholder="Search Bluesky" autocomplete="off" enterkeyhint="search"></label><button type="button" class="icon-btn search-gear" data-act="search-settings" aria-label="Search settings">${icon('gear')}</button></div><div id="search-controls">${controls}</div></form><div id="search-results">${placeholder}</div>`;
  if (focus && query) $('search-q')?.focus();
  if (!query) return paintExplore(token);
  return paintSearchResults(token, query);
}

async function paintExplore(token) {
  try {
    const trends = await loadTrends();
    if (token !== generation) return;
    const controls = $('search-controls');
    if (controls) controls.innerHTML = exploreTabsHtml(trends);
    const rows = trendBlock(visibleTrends(trends));
    $('search-results').innerHTML = rows || emptyHtml('Nothing trending', 'Nothing is happening in this tab right now.');
  } catch (error) {
    if (!cancelled(token, error)) $('search-results').innerHTML = emptyHtml('Trends are unavailable', error.message || 'Could not load what is happening.');
  }
}

async function paintSearchResults(token, query) {
  try {
    const [postData, actorData, packData, trendList] = await Promise.all([
      api.searchPosts(query, null, null, searchSort),
      api.searchActors(query),
      api.searchStarterPacks(query).catch(() => ({ starterPacks: [] })),
      loadTrends().catch(() => []),
    ]);
    if (token !== generation) return;
    const people = (actorData.actors || []).slice(0, 5).map((actor) => actorHtml(actor, { follow: signedIn(), self: myDid() })).join('');
    const packs = (packData.starterPacks || []).slice(0, 4).map((pack) => packHtml(pack)).join('');
    const matched = matchingTrends(trendList, query).slice(0, 5);
    const trendCards = trendsHtml(matched);
    resetPosts();
    const matchedPosts = visibleSearchPosts(postData.posts);
    const postsHtml = feedHtml(matchedPosts.map((post) => ({ post })));
    const hiddenNote = !postsHtml && (postData.posts || []).length ? '<p class="dim search-note">Posts are hidden by search settings. The gear can show more.</p>' : '';
    remember();
    const peopleBlock = people ? `<h2 class="section-label">People</h2><div class="people">${people}</div>` : '';
    const packsBlock = packs ? `<h2 class="section-label">Starter packs</h2><div class="packs">${packs}</div>` : '';
    const trendSection = trendCards ? `<div class="trends">${trendCards}</div>` : '';
    let missed = '';
    let listedTrends = trendSection;
    if (!people && !packs && !postsHtml) {
      missed = emptyHtml('No results', `Nothing matched "${query}".`) + (trendSection || trendBlock(preferLive(trendList).slice(0, 5)));
      listedTrends = '';
    }
    $('search-results').innerHTML = `${peopleBlock}${packsBlock}${listedTrends}${hiddenNote}${postsHtml}${missed}`;
    const more = async (cursor) => {
      const page = await api.searchPosts(query, cursor, null, searchSort);
      if (token !== generation) return;
      resetPosts();
      const html = feedHtml(visibleSearchPosts(page.posts).map((post) => ({ post })));
      remember();
      if (html) $('search-results')?.insertAdjacentHTML('beforeend', html);
      pagerFor(page.cursor, more);
    };
    if (postsHtml) pagerFor(postData.cursor, more);
  } catch (error) {
    if (!cancelled(token, error)) $('search-results').innerHTML = emptyHtml('Search failed', error.message);
  }
}

const NOTE_FILTERS = [
  ['', 'All', null],
  ['replies', 'Replies', ['reply', 'quote', 'mention']],
  ['likes', 'Likes', ['like', 'like-via-repost']],
  ['reposts', 'Reposts', ['repost', 'repost-via-repost']],
  ['follows', 'Follows', ['follow']],
];

async function showNotifications(filter) {
  const token = ++generation;
  const current = NOTE_FILTERS.some(([id]) => id === filter) ? filter : '';
  const reasons = NOTE_FILTERS.find(([id]) => id === current)?.[2] || null;
  setChrome({
    title: 'Notifications',
    nav: 'notifications',
    tabs: NOTE_FILTERS.map(([id, label]) => ({
      href: id ? `#/notifications/${id}` : '#/notifications',
      label,
      on: id === current,
    })),
  });
  if (!signedIn()) {
    $('view').innerHTML = emptyHtml('Notifications', 'Sign in to see likes, replies, and follows.', '<button type="button" class="primary" data-act="signin">Sign in</button>');
    return;
  }
  showSkeletons();
  try {
    const data = await api.getNotifications(null, null, reasons);
    if (token !== generation) return;
    const subjects = new Map();
    const learn = async (notes) => {
      const want = [];
      const push = (uri) => {
        if (uri && !subjects.has(uri) && !want.includes(uri)) want.push(uri);
      };
      (notes || []).forEach((note) => {
        const reason = note?.reason;
        const said = typeof note?.record?.text === 'string' && note.record.text.trim();
        if ((reason === 'reply' || reason === 'mention' || reason === 'quote') && !said) push(note.uri);
      });
      (notes || []).forEach((note) => push(note.reasonSubject));
      const uris = want.slice(0, 25);
      if (!uris.length) return;
      try {
        const fetched = await api.getPosts(uris);
        (fetched.posts || []).forEach((post) => subjects.set(post.uri, post));
      } catch { /* snippets are optional */ }
    };
    let all = data.notifications || [];
    await learn(all);
    if (token !== generation) return;
    const paint = () => {
      const rows = notificationsHtml(all, subjects);
      const tools = `<div class="toolbar"><button type="button" class="primary small" data-act="follow-back">Follow all back</button></div>`;
      $('view').innerHTML = tools + (rows || emptyHtml('No notifications', 'You are all caught up.'));
    };
    paint();
    const more = async (cursor) => {
      const page = await api.getNotifications(cursor, null, reasons);
      if (token !== generation) return;
      const extra = page.notifications || [];
      await learn(extra);
      if (token !== generation) return;
      all = all.concat(extra);
      paint();
      pagerFor(page.cursor, more);
    };
    pagerFor(data.cursor, more);
    api.updateSeen().then(refreshBadge).catch(() => {});
  } catch (error) {
    if (!cancelled(token, error)) $('view').innerHTML = emptyHtml('Could not load notifications', error.message);
  }
}

function stopChatTimer() {
  clearInterval(chatTimer);
  chatTimer = 0;
}

function otherMember(convo, messages) {
  const mine = myDid();
  const listed = (convo?.members || []).find((member) => member?.did && member.did !== mine);
  if (listed) return listed;
  for (const message of messages || []) {
    const did = messageSender(message);
    if (!did || did === mine) continue;
    const sender = message.sender;
    if (sender && typeof sender === 'object') return sender.did ? sender : { ...sender, did };
    return { did };
  }
  return null;
}

function chatOptions(messages, peerDid, convoId, fresh) {
  const live = incomingCall(messages, myDid(), peerDid);
  const blocked = Boolean(live && ignoredRings.has(`${convoId}:${live.rkey}`));
  return {
    liveRkey: blocked ? '' : (live?.rkey || ''),
    convoId: convoId || '',
    peerDid: peerDid || '',
    fresh: Boolean(fresh),
  };
}

function paintCallBanner(messages, peerDid, convoId) {
  let offer = incomingCall(messages, myDid(), peerDid);
  if (offer && ignoredRings.has(`${convoId}:${offer.rkey}`)) offer = null;
  const current = $('view')?.querySelector('.call-banner');
  const busy = isInCall();
  document.querySelectorAll('#view .call-actions').forEach((node) => {
    const rkey = node.querySelector('[data-act="call-accept"]')?.dataset.rkey;
    if (!offer || busy || rkey !== offer.rkey) node.remove();
  });
  if (!offer || busy) {
    current?.remove();
    return;
  }
  if (current?.querySelector('[data-act="call-accept"]')?.dataset.rkey === offer.rkey) return;
  const html = callBannerHtml(offer, { convoId, peerDid });
  if (current) current.outerHTML = html;
  else $('view')?.querySelector('.chat-head')?.insertAdjacentHTML('afterend', html);
}

function watchOpenChat(convoId, peerDid, token) {
  stopChatTimer();
  chatTimer = setInterval(async () => {
    if (token !== generation || parseHash()[1] !== convoId) {
      stopChatTimer();
      return;
    }
    try {
      const data = await api.getConvo(convoId);
      if (token !== generation) return;
      const messages = (data.messages || []).slice().reverse();
      const list = $('view')?.querySelector('.messages');
      if (list) {
        const near = list.scrollHeight - list.scrollTop - list.clientHeight < 80;
        let added = false;
        let fromThem = false;
        let incomingOffer = false;
        messages.forEach((message) => {
          const escapeId = window.CSS?.escape || ((value) => String(value).replace(/"/g, '\\"'));
          if (!message?.id || list.querySelector(`[data-id="${escapeId(message.id)}"]`)) return;
          const mine = messageSender(message) === myDid();
          list.insertAdjacentHTML('beforeend', messageHtml(message, myDid(), chatOptions(messages, peerDid, convoId, !mine)));
          added = true;
          if (!mine) {
            fromThem = true;
            if (parseCallMessage(message.text)?.kind === 'offer') incomingOffer = true;
          }
        });
        if (added && near) list.scrollTop = list.scrollHeight;
        if (incomingOffer) playSound('call');
        else if (fromThem) playSound('chat');
        if (added) api.markConvoRead(convoId).then(refreshBadge).catch(() => {});
      }
      paintCallBanner(messages, peerDid, convoId);
    } catch {
      /* the open chat stays as it is */
    }
  }, 4000);
}

async function showMessages(convoId) {
  const token = ++generation;
  stopChatTimer();
  setChrome({ title: 'Messages', nav: 'messages', back: Boolean(convoId) });
  if (!signedIn()) {
    $('view').innerHTML = emptyHtml('Messages', 'Sign in to open your Bluesky chats.', '<button type="button" class="primary" data-act="signin">Sign in</button>');
    return;
  }
  showSkeletons();
  try {
    if (!convoId) {
      const data = await api.listConvos();
      if (token !== generation) return;
      const mine = myDid();
      (data.convos || []).forEach((convo) => {
        if (ownUnread(convo, mine)) api.markConvoRead(convo.id).catch(() => {});
      });
      const rows = (data.convos || []).map((convo) => convoHtml(convo, mine)).join('');
      $('view').innerHTML = `<div class="toolbar"><button type="button" class="primary small" data-act="new-chat">New message</button><button type="button" class="text-btn" data-act="chat-read">Mark all as read</button><button type="button" class="danger" data-act="chat-cleanup">Remove deleted accounts</button></div>${rows || emptyHtml('No messages', 'Start a chat with someone you follow.')}`;
      refreshBadge();
      return;
    }
    const [data, convoWrap] = await Promise.all([
      api.getConvo(convoId),
      api.getConvoView(convoId).catch(() => null),
    ]);
    if (token !== generation) return;
    const messages = (data.messages || []).slice().reverse();
    const other = otherMember(convoWrap?.convo, messages);
    const peerDid = other?.did || '';
    if (other) $('title').textContent = other.displayName || (other.handle ? `@${other.handle}` : 'Chat');
    const options = chatOptions(messages, peerDid, convoId, false);
    $('view').innerHTML = `${chatHeaderHtml(other)}<div class="messages">${messages.map((message) => messageHtml(message, myDid(), options)).join('')}</div><form class="reply-bar" id="chat-form"><div class="composer-field chat-field"><pre class="field-highlight" id="chat-highlight" aria-hidden="true"></pre><textarea id="chat-text" rows="3" maxlength="1000" placeholder="Message" autocomplete="off" spellcheck="true"></textarea></div><button class="primary small" type="submit">Send</button><p class="chat-hint"><span class="chat-hint-keys">Enter sends. Shift+Enter adds a line. Click a suggestion or press Tab.</span><span class="chat-hint-touch">Enter adds a line.</span></p></form>`;
    paintCallBanner(messages, peerDid, convoId);
    const area = $('chat-text');
    paintFieldHighlight(area, $('chat-highlight'));
    applyFieldLanguage(area);
    fitChatInput(area);
    area?.focus();
    const scroller = $('view').querySelector('.messages');
    if (scroller) scroller.scrollTop = scroller.scrollHeight;
    api.markConvoRead(convoId).then(refreshBadge).catch(() => {});
    watchOpenChat(convoId, other?.did || '', token);
  } catch (error) {
    if (!cancelled(token, error)) {
      $('view').innerHTML = emptyHtml('Messages are unavailable', error.message || 'This sign-in does not include chat access.');
    }
  }
}

function bookmarkParts(marks) {
  const saved = [];
  const gone = [];
  (marks || []).forEach((mark) => {
    const subject = mark.subject || mark.item || mark.post;
    if (!subject?.uri) return;
    const type = subject.$type || '';
    if (subject.notFound || subject.blocked || type.includes('NotFound') || type.includes('Blocked')) {
      gone.push(subject);
      return;
    }
    subject.viewer = { ...(subject.viewer || {}), bookmarked: true };
    saved.push({ post: subject });
  });
  return { saved, gone };
}

function goneBookmarkHtml(gone) {
  return gone.map((subject) => `<div class="note"><span class="note-icon"></span><span class="note-body"><span>This saved post is unavailable.</span><button type="button" class="danger" data-act="remove-bookmark" data-uri="${escapeHtml(subject.uri)}">Remove bookmark</button></span></div>`).join('');
}

async function showBookmarks() {
  const token = ++generation;
  setChrome({ title: 'Bookmarks', nav: 'bookmarks' });
  if (!signedIn()) {
    $('view').innerHTML = emptyHtml('Bookmarks', 'Sign in to see posts you saved on Bluesky.', '<button type="button" class="primary" data-act="signin">Sign in</button>');
    return;
  }
  showSkeletons();
  try {
    const data = await api.getBookmarks();
    if (token !== generation) return;
    const { saved, gone } = bookmarkParts(data.bookmarks);
    const tools = `<div class="toolbar"><button type="button" class="danger" data-act="bookmarks-cleanup">Remove unavailable</button></div>`;
    if (!saved.length && !gone.length) {
      $('view').innerHTML = tools + emptyHtml('No bookmarks', 'Tap the bookmark on a post to save it here.');
    } else {
      $('view').innerHTML = tools + goneBookmarkHtml(gone);
      if (saved.length) paintFeed(saved, { append: true, post: { bookmarkRemove: true } });
    }
    const more = async (cursor) => {
      const page = await api.getBookmarks(cursor);
      if (token !== generation) return;
      const next = bookmarkParts(page.bookmarks);
      if (next.gone.length) $('view').querySelector('.toolbar')?.insertAdjacentHTML('afterend', goneBookmarkHtml(next.gone));
      if (next.saved.length) paintFeed(next.saved, { append: true, post: { bookmarkRemove: true } });
      pagerFor(page.cursor, more);
    };
    pagerFor(data.cursor, more);
    document.documentElement.dataset.ready = '1';
  } catch (error) {
    if (!cancelled(token, error)) $('view').innerHTML = emptyHtml('Could not load bookmarks', error.message);
  }
}

function listKind(purpose) {
  const value = String(purpose || '');
  if (value.includes('modlist')) return 'Mute list';
  if (value.includes('referencelist')) return 'Reference list';
  return 'People';
}

function miniButton(act, label, attrs = {}, danger = false) {
  const extra = Object.entries(attrs).map(([key, value]) => ` data-${key}="${escapeHtml(value ?? '')}"`).join('');
  return `<button type="button" class="${danger ? 'danger' : 'text-btn'} mini" data-act="${act}"${extra}>${escapeHtml(label)}</button>`;
}

function manageRow(avatarHtml, href, title, detail, actions) {
  return `<div class="person manage-row">${avatarHtml}<a class="person-link" href="${href}"><strong>${escapeHtml(title)}</strong><span class="handle">${escapeHtml(detail)}</span></a><span class="row-actions">${actions}</span></div>`;
}

function initialAvatar(letter) {
  return `<span class="avatar" data-initial="${escapeHtml(String(letter || '?').charAt(0))}"></span>`;
}

function imageAvatar(url, letter) {
  return url
    ? `<span class="avatar"><img src="${escapeHtml(url)}" alt=""></span>`
    : initialAvatar(letter);
}

async function loadGenerators(uris) {
  const views = [];
  for (let i = 0; i < uris.length; i += 25) {
    try {
      const gens = await api.getFeedGenerators(uris.slice(i, i + 25));
      views.push(...(gens.feeds || []));
    } catch {
      /* one bad feed should not hide the rest */
    }
  }
  return views;
}

async function changeFeeds(edit) {
  const data = await api.getPreferences();
  const current = api.savedFeedItems(data.preferences);
  const items = edit(current.map((item) => ({ ...item })));
  await api.putPreferences(api.applySavedFeeds(data.preferences, items));
}

function feedActions(item, view) {
  const own = view?.creator?.did && view.creator.did === myDid();
  const buttons = [
    miniButton('feed-pin', item.pinned ? 'Unpin' : 'Pin', { uri: item.value, pinned: item.pinned ? '1' : '0', type: item.type || 'feed' }),
    miniButton('feed-remove', 'Remove', { uri: item.value }, true),
  ];
  if (own) {
    buttons.push(miniButton('feed-edit', 'Edit', { uri: item.value, name: view.displayName || '', description: view.description || '' }));
    buttons.push(miniButton('feed-delete', 'Delete', { uri: item.value }, true));
  }
  return buttons.join('');
}

async function showFeeds() {
  const token = ++generation;
  setChrome({ title: 'Feeds', nav: 'feeds' });
  const hot = `<a class="person" href="#/discover">${initialAvatar('D')}<span><strong>Discover</strong><span class="handle">What's Hot</span></span></a>`;
  if (!signedIn()) {
    $('view').innerHTML = `<div class="directory">${hot}</div>` + emptyHtml('Your feeds', 'Sign in to see the feeds you saved on Bluesky.');
    return;
  }
  showSkeletons();
  try {
    const prefs = await api.getPreferences();
    if (token !== generation) return;
    const items = api.savedFeedItems(prefs.preferences).filter((item) => item.type === 'feed' || item.type === 'list');
    const feedUris = items.filter((item) => item.type === 'feed').map((item) => item.value);
    const listUris = items.filter((item) => item.type === 'list').map((item) => item.value);
    const [views, lists] = await Promise.all([
      feedUris.length ? loadGenerators(feedUris) : [],
      Promise.all(listUris.map((uri) => api.getList(uri, null, null, 1).then((found) => found.list).catch(() => null))),
    ]);
    if (token !== generation) return;
    const byFeed = new Map(views.map((feed) => [feed.uri, feed]));
    const byList = new Map(lists.filter(Boolean).map((list) => [list.uri, list]));
    const rows = items.map((item) => {
      if (item.type === 'list') {
        const list = byList.get(item.value);
        const title = list?.name || 'Unavailable list';
        const detail = [list ? listKind(list.purpose) : 'Saved list', item.pinned ? 'Pinned' : 'Saved'].join(' · ');
        return manageRow(imageAvatar(list?.avatar, title), `#/list/${encodeURIComponent(item.value)}`, title, detail, feedActions(item, null));
      }
      const feed = byFeed.get(item.value);
      const title = feed?.displayName || 'Unavailable feed';
      const blurb = (feed?.description || '').replace(/\s+/g, ' ').slice(0, 80);
      const detail = [blurb, item.pinned ? 'Pinned' : 'Saved'].filter(Boolean).join(' · ');
      return manageRow(imageAvatar(feed?.avatar, 'F'), `#/feed/${encodeURIComponent(item.value)}`, title, detail, feedActions(item, feed));
    }).join('');
    $('view').innerHTML = `<div class="directory">${hot}${rows}</div>`;
    if (!rows) $('view').insertAdjacentHTML('beforeend', emptyHtml('No saved feeds', 'Open a feed and save it. Pinned feeds stay at the top of this list.'));
  } catch (error) {
    if (!cancelled(token, error)) $('view').innerHTML = `<div class="directory">${hot}</div>` + emptyHtml('Could not load feeds', error.message);
  }
}

function visibleFeed(items, feedId) {
  const prefs = feedView(feedId);
  const did = myDid();
  return (items || []).filter((item) => homeAllows(item, prefs, did));
}

async function showCustomFeed(uri) {
  const token = ++generation;
  setChrome({ title: 'Feed', nav: 'feeds', back: true, tools: gearButton('feed-settings', 'Feed settings', uri) });
  showSkeletons();
  try {
    const jobs = [api.getFeedGenerator(uri).catch(() => null), api.getFeed(uri)];
    if (signedIn()) jobs.push(api.getPreferences().catch(() => null));
    const [info, data, prefs] = await Promise.all(jobs);
    if (token !== generation) return;
    const view = info?.view;
    if (view?.displayName) $('title').textContent = view.displayName;
    let tools = '';
    if (signedIn()) {
      const saved = api.savedFeedItems(prefs?.preferences).find((item) => item.value === uri);
      const own = view?.creator?.did && view.creator.did === myDid();
      const buttons = [];
      if (!saved) buttons.push(miniButton('feed-save', 'Save', { uri }));
      else {
        buttons.push(miniButton('feed-pin', saved.pinned ? 'Unpin' : 'Pin', { uri, pinned: saved.pinned ? '1' : '0', type: 'feed' }));
        buttons.push(miniButton('feed-remove', 'Remove', { uri }, true));
      }
      if (own) {
        buttons.push(miniButton('feed-edit', 'Edit', { uri, name: view.displayName || '', description: view.description || '' }));
        buttons.push(miniButton('feed-delete', 'Delete', { uri }, true));
      }
      tools = `<div class="toolbar">${buttons.join('')}</div>`;
    }
    $('view').innerHTML = tools;
    const first = visibleFeed(data.feed, uri);
    if (first.length) paintFeed(first, { append: true });
    else $('view').insertAdjacentHTML('beforeend', emptyHtml('Nothing here', (data.feed || []).length ? 'Posts are hidden by this feed’s settings.' : 'There are no posts to show.'));
    const more = async (cursor) => {
      const page = await api.getFeed(uri, cursor);
      if (token !== generation) return;
      paintFeed(visibleFeed(page.feed, uri), { append: true });
      pagerFor(page.cursor, more);
    };
    pagerFor(data.cursor, more);
  } catch (error) {
    if (!cancelled(token, error)) $('view').innerHTML = emptyHtml('Could not load this feed', error.message);
  }
}

async function showLists() {
  const token = ++generation;
  setChrome({ title: 'Lists', nav: 'lists' });
  if (!signedIn()) {
    $('view').innerHTML = emptyHtml('Lists', 'Sign in to see your Bluesky lists.', '<button type="button" class="primary" data-act="signin">Sign in</button>');
    return;
  }
  showSkeletons();
  try {
    const data = await api.getLists(myDid());
    if (token !== generation) return;
    const tools = `<div class="toolbar"><button type="button" class="primary small" data-act="list-new">New list</button></div>`;
    const listRows = (lists) => (lists || []).map((list) => {
      const blurb = (list.description || '').replace(/\s+/g, ' ').slice(0, 80);
      const detail = [listKind(list.purpose), blurb].filter(Boolean).join(' · ');
      const actions = [
        miniButton('list-edit', 'Edit', {
          uri: list.uri,
          name: list.name || '',
          description: list.description || '',
          purpose: list.purpose || 'app.bsky.graph.defs#curatelist',
        }),
        miniButton('list-delete', 'Delete', { uri: list.uri, name: list.name || 'this list' }, true),
      ].join('');
      return manageRow(imageAvatar(list.avatar, list.name || 'L'), `#/list/${encodeURIComponent(list.uri)}`, list.name || 'List', detail, actions);
    }).join('');
    const rows = listRows(data.lists);
    $('view').innerHTML = tools + (rows ? `<div class="directory">${rows}</div>` : emptyHtml('No lists', 'Create a list to gather people, or to mute them together.'));
    const more = async (cursor) => {
      const page = await api.getLists(myDid(), cursor);
      if (token !== generation) return;
      const extra = listRows(page.lists);
      if (extra) {
        const box = $('view').querySelector('.directory');
        if (box) box.insertAdjacentHTML('beforeend', extra);
        else $('view').insertAdjacentHTML('beforeend', `<div class="directory">${extra}</div>`);
      }
      pagerFor(page.cursor, more);
    };
    pagerFor(data.cursor, more);
  } catch (error) {
    if (!cancelled(token, error)) $('view').innerHTML = emptyHtml('Could not load lists', error.message);
  }
}

async function showList(uri) {
  const token = ++generation;
  setChrome({ title: 'List', nav: 'lists', back: true });
  showSkeletons();
  try {
    const [info, data] = await Promise.all([
      api.getList(uri).catch(() => null),
      api.getListFeed(uri),
    ]);
    if (token !== generation) return;
    const list = info?.list;
    if (list?.name) $('title').textContent = list.name;
    const mine = Boolean(list?.creator?.did && list.creator.did === myDid());
    const buttons = [];
    if (mine) {
      buttons.push(miniButton('list-edit', 'Edit', {
        uri,
        name: list.name || '',
        description: list.description || '',
        purpose: list.purpose || 'app.bsky.graph.defs#curatelist',
      }));
      buttons.push(miniButton('list-delete', 'Delete', { uri, name: list.name || 'this list' }, true));
    }
    if (signedIn() && String(list?.purpose || '').includes('modlist')) {
      const muted = Boolean(list?.viewer?.muted);
      buttons.push(miniButton('list-mute', muted ? 'Unmute list' : 'Mute list', { uri, muted: muted ? '1' : '0' }));
    }
    const meta = [list ? listKind(list.purpose) : '', list?.listItemCount != null ? `${list.listItemCount} people` : ''].filter(Boolean).join(' · ');
    const memberRow = (item) => actorHtml(item.subject, {
      follow: signedIn(),
      self: myDid(),
      extra: mine ? miniButton('list-remove-member', 'Remove', { uri: item.uri }, true) : '',
    });
    const members = (info?.items || []).map(memberRow).join('');
    const morePeople = info?.cursor
      ? `<div class="toolbar"><button type="button" class="text-btn" data-act="list-more" data-uri="${escapeHtml(uri)}" data-cursor="${escapeHtml(info.cursor)}" data-mine="${mine ? '1' : '0'}">More people</button></div>`
      : '';
    const add = mine
      ? `<form id="list-add" class="add-row" data-list="${escapeHtml(uri)}"><input id="list-add-handle" placeholder="Add a handle" autocomplete="off" spellcheck="false"><button class="primary small" type="submit">Add</button></form>`
      : '';
    const head = `<header class="list-head"><h2>${escapeHtml(list?.name || 'List')}</h2>${meta ? `<p class="dim">${escapeHtml(meta)}</p>` : ''}${list?.description ? `<p class="bio">${richText(list.description, list.descriptionFacets)}</p>` : ''}</header>${buttons.length ? `<div class="toolbar">${buttons.join('')}</div>` : ''}${add}${members ? `<div class="directory">${members}</div>` : ''}${morePeople}`;
    $('view').innerHTML = head;
    if ((data.feed || []).length) paintFeed(data.feed, { append: true });
    else $('view').insertAdjacentHTML('beforeend', emptyHtml('No posts', 'People on this list have not posted yet.'));
    const more = async (cursor) => {
      const page = await api.getListFeed(uri, cursor);
      if (token !== generation) return;
      paintFeed(page.feed, { append: true });
      pagerFor(page.cursor, more);
    };
    pagerFor(data.cursor, more);
  } catch (error) {
    if (!cancelled(token, error)) $('view').innerHTML = emptyHtml('Could not load this list', error.message);
  }
}

const PROFILE_FILTERS = {
  posts: ['posts_and_author_threads', 'Posts'],
  replies: ['posts_with_replies', 'Replies'],
  media: ['posts_with_media', 'Media'],
  likes: ['likes', 'Likes'],
};

async function showProfile(actor, tab) {
  const token = ++generation;
  const current = PROFILE_FILTERS[tab] ? tab : 'posts';
  setChrome({
    title: 'Profile',
    nav: 'profile',
    back: true,
    tabs: Object.entries(PROFILE_FILTERS).map(([id, [, label]]) => ({
      href: id === 'posts' ? `#/profile/${encodeURIComponent(actor)}` : `#/profile/${encodeURIComponent(actor)}/${id}`,
      label,
      on: id === current,
    })),
  });
  showSkeletons();
  try {
    const profile = await api.getProfile(actor);
    if (token !== generation) return;
    $('title').textContent = profile.displayName || profile.handle;
    const action = profileAction(profile);
    let feed;
    if (current === 'likes') feed = await api.getActorLikes(profile.handle);
    else feed = await api.getAuthorFeed(profile.handle, PROFILE_FILTERS[current][0]);
    if (token !== generation) return;
    resetPosts();
    const split = current === 'posts' ? await pinnedSplit(profile, feed.feed) : { pinned: [], feed: feed.feed || [] };
    if (token !== generation) return;
    const pinHtml = split.pinned.map((item) => postHtml(item, { pinned: true })).join('');
    const postsHtml = feedHtml(split.feed);
    const blank = pinHtml || postsHtml ? postsHtml : emptyHtml('No posts', 'Nothing in this tab yet.');
    const mine = signedIn() && profile.did === myDid();
    $('view').innerHTML = profileHtml(profile) + profileShelfHtml(mine) + pinHtml + blank;
    $('profile-action').innerHTML = action;
    remember();
    document.documentElement.dataset.ready = '1';
    loadProfileShelf(profile, token);
  } catch (error) {
    if (!cancelled(token, error)) $('view').innerHTML = emptyHtml('Profile unavailable', error.message);
  }
}

async function pinnedSplit(profile, items) {
  const pinned = [];
  const rest = [];
  (items || []).forEach((item) => {
    if (String(item?.reason?.$type || '').includes('reasonPin')) pinned.push(item);
    else rest.push(item);
  });
  const uri = profile?.pinnedPost?.uri;
  if (uri && !pinned.some((item) => item?.post?.uri === uri)) {
    try {
      const data = await api.getPosts([uri]);
      const post = data.posts?.[0];
      if (post?.uri && post.author) pinned.unshift({ post, reason: { $type: 'app.bsky.feed.defs#reasonPin' } });
    } catch {
      /* the profile feed still renders */
    }
  }
  const seen = new Set(pinned.map((item) => item.post?.uri).filter(Boolean));
  return { pinned, feed: rest.filter((item) => !seen.has(item.post?.uri)) };
}

function profileShelfHtml(mine) {
  const action = mine ? '<button type="button" class="text-btn" data-act="profile-attach">Attach</button>' : '';
  return `<section class="shelf" id="profile-shelf"><div class="shelf-head"><h3>Feeds, lists, and starter packs</h3>${action}</div><div id="shelf-body"><p class="dim">Loading…</p></div></section>`;
}

function shelfCards(items, featured, mine) {
  const pinned = new Set((featured || []).map((item) => item.uri));
  return items.map((view) => {
    const card = collectionCardHtml(view);
    if (!card) return '';
    if (!mine || !pinned.has(view.uri)) return card;
    return `<div class="shelf-item">${card}<button type="button" class="text-btn mini" data-act="shelf-unpin" data-uri="${escapeHtml(view.uri)}">Unpin</button></div>`;
  }).join('');
}

async function resolveFeatured(ref) {
  const uri = ref?.uri || '';
  try {
    if (uri.includes('/app.bsky.feed.generator/')) return (await api.getFeedGenerator(uri))?.view || null;
    if (uri.includes('/app.bsky.graph.starterpack/')) return (await api.getStarterPack(uri))?.starterPack || null;
    if (uri.includes('/app.bsky.graph.list/')) return (await api.getList(uri, null, null, 1))?.list || null;
  } catch {
    return null;
  }
  return null;
}

async function loadProfileShelf(profile, token) {
  const did = profile?.did;
  const body = $('shelf-body');
  if (!did || !body) return;
  const mine = signedIn() && did === myDid();
  try {
    const [feeds, lists, packs, featured] = await Promise.all([
      api.getActorFeeds(did).catch(() => ({ feeds: [] })),
      api.getLists(did).catch(() => ({ lists: [] })),
      api.getActorStarterPacks(did).catch(() => ({ starterPacks: [] })),
      api.readFeatured(did).catch(() => []),
    ]);
    if (token !== generation || !$('shelf-body')) return;
    const byUri = new Map();
    const add = (item) => { if (item?.uri && item?.cid) byUri.set(item.uri, item); };
    const packLists = new Set((packs.starterPacks || []).flatMap((pack) => [pack?.record?.list, pack?.list?.uri]).filter(Boolean));
    (feeds.feeds || []).forEach(add);
    (lists.lists || []).forEach((list) => {
      if (packLists.has(list.uri) && String(list.purpose || '').includes('referencelist')) return;
      add(list);
    });
    (packs.starterPacks || []).forEach(add);
    const missing = featured.filter((item) => item?.uri && !byUri.has(item.uri));
    if (missing.length) {
      const resolved = await Promise.all(missing.map((item) => resolveFeatured(item)));
      if (token !== generation || !$('shelf-body')) return;
      resolved.forEach(add);
    }
    const ordered = [];
    const seen = new Set();
    featured.forEach((item) => {
      const view = byUri.get(item.uri);
      if (!view || seen.has(view.uri)) return;
      seen.add(view.uri);
      ordered.push(view);
    });
    byUri.forEach((view) => {
      if (seen.has(view.uri)) return;
      seen.add(view.uri);
      ordered.push(view);
    });
    if (!ordered.length && !mine) {
      $('profile-shelf')?.remove();
      return;
    }
    const visible = ordered.slice(0, 12);
    const rest = ordered.slice(12);
    const more = rest.length
      ? `<button type="button" class="text-btn" data-act="shelf-more">Show ${rest.length} more</button><div class="shelf-more" hidden>${shelfCards(rest, featured, mine)}</div>`
      : '';
    const note = mine
      ? '<p class="dim shelf-note">Pins are saved on your Bluesky profile record, so anyone opening your profile in LibreSky can see them. Feeds, lists, and starter packs you create also show in other Bluesky apps.</p>'
      : '';
    const cards = shelfCards(visible, featured, mine);
    $('shelf-body').innerHTML = `${cards ? `<div class="shelf-list">${cards}</div>` : '<p class="dim">Nothing here yet. Attach a feed, list, or starter pack.</p>'}${more}${note}`;
  } catch (error) {
    if (token === generation && $('shelf-body')) $('shelf-body').innerHTML = `<p class="dim">${escapeHtml(error.message || 'Could not load these.')}</p>`;
  }
}

function profileAction(profile) {
  if (!signedIn()) return '<button type="button" class="primary small" data-act="signin">Sign in</button>';
  if (profile.did === myDid()) return '<button type="button" class="primary small" data-act="edit-profile">Edit profile</button>';
  const following = profile.viewer?.following || '';
  const blocking = profile.viewer?.blocking || '';
  const follow = blocking
    ? ''
    : `<button type="button" class="follow${following ? ' on' : ''}" data-act="follow" data-did="${escapeHtml(profile.did)}" data-following="${escapeHtml(following)}">${following ? 'Following' : 'Follow'}</button>`;
  const block = `<button type="button" class="${blocking ? 'danger' : 'text-btn'}" data-act="block-profile" data-did="${escapeHtml(profile.did)}" data-blocking="${escapeHtml(blocking)}">${blocking ? 'Blocked' : 'Block'}</button>`;
  const report = `<button type="button" class="text-btn" data-act="report-profile" data-did="${escapeHtml(profile.did)}">Report</button>`;
  const message = blocking
    ? ''
    : `<button type="button" class="text-btn" data-act="message-profile" data-did="${escapeHtml(profile.did)}">Message</button>${callToolsHtml(profile.did)}`;
  return `<span class="profile-actions">${follow}${message}${block}${report}</span>`;
}

async function showPeople(actor, kind) {
  const token = ++generation;
  setChrome({ title: kind === 'followers' ? 'Followers' : 'Following', nav: 'profile', back: true });
  showSkeletons();
  try {
    const data = kind === 'followers' ? await api.getFollowers(actor) : await api.getFollows(actor);
    if (token !== generation) return;
    const list = data.followers || data.follows || [];
    $('view').innerHTML = list.map(actorHtml).join('') || emptyHtml('Nobody here', 'This list is empty.');
  } catch (error) {
    if (!cancelled(token, error)) $('view').innerHTML = emptyHtml('Could not load this list', error.message);
  }
}

async function showThread(actor, rkey) {
  const token = ++generation;
  setChrome({ title: 'Post', nav: 'home', back: true, tools: gearButton('thread-settings', 'Thread settings') });
  showSkeletons();
  try {
    const did = actor.startsWith('did:') ? actor : await api.resolveHandle(actor);
    const data = await api.getPostThread(`at://${did}/app.bsky.feed.post/${rkey}`);
    if (token !== generation) return;
    const thread = data.thread;
    if (!thread?.post) {
      $('view').innerHTML = emptyHtml('Post unavailable', 'This post could not be loaded.');
      return;
    }
    const ancestors = threadList(thread);
    resetPosts();
    const above = ancestors.map((node, index) => (node.missing
      ? '<div class="missing">Post unavailable</div>'
      : postHtml(node, { connected: true, feed: true }))).join('');
    const replies = sortThreadReplies(thread.replies || [], threadPrefs(), myDid()).map((node) => (node.post ? postHtml(node) : '<div class="missing">Reply unavailable</div>')).join('');
    const replyBox = signedIn()
      ? `<button type="button" class="prompt" data-act="thread-reply" data-uri="${escapeHtml(thread.post.uri)}"><span>Write a reply</span></button>`
      : '';
    $('view').innerHTML = above + postHtml({ post: thread.post, reply: thread.parent ? { parent: thread.parent.post ? { author: thread.parent.post.author } : null } : null }) + replyBox + replies;
    remember();
    document.documentElement.dataset.ready = '1';
  } catch (error) {
    if (!cancelled(token, error)) $('view').innerHTML = emptyHtml('Could not open this post', error.message);
  }
}

function accountListHtml() {
  const current = myDid();
  const list = listAccounts();
  if (!list.length) return '<p class="dim">No saved accounts on this browser yet.</p>';
  return list.map((entry) => {
    const name = entry.displayName || entry.handle || 'Account';
    const handle = entry.handle ? `@${entry.handle}` : entry.did;
    const kind = entry.kind === 'password' ? 'App password' : 'Bluesky login';
    const on = entry.did === current;
    const initial = (name.trim().charAt(0) || 'L').toUpperCase();
    const photo = entry.avatar ? `<img src="${escapeHtml(entry.avatar)}" alt="">` : '';
    const removeLabel = on ? 'Sign out' : 'Remove';
    return `<div class="account-line"><button type="button" class="account-switch${on ? ' on' : ''}" data-act="switch-account" data-did="${escapeHtml(entry.did)}"><span class="avatar" data-initial="${escapeHtml(initial)}">${photo}</span><span><strong>${escapeHtml(name)}</strong><span class="handle">${escapeHtml(handle)} · ${kind}${on ? ' · Current' : ''}</span></span></button><button type="button" class="text-btn mini" data-act="remove-account" data-did="${escapeHtml(entry.did)}">${removeLabel}</button></div>`;
  }).join('');
}

const aiDrafts = new Map();
let aiThread = [];
let aiSeq = 0;

function aiSettingsHtml() {
  const saved = loadAi();
  const provider = saved?.provider || 'grok';
  const known = providerById(provider);
  const model = saved?.model || known.model || '';
  const options = AI_PROVIDERS.map((item) => `<option value="${item.id}"${item.id === provider ? ' selected' : ''}>${escapeHtml(item.label)}</option>`).join('');
  const keyHint = saved ? 'Saved on this browser. Type a new key to replace it.' : 'Paste the key from that account';
  const status = saved
    ? `${known.label} is saved on this browser${saved.model ? ` · ${saved.model}` : ''}.`
    : 'No AI account on this browser yet.';
  const remove = saved ? '<button type="button" class="danger" id="ai-clear" data-act="ai-clear">Remove</button>' : '';
  return `<p class="dim">Bring your own account. <a class="text-link" href="#/ai">@ai and @si</a> ask it from this browser. The key stays here and is sent only to the provider you pick.</p>
    <form id="ai-form" class="ai-form">
      <label>Provider
        <select id="ai-provider">${options}</select>
      </label>
      <label>Model
        <input id="ai-model" value="${escapeHtml(model)}" data-auto="${!saved || model === known.model ? '1' : '0'}" maxlength="80" spellcheck="false" autocapitalize="off" autocomplete="off">
      </label>
      <label id="ai-base-label"${provider === 'custom' ? '' : ' hidden'}>API address
        <input id="ai-base" value="${escapeHtml(provider === 'custom' ? (saved?.base || '') : '')}" maxlength="200" spellcheck="false" autocapitalize="off" autocomplete="off" placeholder="https://example.com/v1">
      </label>
      <label>API key
        <input id="ai-key" type="password" maxlength="2000" spellcheck="false" autocomplete="off" placeholder="${escapeHtml(keyHint)}">
      </label>
      <div class="toolbar">
        <button class="primary small" type="submit">Save</button>
        <button type="button" class="text-btn" id="ai-check" data-act="ai-check">Check</button>
        ${remove}
      </div>
      <p class="dim" id="ai-status">${escapeHtml(status)}</p>
    </form>
    <p class="dim">Grok uses an xAI key from <a href="https://console.x.ai/team/default/api-keys" target="_blank" rel="noopener noreferrer">console.x.ai</a>. Gemini uses a key from <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer">Google AI Studio</a>. OpenAI uses a key from <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer">platform.openai.com</a>. Other accounts need an https address that accepts OpenAI chat completions. A server on this computer can use http://127.0.0.1 or http://localhost.</p>`;
}

function readAiForm() {
  const saved = loadAi();
  const typed = $('ai-key')?.value || '';
  return prepareAi({
    provider: $('ai-provider')?.value || 'grok',
    model: $('ai-model')?.value || '',
    base: $('ai-base')?.value || '',
    apiKey: typed.trim() || saved?.apiKey || '',
  });
}

function syncAiFields() {
  const select = $('ai-provider');
  const model = $('ai-model');
  if (!select || !model) return;
  const item = providerById(select.value);
  const baseLabel = $('ai-base-label');
  if (baseLabel) baseLabel.hidden = item.id !== 'custom';
  const current = model.value.trim();
  const known = AI_PROVIDERS.some((provider) => provider.model && provider.model === current);
  if (model.dataset.auto === '1' || !current || known) {
    model.value = item.model || '';
    model.dataset.auto = '1';
  }
}

function saveAiForm(event) {
  event.preventDefault();
  try {
    const next = saveAi(readAiForm());
    toast(`${providerById(next.provider).label} saved on this browser`);
    if (parseHash()[0] === 'settings') showSettings();
  } catch (error) {
    toast(error.message);
  }
}

async function checkAiForm() {
  const button = $('ai-check');
  let account;
  try { account = readAiForm(); } catch (error) { toast(error.message); return; }
  if (button) button.disabled = true;
  try {
    await askAi(account, [
      { role: 'system', content: AI_SYSTEM },
      { role: 'user', content: 'Reply with ok.' },
    ], AbortSignal.timeout ? AbortSignal.timeout(45000) : undefined);
    toast(`${providerById(account.provider).label} replied.`);
  } catch (error) {
    if (error?.name === 'AbortError') toast('The account took too long.');
    else toast(error.message || 'The account did not answer.');
  } finally {
    if (button?.isConnected) button.disabled = false;
  }
}

function soundRow(key, label, sounds) {
  const on = Boolean(sounds[key]);
  const volume = sounds.volume?.[key] ?? 70;
  return `<div class="sound-row"><span>${label}</span><label class="vol"><span class="dim">Volume</span> <b>${volume}%</b><input type="range" min="0" max="100" step="1" value="${volume}" data-volume="${key}" aria-label="${escapeHtml(label)} volume"></label><button type="button" data-sound="${key}" aria-pressed="${on ? 'true' : 'false'}">${on ? 'On' : 'Off'}</button></div>`;
}

function switchRow(name, label, on, hint = '') {
  return `<label class="switch-row"><span><strong>${escapeHtml(label)}</strong>${hint ? `<span class="dim">${escapeHtml(hint)}</span>` : ''}</span><input type="checkbox" data-pref="${escapeHtml(name)}" ${on ? 'checked' : ''}></label>`;
}

function feedSettingsBody(feedId, { heading = true, title = 'Home' } = {}) {
  const prefs = feedView(feedId);
  const prefix = feedId === 'home' ? 'home' : 'feed';
  const head = heading ? `<h2>${escapeHtml(title)}</h2>` : '';
  const note = feedId === 'home'
    ? 'Saved as Bluesky home preferences, so the official app can use the same choices.'
    : 'Saved as this feed’s Bluesky preferences.';
  return `${head}<p class="dim">${note}</p>
    ${switchRow(`${prefix}.showReplies`, 'Show replies', !prefs.hideReplies, 'Off hides every reply.')}
    ${switchRow(`${prefix}.showOutside`, 'Replies outside people you follow', !prefs.hideRepliesByUnfollowed, 'Off keeps a reply when you follow the person being replied to.')}
    ${switchRow(`${prefix}.showReposts`, 'Show reposts', !prefs.hideReposts)}
    ${switchRow(`${prefix}.showQuotes`, 'Show quote posts', !prefs.hideQuotePosts)}`;
}

function homeSettingsHtml() {
  return feedSettingsBody('home');
}

function threadSettingsHtml({ heading = true } = {}) {
  const prefs = threadPrefs();
  const sorts = [['oldest', 'Oldest'], ['newest', 'Newest'], ['most-likes', 'Most likes']];
  if (!sorts.some(([id]) => id === prefs.sort)) sorts.push([prefs.sort, prefs.sort === 'hotness' ? 'Hot' : 'Random']);
  const head = heading ? '<h2>Threads</h2>' : '';
  return `${head}<p class="dim">Saved as Bluesky thread preferences. The official app uses this reply order.</p>
    <div class="segmented">${sorts.map(([id, label]) => `<button type="button" data-thread-sort="${id}" aria-pressed="${prefs.sort === id ? 'true' : 'false'}">${label}</button>`).join('')}</div>
    ${switchRow('thread.followed', 'Prioritize people you follow', prefs.prioritizeFollowedUsers)}`;
}

function searchSettingsHtml({ heading = true } = {}) {
  const prefs = searchPrefs();
  const head = heading ? '<h2>Search</h2>' : '';
  return `${head}<p class="dim">The gear on Search stores these on your account with AT Protocol, in app.libresky.settings. Bluesky has no shared search-settings record.</p>
    <div class="segmented"><button type="button" data-sort="latest" aria-pressed="${prefs.sort !== 'top'}">Latest</button><button type="button" data-sort="top" aria-pressed="${prefs.sort === 'top'}">Top</button></div>
    ${switchRow('search.following', 'People you follow', prefs.following)}
    ${switchRow('search.hideReplies', 'Hide replies', prefs.hideReplies)}
    ${switchRow('search.languagesOnly', 'Only content languages', prefs.languagesOnly)}
    ${switchRow('search.hideSensitive', 'Hide sensitive content', prefs.hideSensitive)}`;
}

function voiceOptions(selected) {
  const voices = window.speechSynthesis?.getVoices?.() || [];
  const rows = [`<option value="">Device default</option>`];
  voices.forEach((voice) => {
    const value = voice.voiceURI || voice.name;
    rows.push(`<option value="${escapeHtml(value)}"${value === selected ? ' selected' : ''}>${escapeHtml(voice.name)} · ${escapeHtml(voice.lang)}</option>`);
  });
  if (selected && !voices.some((voice) => (voice.voiceURI || voice.name) === selected)) {
    rows.push(`<option value="${escapeHtml(selected)}" selected>${escapeHtml(selected)}</option>`);
  }
  return rows.join('');
}

function voiceSettingsHtml() {
  const prefs = voicePrefs();
  const ready = typeof window.speechSynthesis?.speak === 'function';
  if (!ready) return '<h2>Read aloud</h2><p class="dim">This browser cannot read posts aloud.</p>';
  return `<h2>Read aloud</h2>
    <p class="dim">The speaker on a post reads the text and the image description. Voice, speed, and volume are saved on your account.</p>
    <label class="voice-label">Voice <select id="voice-pick">${voiceOptions(prefs.voiceURI)}</select></label>
    <label class="vol voice-vol"><span>Volume</span> <b>${prefs.volume}%</b><input id="voice-volume" type="range" min="0" max="100" step="1" value="${prefs.volume}" aria-label="Read aloud volume"></label>
    <label class="vol voice-vol"><span>Speed</span> <b>${prefs.rate}%</b><input id="voice-rate" type="range" min="50" max="200" step="5" value="${prefs.rate}" aria-label="Read aloud speed"></label>
    <button type="button" class="text-btn" data-act="voice-sample">Play a sample</button>`;
}

function profileSettingsHtml() {
  const edit = signedIn()
    ? '<button type="button" class="primary small" data-act="edit-profile">Edit profile</button>'
    : '<button type="button" class="primary small" data-act="signin">Sign in</button>';
  return `<h2>Profile</h2>
    <p class="dim">Your name, bio, avatar, banner, and pinned post are stored on the Bluesky profile record. Other Bluesky apps read that same record. Feeds, lists, and starter packs you pin on your profile are stored on it too.</p>
    ${edit}`;
}

let tuneFeed = 'home';

function openTune(kind, feedId) {
  const dialog = $('tune');
  const title = $('tune-title');
  const body = $('tune-body');
  if (!dialog || !body || !title) return;
  if (kind === 'search') {
    title.textContent = 'Search settings';
    body.innerHTML = searchSettingsHtml({ heading: false });
  } else if (kind === 'thread') {
    title.textContent = 'Threads';
    body.innerHTML = threadSettingsHtml({ heading: false });
  } else if (kind === 'feed') {
    tuneFeed = feedId || 'home';
    title.textContent = 'Feed settings';
    body.innerHTML = feedSettingsBody(tuneFeed, { heading: false, title: 'Feed' });
  } else {
    tuneFeed = 'home';
    title.textContent = 'Home';
    body.innerHTML = feedSettingsBody('home', { heading: false });
  }
  if (!dialog.open) dialog.showModal();
}

function chooseSearchSort(sort) {
  if (sort !== 'latest' && sort !== 'top') return;
  searchSort = sort;
  saveSearchPrefs({ sort });
  document.querySelectorAll('[data-sort]').forEach((button) => {
    button.setAttribute('aria-pressed', button.dataset.sort === sort ? 'true' : 'false');
  });
  const query = $('search-q')?.value.trim() || (parseHash()[0] === 'search' ? (parseHash()[1] || '') : '');
  if (parseHash()[0] === 'search' && query) showSearch(query, { focus: false });
}

function chooseThreadSort(sort) {
  const allowed = new Set(['oldest', 'newest', 'most-likes', 'random', 'hotness']);
  if (!allowed.has(sort)) return;
  saveThreadPrefs({ sort });
  document.querySelectorAll('[data-thread-sort]').forEach((button) => {
    button.setAttribute('aria-pressed', button.dataset.threadSort === sort ? 'true' : 'false');
  });
  if (parseHash()[2] === 'post') route();
}

function onPrefToggle(name, checked) {
  if (name === 'home.showReplies' || name === 'feed.showReplies') {
    saveFeedView(name.startsWith('feed.') ? tuneFeed : 'home', { hideReplies: !checked });
  } else if (name === 'home.showOutside' || name === 'feed.showOutside') {
    saveFeedView(name.startsWith('feed.') ? tuneFeed : 'home', { hideRepliesByUnfollowed: !checked });
  } else if (name === 'home.showReposts' || name === 'feed.showReposts') {
    saveFeedView(name.startsWith('feed.') ? tuneFeed : 'home', { hideReposts: !checked });
  } else if (name === 'home.showQuotes' || name === 'feed.showQuotes') {
    saveFeedView(name.startsWith('feed.') ? tuneFeed : 'home', { hideQuotePosts: !checked });
  } else if (name === 'thread.followed') {
    saveThreadPrefs({ prioritizeFollowedUsers: checked });
    if (parseHash()[2] === 'post') route();
    return;
  } else if (name === 'search.following' || name === 'search.hideReplies' || name === 'search.languagesOnly' || name === 'search.hideSensitive') {
    saveSearchPrefs({ [name.slice('search.'.length)]: checked });
    const query = parseHash()[0] === 'search' ? (parseHash()[1] || '') : '';
    if (query) showSearch(query, { focus: false });
    return;
  } else return;
  const feedId = name.startsWith('feed.') ? tuneFeed : 'home';
  if (feedId === 'home' && !parseHash()[0]) route();
  else if (feedId !== 'home' && parseHash()[0] === 'feed' && parseHash()[1] === feedId) route();
}

let speakingUri = '';

function stopSpeech() {
  window.speechSynthesis?.cancel();
  speakingUri = '';
  paintSpeaking();
}

function paintSpeaking() {
  document.querySelectorAll('[data-act="speak"]').forEach((button) => {
    const uri = button.closest('.post')?.dataset.uri || '';
    const on = Boolean(uri && uri === speakingUri);
    button.classList.toggle('on', on);
    button.setAttribute('aria-pressed', on ? 'true' : 'false');
  });
}

function chosenVoice() {
  const prefs = voicePrefs();
  const voices = window.speechSynthesis?.getVoices?.() || [];
  return voices.find((voice) => (voice.voiceURI || voice.name) === prefs.voiceURI) || null;
}

function speakAloud(text, uri = '') {
  const synth = window.speechSynthesis;
  if (!synth?.speak) {
    toast('This browser cannot read aloud.');
    return;
  }
  const prefs = voicePrefs();
  if (prefs.volume <= 0) {
    toast('Read-aloud volume is off. Change it in Settings.');
    return;
  }
  const clean = String(text || '').trim();
  if (!clean) {
    toast('Nothing to read.');
    return;
  }
  synth.cancel();
  const utter = new SpeechSynthesisUtterance(clean);
  utter.volume = Math.max(0, Math.min(1, prefs.volume / 100));
  utter.rate = Math.max(0.5, Math.min(2, prefs.rate / 100));
  const voice = chosenVoice();
  if (voice) utter.voice = voice;
  speakingUri = uri;
  paintSpeaking();
  utter.onend = () => {
    if (speakingUri === uri) speakingUri = '';
    paintSpeaking();
  };
  utter.onerror = () => {
    speakingUri = '';
    paintSpeaking();
  };
  synth.speak(utter);
}

function speakPost(found) {
  const uri = found?.post?.uri || '';
  if (uri && speakingUri === uri) {
    stopSpeech();
    return;
  }
  speakAloud(speechText(found?.post), uri);
}

function fillVoiceSelect() {
  const select = $('voice-pick');
  if (!select) return;
  const current = select.value || voicePrefs().voiceURI;
  select.innerHTML = voiceOptions(current);
}

function showSettings() {
  generation += 1;
  const token = generation;
  setChrome({ title: 'Settings', nav: 'settings', back: true });
  const theme = document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
  const words = mutedWords();
  const sounds = soundPrefs();
  $('view').innerHTML = `<section class="settings">
    <h2>Accounts</h2>
    <p class="dim">Switch accounts without dropping the others. This browser keeps up to 8.</p>
    <div id="account-list">${accountListHtml()}</div>
    <div class="toolbar">
      <button type="button" class="primary small" data-act="add-account">Add account</button>
      ${signedIn() ? '<button type="button" class="danger" data-act="signout">Sign out</button>' : '<button type="button" class="primary small" data-act="signin">Sign in</button>'}
    </div>
    <h2>App passwords</h2>
    <p class="dim">Create a token for another app. The password is shown once, then only the name stays here.</p>
    <form id="app-pass-form" class="mute-form"><input id="app-pass-name" placeholder="App name" maxlength="40" autocomplete="off"><button class="primary small" type="submit">Create</button></form>
    <div id="app-pass-reveal" hidden></div>
    <div id="app-pass-list"><p class="dim">Loading app passwords…</p></div>
    <p class="dim">If this server refuses the request, create one at <a href="https://bsky.app/settings/app-passwords" target="_blank" rel="noopener noreferrer">Bluesky app passwords</a>.</p>
    <h2>Muted accounts</h2>
    <div id="muted-accounts" class="directory"><p class="dim">Loading muted accounts…</p></div>
    <h2>Blocked accounts</h2>
    <div id="blocked-accounts" class="directory"><p class="dim">Loading blocked accounts…</p></div>
    <h2>Appearance</h2>
    <div class="segmented">
      <button type="button" data-theme-set="light" aria-pressed="${theme === 'light'}">Light</button>
      <button type="button" data-theme-set="dark" aria-pressed="${theme === 'dark'}">Dark</button>
    </div>
    <h2>Sounds</h2>
    <p class="dim">Each notice has its own volume. Incoming calls use the chat sound. New posts on Home start off. The browser may stay quiet until you click the page. Signed-in choices are saved on your account.</p>
    <div class="sound-list">
      ${soundRow('chat', 'New chat messages', sounds)}
      ${soundRow('notifications', 'New notifications', sounds)}
      ${soundRow('posts', 'New posts on Home', sounds)}
    </div>
    ${voiceSettingsHtml()}
    ${homeSettingsHtml()}
    ${threadSettingsHtml()}
    ${searchSettingsHtml()}
    ${profileSettingsHtml()}
    <h2>Languages</h2>
    <p class="dim">Discover shows posts written in the content languages you turn on. Turn them all off to see every language. Post languages are saved on the posts you write, up to three. Tab finishes a word, an @name, or a #tag while you type. Bluesky has no shared language preference, so these are saved on your account as LibreSky settings and kept in this browser too.</p>
    <input id="lang-find" class="lang-find" placeholder="Find a language" autocomplete="off">
    <h3>Content</h3>
    <div class="lang-grid" id="content-langs">${languageButtons('content', languagePrefs().content)}</div>
    <h3>Posts</h3>
    <div class="lang-grid" id="post-langs">${languageButtons('posts', languagePrefs().posts)}</div>
    <h2>AI</h2>
    ${aiSettingsHtml()}
    <h2>Muted words</h2>
    <p class="dim">Posts containing these words are collapsed in your feeds. Signed in, they are saved as Bluesky muted words, so the official app hides them too.</p>
    <form id="mute-form" class="mute-form"><input id="mute-input" placeholder="Add a word" maxlength="40"><button class="primary small" type="submit">Add</button></form>
    <div class="chips">${words.map((word) => `<button type="button" class="chip" data-unmute="${escapeHtml(word)}" aria-label="Remove ${escapeHtml(word)}"><span>${escapeHtml(word)}</span><span class="chip-x" aria-hidden="true">×</span></button>`).join('')}</div>
    <h2>Keyboard</h2>
    <ul class="keys">
      <li><kbd>n</kbd> New post</li><li><kbd>Tab</kbd> Complete a word, @name, or #tag</li><li><kbd>j</kbd> <kbd>k</kbd> Next and previous post</li>
      <li><kbd>a</kbd> Read the selected post aloud</li>
      <li><kbd>l</kbd> Like</li><li><kbd>r</kbd> Reply</li><li><kbd>t</kbd> Repost</li>
      <li><kbd>b</kbd> Bookmark</li><li><kbd>s</kbd> Share</li><li><kbd>Enter</kbd> Open post</li><li><kbd>/</kbd> Search</li>
    </ul>
  </section>`;
  loadSettingsLists(token);
}

async function loadSettingsLists(token) {
  await Promise.all([loadAppPasswords(token), loadMutedAccounts(token), loadBlockedAccounts(token)]);
}

async function loadAppPasswords(token = generation) {
  const box = $('app-pass-list');
  if (!box) return;
  if (!signedIn()) {
    box.innerHTML = '<p class="dim">Sign in to create tokens for other apps.</p>';
    return;
  }
  try {
    const data = await api.listAppPasswords();
    if (token !== generation || !$('app-pass-list')) return;
    const rows = data.passwords || [];
    box.innerHTML = rows.length
      ? rows.map((item) => `<div class="person"><span class="person-link"><strong>${escapeHtml(item.name || 'App')}</strong><span class="handle">${escapeHtml(item.createdAt ? new Date(item.createdAt).toLocaleString() : '')}</span></span><button type="button" class="danger mini" data-act="revoke-token" data-name="${escapeHtml(item.name || '')}">Revoke</button></div>`).join('')
      : '<p class="dim">No app passwords yet.</p>';
  } catch (error) {
    if (token !== generation || !$('app-pass-list')) return;
    box.innerHTML = `<p class="dim">${escapeHtml(error.message || 'App passwords are unavailable for this sign-in.')} Use <a href="https://bsky.app/settings/app-passwords" target="_blank" rel="noopener noreferrer">Bluesky app passwords</a>.</p>`;
  }
}

async function loadMutedAccounts(token = generation) {
  const box = $('muted-accounts');
  if (!box) return;
  if (!signedIn()) {
    box.innerHTML = '<p class="dim">Sign in to see muted accounts.</p>';
    return;
  }
  try {
    const data = await api.getMutes();
    if (token !== generation || !$('muted-accounts')) return;
    const list = data.mutes || [];
    box.innerHTML = list.length
      ? list.map((actor) => actorHtml(actor, { extra: `<button type="button" class="text-btn mini" data-act="unmute-account" data-did="${escapeHtml(actor.did || '')}">Unmute</button>` })).join('')
      : '<p class="dim">No muted accounts.</p>';
  } catch (error) {
    if (token !== generation || !$('muted-accounts')) return;
    box.innerHTML = `<p class="dim">${escapeHtml(error.message || 'Muted accounts are unavailable.')}</p>`;
  }
}

async function loadBlockedAccounts(token = generation) {
  const box = $('blocked-accounts');
  if (!box) return;
  if (!signedIn()) {
    box.innerHTML = '<p class="dim">Sign in to see blocked accounts.</p>';
    return;
  }
  try {
    const data = await api.getBlocks();
    if (token !== generation || !$('blocked-accounts')) return;
    const list = data.blocks || [];
    box.innerHTML = list.length
      ? list.map((actor) => actorHtml(actor, { extra: `<button type="button" class="danger mini" data-act="unblock-account" data-uri="${escapeHtml(actor.viewer?.blocking || '')}">Unblock</button>` })).join('')
      : '<p class="dim">No blocked accounts.</p>';
  } catch (error) {
    if (token !== generation || !$('blocked-accounts')) return;
    box.innerHTML = `<p class="dim">${escapeHtml(error.message || 'Blocked accounts are unavailable.')}</p>`;
  }
}

function showAi() {
  generation += 1;
  setChrome({ title: 'AI', nav: 'ai', back: true });
  const saved = loadAi();
  const ready = aiReady(saved);
  const known = providerById(saved?.provider);
  const status = ready
    ? `${known.label} is ready${saved.model ? ` · ${saved.model}` : ''}. A question goes from this browser to that account.`
    : 'No account yet. Add one in Settings. Nothing is sent until you do.';
  const turns = aiThread.map((turn) => (turn.role === 'assistant'
    ? assistantHtml(turn.content, { kicker: 'Your account' })
    : `<div class="bubble mine"><p>${richText(turn.content)}</p></div>`)).join('');
  $('view').innerHTML = `<section class="settings ai-doc">
    <h2>Your account</h2>
    <p>${escapeHtml(status)}</p>
    <p><a class="text-link" href="#/settings">Open AI in Settings</a></p>
    <h2>@ai and @si</h2>
    <p>@ai and @si are the same tag. They are not Bluesky accounts, and they do not mention a person.</p>
    <p>In a chat, a message that contains @ai or @si asks the account you saved. That message is not sent to the other person. The question stays in the box. The answer stays on this screen until you press Send, which posts it into the chat as you. Edit puts the answer in the box. Dismiss drops it.</p>
    <p>On this page the tag is optional. Ask sends the box to the same account. Those replies stay here until you reload.</p>
    <p>A tag in a post is only a highlight. Posting does not call the model.</p>
    <p>Grok, Gemini, OpenAI, or another OpenAI-style account all use the same tags. LibreSky does not keep a copy of the key. A question is sent only when you ask, and only to the provider you chose.</p>
    <h2>Ask</h2>
    <div class="messages ai-thread">${turns}</div>
    <form class="reply-bar ai-ask" id="ai-ask">
      <div class="composer-field chat-field"><pre class="field-highlight" id="ai-highlight" aria-hidden="true"></pre><textarea id="ai-text" rows="3" maxlength="4000" placeholder="Ask @ai or @si"></textarea></div>
      <button class="primary small" type="submit">Ask</button>
      <p class="chat-hint"><span class="chat-hint-keys">Enter asks. Shift+Enter adds a line. Tab completes.</span><span class="chat-hint-touch">Enter adds a line.</span></p>
    </form>
  </section>`;
  const area = $('ai-text');
  paintFieldHighlight(area, $('ai-highlight'));
  applyFieldLanguage(area);
  fitChatInput(area);
}

async function askOnPage(text) {
  const saved = loadAi();
  if (!aiReady(saved)) {
    toast('Add an AI account in Settings to use @ai and @si.');
    return;
  }
  const area = $('ai-text');
  const button = area?.form?.querySelector('button[type="submit"]');
  if (area) area.disabled = true;
  if (button) button.disabled = true;
  const seq = ++aiSeq;
  try {
    const prior = aiThread.slice(-8).map((turn) => ({ role: turn.role, content: turn.content }));
    const answer = await askAi(saved, [
      { role: 'system', content: AI_SYSTEM },
      ...prior,
      { role: 'user', content: text },
    ], AbortSignal.timeout ? AbortSignal.timeout(45000) : undefined);
    if (seq !== aiSeq) return;
    aiThread = [...aiThread, { role: 'user', content: text }, { role: 'assistant', content: answer }].slice(-40);
    if (parseHash()[0] === 'ai') showAi();
  } catch (error) {
    if (seq !== aiSeq) return;
    if (error?.name === 'AbortError') toast('The account took too long.');
    else toast(error.message || 'The account did not answer.');
    if (area?.isConnected) {
      area.disabled = false;
      area.focus();
    }
    if (button?.isConnected) button.disabled = false;
  }
}

async function showCalls() {
  const token = ++generation;
  setChrome({ title: 'Calls', nav: 'calls' });
  const ready = canCall();
  const note = ready
    ? 'Voice and video connect two LibreSky windows. Enter a handle to call someone new, or pick someone you already chat with. An incoming call can be accepted or declined.'
    : 'This page is not a secure context, or this browser has no WebRTC, so a call cannot start here. Open LibreSky over https, or on http://127.0.0.1.';
  if (!signedIn()) {
    $('view').innerHTML = `<p class="call-note dim">${escapeHtml(note)}</p>${emptyHtml('Calls', 'Sign in to start a voice or video call.', '<button type="button" class="primary" data-act="signin">Sign in</button>')}`;
    return;
  }
  showSkeletons();
  try {
    const data = await api.listConvos();
    if (token !== generation) return;
    const rows = (data.convos || []).map((convo) => callConvoHtml(convo, myDid())).join('');
    $('view').innerHTML = `<p class="call-note dim">${escapeHtml(note)}</p>${callStartHtml()}${rows || emptyHtml('No chats yet', 'Enter a handle above to start a voice or video call.')}`;
  } catch (error) {
    if (!cancelled(token, error)) $('view').innerHTML = `<p class="call-note dim">${escapeHtml(note)}</p>${callStartHtml()}${emptyHtml('Calls are unavailable', error.message || 'This sign-in does not include chat access.')}`;
  }
}

async function startCallToHandle(media) {
  if (!signedIn()) return requireSignIn();
  if (!canCall()) {
    toast('Voice and video need a secure page. Open LibreSky over https, or on http://127.0.0.1.');
    return;
  }
  const input = $('call-handle');
  const handle = input?.value.trim().replace(/^@/, '');
  if (!handle) {
    toast('Enter a handle to call.');
    input?.focus();
    return;
  }
  const buttons = [...(input?.form?.querySelectorAll('button') || [])];
  buttons.forEach((button) => { button.disabled = true; });
  try {
    const did = await api.resolveHandle(handle);
    if (!did) throw new Error('Could not find that account.');
    if (did === myDid()) throw new Error('You cannot call yourself.');
    const convoId = await convoIdFor(did);
    await startCall({ convoId, peerDid: did, media });
  } catch (error) {
    toast(error?.message || 'The call could not start.');
  } finally {
    buttons.forEach((button) => { if (button.isConnected) button.disabled = false; });
  }
}

const PUBLISHED = 'https://thewhitewitchtm.github.io/LibreSky/';
const DOWNLOADS = [
  ['LibreSky-linux-x64.zip', 'Linux', 'Unzip the folder and run the LibreSky file.'],
  ['LibreSky-windows-x64.zip', 'Windows', 'Unzip the folder and run LibreSky.exe.'],
  ['LibreSky-mac-x64.zip', 'Mac', 'Unzip the folder, then right-click LibreSky.app and choose Open. The Mac app is not signed.'],
];

let desktopManifest = null;

function downloadsHtml(compact) {
  const links = DOWNLOADS.map(([file, label]) => `<button type="button" class="download-btn" data-act="desktop-download" data-file="${escapeHtml(file)}">${escapeHtml(label)}</button>`).join('');
  const notes = compact
    ? '<p class="dim download-note">The Mac app is not signed. Right-click it and choose Open the first time.</p>'
    : `<ul class="download-notes">${DOWNLOADS.map(([, label, note]) => `<li><strong>${escapeHtml(label)}.</strong> ${escapeHtml(note)}</li>`).join('')}</ul>`;
  return `<div class="app-downloads"><p class="download-label">Desktop app</p><div class="download-row">${links}</div>${notes}</div>`;
}

function saveBlob(blob, name) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = name;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 60000);
}

async function loadDesktopManifest() {
  if (desktopManifest) return desktopManifest;
  const response = await fetch('./download/manifest.json', { cache: 'no-cache' });
  if (!response.ok) throw new Error('The desktop downloads are not on this page yet.');
  desktopManifest = await response.json();
  return desktopManifest;
}

async function saveDesktopZip(file, button) {
  if (window.libreskyDesktop) {
    window.open(`${PUBLISHED}#/downloads/${encodeURIComponent(file)}`, '_blank', 'noopener');
    toast('The download opened in your browser.');
    return;
  }
  const label = button?.textContent || '';
  if (button) {
    button.disabled = true;
    button.textContent = 'Starting…';
  }
  try {
    const manifest = await loadDesktopManifest();
    const parts = manifest.files?.[file];
    if (!parts?.length) throw new Error('That download is not listed.');
    const chunks = [];
    let got = 0;
    const total = parts.reduce((sum, part) => sum + (part.size || 0), 0);
    for (const part of parts) {
      const response = await fetch(`./download/${part.name}`, { cache: 'no-cache' });
      if (!response.ok) throw new Error('A piece of the download is missing.');
      const data = await response.arrayBuffer();
      chunks.push(data);
      got += data.byteLength;
      if (button && total) button.textContent = `${Math.min(99, Math.round((got / total) * 100))}%`;
    }
    saveBlob(new Blob(chunks, { type: 'application/zip' }), file);
    toast('Download ready. Unzip it and run LibreSky.');
  } catch (error) {
    toast(error?.message || 'The download failed.');
  } finally {
    if (button?.isConnected) {
      button.disabled = false;
      button.textContent = label;
    }
  }
}

function showDownloads() {
  generation += 1;
  setChrome({ title: 'Download', nav: 'downloads', back: true });
  $('view').innerHTML = `<div class="download-page"><h2>Desktop app</h2><p class="dim">Linux, Windows, and Mac. Each button saves one zip. Unzip it and run the app. Sign-in still uses your Bluesky account.</p>${downloadsHtml(false)}</div>`;
  const requested = parseHash()[1] || '';
  if (!DOWNLOADS.some(([name]) => name === requested)) return;
  const button = [...document.querySelectorAll('[data-act="desktop-download"]')].find((node) => node.dataset.file === requested);
  saveDesktopZip(requested, button);
}

function packList(packs) {
  return (packs || []).map((pack) => packHtml(pack)).join('');
}

async function showPacks() {
  const token = ++generation;
  setChrome({ title: 'Starter packs', nav: 'packs', back: true });
  $('view').innerHTML = `<form class="search-page" id="pack-form"><label class="search"><input id="pack-q" placeholder="Search starter packs" autocomplete="off"></label></form><div id="pack-results">${skeletons(4)}</div>`;
  try {
    const jobs = [api.getSuggestedStarterPacks()];
    if (signedIn()) jobs.push(api.getActorStarterPacks(myDid()).catch(() => ({ starterPacks: [] })));
    const [suggested, mine] = await Promise.all(jobs);
    if (token !== generation) return;
    const yours = packList(mine?.starterPacks);
    const rows = packList(suggested?.starterPacks);
    $('pack-results').innerHTML = `${yours ? `<h2 class="section-label">Yours</h2><div class="packs">${yours}</div>` : ''}${rows ? `<h2 class="section-label">Suggested</h2><div class="packs">${rows}</div>` : ''}` || emptyHtml('No starter packs', 'Search for a topic to find one.');
  } catch (error) {
    if (!cancelled(token, error)) $('pack-results').innerHTML = emptyHtml('Starter packs are unavailable', error.message);
  }
}

async function showPack(uri) {
  const token = ++generation;
  setChrome({ title: 'Starter pack', nav: 'packs', back: true });
  showSkeletons();
  try {
    const data = await api.getStarterPack(uri);
    if (token !== generation) return;
    const pack = data.starterPack;
    if (!pack?.uri) {
      $('view').innerHTML = emptyHtml('Starter pack unavailable', 'This starter pack could not be loaded.');
      return;
    }
    const record = pack.record || {};
    const creator = pack.creator || {};
    const people = (pack.listItemsSample || []).map((item) => actorHtml(item.subject, { follow: signedIn(), self: myDid() })).join('');
    const listUri = pack.list?.uri || record.list || '';
    const follow = signedIn() && listUri
      ? `<button type="button" class="primary small" data-act="pack-follow" data-list="${escapeHtml(listUri)}">Follow these accounts</button>`
      : '';
    const listLink = listUri ? `<a class="text-link" href="#/list/${encodeURIComponent(listUri)}">Open the list</a>` : '';
    const feeds = (pack.feeds || []).map((feed) => {
      const feedUri = feed.uri || feed;
      const label = feed.displayName || feed.cid || 'Feed';
      return `<a class="text-link" href="#/feed/${encodeURIComponent(feedUri)}">${escapeHtml(label)}</a>`;
    }).join('');
    $('title').textContent = record.name || 'Starter pack';
    $('view').innerHTML = `<header class="list-head"><h2>${escapeHtml(record.name || 'Starter pack')}</h2><p class="dim">${escapeHtml(creator.handle ? `by @${creator.handle}` : '')}${pack.list?.listItemCount != null ? ` · ${pack.list.listItemCount} people` : ''}</p>${record.description ? `<p class="bio">${richText(record.description, record.descriptionFacets)}</p>` : ''}</header><div class="toolbar">${follow}${listLink}${feeds}</div>${people ? `<div class="directory">${people}</div>` : ''}`;
  } catch (error) {
    if (!cancelled(token, error)) $('view').innerHTML = emptyHtml('Starter pack unavailable', error.message);
  }
}

async function followPack(listUri, button) {
  if (!signedIn()) return requireSignIn();
  if (!listUri) return;
  if (!window.confirm('Follow the accounts in this starter pack? This stops after 80 accounts.')) return;
  if (button) {
    button.disabled = true;
    button.textContent = 'Following…';
  }
  let followed = 0;
  let cursor;
  let limited = false;
  try {
    for (let page = 0; page < 20 && followed < 80 && !limited; page += 1) {
      const data = await api.getList(listUri, cursor, null, 50);
      const due = [];
      (data.items || []).forEach((item) => {
        const actor = item.subject;
        if (!actor?.did || actor.did === myDid() || actor.viewer?.following) return;
        if (followed + due.length < 80) due.push(actor.did);
      });
      for (let i = 0; i < due.length; i += 4) {
        const results = await Promise.all(due.slice(i, i + 4).map(async (did) => {
          try {
            await api.follow(did);
            return 'ok';
          } catch (error) {
            return error?.status === 429 ? 'limit' : 'skip';
          }
        }));
        results.forEach((result) => {
          if (result === 'ok') followed += 1;
          if (result === 'limit') limited = true;
        });
        if (limited) break;
      }
      if (!data.cursor) break;
      cursor = data.cursor;
    }
    toast(followed ? `Followed ${followed} ${followed === 1 ? 'account' : 'accounts'}` : 'You already follow these accounts.');
    route();
  } catch (error) {
    toast(error.message);
  } finally {
    if (button?.isConnected) {
      button.disabled = false;
      button.textContent = 'Follow these accounts';
    }
  }
}

async function showEngagement(kind, uri) {
  const token = ++generation;
  setChrome({ title: kind === 'likes' ? 'Likes' : 'Reposts', nav: 'home', back: true });
  showSkeletons();
  try {
    const load = (cursor) => (kind === 'likes' ? api.getLikes(uri, cursor) : api.getRepostedBy(uri, cursor));
    const actorsOf = (data) => (kind === 'likes' ? (data.likes || []).map((item) => item.actor) : (data.repostedBy || []));
    const data = await load();
    if (token !== generation) return;
    const paint = (list, append) => {
      const html = list.filter(Boolean).map((actor) => actorHtml(actor, { follow: signedIn(), self: myDid() })).join('');
      if (append) {
        if (html) $('view').insertAdjacentHTML('beforeend', html);
        return;
      }
      $('view').innerHTML = html || emptyHtml('Nobody yet', kind === 'likes' ? 'No likes yet.' : 'No reposts yet.');
    };
    paint(actorsOf(data), false);
    const more = async (cursor) => {
      const page = await load(cursor);
      if (token !== generation) return;
      paint(actorsOf(page), true);
      pagerFor(page.cursor, more);
    };
    pagerFor(data.cursor, more);
  } catch (error) {
    if (!cancelled(token, error)) $('view').innerHTML = emptyHtml('Could not load this list', error.message);
  }
}

function route() {
  closeMenu();
  hideSuggest();
  closeHover();
  stopSpeech();
  stopHomeWatch();
  stopChatTimer();
  pager?.disconnect();
  selected = -1;
  const [a, b, c, d] = parseHash();
  if (!a) return showHome('following');
  if (a === 'discover') return showHome('discover');
  if (a === 'search') return showSearch(b || '');
  if (a === 'notifications') return showNotifications(b || '');
  if ((a === 'likes' || a === 'reposts') && b) return showEngagement(a, b);
  if (a === 'messages') return showMessages(b || '');
  if (a === 'ai') return showAi();
  if (a === 'calls') return showCalls();
  if (a === 'bookmarks') return showBookmarks();
  if (a === 'feeds') return showFeeds();
  if (a === 'feed' && b) return showCustomFeed(b);
  if (a === 'lists') return showLists();
  if (a === 'list' && b) return showList(b);
  if (a === 'packs') return showPacks();
  if (a === 'pack' && b) return showPack(b);
  if (a === 'downloads') return showDownloads();
  if (a === 'settings') return showSettings();
  if (a === 'profile' && b && c === 'post' && d) return showThread(b, d);
  if (a === 'profile' && b && (c === 'followers' || c === 'following')) return showPeople(b, c);
  if (a === 'profile' && b) return showProfile(b, c || 'posts');
  return showHome('following');
}

function postFrom(node) {
  const article = node?.closest?.('.post');
  if (!article) return null;
  return { article, item: posts.get(article.dataset.uri), post: posts.get(article.dataset.uri)?.post || posts.get(article.dataset.uri) };
}

function openComposer({ reply = null, quote = null, text = '' } = {}) {
  if (!signedIn()) return requireSignIn();
  const dialog = $('compose');
  dialog.dataset.reply = reply ? JSON.stringify({ uri: reply.uri, cid: reply.cid, root: reply.record?.reply?.root || { uri: reply.uri, cid: reply.cid } }) : '';
  dialog.dataset.quote = quote ? JSON.stringify({ uri: quote.uri, cid: quote.cid }) : '';
  const context = $('compose-context');
  if (reply) context.innerHTML = `<p class="dim">Replying to <strong>@${escapeHtml(reply.author?.handle || '')}</strong></p><p>${escapeHtml((reply.record?.text || '').slice(0, 160))}</p>`;
  else if (quote) context.innerHTML = `<p class="dim">Quoting <strong>@${escapeHtml(quote.author?.handle || '')}</strong></p><p>${escapeHtml((quote.record?.text || '').slice(0, 160))}</p>`;
  else context.innerHTML = '';
  const area = $('compose-text');
  area.value = text || (!reply && !quote ? loadDraft() : '');
  const replies = $('reply-control');
  if (replies) replies.hidden = Boolean(reply);
  if (!reply && $('compose-replies')) $('compose-replies').value = 'everyone';
  if (dialog._video?.url) URL.revokeObjectURL(dialog._video.url);
  dialog._files = [];
  dialog._card = null;
  dialog._gif = null;
  dialog._video = null;
  dialog._attach = null;
  dialog._langs = languagePrefs().posts.slice();
  dialog._dismissedUrl = '';
  closePicker();
  $('compose-previews').innerHTML = '';
  paintAttach();
  const videoBox = $('compose-video');
  if (videoBox) {
    videoBox.hidden = true;
    videoBox.innerHTML = '';
  }
  const linkBox = $('compose-link');
  if (linkBox) {
    linkBox.hidden = true;
    linkBox.innerHTML = '';
  }
  paintComposeAvatar();
  paintLangChip();
  applyFieldLanguage(area);
  updateCount();
  scheduleLinkPreview();
  if (!dialog.open) dialog.showModal();
  area.focus();
}

function paintComposeAvatar() {
  const node = $('compose-avatar');
  const profile = me.profile || {};
  if (!node) return;
  const name = profile.displayName || profile.handle || 'You';
  node.dataset.initial = (String(name).trim().charAt(0) || 'L').toUpperCase();
  const src = profile.avatar || '';
  node.innerHTML = src ? `<img src="${escapeHtml(src)}" alt="" onerror="this.remove()">` : '';
}

function paintLangChip() {
  const button = $('compose-lang');
  if (!button) return;
  const codes = ($('compose')?._langs || languagePrefs().posts).slice(0, 3);
  const label = codes.map((code) => code.toUpperCase()).join(' · ') || 'EN';
  button.textContent = label;
  button.setAttribute('aria-label', `Post languages ${label}`);
}

function applyFieldLanguage(area) {
  if (!area) return;
  const code = ($('compose')?.open && area.id === 'compose-text' ? $('compose')._langs : languagePrefs().posts)[0] || 'en';
  area.lang = code;
  area.spellcheck = true;
}

let linkEpoch = 0;
let linkTimer = 0;

function updateCount() {
  const area = $('compose-text');
  const value = area?.value || '';
  const left = 300 - graphemeLength(value);
  const files = $('compose')._files || [];
  const card = $('compose')._card;
  const gif = $('compose')._gif;
  const video = $('compose')._video;
  const attached = Boolean($('compose')?._attach?.uri);
  const count = $('compose-count');
  const used = Math.min(300, Math.max(0, 300 - left));
  if (count) {
    count.style.setProperty('--p', String((used / 300) * 100));
    const figure = count.querySelector('b');
    if (figure) figure.textContent = String(left);
    else count.textContent = String(left);
  }
  count?.classList.toggle('over', left < 0);
  $('compose-send').disabled = left < 0 || (left === 300 && !files.length && !card && !gif && !video && !attached);
  paintFieldHighlight(area, $('compose-highlight'));
  scheduleSuggest(area);
}

function paintFieldHighlight(area, pre) {
  if (!area || !pre) return;
  const value = area.value || '';
  const start = area.selectionStart ?? 0;
  const end = area.selectionEnd ?? 0;
  const opts = { links: false, breaks: false };
  const body = document.activeElement === area && end > start
    ? `${richText(value.slice(0, start), null, opts)}<mark class="field-selection">${richText(value.slice(start, end), null, opts)}</mark>${richText(value.slice(end), null, opts)}`
    : richText(value, null, opts);
  pre.innerHTML = `${body}\n`;
  pre.scrollTop = area.scrollTop;
}

function hideFloat(node) {
  if (!node) return;
  if (typeof node.hidePopover === 'function' && node.matches(':popover-open')) {
    try { node.hidePopover(); } catch { /* already closed */ }
  }
  node.hidden = true;
}

function showFloat(node) {
  if (!node) return;
  node.hidden = false;
  if (typeof node.showPopover === 'function') {
    try {
      if (!node.matches(':popover-open')) node.showPopover();
    } catch { /* the layer stays in the page */ }
  }
}

function mountFloat(node, area) {
  const host = area?.closest?.('dialog[open]') || document.body;
  const plain = node.id === 'suggest' || node.id === 'type-ghost';
  if (node.parentElement !== host || (plain && node.hasAttribute('popover'))) {
    hideFloat(node);
    if (plain) node.removeAttribute('popover');
    host.append(node);
  }
  if (!plain && !node.hasAttribute('popover')) node.setAttribute('popover', 'manual');
  showFloat(node);
}

function hideSuggest() {
  const box = $('suggest');
  if (!box) return;
  box.innerHTML = '';
  suggestArea = null;
  hideFloat(box);
  hideGhost();
}

function hideGhost() {
  const ghost = $('type-ghost');
  if (!ghost) return;
  ghost.textContent = '';
  hideFloat(ghost);
}

function paintGhost(area) {
  const ghost = $('type-ghost');
  const box = $('suggest');
  if (!ghost || !area || !box || box.hidden) return hideGhost();
  const token = caretToken(area.value, area.selectionStart) || caretWord(area.value, area.selectionStart);
  const insert = box.querySelector('.suggest-row.on')?.dataset.insert || '';
  const query = token?.query || '';
  if (!token || !insert || !query || !insert.toLowerCase().startsWith(query.toLowerCase())) return hideGhost();
  const rest = insert.slice(query.length);
  if (!rest) return hideGhost();
  const style = getComputedStyle(area);
  ghost.textContent = rest;
  ['fontFamily', 'fontSize', 'fontWeight', 'fontStyle', 'lineHeight', 'letterSpacing'].forEach((key) => {
    ghost.style[key] = style[key];
  });
  let point;
  try { point = caretPoint(area); } catch { return hideGhost(); }
  ghost.style.left = `${point.x}px`;
  ghost.style.top = `${point.top}px`;
  mountFloat(ghost, area);
}

function caretPoint(area) {
  const mirror = document.createElement('div');
  const style = getComputedStyle(area);
  const rect = area.getBoundingClientRect();
  mirror.style.position = 'fixed';
  mirror.style.visibility = 'hidden';
  mirror.style.whiteSpace = 'pre-wrap';
  mirror.style.overflowWrap = 'anywhere';
  mirror.style.wordBreak = 'break-word';
  mirror.style.top = `${rect.top - area.scrollTop}px`;
  mirror.style.left = `${rect.left}px`;
  mirror.style.width = `${area.offsetWidth}px`;
  ['fontFamily', 'fontSize', 'fontWeight', 'fontStyle', 'lineHeight', 'letterSpacing', 'textTransform', 'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft', 'borderTopWidth', 'borderRightWidth', 'borderBottomWidth', 'borderLeftWidth', 'borderTopStyle', 'borderRightStyle', 'borderBottomStyle', 'borderLeftStyle', 'boxSizing'].forEach((key) => {
    mirror.style[key] = style[key];
  });
  const mark = document.createElement('span');
  mark.textContent = '\u200b';
  mirror.textContent = area.value.slice(0, area.selectionStart || 0);
  mirror.append(mark);
  document.body.append(mirror);
  try {
    const markRect = mark.getBoundingClientRect();
    return { x: markRect.left, y: markRect.bottom, top: markRect.top };
  } finally {
    mirror.remove();
  }
}

function showSuggest(box, area) {
  let point;
  try {
    point = caretPoint(area);
  } catch {
    const rect = area.getBoundingClientRect();
    point = { x: rect.left, y: rect.bottom, top: rect.top };
  }
  const width = Math.min(320, window.innerWidth - 16);
  const left = Math.max(8, Math.min(point.x, window.innerWidth - width - 8));
  box.style.width = `${width}px`;
  box.style.left = `${left}px`;
  box.style.right = 'auto';
  box.style.bottom = 'auto';
  box.style.transform = 'none';
  mountFloat(box, area);
  const height = box.offsetHeight || 200;
  const spaceBelow = window.innerHeight - point.y;
  const spaceAbove = point.top;
  let top;
  if (spaceBelow < 220 && spaceAbove > spaceBelow) top = point.top - height - 6;
  else top = point.y + 6;
  top = Math.max(8, Math.min(top, window.innerHeight - height - 8));
  box.style.top = `${top}px`;
}

function scheduleSuggest(area) {
  if (!area) return;
  clearTimeout(suggestTimer);
  suggestTimer = setTimeout(() => refreshSuggest(area), 180);
}

function aiSuggestRows(query) {
  const q = String(query || '').toLowerCase();
  const rows = [];
  if ('ai'.startsWith(q)) rows.push(suggestRow(rows.length, '@ai', `AI<span class="handle">@ai · your account</span>`));
  if ('si'.startsWith(q)) rows.push(suggestRow(rows.length, '@si', `AI<span class="handle">@si · your account</span>`));
  return rows;
}

function paintSuggest(area, rows) {
  const box = $('suggest');
  if (!box || !rows.length) return hideSuggest();
  box.innerHTML = `<p class="suggest-hint">Click a row, or press Tab</p>${rows.join('')}`;
  box.querySelectorAll('button').forEach((button, index) => button.classList.toggle('on', index === 0));
  suggestArea = area;
  showSuggest(box, area);
  paintGhost(area);
}

function wordSuggestRows(area) {
  const word = caretWord(area.value, area.selectionStart);
  if (!word) return [];
  const langs = area.id === 'compose-text' && $('compose')?._langs?.length ? $('compose')._langs : languagePrefs().posts;
  return completeWord(word.query, langs).map((item, index) => suggestRow(index, item, escapeHtml(item)));
}

async function refreshSuggest(area) {
  if (!area?.isConnected) return hideSuggest();
  const token = caretToken(area.value, area.selectionStart);
  if (!token) return paintSuggest(area, wordSuggestRows(area));
  const leads = token.sigil === '@' ? aiSuggestRows(token.query) : [];
  if (token.query.length < 1) return paintSuggest(area, leads);
  const seq = ++suggestSeq;
  const signal = AbortSignal.timeout ? AbortSignal.timeout(8000) : undefined;
  try {
    const items = token.sigil === '@'
      ? (await api.searchActorsTypeahead(token.query, signal)).actors || []
      : await api.suggestTags(token.query, signal);
    if (seq !== suggestSeq) return;
    if (document.activeElement !== area) return hideSuggest();
    const rows = token.sigil === '@'
      ? items.slice(0, 6).map((actor, index) => suggestRow(index, `@${actor.handle}`, `${escapeHtml(actor.displayName || actor.handle)}<span class="handle">@${escapeHtml(actor.handle || '')}</span>`))
      : items.slice(0, 6).map((tag, index) => suggestRow(index, `#${tag}`, `#${escapeHtml(tag)}`));
    paintSuggest(area, [...leads, ...rows].slice(0, 8));
  } catch {
    if (seq !== suggestSeq) return;
    if (leads.length && document.activeElement === area) paintSuggest(area, leads);
    else hideSuggest();
  }
}

function suggestRow(index, insert, body) {
  return `<button type="button" class="suggest-row${index === 0 ? ' on' : ''}" data-insert="${escapeHtml(insert)}">${body}</button>`;
}

function applySuggest(insert) {
  const area = suggestArea;
  if (!area || !insert) return;
  const token = caretToken(area.value, area.selectionStart) || caretWord(area.value, area.selectionStart);
  if (!token) return hideSuggest();
  const after = area.value.slice(area.selectionStart);
  const gap = after.startsWith(' ') || after.startsWith('\n') ? '' : ' ';
  area.value = `${area.value.slice(0, token.start)}${insert}${gap}${after}`;
  const caret = token.start + insert.length + gap.length;
  area.setSelectionRange(caret, caret);
  hideSuggest();
  area.dispatchEvent(new Event('input', { bubbles: true }));
  area.focus();
}

function onSuggestKey(event) {
  const box = $('suggest');
  if (!box || box.hidden) return false;
  const items = [...box.querySelectorAll('button')];
  if (!items.length) return false;
  const current = items.findIndex((button) => button.classList.contains('on'));
  const token = caretToken(event.target.value, event.target.selectionStart);
  if (!token && (event.key === 'ArrowDown' || event.key === 'ArrowUp' || event.key === 'ArrowLeft' || event.key === 'ArrowRight')) return false;
  if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
    event.preventDefault();
    event.stopPropagation();
    const next = event.key === 'ArrowDown' ? Math.min(items.length - 1, current + 1) : Math.max(0, current - 1);
    items.forEach((button, index) => button.classList.toggle('on', index === (next < 0 ? 0 : next)));
    paintGhost(suggestArea);
    return true;
  }
  if (event.key === 'Tab' || (event.key === 'Enter' && !event.shiftKey && token)) {
    event.preventDefault();
    event.stopPropagation();
    applySuggest((items[Math.max(current, 0)] || items[0]).dataset.insert || '');
    return true;
  }
  if (event.key === 'Escape') {
    event.preventDefault();
    event.stopPropagation();
    hideSuggest();
    return true;
  }
  return false;
}

function scheduleLinkPreview() {
  clearTimeout(linkTimer);
  linkTimer = setTimeout(refreshLinkPreview, 400);
}

function paintLinkPreview() {
  const dialog = $('compose');
  const box = $('compose-link');
  const card = dialog?._card;
  const images = (dialog?._files || []).length > 0;
  if (!box) return;
  if (dialog?._video) {
    box.hidden = true;
    return;
  }
  if (!card || (images && card.kind !== 'quote')) {
    box.hidden = true;
    return;
  }
  box.hidden = false;
  box.innerHTML = `<div class="link-preview">${linkPreviewHtml(card)}<button type="button" class="card-dismiss" data-act="dismiss-link" aria-label="Remove preview">×</button></div>`;
}

async function refreshLinkPreview() {
  const dialog = $('compose');
  const box = $('compose-link');
  if (!dialog?.open || !box) return;
  if (dialog._gif || dialog._video) return;
  const url = firstUrl($('compose-text').value);
  if (!url || dialog.dataset.quote || dialog._attach || dialog._dismissedUrl === url) {
    dialog._card = null;
    box.hidden = true;
    box.innerHTML = '';
    updateCount();
    return;
  }
  if (dialog._card?.sourceUrl === url) {
    paintLinkPreview();
    return;
  }
  const token = ++linkEpoch;
  box.hidden = false;
  box.innerHTML = `<div class="card"><span class="card-body"><span class="domain">${escapeHtml(hostOf(url))}</span><strong>Loading preview…</strong></span></div>`;
  let card = null;
  try { card = await api.inspectLink(url); } catch { card = null; }
  if (token !== linkEpoch || !dialog.open) return;
  if (!card) {
    dialog._card = null;
    box.hidden = true;
    box.innerHTML = '';
    updateCount();
    return;
  }
  card.sourceUrl = url;
  dialog._card = card;
  paintLinkPreview();
  updateCount();
}

function dropUrl(text, url) {
  if (!url) return text;
  return text.replace(url, ' ').replace(/[ \t]{2,}/g, ' ').replace(/\n{3,}/g, '\n\n').trim();
}

function imageCandidates(imageUrl) {
  const value = String(imageUrl || '');
  const list = [];
  const push = (url) => {
    if (url && !list.includes(url)) list.push(url);
  };
  push(value);
  try {
    const parsed = new URL(value);
    if (parsed.hostname === 'cardyb.bsky.app' && parsed.pathname === '/v1/image') push(parsed.searchParams.get('url') || '');
  } catch {
    /* keep the address we already have */
  }
  const original = list.find((url) => !url.startsWith('https://cardyb.bsky.app/'));
  if (original) push(`https://cardyb.bsky.app/v1/image?url=${encodeURIComponent(original)}`);
  return list;
}

async function thumbFile(imageUrl) {
  const load = async (target) => {
    const res = await fetch(target);
    if (!res.ok) return null;
    const blob = await res.blob();
    const type = blob.type || '';
    if (!blob.size || blob.size > 8000000 || !type.startsWith('image/') || type === 'image/svg+xml') return null;
    const file = new File([blob], 'thumb', { type });
    if ((type === 'image/jpeg' || type === 'image/png') && file.size < 1000000) return file;
    return compress(file);
  };
  for (const target of imageCandidates(imageUrl)) {
    try {
      const file = await load(target);
      if (file) return file;
    } catch {
      /* the next address may still be a readable image */
    }
  }
  return null;
}

async function compress(file) {
  if (file.type === 'image/gif') {
    if (file.size > 1000000) throw new Error('GIFs need to be under 1 MB.');
    return file;
  }
  if (file.size < 900000 && !file.type.startsWith('image/')) return file;
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, 2000 / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(bitmap.width * scale));
  canvas.height = Math.max(1, Math.round(bitmap.height * scale));
  canvas.getContext('2d').drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.9));
  if (!blob || blob.size > 1000000) throw new Error('That image is still over 1 MB after resizing.');
  return new File([blob], 'image.jpg', { type: 'image/jpeg' });
}

function renderPreviews() {
  const files = $('compose')._files || [];
  $('compose-previews').innerHTML = files.map((file, index) => `<label class="preview"><img src="${file.url}" alt=""><input data-alt="${index}" value="${escapeHtml(file.alt)}" placeholder="Alt text"></label>`).join('');
  updateCount();
}

async function addFiles(list) {
  if ($('compose')._gif) {
    toast('Remove the GIF before adding images.');
    return;
  }
  if ($('compose')._video) {
    toast('Remove the video before adding images.');
    return;
  }
  const bucket = $('compose')._files || [];
  for (const file of list) {
    if (bucket.length >= 4) break;
    try {
      const image = await compress(file);
      bucket.push({ file: image, alt: '', url: URL.createObjectURL(image) });
    } catch (error) {
      toast(error.message);
    }
  }
  $('compose')._files = bucket;
  renderPreviews();
  paintLinkPreview();
}

async function publish(event) {
  event.preventDefault();
  const dialog = $('compose');
  let text = $('compose-text').value.trim();
  const files = dialog._files || [];
  const gif = dialog._gif;
  const draftVideo = dialog._video;
  if (graphemeLength(text) > 300) return;
  if ((gif && files.length) || (gif && draftVideo) || (files.length && draftVideo)) {
    toast('Use images, a video, or a GIF, not more than one.');
    return;
  }
  if (gif && (dialog.dataset.quote || dialog._attach)) {
    toast('Remove the quote or attachment before adding a GIF.');
    return;
  }
  $('compose-send').disabled = true;
  $('compose-send').textContent = 'Posting…';
  try {
    const images = [];
    for (const item of files) {
      images.push({ alt: item.alt, blob: await api.uploadBlob(item.file) });
    }
    let video = null;
    if (draftVideo?.file) {
      const blob = await api.uploadVideo(draftVideo.file, {
        onProgress: (label) => {
          if ($('compose-send')) $('compose-send').textContent = label;
        },
      });
      video = { blob, alt: draftVideo.alt || '', aspectRatio: draftVideo.aspectRatio };
      if ($('compose-send')) $('compose-send').textContent = 'Posting…';
    }
    let reply = null;
    if (dialog.dataset.reply) {
      const raw = JSON.parse(dialog.dataset.reply);
      reply = { root: raw.root, parent: { uri: raw.uri, cid: raw.cid } };
    }
    let quote = dialog.dataset.quote ? JSON.parse(dialog.dataset.quote) : null;
    if (dialog._attach?.uri && dialog._attach?.cid) {
      quote = { uri: dialog._attach.uri, cid: dialog._attach.cid };
    }
    let link = null;
    const url = firstUrl(text);
    let card = dialog._card;
    if (gif && !images.length && !quote) {
      let thumb = null;
      try {
        const file = await thumbFile(gif.thumb || gif.url);
        if (file) thumb = await api.uploadBlob(file);
      } catch {
        thumb = null;
      }
      link = api.externalEmbed({ url: gif.url, title: gif.title || 'GIF', description: '', thumb });
    } else if (url && !video && dialog._dismissedUrl !== url && !quote) {
      if (!card || card.sourceUrl !== url) {
        try { card = await api.inspectLink(url); } catch { card = null; }
      }
      if (card?.kind === 'quote' && card.post?.uri) {
        quote = { uri: card.post.uri, cid: card.post.cid };
        text = dropUrl(text, card.sourceUrl || url);
      } else if (card?.kind === 'external' && !images.length) {
        let thumb = null;
        if (card.image) {
          try {
            const file = await thumbFile(card.image);
            if (file) thumb = await api.uploadBlob(file);
          } catch {
            thumb = null;
          }
        }
        link = api.externalEmbed({ ...card, url: card.url || url, thumb });
      }
    }
    if (!text && !images.length && !video && !quote && !link) return;
    rememberWords(text);
    const created = await api.createPost({ text, images, video, reply, quote, link, langs: dialog._langs || languagePrefs().posts });
    let gateWarning = '';
    const gate = $('compose-replies')?.value || 'everyone';
    if (!reply && gate !== 'everyone' && created?.uri) {
      const allow = gate === 'none'
        ? []
        : gate === 'following'
          ? [{ $type: 'app.bsky.feed.threadgate#followingRule' }]
          : [{ $type: 'app.bsky.feed.threadgate#mentionRule' }];
      try {
        await api.createThreadgate(created.uri, allow);
      } catch {
        gateWarning = ' Reply limits were not saved.';
      }
    }
    if (!reply && !quote) saveDraft('');
    dialog.close();
    toast(`Posted.${gateWarning}`);
    route();
  } catch (error) {
    toast(error.message);
  } finally {
    $('compose-send').textContent = 'Post';
    updateCount();
  }
}

function closeMenu() {
  $('menu').hidden = true;
}

function openMenu(anchor, items) {
  const menu = $('menu');
  hideTip();
  menu._post = null;
  menu.innerHTML = items.map((item) => `<button type="button" class="${item.danger ? 'is-danger' : ''}" data-menu="${escapeHtml(item.id)}" ${item.disabled ? 'disabled' : ''}>${escapeHtml(item.label)}</button>`).join('');
  menu.hidden = false;
  const rect = anchor.getBoundingClientRect();
  const width = menu.offsetWidth || 250;
  const height = menu.offsetHeight || 0;
  let left = rect.left;
  if (left + width > window.innerWidth - 8) left = rect.right - width;
  left = Math.max(8, Math.min(left, window.innerWidth - width - 8));
  let top = rect.bottom + 6;
  if (top + height > window.innerHeight - 8) top = rect.top - height - 6;
  top = Math.max(8, Math.min(top, window.innerHeight - height - 8));
  menu.style.left = `${left}px`;
  menu.style.top = `${top}px`;
  menu.style.bottom = 'auto';
}

const MORE_LINKS = [
  { id: 'go-lists', label: 'Lists' },
  { id: 'go-feeds', label: 'Feeds' },
  { id: 'go-packs', label: 'Starter packs' },
  { id: 'go-downloads', label: 'Download apps' },
  { id: 'go-settings', label: 'Settings' },
  { id: 'go-about', label: 'About' },
  { id: 'go-privacy', label: 'Privacy' },
  { id: 'go-terms', label: 'Terms' },
];

function openMoreMenu(anchor) {
  const sidebarOpen = window.matchMedia('(min-width: 721px)').matches;
  const overflow = sidebarOpen ? [] : [
    { id: 'go-bookmarks', label: 'Bookmarks' },
    { id: 'go-calls', label: 'Calls' },
    { id: 'go-ai', label: 'AI' },
  ];
  openMenu(anchor, [...overflow, ...MORE_LINKS]);
}

function accountMenuItems() {
  const current = myDid();
  const rows = listAccounts().map((entry) => ({
    id: `switch-account:${entry.did}`,
    label: `${entry.did === current ? '✓ ' : ''}${entry.displayName || entry.handle || entry.did}`,
  }));
  return [
    ...rows,
    { id: 'add-account', label: 'Add account' },
    { id: 'settings-go', label: 'Settings' },
    { id: 'signout-go', label: 'Sign out', danger: true },
  ];
}

function recentEmoji() {
  try {
    const list = JSON.parse(localStorage.getItem('libresky.emoji') || '[]');
    return Array.isArray(list) ? list.filter((item) => typeof item === 'string').slice(0, 24) : [];
  } catch {
    return [];
  }
}

function rememberEmoji(char) {
  const next = [char, ...recentEmoji().filter((item) => item !== char)].slice(0, 24);
  localStorage.setItem('libresky.emoji', JSON.stringify(next));
  syncClientPrefs();
}

function closePicker() {
  pickerMode = '';
  const box = $('compose-picker');
  if (!box) return;
  box.hidden = true;
  box.innerHTML = '';
}

const attachBag = new Map();
let attachKind = 'feed';
let attachMode = 'post';
let attachSeq = 0;
let attachTimer = 0;
let attachBusy = false;

function paintAttach() {
  const box = $('compose-attach');
  const view = $('compose')?._attach?.view;
  if (!box) return;
  if (!view) {
    box.hidden = true;
    box.innerHTML = '';
    return;
  }
  box.hidden = false;
  box.innerHTML = collectionCardHtml(view, { remove: true });
}

function attachTargetFromText(value) {
  const text = String(value || '').trim();
  if (!text) return null;
  if (text.startsWith('at://')) {
    const uri = text.split(/[\s?#]/)[0];
    if (uri.includes('/app.bsky.feed.generator/')) return { kind: 'feed', uri };
    if (uri.includes('/app.bsky.graph.starterpack/')) return { kind: 'pack', uri };
    if (uri.includes('/app.bsky.graph.list/')) return { kind: 'list', uri };
    return null;
  }
  try {
    const url = new URL(text);
    const host = url.hostname.replace(/^www\./, '');
    if (host !== 'bsky.app' && !host.endsWith('.bsky.app')) return null;
    const parts = url.pathname.split('/').filter(Boolean).map((part) => {
      try { return decodeURIComponent(part); } catch { return part; }
    });
    if (parts[0] === 'profile' && parts[2] === 'feed' && parts[3]) return { kind: 'feed', actor: parts[1], rkey: parts[3] };
    if (parts[0] === 'profile' && parts[2] === 'lists' && parts[3]) return { kind: 'list', actor: parts[1], rkey: parts[3] };
    if (parts[0] === 'starter-pack' && parts[1] && parts[2]) return { kind: 'pack', actor: parts[1], rkey: parts[2] };
    if (parts[0] === 'profile' && parts[2] === 'starter-pack' && parts[3]) return { kind: 'pack', actor: parts[1], rkey: parts[3] };
  } catch {
    return null;
  }
  return null;
}

async function resolveAttachRef(target) {
  let uri = target.uri || '';
  if (!uri && target.actor && target.rkey) {
    const did = target.actor.startsWith('did:') ? target.actor : await api.resolveHandle(target.actor);
    const collection = target.kind === 'feed'
      ? 'app.bsky.feed.generator'
      : target.kind === 'list'
        ? 'app.bsky.graph.list'
        : 'app.bsky.graph.starterpack';
    uri = `at://${did}/${collection}/${target.rkey}`;
  }
  if (target.kind === 'feed') return (await api.getFeedGenerator(uri))?.view || null;
  if (target.kind === 'list') return (await api.getList(uri, null, null, 1))?.list || null;
  return (await api.getStarterPack(uri))?.starterPack || null;
}

async function loadListChoices(query) {
  const q = query.trim().replace(/^@/, '');
  if (q.includes('.') || q.startsWith('did:')) {
    const data = await api.getLists(q);
    return data.lists || [];
  }
  if (!signedIn()) return [];
  const data = await api.getLists(myDid());
  const lists = data.lists || [];
  const needle = q.toLowerCase();
  if (!needle) return lists;
  return lists.filter((list) => `${list.name || ''} ${list.description || ''}`.toLowerCase().includes(needle));
}

function paintAttachKinds() {
  document.querySelectorAll('[data-attach-kind]').forEach((button) => {
    button.setAttribute('aria-pressed', button.dataset.attachKind === attachKind ? 'true' : 'false');
  });
  const title = $('attach-title');
  const note = $('attach-note');
  if (title) title.textContent = attachMode === 'profile' ? 'Attach to your profile' : 'Attach to this post';
  if (note) {
    note.textContent = attachMode === 'profile'
      ? 'This is saved on your profile record. People who open your profile can see it.'
      : 'This is embedded in the post, so other Bluesky apps show it too.';
  }
}

function openAttachPicker(mode) {
  if (mode === 'post') {
    const dialog = $('compose');
    if (!dialog?.open) return openComposer();
    if (dialog.dataset.quote) {
      toast('Remove the quote before attaching a feed, list, or starter pack.');
      return;
    }
  } else if (!signedIn()) return requireSignIn();
  attachMode = mode;
  attachKind = 'feed';
  paintAttachKinds();
  const input = $('attach-q');
  if (input) input.value = '';
  const dialog = $('attach');
  if (!dialog) return;
  if (!dialog.open) dialog.showModal();
  input?.focus();
  refreshAttach('');
}

async function refreshAttach(query) {
  const seq = ++attachSeq;
  const box = $('attach-results');
  if (!box) return;
  box.innerHTML = '<p class="dim">Loading…</p>';
  const q = String(query || '').trim();
  try {
    const direct = attachTargetFromText(q);
    let items = [];
    if (direct) {
      const view = await resolveAttachRef(direct);
      if (view?.uri) items = [view];
    } else if (attachKind === 'feed') {
      const data = await api.searchFeedGenerators(q);
      items = data.feeds || [];
    } else if (attachKind === 'pack') {
      const data = q
        ? await api.searchStarterPacks(q)
        : await api.getSuggestedStarterPacks().catch(() => ({ starterPacks: [] }));
      items = data.starterPacks || [];
    } else items = await loadListChoices(q);
    if (seq !== attachSeq || !$('attach-results')) return;
    items.forEach((item) => { if (item?.uri) attachBag.set(item.uri, item); });
    const rows = items.map((item) => collectionCardHtml(item, { button: true })).filter(Boolean).join('');
    const hint = attachKind === 'list'
      ? 'Nothing matched. Search a handle, or paste a list link.'
      : 'Nothing matched. Try another search, or paste a Bluesky link.';
    $('attach-results').innerHTML = rows || `<p class="dim">${hint}</p>`;
  } catch (error) {
    if (seq === attachSeq && $('attach-results')) $('attach-results').innerHTML = `<p class="dim">${escapeHtml(error.message || 'Could not search.')}</p>`;
  }
}

async function pinFeatured(view) {
  if (attachBusy) return;
  attachBusy = true;
  try {
    const current = await api.readFeatured(myDid());
    if (current.some((item) => item.uri === view.uri)) {
      toast('That is already attached to your profile.');
      $('attach')?.close();
      return;
    }
    const next = [{ uri: view.uri, cid: view.cid }, ...current].slice(0, 8);
    await api.writeFeatured(next);
    $('attach')?.close();
    toast(current.length >= 8 ? 'Attached. The oldest pin was dropped.' : 'Attached to your profile.');
    if (parseHash()[0] === 'profile') loadProfileShelf({ did: myDid() }, generation);
  } catch (error) {
    toast(error.message || 'Could not attach that.');
  } finally {
    attachBusy = false;
  }
}

async function unpinFeatured(uri) {
  if (!uri || attachBusy) return;
  attachBusy = true;
  try {
    const current = await api.readFeatured(myDid());
    await api.writeFeatured(current.filter((item) => item.uri !== uri));
    toast('Unpinned.');
    loadProfileShelf({ did: myDid() }, generation);
  } catch (error) {
    toast(error.message || 'Could not unpin that.');
  } finally {
    attachBusy = false;
  }
}

function chooseAttach(uri) {
  const view = attachBag.get(uri);
  if (!view?.uri || !view?.cid) {
    toast('That record has no id yet. Try another.');
    return;
  }
  if (attachMode === 'profile') {
    pinFeatured(view);
    return;
  }
  const dialog = $('compose');
  if (!dialog) return;
  dialog._attach = { uri: view.uri, cid: view.cid, view };
  dialog._card = null;
  const linkBox = $('compose-link');
  if (linkBox) {
    linkBox.hidden = true;
    linkBox.innerHTML = '';
  }
  $('attach')?.close();
  paintAttach();
  updateCount();
}

function emojiButtons(list) {
  return `<div class="emoji-grid">${list.map(([char, name]) => `<button type="button" data-emoji="${escapeHtml(char)}" aria-label="${escapeHtml(name || char)}">${char}</button>`).join('')}</div>`;
}

function paintEmojiList(query) {
  const box = $('emoji-groups');
  if (!box) return;
  const groups = [];
  const recent = recentEmoji();
  const needle = String(query || '').trim().toLowerCase();
  if (recent.length && !needle) groups.push(['Recent', recent.map((char) => [char, char])]);
  emojiGroups(query).forEach(([name, list]) => groups.push([name, list]));
  box.innerHTML = groups.length
    ? groups.map(([name, list]) => `<p class="picker-label">${escapeHtml(name)}</p>${emojiButtons(list)}`).join('')
    : '<p class="picker-note">No emoji matched.</p>';
}

function openEmojiPicker(query = '') {
  pickerMode = 'emoji';
  const box = $('compose-picker');
  if (!box) return;
  box.hidden = false;
  box.innerHTML = `<div class="picker"><input id="emoji-find" placeholder="Search emoji" autocomplete="off" value="${escapeHtml(query)}"><div id="emoji-groups"></div></div>`;
  paintEmojiList(query);
  if (query) $('emoji-find')?.focus();
}

function insertEmoji(char) {
  const area = $('compose-text');
  if (!area || !char) return;
  const start = area.selectionStart ?? area.value.length;
  const end = area.selectionEnd ?? start;
  area.value = `${area.value.slice(0, start)}${char}${area.value.slice(end)}`;
  const caret = start + char.length;
  area.setSelectionRange(caret, caret);
  rememberEmoji(char);
  area.dispatchEvent(new Event('input', { bubbles: true }));
  const query = $('emoji-find')?.value || '';
  if ($('emoji-groups')) paintEmojiList(query);
  area.focus();
}

function gifMedia(item, names) {
  const media = item?.media_formats || {};
  for (const name of names) {
    if (media[name]?.url) return media[name].url;
  }
  return '';
}

function openGifPicker() {
  pickerMode = 'gif';
  const box = $('compose-picker');
  if (!box) return;
  box.hidden = false;
  box.innerHTML = `<div class="picker"><input id="gif-q" placeholder="Search KLIPY" autocomplete="off"><p class="picker-note">GIFs by KLIPY</p><div id="gif-grid" class="gif-grid"></div></div>`;
  const input = $('gif-q');
  input?.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') event.preventDefault();
  });
  input?.addEventListener('input', () => {
    clearTimeout(gifTimer);
    gifTimer = setTimeout(() => refreshGifs(input.value), 280);
  });
  input?.focus();
  refreshGifs('');
}

async function refreshGifs(query) {
  const seq = ++gifSeq;
  const grid = $('gif-grid');
  if (!grid) return;
  grid.innerHTML = '<p class="picker-note">Loading GIFs…</p>';
  const q = String(query || '').trim();
  const url = q
    ? `https://gifs.bsky.app/klipy/v2/search?q=${encodeURIComponent(q)}&limit=24&contentfilter=medium`
    : 'https://gifs.bsky.app/klipy/v2/featured?limit=24';
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error('GIFs are unavailable right now.');
    const data = await res.json();
    if (seq !== gifSeq || pickerMode !== 'gif' || !$('gif-grid')) return;
    const items = data.results || [];
    const cards = items.map((item) => {
      const thumb = gifMedia(item, ['tinygif', 'gif', 'mediumgif']);
      const full = gifMedia(item, ['gif', 'mediumgif', 'tinygif']);
      if (!thumb || !full) return '';
      return `<button type="button" data-gif="${escapeHtml(full)}" data-gif-title="${escapeHtml(item.title || 'GIF')}" data-gif-thumb="${escapeHtml(thumb)}"><img src="${escapeHtml(thumb)}" alt="${escapeHtml(item.title || 'GIF')}"></button>`;
    }).join('');
    $('gif-grid').innerHTML = cards || '<p class="picker-note">No GIFs found.</p>';
  } catch (error) {
    if (seq === gifSeq && $('gif-grid')) $('gif-grid').innerHTML = `<p class="picker-note">${escapeHtml(error.message || 'GIFs are unavailable right now.')}</p>`;
  }
}

function renderVideo() {
  const box = $('compose-video');
  const video = $('compose')._video;
  if (!box) return;
  if (!video) {
    box.hidden = true;
    box.innerHTML = '';
    updateCount();
    return;
  }
  box.hidden = false;
  box.innerHTML = `<div class="video-draft"><video src="${escapeHtml(video.url)}" controls muted playsinline></video><input id="video-alt" value="${escapeHtml(video.alt || '')}" placeholder="Alt text" maxlength="1000"><button type="button" class="card-dismiss" data-act="dismiss-video" aria-label="Remove video">×</button></div>`;
  updateCount();
}

function videoMeta(url) {
  return new Promise((resolve) => {
    const video = document.createElement('video');
    const finish = (meta) => {
      video.removeAttribute('src');
      video.load();
      resolve(meta);
    };
    video.preload = 'metadata';
    video.onloadedmetadata = () => {
      const width = video.videoWidth || 0;
      const height = video.videoHeight || 0;
      finish({
        duration: Number.isFinite(video.duration) ? video.duration : 0,
        aspectRatio: width && height ? { width, height } : null,
      });
    };
    video.onerror = () => finish({ duration: 0, aspectRatio: null });
    video.src = url;
  });
}

async function addVideo(file) {
  const dialog = $('compose');
  if (!file || !dialog) return;
  if ((dialog._files || []).length || dialog._gif) {
    toast('Remove the images or GIF before adding a video.');
    return;
  }
  const allowed = /^video\/(mp4|webm|quicktime)$/.test(file.type) || /\.(mp4|webm|mov)$/i.test(file.name || '');
  if (!allowed) {
    toast('Use an MP4, WebM, or MOV video.');
    return;
  }
  if (file.size > 50 * 1024 * 1024) {
    toast('Videos need to be under 50 MB.');
    return;
  }
  const url = URL.createObjectURL(file);
  const meta = await videoMeta(url);
  if (meta.duration > 180) {
    URL.revokeObjectURL(url);
    toast('Videos need to be under 3 minutes.');
    return;
  }
  if (dialog._video?.url) URL.revokeObjectURL(dialog._video.url);
  dialog._video = { file, url, alt: '', aspectRatio: meta.aspectRatio };
  dialog._card = null;
  closePicker();
  renderVideo();
  paintLinkPreview();
}

function openLinkPicker() {
  pickerMode = 'link';
  const box = $('compose-picker');
  if (!box) return;
  box.hidden = false;
  box.innerHTML = `<div class="picker"><p class="picker-label">Add a link</p><div class="link-add"><input id="link-url" placeholder="https://" inputmode="url" autocomplete="off" spellcheck="false"><button type="button" class="primary small" data-act="add-link">Add</button></div><p class="picker-note">The link stays in the post and shows a preview.</p></div>`;
  $('link-url')?.focus();
}

function addComposerLink() {
  let url = $('link-url')?.value.trim() || '';
  if (!url) return;
  if (!/^https?:\/\//i.test(url)) url = `https://${url}`;
  try { new URL(url); } catch {
    toast('Enter a full link.');
    return;
  }
  const area = $('compose-text');
  if (!area) return;
  const start = area.selectionStart ?? area.value.length;
  const before = area.value.slice(0, start);
  const after = area.value.slice(start);
  const lead = before && !/\s$/.test(before) ? ' ' : '';
  const tail = after && !/^\s/.test(after) ? ' ' : '';
  area.value = `${before}${lead}${url}${tail}${after}`;
  const caret = before.length + lead.length + url.length + tail.length;
  area.setSelectionRange(caret, caret);
  closePicker();
  area.dispatchEvent(new Event('input', { bubbles: true }));
  scheduleLinkPreview();
  area.focus();
}

function openPostLangPicker() {
  pickerMode = 'post-lang';
  const box = $('compose-picker');
  if (!box) return;
  const selected = $('compose')._langs || languagePrefs().posts;
  box.hidden = false;
  box.innerHTML = `<div class="picker"><p class="picker-label">Post languages</p><input id="post-lang-find" class="lang-find" placeholder="Find a language" autocomplete="off"><p class="picker-note">Up to three. Tab completes words in these languages.</p><div class="lang-grid">${languageButtons('posts', selected)}</div></div>`;
  box.querySelector('#post-lang-find')?.focus();
}

function toggleLanguage(kind, code) {
  if (kind !== 'content' && kind !== 'posts') return;
  const prefs = languagePrefs();
  const list = prefs[kind].slice();
  const index = list.indexOf(code);
  if (index >= 0) {
    if (kind === 'posts' && list.length <= 1) {
      toast('Keep at least one post language.');
      return;
    }
    list.splice(index, 1);
  } else if (list.length >= (kind === 'posts' ? 3 : 8)) {
    toast(kind === 'posts' ? 'A post can have 3 languages.' : 'You can pick 8 content languages.');
    return;
  } else list.push(code);
  const next = saveLanguagePrefs({ ...prefs, [kind]: list });
  syncClientPrefs();
  document.querySelectorAll(`[data-lang-kind="${kind}"][data-lang="${code}"]`).forEach((button) => {
    button.setAttribute('aria-pressed', next[kind].includes(code) ? 'true' : 'false');
  });
  const dialog = $('compose');
  if (kind === 'posts' && dialog) {
    dialog._langs = next.posts.slice();
    paintLangChip();
    applyFieldLanguage($('compose-text'));
  }
  if (kind === 'content' && parseHash()[0] === 'discover') route();
}

function filterLanguageButtons(input) {
  const q = input.value.trim().toLowerCase();
  const root = input.closest('.picker, .settings') || document;
  root.querySelectorAll('.lang-pick').forEach((button) => {
    button.hidden = Boolean(q) && !button.textContent.toLowerCase().includes(q);
  });
}

function hoverBlocked(node) {
  return Boolean(node?.closest?.('.left, .tabbar, .account, #account-btn, [data-no-hover]'));
}

function actorFromLink(node) {
  const link = node?.closest?.('a[href^="#/profile/"]');
  if (!link || hoverBlocked(link) || link.closest('#hovercard, #menu, #suggest')) return null;
  const raw = (link.getAttribute('href') || '').replace(/^#/, '');
  const parts = raw.split('/').filter(Boolean).map((part) => {
    try { return decodeURIComponent(part); } catch { return part; }
  });
  if (parts[0] !== 'profile' || !parts[1] || parts[2]) return null;
  return { id: parts[1], link };
}

function placeHover(card, anchor) {
  const rect = anchor.getBoundingClientRect();
  const width = Math.min(320, window.innerWidth - 16);
  card.style.width = `${width}px`;
  card.style.right = 'auto';
  showFloat(card);
  const height = card.offsetHeight || 220;
  let left = Math.max(8, Math.min(rect.left, window.innerWidth - width - 8));
  let top = rect.bottom + 10;
  if (top + height > window.innerHeight - 8) top = rect.top - height - 10;
  const overlaps = (x, y) => y < rect.bottom + 4 && y + height > rect.top - 4 && x < rect.right && x + width > rect.left;
  const parkBeside = () => {
    const beside = rect.right + 10;
    if (beside + width <= window.innerWidth - 8) left = beside;
    else left = Math.max(8, rect.left - width - 10);
    top = Math.max(8, Math.min(rect.top, window.innerHeight - height - 8));
  };
  if (overlaps(left, top)) parkBeside();
  left = Math.max(8, Math.min(left, window.innerWidth - width - 8));
  top = Math.max(8, Math.min(top, window.innerHeight - height - 8));
  if (overlaps(left, top)) parkBeside();
  card.style.left = `${left}px`;
  card.style.top = `${top}px`;
}

function closeHover() {
  clearTimeout(hoverTimer);
  clearTimeout(hoverHideTimer);
  hoverActor = '';
  hoverWait = '';
  const card = $('hovercard');
  if (!card) return;
  card.innerHTML = '';
  hideFloat(card);
}

async function openHover(found) {
  const card = $('hovercard');
  if (!card || !found || hoverBlocked(found.link)) return closeHover();
  hoverActor = found.id;
  const cached = hoverProfiles.get(found.id);
  card.innerHTML = cached
    ? hoverCardHtml(cached, myDid())
    : `<div class="hover-body"><strong>@${escapeHtml(found.id)}</strong><p class="dim">Loading…</p></div>`;
  placeHover(card, found.link);
  if (cached) return;
  const seq = ++hoverSeq;
  try {
    const profile = await api.getProfile(found.id);
    if (profile?.did) hoverProfiles.set(profile.did, profile);
    if (profile?.handle) hoverProfiles.set(profile.handle, profile);
    hoverProfiles.set(found.id, profile);
    if (seq !== hoverSeq || hoverActor !== found.id) return;
    card.innerHTML = hoverCardHtml(profile, myDid());
    if (found.link?.isConnected) placeHover(card, found.link);
  } catch {
    if (seq !== hoverSeq || hoverActor !== found.id) return;
    card.innerHTML = `<div class="hover-body"><p class="dim">Could not load this account.</p></div>`;
  }
}

function scheduleHover(event) {
  if (event.pointerType && event.pointerType !== 'mouse') return;
  if (window.matchMedia('(hover: none)').matches) return;
  if (hoverBlocked(event.target)) {
    hoverWait = '';
    clearTimeout(hoverTimer);
    if (hoverActor) closeHover();
    return;
  }
  const found = actorFromLink(event.target);
  if (!found) return;
  clearTimeout(hoverHideTimer);
  const card = $('hovercard');
  const open = card && !card.hidden;
  if (open && hoverActor === found.id) return;
  if (!open && hoverWait === found.id) return;
  clearTimeout(hoverTimer);
  hoverWait = found.id;
  if (open && hoverActor) {
    hoverWait = '';
    openHover(found);
    return;
  }
  const anchor = found;
  hoverTimer = setTimeout(() => {
    if (hoverWait !== anchor.id) return;
    hoverWait = '';
    if (!anchor.link?.isConnected) return;
    openHover(anchor);
  }, 380);
}

function scheduleHoverHide(event) {
  const card = $('hovercard');
  const next = event.relatedTarget;
  const nextId = actorFromLink(next)?.id || '';
  if (next && (card?.contains(next) || (nextId && (nextId === hoverActor || nextId === hoverWait)))) return;
  hoverWait = '';
  clearTimeout(hoverTimer);
  clearTimeout(hoverHideTimer);
  hoverHideTimer = setTimeout(closeHover, 220);
}

function syncFollow(did, uri) {
  const escape = window.CSS?.escape || ((value) => String(value).replace(/"/g, '\\"'));
  document.querySelectorAll(`[data-act="follow"][data-did="${escape(did)}"]`).forEach((button) => {
    button.dataset.following = uri || '';
    button.classList.toggle('on', Boolean(uri));
    button.textContent = uri ? 'Following' : 'Follow';
  });
  hoverProfiles.forEach((profile) => {
    if (profile?.did !== did) return;
    profile.viewer = { ...(profile.viewer || {}), following: uri || '' };
  });
}

function chooseGif(gif) {
  const dialog = $('compose');
  if (!dialog || !gif?.url) return;
  if ((dialog._files || []).length || dialog._video) {
    toast('Remove the images or video to attach a GIF.');
    return;
  }
  if (dialog.dataset.quote || dialog._attach) {
    toast('Remove the quote or attachment before adding a GIF.');
    return;
  }
  dialog._gif = gif;
  dialog._card = null;
  closePicker();
  const box = $('compose-link');
  if (box) {
    box.hidden = false;
    box.innerHTML = `<div class="link-preview"><a class="card gif-card" href="${escapeHtml(gif.url)}" target="_blank" rel="noopener noreferrer"><img src="${escapeHtml(gif.thumb || gif.url)}" alt="${escapeHtml(gif.title || 'GIF')}"></a><button type="button" class="card-dismiss" data-act="dismiss-gif" aria-label="Remove GIF">×</button></div>`;
  }
  updateCount();
}

function openAbout() {
  const dialog = $('about');
  if (dialog && !dialog.open) dialog.showModal();
}

function openLegal(which) {
  const privacy = $('legal-privacy');
  const terms = $('legal-terms');
  if (privacy) privacy.hidden = which !== 'privacy';
  if (terms) terms.hidden = which !== 'terms';
  const dialog = $('legal');
  if (dialog && !dialog.open) dialog.showModal();
}

function fitChatInput(box) {
  if (!box) return;
  box.style.height = 'auto';
  const full = box.scrollHeight;
  const next = Math.min(Math.max(full, 96), 280);
  box.style.height = `${next}px`;
  box.style.overflowY = full > 280 ? 'auto' : 'hidden';
}

function chatLines() {
  return [...document.querySelectorAll('#view .messages .bubble')].slice(-8).map((node) => {
    const who = node.classList.contains('assistant') ? 'Assistant' : (node.classList.contains('mine') ? 'You' : 'Them');
    const text = node.querySelector('p')?.textContent || '';
    return text ? `${who}: ${text}` : '';
  }).filter(Boolean).join('\n').slice(0, 4000);
}

async function deliverChat(convoId, text) {
  rememberWords(text);
  const sent = await api.sendMessage(convoId, text);
  const message = sent?.sent || sent?.message || { text, sender: { did: myDid() } };
  if (!message.sender) message.sender = { did: myDid() };
  if (!message.text) message.text = text;
  const list = $('view').querySelector('.messages');
  list?.insertAdjacentHTML('beforeend', messageHtml(message, myDid()));
  if (list) list.scrollTop = list.scrollHeight;
  api.markConvoRead(convoId).then(refreshBadge).catch(() => {});
}

function appendAssistant(text) {
  const id = `ai-${Date.now()}`;
  aiDrafts.set(id, text);
  const list = $('view').querySelector('.messages');
  list?.insertAdjacentHTML('beforeend', assistantHtml(text, { id, kicker: 'Not sent · your account', actions: true }));
  if (list) list.scrollTop = list.scrollHeight;
}

async function askInChat(input, text) {
  const saved = loadAi();
  if (!aiReady(saved)) {
    toast('Add an AI account in Settings to use @ai and @si.');
    return;
  }
  const button = input.form?.querySelector('button[type="submit"]');
  input.disabled = true;
  if (button) button.disabled = true;
  const recent = chatLines();
  try {
    const answer = await askAi(saved, [
      { role: 'system', content: AI_SYSTEM },
      { role: 'user', content: recent ? `Recent chat:\n${recent}\n\nQuestion:\n${text}` : text },
    ], AbortSignal.timeout ? AbortSignal.timeout(45000) : undefined);
    if (parseHash()[0] !== 'messages') return;
    appendAssistant(answer);
  } catch (error) {
    if (error?.name === 'AbortError') toast('The account took too long.');
    else toast(error.message || 'The account did not answer.');
  } finally {
    if (input.isConnected) {
      input.disabled = false;
      input.focus();
    }
    if (button?.isConnected) button.disabled = false;
  }
}

function chatSized(text) {
  const value = String(text || '').trim();
  if (value.length <= 1000) return { text: value, trimmed: false };
  const cut = value.slice(0, 1000);
  const line = cut.lastIndexOf('\n');
  return { text: (line > 700 ? cut.slice(0, line) : cut).trim(), trimmed: true };
}

function onAiDraft(act, id) {
  const text = aiDrafts.get(id) || '';
  const bubble = [...document.querySelectorAll('.bubble.assistant')].find((node) => node.dataset.ai === id);
  if (act === 'dismiss-ai') {
    aiDrafts.delete(id);
    bubble?.remove();
    return;
  }
  if (!text) return;
  if (act === 'insert-ai') {
    const area = $('chat-text');
    if (!area) return;
    const sized = chatSized(text);
    area.value = sized.text;
    paintFieldHighlight(area, $('chat-highlight'));
    fitChatInput(area);
    area.focus();
    if (sized.trimmed) toast('The reply is longer than a chat message, so the box has the first part.');
    return;
  }
  if (act !== 'send-ai') return;
  const [page, convoId] = parseHash();
  if (page !== 'messages' || !convoId) return;
  const sized = chatSized(text);
  if (!sized.text) return;
  const button = bubble?.querySelector('[data-act="send-ai"]');
  if (button) button.disabled = true;
  deliverChat(convoId, sized.text).then(() => {
    aiDrafts.delete(id);
    bubble?.remove();
    if (sized.trimmed) toast('Sent the first part. A chat message stops at 1000 characters.');
  }).catch((error) => {
    toast(error.message);
    if (button?.isConnected) button.disabled = false;
  });
}

function openManage({ mode, uri = '', title, name = '', description = '', purpose = '' }) {
  const form = $('manage-form');
  form.dataset.mode = mode;
  form.dataset.uri = uri;
  $('manage-title').textContent = title;
  $('manage-name').value = name;
  $('manage-name').maxLength = mode === 'feed-edit' ? 240 : 64;
  $('manage-desc').value = description;
  $('manage-desc').maxLength = mode === 'feed-edit' ? 3000 : 300;
  const kind = $('manage-kind-label');
  kind.hidden = mode === 'feed-edit';
  const select = $('manage-kind');
  [...select.querySelectorAll('option[data-custom]')].forEach((option) => option.remove());
  if (mode !== 'feed-edit') {
    const next = purpose || 'app.bsky.graph.defs#curatelist';
    if (![...select.options].some((option) => option.value === next)) {
      const extra = document.createElement('option');
      extra.value = next;
      extra.dataset.custom = '1';
      extra.textContent = 'Custom';
      select.append(extra);
    }
    select.value = next;
  }
  if (!$('manage').open) $('manage').showModal();
  $('manage-name').focus();
}

async function writeDescription(record, description) {
  if (description) {
    record.description = description;
    const facets = await api.facetsFor(description);
    if (facets.length) record.descriptionFacets = facets;
    else delete record.descriptionFacets;
  } else {
    delete record.description;
    delete record.descriptionFacets;
  }
}

async function saveManage(event) {
  event.preventDefault();
  const form = event.target;
  const button = $('manage-save');
  const name = $('manage-name').value.trim();
  const description = $('manage-desc').value.trim();
  const purpose = $('manage-kind').value;
  if (!name) {
    toast('Add a name.');
    return;
  }
  button.disabled = true;
  try {
    if (form.dataset.mode === 'list-new') {
      const descriptionFacets = description ? await api.facetsFor(description) : [];
      await api.createList({ name, description, purpose, descriptionFacets });
      toast('List created');
    } else if (form.dataset.mode === 'list-edit') {
      await api.updateRecord(form.dataset.uri, async (record) => {
        record.name = name;
        record.purpose = purpose || record.purpose;
        await writeDescription(record, description);
        return record;
      });
      toast('List saved');
    } else if (form.dataset.mode === 'feed-edit') {
      await api.updateRecord(form.dataset.uri, async (record) => {
        record.displayName = name;
        await writeDescription(record, description);
        return record;
      });
      toast('Feed saved');
    }
    $('manage').close();
    route();
  } catch (error) {
    toast(error.message);
  } finally {
    button.disabled = false;
  }
}

function refreshHere() {
  const [page] = parseHash();
  if (['feeds', 'feed', 'lists', 'list', 'bookmarks', 'notifications', 'messages'].includes(page)) return route();
}

async function followedSubjects() {
  const subjects = new Map();
  const extras = [];
  let cursor = '';
  for (let page = 0; page < 100; page += 1) {
    const data = await api.listRecords('app.bsky.graph.follow', cursor || undefined);
    (data.records || []).forEach((record) => {
      const subject = record?.value?.subject;
      if (!subject) return;
      if (subjects.has(subject)) {
        if (record.uri) extras.push(record.uri);
      } else {
        subjects.set(subject, record.uri || '');
      }
    });
    if (!data.cursor || data.cursor === cursor) break;
    cursor = data.cursor;
  }
  return { known: new Set(subjects.keys()), extras };
}

async function followAllBack(button) {
  if (!signedIn()) return requireSignIn();
  if (!window.confirm('Follow everyone who follows you and you do not follow back? Each person is followed once, and extra follow records for the same person are removed. This stops after 80 new follows. Run it again to continue.')) return;
  if (button) {
    button.disabled = true;
    button.textContent = 'Checking…';
  }
  let followed = 0;
  let removed = 0;
  let cursor;
  let capped = false;
  let limited = false;
  let lastPage = '';
  try {
    const found = await followedSubjects().catch(() => ({ known: new Set(), extras: [] }));
    const already = found.known;
    for (const uri of found.extras.slice(0, 200)) {
      try {
        await api.deleteRecord(uri);
        removed += 1;
      } catch {
        /* that extra follow stays until the next run */
      }
    }
    if (button?.isConnected) button.textContent = 'Following…';
    for (let page = 0; page < 30 && followed < 80 && !limited; page += 1) {
      const data = await api.getFollowers(myDid(), cursor);
      const ids = (data.followers || []).map((actor) => actor?.did || '').filter(Boolean);
      const pageKey = ids.join(',');
      if (pageKey && pageKey === lastPage) break;
      lastPage = pageKey;
      const due = [];
      (data.followers || []).forEach((actor) => {
        if (followed + due.length >= 80) return;
        if (!actor?.did || actor.did === myDid() || already.has(actor.did)) return;
        if (actor.viewer?.following || actor.viewer?.blocking || actor.viewer?.blockedBy) {
          already.add(actor.did);
          return;
        }
        already.add(actor.did);
        due.push(actor.did);
      });
      for (let i = 0; i < due.length && !limited; i += 4) {
        const slice = due.slice(i, i + 4);
        const results = await Promise.all(slice.map(async (did) => {
          try {
            await api.follow(did);
            return 'ok';
          } catch (error) {
            already.delete(did);
            return error?.status === 429 ? 'limit' : 'skip';
          }
        }));
        results.forEach((result) => {
          if (result === 'ok') followed += 1;
          if (result === 'limit') limited = true;
        });
      }
      if (followed >= 80 && data.cursor) capped = true;
      if (!data.cursor || capped || data.cursor === cursor) break;
      cursor = data.cursor;
    }
    const tail = capped ? ' Run it again to continue.' : (limited ? ' Bluesky asked for a pause. Run it again in a little while.' : '');
    const cleaned = removed ? ` Removed ${removed} extra ${removed === 1 ? 'follow' : 'follows'}.` : '';
    toast(followed ? `Followed ${followed} ${followed === 1 ? 'person' : 'people'} back.${tail}${cleaned}` : `You already follow them back.${cleaned}`);
    await refreshHere();
  } catch (error) {
    toast(error.message);
  } finally {
    if (button?.isConnected) {
      button.disabled = false;
      button.textContent = 'Follow all back';
    }
  }
}

async function markEveryChatRead(button) {
  if (!signedIn()) return requireSignIn();
  if (button) button.disabled = true;
  try {
    let count = 0;
    try {
      const data = await api.markAllConvosRead();
      count = data?.updatedCount || 0;
    } catch {
      let cursor;
      for (let page = 0; page < 20; page += 1) {
        const data = await api.listConvos(cursor);
        const unread = (data.convos || []).filter((convo) => convo.unreadCount);
        for (const convo of unread) {
          await api.markConvoRead(convo.id);
          count += 1;
        }
        if (!data.cursor) break;
        cursor = data.cursor;
      }
    }
    toast(count ? `Marked ${count} ${count === 1 ? 'chat' : 'chats'} as read` : 'All chats are already read');
    refreshBadge();
    await refreshHere();
  } catch (error) {
    toast(error.message);
  } finally {
    if (button?.isConnected) button.disabled = false;
  }
}

async function cleanupDeletedChats(button) {
  if (!signedIn()) return requireSignIn();
  if (button) button.disabled = true;
  try {
    let cursor;
    const ids = [];
    for (let page = 0; page < 20; page += 1) {
      const data = await api.listConvos(cursor);
      (data.convos || []).forEach((convo) => {
        const other = (convo.members || []).find((member) => member.did !== myDid()) || convo.members?.[0];
        if (accountGone(other)) ids.push(convo.id);
      });
      if (!data.cursor) break;
      cursor = data.cursor;
    }
    if (!ids.length) {
      toast('No deleted accounts in your chats');
      return;
    }
    if (!window.confirm(`Leave ${ids.length} ${ids.length === 1 ? 'chat' : 'chats'} with deleted accounts?`)) return;
    for (const id of ids) await api.leaveConvo(id);
    toast(`Removed ${ids.length} ${ids.length === 1 ? 'chat' : 'chats'}`);
    refreshBadge();
    await refreshHere();
  } catch (error) {
    toast(error.message);
  } finally {
    if (button?.isConnected) button.disabled = false;
  }
}

async function cleanupBookmarks(button) {
  if (!signedIn()) return requireSignIn();
  if (!window.confirm('Remove bookmarks whose posts are unavailable?')) return;
  if (button) button.disabled = true;
  try {
    let cursor;
    let removed = 0;
    for (let page = 0; page < 30; page += 1) {
      const data = await api.getBookmarks(cursor);
      const gone = [];
      (data.bookmarks || []).forEach((mark) => {
        const subject = mark.subject || mark.item || mark.post;
        if (!subject?.uri) return;
        const type = subject.$type || '';
        if (subject.notFound || subject.blocked || type.includes('NotFound') || type.includes('Blocked')) gone.push(subject.uri);
      });
      for (const uri of gone) {
        await api.removeBookmark(uri);
        removed += 1;
      }
      if (!data.cursor) break;
      cursor = data.cursor;
    }
    toast(removed ? `Removed ${removed} unavailable ${removed === 1 ? 'bookmark' : 'bookmarks'}` : 'No unavailable bookmarks');
    await refreshHere();
  } catch (error) {
    toast(error.message);
  } finally {
    if (button?.isConnected) button.disabled = false;
  }
}

async function handleChromeAct(act, event) {
  const button = event.target.closest('[data-act]');
  if (act === 'nav-more') {
    event.preventDefault();
    openMoreMenu(button);
    return true;
  }
  if (act === 'soon') {
    event.preventDefault();
    location.hash = '#/ai';
    return true;
  }
  if (act === 'calls-page') {
    event.preventDefault();
    location.hash = '#/calls';
    return true;
  }
  if (act === 'emoji' || act === 'gif' || act === 'link' || act === 'post-lang') {
    event.preventDefault();
    if (pickerMode === act) closePicker();
    else if (act === 'emoji') openEmojiPicker();
    else if (act === 'gif') openGifPicker();
    else if (act === 'link') openLinkPicker();
    else openPostLangPicker();
    return true;
  }
  if (act === 'add-link') {
    event.preventDefault();
    addComposerLink();
    return true;
  }
  if (act === 'lang-toggle') {
    event.preventDefault();
    toggleLanguage(button?.dataset.langKind || '', button?.dataset.lang || '');
    return true;
  }
  if (act === 'add-account') {
    event.preventDefault();
    addAccount();
    return true;
  }
  if (act === 'switch-account') {
    event.preventDefault();
    await switchAccount(button?.dataset.did || '');
    return true;
  }
  if (act === 'remove-account') {
    event.preventDefault();
    await removeAccount(button?.dataset.did || '');
    return true;
  }
  if (act === 'copy-token') {
    event.preventDefault();
    try {
      await navigator.clipboard.writeText(button?.dataset.token || '');
      toast('App password copied');
    } catch (error) { toast(error.message); }
    return true;
  }
  if (act === 'revoke-token') {
    event.preventDefault();
    const name = button?.dataset.name || '';
    if (!name || !window.confirm(`Revoke the app password “${name}”?`)) return true;
    try {
      await api.revokeAppPassword(name);
      toast('App password revoked');
      await loadAppPasswords();
    } catch (error) { toast(error.message); }
    return true;
  }
  if (act === 'unmute-account') {
    event.preventDefault();
    if (!signedIn()) return requireSignIn(), true;
    try {
      await api.unmuteActor(button?.dataset.did || '');
      toast('Unmuted');
      await loadMutedAccounts();
    } catch (error) { toast(error.message); }
    return true;
  }
  if (act === 'unblock-account') {
    event.preventDefault();
    if (!signedIn()) return requireSignIn(), true;
    const uri = button?.dataset.uri || '';
    if (!uri) {
      toast('This block has no record to remove.');
      return true;
    }
    try {
      await api.deleteRecord(uri);
      toast('Unblocked');
      await loadBlockedAccounts();
    } catch (error) { toast(error.message); }
    return true;
  }
  if (act === 'pack-follow') {
    event.preventDefault();
    await followPack(button?.dataset.list, button);
    return true;
  }
  if (act === 'call-audio' || act === 'call-video') {
    event.preventDefault();
    if (!signedIn()) return requireSignIn(), true;
    if (!canCall()) {
      toast('Voice and video need a secure page. Open LibreSky over https, or on http://127.0.0.1.');
      return true;
    }
    const peer = button?.dataset.peer || $('title-tools')?.dataset.peer || $('view')?.querySelector('.chat-head')?.dataset.peer;
    const media = act === 'call-video' ? 'video' : 'audio';
    try {
      const [page, id] = parseHash();
      const convoId = page === 'messages' && id ? id : await convoIdFor(peer);
      if (!convoId || !peer) throw new Error('Could not open that conversation.');
      await startCall({ convoId, peerDid: peer, media });
    } catch (error) {
      toast(error?.message || 'The call could not start.');
    }
    return true;
  }
  if (act === 'message-profile') {
    event.preventDefault();
    if (!signedIn()) return requireSignIn(), true;
    try {
      const id = await convoIdFor(button?.dataset.did || '');
      location.hash = `#/messages/${encodeURIComponent(id)}`;
    } catch (error) {
      toast(error.message);
    }
    return true;
  }
  if (act === 'call-accept') {
    event.preventDefault();
    if (!signedIn()) return requireSignIn(), true;
    const peer = button?.dataset.peer || $('view')?.querySelector('.chat-head')?.dataset.peer;
    const [page, id] = parseHash();
    const convoId = button?.dataset.convo || (page === 'messages' ? id : '');
    const rkey = button?.dataset.rkey || '';
    silenceRing(convoId, rkey);
    $('view')?.querySelector('.call-banner')?.remove();
    button?.closest('.call-actions')?.remove();
    acceptCall({
      convoId,
      peerDid: peer,
      rkey,
      media: button?.dataset.media || 'audio',
    }).then(() => {
      if (!isInCall() && convoId && rkey) ignoredRings.delete(`${convoId}:${rkey}`);
    }).catch((error) => {
      if (convoId && rkey) ignoredRings.delete(`${convoId}:${rkey}`);
      toast(error.message);
    });
    return true;
  }
  if (act === 'call-decline') {
    event.preventDefault();
    const [page, id] = parseHash();
    const convoId = button?.dataset.convo || (page === 'messages' ? id : '');
    const rkey = button?.dataset.rkey || '';
    silenceRing(convoId, rkey);
    declineCall(convoId, rkey).then((ok) => {
      if (!ok && convoId && rkey) ignoredRings.delete(`${convoId}:${rkey}`);
      $('view')?.querySelector('.call-banner')?.remove();
      button?.closest('.call-actions')?.remove();
    });
    return true;
  }
  if (act === 'follow-back') {
    event.preventDefault();
    await followAllBack(button);
    return true;
  }
  if (act === 'chat-read') {
    event.preventDefault();
    await markEveryChatRead(button);
    return true;
  }
  if (act === 'chat-cleanup') {
    event.preventDefault();
    await cleanupDeletedChats(button);
    return true;
  }
  if (act === 'leave-convo') {
    event.preventDefault();
    const id = button?.dataset.convo;
    if (!id) return true;
    if (!window.confirm('Remove this chat with a deleted account?')) return true;
    try {
      await api.leaveConvo(id);
      button.closest('.person')?.remove();
      toast('Chat removed');
      refreshBadge();
    } catch (error) { toast(error.message); }
    return true;
  }
  if (act === 'bookmarks-cleanup') {
    event.preventDefault();
    await cleanupBookmarks(button);
    return true;
  }
  if (act === 'list-new') {
    event.preventDefault();
    if (!signedIn()) return requireSignIn(), true;
    openManage({ mode: 'list-new', title: 'New list', purpose: 'app.bsky.graph.defs#curatelist' });
    return true;
  }
  if (act === 'list-edit' || act === 'feed-edit') {
    event.preventDefault();
    if (!signedIn()) return requireSignIn(), true;
    openManage({
      mode: act === 'list-edit' ? 'list-edit' : 'feed-edit',
      uri: button.dataset.uri,
      title: act === 'list-edit' ? 'Edit list' : 'Edit feed',
      name: button.dataset.name || '',
      description: button.dataset.description || '',
      purpose: button.dataset.purpose || '',
    });
    return true;
  }
  if (act === 'list-delete') {
    event.preventDefault();
    if (!signedIn()) return requireSignIn(), true;
    const name = button.dataset.name || 'this list';
    if (!window.confirm(`Delete ${name}? People on the list stay on Bluesky. The list itself is removed.`)) return true;
    try {
      await api.deleteList(button.dataset.uri);
      toast('List deleted');
      if (parseHash()[0] === 'list') location.hash = '#/lists';
      else route();
    } catch (error) { toast(error.message); }
    return true;
  }
  if (act === 'list-mute') {
    event.preventDefault();
    if (!signedIn()) return requireSignIn(), true;
    try {
      if (button.dataset.muted === '1') await api.unmuteList(button.dataset.uri);
      else await api.muteList(button.dataset.uri);
      toast(button.dataset.muted === '1' ? 'List unmuted' : 'List muted');
      route();
    } catch (error) { toast(error.message); }
    return true;
  }
  if (act === 'list-more') {
    event.preventDefault();
    button.disabled = true;
    try {
      const page = await api.getList(button.dataset.uri, button.dataset.cursor);
      const mine = button.dataset.mine === '1';
      const rows = (page.items || []).map((item) => actorHtml(item.subject, {
        follow: signedIn(),
        self: myDid(),
        extra: mine ? miniButton('list-remove-member', 'Remove', { uri: item.uri }, true) : '',
      })).join('');
      let box = $('view').querySelector('.directory');
      if (!box && rows) {
        button.closest('.toolbar')?.insertAdjacentHTML('beforebegin', `<div class="directory">${rows}</div>`);
      } else if (rows) box.insertAdjacentHTML('beforeend', rows);
      if (page.cursor) {
        button.dataset.cursor = page.cursor;
        button.disabled = false;
      } else button.closest('.toolbar')?.remove();
    } catch (error) {
      button.disabled = false;
      toast(error.message);
    }
    return true;
  }
  if (act === 'list-remove-member') {
    event.preventDefault();
    if (!signedIn()) return requireSignIn(), true;
    try {
      await api.deleteRecord(button.dataset.uri);
      button.closest('.person')?.remove();
      toast('Removed from list');
    } catch (error) { toast(error.message); }
    return true;
  }
  if (act === 'feed-pin' || act === 'feed-save' || act === 'feed-remove') {
    event.preventDefault();
    if (!signedIn()) return requireSignIn(), true;
    const uri = button.dataset.uri;
    try {
      if (act === 'feed-remove') {
        await changeFeeds((items) => items.filter((item) => item.value !== uri));
        toast('Removed from your feeds');
      } else if (act === 'feed-save') {
        await changeFeeds((items) => (items.some((item) => item.value === uri) ? items : [...items, { type: 'feed', value: uri, pinned: false }]));
        toast('Feed saved');
      } else {
        const type = button.dataset.type || 'feed';
        const pinned = button.dataset.pinned === '1';
        await changeFeeds((items) => {
          const found = items.find((item) => item.value === uri);
          if (!found) return [...items, { type, value: uri, pinned: true }];
          return items.map((item) => (item.value === uri ? { ...item, pinned: !pinned } : item));
        });
        toast(pinned ? 'Unpinned' : 'Pinned');
      }
      route();
    } catch (error) { toast(error.message); }
    return true;
  }
  if (act === 'feed-delete') {
    event.preventDefault();
    if (!signedIn()) return requireSignIn(), true;
    if (!window.confirm('Delete this feed from your account?')) return true;
    try {
      await api.deleteRecord(button.dataset.uri);
      await changeFeeds((items) => items.filter((item) => item.value !== button.dataset.uri)).catch(() => {});
      toast('Feed deleted');
      if (parseHash()[0] === 'feeds') route();
      else location.hash = '#/feeds';
    } catch (error) { toast(error.message); }
    return true;
  }
  return false;
}

function selectedText() {
  const selection = window.getSelection?.();
  if (!selection || selection.isCollapsed) return '';
  return selection.toString();
}

async function onClick(event) {
  const note = event.target.closest?.('.note[data-href]');
  if (note && !event.target.closest('a, button')) {
    if (selectedText().trim()) return;
    const href = note.getAttribute('data-href');
    if (!href) return;
    if (location.hash === href) route();
    else location.hash = href;
    return;
  }
  const facet = event.target.closest?.('a.facet');
  if (facet) {
    if (selectedText().trim()) return;
    closeHover();
    const href = facet.getAttribute('href') || '';
    if (href.startsWith('#')) {
      event.preventDefault();
      if (location.hash === href) route();
      else location.hash = href;
    }
    return;
  }
  const act = event.target.closest('[data-act]')?.dataset.act;
  if (act === 'desktop-download') {
    event.preventDefault();
    const button = event.target.closest('[data-file]');
    if (button?.dataset.file) saveDesktopZip(button.dataset.file, button);
    return;
  }
  if (act && await handleChromeAct(act, event)) return;
  if (event.target.closest('[data-act="image"], .shot, .action, .more, .follow, .card, .facet')) {
    /* buttons handle themselves below */
  }
  if (act === 'dismiss-video') {
    event.preventDefault();
    const dialog = $('compose');
    if (dialog?._video?.url) URL.revokeObjectURL(dialog._video.url);
    if (dialog) dialog._video = null;
    renderVideo();
    scheduleLinkPreview();
    return;
  }
  if (act === 'dismiss-gif') {
    event.preventDefault();
    const dialog = $('compose');
    if (dialog) dialog._gif = null;
    const box = $('compose-link');
    if (box) {
      box.hidden = true;
      box.innerHTML = '';
    }
    updateCount();
    scheduleLinkPreview();
    return;
  }
  if (act === 'dismiss-link') {
    event.preventDefault();
    const dialog = $('compose');
    dialog._dismissedUrl = dialog._card?.sourceUrl || firstUrl($('compose-text').value);
    dialog._card = null;
    const box = $('compose-link');
    if (box) {
      box.hidden = true;
      box.innerHTML = '';
    }
    updateCount();
    return;
  }
  if (act === 'remove-bookmark') {
    event.preventDefault();
    const uri = event.target.closest('[data-uri]')?.dataset.uri;
    if (!uri) return;
    if (!signedIn()) return requireSignIn();
    try {
      await api.removeBookmark(uri);
      event.target.closest('.note, .post')?.remove();
      if (parseHash()[0] === 'bookmarks' && !$('view').querySelector('.post, .note')) {
        $('view').insertAdjacentHTML('beforeend', emptyHtml('No bookmarks', 'Tap the bookmark on a post to save it here.'));
      }
      toast('Bookmark removed');
    } catch (error) { toast(error.message); }
    return;
  }
  if (act === 'expand-names') {
    event.preventDefault();
    const more = event.target.nextElementSibling;
    if (more) more.hidden = false;
    event.target.remove();
    return;
  }
  if (act === 'signin') return requireSignIn();
  if (act === 'compose') return openComposer();
  if (act === 'search-settings') {
    event.preventDefault();
    openTune('search');
    return;
  }
  if (act === 'home-settings') {
    event.preventDefault();
    openTune('home');
    return;
  }
  if (act === 'thread-settings') {
    event.preventDefault();
    openTune('thread');
    return;
  }
  if (act === 'feed-settings') {
    event.preventDefault();
    openTune('feed', event.target.closest('[data-feed]')?.dataset.feed || '');
    return;
  }
  if (act === 'voice-sample') {
    event.preventDefault();
    speakAloud('This is how LibreSky reads a post.');
    return;
  }
  if (act === 'fresh-update') {
    event.preventDefault();
    applyFresh();
    return;
  }
  if (act === 'attach') {
    event.preventDefault();
    openAttachPicker('post');
    return;
  }
  if (act === 'profile-attach') {
    event.preventDefault();
    openAttachPicker('profile');
    return;
  }
  if (act === 'attach-pick') {
    event.preventDefault();
    const uri = event.target.closest('[data-uri]')?.dataset.uri;
    if (uri) chooseAttach(uri);
    return;
  }
  if (act === 'dismiss-attach') {
    event.preventDefault();
    const dialog = $('compose');
    if (dialog) dialog._attach = null;
    paintAttach();
    updateCount();
    scheduleLinkPreview();
    return;
  }
  if (act === 'shelf-unpin') {
    event.preventDefault();
    unpinFeatured(event.target.closest('[data-uri]')?.dataset.uri || '');
    return;
  }
  if (act === 'shelf-more') {
    event.preventDefault();
    const more = event.target.nextElementSibling;
    if (more) more.hidden = false;
    event.target.remove();
    return;
  }
  if (act === 'retry') return route();
  if (act === 'signout') return signOut();
  if (act === 'show-warn') {
    event.preventDefault();
    event.target.closest('.content')?.classList.remove('blurred');
    event.target.remove();
    return;
  }
  if (act === 'show-muted') {
    const article = event.target.closest('.post');
    const item = posts.get(article?.dataset.uri);
    if (item) {
      resetPosts();
      article.outerHTML = postHtml(item, { force: true });
      remember();
    }
    return;
  }
  if (act === 'image') {
    event.preventDefault();
    const shot = event.target.closest('.shot');
    const shots = [...shot.closest('.gallery').querySelectorAll('.shot')];
    openLightbox(shots.map((node) => ({ src: node.dataset.full, alt: node.dataset.alt })), shots.indexOf(shot));
    return;
  }
  if (act === 'video') {
    event.preventDefault();
    playVideo(event.target.closest('.video'));
    return;
  }
  if (act === 'new-chat') return newChat();
  if (act === 'send-ai' || act === 'insert-ai' || act === 'dismiss-ai') {
    event.preventDefault();
    onAiDraft(act, event.target.closest('[data-ai]')?.dataset.ai || '');
    return;
  }
  if (act === 'ai-clear') {
    event.preventDefault();
    clearAi();
    toast('AI account removed from this browser');
    if (parseHash()[0] === 'settings') showSettings();
    return;
  }
  if (act === 'ai-check') {
    event.preventDefault();
    checkAiForm();
    return;
  }
  if (act === 'thread-reply') {
    const item = posts.get(event.target.closest('[data-uri]')?.dataset.uri);
    if (item?.post) openComposer({ reply: item.post });
    return;
  }
  const found = postFrom(event.target);
  if (!found?.post) {
    if (act === 'follow') return toggleFollow(event.target.closest('[data-act="follow"]'));
    if (act === 'block-profile') return toggleBlock(event.target.closest('[data-act="block-profile"]'));
    if (act === 'report-profile') return openReport({ did: event.target.closest('[data-did]')?.dataset.did });
    if (act === 'edit-profile') return openProfileEditor();
    return;
  }
  if (act === 'speak') return speakPost(found);
  if (act === 'reply') return openComposer({ reply: found.post });
  if (act === 'like') return toggleLike(found);
  if (act === 'bookmark') return toggleBookmark(found);
  if (act === 'share') return sharePost(found);
  if (act === 'likes' || act === 'reposts') {
    location.hash = `#/${act}/${encodeURIComponent(found.article.dataset.uri)}`;
    return;
  }
  if (act === 'repost') return repostMenu(event.target.closest('.action'), found);
  if (act === 'more') return moreMenu(event.target.closest('.more'), found);
  if (act === 'follow') return toggleFollow(event.target.closest('[data-act="follow"]'));
  if (!act && event.target.closest('a, button, .card, .shot, .video')) return;
  const quote = event.target.closest?.('.quote[data-href]');
  if (quote && !event.target.closest('a, button')) {
    location.hash = quote.getAttribute('data-href');
    return;
  }
  if (selectedText().trim() && event.target.closest('.text, .bio, .quote-text, .bubble, .snip, .said')) return;
  if (event.target.closest('.post') && !event.target.closest('a, button')) {
    const link = found.article.querySelector('.time');
    const href = link?.getAttribute('href');
    if (!href || !found.article.classList.contains('feed-post')) return;
    if (location.hash === href) route();
    else location.hash = href;
  }
}

function repostMenu(anchor, found) {
  const on = Boolean(found.article.dataset.repost);
  openMenu(anchor, [
    { id: on ? 'unrepost' : 'repost', label: on ? 'Undo repost' : 'Repost' },
    { id: 'quote', label: 'Quote' },
  ]);
  $('menu')._post = found;
}

function moreMenu(anchor, found) {
  const author = found.post.author || {};
  const own = author.did && author.did === myDid();
  const pinnedUri = me.profile?.pinnedPost?.uri || me.profile?.pinnedPost?.post?.uri || '';
  const items = [
    { id: 'share', label: 'Share' },
    { id: 'copy', label: 'Copy link' },
    { id: 'copy-text', label: 'Copy text' },
    { id: 'quote', label: 'Quote' },
  ];
  items.push({ id: 'send-chat', label: 'Send in chat' });
  if (found.article.dataset.bookmarked === '1') items.push({ id: 'unbookmark', label: 'Remove bookmark', danger: true });
  if (own) {
    items.push({ id: pinnedUri === found.post.uri ? 'unpin' : 'pin', label: pinnedUri === found.post.uri ? 'Unpin from profile' : 'Pin to profile' });
    items.push({ id: 'delete', label: 'Delete', danger: true });
  } else {
    items.push({ id: author.viewer?.muted ? 'unmute' : 'mute', label: author.viewer?.muted ? 'Unmute account' : 'Mute account' });
    if (!author.viewer?.blocking) items.push({ id: 'block', label: 'Block account' });
    items.push({ id: 'report', label: 'Report post' });
  }
  items.push({ id: 'mute-thread', label: 'Mute thread' });
  openMenu(anchor, items);
  $('menu')._post = found;
}

function postLink(found) {
  const handle = found.post.author?.handle;
  const rkey = found.post.uri?.split('/').pop();
  if (handle && rkey) return `https://bsky.app/profile/${handle}/post/${rkey}`;
  const link = new URL(location.href);
  link.hash = found.article.querySelector('.time')?.getAttribute('href') || location.hash;
  return link.href;
}

function threadRoot(post) {
  return post?.record?.reply?.root?.uri || post?.uri || '';
}

async function sharePost(found) {
  const url = postLink(found);
  const text = (found.post.record?.text || '').slice(0, 180);
  const title = found.post.author?.handle ? `@${found.post.author.handle} on Bluesky` : 'Bluesky';
  if (navigator.share) {
    try {
      await navigator.share({ title, text, url });
      return;
    } catch (error) {
      if (error?.name === 'AbortError') return;
    }
  }
  try {
    await navigator.clipboard.writeText(url);
    toast('Link copied');
  } catch {
    toast(url);
  }
}

function openReport(target) {
  if (!signedIn()) return requireSignIn();
  if (!target?.post && !target?.did) return;
  reportTarget = target;
  if ($('report-text')) $('report-text').value = '';
  if (!$('report').open) $('report').showModal();
}

function openProfileEditor() {
  const profile = me.profile;
  if (!profile) return;
  $('profile-name').value = profile.displayName || '';
  $('profile-bio').value = profile.description || '';
  $('profile-avatar').value = '';
  $('profile-banner').value = '';
  $('profile-edit').dataset.clearBanner = '';
  const preview = $('profile-banner-preview');
  if (profile.banner) {
    preview.src = profile.banner;
    preview.hidden = false;
  } else {
    preview.hidden = true;
    preview.removeAttribute('src');
  }
  if (!$('profile-edit').open) $('profile-edit').showModal();
}

async function saveProfile(event) {
  event.preventDefault();
  const button = event.target.querySelector('button[type="submit"]');
  button.disabled = true;
  try {
    let avatar = null;
    const file = $('profile-avatar').files?.[0];
    if (file) avatar = await api.uploadBlob(await compress(file));
    const bannerFile = $('profile-banner').files?.[0];
    const changes = {
      displayName: $('profile-name').value.trim(),
      description: $('profile-bio').value.trim(),
      avatar,
    };
    if (bannerFile) changes.banner = await api.uploadBlob(await compress(bannerFile));
    else if ($('profile-edit').dataset.clearBanner === '1') changes.banner = null;
    await api.updateProfile(changes);
    $('profile-edit').close();
    toast('Profile saved');
    await loadMe();
    route();
  } catch (error) {
    toast(error.message);
  } finally {
    button.disabled = false;
  }
}

async function submitReport(event) {
  event.preventDefault();
  const target = reportTarget;
  if (!target) return;
  const reasonType = $('report-reason').value;
  const reason = $('report-text').value.trim();
  const button = event.target.querySelector('button[type="submit"]');
  button.disabled = true;
  try {
    if (target.post) await api.reportPost(target.post.uri, target.post.cid, reasonType, reason);
    else await api.reportAccount(target.did, reasonType, reason);
    $('report').close();
    reportTarget = null;
    toast('Report sent');
  } catch (error) {
    toast(error.message);
  } finally {
    button.disabled = false;
  }
}

async function onMenu(event) {
  const id = event.target.dataset.menu;
  const found = $('menu')._post;
  closeMenu();
  if (!id) return;
  if (id === 'go-lists') return void (location.hash = '#/lists');
  if (id === 'go-feeds') return void (location.hash = '#/feeds');
  if (id === 'go-packs') return void (location.hash = '#/packs');
  if (id === 'go-bookmarks') return void (location.hash = '#/bookmarks');
  if (id === 'go-calls') return void (location.hash = '#/calls');
  if (id === 'go-downloads') return void (location.hash = '#/downloads');
  if (id === 'go-settings' || id === 'settings-go') return void (location.hash = '#/settings');
  if (id === 'go-about') return openAbout();
  if (id === 'go-privacy') return openLegal('privacy');
  if (id === 'go-terms') return openLegal('terms');
  if (id === 'go-ai') return void (location.hash = '#/ai');
  if (id === 'add-account') return addAccount();
  if (id.startsWith('switch-account:')) return switchAccount(id.slice('switch-account:'.length));
  if (id === 'signout-go') return signOut();
  if (!found) return;
  if (!['copy', 'copy-text', 'share', 'quote'].includes(id) && !signedIn()) return requireSignIn();
  if (id === 'quote') return openComposer({ quote: found.post });
  if (id === 'unbookmark') return toggleBookmark(found);
  if (id === 'send-chat') return sendPostToChat(found);
  if (id === 'share') return sharePost(found);
  if (id === 'copy' || id === 'copy-text') {
    const value = id === 'copy' ? postLink(found) : (found.post.record?.text || '');
    try {
      await navigator.clipboard.writeText(value);
      toast(id === 'copy' ? 'Link copied' : 'Text copied');
    } catch (error) { toast(error.message); }
    return;
  }
  if (id === 'repost' || id === 'unrepost') return toggleRepost(found);
  if (id === 'delete') return deletePost(found);
  if (id === 'report') return openReport(found);
  if (id === 'mute' || id === 'unmute') {
    try {
      if (id === 'mute') await api.muteActor(found.post.author.did);
      else await api.unmuteActor(found.post.author.did);
      toast(id === 'mute' ? `Muted @${found.post.author.handle}` : 'Unmuted');
    } catch (error) { toast(error.message); }
    return;
  }
  if (id === 'block') {
    const handle = found.post.author?.handle || 'this account';
    if (!window.confirm(`Block @${handle}? You will not see each other’s posts.`)) return;
    try {
      await api.block(found.post.author.did);
      found.article.remove();
      toast('Blocked');
    } catch (error) { toast(error.message); }
    return;
  }
  if (id === 'mute-thread') {
    try {
      await api.muteThread(threadRoot(found.post));
      toast('Thread muted');
    } catch (error) { toast(error.message); }
    return;
  }
  if (id === 'pin' || id === 'unpin') {
    try {
      const ref = id === 'pin' ? { uri: found.post.uri, cid: found.post.cid } : null;
      await api.updateProfile({ pinnedPost: ref });
      try { me.profile = await api.getProfile(myDid()); } catch { if (me.profile) me.profile.pinnedPost = ref; }
      toast(id === 'pin' ? 'Pinned to your profile' : 'Unpinned');
      if (parseHash()[0] === 'profile') route();
    } catch (error) { toast(error.message); }
  }
}

async function toggleLike(found) {
  if (!signedIn()) return requireSignIn();
  const article = found.article;
  const existing = article.dataset.like;
  const button = article.querySelector('.action.like');
  const previous = Number(article.dataset.likeCount || 0);
  const nextOn = !existing;
  article.dataset.like = nextOn ? 'pending' : '';
  article.dataset.likeCount = String(Math.max(0, previous + (nextOn ? 1 : -1)));
  button.classList.toggle('on', nextOn);
  button.closest('.action-group')?.classList.toggle('on', nextOn);
  const likeCount = button.closest('.action-group')?.querySelector('.count-link, .count');
  if (likeCount) likeCount.textContent = compactCount(article.dataset.likeCount);
  try {
    if (existing && existing !== 'pending') await api.deleteRecord(existing);
    else article.dataset.like = (await api.like(article.dataset.uri, article.dataset.cid)).uri;
  } catch (error) {
    article.dataset.like = existing;
    article.dataset.likeCount = String(previous);
    button.classList.toggle('on', Boolean(existing));
    button.closest('.action-group')?.classList.toggle('on', Boolean(existing));
    const rolled = button.closest('.action-group')?.querySelector('.count-link, .count');
    if (rolled) rolled.textContent = compactCount(previous);
    toast(error.message);
  }
}

function compactCount(value) {
  const n = Number(value) || 0;
  if (n < 1) return '';
  if (n < 1000) return String(n);
  return `${(n / 1000).toFixed(n < 10000 ? 1 : 0).replace(/\.0$/, '')}K`;
}

async function toggleRepost(found) {
  if (!signedIn()) return requireSignIn();
  const article = found.article;
  const existing = article.dataset.repost;
  const button = article.querySelector('.action.repost');
  const previous = Number(article.dataset.repostCount || 0);
  const nextOn = !existing;
  const nextCount = Math.max(0, previous + (nextOn ? 1 : -1));
  article.dataset.repost = nextOn ? 'pending' : '';
  article.dataset.repostCount = String(nextCount);
  button?.classList.toggle('on', nextOn);
  button?.closest('.action-group')?.classList.toggle('on', nextOn);
  const count = button?.closest('.action-group')?.querySelector('.count-link, .count');
  if (count) count.textContent = compactCount(nextCount);
  try {
    if (existing && existing !== 'pending') await api.deleteRecord(existing);
    else article.dataset.repost = (await api.repost(article.dataset.uri, article.dataset.cid)).uri;
  } catch (error) {
    article.dataset.repost = existing;
    article.dataset.repostCount = String(previous);
    button?.classList.toggle('on', Boolean(existing));
    button?.closest('.action-group')?.classList.toggle('on', Boolean(existing));
    if (count) count.textContent = compactCount(previous);
    toast(error.message);
  }
}

async function toggleBlock(button) {
  if (!button) return;
  if (!signedIn()) return requireSignIn();
  const did = button.dataset.did;
  const existing = button.dataset.blocking;
  try {
    if (existing) {
      await api.deleteRecord(existing);
      button.dataset.blocking = '';
      button.classList.remove('danger');
      button.classList.add('text-btn');
      button.textContent = 'Block';
      toast('Unblocked');
      route();
    } else {
      const handle = button.closest('.profile')?.querySelector('.handle')?.textContent || 'this account';
      if (!window.confirm(`Block ${handle}? You will not see each other’s posts.`)) return;
      button.dataset.blocking = (await api.block(did)).uri;
      button.classList.add('danger');
      button.classList.remove('text-btn');
      button.textContent = 'Blocked';
      toast('Blocked');
      route();
    }
  } catch (error) { toast(error.message); }
}

async function toggleBookmark(found) {
  if (!signedIn()) return requireSignIn();
  const article = found.article;
  const on = article.dataset.bookmarked === '1';
  const button = article.querySelector('.action.bookmark');
  try {
    if (on) await api.removeBookmark(article.dataset.uri);
    else await api.bookmark(article.dataset.uri, article.dataset.cid);
    if (on && parseHash()[0] === 'bookmarks') {
      article.remove();
      if (!$('view').querySelector('.post')) {
        $('view').insertAdjacentHTML('beforeend', emptyHtml('No bookmarks', 'Tap the bookmark on a post to save it here.'));
      }
      toast('Bookmark removed');
      return;
    }
    article.dataset.bookmarked = on ? '0' : '1';
    button?.classList.toggle('on', !on);
    button?.setAttribute('aria-pressed', on ? 'false' : 'true');
    toast(on ? 'Bookmark removed' : 'Bookmarked');
  } catch (error) { toast(error.message); }
}

async function sendPostToChat(found) {
  if (!signedIn()) return requireSignIn();
  const handle = window.prompt('Send this post to which handle?');
  if (!handle) return;
  const url = postLink(found);
  const embed = {
    $type: 'app.bsky.embed.record',
    record: { uri: found.post.uri, cid: found.post.cid },
  };
  try {
    const did = await api.resolveHandle(handle.trim().replace(/^@/, ''));
    const data = await api.convoForMember(did);
    const id = data.convo?.id;
    if (!id) throw new Error('Could not open that conversation.');
    try {
      await api.sendMessage(id, { text: '', embed });
    } catch {
      await api.sendMessage(id, { text: url, embed });
    }
    toast('Sent in chat');
    location.hash = `#/messages/${encodeURIComponent(id)}`;
  } catch (error) { toast(error.message); }
}

async function toggleFollow(button) {
  if (!button) return;
  if (!signedIn()) return requireSignIn();
  const did = button.dataset.did;
  const existing = button.dataset.following;
  try {
    if (existing) {
      await api.deleteRecord(existing);
      syncFollow(did, '');
    } else {
      syncFollow(did, (await api.follow(did)).uri);
    }
  } catch (error) { toast(error.message); }
}

async function deletePost(found) {
  if (!window.confirm('Delete this post?')) return;
  try {
    await api.deleteRecord(found.post.uri);
    found.article.remove();
    toast('Deleted');
  } catch (error) { toast(error.message); }
}

async function convoIdFor(peerDid) {
  if (!peerDid) throw new Error('Could not open that conversation.');
  const data = await api.convoForMember(peerDid);
  const id = data.convo?.id;
  if (!id) throw new Error('Could not open that conversation.');
  return id;
}

async function newChat() {
  const handle = window.prompt('Message which handle?');
  if (!handle) return;
  try {
    const did = await api.resolveHandle(handle.trim().replace(/^@/, ''));
    const data = await api.convoForMember(did);
    const id = data.convo?.id;
    if (!id) throw new Error('Could not open that conversation.');
    location.hash = `#/messages/${encodeURIComponent(id)}`;
  } catch (error) { toast(error.message); }
}

let lightbox = { images: [], index: 0 };

function openLightbox(images, index) {
  lightbox = { images, index };
  paintLightbox();
  if (!$('lightbox').open) $('lightbox').showModal();
}

function paintLightbox() {
  const image = lightbox.images[lightbox.index];
  if (!image) return;
  $('lightbox-img').src = image.src;
  $('lightbox-img').alt = image.alt || '';
  $('lightbox-alt').hidden = !image.alt;
  $('lightbox-alt').textContent = image.alt || '';
}

async function playVideo(node) {
  if (!node || node.dataset.playing) return;
  const playlist = node.dataset.playlist;
  if (!playlist) return;
  node.dataset.playing = '1';
  const video = document.createElement('video');
  video.controls = true;
  video.autoplay = true;
  video.playsInline = true;
  node.replaceChildren(video);
  if (video.canPlayType('application/vnd.apple.mpegurl')) {
    video.src = playlist;
    return;
  }
  try {
    const mod = await import('https://cdn.jsdelivr.net/npm/hls.js@1.6.13/+esm');
    const Hls = mod.default;
    if (Hls?.isSupported()) {
      const hls = new Hls();
      hls.loadSource(playlist);
      hls.attachMedia(video);
      return;
    }
  } catch {
    /* fall through */
  }
  node.replaceChildren();
  node.textContent = 'This browser could not play the video.';
}

async function startOAuth(event) {
  event?.preventDefault();
  const error = $('login-error');
  error.hidden = true;
  if (!client) {
    error.hidden = false;
    error.textContent = oauthReady || 'Sign in with Bluesky is unavailable here. Use an app password.';
    $('app-password-box').hidden = false;
    return;
  }
  const typed = $('login-handle').value.trim().replace(/^@/, '');
  if (typed && !typed.startsWith('http')) setLastHandle(typed);
  const button = $('login-oauth');
  button.disabled = true;
  button.textContent = 'Opening Bluesky…';
  try {
    rememberCurrent();
    await client.signInRedirect(typed || 'https://bsky.social');
  } catch (err) {
    error.hidden = false;
    error.textContent = err.message || 'Bluesky did not open the login page.';
    button.disabled = false;
    button.textContent = 'Sign in with Bluesky';
  }
}

async function startSignup() {
  const error = $('login-error');
  error.hidden = true;
  if (!client) {
    error.hidden = false;
    error.textContent = 'Open Bluesky to create an account, then come back and sign in.';
    window.open('https://bsky.app', '_blank', 'noopener');
    return;
  }
  const button = $('login-signup');
  button.disabled = true;
  button.textContent = 'Opening Bluesky…';
  try {
    rememberCurrent();
    // No handle is sent, so Bluesky’s page can offer account creation.
    await client.signInRedirect('https://bsky.social');
  } catch (err) {
    error.hidden = false;
    error.textContent = err.message || 'Bluesky did not open the signup page.';
    button.disabled = false;
    button.textContent = 'Create a Bluesky account';
  }
}

async function startPassword() {
  const error = $('login-error');
  const identifier = $('login-handle').value.trim();
  const password = $('login-password').value;
  error.hidden = true;
  if (!identifier || !password) {
    error.hidden = false;
    error.textContent = 'Enter your handle and app password.';
    return;
  }
  const button = $('login-password-btn');
  button.disabled = true;
  const previousOauth = getOauth();
  const previousPassword = getPassword();
  rememberCurrent();
  setOauth(null);
  try {
    await api.loginWithPassword(identifier, password);
    setOauth(null);
    setActiveDid(getPassword()?.did || '');
    $('login-password').value = '';
    closeGate();
    await loadMe();
    if (!location.hash || location.hash === '#' || location.hash === '#/') location.hash = '#/';
    route();
    toast(`Signed in as @${getPassword().handle}`);
  } catch (err) {
    setOauth(previousOauth);
    if (previousPassword && getPassword()?.did !== previousPassword.did) setPassword(previousPassword);
    else if (!getPassword() && previousPassword) setPassword(previousPassword);
    error.hidden = false;
    error.textContent = err.message;
  } finally {
    button.disabled = false;
  }
}

async function useAccount(entry) {
  if (!entry?.did) throw new Error('That account is not saved on this browser.');
  if (entry.kind === 'password') {
    setOauth(null);
    setPassword(entry.session);
    const ok = await api.ensurePasswordSession();
    if (!ok) {
      forgetAccount(entry.did);
      setPassword(null);
      throw new Error('That sign-in expired. Add the account again.');
    }
  } else {
    if (!client) throw new Error('Sign in with Bluesky is unavailable in this browser.');
    const session = await client.restore(entry.did);
    setPassword(null);
    setOauth(session);
  }
  setActiveDid(entry.did);
  await loadMe();
}

async function switchAccount(did) {
  if (!did || did === myDid()) {
    if (parseHash()[0] !== 'settings') location.hash = '#/';
    return;
  }
  rememberCurrent();
  const previous = listAccounts().find((item) => item.did === myDid());
  const entry = listAccounts().find((item) => item.did === did);
  if (!entry) {
    toast('That account is not saved on this browser.');
    return;
  }
  try {
    await useAccount(entry);
    closeGate();
    location.hash = '#/';
    route();
    toast(`Signed in as @${me.profile?.handle || entry.handle || 'account'}`);
  } catch (error) {
    toast(error.message || 'Could not switch accounts.');
    if (previous && previous.did !== did) {
      try { await useAccount(previous); } catch { /* the previous session stays saved */ }
    }
  }
}

function addAccount() {
  rememberCurrent();
  const error = $('login-error');
  if (error) error.hidden = true;
  const dialog = $('login');
  if (dialog && !dialog.open) dialog.showModal();
  $('login-handle')?.focus();
}

async function removeAccount(did) {
  if (!did) return;
  if (did === myDid()) return signOut();
  const entry = listAccounts().find((item) => item.did === did);
  if (!entry) return;
  const name = entry.handle ? `@${entry.handle}` : 'this account';
  if (!window.confirm(`Remove ${name} from this browser?`)) return;
  if (entry.kind === 'oauth') await revokeOauth(did);
  if (entry.kind === 'password') await api.deletePasswordSession(entry.session);
  forgetAccount(did);
  toast('Account removed');
  if (parseHash()[0] === 'settings') showSettings();
}

async function signOut() {
  const did = myDid();
  const oauthSub = getOauth()?.sub;
  const password = getPassword();
  if (password?.did === did) {
    try { await api.logoutPassword(); } catch { setPassword(null); }
  }
  if (oauthSub && oauthSub === did) {
    setOauth(null);
    await revokeOauth(oauthSub);
  }
  forgetAccount(did);
  me.profile = null;
  const next = listAccounts()[0];
  if (next) {
    try {
      await useAccount(next);
      closeGate();
      location.hash = '#/';
      route();
      toast(`Switched to @${me.profile?.handle || next.handle || 'another account'}`);
      return;
    } catch {
      /* no saved session could be restored */
    }
  }
  setOauth(null);
  setPassword(null);
  updateAccount();
  loadRail();
  $('view').innerHTML = '';
  location.hash = '#/';
  openGate();
}

function onKey(event) {
  if (event.key === 'Escape') closeMenu();
  const typing = ['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName) || document.activeElement?.isContentEditable;
  if (typing || document.querySelector('dialog[open]')) {
    if (event.key === 'Escape') {
      const open = [...document.querySelectorAll('dialog[open]')];
      const dialog = open[open.length - 1];
      if (dialog?.id === 'login' && !signedIn()) return;
      if (dialog?.id === 'call') return;
      dialog?.close();
    }
    return;
  }
  const postsOnPage = () => [...document.querySelectorAll('#view .post.feed-post')];
  if (event.key === 'n') return openComposer();
  if (event.key === '/') {
    event.preventDefault();
    ( $('search-q') || $('rail-q') )?.focus();
    return;
  }
  if (event.key === 'j' || event.key === 'k') {
    const list = postsOnPage();
    if (!list.length) return;
    selected = Math.max(0, Math.min(list.length - 1, selected + (event.key === 'j' ? 1 : -1)));
    list.forEach((post, index) => post.classList.toggle('selected', index === selected));
    list[selected].scrollIntoView({ block: 'nearest' });
  }
  if (event.key === 'Enter') {
    const note = document.activeElement?.closest?.('.note[data-href]');
    if (note) {
      const href = note.getAttribute('data-href');
      if (href) location.hash = href;
      return;
    }
  }
  if (event.key === 'a' && !event.metaKey && !event.ctrlKey && !event.altKey) {
    const article = postsOnPage()[selected];
    if (!article) {
      toast('Press j to select a post, then a to read it.');
      return;
    }
    const found = postFrom(article);
    if (found?.post) speakPost(found);
    return;
  }
  const current = postsOnPage()[selected];
  if (!current) return;
  if (event.key === 'l') current.querySelector('.action.like')?.click();
  if (event.key === 'r') current.querySelector('.action.reply')?.click();
  if (event.key === 't') current.querySelector('.action.repost')?.click();
  if (event.key === 'b') current.querySelector('.action.bookmark')?.click();
  if (event.key === 's') current.querySelector('.action.share')?.click();
  if (event.key === 'Enter') current.querySelector('.time')?.click();
}

function bind() {
  setPrefsError((error) => toast(error?.message || 'Could not save settings to your account'));
  const synth = window.speechSynthesis;
  if (synth) {
    synth.addEventListener?.('voiceschanged', fillVoiceSelect);
    synth.onvoiceschanged = fillVoiceSelect;
  }
  document.body.addEventListener('click', onClick);
  document.addEventListener('pointerdown', () => {
    const ctx = playSound.ctx;
    ctx?.resume?.().catch(() => {});
  }, { once: true });
  document.addEventListener('selectionchange', () => {
    const area = document.activeElement;
    if (area?.id === 'compose-text') paintFieldHighlight(area, $('compose-highlight'));
    else if (area?.id === 'chat-text') paintFieldHighlight(area, $('chat-highlight'));
    else if (area?.id === 'ai-text') paintFieldHighlight(area, $('ai-highlight'));
  });
  document.addEventListener('pointerdown', (event) => {
    const button = event.target.closest?.('#suggest [data-insert]');
    if (!button) return;
    event.preventDefault();
    event.stopPropagation();
    applySuggest(button.dataset.insert || '');
  }, true);
  const loginDownloads = $('login-downloads');
  if (loginDownloads) loginDownloads.innerHTML = downloadsHtml(true);
  document.addEventListener('pointerover', scheduleHover);
  document.addEventListener('pointerout', scheduleHoverHide);
  $('hovercard')?.addEventListener('pointerover', () => clearTimeout(hoverHideTimer));
  $('hovercard')?.addEventListener('pointerout', scheduleHoverHide);
  document.addEventListener('scroll', () => {
    closeHover();
    placeFresh();
  }, true);
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && homeWatch.timer) pollHome(homeWatch.token);
  });
  window.addEventListener('resize', placeFresh);
  $('menu').addEventListener('click', onMenu);
  document.addEventListener('click', (event) => {
    if (!event.target.closest('#menu, [data-act="more"], [data-act="nav-more"], [data-act="repost"], #account-btn, #more-btn')) closeMenu();
    if (!event.target.closest('#suggest, #compose-text, #chat-text, #ai-text')) hideSuggest();
    if (!event.target.closest('#hovercard') && !actorFromLink(event.target)) closeHover();
  });
  document.addEventListener('keydown', onKey);
  $('back').addEventListener('click', () => {
    if (history.length > 1) history.back();
    else location.hash = '#/';
  });
  $('account-btn').addEventListener('click', () => {
    if (!signedIn()) requireSignIn();
    else openMenu($('account-btn'), accountMenuItems());
  });
  $('about-close')?.addEventListener('click', () => $('about')?.close());
  $('legal-close')?.addEventListener('click', () => $('legal')?.close());
  $('call-hangup')?.addEventListener('click', () => hangUp(true));
  $('login-form').addEventListener('submit', (event) => {
    const box = $('app-password-box');
    if (!box.hidden && $('login-password').value) {
      event.preventDefault();
      startPassword();
      return;
    }
    startOAuth(event);
  });
  $('login-app-toggle').addEventListener('click', () => {
    $('app-password-box').hidden = !$('app-password-box').hidden;
  });
  $('login-signup').addEventListener('click', startSignup);
  $('login-password-btn').addEventListener('click', startPassword);
  $('login').addEventListener('cancel', (event) => {
    if (!signedIn()) event.preventDefault();
  });
  $('login').addEventListener('close', () => {
    if (!signedIn()) queueMicrotask(() => { if (!signedIn()) openGate(); });
  });
  $('report-form').addEventListener('submit', submitReport);
  $('report-cancel').addEventListener('click', () => $('report').close());
  $('profile-form').addEventListener('submit', saveProfile);
  $('profile-cancel').addEventListener('click', () => $('profile-edit').close());
  $('profile-banner')?.addEventListener('change', () => {
    const file = $('profile-banner').files?.[0];
    if (!file) return;
    $('profile-edit').dataset.clearBanner = '';
    $('profile-banner-preview').src = URL.createObjectURL(file);
    $('profile-banner-preview').hidden = false;
  });
  $('profile-banner-clear')?.addEventListener('click', () => {
    $('profile-edit').dataset.clearBanner = '1';
    $('profile-banner').value = '';
    $('profile-banner-preview').hidden = true;
    $('profile-banner-preview').removeAttribute('src');
  });
  $('compose-form').addEventListener('submit', publish);
  $('compose-cancel').addEventListener('click', () => $('compose').close());
  $('compose-text').addEventListener('input', () => {
    updateCount();
    const dialog = $('compose');
    if (!dialog.dataset.reply && !dialog.dataset.quote) saveDraft($('compose-text').value);
    scheduleLinkPreview();
  });
  $('compose-text').addEventListener('keydown', onSuggestKey);
  $('compose-text').addEventListener('keyup', () => scheduleSuggest($('compose-text')));
  $('compose-text').addEventListener('click', () => scheduleSuggest($('compose-text')));
  $('compose-text').addEventListener('scroll', () => {
    const pre = $('compose-highlight');
    const area = $('compose-text');
    if (pre) pre.scrollTop = area.scrollTop;
    const box = $('suggest');
    if (box && !box.hidden && suggestArea === area) {
      showSuggest(box, area);
      paintGhost(area);
    }
  });
  $('compose').addEventListener('close', () => {
    hideSuggest();
    closePicker();
    const video = $('compose')._video;
    if (video?.url) URL.revokeObjectURL(video.url);
    $('compose')._video = null;
    $('compose')._attach = null;
    paintAttach();
  });
  $('attach-cancel')?.addEventListener('click', () => $('attach')?.close());
  $('attach-form')?.addEventListener('submit', (event) => event.preventDefault());
  $('attach')?.addEventListener('click', (event) => {
    const kind = event.target.closest('[data-attach-kind]')?.dataset.attachKind;
    if (!kind) return;
    event.preventDefault();
    attachKind = kind;
    paintAttachKinds();
    refreshAttach($('attach-q')?.value || '');
  });
  $('attach-q')?.addEventListener('input', () => {
    clearTimeout(attachTimer);
    attachTimer = setTimeout(() => refreshAttach($('attach-q').value), 250);
  });
  $('compose-picker')?.addEventListener('input', (event) => {
    if (event.target.id === 'post-lang-find') filterLanguageButtons(event.target);
    if (event.target.id === 'emoji-find') paintEmojiList(event.target.value);
  });
  $('compose-picker')?.addEventListener('keydown', (event) => {
    if (event.target.id === 'link-url' && event.key === 'Enter') {
      event.preventDefault();
      addComposerLink();
    }
  });
  $('compose-picker')?.addEventListener('click', (event) => {
    const emoji = event.target.closest('[data-emoji]');
    if (emoji) {
      event.preventDefault();
      insertEmoji(emoji.dataset.emoji || '');
      return;
    }
    const gif = event.target.closest('[data-gif]');
    if (!gif) return;
    event.preventDefault();
    chooseGif({ url: gif.dataset.gif || '', title: gif.dataset.gifTitle || 'GIF', thumb: gif.dataset.gifThumb || '' });
  });
  $('compose-files').addEventListener('change', () => {
    addFiles($('compose-files').files);
    $('compose-files').value = '';
  });
  $('compose-video-file')?.addEventListener('change', () => {
    const file = $('compose-video-file').files?.[0];
    $('compose-video-file').value = '';
    if (file) addVideo(file);
  });
  $('compose-video')?.addEventListener('input', (event) => {
    if (event.target.id === 'video-alt' && $('compose')._video) $('compose')._video.alt = event.target.value;
  });
  $('compose-previews').addEventListener('input', (event) => {
    const index = event.target.dataset.alt;
    if (index == null || !$('compose')._files?.[index]) return;
    $('compose')._files[index].alt = event.target.value;
  });
  $('rail-search').addEventListener('submit', (event) => {
    event.preventDefault();
    const q = $('rail-q').value.trim();
    if (q) location.hash = `#/search/${encodeURIComponent(q)}`;
  });
  $('view').addEventListener('submit', (event) => {
    if (event.target.id === 'search-form') {
      event.preventDefault();
      const q = $('search-q').value.trim();
      location.hash = q ? `#/search/${encodeURIComponent(q)}` : '#/search';
    }
    if (event.target.id === 'chat-form') {
      event.preventDefault();
      const input = $('chat-text');
      const text = input.value.trim();
      const id = parseHash()[1];
      if (!text || !id || input.disabled) return;
      if (aiTag(text)) {
        askInChat(input, text);
        return;
      }
      input.disabled = true;
      deliverChat(id, text).then(() => {
        input.value = '';
        paintFieldHighlight(input, $('chat-highlight'));
        fitChatInput(input);
      }).catch((error) => toast(error.message)).finally(() => {
        if (input.isConnected) {
          input.disabled = false;
          input.focus();
        }
      });
    }
    if (event.target.id === 'ai-ask') {
      event.preventDefault();
      const input = $('ai-text');
      const text = input?.value.trim();
      if (!text || input.disabled) return;
      askOnPage(text);
    }
    if (event.target.id === 'ai-form') saveAiForm(event);
    if (event.target.id === 'pack-form') {
      event.preventDefault();
      const q = $('pack-q')?.value.trim();
      const box = $('pack-results');
      if (!q || !box) return;
      box.innerHTML = skeletons(3);
      api.searchStarterPacks(q).then((data) => {
        const rows = packList(data.starterPacks);
        box.innerHTML = rows ? `<div class="packs">${rows}</div>` : emptyHtml('No starter packs', 'Nothing matched that search.');
      }).catch((error) => { box.innerHTML = emptyHtml('Search failed', error.message); });
    }
    if (event.target.id === 'call-start') {
      event.preventDefault();
      const media = event.submitter?.dataset?.media === 'video' ? 'video' : 'audio';
      startCallToHandle(media);
    }
    if (event.target.id === 'list-add') {
      event.preventDefault();
      const input = $('list-add-handle');
      const handle = input?.value.trim().replace(/^@/, '');
      const uri = event.target.dataset.list;
      if (!handle || !uri) return;
      input.disabled = true;
      api.resolveHandle(handle).then((did) => api.addListMember(uri, did)).then(() => {
        toast(`Added @${handle}`);
        route();
      }).catch((error) => toast(error.message)).finally(() => { if (input.isConnected) input.disabled = false; });
    }
    if (event.target.id === 'thread-reply') {
      event.preventDefault();
      const uri = event.target.dataset.uri;
      const item = posts.get(uri);
      if (item?.post) openComposer({ reply: item.post });
    }
    if (event.target.id === 'mute-form') {
      event.preventDefault();
      const word = $('mute-input').value.trim();
      if (!word) return;
      const list = [...new Set([...mutedWords(), word])];
      syncMutedWords(list);
      showSettings();
    }
    if (event.target.id === 'app-pass-form') {
      event.preventDefault();
      submitAppPassword();
    }
  });
  $('view').addEventListener('keyup', (event) => {
    if (event.target.id === 'chat-text' || event.target.id === 'ai-text') scheduleSuggest(event.target);
  });
  $('view').addEventListener('click', (event) => {
    if (event.target.id === 'chat-text' || event.target.id === 'ai-text') scheduleSuggest(event.target);
  });
  $('view').addEventListener('change', (event) => {
    if (event.target.id === 'ai-provider') syncAiFields();
    if (event.target.id === 'voice-pick') saveVoicePrefs({ voiceURI: event.target.value || '' });
    if (event.target.dataset?.volume) playSound(event.target.dataset.volume, { preview: true });
    const pref = event.target?.dataset?.pref;
    if (pref) onPrefToggle(pref, event.target.checked);
  });
  document.addEventListener('change', (event) => {
    if (event.target?.closest?.('#tune') && event.target.dataset?.pref) onPrefToggle(event.target.dataset.pref, event.target.checked);
    if (event.target?.id === 'voice-pick' && event.target.closest('#tune')) saveVoicePrefs({ voiceURI: event.target.value || '' });
  });
  $('tune')?.addEventListener('click', (event) => {
    const sort = event.target.closest('[data-sort]')?.dataset.sort;
    if (sort === 'latest' || sort === 'top') chooseSearchSort(sort);
    const threadSort = event.target.closest('[data-thread-sort]')?.dataset.threadSort;
    if (threadSort) chooseThreadSort(threadSort);
  });
  $('tune-close')?.addEventListener('click', () => $('tune')?.close());
  $('view').addEventListener('keydown', (event) => {
    if (event.target.id !== 'chat-text' && event.target.id !== 'ai-text') return;
    if (onSuggestKey(event)) return;
    if (event.key !== 'Enter' || event.shiftKey || event.isComposing || event.keyCode === 229) return;
    if (matchMedia('(pointer: coarse)').matches) return;
    event.preventDefault();
    if (!event.target.disabled) event.target.form?.requestSubmit();
  });
  $('view').addEventListener('input', (event) => {
    if (event.target.id === 'ai-model') {
      event.target.dataset.auto = '0';
      return;
    }
    if (event.target.id === 'lang-find') {
      filterLanguageButtons(event.target);
      return;
    }
    if (event.target.id === 'emoji-find') {
      paintEmojiList(event.target.value);
      return;
    }
    const volumeKey = event.target.dataset?.volume;
    if (volumeKey === 'chat' || volumeKey === 'notifications' || volumeKey === 'posts') {
      const value = Number(event.target.value);
      setSoundPrefs({ volume: { [volumeKey]: value } });
      syncClientPrefs();
      const label = event.target.closest('.vol')?.querySelector('b');
      if (label) label.textContent = `${Math.round(value)}%`;
      return;
    }
    if (event.target.id === 'voice-volume' || event.target.id === 'voice-rate') {
      const value = Number(event.target.value);
      saveVoicePrefs(event.target.id === 'voice-volume' ? { volume: value } : { rate: value });
      const label = event.target.closest('.vol')?.querySelector('b');
      if (label) label.textContent = `${Math.round(value)}%`;
    }
    if (event.target.id !== 'chat-text' && event.target.id !== 'ai-text') return;
    fitChatInput(event.target);
    paintFieldHighlight(event.target, event.target.id === 'chat-text' ? $('chat-highlight') : $('ai-highlight'));
    scheduleSuggest(event.target);
  });
  $('view').addEventListener('scroll', (event) => {
    if (event.target.id !== 'chat-text' && event.target.id !== 'ai-text') return;
    paintFieldHighlight(event.target, event.target.id === 'chat-text' ? $('chat-highlight') : $('ai-highlight'));
    const box = $('suggest');
    if (box && !box.hidden && suggestArea === event.target) {
      showSuggest(box, event.target);
      paintGhost(event.target);
    }
  }, true);
  $('manage-form').addEventListener('submit', saveManage);
  $('manage-cancel').addEventListener('click', () => $('manage').close());
  $('view').addEventListener('click', (event) => {
    const theme = event.target.dataset?.themeSet;
    if (theme) {
      applyTheme(theme);
      event.target.closest('.segmented')?.querySelectorAll('[data-theme-set]').forEach((button) => {
        button.setAttribute('aria-pressed', button.dataset.themeSet === theme ? 'true' : 'false');
      });
    }
    const soundButton = event.target.closest('[data-sound]');
    if (soundButton?.dataset.sound === 'chat' || soundButton?.dataset.sound === 'notifications' || soundButton?.dataset.sound === 'posts') {
      const key = soundButton.dataset.sound;
      const next = !soundPrefs()[key];
      setSoundPrefs({ [key]: next });
      syncClientPrefs();
      soundButton.setAttribute('aria-pressed', next ? 'true' : 'false');
      soundButton.textContent = next ? 'On' : 'Off';
      if (next) playSound(key);
    }
    const threadSort = event.target.closest('[data-thread-sort]')?.dataset.threadSort;
    if (threadSort) chooseThreadSort(threadSort);
    const word = event.target.dataset?.unmute;
    if (word) {
      syncMutedWords(mutedWords().filter((item) => item !== word));
      showSettings();
    }
    const sort = event.target.closest('[data-sort]')?.dataset.sort;
    if (sort === 'latest' || sort === 'top') chooseSearchSort(sort);
    const explore = event.target.closest('[data-explore]')?.dataset.explore;
    if (explore && EXPLORE_TABS.some((tab) => tab.id === explore)) {
      exploreTab = explore;
      const draft = $('search-q')?.value || '';
      showSearch('', { focus: false });
      if (draft && $('search-q')) $('search-q').value = draft;
    }
  });
  $('lightbox-close').addEventListener('click', () => $('lightbox').close());
  $('lightbox-prev').addEventListener('click', () => {
    lightbox.index = (lightbox.index + lightbox.images.length - 1) % lightbox.images.length;
    paintLightbox();
  });
  $('lightbox-next').addEventListener('click', () => {
    lightbox.index = (lightbox.index + 1) % lightbox.images.length;
    paintLightbox();
  });
  document.querySelectorAll('dialog').forEach((dialog) => {
    dialog.addEventListener('click', (event) => {
      if (event.target !== dialog) return;
      if (dialog.id === 'login' && !signedIn()) return;
      if (dialog.id === 'call') return;
      dialog.close();
    });
  });
  window.addEventListener('scroll', (event) => {
    const target = event.target;
    if (target?.id === 'suggest' || target?.id === 'chat-text' || target?.id === 'compose-text' || target?.id === 'ai-text') return;
    hideSuggest();
  }, true);
  bindTips();
  window.addEventListener('hashchange', route);
  document.querySelectorAll('[data-nav]').forEach((link) => {
    link.addEventListener('click', () => {
      const href = link.getAttribute('href');
      if (href === location.hash || (href === '#/' && (!location.hash || location.hash === '#/'))) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        route();
      }
    });
  });
}

const TIP_SELECTOR = 'button, a.nav-link, a.tip, .tabbar a, label.icon-btn';

function tipLabel(node) {
  if (!node || node.disabled || node.getAttribute('aria-disabled') === 'true') return '';
  const explicit = node.dataset.tip || '';
  if (explicit) return explicit;
  const label = node.getAttribute('aria-label') || '';
  if (!label) return '';
  const visible = (node.innerText || '').replace(/\s+/g, ' ').trim();
  if (visible && visible.toLowerCase().includes(label.toLowerCase())) return '';
  return label;
}

function hideTip() {
  clearTimeout(tipTimer);
  const tip = $('float-tip');
  if (!tip) return;
  if (typeof tip.hidePopover === 'function' && tip.matches(':popover-open')) {
    try { tip.hidePopover(); } catch { /* already closed */ }
  }
  tip.hidden = true;
}

function placeTip(node, text) {
  const tip = $('float-tip');
  if (!tip) return;
  tip.textContent = text;
  tip.hidden = false;
  if (typeof tip.showPopover === 'function') {
    try {
      if (!tip.matches(':popover-open')) tip.showPopover();
    } catch { /* the tip stays in the page */ }
  }
  const rect = node.getBoundingClientRect();
  const width = tip.offsetWidth || 80;
  const height = tip.offsetHeight || 28;
  const nearBottom = rect.bottom > window.innerHeight - 72;
  let left;
  let top;
  if (nearBottom) {
    left = rect.left + (rect.width / 2) - (width / 2);
    top = rect.top - height - 8;
  } else if (rect.left < 300) {
    left = rect.right + 10;
    top = rect.top + (rect.height / 2) - (height / 2);
  } else {
    left = rect.left + (rect.width / 2) - (width / 2);
    top = rect.bottom + 8;
  }
  left = Math.max(8, Math.min(left, window.innerWidth - width - 8));
  top = Math.max(8, Math.min(top, window.innerHeight - height - 8));
  tip.style.left = `${left}px`;
  tip.style.top = `${top}px`;
}

function bindTips() {
  let current = null;
  const show = (node, immediate) => {
    const text = tipLabel(node);
    if (!text) {
      if (current === node) hideTip();
      return;
    }
    current = node;
    clearTimeout(tipTimer);
    if (immediate) placeTip(node, text);
    else tipTimer = setTimeout(() => { if (current === node) placeTip(node, text); }, 280);
  };
  document.addEventListener('pointerover', (event) => {
    const node = event.target.closest?.(TIP_SELECTOR);
    if (!node || node === current) return;
    show(node, false);
  });
  document.addEventListener('pointerout', (event) => {
    const node = event.target.closest?.(TIP_SELECTOR);
    if (!node) return;
    const next = event.relatedTarget?.closest?.(TIP_SELECTOR);
    if (next === node) return;
    if (current === node) {
      current = null;
      hideTip();
    }
  });
  document.addEventListener('focusin', (event) => {
    const node = event.target.closest?.(TIP_SELECTOR);
    if (node) show(node, true);
  });
  document.addEventListener('focusout', () => {
    current = null;
    hideTip();
  });
  document.addEventListener('pointerdown', () => {
    current = null;
    hideTip();
  });
  window.addEventListener('scroll', () => {
    current = null;
    hideTip();
  }, true);
}

async function revokeOauth(did) {
  if (!did || !client) return;
  const key = '@@atproto/oauth-client-browser(sub)';
  const marked = localStorage.getItem(key);
  await client.revoke(did).catch(() => {});
  if (marked && marked !== did) localStorage.setItem(key, marked);
}

async function submitAppPassword() {
  if (!signedIn()) return requireSignIn();
  const input = $('app-pass-name');
  const name = input?.value.trim() || '';
  if (!name) return;
  try {
    const created = await api.createAppPassword(name);
    const password = created?.password || created?.appPassword || '';
    const box = $('app-pass-reveal');
    if (box) {
      box.hidden = false;
      box.innerHTML = `<p><strong>${escapeHtml(created?.name || name)}</strong></p><p class="token">${escapeHtml(password)}</p><button type="button" class="primary small" data-act="copy-token" data-token="${escapeHtml(password)}">Copy</button><p class="dim">Copy it now. LibreSky does not keep this password.</p>`;
    }
    if (input) input.value = '';
    toast('App password created');
    await loadAppPasswords();
  } catch (error) {
    const box = $('app-pass-reveal');
    if (box) {
      box.hidden = false;
      box.innerHTML = `<p class="dim">${escapeHtml(error.message || 'Could not create an app password.')} Create one at <a href="https://bsky.app/settings/app-passwords" target="_blank" rel="noopener noreferrer">Bluesky app passwords</a>.</p>`;
    }
    toast(error.message || 'Could not create an app password.');
  }
}

async function settleSession(result) {
  const fresh = Boolean(result && Object.prototype.hasOwnProperty.call(result, 'state'));
  keepPasswordCopy();
  if (fresh && result.session) {
    setOauth(result.session);
    setPassword(null);
    setActiveDid(result.session.sub);
    return;
  }
  const entry = listAccounts().find((item) => item.did === activeDid());
  if (entry?.kind === 'password' && entry.session?.accessJwt) {
    setOauth(null);
    setPassword(entry.session);
    try {
      const ok = await api.ensurePasswordSession();
      if (!ok) throw new Error('expired');
      setActiveDid(entry.did);
      return;
    } catch {
      forgetAccount(entry.did);
      setPassword(null);
    }
  } else if (entry?.kind === 'oauth' && client) {
    try {
      const session = await client.restore(entry.did);
      setPassword(null);
      setOauth(session);
      setActiveDid(entry.did);
      return;
    } catch {
      /* the saved Bluesky login could not be restored */
    }
  }
  if (result?.session) {
    keepPasswordCopy();
    setOauth(result.session);
    setPassword(null);
    setActiveDid(result.session.sub);
    return;
  }
  if (getPassword()?.accessJwt) {
    setOauth(null);
    try {
      const ok = await api.ensurePasswordSession();
      if (!ok) setPassword(null);
      else setActiveDid(getPassword().did);
    } catch {
      setPassword(null);
    }
  }
}

async function boot() {
  setupCall({ toast });
  bind();
  loadPassword();
  let result = null;
  try {
    const mod = await import('./vendor/auth.js');
    client = mod.createClient();
    client.addEventListener?.('deleted', (event) => {
      const sub = event?.detail?.sub || event?.sub || '';
      const current = getOauth()?.sub || '';
      if (!current || (sub && sub !== current)) return;
      setOauth(null);
      forgetAccount(current);
      const next = listAccounts()[0];
      if (next) {
        useAccount(next).then(() => {
          closeGate();
          route();
          toast('Your Bluesky session ended. Switched accounts.');
        }).catch(() => {
          me.profile = null;
          updateAccount();
          openGate();
        });
        return;
      }
      me.profile = null;
      updateAccount();
      toast('Your Bluesky session ended. Sign in again.');
      openGate();
    });
    result = await client.init();
  } catch (error) {
    oauthReady = error?.message || 'Sign in with Bluesky needs the published site, or http://127.0.0.1.';
  }
  try {
    await settleSession(result);
  } catch {
    /* a saved session can still be opened on the next visit */
  }
  await loadMe();
  clearBoot();
  if (!signedIn()) openGate();
  else closeGate();
  if (signedIn() || parseHash()[0] === 'downloads') route();
  document.getElementById('boot-error')?.remove();
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') refreshBadge();
  });
  setInterval(() => { if (document.visibilityState === 'visible') refreshBadge(); }, 15000);
}

boot().catch((error) => {
  clearBoot();
  const view = $('view');
  if (view) view.innerHTML = emptyHtml('LibreSky could not start', error.message || String(error));
});
