// LibreSky Main Application Boot & Controller
import { state, setTheme, toggleBookmark, isBookmarked } from './state.js';
import * as api from './api.js';
import * as ai from './ai.js';
import * as ui from './ui.js';

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

async function initApp() {
  try {
    await applyShell();
    setTheme(state.theme || 'black');
    ui.initLightbox();
    setupNavigation();
    setupGrokPanel();
    setupInlineComposer();
    setupEventListeners();
    setupOfficeMenu();
    handleRoute();
    window.addEventListener('hashchange', handleRoute);
    scanAndConnectAi();
    if (state.session?.accessJwt) checkNotifications();
  } catch (error) {
    const splash = document.getElementById('splash');
    if (splash) {
      splash.hidden = false;
      splash.innerHTML = `<pre class="splash-error">${String(error && error.stack || error)}</pre>`;
    }
    throw error;
  }

  const splash = document.getElementById('splash');
  if (splash) splash.hidden = true;
  if (location.search.includes('smoke=1') && window.office) {
    const started = Date.now();
    while (Date.now() - started < 8000 && document.querySelectorAll('.post-card').length === 0) {
      await new Promise((resolve) => setTimeout(resolve, 200));
    }
    window.office.smokeReady();
  }
}

async function applyShell() {
  if (!window.office) return;
  document.documentElement.dataset.shell = 'office';
  const info = await window.office.getInfo();
  document.title = 'LibreOffice';
  const splashTitle = document.getElementById('splash-title');
  if (splashTitle) splashTitle.innerHTML = 'Libre<span style="color:var(--blue);">Office</span>';
  document.querySelectorAll('.brand-title').forEach((el) => {
    el.innerHTML = 'Libre<span class="accent">Office</span>';
  });
  document.querySelectorAll('.brand-sub').forEach((el) => {
    el.textContent = 'Bluesky Client';
  });
  if (info?.settings?.theme) setTheme(info.settings.theme);
  if (info?.settings?.grokOpen === false) state.grokOpen = false;
  window.office.on('app:requestClose', () => window.office.closeResult(true));
}

function setupOfficeMenu() {
  if (!window.office) return;
  window.office.on('menu:command', (id) => {
    if (id === 'auth.login') ui.openLoginModal();
    else if (id === 'compose.open') ui.openComposerModal();
    else if (id === 'view.timeline') window.location.hash = 'timeline';
    else if (id === 'view.discover') window.location.hash = 'discover';
    else if (id === 'view.search') window.location.hash = 'search';
    else if (id === 'grok.toggle') document.getElementById('grok-sidebar')?.classList.toggle('collapsed');
    else if (id === 'view.theme') setTheme(state.theme === 'light' ? 'black' : 'light');
    else if (id === 'help.local') ui.openSettingsModal();
    else if (id === 'help.about') ui.openAboutModal();
  });
}

// ----------------- Route Handling -----------------

function handleRoute() {
  const hash = window.location.hash.slice(1);
  if (!hash || hash === 'timeline' || hash === 'home') {
    switchView('timeline');
  } else if (hash === 'discover') {
    switchView('discover');
  } else if (hash.startsWith('search')) {
    const query = decodeURIComponent(hash.split('/')[1] || '');
    switchView('search', { query });
  } else if (hash === 'notifications') {
    switchView('notifications');
  } else if (hash === 'chat') {
    switchView('chat');
  } else if (hash === 'bookmarks') {
    switchView('bookmarks');
  } else if (hash.startsWith('profile/')) {
    const actor = hash.replace('profile/', '');
    ui.openProfileView(actor);
  } else if (hash.startsWith('thread/')) {
    const uri = decodeURIComponent(hash.replace('thread/', ''));
    ui.openThreadView(uri);
  } else if (hash === 'settings') {
    ui.openSettingsModal();
  }
}

// ----------------- View Switcher -----------------

