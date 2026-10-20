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

function featureHtml(slice, features, links, breaks) {
  const html = textHtml(slice, breaks);
  const mention = features.find((feature) => feature.$type === 'app.bsky.richtext.facet#mention');
  const tag = features.find((feature) => feature.$type === 'app.bsky.richtext.facet#tag');
  const link = features.find((feature) => feature.$type === 'app.bsky.richtext.facet#link');
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
  const mentionRe = /(^|\s)@([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;
  match = mentionRe.exec(source);
  while (match) {
    const handle = match[2];
    const at = match.index + match[1].length;
    const start = byteAt(source, at);
    take(start, start + encoder.encode(`@${handle}`).length, [{ $type: 'app.bsky.richtext.facet#mention', did: handle }]);
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
      features: facet?.features || [],
    }))
    .filter((mark) => mark.end > mark.start && mark.start >= 0 && mark.end <= bytes.length);
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
