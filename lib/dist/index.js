// lib/src/errors.ts
var ProtocolError = class extends Error {
  constructor(message, options) {
    super(message, options);
    this.name = "ProtocolError";
  }
};
var AtSyntaxError = class extends ProtocolError {
  format;
  constructor(message, format) {
    super(message);
    this.name = "AtSyntaxError";
    this.format = format;
  }
};
var ValidationError = class extends ProtocolError {
  issues;
  constructor(issues) {
    const detail = issues.map((issue) => issue.path ? `${issue.path}: ${issue.message}` : issue.message).join("\n");
    super(detail || "Invalid AT Protocol data.");
    this.name = "ValidationError";
    this.issues = issues;
  }
};
var XrpcError = class extends Error {
  status;
  data;
  constructor(message, status, data) {
    super(message);
    this.name = "XrpcError";
    this.status = status;
    this.data = data;
  }
  get errorCode() {
    if (!this.data || typeof this.data !== "object" || !("error" in this.data)) return void 0;
    const code = this.data.error;
    return typeof code === "string" ? code : void 0;
  }
  get retryable() {
    return this.status === 408 || this.status === 429 || this.status >= 500;
  }
};
function isXrpcError(error) {
  return error instanceof XrpcError;
}
function isMissingRecord(error) {
  if (!error || typeof error !== "object" || !("status" in error)) return false;
  const status = error.status;
  return status === 400 || status === 404;
}

