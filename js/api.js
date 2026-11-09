import { currentDid, getOauth, getPassword, setPassword } from './session.js';
import { applyShortLinks, bskyPostParts, pageCard, plainFacets, splitAtUri, xStatusParts } from './util.js';
import {
  BlockRecord,
  ChatDeclarationRecord,
  DeleteWrite,
  DidDocument,
  ExternalEmbed,
  FollowRecord,
  ImagesEmbed,
  LikeRecord,
  ListItemRecord,
  ListRecord,
  PostRecord,
  RecordEmbed,
  RecordWithMediaEmbed,
  RepoRef,
  RepostRecord,
  ThreadgateRecord,
  TypedStrongRef,
  VideoEmbed,
  buildQuery,
  isMissingRecord as missingRecord,
  readXrpcResponse,
  xrpcPath,
} from '../lib/libbluesky/dist/index.js';
import { LibreSkyData } from '../lib/liblibresky/dist/index.js';

export { applySavedFeeds, savedFeedItems } from '../lib/libbluesky/dist/index.js';
export {
  LINK_KINDS,
  LINK_LABEL,
  articleExcerpt,
  normalizeLink,
  presentLink,
  profileTabIds,
} from '../lib/liblibresky/dist/index.js';

const PUBLIC = 'https://public.api.bsky.app';
const PUBLIC_ALT = 'https://api.bsky.app';
export const WHATS_HOT = 'at://did:plc:z72i7hdynmk6r22z27h6tvur/app.bsky.feed.generator/whats-hot';
const CHAT_PROXY = 'did:web:api.bsky.chat#bsky_chat';
const APPVIEW = 'did:web:api.bsky.app#bsky_appview';

let refreshLock = null;

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
      const data = await readXrpcResponse(res);
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
  const path = xrpcPath(ns, options.params);
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
    return readXrpcResponse(res);
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
  return readXrpcResponse(res);
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
  const doc = new DidDocument(await didDocument(did));
  if (!handle.startsWith('did:')) {
    if (!doc.claimsHandle(handle)) throw new Error('That handle does not match the account record.');
  }
  const pds = doc.pdsEndpoint();
  if (!pds) throw new Error('Could not find this account’s server.');
  return { did, pds, handle };
}

export async function loginWithPassword(identifier, password) {
  const id = identifier.trim().replace(/^@/, '');
  const found = await resolvePds(id);
  const res = await fetch(`${found.pds.replace(/\/$/, '')}/xrpc/com.atproto.server.createSession`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier: id, password }),
  });
  const data = await readXrpcResponse(res);
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
  await deletePasswordSession(session);
}

export async function deletePasswordSession(session) {
  if (!session?.accessJwt || !session?.pds) return;
  await fetch(`${session.pds.replace(/\/$/, '')}/xrpc/com.atproto.server.deleteSession`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${session.accessJwt}` },
  }).catch(() => {});
}

const APP_PASS_ADMIN_KEY = 'libresky.appPassAdmin';
let appPassAdmin = null;
let appPassRefresh = null;

function jwtPayload(token) {
  try {
    const part = String(token || '').split('.')[1];
    if (!part) return null;
    const padded = part.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat((4 - (part.length % 4)) % 4);
    return JSON.parse(atob(padded));
  } catch {
    return null;
  }
}

function tokenScopes(token) {
  const scope = jwtPayload(token)?.scope;
  if (Array.isArray(scope)) return scope.map((item) => String(item));
  if (typeof scope === 'string') return scope.split(/\s+/).filter(Boolean);
  return [];
}

function tokenManagesAppPasswords(token) {
  const scopes = tokenScopes(token);
  if (scopes.includes('com.atproto.appPass') || scopes.includes('com.atproto.appPassPrivileged')) return false;
  if (scopes.includes('com.atproto.access')) return true;
  return scopes.length === 0;
}

function readAppPassAdmin() {
  if (appPassAdmin?.accessJwt && appPassAdmin?.did && appPassAdmin?.pds) return appPassAdmin;
  try {
    const raw = sessionStorage.getItem(APP_PASS_ADMIN_KEY);
    const data = raw ? JSON.parse(raw) : null;
    if (data?.accessJwt && data?.did && data?.pds) {
      appPassAdmin = data;
      return appPassAdmin;
    }
  } catch {
    /* this tab can ask for the account password again */
  }
  return null;
}

function storeAppPassAdmin(session) {
  appPassAdmin = session;
  try { sessionStorage.setItem(APP_PASS_ADMIN_KEY, JSON.stringify(session)); }
  catch { /* the session stays in memory for this page */ }
}

export async function clearAppPassAdmin(did) {
  const saved = readAppPassAdmin();
  if (!saved) return;
  if (did && saved.did !== did) return;
  appPassAdmin = null;
  try { sessionStorage.removeItem(APP_PASS_ADMIN_KEY); } catch { /* already dropped */ }
  await deletePasswordSession(saved);
}

function appPassAuthError(message = 'Enter your account password to manage app passwords.') {
  const error = new Error(message);
  error.code = 'AppPassAuth';
  return error;
}

async function refreshAppPassAdmin(session) {
  if (!session?.refreshJwt || !session?.pds) return false;
  if (!appPassRefresh) {
    appPassRefresh = (async () => {
      const res = await fetch(`${session.pds.replace(/\/$/, '')}/xrpc/com.atproto.server.refreshSession`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${session.refreshJwt}` },
      });
      if (!res.ok) {
        appPassAdmin = null;
        try { sessionStorage.removeItem(APP_PASS_ADMIN_KEY); } catch { /* the form can open again */ }
        return false;
      }
      const data = await readXrpcResponse(res);
      storeAppPassAdmin({
        ...session,
        accessJwt: data.accessJwt,
        refreshJwt: data.refreshJwt,
        handle: data.handle || session.handle,
        did: data.did || session.did,
      });
      return true;
    })().finally(() => { appPassRefresh = null; });
  }
  return appPassRefresh;
}

