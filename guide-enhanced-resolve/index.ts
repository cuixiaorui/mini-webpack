const resolve = require("enhanced-resolve");

// ------------------异步调用-------------------------------
// 解析 __dirname 下面的 ./main.js
resolve(__dirname, "./main.js", (err, result, resolveRequest) => {
  // /Users/cuixiaorui/Code/tests/test-enhanced-resolve/main.js
  console.log(result, resolveRequest);
});

// 解析 vue 模块导出的文件
resolve(__dirname, "vue", (err, result) => {
  // /Users/cuixiaorui/Code/tests/test-enhanced-resolve/node_modules/vue/index.js
  console.log(result);
});

// 解析绝对目录下的 index.js文件
resolve(
  __dirname,
  "/Users/cuixiaorui/Code/tests/test-enhanced-resolve/index.js",
  (err, result) => {
    // /Users/cuixiaorui/Code/tests/test-enhanced-resolve/index.js
    console.log(result);
  }
);

// 解析相对路径下的目录
resolve(__dirname, "./", (err, result) => {
  // /Users/cuixiaorui/Code/tests/test-enhanced-resolve/index.js
  console.log(result);
});

// ------------------同步调用-------------------------------
const r = resolve.sync(__dirname, "./");
console.log("sync:", r);

// ------------------自己创建-------------------------------
const myResolve = resolve.create.sync({
  // or resolve.create.sync
  // 扩展
  extensions: [".ts", ".js"],
  // see more options below
});
console.log(myResolve)

myResolve(__dirname, "./index", (err, result) => {
  console.log("myResolve:",result);
});
