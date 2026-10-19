export interface BskyUser {
  did: string;
  handle: string;
  displayName?: string;
  avatar?: string;
  description?: string;
  banner?: string;
  followersCount?: number;
  followsCount?: number;
  postsCount?: number;
  indexedAt?: string;
  viewer?: {
    muted?: boolean;
    blockedBy?: boolean;
    following?: string;
    followedBy?: string;
  };
}

export interface BskyPostRecord {
  $type: string;
  text: string;
  createdAt: string;
  facets?: any[];
  reply?: {
    root: { uri: string; cid: string };
    parent: { uri: string; cid: string };
  };
  embed?: any;
}

export interface BskyImageEmbed {
  thumb: string;
  fullsize: string;
  alt: string;
  aspectRatio?: { width: number; height: number };
}

export interface BskyExternalEmbed {
  uri: string;
  title: string;
  description: string;
  thumb?: string;
}

export interface BskyPost {
  uri: string;
  cid: string;
  author: BskyUser;
  record: BskyPostRecord;
  embed?: {
    $type: string;
    images?: BskyImageEmbed[];
    external?: BskyExternalEmbed;
    record?: {
      $type: string;
      record?: any;
      author?: BskyUser;
      value?: any;
      uri?: string;
    };
  };
  replyCount?: number;
  repostCount?: number;
  likeCount?: number;
  indexedAt: string;
  viewer?: {
    like?: string;
    repost?: string;
  };
}

export interface FeedItem {
  post: BskyPost;
  reply?: {
    root: BskyPost;
    parent: BskyPost;
  };
  reason?: {
    $type: string;
    by: BskyUser;
    indexedAt: string;
  };
}

export interface NotificationItem {
  uri: string;
  cid: string;
  author: BskyUser;
  reason: 'like' | 'repost' | 'follow' | 'mention' | 'reply' | 'quote' | string;
  record: any;
  isRead: boolean;
  indexedAt: string;
}

export interface SessionData {
  did: string;
  handle: string;
  email?: string;
  accessJwt: string;
  refreshJwt: string;
  active: boolean;
  avatar?: string;
  displayName?: string;
}