// lib/src/syntax.ts
var DID_MAX = 2048;
var DID_REGEX = /^did:[a-z]+:[a-zA-Z0-9._:%-]*[a-zA-Z0-9._-]$/;
var HANDLE_MAX = 253;
var HANDLE_REGEX = /^([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?$/;
var NSID_MAX = 317;
var NSID_REGEX = /^[a-zA-Z](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?:\.[a-zA-Z](?:[a-zA-Z0-9]{0,62})?)$/;
var RECORD_KEY_REGEX = /^[a-zA-Z0-9_~.:-]{1,512}$/;
var RECORD_KEY_DOTS = /* @__PURE__ */ new Set([".", ".."]);
var TID_REGEX = /^[234567abcdefghij][234567abcdefghijklmnopqrstuvwxyz]{12}$/;
var TID_ALPHABET = "234567abcdefghijklmnopqrstuvwxyz";
var URI_REGEX = /^\w+:(?:\/\/)?[^\s/][^\s]*$/;
var DATETIME_MAX = 64;
var DATETIME_REGEX = /^(?<full_year>[0-9]{4})-(?<date_month>0[1-9]|1[012])-(?<date_mday>[0-2][0-9]|3[01])T(?<time_hour>[0-1][0-9]|2[0-3]):(?<time_minute>[0-5][0-9]):(?<time_second>[0-5][0-9]|60)(?<time_secfrac>\.[0-9]+)?(?<time_offset>Z|(?<time_numoffset>[+-](?:[0-1][0-9]|2[0-3]):[0-5][0-9]))$/;
var CID_V0 = /^Qm[1-9A-HJ-NP-Za-km-z]{44}$/;
var CID_V1 = /^b[a-z2-7]{8,}$/;
var AT_URI_MAX = 8192;
var AT_URI_INVALID_CHAR = /[^a-zA-Z0-9._~:@!$&'()*+,;=%/\\[\]#?-]/;
var AT_URI_REGEX = /^(?<uri>at:\/\/(?<authority>[^/?#\s]+)(?:\/(?<collection>[^/?#\s]+)(?:\/(?<rkey>[^/?#\s]+))?)?(?<trailingSlash>\/)?)(?:\?(?<query>[^#\s]*))?(?:#(?<hash>[^\s]*))?$/;
var JSON_POINTER = /^\/[a-zA-Z0-9._~:@!$&')(*+,;=%[\]/-]*$/;
var BCP47_REGEXP = /^((?<grandfathered>(en-GB-oed|i-ami|i-bnn|i-default|i-enochian|i-hak|i-klingon|i-lux|i-mingo|i-navajo|i-pwn|i-tao|i-tay|i-tsu|sgn-BE-FR|sgn-BE-NL|sgn-CH-DE)|(art-lojban|cel-gaulish|no-bok|no-nyn|zh-guoyu|zh-hakka|zh-min|zh-min-nan|zh-xiang))|((?<language>([A-Za-z]{2,3}(-(?<extlang>[A-Za-z]{3}(-[A-Za-z]{3}){0,2}))?)|[A-Za-z]{4}|[A-Za-z]{5,8})(-(?<script>[A-Za-z]{4}))?(-(?<region>[A-Za-z]{2}|[0-9]{3}))?(-(?<variant>[A-Za-z0-9]{5,8}|[0-9][A-Za-z0-9]{3}))*(-(?<extension>[0-9A-WY-Za-wy-z](-[A-Za-z0-9]{2,8})+))*(-(?<privateUseA>[xX](-[A-Za-z0-9]{1,8})+))?)|(?<privateUseB>[xX](-[A-Za-z0-9]{1,8})+))$/;
function fail(format, message) {
  throw new AtSyntaxError(message, format);
}
var Did = class _Did {
  value;
  static isValid(input) {
    return typeof input === "string" && input.length <= DID_MAX && DID_REGEX.test(input);
  }
  static parse(input) {
    if (!_Did.isValid(input)) fail("did", "Invalid DID.");
    return new _Did(input);
  }
  constructor(value) {
    this.value = value;
  }
  toString() {
    return this.value;
  }
};
var Handle = class _Handle {
  value;
  static isValid(input) {
    return typeof input === "string" && input.length <= HANDLE_MAX && HANDLE_REGEX.test(input);
  }
  static equal(left, right) {
    return left.toLowerCase() === right.toLowerCase();
  }
  static parse(input) {
    if (!_Handle.isValid(input)) fail("handle", "Invalid handle.");
    return new _Handle(input);
  }
  constructor(value) {
    this.value = value;
  }
  toString() {
    return this.value;
  }
};
var Nsid = class _Nsid {
  value;
  segments;
  static isValid(input) {
    return typeof input === "string" && input.length >= 5 && input.length <= NSID_MAX && NSID_REGEX.test(input);
  }
  static parse(input) {
    if (!_Nsid.isValid(input)) fail("nsid", "Invalid NSID.");
    return new _Nsid(input);
  }
  constructor(value) {
    this.value = value;
    this.segments = value.split(".");
  }
  get name() {
    return this.segments[this.segments.length - 1];
  }
  get authority() {
    return this.segments.slice(0, -1).slice().reverse().join(".");
  }
  toString() {
    return this.value;
  }
};
var RecordKey = class _RecordKey {
  value;
  static isValid(input) {
    return typeof input === "string" && input.length >= 1 && input.length <= 512 && RECORD_KEY_REGEX.test(input) && !RECORD_KEY_DOTS.has(input);
  }
  static parse(input) {
    if (!_RecordKey.isValid(input)) fail("record-key", "Invalid record key.");
    return new _RecordKey(input);
  }
  constructor(value) {
    this.value = value;
  }
  toString() {
    return this.value;
  }
};
var lastTid = 0n;
var Tid = class _Tid {
  value;
  static isValid(input) {
    return typeof input === "string" && input.length === 13 && TID_REGEX.test(input);
  }
  static parse(input) {
    if (!_Tid.isValid(input)) fail("tid", "Invalid TID.");
    return new _Tid(input);
  }
  /** Next id from the clock. The counter only moves forward inside this module. */
  static next(now = Date.now()) {
    let value = BigInt(now) * 1000n;
    if (value <= lastTid) value = lastTid + 1n;
    lastTid = value;
    let out = "";
    let rest = value;
    for (let i = 0; i < 13; i += 1) {
      out = TID_ALPHABET[Number(rest & 31n)] + out;
      rest >>= 5n;
    }
    return out;
  }
  constructor(value) {
    this.value = value;
  }
  toString() {
    return this.value;
  }
};
function nextTid(now = Date.now()) {
  return Tid.next(now);
}
var Uri = class {
  static isValid(input) {
    return typeof input === "string" && URI_REGEX.test(input);
  }
};
var Cid = class {
  static isValid(input) {
    return typeof input === "string" && (CID_V0.test(input) || CID_V1.test(input));
  }
};
var AtIdentifier = class {
  static isValid(input) {
    if (typeof input !== "string" || input.length === 0) return false;
    if (input.startsWith("did:")) return Did.isValid(input);
    return Handle.isValid(input);
  }
};
var AtDatetime = class _AtDatetime {
  static isValid(input) {
    if (typeof input !== "string") return false;
    if (input.length > DATETIME_MAX) return false;
    if (input.endsWith("-00:00")) return false;
    if (!DATETIME_REGEX.test(input)) return false;
    const year = new Date(input).getUTCFullYear();
    if (Number.isNaN(year) || year < 0 || year > 9999) return false;
    return true;
  }
  static parse(input) {
    if (!_AtDatetime.isValid(input)) fail("datetime", "Invalid datetime.");
    return new Date(input);
  }
};
function hasStrictPrimary(groups) {
  const language = groups.language;
  if (!language) return true;
  return /^[a-z]{2,3}$/.test(language.split("-")[0]);
}
function hasDuplicateVariantOrSingleton(input, groups) {
  if (groups.grandfathered || groups.privateUseB) return false;
  const subtags = input.split("-");
  let i = 1;
  if (subtags[0].length === 2 || subtags[0].length === 3) {
    let count = 0;
    while (count < 3 && i < subtags.length && /^[A-Za-z]{3}$/.test(subtags[i])) {
      i += 1;
      count += 1;
    }
  }
  if (i < subtags.length && /^[A-Za-z]{4}$/.test(subtags[i])) i += 1;
  if (i < subtags.length && /^([A-Za-z]{2}|[0-9]{3})$/.test(subtags[i])) i += 1;
  const seenVariants = /* @__PURE__ */ new Set();
  while (i < subtags.length && /^([A-Za-z0-9]{5,8}|[0-9][A-Za-z0-9]{3})$/.test(subtags[i])) {
    const key = subtags[i].toLowerCase();
    if (seenVariants.has(key)) return true;
    seenVariants.add(key);
    i += 1;
  }
  const seenSingletons = /* @__PURE__ */ new Set();
  while (i < subtags.length && /^[0-9A-WYZa-wyz]$/.test(subtags[i])) {
    const singleton = subtags[i].toLowerCase();
    if (seenSingletons.has(singleton)) return true;
    seenSingletons.add(singleton);
    i += 1;
    while (i < subtags.length && /^[A-Za-z0-9]{2,8}$/.test(subtags[i])) i += 1;
  }
  return false;
}
var Language = class {
  /** BCP 47 grammar only. Repeated subtags still pass. */
  static isValid(input) {
    return typeof input === "string" && BCP47_REGEXP.test(input);
  }
  /** Grammar, plus no repeated variant or singleton, plus a lowercase primary. */
  static parse(input) {
    if (typeof input !== "string") return null;
    const parsed = input.match(BCP47_REGEXP);
    if (!parsed?.groups) return null;
    if (hasDuplicateVariantOrSingleton(input, parsed.groups)) return null;
    if (!hasStrictPrimary(parsed.groups)) return null;
    const groups = parsed.groups;
    return {
      grandfathered: groups.grandfathered,
      language: groups.language,
      extlang: groups.extlang,
      script: groups.script,
      region: groups.region,
      variant: groups.variant,
      extension: groups.extension,
      privateUse: groups.privateUseA || groups.privateUseB
    };
  }
};
function decodePointer(value, strict) {
  if (!JSON_POINTER.test(value)) return { ok: false, message: "Invalid JSON pointer." };
  try {
    decodeURIComponent(value);
    return { ok: true, value: { authority: "" } };
  } catch {
    if (!strict) return { ok: true, value: { authority: "" } };
    return { ok: false, message: "Invalid percent-encoding." };
  }
}
function parseAtUri(input, options) {
  const strict = options?.strict !== false;
  if (typeof input !== "string") return { ok: false, message: "AT URI must be a string." };
  if (input.length > AT_URI_MAX) return { ok: false, message: "AT URI exceeds maximum length." };
  if (AT_URI_INVALID_CHAR.test(input)) return { ok: false, message: "Disallowed characters in AT URI." };
  const match = input.match(AT_URI_REGEX);
  const groups = match?.groups;
  if (!groups?.authority) return { ok: false, message: "AT URI does not match the expected format." };
  if (!AtIdentifier.isValid(groups.authority)) return { ok: false, message: "AT URI has an invalid authority." };
  if (groups.collection != null && !Nsid.isValid(groups.collection)) return { ok: false, message: "AT URI has an invalid collection." };
  if (groups.hash != null) {
    const pointer = decodePointer(groups.hash, strict);
    if (!pointer.ok) return { ok: false, message: `AT URI has an invalid fragment (${pointer.message})` };
  }
  if (strict) {
    if (groups.trailingSlash != null) return { ok: false, message: "AT URI cannot have a trailing slash." };
    if (groups.query != null) return { ok: false, message: "AT URI query part is not allowed." };
    if (groups.rkey != null && !RecordKey.isValid(groups.rkey)) return { ok: false, message: "AT URI has an invalid record key." };
  }
  return {
    ok: true,
    value: {
      authority: groups.authority,
      collection: groups.collection,
      rkey: groups.rkey,
      query: groups.query,
      hash: groups.hash
    }
  };
}
var AtUri = class _AtUri {
  authority;
  collection;
  rkey;
  query;
  hash;
  static isValid(input, options) {
    return parseAtUri(input, options).ok;
  }
  static parse(input, options) {
    const result = parseAtUri(input, options);
    if (!result.ok) fail("at-uri", result.message);
    return new _AtUri(result.value);
  }
  /**
   * Repo, collection, and record key split used by deletes and updates.
   * The first slash and the last slash win, including extra path pieces.
   * This is not the strict AT URI grammar.
   */
  static parts(uri) {
    const raw = String(uri || "").replace(/^at:\/\//, "");
    const first = raw.indexOf("/");
    const last = raw.lastIndexOf("/");
    if (first < 0 || last <= first) return null;
    return {
      repo: raw.slice(0, first),
      collection: raw.slice(first + 1, last),
      rkey: raw.slice(last + 1)
    };
  }
  constructor(parts) {
    this.authority = parts.authority;
    this.collection = parts.collection;
    this.rkey = parts.rkey;
    this.query = parts.query;
    this.hash = parts.hash;
  }
  toString() {
    let path = "";
    if (this.collection) path += `/${this.collection}`;
    if (this.rkey) path += `/${this.rkey}`;
    const query = this.query != null ? `?${this.query}` : "";
    const hash = this.hash != null ? `#${this.hash}` : "";
    return `at://${this.authority}${path}${query}${hash}`;
  }
};

// lib/src/data/blob.ts
var RepoBlob = class {
  $type = "blob";
  ref;
  mimeType;
  size;
  constructor(input) {
    const link = typeof input.ref === "string" ? input.ref : input.ref?.$link;
    this.ref = { $link: String(link || "") };
    this.mimeType = input.mimeType;
    if (input.size != null) this.size = input.size;
  }
  toJSON() {
    return {
      $type: this.$type,
      ref: { $link: this.ref.$link },
      mimeType: this.mimeType,
      ...this.size != null ? { size: this.size } : {}
    };
  }
};

// lib/src/data/json.ts
function toJsonValue(value) {
  if (Array.isArray(value)) return value.map((item) => toJsonValue(item));
  if (value && typeof value === "object") {
    const toJSON = value.toJSON;
    const constructor = value.constructor;
    if (typeof toJSON === "function" && constructor !== Object) return toJSON.call(value);
  }
  return value;
}
function jsonOf(value) {
  const out = {};
  for (const [key, item] of Object.entries(value)) {
    if (item === void 0) continue;
    out[key] = toJsonValue(item);
  }
  return out;
}

// lib/src/xrpc/query.ts
function buildQuery(params) {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params || {})) {
    if (value == null || value === "") continue;
    if (Array.isArray(value)) {
      for (const item of value) search.append(key, String(item));
    } else {
      search.set(key, String(value));
    }
  }
  const text = search.toString();
  return text ? `?${text}` : "";
}
function xrpcPath(nsid, params) {
  return `/xrpc/${nsid}${buildQuery(params)}`;
}

// lib/src/xrpc/response.ts
async function readXrpcResponse(res) {
  const text = await res.text();
  let data = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = { message: text.slice(0, 240) };
    }
  }
  if (!res.ok) {
    const body = data && typeof data === "object" ? data : null;
    const message = body?.message || body?.error || `Bluesky request failed (${res.status})`;
    throw new XrpcError(String(message), res.status, data);
  }
  return data ?? {};
}

// lib/src/xrpc/client.ts
var XrpcClient = class {
  service;
  fetchImpl;
  constructor(service, fetchImpl) {
    this.service = service;
    this.fetchImpl = fetchImpl;
  }
  async request(call) {
    if (!Nsid.isValid(call.nsid)) throw new ProtocolError(`Invalid XRPC method: ${call.nsid}`);
    const method = call.method ?? (call.body !== void 0 || call.blob != null ? "POST" : "GET");
    if (method === "WEBSOCKET") throw new ProtocolError(`${call.nsid} is a websocket subscription.`);
    const headers = new Headers(call.headers || {});
    let body;
    if (call.blob != null) {
      if (!headers.has("Content-Type")) {
        const blob = call.blob;
        const type = typeof Blob !== "undefined" && blob instanceof Blob ? blob.type || "application/octet-stream" : "application/octet-stream";
        headers.set("Content-Type", type);
      }
      body = call.blob;
    } else if (call.body !== void 0) {
      if (!headers.has("Content-Type")) headers.set("Content-Type", "application/json");
      body = JSON.stringify(call.body);
    }
    const base = this.service.replace(/\/$/, "");
    const path = xrpcPath(call.nsid, call.params);
    const fetchImpl = this.fetchImpl ?? globalThis.fetch;
    if (typeof fetchImpl !== "function") throw new ProtocolError("fetch is not available.");
    let res;
    try {
      res = await fetchImpl(base + path, { method, headers, body, signal: call.signal });
    } catch (error) {
      throw error;
    }
    if (call.raw) {
      if (!res.ok) return readXrpcResponse(res);
      return res.arrayBuffer();
    }
    return readXrpcResponse(res);
  }
};

// lib/src/xrpc/page.ts
async function paginate(load, options = {}) {
  const maxPages = options.maxPages ?? 40;
  const items = [];
  let cursor;
  for (let page = 0; page < maxPages; page += 1) {
    const next = await load(cursor);
    items.push(...next.items);
    if (!next.cursor || next.cursor === cursor) break;
    cursor = next.cursor;
  }
  return items;
}

// lib/src/identity/did-document.ts
var DidDocument = class {
  alsoKnownAs;
  service;
  constructor(doc) {
    const source = doc || {};
    this.alsoKnownAs = Array.isArray(source.alsoKnownAs) ? source.alsoKnownAs.map((name) => String(name)) : [];
    this.service = Array.isArray(source.service) ? source.service.filter((item) => Boolean(item) && typeof item === "object") : [];
  }
  claimsHandle(handle) {
    const wanted = `at://${handle.toLowerCase()}`;
    return this.alsoKnownAs.some((name) => name.toLowerCase() === wanted);
  }
  pdsEndpoint() {
    const service = this.service.find((item) => item.type === "AtprotoPersonalDataServer" || item.id === "#atproto_pds");
    return typeof service?.serviceEndpoint === "string" ? service.serviceEndpoint : void 0;
  }
};

// lib/src/generated/ids.ts
var PROTOCOL_SOURCE = {
  "repository": "https://github.com/bluesky-social/atproto",
  "revision": "7a467120982d9ff1559afeb3a26989dad5877d17",
  "fetchedAt": "2026-11-09T13:07:59Z"
};
var LEXICON_METHODS = {
  "app.bsky.actor.getPreferences": "GET",
  "app.bsky.actor.getProfile": "GET",
  "app.bsky.actor.getProfiles": "GET",
  "app.bsky.actor.getSuggestions": "GET",
  "app.bsky.actor.putPreferences": "POST",
  "app.bsky.actor.searchActors": "GET",
  "app.bsky.actor.searchActorsTypeahead": "GET",
  "app.bsky.ageassurance.begin": "POST",
  "app.bsky.ageassurance.getConfig": "GET",
  "app.bsky.ageassurance.getState": "GET",
  "app.bsky.bookmark.createBookmark": "POST",
  "app.bsky.bookmark.deleteBookmark": "POST",
  "app.bsky.bookmark.getBookmarks": "GET",
  "app.bsky.contact.dismissMatch": "POST",
  "app.bsky.contact.getMatches": "GET",
  "app.bsky.contact.getSyncStatus": "GET",
  "app.bsky.contact.importContacts": "POST",
  "app.bsky.contact.removeData": "POST",
  "app.bsky.contact.sendNotification": "POST",
  "app.bsky.contact.startPhoneVerification": "POST",
  "app.bsky.contact.verifyPhone": "POST",
  "app.bsky.draft.createDraft": "POST",
  "app.bsky.draft.deleteDraft": "POST",
  "app.bsky.draft.getDrafts": "GET",
  "app.bsky.draft.updateDraft": "POST",
  "app.bsky.embed.getEmbedExternalView": "GET",
  "app.bsky.feed.describeFeedGenerator": "GET",
  "app.bsky.feed.getActorFeeds": "GET",
  "app.bsky.feed.getActorLikes": "GET",
  "app.bsky.feed.getAuthorFeed": "GET",
  "app.bsky.feed.getFeed": "GET",
  "app.bsky.feed.getFeedGenerator": "GET",
  "app.bsky.feed.getFeedGenerators": "GET",
  "app.bsky.feed.getFeedSkeleton": "GET",
  "app.bsky.feed.getLikes": "GET",
  "app.bsky.feed.getListFeed": "GET",
  "app.bsky.feed.getPosts": "GET",
  "app.bsky.feed.getPostThread": "GET",
  "app.bsky.feed.getQuotes": "GET",
  "app.bsky.feed.getRepostedBy": "GET",
  "app.bsky.feed.getSuggestedFeeds": "GET",
  "app.bsky.feed.getTimeline": "GET",
  "app.bsky.feed.searchPosts": "GET",
  "app.bsky.feed.searchPostsV2": "GET",
  "app.bsky.feed.sendInteractions": "POST",
  "app.bsky.graph.getActorStarterPacks": "GET",
  "app.bsky.graph.getBlocks": "GET",
  "app.bsky.graph.getKnownFollowers": "GET",
  "app.bsky.graph.getList": "GET",
  "app.bsky.graph.getListBlocks": "GET",
  "app.bsky.graph.getListMutes": "GET",
  "app.bsky.graph.getLists": "GET",
  "app.bsky.graph.getListsWithMembership": "GET",
  "app.bsky.graph.getMutes": "GET",
  "app.bsky.graph.getRelationships": "GET",
  "app.bsky.graph.getStarterPack": "GET",
  "app.bsky.graph.getStarterPacks": "GET",
  "app.bsky.graph.getStarterPacksWithMembership": "GET",
  "app.bsky.graph.getSuggestedFollowsByActor": "GET",
  "app.bsky.graph.muteActor": "POST",
  "app.bsky.graph.muteActorList": "POST",
  "app.bsky.graph.muteThread": "POST",
  "app.bsky.graph.searchStarterPacks": "GET",
  "app.bsky.graph.searchStarterPacksV2": "GET",
  "app.bsky.graph.unmuteActor": "POST",
  "app.bsky.graph.unmuteActorList": "POST",
  "app.bsky.graph.unmuteThread": "POST",
  "app.bsky.labeler.getServices": "GET",
  "app.bsky.notification.getGroupedNotifications": "GET",
  "app.bsky.notification.getPreferences": "GET",
  "app.bsky.notification.getUnreadCount": "GET",
  "app.bsky.notification.listActivitySubscriptions": "GET",
  "app.bsky.notification.listNotifications": "GET",
  "app.bsky.notification.putActivitySubscription": "POST",
  "app.bsky.notification.putPreferences": "POST",
  "app.bsky.notification.putPreferencesV2": "POST",
  "app.bsky.notification.registerPush": "POST",
  "app.bsky.notification.unregisterPush": "POST",
  "app.bsky.notification.updateSeen": "POST",
  "app.bsky.unspecced.getAgeAssuranceState": "GET",
  "app.bsky.unspecced.getAtmosphereExploreArticleRecommendations": "GET",
  "app.bsky.unspecced.getConfig": "GET",
  "app.bsky.unspecced.getOnboardingSuggestedUsersSkeleton": "GET",
  "app.bsky.unspecced.getPopularFeedGenerators": "GET",
  "app.bsky.unspecced.getPostThreadOtherV2": "GET",
  "app.bsky.unspecced.getPostThreadV2": "GET",
  "app.bsky.unspecced.getSuggestedOnboardingUsers": "GET",
  "app.bsky.unspecced.getSuggestedUsers": "GET",
  "app.bsky.unspecced.getSuggestedUsersForDiscover": "GET",
  "app.bsky.unspecced.getSuggestedUsersForDiscoverSkeleton": "GET",
  "app.bsky.unspecced.getSuggestedUsersForExplore": "GET",
  "app.bsky.unspecced.getSuggestedUsersForExploreSkeleton": "GET",
  "app.bsky.unspecced.getSuggestedUsersForSeeMore": "GET",
  "app.bsky.unspecced.getSuggestedUsersForSeeMoreSkeleton": "GET",
  "app.bsky.unspecced.getSuggestedUsersSkeleton": "GET",
  "app.bsky.unspecced.getSuggestionsSkeleton": "GET",
  "app.bsky.unspecced.getTaggedSuggestions": "GET",
  "app.bsky.unspecced.getTrendingTopics": "GET",
  "app.bsky.unspecced.getTrends": "GET",
  "app.bsky.unspecced.getTrendsSkeleton": "GET",
  "app.bsky.unspecced.initAgeAssurance": "POST",
  "app.bsky.unspecced.searchActorsSkeleton": "GET",
  "app.bsky.unspecced.searchPostsSkeleton": "GET",
  "app.bsky.unspecced.searchStarterPacksSkeleton": "GET",
  "app.bsky.video.abortUpload": "POST",
  "app.bsky.video.finishUpload": "POST",
  "app.bsky.video.getJobStatus": "GET",
  "app.bsky.video.getUploadLimits": "GET",
  "app.bsky.video.getUploadStatus": "GET",
  "app.bsky.video.startUpload": "POST",
  "app.bsky.video.uploadPart": "POST",
  "app.bsky.video.uploadVideo": "POST",
  "chat.bsky.actor.deleteAccount": "POST",
  "chat.bsky.actor.exportAccountData": "GET",
  "chat.bsky.actor.getStatus": "GET",
  "chat.bsky.convo.acceptConvo": "POST",
  "chat.bsky.convo.addReaction": "POST",
  "chat.bsky.convo.deleteMessageForSelf": "POST",
  "chat.bsky.convo.getConvo": "GET",
  "chat.bsky.convo.getConvoAvailability": "GET",
  "chat.bsky.convo.getConvoForMembers": "GET",
  "chat.bsky.convo.getConvoMembers": "GET",
  "chat.bsky.convo.getLog": "GET",
  "chat.bsky.convo.getMessages": "GET",
  "chat.bsky.convo.getUnreadCounts": "GET",
  "chat.bsky.convo.listConvoRequests": "GET",
  "chat.bsky.convo.listConvos": "GET",
  "chat.bsky.convo.lockConvo": "POST",
  "chat.bsky.convo.muteConvo": "POST",
  "chat.bsky.convo.removeReaction": "POST",
  "chat.bsky.convo.sendMessage": "POST",
  "chat.bsky.convo.sendMessageBatch": "POST",
  "chat.bsky.convo.unlockConvo": "POST",
  "chat.bsky.convo.unmuteConvo": "POST",
  "chat.bsky.convo.updateAllRead": "POST",
  "chat.bsky.convo.updateRead": "POST",
  "chat.bsky.group.addMembers": "POST",
  "chat.bsky.group.approveJoinRequest": "POST",
  "chat.bsky.group.createGroup": "POST",
  "chat.bsky.group.createJoinLink": "POST",
  "chat.bsky.group.disableJoinLink": "POST",
  "chat.bsky.group.editGroup": "POST",
  "chat.bsky.group.editJoinLink": "POST",
  "chat.bsky.group.enableJoinLink": "POST",
  "chat.bsky.group.getJoinLinkPreviews": "GET",
  "chat.bsky.group.listJoinRequests": "GET",
  "chat.bsky.group.listMutualGroups": "GET",
  "chat.bsky.group.rejectJoinRequest": "POST",
  "chat.bsky.group.removeMembers": "POST",
  "chat.bsky.group.requestJoin": "POST",
  "chat.bsky.group.updateJoinRequestsRead": "POST",
  "chat.bsky.group.withdrawJoinRequest": "POST",
  "chat.bsky.moderation.getActorMetadata": "GET",
  "chat.bsky.moderation.getConvo": "GET",
  "chat.bsky.moderation.getConvoMembers": "GET",
  "chat.bsky.moderation.getConvos": "GET",
  "chat.bsky.moderation.getMessageContext": "GET",
  "chat.bsky.moderation.subscribeModEvents": "WEBSOCKET",
  "chat.bsky.moderation.updateActorAccess": "POST",
  "chat.bsky.notification.getPreferences": "GET",
  "chat.bsky.notification.putPreferences": "POST",
  "com.atproto.admin.deleteAccount": "POST",
  "com.atproto.admin.disableAccountInvites": "POST",
  "com.atproto.admin.disableInviteCodes": "POST",
  "com.atproto.admin.enableAccountInvites": "POST",
  "com.atproto.admin.getAccountInfo": "GET",
  "com.atproto.admin.getAccountInfos": "GET",
  "com.atproto.admin.getInviteCodes": "GET",
  "com.atproto.admin.getSubjectStatus": "GET",
  "com.atproto.admin.searchAccounts": "GET",
  "com.atproto.admin.sendEmail": "POST",
  "com.atproto.admin.updateAccountEmail": "POST",
  "com.atproto.admin.updateAccountHandle": "POST",
  "com.atproto.admin.updateAccountPassword": "POST",
  "com.atproto.admin.updateAccountSigningKey": "POST",
  "com.atproto.admin.updateSubjectStatus": "POST",
  "com.atproto.identity.getRecommendedDidCredentials": "GET",
  "com.atproto.identity.refreshIdentity": "POST",
  "com.atproto.identity.requestPlcOperationSignature": "POST",
  "com.atproto.identity.resolveDid": "GET",
  "com.atproto.identity.resolveHandle": "GET",
  "com.atproto.identity.resolveIdentity": "GET",
  "com.atproto.identity.signPlcOperation": "POST",
  "com.atproto.identity.submitPlcOperation": "POST",
  "com.atproto.identity.updateHandle": "POST",
  "com.atproto.label.queryLabels": "GET",
  "com.atproto.label.subscribeLabels": "WEBSOCKET",
  "com.atproto.lexicon.resolveLexicon": "GET",
  "com.atproto.moderation.createReport": "POST",
  "com.atproto.repo.applyWrites": "POST",
  "com.atproto.repo.createRecord": "POST",
  "com.atproto.repo.deleteRecord": "POST",
  "com.atproto.repo.describeRepo": "GET",
  "com.atproto.repo.getRecord": "GET",
  "com.atproto.repo.importRepo": "POST",
  "com.atproto.repo.listMissingBlobs": "GET",
  "com.atproto.repo.listRecords": "GET",
  "com.atproto.repo.putRecord": "POST",
  "com.atproto.repo.uploadBlob": "POST",
  "com.atproto.server.activateAccount": "POST",
  "com.atproto.server.checkAccountStatus": "GET",
  "com.atproto.server.confirmEmail": "POST",
  "com.atproto.server.createAccount": "POST",
  "com.atproto.server.createAppPassword": "POST",
  "com.atproto.server.createInviteCode": "POST",
  "com.atproto.server.createInviteCodes": "POST",
  "com.atproto.server.createSession": "POST",
  "com.atproto.server.deactivateAccount": "POST",
  "com.atproto.server.deleteAccount": "POST",
  "com.atproto.server.deleteSession": "POST",
  "com.atproto.server.describeServer": "GET",
  "com.atproto.server.getAccountInviteCodes": "GET",
  "com.atproto.server.getServiceAuth": "GET",
  "com.atproto.server.getSession": "GET",
  "com.atproto.server.listAppPasswords": "GET",
  "com.atproto.server.refreshSession": "POST",
  "com.atproto.server.requestAccountDelete": "POST",
  "com.atproto.server.requestEmailConfirmation": "POST",
  "com.atproto.server.requestEmailUpdate": "POST",
  "com.atproto.server.requestPasswordReset": "POST",
  "com.atproto.server.reserveSigningKey": "POST",
  "com.atproto.server.resetPassword": "POST",
  "com.atproto.server.revokeAppPassword": "POST",
  "com.atproto.server.updateEmail": "POST",
  "com.atproto.sync.getBlob": "GET",
  "com.atproto.sync.getBlocks": "GET",
  "com.atproto.sync.getCheckout": "GET",
  "com.atproto.sync.getHead": "GET",
  "com.atproto.sync.getHostStatus": "GET",
  "com.atproto.sync.getLatestCommit": "GET",
  "com.atproto.sync.getRecord": "GET",
  "com.atproto.sync.getRepo": "GET",
  "com.atproto.sync.getRepoStatus": "GET",
  "com.atproto.sync.listBlobs": "GET",
  "com.atproto.sync.listHosts": "GET",
  "com.atproto.sync.listRepos": "GET",
  "com.atproto.sync.listReposByCollection": "GET",
  "com.atproto.sync.notifyOfUpdate": "POST",
  "com.atproto.sync.requestCrawl": "POST",
  "com.atproto.sync.subscribeRepos": "WEBSOCKET",
  "com.atproto.temp.addReservedHandle": "POST",
  "com.atproto.temp.checkHandleAvailability": "GET",
  "com.atproto.temp.checkSignupQueue": "GET",
  "com.atproto.temp.dereferenceScope": "GET",
  "com.atproto.temp.fetchLabels": "GET",
  "com.atproto.temp.requestPhoneVerification": "POST",
  "com.atproto.temp.revokeAccountCredentials": "POST"
};
function lexiconHttpMethod(nsid) {
  return LEXICON_METHODS[nsid];
}
var ns = {
  app: {
    bsky: {
      actor: {
        contentVisibilityDeclaration: "app.bsky.actor.contentVisibilityDeclaration",
        defs: "app.bsky.actor.defs",
        getPreferences: "app.bsky.actor.getPreferences",
        getProfile: "app.bsky.actor.getProfile",
        getProfiles: "app.bsky.actor.getProfiles",
        getSuggestions: "app.bsky.actor.getSuggestions",
        link: "app.bsky.actor.link",
        profile: "app.bsky.actor.profile",
        putPreferences: "app.bsky.actor.putPreferences",
        searchActors: "app.bsky.actor.searchActors",
        searchActorsTypeahead: "app.bsky.actor.searchActorsTypeahead",
        status: "app.bsky.actor.status"
      },
      ageassurance: {
        begin: "app.bsky.ageassurance.begin",
        defs: "app.bsky.ageassurance.defs",
        getConfig: "app.bsky.ageassurance.getConfig",
        getState: "app.bsky.ageassurance.getState"
      },
      authCreatePosts: "app.bsky.authCreatePosts",
      authDeleteContent: "app.bsky.authDeleteContent",
      authManageFeedDeclarations: "app.bsky.authManageFeedDeclarations",
      authManageLabelerService: "app.bsky.authManageLabelerService",
      authManageModeration: "app.bsky.authManageModeration",
      authManageNotifications: "app.bsky.authManageNotifications",
      authManageProfile: "app.bsky.authManageProfile",
      authViewAll: "app.bsky.authViewAll",
      bookmark: {
        createBookmark: "app.bsky.bookmark.createBookmark",
        defs: "app.bsky.bookmark.defs",
        deleteBookmark: "app.bsky.bookmark.deleteBookmark",
        getBookmarks: "app.bsky.bookmark.getBookmarks"
      },
      contact: {
        defs: "app.bsky.contact.defs",
        dismissMatch: "app.bsky.contact.dismissMatch",
        getMatches: "app.bsky.contact.getMatches",
        getSyncStatus: "app.bsky.contact.getSyncStatus",
        importContacts: "app.bsky.contact.importContacts",
        removeData: "app.bsky.contact.removeData",
        sendNotification: "app.bsky.contact.sendNotification",
        startPhoneVerification: "app.bsky.contact.startPhoneVerification",
        verifyPhone: "app.bsky.contact.verifyPhone"
      },
      draft: {
        createDraft: "app.bsky.draft.createDraft",
        defs: "app.bsky.draft.defs",
        deleteDraft: "app.bsky.draft.deleteDraft",
        getDrafts: "app.bsky.draft.getDrafts",
        updateDraft: "app.bsky.draft.updateDraft"
      },
      embed: {
        defs: "app.bsky.embed.defs",
        external: "app.bsky.embed.external",
        gallery: "app.bsky.embed.gallery",
        getEmbedExternalView: "app.bsky.embed.getEmbedExternalView",
        images: "app.bsky.embed.images",
        record: "app.bsky.embed.record",
        recordWithMedia: "app.bsky.embed.recordWithMedia",
        video: "app.bsky.embed.video"
      },
      feed: {
        defs: "app.bsky.feed.defs",
        describeFeedGenerator: "app.bsky.feed.describeFeedGenerator",
        generator: "app.bsky.feed.generator",
        getActorFeeds: "app.bsky.feed.getActorFeeds",
        getActorLikes: "app.bsky.feed.getActorLikes",
        getAuthorFeed: "app.bsky.feed.getAuthorFeed",
        getFeed: "app.bsky.feed.getFeed",
        getFeedGenerator: "app.bsky.feed.getFeedGenerator",
        getFeedGenerators: "app.bsky.feed.getFeedGenerators",
        getFeedSkeleton: "app.bsky.feed.getFeedSkeleton",
        getLikes: "app.bsky.feed.getLikes",
        getListFeed: "app.bsky.feed.getListFeed",
        getPostThread: "app.bsky.feed.getPostThread",
        getPosts: "app.bsky.feed.getPosts",
        getQuotes: "app.bsky.feed.getQuotes",
        getRepostedBy: "app.bsky.feed.getRepostedBy",
        getSuggestedFeeds: "app.bsky.feed.getSuggestedFeeds",
        getTimeline: "app.bsky.feed.getTimeline",
        like: "app.bsky.feed.like",
        post: "app.bsky.feed.post",
        postgate: "app.bsky.feed.postgate",
        repost: "app.bsky.feed.repost",
        searchPosts: "app.bsky.feed.searchPosts",
        searchPostsV2: "app.bsky.feed.searchPostsV2",
        sendInteractions: "app.bsky.feed.sendInteractions",
        threadgate: "app.bsky.feed.threadgate"
      },
      graph: {
        block: "app.bsky.graph.block",
        defs: "app.bsky.graph.defs",
        follow: "app.bsky.graph.follow",
        getActorStarterPacks: "app.bsky.graph.getActorStarterPacks",
        getBlocks: "app.bsky.graph.getBlocks",
        getKnownFollowers: "app.bsky.graph.getKnownFollowers",
        getList: "app.bsky.graph.getList",
        getListBlocks: "app.bsky.graph.getListBlocks",
        getListMutes: "app.bsky.graph.getListMutes",
        getLists: "app.bsky.graph.getLists",
        getListsWithMembership: "app.bsky.graph.getListsWithMembership",
        getMutes: "app.bsky.graph.getMutes",
        getRelationships: "app.bsky.graph.getRelationships",
        getStarterPack: "app.bsky.graph.getStarterPack",
        getStarterPacks: "app.bsky.graph.getStarterPacks",
        getStarterPacksWithMembership: "app.bsky.graph.getStarterPacksWithMembership",
        getSuggestedFollowsByActor: "app.bsky.graph.getSuggestedFollowsByActor",
        list: "app.bsky.graph.list",
        listblock: "app.bsky.graph.listblock",
        listitem: "app.bsky.graph.listitem",
        muteActor: "app.bsky.graph.muteActor",
        muteActorList: "app.bsky.graph.muteActorList",
        muteThread: "app.bsky.graph.muteThread",
        referencelistoptout: "app.bsky.graph.referencelistoptout",
        searchStarterPacks: "app.bsky.graph.searchStarterPacks",
        searchStarterPacksV2: "app.bsky.graph.searchStarterPacksV2",
        starterpack: "app.bsky.graph.starterpack",
        unmuteActor: "app.bsky.graph.unmuteActor",
        unmuteActorList: "app.bsky.graph.unmuteActorList",
        unmuteThread: "app.bsky.graph.unmuteThread",
        verification: "app.bsky.graph.verification"
      },
      labeler: {
        defs: "app.bsky.labeler.defs",
        getServices: "app.bsky.labeler.getServices",
        service: "app.bsky.labeler.service"
      },
      notification: {
        declaration: "app.bsky.notification.declaration",
        defs: "app.bsky.notification.defs",
        getGroupedNotifications: "app.bsky.notification.getGroupedNotifications",
        getPreferences: "app.bsky.notification.getPreferences",
        getUnreadCount: "app.bsky.notification.getUnreadCount",
        listActivitySubscriptions: "app.bsky.notification.listActivitySubscriptions",
        listNotifications: "app.bsky.notification.listNotifications",
        putActivitySubscription: "app.bsky.notification.putActivitySubscription",
        putPreferences: "app.bsky.notification.putPreferences",
        putPreferencesV2: "app.bsky.notification.putPreferencesV2",
        registerPush: "app.bsky.notification.registerPush",
        unregisterPush: "app.bsky.notification.unregisterPush",
        updateSeen: "app.bsky.notification.updateSeen"
      },
      richtext: {
        facet: "app.bsky.richtext.facet"
      },
      unspecced: {
        defs: "app.bsky.unspecced.defs",
        getAgeAssuranceState: "app.bsky.unspecced.getAgeAssuranceState",
        getAtmosphereExploreArticleRecommendations: "app.bsky.unspecced.getAtmosphereExploreArticleRecommendations",
        getConfig: "app.bsky.unspecced.getConfig",
        getOnboardingSuggestedUsersSkeleton: "app.bsky.unspecced.getOnboardingSuggestedUsersSkeleton",
        getPopularFeedGenerators: "app.bsky.unspecced.getPopularFeedGenerators",
        getPostThreadOtherV2: "app.bsky.unspecced.getPostThreadOtherV2",
        getPostThreadV2: "app.bsky.unspecced.getPostThreadV2",
        getSuggestedOnboardingUsers: "app.bsky.unspecced.getSuggestedOnboardingUsers",
        getSuggestedUsers: "app.bsky.unspecced.getSuggestedUsers",
        getSuggestedUsersForDiscover: "app.bsky.unspecced.getSuggestedUsersForDiscover",
        getSuggestedUsersForDiscoverSkeleton: "app.bsky.unspecced.getSuggestedUsersForDiscoverSkeleton",
        getSuggestedUsersForExplore: "app.bsky.unspecced.getSuggestedUsersForExplore",
        getSuggestedUsersForExploreSkeleton: "app.bsky.unspecced.getSuggestedUsersForExploreSkeleton",
        getSuggestedUsersForSeeMore: "app.bsky.unspecced.getSuggestedUsersForSeeMore",
        getSuggestedUsersForSeeMoreSkeleton: "app.bsky.unspecced.getSuggestedUsersForSeeMoreSkeleton",
        getSuggestedUsersSkeleton: "app.bsky.unspecced.getSuggestedUsersSkeleton",
        getSuggestionsSkeleton: "app.bsky.unspecced.getSuggestionsSkeleton",
        getTaggedSuggestions: "app.bsky.unspecced.getTaggedSuggestions",
        getTrendingTopics: "app.bsky.unspecced.getTrendingTopics",
        getTrends: "app.bsky.unspecced.getTrends",
        getTrendsSkeleton: "app.bsky.unspecced.getTrendsSkeleton",
        initAgeAssurance: "app.bsky.unspecced.initAgeAssurance",
        searchActorsSkeleton: "app.bsky.unspecced.searchActorsSkeleton",
        searchPostsSkeleton: "app.bsky.unspecced.searchPostsSkeleton",
        searchStarterPacksSkeleton: "app.bsky.unspecced.searchStarterPacksSkeleton"
      },
      video: {
        abortUpload: "app.bsky.video.abortUpload",
        defs: "app.bsky.video.defs",
        finishUpload: "app.bsky.video.finishUpload",
        getJobStatus: "app.bsky.video.getJobStatus",
        getUploadLimits: "app.bsky.video.getUploadLimits",
        getUploadStatus: "app.bsky.video.getUploadStatus",
        startUpload: "app.bsky.video.startUpload",
        uploadPart: "app.bsky.video.uploadPart",
        uploadVideo: "app.bsky.video.uploadVideo"
      }
    }
  },
  chat: {
    bsky: {
      actor: {
        declaration: "chat.bsky.actor.declaration",
        defs: "chat.bsky.actor.defs",
        deleteAccount: "chat.bsky.actor.deleteAccount",
        exportAccountData: "chat.bsky.actor.exportAccountData",
        getStatus: "chat.bsky.actor.getStatus"
      },
      convo: {
        acceptConvo: "chat.bsky.convo.acceptConvo",
        addReaction: "chat.bsky.convo.addReaction",
        defs: "chat.bsky.convo.defs",
        deleteMessageForSelf: "chat.bsky.convo.deleteMessageForSelf",
        getConvo: "chat.bsky.convo.getConvo",
        getConvoAvailability: "chat.bsky.convo.getConvoAvailability",
        getConvoForMembers: "chat.bsky.convo.getConvoForMembers",
        getConvoMembers: "chat.bsky.convo.getConvoMembers",
        getLog: "chat.bsky.convo.getLog",
        getMessages: "chat.bsky.convo.getMessages",
        getUnreadCounts: "chat.bsky.convo.getUnreadCounts",
        listConvoRequests: "chat.bsky.convo.listConvoRequests",
        listConvos: "chat.bsky.convo.listConvos",
        lockConvo: "chat.bsky.convo.lockConvo",
        muteConvo: "chat.bsky.convo.muteConvo",
        removeReaction: "chat.bsky.convo.removeReaction",
        sendMessage: "chat.bsky.convo.sendMessage",
        sendMessageBatch: "chat.bsky.convo.sendMessageBatch",
        unlockConvo: "chat.bsky.convo.unlockConvo",
        unmuteConvo: "chat.bsky.convo.unmuteConvo",
        updateAllRead: "chat.bsky.convo.updateAllRead",
        updateRead: "chat.bsky.convo.updateRead"
      },
      embed: {
        joinLink: "chat.bsky.embed.joinLink"
      },
      group: {
        addMembers: "chat.bsky.group.addMembers",
        approveJoinRequest: "chat.bsky.group.approveJoinRequest",
        createGroup: "chat.bsky.group.createGroup",
        createJoinLink: "chat.bsky.group.createJoinLink",
        defs: "chat.bsky.group.defs",
        disableJoinLink: "chat.bsky.group.disableJoinLink",
        editGroup: "chat.bsky.group.editGroup",
        editJoinLink: "chat.bsky.group.editJoinLink",
        enableJoinLink: "chat.bsky.group.enableJoinLink",
        getJoinLinkPreviews: "chat.bsky.group.getJoinLinkPreviews",
        listJoinRequests: "chat.bsky.group.listJoinRequests",
        listMutualGroups: "chat.bsky.group.listMutualGroups",
        rejectJoinRequest: "chat.bsky.group.rejectJoinRequest",
        removeMembers: "chat.bsky.group.removeMembers",
        requestJoin: "chat.bsky.group.requestJoin",
        updateJoinRequestsRead: "chat.bsky.group.updateJoinRequestsRead",
        withdrawJoinRequest: "chat.bsky.group.withdrawJoinRequest"
      },
      moderation: {
        defs: "chat.bsky.moderation.defs",
        getActorMetadata: "chat.bsky.moderation.getActorMetadata",
        getConvo: "chat.bsky.moderation.getConvo",
        getConvoMembers: "chat.bsky.moderation.getConvoMembers",
        getConvos: "chat.bsky.moderation.getConvos",
        getMessageContext: "chat.bsky.moderation.getMessageContext",
        subscribeModEvents: "chat.bsky.moderation.subscribeModEvents",
        updateActorAccess: "chat.bsky.moderation.updateActorAccess"
      },
      notification: {
        defs: "chat.bsky.notification.defs",
        getPreferences: "chat.bsky.notification.getPreferences",
        putPreferences: "chat.bsky.notification.putPreferences"
      }
    }
  },
  com: {
    atproto: {
      admin: {
        defs: "com.atproto.admin.defs",
        deleteAccount: "com.atproto.admin.deleteAccount",
        disableAccountInvites: "com.atproto.admin.disableAccountInvites",
        disableInviteCodes: "com.atproto.admin.disableInviteCodes",
        enableAccountInvites: "com.atproto.admin.enableAccountInvites",
        getAccountInfo: "com.atproto.admin.getAccountInfo",
        getAccountInfos: "com.atproto.admin.getAccountInfos",
        getInviteCodes: "com.atproto.admin.getInviteCodes",
        getSubjectStatus: "com.atproto.admin.getSubjectStatus",
        searchAccounts: "com.atproto.admin.searchAccounts",
        sendEmail: "com.atproto.admin.sendEmail",
        updateAccountEmail: "com.atproto.admin.updateAccountEmail",
        updateAccountHandle: "com.atproto.admin.updateAccountHandle",
        updateAccountPassword: "com.atproto.admin.updateAccountPassword",
        updateAccountSigningKey: "com.atproto.admin.updateAccountSigningKey",
        updateSubjectStatus: "com.atproto.admin.updateSubjectStatus"
      },
      identity: {
        defs: "com.atproto.identity.defs",
        getRecommendedDidCredentials: "com.atproto.identity.getRecommendedDidCredentials",
        refreshIdentity: "com.atproto.identity.refreshIdentity",
        requestPlcOperationSignature: "com.atproto.identity.requestPlcOperationSignature",
        resolveDid: "com.atproto.identity.resolveDid",
        resolveHandle: "com.atproto.identity.resolveHandle",
        resolveIdentity: "com.atproto.identity.resolveIdentity",
        signPlcOperation: "com.atproto.identity.signPlcOperation",
        submitPlcOperation: "com.atproto.identity.submitPlcOperation",
        updateHandle: "com.atproto.identity.updateHandle"
      },
      label: {
        defs: "com.atproto.label.defs",
        queryLabels: "com.atproto.label.queryLabels",
        record: "com.atproto.label.record",
        subscribeLabels: "com.atproto.label.subscribeLabels"
      },
      lexicon: {
        resolveLexicon: "com.atproto.lexicon.resolveLexicon",
        schema: "com.atproto.lexicon.schema"
      },
      moderation: {
        createReport: "com.atproto.moderation.createReport",
        defs: "com.atproto.moderation.defs"
      },
      repo: {
        applyWrites: "com.atproto.repo.applyWrites",
        createRecord: "com.atproto.repo.createRecord",
        defs: "com.atproto.repo.defs",
        deleteRecord: "com.atproto.repo.deleteRecord",
        describeRepo: "com.atproto.repo.describeRepo",
        getRecord: "com.atproto.repo.getRecord",
        importRepo: "com.atproto.repo.importRepo",
        listMissingBlobs: "com.atproto.repo.listMissingBlobs",
        listRecords: "com.atproto.repo.listRecords",
        putRecord: "com.atproto.repo.putRecord",
        strongRef: "com.atproto.repo.strongRef",
        uploadBlob: "com.atproto.repo.uploadBlob"
      },
      server: {
        activateAccount: "com.atproto.server.activateAccount",
        checkAccountStatus: "com.atproto.server.checkAccountStatus",
        confirmEmail: "com.atproto.server.confirmEmail",
        createAccount: "com.atproto.server.createAccount",
        createAppPassword: "com.atproto.server.createAppPassword",
        createInviteCode: "com.atproto.server.createInviteCode",
        createInviteCodes: "com.atproto.server.createInviteCodes",
        createSession: "com.atproto.server.createSession",
        deactivateAccount: "com.atproto.server.deactivateAccount",
        defs: "com.atproto.server.defs",
        deleteAccount: "com.atproto.server.deleteAccount",
        deleteSession: "com.atproto.server.deleteSession",
        describeServer: "com.atproto.server.describeServer",
        getAccountInviteCodes: "com.atproto.server.getAccountInviteCodes",
        getServiceAuth: "com.atproto.server.getServiceAuth",
        getSession: "com.atproto.server.getSession",
        listAppPasswords: "com.atproto.server.listAppPasswords",
        refreshSession: "com.atproto.server.refreshSession",
        requestAccountDelete: "com.atproto.server.requestAccountDelete",
        requestEmailConfirmation: "com.atproto.server.requestEmailConfirmation",
        requestEmailUpdate: "com.atproto.server.requestEmailUpdate",
        requestPasswordReset: "com.atproto.server.requestPasswordReset",
        reserveSigningKey: "com.atproto.server.reserveSigningKey",
        resetPassword: "com.atproto.server.resetPassword",
        revokeAppPassword: "com.atproto.server.revokeAppPassword",
        updateEmail: "com.atproto.server.updateEmail"
      },
      sync: {
        defs: "com.atproto.sync.defs",
        getBlob: "com.atproto.sync.getBlob",
        getBlocks: "com.atproto.sync.getBlocks",
        getCheckout: "com.atproto.sync.getCheckout",
        getHead: "com.atproto.sync.getHead",
        getHostStatus: "com.atproto.sync.getHostStatus",
        getLatestCommit: "com.atproto.sync.getLatestCommit",
        getRecord: "com.atproto.sync.getRecord",
        getRepo: "com.atproto.sync.getRepo",
        getRepoStatus: "com.atproto.sync.getRepoStatus",
        listBlobs: "com.atproto.sync.listBlobs",
        listHosts: "com.atproto.sync.listHosts",
        listRepos: "com.atproto.sync.listRepos",
        listReposByCollection: "com.atproto.sync.listReposByCollection",
        notifyOfUpdate: "com.atproto.sync.notifyOfUpdate",
        requestCrawl: "com.atproto.sync.requestCrawl",
        subscribeRepos: "com.atproto.sync.subscribeRepos"
      },
      temp: {
        addReservedHandle: "com.atproto.temp.addReservedHandle",
        checkHandleAvailability: "com.atproto.temp.checkHandleAvailability",
        checkSignupQueue: "com.atproto.temp.checkSignupQueue",
        dereferenceScope: "com.atproto.temp.dereferenceScope",
        fetchLabels: "com.atproto.temp.fetchLabels",
        requestPhoneVerification: "com.atproto.temp.requestPhoneVerification",
        revokeAccountCredentials: "com.atproto.temp.revokeAccountCredentials"
      }
    }
  }
};

// lib/src/lexicon/document.ts
var LexiconDocument = class _LexiconDocument {
  id;
  description;
  defs;
  static parse(input) {
    if (!input || typeof input !== "object" || Array.isArray(input)) {
      throw new ValidationError([{ path: "", message: "Lexicon must be an object." }]);
    }
    const doc = input;
    if (doc.lexicon !== 1) {
      throw new ValidationError([{ path: "lexicon", message: "Only lexicon version 1 is supported." }]);
    }
    if (typeof doc.id !== "string" || !Nsid.isValid(doc.id)) {
      throw new ValidationError([{ path: "id", message: "Lexicon id must be an NSID." }]);
    }
    if (!doc.defs || typeof doc.defs !== "object" || Array.isArray(doc.defs)) {
      throw new ValidationError([{ path: "defs", message: "Lexicon defs must be an object." }]);
    }
    return new _LexiconDocument(doc);
  }
  constructor(raw) {
    this.id = raw.id;
    this.description = raw.description;
    this.defs = raw.defs;
  }
  def(name = "main") {
    return this.defs[name];
  }
  httpMethod() {
    const type = this.defs.main?.type;
    if (type === "query") return "GET";
    if (type === "procedure") return "POST";
    if (type === "subscription") return "WEBSOCKET";
    return void 0;
  }
};
var LexiconRegistry = class {
  docs = /* @__PURE__ */ new Map();
  register(doc) {
    this.docs.set(doc.id, doc);
  }
  get(nsid) {
    return this.docs.get(nsid);
  }
  ids() {
    return [...this.docs.keys()].sort();
  }
  /** A registered document wins over the compiled method map. */
  httpMethod(nsid) {
    return this.docs.get(nsid)?.httpMethod() ?? lexiconHttpMethod(nsid);
  }
};
function installCatalog(docs, registry) {
  for (const doc of docs) registry.register(LexiconDocument.parse(doc));
  return registry;
}

// lib/src/lexicon/validate.ts
var MAX_DEPTH = 32;
function joinPath(path, key) {
  return path ? `${path}/${key}` : key;
}
function parseRef(ref, owner) {
  let nsid = owner;
  let def = "main";
  if (ref.startsWith("#")) {
    def = ref.slice(1) || "main";
  } else if (ref.includes("#")) {
    const [id2, name] = ref.split("#");
    nsid = id2;
    def = name || "main";
  } else {
    nsid = ref;
    def = "main";
  }
  const id = def === "main" ? nsid : `${nsid}#${def}`;
  return { nsid, def, id };
}
function graphemeCount(value) {
  const segmenter = new Intl.Segmenter(void 0, { granularity: "grapheme" });
  let count = 0;
  for (const _segment of segmenter.segment(value)) count += 1;
  return count;
}
var FORMATS = {
  did: (value) => Did.isValid(value),
  handle: (value) => Handle.isValid(value),
  nsid: (value) => Nsid.isValid(value),
  tid: (value) => Tid.isValid(value),
  "record-key": (value) => RecordKey.isValid(value),
  datetime: (value) => AtDatetime.isValid(value),
  language: (value) => Language.isValid(value),
  cid: (value) => Cid.isValid(value),
  uri: (value) => Uri.isValid(value),
  "at-uri": (value) => AtUri.isValid(value),
  "at-identifier": (value) => AtIdentifier.isValid(value)
};
function checkSchema(registry, schema, value, owner, path, issues, depth) {
  if (depth > MAX_DEPTH) {
    issues.push({ path, message: "Schema is nested too deeply." });
    return;
  }
  const type = schema?.type;
  if (type === "unknown") return;
  if (type === "ref" && typeof schema.ref === "string") {
    checkRef(registry, schema.ref, value, owner, path, issues, depth + 1);
    return;
  }
  if (type === "union") {
    checkUnion(registry, schema, value, owner, path, issues, depth + 1);
    return;
  }
  if (type === "array") {
    if (!Array.isArray(value)) {
      issues.push({ path, message: "Expected an array." });
      return;
    }
    if (schema.minLength != null && value.length < schema.minLength) {
      issues.push({ path, message: `Must contain at least ${schema.minLength} items.` });
    }
    if (schema.maxLength != null && value.length > schema.maxLength) {
      issues.push({ path, message: `Must contain at most ${schema.maxLength} items.` });
    }
    if (schema.items) {
      value.forEach((item, index) => {
        checkSchema(registry, schema.items, item, owner, joinPath(path, String(index)), issues, depth + 1);
      });
    }
    return;
  }
  if (type === "object" || type === "params") {
    checkObject(registry, schema, value, owner, path, issues, depth + 1);
    return;
  }
  if (type === "string") {
    checkString(schema, value, path, issues);
    return;
  }
  if (type === "integer") {
    if (typeof value !== "number" || !Number.isInteger(value)) {
      issues.push({ path, message: "Expected an integer." });
      return;
    }
    if (schema.minimum != null && value < schema.minimum) issues.push({ path, message: `Must be at least ${schema.minimum}.` });
    if (schema.maximum != null && value > schema.maximum) issues.push({ path, message: `Must be at most ${schema.maximum}.` });
    return;
  }
  if (type === "boolean") {
    if (typeof value !== "boolean") {
      issues.push({ path, message: "Expected a boolean." });
      return;
    }
    if (schema.const === true && value !== true) issues.push({ path, message: "Must be true." });
    return;
  }
  if (type === "blob") {
    checkBlob(schema, value, path, issues);
    return;
  }
  if (type === "bytes") {
    if (!value || typeof value !== "object" || typeof value.$bytes !== "string") {
      issues.push({ path, message: "Expected bytes." });
    }
    return;
  }
  if (type === "cid-link") {
    if (!value || typeof value !== "object" || typeof value.$link !== "string") {
      issues.push({ path, message: "Expected a CID link." });
    }
    return;
  }
  issues.push({ path, message: `Unsupported schema type ${String(type)}.` });
}
function checkString(schema, value, path, issues) {
  if (typeof value !== "string") {
    issues.push({ path, message: "Expected a string." });
    return;
  }
  if (schema.minLength != null && value.length < schema.minLength) {
    issues.push({ path, message: `Must be at least ${schema.minLength} characters.` });
  }
  if (schema.maxLength != null && value.length > schema.maxLength) {
    issues.push({ path, message: `Must be at most ${schema.maxLength} characters.` });
  }
  if (schema.minGraphemes != null || schema.maxGraphemes != null) {
    const count = graphemeCount(value);
    if (schema.minGraphemes != null && count < schema.minGraphemes) {
      issues.push({ path, message: `Must be at least ${schema.minGraphemes} characters.` });
    }
    if (schema.maxGraphemes != null && count > schema.maxGraphemes) {
      issues.push({ path, message: `Must be at most ${schema.maxGraphemes} characters.` });
    }
  }
  if (schema.format) {
    const check = FORMATS[schema.format];
    if (check && !check(value)) issues.push({ path, message: `Must be a valid ${schema.format}.` });
  }
}
function checkObject(registry, schema, value, owner, path, issues, depth) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    issues.push({ path, message: "Expected an object." });
    return;
  }
  const record = value;
  const required = schema.required || [];
  const nullable = new Set(schema.nullable || []);
  const properties = schema.properties || {};
  for (const key of required) {
    const present = record[key];
    if (present === void 0 || present === null && !nullable.has(key)) {
      issues.push({ path: joinPath(path, key), message: "Required." });
    }
  }
  for (const [key, prop] of Object.entries(properties)) {
    if (!(key in record) || record[key] === void 0) continue;
    if (record[key] === null) {
      if (!nullable.has(key)) issues.push({ path: joinPath(path, key), message: "Must not be null." });
      continue;
    }
    checkSchema(registry, prop, record[key], owner, joinPath(path, key), issues, depth);
  }
}
function checkUnion(registry, schema, value, owner, path, issues, depth) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    issues.push({ path, message: "Expected an object." });
    return;
  }
  const type = value.$type;
  const refs = schema.refs || [];
  let matched;
  if (typeof type === "string") {
    matched = refs.find((ref) => parseRef(ref, owner).id === type);
  }
  if (!matched) {
    if (schema.closed) issues.push({ path: joinPath(path, "$type"), message: "Unknown union type." });
    return;
  }
  checkRef(registry, matched, value, owner, path, issues, depth);
}
function checkRef(registry, ref, value, owner, path, issues, depth) {
  const target = parseRef(ref, owner);
  const doc = registry.get(target.nsid);
  const def = doc?.def(target.def);
  if (!doc || !def) {
    issues.push({ path, message: `Unknown reference ${target.id}.` });
    return;
  }
  checkDef(registry, def, value, target.nsid, target.def, path, issues, depth, false);
}
function checkBlob(schema, value, path, issues) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    issues.push({ path, message: "Expected a blob." });
    return;
  }
  const blob = value;
  if (!blob.ref || typeof blob.ref !== "object" || typeof blob.ref.$link !== "string" || !blob.ref.$link) {
    issues.push({ path: joinPath(path, "ref"), message: "Expected a blob ref." });
  }
  if (typeof blob.mimeType !== "string" || !blob.mimeType) {
    issues.push({ path: joinPath(path, "mimeType"), message: "Expected a mime type." });
  }
  if (blob.size != null && (typeof blob.size !== "number" || !Number.isInteger(blob.size) || blob.size < 0)) {
    issues.push({ path: joinPath(path, "size"), message: "Expected a blob size." });
  }
  const maxSize = schema.maxSize;
  if (typeof maxSize === "number" && typeof blob.size === "number" && blob.size > maxSize) {
    issues.push({ path: joinPath(path, "size"), message: `Must be at most ${maxSize} bytes.` });
  }
}
function checkDef(registry, def, value, nsid, defName, path, issues, depth, top) {
  if (def.type === "record") {
    if (top && value && typeof value === "object" && !Array.isArray(value)) {
      const typed = value.$type;
      if (typeof typed === "string" && typed !== nsid) {
        issues.push({ path: joinPath(path, "$type"), message: `Expected ${nsid}.` });
      }
    }
    if (def.record) checkSchema(registry, def.record, value, nsid, path, issues, depth);
    else issues.push({ path, message: "Record schema is missing." });
    return;
  }
  if (def.type === "object") {
    if (value && typeof value === "object" && !Array.isArray(value)) {
      const typed = value.$type;
      const expected = defName === "main" ? nsid : `${nsid}#${defName}`;
      if (typeof typed === "string" && typed !== expected) {
        issues.push({ path: joinPath(path, "$type"), message: `Expected ${expected}.` });
      }
    }
    checkSchema(registry, def, value, nsid, path, issues, depth);
    return;
  }
  if (def.type === "query" || def.type === "subscription") {
    if (def.parameters) checkSchema(registry, def.parameters, value, nsid, path, issues, depth);
    return;
  }
  if (def.type === "procedure") {
    if (def.input?.schema) checkSchema(registry, def.input.schema, value, nsid, path, issues, depth);
    return;
  }
  if (def.type === "string" || def.type === "array" || def.type === "boolean" || def.type === "integer") {
    checkSchema(registry, def, value, nsid, path, issues, depth);
    return;
  }
  if (def.type === "token") {
    const expected = defName === "main" ? nsid : `${nsid}#${defName}`;
    if (value !== expected) issues.push({ path, message: `Expected ${expected}.` });
    return;
  }
  issues.push({ path, message: `Cannot validate ${def.type || "definition"}.` });
}
function validate(registry, value, nsid, defName = "main") {
  const doc = registry.get(nsid);
  if (!doc) throw new ValidationError([{ path: "", message: `Unknown lexicon ${nsid}.` }]);
  const def = doc.def(defName);
  if (!def) throw new ValidationError([{ path: "", message: `Unknown definition ${nsid}#${defName}.` }]);
  const issues = [];
  checkDef(registry, def, value, nsid, defName, "", issues, 0, true);
  if (issues.length) throw new ValidationError(issues);
}

