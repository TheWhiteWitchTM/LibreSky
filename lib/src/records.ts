import { ValidationError } from './errors.js';
import type { ValidationIssue } from './errors.js';
import { nextTid } from './syntax.js';

function issuesOf(pairs: [string, unknown][]): void {
  const issues: ValidationIssue[] = pairs
    .filter(([, value]) => value == null)
    .map(([path]) => ({ path, message: 'Required.' }));
  if (issues.length) throw new ValidationError(issues);
}

export class StrongRef {
  uri?: string;
  cid?: string;

  constructor(input: { uri?: string; cid?: string } = {}) {
    this.uri = input.uri;
    this.cid = input.cid;
  }

  check(): void {
    issuesOf([['uri', this.uri], ['cid', this.cid]]);
  }

  toJSON(): { uri?: string; cid?: string } {
    return { uri: this.uri, cid: this.cid };
  }
}

export class TypedStrongRef {
  readonly $type = 'com.atproto.repo.strongRef' as const;
  uri?: string;
  cid?: string;

  constructor(input: { uri?: string; cid?: string } = {}) {
    this.uri = input.uri;
    this.cid = input.cid;
  }

  toJSON(): { $type: 'com.atproto.repo.strongRef'; uri?: string; cid?: string } {
    return { $type: this.$type, uri: this.uri, cid: this.cid };
  }
}

export class RepoRef {
  readonly $type = 'com.atproto.admin.defs#repoRef' as const;
  did?: string;

  constructor(did?: string) {
    this.did = did;
  }

  toJSON(): { $type: 'com.atproto.admin.defs#repoRef'; did?: string } {
    return { $type: this.$type, did: this.did };
  }
}

export class LikeRecord {
  readonly $type = 'app.bsky.feed.like' as const;
  uri?: string;
  cid?: string;
  createdAt: string;

  constructor(input: { uri?: string; cid?: string; subject?: { uri?: string; cid?: string }; createdAt?: string } = {}) {
    this.uri = input.subject?.uri ?? input.uri;
    this.cid = input.subject?.cid ?? input.cid;
    this.createdAt = input.createdAt || new Date().toISOString();
  }

  check(): void {
    issuesOf([['subject/uri', this.uri], ['subject/cid', this.cid], ['createdAt', this.createdAt]]);
  }

  toJSON() {
    return {
      $type: this.$type,
      subject: { uri: this.uri, cid: this.cid },
      createdAt: this.createdAt,
    };
  }
}

export class RepostRecord {
  readonly $type = 'app.bsky.feed.repost' as const;
  uri?: string;
  cid?: string;
  createdAt: string;

  constructor(input: { uri?: string; cid?: string; subject?: { uri?: string; cid?: string }; createdAt?: string } = {}) {
    this.uri = input.subject?.uri ?? input.uri;
    this.cid = input.subject?.cid ?? input.cid;
    this.createdAt = input.createdAt || new Date().toISOString();
  }

  check(): void {
    issuesOf([['subject/uri', this.uri], ['subject/cid', this.cid], ['createdAt', this.createdAt]]);
  }

  toJSON() {
    return {
      $type: this.$type,
      subject: { uri: this.uri, cid: this.cid },
      createdAt: this.createdAt,
    };
  }
}

export class FollowRecord {
  readonly $type = 'app.bsky.graph.follow' as const;
  subject?: string;
  createdAt: string;

  constructor(input: { subject?: string; did?: string; createdAt?: string } = {}) {
    this.subject = input.subject ?? input.did;
    this.createdAt = input.createdAt || new Date().toISOString();
  }

  check(): void {
    issuesOf([['subject', this.subject], ['createdAt', this.createdAt]]);
  }

  toJSON() {
    return { $type: this.$type, subject: this.subject, createdAt: this.createdAt };
  }
}

export class BlockRecord {
  readonly $type = 'app.bsky.graph.block' as const;
  subject?: string;
  createdAt: string;

  constructor(input: { subject?: string; did?: string; createdAt?: string } = {}) {
    this.subject = input.subject ?? input.did;
    this.createdAt = input.createdAt || new Date().toISOString();
  }

  check(): void {
    issuesOf([['subject', this.subject], ['createdAt', this.createdAt]]);
  }

  toJSON() {
    return { $type: this.$type, subject: this.subject, createdAt: this.createdAt };
  }
}

export class ListRecord {
  readonly $type = 'app.bsky.graph.list' as const;
  name?: string;
  purpose: string;
  description?: string;
  descriptionFacets?: unknown[];
  createdAt: string;

