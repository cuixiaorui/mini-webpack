const resolve = require("enhanced-resolve");

resolve("", "./src", (err, result) => {
  console.log(result);
});
