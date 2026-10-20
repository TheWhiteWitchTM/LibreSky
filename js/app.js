import * as api from './api.js';
import { acceptCall, canCall, declineCall, hangUp, incomingCall, isInCall, setupCall, startCall } from './call.js';
import {
  actorHtml,
  callBannerHtml,
  callToolsHtml,
  chatHeaderHtml,
  convoHtml,
  drainPosts,
  emptyHtml,
  feedHtml,
  linkPreviewHtml,
  messageHtml,
  notificationsHtml,
  packHtml,
  postHtml,
  profileHtml,
  resetPosts,
  skeletons,
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
  setMutedWords,
  setOauth,
  setPassword,
  signedIn,
} from './session.js';
import { accountGone, caretToken, convoUnread, escapeHtml, firstUrl, graphemeLength, hostOf, messageSender, ownUnread, parseHash, profileHash, richText } from './util.js';

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
  { id: 'news', label: 'News', match: (trend) => trend.category === 'news' || trend.category === 'politics' },
  { id: 'sports', label: 'Sports', match: (trend) => trend.category === 'sports' },
  { id: 'entertainment', label: 'Entertainment', match: (trend) => trend.category === 'entertainment' },
  { id: 'culture', label: 'Culture', match: (trend) => trend.category === 'culture' },
  { id: 'tech', label: 'Tech', match: (trend) => trend.category === 'science-tech' || trend.category === 'tech' },
];
let reportTarget = null;
let chatTimer = 0;
let suggestTimer = 0;
let suggestSeq = 0;
let suggestArea = null;
let tipTimer = 0;
let pickerMode = '';
let gifSeq = 0;
let gifTimer = 0;

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

function applyTheme(theme) {
  const next = theme === 'dark' ? 'dark' : 'light';
  document.documentElement.dataset.theme = next;
  localStorage.setItem('libresky.theme', next);
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.content = next === 'dark' ? '#000000' : '#ffffff';
}

const MORE_NAV = new Set(['feeds', 'feed', 'lists', 'list', 'settings', 'packs', 'pack']);

