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

function textHtml(value, breaks, typos) {
  let html = '';
  if (!typos || !typos.size) html = escapeHtml(value);
  else {
    const re = /[A-Za-z\u00C0-\u024F](?:[A-Za-z\u00C0-\u024F]|['’\-]){2,40}/g;
    let last = 0;
    let match = re.exec(value);
    while (match) {
      html += escapeHtml(value.slice(last, match.index));
      const word = match[0];
      const body = escapeHtml(word);
      const key = word.toLowerCase().replace(/’/g, "'");
      html += typos.has(key) ? `<span class="typo">${body}</span>` : body;
      last = match.index + word.length;
      match = re.exec(value);
    }
    html += escapeHtml(value.slice(last));
  }
  return breaks === false ? html : html.replace(/\n/g, '<br>');
}

const AI_TAG_SOURCE = '(^|\\s)@(ai|si)(?![A-Za-z0-9_-])(?!\\.[A-Za-z0-9])';

export function aiTag(text) {
  return new RegExp(AI_TAG_SOURCE, 'i').test(String(text || ''));
}

function facetKind(feature) {
  const type = String(feature?.$type || '');
  if (type.endsWith('#ai')) return 'ai';
  if (type.endsWith('#mention')) return 'mention';
  if (type.endsWith('#tag')) return 'tag';
  if (type.endsWith('#link')) return 'link';
  return '';
}

function featureHtml(slice, features, links, breaks) {
  const html = textHtml(slice, breaks);
  const ai = features.find((feature) => facetKind(feature) === 'ai');
  const mention = features.find((feature) => facetKind(feature) === 'mention');
  const tag = features.find((feature) => facetKind(feature) === 'tag');
  const link = features.find((feature) => facetKind(feature) === 'link');
  const wrap = (className, href, external) => {
    if (!links) return `<span class="facet ${className}">${html}</span>`;
    if (!href) return html;
    const extra = external ? ' target="_blank" rel="noopener noreferrer"' : '';
    return `<a class="facet ${className}" href="${escapeHtml(href)}" draggable="false"${extra}>${html}</a>`;
  };
  if (ai) return wrap('ai', '#/ai', false);
  if (mention?.did) return wrap('mention', profileHash(mention.did), false);
  if (tag?.tag) {
    const name = String(tag.tag);
    const query = name.startsWith('$') ? name : `#${name}`;
    return wrap('tag', `#/search/${encodeURIComponent(query)}`, false);
  }
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

// Same shape as Bluesky's tag scan: a new tag is still a tag. Emoji counts as a
// boundary so a hash typed right after an emoji is included.
const TAG_RE = /(^|[\s\p{Extended_Pictographic}\p{Emoji_Modifier}\uFE0F\u200D\u20E3])[#＃]((?!\uFE0F)[^\s\u00AD\u2060\u200A\u200B\u200C\u200D\u20e2]*[^\d\s\p{P}\u00AD\u2060\u200A\u200B\u200C\u200D\u20e2]+[^\s\u00AD\u2060\u200A\u200B\u200C\u200D\u20e2]*)?/gu;
const TRAILING_PUNCT_RE = /\p{P}+$/u;

function tagMarks(source) {
  const marks = [];
  const re = new RegExp(TAG_RE.source, 'gu');
  let match = re.exec(source);
  while (match) {
    if (match.index === re.lastIndex) re.lastIndex += 1;
    let tag = match[2];
    if (tag) {
      tag = tag.trim().replace(TRAILING_PUNCT_RE, '');
      if (tag && !(tag.length > 64 && graphemeLength(tag) > 64)) {
        const at = match.index + match[1].length;
        const text = `${source.charAt(at)}${tag}`;
        const start = byteAt(source, at);
        marks.push({
          at,
          text,
          tag,
          start,
          end: start + encoder.encode(text).length,
          features: [{ $type: 'app.bsky.richtext.facet#tag', tag }],
        });
      }
    }
    match = re.exec(source);
  }
  return marks;
}

function cashMarks(source) {
  const marks = [];
  const re = /(^|\s|\()\$([A-Za-z][A-Za-z0-9]{0,4})(?=\s|$|[.,;:!?)"'\u2019])/gu;
  let match = re.exec(source);
  while (match) {
    const ticker = match[2].toUpperCase();
    const at = match.index + match[1].length;
    const text = `$${match[2]}`;
    const start = byteAt(source, at);
    marks.push({
      start,
      end: start + encoder.encode(text).length,
      features: [{ $type: 'app.bsky.richtext.facet#tag', tag: `$${ticker}` }],
    });
    match = re.exec(source);
  }
  return marks;
}

export function tagFromQuery(query) {
  const raw = String(query || '').replace(/^[#＃]/, '');
  if (!raw || /\s/u.test(raw)) return '';
  const source = `#${raw}`;
  const marks = tagMarks(source);
  if (marks.length !== 1 || marks[0].at !== 0) return '';
  const rest = source.slice(marks[0].text.length);
  if (rest && !TRAILING_PUNCT_RE.test(rest)) return '';
  return marks[0].tag;
}

export function httpUrlRe() {
  return /https?:\/\/(?:(?![\p{Extended_Pictographic}\u200d\ufe0f])[^\s<>"'])+/gu;
}

function syntheticMarks(source) {
  const marks = [];
  const take = (start, end, features) => {
    if (end <= start || overlaps(marks, start, end)) return;
    marks.push({ start, end, features });
  };
  const aiRe = new RegExp(AI_TAG_SOURCE, 'gi');
  let match = aiRe.exec(source);
  while (match) {
    const at = match.index + match[1].length;
    const start = byteAt(source, at);
    take(start, start + encoder.encode(`@${match[2]}`).length, [{ $type: 'libresky.richtext#ai' }]);
    match = aiRe.exec(source);
  }
  const linkRe = httpUrlRe();
  match = linkRe.exec(source);
  while (match) {
    const raw = trimLink(match[0]);
    const start = byteAt(source, match.index);
    take(start, start + encoder.encode(raw).length, [{ $type: 'app.bsky.richtext.facet#link', uri: raw }]);
    match = linkRe.exec(source);
  }
  const mentionRe = /(^|\s)@([A-Za-z0-9](?:[A-Za-z0-9._-]{0,80}))/g;
  match = mentionRe.exec(source);
  while (match) {
    const handle = match[2].replace(/[._-]+$/g, '');
    if (handle && !/^(ai|si)$/i.test(handle)) {
      const at = match.index + match[1].length;
      const start = byteAt(source, at);
      take(start, start + encoder.encode(`@${handle}`).length, [{ $type: 'app.bsky.richtext.facet#mention', did: handle }]);
    }
    match = mentionRe.exec(source);
  }
  for (const mark of [...tagMarks(source), ...cashMarks(source)]) {
    take(mark.start, mark.end, mark.features);
  }
  return marks;
}

export function plainFacets(text) {
  return syntheticMarks(String(text ?? ''))
    .map((mark) => ({
      index: { byteStart: mark.start, byteEnd: mark.end },
      features: mark.features.filter((feature) => !String(feature.$type || '').startsWith('libresky.')),
    }))
    .filter((facet) => facet.features.length);
}

export function richText(text, facets, options = {}) {
  const source = String(text ?? '');
  if (!source) return '';
  const links = options.links !== false;
  const breaks = options.breaks !== false;
  const typos = options.typos || null;
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
    html += textHtml(decoder.decode(bytes.slice(cursor, mark.start)), breaks, typos);
    html += featureHtml(decoder.decode(bytes.slice(mark.start, mark.end)), mark.features, links, breaks);
    cursor = mark.end;
  }
  html += textHtml(decoder.decode(bytes.slice(cursor)), breaks, typos);
  return html;
}

export function caretToken(text, caret) {
  const source = String(text || '');
  const at = Math.max(0, Math.min(source.length, Number(caret) || 0));
  const head = source.slice(0, at);
  const match = head.match(/(^|\s)([@#])([^\s@#]*)$/u)
    || head.match(/([\p{Extended_Pictographic}\p{Emoji_Modifier}\uFE0F\u200D\u20E3])(#)([^\s#]*)$/u);
  if (!match) return null;
  return { sigil: match[2], query: match[3], start: at - match[3].length - 1 };
}

export function caretWord(text, caret) {
  const source = String(text || '');
  const at = Math.max(0, Math.min(source.length, Number(caret) || 0));
  if (caretToken(source, at)) return null;
  const next = source.slice(at, at + 1);
  if (/[A-Za-z\u00C0-\u024F'’-]/u.test(next)) return null;
  const match = source.slice(0, at).match(/(^|[^A-Za-z\u00C0-\u024F'’-])([A-Za-z\u00C0-\u024F][A-Za-z\u00C0-\u024F'’-]{1,40})$/u);
  if (!match) return null;
  const start = at - match[2].length;
  const prev = start ? source[start - 1] : '';
  if (/[./@#]/.test(prev)) return null;
  return { query: match[2], start };
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

export function trimLink(raw) {
  let uri = String(raw || '');
  for (;;) {
    const cut = uri.replace(/[.,;:!?]+$/g, '').replace(/[\]}>'"]+$/g, '');
    const next = cut.endsWith(')') && !cut.includes('(') ? cut.slice(0, -1) : cut;
    if (next === uri) return uri;
    uri = next;
  }
}

export function firstUrl(text) {
  const match = String(text ?? '').match(httpUrlRe());
  if (!match) return '';
  return trimLink(match[0]);
}

// Bluesky counts and stores the short display form. The facet keeps the full URI.
export function toShortUrl(url) {
  try {
    const urlp = new URL(url);
    if (urlp.protocol !== 'http:' && urlp.protocol !== 'https:') return url;
    const path = (urlp.pathname === '/' ? '' : urlp.pathname) + urlp.search + urlp.hash;
    if (path.length > 15) return `${urlp.host}${path.slice(0, 13)}...`;
    return `${urlp.host}${path}`;
  } catch {
    return url;
  }
}

function lastLine(text) {
  const source = String(text ?? '').replace(/\s+$/u, '');
  if (!source) return { source: '', line: '', head: '' };
  const breakAt = source.lastIndexOf('\n');
  const head = breakAt >= 0 ? source.slice(0, breakAt).replace(/\r$/u, '') : '';
  const line = (breakAt >= 0 ? source.slice(breakAt + 1) : source).trim();
  return { source, line, head, breakAt };
}

// A last line that is only one http(s) URL, plus punctuation trimLink would drop.
export function trailingUrl(text) {
  const { line } = lastLine(text);
  if (!line) return '';
  const match = httpUrlRe().exec(line);
  if (!match || match.index !== 0 || line.slice(match[0].length)) return '';
  const uri = trimLink(match[0]);
  if (!uri || trimLink(line) !== uri) return '';
  return uri;
}

export function withoutTrailingUrl(text) {
  const source = String(text ?? '');
  if (!trailingUrl(source)) return source;
  const { head, breakAt } = lastLine(source);
  if (breakAt < 0) return '';
  return head;
}

export function applyShortLinks(text) {
  const source = String(text ?? '');
  const re = httpUrlRe();
  let out = '';
  let last = 0;
  const links = [];
  let match = re.exec(source);
  while (match) {
    const raw = trimLink(match[0]);
    const start = match.index;
    const matchEnd = start + match[0].length;
    out += source.slice(last, start);
    if (raw) {
      const short = toShortUrl(raw);
      if (short === raw) out += raw;
      else {
        const byteStart = encoder.encode(out).length;
        out += short;
        links.push({
          index: { byteStart, byteEnd: encoder.encode(out).length },
          features: [{ $type: 'app.bsky.richtext.facet#link', uri: raw }],
        });
      }
      out += source.slice(start + raw.length, matchEnd);
    } else out += match[0];
    last = matchEnd;
    match = re.exec(source);
  }
  out += source.slice(last);
  return { text: out, links };
}

function tagAttr(tag, name) {
  const match = String(tag).match(new RegExp(`\\b${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s"'=<>]+))`, 'i'));
  return match ? (match[1] ?? match[2] ?? match[3] ?? '') : '';
}

function decodePoint(code) {
  if (!Number.isFinite(code) || code < 0 || code > 0x10ffff) return '';
  try { return String.fromCodePoint(code); } catch { return ''; }
}

function decodeBasic(value) {
  return String(value || '')
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => decodePoint(Number.parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, num) => decodePoint(Number(num)))
    .replace(/&quot;/g, '"')
    .replace(/&apos;|&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');
}

function metaValue(html, key) {
  const wanted = key.toLowerCase();
  const tags = String(html).match(/<meta\b[^>]*>/gi) || [];
  for (const tag of tags) {
    const name = (tagAttr(tag, 'property') || tagAttr(tag, 'name') || tagAttr(tag, 'itemprop')).toLowerCase();
    if (name !== wanted) continue;
    const content = tagAttr(tag, 'content');
    if (content) return decodeBasic(content);
  }
  return '';
}

function absoluteHttp(value, base) {
  try {
    const url = new URL(decodeBasic(value), base);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return '';
    return url.href;
  } catch {
    return '';
  }
}

function imageScore(url, width, height) {
  if (width && width < 200) return 0;
  if (height && height < 100) return 0;
  if (/favicon|\/sprite(?:\/|[.-])|\/emoji[./]|1x1|pixel|spacer|\/badge/i.test(url)) return 0;
  let score = width > 0 && height > 0 ? width * height : 10_000;
  if (width >= 600 && height >= 300) score += 500_000;
  if (/(?:^|[/-])og[.-]|opengraph|social|share|cover|hero|preview|banner/i.test(url)) score += 1_000_000;
  return score;
}

export function pageCard(html, pageUrl) {
  const source = String(html || '');
  const base = String(pageUrl || '');
  let image = '';
  for (const key of ['og:image:secure_url', 'og:image:url', 'og:image', 'twitter:image', 'twitter:image:src']) {
    const content = metaValue(source, key);
    image = content ? absoluteHttp(content, base) : '';
    if (image) break;
  }
  if (!image) {
    for (const tag of source.match(/<link\b[^>]*>/gi) || []) {
      if (tagAttr(tag, 'rel').toLowerCase() !== 'image_src') continue;
      image = absoluteHttp(tagAttr(tag, 'href'), base);
      if (image) break;
    }
  }
  if (!image) {
    let best = '';
    let bestScore = 0;
    for (const tag of source.match(/<img\b[^>]*>/gi) || []) {
      const src = absoluteHttp(tagAttr(tag, 'src'), base);
      if (!src || /\.svg($|\?)/i.test(src)) continue;
      const score = imageScore(src, Number(tagAttr(tag, 'width')) || 0, Number(tagAttr(tag, 'height')) || 0);
      if (score > bestScore) {
        bestScore = score;
        best = src;
      }
    }
    image = best;
  }
  const title = decodeBasic(metaValue(source, 'og:title') || (source.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1] || '')).replace(/\s+/g, ' ').trim();
  const description = decodeBasic(metaValue(source, 'og:description') || metaValue(source, 'description') || metaValue(source, 'twitter:description')).replace(/\s+/g, ' ').trim();
  return {
    title: title.slice(0, 300),
    description: description.slice(0, 1000),
    image,
  };
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

// Bluesky stores post and chat text as plain UTF-8. Bold, italic, bold italic,
// and monospace are Unicode letters, and strikethrough is a combiner, so other
// Bluesky apps show the style without a formatting facet.
const STYLE_REV = new Map();

function mapStyle(start, base, count, flags) {
  for (let i = 0; i < count; i += 1) {
    STYLE_REV.set(start + i, { base: String.fromCodePoint(base + i), ...flags });
  }
}

mapStyle(0x1D5D4, 0x41, 26, { bold: true, italic: false, mono: false });
mapStyle(0x1D5EE, 0x61, 26, { bold: true, italic: false, mono: false });
mapStyle(0x1D7EC, 0x30, 10, { bold: true, italic: false, mono: false });
mapStyle(0x1D608, 0x41, 26, { bold: false, italic: true, mono: false });
mapStyle(0x1D622, 0x61, 26, { bold: false, italic: true, mono: false });
mapStyle(0x1D63C, 0x41, 26, { bold: true, italic: true, mono: false });
mapStyle(0x1D656, 0x61, 26, { bold: true, italic: true, mono: false });
mapStyle(0x1D670, 0x41, 26, { bold: false, italic: false, mono: true });
mapStyle(0x1D68A, 0x61, 26, { bold: false, italic: false, mono: true });
mapStyle(0x1D7F6, 0x30, 10, { bold: false, italic: false, mono: true });

function readStyled(text) {
  const parts = [];
  for (let i = 0; i < text.length;) {
    const cp = text.codePointAt(i);
    const raw = String.fromCodePoint(cp);
    i += raw.length;
    let strike = false;
    while (i < text.length && text[i] === '\u0336') {
      strike = true;
      i += 1;
    }
    const known = STYLE_REV.get(cp);
    if (known) parts.push({ base: known.base, bold: known.bold, italic: known.italic, mono: known.mono, strike });
    else parts.push({ base: raw, bold: false, italic: false, mono: false, strike });
  }
  return parts;
}

function canStyle(part, style) {
  const letter = /^[A-Za-z]$/.test(part.base);
  const digit = /^[0-9]$/.test(part.base);
  if (style === 'strike') return part.base !== '\n' && part.base !== '\r';
  if (style === 'italic') return letter;
  if (style === 'bold' || style === 'mono') return letter || digit;
  return false;
}

function encodeStyled(part) {
  const letter = /^[A-Za-z]$/.test(part.base);
  const digit = /^[0-9]$/.test(part.base);
  const code = part.base.codePointAt(0);
  let ch = part.base;
  if (part.mono && (letter || digit)) {
    const start = digit ? 0x1D7F6 : (code >= 0x61 ? 0x1D68A : 0x1D670);
    const base = digit ? 0x30 : (code >= 0x61 ? 0x61 : 0x41);
    ch = String.fromCodePoint(start + code - base);
  } else if (part.bold && part.italic && letter) {
    const start = code >= 0x61 ? 0x1D656 : 0x1D63C;
    const base = code >= 0x61 ? 0x61 : 0x41;
    ch = String.fromCodePoint(start + code - base);
  } else if (part.bold && (letter || digit)) {
    const start = digit ? 0x1D7EC : (code >= 0x61 ? 0x1D5EE : 0x1D5D4);
    const base = digit ? 0x30 : (code >= 0x61 ? 0x61 : 0x41);
    ch = String.fromCodePoint(start + code - base);
  } else if (part.italic && letter) {
    const start = code >= 0x61 ? 0x1D622 : 0x1D608;
    const base = code >= 0x61 ? 0x61 : 0x41;
    ch = String.fromCodePoint(start + code - base);
  }
  if (part.strike && part.base !== '\n' && part.base !== '\r') ch += '\u0336';
  return ch;
}

function snapIndex(text, index) {
  const at = Math.max(0, Math.min(text.length, Number(index) || 0));
  if (at <= 0 || at >= text.length) return at;
  const code = text.charCodeAt(at);
  const prev = text.charCodeAt(at - 1);
  if (code >= 0xDC00 && code <= 0xDFFF && prev >= 0xD800 && prev <= 0xDBFF) return at - 1;
  return at;
}

function rewriteRange(text, start, end, edit) {
  const source = String(text ?? '');
  const from = snapIndex(source, start);
  const to = Math.max(from, snapIndex(source, end));
  const next = readStyled(source.slice(from, to)).map(edit).map(encodeStyled).join('');
  return { text: source.slice(0, from) + next + source.slice(to), start: from, end: from + next.length };
}

export function toggleStyle(text, start, end, style) {
  const source = String(text ?? '');
  const from = snapIndex(source, start);
  const to = Math.max(from, snapIndex(source, end));
  const parts = readStyled(source.slice(from, to));
  const applicable = parts.filter((part) => canStyle(part, style));
  if (!applicable.length) return { text: source, start: from, end: to };
  const turnOn = applicable.some((part) => !part[style]);
  return rewriteRange(source, from, to, (part) => {
    if (!canStyle(part, style)) return part;
    const next = { ...part, [style]: turnOn };
    if (turnOn && style === 'mono') {
      next.bold = false;
      next.italic = false;
    }
    if (turnOn && (style === 'bold' || style === 'italic')) next.mono = false;
    return next;
  });
}

export function forceStyles(text, start, end, styles) {
  const wanted = styles instanceof Set ? styles : new Set(styles || []);
  if (!wanted.size) {
    const source = String(text ?? '');
    const from = snapIndex(source, start);
    const to = Math.max(from, snapIndex(source, end));
    return { text: source, start: from, end: to };
  }
  return rewriteRange(text, start, end, (part) => {
    const next = { ...part };
    if (wanted.has('mono') && canStyle(part, 'mono')) {
      next.mono = true;
      next.bold = false;
      next.italic = false;
    } else {
      if (wanted.has('bold') && canStyle(part, 'bold')) {
        next.bold = true;
        next.mono = false;
      }
      if (wanted.has('italic') && canStyle(part, 'italic')) {
        next.italic = true;
        next.mono = false;
      }
    }
    if (wanted.has('strike') && canStyle(part, 'strike')) next.strike = true;
    return next;
  });
}

export function styleFlags(text, start, end) {
  const source = String(text ?? '');
  const from = snapIndex(source, start);
  const to = Math.max(from, snapIndex(source, end));
  const parts = readStyled(source.slice(from, to));
  const flags = {};
  for (const style of ['bold', 'italic', 'strike', 'mono']) {
    const applicable = parts.filter((part) => canStyle(part, style));
    flags[style] = Boolean(applicable.length) && applicable.every((part) => part[style]);
  }
  return flags;
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

const CLEANUP_DAY = 24 * 60 * 60 * 1000;

function didOfAtUri(uri) {
  const repo = splitAtUri(uri)?.repo || '';
  return repo.startsWith('did:') ? repo : '';
}

function handleLooksRandom(handle) {
  const name = String(handle || '').split('.')[0].replace(/[^a-z0-9]/gi, '').toLowerCase();
  if (name.length < 8) return false;
  const digits = (name.match(/\d/g) || []).length;
  if (digits >= 4 && digits / name.length >= 0.25) return true;
  if (name.length >= 10 && /[bcdfghjklmnpqrstvwxyz]{6,}/.test(name)) return true;
  return name.length >= 10 && digits >= 3 && !/[aeiou]{2}/.test(name);
}

export function followSpam(person, now = Date.now()) {
  const reasons = [];
  let score = 0;
  const add = (points, label) => {
    score += points;
    reasons.push(label);
  };
  if (!person?.avatar) add(1, 'No picture');
  if (!String(person?.displayName || '').trim()) add(1, 'No name');
  const bio = String(person?.description || '').trim();
  if (!bio) add(1, 'No bio');
  const posts = person?.posts;
  if (posts === 0) add(2, 'No posts');
  else if (typeof posts === 'number' && posts < 3) add(1, 'Few posts');
  const created = Number(person?.createdAt) || 0;
  if (created > 0 && created <= now) {
    const age = now - created;
    if (age < 7 * CLEANUP_DAY) add(2, 'New account');
    else if (age < 30 * CLEANUP_DAY) add(1, 'Young account');
  }
  const followers = Number(person?.followers) || 0;
  const follows = person?.follows;
  if (typeof follows === 'number' && follows >= 400 && followers * 15 < follows) add(2, 'Follows many, few follow back');
  if (handleLooksRandom(person?.handle)) add(2, 'Random handle');
  const pitch = `${person?.displayName || ''} ${bio}`.toLowerCase();
  if (/\b(follow\s*back|follow4follow|f4f|follow\s*for\s*follow)\b/.test(pitch)) add(2, 'Follow-for-follow pitch');
  const bare = !person?.avatar && !bio && (typeof posts !== 'number' || posts < 3);
  const likely = score >= 4 || (posts === 0 && !person?.avatar && (!bio || handleLooksRandom(person?.handle)));
  return { score, reasons, likely, bare };
}

export function shouldFollowBack(person, { skipSpam = true, held = false, now = Date.now() } = {}) {
  if (!person?.did) return { yes: false, reason: 'Missing account' };
  if (person.followingUri) return { yes: false, reason: 'Already following' };
  if (held) return { yes: false, reason: 'You unfollowed them' };
  if (skipSpam) {
    const report = followSpam(person, now);
    if (report.likely) return { yes: false, reason: report.reasons.slice(0, 2).join(', ') || 'Likely spam' };
  }
  return { yes: true, reason: '' };
}

export function followCleanupMatch(person, filters = {}, now = Date.now()) {
  const followers = Number(person?.followers) || 0;
  const popularity = filters.popularity || 'any';
  if (popularity === 'under-100' && followers >= 100) return false;
  if (popularity === 'under-1k' && followers >= 1000) return false;
  if (popularity === 'under-10k' && followers >= 10000) return false;
  if (popularity === 'over-10k' && followers < 10000) return false;
  const mutual = filters.mutual || 'any';
  if (mutual === 'yes' && !person?.mutual) return false;
  if (mutual === 'no' && person?.mutual) return false;
  const reply = filters.reply || 'any';
  const at = Number(person?.replyAt) || 0;
  if (reply !== 'any') {
    if (!at && !filters.replyReady) return false;
    if (reply === 'none' && at) return false;
    if ((reply === '30' || reply === '90' || reply === '365') && at && at >= now - Number(reply) * CLEANUP_DAY) return false;
  }
  const spam = filters.spam || 'any';
  if (spam !== 'any') {
    const report = followSpam(person, now);
    if (spam === 'likely' && !report.likely) return false;
    if (spam === 'bare' && !report.bare) return false;
    if (spam === 'accident' && (person?.mutual || (!report.likely && !report.bare))) return false;
  }
  const recent = filters.recent || 'any';
  if (recent === '7' || recent === '30') {
    const followedAt = Number(person?.followedAt) || 0;
    if (!followedAt && !filters.datesReady) return false;
    if (!followedAt || followedAt < now - Number(recent) * CLEANUP_DAY) return false;
  }
  const q = String(filters.q || '').trim().toLowerCase().replace(/^@/, '');
  if (q) {
    const name = String(person?.displayName || '').toLowerCase();
    const handle = String(person?.handle || '').toLowerCase();
    if (!name.includes(q) && !handle.includes(q)) return false;
  }
  return true;
}

export function replyTargets(item, selfDid = '') {
  const post = item?.post;
  const record = post?.record;
  if (!record?.reply) return [];
  const at = Date.parse(post?.indexedAt || record.createdAt || '');
  if (!Number.isFinite(at)) return [];
  const ids = new Set();
  const add = (did) => {
    const value = String(did || '');
    if (!value.startsWith('did:') || value === selfDid) return;
    ids.add(value);
  };
  add(item?.reply?.parent?.author?.did);
  add(item?.reply?.root?.author?.did);
  add(didOfAtUri(item?.reply?.parent?.uri));
  add(didOfAtUri(item?.reply?.root?.uri));
  add(didOfAtUri(record.reply?.parent?.uri));
  add(didOfAtUri(record.reply?.root?.uri));
  return [...ids].map((did) => ({ did, at }));
}
