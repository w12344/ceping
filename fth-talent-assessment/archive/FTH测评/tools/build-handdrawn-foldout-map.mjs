import fs from "node:fs";
import path from "node:path";
import sharp from "/Users/chenpan/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp/lib/index.js";

const root = "/Users/chenpan/Documents/于无声处起惊雷";
const sourcePath = path.join(root, "work/foldout-map/tmp/source-text.json");
const assetDir = path.join(root, "work/foldout-map/assets");
const outDir = path.join(root, "output/foldout");
const svgPath = path.join(outDir, "于无声处起惊雷-手绘融合大开页.svg");
const pngPath = path.join(outDir, "于无声处起惊雷-手绘融合大开页.png");
const jpgPath = path.join(outDir, "于无声处起惊雷-手绘融合大开页-传阅版.jpg");
const previewPath = path.join(outDir, "于无声处起惊雷-手绘融合大开页-预览版.jpg");

fs.mkdirSync(outDir, { recursive: true });

const slides = JSON.parse(fs.readFileSync(sourcePath, "utf8"));
const bySlide = new Map(slides.map((slide) => [slide.slide, slide.texts]));

const W = 12000;
const H = 7500;
const ink = "#171512";
const paper = "#fff5d6";
const cream = "#fffbe8";
const yellow = "#ffe045";
const blue = "#66b8ee";
const teal = "#63c6b5";
const green = "#8ed16a";
const orange = "#f4a545";
const red = "#ef6e5f";
const purple = "#8f79d7";
const muted = "#5c554b";

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

function text({
  x,
  y,
  value,
  size,
  weight = 600,
  fill = ink,
  anchor = "start",
  opacity = 1,
  rotate = 0,
  family = "PingFang SC, Hiragino Sans GB, Microsoft YaHei, Arial, sans-serif",
}) {
  const transform = rotate ? ` transform="rotate(${rotate} ${x} ${y})"` : "";
  return `<text x="${x}" y="${y}" font-family="${family}" font-size="${size}" font-weight="${weight}" fill="${fill}" text-anchor="${anchor}" opacity="${opacity}" letter-spacing="0"${transform}>${esc(value)}</text>`;
}

function weightOf(str) {
  return [...String(str)].reduce((sum, ch) => sum + (/[\x00-\x7F]/.test(ch) ? 0.55 : 1), 0);
}

function wrap(str, max) {
  const rows = [];
  let cur = "";
  for (const ch of String(str)) {
    cur += ch;
    if (weightOf(cur) >= max) {
      rows.push(cur);
      cur = "";
    }
  }
  if (cur) rows.push(cur);
  return rows;
}

function paragraphRows(lines, maxChars) {
  const rows = [];
  for (const line of lines) {
    rows.push(...wrap(line, maxChars));
  }
  return rows;
}

function fitText({ x, y, w, h, lines, preferred = 30, min = 15, fill = ink, columns = 1, leading = 1.36, weight = 580 }) {
  let best = null;
  for (let size = preferred; size >= min; size -= 1) {
    const maxChars = Math.floor((w / columns) / (size * 0.58));
    const rows = paragraphRows(lines, maxChars);
    const lineHeight = size * leading;
    const capacity = Math.floor(h / lineHeight) * columns;
    if (rows.length <= capacity) {
      best = { size, rows, lineHeight, maxChars };
      break;
    }
  }
  if (!best) {
    const size = min;
    best = {
      size,
      rows: paragraphRows(lines, Math.floor((w / columns) / (size * 0.58))),
      lineHeight: Math.max(18, (h * columns) / Math.max(1, paragraphRows(lines, Math.floor((w / columns) / (size * 0.58))).length)),
    };
  }
  const rowsPerCol = Math.ceil(best.rows.length / columns);
  const colW = w / columns;
  return best.rows.map((row, i) => {
    const col = Math.floor(i / rowsPerCol);
    const r = i % rowsPerCol;
    return text({
      x: x + col * colW,
      y: y + r * best.lineHeight,
      value: row,
      size: Math.min(best.size, best.lineHeight * 0.74),
      weight,
      fill,
    });
  }).join("");
}