// lib/src/agent.ts
var BskyAgent = class {
  client;
  registry;
  constructor(options) {
    this.client = new XrpcClient(options.service, options.fetch);
    this.registry = options.registry ?? new LexiconRegistry();
  }
  async call(nsid, options = {}) {
    const listed = this.registry.httpMethod(nsid);
    if (listed === "WEBSOCKET") throw new ProtocolError(`${nsid} is a websocket subscription.`);
    const method = options.method || listed || (options.body !== void 0 || options.blob != null ? "POST" : "GET");
    const request = {
      nsid,
      method,
      params: options.params,
      body: options.body,
      blob: options.blob,
      headers: options.headers,
      signal: options.signal,
      raw: options.raw
    };
    return this.client.request(request);
  }
};

// lib/src/records.ts
function issuesOf(pairs) {
  const issues = pairs.filter(([, value]) => value == null).map(([path]) => ({ path, message: "Required." }));
  if (issues.length) throw new ValidationError(issues);
}
var StrongRef = class {
  uri;
  cid;
  constructor(input = {}) {
    this.uri = input.uri;
    this.cid = input.cid;
  }
  check() {
    issuesOf([["uri", this.uri], ["cid", this.cid]]);
  }
  toJSON() {
    return { uri: this.uri, cid: this.cid };
  }
};
var TypedStrongRef = class {
  $type = "com.atproto.repo.strongRef";
  uri;
  cid;
  constructor(input = {}) {
    this.uri = input.uri;
    this.cid = input.cid;
  }
  toJSON() {
    return { $type: this.$type, uri: this.uri, cid: this.cid };
  }
};
var RepoRef = class {
  $type = "com.atproto.admin.defs#repoRef";
  did;
  constructor(did) {
    this.did = did;
  }
  toJSON() {
    return { $type: this.$type, did: this.did };
  }
};
var LikeRecord = class {
  $type = "app.bsky.feed.like";
  uri;
  cid;
  createdAt;
  constructor(input = {}) {
    this.uri = input.subject?.uri ?? input.uri;
    this.cid = input.subject?.cid ?? input.cid;
    this.createdAt = input.createdAt || (/* @__PURE__ */ new Date()).toISOString();
  }
  check() {
    issuesOf([["subject/uri", this.uri], ["subject/cid", this.cid], ["createdAt", this.createdAt]]);
  }
  toJSON() {
    return {
      $type: this.$type,
      subject: { uri: this.uri, cid: this.cid },
      createdAt: this.createdAt
    };
  }
};
var RepostRecord = class {
  $type = "app.bsky.feed.repost";
  uri;
  cid;
  createdAt;
  constructor(input = {}) {
    this.uri = input.subject?.uri ?? input.uri;
    this.cid = input.subject?.cid ?? input.cid;
    this.createdAt = input.createdAt || (/* @__PURE__ */ new Date()).toISOString();
  }
  check() {
    issuesOf([["subject/uri", this.uri], ["subject/cid", this.cid], ["createdAt", this.createdAt]]);
  }
  toJSON() {
    return {
      $type: this.$type,
      subject: { uri: this.uri, cid: this.cid },
      createdAt: this.createdAt
    };
  }
};
var FollowRecord = class {
  $type = "app.bsky.graph.follow";
  subject;
  createdAt;
  constructor(input = {}) {
    this.subject = input.subject ?? input.did;
    this.createdAt = input.createdAt || (/* @__PURE__ */ new Date()).toISOString();
  }
  check() {
    issuesOf([["subject", this.subject], ["createdAt", this.createdAt]]);
  }
  toJSON() {
    return { $type: this.$type, subject: this.subject, createdAt: this.createdAt };
  }
};
var BlockRecord = class {
  $type = "app.bsky.graph.block";
  subject;
  createdAt;
  constructor(input = {}) {
    this.subject = input.subject ?? input.did;
    this.createdAt = input.createdAt || (/* @__PURE__ */ new Date()).toISOString();
  }
  check() {
    issuesOf([["subject", this.subject], ["createdAt", this.createdAt]]);
  }
  toJSON() {
    return { $type: this.$type, subject: this.subject, createdAt: this.createdAt };
  }
};
var ListRecord = class {
  $type = "app.bsky.graph.list";
  name;
  purpose;
  description;
  descriptionFacets;
  createdAt;
  constructor(input = {}) {
    this.name = input.name;
    this.purpose = input.purpose || "app.bsky.graph.defs#curatelist";
    this.description = input.description;
    this.descriptionFacets = input.descriptionFacets;
    this.createdAt = input.createdAt || (/* @__PURE__ */ new Date()).toISOString();
  }
  check() {
    issuesOf([["name", this.name], ["purpose", this.purpose], ["createdAt", this.createdAt]]);
  }
  toJSON() {
    const record = {
      $type: this.$type,
      purpose: this.purpose,
      name: this.name,
      createdAt: this.createdAt
    };
    if (this.description) record.description = this.description;
    if (this.descriptionFacets?.length) record.descriptionFacets = this.descriptionFacets;
    return record;
  }
};
var ListItemRecord = class {
  $type = "app.bsky.graph.listitem";
  subject;
  list;
  createdAt;
  constructor(input = {}) {
    this.subject = input.subject ?? input.did;
    this.list = input.list;
    this.createdAt = input.createdAt || (/* @__PURE__ */ new Date()).toISOString();
  }
  check() {
    issuesOf([["subject", this.subject], ["list", this.list], ["createdAt", this.createdAt]]);
  }
  toJSON() {
    return { $type: this.$type, subject: this.subject, list: this.list, createdAt: this.createdAt };
  }
};
var ThreadgateRecord = class {
  $type = "app.bsky.feed.threadgate";
  post;
  allow;
  createdAt;
  constructor(input = {}) {
    this.post = input.post;
    this.allow = input.allow;
    this.createdAt = input.createdAt || (/* @__PURE__ */ new Date()).toISOString();
  }
  check() {
    issuesOf([["post", this.post], ["createdAt", this.createdAt]]);
  }
  toJSON() {
    return {
      $type: this.$type,
      post: this.post,
      allow: this.allow,
      createdAt: this.createdAt
    };
  }
};
var PostRecord = class {
  $type = "app.bsky.feed.post";
  text;
  createdAt;
  facets;
  langs;
  reply;
  embed;
  constructor(input = {}) {
    this.text = input.text ?? "";
    this.createdAt = input.createdAt || (/* @__PURE__ */ new Date()).toISOString();
    this.facets = input.facets;
    this.langs = input.langs;
    this.reply = input.reply;
    this.embed = input.embed;
  }
  check() {
    issuesOf([["text", this.text], ["createdAt", this.createdAt]]);
  }
  toJSON() {
    const record = {
      $type: this.$type,
      text: this.text,
      createdAt: this.createdAt
    };
    if (this.facets?.length) record.facets = this.facets;
    if (this.langs?.length) record.langs = this.langs;
    if (this.reply) record.reply = { root: this.reply.root, parent: this.reply.parent };
    if (this.embed != null) record.embed = this.embed;
    return record;
  }
};
var ExternalEmbed = class {
  uri;
  title;
  description;
  thumb;
  constructor(input = {}) {
    this.uri = input.uri ?? input.url;
    this.title = input.title;
    this.description = input.description;
    this.thumb = input.thumb;
  }
  toJSON() {
    const external = {
      uri: this.uri,
      title: String(this.title || this.uri || "").slice(0, 300),
      description: String(this.description || "").slice(0, 1e3)
    };
    if (this.thumb) external.thumb = this.thumb;
    return { $type: "app.bsky.embed.external", external };
  }
};
var ImagesEmbed = class {
  images;
  constructor(images = []) {
    this.images = images;
  }
  toJSON() {
    return {
      $type: "app.bsky.embed.images",
      images: this.images.map((image) => ({
        alt: image.alt || "",
        image: image.image ?? image.blob
      }))
    };
  }
};
var VideoEmbed = class {
  video;
  alt;
  aspectRatio;
  constructor(input = {}) {
    this.video = input.video ?? input.blob;
    this.alt = input.alt;
    this.aspectRatio = input.aspectRatio;
  }
  toJSON() {
    const record = {
      $type: "app.bsky.embed.video",
      video: this.video,
      alt: String(this.alt || "").slice(0, 2e3)
    };
    if (this.aspectRatio?.width && this.aspectRatio?.height) record.aspectRatio = this.aspectRatio;
    return record;
  }
};
var RecordEmbed = class {
  uri;
  cid;
  constructor(input = {}) {
    this.uri = input.uri;
    this.cid = input.cid;
  }
  toJSON() {
    return {
      $type: "app.bsky.embed.record",
      record: { uri: this.uri, cid: this.cid }
    };
  }
};
var RecordWithMediaEmbed = class {
  uri;
  cid;
  media;
  constructor(input = {}) {
    this.uri = input.uri;
    this.cid = input.cid;
    this.media = input.media;
  }
  toJSON() {
    return {
      $type: "app.bsky.embed.recordWithMedia",
      record: {
        $type: "app.bsky.embed.record",
        record: { uri: this.uri, cid: this.cid }
      },
      media: this.media
    };
  }
};
var ChatDeclarationRecord = class {
  $type = "chat.bsky.actor.declaration";
  allowIncoming;
  constructor(allowIncoming) {
    this.allowIncoming = allowIncoming === "none" || allowIncoming === "following" ? allowIncoming : "all";
  }
  toJSON() {
    return { $type: this.$type, allowIncoming: this.allowIncoming };
  }
};
var DeleteWrite = class {
  $type = "com.atproto.repo.applyWrites#delete";
  collection;
  rkey;
  constructor(input = {}) {
    this.collection = input.collection;
    this.rkey = input.rkey;
  }
  toJSON() {
    return { $type: this.$type, collection: this.collection, rkey: this.rkey };
  }
};
var SAVED_V2 = "app.bsky.actor.defs#savedFeedsPrefV2";
var SAVED_V1 = "app.bsky.actor.defs#savedFeedsPref";
function savedFeedItems(preferences) {
  const list = preferences || [];
  const v2 = list.find((pref) => pref.$type === SAVED_V2);
  if (v2) {
    return (v2.items || []).filter((item) => item?.type && item?.value).map((item) => ({
      id: item.id,
      type: item.type,
      value: item.value,
      pinned: Boolean(item.pinned)
    }));
  }
  const v1 = list.find((pref) => pref.$type === SAVED_V1);
  if (!v1) return [];
  const pinned = new Set(v1.pinned || []);
  const uris = [.../* @__PURE__ */ new Set([...v1.saved || [], ...v1.pinned || []])].filter(Boolean);
  return uris.map((uri) => ({
    type: String(uri).includes("/app.bsky.graph.list/") ? "list" : "feed",
    value: uri,
    pinned: pinned.has(uri)
  }));
}
function applySavedFeeds(preferences, items) {
  const next = (preferences || []).map((pref) => ({ ...pref }));
  const v2items = items.map((item) => ({
    id: item.id || nextTid(),
    type: item.type,
    value: item.value,
    pinned: Boolean(item.pinned)
  }));
  let v2 = next.find((pref) => pref.$type === SAVED_V2);
  if (!v2) {
    v2 = { $type: SAVED_V2, items: v2items };
    next.push(v2);
  } else v2.items = v2items;
  const v1 = next.find((pref) => pref.$type === SAVED_V1);
  if (v1) {
    const rows = v2items.filter((item) => item.type === "feed" || item.type === "list");
    v1.pinned = rows.filter((item) => item.pinned).map((item) => item.value);
    v1.saved = rows.map((item) => item.value);
  }
  return next;
}
export {
  AtDatetime,
  AtIdentifier,
  AtSyntaxError,
  AtUri,
  BlockRecord,
  BskyAgent,
  ChatDeclarationRecord,
  Cid,
  DeleteWrite,
  Did,
  DidDocument,
  ExternalEmbed,
  FollowRecord,
  Handle,
  ImagesEmbed,
  LEXICON_METHODS,
  Language,
  LexiconDocument,
  LexiconRegistry,
  LikeRecord,
  ListItemRecord,
  ListRecord,
  Nsid,
  PROTOCOL_SOURCE,
  PostRecord,
  ProtocolError,
  RecordEmbed,
  RecordKey,
  RecordWithMediaEmbed,
  RepoBlob,
  RepoRef,
  RepostRecord,
  StrongRef,
  ThreadgateRecord,
  Tid,
  TypedStrongRef,
  Uri,
  ValidationError,
  VideoEmbed,
  XrpcClient,
  XrpcError,
  applySavedFeeds,
  buildQuery,
  installCatalog,
  isMissingRecord,
  isXrpcError,
  jsonOf,
  lexiconHttpMethod,
  nextTid,
  ns,
  paginate,
  readXrpcResponse,
  savedFeedItems,
  toJsonValue,
  validate,
  xrpcPath
};
