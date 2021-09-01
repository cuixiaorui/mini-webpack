// 步骤
// 读取入口文件
// 分析入口文件，递归的去读取模块所依赖的文件内容，生成AST语法树。
// 根据AST语法树，生成浏览器能够运行的代码

import { Compiler } from "./Compiler.js";
export function webpack(config) {
  const compiler = new Compiler(config);
  compiler.run();
}
