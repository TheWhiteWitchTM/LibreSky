export declare const LINK_KINDS: readonly ["website", "x", "instagram", "youtube", "github", "mastodon", "tiktok", "facebook", "linkedin", "threads", "bluesky", "discord", "twitch", "reddit", "spotify", "telegram", "patreon", "paypal", "other"];
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
/** A last seen inside this window still counts as online. */
export declare const PRESENCE_FRESH_MS: number;
/** How long the same status can wait before the client writes it again. */
export declare const PRESENCE_PULSE_MS: number;
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
export declare function parsePresence(value: unknown): PresenceValue | null;
/**
 * Turns a public last-seen record into the flags the app shows.
 * The timestamp stays internal. A missing record means this account has not published LibreSky presence.
 */
export declare function presenceView(value: unknown, now?: number): PresenceView;
export declare function presencePulseDue(view: PresenceView | null | undefined, status: string, now?: number, minMs?: number): boolean;
export declare class PresenceRecord {
    readonly $type = "app.libresky.actor.presence";
    readonly seenAt: string;
    readonly status: 'available' | 'away';
    constructor(input?: {
        seenAt?: string;
        status?: string;
    });
    check(): void;
    toJSON(): {
        $type: string;
        seenAt: string;
        status: "available" | "away";
    };
}
