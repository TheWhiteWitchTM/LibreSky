import { AtDatetime, AtUri, ValidationError } from '../../libbluesky/dist/index.js';
import type { ValidationIssue } from '../../libbluesky/dist/index.js';
import { ARTICLE_COLLECTION, HIGHLIGHT_COLLECTION, LINKS_COLLECTION, POST_COLLECTION, PRESENCE_COLLECTION } from './ids.js';

export const LINK_KINDS = [
  'website',
  'x',
  'instagram',
  'youtube',
  'github',
  'mastodon',
  'tiktok',
  'facebook',
  'linkedin',
  'threads',
  'bluesky',
  'discord',
  'twitch',
  'reddit',
  'spotify',
  'telegram',
  'patreon',
  'paypal',
  'other',
] as const;

export type LinkKind = (typeof LINK_KINDS)[number];

export const LINK_LABEL: Record<LinkKind, string> = {
  website: 'Website',
  x: 'X',
  instagram: 'Instagram',
  youtube: 'YouTube',
  github: 'GitHub',
  mastodon: 'Mastodon',
  tiktok: 'TikTok',
  facebook: 'Facebook',
  linkedin: 'LinkedIn',
  threads: 'Threads',
  bluesky: 'Bluesky',
  discord: 'Discord',
  twitch: 'Twitch',
  reddit: 'Reddit',
  spotify: 'Spotify',
  telegram: 'Telegram',
  patreon: 'Patreon',
  paypal: 'PayPal',
  other: 'Link',
};

const KIND_SET = new Set<string>(LINK_KINDS);

const HOST_KIND: readonly (readonly [string, LinkKind])[] = [
  ['x.com', 'x'],
  ['twitter.com', 'x'],
  ['instagram.com', 'instagram'],
  ['youtube.com', 'youtube'],
  ['youtu.be', 'youtube'],
  ['github.com', 'github'],
  ['tiktok.com', 'tiktok'],
  ['facebook.com', 'facebook'],
  ['fb.com', 'facebook'],
  ['linkedin.com', 'linkedin'],
  ['threads.net', 'threads'],
  ['bsky.app', 'bluesky'],
  ['discord.com', 'discord'],
  ['discord.gg', 'discord'],
  ['twitch.tv', 'twitch'],
  ['reddit.com', 'reddit'],
  ['spotify.com', 'spotify'],
  ['t.me', 'telegram'],
  ['telegram.me', 'telegram'],
  ['telegram.org', 'telegram'],
  ['patreon.com', 'patreon'],
  ['paypal.com', 'paypal'],
  ['paypal.me', 'paypal'],
];

export interface SocialLink {
  url: string;
  label: string;
  kind: LinkKind;
}

export interface HighlightItem {
  uri: string;
  cid: string;
  subjectUri: string;
  subjectCid: string;
  createdAt: string;
}

export interface ArticleItem {
  uri: string;
  cid: string;
  rkey: string;
  title: string;
  text: string;
  summary: string;
  cover: unknown;
  createdAt: string;
  updatedAt: string;
}

export interface RepoRecord {
  uri?: string;
  cid?: string;
  value?: unknown;
}

function fail(path: string, message: string): never {
  const issues: ValidationIssue[] = [{ path, message }];
  throw new ValidationError(issues);
}

function hostname(value: string): string {
  try {
    return new URL(value).hostname.replace(/^www\./, '');
  } catch {
    return '';
  }
}

function hostMatches(host: string, name: string): boolean {
  return host === name || host.endsWith(`.${name}`);
}

export function kindForUrl(value: string): LinkKind {
  const host = hostname(value).toLowerCase();
  if (!host) return 'website';
  for (const [name, kind] of HOST_KIND) {
    if (hostMatches(host, name)) return kind;
  }
  if (host.includes('mastodon')) return 'mastodon';
  return 'website';
}

export function httpUrl(value: unknown): string {
  const raw = String(value ?? '').trim();
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    fail('url', 'Enter a full link, including https://.');
  }
  if (url.protocol !== 'https:' && url.protocol !== 'http:') {
    fail('url', 'The link has to start with http:// or https://.');
  }
  if (!url.hostname.includes('.')) fail('url', 'Enter a full link, including https://.');
  return url.toString();
}

export function normalizeLink(input: { url?: unknown; label?: unknown; kind?: unknown } | null | undefined): SocialLink {
  const url = httpUrl(input?.url);
  const requested = String(input?.kind || '');
  const kind = (KIND_SET.has(requested) ? requested : kindForUrl(url)) as LinkKind;
  const label = String(input?.label || '').replace(/\s+/g, ' ').trim().slice(0, 40);
  return { url, label, kind };
}

export function presentLink(link: SocialLink): { url: string; label: string; kind: LinkKind } {
  const kind = KIND_SET.has(link.kind) ? link.kind : kindForUrl(link.url);
  const host = hostname(link.url);
  const fallback = kind === 'other' && host ? host : (LINK_LABEL[kind] || host || 'Link');
  return { url: link.url, label: link.label.trim() || fallback, kind };
}

