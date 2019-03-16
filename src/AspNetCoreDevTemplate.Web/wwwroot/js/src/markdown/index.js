import 'codemirror/lib/codemirror.css'; // codemirror
import 'tui-editor/dist/tui-editor.css'; // editor ui
import 'tui-editor/dist/tui-editor-contents.css'; // editor content
import 'highlight.js/styles/github.css'; // code block highlight
var tuiEditor = require('tui-editor');
import Vue from 'vue'

var settings = window.settings





const vm = new Vue({
    el: "#notification-poster",
    data() {
        return {
            showReceiver:false,
        }
    },
    methods: {

    },
    mounted() {
        var editor = new tuiEditor({
            el: document.querySelector('.editor'),
            initialEditType: 'markdown',
            previewStyle: 'vertical',
            height: '100%',
        })
        setTimeout(()=>{
            this.showReceiver = true
        },5000)
    },
    created() {

    }
})