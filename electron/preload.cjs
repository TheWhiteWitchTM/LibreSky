const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  isElectron: true,
  checkLocalServer: (args) => ipcRenderer.invoke('ai:checkLocalServer', args),
  getPlatform: () => ipcRenderer.invoke('app:getPlatform'),
  onOAuthCallback: (callback) => {
    const handler = (event, url) => callback(url);
    ipcRenderer.on('oauth:callback', handler);
    return () => ipcRenderer.removeListener('oauth:callback', handler);
  },
});
