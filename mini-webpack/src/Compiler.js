import fs from "fs";
import { parse } from "./parser.js";
import path from "path";

let ID = 0;

export class Compiler {
  constructor(config) {
    const { entry, output } = config;

    this._entry = entry;
    this._output = output;
    this._graph = [];
  }

  run() {
    // 1. buildModule
    console.log("run");
    this.buildModule();
    this.emitFiles();
  }

  emitFiles() {
    // 可以把收集到的所有的 code 打包出去了
    // 先加工一下 module 的 code
    // 给包裹一个 function
    // modules 需要是一个对象

    // 获取模块代码的需要几个步骤
    // 1. 每一个模块都有自己的唯一 id
    // 2. 用户获取 require(./foo) 的时候，需要把 ./foo 映射为 id
    // 3. 然后基于 id 去获取模块的代码

    // 为什么不可以直接使用 filename 来作为key
    // filename 如果是绝对路径的话，那么用户使用的时候可是相对路径的
    // 而如果使用绝对路径的话， 那么就有可能有命名冲突的问题
    // 所以使用 id 来存所有的模块，然后一个模块内有自己的 mapping ，这样的话 就保证了命名不会冲突
    const modules = this._graph.reduce((r, m) => {
      const fn = `
        function (require, module, exports){
          ${m.code}
        }
      `;

      // 需要拿到 mapping ，后面需要使用 绝对路径来获取模块的 id
      // r[m.id] = [fn, JSON.stringify(m.mapping)];
      // console.log(m.filename,m.mapping)

      r += `${m.id}:[${fn},${JSON.stringify(m.mapping)}],`;
      return r;
    }, "");

    // 生成 build
    const result = `
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
     })({${modules}});
    `;

    // 最后基于 output 生成 bundle 文件即可
    const outputPath = path.join(this._output.path, this._output.filename);
    fs.writeFileSync(outputPath, result);
  }

  buildModule() {
    function _buildModule(filename) {
      // 构建模块
      // 1. 获取模块的代码
      const sourceCode = fs.readFileSync(filename, { encoding: "utf-8" });
      // 2. 获取模块的依赖关系和把 import 替换成 require
      const { code, dependencies } = parse(sourceCode);

      return {
        code,
        dependencies,
        filename,
        mapping: {},
        id: ID++,
      };
    }

    // 通过队列的方式来把所有的文件都处理掉
    const moduleQueue = [];
    const entryModule = _buildModule(this._entry);
    moduleQueue.push(entryModule);
    this._graph.push(entryModule);

    while (moduleQueue.length > 0) {
      const currentModule = moduleQueue.shift();
      currentModule.dependencies.forEach((dependence) => {
        // 提前处理下 dependence 的路径
        // 需要完整的文件路径
        const childPath = path.resolve(
          path.dirname(currentModule.filename),
          dependence
        );
        const childModule = _buildModule(childPath);
        // mapping 的  key  需要是相当路径
        currentModule.mapping[dependence] = childModule.id;
        moduleQueue.push(childModule);
        this._graph.push(childModule);
      });
    }
  }
}
