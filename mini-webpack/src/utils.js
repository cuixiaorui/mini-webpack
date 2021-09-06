import path from "path";
import { fileURLToPath } from "url";

export function dirname() {
  return path.dirname(fileURLToPath(import.meta.url));
}
