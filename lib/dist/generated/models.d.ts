import type { RepoBlobJson } from '../data/blob.js';
import type { XrpcClient } from '../xrpc/client.js';
type SendOptions = {
    headers?: HeadersInit;
    signal?: AbortSignal;
};
/** A declaration of an account's preferences for appearing in content discovery surfaces. */
export declare class AppBskyActorContentVisibilityDeclaration {
    static readonly nsid = "app.bsky.actor.contentVisibilityDeclaration";
    static readonly def = "main";
    static readonly kind: "record";
    static readonly recordKey = "literal:self";
    $type: string;
    hideFromAlgorithmicRecommendations: boolean;
    constructor(input?: Partial<AppBskyActorContentVisibilityDeclaration>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyActorContentVisibilityDeclaration;
}
export declare class AppBskyActorDefsAdultContentPref {
    static readonly nsid = "app.bsky.actor.defs";
    static readonly def = "adultContentPref";
    static readonly kind: "object";
    $type: string;
    enabled: boolean;
    constructor(input?: Partial<AppBskyActorDefsAdultContentPref>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyActorDefsAdultContentPref;
}
/** If set, an active progress guide. Once completed, can be set to undefined. Should have unspecced fields tracking progress. */
export declare class AppBskyActorDefsBskyAppProgressGuide {
    static readonly nsid = "app.bsky.actor.defs";
    static readonly def = "bskyAppProgressGuide";
    static readonly kind: "object";
    $type: string;
    guide: string;
    constructor(input?: Partial<AppBskyActorDefsBskyAppProgressGuide>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyActorDefsBskyAppProgressGuide;
}
/** A grab bag of state that's specific to the bsky.app program. Third-party apps shouldn't use this. */
export declare class AppBskyActorDefsBskyAppStatePref {
    static readonly nsid = "app.bsky.actor.defs";
    static readonly def = "bskyAppStatePref";
    static readonly kind: "object";
    $type: string;
    activeProgressGuide?: AppBskyActorDefsBskyAppProgressGuide;
    isBetaUser?: boolean;
    queuedNudges?: Array<string>;
    nuxs?: Array<AppBskyActorDefsNux>;
    constructor(input?: Partial<AppBskyActorDefsBskyAppStatePref>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyActorDefsBskyAppStatePref;
}
export declare class AppBskyActorDefsContentLabelPref {
    static readonly nsid = "app.bsky.actor.defs";
    static readonly def = "contentLabelPref";
    static readonly kind: "object";
    $type: string;
    labelerDid?: string;
    label: string;
    visibility: "ignore" | "show" | "warn" | "hide" | (string & {});
    constructor(input?: Partial<AppBskyActorDefsContentLabelPref>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyActorDefsContentLabelPref;
}
/** Read-only preference containing value(s) inferred from the user's declared birthdate. Absence of this preference object in the response indicates that the user has not made a declaration. */
export declare class AppBskyActorDefsDeclaredAgePref {
    static readonly nsid = "app.bsky.actor.defs";
    static readonly def = "declaredAgePref";
    static readonly kind: "object";
    $type: string;
    isOverAge13?: boolean;
    isOverAge16?: boolean;
    isOverAge18?: boolean;
    constructor(input?: Partial<AppBskyActorDefsDeclaredAgePref>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyActorDefsDeclaredAgePref;
}
export declare class AppBskyActorDefsFeedViewPref {
    static readonly nsid = "app.bsky.actor.defs";
    static readonly def = "feedViewPref";
    static readonly kind: "object";
    $type: string;
    feed: string;
    hideReplies?: boolean;
    hideRepliesByUnfollowed?: boolean;
    hideRepliesByLikeCount?: number;
    hideReposts?: boolean;
    hideQuotePosts?: boolean;
    constructor(input?: Partial<AppBskyActorDefsFeedViewPref>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyActorDefsFeedViewPref;
}
export declare class AppBskyActorDefsHiddenPostsPref {
    static readonly nsid = "app.bsky.actor.defs";
    static readonly def = "hiddenPostsPref";
    static readonly kind: "object";
    $type: string;
    items: Array<string>;
    constructor(input?: Partial<AppBskyActorDefsHiddenPostsPref>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyActorDefsHiddenPostsPref;
}
export declare class AppBskyActorDefsInterestsPref {
    static readonly nsid = "app.bsky.actor.defs";
    static readonly def = "interestsPref";
    static readonly kind: "object";
    $type: string;
    updatedAt?: string;
    tags: Array<string>;
    constructor(input?: Partial<AppBskyActorDefsInterestsPref>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyActorDefsInterestsPref;
}
/** The subject's followers whom you also follow */
export declare class AppBskyActorDefsKnownFollowers {
    static readonly nsid = "app.bsky.actor.defs";
    static readonly def = "knownFollowers";
    static readonly kind: "object";
    $type: string;
    count: number;
    followers: Array<AppBskyActorDefsProfileViewBasic>;
    constructor(input?: Partial<AppBskyActorDefsKnownFollowers>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyActorDefsKnownFollowers;
}
export declare class AppBskyActorDefsLabelerPrefItem {
    static readonly nsid = "app.bsky.actor.defs";
    static readonly def = "labelerPrefItem";
    static readonly kind: "object";
    $type: string;
    did: string;
    constructor(input?: Partial<AppBskyActorDefsLabelerPrefItem>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyActorDefsLabelerPrefItem;
}
export declare class AppBskyActorDefsLabelersPref {
    static readonly nsid = "app.bsky.actor.defs";
    static readonly def = "labelersPref";
    static readonly kind: "object";
    $type: string;
    labelers: Array<AppBskyActorDefsLabelerPrefItem>;
    constructor(input?: Partial<AppBskyActorDefsLabelersPref>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyActorDefsLabelersPref;
}
/** Preferences for live events. */
export declare class AppBskyActorDefsLiveEventPreferences {
    static readonly nsid = "app.bsky.actor.defs";
    static readonly def = "liveEventPreferences";
    static readonly kind: "object";
    $type: string;
    hiddenFeedIds?: Array<string>;
    hideAllFeeds?: boolean;
    constructor(input?: Partial<AppBskyActorDefsLiveEventPreferences>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyActorDefsLiveEventPreferences;
}
/** A word that the account owner has muted. */
export declare class AppBskyActorDefsMutedWord {
    static readonly nsid = "app.bsky.actor.defs";
    static readonly def = "mutedWord";
    static readonly kind: "object";
    $type: string;
    id?: string;
    value: string;
    targets: Array<("content" | "tag" | (string & {}))>;
    actorTarget?: "all" | "exclude-following" | (string & {});
    expiresAt?: string;
    constructor(input?: Partial<AppBskyActorDefsMutedWord>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyActorDefsMutedWord;
}
export declare class AppBskyActorDefsMutedWordsPref {
    static readonly nsid = "app.bsky.actor.defs";
    static readonly def = "mutedWordsPref";
    static readonly kind: "object";
    $type: string;
    items: Array<AppBskyActorDefsMutedWord>;
    constructor(input?: Partial<AppBskyActorDefsMutedWordsPref>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyActorDefsMutedWordsPref;
}
export declare class AppBskyActorDefsMutedWordTarget {
    static readonly nsid = "app.bsky.actor.defs";
    static readonly def = "mutedWordTarget";
    static readonly kind: "string";
    static readonly knownValues: readonly ["content", "tag"];
    static includes(value: string): boolean;
    private constructor();
}
/** A new user experiences (NUX) storage object */
export declare class AppBskyActorDefsNux {
    static readonly nsid = "app.bsky.actor.defs";
    static readonly def = "nux";
    static readonly kind: "object";
    $type: string;
    id: string;
    completed: boolean;
    data?: string;
    expiresAt?: string;
    constructor(input?: Partial<AppBskyActorDefsNux>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyActorDefsNux;
}
export declare class AppBskyActorDefsPersonalDetailsPref {
    static readonly nsid = "app.bsky.actor.defs";
    static readonly def = "personalDetailsPref";
    static readonly kind: "object";
    $type: string;
    birthDate?: string;
    constructor(input?: Partial<AppBskyActorDefsPersonalDetailsPref>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyActorDefsPersonalDetailsPref;
}
/** Default post interaction settings for the account. These values should be applied as default values when creating new posts. These refs should mirror the threadgate and postgate records exactly. */
export declare class AppBskyActorDefsPostInteractionSettingsPref {
    static readonly nsid = "app.bsky.actor.defs";
    static readonly def = "postInteractionSettingsPref";
    static readonly kind: "object";
    $type: string;
    threadgateAllowRules?: Array<(AppBskyFeedThreadgateMentionRule | AppBskyFeedThreadgateFollowerRule | AppBskyFeedThreadgateFollowingRule | AppBskyFeedThreadgateListRule | {
        $type?: string;
    })>;
    postgateEmbeddingRules?: Array<(AppBskyFeedPostgateDisableRule | {
        $type?: string;
    })>;
    constructor(input?: Partial<AppBskyActorDefsPostInteractionSettingsPref>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyActorDefsPostInteractionSettingsPref;
}
export type AppBskyActorDefsPreferences = Array<(AppBskyActorDefsAdultContentPref | AppBskyActorDefsContentLabelPref | AppBskyActorDefsSavedFeedsPref | AppBskyActorDefsSavedFeedsPrefV2 | AppBskyActorDefsPersonalDetailsPref | AppBskyActorDefsDeclaredAgePref | AppBskyActorDefsFeedViewPref | AppBskyActorDefsThreadViewPref | AppBskyActorDefsInterestsPref | AppBskyActorDefsMutedWordsPref | AppBskyActorDefsHiddenPostsPref | AppBskyActorDefsBskyAppStatePref | AppBskyActorDefsLabelersPref | AppBskyActorDefsPostInteractionSettingsPref | AppBskyActorDefsVerificationPrefs | AppBskyActorDefsLiveEventPreferences | {
    $type?: string;
})>;
export declare const AppBskyActorDefsPreferences: {
    nsid: string;
    def: string;
    kind: "array";
};
export declare class AppBskyActorDefsProfileAssociated {
    static readonly nsid = "app.bsky.actor.defs";
    static readonly def = "profileAssociated";
    static readonly kind: "object";
    $type: string;
    lists?: number;
    feedgens?: number;
    starterPacks?: number;
    labeler?: boolean;
    chat?: AppBskyActorDefsProfileAssociatedChat;
    activitySubscription?: AppBskyActorDefsProfileAssociatedActivitySubscription;
    germ?: AppBskyActorDefsProfileAssociatedGerm;
    constructor(input?: Partial<AppBskyActorDefsProfileAssociated>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyActorDefsProfileAssociated;
}
export declare class AppBskyActorDefsProfileAssociatedActivitySubscription {
    static readonly nsid = "app.bsky.actor.defs";
    static readonly def = "profileAssociatedActivitySubscription";
    static readonly kind: "object";
    $type: string;
    allowSubscriptions: "followers" | "mutuals" | "none" | (string & {});
    constructor(input?: Partial<AppBskyActorDefsProfileAssociatedActivitySubscription>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyActorDefsProfileAssociatedActivitySubscription;
}
export declare class AppBskyActorDefsProfileAssociatedChat {
    static readonly nsid = "app.bsky.actor.defs";
    static readonly def = "profileAssociatedChat";
    static readonly kind: "object";
    $type: string;
    allowIncoming: "all" | "none" | "following" | (string & {});
    allowGroupInvites?: "all" | "none" | "following" | (string & {});
    constructor(input?: Partial<AppBskyActorDefsProfileAssociatedChat>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyActorDefsProfileAssociatedChat;
}
export declare class AppBskyActorDefsProfileAssociatedGerm {
    static readonly nsid = "app.bsky.actor.defs";
    static readonly def = "profileAssociatedGerm";
    static readonly kind: "object";
    $type: string;
    messageMeUrl: string;
    showButtonTo: "usersIFollow" | "everyone" | (string & {});
    constructor(input?: Partial<AppBskyActorDefsProfileAssociatedGerm>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyActorDefsProfileAssociatedGerm;
}
export declare class AppBskyActorDefsProfileLinkView {
    static readonly nsid = "app.bsky.actor.defs";
    static readonly def = "profileLinkView";
    static readonly kind: "object";
    $type: string;
    uri: string;
    cid: string;
    url: string;
    title?: string;
    icon?: string;
    labels?: Array<ComAtprotoLabelDefsLabel>;
    constructor(input?: Partial<AppBskyActorDefsProfileLinkView>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyActorDefsProfileLinkView;
}
export declare class AppBskyActorDefsProfileView {
    static readonly nsid = "app.bsky.actor.defs";
    static readonly def = "profileView";
    static readonly kind: "object";
    $type: string;
    did: string;
    handle: string;
    displayName?: string;
    pronouns?: string;
    description?: string;
    avatar?: string;
    associated?: AppBskyActorDefsProfileAssociated;
    indexedAt?: string;
    createdAt?: string;
    viewer?: AppBskyActorDefsViewerState;
    labels?: Array<ComAtprotoLabelDefsLabel>;
    verification?: AppBskyActorDefsVerificationState;
    status?: AppBskyActorDefsStatusView;
    debug?: unknown;
    constructor(input?: Partial<AppBskyActorDefsProfileView>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyActorDefsProfileView;
}
export declare class AppBskyActorDefsProfileViewBasic {
    static readonly nsid = "app.bsky.actor.defs";
    static readonly def = "profileViewBasic";
    static readonly kind: "object";
    $type: string;
    did: string;
    handle: string;
    displayName?: string;
    pronouns?: string;
    avatar?: string;
    associated?: AppBskyActorDefsProfileAssociated;
    viewer?: AppBskyActorDefsViewerState;
    labels?: Array<ComAtprotoLabelDefsLabel>;
    createdAt?: string;
    verification?: AppBskyActorDefsVerificationState;
    status?: AppBskyActorDefsStatusView;
    debug?: unknown;
    constructor(input?: Partial<AppBskyActorDefsProfileViewBasic>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyActorDefsProfileViewBasic;
}
export declare class AppBskyActorDefsProfileViewDetailed {
    static readonly nsid = "app.bsky.actor.defs";
    static readonly def = "profileViewDetailed";
    static readonly kind: "object";
    $type: string;
    did: string;
    handle: string;
    displayName?: string;
    description?: string;
    pronouns?: string;
    website?: string;
    avatar?: string;
    banner?: string;
    followersCount?: number;
    followsCount?: number;
    postsCount?: number;
    associated?: AppBskyActorDefsProfileAssociated;
    joinedViaStarterPack?: AppBskyGraphDefsStarterPackViewBasic;
    indexedAt?: string;
    createdAt?: string;
    viewer?: AppBskyActorDefsViewerState;
    labels?: Array<ComAtprotoLabelDefsLabel>;
    pinnedPost?: ComAtprotoRepoStrongRef;
    links?: Array<AppBskyActorDefsProfileLinkView>;
    verification?: AppBskyActorDefsVerificationState;
    status?: AppBskyActorDefsStatusView;
    debug?: unknown;
    constructor(input?: Partial<AppBskyActorDefsProfileViewDetailed>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyActorDefsProfileViewDetailed;
}
export declare class AppBskyActorDefsSavedFeed {
    static readonly nsid = "app.bsky.actor.defs";
    static readonly def = "savedFeed";
    static readonly kind: "object";
    $type: string;
    id: string;
    type: "feed" | "list" | "timeline" | (string & {});
    value: string;
    pinned: boolean;
    constructor(input?: Partial<AppBskyActorDefsSavedFeed>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyActorDefsSavedFeed;
}
export declare class AppBskyActorDefsSavedFeedsPref {
    static readonly nsid = "app.bsky.actor.defs";
    static readonly def = "savedFeedsPref";
    static readonly kind: "object";
    $type: string;
    pinned: Array<string>;
    saved: Array<string>;
    timelineIndex?: number;
    constructor(input?: Partial<AppBskyActorDefsSavedFeedsPref>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyActorDefsSavedFeedsPref;
}
export declare class AppBskyActorDefsSavedFeedsPrefV2 {
    static readonly nsid = "app.bsky.actor.defs";
    static readonly def = "savedFeedsPrefV2";
    static readonly kind: "object";
    $type: string;
    items: Array<AppBskyActorDefsSavedFeed>;
    constructor(input?: Partial<AppBskyActorDefsSavedFeedsPrefV2>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyActorDefsSavedFeedsPrefV2;
}
export declare class AppBskyActorDefsStatusView {
    static readonly nsid = "app.bsky.actor.defs";
    static readonly def = "statusView";
    static readonly kind: "object";
    $type: string;
    uri?: string;
    cid?: string;
    status: "app.bsky.actor.status#live" | (string & {});
    record: unknown;
    embed?: AppBskyEmbedExternalView | {
        $type?: string;
    };
    labels?: Array<ComAtprotoLabelDefsLabel>;
    expiresAt?: string;
    isActive?: boolean;
    isDisabled?: boolean;
    constructor(input?: Partial<AppBskyActorDefsStatusView>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyActorDefsStatusView;
}
export declare class AppBskyActorDefsThreadViewPref {
    static readonly nsid = "app.bsky.actor.defs";
    static readonly def = "threadViewPref";
    static readonly kind: "object";
    $type: string;
    sort?: "oldest" | "newest" | "most-likes" | "random" | "hotness" | (string & {});
    constructor(input?: Partial<AppBskyActorDefsThreadViewPref>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyActorDefsThreadViewPref;
}
/** Preferences for how verified accounts appear in the app. */
export declare class AppBskyActorDefsVerificationPrefs {
    static readonly nsid = "app.bsky.actor.defs";
    static readonly def = "verificationPrefs";
    static readonly kind: "object";
    $type: string;
    hideBadges?: boolean;
    constructor(input?: Partial<AppBskyActorDefsVerificationPrefs>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyActorDefsVerificationPrefs;
}
/** Represents the verification information about the user this object is attached to. */
export declare class AppBskyActorDefsVerificationState {
    static readonly nsid = "app.bsky.actor.defs";
    static readonly def = "verificationState";
    static readonly kind: "object";
    $type: string;
    verifications: Array<AppBskyActorDefsVerificationView>;
    verifiedStatus: "valid" | "invalid" | "none" | (string & {});
    trustedVerifierStatus: "valid" | "invalid" | "none" | (string & {});
    constructor(input?: Partial<AppBskyActorDefsVerificationState>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyActorDefsVerificationState;
}
/** An individual verification for an associated subject. */
export declare class AppBskyActorDefsVerificationView {
    static readonly nsid = "app.bsky.actor.defs";
    static readonly def = "verificationView";
    static readonly kind: "object";
    $type: string;
    issuer: string;
    issuerDisplayName?: string;
    issuerHandle?: string;
    uri: string;
    isValid: boolean;
    createdAt: string;
    constructor(input?: Partial<AppBskyActorDefsVerificationView>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyActorDefsVerificationView;
}
/** Metadata about the requesting account's relationship with the subject account. Only has meaningful content for authed requests. */
export declare class AppBskyActorDefsViewerState {
    static readonly nsid = "app.bsky.actor.defs";
    static readonly def = "viewerState";
    static readonly kind: "object";
    $type: string;
    muted?: boolean;
    mutedOnlyReposts?: boolean;
    mutedOnlyQuoteposts?: boolean;
    mutedByList?: AppBskyGraphDefsListViewBasic;
    blockedBy?: boolean;
    blocking?: string;
    blockingByList?: AppBskyGraphDefsListViewBasic;
    following?: string;
    followedBy?: string;
    knownFollowers?: AppBskyActorDefsKnownFollowers;
    activitySubscription?: AppBskyNotificationDefsActivitySubscription;
    constructor(input?: Partial<AppBskyActorDefsViewerState>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyActorDefsViewerState;
}
/** Get private preferences attached to the current account. Expected use is synchronization between multiple devices, and import/export during account migration. Requires auth. */
export declare class AppBskyActorGetPreferences {
    static readonly nsid = "app.bsky.actor.getPreferences";
    static readonly def = "main";
    static readonly kind: "query";
    static readonly http: "GET";
    static readonly errorNames: readonly [];
    constructor(input?: Partial<AppBskyActorGetPreferences>);
    toParams(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): AppBskyActorGetPreferences;
}
export type AppBskyActorGetPreferencesOutput = {
    preferences: AppBskyActorDefsPreferences;
};
/** Get detailed profile view of an actor. Does not require auth, but contains relevant metadata with auth. */
export declare class AppBskyActorGetProfile {
    static readonly nsid = "app.bsky.actor.getProfile";
    static readonly def = "main";
    static readonly kind: "query";
    static readonly http: "GET";
    static readonly errorNames: readonly [];
    actor: string;
    constructor(input?: Partial<AppBskyActorGetProfile>);
    toParams(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): AppBskyActorGetProfile;
}
export type AppBskyActorGetProfileOutput = AppBskyActorDefsProfileViewDetailed;
/** Get detailed profile views of multiple actors. */
export declare class AppBskyActorGetProfiles {
    static readonly nsid = "app.bsky.actor.getProfiles";
    static readonly def = "main";
    static readonly kind: "query";
    static readonly http: "GET";
    static readonly errorNames: readonly [];
    actors: Array<string>;
    constructor(input?: Partial<AppBskyActorGetProfiles>);
    toParams(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): AppBskyActorGetProfiles;
}
export type AppBskyActorGetProfilesOutput = {
    profiles: Array<AppBskyActorDefsProfileViewDetailed>;
};
/** Get a list of suggested actors. Expected use is discovery of accounts to follow during new account onboarding. */
export declare class AppBskyActorGetSuggestions {
    static readonly nsid = "app.bsky.actor.getSuggestions";
    static readonly def = "main";
    static readonly kind: "query";
    static readonly http: "GET";
    static readonly errorNames: readonly [];
    limit?: number;
    cursor?: string;
    constructor(input?: Partial<AppBskyActorGetSuggestions>);
    toParams(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): AppBskyActorGetSuggestions;
}
export type AppBskyActorGetSuggestionsOutput = {
    cursor?: string;
    actors: Array<AppBskyActorDefsProfileView>;
    recId?: number;
    recIdStr?: string;
};
/** A link shown on the account's profile. The profile record's links field sets which links are shown, and in what order. */
export declare class AppBskyActorLink {
    static readonly nsid = "app.bsky.actor.link";
    static readonly def = "main";
    static readonly kind: "record";
    static readonly recordKey = "tid";
    $type: string;
    url: string;
    title?: string;
    icon?: RepoBlobJson;
    createdAt: string;
    labels?: ComAtprotoLabelDefsSelfLabels | {
        $type?: string;
    };
    constructor(input?: Partial<AppBskyActorLink>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyActorLink;
}
/** A declaration of a Bluesky account profile. */
export declare class AppBskyActorProfile {
    static readonly nsid = "app.bsky.actor.profile";
    static readonly def = "main";
    static readonly kind: "record";
    static readonly recordKey = "literal:self";
    $type: string;
    displayName?: string;
    description?: string;
    pronouns?: string;
    website?: string;
    avatar?: RepoBlobJson;
    banner?: RepoBlobJson;
    labels?: ComAtprotoLabelDefsSelfLabels | {
        $type?: string;
    };
    joinedViaStarterPack?: ComAtprotoRepoStrongRef;
    pinnedPost?: ComAtprotoRepoStrongRef;
    links?: Array<ComAtprotoRepoStrongRef>;
    createdAt?: string;
    constructor(input?: Partial<AppBskyActorProfile>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyActorProfile;
}
/** Set the private preferences attached to the account. */
export declare class AppBskyActorPutPreferences {
    static readonly nsid = "app.bsky.actor.putPreferences";
    static readonly def = "main";
    static readonly kind: "procedure";
    static readonly http: "POST";
    static readonly errorNames: readonly [];
    preferences: AppBskyActorDefsPreferences;
    constructor(input?: Partial<AppBskyActorPutPreferences>);
    toParams(): Record<string, unknown>;
    toBody(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): AppBskyActorPutPreferences;
}
export type AppBskyActorPutPreferencesOutput = Record<string, unknown>;
/** Find actors (profiles) matching search criteria. Does not require auth. */
export declare class AppBskyActorSearchActors {
    static readonly nsid = "app.bsky.actor.searchActors";
    static readonly def = "main";
    static readonly kind: "query";
    static readonly http: "GET";
    static readonly errorNames: readonly [];
    term?: string;
    q?: string;
    limit?: number;
    cursor?: string;
    constructor(input?: Partial<AppBskyActorSearchActors>);
    toParams(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): AppBskyActorSearchActors;
}
export type AppBskyActorSearchActorsOutput = {
    cursor?: string;
    actors: Array<AppBskyActorDefsProfileView>;
};
/** Find actor suggestions for a prefix search term. Expected use is for auto-completion during text field entry. Does not require auth. */
export declare class AppBskyActorSearchActorsTypeahead {
    static readonly nsid = "app.bsky.actor.searchActorsTypeahead";
    static readonly def = "main";
    static readonly kind: "query";
    static readonly http: "GET";
    static readonly errorNames: readonly [];
    term?: string;
    q?: string;
    limit?: number;
    constructor(input?: Partial<AppBskyActorSearchActorsTypeahead>);
    toParams(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): AppBskyActorSearchActorsTypeahead;
}
export type AppBskyActorSearchActorsTypeaheadOutput = {
    actors: Array<AppBskyActorDefsProfileViewBasic>;
};
/** A declaration of a Bluesky account status. */
export declare class AppBskyActorStatus {
    static readonly nsid = "app.bsky.actor.status";
    static readonly def = "main";
    static readonly kind: "record";
    static readonly recordKey = "literal:self";
    $type: string;
    status: "app.bsky.actor.status#live" | (string & {});
    embed?: AppBskyEmbedExternal | {
        $type?: string;
    };
    durationMinutes?: number;
    createdAt: string;
    constructor(input?: Partial<AppBskyActorStatus>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyActorStatus;
}
/** Advertises an account as currently offering live content. */
export declare class AppBskyActorStatusLive {
    static readonly nsid = "app.bsky.actor.status";
    static readonly def = "live";
    static readonly kind: "token";
    static readonly value = "app.bsky.actor.status#live";
    static readonly description = "Advertises an account as currently offering live content.";
    private constructor();
}
/** Initiate Age Assurance for an account. */
export declare class AppBskyAgeassuranceBegin {
    static readonly nsid = "app.bsky.ageassurance.begin";
    static readonly def = "main";
    static readonly kind: "procedure";
    static readonly http: "POST";
    static readonly errorNames: readonly ["InvalidEmail", "DidTooLong", "InvalidInitiation", "RegionNotSupported"];
    email: string;
    language: string;
    countryCode: string;
    regionCode?: string;
    constructor(input?: Partial<AppBskyAgeassuranceBegin>);
    toParams(): Record<string, unknown>;
    toBody(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): AppBskyAgeassuranceBegin;
}
export type AppBskyAgeassuranceBeginOutput = AppBskyAgeassuranceDefsState;
/** The access level granted based on Age Assurance data we've processed. */
export declare class AppBskyAgeassuranceDefsAccess {
    static readonly nsid = "app.bsky.ageassurance.defs";
    static readonly def = "access";
    static readonly kind: "string";
    static readonly knownValues: readonly ["unknown", "none", "safe", "full"];
    static includes(value: string): boolean;
    private constructor();
}
export declare class AppBskyAgeassuranceDefsConfig {
    static readonly nsid = "app.bsky.ageassurance.defs";
    static readonly def = "config";
    static readonly kind: "object";
    $type: string;
    regions: Array<AppBskyAgeassuranceDefsConfigRegion>;
    constructor(input?: Partial<AppBskyAgeassuranceDefsConfig>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyAgeassuranceDefsConfig;
}
/** The Age Assurance configuration for a specific region. */
export declare class AppBskyAgeassuranceDefsConfigRegion {
    static readonly nsid = "app.bsky.ageassurance.defs";
    static readonly def = "configRegion";
    static readonly kind: "object";
    $type: string;
    platforms?: Array<("web" | "ios" | "android" | (string & {}))>;
    countryCode: string;
    regionCode?: string;
    minAccessAge: number;
    additionalVerificationMethods?: Array<("device" | (string & {}))>;
    rules: Array<(AppBskyAgeassuranceDefsConfigRegionRuleDefault | AppBskyAgeassuranceDefsConfigRegionRuleIfDeclaredOverAge | AppBskyAgeassuranceDefsConfigRegionRuleIfDeclaredUnderAge | AppBskyAgeassuranceDefsConfigRegionRuleIfAssuredOverAge | AppBskyAgeassuranceDefsConfigRegionRuleIfAssuredUnderAge | AppBskyAgeassuranceDefsConfigRegionRuleIfAccountNewerThan | AppBskyAgeassuranceDefsConfigRegionRuleIfAccountOlderThan | {
        $type?: string;
    })>;
    constructor(input?: Partial<AppBskyAgeassuranceDefsConfigRegion>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyAgeassuranceDefsConfigRegion;
}
/** Age Assurance rule that applies by default. */
export declare class AppBskyAgeassuranceDefsConfigRegionRuleDefault {
    static readonly nsid = "app.bsky.ageassurance.defs";
    static readonly def = "configRegionRuleDefault";
    static readonly kind: "object";
    $type: string;
    access: "unknown" | "none" | "safe" | "full" | (string & {});
    constructor(input?: Partial<AppBskyAgeassuranceDefsConfigRegionRuleDefault>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyAgeassuranceDefsConfigRegionRuleDefault;
}
/** Age Assurance rule that applies if the account is equal-to or newer than a certain date. */
export declare class AppBskyAgeassuranceDefsConfigRegionRuleIfAccountNewerThan {
    static readonly nsid = "app.bsky.ageassurance.defs";
    static readonly def = "configRegionRuleIfAccountNewerThan";
    static readonly kind: "object";
    $type: string;
    date: string;
    access: "unknown" | "none" | "safe" | "full" | (string & {});
    constructor(input?: Partial<AppBskyAgeassuranceDefsConfigRegionRuleIfAccountNewerThan>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyAgeassuranceDefsConfigRegionRuleIfAccountNewerThan;
}
/** Age Assurance rule that applies if the account is older than a certain date. */
export declare class AppBskyAgeassuranceDefsConfigRegionRuleIfAccountOlderThan {
    static readonly nsid = "app.bsky.ageassurance.defs";
    static readonly def = "configRegionRuleIfAccountOlderThan";
    static readonly kind: "object";
    $type: string;
    date: string;
    access: "unknown" | "none" | "safe" | "full" | (string & {});
    constructor(input?: Partial<AppBskyAgeassuranceDefsConfigRegionRuleIfAccountOlderThan>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyAgeassuranceDefsConfigRegionRuleIfAccountOlderThan;
}
/** Age Assurance rule that applies if the user has been assured to be equal-to or over a certain age. */
export declare class AppBskyAgeassuranceDefsConfigRegionRuleIfAssuredOverAge {
    static readonly nsid = "app.bsky.ageassurance.defs";
    static readonly def = "configRegionRuleIfAssuredOverAge";
    static readonly kind: "object";
    $type: string;
    age: number;
    access: "unknown" | "none" | "safe" | "full" | (string & {});
    constructor(input?: Partial<AppBskyAgeassuranceDefsConfigRegionRuleIfAssuredOverAge>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyAgeassuranceDefsConfigRegionRuleIfAssuredOverAge;
}
/** Age Assurance rule that applies if the user has been assured to be under a certain age. */
export declare class AppBskyAgeassuranceDefsConfigRegionRuleIfAssuredUnderAge {
    static readonly nsid = "app.bsky.ageassurance.defs";
    static readonly def = "configRegionRuleIfAssuredUnderAge";
    static readonly kind: "object";
    $type: string;
    age: number;
    access: "unknown" | "none" | "safe" | "full" | (string & {});
    constructor(input?: Partial<AppBskyAgeassuranceDefsConfigRegionRuleIfAssuredUnderAge>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyAgeassuranceDefsConfigRegionRuleIfAssuredUnderAge;
}
/** Age Assurance rule that applies if the user has declared themselves equal-to or over a certain age. */
export declare class AppBskyAgeassuranceDefsConfigRegionRuleIfDeclaredOverAge {
    static readonly nsid = "app.bsky.ageassurance.defs";
    static readonly def = "configRegionRuleIfDeclaredOverAge";
    static readonly kind: "object";
    $type: string;
    age: number;
    access: "unknown" | "none" | "safe" | "full" | (string & {});
    constructor(input?: Partial<AppBskyAgeassuranceDefsConfigRegionRuleIfDeclaredOverAge>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyAgeassuranceDefsConfigRegionRuleIfDeclaredOverAge;
}
/** Age Assurance rule that applies if the user has declared themselves under a certain age. */
export declare class AppBskyAgeassuranceDefsConfigRegionRuleIfDeclaredUnderAge {
    static readonly nsid = "app.bsky.ageassurance.defs";
    static readonly def = "configRegionRuleIfDeclaredUnderAge";
    static readonly kind: "object";
    $type: string;
    age: number;
    access: "unknown" | "none" | "safe" | "full" | (string & {});
    constructor(input?: Partial<AppBskyAgeassuranceDefsConfigRegionRuleIfDeclaredUnderAge>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyAgeassuranceDefsConfigRegionRuleIfDeclaredUnderAge;
}
/** Object used to store Age Assurance data in stash. */
export declare class AppBskyAgeassuranceDefsEvent {
    static readonly nsid = "app.bsky.ageassurance.defs";
    static readonly def = "event";
    static readonly kind: "object";
    $type: string;
    createdAt: string;
    attemptId: string;
    status: "unknown" | "pending" | "assured" | "blocked" | (string & {});
    access: "unknown" | "none" | "safe" | "full" | (string & {});
    countryCode: string;
    regionCode?: string;
    email?: string;
    initIp?: string;
    initUa?: string;
    completeIp?: string;
    completeUa?: string;
    constructor(input?: Partial<AppBskyAgeassuranceDefsEvent>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyAgeassuranceDefsEvent;
}
/** The user's computed Age Assurance state. */
export declare class AppBskyAgeassuranceDefsState {
    static readonly nsid = "app.bsky.ageassurance.defs";
    static readonly def = "state";
    static readonly kind: "object";
    $type: string;
    lastInitiatedAt?: string;
    status: "unknown" | "pending" | "assured" | "blocked" | (string & {});
    access: "unknown" | "none" | "safe" | "full" | (string & {});
    constructor(input?: Partial<AppBskyAgeassuranceDefsState>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyAgeassuranceDefsState;
}
/** Additional metadata needed to compute Age Assurance state client-side. */
export declare class AppBskyAgeassuranceDefsStateMetadata {
    static readonly nsid = "app.bsky.ageassurance.defs";
    static readonly def = "stateMetadata";
    static readonly kind: "object";
    $type: string;
    accountCreatedAt?: string;
    constructor(input?: Partial<AppBskyAgeassuranceDefsStateMetadata>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyAgeassuranceDefsStateMetadata;
}
/** The status of the Age Assurance process. */
export declare class AppBskyAgeassuranceDefsStatus {
    static readonly nsid = "app.bsky.ageassurance.defs";
    static readonly def = "status";
    static readonly kind: "string";
    static readonly knownValues: readonly ["unknown", "pending", "assured", "blocked"];
    static includes(value: string): boolean;
    private constructor();
}
/** Returns Age Assurance configuration for use on the client. */
export declare class AppBskyAgeassuranceGetConfig {
    static readonly nsid = "app.bsky.ageassurance.getConfig";
    static readonly def = "main";
    static readonly kind: "query";
    static readonly http: "GET";
    static readonly errorNames: readonly [];
    constructor(input?: Partial<AppBskyAgeassuranceGetConfig>);
    toParams(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): AppBskyAgeassuranceGetConfig;
}
export type AppBskyAgeassuranceGetConfigOutput = AppBskyAgeassuranceDefsConfig;
/** Returns server-computed Age Assurance state, if available, and any additional metadata needed to compute Age Assurance state client-side. */
export declare class AppBskyAgeassuranceGetState {
    static readonly nsid = "app.bsky.ageassurance.getState";
    static readonly def = "main";
    static readonly kind: "query";
    static readonly http: "GET";
    static readonly errorNames: readonly [];
    countryCode: string;
    regionCode?: string;
    constructor(input?: Partial<AppBskyAgeassuranceGetState>);
    toParams(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): AppBskyAgeassuranceGetState;
}
export type AppBskyAgeassuranceGetStateOutput = {
    state: AppBskyAgeassuranceDefsState;
    metadata: AppBskyAgeassuranceDefsStateMetadata;
};
export declare class AppBskyAuthCreatePosts {
    static readonly nsid = "app.bsky.authCreatePosts";
    static readonly def = "main";
    static readonly kind: "permission-set";
    static readonly title = "Create Bluesky Posts";
    static readonly detail = "Can not update or delete posts.";
    static readonly permissions: readonly [{
        readonly type: "permission";
        readonly resource: "rpc";
        readonly inheritAud: true;
        readonly lxm: readonly ["app.bsky.video.uploadVideo", "app.bsky.video.getJobStatus", "app.bsky.video.getUploadLimits", "app.bsky.video.startUpload", "app.bsky.video.uploadPart", "app.bsky.video.finishUpload", "app.bsky.video.abortUpload", "app.bsky.video.getUploadStatus"];
    }, {
        readonly type: "permission";
        readonly resource: "repo";
        readonly action: readonly ["create"];
        readonly collection: readonly ["app.bsky.feed.post", "app.bsky.feed.postgate", "app.bsky.feed.threadgate"];
    }];
    private constructor();
    static toJSON(): {
        title: string;
        detail: string;
        permissions: readonly [{
            readonly type: "permission";
            readonly resource: "rpc";
            readonly inheritAud: true;
            readonly lxm: readonly ["app.bsky.video.uploadVideo", "app.bsky.video.getJobStatus", "app.bsky.video.getUploadLimits", "app.bsky.video.startUpload", "app.bsky.video.uploadPart", "app.bsky.video.finishUpload", "app.bsky.video.abortUpload", "app.bsky.video.getUploadStatus"];
        }, {
            readonly type: "permission";
            readonly resource: "repo";
            readonly action: readonly ["create"];
            readonly collection: readonly ["app.bsky.feed.post", "app.bsky.feed.postgate", "app.bsky.feed.threadgate"];
        }];
    };
}
export declare class AppBskyAuthDeleteContent {
    static readonly nsid = "app.bsky.authDeleteContent";
    static readonly def = "main";
    static readonly kind: "permission-set";
    static readonly title = "Delete Bluesky Content";
    static readonly detail = "Clean up public account history: posts, reposts, and likes.";
    static readonly permissions: readonly [{
        readonly type: "permission";
        readonly resource: "repo";
        readonly action: readonly ["delete"];
        readonly collection: readonly ["app.bsky.feed.like", "app.bsky.feed.post", "app.bsky.feed.postgate", "app.bsky.feed.repost", "app.bsky.feed.threadgate"];
    }];
    private constructor();
    static toJSON(): {
        title: string;
        detail: string;
        permissions: readonly [{
            readonly type: "permission";
            readonly resource: "repo";
            readonly action: readonly ["delete"];
            readonly collection: readonly ["app.bsky.feed.like", "app.bsky.feed.post", "app.bsky.feed.postgate", "app.bsky.feed.repost", "app.bsky.feed.threadgate"];
        }];
    };
}
export declare class AppBskyAuthManageFeedDeclarations {
    static readonly nsid = "app.bsky.authManageFeedDeclarations";
    static readonly def = "main";
    static readonly kind: "permission-set";
    static readonly title = "Manage Hosted Feeds";
    static readonly detail = "Configure feed generator declaration records.";
    static readonly permissions: readonly [{
        readonly type: "permission";
        readonly resource: "repo";
        readonly action: readonly ["create", "update", "delete"];
        readonly collection: readonly ["app.bsky.feed.generator"];
    }];
    private constructor();
    static toJSON(): {
        title: string;
        detail: string;
        permissions: readonly [{
            readonly type: "permission";
            readonly resource: "repo";
            readonly action: readonly ["create", "update", "delete"];
            readonly collection: readonly ["app.bsky.feed.generator"];
        }];
    };
}
export declare class AppBskyAuthManageLabelerService {
    static readonly nsid = "app.bsky.authManageLabelerService";
    static readonly def = "main";
    static readonly kind: "permission-set";
    static readonly title = "Manage Hosted Labeling Service";
    static readonly detail = "Configure labeler declaration records.";
    static readonly permissions: readonly [{
        readonly type: "permission";
        readonly resource: "repo";
        readonly action: readonly ["create", "update", "delete"];
        readonly collection: readonly ["app.bsky.labeler.service"];
    }];
    private constructor();
    static toJSON(): {
        title: string;
        detail: string;
        permissions: readonly [{
            readonly type: "permission";
            readonly resource: "repo";
            readonly action: readonly ["create", "update", "delete"];
            readonly collection: readonly ["app.bsky.labeler.service"];
        }];
    };
}
export declare class AppBskyAuthManageModeration {
    static readonly nsid = "app.bsky.authManageModeration";
    static readonly def = "main";
    static readonly kind: "permission-set";
    static readonly title = "Manage Personal Moderation";
    static readonly detail = "Control over blocks, mutes, mod lists, mod services, and preferences.";
    static readonly permissions: readonly [{
        readonly type: "permission";
        readonly resource: "rpc";
        readonly inheritAud: true;
        readonly lxm: readonly ["app.bsky.actor.getPreferences", "app.bsky.actor.putPreferences", "app.bsky.graph.muteActor", "app.bsky.graph.muteActorList", "app.bsky.graph.muteThread", "app.bsky.graph.unmuteActor", "app.bsky.graph.unmuteActorList", "app.bsky.graph.unmuteThread"];
    }, {
        readonly type: "permission";
        readonly resource: "repo";
        readonly action: readonly ["create", "update", "delete"];
        readonly collection: readonly ["app.bsky.graph.block", "app.bsky.graph.listblock"];
    }];
    private constructor();
    static toJSON(): {
        title: string;
        detail: string;
        permissions: readonly [{
            readonly type: "permission";
            readonly resource: "rpc";
            readonly inheritAud: true;
            readonly lxm: readonly ["app.bsky.actor.getPreferences", "app.bsky.actor.putPreferences", "app.bsky.graph.muteActor", "app.bsky.graph.muteActorList", "app.bsky.graph.muteThread", "app.bsky.graph.unmuteActor", "app.bsky.graph.unmuteActorList", "app.bsky.graph.unmuteThread"];
        }, {
            readonly type: "permission";
            readonly resource: "repo";
            readonly action: readonly ["create", "update", "delete"];
            readonly collection: readonly ["app.bsky.graph.block", "app.bsky.graph.listblock"];
        }];
    };
}
export declare class AppBskyAuthManageNotifications {
    static readonly nsid = "app.bsky.authManageNotifications";
    static readonly def = "main";
    static readonly kind: "permission-set";
    static readonly title = "Manage Bluesky Notifications";
    static readonly detail = "View and configure notifications for the Bluesky app.";
    static readonly permissions: readonly [{
        readonly type: "permission";
        readonly resource: "rpc";
        readonly inheritAud: true;
        readonly lxm: readonly ["app.bsky.notification.getPreferences", "app.bsky.notification.getGroupedNotifications", "app.bsky.notification.getUnreadCount", "app.bsky.notification.listActivitySubscriptions", "app.bsky.notification.listNotifications", "app.bsky.notification.putActivitySubscription", "app.bsky.notification.putPreferences", "app.bsky.notification.putPreferencesV2", "app.bsky.notification.registerPush", "app.bsky.notification.unregisterPush", "app.bsky.notification.updateSeen"];
    }];
    private constructor();
    static toJSON(): {
        title: string;
        detail: string;
        permissions: readonly [{
            readonly type: "permission";
            readonly resource: "rpc";
            readonly inheritAud: true;
            readonly lxm: readonly ["app.bsky.notification.getPreferences", "app.bsky.notification.getGroupedNotifications", "app.bsky.notification.getUnreadCount", "app.bsky.notification.listActivitySubscriptions", "app.bsky.notification.listNotifications", "app.bsky.notification.putActivitySubscription", "app.bsky.notification.putPreferences", "app.bsky.notification.putPreferencesV2", "app.bsky.notification.registerPush", "app.bsky.notification.unregisterPush", "app.bsky.notification.updateSeen"];
        }];
    };
}
export declare class AppBskyAuthManageProfile {
    static readonly nsid = "app.bsky.authManageProfile";
    static readonly def = "main";
    static readonly kind: "permission-set";
    static readonly title = "Manage Bluesky Profile";
    static readonly detail = "Update profile data, as well as status and public chat visibility.";
    static readonly permissions: readonly [{
        readonly type: "permission";
        readonly resource: "repo";
        readonly action: readonly ["create", "update", "delete"];
        readonly collection: readonly ["app.bsky.actor.link", "app.bsky.actor.profile", "app.bsky.actor.status", "app.bsky.notification.declaration"];
    }];
    private constructor();
    static toJSON(): {
        title: string;
        detail: string;
        permissions: readonly [{
            readonly type: "permission";
            readonly resource: "repo";
            readonly action: readonly ["create", "update", "delete"];
            readonly collection: readonly ["app.bsky.actor.link", "app.bsky.actor.profile", "app.bsky.actor.status", "app.bsky.notification.declaration"];
        }];
    };
}
export declare class AppBskyAuthViewAll {
    static readonly nsid = "app.bsky.authViewAll";
    static readonly def = "main";
    static readonly kind: "permission-set";
    static readonly title = "Read-only access to all content";
    static readonly detail = "View Bluesky network content from account perspective, and read all notifications and preferences.";
    static readonly permissions: readonly [{
        readonly type: "permission";
        readonly resource: "rpc";
        readonly inheritAud: true;
        readonly lxm: readonly ["app.bsky.actor.getPreferences", "app.bsky.actor.getProfile", "app.bsky.actor.getProfiles", "app.bsky.actor.getSuggestions", "app.bsky.actor.searchActors", "app.bsky.actor.searchActorsTypeahead", "app.bsky.ageassurance.getConfig", "app.bsky.ageassurance.getState", "app.bsky.bookmark.getBookmarks", "app.bsky.embed.getEmbedExternalView", "app.bsky.feed.describeFeedGenerator", "app.bsky.feed.getActorFeeds", "app.bsky.feed.getActorLikes", "app.bsky.feed.getAuthorFeed", "app.bsky.feed.getFeed", "app.bsky.feed.getFeedGenerator", "app.bsky.feed.getFeedGenerators", "app.bsky.feed.getFeedSkeleton", "app.bsky.feed.getLikes", "app.bsky.feed.getListFeed", "app.bsky.feed.getPostThread", "app.bsky.feed.getPosts", "app.bsky.feed.getQuotes", "app.bsky.feed.getRepostedBy", "app.bsky.feed.getSuggestedFeeds", "app.bsky.feed.getTimeline", "app.bsky.feed.searchPosts", "app.bsky.feed.searchPostsV2", "app.bsky.graph.getActorStarterPacks", "app.bsky.graph.getBlocks", "app.bsky.graph.getFollowers", "app.bsky.graph.getFollows", "app.bsky.graph.getKnownFollowers", "app.bsky.graph.getList", "app.bsky.graph.getListBlocks", "app.bsky.graph.getListMutes", "app.bsky.graph.getLists", "app.bsky.graph.getListsWithMembership", "app.bsky.graph.getMutes", "app.bsky.graph.getRelationships", "app.bsky.graph.getStarterPack", "app.bsky.graph.getStarterPacks", "app.bsky.graph.getStarterPacksWithMembership", "app.bsky.graph.getSuggestedFollowsByActor", "app.bsky.graph.searchStarterPacks", "app.bsky.graph.searchStarterPacksV2", "app.bsky.labeler.getServices", "app.bsky.notification.getGroupedNotifications", "app.bsky.notification.getPreferences", "app.bsky.notification.getUnreadCount", "app.bsky.notification.listActivitySubscriptions", "app.bsky.notification.listNotifications", "app.bsky.notification.updateSeen", "app.bsky.unspecced.getAgeAssuranceState", "app.bsky.unspecced.getConfig", "app.bsky.unspecced.getOnboardingSuggestedStarterPacks", "app.bsky.unspecced.getPopularFeedGenerators", "app.bsky.unspecced.getPostThreadOtherV2", "app.bsky.unspecced.getPostThreadV2", "app.bsky.unspecced.getSuggestedFeeds", "app.bsky.unspecced.getSuggestedFeedsSkeleton", "app.bsky.unspecced.getSuggestedOnboardingUsers", "app.bsky.unspecced.getSuggestedStarterPacks", "app.bsky.unspecced.getSuggestedStarterPacksSkeleton", "app.bsky.unspecced.getSuggestedUsers", "app.bsky.unspecced.getSuggestedUsersForDiscover", "app.bsky.unspecced.getSuggestedUsersForExplore", "app.bsky.unspecced.getSuggestedUsersForSeeMore", "app.bsky.unspecced.getSuggestedUsersSkeleton", "app.bsky.unspecced.getSuggestionsSkeleton", "app.bsky.unspecced.getTaggedSuggestions", "app.bsky.unspecced.getTrendingTopics", "app.bsky.unspecced.getTrends", "app.bsky.unspecced.getTrendsSkeleton", "app.bsky.unspecced.searchActorsSkeleton", "app.bsky.unspecced.searchPostsSkeleton", "app.bsky.unspecced.searchStarterPacksSkeleton", "app.bsky.video.getUploadLimits"];
    }];
    private constructor();
    static toJSON(): {
        title: string;
        detail: string;
        permissions: readonly [{
            readonly type: "permission";
            readonly resource: "rpc";
            readonly inheritAud: true;
            readonly lxm: readonly ["app.bsky.actor.getPreferences", "app.bsky.actor.getProfile", "app.bsky.actor.getProfiles", "app.bsky.actor.getSuggestions", "app.bsky.actor.searchActors", "app.bsky.actor.searchActorsTypeahead", "app.bsky.ageassurance.getConfig", "app.bsky.ageassurance.getState", "app.bsky.bookmark.getBookmarks", "app.bsky.embed.getEmbedExternalView", "app.bsky.feed.describeFeedGenerator", "app.bsky.feed.getActorFeeds", "app.bsky.feed.getActorLikes", "app.bsky.feed.getAuthorFeed", "app.bsky.feed.getFeed", "app.bsky.feed.getFeedGenerator", "app.bsky.feed.getFeedGenerators", "app.bsky.feed.getFeedSkeleton", "app.bsky.feed.getLikes", "app.bsky.feed.getListFeed", "app.bsky.feed.getPostThread", "app.bsky.feed.getPosts", "app.bsky.feed.getQuotes", "app.bsky.feed.getRepostedBy", "app.bsky.feed.getSuggestedFeeds", "app.bsky.feed.getTimeline", "app.bsky.feed.searchPosts", "app.bsky.feed.searchPostsV2", "app.bsky.graph.getActorStarterPacks", "app.bsky.graph.getBlocks", "app.bsky.graph.getFollowers", "app.bsky.graph.getFollows", "app.bsky.graph.getKnownFollowers", "app.bsky.graph.getList", "app.bsky.graph.getListBlocks", "app.bsky.graph.getListMutes", "app.bsky.graph.getLists", "app.bsky.graph.getListsWithMembership", "app.bsky.graph.getMutes", "app.bsky.graph.getRelationships", "app.bsky.graph.getStarterPack", "app.bsky.graph.getStarterPacks", "app.bsky.graph.getStarterPacksWithMembership", "app.bsky.graph.getSuggestedFollowsByActor", "app.bsky.graph.searchStarterPacks", "app.bsky.graph.searchStarterPacksV2", "app.bsky.labeler.getServices", "app.bsky.notification.getGroupedNotifications", "app.bsky.notification.getPreferences", "app.bsky.notification.getUnreadCount", "app.bsky.notification.listActivitySubscriptions", "app.bsky.notification.listNotifications", "app.bsky.notification.updateSeen", "app.bsky.unspecced.getAgeAssuranceState", "app.bsky.unspecced.getConfig", "app.bsky.unspecced.getOnboardingSuggestedStarterPacks", "app.bsky.unspecced.getPopularFeedGenerators", "app.bsky.unspecced.getPostThreadOtherV2", "app.bsky.unspecced.getPostThreadV2", "app.bsky.unspecced.getSuggestedFeeds", "app.bsky.unspecced.getSuggestedFeedsSkeleton", "app.bsky.unspecced.getSuggestedOnboardingUsers", "app.bsky.unspecced.getSuggestedStarterPacks", "app.bsky.unspecced.getSuggestedStarterPacksSkeleton", "app.bsky.unspecced.getSuggestedUsers", "app.bsky.unspecced.getSuggestedUsersForDiscover", "app.bsky.unspecced.getSuggestedUsersForExplore", "app.bsky.unspecced.getSuggestedUsersForSeeMore", "app.bsky.unspecced.getSuggestedUsersSkeleton", "app.bsky.unspecced.getSuggestionsSkeleton", "app.bsky.unspecced.getTaggedSuggestions", "app.bsky.unspecced.getTrendingTopics", "app.bsky.unspecced.getTrends", "app.bsky.unspecced.getTrendsSkeleton", "app.bsky.unspecced.searchActorsSkeleton", "app.bsky.unspecced.searchPostsSkeleton", "app.bsky.unspecced.searchStarterPacksSkeleton", "app.bsky.video.getUploadLimits"];
        }];
    };
}
/** Creates a private bookmark for the specified record. Currently, only `app.bsky.feed.post` records are supported. Requires authentication. */
export declare class AppBskyBookmarkCreateBookmark {
    static readonly nsid = "app.bsky.bookmark.createBookmark";
    static readonly def = "main";
    static readonly kind: "procedure";
    static readonly http: "POST";
    static readonly errorNames: readonly ["UnsupportedCollection"];
    uri: string;
    cid: string;
    constructor(input?: Partial<AppBskyBookmarkCreateBookmark>);
    toParams(): Record<string, unknown>;
    toBody(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): AppBskyBookmarkCreateBookmark;
}
export type AppBskyBookmarkCreateBookmarkOutput = Record<string, unknown>;
/** Object used to store bookmark data in stash. */
export declare class AppBskyBookmarkDefsBookmark {
    static readonly nsid = "app.bsky.bookmark.defs";
    static readonly def = "bookmark";
    static readonly kind: "object";
    $type: string;
    subject: ComAtprotoRepoStrongRef;
    constructor(input?: Partial<AppBskyBookmarkDefsBookmark>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyBookmarkDefsBookmark;
}
export declare class AppBskyBookmarkDefsBookmarkView {
    static readonly nsid = "app.bsky.bookmark.defs";
    static readonly def = "bookmarkView";
    static readonly kind: "object";
    $type: string;
    subject: ComAtprotoRepoStrongRef;
    createdAt?: string;
    item: AppBskyFeedDefsBlockedPost | AppBskyFeedDefsNotFoundPost | AppBskyFeedDefsPostView | {
        $type?: string;
    };
    constructor(input?: Partial<AppBskyBookmarkDefsBookmarkView>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyBookmarkDefsBookmarkView;
}
/** Deletes a private bookmark for the specified record. Currently, only `app.bsky.feed.post` records are supported. Requires authentication. */
export declare class AppBskyBookmarkDeleteBookmark {
    static readonly nsid = "app.bsky.bookmark.deleteBookmark";
    static readonly def = "main";
    static readonly kind: "procedure";
    static readonly http: "POST";
    static readonly errorNames: readonly ["UnsupportedCollection"];
    uri: string;
    constructor(input?: Partial<AppBskyBookmarkDeleteBookmark>);
    toParams(): Record<string, unknown>;
    toBody(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): AppBskyBookmarkDeleteBookmark;
}
export type AppBskyBookmarkDeleteBookmarkOutput = Record<string, unknown>;
/** Gets views of records bookmarked by the authenticated user. Requires authentication. */
export declare class AppBskyBookmarkGetBookmarks {
    static readonly nsid = "app.bsky.bookmark.getBookmarks";
    static readonly def = "main";
    static readonly kind: "query";
    static readonly http: "GET";
    static readonly errorNames: readonly [];
    limit?: number;
    cursor?: string;
    constructor(input?: Partial<AppBskyBookmarkGetBookmarks>);
    toParams(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): AppBskyBookmarkGetBookmarks;
}
export type AppBskyBookmarkGetBookmarksOutput = {
    cursor?: string;
    bookmarks: Array<AppBskyBookmarkDefsBookmarkView>;
};
/** Associates a profile with the positional index of the contact import input in the call to `app.bsky.contact.importContacts`, so clients can know which phone caused a particular match. */
export declare class AppBskyContactDefsMatchAndContactIndex {
    static readonly nsid = "app.bsky.contact.defs";
    static readonly def = "matchAndContactIndex";
    static readonly kind: "object";
    $type: string;
    match: AppBskyActorDefsProfileView;
    contactIndex: number;
    constructor(input?: Partial<AppBskyContactDefsMatchAndContactIndex>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyContactDefsMatchAndContactIndex;
}
/** A stash object to be sent via bsync representing a notification to be created. */
export declare class AppBskyContactDefsNotification {
    static readonly nsid = "app.bsky.contact.defs";
    static readonly def = "notification";
    static readonly kind: "object";
    $type: string;
    from: string;
    to: string;
    constructor(input?: Partial<AppBskyContactDefsNotification>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyContactDefsNotification;
}
export declare class AppBskyContactDefsSyncStatus {
    static readonly nsid = "app.bsky.contact.defs";
    static readonly def = "syncStatus";
    static readonly kind: "object";
    $type: string;
    syncedAt: string;
    matchesCount: number;
    constructor(input?: Partial<AppBskyContactDefsSyncStatus>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyContactDefsSyncStatus;
}
/** Removes a match that was found via contact import. It shouldn't appear again if the same contact is re-imported. Requires authentication. */
export declare class AppBskyContactDismissMatch {
    static readonly nsid = "app.bsky.contact.dismissMatch";
    static readonly def = "main";
    static readonly kind: "procedure";
    static readonly http: "POST";
    static readonly errorNames: readonly ["InvalidDid", "InternalError"];
    subject: string;
    constructor(input?: Partial<AppBskyContactDismissMatch>);
    toParams(): Record<string, unknown>;
    toBody(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): AppBskyContactDismissMatch;
}
export type AppBskyContactDismissMatchOutput = Record<string, unknown>;
/** Returns the matched contacts (contacts that were mutually imported). Excludes dismissed matches. Requires authentication. */
export declare class AppBskyContactGetMatches {
    static readonly nsid = "app.bsky.contact.getMatches";
    static readonly def = "main";
    static readonly kind: "query";
    static readonly http: "GET";
    static readonly errorNames: readonly ["InvalidDid", "InvalidLimit", "InvalidCursor", "InternalError"];
    limit?: number;
    cursor?: string;
    constructor(input?: Partial<AppBskyContactGetMatches>);
    toParams(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): AppBskyContactGetMatches;
}
export type AppBskyContactGetMatchesOutput = {
    cursor?: string;
    matches: Array<AppBskyActorDefsProfileView>;
};
/** Gets the user's current contact import status. Requires authentication. */
export declare class AppBskyContactGetSyncStatus {
    static readonly nsid = "app.bsky.contact.getSyncStatus";
    static readonly def = "main";
    static readonly kind: "query";
    static readonly http: "GET";
    static readonly errorNames: readonly ["InvalidDid", "InternalError"];
    constructor(input?: Partial<AppBskyContactGetSyncStatus>);
    toParams(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): AppBskyContactGetSyncStatus;
}
export type AppBskyContactGetSyncStatusOutput = {
    syncStatus?: AppBskyContactDefsSyncStatus;
};
/** Import contacts for securely matching with other users. This follows the protocol explained in https://docs.bsky.app/blog/contact-import-rfc. Requires authentication. */
export declare class AppBskyContactImportContacts {
    static readonly nsid = "app.bsky.contact.importContacts";
    static readonly def = "main";
    static readonly kind: "procedure";
    static readonly http: "POST";
    static readonly errorNames: readonly ["InvalidDid", "InvalidContacts", "TooManyContacts", "InvalidToken", "InternalError"];
    token: string;
    contacts: Array<string>;
    constructor(input?: Partial<AppBskyContactImportContacts>);
    toParams(): Record<string, unknown>;
    toBody(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): AppBskyContactImportContacts;
}
export type AppBskyContactImportContactsOutput = {
    matchesAndContactIndexes: Array<AppBskyContactDefsMatchAndContactIndex>;
};
/** Removes all stored hashes used for contact matching, existing matches, and sync status. Requires authentication. */
export declare class AppBskyContactRemoveData {
    static readonly nsid = "app.bsky.contact.removeData";
    static readonly def = "main";
    static readonly kind: "procedure";
    static readonly http: "POST";
    static readonly errorNames: readonly ["InvalidDid", "InternalError"];
    constructor(input?: Partial<AppBskyContactRemoveData>);
    toParams(): Record<string, unknown>;
    toBody(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): AppBskyContactRemoveData;
}
export type AppBskyContactRemoveDataOutput = Record<string, unknown>;
/** System endpoint to send notifications related to contact imports. Requires role authentication. */
export declare class AppBskyContactSendNotification {
    static readonly nsid = "app.bsky.contact.sendNotification";
    static readonly def = "main";
    static readonly kind: "procedure";
    static readonly http: "POST";
    static readonly errorNames: readonly [];
    from: string;
    to: string;
    constructor(input?: Partial<AppBskyContactSendNotification>);
    toParams(): Record<string, unknown>;
    toBody(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): AppBskyContactSendNotification;
}
export type AppBskyContactSendNotificationOutput = Record<string, unknown>;
/** Starts a phone verification flow. The phone passed will receive a code via SMS that should be passed to `app.bsky.contact.verifyPhone`. Requires authentication. */
export declare class AppBskyContactStartPhoneVerification {
    static readonly nsid = "app.bsky.contact.startPhoneVerification";
    static readonly def = "main";
    static readonly kind: "procedure";
    static readonly http: "POST";
    static readonly errorNames: readonly ["RateLimitExceeded", "InvalidDid", "InvalidPhone", "InternalError"];
    phone: string;
    constructor(input?: Partial<AppBskyContactStartPhoneVerification>);
    toParams(): Record<string, unknown>;
    toBody(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): AppBskyContactStartPhoneVerification;
}
export type AppBskyContactStartPhoneVerificationOutput = Record<string, unknown>;
/** Verifies control over a phone number with a code received via SMS and starts a contact import session. Requires authentication. */
export declare class AppBskyContactVerifyPhone {
    static readonly nsid = "app.bsky.contact.verifyPhone";
    static readonly def = "main";
    static readonly kind: "procedure";
    static readonly http: "POST";
    static readonly errorNames: readonly ["RateLimitExceeded", "InvalidDid", "InvalidPhone", "InvalidCode", "InternalError"];
    phone: string;
    code: string;
    constructor(input?: Partial<AppBskyContactVerifyPhone>);
    toParams(): Record<string, unknown>;
    toBody(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): AppBskyContactVerifyPhone;
}
export type AppBskyContactVerifyPhoneOutput = {
    token: string;
};
/** Inserts a draft using private storage (stash). An upper limit of drafts might be enforced. Requires authentication. */
export declare class AppBskyDraftCreateDraft {
    static readonly nsid = "app.bsky.draft.createDraft";
    static readonly def = "main";
    static readonly kind: "procedure";
    static readonly http: "POST";
    static readonly errorNames: readonly ["DraftLimitReached"];
    draft: AppBskyDraftDefsDraft;
    constructor(input?: Partial<AppBskyDraftCreateDraft>);
    toParams(): Record<string, unknown>;
    toBody(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): AppBskyDraftCreateDraft;
}
export type AppBskyDraftCreateDraftOutput = {
    id: string;
};
/** A draft containing an array of draft posts. */
export declare class AppBskyDraftDefsDraft {
    static readonly nsid = "app.bsky.draft.defs";
    static readonly def = "draft";
    static readonly kind: "object";
    $type: string;
    deviceId?: string;
    deviceName?: string;
    posts: Array<AppBskyDraftDefsDraftPost>;
    langs?: Array<string>;
    postgateEmbeddingRules?: Array<(AppBskyFeedPostgateDisableRule | {
        $type?: string;
    })>;
    threadgateAllow?: Array<(AppBskyFeedThreadgateMentionRule | AppBskyFeedThreadgateFollowerRule | AppBskyFeedThreadgateFollowingRule | AppBskyFeedThreadgateListRule | {
        $type?: string;
    })>;
    constructor(input?: Partial<AppBskyDraftDefsDraft>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyDraftDefsDraft;
}
export declare class AppBskyDraftDefsDraftEmbedCaption {
    static readonly nsid = "app.bsky.draft.defs";
    static readonly def = "draftEmbedCaption";
    static readonly kind: "object";
    $type: string;
    lang: string;
    content: string;
    constructor(input?: Partial<AppBskyDraftDefsDraftEmbedCaption>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyDraftDefsDraftEmbedCaption;
}
export declare class AppBskyDraftDefsDraftEmbedExternal {
    static readonly nsid = "app.bsky.draft.defs";
    static readonly def = "draftEmbedExternal";
    static readonly kind: "object";
    $type: string;
    uri: string;
    constructor(input?: Partial<AppBskyDraftDefsDraftEmbedExternal>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyDraftDefsDraftEmbedExternal;
}
export declare class AppBskyDraftDefsDraftEmbedGallery {
    static readonly nsid = "app.bsky.draft.defs";
    static readonly def = "draftEmbedGallery";
    static readonly kind: "object";
    $type: string;
    items: AppBskyDraftDefsDraftEmbedGalleryItems;
    constructor(input?: Partial<AppBskyDraftDefsDraftEmbedGallery>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyDraftDefsDraftEmbedGallery;
}
/** The schema-level maxLength of 20 is a future-proof ceiling. Clients should currently enforce a soft limit of 10 items in authoring UIs. */
export type AppBskyDraftDefsDraftEmbedGalleryItems = Array<(AppBskyDraftDefsDraftEmbedImage | {
    $type?: string;
})>;
export declare const AppBskyDraftDefsDraftEmbedGalleryItems: {
    nsid: string;
    def: string;
    kind: "array";
};
export declare class AppBskyDraftDefsDraftEmbedImage {
    static readonly nsid = "app.bsky.draft.defs";
    static readonly def = "draftEmbedImage";
    static readonly kind: "object";
    $type: string;
    localRef: AppBskyDraftDefsDraftEmbedLocalRef;
    alt?: string;
    constructor(input?: Partial<AppBskyDraftDefsDraftEmbedImage>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyDraftDefsDraftEmbedImage;
}
export declare class AppBskyDraftDefsDraftEmbedLocalRef {
    static readonly nsid = "app.bsky.draft.defs";
    static readonly def = "draftEmbedLocalRef";
    static readonly kind: "object";
    $type: string;
    path: string;
    constructor(input?: Partial<AppBskyDraftDefsDraftEmbedLocalRef>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyDraftDefsDraftEmbedLocalRef;
}
export declare class AppBskyDraftDefsDraftEmbedRecord {
    static readonly nsid = "app.bsky.draft.defs";
    static readonly def = "draftEmbedRecord";
    static readonly kind: "object";
    $type: string;
    record: ComAtprotoRepoStrongRef;
    constructor(input?: Partial<AppBskyDraftDefsDraftEmbedRecord>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyDraftDefsDraftEmbedRecord;
}
export declare class AppBskyDraftDefsDraftEmbedVideo {
    static readonly nsid = "app.bsky.draft.defs";
    static readonly def = "draftEmbedVideo";
    static readonly kind: "object";
    $type: string;
    localRef: AppBskyDraftDefsDraftEmbedLocalRef;
    alt?: string;
    captions?: Array<AppBskyDraftDefsDraftEmbedCaption>;
    constructor(input?: Partial<AppBskyDraftDefsDraftEmbedVideo>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyDraftDefsDraftEmbedVideo;
}
/** One of the posts that compose a draft. */
export declare class AppBskyDraftDefsDraftPost {
    static readonly nsid = "app.bsky.draft.defs";
    static readonly def = "draftPost";
    static readonly kind: "object";
    $type: string;
    text: string;
    labels?: ComAtprotoLabelDefsSelfLabels | {
        $type?: string;
    };
    embedImages?: Array<AppBskyDraftDefsDraftEmbedImage>;
    embedGallery?: AppBskyDraftDefsDraftEmbedGallery;
    embedVideos?: Array<AppBskyDraftDefsDraftEmbedVideo>;
    embedExternals?: Array<AppBskyDraftDefsDraftEmbedExternal>;
    embedRecords?: Array<AppBskyDraftDefsDraftEmbedRecord>;
    constructor(input?: Partial<AppBskyDraftDefsDraftPost>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyDraftDefsDraftPost;
}
/** View to present drafts data to users. */
export declare class AppBskyDraftDefsDraftView {
    static readonly nsid = "app.bsky.draft.defs";
    static readonly def = "draftView";
    static readonly kind: "object";
    $type: string;
    id: string;
    draft: AppBskyDraftDefsDraft;
    createdAt: string;
    updatedAt: string;
    constructor(input?: Partial<AppBskyDraftDefsDraftView>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyDraftDefsDraftView;
}
/** A draft with an identifier, used to store drafts in private storage (stash). */
export declare class AppBskyDraftDefsDraftWithId {
    static readonly nsid = "app.bsky.draft.defs";
    static readonly def = "draftWithId";
    static readonly kind: "object";
    $type: string;
    id: string;
    draft: AppBskyDraftDefsDraft;
    constructor(input?: Partial<AppBskyDraftDefsDraftWithId>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyDraftDefsDraftWithId;
}
/** Deletes a draft by ID. Requires authentication. */
export declare class AppBskyDraftDeleteDraft {
    static readonly nsid = "app.bsky.draft.deleteDraft";
    static readonly def = "main";
    static readonly kind: "procedure";
    static readonly http: "POST";
    static readonly errorNames: readonly [];
    id: string;
    constructor(input?: Partial<AppBskyDraftDeleteDraft>);
    toParams(): Record<string, unknown>;
    toBody(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): AppBskyDraftDeleteDraft;
}
export type AppBskyDraftDeleteDraftOutput = Record<string, unknown>;
/** Gets views of user drafts. Requires authentication. */
export declare class AppBskyDraftGetDrafts {
    static readonly nsid = "app.bsky.draft.getDrafts";
    static readonly def = "main";
    static readonly kind: "query";
    static readonly http: "GET";
    static readonly errorNames: readonly [];
    limit?: number;
    cursor?: string;
    constructor(input?: Partial<AppBskyDraftGetDrafts>);
    toParams(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): AppBskyDraftGetDrafts;
}
export type AppBskyDraftGetDraftsOutput = {
    cursor?: string;
    drafts: Array<AppBskyDraftDefsDraftView>;
};
/** Updates a draft using private storage (stash). If the draft ID points to a non-existing ID, the update will be silently ignored. This is done because updates don't enforce draft limit, so it accepts all writes, but will ignore invalid ones. */
export declare class AppBskyDraftUpdateDraft {
    static readonly nsid = "app.bsky.draft.updateDraft";
    static readonly def = "main";
    static readonly kind: "procedure";
    static readonly http: "POST";
    static readonly errorNames: readonly [];
    draft: AppBskyDraftDefsDraftWithId;
    constructor(input?: Partial<AppBskyDraftUpdateDraft>);
    toParams(): Record<string, unknown>;
    toBody(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): AppBskyDraftUpdateDraft;
}
export type AppBskyDraftUpdateDraftOutput = Record<string, unknown>;
/** width:height represents an aspect ratio. It may be approximate, and may not correspond to absolute dimensions in any given unit. */
export declare class AppBskyEmbedDefsAspectRatio {
    static readonly nsid = "app.bsky.embed.defs";
    static readonly def = "aspectRatio";
    static readonly kind: "object";
    $type: string;
    width: number;
    height: number;
    constructor(input?: Partial<AppBskyEmbedDefsAspectRatio>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyEmbedDefsAspectRatio;
}
/** A representation of some externally linked content (eg, a URL and 'card'), embedded in a Bluesky record (eg, a post). */
export declare class AppBskyEmbedExternal {
    static readonly nsid = "app.bsky.embed.external";
    static readonly def = "main";
    static readonly kind: "object";
    $type: string;
    external: AppBskyEmbedExternalExternal;
    constructor(input?: Partial<AppBskyEmbedExternal>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyEmbedExternal;
}
/** RGB color definition, inspired by site.standard.theme.color#rgb */
export declare class AppBskyEmbedExternalColorRGB {
    static readonly nsid = "app.bsky.embed.external";
    static readonly def = "colorRGB";
    static readonly kind: "object";
    $type: string;
    r: number;
    g: number;
    b: number;
    constructor(input?: Partial<AppBskyEmbedExternalColorRGB>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyEmbedExternalColorRGB;
}
export declare class AppBskyEmbedExternalExternal {
    static readonly nsid = "app.bsky.embed.external";
    static readonly def = "external";
    static readonly kind: "object";
    $type: string;
    uri: string;
    title: string;
    description: string;
    thumb?: RepoBlobJson;
    associatedRefs?: Array<ComAtprotoRepoStrongRef>;
    constructor(input?: Partial<AppBskyEmbedExternalExternal>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyEmbedExternalExternal;
}
export declare class AppBskyEmbedExternalView {
    static readonly nsid = "app.bsky.embed.external";
    static readonly def = "view";
    static readonly kind: "object";
    $type: string;
    external: AppBskyEmbedExternalViewExternal;
    constructor(input?: Partial<AppBskyEmbedExternalView>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyEmbedExternalView;
}
export declare class AppBskyEmbedExternalViewArticle {
    static readonly nsid = "app.bsky.embed.external";
    static readonly def = "viewArticle";
    static readonly kind: "object";
    $type: string;
    uri: string;
    title: string;
    description: string;
    createdAt?: string;
    updatedAt?: string;
    labels?: Array<ComAtprotoLabelDefsLabel>;
    associatedRefs?: Array<ComAtprotoRepoStrongRef>;
    associatedProfiles?: Array<AppBskyActorDefsProfileViewBasic>;
    image?: string;
    publisher?: AppBskyEmbedExternalViewArticlePublication;
    readingTime?: number;
    likeCount?: number;
    likers?: Array<AppBskyActorDefsProfileViewBasic>;
    constructor(input?: Partial<AppBskyEmbedExternalViewArticle>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyEmbedExternalViewArticle;
}
export declare class AppBskyEmbedExternalViewArticlePublication {
    static readonly nsid = "app.bsky.embed.external";
    static readonly def = "viewArticlePublication";
    static readonly kind: "object";
    $type: string;
    uri: string;
    title: string;
    description: string;
    createdAt?: string;
    updatedAt?: string;
    labels?: Array<ComAtprotoLabelDefsLabel>;
    associatedRefs?: Array<ComAtprotoRepoStrongRef>;
    associatedProfiles?: Array<AppBskyActorDefsProfileViewBasic>;
    logo?: string;
    image?: string;
    theme?: AppBskyEmbedExternalViewArticlePublicationTheme;
    subscriptionCount?: number;
    subscribers?: Array<AppBskyActorDefsProfileViewBasic>;
    constructor(input?: Partial<AppBskyEmbedExternalViewArticlePublication>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyEmbedExternalViewArticlePublication;
}
export declare class AppBskyEmbedExternalViewArticlePublicationTheme {
    static readonly nsid = "app.bsky.embed.external";
    static readonly def = "viewArticlePublicationTheme";
    static readonly kind: "object";
    $type: string;
    background?: string;
    foreground?: string;
    accent?: string;
    accentForeground?: string;
    constructor(input?: Partial<AppBskyEmbedExternalViewArticlePublicationTheme>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyEmbedExternalViewArticlePublicationTheme;
}
export declare class AppBskyEmbedExternalViewExternal {
    static readonly nsid = "app.bsky.embed.external";
    static readonly def = "viewExternal";
    static readonly kind: "object";
    $type: string;
    uri: string;
    title: string;
    description: string;
    thumb?: string;
    createdAt?: string;
    updatedAt?: string;
    readingTime?: number;
    labels?: Array<ComAtprotoLabelDefsLabel>;
    source?: AppBskyEmbedExternalViewExternalSource;
    associatedRefs?: Array<ComAtprotoRepoStrongRef>;
    associatedProfiles?: Array<AppBskyActorDefsProfileViewBasic>;
    constructor(input?: Partial<AppBskyEmbedExternalViewExternal>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyEmbedExternalViewExternal;
}
/** The source of an external embed, such as a standard.site publication. */
export declare class AppBskyEmbedExternalViewExternalSource {
    static readonly nsid = "app.bsky.embed.external";
    static readonly def = "viewExternalSource";
    static readonly kind: "object";
    $type: string;
    uri: string;
    icon?: string;
    title: string;
    description?: string;
    theme?: AppBskyEmbedExternalViewExternalSourceTheme;
    constructor(input?: Partial<AppBskyEmbedExternalViewExternalSource>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyEmbedExternalViewExternalSource;
}
/** The theme colors of an external source, such as a site.standard.publication. These colors may be used when rendering an embed from that source. */
export declare class AppBskyEmbedExternalViewExternalSourceTheme {
    static readonly nsid = "app.bsky.embed.external";
    static readonly def = "viewExternalSourceTheme";
    static readonly kind: "object";
    $type: string;
    backgroundRGB?: AppBskyEmbedExternalColorRGB;
    foregroundRGB?: AppBskyEmbedExternalColorRGB;
    accentRGB?: AppBskyEmbedExternalColorRGB;
    accentForegroundRGB?: AppBskyEmbedExternalColorRGB;
    constructor(input?: Partial<AppBskyEmbedExternalViewExternalSourceTheme>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyEmbedExternalViewExternalSourceTheme;
}
export declare class AppBskyEmbedExternalViewGallery {
    static readonly nsid = "app.bsky.embed.external";
    static readonly def = "viewGallery";
    static readonly kind: "object";
    $type: string;
    uri: string;
    title: string;
    description: string;
    createdAt?: string;
    updatedAt?: string;
    labels?: Array<ComAtprotoLabelDefsLabel>;
    associatedRefs?: Array<ComAtprotoRepoStrongRef>;
    associatedProfiles?: Array<AppBskyActorDefsProfileViewBasic>;
    items: Array<(AppBskyEmbedExternalViewGalleryImage | {
        $type?: string;
    })>;
    likeCount?: number;
    likers?: Array<AppBskyActorDefsProfileViewBasic>;
    constructor(input?: Partial<AppBskyEmbedExternalViewGallery>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyEmbedExternalViewGallery;
}
export declare class AppBskyEmbedExternalViewGalleryImage {
    static readonly nsid = "app.bsky.embed.external";
    static readonly def = "viewGalleryImage";
    static readonly kind: "object";
    $type: string;
    thumbnail: string;
    fullsize: string;
    alt?: string;
    aspectRatio?: AppBskyEmbedDefsAspectRatio;
    constructor(input?: Partial<AppBskyEmbedExternalViewGalleryImage>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyEmbedExternalViewGalleryImage;
}
export declare class AppBskyEmbedExternalViewLivestream {
    static readonly nsid = "app.bsky.embed.external";
    static readonly def = "viewLivestream";
    static readonly kind: "object";
    $type: string;
    uri: string;
    title: string;
    description: string;
    createdAt?: string;
    updatedAt?: string;
    labels?: Array<ComAtprotoLabelDefsLabel>;
    associatedRefs?: Array<ComAtprotoRepoStrongRef>;
    associatedProfiles?: Array<AppBskyActorDefsProfileViewBasic>;
    image?: string;
    active: boolean;
    startedAt?: string;
    endedAt?: string;
    constructor(input?: Partial<AppBskyEmbedExternalViewLivestream>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyEmbedExternalViewLivestream;
}
/** An assortment of media embedded in a Bluesky record (eg, a post). */
export declare class AppBskyEmbedGallery {
    static readonly nsid = "app.bsky.embed.gallery";
    static readonly def = "main";
    static readonly kind: "object";
    $type: string;
    items: Array<(AppBskyEmbedGalleryImage | {
        $type?: string;
    })>;
    constructor(input?: Partial<AppBskyEmbedGallery>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyEmbedGallery;
}
export declare class AppBskyEmbedGalleryImage {
    static readonly nsid = "app.bsky.embed.gallery";
    static readonly def = "image";
    static readonly kind: "object";
    $type: string;
    image: RepoBlobJson;
    alt: string;
    aspectRatio: AppBskyEmbedDefsAspectRatio;
    constructor(input?: Partial<AppBskyEmbedGalleryImage>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyEmbedGalleryImage;
}
export declare class AppBskyEmbedGalleryView {
    static readonly nsid = "app.bsky.embed.gallery";
    static readonly def = "view";
    static readonly kind: "object";
    $type: string;
    items: Array<(AppBskyEmbedGalleryViewImage | {
        $type?: string;
    })>;
    constructor(input?: Partial<AppBskyEmbedGalleryView>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyEmbedGalleryView;
}
export declare class AppBskyEmbedGalleryViewImage {
    static readonly nsid = "app.bsky.embed.gallery";
    static readonly def = "viewImage";
    static readonly kind: "object";
    $type: string;
    thumbnail: string;
    fullsize: string;
    alt: string;
    aspectRatio: AppBskyEmbedDefsAspectRatio;
    constructor(input?: Partial<AppBskyEmbedGalleryViewImage>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyEmbedGalleryViewImage;
}
/** Resolve one AT-URI record into the data needed to render an enhanced external embed. The records are validated against the requested `url` before any view is built. When validation passes, returns `data`, `associatedRefs` (strongRefs to emb */
export declare class AppBskyEmbedGetEmbedExternalView {
    static readonly nsid = "app.bsky.embed.getEmbedExternalView";
    static readonly def = "main";
    static readonly kind: "query";
    static readonly http: "GET";
    static readonly errorNames: readonly [];
    url: string;
    canonicalUri?: string;
    uris?: Array<string>;
    constructor(input?: Partial<AppBskyEmbedGetEmbedExternalView>);
    toParams(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): AppBskyEmbedGetEmbedExternalView;
}
export type AppBskyEmbedGetEmbedExternalViewOutput = {
    view?: AppBskyEmbedExternalView;
    data?: AppBskyEmbedExternalViewArticle | AppBskyEmbedExternalViewArticlePublication | AppBskyEmbedExternalViewGallery | AppBskyEmbedExternalViewLivestream | {
        $type?: string;
    };
    associatedRefs?: Array<ComAtprotoRepoStrongRef>;
    associatedRecords?: Array<unknown>;
    unverifiedAssociatedRefs?: Array<ComAtprotoRepoStrongRef>;
    unverifiedAssociatedRecords?: Array<unknown>;
};
/** A set of images embedded in a Bluesky record (eg, a post). */
export declare class AppBskyEmbedImages {
    static readonly nsid = "app.bsky.embed.images";
    static readonly def = "main";
    static readonly kind: "object";
    $type: string;
    images: Array<AppBskyEmbedImagesImage>;
    constructor(input?: Partial<AppBskyEmbedImages>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyEmbedImages;
}
export declare class AppBskyEmbedImagesImage {
    static readonly nsid = "app.bsky.embed.images";
    static readonly def = "image";
    static readonly kind: "object";
    $type: string;
    image: RepoBlobJson;
    alt: string;
    aspectRatio?: AppBskyEmbedDefsAspectRatio;
    constructor(input?: Partial<AppBskyEmbedImagesImage>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyEmbedImagesImage;
}
export declare class AppBskyEmbedImagesView {
    static readonly nsid = "app.bsky.embed.images";
    static readonly def = "view";
    static readonly kind: "object";
    $type: string;
    images: Array<AppBskyEmbedImagesViewImage>;
    constructor(input?: Partial<AppBskyEmbedImagesView>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyEmbedImagesView;
}
export declare class AppBskyEmbedImagesViewImage {
    static readonly nsid = "app.bsky.embed.images";
    static readonly def = "viewImage";
    static readonly kind: "object";
    $type: string;
    thumb: string;
    fullsize: string;
    alt: string;
    aspectRatio?: AppBskyEmbedDefsAspectRatio;
    constructor(input?: Partial<AppBskyEmbedImagesViewImage>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyEmbedImagesViewImage;
}
/** A representation of a record embedded in a Bluesky record (eg, a post). For example, a quote-post, or sharing a feed generator record. */
export declare class AppBskyEmbedRecord {
    static readonly nsid = "app.bsky.embed.record";
    static readonly def = "main";
    static readonly kind: "object";
    $type: string;
    record: ComAtprotoRepoStrongRef;
    constructor(input?: Partial<AppBskyEmbedRecord>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyEmbedRecord;
}
export declare class AppBskyEmbedRecordView {
    static readonly nsid = "app.bsky.embed.record";
    static readonly def = "view";
    static readonly kind: "object";
    $type: string;
    record: AppBskyEmbedRecordViewRecord | AppBskyEmbedRecordViewNotFound | AppBskyEmbedRecordViewBlocked | AppBskyEmbedRecordViewDetached | AppBskyFeedDefsGeneratorView | AppBskyGraphDefsListView | AppBskyLabelerDefsLabelerView | AppBskyGraphDefsStarterPackViewBasic | {
        $type?: string;
    };
    constructor(input?: Partial<AppBskyEmbedRecordView>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyEmbedRecordView;
}
export declare class AppBskyEmbedRecordViewBlocked {
    static readonly nsid = "app.bsky.embed.record";
    static readonly def = "viewBlocked";
    static readonly kind: "object";
    $type: string;
    uri: string;
    blocked: true;
    author: AppBskyFeedDefsBlockedAuthor;
    constructor(input?: Partial<AppBskyEmbedRecordViewBlocked>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyEmbedRecordViewBlocked;
}
export declare class AppBskyEmbedRecordViewDetached {
    static readonly nsid = "app.bsky.embed.record";
    static readonly def = "viewDetached";
    static readonly kind: "object";
    $type: string;
    uri: string;
    detached: true;
    constructor(input?: Partial<AppBskyEmbedRecordViewDetached>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyEmbedRecordViewDetached;
}
export declare class AppBskyEmbedRecordViewNotFound {
    static readonly nsid = "app.bsky.embed.record";
    static readonly def = "viewNotFound";
    static readonly kind: "object";
    $type: string;
    uri: string;
    notFound: true;
    constructor(input?: Partial<AppBskyEmbedRecordViewNotFound>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyEmbedRecordViewNotFound;
}
export declare class AppBskyEmbedRecordViewRecord {
    static readonly nsid = "app.bsky.embed.record";
    static readonly def = "viewRecord";
    static readonly kind: "object";
    $type: string;
    uri: string;
    cid: string;
    author: AppBskyActorDefsProfileViewBasic;
    value: unknown;
    labels?: Array<ComAtprotoLabelDefsLabel>;
    replyCount?: number;
    repostCount?: number;
    likeCount?: number;
    quoteCount?: number;
    opThreadPostIndex?: number;
    opThreadPostCount?: number;
    embeds?: Array<(AppBskyEmbedImagesView | AppBskyEmbedVideoView | AppBskyEmbedGalleryView | AppBskyEmbedExternalView | AppBskyEmbedRecordView | AppBskyEmbedRecordWithMediaView | {
        $type?: string;
    })>;
    indexedAt: string;
    constructor(input?: Partial<AppBskyEmbedRecordViewRecord>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyEmbedRecordViewRecord;
}
/** A representation of a record embedded in a Bluesky record (eg, a post), alongside other compatible embeds. For example, a quote post and image, or a quote post and external URL card. */
export declare class AppBskyEmbedRecordWithMedia {
    static readonly nsid = "app.bsky.embed.recordWithMedia";
    static readonly def = "main";
    static readonly kind: "object";
    $type: string;
    record: AppBskyEmbedRecord;
    media: AppBskyEmbedImages | AppBskyEmbedVideo | AppBskyEmbedGallery | AppBskyEmbedExternal | {
        $type?: string;
    };
    constructor(input?: Partial<AppBskyEmbedRecordWithMedia>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyEmbedRecordWithMedia;
}
export declare class AppBskyEmbedRecordWithMediaView {
    static readonly nsid = "app.bsky.embed.recordWithMedia";
    static readonly def = "view";
    static readonly kind: "object";
    $type: string;
    record: AppBskyEmbedRecordView;
    media: AppBskyEmbedImagesView | AppBskyEmbedVideoView | AppBskyEmbedGalleryView | AppBskyEmbedExternalView | {
        $type?: string;
    };
    constructor(input?: Partial<AppBskyEmbedRecordWithMediaView>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyEmbedRecordWithMediaView;
}
/** A video embedded in a Bluesky record (eg, a post). */
export declare class AppBskyEmbedVideo {
    static readonly nsid = "app.bsky.embed.video";
    static readonly def = "main";
    static readonly kind: "object";
    $type: string;
    video: RepoBlobJson;
    captions?: Array<AppBskyEmbedVideoCaption>;
    alt?: string;
    aspectRatio?: AppBskyEmbedDefsAspectRatio;
    presentation?: "default" | "gif" | (string & {});
    constructor(input?: Partial<AppBskyEmbedVideo>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyEmbedVideo;
}
export declare class AppBskyEmbedVideoCaption {
    static readonly nsid = "app.bsky.embed.video";
    static readonly def = "caption";
    static readonly kind: "object";
    $type: string;
    lang: string;
    file: RepoBlobJson;
    constructor(input?: Partial<AppBskyEmbedVideoCaption>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyEmbedVideoCaption;
}
export declare class AppBskyEmbedVideoView {
    static readonly nsid = "app.bsky.embed.video";
    static readonly def = "view";
    static readonly kind: "object";
    $type: string;
    cid: string;
    playlist: string;
    thumbnail?: string;
    alt?: string;
    aspectRatio?: AppBskyEmbedDefsAspectRatio;
    presentation?: "default" | "gif" | (string & {});
    constructor(input?: Partial<AppBskyEmbedVideoView>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyEmbedVideoView;
}
export declare class AppBskyFeedDefsBlockedAuthor {
    static readonly nsid = "app.bsky.feed.defs";
    static readonly def = "blockedAuthor";
    static readonly kind: "object";
    $type: string;
    did: string;
    viewer?: AppBskyActorDefsViewerState;
    constructor(input?: Partial<AppBskyFeedDefsBlockedAuthor>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyFeedDefsBlockedAuthor;
}
export declare class AppBskyFeedDefsBlockedPost {
    static readonly nsid = "app.bsky.feed.defs";
    static readonly def = "blockedPost";
    static readonly kind: "object";
    $type: string;
    uri: string;
    blocked: true;
    author: AppBskyFeedDefsBlockedAuthor;
    constructor(input?: Partial<AppBskyFeedDefsBlockedPost>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyFeedDefsBlockedPost;
}
/** User clicked through to the author of the feed item */
export declare class AppBskyFeedDefsClickthroughAuthor {
    static readonly nsid = "app.bsky.feed.defs";
    static readonly def = "clickthroughAuthor";
    static readonly kind: "token";
    static readonly value = "app.bsky.feed.defs#clickthroughAuthor";
    static readonly description = "User clicked through to the author of the feed item";
    private constructor();
}
/** User clicked through to the embedded content of the feed item */
export declare class AppBskyFeedDefsClickthroughEmbed {
    static readonly nsid = "app.bsky.feed.defs";
    static readonly def = "clickthroughEmbed";
    static readonly kind: "token";
    static readonly value = "app.bsky.feed.defs#clickthroughEmbed";
    static readonly description = "User clicked through to the embedded content of the feed item";
    private constructor();
}
/** User clicked through to the feed item */
export declare class AppBskyFeedDefsClickthroughItem {
    static readonly nsid = "app.bsky.feed.defs";
    static readonly def = "clickthroughItem";
    static readonly kind: "token";
    static readonly value = "app.bsky.feed.defs#clickthroughItem";
    static readonly description = "User clicked through to the feed item";
    private constructor();
}
/** User clicked through to the reposter of the feed item */
export declare class AppBskyFeedDefsClickthroughReposter {
    static readonly nsid = "app.bsky.feed.defs";
    static readonly def = "clickthroughReposter";
    static readonly kind: "token";
    static readonly value = "app.bsky.feed.defs#clickthroughReposter";
    static readonly description = "User clicked through to the reposter of the feed item";
    private constructor();
}
/** Declares the feed generator returns any types of posts. */
export declare class AppBskyFeedDefsContentModeUnspecified {
    static readonly nsid = "app.bsky.feed.defs";
    static readonly def = "contentModeUnspecified";
    static readonly kind: "token";
    static readonly value = "app.bsky.feed.defs#contentModeUnspecified";
    static readonly description = "Declares the feed generator returns any types of posts.";
    private constructor();
}
/** Declares the feed generator returns posts containing app.bsky.embed.video embeds. */
export declare class AppBskyFeedDefsContentModeVideo {
    static readonly nsid = "app.bsky.feed.defs";
    static readonly def = "contentModeVideo";
    static readonly kind: "token";
    static readonly value = "app.bsky.feed.defs#contentModeVideo";
    static readonly description = "Declares the feed generator returns posts containing app.bsky.embed.video embeds.";
    private constructor();
}
export declare class AppBskyFeedDefsFeedViewPost {
    static readonly nsid = "app.bsky.feed.defs";
    static readonly def = "feedViewPost";
    static readonly kind: "object";
    $type: string;
    post: AppBskyFeedDefsPostView;
    reply?: AppBskyFeedDefsReplyRef;
    opThreadPostIndex?: number;
    opThreadPostCount?: number;
    reason?: AppBskyFeedDefsReasonRepost | AppBskyFeedDefsReasonPin | {
        $type?: string;
    };
    feedContext?: string;
    reqId?: string;
    constructor(input?: Partial<AppBskyFeedDefsFeedViewPost>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyFeedDefsFeedViewPost;
}
export declare class AppBskyFeedDefsGeneratorView {
    static readonly nsid = "app.bsky.feed.defs";
    static readonly def = "generatorView";
    static readonly kind: "object";
    $type: string;
    uri: string;
    cid: string;
    did: string;
    creator: AppBskyActorDefsProfileView;
    displayName: string;
    description?: string;
    descriptionFacets?: Array<AppBskyRichtextFacet>;
    avatar?: string;
    likeCount?: number;
    acceptsInteractions?: boolean;
    labels?: Array<ComAtprotoLabelDefsLabel>;
    viewer?: AppBskyFeedDefsGeneratorViewerState;
    contentMode?: "app.bsky.feed.defs#contentModeUnspecified" | "app.bsky.feed.defs#contentModeVideo" | (string & {});
    indexedAt: string;
    constructor(input?: Partial<AppBskyFeedDefsGeneratorView>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyFeedDefsGeneratorView;
}
export declare class AppBskyFeedDefsGeneratorViewerState {
    static readonly nsid = "app.bsky.feed.defs";
    static readonly def = "generatorViewerState";
    static readonly kind: "object";
    $type: string;
    like?: string;
    constructor(input?: Partial<AppBskyFeedDefsGeneratorViewerState>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyFeedDefsGeneratorViewerState;
}
export declare class AppBskyFeedDefsInteraction {
    static readonly nsid = "app.bsky.feed.defs";
    static readonly def = "interaction";
    static readonly kind: "object";
    $type: string;
    item?: string;
    event?: "app.bsky.feed.defs#requestLess" | "app.bsky.feed.defs#requestMore" | "app.bsky.feed.defs#clickthroughItem" | "app.bsky.feed.defs#clickthroughAuthor" | "app.bsky.feed.defs#clickthroughReposter" | "app.bsky.feed.defs#clickthroughEmbed" | "app.bsky.feed.defs#interactionSeen" | "app.bsky.feed.defs#interactionLike" | "app.bsky.feed.defs#interactionRepost" | "app.bsky.feed.defs#interactionReply" | "app.bsky.feed.defs#interactionQuote" | "app.bsky.feed.defs#interactionShare" | (string & {});
    feedContext?: string;
    reqId?: string;
    constructor(input?: Partial<AppBskyFeedDefsInteraction>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyFeedDefsInteraction;
}
/** User liked the feed item */
export declare class AppBskyFeedDefsInteractionLike {
    static readonly nsid = "app.bsky.feed.defs";
    static readonly def = "interactionLike";
    static readonly kind: "token";
    static readonly value = "app.bsky.feed.defs#interactionLike";
    static readonly description = "User liked the feed item";
    private constructor();
}
/** User quoted the feed item */
export declare class AppBskyFeedDefsInteractionQuote {
    static readonly nsid = "app.bsky.feed.defs";
    static readonly def = "interactionQuote";
    static readonly kind: "token";
    static readonly value = "app.bsky.feed.defs#interactionQuote";
    static readonly description = "User quoted the feed item";
    private constructor();
}
/** User replied to the feed item */
export declare class AppBskyFeedDefsInteractionReply {
    static readonly nsid = "app.bsky.feed.defs";
    static readonly def = "interactionReply";
    static readonly kind: "token";
    static readonly value = "app.bsky.feed.defs#interactionReply";
    static readonly description = "User replied to the feed item";
    private constructor();
}
/** User reposted the feed item */
export declare class AppBskyFeedDefsInteractionRepost {
    static readonly nsid = "app.bsky.feed.defs";
    static readonly def = "interactionRepost";
    static readonly kind: "token";
    static readonly value = "app.bsky.feed.defs#interactionRepost";
    static readonly description = "User reposted the feed item";
    private constructor();
}
/** Feed item was seen by user */
export declare class AppBskyFeedDefsInteractionSeen {
    static readonly nsid = "app.bsky.feed.defs";
    static readonly def = "interactionSeen";
    static readonly kind: "token";
    static readonly value = "app.bsky.feed.defs#interactionSeen";
    static readonly description = "Feed item was seen by user";
    private constructor();
}
/** User shared the feed item */
export declare class AppBskyFeedDefsInteractionShare {
    static readonly nsid = "app.bsky.feed.defs";
    static readonly def = "interactionShare";
    static readonly kind: "token";
    static readonly value = "app.bsky.feed.defs#interactionShare";
    static readonly description = "User shared the feed item";
    private constructor();
}
/** The post's likers whom you also follow */
export declare class AppBskyFeedDefsKnownLikers {
    static readonly nsid = "app.bsky.feed.defs";
    static readonly def = "knownLikers";
    static readonly kind: "object";
    $type: string;
    count: number;
    actors: Array<AppBskyActorDefsProfileViewBasic>;
    constructor(input?: Partial<AppBskyFeedDefsKnownLikers>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyFeedDefsKnownLikers;
}
export declare class AppBskyFeedDefsNotFoundPost {
    static readonly nsid = "app.bsky.feed.defs";
    static readonly def = "notFoundPost";
    static readonly kind: "object";
    $type: string;
    uri: string;
    notFound: true;
    constructor(input?: Partial<AppBskyFeedDefsNotFoundPost>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyFeedDefsNotFoundPost;
}
export declare class AppBskyFeedDefsPostView {
    static readonly nsid = "app.bsky.feed.defs";
    static readonly def = "postView";
    static readonly kind: "object";
    $type: string;
    uri: string;
    cid: string;
    author: AppBskyActorDefsProfileViewBasic;
    record: unknown;
    embed?: AppBskyEmbedImagesView | AppBskyEmbedVideoView | AppBskyEmbedGalleryView | AppBskyEmbedExternalView | AppBskyEmbedRecordView | AppBskyEmbedRecordWithMediaView | {
        $type?: string;
    };
    bookmarkCount?: number;
    replyCount?: number;
    repostCount?: number;
    likeCount?: number;
    quoteCount?: number;
    indexedAt: string;
    viewer?: AppBskyFeedDefsViewerState;
    labels?: Array<ComAtprotoLabelDefsLabel>;
    threadgate?: AppBskyFeedDefsThreadgateView;
    debug?: unknown;
    constructor(input?: Partial<AppBskyFeedDefsPostView>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyFeedDefsPostView;
}
export declare class AppBskyFeedDefsReasonPin {
    static readonly nsid = "app.bsky.feed.defs";
    static readonly def = "reasonPin";
    static readonly kind: "object";
    $type: string;
    constructor(input?: Partial<AppBskyFeedDefsReasonPin>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyFeedDefsReasonPin;
}
export declare class AppBskyFeedDefsReasonRepost {
    static readonly nsid = "app.bsky.feed.defs";
    static readonly def = "reasonRepost";
    static readonly kind: "object";
    $type: string;
    by: AppBskyActorDefsProfileViewBasic;
    uri?: string;
    cid?: string;
    indexedAt: string;
    constructor(input?: Partial<AppBskyFeedDefsReasonRepost>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyFeedDefsReasonRepost;
}
export declare class AppBskyFeedDefsReplyRef {
    static readonly nsid = "app.bsky.feed.defs";
    static readonly def = "replyRef";
    static readonly kind: "object";
    $type: string;
    root: AppBskyFeedDefsPostView | AppBskyFeedDefsNotFoundPost | AppBskyFeedDefsBlockedPost | {
        $type?: string;
    };
    parent: AppBskyFeedDefsPostView | AppBskyFeedDefsNotFoundPost | AppBskyFeedDefsBlockedPost | {
        $type?: string;
    };
    grandparentAuthor?: AppBskyActorDefsProfileViewBasic;
    constructor(input?: Partial<AppBskyFeedDefsReplyRef>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyFeedDefsReplyRef;
}
/** Request that less content like the given feed item be shown in the feed */
export declare class AppBskyFeedDefsRequestLess {
    static readonly nsid = "app.bsky.feed.defs";
    static readonly def = "requestLess";
    static readonly kind: "token";
    static readonly value = "app.bsky.feed.defs#requestLess";
    static readonly description = "Request that less content like the given feed item be shown in the feed";
    private constructor();
}
/** Request that more content like the given feed item be shown in the feed */
export declare class AppBskyFeedDefsRequestMore {
    static readonly nsid = "app.bsky.feed.defs";
    static readonly def = "requestMore";
    static readonly kind: "token";
    static readonly value = "app.bsky.feed.defs#requestMore";
    static readonly description = "Request that more content like the given feed item be shown in the feed";
    private constructor();
}
export declare class AppBskyFeedDefsSkeletonFeedPost {
    static readonly nsid = "app.bsky.feed.defs";
    static readonly def = "skeletonFeedPost";
    static readonly kind: "object";
    $type: string;
    post: string;
    reason?: AppBskyFeedDefsSkeletonReasonRepost | AppBskyFeedDefsSkeletonReasonPin | {
        $type?: string;
    };
    feedContext?: string;
    constructor(input?: Partial<AppBskyFeedDefsSkeletonFeedPost>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyFeedDefsSkeletonFeedPost;
}
export declare class AppBskyFeedDefsSkeletonReasonPin {
    static readonly nsid = "app.bsky.feed.defs";
    static readonly def = "skeletonReasonPin";
    static readonly kind: "object";
    $type: string;
    constructor(input?: Partial<AppBskyFeedDefsSkeletonReasonPin>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyFeedDefsSkeletonReasonPin;
}
export declare class AppBskyFeedDefsSkeletonReasonRepost {
    static readonly nsid = "app.bsky.feed.defs";
    static readonly def = "skeletonReasonRepost";
    static readonly kind: "object";
    $type: string;
    repost: string;
    constructor(input?: Partial<AppBskyFeedDefsSkeletonReasonRepost>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyFeedDefsSkeletonReasonRepost;
}
/** Metadata about this post within the context of the thread it is in. */
export declare class AppBskyFeedDefsThreadContext {
    static readonly nsid = "app.bsky.feed.defs";
    static readonly def = "threadContext";
    static readonly kind: "object";
    $type: string;
    rootAuthorLike?: string;
    constructor(input?: Partial<AppBskyFeedDefsThreadContext>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyFeedDefsThreadContext;
}
export declare class AppBskyFeedDefsThreadgateView {
    static readonly nsid = "app.bsky.feed.defs";
    static readonly def = "threadgateView";
    static readonly kind: "object";
    $type: string;
    uri?: string;
    cid?: string;
    record?: unknown;
    lists?: Array<AppBskyGraphDefsListViewBasic>;
    constructor(input?: Partial<AppBskyFeedDefsThreadgateView>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyFeedDefsThreadgateView;
}
export declare class AppBskyFeedDefsThreadViewPost {
    static readonly nsid = "app.bsky.feed.defs";
    static readonly def = "threadViewPost";
    static readonly kind: "object";
    $type: string;
    post: AppBskyFeedDefsPostView;
    parent?: AppBskyFeedDefsThreadViewPost | AppBskyFeedDefsNotFoundPost | AppBskyFeedDefsBlockedPost | {
        $type?: string;
    };
    replies?: Array<(AppBskyFeedDefsThreadViewPost | AppBskyFeedDefsNotFoundPost | AppBskyFeedDefsBlockedPost | {
        $type?: string;
    })>;
    threadContext?: AppBskyFeedDefsThreadContext;
    constructor(input?: Partial<AppBskyFeedDefsThreadViewPost>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyFeedDefsThreadViewPost;
}
/** Metadata about the requesting account's relationship with the subject content. Only has meaningful content for authed requests. */
export declare class AppBskyFeedDefsViewerState {
    static readonly nsid = "app.bsky.feed.defs";
    static readonly def = "viewerState";
    static readonly kind: "object";
    $type: string;
    repost?: string;
    like?: string;
    bookmarked?: boolean;
    threadMuted?: boolean;
    replyDisabled?: boolean;
    embeddingDisabled?: boolean;
    pinned?: boolean;
    knownLikers?: AppBskyFeedDefsKnownLikers;
    constructor(input?: Partial<AppBskyFeedDefsViewerState>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyFeedDefsViewerState;
}
/** Get information about a feed generator, including policies and offered feed URIs. Does not require auth; implemented by Feed Generator services (not App View). */
export declare class AppBskyFeedDescribeFeedGenerator {
    static readonly nsid = "app.bsky.feed.describeFeedGenerator";
    static readonly def = "main";
    static readonly kind: "query";
    static readonly http: "GET";
    static readonly errorNames: readonly [];
    constructor(input?: Partial<AppBskyFeedDescribeFeedGenerator>);
    toParams(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): AppBskyFeedDescribeFeedGenerator;
}
export type AppBskyFeedDescribeFeedGeneratorOutput = {
    did: string;
    feeds: Array<AppBskyFeedDescribeFeedGeneratorFeed>;
    links?: AppBskyFeedDescribeFeedGeneratorLinks;
};
export declare class AppBskyFeedDescribeFeedGeneratorFeed {
    static readonly nsid = "app.bsky.feed.describeFeedGenerator";
    static readonly def = "feed";
    static readonly kind: "object";
    $type: string;
    uri: string;
    constructor(input?: Partial<AppBskyFeedDescribeFeedGeneratorFeed>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyFeedDescribeFeedGeneratorFeed;
}
export declare class AppBskyFeedDescribeFeedGeneratorLinks {
    static readonly nsid = "app.bsky.feed.describeFeedGenerator";
    static readonly def = "links";
    static readonly kind: "object";
    $type: string;
    privacyPolicy?: string;
    termsOfService?: string;
    constructor(input?: Partial<AppBskyFeedDescribeFeedGeneratorLinks>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyFeedDescribeFeedGeneratorLinks;
}
/** Record declaring of the existence of a feed generator, and containing metadata about it. The record can exist in any repository. */
export declare class AppBskyFeedGenerator {
    static readonly nsid = "app.bsky.feed.generator";
    static readonly def = "main";
    static readonly kind: "record";
    static readonly recordKey = "any";
    $type: string;
    did: string;
    displayName: string;
    description?: string;
    descriptionFacets?: Array<AppBskyRichtextFacet>;
    avatar?: RepoBlobJson;
    acceptsInteractions?: boolean;
    labels?: ComAtprotoLabelDefsSelfLabels | {
        $type?: string;
    };
    contentMode?: "app.bsky.feed.defs#contentModeUnspecified" | "app.bsky.feed.defs#contentModeVideo" | (string & {});
    createdAt: string;
    constructor(input?: Partial<AppBskyFeedGenerator>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyFeedGenerator;
}
/** Get a list of feeds (feed generator records) created by the actor (in the actor's repo). */
export declare class AppBskyFeedGetActorFeeds {
    static readonly nsid = "app.bsky.feed.getActorFeeds";
    static readonly def = "main";
    static readonly kind: "query";
    static readonly http: "GET";
    static readonly errorNames: readonly [];
    actor: string;
    limit?: number;
    cursor?: string;
    constructor(input?: Partial<AppBskyFeedGetActorFeeds>);
    toParams(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): AppBskyFeedGetActorFeeds;
}
export type AppBskyFeedGetActorFeedsOutput = {
    cursor?: string;
    feeds: Array<AppBskyFeedDefsGeneratorView>;
};
/** Get a list of posts liked by an actor. Requires auth, actor must be the requesting account. */
export declare class AppBskyFeedGetActorLikes {
    static readonly nsid = "app.bsky.feed.getActorLikes";
    static readonly def = "main";
    static readonly kind: "query";
    static readonly http: "GET";
    static readonly errorNames: readonly ["BlockedActor", "BlockedByActor"];
    actor: string;
    limit?: number;
    cursor?: string;
    constructor(input?: Partial<AppBskyFeedGetActorLikes>);
    toParams(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): AppBskyFeedGetActorLikes;
}
export type AppBskyFeedGetActorLikesOutput = {
    cursor?: string;
    feed: Array<AppBskyFeedDefsFeedViewPost>;
};
/** Get a view of an actor's 'author feed' (post and reposts by the author). Does not require auth. */
export declare class AppBskyFeedGetAuthorFeed {
    static readonly nsid = "app.bsky.feed.getAuthorFeed";
    static readonly def = "main";
    static readonly kind: "query";
    static readonly http: "GET";
    static readonly errorNames: readonly ["BlockedActor", "BlockedByActor"];
    actor: string;
    limit?: number;
    cursor?: string;
    filter?: "posts_with_replies" | "posts_no_replies" | "posts_with_media" | "posts_and_author_threads" | "posts_with_video" | (string & {});
    includePins?: boolean;
    constructor(input?: Partial<AppBskyFeedGetAuthorFeed>);
    toParams(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): AppBskyFeedGetAuthorFeed;
}
export type AppBskyFeedGetAuthorFeedOutput = {
    cursor?: string;
    feed: Array<AppBskyFeedDefsFeedViewPost>;
};
/** Get a hydrated feed from an actor's selected feed generator. Implemented by App View. */
export declare class AppBskyFeedGetFeed {
    static readonly nsid = "app.bsky.feed.getFeed";
    static readonly def = "main";
    static readonly kind: "query";
    static readonly http: "GET";
    static readonly errorNames: readonly ["UnknownFeed"];
    feed: string;
    limit?: number;
    cursor?: string;
    constructor(input?: Partial<AppBskyFeedGetFeed>);
    toParams(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): AppBskyFeedGetFeed;
}
export type AppBskyFeedGetFeedOutput = {
    cursor?: string;
    feed: Array<AppBskyFeedDefsFeedViewPost>;
};
/** Get information about a feed generator. Implemented by AppView. */
export declare class AppBskyFeedGetFeedGenerator {
    static readonly nsid = "app.bsky.feed.getFeedGenerator";
    static readonly def = "main";
    static readonly kind: "query";
    static readonly http: "GET";
    static readonly errorNames: readonly [];
    feed: string;
    constructor(input?: Partial<AppBskyFeedGetFeedGenerator>);
    toParams(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): AppBskyFeedGetFeedGenerator;
}
export type AppBskyFeedGetFeedGeneratorOutput = {
    view: AppBskyFeedDefsGeneratorView;
    isOnline: boolean;
    isValid: boolean;
};
/** Get information about a list of feed generators. */
export declare class AppBskyFeedGetFeedGenerators {
    static readonly nsid = "app.bsky.feed.getFeedGenerators";
    static readonly def = "main";
    static readonly kind: "query";
    static readonly http: "GET";
    static readonly errorNames: readonly [];
    feeds: Array<string>;
    constructor(input?: Partial<AppBskyFeedGetFeedGenerators>);
    toParams(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): AppBskyFeedGetFeedGenerators;
}
export type AppBskyFeedGetFeedGeneratorsOutput = {
    feeds: Array<AppBskyFeedDefsGeneratorView>;
};
/** Get a skeleton of a feed provided by a feed generator. Auth is optional, depending on provider requirements, and provides the DID of the requester. Implemented by Feed Generator Service. */
export declare class AppBskyFeedGetFeedSkeleton {
    static readonly nsid = "app.bsky.feed.getFeedSkeleton";
    static readonly def = "main";
    static readonly kind: "query";
    static readonly http: "GET";
    static readonly errorNames: readonly ["UnknownFeed"];
    feed: string;
    limit?: number;
    cursor?: string;
    constructor(input?: Partial<AppBskyFeedGetFeedSkeleton>);
    toParams(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): AppBskyFeedGetFeedSkeleton;
}
export type AppBskyFeedGetFeedSkeletonOutput = {
    cursor?: string;
    feed: Array<AppBskyFeedDefsSkeletonFeedPost>;
    reqId?: string;
};
/** Get like records which reference a subject (by AT-URI and CID). */
export declare class AppBskyFeedGetLikes {
    static readonly nsid = "app.bsky.feed.getLikes";
    static readonly def = "main";
    static readonly kind: "query";
    static readonly http: "GET";
    static readonly errorNames: readonly [];
    uri: string;
    cid?: string;
    limit?: number;
    cursor?: string;
    constructor(input?: Partial<AppBskyFeedGetLikes>);
    toParams(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): AppBskyFeedGetLikes;
}
export type AppBskyFeedGetLikesOutput = {
    uri: string;
    cid?: string;
    cursor?: string;
    likes: Array<AppBskyFeedGetLikesLike>;
};
export declare class AppBskyFeedGetLikesLike {
    static readonly nsid = "app.bsky.feed.getLikes";
    static readonly def = "like";
    static readonly kind: "object";
    $type: string;
    indexedAt: string;
    createdAt: string;
    actor: AppBskyActorDefsProfileView;
    constructor(input?: Partial<AppBskyFeedGetLikesLike>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyFeedGetLikesLike;
}
/** Get a feed of recent posts from a list (posts and reposts from any actors on the list). Does not require auth. */
export declare class AppBskyFeedGetListFeed {
    static readonly nsid = "app.bsky.feed.getListFeed";
    static readonly def = "main";
    static readonly kind: "query";
    static readonly http: "GET";
    static readonly errorNames: readonly ["UnknownList"];
    list: string;
    limit?: number;
    cursor?: string;
    since?: string;
    constructor(input?: Partial<AppBskyFeedGetListFeed>);
    toParams(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): AppBskyFeedGetListFeed;
}
export type AppBskyFeedGetListFeedOutput = {
    cursor?: string;
    startCursor?: string;
    feed: Array<AppBskyFeedDefsFeedViewPost>;
};
/** Gets post views for a specified list of posts (by AT-URI). This is sometimes referred to as 'hydrating' a 'feed skeleton'. */
export declare class AppBskyFeedGetPosts {
    static readonly nsid = "app.bsky.feed.getPosts";
    static readonly def = "main";
    static readonly kind: "query";
    static readonly http: "GET";
    static readonly errorNames: readonly [];
    uris: Array<string>;
    constructor(input?: Partial<AppBskyFeedGetPosts>);
    toParams(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): AppBskyFeedGetPosts;
}
export type AppBskyFeedGetPostsOutput = {
    posts: Array<AppBskyFeedDefsPostView>;
};
/** Get posts in a thread. Does not require auth, but additional metadata and filtering will be applied for authed requests. */
export declare class AppBskyFeedGetPostThread {
    static readonly nsid = "app.bsky.feed.getPostThread";
    static readonly def = "main";
    static readonly kind: "query";
    static readonly http: "GET";
    static readonly errorNames: readonly ["NotFound"];
    uri: string;
    depth?: number;
    parentHeight?: number;
    constructor(input?: Partial<AppBskyFeedGetPostThread>);
    toParams(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): AppBskyFeedGetPostThread;
}
export type AppBskyFeedGetPostThreadOutput = {
    thread: AppBskyFeedDefsThreadViewPost | AppBskyFeedDefsNotFoundPost | AppBskyFeedDefsBlockedPost | {
        $type?: string;
    };
    threadgate?: AppBskyFeedDefsThreadgateView;
};
/** Get a list of quotes for a given post. */
export declare class AppBskyFeedGetQuotes {
    static readonly nsid = "app.bsky.feed.getQuotes";
    static readonly def = "main";
    static readonly kind: "query";
    static readonly http: "GET";
    static readonly errorNames: readonly [];
    uri: string;
    cid?: string;
    limit?: number;
    cursor?: string;
    sort?: "latest" | "top" | (string & {});
    constructor(input?: Partial<AppBskyFeedGetQuotes>);
    toParams(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): AppBskyFeedGetQuotes;
}
export type AppBskyFeedGetQuotesOutput = {
    uri: string;
    cid?: string;
    cursor?: string;
    posts: Array<AppBskyFeedDefsPostView>;
};
/** Get a list of reposts for a given post. */
export declare class AppBskyFeedGetRepostedBy {
    static readonly nsid = "app.bsky.feed.getRepostedBy";
    static readonly def = "main";
    static readonly kind: "query";
    static readonly http: "GET";
    static readonly errorNames: readonly [];
    uri: string;
    cid?: string;
    limit?: number;
    cursor?: string;
    constructor(input?: Partial<AppBskyFeedGetRepostedBy>);
    toParams(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): AppBskyFeedGetRepostedBy;
}
export type AppBskyFeedGetRepostedByOutput = {
    uri: string;
    cid?: string;
    cursor?: string;
    repostedBy: Array<AppBskyActorDefsProfileView>;
};
/** Get a list of suggested feeds (feed generators) for the requesting account. */
export declare class AppBskyFeedGetSuggestedFeeds {
    static readonly nsid = "app.bsky.feed.getSuggestedFeeds";
    static readonly def = "main";
    static readonly kind: "query";
    static readonly http: "GET";
    static readonly errorNames: readonly [];
    limit?: number;
    cursor?: string;
    constructor(input?: Partial<AppBskyFeedGetSuggestedFeeds>);
    toParams(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): AppBskyFeedGetSuggestedFeeds;
}
export type AppBskyFeedGetSuggestedFeedsOutput = {
    cursor?: string;
    feeds: Array<AppBskyFeedDefsGeneratorView>;
};
/** Get a view of the requesting account's home timeline. This is expected to be some form of reverse-chronological feed. */
export declare class AppBskyFeedGetTimeline {
    static readonly nsid = "app.bsky.feed.getTimeline";
    static readonly def = "main";
    static readonly kind: "query";
    static readonly http: "GET";
    static readonly errorNames: readonly [];
    algorithm?: string;
    limit?: number;
    cursor?: string;
    since?: string;
    constructor(input?: Partial<AppBskyFeedGetTimeline>);
    toParams(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): AppBskyFeedGetTimeline;
}
export type AppBskyFeedGetTimelineOutput = {
    cursor?: string;
    startCursor?: string;
    feed: Array<AppBskyFeedDefsFeedViewPost>;
};
/** Record declaring a 'like' of a piece of subject content. */
export declare class AppBskyFeedLike {
    static readonly nsid = "app.bsky.feed.like";
    static readonly def = "main";
    static readonly kind: "record";
    static readonly recordKey = "tid";
    $type: string;
    subject: ComAtprotoRepoStrongRef;
    createdAt: string;
    via?: ComAtprotoRepoStrongRef;
    constructor(input?: Partial<AppBskyFeedLike>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyFeedLike;
}
/** Record containing a Bluesky post. */
export declare class AppBskyFeedPost {
    static readonly nsid = "app.bsky.feed.post";
    static readonly def = "main";
    static readonly kind: "record";
    static readonly recordKey = "tid";
    $type: string;
    text: string;
    entities?: Array<AppBskyFeedPostEntity>;
    facets?: Array<AppBskyRichtextFacet>;
    reply?: AppBskyFeedPostReplyRef;
    embed?: AppBskyEmbedImages | AppBskyEmbedVideo | AppBskyEmbedGallery | AppBskyEmbedExternal | AppBskyEmbedRecord | AppBskyEmbedRecordWithMedia | {
        $type?: string;
    };
    langs?: Array<string>;
    labels?: ComAtprotoLabelDefsSelfLabels | {
        $type?: string;
    };
    tags?: Array<string>;
    createdAt: string;
    constructor(input?: Partial<AppBskyFeedPost>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyFeedPost;
}
/** Deprecated: use facets instead. */
export declare class AppBskyFeedPostEntity {
    static readonly nsid = "app.bsky.feed.post";
    static readonly def = "entity";
    static readonly kind: "object";
    $type: string;
    index: AppBskyFeedPostTextSlice;
    type: string;
    value: string;
    constructor(input?: Partial<AppBskyFeedPostEntity>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyFeedPostEntity;
}
export declare class AppBskyFeedPostReplyRef {
    static readonly nsid = "app.bsky.feed.post";
    static readonly def = "replyRef";
    static readonly kind: "object";
    $type: string;
    root: ComAtprotoRepoStrongRef;
    parent: ComAtprotoRepoStrongRef;
    constructor(input?: Partial<AppBskyFeedPostReplyRef>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyFeedPostReplyRef;
}
/** Deprecated. Use app.bsky.richtext instead -- A text segment. Start is inclusive, end is exclusive. Indices are for utf16-encoded strings. */
export declare class AppBskyFeedPostTextSlice {
    static readonly nsid = "app.bsky.feed.post";
    static readonly def = "textSlice";
    static readonly kind: "object";
    $type: string;
    start: number;
    end: number;
    constructor(input?: Partial<AppBskyFeedPostTextSlice>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyFeedPostTextSlice;
}
/** Record defining interaction rules for a post. The record key (rkey) of the postgate record must match the record key of the post, and that record must be in the same repository. */
export declare class AppBskyFeedPostgate {
    static readonly nsid = "app.bsky.feed.postgate";
    static readonly def = "main";
    static readonly kind: "record";
    static readonly recordKey = "tid";
    $type: string;
    createdAt: string;
    post: string;
    detachedEmbeddingUris?: Array<string>;
    embeddingRules?: Array<(AppBskyFeedPostgateDisableRule | {
        $type?: string;
    })>;
    constructor(input?: Partial<AppBskyFeedPostgate>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyFeedPostgate;
}
/** Disables embedding of this post. */
export declare class AppBskyFeedPostgateDisableRule {
    static readonly nsid = "app.bsky.feed.postgate";
    static readonly def = "disableRule";
    static readonly kind: "object";
    $type: string;
    constructor(input?: Partial<AppBskyFeedPostgateDisableRule>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyFeedPostgateDisableRule;
}
/** Record representing a 'repost' of an existing Bluesky post. */
export declare class AppBskyFeedRepost {
    static readonly nsid = "app.bsky.feed.repost";
    static readonly def = "main";
    static readonly kind: "record";
    static readonly recordKey = "tid";
    $type: string;
    subject: ComAtprotoRepoStrongRef;
    createdAt: string;
    via?: ComAtprotoRepoStrongRef;
    constructor(input?: Partial<AppBskyFeedRepost>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyFeedRepost;
}
/** Find posts matching search criteria, returning views of those posts. Note that this API endpoint may require authentication (eg, not public) for some service providers and implementations. */
export declare class AppBskyFeedSearchPosts {
    static readonly nsid = "app.bsky.feed.searchPosts";
    static readonly def = "main";
    static readonly kind: "query";
    static readonly http: "GET";
    static readonly errorNames: readonly ["BadQueryString"];
    q: string;
    sort?: "top" | "latest" | (string & {});
    since?: string;
    until?: string;
    mentions?: string;
    author?: string;
    lang?: string;
    domain?: string;
    url?: string;
    tag?: Array<string>;
    limit?: number;
    cursor?: string;
    constructor(input?: Partial<AppBskyFeedSearchPosts>);
    toParams(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): AppBskyFeedSearchPosts;
}
export type AppBskyFeedSearchPostsOutput = {
    cursor?: string;
    hitsTotal?: number;
    posts: Array<AppBskyFeedDefsPostView>;
};
/** Find posts matching a search query or filters, returning search hits for matching post records. */
export declare class AppBskyFeedSearchPostsV2 {
    static readonly nsid = "app.bsky.feed.searchPostsV2";
    static readonly def = "main";
    static readonly kind: "query";
    static readonly http: "GET";
    static readonly errorNames: readonly ["BadQueryString"];
    cursor?: string;
    limit?: number;
    query?: string;
    sort?: "recent" | "top" | (string & {});
    authors?: Array<string>;
    mentions?: Array<string>;
    domains?: Array<string>;
    urls?: Array<string>;
    embeddedAtUris?: Array<string>;
    hashtags?: Array<string>;
    excludeAuthors?: Array<string>;
    excludeMentions?: Array<string>;
    excludeDomains?: Array<string>;
    excludeUrls?: Array<string>;
    excludeEmbeddedAtUris?: Array<string>;
    excludeHashtags?: Array<string>;
    since?: string;
    until?: string;
    allTime?: boolean;
    languages?: Array<string>;
    excludeLanguages?: Array<string>;
    hasMedia?: boolean;
    hasVideo?: boolean;
    replyParentUri?: string;
    threadRootUri?: string;
    excludeReplies?: boolean;
    repliesOnly?: boolean;
    following?: boolean;
    queryLanguage?: "ja" | "zh" | "ko" | "th" | "ar" | (string & {});
    constructor(input?: Partial<AppBskyFeedSearchPostsV2>);
    toParams(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): AppBskyFeedSearchPostsV2;
}
export type AppBskyFeedSearchPostsV2Output = {
    cursor?: string;
    hitsTotal?: number;
    posts: Array<AppBskyFeedDefsPostView>;
    detectedQueryLanguages?: Array<("ja" | "zh" | "ko" | "th" | "ar" | (string & {}))>;
};
/** Send information about interactions with feed items back to the feed generator that served them. */
export declare class AppBskyFeedSendInteractions {
    static readonly nsid = "app.bsky.feed.sendInteractions";
    static readonly def = "main";
    static readonly kind: "procedure";
    static readonly http: "POST";
    static readonly errorNames: readonly [];
    feed?: string;
    interactions: Array<AppBskyFeedDefsInteraction>;
    constructor(input?: Partial<AppBskyFeedSendInteractions>);
    toParams(): Record<string, unknown>;
    toBody(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): AppBskyFeedSendInteractions;
}
export type AppBskyFeedSendInteractionsOutput = Record<string, unknown>;
/** Record defining interaction gating rules for a thread (aka, reply controls). The record key (rkey) of the threadgate record must match the record key of the thread's root post, and that record must be in the same repository. */
export declare class AppBskyFeedThreadgate {
    static readonly nsid = "app.bsky.feed.threadgate";
    static readonly def = "main";
    static readonly kind: "record";
    static readonly recordKey = "tid";
    $type: string;
    post: string;
    allow?: Array<(AppBskyFeedThreadgateMentionRule | AppBskyFeedThreadgateFollowerRule | AppBskyFeedThreadgateFollowingRule | AppBskyFeedThreadgateListRule | {
        $type?: string;
    })>;
    createdAt: string;
    hiddenReplies?: Array<string>;
    constructor(input?: Partial<AppBskyFeedThreadgate>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyFeedThreadgate;
}
/** Allow replies from actors who follow you. */
export declare class AppBskyFeedThreadgateFollowerRule {
    static readonly nsid = "app.bsky.feed.threadgate";
    static readonly def = "followerRule";
    static readonly kind: "object";
    $type: string;
    constructor(input?: Partial<AppBskyFeedThreadgateFollowerRule>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyFeedThreadgateFollowerRule;
}
/** Allow replies from actors you follow. */
export declare class AppBskyFeedThreadgateFollowingRule {
    static readonly nsid = "app.bsky.feed.threadgate";
    static readonly def = "followingRule";
    static readonly kind: "object";
    $type: string;
    constructor(input?: Partial<AppBskyFeedThreadgateFollowingRule>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyFeedThreadgateFollowingRule;
}
/** Allow replies from actors on a list. */
export declare class AppBskyFeedThreadgateListRule {
    static readonly nsid = "app.bsky.feed.threadgate";
    static readonly def = "listRule";
    static readonly kind: "object";
    $type: string;
    list: string;
    constructor(input?: Partial<AppBskyFeedThreadgateListRule>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyFeedThreadgateListRule;
}
/** Allow replies from actors mentioned in your post. */
export declare class AppBskyFeedThreadgateMentionRule {
    static readonly nsid = "app.bsky.feed.threadgate";
    static readonly def = "mentionRule";
    static readonly kind: "object";
    $type: string;
    constructor(input?: Partial<AppBskyFeedThreadgateMentionRule>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyFeedThreadgateMentionRule;
}
/** Record declaring a 'block' relationship against another account. NOTE: blocks are public in Bluesky; see blog posts for details. */
export declare class AppBskyGraphBlock {
    static readonly nsid = "app.bsky.graph.block";
    static readonly def = "main";
    static readonly kind: "record";
    static readonly recordKey = "tid";
    $type: string;
    subject: string;
    createdAt: string;
    constructor(input?: Partial<AppBskyGraphBlock>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyGraphBlock;
}
/** A list of actors used for curation purposes such as list feeds or interaction gating. */
export declare class AppBskyGraphDefsCuratelist {
    static readonly nsid = "app.bsky.graph.defs";
    static readonly def = "curatelist";
    static readonly kind: "token";
    static readonly value = "app.bsky.graph.defs#curatelist";
    static readonly description = "A list of actors used for curation purposes such as list feeds or interaction gating.";
    private constructor();
}
export declare class AppBskyGraphDefsListItemView {
    static readonly nsid = "app.bsky.graph.defs";
    static readonly def = "listItemView";
    static readonly kind: "object";
    $type: string;
    uri: string;
    subject: AppBskyActorDefsProfileView;
    subjectOptedOut?: true;
    constructor(input?: Partial<AppBskyGraphDefsListItemView>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyGraphDefsListItemView;
}
export declare class AppBskyGraphDefsListPurpose {
    static readonly nsid = "app.bsky.graph.defs";
    static readonly def = "listPurpose";
    static readonly kind: "string";
    static readonly knownValues: readonly ["app.bsky.graph.defs#modlist", "app.bsky.graph.defs#curatelist", "app.bsky.graph.defs#referencelist"];
    static includes(value: string): boolean;
    private constructor();
}
export declare class AppBskyGraphDefsListView {
    static readonly nsid = "app.bsky.graph.defs";
    static readonly def = "listView";
    static readonly kind: "object";
    $type: string;
    uri: string;
    cid: string;
    creator: AppBskyActorDefsProfileView;
    name: string;
    purpose: "app.bsky.graph.defs#modlist" | "app.bsky.graph.defs#curatelist" | "app.bsky.graph.defs#referencelist" | (string & {});
    description?: string;
    descriptionFacets?: Array<AppBskyRichtextFacet>;
    avatar?: string;
    listItemCount?: number;
    labels?: Array<ComAtprotoLabelDefsLabel>;
    viewer?: AppBskyGraphDefsListViewerState;
    indexedAt: string;
    constructor(input?: Partial<AppBskyGraphDefsListView>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyGraphDefsListView;
}
export declare class AppBskyGraphDefsListViewBasic {
    static readonly nsid = "app.bsky.graph.defs";
    static readonly def = "listViewBasic";
    static readonly kind: "object";
    $type: string;
    uri: string;
    cid: string;
    name: string;
    purpose: "app.bsky.graph.defs#modlist" | "app.bsky.graph.defs#curatelist" | "app.bsky.graph.defs#referencelist" | (string & {});
    avatar?: string;
    listItemCount?: number;
    labels?: Array<ComAtprotoLabelDefsLabel>;
    viewer?: AppBskyGraphDefsListViewerState;
    indexedAt?: string;
    constructor(input?: Partial<AppBskyGraphDefsListViewBasic>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyGraphDefsListViewBasic;
}
export declare class AppBskyGraphDefsListViewerState {
    static readonly nsid = "app.bsky.graph.defs";
    static readonly def = "listViewerState";
    static readonly kind: "object";
    $type: string;
    muted?: boolean;
    blocked?: string;
    referenceListOptOut?: string;
    constructor(input?: Partial<AppBskyGraphDefsListViewerState>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyGraphDefsListViewerState;
}
/** A list of actors to apply an aggregate moderation action (mute/block) on. */
export declare class AppBskyGraphDefsModlist {
    static readonly nsid = "app.bsky.graph.defs";
    static readonly def = "modlist";
    static readonly kind: "token";
    static readonly value = "app.bsky.graph.defs#modlist";
    static readonly description = "A list of actors to apply an aggregate moderation action (mute/block) on.";
    private constructor();
}
/** indicates that a handle or DID could not be resolved */
export declare class AppBskyGraphDefsNotFoundActor {
    static readonly nsid = "app.bsky.graph.defs";
    static readonly def = "notFoundActor";
    static readonly kind: "object";
    $type: string;
    actor: string;
    notFound: true;
    constructor(input?: Partial<AppBskyGraphDefsNotFoundActor>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyGraphDefsNotFoundActor;
}
/** A list of actors used for only for reference purposes such as within a starter pack. */
export declare class AppBskyGraphDefsReferencelist {
    static readonly nsid = "app.bsky.graph.defs";
    static readonly def = "referencelist";
    static readonly kind: "token";
    static readonly value = "app.bsky.graph.defs#referencelist";
    static readonly description = "A list of actors used for only for reference purposes such as within a starter pack.";
    private constructor();
}
/** lists the bi-directional graph relationships between one actor (not indicated in the object), and the target actors (the DID included in the object) */
export declare class AppBskyGraphDefsRelationship {
    static readonly nsid = "app.bsky.graph.defs";
    static readonly def = "relationship";
    static readonly kind: "object";
    $type: string;
    did: string;
    following?: string;
    followedBy?: string;
    blocking?: string;
    blockedBy?: string;
    blockingByList?: string;
    blockedByList?: string;
    constructor(input?: Partial<AppBskyGraphDefsRelationship>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyGraphDefsRelationship;
}
export declare class AppBskyGraphDefsStarterPackView {
    static readonly nsid = "app.bsky.graph.defs";
    static readonly def = "starterPackView";
    static readonly kind: "object";
    $type: string;
    uri: string;
    cid: string;
    record: unknown;
    creator: AppBskyActorDefsProfileViewBasic;
    list?: AppBskyGraphDefsListViewBasic;
    listItemsSample?: Array<AppBskyGraphDefsListItemView>;
    feeds?: Array<AppBskyFeedDefsGeneratorView>;
    joinedWeekCount?: number;
    joinedAllTimeCount?: number;
    labels?: Array<ComAtprotoLabelDefsLabel>;
    indexedAt: string;
    constructor(input?: Partial<AppBskyGraphDefsStarterPackView>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyGraphDefsStarterPackView;
}
export declare class AppBskyGraphDefsStarterPackViewBasic {
    static readonly nsid = "app.bsky.graph.defs";
    static readonly def = "starterPackViewBasic";
    static readonly kind: "object";
    $type: string;
    uri: string;
    cid: string;
    record: unknown;
    creator: AppBskyActorDefsProfileViewBasic;
    listItemCount?: number;
    joinedWeekCount?: number;
    joinedAllTimeCount?: number;
    labels?: Array<ComAtprotoLabelDefsLabel>;
    indexedAt: string;
    constructor(input?: Partial<AppBskyGraphDefsStarterPackViewBasic>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyGraphDefsStarterPackViewBasic;
}
/** Record declaring a social 'follow' relationship of another account. Duplicate follows will be ignored by the AppView. */
export declare class AppBskyGraphFollow {
    static readonly nsid = "app.bsky.graph.follow";
    static readonly def = "main";
    static readonly kind: "record";
    static readonly recordKey = "tid";
    $type: string;
    subject: string;
    createdAt: string;
    via?: ComAtprotoRepoStrongRef;
    constructor(input?: Partial<AppBskyGraphFollow>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyGraphFollow;
}
/** Get a list of starter packs created by the actor. */
export declare class AppBskyGraphGetActorStarterPacks {
    static readonly nsid = "app.bsky.graph.getActorStarterPacks";
    static readonly def = "main";
    static readonly kind: "query";
    static readonly http: "GET";
    static readonly errorNames: readonly [];
    actor: string;
    limit?: number;
    cursor?: string;
    constructor(input?: Partial<AppBskyGraphGetActorStarterPacks>);
    toParams(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): AppBskyGraphGetActorStarterPacks;
}
export type AppBskyGraphGetActorStarterPacksOutput = {
    cursor?: string;
    starterPacks: Array<AppBskyGraphDefsStarterPackViewBasic>;
};
/** Enumerates which accounts the requesting account is currently blocking. Requires auth. */
export declare class AppBskyGraphGetBlocks {
    static readonly nsid = "app.bsky.graph.getBlocks";
    static readonly def = "main";
    static readonly kind: "query";
    static readonly http: "GET";
    static readonly errorNames: readonly [];
    limit?: number;
    cursor?: string;
    constructor(input?: Partial<AppBskyGraphGetBlocks>);
    toParams(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): AppBskyGraphGetBlocks;
}
export type AppBskyGraphGetBlocksOutput = {
    cursor?: string;
    blocks: Array<AppBskyActorDefsProfileView>;
};
/** Enumerates accounts which follow a specified account (actor) and are followed by the viewer. */
export declare class AppBskyGraphGetKnownFollowers {
    static readonly nsid = "app.bsky.graph.getKnownFollowers";
    static readonly def = "main";
    static readonly kind: "query";
    static readonly http: "GET";
    static readonly errorNames: readonly [];
    actor: string;
    limit?: number;
    cursor?: string;
    constructor(input?: Partial<AppBskyGraphGetKnownFollowers>);
    toParams(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): AppBskyGraphGetKnownFollowers;
}
export type AppBskyGraphGetKnownFollowersOutput = {
    subject: AppBskyActorDefsProfileView;
    cursor?: string;
    followers: Array<AppBskyActorDefsProfileView>;
};
/** Gets a 'view' (with additional context) of a specified list. */
export declare class AppBskyGraphGetList {
    static readonly nsid = "app.bsky.graph.getList";
    static readonly def = "main";
    static readonly kind: "query";
    static readonly http: "GET";
    static readonly errorNames: readonly [];
    list: string;
    limit?: number;
    cursor?: string;
    constructor(input?: Partial<AppBskyGraphGetList>);
    toParams(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): AppBskyGraphGetList;
}
export type AppBskyGraphGetListOutput = {
    cursor?: string;
    list: AppBskyGraphDefsListView;
    items: Array<AppBskyGraphDefsListItemView>;
};
/** Get mod lists that the requesting account (actor) is blocking. Requires auth. */
export declare class AppBskyGraphGetListBlocks {
    static readonly nsid = "app.bsky.graph.getListBlocks";
    static readonly def = "main";
    static readonly kind: "query";
    static readonly http: "GET";
    static readonly errorNames: readonly [];
    limit?: number;
    cursor?: string;
    constructor(input?: Partial<AppBskyGraphGetListBlocks>);
    toParams(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): AppBskyGraphGetListBlocks;
}
export type AppBskyGraphGetListBlocksOutput = {
    cursor?: string;
    lists: Array<AppBskyGraphDefsListView>;
};
/** Enumerates mod lists that the requesting account (actor) currently has muted. Requires auth. */
export declare class AppBskyGraphGetListMutes {
    static readonly nsid = "app.bsky.graph.getListMutes";
    static readonly def = "main";
    static readonly kind: "query";
    static readonly http: "GET";
    static readonly errorNames: readonly [];
    limit?: number;
    cursor?: string;
    constructor(input?: Partial<AppBskyGraphGetListMutes>);
    toParams(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): AppBskyGraphGetListMutes;
}
export type AppBskyGraphGetListMutesOutput = {
    cursor?: string;
    lists: Array<AppBskyGraphDefsListView>;
};
/** Enumerates the lists created by a specified account (actor). */
export declare class AppBskyGraphGetLists {
    static readonly nsid = "app.bsky.graph.getLists";
    static readonly def = "main";
    static readonly kind: "query";
    static readonly http: "GET";
    static readonly errorNames: readonly [];
    actor: string;
    limit?: number;
    cursor?: string;
    purposes?: Array<("modlist" | "curatelist" | (string & {}))>;
    constructor(input?: Partial<AppBskyGraphGetLists>);
    toParams(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): AppBskyGraphGetLists;
}
export type AppBskyGraphGetListsOutput = {
    cursor?: string;
    lists: Array<AppBskyGraphDefsListView>;
};
/** Enumerates the lists created by the session user, and includes membership information about `actor` in those lists. Only supports curation and moderation lists (no reference lists, used in starter packs). Requires auth. */
export declare class AppBskyGraphGetListsWithMembership {
    static readonly nsid = "app.bsky.graph.getListsWithMembership";
    static readonly def = "main";
    static readonly kind: "query";
    static readonly http: "GET";
    static readonly errorNames: readonly [];
    actor: string;
    limit?: number;
    cursor?: string;
    purposes?: Array<("modlist" | "curatelist" | (string & {}))>;
    constructor(input?: Partial<AppBskyGraphGetListsWithMembership>);
    toParams(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): AppBskyGraphGetListsWithMembership;
}
export type AppBskyGraphGetListsWithMembershipOutput = {
    cursor?: string;
    listsWithMembership: Array<AppBskyGraphGetListsWithMembershipListWithMembership>;
};
/** A list and an optional list item indicating membership of a target user to that list. */
export declare class AppBskyGraphGetListsWithMembershipListWithMembership {
    static readonly nsid = "app.bsky.graph.getListsWithMembership";
    static readonly def = "listWithMembership";
    static readonly kind: "object";
    $type: string;
    list: AppBskyGraphDefsListView;
    listItem?: AppBskyGraphDefsListItemView;
    constructor(input?: Partial<AppBskyGraphGetListsWithMembershipListWithMembership>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyGraphGetListsWithMembershipListWithMembership;
}
/** Enumerates accounts that the requesting account (actor) currently has fully muted. Mutes scoped to specific kinds of content (only reposts, only quote posts) are not included. Responses may contain more items than the requested limit. Requi */
export declare class AppBskyGraphGetMutes {
    static readonly nsid = "app.bsky.graph.getMutes";
    static readonly def = "main";
    static readonly kind: "query";
    static readonly http: "GET";
    static readonly errorNames: readonly [];
    limit?: number;
    cursor?: string;
    constructor(input?: Partial<AppBskyGraphGetMutes>);
    toParams(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): AppBskyGraphGetMutes;
}
export type AppBskyGraphGetMutesOutput = {
    cursor?: string;
    mutes: Array<AppBskyActorDefsProfileView>;
};
/** Enumerates public relationships between one account, and a list of other accounts. Does not require auth. */
export declare class AppBskyGraphGetRelationships {
    static readonly nsid = "app.bsky.graph.getRelationships";
    static readonly def = "main";
    static readonly kind: "query";
    static readonly http: "GET";
    static readonly errorNames: readonly ["ActorNotFound"];
    actor: string;
    others?: Array<string>;
    constructor(input?: Partial<AppBskyGraphGetRelationships>);
    toParams(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): AppBskyGraphGetRelationships;
}
export type AppBskyGraphGetRelationshipsOutput = {
    actor?: string;
    relationships: Array<(AppBskyGraphDefsRelationship | AppBskyGraphDefsNotFoundActor | {
        $type?: string;
    })>;
};
/** Gets a view of a starter pack. */
export declare class AppBskyGraphGetStarterPack {
    static readonly nsid = "app.bsky.graph.getStarterPack";
    static readonly def = "main";
    static readonly kind: "query";
    static readonly http: "GET";
    static readonly errorNames: readonly [];
    starterPack: string;
    constructor(input?: Partial<AppBskyGraphGetStarterPack>);
    toParams(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): AppBskyGraphGetStarterPack;
}
export type AppBskyGraphGetStarterPackOutput = {
    starterPack: AppBskyGraphDefsStarterPackView;
};
/** Get views for a list of starter packs. */
export declare class AppBskyGraphGetStarterPacks {
    static readonly nsid = "app.bsky.graph.getStarterPacks";
    static readonly def = "main";
    static readonly kind: "query";
    static readonly http: "GET";
    static readonly errorNames: readonly [];
    uris: Array<string>;
    constructor(input?: Partial<AppBskyGraphGetStarterPacks>);
    toParams(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): AppBskyGraphGetStarterPacks;
}
export type AppBskyGraphGetStarterPacksOutput = {
    starterPacks: Array<AppBskyGraphDefsStarterPackViewBasic>;
};
/** Enumerates the starter packs created by the session user, and includes membership information about `actor` in those starter packs. Requires auth. */
export declare class AppBskyGraphGetStarterPacksWithMembership {
    static readonly nsid = "app.bsky.graph.getStarterPacksWithMembership";
    static readonly def = "main";
    static readonly kind: "query";
    static readonly http: "GET";
    static readonly errorNames: readonly [];
    actor: string;
    limit?: number;
    cursor?: string;
    constructor(input?: Partial<AppBskyGraphGetStarterPacksWithMembership>);
    toParams(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): AppBskyGraphGetStarterPacksWithMembership;
}
export type AppBskyGraphGetStarterPacksWithMembershipOutput = {
    cursor?: string;
    starterPacksWithMembership: Array<AppBskyGraphGetStarterPacksWithMembershipStarterPackWithMembership>;
};
/** A starter pack and an optional list item indicating membership of a target user to that starter pack. */
export declare class AppBskyGraphGetStarterPacksWithMembershipStarterPackWithMembership {
    static readonly nsid = "app.bsky.graph.getStarterPacksWithMembership";
    static readonly def = "starterPackWithMembership";
    static readonly kind: "object";
    $type: string;
    starterPack: AppBskyGraphDefsStarterPackView;
    listItem?: AppBskyGraphDefsListItemView;
    constructor(input?: Partial<AppBskyGraphGetStarterPacksWithMembershipStarterPackWithMembership>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyGraphGetStarterPacksWithMembershipStarterPackWithMembership;
}
/** Enumerates follows similar to a given account (actor). Expected use is to recommend additional accounts immediately after following one account. */
export declare class AppBskyGraphGetSuggestedFollowsByActor {
    static readonly nsid = "app.bsky.graph.getSuggestedFollowsByActor";
    static readonly def = "main";
    static readonly kind: "query";
    static readonly http: "GET";
    static readonly errorNames: readonly [];
    actor: string;
    constructor(input?: Partial<AppBskyGraphGetSuggestedFollowsByActor>);
    toParams(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): AppBskyGraphGetSuggestedFollowsByActor;
}
export type AppBskyGraphGetSuggestedFollowsByActorOutput = {
    suggestions: Array<AppBskyActorDefsProfileView>;
    recIdStr?: string;
    isFallback?: boolean;
    recId?: number;
};
/** Record representing a list of accounts (actors). Scope includes both moderation-oriented lists and curration-oriented lists. */
export declare class AppBskyGraphList {
    static readonly nsid = "app.bsky.graph.list";
    static readonly def = "main";
    static readonly kind: "record";
    static readonly recordKey = "tid";
    $type: string;
    purpose: "app.bsky.graph.defs#modlist" | "app.bsky.graph.defs#curatelist" | "app.bsky.graph.defs#referencelist" | (string & {});
    name: string;
    description?: string;
    descriptionFacets?: Array<AppBskyRichtextFacet>;
    avatar?: RepoBlobJson;
    labels?: ComAtprotoLabelDefsSelfLabels | {
        $type?: string;
    };
    createdAt: string;
    constructor(input?: Partial<AppBskyGraphList>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyGraphList;
}
/** Record representing a block relationship against an entire an entire list of accounts (actors). */
export declare class AppBskyGraphListblock {
    static readonly nsid = "app.bsky.graph.listblock";
    static readonly def = "main";
    static readonly kind: "record";
    static readonly recordKey = "tid";
    $type: string;
    subject: string;
    createdAt: string;
    constructor(input?: Partial<AppBskyGraphListblock>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyGraphListblock;
}
/** Record representing an account's inclusion on a specific list. The AppView will ignore duplicate listitem records. */
export declare class AppBskyGraphListitem {
    static readonly nsid = "app.bsky.graph.listitem";
    static readonly def = "main";
    static readonly kind: "record";
    static readonly recordKey = "tid";
    $type: string;
    subject: string;
    list: string;
    createdAt: string;
    constructor(input?: Partial<AppBskyGraphListitem>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyGraphListitem;
}
/** Creates a mute relationship for the specified account. If a mute already exists for the account, it is updated in place: the stored scope is replaced with the scope in this request. Mutes are private in Bluesky. Requires auth. */
export declare class AppBskyGraphMuteActor {
    static readonly nsid = "app.bsky.graph.muteActor";
    static readonly def = "main";
    static readonly kind: "procedure";
    static readonly http: "POST";
    static readonly errorNames: readonly [];
    actor: string;
    onlyReposts?: boolean;
    onlyQuoteposts?: boolean;
    constructor(input?: Partial<AppBskyGraphMuteActor>);
    toParams(): Record<string, unknown>;
    toBody(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): AppBskyGraphMuteActor;
}
export type AppBskyGraphMuteActorOutput = Record<string, unknown>;
/** Creates a mute relationship for the specified list of accounts. Mutes are private in Bluesky. Requires auth. */
export declare class AppBskyGraphMuteActorList {
    static readonly nsid = "app.bsky.graph.muteActorList";
    static readonly def = "main";
    static readonly kind: "procedure";
    static readonly http: "POST";
    static readonly errorNames: readonly [];
    list: string;
    constructor(input?: Partial<AppBskyGraphMuteActorList>);
    toParams(): Record<string, unknown>;
    toBody(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): AppBskyGraphMuteActorList;
}
export type AppBskyGraphMuteActorListOutput = Record<string, unknown>;
/** Mutes a thread preventing notifications from the thread and any of its children. Mutes are private in Bluesky. Requires auth. */
export declare class AppBskyGraphMuteThread {
    static readonly nsid = "app.bsky.graph.muteThread";
    static readonly def = "main";
    static readonly kind: "procedure";
    static readonly http: "POST";
    static readonly errorNames: readonly [];
    root: string;
    constructor(input?: Partial<AppBskyGraphMuteThread>);
    toParams(): Record<string, unknown>;
    toBody(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): AppBskyGraphMuteThread;
}
export type AppBskyGraphMuteThreadOutput = Record<string, unknown>;
/** Record requesting that its author be omitted from the public presentation of a reference list. This record is only enforced when the subject list's current purpose is app.bsky.graph.defs#referencelist. AppView indexes at most one record per */
export declare class AppBskyGraphReferencelistoptout {
    static readonly nsid = "app.bsky.graph.referencelistoptout";
    static readonly def = "main";
    static readonly kind: "record";
    static readonly recordKey = "tid";
    $type: string;
    subject: string;
    createdAt: string;
    constructor(input?: Partial<AppBskyGraphReferencelistoptout>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyGraphReferencelistoptout;
}
/** Find starter packs matching search criteria. Does not require auth. */
export declare class AppBskyGraphSearchStarterPacks {
    static readonly nsid = "app.bsky.graph.searchStarterPacks";
    static readonly def = "main";
    static readonly kind: "query";
    static readonly http: "GET";
    static readonly errorNames: readonly [];
    q: string;
    limit?: number;
    cursor?: string;
    constructor(input?: Partial<AppBskyGraphSearchStarterPacks>);
    toParams(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): AppBskyGraphSearchStarterPacks;
}
export type AppBskyGraphSearchStarterPacksOutput = {
    cursor?: string;
    starterPacks: Array<AppBskyGraphDefsStarterPackViewBasic>;
};
/** Find starter packs matching search criteria. Does not require auth. */
export declare class AppBskyGraphSearchStarterPacksV2 {
    static readonly nsid = "app.bsky.graph.searchStarterPacksV2";
    static readonly def = "main";
    static readonly kind: "query";
    static readonly http: "GET";
    static readonly errorNames: readonly [];
    q: string;
    limit?: number;
    cursor?: string;
    constructor(input?: Partial<AppBskyGraphSearchStarterPacksV2>);
    toParams(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): AppBskyGraphSearchStarterPacksV2;
}
export type AppBskyGraphSearchStarterPacksV2Output = {
    cursor?: string;
    hitsTotal?: number;
    starterPacks: Array<AppBskyGraphDefsStarterPackView>;
};
/** Record defining a starter pack of actors and feeds for new users. */
export declare class AppBskyGraphStarterpack {
    static readonly nsid = "app.bsky.graph.starterpack";
    static readonly def = "main";
    static readonly kind: "record";
    static readonly recordKey = "tid";
    $type: string;
    name: string;
    description?: string;
    descriptionFacets?: Array<AppBskyRichtextFacet>;
    list: string;
    feeds?: Array<AppBskyGraphStarterpackFeedItem>;
    createdAt: string;
    constructor(input?: Partial<AppBskyGraphStarterpack>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyGraphStarterpack;
}
export declare class AppBskyGraphStarterpackFeedItem {
    static readonly nsid = "app.bsky.graph.starterpack";
    static readonly def = "feedItem";
    static readonly kind: "object";
    $type: string;
    uri: string;
    constructor(input?: Partial<AppBskyGraphStarterpackFeedItem>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyGraphStarterpackFeedItem;
}
/** Unmutes the specified account. Requires auth. */
export declare class AppBskyGraphUnmuteActor {
    static readonly nsid = "app.bsky.graph.unmuteActor";
    static readonly def = "main";
    static readonly kind: "procedure";
    static readonly http: "POST";
    static readonly errorNames: readonly [];
    actor: string;
    constructor(input?: Partial<AppBskyGraphUnmuteActor>);
    toParams(): Record<string, unknown>;
    toBody(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): AppBskyGraphUnmuteActor;
}
export type AppBskyGraphUnmuteActorOutput = Record<string, unknown>;
/** Unmutes the specified list of accounts. Requires auth. */
export declare class AppBskyGraphUnmuteActorList {
    static readonly nsid = "app.bsky.graph.unmuteActorList";
    static readonly def = "main";
    static readonly kind: "procedure";
    static readonly http: "POST";
    static readonly errorNames: readonly [];
    list: string;
    constructor(input?: Partial<AppBskyGraphUnmuteActorList>);
    toParams(): Record<string, unknown>;
    toBody(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): AppBskyGraphUnmuteActorList;
}
export type AppBskyGraphUnmuteActorListOutput = Record<string, unknown>;
/** Unmutes the specified thread. Requires auth. */
export declare class AppBskyGraphUnmuteThread {
    static readonly nsid = "app.bsky.graph.unmuteThread";
    static readonly def = "main";
    static readonly kind: "procedure";
    static readonly http: "POST";
    static readonly errorNames: readonly [];
    root: string;
    constructor(input?: Partial<AppBskyGraphUnmuteThread>);
    toParams(): Record<string, unknown>;
    toBody(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): AppBskyGraphUnmuteThread;
}
export type AppBskyGraphUnmuteThreadOutput = Record<string, unknown>;
/** Record declaring a verification relationship between two accounts. Verifications are only considered valid by an app if issued by an account the app considers trusted. */
export declare class AppBskyGraphVerification {
    static readonly nsid = "app.bsky.graph.verification";
    static readonly def = "main";
    static readonly kind: "record";
    static readonly recordKey = "tid";
    $type: string;
    subject: string;
    handle: string;
    displayName: string;
    createdAt: string;
    constructor(input?: Partial<AppBskyGraphVerification>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyGraphVerification;
}
export declare class AppBskyLabelerDefsLabelerPolicies {
    static readonly nsid = "app.bsky.labeler.defs";
    static readonly def = "labelerPolicies";
    static readonly kind: "object";
    $type: string;
    labelValues: Array<("!hide" | "!warn" | "!no-unauthenticated" | "porn" | "sexual" | "nudity" | "graphic-media" | "bot" | (string & {}))>;
    labelValueDefinitions?: Array<ComAtprotoLabelDefsLabelValueDefinition>;
    constructor(input?: Partial<AppBskyLabelerDefsLabelerPolicies>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyLabelerDefsLabelerPolicies;
}
export declare class AppBskyLabelerDefsLabelerView {
    static readonly nsid = "app.bsky.labeler.defs";
    static readonly def = "labelerView";
    static readonly kind: "object";
    $type: string;
    uri: string;
    cid: string;
    creator: AppBskyActorDefsProfileView;
    likeCount?: number;
    viewer?: AppBskyLabelerDefsLabelerViewerState;
    indexedAt: string;
    labels?: Array<ComAtprotoLabelDefsLabel>;
    constructor(input?: Partial<AppBskyLabelerDefsLabelerView>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyLabelerDefsLabelerView;
}
export declare class AppBskyLabelerDefsLabelerViewDetailed {
    static readonly nsid = "app.bsky.labeler.defs";
    static readonly def = "labelerViewDetailed";
    static readonly kind: "object";
    $type: string;
    uri: string;
    cid: string;
    creator: AppBskyActorDefsProfileView;
    policies: AppBskyLabelerDefsLabelerPolicies;
    likeCount?: number;
    viewer?: AppBskyLabelerDefsLabelerViewerState;
    indexedAt: string;
    labels?: Array<ComAtprotoLabelDefsLabel>;
    reasonTypes?: Array<("com.atproto.moderation.defs#reasonSpam" | "com.atproto.moderation.defs#reasonViolation" | "com.atproto.moderation.defs#reasonMisleading" | "com.atproto.moderation.defs#reasonSexual" | "com.atproto.moderation.defs#reasonRude" | "com.atproto.moderation.defs#reasonOther" | "com.atproto.moderation.defs#reasonAppeal" | "tools.ozone.report.defs#reasonAppeal" | "tools.ozone.report.defs#reasonOther" | "tools.ozone.report.defs#reasonViolenceAnimal" | "tools.ozone.report.defs#reasonViolenceThreats" | "tools.ozone.report.defs#reasonViolenceGraphicContent" | "tools.ozone.report.defs#reasonViolenceGlorification" | "tools.ozone.report.defs#reasonViolenceExtremistContent" | "tools.ozone.report.defs#reasonViolenceTrafficking" | "tools.ozone.report.defs#reasonViolenceOther" | "tools.ozone.report.defs#reasonSexualAbuseContent" | "tools.ozone.report.defs#reasonSexualNCII" | "tools.ozone.report.defs#reasonSexualDeepfake" | "tools.ozone.report.defs#reasonSexualAnimal" | "tools.ozone.report.defs#reasonSexualUnlabeled" | "tools.ozone.report.defs#reasonSexualOther" | "tools.ozone.report.defs#reasonChildSafetyCSAM" | "tools.ozone.report.defs#reasonChildSafetyGroom" | "tools.ozone.report.defs#reasonChildSafetyPrivacy" | "tools.ozone.report.defs#reasonChildSafetyHarassment" | "tools.ozone.report.defs#reasonChildSafetyOther" | "tools.ozone.report.defs#reasonHarassmentTroll" | "tools.ozone.report.defs#reasonHarassmentTargeted" | "tools.ozone.report.defs#reasonHarassmentHateSpeech" | "tools.ozone.report.defs#reasonHarassmentDoxxing" | "tools.ozone.report.defs#reasonHarassmentOther" | "tools.ozone.report.defs#reasonMisleadingBot" | "tools.ozone.report.defs#reasonMisleadingImpersonation" | "tools.ozone.report.defs#reasonMisleadingSpam" | "tools.ozone.report.defs#reasonMisleadingScam" | "tools.ozone.report.defs#reasonMisleadingElections" | "tools.ozone.report.defs#reasonMisleadingOther" | "tools.ozone.report.defs#reasonRuleSiteSecurity" | "tools.ozone.report.defs#reasonRuleProhibitedSales" | "tools.ozone.report.defs#reasonRuleBanEvasion" | "tools.ozone.report.defs#reasonRuleOther" | "tools.ozone.report.defs#reasonSelfHarmContent" | "tools.ozone.report.defs#reasonSelfHarmED" | "tools.ozone.report.defs#reasonSelfHarmStunts" | "tools.ozone.report.defs#reasonSelfHarmSubstances" | "tools.ozone.report.defs#reasonSelfHarmOther" | (string & {}))>;
    subjectTypes?: Array<("account" | "record" | "chat" | (string & {}))>;
    subjectCollections?: Array<string>;
    constructor(input?: Partial<AppBskyLabelerDefsLabelerViewDetailed>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyLabelerDefsLabelerViewDetailed;
}
export declare class AppBskyLabelerDefsLabelerViewerState {
    static readonly nsid = "app.bsky.labeler.defs";
    static readonly def = "labelerViewerState";
    static readonly kind: "object";
    $type: string;
    like?: string;
    constructor(input?: Partial<AppBskyLabelerDefsLabelerViewerState>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyLabelerDefsLabelerViewerState;
}
/** Get information about a list of labeler services. */
export declare class AppBskyLabelerGetServices {
    static readonly nsid = "app.bsky.labeler.getServices";
    static readonly def = "main";
    static readonly kind: "query";
    static readonly http: "GET";
    static readonly errorNames: readonly [];
    dids: Array<string>;
    detailed?: boolean;
    constructor(input?: Partial<AppBskyLabelerGetServices>);
    toParams(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): AppBskyLabelerGetServices;
}
export type AppBskyLabelerGetServicesOutput = {
    views: Array<(AppBskyLabelerDefsLabelerView | AppBskyLabelerDefsLabelerViewDetailed | {
        $type?: string;
    })>;
};
/** A declaration of the existence of labeler service. */
export declare class AppBskyLabelerService {
    static readonly nsid = "app.bsky.labeler.service";
    static readonly def = "main";
    static readonly kind: "record";
    static readonly recordKey = "literal:self";
    $type: string;
    policies: AppBskyLabelerDefsLabelerPolicies;
    labels?: ComAtprotoLabelDefsSelfLabels | {
        $type?: string;
    };
    createdAt: string;
    reasonTypes?: Array<("com.atproto.moderation.defs#reasonSpam" | "com.atproto.moderation.defs#reasonViolation" | "com.atproto.moderation.defs#reasonMisleading" | "com.atproto.moderation.defs#reasonSexual" | "com.atproto.moderation.defs#reasonRude" | "com.atproto.moderation.defs#reasonOther" | "com.atproto.moderation.defs#reasonAppeal" | "tools.ozone.report.defs#reasonAppeal" | "tools.ozone.report.defs#reasonOther" | "tools.ozone.report.defs#reasonViolenceAnimal" | "tools.ozone.report.defs#reasonViolenceThreats" | "tools.ozone.report.defs#reasonViolenceGraphicContent" | "tools.ozone.report.defs#reasonViolenceGlorification" | "tools.ozone.report.defs#reasonViolenceExtremistContent" | "tools.ozone.report.defs#reasonViolenceTrafficking" | "tools.ozone.report.defs#reasonViolenceOther" | "tools.ozone.report.defs#reasonSexualAbuseContent" | "tools.ozone.report.defs#reasonSexualNCII" | "tools.ozone.report.defs#reasonSexualDeepfake" | "tools.ozone.report.defs#reasonSexualAnimal" | "tools.ozone.report.defs#reasonSexualUnlabeled" | "tools.ozone.report.defs#reasonSexualOther" | "tools.ozone.report.defs#reasonChildSafetyCSAM" | "tools.ozone.report.defs#reasonChildSafetyGroom" | "tools.ozone.report.defs#reasonChildSafetyPrivacy" | "tools.ozone.report.defs#reasonChildSafetyHarassment" | "tools.ozone.report.defs#reasonChildSafetyOther" | "tools.ozone.report.defs#reasonHarassmentTroll" | "tools.ozone.report.defs#reasonHarassmentTargeted" | "tools.ozone.report.defs#reasonHarassmentHateSpeech" | "tools.ozone.report.defs#reasonHarassmentDoxxing" | "tools.ozone.report.defs#reasonHarassmentOther" | "tools.ozone.report.defs#reasonMisleadingBot" | "tools.ozone.report.defs#reasonMisleadingImpersonation" | "tools.ozone.report.defs#reasonMisleadingSpam" | "tools.ozone.report.defs#reasonMisleadingScam" | "tools.ozone.report.defs#reasonMisleadingElections" | "tools.ozone.report.defs#reasonMisleadingOther" | "tools.ozone.report.defs#reasonRuleSiteSecurity" | "tools.ozone.report.defs#reasonRuleProhibitedSales" | "tools.ozone.report.defs#reasonRuleBanEvasion" | "tools.ozone.report.defs#reasonRuleOther" | "tools.ozone.report.defs#reasonSelfHarmContent" | "tools.ozone.report.defs#reasonSelfHarmED" | "tools.ozone.report.defs#reasonSelfHarmStunts" | "tools.ozone.report.defs#reasonSelfHarmSubstances" | "tools.ozone.report.defs#reasonSelfHarmOther" | (string & {}))>;
    subjectTypes?: Array<("account" | "record" | "chat" | (string & {}))>;
    subjectCollections?: Array<string>;
    constructor(input?: Partial<AppBskyLabelerService>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyLabelerService;
}
/** A declaration of the user's choices related to notifications that can be produced by them. */
export declare class AppBskyNotificationDeclaration {
    static readonly nsid = "app.bsky.notification.declaration";
    static readonly def = "main";
    static readonly kind: "record";
    static readonly recordKey = "literal:self";
    $type: string;
    allowSubscriptions: "followers" | "mutuals" | "none" | (string & {});
    constructor(input?: Partial<AppBskyNotificationDeclaration>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyNotificationDeclaration;
}
export declare class AppBskyNotificationDefsActivitySubscription {
    static readonly nsid = "app.bsky.notification.defs";
    static readonly def = "activitySubscription";
    static readonly kind: "object";
    $type: string;
    post: boolean;
    reply: boolean;
    constructor(input?: Partial<AppBskyNotificationDefsActivitySubscription>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyNotificationDefsActivitySubscription;
}
/** Deprecated: use chat.bsky.notification preferences instead. This will only return a default value. */
export declare class AppBskyNotificationDefsChatPreference {
    static readonly nsid = "app.bsky.notification.defs";
    static readonly def = "chatPreference";
    static readonly kind: "object";
    $type: string;
    include: "all" | "accepted" | (string & {});
    push: boolean;
    constructor(input?: Partial<AppBskyNotificationDefsChatPreference>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyNotificationDefsChatPreference;
}
export declare class AppBskyNotificationDefsFilterablePreference {
    static readonly nsid = "app.bsky.notification.defs";
    static readonly def = "filterablePreference";
    static readonly kind: "object";
    $type: string;
    include: "all" | "follows" | (string & {});
    list: boolean;
    push: boolean;
    constructor(input?: Partial<AppBskyNotificationDefsFilterablePreference>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyNotificationDefsFilterablePreference;
}
export declare class AppBskyNotificationDefsPreference {
    static readonly nsid = "app.bsky.notification.defs";
    static readonly def = "preference";
    static readonly kind: "object";
    $type: string;
    list: boolean;
    push: boolean;
    constructor(input?: Partial<AppBskyNotificationDefsPreference>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyNotificationDefsPreference;
}
export declare class AppBskyNotificationDefsPreferences {
    static readonly nsid = "app.bsky.notification.defs";
    static readonly def = "preferences";
    static readonly kind: "object";
    $type: string;
    chat: AppBskyNotificationDefsChatPreference;
    follow: AppBskyNotificationDefsFilterablePreference;
    like: AppBskyNotificationDefsFilterablePreference;
    likeViaRepost: AppBskyNotificationDefsFilterablePreference;
    mention: AppBskyNotificationDefsFilterablePreference;
    quote: AppBskyNotificationDefsFilterablePreference;
    reply: AppBskyNotificationDefsFilterablePreference;
    repost: AppBskyNotificationDefsFilterablePreference;
    repostViaRepost: AppBskyNotificationDefsFilterablePreference;
    starterpackJoined: AppBskyNotificationDefsPreference;
    subscribedPost: AppBskyNotificationDefsPreference;
    unverified: AppBskyNotificationDefsPreference;
    verified: AppBskyNotificationDefsPreference;
    constructor(input?: Partial<AppBskyNotificationDefsPreferences>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyNotificationDefsPreferences;
}
export declare class AppBskyNotificationDefsRecordDeleted {
    static readonly nsid = "app.bsky.notification.defs";
    static readonly def = "recordDeleted";
    static readonly kind: "object";
    $type: string;
    constructor(input?: Partial<AppBskyNotificationDefsRecordDeleted>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyNotificationDefsRecordDeleted;
}
/** Object used to store activity subscription data in stash. */
export declare class AppBskyNotificationDefsSubjectActivitySubscription {
    static readonly nsid = "app.bsky.notification.defs";
    static readonly def = "subjectActivitySubscription";
    static readonly kind: "object";
    $type: string;
    subject: string;
    activitySubscription: AppBskyNotificationDefsActivitySubscription;
    constructor(input?: Partial<AppBskyNotificationDefsSubjectActivitySubscription>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyNotificationDefsSubjectActivitySubscription;
}
/** [UNSTABLE - DO NOT USE THIS ENDPOINT WHILE THIS NOTE IS HERE] Enumerate notifications for the requesting account, pre-grouped for rendering. Supersedes listNotifications. Requires auth. */
export declare class AppBskyNotificationGetGroupedNotifications {
    static readonly nsid = "app.bsky.notification.getGroupedNotifications";
    static readonly def = "main";
    static readonly kind: "query";
    static readonly http: "GET";
    static readonly errorNames: readonly [];
    feed?: "all" | "people-i-follow" | "conversations" | "followers" | "activity" | (string & {});
    limit?: number;
    cursor?: string;
    constructor(input?: Partial<AppBskyNotificationGetGroupedNotifications>);
    toParams(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): AppBskyNotificationGetGroupedNotifications;
}
export type AppBskyNotificationGetGroupedNotificationsOutput = {
    cursor?: string;
    groups: Array<AppBskyNotificationGetGroupedNotificationsGroup>;
    seenAt?: string;
    relatedViews?: Array<(AppBskyActorDefsProfileViewBasic | AppBskyFeedDefsBlockedPost | AppBskyFeedDefsGeneratorView | AppBskyFeedDefsNotFoundPost | AppBskyFeedDefsPostView | AppBskyGraphDefsStarterPackViewBasic | {
        $type?: string;
    })>;
};
/** A contact of the requesting account joined Bluesky. */
export declare class AppBskyNotificationGetGroupedNotificationsContactMatchNotification {
    static readonly nsid = "app.bsky.notification.getGroupedNotifications";
    static readonly def = "contactMatchNotification";
    static readonly kind: "object";
    $type: string;
    actor: string;
    constructor(input?: Partial<AppBskyNotificationGetGroupedNotificationsContactMatchNotification>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyNotificationGetGroupedNotificationsContactMatchNotification;
}
/** An actor followed the requesting account back, possibly via a starter pack. */
export declare class AppBskyNotificationGetGroupedNotificationsFollowBackNotification {
    static readonly nsid = "app.bsky.notification.getGroupedNotifications";
    static readonly def = "followBackNotification";
    static readonly kind: "object";
    $type: string;
    actor: string;
    starterPack?: string;
    constructor(input?: Partial<AppBskyNotificationGetGroupedNotificationsFollowBackNotification>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyNotificationGetGroupedNotificationsFollowBackNotification;
}
/** Group of actors who followed the requesting account. */
export declare class AppBskyNotificationGetGroupedNotificationsFollowGroup {
    static readonly nsid = "app.bsky.notification.getGroupedNotifications";
    static readonly def = "followGroup";
    static readonly kind: "object";
    $type: string;
    items: Array<AppBskyNotificationGetGroupedNotificationsFollowItem>;
    constructor(input?: Partial<AppBskyNotificationGetGroupedNotificationsFollowGroup>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyNotificationGetGroupedNotificationsFollowGroup;
}
/** An actor who followed the requesting account, possibly via a starter pack. */
export declare class AppBskyNotificationGetGroupedNotificationsFollowItem {
    static readonly nsid = "app.bsky.notification.getGroupedNotifications";
    static readonly def = "followItem";
    static readonly kind: "object";
    $type: string;
    actor: string;
    starterPack?: string;
    constructor(input?: Partial<AppBskyNotificationGetGroupedNotificationsFollowItem>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyNotificationGetGroupedNotificationsFollowItem;
}
/** Group of likes by different actors on the same feed generator. */
export declare class AppBskyNotificationGetGroupedNotificationsGeneratorLikeGroup {
    static readonly nsid = "app.bsky.notification.getGroupedNotifications";
    static readonly def = "generatorLikeGroup";
    static readonly kind: "object";
    $type: string;
    generator: string;
    items: Array<AppBskyNotificationGetGroupedNotificationsGeneratorLikeItem>;
    constructor(input?: Partial<AppBskyNotificationGetGroupedNotificationsGeneratorLikeGroup>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyNotificationGetGroupedNotificationsGeneratorLikeGroup;
}
/** One actor who liked the feed generator in the group. */
export declare class AppBskyNotificationGetGroupedNotificationsGeneratorLikeItem {
    static readonly nsid = "app.bsky.notification.getGroupedNotifications";
    static readonly def = "generatorLikeItem";
    static readonly kind: "object";
    $type: string;
    actor: string;
    constructor(input?: Partial<AppBskyNotificationGetGroupedNotificationsGeneratorLikeItem>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyNotificationGetGroupedNotificationsGeneratorLikeItem;
}
/** Contains common metadata and kind-specific data for a notification group or individual notification. */
export declare class AppBskyNotificationGetGroupedNotificationsGroup {
    static readonly nsid = "app.bsky.notification.getGroupedNotifications";
    static readonly def = "group";
    static readonly kind: "object";
    $type: string;
    id: string;
    isRead: boolean;
    indexedAt: string;
    count: number;
    kind: AppBskyNotificationGetGroupedNotificationsLikeGroup | AppBskyNotificationGetGroupedNotificationsMultiPostLikeGroup | AppBskyNotificationGetGroupedNotificationsMultiPostRepostGroup | AppBskyNotificationGetGroupedNotificationsMultiPostLikeViaRepostGroup | AppBskyNotificationGetGroupedNotificationsMultiPostRepostViaRepostGroup | AppBskyNotificationGetGroupedNotificationsRepostGroup | AppBskyNotificationGetGroupedNotificationsLikeViaRepostGroup | AppBskyNotificationGetGroupedNotificationsRepostViaRepostGroup | AppBskyNotificationGetGroupedNotificationsFollowGroup | AppBskyNotificationGetGroupedNotificationsSubscribedPostGroup | AppBskyNotificationGetGroupedNotificationsGeneratorLikeGroup | AppBskyNotificationGetGroupedNotificationsReplyNotification | AppBskyNotificationGetGroupedNotificationsQuoteNotification | AppBskyNotificationGetGroupedNotificationsMentionNotification | AppBskyNotificationGetGroupedNotificationsFollowBackNotification | AppBskyNotificationGetGroupedNotificationsVerifiedNotification | AppBskyNotificationGetGroupedNotificationsUnverifiedNotification | AppBskyNotificationGetGroupedNotificationsStarterPackJoinedNotification | AppBskyNotificationGetGroupedNotificationsContactMatchNotification | {
        $type?: string;
    };
    constructor(input?: Partial<AppBskyNotificationGetGroupedNotificationsGroup>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyNotificationGetGroupedNotificationsGroup;
}
/** Group of likes by different actors on the same post. */
export declare class AppBskyNotificationGetGroupedNotificationsLikeGroup {
    static readonly nsid = "app.bsky.notification.getGroupedNotifications";
    static readonly def = "likeGroup";
    static readonly kind: "object";
    $type: string;
    post: string;
    items: Array<AppBskyNotificationGetGroupedNotificationsLikeItem>;
    constructor(input?: Partial<AppBskyNotificationGetGroupedNotificationsLikeGroup>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyNotificationGetGroupedNotificationsLikeGroup;
}
/** One actor who liked the group's post. */
export declare class AppBskyNotificationGetGroupedNotificationsLikeItem {
    static readonly nsid = "app.bsky.notification.getGroupedNotifications";
    static readonly def = "likeItem";
    static readonly kind: "object";
    $type: string;
    actor: string;
    constructor(input?: Partial<AppBskyNotificationGetGroupedNotificationsLikeItem>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyNotificationGetGroupedNotificationsLikeItem;
}
/** Group of likes by different actors on the same post via the requesting account's repost. */
export declare class AppBskyNotificationGetGroupedNotificationsLikeViaRepostGroup {
    static readonly nsid = "app.bsky.notification.getGroupedNotifications";
    static readonly def = "likeViaRepostGroup";
    static readonly kind: "object";
    $type: string;
    post: string;
    viaRepost: string;
    items: Array<AppBskyNotificationGetGroupedNotificationsLikeViaRepostItem>;
    constructor(input?: Partial<AppBskyNotificationGetGroupedNotificationsLikeViaRepostGroup>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyNotificationGetGroupedNotificationsLikeViaRepostGroup;
}
/** One actor who liked the group's post via the requesting account's repost. */
export declare class AppBskyNotificationGetGroupedNotificationsLikeViaRepostItem {
    static readonly nsid = "app.bsky.notification.getGroupedNotifications";
    static readonly def = "likeViaRepostItem";
    static readonly kind: "object";
    $type: string;
    actor: string;
    constructor(input?: Partial<AppBskyNotificationGetGroupedNotificationsLikeViaRepostItem>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyNotificationGetGroupedNotificationsLikeViaRepostItem;
}
/** A post mentioning the requesting account. */
export declare class AppBskyNotificationGetGroupedNotificationsMentionNotification {
    static readonly nsid = "app.bsky.notification.getGroupedNotifications";
    static readonly def = "mentionNotification";
    static readonly kind: "object";
    $type: string;
    post: string;
    parent?: string;
    constructor(input?: Partial<AppBskyNotificationGetGroupedNotificationsMentionNotification>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyNotificationGetGroupedNotificationsMentionNotification;
}
/** Group of likes by the same actor on different posts. */
export declare class AppBskyNotificationGetGroupedNotificationsMultiPostLikeGroup {
    static readonly nsid = "app.bsky.notification.getGroupedNotifications";
    static readonly def = "multiPostLikeGroup";
    static readonly kind: "object";
    $type: string;
    actor: string;
    items: Array<AppBskyNotificationGetGroupedNotificationsMultiPostLikeItem>;
    constructor(input?: Partial<AppBskyNotificationGetGroupedNotificationsMultiPostLikeGroup>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyNotificationGetGroupedNotificationsMultiPostLikeGroup;
}
/** One post which was liked by the group's actor. */
export declare class AppBskyNotificationGetGroupedNotificationsMultiPostLikeItem {
    static readonly nsid = "app.bsky.notification.getGroupedNotifications";
    static readonly def = "multiPostLikeItem";
    static readonly kind: "object";
    $type: string;
    post: string;
    constructor(input?: Partial<AppBskyNotificationGetGroupedNotificationsMultiPostLikeItem>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyNotificationGetGroupedNotificationsMultiPostLikeItem;
}
/** Group of likes by the same actor on different posts via the requesting account's reposts. */
export declare class AppBskyNotificationGetGroupedNotificationsMultiPostLikeViaRepostGroup {
    static readonly nsid = "app.bsky.notification.getGroupedNotifications";
    static readonly def = "multiPostLikeViaRepostGroup";
    static readonly kind: "object";
    $type: string;
    actor: string;
    items: Array<AppBskyNotificationGetGroupedNotificationsMultiPostLikeViaRepostItem>;
    constructor(input?: Partial<AppBskyNotificationGetGroupedNotificationsMultiPostLikeViaRepostGroup>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyNotificationGetGroupedNotificationsMultiPostLikeViaRepostGroup;
}
/** One post which was liked by the group's actor via the requesting account's repost. */
export declare class AppBskyNotificationGetGroupedNotificationsMultiPostLikeViaRepostItem {
    static readonly nsid = "app.bsky.notification.getGroupedNotifications";
    static readonly def = "multiPostLikeViaRepostItem";
    static readonly kind: "object";
    $type: string;
    post: string;
    viaRepost: string;
    constructor(input?: Partial<AppBskyNotificationGetGroupedNotificationsMultiPostLikeViaRepostItem>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyNotificationGetGroupedNotificationsMultiPostLikeViaRepostItem;
}
/** Group of reposts by the same actor of different posts. */
export declare class AppBskyNotificationGetGroupedNotificationsMultiPostRepostGroup {
    static readonly nsid = "app.bsky.notification.getGroupedNotifications";
    static readonly def = "multiPostRepostGroup";
    static readonly kind: "object";
    $type: string;
    actor: string;
    items: Array<AppBskyNotificationGetGroupedNotificationsMultiPostRepostItem>;
    constructor(input?: Partial<AppBskyNotificationGetGroupedNotificationsMultiPostRepostGroup>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyNotificationGetGroupedNotificationsMultiPostRepostGroup;
}
/** One post which was reposted by the group's actor. */
export declare class AppBskyNotificationGetGroupedNotificationsMultiPostRepostItem {
    static readonly nsid = "app.bsky.notification.getGroupedNotifications";
    static readonly def = "multiPostRepostItem";
    static readonly kind: "object";
    $type: string;
    post: string;
    constructor(input?: Partial<AppBskyNotificationGetGroupedNotificationsMultiPostRepostItem>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyNotificationGetGroupedNotificationsMultiPostRepostItem;
}
/** Group of reposts by the same actor of different posts via the requesting account's reposts. */
export declare class AppBskyNotificationGetGroupedNotificationsMultiPostRepostViaRepostGroup {
    static readonly nsid = "app.bsky.notification.getGroupedNotifications";
    static readonly def = "multiPostRepostViaRepostGroup";
    static readonly kind: "object";
    $type: string;
    actor: string;
    items: Array<AppBskyNotificationGetGroupedNotificationsMultiPostRepostViaRepostItem>;
    constructor(input?: Partial<AppBskyNotificationGetGroupedNotificationsMultiPostRepostViaRepostGroup>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyNotificationGetGroupedNotificationsMultiPostRepostViaRepostGroup;
}
/** One post which was reposted by the group's actor via the requesting account's repost. */
export declare class AppBskyNotificationGetGroupedNotificationsMultiPostRepostViaRepostItem {
    static readonly nsid = "app.bsky.notification.getGroupedNotifications";
    static readonly def = "multiPostRepostViaRepostItem";
    static readonly kind: "object";
    $type: string;
    post: string;
    viaRepost: string;
    constructor(input?: Partial<AppBskyNotificationGetGroupedNotificationsMultiPostRepostViaRepostItem>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyNotificationGetGroupedNotificationsMultiPostRepostViaRepostItem;
}
/** A post quoting a post by the requesting account. */
export declare class AppBskyNotificationGetGroupedNotificationsQuoteNotification {
    static readonly nsid = "app.bsky.notification.getGroupedNotifications";
    static readonly def = "quoteNotification";
    static readonly kind: "object";
    $type: string;
    post: string;
    parent?: string;
    constructor(input?: Partial<AppBskyNotificationGetGroupedNotificationsQuoteNotification>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyNotificationGetGroupedNotificationsQuoteNotification;
}
/** A reply to a post by the requesting account or to a thread they are participating in. */
export declare class AppBskyNotificationGetGroupedNotificationsReplyNotification {
    static readonly nsid = "app.bsky.notification.getGroupedNotifications";
    static readonly def = "replyNotification";
    static readonly kind: "object";
    $type: string;
    post: string;
    parent: string;
    constructor(input?: Partial<AppBskyNotificationGetGroupedNotificationsReplyNotification>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyNotificationGetGroupedNotificationsReplyNotification;
}
/** Group of reposts by different actors of the same post. */
export declare class AppBskyNotificationGetGroupedNotificationsRepostGroup {
    static readonly nsid = "app.bsky.notification.getGroupedNotifications";
    static readonly def = "repostGroup";
    static readonly kind: "object";
    $type: string;
    post: string;
    items: Array<AppBskyNotificationGetGroupedNotificationsRepostItem>;
    constructor(input?: Partial<AppBskyNotificationGetGroupedNotificationsRepostGroup>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyNotificationGetGroupedNotificationsRepostGroup;
}
/** One actor who reposted the group's post. */
export declare class AppBskyNotificationGetGroupedNotificationsRepostItem {
    static readonly nsid = "app.bsky.notification.getGroupedNotifications";
    static readonly def = "repostItem";
    static readonly kind: "object";
    $type: string;
    actor: string;
    constructor(input?: Partial<AppBskyNotificationGetGroupedNotificationsRepostItem>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyNotificationGetGroupedNotificationsRepostItem;
}
/** Group of reposts by different actors of the same post via the requesting account's repost. */
export declare class AppBskyNotificationGetGroupedNotificationsRepostViaRepostGroup {
    static readonly nsid = "app.bsky.notification.getGroupedNotifications";
    static readonly def = "repostViaRepostGroup";
    static readonly kind: "object";
    $type: string;
    post: string;
    viaRepost: string;
    items: Array<AppBskyNotificationGetGroupedNotificationsRepostViaRepostItem>;
    constructor(input?: Partial<AppBskyNotificationGetGroupedNotificationsRepostViaRepostGroup>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyNotificationGetGroupedNotificationsRepostViaRepostGroup;
}
/** One actor who reposted the group's post via the requesting account's repost. */
export declare class AppBskyNotificationGetGroupedNotificationsRepostViaRepostItem {
    static readonly nsid = "app.bsky.notification.getGroupedNotifications";
    static readonly def = "repostViaRepostItem";
    static readonly kind: "object";
    $type: string;
    actor: string;
    constructor(input?: Partial<AppBskyNotificationGetGroupedNotificationsRepostViaRepostItem>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyNotificationGetGroupedNotificationsRepostViaRepostItem;
}
/** An actor joined Bluesky via a starter pack created by the requesting account. */
export declare class AppBskyNotificationGetGroupedNotificationsStarterPackJoinedNotification {
    static readonly nsid = "app.bsky.notification.getGroupedNotifications";
    static readonly def = "starterPackJoinedNotification";
    static readonly kind: "object";
    $type: string;
    actor: string;
    starterPack: string;
    constructor(input?: Partial<AppBskyNotificationGetGroupedNotificationsStarterPackJoinedNotification>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyNotificationGetGroupedNotificationsStarterPackJoinedNotification;
}
/** Group of new posts by actors the requesting account subscribes to. */
export declare class AppBskyNotificationGetGroupedNotificationsSubscribedPostGroup {
    static readonly nsid = "app.bsky.notification.getGroupedNotifications";
    static readonly def = "subscribedPostGroup";
    static readonly kind: "object";
    $type: string;
    items: Array<AppBskyNotificationGetGroupedNotificationsSubscribedPostItem>;
    constructor(input?: Partial<AppBskyNotificationGetGroupedNotificationsSubscribedPostGroup>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyNotificationGetGroupedNotificationsSubscribedPostGroup;
}
/** One new post by an actor the requesting account subscribes to. */
export declare class AppBskyNotificationGetGroupedNotificationsSubscribedPostItem {
    static readonly nsid = "app.bsky.notification.getGroupedNotifications";
    static readonly def = "subscribedPostItem";
    static readonly kind: "object";
    $type: string;
    actor: string;
    post: string;
    parent?: string;
    constructor(input?: Partial<AppBskyNotificationGetGroupedNotificationsSubscribedPostItem>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyNotificationGetGroupedNotificationsSubscribedPostItem;
}
/** A verification of the requesting account was removed. */
export declare class AppBskyNotificationGetGroupedNotificationsUnverifiedNotification {
    static readonly nsid = "app.bsky.notification.getGroupedNotifications";
    static readonly def = "unverifiedNotification";
    static readonly kind: "object";
    $type: string;
    actor: string;
    constructor(input?: Partial<AppBskyNotificationGetGroupedNotificationsUnverifiedNotification>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyNotificationGetGroupedNotificationsUnverifiedNotification;
}
/** An actor verified the requesting account. */
export declare class AppBskyNotificationGetGroupedNotificationsVerifiedNotification {
    static readonly nsid = "app.bsky.notification.getGroupedNotifications";
    static readonly def = "verifiedNotification";
    static readonly kind: "object";
    $type: string;
    actor: string;
    constructor(input?: Partial<AppBskyNotificationGetGroupedNotificationsVerifiedNotification>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyNotificationGetGroupedNotificationsVerifiedNotification;
}
/** Get notification-related preferences for an account. Requires auth. */
export declare class AppBskyNotificationGetPreferences {
    static readonly nsid = "app.bsky.notification.getPreferences";
    static readonly def = "main";
    static readonly kind: "query";
    static readonly http: "GET";
    static readonly errorNames: readonly [];
    constructor(input?: Partial<AppBskyNotificationGetPreferences>);
    toParams(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): AppBskyNotificationGetPreferences;
}
export type AppBskyNotificationGetPreferencesOutput = {
    preferences: AppBskyNotificationDefsPreferences;
};
/** Count the number of unread notifications for the requesting account. Requires auth. */
export declare class AppBskyNotificationGetUnreadCount {
    static readonly nsid = "app.bsky.notification.getUnreadCount";
    static readonly def = "main";
    static readonly kind: "query";
    static readonly http: "GET";
    static readonly errorNames: readonly [];
    priority?: boolean;
    seenAt?: string;
    constructor(input?: Partial<AppBskyNotificationGetUnreadCount>);
    toParams(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): AppBskyNotificationGetUnreadCount;
}
export type AppBskyNotificationGetUnreadCountOutput = {
    count: number;
};
/** Enumerate all accounts to which the requesting account is subscribed to receive notifications for. Requires auth. */
export declare class AppBskyNotificationListActivitySubscriptions {
    static readonly nsid = "app.bsky.notification.listActivitySubscriptions";
    static readonly def = "main";
    static readonly kind: "query";
    static readonly http: "GET";
    static readonly errorNames: readonly [];
    limit?: number;
    cursor?: string;
    constructor(input?: Partial<AppBskyNotificationListActivitySubscriptions>);
    toParams(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): AppBskyNotificationListActivitySubscriptions;
}
export type AppBskyNotificationListActivitySubscriptionsOutput = {
    cursor?: string;
    subscriptions: Array<AppBskyActorDefsProfileView>;
};
/** Enumerate notifications for the requesting account. Requires auth. */
export declare class AppBskyNotificationListNotifications {
    static readonly nsid = "app.bsky.notification.listNotifications";
    static readonly def = "main";
    static readonly kind: "query";
    static readonly http: "GET";
    static readonly errorNames: readonly [];
    reasons?: Array<string>;
    limit?: number;
    priority?: boolean;
    cursor?: string;
    seenAt?: string;
    constructor(input?: Partial<AppBskyNotificationListNotifications>);
    toParams(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): AppBskyNotificationListNotifications;
}
export type AppBskyNotificationListNotificationsOutput = {
    cursor?: string;
    notifications: Array<AppBskyNotificationListNotificationsNotification>;
    priority?: boolean;
    seenAt?: string;
};
export declare class AppBskyNotificationListNotificationsNotification {
    static readonly nsid = "app.bsky.notification.listNotifications";
    static readonly def = "notification";
    static readonly kind: "object";
    $type: string;
    uri: string;
    cid: string;
    author: AppBskyActorDefsProfileView;
    reason: "like" | "repost" | "follow" | "mention" | "reply" | "quote" | "starterpack-joined" | "verified" | "unverified" | "like-via-repost" | "repost-via-repost" | "subscribed-post" | "contact-match" | (string & {});
    reasonSubject?: string;
    record: unknown;
    starterPack?: AppBskyGraphDefsStarterPackViewBasic;
    isRead: boolean;
    indexedAt: string;
    labels?: Array<ComAtprotoLabelDefsLabel>;
    constructor(input?: Partial<AppBskyNotificationListNotificationsNotification>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyNotificationListNotificationsNotification;
}
/** Puts an activity subscription entry. The key should be omitted for creation and provided for updates. Requires auth. */
export declare class AppBskyNotificationPutActivitySubscription {
    static readonly nsid = "app.bsky.notification.putActivitySubscription";
    static readonly def = "main";
    static readonly kind: "procedure";
    static readonly http: "POST";
    static readonly errorNames: readonly [];
    subject: string;
    activitySubscription: AppBskyNotificationDefsActivitySubscription;
    constructor(input?: Partial<AppBskyNotificationPutActivitySubscription>);
    toParams(): Record<string, unknown>;
    toBody(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): AppBskyNotificationPutActivitySubscription;
}
export type AppBskyNotificationPutActivitySubscriptionOutput = {
    subject: string;
    activitySubscription?: AppBskyNotificationDefsActivitySubscription;
};
/** Set notification-related preferences for an account. Requires auth. */
export declare class AppBskyNotificationPutPreferences {
    static readonly nsid = "app.bsky.notification.putPreferences";
    static readonly def = "main";
    static readonly kind: "procedure";
    static readonly http: "POST";
    static readonly errorNames: readonly [];
    priority: boolean;
    constructor(input?: Partial<AppBskyNotificationPutPreferences>);
    toParams(): Record<string, unknown>;
    toBody(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): AppBskyNotificationPutPreferences;
}
export type AppBskyNotificationPutPreferencesOutput = Record<string, unknown>;
/** Set notification-related preferences for an account. Requires auth. */
export declare class AppBskyNotificationPutPreferencesV2 {
    static readonly nsid = "app.bsky.notification.putPreferencesV2";
    static readonly def = "main";
    static readonly kind: "procedure";
    static readonly http: "POST";
    static readonly errorNames: readonly [];
    chat?: AppBskyNotificationDefsChatPreference;
    follow?: AppBskyNotificationDefsFilterablePreference;
    like?: AppBskyNotificationDefsFilterablePreference;
    likeViaRepost?: AppBskyNotificationDefsFilterablePreference;
    mention?: AppBskyNotificationDefsFilterablePreference;
    quote?: AppBskyNotificationDefsFilterablePreference;
    reply?: AppBskyNotificationDefsFilterablePreference;
    repost?: AppBskyNotificationDefsFilterablePreference;
    repostViaRepost?: AppBskyNotificationDefsFilterablePreference;
    starterpackJoined?: AppBskyNotificationDefsPreference;
    subscribedPost?: AppBskyNotificationDefsPreference;
    unverified?: AppBskyNotificationDefsPreference;
    verified?: AppBskyNotificationDefsPreference;
    constructor(input?: Partial<AppBskyNotificationPutPreferencesV2>);
    toParams(): Record<string, unknown>;
    toBody(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): AppBskyNotificationPutPreferencesV2;
}
export type AppBskyNotificationPutPreferencesV2Output = {
    preferences: AppBskyNotificationDefsPreferences;
};
/** Register to receive push notifications, via a specified service, for the requesting account. Requires auth. */
export declare class AppBskyNotificationRegisterPush {
    static readonly nsid = "app.bsky.notification.registerPush";
    static readonly def = "main";
    static readonly kind: "procedure";
    static readonly http: "POST";
    static readonly errorNames: readonly [];
    serviceDid: string;
    token: string;
    platform: "ios" | "android" | "web" | (string & {});
    appId: string;
    ageRestricted?: boolean;
    constructor(input?: Partial<AppBskyNotificationRegisterPush>);
    toParams(): Record<string, unknown>;
    toBody(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): AppBskyNotificationRegisterPush;
}
export type AppBskyNotificationRegisterPushOutput = Record<string, unknown>;
/** The inverse of registerPush - inform a specified service that push notifications should no longer be sent to the given token for the requesting account. Requires auth. */
export declare class AppBskyNotificationUnregisterPush {
    static readonly nsid = "app.bsky.notification.unregisterPush";
    static readonly def = "main";
    static readonly kind: "procedure";
    static readonly http: "POST";
    static readonly errorNames: readonly [];
    serviceDid: string;
    token: string;
    platform: "ios" | "android" | "web" | (string & {});
    appId: string;
    constructor(input?: Partial<AppBskyNotificationUnregisterPush>);
    toParams(): Record<string, unknown>;
    toBody(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): AppBskyNotificationUnregisterPush;
}
export type AppBskyNotificationUnregisterPushOutput = Record<string, unknown>;
/** Notify server that the requesting account has seen notifications. Requires auth. */
export declare class AppBskyNotificationUpdateSeen {
    static readonly nsid = "app.bsky.notification.updateSeen";
    static readonly def = "main";
    static readonly kind: "procedure";
    static readonly http: "POST";
    static readonly errorNames: readonly [];
    seenAt: string;
    constructor(input?: Partial<AppBskyNotificationUpdateSeen>);
    toParams(): Record<string, unknown>;
    toBody(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): AppBskyNotificationUpdateSeen;
}
export type AppBskyNotificationUpdateSeenOutput = Record<string, unknown>;
/** Annotation of a sub-string within rich text. */
export declare class AppBskyRichtextFacet {
    static readonly nsid = "app.bsky.richtext.facet";
    static readonly def = "main";
    static readonly kind: "object";
    $type: string;
    index: AppBskyRichtextFacetByteSlice;
    features: Array<(AppBskyRichtextFacetMention | AppBskyRichtextFacetLink | AppBskyRichtextFacetTag | {
        $type?: string;
    })>;
    constructor(input?: Partial<AppBskyRichtextFacet>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyRichtextFacet;
}
/** Specifies the sub-string range a facet feature applies to. Start index is inclusive, end index is exclusive. Indices are zero-indexed, counting bytes of the UTF-8 encoded text. NOTE: some languages, like Javascript, use UTF-16 or Unicode co */
export declare class AppBskyRichtextFacetByteSlice {
    static readonly nsid = "app.bsky.richtext.facet";
    static readonly def = "byteSlice";
    static readonly kind: "object";
    $type: string;
    byteStart: number;
    byteEnd: number;
    constructor(input?: Partial<AppBskyRichtextFacetByteSlice>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyRichtextFacetByteSlice;
}
/** Facet feature for a URL. The text URL may have been simplified or truncated, but the facet reference should be a complete URL. */
export declare class AppBskyRichtextFacetLink {
    static readonly nsid = "app.bsky.richtext.facet";
    static readonly def = "link";
    static readonly kind: "object";
    $type: string;
    uri: string;
    constructor(input?: Partial<AppBskyRichtextFacetLink>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyRichtextFacetLink;
}
/** Facet feature for mention of another account. The text is usually a handle, including a '@' prefix, but the facet reference is a DID. */
export declare class AppBskyRichtextFacetMention {
    static readonly nsid = "app.bsky.richtext.facet";
    static readonly def = "mention";
    static readonly kind: "object";
    $type: string;
    did: string;
    constructor(input?: Partial<AppBskyRichtextFacetMention>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyRichtextFacetMention;
}
/** Facet feature for a hashtag. The text usually includes a '#' prefix, but the facet reference should not (except in the case of 'double hash tags'). */
export declare class AppBskyRichtextFacetTag {
    static readonly nsid = "app.bsky.richtext.facet";
    static readonly def = "tag";
    static readonly kind: "object";
    $type: string;
    tag: string;
    constructor(input?: Partial<AppBskyRichtextFacetTag>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyRichtextFacetTag;
}
/** Object used to store age assurance data in stash. */
export declare class AppBskyUnspeccedDefsAgeAssuranceEvent {
    static readonly nsid = "app.bsky.unspecced.defs";
    static readonly def = "ageAssuranceEvent";
    static readonly kind: "object";
    $type: string;
    createdAt: string;
    status: "unknown" | "pending" | "assured" | (string & {});
    attemptId: string;
    email?: string;
    initIp?: string;
    initUa?: string;
    completeIp?: string;
    completeUa?: string;
    constructor(input?: Partial<AppBskyUnspeccedDefsAgeAssuranceEvent>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyUnspeccedDefsAgeAssuranceEvent;
}
/** The computed state of the age assurance process, returned to the user in question on certain authenticated requests. */
export declare class AppBskyUnspeccedDefsAgeAssuranceState {
    static readonly nsid = "app.bsky.unspecced.defs";
    static readonly def = "ageAssuranceState";
    static readonly kind: "object";
    $type: string;
    lastInitiatedAt?: string;
    status: "unknown" | "pending" | "assured" | "blocked" | (string & {});
    constructor(input?: Partial<AppBskyUnspeccedDefsAgeAssuranceState>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyUnspeccedDefsAgeAssuranceState;
}
export declare class AppBskyUnspeccedDefsSkeletonSearchActor {
    static readonly nsid = "app.bsky.unspecced.defs";
    static readonly def = "skeletonSearchActor";
    static readonly kind: "object";
    $type: string;
    did: string;
    constructor(input?: Partial<AppBskyUnspeccedDefsSkeletonSearchActor>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyUnspeccedDefsSkeletonSearchActor;
}
export declare class AppBskyUnspeccedDefsSkeletonSearchPost {
    static readonly nsid = "app.bsky.unspecced.defs";
    static readonly def = "skeletonSearchPost";
    static readonly kind: "object";
    $type: string;
    uri: string;
    constructor(input?: Partial<AppBskyUnspeccedDefsSkeletonSearchPost>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyUnspeccedDefsSkeletonSearchPost;
}
export declare class AppBskyUnspeccedDefsSkeletonSearchStarterPack {
    static readonly nsid = "app.bsky.unspecced.defs";
    static readonly def = "skeletonSearchStarterPack";
    static readonly kind: "object";
    $type: string;
    uri: string;
    constructor(input?: Partial<AppBskyUnspeccedDefsSkeletonSearchStarterPack>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyUnspeccedDefsSkeletonSearchStarterPack;
}
export declare class AppBskyUnspeccedDefsSkeletonTrend {
    static readonly nsid = "app.bsky.unspecced.defs";
    static readonly def = "skeletonTrend";
    static readonly kind: "object";
    $type: string;
    topic: string;
    displayName: string;
    description?: string;
    link: string;
    startedAt: string;
    postCount: number;
    status?: "hot" | (string & {});
    category?: string;
    dids: Array<string>;
    constructor(input?: Partial<AppBskyUnspeccedDefsSkeletonTrend>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyUnspeccedDefsSkeletonTrend;
}
export declare class AppBskyUnspeccedDefsThreadItemBlocked {
    static readonly nsid = "app.bsky.unspecced.defs";
    static readonly def = "threadItemBlocked";
    static readonly kind: "object";
    $type: string;
    author: AppBskyFeedDefsBlockedAuthor;
    constructor(input?: Partial<AppBskyUnspeccedDefsThreadItemBlocked>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyUnspeccedDefsThreadItemBlocked;
}
export declare class AppBskyUnspeccedDefsThreadItemNotFound {
    static readonly nsid = "app.bsky.unspecced.defs";
    static readonly def = "threadItemNotFound";
    static readonly kind: "object";
    $type: string;
    constructor(input?: Partial<AppBskyUnspeccedDefsThreadItemNotFound>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyUnspeccedDefsThreadItemNotFound;
}
export declare class AppBskyUnspeccedDefsThreadItemNoUnauthenticated {
    static readonly nsid = "app.bsky.unspecced.defs";
    static readonly def = "threadItemNoUnauthenticated";
    static readonly kind: "object";
    $type: string;
    constructor(input?: Partial<AppBskyUnspeccedDefsThreadItemNoUnauthenticated>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyUnspeccedDefsThreadItemNoUnauthenticated;
}
export declare class AppBskyUnspeccedDefsThreadItemPost {
    static readonly nsid = "app.bsky.unspecced.defs";
    static readonly def = "threadItemPost";
    static readonly kind: "object";
    $type: string;
    post: AppBskyFeedDefsPostView;
    moreParents: boolean;
    moreReplies: number;
    opThread: boolean;
    opThreadPostIndex?: number;
    opThreadPostCount?: number;
    hiddenByThreadgate: boolean;
    mutedByViewer: boolean;
    constructor(input?: Partial<AppBskyUnspeccedDefsThreadItemPost>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyUnspeccedDefsThreadItemPost;
}
export declare class AppBskyUnspeccedDefsTrendingTopic {
    static readonly nsid = "app.bsky.unspecced.defs";
    static readonly def = "trendingTopic";
    static readonly kind: "object";
    $type: string;
    topic: string;
    displayName?: string;
    description?: string;
    link: string;
    constructor(input?: Partial<AppBskyUnspeccedDefsTrendingTopic>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyUnspeccedDefsTrendingTopic;
}
export declare class AppBskyUnspeccedDefsTrendView {
    static readonly nsid = "app.bsky.unspecced.defs";
    static readonly def = "trendView";
    static readonly kind: "object";
    $type: string;
    topic: string;
    displayName: string;
    description?: string;
    link: string;
    startedAt: string;
    postCount: number;
    status?: "hot" | (string & {});
    category?: string;
    actors: Array<AppBskyActorDefsProfileViewBasic>;
    constructor(input?: Partial<AppBskyUnspeccedDefsTrendView>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyUnspeccedDefsTrendView;
}
/** Returns the current state of the age assurance process for an account. This is used to check if the user has completed age assurance or if further action is required. */
export declare class AppBskyUnspeccedGetAgeAssuranceState {
    static readonly nsid = "app.bsky.unspecced.getAgeAssuranceState";
    static readonly def = "main";
    static readonly kind: "query";
    static readonly http: "GET";
    static readonly errorNames: readonly [];
    constructor(input?: Partial<AppBskyUnspeccedGetAgeAssuranceState>);
    toParams(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): AppBskyUnspeccedGetAgeAssuranceState;
}
export type AppBskyUnspeccedGetAgeAssuranceStateOutput = AppBskyUnspeccedDefsAgeAssuranceState;
/** Get a skeleton of recommended Atmosphere Explore articles. Intended to be called and hydrated by app.bsky.unspecced.getAtmosphereExploreTab */
export declare class AppBskyUnspeccedGetAtmosphereExploreArticleRecommendations {
    static readonly nsid = "app.bsky.unspecced.getAtmosphereExploreArticleRecommendations";
    static readonly def = "main";
    static readonly kind: "query";
    static readonly http: "GET";
    static readonly errorNames: readonly [];
    viewer?: string;
    limit?: number;
    constructor(input?: Partial<AppBskyUnspeccedGetAtmosphereExploreArticleRecommendations>);
    toParams(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): AppBskyUnspeccedGetAtmosphereExploreArticleRecommendations;
}
export type AppBskyUnspeccedGetAtmosphereExploreArticleRecommendationsOutput = {
    articles: Array<AppBskyUnspeccedGetAtmosphereExploreArticleRecommendationsArticle>;
    recIdStr: string;
};
export declare class AppBskyUnspeccedGetAtmosphereExploreArticleRecommendationsArticle {
    static readonly nsid = "app.bsky.unspecced.getAtmosphereExploreArticleRecommendations";
    static readonly def = "article";
    static readonly kind: "object";
    $type: string;
    uri: string;
    constructor(input?: Partial<AppBskyUnspeccedGetAtmosphereExploreArticleRecommendationsArticle>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyUnspeccedGetAtmosphereExploreArticleRecommendationsArticle;
}
/** Get miscellaneous runtime configuration. */
export declare class AppBskyUnspeccedGetConfig {
    static readonly nsid = "app.bsky.unspecced.getConfig";
    static readonly def = "main";
    static readonly kind: "query";
    static readonly http: "GET";
    static readonly errorNames: readonly [];
    constructor(input?: Partial<AppBskyUnspeccedGetConfig>);
    toParams(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): AppBskyUnspeccedGetConfig;
}
export type AppBskyUnspeccedGetConfigOutput = {
    checkEmailConfirmed?: boolean;
    liveNow?: Array<AppBskyUnspeccedGetConfigLiveNowConfig>;
};
export declare class AppBskyUnspeccedGetConfigLiveNowConfig {
    static readonly nsid = "app.bsky.unspecced.getConfig";
    static readonly def = "liveNowConfig";
    static readonly kind: "object";
    $type: string;
    did: string;
    domains: Array<string>;
    constructor(input?: Partial<AppBskyUnspeccedGetConfigLiveNowConfig>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyUnspeccedGetConfigLiveNowConfig;
}
/** Get a skeleton of suggested users for onboarding. Intended to be called and hydrated by app.bsky.unspecced.getSuggestedOnboardingUsers */
export declare class AppBskyUnspeccedGetOnboardingSuggestedUsersSkeleton {
    static readonly nsid = "app.bsky.unspecced.getOnboardingSuggestedUsersSkeleton";
    static readonly def = "main";
    static readonly kind: "query";
    static readonly http: "GET";
    static readonly errorNames: readonly [];
    viewer?: string;
    category?: string;
    limit?: number;
    constructor(input?: Partial<AppBskyUnspeccedGetOnboardingSuggestedUsersSkeleton>);
    toParams(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): AppBskyUnspeccedGetOnboardingSuggestedUsersSkeleton;
}
export type AppBskyUnspeccedGetOnboardingSuggestedUsersSkeletonOutput = {
    dids: Array<string>;
    recId?: string;
    recIdStr?: string;
};
/** An unspecced view of globally popular feed generators. */
export declare class AppBskyUnspeccedGetPopularFeedGenerators {
    static readonly nsid = "app.bsky.unspecced.getPopularFeedGenerators";
    static readonly def = "main";
    static readonly kind: "query";
    static readonly http: "GET";
    static readonly errorNames: readonly [];
    limit?: number;
    cursor?: string;
    query?: string;
    constructor(input?: Partial<AppBskyUnspeccedGetPopularFeedGenerators>);
    toParams(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): AppBskyUnspeccedGetPopularFeedGenerators;
}
export type AppBskyUnspeccedGetPopularFeedGeneratorsOutput = {
    cursor?: string;
    feeds: Array<AppBskyFeedDefsGeneratorView>;
};
/** (NOTE: this endpoint is under development and WILL change without notice. Don't use it until it is moved out of `unspecced` or your application WILL break) Get additional posts under a thread e.g. replies hidden by threadgate. Based on an a */
export declare class AppBskyUnspeccedGetPostThreadOtherV2 {
    static readonly nsid = "app.bsky.unspecced.getPostThreadOtherV2";
    static readonly def = "main";
    static readonly kind: "query";
    static readonly http: "GET";
    static readonly errorNames: readonly [];
    anchor: string;
    constructor(input?: Partial<AppBskyUnspeccedGetPostThreadOtherV2>);
    toParams(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): AppBskyUnspeccedGetPostThreadOtherV2;
}
export type AppBskyUnspeccedGetPostThreadOtherV2Output = {
    thread: Array<AppBskyUnspeccedGetPostThreadOtherV2ThreadItem>;
};
export declare class AppBskyUnspeccedGetPostThreadOtherV2ThreadItem {
    static readonly nsid = "app.bsky.unspecced.getPostThreadOtherV2";
    static readonly def = "threadItem";
    static readonly kind: "object";
    $type: string;
    uri: string;
    depth: number;
    value: AppBskyUnspeccedDefsThreadItemPost | {
        $type?: string;
    };
    constructor(input?: Partial<AppBskyUnspeccedGetPostThreadOtherV2ThreadItem>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyUnspeccedGetPostThreadOtherV2ThreadItem;
}
/** (NOTE: this endpoint is under development and WILL change without notice. Don't use it until it is moved out of `unspecced` or your application WILL break) Get posts in a thread. It is based in an anchor post at any depth of the tree, and r */
export declare class AppBskyUnspeccedGetPostThreadV2 {
    static readonly nsid = "app.bsky.unspecced.getPostThreadV2";
    static readonly def = "main";
    static readonly kind: "query";
    static readonly http: "GET";
    static readonly errorNames: readonly [];
    anchor: string;
    above?: boolean;
    below?: number;
    branchingFactor?: number;
    sort?: "newest" | "oldest" | "top" | (string & {});
    constructor(input?: Partial<AppBskyUnspeccedGetPostThreadV2>);
    toParams(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): AppBskyUnspeccedGetPostThreadV2;
}
export type AppBskyUnspeccedGetPostThreadV2Output = {
    thread: Array<AppBskyUnspeccedGetPostThreadV2ThreadItem>;
    threadgate?: AppBskyFeedDefsThreadgateView;
    hasOtherReplies: boolean;
};
export declare class AppBskyUnspeccedGetPostThreadV2ThreadItem {
    static readonly nsid = "app.bsky.unspecced.getPostThreadV2";
    static readonly def = "threadItem";
    static readonly kind: "object";
    $type: string;
    uri: string;
    depth: number;
    value: AppBskyUnspeccedDefsThreadItemPost | AppBskyUnspeccedDefsThreadItemNoUnauthenticated | AppBskyUnspeccedDefsThreadItemNotFound | AppBskyUnspeccedDefsThreadItemBlocked | {
        $type?: string;
    };
    constructor(input?: Partial<AppBskyUnspeccedGetPostThreadV2ThreadItem>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyUnspeccedGetPostThreadV2ThreadItem;
}
/** Get a list of suggested users for onboarding */
export declare class AppBskyUnspeccedGetSuggestedOnboardingUsers {
    static readonly nsid = "app.bsky.unspecced.getSuggestedOnboardingUsers";
    static readonly def = "main";
    static readonly kind: "query";
    static readonly http: "GET";
    static readonly errorNames: readonly [];
    category?: string;
    limit?: number;
    constructor(input?: Partial<AppBskyUnspeccedGetSuggestedOnboardingUsers>);
    toParams(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): AppBskyUnspeccedGetSuggestedOnboardingUsers;
}
export type AppBskyUnspeccedGetSuggestedOnboardingUsersOutput = {
    actors: Array<AppBskyActorDefsProfileView>;
    recId?: string;
    recIdStr?: string;
};
/** Get a list of suggested users */
export declare class AppBskyUnspeccedGetSuggestedUsers {
    static readonly nsid = "app.bsky.unspecced.getSuggestedUsers";
    static readonly def = "main";
    static readonly kind: "query";
    static readonly http: "GET";
    static readonly errorNames: readonly [];
    category?: string;
    limit?: number;
    constructor(input?: Partial<AppBskyUnspeccedGetSuggestedUsers>);
    toParams(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): AppBskyUnspeccedGetSuggestedUsers;
}
export type AppBskyUnspeccedGetSuggestedUsersOutput = {
    actors: Array<AppBskyActorDefsProfileView>;
    recId?: string;
    recIdStr?: string;
};
/** Get a list of suggested users for the Discover page */
export declare class AppBskyUnspeccedGetSuggestedUsersForDiscover {
    static readonly nsid = "app.bsky.unspecced.getSuggestedUsersForDiscover";
    static readonly def = "main";
    static readonly kind: "query";
    static readonly http: "GET";
    static readonly errorNames: readonly [];
    limit?: number;
    constructor(input?: Partial<AppBskyUnspeccedGetSuggestedUsersForDiscover>);
    toParams(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): AppBskyUnspeccedGetSuggestedUsersForDiscover;
}
export type AppBskyUnspeccedGetSuggestedUsersForDiscoverOutput = {
    actors: Array<AppBskyActorDefsProfileView>;
    recIdStr?: string;
};
/** Get a skeleton of suggested users for the Discover page. Intended to be called and hydrated by app.bsky.unspecced.getSuggestedUsersForDiscover */
export declare class AppBskyUnspeccedGetSuggestedUsersForDiscoverSkeleton {
    static readonly nsid = "app.bsky.unspecced.getSuggestedUsersForDiscoverSkeleton";
    static readonly def = "main";
    static readonly kind: "query";
    static readonly http: "GET";
    static readonly errorNames: readonly [];
    viewer?: string;
    limit?: number;
    constructor(input?: Partial<AppBskyUnspeccedGetSuggestedUsersForDiscoverSkeleton>);
    toParams(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): AppBskyUnspeccedGetSuggestedUsersForDiscoverSkeleton;
}
export type AppBskyUnspeccedGetSuggestedUsersForDiscoverSkeletonOutput = {
    dids: Array<string>;
    recIdStr?: string;
};
/** Get a list of suggested users for the Explore page */
export declare class AppBskyUnspeccedGetSuggestedUsersForExplore {
    static readonly nsid = "app.bsky.unspecced.getSuggestedUsersForExplore";
    static readonly def = "main";
    static readonly kind: "query";
    static readonly http: "GET";
    static readonly errorNames: readonly [];
    category?: string;
    limit?: number;
    constructor(input?: Partial<AppBskyUnspeccedGetSuggestedUsersForExplore>);
    toParams(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): AppBskyUnspeccedGetSuggestedUsersForExplore;
}
export type AppBskyUnspeccedGetSuggestedUsersForExploreOutput = {
    actors: Array<AppBskyActorDefsProfileView>;
    recIdStr?: string;
};
/** Get a skeleton of suggested users for the Explore page. Intended to be called and hydrated by app.bsky.unspecced.getSuggestedUsersForExplore */
export declare class AppBskyUnspeccedGetSuggestedUsersForExploreSkeleton {
    static readonly nsid = "app.bsky.unspecced.getSuggestedUsersForExploreSkeleton";
    static readonly def = "main";
    static readonly kind: "query";
    static readonly http: "GET";
    static readonly errorNames: readonly [];
    viewer?: string;
    category?: string;
    limit?: number;
    constructor(input?: Partial<AppBskyUnspeccedGetSuggestedUsersForExploreSkeleton>);
    toParams(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): AppBskyUnspeccedGetSuggestedUsersForExploreSkeleton;
}
export type AppBskyUnspeccedGetSuggestedUsersForExploreSkeletonOutput = {
    dids: Array<string>;
    recIdStr?: string;
};
/** Get a list of suggested users for the See More page */
export declare class AppBskyUnspeccedGetSuggestedUsersForSeeMore {
    static readonly nsid = "app.bsky.unspecced.getSuggestedUsersForSeeMore";
    static readonly def = "main";
    static readonly kind: "query";
    static readonly http: "GET";
    static readonly errorNames: readonly [];
    category?: string;
    limit?: number;
    constructor(input?: Partial<AppBskyUnspeccedGetSuggestedUsersForSeeMore>);
    toParams(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): AppBskyUnspeccedGetSuggestedUsersForSeeMore;
}
export type AppBskyUnspeccedGetSuggestedUsersForSeeMoreOutput = {
    actors: Array<AppBskyActorDefsProfileView>;
    recIdStr?: string;
};
/** Get a skeleton of suggested users for the See More page. Intended to be called and hydrated by app.bsky.unspecced.getSuggestedUsersForSeeMore */
export declare class AppBskyUnspeccedGetSuggestedUsersForSeeMoreSkeleton {
    static readonly nsid = "app.bsky.unspecced.getSuggestedUsersForSeeMoreSkeleton";
    static readonly def = "main";
    static readonly kind: "query";
    static readonly http: "GET";
    static readonly errorNames: readonly [];
    viewer?: string;
    category?: string;
    limit?: number;
    constructor(input?: Partial<AppBskyUnspeccedGetSuggestedUsersForSeeMoreSkeleton>);
    toParams(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): AppBskyUnspeccedGetSuggestedUsersForSeeMoreSkeleton;
}
export type AppBskyUnspeccedGetSuggestedUsersForSeeMoreSkeletonOutput = {
    dids: Array<string>;
    recIdStr?: string;
};
/** Get a skeleton of suggested users. Intended to be called and hydrated by app.bsky.unspecced.getSuggestedUsers */
export declare class AppBskyUnspeccedGetSuggestedUsersSkeleton {
    static readonly nsid = "app.bsky.unspecced.getSuggestedUsersSkeleton";
    static readonly def = "main";
    static readonly kind: "query";
    static readonly http: "GET";
    static readonly errorNames: readonly [];
    viewer?: string;
    category?: string;
    limit?: number;
    constructor(input?: Partial<AppBskyUnspeccedGetSuggestedUsersSkeleton>);
    toParams(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): AppBskyUnspeccedGetSuggestedUsersSkeleton;
}
export type AppBskyUnspeccedGetSuggestedUsersSkeletonOutput = {
    dids: Array<string>;
    recId?: string;
    recIdStr?: string;
};
/** Get a skeleton of suggested actors. Intended to be called and then hydrated through app.bsky.actor.getSuggestions */
export declare class AppBskyUnspeccedGetSuggestionsSkeleton {
    static readonly nsid = "app.bsky.unspecced.getSuggestionsSkeleton";
    static readonly def = "main";
    static readonly kind: "query";
    static readonly http: "GET";
    static readonly errorNames: readonly [];
    viewer?: string;
    limit?: number;
    cursor?: string;
    relativeToDid?: string;
    constructor(input?: Partial<AppBskyUnspeccedGetSuggestionsSkeleton>);
    toParams(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): AppBskyUnspeccedGetSuggestionsSkeleton;
}
export type AppBskyUnspeccedGetSuggestionsSkeletonOutput = {
    cursor?: string;
    actors: Array<AppBskyUnspeccedDefsSkeletonSearchActor>;
    relativeToDid?: string;
    recId?: number;
    recIdStr?: string;
};
/** Get a list of suggestions (feeds and users) tagged with categories */
export declare class AppBskyUnspeccedGetTaggedSuggestions {
    static readonly nsid = "app.bsky.unspecced.getTaggedSuggestions";
    static readonly def = "main";
    static readonly kind: "query";
    static readonly http: "GET";
    static readonly errorNames: readonly [];
    constructor(input?: Partial<AppBskyUnspeccedGetTaggedSuggestions>);
    toParams(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): AppBskyUnspeccedGetTaggedSuggestions;
}
export type AppBskyUnspeccedGetTaggedSuggestionsOutput = {
    suggestions: Array<AppBskyUnspeccedGetTaggedSuggestionsSuggestion>;
};
export declare class AppBskyUnspeccedGetTaggedSuggestionsSuggestion {
    static readonly nsid = "app.bsky.unspecced.getTaggedSuggestions";
    static readonly def = "suggestion";
    static readonly kind: "object";
    $type: string;
    tag: string;
    subjectType: "actor" | "feed" | (string & {});
    subject: string;
    constructor(input?: Partial<AppBskyUnspeccedGetTaggedSuggestionsSuggestion>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyUnspeccedGetTaggedSuggestionsSuggestion;
}
/** Get a list of trending topics */
export declare class AppBskyUnspeccedGetTrendingTopics {
    static readonly nsid = "app.bsky.unspecced.getTrendingTopics";
    static readonly def = "main";
    static readonly kind: "query";
    static readonly http: "GET";
    static readonly errorNames: readonly [];
    viewer?: string;
    limit?: number;
    constructor(input?: Partial<AppBskyUnspeccedGetTrendingTopics>);
    toParams(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): AppBskyUnspeccedGetTrendingTopics;
}
export type AppBskyUnspeccedGetTrendingTopicsOutput = {
    topics: Array<AppBskyUnspeccedDefsTrendingTopic>;
    suggested: Array<AppBskyUnspeccedDefsTrendingTopic>;
};
/** Get the current trends on the network */
export declare class AppBskyUnspeccedGetTrends {
    static readonly nsid = "app.bsky.unspecced.getTrends";
    static readonly def = "main";
    static readonly kind: "query";
    static readonly http: "GET";
    static readonly errorNames: readonly [];
    limit?: number;
    constructor(input?: Partial<AppBskyUnspeccedGetTrends>);
    toParams(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): AppBskyUnspeccedGetTrends;
}
export type AppBskyUnspeccedGetTrendsOutput = {
    trends: Array<AppBskyUnspeccedDefsTrendView>;
    recIdStr?: string;
};
/** Get the skeleton of trends on the network. Intended to be called and then hydrated through app.bsky.unspecced.getTrends */
export declare class AppBskyUnspeccedGetTrendsSkeleton {
    static readonly nsid = "app.bsky.unspecced.getTrendsSkeleton";
    static readonly def = "main";
    static readonly kind: "query";
    static readonly http: "GET";
    static readonly errorNames: readonly [];
    viewer?: string;
    limit?: number;
    constructor(input?: Partial<AppBskyUnspeccedGetTrendsSkeleton>);
    toParams(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): AppBskyUnspeccedGetTrendsSkeleton;
}
export type AppBskyUnspeccedGetTrendsSkeletonOutput = {
    trends: Array<AppBskyUnspeccedDefsSkeletonTrend>;
    recIdStr?: string;
};
/** Initiate age assurance for an account. This is a one-time action that will start the process of verifying the user's age. */
export declare class AppBskyUnspeccedInitAgeAssurance {
    static readonly nsid = "app.bsky.unspecced.initAgeAssurance";
    static readonly def = "main";
    static readonly kind: "procedure";
    static readonly http: "POST";
    static readonly errorNames: readonly ["InvalidEmail", "DidTooLong", "InvalidInitiation"];
    email: string;
    language: string;
    countryCode: string;
    constructor(input?: Partial<AppBskyUnspeccedInitAgeAssurance>);
    toParams(): Record<string, unknown>;
    toBody(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): AppBskyUnspeccedInitAgeAssurance;
}
export type AppBskyUnspeccedInitAgeAssuranceOutput = AppBskyUnspeccedDefsAgeAssuranceState;
/** Backend Actors (profile) search, returns only skeleton. */
export declare class AppBskyUnspeccedSearchActorsSkeleton {
    static readonly nsid = "app.bsky.unspecced.searchActorsSkeleton";
    static readonly def = "main";
    static readonly kind: "query";
    static readonly http: "GET";
    static readonly errorNames: readonly ["BadQueryString"];
    q: string;
    viewer?: string;
    typeahead?: boolean;
    limit?: number;
    cursor?: string;
    constructor(input?: Partial<AppBskyUnspeccedSearchActorsSkeleton>);
    toParams(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): AppBskyUnspeccedSearchActorsSkeleton;
}
export type AppBskyUnspeccedSearchActorsSkeletonOutput = {
    cursor?: string;
    hitsTotal?: number;
    actors: Array<AppBskyUnspeccedDefsSkeletonSearchActor>;
};
/** Backend Posts search, returns only skeleton */
export declare class AppBskyUnspeccedSearchPostsSkeleton {
    static readonly nsid = "app.bsky.unspecced.searchPostsSkeleton";
    static readonly def = "main";
    static readonly kind: "query";
    static readonly http: "GET";
    static readonly errorNames: readonly ["BadQueryString"];
    q: string;
    sort?: "top" | "latest" | (string & {});
    since?: string;
    until?: string;
    mentions?: string;
    author?: string;
    lang?: string;
    domain?: string;
    url?: string;
    tag?: Array<string>;
    viewer?: string;
    limit?: number;
    cursor?: string;
    constructor(input?: Partial<AppBskyUnspeccedSearchPostsSkeleton>);
    toParams(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): AppBskyUnspeccedSearchPostsSkeleton;
}
export type AppBskyUnspeccedSearchPostsSkeletonOutput = {
    cursor?: string;
    hitsTotal?: number;
    posts: Array<AppBskyUnspeccedDefsSkeletonSearchPost>;
};
/** Backend Starter Pack search, returns only skeleton. */
export declare class AppBskyUnspeccedSearchStarterPacksSkeleton {
    static readonly nsid = "app.bsky.unspecced.searchStarterPacksSkeleton";
    static readonly def = "main";
    static readonly kind: "query";
    static readonly http: "GET";
    static readonly errorNames: readonly ["BadQueryString"];
    q: string;
    viewer?: string;
    limit?: number;
    cursor?: string;
    constructor(input?: Partial<AppBskyUnspeccedSearchStarterPacksSkeleton>);
    toParams(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): AppBskyUnspeccedSearchStarterPacksSkeleton;
}
export type AppBskyUnspeccedSearchStarterPacksSkeletonOutput = {
    cursor?: string;
    hitsTotal?: number;
    starterPacks: Array<AppBskyUnspeccedDefsSkeletonSearchStarterPack>;
};
/** Abort an upload only while it is created, releasing its quota reservation immediately. Terminal sessions are unchanged and return their terminal outcome. A finishing session returns UploadNotReady. */
export declare class AppBskyVideoAbortUpload {
    static readonly nsid = "app.bsky.video.abortUpload";
    static readonly def = "main";
    static readonly kind: "procedure";
    static readonly http: "POST";
    static readonly errorNames: readonly ["UploadNotFound", "UploadNotReady"];
    jobId: string;
    constructor(input?: Partial<AppBskyVideoAbortUpload>);
    toParams(): Record<string, unknown>;
    toBody(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): AppBskyVideoAbortUpload;
}
export type AppBskyVideoAbortUploadOutput = {
    state: "aborted" | "completed" | "failed" | "expired" | (string & {});
    completedJobId?: string;
    failureReason?: string;
};
export declare class AppBskyVideoDefsJobStatus {
    static readonly nsid = "app.bsky.video.defs";
    static readonly def = "jobStatus";
    static readonly kind: "object";
    $type: string;
    jobId: string;
    did: string;
    state: "JOB_STATE_CREATED" | "JOB_STATE_ENCODING" | "JOB_STATE_ENCODED" | "JOB_STATE_SCANNING" | "JOB_STATE_SCANNED" | "JOB_STATE_UPLOADING" | "JOB_STATE_UPLOADED" | "JOB_STATE_COMPLETED" | "JOB_STATE_FAILED" | (string & {});
    progress?: number;
    blob?: RepoBlobJson;
    error?: string;
    failureCode?: "validation_failure" | "encoding_failure" | "pds_upload_failure" | "pds_upload_unsupported_blob_size" | "generic_failure" | (string & {});
    message?: string;
    constructor(input?: Partial<AppBskyVideoDefsJobStatus>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): AppBskyVideoDefsJobStatus;
}
/** Finish an upload. This call is idempotent and safe to retry. On deduplication completedJobId may differ from the input jobId; poll getJobStatus with completedJobId. Probe-based validation failures surface later as JOB_STATE_FAILED from getJ */
export declare class AppBskyVideoFinishUpload {
    static readonly nsid = "app.bsky.video.finishUpload";
    static readonly def = "main";
    static readonly kind: "procedure";
    static readonly http: "POST";
    static readonly errorNames: readonly ["UploadNotFound", "UploadExpired", "MissingParts", "UploadNotReady", "UnsupportedContentType", "UploadFailed", "UploadAborted", "ServiceOverloaded"];
    jobId: string;
    constructor(input?: Partial<AppBskyVideoFinishUpload>);
    toParams(): Record<string, unknown>;
    toBody(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): AppBskyVideoFinishUpload;
}
export type AppBskyVideoFinishUploadOutput = {
    completedJobId: string;
    jobStatus: AppBskyVideoDefsJobStatus;
};
/** Get status details for a video processing job. */
export declare class AppBskyVideoGetJobStatus {
    static readonly nsid = "app.bsky.video.getJobStatus";
    static readonly def = "main";
    static readonly kind: "query";
    static readonly http: "GET";
    static readonly errorNames: readonly [];
    jobId: string;
    constructor(input?: Partial<AppBskyVideoGetJobStatus>);
    toParams(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): AppBskyVideoGetJobStatus;
}
export type AppBskyVideoGetJobStatusOutput = {
    jobStatus: AppBskyVideoDefsJobStatus;
};
/** Get video upload limits for the authenticated user. */
export declare class AppBskyVideoGetUploadLimits {
    static readonly nsid = "app.bsky.video.getUploadLimits";
    static readonly def = "main";
    static readonly kind: "query";
    static readonly http: "GET";
    static readonly errorNames: readonly [];
    constructor(input?: Partial<AppBskyVideoGetUploadLimits>);
    toParams(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): AppBskyVideoGetUploadLimits;
}
export type AppBskyVideoGetUploadLimitsOutput = {
    canUpload: boolean;
    remainingDailyVideos?: number;
    remainingDailyBytes?: number;
    message?: string;
    error?: string;
};
/** Get the authoritative status of the upload phase. Terminal states remain readable. completedJobId and jobStatus are present only for completed sessions; failureReason is present only for failed sessions. */
export declare class AppBskyVideoGetUploadStatus {
    static readonly nsid = "app.bsky.video.getUploadStatus";
    static readonly def = "main";
    static readonly kind: "query";
    static readonly http: "GET";
    static readonly errorNames: readonly ["UploadNotFound"];
    jobId: string;
    constructor(input?: Partial<AppBskyVideoGetUploadStatus>);
    toParams(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): AppBskyVideoGetUploadStatus;
}
export type AppBskyVideoGetUploadStatusOutput = {
    jobId: string;
    partSizeBytes: number;
    partCount: number;
    receivedParts: Array<number>;
    expiresAt: string;
    state: "created" | "finishing" | "completed" | "failed" | "aborted" | "expired" | (string & {});
    completedJobId?: string;
    jobStatus?: AppBskyVideoDefsJobStatus;
    failureReason?: string;
};
/** Start a multipart video upload. The declared size is exact, while optional media properties are advisory and used only for early failure; the authoritative probe runs asynchronously after upload. */
export declare class AppBskyVideoStartUpload {
    static readonly nsid = "app.bsky.video.startUpload";
    static readonly def = "main";
    static readonly kind: "procedure";
    static readonly http: "POST";
    static readonly errorNames: readonly ["UnsupportedContentType", "VideoTooLarge", "VideoTooLong", "BadAspectRatio", "DailyLimitExceeded", "TooManyOpenUploads", "UploadForbidden", "ServiceOverloaded"];
    sizeBytes: number;
    mimeType: string;
    name?: string;
    durationMs?: number;
    width?: number;
    height?: number;
    constructor(input?: Partial<AppBskyVideoStartUpload>);
    toParams(): Record<string, unknown>;
    toBody(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): AppBskyVideoStartUpload;
}
export type AppBskyVideoStartUploadOutput = {
    jobId: string;
    partSizeBytes: number;
    partCount: number;
    expiresAt: string;
};
/** Upload one part. Parts are idempotent and may be retried or re-sent while the session is created. Each expected length is derived from the upload size and part size, and Content-Length must match exactly. ETags are never exposed to clients. */
export declare class AppBskyVideoUploadPart {
    static readonly nsid = "app.bsky.video.uploadPart";
    static readonly def = "main";
    static readonly kind: "procedure";
    static readonly http: "POST";
    static readonly errorNames: readonly ["UploadNotFound", "UploadExpired", "InvalidPartNumber", "PartSizeMismatch", "UploadNotReady", "UploadFailed", "UploadAborted", "UploadAlreadyCompleted", "ServiceOverloaded"];
    jobId: string;
    partNumber: number;
    payload: Blob | Uint8Array | ArrayBuffer;
    constructor(input?: Partial<AppBskyVideoUploadPart>);
    toParams(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): AppBskyVideoUploadPart;
}
export type AppBskyVideoUploadPartOutput = {
    partNumber: number;
    sizeBytes: number;
};
/** Upload a video to be processed then stored on the PDS. */
export declare class AppBskyVideoUploadVideo {
    static readonly nsid = "app.bsky.video.uploadVideo";
    static readonly def = "main";
    static readonly kind: "procedure";
    static readonly http: "POST";
    static readonly errorNames: readonly [];
    payload: Blob | Uint8Array | ArrayBuffer;
    constructor(input?: Partial<AppBskyVideoUploadVideo>);
    toParams(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): AppBskyVideoUploadVideo;
}
export type AppBskyVideoUploadVideoOutput = {
    jobStatus: AppBskyVideoDefsJobStatus;
};
/** A declaration of a Bluesky chat account. */
export declare class ChatBskyActorDeclaration {
    static readonly nsid = "chat.bsky.actor.declaration";
    static readonly def = "main";
    static readonly kind: "record";
    static readonly recordKey = "literal:self";
    $type: string;
    allowIncoming: "all" | "none" | "following" | (string & {});
    allowGroupInvites?: "all" | "none" | "following" | (string & {});
    constructor(input?: Partial<ChatBskyActorDeclaration>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): ChatBskyActorDeclaration;
}
export declare class ChatBskyActorDefsDirectConvoMember {
    static readonly nsid = "chat.bsky.actor.defs";
    static readonly def = "directConvoMember";
    static readonly kind: "object";
    $type: string;
    constructor(input?: Partial<ChatBskyActorDefsDirectConvoMember>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): ChatBskyActorDefsDirectConvoMember;
}
/** A current group convo member. */
export declare class ChatBskyActorDefsGroupConvoMember {
    static readonly nsid = "chat.bsky.actor.defs";
    static readonly def = "groupConvoMember";
    static readonly kind: "object";
    $type: string;
    addedBy?: ChatBskyActorDefsProfileViewBasic;
    role: "owner" | "standard" | (string & {});
    constructor(input?: Partial<ChatBskyActorDefsGroupConvoMember>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): ChatBskyActorDefsGroupConvoMember;
}
export declare class ChatBskyActorDefsMemberRole {
    static readonly nsid = "chat.bsky.actor.defs";
    static readonly def = "memberRole";
    static readonly kind: "string";
    static readonly knownValues: readonly ["owner", "standard"];
    static includes(value: string): boolean;
    private constructor();
}
/** A past group convo member. */
export declare class ChatBskyActorDefsPastGroupConvoMember {
    static readonly nsid = "chat.bsky.actor.defs";
    static readonly def = "pastGroupConvoMember";
    static readonly kind: "object";
    $type: string;
    constructor(input?: Partial<ChatBskyActorDefsPastGroupConvoMember>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): ChatBskyActorDefsPastGroupConvoMember;
}
export declare class ChatBskyActorDefsProfileViewBasic {
    static readonly nsid = "chat.bsky.actor.defs";
    static readonly def = "profileViewBasic";
    static readonly kind: "object";
    $type: string;
    did: string;
    handle: string;
    displayName?: string;
    avatar?: string;
    associated?: AppBskyActorDefsProfileAssociated;
    viewer?: AppBskyActorDefsViewerState;
    labels?: Array<ComAtprotoLabelDefsLabel>;
    createdAt?: string;
    chatDisabled?: boolean;
    verification?: AppBskyActorDefsVerificationState;
    kind?: ChatBskyActorDefsDirectConvoMember | ChatBskyActorDefsGroupConvoMember | ChatBskyActorDefsPastGroupConvoMember | {
        $type?: string;
    };
    constructor(input?: Partial<ChatBskyActorDefsProfileViewBasic>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): ChatBskyActorDefsProfileViewBasic;
}
export declare class ChatBskyActorDeleteAccount {
    static readonly nsid = "chat.bsky.actor.deleteAccount";
    static readonly def = "main";
    static readonly kind: "procedure";
    static readonly http: "POST";
    static readonly errorNames: readonly [];
    constructor(input?: Partial<ChatBskyActorDeleteAccount>);
    toParams(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): ChatBskyActorDeleteAccount;
}
export type ChatBskyActorDeleteAccountOutput = Record<string, unknown>;
export declare class ChatBskyActorExportAccountData {
    static readonly nsid = "chat.bsky.actor.exportAccountData";
    static readonly def = "main";
    static readonly kind: "query";
    static readonly http: "GET";
    static readonly errorNames: readonly [];
    constructor(input?: Partial<ChatBskyActorExportAccountData>);
    toParams(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): ChatBskyActorExportAccountData;
}
export type ChatBskyActorExportAccountDataOutput = ArrayBuffer;
/** Get the authenticated viewer's chat status: whether their account is chat-disabled and whether their group-membership additions are restricted to accounts they follow. */
export declare class ChatBskyActorGetStatus {
    static readonly nsid = "chat.bsky.actor.getStatus";
    static readonly def = "main";
    static readonly kind: "query";
    static readonly http: "GET";
    static readonly errorNames: readonly [];
    constructor(input?: Partial<ChatBskyActorGetStatus>);
    toParams(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): ChatBskyActorGetStatus;
}
export type ChatBskyActorGetStatusOutput = {
    chatDisabled: boolean;
    canCreateGroups: boolean;
    groupMemberLimit: number;
};
/** Marks a conversation as accepted, so it is shown in the list of accepted convos instead on the request convos. */
export declare class ChatBskyConvoAcceptConvo {
    static readonly nsid = "chat.bsky.convo.acceptConvo";
    static readonly def = "main";
    static readonly kind: "procedure";
    static readonly http: "POST";
    static readonly errorNames: readonly ["InvalidConvo"];
    convoId: string;
    constructor(input?: Partial<ChatBskyConvoAcceptConvo>);
    toParams(): Record<string, unknown>;
    toBody(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): ChatBskyConvoAcceptConvo;
}
export type ChatBskyConvoAcceptConvoOutput = {
    rev?: string;
};
/** Adds an emoji reaction to a message. Requires authentication. It is idempotent, so multiple calls from the same user with the same emoji result in a single reaction. */
export declare class ChatBskyConvoAddReaction {
    static readonly nsid = "chat.bsky.convo.addReaction";
    static readonly def = "main";
    static readonly kind: "procedure";
    static readonly http: "POST";
    static readonly errorNames: readonly ["InvalidConvo", "ReactionNotAllowed", "ReactionMessageDeleted", "ReactionLimitReached", "ReactionInvalidValue"];
    convoId: string;
    messageId: string;
    value: string;
    constructor(input?: Partial<ChatBskyConvoAddReaction>);
    toParams(): Record<string, unknown>;
    toBody(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): ChatBskyConvoAddReaction;
}
export type ChatBskyConvoAddReactionOutput = {
    message: ChatBskyConvoDefsMessageView;
};
export declare class ChatBskyConvoDefsConvoKind {
    static readonly nsid = "chat.bsky.convo.defs";
    static readonly def = "convoKind";
    static readonly kind: "string";
    static readonly knownValues: readonly ["direct", "group"];
    static includes(value: string): boolean;
    private constructor();
}
export declare class ChatBskyConvoDefsConvoLockStatus {
    static readonly nsid = "chat.bsky.convo.defs";
    static readonly def = "convoLockStatus";
    static readonly kind: "string";
    static readonly knownValues: readonly ["unlocked", "locked", "locked-permanently"];
    static includes(value: string): boolean;
    private constructor();
}
export declare class ChatBskyConvoDefsConvoRef {
    static readonly nsid = "chat.bsky.convo.defs";
    static readonly def = "convoRef";
    static readonly kind: "object";
    $type: string;
    did: string;
    convoId: string;
    constructor(input?: Partial<ChatBskyConvoDefsConvoRef>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): ChatBskyConvoDefsConvoRef;
}
export declare class ChatBskyConvoDefsConvoStatus {
    static readonly nsid = "chat.bsky.convo.defs";
    static readonly def = "convoStatus";
    static readonly kind: "string";
    static readonly knownValues: readonly ["request", "accepted"];
    static includes(value: string): boolean;
    private constructor();
}
export declare class ChatBskyConvoDefsConvoView {
    static readonly nsid = "chat.bsky.convo.defs";
    static readonly def = "convoView";
    static readonly kind: "object";
    $type: string;
    id: string;
    rev: string;
    members: Array<ChatBskyActorDefsProfileViewBasic>;
    lastMessage?: ChatBskyConvoDefsMessageView | ChatBskyConvoDefsDeletedMessageView | ChatBskyConvoDefsSystemMessageView | {
        $type?: string;
    };
    lastReaction?: ChatBskyConvoDefsMessageAndReactionView | {
        $type?: string;
    };
    muted: boolean;
    status?: "request" | "accepted" | (string & {});
    unreadCount: number;
    kind?: ChatBskyConvoDefsDirectConvo | ChatBskyConvoDefsGroupConvo | {
        $type?: string;
    };
    constructor(input?: Partial<ChatBskyConvoDefsConvoView>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): ChatBskyConvoDefsConvoView;
}
export declare class ChatBskyConvoDefsDeletedMessageView {
    static readonly nsid = "chat.bsky.convo.defs";
    static readonly def = "deletedMessageView";
    static readonly kind: "object";
    $type: string;
    id: string;
    rev: string;
    sender: ChatBskyConvoDefsMessageViewSender;
    sentAt: string;
    constructor(input?: Partial<ChatBskyConvoDefsDeletedMessageView>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): ChatBskyConvoDefsDeletedMessageView;
}
export declare class ChatBskyConvoDefsDirectConvo {
    static readonly nsid = "chat.bsky.convo.defs";
    static readonly def = "directConvo";
    static readonly kind: "object";
    $type: string;
    constructor(input?: Partial<ChatBskyConvoDefsDirectConvo>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): ChatBskyConvoDefsDirectConvo;
}
export declare class ChatBskyConvoDefsGroupConvo {
    static readonly nsid = "chat.bsky.convo.defs";
    static readonly def = "groupConvo";
    static readonly kind: "object";
    $type: string;
    createdAt: string;
    joinLink?: ChatBskyGroupDefsJoinLinkView;
    joinRequestCount?: number;
    lockStatus: "unlocked" | "locked" | "locked-permanently" | (string & {});
    lockStatusModerationOverride: boolean;
    memberCount: number;
    memberLimit: number;
    name: string;
    unreadJoinRequestCount?: number;
    constructor(input?: Partial<ChatBskyConvoDefsGroupConvo>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): ChatBskyConvoDefsGroupConvo;
}
/** Event indicating the viewer accepted a convo, and it can be moved out of the request inbox. Can be direct or group. */
export declare class ChatBskyConvoDefsLogAcceptConvo {
    static readonly nsid = "chat.bsky.convo.defs";
    static readonly def = "logAcceptConvo";
    static readonly kind: "object";
    $type: string;
    rev: string;
    convoId: string;
    constructor(input?: Partial<ChatBskyConvoDefsLogAcceptConvo>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): ChatBskyConvoDefsLogAcceptConvo;
}
/** Event indicating a member was added to a group convo. The member who was added gets a logBeginConvo (to create the convo) but also a logAddMember (to show the system message as the first message the user sees). */
export declare class ChatBskyConvoDefsLogAddMember {
    static readonly nsid = "chat.bsky.convo.defs";
    static readonly def = "logAddMember";
    static readonly kind: "object";
    $type: string;
    rev: string;
    convoId: string;
    message: ChatBskyConvoDefsSystemMessageView;
    relatedProfiles: Array<ChatBskyActorDefsProfileViewBasic>;
    constructor(input?: Partial<ChatBskyConvoDefsLogAddMember>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): ChatBskyConvoDefsLogAddMember;
}
/** Event indicating a reaction was added to a message. */
export declare class ChatBskyConvoDefsLogAddReaction {
    static readonly nsid = "chat.bsky.convo.defs";
    static readonly def = "logAddReaction";
    static readonly kind: "object";
    $type: string;
    rev: string;
    convoId: string;
    message: ChatBskyConvoDefsMessageView | ChatBskyConvoDefsDeletedMessageView | {
        $type?: string;
    };
    reaction: ChatBskyConvoDefsReactionView;
    relatedProfiles?: Array<ChatBskyActorDefsProfileViewBasic>;
    constructor(input?: Partial<ChatBskyConvoDefsLogAddReaction>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): ChatBskyConvoDefsLogAddReaction;
}
/** Event indicating a join request was approved by the viewer. Only the owner gets this. The approved member gets a logBeginConvo. */
export declare class ChatBskyConvoDefsLogApproveJoinRequest {
    static readonly nsid = "chat.bsky.convo.defs";
    static readonly def = "logApproveJoinRequest";
    static readonly kind: "object";
    $type: string;
    rev: string;
    convoId: string;
    member: ChatBskyActorDefsProfileViewBasic;
    constructor(input?: Partial<ChatBskyConvoDefsLogApproveJoinRequest>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): ChatBskyConvoDefsLogApproveJoinRequest;
}
/** Event indicating a convo containing the viewer was started. Can be direct or group. When a member is added to a group convo, they also get this event. */
export declare class ChatBskyConvoDefsLogBeginConvo {
    static readonly nsid = "chat.bsky.convo.defs";
    static readonly def = "logBeginConvo";
    static readonly kind: "object";
    $type: string;
    rev: string;
    convoId: string;
    constructor(input?: Partial<ChatBskyConvoDefsLogBeginConvo>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): ChatBskyConvoDefsLogBeginConvo;
}
/** Event indicating a join link was created for a group convo. */
export declare class ChatBskyConvoDefsLogCreateJoinLink {
    static readonly nsid = "chat.bsky.convo.defs";
    static readonly def = "logCreateJoinLink";
    static readonly kind: "object";
    $type: string;
    rev: string;
    convoId: string;
    message: ChatBskyConvoDefsSystemMessageView;
    constructor(input?: Partial<ChatBskyConvoDefsLogCreateJoinLink>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): ChatBskyConvoDefsLogCreateJoinLink;
}
/** Event indicating a user-originated message was created. Is not emitted for system messages. */
export declare class ChatBskyConvoDefsLogCreateMessage {
    static readonly nsid = "chat.bsky.convo.defs";
    static readonly def = "logCreateMessage";
    static readonly kind: "object";
    $type: string;
    rev: string;
    convoId: string;
    message: ChatBskyConvoDefsMessageView | ChatBskyConvoDefsDeletedMessageView | {
        $type?: string;
    };
    relatedProfiles?: Array<ChatBskyActorDefsProfileViewBasic>;
    constructor(input?: Partial<ChatBskyConvoDefsLogCreateMessage>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): ChatBskyConvoDefsLogCreateMessage;
}
/** Event indicating a user-originated message was deleted. Is not emitted for system messages. */
export declare class ChatBskyConvoDefsLogDeleteMessage {
    static readonly nsid = "chat.bsky.convo.defs";
    static readonly def = "logDeleteMessage";
    static readonly kind: "object";
    $type: string;
    rev: string;
    convoId: string;
    message: ChatBskyConvoDefsMessageView | ChatBskyConvoDefsDeletedMessageView | {
        $type?: string;
    };
    constructor(input?: Partial<ChatBskyConvoDefsLogDeleteMessage>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): ChatBskyConvoDefsLogDeleteMessage;
}
/** Event indicating a join link was disabled for a group convo. */
export declare class ChatBskyConvoDefsLogDisableJoinLink {
    static readonly nsid = "chat.bsky.convo.defs";
    static readonly def = "logDisableJoinLink";
    static readonly kind: "object";
    $type: string;
    rev: string;
    convoId: string;
    message: ChatBskyConvoDefsSystemMessageView;
    constructor(input?: Partial<ChatBskyConvoDefsLogDisableJoinLink>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): ChatBskyConvoDefsLogDisableJoinLink;
}
/** Event indicating info about group convo was edited. */
export declare class ChatBskyConvoDefsLogEditGroup {
    static readonly nsid = "chat.bsky.convo.defs";
    static readonly def = "logEditGroup";
    static readonly kind: "object";
    $type: string;
    rev: string;
    convoId: string;
    message: ChatBskyConvoDefsSystemMessageView;
    constructor(input?: Partial<ChatBskyConvoDefsLogEditGroup>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): ChatBskyConvoDefsLogEditGroup;
}
/** Event indicating a settings about a join link for a group convo were edited. */
export declare class ChatBskyConvoDefsLogEditJoinLink {
    static readonly nsid = "chat.bsky.convo.defs";
    static readonly def = "logEditJoinLink";
    static readonly kind: "object";
    $type: string;
    rev: string;
    convoId: string;
    message: ChatBskyConvoDefsSystemMessageView;
    constructor(input?: Partial<ChatBskyConvoDefsLogEditJoinLink>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): ChatBskyConvoDefsLogEditJoinLink;
}
/** Event indicating a join link was enabled for a group convo. */
export declare class ChatBskyConvoDefsLogEnableJoinLink {
    static readonly nsid = "chat.bsky.convo.defs";
    static readonly def = "logEnableJoinLink";
    static readonly kind: "object";
    $type: string;
    rev: string;
    convoId: string;
    message: ChatBskyConvoDefsSystemMessageView;
    constructor(input?: Partial<ChatBskyConvoDefsLogEnableJoinLink>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): ChatBskyConvoDefsLogEnableJoinLink;
}
/** Event indicating a join request was made to a group the viewer owns. Only the owner gets this. */
export declare class ChatBskyConvoDefsLogIncomingJoinRequest {
    static readonly nsid = "chat.bsky.convo.defs";
    static readonly def = "logIncomingJoinRequest";
    static readonly kind: "object";
    $type: string;
    rev: string;
    convoId: string;
    member: ChatBskyActorDefsProfileViewBasic;
    constructor(input?: Partial<ChatBskyConvoDefsLogIncomingJoinRequest>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): ChatBskyConvoDefsLogIncomingJoinRequest;
}
/** Event indicating the viewer left a convo. Can be direct or group. */
export declare class ChatBskyConvoDefsLogLeaveConvo {
    static readonly nsid = "chat.bsky.convo.defs";
    static readonly def = "logLeaveConvo";
    static readonly kind: "object";
    $type: string;
    rev: string;
    convoId: string;
    constructor(input?: Partial<ChatBskyConvoDefsLogLeaveConvo>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): ChatBskyConvoDefsLogLeaveConvo;
}
/** Event indicating a group convo was locked. */
export declare class ChatBskyConvoDefsLogLockConvo {
    static readonly nsid = "chat.bsky.convo.defs";
    static readonly def = "logLockConvo";
    static readonly kind: "object";
    $type: string;
    rev: string;
    convoId: string;
    message: ChatBskyConvoDefsSystemMessageView;
    relatedProfiles: Array<ChatBskyActorDefsProfileViewBasic>;
    constructor(input?: Partial<ChatBskyConvoDefsLogLockConvo>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): ChatBskyConvoDefsLogLockConvo;
}
/** Event indicating a group convo was locked permanently. */
export declare class ChatBskyConvoDefsLogLockConvoPermanently {
    static readonly nsid = "chat.bsky.convo.defs";
    static readonly def = "logLockConvoPermanently";
    static readonly kind: "object";
    $type: string;
    rev: string;
    convoId: string;
    message: ChatBskyConvoDefsSystemMessageView;
    relatedProfiles: Array<ChatBskyActorDefsProfileViewBasic>;
    constructor(input?: Partial<ChatBskyConvoDefsLogLockConvoPermanently>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): ChatBskyConvoDefsLogLockConvoPermanently;
}
/** Event indicating a member joined a group convo via join link. The member who was added gets a logBeginConvo (to create the convo) but also a logMemberJoin (to show the system message as the first message the user sees). */
export declare class ChatBskyConvoDefsLogMemberJoin {
    static readonly nsid = "chat.bsky.convo.defs";
    static readonly def = "logMemberJoin";
    static readonly kind: "object";
    $type: string;
    rev: string;
    convoId: string;
    message: ChatBskyConvoDefsSystemMessageView;
    relatedProfiles: Array<ChatBskyActorDefsProfileViewBasic>;
    constructor(input?: Partial<ChatBskyConvoDefsLogMemberJoin>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): ChatBskyConvoDefsLogMemberJoin;
}
/** Event indicating a member voluntarily left a group convo. The member who was removed gets a logLeaveConvo (to leave the convo) but not a logMemberLeave (because they already left, so can't see the system message). */
export declare class ChatBskyConvoDefsLogMemberLeave {
    static readonly nsid = "chat.bsky.convo.defs";
    static readonly def = "logMemberLeave";
    static readonly kind: "object";
    $type: string;
    rev: string;
    convoId: string;
    message: ChatBskyConvoDefsSystemMessageView;
    relatedProfiles: Array<ChatBskyActorDefsProfileViewBasic>;
    constructor(input?: Partial<ChatBskyConvoDefsLogMemberLeave>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): ChatBskyConvoDefsLogMemberLeave;
}
/** Event indicating the viewer muted a convo. Can be direct or group. */
export declare class ChatBskyConvoDefsLogMuteConvo {
    static readonly nsid = "chat.bsky.convo.defs";
    static readonly def = "logMuteConvo";
    static readonly kind: "object";
    $type: string;
    rev: string;
    convoId: string;
    constructor(input?: Partial<ChatBskyConvoDefsLogMuteConvo>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): ChatBskyConvoDefsLogMuteConvo;
}
/** Event indicating a join request was made by the requester. Only requester actor gets this. */
export declare class ChatBskyConvoDefsLogOutgoingJoinRequest {
    static readonly nsid = "chat.bsky.convo.defs";
    static readonly def = "logOutgoingJoinRequest";
    static readonly kind: "object";
    $type: string;
    rev: string;
    convoId: string;
    constructor(input?: Partial<ChatBskyConvoDefsLogOutgoingJoinRequest>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): ChatBskyConvoDefsLogOutgoingJoinRequest;
}
/** Event indicating a convo was read up to a certain message. */
export declare class ChatBskyConvoDefsLogReadConvo {
    static readonly nsid = "chat.bsky.convo.defs";
    static readonly def = "logReadConvo";
    static readonly kind: "object";
    $type: string;
    rev: string;
    convoId: string;
    message: ChatBskyConvoDefsMessageView | ChatBskyConvoDefsDeletedMessageView | ChatBskyConvoDefsSystemMessageView | {
        $type?: string;
    };
    constructor(input?: Partial<ChatBskyConvoDefsLogReadConvo>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): ChatBskyConvoDefsLogReadConvo;
}
/** Event indicating the group owner marked join requests as read. Only the owner gets this. */
export declare class ChatBskyConvoDefsLogReadJoinRequests {
    static readonly nsid = "chat.bsky.convo.defs";
    static readonly def = "logReadJoinRequests";
    static readonly kind: "object";
    $type: string;
    rev: string;
    convoId: string;
    constructor(input?: Partial<ChatBskyConvoDefsLogReadJoinRequests>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): ChatBskyConvoDefsLogReadJoinRequests;
}
/** DEPRECATED: use logReadConvo instead. Event indicating a convo was read up to a certain message. */
export declare class ChatBskyConvoDefsLogReadMessage {
    static readonly nsid = "chat.bsky.convo.defs";
    static readonly def = "logReadMessage";
    static readonly kind: "object";
    $type: string;
    rev: string;
    convoId: string;
    message: ChatBskyConvoDefsMessageView | ChatBskyConvoDefsDeletedMessageView | ChatBskyConvoDefsSystemMessageView | {
        $type?: string;
    };
    constructor(input?: Partial<ChatBskyConvoDefsLogReadMessage>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): ChatBskyConvoDefsLogReadMessage;
}
/** Event indicating a join request was rejected by the viewer. Only the owner gets this. */
export declare class ChatBskyConvoDefsLogRejectJoinRequest {
    static readonly nsid = "chat.bsky.convo.defs";
    static readonly def = "logRejectJoinRequest";
    static readonly kind: "object";
    $type: string;
    rev: string;
    convoId: string;
    member: ChatBskyActorDefsProfileViewBasic;
    constructor(input?: Partial<ChatBskyConvoDefsLogRejectJoinRequest>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): ChatBskyConvoDefsLogRejectJoinRequest;
}
/** Event indicating a member was removed from a group convo. The member who was removed gets a logLeaveConvo (to leave the convo) but not a logRemoveMember (because they already left, so can't see the system message). */
export declare class ChatBskyConvoDefsLogRemoveMember {
    static readonly nsid = "chat.bsky.convo.defs";
    static readonly def = "logRemoveMember";
    static readonly kind: "object";
    $type: string;
    rev: string;
    convoId: string;
    message: ChatBskyConvoDefsSystemMessageView;
    relatedProfiles: Array<ChatBskyActorDefsProfileViewBasic>;
    constructor(input?: Partial<ChatBskyConvoDefsLogRemoveMember>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): ChatBskyConvoDefsLogRemoveMember;
}
/** Event indicating a reaction was removed from a message. */
export declare class ChatBskyConvoDefsLogRemoveReaction {
    static readonly nsid = "chat.bsky.convo.defs";
    static readonly def = "logRemoveReaction";
    static readonly kind: "object";
    $type: string;
    rev: string;
    convoId: string;
    message: ChatBskyConvoDefsMessageView | ChatBskyConvoDefsDeletedMessageView | {
        $type?: string;
    };
    reaction: ChatBskyConvoDefsReactionView;
    relatedProfiles?: Array<ChatBskyActorDefsProfileViewBasic>;
    constructor(input?: Partial<ChatBskyConvoDefsLogRemoveReaction>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): ChatBskyConvoDefsLogRemoveReaction;
}
/** Event indicating a group convo was unlocked. */
export declare class ChatBskyConvoDefsLogUnlockConvo {
    static readonly nsid = "chat.bsky.convo.defs";
    static readonly def = "logUnlockConvo";
    static readonly kind: "object";
    $type: string;
    rev: string;
    convoId: string;
    message: ChatBskyConvoDefsSystemMessageView;
    relatedProfiles: Array<ChatBskyActorDefsProfileViewBasic>;
    constructor(input?: Partial<ChatBskyConvoDefsLogUnlockConvo>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): ChatBskyConvoDefsLogUnlockConvo;
}
/** Event indicating the viewer unmuted a convo. Can be direct or group. */
export declare class ChatBskyConvoDefsLogUnmuteConvo {
    static readonly nsid = "chat.bsky.convo.defs";
    static readonly def = "logUnmuteConvo";
    static readonly kind: "object";
    $type: string;
    rev: string;
    convoId: string;
    constructor(input?: Partial<ChatBskyConvoDefsLogUnmuteConvo>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): ChatBskyConvoDefsLogUnmuteConvo;
}
/** Event indicating a prospective member withdrew their join request. Only the owner gets this. */
export declare class ChatBskyConvoDefsLogWithdrawIncomingJoinRequest {
    static readonly nsid = "chat.bsky.convo.defs";
    static readonly def = "logWithdrawIncomingJoinRequest";
    static readonly kind: "object";
    $type: string;
    rev: string;
    convoId: string;
    member: ChatBskyActorDefsProfileViewBasic;
    constructor(input?: Partial<ChatBskyConvoDefsLogWithdrawIncomingJoinRequest>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): ChatBskyConvoDefsLogWithdrawIncomingJoinRequest;
}
/** Event indicating the viewer withdrew their own join request. Only requester actor gets this. */
export declare class ChatBskyConvoDefsLogWithdrawOutgoingJoinRequest {
    static readonly nsid = "chat.bsky.convo.defs";
    static readonly def = "logWithdrawOutgoingJoinRequest";
    static readonly kind: "object";
    $type: string;
    rev: string;
    convoId: string;
    constructor(input?: Partial<ChatBskyConvoDefsLogWithdrawOutgoingJoinRequest>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): ChatBskyConvoDefsLogWithdrawOutgoingJoinRequest;
}
export declare class ChatBskyConvoDefsMessageAndReactionView {
    static readonly nsid = "chat.bsky.convo.defs";
    static readonly def = "messageAndReactionView";
    static readonly kind: "object";
    $type: string;
    message: ChatBskyConvoDefsMessageView;
    reaction: ChatBskyConvoDefsReactionView;
    constructor(input?: Partial<ChatBskyConvoDefsMessageAndReactionView>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): ChatBskyConvoDefsMessageAndReactionView;
}
/** Placeholder embedded in place of a reply's parent message when that parent was sent before the viewer joined the group convo. The viewer has no access to that history, so no message data is carried. */
export declare class ChatBskyConvoDefsMessageBeforeUserJoinedGroupView {
    static readonly nsid = "chat.bsky.convo.defs";
    static readonly def = "messageBeforeUserJoinedGroupView";
    static readonly kind: "object";
    $type: string;
    constructor(input?: Partial<ChatBskyConvoDefsMessageBeforeUserJoinedGroupView>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): ChatBskyConvoDefsMessageBeforeUserJoinedGroupView;
}
export declare class ChatBskyConvoDefsMessageInput {
    static readonly nsid = "chat.bsky.convo.defs";
    static readonly def = "messageInput";
    static readonly kind: "object";
    $type: string;
    text: string;
    facets?: Array<AppBskyRichtextFacet>;
    embed?: AppBskyEmbedRecord | ChatBskyEmbedJoinLink | {
        $type?: string;
    };
    replyTo?: ChatBskyConvoDefsReplyRef;
    constructor(input?: Partial<ChatBskyConvoDefsMessageInput>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): ChatBskyConvoDefsMessageInput;
}
export declare class ChatBskyConvoDefsMessageRef {
    static readonly nsid = "chat.bsky.convo.defs";
    static readonly def = "messageRef";
    static readonly kind: "object";
    $type: string;
    did: string;
    convoId: string;
    messageId: string;
    constructor(input?: Partial<ChatBskyConvoDefsMessageRef>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): ChatBskyConvoDefsMessageRef;
}
export declare class ChatBskyConvoDefsMessageView {
    static readonly nsid = "chat.bsky.convo.defs";
    static readonly def = "messageView";
    static readonly kind: "object";
    $type: string;
    id: string;
    rev: string;
    text: string;
    facets?: Array<AppBskyRichtextFacet>;
    embed?: AppBskyEmbedRecordView | ChatBskyEmbedJoinLinkView | {
        $type?: string;
    };
    reactions?: Array<ChatBskyConvoDefsReactionView>;
    replyTo?: ChatBskyConvoDefsMessageView | ChatBskyConvoDefsDeletedMessageView | ChatBskyConvoDefsMessageBeforeUserJoinedGroupView | {
        $type?: string;
    };
    sender: ChatBskyConvoDefsMessageViewSender;
    sentAt: string;
    constructor(input?: Partial<ChatBskyConvoDefsMessageView>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): ChatBskyConvoDefsMessageView;
}
export declare class ChatBskyConvoDefsMessageViewSender {
    static readonly nsid = "chat.bsky.convo.defs";
    static readonly def = "messageViewSender";
    static readonly kind: "object";
    $type: string;
    did: string;
    constructor(input?: Partial<ChatBskyConvoDefsMessageViewSender>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): ChatBskyConvoDefsMessageViewSender;
}
export declare class ChatBskyConvoDefsReactionView {
    static readonly nsid = "chat.bsky.convo.defs";
    static readonly def = "reactionView";
    static readonly kind: "object";
    $type: string;
    value: string;
    sender: ChatBskyConvoDefsReactionViewSender;
    createdAt: string;
    constructor(input?: Partial<ChatBskyConvoDefsReactionView>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): ChatBskyConvoDefsReactionView;
}
export declare class ChatBskyConvoDefsReactionViewSender {
    static readonly nsid = "chat.bsky.convo.defs";
    static readonly def = "reactionViewSender";
    static readonly kind: "object";
    $type: string;
    did: string;
    constructor(input?: Partial<ChatBskyConvoDefsReactionViewSender>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): ChatBskyConvoDefsReactionViewSender;
}
/** A reference to another message within the same convo, used to indicate that a message is a reply to it. */
export declare class ChatBskyConvoDefsReplyRef {
    static readonly nsid = "chat.bsky.convo.defs";
    static readonly def = "replyRef";
    static readonly kind: "object";
    $type: string;
    messageId: string;
    constructor(input?: Partial<ChatBskyConvoDefsReplyRef>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): ChatBskyConvoDefsReplyRef;
}
/** System message indicating a user was added to the group convo. */
export declare class ChatBskyConvoDefsSystemMessageDataAddMember {
    static readonly nsid = "chat.bsky.convo.defs";
    static readonly def = "systemMessageDataAddMember";
    static readonly kind: "object";
    $type: string;
    member: ChatBskyConvoDefsSystemMessageReferredUser;
    role: "owner" | "standard" | (string & {});
    addedBy: ChatBskyConvoDefsSystemMessageReferredUser;
    constructor(input?: Partial<ChatBskyConvoDefsSystemMessageDataAddMember>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): ChatBskyConvoDefsSystemMessageDataAddMember;
}
/** System message indicating the group join link was created. */
export declare class ChatBskyConvoDefsSystemMessageDataCreateJoinLink {
    static readonly nsid = "chat.bsky.convo.defs";
    static readonly def = "systemMessageDataCreateJoinLink";
    static readonly kind: "object";
    $type: string;
    constructor(input?: Partial<ChatBskyConvoDefsSystemMessageDataCreateJoinLink>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): ChatBskyConvoDefsSystemMessageDataCreateJoinLink;
}
/** System message indicating the group join link was disabled. */
export declare class ChatBskyConvoDefsSystemMessageDataDisableJoinLink {
    static readonly nsid = "chat.bsky.convo.defs";
    static readonly def = "systemMessageDataDisableJoinLink";
    static readonly kind: "object";
    $type: string;
    constructor(input?: Partial<ChatBskyConvoDefsSystemMessageDataDisableJoinLink>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): ChatBskyConvoDefsSystemMessageDataDisableJoinLink;
}
/** System message indicating the group info was edited. */
export declare class ChatBskyConvoDefsSystemMessageDataEditGroup {
    static readonly nsid = "chat.bsky.convo.defs";
    static readonly def = "systemMessageDataEditGroup";
    static readonly kind: "object";
    $type: string;
    oldName?: string;
    newName?: string;
    constructor(input?: Partial<ChatBskyConvoDefsSystemMessageDataEditGroup>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): ChatBskyConvoDefsSystemMessageDataEditGroup;
}
/** System message indicating the group join link was edited. */
export declare class ChatBskyConvoDefsSystemMessageDataEditJoinLink {
    static readonly nsid = "chat.bsky.convo.defs";
    static readonly def = "systemMessageDataEditJoinLink";
    static readonly kind: "object";
    $type: string;
    constructor(input?: Partial<ChatBskyConvoDefsSystemMessageDataEditJoinLink>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): ChatBskyConvoDefsSystemMessageDataEditJoinLink;
}
/** System message indicating the group join link was enabled. */
export declare class ChatBskyConvoDefsSystemMessageDataEnableJoinLink {
    static readonly nsid = "chat.bsky.convo.defs";
    static readonly def = "systemMessageDataEnableJoinLink";
    static readonly kind: "object";
    $type: string;
    constructor(input?: Partial<ChatBskyConvoDefsSystemMessageDataEnableJoinLink>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): ChatBskyConvoDefsSystemMessageDataEnableJoinLink;
}
/** System message indicating the group convo was locked. */
export declare class ChatBskyConvoDefsSystemMessageDataLockConvo {
    static readonly nsid = "chat.bsky.convo.defs";
    static readonly def = "systemMessageDataLockConvo";
    static readonly kind: "object";
    $type: string;
    lockedBy: ChatBskyConvoDefsSystemMessageReferredUser;
    constructor(input?: Partial<ChatBskyConvoDefsSystemMessageDataLockConvo>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): ChatBskyConvoDefsSystemMessageDataLockConvo;
}
/** System message indicating the group convo was locked permanently. */
export declare class ChatBskyConvoDefsSystemMessageDataLockConvoPermanently {
    static readonly nsid = "chat.bsky.convo.defs";
    static readonly def = "systemMessageDataLockConvoPermanently";
    static readonly kind: "object";
    $type: string;
    lockedBy: ChatBskyConvoDefsSystemMessageReferredUser;
    constructor(input?: Partial<ChatBskyConvoDefsSystemMessageDataLockConvoPermanently>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): ChatBskyConvoDefsSystemMessageDataLockConvoPermanently;
}
/** System message indicating a user joined the group convo via join link. */
export declare class ChatBskyConvoDefsSystemMessageDataMemberJoin {
    static readonly nsid = "chat.bsky.convo.defs";
    static readonly def = "systemMessageDataMemberJoin";
    static readonly kind: "object";
    $type: string;
    member: ChatBskyConvoDefsSystemMessageReferredUser;
    role: "owner" | "standard" | (string & {});
    approvedBy?: ChatBskyConvoDefsSystemMessageReferredUser;
    constructor(input?: Partial<ChatBskyConvoDefsSystemMessageDataMemberJoin>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): ChatBskyConvoDefsSystemMessageDataMemberJoin;
}
/** System message indicating a user voluntarily left the group convo. */
export declare class ChatBskyConvoDefsSystemMessageDataMemberLeave {
    static readonly nsid = "chat.bsky.convo.defs";
    static readonly def = "systemMessageDataMemberLeave";
    static readonly kind: "object";
    $type: string;
    member: ChatBskyConvoDefsSystemMessageReferredUser;
    constructor(input?: Partial<ChatBskyConvoDefsSystemMessageDataMemberLeave>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): ChatBskyConvoDefsSystemMessageDataMemberLeave;
}
/** System message indicating a user was removed from the group convo. */
export declare class ChatBskyConvoDefsSystemMessageDataRemoveMember {
    static readonly nsid = "chat.bsky.convo.defs";
    static readonly def = "systemMessageDataRemoveMember";
    static readonly kind: "object";
    $type: string;
    member: ChatBskyConvoDefsSystemMessageReferredUser;
    removedBy: ChatBskyConvoDefsSystemMessageReferredUser;
    constructor(input?: Partial<ChatBskyConvoDefsSystemMessageDataRemoveMember>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): ChatBskyConvoDefsSystemMessageDataRemoveMember;
}
/** System message indicating the group convo was unlocked. */
export declare class ChatBskyConvoDefsSystemMessageDataUnlockConvo {
    static readonly nsid = "chat.bsky.convo.defs";
    static readonly def = "systemMessageDataUnlockConvo";
    static readonly kind: "object";
    $type: string;
    unlockedBy: ChatBskyConvoDefsSystemMessageReferredUser;
    constructor(input?: Partial<ChatBskyConvoDefsSystemMessageDataUnlockConvo>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): ChatBskyConvoDefsSystemMessageDataUnlockConvo;
}
export declare class ChatBskyConvoDefsSystemMessageReferredUser {
    static readonly nsid = "chat.bsky.convo.defs";
    static readonly def = "systemMessageReferredUser";
    static readonly kind: "object";
    $type: string;
    did: string;
    constructor(input?: Partial<ChatBskyConvoDefsSystemMessageReferredUser>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): ChatBskyConvoDefsSystemMessageReferredUser;
}
export declare class ChatBskyConvoDefsSystemMessageView {
    static readonly nsid = "chat.bsky.convo.defs";
    static readonly def = "systemMessageView";
    static readonly kind: "object";
    $type: string;
    id: string;
    rev: string;
    sentAt: string;
    data: ChatBskyConvoDefsSystemMessageDataAddMember | ChatBskyConvoDefsSystemMessageDataRemoveMember | ChatBskyConvoDefsSystemMessageDataMemberJoin | ChatBskyConvoDefsSystemMessageDataMemberLeave | ChatBskyConvoDefsSystemMessageDataLockConvo | ChatBskyConvoDefsSystemMessageDataUnlockConvo | ChatBskyConvoDefsSystemMessageDataLockConvoPermanently | ChatBskyConvoDefsSystemMessageDataEditGroup | ChatBskyConvoDefsSystemMessageDataCreateJoinLink | ChatBskyConvoDefsSystemMessageDataEditJoinLink | ChatBskyConvoDefsSystemMessageDataEnableJoinLink | ChatBskyConvoDefsSystemMessageDataDisableJoinLink | {
        $type?: string;
    };
    constructor(input?: Partial<ChatBskyConvoDefsSystemMessageView>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): ChatBskyConvoDefsSystemMessageView;
}
/** Marks a message as deleted for the viewer, so they won't see that message in future enumerations. */
export declare class ChatBskyConvoDeleteMessageForSelf {
    static readonly nsid = "chat.bsky.convo.deleteMessageForSelf";
    static readonly def = "main";
    static readonly kind: "procedure";
    static readonly http: "POST";
    static readonly errorNames: readonly ["InvalidConvo", "MessageDeleteNotAllowed"];
    convoId: string;
    messageId: string;
    constructor(input?: Partial<ChatBskyConvoDeleteMessageForSelf>);
    toParams(): Record<string, unknown>;
    toBody(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): ChatBskyConvoDeleteMessageForSelf;
}
export type ChatBskyConvoDeleteMessageForSelfOutput = ChatBskyConvoDefsDeletedMessageView;
/** Gets an existing conversation by its ID. */
export declare class ChatBskyConvoGetConvo {
    static readonly nsid = "chat.bsky.convo.getConvo";
    static readonly def = "main";
    static readonly kind: "query";
    static readonly http: "GET";
    static readonly errorNames: readonly ["InvalidConvo"];
    convoId: string;
    constructor(input?: Partial<ChatBskyConvoGetConvo>);
    toParams(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): ChatBskyConvoGetConvo;
}
export type ChatBskyConvoGetConvoOutput = {
    convo: ChatBskyConvoDefsConvoView;
};
/** Check whether the requester and the other members can start a 1-1 chat. Only applicable to direct (non-group) conversations. If an existing convo is found for these members, it is returned. Does not create a new convo if it doesn't exist. */
export declare class ChatBskyConvoGetConvoAvailability {
    static readonly nsid = "chat.bsky.convo.getConvoAvailability";
    static readonly def = "main";
    static readonly kind: "query";
    static readonly http: "GET";
    static readonly errorNames: readonly [];
    members: Array<string>;
    constructor(input?: Partial<ChatBskyConvoGetConvoAvailability>);
    toParams(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): ChatBskyConvoGetConvoAvailability;
}
export type ChatBskyConvoGetConvoAvailabilityOutput = {
    canChat: boolean;
    convo?: ChatBskyConvoDefsConvoView;
};
/** Get or create a 1-1 conversation for the given members. Always returns the same direct (non-group) conversation. To create a group conversation, use createGroup. */
export declare class ChatBskyConvoGetConvoForMembers {
    static readonly nsid = "chat.bsky.convo.getConvoForMembers";
    static readonly def = "main";
    static readonly kind: "query";
    static readonly http: "GET";
    static readonly errorNames: readonly ["AccountSuspended", "BlockedActor", "BlockedSubject", "MessagesDisabled", "NotFollowedBySender", "RecipientNotFound"];
    members: Array<string>;
    constructor(input?: Partial<ChatBskyConvoGetConvoForMembers>);
    toParams(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): ChatBskyConvoGetConvoForMembers;
}
export type ChatBskyConvoGetConvoForMembersOutput = {
    convo: ChatBskyConvoDefsConvoView;
};
/** Returns a paginated list of members from a conversation. */
export declare class ChatBskyConvoGetConvoMembers {
    static readonly nsid = "chat.bsky.convo.getConvoMembers";
    static readonly def = "main";
    static readonly kind: "query";
    static readonly http: "GET";
    static readonly errorNames: readonly ["InvalidConvo"];
    convoId: string;
    limit?: number;
    cursor?: string;
    constructor(input?: Partial<ChatBskyConvoGetConvoMembers>);
    toParams(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): ChatBskyConvoGetConvoMembers;
}
export type ChatBskyConvoGetConvoMembersOutput = {
    cursor?: string;
    members: Array<ChatBskyActorDefsProfileViewBasic>;
};
export declare class ChatBskyConvoGetLog {
    static readonly nsid = "chat.bsky.convo.getLog";
    static readonly def = "main";
    static readonly kind: "query";
    static readonly http: "GET";
    static readonly errorNames: readonly [];
    cursor?: string;
    constructor(input?: Partial<ChatBskyConvoGetLog>);
    toParams(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): ChatBskyConvoGetLog;
}
export type ChatBskyConvoGetLogOutput = {
    cursor?: string;
    logs: Array<(ChatBskyConvoDefsLogBeginConvo | ChatBskyConvoDefsLogAcceptConvo | ChatBskyConvoDefsLogLeaveConvo | ChatBskyConvoDefsLogMuteConvo | ChatBskyConvoDefsLogUnmuteConvo | ChatBskyConvoDefsLogCreateMessage | ChatBskyConvoDefsLogDeleteMessage | ChatBskyConvoDefsLogReadMessage | ChatBskyConvoDefsLogAddReaction | ChatBskyConvoDefsLogRemoveReaction | ChatBskyConvoDefsLogReadConvo | ChatBskyConvoDefsLogAddMember | ChatBskyConvoDefsLogRemoveMember | ChatBskyConvoDefsLogMemberJoin | ChatBskyConvoDefsLogMemberLeave | ChatBskyConvoDefsLogLockConvo | ChatBskyConvoDefsLogUnlockConvo | ChatBskyConvoDefsLogLockConvoPermanently | ChatBskyConvoDefsLogEditGroup | ChatBskyConvoDefsLogCreateJoinLink | ChatBskyConvoDefsLogEditJoinLink | ChatBskyConvoDefsLogEnableJoinLink | ChatBskyConvoDefsLogDisableJoinLink | ChatBskyConvoDefsLogIncomingJoinRequest | ChatBskyConvoDefsLogApproveJoinRequest | ChatBskyConvoDefsLogRejectJoinRequest | ChatBskyConvoDefsLogOutgoingJoinRequest | ChatBskyConvoDefsLogWithdrawIncomingJoinRequest | ChatBskyConvoDefsLogWithdrawOutgoingJoinRequest | ChatBskyConvoDefsLogReadJoinRequests | {
        $type?: string;
    })>;
};
/** Returns a page of messages from a conversation. */
export declare class ChatBskyConvoGetMessages {
    static readonly nsid = "chat.bsky.convo.getMessages";
    static readonly def = "main";
    static readonly kind: "query";
    static readonly http: "GET";
    static readonly errorNames: readonly ["InvalidConvo"];
    convoId: string;
    limit?: number;
    cursor?: string;
    constructor(input?: Partial<ChatBskyConvoGetMessages>);
    toParams(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): ChatBskyConvoGetMessages;
}
export type ChatBskyConvoGetMessagesOutput = {
    cursor?: string;
    messages: Array<(ChatBskyConvoDefsMessageView | ChatBskyConvoDefsDeletedMessageView | ChatBskyConvoDefsSystemMessageView | {
        $type?: string;
    })>;
    relatedProfiles?: Array<ChatBskyActorDefsProfileViewBasic>;
};
/** Returns unread conversation counts for conversations that are unlocked, not muted, split by convo status. Direct convos are excluded when a block relationship exists between the actor and the other member, or when the other member's account */
export declare class ChatBskyConvoGetUnreadCounts {
    static readonly nsid = "chat.bsky.convo.getUnreadCounts";
    static readonly def = "main";
    static readonly kind: "query";
    static readonly http: "GET";
    static readonly errorNames: readonly [];
    includeGroupChats?: boolean;
    constructor(input?: Partial<ChatBskyConvoGetUnreadCounts>);
    toParams(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): ChatBskyConvoGetUnreadCounts;
}
export type ChatBskyConvoGetUnreadCountsOutput = {
    unreadAcceptedConvos: number;
    unreadRequestConvos: number;
};
/** Returns a page of incoming conversation requests for the user. Direct convo requests are returned as convoView; group join requests made by the user are returned as joinRequestConvoView. */
export declare class ChatBskyConvoListConvoRequests {
    static readonly nsid = "chat.bsky.convo.listConvoRequests";
    static readonly def = "main";
    static readonly kind: "query";
    static readonly http: "GET";
    static readonly errorNames: readonly [];
    limit?: number;
    cursor?: string;
    constructor(input?: Partial<ChatBskyConvoListConvoRequests>);
    toParams(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): ChatBskyConvoListConvoRequests;
}
export type ChatBskyConvoListConvoRequestsOutput = {
    cursor?: string;
    requests: Array<(ChatBskyConvoDefsConvoView | ChatBskyGroupDefsJoinRequestConvoView | {
        $type?: string;
    })>;
};
/** Returns a page of conversations (direct or group) for the user. */
export declare class ChatBskyConvoListConvos {
    static readonly nsid = "chat.bsky.convo.listConvos";
    static readonly def = "main";
    static readonly kind: "query";
    static readonly http: "GET";
    static readonly errorNames: readonly [];
    limit?: number;
    cursor?: string;
    readState?: "unread" | (string & {});
    status?: "request" | "accepted" | (string & {});
    kind?: "direct" | "group" | (string & {});
    lockStatus?: "unlocked" | "locked" | "locked-permanently" | (string & {});
    constructor(input?: Partial<ChatBskyConvoListConvos>);
    toParams(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): ChatBskyConvoListConvos;
}
export type ChatBskyConvoListConvosOutput = {
    cursor?: string;
    convos: Array<ChatBskyConvoDefsConvoView>;
};
/** Locks a group convo so no more content (messages, reactions) can be added to it. */
export declare class ChatBskyConvoLockConvo {
    static readonly nsid = "chat.bsky.convo.lockConvo";
    static readonly def = "main";
    static readonly kind: "procedure";
    static readonly http: "POST";
    static readonly errorNames: readonly ["ConvoLocked", "InvalidConvo", "InsufficientRole"];
    convoId: string;
    constructor(input?: Partial<ChatBskyConvoLockConvo>);
    toParams(): Record<string, unknown>;
    toBody(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): ChatBskyConvoLockConvo;
}
export type ChatBskyConvoLockConvoOutput = {
    convo: ChatBskyConvoDefsConvoView;
};
/** Mutes a conversation, preventing notifications related to it. */
export declare class ChatBskyConvoMuteConvo {
    static readonly nsid = "chat.bsky.convo.muteConvo";
    static readonly def = "main";
    static readonly kind: "procedure";
    static readonly http: "POST";
    static readonly errorNames: readonly ["InvalidConvo"];
    convoId: string;
    constructor(input?: Partial<ChatBskyConvoMuteConvo>);
    toParams(): Record<string, unknown>;
    toBody(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): ChatBskyConvoMuteConvo;
}
export type ChatBskyConvoMuteConvoOutput = {
    convo: ChatBskyConvoDefsConvoView;
};
/** Removes an emoji reaction from a message. Requires authentication. It is idempotent, so multiple calls from the same user with the same emoji result in that reaction not being present, even if it already wasn't. */
export declare class ChatBskyConvoRemoveReaction {
    static readonly nsid = "chat.bsky.convo.removeReaction";
    static readonly def = "main";
    static readonly kind: "procedure";
    static readonly http: "POST";
    static readonly errorNames: readonly ["InvalidConvo", "ReactionNotAllowed", "ReactionMessageDeleted", "ReactionInvalidValue"];
    convoId: string;
    messageId: string;
    value: string;
    constructor(input?: Partial<ChatBskyConvoRemoveReaction>);
    toParams(): Record<string, unknown>;
    toBody(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): ChatBskyConvoRemoveReaction;
}
export type ChatBskyConvoRemoveReactionOutput = {
    message: ChatBskyConvoDefsMessageView;
};
/** Sends a message to a conversation. */
export declare class ChatBskyConvoSendMessage {
    static readonly nsid = "chat.bsky.convo.sendMessage";
    static readonly def = "main";
    static readonly kind: "procedure";
    static readonly http: "POST";
    static readonly errorNames: readonly ["ConvoLocked", "InvalidConvo", "ReplyTargetNotFound"];
    convoId: string;
    message: ChatBskyConvoDefsMessageInput;
    constructor(input?: Partial<ChatBskyConvoSendMessage>);
    toParams(): Record<string, unknown>;
    toBody(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): ChatBskyConvoSendMessage;
}
export type ChatBskyConvoSendMessageOutput = ChatBskyConvoDefsMessageView;
/** Sends a batch of messages to a conversation. */
export declare class ChatBskyConvoSendMessageBatch {
    static readonly nsid = "chat.bsky.convo.sendMessageBatch";
    static readonly def = "main";
    static readonly kind: "procedure";
    static readonly http: "POST";
    static readonly errorNames: readonly ["ConvoLocked", "InvalidConvo", "ReplyTargetNotFound"];
    items: Array<ChatBskyConvoSendMessageBatchBatchItem>;
    constructor(input?: Partial<ChatBskyConvoSendMessageBatch>);
    toParams(): Record<string, unknown>;
    toBody(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): ChatBskyConvoSendMessageBatch;
}
export type ChatBskyConvoSendMessageBatchOutput = {
    items: Array<ChatBskyConvoDefsMessageView>;
};
export declare class ChatBskyConvoSendMessageBatchBatchItem {
    static readonly nsid = "chat.bsky.convo.sendMessageBatch";
    static readonly def = "batchItem";
    static readonly kind: "object";
    $type: string;
    convoId: string;
    message: ChatBskyConvoDefsMessageInput;
    constructor(input?: Partial<ChatBskyConvoSendMessageBatchBatchItem>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): ChatBskyConvoSendMessageBatchBatchItem;
}
/** Unlocks a group convo so it is able to receive new content. */
export declare class ChatBskyConvoUnlockConvo {
    static readonly nsid = "chat.bsky.convo.unlockConvo";
    static readonly def = "main";
    static readonly kind: "procedure";
    static readonly http: "POST";
    static readonly errorNames: readonly ["InvalidConvo", "InsufficientRole", "ConvoLockedByModeration"];
    convoId: string;
    constructor(input?: Partial<ChatBskyConvoUnlockConvo>);
    toParams(): Record<string, unknown>;
    toBody(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): ChatBskyConvoUnlockConvo;
}
export type ChatBskyConvoUnlockConvoOutput = {
    convo: ChatBskyConvoDefsConvoView;
};
/** Unmutes a conversation, allowing notifications related to it. */
export declare class ChatBskyConvoUnmuteConvo {
    static readonly nsid = "chat.bsky.convo.unmuteConvo";
    static readonly def = "main";
    static readonly kind: "procedure";
    static readonly http: "POST";
    static readonly errorNames: readonly ["InvalidConvo"];
    convoId: string;
    constructor(input?: Partial<ChatBskyConvoUnmuteConvo>);
    toParams(): Record<string, unknown>;
    toBody(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): ChatBskyConvoUnmuteConvo;
}
export type ChatBskyConvoUnmuteConvoOutput = {
    convo: ChatBskyConvoDefsConvoView;
};
/** Sets conversations from a user as read to the latest message, with filters. */
export declare class ChatBskyConvoUpdateAllRead {
    static readonly nsid = "chat.bsky.convo.updateAllRead";
    static readonly def = "main";
    static readonly kind: "procedure";
    static readonly http: "POST";
    static readonly errorNames: readonly [];
    status?: "request" | "accepted" | (string & {});
    constructor(input?: Partial<ChatBskyConvoUpdateAllRead>);
    toParams(): Record<string, unknown>;
    toBody(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): ChatBskyConvoUpdateAllRead;
}
export type ChatBskyConvoUpdateAllReadOutput = {
    updatedCount: number;
};
/** Updates the read state of a conversation from, optionally specifying the last read message. */
export declare class ChatBskyConvoUpdateRead {
    static readonly nsid = "chat.bsky.convo.updateRead";
    static readonly def = "main";
    static readonly kind: "procedure";
    static readonly http: "POST";
    static readonly errorNames: readonly ["InvalidConvo"];
    convoId: string;
    messageId?: string;
    constructor(input?: Partial<ChatBskyConvoUpdateRead>);
    toParams(): Record<string, unknown>;
    toBody(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): ChatBskyConvoUpdateRead;
}
export type ChatBskyConvoUpdateReadOutput = {
    convo: ChatBskyConvoDefsConvoView;
};
/** A join link embedded in a chat message. */
export declare class ChatBskyEmbedJoinLink {
    static readonly nsid = "chat.bsky.embed.joinLink";
    static readonly def = "main";
    static readonly kind: "object";
    $type: string;
    code: string;
    constructor(input?: Partial<ChatBskyEmbedJoinLink>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): ChatBskyEmbedJoinLink;
}
export declare class ChatBskyEmbedJoinLinkView {
    static readonly nsid = "chat.bsky.embed.joinLink";
    static readonly def = "view";
    static readonly kind: "object";
    $type: string;
    joinLinkPreview: ChatBskyGroupDefsJoinLinkPreviewView | ChatBskyGroupDefsDisabledJoinLinkPreviewView | ChatBskyGroupDefsInvalidJoinLinkPreviewView | {
        $type?: string;
    };
    constructor(input?: Partial<ChatBskyEmbedJoinLinkView>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): ChatBskyEmbedJoinLinkView;
}
/** Adds members to a group. The members are added in 'request' status, so they have to accept it. This creates convo memberships. */
export declare class ChatBskyGroupAddMembers {
    static readonly nsid = "chat.bsky.group.addMembers";
    static readonly def = "main";
    static readonly kind: "procedure";
    static readonly http: "POST";
    static readonly errorNames: readonly ["AccountSuspended", "BlockedActor", "BlockedSubject", "ConvoLocked", "InsufficientRole", "InvalidConvo", "MemberLimitReached", "NotFollowedBySender", "RecipientNotFound", "UserForbidsGroups"];
    convoId: string;
    members: Array<string>;
    constructor(input?: Partial<ChatBskyGroupAddMembers>);
    toParams(): Record<string, unknown>;
    toBody(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): ChatBskyGroupAddMembers;
}
export type ChatBskyGroupAddMembersOutput = {
    convo: ChatBskyConvoDefsConvoView;
    addedMembers?: Array<ChatBskyActorDefsProfileViewBasic>;
};
/** Approves a request to join a group (via join link) the user owns. Action taken by the group owner. */
export declare class ChatBskyGroupApproveJoinRequest {
    static readonly nsid = "chat.bsky.group.approveJoinRequest";
    static readonly def = "main";
    static readonly kind: "procedure";
    static readonly http: "POST";
    static readonly errorNames: readonly ["InvalidConvo", "InsufficientRole", "MemberLimitReached"];
    convoId: string;
    member: string;
    constructor(input?: Partial<ChatBskyGroupApproveJoinRequest>);
    toParams(): Record<string, unknown>;
    toBody(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): ChatBskyGroupApproveJoinRequest;
}
export type ChatBskyGroupApproveJoinRequestOutput = {
    convo: ChatBskyConvoDefsConvoView;
};
/** Creates a group convo, specifying the members to be added to it. Unlike getConvoForMembers, this isn't idempotent. It will create new groups even if the membership is identical to pre-existing groups. Will create 'request' membership for al */
export declare class ChatBskyGroupCreateGroup {
    static readonly nsid = "chat.bsky.group.createGroup";
    static readonly def = "main";
    static readonly kind: "procedure";
    static readonly http: "POST";
    static readonly errorNames: readonly ["AccountSuspended", "BlockedActor", "BlockedSubject", "NewAccountCannotCreateGroup", "NotFollowedBySender", "RecipientNotFound", "UserForbidsGroups"];
    members: Array<string>;
    name: string;
    constructor(input?: Partial<ChatBskyGroupCreateGroup>);
    toParams(): Record<string, unknown>;
    toBody(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): ChatBskyGroupCreateGroup;
}
export type ChatBskyGroupCreateGroupOutput = {
    convo: ChatBskyConvoDefsConvoView;
};
/** Creates a join link for the group convo. */
export declare class ChatBskyGroupCreateJoinLink {
    static readonly nsid = "chat.bsky.group.createJoinLink";
    static readonly def = "main";
    static readonly kind: "procedure";
    static readonly http: "POST";
    static readonly errorNames: readonly ["EnabledJoinLinkAlreadyExists", "InvalidConvo", "InsufficientRole"];
    convoId: string;
    requireApproval?: boolean;
    joinRule: "anyone" | "followedByOwner" | (string & {});
    constructor(input?: Partial<ChatBskyGroupCreateJoinLink>);
    toParams(): Record<string, unknown>;
    toBody(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): ChatBskyGroupCreateJoinLink;
}
export type ChatBskyGroupCreateJoinLinkOutput = {
    joinLink: ChatBskyGroupDefsJoinLinkView;
};
/** Preview for a disabled join link. Carries only the code so clients can correlate with the input and render a disabled state. */
export declare class ChatBskyGroupDefsDisabledJoinLinkPreviewView {
    static readonly nsid = "chat.bsky.group.defs";
    static readonly def = "disabledJoinLinkPreviewView";
    static readonly kind: "object";
    $type: string;
    code: string;
    constructor(input?: Partial<ChatBskyGroupDefsDisabledJoinLinkPreviewView>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): ChatBskyGroupDefsDisabledJoinLinkPreviewView;
}
/** Preview for a join link code that does not map to an existing link. Carries only the code so clients can correlate with the input and render an invalid state. */
export declare class ChatBskyGroupDefsInvalidJoinLinkPreviewView {
    static readonly nsid = "chat.bsky.group.defs";
    static readonly def = "invalidJoinLinkPreviewView";
    static readonly kind: "object";
    $type: string;
    code: string;
    constructor(input?: Partial<ChatBskyGroupDefsInvalidJoinLinkPreviewView>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): ChatBskyGroupDefsInvalidJoinLinkPreviewView;
}
/** Preview that can be shown in feeds, including to unauthenticated viewers. */
export declare class ChatBskyGroupDefsJoinLinkPreviewView {
    static readonly nsid = "chat.bsky.group.defs";
    static readonly def = "joinLinkPreviewView";
    static readonly kind: "object";
    $type: string;
    convoId: string;
    code: string;
    name: string;
    owner: ChatBskyActorDefsProfileViewBasic;
    memberCount: number;
    memberLimit: number;
    requireApproval: boolean;
    joinRule: "anyone" | "followedByOwner" | (string & {});
    convo?: ChatBskyConvoDefsConvoView;
    viewer?: ChatBskyGroupDefsJoinLinkViewerState;
    constructor(input?: Partial<ChatBskyGroupDefsJoinLinkPreviewView>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): ChatBskyGroupDefsJoinLinkPreviewView;
}
/** Join link view to be used within a group view, so the convo is surrounding, not specified inside this view. */
export declare class ChatBskyGroupDefsJoinLinkView {
    static readonly nsid = "chat.bsky.group.defs";
    static readonly def = "joinLinkView";
    static readonly kind: "object";
    $type: string;
    code: string;
    enabledStatus: "enabled" | "disabled" | (string & {});
    requireApproval: boolean;
    joinRule: "anyone" | "followedByOwner" | (string & {});
    createdAt: string;
    constructor(input?: Partial<ChatBskyGroupDefsJoinLinkView>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): ChatBskyGroupDefsJoinLinkView;
}
export declare class ChatBskyGroupDefsJoinLinkViewerState {
    static readonly nsid = "chat.bsky.group.defs";
    static readonly def = "joinLinkViewerState";
    static readonly kind: "object";
    $type: string;
    requestedAt?: string;
    constructor(input?: Partial<ChatBskyGroupDefsJoinLinkViewerState>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): ChatBskyGroupDefsJoinLinkViewerState;
}
/** A join request from the perspective of the requester, including enough group context to render the request in a list (e.g. group name, owner, member count). */
export declare class ChatBskyGroupDefsJoinRequestConvoView {
    static readonly nsid = "chat.bsky.group.defs";
    static readonly def = "joinRequestConvoView";
    static readonly kind: "object";
    $type: string;
    convoId: string;
    name: string;
    owner: ChatBskyActorDefsProfileViewBasic;
    memberCount: number;
    memberLimit: number;
    viewer: ChatBskyGroupDefsJoinLinkViewerState;
    constructor(input?: Partial<ChatBskyGroupDefsJoinRequestConvoView>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): ChatBskyGroupDefsJoinRequestConvoView;
}
/** A join request from the perspective of the group owner. */
export declare class ChatBskyGroupDefsJoinRequestView {
    static readonly nsid = "chat.bsky.group.defs";
    static readonly def = "joinRequestView";
    static readonly kind: "object";
    $type: string;
    convoId: string;
    requestedBy: ChatBskyActorDefsProfileViewBasic;
    requestedAt: string;
    constructor(input?: Partial<ChatBskyGroupDefsJoinRequestView>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): ChatBskyGroupDefsJoinRequestView;
}
export declare class ChatBskyGroupDefsJoinRule {
    static readonly nsid = "chat.bsky.group.defs";
    static readonly def = "joinRule";
    static readonly kind: "string";
    static readonly knownValues: readonly ["anyone", "followedByOwner"];
    static includes(value: string): boolean;
    private constructor();
}
export declare class ChatBskyGroupDefsLinkEnabledStatus {
    static readonly nsid = "chat.bsky.group.defs";
    static readonly def = "linkEnabledStatus";
    static readonly kind: "string";
    static readonly knownValues: readonly ["enabled", "disabled"];
    static includes(value: string): boolean;
    private constructor();
}
/** Disables the active join link for the group convo. */
export declare class ChatBskyGroupDisableJoinLink {
    static readonly nsid = "chat.bsky.group.disableJoinLink";
    static readonly def = "main";
    static readonly kind: "procedure";
    static readonly http: "POST";
    static readonly errorNames: readonly ["InvalidConvo", "InsufficientRole", "NoJoinLink"];
    convoId: string;
    constructor(input?: Partial<ChatBskyGroupDisableJoinLink>);
    toParams(): Record<string, unknown>;
    toBody(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): ChatBskyGroupDisableJoinLink;
}
export type ChatBskyGroupDisableJoinLinkOutput = {
    joinLink: ChatBskyGroupDefsJoinLinkView;
};
/** Edits group settings. */
export declare class ChatBskyGroupEditGroup {
    static readonly nsid = "chat.bsky.group.editGroup";
    static readonly def = "main";
    static readonly kind: "procedure";
    static readonly http: "POST";
    static readonly errorNames: readonly ["ConvoLocked", "InvalidConvo", "InsufficientRole"];
    convoId: string;
    name: string;
    constructor(input?: Partial<ChatBskyGroupEditGroup>);
    toParams(): Record<string, unknown>;
    toBody(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): ChatBskyGroupEditGroup;
}
export type ChatBskyGroupEditGroupOutput = {
    convo: ChatBskyConvoDefsConvoView;
};
/** Edits the existing join link settings for the group convo. */
export declare class ChatBskyGroupEditJoinLink {
    static readonly nsid = "chat.bsky.group.editJoinLink";
    static readonly def = "main";
    static readonly kind: "procedure";
    static readonly http: "POST";
    static readonly errorNames: readonly ["InvalidConvo", "InsufficientRole", "NoJoinLink"];
    convoId: string;
    requireApproval?: boolean;
    joinRule?: "anyone" | "followedByOwner" | (string & {});
    constructor(input?: Partial<ChatBskyGroupEditJoinLink>);
    toParams(): Record<string, unknown>;
    toBody(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): ChatBskyGroupEditJoinLink;
}
export type ChatBskyGroupEditJoinLinkOutput = {
    joinLink: ChatBskyGroupDefsJoinLinkView;
};
/** Re-enables a previously disabled join link for the group convo. */
export declare class ChatBskyGroupEnableJoinLink {
    static readonly nsid = "chat.bsky.group.enableJoinLink";
    static readonly def = "main";
    static readonly kind: "procedure";
    static readonly http: "POST";
    static readonly errorNames: readonly ["InvalidConvo", "InsufficientRole", "NoJoinLink", "LinkAlreadyEnabled"];
    convoId: string;
    constructor(input?: Partial<ChatBskyGroupEnableJoinLink>);
    toParams(): Record<string, unknown>;
    toBody(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): ChatBskyGroupEnableJoinLink;
}
export type ChatBskyGroupEnableJoinLinkOutput = {
    joinLink: ChatBskyGroupDefsJoinLinkView;
};
/** Get public information about groups from join links. The output array matches the input codes one-to-one by position (and each view also carries its 'code'). Disabled codes return a disabledJoinLinkPreviewView, and codes that do not map to  */
export declare class ChatBskyGroupGetJoinLinkPreviews {
    static readonly nsid = "chat.bsky.group.getJoinLinkPreviews";
    static readonly def = "main";
    static readonly kind: "query";
    static readonly http: "GET";
    static readonly errorNames: readonly [];
    codes: Array<string>;
    constructor(input?: Partial<ChatBskyGroupGetJoinLinkPreviews>);
    toParams(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): ChatBskyGroupGetJoinLinkPreviews;
}
export type ChatBskyGroupGetJoinLinkPreviewsOutput = {
    joinLinkPreviews: Array<(ChatBskyGroupDefsJoinLinkPreviewView | ChatBskyGroupDefsDisabledJoinLinkPreviewView | ChatBskyGroupDefsInvalidJoinLinkPreviewView | {
        $type?: string;
    })>;
};
/** Lists a page of request to join a group (via join link) the user owns. Shows the data from the owner's point of view. */
export declare class ChatBskyGroupListJoinRequests {
    static readonly nsid = "chat.bsky.group.listJoinRequests";
    static readonly def = "main";
    static readonly kind: "query";
    static readonly http: "GET";
    static readonly errorNames: readonly ["InvalidConvo", "InsufficientRole"];
    convoId: string;
    limit?: number;
    cursor?: string;
    constructor(input?: Partial<ChatBskyGroupListJoinRequests>);
    toParams(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): ChatBskyGroupListJoinRequests;
}
export type ChatBskyGroupListJoinRequestsOutput = {
    cursor?: string;
    requests: Array<ChatBskyGroupDefsJoinRequestView>;
};
/** Returns a page of group conversations that both the requester and the specified actor are members of. */
export declare class ChatBskyGroupListMutualGroups {
    static readonly nsid = "chat.bsky.group.listMutualGroups";
    static readonly def = "main";
    static readonly kind: "query";
    static readonly http: "GET";
    static readonly errorNames: readonly [];
    subject: string;
    limit?: number;
    cursor?: string;
    constructor(input?: Partial<ChatBskyGroupListMutualGroups>);
    toParams(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): ChatBskyGroupListMutualGroups;
}
export type ChatBskyGroupListMutualGroupsOutput = {
    cursor?: string;
    convos: Array<ChatBskyConvoDefsConvoView>;
};
/** Rejects a request to join a group (via join link) the user owns. Action taken by the group owner. */
export declare class ChatBskyGroupRejectJoinRequest {
    static readonly nsid = "chat.bsky.group.rejectJoinRequest";
    static readonly def = "main";
    static readonly kind: "procedure";
    static readonly http: "POST";
    static readonly errorNames: readonly ["InvalidConvo", "InsufficientRole"];
    convoId: string;
    member: string;
    constructor(input?: Partial<ChatBskyGroupRejectJoinRequest>);
    toParams(): Record<string, unknown>;
    toBody(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): ChatBskyGroupRejectJoinRequest;
}
export type ChatBskyGroupRejectJoinRequestOutput = Record<string, unknown>;
/** Removes members from a group. This deletes convo memberships, doesn't just set a status. */
export declare class ChatBskyGroupRemoveMembers {
    static readonly nsid = "chat.bsky.group.removeMembers";
    static readonly def = "main";
    static readonly kind: "procedure";
    static readonly http: "POST";
    static readonly errorNames: readonly ["InvalidConvo", "InsufficientRole"];
    convoId: string;
    members: Array<string>;
    constructor(input?: Partial<ChatBskyGroupRemoveMembers>);
    toParams(): Record<string, unknown>;
    toBody(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): ChatBskyGroupRemoveMembers;
}
export type ChatBskyGroupRemoveMembersOutput = {
    convo: ChatBskyConvoDefsConvoView;
};
/** Sends a request to join a group (via join link) to the group owner. Action taken by the prospective group member. */
export declare class ChatBskyGroupRequestJoin {
    static readonly nsid = "chat.bsky.group.requestJoin";
    static readonly def = "main";
    static readonly kind: "procedure";
    static readonly http: "POST";
    static readonly errorNames: readonly ["ConvoLocked", "FollowRequired", "InvalidCode", "LinkDisabled", "MemberLimitReached", "UserKicked"];
    code: string;
    constructor(input?: Partial<ChatBskyGroupRequestJoin>);
    toParams(): Record<string, unknown>;
    toBody(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): ChatBskyGroupRequestJoin;
}
export type ChatBskyGroupRequestJoinOutput = {
    status: "joined" | "pending" | (string & {});
    convo?: ChatBskyConvoDefsConvoView;
};
/** Marks all join requests as read for the group owner. */
export declare class ChatBskyGroupUpdateJoinRequestsRead {
    static readonly nsid = "chat.bsky.group.updateJoinRequestsRead";
    static readonly def = "main";
    static readonly kind: "procedure";
    static readonly http: "POST";
    static readonly errorNames: readonly ["InvalidConvo", "InsufficientRole"];
    convoId: string;
    constructor(input?: Partial<ChatBskyGroupUpdateJoinRequestsRead>);
    toParams(): Record<string, unknown>;
    toBody(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): ChatBskyGroupUpdateJoinRequestsRead;
}
export type ChatBskyGroupUpdateJoinRequestsReadOutput = Record<string, unknown>;
/** Withdraws a pending request to join a group. Action taken by the prospective member who originally requested to join. */
export declare class ChatBskyGroupWithdrawJoinRequest {
    static readonly nsid = "chat.bsky.group.withdrawJoinRequest";
    static readonly def = "main";
    static readonly kind: "procedure";
    static readonly http: "POST";
    static readonly errorNames: readonly ["InvalidJoinRequest"];
    convoId: string;
    constructor(input?: Partial<ChatBskyGroupWithdrawJoinRequest>);
    toParams(): Record<string, unknown>;
    toBody(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): ChatBskyGroupWithdrawJoinRequest;
}
export type ChatBskyGroupWithdrawJoinRequestOutput = Record<string, unknown>;
/** A view of a conversation for moderation purposes. Unlike chat.bsky.convo.defs#convoView, it does not include viewer-specific data (such as muted, unreadCount, status, lastMessage, lastReaction), since the requester is a moderator and not a  */
export declare class ChatBskyModerationDefsConvoView {
    static readonly nsid = "chat.bsky.moderation.defs";
    static readonly def = "convoView";
    static readonly kind: "object";
    $type: string;
    id: string;
    rev: string;
    kind?: ChatBskyModerationDefsDirectConvo | ChatBskyModerationDefsGroupConvo | {
        $type?: string;
    };
    constructor(input?: Partial<ChatBskyModerationDefsConvoView>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): ChatBskyModerationDefsConvoView;
}
/** Data specific to a direct conversation, for moderation purposes. */
export declare class ChatBskyModerationDefsDirectConvo {
    static readonly nsid = "chat.bsky.moderation.defs";
    static readonly def = "directConvo";
    static readonly kind: "object";
    $type: string;
    constructor(input?: Partial<ChatBskyModerationDefsDirectConvo>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): ChatBskyModerationDefsDirectConvo;
}
/** Data specific to a group conversation, for moderation purposes. Unlike chat.bsky.convo.defs#groupConvo, it does not include viewer-specific data (such as unreadJoinRequestCount), since the requester is a moderator and not a member of the co */
export declare class ChatBskyModerationDefsGroupConvo {
    static readonly nsid = "chat.bsky.moderation.defs";
    static readonly def = "groupConvo";
    static readonly kind: "object";
    $type: string;
    createdAt: string;
    joinLink?: ChatBskyGroupDefsJoinLinkView;
    joinRequestCount: number;
    lockStatus: "unlocked" | "locked" | "locked-permanently" | (string & {});
    memberCount: number;
    memberLimit: number;
    name: string;
    constructor(input?: Partial<ChatBskyModerationDefsGroupConvo>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): ChatBskyModerationDefsGroupConvo;
}
export declare class ChatBskyModerationGetActorMetadata {
    static readonly nsid = "chat.bsky.moderation.getActorMetadata";
    static readonly def = "main";
    static readonly kind: "query";
    static readonly http: "GET";
    static readonly errorNames: readonly [];
    actor: string;
    constructor(input?: Partial<ChatBskyModerationGetActorMetadata>);
    toParams(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): ChatBskyModerationGetActorMetadata;
}
export type ChatBskyModerationGetActorMetadataOutput = {
    day: ChatBskyModerationGetActorMetadataMetadata;
    month: ChatBskyModerationGetActorMetadataMetadata;
    all: ChatBskyModerationGetActorMetadataMetadata;
};
export declare class ChatBskyModerationGetActorMetadataMetadata {
    static readonly nsid = "chat.bsky.moderation.getActorMetadata";
    static readonly def = "metadata";
    static readonly kind: "object";
    $type: string;
    messagesSent: number;
    messagesReceived: number;
    convos: number;
    convosStarted: number;
    constructor(input?: Partial<ChatBskyModerationGetActorMetadataMetadata>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): ChatBskyModerationGetActorMetadataMetadata;
}
/** Gets an existing conversation by its ID, for moderation purposes. Does not require the requester to be a member of the conversation. */
export declare class ChatBskyModerationGetConvo {
    static readonly nsid = "chat.bsky.moderation.getConvo";
    static readonly def = "main";
    static readonly kind: "query";
    static readonly http: "GET";
    static readonly errorNames: readonly ["InvalidConvo"];
    convoId: string;
    constructor(input?: Partial<ChatBskyModerationGetConvo>);
    toParams(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): ChatBskyModerationGetConvo;
}
export type ChatBskyModerationGetConvoOutput = {
    convo: ChatBskyModerationDefsConvoView;
};
/** Returns a paginated list of members from a conversation, for moderation purposes. Does not require the requester to be a member of the conversation. */
export declare class ChatBskyModerationGetConvoMembers {
    static readonly nsid = "chat.bsky.moderation.getConvoMembers";
    static readonly def = "main";
    static readonly kind: "query";
    static readonly http: "GET";
    static readonly errorNames: readonly ["InvalidConvo"];
    convoId: string;
    limit?: number;
    cursor?: string;
    constructor(input?: Partial<ChatBskyModerationGetConvoMembers>);
    toParams(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): ChatBskyModerationGetConvoMembers;
}
export type ChatBskyModerationGetConvoMembersOutput = {
    cursor?: string;
    members: Array<ChatBskyActorDefsProfileViewBasic>;
};
/** Gets existing conversations by their IDs, for moderation purposes. Does not require the requester to be a member of the conversations. Unknown IDs are silently omitted from the response. */
export declare class ChatBskyModerationGetConvos {
    static readonly nsid = "chat.bsky.moderation.getConvos";
    static readonly def = "main";
    static readonly kind: "query";
    static readonly http: "GET";
    static readonly errorNames: readonly [];
    convoIds: Array<string>;
    constructor(input?: Partial<ChatBskyModerationGetConvos>);
    toParams(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): ChatBskyModerationGetConvos;
}
export type ChatBskyModerationGetConvosOutput = {
    convos: Array<ChatBskyModerationDefsConvoView>;
};
export declare class ChatBskyModerationGetMessageContext {
    static readonly nsid = "chat.bsky.moderation.getMessageContext";
    static readonly def = "main";
    static readonly kind: "query";
    static readonly http: "GET";
    static readonly errorNames: readonly [];
    convoId?: string;
    messageId: string;
    before?: number;
    after?: number;
    maxInterleavedSystemMessages?: number;
    constructor(input?: Partial<ChatBskyModerationGetMessageContext>);
    toParams(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): ChatBskyModerationGetMessageContext;
}
export type ChatBskyModerationGetMessageContextOutput = {
    messages: Array<(ChatBskyConvoDefsMessageView | ChatBskyConvoDefsSystemMessageView | {
        $type?: string;
    })>;
};
/** Subscribe to stream of chat events targeted to moderation. Private endpoint. */
export declare class ChatBskyModerationSubscribeModEvents {
    static readonly nsid = "chat.bsky.moderation.subscribeModEvents";
    static readonly def = "main";
    static readonly kind: "subscription";
    static readonly http: "WEBSOCKET";
    static readonly errorNames: readonly ["FutureCursor", "ConsumerTooSlow"];
    cursor?: string;
    constructor(input?: Partial<ChatBskyModerationSubscribeModEvents>);
    toParams(): Record<string, unknown>;
    check(): void;
    send(_client: XrpcClient, _options?: SendOptions): Promise<never>;
    static from(value: unknown): ChatBskyModerationSubscribeModEvents;
}
export type ChatBskyModerationSubscribeModEventsOutput = Record<string, unknown>;
/** Fired when a user accepts a chat convo, either explicitly or by sending a message. */
export declare class ChatBskyModerationSubscribeModEventsEventChatAccepted {
    static readonly nsid = "chat.bsky.moderation.subscribeModEvents";
    static readonly def = "eventChatAccepted";
    static readonly kind: "object";
    $type: string;
    actorDid: string;
    convoCreatedAt: string;
    convoId: string;
    createdAt: string;
    groupMemberCount?: number;
    groupName?: string;
    method: "explicit" | "message" | (string & {});
    ownerDid?: string;
    rev: string;
    constructor(input?: Partial<ChatBskyModerationSubscribeModEventsEventChatAccepted>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): ChatBskyModerationSubscribeModEventsEventChatAccepted;
}
/** Fired when the first message was sent on a convo. */
export declare class ChatBskyModerationSubscribeModEventsEventConvoFirstMessage {
    static readonly nsid = "chat.bsky.moderation.subscribeModEvents";
    static readonly def = "eventConvoFirstMessage";
    static readonly kind: "object";
    $type: string;
    convoId: string;
    createdAt: string;
    messageId?: string;
    recipients: Array<string>;
    rev: string;
    user: string;
    constructor(input?: Partial<ChatBskyModerationSubscribeModEventsEventConvoFirstMessage>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): ChatBskyModerationSubscribeModEventsEventConvoFirstMessage;
}
/** Fire when a group chat is created. */
export declare class ChatBskyModerationSubscribeModEventsEventGroupChatCreated {
    static readonly nsid = "chat.bsky.moderation.subscribeModEvents";
    static readonly def = "eventGroupChatCreated";
    static readonly kind: "object";
    $type: string;
    actorDid: string;
    convoCreatedAt: string;
    convoId: string;
    createdAt: string;
    groupMemberCount: number;
    groupName: string;
    initialMemberDids: Array<string>;
    ownerDid: string;
    rev: string;
    constructor(input?: Partial<ChatBskyModerationSubscribeModEventsEventGroupChatCreated>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): ChatBskyModerationSubscribeModEventsEventGroupChatCreated;
}
/** Fired when a user requests to join a group chat via an join link that requires approval. */
export declare class ChatBskyModerationSubscribeModEventsEventGroupChatJoinRequest {
    static readonly nsid = "chat.bsky.moderation.subscribeModEvents";
    static readonly def = "eventGroupChatJoinRequest";
    static readonly kind: "object";
    $type: string;
    actorDid: string;
    convoCreatedAt: string;
    convoId: string;
    createdAt: string;
    groupMemberCount: number;
    groupName: string;
    joinLinkCode: string;
    ownerDid: string;
    rev: string;
    subjectFollowsOwner: boolean;
    constructor(input?: Partial<ChatBskyModerationSubscribeModEventsEventGroupChatJoinRequest>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): ChatBskyModerationSubscribeModEventsEventGroupChatJoinRequest;
}
/** Fired when a join request is approved by the group owner. */
export declare class ChatBskyModerationSubscribeModEventsEventGroupChatJoinRequestApproved {
    static readonly nsid = "chat.bsky.moderation.subscribeModEvents";
    static readonly def = "eventGroupChatJoinRequestApproved";
    static readonly kind: "object";
    $type: string;
    actorDid: string;
    convoCreatedAt: string;
    convoId: string;
    createdAt: string;
    groupMemberCount: number;
    groupName: string;
    ownerDid: string;
    rev: string;
    subjectDid: string;
    constructor(input?: Partial<ChatBskyModerationSubscribeModEventsEventGroupChatJoinRequestApproved>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): ChatBskyModerationSubscribeModEventsEventGroupChatJoinRequestApproved;
}
/** Fired when a join request is rejected by the group owner. */
export declare class ChatBskyModerationSubscribeModEventsEventGroupChatJoinRequestRejected {
    static readonly nsid = "chat.bsky.moderation.subscribeModEvents";
    static readonly def = "eventGroupChatJoinRequestRejected";
    static readonly kind: "object";
    $type: string;
    actorDid: string;
    convoCreatedAt: string;
    convoId: string;
    createdAt: string;
    groupMemberCount: number;
    groupName: string;
    ownerDid: string;
    rev: string;
    subjectDid: string;
    constructor(input?: Partial<ChatBskyModerationSubscribeModEventsEventGroupChatJoinRequestRejected>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): ChatBskyModerationSubscribeModEventsEventGroupChatJoinRequestRejected;
}
/** Fired when a member is added to a group chat. Note that members are added in the 'request' state. */
export declare class ChatBskyModerationSubscribeModEventsEventGroupChatMemberAdded {
    static readonly nsid = "chat.bsky.moderation.subscribeModEvents";
    static readonly def = "eventGroupChatMemberAdded";
    static readonly kind: "object";
    $type: string;
    actorDid: string;
    convoCreatedAt: string;
    convoId: string;
    createdAt: string;
    groupMemberCount: number;
    groupName: string;
    ownerDid: string;
    requestMembersCount: number;
    rev: string;
    subjectDid: string;
    subjectFollowsOwner: boolean;
    constructor(input?: Partial<ChatBskyModerationSubscribeModEventsEventGroupChatMemberAdded>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): ChatBskyModerationSubscribeModEventsEventGroupChatMemberAdded;
}
/** Fired when a member joins a group chat via an join link that does not require approval. */
export declare class ChatBskyModerationSubscribeModEventsEventGroupChatMemberJoined {
    static readonly nsid = "chat.bsky.moderation.subscribeModEvents";
    static readonly def = "eventGroupChatMemberJoined";
    static readonly kind: "object";
    $type: string;
    actorDid: string;
    convoCreatedAt: string;
    convoId: string;
    createdAt: string;
    groupMemberCount: number;
    groupName: string;
    joinLinkCode: string;
    ownerDid: string;
    rev: string;
    subjectFollowsOwner: boolean;
    constructor(input?: Partial<ChatBskyModerationSubscribeModEventsEventGroupChatMemberJoined>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): ChatBskyModerationSubscribeModEventsEventGroupChatMemberJoined;
}
/** Fired when a member leaves or is removed from a group chat. */
export declare class ChatBskyModerationSubscribeModEventsEventGroupChatMemberLeft {
    static readonly nsid = "chat.bsky.moderation.subscribeModEvents";
    static readonly def = "eventGroupChatMemberLeft";
    static readonly kind: "object";
    $type: string;
    actorDid: string;
    convoCreatedAt: string;
    convoId: string;
    createdAt: string;
    groupMemberCount: number;
    groupName: string;
    leaveMethod: "voluntary" | "kicked" | (string & {});
    ownerDid: string;
    rev: string;
    subjectDid: string;
    constructor(input?: Partial<ChatBskyModerationSubscribeModEventsEventGroupChatMemberLeft>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): ChatBskyModerationSubscribeModEventsEventGroupChatMemberLeft;
}
/** Fired when a group chat's metadata or status changes. */
export declare class ChatBskyModerationSubscribeModEventsEventGroupChatUpdated {
    static readonly nsid = "chat.bsky.moderation.subscribeModEvents";
    static readonly def = "eventGroupChatUpdated";
    static readonly kind: "object";
    $type: string;
    actorDid: string;
    convoCreatedAt: string;
    convoId: string;
    createdAt: string;
    groupMemberCount: number;
    groupName: string;
    joinLinkCode?: string;
    joinLinkFollowersOnly?: boolean;
    joinLinkRequiresApproval?: boolean;
    lockReason?: "owner_action" | "owner_left" | "owner_deactivated" | "owner_deleted" | "owner_suspended" | "owner_taken_down" | "label_applied" | "convo_taken_down" | (string & {});
    newName?: string;
    oldName?: string;
    ownerDid: string;
    rev: string;
    updateType: "name_changed" | "locked" | "locked_permanently" | "unlocked" | "join_link_created" | "join_link_disabled" | "join_link_settings_changed" | (string & {});
    constructor(input?: Partial<ChatBskyModerationSubscribeModEventsEventGroupChatUpdated>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): ChatBskyModerationSubscribeModEventsEventGroupChatUpdated;
}
/** Fired when a user exceeds a rate limit. */
export declare class ChatBskyModerationSubscribeModEventsEventRateLimitExceeded {
    static readonly nsid = "chat.bsky.moderation.subscribeModEvents";
    static readonly def = "eventRateLimitExceeded";
    static readonly kind: "object";
    $type: string;
    actorDid: string;
    createdAt: string;
    endpoint: string;
    rev: string;
    constructor(input?: Partial<ChatBskyModerationSubscribeModEventsEventRateLimitExceeded>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): ChatBskyModerationSubscribeModEventsEventRateLimitExceeded;
}
export declare class ChatBskyModerationUpdateActorAccess {
    static readonly nsid = "chat.bsky.moderation.updateActorAccess";
    static readonly def = "main";
    static readonly kind: "procedure";
    static readonly http: "POST";
    static readonly errorNames: readonly [];
    actor: string;
    allowAccess: boolean;
    ref?: string;
    constructor(input?: Partial<ChatBskyModerationUpdateActorAccess>);
    toParams(): Record<string, unknown>;
    toBody(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): ChatBskyModerationUpdateActorAccess;
}
export type ChatBskyModerationUpdateActorAccessOutput = Record<string, unknown>;
export declare class ChatBskyNotificationDefsChatPreference {
    static readonly nsid = "chat.bsky.notification.defs";
    static readonly def = "chatPreference";
    static readonly kind: "object";
    $type: string;
    include: "all" | "follows" | (string & {});
    push: boolean;
    constructor(input?: Partial<ChatBskyNotificationDefsChatPreference>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): ChatBskyNotificationDefsChatPreference;
}
export declare class ChatBskyNotificationDefsPreferences {
    static readonly nsid = "chat.bsky.notification.defs";
    static readonly def = "preferences";
    static readonly kind: "object";
    $type: string;
    chat: ChatBskyNotificationDefsChatPreference;
    chatRequest: ChatBskyNotificationDefsChatPreference;
    constructor(input?: Partial<ChatBskyNotificationDefsPreferences>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): ChatBskyNotificationDefsPreferences;
}
/** Get the requesting account's chat notification preferences. Defaults are returned for accounts that have not set any preferences. Requires auth. */
export declare class ChatBskyNotificationGetPreferences {
    static readonly nsid = "chat.bsky.notification.getPreferences";
    static readonly def = "main";
    static readonly kind: "query";
    static readonly http: "GET";
    static readonly errorNames: readonly [];
    constructor(input?: Partial<ChatBskyNotificationGetPreferences>);
    toParams(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): ChatBskyNotificationGetPreferences;
}
export type ChatBskyNotificationGetPreferencesOutput = {
    preferences: ChatBskyNotificationDefsPreferences;
};
/** Set the requesting account's chat notification preferences. Only the provided preferences are updated; omitted preferences are left unchanged. */
export declare class ChatBskyNotificationPutPreferences {
    static readonly nsid = "chat.bsky.notification.putPreferences";
    static readonly def = "main";
    static readonly kind: "procedure";
    static readonly http: "POST";
    static readonly errorNames: readonly [];
    chat?: ChatBskyNotificationDefsChatPreference;
    chatRequest?: ChatBskyNotificationDefsChatPreference;
    constructor(input?: Partial<ChatBskyNotificationPutPreferences>);
    toParams(): Record<string, unknown>;
    toBody(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): ChatBskyNotificationPutPreferences;
}
export type ChatBskyNotificationPutPreferencesOutput = {
    preferences: ChatBskyNotificationDefsPreferences;
};
export declare class ComAtprotoAdminDefsAccountView {
    static readonly nsid = "com.atproto.admin.defs";
    static readonly def = "accountView";
    static readonly kind: "object";
    $type: string;
    did: string;
    handle: string;
    email?: string;
    relatedRecords?: Array<unknown>;
    indexedAt: string;
    invitedBy?: ComAtprotoServerDefsInviteCode;
    invites?: Array<ComAtprotoServerDefsInviteCode>;
    invitesDisabled?: boolean;
    emailConfirmedAt?: string;
    inviteNote?: string;
    deactivatedAt?: string;
    threatSignatures?: Array<ComAtprotoAdminDefsThreatSignature>;
    constructor(input?: Partial<ComAtprotoAdminDefsAccountView>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): ComAtprotoAdminDefsAccountView;
}
export declare class ComAtprotoAdminDefsRepoBlobRef {
    static readonly nsid = "com.atproto.admin.defs";
    static readonly def = "repoBlobRef";
    static readonly kind: "object";
    $type: string;
    did: string;
    cid: string;
    recordUri?: string;
    constructor(input?: Partial<ComAtprotoAdminDefsRepoBlobRef>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): ComAtprotoAdminDefsRepoBlobRef;
}
export declare class ComAtprotoAdminDefsRepoRef {
    static readonly nsid = "com.atproto.admin.defs";
    static readonly def = "repoRef";
    static readonly kind: "object";
    $type: string;
    did: string;
    constructor(input?: Partial<ComAtprotoAdminDefsRepoRef>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): ComAtprotoAdminDefsRepoRef;
}
export declare class ComAtprotoAdminDefsStatusAttr {
    static readonly nsid = "com.atproto.admin.defs";
    static readonly def = "statusAttr";
    static readonly kind: "object";
    $type: string;
    applied: boolean;
    ref?: string;
    constructor(input?: Partial<ComAtprotoAdminDefsStatusAttr>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): ComAtprotoAdminDefsStatusAttr;
}
export declare class ComAtprotoAdminDefsThreatSignature {
    static readonly nsid = "com.atproto.admin.defs";
    static readonly def = "threatSignature";
    static readonly kind: "object";
    $type: string;
    property: string;
    value: string;
    constructor(input?: Partial<ComAtprotoAdminDefsThreatSignature>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): ComAtprotoAdminDefsThreatSignature;
}
/** Delete a user account as an administrator. */
export declare class ComAtprotoAdminDeleteAccount {
    static readonly nsid = "com.atproto.admin.deleteAccount";
    static readonly def = "main";
    static readonly kind: "procedure";
    static readonly http: "POST";
    static readonly errorNames: readonly [];
    did: string;
    constructor(input?: Partial<ComAtprotoAdminDeleteAccount>);
    toParams(): Record<string, unknown>;
    toBody(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): ComAtprotoAdminDeleteAccount;
}
export type ComAtprotoAdminDeleteAccountOutput = Record<string, unknown>;
/** Disable an account from receiving new invite codes, but does not invalidate existing codes. */
export declare class ComAtprotoAdminDisableAccountInvites {
    static readonly nsid = "com.atproto.admin.disableAccountInvites";
    static readonly def = "main";
    static readonly kind: "procedure";
    static readonly http: "POST";
    static readonly errorNames: readonly [];
    account: string;
    note?: string;
    constructor(input?: Partial<ComAtprotoAdminDisableAccountInvites>);
    toParams(): Record<string, unknown>;
    toBody(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): ComAtprotoAdminDisableAccountInvites;
}
export type ComAtprotoAdminDisableAccountInvitesOutput = Record<string, unknown>;
/** Disable some set of codes and/or all codes associated with a set of users. */
export declare class ComAtprotoAdminDisableInviteCodes {
    static readonly nsid = "com.atproto.admin.disableInviteCodes";
    static readonly def = "main";
    static readonly kind: "procedure";
    static readonly http: "POST";
    static readonly errorNames: readonly [];
    codes?: Array<string>;
    accounts?: Array<string>;
    constructor(input?: Partial<ComAtprotoAdminDisableInviteCodes>);
    toParams(): Record<string, unknown>;
    toBody(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): ComAtprotoAdminDisableInviteCodes;
}
export type ComAtprotoAdminDisableInviteCodesOutput = Record<string, unknown>;
/** Re-enable an account's ability to receive invite codes. */
export declare class ComAtprotoAdminEnableAccountInvites {
    static readonly nsid = "com.atproto.admin.enableAccountInvites";
    static readonly def = "main";
    static readonly kind: "procedure";
    static readonly http: "POST";
    static readonly errorNames: readonly [];
    account: string;
    note?: string;
    constructor(input?: Partial<ComAtprotoAdminEnableAccountInvites>);
    toParams(): Record<string, unknown>;
    toBody(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): ComAtprotoAdminEnableAccountInvites;
}
export type ComAtprotoAdminEnableAccountInvitesOutput = Record<string, unknown>;
/** Get details about an account. */
export declare class ComAtprotoAdminGetAccountInfo {
    static readonly nsid = "com.atproto.admin.getAccountInfo";
    static readonly def = "main";
    static readonly kind: "query";
    static readonly http: "GET";
    static readonly errorNames: readonly [];
    did: string;
    constructor(input?: Partial<ComAtprotoAdminGetAccountInfo>);
    toParams(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): ComAtprotoAdminGetAccountInfo;
}
export type ComAtprotoAdminGetAccountInfoOutput = ComAtprotoAdminDefsAccountView;
/** Get details about some accounts. */
export declare class ComAtprotoAdminGetAccountInfos {
    static readonly nsid = "com.atproto.admin.getAccountInfos";
    static readonly def = "main";
    static readonly kind: "query";
    static readonly http: "GET";
    static readonly errorNames: readonly [];
    dids: Array<string>;
    constructor(input?: Partial<ComAtprotoAdminGetAccountInfos>);
    toParams(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): ComAtprotoAdminGetAccountInfos;
}
export type ComAtprotoAdminGetAccountInfosOutput = {
    infos: Array<ComAtprotoAdminDefsAccountView>;
};
/** Get an admin view of invite codes. */
export declare class ComAtprotoAdminGetInviteCodes {
    static readonly nsid = "com.atproto.admin.getInviteCodes";
    static readonly def = "main";
    static readonly kind: "query";
    static readonly http: "GET";
    static readonly errorNames: readonly [];
    sort?: "recent" | "usage" | (string & {});
    limit?: number;
    cursor?: string;
    constructor(input?: Partial<ComAtprotoAdminGetInviteCodes>);
    toParams(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): ComAtprotoAdminGetInviteCodes;
}
export type ComAtprotoAdminGetInviteCodesOutput = {
    cursor?: string;
    codes: Array<ComAtprotoServerDefsInviteCode>;
};
/** Get the service-specific admin status of a subject (account, record, or blob). */
export declare class ComAtprotoAdminGetSubjectStatus {
    static readonly nsid = "com.atproto.admin.getSubjectStatus";
    static readonly def = "main";
    static readonly kind: "query";
    static readonly http: "GET";
    static readonly errorNames: readonly [];
    did?: string;
    uri?: string;
    blob?: string;
    constructor(input?: Partial<ComAtprotoAdminGetSubjectStatus>);
    toParams(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): ComAtprotoAdminGetSubjectStatus;
}
export type ComAtprotoAdminGetSubjectStatusOutput = {
    subject: ComAtprotoAdminDefsRepoRef | ComAtprotoRepoStrongRef | ComAtprotoAdminDefsRepoBlobRef | {
        $type?: string;
    };
    takedown?: ComAtprotoAdminDefsStatusAttr;
    deactivated?: ComAtprotoAdminDefsStatusAttr;
};
/** Get list of accounts that matches your search query. */
export declare class ComAtprotoAdminSearchAccounts {
    static readonly nsid = "com.atproto.admin.searchAccounts";
    static readonly def = "main";
    static readonly kind: "query";
    static readonly http: "GET";
    static readonly errorNames: readonly [];
    email?: string;
    cursor?: string;
    limit?: number;
    constructor(input?: Partial<ComAtprotoAdminSearchAccounts>);
    toParams(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): ComAtprotoAdminSearchAccounts;
}
export type ComAtprotoAdminSearchAccountsOutput = {
    cursor?: string;
    accounts: Array<ComAtprotoAdminDefsAccountView>;
};
/** Send email to a user's account email address. */
export declare class ComAtprotoAdminSendEmail {
    static readonly nsid = "com.atproto.admin.sendEmail";
    static readonly def = "main";
    static readonly kind: "procedure";
    static readonly http: "POST";
    static readonly errorNames: readonly [];
    recipientDid: string;
    content: string;
    subject?: string;
    senderDid: string;
    comment?: string;
    constructor(input?: Partial<ComAtprotoAdminSendEmail>);
    toParams(): Record<string, unknown>;
    toBody(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): ComAtprotoAdminSendEmail;
}
export type ComAtprotoAdminSendEmailOutput = {
    sent: boolean;
};
/** Administrative action to update an account's email. */
export declare class ComAtprotoAdminUpdateAccountEmail {
    static readonly nsid = "com.atproto.admin.updateAccountEmail";
    static readonly def = "main";
    static readonly kind: "procedure";
    static readonly http: "POST";
    static readonly errorNames: readonly [];
    account: string;
    email: string;
    constructor(input?: Partial<ComAtprotoAdminUpdateAccountEmail>);
    toParams(): Record<string, unknown>;
    toBody(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): ComAtprotoAdminUpdateAccountEmail;
}
export type ComAtprotoAdminUpdateAccountEmailOutput = Record<string, unknown>;
/** Administrative action to update an account's handle. */
export declare class ComAtprotoAdminUpdateAccountHandle {
    static readonly nsid = "com.atproto.admin.updateAccountHandle";
    static readonly def = "main";
    static readonly kind: "procedure";
    static readonly http: "POST";
    static readonly errorNames: readonly [];
    did: string;
    handle: string;
    constructor(input?: Partial<ComAtprotoAdminUpdateAccountHandle>);
    toParams(): Record<string, unknown>;
    toBody(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): ComAtprotoAdminUpdateAccountHandle;
}
export type ComAtprotoAdminUpdateAccountHandleOutput = Record<string, unknown>;
/** Update the password for a user account as an administrator. */
export declare class ComAtprotoAdminUpdateAccountPassword {
    static readonly nsid = "com.atproto.admin.updateAccountPassword";
    static readonly def = "main";
    static readonly kind: "procedure";
    static readonly http: "POST";
    static readonly errorNames: readonly [];
    did: string;
    password: string;
    constructor(input?: Partial<ComAtprotoAdminUpdateAccountPassword>);
    toParams(): Record<string, unknown>;
    toBody(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): ComAtprotoAdminUpdateAccountPassword;
}
export type ComAtprotoAdminUpdateAccountPasswordOutput = Record<string, unknown>;
/** Administrative action to update an account's signing key in their Did document. */
export declare class ComAtprotoAdminUpdateAccountSigningKey {
    static readonly nsid = "com.atproto.admin.updateAccountSigningKey";
    static readonly def = "main";
    static readonly kind: "procedure";
    static readonly http: "POST";
    static readonly errorNames: readonly [];
    did: string;
    signingKey: string;
    constructor(input?: Partial<ComAtprotoAdminUpdateAccountSigningKey>);
    toParams(): Record<string, unknown>;
    toBody(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): ComAtprotoAdminUpdateAccountSigningKey;
}
export type ComAtprotoAdminUpdateAccountSigningKeyOutput = Record<string, unknown>;
/** Update the service-specific admin status of a subject (account, record, or blob). */
export declare class ComAtprotoAdminUpdateSubjectStatus {
    static readonly nsid = "com.atproto.admin.updateSubjectStatus";
    static readonly def = "main";
    static readonly kind: "procedure";
    static readonly http: "POST";
    static readonly errorNames: readonly [];
    subject: ComAtprotoAdminDefsRepoRef | ComAtprotoRepoStrongRef | ComAtprotoAdminDefsRepoBlobRef | {
        $type?: string;
    };
    takedown?: ComAtprotoAdminDefsStatusAttr;
    deactivated?: ComAtprotoAdminDefsStatusAttr;
    constructor(input?: Partial<ComAtprotoAdminUpdateSubjectStatus>);
    toParams(): Record<string, unknown>;
    toBody(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): ComAtprotoAdminUpdateSubjectStatus;
}
export type ComAtprotoAdminUpdateSubjectStatusOutput = {
    subject: ComAtprotoAdminDefsRepoRef | ComAtprotoRepoStrongRef | ComAtprotoAdminDefsRepoBlobRef | {
        $type?: string;
    };
    takedown?: ComAtprotoAdminDefsStatusAttr;
};
export declare class ComAtprotoIdentityDefsIdentityInfo {
    static readonly nsid = "com.atproto.identity.defs";
    static readonly def = "identityInfo";
    static readonly kind: "object";
    $type: string;
    did: string;
    handle: string;
    didDoc: unknown;
    constructor(input?: Partial<ComAtprotoIdentityDefsIdentityInfo>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): ComAtprotoIdentityDefsIdentityInfo;
}
/** Describe the credentials that should be included in the DID doc of an account that is migrating to this service. */
export declare class ComAtprotoIdentityGetRecommendedDidCredentials {
    static readonly nsid = "com.atproto.identity.getRecommendedDidCredentials";
    static readonly def = "main";
    static readonly kind: "query";
    static readonly http: "GET";
    static readonly errorNames: readonly [];
    constructor(input?: Partial<ComAtprotoIdentityGetRecommendedDidCredentials>);
    toParams(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): ComAtprotoIdentityGetRecommendedDidCredentials;
}
export type ComAtprotoIdentityGetRecommendedDidCredentialsOutput = {
    rotationKeys?: Array<string>;
    alsoKnownAs?: Array<string>;
    verificationMethods?: unknown;
    services?: unknown;
};
/** Request that the server re-resolve an identity (DID and handle). The server may ignore this request, or require authentication, depending on the role, implementation, and policy of the server. */
export declare class ComAtprotoIdentityRefreshIdentity {
    static readonly nsid = "com.atproto.identity.refreshIdentity";
    static readonly def = "main";
    static readonly kind: "procedure";
    static readonly http: "POST";
    static readonly errorNames: readonly ["HandleNotFound", "DidNotFound", "DidDeactivated"];
    identifier: string;
    constructor(input?: Partial<ComAtprotoIdentityRefreshIdentity>);
    toParams(): Record<string, unknown>;
    toBody(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): ComAtprotoIdentityRefreshIdentity;
}
export type ComAtprotoIdentityRefreshIdentityOutput = ComAtprotoIdentityDefsIdentityInfo;
/** Request an email with a code to in order to request a signed PLC operation. Requires Auth. */
export declare class ComAtprotoIdentityRequestPlcOperationSignature {
    static readonly nsid = "com.atproto.identity.requestPlcOperationSignature";
    static readonly def = "main";
    static readonly kind: "procedure";
    static readonly http: "POST";
    static readonly errorNames: readonly [];
    constructor(input?: Partial<ComAtprotoIdentityRequestPlcOperationSignature>);
    toParams(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): ComAtprotoIdentityRequestPlcOperationSignature;
}
export type ComAtprotoIdentityRequestPlcOperationSignatureOutput = Record<string, unknown>;
/** Resolves DID to DID document. Does not bi-directionally verify handle. */
export declare class ComAtprotoIdentityResolveDid {
    static readonly nsid = "com.atproto.identity.resolveDid";
    static readonly def = "main";
    static readonly kind: "query";
    static readonly http: "GET";
    static readonly errorNames: readonly ["DidNotFound", "DidDeactivated"];
    did: string;
    constructor(input?: Partial<ComAtprotoIdentityResolveDid>);
    toParams(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): ComAtprotoIdentityResolveDid;
}
export type ComAtprotoIdentityResolveDidOutput = {
    didDoc: unknown;
};
/** Resolves an atproto handle (hostname) to a DID. Does not necessarily bi-directionally verify against the the DID document. */
export declare class ComAtprotoIdentityResolveHandle {
    static readonly nsid = "com.atproto.identity.resolveHandle";
    static readonly def = "main";
    static readonly kind: "query";
    static readonly http: "GET";
    static readonly errorNames: readonly ["HandleNotFound"];
    handle: string;
    constructor(input?: Partial<ComAtprotoIdentityResolveHandle>);
    toParams(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): ComAtprotoIdentityResolveHandle;
}
export type ComAtprotoIdentityResolveHandleOutput = {
    did: string;
};
/** Resolves an identity (DID or Handle) to a full identity (DID document and verified handle). */
export declare class ComAtprotoIdentityResolveIdentity {
    static readonly nsid = "com.atproto.identity.resolveIdentity";
    static readonly def = "main";
    static readonly kind: "query";
    static readonly http: "GET";
    static readonly errorNames: readonly ["HandleNotFound", "DidNotFound", "DidDeactivated"];
    identifier: string;
    constructor(input?: Partial<ComAtprotoIdentityResolveIdentity>);
    toParams(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): ComAtprotoIdentityResolveIdentity;
}
export type ComAtprotoIdentityResolveIdentityOutput = ComAtprotoIdentityDefsIdentityInfo;
/** Signs a PLC operation to update some value(s) in the requesting DID's document. */
export declare class ComAtprotoIdentitySignPlcOperation {
    static readonly nsid = "com.atproto.identity.signPlcOperation";
    static readonly def = "main";
    static readonly kind: "procedure";
    static readonly http: "POST";
    static readonly errorNames: readonly [];
    token?: string;
    rotationKeys?: Array<string>;
    alsoKnownAs?: Array<string>;
    verificationMethods?: unknown;
    services?: unknown;
    constructor(input?: Partial<ComAtprotoIdentitySignPlcOperation>);
    toParams(): Record<string, unknown>;
    toBody(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): ComAtprotoIdentitySignPlcOperation;
}
export type ComAtprotoIdentitySignPlcOperationOutput = {
    operation: unknown;
};
/** Validates a PLC operation to ensure that it doesn't violate a service's constraints or get the identity into a bad state, then submits it to the PLC registry */
export declare class ComAtprotoIdentitySubmitPlcOperation {
    static readonly nsid = "com.atproto.identity.submitPlcOperation";
    static readonly def = "main";
    static readonly kind: "procedure";
    static readonly http: "POST";
    static readonly errorNames: readonly [];
    operation: unknown;
    constructor(input?: Partial<ComAtprotoIdentitySubmitPlcOperation>);
    toParams(): Record<string, unknown>;
    toBody(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): ComAtprotoIdentitySubmitPlcOperation;
}
export type ComAtprotoIdentitySubmitPlcOperationOutput = Record<string, unknown>;
/** Updates the current account's handle. Verifies handle validity, and updates did:plc document if necessary. Implemented by PDS, and requires auth. */
export declare class ComAtprotoIdentityUpdateHandle {
    static readonly nsid = "com.atproto.identity.updateHandle";
    static readonly def = "main";
    static readonly kind: "procedure";
    static readonly http: "POST";
    static readonly errorNames: readonly [];
    handle: string;
    constructor(input?: Partial<ComAtprotoIdentityUpdateHandle>);
    toParams(): Record<string, unknown>;
    toBody(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): ComAtprotoIdentityUpdateHandle;
}
export type ComAtprotoIdentityUpdateHandleOutput = Record<string, unknown>;
/** Metadata tag on an atproto resource (eg, repo or record). */
export declare class ComAtprotoLabelDefsLabel {
    static readonly nsid = "com.atproto.label.defs";
    static readonly def = "label";
    static readonly kind: "object";
    $type: string;
    ver?: number;
    src: string;
    uri: string;
    cid?: string;
    val: string;
    neg?: boolean;
    cts: string;
    exp?: string;
    sig?: {
        $bytes: string;
    };
    constructor(input?: Partial<ComAtprotoLabelDefsLabel>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): ComAtprotoLabelDefsLabel;
}
export declare class ComAtprotoLabelDefsLabelValue {
    static readonly nsid = "com.atproto.label.defs";
    static readonly def = "labelValue";
    static readonly kind: "string";
    static readonly knownValues: readonly ["!hide", "!warn", "!no-unauthenticated", "porn", "sexual", "nudity", "graphic-media", "bot"];
    static includes(value: string): boolean;
    private constructor();
}
/** Declares a label value and its expected interpretations and behaviors. */
export declare class ComAtprotoLabelDefsLabelValueDefinition {
    static readonly nsid = "com.atproto.label.defs";
    static readonly def = "labelValueDefinition";
    static readonly kind: "object";
    $type: string;
    identifier: string;
    severity: "inform" | "alert" | "none" | (string & {});
    blurs: "content" | "media" | "none" | (string & {});
    defaultSetting?: "ignore" | "warn" | "hide" | (string & {});
    adultOnly?: boolean;
    locales: Array<ComAtprotoLabelDefsLabelValueDefinitionStrings>;
    constructor(input?: Partial<ComAtprotoLabelDefsLabelValueDefinition>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): ComAtprotoLabelDefsLabelValueDefinition;
}
/** Strings which describe the label in the UI, localized into a specific language. */
export declare class ComAtprotoLabelDefsLabelValueDefinitionStrings {
    static readonly nsid = "com.atproto.label.defs";
    static readonly def = "labelValueDefinitionStrings";
    static readonly kind: "object";
    $type: string;
    lang: string;
    name: string;
    description: string;
    constructor(input?: Partial<ComAtprotoLabelDefsLabelValueDefinitionStrings>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): ComAtprotoLabelDefsLabelValueDefinitionStrings;
}
/** Metadata tag on an atproto record, published by the author within the record. Note that schemas should use #selfLabels, not #selfLabel. */
export declare class ComAtprotoLabelDefsSelfLabel {
    static readonly nsid = "com.atproto.label.defs";
    static readonly def = "selfLabel";
    static readonly kind: "object";
    $type: string;
    val: string;
    constructor(input?: Partial<ComAtprotoLabelDefsSelfLabel>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): ComAtprotoLabelDefsSelfLabel;
}
/** Metadata tags on an atproto record, published by the author within the record. */
export declare class ComAtprotoLabelDefsSelfLabels {
    static readonly nsid = "com.atproto.label.defs";
    static readonly def = "selfLabels";
    static readonly kind: "object";
    $type: string;
    values: Array<ComAtprotoLabelDefsSelfLabel>;
    constructor(input?: Partial<ComAtprotoLabelDefsSelfLabels>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): ComAtprotoLabelDefsSelfLabels;
}
/** Find labels relevant to the provided AT-URI patterns. Public endpoint for moderation services, though may return different or additional results with auth. */
export declare class ComAtprotoLabelQueryLabels {
    static readonly nsid = "com.atproto.label.queryLabels";
    static readonly def = "main";
    static readonly kind: "query";
    static readonly http: "GET";
    static readonly errorNames: readonly [];
    uriPatterns: Array<string>;
    sources?: Array<string>;
    limit?: number;
    cursor?: string;
    constructor(input?: Partial<ComAtprotoLabelQueryLabels>);
    toParams(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): ComAtprotoLabelQueryLabels;
}
export type ComAtprotoLabelQueryLabelsOutput = {
    cursor?: string;
    labels: Array<ComAtprotoLabelDefsLabel>;
};
/** Metadata tag on an atproto resource (eg, repo or record), published as a record in the labeler's repository. Currently ONLY intended to be used in atproto space repos, not the public broadcast repository. For public data, continue to use si */
export declare class ComAtprotoLabelRecord {
    static readonly nsid = "com.atproto.label.record";
    static readonly def = "main";
    static readonly kind: "record";
    static readonly recordKey = "tid";
    $type: string;
    uri: string;
    cid?: string;
    val: string;
    cts: string;
    exp?: string;
    constructor(input?: Partial<ComAtprotoLabelRecord>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): ComAtprotoLabelRecord;
}
/** Subscribe to stream of labels (and negations). Public endpoint implemented by mod services. Uses same sequencing scheme as repo event stream. */
export declare class ComAtprotoLabelSubscribeLabels {
    static readonly nsid = "com.atproto.label.subscribeLabels";
    static readonly def = "main";
    static readonly kind: "subscription";
    static readonly http: "WEBSOCKET";
    static readonly errorNames: readonly ["FutureCursor"];
    cursor?: number;
    constructor(input?: Partial<ComAtprotoLabelSubscribeLabels>);
    toParams(): Record<string, unknown>;
    check(): void;
    send(_client: XrpcClient, _options?: SendOptions): Promise<never>;
    static from(value: unknown): ComAtprotoLabelSubscribeLabels;
}
export type ComAtprotoLabelSubscribeLabelsOutput = Record<string, unknown>;
export declare class ComAtprotoLabelSubscribeLabelsInfo {
    static readonly nsid = "com.atproto.label.subscribeLabels";
    static readonly def = "info";
    static readonly kind: "object";
    $type: string;
    name: "OutdatedCursor" | (string & {});
    message?: string;
    constructor(input?: Partial<ComAtprotoLabelSubscribeLabelsInfo>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): ComAtprotoLabelSubscribeLabelsInfo;
}
export declare class ComAtprotoLabelSubscribeLabelsLabels {
    static readonly nsid = "com.atproto.label.subscribeLabels";
    static readonly def = "labels";
    static readonly kind: "object";
    $type: string;
    seq: number;
    labels: Array<ComAtprotoLabelDefsLabel>;
    constructor(input?: Partial<ComAtprotoLabelSubscribeLabelsLabels>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): ComAtprotoLabelSubscribeLabelsLabels;
}
/** Resolves an atproto lexicon (NSID) to a schema. */
export declare class ComAtprotoLexiconResolveLexicon {
    static readonly nsid = "com.atproto.lexicon.resolveLexicon";
    static readonly def = "main";
    static readonly kind: "query";
    static readonly http: "GET";
    static readonly errorNames: readonly ["LexiconNotFound"];
    nsid: string;
    constructor(input?: Partial<ComAtprotoLexiconResolveLexicon>);
    toParams(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): ComAtprotoLexiconResolveLexicon;
}
export type ComAtprotoLexiconResolveLexiconOutput = {
    cid: string;
    schema: ComAtprotoLexiconSchema;
    uri: string;
};
/** Representation of Lexicon schemas themselves, when published as atproto records. Note that the schema language is not defined in Lexicon; this meta schema currently only includes a single version field ('lexicon'). See the atproto specifica */
export declare class ComAtprotoLexiconSchema {
    static readonly nsid = "com.atproto.lexicon.schema";
    static readonly def = "main";
    static readonly kind: "record";
    static readonly recordKey = "nsid";
    $type: string;
    lexicon: number;
    constructor(input?: Partial<ComAtprotoLexiconSchema>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): ComAtprotoLexiconSchema;
}
/** Submit a moderation report regarding an atproto account or record. Implemented by moderation services (with PDS proxying), and requires auth. */
export declare class ComAtprotoModerationCreateReport {
    static readonly nsid = "com.atproto.moderation.createReport";
    static readonly def = "main";
    static readonly kind: "procedure";
    static readonly http: "POST";
    static readonly errorNames: readonly [];
    reasonType: "com.atproto.moderation.defs#reasonSpam" | "com.atproto.moderation.defs#reasonViolation" | "com.atproto.moderation.defs#reasonMisleading" | "com.atproto.moderation.defs#reasonSexual" | "com.atproto.moderation.defs#reasonRude" | "com.atproto.moderation.defs#reasonOther" | "com.atproto.moderation.defs#reasonAppeal" | "tools.ozone.report.defs#reasonAppeal" | "tools.ozone.report.defs#reasonOther" | "tools.ozone.report.defs#reasonViolenceAnimal" | "tools.ozone.report.defs#reasonViolenceThreats" | "tools.ozone.report.defs#reasonViolenceGraphicContent" | "tools.ozone.report.defs#reasonViolenceGlorification" | "tools.ozone.report.defs#reasonViolenceExtremistContent" | "tools.ozone.report.defs#reasonViolenceTrafficking" | "tools.ozone.report.defs#reasonViolenceOther" | "tools.ozone.report.defs#reasonSexualAbuseContent" | "tools.ozone.report.defs#reasonSexualNCII" | "tools.ozone.report.defs#reasonSexualDeepfake" | "tools.ozone.report.defs#reasonSexualAnimal" | "tools.ozone.report.defs#reasonSexualUnlabeled" | "tools.ozone.report.defs#reasonSexualOther" | "tools.ozone.report.defs#reasonChildSafetyCSAM" | "tools.ozone.report.defs#reasonChildSafetyGroom" | "tools.ozone.report.defs#reasonChildSafetyPrivacy" | "tools.ozone.report.defs#reasonChildSafetyHarassment" | "tools.ozone.report.defs#reasonChildSafetyOther" | "tools.ozone.report.defs#reasonHarassmentTroll" | "tools.ozone.report.defs#reasonHarassmentTargeted" | "tools.ozone.report.defs#reasonHarassmentHateSpeech" | "tools.ozone.report.defs#reasonHarassmentDoxxing" | "tools.ozone.report.defs#reasonHarassmentOther" | "tools.ozone.report.defs#reasonMisleadingBot" | "tools.ozone.report.defs#reasonMisleadingImpersonation" | "tools.ozone.report.defs#reasonMisleadingSpam" | "tools.ozone.report.defs#reasonMisleadingScam" | "tools.ozone.report.defs#reasonMisleadingElections" | "tools.ozone.report.defs#reasonMisleadingOther" | "tools.ozone.report.defs#reasonRuleSiteSecurity" | "tools.ozone.report.defs#reasonRuleProhibitedSales" | "tools.ozone.report.defs#reasonRuleBanEvasion" | "tools.ozone.report.defs#reasonRuleOther" | "tools.ozone.report.defs#reasonSelfHarmContent" | "tools.ozone.report.defs#reasonSelfHarmED" | "tools.ozone.report.defs#reasonSelfHarmStunts" | "tools.ozone.report.defs#reasonSelfHarmSubstances" | "tools.ozone.report.defs#reasonSelfHarmOther" | (string & {});
    reason?: string;
    subject: ComAtprotoAdminDefsRepoRef | ComAtprotoRepoStrongRef | {
        $type?: string;
    };
    modTool?: ComAtprotoModerationCreateReportModTool;
    constructor(input?: Partial<ComAtprotoModerationCreateReport>);
    toParams(): Record<string, unknown>;
    toBody(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): ComAtprotoModerationCreateReport;
}
export type ComAtprotoModerationCreateReportOutput = {
    id: number;
    reasonType: "com.atproto.moderation.defs#reasonSpam" | "com.atproto.moderation.defs#reasonViolation" | "com.atproto.moderation.defs#reasonMisleading" | "com.atproto.moderation.defs#reasonSexual" | "com.atproto.moderation.defs#reasonRude" | "com.atproto.moderation.defs#reasonOther" | "com.atproto.moderation.defs#reasonAppeal" | "tools.ozone.report.defs#reasonAppeal" | "tools.ozone.report.defs#reasonOther" | "tools.ozone.report.defs#reasonViolenceAnimal" | "tools.ozone.report.defs#reasonViolenceThreats" | "tools.ozone.report.defs#reasonViolenceGraphicContent" | "tools.ozone.report.defs#reasonViolenceGlorification" | "tools.ozone.report.defs#reasonViolenceExtremistContent" | "tools.ozone.report.defs#reasonViolenceTrafficking" | "tools.ozone.report.defs#reasonViolenceOther" | "tools.ozone.report.defs#reasonSexualAbuseContent" | "tools.ozone.report.defs#reasonSexualNCII" | "tools.ozone.report.defs#reasonSexualDeepfake" | "tools.ozone.report.defs#reasonSexualAnimal" | "tools.ozone.report.defs#reasonSexualUnlabeled" | "tools.ozone.report.defs#reasonSexualOther" | "tools.ozone.report.defs#reasonChildSafetyCSAM" | "tools.ozone.report.defs#reasonChildSafetyGroom" | "tools.ozone.report.defs#reasonChildSafetyPrivacy" | "tools.ozone.report.defs#reasonChildSafetyHarassment" | "tools.ozone.report.defs#reasonChildSafetyOther" | "tools.ozone.report.defs#reasonHarassmentTroll" | "tools.ozone.report.defs#reasonHarassmentTargeted" | "tools.ozone.report.defs#reasonHarassmentHateSpeech" | "tools.ozone.report.defs#reasonHarassmentDoxxing" | "tools.ozone.report.defs#reasonHarassmentOther" | "tools.ozone.report.defs#reasonMisleadingBot" | "tools.ozone.report.defs#reasonMisleadingImpersonation" | "tools.ozone.report.defs#reasonMisleadingSpam" | "tools.ozone.report.defs#reasonMisleadingScam" | "tools.ozone.report.defs#reasonMisleadingElections" | "tools.ozone.report.defs#reasonMisleadingOther" | "tools.ozone.report.defs#reasonRuleSiteSecurity" | "tools.ozone.report.defs#reasonRuleProhibitedSales" | "tools.ozone.report.defs#reasonRuleBanEvasion" | "tools.ozone.report.defs#reasonRuleOther" | "tools.ozone.report.defs#reasonSelfHarmContent" | "tools.ozone.report.defs#reasonSelfHarmED" | "tools.ozone.report.defs#reasonSelfHarmStunts" | "tools.ozone.report.defs#reasonSelfHarmSubstances" | "tools.ozone.report.defs#reasonSelfHarmOther" | (string & {});
    reason?: string;
    subject: ComAtprotoAdminDefsRepoRef | ComAtprotoRepoStrongRef | {
        $type?: string;
    };
    reportedBy: string;
    createdAt: string;
};
/** Moderation tool information for tracing the source of the action */
export declare class ComAtprotoModerationCreateReportModTool {
    static readonly nsid = "com.atproto.moderation.createReport";
    static readonly def = "modTool";
    static readonly kind: "object";
    $type: string;
    name: string;
    meta?: unknown;
    constructor(input?: Partial<ComAtprotoModerationCreateReportModTool>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): ComAtprotoModerationCreateReportModTool;
}
/** Appeal a previously taken moderation action */
export declare class ComAtprotoModerationDefsReasonAppeal {
    static readonly nsid = "com.atproto.moderation.defs";
    static readonly def = "reasonAppeal";
    static readonly kind: "token";
    static readonly value = "com.atproto.moderation.defs#reasonAppeal";
    static readonly description = "Appeal a previously taken moderation action";
    private constructor();
}
/** Misleading identity, affiliation, or content. Prefer new lexicon definition `tools.ozone.report.defs#reasonMisleadingOther`. */
export declare class ComAtprotoModerationDefsReasonMisleading {
    static readonly nsid = "com.atproto.moderation.defs";
    static readonly def = "reasonMisleading";
    static readonly kind: "token";
    static readonly value = "com.atproto.moderation.defs#reasonMisleading";
    static readonly description = "Misleading identity, affiliation, or content. Prefer new lexicon definition `tools.ozone.report.defs#reasonMisleadingOther`.";
    private constructor();
}
/** Reports not falling under another report category. Prefer new lexicon definition `tools.ozone.report.defs#reasonOther`. */
export declare class ComAtprotoModerationDefsReasonOther {
    static readonly nsid = "com.atproto.moderation.defs";
    static readonly def = "reasonOther";
    static readonly kind: "token";
    static readonly value = "com.atproto.moderation.defs#reasonOther";
    static readonly description = "Reports not falling under another report category. Prefer new lexicon definition `tools.ozone.report.defs#reasonOther`.";
    private constructor();
}
/** Rude, harassing, explicit, or otherwise unwelcoming behavior. Prefer new lexicon definition `tools.ozone.report.defs#reasonHarassmentOther`. */
export declare class ComAtprotoModerationDefsReasonRude {
    static readonly nsid = "com.atproto.moderation.defs";
    static readonly def = "reasonRude";
    static readonly kind: "token";
    static readonly value = "com.atproto.moderation.defs#reasonRude";
    static readonly description = "Rude, harassing, explicit, or otherwise unwelcoming behavior. Prefer new lexicon definition `tools.ozone.report.defs#reasonHarassmentOther`.";
    private constructor();
}
/** Unwanted or mislabeled sexual content. Prefer new lexicon definition `tools.ozone.report.defs#reasonSexualUnlabeled`. */
export declare class ComAtprotoModerationDefsReasonSexual {
    static readonly nsid = "com.atproto.moderation.defs";
    static readonly def = "reasonSexual";
    static readonly kind: "token";
    static readonly value = "com.atproto.moderation.defs#reasonSexual";
    static readonly description = "Unwanted or mislabeled sexual content. Prefer new lexicon definition `tools.ozone.report.defs#reasonSexualUnlabeled`.";
    private constructor();
}
/** Spam: frequent unwanted promotion, replies, mentions. Prefer new lexicon definition `tools.ozone.report.defs#reasonMisleadingSpam`. */
export declare class ComAtprotoModerationDefsReasonSpam {
    static readonly nsid = "com.atproto.moderation.defs";
    static readonly def = "reasonSpam";
    static readonly kind: "token";
    static readonly value = "com.atproto.moderation.defs#reasonSpam";
    static readonly description = "Spam: frequent unwanted promotion, replies, mentions. Prefer new lexicon definition `tools.ozone.report.defs#reasonMisleadingSpam`.";
    private constructor();
}
export declare class ComAtprotoModerationDefsReasonType {
    static readonly nsid = "com.atproto.moderation.defs";
    static readonly def = "reasonType";
    static readonly kind: "string";
    static readonly knownValues: readonly ["com.atproto.moderation.defs#reasonSpam", "com.atproto.moderation.defs#reasonViolation", "com.atproto.moderation.defs#reasonMisleading", "com.atproto.moderation.defs#reasonSexual", "com.atproto.moderation.defs#reasonRude", "com.atproto.moderation.defs#reasonOther", "com.atproto.moderation.defs#reasonAppeal", "tools.ozone.report.defs#reasonAppeal", "tools.ozone.report.defs#reasonOther", "tools.ozone.report.defs#reasonViolenceAnimal", "tools.ozone.report.defs#reasonViolenceThreats", "tools.ozone.report.defs#reasonViolenceGraphicContent", "tools.ozone.report.defs#reasonViolenceGlorification", "tools.ozone.report.defs#reasonViolenceExtremistContent", "tools.ozone.report.defs#reasonViolenceTrafficking", "tools.ozone.report.defs#reasonViolenceOther", "tools.ozone.report.defs#reasonSexualAbuseContent", "tools.ozone.report.defs#reasonSexualNCII", "tools.ozone.report.defs#reasonSexualDeepfake", "tools.ozone.report.defs#reasonSexualAnimal", "tools.ozone.report.defs#reasonSexualUnlabeled", "tools.ozone.report.defs#reasonSexualOther", "tools.ozone.report.defs#reasonChildSafetyCSAM", "tools.ozone.report.defs#reasonChildSafetyGroom", "tools.ozone.report.defs#reasonChildSafetyPrivacy", "tools.ozone.report.defs#reasonChildSafetyHarassment", "tools.ozone.report.defs#reasonChildSafetyOther", "tools.ozone.report.defs#reasonHarassmentTroll", "tools.ozone.report.defs#reasonHarassmentTargeted", "tools.ozone.report.defs#reasonHarassmentHateSpeech", "tools.ozone.report.defs#reasonHarassmentDoxxing", "tools.ozone.report.defs#reasonHarassmentOther", "tools.ozone.report.defs#reasonMisleadingBot", "tools.ozone.report.defs#reasonMisleadingImpersonation", "tools.ozone.report.defs#reasonMisleadingSpam", "tools.ozone.report.defs#reasonMisleadingScam", "tools.ozone.report.defs#reasonMisleadingElections", "tools.ozone.report.defs#reasonMisleadingOther", "tools.ozone.report.defs#reasonRuleSiteSecurity", "tools.ozone.report.defs#reasonRuleProhibitedSales", "tools.ozone.report.defs#reasonRuleBanEvasion", "tools.ozone.report.defs#reasonRuleOther", "tools.ozone.report.defs#reasonSelfHarmContent", "tools.ozone.report.defs#reasonSelfHarmED", "tools.ozone.report.defs#reasonSelfHarmStunts", "tools.ozone.report.defs#reasonSelfHarmSubstances", "tools.ozone.report.defs#reasonSelfHarmOther"];
    static includes(value: string): boolean;
    private constructor();
}
/** Direct violation of server rules, laws, terms of service. Prefer new lexicon definition `tools.ozone.report.defs#reasonRuleOther`. */
export declare class ComAtprotoModerationDefsReasonViolation {
    static readonly nsid = "com.atproto.moderation.defs";
    static readonly def = "reasonViolation";
    static readonly kind: "token";
    static readonly value = "com.atproto.moderation.defs#reasonViolation";
    static readonly description = "Direct violation of server rules, laws, terms of service. Prefer new lexicon definition `tools.ozone.report.defs#reasonRuleOther`.";
    private constructor();
}
/** Tag describing a type of subject that might be reported. */
export declare class ComAtprotoModerationDefsSubjectType {
    static readonly nsid = "com.atproto.moderation.defs";
    static readonly def = "subjectType";
    static readonly kind: "string";
    static readonly knownValues: readonly ["account", "record", "chat"];
    static includes(value: string): boolean;
    private constructor();
}
/** Apply a batch transaction of repository creates, updates, and deletes. Requires auth, implemented by PDS. */
export declare class ComAtprotoRepoApplyWrites {
    static readonly nsid = "com.atproto.repo.applyWrites";
    static readonly def = "main";
    static readonly kind: "procedure";
    static readonly http: "POST";
    static readonly errorNames: readonly ["InvalidSwap"];
    repo: string;
    validate?: boolean;
    writes: Array<(ComAtprotoRepoApplyWritesCreate | ComAtprotoRepoApplyWritesUpdate | ComAtprotoRepoApplyWritesDelete)>;
    swapCommit?: string;
    constructor(input?: Partial<ComAtprotoRepoApplyWrites>);
    toParams(): Record<string, unknown>;
    toBody(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): ComAtprotoRepoApplyWrites;
}
export type ComAtprotoRepoApplyWritesOutput = {
    commit?: ComAtprotoRepoDefsCommitMeta;
    results?: Array<(ComAtprotoRepoApplyWritesCreateResult | ComAtprotoRepoApplyWritesUpdateResult | ComAtprotoRepoApplyWritesDeleteResult)>;
};
/** Operation which creates a new record. */
export declare class ComAtprotoRepoApplyWritesCreate {
    static readonly nsid = "com.atproto.repo.applyWrites";
    static readonly def = "create";
    static readonly kind: "object";
    $type: string;
    collection: string;
    rkey?: string;
    value: unknown;
    constructor(input?: Partial<ComAtprotoRepoApplyWritesCreate>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): ComAtprotoRepoApplyWritesCreate;
}
export declare class ComAtprotoRepoApplyWritesCreateResult {
    static readonly nsid = "com.atproto.repo.applyWrites";
    static readonly def = "createResult";
    static readonly kind: "object";
    $type: string;
    uri: string;
    cid: string;
    validationStatus?: "valid" | "unknown" | (string & {});
    constructor(input?: Partial<ComAtprotoRepoApplyWritesCreateResult>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): ComAtprotoRepoApplyWritesCreateResult;
}
/** Operation which deletes an existing record. */
export declare class ComAtprotoRepoApplyWritesDelete {
    static readonly nsid = "com.atproto.repo.applyWrites";
    static readonly def = "delete";
    static readonly kind: "object";
    $type: string;
    collection: string;
    rkey: string;
    constructor(input?: Partial<ComAtprotoRepoApplyWritesDelete>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): ComAtprotoRepoApplyWritesDelete;
}
export declare class ComAtprotoRepoApplyWritesDeleteResult {
    static readonly nsid = "com.atproto.repo.applyWrites";
    static readonly def = "deleteResult";
    static readonly kind: "object";
    $type: string;
    constructor(input?: Partial<ComAtprotoRepoApplyWritesDeleteResult>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): ComAtprotoRepoApplyWritesDeleteResult;
}
/** Operation which updates an existing record. */
export declare class ComAtprotoRepoApplyWritesUpdate {
    static readonly nsid = "com.atproto.repo.applyWrites";
    static readonly def = "update";
    static readonly kind: "object";
    $type: string;
    collection: string;
    rkey: string;
    value: unknown;
    constructor(input?: Partial<ComAtprotoRepoApplyWritesUpdate>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): ComAtprotoRepoApplyWritesUpdate;
}
export declare class ComAtprotoRepoApplyWritesUpdateResult {
    static readonly nsid = "com.atproto.repo.applyWrites";
    static readonly def = "updateResult";
    static readonly kind: "object";
    $type: string;
    uri: string;
    cid: string;
    validationStatus?: "valid" | "unknown" | (string & {});
    constructor(input?: Partial<ComAtprotoRepoApplyWritesUpdateResult>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): ComAtprotoRepoApplyWritesUpdateResult;
}
/** Create a single new repository record. Requires auth, implemented by PDS. */
export declare class ComAtprotoRepoCreateRecord {
    static readonly nsid = "com.atproto.repo.createRecord";
    static readonly def = "main";
    static readonly kind: "procedure";
    static readonly http: "POST";
    static readonly errorNames: readonly ["InvalidSwap"];
    repo: string;
    collection: string;
    rkey?: string;
    validate?: boolean;
    record: unknown;
    swapCommit?: string;
    constructor(input?: Partial<ComAtprotoRepoCreateRecord>);
    toParams(): Record<string, unknown>;
    toBody(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): ComAtprotoRepoCreateRecord;
}
export type ComAtprotoRepoCreateRecordOutput = {
    uri: string;
    cid: string;
    commit?: ComAtprotoRepoDefsCommitMeta;
    validationStatus?: "valid" | "unknown" | (string & {});
};
export declare class ComAtprotoRepoDefsCommitMeta {
    static readonly nsid = "com.atproto.repo.defs";
    static readonly def = "commitMeta";
    static readonly kind: "object";
    $type: string;
    cid: string;
    rev: string;
    constructor(input?: Partial<ComAtprotoRepoDefsCommitMeta>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): ComAtprotoRepoDefsCommitMeta;
}
/** Delete a repository record, or ensure it doesn't exist. Requires auth, implemented by PDS. */
export declare class ComAtprotoRepoDeleteRecord {
    static readonly nsid = "com.atproto.repo.deleteRecord";
    static readonly def = "main";
    static readonly kind: "procedure";
    static readonly http: "POST";
    static readonly errorNames: readonly ["InvalidSwap"];
    repo: string;
    collection: string;
    rkey: string;
    swapRecord?: string;
    swapCommit?: string;
    constructor(input?: Partial<ComAtprotoRepoDeleteRecord>);
    toParams(): Record<string, unknown>;
    toBody(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): ComAtprotoRepoDeleteRecord;
}
export type ComAtprotoRepoDeleteRecordOutput = {
    commit?: ComAtprotoRepoDefsCommitMeta;
};
/** Get information about an account and repository, including the list of collections. Does not require auth. */
export declare class ComAtprotoRepoDescribeRepo {
    static readonly nsid = "com.atproto.repo.describeRepo";
    static readonly def = "main";
    static readonly kind: "query";
    static readonly http: "GET";
    static readonly errorNames: readonly [];
    repo: string;
    constructor(input?: Partial<ComAtprotoRepoDescribeRepo>);
    toParams(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): ComAtprotoRepoDescribeRepo;
}
export type ComAtprotoRepoDescribeRepoOutput = {
    handle: string;
    did: string;
    didDoc: unknown;
    collections: Array<string>;
    handleIsCorrect: boolean;
};
/** Get a single record from a repository. Does not require auth. */
export declare class ComAtprotoRepoGetRecord {
    static readonly nsid = "com.atproto.repo.getRecord";
    static readonly def = "main";
    static readonly kind: "query";
    static readonly http: "GET";
    static readonly errorNames: readonly ["RecordNotFound"];
    repo: string;
    collection: string;
    rkey: string;
    cid?: string;
    constructor(input?: Partial<ComAtprotoRepoGetRecord>);
    toParams(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): ComAtprotoRepoGetRecord;
}
export type ComAtprotoRepoGetRecordOutput = {
    uri: string;
    cid?: string;
    value: unknown;
};
/** Import a repo in the form of a CAR file. Requires Content-Length HTTP header to be set. */
export declare class ComAtprotoRepoImportRepo {
    static readonly nsid = "com.atproto.repo.importRepo";
    static readonly def = "main";
    static readonly kind: "procedure";
    static readonly http: "POST";
    static readonly errorNames: readonly [];
    payload: Blob | Uint8Array | ArrayBuffer;
    constructor(input?: Partial<ComAtprotoRepoImportRepo>);
    toParams(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): ComAtprotoRepoImportRepo;
}
export type ComAtprotoRepoImportRepoOutput = Record<string, unknown>;
/** Returns a list of missing blobs for the requesting account. Intended to be used in the account migration flow. */
export declare class ComAtprotoRepoListMissingBlobs {
    static readonly nsid = "com.atproto.repo.listMissingBlobs";
    static readonly def = "main";
    static readonly kind: "query";
    static readonly http: "GET";
    static readonly errorNames: readonly [];
    limit?: number;
    cursor?: string;
    constructor(input?: Partial<ComAtprotoRepoListMissingBlobs>);
    toParams(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): ComAtprotoRepoListMissingBlobs;
}
export type ComAtprotoRepoListMissingBlobsOutput = {
    cursor?: string;
    blobs: Array<ComAtprotoRepoListMissingBlobsRecordBlob>;
};
export declare class ComAtprotoRepoListMissingBlobsRecordBlob {
    static readonly nsid = "com.atproto.repo.listMissingBlobs";
    static readonly def = "recordBlob";
    static readonly kind: "object";
    $type: string;
    cid: string;
    recordUri: string;
    constructor(input?: Partial<ComAtprotoRepoListMissingBlobsRecordBlob>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): ComAtprotoRepoListMissingBlobsRecordBlob;
}
/** List a range of records in a repository, matching a specific collection. Does not require auth. */
export declare class ComAtprotoRepoListRecords {
    static readonly nsid = "com.atproto.repo.listRecords";
    static readonly def = "main";
    static readonly kind: "query";
    static readonly http: "GET";
    static readonly errorNames: readonly [];
    repo: string;
    collection: string;
    limit?: number;
    cursor?: string;
    reverse?: boolean;
    constructor(input?: Partial<ComAtprotoRepoListRecords>);
    toParams(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): ComAtprotoRepoListRecords;
}
export type ComAtprotoRepoListRecordsOutput = {
    cursor?: string;
    records: Array<ComAtprotoRepoListRecordsRecord>;
};
export declare class ComAtprotoRepoListRecordsRecord {
    static readonly nsid = "com.atproto.repo.listRecords";
    static readonly def = "record";
    static readonly kind: "object";
    $type: string;
    uri: string;
    cid: string;
    value: unknown;
    constructor(input?: Partial<ComAtprotoRepoListRecordsRecord>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): ComAtprotoRepoListRecordsRecord;
}
/** Write a repository record, creating or updating it as needed. Requires auth, implemented by PDS. */
export declare class ComAtprotoRepoPutRecord {
    static readonly nsid = "com.atproto.repo.putRecord";
    static readonly def = "main";
    static readonly kind: "procedure";
    static readonly http: "POST";
    static readonly errorNames: readonly ["InvalidSwap"];
    repo: string;
    collection: string;
    rkey: string;
    validate?: boolean;
    record: unknown;
    swapRecord?: string | null;
    swapCommit?: string;
    constructor(input?: Partial<ComAtprotoRepoPutRecord>);
    toParams(): Record<string, unknown>;
    toBody(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): ComAtprotoRepoPutRecord;
}
export type ComAtprotoRepoPutRecordOutput = {
    uri: string;
    cid: string;
    commit?: ComAtprotoRepoDefsCommitMeta;
    validationStatus?: "valid" | "unknown" | (string & {});
};
/** A URI with a content-hash fingerprint. */
export declare class ComAtprotoRepoStrongRef {
    static readonly nsid = "com.atproto.repo.strongRef";
    static readonly def = "main";
    static readonly kind: "object";
    $type: string;
    uri: string;
    cid: string;
    constructor(input?: Partial<ComAtprotoRepoStrongRef>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): ComAtprotoRepoStrongRef;
}
/** Upload a new blob, to be referenced from a repository record. The blob will be deleted if it is not referenced within a time window (eg, minutes). Blob restrictions (mimetype, size, etc) are enforced when the reference is created. Requires  */
export declare class ComAtprotoRepoUploadBlob {
    static readonly nsid = "com.atproto.repo.uploadBlob";
    static readonly def = "main";
    static readonly kind: "procedure";
    static readonly http: "POST";
    static readonly errorNames: readonly [];
    payload: Blob | Uint8Array | ArrayBuffer;
    constructor(input?: Partial<ComAtprotoRepoUploadBlob>);
    toParams(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): ComAtprotoRepoUploadBlob;
}
export type ComAtprotoRepoUploadBlobOutput = {
    blob: RepoBlobJson;
};
/** Activates a currently deactivated account. Used to finalize account migration after the account's repo is imported and identity is setup. */
export declare class ComAtprotoServerActivateAccount {
    static readonly nsid = "com.atproto.server.activateAccount";
    static readonly def = "main";
    static readonly kind: "procedure";
    static readonly http: "POST";
    static readonly errorNames: readonly [];
    constructor(input?: Partial<ComAtprotoServerActivateAccount>);
    toParams(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): ComAtprotoServerActivateAccount;
}
export type ComAtprotoServerActivateAccountOutput = Record<string, unknown>;
/** Returns the status of an account, especially as pertaining to import or recovery. Can be called many times over the course of an account migration. Requires auth and can only be called pertaining to oneself. */
export declare class ComAtprotoServerCheckAccountStatus {
    static readonly nsid = "com.atproto.server.checkAccountStatus";
    static readonly def = "main";
    static readonly kind: "query";
    static readonly http: "GET";
    static readonly errorNames: readonly [];
    constructor(input?: Partial<ComAtprotoServerCheckAccountStatus>);
    toParams(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): ComAtprotoServerCheckAccountStatus;
}
export type ComAtprotoServerCheckAccountStatusOutput = {
    activated: boolean;
    validDid: boolean;
    repoCommit: string;
    repoRev: string;
    repoBlocks: number;
    indexedRecords: number;
    privateStateValues: number;
    expectedBlobs: number;
    importedBlobs: number;
};
/** Confirm an email using a token from com.atproto.server.requestEmailConfirmation. */
export declare class ComAtprotoServerConfirmEmail {
    static readonly nsid = "com.atproto.server.confirmEmail";
    static readonly def = "main";
    static readonly kind: "procedure";
    static readonly http: "POST";
    static readonly errorNames: readonly ["AccountNotFound", "ExpiredToken", "InvalidToken", "InvalidEmail"];
    email: string;
    token: string;
    constructor(input?: Partial<ComAtprotoServerConfirmEmail>);
    toParams(): Record<string, unknown>;
    toBody(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): ComAtprotoServerConfirmEmail;
}
export type ComAtprotoServerConfirmEmailOutput = Record<string, unknown>;
/** Create an account. Implemented by PDS. */
export declare class ComAtprotoServerCreateAccount {
    static readonly nsid = "com.atproto.server.createAccount";
    static readonly def = "main";
    static readonly kind: "procedure";
    static readonly http: "POST";
    static readonly errorNames: readonly ["InvalidHandle", "InvalidPassword", "InvalidInviteCode", "HandleNotAvailable", "UnsupportedDomain", "UnresolvableDid", "IncompatibleDidDoc"];
    email?: string;
    handle: string;
    did?: string;
    inviteCode?: string;
    verificationCode?: string;
    verificationPhone?: string;
    password?: string;
    recoveryKey?: string;
    plcOp?: unknown;
    constructor(input?: Partial<ComAtprotoServerCreateAccount>);
    toParams(): Record<string, unknown>;
    toBody(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): ComAtprotoServerCreateAccount;
}
export type ComAtprotoServerCreateAccountOutput = {
    accessJwt: string;
    refreshJwt: string;
    handle: string;
    did: string;
    didDoc?: unknown;
};
/** Create an App Password. */
export declare class ComAtprotoServerCreateAppPassword {
    static readonly nsid = "com.atproto.server.createAppPassword";
    static readonly def = "main";
    static readonly kind: "procedure";
    static readonly http: "POST";
    static readonly errorNames: readonly ["AccountTakedown"];
    name: string;
    privileged?: boolean;
    constructor(input?: Partial<ComAtprotoServerCreateAppPassword>);
    toParams(): Record<string, unknown>;
    toBody(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): ComAtprotoServerCreateAppPassword;
}
export type ComAtprotoServerCreateAppPasswordOutput = ComAtprotoServerCreateAppPasswordAppPassword;
export declare class ComAtprotoServerCreateAppPasswordAppPassword {
    static readonly nsid = "com.atproto.server.createAppPassword";
    static readonly def = "appPassword";
    static readonly kind: "object";
    $type: string;
    name: string;
    password: string;
    createdAt: string;
    privileged?: boolean;
    constructor(input?: Partial<ComAtprotoServerCreateAppPasswordAppPassword>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): ComAtprotoServerCreateAppPasswordAppPassword;
}
/** Create an invite code. */
export declare class ComAtprotoServerCreateInviteCode {
    static readonly nsid = "com.atproto.server.createInviteCode";
    static readonly def = "main";
    static readonly kind: "procedure";
    static readonly http: "POST";
    static readonly errorNames: readonly [];
    useCount: number;
    forAccount?: string;
    constructor(input?: Partial<ComAtprotoServerCreateInviteCode>);
    toParams(): Record<string, unknown>;
    toBody(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): ComAtprotoServerCreateInviteCode;
}
export type ComAtprotoServerCreateInviteCodeOutput = {
    code: string;
};
/** Create invite codes. */
export declare class ComAtprotoServerCreateInviteCodes {
    static readonly nsid = "com.atproto.server.createInviteCodes";
    static readonly def = "main";
    static readonly kind: "procedure";
    static readonly http: "POST";
    static readonly errorNames: readonly [];
    codeCount: number;
    useCount: number;
    forAccounts?: Array<string>;
    constructor(input?: Partial<ComAtprotoServerCreateInviteCodes>);
    toParams(): Record<string, unknown>;
    toBody(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): ComAtprotoServerCreateInviteCodes;
}
export type ComAtprotoServerCreateInviteCodesOutput = {
    codes: Array<ComAtprotoServerCreateInviteCodesAccountCodes>;
};
export declare class ComAtprotoServerCreateInviteCodesAccountCodes {
    static readonly nsid = "com.atproto.server.createInviteCodes";
    static readonly def = "accountCodes";
    static readonly kind: "object";
    $type: string;
    account: string;
    codes: Array<string>;
    constructor(input?: Partial<ComAtprotoServerCreateInviteCodesAccountCodes>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): ComAtprotoServerCreateInviteCodesAccountCodes;
}
/** Create an authentication session. */
export declare class ComAtprotoServerCreateSession {
    static readonly nsid = "com.atproto.server.createSession";
    static readonly def = "main";
    static readonly kind: "procedure";
    static readonly http: "POST";
    static readonly errorNames: readonly ["AccountTakedown", "AuthFactorTokenRequired"];
    identifier: string;
    password: string;
    authFactorToken?: string;
    allowTakendown?: boolean;
    constructor(input?: Partial<ComAtprotoServerCreateSession>);
    toParams(): Record<string, unknown>;
    toBody(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): ComAtprotoServerCreateSession;
}
export type ComAtprotoServerCreateSessionOutput = {
    accessJwt: string;
    refreshJwt: string;
    handle: string;
    did: string;
    didDoc?: unknown;
    email?: string;
    emailConfirmed?: boolean;
    emailAuthFactor?: boolean;
    active?: boolean;
    status?: "takendown" | "suspended" | "deactivated" | (string & {});
};
/** Deactivates a currently active account. Stops serving of repo, and future writes to repo until reactivated. Used to finalize account migration with the old host after the account has been activated on the new host. */
export declare class ComAtprotoServerDeactivateAccount {
    static readonly nsid = "com.atproto.server.deactivateAccount";
    static readonly def = "main";
    static readonly kind: "procedure";
    static readonly http: "POST";
    static readonly errorNames: readonly [];
    deleteAfter?: string;
    constructor(input?: Partial<ComAtprotoServerDeactivateAccount>);
    toParams(): Record<string, unknown>;
    toBody(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): ComAtprotoServerDeactivateAccount;
}
export type ComAtprotoServerDeactivateAccountOutput = Record<string, unknown>;
export declare class ComAtprotoServerDefsInviteCode {
    static readonly nsid = "com.atproto.server.defs";
    static readonly def = "inviteCode";
    static readonly kind: "object";
    $type: string;
    code: string;
    available: number;
    disabled: boolean;
    forAccount: string;
    createdBy: string;
    createdAt: string;
    uses: Array<ComAtprotoServerDefsInviteCodeUse>;
    constructor(input?: Partial<ComAtprotoServerDefsInviteCode>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): ComAtprotoServerDefsInviteCode;
}
export declare class ComAtprotoServerDefsInviteCodeUse {
    static readonly nsid = "com.atproto.server.defs";
    static readonly def = "inviteCodeUse";
    static readonly kind: "object";
    $type: string;
    usedBy: string;
    usedAt: string;
    constructor(input?: Partial<ComAtprotoServerDefsInviteCodeUse>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): ComAtprotoServerDefsInviteCodeUse;
}
/** Delete an actor's account with a token and password. Can only be called after requesting a deletion token. Requires auth. */
export declare class ComAtprotoServerDeleteAccount {
    static readonly nsid = "com.atproto.server.deleteAccount";
    static readonly def = "main";
    static readonly kind: "procedure";
    static readonly http: "POST";
    static readonly errorNames: readonly ["ExpiredToken", "InvalidToken"];
    did: string;
    password: string;
    token: string;
    constructor(input?: Partial<ComAtprotoServerDeleteAccount>);
    toParams(): Record<string, unknown>;
    toBody(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): ComAtprotoServerDeleteAccount;
}
export type ComAtprotoServerDeleteAccountOutput = Record<string, unknown>;
/** Delete the current session. Requires auth using the 'refreshJwt' (not the 'accessJwt'). */
export declare class ComAtprotoServerDeleteSession {
    static readonly nsid = "com.atproto.server.deleteSession";
    static readonly def = "main";
    static readonly kind: "procedure";
    static readonly http: "POST";
    static readonly errorNames: readonly ["InvalidToken", "ExpiredToken"];
    constructor(input?: Partial<ComAtprotoServerDeleteSession>);
    toParams(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): ComAtprotoServerDeleteSession;
}
export type ComAtprotoServerDeleteSessionOutput = Record<string, unknown>;
/** Describes the server's account creation requirements and capabilities. Implemented by PDS. */
export declare class ComAtprotoServerDescribeServer {
    static readonly nsid = "com.atproto.server.describeServer";
    static readonly def = "main";
    static readonly kind: "query";
    static readonly http: "GET";
    static readonly errorNames: readonly [];
    constructor(input?: Partial<ComAtprotoServerDescribeServer>);
    toParams(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): ComAtprotoServerDescribeServer;
}
export type ComAtprotoServerDescribeServerOutput = {
    inviteCodeRequired?: boolean;
    phoneVerificationRequired?: boolean;
    blobUploadLimit?: number;
    availableUserDomains: Array<string>;
    links?: ComAtprotoServerDescribeServerLinks;
    contact?: ComAtprotoServerDescribeServerContact;
    did: string;
};
export declare class ComAtprotoServerDescribeServerContact {
    static readonly nsid = "com.atproto.server.describeServer";
    static readonly def = "contact";
    static readonly kind: "object";
    $type: string;
    email?: string;
    constructor(input?: Partial<ComAtprotoServerDescribeServerContact>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): ComAtprotoServerDescribeServerContact;
}
export declare class ComAtprotoServerDescribeServerLinks {
    static readonly nsid = "com.atproto.server.describeServer";
    static readonly def = "links";
    static readonly kind: "object";
    $type: string;
    privacyPolicy?: string;
    termsOfService?: string;
    constructor(input?: Partial<ComAtprotoServerDescribeServerLinks>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): ComAtprotoServerDescribeServerLinks;
}
/** Get all invite codes for the current account. Requires auth. */
export declare class ComAtprotoServerGetAccountInviteCodes {
    static readonly nsid = "com.atproto.server.getAccountInviteCodes";
    static readonly def = "main";
    static readonly kind: "query";
    static readonly http: "GET";
    static readonly errorNames: readonly ["DuplicateCreate"];
    includeUsed?: boolean;
    createAvailable?: boolean;
    constructor(input?: Partial<ComAtprotoServerGetAccountInviteCodes>);
    toParams(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): ComAtprotoServerGetAccountInviteCodes;
}
export type ComAtprotoServerGetAccountInviteCodesOutput = {
    codes: Array<ComAtprotoServerDefsInviteCode>;
};
/** Get a signed token on behalf of the requesting DID for the requested service. */
export declare class ComAtprotoServerGetServiceAuth {
    static readonly nsid = "com.atproto.server.getServiceAuth";
    static readonly def = "main";
    static readonly kind: "query";
    static readonly http: "GET";
    static readonly errorNames: readonly ["BadExpiration"];
    aud: string;
    exp?: number;
    lxm?: string;
    constructor(input?: Partial<ComAtprotoServerGetServiceAuth>);
    toParams(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): ComAtprotoServerGetServiceAuth;
}
export type ComAtprotoServerGetServiceAuthOutput = {
    token: string;
};
/** Get information about the current auth session. Requires auth. */
export declare class ComAtprotoServerGetSession {
    static readonly nsid = "com.atproto.server.getSession";
    static readonly def = "main";
    static readonly kind: "query";
    static readonly http: "GET";
    static readonly errorNames: readonly [];
    constructor(input?: Partial<ComAtprotoServerGetSession>);
    toParams(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): ComAtprotoServerGetSession;
}
export type ComAtprotoServerGetSessionOutput = {
    handle: string;
    did: string;
    didDoc?: unknown;
    email?: string;
    emailConfirmed?: boolean;
    emailAuthFactor?: boolean;
    active?: boolean;
    status?: "takendown" | "suspended" | "deactivated" | (string & {});
};
/** List all App Passwords. */
export declare class ComAtprotoServerListAppPasswords {
    static readonly nsid = "com.atproto.server.listAppPasswords";
    static readonly def = "main";
    static readonly kind: "query";
    static readonly http: "GET";
    static readonly errorNames: readonly ["AccountTakedown"];
    constructor(input?: Partial<ComAtprotoServerListAppPasswords>);
    toParams(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): ComAtprotoServerListAppPasswords;
}
export type ComAtprotoServerListAppPasswordsOutput = {
    passwords: Array<ComAtprotoServerListAppPasswordsAppPassword>;
};
export declare class ComAtprotoServerListAppPasswordsAppPassword {
    static readonly nsid = "com.atproto.server.listAppPasswords";
    static readonly def = "appPassword";
    static readonly kind: "object";
    $type: string;
    name: string;
    createdAt: string;
    privileged?: boolean;
    constructor(input?: Partial<ComAtprotoServerListAppPasswordsAppPassword>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): ComAtprotoServerListAppPasswordsAppPassword;
}
/** Refresh an authentication session. Requires auth using the 'refreshJwt' (not the 'accessJwt'). */
export declare class ComAtprotoServerRefreshSession {
    static readonly nsid = "com.atproto.server.refreshSession";
    static readonly def = "main";
    static readonly kind: "procedure";
    static readonly http: "POST";
    static readonly errorNames: readonly ["AccountTakedown", "InvalidToken", "ExpiredToken"];
    constructor(input?: Partial<ComAtprotoServerRefreshSession>);
    toParams(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): ComAtprotoServerRefreshSession;
}
export type ComAtprotoServerRefreshSessionOutput = {
    accessJwt: string;
    refreshJwt: string;
    handle: string;
    did: string;
    didDoc?: unknown;
    email?: string;
    emailConfirmed?: boolean;
    emailAuthFactor?: boolean;
    active?: boolean;
    status?: "takendown" | "suspended" | "deactivated" | (string & {});
};
/** Initiate a user account deletion via email. */
export declare class ComAtprotoServerRequestAccountDelete {
    static readonly nsid = "com.atproto.server.requestAccountDelete";
    static readonly def = "main";
    static readonly kind: "procedure";
    static readonly http: "POST";
    static readonly errorNames: readonly [];
    constructor(input?: Partial<ComAtprotoServerRequestAccountDelete>);
    toParams(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): ComAtprotoServerRequestAccountDelete;
}
export type ComAtprotoServerRequestAccountDeleteOutput = Record<string, unknown>;
/** Request an email with a code to confirm ownership of email. */
export declare class ComAtprotoServerRequestEmailConfirmation {
    static readonly nsid = "com.atproto.server.requestEmailConfirmation";
    static readonly def = "main";
    static readonly kind: "procedure";
    static readonly http: "POST";
    static readonly errorNames: readonly [];
    constructor(input?: Partial<ComAtprotoServerRequestEmailConfirmation>);
    toParams(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): ComAtprotoServerRequestEmailConfirmation;
}
export type ComAtprotoServerRequestEmailConfirmationOutput = Record<string, unknown>;
/** Request a token in order to update email. */
export declare class ComAtprotoServerRequestEmailUpdate {
    static readonly nsid = "com.atproto.server.requestEmailUpdate";
    static readonly def = "main";
    static readonly kind: "procedure";
    static readonly http: "POST";
    static readonly errorNames: readonly [];
    constructor(input?: Partial<ComAtprotoServerRequestEmailUpdate>);
    toParams(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): ComAtprotoServerRequestEmailUpdate;
}
export type ComAtprotoServerRequestEmailUpdateOutput = {
    tokenRequired: boolean;
};
/** Initiate a user account password reset via email. */
export declare class ComAtprotoServerRequestPasswordReset {
    static readonly nsid = "com.atproto.server.requestPasswordReset";
    static readonly def = "main";
    static readonly kind: "procedure";
    static readonly http: "POST";
    static readonly errorNames: readonly [];
    email: string;
    constructor(input?: Partial<ComAtprotoServerRequestPasswordReset>);
    toParams(): Record<string, unknown>;
    toBody(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): ComAtprotoServerRequestPasswordReset;
}
export type ComAtprotoServerRequestPasswordResetOutput = Record<string, unknown>;
/** Reserve a repo signing key, for use with account creation. Necessary so that a DID PLC update operation can be constructed during an account migraiton. Public and does not require auth; implemented by PDS. NOTE: this endpoint may change whe */
export declare class ComAtprotoServerReserveSigningKey {
    static readonly nsid = "com.atproto.server.reserveSigningKey";
    static readonly def = "main";
    static readonly kind: "procedure";
    static readonly http: "POST";
    static readonly errorNames: readonly [];
    did?: string;
    constructor(input?: Partial<ComAtprotoServerReserveSigningKey>);
    toParams(): Record<string, unknown>;
    toBody(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): ComAtprotoServerReserveSigningKey;
}
export type ComAtprotoServerReserveSigningKeyOutput = {
    signingKey: string;
};
/** Reset a user account password using a token. */
export declare class ComAtprotoServerResetPassword {
    static readonly nsid = "com.atproto.server.resetPassword";
    static readonly def = "main";
    static readonly kind: "procedure";
    static readonly http: "POST";
    static readonly errorNames: readonly ["ExpiredToken", "InvalidToken"];
    token: string;
    password: string;
    constructor(input?: Partial<ComAtprotoServerResetPassword>);
    toParams(): Record<string, unknown>;
    toBody(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): ComAtprotoServerResetPassword;
}
export type ComAtprotoServerResetPasswordOutput = Record<string, unknown>;
/** Revoke an App Password by name. */
export declare class ComAtprotoServerRevokeAppPassword {
    static readonly nsid = "com.atproto.server.revokeAppPassword";
    static readonly def = "main";
    static readonly kind: "procedure";
    static readonly http: "POST";
    static readonly errorNames: readonly [];
    name: string;
    constructor(input?: Partial<ComAtprotoServerRevokeAppPassword>);
    toParams(): Record<string, unknown>;
    toBody(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): ComAtprotoServerRevokeAppPassword;
}
export type ComAtprotoServerRevokeAppPasswordOutput = Record<string, unknown>;
/** Update an account's email. */
export declare class ComAtprotoServerUpdateEmail {
    static readonly nsid = "com.atproto.server.updateEmail";
    static readonly def = "main";
    static readonly kind: "procedure";
    static readonly http: "POST";
    static readonly errorNames: readonly ["ExpiredToken", "InvalidToken", "TokenRequired"];
    email: string;
    emailAuthFactor?: boolean;
    token?: string;
    constructor(input?: Partial<ComAtprotoServerUpdateEmail>);
    toParams(): Record<string, unknown>;
    toBody(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): ComAtprotoServerUpdateEmail;
}
export type ComAtprotoServerUpdateEmailOutput = Record<string, unknown>;
export declare class ComAtprotoSyncDefsHostStatus {
    static readonly nsid = "com.atproto.sync.defs";
    static readonly def = "hostStatus";
    static readonly kind: "string";
    static readonly knownValues: readonly ["active", "idle", "offline", "throttled", "banned"];
    static includes(value: string): boolean;
    private constructor();
}
/** Get a blob associated with a given account. Returns the full blob as originally uploaded. Does not require auth; implemented by PDS. */
export declare class ComAtprotoSyncGetBlob {
    static readonly nsid = "com.atproto.sync.getBlob";
    static readonly def = "main";
    static readonly kind: "query";
    static readonly http: "GET";
    static readonly errorNames: readonly ["BlobNotFound", "RepoNotFound", "RepoTakendown", "RepoSuspended", "RepoDeactivated"];
    did: string;
    cid: string;
    constructor(input?: Partial<ComAtprotoSyncGetBlob>);
    toParams(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): ComAtprotoSyncGetBlob;
}
export type ComAtprotoSyncGetBlobOutput = ArrayBuffer;
/** Get data blocks from a given repo, by CID. For example, intermediate MST nodes, or records. Does not require auth; implemented by PDS. */
export declare class ComAtprotoSyncGetBlocks {
    static readonly nsid = "com.atproto.sync.getBlocks";
    static readonly def = "main";
    static readonly kind: "query";
    static readonly http: "GET";
    static readonly errorNames: readonly ["BlockNotFound", "RepoNotFound", "RepoTakendown", "RepoSuspended", "RepoDeactivated"];
    did: string;
    cids: Array<string>;
    constructor(input?: Partial<ComAtprotoSyncGetBlocks>);
    toParams(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): ComAtprotoSyncGetBlocks;
}
export type ComAtprotoSyncGetBlocksOutput = ArrayBuffer;
/** DEPRECATED - please use com.atproto.sync.getRepo instead */
export declare class ComAtprotoSyncGetCheckout {
    static readonly nsid = "com.atproto.sync.getCheckout";
    static readonly def = "main";
    static readonly kind: "query";
    static readonly http: "GET";
    static readonly errorNames: readonly [];
    did: string;
    constructor(input?: Partial<ComAtprotoSyncGetCheckout>);
    toParams(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): ComAtprotoSyncGetCheckout;
}
export type ComAtprotoSyncGetCheckoutOutput = ArrayBuffer;
/** DEPRECATED - please use com.atproto.sync.getLatestCommit instead */
export declare class ComAtprotoSyncGetHead {
    static readonly nsid = "com.atproto.sync.getHead";
    static readonly def = "main";
    static readonly kind: "query";
    static readonly http: "GET";
    static readonly errorNames: readonly ["HeadNotFound"];
    did: string;
    constructor(input?: Partial<ComAtprotoSyncGetHead>);
    toParams(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): ComAtprotoSyncGetHead;
}
export type ComAtprotoSyncGetHeadOutput = {
    root: string;
};
/** Returns information about a specified upstream host, as consumed by the server. Implemented by relays. */
export declare class ComAtprotoSyncGetHostStatus {
    static readonly nsid = "com.atproto.sync.getHostStatus";
    static readonly def = "main";
    static readonly kind: "query";
    static readonly http: "GET";
    static readonly errorNames: readonly ["HostNotFound"];
    hostname: string;
    constructor(input?: Partial<ComAtprotoSyncGetHostStatus>);
    toParams(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): ComAtprotoSyncGetHostStatus;
}
export type ComAtprotoSyncGetHostStatusOutput = {
    hostname: string;
    seq?: number;
    accountCount?: number;
    status?: "active" | "idle" | "offline" | "throttled" | "banned" | (string & {});
};
/** Get the current commit CID & revision of the specified repo. Does not require auth. */
export declare class ComAtprotoSyncGetLatestCommit {
    static readonly nsid = "com.atproto.sync.getLatestCommit";
    static readonly def = "main";
    static readonly kind: "query";
    static readonly http: "GET";
    static readonly errorNames: readonly ["RepoNotFound", "RepoTakendown", "RepoSuspended", "RepoDeactivated"];
    did: string;
    constructor(input?: Partial<ComAtprotoSyncGetLatestCommit>);
    toParams(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): ComAtprotoSyncGetLatestCommit;
}
export type ComAtprotoSyncGetLatestCommitOutput = {
    cid: string;
    rev: string;
};
/** Get data blocks needed to prove the existence or non-existence of record in the current version of repo. Does not require auth. */
export declare class ComAtprotoSyncGetRecord {
    static readonly nsid = "com.atproto.sync.getRecord";
    static readonly def = "main";
    static readonly kind: "query";
    static readonly http: "GET";
    static readonly errorNames: readonly ["RecordNotFound", "RepoNotFound", "RepoTakendown", "RepoSuspended", "RepoDeactivated"];
    did: string;
    collection: string;
    rkey: string;
    constructor(input?: Partial<ComAtprotoSyncGetRecord>);
    toParams(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): ComAtprotoSyncGetRecord;
}
export type ComAtprotoSyncGetRecordOutput = ArrayBuffer;
/** Download a repository export as CAR file. Optionally only a 'diff' since a previous revision. Does not require auth; implemented by PDS. */
export declare class ComAtprotoSyncGetRepo {
    static readonly nsid = "com.atproto.sync.getRepo";
    static readonly def = "main";
    static readonly kind: "query";
    static readonly http: "GET";
    static readonly errorNames: readonly ["RepoNotFound", "RepoTakendown", "RepoSuspended", "RepoDeactivated"];
    did: string;
    since?: string;
    constructor(input?: Partial<ComAtprotoSyncGetRepo>);
    toParams(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): ComAtprotoSyncGetRepo;
}
export type ComAtprotoSyncGetRepoOutput = ArrayBuffer;
/** Get the hosting status for a repository, on this server. Expected to be implemented by PDS and Relay. */
export declare class ComAtprotoSyncGetRepoStatus {
    static readonly nsid = "com.atproto.sync.getRepoStatus";
    static readonly def = "main";
    static readonly kind: "query";
    static readonly http: "GET";
    static readonly errorNames: readonly ["RepoNotFound"];
    did: string;
    constructor(input?: Partial<ComAtprotoSyncGetRepoStatus>);
    toParams(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): ComAtprotoSyncGetRepoStatus;
}
export type ComAtprotoSyncGetRepoStatusOutput = {
    did: string;
    active: boolean;
    status?: "takendown" | "suspended" | "deleted" | "deactivated" | "desynchronized" | "throttled" | (string & {});
    rev?: string;
};
/** List blob CIDs for an account, since some repo revision. Does not require auth; implemented by PDS. */
export declare class ComAtprotoSyncListBlobs {
    static readonly nsid = "com.atproto.sync.listBlobs";
    static readonly def = "main";
    static readonly kind: "query";
    static readonly http: "GET";
    static readonly errorNames: readonly ["RepoNotFound", "RepoTakendown", "RepoSuspended", "RepoDeactivated"];
    did: string;
    since?: string;
    limit?: number;
    cursor?: string;
    constructor(input?: Partial<ComAtprotoSyncListBlobs>);
    toParams(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): ComAtprotoSyncListBlobs;
}
export type ComAtprotoSyncListBlobsOutput = {
    cursor?: string;
    cids: Array<string>;
};
/** Enumerates upstream hosts (eg, PDS or relay instances) that this service consumes from. Implemented by relays. */
export declare class ComAtprotoSyncListHosts {
    static readonly nsid = "com.atproto.sync.listHosts";
    static readonly def = "main";
    static readonly kind: "query";
    static readonly http: "GET";
    static readonly errorNames: readonly [];
    limit?: number;
    cursor?: string;
    constructor(input?: Partial<ComAtprotoSyncListHosts>);
    toParams(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): ComAtprotoSyncListHosts;
}
export type ComAtprotoSyncListHostsOutput = {
    cursor?: string;
    hosts: Array<ComAtprotoSyncListHostsHost>;
};
export declare class ComAtprotoSyncListHostsHost {
    static readonly nsid = "com.atproto.sync.listHosts";
    static readonly def = "host";
    static readonly kind: "object";
    $type: string;
    hostname: string;
    seq?: number;
    accountCount?: number;
    status?: "active" | "idle" | "offline" | "throttled" | "banned" | (string & {});
    constructor(input?: Partial<ComAtprotoSyncListHostsHost>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): ComAtprotoSyncListHostsHost;
}
/** Enumerates all the DID, rev, and commit CID for all repos hosted by this service. Does not require auth; implemented by PDS and Relay. */
export declare class ComAtprotoSyncListRepos {
    static readonly nsid = "com.atproto.sync.listRepos";
    static readonly def = "main";
    static readonly kind: "query";
    static readonly http: "GET";
    static readonly errorNames: readonly [];
    limit?: number;
    cursor?: string;
    constructor(input?: Partial<ComAtprotoSyncListRepos>);
    toParams(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): ComAtprotoSyncListRepos;
}
export type ComAtprotoSyncListReposOutput = {
    cursor?: string;
    repos: Array<ComAtprotoSyncListReposRepo>;
};
export declare class ComAtprotoSyncListReposRepo {
    static readonly nsid = "com.atproto.sync.listRepos";
    static readonly def = "repo";
    static readonly kind: "object";
    $type: string;
    did: string;
    head: string;
    rev: string;
    active?: boolean;
    status?: "takendown" | "suspended" | "deleted" | "deactivated" | "desynchronized" | "throttled" | (string & {});
    constructor(input?: Partial<ComAtprotoSyncListReposRepo>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): ComAtprotoSyncListReposRepo;
}
/** Enumerates all the DIDs which have records with the given collection NSID. */
export declare class ComAtprotoSyncListReposByCollection {
    static readonly nsid = "com.atproto.sync.listReposByCollection";
    static readonly def = "main";
    static readonly kind: "query";
    static readonly http: "GET";
    static readonly errorNames: readonly [];
    collection: string;
    limit?: number;
    cursor?: string;
    constructor(input?: Partial<ComAtprotoSyncListReposByCollection>);
    toParams(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): ComAtprotoSyncListReposByCollection;
}
export type ComAtprotoSyncListReposByCollectionOutput = {
    cursor?: string;
    repos: Array<ComAtprotoSyncListReposByCollectionRepo>;
};
export declare class ComAtprotoSyncListReposByCollectionRepo {
    static readonly nsid = "com.atproto.sync.listReposByCollection";
    static readonly def = "repo";
    static readonly kind: "object";
    $type: string;
    did: string;
    constructor(input?: Partial<ComAtprotoSyncListReposByCollectionRepo>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): ComAtprotoSyncListReposByCollectionRepo;
}
/** Notify a crawling service of a recent update, and that crawling should resume. Intended use is after a gap between repo stream events caused the crawling service to disconnect. Does not require auth; implemented by Relay. DEPRECATED: just u */
export declare class ComAtprotoSyncNotifyOfUpdate {
    static readonly nsid = "com.atproto.sync.notifyOfUpdate";
    static readonly def = "main";
    static readonly kind: "procedure";
    static readonly http: "POST";
    static readonly errorNames: readonly [];
    hostname: string;
    constructor(input?: Partial<ComAtprotoSyncNotifyOfUpdate>);
    toParams(): Record<string, unknown>;
    toBody(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): ComAtprotoSyncNotifyOfUpdate;
}
export type ComAtprotoSyncNotifyOfUpdateOutput = Record<string, unknown>;
/** Request a service to persistently crawl hosted repos. Expected use is new PDS instances declaring their existence to Relays. Does not require auth. */
export declare class ComAtprotoSyncRequestCrawl {
    static readonly nsid = "com.atproto.sync.requestCrawl";
    static readonly def = "main";
    static readonly kind: "procedure";
    static readonly http: "POST";
    static readonly errorNames: readonly ["HostBanned"];
    hostname: string;
    constructor(input?: Partial<ComAtprotoSyncRequestCrawl>);
    toParams(): Record<string, unknown>;
    toBody(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): ComAtprotoSyncRequestCrawl;
}
export type ComAtprotoSyncRequestCrawlOutput = Record<string, unknown>;
/** Repository event stream, aka Firehose endpoint. Outputs repo commits with diff data, and identity update events, for all repositories on the current server. See the atproto specifications for details around stream sequencing, repo versionin */
export declare class ComAtprotoSyncSubscribeRepos {
    static readonly nsid = "com.atproto.sync.subscribeRepos";
    static readonly def = "main";
    static readonly kind: "subscription";
    static readonly http: "WEBSOCKET";
    static readonly errorNames: readonly ["FutureCursor", "ConsumerTooSlow"];
    cursor?: number;
    constructor(input?: Partial<ComAtprotoSyncSubscribeRepos>);
    toParams(): Record<string, unknown>;
    check(): void;
    send(_client: XrpcClient, _options?: SendOptions): Promise<never>;
    static from(value: unknown): ComAtprotoSyncSubscribeRepos;
}
export type ComAtprotoSyncSubscribeReposOutput = Record<string, unknown>;
/** Represents a change to an account's status on a host (eg, PDS or Relay). The semantics of this event are that the status is at the host which emitted the event, not necessarily that at the currently active PDS. Eg, a Relay takedown would em */
export declare class ComAtprotoSyncSubscribeReposAccount {
    static readonly nsid = "com.atproto.sync.subscribeRepos";
    static readonly def = "account";
    static readonly kind: "object";
    $type: string;
    seq: number;
    did: string;
    time: string;
    active: boolean;
    status?: "takendown" | "suspended" | "deleted" | "deactivated" | "desynchronized" | "throttled" | (string & {});
    constructor(input?: Partial<ComAtprotoSyncSubscribeReposAccount>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): ComAtprotoSyncSubscribeReposAccount;
}
/** Represents an update of repository state. Note that empty commits are allowed, which include no repo data changes, but an update to rev and signature. */
export declare class ComAtprotoSyncSubscribeReposCommit {
    static readonly nsid = "com.atproto.sync.subscribeRepos";
    static readonly def = "commit";
    static readonly kind: "object";
    $type: string;
    seq: number;
    rebase: boolean;
    tooBig: boolean;
    repo: string;
    commit: {
        $link: string;
    };
    rev: string;
    since: string | null;
    blocks: {
        $bytes: string;
    };
    ops: Array<ComAtprotoSyncSubscribeReposRepoOp>;
    blobs: Array<{
        $link: string;
    }>;
    prevData?: {
        $link: string;
    };
    time: string;
    constructor(input?: Partial<ComAtprotoSyncSubscribeReposCommit>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): ComAtprotoSyncSubscribeReposCommit;
}
/** Represents a change to an account's identity. Could be an updated handle, signing key, or pds hosting endpoint. Serves as a prod to all downstream services to refresh their identity cache. */
export declare class ComAtprotoSyncSubscribeReposIdentity {
    static readonly nsid = "com.atproto.sync.subscribeRepos";
    static readonly def = "identity";
    static readonly kind: "object";
    $type: string;
    seq: number;
    did: string;
    time: string;
    handle?: string;
    constructor(input?: Partial<ComAtprotoSyncSubscribeReposIdentity>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): ComAtprotoSyncSubscribeReposIdentity;
}
export declare class ComAtprotoSyncSubscribeReposInfo {
    static readonly nsid = "com.atproto.sync.subscribeRepos";
    static readonly def = "info";
    static readonly kind: "object";
    $type: string;
    name: "OutdatedCursor" | (string & {});
    message?: string;
    constructor(input?: Partial<ComAtprotoSyncSubscribeReposInfo>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): ComAtprotoSyncSubscribeReposInfo;
}
/** A repo operation, ie a mutation of a single record. */
export declare class ComAtprotoSyncSubscribeReposRepoOp {
    static readonly nsid = "com.atproto.sync.subscribeRepos";
    static readonly def = "repoOp";
    static readonly kind: "object";
    $type: string;
    action: "create" | "update" | "delete" | (string & {});
    path: string;
    cid: {
        $link: string;
    } | null;
    prev?: {
        $link: string;
    };
    constructor(input?: Partial<ComAtprotoSyncSubscribeReposRepoOp>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): ComAtprotoSyncSubscribeReposRepoOp;
}
/** Updates the repo to a new state, without necessarily including that state on the firehose. Used to recover from broken commit streams, data loss incidents, or in situations where upstream host does not know recent state of the repository. */
export declare class ComAtprotoSyncSubscribeReposSync {
    static readonly nsid = "com.atproto.sync.subscribeRepos";
    static readonly def = "sync";
    static readonly kind: "object";
    $type: string;
    seq: number;
    did: string;
    blocks: {
        $bytes: string;
    };
    rev: string;
    time: string;
    constructor(input?: Partial<ComAtprotoSyncSubscribeReposSync>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): ComAtprotoSyncSubscribeReposSync;
}
/** Add a handle to the set of reserved handles. */
export declare class ComAtprotoTempAddReservedHandle {
    static readonly nsid = "com.atproto.temp.addReservedHandle";
    static readonly def = "main";
    static readonly kind: "procedure";
    static readonly http: "POST";
    static readonly errorNames: readonly [];
    handle: string;
    constructor(input?: Partial<ComAtprotoTempAddReservedHandle>);
    toParams(): Record<string, unknown>;
    toBody(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): ComAtprotoTempAddReservedHandle;
}
export type ComAtprotoTempAddReservedHandleOutput = Record<string, unknown>;
/** Checks whether the provided handle is available. If the handle is not available, available suggestions will be returned. Optional inputs will be used to generate suggestions. */
export declare class ComAtprotoTempCheckHandleAvailability {
    static readonly nsid = "com.atproto.temp.checkHandleAvailability";
    static readonly def = "main";
    static readonly kind: "query";
    static readonly http: "GET";
    static readonly errorNames: readonly ["InvalidEmail"];
    handle: string;
    email?: string;
    birthDate?: string;
    constructor(input?: Partial<ComAtprotoTempCheckHandleAvailability>);
    toParams(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): ComAtprotoTempCheckHandleAvailability;
}
export type ComAtprotoTempCheckHandleAvailabilityOutput = {
    handle: string;
    result: ComAtprotoTempCheckHandleAvailabilityResultAvailable | ComAtprotoTempCheckHandleAvailabilityResultUnavailable | {
        $type?: string;
    };
};
/** Indicates the provided handle is available. */
export declare class ComAtprotoTempCheckHandleAvailabilityResultAvailable {
    static readonly nsid = "com.atproto.temp.checkHandleAvailability";
    static readonly def = "resultAvailable";
    static readonly kind: "object";
    $type: string;
    constructor(input?: Partial<ComAtprotoTempCheckHandleAvailabilityResultAvailable>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): ComAtprotoTempCheckHandleAvailabilityResultAvailable;
}
/** Indicates the provided handle is unavailable and gives suggestions of available handles. */
export declare class ComAtprotoTempCheckHandleAvailabilityResultUnavailable {
    static readonly nsid = "com.atproto.temp.checkHandleAvailability";
    static readonly def = "resultUnavailable";
    static readonly kind: "object";
    $type: string;
    suggestions: Array<ComAtprotoTempCheckHandleAvailabilitySuggestion>;
    constructor(input?: Partial<ComAtprotoTempCheckHandleAvailabilityResultUnavailable>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): ComAtprotoTempCheckHandleAvailabilityResultUnavailable;
}
export declare class ComAtprotoTempCheckHandleAvailabilitySuggestion {
    static readonly nsid = "com.atproto.temp.checkHandleAvailability";
    static readonly def = "suggestion";
    static readonly kind: "object";
    $type: string;
    handle: string;
    method: string;
    constructor(input?: Partial<ComAtprotoTempCheckHandleAvailabilitySuggestion>);
    check(): void;
    toJSON(): Record<string, unknown>;
    static from(value: unknown): ComAtprotoTempCheckHandleAvailabilitySuggestion;
}
/** Check accounts location in signup queue. */
export declare class ComAtprotoTempCheckSignupQueue {
    static readonly nsid = "com.atproto.temp.checkSignupQueue";
    static readonly def = "main";
    static readonly kind: "query";
    static readonly http: "GET";
    static readonly errorNames: readonly [];
    constructor(input?: Partial<ComAtprotoTempCheckSignupQueue>);
    toParams(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): ComAtprotoTempCheckSignupQueue;
}
export type ComAtprotoTempCheckSignupQueueOutput = {
    activated: boolean;
    placeInQueue?: number;
    estimatedTimeMs?: number;
};
/** Allows finding the oauth permission scope from a reference */
export declare class ComAtprotoTempDereferenceScope {
    static readonly nsid = "com.atproto.temp.dereferenceScope";
    static readonly def = "main";
    static readonly kind: "query";
    static readonly http: "GET";
    static readonly errorNames: readonly ["InvalidScopeReference"];
    scope: string;
    constructor(input?: Partial<ComAtprotoTempDereferenceScope>);
    toParams(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): ComAtprotoTempDereferenceScope;
}
export type ComAtprotoTempDereferenceScopeOutput = {
    scope: string;
};
/** DEPRECATED: use queryLabels or subscribeLabels instead -- Fetch all labels from a labeler created after a certain date. */
export declare class ComAtprotoTempFetchLabels {
    static readonly nsid = "com.atproto.temp.fetchLabels";
    static readonly def = "main";
    static readonly kind: "query";
    static readonly http: "GET";
    static readonly errorNames: readonly [];
    since?: number;
    limit?: number;
    constructor(input?: Partial<ComAtprotoTempFetchLabels>);
    toParams(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): ComAtprotoTempFetchLabels;
}
export type ComAtprotoTempFetchLabelsOutput = {
    labels: Array<ComAtprotoLabelDefsLabel>;
};
/** Request a verification code to be sent to the supplied phone number */
export declare class ComAtprotoTempRequestPhoneVerification {
    static readonly nsid = "com.atproto.temp.requestPhoneVerification";
    static readonly def = "main";
    static readonly kind: "procedure";
    static readonly http: "POST";
    static readonly errorNames: readonly [];
    phoneNumber: string;
    constructor(input?: Partial<ComAtprotoTempRequestPhoneVerification>);
    toParams(): Record<string, unknown>;
    toBody(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): ComAtprotoTempRequestPhoneVerification;
}
export type ComAtprotoTempRequestPhoneVerificationOutput = Record<string, unknown>;
/** Revoke sessions, password, and app passwords associated with account. May be resolved by a password reset. */
export declare class ComAtprotoTempRevokeAccountCredentials {
    static readonly nsid = "com.atproto.temp.revokeAccountCredentials";
    static readonly def = "main";
    static readonly kind: "procedure";
    static readonly http: "POST";
    static readonly errorNames: readonly [];
    account: string;
    constructor(input?: Partial<ComAtprotoTempRevokeAccountCredentials>);
    toParams(): Record<string, unknown>;
    toBody(): Record<string, unknown>;
    check(): void;
    send(client: XrpcClient, options?: SendOptions): Promise<unknown>;
    static from(value: unknown): ComAtprotoTempRevokeAccountCredentials;
}
export type ComAtprotoTempRevokeAccountCredentialsOutput = Record<string, unknown>;
export declare const lex: {
    app: {
        bsky: {
            actor: {
                contentVisibilityDeclaration: typeof AppBskyActorContentVisibilityDeclaration;
                defs: {
                    adultContentPref: typeof AppBskyActorDefsAdultContentPref;
                    bskyAppProgressGuide: typeof AppBskyActorDefsBskyAppProgressGuide;
                    bskyAppStatePref: typeof AppBskyActorDefsBskyAppStatePref;
                    contentLabelPref: typeof AppBskyActorDefsContentLabelPref;
                    declaredAgePref: typeof AppBskyActorDefsDeclaredAgePref;
                    feedViewPref: typeof AppBskyActorDefsFeedViewPref;
                    hiddenPostsPref: typeof AppBskyActorDefsHiddenPostsPref;
                    interestsPref: typeof AppBskyActorDefsInterestsPref;
                    knownFollowers: typeof AppBskyActorDefsKnownFollowers;
                    labelerPrefItem: typeof AppBskyActorDefsLabelerPrefItem;
                    labelersPref: typeof AppBskyActorDefsLabelersPref;
                    liveEventPreferences: typeof AppBskyActorDefsLiveEventPreferences;
                    mutedWord: typeof AppBskyActorDefsMutedWord;
                    mutedWordsPref: typeof AppBskyActorDefsMutedWordsPref;
                    mutedWordTarget: typeof AppBskyActorDefsMutedWordTarget;
                    nux: typeof AppBskyActorDefsNux;
                    personalDetailsPref: typeof AppBskyActorDefsPersonalDetailsPref;
                    postInteractionSettingsPref: typeof AppBskyActorDefsPostInteractionSettingsPref;
                    preferences: {
                        nsid: string;
                        def: string;
                        kind: "array";
                    };
                    profileAssociated: typeof AppBskyActorDefsProfileAssociated;
                    profileAssociatedActivitySubscription: typeof AppBskyActorDefsProfileAssociatedActivitySubscription;
                    profileAssociatedChat: typeof AppBskyActorDefsProfileAssociatedChat;
                    profileAssociatedGerm: typeof AppBskyActorDefsProfileAssociatedGerm;
                    profileLinkView: typeof AppBskyActorDefsProfileLinkView;
                    profileView: typeof AppBskyActorDefsProfileView;
                    profileViewBasic: typeof AppBskyActorDefsProfileViewBasic;
                    profileViewDetailed: typeof AppBskyActorDefsProfileViewDetailed;
                    savedFeed: typeof AppBskyActorDefsSavedFeed;
                    savedFeedsPref: typeof AppBskyActorDefsSavedFeedsPref;
                    savedFeedsPrefV2: typeof AppBskyActorDefsSavedFeedsPrefV2;
                    statusView: typeof AppBskyActorDefsStatusView;
                    threadViewPref: typeof AppBskyActorDefsThreadViewPref;
                    verificationPrefs: typeof AppBskyActorDefsVerificationPrefs;
                    verificationState: typeof AppBskyActorDefsVerificationState;
                    verificationView: typeof AppBskyActorDefsVerificationView;
                    viewerState: typeof AppBskyActorDefsViewerState;
                };
                getPreferences: typeof AppBskyActorGetPreferences;
                getProfile: typeof AppBskyActorGetProfile;
                getProfiles: typeof AppBskyActorGetProfiles;
                getSuggestions: typeof AppBskyActorGetSuggestions;
                link: typeof AppBskyActorLink;
                profile: typeof AppBskyActorProfile;
                putPreferences: typeof AppBskyActorPutPreferences;
                searchActors: typeof AppBskyActorSearchActors;
                searchActorsTypeahead: typeof AppBskyActorSearchActorsTypeahead;
                status: typeof AppBskyActorStatus & {
                    live: typeof AppBskyActorStatusLive;
                };
            };
            ageassurance: {
                begin: typeof AppBskyAgeassuranceBegin;
                defs: {
                    access: typeof AppBskyAgeassuranceDefsAccess;
                    config: typeof AppBskyAgeassuranceDefsConfig;
                    configRegion: typeof AppBskyAgeassuranceDefsConfigRegion;
                    configRegionRuleDefault: typeof AppBskyAgeassuranceDefsConfigRegionRuleDefault;
                    configRegionRuleIfAccountNewerThan: typeof AppBskyAgeassuranceDefsConfigRegionRuleIfAccountNewerThan;
                    configRegionRuleIfAccountOlderThan: typeof AppBskyAgeassuranceDefsConfigRegionRuleIfAccountOlderThan;
                    configRegionRuleIfAssuredOverAge: typeof AppBskyAgeassuranceDefsConfigRegionRuleIfAssuredOverAge;
                    configRegionRuleIfAssuredUnderAge: typeof AppBskyAgeassuranceDefsConfigRegionRuleIfAssuredUnderAge;
                    configRegionRuleIfDeclaredOverAge: typeof AppBskyAgeassuranceDefsConfigRegionRuleIfDeclaredOverAge;
                    configRegionRuleIfDeclaredUnderAge: typeof AppBskyAgeassuranceDefsConfigRegionRuleIfDeclaredUnderAge;
                    event: typeof AppBskyAgeassuranceDefsEvent;
                    state: typeof AppBskyAgeassuranceDefsState;
                    stateMetadata: typeof AppBskyAgeassuranceDefsStateMetadata;
                    status: typeof AppBskyAgeassuranceDefsStatus;
                };
                getConfig: typeof AppBskyAgeassuranceGetConfig;
                getState: typeof AppBskyAgeassuranceGetState;
            };
            authCreatePosts: typeof AppBskyAuthCreatePosts;
            authDeleteContent: typeof AppBskyAuthDeleteContent;
            authManageFeedDeclarations: typeof AppBskyAuthManageFeedDeclarations;
            authManageLabelerService: typeof AppBskyAuthManageLabelerService;
            authManageModeration: typeof AppBskyAuthManageModeration;
            authManageNotifications: typeof AppBskyAuthManageNotifications;
            authManageProfile: typeof AppBskyAuthManageProfile;
            authViewAll: typeof AppBskyAuthViewAll;
            bookmark: {
                createBookmark: typeof AppBskyBookmarkCreateBookmark;
                defs: {
                    bookmark: typeof AppBskyBookmarkDefsBookmark;
                    bookmarkView: typeof AppBskyBookmarkDefsBookmarkView;
                };
                deleteBookmark: typeof AppBskyBookmarkDeleteBookmark;
                getBookmarks: typeof AppBskyBookmarkGetBookmarks;
            };
            contact: {
                defs: {
                    matchAndContactIndex: typeof AppBskyContactDefsMatchAndContactIndex;
                    notification: typeof AppBskyContactDefsNotification;
                    syncStatus: typeof AppBskyContactDefsSyncStatus;
                };
                dismissMatch: typeof AppBskyContactDismissMatch;
                getMatches: typeof AppBskyContactGetMatches;
                getSyncStatus: typeof AppBskyContactGetSyncStatus;
                importContacts: typeof AppBskyContactImportContacts;
                removeData: typeof AppBskyContactRemoveData;
                sendNotification: typeof AppBskyContactSendNotification;
                startPhoneVerification: typeof AppBskyContactStartPhoneVerification;
                verifyPhone: typeof AppBskyContactVerifyPhone;
            };
            draft: {
                createDraft: typeof AppBskyDraftCreateDraft;
                defs: {
                    draft: typeof AppBskyDraftDefsDraft;
                    draftEmbedCaption: typeof AppBskyDraftDefsDraftEmbedCaption;
                    draftEmbedExternal: typeof AppBskyDraftDefsDraftEmbedExternal;
                    draftEmbedGallery: typeof AppBskyDraftDefsDraftEmbedGallery;
                    draftEmbedGalleryItems: {
                        nsid: string;
                        def: string;
                        kind: "array";
                    };
                    draftEmbedImage: typeof AppBskyDraftDefsDraftEmbedImage;
                    draftEmbedLocalRef: typeof AppBskyDraftDefsDraftEmbedLocalRef;
                    draftEmbedRecord: typeof AppBskyDraftDefsDraftEmbedRecord;
                    draftEmbedVideo: typeof AppBskyDraftDefsDraftEmbedVideo;
                    draftPost: typeof AppBskyDraftDefsDraftPost;
                    draftView: typeof AppBskyDraftDefsDraftView;
                    draftWithId: typeof AppBskyDraftDefsDraftWithId;
                };
                deleteDraft: typeof AppBskyDraftDeleteDraft;
                getDrafts: typeof AppBskyDraftGetDrafts;
                updateDraft: typeof AppBskyDraftUpdateDraft;
            };
            embed: {
                defs: {
                    aspectRatio: typeof AppBskyEmbedDefsAspectRatio;
                };
                external: typeof AppBskyEmbedExternal & {
                    colorRGB: typeof AppBskyEmbedExternalColorRGB;
                    external: typeof AppBskyEmbedExternalExternal;
                    view: typeof AppBskyEmbedExternalView;
                    viewArticle: typeof AppBskyEmbedExternalViewArticle;
                    viewArticlePublication: typeof AppBskyEmbedExternalViewArticlePublication;
                    viewArticlePublicationTheme: typeof AppBskyEmbedExternalViewArticlePublicationTheme;
                    viewExternal: typeof AppBskyEmbedExternalViewExternal;
                    viewExternalSource: typeof AppBskyEmbedExternalViewExternalSource;
                    viewExternalSourceTheme: typeof AppBskyEmbedExternalViewExternalSourceTheme;
                    viewGallery: typeof AppBskyEmbedExternalViewGallery;
                    viewGalleryImage: typeof AppBskyEmbedExternalViewGalleryImage;
                    viewLivestream: typeof AppBskyEmbedExternalViewLivestream;
                };
                gallery: typeof AppBskyEmbedGallery & {
                    image: typeof AppBskyEmbedGalleryImage;
                    view: typeof AppBskyEmbedGalleryView;
                    viewImage: typeof AppBskyEmbedGalleryViewImage;
                };
                getEmbedExternalView: typeof AppBskyEmbedGetEmbedExternalView;
                images: typeof AppBskyEmbedImages & {
                    image: typeof AppBskyEmbedImagesImage;
                    view: typeof AppBskyEmbedImagesView;
                    viewImage: typeof AppBskyEmbedImagesViewImage;
                };
                record: typeof AppBskyEmbedRecord & {
                    view: typeof AppBskyEmbedRecordView;
                    viewBlocked: typeof AppBskyEmbedRecordViewBlocked;
                    viewDetached: typeof AppBskyEmbedRecordViewDetached;
                    viewNotFound: typeof AppBskyEmbedRecordViewNotFound;
                    viewRecord: typeof AppBskyEmbedRecordViewRecord;
                };
                recordWithMedia: typeof AppBskyEmbedRecordWithMedia & {
                    view: typeof AppBskyEmbedRecordWithMediaView;
                };
                video: typeof AppBskyEmbedVideo & {
                    caption: typeof AppBskyEmbedVideoCaption;
                    view: typeof AppBskyEmbedVideoView;
                };
            };
            feed: {
                defs: {
                    blockedAuthor: typeof AppBskyFeedDefsBlockedAuthor;
                    blockedPost: typeof AppBskyFeedDefsBlockedPost;
                    clickthroughAuthor: typeof AppBskyFeedDefsClickthroughAuthor;
                    clickthroughEmbed: typeof AppBskyFeedDefsClickthroughEmbed;
                    clickthroughItem: typeof AppBskyFeedDefsClickthroughItem;
                    clickthroughReposter: typeof AppBskyFeedDefsClickthroughReposter;
                    contentModeUnspecified: typeof AppBskyFeedDefsContentModeUnspecified;
                    contentModeVideo: typeof AppBskyFeedDefsContentModeVideo;
                    feedViewPost: typeof AppBskyFeedDefsFeedViewPost;
                    generatorView: typeof AppBskyFeedDefsGeneratorView;
                    generatorViewerState: typeof AppBskyFeedDefsGeneratorViewerState;
                    interaction: typeof AppBskyFeedDefsInteraction;
                    interactionLike: typeof AppBskyFeedDefsInteractionLike;
                    interactionQuote: typeof AppBskyFeedDefsInteractionQuote;
                    interactionReply: typeof AppBskyFeedDefsInteractionReply;
                    interactionRepost: typeof AppBskyFeedDefsInteractionRepost;
                    interactionSeen: typeof AppBskyFeedDefsInteractionSeen;
                    interactionShare: typeof AppBskyFeedDefsInteractionShare;
                    knownLikers: typeof AppBskyFeedDefsKnownLikers;
                    notFoundPost: typeof AppBskyFeedDefsNotFoundPost;
                    postView: typeof AppBskyFeedDefsPostView;
                    reasonPin: typeof AppBskyFeedDefsReasonPin;
                    reasonRepost: typeof AppBskyFeedDefsReasonRepost;
                    replyRef: typeof AppBskyFeedDefsReplyRef;
                    requestLess: typeof AppBskyFeedDefsRequestLess;
                    requestMore: typeof AppBskyFeedDefsRequestMore;
                    skeletonFeedPost: typeof AppBskyFeedDefsSkeletonFeedPost;
                    skeletonReasonPin: typeof AppBskyFeedDefsSkeletonReasonPin;
                    skeletonReasonRepost: typeof AppBskyFeedDefsSkeletonReasonRepost;
                    threadContext: typeof AppBskyFeedDefsThreadContext;
                    threadgateView: typeof AppBskyFeedDefsThreadgateView;
                    threadViewPost: typeof AppBskyFeedDefsThreadViewPost;
                    viewerState: typeof AppBskyFeedDefsViewerState;
                };
                describeFeedGenerator: typeof AppBskyFeedDescribeFeedGenerator & {
                    feed: typeof AppBskyFeedDescribeFeedGeneratorFeed;
                    links: typeof AppBskyFeedDescribeFeedGeneratorLinks;
                };
                generator: typeof AppBskyFeedGenerator;
                getActorFeeds: typeof AppBskyFeedGetActorFeeds;
                getActorLikes: typeof AppBskyFeedGetActorLikes;
                getAuthorFeed: typeof AppBskyFeedGetAuthorFeed;
                getFeed: typeof AppBskyFeedGetFeed;
                getFeedGenerator: typeof AppBskyFeedGetFeedGenerator;
                getFeedGenerators: typeof AppBskyFeedGetFeedGenerators;
                getFeedSkeleton: typeof AppBskyFeedGetFeedSkeleton;
                getLikes: typeof AppBskyFeedGetLikes & {
                    like: typeof AppBskyFeedGetLikesLike;
                };
                getListFeed: typeof AppBskyFeedGetListFeed;
                getPostThread: typeof AppBskyFeedGetPostThread;
                getPosts: typeof AppBskyFeedGetPosts;
                getQuotes: typeof AppBskyFeedGetQuotes;
                getRepostedBy: typeof AppBskyFeedGetRepostedBy;
                getSuggestedFeeds: typeof AppBskyFeedGetSuggestedFeeds;
                getTimeline: typeof AppBskyFeedGetTimeline;
                like: typeof AppBskyFeedLike;
                post: typeof AppBskyFeedPost & {
                    entity: typeof AppBskyFeedPostEntity;
                    replyRef: typeof AppBskyFeedPostReplyRef;
                    textSlice: typeof AppBskyFeedPostTextSlice;
                };
                postgate: typeof AppBskyFeedPostgate & {
                    disableRule: typeof AppBskyFeedPostgateDisableRule;
                };
                repost: typeof AppBskyFeedRepost;
                searchPosts: typeof AppBskyFeedSearchPosts;
                searchPostsV2: typeof AppBskyFeedSearchPostsV2;
                sendInteractions: typeof AppBskyFeedSendInteractions;
                threadgate: typeof AppBskyFeedThreadgate & {
                    followerRule: typeof AppBskyFeedThreadgateFollowerRule;
                    followingRule: typeof AppBskyFeedThreadgateFollowingRule;
                    listRule: typeof AppBskyFeedThreadgateListRule;
                    mentionRule: typeof AppBskyFeedThreadgateMentionRule;
                };
            };
            graph: {
                block: typeof AppBskyGraphBlock;
                defs: {
                    curatelist: typeof AppBskyGraphDefsCuratelist;
                    listItemView: typeof AppBskyGraphDefsListItemView;
                    listPurpose: typeof AppBskyGraphDefsListPurpose;
                    listView: typeof AppBskyGraphDefsListView;
                    listViewBasic: typeof AppBskyGraphDefsListViewBasic;
                    listViewerState: typeof AppBskyGraphDefsListViewerState;
                    modlist: typeof AppBskyGraphDefsModlist;
                    notFoundActor: typeof AppBskyGraphDefsNotFoundActor;
                    referencelist: typeof AppBskyGraphDefsReferencelist;
                    relationship: typeof AppBskyGraphDefsRelationship;
                    starterPackView: typeof AppBskyGraphDefsStarterPackView;
                    starterPackViewBasic: typeof AppBskyGraphDefsStarterPackViewBasic;
                };
                follow: typeof AppBskyGraphFollow;
                getActorStarterPacks: typeof AppBskyGraphGetActorStarterPacks;
                getBlocks: typeof AppBskyGraphGetBlocks;
                getKnownFollowers: typeof AppBskyGraphGetKnownFollowers;
                getList: typeof AppBskyGraphGetList;
                getListBlocks: typeof AppBskyGraphGetListBlocks;
                getListMutes: typeof AppBskyGraphGetListMutes;
                getLists: typeof AppBskyGraphGetLists;
                getListsWithMembership: typeof AppBskyGraphGetListsWithMembership & {
                    listWithMembership: typeof AppBskyGraphGetListsWithMembershipListWithMembership;
                };
                getMutes: typeof AppBskyGraphGetMutes;
                getRelationships: typeof AppBskyGraphGetRelationships;
                getStarterPack: typeof AppBskyGraphGetStarterPack;
                getStarterPacks: typeof AppBskyGraphGetStarterPacks;
                getStarterPacksWithMembership: typeof AppBskyGraphGetStarterPacksWithMembership & {
                    starterPackWithMembership: typeof AppBskyGraphGetStarterPacksWithMembershipStarterPackWithMembership;
                };
                getSuggestedFollowsByActor: typeof AppBskyGraphGetSuggestedFollowsByActor;
                list: typeof AppBskyGraphList;
                listblock: typeof AppBskyGraphListblock;
                listitem: typeof AppBskyGraphListitem;
                muteActor: typeof AppBskyGraphMuteActor;
                muteActorList: typeof AppBskyGraphMuteActorList;
                muteThread: typeof AppBskyGraphMuteThread;
                referencelistoptout: typeof AppBskyGraphReferencelistoptout;
                searchStarterPacks: typeof AppBskyGraphSearchStarterPacks;
                searchStarterPacksV2: typeof AppBskyGraphSearchStarterPacksV2;
                starterpack: typeof AppBskyGraphStarterpack & {
                    feedItem: typeof AppBskyGraphStarterpackFeedItem;
                };
                unmuteActor: typeof AppBskyGraphUnmuteActor;
                unmuteActorList: typeof AppBskyGraphUnmuteActorList;
                unmuteThread: typeof AppBskyGraphUnmuteThread;
                verification: typeof AppBskyGraphVerification;
            };
            labeler: {
                defs: {
                    labelerPolicies: typeof AppBskyLabelerDefsLabelerPolicies;
                    labelerView: typeof AppBskyLabelerDefsLabelerView;
                    labelerViewDetailed: typeof AppBskyLabelerDefsLabelerViewDetailed;
                    labelerViewerState: typeof AppBskyLabelerDefsLabelerViewerState;
                };
                getServices: typeof AppBskyLabelerGetServices;
                service: typeof AppBskyLabelerService;
            };
            notification: {
                declaration: typeof AppBskyNotificationDeclaration;
                defs: {
                    activitySubscription: typeof AppBskyNotificationDefsActivitySubscription;
                    chatPreference: typeof AppBskyNotificationDefsChatPreference;
                    filterablePreference: typeof AppBskyNotificationDefsFilterablePreference;
                    preference: typeof AppBskyNotificationDefsPreference;
                    preferences: typeof AppBskyNotificationDefsPreferences;
                    recordDeleted: typeof AppBskyNotificationDefsRecordDeleted;
                    subjectActivitySubscription: typeof AppBskyNotificationDefsSubjectActivitySubscription;
                };
                getGroupedNotifications: typeof AppBskyNotificationGetGroupedNotifications & {
                    contactMatchNotification: typeof AppBskyNotificationGetGroupedNotificationsContactMatchNotification;
                    followBackNotification: typeof AppBskyNotificationGetGroupedNotificationsFollowBackNotification;
                    followGroup: typeof AppBskyNotificationGetGroupedNotificationsFollowGroup;
                    followItem: typeof AppBskyNotificationGetGroupedNotificationsFollowItem;
                    generatorLikeGroup: typeof AppBskyNotificationGetGroupedNotificationsGeneratorLikeGroup;
                    generatorLikeItem: typeof AppBskyNotificationGetGroupedNotificationsGeneratorLikeItem;
                    group: typeof AppBskyNotificationGetGroupedNotificationsGroup;
                    likeGroup: typeof AppBskyNotificationGetGroupedNotificationsLikeGroup;
                    likeItem: typeof AppBskyNotificationGetGroupedNotificationsLikeItem;
                    likeViaRepostGroup: typeof AppBskyNotificationGetGroupedNotificationsLikeViaRepostGroup;
                    likeViaRepostItem: typeof AppBskyNotificationGetGroupedNotificationsLikeViaRepostItem;
                    mentionNotification: typeof AppBskyNotificationGetGroupedNotificationsMentionNotification;
                    multiPostLikeGroup: typeof AppBskyNotificationGetGroupedNotificationsMultiPostLikeGroup;
                    multiPostLikeItem: typeof AppBskyNotificationGetGroupedNotificationsMultiPostLikeItem;
                    multiPostLikeViaRepostGroup: typeof AppBskyNotificationGetGroupedNotificationsMultiPostLikeViaRepostGroup;
                    multiPostLikeViaRepostItem: typeof AppBskyNotificationGetGroupedNotificationsMultiPostLikeViaRepostItem;
                    multiPostRepostGroup: typeof AppBskyNotificationGetGroupedNotificationsMultiPostRepostGroup;
                    multiPostRepostItem: typeof AppBskyNotificationGetGroupedNotificationsMultiPostRepostItem;
                    multiPostRepostViaRepostGroup: typeof AppBskyNotificationGetGroupedNotificationsMultiPostRepostViaRepostGroup;
                    multiPostRepostViaRepostItem: typeof AppBskyNotificationGetGroupedNotificationsMultiPostRepostViaRepostItem;
                    quoteNotification: typeof AppBskyNotificationGetGroupedNotificationsQuoteNotification;
                    replyNotification: typeof AppBskyNotificationGetGroupedNotificationsReplyNotification;
                    repostGroup: typeof AppBskyNotificationGetGroupedNotificationsRepostGroup;
                    repostItem: typeof AppBskyNotificationGetGroupedNotificationsRepostItem;
                    repostViaRepostGroup: typeof AppBskyNotificationGetGroupedNotificationsRepostViaRepostGroup;
                    repostViaRepostItem: typeof AppBskyNotificationGetGroupedNotificationsRepostViaRepostItem;
                    starterPackJoinedNotification: typeof AppBskyNotificationGetGroupedNotificationsStarterPackJoinedNotification;
                    subscribedPostGroup: typeof AppBskyNotificationGetGroupedNotificationsSubscribedPostGroup;
                    subscribedPostItem: typeof AppBskyNotificationGetGroupedNotificationsSubscribedPostItem;
                    unverifiedNotification: typeof AppBskyNotificationGetGroupedNotificationsUnverifiedNotification;
                    verifiedNotification: typeof AppBskyNotificationGetGroupedNotificationsVerifiedNotification;
                };
                getPreferences: typeof AppBskyNotificationGetPreferences;
                getUnreadCount: typeof AppBskyNotificationGetUnreadCount;
                listActivitySubscriptions: typeof AppBskyNotificationListActivitySubscriptions;
                listNotifications: typeof AppBskyNotificationListNotifications & {
                    notification: typeof AppBskyNotificationListNotificationsNotification;
                };
                putActivitySubscription: typeof AppBskyNotificationPutActivitySubscription;
                putPreferences: typeof AppBskyNotificationPutPreferences;
                putPreferencesV2: typeof AppBskyNotificationPutPreferencesV2;
                registerPush: typeof AppBskyNotificationRegisterPush;
                unregisterPush: typeof AppBskyNotificationUnregisterPush;
                updateSeen: typeof AppBskyNotificationUpdateSeen;
            };
            richtext: {
                facet: typeof AppBskyRichtextFacet & {
                    byteSlice: typeof AppBskyRichtextFacetByteSlice;
                    link: typeof AppBskyRichtextFacetLink;
                    mention: typeof AppBskyRichtextFacetMention;
                    tag: typeof AppBskyRichtextFacetTag;
                };
            };
            unspecced: {
                defs: {
                    ageAssuranceEvent: typeof AppBskyUnspeccedDefsAgeAssuranceEvent;
                    ageAssuranceState: typeof AppBskyUnspeccedDefsAgeAssuranceState;
                    skeletonSearchActor: typeof AppBskyUnspeccedDefsSkeletonSearchActor;
                    skeletonSearchPost: typeof AppBskyUnspeccedDefsSkeletonSearchPost;
                    skeletonSearchStarterPack: typeof AppBskyUnspeccedDefsSkeletonSearchStarterPack;
                    skeletonTrend: typeof AppBskyUnspeccedDefsSkeletonTrend;
                    threadItemBlocked: typeof AppBskyUnspeccedDefsThreadItemBlocked;
                    threadItemNotFound: typeof AppBskyUnspeccedDefsThreadItemNotFound;
                    threadItemNoUnauthenticated: typeof AppBskyUnspeccedDefsThreadItemNoUnauthenticated;
                    threadItemPost: typeof AppBskyUnspeccedDefsThreadItemPost;
                    trendingTopic: typeof AppBskyUnspeccedDefsTrendingTopic;
                    trendView: typeof AppBskyUnspeccedDefsTrendView;
                };
                getAgeAssuranceState: typeof AppBskyUnspeccedGetAgeAssuranceState;
                getAtmosphereExploreArticleRecommendations: typeof AppBskyUnspeccedGetAtmosphereExploreArticleRecommendations & {
                    article: typeof AppBskyUnspeccedGetAtmosphereExploreArticleRecommendationsArticle;
                };
                getConfig: typeof AppBskyUnspeccedGetConfig & {
                    liveNowConfig: typeof AppBskyUnspeccedGetConfigLiveNowConfig;
                };
                getOnboardingSuggestedUsersSkeleton: typeof AppBskyUnspeccedGetOnboardingSuggestedUsersSkeleton;
                getPopularFeedGenerators: typeof AppBskyUnspeccedGetPopularFeedGenerators;
                getPostThreadOtherV2: typeof AppBskyUnspeccedGetPostThreadOtherV2 & {
                    threadItem: typeof AppBskyUnspeccedGetPostThreadOtherV2ThreadItem;
                };
                getPostThreadV2: typeof AppBskyUnspeccedGetPostThreadV2 & {
                    threadItem: typeof AppBskyUnspeccedGetPostThreadV2ThreadItem;
                };
                getSuggestedOnboardingUsers: typeof AppBskyUnspeccedGetSuggestedOnboardingUsers;
                getSuggestedUsers: typeof AppBskyUnspeccedGetSuggestedUsers;
                getSuggestedUsersForDiscover: typeof AppBskyUnspeccedGetSuggestedUsersForDiscover;
                getSuggestedUsersForDiscoverSkeleton: typeof AppBskyUnspeccedGetSuggestedUsersForDiscoverSkeleton;
                getSuggestedUsersForExplore: typeof AppBskyUnspeccedGetSuggestedUsersForExplore;
                getSuggestedUsersForExploreSkeleton: typeof AppBskyUnspeccedGetSuggestedUsersForExploreSkeleton;
                getSuggestedUsersForSeeMore: typeof AppBskyUnspeccedGetSuggestedUsersForSeeMore;
                getSuggestedUsersForSeeMoreSkeleton: typeof AppBskyUnspeccedGetSuggestedUsersForSeeMoreSkeleton;
                getSuggestedUsersSkeleton: typeof AppBskyUnspeccedGetSuggestedUsersSkeleton;
                getSuggestionsSkeleton: typeof AppBskyUnspeccedGetSuggestionsSkeleton;
                getTaggedSuggestions: typeof AppBskyUnspeccedGetTaggedSuggestions & {
                    suggestion: typeof AppBskyUnspeccedGetTaggedSuggestionsSuggestion;
                };
                getTrendingTopics: typeof AppBskyUnspeccedGetTrendingTopics;
                getTrends: typeof AppBskyUnspeccedGetTrends;
                getTrendsSkeleton: typeof AppBskyUnspeccedGetTrendsSkeleton;
                initAgeAssurance: typeof AppBskyUnspeccedInitAgeAssurance;
                searchActorsSkeleton: typeof AppBskyUnspeccedSearchActorsSkeleton;
                searchPostsSkeleton: typeof AppBskyUnspeccedSearchPostsSkeleton;
                searchStarterPacksSkeleton: typeof AppBskyUnspeccedSearchStarterPacksSkeleton;
            };
            video: {
                abortUpload: typeof AppBskyVideoAbortUpload;
                defs: {
                    jobStatus: typeof AppBskyVideoDefsJobStatus;
                };
                finishUpload: typeof AppBskyVideoFinishUpload;
                getJobStatus: typeof AppBskyVideoGetJobStatus;
                getUploadLimits: typeof AppBskyVideoGetUploadLimits;
                getUploadStatus: typeof AppBskyVideoGetUploadStatus;
                startUpload: typeof AppBskyVideoStartUpload;
                uploadPart: typeof AppBskyVideoUploadPart;
                uploadVideo: typeof AppBskyVideoUploadVideo;
            };
        };
    };
    chat: {
        bsky: {
            actor: {
                declaration: typeof ChatBskyActorDeclaration;
                defs: {
                    directConvoMember: typeof ChatBskyActorDefsDirectConvoMember;
                    groupConvoMember: typeof ChatBskyActorDefsGroupConvoMember;
                    memberRole: typeof ChatBskyActorDefsMemberRole;
                    pastGroupConvoMember: typeof ChatBskyActorDefsPastGroupConvoMember;
                    profileViewBasic: typeof ChatBskyActorDefsProfileViewBasic;
                };
                deleteAccount: typeof ChatBskyActorDeleteAccount;
                exportAccountData: typeof ChatBskyActorExportAccountData;
                getStatus: typeof ChatBskyActorGetStatus;
            };
            convo: {
                acceptConvo: typeof ChatBskyConvoAcceptConvo;
                addReaction: typeof ChatBskyConvoAddReaction;
                defs: {
                    convoKind: typeof ChatBskyConvoDefsConvoKind;
                    convoLockStatus: typeof ChatBskyConvoDefsConvoLockStatus;
                    convoRef: typeof ChatBskyConvoDefsConvoRef;
                    convoStatus: typeof ChatBskyConvoDefsConvoStatus;
                    convoView: typeof ChatBskyConvoDefsConvoView;
                    deletedMessageView: typeof ChatBskyConvoDefsDeletedMessageView;
                    directConvo: typeof ChatBskyConvoDefsDirectConvo;
                    groupConvo: typeof ChatBskyConvoDefsGroupConvo;
                    logAcceptConvo: typeof ChatBskyConvoDefsLogAcceptConvo;
                    logAddMember: typeof ChatBskyConvoDefsLogAddMember;
                    logAddReaction: typeof ChatBskyConvoDefsLogAddReaction;
                    logApproveJoinRequest: typeof ChatBskyConvoDefsLogApproveJoinRequest;
                    logBeginConvo: typeof ChatBskyConvoDefsLogBeginConvo;
                    logCreateJoinLink: typeof ChatBskyConvoDefsLogCreateJoinLink;
                    logCreateMessage: typeof ChatBskyConvoDefsLogCreateMessage;
                    logDeleteMessage: typeof ChatBskyConvoDefsLogDeleteMessage;
                    logDisableJoinLink: typeof ChatBskyConvoDefsLogDisableJoinLink;
                    logEditGroup: typeof ChatBskyConvoDefsLogEditGroup;
                    logEditJoinLink: typeof ChatBskyConvoDefsLogEditJoinLink;
                    logEnableJoinLink: typeof ChatBskyConvoDefsLogEnableJoinLink;
                    logIncomingJoinRequest: typeof ChatBskyConvoDefsLogIncomingJoinRequest;
                    logLeaveConvo: typeof ChatBskyConvoDefsLogLeaveConvo;
                    logLockConvo: typeof ChatBskyConvoDefsLogLockConvo;
                    logLockConvoPermanently: typeof ChatBskyConvoDefsLogLockConvoPermanently;
                    logMemberJoin: typeof ChatBskyConvoDefsLogMemberJoin;
                    logMemberLeave: typeof ChatBskyConvoDefsLogMemberLeave;
                    logMuteConvo: typeof ChatBskyConvoDefsLogMuteConvo;
                    logOutgoingJoinRequest: typeof ChatBskyConvoDefsLogOutgoingJoinRequest;
                    logReadConvo: typeof ChatBskyConvoDefsLogReadConvo;
                    logReadJoinRequests: typeof ChatBskyConvoDefsLogReadJoinRequests;
                    logReadMessage: typeof ChatBskyConvoDefsLogReadMessage;
                    logRejectJoinRequest: typeof ChatBskyConvoDefsLogRejectJoinRequest;
                    logRemoveMember: typeof ChatBskyConvoDefsLogRemoveMember;
                    logRemoveReaction: typeof ChatBskyConvoDefsLogRemoveReaction;
                    logUnlockConvo: typeof ChatBskyConvoDefsLogUnlockConvo;
                    logUnmuteConvo: typeof ChatBskyConvoDefsLogUnmuteConvo;
                    logWithdrawIncomingJoinRequest: typeof ChatBskyConvoDefsLogWithdrawIncomingJoinRequest;
                    logWithdrawOutgoingJoinRequest: typeof ChatBskyConvoDefsLogWithdrawOutgoingJoinRequest;
                    messageAndReactionView: typeof ChatBskyConvoDefsMessageAndReactionView;
                    messageBeforeUserJoinedGroupView: typeof ChatBskyConvoDefsMessageBeforeUserJoinedGroupView;
                    messageInput: typeof ChatBskyConvoDefsMessageInput;
                    messageRef: typeof ChatBskyConvoDefsMessageRef;
                    messageView: typeof ChatBskyConvoDefsMessageView;
                    messageViewSender: typeof ChatBskyConvoDefsMessageViewSender;
                    reactionView: typeof ChatBskyConvoDefsReactionView;
                    reactionViewSender: typeof ChatBskyConvoDefsReactionViewSender;
                    replyRef: typeof ChatBskyConvoDefsReplyRef;
                    systemMessageDataAddMember: typeof ChatBskyConvoDefsSystemMessageDataAddMember;
                    systemMessageDataCreateJoinLink: typeof ChatBskyConvoDefsSystemMessageDataCreateJoinLink;
                    systemMessageDataDisableJoinLink: typeof ChatBskyConvoDefsSystemMessageDataDisableJoinLink;
                    systemMessageDataEditGroup: typeof ChatBskyConvoDefsSystemMessageDataEditGroup;
                    systemMessageDataEditJoinLink: typeof ChatBskyConvoDefsSystemMessageDataEditJoinLink;
                    systemMessageDataEnableJoinLink: typeof ChatBskyConvoDefsSystemMessageDataEnableJoinLink;
                    systemMessageDataLockConvo: typeof ChatBskyConvoDefsSystemMessageDataLockConvo;
                    systemMessageDataLockConvoPermanently: typeof ChatBskyConvoDefsSystemMessageDataLockConvoPermanently;
                    systemMessageDataMemberJoin: typeof ChatBskyConvoDefsSystemMessageDataMemberJoin;
                    systemMessageDataMemberLeave: typeof ChatBskyConvoDefsSystemMessageDataMemberLeave;
                    systemMessageDataRemoveMember: typeof ChatBskyConvoDefsSystemMessageDataRemoveMember;
                    systemMessageDataUnlockConvo: typeof ChatBskyConvoDefsSystemMessageDataUnlockConvo;
                    systemMessageReferredUser: typeof ChatBskyConvoDefsSystemMessageReferredUser;
                    systemMessageView: typeof ChatBskyConvoDefsSystemMessageView;
                };
                deleteMessageForSelf: typeof ChatBskyConvoDeleteMessageForSelf;
                getConvo: typeof ChatBskyConvoGetConvo;
                getConvoAvailability: typeof ChatBskyConvoGetConvoAvailability;
                getConvoForMembers: typeof ChatBskyConvoGetConvoForMembers;
                getConvoMembers: typeof ChatBskyConvoGetConvoMembers;
                getLog: typeof ChatBskyConvoGetLog;
                getMessages: typeof ChatBskyConvoGetMessages;
                getUnreadCounts: typeof ChatBskyConvoGetUnreadCounts;
                listConvoRequests: typeof ChatBskyConvoListConvoRequests;
                listConvos: typeof ChatBskyConvoListConvos;
                lockConvo: typeof ChatBskyConvoLockConvo;
                muteConvo: typeof ChatBskyConvoMuteConvo;
                removeReaction: typeof ChatBskyConvoRemoveReaction;
                sendMessage: typeof ChatBskyConvoSendMessage;
                sendMessageBatch: typeof ChatBskyConvoSendMessageBatch & {
                    batchItem: typeof ChatBskyConvoSendMessageBatchBatchItem;
                };
                unlockConvo: typeof ChatBskyConvoUnlockConvo;
                unmuteConvo: typeof ChatBskyConvoUnmuteConvo;
                updateAllRead: typeof ChatBskyConvoUpdateAllRead;
                updateRead: typeof ChatBskyConvoUpdateRead;
            };
            embed: {
                joinLink: typeof ChatBskyEmbedJoinLink & {
                    view: typeof ChatBskyEmbedJoinLinkView;
                };
            };
            group: {
                addMembers: typeof ChatBskyGroupAddMembers;
                approveJoinRequest: typeof ChatBskyGroupApproveJoinRequest;
                createGroup: typeof ChatBskyGroupCreateGroup;
                createJoinLink: typeof ChatBskyGroupCreateJoinLink;
                defs: {
                    disabledJoinLinkPreviewView: typeof ChatBskyGroupDefsDisabledJoinLinkPreviewView;
                    invalidJoinLinkPreviewView: typeof ChatBskyGroupDefsInvalidJoinLinkPreviewView;
                    joinLinkPreviewView: typeof ChatBskyGroupDefsJoinLinkPreviewView;
                    joinLinkView: typeof ChatBskyGroupDefsJoinLinkView;
                    joinLinkViewerState: typeof ChatBskyGroupDefsJoinLinkViewerState;
                    joinRequestConvoView: typeof ChatBskyGroupDefsJoinRequestConvoView;
                    joinRequestView: typeof ChatBskyGroupDefsJoinRequestView;
                    joinRule: typeof ChatBskyGroupDefsJoinRule;
                    linkEnabledStatus: typeof ChatBskyGroupDefsLinkEnabledStatus;
                };
                disableJoinLink: typeof ChatBskyGroupDisableJoinLink;
                editGroup: typeof ChatBskyGroupEditGroup;
                editJoinLink: typeof ChatBskyGroupEditJoinLink;
                enableJoinLink: typeof ChatBskyGroupEnableJoinLink;
                getJoinLinkPreviews: typeof ChatBskyGroupGetJoinLinkPreviews;
                listJoinRequests: typeof ChatBskyGroupListJoinRequests;
                listMutualGroups: typeof ChatBskyGroupListMutualGroups;
                rejectJoinRequest: typeof ChatBskyGroupRejectJoinRequest;
                removeMembers: typeof ChatBskyGroupRemoveMembers;
                requestJoin: typeof ChatBskyGroupRequestJoin;
                updateJoinRequestsRead: typeof ChatBskyGroupUpdateJoinRequestsRead;
                withdrawJoinRequest: typeof ChatBskyGroupWithdrawJoinRequest;
            };
            moderation: {
                defs: {
                    convoView: typeof ChatBskyModerationDefsConvoView;
                    directConvo: typeof ChatBskyModerationDefsDirectConvo;
                    groupConvo: typeof ChatBskyModerationDefsGroupConvo;
                };
                getActorMetadata: typeof ChatBskyModerationGetActorMetadata & {
                    metadata: typeof ChatBskyModerationGetActorMetadataMetadata;
                };
                getConvo: typeof ChatBskyModerationGetConvo;
                getConvoMembers: typeof ChatBskyModerationGetConvoMembers;
                getConvos: typeof ChatBskyModerationGetConvos;
                getMessageContext: typeof ChatBskyModerationGetMessageContext;
                subscribeModEvents: typeof ChatBskyModerationSubscribeModEvents & {
                    eventChatAccepted: typeof ChatBskyModerationSubscribeModEventsEventChatAccepted;
                    eventConvoFirstMessage: typeof ChatBskyModerationSubscribeModEventsEventConvoFirstMessage;
                    eventGroupChatCreated: typeof ChatBskyModerationSubscribeModEventsEventGroupChatCreated;
                    eventGroupChatJoinRequest: typeof ChatBskyModerationSubscribeModEventsEventGroupChatJoinRequest;
                    eventGroupChatJoinRequestApproved: typeof ChatBskyModerationSubscribeModEventsEventGroupChatJoinRequestApproved;
                    eventGroupChatJoinRequestRejected: typeof ChatBskyModerationSubscribeModEventsEventGroupChatJoinRequestRejected;
                    eventGroupChatMemberAdded: typeof ChatBskyModerationSubscribeModEventsEventGroupChatMemberAdded;
                    eventGroupChatMemberJoined: typeof ChatBskyModerationSubscribeModEventsEventGroupChatMemberJoined;
                    eventGroupChatMemberLeft: typeof ChatBskyModerationSubscribeModEventsEventGroupChatMemberLeft;
                    eventGroupChatUpdated: typeof ChatBskyModerationSubscribeModEventsEventGroupChatUpdated;
                    eventRateLimitExceeded: typeof ChatBskyModerationSubscribeModEventsEventRateLimitExceeded;
                };
                updateActorAccess: typeof ChatBskyModerationUpdateActorAccess;
            };
            notification: {
                defs: {
                    chatPreference: typeof ChatBskyNotificationDefsChatPreference;
                    preferences: typeof ChatBskyNotificationDefsPreferences;
                };
                getPreferences: typeof ChatBskyNotificationGetPreferences;
                putPreferences: typeof ChatBskyNotificationPutPreferences;
            };
        };
    };
    com: {
        atproto: {
            admin: {
                defs: {
                    accountView: typeof ComAtprotoAdminDefsAccountView;
                    repoBlobRef: typeof ComAtprotoAdminDefsRepoBlobRef;
                    repoRef: typeof ComAtprotoAdminDefsRepoRef;
                    statusAttr: typeof ComAtprotoAdminDefsStatusAttr;
                    threatSignature: typeof ComAtprotoAdminDefsThreatSignature;
                };
                deleteAccount: typeof ComAtprotoAdminDeleteAccount;
                disableAccountInvites: typeof ComAtprotoAdminDisableAccountInvites;
                disableInviteCodes: typeof ComAtprotoAdminDisableInviteCodes;
                enableAccountInvites: typeof ComAtprotoAdminEnableAccountInvites;
                getAccountInfo: typeof ComAtprotoAdminGetAccountInfo;
                getAccountInfos: typeof ComAtprotoAdminGetAccountInfos;
                getInviteCodes: typeof ComAtprotoAdminGetInviteCodes;
                getSubjectStatus: typeof ComAtprotoAdminGetSubjectStatus;
                searchAccounts: typeof ComAtprotoAdminSearchAccounts;
                sendEmail: typeof ComAtprotoAdminSendEmail;
                updateAccountEmail: typeof ComAtprotoAdminUpdateAccountEmail;
                updateAccountHandle: typeof ComAtprotoAdminUpdateAccountHandle;
                updateAccountPassword: typeof ComAtprotoAdminUpdateAccountPassword;
                updateAccountSigningKey: typeof ComAtprotoAdminUpdateAccountSigningKey;
                updateSubjectStatus: typeof ComAtprotoAdminUpdateSubjectStatus;
            };
            identity: {
                defs: {
                    identityInfo: typeof ComAtprotoIdentityDefsIdentityInfo;
                };
                getRecommendedDidCredentials: typeof ComAtprotoIdentityGetRecommendedDidCredentials;
                refreshIdentity: typeof ComAtprotoIdentityRefreshIdentity;
                requestPlcOperationSignature: typeof ComAtprotoIdentityRequestPlcOperationSignature;
                resolveDid: typeof ComAtprotoIdentityResolveDid;
                resolveHandle: typeof ComAtprotoIdentityResolveHandle;
                resolveIdentity: typeof ComAtprotoIdentityResolveIdentity;
                signPlcOperation: typeof ComAtprotoIdentitySignPlcOperation;
                submitPlcOperation: typeof ComAtprotoIdentitySubmitPlcOperation;
                updateHandle: typeof ComAtprotoIdentityUpdateHandle;
            };
            label: {
                defs: {
                    label: typeof ComAtprotoLabelDefsLabel;
                    labelValue: typeof ComAtprotoLabelDefsLabelValue;
                    labelValueDefinition: typeof ComAtprotoLabelDefsLabelValueDefinition;
                    labelValueDefinitionStrings: typeof ComAtprotoLabelDefsLabelValueDefinitionStrings;
                    selfLabel: typeof ComAtprotoLabelDefsSelfLabel;
                    selfLabels: typeof ComAtprotoLabelDefsSelfLabels;
                };
                queryLabels: typeof ComAtprotoLabelQueryLabels;
                record: typeof ComAtprotoLabelRecord;
                subscribeLabels: typeof ComAtprotoLabelSubscribeLabels & {
                    info: typeof ComAtprotoLabelSubscribeLabelsInfo;
                    labels: typeof ComAtprotoLabelSubscribeLabelsLabels;
                };
            };
            lexicon: {
                resolveLexicon: typeof ComAtprotoLexiconResolveLexicon;
                schema: typeof ComAtprotoLexiconSchema;
            };
            moderation: {
                createReport: typeof ComAtprotoModerationCreateReport & {
                    modTool: typeof ComAtprotoModerationCreateReportModTool;
                };
                defs: {
                    reasonAppeal: typeof ComAtprotoModerationDefsReasonAppeal;
                    reasonMisleading: typeof ComAtprotoModerationDefsReasonMisleading;
                    reasonOther: typeof ComAtprotoModerationDefsReasonOther;
                    reasonRude: typeof ComAtprotoModerationDefsReasonRude;
                    reasonSexual: typeof ComAtprotoModerationDefsReasonSexual;
                    reasonSpam: typeof ComAtprotoModerationDefsReasonSpam;
                    reasonType: typeof ComAtprotoModerationDefsReasonType;
                    reasonViolation: typeof ComAtprotoModerationDefsReasonViolation;
                    subjectType: typeof ComAtprotoModerationDefsSubjectType;
                };
            };
            repo: {
                applyWrites: typeof ComAtprotoRepoApplyWrites & {
                    create: typeof ComAtprotoRepoApplyWritesCreate;
                    createResult: typeof ComAtprotoRepoApplyWritesCreateResult;
                    delete: typeof ComAtprotoRepoApplyWritesDelete;
                    deleteResult: typeof ComAtprotoRepoApplyWritesDeleteResult;
                    update: typeof ComAtprotoRepoApplyWritesUpdate;
                    updateResult: typeof ComAtprotoRepoApplyWritesUpdateResult;
                };
                createRecord: typeof ComAtprotoRepoCreateRecord;
                defs: {
                    commitMeta: typeof ComAtprotoRepoDefsCommitMeta;
                };
                deleteRecord: typeof ComAtprotoRepoDeleteRecord;
                describeRepo: typeof ComAtprotoRepoDescribeRepo;
                getRecord: typeof ComAtprotoRepoGetRecord;
                importRepo: typeof ComAtprotoRepoImportRepo;
                listMissingBlobs: typeof ComAtprotoRepoListMissingBlobs & {
                    recordBlob: typeof ComAtprotoRepoListMissingBlobsRecordBlob;
                };
                listRecords: typeof ComAtprotoRepoListRecords & {
                    record: typeof ComAtprotoRepoListRecordsRecord;
                };
                putRecord: typeof ComAtprotoRepoPutRecord;
                strongRef: typeof ComAtprotoRepoStrongRef;
                uploadBlob: typeof ComAtprotoRepoUploadBlob;
            };
            server: {
                activateAccount: typeof ComAtprotoServerActivateAccount;
                checkAccountStatus: typeof ComAtprotoServerCheckAccountStatus;
                confirmEmail: typeof ComAtprotoServerConfirmEmail;
                createAccount: typeof ComAtprotoServerCreateAccount;
                createAppPassword: typeof ComAtprotoServerCreateAppPassword & {
                    appPassword: typeof ComAtprotoServerCreateAppPasswordAppPassword;
                };
                createInviteCode: typeof ComAtprotoServerCreateInviteCode;
                createInviteCodes: typeof ComAtprotoServerCreateInviteCodes & {
                    accountCodes: typeof ComAtprotoServerCreateInviteCodesAccountCodes;
                };
                createSession: typeof ComAtprotoServerCreateSession;
                deactivateAccount: typeof ComAtprotoServerDeactivateAccount;
                defs: {
                    inviteCode: typeof ComAtprotoServerDefsInviteCode;
                    inviteCodeUse: typeof ComAtprotoServerDefsInviteCodeUse;
                };
                deleteAccount: typeof ComAtprotoServerDeleteAccount;
                deleteSession: typeof ComAtprotoServerDeleteSession;
                describeServer: typeof ComAtprotoServerDescribeServer & {
                    contact: typeof ComAtprotoServerDescribeServerContact;
                    links: typeof ComAtprotoServerDescribeServerLinks;
                };
                getAccountInviteCodes: typeof ComAtprotoServerGetAccountInviteCodes;
                getServiceAuth: typeof ComAtprotoServerGetServiceAuth;
                getSession: typeof ComAtprotoServerGetSession;
                listAppPasswords: typeof ComAtprotoServerListAppPasswords & {
                    appPassword: typeof ComAtprotoServerListAppPasswordsAppPassword;
                };
                refreshSession: typeof ComAtprotoServerRefreshSession;
                requestAccountDelete: typeof ComAtprotoServerRequestAccountDelete;
                requestEmailConfirmation: typeof ComAtprotoServerRequestEmailConfirmation;
                requestEmailUpdate: typeof ComAtprotoServerRequestEmailUpdate;
                requestPasswordReset: typeof ComAtprotoServerRequestPasswordReset;
                reserveSigningKey: typeof ComAtprotoServerReserveSigningKey;
                resetPassword: typeof ComAtprotoServerResetPassword;
                revokeAppPassword: typeof ComAtprotoServerRevokeAppPassword;
                updateEmail: typeof ComAtprotoServerUpdateEmail;
            };
            sync: {
                defs: {
                    hostStatus: typeof ComAtprotoSyncDefsHostStatus;
                };
                getBlob: typeof ComAtprotoSyncGetBlob;
                getBlocks: typeof ComAtprotoSyncGetBlocks;
                getCheckout: typeof ComAtprotoSyncGetCheckout;
                getHead: typeof ComAtprotoSyncGetHead;
                getHostStatus: typeof ComAtprotoSyncGetHostStatus;
                getLatestCommit: typeof ComAtprotoSyncGetLatestCommit;
                getRecord: typeof ComAtprotoSyncGetRecord;
                getRepo: typeof ComAtprotoSyncGetRepo;
                getRepoStatus: typeof ComAtprotoSyncGetRepoStatus;
                listBlobs: typeof ComAtprotoSyncListBlobs;
                listHosts: typeof ComAtprotoSyncListHosts & {
                    host: typeof ComAtprotoSyncListHostsHost;
                };
                listRepos: typeof ComAtprotoSyncListRepos & {
                    repo: typeof ComAtprotoSyncListReposRepo;
                };
                listReposByCollection: typeof ComAtprotoSyncListReposByCollection & {
                    repo: typeof ComAtprotoSyncListReposByCollectionRepo;
                };
                notifyOfUpdate: typeof ComAtprotoSyncNotifyOfUpdate;
                requestCrawl: typeof ComAtprotoSyncRequestCrawl;
                subscribeRepos: typeof ComAtprotoSyncSubscribeRepos & {
                    account: typeof ComAtprotoSyncSubscribeReposAccount;
                    commit: typeof ComAtprotoSyncSubscribeReposCommit;
                    identity: typeof ComAtprotoSyncSubscribeReposIdentity;
                    info: typeof ComAtprotoSyncSubscribeReposInfo;
                    repoOp: typeof ComAtprotoSyncSubscribeReposRepoOp;
                    sync: typeof ComAtprotoSyncSubscribeReposSync;
                };
            };
            temp: {
                addReservedHandle: typeof ComAtprotoTempAddReservedHandle;
                checkHandleAvailability: typeof ComAtprotoTempCheckHandleAvailability & {
                    resultAvailable: typeof ComAtprotoTempCheckHandleAvailabilityResultAvailable;
                    resultUnavailable: typeof ComAtprotoTempCheckHandleAvailabilityResultUnavailable;
                    suggestion: typeof ComAtprotoTempCheckHandleAvailabilitySuggestion;
                };
                checkSignupQueue: typeof ComAtprotoTempCheckSignupQueue;
                dereferenceScope: typeof ComAtprotoTempDereferenceScope;
                fetchLabels: typeof ComAtprotoTempFetchLabels;
                requestPhoneVerification: typeof ComAtprotoTempRequestPhoneVerification;
                revokeAccountCredentials: typeof ComAtprotoTempRevokeAccountCredentials;
            };
        };
    };
};
export {};
