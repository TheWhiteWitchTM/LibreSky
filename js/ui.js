// LibreSky UI Components & Renderers
import { state, toggleBookmark, isBookmarked, setSession, clearSession, setTheme } from './state.js';
import * as api from './api.js';
import * as ai from './ai.js';

// SVG Icons
export const ICONS = {
  home: '<svg viewBox="0 0 24 24"><path d="M12 2.1L1 12h3v9h6v-6h4v6h6v-9h3L12 2.1zm0 2.69L19 11v8h-3v-6H8v6H5v-8l7-6.21z"/></svg>',
  explore: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2"/><path d="M16.24 7.76l-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12z"/></svg>',
  bell: '<svg viewBox="0 0 24 24"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/></svg>',
  chat: '<svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12z"/></svg>',
  bookmark: '<svg viewBox="0 0 24 24"><path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2zm0 15l-5-2.18L7 18V5h10v13z"/></svg>',
  bookmarkFilled: '<svg viewBox="0 0 24 24"><path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z"/></svg>',
  user: '<svg viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>',
  settings: '<svg viewBox="0 0 24 24"><path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/></svg>',
  reply: '<svg viewBox="0 0 24 24"><path d="M1.751 10c0-4.42 3.584-8 8.005-8h4.366c4.49 0 8.129 3.64 8.129 8.13 0 2.96-1.607 5.68-4.196 7.11l-8.054 4.46v-3.69h-.25c-4.421 0-8-3.58-8-8.01zm8.005-6c-3.317 0-6.005 2.69-6.005 6 0 3.32 2.688 6 6.005 6h2.25v2.79l5.09-2.82c1.992-1.1 3.226-3.19 3.226-5.46 0-3.38-2.75-6.13-6.13-6.13h-4.436z"/></svg>',
  repost: '<svg viewBox="0 0 24 24"><path d="M4.5 3.88l4.432 4.14-1.364 1.46L5.5 7.55V16c0 1.1.9 2 2 2H16v2H7.5C5.01 20 3 17.99 3 15.5V7.55L0.932 9.48 0.432 8.02 4.5 3.88zm15 16.24l-4.432-4.14 1.364-1.46 2.068 1.93V8c0-1.1-.9-2-2-2H8V4h8.5C18.99 4 21 6.01 21 8.5v7.95l2.068-1.93 1.364 1.46-4.932 4.14z"/></svg>',
  heart: '<svg viewBox="0 0 24 24"><path d="M16.697 5.5c-1.222-.06-2.679.51-3.89 2.16l-.805 1.09-.806-1.09C9.984 6.01 8.526 5.44 7.304 5.5c-2.415.11-4.3 2.11-4.3 4.6 0 3.99 6.279 8.72 8.197 9.87.5.3 1.1.3 1.6 0 1.918-1.15 8.196-5.88 8.196-9.87 0-2.49-1.884-4.49-4.3-4.6z" fill="none" stroke="currentColor" stroke-width="2"/></svg>',
  heartFilled: '<svg viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>',
  share: '<svg viewBox="0 0 24 24"><path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/></svg>',
  image: '<svg viewBox="0 0 24 24"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>',
  spark: '<svg viewBox="0 0 24 24"><path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z"/></svg>',
  refresh: '<svg viewBox="0 0 24 24"><path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/></svg>',
  back: '<svg viewBox="0 0 24 24"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>',
  close: '<svg viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>',
};

// ----------------- Toast Notifications -----------------

export function toast(message, type = 'info', duration = 3500) {
  const container = document.getElementById('toasts') || createToastContainer();
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.innerHTML = `<span>${escapeHtml(message)}</span>`;
  container.appendChild(el);
  setTimeout(() => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(10px)';
    setTimeout(() => el.remove(), 250);
  }, duration);
}

function createToastContainer() {
  const c = document.createElement('div');
  c.id = 'toasts';
  document.body.appendChild(c);
  return c;
}

// ----------------- Helpers -----------------

export function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function formatCount(n) {
  if (!n) return '0';
  if (n < 1000) return String(n);
  if (n < 1000000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  return (n / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
}

export function formatRelativeTime(iso) {
  if (!iso) return '';
  const now = Date.now();
  const then = new Date(iso).getTime();
  const sec = Math.floor((now - then) / 1000);
  if (sec < 60) return `${Math.max(1, sec)}s`;
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h`;
  const days = Math.floor(hr / 24);
  if (days < 30) return `${days}d`;
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export function renderRichText(text, facets) {
  if (!text) return '';
  let safe = escapeHtml(text);

  // Linkify URLs
  safe = safe.replace(/(https?:\/\/[^\s<]+)/g, (url) => {
    return `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`;
  });

  // Linkify @mentions
  safe = safe.replace(/(^|\s)@([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g, (match, space, handle) => {
    return `${space}<a href="#profile/${handle}" class="mention-pill" data-actor="${handle}">@${handle}</a>`;
  });

  // Linkify #hashtags
  safe = safe.replace(/(^|\s)#([a-zA-Z0-9_]+)/g, (match, space, tag) => {
    return `${space}<a href="#search/${tag}" class="tag-pill" data-tag="${tag}">#${tag}</a>`;
  });

  return safe;
}

// ----------------- Post Card Renderer -----------------

