import { currentDid, getOauth, getPassword, setPassword } from './session.js';
import { splitAtUri } from './util.js';

const PUBLIC = 'https://public.api.bsky.app';
const PUBLIC_ALT = 'https://api.bsky.app';
export const WHATS_HOT = 'at://did:plc:z72i7hdynmk6r22z27h6tvur/app.bsky.feed.generator/whats-hot';
const CHAT_PROXY = 'did:web:api.bsky.chat#bsky_chat';

let refreshLock = null;

function query(params) {
  const search = new URLSearchParams();
  Object.entries(params || {}).forEach(([key, value]) => {
    if (value == null || value === '') return;
    if (Array.isArray(value)) value.forEach((item) => search.append(key, String(item)));
    else search.set(key, String(value));
  });
  const text = search.toString();
  return text ? `?${text}` : '';
}

async function read(res) {
  const text = await res.text();
  let data = null;
  if (text) {
    try { data = JSON.parse(text); } catch { data = { message: text.slice(0, 240) }; }
  }
  if (!res.ok) {
    const error = new Error(data?.message || data?.error || `Bluesky request failed (${res.status})`);
    error.status = res.status;
    error.data = data;
    throw error;
  }
  return data ?? {};
}

function accessExpired(token) {
  try {
    const part = String(token || '').split('.')[1];
    if (!part) return true;
    const padded = part.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat((4 - (part.length % 4)) % 4);
    const json = JSON.parse(atob(padded));
    return !json.exp || json.exp * 1000 < Date.now() + 90_000;
  } catch {
    return true;
  }
}

export async function ensurePasswordSession() {
  const session = getPassword();
  if (!session?.accessJwt) return false;
  if (!accessExpired(session.accessJwt)) return true;
  return refreshPassword();
}