  constructor(input: { name?: string; purpose?: string; description?: string; descriptionFacets?: unknown[]; createdAt?: string } = {}) {
    this.name = input.name;
    this.purpose = input.purpose || 'app.bsky.graph.defs#curatelist';
    this.description = input.description;
    this.descriptionFacets = input.descriptionFacets;
    this.createdAt = input.createdAt || new Date().toISOString();
  }

  check(): void {
    issuesOf([['name', this.name], ['purpose', this.purpose], ['createdAt', this.createdAt]]);
  }

  toJSON() {
    const record: Record<string, unknown> = {
      $type: this.$type,
      purpose: this.purpose,
      name: this.name,
      createdAt: this.createdAt,
    };
    if (this.description) record.description = this.description;
    if (this.descriptionFacets?.length) record.descriptionFacets = this.descriptionFacets;
    return record;
  }
}

export class ListItemRecord {
  readonly $type = 'app.bsky.graph.listitem' as const;
  subject?: string;
  list?: string;
  createdAt: string;

  constructor(input: { subject?: string; did?: string; list?: string; createdAt?: string } = {}) {
    this.subject = input.subject ?? input.did;
    this.list = input.list;
    this.createdAt = input.createdAt || new Date().toISOString();
  }

  check(): void {
    issuesOf([['subject', this.subject], ['list', this.list], ['createdAt', this.createdAt]]);
  }

  toJSON() {
    return { $type: this.$type, subject: this.subject, list: this.list, createdAt: this.createdAt };
  }
}

export class ThreadgateRecord {
  readonly $type = 'app.bsky.feed.threadgate' as const;
  post?: string;
  allow: unknown;
  createdAt: string;

  constructor(input: { post?: string; allow?: unknown; createdAt?: string } = {}) {
    this.post = input.post;
    this.allow = input.allow;
    this.createdAt = input.createdAt || new Date().toISOString();
  }

  check(): void {
    issuesOf([['post', this.post], ['createdAt', this.createdAt]]);
  }

  toJSON() {
    return {
      $type: this.$type,
      post: this.post,
      allow: this.allow,
      createdAt: this.createdAt,
    };
  }
}

export class PostRecord {
  readonly $type = 'app.bsky.feed.post' as const;
  text: string;
  createdAt: string;
  facets?: unknown[];
  langs?: string[];
  reply?: { root?: unknown; parent?: unknown };
  embed?: unknown;

  constructor(input: {
    text?: string;
    createdAt?: string;
    facets?: unknown[];
    langs?: string[];
    reply?: { root?: unknown; parent?: unknown };
    embed?: unknown;
  } = {}) {
    this.text = input.text ?? '';
    this.createdAt = input.createdAt || new Date().toISOString();
    this.facets = input.facets;
    this.langs = input.langs;
    this.reply = input.reply;
    this.embed = input.embed;
  }

  check(): void {
    issuesOf([['text', this.text], ['createdAt', this.createdAt]]);
  }

  toJSON() {
    const record: Record<string, unknown> = {
      $type: this.$type,
      text: this.text,
      createdAt: this.createdAt,
    };
    if (this.facets?.length) record.facets = this.facets;
    if (this.langs?.length) record.langs = this.langs;
    if (this.reply) record.reply = { root: this.reply.root, parent: this.reply.parent };
    if (this.embed != null) record.embed = this.embed;
    return record;
  }
}

export class ExternalEmbed {
  uri?: string;
  title?: string;
  description?: string;
  thumb?: unknown;

  constructor(input: { url?: string; uri?: string; title?: string; description?: string; thumb?: unknown } = {}) {
    this.uri = input.uri ?? input.url;
    this.title = input.title;
    this.description = input.description;
    this.thumb = input.thumb;
  }

  toJSON() {
    const external: Record<string, unknown> = {
      uri: this.uri,
      title: String(this.title || this.uri || '').slice(0, 300),
      description: String(this.description || '').slice(0, 1000),
    };
    if (this.thumb) external.thumb = this.thumb;
    return { $type: 'app.bsky.embed.external' as const, external };
  }
}

export class ImagesEmbed {
  readonly images: readonly { alt?: string; blob?: unknown; image?: unknown }[];

  constructor(images: readonly { alt?: string; blob?: unknown; image?: unknown }[] = []) {
    this.images = images;
  }

  toJSON() {
    return {
      $type: 'app.bsky.embed.images' as const,
      images: this.images.map((image) => ({
        alt: image.alt || '',
        image: image.image ?? image.blob,
      })),
    };
  }
}

export class VideoEmbed {
  video?: unknown;
  alt?: string;
  aspectRatio?: { width?: number; height?: number };