async function adminFetch(session, ns, options = {}) {
  const method = options.method || (options.body !== undefined ? 'POST' : 'GET');
  const path = `/xrpc/${ns}${query(options.params)}`;
  const headers = new Headers();
  headers.set('Authorization', `Bearer ${session.accessJwt}`);
  if (options.body !== undefined) headers.set('Content-Type', 'application/json');
  const res = await fetch(`${session.pds.replace(/\/$/, '')}${path}`, {
    method,
    headers,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    signal: options.signal,
  });
  if (res.status === 401 && !options.retried) {
    const refreshed = await refreshAppPassAdmin(session);
    if (refreshed && appPassAdmin) return adminFetch(appPassAdmin, ns, { ...options, retried: true });
  }
  try {
    return await readXrpcResponse(res);
  } catch (error) {
    if (error?.status === 401 || error?.status === 403) {
      appPassAdmin = null;
      try { sessionStorage.removeItem(APP_PASS_ADMIN_KEY); } catch { /* the form can open again */ }
      const next = appPassAuthError();
      next.status = error.status;
      throw next;
    }
    throw error;
  }
}

function liveAppPassSession() {
  if (getOauth()) return null;
  const session = getPassword();
  if (!session?.accessJwt || !session?.pds || !session?.did) return null;
  if (!tokenManagesAppPasswords(session.accessJwt)) return null;
  return session;
}

async function appPassCall(ns, options) {
  const did = currentDid();
  const live = liveAppPassSession();
  if (live && (!did || live.did === did)) return xrpc(ns, { ...options, auth: 'required' });
  let admin = readAppPassAdmin();
  if (!admin || (did && admin.did !== did)) throw appPassAuthError();
  if (accessExpired(admin.accessJwt)) {
    const refreshed = await refreshAppPassAdmin(admin);
    if (!refreshed || !appPassAdmin) throw appPassAuthError();
    admin = appPassAdmin;
  }
  return adminFetch(admin, ns, options);
}

