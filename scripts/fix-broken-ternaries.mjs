/**
 * Fix broken ternaries left when isDark was stripped from cn(..., isDark ? a : b).
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.join(__dirname, "..", "client", "src");

function walk(dir, acc = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p, acc);
    else if (/\.(jsx?|tsx?)$/.test(ent.name)) acc.push(p);
  }
  return acc;
}

function looksLikeClassString(s) {
  return /[\s\-\/:]/.test(s) && !/^(true|false|null|undefined|\d+)$/.test(s);
}

function fixOrphanTernaries(src) {
  // "class string" ? dark : light  -> dark
  return src.replace(
    /("(?:\\.|[^"\\])*")\s*\?\s*("(?:\\.|[^"\\])*")\s*:\s*("(?:\\.|[^"\\])*")/g,
    (m, cond, dark, light) => (looksLikeClassString(cond) ? dark : m)
  );
}

const files = walk(SRC);
let n = 0;
for (const file of files) {
  const orig = fs.readFileSync(file, "utf8");
  const fixed = fixOrphanTernaries(orig);
  if (fixed !== orig) {
    fs.writeFileSync(file, fixed);
    n++;
  }
}
console.log("Fixed orphan ternaries in", n, "files");
