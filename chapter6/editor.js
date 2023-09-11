let editor = null;
let folder_path = null;
let folder_items = null;
let current_fname = null;
let sidebar = null;
let footer = null;

window.addEventListener('DOMContentLoaded', onLoad);

function onLoad() {
    footer = document.querySelector('#footer');
    sidebar = document.querySelector('#sidebar');
    editor = ace.edit('editor_area');
    editor.setTheme('ace/theme/textmate');
    editor.session.setMode('ace/mode/text')
    editor.focus();
}

// setTheme関数を追加する
function setTheme(tname) {
    editor.setTheme('ace/theme/' + tname);
}

// setMode関数を追加する
function setMode(mname) {
    editor.session.setMode('ace/mode/' + mname);
}

// setFontSize関数を追加する
function setFontSize(n) {
    editor.setFontSize(n);
}

function changeFooterTextContent(folder_path) {
    footer.textContent = 'open dir:"' + folder_path + '".';
}

function changeSidebar(files) {
    const folder_item = files.split(",");
    let tag = '<ul>';
    for (const n in folder_item) {
      tag += '<li id="item ' + n + '" onclick="openfile(' + n + ')">' + folder_item[n] + '</li>';
    }
    tag += '</ul>';
    sidebar.innerHTML = tag;
}

function changeEditorDocument(data) {
    editor.session.getDocument().setValue(data);
}

function openfile(n) {
    console.log(n);
    window.electron.openfile(n);
}