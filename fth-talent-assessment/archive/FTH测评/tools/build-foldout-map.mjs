import fs from "node:fs";
import path from "node:path";
import sharp from "/Users/chenpan/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp/lib/index.js";

const root = "/Users/chenpan/Documents/于无声处起惊雷";
const sourcePath = path.join(root, "work/foldout-map/tmp/source-text.json");
const assetDir = path.join(root, "work/foldout-map/assets");
const outDir = path.join(root, "output/foldout");
const svgPath = path.join(outDir, "于无声处起惊雷-大开页折叠地图.svg");
const pngPath = path.join(outDir, "于无声处起惊雷-大开页折叠地图.png");

fs.mkdirSync(outDir, { recursive: true });

const slides = JSON.parse(fs.readFileSync(sourcePath, "utf8"));

const W = 12000;
const H = 7500;
const margin = 280;
const top = 760;
const cols = 6;
const rows = 8;
const gapX = 90;
const gapY = 68;
const cardW = (W - margin * 2 - gapX * (cols - 1)) / cols;
const cardH = 710;

const colors = {
  paper: "#fff8df",
  ink: "#181818",
  muted: "#5f5b52",
  yellow: "#ffe033",
  blue: "#63b8ff",
  deepBlue: "#245ea8",
  green: "#8ed45f",
  teal: "#55c6bd",
  orange: "#f0a23a",
  pink: "#f17c9d",
  purple: "#8b74d6",
  white: "#ffffff",
};

