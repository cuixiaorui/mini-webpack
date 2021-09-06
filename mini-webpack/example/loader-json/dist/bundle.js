(function (modules) {
  function require(id) {
    const [fn, mapping] = modules[id];

    function localRequire(name) {
      // name -> id
      return require(mapping[name]);
    }

    const module = { exports: {} };
    fn(localRequire, module, module.exports);
    return module.exports;
  }

  require(0);
})({
  0: [
    function (require, module, exports) {
      "use strict";

      var _foo = require("./foo.js");

      var _config = require("./config.json");

      var _config2 = _interopRequireDefault(_config);

      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }

      (0, _foo.foo)();
      console.log("js");
      console.log(_config2.default);
    },
    { "./foo.js": 1, "./config.json": 2 },
  ],

  1: [
    function (require, module, exports) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true,
      });
      exports.foo = foo;

      function foo() {
        console.log("foo");
      }
    },
    {},
  ],

  2: [
    function (require, module, exports) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true,
      });
      exports.default = {
        name: "xiaohong",
        age: 19,
      };
    },
    {},
  ],
});