async function refreshPassword() {
  const session = getPassword();
  if (!session?.refreshJwt) return false;
  if (!refreshLock) {
    refreshLock = (async () => {
      const res = await fetch(`${session.pds.replace(/\/$/, '')}/xrpc/com.atproto.server.refreshSession`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${session.refreshJwt}` },
      });
      if (!res.ok) {
        setPassword(null);
        return false;
      }
      const data = await read(res);
      setPassword({
        ...session,
        accessJwt: data.accessJwt,
        refreshJwt: data.refreshJwt,
        handle: data.handle || session.handle,
        did: data.did || session.did,
      });
      return true;
    })().finally(() => { refreshLock = null; });
  }
  return refreshLock;
}

export async function xrpc(ns, options = {}) {
  const method = options.method || (options.body !== undefined || options.blob ? 'POST' : 'GET');
  const path = `/xrpc/${ns}${query(options.params)}`;
  const headers = new Headers(options.headers || {});
  const oauth = options.auth === 'public' ? null : getOauth();
  const password = options.auth === 'public' ? null : getPassword();
  if (options.auth === 'required' && !oauth && !password) throw new Error('Sign in with Bluesky to do that.');

  if (oauth) {
    if (options.blob) headers.set('Content-Type', options.blob.type || 'application/octet-stream');
    else if (options.body !== undefined) headers.set('Content-Type', 'application/json');
    const res = await oauth.fetchHandler(path, {
      method,
      headers,
      body: options.blob || (options.body !== undefined ? JSON.stringify(options.body) : undefined),
      signal: options.signal,
    });
    return read(res);
  }

  const base = password ? password.pds.replace(/\/$/, '') : PUBLIC;
  if (password) headers.set('Authorization', `Bearer ${password.accessJwt}`);
  if (options.body !== undefined && !options.blob) headers.set('Content-Type', 'application/json');
  if (options.blob) headers.set('Content-Type', options.blob.type || 'application/octet-stream');
  const init = {
    method,
    headers,
    body: options.blob || (options.body !== undefined ? JSON.stringify(options.body) : undefined),
    signal: options.signal,
  };
  let res;
  try {
    res = await fetch(base + path, init);
  } catch (error) {
    if (password || error?.name === 'AbortError') throw error;
    res = await fetch(PUBLIC_ALT + path, init);
  }
  if (!password && (res.status === 403 || res.status === 429)) {
    const alt = await fetch(PUBLIC_ALT + path, init);
    if (alt.ok) res = alt;
  }
  if (res.status === 401 && password && !options.retried) {
    const refreshed = await refreshPassword();
    if (refreshed) return xrpc(ns, { ...options, retried: true });
  }
  return read(res);
}

async function didDocument(did) {
  if (did.startsWith('did:web:')) {
    const host = did.slice('did:web:'.length).split(':').map(decodeURIComponent).join('/');
    const res = await fetch(`https://${host}/.well-known/did.json`);
    if (!res.ok) throw new Error('Could not read that account’s DID document.');
    return res.json();
  }
  const res = await fetch(`https://plc.directory/${encodeURIComponent(did)}`);
  if (!res.ok) throw new Error('Could not find that Bluesky account.');
  return res.json();
}

export async function resolvePds(identifier) {
  const handle = identifier.trim().replace(/^@/, '');
  let did = handle;
  if (!did.startsWith('did:')) {
    const resolved = await xrpc('com.atproto.identity.resolveHandle', {
      params: { handle },
      auth: 'public',
    });
    did = resolved.did;
  }
  const doc = await didDocument(did);
  if (!handle.startsWith('did:')) {
    const claimed = (doc.alsoKnownAs || []).some((name) => String(name).toLowerCase() === `at://${handle.toLowerCase()}`);
    if (!claimed) throw new Error('That handle does not match the account record.');
  }
  const service = (doc.service || []).find((item) => item.type === 'AtprotoPersonalDataServer' || item.id === '#atproto_pds');
  if (!service?.serviceEndpoint) throw new Error('Could not find this account’s server.');
  return { did, pds: service.serviceEndpoint, handle };
}

export async function loginWithPassword(identifier, password) {
  const id = identifier.trim().replace(/^@/, '');
  const found = await resolvePds(id);
  const res = await fetch(`${found.pds.replace(/\/$/, '')}/xrpc/com.atproto.server.createSession`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier: id, password }),
  });
  const data = await read(res);
  const session = {
    accessJwt: data.accessJwt,
    refreshJwt: data.refreshJwt,
    did: data.did,
    handle: data.handle,
    pds: found.pds,
    displayName: data.handle,
    avatar: '',
  };
  setPassword(session);
  try {
    const profile = await getProfile(data.did);
    session.displayName = profile.displayName || data.handle;
    session.avatar = profile.avatar || '';
    setPassword(session);
  } catch {
    /* the session is still valid */
  }
  return session;
}

