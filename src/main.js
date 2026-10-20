import fs from 'node:fs';
import path from 'node:path';
import {
  app,
  BrowserWindow,
  ipcMain,
  Menu,
  nativeTheme,
  protocol,
  shell,
} from 'electron';
import { MIME, appRoot, fileFromAppUrl } from './paths.js';
import { probeOllama, streamChat } from './services/ollama.js';
import { DEFAULTS, loadJson, saveJson } from './services/store.js';

app.setName('libresky-office');
nativeTheme.themeSource = 'dark';
if (process.env.LIBREOFFICE_DATA) {
  app.setPath('userData', path.resolve(process.env.LIBREOFFICE_DATA));
}

protocol.registerSchemesAsPrivileged([
  {
    scheme: 'office',
    privileges: {
      standard: true,
      secure: true,
      supportFetchAPI: true,
      corsEnabled: true,
      stream: true,
      codeCache: true,
    },
  },
]);

const smoke = process.env.LIBREOFFICE_SMOKE === '1';

let win = null;
let settings = { ...DEFAULTS };
let settingsFile = '';
let runtime = {
  ollama: { ok: false, host: 'http://127.0.0.1:11434', version: '', models: [], loaded: [], chatModel: '', completeModel: '' },
};
let allowClose = smoke;
let ollamaAbort = null;
let askGeneration = 0;

function version() {
  try {
    return JSON.parse(fs.readFileSync(path.join(appRoot, 'package.json'), 'utf8')).version || '0.1.0';
  } catch {
    return '0.1.0';
  }
}

function persistSettings() {
  if (!settingsFile || smoke) return;
  saveJson(settingsFile, settings);
}

function send(channel, payload) {
  if (win && !win.isDestroyed()) win.webContents.send(channel, payload);
}

function chromeIsDark() {
  return settings.theme !== 'light';
}

function applyChromeTheme(theme) {
  const dark = theme !== 'light';
  nativeTheme.themeSource = dark ? 'dark' : 'light';
  settings = { ...settings, theme: dark ? 'black' : 'light' };
  if (win && !win.isDestroyed()) win.setBackgroundColor(dark ? '#000000' : '#f7f7f7');
}

function stopOllama() {
  if (ollamaAbort) {
    ollamaAbort.abort();
    ollamaAbort = null;
  }
}

function buildMenu() {
  const sendCommand = (id) => () => send('menu:command', id);
  const template = [
    {
      label: 'File',
      submenu: [
        { label: 'Sign In…', click: sendCommand('auth.login') },
        { label: 'Compose', accelerator: 'CmdOrCtrl+N', click: sendCommand('compose.open') },
        { type: 'separator' },
        { role: 'quit' },
      ],
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { label: 'Redo', accelerator: 'CmdOrCtrl+Shift+Z', role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'selectAll' },
      ],
    },
    {
      label: 'View',
      submenu: [
        { label: 'Home', accelerator: 'Alt+1', click: sendCommand('view.timeline') },
        { label: 'Discover', accelerator: 'Alt+2', click: sendCommand('view.discover') },
        { label: 'Search', accelerator: 'Alt+3', click: sendCommand('view.search') },
        { type: 'separator' },
        { label: 'Ask', accelerator: 'Alt+9', click: sendCommand('grok.toggle') },
        { label: 'Toggle Theme', click: sendCommand('view.theme') },
        { type: 'separator' },
        { role: 'toggleDevTools' },
        { label: 'Reload Window', click: () => win?.webContents.reload() },
        { role: 'togglefullscreen' },
      ],
    },
    {
      label: 'Help',
      submenu: [
        { label: 'Local AI', click: sendCommand('help.local') },
        { label: 'LibreSky on GitHub Pages', click: () => shell.openExternal('https://thewhitewitchtm.github.io/LibreSky/') },
        { type: 'separator' },
        { label: 'About LibreOffice', click: sendCommand('help.about') },
      ],
    },
  ];
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
  if (win && !win.isDestroyed()) win.setMenuBarVisibility(false);
}

function createWindow() {
  const bounds = settings.bounds || { width: 1300, height: 860 };
  win = new BrowserWindow({
    width: bounds.width || 1300,
    height: bounds.height || 860,
    x: Number.isFinite(bounds.x) ? bounds.x : undefined,
    y: Number.isFinite(bounds.y) ? bounds.y : undefined,
    minWidth: 880,
    minHeight: 600,
    show: false,
    backgroundColor: chromeIsDark() ? '#000000' : '#f7f7f7',
    darkTheme: chromeIsDark(),
    autoHideMenuBar: false,
    title: 'LibreOffice',
    icon: path.join(appRoot, 'assets', 'icon.png'),
    webPreferences: {
      preload: path.join(appRoot, 'src', 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
      spellcheck: false,
    },
  });
  win.setMenuBarVisibility(false);
  if (bounds.maximized) win.maximize();
  win.once('ready-to-show', () => {
    win.setMenuBarVisibility(false);
    if (!smoke) win.show();
  });
  win.on('close', (event) => {
    if (allowClose) return;
    event.preventDefault();
    send('app:requestClose');
  });
  win.on('resize', saveBounds);
  win.on('move', saveBounds);
  const query = smoke ? '?smoke=1' : '';
  win.loadURL(`office://app/index.html${query}`);
  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });
  win.webContents.on('will-navigate', (event, url) => {
    if (!url.startsWith('office://app/')) {
      event.preventDefault();
      if (/^https?:/i.test(url)) shell.openExternal(url);
    }
  });
}

