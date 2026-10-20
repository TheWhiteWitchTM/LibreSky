// LibreSky AT Protocol API Client
import { state, setSession, clearSession } from './state.js';

const PUBLIC_XRPC = 'https://public.api.bsky.app/xrpc';
const WHATS_HOT_FEED = 'at://did:plc:z72i7hdynmk6r22z27h6tvur/app.bsky.feed.generator/whats-hot';

export function getXrpcBase() {
  if (state.session && state.session.accessJwt) {
    return (state.pdsUrl || 'https://bsky.social').replace(/\/$/, '') + '/xrpc';
  }
  return PUBLIC_XRPC;
}

export async function request(endpoint, options = {}) {
  const base = options.publicOnly ? PUBLIC_XRPC : getXrpcBase();
  const url = new URL(base + '/' + endpoint);

  if (options.params) {
    Object.entries(options.params).forEach(([k, v]) => {
      if (v !== undefined && v !== null) url.searchParams.set(k, String(v));
    });
  }

  const headers = { ...(options.headers || {}) };
  if (!options.publicOnly && state.session?.accessJwt) {
    headers['Authorization'] = `Bearer ${state.session.accessJwt}`;
  }

  let body = options.body;
  if (body && typeof body === 'object' && !(body instanceof Blob) && !(body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
    body = JSON.stringify(body);
  }

  try {
    let res = await fetch(url.toString(), {
      method: options.method || 'GET',
      headers,
      body,
    });

    // Check for expired token
    if (res.status === 401 && state.session?.refreshJwt && !options._retried) {
      const refreshed = await refreshSession();
      if (refreshed) {
        return request(endpoint, { ...options, _retried: true });
      }
    }

    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      const msg = errJson.message || `Request failed with status ${res.status}`;
      const err = new Error(msg);
      err.status = res.status;
      err.data = errJson;
      throw err;
    }

    return await res.json();
  } catch (err) {
    // If authenticated request failed and can fallback to public
    if (!options.publicOnly && options.allowPublicFallback && !state.session?.accessJwt) {
      return request(endpoint, { ...options, publicOnly: true });
    }
    throw err;
  }
}

// ----------------- Authentication -----------------

export async function createSession(identifier, password, pdsUrl = 'https://bsky.social') {
  const url = pdsUrl.replace(/\/$/, '') + '/xrpc/com.atproto.server.createSession';
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier: identifier.trim(), password }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Login failed. Please verify your handle and App Password.');
  }

  const sessionData = await res.json();
  state.pdsUrl = pdsUrl;

  // Fetch full profile to get display name and avatar
  try {
    const profile = await fetch(pdsUrl.replace(/\/$/, '') + `/xrpc/app.bsky.actor.getProfile?actor=${sessionData.did}`, {
      headers: { Authorization: `Bearer ${sessionData.accessJwt}` },
    }).then((r) => r.json());
    sessionData.avatar = profile.avatar;
    sessionData.displayName = profile.displayName || sessionData.handle;
  } catch (e) {
    console.warn('Failed to fetch full profile after login', e);
  }

  setSession(sessionData);
  return sessionData;
}

export async function refreshSession() {
  if (!state.session?.refreshJwt) return false;
  try {
    const pds = state.pdsUrl || 'https://bsky.social';
    const res = await fetch(pds.replace(/\/$/, '') + '/xrpc/com.atproto.server.refreshSession', {
      method: 'POST',
      headers: { Authorization: `Bearer ${state.session.refreshJwt}` },
    });
    if (!res.ok) {
      clearSession();
      return false;
    }
    const data = await res.json();
    setSession({
      ...state.session,
      accessJwt: data.accessJwt,
      refreshJwt: data.refreshJwt,
      handle: data.handle || state.session.handle,
    });
    return true;
  } catch (err) {
    clearSession();
    return false;
  }
}

export function logout() {
  clearSession();
}

// ----------------- Feeds & Posts -----------------

export async function getTimeline(cursor = null, limit = 30) {
  if (state.session?.accessJwt) {
    return request('app.bsky.feed.getTimeline', {
      params: { cursor, limit },
    });
  }
  // Public fallback to What's Hot Discover feed
  return getDiscoverFeed(cursor, limit);
}

export async function getDiscoverFeed(cursor = null, limit = 30) {
  return request('app.bsky.feed.getFeed', {
    params: { feed: WHATS_HOT_FEED, cursor, limit },
    allowPublicFallback: true,
  });
}

