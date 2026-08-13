import fs from "node:fs";
import path from "node:path";
import sharp from "/Users/chenpan/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp/lib/index.js";

const root = "/Users/chenpan/Documents/于无声处起惊雷";
const outDir = path.join(root, "output/posters");
const logoPath = path.join(root, "work/assets/feifan-logo-black.png");
const svgPath = path.join(outDir, "5-squared-work-method-poster-fth-style.svg");
const pngPath = path.join(outDir, "5-squared-work-method-poster-fth-style.png");

fs.mkdirSync(outDir, { recursive: true });

const { data: logoPixels, info: logoInfo } = await sharp(logoPath)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

for (let i = 0; i < logoPixels.length; i += 4) {
  const alpha = logoPixels[i + 3];
  if (alpha >= 200) {
    logoPixels[i] = 248;
    logoPixels[i + 1] = 250;
    logoPixels[i + 2] = 252;
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
const ink = "#F8FAFC";
const muted = "#CBD5E1";
const dim = "#94A3B8";
const panel = "#172033";
const stroke = "#334155";
const yellow = "#FACC15";
const orange = "#F97316";
const blue = "#60A5FA";
const purple = "#8B5CF6";
const brown = "#A16207";
const green = "#22C55E";

function esc(value) {
  return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

function text({ x, y, content, size, weight = 600, fill = ink, anchor = "start", opacity = 1 }) {
  return `<text x="${x}" y="${y}" text-anchor="${anchor}" font-size="${size}" font-weight="${weight}" fill="${fill}" opacity="${opacity}" font-family="PingFang SC, Noto Sans SC, Arial" letter-spacing="0">${esc(content)}</text>`;
}

function action({ x, y, color, title, desc, index }) {
  return `
    <g transform="translate(${x} ${y})">
      <rect x="0" y="0" width="904" height="112" rx="24" fill="${color}18" stroke="${color}66" stroke-width="1.6"/>
      <circle cx="56" cy="56" r="30" fill="${color}24" stroke="${color}88" stroke-width="2"/>
      ${text({ x: 56, y: 67, content: "5", size: 30, weight: 850, fill: color, anchor: "middle" })}
      ${text({ x: 112, y: 48, content: title, size: 34, weight: 850 })}
      ${text({ x: 112, y: 82, content: desc, size: 21, weight: 500, fill: muted })}
      ${text({ x: 850, y: 66, content: String(index).padStart(2, "0"), size: 26, weight: 700, fill: color, anchor: "middle", opacity: .82 })}
    </g>
  `;
}

const items = [
  [yellow, "5小时心流", "Deep work block"],
  [blue, "50000字输出", "High density output"],
  [purple, "5个肥客户建联", "High value leads"],
  [brown, "5个客户深聊", "Consultative conversation"],
  [green, "每周 5 天达标", "Weekly standard"],
];

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#111827"/>
      <stop offset="0.58" stop-color="#0B1220"/>
      <stop offset="1" stop-color="#151C31"/>
    </linearGradient>
    <radialGradient id="glowBlue" cx="50%" cy="50%" r="50%">
      <stop offset="0" stop-color="${blue}" stop-opacity=".34"/>
      <stop offset="1" stop-color="${blue}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glowYellow" cx="50%" cy="50%" r="50%">
      <stop offset="0" stop-color="${yellow}" stop-opacity=".30"/>
      <stop offset="1" stop-color="${yellow}" stop-opacity="0"/>
    </radialGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="18" stdDeviation="24" flood-color="#020617" flood-opacity=".35"/>
    </filter>
  </defs>

  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <circle cx="902" cy="120" r="260" fill="url(#glowBlue)"/>
  <circle cx="154" cy="1265" r="280" fill="url(#glowYellow)"/>

  <image href="data:image/png;base64,${logo}" x="88" y="82" width="190" height="62" preserveAspectRatio="xMinYMin meet"/>
  ${text({ x: 992, y: 122, content: "To do list", size: 28, weight: 700, fill: dim, anchor: "end" })}

  <g transform="translate(88 178)">
    <circle cx="32" cy="32" r="32" fill="${yellow}24" stroke="${yellow}88" stroke-width="2"/>
    ${text({ x: 32, y: 43, content: "5", size: 29, weight: 850, fill: yellow, anchor: "middle" })}
    <circle cx="112" cy="32" r="32" fill="${blue}24" stroke="${blue}88" stroke-width="2"/>
    ${text({ x: 112, y: 43, content: "5", size: 29, weight: 850, fill: blue, anchor: "middle" })}
    <circle cx="192" cy="32" r="32" fill="${green}24" stroke="${green}88" stroke-width="2"/>
    ${text({ x: 192, y: 43, content: "5", size: 29, weight: 850, fill: green, anchor: "middle" })}
  </g>

  ${text({ x: 88, y: 330, content: "5²工作法", size: 92, weight: 900 })}
  ${text({ x: 88, y: 405, content: "百万年薪顾问每日工作清单", size: 42, weight: 850, fill: yellow })}
  ${text({ x: 88, y: 468, content: "Meet the better you", size: 30, weight: 500, fill: muted })}

  <g filter="url(#shadow)">
    <rect x="88" y="548" width="904" height="672" rx="34" fill="${panel}" stroke="${stroke}" stroke-width="2"/>
    ${items.map((it, idx) => action({ x: 128, y: 596 + idx * 120, color: it[0], title: it[1], desc: it[2], index: idx + 1 })).join("")}
  </g>

  <g transform="translate(88 1288)">
    <rect x="0" y="0" width="904" height="58" rx="29" fill="#101827" stroke="${stroke}" stroke-width="1.6"/>
    ${text({ x: 36, y: 38, content: "5小时心流 / 50000字输出 / 5个肥客户建联 / 5个客户深聊 / 每周5天达标", size: 22, weight: 600, fill: muted })}
  </g>
</svg>`;

fs.writeFileSync(svgPath, svg);
await sharp(Buffer.from(svg)).png().toFile(pngPath);

console.log(JSON.stringify({ svgPath, pngPath }, null, 2));
