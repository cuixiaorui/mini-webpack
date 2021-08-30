const { resolve } = require("path");
const fs = require("fs");
module.exports = class BundlesizeWebpackPlugin {
  constructor(options) {
    this.options = options || {
      sizeLimit: 3,
    };
  }
  apply(compiler) {
    compiler.hooks.done.tap("BundleSizePlugin", (stats) => {
      const { path, filename } = stats.compilation.options.output;
      const bundlePath = resolve(path, filename);
      const { size } = fs.statSync(bundlePath);
      const { bundleSize, fullSizeInfo } = formatBytes(size);
      const { sizeLimit } = this.options;
      if (bundleSize < sizeLimit) {
        console.log(
          "Safe:Bundle-Size",
          fullSizeInfo,
          "\n SIZE LIMIT:",
          sizeLimit
        );
      } else {
        if (bundleSize === sizeLimit) {
          console.warn(
            "Warn:Bundle-Size",
            fullSizeInfo,
            "\n SIZE LIMIT:",
            sizeLimit
          );
        } else {
          console.error(
            "Unsafe:Bundle-Size",
            fullSizeInfo,
            "\n SIZE LIMIT:",
            sizeLimit
          );
        }
      }
    });
  }
};

function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}