function saveBounds() {
  if (!win || win.isDestroyed() || smoke) return;
  const maximized = win.isMaximized();
  const normal = maximized ? settings.bounds : win.getBounds();
  settings = {
    ...settings,
    bounds: {
      ...(normal || win.getBounds()),
      maximized,
    },
  };
  persistSettings();
}

function registerIpc() {
  ipcMain.handle('app:info', () => ({
    version: version(),
    ollama: runtime.ollama,
    aiDir: path.join(appRoot, 'ai'),
    settings,
    home: app.getPath('home'),
    licenseFile: path.join(appRoot, 'LICENSE'),
    pagesUrl: 'https://thewhitewitchtm.github.io/LibreSky/',
  }));

  ipcMain.handle('app:closeResult', (_event, allow) => {
    if (!allow) return false;
    allowClose = true;
    saveBounds();
    win.close();
    return true;
  });

  ipcMain.handle('app:title', (_event, title) => {
    if (win && !win.isDestroyed()) win.setTitle(title ? `${title} — LibreOffice` : 'LibreOffice');
  });

  ipcMain.handle('window:theme', (_event, theme) => {
    applyChromeTheme(theme);
    persistSettings();
    return settings.theme;
  });

  ipcMain.handle('settings:set', (_event, patch) => {
    settings = { ...settings, ...(patch || {}) };
    persistSettings();
    return settings;
  });

  ipcMain.handle('shell:open', (_event, url) => {
    shell.openExternal(url);
    return true;
  });

  ipcMain.handle('ollama:status', async () => {
    runtime.ollama = await probeOllama();
    return runtime.ollama;
  });

  ipcMain.handle('ollama:start', async (_event, payload) => {
    if (!runtime.ollama?.ok) runtime.ollama = await probeOllama();
    if (!runtime.ollama.ok) return { ok: false, error: 'Ollama is not running on 127.0.0.1:11434.' };
    const model = String(payload?.model || runtime.ollama.chatModel || '');
    if (!model) return { ok: false, error: 'No local model is installed yet. Help → Local AI has the steps.' };
    const generation = ++askGeneration;
    stopOllama();
    const controller = new AbortController();
    ollamaAbort = controller;
    const messages = Array.isArray(payload?.messages) ? payload.messages.slice(-12) : [];
    streamChat({
      model,
      messages,
      signal: controller.signal,
      onText: (data) => {
        if (generation === askGeneration) send('ollama:event', { type: 'text', data });
      },
    }).then(() => {
      if (generation === askGeneration) send('ollama:event', { type: 'exit' });
    }).catch((error) => {
      if (generation !== askGeneration) return;
      if (error?.name === 'AbortError') send('ollama:event', { type: 'exit', cancelled: true });
      else {
        send('ollama:event', { type: 'error', message: error.message || 'The local model failed' });
        send('ollama:event', { type: 'exit' });
      }
    }).finally(() => {
      if (ollamaAbort === controller) ollamaAbort = null;
    });
    return { ok: true };
  });

  ipcMain.handle('ollama:cancel', () => {
    askGeneration += 1;
    stopOllama();
    send('ollama:event', { type: 'exit', cancelled: true });
    return true;
  });

  ipcMain.on('smoke:ready', async () => {
    if (!smoke || !win) return;
    try {
      const result = await win.webContents.executeJavaScript(`({
        app: !!document.getElementById('app'),
        feed: !!document.getElementById('feed-container'),
        splashHidden: document.getElementById('splash')?.hidden === true,
        theme: document.documentElement.getAttribute('data-theme') || '',
        office: typeof window.office === 'object',
        cards: document.querySelectorAll('.post-card').length
      })`);
      console.log(`SMOKE ${JSON.stringify(result)}`);
      app.exit(result.app && result.feed && result.splashHidden && result.office ? 0 : 1);
    } catch (error) {
      console.log(`SMOKE ${JSON.stringify({ error: String(error) })}`);
      app.exit(1);
    }
  });
}

const gotLock = app.requestSingleInstanceLock();
if (!gotLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (win) {
      if (win.isMinimized()) win.restore();
      win.focus();
    }
  });

  app.whenReady().then(async () => {
    const userData = app.getPath('userData');
    settingsFile = path.join(userData, 'settings.json');
    settings = loadJson(settingsFile, DEFAULTS);
    if (settings.theme !== 'light') settings.theme = 'black';
    applyChromeTheme(settings.theme);
    runtime.ollama = await probeOllama();

    protocol.handle('office', async (request) => {
      const file = fileFromAppUrl(request.url);
      if (!file) return new Response('forbidden', { status: 403 });
      try {
        const data = await fs.promises.readFile(file);
        const type = MIME[path.extname(file).toLowerCase()] || 'application/octet-stream';
        return new Response(data, { headers: { 'Content-Type': type, 'Cache-Control': 'no-store' } });
      } catch {
        return new Response('missing', { status: 404 });
      }
    });

    registerIpc();
    buildMenu();
    createWindow();
  });

  app.on('window-all-closed', () => {
    stopOllama();
    if (process.platform !== 'darwin') app.quit();
  });

  app.on('before-quit', () => {
    allowClose = true;
    stopOllama();
  });
}
