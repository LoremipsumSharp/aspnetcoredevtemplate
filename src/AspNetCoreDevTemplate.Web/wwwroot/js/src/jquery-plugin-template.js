

(function ($) {

    'use strict';


    // -- Name is used to keep jQUery plugin template portable
    const pluginName = 'pluginName';

    // -- Globals (shared across all plugin instances)
    const defaultOptions = {};

    const $window = $(window);
    const $document = $(document);

    // -- Plugin constructor
    // Using p object as placeholder, together with pluginName to make jQuery plugin template portable
    const p = {}; p[pluginName] = class {
        constructor(el, opts) {
            this.el = el;
            this.opts = $.extend({}, defaultOptions, opts);

            this._defaultOptions = defaultOptions;

            this.init();
        }

        init() {
            console.info('initialised');
        }
    }

    // -- Prevent multiple instantiations
    $.fn[pluginName] = function (options) {

        return this.each(function () {
            //this -> element(dom)
            if (!$.data(this, 'plugin_' + pluginName)) {
                $.data(this, 'plugin_' + pluginName, new p[pluginName](this, options));
            }
        });
    };
})(window.jQuery)

