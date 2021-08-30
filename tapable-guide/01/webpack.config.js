const { resolve } = require("path");
const bundlesizeplugin = require("./bundlesize-webpack-plugin");

module.exports = {
  mode: "development",
  entry: resolve(__dirname, "src/index.js"),
  output: {
    path: resolve(__dirname, "bin"),
    filename: "bundle.js",
  },
  plugins: [new bundlesizeplugin({
	sizeLimit: 4
  })],
};