export async function loginForAppPasswords(identifier, password, authFactorToken) {
  const id = String(identifier || '').trim().replace(/^@/, '');
  if (!id || !password) throw appPassAuthError('Enter the account password.');
  const found = await resolvePds(id);
  const body = { identifier: id, password };
  if (authFactorToken) body.authFactorToken = String(authFactorToken).trim();
  const res = await fetch(`${found.pds.replace(/\/$/, '')}/xrpc/com.atproto.server.createSession`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  let data;
  try {
    data = await readXrpcResponse(res);
  } catch (error) {
    if (error?.data?.error === 'AuthFactorTokenRequired') {
      const next = new Error('This account uses a sign-in code.');
      next.code = 'AuthFactorTokenRequired';
      next.status = error.status;
      next.data = error.data;
      throw next;
    }
    throw error;
  }
  const session = {
    accessJwt: data.accessJwt,
    refreshJwt: data.refreshJwt,
    did: data.did,
    handle: data.handle,
    pds: found.pds,
  };
  const want = currentDid();
  const scopes = tokenScopes(session.accessJwt);
  const appPass = scopes.includes('com.atproto.appPass') || scopes.includes('com.atproto.appPassPrivileged');
  if (appPass || (want && session.did !== want)) {
    await deletePasswordSession(session);
    if (appPass) throw appPassAuthError('That password is an app password. Enter the account password.');
    throw new Error('That password is for a different account.');
  }
  storeAppPassAdmin(session);
  return session;
}

export function listAppPasswords() {
  return appPassCall('com.atproto.server.listAppPasswords');
}

export function createAppPassword(name, privileged) {
  const body = { name };
  if (privileged) body.privileged = true;
  return appPassCall('com.atproto.server.createAppPassword', { body });
}

export function revokeAppPassword(name) {
  return appPassCall('com.atproto.server.revokeAppPassword', { body: { name } });
}

export function getNotificationPreferences() {
  return xrpc('app.bsky.notification.getPreferences', { auth: 'required' });
}

export function putNotificationPreferences(preferences) {
  return xrpc('app.bsky.notification.putPreferencesV2', { body: preferences, auth: 'required' });
}

export function getMutes(cursor) {
  return xrpc('app.bsky.graph.getMutes', { params: { limit: 50, cursor }, auth: 'required' });
}

export function getBlocks(cursor) {
  return xrpc('app.bsky.graph.getBlocks', { params: { limit: 50, cursor }, auth: 'required' });
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

export function getActorFeeds(actor, cursor, signal) {
  return xrpc('app.bsky.feed.getActorFeeds', { params: { actor, limit: 30, cursor }, signal });
}

export function searchFeedGenerators(query, signal) {
  return xrpc('app.bsky.unspecced.getPopularFeedGenerators', {
    params: { query: query || undefined, limit: 12 },
    signal,
  });
}

export function getPostThread(uri, signal) {
  return xrpc('app.bsky.feed.getPostThread', { params: { uri, depth: 6, parentHeight: 20 }, signal });
}

export async function getPosts(uris) {
  const list = [...new Set((uris || []).map((uri) => String(uri || '')).filter(Boolean))];
  if (!list.length) return { posts: [] };
  if (list.length <= 25) return xrpc('app.bsky.feed.getPosts', { params: { uris: list } });
  const posts = [];
  const seen = new Set();
  for (let index = 0; index < list.length; index += 25) {
    const data = await xrpc('app.bsky.feed.getPosts', { params: { uris: list.slice(index, index + 25) } });
    (data?.posts || []).forEach((post) => {
      if (!post?.uri || seen.has(post.uri)) return;
      seen.add(post.uri);
      posts.push(post);
    });
  }
  return { posts };
}

export function getProfile(actor, signal) {
  return xrpc('app.bsky.actor.getProfile', { params: { actor }, signal });
}

export function getAuthorFeed(actor, filter, cursor, signal, limit = 30) {
  return xrpc('app.bsky.feed.getAuthorFeed', { params: { actor, filter, limit, cursor }, signal });
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

export function searchActorsTypeahead(q, signal) {
  return xrpc('app.bsky.actor.searchActorsTypeahead', { params: { q, limit: 6 }, signal });
}

export async function suggestTags(prefix, signal) {
  const q = String(prefix || '').replace(/^#/, '').trim();
  if (!q) return [];
  const data = await searchPosts(`#${q}`, null, signal, 'latest');
  const tags = new Map();
  for (const post of data.posts || []) {
    for (const facet of post.record?.facets || []) {
      for (const feature of facet.features || []) {
        const tag = feature?.tag;
        if (!tag || !String(feature.$type || '').endsWith('#tag')) continue;
        if (tag.toLowerCase().startsWith(q.toLowerCase())) tags.set(tag.toLowerCase(), tag);
      }
    }
  }
  return [...tags.values()].slice(0, 6);
}

export function searchStarterPacks(q, signal) {
  return xrpc('app.bsky.graph.searchStarterPacks', { params: { q, limit: 12 }, signal });
}

export function getSuggestedStarterPacks(signal) {
  return xrpc('app.bsky.unspecced.getOnboardingSuggestedStarterPacks', { params: { limit: 12 }, signal });
}

export function getActorStarterPacks(actor, signal) {
  return xrpc('app.bsky.graph.getActorStarterPacks', { params: { actor, limit: 30 }, signal });
}

export function getStarterPack(starterPack, signal) {
  return xrpc('app.bsky.graph.getStarterPack', { params: { starterPack }, signal });
}

export function getSuggestions(signal) {
  return xrpc('app.bsky.actor.getSuggestions', { params: { limit: 5 }, signal, auth: 'required' });
}

export function getTrends(limit = 25, signal) {
  return xrpc('app.bsky.unspecced.getTrends', {
    params: { limit },
    signal,
    auth: 'public',
    headers: { 'Accept-Language': 'en' },
  });
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

export function putPreferences(preferences) {
  return xrpc('app.bsky.actor.putPreferences', { body: { preferences }, auth: 'required' });
}

export async function patchPreferences(change) {
  const data = await getPreferences();
  const current = Array.isArray(data?.preferences) ? data.preferences : [];
  const next = change(current.map((pref) => ({ ...pref })));
  if (!Array.isArray(next)) throw new Error('Could not save preferences.');
  await putPreferences(next);
  return next;
}

const CLIENT_SETTINGS = 'app.libresky.settings';

export async function readClientSettings() {
  try {
    const data = await xrpc('com.atproto.repo.getRecord', {
      params: { repo: currentDid(), collection: CLIENT_SETTINGS, rkey: 'self' },
      auth: 'required',
    });
    return data?.value && typeof data.value === 'object' ? data.value : null;
  } catch (error) {
    if (missingRecord(error)) return null;
    throw error;
  }
}

export async function writeClientSettings(record) {
  let current = {};
  try {
    const data = await xrpc('com.atproto.repo.getRecord', {
      params: { repo: currentDid(), collection: CLIENT_SETTINGS, rkey: 'self' },
      auth: 'required',
    });
    if (data?.value && typeof data.value === 'object') current = data.value;
  } catch (error) {
    if (!missingRecord(error)) throw error;
  }
  const next = { ...current, ...record, $type: CLIENT_SETTINGS };
  delete next.ai;
  delete next.apiKey;
  delete next.draft;
  delete next.words;
  return xrpc('com.atproto.repo.putRecord', {
    body: {
      repo: currentDid(),
      collection: CLIENT_SETTINGS,
      rkey: 'self',
      record: next,
      validate: false,
    },
    auth: 'required',
  });
}

export function getFollowers(actor, cursor, signal, limit = 30) {
  return xrpc('app.bsky.graph.getFollowers', { params: { actor, limit, cursor }, signal });
}

export function getFollows(actor, cursor, signal, limit = 30) {
  return xrpc('app.bsky.graph.getFollows', { params: { actor, limit, cursor }, signal });
}

export function getLists(actor, cursor) {
  return xrpc('app.bsky.graph.getLists', { params: { actor, limit: 50, cursor } });
}

export function getList(list, cursor, signal, limit = 50) {
  return xrpc('app.bsky.graph.getList', { params: { list, limit, cursor }, signal });
}

export function getListFeed(list, cursor, signal) {
  return xrpc('app.bsky.feed.getListFeed', { params: { list, limit: 30, cursor }, signal });
}

export function createList({ name, description, purpose, descriptionFacets }) {
  return xrpc('com.atproto.repo.createRecord', {
    body: recordBody('app.bsky.graph.list', new ListRecord({ name, description, purpose, descriptionFacets }).toJSON()),
    auth: 'required',
  });
}

export function addListMember(list, did) {
  return xrpc('com.atproto.repo.createRecord', {
    body: recordBody('app.bsky.graph.listitem', new ListItemRecord({ subject: did, list }).toJSON()),
    auth: 'required',
  });
}

export function muteList(list) {
  return xrpc('app.bsky.graph.muteActorList', { body: { list }, auth: 'required' });
}

export function unmuteList(list) {
  return xrpc('app.bsky.graph.unmuteActorList', { body: { list }, auth: 'required' });
}

export async function updateRecord(uri, change) {
  const parts = splitAtUri(uri);
  if (!parts) throw new Error('Could not read that record.');
  const got = await xrpc('com.atproto.repo.getRecord', {
    params: { repo: parts.repo, collection: parts.collection, rkey: parts.rkey },
    auth: 'required',
  });
  const record = { ...(got.value || {}) };
  const next = (await change(record)) || record;
  if (!next.$type) next.$type = parts.collection;
  return xrpc('com.atproto.repo.putRecord', {
    body: {
      repo: parts.repo,
      collection: parts.collection,
      rkey: parts.rkey,
      record: next,
      swapRecord: got.cid || undefined,
    },
    auth: 'required',
  });
}

async function deleteWrites(writes) {
  if (!writes.length) return;
  try {
    for (let i = 0; i < writes.length; i += 100) {
      await xrpc('com.atproto.repo.applyWrites', {
        body: { repo: currentDid(), writes: writes.slice(i, i + 100) },
        auth: 'required',
      });
    }
  } catch {
    for (const write of writes) {
      await xrpc('com.atproto.repo.deleteRecord', {
        body: { repo: currentDid(), collection: write.collection, rkey: write.rkey },
        auth: 'required',
      });
    }
  }
}

export async function deleteList(uri) {
  let cursor;
  for (let page = 0; page < 40; page += 1) {
    let data;
    try {
      data = await getList(uri, cursor, null, 100);
    } catch {
      break;
    }
    const writes = [];
    (data.items || []).forEach((item) => {
      const parts = splitAtUri(item.uri);
      if (!parts) return;
      writes.push(new DeleteWrite(parts).toJSON());
    });
    await deleteWrites(writes);
    if (!data.cursor || data.cursor === cursor) break;
    cursor = data.cursor;
  }
  return deleteRecord(uri);
}

function appview(ns, options = {}) {
  return xrpc(ns, {
    ...options,
    headers: { ...(options.headers || {}), 'atproto-proxy': APPVIEW },
  });
}

async function bookmarkCall(ns, options) {
  try {
    return await appview(ns, options);
  } catch (error) {
    if (error.status === 401 || error.status === 403) throw error;
    return xrpc(ns, options);
  }
}

export function getBookmarks(cursor, signal) {
  return bookmarkCall('app.bsky.bookmark.getBookmarks', { params: { limit: 30, cursor }, signal, auth: 'required' });
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
    body: recordBody('app.bsky.feed.like', new LikeRecord({ uri, cid }).toJSON()),
    auth: 'required',
  });
}

export function repost(uri, cid) {
  return xrpc('com.atproto.repo.createRecord', {
    body: recordBody('app.bsky.feed.repost', new RepostRecord({ uri, cid }).toJSON()),
    auth: 'required',
  });
}

export function follow(did) {
  return xrpc('com.atproto.repo.createRecord', {
    body: recordBody('app.bsky.graph.follow', new FollowRecord({ did }).toJSON()),
    auth: 'required',
  });
}

export function listRecords(collection, cursor, limit = 100) {
  return xrpc('com.atproto.repo.listRecords', {
    params: { repo: currentDid(), collection, limit, cursor },
    auth: 'required',
  });
}

export function bookmark(uri, cid) {
  return bookmarkCall('app.bsky.bookmark.createBookmark', { body: { uri, cid }, auth: 'required' });
}

export function removeBookmark(uri) {
  return bookmarkCall('app.bsky.bookmark.deleteBookmark', { body: { uri }, auth: 'required' });
}

export function createCallSignal(record) {
  return xrpc('com.atproto.repo.createRecord', {
    body: { ...recordBody('com.libresky.call', record), validate: false },
    auth: 'required',
  });
}

export function createShareSignal(record) {
  return xrpc('com.atproto.repo.createRecord', {
    body: { ...recordBody('com.libresky.share', record), validate: false },
    auth: 'required',
  });
}

const repoEndpoints = new Map();

async function repoEndpoint(repo) {
  const key = String(repo || '');
  if (repoEndpoints.has(key)) return repoEndpoints.get(key);
  const found = await resolvePds(key);
  repoEndpoints.set(key, found);
  repoEndpoints.set(found.did, found);
  return found;
}

export async function getPublicRecord(repo, collection, rkey) {
  const found = await repoEndpoint(repo);
  const url = new URL('/xrpc/com.atproto.repo.getRecord', found.pds);
  url.searchParams.set('repo', found.did);
  url.searchParams.set('collection', collection);
  url.searchParams.set('rkey', rkey);
  const res = await fetch(url);
  return readXrpcResponse(res);
}

export async function listPublicRecords(repo, collection, cursor) {
  const found = await repoEndpoint(repo);
  const url = new URL('/xrpc/com.atproto.repo.listRecords', found.pds);
  url.searchParams.set('repo', found.did);
  url.searchParams.set('collection', collection);
  url.searchParams.set('limit', '100');
  if (cursor) url.searchParams.set('cursor', cursor);
  const res = await fetch(url);
  return readXrpcResponse(res);
}

function librePort() {
  return {
    did: () => currentDid(),
    async getRecord(repo, collection, rkey) {
      try {
        return await getPublicRecord(repo, collection, rkey);
      } catch (error) {
        if (missingRecord(error)) return null;
        throw error;
      }
    },
    async listRecords(repo, collection, cursor) {
      const data = await listPublicRecords(repo, collection, cursor);
      return { records: data?.records || [], cursor: data?.cursor || '' };
    },
    async putRecord(collection, rkey, record) {
      return xrpc('com.atproto.repo.putRecord', {
        body: {
          repo: currentDid(),
          collection,
          rkey,
          record,
          validate: false,
        },
        auth: 'required',
      });
    },
    async createRecord(collection, record) {
      return xrpc('com.atproto.repo.createRecord', {
        body: {
          repo: currentDid(),
          collection,
          record,
          validate: false,
        },
        auth: 'required',
      });
    },
    deleteRecord(uri) {
      return deleteRecord(uri);
    },
  };
}

let libreData = null;

function libre() {
  libreData ??= new LibreSkyData(librePort());
  return libreData;
}

export function readShelf(did) {
  return libre().readShelf(did);
}

export function readArticle(did, rkey) {
  return libre().readArticle(did, rkey);
}

export function writeSocialLinks(links) {
  return libre().writeLinks(links);
}

export function addHighlight(uri, cid) {
  return libre().addHighlight({ uri, cid });
}

export function removeHighlightPost(uri) {
  return libre().removeHighlightPost(uri);
}

export function removeHighlight(uri) {
  return libre().removeHighlight(uri);
}

export function saveArticle(input) {
  return libre().saveArticle(input);
}

export function deleteArticle(uri) {
  return libre().deleteArticle(uri);
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
    body: recordBody('app.bsky.graph.block', new BlockRecord({ did }).toJSON()),
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
      subject: new TypedStrongRef({ uri, cid }).toJSON(),
    },
    auth: 'required',
  });
}

