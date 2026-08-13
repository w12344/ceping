import fs from "node:fs";
import path from "node:path";
import sharp from "/Users/chenpan/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp/lib/index.js";

const root = "/Users/chenpan/Documents/于无声处起惊雷";
const outDir = path.join(root, "output/posters");
const logoPath = path.join(root, "work/assets/feifan-logo-black.png");
const svgPath = path.join(outDir, "5-squared-work-method-poster-challenge.svg");
const pngPath = path.join(outDir, "5-squared-work-method-poster-challenge.png");

fs.mkdirSync(outDir, { recursive: true });

const { data: logoPixels, info: logoInfo } = await sharp(logoPath)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

for (let i = 0; i < logoPixels.length; i += 4) {
  const alpha = logoPixels[i + 3];
  if (alpha >= 200) {
    logoPixels[i] = 20;
    logoPixels[i + 1] = 20;
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
const bg = "#FFF9DD";
const ink = "#171717";
const gray = "#68635B";
const yellow = "#FFE200";
const blue = "#55B6FF";
const purple = "#2E3192";
const brown = "#8A623A";
const green = "#7AC943";
const card = "#FFFFFF";

function esc(value) {
  return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

function text({ x, y, content, size, weight = 700, fill = ink, anchor = "start", family = "PingFang SC, Noto Sans SC, Arial", opacity = 1 }) {
  return `<text x="${x}" y="${y}" font-family="${family}" font-size="${size}" font-weight="${weight}" fill="${fill}" text-anchor="${anchor}" opacity="${opacity}" letter-spacing="0">${esc(content)}</text>`;
}

function rounded({ x, y, w, h, r, fill, stroke = "none", sw = 0, opacity = 1 }) {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}" opacity="${opacity}"/>`;
}

function task({ y, color, title, desc, tag, rotate = 0 }) {
  return `
    <g transform="rotate(${rotate} 540 ${y + 68})">
      ${rounded({ x: 82, y, w: 916, h: 136, r: 34, fill: card, stroke: "#161616", sw: 4 })}
      ${rounded({ x: 82, y: y + 112, w: 916, h: 24, r: 12, fill: color })}
      <circle cx="154" cy="${y + 68}" r="42" fill="${color}" stroke="#161616" stroke-width="4"/>
      ${text({ x: 154, y: y + 82, content: "5", size: 42, weight: 900, anchor: "middle", fill: color === yellow ? ink : "#FFFFFF" })}
      ${text({ x: 226, y: y + 58, content: title, size: 42, weight: 900 })}
      ${text({ x: 226, y: y + 96, content: desc, size: 21, weight: 600, fill: gray })}
      ${rounded({ x: 804, y: y + 42, w: 132, h: 50, r: 25, fill: color })}
      ${text({ x: 870, y: y + 76, content: tag, size: 23, weight: 900, anchor: "middle", fill: color === yellow ? ink : "#FFFFFF" })}
    </g>
  `;
}

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="18" stdDeviation="18" flood-color="#111111" flood-opacity=".16"/>
    </filter>
    <pattern id="dots" width="34" height="34" patternUnits="userSpaceOnUse">
      <circle cx="5" cy="5" r="2" fill="#171717" opacity=".12"/>
    </pattern>
  </defs>

  <rect width="${W}" height="${H}" fill="${bg}"/>
  <circle cx="930" cy="170" r="210" fill="${blue}" opacity=".55"/>
  <circle cx="128" cy="1260" r="250" fill="${yellow}" opacity=".72"/>
  <rect x="0" y="0" width="${W}" height="${H}" fill="url(#dots)" opacity=".58"/>

  <image href="data:image/png;base64,${logo}" x="72" y="62" width="190" height="62" preserveAspectRatio="xMinYMin meet"/>
  ${rounded({ x: 810, y: 70, w: 186, h: 48, r: 24, fill: "#171717" })}
  ${text({ x: 903, y: 102, content: "TO DO LIST", size: 20, weight: 900, fill: "#FFFFFF", anchor: "middle" })}

  <g transform="translate(72 178)">
    ${rounded({ x: 0, y: 0, w: 236, h: 54, r: 27, fill: yellow, stroke: ink, sw: 4 })}
    ${text({ x: 118, y: 36, content: "内部打卡挑战", size: 24, weight: 900, anchor: "middle" })}
  </g>

  ${text({ x: 72, y: 335, content: "5²工作法挑战", size: 92, weight: 1000 })}
  ${text({ x: 72, y: 405, content: "百万年薪顾问每日工作清单", size: 43, weight: 900 })}
  ${text({ x: 72, y: 466, content: "Meet the better you", size: 32, weight: 700, fill: gray })}

  <g transform="translate(750 260) rotate(9)">
    ${rounded({ x: 0, y: 0, w: 214, h: 214, r: 42, fill: "#171717" })}
    ${text({ x: 107, y: 118, content: "5²", size: 82, weight: 1000, fill: yellow, anchor: "middle" })}
    ${text({ x: 107, y: 158, content: "5 DAYS", size: 23, weight: 900, fill: "#FFFFFF", anchor: "middle" })}
  </g>

  <g filter="url(#shadow)">
    ${task({ y: 560, color: yellow, title: "5小时心流", desc: "专注完成高价值事项", tag: "专注", rotate: -1.1 })}
    ${task({ y: 720, color: blue, title: "50000字输出", desc: "把思考沉淀为内容资产", tag: "输出", rotate: .8 })}
    ${task({ y: 880, color: purple, title: "5个肥客户建联", desc: "主动触达高潜线索", tag: "建联", rotate: -0.6 })}
    ${task({ y: 1040, color: brown, title: "5个客户深聊", desc: "真实理解需求与卡点", tag: "深聊", rotate: .9 })}
    ${task({ y: 1200, color: green, title: "每周 5 天达标", desc: "连续执行，形成节奏", tag: "达标", rotate: -0.7 })}
  </g>

  <path d="M70 510H1010" stroke="#171717" stroke-width="5" stroke-linecap="round" opacity=".22"/>
  ${text({ x: 540, y: 1374, content: "今天你完成 5² 了吗？", size: 36, weight: 1000, anchor: "middle" })}
</svg>`;

fs.writeFileSync(svgPath, svg);
await sharp(Buffer.from(svg)).png().toFile(pngPath);

console.log(JSON.stringify({ svgPath, pngPath }, null, 2));
