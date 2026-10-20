const { contextBridge, ipcRenderer } = require('electron');

const channels = new Set([
  'menu:command',
  'ollama:event',
  'app:requestClose',
]);

contextBridge.exposeInMainWorld('office', {
  getInfo: () => ipcRenderer.invoke('app:info'),
  closeResult: (allow) => ipcRenderer.invoke('app:closeResult', Boolean(allow)),
  setTitle: (title) => ipcRenderer.invoke('app:title', title || ''),
  settingsSet: (patch) => ipcRenderer.invoke('settings:set', patch || {}),
  openExternal: (url) => ipcRenderer.invoke('shell:open', url),
  ollamaStatus: () => ipcRenderer.invoke('ollama:status'),
  ollamaStart: (payload) => ipcRenderer.invoke('ollama:start', payload),
  ollamaCancel: () => ipcRenderer.invoke('ollama:cancel'),
  setChromeTheme: (theme) => ipcRenderer.invoke('window:theme', theme || 'black'),
  on: (channel, callback) => {
    if (!channels.has(channel)) throw new Error(`blocked channel ${channel}`);
    const listener = (_event, data) => callback(data);
    ipcRenderer.on(channel, listener);
    return () => ipcRenderer.removeListener(channel, listener);
  },
  smokeReady: () => ipcRenderer.send('smoke:ready'),
});