export function reportAccount(did, reasonType, reason) {
  return xrpc('com.atproto.moderation.createReport', {
    body: {
      reasonType,
      reason: reason || undefined,
      subject: new RepoRef(did).toJSON(),
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
      record: new ThreadgateRecord({ post: postUri, allow }).toJSON(),
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

const FEATURED_KEY = 'app.libresky.featured';

function featuredList(value) {
  const list = value?.[FEATURED_KEY];
  if (!Array.isArray(list)) return [];
  return list
    .filter((item) => item?.uri && item?.cid)
    .slice(0, 8)
    .map((item) => ({ uri: String(item.uri), cid: String(item.cid) }));
}

export async function readFeatured(repo) {
  try {
    const data = await getPublicRecord(repo, 'app.bsky.actor.profile', 'self');
    return featuredList(data?.value);
  } catch {
    return [];
  }
}

async function featuredKept(record) {
  try {
    const got = await xrpc('com.atproto.repo.getRecord', {
      params: { repo: currentDid(), collection: 'app.bsky.actor.profile', rkey: 'self' },
      auth: 'required',
    });
    const saved = featuredList(got?.value);
    const wanted = featuredList(record);
    return saved.length === wanted.length && saved.every((item, index) => item.uri === wanted[index].uri && item.cid === wanted[index].cid);
  } catch {
    return true;
  }
}

async function putProfile(record) {
  const body = {
    repo: currentDid(),
    collection: 'app.bsky.actor.profile',
    rkey: 'self',
    record,
  };
  const loose = () => xrpc('com.atproto.repo.putRecord', {
    body: { ...body, validate: false },
    auth: 'required',
  });
  try {
    const wrote = await xrpc('com.atproto.repo.putRecord', { body, auth: 'required' });
    if (await featuredKept(record)) return wrote;
    return loose();
  } catch (error) {
    if (error.status !== 400) throw error;
    return loose();
  }
}

export async function writeFeatured(items) {
  const record = await profileRecord();
  const next = (items || [])
    .filter((item) => item?.uri && item?.cid)
    .slice(0, 8)
    .map((item) => ({ uri: String(item.uri), cid: String(item.cid) }));
  if (next.length) record[FEATURED_KEY] = next;
  else delete record[FEATURED_KEY];
  return putProfile(record);
}

export async function updateProfile({ displayName, description, avatar, banner, pinnedPost } = {}) {
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
  if (banner) record.banner = banner;
  else if (banner === null) delete record.banner;
  if (pinnedPost === null) delete record.pinnedPost;
  else if (pinnedPost?.uri && pinnedPost?.cid) record.pinnedPost = { uri: pinnedPost.uri, cid: pinnedPost.cid };
  return putProfile(record);
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
  const facets = plainFacets(text);
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

async function cardyb(url) {
  const res = await fetch(`https://cardyb.bsky.app/v1/extract?url=${encodeURIComponent(url)}`);
  if (!res.ok) return null;
  const meta = await res.json();
  if (!meta || meta.error) return null;
  return meta;
}

async function readPage(pageUrl) {
  try {
    const res = await fetch(pageUrl, {
      redirect: 'follow',
      headers: { Accept: 'text/html,application/xhtml+xml,image/*;q=0.8' },
      signal: AbortSignal.timeout ? AbortSignal.timeout(8000) : undefined,
    });
    if (!res.ok) return null;
    const type = (res.headers.get('content-type') || '').toLowerCase();
    const finalUrl = res.url || pageUrl;
    if (type.startsWith('image/') && !type.includes('svg')) return { title: '', description: '', image: finalUrl };
    if (!type.includes('html') && !type.includes('xml') && !type.startsWith('text/')) return null;
    return pageCard((await res.text()).slice(0, 500000), finalUrl);
  } catch {
    return null;
  }
}

async function microlinkImage(pageUrl) {
  try {
    const res = await fetch(`https://api.microlink.io/?url=${encodeURIComponent(pageUrl)}&screenshot=false&video=false&audio=false&iframe=false`, {
      signal: AbortSignal.timeout ? AbortSignal.timeout(8000) : undefined,
    });
    if (!res.ok) return '';
    const data = await res.json();
    const image = data?.data?.image;
    const href = typeof image === 'string' ? image : image?.url;
    const width = Number(image?.width) || 0;
    const height = Number(image?.height) || 0;
    if (!href || !/^https?:\/\//i.test(href)) return '';
    if ((width && width < 200) || (height && height < 100)) return '';
    if (/favicon|gstatic\.com\/favicon/i.test(href)) return '';
    return href;
  } catch {
    return '';
  }
}

function canonicalPost(meta) {
  const tag = (meta?.at_tags || []).find((item) => item?.name === 'at:canonical' && String(item.uri || '').includes('/app.bsky.feed.post/'));
  return tag?.uri || '';
}

async function quoteFromUri(uri) {
  if (!uri) return null;
  const data = await getPosts([uri]);
  return data.posts?.[0] || null;
}

async function tweetMeta(status) {
  const paths = [];
  if (status.user && status.user !== 'i' && status.user !== 'web') {
    paths.push(`${encodeURIComponent(status.user)}/status/${encodeURIComponent(status.id)}`);
  }
  paths.push(`status/${encodeURIComponent(status.id)}`);
  for (const path of paths) {
    try {
      const res = await fetch(`https://api.fxtwitter.com/${path}`);
      if (!res.ok) continue;
      const data = await res.json();
      const tweet = data.tweet;
      if (!tweet?.text && !tweet?.author) continue;
      const photo = tweet.media?.photos?.[0]?.url
        || tweet.media?.videos?.[0]?.thumbnail_url
        || tweet.media?.external?.thumbnail_url
        || '';
      const name = tweet.author?.name || status.user || 'X';
      const handle = tweet.author?.screen_name || status.user || '';
      return {
        url: tweet.url || '',
        title: handle ? `${name} (@${handle})` : name,
        description: String(tweet.text || '').slice(0, 400),
        image: photo || tweet.author?.avatar_url || '',
      };
    } catch {
      /* try the next address */
    }
  }
  return null;
}

export async function inspectLink(url) {
  const clean = String(url || '').trim();
  if (!clean) return null;
  const local = bskyPostParts(clean);
  if (local) {
    try {
      const did = local.actor.startsWith('did:') ? local.actor : await resolveHandle(local.actor);
      const post = await quoteFromUri(`at://${did}/app.bsky.feed.post/${local.rkey}`);
      if (post) return { kind: 'quote', url: clean, post };
    } catch {
      /* a normal link card is the fallback */
    }
  }
  const status = xStatusParts(clean);
  if (status) {
    const tweet = await tweetMeta(status);
    if (tweet?.title || tweet?.description) {
      return {
        kind: 'external',
        url: tweet.url || clean,
        title: tweet.title || clean,
        description: tweet.description || '',
        image: tweet.image || '',
      };
    }
  }
  let meta = null;
  try { meta = await cardyb(clean); } catch { meta = null; }
  if (meta) {
    const canonical = canonicalPost(meta);
    if (canonical) {
      try {
        const post = await quoteFromUri(canonical);
        if (post) return { kind: 'quote', url: clean, post };
      } catch {
        /* keep the external card */
      }
    }
  }
  let title = String(meta?.title || '').trim();
  let description = String(meta?.description || '').trim();
  let image = String(meta?.image || '').trim();
  const pageUrl = String(meta?.url || '').trim() || clean;
  if (!image || !title) {
    const page = await readPage(clean);
    if (page) {
      if (!title) title = page.title;
      if (!description) description = page.description;
      if (!image) image = page.image;
    }
  }
  if (!image) image = await microlinkImage(clean);
  if (!title && !description && !image) return null;
  if (/post not found|404 error/i.test(title) && !description && !image) return null;
  return {
    kind: 'external',
    url: pageUrl,
    title: title || pageUrl,
    description,
    image,
  };
}

export function externalEmbed({ url, title, description, thumb }) {
  return new ExternalEmbed({ url, title, description, thumb }).toJSON();
}

const VIDEO_SERVICE = 'https://video.bsky.app';

async function readLoose(res) {
  const text = await res.text();
  let data = null;
  if (text) {
    try { data = JSON.parse(text); } catch { data = { message: text.slice(0, 240) }; }
  }
  return data ?? {};
}

async function videoPdsHost() {
  const oauth = getOauth();
  const password = getPassword();
  let pds = !oauth && password?.pds ? password.pds : '';
  if (!pds) {
    const did = currentDid();
    if (!did) throw new Error('Sign in with Bluesky to do that.');
    pds = (await resolvePds(did)).pds;
  }
  const host = new URL(pds).host;
  if (!host) throw new Error('This account cannot upload video.');
  return host;
}

function asVideoBlob(blob) {
  if (!blob || typeof blob !== 'object') return null;
  let ref = blob.ref;
  if (typeof ref === 'string' && ref) ref = { $link: ref };
  const link = ref?.$link || blob.cid || '';
  if (!link) return null;
  const size = Number(blob.size);
  return {
    $type: 'blob',
    ref: { $link: link },
    mimeType: blob.mimeType || 'video/mp4',
    ...(Number.isFinite(size) ? { size } : {}),
  };
}

function jobBlob(data) {
  const job = data?.jobStatus || data;
  return asVideoBlob(job?.blob) || asVideoBlob(data?.blob);
}

function videoJobError(data, status) {
  const job = data?.jobStatus || data || {};
  const message = job.error || job.message || data?.message || data?.error || '';
  if (message === 'already_exists') return 'The video service did not return the processed video.';
  if (message) return String(message);
  return status ? `Video processing failed (${status})` : 'Video processing failed.';
}

export async function uploadVideo(file, { signal, onProgress } = {}) {
  onProgress?.('Uploading video…');
  const exp = Math.floor(Date.now() / 1000) + 60 * 30;
  const host = await videoPdsHost();
  const auth = await xrpc('com.atproto.server.getServiceAuth', {
    params: { aud: `did:web:${host}`, lxm: 'com.atproto.repo.uploadBlob', exp },
    auth: 'required',
    signal,
  });
  const token = auth?.token;
  if (!token) throw new Error('This account cannot upload video.');
  const url = new URL(`${VIDEO_SERVICE}/xrpc/app.bsky.video.uploadVideo`);
  url.searchParams.set('did', currentDid());
  url.searchParams.set('name', file.name || 'video.mp4');
  const uploaded = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': file.type || 'video/mp4',
    },
    body: file,
    signal,
  });
  const started = await readLoose(uploaded);
  const early = jobBlob(started);
  if (early) return early;
  if (!uploaded.ok) throw new Error(videoJobError(started, uploaded.status));
  const jobId = started.jobId || started.jobStatus?.jobId;
  if (!jobId) throw new Error('Video upload did not start.');
  onProgress?.('Processing video…');
  const deadline = Date.now() + 180000;
  while (Date.now() < deadline) {
    if (signal?.aborted) throw new Error('Video upload was cancelled.');
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const statusRes = await fetch(`${VIDEO_SERVICE}/xrpc/app.bsky.video.getJobStatus?jobId=${encodeURIComponent(jobId)}`, { signal });
    const status = await readLoose(statusRes);
    const blob = jobBlob(status);
    if (blob) return blob;
    const job = status.jobStatus || status;
    const state = String(job.state || '');
    const failed = !statusRes.ok || state === 'JOB_STATE_FAILED' || state === 'failed';
    if (failed) throw new Error(videoJobError(status, statusRes.status));
  }
  throw new Error('Video processing took too long. Try a shorter video.');
}

function mergeFacets(found, extra) {
  const facets = [...(found || [])];
  const overlaps = (start, end) => facets.some((facet) => facet.index.byteStart < end && start < facet.index.byteEnd);
  for (const facet of extra || []) {
    const start = facet?.index?.byteStart;
    const end = facet?.index?.byteEnd;
    if (!Number.isInteger(start) || !Number.isInteger(end) || start >= end || overlaps(start, end)) continue;
    facets.push(facet);
  }
  facets.sort((a, b) => a.index.byteStart - b.index.byteStart || a.index.byteEnd - b.index.byteEnd);
  return facets;
}

export async function createPost({ text, images = [], video = null, reply = null, quote = null, link = null, langs = null }) {
  const prepared = applyShortLinks(text);
  const createdAt = new Date().toISOString();
  const facets = mergeFacets(await facetsFor(prepared.text), prepared.links);
  const chosen = (Array.isArray(langs) ? langs : [])
    .map((code) => String(code || '').trim().toLowerCase())
    .filter((code) => /^[a-z]{2,3}(-[a-z0-9]{2,8})*$/.test(code))
    .filter((code, index, all) => all.indexOf(code) === index)
    .slice(0, 3);
  let languages;
  if (chosen.length) languages = chosen;
  else {
    const lang = (navigator.language || '').slice(0, 2).toLowerCase();
    if (/^[a-z]{2}$/.test(lang)) languages = [lang];
  }
  const imageEmbed = images.length ? new ImagesEmbed(images).toJSON() : null;
  const videoEmbed = video?.blob
    ? new VideoEmbed({ video: video.blob, alt: video.alt, aspectRatio: video.aspectRatio }).toJSON()
    : null;
  const media = imageEmbed || videoEmbed;
  let embed;
  if (media && quote) embed = new RecordWithMediaEmbed({ uri: quote.uri, cid: quote.cid, media }).toJSON();
  else if (media) embed = media;
  else if (quote) embed = new RecordEmbed({ uri: quote.uri, cid: quote.cid }).toJSON();
  else if (link) embed = link;
  const record = new PostRecord({
    text: prepared.text,
    createdAt,
    facets,
    langs: languages,
    reply: reply ? { root: reply.root, parent: reply.parent } : undefined,
    embed,
  }).toJSON();
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

export function listConvos(cursor, signal, status) {
  const params = { limit: 40, cursor };
  if (status === 'request' || status === 'accepted') params.status = status;
  return chat('chat.bsky.convo.listConvos', { params, signal });
}

export function listConvoRequests(cursor, signal) {
  return chat('chat.bsky.convo.listConvoRequests', { params: { limit: 100, cursor }, signal });
}

export function getChatUnreadCounts(signal) {
  return chat('chat.bsky.convo.getUnreadCounts', { signal });
}

export function getChatLog(cursor, signal) {
  return chat('chat.bsky.convo.getLog', { params: { cursor }, signal });
}

export function withdrawJoinRequest(convoId) {
  return chat('chat.bsky.group.withdrawJoinRequest', { body: { convoId } });
}

export function acceptConvo(convoId) {
  return chat('chat.bsky.convo.acceptConvo', { body: { convoId } });
}

const CHAT_DECLARATION = 'chat.bsky.actor.declaration';

export async function readChatDeclaration() {
  try {
    const data = await xrpc('com.atproto.repo.getRecord', {
      params: { repo: currentDid(), collection: CHAT_DECLARATION, rkey: 'self' },
      auth: 'required',
    });
    const allow = data?.value?.allowIncoming;
    if (allow === 'none' || allow === 'following' || allow === 'all') return allow;
    return 'all';
  } catch (error) {
    if (missingRecord(error)) return 'all';
    throw error;
  }
}

export function writeChatDeclaration(allowIncoming) {
  return xrpc('com.atproto.repo.putRecord', {
    body: {
      repo: currentDid(),
      collection: CHAT_DECLARATION,
      rkey: 'self',
      record: new ChatDeclarationRecord(allowIncoming).toJSON(),
    },
    auth: 'required',
  });
}

export function getConvo(convoId, signal) {
  return chat('chat.bsky.convo.getMessages', { params: { convoId, limit: 50 }, signal });
}

export function getConvoView(convoId, signal) {
  return chat('chat.bsky.convo.getConvo', { params: { convoId }, signal });
}

export function markConvoRead(convoId) {
  return chat('chat.bsky.convo.updateRead', { body: { convoId } });
}

export function markAllConvosRead() {
  return chat('chat.bsky.convo.updateAllRead', { body: {} });
}

export function leaveConvo(convoId) {
  return chat('chat.bsky.convo.leaveConvo', { body: { convoId } });
}

export async function sendMessage(convoId, message) {
  const payload = typeof message === 'string' ? { text: message } : { ...message };
  if (!payload.text) payload.text = '';
  if (payload.text && !payload.facets) {
    try {
      const facets = await facetsFor(payload.text);
      if (facets.length) payload.facets = facets;
    } catch {
      /* the text still sends */
    }
  }
  return chat('chat.bsky.convo.sendMessage', { body: { convoId, message: payload } });
}

export function convoForMember(did) {
  return chat('chat.bsky.convo.getConvoForMembers', { params: { members: [did] } });
}
