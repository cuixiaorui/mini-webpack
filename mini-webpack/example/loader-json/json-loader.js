export function jsonLoader(source) {
  var value = typeof source === "string" ? JSON.parse(source) : source;

  value = JSON.stringify(value)
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");

  return `export default ${value}`;
}