export async function getPostThread(uri, depth = 8) {
  return request('app.bsky.feed.getPostThread', {
    params: { uri, depth },
    allowPublicFallback: true,
  });
}

export async function getProfile(actor) {
  return request('app.bsky.actor.getProfile', {
    params: { actor },
    allowPublicFallback: true,
  });
}

export async function getAuthorFeed(actor, filter = 'posts_and_author_threads', cursor = null, limit = 30) {
  return request('app.bsky.feed.getAuthorFeed', {
    params: { actor, filter, cursor, limit },
    allowPublicFallback: true,
  });
}

export async function searchPosts(q, sort = 'latest', cursor = null, limit = 25) {
  return request('app.bsky.feed.searchPosts', {
    params: { q, sort, cursor, limit },
    allowPublicFallback: true,
  });
}

export async function searchActors(q, limit = 20) {
  return request('app.bsky.actor.searchActors', {
    params: { q, limit },
    allowPublicFallback: true,
  });
}

export async function resolveHandle(handle) {
  const res = await request('com.atproto.identity.resolveHandle', {
    params: { handle },
    publicOnly: true,
  });
  return res.did;
}

// ----------------- Notifications -----------------

export async function getNotifications(cursor = null, limit = 30) {
  if (!state.session?.accessJwt) return { notifications: [] };
  return request('app.bsky.notification.listNotifications', {
    params: { cursor, limit },
  });
}

export async function getUnreadNotificationCount() {
  if (!state.session?.accessJwt) return 0;
  try {
    const res = await request('app.bsky.notification.getUnreadCount');
    return res.count || 0;
  } catch (e) {
    return 0;
  }
}

// ----------------- Chat / Direct Messages -----------------

export async function listConvos(limit = 20) {
  if (!state.session?.accessJwt) return { convos: [] };
  // Chat XRPC typically uses bsky.chat or main PDS
  const base = 'https://api.bsky.chat/xrpc';
  try {
    const res = await fetch(`${base}/chat.bsky.convo.listConvos?limit=${limit}`, {
      headers: { Authorization: `Bearer ${state.session.accessJwt}` },
    });
    if (!res.ok) return { convos: [] };
    return await res.json();
  } catch (e) {
    return { convos: [] };
  }
}

// ----------------- Interactions -----------------

export async function likePost(uri, cid) {
  if (!state.session) throw new Error('Please log in to like posts');
  const now = new Date().toISOString();
  return request('com.atproto.repo.createRecord', {
    method: 'POST',
    body: {
      repo: state.session.did,
      collection: 'app.bsky.feed.like',
      record: {
        $type: 'app.bsky.feed.like',
        subject: { uri, cid },
        createdAt: now,
      },
    },
  });
}

export async function deleteLike(likeUri) {
  if (!state.session) return;
  const rkey = likeUri.split('/').pop();
  return request('com.atproto.repo.deleteRecord', {
    method: 'POST',
    body: {
      repo: state.session.did,
      collection: 'app.bsky.feed.like',
      rkey,
    },
  });
}

export async function repost(uri, cid) {
  if (!state.session) throw new Error('Please log in to repost');
  const now = new Date().toISOString();
  return request('com.atproto.repo.createRecord', {
    method: 'POST',
    body: {
      repo: state.session.did,
      collection: 'app.bsky.feed.repost',
      record: {
        $type: 'app.bsky.feed.repost',
        subject: { uri, cid },
        createdAt: now,
      },
    },
  });
}

export async function deleteRepost(repostUri) {
  if (!state.session) return;
  const rkey = repostUri.split('/').pop();
  return request('com.atproto.repo.deleteRecord', {
    method: 'POST',
    body: {
      repo: state.session.did,
      collection: 'app.bsky.feed.repost',
      rkey,
    },
  });
}

export async function followUser(subjectDid) {
  if (!state.session) throw new Error('Please log in to follow users');
  const now = new Date().toISOString();
  return request('com.atproto.repo.createRecord', {
    method: 'POST',
    body: {
      repo: state.session.did,
      collection: 'app.bsky.graph.follow',
      record: {
        $type: 'app.bsky.graph.follow',
        subject: subjectDid,
        createdAt: now,
      },
    },
  });
}

export async function unfollowUser(followUri) {
  if (!state.session) return;
  const rkey = followUri.split('/').pop();
  return request('com.atproto.repo.deleteRecord', {
    method: 'POST',
    body: {
      repo: state.session.did,
      collection: 'app.bsky.graph.follow',
      rkey,
    },
  });
}