  constructor(input: { video?: unknown; blob?: unknown; alt?: string; aspectRatio?: { width?: number; height?: number } } = {}) {
    this.video = input.video ?? input.blob;
    this.alt = input.alt;
    this.aspectRatio = input.aspectRatio;
  }

  toJSON() {
    const record: Record<string, unknown> = {
      $type: 'app.bsky.embed.video',
      video: this.video,
      alt: String(this.alt || '').slice(0, 2000),
    };
    if (this.aspectRatio?.width && this.aspectRatio?.height) record.aspectRatio = this.aspectRatio;
    return record;
  }
}

export class RecordEmbed {
  uri?: string;
  cid?: string;

  constructor(input: { uri?: string; cid?: string } = {}) {
    this.uri = input.uri;
    this.cid = input.cid;
  }

  toJSON() {
    return {
      $type: 'app.bsky.embed.record' as const,
      record: { uri: this.uri, cid: this.cid },
    };
  }
}

export class RecordWithMediaEmbed {
  uri?: string;
  cid?: string;
  media?: unknown;

  constructor(input: { uri?: string; cid?: string; media?: unknown } = {}) {
    this.uri = input.uri;
    this.cid = input.cid;
    this.media = input.media;
  }

  toJSON() {
    return {
      $type: 'app.bsky.embed.recordWithMedia' as const,
      record: {
        $type: 'app.bsky.embed.record' as const,
        record: { uri: this.uri, cid: this.cid },
      },
      media: this.media,
    };
  }
}

export class ChatDeclarationRecord {
  readonly $type = 'chat.bsky.actor.declaration' as const;
  allowIncoming: 'none' | 'following' | 'all';

  constructor(allowIncoming?: string) {
    this.allowIncoming = allowIncoming === 'none' || allowIncoming === 'following' ? allowIncoming : 'all';
  }

  toJSON() {
    return { $type: this.$type, allowIncoming: this.allowIncoming };
  }
}

export class DeleteWrite {
  readonly $type = 'com.atproto.repo.applyWrites#delete' as const;
  collection?: string;
  rkey?: string;

  constructor(input: { collection?: string; rkey?: string } = {}) {
    this.collection = input.collection;
    this.rkey = input.rkey;
  }

  toJSON() {
    return { $type: this.$type, collection: this.collection, rkey: this.rkey };
  }
}

export interface SavedFeedItem {
  id?: string;
  type: string;
  value: string;
  pinned: boolean;
}

const SAVED_V2 = 'app.bsky.actor.defs#savedFeedsPrefV2';
const SAVED_V1 = 'app.bsky.actor.defs#savedFeedsPref';

export function savedFeedItems(preferences: readonly { $type?: string; items?: SavedFeedItem[]; pinned?: string[]; saved?: string[] }[] | null | undefined): SavedFeedItem[] {
  const list = preferences || [];
  const v2 = list.find((pref) => pref.$type === SAVED_V2);
  if (v2) {
    return (v2.items || [])
      .filter((item) => item?.type && item?.value)
      .map((item) => ({
        id: item.id,
        type: item.type,
        value: item.value,
        pinned: Boolean(item.pinned),
      }));
  }
  const v1 = list.find((pref) => pref.$type === SAVED_V1);
  if (!v1) return [];
  const pinned = new Set(v1.pinned || []);
  const uris = [...new Set([...(v1.saved || []), ...(v1.pinned || [])])].filter(Boolean);
  return uris.map((uri) => ({
    type: String(uri).includes('/app.bsky.graph.list/') ? 'list' : 'feed',
    value: uri,
    pinned: pinned.has(uri),
  }));
}

export function applySavedFeeds(
  preferences: readonly Record<string, unknown>[] | null | undefined,
  items: readonly { id?: string; type?: string; value?: string; pinned?: boolean }[],
): Record<string, unknown>[] {
  const next = (preferences || []).map((pref) => ({ ...pref }));
  const v2items = items.map((item) => ({
    id: item.id || nextTid(),
    type: item.type,
    value: item.value,
    pinned: Boolean(item.pinned),
  }));
  let v2 = next.find((pref) => pref.$type === SAVED_V2);
  if (!v2) {
    v2 = { $type: SAVED_V2, items: v2items };
    next.push(v2);
  } else v2.items = v2items;
  const v1 = next.find((pref) => pref.$type === SAVED_V1);
  if (v1) {
    const rows = v2items.filter((item) => item.type === 'feed' || item.type === 'list');
    v1.pinned = rows.filter((item) => item.pinned).map((item) => item.value);
    v1.saved = rows.map((item) => item.value);
  }
  return next;
}
