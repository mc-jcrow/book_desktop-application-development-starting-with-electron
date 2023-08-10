async function doit() {
    // preload.jsに定義したAPI（hello）でメインプロセスと通信する。
    // hello()内で使われている「ipcRenderer.invoke()」は非同期関数のため、
    // 「async」「await」を使う必要がある。
    const res = await window.electron.hello();
    
    document.querySelector('#msg').textContent = `create window ${res}`;
}