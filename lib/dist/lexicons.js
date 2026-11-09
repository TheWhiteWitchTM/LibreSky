// lib/src/generated/models.ts
import { ProtocolError, ValidationError } from "./index.js";
import { jsonOf } from "./index.js";
var AppBskyActorContentVisibilityDeclaration = class _AppBskyActorContentVisibilityDeclaration {
  static nsid = "app.bsky.actor.contentVisibilityDeclaration";
  static def = "main";
  static kind = "record";
  static recordKey = "literal:self";
  $type;
  hideFromAlgorithmicRecommendations;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.actor.contentVisibilityDeclaration";
  }
  check() {
    const issues = [];
    if (this["hideFromAlgorithmicRecommendations"] == null) issues.push({ path: "hideFromAlgorithmicRecommendations", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      hideFromAlgorithmicRecommendations: this["hideFromAlgorithmicRecommendations"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyActorContentVisibilityDeclaration(value);
    record.check();
    return record;
  }
};
var AppBskyActorDefsAdultContentPref = class _AppBskyActorDefsAdultContentPref {
  static nsid = "app.bsky.actor.defs";
  static def = "adultContentPref";
  static kind = "object";
  $type;
  enabled;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.actor.defs#adultContentPref";
  }
  check() {
    const issues = [];
    if (this["enabled"] == null) issues.push({ path: "enabled", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      enabled: this["enabled"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyActorDefsAdultContentPref(value);
    record.check();
    return record;
  }
};
var AppBskyActorDefsBskyAppProgressGuide = class _AppBskyActorDefsBskyAppProgressGuide {
  static nsid = "app.bsky.actor.defs";
  static def = "bskyAppProgressGuide";
  static kind = "object";
  $type;
  guide;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.actor.defs#bskyAppProgressGuide";
  }
  check() {
    const issues = [];
    if (this["guide"] == null) issues.push({ path: "guide", message: "Required." });
    if (typeof this["guide"] === "string" && this["guide"].length > 100) issues.push({ path: "guide", message: "Must be at most 100 characters." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      guide: this["guide"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyActorDefsBskyAppProgressGuide(value);
    record.check();
    return record;
  }
};
var AppBskyActorDefsBskyAppStatePref = class _AppBskyActorDefsBskyAppStatePref {
  static nsid = "app.bsky.actor.defs";
  static def = "bskyAppStatePref";
  static kind = "object";
  $type;
  activeProgressGuide;
  isBetaUser;
  queuedNudges;
  nuxs;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.actor.defs#bskyAppStatePref";
  }
  check() {
    const issues = [];
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      activeProgressGuide: this["activeProgressGuide"],
      isBetaUser: this["isBetaUser"],
      queuedNudges: this["queuedNudges"],
      nuxs: this["nuxs"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyActorDefsBskyAppStatePref(value);
    record.check();
    return record;
  }
};
var AppBskyActorDefsContentLabelPref = class _AppBskyActorDefsContentLabelPref {
  static nsid = "app.bsky.actor.defs";
  static def = "contentLabelPref";
  static kind = "object";
  $type;
  labelerDid;
  label;
  visibility;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.actor.defs#contentLabelPref";
  }
  check() {
    const issues = [];
    if (this["label"] == null) issues.push({ path: "label", message: "Required." });
    if (this["visibility"] == null) issues.push({ path: "visibility", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      labelerDid: this["labelerDid"],
      label: this["label"],
      visibility: this["visibility"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyActorDefsContentLabelPref(value);
    record.check();
    return record;
  }
};
var AppBskyActorDefsDeclaredAgePref = class _AppBskyActorDefsDeclaredAgePref {
  static nsid = "app.bsky.actor.defs";
  static def = "declaredAgePref";
  static kind = "object";
  $type;
  isOverAge13;
  isOverAge16;
  isOverAge18;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.actor.defs#declaredAgePref";
  }
  check() {
    const issues = [];
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      isOverAge13: this["isOverAge13"],
      isOverAge16: this["isOverAge16"],
      isOverAge18: this["isOverAge18"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyActorDefsDeclaredAgePref(value);
    record.check();
    return record;
  }
};
var AppBskyActorDefsFeedViewPref = class _AppBskyActorDefsFeedViewPref {
  static nsid = "app.bsky.actor.defs";
  static def = "feedViewPref";
  static kind = "object";
  $type;
  feed;
  hideReplies;
  hideRepliesByUnfollowed;
  hideRepliesByLikeCount;
  hideReposts;
  hideQuotePosts;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.actor.defs#feedViewPref";
  }
  check() {
    const issues = [];
    if (this["feed"] == null) issues.push({ path: "feed", message: "Required." });
    if (this["hideRepliesByLikeCount"] != null) {
      if (!Number.isInteger(this["hideRepliesByLikeCount"])) issues.push({ path: "hideRepliesByLikeCount", message: "Must be an integer." });
    }
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      feed: this["feed"],
      hideReplies: this["hideReplies"],
      hideRepliesByUnfollowed: this["hideRepliesByUnfollowed"],
      hideRepliesByLikeCount: this["hideRepliesByLikeCount"],
      hideReposts: this["hideReposts"],
      hideQuotePosts: this["hideQuotePosts"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyActorDefsFeedViewPref(value);
    record.check();
    return record;
  }
};
var AppBskyActorDefsHiddenPostsPref = class _AppBskyActorDefsHiddenPostsPref {
  static nsid = "app.bsky.actor.defs";
  static def = "hiddenPostsPref";
  static kind = "object";
  $type;
  items;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.actor.defs#hiddenPostsPref";
  }
  check() {
    const issues = [];
    if (this["items"] == null) issues.push({ path: "items", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      items: this["items"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyActorDefsHiddenPostsPref(value);
    record.check();
    return record;
  }
};
var AppBskyActorDefsInterestsPref = class _AppBskyActorDefsInterestsPref {
  static nsid = "app.bsky.actor.defs";
  static def = "interestsPref";
  static kind = "object";
  $type;
  updatedAt;
  tags;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.actor.defs#interestsPref";
  }
  check() {
    const issues = [];
    if (this["tags"] == null) issues.push({ path: "tags", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      updatedAt: this["updatedAt"],
      tags: this["tags"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyActorDefsInterestsPref(value);
    record.check();
    return record;
  }
};
var AppBskyActorDefsKnownFollowers = class _AppBskyActorDefsKnownFollowers {
  static nsid = "app.bsky.actor.defs";
  static def = "knownFollowers";
  static kind = "object";
  $type;
  count;
  followers;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.actor.defs#knownFollowers";
  }
  check() {
    const issues = [];
    if (this["count"] == null) issues.push({ path: "count", message: "Required." });
    if (this["count"] != null) {
      if (!Number.isInteger(this["count"])) issues.push({ path: "count", message: "Must be an integer." });
    }
    if (this["followers"] == null) issues.push({ path: "followers", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      count: this["count"],
      followers: this["followers"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyActorDefsKnownFollowers(value);
    record.check();
    return record;
  }
};
var AppBskyActorDefsLabelerPrefItem = class _AppBskyActorDefsLabelerPrefItem {
  static nsid = "app.bsky.actor.defs";
  static def = "labelerPrefItem";
  static kind = "object";
  $type;
  did;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.actor.defs#labelerPrefItem";
  }
  check() {
    const issues = [];
    if (this["did"] == null) issues.push({ path: "did", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      did: this["did"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyActorDefsLabelerPrefItem(value);
    record.check();
    return record;
  }
};
var AppBskyActorDefsLabelersPref = class _AppBskyActorDefsLabelersPref {
  static nsid = "app.bsky.actor.defs";
  static def = "labelersPref";
  static kind = "object";
  $type;
  labelers;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.actor.defs#labelersPref";
  }
  check() {
    const issues = [];
    if (this["labelers"] == null) issues.push({ path: "labelers", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      labelers: this["labelers"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyActorDefsLabelersPref(value);
    record.check();
    return record;
  }
};
var AppBskyActorDefsLiveEventPreferences = class _AppBskyActorDefsLiveEventPreferences {
  static nsid = "app.bsky.actor.defs";
  static def = "liveEventPreferences";
  static kind = "object";
  $type;
  hiddenFeedIds;
  hideAllFeeds;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.actor.defs#liveEventPreferences";
  }
  check() {
    const issues = [];
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      hiddenFeedIds: this["hiddenFeedIds"],
      hideAllFeeds: this["hideAllFeeds"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyActorDefsLiveEventPreferences(value);
    record.check();
    return record;
  }
};
var AppBskyActorDefsMutedWord = class _AppBskyActorDefsMutedWord {
  static nsid = "app.bsky.actor.defs";
  static def = "mutedWord";
  static kind = "object";
  $type;
  id;
  value;
  targets;
  actorTarget;
  expiresAt;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.actor.defs#mutedWord";
  }
  check() {
    const issues = [];
    if (this["value"] == null) issues.push({ path: "value", message: "Required." });
    if (typeof this["value"] === "string" && this["value"].length > 1e4) issues.push({ path: "value", message: "Must be at most 10000 characters." });
    if (this["targets"] == null) issues.push({ path: "targets", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      id: this["id"],
      value: this["value"],
      targets: this["targets"],
      actorTarget: this["actorTarget"],
      expiresAt: this["expiresAt"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyActorDefsMutedWord(value);
    record.check();
    return record;
  }
};
var AppBskyActorDefsMutedWordsPref = class _AppBskyActorDefsMutedWordsPref {
  static nsid = "app.bsky.actor.defs";
  static def = "mutedWordsPref";
  static kind = "object";
  $type;
  items;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.actor.defs#mutedWordsPref";
  }
  check() {
    const issues = [];
    if (this["items"] == null) issues.push({ path: "items", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      items: this["items"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyActorDefsMutedWordsPref(value);
    record.check();
    return record;
  }
};
var AppBskyActorDefsMutedWordTarget = class _AppBskyActorDefsMutedWordTarget {
  static nsid = "app.bsky.actor.defs";
  static def = "mutedWordTarget";
  static kind = "string";
  static knownValues = ["content", "tag"];
  static includes(value) {
    return _AppBskyActorDefsMutedWordTarget.knownValues.includes(value);
  }
  constructor() {
  }
};
var AppBskyActorDefsNux = class _AppBskyActorDefsNux {
  static nsid = "app.bsky.actor.defs";
  static def = "nux";
  static kind = "object";
  $type;
  id;
  completed;
  data;
  expiresAt;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.actor.defs#nux";
  }
  check() {
    const issues = [];
    if (this["id"] == null) issues.push({ path: "id", message: "Required." });
    if (typeof this["id"] === "string" && this["id"].length > 100) issues.push({ path: "id", message: "Must be at most 100 characters." });
    if (this["completed"] == null) issues.push({ path: "completed", message: "Required." });
    if (typeof this["data"] === "string" && this["data"].length > 3e3) issues.push({ path: "data", message: "Must be at most 3000 characters." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      id: this["id"],
      completed: this["completed"],
      data: this["data"],
      expiresAt: this["expiresAt"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyActorDefsNux(value);
    record.check();
    return record;
  }
};
var AppBskyActorDefsPersonalDetailsPref = class _AppBskyActorDefsPersonalDetailsPref {
  static nsid = "app.bsky.actor.defs";
  static def = "personalDetailsPref";
  static kind = "object";
  $type;
  birthDate;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.actor.defs#personalDetailsPref";
  }
  check() {
    const issues = [];
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      birthDate: this["birthDate"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyActorDefsPersonalDetailsPref(value);
    record.check();
    return record;
  }
};
var AppBskyActorDefsPostInteractionSettingsPref = class _AppBskyActorDefsPostInteractionSettingsPref {
  static nsid = "app.bsky.actor.defs";
  static def = "postInteractionSettingsPref";
  static kind = "object";
  $type;
  threadgateAllowRules;
  postgateEmbeddingRules;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.actor.defs#postInteractionSettingsPref";
  }
  check() {
    const issues = [];
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      threadgateAllowRules: this["threadgateAllowRules"],
      postgateEmbeddingRules: this["postgateEmbeddingRules"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyActorDefsPostInteractionSettingsPref(value);
    record.check();
    return record;
  }
};
var AppBskyActorDefsPreferences = { nsid: "app.bsky.actor.defs", def: "preferences", kind: "array" };
var AppBskyActorDefsProfileAssociated = class _AppBskyActorDefsProfileAssociated {
  static nsid = "app.bsky.actor.defs";
  static def = "profileAssociated";
  static kind = "object";
  $type;
  lists;
  feedgens;
  starterPacks;
  labeler;
  chat;
  activitySubscription;
  germ;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.actor.defs#profileAssociated";
  }
  check() {
    const issues = [];
    if (this["lists"] != null) {
      if (!Number.isInteger(this["lists"])) issues.push({ path: "lists", message: "Must be an integer." });
    }
    if (this["feedgens"] != null) {
      if (!Number.isInteger(this["feedgens"])) issues.push({ path: "feedgens", message: "Must be an integer." });
    }
    if (this["starterPacks"] != null) {
      if (!Number.isInteger(this["starterPacks"])) issues.push({ path: "starterPacks", message: "Must be an integer." });
    }
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      lists: this["lists"],
      feedgens: this["feedgens"],
      starterPacks: this["starterPacks"],
      labeler: this["labeler"],
      chat: this["chat"],
      activitySubscription: this["activitySubscription"],
      germ: this["germ"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyActorDefsProfileAssociated(value);
    record.check();
    return record;
  }
};
var AppBskyActorDefsProfileAssociatedActivitySubscription = class _AppBskyActorDefsProfileAssociatedActivitySubscription {
  static nsid = "app.bsky.actor.defs";
  static def = "profileAssociatedActivitySubscription";
  static kind = "object";
  $type;
  allowSubscriptions;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.actor.defs#profileAssociatedActivitySubscription";
  }
  check() {
    const issues = [];
    if (this["allowSubscriptions"] == null) issues.push({ path: "allowSubscriptions", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      allowSubscriptions: this["allowSubscriptions"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyActorDefsProfileAssociatedActivitySubscription(value);
    record.check();
    return record;
  }
};
var AppBskyActorDefsProfileAssociatedChat = class _AppBskyActorDefsProfileAssociatedChat {
  static nsid = "app.bsky.actor.defs";
  static def = "profileAssociatedChat";
  static kind = "object";
  $type;
  allowIncoming;
  allowGroupInvites;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.actor.defs#profileAssociatedChat";
  }
  check() {
    const issues = [];
    if (this["allowIncoming"] == null) issues.push({ path: "allowIncoming", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      allowIncoming: this["allowIncoming"],
      allowGroupInvites: this["allowGroupInvites"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyActorDefsProfileAssociatedChat(value);
    record.check();
    return record;
  }
};
var AppBskyActorDefsProfileAssociatedGerm = class _AppBskyActorDefsProfileAssociatedGerm {
  static nsid = "app.bsky.actor.defs";
  static def = "profileAssociatedGerm";
  static kind = "object";
  $type;
  messageMeUrl;
  showButtonTo;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.actor.defs#profileAssociatedGerm";
  }
  check() {
    const issues = [];
    if (this["messageMeUrl"] == null) issues.push({ path: "messageMeUrl", message: "Required." });
    if (this["showButtonTo"] == null) issues.push({ path: "showButtonTo", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      messageMeUrl: this["messageMeUrl"],
      showButtonTo: this["showButtonTo"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyActorDefsProfileAssociatedGerm(value);
    record.check();
    return record;
  }
};
var AppBskyActorDefsProfileLinkView = class _AppBskyActorDefsProfileLinkView {
  static nsid = "app.bsky.actor.defs";
  static def = "profileLinkView";
  static kind = "object";
  $type;
  uri;
  cid;
  url;
  title;
  icon;
  labels;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.actor.defs#profileLinkView";
  }
  check() {
    const issues = [];
    if (this["uri"] == null) issues.push({ path: "uri", message: "Required." });
    if (this["cid"] == null) issues.push({ path: "cid", message: "Required." });
    if (this["url"] == null) issues.push({ path: "url", message: "Required." });
    if (typeof this["title"] === "string" && this["title"].length > 320) issues.push({ path: "title", message: "Must be at most 320 characters." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      uri: this["uri"],
      cid: this["cid"],
      url: this["url"],
      title: this["title"],
      icon: this["icon"],
      labels: this["labels"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyActorDefsProfileLinkView(value);
    record.check();
    return record;
  }
};
var AppBskyActorDefsProfileView = class _AppBskyActorDefsProfileView {
  static nsid = "app.bsky.actor.defs";
  static def = "profileView";
  static kind = "object";
  $type;
  did;
  handle;
  displayName;
  pronouns;
  description;
  avatar;
  associated;
  indexedAt;
  createdAt;
  viewer;
  labels;
  verification;
  status;
  debug;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.actor.defs#profileView";
  }
  check() {
    const issues = [];
    if (this["did"] == null) issues.push({ path: "did", message: "Required." });
    if (this["handle"] == null) issues.push({ path: "handle", message: "Required." });
    if (typeof this["displayName"] === "string" && this["displayName"].length > 640) issues.push({ path: "displayName", message: "Must be at most 640 characters." });
    if (typeof this["description"] === "string" && this["description"].length > 2560) issues.push({ path: "description", message: "Must be at most 2560 characters." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      did: this["did"],
      handle: this["handle"],
      displayName: this["displayName"],
      pronouns: this["pronouns"],
      description: this["description"],
      avatar: this["avatar"],
      associated: this["associated"],
      indexedAt: this["indexedAt"],
      createdAt: this["createdAt"],
      viewer: this["viewer"],
      labels: this["labels"],
      verification: this["verification"],
      status: this["status"],
      debug: this["debug"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyActorDefsProfileView(value);
    record.check();
    return record;
  }
};
var AppBskyActorDefsProfileViewBasic = class _AppBskyActorDefsProfileViewBasic {
  static nsid = "app.bsky.actor.defs";
  static def = "profileViewBasic";
  static kind = "object";
  $type;
  did;
  handle;
  displayName;
  pronouns;
  avatar;
  associated;
  viewer;
  labels;
  createdAt;
  verification;
  status;
  debug;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.actor.defs#profileViewBasic";
  }
  check() {
    const issues = [];
    if (this["did"] == null) issues.push({ path: "did", message: "Required." });
    if (this["handle"] == null) issues.push({ path: "handle", message: "Required." });
    if (typeof this["displayName"] === "string" && this["displayName"].length > 640) issues.push({ path: "displayName", message: "Must be at most 640 characters." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      did: this["did"],
      handle: this["handle"],
      displayName: this["displayName"],
      pronouns: this["pronouns"],
      avatar: this["avatar"],
      associated: this["associated"],
      viewer: this["viewer"],
      labels: this["labels"],
      createdAt: this["createdAt"],
      verification: this["verification"],
      status: this["status"],
      debug: this["debug"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyActorDefsProfileViewBasic(value);
    record.check();
    return record;
  }
};
var AppBskyActorDefsProfileViewDetailed = class _AppBskyActorDefsProfileViewDetailed {
  static nsid = "app.bsky.actor.defs";
  static def = "profileViewDetailed";
  static kind = "object";
  $type;
  did;
  handle;
  displayName;
  description;
  pronouns;
  website;
  avatar;
  banner;
  followersCount;
  followsCount;
  postsCount;
  associated;
  joinedViaStarterPack;
  indexedAt;
  createdAt;
  viewer;
  labels;
  pinnedPost;
  links;
  verification;
  status;
  debug;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.actor.defs#profileViewDetailed";
  }
  check() {
    const issues = [];
    if (this["did"] == null) issues.push({ path: "did", message: "Required." });
    if (this["handle"] == null) issues.push({ path: "handle", message: "Required." });
    if (typeof this["displayName"] === "string" && this["displayName"].length > 640) issues.push({ path: "displayName", message: "Must be at most 640 characters." });
    if (typeof this["description"] === "string" && this["description"].length > 2560) issues.push({ path: "description", message: "Must be at most 2560 characters." });
    if (this["followersCount"] != null) {
      if (!Number.isInteger(this["followersCount"])) issues.push({ path: "followersCount", message: "Must be an integer." });
    }
    if (this["followsCount"] != null) {
      if (!Number.isInteger(this["followsCount"])) issues.push({ path: "followsCount", message: "Must be an integer." });
    }
    if (this["postsCount"] != null) {
      if (!Number.isInteger(this["postsCount"])) issues.push({ path: "postsCount", message: "Must be an integer." });
    }
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      did: this["did"],
      handle: this["handle"],
      displayName: this["displayName"],
      description: this["description"],
      pronouns: this["pronouns"],
      website: this["website"],
      avatar: this["avatar"],
      banner: this["banner"],
      followersCount: this["followersCount"],
      followsCount: this["followsCount"],
      postsCount: this["postsCount"],
      associated: this["associated"],
      joinedViaStarterPack: this["joinedViaStarterPack"],
      indexedAt: this["indexedAt"],
      createdAt: this["createdAt"],
      viewer: this["viewer"],
      labels: this["labels"],
      pinnedPost: this["pinnedPost"],
      links: this["links"],
      verification: this["verification"],
      status: this["status"],
      debug: this["debug"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyActorDefsProfileViewDetailed(value);
    record.check();
    return record;
  }
};
var AppBskyActorDefsSavedFeed = class _AppBskyActorDefsSavedFeed {
  static nsid = "app.bsky.actor.defs";
  static def = "savedFeed";
  static kind = "object";
  $type;
  id;
  type;
  value;
  pinned;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.actor.defs#savedFeed";
  }
  check() {
    const issues = [];
    if (this["id"] == null) issues.push({ path: "id", message: "Required." });
    if (this["type"] == null) issues.push({ path: "type", message: "Required." });
    if (this["value"] == null) issues.push({ path: "value", message: "Required." });
    if (this["pinned"] == null) issues.push({ path: "pinned", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      id: this["id"],
      type: this["type"],
      value: this["value"],
      pinned: this["pinned"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyActorDefsSavedFeed(value);
    record.check();
    return record;
  }
};
var AppBskyActorDefsSavedFeedsPref = class _AppBskyActorDefsSavedFeedsPref {
  static nsid = "app.bsky.actor.defs";
  static def = "savedFeedsPref";
  static kind = "object";
  $type;
  pinned;
  saved;
  timelineIndex;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.actor.defs#savedFeedsPref";
  }
  check() {
    const issues = [];
    if (this["pinned"] == null) issues.push({ path: "pinned", message: "Required." });
    if (this["saved"] == null) issues.push({ path: "saved", message: "Required." });
    if (this["timelineIndex"] != null) {
      if (!Number.isInteger(this["timelineIndex"])) issues.push({ path: "timelineIndex", message: "Must be an integer." });
    }
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      pinned: this["pinned"],
      saved: this["saved"],
      timelineIndex: this["timelineIndex"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyActorDefsSavedFeedsPref(value);
    record.check();
    return record;
  }
};
var AppBskyActorDefsSavedFeedsPrefV2 = class _AppBskyActorDefsSavedFeedsPrefV2 {
  static nsid = "app.bsky.actor.defs";
  static def = "savedFeedsPrefV2";
  static kind = "object";
  $type;
  items;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.actor.defs#savedFeedsPrefV2";
  }
  check() {
    const issues = [];
    if (this["items"] == null) issues.push({ path: "items", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      items: this["items"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyActorDefsSavedFeedsPrefV2(value);
    record.check();
    return record;
  }
};
var AppBskyActorDefsStatusView = class _AppBskyActorDefsStatusView {
  static nsid = "app.bsky.actor.defs";
  static def = "statusView";
  static kind = "object";
  $type;
  uri;
  cid;
  status;
  record;
  embed;
  labels;
  expiresAt;
  isActive;
  isDisabled;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.actor.defs#statusView";
  }
  check() {
    const issues = [];
    if (this["status"] == null) issues.push({ path: "status", message: "Required." });
    if (this["record"] == null) issues.push({ path: "record", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      uri: this["uri"],
      cid: this["cid"],
      status: this["status"],
      record: this["record"],
      embed: this["embed"],
      labels: this["labels"],
      expiresAt: this["expiresAt"],
      isActive: this["isActive"],
      isDisabled: this["isDisabled"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyActorDefsStatusView(value);
    record.check();
    return record;
  }
};
var AppBskyActorDefsThreadViewPref = class _AppBskyActorDefsThreadViewPref {
  static nsid = "app.bsky.actor.defs";
  static def = "threadViewPref";
  static kind = "object";
  $type;
  sort;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.actor.defs#threadViewPref";
  }
  check() {
    const issues = [];
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      sort: this["sort"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyActorDefsThreadViewPref(value);
    record.check();
    return record;
  }
};
var AppBskyActorDefsVerificationPrefs = class _AppBskyActorDefsVerificationPrefs {
  static nsid = "app.bsky.actor.defs";
  static def = "verificationPrefs";
  static kind = "object";
  $type;
  hideBadges;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.actor.defs#verificationPrefs";
  }
  check() {
    const issues = [];
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      hideBadges: this["hideBadges"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyActorDefsVerificationPrefs(value);
    record.check();
    return record;
  }
};
var AppBskyActorDefsVerificationState = class _AppBskyActorDefsVerificationState {
  static nsid = "app.bsky.actor.defs";
  static def = "verificationState";
  static kind = "object";
  $type;
  verifications;
  verifiedStatus;
  trustedVerifierStatus;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.actor.defs#verificationState";
  }
  check() {
    const issues = [];
    if (this["verifications"] == null) issues.push({ path: "verifications", message: "Required." });
    if (this["verifiedStatus"] == null) issues.push({ path: "verifiedStatus", message: "Required." });
    if (this["trustedVerifierStatus"] == null) issues.push({ path: "trustedVerifierStatus", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      verifications: this["verifications"],
      verifiedStatus: this["verifiedStatus"],
      trustedVerifierStatus: this["trustedVerifierStatus"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyActorDefsVerificationState(value);
    record.check();
    return record;
  }
};
var AppBskyActorDefsVerificationView = class _AppBskyActorDefsVerificationView {
  static nsid = "app.bsky.actor.defs";
  static def = "verificationView";
  static kind = "object";
  $type;
  issuer;
  issuerDisplayName;
  issuerHandle;
  uri;
  isValid;
  createdAt;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.actor.defs#verificationView";
  }
  check() {
    const issues = [];
    if (this["issuer"] == null) issues.push({ path: "issuer", message: "Required." });
    if (this["uri"] == null) issues.push({ path: "uri", message: "Required." });
    if (this["isValid"] == null) issues.push({ path: "isValid", message: "Required." });
    if (this["createdAt"] == null) issues.push({ path: "createdAt", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      issuer: this["issuer"],
      issuerDisplayName: this["issuerDisplayName"],
      issuerHandle: this["issuerHandle"],
      uri: this["uri"],
      isValid: this["isValid"],
      createdAt: this["createdAt"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyActorDefsVerificationView(value);
    record.check();
    return record;
  }
};
var AppBskyActorDefsViewerState = class _AppBskyActorDefsViewerState {
  static nsid = "app.bsky.actor.defs";
  static def = "viewerState";
  static kind = "object";
  $type;
  muted;
  mutedOnlyReposts;
  mutedOnlyQuoteposts;
  mutedByList;
  blockedBy;
  blocking;
  blockingByList;
  following;
  followedBy;
  knownFollowers;
  activitySubscription;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.actor.defs#viewerState";
  }
  check() {
    const issues = [];
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      muted: this["muted"],
      mutedOnlyReposts: this["mutedOnlyReposts"],
      mutedOnlyQuoteposts: this["mutedOnlyQuoteposts"],
      mutedByList: this["mutedByList"],
      blockedBy: this["blockedBy"],
      blocking: this["blocking"],
      blockingByList: this["blockingByList"],
      following: this["following"],
      followedBy: this["followedBy"],
      knownFollowers: this["knownFollowers"],
      activitySubscription: this["activitySubscription"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyActorDefsViewerState(value);
    record.check();
    return record;
  }
};
var AppBskyActorGetPreferences = class _AppBskyActorGetPreferences {
  static nsid = "app.bsky.actor.getPreferences";
  static def = "main";
  static kind = "query";
  static http = "GET";
  static errorNames = [];
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({});
  }
  check() {
    const issues = [];
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _AppBskyActorGetPreferences.nsid,
      method: "GET",
      params: this.toParams(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyActorGetPreferences(value);
    record.check();
    return record;
  }
};
var AppBskyActorGetProfile = class _AppBskyActorGetProfile {
  static nsid = "app.bsky.actor.getProfile";
  static def = "main";
  static kind = "query";
  static http = "GET";
  static errorNames = [];
  actor;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({
      actor: this["actor"]
    });
  }
  check() {
    const issues = [];
    if (this["actor"] == null) issues.push({ path: "actor", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _AppBskyActorGetProfile.nsid,
      method: "GET",
      params: this.toParams(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyActorGetProfile(value);
    record.check();
    return record;
  }
};
var AppBskyActorGetProfiles = class _AppBskyActorGetProfiles {
  static nsid = "app.bsky.actor.getProfiles";
  static def = "main";
  static kind = "query";
  static http = "GET";
  static errorNames = [];
  actors;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({
      actors: this["actors"]
    });
  }
  check() {
    const issues = [];
    if (this["actors"] == null) issues.push({ path: "actors", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _AppBskyActorGetProfiles.nsid,
      method: "GET",
      params: this.toParams(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyActorGetProfiles(value);
    record.check();
    return record;
  }
};
var AppBskyActorGetSuggestions = class _AppBskyActorGetSuggestions {
  static nsid = "app.bsky.actor.getSuggestions";
  static def = "main";
  static kind = "query";
  static http = "GET";
  static errorNames = [];
  limit;
  cursor;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({
      limit: this["limit"],
      cursor: this["cursor"]
    });
  }
  check() {
    const issues = [];
    if (this["limit"] != null) {
      if (!Number.isInteger(this["limit"])) issues.push({ path: "limit", message: "Must be an integer." });
      else if (this["limit"] < 1) issues.push({ path: "limit", message: "Must be at least 1." });
      else if (this["limit"] > 100) issues.push({ path: "limit", message: "Must be at most 100." });
    }
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _AppBskyActorGetSuggestions.nsid,
      method: "GET",
      params: this.toParams(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyActorGetSuggestions(value);
    record.check();
    return record;
  }
};
var AppBskyActorLink = class _AppBskyActorLink {
  static nsid = "app.bsky.actor.link";
  static def = "main";
  static kind = "record";
  static recordKey = "tid";
  $type;
  url;
  title;
  icon;
  createdAt;
  labels;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.actor.link";
  }
  check() {
    const issues = [];
    if (this["url"] == null) issues.push({ path: "url", message: "Required." });
    if (typeof this["title"] === "string" && this["title"].length > 320) issues.push({ path: "title", message: "Must be at most 320 characters." });
    if (this["createdAt"] == null) issues.push({ path: "createdAt", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      url: this["url"],
      title: this["title"],
      icon: this["icon"],
      createdAt: this["createdAt"],
      labels: this["labels"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyActorLink(value);
    record.check();
    return record;
  }
};
var AppBskyActorProfile = class _AppBskyActorProfile {
  static nsid = "app.bsky.actor.profile";
  static def = "main";
  static kind = "record";
  static recordKey = "literal:self";
  $type;
  displayName;
  description;
  pronouns;
  website;
  avatar;
  banner;
  labels;
  joinedViaStarterPack;
  pinnedPost;
  links;
  createdAt;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.actor.profile";
  }
  check() {
    const issues = [];
    if (typeof this["displayName"] === "string" && this["displayName"].length > 640) issues.push({ path: "displayName", message: "Must be at most 640 characters." });
    if (typeof this["description"] === "string" && this["description"].length > 2560) issues.push({ path: "description", message: "Must be at most 2560 characters." });
    if (typeof this["pronouns"] === "string" && this["pronouns"].length > 200) issues.push({ path: "pronouns", message: "Must be at most 200 characters." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      displayName: this["displayName"],
      description: this["description"],
      pronouns: this["pronouns"],
      website: this["website"],
      avatar: this["avatar"],
      banner: this["banner"],
      labels: this["labels"],
      joinedViaStarterPack: this["joinedViaStarterPack"],
      pinnedPost: this["pinnedPost"],
      links: this["links"],
      createdAt: this["createdAt"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyActorProfile(value);
    record.check();
    return record;
  }
};
var AppBskyActorPutPreferences = class _AppBskyActorPutPreferences {
  static nsid = "app.bsky.actor.putPreferences";
  static def = "main";
  static kind = "procedure";
  static http = "POST";
  static errorNames = [];
  preferences;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({});
  }
  toBody() {
    return jsonOf({
      preferences: this["preferences"]
    });
  }
  check() {
    const issues = [];
    if (this["preferences"] == null) issues.push({ path: "preferences", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _AppBskyActorPutPreferences.nsid,
      method: "POST",
      params: this.toParams(),
      body: this.toBody(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyActorPutPreferences(value);
    record.check();
    return record;
  }
};
var AppBskyActorSearchActors = class _AppBskyActorSearchActors {
  static nsid = "app.bsky.actor.searchActors";
  static def = "main";
  static kind = "query";
  static http = "GET";
  static errorNames = [];
  term;
  q;
  limit;
  cursor;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({
      term: this["term"],
      q: this["q"],
      limit: this["limit"],
      cursor: this["cursor"]
    });
  }
  check() {
    const issues = [];
    if (this["limit"] != null) {
      if (!Number.isInteger(this["limit"])) issues.push({ path: "limit", message: "Must be an integer." });
      else if (this["limit"] < 1) issues.push({ path: "limit", message: "Must be at least 1." });
      else if (this["limit"] > 100) issues.push({ path: "limit", message: "Must be at most 100." });
    }
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _AppBskyActorSearchActors.nsid,
      method: "GET",
      params: this.toParams(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyActorSearchActors(value);
    record.check();
    return record;
  }
};
var AppBskyActorSearchActorsTypeahead = class _AppBskyActorSearchActorsTypeahead {
  static nsid = "app.bsky.actor.searchActorsTypeahead";
  static def = "main";
  static kind = "query";
  static http = "GET";
  static errorNames = [];
  term;
  q;
  limit;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({
      term: this["term"],
      q: this["q"],
      limit: this["limit"]
    });
  }
  check() {
    const issues = [];
    if (this["limit"] != null) {
      if (!Number.isInteger(this["limit"])) issues.push({ path: "limit", message: "Must be an integer." });
      else if (this["limit"] < 1) issues.push({ path: "limit", message: "Must be at least 1." });
      else if (this["limit"] > 100) issues.push({ path: "limit", message: "Must be at most 100." });
    }
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _AppBskyActorSearchActorsTypeahead.nsid,
      method: "GET",
      params: this.toParams(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyActorSearchActorsTypeahead(value);
    record.check();
    return record;
  }
};
var AppBskyActorStatus = class _AppBskyActorStatus {
  static nsid = "app.bsky.actor.status";
  static def = "main";
  static kind = "record";
  static recordKey = "literal:self";
  $type;
  status;
  embed;
  durationMinutes;
  createdAt;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.actor.status";
  }
  check() {
    const issues = [];
    if (this["status"] == null) issues.push({ path: "status", message: "Required." });
    if (this["durationMinutes"] != null) {
      if (!Number.isInteger(this["durationMinutes"])) issues.push({ path: "durationMinutes", message: "Must be an integer." });
      else if (this["durationMinutes"] < 1) issues.push({ path: "durationMinutes", message: "Must be at least 1." });
    }
    if (this["createdAt"] == null) issues.push({ path: "createdAt", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      status: this["status"],
      embed: this["embed"],
      durationMinutes: this["durationMinutes"],
      createdAt: this["createdAt"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyActorStatus(value);
    record.check();
    return record;
  }
};
var AppBskyActorStatusLive = class {
  static nsid = "app.bsky.actor.status";
  static def = "live";
  static kind = "token";
  static value = "app.bsky.actor.status#live";
  static description = "Advertises an account as currently offering live content.";
  constructor() {
  }
};
var AppBskyAgeassuranceBegin = class _AppBskyAgeassuranceBegin {
  static nsid = "app.bsky.ageassurance.begin";
  static def = "main";
  static kind = "procedure";
  static http = "POST";
  static errorNames = ["InvalidEmail", "DidTooLong", "InvalidInitiation", "RegionNotSupported"];
  email;
  language;
  countryCode;
  regionCode;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({});
  }
  toBody() {
    return jsonOf({
      email: this["email"],
      language: this["language"],
      countryCode: this["countryCode"],
      regionCode: this["regionCode"]
    });
  }
  check() {
    const issues = [];
    if (this["email"] == null) issues.push({ path: "email", message: "Required." });
    if (this["language"] == null) issues.push({ path: "language", message: "Required." });
    if (this["countryCode"] == null) issues.push({ path: "countryCode", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _AppBskyAgeassuranceBegin.nsid,
      method: "POST",
      params: this.toParams(),
      body: this.toBody(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyAgeassuranceBegin(value);
    record.check();
    return record;
  }
};
var AppBskyAgeassuranceDefsAccess = class _AppBskyAgeassuranceDefsAccess {
  static nsid = "app.bsky.ageassurance.defs";
  static def = "access";
  static kind = "string";
  static knownValues = ["unknown", "none", "safe", "full"];
  static includes(value) {
    return _AppBskyAgeassuranceDefsAccess.knownValues.includes(value);
  }
  constructor() {
  }
};
var AppBskyAgeassuranceDefsConfig = class _AppBskyAgeassuranceDefsConfig {
  static nsid = "app.bsky.ageassurance.defs";
  static def = "config";
  static kind = "object";
  $type;
  regions;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.ageassurance.defs#config";
  }
  check() {
    const issues = [];
    if (this["regions"] == null) issues.push({ path: "regions", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      regions: this["regions"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyAgeassuranceDefsConfig(value);
    record.check();
    return record;
  }
};
var AppBskyAgeassuranceDefsConfigRegion = class _AppBskyAgeassuranceDefsConfigRegion {
  static nsid = "app.bsky.ageassurance.defs";
  static def = "configRegion";
  static kind = "object";
  $type;
  platforms;
  countryCode;
  regionCode;
  minAccessAge;
  additionalVerificationMethods;
  rules;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.ageassurance.defs#configRegion";
  }
  check() {
    const issues = [];
    if (this["countryCode"] == null) issues.push({ path: "countryCode", message: "Required." });
    if (this["minAccessAge"] == null) issues.push({ path: "minAccessAge", message: "Required." });
    if (this["minAccessAge"] != null) {
      if (!Number.isInteger(this["minAccessAge"])) issues.push({ path: "minAccessAge", message: "Must be an integer." });
    }
    if (this["rules"] == null) issues.push({ path: "rules", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      platforms: this["platforms"],
      countryCode: this["countryCode"],
      regionCode: this["regionCode"],
      minAccessAge: this["minAccessAge"],
      additionalVerificationMethods: this["additionalVerificationMethods"],
      rules: this["rules"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyAgeassuranceDefsConfigRegion(value);
    record.check();
    return record;
  }
};
var AppBskyAgeassuranceDefsConfigRegionRuleDefault = class _AppBskyAgeassuranceDefsConfigRegionRuleDefault {
  static nsid = "app.bsky.ageassurance.defs";
  static def = "configRegionRuleDefault";
  static kind = "object";
  $type;
  access;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.ageassurance.defs#configRegionRuleDefault";
  }
  check() {
    const issues = [];
    if (this["access"] == null) issues.push({ path: "access", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      access: this["access"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyAgeassuranceDefsConfigRegionRuleDefault(value);
    record.check();
    return record;
  }
};
var AppBskyAgeassuranceDefsConfigRegionRuleIfAccountNewerThan = class _AppBskyAgeassuranceDefsConfigRegionRuleIfAccountNewerThan {
  static nsid = "app.bsky.ageassurance.defs";
  static def = "configRegionRuleIfAccountNewerThan";
  static kind = "object";
  $type;
  date;
  access;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.ageassurance.defs#configRegionRuleIfAccountNewerThan";
  }
  check() {
    const issues = [];
    if (this["date"] == null) issues.push({ path: "date", message: "Required." });
    if (this["access"] == null) issues.push({ path: "access", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      date: this["date"],
      access: this["access"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyAgeassuranceDefsConfigRegionRuleIfAccountNewerThan(value);
    record.check();
    return record;
  }
};
var AppBskyAgeassuranceDefsConfigRegionRuleIfAccountOlderThan = class _AppBskyAgeassuranceDefsConfigRegionRuleIfAccountOlderThan {
  static nsid = "app.bsky.ageassurance.defs";
  static def = "configRegionRuleIfAccountOlderThan";
  static kind = "object";
  $type;
  date;
  access;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.ageassurance.defs#configRegionRuleIfAccountOlderThan";
  }
  check() {
    const issues = [];
    if (this["date"] == null) issues.push({ path: "date", message: "Required." });
    if (this["access"] == null) issues.push({ path: "access", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      date: this["date"],
      access: this["access"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyAgeassuranceDefsConfigRegionRuleIfAccountOlderThan(value);
    record.check();
    return record;
  }
};
var AppBskyAgeassuranceDefsConfigRegionRuleIfAssuredOverAge = class _AppBskyAgeassuranceDefsConfigRegionRuleIfAssuredOverAge {
  static nsid = "app.bsky.ageassurance.defs";
  static def = "configRegionRuleIfAssuredOverAge";
  static kind = "object";
  $type;
  age;
  access;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.ageassurance.defs#configRegionRuleIfAssuredOverAge";
  }
  check() {
    const issues = [];
    if (this["age"] == null) issues.push({ path: "age", message: "Required." });
    if (this["age"] != null) {
      if (!Number.isInteger(this["age"])) issues.push({ path: "age", message: "Must be an integer." });
    }
    if (this["access"] == null) issues.push({ path: "access", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      age: this["age"],
      access: this["access"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyAgeassuranceDefsConfigRegionRuleIfAssuredOverAge(value);
    record.check();
    return record;
  }
};
var AppBskyAgeassuranceDefsConfigRegionRuleIfAssuredUnderAge = class _AppBskyAgeassuranceDefsConfigRegionRuleIfAssuredUnderAge {
  static nsid = "app.bsky.ageassurance.defs";
  static def = "configRegionRuleIfAssuredUnderAge";
  static kind = "object";
  $type;
  age;
  access;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.ageassurance.defs#configRegionRuleIfAssuredUnderAge";
  }
  check() {
    const issues = [];
    if (this["age"] == null) issues.push({ path: "age", message: "Required." });
    if (this["age"] != null) {
      if (!Number.isInteger(this["age"])) issues.push({ path: "age", message: "Must be an integer." });
    }
    if (this["access"] == null) issues.push({ path: "access", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      age: this["age"],
      access: this["access"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyAgeassuranceDefsConfigRegionRuleIfAssuredUnderAge(value);
    record.check();
    return record;
  }
};
var AppBskyAgeassuranceDefsConfigRegionRuleIfDeclaredOverAge = class _AppBskyAgeassuranceDefsConfigRegionRuleIfDeclaredOverAge {
  static nsid = "app.bsky.ageassurance.defs";
  static def = "configRegionRuleIfDeclaredOverAge";
  static kind = "object";
  $type;
  age;
  access;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.ageassurance.defs#configRegionRuleIfDeclaredOverAge";
  }
  check() {
    const issues = [];
    if (this["age"] == null) issues.push({ path: "age", message: "Required." });
    if (this["age"] != null) {
      if (!Number.isInteger(this["age"])) issues.push({ path: "age", message: "Must be an integer." });
    }
    if (this["access"] == null) issues.push({ path: "access", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      age: this["age"],
      access: this["access"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyAgeassuranceDefsConfigRegionRuleIfDeclaredOverAge(value);
    record.check();
    return record;
  }
};
var AppBskyAgeassuranceDefsConfigRegionRuleIfDeclaredUnderAge = class _AppBskyAgeassuranceDefsConfigRegionRuleIfDeclaredUnderAge {
  static nsid = "app.bsky.ageassurance.defs";
  static def = "configRegionRuleIfDeclaredUnderAge";
  static kind = "object";
  $type;
  age;
  access;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.ageassurance.defs#configRegionRuleIfDeclaredUnderAge";
  }
  check() {
    const issues = [];
    if (this["age"] == null) issues.push({ path: "age", message: "Required." });
    if (this["age"] != null) {
      if (!Number.isInteger(this["age"])) issues.push({ path: "age", message: "Must be an integer." });
    }
    if (this["access"] == null) issues.push({ path: "access", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      age: this["age"],
      access: this["access"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyAgeassuranceDefsConfigRegionRuleIfDeclaredUnderAge(value);
    record.check();
    return record;
  }
};
var AppBskyAgeassuranceDefsEvent = class _AppBskyAgeassuranceDefsEvent {
  static nsid = "app.bsky.ageassurance.defs";
  static def = "event";
  static kind = "object";
  $type;
  createdAt;
  attemptId;
  status;
  access;
  countryCode;
  regionCode;
  email;
  initIp;
  initUa;
  completeIp;
  completeUa;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.ageassurance.defs#event";
  }
  check() {
    const issues = [];
    if (this["createdAt"] == null) issues.push({ path: "createdAt", message: "Required." });
    if (this["attemptId"] == null) issues.push({ path: "attemptId", message: "Required." });
    if (this["status"] == null) issues.push({ path: "status", message: "Required." });
    if (this["access"] == null) issues.push({ path: "access", message: "Required." });
    if (this["countryCode"] == null) issues.push({ path: "countryCode", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      createdAt: this["createdAt"],
      attemptId: this["attemptId"],
      status: this["status"],
      access: this["access"],
      countryCode: this["countryCode"],
      regionCode: this["regionCode"],
      email: this["email"],
      initIp: this["initIp"],
      initUa: this["initUa"],
      completeIp: this["completeIp"],
      completeUa: this["completeUa"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyAgeassuranceDefsEvent(value);
    record.check();
    return record;
  }
};
var AppBskyAgeassuranceDefsState = class _AppBskyAgeassuranceDefsState {
  static nsid = "app.bsky.ageassurance.defs";
  static def = "state";
  static kind = "object";
  $type;
  lastInitiatedAt;
  status;
  access;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.ageassurance.defs#state";
  }
  check() {
    const issues = [];
    if (this["status"] == null) issues.push({ path: "status", message: "Required." });
    if (this["access"] == null) issues.push({ path: "access", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      lastInitiatedAt: this["lastInitiatedAt"],
      status: this["status"],
      access: this["access"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyAgeassuranceDefsState(value);
    record.check();
    return record;
  }
};
var AppBskyAgeassuranceDefsStateMetadata = class _AppBskyAgeassuranceDefsStateMetadata {
  static nsid = "app.bsky.ageassurance.defs";
  static def = "stateMetadata";
  static kind = "object";
  $type;
  accountCreatedAt;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.ageassurance.defs#stateMetadata";
  }
  check() {
    const issues = [];
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      accountCreatedAt: this["accountCreatedAt"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyAgeassuranceDefsStateMetadata(value);
    record.check();
    return record;
  }
};
var AppBskyAgeassuranceDefsStatus = class _AppBskyAgeassuranceDefsStatus {
  static nsid = "app.bsky.ageassurance.defs";
  static def = "status";
  static kind = "string";
  static knownValues = ["unknown", "pending", "assured", "blocked"];
  static includes(value) {
    return _AppBskyAgeassuranceDefsStatus.knownValues.includes(value);
  }
  constructor() {
  }
};
var AppBskyAgeassuranceGetConfig = class _AppBskyAgeassuranceGetConfig {
  static nsid = "app.bsky.ageassurance.getConfig";
  static def = "main";
  static kind = "query";
  static http = "GET";
  static errorNames = [];
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({});
  }
  check() {
    const issues = [];
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _AppBskyAgeassuranceGetConfig.nsid,
      method: "GET",
      params: this.toParams(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyAgeassuranceGetConfig(value);
    record.check();
    return record;
  }
};
var AppBskyAgeassuranceGetState = class _AppBskyAgeassuranceGetState {
  static nsid = "app.bsky.ageassurance.getState";
  static def = "main";
  static kind = "query";
  static http = "GET";
  static errorNames = [];
  countryCode;
  regionCode;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({
      countryCode: this["countryCode"],
      regionCode: this["regionCode"]
    });
  }
  check() {
    const issues = [];
    if (this["countryCode"] == null) issues.push({ path: "countryCode", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _AppBskyAgeassuranceGetState.nsid,
      method: "GET",
      params: this.toParams(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyAgeassuranceGetState(value);
    record.check();
    return record;
  }
};
var AppBskyAuthCreatePosts = class _AppBskyAuthCreatePosts {
  static nsid = "app.bsky.authCreatePosts";
  static def = "main";
  static kind = "permission-set";
  static title = "Create Bluesky Posts";
  static detail = "Can not update or delete posts.";
  static permissions = [{ "type": "permission", "resource": "rpc", "inheritAud": true, "lxm": ["app.bsky.video.uploadVideo", "app.bsky.video.getJobStatus", "app.bsky.video.getUploadLimits", "app.bsky.video.startUpload", "app.bsky.video.uploadPart", "app.bsky.video.finishUpload", "app.bsky.video.abortUpload", "app.bsky.video.getUploadStatus"] }, { "type": "permission", "resource": "repo", "action": ["create"], "collection": ["app.bsky.feed.post", "app.bsky.feed.postgate", "app.bsky.feed.threadgate"] }];
  constructor() {
  }
  static toJSON() {
    return { title: _AppBskyAuthCreatePosts.title, detail: _AppBskyAuthCreatePosts.detail, permissions: _AppBskyAuthCreatePosts.permissions };
  }
};
var AppBskyAuthDeleteContent = class _AppBskyAuthDeleteContent {
  static nsid = "app.bsky.authDeleteContent";
  static def = "main";
  static kind = "permission-set";
  static title = "Delete Bluesky Content";
  static detail = "Clean up public account history: posts, reposts, and likes.";
  static permissions = [{ "type": "permission", "resource": "repo", "action": ["delete"], "collection": ["app.bsky.feed.like", "app.bsky.feed.post", "app.bsky.feed.postgate", "app.bsky.feed.repost", "app.bsky.feed.threadgate"] }];
  constructor() {
  }
  static toJSON() {
    return { title: _AppBskyAuthDeleteContent.title, detail: _AppBskyAuthDeleteContent.detail, permissions: _AppBskyAuthDeleteContent.permissions };
  }
};
var AppBskyAuthManageFeedDeclarations = class _AppBskyAuthManageFeedDeclarations {
  static nsid = "app.bsky.authManageFeedDeclarations";
  static def = "main";
  static kind = "permission-set";
  static title = "Manage Hosted Feeds";
  static detail = "Configure feed generator declaration records.";
  static permissions = [{ "type": "permission", "resource": "repo", "action": ["create", "update", "delete"], "collection": ["app.bsky.feed.generator"] }];
  constructor() {
  }
  static toJSON() {
    return { title: _AppBskyAuthManageFeedDeclarations.title, detail: _AppBskyAuthManageFeedDeclarations.detail, permissions: _AppBskyAuthManageFeedDeclarations.permissions };
  }
};
var AppBskyAuthManageLabelerService = class _AppBskyAuthManageLabelerService {
  static nsid = "app.bsky.authManageLabelerService";
  static def = "main";
  static kind = "permission-set";
  static title = "Manage Hosted Labeling Service";
  static detail = "Configure labeler declaration records.";
  static permissions = [{ "type": "permission", "resource": "repo", "action": ["create", "update", "delete"], "collection": ["app.bsky.labeler.service"] }];
  constructor() {
  }
  static toJSON() {
    return { title: _AppBskyAuthManageLabelerService.title, detail: _AppBskyAuthManageLabelerService.detail, permissions: _AppBskyAuthManageLabelerService.permissions };
  }
};
var AppBskyAuthManageModeration = class _AppBskyAuthManageModeration {
  static nsid = "app.bsky.authManageModeration";
  static def = "main";
  static kind = "permission-set";
  static title = "Manage Personal Moderation";
  static detail = "Control over blocks, mutes, mod lists, mod services, and preferences.";
  static permissions = [{ "type": "permission", "resource": "rpc", "inheritAud": true, "lxm": ["app.bsky.actor.getPreferences", "app.bsky.actor.putPreferences", "app.bsky.graph.muteActor", "app.bsky.graph.muteActorList", "app.bsky.graph.muteThread", "app.bsky.graph.unmuteActor", "app.bsky.graph.unmuteActorList", "app.bsky.graph.unmuteThread"] }, { "type": "permission", "resource": "repo", "action": ["create", "update", "delete"], "collection": ["app.bsky.graph.block", "app.bsky.graph.listblock"] }];
  constructor() {
  }
  static toJSON() {
    return { title: _AppBskyAuthManageModeration.title, detail: _AppBskyAuthManageModeration.detail, permissions: _AppBskyAuthManageModeration.permissions };
  }
};
var AppBskyAuthManageNotifications = class _AppBskyAuthManageNotifications {
  static nsid = "app.bsky.authManageNotifications";
  static def = "main";
  static kind = "permission-set";
  static title = "Manage Bluesky Notifications";
  static detail = "View and configure notifications for the Bluesky app.";
  static permissions = [{ "type": "permission", "resource": "rpc", "inheritAud": true, "lxm": ["app.bsky.notification.getPreferences", "app.bsky.notification.getGroupedNotifications", "app.bsky.notification.getUnreadCount", "app.bsky.notification.listActivitySubscriptions", "app.bsky.notification.listNotifications", "app.bsky.notification.putActivitySubscription", "app.bsky.notification.putPreferences", "app.bsky.notification.putPreferencesV2", "app.bsky.notification.registerPush", "app.bsky.notification.unregisterPush", "app.bsky.notification.updateSeen"] }];
  constructor() {
  }
  static toJSON() {
    return { title: _AppBskyAuthManageNotifications.title, detail: _AppBskyAuthManageNotifications.detail, permissions: _AppBskyAuthManageNotifications.permissions };
  }
};
var AppBskyAuthManageProfile = class _AppBskyAuthManageProfile {
  static nsid = "app.bsky.authManageProfile";
  static def = "main";
  static kind = "permission-set";
  static title = "Manage Bluesky Profile";
  static detail = "Update profile data, as well as status and public chat visibility.";
  static permissions = [{ "type": "permission", "resource": "repo", "action": ["create", "update", "delete"], "collection": ["app.bsky.actor.link", "app.bsky.actor.profile", "app.bsky.actor.status", "app.bsky.notification.declaration"] }];
  constructor() {
  }
  static toJSON() {
    return { title: _AppBskyAuthManageProfile.title, detail: _AppBskyAuthManageProfile.detail, permissions: _AppBskyAuthManageProfile.permissions };
  }
};
var AppBskyAuthViewAll = class _AppBskyAuthViewAll {
  static nsid = "app.bsky.authViewAll";
  static def = "main";
  static kind = "permission-set";
  static title = "Read-only access to all content";
  static detail = "View Bluesky network content from account perspective, and read all notifications and preferences.";
  static permissions = [{ "type": "permission", "resource": "rpc", "inheritAud": true, "lxm": ["app.bsky.actor.getPreferences", "app.bsky.actor.getProfile", "app.bsky.actor.getProfiles", "app.bsky.actor.getSuggestions", "app.bsky.actor.searchActors", "app.bsky.actor.searchActorsTypeahead", "app.bsky.ageassurance.getConfig", "app.bsky.ageassurance.getState", "app.bsky.bookmark.getBookmarks", "app.bsky.embed.getEmbedExternalView", "app.bsky.feed.describeFeedGenerator", "app.bsky.feed.getActorFeeds", "app.bsky.feed.getActorLikes", "app.bsky.feed.getAuthorFeed", "app.bsky.feed.getFeed", "app.bsky.feed.getFeedGenerator", "app.bsky.feed.getFeedGenerators", "app.bsky.feed.getFeedSkeleton", "app.bsky.feed.getLikes", "app.bsky.feed.getListFeed", "app.bsky.feed.getPostThread", "app.bsky.feed.getPosts", "app.bsky.feed.getQuotes", "app.bsky.feed.getRepostedBy", "app.bsky.feed.getSuggestedFeeds", "app.bsky.feed.getTimeline", "app.bsky.feed.searchPosts", "app.bsky.feed.searchPostsV2", "app.bsky.graph.getActorStarterPacks", "app.bsky.graph.getBlocks", "app.bsky.graph.getFollowers", "app.bsky.graph.getFollows", "app.bsky.graph.getKnownFollowers", "app.bsky.graph.getList", "app.bsky.graph.getListBlocks", "app.bsky.graph.getListMutes", "app.bsky.graph.getLists", "app.bsky.graph.getListsWithMembership", "app.bsky.graph.getMutes", "app.bsky.graph.getRelationships", "app.bsky.graph.getStarterPack", "app.bsky.graph.getStarterPacks", "app.bsky.graph.getStarterPacksWithMembership", "app.bsky.graph.getSuggestedFollowsByActor", "app.bsky.graph.searchStarterPacks", "app.bsky.graph.searchStarterPacksV2", "app.bsky.labeler.getServices", "app.bsky.notification.getGroupedNotifications", "app.bsky.notification.getPreferences", "app.bsky.notification.getUnreadCount", "app.bsky.notification.listActivitySubscriptions", "app.bsky.notification.listNotifications", "app.bsky.notification.updateSeen", "app.bsky.unspecced.getAgeAssuranceState", "app.bsky.unspecced.getConfig", "app.bsky.unspecced.getOnboardingSuggestedStarterPacks", "app.bsky.unspecced.getPopularFeedGenerators", "app.bsky.unspecced.getPostThreadOtherV2", "app.bsky.unspecced.getPostThreadV2", "app.bsky.unspecced.getSuggestedFeeds", "app.bsky.unspecced.getSuggestedFeedsSkeleton", "app.bsky.unspecced.getSuggestedOnboardingUsers", "app.bsky.unspecced.getSuggestedStarterPacks", "app.bsky.unspecced.getSuggestedStarterPacksSkeleton", "app.bsky.unspecced.getSuggestedUsers", "app.bsky.unspecced.getSuggestedUsersForDiscover", "app.bsky.unspecced.getSuggestedUsersForExplore", "app.bsky.unspecced.getSuggestedUsersForSeeMore", "app.bsky.unspecced.getSuggestedUsersSkeleton", "app.bsky.unspecced.getSuggestionsSkeleton", "app.bsky.unspecced.getTaggedSuggestions", "app.bsky.unspecced.getTrendingTopics", "app.bsky.unspecced.getTrends", "app.bsky.unspecced.getTrendsSkeleton", "app.bsky.unspecced.searchActorsSkeleton", "app.bsky.unspecced.searchPostsSkeleton", "app.bsky.unspecced.searchStarterPacksSkeleton", "app.bsky.video.getUploadLimits"] }];
  constructor() {
  }
  static toJSON() {
    return { title: _AppBskyAuthViewAll.title, detail: _AppBskyAuthViewAll.detail, permissions: _AppBskyAuthViewAll.permissions };
  }
};
var AppBskyBookmarkCreateBookmark = class _AppBskyBookmarkCreateBookmark {
  static nsid = "app.bsky.bookmark.createBookmark";
  static def = "main";
  static kind = "procedure";
  static http = "POST";
  static errorNames = ["UnsupportedCollection"];
  uri;
  cid;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({});
  }
  toBody() {
    return jsonOf({
      uri: this["uri"],
      cid: this["cid"]
    });
  }
  check() {
    const issues = [];
    if (this["uri"] == null) issues.push({ path: "uri", message: "Required." });
    if (this["cid"] == null) issues.push({ path: "cid", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _AppBskyBookmarkCreateBookmark.nsid,
      method: "POST",
      params: this.toParams(),
      body: this.toBody(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyBookmarkCreateBookmark(value);
    record.check();
    return record;
  }
};
var AppBskyBookmarkDefsBookmark = class _AppBskyBookmarkDefsBookmark {
  static nsid = "app.bsky.bookmark.defs";
  static def = "bookmark";
  static kind = "object";
  $type;
  subject;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.bookmark.defs#bookmark";
  }
  check() {
    const issues = [];
    if (this["subject"] == null) issues.push({ path: "subject", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      subject: this["subject"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyBookmarkDefsBookmark(value);
    record.check();
    return record;
  }
};
var AppBskyBookmarkDefsBookmarkView = class _AppBskyBookmarkDefsBookmarkView {
  static nsid = "app.bsky.bookmark.defs";
  static def = "bookmarkView";
  static kind = "object";
  $type;
  subject;
  createdAt;
  item;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.bookmark.defs#bookmarkView";
  }
  check() {
    const issues = [];
    if (this["subject"] == null) issues.push({ path: "subject", message: "Required." });
    if (this["item"] == null) issues.push({ path: "item", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      subject: this["subject"],
      createdAt: this["createdAt"],
      item: this["item"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyBookmarkDefsBookmarkView(value);
    record.check();
    return record;
  }
};
var AppBskyBookmarkDeleteBookmark = class _AppBskyBookmarkDeleteBookmark {
  static nsid = "app.bsky.bookmark.deleteBookmark";
  static def = "main";
  static kind = "procedure";
  static http = "POST";
  static errorNames = ["UnsupportedCollection"];
  uri;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({});
  }
  toBody() {
    return jsonOf({
      uri: this["uri"]
    });
  }
  check() {
    const issues = [];
    if (this["uri"] == null) issues.push({ path: "uri", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _AppBskyBookmarkDeleteBookmark.nsid,
      method: "POST",
      params: this.toParams(),
      body: this.toBody(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyBookmarkDeleteBookmark(value);
    record.check();
    return record;
  }
};
var AppBskyBookmarkGetBookmarks = class _AppBskyBookmarkGetBookmarks {
  static nsid = "app.bsky.bookmark.getBookmarks";
  static def = "main";
  static kind = "query";
  static http = "GET";
  static errorNames = [];
  limit;
  cursor;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({
      limit: this["limit"],
      cursor: this["cursor"]
    });
  }
  check() {
    const issues = [];
    if (this["limit"] != null) {
      if (!Number.isInteger(this["limit"])) issues.push({ path: "limit", message: "Must be an integer." });
      else if (this["limit"] < 1) issues.push({ path: "limit", message: "Must be at least 1." });
      else if (this["limit"] > 100) issues.push({ path: "limit", message: "Must be at most 100." });
    }
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _AppBskyBookmarkGetBookmarks.nsid,
      method: "GET",
      params: this.toParams(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyBookmarkGetBookmarks(value);
    record.check();
    return record;
  }
};
var AppBskyContactDefsMatchAndContactIndex = class _AppBskyContactDefsMatchAndContactIndex {
  static nsid = "app.bsky.contact.defs";
  static def = "matchAndContactIndex";
  static kind = "object";
  $type;
  match;
  contactIndex;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.contact.defs#matchAndContactIndex";
  }
  check() {
    const issues = [];
    if (this["match"] == null) issues.push({ path: "match", message: "Required." });
    if (this["contactIndex"] == null) issues.push({ path: "contactIndex", message: "Required." });
    if (this["contactIndex"] != null) {
      if (!Number.isInteger(this["contactIndex"])) issues.push({ path: "contactIndex", message: "Must be an integer." });
      else if (this["contactIndex"] < 0) issues.push({ path: "contactIndex", message: "Must be at least 0." });
      else if (this["contactIndex"] > 999) issues.push({ path: "contactIndex", message: "Must be at most 999." });
    }
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      match: this["match"],
      contactIndex: this["contactIndex"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyContactDefsMatchAndContactIndex(value);
    record.check();
    return record;
  }
};
var AppBskyContactDefsNotification = class _AppBskyContactDefsNotification {
  static nsid = "app.bsky.contact.defs";
  static def = "notification";
  static kind = "object";
  $type;
  from;
  to;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.contact.defs#notification";
  }
  check() {
    const issues = [];
    if (this["from"] == null) issues.push({ path: "from", message: "Required." });
    if (this["to"] == null) issues.push({ path: "to", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      from: this["from"],
      to: this["to"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyContactDefsNotification(value);
    record.check();
    return record;
  }
};
var AppBskyContactDefsSyncStatus = class _AppBskyContactDefsSyncStatus {
  static nsid = "app.bsky.contact.defs";
  static def = "syncStatus";
  static kind = "object";
  $type;
  syncedAt;
  matchesCount;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.contact.defs#syncStatus";
  }
  check() {
    const issues = [];
    if (this["syncedAt"] == null) issues.push({ path: "syncedAt", message: "Required." });
    if (this["matchesCount"] == null) issues.push({ path: "matchesCount", message: "Required." });
    if (this["matchesCount"] != null) {
      if (!Number.isInteger(this["matchesCount"])) issues.push({ path: "matchesCount", message: "Must be an integer." });
      else if (this["matchesCount"] < 0) issues.push({ path: "matchesCount", message: "Must be at least 0." });
    }
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      syncedAt: this["syncedAt"],
      matchesCount: this["matchesCount"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyContactDefsSyncStatus(value);
    record.check();
    return record;
  }
};
var AppBskyContactDismissMatch = class _AppBskyContactDismissMatch {
  static nsid = "app.bsky.contact.dismissMatch";
  static def = "main";
  static kind = "procedure";
  static http = "POST";
  static errorNames = ["InvalidDid", "InternalError"];
  subject;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({});
  }
  toBody() {
    return jsonOf({
      subject: this["subject"]
    });
  }
  check() {
    const issues = [];
    if (this["subject"] == null) issues.push({ path: "subject", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _AppBskyContactDismissMatch.nsid,
      method: "POST",
      params: this.toParams(),
      body: this.toBody(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyContactDismissMatch(value);
    record.check();
    return record;
  }
};
var AppBskyContactGetMatches = class _AppBskyContactGetMatches {
  static nsid = "app.bsky.contact.getMatches";
  static def = "main";
  static kind = "query";
  static http = "GET";
  static errorNames = ["InvalidDid", "InvalidLimit", "InvalidCursor", "InternalError"];
  limit;
  cursor;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({
      limit: this["limit"],
      cursor: this["cursor"]
    });
  }
  check() {
    const issues = [];
    if (this["limit"] != null) {
      if (!Number.isInteger(this["limit"])) issues.push({ path: "limit", message: "Must be an integer." });
      else if (this["limit"] < 1) issues.push({ path: "limit", message: "Must be at least 1." });
      else if (this["limit"] > 100) issues.push({ path: "limit", message: "Must be at most 100." });
    }
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _AppBskyContactGetMatches.nsid,
      method: "GET",
      params: this.toParams(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyContactGetMatches(value);
    record.check();
    return record;
  }
};
var AppBskyContactGetSyncStatus = class _AppBskyContactGetSyncStatus {
  static nsid = "app.bsky.contact.getSyncStatus";
  static def = "main";
  static kind = "query";
  static http = "GET";
  static errorNames = ["InvalidDid", "InternalError"];
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({});
  }
  check() {
    const issues = [];
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _AppBskyContactGetSyncStatus.nsid,
      method: "GET",
      params: this.toParams(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyContactGetSyncStatus(value);
    record.check();
    return record;
  }
};
var AppBskyContactImportContacts = class _AppBskyContactImportContacts {
  static nsid = "app.bsky.contact.importContacts";
  static def = "main";
  static kind = "procedure";
  static http = "POST";
  static errorNames = ["InvalidDid", "InvalidContacts", "TooManyContacts", "InvalidToken", "InternalError"];
  token;
  contacts;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({});
  }
  toBody() {
    return jsonOf({
      token: this["token"],
      contacts: this["contacts"]
    });
  }
  check() {
    const issues = [];
    if (this["token"] == null) issues.push({ path: "token", message: "Required." });
    if (this["contacts"] == null) issues.push({ path: "contacts", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _AppBskyContactImportContacts.nsid,
      method: "POST",
      params: this.toParams(),
      body: this.toBody(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyContactImportContacts(value);
    record.check();
    return record;
  }
};
var AppBskyContactRemoveData = class _AppBskyContactRemoveData {
  static nsid = "app.bsky.contact.removeData";
  static def = "main";
  static kind = "procedure";
  static http = "POST";
  static errorNames = ["InvalidDid", "InternalError"];
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({});
  }
  toBody() {
    return jsonOf({});
  }
  check() {
    const issues = [];
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _AppBskyContactRemoveData.nsid,
      method: "POST",
      params: this.toParams(),
      body: this.toBody(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyContactRemoveData(value);
    record.check();
    return record;
  }
};
var AppBskyContactSendNotification = class _AppBskyContactSendNotification {
  static nsid = "app.bsky.contact.sendNotification";
  static def = "main";
  static kind = "procedure";
  static http = "POST";
  static errorNames = [];
  from;
  to;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({});
  }
  toBody() {
    return jsonOf({
      from: this["from"],
      to: this["to"]
    });
  }
  check() {
    const issues = [];
    if (this["from"] == null) issues.push({ path: "from", message: "Required." });
    if (this["to"] == null) issues.push({ path: "to", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _AppBskyContactSendNotification.nsid,
      method: "POST",
      params: this.toParams(),
      body: this.toBody(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyContactSendNotification(value);
    record.check();
    return record;
  }
};
var AppBskyContactStartPhoneVerification = class _AppBskyContactStartPhoneVerification {
  static nsid = "app.bsky.contact.startPhoneVerification";
  static def = "main";
  static kind = "procedure";
  static http = "POST";
  static errorNames = ["RateLimitExceeded", "InvalidDid", "InvalidPhone", "InternalError"];
  phone;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({});
  }
  toBody() {
    return jsonOf({
      phone: this["phone"]
    });
  }
  check() {
    const issues = [];
    if (this["phone"] == null) issues.push({ path: "phone", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _AppBskyContactStartPhoneVerification.nsid,
      method: "POST",
      params: this.toParams(),
      body: this.toBody(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyContactStartPhoneVerification(value);
    record.check();
    return record;
  }
};
var AppBskyContactVerifyPhone = class _AppBskyContactVerifyPhone {
  static nsid = "app.bsky.contact.verifyPhone";
  static def = "main";
  static kind = "procedure";
  static http = "POST";
  static errorNames = ["RateLimitExceeded", "InvalidDid", "InvalidPhone", "InvalidCode", "InternalError"];
  phone;
  code;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({});
  }
  toBody() {
    return jsonOf({
      phone: this["phone"],
      code: this["code"]
    });
  }
  check() {
    const issues = [];
    if (this["phone"] == null) issues.push({ path: "phone", message: "Required." });
    if (this["code"] == null) issues.push({ path: "code", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _AppBskyContactVerifyPhone.nsid,
      method: "POST",
      params: this.toParams(),
      body: this.toBody(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyContactVerifyPhone(value);
    record.check();
    return record;
  }
};
var AppBskyDraftCreateDraft = class _AppBskyDraftCreateDraft {
  static nsid = "app.bsky.draft.createDraft";
  static def = "main";
  static kind = "procedure";
  static http = "POST";
  static errorNames = ["DraftLimitReached"];
  draft;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({});
  }
  toBody() {
    return jsonOf({
      draft: this["draft"]
    });
  }
  check() {
    const issues = [];
    if (this["draft"] == null) issues.push({ path: "draft", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _AppBskyDraftCreateDraft.nsid,
      method: "POST",
      params: this.toParams(),
      body: this.toBody(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyDraftCreateDraft(value);
    record.check();
    return record;
  }
};
var AppBskyDraftDefsDraft = class _AppBskyDraftDefsDraft {
  static nsid = "app.bsky.draft.defs";
  static def = "draft";
  static kind = "object";
  $type;
  deviceId;
  deviceName;
  posts;
  langs;
  postgateEmbeddingRules;
  threadgateAllow;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.draft.defs#draft";
  }
  check() {
    const issues = [];
    if (typeof this["deviceId"] === "string" && this["deviceId"].length > 100) issues.push({ path: "deviceId", message: "Must be at most 100 characters." });
    if (typeof this["deviceName"] === "string" && this["deviceName"].length > 100) issues.push({ path: "deviceName", message: "Must be at most 100 characters." });
    if (this["posts"] == null) issues.push({ path: "posts", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      deviceId: this["deviceId"],
      deviceName: this["deviceName"],
      posts: this["posts"],
      langs: this["langs"],
      postgateEmbeddingRules: this["postgateEmbeddingRules"],
      threadgateAllow: this["threadgateAllow"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyDraftDefsDraft(value);
    record.check();
    return record;
  }
};
var AppBskyDraftDefsDraftEmbedCaption = class _AppBskyDraftDefsDraftEmbedCaption {
  static nsid = "app.bsky.draft.defs";
  static def = "draftEmbedCaption";
  static kind = "object";
  $type;
  lang;
  content;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.draft.defs#draftEmbedCaption";
  }
  check() {
    const issues = [];
    if (this["lang"] == null) issues.push({ path: "lang", message: "Required." });
    if (this["content"] == null) issues.push({ path: "content", message: "Required." });
    if (typeof this["content"] === "string" && this["content"].length > 1e4) issues.push({ path: "content", message: "Must be at most 10000 characters." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      lang: this["lang"],
      content: this["content"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyDraftDefsDraftEmbedCaption(value);
    record.check();
    return record;
  }
};
var AppBskyDraftDefsDraftEmbedExternal = class _AppBskyDraftDefsDraftEmbedExternal {
  static nsid = "app.bsky.draft.defs";
  static def = "draftEmbedExternal";
  static kind = "object";
  $type;
  uri;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.draft.defs#draftEmbedExternal";
  }
  check() {
    const issues = [];
    if (this["uri"] == null) issues.push({ path: "uri", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      uri: this["uri"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyDraftDefsDraftEmbedExternal(value);
    record.check();
    return record;
  }
};
var AppBskyDraftDefsDraftEmbedGallery = class _AppBskyDraftDefsDraftEmbedGallery {
  static nsid = "app.bsky.draft.defs";
  static def = "draftEmbedGallery";
  static kind = "object";
  $type;
  items;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.draft.defs#draftEmbedGallery";
  }
  check() {
    const issues = [];
    if (this["items"] == null) issues.push({ path: "items", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      items: this["items"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyDraftDefsDraftEmbedGallery(value);
    record.check();
    return record;
  }
};
var AppBskyDraftDefsDraftEmbedGalleryItems = { nsid: "app.bsky.draft.defs", def: "draftEmbedGalleryItems", kind: "array" };
var AppBskyDraftDefsDraftEmbedImage = class _AppBskyDraftDefsDraftEmbedImage {
  static nsid = "app.bsky.draft.defs";
  static def = "draftEmbedImage";
  static kind = "object";
  $type;
  localRef;
  alt;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.draft.defs#draftEmbedImage";
  }
  check() {
    const issues = [];
    if (this["localRef"] == null) issues.push({ path: "localRef", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      localRef: this["localRef"],
      alt: this["alt"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyDraftDefsDraftEmbedImage(value);
    record.check();
    return record;
  }
};
var AppBskyDraftDefsDraftEmbedLocalRef = class _AppBskyDraftDefsDraftEmbedLocalRef {
  static nsid = "app.bsky.draft.defs";
  static def = "draftEmbedLocalRef";
  static kind = "object";
  $type;
  path;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.draft.defs#draftEmbedLocalRef";
  }
  check() {
    const issues = [];
    if (this["path"] == null) issues.push({ path: "path", message: "Required." });
    if (typeof this["path"] === "string" && this["path"].length > 1024) issues.push({ path: "path", message: "Must be at most 1024 characters." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      path: this["path"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyDraftDefsDraftEmbedLocalRef(value);
    record.check();
    return record;
  }
};
var AppBskyDraftDefsDraftEmbedRecord = class _AppBskyDraftDefsDraftEmbedRecord {
  static nsid = "app.bsky.draft.defs";
  static def = "draftEmbedRecord";
  static kind = "object";
  $type;
  record;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.draft.defs#draftEmbedRecord";
  }
  check() {
    const issues = [];
    if (this["record"] == null) issues.push({ path: "record", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      record: this["record"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyDraftDefsDraftEmbedRecord(value);
    record.check();
    return record;
  }
};
var AppBskyDraftDefsDraftEmbedVideo = class _AppBskyDraftDefsDraftEmbedVideo {
  static nsid = "app.bsky.draft.defs";
  static def = "draftEmbedVideo";
  static kind = "object";
  $type;
  localRef;
  alt;
  captions;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.draft.defs#draftEmbedVideo";
  }
  check() {
    const issues = [];
    if (this["localRef"] == null) issues.push({ path: "localRef", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      localRef: this["localRef"],
      alt: this["alt"],
      captions: this["captions"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyDraftDefsDraftEmbedVideo(value);
    record.check();
    return record;
  }
};
var AppBskyDraftDefsDraftPost = class _AppBskyDraftDefsDraftPost {
  static nsid = "app.bsky.draft.defs";
  static def = "draftPost";
  static kind = "object";
  $type;
  text;
  labels;
  embedImages;
  embedGallery;
  embedVideos;
  embedExternals;
  embedRecords;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.draft.defs#draftPost";
  }
  check() {
    const issues = [];
    if (this["text"] == null) issues.push({ path: "text", message: "Required." });
    if (typeof this["text"] === "string" && this["text"].length > 1e4) issues.push({ path: "text", message: "Must be at most 10000 characters." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      text: this["text"],
      labels: this["labels"],
      embedImages: this["embedImages"],
      embedGallery: this["embedGallery"],
      embedVideos: this["embedVideos"],
      embedExternals: this["embedExternals"],
      embedRecords: this["embedRecords"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyDraftDefsDraftPost(value);
    record.check();
    return record;
  }
};
var AppBskyDraftDefsDraftView = class _AppBskyDraftDefsDraftView {
  static nsid = "app.bsky.draft.defs";
  static def = "draftView";
  static kind = "object";
  $type;
  id;
  draft;
  createdAt;
  updatedAt;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.draft.defs#draftView";
  }
  check() {
    const issues = [];
    if (this["id"] == null) issues.push({ path: "id", message: "Required." });
    if (this["draft"] == null) issues.push({ path: "draft", message: "Required." });
    if (this["createdAt"] == null) issues.push({ path: "createdAt", message: "Required." });
    if (this["updatedAt"] == null) issues.push({ path: "updatedAt", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      id: this["id"],
      draft: this["draft"],
      createdAt: this["createdAt"],
      updatedAt: this["updatedAt"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyDraftDefsDraftView(value);
    record.check();
    return record;
  }
};
var AppBskyDraftDefsDraftWithId = class _AppBskyDraftDefsDraftWithId {
  static nsid = "app.bsky.draft.defs";
  static def = "draftWithId";
  static kind = "object";
  $type;
  id;
  draft;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.draft.defs#draftWithId";
  }
  check() {
    const issues = [];
    if (this["id"] == null) issues.push({ path: "id", message: "Required." });
    if (this["draft"] == null) issues.push({ path: "draft", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      id: this["id"],
      draft: this["draft"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyDraftDefsDraftWithId(value);
    record.check();
    return record;
  }
};
var AppBskyDraftDeleteDraft = class _AppBskyDraftDeleteDraft {
  static nsid = "app.bsky.draft.deleteDraft";
  static def = "main";
  static kind = "procedure";
  static http = "POST";
  static errorNames = [];
  id;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({});
  }
  toBody() {
    return jsonOf({
      id: this["id"]
    });
  }
  check() {
    const issues = [];
    if (this["id"] == null) issues.push({ path: "id", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _AppBskyDraftDeleteDraft.nsid,
      method: "POST",
      params: this.toParams(),
      body: this.toBody(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyDraftDeleteDraft(value);
    record.check();
    return record;
  }
};
var AppBskyDraftGetDrafts = class _AppBskyDraftGetDrafts {
  static nsid = "app.bsky.draft.getDrafts";
  static def = "main";
  static kind = "query";
  static http = "GET";
  static errorNames = [];
  limit;
  cursor;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({
      limit: this["limit"],
      cursor: this["cursor"]
    });
  }
  check() {
    const issues = [];
    if (this["limit"] != null) {
      if (!Number.isInteger(this["limit"])) issues.push({ path: "limit", message: "Must be an integer." });
      else if (this["limit"] < 1) issues.push({ path: "limit", message: "Must be at least 1." });
      else if (this["limit"] > 100) issues.push({ path: "limit", message: "Must be at most 100." });
    }
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _AppBskyDraftGetDrafts.nsid,
      method: "GET",
      params: this.toParams(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyDraftGetDrafts(value);
    record.check();
    return record;
  }
};
var AppBskyDraftUpdateDraft = class _AppBskyDraftUpdateDraft {
  static nsid = "app.bsky.draft.updateDraft";
  static def = "main";
  static kind = "procedure";
  static http = "POST";
  static errorNames = [];
  draft;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({});
  }
  toBody() {
    return jsonOf({
      draft: this["draft"]
    });
  }
  check() {
    const issues = [];
    if (this["draft"] == null) issues.push({ path: "draft", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _AppBskyDraftUpdateDraft.nsid,
      method: "POST",
      params: this.toParams(),
      body: this.toBody(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyDraftUpdateDraft(value);
    record.check();
    return record;
  }
};
var AppBskyEmbedDefsAspectRatio = class _AppBskyEmbedDefsAspectRatio {
  static nsid = "app.bsky.embed.defs";
  static def = "aspectRatio";
  static kind = "object";
  $type;
  width;
  height;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.embed.defs#aspectRatio";
  }
  check() {
    const issues = [];
    if (this["width"] == null) issues.push({ path: "width", message: "Required." });
    if (this["width"] != null) {
      if (!Number.isInteger(this["width"])) issues.push({ path: "width", message: "Must be an integer." });
      else if (this["width"] < 1) issues.push({ path: "width", message: "Must be at least 1." });
    }
    if (this["height"] == null) issues.push({ path: "height", message: "Required." });
    if (this["height"] != null) {
      if (!Number.isInteger(this["height"])) issues.push({ path: "height", message: "Must be an integer." });
      else if (this["height"] < 1) issues.push({ path: "height", message: "Must be at least 1." });
    }
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      width: this["width"],
      height: this["height"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyEmbedDefsAspectRatio(value);
    record.check();
    return record;
  }
};
var AppBskyEmbedExternal = class _AppBskyEmbedExternal {
  static nsid = "app.bsky.embed.external";
  static def = "main";
  static kind = "object";
  $type;
  external;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.embed.external";
  }
  check() {
    const issues = [];
    if (this["external"] == null) issues.push({ path: "external", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      external: this["external"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyEmbedExternal(value);
    record.check();
    return record;
  }
};
var AppBskyEmbedExternalColorRGB = class _AppBskyEmbedExternalColorRGB {
  static nsid = "app.bsky.embed.external";
  static def = "colorRGB";
  static kind = "object";
  $type;
  r;
  g;
  b;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.embed.external#colorRGB";
  }
  check() {
    const issues = [];
    if (this["r"] == null) issues.push({ path: "r", message: "Required." });
    if (this["r"] != null) {
      if (!Number.isInteger(this["r"])) issues.push({ path: "r", message: "Must be an integer." });
      else if (this["r"] < 0) issues.push({ path: "r", message: "Must be at least 0." });
      else if (this["r"] > 255) issues.push({ path: "r", message: "Must be at most 255." });
    }
    if (this["g"] == null) issues.push({ path: "g", message: "Required." });
    if (this["g"] != null) {
      if (!Number.isInteger(this["g"])) issues.push({ path: "g", message: "Must be an integer." });
      else if (this["g"] < 0) issues.push({ path: "g", message: "Must be at least 0." });
      else if (this["g"] > 255) issues.push({ path: "g", message: "Must be at most 255." });
    }
    if (this["b"] == null) issues.push({ path: "b", message: "Required." });
    if (this["b"] != null) {
      if (!Number.isInteger(this["b"])) issues.push({ path: "b", message: "Must be an integer." });
      else if (this["b"] < 0) issues.push({ path: "b", message: "Must be at least 0." });
      else if (this["b"] > 255) issues.push({ path: "b", message: "Must be at most 255." });
    }
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      r: this["r"],
      g: this["g"],
      b: this["b"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyEmbedExternalColorRGB(value);
    record.check();
    return record;
  }
};
var AppBskyEmbedExternalExternal = class _AppBskyEmbedExternalExternal {
  static nsid = "app.bsky.embed.external";
  static def = "external";
  static kind = "object";
  $type;
  uri;
  title;
  description;
  thumb;
  associatedRefs;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.embed.external#external";
  }
  check() {
    const issues = [];
    if (this["uri"] == null) issues.push({ path: "uri", message: "Required." });
    if (this["title"] == null) issues.push({ path: "title", message: "Required." });
    if (this["description"] == null) issues.push({ path: "description", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      uri: this["uri"],
      title: this["title"],
      description: this["description"],
      thumb: this["thumb"],
      associatedRefs: this["associatedRefs"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyEmbedExternalExternal(value);
    record.check();
    return record;
  }
};
var AppBskyEmbedExternalView = class _AppBskyEmbedExternalView {
  static nsid = "app.bsky.embed.external";
  static def = "view";
  static kind = "object";
  $type;
  external;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.embed.external#view";
  }
  check() {
    const issues = [];
    if (this["external"] == null) issues.push({ path: "external", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      external: this["external"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyEmbedExternalView(value);
    record.check();
    return record;
  }
};
var AppBskyEmbedExternalViewArticle = class _AppBskyEmbedExternalViewArticle {
  static nsid = "app.bsky.embed.external";
  static def = "viewArticle";
  static kind = "object";
  $type;
  uri;
  title;
  description;
  createdAt;
  updatedAt;
  labels;
  associatedRefs;
  associatedProfiles;
  image;
  publisher;
  readingTime;
  likeCount;
  likers;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.embed.external#viewArticle";
  }
  check() {
    const issues = [];
    if (this["uri"] == null) issues.push({ path: "uri", message: "Required." });
    if (this["title"] == null) issues.push({ path: "title", message: "Required." });
    if (this["description"] == null) issues.push({ path: "description", message: "Required." });
    if (this["readingTime"] != null) {
      if (!Number.isInteger(this["readingTime"])) issues.push({ path: "readingTime", message: "Must be an integer." });
      else if (this["readingTime"] < 1) issues.push({ path: "readingTime", message: "Must be at least 1." });
    }
    if (this["likeCount"] != null) {
      if (!Number.isInteger(this["likeCount"])) issues.push({ path: "likeCount", message: "Must be an integer." });
      else if (this["likeCount"] < 0) issues.push({ path: "likeCount", message: "Must be at least 0." });
    }
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      uri: this["uri"],
      title: this["title"],
      description: this["description"],
      createdAt: this["createdAt"],
      updatedAt: this["updatedAt"],
      labels: this["labels"],
      associatedRefs: this["associatedRefs"],
      associatedProfiles: this["associatedProfiles"],
      image: this["image"],
      publisher: this["publisher"],
      readingTime: this["readingTime"],
      likeCount: this["likeCount"],
      likers: this["likers"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyEmbedExternalViewArticle(value);
    record.check();
    return record;
  }
};
var AppBskyEmbedExternalViewArticlePublication = class _AppBskyEmbedExternalViewArticlePublication {
  static nsid = "app.bsky.embed.external";
  static def = "viewArticlePublication";
  static kind = "object";
  $type;
  uri;
  title;
  description;
  createdAt;
  updatedAt;
  labels;
  associatedRefs;
  associatedProfiles;
  logo;
  image;
  theme;
  subscriptionCount;
  subscribers;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.embed.external#viewArticlePublication";
  }
  check() {
    const issues = [];
    if (this["uri"] == null) issues.push({ path: "uri", message: "Required." });
    if (this["title"] == null) issues.push({ path: "title", message: "Required." });
    if (this["description"] == null) issues.push({ path: "description", message: "Required." });
    if (this["subscriptionCount"] != null) {
      if (!Number.isInteger(this["subscriptionCount"])) issues.push({ path: "subscriptionCount", message: "Must be an integer." });
      else if (this["subscriptionCount"] < 0) issues.push({ path: "subscriptionCount", message: "Must be at least 0." });
    }
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      uri: this["uri"],
      title: this["title"],
      description: this["description"],
      createdAt: this["createdAt"],
      updatedAt: this["updatedAt"],
      labels: this["labels"],
      associatedRefs: this["associatedRefs"],
      associatedProfiles: this["associatedProfiles"],
      logo: this["logo"],
      image: this["image"],
      theme: this["theme"],
      subscriptionCount: this["subscriptionCount"],
      subscribers: this["subscribers"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyEmbedExternalViewArticlePublication(value);
    record.check();
    return record;
  }
};
var AppBskyEmbedExternalViewArticlePublicationTheme = class _AppBskyEmbedExternalViewArticlePublicationTheme {
  static nsid = "app.bsky.embed.external";
  static def = "viewArticlePublicationTheme";
  static kind = "object";
  $type;
  background;
  foreground;
  accent;
  accentForeground;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.embed.external#viewArticlePublicationTheme";
  }
  check() {
    const issues = [];
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      background: this["background"],
      foreground: this["foreground"],
      accent: this["accent"],
      accentForeground: this["accentForeground"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyEmbedExternalViewArticlePublicationTheme(value);
    record.check();
    return record;
  }
};
var AppBskyEmbedExternalViewExternal = class _AppBskyEmbedExternalViewExternal {
  static nsid = "app.bsky.embed.external";
  static def = "viewExternal";
  static kind = "object";
  $type;
  uri;
  title;
  description;
  thumb;
  createdAt;
  updatedAt;
  readingTime;
  labels;
  source;
  associatedRefs;
  associatedProfiles;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.embed.external#viewExternal";
  }
  check() {
    const issues = [];
    if (this["uri"] == null) issues.push({ path: "uri", message: "Required." });
    if (this["title"] == null) issues.push({ path: "title", message: "Required." });
    if (this["description"] == null) issues.push({ path: "description", message: "Required." });
    if (this["readingTime"] != null) {
      if (!Number.isInteger(this["readingTime"])) issues.push({ path: "readingTime", message: "Must be an integer." });
    }
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      uri: this["uri"],
      title: this["title"],
      description: this["description"],
      thumb: this["thumb"],
      createdAt: this["createdAt"],
      updatedAt: this["updatedAt"],
      readingTime: this["readingTime"],
      labels: this["labels"],
      source: this["source"],
      associatedRefs: this["associatedRefs"],
      associatedProfiles: this["associatedProfiles"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyEmbedExternalViewExternal(value);
    record.check();
    return record;
  }
};
var AppBskyEmbedExternalViewExternalSource = class _AppBskyEmbedExternalViewExternalSource {
  static nsid = "app.bsky.embed.external";
  static def = "viewExternalSource";
  static kind = "object";
  $type;
  uri;
  icon;
  title;
  description;
  theme;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.embed.external#viewExternalSource";
  }
  check() {
    const issues = [];
    if (this["uri"] == null) issues.push({ path: "uri", message: "Required." });
    if (this["title"] == null) issues.push({ path: "title", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      uri: this["uri"],
      icon: this["icon"],
      title: this["title"],
      description: this["description"],
      theme: this["theme"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyEmbedExternalViewExternalSource(value);
    record.check();
    return record;
  }
};
var AppBskyEmbedExternalViewExternalSourceTheme = class _AppBskyEmbedExternalViewExternalSourceTheme {
  static nsid = "app.bsky.embed.external";
  static def = "viewExternalSourceTheme";
  static kind = "object";
  $type;
  backgroundRGB;
  foregroundRGB;
  accentRGB;
  accentForegroundRGB;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.embed.external#viewExternalSourceTheme";
  }
  check() {
    const issues = [];
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      backgroundRGB: this["backgroundRGB"],
      foregroundRGB: this["foregroundRGB"],
      accentRGB: this["accentRGB"],
      accentForegroundRGB: this["accentForegroundRGB"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyEmbedExternalViewExternalSourceTheme(value);
    record.check();
    return record;
  }
};
var AppBskyEmbedExternalViewGallery = class _AppBskyEmbedExternalViewGallery {
  static nsid = "app.bsky.embed.external";
  static def = "viewGallery";
  static kind = "object";
  $type;
  uri;
  title;
  description;
  createdAt;
  updatedAt;
  labels;
  associatedRefs;
  associatedProfiles;
  items;
  likeCount;
  likers;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.embed.external#viewGallery";
  }
  check() {
    const issues = [];
    if (this["uri"] == null) issues.push({ path: "uri", message: "Required." });
    if (this["title"] == null) issues.push({ path: "title", message: "Required." });
    if (this["description"] == null) issues.push({ path: "description", message: "Required." });
    if (this["items"] == null) issues.push({ path: "items", message: "Required." });
    if (this["likeCount"] != null) {
      if (!Number.isInteger(this["likeCount"])) issues.push({ path: "likeCount", message: "Must be an integer." });
      else if (this["likeCount"] < 0) issues.push({ path: "likeCount", message: "Must be at least 0." });
    }
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      uri: this["uri"],
      title: this["title"],
      description: this["description"],
      createdAt: this["createdAt"],
      updatedAt: this["updatedAt"],
      labels: this["labels"],
      associatedRefs: this["associatedRefs"],
      associatedProfiles: this["associatedProfiles"],
      items: this["items"],
      likeCount: this["likeCount"],
      likers: this["likers"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyEmbedExternalViewGallery(value);
    record.check();
    return record;
  }
};
var AppBskyEmbedExternalViewGalleryImage = class _AppBskyEmbedExternalViewGalleryImage {
  static nsid = "app.bsky.embed.external";
  static def = "viewGalleryImage";
  static kind = "object";
  $type;
  thumbnail;
  fullsize;
  alt;
  aspectRatio;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.embed.external#viewGalleryImage";
  }
  check() {
    const issues = [];
    if (this["thumbnail"] == null) issues.push({ path: "thumbnail", message: "Required." });
    if (this["fullsize"] == null) issues.push({ path: "fullsize", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      thumbnail: this["thumbnail"],
      fullsize: this["fullsize"],
      alt: this["alt"],
      aspectRatio: this["aspectRatio"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyEmbedExternalViewGalleryImage(value);
    record.check();
    return record;
  }
};
var AppBskyEmbedExternalViewLivestream = class _AppBskyEmbedExternalViewLivestream {
  static nsid = "app.bsky.embed.external";
  static def = "viewLivestream";
  static kind = "object";
  $type;
  uri;
  title;
  description;
  createdAt;
  updatedAt;
  labels;
  associatedRefs;
  associatedProfiles;
  image;
  active;
  startedAt;
  endedAt;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.embed.external#viewLivestream";
  }
  check() {
    const issues = [];
    if (this["uri"] == null) issues.push({ path: "uri", message: "Required." });
    if (this["title"] == null) issues.push({ path: "title", message: "Required." });
    if (this["description"] == null) issues.push({ path: "description", message: "Required." });
    if (this["active"] == null) issues.push({ path: "active", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      uri: this["uri"],
      title: this["title"],
      description: this["description"],
      createdAt: this["createdAt"],
      updatedAt: this["updatedAt"],
      labels: this["labels"],
      associatedRefs: this["associatedRefs"],
      associatedProfiles: this["associatedProfiles"],
      image: this["image"],
      active: this["active"],
      startedAt: this["startedAt"],
      endedAt: this["endedAt"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyEmbedExternalViewLivestream(value);
    record.check();
    return record;
  }
};
var AppBskyEmbedGallery = class _AppBskyEmbedGallery {
  static nsid = "app.bsky.embed.gallery";
  static def = "main";
  static kind = "object";
  $type;
  items;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.embed.gallery";
  }
  check() {
    const issues = [];
    if (this["items"] == null) issues.push({ path: "items", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      items: this["items"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyEmbedGallery(value);
    record.check();
    return record;
  }
};
var AppBskyEmbedGalleryImage = class _AppBskyEmbedGalleryImage {
  static nsid = "app.bsky.embed.gallery";
  static def = "image";
  static kind = "object";
  $type;
  image;
  alt;
  aspectRatio;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.embed.gallery#image";
  }
  check() {
    const issues = [];
    if (this["image"] == null) issues.push({ path: "image", message: "Required." });
    if (this["alt"] == null) issues.push({ path: "alt", message: "Required." });
    if (this["aspectRatio"] == null) issues.push({ path: "aspectRatio", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      image: this["image"],
      alt: this["alt"],
      aspectRatio: this["aspectRatio"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyEmbedGalleryImage(value);
    record.check();
    return record;
  }
};
var AppBskyEmbedGalleryView = class _AppBskyEmbedGalleryView {
  static nsid = "app.bsky.embed.gallery";
  static def = "view";
  static kind = "object";
  $type;
  items;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.embed.gallery#view";
  }
  check() {
    const issues = [];
    if (this["items"] == null) issues.push({ path: "items", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      items: this["items"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyEmbedGalleryView(value);
    record.check();
    return record;
  }
};
var AppBskyEmbedGalleryViewImage = class _AppBskyEmbedGalleryViewImage {
  static nsid = "app.bsky.embed.gallery";
  static def = "viewImage";
  static kind = "object";
  $type;
  thumbnail;
  fullsize;
  alt;
  aspectRatio;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.embed.gallery#viewImage";
  }
  check() {
    const issues = [];
    if (this["thumbnail"] == null) issues.push({ path: "thumbnail", message: "Required." });
    if (this["fullsize"] == null) issues.push({ path: "fullsize", message: "Required." });
    if (this["alt"] == null) issues.push({ path: "alt", message: "Required." });
    if (this["aspectRatio"] == null) issues.push({ path: "aspectRatio", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      thumbnail: this["thumbnail"],
      fullsize: this["fullsize"],
      alt: this["alt"],
      aspectRatio: this["aspectRatio"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyEmbedGalleryViewImage(value);
    record.check();
    return record;
  }
};
var AppBskyEmbedGetEmbedExternalView = class _AppBskyEmbedGetEmbedExternalView {
  static nsid = "app.bsky.embed.getEmbedExternalView";
  static def = "main";
  static kind = "query";
  static http = "GET";
  static errorNames = [];
  url;
  canonicalUri;
  uris;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({
      url: this["url"],
      canonicalUri: this["canonicalUri"],
      uris: this["uris"]
    });
  }
  check() {
    const issues = [];
    if (this["url"] == null) issues.push({ path: "url", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _AppBskyEmbedGetEmbedExternalView.nsid,
      method: "GET",
      params: this.toParams(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyEmbedGetEmbedExternalView(value);
    record.check();
    return record;
  }
};
var AppBskyEmbedImages = class _AppBskyEmbedImages {
  static nsid = "app.bsky.embed.images";
  static def = "main";
  static kind = "object";
  $type;
  images;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.embed.images";
  }
  check() {
    const issues = [];
    if (this["images"] == null) issues.push({ path: "images", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      images: this["images"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyEmbedImages(value);
    record.check();
    return record;
  }
};
var AppBskyEmbedImagesImage = class _AppBskyEmbedImagesImage {
  static nsid = "app.bsky.embed.images";
  static def = "image";
  static kind = "object";
  $type;
  image;
  alt;
  aspectRatio;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.embed.images#image";
  }
  check() {
    const issues = [];
    if (this["image"] == null) issues.push({ path: "image", message: "Required." });
    if (this["alt"] == null) issues.push({ path: "alt", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      image: this["image"],
      alt: this["alt"],
      aspectRatio: this["aspectRatio"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyEmbedImagesImage(value);
    record.check();
    return record;
  }
};
var AppBskyEmbedImagesView = class _AppBskyEmbedImagesView {
  static nsid = "app.bsky.embed.images";
  static def = "view";
  static kind = "object";
  $type;
  images;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.embed.images#view";
  }
  check() {
    const issues = [];
    if (this["images"] == null) issues.push({ path: "images", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      images: this["images"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyEmbedImagesView(value);
    record.check();
    return record;
  }
};
var AppBskyEmbedImagesViewImage = class _AppBskyEmbedImagesViewImage {
  static nsid = "app.bsky.embed.images";
  static def = "viewImage";
  static kind = "object";
  $type;
  thumb;
  fullsize;
  alt;
  aspectRatio;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.embed.images#viewImage";
  }
  check() {
    const issues = [];
    if (this["thumb"] == null) issues.push({ path: "thumb", message: "Required." });
    if (this["fullsize"] == null) issues.push({ path: "fullsize", message: "Required." });
    if (this["alt"] == null) issues.push({ path: "alt", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      thumb: this["thumb"],
      fullsize: this["fullsize"],
      alt: this["alt"],
      aspectRatio: this["aspectRatio"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyEmbedImagesViewImage(value);
    record.check();
    return record;
  }
};
var AppBskyEmbedRecord = class _AppBskyEmbedRecord {
  static nsid = "app.bsky.embed.record";
  static def = "main";
  static kind = "object";
  $type;
  record;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.embed.record";
  }
  check() {
    const issues = [];
    if (this["record"] == null) issues.push({ path: "record", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      record: this["record"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyEmbedRecord(value);
    record.check();
    return record;
  }
};
var AppBskyEmbedRecordView = class _AppBskyEmbedRecordView {
  static nsid = "app.bsky.embed.record";
  static def = "view";
  static kind = "object";
  $type;
  record;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.embed.record#view";
  }
  check() {
    const issues = [];
    if (this["record"] == null) issues.push({ path: "record", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      record: this["record"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyEmbedRecordView(value);
    record.check();
    return record;
  }
};
var AppBskyEmbedRecordViewBlocked = class _AppBskyEmbedRecordViewBlocked {
  static nsid = "app.bsky.embed.record";
  static def = "viewBlocked";
  static kind = "object";
  $type;
  uri;
  blocked;
  author;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.embed.record#viewBlocked";
  }
  check() {
    const issues = [];
    if (this["uri"] == null) issues.push({ path: "uri", message: "Required." });
    if (this["blocked"] == null) issues.push({ path: "blocked", message: "Required." });
    if (this["blocked"] != null && this["blocked"] !== true) issues.push({ path: "blocked", message: "Must be true." });
    if (this["author"] == null) issues.push({ path: "author", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      uri: this["uri"],
      blocked: this["blocked"],
      author: this["author"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyEmbedRecordViewBlocked(value);
    record.check();
    return record;
  }
};
var AppBskyEmbedRecordViewDetached = class _AppBskyEmbedRecordViewDetached {
  static nsid = "app.bsky.embed.record";
  static def = "viewDetached";
  static kind = "object";
  $type;
  uri;
  detached;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.embed.record#viewDetached";
  }
  check() {
    const issues = [];
    if (this["uri"] == null) issues.push({ path: "uri", message: "Required." });
    if (this["detached"] == null) issues.push({ path: "detached", message: "Required." });
    if (this["detached"] != null && this["detached"] !== true) issues.push({ path: "detached", message: "Must be true." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      uri: this["uri"],
      detached: this["detached"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyEmbedRecordViewDetached(value);
    record.check();
    return record;
  }
};
var AppBskyEmbedRecordViewNotFound = class _AppBskyEmbedRecordViewNotFound {
  static nsid = "app.bsky.embed.record";
  static def = "viewNotFound";
  static kind = "object";
  $type;
  uri;
  notFound;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.embed.record#viewNotFound";
  }
  check() {
    const issues = [];
    if (this["uri"] == null) issues.push({ path: "uri", message: "Required." });
    if (this["notFound"] == null) issues.push({ path: "notFound", message: "Required." });
    if (this["notFound"] != null && this["notFound"] !== true) issues.push({ path: "notFound", message: "Must be true." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      uri: this["uri"],
      notFound: this["notFound"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyEmbedRecordViewNotFound(value);
    record.check();
    return record;
  }
};
var AppBskyEmbedRecordViewRecord = class _AppBskyEmbedRecordViewRecord {
  static nsid = "app.bsky.embed.record";
  static def = "viewRecord";
  static kind = "object";
  $type;
  uri;
  cid;
  author;
  value;
  labels;
  replyCount;
  repostCount;
  likeCount;
  quoteCount;
  opThreadPostIndex;
  opThreadPostCount;
  embeds;
  indexedAt;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.embed.record#viewRecord";
  }
  check() {
    const issues = [];
    if (this["uri"] == null) issues.push({ path: "uri", message: "Required." });
    if (this["cid"] == null) issues.push({ path: "cid", message: "Required." });
    if (this["author"] == null) issues.push({ path: "author", message: "Required." });
    if (this["value"] == null) issues.push({ path: "value", message: "Required." });
    if (this["replyCount"] != null) {
      if (!Number.isInteger(this["replyCount"])) issues.push({ path: "replyCount", message: "Must be an integer." });
    }
    if (this["repostCount"] != null) {
      if (!Number.isInteger(this["repostCount"])) issues.push({ path: "repostCount", message: "Must be an integer." });
    }
    if (this["likeCount"] != null) {
      if (!Number.isInteger(this["likeCount"])) issues.push({ path: "likeCount", message: "Must be an integer." });
    }
    if (this["quoteCount"] != null) {
      if (!Number.isInteger(this["quoteCount"])) issues.push({ path: "quoteCount", message: "Must be an integer." });
    }
    if (this["opThreadPostIndex"] != null) {
      if (!Number.isInteger(this["opThreadPostIndex"])) issues.push({ path: "opThreadPostIndex", message: "Must be an integer." });
    }
    if (this["opThreadPostCount"] != null) {
      if (!Number.isInteger(this["opThreadPostCount"])) issues.push({ path: "opThreadPostCount", message: "Must be an integer." });
    }
    if (this["indexedAt"] == null) issues.push({ path: "indexedAt", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      uri: this["uri"],
      cid: this["cid"],
      author: this["author"],
      value: this["value"],
      labels: this["labels"],
      replyCount: this["replyCount"],
      repostCount: this["repostCount"],
      likeCount: this["likeCount"],
      quoteCount: this["quoteCount"],
      opThreadPostIndex: this["opThreadPostIndex"],
      opThreadPostCount: this["opThreadPostCount"],
      embeds: this["embeds"],
      indexedAt: this["indexedAt"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyEmbedRecordViewRecord(value);
    record.check();
    return record;
  }
};
var AppBskyEmbedRecordWithMedia = class _AppBskyEmbedRecordWithMedia {
  static nsid = "app.bsky.embed.recordWithMedia";
  static def = "main";
  static kind = "object";
  $type;
  record;
  media;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.embed.recordWithMedia";
  }
  check() {
    const issues = [];
    if (this["record"] == null) issues.push({ path: "record", message: "Required." });
    if (this["media"] == null) issues.push({ path: "media", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      record: this["record"],
      media: this["media"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyEmbedRecordWithMedia(value);
    record.check();
    return record;
  }
};
var AppBskyEmbedRecordWithMediaView = class _AppBskyEmbedRecordWithMediaView {
  static nsid = "app.bsky.embed.recordWithMedia";
  static def = "view";
  static kind = "object";
  $type;
  record;
  media;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.embed.recordWithMedia#view";
  }
  check() {
    const issues = [];
    if (this["record"] == null) issues.push({ path: "record", message: "Required." });
    if (this["media"] == null) issues.push({ path: "media", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      record: this["record"],
      media: this["media"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyEmbedRecordWithMediaView(value);
    record.check();
    return record;
  }
};
var AppBskyEmbedVideo = class _AppBskyEmbedVideo {
  static nsid = "app.bsky.embed.video";
  static def = "main";
  static kind = "object";
  $type;
  video;
  captions;
  alt;
  aspectRatio;
  presentation;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.embed.video";
  }
  check() {
    const issues = [];
    if (this["video"] == null) issues.push({ path: "video", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      video: this["video"],
      captions: this["captions"],
      alt: this["alt"],
      aspectRatio: this["aspectRatio"],
      presentation: this["presentation"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyEmbedVideo(value);
    record.check();
    return record;
  }
};
var AppBskyEmbedVideoCaption = class _AppBskyEmbedVideoCaption {
  static nsid = "app.bsky.embed.video";
  static def = "caption";
  static kind = "object";
  $type;
  lang;
  file;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.embed.video#caption";
  }
  check() {
    const issues = [];
    if (this["lang"] == null) issues.push({ path: "lang", message: "Required." });
    if (this["file"] == null) issues.push({ path: "file", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      lang: this["lang"],
      file: this["file"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyEmbedVideoCaption(value);
    record.check();
    return record;
  }
};
var AppBskyEmbedVideoView = class _AppBskyEmbedVideoView {
  static nsid = "app.bsky.embed.video";
  static def = "view";
  static kind = "object";
  $type;
  cid;
  playlist;
  thumbnail;
  alt;
  aspectRatio;
  presentation;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.embed.video#view";
  }
  check() {
    const issues = [];
    if (this["cid"] == null) issues.push({ path: "cid", message: "Required." });
    if (this["playlist"] == null) issues.push({ path: "playlist", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      cid: this["cid"],
      playlist: this["playlist"],
      thumbnail: this["thumbnail"],
      alt: this["alt"],
      aspectRatio: this["aspectRatio"],
      presentation: this["presentation"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyEmbedVideoView(value);
    record.check();
    return record;
  }
};
var AppBskyFeedDefsBlockedAuthor = class _AppBskyFeedDefsBlockedAuthor {
  static nsid = "app.bsky.feed.defs";
  static def = "blockedAuthor";
  static kind = "object";
  $type;
  did;
  viewer;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.feed.defs#blockedAuthor";
  }
  check() {
    const issues = [];
    if (this["did"] == null) issues.push({ path: "did", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      did: this["did"],
      viewer: this["viewer"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyFeedDefsBlockedAuthor(value);
    record.check();
    return record;
  }
};
var AppBskyFeedDefsBlockedPost = class _AppBskyFeedDefsBlockedPost {
  static nsid = "app.bsky.feed.defs";
  static def = "blockedPost";
  static kind = "object";
  $type;
  uri;
  blocked;
  author;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.feed.defs#blockedPost";
  }
  check() {
    const issues = [];
    if (this["uri"] == null) issues.push({ path: "uri", message: "Required." });
    if (this["blocked"] == null) issues.push({ path: "blocked", message: "Required." });
    if (this["blocked"] != null && this["blocked"] !== true) issues.push({ path: "blocked", message: "Must be true." });
    if (this["author"] == null) issues.push({ path: "author", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      uri: this["uri"],
      blocked: this["blocked"],
      author: this["author"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyFeedDefsBlockedPost(value);
    record.check();
    return record;
  }
};
var AppBskyFeedDefsClickthroughAuthor = class {
  static nsid = "app.bsky.feed.defs";
  static def = "clickthroughAuthor";
  static kind = "token";
  static value = "app.bsky.feed.defs#clickthroughAuthor";
  static description = "User clicked through to the author of the feed item";
  constructor() {
  }
};
var AppBskyFeedDefsClickthroughEmbed = class {
  static nsid = "app.bsky.feed.defs";
  static def = "clickthroughEmbed";
  static kind = "token";
  static value = "app.bsky.feed.defs#clickthroughEmbed";
  static description = "User clicked through to the embedded content of the feed item";
  constructor() {
  }
};
var AppBskyFeedDefsClickthroughItem = class {
  static nsid = "app.bsky.feed.defs";
  static def = "clickthroughItem";
  static kind = "token";
  static value = "app.bsky.feed.defs#clickthroughItem";
  static description = "User clicked through to the feed item";
  constructor() {
  }
};
var AppBskyFeedDefsClickthroughReposter = class {
  static nsid = "app.bsky.feed.defs";
  static def = "clickthroughReposter";
  static kind = "token";
  static value = "app.bsky.feed.defs#clickthroughReposter";
  static description = "User clicked through to the reposter of the feed item";
  constructor() {
  }
};
var AppBskyFeedDefsContentModeUnspecified = class {
  static nsid = "app.bsky.feed.defs";
  static def = "contentModeUnspecified";
  static kind = "token";
  static value = "app.bsky.feed.defs#contentModeUnspecified";
  static description = "Declares the feed generator returns any types of posts.";
  constructor() {
  }
};
var AppBskyFeedDefsContentModeVideo = class {
  static nsid = "app.bsky.feed.defs";
  static def = "contentModeVideo";
  static kind = "token";
  static value = "app.bsky.feed.defs#contentModeVideo";
  static description = "Declares the feed generator returns posts containing app.bsky.embed.video embeds.";
  constructor() {
  }
};
var AppBskyFeedDefsFeedViewPost = class _AppBskyFeedDefsFeedViewPost {
  static nsid = "app.bsky.feed.defs";
  static def = "feedViewPost";
  static kind = "object";
  $type;
  post;
  reply;
  opThreadPostIndex;
  opThreadPostCount;
  reason;
  feedContext;
  reqId;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.feed.defs#feedViewPost";
  }
  check() {
    const issues = [];
    if (this["post"] == null) issues.push({ path: "post", message: "Required." });
    if (this["opThreadPostIndex"] != null) {
      if (!Number.isInteger(this["opThreadPostIndex"])) issues.push({ path: "opThreadPostIndex", message: "Must be an integer." });
    }
    if (this["opThreadPostCount"] != null) {
      if (!Number.isInteger(this["opThreadPostCount"])) issues.push({ path: "opThreadPostCount", message: "Must be an integer." });
    }
    if (typeof this["feedContext"] === "string" && this["feedContext"].length > 2e3) issues.push({ path: "feedContext", message: "Must be at most 2000 characters." });
    if (typeof this["reqId"] === "string" && this["reqId"].length > 100) issues.push({ path: "reqId", message: "Must be at most 100 characters." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      post: this["post"],
      reply: this["reply"],
      opThreadPostIndex: this["opThreadPostIndex"],
      opThreadPostCount: this["opThreadPostCount"],
      reason: this["reason"],
      feedContext: this["feedContext"],
      reqId: this["reqId"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyFeedDefsFeedViewPost(value);
    record.check();
    return record;
  }
};
var AppBskyFeedDefsGeneratorView = class _AppBskyFeedDefsGeneratorView {
  static nsid = "app.bsky.feed.defs";
  static def = "generatorView";
  static kind = "object";
  $type;
  uri;
  cid;
  did;
  creator;
  displayName;
  description;
  descriptionFacets;
  avatar;
  likeCount;
  acceptsInteractions;
  labels;
  viewer;
  contentMode;
  indexedAt;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.feed.defs#generatorView";
  }
  check() {
    const issues = [];
    if (this["uri"] == null) issues.push({ path: "uri", message: "Required." });
    if (this["cid"] == null) issues.push({ path: "cid", message: "Required." });
    if (this["did"] == null) issues.push({ path: "did", message: "Required." });
    if (this["creator"] == null) issues.push({ path: "creator", message: "Required." });
    if (this["displayName"] == null) issues.push({ path: "displayName", message: "Required." });
    if (typeof this["description"] === "string" && this["description"].length > 3e3) issues.push({ path: "description", message: "Must be at most 3000 characters." });
    if (this["likeCount"] != null) {
      if (!Number.isInteger(this["likeCount"])) issues.push({ path: "likeCount", message: "Must be an integer." });
      else if (this["likeCount"] < 0) issues.push({ path: "likeCount", message: "Must be at least 0." });
    }
    if (this["indexedAt"] == null) issues.push({ path: "indexedAt", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      uri: this["uri"],
      cid: this["cid"],
      did: this["did"],
      creator: this["creator"],
      displayName: this["displayName"],
      description: this["description"],
      descriptionFacets: this["descriptionFacets"],
      avatar: this["avatar"],
      likeCount: this["likeCount"],
      acceptsInteractions: this["acceptsInteractions"],
      labels: this["labels"],
      viewer: this["viewer"],
      contentMode: this["contentMode"],
      indexedAt: this["indexedAt"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyFeedDefsGeneratorView(value);
    record.check();
    return record;
  }
};
var AppBskyFeedDefsGeneratorViewerState = class _AppBskyFeedDefsGeneratorViewerState {
  static nsid = "app.bsky.feed.defs";
  static def = "generatorViewerState";
  static kind = "object";
  $type;
  like;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.feed.defs#generatorViewerState";
  }
  check() {
    const issues = [];
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      like: this["like"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyFeedDefsGeneratorViewerState(value);
    record.check();
    return record;
  }
};
var AppBskyFeedDefsInteraction = class _AppBskyFeedDefsInteraction {
  static nsid = "app.bsky.feed.defs";
  static def = "interaction";
  static kind = "object";
  $type;
  item;
  event;
  feedContext;
  reqId;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.feed.defs#interaction";
  }
  check() {
    const issues = [];
    if (typeof this["feedContext"] === "string" && this["feedContext"].length > 2e3) issues.push({ path: "feedContext", message: "Must be at most 2000 characters." });
    if (typeof this["reqId"] === "string" && this["reqId"].length > 100) issues.push({ path: "reqId", message: "Must be at most 100 characters." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      item: this["item"],
      event: this["event"],
      feedContext: this["feedContext"],
      reqId: this["reqId"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyFeedDefsInteraction(value);
    record.check();
    return record;
  }
};
var AppBskyFeedDefsInteractionLike = class {
  static nsid = "app.bsky.feed.defs";
  static def = "interactionLike";
  static kind = "token";
  static value = "app.bsky.feed.defs#interactionLike";
  static description = "User liked the feed item";
  constructor() {
  }
};
var AppBskyFeedDefsInteractionQuote = class {
  static nsid = "app.bsky.feed.defs";
  static def = "interactionQuote";
  static kind = "token";
  static value = "app.bsky.feed.defs#interactionQuote";
  static description = "User quoted the feed item";
  constructor() {
  }
};
var AppBskyFeedDefsInteractionReply = class {
  static nsid = "app.bsky.feed.defs";
  static def = "interactionReply";
  static kind = "token";
  static value = "app.bsky.feed.defs#interactionReply";
  static description = "User replied to the feed item";
  constructor() {
  }
};
var AppBskyFeedDefsInteractionRepost = class {
  static nsid = "app.bsky.feed.defs";
  static def = "interactionRepost";
  static kind = "token";
  static value = "app.bsky.feed.defs#interactionRepost";
  static description = "User reposted the feed item";
  constructor() {
  }
};
var AppBskyFeedDefsInteractionSeen = class {
  static nsid = "app.bsky.feed.defs";
  static def = "interactionSeen";
  static kind = "token";
  static value = "app.bsky.feed.defs#interactionSeen";
  static description = "Feed item was seen by user";
  constructor() {
  }
};
var AppBskyFeedDefsInteractionShare = class {
  static nsid = "app.bsky.feed.defs";
  static def = "interactionShare";
  static kind = "token";
  static value = "app.bsky.feed.defs#interactionShare";
  static description = "User shared the feed item";
  constructor() {
  }
};
var AppBskyFeedDefsKnownLikers = class _AppBskyFeedDefsKnownLikers {
  static nsid = "app.bsky.feed.defs";
  static def = "knownLikers";
  static kind = "object";
  $type;
  count;
  actors;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.feed.defs#knownLikers";
  }
  check() {
    const issues = [];
    if (this["count"] == null) issues.push({ path: "count", message: "Required." });
    if (this["count"] != null) {
      if (!Number.isInteger(this["count"])) issues.push({ path: "count", message: "Must be an integer." });
    }
    if (this["actors"] == null) issues.push({ path: "actors", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      count: this["count"],
      actors: this["actors"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyFeedDefsKnownLikers(value);
    record.check();
    return record;
  }
};
var AppBskyFeedDefsNotFoundPost = class _AppBskyFeedDefsNotFoundPost {
  static nsid = "app.bsky.feed.defs";
  static def = "notFoundPost";
  static kind = "object";
  $type;
  uri;
  notFound;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.feed.defs#notFoundPost";
  }
  check() {
    const issues = [];
    if (this["uri"] == null) issues.push({ path: "uri", message: "Required." });
    if (this["notFound"] == null) issues.push({ path: "notFound", message: "Required." });
    if (this["notFound"] != null && this["notFound"] !== true) issues.push({ path: "notFound", message: "Must be true." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      uri: this["uri"],
      notFound: this["notFound"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyFeedDefsNotFoundPost(value);
    record.check();
    return record;
  }
};
var AppBskyFeedDefsPostView = class _AppBskyFeedDefsPostView {
  static nsid = "app.bsky.feed.defs";
  static def = "postView";
  static kind = "object";
  $type;
  uri;
  cid;
  author;
  record;
  embed;
  bookmarkCount;
  replyCount;
  repostCount;
  likeCount;
  quoteCount;
  indexedAt;
  viewer;
  labels;
  threadgate;
  debug;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.feed.defs#postView";
  }
  check() {
    const issues = [];
    if (this["uri"] == null) issues.push({ path: "uri", message: "Required." });
    if (this["cid"] == null) issues.push({ path: "cid", message: "Required." });
    if (this["author"] == null) issues.push({ path: "author", message: "Required." });
    if (this["record"] == null) issues.push({ path: "record", message: "Required." });
    if (this["bookmarkCount"] != null) {
      if (!Number.isInteger(this["bookmarkCount"])) issues.push({ path: "bookmarkCount", message: "Must be an integer." });
    }
    if (this["replyCount"] != null) {
      if (!Number.isInteger(this["replyCount"])) issues.push({ path: "replyCount", message: "Must be an integer." });
    }
    if (this["repostCount"] != null) {
      if (!Number.isInteger(this["repostCount"])) issues.push({ path: "repostCount", message: "Must be an integer." });
    }
    if (this["likeCount"] != null) {
      if (!Number.isInteger(this["likeCount"])) issues.push({ path: "likeCount", message: "Must be an integer." });
    }
    if (this["quoteCount"] != null) {
      if (!Number.isInteger(this["quoteCount"])) issues.push({ path: "quoteCount", message: "Must be an integer." });
    }
    if (this["indexedAt"] == null) issues.push({ path: "indexedAt", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      uri: this["uri"],
      cid: this["cid"],
      author: this["author"],
      record: this["record"],
      embed: this["embed"],
      bookmarkCount: this["bookmarkCount"],
      replyCount: this["replyCount"],
      repostCount: this["repostCount"],
      likeCount: this["likeCount"],
      quoteCount: this["quoteCount"],
      indexedAt: this["indexedAt"],
      viewer: this["viewer"],
      labels: this["labels"],
      threadgate: this["threadgate"],
      debug: this["debug"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyFeedDefsPostView(value);
    record.check();
    return record;
  }
};
var AppBskyFeedDefsReasonPin = class _AppBskyFeedDefsReasonPin {
  static nsid = "app.bsky.feed.defs";
  static def = "reasonPin";
  static kind = "object";
  $type;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.feed.defs#reasonPin";
  }
  check() {
    const issues = [];
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyFeedDefsReasonPin(value);
    record.check();
    return record;
  }
};
var AppBskyFeedDefsReasonRepost = class _AppBskyFeedDefsReasonRepost {
  static nsid = "app.bsky.feed.defs";
  static def = "reasonRepost";
  static kind = "object";
  $type;
  by;
  uri;
  cid;
  indexedAt;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.feed.defs#reasonRepost";
  }
  check() {
    const issues = [];
    if (this["by"] == null) issues.push({ path: "by", message: "Required." });
    if (this["indexedAt"] == null) issues.push({ path: "indexedAt", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      by: this["by"],
      uri: this["uri"],
      cid: this["cid"],
      indexedAt: this["indexedAt"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyFeedDefsReasonRepost(value);
    record.check();
    return record;
  }
};
var AppBskyFeedDefsReplyRef = class _AppBskyFeedDefsReplyRef {
  static nsid = "app.bsky.feed.defs";
  static def = "replyRef";
  static kind = "object";
  $type;
  root;
  parent;
  grandparentAuthor;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.feed.defs#replyRef";
  }
  check() {
    const issues = [];
    if (this["root"] == null) issues.push({ path: "root", message: "Required." });
    if (this["parent"] == null) issues.push({ path: "parent", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      root: this["root"],
      parent: this["parent"],
      grandparentAuthor: this["grandparentAuthor"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyFeedDefsReplyRef(value);
    record.check();
    return record;
  }
};
var AppBskyFeedDefsRequestLess = class {
  static nsid = "app.bsky.feed.defs";
  static def = "requestLess";
  static kind = "token";
  static value = "app.bsky.feed.defs#requestLess";
  static description = "Request that less content like the given feed item be shown in the feed";
  constructor() {
  }
};
var AppBskyFeedDefsRequestMore = class {
  static nsid = "app.bsky.feed.defs";
  static def = "requestMore";
  static kind = "token";
  static value = "app.bsky.feed.defs#requestMore";
  static description = "Request that more content like the given feed item be shown in the feed";
  constructor() {
  }
};
var AppBskyFeedDefsSkeletonFeedPost = class _AppBskyFeedDefsSkeletonFeedPost {
  static nsid = "app.bsky.feed.defs";
  static def = "skeletonFeedPost";
  static kind = "object";
  $type;
  post;
  reason;
  feedContext;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.feed.defs#skeletonFeedPost";
  }
  check() {
    const issues = [];
    if (this["post"] == null) issues.push({ path: "post", message: "Required." });
    if (typeof this["feedContext"] === "string" && this["feedContext"].length > 2e3) issues.push({ path: "feedContext", message: "Must be at most 2000 characters." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      post: this["post"],
      reason: this["reason"],
      feedContext: this["feedContext"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyFeedDefsSkeletonFeedPost(value);
    record.check();
    return record;
  }
};
var AppBskyFeedDefsSkeletonReasonPin = class _AppBskyFeedDefsSkeletonReasonPin {
  static nsid = "app.bsky.feed.defs";
  static def = "skeletonReasonPin";
  static kind = "object";
  $type;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.feed.defs#skeletonReasonPin";
  }
  check() {
    const issues = [];
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyFeedDefsSkeletonReasonPin(value);
    record.check();
    return record;
  }
};
var AppBskyFeedDefsSkeletonReasonRepost = class _AppBskyFeedDefsSkeletonReasonRepost {
  static nsid = "app.bsky.feed.defs";
  static def = "skeletonReasonRepost";
  static kind = "object";
  $type;
  repost;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.feed.defs#skeletonReasonRepost";
  }
  check() {
    const issues = [];
    if (this["repost"] == null) issues.push({ path: "repost", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      repost: this["repost"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyFeedDefsSkeletonReasonRepost(value);
    record.check();
    return record;
  }
};
var AppBskyFeedDefsThreadContext = class _AppBskyFeedDefsThreadContext {
  static nsid = "app.bsky.feed.defs";
  static def = "threadContext";
  static kind = "object";
  $type;
  rootAuthorLike;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.feed.defs#threadContext";
  }
  check() {
    const issues = [];
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      rootAuthorLike: this["rootAuthorLike"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyFeedDefsThreadContext(value);
    record.check();
    return record;
  }
};
var AppBskyFeedDefsThreadgateView = class _AppBskyFeedDefsThreadgateView {
  static nsid = "app.bsky.feed.defs";
  static def = "threadgateView";
  static kind = "object";
  $type;
  uri;
  cid;
  record;
  lists;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.feed.defs#threadgateView";
  }
  check() {
    const issues = [];
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      uri: this["uri"],
      cid: this["cid"],
      record: this["record"],
      lists: this["lists"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyFeedDefsThreadgateView(value);
    record.check();
    return record;
  }
};
var AppBskyFeedDefsThreadViewPost = class _AppBskyFeedDefsThreadViewPost {
  static nsid = "app.bsky.feed.defs";
  static def = "threadViewPost";
  static kind = "object";
  $type;
  post;
  parent;
  replies;
  threadContext;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.feed.defs#threadViewPost";
  }
  check() {
    const issues = [];
    if (this["post"] == null) issues.push({ path: "post", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      post: this["post"],
      parent: this["parent"],
      replies: this["replies"],
      threadContext: this["threadContext"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyFeedDefsThreadViewPost(value);
    record.check();
    return record;
  }
};
var AppBskyFeedDefsViewerState = class _AppBskyFeedDefsViewerState {
  static nsid = "app.bsky.feed.defs";
  static def = "viewerState";
  static kind = "object";
  $type;
  repost;
  like;
  bookmarked;
  threadMuted;
  replyDisabled;
  embeddingDisabled;
  pinned;
  knownLikers;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.feed.defs#viewerState";
  }
  check() {
    const issues = [];
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      repost: this["repost"],
      like: this["like"],
      bookmarked: this["bookmarked"],
      threadMuted: this["threadMuted"],
      replyDisabled: this["replyDisabled"],
      embeddingDisabled: this["embeddingDisabled"],
      pinned: this["pinned"],
      knownLikers: this["knownLikers"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyFeedDefsViewerState(value);
    record.check();
    return record;
  }
};
var AppBskyFeedDescribeFeedGenerator = class _AppBskyFeedDescribeFeedGenerator {
  static nsid = "app.bsky.feed.describeFeedGenerator";
  static def = "main";
  static kind = "query";
  static http = "GET";
  static errorNames = [];
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({});
  }
  check() {
    const issues = [];
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _AppBskyFeedDescribeFeedGenerator.nsid,
      method: "GET",
      params: this.toParams(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyFeedDescribeFeedGenerator(value);
    record.check();
    return record;
  }
};
var AppBskyFeedDescribeFeedGeneratorFeed = class _AppBskyFeedDescribeFeedGeneratorFeed {
  static nsid = "app.bsky.feed.describeFeedGenerator";
  static def = "feed";
  static kind = "object";
  $type;
  uri;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.feed.describeFeedGenerator#feed";
  }
  check() {
    const issues = [];
    if (this["uri"] == null) issues.push({ path: "uri", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      uri: this["uri"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyFeedDescribeFeedGeneratorFeed(value);
    record.check();
    return record;
  }
};
var AppBskyFeedDescribeFeedGeneratorLinks = class _AppBskyFeedDescribeFeedGeneratorLinks {
  static nsid = "app.bsky.feed.describeFeedGenerator";
  static def = "links";
  static kind = "object";
  $type;
  privacyPolicy;
  termsOfService;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.feed.describeFeedGenerator#links";
  }
  check() {
    const issues = [];
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      privacyPolicy: this["privacyPolicy"],
      termsOfService: this["termsOfService"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyFeedDescribeFeedGeneratorLinks(value);
    record.check();
    return record;
  }
};
var AppBskyFeedGenerator = class _AppBskyFeedGenerator {
  static nsid = "app.bsky.feed.generator";
  static def = "main";
  static kind = "record";
  static recordKey = "any";
  $type;
  did;
  displayName;
  description;
  descriptionFacets;
  avatar;
  acceptsInteractions;
  labels;
  contentMode;
  createdAt;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.feed.generator";
  }
  check() {
    const issues = [];
    if (this["did"] == null) issues.push({ path: "did", message: "Required." });
    if (this["displayName"] == null) issues.push({ path: "displayName", message: "Required." });
    if (typeof this["displayName"] === "string" && this["displayName"].length > 240) issues.push({ path: "displayName", message: "Must be at most 240 characters." });
    if (typeof this["description"] === "string" && this["description"].length > 3e3) issues.push({ path: "description", message: "Must be at most 3000 characters." });
    if (this["createdAt"] == null) issues.push({ path: "createdAt", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      did: this["did"],
      displayName: this["displayName"],
      description: this["description"],
      descriptionFacets: this["descriptionFacets"],
      avatar: this["avatar"],
      acceptsInteractions: this["acceptsInteractions"],
      labels: this["labels"],
      contentMode: this["contentMode"],
      createdAt: this["createdAt"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyFeedGenerator(value);
    record.check();
    return record;
  }
};
var AppBskyFeedGetActorFeeds = class _AppBskyFeedGetActorFeeds {
  static nsid = "app.bsky.feed.getActorFeeds";
  static def = "main";
  static kind = "query";
  static http = "GET";
  static errorNames = [];
  actor;
  limit;
  cursor;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({
      actor: this["actor"],
      limit: this["limit"],
      cursor: this["cursor"]
    });
  }
  check() {
    const issues = [];
    if (this["actor"] == null) issues.push({ path: "actor", message: "Required." });
    if (this["limit"] != null) {
      if (!Number.isInteger(this["limit"])) issues.push({ path: "limit", message: "Must be an integer." });
      else if (this["limit"] < 1) issues.push({ path: "limit", message: "Must be at least 1." });
      else if (this["limit"] > 100) issues.push({ path: "limit", message: "Must be at most 100." });
    }
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _AppBskyFeedGetActorFeeds.nsid,
      method: "GET",
      params: this.toParams(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyFeedGetActorFeeds(value);
    record.check();
    return record;
  }
};
var AppBskyFeedGetActorLikes = class _AppBskyFeedGetActorLikes {
  static nsid = "app.bsky.feed.getActorLikes";
  static def = "main";
  static kind = "query";
  static http = "GET";
  static errorNames = ["BlockedActor", "BlockedByActor"];
  actor;
  limit;
  cursor;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({
      actor: this["actor"],
      limit: this["limit"],
      cursor: this["cursor"]
    });
  }
  check() {
    const issues = [];
    if (this["actor"] == null) issues.push({ path: "actor", message: "Required." });
    if (this["limit"] != null) {
      if (!Number.isInteger(this["limit"])) issues.push({ path: "limit", message: "Must be an integer." });
      else if (this["limit"] < 1) issues.push({ path: "limit", message: "Must be at least 1." });
      else if (this["limit"] > 100) issues.push({ path: "limit", message: "Must be at most 100." });
    }
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _AppBskyFeedGetActorLikes.nsid,
      method: "GET",
      params: this.toParams(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyFeedGetActorLikes(value);
    record.check();
    return record;
  }
};
var AppBskyFeedGetAuthorFeed = class _AppBskyFeedGetAuthorFeed {
  static nsid = "app.bsky.feed.getAuthorFeed";
  static def = "main";
  static kind = "query";
  static http = "GET";
  static errorNames = ["BlockedActor", "BlockedByActor"];
  actor;
  limit;
  cursor;
  filter;
  includePins;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({
      actor: this["actor"],
      limit: this["limit"],
      cursor: this["cursor"],
      filter: this["filter"],
      includePins: this["includePins"]
    });
  }
  check() {
    const issues = [];
    if (this["actor"] == null) issues.push({ path: "actor", message: "Required." });
    if (this["limit"] != null) {
      if (!Number.isInteger(this["limit"])) issues.push({ path: "limit", message: "Must be an integer." });
      else if (this["limit"] < 1) issues.push({ path: "limit", message: "Must be at least 1." });
      else if (this["limit"] > 100) issues.push({ path: "limit", message: "Must be at most 100." });
    }
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _AppBskyFeedGetAuthorFeed.nsid,
      method: "GET",
      params: this.toParams(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyFeedGetAuthorFeed(value);
    record.check();
    return record;
  }
};
var AppBskyFeedGetFeed = class _AppBskyFeedGetFeed {
  static nsid = "app.bsky.feed.getFeed";
  static def = "main";
  static kind = "query";
  static http = "GET";
  static errorNames = ["UnknownFeed"];
  feed;
  limit;
  cursor;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({
      feed: this["feed"],
      limit: this["limit"],
      cursor: this["cursor"]
    });
  }
  check() {
    const issues = [];
    if (this["feed"] == null) issues.push({ path: "feed", message: "Required." });
    if (this["limit"] != null) {
      if (!Number.isInteger(this["limit"])) issues.push({ path: "limit", message: "Must be an integer." });
      else if (this["limit"] < 1) issues.push({ path: "limit", message: "Must be at least 1." });
      else if (this["limit"] > 100) issues.push({ path: "limit", message: "Must be at most 100." });
    }
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _AppBskyFeedGetFeed.nsid,
      method: "GET",
      params: this.toParams(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyFeedGetFeed(value);
    record.check();
    return record;
  }
};
var AppBskyFeedGetFeedGenerator = class _AppBskyFeedGetFeedGenerator {
  static nsid = "app.bsky.feed.getFeedGenerator";
  static def = "main";
  static kind = "query";
  static http = "GET";
  static errorNames = [];
  feed;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({
      feed: this["feed"]
    });
  }
  check() {
    const issues = [];
    if (this["feed"] == null) issues.push({ path: "feed", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _AppBskyFeedGetFeedGenerator.nsid,
      method: "GET",
      params: this.toParams(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyFeedGetFeedGenerator(value);
    record.check();
    return record;
  }
};
var AppBskyFeedGetFeedGenerators = class _AppBskyFeedGetFeedGenerators {
  static nsid = "app.bsky.feed.getFeedGenerators";
  static def = "main";
  static kind = "query";
  static http = "GET";
  static errorNames = [];
  feeds;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({
      feeds: this["feeds"]
    });
  }
  check() {
    const issues = [];
    if (this["feeds"] == null) issues.push({ path: "feeds", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _AppBskyFeedGetFeedGenerators.nsid,
      method: "GET",
      params: this.toParams(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyFeedGetFeedGenerators(value);
    record.check();
    return record;
  }
};
var AppBskyFeedGetFeedSkeleton = class _AppBskyFeedGetFeedSkeleton {
  static nsid = "app.bsky.feed.getFeedSkeleton";
  static def = "main";
  static kind = "query";
  static http = "GET";
  static errorNames = ["UnknownFeed"];
  feed;
  limit;
  cursor;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({
      feed: this["feed"],
      limit: this["limit"],
      cursor: this["cursor"]
    });
  }
  check() {
    const issues = [];
    if (this["feed"] == null) issues.push({ path: "feed", message: "Required." });
    if (this["limit"] != null) {
      if (!Number.isInteger(this["limit"])) issues.push({ path: "limit", message: "Must be an integer." });
      else if (this["limit"] < 1) issues.push({ path: "limit", message: "Must be at least 1." });
      else if (this["limit"] > 100) issues.push({ path: "limit", message: "Must be at most 100." });
    }
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _AppBskyFeedGetFeedSkeleton.nsid,
      method: "GET",
      params: this.toParams(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyFeedGetFeedSkeleton(value);
    record.check();
    return record;
  }
};
var AppBskyFeedGetLikes = class _AppBskyFeedGetLikes {
  static nsid = "app.bsky.feed.getLikes";
  static def = "main";
  static kind = "query";
  static http = "GET";
  static errorNames = [];
  uri;
  cid;
  limit;
  cursor;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({
      uri: this["uri"],
      cid: this["cid"],
      limit: this["limit"],
      cursor: this["cursor"]
    });
  }
  check() {
    const issues = [];
    if (this["uri"] == null) issues.push({ path: "uri", message: "Required." });
    if (this["limit"] != null) {
      if (!Number.isInteger(this["limit"])) issues.push({ path: "limit", message: "Must be an integer." });
      else if (this["limit"] < 1) issues.push({ path: "limit", message: "Must be at least 1." });
      else if (this["limit"] > 100) issues.push({ path: "limit", message: "Must be at most 100." });
    }
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _AppBskyFeedGetLikes.nsid,
      method: "GET",
      params: this.toParams(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyFeedGetLikes(value);
    record.check();
    return record;
  }
};
var AppBskyFeedGetLikesLike = class _AppBskyFeedGetLikesLike {
  static nsid = "app.bsky.feed.getLikes";
  static def = "like";
  static kind = "object";
  $type;
  indexedAt;
  createdAt;
  actor;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.feed.getLikes#like";
  }
  check() {
    const issues = [];
    if (this["indexedAt"] == null) issues.push({ path: "indexedAt", message: "Required." });
    if (this["createdAt"] == null) issues.push({ path: "createdAt", message: "Required." });
    if (this["actor"] == null) issues.push({ path: "actor", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      indexedAt: this["indexedAt"],
      createdAt: this["createdAt"],
      actor: this["actor"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyFeedGetLikesLike(value);
    record.check();
    return record;
  }
};
var AppBskyFeedGetListFeed = class _AppBskyFeedGetListFeed {
  static nsid = "app.bsky.feed.getListFeed";
  static def = "main";
  static kind = "query";
  static http = "GET";
  static errorNames = ["UnknownList"];
  list;
  limit;
  cursor;
  since;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({
      list: this["list"],
      limit: this["limit"],
      cursor: this["cursor"],
      since: this["since"]
    });
  }
  check() {
    const issues = [];
    if (this["list"] == null) issues.push({ path: "list", message: "Required." });
    if (this["limit"] != null) {
      if (!Number.isInteger(this["limit"])) issues.push({ path: "limit", message: "Must be an integer." });
      else if (this["limit"] < 1) issues.push({ path: "limit", message: "Must be at least 1." });
      else if (this["limit"] > 100) issues.push({ path: "limit", message: "Must be at most 100." });
    }
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _AppBskyFeedGetListFeed.nsid,
      method: "GET",
      params: this.toParams(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyFeedGetListFeed(value);
    record.check();
    return record;
  }
};
var AppBskyFeedGetPosts = class _AppBskyFeedGetPosts {
  static nsid = "app.bsky.feed.getPosts";
  static def = "main";
  static kind = "query";
  static http = "GET";
  static errorNames = [];
  uris;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({
      uris: this["uris"]
    });
  }
  check() {
    const issues = [];
    if (this["uris"] == null) issues.push({ path: "uris", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _AppBskyFeedGetPosts.nsid,
      method: "GET",
      params: this.toParams(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyFeedGetPosts(value);
    record.check();
    return record;
  }
};
var AppBskyFeedGetPostThread = class _AppBskyFeedGetPostThread {
  static nsid = "app.bsky.feed.getPostThread";
  static def = "main";
  static kind = "query";
  static http = "GET";
  static errorNames = ["NotFound"];
  uri;
  depth;
  parentHeight;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({
      uri: this["uri"],
      depth: this["depth"],
      parentHeight: this["parentHeight"]
    });
  }
  check() {
    const issues = [];
    if (this["uri"] == null) issues.push({ path: "uri", message: "Required." });
    if (this["depth"] != null) {
      if (!Number.isInteger(this["depth"])) issues.push({ path: "depth", message: "Must be an integer." });
      else if (this["depth"] < 0) issues.push({ path: "depth", message: "Must be at least 0." });
      else if (this["depth"] > 1e3) issues.push({ path: "depth", message: "Must be at most 1000." });
    }
    if (this["parentHeight"] != null) {
      if (!Number.isInteger(this["parentHeight"])) issues.push({ path: "parentHeight", message: "Must be an integer." });
      else if (this["parentHeight"] < 0) issues.push({ path: "parentHeight", message: "Must be at least 0." });
      else if (this["parentHeight"] > 1e3) issues.push({ path: "parentHeight", message: "Must be at most 1000." });
    }
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _AppBskyFeedGetPostThread.nsid,
      method: "GET",
      params: this.toParams(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyFeedGetPostThread(value);
    record.check();
    return record;
  }
};
var AppBskyFeedGetQuotes = class _AppBskyFeedGetQuotes {
  static nsid = "app.bsky.feed.getQuotes";
  static def = "main";
  static kind = "query";
  static http = "GET";
  static errorNames = [];
  uri;
  cid;
  limit;
  cursor;
  sort;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({
      uri: this["uri"],
      cid: this["cid"],
      limit: this["limit"],
      cursor: this["cursor"],
      sort: this["sort"]
    });
  }
  check() {
    const issues = [];
    if (this["uri"] == null) issues.push({ path: "uri", message: "Required." });
    if (this["limit"] != null) {
      if (!Number.isInteger(this["limit"])) issues.push({ path: "limit", message: "Must be an integer." });
      else if (this["limit"] < 1) issues.push({ path: "limit", message: "Must be at least 1." });
      else if (this["limit"] > 100) issues.push({ path: "limit", message: "Must be at most 100." });
    }
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _AppBskyFeedGetQuotes.nsid,
      method: "GET",
      params: this.toParams(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyFeedGetQuotes(value);
    record.check();
    return record;
  }
};
var AppBskyFeedGetRepostedBy = class _AppBskyFeedGetRepostedBy {
  static nsid = "app.bsky.feed.getRepostedBy";
  static def = "main";
  static kind = "query";
  static http = "GET";
  static errorNames = [];
  uri;
  cid;
  limit;
  cursor;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({
      uri: this["uri"],
      cid: this["cid"],
      limit: this["limit"],
      cursor: this["cursor"]
    });
  }
  check() {
    const issues = [];
    if (this["uri"] == null) issues.push({ path: "uri", message: "Required." });
    if (this["limit"] != null) {
      if (!Number.isInteger(this["limit"])) issues.push({ path: "limit", message: "Must be an integer." });
      else if (this["limit"] < 1) issues.push({ path: "limit", message: "Must be at least 1." });
      else if (this["limit"] > 100) issues.push({ path: "limit", message: "Must be at most 100." });
    }
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _AppBskyFeedGetRepostedBy.nsid,
      method: "GET",
      params: this.toParams(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyFeedGetRepostedBy(value);
    record.check();
    return record;
  }
};
var AppBskyFeedGetSuggestedFeeds = class _AppBskyFeedGetSuggestedFeeds {
  static nsid = "app.bsky.feed.getSuggestedFeeds";
  static def = "main";
  static kind = "query";
  static http = "GET";
  static errorNames = [];
  limit;
  cursor;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({
      limit: this["limit"],
      cursor: this["cursor"]
    });
  }
  check() {
    const issues = [];
    if (this["limit"] != null) {
      if (!Number.isInteger(this["limit"])) issues.push({ path: "limit", message: "Must be an integer." });
      else if (this["limit"] < 1) issues.push({ path: "limit", message: "Must be at least 1." });
      else if (this["limit"] > 100) issues.push({ path: "limit", message: "Must be at most 100." });
    }
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _AppBskyFeedGetSuggestedFeeds.nsid,
      method: "GET",
      params: this.toParams(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyFeedGetSuggestedFeeds(value);
    record.check();
    return record;
  }
};
var AppBskyFeedGetTimeline = class _AppBskyFeedGetTimeline {
  static nsid = "app.bsky.feed.getTimeline";
  static def = "main";
  static kind = "query";
  static http = "GET";
  static errorNames = [];
  algorithm;
  limit;
  cursor;
  since;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({
      algorithm: this["algorithm"],
      limit: this["limit"],
      cursor: this["cursor"],
      since: this["since"]
    });
  }
  check() {
    const issues = [];
    if (this["limit"] != null) {
      if (!Number.isInteger(this["limit"])) issues.push({ path: "limit", message: "Must be an integer." });
      else if (this["limit"] < 1) issues.push({ path: "limit", message: "Must be at least 1." });
      else if (this["limit"] > 100) issues.push({ path: "limit", message: "Must be at most 100." });
    }
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _AppBskyFeedGetTimeline.nsid,
      method: "GET",
      params: this.toParams(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyFeedGetTimeline(value);
    record.check();
    return record;
  }
};
var AppBskyFeedLike = class _AppBskyFeedLike {
  static nsid = "app.bsky.feed.like";
  static def = "main";
  static kind = "record";
  static recordKey = "tid";
  $type;
  subject;
  createdAt;
  via;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.feed.like";
  }
  check() {
    const issues = [];
    if (this["subject"] == null) issues.push({ path: "subject", message: "Required." });
    if (this["createdAt"] == null) issues.push({ path: "createdAt", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      subject: this["subject"],
      createdAt: this["createdAt"],
      via: this["via"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyFeedLike(value);
    record.check();
    return record;
  }
};
var AppBskyFeedPost = class _AppBskyFeedPost {
  static nsid = "app.bsky.feed.post";
  static def = "main";
  static kind = "record";
  static recordKey = "tid";
  $type;
  text;
  entities;
  facets;
  reply;
  embed;
  langs;
  labels;
  tags;
  createdAt;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.feed.post";
  }
  check() {
    const issues = [];
    if (this["text"] == null) issues.push({ path: "text", message: "Required." });
    if (typeof this["text"] === "string" && this["text"].length > 3e3) issues.push({ path: "text", message: "Must be at most 3000 characters." });
    if (this["createdAt"] == null) issues.push({ path: "createdAt", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      text: this["text"],
      entities: this["entities"],
      facets: this["facets"],
      reply: this["reply"],
      embed: this["embed"],
      langs: this["langs"],
      labels: this["labels"],
      tags: this["tags"],
      createdAt: this["createdAt"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyFeedPost(value);
    record.check();
    return record;
  }
};
var AppBskyFeedPostEntity = class _AppBskyFeedPostEntity {
  static nsid = "app.bsky.feed.post";
  static def = "entity";
  static kind = "object";
  $type;
  index;
  type;
  value;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.feed.post#entity";
  }
  check() {
    const issues = [];
    if (this["index"] == null) issues.push({ path: "index", message: "Required." });
    if (this["type"] == null) issues.push({ path: "type", message: "Required." });
    if (this["value"] == null) issues.push({ path: "value", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      index: this["index"],
      type: this["type"],
      value: this["value"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyFeedPostEntity(value);
    record.check();
    return record;
  }
};
var AppBskyFeedPostReplyRef = class _AppBskyFeedPostReplyRef {
  static nsid = "app.bsky.feed.post";
  static def = "replyRef";
  static kind = "object";
  $type;
  root;
  parent;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.feed.post#replyRef";
  }
  check() {
    const issues = [];
    if (this["root"] == null) issues.push({ path: "root", message: "Required." });
    if (this["parent"] == null) issues.push({ path: "parent", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      root: this["root"],
      parent: this["parent"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyFeedPostReplyRef(value);
    record.check();
    return record;
  }
};
var AppBskyFeedPostTextSlice = class _AppBskyFeedPostTextSlice {
  static nsid = "app.bsky.feed.post";
  static def = "textSlice";
  static kind = "object";
  $type;
  start;
  end;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.feed.post#textSlice";
  }
  check() {
    const issues = [];
    if (this["start"] == null) issues.push({ path: "start", message: "Required." });
    if (this["start"] != null) {
      if (!Number.isInteger(this["start"])) issues.push({ path: "start", message: "Must be an integer." });
      else if (this["start"] < 0) issues.push({ path: "start", message: "Must be at least 0." });
    }
    if (this["end"] == null) issues.push({ path: "end", message: "Required." });
    if (this["end"] != null) {
      if (!Number.isInteger(this["end"])) issues.push({ path: "end", message: "Must be an integer." });
      else if (this["end"] < 0) issues.push({ path: "end", message: "Must be at least 0." });
    }
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      start: this["start"],
      end: this["end"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyFeedPostTextSlice(value);
    record.check();
    return record;
  }
};
var AppBskyFeedPostgate = class _AppBskyFeedPostgate {
  static nsid = "app.bsky.feed.postgate";
  static def = "main";
  static kind = "record";
  static recordKey = "tid";
  $type;
  createdAt;
  post;
  detachedEmbeddingUris;
  embeddingRules;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.feed.postgate";
  }
  check() {
    const issues = [];
    if (this["createdAt"] == null) issues.push({ path: "createdAt", message: "Required." });
    if (this["post"] == null) issues.push({ path: "post", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      createdAt: this["createdAt"],
      post: this["post"],
      detachedEmbeddingUris: this["detachedEmbeddingUris"],
      embeddingRules: this["embeddingRules"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyFeedPostgate(value);
    record.check();
    return record;
  }
};
var AppBskyFeedPostgateDisableRule = class _AppBskyFeedPostgateDisableRule {
  static nsid = "app.bsky.feed.postgate";
  static def = "disableRule";
  static kind = "object";
  $type;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.feed.postgate#disableRule";
  }
  check() {
    const issues = [];
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyFeedPostgateDisableRule(value);
    record.check();
    return record;
  }
};
var AppBskyFeedRepost = class _AppBskyFeedRepost {
  static nsid = "app.bsky.feed.repost";
  static def = "main";
  static kind = "record";
  static recordKey = "tid";
  $type;
  subject;
  createdAt;
  via;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.feed.repost";
  }
  check() {
    const issues = [];
    if (this["subject"] == null) issues.push({ path: "subject", message: "Required." });
    if (this["createdAt"] == null) issues.push({ path: "createdAt", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      subject: this["subject"],
      createdAt: this["createdAt"],
      via: this["via"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyFeedRepost(value);
    record.check();
    return record;
  }
};
var AppBskyFeedSearchPosts = class _AppBskyFeedSearchPosts {
  static nsid = "app.bsky.feed.searchPosts";
  static def = "main";
  static kind = "query";
  static http = "GET";
  static errorNames = ["BadQueryString"];
  q;
  sort;
  since;
  until;
  mentions;
  author;
  lang;
  domain;
  url;
  tag;
  limit;
  cursor;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({
      q: this["q"],
      sort: this["sort"],
      since: this["since"],
      until: this["until"],
      mentions: this["mentions"],
      author: this["author"],
      lang: this["lang"],
      domain: this["domain"],
      url: this["url"],
      tag: this["tag"],
      limit: this["limit"],
      cursor: this["cursor"]
    });
  }
  check() {
    const issues = [];
    if (this["q"] == null) issues.push({ path: "q", message: "Required." });
    if (this["limit"] != null) {
      if (!Number.isInteger(this["limit"])) issues.push({ path: "limit", message: "Must be an integer." });
      else if (this["limit"] < 1) issues.push({ path: "limit", message: "Must be at least 1." });
      else if (this["limit"] > 100) issues.push({ path: "limit", message: "Must be at most 100." });
    }
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _AppBskyFeedSearchPosts.nsid,
      method: "GET",
      params: this.toParams(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyFeedSearchPosts(value);
    record.check();
    return record;
  }
};
var AppBskyFeedSearchPostsV2 = class _AppBskyFeedSearchPostsV2 {
  static nsid = "app.bsky.feed.searchPostsV2";
  static def = "main";
  static kind = "query";
  static http = "GET";
  static errorNames = ["BadQueryString"];
  cursor;
  limit;
  query;
  sort;
  authors;
  mentions;
  domains;
  urls;
  embeddedAtUris;
  hashtags;
  excludeAuthors;
  excludeMentions;
  excludeDomains;
  excludeUrls;
  excludeEmbeddedAtUris;
  excludeHashtags;
  since;
  until;
  allTime;
  languages;
  excludeLanguages;
  hasMedia;
  hasVideo;
  replyParentUri;
  threadRootUri;
  excludeReplies;
  repliesOnly;
  following;
  queryLanguage;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({
      cursor: this["cursor"],
      limit: this["limit"],
      query: this["query"],
      sort: this["sort"],
      authors: this["authors"],
      mentions: this["mentions"],
      domains: this["domains"],
      urls: this["urls"],
      embeddedAtUris: this["embeddedAtUris"],
      hashtags: this["hashtags"],
      excludeAuthors: this["excludeAuthors"],
      excludeMentions: this["excludeMentions"],
      excludeDomains: this["excludeDomains"],
      excludeUrls: this["excludeUrls"],
      excludeEmbeddedAtUris: this["excludeEmbeddedAtUris"],
      excludeHashtags: this["excludeHashtags"],
      since: this["since"],
      until: this["until"],
      allTime: this["allTime"],
      languages: this["languages"],
      excludeLanguages: this["excludeLanguages"],
      hasMedia: this["hasMedia"],
      hasVideo: this["hasVideo"],
      replyParentUri: this["replyParentUri"],
      threadRootUri: this["threadRootUri"],
      excludeReplies: this["excludeReplies"],
      repliesOnly: this["repliesOnly"],
      following: this["following"],
      queryLanguage: this["queryLanguage"]
    });
  }
  check() {
    const issues = [];
    if (this["limit"] != null) {
      if (!Number.isInteger(this["limit"])) issues.push({ path: "limit", message: "Must be an integer." });
      else if (this["limit"] < 1) issues.push({ path: "limit", message: "Must be at least 1." });
      else if (this["limit"] > 100) issues.push({ path: "limit", message: "Must be at most 100." });
    }
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _AppBskyFeedSearchPostsV2.nsid,
      method: "GET",
      params: this.toParams(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyFeedSearchPostsV2(value);
    record.check();
    return record;
  }
};
var AppBskyFeedSendInteractions = class _AppBskyFeedSendInteractions {
  static nsid = "app.bsky.feed.sendInteractions";
  static def = "main";
  static kind = "procedure";
  static http = "POST";
  static errorNames = [];
  feed;
  interactions;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({});
  }
  toBody() {
    return jsonOf({
      feed: this["feed"],
      interactions: this["interactions"]
    });
  }
  check() {
    const issues = [];
    if (this["interactions"] == null) issues.push({ path: "interactions", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _AppBskyFeedSendInteractions.nsid,
      method: "POST",
      params: this.toParams(),
      body: this.toBody(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyFeedSendInteractions(value);
    record.check();
    return record;
  }
};
var AppBskyFeedThreadgate = class _AppBskyFeedThreadgate {
  static nsid = "app.bsky.feed.threadgate";
  static def = "main";
  static kind = "record";
  static recordKey = "tid";
  $type;
  post;
  allow;
  createdAt;
  hiddenReplies;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.feed.threadgate";
  }
  check() {
    const issues = [];
    if (this["post"] == null) issues.push({ path: "post", message: "Required." });
    if (this["createdAt"] == null) issues.push({ path: "createdAt", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      post: this["post"],
      allow: this["allow"],
      createdAt: this["createdAt"],
      hiddenReplies: this["hiddenReplies"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyFeedThreadgate(value);
    record.check();
    return record;
  }
};
var AppBskyFeedThreadgateFollowerRule = class _AppBskyFeedThreadgateFollowerRule {
  static nsid = "app.bsky.feed.threadgate";
  static def = "followerRule";
  static kind = "object";
  $type;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.feed.threadgate#followerRule";
  }
  check() {
    const issues = [];
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyFeedThreadgateFollowerRule(value);
    record.check();
    return record;
  }
};
var AppBskyFeedThreadgateFollowingRule = class _AppBskyFeedThreadgateFollowingRule {
  static nsid = "app.bsky.feed.threadgate";
  static def = "followingRule";
  static kind = "object";
  $type;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.feed.threadgate#followingRule";
  }
  check() {
    const issues = [];
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyFeedThreadgateFollowingRule(value);
    record.check();
    return record;
  }
};
var AppBskyFeedThreadgateListRule = class _AppBskyFeedThreadgateListRule {
  static nsid = "app.bsky.feed.threadgate";
  static def = "listRule";
  static kind = "object";
  $type;
  list;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.feed.threadgate#listRule";
  }
  check() {
    const issues = [];
    if (this["list"] == null) issues.push({ path: "list", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      list: this["list"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyFeedThreadgateListRule(value);
    record.check();
    return record;
  }
};
var AppBskyFeedThreadgateMentionRule = class _AppBskyFeedThreadgateMentionRule {
  static nsid = "app.bsky.feed.threadgate";
  static def = "mentionRule";
  static kind = "object";
  $type;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.feed.threadgate#mentionRule";
  }
  check() {
    const issues = [];
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyFeedThreadgateMentionRule(value);
    record.check();
    return record;
  }
};
var AppBskyGraphBlock = class _AppBskyGraphBlock {
  static nsid = "app.bsky.graph.block";
  static def = "main";
  static kind = "record";
  static recordKey = "tid";
  $type;
  subject;
  createdAt;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.graph.block";
  }
  check() {
    const issues = [];
    if (this["subject"] == null) issues.push({ path: "subject", message: "Required." });
    if (this["createdAt"] == null) issues.push({ path: "createdAt", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      subject: this["subject"],
      createdAt: this["createdAt"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyGraphBlock(value);
    record.check();
    return record;
  }
};
var AppBskyGraphDefsCuratelist = class {
  static nsid = "app.bsky.graph.defs";
  static def = "curatelist";
  static kind = "token";
  static value = "app.bsky.graph.defs#curatelist";
  static description = "A list of actors used for curation purposes such as list feeds or interaction gating.";
  constructor() {
  }
};
var AppBskyGraphDefsListItemView = class _AppBskyGraphDefsListItemView {
  static nsid = "app.bsky.graph.defs";
  static def = "listItemView";
  static kind = "object";
  $type;
  uri;
  subject;
  subjectOptedOut;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.graph.defs#listItemView";
  }
  check() {
    const issues = [];
    if (this["uri"] == null) issues.push({ path: "uri", message: "Required." });
    if (this["subject"] == null) issues.push({ path: "subject", message: "Required." });
    if (this["subjectOptedOut"] != null && this["subjectOptedOut"] !== true) issues.push({ path: "subjectOptedOut", message: "Must be true." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      uri: this["uri"],
      subject: this["subject"],
      subjectOptedOut: this["subjectOptedOut"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyGraphDefsListItemView(value);
    record.check();
    return record;
  }
};
var AppBskyGraphDefsListPurpose = class _AppBskyGraphDefsListPurpose {
  static nsid = "app.bsky.graph.defs";
  static def = "listPurpose";
  static kind = "string";
  static knownValues = ["app.bsky.graph.defs#modlist", "app.bsky.graph.defs#curatelist", "app.bsky.graph.defs#referencelist"];
  static includes(value) {
    return _AppBskyGraphDefsListPurpose.knownValues.includes(value);
  }
  constructor() {
  }
};
var AppBskyGraphDefsListView = class _AppBskyGraphDefsListView {
  static nsid = "app.bsky.graph.defs";
  static def = "listView";
  static kind = "object";
  $type;
  uri;
  cid;
  creator;
  name;
  purpose;
  description;
  descriptionFacets;
  avatar;
  listItemCount;
  labels;
  viewer;
  indexedAt;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.graph.defs#listView";
  }
  check() {
    const issues = [];
    if (this["uri"] == null) issues.push({ path: "uri", message: "Required." });
    if (this["cid"] == null) issues.push({ path: "cid", message: "Required." });
    if (this["creator"] == null) issues.push({ path: "creator", message: "Required." });
    if (this["name"] == null) issues.push({ path: "name", message: "Required." });
    if (typeof this["name"] === "string" && this["name"].length > 64) issues.push({ path: "name", message: "Must be at most 64 characters." });
    if (this["purpose"] == null) issues.push({ path: "purpose", message: "Required." });
    if (typeof this["description"] === "string" && this["description"].length > 3e3) issues.push({ path: "description", message: "Must be at most 3000 characters." });
    if (this["listItemCount"] != null) {
      if (!Number.isInteger(this["listItemCount"])) issues.push({ path: "listItemCount", message: "Must be an integer." });
      else if (this["listItemCount"] < 0) issues.push({ path: "listItemCount", message: "Must be at least 0." });
    }
    if (this["indexedAt"] == null) issues.push({ path: "indexedAt", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      uri: this["uri"],
      cid: this["cid"],
      creator: this["creator"],
      name: this["name"],
      purpose: this["purpose"],
      description: this["description"],
      descriptionFacets: this["descriptionFacets"],
      avatar: this["avatar"],
      listItemCount: this["listItemCount"],
      labels: this["labels"],
      viewer: this["viewer"],
      indexedAt: this["indexedAt"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyGraphDefsListView(value);
    record.check();
    return record;
  }
};
var AppBskyGraphDefsListViewBasic = class _AppBskyGraphDefsListViewBasic {
  static nsid = "app.bsky.graph.defs";
  static def = "listViewBasic";
  static kind = "object";
  $type;
  uri;
  cid;
  name;
  purpose;
  avatar;
  listItemCount;
  labels;
  viewer;
  indexedAt;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.graph.defs#listViewBasic";
  }
  check() {
    const issues = [];
    if (this["uri"] == null) issues.push({ path: "uri", message: "Required." });
    if (this["cid"] == null) issues.push({ path: "cid", message: "Required." });
    if (this["name"] == null) issues.push({ path: "name", message: "Required." });
    if (typeof this["name"] === "string" && this["name"].length > 64) issues.push({ path: "name", message: "Must be at most 64 characters." });
    if (this["purpose"] == null) issues.push({ path: "purpose", message: "Required." });
    if (this["listItemCount"] != null) {
      if (!Number.isInteger(this["listItemCount"])) issues.push({ path: "listItemCount", message: "Must be an integer." });
      else if (this["listItemCount"] < 0) issues.push({ path: "listItemCount", message: "Must be at least 0." });
    }
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      uri: this["uri"],
      cid: this["cid"],
      name: this["name"],
      purpose: this["purpose"],
      avatar: this["avatar"],
      listItemCount: this["listItemCount"],
      labels: this["labels"],
      viewer: this["viewer"],
      indexedAt: this["indexedAt"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyGraphDefsListViewBasic(value);
    record.check();
    return record;
  }
};
var AppBskyGraphDefsListViewerState = class _AppBskyGraphDefsListViewerState {
  static nsid = "app.bsky.graph.defs";
  static def = "listViewerState";
  static kind = "object";
  $type;
  muted;
  blocked;
  referenceListOptOut;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.graph.defs#listViewerState";
  }
  check() {
    const issues = [];
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      muted: this["muted"],
      blocked: this["blocked"],
      referenceListOptOut: this["referenceListOptOut"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyGraphDefsListViewerState(value);
    record.check();
    return record;
  }
};
var AppBskyGraphDefsModlist = class {
  static nsid = "app.bsky.graph.defs";
  static def = "modlist";
  static kind = "token";
  static value = "app.bsky.graph.defs#modlist";
  static description = "A list of actors to apply an aggregate moderation action (mute/block) on.";
  constructor() {
  }
};
var AppBskyGraphDefsNotFoundActor = class _AppBskyGraphDefsNotFoundActor {
  static nsid = "app.bsky.graph.defs";
  static def = "notFoundActor";
  static kind = "object";
  $type;
  actor;
  notFound;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.graph.defs#notFoundActor";
  }
  check() {
    const issues = [];
    if (this["actor"] == null) issues.push({ path: "actor", message: "Required." });
    if (this["notFound"] == null) issues.push({ path: "notFound", message: "Required." });
    if (this["notFound"] != null && this["notFound"] !== true) issues.push({ path: "notFound", message: "Must be true." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      actor: this["actor"],
      notFound: this["notFound"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyGraphDefsNotFoundActor(value);
    record.check();
    return record;
  }
};
var AppBskyGraphDefsReferencelist = class {
  static nsid = "app.bsky.graph.defs";
  static def = "referencelist";
  static kind = "token";
  static value = "app.bsky.graph.defs#referencelist";
  static description = "A list of actors used for only for reference purposes such as within a starter pack.";
  constructor() {
  }
};
var AppBskyGraphDefsRelationship = class _AppBskyGraphDefsRelationship {
  static nsid = "app.bsky.graph.defs";
  static def = "relationship";
  static kind = "object";
  $type;
  did;
  following;
  followedBy;
  blocking;
  blockedBy;
  blockingByList;
  blockedByList;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.graph.defs#relationship";
  }
  check() {
    const issues = [];
    if (this["did"] == null) issues.push({ path: "did", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      did: this["did"],
      following: this["following"],
      followedBy: this["followedBy"],
      blocking: this["blocking"],
      blockedBy: this["blockedBy"],
      blockingByList: this["blockingByList"],
      blockedByList: this["blockedByList"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyGraphDefsRelationship(value);
    record.check();
    return record;
  }
};
var AppBskyGraphDefsStarterPackView = class _AppBskyGraphDefsStarterPackView {
  static nsid = "app.bsky.graph.defs";
  static def = "starterPackView";
  static kind = "object";
  $type;
  uri;
  cid;
  record;
  creator;
  list;
  listItemsSample;
  feeds;
  joinedWeekCount;
  joinedAllTimeCount;
  labels;
  indexedAt;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.graph.defs#starterPackView";
  }
  check() {
    const issues = [];
    if (this["uri"] == null) issues.push({ path: "uri", message: "Required." });
    if (this["cid"] == null) issues.push({ path: "cid", message: "Required." });
    if (this["record"] == null) issues.push({ path: "record", message: "Required." });
    if (this["creator"] == null) issues.push({ path: "creator", message: "Required." });
    if (this["joinedWeekCount"] != null) {
      if (!Number.isInteger(this["joinedWeekCount"])) issues.push({ path: "joinedWeekCount", message: "Must be an integer." });
      else if (this["joinedWeekCount"] < 0) issues.push({ path: "joinedWeekCount", message: "Must be at least 0." });
    }
    if (this["joinedAllTimeCount"] != null) {
      if (!Number.isInteger(this["joinedAllTimeCount"])) issues.push({ path: "joinedAllTimeCount", message: "Must be an integer." });
      else if (this["joinedAllTimeCount"] < 0) issues.push({ path: "joinedAllTimeCount", message: "Must be at least 0." });
    }
    if (this["indexedAt"] == null) issues.push({ path: "indexedAt", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      uri: this["uri"],
      cid: this["cid"],
      record: this["record"],
      creator: this["creator"],
      list: this["list"],
      listItemsSample: this["listItemsSample"],
      feeds: this["feeds"],
      joinedWeekCount: this["joinedWeekCount"],
      joinedAllTimeCount: this["joinedAllTimeCount"],
      labels: this["labels"],
      indexedAt: this["indexedAt"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyGraphDefsStarterPackView(value);
    record.check();
    return record;
  }
};
var AppBskyGraphDefsStarterPackViewBasic = class _AppBskyGraphDefsStarterPackViewBasic {
  static nsid = "app.bsky.graph.defs";
  static def = "starterPackViewBasic";
  static kind = "object";
  $type;
  uri;
  cid;
  record;
  creator;
  listItemCount;
  joinedWeekCount;
  joinedAllTimeCount;
  labels;
  indexedAt;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.graph.defs#starterPackViewBasic";
  }
  check() {
    const issues = [];
    if (this["uri"] == null) issues.push({ path: "uri", message: "Required." });
    if (this["cid"] == null) issues.push({ path: "cid", message: "Required." });
    if (this["record"] == null) issues.push({ path: "record", message: "Required." });
    if (this["creator"] == null) issues.push({ path: "creator", message: "Required." });
    if (this["listItemCount"] != null) {
      if (!Number.isInteger(this["listItemCount"])) issues.push({ path: "listItemCount", message: "Must be an integer." });
      else if (this["listItemCount"] < 0) issues.push({ path: "listItemCount", message: "Must be at least 0." });
    }
    if (this["joinedWeekCount"] != null) {
      if (!Number.isInteger(this["joinedWeekCount"])) issues.push({ path: "joinedWeekCount", message: "Must be an integer." });
      else if (this["joinedWeekCount"] < 0) issues.push({ path: "joinedWeekCount", message: "Must be at least 0." });
    }
    if (this["joinedAllTimeCount"] != null) {
      if (!Number.isInteger(this["joinedAllTimeCount"])) issues.push({ path: "joinedAllTimeCount", message: "Must be an integer." });
      else if (this["joinedAllTimeCount"] < 0) issues.push({ path: "joinedAllTimeCount", message: "Must be at least 0." });
    }
    if (this["indexedAt"] == null) issues.push({ path: "indexedAt", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      uri: this["uri"],
      cid: this["cid"],
      record: this["record"],
      creator: this["creator"],
      listItemCount: this["listItemCount"],
      joinedWeekCount: this["joinedWeekCount"],
      joinedAllTimeCount: this["joinedAllTimeCount"],
      labels: this["labels"],
      indexedAt: this["indexedAt"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyGraphDefsStarterPackViewBasic(value);
    record.check();
    return record;
  }
};
var AppBskyGraphFollow = class _AppBskyGraphFollow {
  static nsid = "app.bsky.graph.follow";
  static def = "main";
  static kind = "record";
  static recordKey = "tid";
  $type;
  subject;
  createdAt;
  via;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.graph.follow";
  }
  check() {
    const issues = [];
    if (this["subject"] == null) issues.push({ path: "subject", message: "Required." });
    if (this["createdAt"] == null) issues.push({ path: "createdAt", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      subject: this["subject"],
      createdAt: this["createdAt"],
      via: this["via"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyGraphFollow(value);
    record.check();
    return record;
  }
};
var AppBskyGraphGetActorStarterPacks = class _AppBskyGraphGetActorStarterPacks {
  static nsid = "app.bsky.graph.getActorStarterPacks";
  static def = "main";
  static kind = "query";
  static http = "GET";
  static errorNames = [];
  actor;
  limit;
  cursor;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({
      actor: this["actor"],
      limit: this["limit"],
      cursor: this["cursor"]
    });
  }
  check() {
    const issues = [];
    if (this["actor"] == null) issues.push({ path: "actor", message: "Required." });
    if (this["limit"] != null) {
      if (!Number.isInteger(this["limit"])) issues.push({ path: "limit", message: "Must be an integer." });
      else if (this["limit"] < 1) issues.push({ path: "limit", message: "Must be at least 1." });
      else if (this["limit"] > 100) issues.push({ path: "limit", message: "Must be at most 100." });
    }
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _AppBskyGraphGetActorStarterPacks.nsid,
      method: "GET",
      params: this.toParams(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyGraphGetActorStarterPacks(value);
    record.check();
    return record;
  }
};
var AppBskyGraphGetBlocks = class _AppBskyGraphGetBlocks {
  static nsid = "app.bsky.graph.getBlocks";
  static def = "main";
  static kind = "query";
  static http = "GET";
  static errorNames = [];
  limit;
  cursor;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({
      limit: this["limit"],
      cursor: this["cursor"]
    });
  }
  check() {
    const issues = [];
    if (this["limit"] != null) {
      if (!Number.isInteger(this["limit"])) issues.push({ path: "limit", message: "Must be an integer." });
      else if (this["limit"] < 1) issues.push({ path: "limit", message: "Must be at least 1." });
      else if (this["limit"] > 100) issues.push({ path: "limit", message: "Must be at most 100." });
    }
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _AppBskyGraphGetBlocks.nsid,
      method: "GET",
      params: this.toParams(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyGraphGetBlocks(value);
    record.check();
    return record;
  }
};
var AppBskyGraphGetKnownFollowers = class _AppBskyGraphGetKnownFollowers {
  static nsid = "app.bsky.graph.getKnownFollowers";
  static def = "main";
  static kind = "query";
  static http = "GET";
  static errorNames = [];
  actor;
  limit;
  cursor;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({
      actor: this["actor"],
      limit: this["limit"],
      cursor: this["cursor"]
    });
  }
  check() {
    const issues = [];
    if (this["actor"] == null) issues.push({ path: "actor", message: "Required." });
    if (this["limit"] != null) {
      if (!Number.isInteger(this["limit"])) issues.push({ path: "limit", message: "Must be an integer." });
      else if (this["limit"] < 1) issues.push({ path: "limit", message: "Must be at least 1." });
      else if (this["limit"] > 100) issues.push({ path: "limit", message: "Must be at most 100." });
    }
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _AppBskyGraphGetKnownFollowers.nsid,
      method: "GET",
      params: this.toParams(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyGraphGetKnownFollowers(value);
    record.check();
    return record;
  }
};
var AppBskyGraphGetList = class _AppBskyGraphGetList {
  static nsid = "app.bsky.graph.getList";
  static def = "main";
  static kind = "query";
  static http = "GET";
  static errorNames = [];
  list;
  limit;
  cursor;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({
      list: this["list"],
      limit: this["limit"],
      cursor: this["cursor"]
    });
  }
  check() {
    const issues = [];
    if (this["list"] == null) issues.push({ path: "list", message: "Required." });
    if (this["limit"] != null) {
      if (!Number.isInteger(this["limit"])) issues.push({ path: "limit", message: "Must be an integer." });
      else if (this["limit"] < 1) issues.push({ path: "limit", message: "Must be at least 1." });
      else if (this["limit"] > 100) issues.push({ path: "limit", message: "Must be at most 100." });
    }
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _AppBskyGraphGetList.nsid,
      method: "GET",
      params: this.toParams(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyGraphGetList(value);
    record.check();
    return record;
  }
};
var AppBskyGraphGetListBlocks = class _AppBskyGraphGetListBlocks {
  static nsid = "app.bsky.graph.getListBlocks";
  static def = "main";
  static kind = "query";
  static http = "GET";
  static errorNames = [];
  limit;
  cursor;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({
      limit: this["limit"],
      cursor: this["cursor"]
    });
  }
  check() {
    const issues = [];
    if (this["limit"] != null) {
      if (!Number.isInteger(this["limit"])) issues.push({ path: "limit", message: "Must be an integer." });
      else if (this["limit"] < 1) issues.push({ path: "limit", message: "Must be at least 1." });
      else if (this["limit"] > 100) issues.push({ path: "limit", message: "Must be at most 100." });
    }
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _AppBskyGraphGetListBlocks.nsid,
      method: "GET",
      params: this.toParams(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyGraphGetListBlocks(value);
    record.check();
    return record;
  }
};
var AppBskyGraphGetListMutes = class _AppBskyGraphGetListMutes {
  static nsid = "app.bsky.graph.getListMutes";
  static def = "main";
  static kind = "query";
  static http = "GET";
  static errorNames = [];
  limit;
  cursor;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({
      limit: this["limit"],
      cursor: this["cursor"]
    });
  }
  check() {
    const issues = [];
    if (this["limit"] != null) {
      if (!Number.isInteger(this["limit"])) issues.push({ path: "limit", message: "Must be an integer." });
      else if (this["limit"] < 1) issues.push({ path: "limit", message: "Must be at least 1." });
      else if (this["limit"] > 100) issues.push({ path: "limit", message: "Must be at most 100." });
    }
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _AppBskyGraphGetListMutes.nsid,
      method: "GET",
      params: this.toParams(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyGraphGetListMutes(value);
    record.check();
    return record;
  }
};
var AppBskyGraphGetLists = class _AppBskyGraphGetLists {
  static nsid = "app.bsky.graph.getLists";
  static def = "main";
  static kind = "query";
  static http = "GET";
  static errorNames = [];
  actor;
  limit;
  cursor;
  purposes;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({
      actor: this["actor"],
      limit: this["limit"],
      cursor: this["cursor"],
      purposes: this["purposes"]
    });
  }
  check() {
    const issues = [];
    if (this["actor"] == null) issues.push({ path: "actor", message: "Required." });
    if (this["limit"] != null) {
      if (!Number.isInteger(this["limit"])) issues.push({ path: "limit", message: "Must be an integer." });
      else if (this["limit"] < 1) issues.push({ path: "limit", message: "Must be at least 1." });
      else if (this["limit"] > 100) issues.push({ path: "limit", message: "Must be at most 100." });
    }
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _AppBskyGraphGetLists.nsid,
      method: "GET",
      params: this.toParams(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyGraphGetLists(value);
    record.check();
    return record;
  }
};
var AppBskyGraphGetListsWithMembership = class _AppBskyGraphGetListsWithMembership {
  static nsid = "app.bsky.graph.getListsWithMembership";
  static def = "main";
  static kind = "query";
  static http = "GET";
  static errorNames = [];
  actor;
  limit;
  cursor;
  purposes;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({
      actor: this["actor"],
      limit: this["limit"],
      cursor: this["cursor"],
      purposes: this["purposes"]
    });
  }
  check() {
    const issues = [];
    if (this["actor"] == null) issues.push({ path: "actor", message: "Required." });
    if (this["limit"] != null) {
      if (!Number.isInteger(this["limit"])) issues.push({ path: "limit", message: "Must be an integer." });
      else if (this["limit"] < 1) issues.push({ path: "limit", message: "Must be at least 1." });
      else if (this["limit"] > 100) issues.push({ path: "limit", message: "Must be at most 100." });
    }
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _AppBskyGraphGetListsWithMembership.nsid,
      method: "GET",
      params: this.toParams(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyGraphGetListsWithMembership(value);
    record.check();
    return record;
  }
};
var AppBskyGraphGetListsWithMembershipListWithMembership = class _AppBskyGraphGetListsWithMembershipListWithMembership {
  static nsid = "app.bsky.graph.getListsWithMembership";
  static def = "listWithMembership";
  static kind = "object";
  $type;
  list;
  listItem;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.graph.getListsWithMembership#listWithMembership";
  }
  check() {
    const issues = [];
    if (this["list"] == null) issues.push({ path: "list", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      list: this["list"],
      listItem: this["listItem"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyGraphGetListsWithMembershipListWithMembership(value);
    record.check();
    return record;
  }
};
var AppBskyGraphGetMutes = class _AppBskyGraphGetMutes {
  static nsid = "app.bsky.graph.getMutes";
  static def = "main";
  static kind = "query";
  static http = "GET";
  static errorNames = [];
  limit;
  cursor;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({
      limit: this["limit"],
      cursor: this["cursor"]
    });
  }
  check() {
    const issues = [];
    if (this["limit"] != null) {
      if (!Number.isInteger(this["limit"])) issues.push({ path: "limit", message: "Must be an integer." });
      else if (this["limit"] < 1) issues.push({ path: "limit", message: "Must be at least 1." });
      else if (this["limit"] > 100) issues.push({ path: "limit", message: "Must be at most 100." });
    }
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _AppBskyGraphGetMutes.nsid,
      method: "GET",
      params: this.toParams(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyGraphGetMutes(value);
    record.check();
    return record;
  }
};
var AppBskyGraphGetRelationships = class _AppBskyGraphGetRelationships {
  static nsid = "app.bsky.graph.getRelationships";
  static def = "main";
  static kind = "query";
  static http = "GET";
  static errorNames = ["ActorNotFound"];
  actor;
  others;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({
      actor: this["actor"],
      others: this["others"]
    });
  }
  check() {
    const issues = [];
    if (this["actor"] == null) issues.push({ path: "actor", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _AppBskyGraphGetRelationships.nsid,
      method: "GET",
      params: this.toParams(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyGraphGetRelationships(value);
    record.check();
    return record;
  }
};
var AppBskyGraphGetStarterPack = class _AppBskyGraphGetStarterPack {
  static nsid = "app.bsky.graph.getStarterPack";
  static def = "main";
  static kind = "query";
  static http = "GET";
  static errorNames = [];
  starterPack;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({
      starterPack: this["starterPack"]
    });
  }
  check() {
    const issues = [];
    if (this["starterPack"] == null) issues.push({ path: "starterPack", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _AppBskyGraphGetStarterPack.nsid,
      method: "GET",
      params: this.toParams(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyGraphGetStarterPack(value);
    record.check();
    return record;
  }
};
var AppBskyGraphGetStarterPacks = class _AppBskyGraphGetStarterPacks {
  static nsid = "app.bsky.graph.getStarterPacks";
  static def = "main";
  static kind = "query";
  static http = "GET";
  static errorNames = [];
  uris;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({
      uris: this["uris"]
    });
  }
  check() {
    const issues = [];
    if (this["uris"] == null) issues.push({ path: "uris", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _AppBskyGraphGetStarterPacks.nsid,
      method: "GET",
      params: this.toParams(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyGraphGetStarterPacks(value);
    record.check();
    return record;
  }
};
var AppBskyGraphGetStarterPacksWithMembership = class _AppBskyGraphGetStarterPacksWithMembership {
  static nsid = "app.bsky.graph.getStarterPacksWithMembership";
  static def = "main";
  static kind = "query";
  static http = "GET";
  static errorNames = [];
  actor;
  limit;
  cursor;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({
      actor: this["actor"],
      limit: this["limit"],
      cursor: this["cursor"]
    });
  }
  check() {
    const issues = [];
    if (this["actor"] == null) issues.push({ path: "actor", message: "Required." });
    if (this["limit"] != null) {
      if (!Number.isInteger(this["limit"])) issues.push({ path: "limit", message: "Must be an integer." });
      else if (this["limit"] < 1) issues.push({ path: "limit", message: "Must be at least 1." });
      else if (this["limit"] > 100) issues.push({ path: "limit", message: "Must be at most 100." });
    }
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _AppBskyGraphGetStarterPacksWithMembership.nsid,
      method: "GET",
      params: this.toParams(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyGraphGetStarterPacksWithMembership(value);
    record.check();
    return record;
  }
};
var AppBskyGraphGetStarterPacksWithMembershipStarterPackWithMembership = class _AppBskyGraphGetStarterPacksWithMembershipStarterPackWithMembership {
  static nsid = "app.bsky.graph.getStarterPacksWithMembership";
  static def = "starterPackWithMembership";
  static kind = "object";
  $type;
  starterPack;
  listItem;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.graph.getStarterPacksWithMembership#starterPackWithMembership";
  }
  check() {
    const issues = [];
    if (this["starterPack"] == null) issues.push({ path: "starterPack", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      starterPack: this["starterPack"],
      listItem: this["listItem"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyGraphGetStarterPacksWithMembershipStarterPackWithMembership(value);
    record.check();
    return record;
  }
};
var AppBskyGraphGetSuggestedFollowsByActor = class _AppBskyGraphGetSuggestedFollowsByActor {
  static nsid = "app.bsky.graph.getSuggestedFollowsByActor";
  static def = "main";
  static kind = "query";
  static http = "GET";
  static errorNames = [];
  actor;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({
      actor: this["actor"]
    });
  }
  check() {
    const issues = [];
    if (this["actor"] == null) issues.push({ path: "actor", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _AppBskyGraphGetSuggestedFollowsByActor.nsid,
      method: "GET",
      params: this.toParams(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyGraphGetSuggestedFollowsByActor(value);
    record.check();
    return record;
  }
};
var AppBskyGraphList = class _AppBskyGraphList {
  static nsid = "app.bsky.graph.list";
  static def = "main";
  static kind = "record";
  static recordKey = "tid";
  $type;
  purpose;
  name;
  description;
  descriptionFacets;
  avatar;
  labels;
  createdAt;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.graph.list";
  }
  check() {
    const issues = [];
    if (this["purpose"] == null) issues.push({ path: "purpose", message: "Required." });
    if (this["name"] == null) issues.push({ path: "name", message: "Required." });
    if (typeof this["name"] === "string" && this["name"].length > 64) issues.push({ path: "name", message: "Must be at most 64 characters." });
    if (typeof this["description"] === "string" && this["description"].length > 3e3) issues.push({ path: "description", message: "Must be at most 3000 characters." });
    if (this["createdAt"] == null) issues.push({ path: "createdAt", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      purpose: this["purpose"],
      name: this["name"],
      description: this["description"],
      descriptionFacets: this["descriptionFacets"],
      avatar: this["avatar"],
      labels: this["labels"],
      createdAt: this["createdAt"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyGraphList(value);
    record.check();
    return record;
  }
};
var AppBskyGraphListblock = class _AppBskyGraphListblock {
  static nsid = "app.bsky.graph.listblock";
  static def = "main";
  static kind = "record";
  static recordKey = "tid";
  $type;
  subject;
  createdAt;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.graph.listblock";
  }
  check() {
    const issues = [];
    if (this["subject"] == null) issues.push({ path: "subject", message: "Required." });
    if (this["createdAt"] == null) issues.push({ path: "createdAt", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      subject: this["subject"],
      createdAt: this["createdAt"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyGraphListblock(value);
    record.check();
    return record;
  }
};
var AppBskyGraphListitem = class _AppBskyGraphListitem {
  static nsid = "app.bsky.graph.listitem";
  static def = "main";
  static kind = "record";
  static recordKey = "tid";
  $type;
  subject;
  list;
  createdAt;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.graph.listitem";
  }
  check() {
    const issues = [];
    if (this["subject"] == null) issues.push({ path: "subject", message: "Required." });
    if (this["list"] == null) issues.push({ path: "list", message: "Required." });
    if (this["createdAt"] == null) issues.push({ path: "createdAt", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      subject: this["subject"],
      list: this["list"],
      createdAt: this["createdAt"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyGraphListitem(value);
    record.check();
    return record;
  }
};
var AppBskyGraphMuteActor = class _AppBskyGraphMuteActor {
  static nsid = "app.bsky.graph.muteActor";
  static def = "main";
  static kind = "procedure";
  static http = "POST";
  static errorNames = [];
  actor;
  onlyReposts;
  onlyQuoteposts;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({});
  }
  toBody() {
    return jsonOf({
      actor: this["actor"],
      onlyReposts: this["onlyReposts"],
      onlyQuoteposts: this["onlyQuoteposts"]
    });
  }
  check() {
    const issues = [];
    if (this["actor"] == null) issues.push({ path: "actor", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _AppBskyGraphMuteActor.nsid,
      method: "POST",
      params: this.toParams(),
      body: this.toBody(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyGraphMuteActor(value);
    record.check();
    return record;
  }
};
var AppBskyGraphMuteActorList = class _AppBskyGraphMuteActorList {
  static nsid = "app.bsky.graph.muteActorList";
  static def = "main";
  static kind = "procedure";
  static http = "POST";
  static errorNames = [];
  list;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({});
  }
  toBody() {
    return jsonOf({
      list: this["list"]
    });
  }
  check() {
    const issues = [];
    if (this["list"] == null) issues.push({ path: "list", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _AppBskyGraphMuteActorList.nsid,
      method: "POST",
      params: this.toParams(),
      body: this.toBody(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyGraphMuteActorList(value);
    record.check();
    return record;
  }
};
var AppBskyGraphMuteThread = class _AppBskyGraphMuteThread {
  static nsid = "app.bsky.graph.muteThread";
  static def = "main";
  static kind = "procedure";
  static http = "POST";
  static errorNames = [];
  root;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({});
  }
  toBody() {
    return jsonOf({
      root: this["root"]
    });
  }
  check() {
    const issues = [];
    if (this["root"] == null) issues.push({ path: "root", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _AppBskyGraphMuteThread.nsid,
      method: "POST",
      params: this.toParams(),
      body: this.toBody(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyGraphMuteThread(value);
    record.check();
    return record;
  }
};
var AppBskyGraphReferencelistoptout = class _AppBskyGraphReferencelistoptout {
  static nsid = "app.bsky.graph.referencelistoptout";
  static def = "main";
  static kind = "record";
  static recordKey = "tid";
  $type;
  subject;
  createdAt;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.graph.referencelistoptout";
  }
  check() {
    const issues = [];
    if (this["subject"] == null) issues.push({ path: "subject", message: "Required." });
    if (this["createdAt"] == null) issues.push({ path: "createdAt", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      subject: this["subject"],
      createdAt: this["createdAt"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyGraphReferencelistoptout(value);
    record.check();
    return record;
  }
};
var AppBskyGraphSearchStarterPacks = class _AppBskyGraphSearchStarterPacks {
  static nsid = "app.bsky.graph.searchStarterPacks";
  static def = "main";
  static kind = "query";
  static http = "GET";
  static errorNames = [];
  q;
  limit;
  cursor;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({
      q: this["q"],
      limit: this["limit"],
      cursor: this["cursor"]
    });
  }
  check() {
    const issues = [];
    if (this["q"] == null) issues.push({ path: "q", message: "Required." });
    if (this["limit"] != null) {
      if (!Number.isInteger(this["limit"])) issues.push({ path: "limit", message: "Must be an integer." });
      else if (this["limit"] < 1) issues.push({ path: "limit", message: "Must be at least 1." });
      else if (this["limit"] > 100) issues.push({ path: "limit", message: "Must be at most 100." });
    }
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _AppBskyGraphSearchStarterPacks.nsid,
      method: "GET",
      params: this.toParams(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyGraphSearchStarterPacks(value);
    record.check();
    return record;
  }
};
var AppBskyGraphSearchStarterPacksV2 = class _AppBskyGraphSearchStarterPacksV2 {
  static nsid = "app.bsky.graph.searchStarterPacksV2";
  static def = "main";
  static kind = "query";
  static http = "GET";
  static errorNames = [];
  q;
  limit;
  cursor;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({
      q: this["q"],
      limit: this["limit"],
      cursor: this["cursor"]
    });
  }
  check() {
    const issues = [];
    if (this["q"] == null) issues.push({ path: "q", message: "Required." });
    if (this["limit"] != null) {
      if (!Number.isInteger(this["limit"])) issues.push({ path: "limit", message: "Must be an integer." });
      else if (this["limit"] < 1) issues.push({ path: "limit", message: "Must be at least 1." });
      else if (this["limit"] > 100) issues.push({ path: "limit", message: "Must be at most 100." });
    }
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _AppBskyGraphSearchStarterPacksV2.nsid,
      method: "GET",
      params: this.toParams(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyGraphSearchStarterPacksV2(value);
    record.check();
    return record;
  }
};
var AppBskyGraphStarterpack = class _AppBskyGraphStarterpack {
  static nsid = "app.bsky.graph.starterpack";
  static def = "main";
  static kind = "record";
  static recordKey = "tid";
  $type;
  name;
  description;
  descriptionFacets;
  list;
  feeds;
  createdAt;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.graph.starterpack";
  }
  check() {
    const issues = [];
    if (this["name"] == null) issues.push({ path: "name", message: "Required." });
    if (typeof this["name"] === "string" && this["name"].length > 500) issues.push({ path: "name", message: "Must be at most 500 characters." });
    if (typeof this["description"] === "string" && this["description"].length > 3e3) issues.push({ path: "description", message: "Must be at most 3000 characters." });
    if (this["list"] == null) issues.push({ path: "list", message: "Required." });
    if (this["createdAt"] == null) issues.push({ path: "createdAt", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      name: this["name"],
      description: this["description"],
      descriptionFacets: this["descriptionFacets"],
      list: this["list"],
      feeds: this["feeds"],
      createdAt: this["createdAt"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyGraphStarterpack(value);
    record.check();
    return record;
  }
};
var AppBskyGraphStarterpackFeedItem = class _AppBskyGraphStarterpackFeedItem {
  static nsid = "app.bsky.graph.starterpack";
  static def = "feedItem";
  static kind = "object";
  $type;
  uri;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.graph.starterpack#feedItem";
  }
  check() {
    const issues = [];
    if (this["uri"] == null) issues.push({ path: "uri", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      uri: this["uri"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyGraphStarterpackFeedItem(value);
    record.check();
    return record;
  }
};
var AppBskyGraphUnmuteActor = class _AppBskyGraphUnmuteActor {
  static nsid = "app.bsky.graph.unmuteActor";
  static def = "main";
  static kind = "procedure";
  static http = "POST";
  static errorNames = [];
  actor;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({});
  }
  toBody() {
    return jsonOf({
      actor: this["actor"]
    });
  }
  check() {
    const issues = [];
    if (this["actor"] == null) issues.push({ path: "actor", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _AppBskyGraphUnmuteActor.nsid,
      method: "POST",
      params: this.toParams(),
      body: this.toBody(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyGraphUnmuteActor(value);
    record.check();
    return record;
  }
};
var AppBskyGraphUnmuteActorList = class _AppBskyGraphUnmuteActorList {
  static nsid = "app.bsky.graph.unmuteActorList";
  static def = "main";
  static kind = "procedure";
  static http = "POST";
  static errorNames = [];
  list;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({});
  }
  toBody() {
    return jsonOf({
      list: this["list"]
    });
  }
  check() {
    const issues = [];
    if (this["list"] == null) issues.push({ path: "list", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _AppBskyGraphUnmuteActorList.nsid,
      method: "POST",
      params: this.toParams(),
      body: this.toBody(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyGraphUnmuteActorList(value);
    record.check();
    return record;
  }
};
var AppBskyGraphUnmuteThread = class _AppBskyGraphUnmuteThread {
  static nsid = "app.bsky.graph.unmuteThread";
  static def = "main";
  static kind = "procedure";
  static http = "POST";
  static errorNames = [];
  root;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({});
  }
  toBody() {
    return jsonOf({
      root: this["root"]
    });
  }
  check() {
    const issues = [];
    if (this["root"] == null) issues.push({ path: "root", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _AppBskyGraphUnmuteThread.nsid,
      method: "POST",
      params: this.toParams(),
      body: this.toBody(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyGraphUnmuteThread(value);
    record.check();
    return record;
  }
};
var AppBskyGraphVerification = class _AppBskyGraphVerification {
  static nsid = "app.bsky.graph.verification";
  static def = "main";
  static kind = "record";
  static recordKey = "tid";
  $type;
  subject;
  handle;
  displayName;
  createdAt;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.graph.verification";
  }
  check() {
    const issues = [];
    if (this["subject"] == null) issues.push({ path: "subject", message: "Required." });
    if (this["handle"] == null) issues.push({ path: "handle", message: "Required." });
    if (this["displayName"] == null) issues.push({ path: "displayName", message: "Required." });
    if (this["createdAt"] == null) issues.push({ path: "createdAt", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      subject: this["subject"],
      handle: this["handle"],
      displayName: this["displayName"],
      createdAt: this["createdAt"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyGraphVerification(value);
    record.check();
    return record;
  }
};
var AppBskyLabelerDefsLabelerPolicies = class _AppBskyLabelerDefsLabelerPolicies {
  static nsid = "app.bsky.labeler.defs";
  static def = "labelerPolicies";
  static kind = "object";
  $type;
  labelValues;
  labelValueDefinitions;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.labeler.defs#labelerPolicies";
  }
  check() {
    const issues = [];
    if (this["labelValues"] == null) issues.push({ path: "labelValues", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      labelValues: this["labelValues"],
      labelValueDefinitions: this["labelValueDefinitions"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyLabelerDefsLabelerPolicies(value);
    record.check();
    return record;
  }
};
var AppBskyLabelerDefsLabelerView = class _AppBskyLabelerDefsLabelerView {
  static nsid = "app.bsky.labeler.defs";
  static def = "labelerView";
  static kind = "object";
  $type;
  uri;
  cid;
  creator;
  likeCount;
  viewer;
  indexedAt;
  labels;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.labeler.defs#labelerView";
  }
  check() {
    const issues = [];
    if (this["uri"] == null) issues.push({ path: "uri", message: "Required." });
    if (this["cid"] == null) issues.push({ path: "cid", message: "Required." });
    if (this["creator"] == null) issues.push({ path: "creator", message: "Required." });
    if (this["likeCount"] != null) {
      if (!Number.isInteger(this["likeCount"])) issues.push({ path: "likeCount", message: "Must be an integer." });
      else if (this["likeCount"] < 0) issues.push({ path: "likeCount", message: "Must be at least 0." });
    }
    if (this["indexedAt"] == null) issues.push({ path: "indexedAt", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      uri: this["uri"],
      cid: this["cid"],
      creator: this["creator"],
      likeCount: this["likeCount"],
      viewer: this["viewer"],
      indexedAt: this["indexedAt"],
      labels: this["labels"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyLabelerDefsLabelerView(value);
    record.check();
    return record;
  }
};
var AppBskyLabelerDefsLabelerViewDetailed = class _AppBskyLabelerDefsLabelerViewDetailed {
  static nsid = "app.bsky.labeler.defs";
  static def = "labelerViewDetailed";
  static kind = "object";
  $type;
  uri;
  cid;
  creator;
  policies;
  likeCount;
  viewer;
  indexedAt;
  labels;
  reasonTypes;
  subjectTypes;
  subjectCollections;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.labeler.defs#labelerViewDetailed";
  }
  check() {
    const issues = [];
    if (this["uri"] == null) issues.push({ path: "uri", message: "Required." });
    if (this["cid"] == null) issues.push({ path: "cid", message: "Required." });
    if (this["creator"] == null) issues.push({ path: "creator", message: "Required." });
    if (this["policies"] == null) issues.push({ path: "policies", message: "Required." });
    if (this["likeCount"] != null) {
      if (!Number.isInteger(this["likeCount"])) issues.push({ path: "likeCount", message: "Must be an integer." });
      else if (this["likeCount"] < 0) issues.push({ path: "likeCount", message: "Must be at least 0." });
    }
    if (this["indexedAt"] == null) issues.push({ path: "indexedAt", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      uri: this["uri"],
      cid: this["cid"],
      creator: this["creator"],
      policies: this["policies"],
      likeCount: this["likeCount"],
      viewer: this["viewer"],
      indexedAt: this["indexedAt"],
      labels: this["labels"],
      reasonTypes: this["reasonTypes"],
      subjectTypes: this["subjectTypes"],
      subjectCollections: this["subjectCollections"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyLabelerDefsLabelerViewDetailed(value);
    record.check();
    return record;
  }
};
var AppBskyLabelerDefsLabelerViewerState = class _AppBskyLabelerDefsLabelerViewerState {
  static nsid = "app.bsky.labeler.defs";
  static def = "labelerViewerState";
  static kind = "object";
  $type;
  like;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.labeler.defs#labelerViewerState";
  }
  check() {
    const issues = [];
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      like: this["like"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyLabelerDefsLabelerViewerState(value);
    record.check();
    return record;
  }
};
var AppBskyLabelerGetServices = class _AppBskyLabelerGetServices {
  static nsid = "app.bsky.labeler.getServices";
  static def = "main";
  static kind = "query";
  static http = "GET";
  static errorNames = [];
  dids;
  detailed;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({
      dids: this["dids"],
      detailed: this["detailed"]
    });
  }
  check() {
    const issues = [];
    if (this["dids"] == null) issues.push({ path: "dids", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _AppBskyLabelerGetServices.nsid,
      method: "GET",
      params: this.toParams(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyLabelerGetServices(value);
    record.check();
    return record;
  }
};
var AppBskyLabelerService = class _AppBskyLabelerService {
  static nsid = "app.bsky.labeler.service";
  static def = "main";
  static kind = "record";
  static recordKey = "literal:self";
  $type;
  policies;
  labels;
  createdAt;
  reasonTypes;
  subjectTypes;
  subjectCollections;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.labeler.service";
  }
  check() {
    const issues = [];
    if (this["policies"] == null) issues.push({ path: "policies", message: "Required." });
    if (this["createdAt"] == null) issues.push({ path: "createdAt", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      policies: this["policies"],
      labels: this["labels"],
      createdAt: this["createdAt"],
      reasonTypes: this["reasonTypes"],
      subjectTypes: this["subjectTypes"],
      subjectCollections: this["subjectCollections"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyLabelerService(value);
    record.check();
    return record;
  }
};
var AppBskyNotificationDeclaration = class _AppBskyNotificationDeclaration {
  static nsid = "app.bsky.notification.declaration";
  static def = "main";
  static kind = "record";
  static recordKey = "literal:self";
  $type;
  allowSubscriptions;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.notification.declaration";
  }
  check() {
    const issues = [];
    if (this["allowSubscriptions"] == null) issues.push({ path: "allowSubscriptions", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      allowSubscriptions: this["allowSubscriptions"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyNotificationDeclaration(value);
    record.check();
    return record;
  }
};
var AppBskyNotificationDefsActivitySubscription = class _AppBskyNotificationDefsActivitySubscription {
  static nsid = "app.bsky.notification.defs";
  static def = "activitySubscription";
  static kind = "object";
  $type;
  post;
  reply;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.notification.defs#activitySubscription";
  }
  check() {
    const issues = [];
    if (this["post"] == null) issues.push({ path: "post", message: "Required." });
    if (this["reply"] == null) issues.push({ path: "reply", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      post: this["post"],
      reply: this["reply"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyNotificationDefsActivitySubscription(value);
    record.check();
    return record;
  }
};
var AppBskyNotificationDefsChatPreference = class _AppBskyNotificationDefsChatPreference {
  static nsid = "app.bsky.notification.defs";
  static def = "chatPreference";
  static kind = "object";
  $type;
  include;
  push;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.notification.defs#chatPreference";
  }
  check() {
    const issues = [];
    if (this["include"] == null) issues.push({ path: "include", message: "Required." });
    if (this["push"] == null) issues.push({ path: "push", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      include: this["include"],
      push: this["push"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyNotificationDefsChatPreference(value);
    record.check();
    return record;
  }
};
var AppBskyNotificationDefsFilterablePreference = class _AppBskyNotificationDefsFilterablePreference {
  static nsid = "app.bsky.notification.defs";
  static def = "filterablePreference";
  static kind = "object";
  $type;
  include;
  list;
  push;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.notification.defs#filterablePreference";
  }
  check() {
    const issues = [];
    if (this["include"] == null) issues.push({ path: "include", message: "Required." });
    if (this["list"] == null) issues.push({ path: "list", message: "Required." });
    if (this["push"] == null) issues.push({ path: "push", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      include: this["include"],
      list: this["list"],
      push: this["push"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyNotificationDefsFilterablePreference(value);
    record.check();
    return record;
  }
};
var AppBskyNotificationDefsPreference = class _AppBskyNotificationDefsPreference {
  static nsid = "app.bsky.notification.defs";
  static def = "preference";
  static kind = "object";
  $type;
  list;
  push;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.notification.defs#preference";
  }
  check() {
    const issues = [];
    if (this["list"] == null) issues.push({ path: "list", message: "Required." });
    if (this["push"] == null) issues.push({ path: "push", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      list: this["list"],
      push: this["push"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyNotificationDefsPreference(value);
    record.check();
    return record;
  }
};
var AppBskyNotificationDefsPreferences = class _AppBskyNotificationDefsPreferences {
  static nsid = "app.bsky.notification.defs";
  static def = "preferences";
  static kind = "object";
  $type;
  chat;
  follow;
  like;
  likeViaRepost;
  mention;
  quote;
  reply;
  repost;
  repostViaRepost;
  starterpackJoined;
  subscribedPost;
  unverified;
  verified;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.notification.defs#preferences";
  }
  check() {
    const issues = [];
    if (this["chat"] == null) issues.push({ path: "chat", message: "Required." });
    if (this["follow"] == null) issues.push({ path: "follow", message: "Required." });
    if (this["like"] == null) issues.push({ path: "like", message: "Required." });
    if (this["likeViaRepost"] == null) issues.push({ path: "likeViaRepost", message: "Required." });
    if (this["mention"] == null) issues.push({ path: "mention", message: "Required." });
    if (this["quote"] == null) issues.push({ path: "quote", message: "Required." });
    if (this["reply"] == null) issues.push({ path: "reply", message: "Required." });
    if (this["repost"] == null) issues.push({ path: "repost", message: "Required." });
    if (this["repostViaRepost"] == null) issues.push({ path: "repostViaRepost", message: "Required." });
    if (this["starterpackJoined"] == null) issues.push({ path: "starterpackJoined", message: "Required." });
    if (this["subscribedPost"] == null) issues.push({ path: "subscribedPost", message: "Required." });
    if (this["unverified"] == null) issues.push({ path: "unverified", message: "Required." });
    if (this["verified"] == null) issues.push({ path: "verified", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      chat: this["chat"],
      follow: this["follow"],
      like: this["like"],
      likeViaRepost: this["likeViaRepost"],
      mention: this["mention"],
      quote: this["quote"],
      reply: this["reply"],
      repost: this["repost"],
      repostViaRepost: this["repostViaRepost"],
      starterpackJoined: this["starterpackJoined"],
      subscribedPost: this["subscribedPost"],
      unverified: this["unverified"],
      verified: this["verified"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyNotificationDefsPreferences(value);
    record.check();
    return record;
  }
};
var AppBskyNotificationDefsRecordDeleted = class _AppBskyNotificationDefsRecordDeleted {
  static nsid = "app.bsky.notification.defs";
  static def = "recordDeleted";
  static kind = "object";
  $type;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.notification.defs#recordDeleted";
  }
  check() {
    const issues = [];
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyNotificationDefsRecordDeleted(value);
    record.check();
    return record;
  }
};
var AppBskyNotificationDefsSubjectActivitySubscription = class _AppBskyNotificationDefsSubjectActivitySubscription {
  static nsid = "app.bsky.notification.defs";
  static def = "subjectActivitySubscription";
  static kind = "object";
  $type;
  subject;
  activitySubscription;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.notification.defs#subjectActivitySubscription";
  }
  check() {
    const issues = [];
    if (this["subject"] == null) issues.push({ path: "subject", message: "Required." });
    if (this["activitySubscription"] == null) issues.push({ path: "activitySubscription", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      subject: this["subject"],
      activitySubscription: this["activitySubscription"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyNotificationDefsSubjectActivitySubscription(value);
    record.check();
    return record;
  }
};
var AppBskyNotificationGetGroupedNotifications = class _AppBskyNotificationGetGroupedNotifications {
  static nsid = "app.bsky.notification.getGroupedNotifications";
  static def = "main";
  static kind = "query";
  static http = "GET";
  static errorNames = [];
  feed;
  limit;
  cursor;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({
      feed: this["feed"],
      limit: this["limit"],
      cursor: this["cursor"]
    });
  }
  check() {
    const issues = [];
    if (typeof this["feed"] === "string" && this["feed"].length > 32) issues.push({ path: "feed", message: "Must be at most 32 characters." });
    if (this["limit"] != null) {
      if (!Number.isInteger(this["limit"])) issues.push({ path: "limit", message: "Must be an integer." });
      else if (this["limit"] < 1) issues.push({ path: "limit", message: "Must be at least 1." });
      else if (this["limit"] > 50) issues.push({ path: "limit", message: "Must be at most 50." });
    }
    if (typeof this["cursor"] === "string" && this["cursor"].length > 1024) issues.push({ path: "cursor", message: "Must be at most 1024 characters." });
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _AppBskyNotificationGetGroupedNotifications.nsid,
      method: "GET",
      params: this.toParams(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyNotificationGetGroupedNotifications(value);
    record.check();
    return record;
  }
};
var AppBskyNotificationGetGroupedNotificationsContactMatchNotification = class _AppBskyNotificationGetGroupedNotificationsContactMatchNotification {
  static nsid = "app.bsky.notification.getGroupedNotifications";
  static def = "contactMatchNotification";
  static kind = "object";
  $type;
  actor;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.notification.getGroupedNotifications#contactMatchNotification";
  }
  check() {
    const issues = [];
    if (this["actor"] == null) issues.push({ path: "actor", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      actor: this["actor"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyNotificationGetGroupedNotificationsContactMatchNotification(value);
    record.check();
    return record;
  }
};
var AppBskyNotificationGetGroupedNotificationsFollowBackNotification = class _AppBskyNotificationGetGroupedNotificationsFollowBackNotification {
  static nsid = "app.bsky.notification.getGroupedNotifications";
  static def = "followBackNotification";
  static kind = "object";
  $type;
  actor;
  starterPack;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.notification.getGroupedNotifications#followBackNotification";
  }
  check() {
    const issues = [];
    if (this["actor"] == null) issues.push({ path: "actor", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      actor: this["actor"],
      starterPack: this["starterPack"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyNotificationGetGroupedNotificationsFollowBackNotification(value);
    record.check();
    return record;
  }
};
var AppBskyNotificationGetGroupedNotificationsFollowGroup = class _AppBskyNotificationGetGroupedNotificationsFollowGroup {
  static nsid = "app.bsky.notification.getGroupedNotifications";
  static def = "followGroup";
  static kind = "object";
  $type;
  items;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.notification.getGroupedNotifications#followGroup";
  }
  check() {
    const issues = [];
    if (this["items"] == null) issues.push({ path: "items", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      items: this["items"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyNotificationGetGroupedNotificationsFollowGroup(value);
    record.check();
    return record;
  }
};
var AppBskyNotificationGetGroupedNotificationsFollowItem = class _AppBskyNotificationGetGroupedNotificationsFollowItem {
  static nsid = "app.bsky.notification.getGroupedNotifications";
  static def = "followItem";
  static kind = "object";
  $type;
  actor;
  starterPack;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.notification.getGroupedNotifications#followItem";
  }
  check() {
    const issues = [];
    if (this["actor"] == null) issues.push({ path: "actor", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      actor: this["actor"],
      starterPack: this["starterPack"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyNotificationGetGroupedNotificationsFollowItem(value);
    record.check();
    return record;
  }
};
var AppBskyNotificationGetGroupedNotificationsGeneratorLikeGroup = class _AppBskyNotificationGetGroupedNotificationsGeneratorLikeGroup {
  static nsid = "app.bsky.notification.getGroupedNotifications";
  static def = "generatorLikeGroup";
  static kind = "object";
  $type;
  generator;
  items;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.notification.getGroupedNotifications#generatorLikeGroup";
  }
  check() {
    const issues = [];
    if (this["generator"] == null) issues.push({ path: "generator", message: "Required." });
    if (this["items"] == null) issues.push({ path: "items", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      generator: this["generator"],
      items: this["items"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyNotificationGetGroupedNotificationsGeneratorLikeGroup(value);
    record.check();
    return record;
  }
};
var AppBskyNotificationGetGroupedNotificationsGeneratorLikeItem = class _AppBskyNotificationGetGroupedNotificationsGeneratorLikeItem {
  static nsid = "app.bsky.notification.getGroupedNotifications";
  static def = "generatorLikeItem";
  static kind = "object";
  $type;
  actor;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.notification.getGroupedNotifications#generatorLikeItem";
  }
  check() {
    const issues = [];
    if (this["actor"] == null) issues.push({ path: "actor", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      actor: this["actor"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyNotificationGetGroupedNotificationsGeneratorLikeItem(value);
    record.check();
    return record;
  }
};
var AppBskyNotificationGetGroupedNotificationsGroup = class _AppBskyNotificationGetGroupedNotificationsGroup {
  static nsid = "app.bsky.notification.getGroupedNotifications";
  static def = "group";
  static kind = "object";
  $type;
  id;
  isRead;
  indexedAt;
  count;
  kind;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.notification.getGroupedNotifications#group";
  }
  check() {
    const issues = [];
    if (this["id"] == null) issues.push({ path: "id", message: "Required." });
    if (typeof this["id"] === "string" && this["id"].length > 256) issues.push({ path: "id", message: "Must be at most 256 characters." });
    if (this["isRead"] == null) issues.push({ path: "isRead", message: "Required." });
    if (this["indexedAt"] == null) issues.push({ path: "indexedAt", message: "Required." });
    if (this["count"] == null) issues.push({ path: "count", message: "Required." });
    if (this["count"] != null) {
      if (!Number.isInteger(this["count"])) issues.push({ path: "count", message: "Must be an integer." });
      else if (this["count"] < 1) issues.push({ path: "count", message: "Must be at least 1." });
    }
    if (this["kind"] == null) issues.push({ path: "kind", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      id: this["id"],
      isRead: this["isRead"],
      indexedAt: this["indexedAt"],
      count: this["count"],
      kind: this["kind"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyNotificationGetGroupedNotificationsGroup(value);
    record.check();
    return record;
  }
};
var AppBskyNotificationGetGroupedNotificationsLikeGroup = class _AppBskyNotificationGetGroupedNotificationsLikeGroup {
  static nsid = "app.bsky.notification.getGroupedNotifications";
  static def = "likeGroup";
  static kind = "object";
  $type;
  post;
  items;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.notification.getGroupedNotifications#likeGroup";
  }
  check() {
    const issues = [];
    if (this["post"] == null) issues.push({ path: "post", message: "Required." });
    if (this["items"] == null) issues.push({ path: "items", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      post: this["post"],
      items: this["items"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyNotificationGetGroupedNotificationsLikeGroup(value);
    record.check();
    return record;
  }
};
var AppBskyNotificationGetGroupedNotificationsLikeItem = class _AppBskyNotificationGetGroupedNotificationsLikeItem {
  static nsid = "app.bsky.notification.getGroupedNotifications";
  static def = "likeItem";
  static kind = "object";
  $type;
  actor;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.notification.getGroupedNotifications#likeItem";
  }
  check() {
    const issues = [];
    if (this["actor"] == null) issues.push({ path: "actor", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      actor: this["actor"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyNotificationGetGroupedNotificationsLikeItem(value);
    record.check();
    return record;
  }
};
var AppBskyNotificationGetGroupedNotificationsLikeViaRepostGroup = class _AppBskyNotificationGetGroupedNotificationsLikeViaRepostGroup {
  static nsid = "app.bsky.notification.getGroupedNotifications";
  static def = "likeViaRepostGroup";
  static kind = "object";
  $type;
  post;
  viaRepost;
  items;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.notification.getGroupedNotifications#likeViaRepostGroup";
  }
  check() {
    const issues = [];
    if (this["post"] == null) issues.push({ path: "post", message: "Required." });
    if (this["viaRepost"] == null) issues.push({ path: "viaRepost", message: "Required." });
    if (this["items"] == null) issues.push({ path: "items", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      post: this["post"],
      viaRepost: this["viaRepost"],
      items: this["items"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyNotificationGetGroupedNotificationsLikeViaRepostGroup(value);
    record.check();
    return record;
  }
};
var AppBskyNotificationGetGroupedNotificationsLikeViaRepostItem = class _AppBskyNotificationGetGroupedNotificationsLikeViaRepostItem {
  static nsid = "app.bsky.notification.getGroupedNotifications";
  static def = "likeViaRepostItem";
  static kind = "object";
  $type;
  actor;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.notification.getGroupedNotifications#likeViaRepostItem";
  }
  check() {
    const issues = [];
    if (this["actor"] == null) issues.push({ path: "actor", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      actor: this["actor"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyNotificationGetGroupedNotificationsLikeViaRepostItem(value);
    record.check();
    return record;
  }
};
var AppBskyNotificationGetGroupedNotificationsMentionNotification = class _AppBskyNotificationGetGroupedNotificationsMentionNotification {
  static nsid = "app.bsky.notification.getGroupedNotifications";
  static def = "mentionNotification";
  static kind = "object";
  $type;
  post;
  parent;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.notification.getGroupedNotifications#mentionNotification";
  }
  check() {
    const issues = [];
    if (this["post"] == null) issues.push({ path: "post", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      post: this["post"],
      parent: this["parent"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyNotificationGetGroupedNotificationsMentionNotification(value);
    record.check();
    return record;
  }
};
var AppBskyNotificationGetGroupedNotificationsMultiPostLikeGroup = class _AppBskyNotificationGetGroupedNotificationsMultiPostLikeGroup {
  static nsid = "app.bsky.notification.getGroupedNotifications";
  static def = "multiPostLikeGroup";
  static kind = "object";
  $type;
  actor;
  items;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.notification.getGroupedNotifications#multiPostLikeGroup";
  }
  check() {
    const issues = [];
    if (this["actor"] == null) issues.push({ path: "actor", message: "Required." });
    if (this["items"] == null) issues.push({ path: "items", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      actor: this["actor"],
      items: this["items"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyNotificationGetGroupedNotificationsMultiPostLikeGroup(value);
    record.check();
    return record;
  }
};
var AppBskyNotificationGetGroupedNotificationsMultiPostLikeItem = class _AppBskyNotificationGetGroupedNotificationsMultiPostLikeItem {
  static nsid = "app.bsky.notification.getGroupedNotifications";
  static def = "multiPostLikeItem";
  static kind = "object";
  $type;
  post;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.notification.getGroupedNotifications#multiPostLikeItem";
  }
  check() {
    const issues = [];
    if (this["post"] == null) issues.push({ path: "post", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      post: this["post"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyNotificationGetGroupedNotificationsMultiPostLikeItem(value);
    record.check();
    return record;
  }
};
var AppBskyNotificationGetGroupedNotificationsMultiPostLikeViaRepostGroup = class _AppBskyNotificationGetGroupedNotificationsMultiPostLikeViaRepostGroup {
  static nsid = "app.bsky.notification.getGroupedNotifications";
  static def = "multiPostLikeViaRepostGroup";
  static kind = "object";
  $type;
  actor;
  items;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.notification.getGroupedNotifications#multiPostLikeViaRepostGroup";
  }
  check() {
    const issues = [];
    if (this["actor"] == null) issues.push({ path: "actor", message: "Required." });
    if (this["items"] == null) issues.push({ path: "items", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      actor: this["actor"],
      items: this["items"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyNotificationGetGroupedNotificationsMultiPostLikeViaRepostGroup(value);
    record.check();
    return record;
  }
};
var AppBskyNotificationGetGroupedNotificationsMultiPostLikeViaRepostItem = class _AppBskyNotificationGetGroupedNotificationsMultiPostLikeViaRepostItem {
  static nsid = "app.bsky.notification.getGroupedNotifications";
  static def = "multiPostLikeViaRepostItem";
  static kind = "object";
  $type;
  post;
  viaRepost;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.notification.getGroupedNotifications#multiPostLikeViaRepostItem";
  }
  check() {
    const issues = [];
    if (this["post"] == null) issues.push({ path: "post", message: "Required." });
    if (this["viaRepost"] == null) issues.push({ path: "viaRepost", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      post: this["post"],
      viaRepost: this["viaRepost"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyNotificationGetGroupedNotificationsMultiPostLikeViaRepostItem(value);
    record.check();
    return record;
  }
};
var AppBskyNotificationGetGroupedNotificationsMultiPostRepostGroup = class _AppBskyNotificationGetGroupedNotificationsMultiPostRepostGroup {
  static nsid = "app.bsky.notification.getGroupedNotifications";
  static def = "multiPostRepostGroup";
  static kind = "object";
  $type;
  actor;
  items;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.notification.getGroupedNotifications#multiPostRepostGroup";
  }
  check() {
    const issues = [];
    if (this["actor"] == null) issues.push({ path: "actor", message: "Required." });
    if (this["items"] == null) issues.push({ path: "items", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      actor: this["actor"],
      items: this["items"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyNotificationGetGroupedNotificationsMultiPostRepostGroup(value);
    record.check();
    return record;
  }
};
var AppBskyNotificationGetGroupedNotificationsMultiPostRepostItem = class _AppBskyNotificationGetGroupedNotificationsMultiPostRepostItem {
  static nsid = "app.bsky.notification.getGroupedNotifications";
  static def = "multiPostRepostItem";
  static kind = "object";
  $type;
  post;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.notification.getGroupedNotifications#multiPostRepostItem";
  }
  check() {
    const issues = [];
    if (this["post"] == null) issues.push({ path: "post", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      post: this["post"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyNotificationGetGroupedNotificationsMultiPostRepostItem(value);
    record.check();
    return record;
  }
};
var AppBskyNotificationGetGroupedNotificationsMultiPostRepostViaRepostGroup = class _AppBskyNotificationGetGroupedNotificationsMultiPostRepostViaRepostGroup {
  static nsid = "app.bsky.notification.getGroupedNotifications";
  static def = "multiPostRepostViaRepostGroup";
  static kind = "object";
  $type;
  actor;
  items;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.notification.getGroupedNotifications#multiPostRepostViaRepostGroup";
  }
  check() {
    const issues = [];
    if (this["actor"] == null) issues.push({ path: "actor", message: "Required." });
    if (this["items"] == null) issues.push({ path: "items", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      actor: this["actor"],
      items: this["items"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyNotificationGetGroupedNotificationsMultiPostRepostViaRepostGroup(value);
    record.check();
    return record;
  }
};
var AppBskyNotificationGetGroupedNotificationsMultiPostRepostViaRepostItem = class _AppBskyNotificationGetGroupedNotificationsMultiPostRepostViaRepostItem {
  static nsid = "app.bsky.notification.getGroupedNotifications";
  static def = "multiPostRepostViaRepostItem";
  static kind = "object";
  $type;
  post;
  viaRepost;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.notification.getGroupedNotifications#multiPostRepostViaRepostItem";
  }
  check() {
    const issues = [];
    if (this["post"] == null) issues.push({ path: "post", message: "Required." });
    if (this["viaRepost"] == null) issues.push({ path: "viaRepost", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      post: this["post"],
      viaRepost: this["viaRepost"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyNotificationGetGroupedNotificationsMultiPostRepostViaRepostItem(value);
    record.check();
    return record;
  }
};
var AppBskyNotificationGetGroupedNotificationsQuoteNotification = class _AppBskyNotificationGetGroupedNotificationsQuoteNotification {
  static nsid = "app.bsky.notification.getGroupedNotifications";
  static def = "quoteNotification";
  static kind = "object";
  $type;
  post;
  parent;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.notification.getGroupedNotifications#quoteNotification";
  }
  check() {
    const issues = [];
    if (this["post"] == null) issues.push({ path: "post", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      post: this["post"],
      parent: this["parent"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyNotificationGetGroupedNotificationsQuoteNotification(value);
    record.check();
    return record;
  }
};
var AppBskyNotificationGetGroupedNotificationsReplyNotification = class _AppBskyNotificationGetGroupedNotificationsReplyNotification {
  static nsid = "app.bsky.notification.getGroupedNotifications";
  static def = "replyNotification";
  static kind = "object";
  $type;
  post;
  parent;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.notification.getGroupedNotifications#replyNotification";
  }
  check() {
    const issues = [];
    if (this["post"] == null) issues.push({ path: "post", message: "Required." });
    if (this["parent"] == null) issues.push({ path: "parent", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      post: this["post"],
      parent: this["parent"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyNotificationGetGroupedNotificationsReplyNotification(value);
    record.check();
    return record;
  }
};
var AppBskyNotificationGetGroupedNotificationsRepostGroup = class _AppBskyNotificationGetGroupedNotificationsRepostGroup {
  static nsid = "app.bsky.notification.getGroupedNotifications";
  static def = "repostGroup";
  static kind = "object";
  $type;
  post;
  items;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.notification.getGroupedNotifications#repostGroup";
  }
  check() {
    const issues = [];
    if (this["post"] == null) issues.push({ path: "post", message: "Required." });
    if (this["items"] == null) issues.push({ path: "items", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      post: this["post"],
      items: this["items"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyNotificationGetGroupedNotificationsRepostGroup(value);
    record.check();
    return record;
  }
};
var AppBskyNotificationGetGroupedNotificationsRepostItem = class _AppBskyNotificationGetGroupedNotificationsRepostItem {
  static nsid = "app.bsky.notification.getGroupedNotifications";
  static def = "repostItem";
  static kind = "object";
  $type;
  actor;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.notification.getGroupedNotifications#repostItem";
  }
  check() {
    const issues = [];
    if (this["actor"] == null) issues.push({ path: "actor", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      actor: this["actor"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyNotificationGetGroupedNotificationsRepostItem(value);
    record.check();
    return record;
  }
};
var AppBskyNotificationGetGroupedNotificationsRepostViaRepostGroup = class _AppBskyNotificationGetGroupedNotificationsRepostViaRepostGroup {
  static nsid = "app.bsky.notification.getGroupedNotifications";
  static def = "repostViaRepostGroup";
  static kind = "object";
  $type;
  post;
  viaRepost;
  items;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.notification.getGroupedNotifications#repostViaRepostGroup";
  }
  check() {
    const issues = [];
    if (this["post"] == null) issues.push({ path: "post", message: "Required." });
    if (this["viaRepost"] == null) issues.push({ path: "viaRepost", message: "Required." });
    if (this["items"] == null) issues.push({ path: "items", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      post: this["post"],
      viaRepost: this["viaRepost"],
      items: this["items"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyNotificationGetGroupedNotificationsRepostViaRepostGroup(value);
    record.check();
    return record;
  }
};
var AppBskyNotificationGetGroupedNotificationsRepostViaRepostItem = class _AppBskyNotificationGetGroupedNotificationsRepostViaRepostItem {
  static nsid = "app.bsky.notification.getGroupedNotifications";
  static def = "repostViaRepostItem";
  static kind = "object";
  $type;
  actor;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.notification.getGroupedNotifications#repostViaRepostItem";
  }
  check() {
    const issues = [];
    if (this["actor"] == null) issues.push({ path: "actor", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      actor: this["actor"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyNotificationGetGroupedNotificationsRepostViaRepostItem(value);
    record.check();
    return record;
  }
};
var AppBskyNotificationGetGroupedNotificationsStarterPackJoinedNotification = class _AppBskyNotificationGetGroupedNotificationsStarterPackJoinedNotification {
  static nsid = "app.bsky.notification.getGroupedNotifications";
  static def = "starterPackJoinedNotification";
  static kind = "object";
  $type;
  actor;
  starterPack;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.notification.getGroupedNotifications#starterPackJoinedNotification";
  }
  check() {
    const issues = [];
    if (this["actor"] == null) issues.push({ path: "actor", message: "Required." });
    if (this["starterPack"] == null) issues.push({ path: "starterPack", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      actor: this["actor"],
      starterPack: this["starterPack"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyNotificationGetGroupedNotificationsStarterPackJoinedNotification(value);
    record.check();
    return record;
  }
};
var AppBskyNotificationGetGroupedNotificationsSubscribedPostGroup = class _AppBskyNotificationGetGroupedNotificationsSubscribedPostGroup {
  static nsid = "app.bsky.notification.getGroupedNotifications";
  static def = "subscribedPostGroup";
  static kind = "object";
  $type;
  items;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.notification.getGroupedNotifications#subscribedPostGroup";
  }
  check() {
    const issues = [];
    if (this["items"] == null) issues.push({ path: "items", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      items: this["items"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyNotificationGetGroupedNotificationsSubscribedPostGroup(value);
    record.check();
    return record;
  }
};
var AppBskyNotificationGetGroupedNotificationsSubscribedPostItem = class _AppBskyNotificationGetGroupedNotificationsSubscribedPostItem {
  static nsid = "app.bsky.notification.getGroupedNotifications";
  static def = "subscribedPostItem";
  static kind = "object";
  $type;
  actor;
  post;
  parent;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.notification.getGroupedNotifications#subscribedPostItem";
  }
  check() {
    const issues = [];
    if (this["actor"] == null) issues.push({ path: "actor", message: "Required." });
    if (this["post"] == null) issues.push({ path: "post", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      actor: this["actor"],
      post: this["post"],
      parent: this["parent"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyNotificationGetGroupedNotificationsSubscribedPostItem(value);
    record.check();
    return record;
  }
};
var AppBskyNotificationGetGroupedNotificationsUnverifiedNotification = class _AppBskyNotificationGetGroupedNotificationsUnverifiedNotification {
  static nsid = "app.bsky.notification.getGroupedNotifications";
  static def = "unverifiedNotification";
  static kind = "object";
  $type;
  actor;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.notification.getGroupedNotifications#unverifiedNotification";
  }
  check() {
    const issues = [];
    if (this["actor"] == null) issues.push({ path: "actor", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      actor: this["actor"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyNotificationGetGroupedNotificationsUnverifiedNotification(value);
    record.check();
    return record;
  }
};
var AppBskyNotificationGetGroupedNotificationsVerifiedNotification = class _AppBskyNotificationGetGroupedNotificationsVerifiedNotification {
  static nsid = "app.bsky.notification.getGroupedNotifications";
  static def = "verifiedNotification";
  static kind = "object";
  $type;
  actor;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.notification.getGroupedNotifications#verifiedNotification";
  }
  check() {
    const issues = [];
    if (this["actor"] == null) issues.push({ path: "actor", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      actor: this["actor"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyNotificationGetGroupedNotificationsVerifiedNotification(value);
    record.check();
    return record;
  }
};
var AppBskyNotificationGetPreferences = class _AppBskyNotificationGetPreferences {
  static nsid = "app.bsky.notification.getPreferences";
  static def = "main";
  static kind = "query";
  static http = "GET";
  static errorNames = [];
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({});
  }
  check() {
    const issues = [];
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _AppBskyNotificationGetPreferences.nsid,
      method: "GET",
      params: this.toParams(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyNotificationGetPreferences(value);
    record.check();
    return record;
  }
};
var AppBskyNotificationGetUnreadCount = class _AppBskyNotificationGetUnreadCount {
  static nsid = "app.bsky.notification.getUnreadCount";
  static def = "main";
  static kind = "query";
  static http = "GET";
  static errorNames = [];
  priority;
  seenAt;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({
      priority: this["priority"],
      seenAt: this["seenAt"]
    });
  }
  check() {
    const issues = [];
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _AppBskyNotificationGetUnreadCount.nsid,
      method: "GET",
      params: this.toParams(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyNotificationGetUnreadCount(value);
    record.check();
    return record;
  }
};
var AppBskyNotificationListActivitySubscriptions = class _AppBskyNotificationListActivitySubscriptions {
  static nsid = "app.bsky.notification.listActivitySubscriptions";
  static def = "main";
  static kind = "query";
  static http = "GET";
  static errorNames = [];
  limit;
  cursor;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({
      limit: this["limit"],
      cursor: this["cursor"]
    });
  }
  check() {
    const issues = [];
    if (this["limit"] != null) {
      if (!Number.isInteger(this["limit"])) issues.push({ path: "limit", message: "Must be an integer." });
      else if (this["limit"] < 1) issues.push({ path: "limit", message: "Must be at least 1." });
      else if (this["limit"] > 100) issues.push({ path: "limit", message: "Must be at most 100." });
    }
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _AppBskyNotificationListActivitySubscriptions.nsid,
      method: "GET",
      params: this.toParams(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyNotificationListActivitySubscriptions(value);
    record.check();
    return record;
  }
};
var AppBskyNotificationListNotifications = class _AppBskyNotificationListNotifications {
  static nsid = "app.bsky.notification.listNotifications";
  static def = "main";
  static kind = "query";
  static http = "GET";
  static errorNames = [];
  reasons;
  limit;
  priority;
  cursor;
  seenAt;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({
      reasons: this["reasons"],
      limit: this["limit"],
      priority: this["priority"],
      cursor: this["cursor"],
      seenAt: this["seenAt"]
    });
  }
  check() {
    const issues = [];
    if (this["limit"] != null) {
      if (!Number.isInteger(this["limit"])) issues.push({ path: "limit", message: "Must be an integer." });
      else if (this["limit"] < 1) issues.push({ path: "limit", message: "Must be at least 1." });
      else if (this["limit"] > 100) issues.push({ path: "limit", message: "Must be at most 100." });
    }
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _AppBskyNotificationListNotifications.nsid,
      method: "GET",
      params: this.toParams(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyNotificationListNotifications(value);
    record.check();
    return record;
  }
};
var AppBskyNotificationListNotificationsNotification = class _AppBskyNotificationListNotificationsNotification {
  static nsid = "app.bsky.notification.listNotifications";
  static def = "notification";
  static kind = "object";
  $type;
  uri;
  cid;
  author;
  reason;
  reasonSubject;
  record;
  starterPack;
  isRead;
  indexedAt;
  labels;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.notification.listNotifications#notification";
  }
  check() {
    const issues = [];
    if (this["uri"] == null) issues.push({ path: "uri", message: "Required." });
    if (this["cid"] == null) issues.push({ path: "cid", message: "Required." });
    if (this["author"] == null) issues.push({ path: "author", message: "Required." });
    if (this["reason"] == null) issues.push({ path: "reason", message: "Required." });
    if (this["record"] == null) issues.push({ path: "record", message: "Required." });
    if (this["isRead"] == null) issues.push({ path: "isRead", message: "Required." });
    if (this["indexedAt"] == null) issues.push({ path: "indexedAt", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      uri: this["uri"],
      cid: this["cid"],
      author: this["author"],
      reason: this["reason"],
      reasonSubject: this["reasonSubject"],
      record: this["record"],
      starterPack: this["starterPack"],
      isRead: this["isRead"],
      indexedAt: this["indexedAt"],
      labels: this["labels"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyNotificationListNotificationsNotification(value);
    record.check();
    return record;
  }
};
var AppBskyNotificationPutActivitySubscription = class _AppBskyNotificationPutActivitySubscription {
  static nsid = "app.bsky.notification.putActivitySubscription";
  static def = "main";
  static kind = "procedure";
  static http = "POST";
  static errorNames = [];
  subject;
  activitySubscription;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({});
  }
  toBody() {
    return jsonOf({
      subject: this["subject"],
      activitySubscription: this["activitySubscription"]
    });
  }
  check() {
    const issues = [];
    if (this["subject"] == null) issues.push({ path: "subject", message: "Required." });
    if (this["activitySubscription"] == null) issues.push({ path: "activitySubscription", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _AppBskyNotificationPutActivitySubscription.nsid,
      method: "POST",
      params: this.toParams(),
      body: this.toBody(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyNotificationPutActivitySubscription(value);
    record.check();
    return record;
  }
};
var AppBskyNotificationPutPreferences = class _AppBskyNotificationPutPreferences {
  static nsid = "app.bsky.notification.putPreferences";
  static def = "main";
  static kind = "procedure";
  static http = "POST";
  static errorNames = [];
  priority;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({});
  }
  toBody() {
    return jsonOf({
      priority: this["priority"]
    });
  }
  check() {
    const issues = [];
    if (this["priority"] == null) issues.push({ path: "priority", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _AppBskyNotificationPutPreferences.nsid,
      method: "POST",
      params: this.toParams(),
      body: this.toBody(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyNotificationPutPreferences(value);
    record.check();
    return record;
  }
};
var AppBskyNotificationPutPreferencesV2 = class _AppBskyNotificationPutPreferencesV2 {
  static nsid = "app.bsky.notification.putPreferencesV2";
  static def = "main";
  static kind = "procedure";
  static http = "POST";
  static errorNames = [];
  chat;
  follow;
  like;
  likeViaRepost;
  mention;
  quote;
  reply;
  repost;
  repostViaRepost;
  starterpackJoined;
  subscribedPost;
  unverified;
  verified;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({});
  }
  toBody() {
    return jsonOf({
      chat: this["chat"],
      follow: this["follow"],
      like: this["like"],
      likeViaRepost: this["likeViaRepost"],
      mention: this["mention"],
      quote: this["quote"],
      reply: this["reply"],
      repost: this["repost"],
      repostViaRepost: this["repostViaRepost"],
      starterpackJoined: this["starterpackJoined"],
      subscribedPost: this["subscribedPost"],
      unverified: this["unverified"],
      verified: this["verified"]
    });
  }
  check() {
    const issues = [];
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _AppBskyNotificationPutPreferencesV2.nsid,
      method: "POST",
      params: this.toParams(),
      body: this.toBody(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyNotificationPutPreferencesV2(value);
    record.check();
    return record;
  }
};
var AppBskyNotificationRegisterPush = class _AppBskyNotificationRegisterPush {
  static nsid = "app.bsky.notification.registerPush";
  static def = "main";
  static kind = "procedure";
  static http = "POST";
  static errorNames = [];
  serviceDid;
  token;
  platform;
  appId;
  ageRestricted;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({});
  }
  toBody() {
    return jsonOf({
      serviceDid: this["serviceDid"],
      token: this["token"],
      platform: this["platform"],
      appId: this["appId"],
      ageRestricted: this["ageRestricted"]
    });
  }
  check() {
    const issues = [];
    if (this["serviceDid"] == null) issues.push({ path: "serviceDid", message: "Required." });
    if (this["token"] == null) issues.push({ path: "token", message: "Required." });
    if (this["platform"] == null) issues.push({ path: "platform", message: "Required." });
    if (this["appId"] == null) issues.push({ path: "appId", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _AppBskyNotificationRegisterPush.nsid,
      method: "POST",
      params: this.toParams(),
      body: this.toBody(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyNotificationRegisterPush(value);
    record.check();
    return record;
  }
};
var AppBskyNotificationUnregisterPush = class _AppBskyNotificationUnregisterPush {
  static nsid = "app.bsky.notification.unregisterPush";
  static def = "main";
  static kind = "procedure";
  static http = "POST";
  static errorNames = [];
  serviceDid;
  token;
  platform;
  appId;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({});
  }
  toBody() {
    return jsonOf({
      serviceDid: this["serviceDid"],
      token: this["token"],
      platform: this["platform"],
      appId: this["appId"]
    });
  }
  check() {
    const issues = [];
    if (this["serviceDid"] == null) issues.push({ path: "serviceDid", message: "Required." });
    if (this["token"] == null) issues.push({ path: "token", message: "Required." });
    if (this["platform"] == null) issues.push({ path: "platform", message: "Required." });
    if (this["appId"] == null) issues.push({ path: "appId", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _AppBskyNotificationUnregisterPush.nsid,
      method: "POST",
      params: this.toParams(),
      body: this.toBody(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyNotificationUnregisterPush(value);
    record.check();
    return record;
  }
};
var AppBskyNotificationUpdateSeen = class _AppBskyNotificationUpdateSeen {
  static nsid = "app.bsky.notification.updateSeen";
  static def = "main";
  static kind = "procedure";
  static http = "POST";
  static errorNames = [];
  seenAt;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({});
  }
  toBody() {
    return jsonOf({
      seenAt: this["seenAt"]
    });
  }
  check() {
    const issues = [];
    if (this["seenAt"] == null) issues.push({ path: "seenAt", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _AppBskyNotificationUpdateSeen.nsid,
      method: "POST",
      params: this.toParams(),
      body: this.toBody(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyNotificationUpdateSeen(value);
    record.check();
    return record;
  }
};
var AppBskyRichtextFacet = class _AppBskyRichtextFacet {
  static nsid = "app.bsky.richtext.facet";
  static def = "main";
  static kind = "object";
  $type;
  index;
  features;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.richtext.facet";
  }
  check() {
    const issues = [];
    if (this["index"] == null) issues.push({ path: "index", message: "Required." });
    if (this["features"] == null) issues.push({ path: "features", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      index: this["index"],
      features: this["features"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyRichtextFacet(value);
    record.check();
    return record;
  }
};
var AppBskyRichtextFacetByteSlice = class _AppBskyRichtextFacetByteSlice {
  static nsid = "app.bsky.richtext.facet";
  static def = "byteSlice";
  static kind = "object";
  $type;
  byteStart;
  byteEnd;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.richtext.facet#byteSlice";
  }
  check() {
    const issues = [];
    if (this["byteStart"] == null) issues.push({ path: "byteStart", message: "Required." });
    if (this["byteStart"] != null) {
      if (!Number.isInteger(this["byteStart"])) issues.push({ path: "byteStart", message: "Must be an integer." });
      else if (this["byteStart"] < 0) issues.push({ path: "byteStart", message: "Must be at least 0." });
    }
    if (this["byteEnd"] == null) issues.push({ path: "byteEnd", message: "Required." });
    if (this["byteEnd"] != null) {
      if (!Number.isInteger(this["byteEnd"])) issues.push({ path: "byteEnd", message: "Must be an integer." });
      else if (this["byteEnd"] < 0) issues.push({ path: "byteEnd", message: "Must be at least 0." });
    }
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      byteStart: this["byteStart"],
      byteEnd: this["byteEnd"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyRichtextFacetByteSlice(value);
    record.check();
    return record;
  }
};
var AppBskyRichtextFacetLink = class _AppBskyRichtextFacetLink {
  static nsid = "app.bsky.richtext.facet";
  static def = "link";
  static kind = "object";
  $type;
  uri;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.richtext.facet#link";
  }
  check() {
    const issues = [];
    if (this["uri"] == null) issues.push({ path: "uri", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      uri: this["uri"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyRichtextFacetLink(value);
    record.check();
    return record;
  }
};
var AppBskyRichtextFacetMention = class _AppBskyRichtextFacetMention {
  static nsid = "app.bsky.richtext.facet";
  static def = "mention";
  static kind = "object";
  $type;
  did;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.richtext.facet#mention";
  }
  check() {
    const issues = [];
    if (this["did"] == null) issues.push({ path: "did", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      did: this["did"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyRichtextFacetMention(value);
    record.check();
    return record;
  }
};
var AppBskyRichtextFacetTag = class _AppBskyRichtextFacetTag {
  static nsid = "app.bsky.richtext.facet";
  static def = "tag";
  static kind = "object";
  $type;
  tag;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.richtext.facet#tag";
  }
  check() {
    const issues = [];
    if (this["tag"] == null) issues.push({ path: "tag", message: "Required." });
    if (typeof this["tag"] === "string" && this["tag"].length > 640) issues.push({ path: "tag", message: "Must be at most 640 characters." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      tag: this["tag"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyRichtextFacetTag(value);
    record.check();
    return record;
  }
};
var AppBskyUnspeccedDefsAgeAssuranceEvent = class _AppBskyUnspeccedDefsAgeAssuranceEvent {
  static nsid = "app.bsky.unspecced.defs";
  static def = "ageAssuranceEvent";
  static kind = "object";
  $type;
  createdAt;
  status;
  attemptId;
  email;
  initIp;
  initUa;
  completeIp;
  completeUa;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.unspecced.defs#ageAssuranceEvent";
  }
  check() {
    const issues = [];
    if (this["createdAt"] == null) issues.push({ path: "createdAt", message: "Required." });
    if (this["status"] == null) issues.push({ path: "status", message: "Required." });
    if (this["attemptId"] == null) issues.push({ path: "attemptId", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      createdAt: this["createdAt"],
      status: this["status"],
      attemptId: this["attemptId"],
      email: this["email"],
      initIp: this["initIp"],
      initUa: this["initUa"],
      completeIp: this["completeIp"],
      completeUa: this["completeUa"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyUnspeccedDefsAgeAssuranceEvent(value);
    record.check();
    return record;
  }
};
var AppBskyUnspeccedDefsAgeAssuranceState = class _AppBskyUnspeccedDefsAgeAssuranceState {
  static nsid = "app.bsky.unspecced.defs";
  static def = "ageAssuranceState";
  static kind = "object";
  $type;
  lastInitiatedAt;
  status;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.unspecced.defs#ageAssuranceState";
  }
  check() {
    const issues = [];
    if (this["status"] == null) issues.push({ path: "status", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      lastInitiatedAt: this["lastInitiatedAt"],
      status: this["status"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyUnspeccedDefsAgeAssuranceState(value);
    record.check();
    return record;
  }
};
var AppBskyUnspeccedDefsSkeletonSearchActor = class _AppBskyUnspeccedDefsSkeletonSearchActor {
  static nsid = "app.bsky.unspecced.defs";
  static def = "skeletonSearchActor";
  static kind = "object";
  $type;
  did;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.unspecced.defs#skeletonSearchActor";
  }
  check() {
    const issues = [];
    if (this["did"] == null) issues.push({ path: "did", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      did: this["did"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyUnspeccedDefsSkeletonSearchActor(value);
    record.check();
    return record;
  }
};
var AppBskyUnspeccedDefsSkeletonSearchPost = class _AppBskyUnspeccedDefsSkeletonSearchPost {
  static nsid = "app.bsky.unspecced.defs";
  static def = "skeletonSearchPost";
  static kind = "object";
  $type;
  uri;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.unspecced.defs#skeletonSearchPost";
  }
  check() {
    const issues = [];
    if (this["uri"] == null) issues.push({ path: "uri", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      uri: this["uri"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyUnspeccedDefsSkeletonSearchPost(value);
    record.check();
    return record;
  }
};
var AppBskyUnspeccedDefsSkeletonSearchStarterPack = class _AppBskyUnspeccedDefsSkeletonSearchStarterPack {
  static nsid = "app.bsky.unspecced.defs";
  static def = "skeletonSearchStarterPack";
  static kind = "object";
  $type;
  uri;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.unspecced.defs#skeletonSearchStarterPack";
  }
  check() {
    const issues = [];
    if (this["uri"] == null) issues.push({ path: "uri", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      uri: this["uri"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyUnspeccedDefsSkeletonSearchStarterPack(value);
    record.check();
    return record;
  }
};
var AppBskyUnspeccedDefsSkeletonTrend = class _AppBskyUnspeccedDefsSkeletonTrend {
  static nsid = "app.bsky.unspecced.defs";
  static def = "skeletonTrend";
  static kind = "object";
  $type;
  topic;
  displayName;
  description;
  link;
  startedAt;
  postCount;
  status;
  category;
  dids;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.unspecced.defs#skeletonTrend";
  }
  check() {
    const issues = [];
    if (this["topic"] == null) issues.push({ path: "topic", message: "Required." });
    if (this["displayName"] == null) issues.push({ path: "displayName", message: "Required." });
    if (this["link"] == null) issues.push({ path: "link", message: "Required." });
    if (this["startedAt"] == null) issues.push({ path: "startedAt", message: "Required." });
    if (this["postCount"] == null) issues.push({ path: "postCount", message: "Required." });
    if (this["postCount"] != null) {
      if (!Number.isInteger(this["postCount"])) issues.push({ path: "postCount", message: "Must be an integer." });
    }
    if (this["dids"] == null) issues.push({ path: "dids", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      topic: this["topic"],
      displayName: this["displayName"],
      description: this["description"],
      link: this["link"],
      startedAt: this["startedAt"],
      postCount: this["postCount"],
      status: this["status"],
      category: this["category"],
      dids: this["dids"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyUnspeccedDefsSkeletonTrend(value);
    record.check();
    return record;
  }
};
var AppBskyUnspeccedDefsThreadItemBlocked = class _AppBskyUnspeccedDefsThreadItemBlocked {
  static nsid = "app.bsky.unspecced.defs";
  static def = "threadItemBlocked";
  static kind = "object";
  $type;
  author;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.unspecced.defs#threadItemBlocked";
  }
  check() {
    const issues = [];
    if (this["author"] == null) issues.push({ path: "author", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      author: this["author"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyUnspeccedDefsThreadItemBlocked(value);
    record.check();
    return record;
  }
};
var AppBskyUnspeccedDefsThreadItemNotFound = class _AppBskyUnspeccedDefsThreadItemNotFound {
  static nsid = "app.bsky.unspecced.defs";
  static def = "threadItemNotFound";
  static kind = "object";
  $type;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.unspecced.defs#threadItemNotFound";
  }
  check() {
    const issues = [];
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyUnspeccedDefsThreadItemNotFound(value);
    record.check();
    return record;
  }
};
var AppBskyUnspeccedDefsThreadItemNoUnauthenticated = class _AppBskyUnspeccedDefsThreadItemNoUnauthenticated {
  static nsid = "app.bsky.unspecced.defs";
  static def = "threadItemNoUnauthenticated";
  static kind = "object";
  $type;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.unspecced.defs#threadItemNoUnauthenticated";
  }
  check() {
    const issues = [];
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyUnspeccedDefsThreadItemNoUnauthenticated(value);
    record.check();
    return record;
  }
};
var AppBskyUnspeccedDefsThreadItemPost = class _AppBskyUnspeccedDefsThreadItemPost {
  static nsid = "app.bsky.unspecced.defs";
  static def = "threadItemPost";
  static kind = "object";
  $type;
  post;
  moreParents;
  moreReplies;
  opThread;
  opThreadPostIndex;
  opThreadPostCount;
  hiddenByThreadgate;
  mutedByViewer;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.unspecced.defs#threadItemPost";
  }
  check() {
    const issues = [];
    if (this["post"] == null) issues.push({ path: "post", message: "Required." });
    if (this["moreParents"] == null) issues.push({ path: "moreParents", message: "Required." });
    if (this["moreReplies"] == null) issues.push({ path: "moreReplies", message: "Required." });
    if (this["moreReplies"] != null) {
      if (!Number.isInteger(this["moreReplies"])) issues.push({ path: "moreReplies", message: "Must be an integer." });
    }
    if (this["opThread"] == null) issues.push({ path: "opThread", message: "Required." });
    if (this["opThreadPostIndex"] != null) {
      if (!Number.isInteger(this["opThreadPostIndex"])) issues.push({ path: "opThreadPostIndex", message: "Must be an integer." });
    }
    if (this["opThreadPostCount"] != null) {
      if (!Number.isInteger(this["opThreadPostCount"])) issues.push({ path: "opThreadPostCount", message: "Must be an integer." });
    }
    if (this["hiddenByThreadgate"] == null) issues.push({ path: "hiddenByThreadgate", message: "Required." });
    if (this["mutedByViewer"] == null) issues.push({ path: "mutedByViewer", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      post: this["post"],
      moreParents: this["moreParents"],
      moreReplies: this["moreReplies"],
      opThread: this["opThread"],
      opThreadPostIndex: this["opThreadPostIndex"],
      opThreadPostCount: this["opThreadPostCount"],
      hiddenByThreadgate: this["hiddenByThreadgate"],
      mutedByViewer: this["mutedByViewer"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyUnspeccedDefsThreadItemPost(value);
    record.check();
    return record;
  }
};
var AppBskyUnspeccedDefsTrendingTopic = class _AppBskyUnspeccedDefsTrendingTopic {
  static nsid = "app.bsky.unspecced.defs";
  static def = "trendingTopic";
  static kind = "object";
  $type;
  topic;
  displayName;
  description;
  link;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.unspecced.defs#trendingTopic";
  }
  check() {
    const issues = [];
    if (this["topic"] == null) issues.push({ path: "topic", message: "Required." });
    if (this["link"] == null) issues.push({ path: "link", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      topic: this["topic"],
      displayName: this["displayName"],
      description: this["description"],
      link: this["link"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyUnspeccedDefsTrendingTopic(value);
    record.check();
    return record;
  }
};
var AppBskyUnspeccedDefsTrendView = class _AppBskyUnspeccedDefsTrendView {
  static nsid = "app.bsky.unspecced.defs";
  static def = "trendView";
  static kind = "object";
  $type;
  topic;
  displayName;
  description;
  link;
  startedAt;
  postCount;
  status;
  category;
  actors;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.unspecced.defs#trendView";
  }
  check() {
    const issues = [];
    if (this["topic"] == null) issues.push({ path: "topic", message: "Required." });
    if (this["displayName"] == null) issues.push({ path: "displayName", message: "Required." });
    if (this["link"] == null) issues.push({ path: "link", message: "Required." });
    if (this["startedAt"] == null) issues.push({ path: "startedAt", message: "Required." });
    if (this["postCount"] == null) issues.push({ path: "postCount", message: "Required." });
    if (this["postCount"] != null) {
      if (!Number.isInteger(this["postCount"])) issues.push({ path: "postCount", message: "Must be an integer." });
    }
    if (this["actors"] == null) issues.push({ path: "actors", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      topic: this["topic"],
      displayName: this["displayName"],
      description: this["description"],
      link: this["link"],
      startedAt: this["startedAt"],
      postCount: this["postCount"],
      status: this["status"],
      category: this["category"],
      actors: this["actors"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyUnspeccedDefsTrendView(value);
    record.check();
    return record;
  }
};
var AppBskyUnspeccedGetAgeAssuranceState = class _AppBskyUnspeccedGetAgeAssuranceState {
  static nsid = "app.bsky.unspecced.getAgeAssuranceState";
  static def = "main";
  static kind = "query";
  static http = "GET";
  static errorNames = [];
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({});
  }
  check() {
    const issues = [];
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _AppBskyUnspeccedGetAgeAssuranceState.nsid,
      method: "GET",
      params: this.toParams(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyUnspeccedGetAgeAssuranceState(value);
    record.check();
    return record;
  }
};
var AppBskyUnspeccedGetAtmosphereExploreArticleRecommendations = class _AppBskyUnspeccedGetAtmosphereExploreArticleRecommendations {
  static nsid = "app.bsky.unspecced.getAtmosphereExploreArticleRecommendations";
  static def = "main";
  static kind = "query";
  static http = "GET";
  static errorNames = [];
  viewer;
  limit;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({
      viewer: this["viewer"],
      limit: this["limit"]
    });
  }
  check() {
    const issues = [];
    if (this["limit"] != null) {
      if (!Number.isInteger(this["limit"])) issues.push({ path: "limit", message: "Must be an integer." });
      else if (this["limit"] < 1) issues.push({ path: "limit", message: "Must be at least 1." });
      else if (this["limit"] > 100) issues.push({ path: "limit", message: "Must be at most 100." });
    }
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _AppBskyUnspeccedGetAtmosphereExploreArticleRecommendations.nsid,
      method: "GET",
      params: this.toParams(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyUnspeccedGetAtmosphereExploreArticleRecommendations(value);
    record.check();
    return record;
  }
};
var AppBskyUnspeccedGetAtmosphereExploreArticleRecommendationsArticle = class _AppBskyUnspeccedGetAtmosphereExploreArticleRecommendationsArticle {
  static nsid = "app.bsky.unspecced.getAtmosphereExploreArticleRecommendations";
  static def = "article";
  static kind = "object";
  $type;
  uri;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.unspecced.getAtmosphereExploreArticleRecommendations#article";
  }
  check() {
    const issues = [];
    if (this["uri"] == null) issues.push({ path: "uri", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      uri: this["uri"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyUnspeccedGetAtmosphereExploreArticleRecommendationsArticle(value);
    record.check();
    return record;
  }
};
var AppBskyUnspeccedGetConfig = class _AppBskyUnspeccedGetConfig {
  static nsid = "app.bsky.unspecced.getConfig";
  static def = "main";
  static kind = "query";
  static http = "GET";
  static errorNames = [];
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({});
  }
  check() {
    const issues = [];
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _AppBskyUnspeccedGetConfig.nsid,
      method: "GET",
      params: this.toParams(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyUnspeccedGetConfig(value);
    record.check();
    return record;
  }
};
var AppBskyUnspeccedGetConfigLiveNowConfig = class _AppBskyUnspeccedGetConfigLiveNowConfig {
  static nsid = "app.bsky.unspecced.getConfig";
  static def = "liveNowConfig";
  static kind = "object";
  $type;
  did;
  domains;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.unspecced.getConfig#liveNowConfig";
  }
  check() {
    const issues = [];
    if (this["did"] == null) issues.push({ path: "did", message: "Required." });
    if (this["domains"] == null) issues.push({ path: "domains", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      did: this["did"],
      domains: this["domains"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyUnspeccedGetConfigLiveNowConfig(value);
    record.check();
    return record;
  }
};
var AppBskyUnspeccedGetOnboardingSuggestedUsersSkeleton = class _AppBskyUnspeccedGetOnboardingSuggestedUsersSkeleton {
  static nsid = "app.bsky.unspecced.getOnboardingSuggestedUsersSkeleton";
  static def = "main";
  static kind = "query";
  static http = "GET";
  static errorNames = [];
  viewer;
  category;
  limit;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({
      viewer: this["viewer"],
      category: this["category"],
      limit: this["limit"]
    });
  }
  check() {
    const issues = [];
    if (this["limit"] != null) {
      if (!Number.isInteger(this["limit"])) issues.push({ path: "limit", message: "Must be an integer." });
      else if (this["limit"] < 1) issues.push({ path: "limit", message: "Must be at least 1." });
      else if (this["limit"] > 50) issues.push({ path: "limit", message: "Must be at most 50." });
    }
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _AppBskyUnspeccedGetOnboardingSuggestedUsersSkeleton.nsid,
      method: "GET",
      params: this.toParams(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyUnspeccedGetOnboardingSuggestedUsersSkeleton(value);
    record.check();
    return record;
  }
};
var AppBskyUnspeccedGetPopularFeedGenerators = class _AppBskyUnspeccedGetPopularFeedGenerators {
  static nsid = "app.bsky.unspecced.getPopularFeedGenerators";
  static def = "main";
  static kind = "query";
  static http = "GET";
  static errorNames = [];
  limit;
  cursor;
  query;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({
      limit: this["limit"],
      cursor: this["cursor"],
      query: this["query"]
    });
  }
  check() {
    const issues = [];
    if (this["limit"] != null) {
      if (!Number.isInteger(this["limit"])) issues.push({ path: "limit", message: "Must be an integer." });
      else if (this["limit"] < 1) issues.push({ path: "limit", message: "Must be at least 1." });
      else if (this["limit"] > 100) issues.push({ path: "limit", message: "Must be at most 100." });
    }
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _AppBskyUnspeccedGetPopularFeedGenerators.nsid,
      method: "GET",
      params: this.toParams(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyUnspeccedGetPopularFeedGenerators(value);
    record.check();
    return record;
  }
};
var AppBskyUnspeccedGetPostThreadOtherV2 = class _AppBskyUnspeccedGetPostThreadOtherV2 {
  static nsid = "app.bsky.unspecced.getPostThreadOtherV2";
  static def = "main";
  static kind = "query";
  static http = "GET";
  static errorNames = [];
  anchor;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({
      anchor: this["anchor"]
    });
  }
  check() {
    const issues = [];
    if (this["anchor"] == null) issues.push({ path: "anchor", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _AppBskyUnspeccedGetPostThreadOtherV2.nsid,
      method: "GET",
      params: this.toParams(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyUnspeccedGetPostThreadOtherV2(value);
    record.check();
    return record;
  }
};
var AppBskyUnspeccedGetPostThreadOtherV2ThreadItem = class _AppBskyUnspeccedGetPostThreadOtherV2ThreadItem {
  static nsid = "app.bsky.unspecced.getPostThreadOtherV2";
  static def = "threadItem";
  static kind = "object";
  $type;
  uri;
  depth;
  value;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.unspecced.getPostThreadOtherV2#threadItem";
  }
  check() {
    const issues = [];
    if (this["uri"] == null) issues.push({ path: "uri", message: "Required." });
    if (this["depth"] == null) issues.push({ path: "depth", message: "Required." });
    if (this["depth"] != null) {
      if (!Number.isInteger(this["depth"])) issues.push({ path: "depth", message: "Must be an integer." });
    }
    if (this["value"] == null) issues.push({ path: "value", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      uri: this["uri"],
      depth: this["depth"],
      value: this["value"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyUnspeccedGetPostThreadOtherV2ThreadItem(value);
    record.check();
    return record;
  }
};
var AppBskyUnspeccedGetPostThreadV2 = class _AppBskyUnspeccedGetPostThreadV2 {
  static nsid = "app.bsky.unspecced.getPostThreadV2";
  static def = "main";
  static kind = "query";
  static http = "GET";
  static errorNames = [];
  anchor;
  above;
  below;
  branchingFactor;
  sort;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({
      anchor: this["anchor"],
      above: this["above"],
      below: this["below"],
      branchingFactor: this["branchingFactor"],
      sort: this["sort"]
    });
  }
  check() {
    const issues = [];
    if (this["anchor"] == null) issues.push({ path: "anchor", message: "Required." });
    if (this["below"] != null) {
      if (!Number.isInteger(this["below"])) issues.push({ path: "below", message: "Must be an integer." });
      else if (this["below"] < 0) issues.push({ path: "below", message: "Must be at least 0." });
      else if (this["below"] > 20) issues.push({ path: "below", message: "Must be at most 20." });
    }
    if (this["branchingFactor"] != null) {
      if (!Number.isInteger(this["branchingFactor"])) issues.push({ path: "branchingFactor", message: "Must be an integer." });
      else if (this["branchingFactor"] < 0) issues.push({ path: "branchingFactor", message: "Must be at least 0." });
      else if (this["branchingFactor"] > 100) issues.push({ path: "branchingFactor", message: "Must be at most 100." });
    }
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _AppBskyUnspeccedGetPostThreadV2.nsid,
      method: "GET",
      params: this.toParams(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyUnspeccedGetPostThreadV2(value);
    record.check();
    return record;
  }
};
var AppBskyUnspeccedGetPostThreadV2ThreadItem = class _AppBskyUnspeccedGetPostThreadV2ThreadItem {
  static nsid = "app.bsky.unspecced.getPostThreadV2";
  static def = "threadItem";
  static kind = "object";
  $type;
  uri;
  depth;
  value;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.unspecced.getPostThreadV2#threadItem";
  }
  check() {
    const issues = [];
    if (this["uri"] == null) issues.push({ path: "uri", message: "Required." });
    if (this["depth"] == null) issues.push({ path: "depth", message: "Required." });
    if (this["depth"] != null) {
      if (!Number.isInteger(this["depth"])) issues.push({ path: "depth", message: "Must be an integer." });
    }
    if (this["value"] == null) issues.push({ path: "value", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      uri: this["uri"],
      depth: this["depth"],
      value: this["value"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyUnspeccedGetPostThreadV2ThreadItem(value);
    record.check();
    return record;
  }
};
var AppBskyUnspeccedGetSuggestedOnboardingUsers = class _AppBskyUnspeccedGetSuggestedOnboardingUsers {
  static nsid = "app.bsky.unspecced.getSuggestedOnboardingUsers";
  static def = "main";
  static kind = "query";
  static http = "GET";
  static errorNames = [];
  category;
  limit;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({
      category: this["category"],
      limit: this["limit"]
    });
  }
  check() {
    const issues = [];
    if (this["limit"] != null) {
      if (!Number.isInteger(this["limit"])) issues.push({ path: "limit", message: "Must be an integer." });
      else if (this["limit"] < 1) issues.push({ path: "limit", message: "Must be at least 1." });
      else if (this["limit"] > 50) issues.push({ path: "limit", message: "Must be at most 50." });
    }
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _AppBskyUnspeccedGetSuggestedOnboardingUsers.nsid,
      method: "GET",
      params: this.toParams(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyUnspeccedGetSuggestedOnboardingUsers(value);
    record.check();
    return record;
  }
};
var AppBskyUnspeccedGetSuggestedUsers = class _AppBskyUnspeccedGetSuggestedUsers {
  static nsid = "app.bsky.unspecced.getSuggestedUsers";
  static def = "main";
  static kind = "query";
  static http = "GET";
  static errorNames = [];
  category;
  limit;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({
      category: this["category"],
      limit: this["limit"]
    });
  }
  check() {
    const issues = [];
    if (this["limit"] != null) {
      if (!Number.isInteger(this["limit"])) issues.push({ path: "limit", message: "Must be an integer." });
      else if (this["limit"] < 1) issues.push({ path: "limit", message: "Must be at least 1." });
      else if (this["limit"] > 50) issues.push({ path: "limit", message: "Must be at most 50." });
    }
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _AppBskyUnspeccedGetSuggestedUsers.nsid,
      method: "GET",
      params: this.toParams(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyUnspeccedGetSuggestedUsers(value);
    record.check();
    return record;
  }
};
var AppBskyUnspeccedGetSuggestedUsersForDiscover = class _AppBskyUnspeccedGetSuggestedUsersForDiscover {
  static nsid = "app.bsky.unspecced.getSuggestedUsersForDiscover";
  static def = "main";
  static kind = "query";
  static http = "GET";
  static errorNames = [];
  limit;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({
      limit: this["limit"]
    });
  }
  check() {
    const issues = [];
    if (this["limit"] != null) {
      if (!Number.isInteger(this["limit"])) issues.push({ path: "limit", message: "Must be an integer." });
      else if (this["limit"] < 1) issues.push({ path: "limit", message: "Must be at least 1." });
      else if (this["limit"] > 50) issues.push({ path: "limit", message: "Must be at most 50." });
    }
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _AppBskyUnspeccedGetSuggestedUsersForDiscover.nsid,
      method: "GET",
      params: this.toParams(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyUnspeccedGetSuggestedUsersForDiscover(value);
    record.check();
    return record;
  }
};
var AppBskyUnspeccedGetSuggestedUsersForDiscoverSkeleton = class _AppBskyUnspeccedGetSuggestedUsersForDiscoverSkeleton {
  static nsid = "app.bsky.unspecced.getSuggestedUsersForDiscoverSkeleton";
  static def = "main";
  static kind = "query";
  static http = "GET";
  static errorNames = [];
  viewer;
  limit;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({
      viewer: this["viewer"],
      limit: this["limit"]
    });
  }
  check() {
    const issues = [];
    if (this["limit"] != null) {
      if (!Number.isInteger(this["limit"])) issues.push({ path: "limit", message: "Must be an integer." });
      else if (this["limit"] < 1) issues.push({ path: "limit", message: "Must be at least 1." });
      else if (this["limit"] > 50) issues.push({ path: "limit", message: "Must be at most 50." });
    }
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _AppBskyUnspeccedGetSuggestedUsersForDiscoverSkeleton.nsid,
      method: "GET",
      params: this.toParams(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyUnspeccedGetSuggestedUsersForDiscoverSkeleton(value);
    record.check();
    return record;
  }
};
var AppBskyUnspeccedGetSuggestedUsersForExplore = class _AppBskyUnspeccedGetSuggestedUsersForExplore {
  static nsid = "app.bsky.unspecced.getSuggestedUsersForExplore";
  static def = "main";
  static kind = "query";
  static http = "GET";
  static errorNames = [];
  category;
  limit;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({
      category: this["category"],
      limit: this["limit"]
    });
  }
  check() {
    const issues = [];
    if (this["limit"] != null) {
      if (!Number.isInteger(this["limit"])) issues.push({ path: "limit", message: "Must be an integer." });
      else if (this["limit"] < 1) issues.push({ path: "limit", message: "Must be at least 1." });
      else if (this["limit"] > 50) issues.push({ path: "limit", message: "Must be at most 50." });
    }
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _AppBskyUnspeccedGetSuggestedUsersForExplore.nsid,
      method: "GET",
      params: this.toParams(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyUnspeccedGetSuggestedUsersForExplore(value);
    record.check();
    return record;
  }
};
var AppBskyUnspeccedGetSuggestedUsersForExploreSkeleton = class _AppBskyUnspeccedGetSuggestedUsersForExploreSkeleton {
  static nsid = "app.bsky.unspecced.getSuggestedUsersForExploreSkeleton";
  static def = "main";
  static kind = "query";
  static http = "GET";
  static errorNames = [];
  viewer;
  category;
  limit;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({
      viewer: this["viewer"],
      category: this["category"],
      limit: this["limit"]
    });
  }
  check() {
    const issues = [];
    if (this["limit"] != null) {
      if (!Number.isInteger(this["limit"])) issues.push({ path: "limit", message: "Must be an integer." });
      else if (this["limit"] < 1) issues.push({ path: "limit", message: "Must be at least 1." });
      else if (this["limit"] > 50) issues.push({ path: "limit", message: "Must be at most 50." });
    }
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _AppBskyUnspeccedGetSuggestedUsersForExploreSkeleton.nsid,
      method: "GET",
      params: this.toParams(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyUnspeccedGetSuggestedUsersForExploreSkeleton(value);
    record.check();
    return record;
  }
};
var AppBskyUnspeccedGetSuggestedUsersForSeeMore = class _AppBskyUnspeccedGetSuggestedUsersForSeeMore {
  static nsid = "app.bsky.unspecced.getSuggestedUsersForSeeMore";
  static def = "main";
  static kind = "query";
  static http = "GET";
  static errorNames = [];
  category;
  limit;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({
      category: this["category"],
      limit: this["limit"]
    });
  }
  check() {
    const issues = [];
    if (this["limit"] != null) {
      if (!Number.isInteger(this["limit"])) issues.push({ path: "limit", message: "Must be an integer." });
      else if (this["limit"] < 1) issues.push({ path: "limit", message: "Must be at least 1." });
      else if (this["limit"] > 50) issues.push({ path: "limit", message: "Must be at most 50." });
    }
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _AppBskyUnspeccedGetSuggestedUsersForSeeMore.nsid,
      method: "GET",
      params: this.toParams(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyUnspeccedGetSuggestedUsersForSeeMore(value);
    record.check();
    return record;
  }
};
var AppBskyUnspeccedGetSuggestedUsersForSeeMoreSkeleton = class _AppBskyUnspeccedGetSuggestedUsersForSeeMoreSkeleton {
  static nsid = "app.bsky.unspecced.getSuggestedUsersForSeeMoreSkeleton";
  static def = "main";
  static kind = "query";
  static http = "GET";
  static errorNames = [];
  viewer;
  category;
  limit;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({
      viewer: this["viewer"],
      category: this["category"],
      limit: this["limit"]
    });
  }
  check() {
    const issues = [];
    if (this["limit"] != null) {
      if (!Number.isInteger(this["limit"])) issues.push({ path: "limit", message: "Must be an integer." });
      else if (this["limit"] < 1) issues.push({ path: "limit", message: "Must be at least 1." });
      else if (this["limit"] > 50) issues.push({ path: "limit", message: "Must be at most 50." });
    }
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _AppBskyUnspeccedGetSuggestedUsersForSeeMoreSkeleton.nsid,
      method: "GET",
      params: this.toParams(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyUnspeccedGetSuggestedUsersForSeeMoreSkeleton(value);
    record.check();
    return record;
  }
};
var AppBskyUnspeccedGetSuggestedUsersSkeleton = class _AppBskyUnspeccedGetSuggestedUsersSkeleton {
  static nsid = "app.bsky.unspecced.getSuggestedUsersSkeleton";
  static def = "main";
  static kind = "query";
  static http = "GET";
  static errorNames = [];
  viewer;
  category;
  limit;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({
      viewer: this["viewer"],
      category: this["category"],
      limit: this["limit"]
    });
  }
  check() {
    const issues = [];
    if (this["limit"] != null) {
      if (!Number.isInteger(this["limit"])) issues.push({ path: "limit", message: "Must be an integer." });
      else if (this["limit"] < 1) issues.push({ path: "limit", message: "Must be at least 1." });
      else if (this["limit"] > 50) issues.push({ path: "limit", message: "Must be at most 50." });
    }
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _AppBskyUnspeccedGetSuggestedUsersSkeleton.nsid,
      method: "GET",
      params: this.toParams(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyUnspeccedGetSuggestedUsersSkeleton(value);
    record.check();
    return record;
  }
};
var AppBskyUnspeccedGetSuggestionsSkeleton = class _AppBskyUnspeccedGetSuggestionsSkeleton {
  static nsid = "app.bsky.unspecced.getSuggestionsSkeleton";
  static def = "main";
  static kind = "query";
  static http = "GET";
  static errorNames = [];
  viewer;
  limit;
  cursor;
  relativeToDid;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({
      viewer: this["viewer"],
      limit: this["limit"],
      cursor: this["cursor"],
      relativeToDid: this["relativeToDid"]
    });
  }
  check() {
    const issues = [];
    if (this["limit"] != null) {
      if (!Number.isInteger(this["limit"])) issues.push({ path: "limit", message: "Must be an integer." });
      else if (this["limit"] < 1) issues.push({ path: "limit", message: "Must be at least 1." });
      else if (this["limit"] > 100) issues.push({ path: "limit", message: "Must be at most 100." });
    }
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _AppBskyUnspeccedGetSuggestionsSkeleton.nsid,
      method: "GET",
      params: this.toParams(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyUnspeccedGetSuggestionsSkeleton(value);
    record.check();
    return record;
  }
};
var AppBskyUnspeccedGetTaggedSuggestions = class _AppBskyUnspeccedGetTaggedSuggestions {
  static nsid = "app.bsky.unspecced.getTaggedSuggestions";
  static def = "main";
  static kind = "query";
  static http = "GET";
  static errorNames = [];
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({});
  }
  check() {
    const issues = [];
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _AppBskyUnspeccedGetTaggedSuggestions.nsid,
      method: "GET",
      params: this.toParams(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyUnspeccedGetTaggedSuggestions(value);
    record.check();
    return record;
  }
};
var AppBskyUnspeccedGetTaggedSuggestionsSuggestion = class _AppBskyUnspeccedGetTaggedSuggestionsSuggestion {
  static nsid = "app.bsky.unspecced.getTaggedSuggestions";
  static def = "suggestion";
  static kind = "object";
  $type;
  tag;
  subjectType;
  subject;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.unspecced.getTaggedSuggestions#suggestion";
  }
  check() {
    const issues = [];
    if (this["tag"] == null) issues.push({ path: "tag", message: "Required." });
    if (this["subjectType"] == null) issues.push({ path: "subjectType", message: "Required." });
    if (this["subject"] == null) issues.push({ path: "subject", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      tag: this["tag"],
      subjectType: this["subjectType"],
      subject: this["subject"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyUnspeccedGetTaggedSuggestionsSuggestion(value);
    record.check();
    return record;
  }
};
var AppBskyUnspeccedGetTrendingTopics = class _AppBskyUnspeccedGetTrendingTopics {
  static nsid = "app.bsky.unspecced.getTrendingTopics";
  static def = "main";
  static kind = "query";
  static http = "GET";
  static errorNames = [];
  viewer;
  limit;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({
      viewer: this["viewer"],
      limit: this["limit"]
    });
  }
  check() {
    const issues = [];
    if (this["limit"] != null) {
      if (!Number.isInteger(this["limit"])) issues.push({ path: "limit", message: "Must be an integer." });
      else if (this["limit"] < 1) issues.push({ path: "limit", message: "Must be at least 1." });
      else if (this["limit"] > 25) issues.push({ path: "limit", message: "Must be at most 25." });
    }
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _AppBskyUnspeccedGetTrendingTopics.nsid,
      method: "GET",
      params: this.toParams(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyUnspeccedGetTrendingTopics(value);
    record.check();
    return record;
  }
};
var AppBskyUnspeccedGetTrends = class _AppBskyUnspeccedGetTrends {
  static nsid = "app.bsky.unspecced.getTrends";
  static def = "main";
  static kind = "query";
  static http = "GET";
  static errorNames = [];
  limit;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({
      limit: this["limit"]
    });
  }
  check() {
    const issues = [];
    if (this["limit"] != null) {
      if (!Number.isInteger(this["limit"])) issues.push({ path: "limit", message: "Must be an integer." });
      else if (this["limit"] < 1) issues.push({ path: "limit", message: "Must be at least 1." });
      else if (this["limit"] > 25) issues.push({ path: "limit", message: "Must be at most 25." });
    }
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _AppBskyUnspeccedGetTrends.nsid,
      method: "GET",
      params: this.toParams(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyUnspeccedGetTrends(value);
    record.check();
    return record;
  }
};
var AppBskyUnspeccedGetTrendsSkeleton = class _AppBskyUnspeccedGetTrendsSkeleton {
  static nsid = "app.bsky.unspecced.getTrendsSkeleton";
  static def = "main";
  static kind = "query";
  static http = "GET";
  static errorNames = [];
  viewer;
  limit;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({
      viewer: this["viewer"],
      limit: this["limit"]
    });
  }
  check() {
    const issues = [];
    if (this["limit"] != null) {
      if (!Number.isInteger(this["limit"])) issues.push({ path: "limit", message: "Must be an integer." });
      else if (this["limit"] < 1) issues.push({ path: "limit", message: "Must be at least 1." });
      else if (this["limit"] > 25) issues.push({ path: "limit", message: "Must be at most 25." });
    }
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _AppBskyUnspeccedGetTrendsSkeleton.nsid,
      method: "GET",
      params: this.toParams(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyUnspeccedGetTrendsSkeleton(value);
    record.check();
    return record;
  }
};
var AppBskyUnspeccedInitAgeAssurance = class _AppBskyUnspeccedInitAgeAssurance {
  static nsid = "app.bsky.unspecced.initAgeAssurance";
  static def = "main";
  static kind = "procedure";
  static http = "POST";
  static errorNames = ["InvalidEmail", "DidTooLong", "InvalidInitiation"];
  email;
  language;
  countryCode;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({});
  }
  toBody() {
    return jsonOf({
      email: this["email"],
      language: this["language"],
      countryCode: this["countryCode"]
    });
  }
  check() {
    const issues = [];
    if (this["email"] == null) issues.push({ path: "email", message: "Required." });
    if (this["language"] == null) issues.push({ path: "language", message: "Required." });
    if (this["countryCode"] == null) issues.push({ path: "countryCode", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _AppBskyUnspeccedInitAgeAssurance.nsid,
      method: "POST",
      params: this.toParams(),
      body: this.toBody(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyUnspeccedInitAgeAssurance(value);
    record.check();
    return record;
  }
};
var AppBskyUnspeccedSearchActorsSkeleton = class _AppBskyUnspeccedSearchActorsSkeleton {
  static nsid = "app.bsky.unspecced.searchActorsSkeleton";
  static def = "main";
  static kind = "query";
  static http = "GET";
  static errorNames = ["BadQueryString"];
  q;
  viewer;
  typeahead;
  limit;
  cursor;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({
      q: this["q"],
      viewer: this["viewer"],
      typeahead: this["typeahead"],
      limit: this["limit"],
      cursor: this["cursor"]
    });
  }
  check() {
    const issues = [];
    if (this["q"] == null) issues.push({ path: "q", message: "Required." });
    if (this["limit"] != null) {
      if (!Number.isInteger(this["limit"])) issues.push({ path: "limit", message: "Must be an integer." });
      else if (this["limit"] < 1) issues.push({ path: "limit", message: "Must be at least 1." });
      else if (this["limit"] > 100) issues.push({ path: "limit", message: "Must be at most 100." });
    }
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _AppBskyUnspeccedSearchActorsSkeleton.nsid,
      method: "GET",
      params: this.toParams(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyUnspeccedSearchActorsSkeleton(value);
    record.check();
    return record;
  }
};
var AppBskyUnspeccedSearchPostsSkeleton = class _AppBskyUnspeccedSearchPostsSkeleton {
  static nsid = "app.bsky.unspecced.searchPostsSkeleton";
  static def = "main";
  static kind = "query";
  static http = "GET";
  static errorNames = ["BadQueryString"];
  q;
  sort;
  since;
  until;
  mentions;
  author;
  lang;
  domain;
  url;
  tag;
  viewer;
  limit;
  cursor;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({
      q: this["q"],
      sort: this["sort"],
      since: this["since"],
      until: this["until"],
      mentions: this["mentions"],
      author: this["author"],
      lang: this["lang"],
      domain: this["domain"],
      url: this["url"],
      tag: this["tag"],
      viewer: this["viewer"],
      limit: this["limit"],
      cursor: this["cursor"]
    });
  }
  check() {
    const issues = [];
    if (this["q"] == null) issues.push({ path: "q", message: "Required." });
    if (this["limit"] != null) {
      if (!Number.isInteger(this["limit"])) issues.push({ path: "limit", message: "Must be an integer." });
      else if (this["limit"] < 1) issues.push({ path: "limit", message: "Must be at least 1." });
      else if (this["limit"] > 100) issues.push({ path: "limit", message: "Must be at most 100." });
    }
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _AppBskyUnspeccedSearchPostsSkeleton.nsid,
      method: "GET",
      params: this.toParams(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyUnspeccedSearchPostsSkeleton(value);
    record.check();
    return record;
  }
};
var AppBskyUnspeccedSearchStarterPacksSkeleton = class _AppBskyUnspeccedSearchStarterPacksSkeleton {
  static nsid = "app.bsky.unspecced.searchStarterPacksSkeleton";
  static def = "main";
  static kind = "query";
  static http = "GET";
  static errorNames = ["BadQueryString"];
  q;
  viewer;
  limit;
  cursor;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({
      q: this["q"],
      viewer: this["viewer"],
      limit: this["limit"],
      cursor: this["cursor"]
    });
  }
  check() {
    const issues = [];
    if (this["q"] == null) issues.push({ path: "q", message: "Required." });
    if (this["limit"] != null) {
      if (!Number.isInteger(this["limit"])) issues.push({ path: "limit", message: "Must be an integer." });
      else if (this["limit"] < 1) issues.push({ path: "limit", message: "Must be at least 1." });
      else if (this["limit"] > 100) issues.push({ path: "limit", message: "Must be at most 100." });
    }
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _AppBskyUnspeccedSearchStarterPacksSkeleton.nsid,
      method: "GET",
      params: this.toParams(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyUnspeccedSearchStarterPacksSkeleton(value);
    record.check();
    return record;
  }
};
var AppBskyVideoAbortUpload = class _AppBskyVideoAbortUpload {
  static nsid = "app.bsky.video.abortUpload";
  static def = "main";
  static kind = "procedure";
  static http = "POST";
  static errorNames = ["UploadNotFound", "UploadNotReady"];
  jobId;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({});
  }
  toBody() {
    return jsonOf({
      jobId: this["jobId"]
    });
  }
  check() {
    const issues = [];
    if (this["jobId"] == null) issues.push({ path: "jobId", message: "Required." });
    if (typeof this["jobId"] === "string" && this["jobId"].length > 256) issues.push({ path: "jobId", message: "Must be at most 256 characters." });
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _AppBskyVideoAbortUpload.nsid,
      method: "POST",
      params: this.toParams(),
      body: this.toBody(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyVideoAbortUpload(value);
    record.check();
    return record;
  }
};
var AppBskyVideoDefsJobStatus = class _AppBskyVideoDefsJobStatus {
  static nsid = "app.bsky.video.defs";
  static def = "jobStatus";
  static kind = "object";
  $type;
  jobId;
  did;
  state;
  progress;
  blob;
  error;
  failureCode;
  message;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "app.bsky.video.defs#jobStatus";
  }
  check() {
    const issues = [];
    if (this["jobId"] == null) issues.push({ path: "jobId", message: "Required." });
    if (this["did"] == null) issues.push({ path: "did", message: "Required." });
    if (this["state"] == null) issues.push({ path: "state", message: "Required." });
    if (this["progress"] != null) {
      if (!Number.isInteger(this["progress"])) issues.push({ path: "progress", message: "Must be an integer." });
      else if (this["progress"] < 0) issues.push({ path: "progress", message: "Must be at least 0." });
      else if (this["progress"] > 100) issues.push({ path: "progress", message: "Must be at most 100." });
    }
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      jobId: this["jobId"],
      did: this["did"],
      state: this["state"],
      progress: this["progress"],
      blob: this["blob"],
      error: this["error"],
      failureCode: this["failureCode"],
      message: this["message"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyVideoDefsJobStatus(value);
    record.check();
    return record;
  }
};
var AppBskyVideoFinishUpload = class _AppBskyVideoFinishUpload {
  static nsid = "app.bsky.video.finishUpload";
  static def = "main";
  static kind = "procedure";
  static http = "POST";
  static errorNames = ["UploadNotFound", "UploadExpired", "MissingParts", "UploadNotReady", "UnsupportedContentType", "UploadFailed", "UploadAborted", "ServiceOverloaded"];
  jobId;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({});
  }
  toBody() {
    return jsonOf({
      jobId: this["jobId"]
    });
  }
  check() {
    const issues = [];
    if (this["jobId"] == null) issues.push({ path: "jobId", message: "Required." });
    if (typeof this["jobId"] === "string" && this["jobId"].length > 256) issues.push({ path: "jobId", message: "Must be at most 256 characters." });
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _AppBskyVideoFinishUpload.nsid,
      method: "POST",
      params: this.toParams(),
      body: this.toBody(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyVideoFinishUpload(value);
    record.check();
    return record;
  }
};
var AppBskyVideoGetJobStatus = class _AppBskyVideoGetJobStatus {
  static nsid = "app.bsky.video.getJobStatus";
  static def = "main";
  static kind = "query";
  static http = "GET";
  static errorNames = [];
  jobId;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({
      jobId: this["jobId"]
    });
  }
  check() {
    const issues = [];
    if (this["jobId"] == null) issues.push({ path: "jobId", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _AppBskyVideoGetJobStatus.nsid,
      method: "GET",
      params: this.toParams(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyVideoGetJobStatus(value);
    record.check();
    return record;
  }
};
var AppBskyVideoGetUploadLimits = class _AppBskyVideoGetUploadLimits {
  static nsid = "app.bsky.video.getUploadLimits";
  static def = "main";
  static kind = "query";
  static http = "GET";
  static errorNames = [];
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({});
  }
  check() {
    const issues = [];
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _AppBskyVideoGetUploadLimits.nsid,
      method: "GET",
      params: this.toParams(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyVideoGetUploadLimits(value);
    record.check();
    return record;
  }
};
var AppBskyVideoGetUploadStatus = class _AppBskyVideoGetUploadStatus {
  static nsid = "app.bsky.video.getUploadStatus";
  static def = "main";
  static kind = "query";
  static http = "GET";
  static errorNames = ["UploadNotFound"];
  jobId;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({
      jobId: this["jobId"]
    });
  }
  check() {
    const issues = [];
    if (this["jobId"] == null) issues.push({ path: "jobId", message: "Required." });
    if (typeof this["jobId"] === "string" && this["jobId"].length > 256) issues.push({ path: "jobId", message: "Must be at most 256 characters." });
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _AppBskyVideoGetUploadStatus.nsid,
      method: "GET",
      params: this.toParams(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyVideoGetUploadStatus(value);
    record.check();
    return record;
  }
};
var AppBskyVideoStartUpload = class _AppBskyVideoStartUpload {
  static nsid = "app.bsky.video.startUpload";
  static def = "main";
  static kind = "procedure";
  static http = "POST";
  static errorNames = ["UnsupportedContentType", "VideoTooLarge", "VideoTooLong", "BadAspectRatio", "DailyLimitExceeded", "TooManyOpenUploads", "UploadForbidden", "ServiceOverloaded"];
  sizeBytes;
  mimeType;
  name;
  durationMs;
  width;
  height;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({});
  }
  toBody() {
    return jsonOf({
      sizeBytes: this["sizeBytes"],
      mimeType: this["mimeType"],
      name: this["name"],
      durationMs: this["durationMs"],
      width: this["width"],
      height: this["height"]
    });
  }
  check() {
    const issues = [];
    if (this["sizeBytes"] == null) issues.push({ path: "sizeBytes", message: "Required." });
    if (this["sizeBytes"] != null) {
      if (!Number.isInteger(this["sizeBytes"])) issues.push({ path: "sizeBytes", message: "Must be an integer." });
      else if (this["sizeBytes"] < 1) issues.push({ path: "sizeBytes", message: "Must be at least 1." });
    }
    if (this["mimeType"] == null) issues.push({ path: "mimeType", message: "Required." });
    if (typeof this["mimeType"] === "string" && this["mimeType"].length > 255) issues.push({ path: "mimeType", message: "Must be at most 255 characters." });
    if (typeof this["name"] === "string" && this["name"].length > 256) issues.push({ path: "name", message: "Must be at most 256 characters." });
    if (this["durationMs"] != null) {
      if (!Number.isInteger(this["durationMs"])) issues.push({ path: "durationMs", message: "Must be an integer." });
    }
    if (this["width"] != null) {
      if (!Number.isInteger(this["width"])) issues.push({ path: "width", message: "Must be an integer." });
    }
    if (this["height"] != null) {
      if (!Number.isInteger(this["height"])) issues.push({ path: "height", message: "Must be an integer." });
    }
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _AppBskyVideoStartUpload.nsid,
      method: "POST",
      params: this.toParams(),
      body: this.toBody(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyVideoStartUpload(value);
    record.check();
    return record;
  }
};
var AppBskyVideoUploadPart = class _AppBskyVideoUploadPart {
  static nsid = "app.bsky.video.uploadPart";
  static def = "main";
  static kind = "procedure";
  static http = "POST";
  static errorNames = ["UploadNotFound", "UploadExpired", "InvalidPartNumber", "PartSizeMismatch", "UploadNotReady", "UploadFailed", "UploadAborted", "UploadAlreadyCompleted", "ServiceOverloaded"];
  jobId;
  partNumber;
  payload;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({
      jobId: this["jobId"],
      partNumber: this["partNumber"]
    });
  }
  check() {
    const issues = [];
    if (this["jobId"] == null) issues.push({ path: "jobId", message: "Required." });
    if (typeof this["jobId"] === "string" && this["jobId"].length > 256) issues.push({ path: "jobId", message: "Must be at most 256 characters." });
    if (this["partNumber"] == null) issues.push({ path: "partNumber", message: "Required." });
    if (this["partNumber"] != null) {
      if (!Number.isInteger(this["partNumber"])) issues.push({ path: "partNumber", message: "Must be an integer." });
      else if (this["partNumber"] < 1) issues.push({ path: "partNumber", message: "Must be at least 1." });
    }
    if (this["payload"] == null) issues.push({ path: "payload", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _AppBskyVideoUploadPart.nsid,
      method: "POST",
      params: this.toParams(),
      blob: this.payload,
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyVideoUploadPart(value);
    record.check();
    return record;
  }
};
var AppBskyVideoUploadVideo = class _AppBskyVideoUploadVideo {
  static nsid = "app.bsky.video.uploadVideo";
  static def = "main";
  static kind = "procedure";
  static http = "POST";
  static errorNames = [];
  payload;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({});
  }
  check() {
    const issues = [];
    if (this["payload"] == null) issues.push({ path: "payload", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _AppBskyVideoUploadVideo.nsid,
      method: "POST",
      params: this.toParams(),
      blob: this.payload,
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _AppBskyVideoUploadVideo(value);
    record.check();
    return record;
  }
};
var ChatBskyActorDeclaration = class _ChatBskyActorDeclaration {
  static nsid = "chat.bsky.actor.declaration";
  static def = "main";
  static kind = "record";
  static recordKey = "literal:self";
  $type;
  allowIncoming;
  allowGroupInvites;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "chat.bsky.actor.declaration";
  }
  check() {
    const issues = [];
    if (this["allowIncoming"] == null) issues.push({ path: "allowIncoming", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      allowIncoming: this["allowIncoming"],
      allowGroupInvites: this["allowGroupInvites"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ChatBskyActorDeclaration(value);
    record.check();
    return record;
  }
};
var ChatBskyActorDefsDirectConvoMember = class _ChatBskyActorDefsDirectConvoMember {
  static nsid = "chat.bsky.actor.defs";
  static def = "directConvoMember";
  static kind = "object";
  $type;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "chat.bsky.actor.defs#directConvoMember";
  }
  check() {
    const issues = [];
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ChatBskyActorDefsDirectConvoMember(value);
    record.check();
    return record;
  }
};
var ChatBskyActorDefsGroupConvoMember = class _ChatBskyActorDefsGroupConvoMember {
  static nsid = "chat.bsky.actor.defs";
  static def = "groupConvoMember";
  static kind = "object";
  $type;
  addedBy;
  role;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "chat.bsky.actor.defs#groupConvoMember";
  }
  check() {
    const issues = [];
    if (this["role"] == null) issues.push({ path: "role", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      addedBy: this["addedBy"],
      role: this["role"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ChatBskyActorDefsGroupConvoMember(value);
    record.check();
    return record;
  }
};
var ChatBskyActorDefsMemberRole = class _ChatBskyActorDefsMemberRole {
  static nsid = "chat.bsky.actor.defs";
  static def = "memberRole";
  static kind = "string";
  static knownValues = ["owner", "standard"];
  static includes(value) {
    return _ChatBskyActorDefsMemberRole.knownValues.includes(value);
  }
  constructor() {
  }
};
var ChatBskyActorDefsPastGroupConvoMember = class _ChatBskyActorDefsPastGroupConvoMember {
  static nsid = "chat.bsky.actor.defs";
  static def = "pastGroupConvoMember";
  static kind = "object";
  $type;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "chat.bsky.actor.defs#pastGroupConvoMember";
  }
  check() {
    const issues = [];
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ChatBskyActorDefsPastGroupConvoMember(value);
    record.check();
    return record;
  }
};
var ChatBskyActorDefsProfileViewBasic = class _ChatBskyActorDefsProfileViewBasic {
  static nsid = "chat.bsky.actor.defs";
  static def = "profileViewBasic";
  static kind = "object";
  $type;
  did;
  handle;
  displayName;
  avatar;
  associated;
  viewer;
  labels;
  createdAt;
  chatDisabled;
  verification;
  kind;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "chat.bsky.actor.defs#profileViewBasic";
  }
  check() {
    const issues = [];
    if (this["did"] == null) issues.push({ path: "did", message: "Required." });
    if (this["handle"] == null) issues.push({ path: "handle", message: "Required." });
    if (typeof this["displayName"] === "string" && this["displayName"].length > 640) issues.push({ path: "displayName", message: "Must be at most 640 characters." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      did: this["did"],
      handle: this["handle"],
      displayName: this["displayName"],
      avatar: this["avatar"],
      associated: this["associated"],
      viewer: this["viewer"],
      labels: this["labels"],
      createdAt: this["createdAt"],
      chatDisabled: this["chatDisabled"],
      verification: this["verification"],
      kind: this["kind"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ChatBskyActorDefsProfileViewBasic(value);
    record.check();
    return record;
  }
};
var ChatBskyActorDeleteAccount = class _ChatBskyActorDeleteAccount {
  static nsid = "chat.bsky.actor.deleteAccount";
  static def = "main";
  static kind = "procedure";
  static http = "POST";
  static errorNames = [];
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({});
  }
  check() {
    const issues = [];
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _ChatBskyActorDeleteAccount.nsid,
      method: "POST",
      params: this.toParams(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ChatBskyActorDeleteAccount(value);
    record.check();
    return record;
  }
};
var ChatBskyActorExportAccountData = class _ChatBskyActorExportAccountData {
  static nsid = "chat.bsky.actor.exportAccountData";
  static def = "main";
  static kind = "query";
  static http = "GET";
  static errorNames = [];
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({});
  }
  check() {
    const issues = [];
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _ChatBskyActorExportAccountData.nsid,
      method: "GET",
      params: this.toParams(),
      raw: true,
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ChatBskyActorExportAccountData(value);
    record.check();
    return record;
  }
};
var ChatBskyActorGetStatus = class _ChatBskyActorGetStatus {
  static nsid = "chat.bsky.actor.getStatus";
  static def = "main";
  static kind = "query";
  static http = "GET";
  static errorNames = [];
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({});
  }
  check() {
    const issues = [];
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _ChatBskyActorGetStatus.nsid,
      method: "GET",
      params: this.toParams(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ChatBskyActorGetStatus(value);
    record.check();
    return record;
  }
};
var ChatBskyConvoAcceptConvo = class _ChatBskyConvoAcceptConvo {
  static nsid = "chat.bsky.convo.acceptConvo";
  static def = "main";
  static kind = "procedure";
  static http = "POST";
  static errorNames = ["InvalidConvo"];
  convoId;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({});
  }
  toBody() {
    return jsonOf({
      convoId: this["convoId"]
    });
  }
  check() {
    const issues = [];
    if (this["convoId"] == null) issues.push({ path: "convoId", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _ChatBskyConvoAcceptConvo.nsid,
      method: "POST",
      params: this.toParams(),
      body: this.toBody(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ChatBskyConvoAcceptConvo(value);
    record.check();
    return record;
  }
};
var ChatBskyConvoAddReaction = class _ChatBskyConvoAddReaction {
  static nsid = "chat.bsky.convo.addReaction";
  static def = "main";
  static kind = "procedure";
  static http = "POST";
  static errorNames = ["InvalidConvo", "ReactionNotAllowed", "ReactionMessageDeleted", "ReactionLimitReached", "ReactionInvalidValue"];
  convoId;
  messageId;
  value;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({});
  }
  toBody() {
    return jsonOf({
      convoId: this["convoId"],
      messageId: this["messageId"],
      value: this["value"]
    });
  }
  check() {
    const issues = [];
    if (this["convoId"] == null) issues.push({ path: "convoId", message: "Required." });
    if (this["messageId"] == null) issues.push({ path: "messageId", message: "Required." });
    if (this["value"] == null) issues.push({ path: "value", message: "Required." });
    if (typeof this["value"] === "string" && this["value"].length > 64) issues.push({ path: "value", message: "Must be at most 64 characters." });
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _ChatBskyConvoAddReaction.nsid,
      method: "POST",
      params: this.toParams(),
      body: this.toBody(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ChatBskyConvoAddReaction(value);
    record.check();
    return record;
  }
};
var ChatBskyConvoDefsConvoKind = class _ChatBskyConvoDefsConvoKind {
  static nsid = "chat.bsky.convo.defs";
  static def = "convoKind";
  static kind = "string";
  static knownValues = ["direct", "group"];
  static includes(value) {
    return _ChatBskyConvoDefsConvoKind.knownValues.includes(value);
  }
  constructor() {
  }
};
var ChatBskyConvoDefsConvoLockStatus = class _ChatBskyConvoDefsConvoLockStatus {
  static nsid = "chat.bsky.convo.defs";
  static def = "convoLockStatus";
  static kind = "string";
  static knownValues = ["unlocked", "locked", "locked-permanently"];
  static includes(value) {
    return _ChatBskyConvoDefsConvoLockStatus.knownValues.includes(value);
  }
  constructor() {
  }
};
var ChatBskyConvoDefsConvoRef = class _ChatBskyConvoDefsConvoRef {
  static nsid = "chat.bsky.convo.defs";
  static def = "convoRef";
  static kind = "object";
  $type;
  did;
  convoId;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "chat.bsky.convo.defs#convoRef";
  }
  check() {
    const issues = [];
    if (this["did"] == null) issues.push({ path: "did", message: "Required." });
    if (this["convoId"] == null) issues.push({ path: "convoId", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      did: this["did"],
      convoId: this["convoId"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ChatBskyConvoDefsConvoRef(value);
    record.check();
    return record;
  }
};
var ChatBskyConvoDefsConvoStatus = class _ChatBskyConvoDefsConvoStatus {
  static nsid = "chat.bsky.convo.defs";
  static def = "convoStatus";
  static kind = "string";
  static knownValues = ["request", "accepted"];
  static includes(value) {
    return _ChatBskyConvoDefsConvoStatus.knownValues.includes(value);
  }
  constructor() {
  }
};
var ChatBskyConvoDefsConvoView = class _ChatBskyConvoDefsConvoView {
  static nsid = "chat.bsky.convo.defs";
  static def = "convoView";
  static kind = "object";
  $type;
  id;
  rev;
  members;
  lastMessage;
  lastReaction;
  muted;
  status;
  unreadCount;
  kind;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "chat.bsky.convo.defs#convoView";
  }
  check() {
    const issues = [];
    if (this["id"] == null) issues.push({ path: "id", message: "Required." });
    if (this["rev"] == null) issues.push({ path: "rev", message: "Required." });
    if (this["members"] == null) issues.push({ path: "members", message: "Required." });
    if (this["muted"] == null) issues.push({ path: "muted", message: "Required." });
    if (this["unreadCount"] == null) issues.push({ path: "unreadCount", message: "Required." });
    if (this["unreadCount"] != null) {
      if (!Number.isInteger(this["unreadCount"])) issues.push({ path: "unreadCount", message: "Must be an integer." });
    }
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      id: this["id"],
      rev: this["rev"],
      members: this["members"],
      lastMessage: this["lastMessage"],
      lastReaction: this["lastReaction"],
      muted: this["muted"],
      status: this["status"],
      unreadCount: this["unreadCount"],
      kind: this["kind"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ChatBskyConvoDefsConvoView(value);
    record.check();
    return record;
  }
};
var ChatBskyConvoDefsDeletedMessageView = class _ChatBskyConvoDefsDeletedMessageView {
  static nsid = "chat.bsky.convo.defs";
  static def = "deletedMessageView";
  static kind = "object";
  $type;
  id;
  rev;
  sender;
  sentAt;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "chat.bsky.convo.defs#deletedMessageView";
  }
  check() {
    const issues = [];
    if (this["id"] == null) issues.push({ path: "id", message: "Required." });
    if (this["rev"] == null) issues.push({ path: "rev", message: "Required." });
    if (this["sender"] == null) issues.push({ path: "sender", message: "Required." });
    if (this["sentAt"] == null) issues.push({ path: "sentAt", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      id: this["id"],
      rev: this["rev"],
      sender: this["sender"],
      sentAt: this["sentAt"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ChatBskyConvoDefsDeletedMessageView(value);
    record.check();
    return record;
  }
};
var ChatBskyConvoDefsDirectConvo = class _ChatBskyConvoDefsDirectConvo {
  static nsid = "chat.bsky.convo.defs";
  static def = "directConvo";
  static kind = "object";
  $type;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "chat.bsky.convo.defs#directConvo";
  }
  check() {
    const issues = [];
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ChatBskyConvoDefsDirectConvo(value);
    record.check();
    return record;
  }
};
var ChatBskyConvoDefsGroupConvo = class _ChatBskyConvoDefsGroupConvo {
  static nsid = "chat.bsky.convo.defs";
  static def = "groupConvo";
  static kind = "object";
  $type;
  createdAt;
  joinLink;
  joinRequestCount;
  lockStatus;
  lockStatusModerationOverride;
  memberCount;
  memberLimit;
  name;
  unreadJoinRequestCount;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "chat.bsky.convo.defs#groupConvo";
  }
  check() {
    const issues = [];
    if (this["createdAt"] == null) issues.push({ path: "createdAt", message: "Required." });
    if (this["joinRequestCount"] != null) {
      if (!Number.isInteger(this["joinRequestCount"])) issues.push({ path: "joinRequestCount", message: "Must be an integer." });
    }
    if (this["lockStatus"] == null) issues.push({ path: "lockStatus", message: "Required." });
    if (this["lockStatusModerationOverride"] == null) issues.push({ path: "lockStatusModerationOverride", message: "Required." });
    if (this["memberCount"] == null) issues.push({ path: "memberCount", message: "Required." });
    if (this["memberCount"] != null) {
      if (!Number.isInteger(this["memberCount"])) issues.push({ path: "memberCount", message: "Must be an integer." });
    }
    if (this["memberLimit"] == null) issues.push({ path: "memberLimit", message: "Required." });
    if (this["memberLimit"] != null) {
      if (!Number.isInteger(this["memberLimit"])) issues.push({ path: "memberLimit", message: "Must be an integer." });
    }
    if (this["name"] == null) issues.push({ path: "name", message: "Required." });
    if (typeof this["name"] === "string" && this["name"].length > 500) issues.push({ path: "name", message: "Must be at most 500 characters." });
    if (this["unreadJoinRequestCount"] != null) {
      if (!Number.isInteger(this["unreadJoinRequestCount"])) issues.push({ path: "unreadJoinRequestCount", message: "Must be an integer." });
    }
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      createdAt: this["createdAt"],
      joinLink: this["joinLink"],
      joinRequestCount: this["joinRequestCount"],
      lockStatus: this["lockStatus"],
      lockStatusModerationOverride: this["lockStatusModerationOverride"],
      memberCount: this["memberCount"],
      memberLimit: this["memberLimit"],
      name: this["name"],
      unreadJoinRequestCount: this["unreadJoinRequestCount"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ChatBskyConvoDefsGroupConvo(value);
    record.check();
    return record;
  }
};
var ChatBskyConvoDefsLogAcceptConvo = class _ChatBskyConvoDefsLogAcceptConvo {
  static nsid = "chat.bsky.convo.defs";
  static def = "logAcceptConvo";
  static kind = "object";
  $type;
  rev;
  convoId;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "chat.bsky.convo.defs#logAcceptConvo";
  }
  check() {
    const issues = [];
    if (this["rev"] == null) issues.push({ path: "rev", message: "Required." });
    if (this["convoId"] == null) issues.push({ path: "convoId", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      rev: this["rev"],
      convoId: this["convoId"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ChatBskyConvoDefsLogAcceptConvo(value);
    record.check();
    return record;
  }
};
var ChatBskyConvoDefsLogAddMember = class _ChatBskyConvoDefsLogAddMember {
  static nsid = "chat.bsky.convo.defs";
  static def = "logAddMember";
  static kind = "object";
  $type;
  rev;
  convoId;
  message;
  relatedProfiles;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "chat.bsky.convo.defs#logAddMember";
  }
  check() {
    const issues = [];
    if (this["rev"] == null) issues.push({ path: "rev", message: "Required." });
    if (this["convoId"] == null) issues.push({ path: "convoId", message: "Required." });
    if (this["message"] == null) issues.push({ path: "message", message: "Required." });
    if (this["relatedProfiles"] == null) issues.push({ path: "relatedProfiles", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      rev: this["rev"],
      convoId: this["convoId"],
      message: this["message"],
      relatedProfiles: this["relatedProfiles"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ChatBskyConvoDefsLogAddMember(value);
    record.check();
    return record;
  }
};
var ChatBskyConvoDefsLogAddReaction = class _ChatBskyConvoDefsLogAddReaction {
  static nsid = "chat.bsky.convo.defs";
  static def = "logAddReaction";
  static kind = "object";
  $type;
  rev;
  convoId;
  message;
  reaction;
  relatedProfiles;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "chat.bsky.convo.defs#logAddReaction";
  }
  check() {
    const issues = [];
    if (this["rev"] == null) issues.push({ path: "rev", message: "Required." });
    if (this["convoId"] == null) issues.push({ path: "convoId", message: "Required." });
    if (this["message"] == null) issues.push({ path: "message", message: "Required." });
    if (this["reaction"] == null) issues.push({ path: "reaction", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      rev: this["rev"],
      convoId: this["convoId"],
      message: this["message"],
      reaction: this["reaction"],
      relatedProfiles: this["relatedProfiles"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ChatBskyConvoDefsLogAddReaction(value);
    record.check();
    return record;
  }
};
var ChatBskyConvoDefsLogApproveJoinRequest = class _ChatBskyConvoDefsLogApproveJoinRequest {
  static nsid = "chat.bsky.convo.defs";
  static def = "logApproveJoinRequest";
  static kind = "object";
  $type;
  rev;
  convoId;
  member;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "chat.bsky.convo.defs#logApproveJoinRequest";
  }
  check() {
    const issues = [];
    if (this["rev"] == null) issues.push({ path: "rev", message: "Required." });
    if (this["convoId"] == null) issues.push({ path: "convoId", message: "Required." });
    if (this["member"] == null) issues.push({ path: "member", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      rev: this["rev"],
      convoId: this["convoId"],
      member: this["member"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ChatBskyConvoDefsLogApproveJoinRequest(value);
    record.check();
    return record;
  }
};
var ChatBskyConvoDefsLogBeginConvo = class _ChatBskyConvoDefsLogBeginConvo {
  static nsid = "chat.bsky.convo.defs";
  static def = "logBeginConvo";
  static kind = "object";
  $type;
  rev;
  convoId;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "chat.bsky.convo.defs#logBeginConvo";
  }
  check() {
    const issues = [];
    if (this["rev"] == null) issues.push({ path: "rev", message: "Required." });
    if (this["convoId"] == null) issues.push({ path: "convoId", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      rev: this["rev"],
      convoId: this["convoId"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ChatBskyConvoDefsLogBeginConvo(value);
    record.check();
    return record;
  }
};
var ChatBskyConvoDefsLogCreateJoinLink = class _ChatBskyConvoDefsLogCreateJoinLink {
  static nsid = "chat.bsky.convo.defs";
  static def = "logCreateJoinLink";
  static kind = "object";
  $type;
  rev;
  convoId;
  message;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "chat.bsky.convo.defs#logCreateJoinLink";
  }
  check() {
    const issues = [];
    if (this["rev"] == null) issues.push({ path: "rev", message: "Required." });
    if (this["convoId"] == null) issues.push({ path: "convoId", message: "Required." });
    if (this["message"] == null) issues.push({ path: "message", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      rev: this["rev"],
      convoId: this["convoId"],
      message: this["message"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ChatBskyConvoDefsLogCreateJoinLink(value);
    record.check();
    return record;
  }
};
var ChatBskyConvoDefsLogCreateMessage = class _ChatBskyConvoDefsLogCreateMessage {
  static nsid = "chat.bsky.convo.defs";
  static def = "logCreateMessage";
  static kind = "object";
  $type;
  rev;
  convoId;
  message;
  relatedProfiles;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "chat.bsky.convo.defs#logCreateMessage";
  }
  check() {
    const issues = [];
    if (this["rev"] == null) issues.push({ path: "rev", message: "Required." });
    if (this["convoId"] == null) issues.push({ path: "convoId", message: "Required." });
    if (this["message"] == null) issues.push({ path: "message", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      rev: this["rev"],
      convoId: this["convoId"],
      message: this["message"],
      relatedProfiles: this["relatedProfiles"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ChatBskyConvoDefsLogCreateMessage(value);
    record.check();
    return record;
  }
};
var ChatBskyConvoDefsLogDeleteMessage = class _ChatBskyConvoDefsLogDeleteMessage {
  static nsid = "chat.bsky.convo.defs";
  static def = "logDeleteMessage";
  static kind = "object";
  $type;
  rev;
  convoId;
  message;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "chat.bsky.convo.defs#logDeleteMessage";
  }
  check() {
    const issues = [];
    if (this["rev"] == null) issues.push({ path: "rev", message: "Required." });
    if (this["convoId"] == null) issues.push({ path: "convoId", message: "Required." });
    if (this["message"] == null) issues.push({ path: "message", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      rev: this["rev"],
      convoId: this["convoId"],
      message: this["message"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ChatBskyConvoDefsLogDeleteMessage(value);
    record.check();
    return record;
  }
};
var ChatBskyConvoDefsLogDisableJoinLink = class _ChatBskyConvoDefsLogDisableJoinLink {
  static nsid = "chat.bsky.convo.defs";
  static def = "logDisableJoinLink";
  static kind = "object";
  $type;
  rev;
  convoId;
  message;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "chat.bsky.convo.defs#logDisableJoinLink";
  }
  check() {
    const issues = [];
    if (this["rev"] == null) issues.push({ path: "rev", message: "Required." });
    if (this["convoId"] == null) issues.push({ path: "convoId", message: "Required." });
    if (this["message"] == null) issues.push({ path: "message", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      rev: this["rev"],
      convoId: this["convoId"],
      message: this["message"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ChatBskyConvoDefsLogDisableJoinLink(value);
    record.check();
    return record;
  }
};
var ChatBskyConvoDefsLogEditGroup = class _ChatBskyConvoDefsLogEditGroup {
  static nsid = "chat.bsky.convo.defs";
  static def = "logEditGroup";
  static kind = "object";
  $type;
  rev;
  convoId;
  message;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "chat.bsky.convo.defs#logEditGroup";
  }
  check() {
    const issues = [];
    if (this["rev"] == null) issues.push({ path: "rev", message: "Required." });
    if (this["convoId"] == null) issues.push({ path: "convoId", message: "Required." });
    if (this["message"] == null) issues.push({ path: "message", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      rev: this["rev"],
      convoId: this["convoId"],
      message: this["message"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ChatBskyConvoDefsLogEditGroup(value);
    record.check();
    return record;
  }
};
var ChatBskyConvoDefsLogEditJoinLink = class _ChatBskyConvoDefsLogEditJoinLink {
  static nsid = "chat.bsky.convo.defs";
  static def = "logEditJoinLink";
  static kind = "object";
  $type;
  rev;
  convoId;
  message;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "chat.bsky.convo.defs#logEditJoinLink";
  }
  check() {
    const issues = [];
    if (this["rev"] == null) issues.push({ path: "rev", message: "Required." });
    if (this["convoId"] == null) issues.push({ path: "convoId", message: "Required." });
    if (this["message"] == null) issues.push({ path: "message", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      rev: this["rev"],
      convoId: this["convoId"],
      message: this["message"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ChatBskyConvoDefsLogEditJoinLink(value);
    record.check();
    return record;
  }
};
var ChatBskyConvoDefsLogEnableJoinLink = class _ChatBskyConvoDefsLogEnableJoinLink {
  static nsid = "chat.bsky.convo.defs";
  static def = "logEnableJoinLink";
  static kind = "object";
  $type;
  rev;
  convoId;
  message;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "chat.bsky.convo.defs#logEnableJoinLink";
  }
  check() {
    const issues = [];
    if (this["rev"] == null) issues.push({ path: "rev", message: "Required." });
    if (this["convoId"] == null) issues.push({ path: "convoId", message: "Required." });
    if (this["message"] == null) issues.push({ path: "message", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      rev: this["rev"],
      convoId: this["convoId"],
      message: this["message"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ChatBskyConvoDefsLogEnableJoinLink(value);
    record.check();
    return record;
  }
};
var ChatBskyConvoDefsLogIncomingJoinRequest = class _ChatBskyConvoDefsLogIncomingJoinRequest {
  static nsid = "chat.bsky.convo.defs";
  static def = "logIncomingJoinRequest";
  static kind = "object";
  $type;
  rev;
  convoId;
  member;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "chat.bsky.convo.defs#logIncomingJoinRequest";
  }
  check() {
    const issues = [];
    if (this["rev"] == null) issues.push({ path: "rev", message: "Required." });
    if (this["convoId"] == null) issues.push({ path: "convoId", message: "Required." });
    if (this["member"] == null) issues.push({ path: "member", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      rev: this["rev"],
      convoId: this["convoId"],
      member: this["member"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ChatBskyConvoDefsLogIncomingJoinRequest(value);
    record.check();
    return record;
  }
};
var ChatBskyConvoDefsLogLeaveConvo = class _ChatBskyConvoDefsLogLeaveConvo {
  static nsid = "chat.bsky.convo.defs";
  static def = "logLeaveConvo";
  static kind = "object";
  $type;
  rev;
  convoId;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "chat.bsky.convo.defs#logLeaveConvo";
  }
  check() {
    const issues = [];
    if (this["rev"] == null) issues.push({ path: "rev", message: "Required." });
    if (this["convoId"] == null) issues.push({ path: "convoId", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      rev: this["rev"],
      convoId: this["convoId"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ChatBskyConvoDefsLogLeaveConvo(value);
    record.check();
    return record;
  }
};
var ChatBskyConvoDefsLogLockConvo = class _ChatBskyConvoDefsLogLockConvo {
  static nsid = "chat.bsky.convo.defs";
  static def = "logLockConvo";
  static kind = "object";
  $type;
  rev;
  convoId;
  message;
  relatedProfiles;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "chat.bsky.convo.defs#logLockConvo";
  }
  check() {
    const issues = [];
    if (this["rev"] == null) issues.push({ path: "rev", message: "Required." });
    if (this["convoId"] == null) issues.push({ path: "convoId", message: "Required." });
    if (this["message"] == null) issues.push({ path: "message", message: "Required." });
    if (this["relatedProfiles"] == null) issues.push({ path: "relatedProfiles", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      rev: this["rev"],
      convoId: this["convoId"],
      message: this["message"],
      relatedProfiles: this["relatedProfiles"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ChatBskyConvoDefsLogLockConvo(value);
    record.check();
    return record;
  }
};
var ChatBskyConvoDefsLogLockConvoPermanently = class _ChatBskyConvoDefsLogLockConvoPermanently {
  static nsid = "chat.bsky.convo.defs";
  static def = "logLockConvoPermanently";
  static kind = "object";
  $type;
  rev;
  convoId;
  message;
  relatedProfiles;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "chat.bsky.convo.defs#logLockConvoPermanently";
  }
  check() {
    const issues = [];
    if (this["rev"] == null) issues.push({ path: "rev", message: "Required." });
    if (this["convoId"] == null) issues.push({ path: "convoId", message: "Required." });
    if (this["message"] == null) issues.push({ path: "message", message: "Required." });
    if (this["relatedProfiles"] == null) issues.push({ path: "relatedProfiles", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      rev: this["rev"],
      convoId: this["convoId"],
      message: this["message"],
      relatedProfiles: this["relatedProfiles"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ChatBskyConvoDefsLogLockConvoPermanently(value);
    record.check();
    return record;
  }
};
var ChatBskyConvoDefsLogMemberJoin = class _ChatBskyConvoDefsLogMemberJoin {
  static nsid = "chat.bsky.convo.defs";
  static def = "logMemberJoin";
  static kind = "object";
  $type;
  rev;
  convoId;
  message;
  relatedProfiles;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "chat.bsky.convo.defs#logMemberJoin";
  }
  check() {
    const issues = [];
    if (this["rev"] == null) issues.push({ path: "rev", message: "Required." });
    if (this["convoId"] == null) issues.push({ path: "convoId", message: "Required." });
    if (this["message"] == null) issues.push({ path: "message", message: "Required." });
    if (this["relatedProfiles"] == null) issues.push({ path: "relatedProfiles", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      rev: this["rev"],
      convoId: this["convoId"],
      message: this["message"],
      relatedProfiles: this["relatedProfiles"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ChatBskyConvoDefsLogMemberJoin(value);
    record.check();
    return record;
  }
};
var ChatBskyConvoDefsLogMemberLeave = class _ChatBskyConvoDefsLogMemberLeave {
  static nsid = "chat.bsky.convo.defs";
  static def = "logMemberLeave";
  static kind = "object";
  $type;
  rev;
  convoId;
  message;
  relatedProfiles;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "chat.bsky.convo.defs#logMemberLeave";
  }
  check() {
    const issues = [];
    if (this["rev"] == null) issues.push({ path: "rev", message: "Required." });
    if (this["convoId"] == null) issues.push({ path: "convoId", message: "Required." });
    if (this["message"] == null) issues.push({ path: "message", message: "Required." });
    if (this["relatedProfiles"] == null) issues.push({ path: "relatedProfiles", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      rev: this["rev"],
      convoId: this["convoId"],
      message: this["message"],
      relatedProfiles: this["relatedProfiles"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ChatBskyConvoDefsLogMemberLeave(value);
    record.check();
    return record;
  }
};
var ChatBskyConvoDefsLogMuteConvo = class _ChatBskyConvoDefsLogMuteConvo {
  static nsid = "chat.bsky.convo.defs";
  static def = "logMuteConvo";
  static kind = "object";
  $type;
  rev;
  convoId;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "chat.bsky.convo.defs#logMuteConvo";
  }
  check() {
    const issues = [];
    if (this["rev"] == null) issues.push({ path: "rev", message: "Required." });
    if (this["convoId"] == null) issues.push({ path: "convoId", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      rev: this["rev"],
      convoId: this["convoId"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ChatBskyConvoDefsLogMuteConvo(value);
    record.check();
    return record;
  }
};
var ChatBskyConvoDefsLogOutgoingJoinRequest = class _ChatBskyConvoDefsLogOutgoingJoinRequest {
  static nsid = "chat.bsky.convo.defs";
  static def = "logOutgoingJoinRequest";
  static kind = "object";
  $type;
  rev;
  convoId;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "chat.bsky.convo.defs#logOutgoingJoinRequest";
  }
  check() {
    const issues = [];
    if (this["rev"] == null) issues.push({ path: "rev", message: "Required." });
    if (this["convoId"] == null) issues.push({ path: "convoId", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      rev: this["rev"],
      convoId: this["convoId"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ChatBskyConvoDefsLogOutgoingJoinRequest(value);
    record.check();
    return record;
  }
};
var ChatBskyConvoDefsLogReadConvo = class _ChatBskyConvoDefsLogReadConvo {
  static nsid = "chat.bsky.convo.defs";
  static def = "logReadConvo";
  static kind = "object";
  $type;
  rev;
  convoId;
  message;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "chat.bsky.convo.defs#logReadConvo";
  }
  check() {
    const issues = [];
    if (this["rev"] == null) issues.push({ path: "rev", message: "Required." });
    if (this["convoId"] == null) issues.push({ path: "convoId", message: "Required." });
    if (this["message"] == null) issues.push({ path: "message", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      rev: this["rev"],
      convoId: this["convoId"],
      message: this["message"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ChatBskyConvoDefsLogReadConvo(value);
    record.check();
    return record;
  }
};
var ChatBskyConvoDefsLogReadJoinRequests = class _ChatBskyConvoDefsLogReadJoinRequests {
  static nsid = "chat.bsky.convo.defs";
  static def = "logReadJoinRequests";
  static kind = "object";
  $type;
  rev;
  convoId;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "chat.bsky.convo.defs#logReadJoinRequests";
  }
  check() {
    const issues = [];
    if (this["rev"] == null) issues.push({ path: "rev", message: "Required." });
    if (this["convoId"] == null) issues.push({ path: "convoId", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      rev: this["rev"],
      convoId: this["convoId"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ChatBskyConvoDefsLogReadJoinRequests(value);
    record.check();
    return record;
  }
};
var ChatBskyConvoDefsLogReadMessage = class _ChatBskyConvoDefsLogReadMessage {
  static nsid = "chat.bsky.convo.defs";
  static def = "logReadMessage";
  static kind = "object";
  $type;
  rev;
  convoId;
  message;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "chat.bsky.convo.defs#logReadMessage";
  }
  check() {
    const issues = [];
    if (this["rev"] == null) issues.push({ path: "rev", message: "Required." });
    if (this["convoId"] == null) issues.push({ path: "convoId", message: "Required." });
    if (this["message"] == null) issues.push({ path: "message", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      rev: this["rev"],
      convoId: this["convoId"],
      message: this["message"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ChatBskyConvoDefsLogReadMessage(value);
    record.check();
    return record;
  }
};
var ChatBskyConvoDefsLogRejectJoinRequest = class _ChatBskyConvoDefsLogRejectJoinRequest {
  static nsid = "chat.bsky.convo.defs";
  static def = "logRejectJoinRequest";
  static kind = "object";
  $type;
  rev;
  convoId;
  member;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "chat.bsky.convo.defs#logRejectJoinRequest";
  }
  check() {
    const issues = [];
    if (this["rev"] == null) issues.push({ path: "rev", message: "Required." });
    if (this["convoId"] == null) issues.push({ path: "convoId", message: "Required." });
    if (this["member"] == null) issues.push({ path: "member", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      rev: this["rev"],
      convoId: this["convoId"],
      member: this["member"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ChatBskyConvoDefsLogRejectJoinRequest(value);
    record.check();
    return record;
  }
};
var ChatBskyConvoDefsLogRemoveMember = class _ChatBskyConvoDefsLogRemoveMember {
  static nsid = "chat.bsky.convo.defs";
  static def = "logRemoveMember";
  static kind = "object";
  $type;
  rev;
  convoId;
  message;
  relatedProfiles;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "chat.bsky.convo.defs#logRemoveMember";
  }
  check() {
    const issues = [];
    if (this["rev"] == null) issues.push({ path: "rev", message: "Required." });
    if (this["convoId"] == null) issues.push({ path: "convoId", message: "Required." });
    if (this["message"] == null) issues.push({ path: "message", message: "Required." });
    if (this["relatedProfiles"] == null) issues.push({ path: "relatedProfiles", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      rev: this["rev"],
      convoId: this["convoId"],
      message: this["message"],
      relatedProfiles: this["relatedProfiles"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ChatBskyConvoDefsLogRemoveMember(value);
    record.check();
    return record;
  }
};
var ChatBskyConvoDefsLogRemoveReaction = class _ChatBskyConvoDefsLogRemoveReaction {
  static nsid = "chat.bsky.convo.defs";
  static def = "logRemoveReaction";
  static kind = "object";
  $type;
  rev;
  convoId;
  message;
  reaction;
  relatedProfiles;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "chat.bsky.convo.defs#logRemoveReaction";
  }
  check() {
    const issues = [];
    if (this["rev"] == null) issues.push({ path: "rev", message: "Required." });
    if (this["convoId"] == null) issues.push({ path: "convoId", message: "Required." });
    if (this["message"] == null) issues.push({ path: "message", message: "Required." });
    if (this["reaction"] == null) issues.push({ path: "reaction", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      rev: this["rev"],
      convoId: this["convoId"],
      message: this["message"],
      reaction: this["reaction"],
      relatedProfiles: this["relatedProfiles"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ChatBskyConvoDefsLogRemoveReaction(value);
    record.check();
    return record;
  }
};
var ChatBskyConvoDefsLogUnlockConvo = class _ChatBskyConvoDefsLogUnlockConvo {
  static nsid = "chat.bsky.convo.defs";
  static def = "logUnlockConvo";
  static kind = "object";
  $type;
  rev;
  convoId;
  message;
  relatedProfiles;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "chat.bsky.convo.defs#logUnlockConvo";
  }
  check() {
    const issues = [];
    if (this["rev"] == null) issues.push({ path: "rev", message: "Required." });
    if (this["convoId"] == null) issues.push({ path: "convoId", message: "Required." });
    if (this["message"] == null) issues.push({ path: "message", message: "Required." });
    if (this["relatedProfiles"] == null) issues.push({ path: "relatedProfiles", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      rev: this["rev"],
      convoId: this["convoId"],
      message: this["message"],
      relatedProfiles: this["relatedProfiles"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ChatBskyConvoDefsLogUnlockConvo(value);
    record.check();
    return record;
  }
};
var ChatBskyConvoDefsLogUnmuteConvo = class _ChatBskyConvoDefsLogUnmuteConvo {
  static nsid = "chat.bsky.convo.defs";
  static def = "logUnmuteConvo";
  static kind = "object";
  $type;
  rev;
  convoId;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "chat.bsky.convo.defs#logUnmuteConvo";
  }
  check() {
    const issues = [];
    if (this["rev"] == null) issues.push({ path: "rev", message: "Required." });
    if (this["convoId"] == null) issues.push({ path: "convoId", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      rev: this["rev"],
      convoId: this["convoId"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ChatBskyConvoDefsLogUnmuteConvo(value);
    record.check();
    return record;
  }
};
var ChatBskyConvoDefsLogWithdrawIncomingJoinRequest = class _ChatBskyConvoDefsLogWithdrawIncomingJoinRequest {
  static nsid = "chat.bsky.convo.defs";
  static def = "logWithdrawIncomingJoinRequest";
  static kind = "object";
  $type;
  rev;
  convoId;
  member;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "chat.bsky.convo.defs#logWithdrawIncomingJoinRequest";
  }
  check() {
    const issues = [];
    if (this["rev"] == null) issues.push({ path: "rev", message: "Required." });
    if (this["convoId"] == null) issues.push({ path: "convoId", message: "Required." });
    if (this["member"] == null) issues.push({ path: "member", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      rev: this["rev"],
      convoId: this["convoId"],
      member: this["member"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ChatBskyConvoDefsLogWithdrawIncomingJoinRequest(value);
    record.check();
    return record;
  }
};
var ChatBskyConvoDefsLogWithdrawOutgoingJoinRequest = class _ChatBskyConvoDefsLogWithdrawOutgoingJoinRequest {
  static nsid = "chat.bsky.convo.defs";
  static def = "logWithdrawOutgoingJoinRequest";
  static kind = "object";
  $type;
  rev;
  convoId;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "chat.bsky.convo.defs#logWithdrawOutgoingJoinRequest";
  }
  check() {
    const issues = [];
    if (this["rev"] == null) issues.push({ path: "rev", message: "Required." });
    if (this["convoId"] == null) issues.push({ path: "convoId", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      rev: this["rev"],
      convoId: this["convoId"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ChatBskyConvoDefsLogWithdrawOutgoingJoinRequest(value);
    record.check();
    return record;
  }
};
var ChatBskyConvoDefsMessageAndReactionView = class _ChatBskyConvoDefsMessageAndReactionView {
  static nsid = "chat.bsky.convo.defs";
  static def = "messageAndReactionView";
  static kind = "object";
  $type;
  message;
  reaction;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "chat.bsky.convo.defs#messageAndReactionView";
  }
  check() {
    const issues = [];
    if (this["message"] == null) issues.push({ path: "message", message: "Required." });
    if (this["reaction"] == null) issues.push({ path: "reaction", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      message: this["message"],
      reaction: this["reaction"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ChatBskyConvoDefsMessageAndReactionView(value);
    record.check();
    return record;
  }
};
var ChatBskyConvoDefsMessageBeforeUserJoinedGroupView = class _ChatBskyConvoDefsMessageBeforeUserJoinedGroupView {
  static nsid = "chat.bsky.convo.defs";
  static def = "messageBeforeUserJoinedGroupView";
  static kind = "object";
  $type;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "chat.bsky.convo.defs#messageBeforeUserJoinedGroupView";
  }
  check() {
    const issues = [];
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ChatBskyConvoDefsMessageBeforeUserJoinedGroupView(value);
    record.check();
    return record;
  }
};
var ChatBskyConvoDefsMessageInput = class _ChatBskyConvoDefsMessageInput {
  static nsid = "chat.bsky.convo.defs";
  static def = "messageInput";
  static kind = "object";
  $type;
  text;
  facets;
  embed;
  replyTo;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "chat.bsky.convo.defs#messageInput";
  }
  check() {
    const issues = [];
    if (this["text"] == null) issues.push({ path: "text", message: "Required." });
    if (typeof this["text"] === "string" && this["text"].length > 1e4) issues.push({ path: "text", message: "Must be at most 10000 characters." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      text: this["text"],
      facets: this["facets"],
      embed: this["embed"],
      replyTo: this["replyTo"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ChatBskyConvoDefsMessageInput(value);
    record.check();
    return record;
  }
};
var ChatBskyConvoDefsMessageRef = class _ChatBskyConvoDefsMessageRef {
  static nsid = "chat.bsky.convo.defs";
  static def = "messageRef";
  static kind = "object";
  $type;
  did;
  convoId;
  messageId;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "chat.bsky.convo.defs#messageRef";
  }
  check() {
    const issues = [];
    if (this["did"] == null) issues.push({ path: "did", message: "Required." });
    if (this["convoId"] == null) issues.push({ path: "convoId", message: "Required." });
    if (this["messageId"] == null) issues.push({ path: "messageId", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      did: this["did"],
      convoId: this["convoId"],
      messageId: this["messageId"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ChatBskyConvoDefsMessageRef(value);
    record.check();
    return record;
  }
};
var ChatBskyConvoDefsMessageView = class _ChatBskyConvoDefsMessageView {
  static nsid = "chat.bsky.convo.defs";
  static def = "messageView";
  static kind = "object";
  $type;
  id;
  rev;
  text;
  facets;
  embed;
  reactions;
  replyTo;
  sender;
  sentAt;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "chat.bsky.convo.defs#messageView";
  }
  check() {
    const issues = [];
    if (this["id"] == null) issues.push({ path: "id", message: "Required." });
    if (this["rev"] == null) issues.push({ path: "rev", message: "Required." });
    if (this["text"] == null) issues.push({ path: "text", message: "Required." });
    if (typeof this["text"] === "string" && this["text"].length > 1e4) issues.push({ path: "text", message: "Must be at most 10000 characters." });
    if (this["sender"] == null) issues.push({ path: "sender", message: "Required." });
    if (this["sentAt"] == null) issues.push({ path: "sentAt", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      id: this["id"],
      rev: this["rev"],
      text: this["text"],
      facets: this["facets"],
      embed: this["embed"],
      reactions: this["reactions"],
      replyTo: this["replyTo"],
      sender: this["sender"],
      sentAt: this["sentAt"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ChatBskyConvoDefsMessageView(value);
    record.check();
    return record;
  }
};
var ChatBskyConvoDefsMessageViewSender = class _ChatBskyConvoDefsMessageViewSender {
  static nsid = "chat.bsky.convo.defs";
  static def = "messageViewSender";
  static kind = "object";
  $type;
  did;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "chat.bsky.convo.defs#messageViewSender";
  }
  check() {
    const issues = [];
    if (this["did"] == null) issues.push({ path: "did", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      did: this["did"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ChatBskyConvoDefsMessageViewSender(value);
    record.check();
    return record;
  }
};
var ChatBskyConvoDefsReactionView = class _ChatBskyConvoDefsReactionView {
  static nsid = "chat.bsky.convo.defs";
  static def = "reactionView";
  static kind = "object";
  $type;
  value;
  sender;
  createdAt;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "chat.bsky.convo.defs#reactionView";
  }
  check() {
    const issues = [];
    if (this["value"] == null) issues.push({ path: "value", message: "Required." });
    if (this["sender"] == null) issues.push({ path: "sender", message: "Required." });
    if (this["createdAt"] == null) issues.push({ path: "createdAt", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      value: this["value"],
      sender: this["sender"],
      createdAt: this["createdAt"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ChatBskyConvoDefsReactionView(value);
    record.check();
    return record;
  }
};
var ChatBskyConvoDefsReactionViewSender = class _ChatBskyConvoDefsReactionViewSender {
  static nsid = "chat.bsky.convo.defs";
  static def = "reactionViewSender";
  static kind = "object";
  $type;
  did;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "chat.bsky.convo.defs#reactionViewSender";
  }
  check() {
    const issues = [];
    if (this["did"] == null) issues.push({ path: "did", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      did: this["did"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ChatBskyConvoDefsReactionViewSender(value);
    record.check();
    return record;
  }
};
var ChatBskyConvoDefsReplyRef = class _ChatBskyConvoDefsReplyRef {
  static nsid = "chat.bsky.convo.defs";
  static def = "replyRef";
  static kind = "object";
  $type;
  messageId;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "chat.bsky.convo.defs#replyRef";
  }
  check() {
    const issues = [];
    if (this["messageId"] == null) issues.push({ path: "messageId", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      messageId: this["messageId"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ChatBskyConvoDefsReplyRef(value);
    record.check();
    return record;
  }
};
var ChatBskyConvoDefsSystemMessageDataAddMember = class _ChatBskyConvoDefsSystemMessageDataAddMember {
  static nsid = "chat.bsky.convo.defs";
  static def = "systemMessageDataAddMember";
  static kind = "object";
  $type;
  member;
  role;
  addedBy;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "chat.bsky.convo.defs#systemMessageDataAddMember";
  }
  check() {
    const issues = [];
    if (this["member"] == null) issues.push({ path: "member", message: "Required." });
    if (this["role"] == null) issues.push({ path: "role", message: "Required." });
    if (this["addedBy"] == null) issues.push({ path: "addedBy", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      member: this["member"],
      role: this["role"],
      addedBy: this["addedBy"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ChatBskyConvoDefsSystemMessageDataAddMember(value);
    record.check();
    return record;
  }
};
var ChatBskyConvoDefsSystemMessageDataCreateJoinLink = class _ChatBskyConvoDefsSystemMessageDataCreateJoinLink {
  static nsid = "chat.bsky.convo.defs";
  static def = "systemMessageDataCreateJoinLink";
  static kind = "object";
  $type;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "chat.bsky.convo.defs#systemMessageDataCreateJoinLink";
  }
  check() {
    const issues = [];
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ChatBskyConvoDefsSystemMessageDataCreateJoinLink(value);
    record.check();
    return record;
  }
};
var ChatBskyConvoDefsSystemMessageDataDisableJoinLink = class _ChatBskyConvoDefsSystemMessageDataDisableJoinLink {
  static nsid = "chat.bsky.convo.defs";
  static def = "systemMessageDataDisableJoinLink";
  static kind = "object";
  $type;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "chat.bsky.convo.defs#systemMessageDataDisableJoinLink";
  }
  check() {
    const issues = [];
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ChatBskyConvoDefsSystemMessageDataDisableJoinLink(value);
    record.check();
    return record;
  }
};
var ChatBskyConvoDefsSystemMessageDataEditGroup = class _ChatBskyConvoDefsSystemMessageDataEditGroup {
  static nsid = "chat.bsky.convo.defs";
  static def = "systemMessageDataEditGroup";
  static kind = "object";
  $type;
  oldName;
  newName;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "chat.bsky.convo.defs#systemMessageDataEditGroup";
  }
  check() {
    const issues = [];
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      oldName: this["oldName"],
      newName: this["newName"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ChatBskyConvoDefsSystemMessageDataEditGroup(value);
    record.check();
    return record;
  }
};
var ChatBskyConvoDefsSystemMessageDataEditJoinLink = class _ChatBskyConvoDefsSystemMessageDataEditJoinLink {
  static nsid = "chat.bsky.convo.defs";
  static def = "systemMessageDataEditJoinLink";
  static kind = "object";
  $type;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "chat.bsky.convo.defs#systemMessageDataEditJoinLink";
  }
  check() {
    const issues = [];
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ChatBskyConvoDefsSystemMessageDataEditJoinLink(value);
    record.check();
    return record;
  }
};
var ChatBskyConvoDefsSystemMessageDataEnableJoinLink = class _ChatBskyConvoDefsSystemMessageDataEnableJoinLink {
  static nsid = "chat.bsky.convo.defs";
  static def = "systemMessageDataEnableJoinLink";
  static kind = "object";
  $type;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "chat.bsky.convo.defs#systemMessageDataEnableJoinLink";
  }
  check() {
    const issues = [];
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ChatBskyConvoDefsSystemMessageDataEnableJoinLink(value);
    record.check();
    return record;
  }
};
var ChatBskyConvoDefsSystemMessageDataLockConvo = class _ChatBskyConvoDefsSystemMessageDataLockConvo {
  static nsid = "chat.bsky.convo.defs";
  static def = "systemMessageDataLockConvo";
  static kind = "object";
  $type;
  lockedBy;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "chat.bsky.convo.defs#systemMessageDataLockConvo";
  }
  check() {
    const issues = [];
    if (this["lockedBy"] == null) issues.push({ path: "lockedBy", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      lockedBy: this["lockedBy"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ChatBskyConvoDefsSystemMessageDataLockConvo(value);
    record.check();
    return record;
  }
};
var ChatBskyConvoDefsSystemMessageDataLockConvoPermanently = class _ChatBskyConvoDefsSystemMessageDataLockConvoPermanently {
  static nsid = "chat.bsky.convo.defs";
  static def = "systemMessageDataLockConvoPermanently";
  static kind = "object";
  $type;
  lockedBy;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "chat.bsky.convo.defs#systemMessageDataLockConvoPermanently";
  }
  check() {
    const issues = [];
    if (this["lockedBy"] == null) issues.push({ path: "lockedBy", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      lockedBy: this["lockedBy"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ChatBskyConvoDefsSystemMessageDataLockConvoPermanently(value);
    record.check();
    return record;
  }
};
var ChatBskyConvoDefsSystemMessageDataMemberJoin = class _ChatBskyConvoDefsSystemMessageDataMemberJoin {
  static nsid = "chat.bsky.convo.defs";
  static def = "systemMessageDataMemberJoin";
  static kind = "object";
  $type;
  member;
  role;
  approvedBy;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "chat.bsky.convo.defs#systemMessageDataMemberJoin";
  }
  check() {
    const issues = [];
    if (this["member"] == null) issues.push({ path: "member", message: "Required." });
    if (this["role"] == null) issues.push({ path: "role", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      member: this["member"],
      role: this["role"],
      approvedBy: this["approvedBy"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ChatBskyConvoDefsSystemMessageDataMemberJoin(value);
    record.check();
    return record;
  }
};
var ChatBskyConvoDefsSystemMessageDataMemberLeave = class _ChatBskyConvoDefsSystemMessageDataMemberLeave {
  static nsid = "chat.bsky.convo.defs";
  static def = "systemMessageDataMemberLeave";
  static kind = "object";
  $type;
  member;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "chat.bsky.convo.defs#systemMessageDataMemberLeave";
  }
  check() {
    const issues = [];
    if (this["member"] == null) issues.push({ path: "member", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      member: this["member"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ChatBskyConvoDefsSystemMessageDataMemberLeave(value);
    record.check();
    return record;
  }
};
var ChatBskyConvoDefsSystemMessageDataRemoveMember = class _ChatBskyConvoDefsSystemMessageDataRemoveMember {
  static nsid = "chat.bsky.convo.defs";
  static def = "systemMessageDataRemoveMember";
  static kind = "object";
  $type;
  member;
  removedBy;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "chat.bsky.convo.defs#systemMessageDataRemoveMember";
  }
  check() {
    const issues = [];
    if (this["member"] == null) issues.push({ path: "member", message: "Required." });
    if (this["removedBy"] == null) issues.push({ path: "removedBy", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      member: this["member"],
      removedBy: this["removedBy"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ChatBskyConvoDefsSystemMessageDataRemoveMember(value);
    record.check();
    return record;
  }
};
var ChatBskyConvoDefsSystemMessageDataUnlockConvo = class _ChatBskyConvoDefsSystemMessageDataUnlockConvo {
  static nsid = "chat.bsky.convo.defs";
  static def = "systemMessageDataUnlockConvo";
  static kind = "object";
  $type;
  unlockedBy;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "chat.bsky.convo.defs#systemMessageDataUnlockConvo";
  }
  check() {
    const issues = [];
    if (this["unlockedBy"] == null) issues.push({ path: "unlockedBy", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      unlockedBy: this["unlockedBy"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ChatBskyConvoDefsSystemMessageDataUnlockConvo(value);
    record.check();
    return record;
  }
};
var ChatBskyConvoDefsSystemMessageReferredUser = class _ChatBskyConvoDefsSystemMessageReferredUser {
  static nsid = "chat.bsky.convo.defs";
  static def = "systemMessageReferredUser";
  static kind = "object";
  $type;
  did;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "chat.bsky.convo.defs#systemMessageReferredUser";
  }
  check() {
    const issues = [];
    if (this["did"] == null) issues.push({ path: "did", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      did: this["did"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ChatBskyConvoDefsSystemMessageReferredUser(value);
    record.check();
    return record;
  }
};
var ChatBskyConvoDefsSystemMessageView = class _ChatBskyConvoDefsSystemMessageView {
  static nsid = "chat.bsky.convo.defs";
  static def = "systemMessageView";
  static kind = "object";
  $type;
  id;
  rev;
  sentAt;
  data;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "chat.bsky.convo.defs#systemMessageView";
  }
  check() {
    const issues = [];
    if (this["id"] == null) issues.push({ path: "id", message: "Required." });
    if (this["rev"] == null) issues.push({ path: "rev", message: "Required." });
    if (this["sentAt"] == null) issues.push({ path: "sentAt", message: "Required." });
    if (this["data"] == null) issues.push({ path: "data", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      id: this["id"],
      rev: this["rev"],
      sentAt: this["sentAt"],
      data: this["data"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ChatBskyConvoDefsSystemMessageView(value);
    record.check();
    return record;
  }
};
var ChatBskyConvoDeleteMessageForSelf = class _ChatBskyConvoDeleteMessageForSelf {
  static nsid = "chat.bsky.convo.deleteMessageForSelf";
  static def = "main";
  static kind = "procedure";
  static http = "POST";
  static errorNames = ["InvalidConvo", "MessageDeleteNotAllowed"];
  convoId;
  messageId;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({});
  }
  toBody() {
    return jsonOf({
      convoId: this["convoId"],
      messageId: this["messageId"]
    });
  }
  check() {
    const issues = [];
    if (this["convoId"] == null) issues.push({ path: "convoId", message: "Required." });
    if (this["messageId"] == null) issues.push({ path: "messageId", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _ChatBskyConvoDeleteMessageForSelf.nsid,
      method: "POST",
      params: this.toParams(),
      body: this.toBody(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ChatBskyConvoDeleteMessageForSelf(value);
    record.check();
    return record;
  }
};
var ChatBskyConvoGetConvo = class _ChatBskyConvoGetConvo {
  static nsid = "chat.bsky.convo.getConvo";
  static def = "main";
  static kind = "query";
  static http = "GET";
  static errorNames = ["InvalidConvo"];
  convoId;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({
      convoId: this["convoId"]
    });
  }
  check() {
    const issues = [];
    if (this["convoId"] == null) issues.push({ path: "convoId", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _ChatBskyConvoGetConvo.nsid,
      method: "GET",
      params: this.toParams(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ChatBskyConvoGetConvo(value);
    record.check();
    return record;
  }
};
var ChatBskyConvoGetConvoAvailability = class _ChatBskyConvoGetConvoAvailability {
  static nsid = "chat.bsky.convo.getConvoAvailability";
  static def = "main";
  static kind = "query";
  static http = "GET";
  static errorNames = [];
  members;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({
      members: this["members"]
    });
  }
  check() {
    const issues = [];
    if (this["members"] == null) issues.push({ path: "members", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _ChatBskyConvoGetConvoAvailability.nsid,
      method: "GET",
      params: this.toParams(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ChatBskyConvoGetConvoAvailability(value);
    record.check();
    return record;
  }
};
var ChatBskyConvoGetConvoForMembers = class _ChatBskyConvoGetConvoForMembers {
  static nsid = "chat.bsky.convo.getConvoForMembers";
  static def = "main";
  static kind = "query";
  static http = "GET";
  static errorNames = ["AccountSuspended", "BlockedActor", "BlockedSubject", "MessagesDisabled", "NotFollowedBySender", "RecipientNotFound"];
  members;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({
      members: this["members"]
    });
  }
  check() {
    const issues = [];
    if (this["members"] == null) issues.push({ path: "members", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _ChatBskyConvoGetConvoForMembers.nsid,
      method: "GET",
      params: this.toParams(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ChatBskyConvoGetConvoForMembers(value);
    record.check();
    return record;
  }
};
var ChatBskyConvoGetConvoMembers = class _ChatBskyConvoGetConvoMembers {
  static nsid = "chat.bsky.convo.getConvoMembers";
  static def = "main";
  static kind = "query";
  static http = "GET";
  static errorNames = ["InvalidConvo"];
  convoId;
  limit;
  cursor;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({
      convoId: this["convoId"],
      limit: this["limit"],
      cursor: this["cursor"]
    });
  }
  check() {
    const issues = [];
    if (this["convoId"] == null) issues.push({ path: "convoId", message: "Required." });
    if (this["limit"] != null) {
      if (!Number.isInteger(this["limit"])) issues.push({ path: "limit", message: "Must be an integer." });
      else if (this["limit"] < 1) issues.push({ path: "limit", message: "Must be at least 1." });
      else if (this["limit"] > 100) issues.push({ path: "limit", message: "Must be at most 100." });
    }
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _ChatBskyConvoGetConvoMembers.nsid,
      method: "GET",
      params: this.toParams(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ChatBskyConvoGetConvoMembers(value);
    record.check();
    return record;
  }
};
var ChatBskyConvoGetLog = class _ChatBskyConvoGetLog {
  static nsid = "chat.bsky.convo.getLog";
  static def = "main";
  static kind = "query";
  static http = "GET";
  static errorNames = [];
  cursor;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({
      cursor: this["cursor"]
    });
  }
  check() {
    const issues = [];
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _ChatBskyConvoGetLog.nsid,
      method: "GET",
      params: this.toParams(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ChatBskyConvoGetLog(value);
    record.check();
    return record;
  }
};
var ChatBskyConvoGetMessages = class _ChatBskyConvoGetMessages {
  static nsid = "chat.bsky.convo.getMessages";
  static def = "main";
  static kind = "query";
  static http = "GET";
  static errorNames = ["InvalidConvo"];
  convoId;
  limit;
  cursor;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({
      convoId: this["convoId"],
      limit: this["limit"],
      cursor: this["cursor"]
    });
  }
  check() {
    const issues = [];
    if (this["convoId"] == null) issues.push({ path: "convoId", message: "Required." });
    if (this["limit"] != null) {
      if (!Number.isInteger(this["limit"])) issues.push({ path: "limit", message: "Must be an integer." });
      else if (this["limit"] < 1) issues.push({ path: "limit", message: "Must be at least 1." });
      else if (this["limit"] > 100) issues.push({ path: "limit", message: "Must be at most 100." });
    }
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _ChatBskyConvoGetMessages.nsid,
      method: "GET",
      params: this.toParams(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ChatBskyConvoGetMessages(value);
    record.check();
    return record;
  }
};
var ChatBskyConvoGetUnreadCounts = class _ChatBskyConvoGetUnreadCounts {
  static nsid = "chat.bsky.convo.getUnreadCounts";
  static def = "main";
  static kind = "query";
  static http = "GET";
  static errorNames = [];
  includeGroupChats;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({
      includeGroupChats: this["includeGroupChats"]
    });
  }
  check() {
    const issues = [];
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _ChatBskyConvoGetUnreadCounts.nsid,
      method: "GET",
      params: this.toParams(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ChatBskyConvoGetUnreadCounts(value);
    record.check();
    return record;
  }
};
var ChatBskyConvoListConvoRequests = class _ChatBskyConvoListConvoRequests {
  static nsid = "chat.bsky.convo.listConvoRequests";
  static def = "main";
  static kind = "query";
  static http = "GET";
  static errorNames = [];
  limit;
  cursor;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({
      limit: this["limit"],
      cursor: this["cursor"]
    });
  }
  check() {
    const issues = [];
    if (this["limit"] != null) {
      if (!Number.isInteger(this["limit"])) issues.push({ path: "limit", message: "Must be an integer." });
      else if (this["limit"] < 1) issues.push({ path: "limit", message: "Must be at least 1." });
      else if (this["limit"] > 100) issues.push({ path: "limit", message: "Must be at most 100." });
    }
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _ChatBskyConvoListConvoRequests.nsid,
      method: "GET",
      params: this.toParams(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ChatBskyConvoListConvoRequests(value);
    record.check();
    return record;
  }
};
var ChatBskyConvoListConvos = class _ChatBskyConvoListConvos {
  static nsid = "chat.bsky.convo.listConvos";
  static def = "main";
  static kind = "query";
  static http = "GET";
  static errorNames = [];
  limit;
  cursor;
  readState;
  status;
  kind;
  lockStatus;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({
      limit: this["limit"],
      cursor: this["cursor"],
      readState: this["readState"],
      status: this["status"],
      kind: this["kind"],
      lockStatus: this["lockStatus"]
    });
  }
  check() {
    const issues = [];
    if (this["limit"] != null) {
      if (!Number.isInteger(this["limit"])) issues.push({ path: "limit", message: "Must be an integer." });
      else if (this["limit"] < 1) issues.push({ path: "limit", message: "Must be at least 1." });
      else if (this["limit"] > 100) issues.push({ path: "limit", message: "Must be at most 100." });
    }
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _ChatBskyConvoListConvos.nsid,
      method: "GET",
      params: this.toParams(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ChatBskyConvoListConvos(value);
    record.check();
    return record;
  }
};
var ChatBskyConvoLockConvo = class _ChatBskyConvoLockConvo {
  static nsid = "chat.bsky.convo.lockConvo";
  static def = "main";
  static kind = "procedure";
  static http = "POST";
  static errorNames = ["ConvoLocked", "InvalidConvo", "InsufficientRole"];
  convoId;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({});
  }
  toBody() {
    return jsonOf({
      convoId: this["convoId"]
    });
  }
  check() {
    const issues = [];
    if (this["convoId"] == null) issues.push({ path: "convoId", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _ChatBskyConvoLockConvo.nsid,
      method: "POST",
      params: this.toParams(),
      body: this.toBody(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ChatBskyConvoLockConvo(value);
    record.check();
    return record;
  }
};
var ChatBskyConvoMuteConvo = class _ChatBskyConvoMuteConvo {
  static nsid = "chat.bsky.convo.muteConvo";
  static def = "main";
  static kind = "procedure";
  static http = "POST";
  static errorNames = ["InvalidConvo"];
  convoId;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({});
  }
  toBody() {
    return jsonOf({
      convoId: this["convoId"]
    });
  }
  check() {
    const issues = [];
    if (this["convoId"] == null) issues.push({ path: "convoId", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _ChatBskyConvoMuteConvo.nsid,
      method: "POST",
      params: this.toParams(),
      body: this.toBody(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ChatBskyConvoMuteConvo(value);
    record.check();
    return record;
  }
};
var ChatBskyConvoRemoveReaction = class _ChatBskyConvoRemoveReaction {
  static nsid = "chat.bsky.convo.removeReaction";
  static def = "main";
  static kind = "procedure";
  static http = "POST";
  static errorNames = ["InvalidConvo", "ReactionNotAllowed", "ReactionMessageDeleted", "ReactionInvalidValue"];
  convoId;
  messageId;
  value;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({});
  }
  toBody() {
    return jsonOf({
      convoId: this["convoId"],
      messageId: this["messageId"],
      value: this["value"]
    });
  }
  check() {
    const issues = [];
    if (this["convoId"] == null) issues.push({ path: "convoId", message: "Required." });
    if (this["messageId"] == null) issues.push({ path: "messageId", message: "Required." });
    if (this["value"] == null) issues.push({ path: "value", message: "Required." });
    if (typeof this["value"] === "string" && this["value"].length > 64) issues.push({ path: "value", message: "Must be at most 64 characters." });
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _ChatBskyConvoRemoveReaction.nsid,
      method: "POST",
      params: this.toParams(),
      body: this.toBody(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ChatBskyConvoRemoveReaction(value);
    record.check();
    return record;
  }
};
var ChatBskyConvoSendMessage = class _ChatBskyConvoSendMessage {
  static nsid = "chat.bsky.convo.sendMessage";
  static def = "main";
  static kind = "procedure";
  static http = "POST";
  static errorNames = ["ConvoLocked", "InvalidConvo", "ReplyTargetNotFound"];
  convoId;
  message;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({});
  }
  toBody() {
    return jsonOf({
      convoId: this["convoId"],
      message: this["message"]
    });
  }
  check() {
    const issues = [];
    if (this["convoId"] == null) issues.push({ path: "convoId", message: "Required." });
    if (this["message"] == null) issues.push({ path: "message", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _ChatBskyConvoSendMessage.nsid,
      method: "POST",
      params: this.toParams(),
      body: this.toBody(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ChatBskyConvoSendMessage(value);
    record.check();
    return record;
  }
};
var ChatBskyConvoSendMessageBatch = class _ChatBskyConvoSendMessageBatch {
  static nsid = "chat.bsky.convo.sendMessageBatch";
  static def = "main";
  static kind = "procedure";
  static http = "POST";
  static errorNames = ["ConvoLocked", "InvalidConvo", "ReplyTargetNotFound"];
  items;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({});
  }
  toBody() {
    return jsonOf({
      items: this["items"]
    });
  }
  check() {
    const issues = [];
    if (this["items"] == null) issues.push({ path: "items", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _ChatBskyConvoSendMessageBatch.nsid,
      method: "POST",
      params: this.toParams(),
      body: this.toBody(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ChatBskyConvoSendMessageBatch(value);
    record.check();
    return record;
  }
};
var ChatBskyConvoSendMessageBatchBatchItem = class _ChatBskyConvoSendMessageBatchBatchItem {
  static nsid = "chat.bsky.convo.sendMessageBatch";
  static def = "batchItem";
  static kind = "object";
  $type;
  convoId;
  message;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "chat.bsky.convo.sendMessageBatch#batchItem";
  }
  check() {
    const issues = [];
    if (this["convoId"] == null) issues.push({ path: "convoId", message: "Required." });
    if (this["message"] == null) issues.push({ path: "message", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      convoId: this["convoId"],
      message: this["message"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ChatBskyConvoSendMessageBatchBatchItem(value);
    record.check();
    return record;
  }
};
var ChatBskyConvoUnlockConvo = class _ChatBskyConvoUnlockConvo {
  static nsid = "chat.bsky.convo.unlockConvo";
  static def = "main";
  static kind = "procedure";
  static http = "POST";
  static errorNames = ["InvalidConvo", "InsufficientRole", "ConvoLockedByModeration"];
  convoId;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({});
  }
  toBody() {
    return jsonOf({
      convoId: this["convoId"]
    });
  }
  check() {
    const issues = [];
    if (this["convoId"] == null) issues.push({ path: "convoId", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _ChatBskyConvoUnlockConvo.nsid,
      method: "POST",
      params: this.toParams(),
      body: this.toBody(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ChatBskyConvoUnlockConvo(value);
    record.check();
    return record;
  }
};
var ChatBskyConvoUnmuteConvo = class _ChatBskyConvoUnmuteConvo {
  static nsid = "chat.bsky.convo.unmuteConvo";
  static def = "main";
  static kind = "procedure";
  static http = "POST";
  static errorNames = ["InvalidConvo"];
  convoId;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({});
  }
  toBody() {
    return jsonOf({
      convoId: this["convoId"]
    });
  }
  check() {
    const issues = [];
    if (this["convoId"] == null) issues.push({ path: "convoId", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _ChatBskyConvoUnmuteConvo.nsid,
      method: "POST",
      params: this.toParams(),
      body: this.toBody(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ChatBskyConvoUnmuteConvo(value);
    record.check();
    return record;
  }
};
var ChatBskyConvoUpdateAllRead = class _ChatBskyConvoUpdateAllRead {
  static nsid = "chat.bsky.convo.updateAllRead";
  static def = "main";
  static kind = "procedure";
  static http = "POST";
  static errorNames = [];
  status;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({});
  }
  toBody() {
    return jsonOf({
      status: this["status"]
    });
  }
  check() {
    const issues = [];
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _ChatBskyConvoUpdateAllRead.nsid,
      method: "POST",
      params: this.toParams(),
      body: this.toBody(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ChatBskyConvoUpdateAllRead(value);
    record.check();
    return record;
  }
};
var ChatBskyConvoUpdateRead = class _ChatBskyConvoUpdateRead {
  static nsid = "chat.bsky.convo.updateRead";
  static def = "main";
  static kind = "procedure";
  static http = "POST";
  static errorNames = ["InvalidConvo"];
  convoId;
  messageId;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({});
  }
  toBody() {
    return jsonOf({
      convoId: this["convoId"],
      messageId: this["messageId"]
    });
  }
  check() {
    const issues = [];
    if (this["convoId"] == null) issues.push({ path: "convoId", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _ChatBskyConvoUpdateRead.nsid,
      method: "POST",
      params: this.toParams(),
      body: this.toBody(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ChatBskyConvoUpdateRead(value);
    record.check();
    return record;
  }
};
var ChatBskyEmbedJoinLink = class _ChatBskyEmbedJoinLink {
  static nsid = "chat.bsky.embed.joinLink";
  static def = "main";
  static kind = "object";
  $type;
  code;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "chat.bsky.embed.joinLink";
  }
  check() {
    const issues = [];
    if (this["code"] == null) issues.push({ path: "code", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      code: this["code"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ChatBskyEmbedJoinLink(value);
    record.check();
    return record;
  }
};
var ChatBskyEmbedJoinLinkView = class _ChatBskyEmbedJoinLinkView {
  static nsid = "chat.bsky.embed.joinLink";
  static def = "view";
  static kind = "object";
  $type;
  joinLinkPreview;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "chat.bsky.embed.joinLink#view";
  }
  check() {
    const issues = [];
    if (this["joinLinkPreview"] == null) issues.push({ path: "joinLinkPreview", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      joinLinkPreview: this["joinLinkPreview"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ChatBskyEmbedJoinLinkView(value);
    record.check();
    return record;
  }
};
var ChatBskyGroupAddMembers = class _ChatBskyGroupAddMembers {
  static nsid = "chat.bsky.group.addMembers";
  static def = "main";
  static kind = "procedure";
  static http = "POST";
  static errorNames = ["AccountSuspended", "BlockedActor", "BlockedSubject", "ConvoLocked", "InsufficientRole", "InvalidConvo", "MemberLimitReached", "NotFollowedBySender", "RecipientNotFound", "UserForbidsGroups"];
  convoId;
  members;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({});
  }
  toBody() {
    return jsonOf({
      convoId: this["convoId"],
      members: this["members"]
    });
  }
  check() {
    const issues = [];
    if (this["convoId"] == null) issues.push({ path: "convoId", message: "Required." });
    if (this["members"] == null) issues.push({ path: "members", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _ChatBskyGroupAddMembers.nsid,
      method: "POST",
      params: this.toParams(),
      body: this.toBody(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ChatBskyGroupAddMembers(value);
    record.check();
    return record;
  }
};
var ChatBskyGroupApproveJoinRequest = class _ChatBskyGroupApproveJoinRequest {
  static nsid = "chat.bsky.group.approveJoinRequest";
  static def = "main";
  static kind = "procedure";
  static http = "POST";
  static errorNames = ["InvalidConvo", "InsufficientRole", "MemberLimitReached"];
  convoId;
  member;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({});
  }
  toBody() {
    return jsonOf({
      convoId: this["convoId"],
      member: this["member"]
    });
  }
  check() {
    const issues = [];
    if (this["convoId"] == null) issues.push({ path: "convoId", message: "Required." });
    if (this["member"] == null) issues.push({ path: "member", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _ChatBskyGroupApproveJoinRequest.nsid,
      method: "POST",
      params: this.toParams(),
      body: this.toBody(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ChatBskyGroupApproveJoinRequest(value);
    record.check();
    return record;
  }
};
var ChatBskyGroupCreateGroup = class _ChatBskyGroupCreateGroup {
  static nsid = "chat.bsky.group.createGroup";
  static def = "main";
  static kind = "procedure";
  static http = "POST";
  static errorNames = ["AccountSuspended", "BlockedActor", "BlockedSubject", "NewAccountCannotCreateGroup", "NotFollowedBySender", "RecipientNotFound", "UserForbidsGroups"];
  members;
  name;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({});
  }
  toBody() {
    return jsonOf({
      members: this["members"],
      name: this["name"]
    });
  }
  check() {
    const issues = [];
    if (this["members"] == null) issues.push({ path: "members", message: "Required." });
    if (this["name"] == null) issues.push({ path: "name", message: "Required." });
    if (typeof this["name"] === "string" && this["name"].length > 500) issues.push({ path: "name", message: "Must be at most 500 characters." });
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _ChatBskyGroupCreateGroup.nsid,
      method: "POST",
      params: this.toParams(),
      body: this.toBody(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ChatBskyGroupCreateGroup(value);
    record.check();
    return record;
  }
};
var ChatBskyGroupCreateJoinLink = class _ChatBskyGroupCreateJoinLink {
  static nsid = "chat.bsky.group.createJoinLink";
  static def = "main";
  static kind = "procedure";
  static http = "POST";
  static errorNames = ["EnabledJoinLinkAlreadyExists", "InvalidConvo", "InsufficientRole"];
  convoId;
  requireApproval;
  joinRule;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({});
  }
  toBody() {
    return jsonOf({
      convoId: this["convoId"],
      requireApproval: this["requireApproval"],
      joinRule: this["joinRule"]
    });
  }
  check() {
    const issues = [];
    if (this["convoId"] == null) issues.push({ path: "convoId", message: "Required." });
    if (this["joinRule"] == null) issues.push({ path: "joinRule", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _ChatBskyGroupCreateJoinLink.nsid,
      method: "POST",
      params: this.toParams(),
      body: this.toBody(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ChatBskyGroupCreateJoinLink(value);
    record.check();
    return record;
  }
};
var ChatBskyGroupDefsDisabledJoinLinkPreviewView = class _ChatBskyGroupDefsDisabledJoinLinkPreviewView {
  static nsid = "chat.bsky.group.defs";
  static def = "disabledJoinLinkPreviewView";
  static kind = "object";
  $type;
  code;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "chat.bsky.group.defs#disabledJoinLinkPreviewView";
  }
  check() {
    const issues = [];
    if (this["code"] == null) issues.push({ path: "code", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      code: this["code"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ChatBskyGroupDefsDisabledJoinLinkPreviewView(value);
    record.check();
    return record;
  }
};
var ChatBskyGroupDefsInvalidJoinLinkPreviewView = class _ChatBskyGroupDefsInvalidJoinLinkPreviewView {
  static nsid = "chat.bsky.group.defs";
  static def = "invalidJoinLinkPreviewView";
  static kind = "object";
  $type;
  code;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "chat.bsky.group.defs#invalidJoinLinkPreviewView";
  }
  check() {
    const issues = [];
    if (this["code"] == null) issues.push({ path: "code", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      code: this["code"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ChatBskyGroupDefsInvalidJoinLinkPreviewView(value);
    record.check();
    return record;
  }
};
var ChatBskyGroupDefsJoinLinkPreviewView = class _ChatBskyGroupDefsJoinLinkPreviewView {
  static nsid = "chat.bsky.group.defs";
  static def = "joinLinkPreviewView";
  static kind = "object";
  $type;
  convoId;
  code;
  name;
  owner;
  memberCount;
  memberLimit;
  requireApproval;
  joinRule;
  convo;
  viewer;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "chat.bsky.group.defs#joinLinkPreviewView";
  }
  check() {
    const issues = [];
    if (this["convoId"] == null) issues.push({ path: "convoId", message: "Required." });
    if (this["code"] == null) issues.push({ path: "code", message: "Required." });
    if (this["name"] == null) issues.push({ path: "name", message: "Required." });
    if (this["owner"] == null) issues.push({ path: "owner", message: "Required." });
    if (this["memberCount"] == null) issues.push({ path: "memberCount", message: "Required." });
    if (this["memberCount"] != null) {
      if (!Number.isInteger(this["memberCount"])) issues.push({ path: "memberCount", message: "Must be an integer." });
    }
    if (this["memberLimit"] == null) issues.push({ path: "memberLimit", message: "Required." });
    if (this["memberLimit"] != null) {
      if (!Number.isInteger(this["memberLimit"])) issues.push({ path: "memberLimit", message: "Must be an integer." });
    }
    if (this["requireApproval"] == null) issues.push({ path: "requireApproval", message: "Required." });
    if (this["joinRule"] == null) issues.push({ path: "joinRule", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      convoId: this["convoId"],
      code: this["code"],
      name: this["name"],
      owner: this["owner"],
      memberCount: this["memberCount"],
      memberLimit: this["memberLimit"],
      requireApproval: this["requireApproval"],
      joinRule: this["joinRule"],
      convo: this["convo"],
      viewer: this["viewer"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ChatBskyGroupDefsJoinLinkPreviewView(value);
    record.check();
    return record;
  }
};
var ChatBskyGroupDefsJoinLinkView = class _ChatBskyGroupDefsJoinLinkView {
  static nsid = "chat.bsky.group.defs";
  static def = "joinLinkView";
  static kind = "object";
  $type;
  code;
  enabledStatus;
  requireApproval;
  joinRule;
  createdAt;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "chat.bsky.group.defs#joinLinkView";
  }
  check() {
    const issues = [];
    if (this["code"] == null) issues.push({ path: "code", message: "Required." });
    if (this["enabledStatus"] == null) issues.push({ path: "enabledStatus", message: "Required." });
    if (this["requireApproval"] == null) issues.push({ path: "requireApproval", message: "Required." });
    if (this["joinRule"] == null) issues.push({ path: "joinRule", message: "Required." });
    if (this["createdAt"] == null) issues.push({ path: "createdAt", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      code: this["code"],
      enabledStatus: this["enabledStatus"],
      requireApproval: this["requireApproval"],
      joinRule: this["joinRule"],
      createdAt: this["createdAt"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ChatBskyGroupDefsJoinLinkView(value);
    record.check();
    return record;
  }
};
var ChatBskyGroupDefsJoinLinkViewerState = class _ChatBskyGroupDefsJoinLinkViewerState {
  static nsid = "chat.bsky.group.defs";
  static def = "joinLinkViewerState";
  static kind = "object";
  $type;
  requestedAt;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "chat.bsky.group.defs#joinLinkViewerState";
  }
  check() {
    const issues = [];
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      requestedAt: this["requestedAt"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ChatBskyGroupDefsJoinLinkViewerState(value);
    record.check();
    return record;
  }
};
var ChatBskyGroupDefsJoinRequestConvoView = class _ChatBskyGroupDefsJoinRequestConvoView {
  static nsid = "chat.bsky.group.defs";
  static def = "joinRequestConvoView";
  static kind = "object";
  $type;
  convoId;
  name;
  owner;
  memberCount;
  memberLimit;
  viewer;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "chat.bsky.group.defs#joinRequestConvoView";
  }
  check() {
    const issues = [];
    if (this["convoId"] == null) issues.push({ path: "convoId", message: "Required." });
    if (this["name"] == null) issues.push({ path: "name", message: "Required." });
    if (this["owner"] == null) issues.push({ path: "owner", message: "Required." });
    if (this["memberCount"] == null) issues.push({ path: "memberCount", message: "Required." });
    if (this["memberCount"] != null) {
      if (!Number.isInteger(this["memberCount"])) issues.push({ path: "memberCount", message: "Must be an integer." });
    }
    if (this["memberLimit"] == null) issues.push({ path: "memberLimit", message: "Required." });
    if (this["memberLimit"] != null) {
      if (!Number.isInteger(this["memberLimit"])) issues.push({ path: "memberLimit", message: "Must be an integer." });
    }
    if (this["viewer"] == null) issues.push({ path: "viewer", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      convoId: this["convoId"],
      name: this["name"],
      owner: this["owner"],
      memberCount: this["memberCount"],
      memberLimit: this["memberLimit"],
      viewer: this["viewer"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ChatBskyGroupDefsJoinRequestConvoView(value);
    record.check();
    return record;
  }
};
var ChatBskyGroupDefsJoinRequestView = class _ChatBskyGroupDefsJoinRequestView {
  static nsid = "chat.bsky.group.defs";
  static def = "joinRequestView";
  static kind = "object";
  $type;
  convoId;
  requestedBy;
  requestedAt;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "chat.bsky.group.defs#joinRequestView";
  }
  check() {
    const issues = [];
    if (this["convoId"] == null) issues.push({ path: "convoId", message: "Required." });
    if (this["requestedBy"] == null) issues.push({ path: "requestedBy", message: "Required." });
    if (this["requestedAt"] == null) issues.push({ path: "requestedAt", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      convoId: this["convoId"],
      requestedBy: this["requestedBy"],
      requestedAt: this["requestedAt"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ChatBskyGroupDefsJoinRequestView(value);
    record.check();
    return record;
  }
};
var ChatBskyGroupDefsJoinRule = class _ChatBskyGroupDefsJoinRule {
  static nsid = "chat.bsky.group.defs";
  static def = "joinRule";
  static kind = "string";
  static knownValues = ["anyone", "followedByOwner"];
  static includes(value) {
    return _ChatBskyGroupDefsJoinRule.knownValues.includes(value);
  }
  constructor() {
  }
};
var ChatBskyGroupDefsLinkEnabledStatus = class _ChatBskyGroupDefsLinkEnabledStatus {
  static nsid = "chat.bsky.group.defs";
  static def = "linkEnabledStatus";
  static kind = "string";
  static knownValues = ["enabled", "disabled"];
  static includes(value) {
    return _ChatBskyGroupDefsLinkEnabledStatus.knownValues.includes(value);
  }
  constructor() {
  }
};
var ChatBskyGroupDisableJoinLink = class _ChatBskyGroupDisableJoinLink {
  static nsid = "chat.bsky.group.disableJoinLink";
  static def = "main";
  static kind = "procedure";
  static http = "POST";
  static errorNames = ["InvalidConvo", "InsufficientRole", "NoJoinLink"];
  convoId;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({});
  }
  toBody() {
    return jsonOf({
      convoId: this["convoId"]
    });
  }
  check() {
    const issues = [];
    if (this["convoId"] == null) issues.push({ path: "convoId", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _ChatBskyGroupDisableJoinLink.nsid,
      method: "POST",
      params: this.toParams(),
      body: this.toBody(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ChatBskyGroupDisableJoinLink(value);
    record.check();
    return record;
  }
};
var ChatBskyGroupEditGroup = class _ChatBskyGroupEditGroup {
  static nsid = "chat.bsky.group.editGroup";
  static def = "main";
  static kind = "procedure";
  static http = "POST";
  static errorNames = ["ConvoLocked", "InvalidConvo", "InsufficientRole"];
  convoId;
  name;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({});
  }
  toBody() {
    return jsonOf({
      convoId: this["convoId"],
      name: this["name"]
    });
  }
  check() {
    const issues = [];
    if (this["convoId"] == null) issues.push({ path: "convoId", message: "Required." });
    if (this["name"] == null) issues.push({ path: "name", message: "Required." });
    if (typeof this["name"] === "string" && this["name"].length > 500) issues.push({ path: "name", message: "Must be at most 500 characters." });
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _ChatBskyGroupEditGroup.nsid,
      method: "POST",
      params: this.toParams(),
      body: this.toBody(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ChatBskyGroupEditGroup(value);
    record.check();
    return record;
  }
};
var ChatBskyGroupEditJoinLink = class _ChatBskyGroupEditJoinLink {
  static nsid = "chat.bsky.group.editJoinLink";
  static def = "main";
  static kind = "procedure";
  static http = "POST";
  static errorNames = ["InvalidConvo", "InsufficientRole", "NoJoinLink"];
  convoId;
  requireApproval;
  joinRule;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({});
  }
  toBody() {
    return jsonOf({
      convoId: this["convoId"],
      requireApproval: this["requireApproval"],
      joinRule: this["joinRule"]
    });
  }
  check() {
    const issues = [];
    if (this["convoId"] == null) issues.push({ path: "convoId", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _ChatBskyGroupEditJoinLink.nsid,
      method: "POST",
      params: this.toParams(),
      body: this.toBody(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ChatBskyGroupEditJoinLink(value);
    record.check();
    return record;
  }
};
var ChatBskyGroupEnableJoinLink = class _ChatBskyGroupEnableJoinLink {
  static nsid = "chat.bsky.group.enableJoinLink";
  static def = "main";
  static kind = "procedure";
  static http = "POST";
  static errorNames = ["InvalidConvo", "InsufficientRole", "NoJoinLink", "LinkAlreadyEnabled"];
  convoId;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({});
  }
  toBody() {
    return jsonOf({
      convoId: this["convoId"]
    });
  }
  check() {
    const issues = [];
    if (this["convoId"] == null) issues.push({ path: "convoId", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _ChatBskyGroupEnableJoinLink.nsid,
      method: "POST",
      params: this.toParams(),
      body: this.toBody(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ChatBskyGroupEnableJoinLink(value);
    record.check();
    return record;
  }
};
var ChatBskyGroupGetJoinLinkPreviews = class _ChatBskyGroupGetJoinLinkPreviews {
  static nsid = "chat.bsky.group.getJoinLinkPreviews";
  static def = "main";
  static kind = "query";
  static http = "GET";
  static errorNames = [];
  codes;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({
      codes: this["codes"]
    });
  }
  check() {
    const issues = [];
    if (this["codes"] == null) issues.push({ path: "codes", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _ChatBskyGroupGetJoinLinkPreviews.nsid,
      method: "GET",
      params: this.toParams(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ChatBskyGroupGetJoinLinkPreviews(value);
    record.check();
    return record;
  }
};
var ChatBskyGroupListJoinRequests = class _ChatBskyGroupListJoinRequests {
  static nsid = "chat.bsky.group.listJoinRequests";
  static def = "main";
  static kind = "query";
  static http = "GET";
  static errorNames = ["InvalidConvo", "InsufficientRole"];
  convoId;
  limit;
  cursor;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({
      convoId: this["convoId"],
      limit: this["limit"],
      cursor: this["cursor"]
    });
  }
  check() {
    const issues = [];
    if (this["convoId"] == null) issues.push({ path: "convoId", message: "Required." });
    if (this["limit"] != null) {
      if (!Number.isInteger(this["limit"])) issues.push({ path: "limit", message: "Must be an integer." });
      else if (this["limit"] < 1) issues.push({ path: "limit", message: "Must be at least 1." });
      else if (this["limit"] > 100) issues.push({ path: "limit", message: "Must be at most 100." });
    }
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _ChatBskyGroupListJoinRequests.nsid,
      method: "GET",
      params: this.toParams(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ChatBskyGroupListJoinRequests(value);
    record.check();
    return record;
  }
};
var ChatBskyGroupListMutualGroups = class _ChatBskyGroupListMutualGroups {
  static nsid = "chat.bsky.group.listMutualGroups";
  static def = "main";
  static kind = "query";
  static http = "GET";
  static errorNames = [];
  subject;
  limit;
  cursor;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({
      subject: this["subject"],
      limit: this["limit"],
      cursor: this["cursor"]
    });
  }
  check() {
    const issues = [];
    if (this["subject"] == null) issues.push({ path: "subject", message: "Required." });
    if (this["limit"] != null) {
      if (!Number.isInteger(this["limit"])) issues.push({ path: "limit", message: "Must be an integer." });
      else if (this["limit"] < 1) issues.push({ path: "limit", message: "Must be at least 1." });
      else if (this["limit"] > 100) issues.push({ path: "limit", message: "Must be at most 100." });
    }
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _ChatBskyGroupListMutualGroups.nsid,
      method: "GET",
      params: this.toParams(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ChatBskyGroupListMutualGroups(value);
    record.check();
    return record;
  }
};
var ChatBskyGroupRejectJoinRequest = class _ChatBskyGroupRejectJoinRequest {
  static nsid = "chat.bsky.group.rejectJoinRequest";
  static def = "main";
  static kind = "procedure";
  static http = "POST";
  static errorNames = ["InvalidConvo", "InsufficientRole"];
  convoId;
  member;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({});
  }
  toBody() {
    return jsonOf({
      convoId: this["convoId"],
      member: this["member"]
    });
  }
  check() {
    const issues = [];
    if (this["convoId"] == null) issues.push({ path: "convoId", message: "Required." });
    if (this["member"] == null) issues.push({ path: "member", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _ChatBskyGroupRejectJoinRequest.nsid,
      method: "POST",
      params: this.toParams(),
      body: this.toBody(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ChatBskyGroupRejectJoinRequest(value);
    record.check();
    return record;
  }
};
var ChatBskyGroupRemoveMembers = class _ChatBskyGroupRemoveMembers {
  static nsid = "chat.bsky.group.removeMembers";
  static def = "main";
  static kind = "procedure";
  static http = "POST";
  static errorNames = ["InvalidConvo", "InsufficientRole"];
  convoId;
  members;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({});
  }
  toBody() {
    return jsonOf({
      convoId: this["convoId"],
      members: this["members"]
    });
  }
  check() {
    const issues = [];
    if (this["convoId"] == null) issues.push({ path: "convoId", message: "Required." });
    if (this["members"] == null) issues.push({ path: "members", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _ChatBskyGroupRemoveMembers.nsid,
      method: "POST",
      params: this.toParams(),
      body: this.toBody(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ChatBskyGroupRemoveMembers(value);
    record.check();
    return record;
  }
};
var ChatBskyGroupRequestJoin = class _ChatBskyGroupRequestJoin {
  static nsid = "chat.bsky.group.requestJoin";
  static def = "main";
  static kind = "procedure";
  static http = "POST";
  static errorNames = ["ConvoLocked", "FollowRequired", "InvalidCode", "LinkDisabled", "MemberLimitReached", "UserKicked"];
  code;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({});
  }
  toBody() {
    return jsonOf({
      code: this["code"]
    });
  }
  check() {
    const issues = [];
    if (this["code"] == null) issues.push({ path: "code", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _ChatBskyGroupRequestJoin.nsid,
      method: "POST",
      params: this.toParams(),
      body: this.toBody(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ChatBskyGroupRequestJoin(value);
    record.check();
    return record;
  }
};
var ChatBskyGroupUpdateJoinRequestsRead = class _ChatBskyGroupUpdateJoinRequestsRead {
  static nsid = "chat.bsky.group.updateJoinRequestsRead";
  static def = "main";
  static kind = "procedure";
  static http = "POST";
  static errorNames = ["InvalidConvo", "InsufficientRole"];
  convoId;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({});
  }
  toBody() {
    return jsonOf({
      convoId: this["convoId"]
    });
  }
  check() {
    const issues = [];
    if (this["convoId"] == null) issues.push({ path: "convoId", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _ChatBskyGroupUpdateJoinRequestsRead.nsid,
      method: "POST",
      params: this.toParams(),
      body: this.toBody(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ChatBskyGroupUpdateJoinRequestsRead(value);
    record.check();
    return record;
  }
};
var ChatBskyGroupWithdrawJoinRequest = class _ChatBskyGroupWithdrawJoinRequest {
  static nsid = "chat.bsky.group.withdrawJoinRequest";
  static def = "main";
  static kind = "procedure";
  static http = "POST";
  static errorNames = ["InvalidJoinRequest"];
  convoId;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({});
  }
  toBody() {
    return jsonOf({
      convoId: this["convoId"]
    });
  }
  check() {
    const issues = [];
    if (this["convoId"] == null) issues.push({ path: "convoId", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _ChatBskyGroupWithdrawJoinRequest.nsid,
      method: "POST",
      params: this.toParams(),
      body: this.toBody(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ChatBskyGroupWithdrawJoinRequest(value);
    record.check();
    return record;
  }
};
var ChatBskyModerationDefsConvoView = class _ChatBskyModerationDefsConvoView {
  static nsid = "chat.bsky.moderation.defs";
  static def = "convoView";
  static kind = "object";
  $type;
  id;
  rev;
  kind;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "chat.bsky.moderation.defs#convoView";
  }
  check() {
    const issues = [];
    if (this["id"] == null) issues.push({ path: "id", message: "Required." });
    if (this["rev"] == null) issues.push({ path: "rev", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      id: this["id"],
      rev: this["rev"],
      kind: this["kind"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ChatBskyModerationDefsConvoView(value);
    record.check();
    return record;
  }
};
var ChatBskyModerationDefsDirectConvo = class _ChatBskyModerationDefsDirectConvo {
  static nsid = "chat.bsky.moderation.defs";
  static def = "directConvo";
  static kind = "object";
  $type;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "chat.bsky.moderation.defs#directConvo";
  }
  check() {
    const issues = [];
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ChatBskyModerationDefsDirectConvo(value);
    record.check();
    return record;
  }
};
var ChatBskyModerationDefsGroupConvo = class _ChatBskyModerationDefsGroupConvo {
  static nsid = "chat.bsky.moderation.defs";
  static def = "groupConvo";
  static kind = "object";
  $type;
  createdAt;
  joinLink;
  joinRequestCount;
  lockStatus;
  memberCount;
  memberLimit;
  name;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "chat.bsky.moderation.defs#groupConvo";
  }
  check() {
    const issues = [];
    if (this["createdAt"] == null) issues.push({ path: "createdAt", message: "Required." });
    if (this["joinRequestCount"] == null) issues.push({ path: "joinRequestCount", message: "Required." });
    if (this["joinRequestCount"] != null) {
      if (!Number.isInteger(this["joinRequestCount"])) issues.push({ path: "joinRequestCount", message: "Must be an integer." });
    }
    if (this["lockStatus"] == null) issues.push({ path: "lockStatus", message: "Required." });
    if (this["memberCount"] == null) issues.push({ path: "memberCount", message: "Required." });
    if (this["memberCount"] != null) {
      if (!Number.isInteger(this["memberCount"])) issues.push({ path: "memberCount", message: "Must be an integer." });
    }
    if (this["memberLimit"] == null) issues.push({ path: "memberLimit", message: "Required." });
    if (this["memberLimit"] != null) {
      if (!Number.isInteger(this["memberLimit"])) issues.push({ path: "memberLimit", message: "Must be an integer." });
    }
    if (this["name"] == null) issues.push({ path: "name", message: "Required." });
    if (typeof this["name"] === "string" && this["name"].length > 500) issues.push({ path: "name", message: "Must be at most 500 characters." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      createdAt: this["createdAt"],
      joinLink: this["joinLink"],
      joinRequestCount: this["joinRequestCount"],
      lockStatus: this["lockStatus"],
      memberCount: this["memberCount"],
      memberLimit: this["memberLimit"],
      name: this["name"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ChatBskyModerationDefsGroupConvo(value);
    record.check();
    return record;
  }
};
var ChatBskyModerationGetActorMetadata = class _ChatBskyModerationGetActorMetadata {
  static nsid = "chat.bsky.moderation.getActorMetadata";
  static def = "main";
  static kind = "query";
  static http = "GET";
  static errorNames = [];
  actor;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({
      actor: this["actor"]
    });
  }
  check() {
    const issues = [];
    if (this["actor"] == null) issues.push({ path: "actor", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _ChatBskyModerationGetActorMetadata.nsid,
      method: "GET",
      params: this.toParams(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ChatBskyModerationGetActorMetadata(value);
    record.check();
    return record;
  }
};
var ChatBskyModerationGetActorMetadataMetadata = class _ChatBskyModerationGetActorMetadataMetadata {
  static nsid = "chat.bsky.moderation.getActorMetadata";
  static def = "metadata";
  static kind = "object";
  $type;
  messagesSent;
  messagesReceived;
  convos;
  convosStarted;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "chat.bsky.moderation.getActorMetadata#metadata";
  }
  check() {
    const issues = [];
    if (this["messagesSent"] == null) issues.push({ path: "messagesSent", message: "Required." });
    if (this["messagesSent"] != null) {
      if (!Number.isInteger(this["messagesSent"])) issues.push({ path: "messagesSent", message: "Must be an integer." });
    }
    if (this["messagesReceived"] == null) issues.push({ path: "messagesReceived", message: "Required." });
    if (this["messagesReceived"] != null) {
      if (!Number.isInteger(this["messagesReceived"])) issues.push({ path: "messagesReceived", message: "Must be an integer." });
    }
    if (this["convos"] == null) issues.push({ path: "convos", message: "Required." });
    if (this["convos"] != null) {
      if (!Number.isInteger(this["convos"])) issues.push({ path: "convos", message: "Must be an integer." });
    }
    if (this["convosStarted"] == null) issues.push({ path: "convosStarted", message: "Required." });
    if (this["convosStarted"] != null) {
      if (!Number.isInteger(this["convosStarted"])) issues.push({ path: "convosStarted", message: "Must be an integer." });
    }
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      messagesSent: this["messagesSent"],
      messagesReceived: this["messagesReceived"],
      convos: this["convos"],
      convosStarted: this["convosStarted"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ChatBskyModerationGetActorMetadataMetadata(value);
    record.check();
    return record;
  }
};
var ChatBskyModerationGetConvo = class _ChatBskyModerationGetConvo {
  static nsid = "chat.bsky.moderation.getConvo";
  static def = "main";
  static kind = "query";
  static http = "GET";
  static errorNames = ["InvalidConvo"];
  convoId;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({
      convoId: this["convoId"]
    });
  }
  check() {
    const issues = [];
    if (this["convoId"] == null) issues.push({ path: "convoId", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _ChatBskyModerationGetConvo.nsid,
      method: "GET",
      params: this.toParams(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ChatBskyModerationGetConvo(value);
    record.check();
    return record;
  }
};
var ChatBskyModerationGetConvoMembers = class _ChatBskyModerationGetConvoMembers {
  static nsid = "chat.bsky.moderation.getConvoMembers";
  static def = "main";
  static kind = "query";
  static http = "GET";
  static errorNames = ["InvalidConvo"];
  convoId;
  limit;
  cursor;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({
      convoId: this["convoId"],
      limit: this["limit"],
      cursor: this["cursor"]
    });
  }
  check() {
    const issues = [];
    if (this["convoId"] == null) issues.push({ path: "convoId", message: "Required." });
    if (this["limit"] != null) {
      if (!Number.isInteger(this["limit"])) issues.push({ path: "limit", message: "Must be an integer." });
      else if (this["limit"] < 1) issues.push({ path: "limit", message: "Must be at least 1." });
      else if (this["limit"] > 100) issues.push({ path: "limit", message: "Must be at most 100." });
    }
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _ChatBskyModerationGetConvoMembers.nsid,
      method: "GET",
      params: this.toParams(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ChatBskyModerationGetConvoMembers(value);
    record.check();
    return record;
  }
};
var ChatBskyModerationGetConvos = class _ChatBskyModerationGetConvos {
  static nsid = "chat.bsky.moderation.getConvos";
  static def = "main";
  static kind = "query";
  static http = "GET";
  static errorNames = [];
  convoIds;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({
      convoIds: this["convoIds"]
    });
  }
  check() {
    const issues = [];
    if (this["convoIds"] == null) issues.push({ path: "convoIds", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _ChatBskyModerationGetConvos.nsid,
      method: "GET",
      params: this.toParams(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ChatBskyModerationGetConvos(value);
    record.check();
    return record;
  }
};
var ChatBskyModerationGetMessageContext = class _ChatBskyModerationGetMessageContext {
  static nsid = "chat.bsky.moderation.getMessageContext";
  static def = "main";
  static kind = "query";
  static http = "GET";
  static errorNames = [];
  convoId;
  messageId;
  before;
  after;
  maxInterleavedSystemMessages;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({
      convoId: this["convoId"],
      messageId: this["messageId"],
      before: this["before"],
      after: this["after"],
      maxInterleavedSystemMessages: this["maxInterleavedSystemMessages"]
    });
  }
  check() {
    const issues = [];
    if (this["messageId"] == null) issues.push({ path: "messageId", message: "Required." });
    if (this["before"] != null) {
      if (!Number.isInteger(this["before"])) issues.push({ path: "before", message: "Must be an integer." });
    }
    if (this["after"] != null) {
      if (!Number.isInteger(this["after"])) issues.push({ path: "after", message: "Must be an integer." });
    }
    if (this["maxInterleavedSystemMessages"] != null) {
      if (!Number.isInteger(this["maxInterleavedSystemMessages"])) issues.push({ path: "maxInterleavedSystemMessages", message: "Must be an integer." });
      else if (this["maxInterleavedSystemMessages"] < 0) issues.push({ path: "maxInterleavedSystemMessages", message: "Must be at least 0." });
      else if (this["maxInterleavedSystemMessages"] > 1e3) issues.push({ path: "maxInterleavedSystemMessages", message: "Must be at most 1000." });
    }
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _ChatBskyModerationGetMessageContext.nsid,
      method: "GET",
      params: this.toParams(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ChatBskyModerationGetMessageContext(value);
    record.check();
    return record;
  }
};
var ChatBskyModerationSubscribeModEvents = class _ChatBskyModerationSubscribeModEvents {
  static nsid = "chat.bsky.moderation.subscribeModEvents";
  static def = "main";
  static kind = "subscription";
  static http = "WEBSOCKET";
  static errorNames = ["FutureCursor", "ConsumerTooSlow"];
  cursor;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({
      cursor: this["cursor"]
    });
  }
  check() {
    const issues = [];
    if (issues.length) throw new ValidationError(issues);
  }
  async send(_client, _options = {}) {
    throw new ProtocolError("ChatBskyModerationSubscribeModEvents is a websocket subscription.");
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ChatBskyModerationSubscribeModEvents(value);
    record.check();
    return record;
  }
};
var ChatBskyModerationSubscribeModEventsEventChatAccepted = class _ChatBskyModerationSubscribeModEventsEventChatAccepted {
  static nsid = "chat.bsky.moderation.subscribeModEvents";
  static def = "eventChatAccepted";
  static kind = "object";
  $type;
  actorDid;
  convoCreatedAt;
  convoId;
  createdAt;
  groupMemberCount;
  groupName;
  method;
  ownerDid;
  rev;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "chat.bsky.moderation.subscribeModEvents#eventChatAccepted";
  }
  check() {
    const issues = [];
    if (this["actorDid"] == null) issues.push({ path: "actorDid", message: "Required." });
    if (this["convoCreatedAt"] == null) issues.push({ path: "convoCreatedAt", message: "Required." });
    if (this["convoId"] == null) issues.push({ path: "convoId", message: "Required." });
    if (this["createdAt"] == null) issues.push({ path: "createdAt", message: "Required." });
    if (this["groupMemberCount"] != null) {
      if (!Number.isInteger(this["groupMemberCount"])) issues.push({ path: "groupMemberCount", message: "Must be an integer." });
    }
    if (this["method"] == null) issues.push({ path: "method", message: "Required." });
    if (this["rev"] == null) issues.push({ path: "rev", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      actorDid: this["actorDid"],
      convoCreatedAt: this["convoCreatedAt"],
      convoId: this["convoId"],
      createdAt: this["createdAt"],
      groupMemberCount: this["groupMemberCount"],
      groupName: this["groupName"],
      method: this["method"],
      ownerDid: this["ownerDid"],
      rev: this["rev"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ChatBskyModerationSubscribeModEventsEventChatAccepted(value);
    record.check();
    return record;
  }
};
var ChatBskyModerationSubscribeModEventsEventConvoFirstMessage = class _ChatBskyModerationSubscribeModEventsEventConvoFirstMessage {
  static nsid = "chat.bsky.moderation.subscribeModEvents";
  static def = "eventConvoFirstMessage";
  static kind = "object";
  $type;
  convoId;
  createdAt;
  messageId;
  recipients;
  rev;
  user;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "chat.bsky.moderation.subscribeModEvents#eventConvoFirstMessage";
  }
  check() {
    const issues = [];
    if (this["convoId"] == null) issues.push({ path: "convoId", message: "Required." });
    if (this["createdAt"] == null) issues.push({ path: "createdAt", message: "Required." });
    if (this["recipients"] == null) issues.push({ path: "recipients", message: "Required." });
    if (this["rev"] == null) issues.push({ path: "rev", message: "Required." });
    if (this["user"] == null) issues.push({ path: "user", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      convoId: this["convoId"],
      createdAt: this["createdAt"],
      messageId: this["messageId"],
      recipients: this["recipients"],
      rev: this["rev"],
      user: this["user"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ChatBskyModerationSubscribeModEventsEventConvoFirstMessage(value);
    record.check();
    return record;
  }
};
var ChatBskyModerationSubscribeModEventsEventGroupChatCreated = class _ChatBskyModerationSubscribeModEventsEventGroupChatCreated {
  static nsid = "chat.bsky.moderation.subscribeModEvents";
  static def = "eventGroupChatCreated";
  static kind = "object";
  $type;
  actorDid;
  convoCreatedAt;
  convoId;
  createdAt;
  groupMemberCount;
  groupName;
  initialMemberDids;
  ownerDid;
  rev;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "chat.bsky.moderation.subscribeModEvents#eventGroupChatCreated";
  }
  check() {
    const issues = [];
    if (this["actorDid"] == null) issues.push({ path: "actorDid", message: "Required." });
    if (this["convoCreatedAt"] == null) issues.push({ path: "convoCreatedAt", message: "Required." });
    if (this["convoId"] == null) issues.push({ path: "convoId", message: "Required." });
    if (this["createdAt"] == null) issues.push({ path: "createdAt", message: "Required." });
    if (this["groupMemberCount"] == null) issues.push({ path: "groupMemberCount", message: "Required." });
    if (this["groupMemberCount"] != null) {
      if (!Number.isInteger(this["groupMemberCount"])) issues.push({ path: "groupMemberCount", message: "Must be an integer." });
    }
    if (this["groupName"] == null) issues.push({ path: "groupName", message: "Required." });
    if (this["initialMemberDids"] == null) issues.push({ path: "initialMemberDids", message: "Required." });
    if (this["ownerDid"] == null) issues.push({ path: "ownerDid", message: "Required." });
    if (this["rev"] == null) issues.push({ path: "rev", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      actorDid: this["actorDid"],
      convoCreatedAt: this["convoCreatedAt"],
      convoId: this["convoId"],
      createdAt: this["createdAt"],
      groupMemberCount: this["groupMemberCount"],
      groupName: this["groupName"],
      initialMemberDids: this["initialMemberDids"],
      ownerDid: this["ownerDid"],
      rev: this["rev"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ChatBskyModerationSubscribeModEventsEventGroupChatCreated(value);
    record.check();
    return record;
  }
};
var ChatBskyModerationSubscribeModEventsEventGroupChatJoinRequest = class _ChatBskyModerationSubscribeModEventsEventGroupChatJoinRequest {
  static nsid = "chat.bsky.moderation.subscribeModEvents";
  static def = "eventGroupChatJoinRequest";
  static kind = "object";
  $type;
  actorDid;
  convoCreatedAt;
  convoId;
  createdAt;
  groupMemberCount;
  groupName;
  joinLinkCode;
  ownerDid;
  rev;
  subjectFollowsOwner;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "chat.bsky.moderation.subscribeModEvents#eventGroupChatJoinRequest";
  }
  check() {
    const issues = [];
    if (this["actorDid"] == null) issues.push({ path: "actorDid", message: "Required." });
    if (this["convoCreatedAt"] == null) issues.push({ path: "convoCreatedAt", message: "Required." });
    if (this["convoId"] == null) issues.push({ path: "convoId", message: "Required." });
    if (this["createdAt"] == null) issues.push({ path: "createdAt", message: "Required." });
    if (this["groupMemberCount"] == null) issues.push({ path: "groupMemberCount", message: "Required." });
    if (this["groupMemberCount"] != null) {
      if (!Number.isInteger(this["groupMemberCount"])) issues.push({ path: "groupMemberCount", message: "Must be an integer." });
    }
    if (this["groupName"] == null) issues.push({ path: "groupName", message: "Required." });
    if (this["joinLinkCode"] == null) issues.push({ path: "joinLinkCode", message: "Required." });
    if (this["ownerDid"] == null) issues.push({ path: "ownerDid", message: "Required." });
    if (this["rev"] == null) issues.push({ path: "rev", message: "Required." });
    if (this["subjectFollowsOwner"] == null) issues.push({ path: "subjectFollowsOwner", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      actorDid: this["actorDid"],
      convoCreatedAt: this["convoCreatedAt"],
      convoId: this["convoId"],
      createdAt: this["createdAt"],
      groupMemberCount: this["groupMemberCount"],
      groupName: this["groupName"],
      joinLinkCode: this["joinLinkCode"],
      ownerDid: this["ownerDid"],
      rev: this["rev"],
      subjectFollowsOwner: this["subjectFollowsOwner"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ChatBskyModerationSubscribeModEventsEventGroupChatJoinRequest(value);
    record.check();
    return record;
  }
};
var ChatBskyModerationSubscribeModEventsEventGroupChatJoinRequestApproved = class _ChatBskyModerationSubscribeModEventsEventGroupChatJoinRequestApproved {
  static nsid = "chat.bsky.moderation.subscribeModEvents";
  static def = "eventGroupChatJoinRequestApproved";
  static kind = "object";
  $type;
  actorDid;
  convoCreatedAt;
  convoId;
  createdAt;
  groupMemberCount;
  groupName;
  ownerDid;
  rev;
  subjectDid;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "chat.bsky.moderation.subscribeModEvents#eventGroupChatJoinRequestApproved";
  }
  check() {
    const issues = [];
    if (this["actorDid"] == null) issues.push({ path: "actorDid", message: "Required." });
    if (this["convoCreatedAt"] == null) issues.push({ path: "convoCreatedAt", message: "Required." });
    if (this["convoId"] == null) issues.push({ path: "convoId", message: "Required." });
    if (this["createdAt"] == null) issues.push({ path: "createdAt", message: "Required." });
    if (this["groupMemberCount"] == null) issues.push({ path: "groupMemberCount", message: "Required." });
    if (this["groupMemberCount"] != null) {
      if (!Number.isInteger(this["groupMemberCount"])) issues.push({ path: "groupMemberCount", message: "Must be an integer." });
    }
    if (this["groupName"] == null) issues.push({ path: "groupName", message: "Required." });
    if (this["ownerDid"] == null) issues.push({ path: "ownerDid", message: "Required." });
    if (this["rev"] == null) issues.push({ path: "rev", message: "Required." });
    if (this["subjectDid"] == null) issues.push({ path: "subjectDid", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      actorDid: this["actorDid"],
      convoCreatedAt: this["convoCreatedAt"],
      convoId: this["convoId"],
      createdAt: this["createdAt"],
      groupMemberCount: this["groupMemberCount"],
      groupName: this["groupName"],
      ownerDid: this["ownerDid"],
      rev: this["rev"],
      subjectDid: this["subjectDid"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ChatBskyModerationSubscribeModEventsEventGroupChatJoinRequestApproved(value);
    record.check();
    return record;
  }
};
var ChatBskyModerationSubscribeModEventsEventGroupChatJoinRequestRejected = class _ChatBskyModerationSubscribeModEventsEventGroupChatJoinRequestRejected {
  static nsid = "chat.bsky.moderation.subscribeModEvents";
  static def = "eventGroupChatJoinRequestRejected";
  static kind = "object";
  $type;
  actorDid;
  convoCreatedAt;
  convoId;
  createdAt;
  groupMemberCount;
  groupName;
  ownerDid;
  rev;
  subjectDid;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "chat.bsky.moderation.subscribeModEvents#eventGroupChatJoinRequestRejected";
  }
  check() {
    const issues = [];
    if (this["actorDid"] == null) issues.push({ path: "actorDid", message: "Required." });
    if (this["convoCreatedAt"] == null) issues.push({ path: "convoCreatedAt", message: "Required." });
    if (this["convoId"] == null) issues.push({ path: "convoId", message: "Required." });
    if (this["createdAt"] == null) issues.push({ path: "createdAt", message: "Required." });
    if (this["groupMemberCount"] == null) issues.push({ path: "groupMemberCount", message: "Required." });
    if (this["groupMemberCount"] != null) {
      if (!Number.isInteger(this["groupMemberCount"])) issues.push({ path: "groupMemberCount", message: "Must be an integer." });
    }
    if (this["groupName"] == null) issues.push({ path: "groupName", message: "Required." });
    if (this["ownerDid"] == null) issues.push({ path: "ownerDid", message: "Required." });
    if (this["rev"] == null) issues.push({ path: "rev", message: "Required." });
    if (this["subjectDid"] == null) issues.push({ path: "subjectDid", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      actorDid: this["actorDid"],
      convoCreatedAt: this["convoCreatedAt"],
      convoId: this["convoId"],
      createdAt: this["createdAt"],
      groupMemberCount: this["groupMemberCount"],
      groupName: this["groupName"],
      ownerDid: this["ownerDid"],
      rev: this["rev"],
      subjectDid: this["subjectDid"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ChatBskyModerationSubscribeModEventsEventGroupChatJoinRequestRejected(value);
    record.check();
    return record;
  }
};
var ChatBskyModerationSubscribeModEventsEventGroupChatMemberAdded = class _ChatBskyModerationSubscribeModEventsEventGroupChatMemberAdded {
  static nsid = "chat.bsky.moderation.subscribeModEvents";
  static def = "eventGroupChatMemberAdded";
  static kind = "object";
  $type;
  actorDid;
  convoCreatedAt;
  convoId;
  createdAt;
  groupMemberCount;
  groupName;
  ownerDid;
  requestMembersCount;
  rev;
  subjectDid;
  subjectFollowsOwner;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "chat.bsky.moderation.subscribeModEvents#eventGroupChatMemberAdded";
  }
  check() {
    const issues = [];
    if (this["actorDid"] == null) issues.push({ path: "actorDid", message: "Required." });
    if (this["convoCreatedAt"] == null) issues.push({ path: "convoCreatedAt", message: "Required." });
    if (this["convoId"] == null) issues.push({ path: "convoId", message: "Required." });
    if (this["createdAt"] == null) issues.push({ path: "createdAt", message: "Required." });
    if (this["groupMemberCount"] == null) issues.push({ path: "groupMemberCount", message: "Required." });
    if (this["groupMemberCount"] != null) {
      if (!Number.isInteger(this["groupMemberCount"])) issues.push({ path: "groupMemberCount", message: "Must be an integer." });
    }
    if (this["groupName"] == null) issues.push({ path: "groupName", message: "Required." });
    if (this["ownerDid"] == null) issues.push({ path: "ownerDid", message: "Required." });
    if (this["requestMembersCount"] == null) issues.push({ path: "requestMembersCount", message: "Required." });
    if (this["requestMembersCount"] != null) {
      if (!Number.isInteger(this["requestMembersCount"])) issues.push({ path: "requestMembersCount", message: "Must be an integer." });
    }
    if (this["rev"] == null) issues.push({ path: "rev", message: "Required." });
    if (this["subjectDid"] == null) issues.push({ path: "subjectDid", message: "Required." });
    if (this["subjectFollowsOwner"] == null) issues.push({ path: "subjectFollowsOwner", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      actorDid: this["actorDid"],
      convoCreatedAt: this["convoCreatedAt"],
      convoId: this["convoId"],
      createdAt: this["createdAt"],
      groupMemberCount: this["groupMemberCount"],
      groupName: this["groupName"],
      ownerDid: this["ownerDid"],
      requestMembersCount: this["requestMembersCount"],
      rev: this["rev"],
      subjectDid: this["subjectDid"],
      subjectFollowsOwner: this["subjectFollowsOwner"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ChatBskyModerationSubscribeModEventsEventGroupChatMemberAdded(value);
    record.check();
    return record;
  }
};
var ChatBskyModerationSubscribeModEventsEventGroupChatMemberJoined = class _ChatBskyModerationSubscribeModEventsEventGroupChatMemberJoined {
  static nsid = "chat.bsky.moderation.subscribeModEvents";
  static def = "eventGroupChatMemberJoined";
  static kind = "object";
  $type;
  actorDid;
  convoCreatedAt;
  convoId;
  createdAt;
  groupMemberCount;
  groupName;
  joinLinkCode;
  ownerDid;
  rev;
  subjectFollowsOwner;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "chat.bsky.moderation.subscribeModEvents#eventGroupChatMemberJoined";
  }
  check() {
    const issues = [];
    if (this["actorDid"] == null) issues.push({ path: "actorDid", message: "Required." });
    if (this["convoCreatedAt"] == null) issues.push({ path: "convoCreatedAt", message: "Required." });
    if (this["convoId"] == null) issues.push({ path: "convoId", message: "Required." });
    if (this["createdAt"] == null) issues.push({ path: "createdAt", message: "Required." });
    if (this["groupMemberCount"] == null) issues.push({ path: "groupMemberCount", message: "Required." });
    if (this["groupMemberCount"] != null) {
      if (!Number.isInteger(this["groupMemberCount"])) issues.push({ path: "groupMemberCount", message: "Must be an integer." });
    }
    if (this["groupName"] == null) issues.push({ path: "groupName", message: "Required." });
    if (this["joinLinkCode"] == null) issues.push({ path: "joinLinkCode", message: "Required." });
    if (this["ownerDid"] == null) issues.push({ path: "ownerDid", message: "Required." });
    if (this["rev"] == null) issues.push({ path: "rev", message: "Required." });
    if (this["subjectFollowsOwner"] == null) issues.push({ path: "subjectFollowsOwner", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      actorDid: this["actorDid"],
      convoCreatedAt: this["convoCreatedAt"],
      convoId: this["convoId"],
      createdAt: this["createdAt"],
      groupMemberCount: this["groupMemberCount"],
      groupName: this["groupName"],
      joinLinkCode: this["joinLinkCode"],
      ownerDid: this["ownerDid"],
      rev: this["rev"],
      subjectFollowsOwner: this["subjectFollowsOwner"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ChatBskyModerationSubscribeModEventsEventGroupChatMemberJoined(value);
    record.check();
    return record;
  }
};
var ChatBskyModerationSubscribeModEventsEventGroupChatMemberLeft = class _ChatBskyModerationSubscribeModEventsEventGroupChatMemberLeft {
  static nsid = "chat.bsky.moderation.subscribeModEvents";
  static def = "eventGroupChatMemberLeft";
  static kind = "object";
  $type;
  actorDid;
  convoCreatedAt;
  convoId;
  createdAt;
  groupMemberCount;
  groupName;
  leaveMethod;
  ownerDid;
  rev;
  subjectDid;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "chat.bsky.moderation.subscribeModEvents#eventGroupChatMemberLeft";
  }
  check() {
    const issues = [];
    if (this["actorDid"] == null) issues.push({ path: "actorDid", message: "Required." });
    if (this["convoCreatedAt"] == null) issues.push({ path: "convoCreatedAt", message: "Required." });
    if (this["convoId"] == null) issues.push({ path: "convoId", message: "Required." });
    if (this["createdAt"] == null) issues.push({ path: "createdAt", message: "Required." });
    if (this["groupMemberCount"] == null) issues.push({ path: "groupMemberCount", message: "Required." });
    if (this["groupMemberCount"] != null) {
      if (!Number.isInteger(this["groupMemberCount"])) issues.push({ path: "groupMemberCount", message: "Must be an integer." });
    }
    if (this["groupName"] == null) issues.push({ path: "groupName", message: "Required." });
    if (this["leaveMethod"] == null) issues.push({ path: "leaveMethod", message: "Required." });
    if (this["ownerDid"] == null) issues.push({ path: "ownerDid", message: "Required." });
    if (this["rev"] == null) issues.push({ path: "rev", message: "Required." });
    if (this["subjectDid"] == null) issues.push({ path: "subjectDid", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      actorDid: this["actorDid"],
      convoCreatedAt: this["convoCreatedAt"],
      convoId: this["convoId"],
      createdAt: this["createdAt"],
      groupMemberCount: this["groupMemberCount"],
      groupName: this["groupName"],
      leaveMethod: this["leaveMethod"],
      ownerDid: this["ownerDid"],
      rev: this["rev"],
      subjectDid: this["subjectDid"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ChatBskyModerationSubscribeModEventsEventGroupChatMemberLeft(value);
    record.check();
    return record;
  }
};
var ChatBskyModerationSubscribeModEventsEventGroupChatUpdated = class _ChatBskyModerationSubscribeModEventsEventGroupChatUpdated {
  static nsid = "chat.bsky.moderation.subscribeModEvents";
  static def = "eventGroupChatUpdated";
  static kind = "object";
  $type;
  actorDid;
  convoCreatedAt;
  convoId;
  createdAt;
  groupMemberCount;
  groupName;
  joinLinkCode;
  joinLinkFollowersOnly;
  joinLinkRequiresApproval;
  lockReason;
  newName;
  oldName;
  ownerDid;
  rev;
  updateType;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "chat.bsky.moderation.subscribeModEvents#eventGroupChatUpdated";
  }
  check() {
    const issues = [];
    if (this["actorDid"] == null) issues.push({ path: "actorDid", message: "Required." });
    if (this["convoCreatedAt"] == null) issues.push({ path: "convoCreatedAt", message: "Required." });
    if (this["convoId"] == null) issues.push({ path: "convoId", message: "Required." });
    if (this["createdAt"] == null) issues.push({ path: "createdAt", message: "Required." });
    if (this["groupMemberCount"] == null) issues.push({ path: "groupMemberCount", message: "Required." });
    if (this["groupMemberCount"] != null) {
      if (!Number.isInteger(this["groupMemberCount"])) issues.push({ path: "groupMemberCount", message: "Must be an integer." });
    }
    if (this["groupName"] == null) issues.push({ path: "groupName", message: "Required." });
    if (this["ownerDid"] == null) issues.push({ path: "ownerDid", message: "Required." });
    if (this["rev"] == null) issues.push({ path: "rev", message: "Required." });
    if (this["updateType"] == null) issues.push({ path: "updateType", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      actorDid: this["actorDid"],
      convoCreatedAt: this["convoCreatedAt"],
      convoId: this["convoId"],
      createdAt: this["createdAt"],
      groupMemberCount: this["groupMemberCount"],
      groupName: this["groupName"],
      joinLinkCode: this["joinLinkCode"],
      joinLinkFollowersOnly: this["joinLinkFollowersOnly"],
      joinLinkRequiresApproval: this["joinLinkRequiresApproval"],
      lockReason: this["lockReason"],
      newName: this["newName"],
      oldName: this["oldName"],
      ownerDid: this["ownerDid"],
      rev: this["rev"],
      updateType: this["updateType"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ChatBskyModerationSubscribeModEventsEventGroupChatUpdated(value);
    record.check();
    return record;
  }
};
var ChatBskyModerationSubscribeModEventsEventRateLimitExceeded = class _ChatBskyModerationSubscribeModEventsEventRateLimitExceeded {
  static nsid = "chat.bsky.moderation.subscribeModEvents";
  static def = "eventRateLimitExceeded";
  static kind = "object";
  $type;
  actorDid;
  createdAt;
  endpoint;
  rev;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "chat.bsky.moderation.subscribeModEvents#eventRateLimitExceeded";
  }
  check() {
    const issues = [];
    if (this["actorDid"] == null) issues.push({ path: "actorDid", message: "Required." });
    if (this["createdAt"] == null) issues.push({ path: "createdAt", message: "Required." });
    if (this["endpoint"] == null) issues.push({ path: "endpoint", message: "Required." });
    if (this["rev"] == null) issues.push({ path: "rev", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      actorDid: this["actorDid"],
      createdAt: this["createdAt"],
      endpoint: this["endpoint"],
      rev: this["rev"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ChatBskyModerationSubscribeModEventsEventRateLimitExceeded(value);
    record.check();
    return record;
  }
};
var ChatBskyModerationUpdateActorAccess = class _ChatBskyModerationUpdateActorAccess {
  static nsid = "chat.bsky.moderation.updateActorAccess";
  static def = "main";
  static kind = "procedure";
  static http = "POST";
  static errorNames = [];
  actor;
  allowAccess;
  ref;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({});
  }
  toBody() {
    return jsonOf({
      actor: this["actor"],
      allowAccess: this["allowAccess"],
      ref: this["ref"]
    });
  }
  check() {
    const issues = [];
    if (this["actor"] == null) issues.push({ path: "actor", message: "Required." });
    if (this["allowAccess"] == null) issues.push({ path: "allowAccess", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _ChatBskyModerationUpdateActorAccess.nsid,
      method: "POST",
      params: this.toParams(),
      body: this.toBody(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ChatBskyModerationUpdateActorAccess(value);
    record.check();
    return record;
  }
};
var ChatBskyNotificationDefsChatPreference = class _ChatBskyNotificationDefsChatPreference {
  static nsid = "chat.bsky.notification.defs";
  static def = "chatPreference";
  static kind = "object";
  $type;
  include;
  push;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "chat.bsky.notification.defs#chatPreference";
  }
  check() {
    const issues = [];
    if (this["include"] == null) issues.push({ path: "include", message: "Required." });
    if (this["push"] == null) issues.push({ path: "push", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      include: this["include"],
      push: this["push"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ChatBskyNotificationDefsChatPreference(value);
    record.check();
    return record;
  }
};
var ChatBskyNotificationDefsPreferences = class _ChatBskyNotificationDefsPreferences {
  static nsid = "chat.bsky.notification.defs";
  static def = "preferences";
  static kind = "object";
  $type;
  chat;
  chatRequest;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "chat.bsky.notification.defs#preferences";
  }
  check() {
    const issues = [];
    if (this["chat"] == null) issues.push({ path: "chat", message: "Required." });
    if (this["chatRequest"] == null) issues.push({ path: "chatRequest", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      chat: this["chat"],
      chatRequest: this["chatRequest"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ChatBskyNotificationDefsPreferences(value);
    record.check();
    return record;
  }
};
var ChatBskyNotificationGetPreferences = class _ChatBskyNotificationGetPreferences {
  static nsid = "chat.bsky.notification.getPreferences";
  static def = "main";
  static kind = "query";
  static http = "GET";
  static errorNames = [];
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({});
  }
  check() {
    const issues = [];
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _ChatBskyNotificationGetPreferences.nsid,
      method: "GET",
      params: this.toParams(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ChatBskyNotificationGetPreferences(value);
    record.check();
    return record;
  }
};
var ChatBskyNotificationPutPreferences = class _ChatBskyNotificationPutPreferences {
  static nsid = "chat.bsky.notification.putPreferences";
  static def = "main";
  static kind = "procedure";
  static http = "POST";
  static errorNames = [];
  chat;
  chatRequest;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({});
  }
  toBody() {
    return jsonOf({
      chat: this["chat"],
      chatRequest: this["chatRequest"]
    });
  }
  check() {
    const issues = [];
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _ChatBskyNotificationPutPreferences.nsid,
      method: "POST",
      params: this.toParams(),
      body: this.toBody(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ChatBskyNotificationPutPreferences(value);
    record.check();
    return record;
  }
};
var ComAtprotoAdminDefsAccountView = class _ComAtprotoAdminDefsAccountView {
  static nsid = "com.atproto.admin.defs";
  static def = "accountView";
  static kind = "object";
  $type;
  did;
  handle;
  email;
  relatedRecords;
  indexedAt;
  invitedBy;
  invites;
  invitesDisabled;
  emailConfirmedAt;
  inviteNote;
  deactivatedAt;
  threatSignatures;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "com.atproto.admin.defs#accountView";
  }
  check() {
    const issues = [];
    if (this["did"] == null) issues.push({ path: "did", message: "Required." });
    if (this["handle"] == null) issues.push({ path: "handle", message: "Required." });
    if (this["indexedAt"] == null) issues.push({ path: "indexedAt", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      did: this["did"],
      handle: this["handle"],
      email: this["email"],
      relatedRecords: this["relatedRecords"],
      indexedAt: this["indexedAt"],
      invitedBy: this["invitedBy"],
      invites: this["invites"],
      invitesDisabled: this["invitesDisabled"],
      emailConfirmedAt: this["emailConfirmedAt"],
      inviteNote: this["inviteNote"],
      deactivatedAt: this["deactivatedAt"],
      threatSignatures: this["threatSignatures"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ComAtprotoAdminDefsAccountView(value);
    record.check();
    return record;
  }
};
var ComAtprotoAdminDefsRepoBlobRef = class _ComAtprotoAdminDefsRepoBlobRef {
  static nsid = "com.atproto.admin.defs";
  static def = "repoBlobRef";
  static kind = "object";
  $type;
  did;
  cid;
  recordUri;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "com.atproto.admin.defs#repoBlobRef";
  }
  check() {
    const issues = [];
    if (this["did"] == null) issues.push({ path: "did", message: "Required." });
    if (this["cid"] == null) issues.push({ path: "cid", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      did: this["did"],
      cid: this["cid"],
      recordUri: this["recordUri"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ComAtprotoAdminDefsRepoBlobRef(value);
    record.check();
    return record;
  }
};
var ComAtprotoAdminDefsRepoRef = class _ComAtprotoAdminDefsRepoRef {
  static nsid = "com.atproto.admin.defs";
  static def = "repoRef";
  static kind = "object";
  $type;
  did;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "com.atproto.admin.defs#repoRef";
  }
  check() {
    const issues = [];
    if (this["did"] == null) issues.push({ path: "did", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      did: this["did"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ComAtprotoAdminDefsRepoRef(value);
    record.check();
    return record;
  }
};
var ComAtprotoAdminDefsStatusAttr = class _ComAtprotoAdminDefsStatusAttr {
  static nsid = "com.atproto.admin.defs";
  static def = "statusAttr";
  static kind = "object";
  $type;
  applied;
  ref;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "com.atproto.admin.defs#statusAttr";
  }
  check() {
    const issues = [];
    if (this["applied"] == null) issues.push({ path: "applied", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      applied: this["applied"],
      ref: this["ref"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ComAtprotoAdminDefsStatusAttr(value);
    record.check();
    return record;
  }
};
var ComAtprotoAdminDefsThreatSignature = class _ComAtprotoAdminDefsThreatSignature {
  static nsid = "com.atproto.admin.defs";
  static def = "threatSignature";
  static kind = "object";
  $type;
  property;
  value;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "com.atproto.admin.defs#threatSignature";
  }
  check() {
    const issues = [];
    if (this["property"] == null) issues.push({ path: "property", message: "Required." });
    if (this["value"] == null) issues.push({ path: "value", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      property: this["property"],
      value: this["value"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ComAtprotoAdminDefsThreatSignature(value);
    record.check();
    return record;
  }
};
var ComAtprotoAdminDeleteAccount = class _ComAtprotoAdminDeleteAccount {
  static nsid = "com.atproto.admin.deleteAccount";
  static def = "main";
  static kind = "procedure";
  static http = "POST";
  static errorNames = [];
  did;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({});
  }
  toBody() {
    return jsonOf({
      did: this["did"]
    });
  }
  check() {
    const issues = [];
    if (this["did"] == null) issues.push({ path: "did", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _ComAtprotoAdminDeleteAccount.nsid,
      method: "POST",
      params: this.toParams(),
      body: this.toBody(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ComAtprotoAdminDeleteAccount(value);
    record.check();
    return record;
  }
};
var ComAtprotoAdminDisableAccountInvites = class _ComAtprotoAdminDisableAccountInvites {
  static nsid = "com.atproto.admin.disableAccountInvites";
  static def = "main";
  static kind = "procedure";
  static http = "POST";
  static errorNames = [];
  account;
  note;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({});
  }
  toBody() {
    return jsonOf({
      account: this["account"],
      note: this["note"]
    });
  }
  check() {
    const issues = [];
    if (this["account"] == null) issues.push({ path: "account", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _ComAtprotoAdminDisableAccountInvites.nsid,
      method: "POST",
      params: this.toParams(),
      body: this.toBody(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ComAtprotoAdminDisableAccountInvites(value);
    record.check();
    return record;
  }
};
var ComAtprotoAdminDisableInviteCodes = class _ComAtprotoAdminDisableInviteCodes {
  static nsid = "com.atproto.admin.disableInviteCodes";
  static def = "main";
  static kind = "procedure";
  static http = "POST";
  static errorNames = [];
  codes;
  accounts;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({});
  }
  toBody() {
    return jsonOf({
      codes: this["codes"],
      accounts: this["accounts"]
    });
  }
  check() {
    const issues = [];
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _ComAtprotoAdminDisableInviteCodes.nsid,
      method: "POST",
      params: this.toParams(),
      body: this.toBody(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ComAtprotoAdminDisableInviteCodes(value);
    record.check();
    return record;
  }
};
var ComAtprotoAdminEnableAccountInvites = class _ComAtprotoAdminEnableAccountInvites {
  static nsid = "com.atproto.admin.enableAccountInvites";
  static def = "main";
  static kind = "procedure";
  static http = "POST";
  static errorNames = [];
  account;
  note;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({});
  }
  toBody() {
    return jsonOf({
      account: this["account"],
      note: this["note"]
    });
  }
  check() {
    const issues = [];
    if (this["account"] == null) issues.push({ path: "account", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _ComAtprotoAdminEnableAccountInvites.nsid,
      method: "POST",
      params: this.toParams(),
      body: this.toBody(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ComAtprotoAdminEnableAccountInvites(value);
    record.check();
    return record;
  }
};
var ComAtprotoAdminGetAccountInfo = class _ComAtprotoAdminGetAccountInfo {
  static nsid = "com.atproto.admin.getAccountInfo";
  static def = "main";
  static kind = "query";
  static http = "GET";
  static errorNames = [];
  did;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({
      did: this["did"]
    });
  }
  check() {
    const issues = [];
    if (this["did"] == null) issues.push({ path: "did", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _ComAtprotoAdminGetAccountInfo.nsid,
      method: "GET",
      params: this.toParams(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ComAtprotoAdminGetAccountInfo(value);
    record.check();
    return record;
  }
};
var ComAtprotoAdminGetAccountInfos = class _ComAtprotoAdminGetAccountInfos {
  static nsid = "com.atproto.admin.getAccountInfos";
  static def = "main";
  static kind = "query";
  static http = "GET";
  static errorNames = [];
  dids;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({
      dids: this["dids"]
    });
  }
  check() {
    const issues = [];
    if (this["dids"] == null) issues.push({ path: "dids", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _ComAtprotoAdminGetAccountInfos.nsid,
      method: "GET",
      params: this.toParams(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ComAtprotoAdminGetAccountInfos(value);
    record.check();
    return record;
  }
};
var ComAtprotoAdminGetInviteCodes = class _ComAtprotoAdminGetInviteCodes {
  static nsid = "com.atproto.admin.getInviteCodes";
  static def = "main";
  static kind = "query";
  static http = "GET";
  static errorNames = [];
  sort;
  limit;
  cursor;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({
      sort: this["sort"],
      limit: this["limit"],
      cursor: this["cursor"]
    });
  }
  check() {
    const issues = [];
    if (this["limit"] != null) {
      if (!Number.isInteger(this["limit"])) issues.push({ path: "limit", message: "Must be an integer." });
      else if (this["limit"] < 1) issues.push({ path: "limit", message: "Must be at least 1." });
      else if (this["limit"] > 500) issues.push({ path: "limit", message: "Must be at most 500." });
    }
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _ComAtprotoAdminGetInviteCodes.nsid,
      method: "GET",
      params: this.toParams(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ComAtprotoAdminGetInviteCodes(value);
    record.check();
    return record;
  }
};
var ComAtprotoAdminGetSubjectStatus = class _ComAtprotoAdminGetSubjectStatus {
  static nsid = "com.atproto.admin.getSubjectStatus";
  static def = "main";
  static kind = "query";
  static http = "GET";
  static errorNames = [];
  did;
  uri;
  blob;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({
      did: this["did"],
      uri: this["uri"],
      blob: this["blob"]
    });
  }
  check() {
    const issues = [];
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _ComAtprotoAdminGetSubjectStatus.nsid,
      method: "GET",
      params: this.toParams(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ComAtprotoAdminGetSubjectStatus(value);
    record.check();
    return record;
  }
};
var ComAtprotoAdminSearchAccounts = class _ComAtprotoAdminSearchAccounts {
  static nsid = "com.atproto.admin.searchAccounts";
  static def = "main";
  static kind = "query";
  static http = "GET";
  static errorNames = [];
  email;
  cursor;
  limit;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({
      email: this["email"],
      cursor: this["cursor"],
      limit: this["limit"]
    });
  }
  check() {
    const issues = [];
    if (this["limit"] != null) {
      if (!Number.isInteger(this["limit"])) issues.push({ path: "limit", message: "Must be an integer." });
      else if (this["limit"] < 1) issues.push({ path: "limit", message: "Must be at least 1." });
      else if (this["limit"] > 100) issues.push({ path: "limit", message: "Must be at most 100." });
    }
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _ComAtprotoAdminSearchAccounts.nsid,
      method: "GET",
      params: this.toParams(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ComAtprotoAdminSearchAccounts(value);
    record.check();
    return record;
  }
};
var ComAtprotoAdminSendEmail = class _ComAtprotoAdminSendEmail {
  static nsid = "com.atproto.admin.sendEmail";
  static def = "main";
  static kind = "procedure";
  static http = "POST";
  static errorNames = [];
  recipientDid;
  content;
  subject;
  senderDid;
  comment;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({});
  }
  toBody() {
    return jsonOf({
      recipientDid: this["recipientDid"],
      content: this["content"],
      subject: this["subject"],
      senderDid: this["senderDid"],
      comment: this["comment"]
    });
  }
  check() {
    const issues = [];
    if (this["recipientDid"] == null) issues.push({ path: "recipientDid", message: "Required." });
    if (this["content"] == null) issues.push({ path: "content", message: "Required." });
    if (this["senderDid"] == null) issues.push({ path: "senderDid", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _ComAtprotoAdminSendEmail.nsid,
      method: "POST",
      params: this.toParams(),
      body: this.toBody(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ComAtprotoAdminSendEmail(value);
    record.check();
    return record;
  }
};
var ComAtprotoAdminUpdateAccountEmail = class _ComAtprotoAdminUpdateAccountEmail {
  static nsid = "com.atproto.admin.updateAccountEmail";
  static def = "main";
  static kind = "procedure";
  static http = "POST";
  static errorNames = [];
  account;
  email;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({});
  }
  toBody() {
    return jsonOf({
      account: this["account"],
      email: this["email"]
    });
  }
  check() {
    const issues = [];
    if (this["account"] == null) issues.push({ path: "account", message: "Required." });
    if (this["email"] == null) issues.push({ path: "email", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _ComAtprotoAdminUpdateAccountEmail.nsid,
      method: "POST",
      params: this.toParams(),
      body: this.toBody(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ComAtprotoAdminUpdateAccountEmail(value);
    record.check();
    return record;
  }
};
var ComAtprotoAdminUpdateAccountHandle = class _ComAtprotoAdminUpdateAccountHandle {
  static nsid = "com.atproto.admin.updateAccountHandle";
  static def = "main";
  static kind = "procedure";
  static http = "POST";
  static errorNames = [];
  did;
  handle;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({});
  }
  toBody() {
    return jsonOf({
      did: this["did"],
      handle: this["handle"]
    });
  }
  check() {
    const issues = [];
    if (this["did"] == null) issues.push({ path: "did", message: "Required." });
    if (this["handle"] == null) issues.push({ path: "handle", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _ComAtprotoAdminUpdateAccountHandle.nsid,
      method: "POST",
      params: this.toParams(),
      body: this.toBody(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ComAtprotoAdminUpdateAccountHandle(value);
    record.check();
    return record;
  }
};
var ComAtprotoAdminUpdateAccountPassword = class _ComAtprotoAdminUpdateAccountPassword {
  static nsid = "com.atproto.admin.updateAccountPassword";
  static def = "main";
  static kind = "procedure";
  static http = "POST";
  static errorNames = [];
  did;
  password;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({});
  }
  toBody() {
    return jsonOf({
      did: this["did"],
      password: this["password"]
    });
  }
  check() {
    const issues = [];
    if (this["did"] == null) issues.push({ path: "did", message: "Required." });
    if (this["password"] == null) issues.push({ path: "password", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _ComAtprotoAdminUpdateAccountPassword.nsid,
      method: "POST",
      params: this.toParams(),
      body: this.toBody(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ComAtprotoAdminUpdateAccountPassword(value);
    record.check();
    return record;
  }
};
var ComAtprotoAdminUpdateAccountSigningKey = class _ComAtprotoAdminUpdateAccountSigningKey {
  static nsid = "com.atproto.admin.updateAccountSigningKey";
  static def = "main";
  static kind = "procedure";
  static http = "POST";
  static errorNames = [];
  did;
  signingKey;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({});
  }
  toBody() {
    return jsonOf({
      did: this["did"],
      signingKey: this["signingKey"]
    });
  }
  check() {
    const issues = [];
    if (this["did"] == null) issues.push({ path: "did", message: "Required." });
    if (this["signingKey"] == null) issues.push({ path: "signingKey", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _ComAtprotoAdminUpdateAccountSigningKey.nsid,
      method: "POST",
      params: this.toParams(),
      body: this.toBody(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ComAtprotoAdminUpdateAccountSigningKey(value);
    record.check();
    return record;
  }
};
var ComAtprotoAdminUpdateSubjectStatus = class _ComAtprotoAdminUpdateSubjectStatus {
  static nsid = "com.atproto.admin.updateSubjectStatus";
  static def = "main";
  static kind = "procedure";
  static http = "POST";
  static errorNames = [];
  subject;
  takedown;
  deactivated;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({});
  }
  toBody() {
    return jsonOf({
      subject: this["subject"],
      takedown: this["takedown"],
      deactivated: this["deactivated"]
    });
  }
  check() {
    const issues = [];
    if (this["subject"] == null) issues.push({ path: "subject", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _ComAtprotoAdminUpdateSubjectStatus.nsid,
      method: "POST",
      params: this.toParams(),
      body: this.toBody(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ComAtprotoAdminUpdateSubjectStatus(value);
    record.check();
    return record;
  }
};
var ComAtprotoIdentityDefsIdentityInfo = class _ComAtprotoIdentityDefsIdentityInfo {
  static nsid = "com.atproto.identity.defs";
  static def = "identityInfo";
  static kind = "object";
  $type;
  did;
  handle;
  didDoc;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "com.atproto.identity.defs#identityInfo";
  }
  check() {
    const issues = [];
    if (this["did"] == null) issues.push({ path: "did", message: "Required." });
    if (this["handle"] == null) issues.push({ path: "handle", message: "Required." });
    if (this["didDoc"] == null) issues.push({ path: "didDoc", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      did: this["did"],
      handle: this["handle"],
      didDoc: this["didDoc"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ComAtprotoIdentityDefsIdentityInfo(value);
    record.check();
    return record;
  }
};
var ComAtprotoIdentityGetRecommendedDidCredentials = class _ComAtprotoIdentityGetRecommendedDidCredentials {
  static nsid = "com.atproto.identity.getRecommendedDidCredentials";
  static def = "main";
  static kind = "query";
  static http = "GET";
  static errorNames = [];
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({});
  }
  check() {
    const issues = [];
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _ComAtprotoIdentityGetRecommendedDidCredentials.nsid,
      method: "GET",
      params: this.toParams(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ComAtprotoIdentityGetRecommendedDidCredentials(value);
    record.check();
    return record;
  }
};
var ComAtprotoIdentityRefreshIdentity = class _ComAtprotoIdentityRefreshIdentity {
  static nsid = "com.atproto.identity.refreshIdentity";
  static def = "main";
  static kind = "procedure";
  static http = "POST";
  static errorNames = ["HandleNotFound", "DidNotFound", "DidDeactivated"];
  identifier;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({});
  }
  toBody() {
    return jsonOf({
      identifier: this["identifier"]
    });
  }
  check() {
    const issues = [];
    if (this["identifier"] == null) issues.push({ path: "identifier", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _ComAtprotoIdentityRefreshIdentity.nsid,
      method: "POST",
      params: this.toParams(),
      body: this.toBody(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ComAtprotoIdentityRefreshIdentity(value);
    record.check();
    return record;
  }
};
var ComAtprotoIdentityRequestPlcOperationSignature = class _ComAtprotoIdentityRequestPlcOperationSignature {
  static nsid = "com.atproto.identity.requestPlcOperationSignature";
  static def = "main";
  static kind = "procedure";
  static http = "POST";
  static errorNames = [];
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({});
  }
  check() {
    const issues = [];
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _ComAtprotoIdentityRequestPlcOperationSignature.nsid,
      method: "POST",
      params: this.toParams(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ComAtprotoIdentityRequestPlcOperationSignature(value);
    record.check();
    return record;
  }
};
var ComAtprotoIdentityResolveDid = class _ComAtprotoIdentityResolveDid {
  static nsid = "com.atproto.identity.resolveDid";
  static def = "main";
  static kind = "query";
  static http = "GET";
  static errorNames = ["DidNotFound", "DidDeactivated"];
  did;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({
      did: this["did"]
    });
  }
  check() {
    const issues = [];
    if (this["did"] == null) issues.push({ path: "did", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _ComAtprotoIdentityResolveDid.nsid,
      method: "GET",
      params: this.toParams(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ComAtprotoIdentityResolveDid(value);
    record.check();
    return record;
  }
};
var ComAtprotoIdentityResolveHandle = class _ComAtprotoIdentityResolveHandle {
  static nsid = "com.atproto.identity.resolveHandle";
  static def = "main";
  static kind = "query";
  static http = "GET";
  static errorNames = ["HandleNotFound"];
  handle;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({
      handle: this["handle"]
    });
  }
  check() {
    const issues = [];
    if (this["handle"] == null) issues.push({ path: "handle", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _ComAtprotoIdentityResolveHandle.nsid,
      method: "GET",
      params: this.toParams(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ComAtprotoIdentityResolveHandle(value);
    record.check();
    return record;
  }
};
var ComAtprotoIdentityResolveIdentity = class _ComAtprotoIdentityResolveIdentity {
  static nsid = "com.atproto.identity.resolveIdentity";
  static def = "main";
  static kind = "query";
  static http = "GET";
  static errorNames = ["HandleNotFound", "DidNotFound", "DidDeactivated"];
  identifier;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({
      identifier: this["identifier"]
    });
  }
  check() {
    const issues = [];
    if (this["identifier"] == null) issues.push({ path: "identifier", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _ComAtprotoIdentityResolveIdentity.nsid,
      method: "GET",
      params: this.toParams(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ComAtprotoIdentityResolveIdentity(value);
    record.check();
    return record;
  }
};
var ComAtprotoIdentitySignPlcOperation = class _ComAtprotoIdentitySignPlcOperation {
  static nsid = "com.atproto.identity.signPlcOperation";
  static def = "main";
  static kind = "procedure";
  static http = "POST";
  static errorNames = [];
  token;
  rotationKeys;
  alsoKnownAs;
  verificationMethods;
  services;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({});
  }
  toBody() {
    return jsonOf({
      token: this["token"],
      rotationKeys: this["rotationKeys"],
      alsoKnownAs: this["alsoKnownAs"],
      verificationMethods: this["verificationMethods"],
      services: this["services"]
    });
  }
  check() {
    const issues = [];
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _ComAtprotoIdentitySignPlcOperation.nsid,
      method: "POST",
      params: this.toParams(),
      body: this.toBody(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ComAtprotoIdentitySignPlcOperation(value);
    record.check();
    return record;
  }
};
var ComAtprotoIdentitySubmitPlcOperation = class _ComAtprotoIdentitySubmitPlcOperation {
  static nsid = "com.atproto.identity.submitPlcOperation";
  static def = "main";
  static kind = "procedure";
  static http = "POST";
  static errorNames = [];
  operation;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({});
  }
  toBody() {
    return jsonOf({
      operation: this["operation"]
    });
  }
  check() {
    const issues = [];
    if (this["operation"] == null) issues.push({ path: "operation", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _ComAtprotoIdentitySubmitPlcOperation.nsid,
      method: "POST",
      params: this.toParams(),
      body: this.toBody(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ComAtprotoIdentitySubmitPlcOperation(value);
    record.check();
    return record;
  }
};
var ComAtprotoIdentityUpdateHandle = class _ComAtprotoIdentityUpdateHandle {
  static nsid = "com.atproto.identity.updateHandle";
  static def = "main";
  static kind = "procedure";
  static http = "POST";
  static errorNames = [];
  handle;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({});
  }
  toBody() {
    return jsonOf({
      handle: this["handle"]
    });
  }
  check() {
    const issues = [];
    if (this["handle"] == null) issues.push({ path: "handle", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _ComAtprotoIdentityUpdateHandle.nsid,
      method: "POST",
      params: this.toParams(),
      body: this.toBody(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ComAtprotoIdentityUpdateHandle(value);
    record.check();
    return record;
  }
};
var ComAtprotoLabelDefsLabel = class _ComAtprotoLabelDefsLabel {
  static nsid = "com.atproto.label.defs";
  static def = "label";
  static kind = "object";
  $type;
  ver;
  src;
  uri;
  cid;
  val;
  neg;
  cts;
  exp;
  sig;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "com.atproto.label.defs#label";
  }
  check() {
    const issues = [];
    if (this["ver"] != null) {
      if (!Number.isInteger(this["ver"])) issues.push({ path: "ver", message: "Must be an integer." });
    }
    if (this["src"] == null) issues.push({ path: "src", message: "Required." });
    if (this["uri"] == null) issues.push({ path: "uri", message: "Required." });
    if (this["val"] == null) issues.push({ path: "val", message: "Required." });
    if (typeof this["val"] === "string" && this["val"].length > 128) issues.push({ path: "val", message: "Must be at most 128 characters." });
    if (this["cts"] == null) issues.push({ path: "cts", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      ver: this["ver"],
      src: this["src"],
      uri: this["uri"],
      cid: this["cid"],
      val: this["val"],
      neg: this["neg"],
      cts: this["cts"],
      exp: this["exp"],
      sig: this["sig"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ComAtprotoLabelDefsLabel(value);
    record.check();
    return record;
  }
};
var ComAtprotoLabelDefsLabelValue = class _ComAtprotoLabelDefsLabelValue {
  static nsid = "com.atproto.label.defs";
  static def = "labelValue";
  static kind = "string";
  static knownValues = ["!hide", "!warn", "!no-unauthenticated", "porn", "sexual", "nudity", "graphic-media", "bot"];
  static includes(value) {
    return _ComAtprotoLabelDefsLabelValue.knownValues.includes(value);
  }
  constructor() {
  }
};
var ComAtprotoLabelDefsLabelValueDefinition = class _ComAtprotoLabelDefsLabelValueDefinition {
  static nsid = "com.atproto.label.defs";
  static def = "labelValueDefinition";
  static kind = "object";
  $type;
  identifier;
  severity;
  blurs;
  defaultSetting;
  adultOnly;
  locales;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "com.atproto.label.defs#labelValueDefinition";
  }
  check() {
    const issues = [];
    if (this["identifier"] == null) issues.push({ path: "identifier", message: "Required." });
    if (typeof this["identifier"] === "string" && this["identifier"].length > 100) issues.push({ path: "identifier", message: "Must be at most 100 characters." });
    if (this["severity"] == null) issues.push({ path: "severity", message: "Required." });
    if (this["blurs"] == null) issues.push({ path: "blurs", message: "Required." });
    if (this["locales"] == null) issues.push({ path: "locales", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      identifier: this["identifier"],
      severity: this["severity"],
      blurs: this["blurs"],
      defaultSetting: this["defaultSetting"],
      adultOnly: this["adultOnly"],
      locales: this["locales"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ComAtprotoLabelDefsLabelValueDefinition(value);
    record.check();
    return record;
  }
};
var ComAtprotoLabelDefsLabelValueDefinitionStrings = class _ComAtprotoLabelDefsLabelValueDefinitionStrings {
  static nsid = "com.atproto.label.defs";
  static def = "labelValueDefinitionStrings";
  static kind = "object";
  $type;
  lang;
  name;
  description;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "com.atproto.label.defs#labelValueDefinitionStrings";
  }
  check() {
    const issues = [];
    if (this["lang"] == null) issues.push({ path: "lang", message: "Required." });
    if (this["name"] == null) issues.push({ path: "name", message: "Required." });
    if (typeof this["name"] === "string" && this["name"].length > 640) issues.push({ path: "name", message: "Must be at most 640 characters." });
    if (this["description"] == null) issues.push({ path: "description", message: "Required." });
    if (typeof this["description"] === "string" && this["description"].length > 1e5) issues.push({ path: "description", message: "Must be at most 100000 characters." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      lang: this["lang"],
      name: this["name"],
      description: this["description"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ComAtprotoLabelDefsLabelValueDefinitionStrings(value);
    record.check();
    return record;
  }
};
var ComAtprotoLabelDefsSelfLabel = class _ComAtprotoLabelDefsSelfLabel {
  static nsid = "com.atproto.label.defs";
  static def = "selfLabel";
  static kind = "object";
  $type;
  val;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "com.atproto.label.defs#selfLabel";
  }
  check() {
    const issues = [];
    if (this["val"] == null) issues.push({ path: "val", message: "Required." });
    if (typeof this["val"] === "string" && this["val"].length > 128) issues.push({ path: "val", message: "Must be at most 128 characters." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      val: this["val"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ComAtprotoLabelDefsSelfLabel(value);
    record.check();
    return record;
  }
};
var ComAtprotoLabelDefsSelfLabels = class _ComAtprotoLabelDefsSelfLabels {
  static nsid = "com.atproto.label.defs";
  static def = "selfLabels";
  static kind = "object";
  $type;
  values;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "com.atproto.label.defs#selfLabels";
  }
  check() {
    const issues = [];
    if (this["values"] == null) issues.push({ path: "values", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      values: this["values"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ComAtprotoLabelDefsSelfLabels(value);
    record.check();
    return record;
  }
};
var ComAtprotoLabelQueryLabels = class _ComAtprotoLabelQueryLabels {
  static nsid = "com.atproto.label.queryLabels";
  static def = "main";
  static kind = "query";
  static http = "GET";
  static errorNames = [];
  uriPatterns;
  sources;
  limit;
  cursor;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({
      uriPatterns: this["uriPatterns"],
      sources: this["sources"],
      limit: this["limit"],
      cursor: this["cursor"]
    });
  }
  check() {
    const issues = [];
    if (this["uriPatterns"] == null) issues.push({ path: "uriPatterns", message: "Required." });
    if (this["limit"] != null) {
      if (!Number.isInteger(this["limit"])) issues.push({ path: "limit", message: "Must be an integer." });
      else if (this["limit"] < 1) issues.push({ path: "limit", message: "Must be at least 1." });
      else if (this["limit"] > 250) issues.push({ path: "limit", message: "Must be at most 250." });
    }
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _ComAtprotoLabelQueryLabels.nsid,
      method: "GET",
      params: this.toParams(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ComAtprotoLabelQueryLabels(value);
    record.check();
    return record;
  }
};
var ComAtprotoLabelRecord = class _ComAtprotoLabelRecord {
  static nsid = "com.atproto.label.record";
  static def = "main";
  static kind = "record";
  static recordKey = "tid";
  $type;
  uri;
  cid;
  val;
  cts;
  exp;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "com.atproto.label.record";
  }
  check() {
    const issues = [];
    if (this["uri"] == null) issues.push({ path: "uri", message: "Required." });
    if (this["val"] == null) issues.push({ path: "val", message: "Required." });
    if (typeof this["val"] === "string" && this["val"].length > 128) issues.push({ path: "val", message: "Must be at most 128 characters." });
    if (this["cts"] == null) issues.push({ path: "cts", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      uri: this["uri"],
      cid: this["cid"],
      val: this["val"],
      cts: this["cts"],
      exp: this["exp"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ComAtprotoLabelRecord(value);
    record.check();
    return record;
  }
};
var ComAtprotoLabelSubscribeLabels = class _ComAtprotoLabelSubscribeLabels {
  static nsid = "com.atproto.label.subscribeLabels";
  static def = "main";
  static kind = "subscription";
  static http = "WEBSOCKET";
  static errorNames = ["FutureCursor"];
  cursor;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({
      cursor: this["cursor"]
    });
  }
  check() {
    const issues = [];
    if (this["cursor"] != null) {
      if (!Number.isInteger(this["cursor"])) issues.push({ path: "cursor", message: "Must be an integer." });
    }
    if (issues.length) throw new ValidationError(issues);
  }
  async send(_client, _options = {}) {
    throw new ProtocolError("ComAtprotoLabelSubscribeLabels is a websocket subscription.");
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ComAtprotoLabelSubscribeLabels(value);
    record.check();
    return record;
  }
};
var ComAtprotoLabelSubscribeLabelsInfo = class _ComAtprotoLabelSubscribeLabelsInfo {
  static nsid = "com.atproto.label.subscribeLabels";
  static def = "info";
  static kind = "object";
  $type;
  name;
  message;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "com.atproto.label.subscribeLabels#info";
  }
  check() {
    const issues = [];
    if (this["name"] == null) issues.push({ path: "name", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      name: this["name"],
      message: this["message"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ComAtprotoLabelSubscribeLabelsInfo(value);
    record.check();
    return record;
  }
};
var ComAtprotoLabelSubscribeLabelsLabels = class _ComAtprotoLabelSubscribeLabelsLabels {
  static nsid = "com.atproto.label.subscribeLabels";
  static def = "labels";
  static kind = "object";
  $type;
  seq;
  labels;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "com.atproto.label.subscribeLabels#labels";
  }
  check() {
    const issues = [];
    if (this["seq"] == null) issues.push({ path: "seq", message: "Required." });
    if (this["seq"] != null) {
      if (!Number.isInteger(this["seq"])) issues.push({ path: "seq", message: "Must be an integer." });
    }
    if (this["labels"] == null) issues.push({ path: "labels", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      seq: this["seq"],
      labels: this["labels"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ComAtprotoLabelSubscribeLabelsLabels(value);
    record.check();
    return record;
  }
};
var ComAtprotoLexiconResolveLexicon = class _ComAtprotoLexiconResolveLexicon {
  static nsid = "com.atproto.lexicon.resolveLexicon";
  static def = "main";
  static kind = "query";
  static http = "GET";
  static errorNames = ["LexiconNotFound"];
  nsid;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({
      nsid: this["nsid"]
    });
  }
  check() {
    const issues = [];
    if (this["nsid"] == null) issues.push({ path: "nsid", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _ComAtprotoLexiconResolveLexicon.nsid,
      method: "GET",
      params: this.toParams(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ComAtprotoLexiconResolveLexicon(value);
    record.check();
    return record;
  }
};
var ComAtprotoLexiconSchema = class _ComAtprotoLexiconSchema {
  static nsid = "com.atproto.lexicon.schema";
  static def = "main";
  static kind = "record";
  static recordKey = "nsid";
  $type;
  lexicon;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "com.atproto.lexicon.schema";
  }
  check() {
    const issues = [];
    if (this["lexicon"] == null) issues.push({ path: "lexicon", message: "Required." });
    if (this["lexicon"] != null) {
      if (!Number.isInteger(this["lexicon"])) issues.push({ path: "lexicon", message: "Must be an integer." });
    }
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      lexicon: this["lexicon"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ComAtprotoLexiconSchema(value);
    record.check();
    return record;
  }
};
var ComAtprotoModerationCreateReport = class _ComAtprotoModerationCreateReport {
  static nsid = "com.atproto.moderation.createReport";
  static def = "main";
  static kind = "procedure";
  static http = "POST";
  static errorNames = [];
  reasonType;
  reason;
  subject;
  modTool;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({});
  }
  toBody() {
    return jsonOf({
      reasonType: this["reasonType"],
      reason: this["reason"],
      subject: this["subject"],
      modTool: this["modTool"]
    });
  }
  check() {
    const issues = [];
    if (this["reasonType"] == null) issues.push({ path: "reasonType", message: "Required." });
    if (typeof this["reason"] === "string" && this["reason"].length > 2e4) issues.push({ path: "reason", message: "Must be at most 20000 characters." });
    if (this["subject"] == null) issues.push({ path: "subject", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _ComAtprotoModerationCreateReport.nsid,
      method: "POST",
      params: this.toParams(),
      body: this.toBody(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ComAtprotoModerationCreateReport(value);
    record.check();
    return record;
  }
};
var ComAtprotoModerationCreateReportModTool = class _ComAtprotoModerationCreateReportModTool {
  static nsid = "com.atproto.moderation.createReport";
  static def = "modTool";
  static kind = "object";
  $type;
  name;
  meta;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "com.atproto.moderation.createReport#modTool";
  }
  check() {
    const issues = [];
    if (this["name"] == null) issues.push({ path: "name", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      name: this["name"],
      meta: this["meta"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ComAtprotoModerationCreateReportModTool(value);
    record.check();
    return record;
  }
};
var ComAtprotoModerationDefsReasonAppeal = class {
  static nsid = "com.atproto.moderation.defs";
  static def = "reasonAppeal";
  static kind = "token";
  static value = "com.atproto.moderation.defs#reasonAppeal";
  static description = "Appeal a previously taken moderation action";
  constructor() {
  }
};
var ComAtprotoModerationDefsReasonMisleading = class {
  static nsid = "com.atproto.moderation.defs";
  static def = "reasonMisleading";
  static kind = "token";
  static value = "com.atproto.moderation.defs#reasonMisleading";
  static description = "Misleading identity, affiliation, or content. Prefer new lexicon definition `tools.ozone.report.defs#reasonMisleadingOther`.";
  constructor() {
  }
};
var ComAtprotoModerationDefsReasonOther = class {
  static nsid = "com.atproto.moderation.defs";
  static def = "reasonOther";
  static kind = "token";
  static value = "com.atproto.moderation.defs#reasonOther";
  static description = "Reports not falling under another report category. Prefer new lexicon definition `tools.ozone.report.defs#reasonOther`.";
  constructor() {
  }
};
var ComAtprotoModerationDefsReasonRude = class {
  static nsid = "com.atproto.moderation.defs";
  static def = "reasonRude";
  static kind = "token";
  static value = "com.atproto.moderation.defs#reasonRude";
  static description = "Rude, harassing, explicit, or otherwise unwelcoming behavior. Prefer new lexicon definition `tools.ozone.report.defs#reasonHarassmentOther`.";
  constructor() {
  }
};
var ComAtprotoModerationDefsReasonSexual = class {
  static nsid = "com.atproto.moderation.defs";
  static def = "reasonSexual";
  static kind = "token";
  static value = "com.atproto.moderation.defs#reasonSexual";
  static description = "Unwanted or mislabeled sexual content. Prefer new lexicon definition `tools.ozone.report.defs#reasonSexualUnlabeled`.";
  constructor() {
  }
};
var ComAtprotoModerationDefsReasonSpam = class {
  static nsid = "com.atproto.moderation.defs";
  static def = "reasonSpam";
  static kind = "token";
  static value = "com.atproto.moderation.defs#reasonSpam";
  static description = "Spam: frequent unwanted promotion, replies, mentions. Prefer new lexicon definition `tools.ozone.report.defs#reasonMisleadingSpam`.";
  constructor() {
  }
};
var ComAtprotoModerationDefsReasonType = class _ComAtprotoModerationDefsReasonType {
  static nsid = "com.atproto.moderation.defs";
  static def = "reasonType";
  static kind = "string";
  static knownValues = ["com.atproto.moderation.defs#reasonSpam", "com.atproto.moderation.defs#reasonViolation", "com.atproto.moderation.defs#reasonMisleading", "com.atproto.moderation.defs#reasonSexual", "com.atproto.moderation.defs#reasonRude", "com.atproto.moderation.defs#reasonOther", "com.atproto.moderation.defs#reasonAppeal", "tools.ozone.report.defs#reasonAppeal", "tools.ozone.report.defs#reasonOther", "tools.ozone.report.defs#reasonViolenceAnimal", "tools.ozone.report.defs#reasonViolenceThreats", "tools.ozone.report.defs#reasonViolenceGraphicContent", "tools.ozone.report.defs#reasonViolenceGlorification", "tools.ozone.report.defs#reasonViolenceExtremistContent", "tools.ozone.report.defs#reasonViolenceTrafficking", "tools.ozone.report.defs#reasonViolenceOther", "tools.ozone.report.defs#reasonSexualAbuseContent", "tools.ozone.report.defs#reasonSexualNCII", "tools.ozone.report.defs#reasonSexualDeepfake", "tools.ozone.report.defs#reasonSexualAnimal", "tools.ozone.report.defs#reasonSexualUnlabeled", "tools.ozone.report.defs#reasonSexualOther", "tools.ozone.report.defs#reasonChildSafetyCSAM", "tools.ozone.report.defs#reasonChildSafetyGroom", "tools.ozone.report.defs#reasonChildSafetyPrivacy", "tools.ozone.report.defs#reasonChildSafetyHarassment", "tools.ozone.report.defs#reasonChildSafetyOther", "tools.ozone.report.defs#reasonHarassmentTroll", "tools.ozone.report.defs#reasonHarassmentTargeted", "tools.ozone.report.defs#reasonHarassmentHateSpeech", "tools.ozone.report.defs#reasonHarassmentDoxxing", "tools.ozone.report.defs#reasonHarassmentOther", "tools.ozone.report.defs#reasonMisleadingBot", "tools.ozone.report.defs#reasonMisleadingImpersonation", "tools.ozone.report.defs#reasonMisleadingSpam", "tools.ozone.report.defs#reasonMisleadingScam", "tools.ozone.report.defs#reasonMisleadingElections", "tools.ozone.report.defs#reasonMisleadingOther", "tools.ozone.report.defs#reasonRuleSiteSecurity", "tools.ozone.report.defs#reasonRuleProhibitedSales", "tools.ozone.report.defs#reasonRuleBanEvasion", "tools.ozone.report.defs#reasonRuleOther", "tools.ozone.report.defs#reasonSelfHarmContent", "tools.ozone.report.defs#reasonSelfHarmED", "tools.ozone.report.defs#reasonSelfHarmStunts", "tools.ozone.report.defs#reasonSelfHarmSubstances", "tools.ozone.report.defs#reasonSelfHarmOther"];
  static includes(value) {
    return _ComAtprotoModerationDefsReasonType.knownValues.includes(value);
  }
  constructor() {
  }
};
var ComAtprotoModerationDefsReasonViolation = class {
  static nsid = "com.atproto.moderation.defs";
  static def = "reasonViolation";
  static kind = "token";
  static value = "com.atproto.moderation.defs#reasonViolation";
  static description = "Direct violation of server rules, laws, terms of service. Prefer new lexicon definition `tools.ozone.report.defs#reasonRuleOther`.";
  constructor() {
  }
};
var ComAtprotoModerationDefsSubjectType = class _ComAtprotoModerationDefsSubjectType {
  static nsid = "com.atproto.moderation.defs";
  static def = "subjectType";
  static kind = "string";
  static knownValues = ["account", "record", "chat"];
  static includes(value) {
    return _ComAtprotoModerationDefsSubjectType.knownValues.includes(value);
  }
  constructor() {
  }
};
var ComAtprotoRepoApplyWrites = class _ComAtprotoRepoApplyWrites {
  static nsid = "com.atproto.repo.applyWrites";
  static def = "main";
  static kind = "procedure";
  static http = "POST";
  static errorNames = ["InvalidSwap"];
  repo;
  validate;
  writes;
  swapCommit;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({});
  }
  toBody() {
    return jsonOf({
      repo: this["repo"],
      validate: this["validate"],
      writes: this["writes"],
      swapCommit: this["swapCommit"]
    });
  }
  check() {
    const issues = [];
    if (this["repo"] == null) issues.push({ path: "repo", message: "Required." });
    if (this["writes"] == null) issues.push({ path: "writes", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _ComAtprotoRepoApplyWrites.nsid,
      method: "POST",
      params: this.toParams(),
      body: this.toBody(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ComAtprotoRepoApplyWrites(value);
    record.check();
    return record;
  }
};
var ComAtprotoRepoApplyWritesCreate = class _ComAtprotoRepoApplyWritesCreate {
  static nsid = "com.atproto.repo.applyWrites";
  static def = "create";
  static kind = "object";
  $type;
  collection;
  rkey;
  value;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "com.atproto.repo.applyWrites#create";
  }
  check() {
    const issues = [];
    if (this["collection"] == null) issues.push({ path: "collection", message: "Required." });
    if (typeof this["rkey"] === "string" && this["rkey"].length > 512) issues.push({ path: "rkey", message: "Must be at most 512 characters." });
    if (this["value"] == null) issues.push({ path: "value", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      collection: this["collection"],
      rkey: this["rkey"],
      value: this["value"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ComAtprotoRepoApplyWritesCreate(value);
    record.check();
    return record;
  }
};
var ComAtprotoRepoApplyWritesCreateResult = class _ComAtprotoRepoApplyWritesCreateResult {
  static nsid = "com.atproto.repo.applyWrites";
  static def = "createResult";
  static kind = "object";
  $type;
  uri;
  cid;
  validationStatus;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "com.atproto.repo.applyWrites#createResult";
  }
  check() {
    const issues = [];
    if (this["uri"] == null) issues.push({ path: "uri", message: "Required." });
    if (this["cid"] == null) issues.push({ path: "cid", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      uri: this["uri"],
      cid: this["cid"],
      validationStatus: this["validationStatus"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ComAtprotoRepoApplyWritesCreateResult(value);
    record.check();
    return record;
  }
};
var ComAtprotoRepoApplyWritesDelete = class _ComAtprotoRepoApplyWritesDelete {
  static nsid = "com.atproto.repo.applyWrites";
  static def = "delete";
  static kind = "object";
  $type;
  collection;
  rkey;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "com.atproto.repo.applyWrites#delete";
  }
  check() {
    const issues = [];
    if (this["collection"] == null) issues.push({ path: "collection", message: "Required." });
    if (this["rkey"] == null) issues.push({ path: "rkey", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      collection: this["collection"],
      rkey: this["rkey"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ComAtprotoRepoApplyWritesDelete(value);
    record.check();
    return record;
  }
};
var ComAtprotoRepoApplyWritesDeleteResult = class _ComAtprotoRepoApplyWritesDeleteResult {
  static nsid = "com.atproto.repo.applyWrites";
  static def = "deleteResult";
  static kind = "object";
  $type;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "com.atproto.repo.applyWrites#deleteResult";
  }
  check() {
    const issues = [];
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ComAtprotoRepoApplyWritesDeleteResult(value);
    record.check();
    return record;
  }
};
var ComAtprotoRepoApplyWritesUpdate = class _ComAtprotoRepoApplyWritesUpdate {
  static nsid = "com.atproto.repo.applyWrites";
  static def = "update";
  static kind = "object";
  $type;
  collection;
  rkey;
  value;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "com.atproto.repo.applyWrites#update";
  }
  check() {
    const issues = [];
    if (this["collection"] == null) issues.push({ path: "collection", message: "Required." });
    if (this["rkey"] == null) issues.push({ path: "rkey", message: "Required." });
    if (this["value"] == null) issues.push({ path: "value", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      collection: this["collection"],
      rkey: this["rkey"],
      value: this["value"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ComAtprotoRepoApplyWritesUpdate(value);
    record.check();
    return record;
  }
};
var ComAtprotoRepoApplyWritesUpdateResult = class _ComAtprotoRepoApplyWritesUpdateResult {
  static nsid = "com.atproto.repo.applyWrites";
  static def = "updateResult";
  static kind = "object";
  $type;
  uri;
  cid;
  validationStatus;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "com.atproto.repo.applyWrites#updateResult";
  }
  check() {
    const issues = [];
    if (this["uri"] == null) issues.push({ path: "uri", message: "Required." });
    if (this["cid"] == null) issues.push({ path: "cid", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      uri: this["uri"],
      cid: this["cid"],
      validationStatus: this["validationStatus"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ComAtprotoRepoApplyWritesUpdateResult(value);
    record.check();
    return record;
  }
};
var ComAtprotoRepoCreateRecord = class _ComAtprotoRepoCreateRecord {
  static nsid = "com.atproto.repo.createRecord";
  static def = "main";
  static kind = "procedure";
  static http = "POST";
  static errorNames = ["InvalidSwap"];
  repo;
  collection;
  rkey;
  validate;
  record;
  swapCommit;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({});
  }
  toBody() {
    return jsonOf({
      repo: this["repo"],
      collection: this["collection"],
      rkey: this["rkey"],
      validate: this["validate"],
      record: this["record"],
      swapCommit: this["swapCommit"]
    });
  }
  check() {
    const issues = [];
    if (this["repo"] == null) issues.push({ path: "repo", message: "Required." });
    if (this["collection"] == null) issues.push({ path: "collection", message: "Required." });
    if (typeof this["rkey"] === "string" && this["rkey"].length > 512) issues.push({ path: "rkey", message: "Must be at most 512 characters." });
    if (this["record"] == null) issues.push({ path: "record", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _ComAtprotoRepoCreateRecord.nsid,
      method: "POST",
      params: this.toParams(),
      body: this.toBody(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ComAtprotoRepoCreateRecord(value);
    record.check();
    return record;
  }
};
var ComAtprotoRepoDefsCommitMeta = class _ComAtprotoRepoDefsCommitMeta {
  static nsid = "com.atproto.repo.defs";
  static def = "commitMeta";
  static kind = "object";
  $type;
  cid;
  rev;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "com.atproto.repo.defs#commitMeta";
  }
  check() {
    const issues = [];
    if (this["cid"] == null) issues.push({ path: "cid", message: "Required." });
    if (this["rev"] == null) issues.push({ path: "rev", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      cid: this["cid"],
      rev: this["rev"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ComAtprotoRepoDefsCommitMeta(value);
    record.check();
    return record;
  }
};
var ComAtprotoRepoDeleteRecord = class _ComAtprotoRepoDeleteRecord {
  static nsid = "com.atproto.repo.deleteRecord";
  static def = "main";
  static kind = "procedure";
  static http = "POST";
  static errorNames = ["InvalidSwap"];
  repo;
  collection;
  rkey;
  swapRecord;
  swapCommit;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({});
  }
  toBody() {
    return jsonOf({
      repo: this["repo"],
      collection: this["collection"],
      rkey: this["rkey"],
      swapRecord: this["swapRecord"],
      swapCommit: this["swapCommit"]
    });
  }
  check() {
    const issues = [];
    if (this["repo"] == null) issues.push({ path: "repo", message: "Required." });
    if (this["collection"] == null) issues.push({ path: "collection", message: "Required." });
    if (this["rkey"] == null) issues.push({ path: "rkey", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _ComAtprotoRepoDeleteRecord.nsid,
      method: "POST",
      params: this.toParams(),
      body: this.toBody(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ComAtprotoRepoDeleteRecord(value);
    record.check();
    return record;
  }
};
var ComAtprotoRepoDescribeRepo = class _ComAtprotoRepoDescribeRepo {
  static nsid = "com.atproto.repo.describeRepo";
  static def = "main";
  static kind = "query";
  static http = "GET";
  static errorNames = [];
  repo;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({
      repo: this["repo"]
    });
  }
  check() {
    const issues = [];
    if (this["repo"] == null) issues.push({ path: "repo", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _ComAtprotoRepoDescribeRepo.nsid,
      method: "GET",
      params: this.toParams(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ComAtprotoRepoDescribeRepo(value);
    record.check();
    return record;
  }
};
var ComAtprotoRepoGetRecord = class _ComAtprotoRepoGetRecord {
  static nsid = "com.atproto.repo.getRecord";
  static def = "main";
  static kind = "query";
  static http = "GET";
  static errorNames = ["RecordNotFound"];
  repo;
  collection;
  rkey;
  cid;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({
      repo: this["repo"],
      collection: this["collection"],
      rkey: this["rkey"],
      cid: this["cid"]
    });
  }
  check() {
    const issues = [];
    if (this["repo"] == null) issues.push({ path: "repo", message: "Required." });
    if (this["collection"] == null) issues.push({ path: "collection", message: "Required." });
    if (this["rkey"] == null) issues.push({ path: "rkey", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _ComAtprotoRepoGetRecord.nsid,
      method: "GET",
      params: this.toParams(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ComAtprotoRepoGetRecord(value);
    record.check();
    return record;
  }
};
var ComAtprotoRepoImportRepo = class _ComAtprotoRepoImportRepo {
  static nsid = "com.atproto.repo.importRepo";
  static def = "main";
  static kind = "procedure";
  static http = "POST";
  static errorNames = [];
  payload;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({});
  }
  check() {
    const issues = [];
    if (this["payload"] == null) issues.push({ path: "payload", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _ComAtprotoRepoImportRepo.nsid,
      method: "POST",
      params: this.toParams(),
      blob: this.payload,
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ComAtprotoRepoImportRepo(value);
    record.check();
    return record;
  }
};
var ComAtprotoRepoListMissingBlobs = class _ComAtprotoRepoListMissingBlobs {
  static nsid = "com.atproto.repo.listMissingBlobs";
  static def = "main";
  static kind = "query";
  static http = "GET";
  static errorNames = [];
  limit;
  cursor;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({
      limit: this["limit"],
      cursor: this["cursor"]
    });
  }
  check() {
    const issues = [];
    if (this["limit"] != null) {
      if (!Number.isInteger(this["limit"])) issues.push({ path: "limit", message: "Must be an integer." });
      else if (this["limit"] < 1) issues.push({ path: "limit", message: "Must be at least 1." });
      else if (this["limit"] > 1e3) issues.push({ path: "limit", message: "Must be at most 1000." });
    }
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _ComAtprotoRepoListMissingBlobs.nsid,
      method: "GET",
      params: this.toParams(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ComAtprotoRepoListMissingBlobs(value);
    record.check();
    return record;
  }
};
var ComAtprotoRepoListMissingBlobsRecordBlob = class _ComAtprotoRepoListMissingBlobsRecordBlob {
  static nsid = "com.atproto.repo.listMissingBlobs";
  static def = "recordBlob";
  static kind = "object";
  $type;
  cid;
  recordUri;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "com.atproto.repo.listMissingBlobs#recordBlob";
  }
  check() {
    const issues = [];
    if (this["cid"] == null) issues.push({ path: "cid", message: "Required." });
    if (this["recordUri"] == null) issues.push({ path: "recordUri", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      cid: this["cid"],
      recordUri: this["recordUri"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ComAtprotoRepoListMissingBlobsRecordBlob(value);
    record.check();
    return record;
  }
};
var ComAtprotoRepoListRecords = class _ComAtprotoRepoListRecords {
  static nsid = "com.atproto.repo.listRecords";
  static def = "main";
  static kind = "query";
  static http = "GET";
  static errorNames = [];
  repo;
  collection;
  limit;
  cursor;
  reverse;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({
      repo: this["repo"],
      collection: this["collection"],
      limit: this["limit"],
      cursor: this["cursor"],
      reverse: this["reverse"]
    });
  }
  check() {
    const issues = [];
    if (this["repo"] == null) issues.push({ path: "repo", message: "Required." });
    if (this["collection"] == null) issues.push({ path: "collection", message: "Required." });
    if (this["limit"] != null) {
      if (!Number.isInteger(this["limit"])) issues.push({ path: "limit", message: "Must be an integer." });
      else if (this["limit"] < 1) issues.push({ path: "limit", message: "Must be at least 1." });
      else if (this["limit"] > 100) issues.push({ path: "limit", message: "Must be at most 100." });
    }
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _ComAtprotoRepoListRecords.nsid,
      method: "GET",
      params: this.toParams(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ComAtprotoRepoListRecords(value);
    record.check();
    return record;
  }
};
var ComAtprotoRepoListRecordsRecord = class _ComAtprotoRepoListRecordsRecord {
  static nsid = "com.atproto.repo.listRecords";
  static def = "record";
  static kind = "object";
  $type;
  uri;
  cid;
  value;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "com.atproto.repo.listRecords#record";
  }
  check() {
    const issues = [];
    if (this["uri"] == null) issues.push({ path: "uri", message: "Required." });
    if (this["cid"] == null) issues.push({ path: "cid", message: "Required." });
    if (this["value"] == null) issues.push({ path: "value", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      uri: this["uri"],
      cid: this["cid"],
      value: this["value"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ComAtprotoRepoListRecordsRecord(value);
    record.check();
    return record;
  }
};
var ComAtprotoRepoPutRecord = class _ComAtprotoRepoPutRecord {
  static nsid = "com.atproto.repo.putRecord";
  static def = "main";
  static kind = "procedure";
  static http = "POST";
  static errorNames = ["InvalidSwap"];
  repo;
  collection;
  rkey;
  validate;
  record;
  swapRecord;
  swapCommit;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({});
  }
  toBody() {
    return jsonOf({
      repo: this["repo"],
      collection: this["collection"],
      rkey: this["rkey"],
      validate: this["validate"],
      record: this["record"],
      swapRecord: this["swapRecord"],
      swapCommit: this["swapCommit"]
    });
  }
  check() {
    const issues = [];
    if (this["repo"] == null) issues.push({ path: "repo", message: "Required." });
    if (this["collection"] == null) issues.push({ path: "collection", message: "Required." });
    if (this["rkey"] == null) issues.push({ path: "rkey", message: "Required." });
    if (typeof this["rkey"] === "string" && this["rkey"].length > 512) issues.push({ path: "rkey", message: "Must be at most 512 characters." });
    if (this["record"] == null) issues.push({ path: "record", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _ComAtprotoRepoPutRecord.nsid,
      method: "POST",
      params: this.toParams(),
      body: this.toBody(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ComAtprotoRepoPutRecord(value);
    record.check();
    return record;
  }
};
var ComAtprotoRepoStrongRef = class _ComAtprotoRepoStrongRef {
  static nsid = "com.atproto.repo.strongRef";
  static def = "main";
  static kind = "object";
  $type;
  uri;
  cid;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "com.atproto.repo.strongRef";
  }
  check() {
    const issues = [];
    if (this["uri"] == null) issues.push({ path: "uri", message: "Required." });
    if (this["cid"] == null) issues.push({ path: "cid", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      uri: this["uri"],
      cid: this["cid"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ComAtprotoRepoStrongRef(value);
    record.check();
    return record;
  }
};
var ComAtprotoRepoUploadBlob = class _ComAtprotoRepoUploadBlob {
  static nsid = "com.atproto.repo.uploadBlob";
  static def = "main";
  static kind = "procedure";
  static http = "POST";
  static errorNames = [];
  payload;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({});
  }
  check() {
    const issues = [];
    if (this["payload"] == null) issues.push({ path: "payload", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _ComAtprotoRepoUploadBlob.nsid,
      method: "POST",
      params: this.toParams(),
      blob: this.payload,
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ComAtprotoRepoUploadBlob(value);
    record.check();
    return record;
  }
};
var ComAtprotoServerActivateAccount = class _ComAtprotoServerActivateAccount {
  static nsid = "com.atproto.server.activateAccount";
  static def = "main";
  static kind = "procedure";
  static http = "POST";
  static errorNames = [];
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({});
  }
  check() {
    const issues = [];
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _ComAtprotoServerActivateAccount.nsid,
      method: "POST",
      params: this.toParams(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ComAtprotoServerActivateAccount(value);
    record.check();
    return record;
  }
};
var ComAtprotoServerCheckAccountStatus = class _ComAtprotoServerCheckAccountStatus {
  static nsid = "com.atproto.server.checkAccountStatus";
  static def = "main";
  static kind = "query";
  static http = "GET";
  static errorNames = [];
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({});
  }
  check() {
    const issues = [];
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _ComAtprotoServerCheckAccountStatus.nsid,
      method: "GET",
      params: this.toParams(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ComAtprotoServerCheckAccountStatus(value);
    record.check();
    return record;
  }
};
var ComAtprotoServerConfirmEmail = class _ComAtprotoServerConfirmEmail {
  static nsid = "com.atproto.server.confirmEmail";
  static def = "main";
  static kind = "procedure";
  static http = "POST";
  static errorNames = ["AccountNotFound", "ExpiredToken", "InvalidToken", "InvalidEmail"];
  email;
  token;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({});
  }
  toBody() {
    return jsonOf({
      email: this["email"],
      token: this["token"]
    });
  }
  check() {
    const issues = [];
    if (this["email"] == null) issues.push({ path: "email", message: "Required." });
    if (this["token"] == null) issues.push({ path: "token", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _ComAtprotoServerConfirmEmail.nsid,
      method: "POST",
      params: this.toParams(),
      body: this.toBody(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ComAtprotoServerConfirmEmail(value);
    record.check();
    return record;
  }
};
var ComAtprotoServerCreateAccount = class _ComAtprotoServerCreateAccount {
  static nsid = "com.atproto.server.createAccount";
  static def = "main";
  static kind = "procedure";
  static http = "POST";
  static errorNames = ["InvalidHandle", "InvalidPassword", "InvalidInviteCode", "HandleNotAvailable", "UnsupportedDomain", "UnresolvableDid", "IncompatibleDidDoc"];
  email;
  handle;
  did;
  inviteCode;
  verificationCode;
  verificationPhone;
  password;
  recoveryKey;
  plcOp;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({});
  }
  toBody() {
    return jsonOf({
      email: this["email"],
      handle: this["handle"],
      did: this["did"],
      inviteCode: this["inviteCode"],
      verificationCode: this["verificationCode"],
      verificationPhone: this["verificationPhone"],
      password: this["password"],
      recoveryKey: this["recoveryKey"],
      plcOp: this["plcOp"]
    });
  }
  check() {
    const issues = [];
    if (this["handle"] == null) issues.push({ path: "handle", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _ComAtprotoServerCreateAccount.nsid,
      method: "POST",
      params: this.toParams(),
      body: this.toBody(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ComAtprotoServerCreateAccount(value);
    record.check();
    return record;
  }
};
var ComAtprotoServerCreateAppPassword = class _ComAtprotoServerCreateAppPassword {
  static nsid = "com.atproto.server.createAppPassword";
  static def = "main";
  static kind = "procedure";
  static http = "POST";
  static errorNames = ["AccountTakedown"];
  name;
  privileged;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({});
  }
  toBody() {
    return jsonOf({
      name: this["name"],
      privileged: this["privileged"]
    });
  }
  check() {
    const issues = [];
    if (this["name"] == null) issues.push({ path: "name", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _ComAtprotoServerCreateAppPassword.nsid,
      method: "POST",
      params: this.toParams(),
      body: this.toBody(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ComAtprotoServerCreateAppPassword(value);
    record.check();
    return record;
  }
};
var ComAtprotoServerCreateAppPasswordAppPassword = class _ComAtprotoServerCreateAppPasswordAppPassword {
  static nsid = "com.atproto.server.createAppPassword";
  static def = "appPassword";
  static kind = "object";
  $type;
  name;
  password;
  createdAt;
  privileged;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "com.atproto.server.createAppPassword#appPassword";
  }
  check() {
    const issues = [];
    if (this["name"] == null) issues.push({ path: "name", message: "Required." });
    if (this["password"] == null) issues.push({ path: "password", message: "Required." });
    if (this["createdAt"] == null) issues.push({ path: "createdAt", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      name: this["name"],
      password: this["password"],
      createdAt: this["createdAt"],
      privileged: this["privileged"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ComAtprotoServerCreateAppPasswordAppPassword(value);
    record.check();
    return record;
  }
};
var ComAtprotoServerCreateInviteCode = class _ComAtprotoServerCreateInviteCode {
  static nsid = "com.atproto.server.createInviteCode";
  static def = "main";
  static kind = "procedure";
  static http = "POST";
  static errorNames = [];
  useCount;
  forAccount;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({});
  }
  toBody() {
    return jsonOf({
      useCount: this["useCount"],
      forAccount: this["forAccount"]
    });
  }
  check() {
    const issues = [];
    if (this["useCount"] == null) issues.push({ path: "useCount", message: "Required." });
    if (this["useCount"] != null) {
      if (!Number.isInteger(this["useCount"])) issues.push({ path: "useCount", message: "Must be an integer." });
    }
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _ComAtprotoServerCreateInviteCode.nsid,
      method: "POST",
      params: this.toParams(),
      body: this.toBody(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ComAtprotoServerCreateInviteCode(value);
    record.check();
    return record;
  }
};
var ComAtprotoServerCreateInviteCodes = class _ComAtprotoServerCreateInviteCodes {
  static nsid = "com.atproto.server.createInviteCodes";
  static def = "main";
  static kind = "procedure";
  static http = "POST";
  static errorNames = [];
  codeCount;
  useCount;
  forAccounts;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({});
  }
  toBody() {
    return jsonOf({
      codeCount: this["codeCount"],
      useCount: this["useCount"],
      forAccounts: this["forAccounts"]
    });
  }
  check() {
    const issues = [];
    if (this["codeCount"] == null) issues.push({ path: "codeCount", message: "Required." });
    if (this["codeCount"] != null) {
      if (!Number.isInteger(this["codeCount"])) issues.push({ path: "codeCount", message: "Must be an integer." });
    }
    if (this["useCount"] == null) issues.push({ path: "useCount", message: "Required." });
    if (this["useCount"] != null) {
      if (!Number.isInteger(this["useCount"])) issues.push({ path: "useCount", message: "Must be an integer." });
    }
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _ComAtprotoServerCreateInviteCodes.nsid,
      method: "POST",
      params: this.toParams(),
      body: this.toBody(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ComAtprotoServerCreateInviteCodes(value);
    record.check();
    return record;
  }
};
var ComAtprotoServerCreateInviteCodesAccountCodes = class _ComAtprotoServerCreateInviteCodesAccountCodes {
  static nsid = "com.atproto.server.createInviteCodes";
  static def = "accountCodes";
  static kind = "object";
  $type;
  account;
  codes;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "com.atproto.server.createInviteCodes#accountCodes";
  }
  check() {
    const issues = [];
    if (this["account"] == null) issues.push({ path: "account", message: "Required." });
    if (this["codes"] == null) issues.push({ path: "codes", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      account: this["account"],
      codes: this["codes"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ComAtprotoServerCreateInviteCodesAccountCodes(value);
    record.check();
    return record;
  }
};
var ComAtprotoServerCreateSession = class _ComAtprotoServerCreateSession {
  static nsid = "com.atproto.server.createSession";
  static def = "main";
  static kind = "procedure";
  static http = "POST";
  static errorNames = ["AccountTakedown", "AuthFactorTokenRequired"];
  identifier;
  password;
  authFactorToken;
  allowTakendown;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({});
  }
  toBody() {
    return jsonOf({
      identifier: this["identifier"],
      password: this["password"],
      authFactorToken: this["authFactorToken"],
      allowTakendown: this["allowTakendown"]
    });
  }
  check() {
    const issues = [];
    if (this["identifier"] == null) issues.push({ path: "identifier", message: "Required." });
    if (this["password"] == null) issues.push({ path: "password", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _ComAtprotoServerCreateSession.nsid,
      method: "POST",
      params: this.toParams(),
      body: this.toBody(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ComAtprotoServerCreateSession(value);
    record.check();
    return record;
  }
};
var ComAtprotoServerDeactivateAccount = class _ComAtprotoServerDeactivateAccount {
  static nsid = "com.atproto.server.deactivateAccount";
  static def = "main";
  static kind = "procedure";
  static http = "POST";
  static errorNames = [];
  deleteAfter;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({});
  }
  toBody() {
    return jsonOf({
      deleteAfter: this["deleteAfter"]
    });
  }
  check() {
    const issues = [];
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _ComAtprotoServerDeactivateAccount.nsid,
      method: "POST",
      params: this.toParams(),
      body: this.toBody(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ComAtprotoServerDeactivateAccount(value);
    record.check();
    return record;
  }
};
var ComAtprotoServerDefsInviteCode = class _ComAtprotoServerDefsInviteCode {
  static nsid = "com.atproto.server.defs";
  static def = "inviteCode";
  static kind = "object";
  $type;
  code;
  available;
  disabled;
  forAccount;
  createdBy;
  createdAt;
  uses;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "com.atproto.server.defs#inviteCode";
  }
  check() {
    const issues = [];
    if (this["code"] == null) issues.push({ path: "code", message: "Required." });
    if (this["available"] == null) issues.push({ path: "available", message: "Required." });
    if (this["available"] != null) {
      if (!Number.isInteger(this["available"])) issues.push({ path: "available", message: "Must be an integer." });
    }
    if (this["disabled"] == null) issues.push({ path: "disabled", message: "Required." });
    if (this["forAccount"] == null) issues.push({ path: "forAccount", message: "Required." });
    if (this["createdBy"] == null) issues.push({ path: "createdBy", message: "Required." });
    if (this["createdAt"] == null) issues.push({ path: "createdAt", message: "Required." });
    if (this["uses"] == null) issues.push({ path: "uses", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      code: this["code"],
      available: this["available"],
      disabled: this["disabled"],
      forAccount: this["forAccount"],
      createdBy: this["createdBy"],
      createdAt: this["createdAt"],
      uses: this["uses"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ComAtprotoServerDefsInviteCode(value);
    record.check();
    return record;
  }
};
var ComAtprotoServerDefsInviteCodeUse = class _ComAtprotoServerDefsInviteCodeUse {
  static nsid = "com.atproto.server.defs";
  static def = "inviteCodeUse";
  static kind = "object";
  $type;
  usedBy;
  usedAt;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "com.atproto.server.defs#inviteCodeUse";
  }
  check() {
    const issues = [];
    if (this["usedBy"] == null) issues.push({ path: "usedBy", message: "Required." });
    if (this["usedAt"] == null) issues.push({ path: "usedAt", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      usedBy: this["usedBy"],
      usedAt: this["usedAt"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ComAtprotoServerDefsInviteCodeUse(value);
    record.check();
    return record;
  }
};
var ComAtprotoServerDeleteAccount = class _ComAtprotoServerDeleteAccount {
  static nsid = "com.atproto.server.deleteAccount";
  static def = "main";
  static kind = "procedure";
  static http = "POST";
  static errorNames = ["ExpiredToken", "InvalidToken"];
  did;
  password;
  token;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({});
  }
  toBody() {
    return jsonOf({
      did: this["did"],
      password: this["password"],
      token: this["token"]
    });
  }
  check() {
    const issues = [];
    if (this["did"] == null) issues.push({ path: "did", message: "Required." });
    if (this["password"] == null) issues.push({ path: "password", message: "Required." });
    if (this["token"] == null) issues.push({ path: "token", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _ComAtprotoServerDeleteAccount.nsid,
      method: "POST",
      params: this.toParams(),
      body: this.toBody(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ComAtprotoServerDeleteAccount(value);
    record.check();
    return record;
  }
};
var ComAtprotoServerDeleteSession = class _ComAtprotoServerDeleteSession {
  static nsid = "com.atproto.server.deleteSession";
  static def = "main";
  static kind = "procedure";
  static http = "POST";
  static errorNames = ["InvalidToken", "ExpiredToken"];
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({});
  }
  check() {
    const issues = [];
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _ComAtprotoServerDeleteSession.nsid,
      method: "POST",
      params: this.toParams(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ComAtprotoServerDeleteSession(value);
    record.check();
    return record;
  }
};
var ComAtprotoServerDescribeServer = class _ComAtprotoServerDescribeServer {
  static nsid = "com.atproto.server.describeServer";
  static def = "main";
  static kind = "query";
  static http = "GET";
  static errorNames = [];
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({});
  }
  check() {
    const issues = [];
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _ComAtprotoServerDescribeServer.nsid,
      method: "GET",
      params: this.toParams(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ComAtprotoServerDescribeServer(value);
    record.check();
    return record;
  }
};
var ComAtprotoServerDescribeServerContact = class _ComAtprotoServerDescribeServerContact {
  static nsid = "com.atproto.server.describeServer";
  static def = "contact";
  static kind = "object";
  $type;
  email;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "com.atproto.server.describeServer#contact";
  }
  check() {
    const issues = [];
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      email: this["email"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ComAtprotoServerDescribeServerContact(value);
    record.check();
    return record;
  }
};
var ComAtprotoServerDescribeServerLinks = class _ComAtprotoServerDescribeServerLinks {
  static nsid = "com.atproto.server.describeServer";
  static def = "links";
  static kind = "object";
  $type;
  privacyPolicy;
  termsOfService;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "com.atproto.server.describeServer#links";
  }
  check() {
    const issues = [];
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      privacyPolicy: this["privacyPolicy"],
      termsOfService: this["termsOfService"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ComAtprotoServerDescribeServerLinks(value);
    record.check();
    return record;
  }
};
var ComAtprotoServerGetAccountInviteCodes = class _ComAtprotoServerGetAccountInviteCodes {
  static nsid = "com.atproto.server.getAccountInviteCodes";
  static def = "main";
  static kind = "query";
  static http = "GET";
  static errorNames = ["DuplicateCreate"];
  includeUsed;
  createAvailable;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({
      includeUsed: this["includeUsed"],
      createAvailable: this["createAvailable"]
    });
  }
  check() {
    const issues = [];
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _ComAtprotoServerGetAccountInviteCodes.nsid,
      method: "GET",
      params: this.toParams(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ComAtprotoServerGetAccountInviteCodes(value);
    record.check();
    return record;
  }
};
var ComAtprotoServerGetServiceAuth = class _ComAtprotoServerGetServiceAuth {
  static nsid = "com.atproto.server.getServiceAuth";
  static def = "main";
  static kind = "query";
  static http = "GET";
  static errorNames = ["BadExpiration"];
  aud;
  exp;
  lxm;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({
      aud: this["aud"],
      exp: this["exp"],
      lxm: this["lxm"]
    });
  }
  check() {
    const issues = [];
    if (this["aud"] == null) issues.push({ path: "aud", message: "Required." });
    if (typeof this["aud"] === "string" && this["aud"].length > 2048) issues.push({ path: "aud", message: "Must be at most 2048 characters." });
    if (this["exp"] != null) {
      if (!Number.isInteger(this["exp"])) issues.push({ path: "exp", message: "Must be an integer." });
    }
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _ComAtprotoServerGetServiceAuth.nsid,
      method: "GET",
      params: this.toParams(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ComAtprotoServerGetServiceAuth(value);
    record.check();
    return record;
  }
};
var ComAtprotoServerGetSession = class _ComAtprotoServerGetSession {
  static nsid = "com.atproto.server.getSession";
  static def = "main";
  static kind = "query";
  static http = "GET";
  static errorNames = [];
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({});
  }
  check() {
    const issues = [];
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _ComAtprotoServerGetSession.nsid,
      method: "GET",
      params: this.toParams(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ComAtprotoServerGetSession(value);
    record.check();
    return record;
  }
};
var ComAtprotoServerListAppPasswords = class _ComAtprotoServerListAppPasswords {
  static nsid = "com.atproto.server.listAppPasswords";
  static def = "main";
  static kind = "query";
  static http = "GET";
  static errorNames = ["AccountTakedown"];
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({});
  }
  check() {
    const issues = [];
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _ComAtprotoServerListAppPasswords.nsid,
      method: "GET",
      params: this.toParams(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ComAtprotoServerListAppPasswords(value);
    record.check();
    return record;
  }
};
var ComAtprotoServerListAppPasswordsAppPassword = class _ComAtprotoServerListAppPasswordsAppPassword {
  static nsid = "com.atproto.server.listAppPasswords";
  static def = "appPassword";
  static kind = "object";
  $type;
  name;
  createdAt;
  privileged;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "com.atproto.server.listAppPasswords#appPassword";
  }
  check() {
    const issues = [];
    if (this["name"] == null) issues.push({ path: "name", message: "Required." });
    if (this["createdAt"] == null) issues.push({ path: "createdAt", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      name: this["name"],
      createdAt: this["createdAt"],
      privileged: this["privileged"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ComAtprotoServerListAppPasswordsAppPassword(value);
    record.check();
    return record;
  }
};
var ComAtprotoServerRefreshSession = class _ComAtprotoServerRefreshSession {
  static nsid = "com.atproto.server.refreshSession";
  static def = "main";
  static kind = "procedure";
  static http = "POST";
  static errorNames = ["AccountTakedown", "InvalidToken", "ExpiredToken"];
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({});
  }
  check() {
    const issues = [];
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _ComAtprotoServerRefreshSession.nsid,
      method: "POST",
      params: this.toParams(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ComAtprotoServerRefreshSession(value);
    record.check();
    return record;
  }
};
var ComAtprotoServerRequestAccountDelete = class _ComAtprotoServerRequestAccountDelete {
  static nsid = "com.atproto.server.requestAccountDelete";
  static def = "main";
  static kind = "procedure";
  static http = "POST";
  static errorNames = [];
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({});
  }
  check() {
    const issues = [];
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _ComAtprotoServerRequestAccountDelete.nsid,
      method: "POST",
      params: this.toParams(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ComAtprotoServerRequestAccountDelete(value);
    record.check();
    return record;
  }
};
var ComAtprotoServerRequestEmailConfirmation = class _ComAtprotoServerRequestEmailConfirmation {
  static nsid = "com.atproto.server.requestEmailConfirmation";
  static def = "main";
  static kind = "procedure";
  static http = "POST";
  static errorNames = [];
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({});
  }
  check() {
    const issues = [];
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _ComAtprotoServerRequestEmailConfirmation.nsid,
      method: "POST",
      params: this.toParams(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ComAtprotoServerRequestEmailConfirmation(value);
    record.check();
    return record;
  }
};
var ComAtprotoServerRequestEmailUpdate = class _ComAtprotoServerRequestEmailUpdate {
  static nsid = "com.atproto.server.requestEmailUpdate";
  static def = "main";
  static kind = "procedure";
  static http = "POST";
  static errorNames = [];
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({});
  }
  check() {
    const issues = [];
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _ComAtprotoServerRequestEmailUpdate.nsid,
      method: "POST",
      params: this.toParams(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ComAtprotoServerRequestEmailUpdate(value);
    record.check();
    return record;
  }
};
var ComAtprotoServerRequestPasswordReset = class _ComAtprotoServerRequestPasswordReset {
  static nsid = "com.atproto.server.requestPasswordReset";
  static def = "main";
  static kind = "procedure";
  static http = "POST";
  static errorNames = [];
  email;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({});
  }
  toBody() {
    return jsonOf({
      email: this["email"]
    });
  }
  check() {
    const issues = [];
    if (this["email"] == null) issues.push({ path: "email", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _ComAtprotoServerRequestPasswordReset.nsid,
      method: "POST",
      params: this.toParams(),
      body: this.toBody(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ComAtprotoServerRequestPasswordReset(value);
    record.check();
    return record;
  }
};
var ComAtprotoServerReserveSigningKey = class _ComAtprotoServerReserveSigningKey {
  static nsid = "com.atproto.server.reserveSigningKey";
  static def = "main";
  static kind = "procedure";
  static http = "POST";
  static errorNames = [];
  did;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({});
  }
  toBody() {
    return jsonOf({
      did: this["did"]
    });
  }
  check() {
    const issues = [];
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _ComAtprotoServerReserveSigningKey.nsid,
      method: "POST",
      params: this.toParams(),
      body: this.toBody(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ComAtprotoServerReserveSigningKey(value);
    record.check();
    return record;
  }
};
var ComAtprotoServerResetPassword = class _ComAtprotoServerResetPassword {
  static nsid = "com.atproto.server.resetPassword";
  static def = "main";
  static kind = "procedure";
  static http = "POST";
  static errorNames = ["ExpiredToken", "InvalidToken"];
  token;
  password;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({});
  }
  toBody() {
    return jsonOf({
      token: this["token"],
      password: this["password"]
    });
  }
  check() {
    const issues = [];
    if (this["token"] == null) issues.push({ path: "token", message: "Required." });
    if (this["password"] == null) issues.push({ path: "password", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _ComAtprotoServerResetPassword.nsid,
      method: "POST",
      params: this.toParams(),
      body: this.toBody(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ComAtprotoServerResetPassword(value);
    record.check();
    return record;
  }
};
var ComAtprotoServerRevokeAppPassword = class _ComAtprotoServerRevokeAppPassword {
  static nsid = "com.atproto.server.revokeAppPassword";
  static def = "main";
  static kind = "procedure";
  static http = "POST";
  static errorNames = [];
  name;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({});
  }
  toBody() {
    return jsonOf({
      name: this["name"]
    });
  }
  check() {
    const issues = [];
    if (this["name"] == null) issues.push({ path: "name", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _ComAtprotoServerRevokeAppPassword.nsid,
      method: "POST",
      params: this.toParams(),
      body: this.toBody(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ComAtprotoServerRevokeAppPassword(value);
    record.check();
    return record;
  }
};
var ComAtprotoServerUpdateEmail = class _ComAtprotoServerUpdateEmail {
  static nsid = "com.atproto.server.updateEmail";
  static def = "main";
  static kind = "procedure";
  static http = "POST";
  static errorNames = ["ExpiredToken", "InvalidToken", "TokenRequired"];
  email;
  emailAuthFactor;
  token;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({});
  }
  toBody() {
    return jsonOf({
      email: this["email"],
      emailAuthFactor: this["emailAuthFactor"],
      token: this["token"]
    });
  }
  check() {
    const issues = [];
    if (this["email"] == null) issues.push({ path: "email", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _ComAtprotoServerUpdateEmail.nsid,
      method: "POST",
      params: this.toParams(),
      body: this.toBody(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ComAtprotoServerUpdateEmail(value);
    record.check();
    return record;
  }
};
var ComAtprotoSyncDefsHostStatus = class _ComAtprotoSyncDefsHostStatus {
  static nsid = "com.atproto.sync.defs";
  static def = "hostStatus";
  static kind = "string";
  static knownValues = ["active", "idle", "offline", "throttled", "banned"];
  static includes(value) {
    return _ComAtprotoSyncDefsHostStatus.knownValues.includes(value);
  }
  constructor() {
  }
};
var ComAtprotoSyncGetBlob = class _ComAtprotoSyncGetBlob {
  static nsid = "com.atproto.sync.getBlob";
  static def = "main";
  static kind = "query";
  static http = "GET";
  static errorNames = ["BlobNotFound", "RepoNotFound", "RepoTakendown", "RepoSuspended", "RepoDeactivated"];
  did;
  cid;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({
      did: this["did"],
      cid: this["cid"]
    });
  }
  check() {
    const issues = [];
    if (this["did"] == null) issues.push({ path: "did", message: "Required." });
    if (this["cid"] == null) issues.push({ path: "cid", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _ComAtprotoSyncGetBlob.nsid,
      method: "GET",
      params: this.toParams(),
      raw: true,
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ComAtprotoSyncGetBlob(value);
    record.check();
    return record;
  }
};
var ComAtprotoSyncGetBlocks = class _ComAtprotoSyncGetBlocks {
  static nsid = "com.atproto.sync.getBlocks";
  static def = "main";
  static kind = "query";
  static http = "GET";
  static errorNames = ["BlockNotFound", "RepoNotFound", "RepoTakendown", "RepoSuspended", "RepoDeactivated"];
  did;
  cids;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({
      did: this["did"],
      cids: this["cids"]
    });
  }
  check() {
    const issues = [];
    if (this["did"] == null) issues.push({ path: "did", message: "Required." });
    if (this["cids"] == null) issues.push({ path: "cids", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _ComAtprotoSyncGetBlocks.nsid,
      method: "GET",
      params: this.toParams(),
      raw: true,
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ComAtprotoSyncGetBlocks(value);
    record.check();
    return record;
  }
};
var ComAtprotoSyncGetCheckout = class _ComAtprotoSyncGetCheckout {
  static nsid = "com.atproto.sync.getCheckout";
  static def = "main";
  static kind = "query";
  static http = "GET";
  static errorNames = [];
  did;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({
      did: this["did"]
    });
  }
  check() {
    const issues = [];
    if (this["did"] == null) issues.push({ path: "did", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _ComAtprotoSyncGetCheckout.nsid,
      method: "GET",
      params: this.toParams(),
      raw: true,
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ComAtprotoSyncGetCheckout(value);
    record.check();
    return record;
  }
};
var ComAtprotoSyncGetHead = class _ComAtprotoSyncGetHead {
  static nsid = "com.atproto.sync.getHead";
  static def = "main";
  static kind = "query";
  static http = "GET";
  static errorNames = ["HeadNotFound"];
  did;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({
      did: this["did"]
    });
  }
  check() {
    const issues = [];
    if (this["did"] == null) issues.push({ path: "did", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _ComAtprotoSyncGetHead.nsid,
      method: "GET",
      params: this.toParams(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ComAtprotoSyncGetHead(value);
    record.check();
    return record;
  }
};
var ComAtprotoSyncGetHostStatus = class _ComAtprotoSyncGetHostStatus {
  static nsid = "com.atproto.sync.getHostStatus";
  static def = "main";
  static kind = "query";
  static http = "GET";
  static errorNames = ["HostNotFound"];
  hostname;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({
      hostname: this["hostname"]
    });
  }
  check() {
    const issues = [];
    if (this["hostname"] == null) issues.push({ path: "hostname", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _ComAtprotoSyncGetHostStatus.nsid,
      method: "GET",
      params: this.toParams(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ComAtprotoSyncGetHostStatus(value);
    record.check();
    return record;
  }
};
var ComAtprotoSyncGetLatestCommit = class _ComAtprotoSyncGetLatestCommit {
  static nsid = "com.atproto.sync.getLatestCommit";
  static def = "main";
  static kind = "query";
  static http = "GET";
  static errorNames = ["RepoNotFound", "RepoTakendown", "RepoSuspended", "RepoDeactivated"];
  did;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({
      did: this["did"]
    });
  }
  check() {
    const issues = [];
    if (this["did"] == null) issues.push({ path: "did", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _ComAtprotoSyncGetLatestCommit.nsid,
      method: "GET",
      params: this.toParams(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ComAtprotoSyncGetLatestCommit(value);
    record.check();
    return record;
  }
};
var ComAtprotoSyncGetRecord = class _ComAtprotoSyncGetRecord {
  static nsid = "com.atproto.sync.getRecord";
  static def = "main";
  static kind = "query";
  static http = "GET";
  static errorNames = ["RecordNotFound", "RepoNotFound", "RepoTakendown", "RepoSuspended", "RepoDeactivated"];
  did;
  collection;
  rkey;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({
      did: this["did"],
      collection: this["collection"],
      rkey: this["rkey"]
    });
  }
  check() {
    const issues = [];
    if (this["did"] == null) issues.push({ path: "did", message: "Required." });
    if (this["collection"] == null) issues.push({ path: "collection", message: "Required." });
    if (this["rkey"] == null) issues.push({ path: "rkey", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _ComAtprotoSyncGetRecord.nsid,
      method: "GET",
      params: this.toParams(),
      raw: true,
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ComAtprotoSyncGetRecord(value);
    record.check();
    return record;
  }
};
var ComAtprotoSyncGetRepo = class _ComAtprotoSyncGetRepo {
  static nsid = "com.atproto.sync.getRepo";
  static def = "main";
  static kind = "query";
  static http = "GET";
  static errorNames = ["RepoNotFound", "RepoTakendown", "RepoSuspended", "RepoDeactivated"];
  did;
  since;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({
      did: this["did"],
      since: this["since"]
    });
  }
  check() {
    const issues = [];
    if (this["did"] == null) issues.push({ path: "did", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _ComAtprotoSyncGetRepo.nsid,
      method: "GET",
      params: this.toParams(),
      raw: true,
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ComAtprotoSyncGetRepo(value);
    record.check();
    return record;
  }
};
var ComAtprotoSyncGetRepoStatus = class _ComAtprotoSyncGetRepoStatus {
  static nsid = "com.atproto.sync.getRepoStatus";
  static def = "main";
  static kind = "query";
  static http = "GET";
  static errorNames = ["RepoNotFound"];
  did;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({
      did: this["did"]
    });
  }
  check() {
    const issues = [];
    if (this["did"] == null) issues.push({ path: "did", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _ComAtprotoSyncGetRepoStatus.nsid,
      method: "GET",
      params: this.toParams(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ComAtprotoSyncGetRepoStatus(value);
    record.check();
    return record;
  }
};
var ComAtprotoSyncListBlobs = class _ComAtprotoSyncListBlobs {
  static nsid = "com.atproto.sync.listBlobs";
  static def = "main";
  static kind = "query";
  static http = "GET";
  static errorNames = ["RepoNotFound", "RepoTakendown", "RepoSuspended", "RepoDeactivated"];
  did;
  since;
  limit;
  cursor;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({
      did: this["did"],
      since: this["since"],
      limit: this["limit"],
      cursor: this["cursor"]
    });
  }
  check() {
    const issues = [];
    if (this["did"] == null) issues.push({ path: "did", message: "Required." });
    if (this["limit"] != null) {
      if (!Number.isInteger(this["limit"])) issues.push({ path: "limit", message: "Must be an integer." });
      else if (this["limit"] < 1) issues.push({ path: "limit", message: "Must be at least 1." });
      else if (this["limit"] > 1e3) issues.push({ path: "limit", message: "Must be at most 1000." });
    }
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _ComAtprotoSyncListBlobs.nsid,
      method: "GET",
      params: this.toParams(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ComAtprotoSyncListBlobs(value);
    record.check();
    return record;
  }
};
var ComAtprotoSyncListHosts = class _ComAtprotoSyncListHosts {
  static nsid = "com.atproto.sync.listHosts";
  static def = "main";
  static kind = "query";
  static http = "GET";
  static errorNames = [];
  limit;
  cursor;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({
      limit: this["limit"],
      cursor: this["cursor"]
    });
  }
  check() {
    const issues = [];
    if (this["limit"] != null) {
      if (!Number.isInteger(this["limit"])) issues.push({ path: "limit", message: "Must be an integer." });
      else if (this["limit"] < 1) issues.push({ path: "limit", message: "Must be at least 1." });
      else if (this["limit"] > 1e3) issues.push({ path: "limit", message: "Must be at most 1000." });
    }
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _ComAtprotoSyncListHosts.nsid,
      method: "GET",
      params: this.toParams(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ComAtprotoSyncListHosts(value);
    record.check();
    return record;
  }
};
var ComAtprotoSyncListHostsHost = class _ComAtprotoSyncListHostsHost {
  static nsid = "com.atproto.sync.listHosts";
  static def = "host";
  static kind = "object";
  $type;
  hostname;
  seq;
  accountCount;
  status;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "com.atproto.sync.listHosts#host";
  }
  check() {
    const issues = [];
    if (this["hostname"] == null) issues.push({ path: "hostname", message: "Required." });
    if (this["seq"] != null) {
      if (!Number.isInteger(this["seq"])) issues.push({ path: "seq", message: "Must be an integer." });
    }
    if (this["accountCount"] != null) {
      if (!Number.isInteger(this["accountCount"])) issues.push({ path: "accountCount", message: "Must be an integer." });
    }
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      hostname: this["hostname"],
      seq: this["seq"],
      accountCount: this["accountCount"],
      status: this["status"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ComAtprotoSyncListHostsHost(value);
    record.check();
    return record;
  }
};
var ComAtprotoSyncListRepos = class _ComAtprotoSyncListRepos {
  static nsid = "com.atproto.sync.listRepos";
  static def = "main";
  static kind = "query";
  static http = "GET";
  static errorNames = [];
  limit;
  cursor;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({
      limit: this["limit"],
      cursor: this["cursor"]
    });
  }
  check() {
    const issues = [];
    if (this["limit"] != null) {
      if (!Number.isInteger(this["limit"])) issues.push({ path: "limit", message: "Must be an integer." });
      else if (this["limit"] < 1) issues.push({ path: "limit", message: "Must be at least 1." });
      else if (this["limit"] > 1e3) issues.push({ path: "limit", message: "Must be at most 1000." });
    }
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _ComAtprotoSyncListRepos.nsid,
      method: "GET",
      params: this.toParams(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ComAtprotoSyncListRepos(value);
    record.check();
    return record;
  }
};
var ComAtprotoSyncListReposRepo = class _ComAtprotoSyncListReposRepo {
  static nsid = "com.atproto.sync.listRepos";
  static def = "repo";
  static kind = "object";
  $type;
  did;
  head;
  rev;
  active;
  status;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "com.atproto.sync.listRepos#repo";
  }
  check() {
    const issues = [];
    if (this["did"] == null) issues.push({ path: "did", message: "Required." });
    if (this["head"] == null) issues.push({ path: "head", message: "Required." });
    if (this["rev"] == null) issues.push({ path: "rev", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      did: this["did"],
      head: this["head"],
      rev: this["rev"],
      active: this["active"],
      status: this["status"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ComAtprotoSyncListReposRepo(value);
    record.check();
    return record;
  }
};
var ComAtprotoSyncListReposByCollection = class _ComAtprotoSyncListReposByCollection {
  static nsid = "com.atproto.sync.listReposByCollection";
  static def = "main";
  static kind = "query";
  static http = "GET";
  static errorNames = [];
  collection;
  limit;
  cursor;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({
      collection: this["collection"],
      limit: this["limit"],
      cursor: this["cursor"]
    });
  }
  check() {
    const issues = [];
    if (this["collection"] == null) issues.push({ path: "collection", message: "Required." });
    if (this["limit"] != null) {
      if (!Number.isInteger(this["limit"])) issues.push({ path: "limit", message: "Must be an integer." });
      else if (this["limit"] < 1) issues.push({ path: "limit", message: "Must be at least 1." });
      else if (this["limit"] > 2e3) issues.push({ path: "limit", message: "Must be at most 2000." });
    }
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _ComAtprotoSyncListReposByCollection.nsid,
      method: "GET",
      params: this.toParams(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ComAtprotoSyncListReposByCollection(value);
    record.check();
    return record;
  }
};
var ComAtprotoSyncListReposByCollectionRepo = class _ComAtprotoSyncListReposByCollectionRepo {
  static nsid = "com.atproto.sync.listReposByCollection";
  static def = "repo";
  static kind = "object";
  $type;
  did;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "com.atproto.sync.listReposByCollection#repo";
  }
  check() {
    const issues = [];
    if (this["did"] == null) issues.push({ path: "did", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      did: this["did"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ComAtprotoSyncListReposByCollectionRepo(value);
    record.check();
    return record;
  }
};
var ComAtprotoSyncNotifyOfUpdate = class _ComAtprotoSyncNotifyOfUpdate {
  static nsid = "com.atproto.sync.notifyOfUpdate";
  static def = "main";
  static kind = "procedure";
  static http = "POST";
  static errorNames = [];
  hostname;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({});
  }
  toBody() {
    return jsonOf({
      hostname: this["hostname"]
    });
  }
  check() {
    const issues = [];
    if (this["hostname"] == null) issues.push({ path: "hostname", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _ComAtprotoSyncNotifyOfUpdate.nsid,
      method: "POST",
      params: this.toParams(),
      body: this.toBody(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ComAtprotoSyncNotifyOfUpdate(value);
    record.check();
    return record;
  }
};
var ComAtprotoSyncRequestCrawl = class _ComAtprotoSyncRequestCrawl {
  static nsid = "com.atproto.sync.requestCrawl";
  static def = "main";
  static kind = "procedure";
  static http = "POST";
  static errorNames = ["HostBanned"];
  hostname;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({});
  }
  toBody() {
    return jsonOf({
      hostname: this["hostname"]
    });
  }
  check() {
    const issues = [];
    if (this["hostname"] == null) issues.push({ path: "hostname", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _ComAtprotoSyncRequestCrawl.nsid,
      method: "POST",
      params: this.toParams(),
      body: this.toBody(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ComAtprotoSyncRequestCrawl(value);
    record.check();
    return record;
  }
};
var ComAtprotoSyncSubscribeRepos = class _ComAtprotoSyncSubscribeRepos {
  static nsid = "com.atproto.sync.subscribeRepos";
  static def = "main";
  static kind = "subscription";
  static http = "WEBSOCKET";
  static errorNames = ["FutureCursor", "ConsumerTooSlow"];
  cursor;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({
      cursor: this["cursor"]
    });
  }
  check() {
    const issues = [];
    if (this["cursor"] != null) {
      if (!Number.isInteger(this["cursor"])) issues.push({ path: "cursor", message: "Must be an integer." });
    }
    if (issues.length) throw new ValidationError(issues);
  }
  async send(_client, _options = {}) {
    throw new ProtocolError("ComAtprotoSyncSubscribeRepos is a websocket subscription.");
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ComAtprotoSyncSubscribeRepos(value);
    record.check();
    return record;
  }
};
var ComAtprotoSyncSubscribeReposAccount = class _ComAtprotoSyncSubscribeReposAccount {
  static nsid = "com.atproto.sync.subscribeRepos";
  static def = "account";
  static kind = "object";
  $type;
  seq;
  did;
  time;
  active;
  status;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "com.atproto.sync.subscribeRepos#account";
  }
  check() {
    const issues = [];
    if (this["seq"] == null) issues.push({ path: "seq", message: "Required." });
    if (this["seq"] != null) {
      if (!Number.isInteger(this["seq"])) issues.push({ path: "seq", message: "Must be an integer." });
    }
    if (this["did"] == null) issues.push({ path: "did", message: "Required." });
    if (this["time"] == null) issues.push({ path: "time", message: "Required." });
    if (this["active"] == null) issues.push({ path: "active", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      seq: this["seq"],
      did: this["did"],
      time: this["time"],
      active: this["active"],
      status: this["status"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ComAtprotoSyncSubscribeReposAccount(value);
    record.check();
    return record;
  }
};
var ComAtprotoSyncSubscribeReposCommit = class _ComAtprotoSyncSubscribeReposCommit {
  static nsid = "com.atproto.sync.subscribeRepos";
  static def = "commit";
  static kind = "object";
  $type;
  seq;
  rebase;
  tooBig;
  repo;
  commit;
  rev;
  since;
  blocks;
  ops;
  blobs;
  prevData;
  time;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "com.atproto.sync.subscribeRepos#commit";
  }
  check() {
    const issues = [];
    if (this["seq"] == null) issues.push({ path: "seq", message: "Required." });
    if (this["seq"] != null) {
      if (!Number.isInteger(this["seq"])) issues.push({ path: "seq", message: "Must be an integer." });
    }
    if (this["rebase"] == null) issues.push({ path: "rebase", message: "Required." });
    if (this["tooBig"] == null) issues.push({ path: "tooBig", message: "Required." });
    if (this["repo"] == null) issues.push({ path: "repo", message: "Required." });
    if (this["commit"] == null) issues.push({ path: "commit", message: "Required." });
    if (this["rev"] == null) issues.push({ path: "rev", message: "Required." });
    if (this["since"] === void 0) issues.push({ path: "since", message: "Required." });
    if (this["blocks"] == null) issues.push({ path: "blocks", message: "Required." });
    if (this["ops"] == null) issues.push({ path: "ops", message: "Required." });
    if (this["blobs"] == null) issues.push({ path: "blobs", message: "Required." });
    if (this["time"] == null) issues.push({ path: "time", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      seq: this["seq"],
      rebase: this["rebase"],
      tooBig: this["tooBig"],
      repo: this["repo"],
      commit: this["commit"],
      rev: this["rev"],
      since: this["since"],
      blocks: this["blocks"],
      ops: this["ops"],
      blobs: this["blobs"],
      prevData: this["prevData"],
      time: this["time"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ComAtprotoSyncSubscribeReposCommit(value);
    record.check();
    return record;
  }
};
var ComAtprotoSyncSubscribeReposIdentity = class _ComAtprotoSyncSubscribeReposIdentity {
  static nsid = "com.atproto.sync.subscribeRepos";
  static def = "identity";
  static kind = "object";
  $type;
  seq;
  did;
  time;
  handle;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "com.atproto.sync.subscribeRepos#identity";
  }
  check() {
    const issues = [];
    if (this["seq"] == null) issues.push({ path: "seq", message: "Required." });
    if (this["seq"] != null) {
      if (!Number.isInteger(this["seq"])) issues.push({ path: "seq", message: "Must be an integer." });
    }
    if (this["did"] == null) issues.push({ path: "did", message: "Required." });
    if (this["time"] == null) issues.push({ path: "time", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      seq: this["seq"],
      did: this["did"],
      time: this["time"],
      handle: this["handle"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ComAtprotoSyncSubscribeReposIdentity(value);
    record.check();
    return record;
  }
};
var ComAtprotoSyncSubscribeReposInfo = class _ComAtprotoSyncSubscribeReposInfo {
  static nsid = "com.atproto.sync.subscribeRepos";
  static def = "info";
  static kind = "object";
  $type;
  name;
  message;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "com.atproto.sync.subscribeRepos#info";
  }
  check() {
    const issues = [];
    if (this["name"] == null) issues.push({ path: "name", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      name: this["name"],
      message: this["message"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ComAtprotoSyncSubscribeReposInfo(value);
    record.check();
    return record;
  }
};
var ComAtprotoSyncSubscribeReposRepoOp = class _ComAtprotoSyncSubscribeReposRepoOp {
  static nsid = "com.atproto.sync.subscribeRepos";
  static def = "repoOp";
  static kind = "object";
  $type;
  action;
  path;
  cid;
  prev;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "com.atproto.sync.subscribeRepos#repoOp";
  }
  check() {
    const issues = [];
    if (this["action"] == null) issues.push({ path: "action", message: "Required." });
    if (this["path"] == null) issues.push({ path: "path", message: "Required." });
    if (this["cid"] === void 0) issues.push({ path: "cid", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      action: this["action"],
      path: this["path"],
      cid: this["cid"],
      prev: this["prev"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ComAtprotoSyncSubscribeReposRepoOp(value);
    record.check();
    return record;
  }
};
var ComAtprotoSyncSubscribeReposSync = class _ComAtprotoSyncSubscribeReposSync {
  static nsid = "com.atproto.sync.subscribeRepos";
  static def = "sync";
  static kind = "object";
  $type;
  seq;
  did;
  blocks;
  rev;
  time;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "com.atproto.sync.subscribeRepos#sync";
  }
  check() {
    const issues = [];
    if (this["seq"] == null) issues.push({ path: "seq", message: "Required." });
    if (this["seq"] != null) {
      if (!Number.isInteger(this["seq"])) issues.push({ path: "seq", message: "Must be an integer." });
    }
    if (this["did"] == null) issues.push({ path: "did", message: "Required." });
    if (this["blocks"] == null) issues.push({ path: "blocks", message: "Required." });
    if (this["rev"] == null) issues.push({ path: "rev", message: "Required." });
    if (this["time"] == null) issues.push({ path: "time", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      seq: this["seq"],
      did: this["did"],
      blocks: this["blocks"],
      rev: this["rev"],
      time: this["time"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ComAtprotoSyncSubscribeReposSync(value);
    record.check();
    return record;
  }
};
var ComAtprotoTempAddReservedHandle = class _ComAtprotoTempAddReservedHandle {
  static nsid = "com.atproto.temp.addReservedHandle";
  static def = "main";
  static kind = "procedure";
  static http = "POST";
  static errorNames = [];
  handle;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({});
  }
  toBody() {
    return jsonOf({
      handle: this["handle"]
    });
  }
  check() {
    const issues = [];
    if (this["handle"] == null) issues.push({ path: "handle", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _ComAtprotoTempAddReservedHandle.nsid,
      method: "POST",
      params: this.toParams(),
      body: this.toBody(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ComAtprotoTempAddReservedHandle(value);
    record.check();
    return record;
  }
};
var ComAtprotoTempCheckHandleAvailability = class _ComAtprotoTempCheckHandleAvailability {
  static nsid = "com.atproto.temp.checkHandleAvailability";
  static def = "main";
  static kind = "query";
  static http = "GET";
  static errorNames = ["InvalidEmail"];
  handle;
  email;
  birthDate;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({
      handle: this["handle"],
      email: this["email"],
      birthDate: this["birthDate"]
    });
  }
  check() {
    const issues = [];
    if (this["handle"] == null) issues.push({ path: "handle", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _ComAtprotoTempCheckHandleAvailability.nsid,
      method: "GET",
      params: this.toParams(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ComAtprotoTempCheckHandleAvailability(value);
    record.check();
    return record;
  }
};
var ComAtprotoTempCheckHandleAvailabilityResultAvailable = class _ComAtprotoTempCheckHandleAvailabilityResultAvailable {
  static nsid = "com.atproto.temp.checkHandleAvailability";
  static def = "resultAvailable";
  static kind = "object";
  $type;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "com.atproto.temp.checkHandleAvailability#resultAvailable";
  }
  check() {
    const issues = [];
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ComAtprotoTempCheckHandleAvailabilityResultAvailable(value);
    record.check();
    return record;
  }
};
var ComAtprotoTempCheckHandleAvailabilityResultUnavailable = class _ComAtprotoTempCheckHandleAvailabilityResultUnavailable {
  static nsid = "com.atproto.temp.checkHandleAvailability";
  static def = "resultUnavailable";
  static kind = "object";
  $type;
  suggestions;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "com.atproto.temp.checkHandleAvailability#resultUnavailable";
  }
  check() {
    const issues = [];
    if (this["suggestions"] == null) issues.push({ path: "suggestions", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      suggestions: this["suggestions"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ComAtprotoTempCheckHandleAvailabilityResultUnavailable(value);
    record.check();
    return record;
  }
};
var ComAtprotoTempCheckHandleAvailabilitySuggestion = class _ComAtprotoTempCheckHandleAvailabilitySuggestion {
  static nsid = "com.atproto.temp.checkHandleAvailability";
  static def = "suggestion";
  static kind = "object";
  $type;
  handle;
  method;
  constructor(input = {}) {
    const source = { ...input };
    delete source.$type;
    Object.assign(this, source);
    this.$type = "com.atproto.temp.checkHandleAvailability#suggestion";
  }
  check() {
    const issues = [];
    if (this["handle"] == null) issues.push({ path: "handle", message: "Required." });
    if (this["method"] == null) issues.push({ path: "method", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  toJSON() {
    return jsonOf({
      $type: this.$type,
      handle: this["handle"],
      method: this["method"]
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ComAtprotoTempCheckHandleAvailabilitySuggestion(value);
    record.check();
    return record;
  }
};
var ComAtprotoTempCheckSignupQueue = class _ComAtprotoTempCheckSignupQueue {
  static nsid = "com.atproto.temp.checkSignupQueue";
  static def = "main";
  static kind = "query";
  static http = "GET";
  static errorNames = [];
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({});
  }
  check() {
    const issues = [];
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _ComAtprotoTempCheckSignupQueue.nsid,
      method: "GET",
      params: this.toParams(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ComAtprotoTempCheckSignupQueue(value);
    record.check();
    return record;
  }
};
var ComAtprotoTempDereferenceScope = class _ComAtprotoTempDereferenceScope {
  static nsid = "com.atproto.temp.dereferenceScope";
  static def = "main";
  static kind = "query";
  static http = "GET";
  static errorNames = ["InvalidScopeReference"];
  scope;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({
      scope: this["scope"]
    });
  }
  check() {
    const issues = [];
    if (this["scope"] == null) issues.push({ path: "scope", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _ComAtprotoTempDereferenceScope.nsid,
      method: "GET",
      params: this.toParams(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ComAtprotoTempDereferenceScope(value);
    record.check();
    return record;
  }
};
var ComAtprotoTempFetchLabels = class _ComAtprotoTempFetchLabels {
  static nsid = "com.atproto.temp.fetchLabels";
  static def = "main";
  static kind = "query";
  static http = "GET";
  static errorNames = [];
  since;
  limit;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({
      since: this["since"],
      limit: this["limit"]
    });
  }
  check() {
    const issues = [];
    if (this["since"] != null) {
      if (!Number.isInteger(this["since"])) issues.push({ path: "since", message: "Must be an integer." });
    }
    if (this["limit"] != null) {
      if (!Number.isInteger(this["limit"])) issues.push({ path: "limit", message: "Must be an integer." });
      else if (this["limit"] < 1) issues.push({ path: "limit", message: "Must be at least 1." });
      else if (this["limit"] > 250) issues.push({ path: "limit", message: "Must be at most 250." });
    }
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _ComAtprotoTempFetchLabels.nsid,
      method: "GET",
      params: this.toParams(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ComAtprotoTempFetchLabels(value);
    record.check();
    return record;
  }
};
var ComAtprotoTempRequestPhoneVerification = class _ComAtprotoTempRequestPhoneVerification {
  static nsid = "com.atproto.temp.requestPhoneVerification";
  static def = "main";
  static kind = "procedure";
  static http = "POST";
  static errorNames = [];
  phoneNumber;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({});
  }
  toBody() {
    return jsonOf({
      phoneNumber: this["phoneNumber"]
    });
  }
  check() {
    const issues = [];
    if (this["phoneNumber"] == null) issues.push({ path: "phoneNumber", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _ComAtprotoTempRequestPhoneVerification.nsid,
      method: "POST",
      params: this.toParams(),
      body: this.toBody(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ComAtprotoTempRequestPhoneVerification(value);
    record.check();
    return record;
  }
};
var ComAtprotoTempRevokeAccountCredentials = class _ComAtprotoTempRevokeAccountCredentials {
  static nsid = "com.atproto.temp.revokeAccountCredentials";
  static def = "main";
  static kind = "procedure";
  static http = "POST";
  static errorNames = [];
  account;
  constructor(input = {}) {
    Object.assign(this, input);
  }
  toParams() {
    return jsonOf({});
  }
  toBody() {
    return jsonOf({
      account: this["account"]
    });
  }
  check() {
    const issues = [];
    if (this["account"] == null) issues.push({ path: "account", message: "Required." });
    if (issues.length) throw new ValidationError(issues);
  }
  async send(client, options = {}) {
    this.check();
    return client.request({
      nsid: _ComAtprotoTempRevokeAccountCredentials.nsid,
      method: "POST",
      params: this.toParams(),
      body: this.toBody(),
      headers: options.headers,
      signal: options.signal
    });
  }
  static from(value) {
    if (value == null || typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError([{ path: "", message: "Expected an object." }]);
    }
    const record = new _ComAtprotoTempRevokeAccountCredentials(value);
    record.check();
    return record;
  }
};
var lex = {
  app: {
    bsky: {
      actor: {
        contentVisibilityDeclaration: AppBskyActorContentVisibilityDeclaration,
        defs: { adultContentPref: AppBskyActorDefsAdultContentPref, bskyAppProgressGuide: AppBskyActorDefsBskyAppProgressGuide, bskyAppStatePref: AppBskyActorDefsBskyAppStatePref, contentLabelPref: AppBskyActorDefsContentLabelPref, declaredAgePref: AppBskyActorDefsDeclaredAgePref, feedViewPref: AppBskyActorDefsFeedViewPref, hiddenPostsPref: AppBskyActorDefsHiddenPostsPref, interestsPref: AppBskyActorDefsInterestsPref, knownFollowers: AppBskyActorDefsKnownFollowers, labelerPrefItem: AppBskyActorDefsLabelerPrefItem, labelersPref: AppBskyActorDefsLabelersPref, liveEventPreferences: AppBskyActorDefsLiveEventPreferences, mutedWord: AppBskyActorDefsMutedWord, mutedWordsPref: AppBskyActorDefsMutedWordsPref, mutedWordTarget: AppBskyActorDefsMutedWordTarget, nux: AppBskyActorDefsNux, personalDetailsPref: AppBskyActorDefsPersonalDetailsPref, postInteractionSettingsPref: AppBskyActorDefsPostInteractionSettingsPref, preferences: AppBskyActorDefsPreferences, profileAssociated: AppBskyActorDefsProfileAssociated, profileAssociatedActivitySubscription: AppBskyActorDefsProfileAssociatedActivitySubscription, profileAssociatedChat: AppBskyActorDefsProfileAssociatedChat, profileAssociatedGerm: AppBskyActorDefsProfileAssociatedGerm, profileLinkView: AppBskyActorDefsProfileLinkView, profileView: AppBskyActorDefsProfileView, profileViewBasic: AppBskyActorDefsProfileViewBasic, profileViewDetailed: AppBskyActorDefsProfileViewDetailed, savedFeed: AppBskyActorDefsSavedFeed, savedFeedsPref: AppBskyActorDefsSavedFeedsPref, savedFeedsPrefV2: AppBskyActorDefsSavedFeedsPrefV2, statusView: AppBskyActorDefsStatusView, threadViewPref: AppBskyActorDefsThreadViewPref, verificationPrefs: AppBskyActorDefsVerificationPrefs, verificationState: AppBskyActorDefsVerificationState, verificationView: AppBskyActorDefsVerificationView, viewerState: AppBskyActorDefsViewerState },
        getPreferences: AppBskyActorGetPreferences,
        getProfile: AppBskyActorGetProfile,
        getProfiles: AppBskyActorGetProfiles,
        getSuggestions: AppBskyActorGetSuggestions,
        link: AppBskyActorLink,
        profile: AppBskyActorProfile,
        putPreferences: AppBskyActorPutPreferences,
        searchActors: AppBskyActorSearchActors,
        searchActorsTypeahead: AppBskyActorSearchActorsTypeahead,
        status: Object.assign(AppBskyActorStatus, { live: AppBskyActorStatusLive })
      },
      ageassurance: {
        begin: AppBskyAgeassuranceBegin,
        defs: { access: AppBskyAgeassuranceDefsAccess, config: AppBskyAgeassuranceDefsConfig, configRegion: AppBskyAgeassuranceDefsConfigRegion, configRegionRuleDefault: AppBskyAgeassuranceDefsConfigRegionRuleDefault, configRegionRuleIfAccountNewerThan: AppBskyAgeassuranceDefsConfigRegionRuleIfAccountNewerThan, configRegionRuleIfAccountOlderThan: AppBskyAgeassuranceDefsConfigRegionRuleIfAccountOlderThan, configRegionRuleIfAssuredOverAge: AppBskyAgeassuranceDefsConfigRegionRuleIfAssuredOverAge, configRegionRuleIfAssuredUnderAge: AppBskyAgeassuranceDefsConfigRegionRuleIfAssuredUnderAge, configRegionRuleIfDeclaredOverAge: AppBskyAgeassuranceDefsConfigRegionRuleIfDeclaredOverAge, configRegionRuleIfDeclaredUnderAge: AppBskyAgeassuranceDefsConfigRegionRuleIfDeclaredUnderAge, event: AppBskyAgeassuranceDefsEvent, state: AppBskyAgeassuranceDefsState, stateMetadata: AppBskyAgeassuranceDefsStateMetadata, status: AppBskyAgeassuranceDefsStatus },
        getConfig: AppBskyAgeassuranceGetConfig,
        getState: AppBskyAgeassuranceGetState
      },
      authCreatePosts: AppBskyAuthCreatePosts,
      authDeleteContent: AppBskyAuthDeleteContent,
      authManageFeedDeclarations: AppBskyAuthManageFeedDeclarations,
      authManageLabelerService: AppBskyAuthManageLabelerService,
      authManageModeration: AppBskyAuthManageModeration,
      authManageNotifications: AppBskyAuthManageNotifications,
      authManageProfile: AppBskyAuthManageProfile,
      authViewAll: AppBskyAuthViewAll,
      bookmark: {
        createBookmark: AppBskyBookmarkCreateBookmark,
        defs: { bookmark: AppBskyBookmarkDefsBookmark, bookmarkView: AppBskyBookmarkDefsBookmarkView },
        deleteBookmark: AppBskyBookmarkDeleteBookmark,
        getBookmarks: AppBskyBookmarkGetBookmarks
      },
      contact: {
        defs: { matchAndContactIndex: AppBskyContactDefsMatchAndContactIndex, notification: AppBskyContactDefsNotification, syncStatus: AppBskyContactDefsSyncStatus },
        dismissMatch: AppBskyContactDismissMatch,
        getMatches: AppBskyContactGetMatches,
        getSyncStatus: AppBskyContactGetSyncStatus,
        importContacts: AppBskyContactImportContacts,
        removeData: AppBskyContactRemoveData,
        sendNotification: AppBskyContactSendNotification,
        startPhoneVerification: AppBskyContactStartPhoneVerification,
        verifyPhone: AppBskyContactVerifyPhone
      },
      draft: {
        createDraft: AppBskyDraftCreateDraft,
        defs: { draft: AppBskyDraftDefsDraft, draftEmbedCaption: AppBskyDraftDefsDraftEmbedCaption, draftEmbedExternal: AppBskyDraftDefsDraftEmbedExternal, draftEmbedGallery: AppBskyDraftDefsDraftEmbedGallery, draftEmbedGalleryItems: AppBskyDraftDefsDraftEmbedGalleryItems, draftEmbedImage: AppBskyDraftDefsDraftEmbedImage, draftEmbedLocalRef: AppBskyDraftDefsDraftEmbedLocalRef, draftEmbedRecord: AppBskyDraftDefsDraftEmbedRecord, draftEmbedVideo: AppBskyDraftDefsDraftEmbedVideo, draftPost: AppBskyDraftDefsDraftPost, draftView: AppBskyDraftDefsDraftView, draftWithId: AppBskyDraftDefsDraftWithId },
        deleteDraft: AppBskyDraftDeleteDraft,
        getDrafts: AppBskyDraftGetDrafts,
        updateDraft: AppBskyDraftUpdateDraft
      },
      embed: {
        defs: { aspectRatio: AppBskyEmbedDefsAspectRatio },
        external: Object.assign(AppBskyEmbedExternal, { colorRGB: AppBskyEmbedExternalColorRGB, external: AppBskyEmbedExternalExternal, view: AppBskyEmbedExternalView, viewArticle: AppBskyEmbedExternalViewArticle, viewArticlePublication: AppBskyEmbedExternalViewArticlePublication, viewArticlePublicationTheme: AppBskyEmbedExternalViewArticlePublicationTheme, viewExternal: AppBskyEmbedExternalViewExternal, viewExternalSource: AppBskyEmbedExternalViewExternalSource, viewExternalSourceTheme: AppBskyEmbedExternalViewExternalSourceTheme, viewGallery: AppBskyEmbedExternalViewGallery, viewGalleryImage: AppBskyEmbedExternalViewGalleryImage, viewLivestream: AppBskyEmbedExternalViewLivestream }),
        gallery: Object.assign(AppBskyEmbedGallery, { image: AppBskyEmbedGalleryImage, view: AppBskyEmbedGalleryView, viewImage: AppBskyEmbedGalleryViewImage }),
        getEmbedExternalView: AppBskyEmbedGetEmbedExternalView,
        images: Object.assign(AppBskyEmbedImages, { image: AppBskyEmbedImagesImage, view: AppBskyEmbedImagesView, viewImage: AppBskyEmbedImagesViewImage }),
        record: Object.assign(AppBskyEmbedRecord, { view: AppBskyEmbedRecordView, viewBlocked: AppBskyEmbedRecordViewBlocked, viewDetached: AppBskyEmbedRecordViewDetached, viewNotFound: AppBskyEmbedRecordViewNotFound, viewRecord: AppBskyEmbedRecordViewRecord }),
        recordWithMedia: Object.assign(AppBskyEmbedRecordWithMedia, { view: AppBskyEmbedRecordWithMediaView }),
        video: Object.assign(AppBskyEmbedVideo, { caption: AppBskyEmbedVideoCaption, view: AppBskyEmbedVideoView })
      },
      feed: {
        defs: { blockedAuthor: AppBskyFeedDefsBlockedAuthor, blockedPost: AppBskyFeedDefsBlockedPost, clickthroughAuthor: AppBskyFeedDefsClickthroughAuthor, clickthroughEmbed: AppBskyFeedDefsClickthroughEmbed, clickthroughItem: AppBskyFeedDefsClickthroughItem, clickthroughReposter: AppBskyFeedDefsClickthroughReposter, contentModeUnspecified: AppBskyFeedDefsContentModeUnspecified, contentModeVideo: AppBskyFeedDefsContentModeVideo, feedViewPost: AppBskyFeedDefsFeedViewPost, generatorView: AppBskyFeedDefsGeneratorView, generatorViewerState: AppBskyFeedDefsGeneratorViewerState, interaction: AppBskyFeedDefsInteraction, interactionLike: AppBskyFeedDefsInteractionLike, interactionQuote: AppBskyFeedDefsInteractionQuote, interactionReply: AppBskyFeedDefsInteractionReply, interactionRepost: AppBskyFeedDefsInteractionRepost, interactionSeen: AppBskyFeedDefsInteractionSeen, interactionShare: AppBskyFeedDefsInteractionShare, knownLikers: AppBskyFeedDefsKnownLikers, notFoundPost: AppBskyFeedDefsNotFoundPost, postView: AppBskyFeedDefsPostView, reasonPin: AppBskyFeedDefsReasonPin, reasonRepost: AppBskyFeedDefsReasonRepost, replyRef: AppBskyFeedDefsReplyRef, requestLess: AppBskyFeedDefsRequestLess, requestMore: AppBskyFeedDefsRequestMore, skeletonFeedPost: AppBskyFeedDefsSkeletonFeedPost, skeletonReasonPin: AppBskyFeedDefsSkeletonReasonPin, skeletonReasonRepost: AppBskyFeedDefsSkeletonReasonRepost, threadContext: AppBskyFeedDefsThreadContext, threadgateView: AppBskyFeedDefsThreadgateView, threadViewPost: AppBskyFeedDefsThreadViewPost, viewerState: AppBskyFeedDefsViewerState },
        describeFeedGenerator: Object.assign(AppBskyFeedDescribeFeedGenerator, { feed: AppBskyFeedDescribeFeedGeneratorFeed, links: AppBskyFeedDescribeFeedGeneratorLinks }),
        generator: AppBskyFeedGenerator,
        getActorFeeds: AppBskyFeedGetActorFeeds,
        getActorLikes: AppBskyFeedGetActorLikes,
        getAuthorFeed: AppBskyFeedGetAuthorFeed,
        getFeed: AppBskyFeedGetFeed,
        getFeedGenerator: AppBskyFeedGetFeedGenerator,
        getFeedGenerators: AppBskyFeedGetFeedGenerators,
        getFeedSkeleton: AppBskyFeedGetFeedSkeleton,
        getLikes: Object.assign(AppBskyFeedGetLikes, { like: AppBskyFeedGetLikesLike }),
        getListFeed: AppBskyFeedGetListFeed,
        getPostThread: AppBskyFeedGetPostThread,
        getPosts: AppBskyFeedGetPosts,
        getQuotes: AppBskyFeedGetQuotes,
        getRepostedBy: AppBskyFeedGetRepostedBy,
        getSuggestedFeeds: AppBskyFeedGetSuggestedFeeds,
        getTimeline: AppBskyFeedGetTimeline,
        like: AppBskyFeedLike,
        post: Object.assign(AppBskyFeedPost, { entity: AppBskyFeedPostEntity, replyRef: AppBskyFeedPostReplyRef, textSlice: AppBskyFeedPostTextSlice }),
        postgate: Object.assign(AppBskyFeedPostgate, { disableRule: AppBskyFeedPostgateDisableRule }),
        repost: AppBskyFeedRepost,
        searchPosts: AppBskyFeedSearchPosts,
        searchPostsV2: AppBskyFeedSearchPostsV2,
        sendInteractions: AppBskyFeedSendInteractions,
        threadgate: Object.assign(AppBskyFeedThreadgate, { followerRule: AppBskyFeedThreadgateFollowerRule, followingRule: AppBskyFeedThreadgateFollowingRule, listRule: AppBskyFeedThreadgateListRule, mentionRule: AppBskyFeedThreadgateMentionRule })
      },
      graph: {
        block: AppBskyGraphBlock,
        defs: { curatelist: AppBskyGraphDefsCuratelist, listItemView: AppBskyGraphDefsListItemView, listPurpose: AppBskyGraphDefsListPurpose, listView: AppBskyGraphDefsListView, listViewBasic: AppBskyGraphDefsListViewBasic, listViewerState: AppBskyGraphDefsListViewerState, modlist: AppBskyGraphDefsModlist, notFoundActor: AppBskyGraphDefsNotFoundActor, referencelist: AppBskyGraphDefsReferencelist, relationship: AppBskyGraphDefsRelationship, starterPackView: AppBskyGraphDefsStarterPackView, starterPackViewBasic: AppBskyGraphDefsStarterPackViewBasic },
        follow: AppBskyGraphFollow,
        getActorStarterPacks: AppBskyGraphGetActorStarterPacks,
        getBlocks: AppBskyGraphGetBlocks,
        getKnownFollowers: AppBskyGraphGetKnownFollowers,
        getList: AppBskyGraphGetList,
        getListBlocks: AppBskyGraphGetListBlocks,
        getListMutes: AppBskyGraphGetListMutes,
        getLists: AppBskyGraphGetLists,
        getListsWithMembership: Object.assign(AppBskyGraphGetListsWithMembership, { listWithMembership: AppBskyGraphGetListsWithMembershipListWithMembership }),
        getMutes: AppBskyGraphGetMutes,
        getRelationships: AppBskyGraphGetRelationships,
        getStarterPack: AppBskyGraphGetStarterPack,
        getStarterPacks: AppBskyGraphGetStarterPacks,
        getStarterPacksWithMembership: Object.assign(AppBskyGraphGetStarterPacksWithMembership, { starterPackWithMembership: AppBskyGraphGetStarterPacksWithMembershipStarterPackWithMembership }),
        getSuggestedFollowsByActor: AppBskyGraphGetSuggestedFollowsByActor,
        list: AppBskyGraphList,
        listblock: AppBskyGraphListblock,
        listitem: AppBskyGraphListitem,
        muteActor: AppBskyGraphMuteActor,
        muteActorList: AppBskyGraphMuteActorList,
        muteThread: AppBskyGraphMuteThread,
        referencelistoptout: AppBskyGraphReferencelistoptout,
        searchStarterPacks: AppBskyGraphSearchStarterPacks,
        searchStarterPacksV2: AppBskyGraphSearchStarterPacksV2,
        starterpack: Object.assign(AppBskyGraphStarterpack, { feedItem: AppBskyGraphStarterpackFeedItem }),
        unmuteActor: AppBskyGraphUnmuteActor,
        unmuteActorList: AppBskyGraphUnmuteActorList,
        unmuteThread: AppBskyGraphUnmuteThread,
        verification: AppBskyGraphVerification
      },
      labeler: {
        defs: { labelerPolicies: AppBskyLabelerDefsLabelerPolicies, labelerView: AppBskyLabelerDefsLabelerView, labelerViewDetailed: AppBskyLabelerDefsLabelerViewDetailed, labelerViewerState: AppBskyLabelerDefsLabelerViewerState },
        getServices: AppBskyLabelerGetServices,
        service: AppBskyLabelerService
      },
      notification: {
        declaration: AppBskyNotificationDeclaration,
        defs: { activitySubscription: AppBskyNotificationDefsActivitySubscription, chatPreference: AppBskyNotificationDefsChatPreference, filterablePreference: AppBskyNotificationDefsFilterablePreference, preference: AppBskyNotificationDefsPreference, preferences: AppBskyNotificationDefsPreferences, recordDeleted: AppBskyNotificationDefsRecordDeleted, subjectActivitySubscription: AppBskyNotificationDefsSubjectActivitySubscription },
        getGroupedNotifications: Object.assign(AppBskyNotificationGetGroupedNotifications, { contactMatchNotification: AppBskyNotificationGetGroupedNotificationsContactMatchNotification, followBackNotification: AppBskyNotificationGetGroupedNotificationsFollowBackNotification, followGroup: AppBskyNotificationGetGroupedNotificationsFollowGroup, followItem: AppBskyNotificationGetGroupedNotificationsFollowItem, generatorLikeGroup: AppBskyNotificationGetGroupedNotificationsGeneratorLikeGroup, generatorLikeItem: AppBskyNotificationGetGroupedNotificationsGeneratorLikeItem, group: AppBskyNotificationGetGroupedNotificationsGroup, likeGroup: AppBskyNotificationGetGroupedNotificationsLikeGroup, likeItem: AppBskyNotificationGetGroupedNotificationsLikeItem, likeViaRepostGroup: AppBskyNotificationGetGroupedNotificationsLikeViaRepostGroup, likeViaRepostItem: AppBskyNotificationGetGroupedNotificationsLikeViaRepostItem, mentionNotification: AppBskyNotificationGetGroupedNotificationsMentionNotification, multiPostLikeGroup: AppBskyNotificationGetGroupedNotificationsMultiPostLikeGroup, multiPostLikeItem: AppBskyNotificationGetGroupedNotificationsMultiPostLikeItem, multiPostLikeViaRepostGroup: AppBskyNotificationGetGroupedNotificationsMultiPostLikeViaRepostGroup, multiPostLikeViaRepostItem: AppBskyNotificationGetGroupedNotificationsMultiPostLikeViaRepostItem, multiPostRepostGroup: AppBskyNotificationGetGroupedNotificationsMultiPostRepostGroup, multiPostRepostItem: AppBskyNotificationGetGroupedNotificationsMultiPostRepostItem, multiPostRepostViaRepostGroup: AppBskyNotificationGetGroupedNotificationsMultiPostRepostViaRepostGroup, multiPostRepostViaRepostItem: AppBskyNotificationGetGroupedNotificationsMultiPostRepostViaRepostItem, quoteNotification: AppBskyNotificationGetGroupedNotificationsQuoteNotification, replyNotification: AppBskyNotificationGetGroupedNotificationsReplyNotification, repostGroup: AppBskyNotificationGetGroupedNotificationsRepostGroup, repostItem: AppBskyNotificationGetGroupedNotificationsRepostItem, repostViaRepostGroup: AppBskyNotificationGetGroupedNotificationsRepostViaRepostGroup, repostViaRepostItem: AppBskyNotificationGetGroupedNotificationsRepostViaRepostItem, starterPackJoinedNotification: AppBskyNotificationGetGroupedNotificationsStarterPackJoinedNotification, subscribedPostGroup: AppBskyNotificationGetGroupedNotificationsSubscribedPostGroup, subscribedPostItem: AppBskyNotificationGetGroupedNotificationsSubscribedPostItem, unverifiedNotification: AppBskyNotificationGetGroupedNotificationsUnverifiedNotification, verifiedNotification: AppBskyNotificationGetGroupedNotificationsVerifiedNotification }),
        getPreferences: AppBskyNotificationGetPreferences,
        getUnreadCount: AppBskyNotificationGetUnreadCount,
        listActivitySubscriptions: AppBskyNotificationListActivitySubscriptions,
        listNotifications: Object.assign(AppBskyNotificationListNotifications, { notification: AppBskyNotificationListNotificationsNotification }),
        putActivitySubscription: AppBskyNotificationPutActivitySubscription,
        putPreferences: AppBskyNotificationPutPreferences,
        putPreferencesV2: AppBskyNotificationPutPreferencesV2,
        registerPush: AppBskyNotificationRegisterPush,
        unregisterPush: AppBskyNotificationUnregisterPush,
        updateSeen: AppBskyNotificationUpdateSeen
      },
      richtext: {
        facet: Object.assign(AppBskyRichtextFacet, { byteSlice: AppBskyRichtextFacetByteSlice, link: AppBskyRichtextFacetLink, mention: AppBskyRichtextFacetMention, tag: AppBskyRichtextFacetTag })
      },
      unspecced: {
        defs: { ageAssuranceEvent: AppBskyUnspeccedDefsAgeAssuranceEvent, ageAssuranceState: AppBskyUnspeccedDefsAgeAssuranceState, skeletonSearchActor: AppBskyUnspeccedDefsSkeletonSearchActor, skeletonSearchPost: AppBskyUnspeccedDefsSkeletonSearchPost, skeletonSearchStarterPack: AppBskyUnspeccedDefsSkeletonSearchStarterPack, skeletonTrend: AppBskyUnspeccedDefsSkeletonTrend, threadItemBlocked: AppBskyUnspeccedDefsThreadItemBlocked, threadItemNotFound: AppBskyUnspeccedDefsThreadItemNotFound, threadItemNoUnauthenticated: AppBskyUnspeccedDefsThreadItemNoUnauthenticated, threadItemPost: AppBskyUnspeccedDefsThreadItemPost, trendingTopic: AppBskyUnspeccedDefsTrendingTopic, trendView: AppBskyUnspeccedDefsTrendView },
        getAgeAssuranceState: AppBskyUnspeccedGetAgeAssuranceState,
        getAtmosphereExploreArticleRecommendations: Object.assign(AppBskyUnspeccedGetAtmosphereExploreArticleRecommendations, { article: AppBskyUnspeccedGetAtmosphereExploreArticleRecommendationsArticle }),
        getConfig: Object.assign(AppBskyUnspeccedGetConfig, { liveNowConfig: AppBskyUnspeccedGetConfigLiveNowConfig }),
        getOnboardingSuggestedUsersSkeleton: AppBskyUnspeccedGetOnboardingSuggestedUsersSkeleton,
        getPopularFeedGenerators: AppBskyUnspeccedGetPopularFeedGenerators,
        getPostThreadOtherV2: Object.assign(AppBskyUnspeccedGetPostThreadOtherV2, { threadItem: AppBskyUnspeccedGetPostThreadOtherV2ThreadItem }),
        getPostThreadV2: Object.assign(AppBskyUnspeccedGetPostThreadV2, { threadItem: AppBskyUnspeccedGetPostThreadV2ThreadItem }),
        getSuggestedOnboardingUsers: AppBskyUnspeccedGetSuggestedOnboardingUsers,
        getSuggestedUsers: AppBskyUnspeccedGetSuggestedUsers,
        getSuggestedUsersForDiscover: AppBskyUnspeccedGetSuggestedUsersForDiscover,
        getSuggestedUsersForDiscoverSkeleton: AppBskyUnspeccedGetSuggestedUsersForDiscoverSkeleton,
        getSuggestedUsersForExplore: AppBskyUnspeccedGetSuggestedUsersForExplore,
        getSuggestedUsersForExploreSkeleton: AppBskyUnspeccedGetSuggestedUsersForExploreSkeleton,
        getSuggestedUsersForSeeMore: AppBskyUnspeccedGetSuggestedUsersForSeeMore,
        getSuggestedUsersForSeeMoreSkeleton: AppBskyUnspeccedGetSuggestedUsersForSeeMoreSkeleton,
        getSuggestedUsersSkeleton: AppBskyUnspeccedGetSuggestedUsersSkeleton,
        getSuggestionsSkeleton: AppBskyUnspeccedGetSuggestionsSkeleton,
        getTaggedSuggestions: Object.assign(AppBskyUnspeccedGetTaggedSuggestions, { suggestion: AppBskyUnspeccedGetTaggedSuggestionsSuggestion }),
        getTrendingTopics: AppBskyUnspeccedGetTrendingTopics,
        getTrends: AppBskyUnspeccedGetTrends,
        getTrendsSkeleton: AppBskyUnspeccedGetTrendsSkeleton,
        initAgeAssurance: AppBskyUnspeccedInitAgeAssurance,
        searchActorsSkeleton: AppBskyUnspeccedSearchActorsSkeleton,
        searchPostsSkeleton: AppBskyUnspeccedSearchPostsSkeleton,
        searchStarterPacksSkeleton: AppBskyUnspeccedSearchStarterPacksSkeleton
      },
      video: {
        abortUpload: AppBskyVideoAbortUpload,
        defs: { jobStatus: AppBskyVideoDefsJobStatus },
        finishUpload: AppBskyVideoFinishUpload,
        getJobStatus: AppBskyVideoGetJobStatus,
        getUploadLimits: AppBskyVideoGetUploadLimits,
        getUploadStatus: AppBskyVideoGetUploadStatus,
        startUpload: AppBskyVideoStartUpload,
        uploadPart: AppBskyVideoUploadPart,
        uploadVideo: AppBskyVideoUploadVideo
      }
    }
  },
  chat: {
    bsky: {
      actor: {
        declaration: ChatBskyActorDeclaration,
        defs: { directConvoMember: ChatBskyActorDefsDirectConvoMember, groupConvoMember: ChatBskyActorDefsGroupConvoMember, memberRole: ChatBskyActorDefsMemberRole, pastGroupConvoMember: ChatBskyActorDefsPastGroupConvoMember, profileViewBasic: ChatBskyActorDefsProfileViewBasic },
        deleteAccount: ChatBskyActorDeleteAccount,
        exportAccountData: ChatBskyActorExportAccountData,
        getStatus: ChatBskyActorGetStatus
      },
      convo: {
        acceptConvo: ChatBskyConvoAcceptConvo,
        addReaction: ChatBskyConvoAddReaction,
        defs: { convoKind: ChatBskyConvoDefsConvoKind, convoLockStatus: ChatBskyConvoDefsConvoLockStatus, convoRef: ChatBskyConvoDefsConvoRef, convoStatus: ChatBskyConvoDefsConvoStatus, convoView: ChatBskyConvoDefsConvoView, deletedMessageView: ChatBskyConvoDefsDeletedMessageView, directConvo: ChatBskyConvoDefsDirectConvo, groupConvo: ChatBskyConvoDefsGroupConvo, logAcceptConvo: ChatBskyConvoDefsLogAcceptConvo, logAddMember: ChatBskyConvoDefsLogAddMember, logAddReaction: ChatBskyConvoDefsLogAddReaction, logApproveJoinRequest: ChatBskyConvoDefsLogApproveJoinRequest, logBeginConvo: ChatBskyConvoDefsLogBeginConvo, logCreateJoinLink: ChatBskyConvoDefsLogCreateJoinLink, logCreateMessage: ChatBskyConvoDefsLogCreateMessage, logDeleteMessage: ChatBskyConvoDefsLogDeleteMessage, logDisableJoinLink: ChatBskyConvoDefsLogDisableJoinLink, logEditGroup: ChatBskyConvoDefsLogEditGroup, logEditJoinLink: ChatBskyConvoDefsLogEditJoinLink, logEnableJoinLink: ChatBskyConvoDefsLogEnableJoinLink, logIncomingJoinRequest: ChatBskyConvoDefsLogIncomingJoinRequest, logLeaveConvo: ChatBskyConvoDefsLogLeaveConvo, logLockConvo: ChatBskyConvoDefsLogLockConvo, logLockConvoPermanently: ChatBskyConvoDefsLogLockConvoPermanently, logMemberJoin: ChatBskyConvoDefsLogMemberJoin, logMemberLeave: ChatBskyConvoDefsLogMemberLeave, logMuteConvo: ChatBskyConvoDefsLogMuteConvo, logOutgoingJoinRequest: ChatBskyConvoDefsLogOutgoingJoinRequest, logReadConvo: ChatBskyConvoDefsLogReadConvo, logReadJoinRequests: ChatBskyConvoDefsLogReadJoinRequests, logReadMessage: ChatBskyConvoDefsLogReadMessage, logRejectJoinRequest: ChatBskyConvoDefsLogRejectJoinRequest, logRemoveMember: ChatBskyConvoDefsLogRemoveMember, logRemoveReaction: ChatBskyConvoDefsLogRemoveReaction, logUnlockConvo: ChatBskyConvoDefsLogUnlockConvo, logUnmuteConvo: ChatBskyConvoDefsLogUnmuteConvo, logWithdrawIncomingJoinRequest: ChatBskyConvoDefsLogWithdrawIncomingJoinRequest, logWithdrawOutgoingJoinRequest: ChatBskyConvoDefsLogWithdrawOutgoingJoinRequest, messageAndReactionView: ChatBskyConvoDefsMessageAndReactionView, messageBeforeUserJoinedGroupView: ChatBskyConvoDefsMessageBeforeUserJoinedGroupView, messageInput: ChatBskyConvoDefsMessageInput, messageRef: ChatBskyConvoDefsMessageRef, messageView: ChatBskyConvoDefsMessageView, messageViewSender: ChatBskyConvoDefsMessageViewSender, reactionView: ChatBskyConvoDefsReactionView, reactionViewSender: ChatBskyConvoDefsReactionViewSender, replyRef: ChatBskyConvoDefsReplyRef, systemMessageDataAddMember: ChatBskyConvoDefsSystemMessageDataAddMember, systemMessageDataCreateJoinLink: ChatBskyConvoDefsSystemMessageDataCreateJoinLink, systemMessageDataDisableJoinLink: ChatBskyConvoDefsSystemMessageDataDisableJoinLink, systemMessageDataEditGroup: ChatBskyConvoDefsSystemMessageDataEditGroup, systemMessageDataEditJoinLink: ChatBskyConvoDefsSystemMessageDataEditJoinLink, systemMessageDataEnableJoinLink: ChatBskyConvoDefsSystemMessageDataEnableJoinLink, systemMessageDataLockConvo: ChatBskyConvoDefsSystemMessageDataLockConvo, systemMessageDataLockConvoPermanently: ChatBskyConvoDefsSystemMessageDataLockConvoPermanently, systemMessageDataMemberJoin: ChatBskyConvoDefsSystemMessageDataMemberJoin, systemMessageDataMemberLeave: ChatBskyConvoDefsSystemMessageDataMemberLeave, systemMessageDataRemoveMember: ChatBskyConvoDefsSystemMessageDataRemoveMember, systemMessageDataUnlockConvo: ChatBskyConvoDefsSystemMessageDataUnlockConvo, systemMessageReferredUser: ChatBskyConvoDefsSystemMessageReferredUser, systemMessageView: ChatBskyConvoDefsSystemMessageView },
        deleteMessageForSelf: ChatBskyConvoDeleteMessageForSelf,
        getConvo: ChatBskyConvoGetConvo,
        getConvoAvailability: ChatBskyConvoGetConvoAvailability,
        getConvoForMembers: ChatBskyConvoGetConvoForMembers,
        getConvoMembers: ChatBskyConvoGetConvoMembers,
        getLog: ChatBskyConvoGetLog,
        getMessages: ChatBskyConvoGetMessages,
        getUnreadCounts: ChatBskyConvoGetUnreadCounts,
        listConvoRequests: ChatBskyConvoListConvoRequests,
        listConvos: ChatBskyConvoListConvos,
        lockConvo: ChatBskyConvoLockConvo,
        muteConvo: ChatBskyConvoMuteConvo,
        removeReaction: ChatBskyConvoRemoveReaction,
        sendMessage: ChatBskyConvoSendMessage,
        sendMessageBatch: Object.assign(ChatBskyConvoSendMessageBatch, { batchItem: ChatBskyConvoSendMessageBatchBatchItem }),
        unlockConvo: ChatBskyConvoUnlockConvo,
        unmuteConvo: ChatBskyConvoUnmuteConvo,
        updateAllRead: ChatBskyConvoUpdateAllRead,
        updateRead: ChatBskyConvoUpdateRead
      },
      embed: {
        joinLink: Object.assign(ChatBskyEmbedJoinLink, { view: ChatBskyEmbedJoinLinkView })
      },
      group: {
        addMembers: ChatBskyGroupAddMembers,
        approveJoinRequest: ChatBskyGroupApproveJoinRequest,
        createGroup: ChatBskyGroupCreateGroup,
        createJoinLink: ChatBskyGroupCreateJoinLink,
        defs: { disabledJoinLinkPreviewView: ChatBskyGroupDefsDisabledJoinLinkPreviewView, invalidJoinLinkPreviewView: ChatBskyGroupDefsInvalidJoinLinkPreviewView, joinLinkPreviewView: ChatBskyGroupDefsJoinLinkPreviewView, joinLinkView: ChatBskyGroupDefsJoinLinkView, joinLinkViewerState: ChatBskyGroupDefsJoinLinkViewerState, joinRequestConvoView: ChatBskyGroupDefsJoinRequestConvoView, joinRequestView: ChatBskyGroupDefsJoinRequestView, joinRule: ChatBskyGroupDefsJoinRule, linkEnabledStatus: ChatBskyGroupDefsLinkEnabledStatus },
        disableJoinLink: ChatBskyGroupDisableJoinLink,
        editGroup: ChatBskyGroupEditGroup,
        editJoinLink: ChatBskyGroupEditJoinLink,
        enableJoinLink: ChatBskyGroupEnableJoinLink,
        getJoinLinkPreviews: ChatBskyGroupGetJoinLinkPreviews,
        listJoinRequests: ChatBskyGroupListJoinRequests,
        listMutualGroups: ChatBskyGroupListMutualGroups,
        rejectJoinRequest: ChatBskyGroupRejectJoinRequest,
        removeMembers: ChatBskyGroupRemoveMembers,
        requestJoin: ChatBskyGroupRequestJoin,
        updateJoinRequestsRead: ChatBskyGroupUpdateJoinRequestsRead,
        withdrawJoinRequest: ChatBskyGroupWithdrawJoinRequest
      },
      moderation: {
        defs: { convoView: ChatBskyModerationDefsConvoView, directConvo: ChatBskyModerationDefsDirectConvo, groupConvo: ChatBskyModerationDefsGroupConvo },
        getActorMetadata: Object.assign(ChatBskyModerationGetActorMetadata, { metadata: ChatBskyModerationGetActorMetadataMetadata }),
        getConvo: ChatBskyModerationGetConvo,
        getConvoMembers: ChatBskyModerationGetConvoMembers,
        getConvos: ChatBskyModerationGetConvos,
        getMessageContext: ChatBskyModerationGetMessageContext,
        subscribeModEvents: Object.assign(ChatBskyModerationSubscribeModEvents, { eventChatAccepted: ChatBskyModerationSubscribeModEventsEventChatAccepted, eventConvoFirstMessage: ChatBskyModerationSubscribeModEventsEventConvoFirstMessage, eventGroupChatCreated: ChatBskyModerationSubscribeModEventsEventGroupChatCreated, eventGroupChatJoinRequest: ChatBskyModerationSubscribeModEventsEventGroupChatJoinRequest, eventGroupChatJoinRequestApproved: ChatBskyModerationSubscribeModEventsEventGroupChatJoinRequestApproved, eventGroupChatJoinRequestRejected: ChatBskyModerationSubscribeModEventsEventGroupChatJoinRequestRejected, eventGroupChatMemberAdded: ChatBskyModerationSubscribeModEventsEventGroupChatMemberAdded, eventGroupChatMemberJoined: ChatBskyModerationSubscribeModEventsEventGroupChatMemberJoined, eventGroupChatMemberLeft: ChatBskyModerationSubscribeModEventsEventGroupChatMemberLeft, eventGroupChatUpdated: ChatBskyModerationSubscribeModEventsEventGroupChatUpdated, eventRateLimitExceeded: ChatBskyModerationSubscribeModEventsEventRateLimitExceeded }),
        updateActorAccess: ChatBskyModerationUpdateActorAccess
      },
      notification: {
        defs: { chatPreference: ChatBskyNotificationDefsChatPreference, preferences: ChatBskyNotificationDefsPreferences },
        getPreferences: ChatBskyNotificationGetPreferences,
        putPreferences: ChatBskyNotificationPutPreferences
      }
    }
  },
  com: {
    atproto: {
      admin: {
        defs: { accountView: ComAtprotoAdminDefsAccountView, repoBlobRef: ComAtprotoAdminDefsRepoBlobRef, repoRef: ComAtprotoAdminDefsRepoRef, statusAttr: ComAtprotoAdminDefsStatusAttr, threatSignature: ComAtprotoAdminDefsThreatSignature },
        deleteAccount: ComAtprotoAdminDeleteAccount,
        disableAccountInvites: ComAtprotoAdminDisableAccountInvites,
        disableInviteCodes: ComAtprotoAdminDisableInviteCodes,
        enableAccountInvites: ComAtprotoAdminEnableAccountInvites,
        getAccountInfo: ComAtprotoAdminGetAccountInfo,
        getAccountInfos: ComAtprotoAdminGetAccountInfos,
        getInviteCodes: ComAtprotoAdminGetInviteCodes,
        getSubjectStatus: ComAtprotoAdminGetSubjectStatus,
        searchAccounts: ComAtprotoAdminSearchAccounts,
        sendEmail: ComAtprotoAdminSendEmail,
        updateAccountEmail: ComAtprotoAdminUpdateAccountEmail,
        updateAccountHandle: ComAtprotoAdminUpdateAccountHandle,
        updateAccountPassword: ComAtprotoAdminUpdateAccountPassword,
        updateAccountSigningKey: ComAtprotoAdminUpdateAccountSigningKey,
        updateSubjectStatus: ComAtprotoAdminUpdateSubjectStatus
      },
      identity: {
        defs: { identityInfo: ComAtprotoIdentityDefsIdentityInfo },
        getRecommendedDidCredentials: ComAtprotoIdentityGetRecommendedDidCredentials,
        refreshIdentity: ComAtprotoIdentityRefreshIdentity,
        requestPlcOperationSignature: ComAtprotoIdentityRequestPlcOperationSignature,
        resolveDid: ComAtprotoIdentityResolveDid,
        resolveHandle: ComAtprotoIdentityResolveHandle,
        resolveIdentity: ComAtprotoIdentityResolveIdentity,
        signPlcOperation: ComAtprotoIdentitySignPlcOperation,
        submitPlcOperation: ComAtprotoIdentitySubmitPlcOperation,
        updateHandle: ComAtprotoIdentityUpdateHandle
      },
      label: {
        defs: { label: ComAtprotoLabelDefsLabel, labelValue: ComAtprotoLabelDefsLabelValue, labelValueDefinition: ComAtprotoLabelDefsLabelValueDefinition, labelValueDefinitionStrings: ComAtprotoLabelDefsLabelValueDefinitionStrings, selfLabel: ComAtprotoLabelDefsSelfLabel, selfLabels: ComAtprotoLabelDefsSelfLabels },
        queryLabels: ComAtprotoLabelQueryLabels,
        record: ComAtprotoLabelRecord,
        subscribeLabels: Object.assign(ComAtprotoLabelSubscribeLabels, { info: ComAtprotoLabelSubscribeLabelsInfo, labels: ComAtprotoLabelSubscribeLabelsLabels })
      },
      lexicon: {
        resolveLexicon: ComAtprotoLexiconResolveLexicon,
        schema: ComAtprotoLexiconSchema
      },
      moderation: {
        createReport: Object.assign(ComAtprotoModerationCreateReport, { modTool: ComAtprotoModerationCreateReportModTool }),
        defs: { reasonAppeal: ComAtprotoModerationDefsReasonAppeal, reasonMisleading: ComAtprotoModerationDefsReasonMisleading, reasonOther: ComAtprotoModerationDefsReasonOther, reasonRude: ComAtprotoModerationDefsReasonRude, reasonSexual: ComAtprotoModerationDefsReasonSexual, reasonSpam: ComAtprotoModerationDefsReasonSpam, reasonType: ComAtprotoModerationDefsReasonType, reasonViolation: ComAtprotoModerationDefsReasonViolation, subjectType: ComAtprotoModerationDefsSubjectType }
      },
      repo: {
        applyWrites: Object.assign(ComAtprotoRepoApplyWrites, { create: ComAtprotoRepoApplyWritesCreate, createResult: ComAtprotoRepoApplyWritesCreateResult, "delete": ComAtprotoRepoApplyWritesDelete, deleteResult: ComAtprotoRepoApplyWritesDeleteResult, update: ComAtprotoRepoApplyWritesUpdate, updateResult: ComAtprotoRepoApplyWritesUpdateResult }),
        createRecord: ComAtprotoRepoCreateRecord,
        defs: { commitMeta: ComAtprotoRepoDefsCommitMeta },
        deleteRecord: ComAtprotoRepoDeleteRecord,
        describeRepo: ComAtprotoRepoDescribeRepo,
        getRecord: ComAtprotoRepoGetRecord,
        importRepo: ComAtprotoRepoImportRepo,
        listMissingBlobs: Object.assign(ComAtprotoRepoListMissingBlobs, { recordBlob: ComAtprotoRepoListMissingBlobsRecordBlob }),
        listRecords: Object.assign(ComAtprotoRepoListRecords, { record: ComAtprotoRepoListRecordsRecord }),
        putRecord: ComAtprotoRepoPutRecord,
        strongRef: ComAtprotoRepoStrongRef,
        uploadBlob: ComAtprotoRepoUploadBlob
      },
      server: {
        activateAccount: ComAtprotoServerActivateAccount,
        checkAccountStatus: ComAtprotoServerCheckAccountStatus,
        confirmEmail: ComAtprotoServerConfirmEmail,
        createAccount: ComAtprotoServerCreateAccount,
        createAppPassword: Object.assign(ComAtprotoServerCreateAppPassword, { appPassword: ComAtprotoServerCreateAppPasswordAppPassword }),
        createInviteCode: ComAtprotoServerCreateInviteCode,
        createInviteCodes: Object.assign(ComAtprotoServerCreateInviteCodes, { accountCodes: ComAtprotoServerCreateInviteCodesAccountCodes }),
        createSession: ComAtprotoServerCreateSession,
        deactivateAccount: ComAtprotoServerDeactivateAccount,
        defs: { inviteCode: ComAtprotoServerDefsInviteCode, inviteCodeUse: ComAtprotoServerDefsInviteCodeUse },
        deleteAccount: ComAtprotoServerDeleteAccount,
        deleteSession: ComAtprotoServerDeleteSession,
        describeServer: Object.assign(ComAtprotoServerDescribeServer, { contact: ComAtprotoServerDescribeServerContact, links: ComAtprotoServerDescribeServerLinks }),
        getAccountInviteCodes: ComAtprotoServerGetAccountInviteCodes,
        getServiceAuth: ComAtprotoServerGetServiceAuth,
        getSession: ComAtprotoServerGetSession,
        listAppPasswords: Object.assign(ComAtprotoServerListAppPasswords, { appPassword: ComAtprotoServerListAppPasswordsAppPassword }),
        refreshSession: ComAtprotoServerRefreshSession,
        requestAccountDelete: ComAtprotoServerRequestAccountDelete,
        requestEmailConfirmation: ComAtprotoServerRequestEmailConfirmation,
        requestEmailUpdate: ComAtprotoServerRequestEmailUpdate,
        requestPasswordReset: ComAtprotoServerRequestPasswordReset,
        reserveSigningKey: ComAtprotoServerReserveSigningKey,
        resetPassword: ComAtprotoServerResetPassword,
        revokeAppPassword: ComAtprotoServerRevokeAppPassword,
        updateEmail: ComAtprotoServerUpdateEmail
      },
      sync: {
        defs: { hostStatus: ComAtprotoSyncDefsHostStatus },
        getBlob: ComAtprotoSyncGetBlob,
        getBlocks: ComAtprotoSyncGetBlocks,
        getCheckout: ComAtprotoSyncGetCheckout,
        getHead: ComAtprotoSyncGetHead,
        getHostStatus: ComAtprotoSyncGetHostStatus,
        getLatestCommit: ComAtprotoSyncGetLatestCommit,
        getRecord: ComAtprotoSyncGetRecord,
        getRepo: ComAtprotoSyncGetRepo,
        getRepoStatus: ComAtprotoSyncGetRepoStatus,
        listBlobs: ComAtprotoSyncListBlobs,
        listHosts: Object.assign(ComAtprotoSyncListHosts, { host: ComAtprotoSyncListHostsHost }),
        listRepos: Object.assign(ComAtprotoSyncListRepos, { repo: ComAtprotoSyncListReposRepo }),
        listReposByCollection: Object.assign(ComAtprotoSyncListReposByCollection, { repo: ComAtprotoSyncListReposByCollectionRepo }),
        notifyOfUpdate: ComAtprotoSyncNotifyOfUpdate,
        requestCrawl: ComAtprotoSyncRequestCrawl,
        subscribeRepos: Object.assign(ComAtprotoSyncSubscribeRepos, { account: ComAtprotoSyncSubscribeReposAccount, commit: ComAtprotoSyncSubscribeReposCommit, identity: ComAtprotoSyncSubscribeReposIdentity, info: ComAtprotoSyncSubscribeReposInfo, repoOp: ComAtprotoSyncSubscribeReposRepoOp, sync: ComAtprotoSyncSubscribeReposSync })
      },
      temp: {
        addReservedHandle: ComAtprotoTempAddReservedHandle,
        checkHandleAvailability: Object.assign(ComAtprotoTempCheckHandleAvailability, { resultAvailable: ComAtprotoTempCheckHandleAvailabilityResultAvailable, resultUnavailable: ComAtprotoTempCheckHandleAvailabilityResultUnavailable, suggestion: ComAtprotoTempCheckHandleAvailabilitySuggestion }),
        checkSignupQueue: ComAtprotoTempCheckSignupQueue,
        dereferenceScope: ComAtprotoTempDereferenceScope,
        fetchLabels: ComAtprotoTempFetchLabels,
        requestPhoneVerification: ComAtprotoTempRequestPhoneVerification,
        revokeAccountCredentials: ComAtprotoTempRevokeAccountCredentials
      }
    }
  }
};
export {
  AppBskyActorContentVisibilityDeclaration,
  AppBskyActorDefsAdultContentPref,
  AppBskyActorDefsBskyAppProgressGuide,
  AppBskyActorDefsBskyAppStatePref,
  AppBskyActorDefsContentLabelPref,
  AppBskyActorDefsDeclaredAgePref,
  AppBskyActorDefsFeedViewPref,
  AppBskyActorDefsHiddenPostsPref,
  AppBskyActorDefsInterestsPref,
  AppBskyActorDefsKnownFollowers,
  AppBskyActorDefsLabelerPrefItem,
  AppBskyActorDefsLabelersPref,
  AppBskyActorDefsLiveEventPreferences,
  AppBskyActorDefsMutedWord,
  AppBskyActorDefsMutedWordTarget,
  AppBskyActorDefsMutedWordsPref,
  AppBskyActorDefsNux,
  AppBskyActorDefsPersonalDetailsPref,
  AppBskyActorDefsPostInteractionSettingsPref,
  AppBskyActorDefsPreferences,
  AppBskyActorDefsProfileAssociated,
  AppBskyActorDefsProfileAssociatedActivitySubscription,
  AppBskyActorDefsProfileAssociatedChat,
  AppBskyActorDefsProfileAssociatedGerm,
  AppBskyActorDefsProfileLinkView,
  AppBskyActorDefsProfileView,
  AppBskyActorDefsProfileViewBasic,
  AppBskyActorDefsProfileViewDetailed,
  AppBskyActorDefsSavedFeed,
  AppBskyActorDefsSavedFeedsPref,
  AppBskyActorDefsSavedFeedsPrefV2,
  AppBskyActorDefsStatusView,
  AppBskyActorDefsThreadViewPref,
  AppBskyActorDefsVerificationPrefs,
  AppBskyActorDefsVerificationState,
  AppBskyActorDefsVerificationView,
  AppBskyActorDefsViewerState,
  AppBskyActorGetPreferences,
  AppBskyActorGetProfile,
  AppBskyActorGetProfiles,
  AppBskyActorGetSuggestions,
  AppBskyActorLink,
  AppBskyActorProfile,
  AppBskyActorPutPreferences,
  AppBskyActorSearchActors,
  AppBskyActorSearchActorsTypeahead,
  AppBskyActorStatus,
  AppBskyActorStatusLive,
  AppBskyAgeassuranceBegin,
  AppBskyAgeassuranceDefsAccess,
  AppBskyAgeassuranceDefsConfig,
  AppBskyAgeassuranceDefsConfigRegion,
  AppBskyAgeassuranceDefsConfigRegionRuleDefault,
  AppBskyAgeassuranceDefsConfigRegionRuleIfAccountNewerThan,
  AppBskyAgeassuranceDefsConfigRegionRuleIfAccountOlderThan,
  AppBskyAgeassuranceDefsConfigRegionRuleIfAssuredOverAge,
  AppBskyAgeassuranceDefsConfigRegionRuleIfAssuredUnderAge,
  AppBskyAgeassuranceDefsConfigRegionRuleIfDeclaredOverAge,
  AppBskyAgeassuranceDefsConfigRegionRuleIfDeclaredUnderAge,
  AppBskyAgeassuranceDefsEvent,
  AppBskyAgeassuranceDefsState,
  AppBskyAgeassuranceDefsStateMetadata,
  AppBskyAgeassuranceDefsStatus,
  AppBskyAgeassuranceGetConfig,
  AppBskyAgeassuranceGetState,
  AppBskyAuthCreatePosts,
  AppBskyAuthDeleteContent,
  AppBskyAuthManageFeedDeclarations,
  AppBskyAuthManageLabelerService,
  AppBskyAuthManageModeration,
  AppBskyAuthManageNotifications,
  AppBskyAuthManageProfile,
  AppBskyAuthViewAll,
  AppBskyBookmarkCreateBookmark,
  AppBskyBookmarkDefsBookmark,
  AppBskyBookmarkDefsBookmarkView,
  AppBskyBookmarkDeleteBookmark,
  AppBskyBookmarkGetBookmarks,
  AppBskyContactDefsMatchAndContactIndex,
  AppBskyContactDefsNotification,
  AppBskyContactDefsSyncStatus,
  AppBskyContactDismissMatch,
  AppBskyContactGetMatches,
  AppBskyContactGetSyncStatus,
  AppBskyContactImportContacts,
  AppBskyContactRemoveData,
  AppBskyContactSendNotification,
  AppBskyContactStartPhoneVerification,
  AppBskyContactVerifyPhone,
  AppBskyDraftCreateDraft,
  AppBskyDraftDefsDraft,
  AppBskyDraftDefsDraftEmbedCaption,
  AppBskyDraftDefsDraftEmbedExternal,
  AppBskyDraftDefsDraftEmbedGallery,
  AppBskyDraftDefsDraftEmbedGalleryItems,
  AppBskyDraftDefsDraftEmbedImage,
  AppBskyDraftDefsDraftEmbedLocalRef,
  AppBskyDraftDefsDraftEmbedRecord,
  AppBskyDraftDefsDraftEmbedVideo,
  AppBskyDraftDefsDraftPost,
  AppBskyDraftDefsDraftView,
  AppBskyDraftDefsDraftWithId,
  AppBskyDraftDeleteDraft,
  AppBskyDraftGetDrafts,
  AppBskyDraftUpdateDraft,
  AppBskyEmbedDefsAspectRatio,
  AppBskyEmbedExternal,
  AppBskyEmbedExternalColorRGB,
  AppBskyEmbedExternalExternal,
  AppBskyEmbedExternalView,
  AppBskyEmbedExternalViewArticle,
  AppBskyEmbedExternalViewArticlePublication,
  AppBskyEmbedExternalViewArticlePublicationTheme,
  AppBskyEmbedExternalViewExternal,
  AppBskyEmbedExternalViewExternalSource,
  AppBskyEmbedExternalViewExternalSourceTheme,
  AppBskyEmbedExternalViewGallery,
  AppBskyEmbedExternalViewGalleryImage,
  AppBskyEmbedExternalViewLivestream,
  AppBskyEmbedGallery,
  AppBskyEmbedGalleryImage,
  AppBskyEmbedGalleryView,
  AppBskyEmbedGalleryViewImage,
  AppBskyEmbedGetEmbedExternalView,
  AppBskyEmbedImages,
  AppBskyEmbedImagesImage,
  AppBskyEmbedImagesView,
  AppBskyEmbedImagesViewImage,
  AppBskyEmbedRecord,
  AppBskyEmbedRecordView,
  AppBskyEmbedRecordViewBlocked,
  AppBskyEmbedRecordViewDetached,
  AppBskyEmbedRecordViewNotFound,
  AppBskyEmbedRecordViewRecord,
  AppBskyEmbedRecordWithMedia,
  AppBskyEmbedRecordWithMediaView,
  AppBskyEmbedVideo,
  AppBskyEmbedVideoCaption,
  AppBskyEmbedVideoView,
  AppBskyFeedDefsBlockedAuthor,
  AppBskyFeedDefsBlockedPost,
  AppBskyFeedDefsClickthroughAuthor,
  AppBskyFeedDefsClickthroughEmbed,
  AppBskyFeedDefsClickthroughItem,
  AppBskyFeedDefsClickthroughReposter,
  AppBskyFeedDefsContentModeUnspecified,
  AppBskyFeedDefsContentModeVideo,
  AppBskyFeedDefsFeedViewPost,
  AppBskyFeedDefsGeneratorView,
  AppBskyFeedDefsGeneratorViewerState,
  AppBskyFeedDefsInteraction,
  AppBskyFeedDefsInteractionLike,
  AppBskyFeedDefsInteractionQuote,
  AppBskyFeedDefsInteractionReply,
  AppBskyFeedDefsInteractionRepost,
  AppBskyFeedDefsInteractionSeen,
  AppBskyFeedDefsInteractionShare,
  AppBskyFeedDefsKnownLikers,
  AppBskyFeedDefsNotFoundPost,
  AppBskyFeedDefsPostView,
  AppBskyFeedDefsReasonPin,
  AppBskyFeedDefsReasonRepost,
  AppBskyFeedDefsReplyRef,
  AppBskyFeedDefsRequestLess,
  AppBskyFeedDefsRequestMore,
  AppBskyFeedDefsSkeletonFeedPost,
  AppBskyFeedDefsSkeletonReasonPin,
  AppBskyFeedDefsSkeletonReasonRepost,
  AppBskyFeedDefsThreadContext,
  AppBskyFeedDefsThreadViewPost,
  AppBskyFeedDefsThreadgateView,
  AppBskyFeedDefsViewerState,
  AppBskyFeedDescribeFeedGenerator,
  AppBskyFeedDescribeFeedGeneratorFeed,
  AppBskyFeedDescribeFeedGeneratorLinks,
  AppBskyFeedGenerator,
  AppBskyFeedGetActorFeeds,
  AppBskyFeedGetActorLikes,
  AppBskyFeedGetAuthorFeed,
  AppBskyFeedGetFeed,
  AppBskyFeedGetFeedGenerator,
  AppBskyFeedGetFeedGenerators,
  AppBskyFeedGetFeedSkeleton,
  AppBskyFeedGetLikes,
  AppBskyFeedGetLikesLike,
  AppBskyFeedGetListFeed,
  AppBskyFeedGetPostThread,
  AppBskyFeedGetPosts,
  AppBskyFeedGetQuotes,
  AppBskyFeedGetRepostedBy,
  AppBskyFeedGetSuggestedFeeds,
  AppBskyFeedGetTimeline,
  AppBskyFeedLike,
  AppBskyFeedPost,
  AppBskyFeedPostEntity,
  AppBskyFeedPostReplyRef,
  AppBskyFeedPostTextSlice,
  AppBskyFeedPostgate,
  AppBskyFeedPostgateDisableRule,
  AppBskyFeedRepost,
  AppBskyFeedSearchPosts,
  AppBskyFeedSearchPostsV2,
  AppBskyFeedSendInteractions,
  AppBskyFeedThreadgate,
  AppBskyFeedThreadgateFollowerRule,
  AppBskyFeedThreadgateFollowingRule,
  AppBskyFeedThreadgateListRule,
  AppBskyFeedThreadgateMentionRule,
  AppBskyGraphBlock,
  AppBskyGraphDefsCuratelist,
  AppBskyGraphDefsListItemView,
  AppBskyGraphDefsListPurpose,
  AppBskyGraphDefsListView,
  AppBskyGraphDefsListViewBasic,
  AppBskyGraphDefsListViewerState,
  AppBskyGraphDefsModlist,
  AppBskyGraphDefsNotFoundActor,
  AppBskyGraphDefsReferencelist,
  AppBskyGraphDefsRelationship,
  AppBskyGraphDefsStarterPackView,
  AppBskyGraphDefsStarterPackViewBasic,
  AppBskyGraphFollow,
  AppBskyGraphGetActorStarterPacks,
  AppBskyGraphGetBlocks,
  AppBskyGraphGetKnownFollowers,
  AppBskyGraphGetList,
  AppBskyGraphGetListBlocks,
  AppBskyGraphGetListMutes,
  AppBskyGraphGetLists,
  AppBskyGraphGetListsWithMembership,
  AppBskyGraphGetListsWithMembershipListWithMembership,
  AppBskyGraphGetMutes,
  AppBskyGraphGetRelationships,
  AppBskyGraphGetStarterPack,
  AppBskyGraphGetStarterPacks,
  AppBskyGraphGetStarterPacksWithMembership,
  AppBskyGraphGetStarterPacksWithMembershipStarterPackWithMembership,
  AppBskyGraphGetSuggestedFollowsByActor,
  AppBskyGraphList,
  AppBskyGraphListblock,
  AppBskyGraphListitem,
  AppBskyGraphMuteActor,
  AppBskyGraphMuteActorList,
  AppBskyGraphMuteThread,
  AppBskyGraphReferencelistoptout,
  AppBskyGraphSearchStarterPacks,
  AppBskyGraphSearchStarterPacksV2,
  AppBskyGraphStarterpack,
  AppBskyGraphStarterpackFeedItem,
  AppBskyGraphUnmuteActor,
  AppBskyGraphUnmuteActorList,
  AppBskyGraphUnmuteThread,
  AppBskyGraphVerification,
  AppBskyLabelerDefsLabelerPolicies,
  AppBskyLabelerDefsLabelerView,
  AppBskyLabelerDefsLabelerViewDetailed,
  AppBskyLabelerDefsLabelerViewerState,
  AppBskyLabelerGetServices,
  AppBskyLabelerService,
  AppBskyNotificationDeclaration,
  AppBskyNotificationDefsActivitySubscription,
  AppBskyNotificationDefsChatPreference,
  AppBskyNotificationDefsFilterablePreference,
  AppBskyNotificationDefsPreference,
  AppBskyNotificationDefsPreferences,
  AppBskyNotificationDefsRecordDeleted,
  AppBskyNotificationDefsSubjectActivitySubscription,
  AppBskyNotificationGetGroupedNotifications,
  AppBskyNotificationGetGroupedNotificationsContactMatchNotification,
  AppBskyNotificationGetGroupedNotificationsFollowBackNotification,
  AppBskyNotificationGetGroupedNotificationsFollowGroup,
  AppBskyNotificationGetGroupedNotificationsFollowItem,
  AppBskyNotificationGetGroupedNotificationsGeneratorLikeGroup,
  AppBskyNotificationGetGroupedNotificationsGeneratorLikeItem,
  AppBskyNotificationGetGroupedNotificationsGroup,
  AppBskyNotificationGetGroupedNotificationsLikeGroup,
  AppBskyNotificationGetGroupedNotificationsLikeItem,
  AppBskyNotificationGetGroupedNotificationsLikeViaRepostGroup,
  AppBskyNotificationGetGroupedNotificationsLikeViaRepostItem,
  AppBskyNotificationGetGroupedNotificationsMentionNotification,
  AppBskyNotificationGetGroupedNotificationsMultiPostLikeGroup,
  AppBskyNotificationGetGroupedNotificationsMultiPostLikeItem,
  AppBskyNotificationGetGroupedNotificationsMultiPostLikeViaRepostGroup,
  AppBskyNotificationGetGroupedNotificationsMultiPostLikeViaRepostItem,
  AppBskyNotificationGetGroupedNotificationsMultiPostRepostGroup,
  AppBskyNotificationGetGroupedNotificationsMultiPostRepostItem,
  AppBskyNotificationGetGroupedNotificationsMultiPostRepostViaRepostGroup,
  AppBskyNotificationGetGroupedNotificationsMultiPostRepostViaRepostItem,
  AppBskyNotificationGetGroupedNotificationsQuoteNotification,
  AppBskyNotificationGetGroupedNotificationsReplyNotification,
  AppBskyNotificationGetGroupedNotificationsRepostGroup,
  AppBskyNotificationGetGroupedNotificationsRepostItem,
  AppBskyNotificationGetGroupedNotificationsRepostViaRepostGroup,
  AppBskyNotificationGetGroupedNotificationsRepostViaRepostItem,
  AppBskyNotificationGetGroupedNotificationsStarterPackJoinedNotification,
  AppBskyNotificationGetGroupedNotificationsSubscribedPostGroup,
  AppBskyNotificationGetGroupedNotificationsSubscribedPostItem,
  AppBskyNotificationGetGroupedNotificationsUnverifiedNotification,
  AppBskyNotificationGetGroupedNotificationsVerifiedNotification,
  AppBskyNotificationGetPreferences,
  AppBskyNotificationGetUnreadCount,
  AppBskyNotificationListActivitySubscriptions,
  AppBskyNotificationListNotifications,
  AppBskyNotificationListNotificationsNotification,
  AppBskyNotificationPutActivitySubscription,
  AppBskyNotificationPutPreferences,
  AppBskyNotificationPutPreferencesV2,
  AppBskyNotificationRegisterPush,
  AppBskyNotificationUnregisterPush,
  AppBskyNotificationUpdateSeen,
  AppBskyRichtextFacet,
  AppBskyRichtextFacetByteSlice,
  AppBskyRichtextFacetLink,
  AppBskyRichtextFacetMention,
  AppBskyRichtextFacetTag,
  AppBskyUnspeccedDefsAgeAssuranceEvent,
  AppBskyUnspeccedDefsAgeAssuranceState,
  AppBskyUnspeccedDefsSkeletonSearchActor,
  AppBskyUnspeccedDefsSkeletonSearchPost,
  AppBskyUnspeccedDefsSkeletonSearchStarterPack,
  AppBskyUnspeccedDefsSkeletonTrend,
  AppBskyUnspeccedDefsThreadItemBlocked,
  AppBskyUnspeccedDefsThreadItemNoUnauthenticated,
  AppBskyUnspeccedDefsThreadItemNotFound,
  AppBskyUnspeccedDefsThreadItemPost,
  AppBskyUnspeccedDefsTrendView,
  AppBskyUnspeccedDefsTrendingTopic,
  AppBskyUnspeccedGetAgeAssuranceState,
  AppBskyUnspeccedGetAtmosphereExploreArticleRecommendations,
  AppBskyUnspeccedGetAtmosphereExploreArticleRecommendationsArticle,
  AppBskyUnspeccedGetConfig,
  AppBskyUnspeccedGetConfigLiveNowConfig,
  AppBskyUnspeccedGetOnboardingSuggestedUsersSkeleton,
  AppBskyUnspeccedGetPopularFeedGenerators,
  AppBskyUnspeccedGetPostThreadOtherV2,
  AppBskyUnspeccedGetPostThreadOtherV2ThreadItem,
  AppBskyUnspeccedGetPostThreadV2,
  AppBskyUnspeccedGetPostThreadV2ThreadItem,
  AppBskyUnspeccedGetSuggestedOnboardingUsers,
  AppBskyUnspeccedGetSuggestedUsers,
  AppBskyUnspeccedGetSuggestedUsersForDiscover,
  AppBskyUnspeccedGetSuggestedUsersForDiscoverSkeleton,
  AppBskyUnspeccedGetSuggestedUsersForExplore,
  AppBskyUnspeccedGetSuggestedUsersForExploreSkeleton,
  AppBskyUnspeccedGetSuggestedUsersForSeeMore,
  AppBskyUnspeccedGetSuggestedUsersForSeeMoreSkeleton,
  AppBskyUnspeccedGetSuggestedUsersSkeleton,
  AppBskyUnspeccedGetSuggestionsSkeleton,
  AppBskyUnspeccedGetTaggedSuggestions,
  AppBskyUnspeccedGetTaggedSuggestionsSuggestion,
  AppBskyUnspeccedGetTrendingTopics,
  AppBskyUnspeccedGetTrends,
  AppBskyUnspeccedGetTrendsSkeleton,
  AppBskyUnspeccedInitAgeAssurance,
  AppBskyUnspeccedSearchActorsSkeleton,
  AppBskyUnspeccedSearchPostsSkeleton,
  AppBskyUnspeccedSearchStarterPacksSkeleton,
  AppBskyVideoAbortUpload,
  AppBskyVideoDefsJobStatus,
  AppBskyVideoFinishUpload,
  AppBskyVideoGetJobStatus,
  AppBskyVideoGetUploadLimits,
  AppBskyVideoGetUploadStatus,
  AppBskyVideoStartUpload,
  AppBskyVideoUploadPart,
  AppBskyVideoUploadVideo,
  ChatBskyActorDeclaration,
  ChatBskyActorDefsDirectConvoMember,
  ChatBskyActorDefsGroupConvoMember,
  ChatBskyActorDefsMemberRole,
  ChatBskyActorDefsPastGroupConvoMember,
  ChatBskyActorDefsProfileViewBasic,
  ChatBskyActorDeleteAccount,
  ChatBskyActorExportAccountData,
  ChatBskyActorGetStatus,
  ChatBskyConvoAcceptConvo,
  ChatBskyConvoAddReaction,
  ChatBskyConvoDefsConvoKind,
  ChatBskyConvoDefsConvoLockStatus,
  ChatBskyConvoDefsConvoRef,
  ChatBskyConvoDefsConvoStatus,
  ChatBskyConvoDefsConvoView,
  ChatBskyConvoDefsDeletedMessageView,
  ChatBskyConvoDefsDirectConvo,
  ChatBskyConvoDefsGroupConvo,
  ChatBskyConvoDefsLogAcceptConvo,
  ChatBskyConvoDefsLogAddMember,
  ChatBskyConvoDefsLogAddReaction,
  ChatBskyConvoDefsLogApproveJoinRequest,
  ChatBskyConvoDefsLogBeginConvo,
  ChatBskyConvoDefsLogCreateJoinLink,
  ChatBskyConvoDefsLogCreateMessage,
  ChatBskyConvoDefsLogDeleteMessage,
  ChatBskyConvoDefsLogDisableJoinLink,
  ChatBskyConvoDefsLogEditGroup,
  ChatBskyConvoDefsLogEditJoinLink,
  ChatBskyConvoDefsLogEnableJoinLink,
  ChatBskyConvoDefsLogIncomingJoinRequest,
  ChatBskyConvoDefsLogLeaveConvo,
  ChatBskyConvoDefsLogLockConvo,
  ChatBskyConvoDefsLogLockConvoPermanently,
  ChatBskyConvoDefsLogMemberJoin,
  ChatBskyConvoDefsLogMemberLeave,
  ChatBskyConvoDefsLogMuteConvo,
  ChatBskyConvoDefsLogOutgoingJoinRequest,
  ChatBskyConvoDefsLogReadConvo,
  ChatBskyConvoDefsLogReadJoinRequests,
  ChatBskyConvoDefsLogReadMessage,
  ChatBskyConvoDefsLogRejectJoinRequest,
  ChatBskyConvoDefsLogRemoveMember,
  ChatBskyConvoDefsLogRemoveReaction,
  ChatBskyConvoDefsLogUnlockConvo,
  ChatBskyConvoDefsLogUnmuteConvo,
  ChatBskyConvoDefsLogWithdrawIncomingJoinRequest,
  ChatBskyConvoDefsLogWithdrawOutgoingJoinRequest,
  ChatBskyConvoDefsMessageAndReactionView,
  ChatBskyConvoDefsMessageBeforeUserJoinedGroupView,
  ChatBskyConvoDefsMessageInput,
  ChatBskyConvoDefsMessageRef,
  ChatBskyConvoDefsMessageView,
  ChatBskyConvoDefsMessageViewSender,
  ChatBskyConvoDefsReactionView,
  ChatBskyConvoDefsReactionViewSender,
  ChatBskyConvoDefsReplyRef,
  ChatBskyConvoDefsSystemMessageDataAddMember,
  ChatBskyConvoDefsSystemMessageDataCreateJoinLink,
  ChatBskyConvoDefsSystemMessageDataDisableJoinLink,
  ChatBskyConvoDefsSystemMessageDataEditGroup,
  ChatBskyConvoDefsSystemMessageDataEditJoinLink,
  ChatBskyConvoDefsSystemMessageDataEnableJoinLink,
  ChatBskyConvoDefsSystemMessageDataLockConvo,
  ChatBskyConvoDefsSystemMessageDataLockConvoPermanently,
  ChatBskyConvoDefsSystemMessageDataMemberJoin,
  ChatBskyConvoDefsSystemMessageDataMemberLeave,
  ChatBskyConvoDefsSystemMessageDataRemoveMember,
  ChatBskyConvoDefsSystemMessageDataUnlockConvo,
  ChatBskyConvoDefsSystemMessageReferredUser,
  ChatBskyConvoDefsSystemMessageView,
  ChatBskyConvoDeleteMessageForSelf,
  ChatBskyConvoGetConvo,
  ChatBskyConvoGetConvoAvailability,
  ChatBskyConvoGetConvoForMembers,
  ChatBskyConvoGetConvoMembers,
  ChatBskyConvoGetLog,
  ChatBskyConvoGetMessages,
  ChatBskyConvoGetUnreadCounts,
  ChatBskyConvoListConvoRequests,
  ChatBskyConvoListConvos,
  ChatBskyConvoLockConvo,
  ChatBskyConvoMuteConvo,
  ChatBskyConvoRemoveReaction,
  ChatBskyConvoSendMessage,
  ChatBskyConvoSendMessageBatch,
  ChatBskyConvoSendMessageBatchBatchItem,
  ChatBskyConvoUnlockConvo,
  ChatBskyConvoUnmuteConvo,
  ChatBskyConvoUpdateAllRead,
  ChatBskyConvoUpdateRead,
  ChatBskyEmbedJoinLink,
  ChatBskyEmbedJoinLinkView,
  ChatBskyGroupAddMembers,
  ChatBskyGroupApproveJoinRequest,
  ChatBskyGroupCreateGroup,
  ChatBskyGroupCreateJoinLink,
  ChatBskyGroupDefsDisabledJoinLinkPreviewView,
  ChatBskyGroupDefsInvalidJoinLinkPreviewView,
  ChatBskyGroupDefsJoinLinkPreviewView,
  ChatBskyGroupDefsJoinLinkView,
  ChatBskyGroupDefsJoinLinkViewerState,
  ChatBskyGroupDefsJoinRequestConvoView,
  ChatBskyGroupDefsJoinRequestView,
  ChatBskyGroupDefsJoinRule,
  ChatBskyGroupDefsLinkEnabledStatus,
  ChatBskyGroupDisableJoinLink,
  ChatBskyGroupEditGroup,
  ChatBskyGroupEditJoinLink,
  ChatBskyGroupEnableJoinLink,
  ChatBskyGroupGetJoinLinkPreviews,
  ChatBskyGroupListJoinRequests,
  ChatBskyGroupListMutualGroups,
  ChatBskyGroupRejectJoinRequest,
  ChatBskyGroupRemoveMembers,
  ChatBskyGroupRequestJoin,
  ChatBskyGroupUpdateJoinRequestsRead,
  ChatBskyGroupWithdrawJoinRequest,
  ChatBskyModerationDefsConvoView,
  ChatBskyModerationDefsDirectConvo,
  ChatBskyModerationDefsGroupConvo,
  ChatBskyModerationGetActorMetadata,
  ChatBskyModerationGetActorMetadataMetadata,
  ChatBskyModerationGetConvo,
  ChatBskyModerationGetConvoMembers,
  ChatBskyModerationGetConvos,
  ChatBskyModerationGetMessageContext,
  ChatBskyModerationSubscribeModEvents,
  ChatBskyModerationSubscribeModEventsEventChatAccepted,
  ChatBskyModerationSubscribeModEventsEventConvoFirstMessage,
  ChatBskyModerationSubscribeModEventsEventGroupChatCreated,
  ChatBskyModerationSubscribeModEventsEventGroupChatJoinRequest,
  ChatBskyModerationSubscribeModEventsEventGroupChatJoinRequestApproved,
  ChatBskyModerationSubscribeModEventsEventGroupChatJoinRequestRejected,
  ChatBskyModerationSubscribeModEventsEventGroupChatMemberAdded,
  ChatBskyModerationSubscribeModEventsEventGroupChatMemberJoined,
  ChatBskyModerationSubscribeModEventsEventGroupChatMemberLeft,
  ChatBskyModerationSubscribeModEventsEventGroupChatUpdated,
  ChatBskyModerationSubscribeModEventsEventRateLimitExceeded,
  ChatBskyModerationUpdateActorAccess,
  ChatBskyNotificationDefsChatPreference,
  ChatBskyNotificationDefsPreferences,
  ChatBskyNotificationGetPreferences,
  ChatBskyNotificationPutPreferences,
  ComAtprotoAdminDefsAccountView,
  ComAtprotoAdminDefsRepoBlobRef,
  ComAtprotoAdminDefsRepoRef,
  ComAtprotoAdminDefsStatusAttr,
  ComAtprotoAdminDefsThreatSignature,
  ComAtprotoAdminDeleteAccount,
  ComAtprotoAdminDisableAccountInvites,
  ComAtprotoAdminDisableInviteCodes,
  ComAtprotoAdminEnableAccountInvites,
  ComAtprotoAdminGetAccountInfo,
  ComAtprotoAdminGetAccountInfos,
  ComAtprotoAdminGetInviteCodes,
  ComAtprotoAdminGetSubjectStatus,
  ComAtprotoAdminSearchAccounts,
  ComAtprotoAdminSendEmail,
  ComAtprotoAdminUpdateAccountEmail,
  ComAtprotoAdminUpdateAccountHandle,
  ComAtprotoAdminUpdateAccountPassword,
  ComAtprotoAdminUpdateAccountSigningKey,
  ComAtprotoAdminUpdateSubjectStatus,
  ComAtprotoIdentityDefsIdentityInfo,
  ComAtprotoIdentityGetRecommendedDidCredentials,
  ComAtprotoIdentityRefreshIdentity,
  ComAtprotoIdentityRequestPlcOperationSignature,
  ComAtprotoIdentityResolveDid,
  ComAtprotoIdentityResolveHandle,
  ComAtprotoIdentityResolveIdentity,
  ComAtprotoIdentitySignPlcOperation,
  ComAtprotoIdentitySubmitPlcOperation,
  ComAtprotoIdentityUpdateHandle,
  ComAtprotoLabelDefsLabel,
  ComAtprotoLabelDefsLabelValue,
  ComAtprotoLabelDefsLabelValueDefinition,
  ComAtprotoLabelDefsLabelValueDefinitionStrings,
  ComAtprotoLabelDefsSelfLabel,
  ComAtprotoLabelDefsSelfLabels,
  ComAtprotoLabelQueryLabels,
  ComAtprotoLabelRecord,
  ComAtprotoLabelSubscribeLabels,
  ComAtprotoLabelSubscribeLabelsInfo,
  ComAtprotoLabelSubscribeLabelsLabels,
  ComAtprotoLexiconResolveLexicon,
  ComAtprotoLexiconSchema,
  ComAtprotoModerationCreateReport,
  ComAtprotoModerationCreateReportModTool,
  ComAtprotoModerationDefsReasonAppeal,
  ComAtprotoModerationDefsReasonMisleading,
  ComAtprotoModerationDefsReasonOther,
  ComAtprotoModerationDefsReasonRude,
  ComAtprotoModerationDefsReasonSexual,
  ComAtprotoModerationDefsReasonSpam,
  ComAtprotoModerationDefsReasonType,
  ComAtprotoModerationDefsReasonViolation,
  ComAtprotoModerationDefsSubjectType,
  ComAtprotoRepoApplyWrites,
  ComAtprotoRepoApplyWritesCreate,
  ComAtprotoRepoApplyWritesCreateResult,
  ComAtprotoRepoApplyWritesDelete,
  ComAtprotoRepoApplyWritesDeleteResult,
  ComAtprotoRepoApplyWritesUpdate,
  ComAtprotoRepoApplyWritesUpdateResult,
  ComAtprotoRepoCreateRecord,
  ComAtprotoRepoDefsCommitMeta,
  ComAtprotoRepoDeleteRecord,
  ComAtprotoRepoDescribeRepo,
  ComAtprotoRepoGetRecord,
  ComAtprotoRepoImportRepo,
  ComAtprotoRepoListMissingBlobs,
  ComAtprotoRepoListMissingBlobsRecordBlob,
  ComAtprotoRepoListRecords,
  ComAtprotoRepoListRecordsRecord,
  ComAtprotoRepoPutRecord,
  ComAtprotoRepoStrongRef,
  ComAtprotoRepoUploadBlob,
  ComAtprotoServerActivateAccount,
  ComAtprotoServerCheckAccountStatus,
  ComAtprotoServerConfirmEmail,
  ComAtprotoServerCreateAccount,
  ComAtprotoServerCreateAppPassword,
  ComAtprotoServerCreateAppPasswordAppPassword,
  ComAtprotoServerCreateInviteCode,
  ComAtprotoServerCreateInviteCodes,
  ComAtprotoServerCreateInviteCodesAccountCodes,
  ComAtprotoServerCreateSession,
  ComAtprotoServerDeactivateAccount,
  ComAtprotoServerDefsInviteCode,
  ComAtprotoServerDefsInviteCodeUse,
  ComAtprotoServerDeleteAccount,
  ComAtprotoServerDeleteSession,
  ComAtprotoServerDescribeServer,
  ComAtprotoServerDescribeServerContact,
  ComAtprotoServerDescribeServerLinks,
  ComAtprotoServerGetAccountInviteCodes,
  ComAtprotoServerGetServiceAuth,
  ComAtprotoServerGetSession,
  ComAtprotoServerListAppPasswords,
  ComAtprotoServerListAppPasswordsAppPassword,
  ComAtprotoServerRefreshSession,
  ComAtprotoServerRequestAccountDelete,
  ComAtprotoServerRequestEmailConfirmation,
  ComAtprotoServerRequestEmailUpdate,
  ComAtprotoServerRequestPasswordReset,
  ComAtprotoServerReserveSigningKey,
  ComAtprotoServerResetPassword,
  ComAtprotoServerRevokeAppPassword,
  ComAtprotoServerUpdateEmail,
  ComAtprotoSyncDefsHostStatus,
  ComAtprotoSyncGetBlob,
  ComAtprotoSyncGetBlocks,
  ComAtprotoSyncGetCheckout,
  ComAtprotoSyncGetHead,
  ComAtprotoSyncGetHostStatus,
  ComAtprotoSyncGetLatestCommit,
  ComAtprotoSyncGetRecord,
  ComAtprotoSyncGetRepo,
  ComAtprotoSyncGetRepoStatus,
  ComAtprotoSyncListBlobs,
  ComAtprotoSyncListHosts,
  ComAtprotoSyncListHostsHost,
  ComAtprotoSyncListRepos,
  ComAtprotoSyncListReposByCollection,
  ComAtprotoSyncListReposByCollectionRepo,
  ComAtprotoSyncListReposRepo,
  ComAtprotoSyncNotifyOfUpdate,
  ComAtprotoSyncRequestCrawl,
  ComAtprotoSyncSubscribeRepos,
  ComAtprotoSyncSubscribeReposAccount,
  ComAtprotoSyncSubscribeReposCommit,
  ComAtprotoSyncSubscribeReposIdentity,
  ComAtprotoSyncSubscribeReposInfo,
  ComAtprotoSyncSubscribeReposRepoOp,
  ComAtprotoSyncSubscribeReposSync,
  ComAtprotoTempAddReservedHandle,
  ComAtprotoTempCheckHandleAvailability,
  ComAtprotoTempCheckHandleAvailabilityResultAvailable,
  ComAtprotoTempCheckHandleAvailabilityResultUnavailable,
  ComAtprotoTempCheckHandleAvailabilitySuggestion,
  ComAtprotoTempCheckSignupQueue,
  ComAtprotoTempDereferenceScope,
  ComAtprotoTempFetchLabels,
  ComAtprotoTempRequestPhoneVerification,
  ComAtprotoTempRevokeAccountCredentials,
  lex
};
