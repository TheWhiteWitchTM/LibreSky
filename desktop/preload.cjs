const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('libreskyDesktop', true);