export function parseLinks(value: unknown): SocialLink[] {
  const raw = value && typeof value === 'object' ? (value as { links?: unknown }).links : null;
  if (!Array.isArray(raw)) return [];
  const links: SocialLink[] = [];
  for (const item of raw) {
    if (!item || typeof item !== 'object') continue;
    try {
      links.push(normalizeLink(item as { url?: unknown; label?: unknown; kind?: unknown }));
    } catch {
      /* a broken link does not hide the rest of the row */
    }
    if (links.length >= 8) break;
  }
  return links;
}

export function profileTabIds(input: { highlights?: number; articles?: number; current?: string } = {}): string[] {
  const ids = ['posts', 'replies'];
  if ((input.highlights || 0) > 0 || input.current === 'highlights') ids.push('highlights');
  if ((input.articles || 0) > 0 || input.current === 'articles') ids.push('articles');
  ids.push('media', 'likes');
  return ids;
}

export function articleExcerpt(article: { summary?: string; text?: string }, max = 180): string {
  const source = String(article.summary || article.text || '').replace(/\s+/g, ' ').trim();
  if (source.length <= max) return source;
  return `${source.slice(0, max - 1).trimEnd()}…`;
}

function newest<T extends { createdAt: string }>(items: T[]): T[] {
  return items.slice().sort((a, b) => (a.createdAt < b.createdAt ? 1 : a.createdAt > b.createdAt ? -1 : 0));
}

function postSubject(input: { uri?: string; cid?: string }): { uri: string; cid: string } {
  const uri = String(input.uri || '');
  const cid = String(input.cid || '');
  const parts = AtUri.parts(uri);
  if (!parts || parts.collection !== POST_COLLECTION || !parts.rkey || !cid) fail('subject', 'Highlight a post.');
  return { uri, cid };
}

export class LinksRecord {
  readonly $type = LINKS_COLLECTION;
  readonly links: SocialLink[];

  constructor(links: readonly { url?: unknown; label?: unknown; kind?: unknown }[] = []) {
    this.links = links.map((link) => normalizeLink(link));
  }

  check(): void {
    if (this.links.length > 8) fail('links', 'A profile can show 8 social links.');
  }

  toJSON() {
    this.check();
    return {
      $type: this.$type,
      links: this.links.map((link) => {
        const item: Record<string, string> = { url: link.url, kind: link.kind };
        if (link.label) item.label = link.label;
        return item;
      }),
    };
  }
}

export class HighlightRecord {
  readonly $type = HIGHLIGHT_COLLECTION;
  readonly subject: { uri: string; cid: string };
  readonly createdAt: string;

  constructor(input: { uri?: string; cid?: string; subject?: { uri?: string; cid?: string }; createdAt?: string } = {}) {
    this.subject = postSubject({
      uri: input.subject?.uri ?? input.uri,
      cid: input.subject?.cid ?? input.cid,
    });
    this.createdAt = input.createdAt || new Date().toISOString();
  }

  check(): void {
    postSubject(this.subject);
    if (!this.createdAt) fail('createdAt', 'Required.');
  }

  toJSON() {
    this.check();
    return {
      $type: this.$type,
      subject: { uri: this.subject.uri, cid: this.subject.cid },
      createdAt: this.createdAt,
    };
  }
}

export class ArticleRecord {
  readonly $type = ARTICLE_COLLECTION;
  title: string;
  text: string;
  summary: string;
  cover: unknown;
  createdAt: string;
  updatedAt: string;

  constructor(input: {
    title?: string;
    text?: string;
    summary?: string;
    cover?: unknown;
    createdAt?: string;
    updatedAt?: string;
  } = {}) {
    this.title = String(input.title || '').replace(/\s+/g, ' ').trim();
    this.text = String(input.text || '').trim();
    this.summary = String(input.summary || '').replace(/\s+/g, ' ').trim();
    this.cover = input.cover || null;
    this.createdAt = input.createdAt || new Date().toISOString();
    this.updatedAt = input.updatedAt || this.createdAt;
  }

  check(): void {
    if (!this.title) fail('title', 'Add a title.');
    if (this.title.length > 300) fail('title', 'The title is too long.');
    if (!this.text) fail('text', 'Write the article.');
    if (this.text.length > 25000) fail('text', 'The article is too long.');
    if (this.summary.length > 400) fail('summary', 'The summary is too long.');
    if (!this.createdAt) fail('createdAt', 'Required.');
  }

