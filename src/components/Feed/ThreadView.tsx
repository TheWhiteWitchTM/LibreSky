import React, { useEffect, useState } from 'react';
import { ArrowLeft, Loader2, Sparkles, MessageSquare } from 'lucide-react';
import { BskyPost, FeedItem } from '../../types/bsky';
import { atproto } from '../../services/atproto';
import { LocalAIService } from '../../services/localAI';
import { PostCard } from './PostCard';
import { CoolComposer } from '../Composer/CoolComposer';

interface ThreadViewProps {
  postUri: string;
  onBack: () => void;
  aiService: LocalAIService;
  onOpenUser?: (handle: string) => void;
}

export const ThreadView: React.FC<ThreadViewProps> = ({
  postUri,
  onBack,
  aiService,
  onOpenUser,
}) => {
  const [thread, setThread] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [threadSummary, setThreadSummary] = useState<string | null>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);

  const fetchThread = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await atproto.getPostThread(postUri);
      setThread(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load thread');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchThread();
  }, [postUri]);

  // Summarize whole thread with local AI
  const handleSummarizeThread = async () => {
    if (!thread?.post) return;
    setIsSummarizing(true);
    setThreadSummary('');

    // Collect reply texts
    const replyTexts: string[] = [];
    if (thread.replies) {
      for (const r of thread.replies.slice(0, 8)) {
        if (r.post?.record?.text) {
          replyTexts.push(`@${r.post.author.handle}: "${r.post.record.text}"`);
        }
      }
    }

    const prompt = aiService.buildGrokPrompt('summarize', thread.post, replyTexts.join('\n'));

    try {
      let accumulated = '';
      await aiService.streamChat(
        [
          { role: 'system', content: 'You are LibreSky AI thread summarizer.' },
          { role: 'user', content: prompt },
        ],
        (chunk) => {
          accumulated += chunk;
          setThreadSummary(accumulated);
        }
      );
    } catch (err: any) {
      setThreadSummary(`Could not summarize thread: ${err.message}`);
    } finally {
      setIsSummarizing(false);
    }
  };

  // Render reply tree recursively
  const renderReply = (reply: any, depth = 0): React.ReactNode => {
    if (!reply.post) return null;
    const feedItem: FeedItem = { post: reply.post };

    return (
      <div key={reply.post.uri} className={`relative ${depth > 0 ? 'ml-4 sm:ml-6 pl-2 border-l border-[#1f1f26]' : ''}`}>
        <PostCard
          feedItem={feedItem}
          aiService={aiService}
          onOpenThread={(p) => setThread((prev: any) => ({ ...prev, post: p }))}
          onOpenUser={onOpenUser}
        />
        {reply.replies && reply.replies.length > 0 && (
          <div className="space-y-1">
            {reply.replies.map((r: any) => renderReply(r, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-zinc-500">
        <Loader2 className="w-8 h-8 animate-spin text-cyan-400 mb-2" />
        <span className="text-xs">Loading conversation thread...</span>
      </div>
    );
  }

  if (error || !thread?.post) {
    return (
      <div className="p-6 text-center">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-800 text-xs text-zinc-200 hover:bg-zinc-700 mb-4"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <p className="text-zinc-400 text-sm">{error || 'Thread not found.'}</p>
      </div>
    );
  }

  const mainPost: BskyPost = thread.post;
  const parentPosts: any[] = [];
  let currentParent = thread.parent;
  while (currentParent) {
    if (currentParent.post) parentPosts.unshift(currentParent.post);
    currentParent = currentParent.parent;
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Sticky Thread Header */}
      <div className="sticky top-0 z-30 flex items-center justify-between px-4 py-3 bg-black/85 backdrop-blur-md border-b border-[#1c1c22]">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-1.5 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="font-bold text-sm text-white">Thread</h2>
        </div>

        {/* AI Thread Summarizer */}
        <button
          onClick={handleSummarizeThread}
          disabled={isSummarizing}
          className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-950/60 hover:bg-cyan-900/80 text-cyan-300 border border-cyan-800/60 transition"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{isSummarizing ? 'Summarizing...' : 'AI TL;DR'}</span>
        </button>
      </div>

      {/* Thread Summary Box if generated */}
      {threadSummary && (
        <div className="m-4 p-4 rounded-2xl bg-[#0c0c10] border border-cyan-500/30 text-xs text-zinc-200 space-y-2 animate-fade-in shadow-lg shadow-cyan-950/20">
          <div className="flex items-center gap-1.5 font-bold text-cyan-400 uppercase tracking-wider text-[11px]">
            <Sparkles className="w-3.5 h-3.5" /> AI Thread Synopsis
          </div>
          <div className="leading-relaxed whitespace-pre-wrap">{threadSummary}</div>
        </div>
      )}

      {/* Parent Chain */}
      {parentPosts.map((parent) => (
        <PostCard
          key={parent.uri}
          feedItem={{ post: parent }}
          aiService={aiService}
          onOpenUser={onOpenUser}
        />
      ))}

      {/* Focused Main Post */}
      <div className="border-l-2 border-cyan-500/80 bg-[#060608]">
        <PostCard
          feedItem={{ post: mainPost }}
          aiService={aiService}
          onOpenUser={onOpenUser}
        />
      </div>

      {/* Reply Composer directly attached */}
      <div className="p-4 bg-[#0a0a0d] border-b border-[#1c1c22]">
        <CoolComposer
          replyTo={mainPost}
          aiService={aiService}
          placeholder={`Reply to @${mainPost.author.handle}...`}
          onPostSuccess={fetchThread}
        />
      </div>

      {/* Replies Hierarchy */}
      <div className="divide-y divide-[#141418]">
        {thread.replies && thread.replies.length > 0 ? (
          thread.replies.map((reply: any) => renderReply(reply, 0))
        ) : (
          <div className="py-12 text-center text-zinc-500 text-xs">
            No replies yet. Be the first to reply!
          </div>
        )}
      </div>
    </div>
  );
};
