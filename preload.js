// プリロード (隔離ワールド)
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld(
    'electron',
    {
        httpGetJSON: () => ipcRenderer.invoke('http-get-json')
    }
);