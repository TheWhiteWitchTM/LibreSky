import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Brain, CheckSquare, MessageCircle, Flame, Languages, X, Loader2, Copy, Check } from 'lucide-react';
import { BskyPost } from '../../types/bsky';
import { GrokActionMode } from '../../types/ai';
import { LocalAIService } from '../../services/localAI';

interface AIPostActionProps {
  post: BskyPost;
  aiService: LocalAIService;
  onApplyReply?: (text: string) => void;
}

export const AIPostAction: React.FC<AIPostActionProps> = ({ post, aiService, onApplyReply }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeMode, setActiveMode] = useState<GrokActionMode | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const runGrokAction = async (mode: GrokActionMode) => {
    setActiveMode(mode);
    setLoading(true);
    setResult('');

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    const prompt = aiService.buildGrokPrompt(mode, post);

    try {
      let accumulated = '';
      await aiService.streamChat(
        [
          {
            role: 'system',
            content:
              'You are LibreSky Grok AI: an unfiltered, razor-sharp, intellectually honest, and witty assistant. Format your answers clearly with markdown.',
          },
          { role: 'user', content: prompt },
        ],
        (chunk) => {
          accumulated += chunk;
          setResult(accumulated);
        },
        abortControllerRef.current.signal
      );
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        // Fallback / helpful guide if local AI is offline
        setResult(
          `⚠️ Local AI Offline: Could not connect to ${aiService.getConfig().endpoint} (${err.message}).\n\n` +
          `To use this feature:\n1. Launch Ollama or LM Studio on your machine\n2. Open Local AI settings in the top bar to verify connection.`
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative inline-block" ref={menuRef}>
      {/* Grok Sparkle Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        title="LibreSky AI (Grok)"
        className={`group flex items-center gap-1.5 px-2 py-1 rounded-full text-xs transition duration-200 ${
          isOpen
            ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-500/20'
            : 'text-zinc-500 hover:text-cyan-400 hover:bg-cyan-950/30'
        }`}
      >
        <Sparkles className="w-4 h-4 transition-transform group-hover:rotate-12 group-hover:scale-110" />
        <span className="font-semibold tracking-tight text-[11px] group-hover:text-cyan-300 hidden sm:inline">
          Grok
        </span>
      </button>

      {/* Grok Menu Dropdown / Inline Result Modal */}
      {isOpen && (
        <div className="absolute right-0 bottom-full mb-2 w-80 sm:w-96 rounded-2xl bg-[#09090c] border border-[#27272f] shadow-2xl z-40 overflow-hidden animate-fade-in">
          {/* Menu Header */}
          <div className="flex items-center justify-between px-3.5 py-2.5 bg-[#0f0f13] border-b border-[#1c1c22]">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-cyan-400 ai-pulse" />
              <span className="text-xs font-bold text-white tracking-wide flex items-center gap-1">
                LibreSky AI
                <span className="text-[10px] text-zinc-400 font-normal">
                  ({aiService.getConfig().selectedModel || 'Local Model'})
                </span>
              </span>
            </div>
            <button
              onClick={() => {
                if (abortControllerRef.current) abortControllerRef.current.abort();
                setIsOpen(false);
                setActiveMode(null);
                setResult('');
              }}
              className="text-zinc-400 hover:text-white p-1 rounded-md hover:bg-zinc-800/50"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Action Chips Grid */}
          <div className="p-2.5 grid grid-cols-3 gap-1.5 bg-[#070709] border-b border-[#18181d]">
            <button
              onClick={() => runGrokAction('explain')}
              className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-[11px] font-medium transition ${
                activeMode === 'explain'
                  ? 'bg-cyan-500 text-black font-semibold'
                  : 'bg-[#141418] text-zinc-300 hover:bg-zinc-800 hover:text-cyan-300'
              }`}
            >
              <Brain className="w-3 h-3 text-cyan-400 shrink-0" />
              Context
            </button>

            <button
              onClick={() => runGrokAction('factcheck')}
              className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-[11px] font-medium transition ${
                activeMode === 'factcheck'
                  ? 'bg-cyan-500 text-black font-semibold'
                  : 'bg-[#141418] text-zinc-300 hover:bg-zinc-800 hover:text-cyan-300'
              }`}
            >
              <CheckSquare className="w-3 h-3 text-emerald-400 shrink-0" />
              Fact-Check
            </button>

            <button
              onClick={() => runGrokAction('reply')}
              className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-[11px] font-medium transition ${
                activeMode === 'reply'
                  ? 'bg-cyan-500 text-black font-semibold'
                  : 'bg-[#141418] text-zinc-300 hover:bg-zinc-800 hover:text-cyan-300'
              }`}
            >
              <MessageCircle className="w-3 h-3 text-blue-400 shrink-0" />
              Draft Reply
            </button>

            <button
              onClick={() => runGrokAction('roast')}
              className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-[11px] font-medium transition ${
                activeMode === 'roast'
                  ? 'bg-cyan-500 text-black font-semibold'
                  : 'bg-[#141418] text-zinc-300 hover:bg-zinc-800 hover:text-amber-300'
              }`}
            >
              <Flame className="w-3 h-3 text-orange-400 shrink-0" />
              Roast 🔥
            </button>

            <button
              onClick={() => runGrokAction('translate')}
              className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-[11px] font-medium transition ${
                activeMode === 'translate'
                  ? 'bg-cyan-500 text-black font-semibold'
                  : 'bg-[#141418] text-zinc-300 hover:bg-zinc-800 hover:text-purple-300'
              }`}
            >
              <Languages className="w-3 h-3 text-purple-400 shrink-0" />
              Translate
            </button>

            <button
              onClick={() => runGrokAction('summarize')}
              className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-[11px] font-medium transition ${
                activeMode === 'summarize'
                  ? 'bg-cyan-500 text-black font-semibold'
                  : 'bg-[#141418] text-zinc-300 hover:bg-zinc-800 hover:text-cyan-300'
              }`}
            >
              <Sparkles className="w-3 h-3 text-pink-400 shrink-0" />
              TL;DR
            </button>
          </div>

          {/* Output Container */}
          <div className="p-3 max-h-64 overflow-y-auto text-xs text-zinc-200 space-y-2 bg-[#09090c]">
            {loading && !result && (
              <div className="flex items-center justify-center py-6 text-zinc-400 gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
                <span>Generating with local AI...</span>
              </div>
            )}

            {result ? (
              <div className="font-sans leading-relaxed whitespace-pre-wrap text-zinc-200">
                {result}
              </div>
            ) : !loading ? (
              <p className="text-zinc-500 text-center py-4 text-[11px]">
                Choose an action above to analyze this post with your local AI model.
              </p>
            ) : null}
          </div>

          {/* Action Footer */}
          {result && (
            <div className="flex items-center justify-between px-3 py-2 bg-[#0d0d10] border-t border-[#1c1c22]">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 text-[11px] text-zinc-400 hover:text-white transition"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied' : 'Copy'}
              </button>

              {activeMode === 'reply' && onApplyReply && (
                <button
                  onClick={() => {
                    onApplyReply(result);
                    setIsOpen(false);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 text-[11px] font-semibold transition"
                >
                  Use as Reply
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
