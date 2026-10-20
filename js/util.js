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

function textHtml(value) {
  return escapeHtml(value).replace(/\n/g, '<br>');
}

function featureHtml(slice, features) {
  const html = textHtml(slice);
  const mention = features.find((feature) => feature.$type === 'app.bsky.richtext.facet#mention');
  const tag = features.find((feature) => feature.$type === 'app.bsky.richtext.facet#tag');
  const link = features.find((feature) => feature.$type === 'app.bsky.richtext.facet#link');
  if (mention?.did) return `<a class="facet" href="${profileHash(mention.did)}">${html}</a>`;
  if (tag?.tag) return `<a class="facet" href="#/search/${encodeURIComponent(`#${tag.tag}`)}">${html}</a>`;
  const href = link?.uri ? safeUrl(link.uri) : '';
  if (href) return `<a class="facet" href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer">${html}</a>`;
  return html;
}

export function richText(text, facets) {
  const source = String(text ?? '');
  if (!source) return '';
  const bytes = encoder.encode(source);
  const marks = (facets || [])
    .map((facet) => ({
      start: facet?.index?.byteStart ?? 0,
      end: facet?.index?.byteEnd ?? 0,
      features: facet?.features || [],
    }))
    .filter((mark) => mark.end > mark.start && mark.start >= 0 && mark.end <= bytes.length)
    .sort((a, b) => a.start - b.start);
  let html = '';
  let cursor = 0;
  for (const mark of marks) {
    if (mark.start < cursor) continue;
    html += textHtml(decoder.decode(bytes.slice(cursor, mark.start)));
    html += featureHtml(decoder.decode(bytes.slice(mark.start, mark.end)), mark.features);
    cursor = mark.end;
  }
  html += textHtml(decoder.decode(bytes.slice(cursor)));
  return html;
}

export function firstUrl(text) {
  const match = String(text ?? '').match(/https?:\/\/[^\s]+/);
  if (!match) return '';
  return match[0].replace(/[),.]+$/, '');
}

export function rkeyOf(uri) {
  return String(uri || '').split('/').pop();
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
