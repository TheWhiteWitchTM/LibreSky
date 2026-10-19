export function timeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return `${Math.max(1, seconds)}s`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d`;
  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks}w`;
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export function formatNumber(num?: number): string {
  if (!num) return '0';
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
}

/**
 * Parses raw post text into tokens (plain text, @mentions, #hashtags, URLs)
 * for high-contrast syntax highlighting.
 */
export interface TextToken {
  type: 'text' | 'mention' | 'hashtag' | 'link';
  content: string;
  url?: string;
}

export function parseRichText(text: string): TextToken[] {
  if (!text) return [];

  // Match mentions (@handle), hashtags (#tag), or URLs (https?://...)
  const regex = /(@[a-zA-Z0-9.-]+)|(#[a-zA-Z0-9_\u0080-\uFFFF]+)|(https?:\/\/[^\s]+)/gu;
  const tokens: TextToken[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      tokens.push({
        type: 'text',
        content: text.substring(lastIndex, match.index),
      });
    }

    const matched = match[0];
    if (matched.startsWith('@')) {
      tokens.push({ type: 'mention', content: matched });
    } else if (matched.startsWith('#')) {
      tokens.push({ type: 'hashtag', content: matched });
    } else if (matched.startsWith('http')) {
      tokens.push({ type: 'link', content: matched, url: matched });
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    tokens.push({
      type: 'text',
      content: text.substring(lastIndex),
    });
  }

  return tokens;
}
