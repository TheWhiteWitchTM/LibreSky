import { BskyAgent, RichText } from '@atproto/api';
import { BskyPost, BskyUser, FeedItem, NotificationItem, SessionData } from '../types/bsky';
import { storage } from './storage';

const DEFAULT_SERVICE = 'https://bsky.social';
const PUBLIC_SERVICE = 'https://public.api.bsky.app';

export class AtprotoService {
  private agent: BskyAgent;
  private publicAgent: BskyAgent;
  private currentSession: SessionData | null = null;

  constructor() {
    this.agent = new BskyAgent({ service: DEFAULT_SERVICE });
    this.publicAgent = new BskyAgent({ service: PUBLIC_SERVICE });

    // Try resuming session
    const saved = storage.getSession();
    if (saved) {
      this.currentSession = saved;
      try {
        this.agent.resumeSession({
          did: saved.did,
          handle: saved.handle,
          email: saved.email,
          accessJwt: saved.accessJwt,
          refreshJwt: saved.refreshJwt,
          active: true,
        }).catch((err) => {
          console.warn('Session resume failed, fallback to guest/public mode:', err);
        });
      } catch (err) {
        console.warn('Invalid saved session:', err);
      }
    }
  }

  isLoggedIn(): boolean {
    return !!this.currentSession?.accessJwt;
  }

  getSession(): SessionData | null {
    return this.currentSession;
  }

  getAgent(): BskyAgent {
    return this.isLoggedIn() ? this.agent : this.publicAgent;
  }

  /**
   * Log in with handle/email and App Password
   */
  async login(identifier: string, password: string, serviceUrl: string = DEFAULT_SERVICE): Promise<SessionData> {
    const cleanService = serviceUrl.trim().replace(/\/+$/, '') || DEFAULT_SERVICE;
    this.agent = new BskyAgent({ service: cleanService });

    const res = await this.agent.login({
      identifier: identifier.trim(),
      password: password.trim(),
    });

    if (!res.success) {
      throw new Error('Authentication failed');
    }

    const sessionData: SessionData = {
      did: res.data.did,
      handle: res.data.handle,
      email: res.data.email,
      accessJwt: res.data.accessJwt,
      refreshJwt: res.data.refreshJwt,
      active: res.data.active ?? true,
    };

    // Fetch user profile to get avatar & display name
    try {
      const profileRes = await this.agent.getProfile({ actor: sessionData.did });
      if (profileRes.success) {
        sessionData.avatar = profileRes.data.avatar;
        sessionData.displayName = profileRes.data.displayName;
      }
    } catch {}

    this.currentSession = sessionData;
    storage.setSession(sessionData);
    return sessionData;
  }

  logout() {
    this.currentSession = null;
    storage.setSession(null);
    this.agent = new BskyAgent({ service: DEFAULT_SERVICE });
  }

  /**
   * Fetch home timeline (or discover feed if guest)
   */
  async getTimeline(cursor?: string): Promise<{ items: FeedItem[]; cursor?: string }> {
    if (this.isLoggedIn()) {
      try {
        const res = await this.agent.getTimeline({ cursor, limit: 30 });
        return {
          items: res.data.feed as unknown as FeedItem[],
          cursor: res.data.cursor,
        };
      } catch (e: any) {
        console.error('Timeline error:', e);
        // Fallback to discover feed
      }
    }

    // Public / Discover feed fallback (What's Hot feed)
    return this.getFeed('at://did:plc:z72i7hdynmk6r22z27h6tvur/app.bsky.feed.generator/whats-hot', cursor);
  }

  /**
   * Fetch a specific feed (e.g. Discover, What's Hot, Tech, etc.)
   */
  async getFeed(feedUri: string, cursor?: string): Promise<{ items: FeedItem[]; cursor?: string }> {
    const agent = this.getAgent();
    try {
      const res = await agent.app.bsky.feed.getFeed({
        feed: feedUri,
        cursor,
        limit: 30,
      });
      return {
        items: res.data.feed as unknown as FeedItem[],
        cursor: res.data.cursor,
      };
    } catch (e: any) {
      console.error('Feed error:', e);
      throw e;
    }
  }

  /**
   * Fetch author feed (posts, replies, media)
   */
  async getAuthorFeed(actor: string, filter: 'posts_and_author_threads' | 'posts_with_replies' | 'posts_with_media' = 'posts_and_author_threads', cursor?: string): Promise<{ items: FeedItem[]; cursor?: string }> {
    const agent = this.getAgent();
    const res = await agent.getAuthorFeed({
      actor,
      filter,
      cursor,
      limit: 30,
    });
    return {
      items: res.data.feed as unknown as FeedItem[],
      cursor: res.data.cursor,
    };
  }

  /**
   * Fetch thread details (original post, parents, replies tree)
   */
  async getPostThread(uri: string): Promise<any> {
    const agent = this.getAgent();
    const res = await agent.getPostThread({ uri, depth: 6, parentHeight: 6 });
    return res.data.thread;
  }