export async function logoutPassword() {
  const session = getPassword();
  setPassword(null);
  if (!session?.accessJwt) return;
  await fetch(`${session.pds.replace(/\/$/, '')}/xrpc/com.atproto.server.deleteSession`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${session.accessJwt}` },
  }).catch(() => {});
}

export function getTimeline(cursor, signal) {
  return xrpc('app.bsky.feed.getTimeline', { params: { limit: 30, cursor }, signal, auth: 'required' });
}

export function getFeed(feed, cursor, signal) {
  return xrpc('app.bsky.feed.getFeed', { params: { feed, limit: 30, cursor }, signal });
}

export function getFeedGenerator(feed) {
  return xrpc('app.bsky.feed.getFeedGenerator', { params: { feed } });
}

export function getFeedGenerators(feeds) {
  return xrpc('app.bsky.feed.getFeedGenerators', { params: { feeds } });
}

export function getPostThread(uri, signal) {
  return xrpc('app.bsky.feed.getPostThread', { params: { uri, depth: 6, parentHeight: 20 }, signal });
}

export function getPosts(uris) {
  return xrpc('app.bsky.feed.getPosts', { params: { uris } });
}

export function getProfile(actor, signal) {
  return xrpc('app.bsky.actor.getProfile', { params: { actor }, signal });
}

export function getAuthorFeed(actor, filter, cursor, signal) {
  return xrpc('app.bsky.feed.getAuthorFeed', { params: { actor, filter, limit: 30, cursor }, signal });
}

export function getActorLikes(actor, cursor, signal) {
  return xrpc('app.bsky.feed.getActorLikes', { params: { actor, limit: 30, cursor }, signal });
}

export function searchPosts(q, cursor, signal, sort = 'latest') {
  return xrpc('app.bsky.feed.searchPosts', { params: { q, limit: 25, sort, cursor }, signal });
}

export function searchActors(q, signal) {
  return xrpc('app.bsky.actor.searchActors', { params: { q, limit: 20 }, signal });
}

export function getSuggestions(signal) {
  return xrpc('app.bsky.actor.getSuggestions', { params: { limit: 5 }, signal, auth: 'required' });
}

export function getNotifications(cursor, signal, reasons) {
  return xrpc('app.bsky.notification.listNotifications', {
    params: { limit: 30, cursor, reasons },
    signal,
    auth: 'required',
  });
}

export function getLikes(uri, cursor, signal) {
  return xrpc('app.bsky.feed.getLikes', { params: { uri, limit: 50, cursor }, signal });
}

export function getRepostedBy(uri, cursor, signal) {
  return xrpc('app.bsky.feed.getRepostedBy', { params: { uri, limit: 50, cursor }, signal });
}

export function getUnreadCount() {
  return xrpc('app.bsky.notification.getUnreadCount', { auth: 'required' });
}

export function updateSeen() {
  return xrpc('app.bsky.notification.updateSeen', {
    body: { seenAt: new Date().toISOString() },
    auth: 'required',
  });
}

export function getPreferences() {
  return xrpc('app.bsky.actor.getPreferences', { auth: 'required' });
}

export function getFollowers(actor, cursor, signal) {
  return xrpc('app.bsky.graph.getFollowers', { params: { actor, limit: 30, cursor }, signal });
}

export function getFollows(actor, cursor, signal) {
  return xrpc('app.bsky.graph.getFollows', { params: { actor, limit: 30, cursor }, signal });
}

export function getLists(actor) {
  return xrpc('app.bsky.graph.getLists', { params: { actor, limit: 50 } });
}

export function getListFeed(list, cursor, signal) {
  return xrpc('app.bsky.feed.getListFeed', { params: { list, limit: 30, cursor }, signal });
}

export function getBookmarks(cursor, signal) {
  return xrpc('app.bsky.bookmark.getBookmarks', { params: { limit: 30, cursor }, signal, auth: 'required' });
}

function recordBody(collection, record) {
  return {
    repo: currentDid(),
    collection,
    record,
  };
}

export function like(uri, cid) {
  return xrpc('com.atproto.repo.createRecord', {
    body: recordBody('app.bsky.feed.like', {
      $type: 'app.bsky.feed.like',
      subject: { uri, cid },
      createdAt: new Date().toISOString(),
    }),
    auth: 'required',
  });
}

export function repost(uri, cid) {
  return xrpc('com.atproto.repo.createRecord', {
    body: recordBody('app.bsky.feed.repost', {
      $type: 'app.bsky.feed.repost',
      subject: { uri, cid },
      createdAt: new Date().toISOString(),
    }),
    auth: 'required',
  });
}

export function follow(did) {
  return xrpc('com.atproto.repo.createRecord', {
    body: recordBody('app.bsky.graph.follow', {
      $type: 'app.bsky.graph.follow',
      subject: did,
      createdAt: new Date().toISOString(),
    }),
    auth: 'required',
  });
}

export function bookmark(uri, cid) {
  return xrpc('app.bsky.bookmark.createBookmark', { body: { uri, cid }, auth: 'required' });
}

export function removeBookmark(uri) {
  return xrpc('app.bsky.bookmark.deleteBookmark', { body: { uri }, auth: 'required' });
}

export function deleteRecord(uri) {
  const parts = splitAtUri(uri);
  if (!parts) throw new Error('Could not read that record.');
  return xrpc('com.atproto.repo.deleteRecord', {
    body: { repo: parts.repo, collection: parts.collection, rkey: parts.rkey },
    auth: 'required',
  });
}

export function muteActor(did) {
  return xrpc('app.bsky.graph.muteActor', { body: { actor: did }, auth: 'required' });
}

export function unmuteActor(did) {
  return xrpc('app.bsky.graph.unmuteActor', { body: { actor: did }, auth: 'required' });
}

export function block(did) {
  return xrpc('com.atproto.repo.createRecord', {
    body: recordBody('app.bsky.graph.block', {
      $type: 'app.bsky.graph.block',
      subject: did,
      createdAt: new Date().toISOString(),
    }),
    auth: 'required',
  });
}

export function muteThread(root) {
  return xrpc('app.bsky.graph.muteThread', { body: { root }, auth: 'required' });
}

export function reportPost(uri, cid, reasonType, reason) {
  return xrpc('com.atproto.moderation.createReport', {
    body: {
      reasonType,
      reason: reason || undefined,
      subject: { $type: 'com.atproto.repo.strongRef', uri, cid },
    },
    auth: 'required',
  });
}

export function reportAccount(did, reasonType, reason) {
  return xrpc('com.atproto.moderation.createReport', {
    body: {
      reasonType,
      reason: reason || undefined,
      subject: { $type: 'com.atproto.admin.defs#repoRef', did },
    },
    auth: 'required',
  });
}

export function createThreadgate(postUri, allow) {
  const rkey = String(postUri || '').split('/').pop();
  return xrpc('com.atproto.repo.createRecord', {
    body: {
      repo: currentDid(),
      collection: 'app.bsky.feed.threadgate',
      rkey,
      record: {
        $type: 'app.bsky.feed.threadgate',
        post: postUri,
        allow,
        createdAt: new Date().toISOString(),
      },
    },
    auth: 'required',
  });
}

async function profileRecord() {
  const did = currentDid();
  try {
    const data = await xrpc('com.atproto.repo.getRecord', {
      params: { repo: did, collection: 'app.bsky.actor.profile', rkey: 'self' },
      auth: 'required',
    });
    return { ...(data.value || {}), $type: 'app.bsky.actor.profile' };
  } catch (error) {
    if (error.status && error.status !== 400 && error.status !== 404) throw error;
    return { $type: 'app.bsky.actor.profile' };
  }
}

export async function updateProfile({ displayName, description, avatar, pinnedPost } = {}) {
  const record = await profileRecord();
  if (displayName != null) {
    if (displayName) record.displayName = displayName;
    else delete record.displayName;
  }
  if (description != null) {
    if (description) {
      record.description = description;
      const facets = await facetsFor(description);
      if (facets.length) record.descriptionFacets = facets;
      else delete record.descriptionFacets;
    } else {
      delete record.description;
      delete record.descriptionFacets;
    }
  }
  if (avatar) record.avatar = avatar;
  if (pinnedPost === null) delete record.pinnedPost;
  else if (pinnedPost) record.pinnedPost = pinnedPost;
  return xrpc('com.atproto.repo.putRecord', {
    body: {
      repo: currentDid(),
      collection: 'app.bsky.actor.profile',
      rkey: 'self',
      record,
    },
    auth: 'required',
  });
}

export async function uploadBlob(file) {
  const uploaded = await xrpc('com.atproto.repo.uploadBlob', { blob: file, auth: 'required' });
  return uploaded.blob;
}

export async function resolveHandle(handle) {
  const data = await xrpc('com.atproto.identity.resolveHandle', { params: { handle }, auth: 'public' });
  return data.did;
}

export async function facetsFor(text) {
  const source = String(text ?? '');
  const bytes = new TextEncoder();
  const facets = [];
  const patterns = [
    { re: /https?:\/\/[^\s]+/g, type: 'link' },
    { re: /(^|\s)@([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g, type: 'mention' },
    { re: /(^|\s)#([a-zA-Z0-9_]+)/g, type: 'tag' },
  ];
  for (const pattern of patterns) {
    pattern.re.lastIndex = 0;
    let match = pattern.re.exec(source);
    while (match) {
      if (pattern.type === 'link') {
        const value = match[0];
        const start = bytes.encode(source.slice(0, match.index)).length;
        facets.push({
          index: { byteStart: start, byteEnd: start + bytes.encode(value).length },
          features: [{ $type: 'app.bsky.richtext.facet#link', uri: value }],
        });
      } else if (pattern.type === 'mention') {
        const handle = match[2];
        const offset = match[1].length;
        const start = bytes.encode(source.slice(0, match.index + offset)).length;
        facets.push({
          index: { byteStart: start, byteEnd: start + bytes.encode(`@${handle}`).length },
          features: [{ $type: 'app.bsky.richtext.facet#mention', did: handle }],
        });
      } else {
        const tag = match[2];
        const offset = match[1].length;
        const start = bytes.encode(source.slice(0, match.index + offset)).length;
        facets.push({
          index: { byteStart: start, byteEnd: start + bytes.encode(`#${tag}`).length },
          features: [{ $type: 'app.bsky.richtext.facet#tag', tag }],
        });
      }
      match = pattern.re.exec(source);
    }
  }
  for (const facet of facets) {
    for (const feature of facet.features) {
      if (feature.$type === 'app.bsky.richtext.facet#mention' && feature.did && !String(feature.did).startsWith('did:')) {
        try { feature.did = await resolveHandle(feature.did); } catch { feature.did = ''; }
      }
    }
    facet.features = facet.features.filter((feature) => feature.$type !== 'app.bsky.richtext.facet#mention' || feature.did);
  }
  return facets.filter((facet) => facet.features.length);
}

