import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Flame,
  Home,
  RefreshCw,
  Sparkles,
  Sliders,
  Plus,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { atproto } from './services/atproto';
import { storage } from './services/storage';
import { LocalAIService } from './services/localAI';
import { oauthService } from './services/oauth';
import { BskyPost, FeedItem, SessionData } from './types/bsky';
import { AIDetectionStatus } from './types/ai';

// Components
import { Sidebar } from './components/Layout/Sidebar';
import { RightBar } from './components/Layout/RightBar';
import { PostCard } from './components/Feed/PostCard';
import { CoolComposer } from './components/Composer/CoolComposer';
import { ThreadView } from './components/Feed/ThreadView';
import { ProfileView } from './components/Profile/ProfileView';
import { SearchView } from './components/Search/SearchView';
import { NotificationsView } from './components/Notifications/NotificationsView';
import { LocalAISettingsModal } from './components/AI/LocalAISettingsModal';
import { LoginModal } from './components/Auth/LoginModal';

export const App: React.FC = () => {
  // AI Service instance
  const aiService = useMemo(() => new LocalAIService(storage.getAIConfig()), []);

  // Application State
  const [session, setSession] = useState<SessionData | null>(atproto.getSession());
  const [activeTab, setActiveTab] = useState<string>('timeline');
  const [feedMode, setFeedMode] = useState<'following' | 'discover'>('following');

  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
  const [loadingFeed, setLoadingFeed] = useState<boolean>(true);
  const [feedCursor, setFeedCursor] = useState<string | undefined>();
  const [unreadCount, setUnreadCount] = useState<number>(0);

  // Active Contexts
  const [activeThreadUri, setActiveThreadUri] = useState<string | null>(null);
  const [activeProfileActor, setActiveProfileActor] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [replyingToPost, setReplyingToPost] = useState<BskyPost | undefined>(undefined);

  // Modals
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [isAISettingsOpen, setIsAISettingsOpen] = useState<boolean>(false);
  const [isComposerModalOpen, setIsComposerModalOpen] = useState<boolean>(false);

  // Local AI Detection Status
  const [aiStatus, setAiStatus] = useState<AIDetectionStatus>('checking');
  const [activeModelName, setActiveModelName] = useState<string>('');

  // 1. Check Local AI on mount
  const checkAI = useCallback(async () => {
    setAiStatus('checking');
    try {
      const res = await aiService.detectLocalAI();
      if (res.connected) {
        setAiStatus('connected');
        setActiveModelName(res.models[0]?.name || res.provider);
      } else {
        setAiStatus('disconnected');
        setActiveModelName('');
      }
    } catch {
      setAiStatus('disconnected');
    }
  }, [aiService]);

  useEffect(() => {
    checkAI();
  }, [checkAI]);

  // 2. Handle OAuth2 callback in URL (Web / GitHub Pages or Electron)
  useEffect(() => {
    const handleUrlCallback = async (urlString: string) => {
      try {
        const url = new URL(urlString);
        const code = url.searchParams.get('code');
        const state = url.searchParams.get('state');
        if (code && state) {
          const tokenData = await oauthService.handleCallback(code, state);
          // Resume session from token
          if (tokenData.access_token) {
            window.history.replaceState({}, document.title, window.location.pathname);
            window.location.reload();
          }
        }
      } catch (err) {
        console.error('OAuth callback handling failed:', err);
      }
    };

    // Check browser URL query params
    if (window.location.search.includes('code=')) {
      handleUrlCallback(window.location.href);
    }

    // Check Electron deep link callback
    if (window.electronAPI?.onOAuthCallback) {
      const cleanup = window.electronAPI.onOAuthCallback((deepLinkUrl) => {
        handleUrlCallback(deepLinkUrl);
      });
      return cleanup;
    }
  }, []);

  // 3. Load Feeds
  const loadFeed = useCallback(
    async (cursor?: string) => {
      setLoadingFeed(true);
      try {
        if (feedMode === 'following' && atproto.isLoggedIn()) {
          const res = await atproto.getTimeline(cursor);
          setFeedItems((prev) => (cursor ? [...prev, ...res.items] : res.items));
          setFeedCursor(res.cursor);
        } else {
          // Discover / What's Hot feed
          const res = await atproto.getFeed(
            'at://did:plc:z72i7hdynmk6r22z27h6tvur/app.bsky.feed.generator/whats-hot',
            cursor
          );
          setFeedItems((prev) => (cursor ? [...prev, ...res.items] : res.items));
          setFeedCursor(res.cursor);
        }
      } catch (err) {
        console.error('Feed load failed:', err);
      } finally {
        setLoadingFeed(false);
      }
    },
    [feedMode]
  );

  useEffect(() => {
    if (activeTab === 'timeline' || activeTab === 'discover') {
      loadFeed();
    }
  }, [activeTab, feedMode, loadFeed]);

  // 4. Notification poll
  useEffect(() => {
    if (atproto.isLoggedIn()) {
      atproto.getUnreadNotificationCount().then(setUnreadCount);
      const interval = setInterval(() => {
        atproto.getUnreadNotificationCount().then(setUnreadCount);
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [session]);

  // Navigation Handlers
  const handleOpenThread = (post: BskyPost) => {
    setActiveThreadUri(post.uri);
    setActiveTab('thread');
  };

  const handleOpenUser = (actorHandle: string) => {
    setActiveProfileActor(actorHandle);
    setActiveTab('profile');
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setActiveTab('search');
  };

  const handleOpenHashtag = (tag: string) => {
    setSearchQuery(`#${tag}`);
    setActiveTab('search');
  };

  const handleReply = (post: BskyPost) => {
    setReplyingToPost(post);
    setIsComposerModalOpen(true);
  };

  const handleLogout = () => {
    atproto.logout();
    setSession(null);
    setFeedMode('discover');
    loadFeed();
  };

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // If typing in an input/textarea, ignore global shortcuts
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.key === 'c' || e.key === 'C') {
        e.preventDefault();
        setIsComposerModalOpen(true);
      } else if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        loadFeed();
      } else if (e.key === 'Escape') {
        if (activeTab === 'thread') {
          setActiveTab('timeline');
          setActiveThreadUri(null);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTab, loadFeed]);

  return (
    <div className="flex justify-center min-h-screen bg-black text-zinc-100 antialiased selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Maximum width container holding left sidebar, main column, and right bar */}
      <div className="flex w-full max-w-7xl">
        {/* Left Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={(tab) => {
            setActiveTab(tab);
            if (tab === 'timeline') setFeedMode('following');
            if (tab === 'discover') setFeedMode('discover');
          }}
          session={session}
          unreadCount={unreadCount}
          aiStatus={aiStatus}
          activeModelName={activeModelName}
          onOpenAISettings={() => setIsAISettingsOpen(true)}
          onOpenComposer={() => {
            setReplyingToPost(undefined);
            setIsComposerModalOpen(true);
          }}
          onOpenLogin={() => setIsLoginModalOpen(true)}
          onLogout={handleLogout}
        />

        {/* Center Main Feed Column */}
        <main className="flex-1 min-w-0 max-w-2xl border-r border-[#16161c] min-h-screen pb-20">
          {activeTab === 'thread' && activeThreadUri ? (
            <ThreadView
              postUri={activeThreadUri}
              aiService={aiService}
              onBack={() => {
                setActiveTab('timeline');
                setActiveThreadUri(null);
              }}
              onOpenUser={handleOpenUser}
            />
          ) : activeTab === 'profile' ? (
            <ProfileView
              actorHandleOrDid={activeProfileActor || session?.handle || 'bsky.app'}
              aiService={aiService}
              onBack={activeProfileActor ? () => setActiveTab('timeline') : undefined}
              onOpenThread={handleOpenThread}
              onOpenUser={handleOpenUser}
            />
          ) : activeTab === 'search' ? (
            <SearchView
              initialQuery={searchQuery}
              aiService={aiService}
              onOpenThread={handleOpenThread}
              onOpenUser={handleOpenUser}
            />
          ) : activeTab === 'notifications' ? (
            <NotificationsView onOpenThread={handleOpenThread} onOpenUser={handleOpenUser} />
          ) : (
            <>
              {/* Top Sticky Header */}
              <header className="sticky top-0 z-30 flex items-center justify-between px-4 py-3 bg-black/85 backdrop-blur-md border-b border-[#141418]">
                {/* Feed Mode Switcher */}
                <div className="flex items-center gap-1 p-1 rounded-2xl bg-[#0c0c0f] border border-[#1f1f26]">
                  {session && (
                    <button
                      onClick={() => setFeedMode('following')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                        feedMode === 'following'
                          ? 'bg-zinc-800 text-white shadow-sm'
                          : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      <Home className="w-3.5 h-3.5 text-cyan-400" />
                      Following
                    </button>
                  )}
                  <button
                    onClick={() => setFeedMode('discover')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                      feedMode === 'discover'
                        ? 'bg-zinc-800 text-white shadow-sm'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    <Flame className="w-3.5 h-3.5 text-purple-400" />
                    What's Hot
                  </button>
                </div>

                {/* Right Header Status / Refresh */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => loadFeed()}
                    disabled={loadingFeed}
                    title="Refresh feed (Shortcut: R)"
                    className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-900 transition"
                  >
                    <RefreshCw className={`w-4 h-4 ${loadingFeed ? 'animate-spin text-cyan-400' : ''}`} />
                  </button>
                </div>
              </header>

              {/* In-feed Cool Composer (if signed in) */}
              {session ? (
                <div className="p-4 border-b border-[#141418] bg-[#050507]">
                  <CoolComposer aiService={aiService} onPostSuccess={() => loadFeed()} />
                </div>
              ) : (
                <div className="p-4 m-4 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-black to-purple-950/40 border border-cyan-800/40 flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-cyan-400" />
                      Welcome to LibreSky
                    </h3>
                    <p className="text-[11px] text-zinc-400">
                      Sign in to post, like, and chat with your local AI models.
                    </p>
                  </div>
                  <button
                    onClick={() => setIsLoginModalOpen(true)}
                    className="px-4 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-xs transition shadow-lg shadow-cyan-500/20"
                  >
                    Sign In
                  </button>
                </div>
              )}

              {/* Feed List */}
              <div className="divide-y divide-[#141418]">
                {loadingFeed && feedItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-24 text-zinc-500">
                    <Loader2 className="w-8 h-8 animate-spin text-cyan-400 mb-3" />
                    <span className="text-xs">Fetching latest posts...</span>
                  </div>
                ) : feedItems.length > 0 ? (
                  <>
                    {feedItems.map((item) => (
                      <PostCard
                        key={item.post.uri}
                        feedItem={item}
                        aiService={aiService}
                        onOpenThread={handleOpenThread}
                        onReply={handleReply}
                        onOpenUser={handleOpenUser}
                      />
                    ))}

                    {/* Infinite Scroll / Load More */}
                    {feedCursor && (
                      <div className="p-4 text-center">
                        <button
                          onClick={() => loadFeed(feedCursor)}
                          disabled={loadingFeed}
                          className="px-5 py-2 rounded-xl bg-[#0f0f13] hover:bg-[#16161d] text-xs font-bold text-zinc-300 border border-[#22222a] transition disabled:opacity-50"
                        >
                          {loadingFeed ? 'Loading more...' : 'Load More Posts'}
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="py-24 text-center text-zinc-500 text-xs">
                    No posts available right now. Click refresh to try again.
                  </div>
                )}
              </div>
            </>
          )}
        </main>

        {/* Right Bar: Local AI Copilot, Search & Trending */}
        <RightBar
          aiService={aiService}
          timelinePosts={feedItems}
          onSearch={handleSearch}
          onOpenHashtag={handleOpenHashtag}
        />
      </div>

      {/* Floating Composer Modal (when clicking Publish or Reply) */}
      {isComposerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-lg bg-[#09090c] border border-[#23232c] rounded-3xl shadow-2xl overflow-hidden p-4">
            <div className="flex items-center justify-between pb-3 mb-2 border-b border-[#1c1c24]">
              <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                {replyingToPost ? 'Reply to Post' : 'New Sky Post'}
              </h3>
              <button
                onClick={() => {
                  setIsComposerModalOpen(false);
                  setReplyingToPost(undefined);
                }}
                className="text-zinc-400 hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>
            <CoolComposer
              replyTo={replyingToPost}
              aiService={aiService}
              onPostSuccess={() => {
                setIsComposerModalOpen(false);
                setReplyingToPost(undefined);
                loadFeed();
              }}
              onCancelReply={() => setReplyingToPost(undefined)}
            />
          </div>
        </div>
      )}

      {/* Local AI Settings Modal */}
      <LocalAISettingsModal
        isOpen={isAISettingsOpen}
        onClose={() => setIsAISettingsOpen(false)}
        aiService={aiService}
        onConfigUpdated={checkAI}
      />

      {/* Authentication Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={(newSession) => {
          setSession(newSession);
          setFeedMode('following');
          loadFeed();
        }}
      />
    </div>
  );
};
export default App;