export async function switchView(viewName, params = {}) {
  state.view = viewName;
  updateNavActiveState(viewName);

  const container = document.getElementById('feed-container');
  const title = document.getElementById('view-title');
  const tabsBar = document.getElementById('feed-tabs-bar');
  const inlineComposer = document.getElementById('inline-composer');

  // Toggle inline composer visibility
  if (viewName === 'timeline' || viewName === 'discover') {
    inlineComposer.style.display = 'flex';
    tabsBar.style.display = 'flex';
  } else {
    inlineComposer.style.display = 'none';
    tabsBar.style.display = 'none';
  }

  container.innerHTML = '<div style="padding:40px;text-align:center;"><span class="spark pulse"></span><p class="dim" style="margin-top:10px;">Loading posts...</p></div>';

  if (viewName === 'timeline') {
    title.innerHTML = '<span>Home</span>';
    loadTimelinePosts();
  } else if (viewName === 'discover') {
    title.innerHTML = '<span>Discover</span>';
    loadDiscoverPosts();
  } else if (viewName === 'notifications') {
    title.innerHTML = '<span>Notifications</span>';
    loadNotifications();
  } else if (viewName === 'chat') {
    title.innerHTML = '<span>Messages</span>';
    loadChatConvos();
  } else if (viewName === 'bookmarks') {
    title.innerHTML = '<span>Bookmarks</span>';
    loadBookmarks();
  } else if (viewName === 'search') {
    title.innerHTML = '<span>Search</span>';
    loadSearchView(params.query || '');
  }
}

function updateNavActiveState(viewName) {
  document.querySelectorAll('.nav-item').forEach((item) => {
    if (item.dataset.view === viewName) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });
}

// ----------------- Feed Loaders -----------------

async function loadTimelinePosts() {
  const container = document.getElementById('feed-container');
  try {
    const res = await api.getTimeline();
    const feed = res.feed || [];
    renderPostsStream(container, feed, () => loadMoreTimeline(res.cursor));
  } catch (err) {
    container.innerHTML = `<div style="padding:30px;color:var(--red);text-align:center;">Failed to load timeline: ${ui.escapeHtml(err.message)}</div>`;
  }
}

async function loadMoreTimeline(cursor) {
  if (!cursor) return;
  try {
    const res = await api.getTimeline(cursor);
    const stream = document.getElementById('posts-stream');
    (res.feed || []).forEach((item) => stream.appendChild(ui.renderPostCard(item)));
  } catch (e) {
    ui.toast('Failed to load more posts', 'error');
  }
}

async function loadDiscoverPosts() {
  const container = document.getElementById('feed-container');
  try {
    const res = await api.getDiscoverFeed();
    const feed = res.feed || [];
    renderPostsStream(container, feed, () => loadMoreDiscover(res.cursor));
  } catch (err) {
    container.innerHTML = `<div style="padding:30px;color:var(--red);text-align:center;">Failed to load discover: ${ui.escapeHtml(err.message)}</div>`;
  }
}

async function loadMoreDiscover(cursor) {
  if (!cursor) return;
  try {
    const res = await api.getDiscoverFeed(cursor);
    const stream = document.getElementById('posts-stream');
    (res.feed || []).forEach((item) => stream.appendChild(ui.renderPostCard(item)));
  } catch (e) {}
}

function renderPostsStream(container, feed, onLoadMore) {
  container.innerHTML = '';
  if (!feed || feed.length === 0) {
    container.innerHTML = '<p class="dim" style="padding:40px;text-align:center;">No posts available right now.</p>';
    return;
  }
  const stream = document.createElement('div');
  stream.className = 'posts-stream';
  stream.id = 'posts-stream';

  feed.forEach((item) => stream.appendChild(ui.renderPostCard(item)));
  container.appendChild(stream);

  if (onLoadMore) {
    const loadMoreBtn = document.createElement('button');
    loadMoreBtn.className = 'quick-prompt-btn';
    loadMoreBtn.style.cssText = 'margin:20px auto;display:block;padding:10px 24px;font-size:13px;';
    loadMoreBtn.textContent = 'Load More Posts';
    loadMoreBtn.addEventListener('click', onLoadMore);
    container.appendChild(loadMoreBtn);
  }
}

