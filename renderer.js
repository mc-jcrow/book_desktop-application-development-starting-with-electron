// Menu「helloCount」をクリックする度にフォーカス中ウィンドウのカウントを「+1」する。
const counter = document.getElementById('counter')

window.electron.helloIncrement((_event, value) => {
  const oldValue = Number(counter.innerText)
  const newValue = oldValue + value
  counter.innerText = newValue
})

function executeShowDialog() {
  window.electron.showDialog();
}

async function doit() {
    // preload.jsに定義したAPI（hello）でメインプロセスと通信する。
    // hello()内で使われている「ipcRenderer.invoke()」は非同期関数のため、
    // 「async」「await」を使う必要がある。
    const res = await window.electron.hello();
    document.querySelector('#msg').textContent = `create window ${res}`;
}
