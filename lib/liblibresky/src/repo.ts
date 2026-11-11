import { AtUri, isMissingRecord } from '../../libbluesky/dist/index.js';
import {
  ARTICLE_COLLECTION,
  HIGHLIGHT_COLLECTION,
  LEXICON_COLLECTION,
  LINKS_COLLECTION,
  LINKS_RKEY,
  PRESENCE_COLLECTION,
  PRESENCE_RKEY,
} from './ids.js';
import { LEXICONS, lexiconRecord, sameLexicon } from './lexicons.js';
import {
  ArticleRecord,
  HighlightRecord,
  LinksRecord,
  articlesFrom,
  highlightsFrom,
  parseArticle,
  parseHighlight,
  parseLinks,
  PresenceRecord,
  presenceView,
} from './records.js';
import type { ArticleItem, HighlightItem, PresenceView, RepoRecord, SocialLink } from './records.js';

export interface RepoPage {
  records?: RepoRecord[];
  cursor?: string;
}

export interface RepoPort {
  did(): string;
  getRecord(repo: string, collection: string, rkey: string): Promise<RepoRecord | null>;
  listRecords(repo: string, collection: string, cursor?: string): Promise<RepoPage>;
  putRecord(collection: string, rkey: string, record: unknown): Promise<{ uri?: string; cid?: string }>;
  createRecord(collection: string, record: unknown): Promise<{ uri?: string; cid?: string }>;
  deleteRecord(uri: string): Promise<void>;
}

export interface Shelf {
  links: SocialLink[];
  highlights: HighlightItem[];
  articles: ArticleItem[];
}

export interface ArticleInput {
  uri?: string;
  title?: string;
  text?: string;
  summary?: string;
  cover?: unknown;
  createdAt?: string;
}

/**
 * Highlights, articles, social links, and last seen are public records in the account repo.
 * Copies of the lexicon documents go in that same repo. Another LibreSky window
 * reads the records directly. Last seen is fresh only while that window keeps writing it.
 */
export class LibreSkyData {
  private lexiconsFor = '';

  constructor(private readonly repo: RepoPort) {}

  async readShelf(did: string): Promise<Shelf> {
    const [links, highlights, articles] = await Promise.all([
      this.readLinks(did),
      this.listHighlights(did),
      this.listArticles(did),
    ]);
    return { links, highlights, articles };
  }

  async readLinks(did: string): Promise<SocialLink[]> {
    const got = await this.one(did, LINKS_COLLECTION, LINKS_RKEY);
    return got?.value ? parseLinks(got.value) : [];
  }

  async writeLinks(links: readonly { url?: unknown; label?: unknown; kind?: unknown }[]): Promise<SocialLink[]> {
    const record = new LinksRecord(links);
    record.check();
    const clean = record.links;
    const did = this.repo.did();
    if (!clean.length) {
      const current = await this.one(did, LINKS_COLLECTION, LINKS_RKEY);
      if (current?.uri) await this.repo.deleteRecord(current.uri);
      return [];
    }
    await this.ensureLexicons();
    await this.repo.putRecord(LINKS_COLLECTION, LINKS_RKEY, record.toJSON());
    return clean;
  }

  async listHighlights(did: string): Promise<HighlightItem[]> {
    return highlightsFrom(await this.listAll(did, HIGHLIGHT_COLLECTION));
  }

  async addHighlight(subject: { uri?: string; cid?: string }): Promise<HighlightItem> {
    const record = new HighlightRecord(subject);
    record.check();
    const existing = await this.listHighlights(this.repo.did());
    const found = existing.find((item) => item.subjectUri === record.subject.uri);
    if (found) return found;
    await this.ensureLexicons();
    const wrote = await this.repo.createRecord(HIGHLIGHT_COLLECTION, record.toJSON());
    const item = parseHighlight({ uri: wrote.uri, cid: wrote.cid, value: record.toJSON() });
    if (!item) throw new Error('Could not save that highlight.');
    return item;
  }

