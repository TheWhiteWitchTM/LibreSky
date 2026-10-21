import { aiReady, loadAi } from './ai.js';
import { icon } from './icons.js';
import {
  accountGone,
  compact,
  escapeHtml,
  fullCount,
  fullTime,
  hostOf,
  postHash,
  profileHash,
  convoUnread,
  messageSender,
  parseCallMessage,
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

function accountIcon(actor, size, extraClass = '') {
  const id = typeof actor === 'string' ? actor : (actor?.handle || actor?.did || '');
  const name = (typeof actor === 'string' ? actor : (actor?.displayName || actor?.handle)) || 'Account';
  const face = avatar(typeof actor === 'string' ? '' : actor?.avatar, name, size);
  if (!id) return face;
  const classes = ['avatar-btn', extraClass].filter(Boolean).join(' ');
  return `<button type="button" class="${classes}" data-act="account-card" data-actor="${attr(id)}" aria-label="${attr(`Show ${name}`)}" aria-expanded="false">${face}</button>`;
}

function counts(post) {
  return {
    reply: post.replyCount || 0,
    repost: post.repostCount || 0,
    like: post.likeCount || 0,
  };
}

function domainVerified(actor) {
  const handle = String(actor?.handle || '').trim().toLowerCase();
  if (!handle || handle.endsWith('.bsky.social') || handle.endsWith('.invalid') || handle === 'handle.invalid') return false;
  return /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)+$/.test(handle);
}

function checkMark(label, kind) {
  return `<svg class="verified ${kind}" viewBox="0 0 16 16" role="img" aria-label="${label}"><title>${label}</title><circle cx="8" cy="8" r="8" fill="currentColor"/><path fill="var(--bg)" d="M6.6 11.2 3.8 8.4l1.1-1.1 1.7 1.7 4.4-4.4 1.1 1.1z"/></svg>`;
}

function verifiedMark(actor) {
  const verification = actor?.verification || {};
  const bluesky = verification.verifiedStatus === 'valid' || verification.trustedVerifierStatus === 'valid';
  const domain = domainVerified(actor);
  if (!bluesky && !domain) return '';
  const parts = [];
  if (bluesky) {
    const label = verification.verifiedStatus === 'valid' ? 'Verified' : 'Trusted verifier';
    parts.push(checkMark(label, 'official'));
  }
  if (domain) parts.push(checkMark('Verified domain', 'domain'));
  return parts.join('');
}

function aiPostAction() {
  if (!aiReady(loadAi())) return '';
  return `<button type="button" class="action ai" data-act="ai-post" aria-label="AI Assist">${icon('spark')}<span class="sr-name" aria-hidden="true">AI Assist</span></button>`;
}

