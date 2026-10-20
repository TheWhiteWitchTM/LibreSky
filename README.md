# LibreSky

Sovereign Bluesky client with dark default theme and local AI assistant.

Mira, [The White Witch™](https://thewhitewitchtm.github.io/whitewitch/). [X](https://x.com/TheWhiteWitchTM) · [thewhitewitchtm@google.com](mailto:thewhitewitchtm@google.com) · [GitHub](https://github.com/TheWhiteWitchTM) · [Bluesky](https://bsky.app/profile/thewhitewitchtm.sociallydead.me) · [MIT License](LICENSE)

Hosted directly on GitHub Pages with **zero framework overhead** and **zero custom build actions**. Pure, fast, sovereign web client for the AT Protocol with built-in Grok-style local AI.

---

## Quick Launch

```bash
bin/libresky
```

Or with npm:
```bash
npm start
```

This starts a lightweight local server and opens `http://127.0.0.1:4173` in your default browser.

### GitHub Pages

Deployed directly to GitHub Pages at:
[https://thewhitewitchtm.github.io/LibreSky/](https://thewhitewitchtm.github.io/LibreSky/)

Deploying changes:
```bash
./ghpush.sh "Commit message"
```

---

## Features

### 1. Pure Pitch Black Aesthetic
- Starts pure black (`#000000`) matching MAGIC Studio styling with subtle `#222222` borders and crisp typography.
- High-contrast, clean sans-serif UI with JetBrains Mono accents.
- Fast, fluid micro-interactions with glowing gold spark accents.
- Toggleable light theme option in Settings.

### 2. Local AI & Grok Engine
- Automatically scans your machine on startup for local AI endpoints:
  - **Ollama**: `http://127.0.0.1:11434`
  - **LM Studio**: `http://127.0.0.1:1234`
- Displays the **Grok AI button** (gold spark) in navigation, on post cards, and in the post composer.
- Shows live connection status and model picker (e.g. `writer:latest`, `coder:latest`, `qwen3.5:4b`).
- **Grok Assistant Drawer**:
  - Live streaming chat responses.
  - Persona selector: Grok / Witty, Objective Summarizer, Fact-Checker, Social Ghostwriter.
  - Timeline quick prompts: "✨ Summarize Feed", "🔍 Deep Dive", "🎭 Roast The Timeline".
- **Post AI Tools**:
  - ✨ Summarize discussion threads into key takeaways.
  - 🧠 Explain subtext, technical jargon, and cultural context.
  - 🔍 Fact-check assertions made in a post.
  - 💬 Draft 3 punchy, engaging reply options.
  - 🔥 Deliver a witty roast of a post.
- **Composer AI Tools**:
  - Polish and punch up drafts.
  - Condense thoughts to fit under the 300-character limit.
  - Translate posts into German, Spanish, French, or Japanese.

### 3. Complete Bluesky & AT Protocol Capabilities
- **Authentication**:
  - Sign in with Handle / Email + App Password via `com.atproto.server.createSession`.
  - OAuth client metadata support (`client-metadata.json`).
  - Supports custom PDS hosts (defaults to `https://bsky.social`).
  - Guest mode: browse public feeds, threads, profiles, and search without signing in.
- **Feeds**:
  - Home Timeline (Following)
  - Discover / What's Hot feed
  - Real-time refresh button and infinite pagination
- **Rich Post Cards**:
  - Clickable @mentions, #hashtags, and links.
  - Responsive multi-image grids (1 to 4 images).
  - High-resolution fullscreen Lightbox viewer with ALT text display.
  - External link preview cards (thumbnails, title, domain, description).
  - Quoted post embeds.
- **Post Interactions**:
  - Instant Like / Unlike with heart animation.
  - Repost and Quote Post.
  - Reply with original post context.
  - Local Bookmarks / Saved Posts.
  - Share link / Copy URL.
- **Thread Conversations**:
  - Full parent chain hierarchy with vertical connector line.
  - Focused post with full stats (likes, reposts, quotes).
  - Nested reply stream.
- **Profiles**:
  - Banner header, avatar, display name, handle, bio, join date.
  - Followers, Following, and Posts count.
  - Follow / Unfollow toggle.
  - Filter tabs: Posts, Posts & Replies, Media.
- **Search & Explore**:
  - Live keyword and hashtag post search.
  - Actor / profile search.
- **Notifications**:
  - Mentions, likes, reposts, and follows with unread badge counter.
- **Direct Messages (Chat)**:
  - Bluesky Chat conversation list and messaging.

---

## Local AI Setup (Ollama)

To use the local AI features with Ollama:

```bash
# Start Ollama
systemctl --user enable --now ollama

# Pull recommended writing and coding models
ollama pull qwen3.5:4b
ollama pull writer
```

If connecting from browser:
Ensure `OLLAMA_ORIGINS="*"` is enabled in your Ollama environment if using browser cross-origin requests. Running locally via `bin/libresky` serves on localhost for seamless access.

---

## License

[MIT License](LICENSE) © 2026 The White Witch
