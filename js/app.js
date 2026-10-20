import * as api from './api.js';
import {
  actorHtml,
  convoHtml,
  drainPosts,
  emptyHtml,
  feedHtml,
  messageHtml,
  notificationHtml,
  postHtml,
  profileHtml,
  resetPosts,
  skeletons,
  threadList,
} from './render.js';
import {
  currentDid,
  getOauth,
  getPassword,
  lastHandle,
  loadDraft,
  loadPassword,
  mutedWords,
  saveDraft,
  setLastHandle,
  setMutedWords,
  setOauth,
  setPassword,
  signedIn,
} from './session.js';
import { escapeHtml, firstUrl, graphemeLength, parseHash, profileHash } from './util.js';

const posts = new Map();
const me = { profile: null };
let client = null;
let oauthReady = null;
let generation = 0;
let pager = null;
let selected = -1;
let searchSort = 'latest';
let reportTarget = null;

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

function setChrome({ title, back = false, tabs = [], nav = '' }) {
  $('title').textContent = title;
  $('back').hidden = !back;
  const bar = $('tabs');
  if (!tabs.length) {
    bar.hidden = true;
    bar.innerHTML = '';
  } else {
    bar.hidden = false;
    bar.innerHTML = tabs.map((tab) => `<a href="${escapeHtml(tab.href)}" aria-selected="${tab.on ? 'true' : 'false'}">${escapeHtml(tab.label)}</a>`).join('');
  }
  document.querySelectorAll('[data-nav]').forEach((link) => {
    link.classList.toggle('active', link.dataset.nav === nav);
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

function paintFeed(items, { append = false } = {}) {
  const prepared = (items || []).map((item) => (muted(item.post || item) ? { ...item, muted: true } : item));
  resetPosts();
  const html = feedHtml(prepared);
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
  refreshBadge();
  loadRail();
}

function paintBadge(id, count) {
  const node = $(id);
  if (!node) return;
  node.hidden = count < 1;
  node.textContent = count > 99 ? '99+' : String(count);
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
    const count = (data.convos || []).reduce((sum, convo) => sum + (convo.unreadCount || 0), 0);
    paintBadge('chat-badge', count);
  } catch {
    paintBadge('chat-badge', 0);
  }
}

async function loadRail() {
  const card = $('rail-card');
  if (!signedIn()) {
    card.innerHTML = `<section class="panel"><h2>LibreSky</h2><p>A Bluesky client. Sign in with your Bluesky account.</p><button type="button" class="primary" data-act="signin">Sign in</button></section>`;
    return;
  }
  try {
    const data = await api.getSuggestions();
    const people = data.actors || [];
    card.innerHTML = people.length
      ? `<section class="panel"><h2>Suggested follows</h2>${people.map((actor) => actorHtml(actor, { follow: true, self: myDid() })).join('')}</section>`
      : '';
  } catch {
    card.innerHTML = '';
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

async function showSearch(query) {
  const token = ++generation;
  setChrome({ title: 'Search', nav: 'search' });
  const sort = `<div class="segmented search-sort"><button type="button" data-sort="latest" aria-pressed="${searchSort === 'latest'}">Latest</button><button type="button" data-sort="top" aria-pressed="${searchSort === 'top'}">Top</button></div>`;
  $('view').innerHTML = `<form class="search-page" id="search-form"><label class="search"><input id="search-q" value="${escapeHtml(query)}" placeholder="Search Bluesky" autocomplete="off"></label>${sort}</form><div id="search-results">${query ? skeletons(4) : emptyHtml('Search Bluesky', 'Find posts and people.')}</div>`;
  $('search-q')?.focus();
  if (!query) return;
  try {
    const [postData, actorData] = await Promise.all([
      api.searchPosts(query, null, null, searchSort),
      api.searchActors(query),
    ]);
    if (token !== generation) return;
    const people = (actorData.actors || []).slice(0, 5).map((actor) => actorHtml(actor, { follow: signedIn(), self: myDid() })).join('');
    resetPosts();
    $('search-results').innerHTML = `${people ? `<div class="people">${people}</div>` : ''}${feedHtml((postData.posts || []).map((post) => ({ post }))) || emptyHtml('No posts', 'Nothing matched that search.')}`;
    remember();
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
    const uris = [...new Set((data.notifications || []).map((note) => note.reasonSubject).filter(Boolean))].slice(0, 25);
    let subjects = new Map();
    if (uris.length) {
      try {
        const fetched = await api.getPosts(uris);
        subjects = new Map((fetched.posts || []).map((post) => [post.uri, post]));
      } catch { /* snippets are optional */ }
    }
    $('view').innerHTML = (data.notifications || []).map((note) => notificationHtml(note, subjects.get(note.reasonSubject))).join('')
      || emptyHtml('No notifications', 'You are all caught up.');
    api.updateSeen().then(refreshBadge).catch(() => {});
  } catch (error) {
    if (!cancelled(token, error)) $('view').innerHTML = emptyHtml('Could not load notifications', error.message);
  }
}

async function showMessages(convoId) {
  const token = ++generation;
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
      const rows = (data.convos || []).map((convo) => convoHtml(convo, myDid())).join('');
      $('view').innerHTML = `<div class="toolbar"><button type="button" class="primary small" data-act="new-chat">New message</button></div>${rows || emptyHtml('No messages', 'Start a chat with someone you follow.')}`;
      return;
    }
    const data = await api.getConvo(convoId);
    if (token !== generation) return;
    const messages = (data.messages || []).slice().reverse();
    $('view').innerHTML = `<div class="messages">${messages.map((message) => messageHtml(message, myDid())).join('')}</div><form class="reply-bar" id="chat-form"><input id="chat-text" maxlength="1000" placeholder="Message" autocomplete="off"><button class="primary small" type="submit">Send</button></form>`;
    $('chat-text')?.focus();
    const scroller = $('view').querySelector('.messages');
    if (scroller) scroller.scrollTop = scroller.scrollHeight;
  } catch (error) {
    if (!cancelled(token, error)) {
      $('view').innerHTML = emptyHtml('Messages are unavailable', error.message || 'This sign-in does not include chat access.');
    }
  }
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
    const items = (data.bookmarks || []).map((mark) => ({ post: mark.subject || mark.item || mark.post })).filter((item) => item.post?.uri);
    paintFeed(items);
    document.documentElement.dataset.ready = '1';
  } catch (error) {
    if (!cancelled(token, error)) $('view').innerHTML = emptyHtml('Could not load bookmarks', error.message);
  }
}

async function showFeeds() {
  const token = ++generation;
  setChrome({ title: 'Feeds', nav: 'feeds' });
  const hot = `<a class="person" href="#/discover"><span class="avatar" data-initial="D"></span><span><strong>Discover</strong><span class="handle">What's Hot</span></span></a>`;
  if (!signedIn()) {
    $('view').innerHTML = hot + emptyHtml('Your feeds', 'Sign in to see the feeds you pinned on Bluesky.');
    return;
  }
  showSkeletons();
  try {
    const prefs = await api.getPreferences();
    if (token !== generation) return;
    const saved = (prefs.preferences || []).find((pref) => pref.$type?.includes('savedFeedsPref'));
    const items = (saved?.items || saved?.pinned || []).filter((item) => (item.type || item) && (item.value || item).startsWith?.('at://') || item.value);
    const uris = (saved?.items || []).filter((item) => item.type === 'feed' && item.value).map((item) => item.value);
    let views = [];
    if (uris.length) {
      const gens = await api.getFeedGenerators(uris);
      views = gens.feeds || [];
    }
    const rows = views.map((feed) => `<a class="person" href="#/feed/${encodeURIComponent(feed.uri)}">${feed.avatar ? `<span class="avatar"><img src="${escapeHtml(feed.avatar)}" alt=""></span>` : '<span class="avatar" data-initial="F"></span>'}<span><strong>${escapeHtml(feed.displayName || 'Feed')}</strong><span class="handle">${escapeHtml(feed.description || '')}</span></span></a>`).join('');
    $('view').innerHTML = hot + rows;
    if (!rows) $('view').insertAdjacentHTML('beforeend', emptyHtml('No pinned feeds', 'Pin feeds in Bluesky and they show up here.'));
  } catch (error) {
    if (!cancelled(token, error)) $('view').innerHTML = hot + emptyHtml('Could not load feeds', error.message);
  }
}

async function showCustomFeed(uri) {
  const token = ++generation;
  setChrome({ title: 'Feed', nav: 'feeds', back: true });
  showSkeletons();
  try {
    const [info, data] = await Promise.all([
      api.getFeedGenerator(uri).catch(() => null),
      api.getFeed(uri),
    ]);
    if (token !== generation) return;
    if (info?.view?.displayName) $('title').textContent = info.view.displayName;
    paintFeed(data.feed);
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
    const rows = (data.lists || []).map((list) => `<a class="person" href="#/list/${encodeURIComponent(list.uri)}"><span class="avatar" data-initial="${escapeHtml((list.name || 'L').charAt(0))}"></span><span><strong>${escapeHtml(list.name)}</strong><span class="handle">${escapeHtml(list.description || list.purpose || '')}</span></span></a>`).join('');
    $('view').innerHTML = rows || emptyHtml('No lists', 'Lists you create on Bluesky show up here.');
  } catch (error) {
    if (!cancelled(token, error)) $('view').innerHTML = emptyHtml('Could not load lists', error.message);
  }
}

async function showList(uri) {
  const token = ++generation;
  setChrome({ title: 'List', nav: 'lists', back: true });
  showSkeletons();
  try {
    const data = await api.getListFeed(uri);
    if (token !== generation) return;
    paintFeed(data.feed);
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
    const pin = profile.pinnedPost?.uri ? profile.pinnedPost : profile.pinnedPost?.post;
    const pinHtml = current === 'posts' && pin?.uri && pin?.author
      ? `<p class="pinned-label">Pinned</p>${postHtml({ post: pin })}`
      : '';
    $('view').innerHTML = profileHtml(profile) + pinHtml + (feedHtml(feed.feed) || emptyHtml('No posts', 'Nothing in this tab yet.'));
    $('profile-action').innerHTML = action;
    remember();
    document.documentElement.dataset.ready = '1';
  } catch (error) {
    if (!cancelled(token, error)) $('view').innerHTML = emptyHtml('Profile unavailable', error.message);
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
  return `<span class="profile-actions">${follow}${block}${report}</span>`;
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

function showSettings() {
  generation += 1;
  setChrome({ title: 'Settings', nav: 'settings', back: true });
  const theme = document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
  const words = mutedWords();
  $('view').innerHTML = `<section class="settings">
    <h2>Appearance</h2>
    <div class="segmented">
      <button type="button" data-theme-set="light" aria-pressed="${theme === 'light'}">Light</button>
      <button type="button" data-theme-set="dark" aria-pressed="${theme === 'dark'}">Dark</button>
    </div>
    <h2>Muted words</h2>
    <p class="dim">Posts containing these words are collapsed in your feeds on this browser.</p>
    <form id="mute-form" class="mute-form"><input id="mute-input" placeholder="Add a word" maxlength="40"><button class="primary small" type="submit">Add</button></form>
    <div class="chips">${words.map((word) => `<button type="button" class="chip" data-unmute="${escapeHtml(word)}">${escapeHtml(word)} ×</button>`).join('')}</div>
    <h2>Keyboard</h2>
    <ul class="keys">
      <li><kbd>n</kbd> New post</li><li><kbd>j</kbd> <kbd>k</kbd> Next and previous post</li>
      <li><kbd>l</kbd> Like</li><li><kbd>r</kbd> Reply</li><li><kbd>t</kbd> Repost</li>
      <li><kbd>b</kbd> Bookmark</li><li><kbd>s</kbd> Share</li><li><kbd>Enter</kbd> Open post</li><li><kbd>/</kbd> Search</li>
    </ul>
    <h2>Account</h2>
    <p class="dim">You stay signed in on this browser until you sign out. Sign in with Bluesky happens on Bluesky’s own page. LibreSky cannot read the session stored in the Bluesky app.</p>
    ${signedIn() ? '<button type="button" class="danger" data-act="signout">Sign out</button>' : '<button type="button" class="primary" data-act="signin">Sign in</button>'}
  </section>`;
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
  pager?.disconnect();
  selected = -1;
  const [a, b, c, d] = parseHash();
  if (!a) return showHome('following');
  if (a === 'discover') return showHome('discover');
  if (a === 'search') return showSearch(b || '');
  if (a === 'notifications') return showNotifications(b || '');
  if ((a === 'likes' || a === 'reposts') && b) return showEngagement(a, b);
  if (a === 'messages') return showMessages(b || '');
  if (a === 'bookmarks') return showBookmarks();
  if (a === 'feeds') return showFeeds();
  if (a === 'feed' && b) return showCustomFeed(b);
  if (a === 'lists') return showLists();
  if (a === 'list' && b) return showList(b);
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
  $('compose-previews').innerHTML = '';
  updateCount();
  if (!dialog.open) dialog.showModal();
  area.focus();
}

function updateCount() {
  const left = 300 - graphemeLength($('compose-text').value);
  $('compose-count').textContent = String(left);
  $('compose-count').classList.toggle('over', left < 0);
  const files = $('compose')._files || [];
  $('compose-send').disabled = left < 0 || (left === 300 && !files.length);
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
}

async function publish(event) {
  event.preventDefault();
  const dialog = $('compose');
  const text = $('compose-text').value.trim();
  const files = dialog._files || [];
  if (!text && !files.length) return;
  if (graphemeLength(text) > 300) return;
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
    const quote = dialog.dataset.quote ? JSON.parse(dialog.dataset.quote) : null;
    let link = null;
    if (!images.length && !quote) {
      const url = firstUrl(text);
      if (url) link = await api.linkCard(url);
    }
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
  menu._post = null;
  menu.innerHTML = items.map((item) => `<button type="button" data-menu="${escapeHtml(item.id)}">${escapeHtml(item.label)}</button>`).join('');
  menu.hidden = false;
  const rect = anchor.getBoundingClientRect();
  const width = 250;
  menu.style.top = `${rect.bottom + 6}px`;
  menu.style.left = `${Math.max(8, Math.min(rect.right - width, window.innerWidth - width - 8))}px`;
}

async function onClick(event) {
  const act = event.target.closest('[data-act]')?.dataset.act;
  if (event.target.closest('[data-act="image"], .shot, .action, .more, .follow, .card, .facet')) {
    /* buttons handle themselves below */
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
  if (own) {
    items.push({ id: pinnedUri === found.post.uri ? 'unpin' : 'pin', label: pinnedUri === found.post.uri ? 'Unpin from profile' : 'Pin to profile' });
    items.push({ id: 'delete', label: 'Delete' });
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
    await api.updateProfile({
      displayName: $('profile-name').value.trim(),
      description: $('profile-bio').value.trim(),
      avatar,
    });
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
  if (!id || !found) return;
  if (!['copy', 'copy-text', 'share', 'quote'].includes(id) && !signedIn()) return requireSignIn();
  if (id === 'quote') return openComposer({ quote: found.post });
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
      if (me.profile) me.profile.pinnedPost = ref;
      toast(id === 'pin' ? 'Pinned to your profile' : 'Unpinned');
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
    article.dataset.bookmarked = on ? '0' : '1';
    button.classList.toggle('on', !on);
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
  try {
    await api.loginWithPassword(identifier, password);
    $('login-password').value = '';
    closeGate();
    await loadMe();
    if (!location.hash || location.hash === '#' || location.hash === '#/') location.hash = '#/';
    route();
    toast(`Signed in as @${getPassword().handle}`);
  } catch (err) {
    error.hidden = false;
    error.textContent = err.message;
  } finally {
    button.disabled = false;
  }
}

async function signOut() {
  const sub = getOauth()?.sub;
  try { await api.logoutPassword(); } catch { setPassword(null); }
  setOauth(null);
  me.profile = null;
  if (sub && client) await client.revoke(sub).catch(() => {});
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
    if (!event.target.closest('#menu, [data-act="more"], [data-act="repost"], #account-btn')) closeMenu();
  });
  document.addEventListener('keydown', onKey);
  $('back').addEventListener('click', () => {
    if (history.length > 1) history.back();
    else location.hash = '#/';
  });
  $('account-btn').addEventListener('click', () => {
    if (!signedIn()) requireSignIn();
    else openMenu($('account-btn'), [{ id: 'settings-go', label: 'Settings' }, { id: 'signout-go', label: 'Sign out' }]);
  });
  $('menu').addEventListener('click', (event) => {
    if (event.target.dataset.menu === 'settings-go') location.hash = '#/settings';
    if (event.target.dataset.menu === 'signout-go') signOut();
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
  $('compose-form').addEventListener('submit', publish);
  $('compose-cancel').addEventListener('click', () => $('compose').close());
  $('compose-text').addEventListener('input', () => {
    updateCount();
    const dialog = $('compose');
    if (!dialog.dataset.reply && !dialog.dataset.quote) saveDraft($('compose-text').value);
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
      api.sendMessage(id, text).then(() => {
        input.value = '';
        $('view').querySelector('.messages')?.insertAdjacentHTML('beforeend', messageHtml({ text, sender: { did: myDid() } }, myDid()));
      }).catch((error) => toast(error.message)).finally(() => { input.disabled = false; input.focus(); });
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
  });
  $('view').addEventListener('click', (event) => {
    const theme = event.target.dataset?.themeSet;
    if (theme) applyTheme(theme);
    const word = event.target.dataset?.unmute;
    if (word) {
      setMutedWords(mutedWords().filter((item) => item !== word));
      showSettings();
    }
    const sort = event.target.dataset?.sort;
    if (sort === 'latest' || sort === 'top') {
      searchSort = sort;
      showSearch($('search-q')?.value.trim() || parseHash()[1] || '');
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
      dialog.close();
    });
  });
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

async function boot() {
  bind();
  loadPassword();
  try {
    const mod = await import('./vendor/auth.js');
    client = mod.createClient();
    client.addEventListener?.('deleted', () => {
      setOauth(null);
      me.profile = null;
      updateAccount();
      toast('Your Bluesky session ended. Sign in again.');
      openGate();
    });
    const result = await client.init();
    if (result?.session) {
      setOauth(result.session);
      setPassword(null);
    }
  } catch (error) {
    oauthReady = error?.message || 'Sign in with Bluesky needs the published site, or http://127.0.0.1.';
    client = null;
  }
  if (getPassword() && !getOauth()) {
    try {
      const ok = await api.ensurePasswordSession();
      if (!ok) setPassword(null);
    } catch {
      setPassword(null);
    }
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