function roughRectPath(x, y, w, h) {
  return `M${x + w * 0.08} ${y + h * 0.08}
    C${x + w * 0.24} ${y - h * 0.03},${x + w * 0.42} ${y + h * 0.04},${x + w * 0.58} ${y + h * 0.02}
    C${x + w * 0.78} ${y - h * 0.02},${x + w * 0.92} ${y + h * 0.03},${x + w * 0.98} ${y + h * 0.12}
    C${x + w * 1.04} ${y + h * 0.29},${x + w * 0.98} ${y + h * 0.44},${x + w * 1.02} ${y + h * 0.62}
    C${x + w * 1.07} ${y + h * 0.83},${x + w * 0.92} ${y + h * 0.98},${x + w * 0.76} ${y + h * 0.96}
    C${x + w * 0.55} ${y + h * 1.05},${x + w * 0.36} ${y + h * 0.98},${x + w * 0.16} ${y + h * 1.02}
    C${x + w * 0.02} ${y + h * 1.05},${x - w * 0.02} ${y + h * 0.86},${x + w * 0.02} ${y + h * 0.70}
    C${x - w * 0.04} ${y + h * 0.52},${x + w * 0.02} ${y + h * 0.34},${x} ${y + h * 0.18}
    C${x} ${y + h * 0.11},${x + w * 0.03} ${y + h * 0.09},${x + w * 0.08} ${y + h * 0.08}Z`;
}

function blob({ x, y, w, h, fill, stroke = ink, opacity = 1 }) {
  return `<path d="${roughRectPath(x, y, w, h)}" fill="${fill}" stroke="${stroke}" stroke-width="10" opacity="${opacity}" stroke-linejoin="round"/>`;
}

function collect(nums, { skipFooter = true } = {}) {
  const lines = [];
  for (const n of nums) {
    const slide = bySlide.get(n) || [];
    for (const line of slide) {
      if (skipFooter && line === "小凡教育科技 · 探索教育更多可能性") continue;
      lines.push(line);
    }
  }
  return lines;
}

function note({ x, y, w, h, color, title, subtitle, lines, columns = 1, titleSize = 58, bodySize = 27, rotate = 0 }) {
  const bodyTop = y + (subtitle ? 150 : 112);
  const transform = rotate ? ` transform="rotate(${rotate} ${x + w / 2} ${y + h / 2})"` : "";
  return `<g${transform}>
    <path d="${roughRectPath(x + 34, y + 38, w, h)}" fill="#000000" opacity=".08"/>
    ${blob({ x, y, w, h, fill: color })}
    <path d="${roughRectPath(x + 24, y + 28, w - 48, h - 56)}" fill="none" stroke="#ffffff" stroke-width="8" opacity=".45"/>
    ${text({ x: x + 58, y: y + 74, value: title, size: titleSize, weight: 950 })}
    ${subtitle ? text({ x: x + 60, y: y + 126, value: subtitle, size: 30, weight: 760, fill: muted }) : ""}
    ${fitText({ x: x + 62, y: bodyTop, w: w - 124, h: h - (bodyTop - y) - 58, lines, preferred: bodySize, min: 14, columns })}
  </g>`;
}

function marker({ x, y, n, label, fill }) {
  return `<g>
    <circle cx="${x}" cy="${y}" r="56" fill="${fill}" stroke="${ink}" stroke-width="10"/>
    ${text({ x, y: y + 18, value: n, size: 48, weight: 950, anchor: "middle" })}
    ${label ? text({ x: x + 70, y: y + 16, value: label, size: 34, weight: 900 }) : ""}
  </g>`;
}

function tree(x, y, s = 1, fill = green) {
  return `<g transform="translate(${x} ${y}) scale(${s})">
    <path d="M0 72V28" stroke="${ink}" stroke-width="10" stroke-linecap="round"/>
    <circle cx="-30" cy="10" r="36" fill="${fill}" stroke="${ink}" stroke-width="8"/>
    <circle cx="8" cy="-18" r="42" fill="${fill}" stroke="${ink}" stroke-width="8"/>
    <circle cx="45" cy="18" r="34" fill="${fill}" stroke="${ink}" stroke-width="8"/>
  </g>`;
}

function building(x, y, w, h, fill) {
  return `<g>
    <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}" stroke="${ink}" stroke-width="10"/>
    <path d="M${x - 24} ${y}L${x + w / 2} ${y - 80}L${x + w + 24} ${y}Z" fill="${yellow}" stroke="${ink}" stroke-width="10"/>
    ${Array.from({ length: 4 }, (_, i) => `<rect x="${x + 35 + i * (w - 100) / 3}" y="${y + 58}" width="58" height="80" fill="${cream}" stroke="${ink}" stroke-width="7"/>`).join("")}
  </g>`;
}

