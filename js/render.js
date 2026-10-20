import { icon } from './icons.js';
import {
  compact,
  escapeHtml,
  fullCount,
  fullTime,
  hostOf,
  postHash,
  profileHash,
  richText,
  safeUrl,
  timeAgo,
} from './util.js';

const bag = new Map();
const WARN = new Set(['porn', 'sexual', 'nudity', 'graphic-media', 'gore', 'corpse']);

export function resetPosts() {
  bag.clear();
}

export function drainPosts() {
  const copy = new Map(bag);
  bag.clear();
  return copy;
}

function attr(value) {
  return escapeHtml(value ?? '');
}

export function avatar(url, label, size) {
  const initial = escapeHtml((String(label || '?').trim().charAt(0) || '?').toUpperCase());
  const src = safeUrl(url || '');
  return `<span class="avatar ${size || ''}" data-initial="${initial}">${src ? `<img src="${attr(src)}" alt="" onerror="this.remove()">` : ''}</span>`;
}

function counts(post) {
  return {
    reply: post.replyCount || 0,
    repost: post.repostCount || 0,
    like: post.likeCount || 0,
  };
}

function verifiedMark(actor) {
  if (actor?.verification?.verifiedStatus !== 'valid') return '';
  return '<svg class="verified" viewBox="0 0 16 16" role="img" aria-label="Verified"><title>Verified</title><circle cx="8" cy="8" r="8" fill="currentColor"/><path fill="var(--bg)" d="M6.6 11.2 3.8 8.4l1.1-1.1 1.7 1.7 4.4-4.4 1.1 1.1z"/></svg>';
}

function action(name, label, on, count, listAct) {
  const shown = compact(count);
  const glyph = name === 'like' ? 'heart' : name === 'bookmark' ? 'bookmark' : name;
  const button = `<button type="button" class="action ${name}${on ? ' on' : ''}" data-act="${name}" aria-pressed="${on ? 'true' : 'false'}" aria-label="${attr(label)}">${icon(glyph)}</button>`;
  if (name === 'bookmark' || name === 'share') return button;
  const countHtml = listAct
    ? `<button type="button" class="count-link" data-act="${listAct}" aria-label="${attr(`${label} count`)}">${shown}</button>`
    : `<span class="count">${shown}</span>`;
  return `<span class="action-group ${name}${on ? ' on' : ''}">${button}${countHtml}</span>`;
}

function gallery(images) {
  const list = (images || []).slice(0, 4).filter((image) => safeUrl(image.fullsize || image.thumb));
  if (!list.length) return '';
  return `<div class="gallery n${list.length}">${list.map((image) => {
    const full = safeUrl(image.fullsize || image.thumb);
    const thumb = safeUrl(image.thumb || image.fullsize);
    const width = Number(image.aspectRatio?.width);
    const height = Number(image.aspectRatio?.height);
    const ratio = width > 0 && height > 0 ? `${width} / ${height}` : '4 / 3';
    return `<button type="button" class="shot" data-act="image" data-full="${attr(full)}" data-alt="${attr(image.alt || '')}" style="aspect-ratio:${ratio}"><img src="${attr(thumb)}" alt="${attr(image.alt || '')}">${image.alt ? '<span class="alt">ALT</span>' : ''}</button>`;
  }).join('')}</div>`;
}

function linkCard(external) {
  if (!external?.uri) return '';
  const href = safeUrl(external.uri);
  if (!href) return '';
  const thumb = safeUrl(external.thumb || '');
  return `<a class="card" href="${attr(href)}" target="_blank" rel="noopener noreferrer">${thumb ? `<img src="${attr(thumb)}" alt="">` : ''}<span class="card-body"><span class="domain">${escapeHtml(hostOf(href))}</span><strong>${escapeHtml(external.title || href)}</strong>${external.description ? `<span class="desc">${escapeHtml(external.description)}</span>` : ''}</span></a>`;
}

function recordNode(node) {
  if (!node) return null;
  if (node.$type === 'app.bsky.embed.record#view') return node.record;
  return node;
}

function quote(view) {
  const record = recordNode(view);
  if (!record) return '';
  const type = record.$type || '';
  if (type.endsWith('NotFound') || type.endsWith('Blocked') || type.endsWith('Detached')) {
    return '<div class="quote unavailable">Post unavailable</div>';
  }
  if (type.endsWith('viewRecord') || record.value?.text != null || record.author) {
    const author = record.author || {};
    const text = record.value?.text || '';
    bag.set(record.uri, { post: { ...record, record: record.value || record.record, uri: record.uri, cid: record.cid, author } });
    return `<a class="quote" href="${postHash({ uri: record.uri, author })}">${avatar(author.avatar, author.displayName || author.handle, 'sm')}<span><span class="line"><strong>${escapeHtml(author.displayName || author.handle || 'Post')}</strong> <span class="handle">@${escapeHtml(author.handle || '')}</span></span><span class="quote-text">${richText(text, record.value?.facets)}</span></span></a>`;
  }
  const who = record.creator || record.author;
  if (record.displayName && who) {
    return `<a class="quote" href="${profileHash(who)}"><span><strong>${escapeHtml(record.displayName)}</strong><span class="handle">@${escapeHtml(who.handle || '')}</span></span></a>`;
  }
  return '';
}

