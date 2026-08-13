import fs from "node:fs";
import path from "node:path";
import sharp from "/Users/chenpan/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp/lib/index.js";

const root = "/Users/chenpan/Documents/于无声处起惊雷";
const outDir = path.join(root, "output/posters");
const logoPath = path.join(root, "work/assets/feifan-logo-black.png");
const svgPath = path.join(outDir, "5-squared-work-method-poster.svg");
const pngPath = path.join(outDir, "5-squared-work-method-poster.png");

fs.mkdirSync(outDir, { recursive: true });

const logo = fs.readFileSync(logoPath).toString("base64");

const W = 1242;
const H = 1900;
const ivory = "#FFFCE9";
const yellow = "#FFE200";
const blue = "#55B6FF";
const purple = "#2E3192";
const ink = "#1E1A1C";
const muted = "rgba(30,26,28,.58)";

function text({ x, y, content, size, weight = 800, fill = ink, family = "PingFang SC, Hiragino Sans GB, Microsoft YaHei, sans-serif", anchor = "start" }) {
  return `<text x="${x}" y="${y}" font-family="${family}" font-size="${size}" font-weight="${weight}" fill="${fill}" text-anchor="${anchor}" letter-spacing="0">${content}</text>`;
}

function item({ y, shadow, badgeFill = ink, badgeText = yellow, title, en, tag, tagFill, tagColor = ink }) {
  return `
    <rect x="86" y="${y + 10}" width="1080" height="150" fill="${shadow}"/>
    <rect x="76" y="${y}" width="1080" height="150" fill="rgba(255,255,255,.72)" stroke="${ink}" stroke-width="3"/>
    <circle cx="147" cy="${y + 75}" r="47" fill="${badgeFill}"/>
    ${text({ x: 147, y: y + 94, content: "5", size: 56, weight: 1000, fill: badgeText, anchor: "middle" })}
    ${text({ x: 222, y: y + 67, content: title, size: 52, weight: 900, family: "Songti SC, STSong, SimSun, serif" })}
    ${text({ x: 222, y: y + 106, content: en, size: 20, weight: 800, fill: muted })}
    <rect x="970" y="${y + 50}" width="118" height="50" fill="${tagFill}"/>
    ${text({ x: 1029, y: y + 84, content: tag, size: 23, weight: 1000, fill: tagColor, anchor: "middle" })}
  `;
}

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <pattern id="grid" width="124" height="124" patternUnits="userSpaceOnUse">
      <path d="M124 0H0V124" fill="none" stroke="${yellow}" stroke-opacity=".18" stroke-width="1"/>
    </pattern>
  </defs>
  <rect width="${W}" height="${H}" fill="${ivory}"/>
  <rect width="${W}" height="${H}" fill="url(#grid)"/>
  <rect width="${W}" height="228" fill="${yellow}"/>
  <image href="data:image/png;base64,${logo}" x="76" y="74" width="214" height="70" preserveAspectRatio="xMinYMin meet"/>
  <rect x="898" y="88" width="56" height="14" fill="${ink}"/>
  ${text({ x: 970, y: 105, content: "METHOD 05", size: 26, weight: 900 })}

  <rect x="76" y="280" width="190" height="42" fill="${ink}"/>
  ${text({ x: 171, y: 309, content: "百万年薪顾问", size: 22, weight: 900, fill: yellow, anchor: "middle" })}
  ${text({ x: 76, y: 470, content: "5", size: 178, weight: 900, family: "Songti SC, STSong, SimSun, serif" })}
  ${text({ x: 188, y: 368, content: "2", size: 72, weight: 900, family: "Songti SC, STSong, SimSun, serif" })}
  ${text({ x: 76, y: 628, content: "工作法", size: 170, weight: 900, family: "Songti SC, STSong, SimSun, serif" })}
  ${text({ x: 76, y: 714, content: "百万年薪顾问每日工作", size: 42, weight: 900 })}
  ${text({ x: 76, y: 760, content: "TO DO LIST", size: 24, weight: 900, fill: muted })}

  <rect x="833" y="298" width="420" height="360" fill="${purple}"/>
  <rect x="815" y="280" width="420" height="360" fill="${yellow}" stroke="${ink}" stroke-width="5"/>
  <rect x="833" y="640" width="420" height="18" fill="${blue}"/>
  ${text({ x: 853, y: 457, content: "5", size: 220, weight: 1000 })}
  ${text({ x: 853, y: 538, content: "每天抓住 5 个关键动作", size: 34, weight: 1000 })}
  ${text({ x: 853, y: 582, content: "每周连续 5 天达标", size: 34, weight: 1000 })}

  <text x="24" y="742" transform="rotate(90 24 742)" font-family="PingFang SC, Hiragino Sans GB, Microsoft YaHei, sans-serif" font-size="18" font-weight="900" fill="${muted}" letter-spacing="0">Daily execution system</text>
  <rect x="76" y="758" width="1090" height="3" fill="${ink}"/>
  <rect x="916" y="749" width="250" height="20" fill="${yellow}"/>

  ${item({ y: 850, shadow: yellow, title: "5小时心流", en: "Deep work block", tag: "专注", tagFill: yellow })}
  ${item({ y: 1024, shadow: blue, badgeText: blue, title: "50000字输出", en: "High density output", tag: "输出", tagFill: blue })}
  ${item({ y: 1198, shadow: purple, badgeFill: purple, badgeText: "#FFFFFF", title: "5个肥客户建联", en: "High value leads", tag: "建联", tagFill: purple, tagColor: "#FFFFFF" })}
  ${item({ y: 1372, shadow: yellow, title: "5个客户深聊", en: "Consultative conversation", tag: "深聊", tagFill: yellow })}
  ${item({ y: 1546, shadow: blue, badgeText: blue, title: "一周 5 天达标", en: "Weekly standard", tag: "达标", tagFill: blue })}

  <rect x="76" y="1780" width="1090" height="3" fill="${ink}"/>
  ${text({ x: 76, y: 1830, content: "把高价值顾问的每日动作，压缩成可反复执行的清单。", size: 28, weight: 900 })}
  ${text({ x: 76, y: 1873, content: "5小时心流 / 50000字输出 / 5个肥客户建联 / 5个客户深聊 / 一周5天达标", size: 20, weight: 800, fill: muted })}
  ${["MON", "TUE", "WED", "THU", "FRI"].map((d, i) => {
    const x = 796 + i * 68;
    return `<rect x="${x}" y="1812" width="58" height="58" fill="${yellow}" stroke="${ink}" stroke-width="3"/>${text({ x: x + 29, y: 1848, content: d, size: 20, weight: 1000, anchor: "middle" })}`;
  }).join("")}
</svg>`;

fs.writeFileSync(svgPath, svg);
await sharp(Buffer.from(svg)).png().toFile(pngPath);

console.log(JSON.stringify({ svgPath, pngPath }, null, 2));
