const { app, BrowserWindow, shell } = require('electron');
const http = require('http');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { forgetApi, startControl } = require('./open.cjs');

const PORT = 47321;
const PROFILE = path.join(os.homedir(), '.local', 'state', 'libresky', 'electron');

app.setName('LibreSky');
if (process.platform === 'linux') {
  app.setDesktopName('libresky');
  app.commandLine.appendSwitch('class', 'libresky');
  app.setPath('userData', PROFILE);
}
const ROOT = path.join(__dirname, 'www');
const SITE = 'https://thewhitewitchtm.github.io/LibreSky';
const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.webmanifest': 'application/manifest+json',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.ico': 'image/x-icon',
  '.map': 'application/json',
};

let server = null;
let control = null;
let port = PORT;
let win = null;

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function raiseWindow() {
  if (!win) return false;
  if (win.isMinimized()) win.restore();
  win.show();
  win.focus();
  try { app.focus({ steal: true }); } catch { /* Wayland can refuse a stolen focus */ }
  return true;
}

async function pageWhere() {
  if (!win) return { hash: '', title: '' };
  try {
    const state = await win.webContents.executeJavaScript('({ hash: location.hash || "", title: document.title || "" })', true);
    if (!state || typeof state !== 'object') return { hash: '', title: '' };
    return { hash: String(state.hash || '').slice(0, 300), title: String(state.title || '').slice(0, 180) };
  } catch {
    return { hash: '', title: '' };
  }
}

async function openHash(hash) {
  if (!win) return { ok: false, error: 'LibreSky is not open.' };
  raiseWindow();
  const deadline = Date.now() + 15000;
  while (win.webContents.isLoading() && Date.now() < deadline) await wait(200);
  while (Date.now() < deadline) {
    try {
      const shown = await win.webContents.executeJavaScript(`location.hash = ${JSON.stringify(hash)}; location.hash`, true);
      if (shown === hash) {
        raiseWindow();
        return { ok: true, hash, href: `http://127.0.0.1:${port}/${hash}` };
      }
    } catch {
      /* the page is still booting */
    }
    await wait(300);
  }
  return { ok: false, error: 'LibreSky did not open that post.' };
}

function insideRoot(file) {
  const root = path.resolve(ROOT);
  const target = path.resolve(file);
  return target === root || target.startsWith(root + path.sep);
}

function sendFile(res, file, status = 200) {
  fs.readFile(file, (error, data) => {
    if (error) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Not found');
      return;
    }
    const type = TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream';
    res.writeHead(status, { 'Content-Type': type, 'Cache-Control': 'no-cache' });
    res.end(data);
  });
}

function serve(req, res) {
  let pathname = '/';
  try {
    pathname = decodeURIComponent(new URL(req.url, `http://127.0.0.1:${port}`).pathname);
  } catch {
    res.writeHead(400);
    res.end();
    return;
  }
  if (pathname === '/') pathname = '/index.html';
  const file = path.normalize(path.join(ROOT, pathname));
  if (!insideRoot(file)) {
    res.writeHead(403);
    res.end();
    return;
  }
  fs.stat(file, (error, stat) => {
    if (!error && stat.isDirectory()) {
      sendFile(res, path.join(file, 'index.html'));
      return;
    }
    if (error) {
      sendFile(res, path.join(ROOT, '404.html'), 404);
      return;
    }
    sendFile(res, file);
  });
}

function listen(candidate) {
  return new Promise((resolve, reject) => {
    const next = http.createServer(serve);
    next.once('error', reject);
    next.listen(candidate, '127.0.0.1', () => {
      next.off('error', reject);
      resolve(next);
    });
  });
}

async function startServer() {
  for (let offset = 0; offset < 20; offset += 1) {
    try {
      const next = await listen(PORT + offset);
      server = next;
      port = PORT + offset;
      return port;
    } catch (error) {
      if (error?.code !== 'EADDRINUSE') throw error;
    }
  }
  throw new Error('LibreSky could not open a local port.');
}

function publishedDownload(url) {
  try {
    const parsed = new URL(url);
    const name = path.basename(parsed.pathname);
    if (!/^LibreSky-.+\.zip$/.test(name)) return '';
    return `${SITE}#/downloads/${encodeURIComponent(name)}`;
  } catch {
    return '';
  }
}

function allowNavigation(url) {
  if (url.startsWith(`http://127.0.0.1:${port}/`) || url === `http://127.0.0.1:${port}`) return true;
  if (url.startsWith('https://')) return true;
  return false;
}

function createWindow() {
  win = new BrowserWindow({
    width: 1180,
    height: 820,
    minWidth: 720,
    minHeight: 560,
    title: 'LibreSky',
    autoHideMenuBar: process.platform !== 'darwin',
    backgroundColor: '#ffffff',
    icon: path.join(ROOT, 'assets', 'icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
    },
  });
  win.webContents.session.on('will-download', (event, item) => {
    const published = publishedDownload(item.getURL());
    if (!published) return;
    event.preventDefault();
    shell.openExternal(published);
  });
  win.webContents.setWindowOpenHandler(({ url }) => {
    const download = publishedDownload(url);
    if (download) shell.openExternal(download);
    else if (url.startsWith('https://') || url.startsWith('http://')) shell.openExternal(url);
    return { action: 'deny' };
  });
  win.webContents.on('will-navigate', (event, url) => {
    const download = publishedDownload(url);
    if (download) {
      event.preventDefault();
      shell.openExternal(download);
      return;
    }
    if (!allowNavigation(url)) {
      event.preventDefault();
      if (url.startsWith('http://') || url.startsWith('https://')) shell.openExternal(url);
    }
  });
  win.loadURL(`http://127.0.0.1:${port}/`);
}

const locked = app.requestSingleInstanceLock();
if (!locked) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (!win) return;
    if (win.isMinimized()) win.restore();
    win.show();
    win.focus();
  });
  app.whenReady().then(async () => {
    await startServer();
    createWindow();
    control = await startControl({
      focus: raiseWindow,
      open: openHash,
      where: pageWhere,
    });
    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
  }).catch((error) => {
    console.error(error);
    app.quit();
  });
  app.on('window-all-closed', () => {
    server?.close();
    control?.close();
    forgetApi();
    app.quit();
  });
}
