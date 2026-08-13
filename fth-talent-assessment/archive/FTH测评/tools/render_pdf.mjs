import fs from "node:fs/promises";
import path from "node:path";
import { createCanvas } from "@napi-rs/canvas";
import * as pdfjs from "pdfjs-dist/legacy/build/pdf.mjs";

const [pdfPath, outputDir] = process.argv.slice(2);
if (!pdfPath || !outputDir) {
  throw new Error("usage: node render_pdf.mjs <pdf> <output-dir>");
}

await fs.mkdir(outputDir, { recursive: true });
const data = new Uint8Array(await fs.readFile(pdfPath));
const document = await pdfjs.getDocument({ data, disableWorker: true }).promise;

for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber += 1) {
  const page = await document.getPage(pageNumber);
  const viewport = page.getViewport({ scale: 1.7 });
  const canvas = createCanvas(Math.ceil(viewport.width), Math.ceil(viewport.height));
  const context = canvas.getContext("2d");
  await page.render({ canvasContext: context, viewport }).promise;
  const output = path.join(outputDir, `page-${String(pageNumber).padStart(2, "0")}.png`);
  await fs.writeFile(output, canvas.toBuffer("image/png"));
}
