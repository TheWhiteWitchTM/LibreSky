import * as api from './api.js';
import { acceptCall, canCall, declineCall, hangUp, incomingCall, isInCall, setupCall, startCall } from './call.js';
import {
  accountIcon,
  actorHtml,
  avatar,
  callBannerHtml,
  callRequestHtml,
  collectionCardHtml,
  callConvoHtml,
  callStartHtml,
  chatHeaderHtml,
  hoverCardHtml,
  convoHtml,
  joinRequestHtml,
  requestEntryHtml,
  requestPeople,
  drainPosts,
  emptyHtml,
  feedHtml,
  linkPreviewHtml,
  assistantHtml,
  messageHtml,
  notificationsHtml,
  notificationSubjects,
  packHtml,
  postHtml,
  profileHtml,
  collectionKind,
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
import { AI_PROVIDERS, AI_SYSTEM, AI_TIMEOUT_MS, aiLog, aiReady, askAi, clearAiLog, draftRewriteMessages, fitDraft, loadAi, prepareAi, providerById, resolveAi, subscribeAiLog } from './ai.js';
import { accountGone, aiTag, applyShortLinks, caretToken, caretWord, convoIsRequest, convoUnread, escapeHtml, followCleanupMatch, followSpam, forceStyles, fullCount, graphemeLength, hostOf, messageSender, messagesForConvo, ownUnread, parseCallMessage, parseHash, partitionConvos, profileHash, replyTargets, richText, shouldFollowBack, styleFlags, tagFromQuery, timeAgo, toShortUrl, toggleStyle, trailingUrl, trimLink, withoutTrailingUrl } from './util.js';
import { LANGUAGES, languagePrefs, postInLanguages, saveLanguagePrefs } from './lang.js';
import { completeWord, rememberWords, typoWords } from './words.js';
import { icon } from './icons.js';
import { emojiGroups } from './emoji.js';
import {
  a11yPrefs,
  callAllow,
  callIsRequest,
  callMayRing,
  feedView,
  homeAllows,
  commitAiAccount,
  pullAccountPrefs,
  saveA11yPrefs,
  dropFollowHold,
  followBackToday,
  followDeskPrefs,
  followHoldSet,
  holdFollowTargets,
  noteFollowBack,
  releaseFollowHold,
  saveCallAllow,
  saveFeedView,
  saveFollowDeskPrefs,
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
const convoById = new Map();

function rememberConvos(rows) {
  (rows || []).forEach((row) => {
    if (row?.id) convoById.set(row.id, row);
  });
}
let suggestTimer = 0;
let suggestSeq = 0;
let suggestArea = null;
let tipTimer = 0;
let pickerMode = '';
let pickerHost = 'compose';
const collapsedEmoji = new Set();
const styleHold = new Map();
let gifSeq = 0;
let gifTimer = 0;
let hoverTimer = 0;
let hoverHideTimer = 0;
let hoverSeq = 0;
let hoverActor = '';
let hoverWait = '';
let hoverWaitLink = null;
const hoverProfiles = new Map();
let homeLanes = [];
let homeLanesDid = '';
let lanesAt = 0;
let laneDraft = null;
let shownProfile = null;
let profileLinkViews = [];
let profileFeatured = new Set();
let profileTab = { actor: '', tab: 'posts' };
const navStack = [];
let dictateRec = null;
const LANE_CAP = 20;
const CHEVRON_LEFT = '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="M14.5 5.5 8 12l6.5 6.5"/></svg>';
const CHEVRON_RIGHT = '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="M9.5 5.5 16 12l-6.5 6.5"/></svg>';
const CHEVRON_UP = '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="M6 14.5 12 8l6 6.5"/></svg>';
const CHEVRON_DOWN = '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="M6 9.5 12 16l6-6.5"/></svg>';

function $(id) { return document.getElementById(id); }

function toast(message) {
  const node = document.createElement('div');
  node.className = 'toast';
  node.textContent = message;
  $('toasts').append(node);
  setTimeout(() => node.remove(), 3400);
}

let postedTimer = 0;

function showPosted(message) {
  const bar = $('posted-bar');
  if (!bar) return;
  bar.textContent = message;
  bar.hidden = false;
  bar.classList.remove('is-on');
  void bar.offsetWidth;
  bar.classList.add('is-on');
  clearTimeout(postedTimer);
  postedTimer = setTimeout(() => {
    bar.hidden = true;
    bar.classList.remove('is-on');
  }, 6000);
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

const THEMES = ['light', 'dark', 'contrast-light', 'contrast-dark'];

function applyTheme(theme, options = {}) {
  const next = THEMES.includes(theme) ? theme : 'light';
  document.documentElement.dataset.theme = next;
  localStorage.setItem('libresky.theme', next);
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.content = next === 'dark' || next === 'contrast-dark' ? '#000000' : '#ffffff';
  if (!options.quiet) syncClientPrefs();
}

function applyA11y(prefs = a11yPrefs()) {
  const scale = Math.max(100, Math.min(200, Math.round(Number(prefs.scale) || 100)));
  document.documentElement.style.setProperty('--post-scale', String(scale / 100));
  if (prefs.reader) document.documentElement.dataset.reader = 'on';
  else delete document.documentElement.dataset.reader;
}

const MORE_NAV = new Set(['feeds', 'feed', 'lists', 'list', 'packs', 'pack']);

function syncStrip(scroller) {
  const strip = scroller?.closest?.('.tab-strip');
  if (!strip || !scroller) return;
  const max = scroller.scrollWidth - scroller.clientWidth;
  const left = scroller.scrollLeft > 6;
  const right = max - scroller.scrollLeft > 6;
  const prev = strip.querySelector('.tab-arrow.prev');
  const next = strip.querySelector('.tab-arrow.next');
  if (prev) prev.hidden = !left;
  if (next) next.hidden = !right;
  strip.classList.toggle('has-prev', left);
  strip.classList.toggle('has-next', right);
}

const stripObserver = typeof ResizeObserver === 'function'
  ? new ResizeObserver((entries) => entries.forEach((entry) => syncStrip(entry.target)))
  : null;

function forgetStrips(root) {
  if (!stripObserver || !root) return;
  root.querySelectorAll('.tab-scroller').forEach((node) => stripObserver.unobserve(node));
}

function alignStrip(scroller) {
  const selected = scroller.querySelector('[aria-selected="true"]');
  if (!selected) return;
  const left = selected.offsetLeft;
  const right = left + selected.offsetWidth;
  const viewRight = scroller.scrollLeft + scroller.clientWidth;
  if (left < scroller.scrollLeft + 40) scroller.scrollLeft = Math.max(0, left - 44);
  else if (right > viewRight - 48) scroller.scrollLeft = right - scroller.clientWidth + 56;
}

function watchStrips(root) {
  if (!root) return;
  root.querySelectorAll('.tab-scroller').forEach((scroller) => {
    if (scroller.dataset.watched) return;
    scroller.dataset.watched = '1';
    scroller.addEventListener('scroll', () => syncStrip(scroller), { passive: true });
    stripObserver?.observe(scroller);
    alignStrip(scroller);
    requestAnimationFrame(() => syncStrip(scroller));
  });
}

function tabStrip(tabs, { menuAct = '', menuLabel = 'More', sticky = false } = {}) {
  const links = tabs.map((tab) => `<a role="tab" href="${escapeHtml(tab.href)}" aria-selected="${tab.on ? 'true' : 'false'}">${escapeHtml(tab.label)}</a>`).join('');
  const menu = menuAct
    ? `<button type="button" class="tab-menu" data-act="${escapeHtml(menuAct)}" aria-label="${escapeHtml(menuLabel)}">${icon('more')}</button>`
    : '';
  return `<div class="tab-strip${sticky ? ' profile-tabs' : ''}${menuAct ? ' has-menu' : ''}">
    <button type="button" class="tab-arrow prev" data-act="tab-scroll" data-dir="-1" aria-label="Scroll tabs left" hidden>${CHEVRON_LEFT}</button>
    <div class="tab-scroller" role="tablist">${links}</div>
    <button type="button" class="tab-arrow next" data-act="tab-scroll" data-dir="1" aria-label="Scroll tabs right" hidden>${CHEVRON_RIGHT}</button>
    ${menu}
  </div>`;
}

function paintPageIcon(nav) {
  const slot = $('page-icon');
  if (!slot) return;
  const key = MORE_NAV.has(nav) ? 'more' : nav;
  const source = document.querySelector(`[data-nav="${CSS.escape(key)}"] .ico`);
  if (source) slot.replaceChildren(source.cloneNode(true));
  else slot.replaceChildren();
}

function measureHead() {
  const top = document.querySelector('.app-top');
  const head = document.querySelector('.sticky-head');
  if (top) document.documentElement.style.setProperty('--top-h', `${Math.ceil(top.getBoundingClientRect().height)}px`);
  if (head) document.documentElement.style.setProperty('--head-h', `${Math.ceil(head.getBoundingClientRect().height)}px`);
}

function setChrome({ title, back = true, tabs = [], nav = '', menuAct = '', menuLabel = 'More' }) {
  $('title').textContent = title;
  $('back').hidden = !back;
  const bar = $('tabs');
  forgetStrips(bar);
  if (!tabs.length) {
    bar.hidden = true;
    bar.innerHTML = '';
  } else {
    bar.hidden = false;
    bar.innerHTML = tabStrip(tabs, { menuAct, menuLabel });
    watchStrips(bar);
  }
  const current = MORE_NAV.has(nav) ? 'more' : nav;
  paintPageIcon(nav);
  document.querySelectorAll('[data-nav]').forEach((link) => {
    const on = link.dataset.nav === current;
    link.classList.toggle('active', on);
    if (on) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
  document.title = title === 'Home' || title === 'Discover' ? 'LibreSky' : `${title} — LibreSky`;
  measureHead();
  requestAnimationFrame(measureHead);
}

function showSkeletons() {
  resetPosts();
  forgetStrips($('view'));
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

let browsing = false;

function rememberBrowse() {
  browsing = true;
  try { sessionStorage.setItem('libresky.browse', '1'); } catch { /* this visit can still close the sign-in screen */ }
}

function startBrowse() {
  rememberBrowse();
  document.documentElement.removeAttribute('data-signed-out');
  if ($('login')?.open) $('login').close();
  if (parseHash()[0]) location.hash = '#/';
  else if (!$('view')?.querySelector('.post, .empty, .prompt')) route();
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

function offerSignIn() {
  if (signedIn() || browsing) return false;
  const [page] = parseHash();
  if (!page) return true;
  return ['notifications', 'messages', 'bookmarks', 'calls', 'settings'].includes(page);
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
  document.querySelectorAll('a[data-nav="profile"]').forEach((nav) => { nav.href = href; });
}

async function loadMe() {
  const did = myDid();
  if (did !== homeLanesDid) {
    homeLanes = [];
    homeLanesDid = '';
    lanesAt = 0;
  }
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
    applyA11y(a11yPrefs());
  } catch {
    /* this browser keeps the last saved settings */
  }
  updateAccount();
  rememberCurrent();
  refreshBadge();
  loadRail();
  if (did && followDeskPrefs().auto) {
    const owner = did;
    setTimeout(() => { if (myDid() === owner) runFollowBack(false); }, 5000);
  }
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

const followCache = new Map();

async function rememberFollows(dids) {
  const missing = [...new Set(dids)].filter((did) => did && !followCache.has(did));
  await Promise.all(missing.map(async (did) => {
    try {
      const profile = await api.getProfile(did);
      followCache.set(did, Boolean(profile?.viewer?.following));
    } catch {
      followCache.set(did, false);
    }
  }));
}

function peerFollowed(member) {
  if (!member?.did) return false;
  if (member.viewer && Object.prototype.hasOwnProperty.call(member.viewer, 'following')) {
    const yes = Boolean(member.viewer.following);
    followCache.set(member.did, yes);
    return yes;
  }
  return Boolean(followCache.get(member.did));
}

function callFacts(convo, member) {
  return {
    allow: callAllow(),
    followed: peerFollowed(member),
    accepted: convo?.status !== 'request',
  };
}

async function classifyCalls(convos) {
  const mine = myDid();
  const rows = [];
  const need = [];
  (convos || []).forEach((convo) => {
    const other = (convo.members || []).find((member) => member?.did && member.did !== mine);
    if (!other?.did || !convo.id) return;
    const offer = incomingCall(convo.lastMessage ? [convo.lastMessage] : [], mine, other.did);
    if (!offer?.rkey) return;
    const key = `${convo.id}:${offer.rkey}`;
    if (ignoredRings.has(key)) return;
    const known = other.viewer && Object.prototype.hasOwnProperty.call(other.viewer, 'following');
    if (!known && !followCache.has(other.did) && callAllow() !== 'none') need.push(other.did);
    rows.push({ convo, other, offer, key });
  });
  if (need.length) await rememberFollows(need);
  let ring = null;
  const requests = [];
  rows.forEach(({ convo, other, offer, key }) => {
    const facts = callFacts(convo, other);
    const row = {
      ...offer,
      convoId: convo.id,
      peerDid: other.did,
      name: other.displayName || (other.handle ? `@${other.handle}` : 'Someone'),
      avatar: other.avatar || '',
      key,
    };
    if (callMayRing(facts)) {
      if (!ring) ring = row;
      return;
    }
    if (callIsRequest(facts)) requests.push(row);
  });
  return { ring, requests };
}

async function listRequestItems() {
  const items = [];
  let cursor;
  for (let page = 0; page < 5; page += 1) {
    const data = await api.listConvoRequests(cursor);
    (data?.requests || data?.convos || []).forEach((item) => items.push(item));
    if (!data?.cursor || data.cursor === cursor) break;
    cursor = data.cursor;
  }
  return items;
}

async function laterAcceptedRequests(first) {
  const found = [];
  let cursor = first?.cursor || '';
  for (let page = 0; page < 3 && cursor; page += 1) {
    const data = await api.listConvos(cursor, undefined, 'accepted').catch(() => null);
    if (!data) break;
    (data.convos || []).forEach((row) => {
      if (String(row?.status || '').toLowerCase() === 'request') found.push(row);
    });
    if (!data.cursor || data.cursor === cursor) break;
    cursor = data.cursor;
  }
  return found;
}

async function requestIdsFromLog() {
  const data = await api.getChatLog().catch(() => null);
  const logs = data?.logs || [];
  const ids = [];
  const seen = new Set();
  logs.forEach((event) => {
    const id = event?.convoId || event?.convo?.id;
    if (!id || seen.has(id)) return;
    seen.add(id);
    ids.push(id);
  });
  return ids;
}

async function fillMissingRequests(parts, reported, accepted) {
  let listed = parts.requests.length + parts.joins.length;
  if (reported <= listed) return parts;
  if (accepted?.cursor) {
    const extra = await laterAcceptedRequests(accepted);
    const seen = new Set(parts.requests.map((row) => row.id));
    extra.forEach((row) => {
      if (!row?.id || seen.has(row.id)) return;
      seen.add(row.id);
      parts.requests.push({ ...row, status: 'request' });
      parts.main = parts.main.filter((item) => item.id !== row.id);
    });
  }
  listed = parts.requests.length + parts.joins.length;
  if (reported <= listed) return parts;
  const known = new Set([...parts.requests, ...parts.main].map((row) => row.id));
  const ids = (await requestIdsFromLog()).filter((id) => !known.has(id)).slice(0, 10);
  const views = await Promise.all(ids.map((id) => api.getConvoView(id).catch(() => null)));
  views.forEach((wrap) => {
    const convo = wrap?.convo;
    if (!convo?.id || known.has(convo.id)) return;
    if (!convoIsRequest(convo)) return;
    known.add(convo.id);
    parts.requests.push({ ...convo, status: 'request' });
    parts.main = parts.main.filter((item) => item.id !== convo.id);
  });
  return parts;
}

async function loadConvoPages() {
  const [accepted, legacy, fresh, unread] = await Promise.all([
    api.listConvos(undefined, undefined, 'accepted').catch(() => null),
    api.listConvos(undefined, undefined, 'request').catch(() => null),
    listRequestItems().catch(() => null),
    api.getChatUnreadCounts().catch(() => null),
  ]);
  const reported = Number(unread?.unreadRequestConvos) || 0;
  if (!accepted && !legacy && !fresh) {
    const all = await api.listConvos().catch(() => ({ convos: [] }));
    const parts = partitionConvos({ accepted: all, legacyRequests: null, requestItems: null });
    rememberConvos(parts.main);
    rememberConvos(parts.requests);
    return { ...parts, reported };
  }
  let parts = partitionConvos({ accepted, legacyRequests: legacy, requestItems: fresh });
  const listed = parts.requests.length + parts.joins.length;
  if (reported > listed) parts = await fillMissingRequests(parts, reported, accepted);
  rememberConvos(parts.main);
  rememberConvos(parts.requests);
  return { ...parts, reported };
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
    const { main, requests, reported } = await loadConvoPages();
    const convos = [...main, ...requests];
    const mine = myDid();
    const requestUnread = requests.reduce((sum, convo) => sum + convoUnread(convo, mine), 0);
    const count = main.reduce((sum, convo) => sum + convoUnread(convo, mine), 0) + Math.max(requestUnread, Number(reported) || 0);
    paintBadge('chat-badge', count);
    const { ring: offer } = await classifyCalls(convos);
    paintIncomingBar(offer);
    const ring = offer?.key || '';
    if (ring && ring !== badgeMemory.ring) playSound('call');
    else if (badgeMemory.chat !== null && count > badgeMemory.chat) playSound('chat');
    badgeMemory.chat = count;
    badgeMemory.ring = ring;
    main.forEach((convo) => {
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
    card.innerHTML = `${trends}<section class="panel"><h2>LibreSky</h2><p>Edit, AI, voice, video, and chat. Sign in with your Bluesky account.</p><button type="button" class="primary" data-act="signin">Sign in</button></section>`;
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

const FRESH_POLL_MS = 90000;
const FRESH_PILL_MS = 12000;
const homeWatch = { timer: 0, token: 0, uris: new Set(), pending: [], collapsed: false, collapseTimer: 0, checked: 0 };

function stopHomeWatch() {
  clearInterval(homeWatch.timer);
  clearTimeout(homeWatch.collapseTimer);
  homeWatch.timer = 0;
  homeWatch.collapseTimer = 0;
  homeWatch.token = 0;
  homeWatch.pending = [];
  homeWatch.collapsed = false;
  hideFresh();
  document.querySelector('#view .fresh-update')?.remove();
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
  pill.style.top = `${Math.max(8, below - 18)}px`;
}

function hideFresh() {
  const pill = $('fresh');
  if (!pill) return;
  pill.hidden = true;
  pill.innerHTML = '';
}

function paintFreshLink() {
  const view = $('view');
  if (!view) return;
  let link = view.querySelector('.fresh-update');
  const count = homeWatch.pending.length;
  if (!count || parseHash()[0]) {
    link?.remove();
    return;
  }
  if (!link) {
    link = document.createElement('button');
    link.type = 'button';
    link.className = 'fresh-update';
    link.dataset.act = 'fresh-update';
  }
  const field = view.querySelector('.ai-inline');
  const lead = view.querySelector('.home-lead');
  if (field) field.insertAdjacentElement('afterend', link);
  else if (lead) lead.append(link);
  else view.prepend(link);
  if (link.textContent !== 'Updated') link.textContent = 'Updated';
  link.setAttribute('aria-label', count === 1 ? 'Updated, 1 new post' : `Updated, ${count} new posts`);
}

function revealFresh() {
  homeWatch.collapsed = false;
  clearTimeout(homeWatch.collapseTimer);
  homeWatch.collapseTimer = setTimeout(() => {
    if (!homeWatch.pending.length) return;
    homeWatch.collapsed = true;
    paintFresh();
  }, FRESH_PILL_MS);
}

function paintFresh() {
  const pill = $('fresh');
  if (!pill) return;
  const items = homeWatch.pending;
  if (!items.length || parseHash()[0]) {
    hideFresh();
    document.querySelector('#view .fresh-update')?.remove();
    return;
  }
  if (homeWatch.collapsed) {
    hideFresh();
    paintFreshLink();
    return;
  }
  document.querySelector('#view .fresh-update')?.remove();
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
  clearTimeout(homeWatch.collapseTimer);
  homeWatch.collapseTimer = 0;
  homeWatch.collapsed = false;
  hideFresh();
  document.querySelector('#view .fresh-update')?.remove();
  if (!items.length || parseHash()[0]) return;
  noteHome(items);
  const prepared = items.map((item) => (muted(item.post || item) ? { ...item, muted: true } : item));
  resetPosts();
  const html = feedHtml(prepared);
  remember();
  const view = $('view');
  view?.querySelector('.empty')?.remove();
  view?.querySelector('.lang-wait')?.remove();
  const lead = view?.querySelector('.home-lead');
  const prompt = view?.querySelector('.prompt');
  if (lead) lead.insertAdjacentHTML('afterend', html);
  else if (prompt) prompt.insertAdjacentHTML('afterend', html);
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
  homeWatch.collapsed = false;
  homeWatch.checked = Date.now();
  homeWatch.timer = setInterval(() => { pollHome(token); }, FRESH_POLL_MS);
}

async function pollHome(token) {
  if (token !== generation || token !== homeWatch.token || document.hidden) return;
  if (parseHash()[0]) return;
  const now = Date.now();
  if (now - homeWatch.checked < FRESH_POLL_MS - 5000) return;
  homeWatch.checked = now;
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
    if (added.length) {
      revealFresh();
      playSound('posts');
    }
    paintFresh();
  } catch {
    /* the pill waits for the next check */
  }
}

function homeActive() {
  const [a, b, c] = parseHash();
  if (!a) return { kind: 'following' };
  if (a === 'discover') return { kind: 'discover' };
  if (a === 'lane' && (b === 'list' || b === 'feed') && c) return { kind: 'lane', type: b, value: c };
  return null;
}

function laneHref(item) {
  return `#/lane/${item.type}/${encodeURIComponent(item.value)}`;
}

function homeTabs(active) {
  const tabs = [
    { href: '#/', label: 'Following', on: active.kind === 'following' },
    { href: '#/discover', label: 'Discover', on: active.kind === 'discover' },
  ];
  homeLanes.forEach((item) => {
    tabs.push({
      href: laneHref(item),
      label: item.label,
      on: active.kind === 'lane' && active.value === item.value,
    });
  });
  return tabs;
}

function homeTitle(active) {
  if (active.kind === 'discover') return 'Discover';
  if (active.kind === 'lane') {
    return homeLanes.find((item) => item.value === active.value)?.label || (active.type === 'list' ? 'List' : 'Feed');
  }
  return 'Home';
}

function paintHomeChrome(active) {
  setChrome({
    title: homeTitle(active),
    nav: 'home',
    back: false,
    tabs: homeTabs(active),
    menuAct: 'tab-menu',
    menuLabel: 'Home menu',
  });
}

async function loadHomeLanes() {
  const prefs = await api.getPreferences();
  const pinned = api.savedFeedItems(prefs.preferences).filter((item) => item.pinned && (item.type === 'list' || item.type === 'feed'));
  const labels = new Map();
  const listUris = pinned.filter((item) => item.type === 'list').map((item) => item.value);
  const feedUris = pinned.filter((item) => item.type === 'feed').map((item) => item.value);
  const [lists, feeds] = await Promise.all([
    Promise.all(listUris.map((uri) => api.getList(uri, null, null, 1).then((found) => found.list).catch(() => null))),
    feedUris.length ? loadGenerators(feedUris) : [],
  ]);
  lists.filter(Boolean).forEach((list) => labels.set(list.uri, list.name || 'List'));
  feeds.forEach((feed) => labels.set(feed.uri, feed.displayName || 'Feed'));
  return pinned.map((item) => ({
    type: item.type,
    value: item.value,
    label: labels.get(item.value) || (item.type === 'list' ? 'List' : 'Feed'),
  }));
}

async function ensureHomeLanes(token) {
  try {
    if (!signedIn()) {
      const changed = homeLanes.length > 0;
      homeLanes = [];
      homeLanesDid = '';
      lanesAt = 0;
      return changed;
    }
    if (homeLanesDid === myDid() && Date.now() - lanesAt < 20000) return false;
    const next = await loadHomeLanes();
    if (token !== generation) return false;
    const changed = next.length !== homeLanes.length || next.some((item, index) => item.value !== homeLanes[index]?.value || item.label !== homeLanes[index]?.label);
    homeLanes = next;
    homeLanesDid = myDid();
    lanesAt = Date.now();
    return changed;
  } catch {
    return false;
  }
}

async function showHome(active) {
  const following = active.kind === 'following';
  const discover = active.kind === 'discover';
  const lane = active.kind === 'lane' ? active : null;
  if (following && !signedIn()) {
    showBrowse();
    return;
  }
  const token = ++generation;
  paintHomeChrome(active);
  const laneJob = ensureHomeLanes(token).then((changed) => {
    if (!changed || token !== generation) return;
    const now = homeActive();
    if (now) paintHomeChrome(now);
  });
  if (lane && !signedIn()) {
    $('view').innerHTML = homeLead('') + emptyHtml('This tab is on your account', 'Sign in to open lists and feeds you added to Home.', '<button type="button" class="primary" data-act="signin">Sign in with Bluesky</button>');
    return;
  }
  showSkeletons();
  try {
    let data;
    if (following) data = await api.getTimeline(null);
    else if (discover) data = await api.getFeed(api.WHATS_HOT);
    else if (lane.type === 'list') data = await api.getListFeed(lane.value);
    else data = await api.getFeed(lane.value);
    if (token !== generation) return;
    const banner = homeLead(following ? homePrompt() : '');
    const raw = data.feed || [];
    const items = following ? visibleHome(raw) : discover ? filterDiscover(raw) : lane.type === 'feed' ? visibleFeed(raw, lane.value) : raw;
    resetPosts();
    const posted = feedHtml(items);
    const empty = following
      ? emptyHtml('No posts yet', 'Follow a few people, or add a list with the … on the tabs.')
      : discover
        ? emptyHtml('No posts yet', 'Nothing in your content languages yet. The Settings page can show every language.')
        : emptyHtml('Nothing here', raw.length && lane.type === 'feed' ? 'Posts are hidden by this feed’s settings. The … menu can show more.' : 'There are no posts to show.');
    const waiting = '<p class="dim lang-wait">Looking through more posts…</p>';
    $('view').innerHTML = banner + (posted || (data.cursor ? waiting : empty));
    remember();
    document.documentElement.dataset.ready = '1';
    if (following) armHomeWatch(token, raw);
    const more = async (cursor) => {
      let page;
      if (following) page = await api.getTimeline(cursor);
      else if (discover) page = await api.getFeed(api.WHATS_HOT, cursor);
      else if (lane.type === 'list') page = await api.getListFeed(lane.value, cursor);
      else page = await api.getFeed(lane.value, cursor);
      if (token !== generation) return;
      const nextRaw = page.feed || [];
      const nextItems = following ? visibleHome(nextRaw) : discover ? filterDiscover(nextRaw) : lane.type === 'feed' ? visibleFeed(nextRaw, lane.value) : nextRaw;
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
    await laneJob;
  } catch (error) {
    if (token !== generation) return;
    $('view').innerHTML = emptyHtml('Could not load the feed', error.message, '<button type="button" class="primary" data-act="retry">Try again</button>');
  }
}

async function showBrowse() {
  const token = ++generation;
  setChrome({
    title: 'Browse',
    nav: 'home',
    back: false,
    tabs: [
      { href: '#/', label: 'Browse', on: true },
      { href: '#/discover', label: 'Discover', on: false },
    ],
  });
  showSkeletons();
  try {
    const data = await api.getFeed(api.WHATS_HOT);
    if (token !== generation) return;
    const raw = data.feed || [];
    const items = filterDiscover(raw);
    resetPosts();
    const posted = feedHtml(items);
    const banner = homeLead('<button type="button" class="prompt" data-act="signin"><span>Sign in to see who you follow</span></button>');
    const empty = emptyHtml('Nothing here yet', 'Discover is quiet in your content languages. The Settings page can show every language.');
    const waiting = '<p class="dim lang-wait">Looking through more posts…</p>';
    $('view').innerHTML = banner + (posted || (data.cursor ? waiting : empty));
    remember();
    document.documentElement.dataset.ready = '1';
    const more = async (cursor) => {
      const page = await api.getFeed(api.WHATS_HOT, cursor);
      if (token !== generation) return;
      const nextItems = filterDiscover(page.feed || []);
      if (!nextItems.length && !page.cursor && !$('view')?.querySelector('.post')) {
        $('view').innerHTML = banner + empty;
        pagerFor(null, more);
        return;
      }
      paintFeed(nextItems, { append: true });
      if (nextItems.length || !page.cursor) $('view')?.querySelector('.lang-wait')?.remove();
      pagerFor(page.cursor, more);
    };
    pagerFor(data.cursor, more);
  } catch (error) {
    if (token !== generation) return;
    $('view').innerHTML = emptyHtml('Could not load Browse', error.message, '<button type="button" class="primary" data-act="retry">Try again</button><button type="button" class="text-btn" data-act="signin">Sign in</button>');
  }
}

const AI_NAME = 'AI Assist';

function aiStripHtml() {
  if (!aiReady(loadAi())) return '';
  return `<form class="ai-inline" id="ai-inline"><span class="ai-inline-label">${AI_NAME}</span><input name="ask" maxlength="2000" placeholder="Ask ${AI_NAME}" autocomplete="off" enterkeyhint="send" aria-label="Ask ${AI_NAME}"><button class="primary small" type="submit">Ask</button></form>`;
}

function homeLead(banner) {
  const ask = aiStripHtml();
  if (!banner && !ask) return '';
  return `<div class="home-lead">${banner || ''}${ask}</div>`;
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
  setChrome({ title: 'Search', nav: 'search' });
  const known = Array.isArray(trendCache.list) ? trendCache.list : null;
  const controls = query ? sortHtml() : (known ? exploreTabsHtml(known) : '');
  const placeholder = query
    ? skeletons(4)
    : (known ? (trendBlock(visibleTrends(known)) || emptyHtml('Nothing trending', 'Nothing is happening in this tab right now.')) : skeletons(6));
  $('view').innerHTML = `<form class="search-page" id="search-form"><div class="search-bar"><label class="search"><input id="search-q" value="${escapeHtml(query)}" placeholder="Search Bluesky" autocomplete="off" enterkeyhint="search"></label></div><div id="search-controls">${controls}</div></form><div id="search-results">${placeholder}</div>`;
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
    const hiddenNote = !postsHtml && (postData.posts || []).length ? '<p class="dim search-note">Posts are hidden by search settings. Config on this page can show more.</p>' : '';
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
      const want = notificationSubjects(notes).filter((uri) => !subjects.has(uri));
      for (let index = 0; index < want.length; index += 25) {
        const uris = want.slice(index, index + 25);
        try {
          const fetched = await api.getPosts(uris);
          (fetched.posts || []).forEach((post) => subjects.set(post.uri, post));
        } catch { /* snippets and media previews are optional */ }
      }
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
  if (offer) {
    const facts = {
      allow: callAllow(),
      followed: Boolean(followCache.get(peerDid)),
      accepted: $('view')?.dataset.convoStatus !== 'request',
    };
    if (!callMayRing(facts) && !callIsRequest(facts)) offer = null;
  }
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
        if (incomingOffer) {
          const facts = {
            allow: callAllow(),
            followed: Boolean(followCache.get(peerDid)),
            accepted: $('view')?.dataset.convoStatus !== 'request',
          };
          if (callMayRing(facts)) playSound('call');
        } else if (fromThem) playSound('chat');
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
  setChrome({ title: 'Messages', nav: 'messages', back: true });
  if (!signedIn()) {
    $('view').innerHTML = emptyHtml('Messages', 'Sign in to open your Bluesky chats.', '<button type="button" class="primary" data-act="signin">Sign in</button>');
    return;
  }
  showSkeletons();
  try {
    if (!convoId || convoId === 'requests') {
      const { main, requests, joins, reported } = await loadConvoPages();
      if (token !== generation) return;
      const mine = myDid();
      const people = requestPeople(requests, joins, mine);
      const waiting = requests.length + (joins || []).length;
      if (convoId === 'requests') {
        setChrome({ title: 'Message requests', nav: 'messages', back: true });
        const rows = [
          ...requests.map((convo) => convoHtml(convo, mine, { request: true })),
          ...(joins || []).map((item) => joinRequestHtml(item)),
        ].join('');
        const missed = !rows && reported > 0;
        $('view').innerHTML = rows || emptyHtml(
          missed ? 'Message requests did not load' : 'No message requests',
          missed ? 'Bluesky still counts a request. Open this page again in a moment.' : 'When someone you have not accepted messages you, it shows up here.',
          missed ? '<button type="button" class="primary" data-act="retry">Try again</button>' : '',
        );
        return;
      }
      main.forEach((convo) => {
        if (ownUnread(convo, mine)) api.markConvoRead(convo.id).catch(() => {});
      });
      const rows = main.map((convo) => convoHtml(convo, mine)).join('');
      const entry = requestEntryHtml(waiting || reported, people);
      $('view').innerHTML = `<div class="toolbar"><button type="button" class="primary small" data-act="new-chat">New message</button><button type="button" class="text-btn" data-act="chat-read">Mark all as read</button><button type="button" class="danger" data-act="chat-cleanup">Remove deleted accounts</button></div>${entry}${rows || emptyHtml('No messages', 'Start a chat with someone you follow.')}`;
      refreshBadge();
      return;
    }
    const cached = convoById.get(convoId) || null;
    let loadError = null;
    const [data, convoWrap] = await Promise.all([
      api.getConvo(convoId).catch((error) => { loadError = error; return null; }),
      api.getConvoView(convoId).catch(() => null),
    ]);
    if (token !== generation) return;
    const convo = convoWrap?.convo || (convoWrap?.id ? convoWrap : null) || cached || null;
    if (convo?.id) rememberConvos([convo]);
    if (!data && !convo) throw loadError || new Error('Could not open that chat.');
    const messages = messagesForConvo(data, convo);
    const other = otherMember(convo, messages);
    const peerDid = other?.did || '';
    const requested = convoIsRequest(convo);
    if (other?.did) {
      if (other.viewer && Object.prototype.hasOwnProperty.call(other.viewer, 'following')) followCache.set(other.did, Boolean(other.viewer.following));
      else await rememberFollows([other.did]);
    }
    if (token !== generation) return;
    if (other) $('title').textContent = other.displayName || (other.handle ? `@${other.handle}` : 'Chat');
    else $('title').textContent = requested ? 'Message request' : 'Chat';
    const options = chatOptions(messages, peerDid, convoId, false);
    const requestBar = requested
      ? `<div class="request-banner"><p>This is a message request. Accept it to keep the chat, or delete it.</p><span class="row-actions"><button type="button" class="primary small" data-act="accept-convo" data-convo="${escapeHtml(convoId)}">Accept</button><button type="button" class="danger mini" data-act="decline-convo" data-convo="${escapeHtml(convoId)}">Delete</button></span></div>`
      : '';
    $('view').dataset.convoStatus = requested ? 'request' : 'accepted';
    if (pickerHost === 'chat') closePicker();
    styleHold.delete('chat-text');
    const chatTools = `<div id="chat-picker" hidden></div><div class="chat-tools"><button type="button" class="icon-btn" data-act="emoji" aria-expanded="false" aria-label="Emoji" data-tip="Emoji">${icon('smile')}</button>${styleButtons()}</div>`;
    const header = chatHeaderHtml(other) || `<div class="chat-head"><span class="chat-with"><span><strong>${requested ? 'Message request' : 'Chat'}</strong></span></span></div>`;
    const bubbles = messages.map((message) => messageHtml(message, myDid(), options)).join('');
    const emptyChat = bubbles ? '' : `<p class="dim ai-empty">${requested ? 'Bluesky did not send the text of this request. Accept it to keep the chat, or delete it.' : 'No messages in this chat yet.'}</p>`;
    $('view').innerHTML = `${header}${requestBar}<div class="messages">${bubbles}${emptyChat}</div><form class="reply-bar" id="chat-form"><div class="composer-field chat-field"><pre class="field-highlight" id="chat-highlight" aria-hidden="true"></pre><textarea id="chat-text" rows="3" maxlength="1000" placeholder="Message" autocomplete="off" spellcheck="true"></textarea></div><span class="tip-wrap" data-tip="Shift+Enter sends"><button class="primary small" type="submit" aria-keyshortcuts="Shift+Enter" data-tip="Shift+Enter sends">Send</button></span>${chatTools}<p class="chat-hint"><span class="chat-hint-keys">Shift+Enter sends. Enter adds a line. Click a suggestion or press Tab.</span><span class="chat-hint-touch">Enter adds a line. Tap Send.</span></p></form>`;
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
  lanesAt = 0;
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
    if (!rows) $('view').insertAdjacentHTML('beforeend', emptyHtml('No saved feeds', 'Open a feed and save it. Pin a list or a feed to show it on Home.'));
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
  setChrome({ title: 'Feed', nav: 'feeds', back: true });
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
      const buttons = [miniButton('feed-settings', 'Settings', { feed: uri })];
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

function profileTabs(actor, current, links = []) {
  const tabs = Object.entries(PROFILE_FILTERS).map(([id, [, label]]) => ({
    href: id === 'posts' ? `#/profile/${encodeURIComponent(actor)}` : `#/profile/${encodeURIComponent(actor)}/${id}`,
    label,
    on: id === current,
  }));
  links.forEach((link) => {
    if (link?.href && link?.label) tabs.push({ href: link.href, label: link.label, on: false });
  });
  return tabs;
}

function ownAuthorItems(items, profile) {
  const did = profile?.did || '';
  return (items || []).filter((item) => {
    if (String(item?.reason?.$type || '').includes('reasonRepost')) return false;
    const author = item?.post?.author?.did || '';
    return !author || !did || author === did;
  });
}

function featuredTab(view) {
  const kind = collectionKind(view);
  if (!kind || !view?.uri) return null;
  const inner = view.record && view.record.text == null ? view.record : null;
  const label = kind === 'pack'
    ? (inner?.name || view.name || 'Starter pack')
    : kind === 'list'
      ? (view.name || 'List')
      : kind === 'labeler'
        ? (view.creator?.displayName || view.creator?.handle || 'Labeler')
        : (view.displayName || view.name || 'Feed');
  const href = kind === 'feed'
    ? `#/feed/${encodeURIComponent(view.uri)}`
    : kind === 'list'
      ? `#/list/${encodeURIComponent(view.uri)}`
      : kind === 'pack'
        ? `#/pack/${encodeURIComponent(view.uri)}`
        : '';
  if (!href) return null;
  return { href, label };
}

function paintProfileTabs() {
  const host = $('profile-tabs');
  if (!host || !profileTab.actor) return;
  forgetStrips(host);
  const links = profileLinkViews.map((view) => featuredTab(view)).filter(Boolean);
  host.innerHTML = tabStrip(profileTabs(profileTab.actor, profileTab.tab, links), {
    menuAct: 'profile-menu',
    menuLabel: 'Profile menu',
    sticky: true,
  });
  watchStrips(host);
}

async function showProfile(actor, tab) {
  const token = ++generation;
  const current = PROFILE_FILTERS[tab] ? tab : 'posts';
  shownProfile = null;
  profileLinkViews = [];
  profileFeatured = new Set();
  profileTab = { actor, tab: current };
  setChrome({ title: 'Profile', nav: 'profile', back: true });
  showSkeletons();
  try {
    const profile = await api.getProfile(actor);
    if (token !== generation) return;
    $('title').textContent = profile.displayName || profile.handle;
    document.title = `${$('title').textContent} — LibreSky`;
    const action = profileAction(profile);
    let feed;
    if (current === 'likes') feed = await api.getActorLikes(profile.handle);
    else feed = await api.getAuthorFeed(profile.handle, PROFILE_FILTERS[current][0]);
    if (token !== generation) return;
    resetPosts();
    const raw = feed.feed || [];
    const visible = current === 'likes' ? raw : ownAuthorItems(raw, profile);
    const split = current === 'posts' ? await pinnedSplit(profile, visible) : { pinned: [], feed: visible };
    if (token !== generation) return;
    const pinHtml = split.pinned.map((item) => postHtml(item, { pinned: true })).join('');
    const postsHtml = feedHtml(split.feed);
    const blank = pinHtml || postsHtml
      ? postsHtml
      : (feed.cursor ? '<p class="dim lang-wait">Loading posts…</p>' : emptyHtml('No posts', 'Nothing in this tab yet.'));
    shownProfile = profile;
    forgetStrips($('view'));
    $('view').innerHTML = `${profileHtml(profile)}<div id="profile-tabs"></div>${pinHtml}${blank}`;
    paintProfileTabs();
    $('profile-action').innerHTML = action;
    remember();
    document.documentElement.dataset.ready = '1';
    const more = async (cursor) => {
      const page = current === 'likes'
        ? await api.getActorLikes(profile.handle, cursor)
        : await api.getAuthorFeed(profile.handle, PROFILE_FILTERS[current][0], cursor);
      if (token !== generation) return;
      const nextRaw = page.feed || [];
      const nextItems = current === 'likes' ? nextRaw : ownAuthorItems(nextRaw, profile);
      paintFeed(nextItems, { append: true });
      if (nextItems.length || !page.cursor) $('view')?.querySelector('.lang-wait')?.remove();
      if (!page.cursor && !$('view')?.querySelector('.post')) {
        $('view')?.insertAdjacentHTML('beforeend', emptyHtml('No posts', 'Nothing in this tab yet.'));
      }
      pagerFor(page.cursor, more);
    };
    pagerFor(feed.cursor, more);
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

function paintAttachCurrent() {
  const host = $('attach-current');
  if (!host) return;
  if (attachMode !== 'profile') {
    host.hidden = true;
    host.innerHTML = '';
    return;
  }
  host.hidden = false;
  const tabs = profileLinkViews.map((view) => {
    const tab = featuredTab(view);
    if (!tab) return '';
    const remove = profileFeatured.has(view.uri)
      ? `<button type="button" class="lane-x" data-act="shelf-unpin" data-uri="${escapeHtml(view.uri)}" aria-label="Remove ${escapeHtml(tab.label)}">×</button>`
      : '';
    return `<span class="lane-tab" role="tab"><span>${escapeHtml(tab.label)}</span>${remove}</span>`;
  }).join('');
  host.innerHTML = `<p class="dim">Same row as Home. Posts stays. Added links sit beside it.</p><div class="tab-strip lane-strip"><div class="tab-scroller" role="tablist"><span role="tab" aria-selected="true">Posts</span><span role="tab">Replies</span><span role="tab">Media</span><span role="tab">Likes</span>${tabs}</div></div>`;
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
  if (!did || !$('profile-tabs')) return;
  try {
    const [feeds, lists, packs, featured] = await Promise.all([
      api.getActorFeeds(did).catch(() => ({ feeds: [] })),
      api.getLists(did).catch(() => ({ lists: [] })),
      api.getActorStarterPacks(did).catch(() => ({ starterPacks: [] })),
      api.readFeatured(did).catch(() => []),
    ]);
    if (token !== generation || !$('profile-tabs')) return;
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
      if (token !== generation || !$('profile-tabs')) return;
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
    profileFeatured = new Set((featured || []).map((item) => item?.uri).filter(Boolean));
    profileLinkViews = ordered;
    paintProfileTabs();
    if ($('attach')?.open) paintAttachCurrent();
  } catch (error) {
    if (token === generation && $('profile-tabs')) toast(error.message || 'Could not load profile links.');
  }
}

function profileAiButton() {
  if (!aiReady(loadAi())) return '';
  return `<button type="button" class="outline ai-check" data-act="ai-profile">${icon('spark')}<span>AI Assist</span></button>`;
}

function profileAction(profile) {
  const more = `<button type="button" class="profile-more" data-act="profile-menu" aria-label="Profile menu">${icon('more')}</button>`;
  const ai = profileAiButton();
  if (!signedIn()) return `<span class="profile-actions"><button type="button" class="primary small" data-act="signin">Sign in</button>${ai}${more}</span>`;
  if (profile.did === myDid()) return `<span class="profile-actions"><button type="button" class="outline" data-act="edit-profile">Edit profile</button>${ai}${more}</span>`;
  const following = profile.viewer?.following || '';
  const blocking = profile.viewer?.blocking || '';
  const follow = blocking
    ? `<button type="button" class="danger" data-act="block-profile" data-did="${escapeHtml(profile.did)}" data-blocking="${escapeHtml(blocking)}">Blocked</button>`
    : `<button type="button" class="follow${following ? ' on' : ''}" data-act="follow" data-did="${escapeHtml(profile.did)}" data-following="${escapeHtml(following)}">${following ? 'Following' : 'Follow'}</button>`;
  return `<span class="profile-actions">${ai}${follow}${more}</span>`;
}

function homeListOk(list) {
  const purpose = String(list?.purpose || '');
  if (!list?.uri) return false;
  if (purpose.includes('modlist') || purpose.includes('referencelist')) return false;
  return true;
}

async function collectLaneChoices() {
  const did = myDid();
  const [prefs, listsPage] = await Promise.all([
    api.getPreferences(),
    api.getLists(did).catch(() => ({ lists: [] })),
  ]);
  const saved = api.savedFeedItems(prefs.preferences).filter((item) => item.type === 'list' || item.type === 'feed');
  const mine = new Map((listsPage.lists || []).filter(homeListOk).map((list) => [list.uri, list]));
  const savedLists = saved.filter((item) => item.type === 'list' && !mine.has(item.value)).map((item) => item.value);
  const extra = await Promise.all(savedLists.slice(0, 30).map((uri) => api.getList(uri, null, null, 1).then((found) => found.list).catch(() => null)));
  const listByUri = new Map(mine);
  extra.filter(Boolean).forEach((list) => listByUri.set(list.uri, list));
  const feedUris = [...new Set(saved.filter((item) => item.type === 'feed').map((item) => item.value))];
  const feeds = feedUris.length ? await loadGenerators(feedUris) : [];
  const feedByUri = new Map(feeds.map((feed) => [feed.uri, feed]));
  const labelOf = (type, value) => (type === 'list' ? (listByUri.get(value)?.name || 'List') : (feedByUri.get(value)?.displayName || 'Feed'));
  const showing = [];
  const seen = new Set();
  saved.filter((item) => item.pinned).forEach((item) => {
    if (seen.has(item.value)) return;
    seen.add(item.value);
    showing.push({ type: item.type, value: item.value, label: labelOf(item.type, item.value) });
  });
  const available = [];
  mine.forEach((list) => {
    if (seen.has(list.uri)) return;
    seen.add(list.uri);
    available.push({ type: 'list', value: list.uri, label: list.name || 'List', kind: 'Your list' });
  });
  saved.forEach((item) => {
    if (seen.has(item.value)) return;
    seen.add(item.value);
    available.push({
      type: item.type,
      value: item.value,
      label: labelOf(item.type, item.value),
      kind: item.type === 'list' ? 'Saved list' : 'Saved feed',
    });
  });
  return { showing, available };
}

function paintLaneEditor() {
  const body = $('lanes-body');
  if (!body || !laneDraft) return;
  const showing = laneDraft.showing;
  const rows = showing.map((item, index) => {
    const up = index === 0 ? ' disabled' : '';
    const down = index === showing.length - 1 ? ' disabled' : '';
    return `<span class="lane-tab" role="tab"><button type="button" class="lane-nudge" data-act="lane-up" data-index="${index}"${up} aria-label="Move left">${CHEVRON_LEFT}</button><span>${escapeHtml(item.label)}</span><button type="button" class="lane-nudge" data-act="lane-down" data-index="${index}"${down} aria-label="Move right">${CHEVRON_RIGHT}</button><button type="button" class="lane-x" data-act="lane-remove" data-index="${index}" aria-label="Remove ${escapeHtml(item.label)}">×</button></span>`;
  }).join('');
  const available = laneDraft.available.map((item) => `<div class="lane-row"><span><strong>${escapeHtml(item.label)}</strong><span class="handle">${escapeHtml(item.kind)}</span></span><button type="button" class="text-btn" data-act="lane-add" data-type="${escapeHtml(item.type)}" data-value="${escapeHtml(item.value)}" data-label="${escapeHtml(item.label)}">Add</button></div>`).join('');
  body.innerHTML = `<div class="tab-strip lane-strip"><div class="tab-scroller" role="tablist"><span role="tab" aria-selected="true">Following</span><span role="tab">Discover</span>${rows}</div></div>
    ${rows ? '' : '<p class="dim">Nothing extra yet. Add a list or a saved feed below. It shows on this row.</p>'}
    <h3>Add</h3>
    ${available || '<p class="dim">No other lists or saved feeds. Create a list or save a feed, then add it here.</p>'}
    <button type="button" class="primary lanes-save" data-act="lane-save">Save</button>`;
}

async function openLaneEditor() {
  if (!signedIn()) return requireSignIn();
  const dialog = $('lanes');
  const body = $('lanes-body');
  if (!dialog || !body) return;
  laneDraft = null;
  body.innerHTML = '<p class="dim">Loading your lists and feeds…</p>';
  if (!dialog.open) dialog.showModal();
  try {
    laneDraft = await collectLaneChoices();
    if (!$('lanes')?.open) return;
    paintLaneEditor();
  } catch (error) {
    body.innerHTML = `<p class="dim">${escapeHtml(error.message || 'Could not load tabs.')}</p>`;
  }
}

function editLaneDraft(act, button) {
  if (!laneDraft) return;
  if (act === 'lane-add') {
    const value = button?.dataset.value || '';
    if (!value || laneDraft.showing.some((item) => item.value === value)) return;
    if (laneDraft.showing.length >= LANE_CAP) {
      toast(`Home can show ${LANE_CAP} lists and feeds besides Following and Discover.`);
      return;
    }
    const type = button.dataset.type === 'list' ? 'list' : 'feed';
    laneDraft.showing.push({ type, value, label: button.dataset.label || (type === 'list' ? 'List' : 'Feed') });
    laneDraft.available = laneDraft.available.filter((item) => item.value !== value);
    paintLaneEditor();
    return;
  }
  const index = Number(button?.dataset.index);
  if (!Number.isInteger(index) || !laneDraft.showing[index]) return;
  if (act === 'lane-remove') {
    const [item] = laneDraft.showing.splice(index, 1);
    if (item) laneDraft.available.push({ ...item, kind: item.type === 'list' ? 'List' : 'Saved feed' });
  } else {
    const dir = act === 'lane-up' ? -1 : 1;
    const next = index + dir;
    if (next < 0 || next >= laneDraft.showing.length) return;
    const [item] = laneDraft.showing.splice(index, 1);
    laneDraft.showing.splice(next, 0, item);
  }
  paintLaneEditor();
}

async function saveLaneDraft() {
  if (!laneDraft || !signedIn()) return;
  const showing = laneDraft.showing.map((item) => ({ ...item }));
  const button = $('lanes-body')?.querySelector('[data-act="lane-save"]');
  if (button) button.disabled = true;
  try {
    await changeFeeds((items) => {
      const wanted = new Set(showing.map((item) => item.value));
      const pinned = showing.map((item) => {
        const existing = items.find((row) => row.value === item.value);
        return {
          id: existing?.id,
          type: item.type === 'list' ? 'list' : 'feed',
          value: item.value,
          pinned: true,
        };
      });
      const rest = items.filter((row) => !wanted.has(row.value)).map((row) => ({ ...row, pinned: false }));
      return [...pinned, ...rest];
    });
    homeLanes = showing;
    homeLanesDid = myDid();
    lanesAt = Date.now();
    $('lanes')?.close();
    toast('Home tabs saved');
    const active = homeActive();
    if (active?.kind === 'lane' && !homeLanes.some((item) => item.value === active.value)) location.hash = '#/';
    else if (active) paintHomeChrome(active);
  } catch (error) {
    toast(error.message || 'Could not save home tabs');
    if (button?.isConnected) button.disabled = false;
  }
}

function openHomeTabMenu(anchor) {
  const active = homeActive();
  const items = [{ id: 'edit-tabs', label: 'Edit tabs' }];
  if (!active || active.kind === 'following') items.push({ id: 'home-settings', label: 'Home settings' });
  else if (active.kind === 'lane' && active.type === 'feed') items.push({ id: 'feed-settings', label: 'Feed settings' });
  else if (active.kind === 'lane' && active.type === 'list') items.push({ id: 'open-list', label: 'Open list' });
  toggleMenu(anchor, items);
}

function profileLink(profile) {
  const id = profile?.handle || profile?.did || '';
  const link = new URL(location.href);
  link.hash = `#/profile/${encodeURIComponent(id)}`;
  return link.href;
}

function openProfileMenu(anchor) {
  const profile = shownProfile;
  if (!profile) return;
  const mine = signedIn() && profile.did === myDid();
  const blocking = profile.viewer?.blocking || '';
  const items = [];
  if (mine) {
    items.push({ id: 'edit-profile', label: 'Edit profile' });
    items.push({ id: 'edit-links', label: 'Edit links' });
  }
  if (!mine && signedIn() && !blocking) {
    items.push({ id: 'message-profile', label: 'Message' });
    items.push({ id: 'profile-voice', label: 'Voice call' });
    items.push({ id: 'profile-video', label: 'Video call' });
    items.push({ id: 'profile-mute', label: profile.viewer?.muted ? 'Unmute' : 'Mute' });
  }
  if (!mine && signedIn()) {
    items.push({ id: 'profile-block', label: blocking ? 'Unblock' : 'Block', danger: !blocking });
    items.push({ id: 'profile-report', label: 'Report' });
  }
  items.push({ id: 'profile-copy', label: 'Copy link' });
  items.push({ id: 'profile-share', label: 'Share' });
  toggleMenu(anchor, items);
}

async function shareProfile(profile) {
  const url = profileLink(profile);
  const title = profile?.displayName || profile?.handle || 'Profile';
  if (navigator.share) {
    try {
      await navigator.share({ title, url });
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
  setChrome({ title: 'Post', nav: 'home', back: true });
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
      : '<button type="button" class="prompt" data-act="signin"><span>Sign in to reply</span></button>';
    const order = '<div class="toolbar"><button type="button" class="text-btn" data-act="thread-settings">Thread order</button></div>';
    $('view').innerHTML = order + above + postHtml({ post: thread.post, reply: thread.parent ? { parent: thread.parent.post ? { author: thread.parent.post.author } : null } : null }) + replyBox + replies;
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
let aiPending = '';
let aiPendingNote = 'Page';

function aiKeyHelp(provider) {
  const item = providerById(provider);
  if (item.id === 'custom') {
    return 'Other accounts need an https address that accepts OpenAI chat completions. A server on this computer can use http://127.0.0.1 or http://localhost.';
  }
  if (!item.keyUrl) return '';
  const link = `<a href="${escapeHtml(item.keyUrl)}" target="_blank" rel="noopener noreferrer">${escapeHtml(item.keyLabel || item.keyUrl)}</a>`;
  if (item.keyOptional) return `${escapeHtml(item.label)} answers without a key. A key from ${link} raises the limit.`;
  return `Get a ${escapeHtml(item.label)} key from ${link}.`;
}

function aiSettingsHtml() {
  const saved = loadAi();
  const provider = saved?.provider || 'grok';
  const known = providerById(provider);
  const model = saved?.model || known.model || '';
  const options = AI_PROVIDERS.map((item) => `<option value="${item.id}"${item.id === provider ? ' selected' : ''}>${escapeHtml(item.label)}</option>`).join('');
  const keyHint = saved?.apiKey ? 'Saved on your Bluesky account. Type a new key to replace it.' : 'Paste the key from that account';
  const usingFallback = !saved?.apiKey;
  const status = saved?.apiKey
    ? `${AI_NAME} is on for this account.`
    : `${AI_NAME} is on with a free public model until you save a key.`;
  const remove = saved ? '<button type="button" class="danger" id="ai-clear" data-act="ai-clear">Remove</button>' : '';
  const directory = AI_PROVIDERS.filter((item) => item.keyUrl).map((item) => {
    const extra = item.keyOptional ? ' · works without a key' : '';
    return `<li><a href="${escapeHtml(item.keyUrl)}" target="_blank" rel="noopener noreferrer">${escapeHtml(item.label)}</a>${extra}</li>`;
  }).join('');
  return `<p class="dim">${AI_NAME} answers on the AI page, on Home, and as a check on profiles and posts. Without a key it uses a free public model so you still have something. <a class="text-link" href="#/ai">@ai and @si</a> ask it from this account. A saved key is stored on your Bluesky account, in the private preferences that follow this login. It is not written on the public profile, because anyone can read that record. This page does not ask the browser to remember it. The key is sent only to the provider you pick.</p>
    <form id="ai-form" class="ai-form" autocomplete="off">
      <label>Provider
        <select id="ai-provider">${options}</select>
      </label>
      <label>Model
        <input id="ai-model" value="${escapeHtml(model)}" data-auto="${!saved || model === known.model ? '1' : '0'}" maxlength="120" spellcheck="false" autocapitalize="off" autocomplete="off">
      </label>
      <label id="ai-base-label"${provider === 'custom' ? '' : ' hidden'}>API address
        <input id="ai-base" value="${escapeHtml(provider === 'custom' ? (saved?.base || '') : '')}" maxlength="200" spellcheck="false" autocapitalize="off" autocomplete="off" placeholder="https://example.com/v1">
      </label>
      <label>API key
        <input id="ai-key" type="text" name="provider-secret" maxlength="2000" spellcheck="false" autocapitalize="off" autocorrect="off" autocomplete="off" data-1p-ignore data-lpignore="true" data-form-type="other" placeholder="${escapeHtml(keyHint)}">
      </label>
      <p class="dim" id="ai-key-help">${aiKeyHelp(provider)}</p>
      <div class="toolbar">
        <button class="primary small" type="submit">Save</button>
        <button type="button" class="text-btn" id="ai-check" data-act="ai-check">Check</button>
        ${remove}
      </div>
      <p class="dim" id="ai-status">${escapeHtml(status)}</p>
    </form>
    <p class="dim">${usingFallback ? 'A key is optional. Pick a provider and open its site to create one.' : 'Replace the key by pasting a new one and saving.'}</p>
    <ul class="ai-key-list dim">${directory}</ul>`;
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
  const help = $('ai-key-help');
  if (help) help.innerHTML = aiKeyHelp(select.value);
  const current = model.value.trim();
  const known = AI_PROVIDERS.some((provider) => provider.model && provider.model === current);
  if (model.dataset.auto === '1' || !current || known) {
    model.value = item.model || '';
    model.dataset.auto = '1';
  }
}

async function saveAiForm(event) {
  event.preventDefault();
  const button = event.target?.querySelector?.('button[type="submit"]');
  if (button) button.disabled = true;
  try {
    await commitAiAccount(readAiForm());
    toast(`${AI_NAME} saved on your Bluesky account`);
    if (parseHash()[0] === 'settings') showSettings();
  } catch (error) {
    toast(error.message || 'Could not save the key on your Bluesky account.');
  } finally {
    if (button?.isConnected) button.disabled = false;
  }
}

async function checkAiForm() {
  const button = $('ai-check');
  let account;
  try { account = readAiForm(); } catch { account = resolveAi(null); }
  if (button) button.disabled = true;
  try {
    await askAi(account, [
      { role: 'system', content: AI_SYSTEM },
      { role: 'user', content: 'Reply with ok.' },
    ], AbortSignal.timeout ? AbortSignal.timeout(AI_TIMEOUT_MS) : undefined, 'Settings');
    const line = `${AI_NAME} replied.`;
    const status = $('ai-status');
    if (status?.isConnected) status.textContent = line;
    toast(line);
  } catch (error) {
    const message = error?.message || 'The account did not answer.';
    const status = $('ai-status');
    if (status?.isConnected) status.textContent = message;
    toast(message);
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
    ? 'Page scoped. Saved as Bluesky home preferences, so the official app can use the same choices.'
    : 'Page scoped. Saved as this feed’s Bluesky preferences.';
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
  return `${head}<p class="dim">Page scoped. Saved as Bluesky thread preferences. The official app uses this reply order.</p>
    <div class="segmented">${sorts.map(([id, label]) => `<button type="button" data-thread-sort="${id}" aria-pressed="${prefs.sort === id ? 'true' : 'false'}">${label}</button>`).join('')}</div>
    ${switchRow('thread.followed', 'Prioritize people you follow', prefs.prioritizeFollowedUsers)}`;
}

function searchSettingsHtml({ heading = true } = {}) {
  const prefs = searchPrefs();
  const head = heading ? '<h2>Search</h2>' : '';
  return `${head}<p class="dim">Page scoped. Search stores these on your account with AT Protocol, in app.libresky.settings. Bluesky has no shared search-settings record.</p>
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
  } else if (name === 'a11y.reader') {
    applyA11y(saveA11yPrefs({ reader: checked }));
    return;
  } else if (name === 'follow.auto' || name === 'follow.skipSpam') {
    const key = name === 'follow.auto' ? 'auto' : 'skipSpam';
    saveFollowDeskPrefs({ [key]: checked });
    paintFollowBack();
    if (name === 'follow.auto' && checked) runFollowBack(false);
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

const SETTINGS_TABS = [
  ['you', 'You'],
  ['follows', 'Follows'],
  ['safety', 'Safety'],
  ['display', 'Display'],
  ['feeds', 'Feeds'],
  ['languages', 'Languages'],
  ['sound', 'Sound'],
  ['ai', 'AI'],
];
let settingsTab = 'you';

function settingsPanel(id, body) {
  const on = settingsTab === id;
  return `<div class="settings-panel" role="tabpanel" id="settings-${id}" data-settings-panel="${id}" aria-labelledby="settings-tab-${id}"${on ? '' : ' hidden'}>${body}</div>`;
}

function displaySettingsHtml() {
  const theme = THEMES.includes(document.documentElement.dataset.theme) ? document.documentElement.dataset.theme : 'light';
  const access = a11yPrefs();
  const themes = [
    ['light', 'Light'],
    ['dark', 'Dark'],
    ['contrast-light', 'High contrast light'],
    ['contrast-dark', 'High contrast dark'],
  ];
  return `<h2>Appearance</h2>
    <p class="dim">High contrast uses stronger borders and colors that stay readable. The choice is saved on your account.</p>
    <div class="segmented wrap" role="group" aria-label="Theme">
      ${themes.map(([id, label]) => `<button type="button" data-theme-set="${id}" aria-pressed="${theme === id}">${label}</button>`).join('')}
    </div>
    <h2>Post text</h2>
    <p class="dim">Makes posts, quotes, chats, and the post box larger. 100% is the normal size.</p>
    <label class="vol voice-vol"><span>Size</span> <b id="post-scale-label">${access.scale}%</b><input id="post-scale" type="range" min="100" max="200" step="25" value="${access.scale}" aria-label="Post text size"></label>
    <h2>Screen reader</h2>
    <p class="dim">A screen reader can read posts either way. This adds strong focus rings, underlines links, and shows the names of the post buttons.</p>
    ${switchRow('a11y.reader', 'Screen reader layout', access.reader, 'Focus rings, link underlines, and button names.')}
    <h2>Keyboard</h2>
    <ul class="keys">
      <li><kbd>n</kbd> New post</li><li><kbd>Shift</kbd> <kbd>Enter</kbd> Send while writing a post or chat. From the timeline, a new post</li><li><kbd>Tab</kbd> Complete a word, @name, or #tag</li><li><kbd>j</kbd> <kbd>k</kbd> Next and previous post</li>
      <li><kbd>Shift</kbd> <kbd>↑</kbd> Top of the page</li>
      <li><kbd>a</kbd> Read the selected post aloud</li>
      <li><kbd>l</kbd> Like</li><li><kbd>r</kbd> Reply</li><li><kbd>t</kbd> Repost</li>
      <li><kbd>b</kbd> Bookmark</li><li><kbd>s</kbd> Share</li><li><kbd>Enter</kbd> Open post</li><li><kbd>/</kbd> Search</li>
      <li><kbd>Escape</kbd> In a post: continue, save as draft, or discard</li>
    </ul>`;
}

function showSettings() {
  generation += 1;
  const token = generation;
  setChrome({ title: 'Settings', nav: 'settings', back: true });
  const words = mutedWords();
  const sounds = soundPrefs();
  const tabs = SETTINGS_TABS.map(([id, label]) => `<button type="button" role="tab" id="settings-tab-${id}" data-settings-tab="${id}" aria-selected="${settingsTab === id ? 'true' : 'false'}" aria-controls="settings-${id}" tabindex="${settingsTab === id ? '0' : '-1'}">${label}</button>`).join('');
  $('view').innerHTML = `<section class="settings">
    <p class="dim">Config and Help are page scoped. On Home, Search, a feed, or a thread, Config opens that page. This page holds the rest.</p>
    <div class="settings-tabs" role="tablist" aria-label="Settings">${tabs}</div>
    ${settingsPanel('you', `<h2>Accounts</h2>
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
    <h2>Messages and calls</h2>
    <p class="dim">Everyone lets other people reach you as a request until you accept or delete it. People you follow skips the request and comes straight in. No one blocks new chats and new calls. The chat choice is your Bluesky chat setting, so the official app uses it too. The call choice is saved with your LibreSky settings.</p>
    ${signedIn() ? `<h3>Who can message you</h3><div class="segmented wrap" id="chat-allow">${allowButtons('chat', 'all')}</div><h3>Who can call you</h3><div class="segmented wrap" id="call-allow">${allowButtons('call', callAllow())}</div>` : '<p class="dim">Sign in to choose who can message or call you.</p>'}
    ${profileSettingsHtml()}`)}
    ${settingsPanel('follows', followCleanupPanel())}
    ${settingsPanel('safety', `<h2>Muted accounts</h2>
    <div id="muted-accounts" class="directory"><p class="dim">Loading muted accounts…</p></div>
    <h2>Blocked accounts</h2>
    <div id="blocked-accounts" class="directory"><p class="dim">Loading blocked accounts…</p></div>
    <h2>Muted words</h2>
    <p class="dim">Posts containing these words are collapsed in your feeds. Signed in, they are saved as Bluesky muted words, so the official app hides them too.</p>
    <form id="mute-form" class="mute-form"><input id="mute-input" placeholder="Add a word" maxlength="40"><button class="primary small" type="submit">Add</button></form>
    <div class="chips">${words.map((word) => `<button type="button" class="chip" data-unmute="${escapeHtml(word)}" aria-label="Remove ${escapeHtml(word)}"><span>${escapeHtml(word)}</span><span class="chip-x" aria-hidden="true">×</span></button>`).join('')}</div>`)}
    ${settingsPanel('display', displaySettingsHtml())}
    ${settingsPanel('feeds', `${homeSettingsHtml()}${threadSettingsHtml()}${searchSettingsHtml()}`)}
    ${settingsPanel('languages', `<h2>Languages</h2>
    <p class="dim">Discover shows posts written in the content languages you turn on. Turn them all off to see every language. Post languages are saved on the posts you write, up to three. Tab finishes a word, an @name, or a #tag while you type. Bluesky has no shared language preference, so these are saved on your account as LibreSky settings and kept in this browser too.</p>
    <input id="lang-find" class="lang-find" placeholder="Find a language" autocomplete="off">
    <h3>Content</h3>
    <div class="lang-grid" id="content-langs">${languageButtons('content', languagePrefs().content)}</div>
    <h3>Posts</h3>
    <div class="lang-grid" id="post-langs">${languageButtons('posts', languagePrefs().posts)}</div>`)}
    ${settingsPanel('sound', `<h2>Sounds</h2>
    <p class="dim">Each notice has its own volume. Incoming calls use the chat sound. New posts on Home start off. The browser may stay quiet until you click the page. Signed-in choices are saved on your account.</p>
    <div class="sound-list">
      ${soundRow('chat', 'New chat messages', sounds)}
      ${soundRow('notifications', 'New notifications', sounds)}
      ${soundRow('posts', 'New posts on Home', sounds)}
    </div>
    ${voiceSettingsHtml()}`)}
    ${settingsPanel('ai', `<h2>AI</h2>${aiSettingsHtml()}`)}
  </section>`;
  loadSettingsLists(token);
  loadChatAllow(token);
  fillVoiceSelect();
  if (settingsTab === 'follows') loadFollowCleanup(token);
}

function selectSettingsTab(id) {
  if (!SETTINGS_TABS.some(([tab]) => tab === id)) return;
  settingsTab = id;
  document.querySelectorAll('[data-settings-tab]').forEach((button) => {
    const on = button.dataset.settingsTab === id;
    button.setAttribute('aria-selected', on ? 'true' : 'false');
    button.tabIndex = on ? 0 : -1;
  });
  document.querySelectorAll('[data-settings-panel]').forEach((panel) => {
    panel.hidden = panel.dataset.settingsPanel !== id;
  });
  if (id === 'follows') loadFollowCleanup();
}

const CLEANUP_UNFOLLOW_CAP = 30;
const CLEANUP_REPLY_PAGES = 40;
const CLEANUP_REPLY_YEAR = 366 * 24 * 60 * 60 * 1000;

function blankFollowCleanup(did = '') {
  return {
    did,
    people: [],
    replyAt: new Map(),
    scan: 'idle',
    scanNote: '',
    scanCursor: '',
    postsSeen: 0,
    dates: 'idle',
    filters: { popularity: 'any', mutual: 'any', reply: 'any', spam: 'any', recent: 'any', sort: 'name', q: '' },
    selected: new Set(),
    undo: readFollowUndo(did),
    shown: 200,
    busy: false,
    loading: false,
    followsLoaded: false,
    moreFollows: false,
    loadError: '',
  };
}

let followCleanup = blankFollowCleanup();
let cleanupLoadId = 0;
let cleanupScanId = 0;
let cleanupDateId = 0;
const followBack = { busy: false, note: '' };
let followBackRun = 0;

function readFollowUndo(did) {
  if (!did) return [];
  try {
    const data = JSON.parse(sessionStorage.getItem('libresky.followUndo') || 'null');
    if (data?.did !== did || !Array.isArray(data.people)) return [];
    return data.people.filter((person) => person?.did).slice(0, 80);
  } catch {
    return [];
  }
}

function writeFollowUndo(did, people) {
  followCleanup.undo = (people || []).slice(0, 80);
  try {
    if (!did || !followCleanup.undo.length) sessionStorage.removeItem('libresky.followUndo');
    else sessionStorage.setItem('libresky.followUndo', JSON.stringify({ did, people: followCleanup.undo }));
  } catch { /* this tab can still undo from memory */ }
}

function optionalCount(value, prev) {
  if (value == null || value === '') return prev ?? null;
  const num = Number(value);
  return Number.isFinite(num) ? num : (prev ?? null);
}

function personFromActor(actor, prev) {
  const created = Date.parse(actor?.createdAt || '');
  return {
    did: actor.did,
    handle: actor.handle || prev?.handle || '',
    displayName: actor.displayName || prev?.displayName || '',
    description: typeof actor.description === 'string' ? actor.description : (prev?.description || ''),
    avatar: actor.avatar || prev?.avatar || '',
    followers: Number(actor.followersCount ?? prev?.followers) || 0,
    follows: optionalCount(actor.followsCount, prev?.follows),
    posts: optionalCount(actor.postsCount, prev?.posts),
    createdAt: Number.isFinite(created) ? created : (prev?.createdAt || 0),
    followedAt: prev?.followedAt || 0,
    mutual: Boolean(actor.viewer?.followedBy || prev?.mutual),
    followingUri: actor.viewer?.following || prev?.followingUri || '',
    replyAt: followCleanup.replyAt.get(actor.did) || prev?.replyAt || 0,
  };
}

function followBackStatusText() {
  if (!signedIn()) return 'Sign in to follow people back.';
  const prefs = followDeskPrefs();
  const owner = myDid();
  const today = followBackToday(owner);
  const held = followHoldSet(owner).size;
  const skip = prefs.skipSpam ? 'Accounts that look like spam are skipped.' : 'Accounts that look like spam are included.';
  const heldNote = held ? ` ${fullCount(held)} unfollowed ${held === 1 ? 'account is' : 'accounts are'} held, so auto follow back leaves them.` : '';
  const extra = followBack.note ? ` ${followBack.note}` : '';
  const mode = prefs.auto ? 'on' : 'off';
  return `Auto follow back is ${mode}. Today ${fullCount(today)} of ${fullCount(prefs.cap)}. ${skip}${heldNote}${extra}`;
}

function paintFollowBack() {
  const status = $('followback-status');
  if (status) status.textContent = followBackStatusText();
  const now = $('followback-now');
  const release = $('followback-release');
  const held = signedIn() ? followHoldSet(myDid()).size : 0;
  if (now) now.disabled = followBack.busy || !signedIn();
  if (release) {
    release.disabled = followBack.busy || !held;
    release.textContent = held ? `Release ${fullCount(held)} held` : 'Release held';
  }
  document.querySelectorAll('[data-follow-cap]').forEach((button) => {
    button.disabled = followBack.busy;
  });
}

function followBackPanel() {
  const prefs = followDeskPrefs();
  const caps = [20, 40, 100].map((cap) => `<button type="button" data-follow-cap="${cap}" aria-pressed="${prefs.cap === cap ? 'true' : 'false'}">${cap} a day</button>`).join('');
  return `<h2>Follow back</h2>
    <p class="dim">While LibreSky is open, this follows people who follow you. It skips anyone you unfollow here until you release them. A long run pauses if Bluesky asks for a break, and the daily count resets at midnight on this computer.</p>
    ${switchRow('follow.auto', 'Auto follow back', prefs.auto, 'Runs when you are signed in and this tab is open.')}
    ${switchRow('follow.skipSpam', 'Skip likely spam', prefs.skipSpam, 'New empty accounts, random handles, and follow-for-follow pitches stay unfollowed.')}
    <h3>Pace</h3>
    <div class="segmented wrap" role="group" aria-label="Follow back pace">${caps}</div>
    <p id="followback-status" class="dim">${escapeHtml(followBackStatusText())}</p>
    <div class="toolbar">
      <button type="button" class="primary small" id="followback-now" data-act="followback-now">Follow back now</button>
      <button type="button" class="text-btn" id="followback-release" data-act="followback-release">Release held</button>
    </div>`;
}

function followCleanupPanel() {
  const filters = followCleanup.filters;
  const choice = (key, options) => options.map(([id, label]) => `<button type="button" data-cleanup="${key}" data-value="${id}" aria-pressed="${filters[key] === id ? 'true' : 'false'}">${label}</button>`).join('');
  const note = signedIn() ? 'Loading people you follow…' : 'Sign in to load people you follow.';
  return `${followBackPanel()}
    <h2>Clean up follows</h2>
    <p class="dim">Find accounts you followed without looking, especially empty ones and ones that do not follow you back. Each row says why it looks off. Unfollow keeps them off auto follow back until you release them, and Follow them again puts the last batch back.</p>
    <h3>Looks like</h3>
    <div class="segmented wrap" role="group" aria-label="Looks like">${choice('spam', [['any', 'Anyone'], ['likely', 'Likely spam'], ['bare', 'Bare account'], ['accident', 'Followed by accident']])}</div>
    <h3>You followed them</h3>
    <div class="segmented wrap" role="group" aria-label="You followed them">${choice('recent', [['any', 'Any time'], ['7', 'Past 7 days'], ['30', 'Past 30 days']])}</div>
    <h3>Followers</h3>
    <div class="segmented wrap" role="group" aria-label="Followers">${choice('popularity', [['any', 'Any'], ['under-100', 'Under 100'], ['under-1k', 'Under 1,000'], ['under-10k', 'Under 10,000'], ['over-10k', '10,000 or more']])}</div>
    <h3>Follows you back</h3>
    <div class="segmented wrap" role="group" aria-label="Follows you back">${choice('mutual', [['any', 'Anyone'], ['yes', 'Follows you'], ['no', 'Does not follow you']])}</div>
    <h3>Your last reply</h3>
    <div class="segmented wrap" role="group" aria-label="Your last reply">${choice('reply', [['any', 'Any time'], ['none', 'No reply found'], ['30', 'Not in 30 days'], ['90', 'Not in 90 days'], ['365', 'Not in a year']])}</div>
    <h3>Sort</h3>
    <div class="segmented wrap" role="group" aria-label="Sort">${choice('sort', [['name', 'Name'], ['spam', 'Most likely spam'], ['recent', 'Followed recently'], ['followers', 'Fewest followers'], ['followers-desc', 'Most followers'], ['reply', 'Oldest reply']])}</div>
    <input id="cleanup-find" class="lang-find" placeholder="Name or handle" aria-label="Find a person you follow" maxlength="80" autocomplete="off" value="${escapeHtml(filters.q)}">
    <p id="cleanup-status" class="dim">${note}</p>
    <div class="toolbar">
      <button type="button" class="text-btn" data-act="cleanup-select">Select matches</button>
      <button type="button" class="text-btn" data-act="cleanup-select-spam">Select likely spam</button>
      <button type="button" class="text-btn" data-act="cleanup-clear">Clear</button>
      <button type="button" class="text-btn" id="cleanup-undo" data-act="cleanup-undo" hidden>Follow them again</button>
      <button type="button" class="danger" id="cleanup-spam" data-act="cleanup-spam">Unfollow likely spam</button>
      <button type="button" class="danger" id="cleanup-unfollow" data-act="cleanup-unfollow" disabled>Unfollow selected</button>
    </div>
    <div id="cleanup-list" class="directory"></div>`;
}

function cleanupName(a, b) {
  const left = a.displayName || a.handle || '';
  const right = b.displayName || b.handle || '';
  return left.localeCompare(right, undefined, { sensitivity: 'base' });
}

function cleanupMatches() {
  const now = Date.now();
  const filters = {
    ...followCleanup.filters,
    replyReady: followCleanup.scan === 'done' || followCleanup.scan === 'capped',
    datesReady: followCleanup.dates === 'done' || followCleanup.dates === 'error',
  };
  const list = followCleanup.people.filter((person) => followCleanupMatch(person, filters, now));
  const sort = filters.sort;
  list.sort((a, b) => {
    if (sort === 'followers') return a.followers - b.followers || cleanupName(a, b);
    if (sort === 'followers-desc') return b.followers - a.followers || cleanupName(a, b);
    if (sort === 'reply') return (a.replyAt || 0) - (b.replyAt || 0) || cleanupName(a, b);
    if (sort === 'recent') return (b.followedAt || 0) - (a.followedAt || 0) || cleanupName(a, b);
    if (sort === 'spam') return followSpam(b, now).score - followSpam(a, now).score || cleanupName(a, b);
    return cleanupName(a, b);
  });
  return list;
}

function cleanupPicked(matches) {
  return matches.filter((person) => followCleanup.selected.has(person.did) && person.followingUri);
}

function cleanupReplyLabel(person) {
  if (person.replyAt) return `You replied ${timeAgo(new Date(person.replyAt).toISOString())}`;
  if (followCleanup.scan === 'done' || followCleanup.scan === 'capped') return 'No reply in checked posts';
  if (followCleanup.scan === 'error') return 'Last reply unavailable';
  return 'Last reply still loading';
}

function cleanupStatusText(matches) {
  if (!signedIn()) return 'Sign in to load people you follow.';
  if (!followCleanup.people.length && followCleanup.loading) return 'Loading people you follow…';
  if (!followCleanup.people.length) return followCleanup.loadError || 'You do not follow anyone yet.';
  const matchCount = matches.length;
  const picked = matches.filter((person) => followCleanup.selected.has(person.did)).length;
  const matchLabel = `${fullCount(matchCount)} ${matchCount === 1 ? 'match' : 'matches'}`;
  const totalLabel = `${fullCount(followCleanup.people.length)} following${followCleanup.moreFollows ? ' loaded' : ''}`;
  const selectedLabel = picked ? ` · ${fullCount(picked)} selected` : '';
  const loading = followCleanup.loading ? ' Loading the rest…' : '';
  const note = followCleanup.scanNote ? ` ${followCleanup.scanNote}` : '';
  const dates = followCleanup.dates === 'running' ? ' Checking when you followed them…' : '';
  const extra = followCleanup.loadError ? ` ${followCleanup.loadError}` : '';
  return `${matchLabel} · ${totalLabel}${selectedLabel}.${loading}${dates}${note}${extra}`;
}

function cleanupEmptyHtml() {
  if (!signedIn()) return '<p class="dim">Sign in to load people you follow.</p>';
  if (followCleanup.loading && !followCleanup.people.length) return '<p class="dim">Loading people you follow…</p>';
  if (!followCleanup.people.length) return '<p class="dim">You do not follow anyone yet.</p>';
  if (followCleanup.filters.reply !== 'any' && followCleanup.scan !== 'done' && followCleanup.scan !== 'capped') {
    return '<p class="dim">Last reply is still loading. Matches show up as your posts are checked.</p>';
  }
  if ((followCleanup.filters.recent === '7' || followCleanup.filters.recent === '30') && followCleanup.dates !== 'done' && followCleanup.dates !== 'error') {
    return '<p class="dim">The date you followed them is still loading.</p>';
  }
  return '<p class="dim">Nothing matches these filters.</p>';
}

function cleanupWhy(person) {
  const reasons = followSpam(person).reasons.slice(0, 3);
  if (!reasons.length) return '';
  return `<span class="why">${reasons.map((reason) => `<span class="why-chip">${escapeHtml(reason)}</span>`).join('')}</span>`;
}

function cleanupRow(person) {
  const name = person.displayName || person.handle || 'Account';
  const on = followCleanup.selected.has(person.did);
  const mutual = person.mutual ? 'Follows you' : 'Does not follow you';
  const followed = person.followedAt ? ` · You followed ${timeAgo(new Date(person.followedAt).toISOString())}` : '';
  const meta = `${fullCount(person.followers)} followers · ${mutual} · ${cleanupReplyLabel(person)}${followed}`;
  const unfollow = person.followingUri ? '' : ' disabled';
  return `<div class="person cleanup-person${on ? ' on' : ''}">
    <label class="cleanup-check"><input type="checkbox" data-cleanup-did="${escapeHtml(person.did)}"${on ? ' checked' : ''} aria-label="Select ${escapeHtml(name)}"></label>
    ${accountIcon(person)}
    <a class="person-link" href="${profileHash(person)}"><strong>${escapeHtml(name)}</strong><span class="handle">@${escapeHtml(person.handle || '')}</span><span class="snip">${escapeHtml(meta)}</span>${cleanupWhy(person)}</a>
    <button type="button" class="danger mini" data-act="cleanup-one" data-did="${escapeHtml(person.did)}"${unfollow}>Unfollow</button>
  </div>`;
}

function paintCleanupChrome(matches = cleanupMatches()) {
  const status = $('cleanup-status');
  if (status) status.textContent = cleanupStatusText(matches);
  const button = $('cleanup-unfollow');
  const picked = cleanupPicked(matches);
  if (button && !followCleanup.busy) {
    button.disabled = !picked.length;
    button.textContent = picked.length ? `Unfollow ${fullCount(picked.length)}` : 'Unfollow selected';
  }
  const select = document.querySelector('[data-act="cleanup-select"]');
  if (select) select.disabled = followCleanup.busy || !matches.some((person) => person.followingUri);
  const spam = document.querySelector('[data-act="cleanup-select-spam"]');
  if (spam) spam.disabled = followCleanup.busy || !matches.some((person) => person.followingUri && followSpam(person).likely);
  const drop = $('cleanup-spam');
  if (drop) drop.disabled = followCleanup.busy || !followCleanup.people.some((person) => person.followingUri && followSpam(person).likely);
  const undo = $('cleanup-undo');
  if (undo) {
    const count = followCleanup.undo.length;
    undo.hidden = !count;
    undo.disabled = followCleanup.busy || !count;
    undo.textContent = count ? `Follow ${fullCount(count)} again` : 'Follow them again';
  }
  paintFollowBack();
}

function paintFollowCleanup(options = {}) {
  const matches = cleanupMatches();
  paintCleanupChrome(matches);
  const list = $('cleanup-list');
  if (!list || options.list === false) return;
  const visible = matches.slice(0, followCleanup.shown);
  const left = matches.length - visible.length;
  const more = left > 0
    ? `<button type="button" class="text-btn cleanup-more" data-act="cleanup-more">Show ${fullCount(Math.min(200, left))} more</button>`
    : '';
  list.innerHTML = visible.length ? visible.map(cleanupRow).join('') + more : cleanupEmptyHtml();
}

function setCleanupFilter(key, value) {
  if (!Object.prototype.hasOwnProperty.call(followCleanup.filters, key)) return;
  if (followCleanup.filters[key] === value) return;
  followCleanup.filters[key] = value;
  followCleanup.shown = 200;
  document.querySelectorAll(`[data-cleanup="${key}"]`).forEach((button) => {
    button.setAttribute('aria-pressed', button.dataset.value === value ? 'true' : 'false');
  });
  paintFollowCleanup();
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function loadFollowCleanup(token = generation) {
  if (!$('cleanup-list')) return;
  if (!signedIn()) {
    paintFollowCleanup();
    return;
  }
  const did = myDid();
  if (followCleanup.did !== did) {
    cleanupScanId += 1;
    cleanupLoadId += 1;
    followCleanup = blankFollowCleanup(did);
  }
  if (followCleanup.followsLoaded) {
    paintFollowCleanup();
    if (followCleanup.scan === 'idle' || followCleanup.scan === 'error') scanCleanupReplies();
    if (followCleanup.dates === 'idle' || followCleanup.dates === 'error') scanFollowDates();
    return;
  }
  if (followCleanup.loading && followCleanup.loadToken === token) return;
  if (followCleanup.loading) cleanupLoadId += 1;
  const loadId = ++cleanupLoadId;
  followCleanup.loading = true;
  followCleanup.loadToken = token;
  followCleanup.loadError = '';
  paintFollowCleanup();
  const seen = new Map();
  let cursor = '';
  let previous = '';
  let more = false;
  try {
    for (let page = 0; page < 100; page += 1) {
      if (loadId !== cleanupLoadId || followCleanup.did !== did) return;
      const data = await api.getFollows(did, cursor || undefined, undefined, 100);
      if (loadId !== cleanupLoadId || followCleanup.did !== did) return;
      (data.follows || []).forEach((actor) => {
        if (!actor?.did || actor.did === did) return;
        seen.set(actor.did, personFromActor(actor, seen.get(actor.did)));
      });
      followCleanup.people = [...seen.values()];
      const ids = (data.follows || []).map((actor) => actor?.did || '').join(',');
      if (!data.cursor || data.cursor === cursor || (ids && ids === previous)) {
        more = false;
        break;
      }
      previous = ids;
      cursor = data.cursor;
      more = page === 99;
      if (page % 2 === 1) paintFollowCleanup();
    }
    if (loadId !== cleanupLoadId || followCleanup.did !== did) return;
    followCleanup.moreFollows = more;
    followCleanup.followsLoaded = true;
    followCleanup.loading = false;
    paintFollowCleanup();
    scanCleanupReplies();
    scanFollowDates();
  } catch (error) {
    if (loadId !== cleanupLoadId || followCleanup.did !== did) return;
    followCleanup.loading = false;
    followCleanup.loadError = error.message || 'Could not load people you follow.';
    paintFollowCleanup();
    if (followCleanup.people.length) {
      scanCleanupReplies();
      scanFollowDates();
    }
  }
}

async function scanCleanupReplies() {
  if (!signedIn() || !followCleanup.people.length) return;
  if (followCleanup.scan === 'running' || followCleanup.scan === 'done' || followCleanup.scan === 'capped') return;
  const did = followCleanup.did;
  const mine = ++cleanupScanId;
  followCleanup.scan = 'running';
  followCleanup.scanNote = followCleanup.postsSeen
    ? `Checking your posts for replies… ${fullCount(followCleanup.postsSeen)} posts`
    : 'Checking your posts for replies…';
  paintFollowCleanup({ list: false });
  let cursor = followCleanup.scanCursor || '';
  let previous = '';
  let oldest = Date.now();
  try {
    for (let page = 0; page < CLEANUP_REPLY_PAGES; page += 1) {
      if (mine !== cleanupScanId || followCleanup.did !== did) return;
      const data = await api.getAuthorFeed(did, 'posts_with_replies', cursor || undefined, undefined, 100);
      if (mine !== cleanupScanId || followCleanup.did !== did) return;
      const feed = data.feed || [];
      feed.forEach((item) => {
        const when = Date.parse(item?.post?.indexedAt || item?.post?.record?.createdAt || '');
        if (Number.isFinite(when)) oldest = Math.min(oldest, when);
        replyTargets(item, did).forEach((hit) => {
          const prev = followCleanup.replyAt.get(hit.did) || 0;
          if (hit.at > prev) followCleanup.replyAt.set(hit.did, hit.at);
        });
      });
      let changed = false;
      followCleanup.people.forEach((person) => {
        const at = followCleanup.replyAt.get(person.did) || 0;
        if (at > person.replyAt) {
          person.replyAt = at;
          changed = true;
        }
      });
      followCleanup.postsSeen += feed.length;
      followCleanup.scanNote = `Checking your posts for replies… ${fullCount(followCleanup.postsSeen)} posts`;
      const ids = feed.map((item) => item?.post?.uri || '').join(',');
      const stop = !data.cursor || data.cursor === cursor || (ids && ids === previous);
      const aged = oldest < Date.now() - CLEANUP_REPLY_YEAR;
      const replyView = followCleanup.filters.reply !== 'any' || followCleanup.filters.sort === 'reply';
      paintFollowCleanup({ list: changed && replyView });
      if (stop || aged) {
        followCleanup.scan = 'done';
        followCleanup.scanNote = aged
          ? 'Last reply looks through your posts from about the past year.'
          : 'Last reply looks through the posts loaded from your account.';
        followCleanup.scanCursor = '';
        paintFollowCleanup();
        return;
      }
      previous = ids;
      cursor = data.cursor || '';
      followCleanup.scanCursor = cursor;
      await delay(120);
    }
    if (mine !== cleanupScanId) return;
    followCleanup.scan = 'capped';
    followCleanup.scanNote = `Last reply looks through your newest ${fullCount(followCleanup.postsSeen)} posts. Older replies are not included.`;
    paintFollowCleanup();
  } catch (error) {
    if (mine !== cleanupScanId) return;
    followCleanup.scan = 'error';
    followCleanup.scanNote = error.message || 'Could not check your replies.';
    paintFollowCleanup();
  }
}

async function unfollowCleanup(people, button) {
  if (followCleanup.busy) return;
  const due = (people || []).filter((person) => person?.followingUri && followCleanup.people.some((item) => item.did === person.did));
  if (!due.length) {
    toast('Select people to unfollow.');
    return;
  }
  const batch = due.slice(0, CLEANUP_UNFOLLOW_CAP);
  const rest = due.length - batch.length;
  if (batch.length > 1) {
    const message = rest
      ? `Unfollow ${batch.length} of ${due.length} people now? The rest stay selected. Bluesky slows down a long run.`
      : `Unfollow ${batch.length} people?`;
    if (!window.confirm(message)) return;
  }
  followCleanup.busy = true;
  if (button) button.disabled = true;
  let done = 0;
  let limited = false;
  let stopped = '';
  const removed = [];
  try {
    for (let index = 0; index < batch.length; index += 1) {
      const person = batch[index];
      if (button?.isConnected) button.textContent = `Unfollowing ${index + 1} of ${batch.length}…`;
      try {
        await api.deleteRecord(person.followingUri);
      } catch (error) {
        if (error?.status === 429) {
          limited = true;
          break;
        }
        if (error?.status !== 400) {
          stopped = error.message || `Could not unfollow @${person.handle || 'that account'}`;
          break;
        }
      }
      done += 1;
      removed.push(person);
      followCleanup.people = followCleanup.people.filter((item) => item.did !== person.did);
      followCleanup.selected.delete(person.did);
      followCache.set(person.did, false);
      syncFollow(person.did, '');
      if (index < batch.length - 1) await delay(300);
    }
  } finally {
    if (removed.length) {
      holdFollowTargets(followCleanup.did, removed.map((person) => person.did));
      const kept = followCleanup.undo.filter((item) => !removed.some((person) => person.did === item.did));
      writeFollowUndo(followCleanup.did, [...removed.map(undoPerson), ...kept]);
    }
    followCleanup.busy = false;
    paintFollowCleanup();
  }
  const noun = done === 1 ? 'person' : 'people';
  const tail = limited
    ? ' Bluesky asked for a pause. The rest stay selected.'
    : (rest && !stopped ? ' The rest stay selected.' : '');
  if (stopped) toast(done ? `Unfollowed ${done} ${noun}. ${stopped}` : stopped);
  else toast(done ? `Unfollowed ${done} ${noun}.${tail}` : 'Nobody was unfollowed.');
}

function undoPerson(person) {
  return {
    did: person.did,
    handle: person.handle || '',
    displayName: person.displayName || '',
    description: person.description || '',
    avatar: person.avatar || '',
    followers: person.followers || 0,
    follows: person.follows ?? null,
    posts: person.posts ?? null,
    createdAt: person.createdAt || 0,
    followedAt: person.followedAt || 0,
    mutual: Boolean(person.mutual),
  };
}

async function scanFollowDates() {
  if (!signedIn() || !followCleanup.people.length) return;
  if (followCleanup.dates === 'running' || followCleanup.dates === 'done') return;
  const did = followCleanup.did;
  const mine = ++cleanupDateId;
  followCleanup.dates = 'running';
  paintFollowCleanup({ list: false });
  const byDid = new Map(followCleanup.people.map((person) => [person.did, person]));
  let cursor = '';
  let previous = '';
  try {
    for (let page = 0; page < 100; page += 1) {
      if (mine !== cleanupDateId || followCleanup.did !== did) return;
      const data = await api.listRecords('app.bsky.graph.follow', cursor || undefined);
      if (mine !== cleanupDateId || followCleanup.did !== did) return;
      let changed = false;
      (data.records || []).forEach((record) => {
        const row = byDid.get(record?.value?.subject);
        if (!row) return;
        if (!row.followingUri && record.uri) {
          row.followingUri = record.uri;
          changed = true;
        }
        const at = Date.parse(record?.value?.createdAt || '');
        if (Number.isFinite(at) && at !== row.followedAt) {
          row.followedAt = at;
          changed = true;
        }
      });
      const wantsDates = followCleanup.filters.recent !== 'any' || followCleanup.filters.sort === 'recent';
      if (changed) paintFollowCleanup({ list: wantsDates });
      const ids = (data.records || []).map((record) => record?.uri || '').join(',');
      if (!data.cursor || data.cursor === cursor || (ids && ids === previous)) {
        followCleanup.dates = 'done';
        paintFollowCleanup();
        return;
      }
      previous = ids;
      cursor = data.cursor;
      await delay(80);
    }
    if (mine !== cleanupDateId) return;
    followCleanup.dates = 'done';
    paintFollowCleanup();
  } catch {
    if (mine !== cleanupDateId) return;
    followCleanup.dates = 'error';
    paintFollowCleanup();
  }
}

async function undoCleanup(button) {
  if (followCleanup.busy) return;
  const due = followCleanup.undo.slice(0, CLEANUP_UNFOLLOW_CAP);
  if (!due.length) {
    toast('Nobody is waiting to be followed again.');
    return;
  }
  const rest = followCleanup.undo.length - due.length;
  const message = rest
    ? `Follow ${due.length} of ${followCleanup.undo.length} people again? The rest stay on the button.`
    : `Follow ${due.length} ${due.length === 1 ? 'person' : 'people'} again?`;
  if (!window.confirm(message)) return;
  followCleanup.busy = true;
  if (button) button.disabled = true;
  const owner = followCleanup.did;
  let done = 0;
  let limited = false;
  let stopped = '';
  try {
    for (let index = 0; index < due.length; index += 1) {
      const person = due[index];
      if (button?.isConnected) button.textContent = `Following ${index + 1} of ${due.length}…`;
      try {
        const created = await api.follow(person.did);
        const uri = created?.uri || '';
        dropFollowHold(owner, person.did);
        followCache.set(person.did, true);
        syncFollow(person.did, uri);
        const row = followCleanup.people.find((item) => item.did === person.did);
        if (row) row.followingUri = uri || row.followingUri;
        else followCleanup.people.push({ ...undoPerson(person), followingUri: uri, replyAt: followCleanup.replyAt.get(person.did) || 0 });
        done += 1;
      } catch (error) {
        if (error?.status === 429) limited = true;
        else stopped = error.message || `Could not follow @${person.handle || 'that account'}`;
        break;
      }
      if (index < due.length - 1) await delay(900);
    }
  } finally {
    writeFollowUndo(owner, followCleanup.undo.slice(done));
    followCleanup.busy = false;
    paintFollowCleanup();
  }
  const noun = done === 1 ? 'person' : 'people';
  const tail = limited ? ' Bluesky asked for a pause. The rest stay on the button.' : (rest && !stopped ? ' The rest stay on the button.' : '');
  if (stopped) toast(done ? `Followed ${done} ${noun} again. ${stopped}` : stopped);
  else toast(done ? `Followed ${done} ${noun} again.${tail}` : 'Nobody was followed.');
}

function armFollowBack() {
  if (armFollowBack.timer) return;
  armFollowBack.timer = setInterval(() => {
    if (document.visibilityState !== 'visible') return;
    if (!signedIn() || !followDeskPrefs().auto) return;
    runFollowBack(false);
  }, 3 * 60 * 1000);
}

async function runFollowBack(manual) {
  if (!signedIn()) {
    if (manual) requireSignIn();
    return;
  }
  const prefs = followDeskPrefs();
  if (!manual && !prefs.auto) return;
  if (followBack.busy) {
    if (manual) toast('Follow back is already running.');
    return;
  }
  const owner = myDid();
  const run = ++followBackRun;
  followBack.busy = true;
  followBack.note = 'Looking at people who follow you…';
  paintFollowBack();
  const held = followHoldSet(owner);
  let followed = 0;
  let skipped = 0;
  let heldCount = 0;
  let limited = false;
  let stopped = '';
  let used = followBackToday(owner);
  const cap = prefs.cap;
  try {
    let cursor = '';
    let previous = '';
    for (let page = 0; page < 8 && used < cap && !limited && !stopped; page += 1) {
      if (run !== followBackRun || myDid() !== owner) return;
      const data = await api.getFollowers(owner, cursor || undefined, undefined, 100);
      if (run !== followBackRun || myDid() !== owner) return;
      const list = data.followers || [];
      for (const actor of list) {
        if (run !== followBackRun || myDid() !== owner) return;
        if (!actor?.did || actor.did === owner || used >= cap) continue;
        const createdAt = Date.parse(actor.createdAt || '');
        const person = {
          did: actor.did,
          handle: actor.handle || '',
          displayName: actor.displayName || '',
          description: typeof actor.description === 'string' ? actor.description : '',
          avatar: actor.avatar || '',
          followers: Number(actor.followersCount) || 0,
          follows: optionalCount(actor.followsCount, null),
          posts: optionalCount(actor.postsCount, null),
          createdAt: Number.isFinite(createdAt) ? createdAt : 0,
          followingUri: actor.viewer?.following || '',
        };
        const choice = shouldFollowBack(person, { skipSpam: prefs.skipSpam, held: held.has(actor.did) });
        if (!choice.yes) {
          if (choice.reason === 'You unfollowed them') heldCount += 1;
          else if (choice.reason && choice.reason !== 'Already following') skipped += 1;
          continue;
        }
        try {
          const created = await api.follow(actor.did);
          followed += 1;
          used = noteFollowBack(owner, 1);
          dropFollowHold(owner, actor.did);
          held.delete(actor.did);
          followCache.set(actor.did, true);
          syncFollow(actor.did, created?.uri || '');
          followBack.note = `Followed back ${fullCount(followed)}.`;
          paintFollowBack();
        } catch (error) {
          if (error?.status === 429) limited = true;
          else stopped = error.message || 'Could not follow back.';
          break;
        }
        if (used < cap && !limited) await delay(900);
      }
      const ids = list.map((actor) => actor?.did || '').join(',');
      if (!data.cursor || data.cursor === cursor || (ids && ids === previous)) break;
      previous = ids;
      cursor = data.cursor;
    }
  } catch (error) {
    if (run === followBackRun && myDid() === owner) stopped = stopped || error.message || 'Could not load people who follow you.';
  } finally {
    if (run !== followBackRun) return;
    followBack.busy = false;
    if (myDid() !== owner) {
      followBack.note = '';
      paintFollowBack();
      return;
    }
    const bits = [followed ? `Followed back ${fullCount(followed)}` : 'No one new to follow back'];
    if (skipped) bits.push(`skipped ${fullCount(skipped)} that look like spam`);
    if (heldCount) bits.push(`${fullCount(heldCount)} held`);
    if (followed && used >= cap) bits.push(`today’s pace is ${fullCount(cap)}`);
    if (limited) bits.push('Bluesky asked for a pause');
    followBack.note = `${bits.join('. ')}.`;
    if (stopped) followBack.note = `${followBack.note} ${stopped}`;
    paintFollowBack();
    if (manual || followed) toast(followBack.note);
  }
}

function allowButtons(kind, current) {
  return [
    ['all', 'Everyone'],
    ['following', 'People you follow'],
    ['none', 'No one'],
  ].map(([id, label]) => `<button type="button" data-${kind}-allow="${id}" aria-pressed="${current === id ? 'true' : 'false'}">${label}</button>`).join('');
}

function paintAllow(kind, value) {
  document.querySelectorAll(`[data-${kind}-allow]`).forEach((button) => {
    button.setAttribute('aria-pressed', button.dataset[`${kind}Allow`] === value ? 'true' : 'false');
  });
}

async function loadChatAllow(token = generation) {
  if (!signedIn() || !$('chat-allow')) return;
  try {
    const allow = await api.readChatDeclaration();
    if (token !== generation || !$('chat-allow') || $('chat-allow').dataset.touched === '1') return;
    paintAllow('chat', allow);
  } catch {
    /* the buttons stay on Everyone until the record can be read */
  }
}

async function chooseChatAllow(allow) {
  if (!signedIn()) return requireSignIn();
  const row = $('chat-allow');
  if (row) row.dataset.touched = '1';
  paintAllow('chat', allow);
  try {
    await api.writeChatDeclaration(allow);
    toast(allow === 'none' ? 'New chats are off' : allow === 'following' ? 'Only people you follow can message you' : 'Anyone can send a message request');
  } catch (error) {
    toast(error.message || 'Could not save who can message you.');
    loadChatAllow();
  }
}

function chooseCallAllow(allow) {
  if (!signedIn()) return requireSignIn();
  const saved = saveCallAllow(allow);
  paintAllow('call', saved);
  toast(saved === 'none' ? 'New calls are off' : saved === 'following' ? 'Only people you follow can call you' : 'Other people can send a call request');
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
  setChrome({ title: AI_NAME, nav: 'ai', back: true });
  const saved = loadAi();
  const ready = aiReady(saved);
  const usingFallback = !saved?.apiKey;
  const waiting = aiThread.some((turn) => turn.role === 'pending');
  const turns = aiThread.map((turn) => {
    if (turn.role === 'assistant' || turn.role === 'pending') return assistantHtml(turn.content, { kicker: AI_NAME });
    if (turn.role === 'error') return assistantHtml(turn.content, { kicker: 'Could not answer' });
    return `<div class="bubble mine"><p>${richText(turn.content)}</p></div>`;
  }).join('');
  const askForm = `<form class="reply-bar ai-ask" id="ai-ask">
      <div class="composer-field chat-field"><pre class="field-highlight" id="ai-highlight" aria-hidden="true"></pre><textarea id="ai-text" rows="3" maxlength="4000" placeholder="Ask ${AI_NAME}"${waiting ? ' disabled' : ''}></textarea></div>
      <span class="tip-wrap" data-tip="Shift+Enter asks"><button class="primary small" type="submit" aria-keyshortcuts="Shift+Enter" data-tip="Shift+Enter asks"${waiting ? ' disabled' : ''}>Ask</button></span>
      <p class="chat-hint"><span class="chat-hint-keys">Shift+Enter asks. Enter adds a line. Tab completes.</span><span class="chat-hint-touch">Enter adds a line. Tap Ask.</span></p>
    </form>`;
  if (ready) {
    const empty = turns ? '' : `<p class="dim ai-empty">Ask ${AI_NAME} anything. @ai and @si in a chat use this same account and are not sent to the other person.</p>`;
    const line = usingFallback
      ? `<p class="ai-ready-line"><strong>${AI_NAME}</strong> is on with a free public model. <a class="text-link" href="#/settings">Add a key</a></p>`
      : `<p class="ai-ready-line"><strong>${AI_NAME}</strong> is on. <a class="text-link" href="#/settings">Settings</a></p>`;
    $('view').innerHTML = `<section class="settings ai-doc ai-live">
      ${line}
      <div class="messages ai-thread">${empty}${turns}</div>
      ${askForm}
    </section>`;
  } else {
    $('view').innerHTML = `<section class="settings ai-doc">
      <h2>${AI_NAME}</h2>
      <p>${AI_NAME} could not start. <a class="text-link" href="#/settings">Settings</a> can add a key.</p>
    </section>`;
  }
  const area = $('ai-text');
  if (area) {
    paintFieldHighlight(area, $('ai-highlight'));
    applyFieldLanguage(area);
    fitChatInput(area);
  }
  const pending = aiPending;
  aiPending = '';
  if (pending && ready) askOnPage(pending);
}

function aiHistory() {
  return aiThread
    .filter((turn) => turn.role === 'user' || turn.role === 'assistant')
    .slice(-8)
    .map((turn) => ({ role: turn.role, content: turn.content }));
}

async function askOnPage(text) {
  const note = aiPendingNote;
  aiPendingNote = 'Page';
  const saved = loadAi();
  if (!aiReady(saved)) {
    toast('AI Assist could not start. Add a key in Settings.');
    return;
  }
  const seq = ++aiSeq;
  aiThread = aiThread.filter((turn) => turn.role !== 'pending');
  aiThread = [...aiThread, { role: 'user', content: text }, { role: 'pending', content: 'Reading…' }].slice(-40);
  if (parseHash()[0] === 'ai') showAi();
  try {
    const answer = await askAi(saved, [
      { role: 'system', content: AI_SYSTEM },
      ...aiHistory(),
    ], AbortSignal.timeout ? AbortSignal.timeout(AI_TIMEOUT_MS) : undefined, note);
    if (seq !== aiSeq) return;
    aiThread = aiThread.filter((turn) => turn.role !== 'pending');
    aiThread = [...aiThread, { role: 'assistant', content: answer }].slice(-40);
    if (parseHash()[0] === 'ai') showAi();
  } catch (error) {
    if (seq !== aiSeq) return;
    const message = error?.message || 'The account did not answer.';
    aiThread = aiThread.filter((turn) => turn.role !== 'pending');
    aiThread = [...aiThread, { role: 'error', content: message }].slice(-40);
    if (parseHash()[0] === 'ai') showAi();
    toast(message);
  }
}

async function showCalls() {
  const token = ++generation;
  setChrome({ title: 'Calls', nav: 'calls' });
  const ready = canCall();
  const note = ready
    ? 'Voice and video connect two LibreSky windows. Mute and the camera stay on your side, and the time shows once you are connected. Enter a handle to call someone new, or pick someone you already chat with. An incoming call can be accepted or declined.'
    : 'This page is not a secure context, or this browser has no WebRTC, so a call cannot start here. Open LibreSky over https, or on http://127.0.0.1.';
  if (!signedIn()) {
    $('view').innerHTML = `<p class="call-note dim">${escapeHtml(note)}</p>${emptyHtml('Calls', 'Sign in to start a voice or video call.', '<button type="button" class="primary" data-act="signin">Sign in</button>')}`;
    return;
  }
  showSkeletons();
  try {
    const { main, requests } = await loadConvoPages();
    if (token !== generation) return;
    const { requests: waiting } = await classifyCalls([...requests, ...main]);
    if (token !== generation) return;
    const requestRows = waiting.map((offer) => callRequestHtml(offer)).join('');
    const requestBlock = requestRows ? `<h2 class="section-label">Call requests</h2>${requestRows}` : '';
    const rows = main.map((convo) => callConvoHtml(convo, myDid())).join('');
    $('view').innerHTML = `<p class="call-note dim">${escapeHtml(note)}</p>${callStartHtml()}${requestBlock}${rows || emptyHtml('No chats yet', 'Enter a handle above to start a voice or video call.')}`;
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
  ['LibreSky-linux-x64.zip', 'Linux', 'LibreSky-Linux.zip', 'Unzip the folder and run the LibreSky file.'],
  ['LibreSky-windows-x64.zip', 'Windows', 'LibreSky-Windows.zip', 'Unzip the folder and run LibreSky.exe.'],
  ['LibreSky-mac-x64.zip', 'Mac', 'LibreSky-Mac.zip', 'Unzip the folder, then right-click LibreSky.app and choose Open. The Mac app is not signed.'],
];

let desktopManifest = null;

function downloadsHtml(compact) {
  const links = DOWNLOADS.map(([file, label, saveAs]) => `<button type="button" class="download-btn" data-act="desktop-download" data-file="${escapeHtml(file)}" data-save="${escapeHtml(saveAs)}"><strong>${escapeHtml(label)}</strong><span>${escapeHtml(saveAs)}</span></button>`).join('');
  const notes = compact
    ? '<p class="dim download-note">The Mac app is not signed. Right-click it and choose Open the first time. Each button saves a different file.</p>'
    : `<ul class="download-notes">${DOWNLOADS.map(([, label, saveAs, note]) => `<li><strong>${escapeHtml(label)} saves ${escapeHtml(saveAs)}.</strong> ${escapeHtml(note)}</li>`).join('')}</ul>`;
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
  const label = button?.innerHTML || '';
  const saveAs = button?.dataset.save || DOWNLOADS.find(([name]) => name === file)?.[2] || file;
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
    saveBlob(new Blob(chunks, { type: 'application/zip' }), saveAs);
    toast(`Saved ${saveAs}. Unzip it and run LibreSky.`);
  } catch (error) {
    toast(error?.message || 'The download failed.');
  } finally {
    if (button?.isConnected) {
      button.disabled = false;
      button.innerHTML = label;
    }
  }
}

function showSupport() {
  generation += 1;
  setChrome({ title: 'Support', nav: 'support', back: true });
  $('view').innerHTML = `<div class="support-page"><h2>Support development</h2><p>LibreSky is free. A payment helps the work continue: the browser client, the desktop apps, and what comes next.</p><p><a class="primary support-pay" href="https://www.paypal.com/ncp/payment/4P85EQRES3RGU" target="_blank" rel="noopener noreferrer">PayPal</a></p><p class="dim">PayPal opens in a new tab. LibreSky does not see the payment.</p></div>`;
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

function noteNav() {
  const hash = location.hash || '#/';
  if (navStack[navStack.length - 1] === hash) return;
  if (navStack.length > 1 && navStack[navStack.length - 2] === hash) {
    navStack.pop();
    return;
  }
  navStack.push(hash);
  if (navStack.length > 40) navStack.shift();
}

function fallbackBack() {
  const [a, b, c] = parseHash();
  if (!a || a === 'discover' || a === 'lane') return '#/';
  if (a === 'messages' && b) return '#/messages';
  if (a === 'notifications' && b) return '#/notifications';
  if (a === 'profile' && b && c) return `#/profile/${encodeURIComponent(b)}`;
  if (a === 'feed' && b) return '#/feeds';
  if (a === 'list' && b) return '#/lists';
  if (a === 'pack' && b) return '#/packs';
  return '#/';
}

function goBack() {
  const here = location.hash || '#/';
  while (navStack.length && navStack[navStack.length - 1] === here) navStack.pop();
  const prev = navStack.length ? navStack[navStack.length - 1] : '';
  const target = prev && prev !== here ? prev : fallbackBack();
  if (!target || target === here) {
    if (here !== '#/') location.hash = '#/';
    return;
  }
  location.hash = target;
}

function route() {
  stopVideo();
  noteNav();
  closeMenu();
  closeAppMenu();
  closeAlphaMenu();
  if (designOn()) paintDesignReadout();
  hideSuggest();
  closeHover();
  stopSpeech();
  stopHomeWatch();
  if ($('view')) delete $('view').dataset.convoStatus;
  stopChatTimer();
  pager?.disconnect();
  selected = -1;
  const [a, b, c, d] = parseHash();
  if (!a) return showHome({ kind: 'following' });
  if (a === 'discover') return showHome({ kind: 'discover' });
  if (a === 'lane' && (b === 'list' || b === 'feed') && c) return showHome({ kind: 'lane', type: b, value: c });
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
  if (a === 'support') return showSupport();
  if (a === 'settings') return showSettings();
  if (a === 'profile' && b && c === 'post' && d) return showThread(b, d);
  if (a === 'profile' && b && (c === 'followers' || c === 'following')) return showPeople(b, c);
  if (a === 'profile' && b) return showProfile(b, c || 'posts');
  return showHome({ kind: 'following' });
}

function postFrom(node) {
  const article = node?.closest?.('.post');
  if (!article) return null;
  return { article, item: posts.get(article.dataset.uri), post: posts.get(article.dataset.uri)?.post || posts.get(article.dataset.uri) };
}

function gifEmbed(external) {
  const url = String(external?.url || '').toLowerCase();
  const title = String(external?.title || '').toLowerCase();
  return title === 'gif' || /giphy|tenor|klipy|gifs\.bsky/.test(url);
}

function replyGate(post) {
  const allow = post?.threadgate?.record?.allow || post?.threadgate?.allow;
  if (!Array.isArray(allow)) return 'everyone';
  if (!allow.length) return 'none';
  const types = allow.map((rule) => String(rule?.$type || ''));
  if (types.some((type) => type.includes('followingRule'))) return 'following';
  if (types.some((type) => type.includes('mentionRule'))) return 'mentioned';
  return 'everyone';
}

function editDraft(post) {
  const record = post?.record || {};
  const embed = record.embed || {};
  const type = String(embed.$type || '');
  const media = type.includes('recordWithMedia') ? (embed.media || {}) : embed;
  const mediaType = String(media.$type || '');
  const quoted = type.includes('recordWithMedia') ? embed.record : (mediaType === 'app.bsky.embed.record' ? embed : null);
  const view = post?.embed || {};
  const viewMedia = String(view.$type || '').includes('recordWithMedia') ? (view.media || {}) : view;
  const images = mediaType === 'app.bsky.embed.images'
    ? (media.images || []).map((image, index) => ({
      kept: true,
      alt: image.alt || '',
      blob: image.image,
      url: viewMedia.images?.[index]?.thumb || viewMedia.images?.[index]?.fullsize || '',
    })).filter((image) => image.blob)
    : [];
  const video = mediaType === 'app.bsky.embed.video' && media.video
    ? {
      kept: true,
      blob: media.video,
      alt: media.alt || '',
      aspectRatio: media.aspectRatio || viewMedia.aspectRatio || null,
      poster: viewMedia.thumbnail || '',
    }
    : null;
  const externalRecord = mediaType === 'app.bsky.embed.external' ? (media.external || null) : null;
  const viewExternal = String(viewMedia.$type || '').includes('external') ? (viewMedia.external || null) : null;
  const external = externalRecord?.uri
    ? {
      url: externalRecord.uri,
      title: externalRecord.title || '',
      description: externalRecord.description || '',
      thumbBlob: externalRecord.thumb || null,
      thumbUrl: viewExternal?.thumb || '',
    }
    : null;
  const ref = quoted?.record;
  const viewQuote = view.record || viewMedia.record || {};
  const quote = ref?.uri && ref?.cid
    ? { uri: ref.uri, cid: ref.cid, author: viewQuote.author || null, record: viewQuote.value || { text: '' } }
    : null;
  const parent = record.reply?.parent;
  const root = record.reply?.root;
  const reply = parent?.uri && parent?.cid && root?.uri
    ? {
      uri: parent.uri,
      cid: parent.cid,
      author: post?.reply?.parent?.author || {},
      record: { text: '', reply: { root } },
    }
    : null;
  return {
    text: record.text || '',
    images,
    video,
    external,
    quote,
    reply,
    langs: Array.isArray(record.langs) ? record.langs.slice(0, 3) : [],
    gate: replyGate(post),
  };
}

function editFingerprint(dialog) {
  const files = (dialog?._files || []).map((file) => `${file.blob?.ref?.$link || file.url || ''}:${file.alt || ''}`);
  const video = dialog?._video ? `${dialog._video.kept ? 'kept' : 'new'}:${dialog._video.alt || ''}:${dialog._video.poster || dialog._video.url || ''}` : '';
  return JSON.stringify({
    text: $('compose-text')?.value || '',
    files,
    video,
    quote: dialog?.dataset.quote || '',
    reply: dialog?.dataset.reply || '',
    gate: $('compose-replies')?.value || 'everyone',
    gif: dialog?._gif?.url || '',
    link: dialog?._keptExternal?.url || '',
  });
}

function ensureTrailingLink(text, url) {
  const clean = String(url || '').trim();
  const source = String(text ?? '').replace(/\s+$/u, '');
  if (!clean) return source;
  const short = toShortUrl(clean);
  const breakAt = source.lastIndexOf('\n');
  const head = breakAt >= 0 ? source.slice(0, breakAt).replace(/\r$/u, '') : '';
  const line = (breakAt >= 0 ? source.slice(breakAt + 1) : source).trim();
  if (line === clean || line === short || trimLink(line) === clean) return head ? `${head}\n${clean}` : clean;
  return source ? `${source}\n${clean}` : clean;
}

function openComposer({ reply = null, quote = null, text = '', edit = null } = {}) {
  if (!signedIn()) return requireSignIn();
  clearComposeTypos();
  hideAiDraft();
  const dialog = $('compose');
  const source = edit?.record ? editDraft(edit) : null;
  const replySource = source?.reply || reply;
  const quoteSource = source?.quote || quote;
  dialog.dataset.edit = edit?.uri || '';
  dialog.dataset.reply = replySource ? JSON.stringify({ uri: replySource.uri, cid: replySource.cid, root: replySource.record?.reply?.root || { uri: replySource.uri, cid: replySource.cid } }) : '';
  dialog.dataset.quote = quoteSource ? JSON.stringify({ uri: quoteSource.uri, cid: quoteSource.cid }) : '';
  const context = $('compose-context');
  if (source) context.innerHTML = '<p class="dim">Editing replaces this post. The original is deleted and the new one is posted. Likes and replies stay on the original.</p>';
  else if (replySource) context.innerHTML = `<p class="dim">Replying to <strong>@${escapeHtml(replySource.author?.handle || '')}</strong></p><p>${escapeHtml((replySource.record?.text || '').slice(0, 160))}</p>`;
  else if (quoteSource) context.innerHTML = `<p class="dim">Quoting <strong>@${escapeHtml(quoteSource.author?.handle || '')}</strong></p><p>${escapeHtml((quoteSource.record?.text || '').slice(0, 160))}</p>`;
  else context.innerHTML = '';
  const area = $('compose-text');
  const keepExternal = source?.external?.url && !quoteSource && !gifEmbed(source.external) ? source.external : null;
  area.value = source
    ? ensureTrailingLink(source.text, keepExternal?.url || '')
    : (text || (!replySource && !quoteSource ? loadDraft() : ''));
  dialog._linkWatch = trailingUrl(area.value);
  const replies = $('reply-control');
  if (replies) replies.hidden = Boolean(replySource);
  if (!replySource && $('compose-replies')) $('compose-replies').value = source?.gate || 'everyone';
  if (dialog._video?.url) URL.revokeObjectURL(dialog._video.url);
  dialog._files = source?.images || [];
  dialog._card = null;
  dialog._gif = null;
  dialog._video = source?.video || null;
  dialog._attach = null;
  dialog._langs = source?.langs?.length ? source.langs.slice() : languagePrefs().posts.slice();
  dialog._dismissedUrl = '';
  dialog._keptExternal = null;
  dialog._linkMiss = '';
  if (source?.external?.url && !quoteSource) {
    const external = source.external;
    if (gifEmbed(external)) {
      dialog._gif = {
        url: external.url,
        title: external.title || 'GIF',
        thumb: external.thumbUrl || external.url,
        thumbBlob: external.thumbBlob || null,
      };
    } else if (keepExternal) {
      dialog._keptExternal = keepExternal;
      dialog._card = {
        kind: 'external',
        url: keepExternal.url,
        title: keepExternal.title || keepExternal.url,
        description: keepExternal.description || '',
        image: keepExternal.thumbUrl || '',
        sourceUrl: keepExternal.url,
        kept: true,
      };
    }
  }
  closePicker();
  const leave = $('compose-leave');
  if (leave) leave.hidden = true;
  $('compose-previews').innerHTML = '';
  paintAttach();
  const videoBox = $('compose-video');
  if (videoBox && !dialog._video) {
    videoBox.hidden = true;
    videoBox.innerHTML = '';
  }
  const linkBox = $('compose-link');
  if (linkBox) {
    linkBox.hidden = true;
    linkBox.innerHTML = '';
  }
  renderPreviews();
  renderVideo();
  if (dialog._gif) {
    const gif = dialog._gif;
    chooseGif({ url: gif.url, title: gif.title || 'GIF', thumb: gif.thumb || gif.url });
    if (dialog._gif) dialog._gif.thumbBlob = gif.thumbBlob || null;
  } else paintLinkPreview();
  paintComposeAvatar();
  paintLangChip();
  applyFieldLanguage(area);
  styleHold.delete('compose-text');
  area._before = area.value;
  updateCount();
  paintStyleButtons(area);
  scheduleLinkPreview();
  dialog._editBase = source ? editFingerprint(dialog) : '';
  const send = $('compose-send');
  if (send) send.textContent = source ? 'Update' : 'Post';
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

let dictateCaret = null;

function rememberDictateCaret(area) {
  const field = area || $('compose-text');
  if (!field) return;
  dictateCaret = {
    start: field.selectionStart ?? field.value.length,
    end: field.selectionEnd ?? field.value.length,
  };
}

function stopDictate() {
  const rec = dictateRec;
  dictateRec = null;
  const mic = $('compose-mic');
  if (mic) mic.setAttribute('aria-pressed', 'false');
  if (!rec) return;
  rec.onresult = null;
  rec.onerror = null;
  rec.onend = null;
  try { rec.stop(); } catch { /* already stopped */ }
}

function toggleDictate() {
  if (dictateRec) {
    stopDictate();
    return;
  }
  const Ctor = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!Ctor) {
    toast('Chrome or Edge can dictate a post.');
    return;
  }
  const area = $('compose-text');
  if (!area) return;
  const start = dictateCaret?.start ?? area.selectionStart ?? area.value.length;
  const end = dictateCaret?.end ?? area.selectionEnd ?? start;
  const before = area.value.slice(0, Math.min(start, area.value.length));
  const after = area.value.slice(Math.min(end, area.value.length));
  const lead = before && !/\s$/.test(before) ? `${before} ` : before;
  const tail = after.replace(/^\s+/, '');
  const finals = [];
  let rec;
  try {
    rec = new Ctor();
  } catch {
    toast('Chrome or Edge can dictate a post.');
    return;
  }
  rec.continuous = true;
  rec.interimResults = true;
  rec.lang = ($('compose')?._langs || languagePrefs().posts)[0] || 'en';
  rec.onresult = (event) => {
    let interim = '';
    for (let i = event.resultIndex; i < event.results.length; i += 1) {
      const piece = event.results[i][0]?.transcript || '';
      if (event.results[i].isFinal) finals.push(piece);
      else interim += piece;
    }
    const words = `${finals.join(' ')} ${interim}`.replace(/\s+/g, ' ').trim();
    const next = `${lead}${words}${words && tail ? ' ' : ''}${tail}`.slice(0, 2000);
    area.value = next;
    const caret = Math.min(`${lead}${words}`.length, area.value.length);
    area.setSelectionRange(caret, caret);
    rememberDictateCaret(area);
    area.dispatchEvent(new Event('input', { bubbles: true }));
  };
  rec.onerror = (event) => {
    const code = event?.error || '';
    if (code === 'aborted' || code === 'no-speech') return;
    stopDictate();
    if (code === 'not-allowed' || code === 'service-not-allowed') toast('Allow the microphone to dictate.');
    else toast('Dictation stopped.');
  };
  rec.onend = () => {
    if (dictateRec !== rec) return;
    dictateRec = null;
    $('compose-mic')?.setAttribute('aria-pressed', 'false');
  };
  dictateRec = rec;
  $('compose-mic')?.setAttribute('aria-pressed', 'true');
  try {
    rec.start();
  } catch {
    stopDictate();
    toast('Dictation stopped.');
  }
}

let linkEpoch = 0;
let linkTimer = 0;

function syncComposerLink(dialog, value) {
  if (!dialog || dialog._gif || dialog._video) return;
  const url = trailingUrl(value);
  if (dialog._linkWatch === url) return;
  const previous = dialog._linkWatch || '';
  dialog._linkWatch = url;
  if (!previous || previous === url) return;
  if (dialog._card && dialog._card.sourceUrl !== url) dialog._card = null;
  if (dialog._keptExternal && dialog._keptExternal.url !== url) dialog._keptExternal = null;
  if (dialog._linkMiss && dialog._linkMiss !== url) dialog._linkMiss = '';
  linkEpoch += 1;
  const box = $('compose-link');
  if (!box) return;
  box.hidden = true;
  box.innerHTML = '';
}

function linkCanAttach(dialog, url) {
  if (!dialog || !url) return false;
  if (dialog._gif || dialog._video) return false;
  if (dialog.dataset.quote || dialog._attach) return false;
  if (dialog._dismissedUrl === url || dialog._linkMiss === url) return false;
  return true;
}

// Last-line card URLs are left out. Every other link counts as its short form.
function composerBody(dialog, value) {
  const url = trailingUrl(value);
  if (dialog?._linkMiss && dialog._linkMiss !== url) dialog._linkMiss = '';
  if (!linkCanAttach(dialog, url)) return value;
  const images = (dialog._files || []).length > 0;
  const card = dialog._card;
  if (card?.sourceUrl === url && card.kind === 'external' && images) return value;
  return withoutTrailingUrl(value);
}

function updateCount() {
  const dialog = $('compose');
  const area = $('compose-text');
  const value = area?.value || '';
  syncComposerLink(dialog, value);
  const body = composerBody(dialog, value);
  const left = 300 - graphemeLength(applyShortLinks(body).text);
  const files = dialog?._files || [];
  const gif = dialog?._gif;
  const video = dialog?._video;
  const attached = Boolean(dialog?._attach?.uri);
  const quoted = Boolean(dialog?.dataset.quote);
  const holdingLink = body !== value && Boolean(trailingUrl(value));
  const count = $('compose-count');
  const used = Math.min(300, Math.max(0, 300 - left));
  if (count) {
    count.style.setProperty('--p', String((used / 300) * 100));
    const figure = count.querySelector('b');
    if (figure) figure.textContent = String(left);
    else count.textContent = String(left);
    count.title = left < 0 ? 'Over the 300 character limit' : `${left} characters left`;
  }
  count?.classList.toggle('near', left >= 0 && left <= 50);
  count?.classList.toggle('over', left < 0);
  $('compose-send').disabled = left < 0 || (left === 300 && !files.length && !holdingLink && !gif && !video && !attached && !quoted);
  paintFieldHighlight(area, $('compose-highlight'));
  scheduleSuggest(area);
}

function composeTypos(area) {
  const langs = $('compose')?._langs?.length ? $('compose')._langs : languagePrefs().posts;
  const caret = document.activeElement === area ? area.selectionStart : null;
  return new Set(typoWords(area?.value || '', langs, caret));
}

let typoTimer = 0;
let settledTypos = new Set();
const TYPO_SETTLE_MS = 600;

function sameWords(a, b) {
  if (a.size !== b.size) return false;
  for (const word of a) if (!b.has(word)) return false;
  return true;
}

function clearComposeTypos() {
  clearTimeout(typoTimer);
  typoTimer = 0;
  settledTypos = new Set();
  paintComposeWarn(settledTypos);
}

function scheduleComposeTypos(area, pre) {
  clearTimeout(typoTimer);
  typoTimer = setTimeout(() => {
    typoTimer = 0;
    if (!$('compose')?.open || !area) return;
    const next = composeTypos(area);
    const same = sameWords(next, settledTypos);
    settledTypos = next;
    paintComposeWarn(settledTypos);
    if (!same) paintFieldHighlight(area, pre, { settled: true });
  }, TYPO_SETTLE_MS);
}

function paintComposeWarn(typos) {
  const send = $('compose-send');
  if (!send) return;
  const bad = Boolean(typos?.size);
  send.classList.toggle('warn', bad);
  send.removeAttribute('title');
  const tip = bad ? 'A word looks misspelled. You can still post. Shift+Enter sends.' : 'Shift+Enter sends';
  send.dataset.tip = tip;
  const host = send.closest('.tip-wrap');
  if (host) host.dataset.tip = tip;
}

function paintFieldHighlight(area, pre, options = {}) {
  if (!area || !pre) return;
  const value = area.value || '';
  const start = area.selectionStart ?? 0;
  const end = area.selectionEnd ?? 0;
  const typos = area.id === 'compose-text' ? settledTypos : null;
  const opts = { links: false, breaks: false, typos };
  const markSelection = area.id !== 'compose-text' && document.activeElement === area && end > start;
  const body = markSelection
    ? `${richText(value.slice(0, start), null, opts)}<mark class="field-selection">${richText(value.slice(start, end), null, opts)}</mark>${richText(value.slice(end), null, opts)}`
    : richText(value, null, opts);
  pre.innerHTML = `${body}\n`;
  pre.scrollTop = area.scrollTop;
  if (area.id !== 'compose-text') return;
  if (options.settled) paintComposeWarn(typos);
  else scheduleComposeTypos(area, pre);
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
  const frame = viewportFrame();
  const width = Math.min(320, frame.width - 16);
  const left = Math.max(8, Math.min(point.x, frame.width - width - 8));
  box.style.width = `${Math.round(width)}px`;
  box.style.right = 'auto';
  box.style.bottom = 'auto';
  box.style.transform = 'none';
  mountFloat(box, area);
  const height = box.offsetHeight || 200;
  const spaceBelow = frame.height - point.y;
  const spaceAbove = point.top;
  let top;
  if (spaceBelow < 220 && spaceAbove > spaceBelow) top = point.top - height - 4;
  else top = point.y + 4;
  top = Math.max(8, Math.min(top, frame.height - height - 8));
  pinBox(box, left, top);
}

function scheduleSuggest(area) {
  if (!area) return;
  clearTimeout(suggestTimer);
  suggestTimer = setTimeout(() => refreshSuggest(area), 180);
}

function aiSuggestRows(query) {
  const q = String(query || '').toLowerCase();
  const rows = [];
  if ('ai'.startsWith(q)) rows.push(suggestRow(rows.length, '@ai', `${AI_NAME}<span class="handle">@ai</span>`));
  if ('si'.startsWith(q)) rows.push(suggestRow(rows.length, '@si', `${AI_NAME}<span class="handle">@si</span>`));
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
      : tagSuggestRows(token.query, items);
    paintSuggest(area, [...leads, ...rows].slice(0, 8));
  } catch {
    if (seq !== suggestSeq) return;
    if (document.activeElement !== area) return;
    if (token.sigil === '#') {
      const rows = tagSuggestRows(token.query, []);
      if (rows.length) return paintSuggest(area, rows);
    }
    if (leads.length) paintSuggest(area, leads);
    else hideSuggest();
  }
}

function tagSuggestRows(query, tags) {
  const rows = [];
  const seen = new Set();
  const typed = tagFromQuery(query);
  if (typed) {
    seen.add(typed.toLowerCase());
    rows.push(suggestRow(rows.length, `#${typed}`, `#${escapeHtml(typed)}<span class="handle">Hashtag</span>`));
  }
  for (const tag of tags || []) {
    const name = String(tag || '').replace(/^[#＃]/, '');
    const key = name.toLowerCase();
    if (!name || seen.has(key)) continue;
    seen.add(key);
    rows.push(suggestRow(rows.length, `#${name}`, `#${escapeHtml(name)}<span class="handle">Hashtag</span>`));
    if (rows.length >= 8) break;
  }
  return rows;
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

function shiftEnterSends(event) {
  if (event.key !== 'Enter' || !event.shiftKey || event.altKey || event.ctrlKey || event.metaKey) return false;
  if (event.repeat || event.isComposing || event.keyCode === 229) return false;
  const area = event.target;
  const form = area?.form;
  const button = form?.querySelector('button[type="submit"]');
  if (!form || !button || area.disabled || button.disabled) return false;
  event.preventDefault();
  form.requestSubmit(button);
  return true;
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
    composerEscapeLock = true;
    queueMicrotask(() => { composerEscapeLock = false; });
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
  const url = trailingUrl($('compose-text').value);
  if (!url || dialog.dataset.quote || dialog._attach || dialog._dismissedUrl === url) {
    linkEpoch += 1;
    dialog._card = null;
    dialog._keptExternal = null;
    box.hidden = true;
    box.innerHTML = '';
    updateCount();
    return;
  }
  if (dialog._keptExternal && dialog._keptExternal.url !== url) dialog._keptExternal = null;
  if (dialog._card?.sourceUrl === url) {
    paintLinkPreview();
    updateCount();
    return;
  }
  const token = ++linkEpoch;
  const images = (dialog._files || []).length > 0;
  if (!images) {
    box.hidden = false;
    box.innerHTML = `<div class="card"><span class="card-body"><span class="domain">${escapeHtml(hostOf(url))}</span><strong>Loading preview…</strong></span></div>`;
  }
  let card = null;
  try { card = await api.inspectLink(url); } catch { card = null; }
  if (token !== linkEpoch || !dialog.open) return;
  if (trailingUrl($('compose-text').value) !== url || dialog._dismissedUrl === url || dialog.dataset.quote || dialog._attach) return;
  if (!card) {
    dialog._card = null;
    dialog._keptExternal = null;
    dialog._linkMiss = url;
    box.hidden = true;
    box.innerHTML = '';
    updateCount();
    return;
  }
  card.sourceUrl = url;
  if (dialog._keptExternal?.url === url) card.kept = true;
  dialog._linkMiss = '';
  dialog._card = card;
  paintLinkPreview();
  updateCount();
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
  $('compose-previews').innerHTML = files.map((file, index) => `<label class="preview"><img src="${escapeHtml(file.url)}" alt=""><button type="button" class="card-dismiss" data-act="remove-image" data-index="${index}" aria-label="Remove image">×</button><input data-alt="${index}" value="${escapeHtml(file.alt)}" placeholder="Alt text"></label>`).join('');
  updateCount();
}

async function addFiles(list) {
  closePicker();
  const incoming = [...(list || [])];
  if (!incoming.length) return;
  if ($('compose')._gif) {
    toast('Remove the GIF before adding images.');
    return;
  }
  if ($('compose')._video) {
    toast('Remove the video before adding images.');
    return;
  }
  const bucket = $('compose')._files || [];
  if (bucket.length >= 4) {
    toast('A post can have 4 images.');
    return;
  }
  let skipped = false;
  for (const file of incoming) {
    if (bucket.length >= 4) {
      skipped = true;
      break;
    }
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
  if (skipped) toast('A post can have 4 images.');
}

async function publish(event) {
  event.preventDefault();
  stopDictate();
  const dialog = $('compose');
  let text = $('compose-text').value.trim();
  const files = dialog._files || [];
  const gif = dialog._gif;
  const draftVideo = dialog._video;
  if ((gif && files.length) || (gif && draftVideo) || (files.length && draftVideo)) {
    toast('Use images, a video, or a GIF, not more than one.');
    return;
  }
  if (gif && (dialog.dataset.quote || dialog._attach)) {
    toast('Remove the quote or attachment before adding a GIF.');
    return;
  }
  $('compose-send').disabled = true;
  $('compose-send').textContent = dialog.dataset.edit ? 'Updating…' : 'Posting…';
  try {
    const editing = dialog.dataset.edit || '';
    let gateWarning = '';
    if (editing && dialog._editBase && editFingerprint(dialog) === dialog._editBase) {
      dialog.close();
      toast('Nothing changed');
      return;
    }
    let quote = dialog.dataset.quote ? JSON.parse(dialog.dataset.quote) : null;
    if (dialog._attach?.uri && dialog._attach?.cid) {
      quote = { uri: dialog._attach.uri, cid: dialog._attach.cid };
    }
    let link = null;
    const url = trailingUrl(text);
    let card = dialog._card;
    let linkPlan = null;
    if (gif && !files.length && !quote) linkPlan = { kind: 'gif' };
    else if (url && !draftVideo && dialog._dismissedUrl !== url && !quote && dialog._linkMiss !== url) {
      if (!card || card.sourceUrl !== url) {
        try { card = await api.inspectLink(url); } catch { card = null; }
        if (card) card.sourceUrl = url;
      }
      if (card?.kind === 'quote' && card.post?.uri) {
        quote = { uri: card.post.uri, cid: card.post.cid };
        text = withoutTrailingUrl(text).trim();
      } else if (card?.kind === 'external' && !files.length) {
        linkPlan = { kind: 'external', card };
        text = withoutTrailingUrl(text).trim();
      } else if (!card) {
        dialog._card = null;
        dialog._keptExternal = null;
        dialog._linkMiss = url;
      }
    }
    if (graphemeLength(applyShortLinks(text).text) > 300) {
      toast(url && trailingUrl(text) === url
        ? 'That link stays in the post, so this is over 300 characters.'
        : 'This post is over 300 characters.');
      return;
    }
    const images = [];
    for (const item of files) {
      if (item.kept && item.blob) images.push({ alt: item.alt, blob: item.blob });
      else images.push({ alt: item.alt, blob: await api.uploadBlob(item.file) });
    }
    let video = null;
    if (draftVideo?.kept && draftVideo.blob) {
      video = { blob: draftVideo.blob, alt: draftVideo.alt || '', aspectRatio: draftVideo.aspectRatio };
    } else if (draftVideo?.file) {
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
    if (linkPlan?.kind === 'gif') {
      let thumb = gif.thumbBlob || null;
      if (!thumb) {
        try {
          const file = await thumbFile(gif.thumb || gif.url);
          if (file) thumb = await api.uploadBlob(file);
        } catch {
          thumb = null;
        }
      }
      link = api.externalEmbed({ url: gif.url, title: gif.title || 'GIF', description: '', thumb });
    } else if (linkPlan?.kind === 'external') {
      const external = linkPlan.card;
      let thumb = dialog._keptExternal?.url === url && dialog._keptExternal.thumbBlob ? dialog._keptExternal.thumbBlob : null;
      if (!thumb && external.kept && dialog._keptExternal?.thumbBlob) thumb = dialog._keptExternal.thumbBlob;
      if (!thumb && external.image) {
        try {
          const file = await thumbFile(external.image);
          if (file) thumb = await api.uploadBlob(file);
        } catch {
          thumb = null;
        }
      }
      link = api.externalEmbed({ ...external, url: external.url || url, thumb });
    }
    if (!text && !images.length && !video && !quote && !link) return;
    rememberWords(text);
    const created = await api.createPost({ text, images, video, reply, quote, link, langs: dialog._langs || languagePrefs().posts });
    if (editing && created?.uri) {
      try {
        if (me.profile?.pinnedPost?.uri === editing && created.cid) {
          await api.updateProfile({ pinnedPost: { uri: created.uri, cid: created.cid } });
          me.profile.pinnedPost = { uri: created.uri, cid: created.cid };
        }
      } catch {
        gateWarning = ' The profile pin still points at the original.';
      }
      try {
        await api.deleteRecord(editing);
      } catch {
        gateWarning = `${gateWarning} The original post is still up.`;
      }
    }
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
        gateWarning = `${gateWarning} Reply limits were not saved.`;
      }
    }
    if (!reply && !quote && !editing) saveDraft('');
    dialog.close();
    showPosted(editing ? 'Updated' : 'Posted');
    if (gateWarning.trim()) toast(gateWarning.trim());
    route();
  } catch (error) {
    toast(error.message);
  } finally {
    const send = $('compose-send');
    if (send) send.textContent = $('compose')?.dataset.edit ? 'Update' : 'Post';
    updateCount();
  }
}

let layerOpenedAt = 0;

function noteLayerOpen() {
  layerOpenedAt = performance.now();
}

function showLayer(node) {
  if (!node) return;
  // Opening a popover can scroll the page. Mark the time first so that
  // scroll does not close the menu that is just opening.
  noteLayerOpen();
  node.hidden = false;
  node.style.position = 'fixed';
  if (!node.style.left) node.style.left = '8px';
  if (!node.style.top) node.style.top = '8px';
  if (typeof node.showPopover === 'function') {
    try {
      if (!node.matches(':popover-open')) node.showPopover();
    } catch {
      node.removeAttribute('popover');
    }
  }
}

function hideLayer(node) {
  if (!node) return;
  if (typeof node.hidePopover === 'function' && node.matches(':popover-open')) {
    try { node.hidePopover(); } catch { /* already closed */ }
  }
  node.hidden = true;
}

function layerOpen(node) {
  if (!node) return false;
  if (node.hidden && !(typeof node.matches === 'function' && node.matches(':popover-open'))) return false;
  return true;
}

function closeAppMenu(focus) {
  const menu = $('app-menu');
  const button = $('app-menu-btn');
  if (!layerOpen(menu)) return;
  hideLayer(menu);
  button?.setAttribute('aria-expanded', 'false');
  if (focus) button?.focus();
}

function toggleAppMenu() {
  const menu = $('app-menu');
  const button = $('app-menu-btn');
  if (!menu || !button) return;
  if (layerOpen(menu)) {
    closeAppMenu();
    return;
  }
  closeMenu();
  closeAlphaMenu();
  hideTip();
  showLayer(menu);
  button.setAttribute('aria-expanded', 'true');
  placeAppMenu();
  requestAnimationFrame(() => { if (layerOpen(menu)) placeAppMenu(); });
}

function viewportFrame() {
  const root = document.documentElement;
  const view = window.visualViewport;
  return {
    width: Math.round(view?.width || root.clientWidth || window.innerWidth),
    height: Math.round(view?.height || root.clientHeight || window.innerHeight),
  };
}

function pinBox(box, left, top) {
  box.style.margin = '0';
  box.style.left = `${Math.round(left)}px`;
  box.style.top = `${Math.round(top)}px`;
}

function placeAppMenu() {
  const menu = $('app-menu');
  const button = $('app-menu-btn');
  if (!menu || !button || !layerOpen(menu)) return;
  const rect = button.getBoundingClientRect();
  const frame = viewportFrame();
  const width = menu.offsetWidth || 248;
  const height = menu.offsetHeight || 0;
  let left = rect.left;
  let top = rect.bottom + 4;
  if (left + width > frame.width - 8) left = frame.width - width - 8;
  if (top + height > frame.height - 8 && rect.top - height - 4 >= 8) top = rect.top - height - 4;
  menu.style.position = 'fixed';
  menu.style.right = 'auto';
  pinBox(menu, Math.max(8, left), Math.max(8, top));
}

function closeMenu() {
  const menu = $('menu');
  if (!menu || !layerOpen(menu)) return;
  const anchor = menu._anchor;
  hideLayer(menu);
  menu._anchor = null;
  menu._post = null;
  if (anchor?.isConnected) anchor.setAttribute('aria-expanded', 'false');
}

function placeMenu(menu, anchor) {
  const rect = anchor.getBoundingClientRect();
  const frame = viewportFrame();
  const width = menu.offsetWidth || 250;
  const height = menu.offsetHeight || 0;
  const gap = 4;
  const center = rect.left + rect.width / 2;
  let left = center > frame.width / 2 ? rect.right - width : rect.left;
  left = Math.max(8, Math.min(left, frame.width - width - 8));
  let top = rect.bottom + gap;
  const above = rect.top - height - gap;
  if (top + height > frame.height - 8 && above >= 8) top = above;
  top = Math.max(8, Math.min(top, frame.height - height - 8));
  menu.style.bottom = 'auto';
  menu.style.right = 'auto';
  pinBox(menu, left, top);
}

function openMenu(anchor, items) {
  const menu = $('menu');
  hideTip();
  if (menu._anchor && menu._anchor !== anchor && menu._anchor.isConnected) menu._anchor.setAttribute('aria-expanded', 'false');
  menu._post = null;
  menu._anchor = anchor || null;
  menu.innerHTML = items.map((item) => `<button type="button" class="${item.danger ? 'is-danger' : ''}" data-menu="${escapeHtml(item.id)}" ${item.disabled ? 'disabled' : ''}>${escapeHtml(item.label)}</button>`).join('');
  showLayer(menu);
  if (anchor?.getBoundingClientRect) {
    placeMenu(menu, anchor);
    requestAnimationFrame(() => { if (layerOpen(menu) && menu._anchor === anchor) placeMenu(menu, anchor); });
  }
  if (anchor) anchor.setAttribute('aria-expanded', 'true');
}

function toggleMenu(anchor, items) {
  const menu = $('menu');
  if (menu && layerOpen(menu) && anchor && menu._anchor === anchor) {
    closeMenu();
    return false;
  }
  openMenu(anchor, items);
  return true;
}

const MORE_LINKS = [
  { id: 'go-lists', label: 'Lists' },
  { id: 'go-feeds', label: 'Feeds' },
  { id: 'go-packs', label: 'Starter packs' },
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
    { id: 'go-ai', label: 'AI Assist' },
  ];
  toggleMenu(anchor, [...overflow, ...MORE_LINKS]);
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

function styleButtons() {
  return [
    ['bold', 'B', 'Bold'],
    ['italic', 'I', 'Italic'],
    ['strike', 'S', 'Strikethrough'],
    ['mono', 'M', 'Monospace'],
  ].map(([style, label, name]) => `<button type="button" class="icon-btn style-btn" data-act="style" data-style="${style}" aria-pressed="false" aria-label="${name}" data-tip="${name}">${label}</button>`).join('');
}

function buttonHost(button) {
  return button?.closest?.('#chat-form') ? 'chat' : 'compose';
}

function pickerArea() {
  return pickerHost === 'chat' ? $('chat-text') : $('compose-text');
}

function paintStyleButtons(area) {
  const host = area?.id === 'chat-text' ? $('chat-form') : $('compose-form');
  if (!host || !area) return;
  const start = area.selectionStart ?? 0;
  const end = area.selectionEnd ?? start;
  const flags = end > start ? styleFlags(area.value, start, end) : null;
  const hold = styleHold.get(area.id) || new Set();
  host.querySelectorAll('[data-act="style"]').forEach((button) => {
    const on = flags ? Boolean(flags[button.dataset.style]) : hold.has(button.dataset.style);
    button.setAttribute('aria-pressed', on ? 'true' : 'false');
    button.classList.toggle('on', on);
  });
}

function syncToolState() {
  document.querySelectorAll('[data-act="emoji"], [data-act="gif"], [data-act="link"], [data-act="post-lang"]').forEach((button) => {
    const open = Boolean(pickerMode) && pickerMode === button.dataset.act && pickerHost === buttonHost(button);
    button.setAttribute('aria-expanded', open ? 'true' : 'false');
    button.classList.toggle('on', open);
  });
  $('compose')?.classList.toggle('picker-open', pickerHost === 'compose' && Boolean(pickerMode));
  const active = document.activeElement;
  const area = active?.id === 'compose-text' || active?.id === 'chat-text' ? active : pickerArea();
  if (area) paintStyleButtons(area);
}

function closePicker() {
  pickerMode = '';
  for (const id of ['compose-picker', 'chat-picker']) {
    const box = $(id);
    if (!box) continue;
    box.hidden = true;
    box.innerHTML = '';
  }
  syncToolState();
}

function preparePicker(act, button) {
  const host = buttonHost(button);
  if (host === 'chat' && act !== 'emoji') return null;
  const box = host === 'chat' ? $('chat-picker') : $('compose-picker');
  if (!box) return null;
  pickerHost = host;
  pickerMode = act;
  const other = $(host === 'chat' ? 'compose-picker' : 'chat-picker');
  if (other) {
    other.hidden = true;
    other.innerHTML = '';
  }
  box.hidden = false;
  syncToolState();
  return box;
}

function toggleStyleHold(area, style) {
  const hold = new Set(styleHold.get(area.id) || []);
  if (hold.has(style)) hold.delete(style);
  else {
    hold.add(style);
    if (style === 'mono') {
      hold.delete('bold');
      hold.delete('italic');
    }
    if (style === 'bold' || style === 'italic') hold.delete('mono');
  }
  if (hold.size) styleHold.set(area.id, hold);
  else styleHold.delete(area.id);
}

function applyComposerStyle(area, style, range) {
  if (!area || !style) return;
  const start = range?.start ?? area.selectionStart ?? 0;
  const end = range?.end ?? area.selectionEnd ?? start;
  if (end > start) {
    const next = toggleStyle(area.value, start, end, style);
    area.value = next.text;
    area._before = next.text;
    area.setSelectionRange(next.start, next.end);
    area.dispatchEvent(new Event('input', { bubbles: true }));
    area.focus();
    paintStyleButtons(area);
    return;
  }
  toggleStyleHold(area, style);
  area.focus();
  paintStyleButtons(area);
}

function snapshotField(area) {
  if (!area) return;
  area._before = area.value;
  area._insertAt = area.selectionStart ?? area.value.length;
  area._insertEnd = area.selectionEnd ?? area._insertAt;
}

function applyHeldStyles(area) {
  if (!area) return;
  const hold = styleHold.get(area.id);
  const before = area._before;
  const after = area.value;
  if (!hold?.size || before == null || before === after) {
    area._before = after;
    return;
  }
  const at = Math.max(0, Math.min(before.length, area._insertAt ?? 0));
  const end = Math.max(at, Math.min(before.length, area._insertEnd ?? at));
  const insertedLength = after.length - (before.length - (end - at));
  if (insertedLength <= 0) {
    area._before = after;
    return;
  }
  const next = forceStyles(after, at, at + insertedLength, hold);
  if (next.text !== after) {
    area.value = next.text;
    area.setSelectionRange(next.end, next.end);
  }
  area._before = area.value;
}

function onPickerKey(event) {
  const box = event.target.closest?.('#compose-picker, #chat-picker');
  if (!box || box.hidden) return false;
  if (event.key === 'Escape') {
    event.preventDefault();
    event.stopPropagation();
    closePicker();
    pickerArea()?.focus();
    return true;
  }
  if (event.key === 'Enter') {
    event.preventDefault();
    if (event.target.id === 'link-url') addComposerLink();
    return true;
  }
  return false;
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
      ? 'Added links sit on your profile row, the same way lists sit on Home.'
      : 'This is embedded in the post, so other Bluesky apps show it too.';
  }
  paintAttachCurrent();
}

function openAttachPicker(mode) {
  closePicker();
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
  const searching = Boolean(needle);
  box.innerHTML = groups.length
    ? groups.map(([name, list]) => {
      const open = searching || !collapsedEmoji.has(name);
      return `<details class="emoji-group" data-emoji-group="${escapeHtml(name)}"${open ? ' open' : ''}><summary>${escapeHtml(name)}</summary>${emojiButtons(list)}</details>`;
    }).join('')
    : '<p class="picker-note">No emoji matched.</p>';
}

function pickerShell(title, { search = '', body = '', tall = false } = {}) {
  const kind = tall ? ' picker-tall' : '';
  return `<div class="picker${kind}"><div class="picker-head"><p class="picker-title">${escapeHtml(title)}</p><button type="button" class="picker-x" data-act="close-picker" aria-label="Close" data-tip="Close">${icon('close')}</button></div>${search}<div class="picker-scroll">${body}</div></div>`;
}

function openEmojiPicker(button, query = '') {
  const box = preparePicker('emoji', button);
  if (!box) return;
  box.innerHTML = pickerShell('Emoji', {
    tall: true,
    search: `<input id="emoji-find" placeholder="Search emoji" autocomplete="off" value="${escapeHtml(query)}">`,
    body: '<div id="emoji-groups"></div>',
  });
  paintEmojiList(query);
  pickerArea()?.focus({ preventScroll: true });
}

function insertEmoji(char) {
  const area = pickerArea();
  if (!area || !char) return;
  const start = area.selectionStart ?? area.value.length;
  const end = area.selectionEnd ?? start;
  area.value = `${area.value.slice(0, start)}${char}${area.value.slice(end)}`;
  const caret = start + char.length;
  area._before = area.value;
  area.setSelectionRange(caret, caret);
  rememberEmoji(char);
  area.dispatchEvent(new Event('input', { bubbles: true }));
  area.focus({ preventScroll: true });
  area.setSelectionRange(caret, caret);
}

function gifMedia(item, names) {
  const media = item?.media_formats || {};
  for (const name of names) {
    if (media[name]?.url) return media[name].url;
  }
  return '';
}

function openGifPicker(button) {
  const box = preparePicker('gif', button);
  if (!box) return;
  box.innerHTML = pickerShell('GIF', {
    tall: true,
    search: '<input id="gif-q" placeholder="Search GIFs" autocomplete="off">',
    body: '<p class="picker-note">GIFs by KLIPY</p><div id="gif-grid" class="gif-grid"></div>',
  });
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
      const chosen = $('compose')?._gif?.url === full;
      return `<button type="button" class="${chosen ? 'on' : ''}" aria-pressed="${chosen ? 'true' : 'false'}" data-gif="${escapeHtml(full)}" data-gif-title="${escapeHtml(item.title || 'GIF')}" data-gif-thumb="${escapeHtml(thumb)}"><img src="${escapeHtml(thumb)}" alt="${escapeHtml(item.title || 'GIF')}"></button>`;
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
  const picture = video.url
    ? `<video src="${escapeHtml(video.url)}" controls muted playsinline></video>`
    : `<img src="${escapeHtml(video.poster || '')}" alt="">`;
  box.innerHTML = `<div class="video-draft">${picture}<input id="video-alt" value="${escapeHtml(video.alt || '')}" placeholder="Alt text" maxlength="1000"><button type="button" class="card-dismiss" data-act="dismiss-video" aria-label="Remove video">×</button></div>`;
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
  closePicker();
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

function openLinkPicker(button) {
  const box = preparePicker('link', button);
  if (!box) return;
  box.innerHTML = pickerShell('Link', {
    body: '<div class="link-add"><input id="link-url" placeholder="https://" inputmode="url" autocomplete="off" spellcheck="false"><button type="button" class="primary small" data-act="add-link">Add</button></div><p class="picker-note">A link on the last line is the preview. That line does not count toward the 300 characters. Delete the line to remove the preview.</p>',
  });
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
  const current = area.value.replace(/\s+$/u, '');
  if (trailingUrl(current) !== url) area.value = current ? `${current}\n${url}` : url;
  const caret = area.value.length;
  area.setSelectionRange(caret, caret);
  closePicker();
  area.dispatchEvent(new Event('input', { bubbles: true }));
  scheduleLinkPreview();
  area.focus();
}

function openPostLangPicker(button) {
  const box = preparePicker('post-lang', button);
  if (!box) return;
  const selected = $('compose')._langs || languagePrefs().posts;
  box.innerHTML = pickerShell('Languages', {
    search: '<input id="post-lang-find" placeholder="Find a language" autocomplete="off">',
    body: `<p class="picker-note">Up to three. Tab completes words in these languages.</p><div class="lang-grid">${languageButtons('posts', selected)}</div>`,
  });
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

function avatarHoverTarget(node) {
  const button = node?.closest?.('[data-act="account-card"]');
  if (!button || button.disabled) return null;
  if (button.closest('#hovercard, #menu, #suggest, #app-menu, dialog')) return null;
  const id = button.dataset.actor || '';
  if (!id) return null;
  return { id, link: button };
}

function placeHover(card, anchor) {
  const rect = anchor.getBoundingClientRect();
  const frame = viewportFrame();
  const width = Math.min(320, frame.width - 16);
  card.style.width = `${Math.round(width)}px`;
  card.style.right = 'auto';
  showFloat(card);
  const height = card.offsetHeight || 220;
  const left = Math.max(8, Math.min(rect.left, frame.width - width - 8));
  const below = rect.bottom + 6;
  const above = rect.top - height - 6;
  let top = below;
  if (below + height > frame.height - 8 && above >= 8) top = above;
  else if (below + height > frame.height - 8) top = Math.max(8, frame.height - height - 8);
  if (top < 8) top = 8;
  pinBox(card, left, top);
}

function closeHover() {
  clearTimeout(hoverTimer);
  clearTimeout(hoverHideTimer);
  hoverActor = '';
  hoverWait = '';
  hoverWaitLink = null;
  document.querySelectorAll('[data-act="account-card"][aria-expanded="true"]').forEach((node) => {
    node.setAttribute('aria-expanded', 'false');
  });
  const card = $('hovercard');
  if (!card) return;
  card._anchor = null;
  card.innerHTML = '';
  hideFloat(card);
}

function toggleAccountCard(button) {
  if (!button) return;
  const id = button.dataset.actor || '';
  if (!id) return;
  const card = $('hovercard');
  if (card && !card.hidden && card._anchor === button) {
    closeHover();
    return;
  }
  openHover({ id, link: button });
}

function scheduleHover(event) {
  if (event.pointerType && event.pointerType !== 'mouse') return;
  if (window.matchMedia('(hover: none)').matches) return;
  const found = avatarHoverTarget(event.target);
  if (!found) return;
  clearTimeout(hoverHideTimer);
  const card = $('hovercard');
  const open = Boolean(card && !card.hidden);
  if (open && card._anchor === found.link) return;
  if (!open && hoverWaitLink === found.link) return;
  clearTimeout(hoverTimer);
  hoverWait = found.id;
  hoverWaitLink = found.link;
  if (open) {
    hoverWait = '';
    hoverWaitLink = null;
    openHover(found);
    return;
  }
  hoverTimer = setTimeout(() => {
    if (hoverWaitLink !== found.link) return;
    hoverWait = '';
    hoverWaitLink = null;
    if (!found.link.isConnected) return;
    openHover(found);
  }, 380);
}

function scheduleHoverHide(event) {
  const next = event.relatedTarget;
  const card = $('hovercard');
  if (next instanceof Element) {
    if (card?.contains(next)) return;
    const nextTarget = avatarHoverTarget(next);
    if (nextTarget && (nextTarget.link === card?._anchor || nextTarget.link === hoverWaitLink)) return;
  }
  hoverWait = '';
  hoverWaitLink = null;
  clearTimeout(hoverTimer);
  clearTimeout(hoverHideTimer);
  if (!hoverActor && !(card && !card.hidden)) return;
  hoverHideTimer = setTimeout(closeHover, 240);
}

async function openHover(found) {
  const card = $('hovercard');
  if (!card || !found?.link || found.link.closest('#hovercard, #menu, #suggest')) return closeHover();
  clearTimeout(hoverTimer);
  clearTimeout(hoverHideTimer);
  hoverWait = '';
  hoverWaitLink = null;
  hoverActor = found.id;
  card._anchor = found.link;
  hideTip();
  document.querySelectorAll('[data-act="account-card"][aria-expanded="true"]').forEach((node) => {
    if (node !== found.link) node.setAttribute('aria-expanded', 'false');
  });
  found.link.setAttribute('aria-expanded', 'true');
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
    if (seq !== hoverSeq || hoverActor !== found.id || card._anchor !== found.link) return;
    card.innerHTML = hoverCardHtml(profile, myDid());
    if (found.link?.isConnected) placeHover(card, found.link);
  } catch {
    if (seq !== hoverSeq || hoverActor !== found.id || card._anchor !== found.link) return;
    card.innerHTML = `<div class="hover-body"><p class="dim">Could not load this account.</p></div>`;
  }
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
  const box = $('compose-link');
  if (box) {
    box.hidden = false;
    box.innerHTML = `<div class="link-preview"><a class="card gif-card" href="${escapeHtml(gif.url)}" target="_blank" rel="noopener noreferrer"><img src="${escapeHtml(gif.thumb || gif.url)}" alt="${escapeHtml(gif.title || 'GIF')}"></a><button type="button" class="card-dismiss" data-act="dismiss-gif" aria-label="Remove GIF">×</button></div>`;
  }
  document.querySelectorAll('#gif-grid [data-gif]').forEach((button) => {
    const on = button.dataset.gif === gif.url;
    button.classList.toggle('on', on);
    button.setAttribute('aria-pressed', on ? 'true' : 'false');
  });
  updateCount();
}

function openAbout() {
  const dialog = $('about');
  if (dialog && !dialog.open) dialog.showModal();
}

function openHelp() {
  const dialog = $('help');
  const scope = $('help-scope');
  const title = $('title')?.textContent?.trim() || 'this page';
  if (scope) scope.textContent = `Help and Config are page scoped. You are on ${title}.`;
  if (dialog && !dialog.open) dialog.showModal();
}

function openPageConfig() {
  const [a, b, c] = parseHash();
  const active = homeActive();
  if (active && (active.kind === 'following' || active.kind === 'discover')) {
    openTune('home');
    return;
  }
  if (active?.kind === 'lane' && active.type === 'list') {
    if (active.value) location.hash = `#/list/${encodeURIComponent(active.value)}`;
    return;
  }
  if (active?.kind === 'lane' && active.type === 'feed') {
    openTune('feed', active.value);
    return;
  }
  if (a === 'feed' && b) {
    openTune('feed', b);
    return;
  }
  if (a === 'search') {
    openTune('search');
    return;
  }
  if (a === 'profile' && c === 'post') {
    openTune('thread');
    return;
  }
  location.hash = '#/settings';
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
  const pre = box.id === 'chat-text' ? $('chat-highlight') : (box.id === 'ai-text' ? $('ai-highlight') : null);
  box.style.height = 'auto';
  const full = Math.max(box.scrollHeight, pre?.scrollHeight || 0);
  const next = Math.min(Math.max(full, 96), 280);
  box.style.height = `${next}px`;
  box.style.overflowY = full > 280 ? 'auto' : 'hidden';
  if (pre) pre.scrollTop = box.scrollTop;
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
  if ($('view')?.dataset.convoStatus === 'request') {
    await api.acceptConvo(convoId);
    if ($('view')) $('view').dataset.convoStatus = 'accepted';
    $('view')?.querySelector('.request-banner')?.remove();
  }
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
  list?.insertAdjacentHTML('beforeend', assistantHtml(text, { id, kicker: `Not sent · ${AI_NAME}`, actions: true }));
  if (list) list.scrollTop = list.scrollHeight;
}

let aiDraftSeq = 0;

function hideAiDraft() {
  const box = $('compose-ai');
  if (box) box.hidden = true;
  const node = $('compose-ai-text');
  if (node) node.textContent = '';
  const use = box?.querySelector('[data-act="use-ai-draft"]');
  if (use) use.disabled = false;
}

function showAiDraft(text, pending = false) {
  const box = $('compose-ai');
  const node = $('compose-ai-text');
  if (!box || !node) return;
  node.textContent = text;
  const use = box.querySelector('[data-act="use-ai-draft"]');
  if (use) use.disabled = pending;
  box.hidden = false;
}

async function rewriteDraft() {
  const dialog = $('compose');
  const area = $('compose-text');
  if (!dialog?.open) return;
  const body = (area?.value || '').trim();
  if (!body) {
    toast('Write a draft first. AI Assist rewrites what is in the box.');
    area?.focus();
    return;
  }
  const saved = loadAi();
  if (!aiReady(saved)) {
    toast('AI Assist could not start. Add a key in Settings.');
    return;
  }
  const button = dialog.querySelector('[data-act="compose-ai"]');
  const seq = ++aiDraftSeq;
  if (button) button.disabled = true;
  showAiDraft('Reading…', true);
  try {
    const answer = await askAi(
      saved,
      draftRewriteMessages(body),
      AbortSignal.timeout ? AbortSignal.timeout(AI_TIMEOUT_MS) : undefined,
      'Draft',
    );
    if (seq !== aiDraftSeq || !$('compose')?.open) return;
    const fitted = fitDraft(answer);
    if (!fitted) throw new Error('The account sent an empty reply.');
    showAiDraft(fitted);
  } catch (error) {
    if (seq !== aiDraftSeq) return;
    hideAiDraft();
    toast(error?.message || 'The account did not answer.');
  } finally {
    if (button?.isConnected) button.disabled = false;
  }
}

function useAiDraft() {
  const raw = $('compose-ai-text')?.textContent || '';
  const fitted = fitDraft(raw);
  const area = $('compose-text');
  if (!area || !fitted || raw === 'Reading…') return;
  area.value = fitted;
  area._before = fitted;
  hideAiDraft();
  updateCount();
  paintStyleButtons(area);
  area.focus();
}

async function askInChat(input, text) {
  const saved = loadAi();
  if (!aiReady(saved)) {
    toast('AI Assist could not start. Add a key in Settings.');
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
    ], AbortSignal.timeout ? AbortSignal.timeout(AI_TIMEOUT_MS) : undefined, 'Chat');
    if (parseHash()[0] !== 'messages') return;
    appendAssistant(answer);
  } catch (error) {
    const message = error?.message || 'The account did not answer.';
    if (parseHash()[0] === 'messages') {
      const list = $('view').querySelector('.messages');
      list?.insertAdjacentHTML('beforeend', assistantHtml(message, { kicker: 'Could not answer' }));
      if (list) list.scrollTop = list.scrollHeight;
    }
    toast(message);
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
    area._before = sized.text;
    paintFieldHighlight(area, $('chat-highlight'));
    fitChatInput(area);
    paintStyleButtons(area);
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
  if (act === 'help') {
    event.preventDefault();
    openHelp();
    return true;
  }
  if (act === 'config') {
    event.preventDefault();
    openPageConfig();
    return true;
  }
  if (act === 'help-about') {
    event.preventDefault();
    $('help')?.close();
    openAbout();
    return true;
  }
  if (act === 'help-privacy' || act === 'help-terms') {
    event.preventDefault();
    $('help')?.close();
    openLegal(act === 'help-privacy' ? 'privacy' : 'terms');
    return true;
  }
  if (act === 'tab-scroll') {
    event.preventDefault();
    const scroller = button?.closest('.tab-strip')?.querySelector('.tab-scroller');
    if (scroller) {
      const dir = Number(button.dataset.dir) || 1;
      const amount = Math.max(140, Math.round(scroller.clientWidth * 0.65));
      scroller.scrollBy({ left: dir * amount, behavior: 'smooth' });
    }
    return true;
  }
  if (act === 'tab-menu' || act === 'profile-menu' || act === 'nav-more' || act === 'more' || act === 'repost') return true;
  if (act === 'lane-up' || act === 'lane-down' || act === 'lane-remove' || act === 'lane-add') {
    event.preventDefault();
    editLaneDraft(act, button);
    return true;
  }
  if (act === 'lane-save') {
    event.preventDefault();
    await saveLaneDraft();
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
  if (act === 'close-picker') {
    event.preventDefault();
    const area = pickerArea();
    closePicker();
    area?.focus();
    return true;
  }
  if (act === 'emoji' || act === 'gif' || act === 'link' || act === 'post-lang') {
    event.preventDefault();
    const host = buttonHost(button);
    if (host === 'chat' && act !== 'emoji') return true;
    if (pickerMode === act && pickerHost === host) closePicker();
    else if (act === 'emoji') openEmojiPicker(button);
    else if (act === 'gif') openGifPicker(button);
    else if (act === 'link') openLinkPicker(button);
    else openPostLangPicker(button);
    return true;
  }
  if (act === 'style') {
    event.preventDefault();
    const area = button?.closest('#chat-form') ? $('chat-text') : $('compose-text');
    applyComposerStyle(area, button?.dataset.style || '', button?._range);
    return true;
  }
  if (act === 'compose-ai') {
    event.preventDefault();
    rewriteDraft();
    return true;
  }
  if (act === 'use-ai-draft') {
    event.preventDefault();
    useAiDraft();
    return true;
  }
  if (act === 'dismiss-ai-draft') {
    event.preventDefault();
    hideAiDraft();
    $('compose-text')?.focus();
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
    const peer = button?.dataset.peer || $('view')?.querySelector('.chat-head')?.dataset.peer;
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
    const requested = $('view')?.dataset.convoStatus === 'request' || Boolean(button?.closest('.request-row'));
    if (requested && convoId) {
      api.acceptConvo(convoId).then(() => {
        if ($('view')) {
          $('view').dataset.convoStatus = 'accepted';
          $('view').querySelector('.request-banner')?.remove();
        }
      }).catch(() => {});
    }
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
  if (act === 'accept-convo') {
    event.preventDefault();
    const id = button?.dataset.convo;
    if (!id) return true;
    try {
      await api.acceptConvo(id);
      toast('Request accepted');
      if (parseHash()[1] === 'requests') route();
      else if ($('view')) {
        $('view').dataset.convoStatus = 'accepted';
        $('view').querySelector('.request-banner')?.remove();
      }
      refreshBadge();
    } catch (error) { toast(error.message); }
    return true;
  }
  if (act === 'decline-convo') {
    event.preventDefault();
    const id = button?.dataset.convo;
    if (!id) return true;
    if (!window.confirm('Delete this message request?')) return true;
    try {
      await api.leaveConvo(id);
      toast('Request deleted');
      refreshBadge();
      if (parseHash()[1] === id) location.hash = '#/messages/requests';
      else route();
    } catch (error) { toast(error.message); }
    return true;
  }
  if (act === 'withdraw-join') {
    event.preventDefault();
    const id = button?.dataset.convo;
    if (!id) return true;
    if (!window.confirm('Withdraw this request to join?')) return true;
    try {
      await api.withdrawJoinRequest(id);
      button.closest('.person')?.remove();
      toast('Request withdrawn');
      refreshBadge();
      if (!$('view')?.querySelector('.person')) route();
    } catch (error) { toast(error.message); }
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
  if (act === 'cleanup-select' || act === 'cleanup-select-spam') {
    event.preventDefault();
    cleanupMatches().forEach((person) => {
      if (!person.followingUri) return;
      if (act === 'cleanup-select-spam' && !followSpam(person).likely) return;
      followCleanup.selected.add(person.did);
    });
    paintFollowCleanup();
    return true;
  }
  if (act === 'cleanup-clear') {
    event.preventDefault();
    followCleanup.selected.clear();
    paintFollowCleanup();
    return true;
  }
  if (act === 'cleanup-spam') {
    event.preventDefault();
    if (!signedIn()) return requireSignIn(), true;
    const picked = followCleanup.people.filter((person) => person.followingUri && followSpam(person).likely);
    if (!picked.length) {
      toast('No loaded accounts look like spam.');
      return true;
    }
    followCleanup.selected = new Set(picked.map((person) => person.did));
    paintFollowCleanup();
    await unfollowCleanup(picked, button);
    return true;
  }
  if (act === 'cleanup-undo') {
    event.preventDefault();
    if (!signedIn()) return requireSignIn(), true;
    await undoCleanup(button);
    return true;
  }
  if (act === 'followback-now') {
    event.preventDefault();
    await runFollowBack(true);
    return true;
  }
  if (act === 'followback-release') {
    event.preventDefault();
    if (!signedIn()) return requireSignIn(), true;
    releaseFollowHold(myDid());
    followBack.note = 'Held accounts can be followed back again.';
    paintFollowBack();
    toast('Held accounts released.');
    return true;
  }
  if (act === 'cleanup-more') {
    event.preventDefault();
    followCleanup.shown += 200;
    paintFollowCleanup();
    return true;
  }
  if (act === 'cleanup-unfollow' || act === 'cleanup-one') {
    event.preventDefault();
    if (!signedIn()) return requireSignIn(), true;
    const picked = act === 'cleanup-one'
      ? followCleanup.people.filter((person) => person.did === (button?.dataset.did || ''))
      : cleanupPicked(cleanupMatches());
    await unfollowCleanup(picked, button);
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
  if (act === 'account-card') {
    event.preventDefault();
    toggleAccountCard(event.target.closest('[data-act="account-card"]'));
    return;
  }
  if (act === 'more' || act === 'repost' || act === 'profile-menu' || act === 'tab-menu' || act === 'nav-more') {
    event.preventDefault();
    const button = event.target.closest('[data-act]');
    if (act === 'more' || act === 'repost') {
      const found = postFrom(event.target);
      if (found?.post) {
        if (act === 'more') moreMenu(button, found);
        else repostMenu(button, found);
      }
    } else if (act === 'profile-menu') openProfileMenu(button);
    else if (act === 'tab-menu') openHomeTabMenu(button);
    else openMoreMenu(button);
    return;
  }
  if (act === 'desktop-download') {
    event.preventDefault();
    const button = event.target.closest('[data-file]');
    if (button?.dataset.file) saveDesktopZip(button.dataset.file, button);
    return;
  }
  if (act === 'dictate') {
    event.preventDefault();
    toggleDictate();
    return;
  }
  if (act && await handleChromeAct(act, event)) return;
  if (event.target.closest('[data-act="image"], .shot, .action, .more, .follow, .card, .facet')) {
    /* buttons handle themselves below */
  }
  if (act === 'remove-image') {
    event.preventDefault();
    const index = Number(event.target.closest('[data-index]')?.dataset.index);
    const dialog = $('compose');
    const files = dialog?._files || [];
    if (!Number.isInteger(index) || !files[index]) return;
    const [gone] = files.splice(index, 1);
    if (gone?.url && !gone.kept) URL.revokeObjectURL(gone.url);
    dialog._files = files;
    renderPreviews();
    scheduleLinkPreview();
    return;
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
    dialog._dismissedUrl = dialog._card?.sourceUrl || trailingUrl($('compose-text').value);
    dialog._keptExternal = null;
    dialog._card = null;
    dialog._linkMiss = '';
    linkEpoch += 1;
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
  if (act === 'to-top') {
    event.preventDefault();
    scrollToTop();
    return;
  }
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
  if (act === 'ai-post') {
    event.preventDefault();
    checkPostAi(event.target);
    return;
  }
  if (act === 'ai-profile') {
    event.preventDefault();
    checkProfileAi();
    return;
  }
  if (act === 'alpha-debug') {
    event.preventDefault();
    closeAlphaMenu();
    openDebug();
    return;
  }
  if (act === 'alpha-design') {
    event.preventDefault();
    applyDesign(!designOn());
    closeAlphaMenu();
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
    if (event.target.closest('video')) return;
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
    commitAiAccount(null).then(() => {
      toast('AI account removed from your Bluesky account');
      if (parseHash()[0] === 'settings') showSettings();
    }).catch((error) => toast(error.message || 'Could not remove the key from your Bluesky account.'));
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
  if (act === 'follow') return toggleFollow(event.target.closest('[data-act="follow"]'));
  if (!act && event.target.closest('a, button, .card, .shot, .video')) return;
  const quote = event.target.closest?.('.quote[data-href]');
  if (quote && !event.target.closest('a, button')) {
    location.hash = quote.getAttribute('data-href');
    return;
  }
  if (selectedText().trim() && event.target.closest('.text, .bio, .quote-text, .bubble, .snip, .said, .ai-note')) return;
  if (event.target.closest('.post') && !event.target.closest('a, button, .ai-note')) {
    const link = found.article.querySelector('.time');
    const href = link?.getAttribute('href');
    if (!href || !found.article.classList.contains('feed-post')) return;
    if (location.hash === href) route();
    else location.hash = href;
  }
}

function repostMenu(anchor, found) {
  const on = Boolean(found.article.dataset.repost);
  if (!toggleMenu(anchor, [
    { id: on ? 'unrepost' : 'repost', label: on ? 'Undo repost' : 'Repost' },
    { id: 'quote', label: 'Quote' },
  ])) return;
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
    items.push({ id: 'edit-post', label: 'Edit' });
    items.push({ id: pinnedUri === found.post.uri ? 'unpin' : 'pin', label: pinnedUri === found.post.uri ? 'Unpin from profile' : 'Pin to profile' });
    items.push({ id: 'delete', label: 'Delete', danger: true });
  } else {
    items.push({ id: author.viewer?.muted ? 'unmute' : 'mute', label: author.viewer?.muted ? 'Unmute account' : 'Mute account' });
    if (!author.viewer?.blocking) items.push({ id: 'block', label: 'Block account' });
    items.push({ id: 'report', label: 'Report post' });
  }
  items.push({ id: 'mute-thread', label: 'Mute thread' });
  if (!toggleMenu(anchor, items)) return;
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
  const id = event.target.closest?.('[data-menu]')?.dataset.menu;
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
  if (id === 'edit-tabs') return openLaneEditor();
  if (id === 'home-settings') return openTune('home');
  if (id === 'feed-settings') return openTune('feed', homeActive()?.value || '');
  if (id === 'open-list') {
    const uri = homeActive()?.value || '';
    if (uri) location.hash = `#/list/${encodeURIComponent(uri)}`;
    return;
  }
  if (id === 'edit-profile') return openProfileEditor();
  if (id === 'edit-links') return openAttachPicker('profile');
  if (id === 'message-profile') {
    if (!signedIn()) return requireSignIn();
    try {
      const convo = await convoIdFor(shownProfile?.did || '');
      location.hash = `#/messages/${encodeURIComponent(convo)}`;
    } catch (error) { toast(error.message); }
    return;
  }
  if (id === 'profile-voice' || id === 'profile-video') {
    if (!signedIn()) return requireSignIn();
    if (!canCall()) {
      toast('Voice and video need a secure page. Open LibreSky over https, or on http://127.0.0.1.');
      return;
    }
    const peer = shownProfile?.did || '';
    try {
      const convoId = await convoIdFor(peer);
      if (!convoId || !peer) throw new Error('Could not open that conversation.');
      await startCall({ convoId, peerDid: peer, media: id === 'profile-video' ? 'video' : 'audio' });
    } catch (error) {
      toast(error?.message || 'The call could not start.');
    }
    return;
  }
  if (id === 'profile-mute') {
    const profile = shownProfile;
    if (!profile?.did || !signedIn()) return requireSignIn();
    try {
      if (profile.viewer?.muted) await api.unmuteActor(profile.did);
      else await api.muteActor(profile.did);
      toast(profile.viewer?.muted ? 'Unmuted' : `Muted @${profile.handle || 'account'}`);
      route();
    } catch (error) { toast(error.message); }
    return;
  }
  if (id === 'profile-block') {
    const profile = shownProfile;
    if (!profile?.did || !signedIn()) return requireSignIn();
    const existing = profile.viewer?.blocking || '';
    try {
      if (existing) {
        await api.deleteRecord(existing);
        toast('Unblocked');
      } else {
        const handle = profile.handle ? `@${profile.handle}` : 'this account';
        if (!window.confirm(`Block ${handle}? You will not see each other’s posts.`)) return;
        await api.block(profile.did);
        toast('Blocked');
      }
      route();
    } catch (error) { toast(error.message); }
    return;
  }
  if (id === 'profile-report') return openReport({ did: shownProfile?.did });
  if (id === 'profile-copy' || id === 'profile-share') {
    const profile = shownProfile;
    if (!profile) return;
    if (id === 'profile-share') return shareProfile(profile);
    try {
      await navigator.clipboard.writeText(profileLink(profile));
      toast('Link copied');
    } catch (error) { toast(error.message); }
    return;
  }
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
  if (id === 'edit-post') {
    if (!found.post?.record || !found.post?.uri) {
      toast('This post cannot be edited.');
      return;
    }
    return openComposer({ edit: found.post });
  }
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
      holdFollowTargets(myDid(), [did]);
      const row = followCleanup.people.find((person) => person.did === did);
      if (row) {
        writeFollowUndo(followCleanup.did || myDid(), [undoPerson(row), ...followCleanup.undo.filter((person) => person.did !== did)]);
        followCleanup.people = followCleanup.people.filter((person) => person.did !== did);
        followCleanup.selected.delete(did);
        if ($('cleanup-list')) paintFollowCleanup();
      }
    } else {
      syncFollow(did, (await api.follow(did)).uri);
      dropFollowHold(myDid(), did);
      if ($('followback-status')) paintFollowBack();
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

// Bluesky video is MPEG-TS HLS (H.264 + AAC). Chrome answers "maybe" for
// application/vnd.apple.mpegurl and then leaves the controls at 0:00.
// hls.js plays that playlist. Native HLS is only the fallback.
function canPlayBskyVideoCodecs() {
  const mediaSource = globalThis.ManagedMediaSource || globalThis.MediaSource || globalThis.WebKitMediaSource;
  if (!mediaSource || typeof mediaSource.isTypeSupported !== 'function') return false;
  return mediaSource.isTypeSupported('video/mp4; codecs="avc1.42E01E"')
    && mediaSource.isTypeSupported('audio/mp4; codecs="mp4a.40.2"');
}

let activeHls = null;

function stopVideo() {
  activeHls?.destroy();
  activeHls = null;
}

function mountVideo(node) {
  const player = document.createElement('div');
  player.className = 'video playing';
  if (node.style.cssText) player.style.cssText = node.style.cssText;
  const video = document.createElement('video');
  video.controls = true;
  video.playsInline = true;
  video.preload = 'metadata';
  const poster = node.querySelector('img')?.getAttribute('src') || '';
  if (poster) video.poster = poster;
  const alt = node.dataset.alt || '';
  if (alt) video.setAttribute('aria-label', alt);
  player.append(video);
  node.replaceWith(player);
  return { player, video };
}

function failVideo(player) {
  stopVideo();
  player.replaceChildren();
  player.textContent = 'This browser could not play the video.';
}

function playNativeVideo(player, video, playlist) {
  // Native HLS is for players with no Media Source, such as iOS Safari.
  // Where Media Source exists, Chrome's native HLS reports 0:00 for these playlists.
  if (canPlayBskyVideoCodecs() || !video.canPlayType('application/vnd.apple.mpegurl')) {
    failVideo(player);
    return;
  }
  video.src = playlist;
  video.play().catch(() => {});
}

async function playVideo(node) {
  if (!node || node.dataset.playing || node.classList.contains('playing')) return;
  const playlist = node.dataset.playlist;
  if (!playlist) return;
  node.dataset.playing = '1';
  stopVideo();
  const { player, video } = mountVideo(node);
  if (canPlayBskyVideoCodecs()) {
    try {
      const mod = await import('https://cdn.jsdelivr.net/npm/hls.js@1.6.13/+esm');
      const Hls = mod.default;
      if (!player.isConnected) return;
      if (Hls?.isSupported()) {
        const hls = new Hls({ maxMaxBufferLength: 30 });
        activeHls = hls;
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          video.play().catch(() => {});
        });
        hls.on(Hls.Events.ERROR, (_event, data) => {
          if (!data?.fatal || activeHls !== hls) return;
          hls.destroy();
          if (activeHls === hls) activeHls = null;
          failVideo(player);
        });
        hls.attachMedia(video);
        hls.loadSource(playlist);
        return;
      }
    } catch {
      /* fall through */
    }
  }
  if (!player.isConnected) return;
  playNativeVideo(player, video, playlist);
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
  browsing = false;
  try { sessionStorage.removeItem('libresky.browse'); } catch { /* the sign-in screen still opens */ }
  openGate();
  route();
}

let composerEscapeLock = false;

function composerHasWork() {
  const dialog = $('compose');
  if (!dialog) return false;
  if (($('compose-text')?.value || '').trim()) return true;
  if ((dialog._files || []).length) return true;
  if (dialog._gif || dialog._video || dialog._attach?.uri) return true;
  if (dialog._card) return true;
  if (dialog.dataset.quote) return true;
  return false;
}

function requestCloseComposer() {
  if (composerEscapeLock) return;
  composerEscapeLock = true;
  queueMicrotask(() => { composerEscapeLock = false; });
  const dialog = $('compose');
  if (!dialog?.open) return;
  const suggest = $('suggest');
  if (suggest && !suggest.hidden && suggestArea?.id === 'compose-text') {
    hideSuggest();
    return;
  }
  if (pickerMode && $('compose-picker') && !$('compose-picker').hidden) {
    closePicker();
    return;
  }
  const leave = $('compose-leave');
  if (leave && !leave.hidden) {
    leave.hidden = true;
    $('compose-text')?.focus();
    return;
  }
  const unchanged = Boolean(dialog.dataset.edit && dialog._editBase && editFingerprint(dialog) === dialog._editBase);
  if (!composerHasWork() || unchanged) {
    if (!dialog.dataset.reply && !dialog.dataset.quote && !dialog.dataset.edit && !($('compose-text')?.value || '').trim()) saveDraft('');
    dialog.close();
    return;
  }
  const note = $('compose-leave-note');
  if (note) note.hidden = !((dialog._files || []).length || dialog._gif || dialog._video);
  if (!leave) {
    dialog.close();
    return;
  }
  leave.hidden = false;
  $('compose-continue')?.focus();
}

function dismissComposer(mode) {
  const dialog = $('compose');
  const leave = $('compose-leave');
  if (leave) leave.hidden = true;
  if (!dialog) return;
  if (mode === 'draft') saveDraft($('compose-text')?.value || '');
  if (mode === 'discard' && !dialog.dataset.reply && !dialog.dataset.quote && !dialog.dataset.edit) saveDraft('');
  dialog.close();
}

function scrollToTop() {
  document.querySelectorAll('#view .post.selected').forEach((post) => post.classList.remove('selected'));
  selected = -1;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function onKey(event) {
  if (event.key === 'Escape') {
    const appMenu = $('app-menu');
    if (layerOpen(appMenu)) {
      event.preventDefault();
      closeAppMenu(true);
      return;
    }
    if (document.querySelector('.alpha-wrap.is-open')) {
      event.preventDefault();
      closeAlphaMenu(true);
      return;
    }
    const menu = $('menu');
    if (layerOpen(menu)) {
      event.preventDefault();
      closeMenu();
      return;
    }
    const hover = $('hovercard');
    if (hover && !hover.hidden) {
      event.preventDefault();
      closeHover();
      return;
    }
    const open = [...document.querySelectorAll('dialog[open]')];
    const dialog = open[open.length - 1];
    if (!dialog || dialog.id === 'call') return;
    event.preventDefault();
    event.stopPropagation();
    if (dialog.id === 'compose') requestCloseComposer();
    else dialog.close();
    return;
  }
  const typing = ['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName) || document.activeElement?.isContentEditable;
  if (typing || document.querySelector('dialog[open]')) return;
  const postsOnPage = () => [...document.querySelectorAll('#view .post.feed-post')];
  const plainShift = event.shiftKey && !event.metaKey && !event.ctrlKey && !event.altKey && !event.isComposing;
  if (plainShift && event.key === 'ArrowUp') {
    if (event.repeat) return;
    event.preventDefault();
    scrollToTop();
    return;
  }
  if (plainShift && event.key === 'Enter') {
    if (event.repeat) return;
    event.preventDefault();
    openComposer();
    return;
  }
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
    if (area?.id === 'compose-text') {
      rememberDictateCaret(area);
      paintFieldHighlight(area, $('compose-highlight'));
      paintStyleButtons(area);
    } else if (area?.id === 'chat-text') {
      paintFieldHighlight(area, $('chat-highlight'));
      paintStyleButtons(area);
    } else if (area?.id === 'ai-text') paintFieldHighlight(area, $('ai-highlight'));
  });
  document.addEventListener('mousedown', (event) => {
    const button = event.target.closest?.('[data-act="style"]');
    if (!button) return;
    const area = button.closest('#chat-form') ? $('chat-text') : $('compose-text');
    if (area) button._range = { start: area.selectionStart, end: area.selectionEnd };
    event.preventDefault();
  });
  document.addEventListener('toggle', (event) => {
    const group = event.target?.dataset?.emojiGroup ? event.target : null;
    if (!group || $('emoji-find')?.value.trim()) return;
    const name = group.dataset.emojiGroup;
    if (group.open) collapsedEmoji.delete(name);
    else collapsedEmoji.add(name);
  }, true);
  document.addEventListener('pointerdown', (event) => {
    const button = event.target.closest?.('#suggest [data-insert]');
    if (!button) return;
    event.preventDefault();
    event.stopPropagation();
    applySuggest(button.dataset.insert || '');
  }, true);
  const loginDownloads = $('login-downloads');
  if (loginDownloads) loginDownloads.innerHTML = downloadsHtml(true);
  window.addEventListener('scroll', (event) => {
    closeHover();
    if (pageScroll(event)) {
      closeMenu();
      closeAppMenu();
      closeAlphaMenu();
    }
    placeFresh();
  }, true);
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && homeWatch.timer) pollHome(homeWatch.token);
  });
  window.addEventListener('resize', () => {
    if (performance.now() - layerOpenedAt >= 450) {
      closeMenu();
      closeAppMenu();
    } else {
      placeOpenLayers();
    }
    placeFresh();
    if (designOn()) paintDesignReadout();
    measureHead();
    document.querySelectorAll('.tab-scroller').forEach((scroller) => syncStrip(scroller));
  });
  $('menu').addEventListener('click', onMenu);
  $('app-menu-btn')?.addEventListener('click', () => toggleAppMenu());
  $('app-menu')?.addEventListener('click', (event) => {
    if (event.target.closest('a, button')) closeAppMenu();
  });
  document.addEventListener('click', (event) => {
    if (!event.target.closest('.alpha-wrap')) closeAlphaMenu();
    if (!event.target.closest('#app-menu, #app-menu-btn')) closeAppMenu();
    if (!event.target.closest('#menu, [data-act="more"], [data-act="nav-more"], [data-act="tab-menu"], [data-act="profile-menu"], [data-act="repost"], #account-btn, #more-btn')) closeMenu();
    if (!event.target.closest('#suggest, #compose-text, #chat-text, #ai-text')) hideSuggest();
    if (!event.target.closest('#hovercard, [data-act="account-card"]')) closeHover();
  });
  document.addEventListener('pointerover', scheduleHover);
  document.addEventListener('pointerout', scheduleHoverHide);
  $('hovercard')?.addEventListener('pointerover', (event) => {
    if (event.pointerType && event.pointerType !== 'mouse') return;
    clearTimeout(hoverHideTimer);
  });
  $('hovercard')?.addEventListener('pointerout', scheduleHoverHide);
  document.addEventListener('keydown', onKey);
  $('back').addEventListener('click', () => goBack());
  $('compose-mic')?.addEventListener('pointerdown', (event) => {
    event.preventDefault();
    rememberDictateCaret($('compose-text'));
  });
  $('account-btn').addEventListener('click', () => {
    if (!signedIn()) requireSignIn();
    else toggleMenu($('account-btn'), accountMenuItems());
  });
  $('about-close')?.addEventListener('click', () => $('about')?.close());
  $('help-close')?.addEventListener('click', () => $('help')?.close());
  $('lanes-close')?.addEventListener('click', () => $('lanes')?.close());
  $('help')?.addEventListener('click', (event) => {
    if (event.target.closest('a[href^="#"]')) $('help')?.close();
  });
  $('lanes')?.querySelector('form')?.addEventListener('submit', (event) => event.preventDefault());
  $('legal-close')?.addEventListener('click', () => $('legal')?.close());
  $('call-hangup')?.addEventListener('click', () => hangUp(true));
  $('debug-close')?.addEventListener('click', () => $('debug-log')?.close());
  $('debug-clear')?.addEventListener('click', () => {
    clearAiLog();
    paintDebugLog();
  });
  $('debug-copy')?.addEventListener('click', () => copyDebugLog());
  subscribeAiLog(() => {
    if ($('debug-log')?.open) paintDebugLog();
  });
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
  $('login-browse')?.addEventListener('click', () => startBrowse());
  $('login').addEventListener('close', () => {
    if (signedIn()) return;
    rememberBrowse();
    document.documentElement.removeAttribute('data-signed-out');
    if (!$('view')?.innerHTML.trim()) route();
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
  $('compose-cancel').addEventListener('click', () => requestCloseComposer());
  $('compose-continue')?.addEventListener('click', () => {
    const leave = $('compose-leave');
    if (leave) leave.hidden = true;
    $('compose-text')?.focus();
  });
  $('compose-save-draft')?.addEventListener('click', () => dismissComposer('draft'));
  $('compose-discard')?.addEventListener('click', () => dismissComposer('discard'));
  $('compose')?.addEventListener('cancel', (event) => {
    event.preventDefault();
    requestCloseComposer();
  });
  $('compose-text').addEventListener('beforeinput', (event) => {
    const area = $('compose-text');
    if (!area || event.isComposing) return;
    snapshotField(area);
  });
  $('compose-text').addEventListener('compositionstart', () => snapshotField($('compose-text')));
  $('compose-text').addEventListener('compositionend', () => {
    const area = $('compose-text');
    applyHeldStyles(area);
    updateCount();
    paintStyleButtons(area);
  });
  $('compose-text').addEventListener('input', (event) => {
    const area = $('compose-text');
    if (event.isTrusted) hideAiDraft();
    if (!event.isComposing) {
      if (event.isTrusted) applyHeldStyles(area);
      else area._before = area.value;
    }
    updateCount();
    paintStyleButtons(area);
    const dialog = $('compose');
    if (!dialog.dataset.reply && !dialog.dataset.quote && !dialog.dataset.edit) saveDraft(area.value);
    scheduleLinkPreview();
  });
  $('compose-text').addEventListener('keydown', (event) => {
    if (onSuggestKey(event)) return;
    shiftEnterSends(event);
  });
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
    stopDictate();
    clearComposeTypos();
    hideSuggest();
    styleHold.delete('compose-text');
    closePicker();
    const leave = $('compose-leave');
    if (leave) leave.hidden = true;
    const video = $('compose')._video;
    if (video?.url) URL.revokeObjectURL(video.url);
    $('compose')._video = null;
    $('compose')._attach = null;
    $('compose')._keptExternal = null;
    $('compose')._card = null;
    $('compose')._linkMiss = '';
    $('compose')._linkWatch = '';
    linkEpoch += 1;
    $('compose').dataset.edit = '';
    const send = $('compose-send');
    if (send) send.textContent = 'Post';
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
  $('compose-picker')?.addEventListener('keydown', onPickerKey);
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
        input._before = '';
        styleHold.delete('chat-text');
        paintFieldHighlight(input, $('chat-highlight'));
        fitChatInput(input);
        paintStyleButtons(input);
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
    if (event.target.id === 'ai-inline') {
      event.preventDefault();
      const text = event.target.querySelector('input')?.value.trim() || '';
      if (!text) return;
      if (!aiReady(loadAi())) {
        location.hash = '#/ai';
        return;
      }
      aiPending = text;
      aiPendingNote = 'Home';
      if (parseHash()[0] === 'ai') showAi();
      else location.hash = '#/ai';
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
    if (event.target?.dataset?.cleanupDid) {
      const did = event.target.dataset.cleanupDid;
      if (event.target.checked) followCleanup.selected.add(did);
      else followCleanup.selected.delete(did);
      event.target.closest('.cleanup-person')?.classList.toggle('on', event.target.checked);
      paintCleanupChrome();
    }
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
    if (onPickerKey(event)) return;
    if (event.target.id === 'chat-text' && event.key === 'Escape' && $('chat-picker') && !$('chat-picker').hidden) {
      event.preventDefault();
      event.stopPropagation();
      closePicker();
      return;
    }
    const tab = event.target.closest?.('[data-settings-tab]');
    if (tab && (event.key === 'ArrowRight' || event.key === 'ArrowLeft' || event.key === 'Home' || event.key === 'End')) {
      const buttons = [...document.querySelectorAll('[data-settings-tab]')];
      const index = buttons.indexOf(tab);
      let next = index;
      if (event.key === 'ArrowRight') next = (index + 1) % buttons.length;
      else if (event.key === 'ArrowLeft') next = (index - 1 + buttons.length) % buttons.length;
      else if (event.key === 'Home') next = 0;
      else next = buttons.length - 1;
      event.preventDefault();
      buttons[next]?.focus();
      selectSettingsTab(buttons[next]?.dataset.settingsTab || '');
      return;
    }
    if (event.target.id !== 'chat-text' && event.target.id !== 'ai-text') return;
    if (onSuggestKey(event)) return;
    shiftEnterSends(event);
  });
  $('view').addEventListener('input', (event) => {
    if (event.target.id === 'cleanup-find') {
      followCleanup.filters.q = event.target.value;
      followCleanup.shown = 200;
      paintFollowCleanup();
      return;
    }
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
    if (event.target.id === 'post-scale') {
      const saved = saveA11yPrefs({ scale: Number(event.target.value) });
      applyA11y(saved);
      const label = $('post-scale-label');
      if (label) label.textContent = `${saved.scale}%`;
    }
    if (event.target.id !== 'chat-text' && event.target.id !== 'ai-text') return;
    if (event.target.id === 'chat-text' && !event.isComposing) {
      if (event.isTrusted) applyHeldStyles(event.target);
      else event.target._before = event.target.value;
    }
    paintFieldHighlight(event.target, event.target.id === 'chat-text' ? $('chat-highlight') : $('ai-highlight'));
    fitChatInput(event.target);
    if (event.target.id === 'chat-text') paintStyleButtons(event.target);
    scheduleSuggest(event.target);
  });
  $('view').addEventListener('beforeinput', (event) => {
    if (event.target.id !== 'chat-text' || event.isComposing) return;
    snapshotField(event.target);
  });
  $('view').addEventListener('compositionstart', (event) => {
    if (event.target.id === 'chat-text') snapshotField(event.target);
  });
  $('view').addEventListener('compositionend', (event) => {
    if (event.target.id !== 'chat-text') return;
    applyHeldStyles(event.target);
    paintFieldHighlight(event.target, $('chat-highlight'));
    fitChatInput(event.target);
    paintStyleButtons(event.target);
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
    const emoji = event.target.closest?.('[data-emoji]');
    if (emoji && event.target.closest('#chat-picker')) {
      event.preventDefault();
      insertEmoji(emoji.dataset.emoji || '');
      return;
    }
    const chatChoice = event.target.closest('[data-chat-allow]')?.dataset.chatAllow;
    if (chatChoice) {
      chooseChatAllow(chatChoice);
      return;
    }
    const callChoice = event.target.closest('[data-call-allow]')?.dataset.callAllow;
    if (callChoice) {
      chooseCallAllow(callChoice);
      return;
    }
    const settingsTabId = event.target.closest('[data-settings-tab]')?.dataset.settingsTab;
    if (settingsTabId) {
      selectSettingsTab(settingsTabId);
      return;
    }
    const cleanupButton = event.target.closest('[data-cleanup]');
    if (cleanupButton?.dataset.value) {
      event.preventDefault();
      setCleanupFilter(cleanupButton.dataset.cleanup, cleanupButton.dataset.value);
      return;
    }
    const followCap = event.target.closest('[data-follow-cap]')?.dataset.followCap;
    if (followCap) {
      event.preventDefault();
      saveFollowDeskPrefs({ cap: Number(followCap) });
      document.querySelectorAll('[data-follow-cap]').forEach((button) => {
        button.setAttribute('aria-pressed', button.dataset.followCap === String(followDeskPrefs().cap) ? 'true' : 'false');
      });
      paintFollowBack();
      return;
    }
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
      if (dialog.id === 'call') return;
      if (dialog.id === 'compose') {
        requestCloseComposer();
        return;
      }
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

const TIP_SELECTOR = '[data-tip], button, a.nav-link, a.tip, a.time, .tabbar a, label.icon-btn';

function tipLabel(node) {
  if (!node || node.getAttribute('aria-disabled') === 'true') return '';
  if (node.closest('.emoji-grid, .gif-grid, [data-act="account-card"]')) return '';
  const explicit = node.dataset.tip || '';
  if (explicit) return explicit;
  if (node.disabled) return '';
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
  const frame = viewportFrame();
  const width = tip.offsetWidth || 80;
  const height = tip.offsetHeight || 28;
  const nearBottom = rect.bottom > frame.height - 72;
  let left;
  let top;
  if (nearBottom) {
    left = rect.left + (rect.width / 2) - (width / 2);
    top = rect.top - height - 8;
  } else if (rect.left < 300) {
    left = rect.right + 8;
    top = rect.top + (rect.height / 2) - (height / 2);
  } else {
    left = rect.left + (rect.width / 2) - (width / 2);
    top = rect.bottom + 8;
  }
  left = Math.max(8, Math.min(left, frame.width - width - 8));
  top = Math.max(8, Math.min(top, frame.height - height - 8));
  pinBox(tip, left, top);
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

let alphaAudio;

function playAlphaDoor() {
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return;
  if (!alphaAudio) alphaAudio = new AudioCtx();
  const ctx = alphaAudio;
  if (ctx.state === 'suspended') ctx.resume().catch(() => {});
  const now = ctx.currentTime;
  const master = ctx.createGain();
  master.gain.setValueAtTime(0.0001, now);
  master.gain.exponentialRampToValueAtTime(0.2, now + 0.02);
  master.gain.exponentialRampToValueAtTime(0.0001, now + 0.72);
  master.connect(ctx.destination);

  const noiseLen = Math.floor(ctx.sampleRate * 0.07);
  const buffer = ctx.createBuffer(1, noiseLen, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < noiseLen; i += 1) data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.018));
  const noise = ctx.createBufferSource();
  noise.buffer = buffer;
  const band = ctx.createBiquadFilter();
  band.type = 'bandpass';
  band.frequency.value = 1400;
  band.Q.value = 0.7;
  noise.connect(band);
  band.connect(master);
  noise.start(now);

  const tick = ctx.createOscillator();
  tick.type = 'triangle';
  tick.frequency.setValueAtTime(240, now);
  tick.frequency.exponentialRampToValueAtTime(80, now + 0.12);
  const tickGain = ctx.createGain();
  tickGain.gain.setValueAtTime(0.45, now);
  tickGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.14);
  tick.connect(tickGain);
  tickGain.connect(master);
  tick.start(now);
  tick.stop(now + 0.16);

  [784, 1176].forEach((freq, index) => {
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = freq;
    const gain = ctx.createGain();
    const start = now + 0.06;
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(index === 0 ? 0.16 : 0.07, start + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.55);
    osc.connect(gain);
    gain.connect(master);
    osc.start(start);
    osc.stop(start + 0.56);
  });
}

const DESIGN_KEY = 'libresky.design';
const AI_CHECK_POST = 'You are AI Assist in LibreSky. Check the post you are given. Say what it is about, note claims you cannot verify from the text alone, and keep it to one short paragraph. Do not invent sources, names, or events. Plain text.';
const AI_CHECK_PROFILE = 'You are AI Assist in LibreSky. Check the profile you are given. Describe how the account presents itself from the name, handle, and bio only. Do not invent a biography, job, or location. One short paragraph. Plain text.';

function designOn() {
  try { return sessionStorage.getItem(DESIGN_KEY) === '1'; } catch { return false; }
}

function paintDesignReadout() {
  const box = $('design-readout');
  if (!box || box.hidden) return;
  const theme = document.documentElement.dataset.theme || 'system';
  const route = location.hash || '#/';
  const ai = aiReady(loadAi()) ? `${AI_NAME} on` : `${AI_NAME} off`;
  const last = aiLog()[0];
  const lastLine = last
    ? `${last.ok ? 'Last reply' : 'Last error'} · ${last.note || 'call'} · ${last.ms} ms`
    : 'No AI calls yet';
  box.textContent = `Design · ${route} · ${window.innerWidth}×${window.innerHeight} · ${theme} · ${ai} · ${lastLine}`;
}

function applyDesign(on) {
  if (on) document.documentElement.dataset.design = 'on';
  else delete document.documentElement.dataset.design;
  const button = $('alpha-design');
  if (button) button.setAttribute('aria-pressed', on ? 'true' : 'false');
  const box = $('design-readout');
  if (box) {
    box.hidden = !on;
    if (on) paintDesignReadout();
  }
  try { sessionStorage.setItem(DESIGN_KEY, on ? '1' : '0'); } catch { /* the outline still follows this click */ }
}

function debugWhen(iso) {
  const date = new Date(iso || '');
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

function paintDebugLog() {
  const body = $('debug-body');
  if (!body) return;
  const rows = aiLog();
  if (!rows.length) {
    body.innerHTML = `<p class="dim">No ${AI_NAME} calls in this tab yet. Ask on Home, check a post or a profile, or use Check in Settings. The key is not written here.</p>`;
    return;
  }
  body.innerHTML = rows.map((row) => {
    const meta = [row.provider, row.model, row.kind, row.ms != null ? `${row.ms} ms` : ''].filter(Boolean).join(' · ');
    const asked = row.asked ? `<p class="debug-asked"><span>Asked</span> ${escapeHtml(row.asked)}</p>` : '';
    const bodyText = row.ok ? (row.text || '(empty reply)') : (row.error || 'The call failed.');
    return `<article class="debug-row${row.ok ? '' : ' is-error'}">
      <header><strong>${row.ok ? 'Reply' : 'Error'}</strong><span>${escapeHtml(row.note || 'call')}</span><time>${escapeHtml(debugWhen(row.at))}</time></header>
      <p class="debug-meta">${escapeHtml(meta)}</p>
      ${asked}
      <pre>${escapeHtml(bodyText)}</pre>
    </article>`;
  }).join('');
}

function aiLogText() {
  const rows = aiLog();
  if (!rows.length) return `No ${AI_NAME} calls yet.`;
  return rows.map((row) => {
    const head = [row.ok ? 'OK' : 'ERROR', row.note, row.provider, row.model, row.kind, row.ms != null ? `${row.ms}ms` : '', row.at].filter(Boolean).join(' · ');
    const asked = row.asked ? `Asked: ${row.asked}\n` : '';
    return `${head}\n${asked}${row.ok ? row.text : row.error}`;
  }).join('\n\n');
}

function openDebug() {
  paintDebugLog();
  const dialog = $('debug-log');
  if (dialog && !dialog.open) dialog.showModal();
}

async function copyDebugLog() {
  const text = aiLogText();
  try {
    await navigator.clipboard.writeText(text);
    toast('Debug log copied');
  } catch {
    toast('Could not copy the debug log.');
  }
}

let aiCheckSeq = 0;

function aiNote(after) {
  let panel = after?.nextElementSibling;
  if (!panel?.classList.contains('ai-note')) {
    panel = document.createElement('div');
    panel.className = 'ai-note';
    after.insertAdjacentElement('afterend', panel);
  }
  const token = String(++aiCheckSeq);
  panel.dataset.check = token;
  panel.innerHTML = `<p class="ai-note-kicker">${AI_NAME}</p><p>Reading…</p>`;
  return { panel, token };
}

function paintAiNote(panel, token, text, failed) {
  if (!panel?.isConnected || panel.dataset.check !== token) return;
  const body = failed ? escapeHtml(text) : richText(text);
  panel.innerHTML = `<p class="ai-note-kicker">${AI_NAME}</p><p>${body}</p>`;
}

async function checkPostAi(node) {
  const found = postFrom(node);
  const post = found?.post;
  const article = found?.article;
  const saved = loadAi();
  if (!post || !article || !aiReady(saved)) return;
  const main = article.querySelector('.post-main');
  if (!main) return;
  const anchor = main.querySelector('.actions');
  if (!anchor) return;
  const { panel, token } = aiNote(anchor);
  const body = speechText(post).trim();
  try {
    const answer = await askAi(saved, [
      { role: 'system', content: AI_CHECK_POST },
      { role: 'user', content: body || 'This post has no text.' },
    ], AbortSignal.timeout ? AbortSignal.timeout(AI_TIMEOUT_MS) : undefined, 'Post');
    paintAiNote(panel, token, answer, false);
  } catch (error) {
    const message = error?.name === 'AbortError' ? 'The check took too long.' : (error.message || 'The check did not finish.');
    paintAiNote(panel, token, message, true);
  }
}

async function checkProfileAi() {
  const profile = shownProfile;
  const saved = loadAi();
  const header = document.querySelector('#view .profile');
  if (!profile || !header || !aiReady(saved)) return;
  const { panel, token } = aiNote(header);
  const lines = [
    profile.displayName || '',
    profile.handle ? `@${profile.handle}` : '',
    profile.description || '',
  ].filter(Boolean).join('\n');
  try {
    const answer = await askAi(saved, [
      { role: 'system', content: AI_CHECK_PROFILE },
      { role: 'user', content: lines || 'This profile has no name or bio.' },
    ], AbortSignal.timeout ? AbortSignal.timeout(AI_TIMEOUT_MS) : undefined, 'Profile');
    paintAiNote(panel, token, answer, false);
  } catch (error) {
    const message = error?.name === 'AbortError' ? 'The check took too long.' : (error.message || 'The check did not finish.');
    paintAiNote(panel, token, message, true);
  }
}

function releaseAlphaShut() {
  const wrap = document.querySelector('.alpha-wrap');
  const menu = document.getElementById('alpha-menu');
  if (!wrap?.classList.contains('is-shut')) return;
  if (wrap.matches(':hover')) return;
  if (wrap.contains(document.activeElement)) return;
  wrap.classList.remove('is-shut');
  menu?.removeAttribute('inert');
}

function closeAlphaMenu(focus) {
  const wrap = document.querySelector('.alpha-wrap');
  const mark = document.getElementById('alpha-mark');
  const menu = document.getElementById('alpha-menu');
  if (!wrap?.classList.contains('is-open')) return;
  wrap.classList.remove('is-open');
  mark?.setAttribute('aria-expanded', 'false');
  menu?.setAttribute('aria-hidden', 'true');
  const hold = Boolean(focus) || wrap.matches(':hover') || wrap.contains(document.activeElement);
  if (hold) {
    wrap.classList.add('is-shut');
    menu?.setAttribute('inert', '');
  } else {
    wrap.classList.remove('is-shut');
    menu?.removeAttribute('inert');
  }
  if (focus) mark?.focus();
}

function bindAlphaDoor() {
  const mark = document.getElementById('alpha-mark');
  const wrap = mark?.closest('.alpha-wrap');
  const menu = document.getElementById('alpha-menu');
  if (!mark || !wrap) return;
  const quiet = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let last = 0;
  const play = () => {
    if (quiet) return;
    const now = performance.now();
    if (now - last < 900) return;
    last = now;
    try { playAlphaDoor(); } catch { /* this browser kept the chime */ }
  };
  mark.addEventListener('pointerenter', play);
  mark.addEventListener('focus', play);
  wrap.addEventListener('pointerleave', releaseAlphaShut);
  wrap.addEventListener('focusout', () => setTimeout(releaseAlphaShut, 0));
  mark.addEventListener('click', () => {
    if (wrap.classList.contains('is-open')) {
      closeAlphaMenu();
      play();
      return;
    }
    wrap.classList.remove('is-shut');
    menu?.removeAttribute('inert');
    wrap.classList.add('is-open');
    mark.setAttribute('aria-expanded', 'true');
    menu?.setAttribute('aria-hidden', 'false');
    closeAppMenu();
    closeMenu();
    play();
  });
  document.addEventListener('pointerdown', () => {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    if (!alphaAudio) alphaAudio = new AudioCtx();
    if (alphaAudio.state === 'suspended') alphaAudio.resume().catch(() => {});
  }, { capture: true });
}

async function boot() {
  bindAlphaDoor();
  applyDesign(designOn());
  applyA11y(a11yPrefs());
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
  try { browsing = sessionStorage.getItem('libresky.browse') === '1'; } catch { browsing = false; }
  await loadMe();
  clearBoot();
  route();
  if (signedIn()) closeGate();
  else if (offerSignIn()) openGate();
  document.getElementById('boot-error')?.remove();
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      refreshBadge();
      if (signedIn() && followDeskPrefs().auto) runFollowBack(false);
    }
  });
  setInterval(() => { if (document.visibilityState === 'visible') refreshBadge(); }, 15000);
  window.addEventListener('resize', placeOpenLayers);
  window.addEventListener('scroll', placeOpenLayers, true);
  window.visualViewport?.addEventListener('resize', placeOpenLayers);
  window.visualViewport?.addEventListener('scroll', placeOpenLayers);
  armFollowBack();
}

function pageScroll(event) {
  if (performance.now() - layerOpenedAt < 450) return false;
  const target = event.target;
  if (!target || target === document || target === document.documentElement || target === document.body) return true;
  if (target.id === 'view' || target.classList?.contains('messages') || target.classList?.contains('center')) return true;
  return false;
}

function placeOpenLayers() {
  const menu = $('menu');
  if (layerOpen(menu)) {
    if (menu._anchor?.isConnected) placeMenu(menu, menu._anchor);
    else closeMenu();
  }
  const appMenu = $('app-menu');
  if (layerOpen(appMenu)) placeAppMenu();
  const card = $('hovercard');
  if (card && !card.hidden && card._anchor?.isConnected) placeHover(card, card._anchor);
}

boot().catch((error) => {
  clearBoot();
  const view = $('view');
  if (view) view.innerHTML = emptyHtml('LibreSky could not start', error.message || String(error));
});
