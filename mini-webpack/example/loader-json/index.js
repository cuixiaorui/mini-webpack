import path, { dirname } from "path";
import { webpack } from "../../src/index.js";
import { fileURLToPath } from "url";
import { jsonLoader } from "./json-loader.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

const webpackConfig = {
  entry: path.join(__dirname, "./src/index.js"),
  output: {
    path: path.join(__dirname, "./dist"),
    filename: "bundle.js",
  },
  module: {
    rules: [
      {
        loader: jsonLoader,
        test: /\.json$/,
      },
    ],
  },
};

webpack(webpackConfig);