function chip(x, y, s = 1) {
  return `<g transform="translate(${x} ${y}) scale(${s})">
    <rect x="-150" y="-110" width="300" height="220" rx="28" fill="${purple}" stroke="${ink}" stroke-width="12"/>
    <rect x="-82" y="-50" width="164" height="100" rx="12" fill="${cream}" stroke="${ink}" stroke-width="9"/>
    ${[-116, -58, 0, 58, 116].map((xx) => `<path d="M${xx} -138V-110M${xx} 110v28" stroke="${ink}" stroke-width="10"/>`).join("")}
    ${[-76, 0, 76].map((yy) => `<path d="M-178 ${yy}H-150M150 ${yy}h28" stroke="${ink}" stroke-width="10"/>`).join("")}
    ${text({ x: 0, y: 14, value: "芯片", size: 52, weight: 950, anchor: "middle" })}
  </g>`;
}

function header() {
  const logo = imageData("image1.png");
  return `
    <rect width="${W}" height="${H}" fill="${paper}"/>
    <path d="M0 0H12000V520C10200 410 8800 640 7150 470C5600 310 4550 170 3100 310C1780 438 980 600 0 440Z" fill="#94d4ff"/>
    <path d="M520 540C820 330 1220 350 1540 570C1880 320 2300 330 2650 565C3030 350 3500 315 3940 570Z" fill="#8bcf64" stroke="${ink}" stroke-width="0" opacity=".95"/>
    <path d="M3650 500L4180 130L4720 500Z" fill="#6aa48f"/>
    <path d="M4250 500L4710 190L5230 500Z" fill="#9ac7b8"/>
    <path d="M4180 130L4350 260L4030 260Z" fill="#fff"/>
    <path d="M4710 190L4850 290L4580 290Z" fill="#fff"/>
    <circle cx="11260" cy="240" r="92" fill="${yellow}" stroke="${ink}" stroke-width="14"/>
    <image href="${logo}" x="300" y="105" width="760" height="246" preserveAspectRatio="xMinYMin meet"/>
    ${text({ x: 300, y: 470, value: "于无声处，起惊雷", size: 130, weight: 950, family: "Songti SC, STSong, SimSun, serif" })}
    ${text({ x: 310, y: 565, value: "Make silence voice 让沉默发声", size: 48, weight: 800, fill: muted })}
    ${text({ x: 11150, y: 170, value: "小凡教育科技 · 探索教育更多可能性", size: 44, weight: 850, anchor: "end" })}
    ${text({ x: 11150, y: 235, value: "手绘融合大开页 / 内容源自 V36 终版", size: 34, weight: 720, fill: muted, anchor: "end" })}
  `;
}

