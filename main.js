const { app, Menu, MenuItem, BrowserView, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');

const win_name = [
  'banana', 'orange', 'apple'
];

ipcMain.handle('show-dialog', (event, arg) => {
  let btns = ['OK', 'Cancel', 'わかりました', 'わかりません…。'];
  let w = BrowserWindow.getFocusedWindow();
  let re = dialog.showMessageBoxSync(w, {
    title: 'Message',
    message: 'これがメッセージボックスの表示です。',
    detail: 'OKすると閉じます。',
    buttons: btns
  });
  console.log(btns[re]);
  const result = btns[re];
  return result;
});

function createWindow() {
    win = new BrowserWindow ({
        width: 1000,
        height: 800,
        webPreferences: {
          preload: path.join(__dirname, 'preload.js')
        }
    });
    win.loadFile('index.html');
    win.webContents.openDevTools();
    return win.id;
}

function createMenu() {
    const isMac = process.platform === 'darwin'

    const template = [
      // { role: 'appMenu' }
      ...(isMac
        ? [{
            label: app.name,
            submenu: [
              { role: 'about' },
              { type: 'separator' },
              { role: 'services' },
              { type: 'separator' },
              { role: 'hide' },
              { role: 'hideOthers' },
              { role: 'unhide' },
              { type: 'separator' },
              { role: 'quit' }
            ]
          }]
        : []),
      // { role: 'fileMenu' }
      {
        label: 'File',
        submenu: [
          isMac ? { role: 'close' } : { role: 'quit' },
          {
            label: 'HelloCount',
            click: () => {
              const w = BrowserWindow.getFocusedWindow();
              w.webContents.send('hello-increment', 1);
            }
          }
        ]
      },
      // { role: 'editMenu' }
      {
        label: 'Edit',
        submenu: [
          { role: 'undo' },
          { role: 'redo' },
          { type: 'separator' },
          { role: 'cut' },
          { role: 'copy' },
          { role: 'paste' },
          ...(isMac
            ? [
                { role: 'pasteAndMatchStyle' },
                { role: 'delete' },
                { role: 'selectAll' },
                { type: 'separator' },
                {
                  label: 'Speech',
                  submenu: [
                    { role: 'startSpeaking' },
                    { role: 'stopSpeaking' }
                  ]
                }
              ]
            : [
                { role: 'delete' },
                { type: 'separator' },
                { role: 'selectAll' }
              ])
        ]
      },
      // { role: 'viewMenu' }
      {
        label: 'View',
        submenu: [
          { role: 'reload' },
          { role: 'forceReload' },
          { role: 'toggleDevTools' },
          { type: 'separator' },
          { role: 'resetZoom' },
          { role: 'zoomIn' },
          { role: 'zoomOut' },
          { type: 'separator' },
          { role: 'togglefullscreen' }
        ]
      },
      // { role: 'windowMenu' }
      {
        label: 'Window',
        submenu: [
          { role: 'minimize' },
          { role: 'zoom' },
          ...(isMac
            ? [
                { type: 'separator' },
                { role: 'front' },
                { type: 'separator' },
                { role: 'window' }
              ]
            : [
                { role: 'close' }
              ])
        ]
      },
      {
        role: 'help',
        submenu: [
          {
            label: 'Learn More',
            click: async () => {
              const { shell } = require('electron')
              await shell.openExternal('https://electronjs.org')
            }
          }
        ]
      }
    ]
    
    const menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu)
}
createMenu();

app.whenReady().then(createWindow);
