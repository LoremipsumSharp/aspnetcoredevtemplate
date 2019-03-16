import $ from 'jquery'

export default {
    addParams(url, data) {
        if (!$.isEmptyObject(data)) {
            url += (url.indexOf('?') >= 0 ? '&' : '?') + $.param(data)
        }
        return url
    },
    openWindow(url) {
        window.open(url, '_blank')
    },
    guid() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1)
        }
        return `${s4()}${s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`
    },
    getFileSizeText(size) {
        var fileSizeText = size
        if (fileSizeText < 1024) {
            fileSizeText += ' B'
        } else if (fileSizeText > 1024) {
            fileSizeText = Math.round(fileSizeText / 1024)
        }
        if (fileSizeText < 1024) {
            fileSizeText += ' K'
        } else if (fileSizeText > 1024) {
            fileSizeText = Math.round(fileSizeText / 1024)
        }
        if (fileSizeText < 1024) {
            fileSizeText += ' M'
        } else if (fileSizeText > 1024) {
            fileSizeText = Math.round(fileSizeText / 1024)
        }
        if (fileSizeText < 1024) {
            fileSizeText += ' G'
        } else if (fileSizeText > 1024) {
            fileSizeText = Math.round(fileSizeText / 1024) + ' T'
        }

        return fileSizeText
    },
    getFileIconClass(ext) {
        var icons = {
            image: 'fa-file-image-o',
            pdf: 'fa-file-pdf-o',
            word: 'fa-file-word-o',
            powerpoint: 'fa-file-powerpoint-o',
            excel: 'fa-file-excel-o',
            audio: 'fa-file-audio-o',
            video: 'fa-file-video-o',
            zip: 'fa-file-zip-o',
            code: 'fa-file-code-o',
            text: 'fa-file-text-o',
            file: 'fa-file-o'
        }
        const extensions = {
            gif: icons.image,
            jpeg: icons.image,
            jpg: icons.image,
            png: icons.image,

            pdf: icons.pdf,

            doc: icons.word,
            docx: icons.word,

            ppt: icons.powerpoint,
            pptx: icons.powerpoint,

            xls: icons.excel,
            xlsx: icons.excel,

            aac: icons.audio,
            mp3: icons.audio,
            ogg: icons.audio,

            avi: icons.video,
            flv: icons.video,
            mkv: icons.video,
            mp4: icons.video,

            gz: icons.zip,
            zip: icons.zip,

            css: icons.code,
            html: icons.code,
            js: icons.code,

            txt: icons.text,

            file: icons.file
        }
        return extensions[ext.toLowerCase()] || icons.file
    },
    urlCombine(url1, url2) {
        if (url1) {
            url1 = url1.replace(/\/$/, '')
        }
        if (url2) {
            url2 = url2.replace(/^\//, '')
        }
        return url1 + '/' + url2
    },
    parseISOLocal(dateStr) {
        if (!dateStr) return undefined
        var b = dateStr.split(/\D/)
        return new Date(b[0], b[1] - 1, b[2], b[3], b[4], b[5])
    },
    ellipsis(str, maxLength) {
        if (str && str.length > maxLength) {
            return str.substring(0, maxLength - 1) + '...'
        }
        return str
    },
    escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;')
    },
    isArray(obj) {
        return $.isArray(obj)
    },
    isArrayNullOrEmpty(obj) {
        return this.isArray(obj) && obj.length === 0
    },
    formatToken(token) {
        token = token || ''
        let bearerRegex = /^Bearer\s/
        return `Bearer ${token.replace(bearerRegex, '')}`
    },
    singleOrDefault: (array, pred) => {
        const xs = array.filter(pred)
        if (xs.length !== 1) {
            return undefined
        }

        return xs[0]
    },
    any: (array, pred) => {
        return pred === undefined ? array.length > 0 : array.some(pred)
    },
    replace: (array, pred, replacement) => {
        let index = array.findIndex(pred)
        if (index >= 0) {
            array[index] = replacement
        }
        return index
    },
    remove: (array, pred) => {
        let index = array.findIndex(pred)
        if (index >= 0) {
            array.splice(index, 1)
        }
    },
    isNullOrWhitespace(input) {
        if (typeof input === 'undefined' || input == null) return true

        return input.replace(/\s/g, '').length < 1
    }
}
