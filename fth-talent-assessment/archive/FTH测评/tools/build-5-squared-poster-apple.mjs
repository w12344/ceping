import fs from "node:fs";
import path from "node:path";
import sharp from "/Users/chenpan/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp/lib/index.js";

const root = "/Users/chenpan/Documents/于无声处起惊雷";
const outDir = path.join(root, "output/posters");
const logoPath = path.join(root, "work/assets/feifan-logo-black.png");
const cleanLogoPath = path.join(outDir, "feifan-logo-black-transparent.png");
const svgPath = path.join(outDir, "5-squared-work-method-poster-apple-minimal.svg");
const pngPath = path.join(outDir, "5-squared-work-method-poster-apple-minimal.png");

fs.mkdirSync(outDir, { recursive: true });

const { data: logoPixels, info: logoInfo } = await sharp(logoPath)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

for (let i = 0; i < logoPixels.length; i += 4) {
  const alpha = logoPixels[i + 3];

  if (alpha >= 200) {
    logoPixels[i] = 17;
    logoPixels[i + 1] = 17;
    logoPixels[i + 2] = 17;
    logoPixels[i + 3] = 255;
  } else {
    logoPixels[i + 3] = 0;
  }
}

const cleanLogo = await sharp(logoPixels, {
  raw: {
    width: logoInfo.width,
    height: logoInfo.height,
    channels: 4,
  },
})
  .png()
  .toBuffer();

fs.writeFileSync(cleanLogoPath, cleanLogo);

const logo = cleanLogo.toString("base64");

const W = 1242;
const H = 1900;
const bg = "#fbfaf4";
const panel = "#ffffff";
const yellow = "#ffe200";
const blue = "#55b6ff";
const purple = "#2e3192";
const brown = "#7a5a36";
const green = "#83c653";
const ink = "#111111";
const soft = "#f3f2ec";
const muted = "#6f6c67";
const lightText = "#9b9891";

function esc(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function text({
  x,
  y,
  content,
  size,
  weight = 600,
  fill = ink,
  family = "PingFang SC, Hiragino Sans GB, Microsoft YaHei, sans-serif",
  anchor = "start",
  opacity = 1,
}) {
  return `<text x="${x}" y="${y}" font-family="${family}" font-size="${size}" font-weight="${weight}" fill="${fill}" text-anchor="${anchor}" opacity="${opacity}" letter-spacing="0">${esc(content)}</text>`;
}

function pill({ x, y, w, h, fill, opacity = 1 }) {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${h / 2}" fill="${fill}" opacity="${opacity}"/>`;
}

function item({ i, y, title, desc, color }) {
  const x = 126;
  return `
    <g>
      ${pill({ x, y: y - 58, w: 990, h: 126, fill: panel })}
      <circle cx="${x + 48}" cy="${y}" r="25" fill="${color}"/>
      ${text({ x: x + 48, y: y + 9, content: "5", size: 26, weight: 700, fill: color === yellow ? ink : "#ffffff", anchor: "middle" })}
      ${text({ x: x + 108, y: y - 5, content: title, size: 36, weight: 700 })}
      ${text({ x: x + 108, y: y + 34, content: desc, size: 18, weight: 500, fill: muted })}
      ${text({ x: 1082, y: y + 6, content: String(i).padStart(2, "0"), size: 22, weight: 600, fill: lightText, anchor: "end" })}
    </g>
  `;
}

const items = [
  ["5小时心流", "Deep work block", yellow],
  ["50000字输出", "High density output", blue],
  ["5个肥客户建联", "High value leads", purple],
  ["5个客户深聊", "Consultative conversation", brown],
  ["每周 5 天达标", "Weekly standard", green],
];

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="18" stdDeviation="24" flood-color="#000000" flood-opacity=".055"/>
    </filter>
    <linearGradient id="fadeYellow" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${yellow}" stop-opacity=".95"/>
      <stop offset="1" stop-color="${yellow}" stop-opacity=".18"/>
    </linearGradient>
  </defs>

  <rect width="${W}" height="${H}" fill="${bg}"/>
  <path d="M0 0H1242V365C975 424 790 349 564 390C323 434 192 527 0 491Z" fill="url(#fadeYellow)" opacity=".72"/>

  <image href="data:image/png;base64,${logo}" x="92" y="82" width="190" height="62" preserveAspectRatio="xMinYMin meet"/>
  ${text({ x: 1150, y: 122, content: "To do list", size: 30, weight: 600, fill: muted, anchor: "end" })}

  ${text({ x: 621, y: 356, content: "5", size: 226, weight: 700, anchor: "middle" })}
  ${text({ x: 703, y: 245, content: "2", size: 70, weight: 650, anchor: "middle" })}
  ${text({ x: 621, y: 462, content: "工作法", size: 92, weight: 700, anchor: "middle" })}

  <g filter="url(#softShadow)">
    ${pill({ x: 116, y: 648, w: 1010, h: 900, fill: panel })}
  </g>
  ${text({ x: 166, y: 745, content: "Meet the better you", size: 28, weight: 500, fill: muted })}
  ${text({ x: 166, y: 804, content: "把高价值动作，变成每天都能完成的节奏。", size: 38, weight: 650 })}

  ${items.map((it, idx) => item({ i: idx + 1, y: 930 + idx * 122, title: it[0], desc: it[1], color: it[2] })).join("")}
  ${text({ x: 621, y: 1748, content: "百万年薪顾问每日工作清单", size: 42, weight: 600, fill: muted, anchor: "middle" })}
</svg>`;

fs.writeFileSync(svgPath, svg);
await sharp(Buffer.from(svg)).png().toFile(pngPath);

console.log(JSON.stringify({ svgPath, pngPath }, null, 2));
