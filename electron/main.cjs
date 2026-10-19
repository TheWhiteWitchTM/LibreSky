const { app, BrowserWindow, ipcMain, shell, protocol } = require('electron');
const path = require('path');
const http = require('http');

let mainWindow = null;
const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;

// Register custom protocol for OAuth callback handling if needed
if (process.defaultApp) {
  if (process.argv.length >= 2) {
    app.setAsDefaultProtocolClient('libresky', process.execPath, [path.resolve(process.argv[1])]);
  }
} else {
  app.setAsDefaultProtocolClient('libresky');
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1300,
    height: 860,
    minWidth: 880,
    minHeight: 600,
    backgroundColor: '#000000',
    title: 'LibreSky',
    autoHideMenuBar: true,
    titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'default',
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false,
      webSecurity: true,
    },
  });

  // Open external links in default browser
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('http:') || url.startsWith('https:')) {
      shell.openExternal(url);
      return { action: 'deny' };
    }
    return { action: 'allow' };
  });

  if (isDev) {
    const devUrl = 'http://localhost:5173';
    mainWindow.loadURL(devUrl).catch(() => {
      // Retry in 1s if dev server isn't up yet
      setTimeout(() => mainWindow.loadURL(devUrl), 1000);
    });
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// IPC Handlers for Local AI & Native Integration
ipcMain.handle('ai:checkLocalServer', async (event, { url }) => {
  return new Promise((resolve) => {
    try {
      const parsed = new URL(url);
      const req = http.request(
        {
          hostname: parsed.hostname,
          port: parsed.port,
          path: parsed.pathname + (parsed.search || ''),
          method: 'GET',
          timeout: 2500,
        },
        (res) => {
          let data = '';
          res.on('data', (chunk) => (data += chunk));
          res.on('end', () => {
            try {
              resolve({ ok: res.statusCode >= 200 && res.statusCode < 300, data: JSON.parse(data), status: res.statusCode });
            } catch (e) {
              resolve({ ok: res.statusCode >= 200 && res.statusCode < 300, raw: data, status: res.statusCode });
            }
          });
        }
      );
      req.on('error', (err) => resolve({ ok: false, error: err.message }));
      req.on('timeout', () => {
        req.destroy();
        resolve({ ok: false, error: 'Request timed out' });
      });
      req.end();
    } catch (e) {
      resolve({ ok: false, error: e.message });
    }
  });
});

ipcMain.handle('app:getPlatform', () => {
  return {
    platform: process.platform,
    version: app.getVersion(),
    isElectron: true,
  };
});

// Deep link handling for OAuth
app.on('open-url', (event, url) => {
  event.preventDefault();
  if (mainWindow) {
    mainWindow.webContents.send('oauth:callback', url);
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.focus();
  }
});

const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', (event, commandLine) => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
      // Handle windows protocol URL
      const oauthUrl = commandLine.find((arg) => arg.startsWith('libresky://'));
      if (oauthUrl) {
        mainWindow.webContents.send('oauth:callback', oauthUrl);
      }
    }
  });

  app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
  });
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