// ----------------- Notifications -----------------

async function loadNotifications() {
  const container = document.getElementById('feed-container');
  if (!state.session) {
    container.innerHTML = '<div style="padding:40px;text-align:center;"><p class="dim">Please sign in to view your notifications.</p></div>';
    return;
  }
  try {
    const res = await api.getNotifications();
    const list = res.notifications || [];
    container.innerHTML = '';
    if (list.length === 0) {
      container.innerHTML = '<p class="dim" style="padding:40px;text-align:center;">No notifications yet.</p>';
      return;
    }
    const stream = document.createElement('div');
    stream.className = 'posts-stream';
    list.forEach((n) => {
      const row = document.createElement('div');
      row.className = 'post-card';
      row.innerHTML = `
        <div style="display:flex;align-items:center;gap:12px;">
          <img src="${n.author?.avatar || ''}" class="account-avatar" style="width:34px;height:34px;">
          <div>
            <strong>${ui.escapeHtml(n.author?.displayName || n.author?.handle)}</strong>
            <span class="dim"> ${n.reason}</span>
            <div style="font-size:12px;color:var(--text-muted);">${ui.formatRelativeTime(n.indexedAt)}</div>
          </div>
        </div>
      `;
      stream.appendChild(row);
    });
    container.appendChild(stream);
  } catch (err) {
    container.innerHTML = `<div style="padding:30px;color:var(--red);text-align:center;">${ui.escapeHtml(err.message)}</div>`;
  }
}

async function checkNotifications() {
  const count = await api.getUnreadNotificationCount();
  const badge = document.getElementById('notif-badge');
  if (badge) {
    if (count > 0) {
      badge.textContent = count > 99 ? '99+' : count;
      badge.removeAttribute('hidden');
    } else {
      badge.setAttribute('hidden', '');
    }
  }
}

// ----------------- Direct Messages / Chat -----------------

async function loadChatConvos() {
  const container = document.getElementById('feed-container');
  if (!state.session) {
    container.innerHTML = '<div style="padding:40px;text-align:center;"><p class="dim">Please sign in to access direct messages.</p></div>';
    return;
  }
  container.innerHTML = '<div style="padding:40px;text-align:center;"><span class="spark pulse"></span><p class="dim" style="margin-top:10px;">Connecting to Bluesky Chat...</p></div>';
  try {
    const res = await api.listConvos();
    const convos = res.convos || [];
    container.innerHTML = '';
    if (convos.length === 0) {
      container.innerHTML = '<p class="dim" style="padding:40px;text-align:center;">No direct messages yet.</p>';
      return;
    }
    const list = document.createElement('div');
    list.className = 'posts-stream';
    convos.forEach((c) => {
      const other = c.members?.find((m) => m.did !== state.session.did) || {};
      const row = document.createElement('div');
      row.className = 'post-card';
      row.innerHTML = `
        <div style="display:flex;align-items:center;gap:12px;">
          <img src="${other.avatar || ''}" class="account-avatar">
          <div style="flex:1;">
            <strong>${ui.escapeHtml(other.displayName || other.handle)}</strong>
            <p class="dim" style="font-size:12px;">${ui.escapeHtml(c.lastMessage?.text || 'No messages yet')}</p>
          </div>
        </div>
      `;
      list.appendChild(row);
    });
    container.appendChild(list);
  } catch (err) {
    container.innerHTML = `<div style="padding:30px;color:var(--red);text-align:center;">${ui.escapeHtml(err.message)}</div>`;
  }
}

// ----------------- Bookmarks -----------------

function loadBookmarks() {
  const container = document.getElementById('feed-container');
  container.innerHTML = '';
  if (state.bookmarks.length === 0) {
    container.innerHTML = '<p class="dim" style="padding:40px;text-align:center;">No saved posts yet. Click the bookmark icon on any post to save it locally.</p>';
    return;
  }
  const stream = document.createElement('div');
  stream.className = 'posts-stream';
  state.bookmarks.forEach((item) => stream.appendChild(ui.renderPostCard(item)));
  container.appendChild(stream);
}

