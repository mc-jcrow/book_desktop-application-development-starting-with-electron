async function doit() {
    // preload.jsの「ipcRenderer.invoke」は非同期でメッセージを送信するため、
    // rendererで戻り値を受け取るためには「async」「await」を使ってpreload.js内の処理を待つ必要がある。
    // これを忘れると、fulfilled（処理が成功して完了）状態のPromiseオブジェクトが返され、
    // sample.txtの内容が取得できない。
    const res = await window.electron.readFileSync();
    document.querySelector('#ta').value = res;
    alert('テキストを読み込みました。');
}