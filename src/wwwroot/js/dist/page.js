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
    global.page = mod.exports;
  }
})(this, function (_codes) {
  "use strict";

  require(['../../lib/jquery-validation/dist/jquery.validate']);

  var tapMachine = new _codes.TapeMachine('this is page1');
  tapMachine.play();
});