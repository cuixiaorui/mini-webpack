
     (function (modules) {
          function require(id) {

            const [fn,mapping] = modules[id];

            function localRequire(name){
              // name -> id
              return require(mapping[name])
            }

            const module = { exports: {} };
            fn(localRequire, module, module.exports);
            return module.exports;
          }


        require(0);
     })({
	
		0 : [ 
		   function (require, module, exports){
			"use strict";

var _foo = require("./foo.js");

(0, _foo.foo)();
console.log("js");
		   },
	           {"./foo.js":1}
		   ],
	
		1 : [ 
		   function (require, module, exports){
			"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.foo = foo;

function foo() {
  console.log("foo");
}
		   },
	           {}
		   ],
	
	}
     );