function scene() {
  const campus = imageData("image8.jpeg");
  const classroom = imageData("image5.png");
  const student = imageData("image11.jpeg");
  const qr = imageData("image12.png");
  return `
    ${header()}
    <path d="M480 1210C1980 740 3150 1450 4650 1120C6220 780 7240 1220 8740 960C10000 740 11080 930 11600 1540
      C10500 2320 9600 2360 8450 2990C7200 3680 7650 4590 6410 5110
      C5120 5650 4100 5100 2950 5630C2040 6050 1320 6470 780 7040"
      fill="none" stroke="#d79b42" stroke-width="360" stroke-linecap="round" stroke-linejoin="round" opacity=".95"/>
    <path d="M480 1210C1980 740 3150 1450 4650 1120C6220 780 7240 1220 8740 960C10000 740 11080 930 11600 1540
      C10500 2320 9600 2360 8450 2990C7200 3680 7650 4590 6410 5110
      C5120 5650 4100 5100 2950 5630C2040 6050 1320 6470 780 7040"
      fill="none" stroke="${yellow}" stroke-width="250" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M480 1210C1980 740 3150 1450 4650 1120C6220 780 7240 1220 8740 960C10000 740 11080 930 11600 1540
      C10500 2320 9600 2360 8450 2990C7200 3680 7650 4590 6410 5110
      C5120 5650 4100 5100 2950 5630C2040 6050 1320 6470 780 7040"
      fill="none" stroke="#fff8c8" stroke-width="82" stroke-dasharray="68 86" stroke-linecap="round"/>
    <path d="M-100 3370C810 3150 1600 3440 2470 3260C3450 3060 4150 3310 5000 3180C5770 3060 6490 2680 7410 2870C8330 3060 9190 2830 10040 2950C10830 3060 11420 3410 12100 3210V3900C10900 4200 9710 3830 8520 4090C7320 4350 6150 3860 4890 4180C3720 4480 2620 3950 1410 4230C760 4380 310 4300-100 4440Z" fill="#8fd7e8" opacity=".66"/>
    <path d="M-100 3370C810 3150 1600 3440 2470 3260C3450 3060 4150 3310 5000 3180C5770 3060 6490 2680 7410 2870C8330 3060 9190 2830 10040 2950C10830 3060 11420 3410 12100 3210" fill="none" stroke="${ink}" stroke-width="8" opacity=".38"/>
    <image href="${campus}" x="8040" y="650" width="1520" height="855" preserveAspectRatio="xMidYMid slice" clip-path="url(#campusClip)" opacity=".92"/>
    <image href="${classroom}" x="720" y="5280" width="1190" height="915" preserveAspectRatio="xMidYMid slice" clip-path="url(#classClip)" opacity=".9"/>
    <image href="${student}" x="10240" y="4450" width="560" height="910" preserveAspectRatio="xMidYMid slice" clip-path="url(#studentClip)" opacity=".86"/>
    <image href="${qr}" x="10900" y="4800" width="350" height="350"/>
    ${building(760, 1680, 620, 320, blue)}
    ${building(2470, 1270, 620, 320, teal)}
    ${building(4660, 1460, 620, 320, green)}
    ${chip(7160, 1710, 0.85)}
    ${Array.from({ length: 38 }, (_, i) => tree(580 + (i * 307) % 10800, 900 + ((i * 431) % 5600), 0.52 + (i % 4) * 0.08, i % 3 === 0 ? "#6fc36a" : "#8ed16a")).join("")}
    ${marker({ x: 480, y: 1210, n: "START", label: "四个模块读懂小凡教育科技", fill: yellow })}
    ${marker({ x: 11600, y: 1540, n: "1", label: "我们是谁", fill: blue })}
    ${marker({ x: 8600, y: 3020, n: "2", label: "组织", fill: teal })}
    ${marker({ x: 6400, y: 5120, n: "3", label: "人才", fill: orange })}
    ${marker({ x: 780, y: 7040, n: "4", label: "成长", fill: green })}
    <path d="M10520 860c130-85 320-70 400 30c110-42 260 20 285 150c150 16 250 145 170 300H10240c-155-130-60-378 280-480Z" fill="#fff" stroke="${ink}" stroke-width="12"/>
    ${text({ x: 10835, y: 1175, value: "FINISH", size: 86, weight: 1000, anchor: "middle" })}
  `;
}