// ----------------- Search -----------------

async function loadSearchView(query) {
  const container = document.getElementById('feed-container');
  container.innerHTML = `
    <div style="padding:14px 16px;border-bottom:1px solid var(--line);display:flex;gap:8px;">
      <input type="text" id="live-search-input" value="${ui.escapeHtml(query)}" placeholder="Search posts or @handles..." style="flex:1;">
      <button type="button" class="submit-post-btn" id="run-search-btn">Search</button>
    </div>
    <div id="search-results-box"></div>
  `;

  const input = container.querySelector('#live-search-input');
  const btn = container.querySelector('#run-search-btn');
  const box = container.querySelector('#search-results-box');

  const execute = async () => {
    const q = input.value.trim();
    if (!q) return;
    window.location.hash = `search/${encodeURIComponent(q)}`;
    box.innerHTML = '<div style="padding:30px;text-align:center;"><span class="spark pulse"></span></div>';
    try {
      const res = await api.searchPosts(q);
      const posts = res.posts || [];
      box.innerHTML = '';
      if (posts.length === 0) {
        box.innerHTML = '<p class="dim" style="padding:30px;text-align:center;">No posts found for this query.</p>';
        return;
      }
      const stream = document.createElement('div');
      stream.className = 'posts-stream';
      posts.forEach((p) => stream.appendChild(ui.renderPostCard(p)));
      box.appendChild(stream);
    } catch (err) {
      box.innerHTML = `<div style="padding:30px;color:var(--red);text-align:center;">${ui.escapeHtml(err.message)}</div>`;
    }
  };

  btn.addEventListener('click', execute);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') execute();
  });

  if (query) {
    execute();
  }
}

// ----------------- Inline Feed Composer -----------------

function setupInlineComposer() {
  const composer = document.getElementById('inline-composer');
  const textarea = document.getElementById('composer-textarea');
  const countEl = document.getElementById('inline-char-count');
  const submitBtn = document.getElementById('inline-submit-btn');
  const fileInput = document.getElementById('inline-img-input');
  const previews = document.getElementById('composer-previews');
  const aiAssistBtn = document.getElementById('inline-ai-assist-btn');

  const attachedImages = [];

  textarea.addEventListener('input', () => {
    const len = textarea.value.length;
    const rem = 300 - len;
    countEl.textContent = rem;
    countEl.className = 'char-count-text' + (rem < 20 ? (rem < 0 ? ' over' : ' warn') : '');
    submitBtn.disabled = len === 0 || rem < 0;
  });

  fileInput.addEventListener('change', (e) => {
    const files = [...e.target.files].slice(0, 4 - attachedImages.length);
    for (const file of files) {
      attachedImages.push({ file, url: URL.createObjectURL(file), blob: null });
    }
    renderInlinePreviews();
  });

  function renderInlinePreviews() {
    previews.innerHTML = '';
    attachedImages.forEach((img, idx) => {
      const chip = document.createElement('div');
      chip.className = 'composer-img-chip';
      chip.innerHTML = `<img src="${img.url}"><span class="remove-chip">&times;</span>`;
      chip.querySelector('.remove-chip').addEventListener('click', () => {
        attachedImages.splice(idx, 1);
        renderInlinePreviews();
      });
      previews.appendChild(chip);
    });
  }

  aiAssistBtn.addEventListener('click', async () => {
    const val = textarea.value.trim();
    if (!val) {
      ui.toast('Type a post draft first');
      return;
    }
    aiAssistBtn.innerHTML = '<span class="spark small pulse"></span>';
    try {
      const polished = await ai.polishComposerText(val, 'punchy');
      textarea.value = polished;
      textarea.dispatchEvent(new Event('input'));
      ui.toast('Polished by local AI!', 'success');
    } catch (err) {
      ui.toast(err.message, 'error');
    } finally {
      aiAssistBtn.innerHTML = '<span class="spark small"></span>';
    }
  });

  submitBtn.addEventListener('click', async () => {
    if (!state.session) {
      ui.openLoginModal();
      return;
    }
    submitBtn.disabled = true;
    submitBtn.textContent = 'Posting...';

    try {
      for (const img of attachedImages) {
        if (!img.blob) {
          const res = await api.uploadBlob(img.file);
          img.blob = res.blob;
        }
      }

      await api.createPost({
        text: textarea.value,
        images: attachedImages,
      });

      textarea.value = '';
      textarea.dispatchEvent(new Event('input'));
      attachedImages.length = 0;
      renderInlinePreviews();
      ui.toast('Post published!', 'success');
      loadTimelinePosts();
    } catch (err) {
      ui.toast(err.message, 'error');
      submitBtn.disabled = false;
      submitBtn.textContent = 'Post';
    }
  });
}

