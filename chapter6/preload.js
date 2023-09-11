const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld(
    'electron',
    {
        openfile: (n) => ipcRenderer.send('openfile', n)
    }
);