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