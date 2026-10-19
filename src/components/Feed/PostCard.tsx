import React, { useState } from 'react';
import {
  Heart,
  Repeat,
  MessageSquare,
  Share,
  Bookmark,
  ExternalLink,
  MoreHorizontal,
  Check,
} from 'lucide-react';
import { BskyPost, FeedItem } from '../../types/bsky';
import { timeAgo, formatNumber, parseRichText } from '../../utils/format';
import { atproto } from '../../services/atproto';
import { storage } from '../../services/storage';
import { LocalAIService } from '../../services/localAI';
import { AIPostAction } from '../AI/AIPostAction';

interface PostCardProps {
  feedItem: FeedItem;
  aiService: LocalAIService;
  onOpenThread?: (post: BskyPost) => void;
  onReply?: (post: BskyPost) => void;
  onOpenUser?: (handleOrDid: string) => void;
}

export const PostCard: React.FC<PostCardProps> = ({
  feedItem,
  aiService,
  onOpenThread,
  onReply,
  onOpenUser,
}) => {
  const post = feedItem.post;
  const isRepost = feedItem.reason?.$type === 'app.bsky.feed.defs#reasonRepost';
  const repostedBy = isRepost ? feedItem.reason?.by : null;

  const [liked, setLiked] = useState(!!post.viewer?.like);
  const [likeCount, setLikeCount] = useState(post.likeCount || 0);
  const [likeUri, setLikeUri] = useState<string | undefined>(post.viewer?.like);

  const [reposted, setReposted] = useState(!!post.viewer?.repost);
  const [repostCount, setRepostCount] = useState(post.repostCount || 0);
  const [repostUri, setRepostUri] = useState<string | undefined>(post.viewer?.repost);

  const [bookmarked, setBookmarked] = useState(storage.isBookmarked(post.uri));
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Like toggle
  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!atproto.isLoggedIn()) return;

    if (liked && likeUri) {
      setLiked(false);
      setLikeCount((prev) => Math.max(0, prev - 1));
      try {
        await atproto.deleteLike(likeUri);
        setLikeUri(undefined);
      } catch {
        setLiked(true);
        setLikeCount((prev) => prev + 1);
      }
    } else {
      setLiked(true);
      setLikeCount((prev) => prev + 1);
      try {
        const res = await atproto.like(post.uri, post.cid);
        setLikeUri(res.uri);
      } catch {
        setLiked(false);
        setLikeCount((prev) => Math.max(0, prev - 1));
      }
    }
  };

  // Repost toggle
  const handleRepost = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!atproto.isLoggedIn()) return;

    if (reposted && repostUri) {
      setReposted(false);
      setRepostCount((prev) => Math.max(0, prev - 1));
      try {
        await atproto.deleteRepost(repostUri);
        setRepostUri(undefined);
      } catch {
        setReposted(true);
        setRepostCount((prev) => prev + 1);
      }
    } else {
      setReposted(true);
      setRepostCount((prev) => prev + 1);
      try {
        const res = await atproto.repost(post.uri, post.cid);
        setRepostUri(res.uri);
      } catch {
        setReposted(false);
        setRepostCount((prev) => Math.max(0, prev - 1));
      }
    }
  };

  // Bookmark toggle
  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    const isNowBookmarked = storage.toggleBookmark(post.uri);
    setBookmarked(isNowBookmarked);
  };

  // Copy link
  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `https://bsky.app/profile/${post.author.handle}/post/${post.uri.split('/').pop()}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const richTokens = parseRichText(post.record?.text || '');

  return (
    <article
      onClick={() => onOpenThread?.(post)}
      className="group relative px-4 py-3.5 bg-black hover:bg-[#070709] border-b border-[#141418] cursor-pointer transition-colors duration-150"
    >
      {/* Repost Header if applicable */}
      {repostedBy && (
        <div className="flex items-center gap-2 mb-2 ml-8 text-[11px] font-semibold text-zinc-500">
          <Repeat className="w-3.5 h-3.5 text-emerald-400" />
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenUser?.(repostedBy.handle);
            }}
            className="hover:underline hover:text-zinc-300 truncate"
          >
            {repostedBy.displayName || repostedBy.handle} reposted
          </button>
        </div>
      )}

      <div className="flex gap-3">
        {/* Author Avatar */}
        <div className="shrink-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenUser?.(post.author.handle);
            }}
            className="relative group/avatar block"
          >
            {post.author.avatar ? (
              <img
                src={post.author.avatar}
                alt={post.author.handle}
                className="w-10 h-10 rounded-full object-cover border border-[#27272a] group-hover/avatar:border-cyan-500 transition"
                loading="lazy"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-[#18181b] border border-[#27272a] flex items-center justify-center font-bold text-cyan-400 text-sm">
                {(post.author.displayName || post.author.handle)[0].toUpperCase()}
              </div>
            )}
          </button>
        </div>

        {/* Post Content Body */}
        <div className="flex-1 min-w-0">
          {/* Header Line: Display Name, Handle, Timestamp */}
          <div className="flex items-center justify-between gap-2 mb-1">
            <div className="flex items-center gap-1.5 truncate">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenUser?.(post.author.handle);
                }}
                className="font-bold text-sm text-zinc-100 hover:underline hover:text-white truncate"
              >
                {post.author.displayName || post.author.handle}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenUser?.(post.author.handle);
                }}
                className="text-xs text-zinc-500 hover:text-zinc-400 truncate"
              >
                @{post.author.handle}
              </button>
              <span className="text-zinc-600 text-xs">·</span>
              <span className="text-xs text-zinc-500 shrink-0">
                {timeAgo(post.record?.createdAt || post.indexedAt)}
              </span>
            </div>

            {/* Top Right Post Actions: Bookmark & Grok AI button */}
            <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
              <AIPostAction
                post={post}
                aiService={aiService}
                onApplyReply={(replyText) => onReply?.({ ...post, record: { ...post.record, text: replyText } })}
              />
            </div>
          </div>

          {/* Post Text with High-Contrast Syntax Highlighting */}
          <div className="text-[14.5px] leading-relaxed text-zinc-100 break-words font-sans selection:bg-cyan-500/30">
            {richTokens.map((token, i) => {
              if (token.type === 'mention') {
                return (
                  <span
                    key={i}
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenUser?.(token.content.slice(1));
                    }}
                    className="text-cyan-400 hover:text-cyan-300 font-medium hover:underline cursor-pointer"
                  >
                    {token.content}
                  </span>
                );
              }
              if (token.type === 'hashtag') {
                return (
                  <span
                    key={i}
                    onClick={(e) => {
                      e.stopPropagation();
                      // Could trigger search for hashtag
                    }}
                    className="text-purple-400 hover:text-purple-300 font-medium hover:underline cursor-pointer"
                  >
                    {token.content}
                  </span>
                );
              }
              if (token.type === 'link') {
                return (
                  <a
                    key={i}
                    href={token.url}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-sky-400 hover:text-sky-300 hover:underline inline-flex items-center gap-0.5"
                  >
                    {token.content.length > 35 ? `${token.content.slice(0, 32)}...` : token.content}
                    <ExternalLink className="w-3 h-3 inline" />
                  </a>
                );
              }
              return <span key={i}>{token.content}</span>;
            })}
          </div>

          {/* Image Embeds */}
          {post.embed?.images && post.embed.images.length > 0 && (
            <div
              className={`mt-3 grid gap-1.5 rounded-2xl overflow-hidden border border-[#222228] ${
                post.embed.images.length === 1
                  ? 'grid-cols-1 max-h-96'
                  : post.embed.images.length === 2
                  ? 'grid-cols-2 max-h-72'
                  : 'grid-cols-2 sm:grid-cols-3 max-h-72'
              }`}
            >
              {post.embed.images.map((img, i) => (
                <div
                  key={i}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImage(img.fullsize || img.thumb);
                  }}
                  className="relative overflow-hidden bg-zinc-900 aspect-video cursor-zoom-in"
                >
                  <img
                    src={img.thumb}
                    alt={img.alt || 'Post image'}
                    className="w-full h-full object-cover hover:scale-105 transition duration-300"
                    loading="lazy"
                  />
                  {img.alt && (
                    <span className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded text-[10px] bg-black/80 text-zinc-300 uppercase tracking-wider font-bold">
                      ALT
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* External Link Card Embed */}
          {post.embed?.external && (
            <a
              href={post.embed.external.uri}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="mt-3 block rounded-2xl overflow-hidden border border-[#222228] bg-[#0c0c0e] hover:border-zinc-700 transition group/card"
            >
              {post.embed.external.thumb && (
                <div className="aspect-video w-full overflow-hidden bg-black">
                  <img
                    src={post.embed.external.thumb}
                    alt=""
                    className="w-full h-full object-cover group-hover/card:scale-102 transition duration-300"
                    loading="lazy"
                  />
                </div>
              )}
              <div className="p-3">
                <div className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider truncate">
                  {new URL(post.embed.external.uri).hostname}
                </div>
                <div className="text-xs font-bold text-white group-hover/card:text-cyan-400 transition line-clamp-1 mt-0.5">
                  {post.embed.external.title}
                </div>
                {post.embed.external.description && (
                  <p className="text-xs text-zinc-400 line-clamp-2 mt-1">
                    {post.embed.external.description}
                  </p>
                )}
              </div>
            </a>
          )}

          {/* Quote Post Embed */}
          {post.embed?.record?.value && (
            <div className="mt-3 p-3 rounded-2xl border border-[#222228] bg-[#0c0c0e] hover:border-zinc-700 transition">
              <div className="flex items-center gap-1.5 mb-1.5">
                {post.embed.record.author?.avatar && (
                  <img
                    src={post.embed.record.author.avatar}
                    alt=""
                    className="w-5 h-5 rounded-full object-cover"
                  />
                )}
                <span className="text-xs font-bold text-white">
                  {post.embed.record.author?.displayName || post.embed.record.author?.handle}
                </span>
                <span className="text-[11px] text-zinc-500">
                  @{post.embed.record.author?.handle}
                </span>
              </div>
              <p className="text-xs text-zinc-300 line-clamp-3">
                {post.embed.record.value.text}
              </p>
            </div>
          )}

          {/* Bottom Action Bar: Reply, Repost, Like, Share, Bookmark */}
          <div className="flex items-center justify-between mt-3 pt-2 text-zinc-500 max-w-md">
            {/* Reply */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onReply?.(post);
              }}
              className="flex items-center gap-1.5 text-xs hover:text-cyan-400 transition group/action"
            >
              <div className="p-1.5 rounded-full group-hover/action:bg-cyan-950/40">
                <MessageSquare className="w-4 h-4" />
              </div>
              <span>{formatNumber(post.replyCount)}</span>
            </button>

            {/* Repost */}
            <button
              onClick={handleRepost}
              className={`flex items-center gap-1.5 text-xs transition group/action ${
                reposted ? 'text-emerald-400 font-semibold' : 'hover:text-emerald-400'
              }`}
            >
              <div className="p-1.5 rounded-full group-hover/action:bg-emerald-950/40">
                <Repeat className={`w-4 h-4 ${reposted ? 'text-emerald-400' : ''}`} />
              </div>
              <span>{formatNumber(repostCount)}</span>
            </button>

            {/* Like */}
            <button
              onClick={handleLike}
              className={`flex items-center gap-1.5 text-xs transition group/action ${
                liked ? 'text-rose-500 font-semibold' : 'hover:text-rose-500'
              }`}
            >
              <div className="p-1.5 rounded-full group-hover/action:bg-rose-950/40">
                <Heart
                  className={`w-4 h-4 transition-transform duration-200 active:scale-125 ${
                    liked ? 'fill-rose-500 text-rose-500' : ''
                  }`}
                />
              </div>
              <span>{formatNumber(likeCount)}</span>
            </button>

            {/* Bookmark */}
            <button
              onClick={handleBookmark}
              className={`flex items-center gap-1.5 text-xs transition group/action ${
                bookmarked ? 'text-cyan-400 font-semibold' : 'hover:text-cyan-400'
              }`}
            >
              <div className="p-1.5 rounded-full group-hover/action:bg-cyan-950/40">
                <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-cyan-400 text-cyan-400' : ''}`} />
              </div>
            </button>

            {/* Share / Copy Link */}
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 text-xs hover:text-white transition group/action"
              title="Copy post link"
            >
              <div className="p-1.5 rounded-full group-hover/action:bg-zinc-800">
                {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share className="w-4 h-4" />}
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Lightbox Zoom Modal for Images */}
      {selectedImage && (
        <div
          onClick={(e) => {
            e.stopPropagation();
            setSelectedImage(null);
          }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md cursor-zoom-out animate-fade-in"
        >
          <img
            src={selectedImage}
            alt=""
            className="max-w-[90vw] max-h-[90vh] object-contain rounded-xl shadow-2xl"
          />
        </div>
      )}
    </article>
  );
};
