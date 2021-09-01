import { parse } from "../src/parser.js";
describe("parser", () => {
  it("parse", () => {
    parse(`
    import { foo } from "./foo";
    foo();
    console.log("js");
    `);
  });
});
