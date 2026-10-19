import React, { useState, useRef } from 'react';
import { Search, Sparkles, Send, Loader2, TrendingUp, Flame, RefreshCw } from 'lucide-react';
import { LocalAIService } from '../../services/localAI';
import { FeedItem } from '../../types/bsky';

interface RightBarProps {
  aiService: LocalAIService;
  timelinePosts: FeedItem[];
  onSearch: (query: string) => void;
  onOpenHashtag: (tag: string) => void;
}

const TRENDING_TOPICS = [
  { tag: 'Bluesky', count: '142K posts' },
  { tag: 'LocalAI', count: '89K posts' },
  { tag: 'OpenSource', count: '54K posts' },
  { tag: 'Linux', count: '42K posts' },
  { tag: 'DeepSeek', count: '38K posts' },
  { tag: 'WebDev', count: '29K posts' },
];

export const RightBar: React.FC<RightBarProps> = ({
  aiService,
  timelinePosts,
  onSearch,
  onOpenHashtag,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [aiChatInput, setAiChatInput] = useState('');
  const [aiMessages, setAiMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([
    {
      role: 'assistant',
      content: "Hi, I'm LibreAI powered by your local model. Ask me anything, or click 'Timeline Digest' to summarize your current feed!",
    },
  ]);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim());
    }
  };

  const handleSendAiMessage = async () => {
    if (!aiChatInput.trim() || isAiThinking) return;
    const userMsg = aiChatInput.trim();
    setAiChatInput('');

    const newMessages = [...aiMessages, { role: 'user' as const, content: userMsg }];
    setAiMessages(newMessages);
    setIsAiThinking(true);

    try {
      let accumulated = '';
      setAiMessages((prev) => [...prev, { role: 'assistant', content: '' }]);

      await aiService.streamChat(
        [
          { role: 'system', content: 'You are LibreAI: razor-sharp, concise, objective, and helpful.' },
          ...newMessages.map((m) => ({ role: m.role, content: m.content })),
        ],
        (chunk) => {
          accumulated += chunk;
          setAiMessages((prev) => {
            const copy = [...prev];
            copy[copy.length - 1] = { role: 'assistant', content: accumulated };
            return copy;
          });
          chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
      );
    } catch (err: any) {
      setAiMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `⚠️ Local AI Error: ${err.message}. Make sure Ollama or LM Studio is running.`,
        },
      ]);
    } finally {
      setIsAiThinking(false);
    }
  };

  const handleTimelineDigest = async () => {
    if (timelinePosts.length === 0 || isAiThinking) return;
    setIsAiThinking(true);

    // Extract top 8 post texts
    const sample = timelinePosts
      .slice(0, 8)
      .map((item) => `@${item.post.author.handle}: "${item.post.record?.text || ''}"`)
      .join('\n\n');

    const prompt = `Summarize the key trends, debates, and themes from these recent Bluesky posts in 3 crisp, bulleted insights:\n\n${sample}`;

    setAiMessages((prev) => [
      ...prev,
      { role: 'user', content: 'Summarize my timeline digest.' },
      { role: 'assistant', content: '' },
    ]);

    try {
      let accumulated = '';
      await aiService.streamChat(
        [
          { role: 'system', content: 'You are LibreSky AI intelligence digest.' },
          { role: 'user', content: prompt },
        ],
        (chunk) => {
          accumulated += chunk;
          setAiMessages((prev) => {
            const copy = [...prev];
            copy[copy.length - 1] = { role: 'assistant', content: accumulated };
            return copy;
          });
          chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
      );
    } catch (err: any) {
      setAiMessages((prev) => [
        ...prev,
        { role: 'assistant', content: `Digest failed: ${err.message}` },
      ]);
    } finally {
      setIsAiThinking(false);
    }
  };

  return (
    <aside className="w-80 lg:w-96 h-screen sticky top-0 hidden lg:flex flex-col p-4 bg-black border-l border-[#16161c] space-y-4 overflow-y-auto">
      {/* Search Bar */}
      <form onSubmit={handleSearchSubmit} className="relative">
        <Search className="absolute left-3.5 top-3 w-4 h-4 text-zinc-500" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search Bluesky posts, @handles..."
          className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#0c0c0f] border border-[#1f1f26] text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-cyan-500 transition"
        />
      </form>

      {/* Local AI Copilot Panel */}
      <div className="flex-1 flex flex-col rounded-3xl bg-[#08080a] border border-[#1c1c24] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#0d0d12] border-b border-[#1a1a22]">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                LibreAI Copilot
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 ai-pulse" />
              </h3>
              <p className="text-[10px] text-zinc-400">
                {aiService.getConfig().selectedModel || 'Local Model'}
              </p>
            </div>
          </div>

          <button
            onClick={handleTimelineDigest}
            disabled={isAiThinking || timelinePosts.length === 0}
            title="Summarize current timeline posts"
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-cyan-950 text-cyan-300 hover:bg-cyan-900 border border-cyan-800 transition disabled:opacity-50"
          >
            <RefreshCw className={`w-3 h-3 ${isAiThinking ? 'animate-spin' : ''}`} />
            Digest
          </button>
        </div>

        {/* Chat Stream Messages */}
        <div className="flex-1 p-3.5 overflow-y-auto space-y-3 text-xs leading-relaxed max-h-72">
          {aiMessages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[88%] p-3 rounded-2xl text-[12px] leading-relaxed whitespace-pre-wrap ${
                  msg.role === 'user'
                    ? 'bg-cyan-600 text-black font-medium shadow-sm'
                    : 'bg-[#121217] text-zinc-200 border border-[#22222a]'
                }`}
              >
                {msg.content || (
                  <span className="flex items-center gap-1.5 text-zinc-400">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                    Thinking...
                  </span>
                )}
              </div>
            </div>
          ))}
          <div ref={chatBottomRef} />
        </div>

        {/* Input Field */}
        <div className="p-2.5 bg-[#0b0b0e] border-t border-[#1a1a22]">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={aiChatInput}
              onChange={(e) => setAiChatInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendAiMessage()}
              placeholder="Ask LibreAI anything..."
              disabled={isAiThinking}
              className="flex-1 px-3 py-2 rounded-xl bg-[#141419] border border-[#23232c] text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500 transition"
            />
            <button
              onClick={handleSendAiMessage}
              disabled={!aiChatInput.trim() || isAiThinking}
              className="p-2 rounded-xl bg-cyan-500 text-black hover:bg-cyan-400 transition disabled:opacity-40"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Trending Topics */}
      <div className="p-4 rounded-3xl bg-[#08080a] border border-[#1a1a22] space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-cyan-400" /> What's Trending
          </h3>
        </div>
        <div className="space-y-2">
          {TRENDING_TOPICS.map((topic) => (
            <button
              key={topic.tag}
              onClick={() => onOpenHashtag(topic.tag)}
              className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-[#121216] transition text-left group"
            >
              <div>
                <span className="text-xs font-bold text-zinc-200 group-hover:text-cyan-400 transition">
                  #{topic.tag}
                </span>
                <p className="text-[10px] text-zinc-500">{topic.count}</p>
              </div>
              <Flame className="w-3.5 h-3.5 text-zinc-600 group-hover:text-cyan-400 transition" />
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
};
