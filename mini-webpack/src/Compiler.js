import fs from "fs";
import path from "path";
import Compilation from "./Compilation.js";
import { createBundleCode } from "./createBundleCode.js";

export class Compiler {
  constructor(config) {
    const { entry, output } = config;

    this._entry = entry;
    this._output = output;
    this._config = config;
    this._compilation = null;
    this._graph = [];
  }

  run() {
    // 1. buildModule
    console.log("run");

    this._compilation = new Compilation({
      loaders: this._config.module.rules,
      entry: this._entry,
    });
    this._compilation.make();

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
    // const modules = this._compilation.graph.reduce((r, m) => {
    //   const fn = `
    //     function (require, module, exports){
    //       ${m.code}
    //     }
    //   `;

    //   // 需要拿到 mapping ，后面需要使用 绝对路径来获取模块的 id
    //   // r[m.id] = [fn, JSON.stringify(m.mapping)];
    //   // console.log(m.filename,m.mapping)

    //   r += `${m.id}:[${fn},${JSON.stringify(m.mapping)}],`;
    //   return r;
    // }, "");

    const modules = this._compilation.graph.reduce((r, m) => {
      // 需要拿到 mapping ，后面需要使用 绝对路径来获取模块的 id
      // r[m.id] = [fn, JSON.stringify(m.mapping)];
      // console.log(m.filename,m.mapping)
      // r[m.id] = [fn, JSON.stringify(m.mapping)];
      r[m.id] = {
        code: m.code,
        mapping: m.mapping,
      };
      return r;
    }, {});

    // 最后基于 output 生成 bundle 文件即可
    const outputPath = path.join(this._output.path, this._output.filename);

    fs.writeFileSync(outputPath, createBundleCode({ modules }));
  }
}
