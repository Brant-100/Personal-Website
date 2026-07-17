import puppeteer from "puppeteer-core";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const htmlPath = process.argv[2];
const outPath = process.argv[3];

if (!htmlPath || !outPath) {
  console.error("Usage: node html-to-pdf.mjs <input.html> <output.pdf>");
  process.exit(1);
}

const chromePaths = [
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
];

const executablePath = chromePaths.find((p) => fs.existsSync(p));
if (!executablePath) {
  console.error("Chrome or Edge not found");
  process.exit(1);
}

const fileUrl = `file:///${path.resolve(htmlPath).replace(/\\/g, "/")}`;

const browser = await puppeteer.launch({
  executablePath,
  headless: true,
  args: ["--no-sandbox"],
});

try {
  const page = await browser.newPage();
  await page.goto(fileUrl, { waitUntil: "networkidle0", timeout: 120000 });
  await page
    .waitForFunction(
      () => {
        const loading = document.getElementById("__bundler_loading");
        const err = document.getElementById("__bundler_err");
        if (err) return true;
        return !loading || loading.style.display === "none" || !loading.offsetParent;
      },
      { timeout: 120000 }
    )
    .catch(() => {});
  await new Promise((r) => setTimeout(r, 2500));

  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  await page.pdf({
    path: outPath,
    format: "Letter",
    printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
  });

  console.log("Wrote", outPath, fs.statSync(outPath).size, "bytes");
} finally {
  await browser.close();
}
