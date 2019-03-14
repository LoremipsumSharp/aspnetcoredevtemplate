import 'codemirror/lib/codemirror.css'; // codemirror
import 'tui-editor/dist/tui-editor.css'; // editor ui
import 'tui-editor/dist/tui-editor-contents.css'; // editor content
import 'highlight.js/styles/github.css'; // code block highlight
var Editor = require('tui-editor');

var editor = new Editor({
    el: document.querySelector('.editor'),
    initialEditType: 'markdown',
    previewStyle: 'vertical',
    height: '100%',
});

