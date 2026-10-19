import React, { useEffect, useState } from 'react';
import { ArrowLeft, Calendar, Users, FileText, Loader2, Link as LinkIcon } from 'lucide-react';
import { BskyUser, FeedItem, BskyPost } from '../../types/bsky';
import { atproto } from '../../services/atproto';
import { LocalAIService } from '../../services/localAI';
import { PostCard } from '../Feed/PostCard';
import { formatNumber } from '../../utils/format';

interface ProfileViewProps {
  actorHandleOrDid: string;
  aiService: LocalAIService;
  onBack?: () => void;
  onOpenThread: (post: BskyPost) => void;
  onOpenUser: (handle: string) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  actorHandleOrDid,
  aiService,
  onBack,
  onOpenThread,
  onOpenUser,
}) => {
  const [profile, setProfile] = useState<BskyUser | null>(null);
  const [posts, setPosts] = useState<FeedItem[]>([]);
  const [filter, setFilter] = useState<'posts_and_author_threads' | 'posts_with_replies' | 'posts_with_media'>('posts_and_author_threads');
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    loadProfileAndFeed();
  }, [actorHandleOrDid, filter]);

  const loadProfileAndFeed = async () => {
    setLoading(true);
    try {
      const user = await atproto.getProfile(actorHandleOrDid);
      setProfile(user);
      setIsFollowing(!!user.viewer?.following);

      const feedRes = await atproto.getAuthorFeed(actorHandleOrDid, filter);
      setPosts(feedRes.items);
    } catch (err) {
      console.error('Failed to load profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFollow = async () => {
    if (!atproto.isLoggedIn() || !profile) return;
    try {
      if (isFollowing && profile.viewer?.following) {
        await atproto.getAgent().deleteFollow(profile.viewer.following);
        setIsFollowing(false);
      } else {
        await atproto.getAgent().follow(profile.did);
        setIsFollowing(true);
      }
    } catch (e) {
      console.error('Follow error:', e);
    }
  };

  if (loading && !profile) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-zinc-500">
        <Loader2 className="w-8 h-8 animate-spin text-cyan-400 mb-2" />
        <span className="text-xs">Loading profile...</span>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="p-8 text-center text-zinc-400">
        <p>Profile not found or could not be loaded.</p>
        {onBack && (
          <button onClick={onBack} className="mt-4 px-3 py-1.5 rounded-lg bg-zinc-800 text-xs text-white">
            Go Back
          </button>
        )}
      </div>
    );
  }

  const isMe = atproto.getSession()?.did === profile.did;

  return (
    <div className="min-h-screen bg-black">
      {/* Header bar */}
      <div className="sticky top-0 z-30 flex items-center gap-4 px-4 py-3 bg-black/85 backdrop-blur-md border-b border-[#1c1c22]">
        {onBack && (
          <button
            onClick={onBack}
            className="p-1.5 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}
        <div>
          <h2 className="font-bold text-sm text-white truncate">{profile.displayName || profile.handle}</h2>
          <p className="text-[11px] text-zinc-500 font-mono">{formatNumber(profile.postsCount)} posts</p>
        </div>
      </div>

      {/* Banner */}
      <div className="relative h-44 sm:h-52 bg-gradient-to-r from-zinc-900 to-black overflow-hidden border-b border-[#1c1c22]">
        {profile.banner && (
          <img src={profile.banner} alt="" className="w-full h-full object-cover" />
        )}
      </div>

      {/* Profile Details Container */}
      <div className="px-5 pb-4 border-b border-[#1c1c22]">
        <div className="flex items-end justify-between -mt-14 mb-3">
          {/* Avatar */}
          <div className="relative">
            {profile.avatar ? (
              <img
                src={profile.avatar}
                alt={profile.handle}
                className="w-24 h-24 rounded-full object-cover border-4 border-black bg-zinc-900 shadow-2xl"
              />
            ) : (
              <div className="w-24 h-24 rounded-full border-4 border-black bg-[#16161b] flex items-center justify-center font-bold text-2xl text-cyan-400">
                {profile.handle[0].toUpperCase()}
              </div>
            )}
          </div>

          {/* Action button: Edit or Follow */}
          {!isMe && (
            <button
              onClick={handleToggleFollow}
              className={`px-5 py-2 rounded-full text-xs font-bold transition shadow-lg ${
                isFollowing
                  ? 'bg-zinc-900 hover:bg-rose-950/80 hover:text-rose-300 hover:border-rose-800 border border-zinc-700 text-white'
                  : 'bg-cyan-500 hover:bg-cyan-400 text-black shadow-cyan-500/20'
              }`}
            >
              {isFollowing ? 'Following' : 'Follow'}
            </button>
          )}
        </div>

        {/* Names */}
        <h1 className="text-xl font-extrabold text-white leading-tight">{profile.displayName || profile.handle}</h1>
        <p className="text-xs text-zinc-500 font-mono mb-3">@{profile.handle}</p>

        {/* Bio */}
        {profile.description && (
          <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed whitespace-pre-wrap mb-3 font-sans">
            {profile.description}
          </p>
        )}

        {/* Follow stats */}
        <div className="flex items-center gap-4 text-xs text-zinc-400">
          <div>
            <strong className="text-white font-bold">{formatNumber(profile.followsCount)}</strong>{' '}
            <span className="text-zinc-500">Following</span>
          </div>
          <div>
            <strong className="text-white font-bold">{formatNumber(profile.followersCount)}</strong>{' '}
            <span className="text-zinc-500">Followers</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#1c1c22] bg-black">
        {[
          { id: 'posts_and_author_threads', label: 'Posts' },
          { id: 'posts_with_replies', label: 'Replies' },
          { id: 'posts_with_media', label: 'Media' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id as any)}
            className={`flex-1 py-3 text-xs font-bold transition relative ${
              filter === tab.id
                ? 'text-white'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            {tab.label}
            {filter === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400" />
            )}
          </button>
        ))}
      </div>

      {/* Post List */}
      <div>
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-cyan-400" />
          </div>
        ) : posts.length > 0 ? (
          posts.map((item) => (
            <PostCard
              key={item.post.uri}
              feedItem={item}
              aiService={aiService}
              onOpenThread={onOpenThread}
              onOpenUser={onOpenUser}
            />
          ))
        ) : (
          <div className="py-16 text-center text-zinc-500 text-xs">
            No posts found in this tab.
          </div>
        )}
      </div>
    </div>
  );
};