export function renderPostCard(item, options = {}) {
  const post = item.post || item;
  const reason = item.reason;
  const reply = item.reply;
  const author = post.author || {};
  const record = post.record || {};
  const uri = post.uri;
  const cid = post.cid;

  const card = document.createElement('article');
  card.className = 'post-card';
  card.dataset.uri = uri;
  card.dataset.cid = cid;

  // Repost Context Header
  let contextHtml = '';
  if (reason?.$type === 'app.bsky.feed.defs#reasonRepost') {
    const repByName = reason.by?.displayName || reason.by?.handle;
    contextHtml += `
      <div class="post-context-header">
        ${ICONS.repost}
        <span>Reposted by <strong data-actor="${reason.by?.handle}">${escapeHtml(repByName)}</strong></span>
      </div>
    `;
  } else if (reply && reply.parent) {
    const parentHandle = reply.parent.author?.handle;
    if (parentHandle && parentHandle !== author.handle) {
      contextHtml += `
        <div class="post-context-header">
          ${ICONS.reply}
          <span>Replying to <span class="dim">@${escapeHtml(parentHandle)}</span></span>
        </div>
      `;
    }
  }

  // Embeds: Images, External Card, Quoted Post
  let embedHtml = '';
  const embed = post.embed;

  // Images
  const images = embed?.images || embed?.media?.images;
  if (images && images.length > 0) {
    const countClass = `count-${Math.min(images.length, 4)}`;
    embedHtml += `<div class="media-grid ${countClass}">`;
    images.forEach((img, i) => {
      const thumb = img.thumb || img.fullsize;
      const full = img.fullsize || img.thumb;
      const alt = img.alt || '';
      embedHtml += `
        <div class="media-item" data-full="${full}" data-alt="${escapeHtml(alt)}" data-index="${i}">
          <img src="${thumb}" alt="${escapeHtml(alt)}" loading="lazy">
          ${alt ? `<span class="alt-badge">ALT</span>` : ''}
        </div>
      `;
    });
    embedHtml += `</div>`;
  }

  // External link card
  const external = embed?.external;
  if (external) {
    const uri = external.uri || '#';
    let host = '';
    try { host = new URL(uri).hostname; } catch(e) {}
    embedHtml += `
      <a href="${uri}" target="_blank" rel="noopener noreferrer" class="embed-card">
        ${external.thumb ? `<img src="${external.thumb}" alt="Preview" loading="lazy">` : ''}
        <div class="embed-info">
          <span class="embed-host">${escapeHtml(host)}</span>
          <span class="embed-title">${escapeHtml(external.title || uri)}</span>
          ${external.description ? `<span class="embed-desc">${escapeHtml(external.description)}</span>` : ''}
        </div>
      </a>
    `;
  }

  // Quote post
  const quoteRecord = embed?.record?.record || embed?.record;
  if (quoteRecord && quoteRecord.author) {
    const qAuthor = quoteRecord.author;
    const qText = quoteRecord.value?.text || quoteRecord.record?.text || '';
    embedHtml += `
      <div class="quote-card" data-uri="${quoteRecord.uri}">
        <div class="quote-author">
          <img src="${qAuthor.avatar || ''}" class="quote-avatar" onerror="this.style.display='none'">
          <span class="quote-name">${escapeHtml(qAuthor.displayName || qAuthor.handle)}</span>
          <span class="quote-handle">@${escapeHtml(qAuthor.handle)}</span>
        </div>
        <div class="quote-text">${escapeHtml(qText)}</div>
      </div>
    `;
  }

  const isLiked = Boolean(post.viewer?.like);
  const isReposted = Boolean(post.viewer?.repost);
  const isSaved = isBookmarked(uri);

  card.innerHTML = `
    ${contextHtml}
    <div class="post-main-row">
      <img src="${author.avatar || ''}" class="post-author-avatar" alt="${escapeHtml(author.handle)}" data-actor="${author.handle}" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' viewBox=\\'0 0 24 24\\' fill=\\'%23555\\'><circle cx=\\'12\\' cy=\\'12\\' r=\\'12\\'/></svg>'">
      <div class="post-content-wrap">
        <div class="post-header-line">
          <span class="author-name" data-actor="${author.handle}">${escapeHtml(author.displayName || author.handle)}</span>
          <span class="author-handle" data-actor="${author.handle}">@${escapeHtml(author.handle)}</span>
          <span class="post-time">${formatRelativeTime(record.createdAt || post.indexedAt)}</span>
        </div>
        <div class="post-body-text">${renderRichText(record.text, record.facets)}</div>
        ${embedHtml}
        <div class="post-actions-row">
          <button type="button" class="action-btn reply" title="Reply">
            ${ICONS.reply}
            <span>${post.replyCount || ''}</span>
          </button>
          <button type="button" class="action-btn repost ${isReposted ? 'active' : ''}" title="Repost">
            ${ICONS.repost}
            <span>${post.repostCount || ''}</span>
          </button>
          <button type="button" class="action-btn like ${isLiked ? 'active' : ''}" title="Like">
            ${isLiked ? ICONS.heartFilled : ICONS.heart}
            <span>${post.likeCount || ''}</span>
          </button>
          <button type="button" class="action-btn bookmark ${isSaved ? 'active' : ''}" title="Save">
            ${isSaved ? ICONS.bookmarkFilled : ICONS.bookmark}
          </button>
          <button type="button" class="action-btn ai-btn" title="Grok AI Actions">
            <span class="spark small"></span>
          </button>
          <button type="button" class="action-btn share" title="Share link">
            ${ICONS.share}
          </button>
        </div>
      </div>
    </div>
  `;

  // Event Listeners on Post
  attachPostEvents(card, post, item);

  return card;
}