  toJSON() {
    this.check();
    const record: Record<string, unknown> = {
      $type: this.$type,
      title: this.title,
      text: this.text,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
    if (this.summary) record.summary = this.summary;
    if (this.cover) record.cover = this.cover;
    return record;
  }
}

export function parseHighlight(record: RepoRecord): HighlightItem | null {
  const value = record.value;
  if (!record.uri || !value || typeof value !== 'object') return null;
  const subject = (value as { subject?: { uri?: unknown; cid?: unknown }; createdAt?: unknown }).subject;
  const uri = typeof subject?.uri === 'string' ? subject.uri : '';
  const cid = typeof subject?.cid === 'string' ? subject.cid : '';
  const parts = AtUri.parts(uri);
  if (!parts || parts.collection !== POST_COLLECTION || !cid) return null;
  const createdAt = typeof (value as { createdAt?: unknown }).createdAt === 'string'
    ? (value as { createdAt: string }).createdAt
    : '';
  return { uri: record.uri, cid: record.cid || '', subjectUri: uri, subjectCid: cid, createdAt };
}

export function parseArticle(record: RepoRecord): ArticleItem | null {
  const value = record.value;
  if (!record.uri || !value || typeof value !== 'object') return null;
  const body = value as { title?: unknown; text?: unknown; summary?: unknown; cover?: unknown; createdAt?: unknown; updatedAt?: unknown };
  if (typeof body.title !== 'string' || !body.title.trim()) return null;
  if (typeof body.text !== 'string' || !body.text.trim()) return null;
  const parts = AtUri.parts(record.uri);
  const createdAt = typeof body.createdAt === 'string' ? body.createdAt : '';
  return {
    uri: record.uri,
    cid: record.cid || '',
    rkey: parts?.rkey || '',
    title: body.title.trim(),
    text: body.text,
    summary: typeof body.summary === 'string' ? body.summary.trim() : '',
    cover: body.cover || null,
    createdAt,
    updatedAt: typeof body.updatedAt === 'string' ? body.updatedAt : createdAt,
  };
}

export function highlightsFrom(records: readonly RepoRecord[]): HighlightItem[] {
  return newest(records.map(parseHighlight).filter((item): item is HighlightItem => Boolean(item)));
}

export function articlesFrom(records: readonly RepoRecord[]): ArticleItem[] {
  return newest(records.map(parseArticle).filter((item): item is ArticleItem => Boolean(item)));
}

/** A last seen inside this window still counts as online. */
export const PRESENCE_FRESH_MS = 5 * 60 * 1000;

/** How long the same status can wait before the client writes it again. */
export const PRESENCE_PULSE_MS = 2 * 60 * 1000;

const PRESENCE_SKEW_MS = 2 * 60 * 1000;

export type PresenceState = 'available' | 'away' | 'offline' | 'absent';

export interface PresenceView {
  usesLibreSky: boolean;
  online: boolean;
  available: boolean;
  state: PresenceState;
  seenAt: string;
}

export interface PresenceValue {
  seenAt: string;
  status: 'available' | 'away';
}

function absentPresence(): PresenceView {
  return { usesLibreSky: false, online: false, available: false, state: 'absent', seenAt: '' };
}

export function parsePresence(value: unknown): PresenceValue | null {
  if (!value || typeof value !== 'object') return null;
  const body = value as { seenAt?: unknown; status?: unknown };
  if (!AtDatetime.isValid(body.seenAt)) return null;
  return { seenAt: body.seenAt, status: body.status === 'away' ? 'away' : 'available' };
}

/**
 * Turns a public last-seen record into the flags the app shows.
 * The timestamp stays internal. A missing record means this account has not published LibreSky presence.
 */
export function presenceView(value: unknown, now = Date.now()): PresenceView {
  if (value == null) return absentPresence();
  const parsed = parsePresence(value);
  if (!parsed) {
    return { usesLibreSky: true, online: false, available: false, state: 'offline', seenAt: '' };
  }
  const then = Date.parse(parsed.seenAt);
  const fresh = Number.isFinite(then) && then - now <= PRESENCE_SKEW_MS && now - then <= PRESENCE_FRESH_MS;
  if (!fresh) {
    return { usesLibreSky: true, online: false, available: false, state: 'offline', seenAt: parsed.seenAt };
  }
  if (parsed.status === 'away') {
    return { usesLibreSky: true, online: true, available: false, state: 'away', seenAt: parsed.seenAt };
  }
  return { usesLibreSky: true, online: true, available: true, state: 'available', seenAt: parsed.seenAt };
}

export function presencePulseDue(
  view: PresenceView | null | undefined,
  status: string,
  now = Date.now(),
  minMs = PRESENCE_PULSE_MS,
): boolean {
  const wanted = status === 'away' ? 'away' : 'available';
  if (!view?.usesLibreSky || view.state !== wanted || !view.seenAt) return true;
  const then = Date.parse(view.seenAt);
  if (!Number.isFinite(then)) return true;
  return now - then >= minMs;
}

export class PresenceRecord {
  readonly $type = PRESENCE_COLLECTION;
  readonly seenAt: string;
  readonly status: 'available' | 'away';

  constructor(input: { seenAt?: string; status?: string } = {}) {
    const seenAt = input.seenAt || new Date().toISOString();
    this.seenAt = AtDatetime.isValid(seenAt) ? seenAt : new Date().toISOString();
    this.status = input.status === 'away' ? 'away' : 'available';
  }

  check(): void {
    if (!AtDatetime.isValid(this.seenAt)) fail('seenAt', 'Required.');
  }

  toJSON() {
    this.check();
    return {
      $type: this.$type,
      seenAt: this.seenAt,
      status: this.status,
    };
  }
}
