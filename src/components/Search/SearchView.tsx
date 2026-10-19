import React, { useState, useEffect } from 'react';
import { Search, Loader2, User, MessageSquare } from 'lucide-react';
import { BskyPost, BskyUser, FeedItem } from '../../types/bsky';
import { atproto } from '../../services/atproto';
import { LocalAIService } from '../../services/localAI';
import { PostCard } from '../Feed/PostCard';

interface SearchViewProps {
  initialQuery?: string;
  aiService: LocalAIService;
  onOpenThread: (post: BskyPost) => void;
  onOpenUser: (handle: string) => void;
}

export const SearchView: React.FC<SearchViewProps> = ({
  initialQuery = '',
  aiService,
  onOpenThread,
  onOpenUser,
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [tab, setTab] = useState<'posts' | 'people'>('posts');
  const [posts, setPosts] = useState<BskyPost[]>([]);
  const [people, setPeople] = useState<BskyUser[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
      performSearch(initialQuery, tab);
    }
  }, [initialQuery]);

  const performSearch = async (searchTerm: string, currentTab: 'posts' | 'people') => {
    if (!searchTerm.trim()) return;
    setLoading(true);
    try {
      if (currentTab === 'posts') {
        const res = await atproto.searchPosts(searchTerm.trim());
        setPosts(res.posts);
      } else {
        const res = await atproto.searchActorsTypeahead(searchTerm.trim());
        setPeople(res);
      }
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(query, tab);
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Search Header */}
      <div className="sticky top-0 z-30 p-4 bg-black/85 backdrop-blur-md border-b border-[#1c1c22] space-y-3">
        <form onSubmit={handleSubmit} className="relative">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search keywords, #hashtags, @users..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#0e0e12] border border-[#23232c] text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-cyan-500 transition"
          />
        </form>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => {
              setTab('posts');
              if (query.trim()) performSearch(query, 'posts');
            }}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition flex items-center gap-1.5 ${
              tab === 'posts'
                ? 'bg-cyan-500 text-black'
                : 'bg-zinc-900 text-zinc-400 hover:text-white'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" /> Posts
          </button>
          <button
            type="button"
            onClick={() => {
              setTab('people');
              if (query.trim()) performSearch(query, 'people');
            }}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition flex items-center gap-1.5 ${
              tab === 'people'
                ? 'bg-cyan-500 text-black'
                : 'bg-zinc-900 text-zinc-400 hover:text-white'
            }`}
          >
            <User className="w-3.5 h-3.5" /> People
          </button>
        </div>
      </div>

      {/* Content */}
      <div>
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-cyan-400" />
          </div>
        ) : tab === 'posts' ? (
          posts.length > 0 ? (
            posts.map((post) => (
              <PostCard
                key={post.uri}
                feedItem={{ post }}
                aiService={aiService}
                onOpenThread={onOpenThread}
                onOpenUser={onOpenUser}
              />
            ))
          ) : (
            <div className="py-20 text-center text-zinc-500 text-xs">
              {query ? 'No matching posts found.' : 'Type a query to search posts across Bluesky.'}
            </div>
          )
        ) : people.length > 0 ? (
          <div className="divide-y divide-[#141418]">
            {people.map((person) => (
              <div
                key={person.did}
                onClick={() => onOpenUser(person.handle)}
                className="flex items-center justify-between p-4 hover:bg-[#08080a] cursor-pointer transition"
              >
                <div className="flex items-center gap-3 truncate">
                  {person.avatar ? (
                    <img src={person.avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center font-bold text-cyan-400">
                      {person.handle[0].toUpperCase()}
                    </div>
                  )}
                  <div className="truncate">
                    <div className="text-sm font-bold text-white truncate">
                      {person.displayName || person.handle}
                    </div>
                    <div className="text-xs text-zinc-500 truncate">@{person.handle}</div>
                    {person.description && (
                      <p className="text-xs text-zinc-400 line-clamp-1 mt-0.5">{person.description}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center text-zinc-500 text-xs">
            {query ? 'No matching accounts found.' : 'Search for creators, journalists, and friends.'}
          </div>
        )}
      </div>
    </div>
  );
};
