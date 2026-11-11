export declare const linksDoc: {
    readonly lexicon: 1;
    readonly id: "app.libresky.actor.links";
    readonly description: "Public social links LibreSky shows under a profile. Stored in the account repo, so another LibreSky window can read them.";
    readonly defs: {
        readonly main: {
            readonly type: "record";
            readonly description: "The account's social link row.";
            readonly key: "literal:self";
            readonly record: {
                readonly type: "object";
                readonly required: readonly ["links"];
                readonly properties: {
                    readonly links: {
                        readonly type: "array";
                        readonly maxLength: 8;
                        readonly items: {
                            readonly type: "ref";
                            readonly ref: "#link";
                        };
                    };
                };
            };
        };
        readonly link: {
            readonly type: "object";
            readonly required: readonly ["url"];
            readonly properties: {
                readonly url: {
                    readonly type: "string";
                    readonly format: "uri";
                    readonly maxLength: 2000;
                };
                readonly label: {
                    readonly type: "string";
                    readonly maxLength: 80;
                    readonly maxGraphemes: 40;
                };
                readonly kind: {
                    readonly type: "string";
                    readonly knownValues: readonly ["website", "x", "instagram", "youtube", "github", "mastodon", "tiktok", "facebook", "linkedin", "threads", "bluesky", "discord", "twitch", "reddit", "spotify", "telegram", "patreon", "paypal", "other"];
                    readonly maxLength: 32;
                };
            };
        };
    };
};
export declare const highlightDoc: {
    readonly lexicon: 1;
    readonly id: "app.libresky.feed.highlight";
    readonly description: "A post the account shows on its Highlights tab. The record is public in the account repo.";
    readonly defs: {
        readonly main: {
            readonly type: "record";
            readonly description: "A highlighted post.";
            readonly key: "tid";
            readonly record: {
                readonly type: "object";
                readonly required: readonly ["subject", "createdAt"];
                readonly properties: {
                    readonly subject: {
                        readonly type: "ref";
                        readonly ref: "com.atproto.repo.strongRef";
                    };
                    readonly createdAt: {
                        readonly type: "string";
                        readonly format: "datetime";
                    };
                };
            };
        };
    };
};
export declare const articleDoc: {
    readonly lexicon: 1;
    readonly id: "app.libresky.article.article";
    readonly description: "A long article LibreSky shows on the profile Articles tab. The record is public in the account repo.";
    readonly defs: {
        readonly main: {
            readonly type: "record";
            readonly description: "One article.";
            readonly key: "tid";
            readonly record: {
                readonly type: "object";
                readonly required: readonly ["title", "text", "createdAt"];
                readonly properties: {
                    readonly title: {
                        readonly type: "string";
                        readonly maxLength: 3000;
                        readonly maxGraphemes: 300;
                    };
                    readonly text: {
                        readonly type: "string";
                        readonly maxLength: 100000;
                        readonly maxGraphemes: 25000;
                    };
                    readonly summary: {
                        readonly type: "string";
                        readonly maxLength: 4000;
                        readonly maxGraphemes: 400;
                    };
                    readonly cover: {
                        readonly type: "blob";
                        readonly accept: readonly ["image/png", "image/jpeg"];
                        readonly maxSize: 1000000;
                    };
                    readonly createdAt: {
                        readonly type: "string";
                        readonly format: "datetime";
                    };
                    readonly updatedAt: {
                        readonly type: "string";
                        readonly format: "datetime";
                    };
                };
            };
        };
    };
};
export declare const presenceDoc: {
    readonly lexicon: 1;
    readonly id: "app.libresky.actor.presence";
    readonly description: "Internal last seen LibreSky writes while the app is open. Another LibreSky window reads it to tell a LibreSky account from any other, and to show online and available. The time is not shown.";
    readonly defs: {
        readonly main: {
            readonly type: "record";
            readonly description: "The account's last seen.";
            readonly key: "literal:self";
            readonly record: {
                readonly type: "object";
                readonly required: readonly ["seenAt"];
                readonly properties: {
                    readonly seenAt: {
                        readonly type: "string";
                        readonly format: "datetime";
                    };
                    readonly status: {
                        readonly type: "string";
                        readonly knownValues: readonly ["available", "away"];
                        readonly maxLength: 16;
                    };
                };
            };
        };
    };
};