export async function linkCard(url) {
  try {
    const res = await fetch(`https://cardyb.bsky.app/v1/extract?url=${encodeURIComponent(url)}`);
    if (!res.ok) return null;
    const meta = await res.json();
    if (!meta?.title && !meta?.description) return null;
    const external = {
      uri: meta.url || url,
      title: String(meta.title || url).slice(0, 300),
      description: String(meta.description || '').slice(0, 1000),
    };
    if (meta.image) {
      try {
        const image = await fetch(meta.image);
        if (image.ok) {
          const blob = await image.blob();
          if (blob.size > 0 && blob.size < 1000000) {
            const type = blob.type || 'image/jpeg';
            external.thumb = await uploadBlob(new File([blob], 'thumb', { type }));
          }
        }
      } catch {
        /* the card still works without a thumbnail */
      }
    }
    return { $type: 'app.bsky.embed.external', external };
  } catch {
    return null;
  }
}

export async function createPost({ text, images = [], reply = null, quote = null, link = null }) {
  const record = {
    $type: 'app.bsky.feed.post',
    text,
    createdAt: new Date().toISOString(),
  };
  const facets = await facetsFor(text);
  if (facets.length) record.facets = facets;
  const lang = (navigator.language || '').slice(0, 2).toLowerCase();
  if (/^[a-z]{2}$/.test(lang)) record.langs = [lang];
  if (reply) {
    record.reply = {
      root: reply.root,
      parent: reply.parent,
    };
  }
  const imageEmbed = images.length
    ? {
      $type: 'app.bsky.embed.images',
      images: images.map((image) => ({ alt: image.alt || '', image: image.blob })),
    }
    : null;
  if (imageEmbed && quote) {
    record.embed = {
      $type: 'app.bsky.embed.recordWithMedia',
      record: { $type: 'app.bsky.embed.record', record: { uri: quote.uri, cid: quote.cid } },
      media: imageEmbed,
    };
  } else if (imageEmbed) record.embed = imageEmbed;
  else if (quote) {
    record.embed = { $type: 'app.bsky.embed.record', record: { uri: quote.uri, cid: quote.cid } };
  } else if (link) record.embed = link;
  return xrpc('com.atproto.repo.createRecord', {
    body: recordBody('app.bsky.feed.post', record),
    auth: 'required',
  });
}

function chat(ns, options = {}) {
  return xrpc(ns, {
    ...options,
    auth: 'required',
    headers: { ...(options.headers || {}), 'atproto-proxy': CHAT_PROXY },
  });
}

export function listConvos(signal) {
  return chat('chat.bsky.convo.listConvos', { params: { limit: 30 }, signal });
}

export function getConvo(convoId, signal) {
  return chat('chat.bsky.convo.getMessages', { params: { convoId, limit: 50 }, signal });
}

export function sendMessage(convoId, text) {
  return chat('chat.bsky.convo.sendMessage', { body: { convoId, message: { text } } });
}

export function convoForMember(did) {
  return chat('chat.bsky.convo.getConvoForMembers', { params: { members: [did] } });
}
