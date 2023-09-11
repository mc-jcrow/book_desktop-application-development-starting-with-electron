const { app, Menu, BrowserWindow, dialog, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

function createWindow() {
    win = new BrowserWindow ({
        width: 1200,
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
          isMac ? { role: 'close' } : { role: 'quit' }
        ]
      },
      // { role: 'editMenu' }
      {
        label: 'Theme',
        submenu: [
            { label: 'textmate', click: () => setTheme('textmate') },
            { label: 'chrome', click: () => setTheme('chrome') },
            { label: 'github', click: () => setTheme('github') },
            { label: 'dracula', click: () => setTheme('dracula') },
            { label: 'twilight', click: () => setTheme('twilight') },
            { label: 'pastel', click: () => setTheme('pastel') }
        ]
      },
      {
        label: 'Mode',
        submenu: [
            { label: 'text', click: () => setMode('text') },
            { label: 'javascript', click: () => setMode('javascript') },
            { label: 'html', click: () => setMode('html') },
            { label: 'python', click: () => setMode('python') },
            { label: 'php', click: () => setMode('php') }
        ]
      },
      {
        label: 'Font',
        submenu: [
          { label: '9', click: () => setFontSize(9) },
          { label: '10', click: () => setFontSize(10) },
          { label: '12', click: () => setFontSize(12) },
          { label: '14', click: () => setFontSize(14) },
          { label: '16', click: () => setFontSize(16) },
          { label: '18', click: () => setFontSize(18) },
          { label: '20', click: () => setFontSize(20) },
          { label: '24', click: () => setFontSize(24) }
        ]
      },
      {
        label: 'New',
        submenu: [
          { label: 'Open folder...', click: () => openfolder() }
        ]
      },
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

// setTheme関数を追加する
function setTheme(tname) {
    let w = BrowserWindow.getFocusedWindow();
    w.webContents.executeJavaScript('setTheme("' + tname + '")');
}

// setMode関数を追加する
function setMode(mname) {
    let w = BrowserWindow.getFocusedWindow();
    w.webContents.executeJavaScript('setMode("' + mname + '")');
}

// setFontSize関数を追加する
function setFontSize(n) {
  let w = BrowserWindow.getFocusedWindow();
  w.webContents.executeJavaScript('setFontSize(' + n + ')');
}

// openfolder関数を追加する
function openfolder() {
  let w = BrowserWindow.getFocusedWindow();
  // w.webContents.executeJavaScript('openfolder()');
  let result = dialog.showOpenDialogSync(w, {
      properties: ['openDirectory']
  });
  if (result != undefined) {
    let folder_path = result[0];
    folder_path = folder_path.replace(/[\\¥]/g, '/');
    w.webContents.executeJavaScript('changeFooterTextContent("' + folder_path + '")');
    loadPath(folder_path);
  }
}

function loadPath(folder_path) {
  let w = BrowserWindow.getFocusedWindow();
  // 以下で取得したfolder_pathをipcMain.on('openfile'～);でも使いたい
  fs.readdir(folder_path, (err, files) => {
    folder_items = files;
    // 左サイドバーにファイル一覧を表示
    w.webContents.executeJavaScript('changeSidebar("' + files + '")');
  });
}

ipcMain.on('openfile', (event, n) => {
  console.log(n);
  console.log("メインプロセス動作");
  // savefile();

  // 最初にfolder_itemsを取得する必要がある。
  fs.readdir(folder_path, (err, files) => {
    current_fname = folder_items[n];
  });
  let fpath = path.join(folder_path, current_fname);
  fs.readFile(fpath, (err, result) => {
    if (err == null) {
      let data = result.toString();
      console.log(data);
      w.webContents.executeJavaScript('changeEditorDocument("' + data + '")');
      change_flag = false;
      w.webContents.executeJavaScript('changeFooterTextContent("' + fpath + '")');
      setExt(current_fname);
    } else {
      dialog.showErrorBox(err.code + err.errno, err.message);
    }
  });
});

function setExt(fname) {
  let ext = path.extname(fname);
  switch (ext) {
    case '.txt':
      setMode('text');
      break;
    case '.js':
      setMode('javascript');
      break;
    case '.json':
      setMode('javascript');
      break;
    case '.html':
      setMode('html');
      break;
    case '.py':
      setMode('python');
      break;
    case '.php':
      setMode('php');
      break;
  }
}

app.whenReady().then(createWindow);