function video(embed) {
  const thumb = safeUrl(embed.thumbnail || '');
  const playlist = safeUrl(embed.playlist || '');
  return `<button type="button" class="video" data-act="video" data-playlist="${attr(playlist)}" data-alt="${attr(embed.alt || '')}">${thumb ? `<img src="${attr(thumb)}" alt="${attr(embed.alt || 'Video')}">` : ''}<span class="play">Play</span></button>`;
}

function embedHtml(embed) {
  if (!embed) return '';
  const type = embed.$type || '';
  if (type.endsWith('images#view')) return gallery(embed.images);
  if (type.endsWith('external#view')) return linkCard(embed.external);
  if (type.endsWith('record#view')) return quote(embed);
  if (type.endsWith('recordWithMedia#view')) return `${embedHtml(embed.media)}${quote(embed.record)}`;
  if (type.endsWith('video#view')) return video(embed);
  return '';
}

function warned(post) {
  return (post.labels || []).some((label) => WARN.has(label.val));
}

export function postHtml(item, options = {}) {
  const post = item?.post || item;
  if (!post?.uri) return '';
  bag.set(post.uri, item?.post ? item : { post });
  if (item?.muted && !options.force) {
    return `<article class="post muted-row" data-uri="${attr(post.uri)}"><p>Hidden by a muted word. <button type="button" data-act="show-muted">Show</button></p></article>`;
  }
  const author = post.author || {};
  const record = post.record || {};
  const reason = item?.reason;
  const repostBy = reason?.$type?.includes('reasonRepost') ? reason.by : null;
  const parentHandle = item?.reply?.parent?.author?.handle;
  const number = counts(post);
  const liked = Boolean(post.viewer?.like);
  const reposted = Boolean(post.viewer?.repost);
  const saved = Boolean(post.viewer?.bookmarked || post.viewer?.bookmark);
  const when = record.createdAt || post.indexedAt;
  const blur = warned(post) ? ' blurred' : '';
  return `<article class="post${options.connected ? ' connected' : ''}${options.feed === false ? '' : ' feed-post'}" data-feed="${options.feed === false ? '0' : '1'}" data-uri="${attr(post.uri)}" data-cid="${attr(post.cid)}" data-did="${attr(author.did)}" data-handle="${attr(author.handle)}" data-like="${attr(post.viewer?.like || '')}" data-repost="${attr(post.viewer?.repost || '')}" data-like-count="${number.like}" data-repost-count="${number.repost}" data-reply-count="${number.reply}" data-bookmarked="${saved ? '1' : '0'}">
    ${repostBy ? `<a class="repost-line" href="${profileHash(repostBy)}">${icon('repost')}<span>${escapeHtml(repostBy.displayName || repostBy.handle)} reposted</span></a>` : ''}
    <div class="post-row">
      <a class="avatar-link" href="${profileHash(author)}">${avatar(author.avatar, author.displayName || author.handle)}</a>
      <div class="post-main">
        <div class="post-top">
          <a class="name" href="${profileHash(author)}">${escapeHtml(author.displayName || author.handle || 'User')}${verifiedMark(author)}</a>
          <a class="handle" href="${profileHash(author)}">@${escapeHtml(author.handle || '')}</a>
          <a class="time" href="${postHash(post)}" title="${attr(fullTime(when))}">${escapeHtml(timeAgo(when))}</a>
          <button type="button" class="icon-btn more" data-act="more" aria-label="More">${icon('more')}</button>
        </div>
        ${parentHandle ? `<a class="replying" href="${profileHash(parentHandle)}">Replying to @${escapeHtml(parentHandle)}</a>` : ''}
        <div class="content${blur}">
          ${record.text ? `<p class="text">${richText(record.text, record.facets)}</p>` : ''}
          ${embedHtml(post.embed)}
          ${blur ? '<button type="button" class="show-warn" data-act="show-warn">Content warning. Show</button>' : ''}
        </div>
        <div class="actions">
          ${action('reply', 'Reply', false, number.reply)}
          ${action('repost', 'Repost', reposted, number.repost, 'reposts')}
          ${action('like', 'Like', liked, number.like, 'likes')}
          ${action('bookmark', 'Bookmark', saved, 0)}
          ${action('share', 'Share', false, 0)}
        </div>
      </div>
    </div>
  </article>`;
}

export function feedHtml(items, options) {
  return (items || []).map((item) => postHtml(item, options)).join('');
}

