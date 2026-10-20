export function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (ch) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  }[ch]));
}

export function safeUrl(value) {
  try {
    const url = new URL(String(value));
    if (url.protocol === 'https:' || url.protocol === 'http:') return url.href;
  } catch {
    /* not a url */
  }
  return '';
}

export function graphemeLength(text) {
  const value = String(text ?? '');
  if (typeof Intl !== 'undefined' && Intl.Segmenter) {
    let count = 0;
    for (const _ of new Intl.Segmenter().segment(value)) count += 1;
    return count;
  }
  return [...value].length;
}

export function compact(number) {
  const n = Number(number) || 0;
  if (n < 1) return '';
  if (n < 1000) return String(n);
  if (n < 10000) return `${(n / 1000).toFixed(1).replace(/\.0$/, '')}K`;
  if (n < 1000000) return `${Math.round(n / 1000)}K`;
  return `${(n / 1000000).toFixed(1).replace(/\.0$/, '')}M`;
}

export function fullCount(number) {
  return new Intl.NumberFormat().format(Number(number) || 0);
}

export function timeAgo(iso) {
  const then = new Date(iso).getTime();
  if (!Number.isFinite(then)) return '';
  const seconds = Math.max(0, (Date.now() - then) / 1000);
  if (seconds < 60) return 'now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
  if (seconds < 7 * 86400) return `${Math.floor(seconds / 86400)}d`;
  const date = new Date(then);
  const sameYear = date.getFullYear() === new Date().getFullYear();
  return date.toLocaleDateString(undefined, sameYear
    ? { month: 'short', day: 'numeric' }
    : { month: 'short', day: 'numeric', year: 'numeric' });
}

export function fullTime(iso) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleString();
}