// ----------------- Media Upload & Post Creation -----------------

export async function uploadBlob(file) {
  if (!state.session) throw new Error('Must be logged in to upload media');
  const pds = (state.pdsUrl || 'https://bsky.social').replace(/\/$/, '');
  const res = await fetch(`${pds}/xrpc/com.atproto.repo.uploadBlob`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${state.session.accessJwt}`,
      'Content-Type': file.type || 'image/jpeg',
    },
    body: file,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Media upload failed');
  }

  return await res.json();
}

/**
 * Parses UTF-8 byte slices for links, mentions, and tags as required by ATProto.
 */
export function extractFacets(text) {
  const encoder = new TextEncoder();
  const facets = [];

  // Match URLs
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  let match;
  while ((match = urlRegex.exec(text)) !== null) {
    const uri = match[1];
    const byteStart = encoder.encode(text.slice(0, match.index)).length;
    const byteEnd = byteStart + encoder.encode(uri).length;
    facets.push({
      index: { byteStart, byteEnd },
      features: [{ $type: 'app.bsky.richtext.facet#link', uri }],
    });
  }

  // Match mentions: @handle.domain
  const mentionRegex = /(^|\s)@([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;
  while ((match = mentionRegex.exec(text)) !== null) {
    const fullMatch = match[0];
    const handle = match[2];
    const offset = match[1].length;
    const byteStart = encoder.encode(text.slice(0, match.index + offset)).length;
    const byteEnd = byteStart + encoder.encode('@' + handle).length;
    facets.push({
      index: { byteStart, byteEnd },
      features: [{ $type: 'app.bsky.richtext.facet#mention', did: handle }], // Note: Resolution handles did or client view
    });
  }

  // Match hashtags: #tag
  const tagRegex = /(^|\s)#([a-zA-Z0-9_]+)/g;
  while ((match = tagRegex.exec(text)) !== null) {
    const tag = match[2];
    const offset = match[1].length;
    const byteStart = encoder.encode(text.slice(0, match.index + offset)).length;
    const byteEnd = byteStart + encoder.encode('#' + tag).length;
    facets.push({
      index: { byteStart, byteEnd },
      features: [{ $type: 'app.bsky.richtext.facet#tag', tag }],
    });
  }

  return facets;
}

export async function createPost({ text, replyTo = null, quotePost = null, images = [] }) {
  if (!state.session) throw new Error('Please log in to publish posts');

  const now = new Date().toISOString();
  const facets = extractFacets(text);
  for (const facet of facets) {
    for (const feature of facet.features || []) {
      if (feature.$type === 'app.bsky.richtext.facet#mention' && feature.did && !String(feature.did).startsWith('did:')) {
        try {
          feature.did = await resolveHandle(feature.did);
        } catch {
          feature.did = '';
        }
      }
    }
    facet.features = (facet.features || []).filter((feature) => feature.$type !== 'app.bsky.richtext.facet#mention' || feature.did);
  }
  const usableFacets = facets.filter((facet) => facet.features?.length);

  const record = {
    $type: 'app.bsky.feed.post',
    text,
    createdAt: now,
  };

  if (usableFacets.length > 0) {
    record.facets = usableFacets;
  }

  if (replyTo) {
    record.reply = {
      root: { uri: replyTo.root?.uri || replyTo.uri, cid: replyTo.root?.cid || replyTo.cid },
      parent: { uri: replyTo.uri, cid: replyTo.cid },
    };
  }

  // Embeds: images and quotes
  if (images && images.length > 0 && quotePost) {
    record.embed = {
      $type: 'app.bsky.embed.recordWithMedia',
      record: {
        record: { uri: quotePost.uri, cid: quotePost.cid },
      },
      media: {
        $type: 'app.bsky.embed.images',
        images: images.map((img) => ({
          image: img.blob,
          alt: img.alt || '',
        })),
      },
    };
  } else if (images && images.length > 0) {
    record.embed = {
      $type: 'app.bsky.embed.images',
      images: images.map((img) => ({
        image: img.blob,
        alt: img.alt || '',
      })),
    };
  } else if (quotePost) {
    record.embed = {
      $type: 'app.bsky.embed.record',
      record: { uri: quotePost.uri, cid: quotePost.cid },
    };
  }

  return request('com.atproto.repo.createRecord', {
    method: 'POST',
    body: {
      repo: state.session.did,
      collection: 'app.bsky.feed.post',
      record,
    },
  });
}
