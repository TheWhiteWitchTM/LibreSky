# LibreSky

Plain GitHub Pages Bluesky client. No Vite, no React, no Jekyll. The desktop app is LibreOffice.

Mira, [The White Witch™](https://thewhitewitchtm.github.io/whitewitch/). [X](https://x.com/TheWhiteWitchTM) · [thewhitewitchtm@google.com](mailto:thewhitewitchtm@google.com) · [GitHub](https://github.com/TheWhiteWitchTM) · [YouTube](https://youtube.com/@TheWhiteWitchTM) · [Bluesky](https://bsky.app/profile/thewhitewitchtm.sociallydead.me) · [MIT License](LICENSE)

[https://thewhitewitchtm.github.io/LibreSky/](https://thewhitewitchtm.github.io/LibreSky/)

The site is static HTML, CSS, and JS. GitHub Pages serves those files as they are.

## LibreOffice

LibreOffice is the Electron Bluesky client in this repo. The window, protocol, preload bridge, local AI IPC, and desktop launcher follow MAGIC Studio.

```bash
npm install
npm start
```

`bin/libreoffice` does the same thing and picks up the tools on PATH, including nvm. `npm run desktop` adds an application-menu launcher for this machine.

The renderer is the same `index.html` GitHub Pages hosts. In the window the product name is LibreOffice. Local Ollama is reached through the main process, so CORS does not block it.

## Web

```bash
npm run web
```

or

```bash
bin/libresky
```

That serves the static files at `http://127.0.0.1:4173`.

## Local AI

Ollama serves Ask at `127.0.0.1:11434`. Local mode does not send the prompt to a cloud model.

```bash
curl -fsSL https://ollama.com/install.sh | sh
systemctl --user enable --now ollama
ollama pull qwen3.5:4b
ollama create writer -f ai/writer.Modelfile
```

Help → Local AI in LibreOffice shows the same steps. In the browser, set `OLLAMA_ORIGINS="*"` if the page is not on localhost.

## Sign in

Guest mode reads public feeds. Sign in with a handle and a Bluesky app password. Custom PDS hosts are supported.

## Deploy

Push to `main`. There is no app build. The Pages workflow copies `index.html`, `css/`, `js/`, and `assets/`.

```bash
./ghpush.sh "Commit message"
```
