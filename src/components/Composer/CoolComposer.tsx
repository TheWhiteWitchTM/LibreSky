import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Image,
  Smile,
  Sparkles,
  Send,
  X,
  Hash,
  AtSign,
  Wand2,
  AlertCircle,
  Check,
  Loader2,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { atproto } from '../../services/atproto';
import { storage } from '../../services/storage';
import { LocalAIService } from '../../services/localAI';
import { BskyUser, BskyPost } from '../../types/bsky';

interface CoolComposerProps {
  replyTo?: BskyPost;
  onPostSuccess?: () => void;
  onCancelReply?: () => void;
  aiService: LocalAIService;
  placeholder?: string;
}

const POPULAR_HASHTAGS = [
  'Bluesky',
  'Tech',
  'AI',
  'OpenSource',
  'Linux',
  'Coding',
  'Art',
  'Photography',
  'Gaming',
  'Science',
  'Books',
  'Design',
];

export const CoolComposer: React.FC<CoolComposerProps> = ({
  replyTo,
  onPostSuccess,
  onCancelReply,
  aiService,
  placeholder = "What's unfolding in your corner of the sky?",
}) => {
  const [text, setText] = useState(storage.getDraft());
  const [isPosting, setIsPosting] = useState(false);
  const [images, setImages] = useState<{ file: File; preview: string; alt: string }[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Autocomplete / Prediction State
  const [mentionSuggestions, setMentionSuggestions] = useState<BskyUser[]>([]);
  const [hashtagSuggestions, setHashtagSuggestions] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [activeQuery, setActiveQuery] = useState<{ type: 'mention' | 'hashtag'; query: string; start: number; end: number } | null>(null);

  // AI Assist State
  const [showAIAssist, setShowAIAssist] = useState(false);
  const [isAiGenerating, setIsAiGenerating] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-save draft
  useEffect(() => {
    storage.setDraft(text);
  }, [text]);

  const maxChars = 300;
  const charsLeft = maxChars - text.length;

  // Handle typing & scan for @ or # triggers
  const handleTextChange = async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    const cursorPos = e.target.selectionStart;
    setText(val);

    // Look back from cursor to find word boundary
    const textBeforeCursor = val.slice(0, cursorPos);
    const lastWordMatch = textBeforeCursor.match(/(?:^|\s)([@#][a-zA-Z0-9._-]*)$/);

    if (lastWordMatch) {
      const matchText = lastWordMatch[1];
      const startPos = cursorPos - matchText.length;

      if (matchText.startsWith('@')) {
        const query = matchText.slice(1);
        setActiveQuery({ type: 'mention', query, start: startPos, end: cursorPos });
        setSelectedIndex(0);

        if (query.length >= 1) {
          try {
            const actors = await atproto.searchActorsTypeahead(query);
            setMentionSuggestions(actors);
          } catch {
            setMentionSuggestions([]);
          }
        } else {
          setMentionSuggestions([]);
        }
        setHashtagSuggestions([]);
      } else if (matchText.startsWith('#')) {
        const query = matchText.slice(1).toLowerCase();
        setActiveQuery({ type: 'hashtag', query, start: startPos, end: cursorPos });
        setSelectedIndex(0);

        const filtered = POPULAR_HASHTAGS.filter((tag) =>
          tag.toLowerCase().includes(query)
        );
        setHashtagSuggestions(filtered.length > 0 ? filtered : [matchText.slice(1)]);
        setMentionSuggestions([]);
      }
    } else {
      setActiveQuery(null);
      setMentionSuggestions([]);
      setHashtagSuggestions([]);
    }
  };

  // Keyboard navigation for predictions
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const suggestionsCount =
      activeQuery?.type === 'mention'
        ? mentionSuggestions.length
        : activeQuery?.type === 'hashtag'
        ? hashtagSuggestions.length
        : 0;

    if (suggestionsCount > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % suggestionsCount);
        return;
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + suggestionsCount) % suggestionsCount);
        return;
      } else if (e.key === 'Enter' || e.key === 'Tab') {
        e.preventDefault();
        if (activeQuery?.type === 'mention') {
          insertMention(mentionSuggestions[selectedIndex]);
        } else if (activeQuery?.type === 'hashtag') {
          insertHashtag(hashtagSuggestions[selectedIndex]);
        }
        return;
      } else if (e.key === 'Escape') {
        setActiveQuery(null);
        return;
      }
    }

    // Ctrl/Cmd + Enter to post
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handlePost();
    }
  };

  // Insert mention
  const insertMention = (user: BskyUser) => {
    if (!activeQuery) return;
    const replacement = `@${user.handle} `;
    const newText =
      text.substring(0, activeQuery.start) +
      replacement +
      text.substring(activeQuery.end);
    setText(newText);
    setActiveQuery(null);
    setMentionSuggestions([]);

    setTimeout(() => {
      if (textareaRef.current) {
        const nextPos = activeQuery.start + replacement.length;
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(nextPos, nextPos);
      }
    }, 0);
  };

  // Insert hashtag
  const insertHashtag = (tag: string) => {
    if (!activeQuery) return;
    const replacement = `#${tag} `;
    const newText =
      text.substring(0, activeQuery.start) +
      replacement +
      text.substring(activeQuery.end);
    setText(newText);
    setActiveQuery(null);
    setHashtagSuggestions([]);

    setTimeout(() => {
      if (textareaRef.current) {
        const nextPos = activeQuery.start + replacement.length;
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(nextPos, nextPos);
      }
    }, 0);
  };

  // Handle image upload
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (images.length + files.length > 4) {
      setError('You can attach up to 4 images per post');
      return;
    }

    const newImgs = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      alt: '',
    }));

    setImages((prev) => [...prev, ...newImgs]);
  };

  const removeImage = (index: number) => {
    setImages((prev) => {
      URL.revokeObjectURL(prev[index].preview);
      return prev.filter((_, i) => i !== index);
    });
  };

  // AI Assist actions
  const runAiAssist = async (instruction: string) => {
    if (!text.trim()) {
      setError('Type some thoughts first so local AI can polish it!');
      return;
    }
    setIsAiGenerating(true);
    setShowAIAssist(false);
    setError(null);

    const prompt = `You are LibreSky AI post assistant. The user wants you to "${instruction}" for this draft Bluesky post:\n\n"${text}"\n\nReturn ONLY the revised post text without conversational filler or quotes. Keep it strictly under 300 characters.`;

    try {
      let result = '';
      await aiService.streamChat(
        [
          { role: 'system', content: 'You are a concise, brilliant social copywriter. Output only the improved text.' },
          { role: 'user', content: prompt },
        ],
        (chunk) => {
          result += chunk;
          setText(result);
        }
      );
    } catch (err: any) {
      setError(`AI Polish failed: ${err.message}. Check your local AI connection.`);
    } finally {
      setIsAiGenerating(false);
    }
  };

  // Submit Post
  const handlePost = async () => {
    if (!text.trim() && images.length === 0) return;
    if (text.length > maxChars) {
      setError(`Post exceeds character limit by ${text.length - maxChars}`);
      return;
    }

    if (!atproto.isLoggedIn()) {
      setError('Please sign in to publish to Bluesky.');
      return;
    }

    setIsPosting(true);
    setError(null);

    try {
      // 1. Upload images if any
      const uploadedBlobs = [];
      for (const img of images) {
        const uploaded = await atproto.uploadImage(img.file);
        uploadedBlobs.push({
          blob: uploaded.blob,
          alt: img.alt,
          aspectRatio: uploaded.aspectRatio,
        });
      }

      // 2. Prepare reply params if replying
      let replyParam: any = undefined;
      if (replyTo) {
        const root = replyTo.record?.reply?.root || { uri: replyTo.uri, cid: replyTo.cid };
        replyParam = {
          root,
          parent: { uri: replyTo.uri, cid: replyTo.cid },
        };
      }

      // 3. Create post with automatic facets detection
      await atproto.createPost({
        text,
        replyTo: replyParam,
        images: uploadedBlobs.length > 0 ? uploadedBlobs : undefined,
      });

      // Confetti celebration
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#00f2fe', '#4facfe', '#7000ff', '#ffffff'],
      });

      // Clear draft
      setText('');
      storage.setDraft('');
      setImages([]);
      if (onPostSuccess) onPostSuccess();
      if (onCancelReply) onCancelReply();
    } catch (err: any) {
      setError(err.message || 'Failed to publish post');
    } finally {
      setIsPosting(false);
    }
  };

  // SVG ring calculation
  const radius = 10;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(1, text.length / maxChars);
  const strokeDashoffset = circumference - progress * circumference;
  const ringColor =
    charsLeft < 0
      ? 'text-red-500 stroke-red-500'
      : charsLeft < 30
      ? 'text-amber-400 stroke-amber-400'
      : 'text-cyan-400 stroke-cyan-400';

  return (
    <div className="relative rounded-2xl bg-[#09090b] border border-[#1f1f24] shadow-xl p-4 transition-all focus-within:border-cyan-500/40 focus-within:shadow-cyan-500/5">
      {/* Reply Context Banner */}
      {replyTo && (
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#1c1c22] text-xs text-zinc-400">
          <div className="flex items-center gap-2 truncate">
            <span className="text-zinc-500">Replying to</span>
            <span className="font-semibold text-cyan-400">@{replyTo.author.handle}</span>
            <span className="truncate text-zinc-500">"{replyTo.record.text}"</span>
          </div>
          {onCancelReply && (
            <button
              onClick={onCancelReply}
              className="text-zinc-500 hover:text-white p-1 rounded hover:bg-zinc-800"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      {/* Editor & Autocomplete Container */}
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={handleTextChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          rows={3}
          className="w-full bg-transparent resize-none text-[15px] leading-relaxed text-zinc-100 placeholder-zinc-600 focus:outline-none font-sans"
        />

        {/* Prediction Dropdown for @ Mentions */}
        {activeQuery?.type === 'mention' && mentionSuggestions.length > 0 && (
          <div className="absolute left-0 bottom-full mb-2 w-72 rounded-xl bg-[#0f0f14] border border-[#2b2b36] shadow-2xl z-50 overflow-hidden animate-fade-in">
            <div className="px-3 py-1.5 bg-[#14141c] border-b border-[#22222e] text-[10px] font-semibold text-cyan-400 uppercase tracking-wider flex items-center gap-1">
              <AtSign className="w-3 h-3" /> Mention User
            </div>
            <div className="max-h-48 overflow-y-auto">
              {mentionSuggestions.map((user, idx) => (
                <button
                  key={user.did}
                  type="button"
                  onClick={() => insertMention(user)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 text-left transition ${
                    idx === selectedIndex ? 'bg-cyan-950/60 text-white' : 'hover:bg-zinc-800/50 text-zinc-300'
                  }`}
                >
                  {user.avatar ? (
                    <img src={user.avatar} alt="" className="w-7 h-7 rounded-full object-cover shrink-0" />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold text-cyan-400 shrink-0">
                      {user.handle[0].toUpperCase()}
                    </div>
                  )}
                  <div className="truncate">
                    <div className="text-xs font-semibold text-white truncate">
                      {user.displayName || user.handle}
                    </div>
                    <div className="text-[11px] text-zinc-400 truncate">@{user.handle}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Prediction Dropdown for # Hashtags */}
        {activeQuery?.type === 'hashtag' && hashtagSuggestions.length > 0 && (
          <div className="absolute left-0 bottom-full mb-2 w-64 rounded-xl bg-[#0f0f14] border border-[#2b2b36] shadow-2xl z-50 overflow-hidden animate-fade-in">
            <div className="px-3 py-1.5 bg-[#14141c] border-b border-[#22222e] text-[10px] font-semibold text-purple-400 uppercase tracking-wider flex items-center gap-1">
              <Hash className="w-3 h-3" /> Recommended Hashtags
            </div>
            <div className="max-h-48 overflow-y-auto">
              {hashtagSuggestions.map((tag, idx) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => insertHashtag(tag)}
                  className={`w-full flex items-center gap-2 px-3 py-2 text-left text-xs font-medium transition ${
                    idx === selectedIndex ? 'bg-purple-950/60 text-white' : 'hover:bg-zinc-800/50 text-zinc-300'
                  }`}
                >
                  <span className="text-purple-400 font-bold">#</span>
                  <span>{tag}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Image Previews */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 my-3">
          {images.map((img, i) => (
            <div key={i} className="relative group rounded-xl overflow-hidden border border-[#27272a] aspect-video bg-black">
              <img src={img.preview} alt="" className="w-full h-full object-cover" />
              <button
                onClick={() => removeImage(i)}
                className="absolute top-1.5 right-1.5 p-1 rounded-full bg-black/70 hover:bg-red-600 text-white transition"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Error Notice */}
      {error && (
        <div className="flex items-center gap-2 p-2.5 my-2 rounded-xl bg-red-950/40 border border-red-800/40 text-xs text-red-300">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Toolbar & Actions */}
      <div className="flex items-center justify-between pt-3 border-t border-[#1a1a20]">
        <div className="flex items-center gap-1">
          {/* Add Image */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleImageSelect}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            title="Attach images"
            className="p-2 text-zinc-400 hover:text-cyan-400 rounded-lg hover:bg-zinc-800/60 transition"
          >
            <Image className="w-4 h-4" />
          </button>

          {/* AI Polish Button */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowAIAssist(!showAIAssist)}
              disabled={isAiGenerating}
              title="Local AI Polish"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-zinc-400 hover:text-cyan-300 hover:bg-cyan-950/40 border border-transparent hover:border-cyan-800/50 transition"
            >
              <Wand2 className={`w-3.5 h-3.5 text-cyan-400 ${isAiGenerating ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">AI Polish</span>
            </button>

            {/* AI Polish Options Popover */}
            {showAIAssist && (
              <div className="absolute left-0 bottom-full mb-2 w-64 rounded-xl bg-[#0e0e12] border border-[#272730] shadow-2xl p-2 z-50 space-y-1 animate-fade-in">
                <div className="px-2 py-1 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                  Local AI Quick Polish
                </div>
                {[
                  { label: '✨ Make it punchier', instruction: 'Make this post punchier and more engaging' },
                  { label: '✂️ Fit under 300 chars', instruction: 'Condense this post to fit tightly under 300 characters without losing substance' },
                  { label: '🏷️ Add Smart Hashtags', instruction: 'Add 2-3 optimal trending hashtags to this post' },
                  { label: '🎯 Fix Tone & Grammar', instruction: 'Fix grammar and enhance clarity while keeping the original voice' },
                ].map((action, i) => (
                  <button
                    key={i}
                    onClick={() => runAiAssist(action.instruction)}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs text-zinc-300 hover:bg-cyan-950/60 hover:text-cyan-200 transition"
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right side: Circular Counter & Post Button */}
        <div className="flex items-center gap-3">
          {/* Circular Progress Ring */}
          <div className="relative flex items-center justify-center w-7 h-7">
            <svg className="w-7 h-7 transform -rotate-90">
              <circle
                cx="14"
                cy="14"
                r={radius}
                className="stroke-zinc-800"
                strokeWidth="2.5"
                fill="none"
              />
              <circle
                cx="14"
                cy="14"
                r={radius}
                className={`transition-all duration-300 ${ringColor}`}
                strokeWidth="2.5"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="none"
              />
            </svg>
            {charsLeft <= 25 && (
              <span className={`absolute text-[10px] font-bold ${charsLeft < 0 ? 'text-red-400' : 'text-amber-400'}`}>
                {charsLeft}
              </span>
            )}
          </div>

          {/* Post Button */}
          <button
            type="button"
            onClick={handlePost}
            disabled={isPosting || (!text.trim() && images.length === 0) || charsLeft < 0}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold text-xs shadow-lg shadow-cyan-500/20 transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isPosting ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Send className="w-3.5 h-3.5" />
            )}
            <span>{replyTo ? 'Reply' : 'Post'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
