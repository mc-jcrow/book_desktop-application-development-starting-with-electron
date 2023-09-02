let editor = null;

window.addEventListener('DOMContentLoaded', onLoad);

function onLoad() {
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