  /**
   * Fetch user profile
   */
  async getProfile(actor: string): Promise<BskyUser> {
    const agent = this.getAgent();
    const res = await agent.getProfile({ actor });
    return res.data as BskyUser;
  }

  /**
   * Create post with auto-detected RichText facets (@mentions, #hashtags, links)
   */
  async createPost(params: {
    text: string;
    replyTo?: { root: { uri: string; cid: string }; parent: { uri: string; cid: string } };
    images?: { blob: any; alt: string; aspectRatio?: { width: number; height: number } }[];
  }): Promise<{ uri: string; cid: string }> {
    if (!this.isLoggedIn()) {
      throw new Error('You must be signed in to post.');
    }

    const rt = new RichText({ text: params.text });
    await rt.detectFacets(this.agent);

    const postRecord: any = {
      $type: 'app.bsky.feed.post',
      text: rt.text,
      facets: rt.facets,
      createdAt: new Date().toISOString(),
    };

    if (params.replyTo) {
      postRecord.reply = params.replyTo;
    }

    if (params.images && params.images.length > 0) {
      postRecord.embed = {
        $type: 'app.bsky.embed.images',
        images: params.images.map((img) => ({
          image: img.blob,
          alt: img.alt || '',
          aspectRatio: img.aspectRatio,
        })),
      };
    }

    const res = await this.agent.post(postRecord);
    return res;
  }

  /**
   * Like a post
   */
  async like(uri: string, cid: string): Promise<{ uri: string }> {
    if (!this.isLoggedIn()) throw new Error('Sign in required');
    return this.agent.like(uri, cid);
  }

  /**
   * Delete like
   */
  async deleteLike(likeUri: string): Promise<void> {
    if (!this.isLoggedIn()) throw new Error('Sign in required');
    return this.agent.deleteLike(likeUri);
  }

  /**
   * Repost a post
   */
  async repost(uri: string, cid: string): Promise<{ uri: string }> {
    if (!this.isLoggedIn()) throw new Error('Sign in required');
    return this.agent.repost(uri, cid);
  }

  /**
   * Delete repost
   */
  async deleteRepost(repostUri: string): Promise<void> {
    if (!this.isLoggedIn()) throw new Error('Sign in required');
    return this.agent.deleteRepost(repostUri);
  }

  /**
   * Autocomplete typeahead for @ mentions
   */
  async searchActorsTypeahead(term: string): Promise<BskyUser[]> {
    if (!term || term.trim().length === 0) return [];
    try {
      const agent = this.getAgent();
      const res = await agent.searchActorsTypeahead({ q: term.trim(), limit: 8 });
      return res.data.actors as BskyUser[];
    } catch {
      return [];
    }
  }

  /**
   * Search posts
   */
  async searchPosts(query: string, cursor?: string): Promise<{ posts: BskyPost[]; cursor?: string }> {
    const agent = this.getAgent();
    const res = await agent.app.bsky.feed.searchPosts({ q: query, cursor, limit: 25 });
    return {
      posts: res.data.posts as unknown as BskyPost[],
      cursor: res.data.cursor,
    };
  }

  /**
   * Notifications
   */
  async getNotifications(cursor?: string): Promise<{ notifications: NotificationItem[]; cursor?: string }> {
    if (!this.isLoggedIn()) return { notifications: [] };
    const res = await this.agent.listNotifications({ cursor, limit: 30 });
    return {
      notifications: res.data.notifications as unknown as NotificationItem[],
      cursor: res.data.cursor,
    };
  }

  async getUnreadNotificationCount(): Promise<number> {
    if (!this.isLoggedIn()) return 0;
    try {
      const res = await this.agent.countUnreadNotifications();
      return res.data.count || 0;
    } catch {
      return 0;
    }
  }

  async markNotificationsSeen(): Promise<void> {
    if (!this.isLoggedIn()) return;
    try {
      await this.agent.updateSeenNotifications(new Date().toISOString());
    } catch {}
  }

  /**
   * Upload image blob
   */
  async uploadImage(file: File): Promise<{ blob: any; aspectRatio?: { width: number; height: number } }> {
    if (!this.isLoggedIn()) throw new Error('Sign in required');

    // Get aspect ratio
    const img = new Image();
    const url = URL.createObjectURL(file);
    let aspectRatio: { width: number; height: number } | undefined;
    try {
      await new Promise((resolve) => {
        img.onload = () => {
          aspectRatio = { width: img.naturalWidth, height: img.naturalHeight };
          resolve(true);
        };
        img.src = url;
      });
    } finally {
      URL.revokeObjectURL(url);
    }

    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    const res = await this.agent.uploadBlob(uint8Array, {
      encoding: file.type || 'image/jpeg',
    });

    return {
      blob: res.data.blob,
      aspectRatio,
    };
  }
}

export const atproto = new AtprotoService();