// ----------------- Grok AI Sidebar & Engine -----------------

async function scanAndConnectAi() {
  const dot = document.getElementById('ai-nav-dot');
  const statusTag = document.getElementById('grok-status-tag');
  const modelSelect = document.getElementById('grok-model-select');

  const res = await ai.scanLocalAi();
  if (res.ok) {
    if (dot) dot.classList.add('online');
    if (statusTag) statusTag.textContent = `Local: ${res.activeModel}`;
    if (modelSelect) {
      modelSelect.innerHTML = res.models
        .map((m) => `<option value="${m}" ${m === res.activeModel ? 'selected' : ''}>${m}</option>`)
        .join('');
    }
  } else {
    if (statusTag) statusTag.textContent = 'Offline (click to retry)';
  }
}

function setupGrokPanel() {
  const toggleBtn = document.getElementById('nav-ai-btn');
  const sidebar = document.getElementById('grok-sidebar');
  const closeBtn = document.getElementById('grok-close-btn');
  if (sidebar && !state.grokOpen) sidebar.classList.add('collapsed');
  const modelSelect = document.getElementById('grok-model-select');
  const personaSelect = document.getElementById('grok-persona-select');
  const input = document.getElementById('grok-prompt-input');
  const sendBtn = document.getElementById('grok-send-btn');
  const log = document.getElementById('grok-chat-log');

  toggleBtn.addEventListener('click', () => {
    sidebar.classList.toggle('collapsed');
    state.grokOpen = !sidebar.classList.contains('collapsed');
    if (window.office?.settingsSet) window.office.settingsSet({ grokOpen: state.grokOpen });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      sidebar.classList.add('collapsed');
      state.grokOpen = false;
    });
  }

  modelSelect.addEventListener('change', () => {
    state.ai.activeModel = modelSelect.value;
    document.getElementById('grok-status-tag').textContent = `Local: ${state.ai.activeModel}`;
  });

  personaSelect.addEventListener('change', () => {
    state.ai.persona = personaSelect.value;
  });

  // Quick prompt buttons
  document.querySelectorAll('.quick-prompt-btn[data-prompt]').forEach((btn) => {
    btn.addEventListener('click', () => {
      input.value = btn.dataset.prompt;
      submitGrokPrompt();
    });
  });

  const submitGrokPrompt = async () => {
    const text = input.value.trim();
    if (!text || state.ai.streaming) return;

    // Append User Message
    appendGrokMessage('user', text);
    input.value = '';

    // Append AI Message placeholder
    const aiBubble = appendGrokMessage('ai', '<span class="spark small pulse"></span> Thinking...');
    sendBtn.disabled = true;

    try {
      const messages = state.ai.messages
        .filter((m) => m.role !== 'system')
        .slice(-6);
      messages.push({ role: 'user', content: text });

      let streamTarget = aiBubble.querySelector('.grok-msg-content');

      await ai.streamChat(
        messages,
        (fullText) => {
          streamTarget.innerHTML = ui.escapeHtml(fullText);
          log.scrollTop = log.scrollHeight;
        },
        (finalText) => {
          state.ai.messages.push({ role: 'user', content: text });
          state.ai.messages.push({ role: 'assistant', content: finalText });
          sendBtn.disabled = false;
        }
      );
    } catch (err) {
      aiBubble.querySelector('.grok-msg-content').innerHTML = `
        <span style="color:var(--red);">Error: ${ui.escapeHtml(err.message)}</span><br>
        <span class="dim" style="font-size:11px;">Make sure Ollama is running at 127.0.0.1:11434 with CORS enabled.</span>
      `;
      sendBtn.disabled = false;
    }
  };

  sendBtn.addEventListener('click', submitGrokPrompt);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submitGrokPrompt();
    }
  });
}

