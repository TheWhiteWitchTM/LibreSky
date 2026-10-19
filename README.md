# 🦋 LibreSky

> **The next-generation Bluesky client engineered for privacy, speed, and aesthetics. Featuring real-time `@` and `#` autocomplete, local AI integration with a Grok-style button, OLED true-black design, and dual-mode deployment for Electron (Linux/Windows) and GitHub Pages.**

---

## ✨ Key Highlights

- 🌌 **OLED True-Black Aesthetic (`#000000`)**: Designed to be vastly easier on the eyes than standard grey-dark themes, with razor-sharp contrast, cyan & neon blue accents, and readable modern typography.
- 🤖 **Local AI Engine (Private & Offline-Ready)**:
  - **Auto-Detection**: Automatically detects local AI instances running on your system (**Ollama** on port `11434`, **LM Studio** on port `1234`, **LocalAI** on port `8080`).
  - **Grok-style AI Button**: Click the sparkle button on any post to:
    - ⚡ **Explain Context**: Subtext, news references, and background
    - 🔍 **Fact-Check**: Critical analysis of claims and logic
    - 🧵 **Thread TL;DR**: One-click discussion synopsis
    - 💬 **Draft Reply**: Generate 3 distinct reply angles (witty, agreeable, counter-point)
    - 🎭 **Roast (Fun Mode)**: Grok-style playful roasts
    - 🌐 **Instant Translation**: Multilingual translation
  - **LibreAI Copilot Dock**: Dedicated side panel to chat with your local models and generate real-time timeline digests.
- ✍️ **Cool Composer with Real-Time Prediction**:
  - **`@` Mentions Prediction**: Type `@` to instantly query and search accounts via the AT Protocol with avatar preview.
  - **`#` Hashtag Autocomplete**: Type `#` for instant recommendations of trending and matching tags.
  - **Syntax Highlighting**: Real-time coloring for mentions, tags, and links.
  - **AI Polish Toolbar**: One-click actions to make posts punchier, generate hashtags, or condense under 300 characters.
  - **Circular Progress Limiter**: Dynamic SVG ring showing remaining characters.
  - **Confetti Micro-Interactions**: Celebrate published posts with smooth canvas confetti!
- 🔐 **Decentralized Authentication**:
  - **OAuth2 Flow**: Secure AT Protocol authorization code flow with PKCE.
  - **App Password Login**: Instant sign-in with your handle and Bluesky App Password.
  - **Guest Mode**: Explore What's Hot, Discover feeds, and user profiles without credentials.
- 🖥️ **Cross-Platform**:
  - **Desktop (Electron)**: Built for **Linux** (`.AppImage`, `.deb`) and **Windows** (`.exe` NSIS installer & portable).
  - **Web (GitHub Pages)**: Dual-target build ready to be hosted as a static site on GitHub Pages with automated CI/CD workflow included!

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+)
- npm (v9+)
- (Optional) [Ollama](https://ollama.com/) or [LM Studio](https://lmstudio.ai/) for local AI features.

### 1. Installation
```bash
git clone https://github.com/TheWhiteWitchTM/LibreSky.git
cd LibreSky
npm install
```

### 2. Run in Development Mode
To run the web version in your browser:
```bash
npm run dev
```

To run the desktop version with Electron:
```bash
npm run electron:dev
```

---

## 🤖 Setting Up Local AI

LibreSky does not send your data to proprietary cloud servers. It directly connects to your local hardware:

### Option A: Ollama
1. Install [Ollama](https://ollama.com/).
2. Pull and run your preferred model:
   ```bash
   ollama run llama3.2
   # Or deepseek-r1, mistral, qwen2.5, phi4
   ```
3. LibreSky will automatically detect Ollama at `http://127.0.0.1:11434`.

### Option B: LM Studio
1. Download [LM Studio](https://lmstudio.ai/).
2. Load any model of your choice.
3. In the "Local Server" tab, click **Start Server** (default port `1234`).
4. LibreSky will automatically connect to LM Studio!

---

## 📦 Building Native Desktop Packages

### Linux (`.AppImage` & `.deb`)
```bash
npm run electron:build:linux
```
Output files will be generated in `release/`.

### Windows (`.exe` installer & portable)
```bash
npm run electron:build:win
```

---

## 🌐 Deploying to GitHub Pages

LibreSky is fully configured to be hosted as a static web app on GitHub Pages!

1. Push your repository to GitHub:
   ```bash
   git push origin main
   ```
2. In your GitHub repository:
   - Go to **Settings** > **Pages**.
   - Under **Build and deployment**, set **Source** to **GitHub Actions**.
3. The included workflow [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) will automatically build and publish LibreSky to:
   ```
   https://<your-username>.github.io/LibreSky/
   ```

To build the static web version locally:
```bash
npm run build:web
```
The output will be in `dist/`.

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
| :--- | :--- |
| `C` | Open New Post Composer |
| `R` | Refresh Feed |
| `Esc` | Close Modal / Exit Thread View |
| `Ctrl + Enter` / `Cmd + Enter` | Publish Post from Composer |
| `↑` / `↓` | Navigate Autocomplete Suggestions |
| `Enter` / `Tab` | Select Autocomplete Mention or Tag |

---

## 📄 License

MIT © [TheWhiteWitchTM](https://github.com/TheWhiteWitchTM)
