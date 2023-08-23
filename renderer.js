async function doitDBAddUser() {
    let ta = document.querySelector('#ta');
    let data = ta.value.split(',');
    const res = await window.electron.DBAddUser(data);
    console.log(res);
    alert(res);
}

async function doitDBFindAll() {
    const res = await window.electron.DBFindAll();
    console.log(res);
    const msg = document.querySelector('#msg');
    msg.innerHTML = jsonToTable(res);
}

async function doitDBFindUsers() {
    let fstr = document.querySelector('#ta').value;
    const res = await window.electron.DBFindUsers(fstr);
    console.log(res);
    const msg = document.querySelector('#msg');
    msg.innerHTML = jsonToTable(res);
}

async function doit() {
    // preload.jsに定義したAPI（hello）でメインプロセスと通信する。
    // hello()内で使われている「ipcRenderer.invoke()」は非同期関数のため、
    // 「async」「await」を使う必要がある。
    const res = await window.electron.httpGetJSON();
    console.log(res[0].area);

    // document.querySelector('#msg').textContent = `create window ${res}`;
    const msg = document.querySelector('#msg');
    const area = res[0].area
    msg.innerHTML = jsonToTable(area);
}

function jsonToTable(json) {
    let table = '<table class="table"><thead><tr><th></th>';
    for (let ky in json) {
        let ob = json[ky];
        for (let ky2 in ob) {
            table += '<th>' + ky2 + '</th>';
        }
        break;
    }
    table += '</tr></thead><tbody>';
    for (let ky in json) {
        table += '<tr><td>' + ky + '</td>';
        let ob = json[ky];
        for (let ky2 in ob) {
            table += '<td>' + ob[ky2] + '</td>';
        }
        table += '</tr>';
    }
    table += '</tbody></table>';
    return table;
}