function setChrome({ title, back = false, tabs = [], nav = '' }) {
  $('title').textContent = title;
  $('back').hidden = !back;
  const tools = $('title-tools');
  if (tools) {
    tools.innerHTML = '';
    delete tools.dataset.peer;
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

async function refreshBadge() {
  if (!signedIn()) {
    paintBadge('notif-badge', 0);
    paintBadge('chat-badge', 0);
    return;
  }
  try {
    const data = await api.getUnreadCount();
    paintBadge('notif-badge', data.count || 0);
  } catch {
    /* the badge is optional */
  }
  try {
    const data = await api.listConvos();
    const convos = data.convos || [];
    const mine = myDid();
    const count = convos.reduce((sum, convo) => sum + convoUnread(convo, mine), 0);
    paintBadge('chat-badge', count);
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
      const list = data.trends || [];
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

function visibleTrends(trends) {
  const tab = EXPLORE_TABS.find((item) => item.id === exploreTab) || EXPLORE_TABS[0];
  return (trends || []).filter(tab.match);
}

function trendBlock(trends, limit) {
  const rows = trendsHtml((trends || []).slice(0, limit));
  return rows ? `<div class="trends">${rows}</div>` : '';
}

async function loadRail() {
  const card = $('rail-card');
  let trends = '';
  try {
    const list = await loadTrends();
    const rows = trendsHtml(list.slice(0, 5), { compact: true });
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

async function showHome(mode) {
  const token = ++generation;
  const following = mode !== 'discover';
  setChrome({
    title: following ? 'Home' : 'Discover',
    nav: 'home',
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
    resetPosts();
    $('view').innerHTML = banner + (feedHtml(data.feed) || emptyHtml('No posts yet', 'Follow a few people and they will show up here.'));
    remember();
    document.documentElement.dataset.ready = '1';
    const more = async (cursor) => {
      const page = following ? await api.getTimeline(cursor) : await api.getFeed(api.WHATS_HOT, cursor);
      if (token !== generation) return;
      paintFeed(page.feed, { append: true });
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
  return `<div class="segmented search-sort"><button type="button" data-sort="latest" aria-pressed="${searchSort === 'latest'}">Latest</button><button type="button" data-sort="top" aria-pressed="${searchSort === 'top'}">Top</button></div>`;
}

async function showSearch(query, options = {}) {
  const focus = options.focus !== false;
  const token = ++generation;
  setChrome({ title: 'Search', nav: 'search' });
  const known = Array.isArray(trendCache.list) ? trendCache.list : null;
  const controls = query ? sortHtml() : (known ? exploreTabsHtml(known) : '');
  const placeholder = query
    ? skeletons(4)
    : (known ? (trendBlock(visibleTrends(known)) || emptyHtml('Nothing trending', 'Nothing is happening in this tab right now.')) : skeletons(6));
  $('view').innerHTML = `<form class="search-page" id="search-form"><label class="search"><input id="search-q" value="${escapeHtml(query)}" placeholder="Search Bluesky" autocomplete="off" enterkeyhint="search"></label><a class="text-btn pack-entry" href="#/packs">Starter packs</a><div id="search-controls">${controls}</div></form><div id="search-results">${placeholder}</div>`;
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
    const [postData, actorData, packData] = await Promise.all([
      api.searchPosts(query, null, null, searchSort),
      api.searchActors(query),
      api.searchStarterPacks(query).catch(() => ({ starterPacks: [] })),
    ]);
    if (token !== generation) return;
    const people = (actorData.actors || []).slice(0, 5).map((actor) => actorHtml(actor, { follow: signedIn(), self: myDid() })).join('');
    const packs = (packData.starterPacks || []).slice(0, 4).map((pack) => packHtml(pack)).join('');
    resetPosts();
    const postsHtml = feedHtml((postData.posts || []).map((post) => ({ post })));
    remember();
    const peopleBlock = people ? `<h2 class="section-label">People</h2><div class="people">${people}</div>` : '';
    const packsBlock = packs ? `<h2 class="section-label">Starter packs</h2><div class="packs">${packs}</div>` : '';
    let missed = '';
    if (!people && !packs && !postsHtml) {
      let trends = [];
      try { trends = await loadTrends(); } catch { trends = []; }
      if (token !== generation) return;
      const rows = trendBlock(trends, 8);
      missed = emptyHtml('No results', `Nothing matched "${query}".`) + (rows ? `<h2 class="section-label">What's happening</h2>${rows}` : '');
    }
    $('search-results').innerHTML = `${peopleBlock}${packsBlock}${postsHtml}${missed}`;
    const more = async (cursor) => {
      const page = await api.searchPosts(query, cursor, null, searchSort);
      if (token !== generation) return;
      resetPosts();
      const html = feedHtml((page.posts || []).map((post) => ({ post })));
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
      const uris = [...new Set(notes.map((note) => note.reasonSubject).filter((uri) => uri && !subjects.has(uri)))].slice(0, 25);
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

function deletedPeer(actor) {
  const handle = String(actor?.handle || '').trim().toLowerCase();
  const name = String(actor?.displayName || '').trim().toLowerCase();
  if (handle === 'invalid.handle' || handle === 'handle.invalid' || handle.endsWith('.invalid')) return true;
  if (name === 'account deleted' || name === 'deleted account') return true;
  return false;
}

function paintCallTools(actor) {
  const tools = $('title-tools');
  if (!tools) return;
  if (!actor?.did || deletedPeer(actor)) {
    tools.innerHTML = '';
    delete tools.dataset.peer;
    return;
  }
  tools.dataset.peer = actor.did;
  tools.innerHTML = callToolsHtml(actor.did);
}

function paintCallBanner(messages, peerDid) {
  const offer = incomingCall(messages, myDid(), peerDid);
  const current = $('view')?.querySelector('.call-banner');
  if (!offer || isInCall()) {
    current?.remove();
    return;
  }
  const html = callBannerHtml(offer);
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
        messages.forEach((message) => {
          const escapeId = window.CSS?.escape || ((value) => String(value).replace(/"/g, '\\"'));
          if (!message?.id || list.querySelector(`[data-id="${escapeId(message.id)}"]`)) return;
          list.insertAdjacentHTML('beforeend', messageHtml(message, myDid()));
          added = true;
        });
        if (added && near) list.scrollTop = list.scrollHeight;
        if (added) api.markConvoRead(convoId).then(refreshBadge).catch(() => {});
      }
      paintCallBanner(messages, peerDid);
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
    if (other) $('title').textContent = other.displayName || (other.handle ? `@${other.handle}` : 'Chat');
    paintCallTools(other);
    $('view').innerHTML = `${chatHeaderHtml(other)}<div class="messages">${messages.map((message) => messageHtml(message, myDid())).join('')}</div><form class="reply-bar" id="chat-form"><div class="composer-field chat-field"><pre class="field-highlight" id="chat-highlight" aria-hidden="true"></pre><textarea id="chat-text" rows="1" maxlength="1000" placeholder="Message" autocomplete="off"></textarea></div><button class="primary small" type="submit">Send</button></form>`;
    paintCallBanner(messages, other?.did || '');
    const area = $('chat-text');
    paintFieldHighlight(area, $('chat-highlight'));
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
    if ((data.feed || []).length) paintFeed(data.feed, { append: true });
    else $('view').insertAdjacentHTML('beforeend', emptyHtml('Nothing here', 'There are no posts to show.'));
    const more = async (cursor) => {
      const page = await api.getFeed(uri, cursor);
      if (token !== generation) return;
      paintFeed(page.feed, { append: true });
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
    $('view').innerHTML = profileHtml(profile) + pinHtml + blank;
    $('profile-action').innerHTML = action;
    remember();
    document.documentElement.dataset.ready = '1';
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
    const replies = (thread.replies || []).map((node) => (node.post ? postHtml(node) : '<div class="missing">Reply unavailable</div>')).join('');
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

function showSettings() {
  generation += 1;
  const token = generation;
  setChrome({ title: 'Settings', nav: 'settings', back: true });
  const theme = document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
  const words = mutedWords();
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
    <h2>Muted words</h2>
    <p class="dim">Posts containing these words are collapsed in your feeds on this browser.</p>
    <form id="mute-form" class="mute-form"><input id="mute-input" placeholder="Add a word" maxlength="40"><button class="primary small" type="submit">Add</button></form>
    <div class="chips">${words.map((word) => `<button type="button" class="chip" data-unmute="${escapeHtml(word)}" aria-label="Remove ${escapeHtml(word)}"><span>${escapeHtml(word)}</span><span class="chip-x" aria-hidden="true">×</span></button>`).join('')}</div>
    <h2>Keyboard</h2>
    <ul class="keys">
      <li><kbd>n</kbd> New post</li><li><kbd>j</kbd> <kbd>k</kbd> Next and previous post</li>
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
  $('view').innerHTML = `<section class="settings"><h2>Coming soon</h2><p class="dim">This is where the LibreSky helper will open. Nothing you type here is sent to a model yet.</p></section>`;
}

function showCalls() {
  generation += 1;
  setChrome({ title: 'Calls', nav: 'messages', back: true });
  const ready = canCall();
  const title = ready ? 'Voice and video' : 'Coming soon';
  const body = ready
    ? 'A voice or video call connects two LibreSky windows. Chat messages carry the call setup, so open this conversation in LibreSky on both sides and press Voice or Video.'
    : 'This page is not a secure context, or this browser has no WebRTC, so a call cannot start here. Open LibreSky over https, or on http://127.0.0.1. Two LibreSky windows still set the call up through chat messages when the browser allows it.';
  $('view').innerHTML = `<section class="settings"><h2>${title}</h2><p class="dim">${escapeHtml(body)}</p></section>`;
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
  dialog._files = [];
  dialog._card = null;
  dialog._gif = null;
  dialog._dismissedUrl = '';
  closePicker();
  $('compose-previews').innerHTML = '';
  const linkBox = $('compose-link');
  if (linkBox) {
    linkBox.hidden = true;
    linkBox.innerHTML = '';
  }
  updateCount();
  scheduleLinkPreview();
  if (!dialog.open) dialog.showModal();
  area.focus();
}

let linkEpoch = 0;
let linkTimer = 0;

function updateCount() {
  const area = $('compose-text');
  const value = area?.value || '';
  const left = 300 - graphemeLength(value);
  $('compose-count').textContent = String(left);
  $('compose-count').classList.toggle('over', left < 0);
  const files = $('compose')._files || [];
  const card = $('compose')._card;
  const gif = $('compose')._gif;
  $('compose-send').disabled = left < 0 || (left === 300 && !files.length && !card && !gif);
  paintFieldHighlight(area, $('compose-highlight'));
  scheduleSuggest(area);
}

function paintFieldHighlight(area, pre) {
  if (!area || !pre) return;
  pre.innerHTML = `${richText(area.value || '', null, { links: false, breaks: false })}\n`;
  pre.scrollTop = area.scrollTop;
}

function hideSuggest() {
  const box = $('suggest');
  if (!box) return;
  box.innerHTML = '';
  suggestArea = null;
  if (typeof box.hidePopover === 'function' && box.matches(':popover-open')) {
    try { box.hidePopover(); } catch { /* already closed */ }
  }
  box.hidden = true;
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
  if (typeof box.showPopover !== 'function') {
    const host = area.closest('dialog') || document.body;
    if (box.parentElement !== host) host.append(box);
  }
  box.hidden = false;
  if (typeof box.showPopover === 'function') {
    try {
      if (!box.matches(':popover-open')) box.showPopover();
    } catch { /* the list stays in the page */ }
  }
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

async function refreshSuggest(area) {
  if (!area?.isConnected) return hideSuggest();
  const token = caretToken(area.value, area.selectionStart);
  if (!token || token.query.length < 1) return hideSuggest();
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
    const box = $('suggest');
    if (!box || !rows.length) return hideSuggest();
    box.innerHTML = rows.join('');
    suggestArea = area;
    showSuggest(box, area);
  } catch {
    if (seq === suggestSeq) hideSuggest();
  }
}

function suggestRow(index, insert, body) {
  return `<button type="button" class="suggest-row${index === 0 ? ' on' : ''}" data-insert="${escapeHtml(insert)}">${body}</button>`;
}

function applySuggest(insert) {
  const area = suggestArea;
  if (!area) return;
  const token = caretToken(area.value, area.selectionStart);
  if (!token) return hideSuggest();
  const next = `${area.value.slice(0, token.start)}${insert} ${area.value.slice(area.selectionStart)}`;
  area.value = next;
  const caret = token.start + insert.length + 1;
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
  if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
    event.preventDefault();
    event.stopPropagation();
    const next = event.key === 'ArrowDown' ? Math.min(items.length - 1, current + 1) : Math.max(0, current - 1);
    items.forEach((button, index) => button.classList.toggle('on', index === (next < 0 ? 0 : next)));
    return true;
  }
  if (event.key === 'Enter' || event.key === 'Tab') {
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
  if (dialog._gif) return;
  const url = firstUrl($('compose-text').value);
  if (!url || dialog.dataset.quote || dialog._dismissedUrl === url) {
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

async function thumbFile(imageUrl) {
  const load = async (target) => {
    const res = await fetch(target);
    if (!res.ok) return null;
    const blob = await res.blob();
    if (!blob.size || blob.size > 8000000) return null;
    const type = blob.type && blob.type.startsWith('image/') ? blob.type : 'image/jpeg';
    const file = new File([blob], 'thumb', { type });
    if ((type === 'image/jpeg' || type === 'image/png') && file.size < 1000000) return file;
    return compress(file);
  };
  try {
    const direct = await load(imageUrl);
    if (direct) return direct;
  } catch {
    /* try the card proxy, which allows the browser to read the image */
  }
  if (String(imageUrl).startsWith('https://cardyb.bsky.app/')) return null;
  try {
    return await load(`https://cardyb.bsky.app/v1/image?url=${encodeURIComponent(imageUrl)}`);
  } catch {
    return null;
  }
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
  if (graphemeLength(text) > 300) return;
  if (gif && files.length) {
    toast('Remove the images or the GIF before posting.');
    return;
  }
  if (gif && dialog.dataset.quote) {
    toast('Remove the quote to attach a GIF.');
    return;
  }
  $('compose-send').disabled = true;
  $('compose-send').textContent = 'Posting…';
  try {
    const images = [];
    for (const item of files) {
      images.push({ alt: item.alt, blob: await api.uploadBlob(item.file) });
    }
    let reply = null;
    if (dialog.dataset.reply) {
      const raw = JSON.parse(dialog.dataset.reply);
      reply = { root: raw.root, parent: { uri: raw.uri, cid: raw.cid } };
    }
    let quote = dialog.dataset.quote ? JSON.parse(dialog.dataset.quote) : null;
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
    } else if (url && dialog._dismissedUrl !== url && !quote) {
      if (!card || card.sourceUrl !== url) {
        try { card = await api.inspectLink(url); } catch { card = null; }
      }
      if (card?.kind === 'quote' && card.post?.uri) {
        quote = { uri: card.post.uri, cid: card.post.cid };
        text = dropUrl(text, card.sourceUrl || url);
      } else if (card?.kind === 'external' && !images.length) {
        let thumb = null;
        if (card.image) {
          const file = await thumbFile(card.image);
          if (file) thumb = await api.uploadBlob(file);
        }
        link = api.externalEmbed({ ...card, url: card.url || url, thumb });
      }
    }
    if (!text && !images.length && !quote && !link) return;
    const created = await api.createPost({ text, images, reply, quote, link });
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

function openMoreMenu(anchor) {
  openMenu(anchor, [
    { id: 'go-lists', label: 'Lists' },
    { id: 'go-feeds', label: 'Feeds' },
    { id: 'go-bookmarks', label: 'Bookmarks' },
    { id: 'go-settings', label: 'Settings' },
    { id: 'go-about', label: 'About' },
    { id: 'go-privacy', label: 'Privacy' },
    { id: 'go-terms', label: 'Terms' },
    { id: 'go-ai', label: 'AI' },
  ]);
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

const EMOJI = {
  Smileys: ['😀', '😁', '😂', '🤣', '😊', '😍', '😘', '😎', '🤔', '😅', '😢', '😭', '😡', '😴', '🤗', '😇'],
  Gestures: ['👍', '👎', '👏', '🙏', '💪', '👋', '🤝', '👀', '🤷', '✌️', '🤞', '🔥'],
  Hearts: ['❤️', '💙', '💚', '💛', '💜', '🖤', '🤍', '💖', '💯', '✨', '🌟', '🎉'],
  Nature: ['🌞', '🌙', '⭐', '🌈', '🌸', '🍀', '🐶', '🐱', '🦋', '🌊'],
  Food: ['☕', '🍕', '🍔', '🍣', '🍰', '🍓', '🍩', '🥑'],
  Activities: ['⚽', '🏀', '🎮', '🎵', '📚', '✈️', '🎬', '🏆'],
};

function recentEmoji() {
  try {
    const list = JSON.parse(localStorage.getItem('libresky.emoji') || '[]');
    return Array.isArray(list) ? list.filter((item) => typeof item === 'string').slice(0, 16) : [];
  } catch {
    return [];
  }
}

function rememberEmoji(char) {
  const next = [char, ...recentEmoji().filter((item) => item !== char)].slice(0, 16);
  localStorage.setItem('libresky.emoji', JSON.stringify(next));
}

function closePicker() {
  pickerMode = '';
  const box = $('compose-picker');
  if (!box) return;
  box.hidden = true;
  box.innerHTML = '';
}

function openEmojiPicker() {
  pickerMode = 'emoji';
  const box = $('compose-picker');
  if (!box) return;
  const groups = [];
  const recent = recentEmoji();
  if (recent.length) groups.push(['Recent', recent]);
  Object.entries(EMOJI).forEach(([name, list]) => groups.push([name, list]));
  box.hidden = false;
  box.innerHTML = `<div class="picker">${groups.map(([name, list]) => `<p class="picker-label">${escapeHtml(name)}</p><div class="emoji-grid">${list.map((char) => `<button type="button" data-emoji="${escapeHtml(char)}" aria-label="${escapeHtml(char)}">${char}</button>`).join('')}</div>`).join('')}</div>`;
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
  area.focus();
  openEmojiPicker();
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

function chooseGif(gif) {
  const dialog = $('compose');
  if (!dialog || !gif?.url) return;
  if ((dialog._files || []).length) {
    toast('Remove the images to attach a GIF.');
    return;
  }
  if (dialog.dataset.quote) {
    toast('Remove the quote to attach a GIF.');
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
  box.style.height = `${Math.min(full, 160)}px`;
  box.style.overflowY = full > 160 ? 'auto' : 'hidden';
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

async function followAllBack(button) {
  if (!signedIn()) return requireSignIn();
  if (!window.confirm('Follow everyone who follows you and you do not follow back? This stops after 80 accounts. Run it again to continue.')) return;
  if (button) {
    button.disabled = true;
    button.textContent = 'Following…';
  }
  let followed = 0;
  let cursor;
  let capped = false;
  let limited = false;
  try {
    for (let page = 0; page < 30 && followed < 80 && !limited; page += 1) {
      const data = await api.getFollowers(myDid(), cursor);
      const due = [];
      (data.followers || []).forEach((actor) => {
        if (followed + due.length >= 80) return;
        if (!actor?.did || actor.did === myDid()) return;
        if (actor.viewer?.following || actor.viewer?.blocking || actor.viewer?.blockedBy) return;
        due.push(actor.did);
      });
      for (let i = 0; i < due.length; i += 4) {
        const slice = due.slice(i, i + 4);
        const results = await Promise.all(slice.map(async (did) => {
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
      if (followed >= 80 && data.cursor) capped = true;
      if (!data.cursor || capped) break;
      cursor = data.cursor;
    }
    const tail = capped ? ' Run it again to continue.' : (limited ? ' Bluesky asked for a pause. Run it again in a little while.' : '');
    toast(followed ? `Followed ${followed} ${followed === 1 ? 'person' : 'people'} back.${tail}` : 'You already follow them back.');
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
  if (act === 'emoji' || act === 'gif') {
    event.preventDefault();
    if (pickerMode === act) closePicker();
    else if (act === 'emoji') openEmojiPicker();
    else openGifPicker();
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
    const peer = $('view')?.querySelector('.chat-head')?.dataset.peer;
    acceptCall({
      convoId: parseHash()[1],
      peerDid: peer,
      rkey: button?.dataset.rkey,
      media: button?.dataset.media || 'audio',
    }).catch((error) => toast(error.message));
    return true;
  }
  if (act === 'call-decline') {
    event.preventDefault();
    declineCall(parseHash()[1], button?.dataset.rkey).finally(() => $('view')?.querySelector('.call-banner')?.remove());
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

async function onClick(event) {
  const act = event.target.closest('[data-act]')?.dataset.act;
  if (act && await handleChromeAct(act, event)) return;
  if (event.target.closest('[data-act="image"], .shot, .action, .more, .follow, .card, .facet')) {
    /* buttons handle themselves below */
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
  if (!act && event.target.closest('a, button, .quote, .card, .shot, .video')) return;
  if (event.target.closest('.post-main') && !event.target.closest('a, button')) {
    const link = found.article.querySelector('.time');
    if (link) location.hash = link.getAttribute('href');
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
  if (id === 'go-bookmarks') return void (location.hash = '#/bookmarks');
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
      button.dataset.following = '';
      button.classList.remove('on');
      button.textContent = 'Follow';
    } else {
      button.dataset.following = (await api.follow(did)).uri;
      button.classList.add('on');
      button.textContent = 'Following';
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
      const dialog = document.querySelector('dialog[open]');
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
  document.body.addEventListener('click', onClick);
  $('menu').addEventListener('click', onMenu);
  document.addEventListener('click', (event) => {
    if (!event.target.closest('#menu, [data-act="more"], [data-act="nav-more"], [data-act="repost"], #account-btn, #more-btn')) closeMenu();
    if (!event.target.closest('#suggest, #compose-text, #chat-text')) hideSuggest();
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
  $('suggest')?.addEventListener('mousedown', (event) => {
    const button = event.target.closest('[data-insert]');
    if (!button) return;
    event.preventDefault();
    applySuggest(button.dataset.insert || '');
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
    if (box && !box.hidden && suggestArea === area) showSuggest(box, area);
  });
  $('compose').addEventListener('close', () => {
    hideSuggest();
    closePicker();
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
      if (!text || !id) return;
      input.disabled = true;
      api.sendMessage(id, text).then((sent) => {
        input.value = '';
        paintFieldHighlight(input, $('chat-highlight'));
        fitChatInput(input);
        const message = sent?.sent || sent?.message || { text, sender: { did: myDid() } };
        if (!message.sender) message.sender = { did: myDid() };
        if (!message.text) message.text = text;
        const list = $('view').querySelector('.messages');
        list?.insertAdjacentHTML('beforeend', messageHtml(message, myDid()));
        if (list) list.scrollTop = list.scrollHeight;
        api.markConvoRead(id).then(refreshBadge).catch(() => {});
      }).catch((error) => toast(error.message)).finally(() => { input.disabled = false; input.focus(); });
    }
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
      setMutedWords(list);
      showSettings();
    }
    if (event.target.id === 'app-pass-form') {
      event.preventDefault();
      submitAppPassword();
    }
  });
  $('view').addEventListener('keyup', (event) => {
    if (event.target.id === 'chat-text') scheduleSuggest(event.target);
  });
  $('view').addEventListener('click', (event) => {
    if (event.target.id === 'chat-text') scheduleSuggest(event.target);
  });
  $('view').addEventListener('keydown', (event) => {
    if (event.target.id !== 'chat-text') return;
    if (onSuggestKey(event)) return;
    if (event.key !== 'Enter' || event.shiftKey || event.isComposing || event.keyCode === 229) return;
    if (matchMedia('(pointer: coarse)').matches) return;
    event.preventDefault();
    if (!event.target.disabled) event.target.form?.requestSubmit();
  });
  $('view').addEventListener('input', (event) => {
    if (event.target.id !== 'chat-text') return;
    fitChatInput(event.target);
    paintFieldHighlight(event.target, $('chat-highlight'));
    scheduleSuggest(event.target);
  });
  $('view').addEventListener('scroll', (event) => {
    if (event.target.id !== 'chat-text') return;
    paintFieldHighlight(event.target, $('chat-highlight'));
    const box = $('suggest');
    if (box && !box.hidden && suggestArea === event.target) showSuggest(box, event.target);
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
    const word = event.target.dataset?.unmute;
    if (word) {
      setMutedWords(mutedWords().filter((item) => item !== word));
      showSettings();
    }
    const sort = event.target.dataset?.sort;
    if (sort === 'latest' || sort === 'top') {
      searchSort = sort;
      showSearch($('search-q')?.value.trim() || parseHash()[1] || '', { focus: false });
    }
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
    if (target?.id === 'suggest' || target?.id === 'chat-text' || target?.id === 'compose-text') return;
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
  else {
    closeGate();
    route();
  }
  document.getElementById('boot-error')?.remove();
  setInterval(() => { if (document.visibilityState === 'visible') refreshBadge(); }, 45000);
}

boot().catch((error) => {
  clearBoot();
  const view = $('view');
  if (view) view.innerHTML = emptyHtml('LibreSky could not start', error.message || String(error));
});
