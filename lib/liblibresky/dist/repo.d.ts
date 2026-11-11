import type { ArticleItem, HighlightItem, PresenceView, RepoRecord, SocialLink } from './records.js';
export interface RepoPage {
    records?: RepoRecord[];
    cursor?: string;
}
export interface RepoPort {
    did(): string;
    getRecord(repo: string, collection: string, rkey: string): Promise<RepoRecord | null>;
    listRecords(repo: string, collection: string, cursor?: string): Promise<RepoPage>;
    putRecord(collection: string, rkey: string, record: unknown): Promise<{
        uri?: string;
        cid?: string;
    }>;
    createRecord(collection: string, record: unknown): Promise<{
        uri?: string;
        cid?: string;
    }>;
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
export declare class LibreSkyData {
    private readonly repo;
    private lexiconsFor;
    constructor(repo: RepoPort);
    readShelf(did: string): Promise<Shelf>;
    readLinks(did: string): Promise<SocialLink[]>;
    writeLinks(links: readonly {
        url?: unknown;
        label?: unknown;
        kind?: unknown;
    }[]): Promise<SocialLink[]>;
    listHighlights(did: string): Promise<HighlightItem[]>;
    addHighlight(subject: {
        uri?: string;
        cid?: string;
    }): Promise<HighlightItem>;
    removeHighlight(uri: string): Promise<void>;
    removeHighlightPost(postUri: string): Promise<void>;
    listArticles(did: string): Promise<ArticleItem[]>;
    readArticle(did: string, rkey: string): Promise<ArticleItem | null>;
    saveArticle(input: ArticleInput): Promise<ArticleItem>;
    deleteArticle(uri: string): Promise<void>;
    readPresence(did: string): Promise<PresenceView>;
    writePresence(status?: string): Promise<PresenceView>;
    ensureLexicons(): Promise<void>;
    private one;
    private listAll;
}