function appendGrokMessage(role, text) {
  const log = document.getElementById('grok-chat-log');
  const msg = document.createElement('div');
  msg.className = `grok-msg ${role}`;
  msg.innerHTML = `
    <div class="grok-msg-role">
      ${role === 'ai' ? '<span class="spark small"></span> Grok' : 'You'}
    </div>
    <div class="grok-msg-content">${text}</div>
  `;
  log.appendChild(msg);
  log.scrollTop = log.scrollHeight;
  return msg;
}

// ----------------- Navigation & Event Listeners -----------------

function setupNavigation() {
  document.querySelectorAll('.nav-item').forEach((item) => {
    item.addEventListener('click', () => {
      const v = item.dataset.view;
      if (v) window.location.hash = v;
    });
  });

  document.getElementById('primary-compose-btn')?.addEventListener('click', () => {
    ui.openComposerModal();
  });

  document.getElementById('nav-account-pill')?.addEventListener('click', () => {
    if (state.session) {
      ui.openSettingsModal();
    } else {
      ui.openLoginModal();
    }
  });

  // Feed tabs switcher (Following / Discover)
  document.querySelectorAll('.feed-tab[data-tab]').forEach((tab) => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.feed-tab[data-tab]').forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
      const target = tab.dataset.tab;
      window.location.hash = target;
    });
  });

  // Header refresh button
  document.getElementById('header-refresh-btn')?.addEventListener('click', () => {
    handleRoute();
    ui.toast('Feed refreshed', 'info', 1500);
  });
}

function setupEventListeners() {
  window.addEventListener('feed:refresh', () => handleRoute());
  window.addEventListener('session:change', () => {
    updateAccountPill();
    handleRoute();
  });

  // Keyboard Shortcuts
  window.addEventListener('keydown', (e) => {
    if (e.target.matches('input, textarea')) return;
    if (e.key === 'n' || e.key === 'c') {
      e.preventDefault();
      ui.openComposerModal();
    } else if (e.key === 'g') {
      e.preventDefault();
      document.getElementById('grok-sidebar')?.classList.toggle('collapsed');
    } else if (e.key === 'r') {
      e.preventDefault();
      handleRoute();
    }
  });

  updateAccountPill();
}

function updateAccountPill() {
  const pill = document.getElementById('nav-account-pill');
  if (!pill) return;
  if (state.session) {
    pill.innerHTML = `
      <img src="${state.session.avatar || ''}" class="account-avatar" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' viewBox=\\'0 0 24 24\\' fill=\\'%23555\\'><circle cx=\\'12\\' cy=\\'12\\' r=\\'12\\'/></svg>'">
      <div class="account-info">
        <span class="account-name">${ui.escapeHtml(state.session.displayName || state.session.handle)}</span>
        <span class="account-handle">@${ui.escapeHtml(state.session.handle)}</span>
      </div>
    `;
  } else {
    pill.innerHTML = `
      <div class="account-avatar" style="display:flex;align-items:center;justify-content:center;">${ui.ICONS.user}</div>
      <div class="account-info">
        <span class="account-name">Guest Mode</span>
        <span class="account-handle">Click to sign in</span>
      </div>
    `;
  }
}
