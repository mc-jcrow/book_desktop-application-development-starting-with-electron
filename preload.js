// プリロード (隔離ワールド)
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld(
    'electron',
    {
        httpGetJSON: () => ipcRenderer.invoke('http-get-json'),
        DBAddUser: (data) => ipcRenderer.invoke('DB-add-user', data),
        DBFindAll: () => ipcRenderer.invoke('DB-find-all'),
        DBFindUsers: (fstr) => ipcRenderer.invoke('DB-find-users', fstr)
    }
);