// プリロード (隔離ワールド)
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld(
    'electron',
    {
        readFileSync: () => ipcRenderer.invoke('read-file-sync')
    }
);