import fs from "node:fs";
import path from "node:path";
import sharp from "/Users/chenpan/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp/lib/index.js";

const root = "/Users/chenpan/Documents/于无声处起惊雷";
const outDir = path.join(root, "output/posters");
const logoPath = path.join(root, "work/assets/feifan-logo-black.png");
const svgPath = path.join(outDir, "5-squared-work-method-poster-premium.svg");
const pngPath = path.join(outDir, "5-squared-work-method-poster-premium.png");

fs.mkdirSync(outDir, { recursive: true });

const { data: logoPixels, info: logoInfo } = await sharp(logoPath)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

for (let i = 0; i < logoPixels.length; i += 4) {
  const alpha = logoPixels[i + 3];
  if (alpha >= 200) {
    logoPixels[i] = 22;
    logoPixels[i + 1] = 22;
    logoPixels[i + 2] = 20;
    logoPixels[i + 3] = 255;
  } else {
    logoPixels[i + 3] = 0;
  }
}

const logo = (await sharp(logoPixels, {
  raw: { width: logoInfo.width, height: logoInfo.height, channels: 4 },
}).png().toBuffer()).toString("base64");

const W = 1080;
const H = 1440;
const paper = "#F6F1DD";
const ink = "#161614";
const muted = "#716B5C";
const hair = "#D8D0B7";
const yellow = "#FFE200";
const blue = "#55B6FF";
const purple = "#2E3192";
const brown = "#7A5B39";
const green = "#6DBD45";

function esc(value) {
  return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

function text({ x, y, content, size, weight = 500, fill = ink, anchor = "start", family = "PingFang SC, Noto Sans SC, Arial", opacity = 1 }) {
  return `<text x="${x}" y="${y}" font-family="${family}" font-size="${size}" font-weight="${weight}" fill="${fill}" text-anchor="${anchor}" opacity="${opacity}" letter-spacing="0">${esc(content)}</text>`;
}

function row({ y, no, zh, en, color }) {
  return `
    <g>
      <line x1="84" y1="${y - 42}" x2="996" y2="${y - 42}" stroke="${hair}" stroke-width="1"/>
      ${text({ x: 84, y, content: no, size: 22, weight: 700, fill: color })}
      <circle cx="149" cy="${y - 7}" r="5" fill="${color}"/>
      ${text({ x: 184, y, content: zh, size: 38, weight: 800 })}
      ${text({ x: 776, y, content: en, size: 18, weight: 500, fill: muted })}
    </g>
  `;
}

const rows = [
  ["01", "5小时心流", "DEEP WORK BLOCK", yellow],
  ["02", "50000字输出", "HIGH DENSITY OUTPUT", blue],
  ["03", "5个肥客户建联", "HIGH VALUE LEADS", purple],
  ["04", "5个客户深聊", "CLIENT CONVERSATION", brown],
  ["05", "每周 5 天达标", "WEEKLY STANDARD", green],
];

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="wash" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#FFFFFF" stop-opacity=".72"/>
      <stop offset="1" stop-color="#FFE200" stop-opacity=".20"/>
    </linearGradient>
    <filter id="grain">
      <feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" stitchTiles="stitch"/>
      <feColorMatrix type="saturate" values="0"/>
      <feComponentTransfer>
        <feFuncA type="table" tableValues="0 .055"/>
      </feComponentTransfer>
    </filter>
  </defs>

  <rect width="${W}" height="${H}" fill="${paper}"/>
  <rect width="${W}" height="${H}" fill="url(#wash)"/>
  <rect width="${W}" height="${H}" filter="url(#grain)" opacity=".65"/>

  <rect x="0" y="0" width="22" height="${H}" fill="${yellow}"/>
  <rect x="84" y="84" width="912" height="1" fill="${hair}"/>
  <rect x="84" y="1280" width="912" height="1" fill="${hair}"/>

  <image href="data:image/png;base64,${logo}" x="84" y="112" width="176" height="57" preserveAspectRatio="xMinYMin meet"/>
  ${text({ x: 996, y: 146, content: "TO DO LIST", size: 20, weight: 700, fill: muted, anchor: "end" })}

  ${text({ x: 84, y: 346, content: "5", size: 220, weight: 800 })}
  ${text({ x: 218, y: 244, content: "2", size: 68, weight: 700 })}
  ${text({ x: 344, y: 318, content: "工作法", size: 92, weight: 850 })}
  ${text({ x: 86, y: 411, content: "百万年薪顾问每日工作清单", size: 42, weight: 800 })}
  ${text({ x: 86, y: 466, content: "Meet the better you", size: 25, weight: 500, fill: muted })}

  <g opacity=".98">
    <rect x="760" y="206" width="236" height="236" fill="${ink}"/>
    <rect x="740" y="186" width="236" height="236" fill="none" stroke="${yellow}" stroke-width="12"/>
    ${text({ x: 858, y: 316, content: "5²", size: 74, weight: 850, fill: yellow, anchor: "middle" })}
    ${text({ x: 858, y: 362, content: "DAILY METHOD", size: 18, weight: 700, fill: "#FFFFFF", anchor: "middle" })}
  </g>

  <g>
    ${rows.map((r, idx) => row({ y: 600 + idx * 116, no: r[0], zh: r[1], en: r[2], color: r[3] })).join("")}
    <line x1="84" y1="1138" x2="996" y2="1138" stroke="${hair}" stroke-width="1"/>
  </g>

  <g>
    ${text({ x: 84, y: 1214, content: "不是更多事项，而是更少、更准、更持续的动作。", size: 30, weight: 750 })}
    ${text({ x: 84, y: 1260, content: "5 HOURS / 50,000 WORDS / 5 LEADS / 5 CONVERSATIONS / 5 DAYS", size: 17, weight: 600, fill: muted })}
  </g>

  <g transform="translate(84 1334)">
    <rect x="0" y="0" width="48" height="8" fill="${yellow}"/>
    <rect x="64" y="0" width="48" height="8" fill="${blue}"/>
    <rect x="128" y="0" width="48" height="8" fill="${purple}"/>
    <rect x="192" y="0" width="48" height="8" fill="${brown}"/>
    <rect x="256" y="0" width="48" height="8" fill="${green}"/>
  </g>
</svg>`;

fs.writeFileSync(svgPath, svg);
await sharp(Buffer.from(svg)).png().toFile(pngPath);

console.log(JSON.stringify({ svgPath, pngPath }, null, 2));