  async removeHighlight(uri: string): Promise<void> {
    if (!uri) return;
    await this.repo.deleteRecord(uri);
  }

  async removeHighlightPost(postUri: string): Promise<void> {
    const items = await this.listHighlights(this.repo.did());
    const found = items.filter((item) => item.subjectUri === postUri);
    for (const item of found) await this.repo.deleteRecord(item.uri);
  }

  async listArticles(did: string): Promise<ArticleItem[]> {
    return articlesFrom(await this.listAll(did, ARTICLE_COLLECTION));
  }

  async readArticle(did: string, rkey: string): Promise<ArticleItem | null> {
    const got = await this.one(did, ARTICLE_COLLECTION, rkey);
    return got ? parseArticle(got) : null;
  }

  async saveArticle(input: ArticleInput): Promise<ArticleItem> {
    const createdAt = input.createdAt || new Date().toISOString();
    const record = new ArticleRecord({
      title: input.title,
      text: input.text,
      summary: input.summary,
      cover: input.cover,
      createdAt,
      updatedAt: new Date().toISOString(),
    });
    record.check();
    await this.ensureLexicons();
    const json = record.toJSON();
    if (input.uri) {
      const parts = AtUri.parts(input.uri);
      if (!parts || parts.collection !== ARTICLE_COLLECTION) throw new Error('Could not read that article.');
      const wrote = await this.repo.putRecord(ARTICLE_COLLECTION, parts.rkey, json);
      const item = parseArticle({ uri: wrote.uri || input.uri, cid: wrote.cid, value: json });
      if (!item) throw new Error('Could not save that article.');
      return item;
    }
    const wrote = await this.repo.createRecord(ARTICLE_COLLECTION, json);
    const item = parseArticle({ uri: wrote.uri, cid: wrote.cid, value: json });
    if (!item) throw new Error('Could not save that article.');
    return item;
  }

  async deleteArticle(uri: string): Promise<void> {
    if (!uri) return;
    await this.repo.deleteRecord(uri);
  }

  async readPresence(did: string): Promise<PresenceView> {
    const got = await this.one(did, PRESENCE_COLLECTION, PRESENCE_RKEY);
    if (!got) return presenceView(null);
    return presenceView(got.value ?? {});
  }

  async writePresence(status: string = 'available'): Promise<PresenceView> {
    const record = new PresenceRecord({ status });
    record.check();
    await this.ensureLexicons();
    const json = record.toJSON();
    await this.repo.putRecord(PRESENCE_COLLECTION, PRESENCE_RKEY, json);
    return presenceView(json);
  }

  async ensureLexicons(): Promise<void> {
    const did = this.repo.did();
    if (!did || this.lexiconsFor === did) return;
    for (const doc of LEXICONS) {
      const record = lexiconRecord(doc);
      const current = await this.one(did, LEXICON_COLLECTION, doc.id);
      if (sameLexicon(current?.value, record)) continue;
      try {
        await this.repo.putRecord(LEXICON_COLLECTION, doc.id, record);
      } catch (error) {
        if (!isMissingRecord(error)) {
          /* the data record is what other LibreSky windows read */
        }
      }
    }
    this.lexiconsFor = did;
  }

  private async one(repo: string, collection: string, rkey: string): Promise<RepoRecord | null> {
    try {
      return await this.repo.getRecord(repo, collection, rkey);
    } catch (error) {
      if (isMissingRecord(error)) return null;
      throw error;
    }
  }

  private async listAll(repo: string, collection: string): Promise<RepoRecord[]> {
    const records: RepoRecord[] = [];
    let cursor = '';
    for (let page = 0; page < 40; page += 1) {
      let data: RepoPage;
      try {
        data = await this.repo.listRecords(repo, collection, cursor || undefined);
      } catch (error) {
        if (isMissingRecord(error)) return records;
        throw error;
      }
      records.push(...(data.records || []));
      if (!data.cursor || data.cursor === cursor) break;
      cursor = data.cursor;
    }
    return records;
  }
}
