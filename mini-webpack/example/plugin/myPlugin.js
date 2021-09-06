export default class MyPlugin {
  apply(compiler) {
    compiler.hooks.emit.tap("myPlugin", (compilation) => {
      console.log("my plugin ");
    });
  }
}
