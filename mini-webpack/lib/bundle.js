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
      (0, _foo.foo)();
      console.log("js");
    },
    { "./foo.js": 1 },
    //     '\n        function (require, module, exports){\n          "use strict";\n\nvar _foo = require("./foo.js");\n\n(0, _foo.foo)();\nconsole.log("js");\n        }\n      ',
    //     '{"./foo.js":1}',
  ],
  1: [
    //     '\n        function (require, module, exports){\n          "use strict";\n\nObject.defineProperty(exports, "__esModule", {\n  value: true\n});\nexports.foo = foo;\n\nfunction foo() {\n  console.log("foo");\n}\n        }\n      ',
    //     "{}",
    function (require, module, exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.foo = foo;
      function foo() {
        console.log("foo");
      }
    },
    {},
  ],
});
