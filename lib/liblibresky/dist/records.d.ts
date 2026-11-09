export declare const LINK_KINDS: readonly ["website", "x", "instagram", "youtube", "github", "mastodon", "tiktok", "facebook", "linkedin", "threads", "bluesky", "other"];
export type LinkKind = (typeof LINK_KINDS)[number];
export declare const LINK_LABEL: Record<LinkKind, string>;
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
export declare function kindForUrl(value: string): LinkKind;
export declare function httpUrl(value: unknown): string;
export declare function normalizeLink(input: {
    url?: unknown;
    label?: unknown;
    kind?: unknown;
} | null | undefined): SocialLink;
export declare function presentLink(link: SocialLink): {
    url: string;
    label: string;
    kind: LinkKind;
};
export declare function parseLinks(value: unknown): SocialLink[];
export declare function profileTabIds(input?: {
    highlights?: number;
    articles?: number;
    current?: string;
}): string[];
export declare function articleExcerpt(article: {
    summary?: string;
    text?: string;
}, max?: number): string;
export declare class LinksRecord {
    readonly $type = "app.libresky.actor.links";
    readonly links: SocialLink[];
    constructor(links?: readonly {
        url?: unknown;
        label?: unknown;
        kind?: unknown;
    }[]);
    check(): void;
    toJSON(): {
        $type: string;
        links: Record<string, string>[];
    };
}
export declare class HighlightRecord {
    readonly $type = "app.libresky.feed.highlight";
    readonly subject: {
        uri: string;
        cid: string;
    };
    readonly createdAt: string;
    constructor(input?: {
        uri?: string;
        cid?: string;
        subject?: {
            uri?: string;
            cid?: string;
        };
        createdAt?: string;
    });
    check(): void;
    toJSON(): {
        $type: string;
        subject: {
            uri: string;
            cid: string;
        };
        createdAt: string;
    };
}
export declare class ArticleRecord {
    readonly $type = "app.libresky.article.article";
    title: string;
    text: string;
    summary: string;
    cover: unknown;
    createdAt: string;
    updatedAt: string;
    constructor(input?: {
        title?: string;
        text?: string;
        summary?: string;
        cover?: unknown;
        createdAt?: string;
        updatedAt?: string;
    });
    check(): void;
    toJSON(): Record<string, unknown>;
}
export declare function parseHighlight(record: RepoRecord): HighlightItem | null;
export declare function parseArticle(record: RepoRecord): ArticleItem | null;
export declare function highlightsFrom(records: readonly RepoRecord[]): HighlightItem[];
export declare function articlesFrom(records: readonly RepoRecord[]): ArticleItem[];
