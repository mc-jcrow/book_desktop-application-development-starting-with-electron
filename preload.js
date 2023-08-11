// プリロード (隔離ワールド)
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld(
    'electron',
    {
        hello: (arg) => ipcRenderer.invoke('hello', arg),
        helloIncrement: (callback) => ipcRenderer.on('hello-increment', callback)
    }
);