export function skeletons(count = 6) {
  return Array.from({ length: count }, () => '<div class="post skel"><div class="post-row"><span class="avatar sk"></span><div class="post-main"><span class="sk line short"></span><span class="sk line"></span><span class="sk line mid"></span></div></div></div>').join('');
}

export function emptyHtml(title, body, extra = '') {
  return `<div class="empty"><h2>${escapeHtml(title)}</h2><p>${escapeHtml(body)}</p>${extra}</div>`;
}

export function profileHtml(profile) {
  const banner = safeUrl(profile.banner || '').replace(/[()'"]/g, '');
  const name = profile.displayName || profile.handle;
  return `<header class="profile">
    <div class="banner"${banner ? ` style="background-image:url('${banner.replace(/'/g, '')}')"` : ''}></div>
    <div class="profile-row">
      ${avatar(profile.avatar, name, 'xl')}
      <div id="profile-action"></div>
    </div>
    <h2>${escapeHtml(name)}${verifiedMark(profile)}</h2>
    <div class="handle">@${escapeHtml(profile.handle)}</div>
    ${profile.description ? `<p class="bio">${richText(profile.description, profile.descriptionFacets)}</p>` : ''}
    <p class="counts"><a href="#/profile/${encodeURIComponent(profile.handle)}/following"><strong>${fullCount(profile.followsCount)}</strong> following</a><a href="#/profile/${encodeURIComponent(profile.handle)}/followers"><strong>${fullCount(profile.followersCount)}</strong> followers</a><span><strong>${fullCount(profile.postsCount)}</strong> posts</span></p>
  </header>`;
}

export function actorHtml(actor, options = {}) {
  const name = actor.displayName || actor.handle;
  const desc = actor.description ? escapeHtml(actor.description).slice(0, 120) : '';
  const following = actor.viewer?.following || '';
  const showFollow = Boolean(options.follow && actor.did && actor.did !== options.self);
  const follow = showFollow
    ? `<button type="button" class="follow${following ? ' on' : ''}" data-act="follow" data-did="${attr(actor.did)}" data-following="${attr(following)}">${following ? 'Following' : 'Follow'}</button>`
    : '';
  return `<div class="person">${avatar(actor.avatar, name)}<a class="person-link" href="${profileHash(actor)}"><strong>${escapeHtml(name || '')}${verifiedMark(actor)}</strong><span class="handle">@${escapeHtml(actor.handle || '')}</span>${desc ? `<span class="snip">${desc}</span>` : ''}</a>${follow}</div>`;
}

const NOTE_VERB = {
  like: 'liked your post',
  repost: 'reposted your post',
  follow: 'followed you',
  reply: 'replied to you',
  quote: 'quoted your post',
  mention: 'mentioned you',
};

export function notificationHtml(note, subject) {
  const author = note.author || {};
  const name = author.displayName || author.handle || 'Someone';
  const verb = NOTE_VERB[note.reason] || note.reason || 'interacted';
  const href = note.reason === 'follow' ? profileHash(author) : (subject ? postHash(subject) : profileHash(author));
  const snippet = subject?.record?.text || '';
  const glyph = note.reason === 'like' ? 'heart' : note.reason === 'repost' || note.reason === 'quote' ? 'repost' : note.reason === 'follow' ? 'user' : 'reply';
  return `<a class="note ${note.isRead ? '' : 'unread'} ${attr(note.reason)}" href="${href}"><span class="note-icon">${icon(glyph)}</span><span class="note-body">${avatar(author.avatar, name, 'sm')}<span class="note-text"><strong>${escapeHtml(name)}</strong> ${escapeHtml(verb)} <span class="time">${escapeHtml(timeAgo(note.indexedAt))}</span></span>${snippet ? `<span class="snip">${escapeHtml(snippet.slice(0, 180))}</span>` : ''}</span></a>`;
}

export function convoHtml(convo, me) {
  const other = (convo.members || []).find((member) => member.did !== me) || convo.members?.[0] || {};
  const text = convo.lastMessage?.text || 'No messages yet';
  return `<a class="person convo" href="#/messages/${encodeURIComponent(convo.id)}">${avatar(other.avatar, other.displayName || other.handle)}<span><strong>${escapeHtml(other.displayName || other.handle || 'Conversation')}</strong><span class="handle">${escapeHtml(text).slice(0, 140)}</span></span>${convo.unreadCount ? `<b class="pill">${convo.unreadCount}</b>` : ''}</a>`;
}

export function messageHtml(message, me) {
  const mine = message?.sender?.did === me;
  return `<div class="bubble${mine ? ' mine' : ''}">${escapeHtml(message?.text || '')}</div>`;
}

export function threadList(node) {
  const ancestors = [];
  function walk(current) {
    if (!current) return;
    if (current.parent) walk(current.parent);
    if (current.post) ancestors.push(current);
    else ancestors.push({ missing: true });
  }
  if (node?.parent) walk(node.parent);
  return ancestors;
}
