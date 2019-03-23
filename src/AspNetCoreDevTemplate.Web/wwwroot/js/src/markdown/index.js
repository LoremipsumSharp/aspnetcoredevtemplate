import 'codemirror/lib/codemirror.css'; // codemirror
import 'tui-editor/dist/tui-editor.css'; // editor ui
import 'tui-editor/dist/tui-editor-contents.css'; // editor content
import 'highlight.js/styles/github.css'; // code block highlight
import $ from 'jquery'
import { layer } from "../header";
const tuiEditor = require('tui-editor');
const axios = require('axios').default;
import Vue from 'vue'

var settings = window.settings

const vm = new Vue({
    el: "#notification-poster",
    data() {
        return {
            showReceiver: false,
            markdownContent: "",
            uploadedList: []
        }
    },
    methods: {
        handleUpload() {
            var fileInput = document.createElement('input');
            fileInput.setAttribute('type', 'file');
            var $fileInput = $(fileInput);

            $fileInput.change(function (event) {
                var files = this.files;

            })

            $fileInput.click()
        },
        handleSave() {
            var comfirmTpl = `
            <div class="d-flex flex-column text-center"> 
                <span>确认保存并发送?</span>
                <span><input type="checkbox" />推送到企业微信 </span>
            </div>
            `
            layer.confirm(comfirmTpl, {  title: '提示' }, function (index) {
                layer.close(index);
            });
        }
    },
    mounted() {
        var self = this;
        Promise.resolve(new tuiEditor({
            el: document.querySelector('.editor'),
            initialEditType: 'markdown',
            previewStyle: 'vertical',
            height: '100%',
        })).then(function (editor) {
            axios.get('/markown/background.md').then(response => {
                var toolBar = editor.getUI().getToolbar();
                // 上传按钮
                var toolBar = editor.getUI().getToolbar()

                //保存按钮
                toolBar.addButton({
                    name: 'save-btn',
                    className: '',
                    event: 'save-notification',
                    tooltip: '保存并发送',
                    $el: $(`<button class="mr-2" style="color:black"><i class="fa fa-paper-plane-o"></i></button>`)
                }, 15);
                editor.eventManager.addEventType("save-notification");
                editor.eventManager.listen('save-notification', self.handleSave)

                toolBar.addButton({
                    name: 'upload-btn',
                    className: '',
                    event: 'upload-attachment',
                    tooltip: '上传附件',
                    $el: $(`<button style="color:black"><i class="fa fa-paperclip"></i></button>`)
                }, 14);
                editor.eventManager.addEventType("upload-attachment");
                editor.eventManager.listen('upload-attachment', self.handleUpload)





            }).catch(error => {
                console.error(error)
            })
        })

    },
    created() {

    }
})