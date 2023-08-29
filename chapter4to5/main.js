const { app, Menu, MenuItem, BrowserView, BrowserWindow, ipcMain, net } = require('electron');
const path = require('path');
const https = require('https');
const sqlite3 = require('sqlite3').verbose();

// データベースのテーブルを作成する
const dbpath = path.join(app.getPath('home'), 'mydata.db');
let db = new sqlite3.Database(dbpath);
db.serialize(() => {
  query = 'create table if not exists users'
        + ' (id integer primary key autoincrement,'
        + ' name text not null, mail text, tel text)';
  db.run(query);
  console.log('create users table.');
});
db.close();

// 全レコードの表示
ipcMain.handle('DB-find-all', async () => {
  let query = 'select * from users';
  return new Promise ((resolve, reject) => {
    let db = new sqlite3.Database(dbpath);
    db.all(query, (err, rows) => {
      if (err == null) {
        resolve(rows);
        console.log(rows);
      } else {
        reject(err);
      }
    });
    db.close();
  });
});

// レコード追加
ipcMain.handle('DB-add-user', (event, data) => {
  return new Promise ((resolve, reject) => {
    // console.log('ipcMain: '+data);
    let db = new sqlite3.Database(dbpath);
    db.serialize (() => {
      let query = 'insert into users (name, mail, tel) values '
                + '("' + data[0] + '", "' + data[1] + '", "' + data[2] + '")';
      db.exec(query, (stat, err) => {
        if (err == null) {
          resolve('SUCCESS');
        } else {
          reject(err);
        }
      });
    });
    db.close();
  });
});

// 条件を付けて検索する
ipcMain.handle('DB-find-users', (event, fstr) => {
  let query = 'select  * from users where ' + fstr;
  return new Promise ((resolve, reject) => {
    let db = new sqlite3.Database(dbpath);
    db.all (query, (err, rows) => {
      if (err == null) {
        resolve(rows);
      } else {
        reject(err);
      }
    });
    db.close();
  });
});

// win.webContents.executeJavaScript('alert("create users table.")');


// const db = new sqlite3.Database(':memory:');
// db.serialize(() => {
//     db.run("CREATE TABLE test_table (info TEXT)");
//     const stmt = db.prepare("INSERT INTO test_table VALUES (?)");
//     for (let i = 0; i < 100; i++) {
//         stmt.run("テスト:" + (i+1));
//     }
//     stmt.finalize();
//     db.each("SELECT rowid AS id, info FROM test_table", (err, row) => {
//         console.log(row.id + ": " + row.info);
//     });
// });
// db.close();

// FirebaseからJSONデータを受け取る
ipcMain.handle('http-get-json', async () => {
  return new Promise((resolve, reject) => {
    const url = 'https://data.corona.go.jp/converted-json/covid19japan-weekly-patients.json';
    https.get(url, (res) => {
      let data = '';
      res.setEncoding('utf8');
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        const json_obj = JSON.parse(data);
        console.log(json_obj);
        resolve(json_obj);
      });
    }).on('error', (error) => {
      reject(error);
    });
  });
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
          isMac ? { role: 'close' } : { role: 'quit' }
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