function attachPostEvents(card, post, item) {
  const uri = post.uri;
  const cid = post.cid;
  const record = post.record || {};
  const author = post.author || {};

  // Card click navigates to Thread (unless clicking a button/link/image)
  card.addEventListener('click', (e) => {
    if (e.target.closest('button, a, .media-item, .quote-card, .embed-card')) return;
    openThreadView(uri);
  });

  // Profile click
  card.querySelectorAll('[data-actor]').forEach((el) => {
    el.addEventListener('click', (e) => {
      e.stopPropagation();
      openProfileView(el.dataset.actor);
    });
  });

  // Lightbox click on media item
  card.querySelectorAll('.media-item').forEach((el) => {
    el.addEventListener('click', (e) => {
      e.stopPropagation();
      const allItems = [...card.querySelectorAll('.media-item')].map((m) => ({
        url: m.dataset.full,
        alt: m.dataset.alt,
      }));
      const idx = parseInt(el.dataset.index, 10) || 0;
      openLightbox(allItems, idx);
    });
  });

  // Action Buttons
  const replyBtn = card.querySelector('.action-btn.reply');
  replyBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    openComposerModal({ replyTo: post });
  });

  const repostBtn = card.querySelector('.action-btn.repost');
  repostBtn.addEventListener('click', async (e) => {
    e.stopPropagation();
    if (!state.session) {
      openLoginModal();
      return;
    }
    const isActive = repostBtn.classList.contains('active');
    try {
      if (isActive && post.viewer?.repost) {
        await api.deleteRepost(post.viewer.repost);
        post.viewer.repost = null;
        post.repostCount = Math.max(0, (post.repostCount || 1) - 1);
        repostBtn.classList.remove('active');
        repostBtn.querySelector('span').textContent = post.repostCount || '';
        toast('Repost removed');
      } else {
        const res = await api.repost(uri, cid);
        post.viewer = post.viewer || {};
        post.viewer.repost = res.uri;
        post.repostCount = (post.repostCount || 0) + 1;
        repostBtn.classList.add('active');
        repostBtn.querySelector('span').textContent = post.repostCount || '';
        toast('Reposted!', 'success');
      }
    } catch (err) {
      toast(err.message, 'error');
    }
  });

  const likeBtn = card.querySelector('.action-btn.like');
  likeBtn.addEventListener('click', async (e) => {
    e.stopPropagation();
    if (!state.session) {
      openLoginModal();
      return;
    }
    const isLiked = likeBtn.classList.contains('active');
    try {
      if (isLiked && post.viewer?.like) {
        await api.deleteLike(post.viewer.like);
        post.viewer.like = null;
        post.likeCount = Math.max(0, (post.likeCount || 1) - 1);
        likeBtn.classList.remove('active');
        likeBtn.innerHTML = `${ICONS.heart}<span>${post.likeCount || ''}</span>`;
      } else {
        const res = await api.likePost(uri, cid);
        post.viewer = post.viewer || {};
        post.viewer.like = res.uri;
        post.likeCount = (post.likeCount || 0) + 1;
        likeBtn.classList.add('active');
        likeBtn.innerHTML = `${ICONS.heartFilled}<span>${post.likeCount || ''}</span>`;
      }
    } catch (err) {
      toast(err.message, 'error');
    }
  });

  const bookmarkBtn = card.querySelector('.action-btn.bookmark');
  bookmarkBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const saved = toggleBookmark(item);
    if (saved) {
      bookmarkBtn.classList.add('active');
      bookmarkBtn.innerHTML = ICONS.bookmarkFilled;
      toast('Post saved to bookmarks', 'success');
    } else {
      bookmarkBtn.classList.remove('active');
      bookmarkBtn.innerHTML = ICONS.bookmark;
      toast('Removed from bookmarks');
    }
  });

  const aiBtn = card.querySelector('.action-btn.ai-btn');
  aiBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    openAiActionsModal(post);
  });

  const shareBtn = card.querySelector('.action-btn.share');
  shareBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const bskyUrl = `https://bsky.app/profile/${author.handle}/post/${uri.split('/').pop()}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(bskyUrl);
      toast('Post link copied to clipboard!', 'success');
    } else {
      prompt('Copy post URL:', bskyUrl);
    }
  });
}

// ----------------- AI Actions Menu Modal -----------------

export function openAiActionsModal(post) {
  const author = post.author?.handle || 'user';
  const text = post.record?.text || '';

  const modal = document.getElementById('modal-overlay');
  modal.removeAttribute('hidden');
  modal.innerHTML = `
    <div class="modal-card">
      <div class="modal-header">
        <div class="brand-title"><span class="spark small"></span><span>Grok AI Actions</span></div>
        <button type="button" class="icon-btn close-modal">${ICONS.close}</button>
      </div>
      <div class="modal-body">
        <p class="dim" style="font-size:12px;font-family:var(--mono);">Target: @${escapeHtml(author)} · "${escapeHtml(text.slice(0, 80))}..."</p>
        <div style="display:flex;flex-direction:column;gap:8px;">
          <button type="button" class="quick-prompt-btn ai-action-opt" data-act="summarize" style="padding:10px 14px;text-align:left;font-size:13px;">
            ✨ <strong>Summarize Discussion</strong> — extract core arguments & conclusions
          </button>
          <button type="button" class="quick-prompt-btn ai-action-opt" data-act="explain" style="padding:10px 14px;text-align:left;font-size:13px;">
            🧠 <strong>Explain Context & Subtext</strong> — understand culture, backstory, or tech
          </button>
          <button type="button" class="quick-prompt-btn ai-action-opt" data-act="factcheck" style="padding:10px 14px;text-align:left;font-size:13px;">
            🔍 <strong>Fact Check Claims</strong> — neutral reality check on assertions
          </button>
          <button type="button" class="quick-prompt-btn ai-action-opt" data-act="replies" style="padding:10px 14px;text-align:left;font-size:13px;">
            💬 <strong>Draft 3 Smart Replies</strong> — generate punchy, thoughtful replies
          </button>
          <button type="button" class="quick-prompt-btn ai-action-opt" data-act="roast" style="padding:10px 14px;text-align:left;font-size:13px;">
            🔥 <strong>Roast This Post</strong> — witty, savage takedown
          </button>
        </div>
        <div id="ai-action-result" style="display:none;background:var(--bg-1);border:1px solid var(--line);border-radius:8px;padding:12px;font-size:13px;line-height:1.45;white-space:pre-wrap;"></div>
      </div>
    </div>
  `;

  modal.querySelector('.close-modal').addEventListener('click', () => modal.setAttribute('hidden', ''));
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.setAttribute('hidden', '');
  });

  modal.querySelectorAll('.ai-action-opt').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const act = btn.dataset.act;
      const resBox = modal.querySelector('#ai-action-result');
      resBox.style.display = 'block';
      resBox.innerHTML = '<span class="spark small pulse"></span> <em>Analyzing with local AI...</em>';

      try {
        let answer = '';
        if (act === 'summarize') answer = await ai.summarizeThread(text);
        if (act === 'explain') answer = await ai.explainPost(text, author);
        if (act === 'factcheck') answer = await ai.factCheckPost(text);
        if (act === 'replies') answer = await ai.generateSmartReplies(text, author);
        if (act === 'roast') answer = await ai.roastPost(text, author);

        resBox.innerHTML = escapeHtml(answer);
      } catch (err) {
        resBox.innerHTML = `<span style="color:var(--red);">Error: ${escapeHtml(err.message)}</span><br><br><span class="dim" style="font-size:11px;">Make sure Ollama is running locally at 127.0.0.1:11434 with <code>systemctl --user start ollama</code></span>`;
      }
    });
  });
}

// ----------------- Thread View -----------------

export async function openThreadView(uri) {
  state.view = 'thread';
  state.activeThreadUri = uri;
  window.location.hash = `thread/${encodeURIComponent(uri)}`;
  const composer = document.getElementById('inline-composer');
  const tabsBar = document.getElementById('feed-tabs-bar');
  if (composer) composer.style.display = 'none';
  if (tabsBar) tabsBar.style.display = 'none';

  const container = document.getElementById('feed-container');
  const title = document.getElementById('view-title');
  title.innerHTML = `<button type="button" class="icon-btn" id="thread-back-btn">${ICONS.back}</button><span>Thread</span>`;
  document.getElementById('thread-back-btn').addEventListener('click', () => history.back());

  container.innerHTML = '<div style="padding:30px;text-align:center;"><span class="spark pulse"></span><p class="dim" style="margin-top:10px;">Loading conversation...</p></div>';

  try {
    const data = await api.getPostThread(uri, 10);
    renderThreadDom(container, data.thread);
  } catch (err) {
    container.innerHTML = `<div style="padding:30px;color:var(--red);text-align:center;">Failed to load thread: ${escapeHtml(err.message)}</div>`;
  }
}

function renderThreadDom(container, thread) {
  container.innerHTML = '';
  const wrap = document.createElement('div');
  wrap.className = 'thread-view';

  // Parents
  const parents = [];
  let curr = thread.parent;
  while (curr && curr.post) {
    parents.unshift(curr.post);
    curr = curr.parent;
  }

  parents.forEach((p) => {
    const parentCard = renderPostCard(p);
    parentCard.classList.add('thread-line-parent');
    wrap.appendChild(parentCard);
  });

  // Focus Post
  const focusCard = renderPostCard(thread.post);
  focusCard.classList.add('highlight');
  wrap.appendChild(focusCard);

  // Replies
  if (thread.replies && thread.replies.length > 0) {
    const replyHeader = document.createElement('div');
    replyHeader.style.cssText = 'padding:10px 16px;font-weight:700;border-bottom:1px solid var(--line);font-size:13px;color:var(--text-muted);';
    replyHeader.textContent = 'Replies';
    wrap.appendChild(replyHeader);

    thread.replies.forEach((r) => {
      if (r.post) wrap.appendChild(renderPostCard(r.post));
    });
  }

  container.appendChild(wrap);
}

// ----------------- Profile View -----------------

export async function openProfileView(actor) {
  state.view = 'profile';
  state.activeProfileActor = actor;
  window.location.hash = `profile/${actor}`;
  const composer = document.getElementById('inline-composer');
  const tabsBar = document.getElementById('feed-tabs-bar');
  if (composer) composer.style.display = 'none';
  if (tabsBar) tabsBar.style.display = 'none';

  const container = document.getElementById('feed-container');
  const title = document.getElementById('view-title');
  title.innerHTML = `<button type="button" class="icon-btn" id="profile-back-btn">${ICONS.back}</button><span>Profile</span>`;
  document.getElementById('profile-back-btn')?.addEventListener('click', () => history.back());

  container.innerHTML = '<div style="padding:30px;text-align:center;"><span class="spark pulse"></span><p class="dim" style="margin-top:10px;">Loading profile...</p></div>';

  try {
    const [profile, feedData] = await Promise.all([
      api.getProfile(actor),
      api.getAuthorFeed(actor),
    ]);

    renderProfileDom(container, profile, feedData.feed || []);
  } catch (err) {
    container.innerHTML = `<div style="padding:30px;color:var(--red);text-align:center;">Failed to load profile: ${escapeHtml(err.message)}</div>`;
  }
}

function renderProfileDom(container, profile, feed) {
  container.innerHTML = '';
  const wrap = document.createElement('div');
  wrap.className = 'profile-view';

  const isSelf = state.session?.did === profile.did;
  const isFollowing = Boolean(profile.viewer?.following);

  wrap.innerHTML = `
    <div class="profile-banner" style="${profile.banner ? `background-image:url(${profile.banner})` : ''}">
      <div class="profile-banner-overlay"></div>
    </div>
    <div class="profile-header-info">
      <div class="profile-avatar-row">
        <img src="${profile.avatar || ''}" class="profile-avatar" alt="${escapeHtml(profile.handle)}">
        ${
          !isSelf
            ? `<button type="button" class="profile-follow-btn ${isFollowing ? 'following' : ''}" id="profile-follow-toggle">
                ${isFollowing ? 'Following' : 'Follow'}
              </button>`
            : `<button type="button" class="profile-follow-btn" id="edit-profile-btn">Edit Profile</button>`
        }
      </div>
      <div class="profile-names">
        <span class="profile-name">${escapeHtml(profile.displayName || profile.handle)}</span>
        <span class="profile-handle">@${escapeHtml(profile.handle)}</span>
      </div>
      ${profile.description ? `<div class="profile-bio">${renderRichText(profile.description)}</div>` : ''}
      <div class="profile-stats-row">
        <span><strong>${formatCount(profile.followsCount)}</strong> Following</span>
        <span><strong>${formatCount(profile.followersCount)}</strong> Followers</span>
        <span><strong>${formatCount(profile.postsCount)}</strong> Posts</span>
      </div>
    </div>
    <div class="feed-tabs-bar">
      <div class="feed-tab active" data-ptab="posts">Posts</div>
      <div class="feed-tab" data-ptab="replies">Posts & Replies</div>
      <div class="feed-tab" data-ptab="media">Media</div>
    </div>
    <div class="posts-stream" id="profile-posts-stream"></div>
  `;

  // Attach follow toggle
  const followBtn = wrap.querySelector('#profile-follow-toggle');
  if (followBtn) {
    followBtn.addEventListener('click', async () => {
      if (!state.session) {
        openLoginModal();
        return;
      }
      try {
        if (profile.viewer?.following) {
          await api.unfollowUser(profile.viewer.following);
          profile.viewer.following = null;
          followBtn.classList.remove('following');
          followBtn.textContent = 'Follow';
          toast('Unfollowed');
        } else {
          const res = await api.followUser(profile.did);
          profile.viewer = profile.viewer || {};
          profile.viewer.following = res.uri;
          followBtn.classList.add('following');
          followBtn.textContent = 'Following';
          toast('Following!', 'success');
        }
      } catch (err) {
        toast(err.message, 'error');
      }
    });
  }

  const postsStream = wrap.querySelector('#profile-posts-stream');
  if (feed.length === 0) {
    postsStream.innerHTML = '<p class="dim" style="padding:30px;text-align:center;">No posts yet.</p>';
  } else {
    feed.forEach((item) => postsStream.appendChild(renderPostCard(item)));
  }

  container.appendChild(wrap);
}

// ----------------- Lightbox Viewer -----------------

export function openLightbox(images, index = 0) {
  const lb = document.getElementById('lightbox');
  lb.removeAttribute('hidden');
  state.lightbox = { images, index };
  updateLightbox();
}

function updateLightbox() {
  if (!state.lightbox) return;
  const { images, index } = state.lightbox;
  const item = images[index];
  const imgEl = document.getElementById('lightbox-img');
  const altEl = document.getElementById('lightbox-alt');

  imgEl.src = item.url;
  if (item.alt) {
    altEl.textContent = item.alt;
    altEl.removeAttribute('hidden');
  } else {
    altEl.setAttribute('hidden', '');
  }
}

export function initLightbox() {
  const lb = document.getElementById('lightbox');
  document.getElementById('lightbox-close').addEventListener('click', () => {
    lb.setAttribute('hidden', '');
    state.lightbox = null;
  });
  document.getElementById('lightbox-prev').addEventListener('click', () => {
    if (!state.lightbox) return;
    state.lightbox.index = (state.lightbox.index - 1 + state.lightbox.images.length) % state.lightbox.images.length;
    updateLightbox();
  });
  document.getElementById('lightbox-next').addEventListener('click', () => {
    if (!state.lightbox) return;
    state.lightbox.index = (state.lightbox.index + 1) % state.lightbox.images.length;
    updateLightbox();
  });
  window.addEventListener('keydown', (e) => {
    if (!state.lightbox) return;
    if (e.key === 'Escape') {
      lb.setAttribute('hidden', '');
      state.lightbox = null;
    } else if (e.key === 'ArrowLeft') {
      state.lightbox.index = (state.lightbox.index - 1 + state.lightbox.images.length) % state.lightbox.images.length;
      updateLightbox();
    } else if (e.key === 'ArrowRight') {
      state.lightbox.index = (state.lightbox.index + 1) % state.lightbox.images.length;
      updateLightbox();
    }
  });
}

// ----------------- Composer Modal -----------------

export function openComposerModal(options = {}) {
  const modal = document.getElementById('modal-overlay');
  modal.removeAttribute('hidden');

  const replyTo = options.replyTo;
  let replyHeader = '';
  if (replyTo) {
    const handle = replyTo.author?.handle;
    replyHeader = `
      <div style="padding:10px 14px;background:var(--bg-1);border-radius:8px;font-size:12px;color:var(--text-muted);display:flex;gap:8px;">
        ${ICONS.reply}
        <span>Replying to <strong>@${escapeHtml(handle)}</strong>: "${escapeHtml(replyTo.record?.text?.slice(0, 60))}..."</span>
      </div>
    `;
  }

  modal.innerHTML = `
    <div class="modal-card">
      <div class="modal-header">
        <span class="modal-title">${replyTo ? 'Reply to Post' : 'Compose Post'}</span>
        <button type="button" class="icon-btn close-modal">${ICONS.close}</button>
      </div>
      <div class="modal-body">
        ${replyHeader}
        <textarea id="modal-compose-text" class="composer-input" rows="4" placeholder="${replyTo ? 'Write your reply...' : "What's happening?"}"></textarea>
        <div id="modal-composer-previews" class="composer-previews"></div>
        <div class="composer-bottom">
          <div class="composer-tools">
            <label class="composer-tool-btn" title="Add Image">
              ${ICONS.image}
              <input type="file" id="modal-img-input" accept="image/*" multiple hidden>
            </label>
            <button type="button" class="composer-tool-btn ai-tool" id="modal-ai-assist-btn" title="Grok Polish / Rewrite">
              <span class="spark small"></span>
            </button>
            <select id="modal-ai-style" style="font-size:11px;font-family:var(--mono);padding:2px 6px;">
              <option value="punchy">✨ Make Punchy</option>
              <option value="concise">✂️ Shorten &lt; 300</option>
              <option value="roast">🔥 Roast Tone</option>
              <option value="translate-German">🇩🇪 German</option>
              <option value="translate-Spanish">🇪🇸 Spanish</option>
              <option value="translate-Japanese">🇯🇵 Japanese</option>
            </select>
          </div>
          <div class="composer-submit-group">
            <span id="modal-char-count" class="char-count-text">300</span>
            <button type="button" class="submit-post-btn" id="modal-submit-btn">Post</button>
          </div>
        </div>
      </div>
    </div>
  `;

  const textarea = modal.querySelector('#modal-compose-text');
  const countEl = modal.querySelector('#modal-char-count');
  const submitBtn = modal.querySelector('#modal-submit-btn');
  const fileInput = modal.querySelector('#modal-img-input');
  const previewBox = modal.querySelector('#modal-composer-previews');
  const aiAssistBtn = modal.querySelector('#modal-ai-assist-btn');
  const aiStyleSelect = modal.querySelector('#modal-ai-style');

  const attachedImages = [];

  textarea.focus();

  textarea.addEventListener('input', () => {
    const len = textarea.value.length;
    const rem = 300 - len;
    countEl.textContent = rem;
    countEl.className = 'char-count-text' + (rem < 20 ? (rem < 0 ? ' over' : ' warn') : '');
    submitBtn.disabled = len === 0 || rem < 0;
  });

  fileInput.addEventListener('change', async (e) => {
    const files = [...e.target.files].slice(0, 4 - attachedImages.length);
    for (const file of files) {
      const url = URL.createObjectURL(file);
      attachedImages.push({ file, url, blob: null });
    }
    renderPreviews();
  });

  function renderPreviews() {
    previewBox.innerHTML = '';
    attachedImages.forEach((img, idx) => {
      const chip = document.createElement('div');
      chip.className = 'composer-img-chip';
      chip.innerHTML = `
        <img src="${img.url}">
        <span class="remove-chip" data-idx="${idx}">&times;</span>
      `;
      chip.querySelector('.remove-chip').addEventListener('click', () => {
        attachedImages.splice(idx, 1);
        renderPreviews();
      });
      previewBox.appendChild(chip);
    });
  }

  aiAssistBtn.addEventListener('click', async () => {
    const text = textarea.value.trim();
    if (!text) {
      toast('Enter some draft text first');
      return;
    }
    aiAssistBtn.innerHTML = '<span class="spark small pulse"></span>';
    try {
      const polished = await ai.polishComposerText(text, aiStyleSelect.value);
      textarea.value = polished;
      textarea.dispatchEvent(new Event('input'));
      toast('Polished by local AI!', 'success');
    } catch (err) {
      toast(err.message, 'error');
    } finally {
      aiAssistBtn.innerHTML = '<span class="spark small"></span>';
    }
  });

  submitBtn.addEventListener('click', async () => {
    if (!state.session) {
      openLoginModal();
      return;
    }
    submitBtn.disabled = true;
    submitBtn.textContent = 'Posting...';

    try {
      // Upload media blobs
      for (const img of attachedImages) {
        if (!img.blob) {
          const res = await api.uploadBlob(img.file);
          img.blob = res.blob;
        }
      }

      await api.createPost({
        text: textarea.value,
        replyTo,
        images: attachedImages,
      });

      toast('Post published successfully!', 'success');
      modal.setAttribute('hidden', '');
      // Refresh current feed
      window.dispatchEvent(new CustomEvent('feed:refresh'));
    } catch (err) {
      toast(err.message, 'error');
      submitBtn.disabled = false;
      submitBtn.textContent = 'Post';
    }
  });

  modal.querySelector('.close-modal').addEventListener('click', () => modal.setAttribute('hidden', ''));
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.setAttribute('hidden', '');
  });
}

// ----------------- Login Modal -----------------

export function openLoginModal() {
  const modal = document.getElementById('modal-overlay');
  modal.removeAttribute('hidden');

  modal.innerHTML = `
    <div class="modal-card">
      <div class="modal-header">
        <div class="brand-title"><span class="spark small"></span><span>Sign in to LibreSky</span></div>
        <button type="button" class="icon-btn close-modal">${ICONS.close}</button>
      </div>
      <div class="modal-body">
        <p class="dim" style="font-size:13px;">Connect your sovereign Bluesky account using your handle and an <strong>App Password</strong>.</p>
        <div style="display:flex;flex-direction:column;gap:12px;">
          <div>
            <label style="font-size:12px;font-weight:600;display:block;margin-bottom:4px;">Bluesky Handle</label>
            <input type="text" id="login-handle" placeholder="e.g. alice.bsky.social" style="width:100%;">
          </div>
          <div>
            <label style="font-size:12px;font-weight:600;display:block;margin-bottom:4px;">App Password</label>
            <input type="password" id="login-password" placeholder="xxxx-xxxx-xxxx-xxxx" style="width:100%;">
            <a href="https://bsky.app/settings/app-passwords" target="_blank" style="font-size:11px;margin-top:4px;display:inline-block;">Create App Password on Bluesky &rarr;</a>
          </div>
          <div>
            <label style="font-size:12px;font-weight:600;display:block;margin-bottom:4px;">PDS / Server URL</label>
            <input type="text" id="login-pds" value="${escapeHtml(state.pdsUrl)}" style="width:100%;font-family:var(--mono);font-size:12px;">
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="quick-prompt-btn" id="guest-btn">Browse as Guest</button>
        <button type="button" class="submit-post-btn" id="submit-login-btn">Sign In</button>
      </div>
    </div>
  `;

  const handleInput = modal.querySelector('#login-handle');
  const passInput = modal.querySelector('#login-password');
  const pdsInput = modal.querySelector('#login-pds');
  const submitBtn = modal.querySelector('#submit-login-btn');
  const guestBtn = modal.querySelector('#guest-btn');

  submitBtn.addEventListener('click', async () => {
    const handle = handleInput.value.trim();
    const pass = passInput.value.trim();
    const pds = pdsInput.value.trim() || 'https://bsky.social';

    if (!handle || !pass) {
      toast('Please enter both your handle and App Password', 'error');
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Authenticating...';

    try {
      await api.createSession(handle, pass, pds);
      toast(`Signed in as @${handle}`, 'success');
      modal.setAttribute('hidden', '');
      window.dispatchEvent(new CustomEvent('session:change'));
    } catch (err) {
      toast(err.message, 'error');
      submitBtn.disabled = false;
      submitBtn.textContent = 'Sign In';
    }
  });

  guestBtn.addEventListener('click', () => {
    modal.setAttribute('hidden', '');
    toast('Browsing public feeds as guest');
  });

  modal.querySelector('.close-modal').addEventListener('click', () => modal.setAttribute('hidden', ''));
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.setAttribute('hidden', '');
  });
}

// ----------------- Settings Modal -----------------

export function openSettingsModal() {
  const modal = document.getElementById('modal-overlay');
  modal.removeAttribute('hidden');

  modal.innerHTML = `
    <div class="modal-card">
      <div class="modal-header">
        <span class="modal-title">Settings & Local AI</span>
        <button type="button" class="icon-btn close-modal">${ICONS.close}</button>
      </div>
      <div class="modal-body">
        <section style="display:flex;flex-direction:column;gap:8px;">
          <h4 style="font-size:14px;font-weight:700;">Appearance</h4>
          <div style="display:flex;gap:10px;">
            <button type="button" class="quick-prompt-btn ${state.theme === 'black' ? 'active' : ''}" id="theme-black-btn">Pitch Black (Default)</button>
            <button type="button" class="quick-prompt-btn ${state.theme === 'light' ? 'active' : ''}" id="theme-light-btn">Light</button>
          </div>
        </section>

        <section style="display:flex;flex-direction:column;gap:10px;border-top:1px solid var(--line);padding-top:12px;">
          <h4 style="font-size:14px;font-weight:700;display:flex;align-items:center;gap:6px;">
            <span class="spark small"></span> Local AI Configuration
          </h4>
          <div>
            <label style="font-size:12px;font-weight:600;display:block;margin-bottom:4px;">Endpoint URL</label>
            <input type="text" id="settings-ai-endpoint" value="${escapeHtml(state.ai.endpoint)}" style="width:100%;font-family:var(--mono);">
            <span class="dim" style="font-size:11px;">Default: http://127.0.0.1:11434 (Ollama) or http://127.0.0.1:1234 (LM Studio)</span>
          </div>
          <div>
            <label style="font-size:12px;font-weight:600;display:block;margin-bottom:4px;">Active Model</label>
            <select id="settings-ai-model" style="width:100%;font-family:var(--mono);">
              ${
                state.ai.models.length > 0
                  ? state.ai.models.map((m) => `<option value="${m}" ${m === state.ai.activeModel ? 'selected' : ''}>${m}</option>`).join('')
                  : `<option value="">No local models detected</option>`
              }
            </select>
          </div>
          <button type="button" class="quick-prompt-btn" id="settings-scan-ai-btn">🔄 Rescan Local AI</button>
        </section>

        <section style="display:flex;flex-direction:column;gap:8px;border-top:1px solid var(--line);padding-top:12px;">
          <h4 style="font-size:14px;font-weight:700;">Account</h4>
          ${
            state.session
              ? `<div style="display:flex;align-items:center;justify-content:space-between;">
                  <span>Logged in as <strong>@${escapeHtml(state.session.handle)}</strong></span>
                  <button type="button" class="quick-prompt-btn" id="logout-btn" style="color:var(--red);">Log Out</button>
                 </div>`
              : `<p class="dim" style="font-size:13px;">Currently browsing as guest.</p>
                 <button type="button" class="submit-post-btn" id="settings-login-btn" style="align-self:flex-start;">Sign In</button>`
          }
        </section>
      </div>
    </div>
  `;

  modal.querySelector('#theme-black-btn').addEventListener('click', () => setTheme('black'));
  modal.querySelector('#theme-light-btn').addEventListener('click', () => setTheme('light'));

  const scanBtn = modal.querySelector('#settings-scan-ai-btn');
  const endpointInput = modal.querySelector('#settings-ai-endpoint');
  const modelSelect = modal.querySelector('#settings-ai-model');

  scanBtn.addEventListener('click', async () => {
    state.ai.endpoint = endpointInput.value.trim();
    scanBtn.textContent = 'Scanning...';
    const res = await ai.scanLocalAi();
    if (res.ok) {
      toast(`Connected to ${res.models.length} model(s)!`, 'success');
      modelSelect.innerHTML = res.models.map((m) => `<option value="${m}" ${m === res.activeModel ? 'selected' : ''}>${m}</option>`).join('');
    } else {
      toast('Could not find local AI endpoint', 'error');
    }
    scanBtn.textContent = '🔄 Rescan Local AI';
  });

  const logoutBtn = modal.querySelector('#logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      clearSession();
      toast('Signed out');
      modal.setAttribute('hidden', '');
      window.dispatchEvent(new CustomEvent('session:change'));
    });
  }

  const loginBtn = modal.querySelector('#settings-login-btn');
  if (loginBtn) {
    loginBtn.addEventListener('click', () => {
      modal.setAttribute('hidden', '');
      openLoginModal();
    });
  }

  modal.querySelector('.close-modal').addEventListener('click', () => modal.setAttribute('hidden', ''));
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.setAttribute('hidden', '');
  });
}

export function openAboutModal() {
  const modal = document.getElementById('modal-overlay');
  modal.removeAttribute('hidden');
  const office = Boolean(window.office);
  modal.innerHTML = `
    <div class="modal-card">
      <div class="modal-header">
        <div class="brand-title"><span class="spark small"></span><span>${office ? 'LibreOffice' : 'LibreSky'}</span></div>
        <button type="button" class="icon-btn close-modal">${ICONS.close}</button>
      </div>
      <div class="modal-body">
        <p>${office ? 'LibreOffice is the Electron Bluesky client inside LibreSky.' : 'LibreSky is a plain GitHub Pages Bluesky client.'}</p>
        <p class="dim">Mira, The White Witch™. MIT License.</p>
        <p><a href="https://thewhitewitchtm.github.io/LibreSky/" target="_blank" rel="noopener">GitHub Pages</a> · <a href="https://github.com/TheWhiteWitchTM/LibreSky" target="_blank" rel="noopener">Source</a></p>
      </div>
    </div>
  `;
  modal.querySelector('.close-modal').addEventListener('click', () => modal.setAttribute('hidden', ''));
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.setAttribute('hidden', '');
  });
}