const notes = [
  {
    x: 520, y: 790, w: 3050, h: 980, color: "#fff3a6",
    title: "FRAMEWORK",
    subtitle: "四个模块，读懂小凡教育科技",
    lines: collect([3]),
    columns: 2,
  },
  {
    x: 6150, y: 650, w: 1900, h: 1120, color: "#e1f3ff",
    title: "我们是谁",
    subtitle: "完整闭环的教育科技集团",
    lines: collect([4, 5, 6, 7, 8]),
    columns: 2,
    bodySize: 22,
  },
  {
    x: 470, y: 2060, w: 2600, h: 1160, color: "#d8efff",
    title: "非凡教育",
    subtitle: "让沉默发声",
    lines: collect([9, 10, 11, 12]),
    columns: 2,
    bodySize: 23,
  },
  {
    x: 3230, y: 2020, w: 2500, h: 1200, color: "#d9f4e7",
    title: "小凡私塾",
    subtitle: "看见每一个学生",
    lines: collect([13, 14, 15, 16]),
    columns: 2,
    bodySize: 22,
  },
  {
    x: 5900, y: 2170, w: 2140, h: 980, color: "#e8f7ff",
    title: "小凡公学",
    subtitle: "高三的另一种选择",
    lines: collect([17, 18]),
    columns: 2,
    bodySize: 23,
  },
  {
    x: 8300, y: 1920, w: 3000, h: 1240, color: "#efe7ff",
    title: "1605人工智能",
    subtitle: "让教育能力被放大",
    lines: collect([19, 20, 21, 22]),
    columns: 2,
    bodySize: 22,
  },
  {
    x: 620, y: 3600, w: 3300, h: 990, color: "#d9f5ee",
    title: "打造什么样的组织",
    subtitle: "90分 Native + AI Native",
    lines: collect([23, 24, 25, 26]),
    columns: 2,
    bodySize: 23,
  },
  {
    x: 4240, y: 3460, w: 3060, h: 1190, color: "#ffe3b7",
    title: "选人三角模型",
    subtitle: "底色 · 特质 · 技能",
    lines: collect([27, 28, 29]),
    columns: 2,
    bodySize: 22,
  },
  {
    x: 7550, y: 3460, w: 3740, h: 1340, color: "#ffd8a3",
    title: "青色人才的底色",
    subtitle: "A+人才 · 价值观 · 飞轮 · 芯片 · 层次 · 认知",
    lines: collect([30, 31, 32, 33, 34, 35]),
    columns: 3,
    bodySize: 20,
  },
  {
    x: 2310, y: 5030, w: 3670, h: 1280, color: "#ffe0a6",
    title: "FTH 特质模型",
    subtitle: "进取、思辨、赋能：一支完整团队的三种力量",
    lines: collect([36, 37, 38, 39, 40, 41, 42]),
    columns: 3,
    bodySize: 19,
  },
  {
    x: 6390, y: 5450, w: 2730, h: 1030, color: "#def5c8",
    title: "如何持续成长",
    subtitle: "Stay Hungry · Stay Foolish",
    lines: collect([43, 44, 45]),
    columns: 2,
    bodySize: 23,
  },
  {
    x: 9220, y: 5620, w: 2260, h: 900, color: "#fff3a6",
    title: "OUR PURPOSE",
    subtitle: "探索教育更多可能性",
    lines: collect([46, 1, 2], { skipFooter: false }),
    columns: 1,
    bodySize: 30,
  },
];

const foldLines = [W / 4, W / 2, W * 3 / 4].map((x) => `
  <path d="M${x} 0V${H}" stroke="${ink}" stroke-width="7" stroke-dasharray="38 35" opacity=".22"/>
  ${text({ x: x + 45, y: H - 245, value: "FOLD", size: 42, weight: 900, opacity: 0.32, rotate: -90 })}
`).join("");

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <clipPath id="campusClip"><path d="${roughRectPath(8040, 650, 1520, 855, 70)}"/></clipPath>
    <clipPath id="classClip"><path d="${roughRectPath(720, 5280, 1190, 915, 60)}"/></clipPath>
    <clipPath id="studentClip"><path d="${roughRectPath(10240, 4450, 560, 910, 45)}"/></clipPath>
    <pattern id="paperNoise" width="160" height="160" patternUnits="userSpaceOnUse">
      <circle cx="24" cy="30" r="5" fill="#000" opacity=".04"/>
      <circle cx="122" cy="92" r="4" fill="#000" opacity=".035"/>
      <path d="M10 140C60 130 92 150 150 136" stroke="#000" stroke-width="2" opacity=".025" fill="none"/>
    </pattern>
  </defs>
  ${scene()}
  <rect width="${W}" height="${H}" fill="url(#paperNoise)"/>
  ${foldLines}
  ${notes.map((n, i) => note({ ...n, rotate: [0, -1.1, 0.8, -0.7, 1.0, -0.8, 0.7, -0.9, 0.4, 0.8, -0.7, 0.6][i] })).join("")}
  <path d="M300 6880C1450 6690 2060 6920 3340 6760C4700 6590 5880 6870 7150 6720C8380 6575 9730 6730 11600 6600" fill="none" stroke="${ink}" stroke-width="8" opacity=".45"/>
  ${text({ x: 590, y: 7245, value: "阅读方式：沿黄色道路从 START 到 FINISH 阅读；四条虚线为折叠参考线；整体内容来自《于无声处起惊雷》V36 终版。", size: 34, weight: 760, fill: muted })}
  ${text({ x: 11280, y: 7245, value: "无声之地，可起惊雷；平凡之处，淬炼非凡。", size: 42, weight: 900, anchor: "end" })}
</svg>`;

fs.writeFileSync(svgPath, svg);
await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(pngPath);
await sharp(pngPath).jpeg({ quality: 89, mozjpeg: true }).toFile(jpgPath);
await sharp(pngPath).resize({ width: 3000 }).jpeg({ quality: 87, mozjpeg: true }).toFile(previewPath);

console.log(JSON.stringify({ svgPath, pngPath, jpgPath, previewPath, width: W, height: H }, null, 2));
