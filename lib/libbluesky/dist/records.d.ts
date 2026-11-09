export declare class StrongRef {
    uri?: string;
    cid?: string;
    constructor(input?: {
        uri?: string;
        cid?: string;
    });
    check(): void;
    toJSON(): {
        uri?: string;
        cid?: string;
    };
}
export declare class TypedStrongRef {
    readonly $type: "com.atproto.repo.strongRef";
    uri?: string;
    cid?: string;
    constructor(input?: {
        uri?: string;
        cid?: string;
    });
    toJSON(): {
        $type: 'com.atproto.repo.strongRef';
        uri?: string;
        cid?: string;
    };
}
export declare class RepoRef {
    readonly $type: "com.atproto.admin.defs#repoRef";
    did?: string;
    constructor(did?: string);
    toJSON(): {
        $type: 'com.atproto.admin.defs#repoRef';
        did?: string;
    };
}
export declare class LikeRecord {
    readonly $type: "app.bsky.feed.like";
    uri?: string;
    cid?: string;
    createdAt: string;
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
        $type: "app.bsky.feed.like";
        subject: {
            uri: string | undefined;
            cid: string | undefined;
        };
        createdAt: string;
    };
}
export declare class RepostRecord {
    readonly $type: "app.bsky.feed.repost";
    uri?: string;
    cid?: string;
    createdAt: string;
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
        $type: "app.bsky.feed.repost";
        subject: {
            uri: string | undefined;
            cid: string | undefined;
        };
        createdAt: string;
    };
}
export declare class FollowRecord {
    readonly $type: "app.bsky.graph.follow";
    subject?: string;
    createdAt: string;
    constructor(input?: {
        subject?: string;
        did?: string;
        createdAt?: string;
    });
    check(): void;
    toJSON(): {
        $type: "app.bsky.graph.follow";
        subject: string | undefined;
        createdAt: string;
    };
}
export declare class BlockRecord {
    readonly $type: "app.bsky.graph.block";
    subject?: string;
    createdAt: string;
    constructor(input?: {
        subject?: string;
        did?: string;
        createdAt?: string;
    });
    check(): void;
    toJSON(): {
        $type: "app.bsky.graph.block";
        subject: string | undefined;
        createdAt: string;
    };
}
export declare class ListRecord {
    readonly $type: "app.bsky.graph.list";
    name?: string;
    purpose: string;
    description?: string;
    descriptionFacets?: unknown[];
    createdAt: string;
    constructor(input?: {
        name?: string;
        purpose?: string;
        description?: string;
        descriptionFacets?: unknown[];
        createdAt?: string;
    });
    check(): void;
    toJSON(): Record<string, unknown>;
}
export declare class ListItemRecord {
    readonly $type: "app.bsky.graph.listitem";
    subject?: string;
    list?: string;
    createdAt: string;
    constructor(input?: {
        subject?: string;
        did?: string;
        list?: string;
        createdAt?: string;
    });
    check(): void;
    toJSON(): {
        $type: "app.bsky.graph.listitem";
        subject: string | undefined;
        list: string | undefined;
        createdAt: string;
    };
}
export declare class ThreadgateRecord {
    readonly $type: "app.bsky.feed.threadgate";
    post?: string;
    allow: unknown;
    createdAt: string;
    constructor(input?: {
        post?: string;
        allow?: unknown;
        createdAt?: string;
    });
    check(): void;
    toJSON(): {
        $type: "app.bsky.feed.threadgate";
        post: string | undefined;
        allow: unknown;
        createdAt: string;
    };
}
export declare class PostRecord {
    readonly $type: "app.bsky.feed.post";
    text: string;
    createdAt: string;
    facets?: unknown[];
    langs?: string[];
    reply?: {
        root?: unknown;
        parent?: unknown;
    };
    embed?: unknown;
    constructor(input?: {
        text?: string;
        createdAt?: string;
        facets?: unknown[];
        langs?: string[];
        reply?: {
            root?: unknown;
            parent?: unknown;
        };
        embed?: unknown;
    });
    check(): void;
    toJSON(): Record<string, unknown>;
}
export declare class ExternalEmbed {
    uri?: string;
    title?: string;
    description?: string;
    thumb?: unknown;
    constructor(input?: {
        url?: string;
        uri?: string;
        title?: string;
        description?: string;
        thumb?: unknown;
    });
    toJSON(): {
        $type: "app.bsky.embed.external";
        external: Record<string, unknown>;
    };
}
export declare class ImagesEmbed {
    readonly images: readonly {
        alt?: string;
        blob?: unknown;
        image?: unknown;
    }[];
    constructor(images?: readonly {
        alt?: string;
        blob?: unknown;
        image?: unknown;
    }[]);
    toJSON(): {
        $type: "app.bsky.embed.images";
        images: {
            alt: string;
            image: unknown;
        }[];
    };
}
export declare class VideoEmbed {
    video?: unknown;
    alt?: string;
    aspectRatio?: {
        width?: number;
        height?: number;
    };
    constructor(input?: {
        video?: unknown;
        blob?: unknown;
        alt?: string;
        aspectRatio?: {
            width?: number;
            height?: number;
        };
    });
    toJSON(): Record<string, unknown>;
}
export declare class RecordEmbed {
    uri?: string;
    cid?: string;
    constructor(input?: {
        uri?: string;
        cid?: string;
    });
    toJSON(): {
        $type: "app.bsky.embed.record";
        record: {
            uri: string | undefined;
            cid: string | undefined;
        };
    };
}
export declare class RecordWithMediaEmbed {
    uri?: string;
    cid?: string;
    media?: unknown;
    constructor(input?: {
        uri?: string;
        cid?: string;
        media?: unknown;
    });
    toJSON(): {
        $type: "app.bsky.embed.recordWithMedia";
        record: {
            $type: "app.bsky.embed.record";
            record: {
                uri: string | undefined;
                cid: string | undefined;
            };
        };
        media: unknown;
    };
}
export declare class ChatDeclarationRecord {
    readonly $type: "chat.bsky.actor.declaration";
    allowIncoming: 'none' | 'following' | 'all';
    constructor(allowIncoming?: string);
    toJSON(): {
        $type: "chat.bsky.actor.declaration";
        allowIncoming: "none" | "following" | "all";
    };
}
export declare class DeleteWrite {
    readonly $type: "com.atproto.repo.applyWrites#delete";
    collection?: string;
    rkey?: string;
    constructor(input?: {
        collection?: string;
        rkey?: string;
    });
    toJSON(): {
        $type: "com.atproto.repo.applyWrites#delete";
        collection: string | undefined;
        rkey: string | undefined;
    };
}
export interface SavedFeedItem {
    id?: string;
    type: string;
    value: string;
    pinned: boolean;
}
export declare function savedFeedItems(preferences: readonly {
    $type?: string;
    items?: SavedFeedItem[];
    pinned?: string[];
    saved?: string[];
}[] | null | undefined): SavedFeedItem[];
export declare function applySavedFeeds(preferences: readonly Record<string, unknown>[] | null | undefined, items: readonly {
    id?: string;
    type?: string;
    value?: string;
    pinned?: boolean;
}[]): Record<string, unknown>[];