function esc(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function imageData(file) {
  const p = path.join(assetDir, file);
  const ext = path.extname(file).toLowerCase();
  const mime = ext === ".png" ? "image/png" : "image/jpeg";
  return `data:${mime};base64,${fs.readFileSync(p).toString("base64")}`;
}

function t({ x, y, text, size, weight = 600, fill = colors.ink, anchor = "start", family = "PingFang SC, Hiragino Sans GB, Microsoft YaHei, Arial, sans-serif", opacity = 1, rotate = 0 }) {
  const transform = rotate ? ` transform="rotate(${rotate} ${x} ${y})"` : "";
  return `<text x="${x}" y="${y}" font-family="${family}" font-size="${size}" font-weight="${weight}" fill="${fill}" text-anchor="${anchor}" opacity="${opacity}" letter-spacing="0"${transform}>${esc(text)}</text>`;
}

function wrapLine(line, maxChars) {
  const chunks = [];
  let current = "";
  for (const char of String(line)) {
    current += char;
    const wide = [...current].reduce((n, c) => n + (/[\x00-\x7F]/.test(c) ? 0.55 : 1), 0);
    if (wide >= maxChars) {
      chunks.push(current);
      current = "";
    }
  }
  if (current) chunks.push(current);
  return chunks;
}

function wrappedRows(lines, maxChars) {
  const rows = [];
  for (const source of lines) rows.push(...wrapLine(source, maxChars));
  return rows;
}

function multiline({ x, y, lines, size, lineHeight, maxChars, fill = colors.ink, weight = 500 }) {
  const out = [];
  let row = 0;
  for (const source of lines) {
    const wrapped = wrapLine(source, maxChars);
    for (const part of wrapped) {
      out.push(t({ x, y: y + row * lineHeight, text: part, size, weight, fill }));
      row += 1;
    }
  }
  return out.join("");
}

function bodyBlock({ x, y, width, height, lines }) {
  const candidates = [
    { size: 29, lineHeight: 42, cols: 1, maxChars: 44 },
    { size: 26, lineHeight: 37, cols: 1, maxChars: 50 },
    { size: 24, lineHeight: 34, cols: 1, maxChars: 55 },
    { size: 22, lineHeight: 31, cols: 1, maxChars: 60 },
    { size: 21, lineHeight: 30, cols: 2, maxChars: 29 },
    { size: 19, lineHeight: 27, cols: 2, maxChars: 32 },
    { size: 18, lineHeight: 25, cols: 2, maxChars: 34 },
  ];

  for (const candidate of candidates) {
    const rows = wrappedRows(lines, candidate.maxChars);
    const rowCapacity = Math.floor(height / candidate.lineHeight);
    if (rows.length <= rowCapacity * candidate.cols) {
      const out = [];
      const colW = width / candidate.cols;
      rows.forEach((line, idx) => {
        const col = Math.floor(idx / rowCapacity);
        const row = idx % rowCapacity;
        out.push(t({
          x: x + col * colW,
          y: y + row * candidate.lineHeight,
          text: line,
          size: candidate.size,
          weight: 560,
        }));
      });
      return out.join("");
    }
  }

  const fallback = candidates[candidates.length - 1];
  const rows = wrappedRows(lines, fallback.maxChars);
  const rowCapacity = Math.ceil(rows.length / fallback.cols);
  const lineHeight = Math.min(fallback.lineHeight, height / rowCapacity);
  const out = [];
  const colW = width / fallback.cols;
  rows.forEach((line, idx) => {
    const col = Math.floor(idx / rowCapacity);
    const row = idx % rowCapacity;
    out.push(t({
      x: x + col * colW,
      y: y + row * lineHeight,
      text: line,
      size: Math.max(15, lineHeight * 0.72),
      weight: 560,
    }));
  });
  return out.join("");
}

function slideGroup(slide) {
  if (slide <= 3) return "intro";
  if (slide <= 22) return "who";
  if (slide <= 26) return "org";
  if (slide <= 42) return "talent";
  return "growth";
}

function groupColor(group) {
  return {
    intro: colors.yellow,
    who: colors.blue,
    org: colors.teal,
    talent: colors.orange,
    growth: colors.green,
  }[group];
}

function cardPosition(index) {
  const r = Math.floor(index / cols);
  let c = index % cols;
  if (r % 2 === 1) c = cols - 1 - c;
  return {
    x: margin + c * (cardW + gapX),
    y: top + r * (cardH + gapY),
    centerX: margin + c * (cardW + gapX) + cardW / 2,
    centerY: top + r * (cardH + gapY) + cardH / 2,
  };
}

function pathD(points) {
  let d = `M ${points[0].centerX} ${points[0].centerY}`;
  for (let i = 1; i < points.length; i += 1) {
    const a = points[i - 1];
    const b = points[i];
    const dx = Math.abs(b.centerX - a.centerX);
    if (dx < 20) {
      d += ` C ${a.centerX} ${a.centerY + 250}, ${b.centerX} ${b.centerY - 250}, ${b.centerX} ${b.centerY}`;
    } else {
      const midX = (a.centerX + b.centerX) / 2;
      d += ` C ${midX} ${a.centerY}, ${midX} ${b.centerY}, ${b.centerX} ${b.centerY}`;
    }
  }
  return d;
}

function sectionBands() {
  const bands = [
    [margin - 70, 690, cardW * 3 + gapX * 2 + 140, cardH + 110, "#fff1a8", "START / FRAMEWORK"],
    [margin - 70, 690 + (cardH + gapY), cardW * 6 + gapX * 5 + 140, cardH * 3 + gapY * 2 + 110, "#d9efff", "1 / WHO WE ARE"],
    [margin - 70, 690 + (cardH + gapY) * 4, cardW * 4 + gapX * 3 + 140, cardH + 110, "#d7f5ee", "2 / ORGANIZATION"],
    [margin - 70, 690 + (cardH + gapY) * 4, cardW * 6 + gapX * 5 + 140, cardH * 3 + gapY * 2 + 110, "#ffe2b7", "3 / TALENT"],
    [margin - 70 + (cardW + gapX) * 2, 690 + (cardH + gapY) * 7, cardW * 4 + gapX * 3 + 140, cardH + 110, "#ddf4c5", "4 / GROWTH"],
  ];
  return bands.map(([x, y, w, h, fill, label]) => `
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="50" fill="${fill}" opacity=".66"/>
    ${t({ x: x + 46, y: y + 74, text: label, size: 44, weight: 900, fill: colors.ink, opacity: 0.58 })}
  `).join("");
}

function decorativeScene() {
  const logo = imageData("image1.png");
  const campus = imageData("image8.jpeg");
  const classImg = imageData("image5.png");
  const grass = imageData("image13.jpeg");
  return `
    <rect width="${W}" height="${H}" fill="${colors.paper}"/>
    <path d="M0 0H12000V500C10300 390 9300 610 7600 480C6200 370 5300 150 3900 300C2450 455 1650 640 0 430Z" fill="#90ccff"/>
    <circle cx="11160" cy="270" r="92" fill="${colors.yellow}" stroke="${colors.ink}" stroke-width="16"/>
    <path d="M500 505C920 290 1230 275 1540 510C1900 250 2320 230 2730 515C3160 220 3720 205 4180 515" fill="${colors.green}" opacity=".9"/>
    <path d="M3300 470L3860 90L4470 470Z" fill="#6da68f"/>
    <path d="M3900 470L4380 150L4930 470Z" fill="#9fc8b7"/>
    <path d="M3860 90L4030 240L3720 240Z" fill="#ffffff"/>
    <path d="M4380 150L4510 260L4270 260Z" fill="#ffffff"/>
    <image href="${grass}" x="11220" y="820" width="500" height="1080" opacity=".72" preserveAspectRatio="xMidYMid slice"/>
    <image href="${campus}" x="7350" y="150" width="1280" height="720" opacity=".9" preserveAspectRatio="xMidYMid slice" clip-path="url(#photoClip1)"/>
    <image href="${classImg}" x="980" y="5750" width="1180" height="890" opacity=".95" preserveAspectRatio="xMidYMid slice" clip-path="url(#photoClip2)"/>
    <image href="${logo}" x="${margin}" y="110" width="900" height="292" preserveAspectRatio="xMinYMin meet"/>
      ${t({ x: margin, y: 500, text: "于无声处，起惊雷", size: 104, weight: 950, family: "Songti SC, STSong, SimSun, serif" })}
      ${t({ x: margin, y: 585, text: "Make silence voice 让沉默发声", size: 44, weight: 800, fill: colors.muted })}
    ${t({ x: W - margin, y: 178, text: "小凡教育科技 · 探索教育更多可能性", size: 44, weight: 800, fill: colors.ink, anchor: "end" })}
    ${t({ x: W - margin, y: 245, text: "大开页折叠地图 / 内容源自 V36 终版", size: 34, weight: 700, fill: colors.muted, anchor: "end" })}
    <path d="M10170 350c120-90 270-78 340 10c105-40 235 20 245 140c150 20 214 150 130 260H9960c-150-130-55-350 210-410Z" fill="#ffffff" opacity=".95" stroke="${colors.ink}" stroke-width="10"/>
    ${t({ x: 10425, y: 610, text: "FINISH", size: 90, weight: 1000, anchor: "middle" })}
  `;
}

function iconFor(slide, x, y, color) {
  const n = slide % 6;
  if (n === 0) return `<circle cx="${x}" cy="${y}" r="34" fill="${color}" stroke="${colors.ink}" stroke-width="8"/><path d="M${x - 16} ${y + 5}l12 14l25-35" fill="none" stroke="${colors.ink}" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>`;
  if (n === 1) return `<rect x="${x - 38}" y="${y - 32}" width="76" height="64" rx="12" fill="${color}" stroke="${colors.ink}" stroke-width="8"/><path d="M${x - 18} ${y - 8}h36M${x - 18} ${y + 12}h36" stroke="${colors.ink}" stroke-width="8" stroke-linecap="round"/>`;
  if (n === 2) return `<path d="M${x} ${y - 42}l44 78h-88Z" fill="${color}" stroke="${colors.ink}" stroke-width="8"/><circle cx="${x}" cy="${y + 4}" r="12" fill="${colors.ink}"/>`;
  if (n === 3) return `<circle cx="${x - 20}" cy="${y - 8}" r="28" fill="${color}" stroke="${colors.ink}" stroke-width="8"/><circle cx="${x + 24}" cy="${y + 10}" r="28" fill="#ffffff" stroke="${colors.ink}" stroke-width="8"/>`;
  if (n === 4) return `<path d="M${x - 42} ${y + 30}C${x - 10} ${y - 55},${x + 45} ${y - 45},${x + 42} ${y + 30}Z" fill="${color}" stroke="${colors.ink}" stroke-width="8"/><path d="M${x - 8} ${y + 30}V${y - 16}M${x - 8} ${y - 6}l26-18" stroke="${colors.ink}" stroke-width="8" stroke-linecap="round"/>`;
  return `<path d="M${x - 42} ${y - 25}h84v58h-84z" fill="${color}" stroke="${colors.ink}" stroke-width="8"/><path d="M${x - 20} ${y - 25}v-18h40v18" fill="none" stroke="${colors.ink}" stroke-width="8"/>`;
}

function slideCard(slideObj, index) {
  const { x, y } = cardPosition(index);
  const group = slideGroup(slideObj.slide);
  const color = groupColor(group);
  const lines = slideObj.texts;
  const title = lines[0] || `Slide ${slideObj.slide}`;
  const rest = lines.slice(1);
  return `
    <g>
      <rect x="${x + 20}" y="${y + 22}" width="${cardW}" height="${cardH}" rx="34" fill="${colors.ink}" opacity=".18"/>
      <rect x="${x}" y="${y}" width="${cardW}" height="${cardH}" rx="34" fill="${colors.white}" stroke="${colors.ink}" stroke-width="9"/>
      <rect x="${x}" y="${y}" width="${cardW}" height="108" rx="34" fill="${color}" stroke="${colors.ink}" stroke-width="9"/>
      <path d="M${x} ${y + 74}H${x + cardW}" stroke="${colors.ink}" stroke-width="9"/>
      <circle cx="${x + 78}" cy="${y + 54}" r="42" fill="${colors.white}" stroke="${colors.ink}" stroke-width="8"/>
      ${t({ x: x + 78, y: y + 70, text: String(slideObj.slide).padStart(2, "0"), size: 37, weight: 950, anchor: "middle" })}
      ${t({ x: x + 142, y: y + 68, text: title, size: 42, weight: 950 })}
      ${iconFor(slideObj.slide, x + cardW - 80, y + 57, color)}
      ${bodyBlock({ x: x + 64, y: y + 165, width: cardW - 128, height: cardH - 205, lines: rest })}
    </g>
  `;
}

const points = slides.map((_, i) => cardPosition(i));
const foldLines = [W / 4, W / 2, W * 3 / 4].map((x) => `
  <path d="M${x} 0V${H}" stroke="${colors.ink}" stroke-width="6" stroke-dasharray="32 30" opacity=".22"/>
  ${t({ x: x + 38, y: H - 210, text: "FOLD", size: 42, weight: 900, fill: colors.ink, opacity: 0.35, rotate: -90 })}
`).join("");

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <clipPath id="photoClip1"><rect x="7350" y="150" width="1280" height="720" rx="42"/></clipPath>
    <clipPath id="photoClip2"><rect x="980" y="5750" width="1180" height="890" rx="42"/></clipPath>
    <pattern id="dotGrid" width="140" height="140" patternUnits="userSpaceOnUse">
      <circle cx="16" cy="16" r="6" fill="#181818" opacity=".08"/>
    </pattern>
  </defs>
  ${decorativeScene()}
  <rect width="${W}" height="${H}" fill="url(#dotGrid)"/>
  ${foldLines}
  ${sectionBands()}
  <path d="${pathD(points)}" fill="none" stroke="${colors.ink}" stroke-width="130" stroke-linecap="round" stroke-linejoin="round" opacity=".22"/>
  <path d="${pathD(points)}" fill="none" stroke="${colors.yellow}" stroke-width="86" stroke-linecap="round" stroke-linejoin="round" opacity=".92"/>
  <path d="${pathD(points)}" fill="none" stroke="${colors.white}" stroke-width="28" stroke-linecap="round" stroke-linejoin="round" opacity=".62"/>
  ${slides.map(slideCard).join("")}
  <rect x="${margin}" y="${H - 475}" width="${W - margin * 2}" height="210" rx="42" fill="${colors.white}" stroke="${colors.ink}" stroke-width="9"/>
  ${t({ x: margin + 70, y: H - 390, text: "阅读方式", size: 42, weight: 950 })}
  ${t({ x: margin + 70, y: H - 322, text: "沿黄色路径从 START 到 FINISH 阅读；四条虚线为折叠参考线；每个编号格对应原 PPT 的一页内容。", size: 36, weight: 650, fill: colors.muted })}
  ${t({ x: W - margin - 70, y: H - 390, text: "无声之地，可起惊雷；平凡之处，淬炼非凡。", size: 42, weight: 900, anchor: "end" })}
  ${t({ x: W - margin - 70, y: H - 322, text: "小凡教育科技 · 探索教育更多可能性", size: 32, weight: 760, fill: colors.muted, anchor: "end" })}
</svg>`;

fs.writeFileSync(svgPath, svg);
await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(pngPath);

console.log(JSON.stringify({ svgPath, pngPath, width: W, height: H, slides: slides.length }, null, 2));