export function parseHash() {
  const raw = (location.hash || '#').replace(/^#/, '');
  const path = raw.startsWith('/') ? raw : `/${raw}`;
  return path.split('/').filter(Boolean).map((part) => {
    try { return decodeURIComponent(part); } catch { return part; }
  });
}

export function profileHash(actor) {
  const id = typeof actor === 'string' ? actor : (actor?.handle || actor?.did || '');
  return `#/profile/${encodeURIComponent(id)}`;
}

export function postHash(post) {
  const uri = post?.uri || '';
  const rkey = uri.split('/').pop();
  const actor = post?.author?.handle || post?.author?.did || 'post';
  return `#/profile/${encodeURIComponent(actor)}/post/${encodeURIComponent(rkey)}`;
}

export function hostOf(url) {
  try { return new URL(url).host.replace(/^www\./, ''); } catch { return ''; }
}

const encoder = new TextEncoder();
const decoder = new TextDecoder();

function textHtml(value, breaks) {
  const html = escapeHtml(value);
  return breaks === false ? html : html.replace(/\n/g, '<br>');
}

function facetKind(feature) {
  const type = String(feature?.$type || '');
  if (type.endsWith('#mention')) return 'mention';
  if (type.endsWith('#tag')) return 'tag';
  if (type.endsWith('#link')) return 'link';
  return '';
}

function featureHtml(slice, features, links, breaks) {
  const html = textHtml(slice, breaks);
  const mention = features.find((feature) => facetKind(feature) === 'mention');
  const tag = features.find((feature) => facetKind(feature) === 'tag');
  const link = features.find((feature) => facetKind(feature) === 'link');
  const wrap = (className, href, external) => {
    if (!links) return `<span class="facet ${className}">${html}</span>`;
    if (!href) return html;
    const extra = external ? ' target="_blank" rel="noopener noreferrer"' : '';
    return `<a class="facet ${className}" href="${escapeHtml(href)}"${extra}>${html}</a>`;
  };
  if (mention?.did) return wrap('mention', profileHash(mention.did), false);
  if (tag?.tag) return wrap('tag', `#/search/${encodeURIComponent(`#${tag.tag}`)}`, false);
  const href = link?.uri ? safeUrl(link.uri) : '';
  if (href) return wrap('link', href, true);
  return html;
}

function byteAt(source, index) {
  return encoder.encode(source.slice(0, index)).length;
}

function overlaps(marks, start, end) {
  return marks.some((mark) => mark.start < end && start < mark.end);
}

function syntheticMarks(source) {
  const marks = [];
  const take = (start, end, features) => {
    if (end <= start || overlaps(marks, start, end)) return;
    marks.push({ start, end, features });
  };
  const linkRe = /https?:\/\/[^\s<>"']+/g;
  let match = linkRe.exec(source);
  while (match) {
    const raw = match[0].replace(/[),.!?:;]+$/g, '').replace(/[)\]}>'"]+$/g, '');
    const start = byteAt(source, match.index);
    take(start, start + encoder.encode(raw).length, [{ $type: 'app.bsky.richtext.facet#link', uri: raw }]);
    match = linkRe.exec(source);
  }
  const mentionRe = /(^|\s)@([A-Za-z0-9](?:[A-Za-z0-9._-]{0,80}))/g;
  match = mentionRe.exec(source);
  while (match) {
    const handle = match[2].replace(/[._-]+$/g, '');
    if (handle) {
      const at = match.index + match[1].length;
      const start = byteAt(source, at);
      take(start, start + encoder.encode(`@${handle}`).length, [{ $type: 'app.bsky.richtext.facet#mention', did: handle }]);
    }
    match = mentionRe.exec(source);
  }
  const tagRe = /(^|\s)#([\p{L}\p{N}_]{1,64})/gu;
  match = tagRe.exec(source);
  while (match) {
    const tag = match[2];
    const at = match.index + match[1].length;
    const start = byteAt(source, at);
    take(start, start + encoder.encode(`#${tag}`).length, [{ $type: 'app.bsky.richtext.facet#tag', tag }]);
    match = tagRe.exec(source);
  }
  return marks;
}

export function richText(text, facets, options = {}) {
  const source = String(text ?? '');
  if (!source) return '';
  const links = options.links !== false;
  const breaks = options.breaks !== false;
  const bytes = encoder.encode(source);
  const marks = (facets || [])
    .map((facet) => ({
      start: facet?.index?.byteStart ?? 0,
      end: facet?.index?.byteEnd ?? 0,
      features: (facet?.features || []).filter((feature) => facetKind(feature)),
    }))
    .filter((mark) => mark.features.length && mark.end > mark.start && mark.start >= 0 && mark.end <= bytes.length);
  for (const mark of syntheticMarks(source)) {
    if (!overlaps(marks, mark.start, mark.end) && mark.end <= bytes.length) marks.push(mark);
  }
  marks.sort((a, b) => a.start - b.start);
  let html = '';
  let cursor = 0;
  for (const mark of marks) {
    if (mark.start < cursor) continue;
    html += textHtml(decoder.decode(bytes.slice(cursor, mark.start)), breaks);
    html += featureHtml(decoder.decode(bytes.slice(mark.start, mark.end)), mark.features, links, breaks);
    cursor = mark.end;
  }
  html += textHtml(decoder.decode(bytes.slice(cursor)), breaks);
  return html;
}

export function caretToken(text, caret) {
  const source = String(text || '');
  const at = Math.max(0, Math.min(source.length, Number(caret) || 0));
  const match = source.slice(0, at).match(/(^|\s)([@#])([^\s@#]*)$/);
  if (!match) return null;
  return { sigil: match[2], query: match[3], start: at - match[3].length - 1 };
}

export function messageSender(message) {
  if (!message || typeof message !== 'object') return '';
  if (typeof message.sender === 'string') return message.sender;
  return message.sender?.did || '';
}

export function convoUnread(convo, me) {
  const count = Number(convo?.unreadCount) || 0;
  if (count < 1 || convo?.muted) return 0;
  const sender = messageSender(convo?.lastMessage);
  if (sender && me && sender === me) return 0;
  return count;
}

export function ownUnread(convo, me) {
  const count = Number(convo?.unreadCount) || 0;
  if (count < 1 || convo?.muted) return false;
  const sender = messageSender(convo?.lastMessage);
  return Boolean(sender && me && sender === me);
}

const CALL_RKEY = /^[234567abcdefghijklmnopqrstuvwxyz]{13}$/;

export function parseCallMessage(text) {
  const raw = String(text || '').trim();
  let kind = '';
  let media = '';
  if (/^Started a voice call\b/.test(raw)) { kind = 'offer'; media = 'audio'; }
  else if (/^Started a video call\b/.test(raw)) { kind = 'offer'; media = 'video'; }
  else if (/^Joined the voice call\b/.test(raw)) { kind = 'answer'; media = 'audio'; }
  else if (/^Joined the video call\b/.test(raw)) { kind = 'answer'; media = 'video'; }
  else if (/^Declined the call\b/.test(raw)) kind = 'decline';
  else if (/^Call ended\b/.test(raw)) kind = 'end';
  else {
    const data = raw.match(/^Call data ([234567abcdefghijklmnopqrstuvwxyz]{13}) (\d+)\/(\d+) ([A-Za-z0-9_-]+)$/);
    if (!data) return null;
    return {
      kind: 'data',
      media: '',
      rkey: data[1],
      index: Number(data[2]),
      total: Number(data[3]),
      chunk: data[4],
    };
  }
  const link = raw.match(/https?:\/\/\S+/)?.[0] || '';
  let rkey = '';
  try {
    const parts = new URL(link).hash.replace(/^#/, '').split('/').filter(Boolean);
    const index = parts.indexOf('c');
    const candidate = index >= 0 ? decodeURIComponent(parts[index + 1] || '') : '';
    if (CALL_RKEY.test(candidate)) rkey = candidate;
  } catch {
    rkey = '';
  }
  return { kind, media, rkey };
}

export function assembleCallSdp(messages, rkey, sender) {
  const parts = new Map();
  let total = 0;
  for (const message of messages || []) {
    if (sender && messageSender(message) !== sender) continue;
    const parsed = parseCallMessage(message?.text);
    if (parsed?.kind !== 'data' || parsed.rkey !== rkey || !parsed.chunk) continue;
    parts.set(parsed.index, parsed.chunk);
    total = parsed.total || total;
  }
  if (!total || parts.size < total) return '';
  let packed = '';
  for (let index = 1; index <= total; index += 1) {
    if (!parts.has(index)) return '';
    packed += parts.get(index);
  }
  try {
    const normalized = packed.replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized + '='.repeat((4 - (normalized.length % 4)) % 4);
    const binary = atob(padded);
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    return new TextDecoder().decode(bytes);
  } catch {
    return '';
  }
}

export function firstUrl(text) {
  const match = String(text ?? '').match(/https?:\/\/[^\s<>"']+/);
  if (!match) return '';
  return match[0].replace(/[),.!?:;]+$/g, '').replace(/[)\]}>'"]+$/g, '');
}

export function bskyPostParts(value) {
  try {
    const url = new URL(value);
    const host = url.hostname.replace(/^www\./, '');
    if (!['bsky.app', 'staging.bsky.app', 'main.bsky.dev'].includes(host)) return null;
    const parts = url.pathname.split('/').filter(Boolean);
    if (parts.length < 4 || parts[0] !== 'profile' || parts[2] !== 'post') return null;
    return { actor: decodeURIComponent(parts[1]), rkey: decodeURIComponent(parts[3]) };
  } catch {
    return null;
  }
}

export function xStatusParts(value) {
  try {
    const url = new URL(value);
    const host = url.hostname.replace(/^www\./, '');
    if (!['x.com', 'twitter.com', 'mobile.twitter.com', 'mobile.x.com', 'fxtwitter.com', 'vxtwitter.com', 'fixupx.com'].includes(host)) return null;
    const parts = url.pathname.split('/').filter(Boolean);
    const index = parts.lastIndexOf('status');
    if (index < 0 || !parts[index + 1]) return null;
    const id = parts[index + 1].replace(/\D.*$/, '');
    if (!id) return null;
    return { user: index > 0 ? parts[index - 1] : '', id };
  } catch {
    return null;
  }
}

export function rkeyOf(uri) {
  return String(uri || '').split('/').pop();
}

export function accountGone(actor) {
  if (!actor || typeof actor !== 'object') return false;
  const handle = String(actor.handle || '').trim().toLowerCase();
  const name = String(actor.displayName || '').trim().toLowerCase();
  if (handle === 'invalid.handle' || handle === 'handle.invalid' || handle.endsWith('.invalid')) return true;
  if (name === 'account deleted' || name === 'deleted account') return true;
  if (actor.did && !handle) return true;
  return false;
}

export function splitAtUri(uri) {
  const raw = String(uri || '').replace(/^at:\/\//, '');
  const first = raw.indexOf('/');
  const last = raw.lastIndexOf('/');
  if (first < 0 || last <= first) return null;
  return {
    repo: raw.slice(0, first),
    collection: raw.slice(first + 1, last),
    rkey: raw.slice(last + 1),
  };
}
