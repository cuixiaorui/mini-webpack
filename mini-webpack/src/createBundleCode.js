// 通过 ast 解析完成后的都是 里面的代码
// 我们需要使用 function 来包裹一下
// 然后我们需要注入全局的方法  require module export
// 所以我们需要构建 require 函数
// 在我们执行这个文件的时候需要一上来就执行入口文件的代码
// 所以启动的时候需要调用 require(0) 0指的是入口文件

import fs from "fs";
import ejs from "ejs";
import path from "path";
import { dirname } from "./utils.js";

export function createBundleCode(data) {
  const bundleTemplate = fs.readFileSync(
    path.join(dirname(), "./bundle.ejs"),
    "utf-8"
  );

  const { modules } = data;

  let code = ejs.render(bundleTemplate, { modules });

  return code;
}
