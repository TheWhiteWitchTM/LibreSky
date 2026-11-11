// src/ids.ts
var LINKS_COLLECTION = "app.libresky.actor.links";
var HIGHLIGHT_COLLECTION = "app.libresky.feed.highlight";
var ARTICLE_COLLECTION = "app.libresky.article.article";
var PRESENCE_COLLECTION = "app.libresky.actor.presence";
var LEXICON_COLLECTION = "com.atproto.lexicon.schema";
var LINKS_RKEY = "self";
var PRESENCE_RKEY = "self";
var POST_COLLECTION = "app.bsky.feed.post";

// src/generated/docs.ts
var linksDoc = { "lexicon": 1, "id": "app.libresky.actor.links", "description": "Public social links LibreSky shows under a profile. Stored in the account repo, so another LibreSky window can read them.", "defs": { "main": { "type": "record", "description": "The account's social link row.", "key": "literal:self", "record": { "type": "object", "required": ["links"], "properties": { "links": { "type": "array", "maxLength": 8, "items": { "type": "ref", "ref": "#link" } } } } }, "link": { "type": "object", "required": ["url"], "properties": { "url": { "type": "string", "format": "uri", "maxLength": 2e3 }, "label": { "type": "string", "maxLength": 80, "maxGraphemes": 40 }, "kind": { "type": "string", "knownValues": ["website", "x", "instagram", "youtube", "github", "mastodon", "tiktok", "facebook", "linkedin", "threads", "bluesky", "discord", "twitch", "reddit", "spotify", "telegram", "patreon", "paypal", "other"], "maxLength": 32 } } } } };
var highlightDoc = { "lexicon": 1, "id": "app.libresky.feed.highlight", "description": "A post the account shows on its Highlights tab. The record is public in the account repo.", "defs": { "main": { "type": "record", "description": "A highlighted post.", "key": "tid", "record": { "type": "object", "required": ["subject", "createdAt"], "properties": { "subject": { "type": "ref", "ref": "com.atproto.repo.strongRef" }, "createdAt": { "type": "string", "format": "datetime" } } } } } };
var articleDoc = { "lexicon": 1, "id": "app.libresky.article.article", "description": "A long article LibreSky shows on the profile Articles tab. The record is public in the account repo.", "defs": { "main": { "type": "record", "description": "One article.", "key": "tid", "record": { "type": "object", "required": ["title", "text", "createdAt"], "properties": { "title": { "type": "string", "maxLength": 3e3, "maxGraphemes": 300 }, "text": { "type": "string", "maxLength": 1e5, "maxGraphemes": 25e3 }, "summary": { "type": "string", "maxLength": 4e3, "maxGraphemes": 400 }, "cover": { "type": "blob", "accept": ["image/png", "image/jpeg"], "maxSize": 1e6 }, "createdAt": { "type": "string", "format": "datetime" }, "updatedAt": { "type": "string", "format": "datetime" } } } } } };
var presenceDoc = { "lexicon": 1, "id": "app.libresky.actor.presence", "description": "Internal last seen LibreSky writes while the app is open. Another LibreSky window reads it to tell a LibreSky account from any other, and to show online and available. The time is not shown.", "defs": { "main": { "type": "record", "description": "The account's last seen.", "key": "literal:self", "record": { "type": "object", "required": ["seenAt"], "properties": { "seenAt": { "type": "string", "format": "datetime" }, "status": { "type": "string", "knownValues": ["available", "away"], "maxLength": 16 } } } } } };

// src/lexicons.ts
var LEXICONS = [linksDoc, highlightDoc, articleDoc, presenceDoc];
function lexiconRecord(doc) {
  const record = {
    $type: LEXICON_COLLECTION,
    lexicon: doc.lexicon,
    id: doc.id,
    defs: doc.defs
  };
  if (doc.description) record.description = doc.description;
  return record;
}
function sameLexicon(value, record) {
  if (!value || typeof value !== "object") return false;
  const current = value;
  return current.id === record.id && JSON.stringify(current.defs) === JSON.stringify(record.defs);
}

