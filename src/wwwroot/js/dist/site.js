(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["./codes"], factory);
  } else if (typeof exports !== "undefined") {
    factory(require("./codes"));
  } else {
    var mod = {
      exports: {}
    };
    factory(global.codes);
    global.site = mod.exports;
  }
})(this, function (_codes) {
  "use strict";

  // Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
  // for details on configuring this project to bundle and minify static web assets.
  // Write your JavaScript code.
  var tapMachine = new _codes.TapeMachine('Hello World');
  tapMachine.play();
});