function action(name, label, on, count, listAct) {
  const shown = compact(count);
  const glyph = name === 'like' ? 'heart' : name === 'bookmark' ? 'bookmark' : name;
  const button = `<button type="button" class="action ${name}${on ? ' on' : ''}" data-act="${name}" aria-pressed="${on ? 'true' : 'false'}" aria-label="${attr(label)}">${icon(glyph)}<span class="sr-name" aria-hidden="true">${escapeHtml(label)}</span></button>`;
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

function gifHost(href) {
  try {
    const url = new URL(href);
    const host = url.hostname;
    if (host === 'klipy.com' || host.endsWith('.klipy.com')) return true;
    if (host === 'tenor.com' || host.endsWith('.tenor.com')) return true;
    if (host === 'giphy.com' || host.endsWith('.giphy.com')) return true;
    return /\.gif$/i.test(url.pathname);
  } catch {
    return false;
  }
}

function linkCard(external) {
  if (!external?.uri) return '';
  const href = safeUrl(external.uri);
  if (!href) return '';
  if (gifHost(href)) {
    const animated = /\.gif/i.test(href) ? href : (safeUrl(external.thumb || '') || href);
    return `<a class="card gif-card" href="${attr(href)}" target="_blank" rel="noopener noreferrer"><img src="${attr(animated)}" alt="${attr(external.title || 'GIF')}"></a>`;
  }
  const thumb = safeUrl(external.thumb || '');
  return `<a class="card" href="${attr(href)}" target="_blank" rel="noopener noreferrer">${thumb ? `<img src="${attr(thumb)}" alt="" onerror="this.remove()">` : ''}<span class="card-body"><span class="domain">${escapeHtml(hostOf(href))}</span><strong>${escapeHtml(external.title || href)}</strong>${external.description ? `<span class="desc">${escapeHtml(external.description)}</span>` : ''}</span></a>`;
}

export function linkPreviewHtml(card) {
  if (!card) return '';
  if (card.kind === 'quote' && card.post?.uri) {
    return quote({
      $type: 'app.bsky.embed.record#view',
      record: {
        $type: 'app.bsky.embed.record#viewRecord',
        uri: card.post.uri,
        cid: card.post.cid,
        author: card.post.author,
        value: card.post.record,
      },
    }, false);
  }
  if (card.kind === 'external' && card.url) {
    return linkCard({ uri: card.url, title: card.title, description: card.description, thumb: card.image });
  }
  return '';
}

function recordNode(node) {
  if (!node) return null;
  if (node.$type === 'app.bsky.embed.record#view') return node.record;
  return node;
}

export function collectionKind(record) {
  const type = String(record?.$type || '');
  const uri = String(record?.uri || '');
  if (type.includes('starterPack') || uri.includes('/app.bsky.graph.starterpack/')) return 'pack';
  if (type.includes('generatorView') || uri.includes('/app.bsky.feed.generator/')) return 'feed';
  if (type.includes('labelerView') || uri.includes('/app.bsky.labeler.service/')) return 'labeler';
  if (type.endsWith('listView') || type.endsWith('listViewBasic') || uri.includes('/app.bsky.graph.list/')) return 'list';
  return '';
}

function collectionLabel(kind, record) {
  if (kind === 'feed') return 'Feed';
  if (kind === 'pack') return 'Starter pack';
  if (kind === 'labeler') return 'Labeler';
  const purpose = String(record?.purpose || '');
  if (purpose.includes('modlist')) return 'Mute list';
  if (purpose.includes('referencelist')) return 'Reference list';
  return 'List';
}

export function collectionCardHtml(record, options = {}) {
  const kind = options.kind || collectionKind(record);
  if (!kind || !record?.uri) return '';
  const creator = record.creator || record.author || {};
  const inner = record.record && record.record.text == null ? record.record : null;
  const name = kind === 'pack'
    ? (inner?.name || record.name || 'Starter pack')
    : kind === 'list'
      ? (record.name || 'List')
      : kind === 'labeler'
        ? (creator.displayName || creator.handle || 'Labeler')
        : (record.displayName || record.name || 'Feed');
  const description = String(record.description || inner?.description || '').replace(/\s+/g, ' ').trim();
  const handle = creator.handle ? `@${creator.handle}` : '';
  const bits = [collectionLabel(kind, record), handle];
  const people = record.listItemCount ?? record.list?.listItemCount;
  if ((kind === 'list' || kind === 'pack') && people != null) bits.push(`${fullCount(people)} people`);
  if (kind === 'feed' && record.likeCount) bits.push(`${fullCount(record.likeCount)} likes`);
  const href = kind === 'feed'
    ? `#/feed/${encodeURIComponent(record.uri)}`
    : kind === 'list'
      ? `#/list/${encodeURIComponent(record.uri)}`
      : kind === 'pack'
        ? `#/pack/${encodeURIComponent(record.uri)}`
        : profileHash(creator);
  const body = `<span class="collection-copy"><span class="domain">${escapeHtml(bits.filter(Boolean).join(' · '))}</span><strong>${escapeHtml(name)}</strong>${description ? `<span class="desc">${escapeHtml(description)}</span>` : ''}</span>`;
  const face = avatar(record.avatar || creator.avatar, name);
  if (options.button) {
    return `<button type="button" class="collection" data-act="attach-pick" data-uri="${attr(record.uri)}" data-cid="${attr(record.cid || '')}">${face}${body}</button>`;
  }
  const card = `<a class="collection" href="${attr(href)}">${face}${body}</a>`;
  if (!options.remove) return card;
  return `<div class="collection-wrap">${card}<button type="button" class="card-dismiss" data-act="dismiss-attach" aria-label="Remove">×</button></div>`;
}

function quote(view, linked = true) {
  const record = recordNode(view);
  if (!record) return '';
  const type = record.$type || '';
  if (type.endsWith('NotFound') || type.endsWith('Blocked') || type.endsWith('Detached')) {
    return '<div class="quote unavailable">Post unavailable</div>';
  }
  const attached = collectionCardHtml(record);
  if (attached) return attached;
  if (type.endsWith('viewRecord') || record.value?.text != null || record.record?.text != null || record.author) {
    const author = record.author || {};
    const text = record.value?.text ?? record.record?.text ?? '';
    const facets = record.value?.facets || record.record?.facets;
    bag.set(record.uri, { post: { ...record, record: record.value || record.record, uri: record.uri, cid: record.cid, author } });
    const postHref = postHash({ uri: record.uri, author });
    const face = accountIcon(author, 'sm');
    const line = `<span class="line"><strong>${escapeHtml(author.displayName || author.handle || 'Post')}</strong> <span class="handle">@${escapeHtml(author.handle || '')}</span></span>`;
    const head = linked
      ? `<span class="quote-head">${face}<a href="${attr(postHref)}">${line}</a></span>`
      : `<span class="quote-head">${face}${line}</span>`;
    const data = linked ? ` data-href="${attr(postHref)}"` : '';
    return `<div class="quote"${data}>${head}<span class="quote-text">${richText(text, facets)}</span></div>`;
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
  const pinned = Boolean(options.pinned) || String(reason?.$type || '').includes('reasonPin');
  const parentHandle = item?.reply?.parent?.author?.handle;
  const number = counts(post);
  const liked = Boolean(post.viewer?.like);
  const reposted = Boolean(post.viewer?.repost);
  const saved = Boolean(post.viewer?.bookmarked || post.viewer?.bookmark);
  const when = record.createdAt || post.indexedAt;
  const blur = warned(post) ? ' blurred' : '';
  return `<article class="post${options.connected ? ' connected' : ''}${options.feed === false ? '' : ' feed-post'}" data-feed="${options.feed === false ? '0' : '1'}" data-uri="${attr(post.uri)}" data-cid="${attr(post.cid)}" data-did="${attr(author.did)}" data-handle="${attr(author.handle)}" data-like="${attr(post.viewer?.like || '')}" data-repost="${attr(post.viewer?.repost || '')}" data-like-count="${number.like}" data-repost-count="${number.repost}" data-reply-count="${number.reply}" data-bookmarked="${saved ? '1' : '0'}">
    ${pinned ? `<p class="pinned-label">${icon('pin')} Pinned</p>` : ''}
    ${repostBy ? `<a class="repost-line" href="${profileHash(repostBy)}">${icon('repost')}<span>${escapeHtml(repostBy.displayName || repostBy.handle)} reposted</span></a>` : ''}
    <div class="post-row">
      ${accountIcon(author, '', 'avatar-link')}
      <div class="post-main">
        <div class="post-top">
          <a class="name" href="${profileHash(author)}">${escapeHtml(author.displayName || author.handle || 'User')}${verifiedMark(author)}</a>
          <a class="handle" href="${profileHash(author)}">@${escapeHtml(author.handle || '')}</a>
          <a class="time" href="${postHash(post)}" title="${attr(fullTime(when))}">${escapeHtml(timeAgo(when))}</a>
          ${options.bookmarkRemove ? `<button type="button" class="danger mini" data-act="remove-bookmark" data-uri="${attr(post.uri)}">Remove</button>` : ''}
          <span class="post-tools"><button type="button" class="icon-btn speak" data-act="speak" aria-pressed="false" aria-label="Read aloud">${icon('speaker')}<span class="sr-name" aria-hidden="true">Read aloud</span></button><button type="button" class="icon-btn more" data-act="more" aria-label="More">${icon('more')}<span class="sr-name" aria-hidden="true">More</span></button></span>
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
          ${aiPostAction()}
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

const TREND_CATEGORY = {
  news: 'News',
  politics: 'Politics',
  sports: 'Sports',
  entertainment: 'Entertainment',
  culture: 'Culture',
  'science-tech': 'Science & tech',
  tech: 'Tech',
};

function trendHref(trend) {
  const name = String(trend?.displayName || '').trim();
  return `#/search/${encodeURIComponent(name || 'Bluesky')}`;
}

function trendMeta(trend) {
  const bits = [];
  const count = compact(trend?.postCount);
  if (count) bits.push(`${count} posts`);
  const category = TREND_CATEGORY[trend?.category];
  if (category) bits.push(category);
  if (trend?.status === 'hot') bits.push('Hot');
  return bits.join(' · ');
}

export function trendHtml(trend, options = {}) {
  const name = String(trend?.displayName || '').trim() || 'Trend';
  const blurb = !options.compact && trend?.description
    ? `<span class="trend-desc">${escapeHtml(trend.description)}</span>`
    : '';
  const meta = trendMeta(trend);
  return `<a class="trend" href="${attr(trendHref(trend))}"><span class="section-mark" aria-hidden="true">${icon('search')}</span><span class="trend-copy"><strong>${escapeHtml(name)}</strong>${meta ? `<span class="handle">${escapeHtml(meta)}</span>` : ''}${blurb}</span></a>`;
}

export function trendsHtml(trends, options) {
  return (trends || []).map((trend) => trendHtml(trend, options)).join('');
}

function joinedLine(iso) {
  const date = new Date(iso || '');
  if (Number.isNaN(date.getTime())) return '';
  const label = date.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
  return `<p class="joined">Joined ${escapeHtml(label)}</p>`;
}

export function profileHtml(profile) {
  const banner = safeUrl(profile.banner || '');
  const name = profile.displayName || profile.handle;
  return `<header class="profile">
    <div class="banner">${banner ? `<img src="${attr(banner)}" alt="" onerror="this.remove()">` : ''}</div>
    <div class="profile-row">
      ${avatar(profile.avatar, name, 'xl')}
      <div id="profile-action"></div>
    </div>
    <h2>${escapeHtml(name)}${verifiedMark(profile)}</h2>
    <div class="handle">@${escapeHtml(profile.handle)}</div>
    ${profile.description ? `<p class="bio">${richText(profile.description, profile.descriptionFacets)}</p>` : ''}
    ${joinedLine(profile.createdAt)}
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
  const actions = `${follow}${options.extra || ''}`;
  return `<div class="person">${accountIcon(actor)}<a class="person-link" href="${profileHash(actor)}"><strong>${escapeHtml(name || '')}${verifiedMark(actor)}</strong><span class="handle">@${escapeHtml(actor.handle || '')}</span>${desc ? `<span class="snip">${desc}</span>` : ''}</a>${actions ? `<span class="row-actions">${actions}</span>` : ''}</div>`;
}

const NOTE_VERB = {
  like: 'liked your post',
  repost: 'reposted your post',
  follow: 'followed you',
  reply: 'replied to you',
  quote: 'quoted your post',
  mention: 'mentioned you',
  'like-via-repost': 'liked a post you reposted',
  'repost-via-repost': 'reposted a post you reposted',
  'starterpack-joined': 'joined via your starter pack',
};

function groupKey(note) {
  const reason = note?.reason || '';
  if (reason === 'follow' || reason === 'starterpack-joined') return reason;
  if (reason === 'like' || reason === 'repost' || reason === 'like-via-repost' || reason === 'repost-via-repost') {
    return note.reasonSubject ? `${reason}:${note.reasonSubject}` : '';
  }
  return '';
}

export function groupNotifications(notes) {
  const groups = [];
  const index = new Map();
  (notes || []).forEach((note) => {
    const key = groupKey(note);
    if (key && index.has(key)) {
      groups[index.get(key)].push(note);
      return;
    }
    if (key) index.set(key, groups.length);
    groups.push([note]);
  });
  return groups;
}

function personLink(actor) {
  const name = actor?.displayName || actor?.handle || 'Someone';
  return `<a href="${profileHash(actor)}">${escapeHtml(name)}</a>`;
}

function peopleLabel(authors) {
  const names = (authors || []).filter((actor) => actor && (actor.did || actor.handle));
  const linked = names.map((actor) => `<strong>${personLink(actor)}</strong>`);
  if (linked.length <= 1) return linked[0] || '<strong>Someone</strong>';
  if (linked.length === 2) return `${linked[0]} and ${linked[1]}`;
  if (linked.length === 3) return `${linked[0]}, ${linked[1]}, and ${linked[2]}`;
  const rest = linked.slice(2).join(', ');
  return `${linked[0]}, ${linked[1]}, <button type="button" class="text-btn inline" data-act="expand-names">and ${names.length - 2} others</button><span class="more-names" hidden>${rest}</span>`;
}

function avatarStack(authors) {
  return `<span class="avatar-stack">${authors.slice(0, 8).map((actor) => accountIcon(actor, 'sm')).join('')}</span>`;
}

function noteGlyph(reason) {
  if (reason === 'like' || reason === 'like-via-repost') return 'heart';
  if (reason === 'repost' || reason === 'quote' || reason === 'repost-via-repost') return 'repost';
  if (reason === 'follow' || reason === 'starterpack-joined') return 'user';
  return 'reply';
}

export function notificationHtml(note, subject) {
  return notificationGroupHtml([note], subject ? new Map([[note.reasonSubject, subject]]) : new Map());
}

function textRecord(record) {
  if (typeof record?.text !== 'string' || !record.text.trim()) return null;
  return record;
}

function spokenRecord(note, subjects) {
  const own = textRecord(note?.record) || textRecord(subjects?.get?.(note?.uri)?.record);
  if (own) return own;
  if (note?.record?.embed || subjects?.get?.(note?.uri)?.record?.embed) return { text: 'Sent an attachment', facets: [] };
  return null;
}

function pushShot(found, shot) {
  found.total += 1;
  if (found.shots.length < 4) found.shots.push(shot);
}

function collectMedia(embed, found, depth) {
  if (!embed || depth > 3 || found.shots.length || found.link) return;
  const type = String(embed.$type || '');
  if (type.endsWith('images#view')) {
    (embed.images || []).forEach((image) => {
      const thumb = safeUrl(image?.thumb || image?.fullsize || '');
      if (thumb) pushShot(found, { thumb, alt: image.alt || '', kind: 'image' });
    });
    return;
  }
  if (type.endsWith('gallery#view')) {
    (embed.items || []).forEach((item) => {
      const thumb = safeUrl(item?.thumbnail || item?.thumb || item?.fullsize || '');
      if (thumb) pushShot(found, { thumb, alt: item?.alt || '', kind: 'image' });
    });
    return;
  }
  if (type.endsWith('video#view')) {
    pushShot(found, { thumb: safeUrl(embed.thumbnail || ''), alt: embed.alt || 'Video', kind: 'video' });
    return;
  }
  if (type.endsWith('external#view')) {
    const external = embed.external || {};
    const href = safeUrl(external.uri || '');
    if (!href) return;
    if (gifHost(href)) {
      const thumb = safeUrl(external.thumb || '') || (/\.gif$/i.test(href) ? href : '');
      pushShot(found, { thumb, alt: external.title || 'GIF', kind: 'gif' });
      return;
    }
    found.link = {
      href,
      thumb: safeUrl(external.thumb || ''),
      title: String(external.title || href),
      host: hostOf(href),
    };
    return;
  }
  if (type.endsWith('recordWithMedia#view')) {
    collectMedia(embed.media, found, depth + 1);
    if (!found.shots.length && !found.link) collectMedia(embed.record, found, depth + 1);
    return;
  }
  if (type.endsWith('record#view') || type.endsWith('viewRecord')) {
    const record = embed.record || embed;
    (record.embeds || []).forEach((child) => collectMedia(child, found, depth + 1));
  }
}

function noteMediaHtml(post) {
  const found = { shots: [], link: null, total: 0 };
  collectMedia(post?.embed, found, 0);
  if (!found.shots.length && !found.link) return '';
  const shown = found.shots;
  const extra = found.total - shown.length;
  const shots = shown.map((shot, index) => {
    const play = shot.kind === 'video' || shot.kind === 'gif';
    const more = extra && index === shown.length - 1 ? `<span class="note-more">+${extra}</span>` : '';
    const badge = shot.kind === 'gif' && !more ? '<span class="note-badge">GIF</span>' : '';
    const img = shot.thumb ? `<img src="${attr(shot.thumb)}" alt="${attr(shot.alt || '')}">` : '';
    return `<span class="note-shot${play ? ' is-play' : ''}">${img}${badge}${more}</span>`;
  }).join('');
  const strip = shots ? `<span class="note-shots">${shots}</span>` : '';
  let link = '';
  if (found.link && !found.shots.length) {
    const item = found.link;
    const thumb = item.thumb
      ? `<img src="${attr(item.thumb)}" alt="">`
      : `<span class="note-link-mark">${icon('link')}</span>`;
    link = `<a class="note-link" href="${attr(item.href)}" target="_blank" rel="noopener noreferrer">${thumb}<span class="note-link-copy"><span class="domain">${escapeHtml(item.host)}</span><strong>${escapeHtml(item.title)}</strong></span></a>`;
  }
  return `<span class="note-media">${strip}${link}</span>`;
}

export function notificationSubjects(notes) {
  const uris = [];
  const push = (uri) => {
    if (uri && !uris.includes(uri)) uris.push(uri);
  };
  (notes || []).forEach((note) => {
    const reason = note?.reason;
    const spoken = reason === 'reply' || reason === 'mention' || reason === 'quote';
    const text = typeof note?.record?.text === 'string' && note.record.text.trim();
    if (spoken && (!text || note?.record?.embed)) push(note.uri);
    push(note.reasonSubject);
  });
  return uris;
}

function notificationGroupHtml(group, subjects) {
  const first = group[0] || {};
  const reason = first.reason || '';
  const authors = group.map((note) => note.author || {});
  const subject = subjects?.get?.(first.reasonSubject);
  const verb = NOTE_VERB[reason] || reason || 'interacted';
  const spoken = reason === 'reply' || reason === 'mention' || reason === 'quote';
  const said = spoken ? spokenRecord(first, subjects) : null;
  const saidText = said?.text?.trim() || '';
  const subjectText = typeof subject?.record?.text === 'string' ? subject.record.text.trim() : '';
  const replyHref = spoken && first.uri ? postHash({ uri: first.uri, author: first.author }) : '';
  const subjectHref = subject ? postHash(subject) : '';
  const profileHref = first.author?.handle || first.author?.did ? profileHash(first.author) : '';
  const href = reason === 'follow' || reason === 'starterpack-joined' ? profileHref : (replyHref || subjectHref);
  const verbHtml = href ? `<a class="verb" href="${href}">${escapeHtml(verb)}</a>` : escapeHtml(verb);
  const saidHtml = saidText ? `<span class="said">${richText(said.text, said.facets)}</span>` : '';
  const showContext = Boolean(subjectText) && subjectText !== saidText;
  const kicker = spoken && saidText && showContext ? (reason === 'mention' ? 'Related post' : 'Your post') : '';
  const context = showContext
    ? `${kicker ? `<span class="note-kicker">${kicker}</span>` : ''}<span class="snip">${richText(subject.record.text, subject.record.facets)}</span>`
    : '';
  const snippet = context ? `<span class="note-context">${context}</span>` : '';
  const mediaPost = spoken ? subjects?.get?.(first.uri) : subject;
  const media = noteMediaHtml(mediaPost);
  const unread = group.some((note) => !note.isRead);
  const open = href ? ` data-href="${attr(href)}" tabindex="0"` : '';
  return `<article class="note${unread ? ' unread' : ''} ${attr(reason)}"${open}><span class="note-icon">${icon(noteGlyph(reason))}</span><span class="note-body">${avatarStack(authors)}<span class="note-line">${peopleLabel(authors)} ${verbHtml} <span class="time">${escapeHtml(timeAgo(first.indexedAt))}</span></span>${saidHtml}${spoken ? media : ''}${snippet}${spoken ? '' : media}</span></article>`;
}

export function speechText(post) {
  if (!post) return '';
  const bits = [];
  const name = post.author?.displayName || post.author?.handle || '';
  if (name) bits.push(name);
  const text = String(post.record?.text || '').trim();
  if (text) bits.push(text);
  const alts = [];
  const quotes = [];
  const walk = (embed) => {
    if (!embed || typeof embed !== 'object') return;
    const type = String(embed.$type || '');
    if (type.endsWith('images#view')) {
      (embed.images || []).forEach((image) => {
        const alt = String(image?.alt || '').trim();
        alts.push(alt ? `Image. ${alt}` : 'Image.');
      });
      return;
    }
    if (type.endsWith('video#view')) {
      const alt = String(embed.alt || '').trim();
      alts.push(alt ? `Video. ${alt}` : 'Video.');
      return;
    }
    if (type.endsWith('external#view')) {
      const line = [embed.external?.title, embed.external?.description].map((part) => String(part || '').trim()).filter(Boolean).join('. ');
      if (line) alts.push(`Link. ${line}`);
      return;
    }
    if (type.endsWith('recordWithMedia#view')) {
      walk(embed.media);
      walk(embed.record);
      return;
    }
    if (type.endsWith('record#view') || type.endsWith('viewRecord')) {
      const record = embed.record || embed;
      const value = record.value || record.record || {};
      const quote = String(value.text || '').trim();
      if (quote) quotes.push(quote);
      (record.embeds || []).forEach(walk);
      if (value.embed) walk(value.embed);
    }
  };
  walk(post.embed);
  if (quotes.length) bits.push(`Quote. ${quotes.join('. ')}`);
  if (alts.length) bits.push(alts.join('. '));
  return bits.join('. ');
}

export function notificationsHtml(notes, subjects) {
  return groupNotifications(notes).map((group) => notificationGroupHtml(group, subjects)).join('');
}

function messagePreview(message) {
  if (!message) return 'No messages yet';
  const type = message.$type || '';
  if (type.endsWith('deletedMessageView')) return 'Message deleted';
  const call = parseCallMessage(message.text);
  if (call?.kind === 'offer') return call.media === 'video' ? 'Started a video call' : 'Started a voice call';
  if (call?.kind === 'answer') return call.media === 'video' ? 'Joined the video call' : 'Joined the voice call';
  if (call?.kind === 'decline') return 'Declined the call';
  if (call?.kind === 'end') return 'Call ended';
  if (call?.kind === 'data') return 'Call';
  if (message.text) return message.text;
  if (message.embed) return 'Sent a post';
  return 'Message';
}

export function convoHtml(convo, me, options = {}) {
  const other = (convo.members || []).find((member) => member.did !== me) || convo.members?.[0] || {};
  const gone = accountGone(other);
  const text = messagePreview(convo.lastMessage);
  const name = gone ? 'Deleted account' : (other.displayName || other.handle || 'Conversation');
  const unread = convoUnread(convo, me);
  const pill = unread ? `<b class="pill">${unread}</b>` : '';
  const request = options.request
    ? `<button type="button" class="primary mini" data-act="accept-convo" data-convo="${attr(convo.id)}">Accept</button><button type="button" class="danger mini" data-act="decline-convo" data-convo="${attr(convo.id)}">Delete</button>`
    : '';
  const remove = gone
    ? `<button type="button" class="danger mini" data-act="leave-convo" data-convo="${attr(convo.id)}">Remove</button>`
    : '';
  return `<div class="person convo${gone ? ' gone' : ''}${unread ? ' unread' : ''}">${avatar(other.avatar, name)}<a class="person-link" href="#/messages/${encodeURIComponent(convo.id)}"><strong>${escapeHtml(name)}</strong><span class="handle">${escapeHtml(text).slice(0, 140)}</span></a><span class="row-actions">${pill}${request || remove}</span></div>`;
}

export function requestEntryHtml(count) {
  const n = Number(count) || 0;
  const detail = n === 1 ? '1 person waiting' : (n ? `${n} people waiting` : 'People you have not accepted');
  return `<a class="person request-entry" href="#/messages/requests"><span class="avatar" data-initial="R"></span><span class="person-link"><strong>Message requests</strong><span class="handle">${escapeHtml(detail)}</span></span></a>`;
}

function callLine(parsed) {
  if (parsed.kind === 'offer') return parsed.media === 'video' ? 'Started a video call' : 'Started a voice call';
  if (parsed.kind === 'answer') return parsed.media === 'video' ? 'Joined the video call' : 'Joined the voice call';
  if (parsed.kind === 'decline') return 'Declined the call';
  return 'Call ended';
}

export function messageHtml(message, me, options = {}) {
  const type = message?.$type || '';
  if (type.endsWith('deletedMessageView')) return '<div class="bubble deleted">Message deleted</div>';
  const sender = messageSender(message);
  const mine = Boolean(sender && sender === me);
  const text = message?.text || '';
  const call = parseCallMessage(text);
  const id = message?.id ? ` data-id="${attr(message.id)}"` : '';
  if (call?.kind === 'data') return `<div class="msg-signal"${id} hidden></div>`;
  if (call) {
    const video = call.media === 'video';
    const live = Boolean(!mine && options.liveRkey && call.kind === 'offer' && call.rkey && call.rkey === options.liveRkey);
    const tone = video ? ' video' : (call.media === 'audio' ? ' audio' : '');
    const actions = live
      ? `<span class="call-actions"><button type="button" class="primary small" data-act="call-accept" data-rkey="${attr(call.rkey)}" data-media="${attr(call.media || 'audio')}" data-convo="${attr(options.convoId || '')}" data-peer="${attr(options.peerDid || sender || '')}">Accept</button><button type="button" class="danger mini" data-act="call-decline" data-rkey="${attr(call.rkey)}" data-convo="${attr(options.convoId || '')}">Decline</button></span>`
      : '';
    return `<div class="msg-header${tone}"${id}>${icon(video ? 'video' : 'phone')}<span>${escapeHtml(callLine(call))}</span>${actions}</div>`;
  }
  const embed = message?.embed ? embedHtml(message.embed) : '';
  if (!text && !embed) return '';
  const fresh = !mine && options.fresh ? ' fresh' : '';
  return `<div class="bubble${mine ? ' mine' : ''}${fresh}"${id}>${text ? `<p>${richText(text, message?.facets)}</p>` : ''}${embed}</div>`;
}

export function assistantHtml(text, { id = '', kicker = 'Your account', actions = false } = {}) {
  const marker = id ? ` data-ai="${attr(id)}"` : '';
  const buttons = actions
    ? `<div class="ai-actions"><button type="button" class="primary small" data-act="send-ai" data-ai="${attr(id)}">Send</button><button type="button" class="text-btn mini" data-act="insert-ai" data-ai="${attr(id)}">Edit</button><button type="button" class="text-btn mini" data-act="dismiss-ai" data-ai="${attr(id)}">Dismiss</button></div>`
    : '';
  return `<div class="bubble assistant"${marker}><span class="ai-kicker">${escapeHtml(kicker)}</span><p>${richText(text)}</p>${buttons}</div>`;
}

function callButton(act, label, glyph, peer) {
  return `<button type="button" class="call-btn" data-act="${act}" data-peer="${attr(peer || '')}" data-tip="${attr(label)}" aria-label="${attr(label)}">${icon(glyph)}<span>${escapeHtml(label.replace(/ call$/, ''))}</span></button>`;
}

function deletedAccount(actor) {
  const handle = String(actor?.handle || '').trim().toLowerCase();
  const name = String(actor?.displayName || '').trim().toLowerCase();
  if (handle === 'invalid.handle' || handle === 'handle.invalid' || handle.endsWith('.invalid')) return true;
  if (name === 'account deleted' || name === 'deleted account') return true;
  return false;
}

export function callToolsHtml(peer) {
  if (!peer) return '';
  return `<span class="call-pair">${callButton('call-audio', 'Voice call', 'phone', peer)}${callButton('call-video', 'Video call', 'video', peer)}</span>`;
}

export function callStartHtml() {
  const button = (media, label, glyph) => `<button class="call-btn" type="submit" data-media="${media}" data-tip="${label} call" aria-label="${label} call">${icon(glyph)}<span>${label}</span></button>`;
  return `<form id="call-start" class="call-start"><input id="call-handle" placeholder="Call any handle" autocomplete="off" spellcheck="false" autocapitalize="off"><span class="call-pair">${button('audio', 'Voice', 'phone')}${button('video', 'Video', 'video')}</span></form>`;
}

export function callConvoHtml(convo, me) {
  const other = (convo.members || []).find((member) => member.did !== me) || convo.members?.[0] || {};
  const gone = accountGone(other);
  const name = gone ? 'Deleted account' : (other.displayName || other.handle || 'Conversation');
  const text = gone ? 'This account was deleted' : messagePreview(convo.lastMessage);
  const unread = convoUnread(convo, me);
  const pill = unread ? `<b class="pill">${unread}</b>` : '';
  const tools = !gone && other.did ? callToolsHtml(other.did) : '';
  const href = convo.id ? `#/messages/${encodeURIComponent(convo.id)}` : '#/messages';
  return `<div class="person call-row${gone ? ' gone' : ''}${unread ? ' unread' : ''}">${avatar(other.avatar, name)}<a class="person-link" href="${href}"><strong>${escapeHtml(name)}</strong><span class="handle">${escapeHtml(String(text).slice(0, 140))}</span></a><span class="row-actions">${pill}${tools}</span></div>`;
}

export function chatHeaderHtml(actor) {
  if (!actor) return '';
  const gone = deletedAccount(actor);
  const name = gone ? 'Deleted account' : (actor.displayName || actor.handle || 'Chat');
  const handle = gone ? 'This account was deleted' : (actor.handle ? `@${actor.handle}` : '');
  const tools = !gone && actor.did ? `<span class="chat-tools">${callToolsHtml(actor.did)}</span>` : '';
  return `<div class="chat-head" data-peer="${attr(actor.did || '')}">${accountIcon(actor)}<a class="chat-with" href="${profileHash(actor)}"><span><strong>${escapeHtml(name)}</strong><span class="handle">${escapeHtml(handle)}</span></span></a>${tools}</div>`;
}

export function hoverCardHtml(profile, self = '') {
  const name = profile?.displayName || profile?.handle || 'Account';
  const banner = safeUrl(profile?.banner || '');
  const following = profile?.viewer?.following || '';
  const mine = Boolean(profile?.did && self && profile.did === self);
  const follow = !mine && profile?.did
    ? `<button type="button" class="follow${following ? ' on' : ''}" data-act="follow" data-did="${attr(profile.did)}" data-following="${attr(following)}">${following ? 'Following' : 'Follow'}</button>`
    : '';
  const bio = profile?.description ? `<p class="bio">${richText(profile.description, profile.descriptionFacets)}</p>` : '';
  return `<div class="hover-banner">${banner ? `<img src="${attr(banner)}" alt="" onerror="this.remove()">` : ''}</div><div class="hover-body"><div class="hover-top">${avatar(profile?.avatar, name, 'xl')}${follow}</div><a class="hover-name" href="${profileHash(profile)}"><strong>${escapeHtml(name)}${verifiedMark(profile || {})}</strong></a><div class="handle">@${escapeHtml(profile?.handle || '')}</div>${bio}<p class="counts"><span><strong>${fullCount(profile?.followsCount)}</strong> following</span><span><strong>${fullCount(profile?.followersCount)}</strong> followers</span></p></div>`;
}

export function packHtml(pack) {
  const record = pack?.record || {};
  const creator = pack?.creator || {};
  const name = record.name || 'Starter pack';
  const count = pack?.list?.listItemCount;
  const href = `#/pack/${encodeURIComponent(pack?.uri || '')}`;
  const by = creator.handle ? `by @${creator.handle}` : 'Starter pack';
  const meta = [by, count != null ? `${fullCount(count)} people` : ''].filter(Boolean).join(' · ');
  return `<a class="pack" href="${href}">${avatar(creator.avatar, creator.displayName || creator.handle, 'sm')}<span><strong>${escapeHtml(name)}</strong><span class="handle">${escapeHtml(meta)}</span>${record.description ? `<span class="snip">${escapeHtml(record.description)}</span>` : ''}</span></a>`;
}

export function callRequestHtml(offer) {
  const video = offer?.media === 'video';
  const name = offer?.name || 'Someone';
  const label = video ? 'Video call request' : 'Voice call request';
  return `<div class="person call-row request-row">${avatar(offer?.avatar, name)}<span class="person-link"><strong>${escapeHtml(name)}</strong><span class="handle">${label}</span></span><span class="row-actions"><button type="button" class="primary mini" data-act="call-accept" data-rkey="${attr(offer?.rkey || '')}" data-media="${attr(offer?.media || 'audio')}" data-convo="${attr(offer?.convoId || '')}" data-peer="${attr(offer?.peerDid || '')}">Accept</button><button type="button" class="danger mini" data-act="call-decline" data-rkey="${attr(offer?.rkey || '')}" data-convo="${attr(offer?.convoId || '')}">Decline</button></span></div>`;
}

export function callBannerHtml(offer, extra = {}) {
  const video = offer?.media === 'video';
  const label = video ? 'Incoming video call' : 'Incoming voice call';
  const rkey = attr(offer?.rkey || '');
  const media = attr(offer?.media || 'audio');
  const convo = attr(extra.convoId || '');
  const peer = attr(extra.peerDid || '');
  return `<div class="call-banner${video ? ' video' : ' audio'}" role="status">${icon(video ? 'video' : 'phone')}<span>${label}</span><button type="button" class="primary small" data-act="call-accept" data-rkey="${rkey}" data-media="${media}" data-convo="${convo}" data-peer="${peer}">Accept</button><button type="button" class="danger mini" data-act="call-decline" data-rkey="${rkey}" data-convo="${convo}">Decline</button></div>`;
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