// src/records.ts
import { AtDatetime, AtUri, ValidationError } from "../../libbluesky/dist/index.js";
var LINK_KINDS = [
  "website",
  "x",
  "instagram",
  "youtube",
  "github",
  "mastodon",
  "tiktok",
  "facebook",
  "linkedin",
  "threads",
  "bluesky",
  "discord",
  "twitch",
  "reddit",
  "spotify",
  "telegram",
  "patreon",
  "paypal",
  "other"
];
var LINK_LABEL = {
  website: "Website",
  x: "X",
  instagram: "Instagram",
  youtube: "YouTube",
  github: "GitHub",
  mastodon: "Mastodon",
  tiktok: "TikTok",
  facebook: "Facebook",
  linkedin: "LinkedIn",
  threads: "Threads",
  bluesky: "Bluesky",
  discord: "Discord",
  twitch: "Twitch",
  reddit: "Reddit",
  spotify: "Spotify",
  telegram: "Telegram",
  patreon: "Patreon",
  paypal: "PayPal",
  other: "Link"
};
var KIND_SET = new Set(LINK_KINDS);
var HOST_KIND = [
  ["x.com", "x"],
  ["twitter.com", "x"],
  ["instagram.com", "instagram"],
  ["youtube.com", "youtube"],
  ["youtu.be", "youtube"],
  ["github.com", "github"],
  ["tiktok.com", "tiktok"],
  ["facebook.com", "facebook"],
  ["fb.com", "facebook"],
  ["linkedin.com", "linkedin"],
  ["threads.net", "threads"],
  ["bsky.app", "bluesky"],
  ["discord.com", "discord"],
  ["discord.gg", "discord"],
  ["twitch.tv", "twitch"],
  ["reddit.com", "reddit"],
  ["spotify.com", "spotify"],
  ["t.me", "telegram"],
  ["telegram.me", "telegram"],
  ["telegram.org", "telegram"],
  ["patreon.com", "patreon"],
  ["paypal.com", "paypal"],
  ["paypal.me", "paypal"]
];
function fail(path, message) {
  const issues = [{ path, message }];
  throw new ValidationError(issues);
}
function hostname(value) {
  try {
    return new URL(value).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}
function hostMatches(host, name) {
  return host === name || host.endsWith(`.${name}`);
}
function kindForUrl(value) {
  const host = hostname(value).toLowerCase();
  if (!host) return "website";
  for (const [name, kind] of HOST_KIND) {
    if (hostMatches(host, name)) return kind;
  }
  if (host.includes("mastodon")) return "mastodon";
  return "website";
}
function httpUrl(value) {
  const raw = String(value ?? "").trim();
  let url;
  try {
    url = new URL(raw);
  } catch {
    fail("url", "Enter a full link, including https://.");
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") {
    fail("url", "The link has to start with http:// or https://.");
  }
  if (!url.hostname.includes(".")) fail("url", "Enter a full link, including https://.");
  return url.toString();
}
function normalizeLink(input) {
  const url = httpUrl(input?.url);
  const requested = String(input?.kind || "");
  const kind = KIND_SET.has(requested) ? requested : kindForUrl(url);
  const label = String(input?.label || "").replace(/\s+/g, " ").trim().slice(0, 40);
  return { url, label, kind };
}
function presentLink(link) {
  const kind = KIND_SET.has(link.kind) ? link.kind : kindForUrl(link.url);
  const host = hostname(link.url);
  const fallback = kind === "other" && host ? host : LINK_LABEL[kind] || host || "Link";
  return { url: link.url, label: link.label.trim() || fallback, kind };
}
function parseLinks(value) {
  const raw = value && typeof value === "object" ? value.links : null;
  if (!Array.isArray(raw)) return [];
  const links = [];
  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    try {
      links.push(normalizeLink(item));
    } catch {
    }
    if (links.length >= 8) break;
  }
  return links;
}
function profileTabIds(input = {}) {
  const ids = ["posts", "replies"];
  if ((input.highlights || 0) > 0 || input.current === "highlights") ids.push("highlights");
  if ((input.articles || 0) > 0 || input.current === "articles") ids.push("articles");
  ids.push("media", "likes");
  return ids;
}
function articleExcerpt(article, max = 180) {
  const source = String(article.summary || article.text || "").replace(/\s+/g, " ").trim();
  if (source.length <= max) return source;
  return `${source.slice(0, max - 1).trimEnd()}\u2026`;
}
function newest(items) {
  return items.slice().sort((a, b) => a.createdAt < b.createdAt ? 1 : a.createdAt > b.createdAt ? -1 : 0);
}
function postSubject(input) {
  const uri = String(input.uri || "");
  const cid = String(input.cid || "");
  const parts = AtUri.parts(uri);
  if (!parts || parts.collection !== POST_COLLECTION || !parts.rkey || !cid) fail("subject", "Highlight a post.");
  return { uri, cid };
}
var LinksRecord = class {
  $type = LINKS_COLLECTION;
  links;
  constructor(links = []) {
    this.links = links.map((link) => normalizeLink(link));
  }
  check() {
    if (this.links.length > 8) fail("links", "A profile can show 8 social links.");
  }
  toJSON() {
    this.check();
    return {
      $type: this.$type,
      links: this.links.map((link) => {
        const item = { url: link.url, kind: link.kind };
        if (link.label) item.label = link.label;
        return item;
      })
    };
  }
};
var HighlightRecord = class {
  $type = HIGHLIGHT_COLLECTION;
  subject;
  createdAt;
  constructor(input = {}) {
    this.subject = postSubject({
      uri: input.subject?.uri ?? input.uri,
      cid: input.subject?.cid ?? input.cid
    });
    this.createdAt = input.createdAt || (/* @__PURE__ */ new Date()).toISOString();
  }
  check() {
    postSubject(this.subject);
    if (!this.createdAt) fail("createdAt", "Required.");
  }
  toJSON() {
    this.check();
    return {
      $type: this.$type,
      subject: { uri: this.subject.uri, cid: this.subject.cid },
      createdAt: this.createdAt
    };
  }
};
var ArticleRecord = class {
  $type = ARTICLE_COLLECTION;
  title;
  text;
  summary;
  cover;
  createdAt;
  updatedAt;
  constructor(input = {}) {
    this.title = String(input.title || "").replace(/\s+/g, " ").trim();
    this.text = String(input.text || "").trim();
    this.summary = String(input.summary || "").replace(/\s+/g, " ").trim();
    this.cover = input.cover || null;
    this.createdAt = input.createdAt || (/* @__PURE__ */ new Date()).toISOString();
    this.updatedAt = input.updatedAt || this.createdAt;
  }
  check() {
    if (!this.title) fail("title", "Add a title.");
    if (this.title.length > 300) fail("title", "The title is too long.");
    if (!this.text) fail("text", "Write the article.");
    if (this.text.length > 25e3) fail("text", "The article is too long.");
    if (this.summary.length > 400) fail("summary", "The summary is too long.");
    if (!this.createdAt) fail("createdAt", "Required.");
  }
  toJSON() {
    this.check();
    const record = {
      $type: this.$type,
      title: this.title,
      text: this.text,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
    if (this.summary) record.summary = this.summary;
    if (this.cover) record.cover = this.cover;
    return record;
  }
};
function parseHighlight(record) {
  const value = record.value;
  if (!record.uri || !value || typeof value !== "object") return null;
  const subject = value.subject;
  const uri = typeof subject?.uri === "string" ? subject.uri : "";
  const cid = typeof subject?.cid === "string" ? subject.cid : "";
  const parts = AtUri.parts(uri);
  if (!parts || parts.collection !== POST_COLLECTION || !cid) return null;
  const createdAt = typeof value.createdAt === "string" ? value.createdAt : "";
  return { uri: record.uri, cid: record.cid || "", subjectUri: uri, subjectCid: cid, createdAt };
}
function parseArticle(record) {
  const value = record.value;
  if (!record.uri || !value || typeof value !== "object") return null;
  const body = value;
  if (typeof body.title !== "string" || !body.title.trim()) return null;
  if (typeof body.text !== "string" || !body.text.trim()) return null;
  const parts = AtUri.parts(record.uri);
  const createdAt = typeof body.createdAt === "string" ? body.createdAt : "";
  return {
    uri: record.uri,
    cid: record.cid || "",
    rkey: parts?.rkey || "",
    title: body.title.trim(),
    text: body.text,
    summary: typeof body.summary === "string" ? body.summary.trim() : "",
    cover: body.cover || null,
    createdAt,
    updatedAt: typeof body.updatedAt === "string" ? body.updatedAt : createdAt
  };
}
function highlightsFrom(records) {
  return newest(records.map(parseHighlight).filter((item) => Boolean(item)));
}
function articlesFrom(records) {
  return newest(records.map(parseArticle).filter((item) => Boolean(item)));
}
var PRESENCE_FRESH_MS = 5 * 60 * 1e3;
var PRESENCE_PULSE_MS = 2 * 60 * 1e3;
var PRESENCE_SKEW_MS = 2 * 60 * 1e3;
function absentPresence() {
  return { usesLibreSky: false, online: false, available: false, state: "absent", seenAt: "" };
}
function parsePresence(value) {
  if (!value || typeof value !== "object") return null;
  const body = value;
  if (!AtDatetime.isValid(body.seenAt)) return null;
  return { seenAt: body.seenAt, status: body.status === "away" ? "away" : "available" };
}
function presenceView(value, now = Date.now()) {
  if (value == null) return absentPresence();
  const parsed = parsePresence(value);
  if (!parsed) {
    return { usesLibreSky: true, online: false, available: false, state: "offline", seenAt: "" };
  }
  const then = Date.parse(parsed.seenAt);
  const fresh = Number.isFinite(then) && then - now <= PRESENCE_SKEW_MS && now - then <= PRESENCE_FRESH_MS;
  if (!fresh) {
    return { usesLibreSky: true, online: false, available: false, state: "offline", seenAt: parsed.seenAt };
  }
  if (parsed.status === "away") {
    return { usesLibreSky: true, online: true, available: false, state: "away", seenAt: parsed.seenAt };
  }
  return { usesLibreSky: true, online: true, available: true, state: "available", seenAt: parsed.seenAt };
}
function presencePulseDue(view, status, now = Date.now(), minMs = PRESENCE_PULSE_MS) {
  const wanted = status === "away" ? "away" : "available";
  if (!view?.usesLibreSky || view.state !== wanted || !view.seenAt) return true;
  const then = Date.parse(view.seenAt);
  if (!Number.isFinite(then)) return true;
  return now - then >= minMs;
}
var PresenceRecord = class {
  $type = PRESENCE_COLLECTION;
  seenAt;
  status;
  constructor(input = {}) {
    const seenAt = input.seenAt || (/* @__PURE__ */ new Date()).toISOString();
    this.seenAt = AtDatetime.isValid(seenAt) ? seenAt : (/* @__PURE__ */ new Date()).toISOString();
    this.status = input.status === "away" ? "away" : "available";
  }
  check() {
    if (!AtDatetime.isValid(this.seenAt)) fail("seenAt", "Required.");
  }
  toJSON() {
    this.check();
    return {
      $type: this.$type,
      seenAt: this.seenAt,
      status: this.status
    };
  }
};

// src/repo.ts
import { AtUri as AtUri2, isMissingRecord } from "../../libbluesky/dist/index.js";
var LibreSkyData = class {
  constructor(repo) {
    this.repo = repo;
  }
  lexiconsFor = "";
  async readShelf(did) {
    const [links, highlights, articles] = await Promise.all([
      this.readLinks(did),
      this.listHighlights(did),
      this.listArticles(did)
    ]);
    return { links, highlights, articles };
  }
  async readLinks(did) {
    const got = await this.one(did, LINKS_COLLECTION, LINKS_RKEY);
    return got?.value ? parseLinks(got.value) : [];
  }
  async writeLinks(links) {
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
  async listHighlights(did) {
    return highlightsFrom(await this.listAll(did, HIGHLIGHT_COLLECTION));
  }
  async addHighlight(subject) {
    const record = new HighlightRecord(subject);
    record.check();
    const existing = await this.listHighlights(this.repo.did());
    const found = existing.find((item2) => item2.subjectUri === record.subject.uri);
    if (found) return found;
    await this.ensureLexicons();
    const wrote = await this.repo.createRecord(HIGHLIGHT_COLLECTION, record.toJSON());
    const item = parseHighlight({ uri: wrote.uri, cid: wrote.cid, value: record.toJSON() });
    if (!item) throw new Error("Could not save that highlight.");
    return item;
  }
  async removeHighlight(uri) {
    if (!uri) return;
    await this.repo.deleteRecord(uri);
  }
  async removeHighlightPost(postUri) {
    const items = await this.listHighlights(this.repo.did());
    const found = items.filter((item) => item.subjectUri === postUri);
    for (const item of found) await this.repo.deleteRecord(item.uri);
  }
  async listArticles(did) {
    return articlesFrom(await this.listAll(did, ARTICLE_COLLECTION));
  }
  async readArticle(did, rkey) {
    const got = await this.one(did, ARTICLE_COLLECTION, rkey);
    return got ? parseArticle(got) : null;
  }
  async saveArticle(input) {
    const createdAt = input.createdAt || (/* @__PURE__ */ new Date()).toISOString();
    const record = new ArticleRecord({
      title: input.title,
      text: input.text,
      summary: input.summary,
      cover: input.cover,
      createdAt,
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    });
    record.check();
    await this.ensureLexicons();
    const json = record.toJSON();
    if (input.uri) {
      const parts = AtUri2.parts(input.uri);
      if (!parts || parts.collection !== ARTICLE_COLLECTION) throw new Error("Could not read that article.");
      const wrote2 = await this.repo.putRecord(ARTICLE_COLLECTION, parts.rkey, json);
      const item2 = parseArticle({ uri: wrote2.uri || input.uri, cid: wrote2.cid, value: json });
      if (!item2) throw new Error("Could not save that article.");
      return item2;
    }
    const wrote = await this.repo.createRecord(ARTICLE_COLLECTION, json);
    const item = parseArticle({ uri: wrote.uri, cid: wrote.cid, value: json });
    if (!item) throw new Error("Could not save that article.");
    return item;
  }
  async deleteArticle(uri) {
    if (!uri) return;
    await this.repo.deleteRecord(uri);
  }
  async readPresence(did) {
    const got = await this.one(did, PRESENCE_COLLECTION, PRESENCE_RKEY);
    if (!got) return presenceView(null);
    return presenceView(got.value ?? {});
  }
  async writePresence(status = "available") {
    const record = new PresenceRecord({ status });
    record.check();
    await this.ensureLexicons();
    const json = record.toJSON();
    await this.repo.putRecord(PRESENCE_COLLECTION, PRESENCE_RKEY, json);
    return presenceView(json);
  }
  async ensureLexicons() {
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
        }
      }
    }
    this.lexiconsFor = did;
  }
  async one(repo, collection, rkey) {
    try {
      return await this.repo.getRecord(repo, collection, rkey);
    } catch (error) {
      if (isMissingRecord(error)) return null;
      throw error;
    }
  }
  async listAll(repo, collection) {
    const records = [];
    let cursor = "";
    for (let page = 0; page < 40; page += 1) {
      let data;
      try {
        data = await this.repo.listRecords(repo, collection, cursor || void 0);
      } catch (error) {
        if (isMissingRecord(error)) return records;
        throw error;
      }
      records.push(...data.records || []);
      if (!data.cursor || data.cursor === cursor) break;
      cursor = data.cursor;
    }
    return records;
  }
};
export {
  ARTICLE_COLLECTION,
  ArticleRecord,
  HIGHLIGHT_COLLECTION,
  HighlightRecord,
  LEXICONS,
  LEXICON_COLLECTION,
  LINKS_COLLECTION,
  LINKS_RKEY,
  LINK_KINDS,
  LINK_LABEL,
  LibreSkyData,
  LinksRecord,
  POST_COLLECTION,
  PRESENCE_COLLECTION,
  PRESENCE_FRESH_MS,
  PRESENCE_PULSE_MS,
  PRESENCE_RKEY,
  articleExcerpt,
  articlesFrom,
  highlightsFrom,
  kindForUrl,
  lexiconRecord,
  normalizeLink,
  parseArticle,
  parseHighlight,
  parseLinks,
  presencePulseDue,
  presenceView,
  presentLink,
  profileTabIds,
  sameLexicon
};
