const fs = require("fs");
const path = require("path");

const OUT = "/Users/chenpan/Documents/Codex/2026-06-09/fighter-runner-climber-thinker-analyzer-builder/outputs/FTH创业者职业特质测评-海报.svg";
const URL = "https://fthboss.msrtai.com";

function qrMatrixForUrl(url) {
  const version = 3;
  const size = 17 + version * 4;
  const dataCodewords = 44;
  const eccCodewords = 26;
  const modules = Array.from({ length: size }, () => Array(size).fill(false));
  const reserved = Array.from({ length: size }, () => Array(size).fill(false));
  const setFunc = (x, y, dark) => {
    if (x >= 0 && x < size && y >= 0 && y < size) {
      modules[y][x] = !!dark;
      reserved[y][x] = true;
    }
  };
  const getBit = (x, i) => ((x >>> i) & 1) !== 0;
  const finder = (cx, cy) => {
    for (let dy = -4; dy <= 4; dy += 1) {
      for (let dx = -4; dx <= 4; dx += 1) {
        const x = cx + dx;
        const y = cy + dy;
        const dist = Math.max(Math.abs(dx), Math.abs(dy));
        setFunc(x, y, dist !== 2 && dist !== 4);
      }
    }
  };
  finder(3, 3);
  finder(size - 4, 3);
  finder(3, size - 4);
  for (let i = 0; i < size; i += 1) {
    setFunc(6, i, i % 2 === 0);
    setFunc(i, 6, i % 2 === 0);
  }
  const align = (cx, cy) => {
    for (let dy = -2; dy <= 2; dy += 1) {
      for (let dx = -2; dx <= 2; dx += 1) {
        const dist = Math.max(Math.abs(dx), Math.abs(dy));
        setFunc(cx + dx, cy + dy, dist !== 1);
      }
    }
  };
  align(22, 22);
  setFunc(8, 4 * version + 9, true);

  const drawFormat = (mask) => {
    const data = mask;
    let rem = data;
    for (let i = 0; i < 10; i += 1) rem = (rem << 1) ^ (((rem >>> 9) & 1) * 0x537);
    const bits = ((data << 10) | rem) ^ 0x5412;
    for (let i = 0; i <= 5; i += 1) setFunc(8, i, getBit(bits, i));
    setFunc(8, 7, getBit(bits, 6));
    setFunc(8, 8, getBit(bits, 7));
    setFunc(7, 8, getBit(bits, 8));
    for (let i = 9; i < 15; i += 1) setFunc(14 - i, 8, getBit(bits, i));
    for (let i = 0; i < 8; i += 1) setFunc(size - 1 - i, 8, getBit(bits, i));
    for (let i = 8; i < 15; i += 1) setFunc(8, size - 15 + i, getBit(bits, i));
    setFunc(8, size - 8, true);
  };
  drawFormat(0);

  const bytes = Array.from(Buffer.from(url, "utf8"));
  let bits = [];
  const appendBits = (val, len) => {
    for (let i = len - 1; i >= 0; i -= 1) bits.push((val >>> i) & 1);
  };
  appendBits(0x4, 4);
  appendBits(bytes.length, 8);
  bytes.forEach((b) => appendBits(b, 8));
  const capacity = dataCodewords * 8;
  appendBits(0, Math.min(4, capacity - bits.length));
  while (bits.length % 8) bits.push(0);
  const data = [];
  for (let i = 0; i < bits.length; i += 8) data.push(bits.slice(i, i + 8).reduce((a, b) => (a << 1) | b, 0));
  for (let pad = 0xec; data.length < dataCodewords; pad ^= 0xfd) data.push(pad);

  const gfMul = (x, y) => {
    let z = 0;
    for (let i = 7; i >= 0; i -= 1) {
      z = (z << 1) ^ ((z >>> 7) * 0x11d);
      if (((y >>> i) & 1) !== 0) z ^= x;
    }
    return z & 0xff;
  };
  const divisor = (degree) => {
    const result = Array(degree).fill(0);
    result[degree - 1] = 1;
    let root = 1;
    for (let i = 0; i < degree; i += 1) {
      for (let j = 0; j < degree; j += 1) {
        result[j] = gfMul(result[j], root);
        if (j + 1 < degree) result[j] ^= result[j + 1];
      }
      root = gfMul(root, 2);
    }
    return result;
  };
  const div = divisor(eccCodewords);
  const rem = Array(eccCodewords).fill(0);
  data.forEach((b) => {
    const factor = b ^ rem.shift();
    rem.push(0);
    div.forEach((coef, i) => {
      rem[i] ^= gfMul(coef, factor);
    });
  });
  const all = data.concat(rem);
  const dataBits = [];
  all.forEach((b) => {
    for (let i = 7; i >= 0; i -= 1) dataBits.push((b >>> i) & 1);
  });

  let i = 0;
  for (let right = size - 1; right >= 1; right -= 2) {
    if (right === 6) right -= 1;
    for (let vert = 0; vert < size; vert += 1) {
      for (let j = 0; j < 2; j += 1) {
        const x = right - j;
        const upward = ((right + 1) & 2) === 0;
        const y = upward ? size - 1 - vert : vert;
        if (reserved[y][x]) continue;
        let dark = i < dataBits.length && dataBits[i] === 1;
        if ((x + y) % 2 === 0) dark = !dark;
        modules[y][x] = dark;
        i += 1;
      }
    }
  }
  return modules;
}

function qrSvg(x, y, size, url) {
  const matrix = qrMatrixForUrl(url);
  const n = matrix.length;
  const pad = size * 0.075;
  const inner = size - pad * 2;
  const c = inner / n;
  const rects = [];
  matrix.forEach((row, r) => row.forEach((dark, col) => {
    if (dark) rects.push(`<rect x="${(x + pad + col * c).toFixed(2)}" y="${(y + pad + r * c).toFixed(2)}" width="${(c * 1.02).toFixed(2)}" height="${(c * 1.02).toFixed(2)}" rx="1" fill="#111827"/>`);
  }));
  return `
    <rect x="${x}" y="${y}" width="${size}" height="${size}" rx="28" fill="#ffffff"/>
    <rect x="${x + 10}" y="${y + 10}" width="${size - 20}" height="${size - 20}" rx="22" fill="#ffffff" stroke="#facc15" stroke-width="3"/>
    ${rects.join("\n")}
  `;
}

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1440" viewBox="0 0 1080 1440">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#111827"/>
      <stop offset="0.58" stop-color="#0B1220"/>
      <stop offset="1" stop-color="#151C31"/>
    </linearGradient>
    <radialGradient id="glow1" cx="50%" cy="50%" r="50%">
      <stop offset="0" stop-color="#60A5FA" stop-opacity="0.34"/>
      <stop offset="1" stop-color="#60A5FA" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glow2" cx="50%" cy="50%" r="50%">
      <stop offset="0" stop-color="#FACC15" stop-opacity="0.28"/>
      <stop offset="1" stop-color="#FACC15" stop-opacity="0"/>
    </radialGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="18" stdDeviation="24" flood-color="#020617" flood-opacity="0.35"/>
    </filter>
  </defs>
  <rect width="1080" height="1440" fill="url(#bg)"/>
  <circle cx="895" cy="130" r="260" fill="url(#glow1)"/>
  <circle cx="155" cy="1270" r="260" fill="url(#glow2)"/>

  <g transform="translate(88 96)">
    <circle cx="32" cy="32" r="32" fill="#f9731624" stroke="#f9731688" stroke-width="2"/>
    <text x="32" y="42" text-anchor="middle" font-size="29" font-weight="800" fill="#f97316" font-family="PingFang SC, Noto Sans SC, Arial">F</text>
    <circle cx="112" cy="32" r="32" fill="#60a5fa24" stroke="#60a5fa88" stroke-width="2"/>
    <text x="112" y="42" text-anchor="middle" font-size="29" font-weight="800" fill="#60a5fa" font-family="PingFang SC, Noto Sans SC, Arial">T</text>
    <circle cx="192" cy="32" r="32" fill="#22c55e24" stroke="#22c55e88" stroke-width="2"/>
    <text x="192" y="42" text-anchor="middle" font-size="29" font-weight="800" fill="#22c55e" font-family="PingFang SC, Noto Sans SC, Arial">H</text>
  </g>

  <text x="88" y="250" font-size="72" font-weight="900" fill="#F8FAFC" font-family="PingFang SC, Noto Sans SC, Arial">FTH创业者职业特质测评</text>
  <text x="88" y="332" font-size="48" font-weight="850" fill="#FACC15" font-family="PingFang SC, Noto Sans SC, Arial">创始人 / 企业家专属版</text>
  <text x="88" y="410" font-size="29" fill="#CBD5E1" font-family="PingFang SC, Noto Sans SC, Arial">看见你的创业驱动力、决策方式与团队协作说明书</text>

  <g filter="url(#shadow)">
    <rect x="88" y="500" width="904" height="250" rx="26" fill="#172033" stroke="#334155" stroke-width="2"/>
    <g transform="translate(128 548)">
      <rect x="0" y="0" width="236" height="140" rx="18" fill="#f9731618" stroke="#f9731666"/>
      <text x="28" y="45" font-size="34" font-weight="850" fill="#F97316" font-family="PingFang SC, Noto Sans SC, Arial">Fighter</text>
      <text x="28" y="88" font-size="28" font-weight="700" fill="#F8FAFC" font-family="PingFang SC, Noto Sans SC, Arial">进取者</text>
      <text x="28" y="122" font-size="20" fill="#CBD5E1" font-family="PingFang SC, Noto Sans SC, Arial">破局 · 增长 · 拿结果</text>
    </g>
    <g transform="translate(422 548)">
      <rect x="0" y="0" width="236" height="140" rx="18" fill="#60a5fa18" stroke="#60a5fa66"/>
      <text x="28" y="45" font-size="34" font-weight="850" fill="#60A5FA" font-family="PingFang SC, Noto Sans SC, Arial">Thinker</text>
      <text x="28" y="88" font-size="28" font-weight="700" fill="#F8FAFC" font-family="PingFang SC, Noto Sans SC, Arial">思辨者</text>
      <text x="28" y="122" font-size="20" fill="#CBD5E1" font-family="PingFang SC, Noto Sans SC, Arial">判断 · 系统 · 产品</text>
    </g>
    <g transform="translate(716 548)">
      <rect x="0" y="0" width="236" height="140" rx="18" fill="#22c55e18" stroke="#22c55e66"/>
      <text x="28" y="45" font-size="34" font-weight="850" fill="#22C55E" font-family="PingFang SC, Noto Sans SC, Arial">Helper</text>
      <text x="28" y="88" font-size="28" font-weight="700" fill="#F8FAFC" font-family="PingFang SC, Noto Sans SC, Arial">赋能者</text>
      <text x="28" y="122" font-size="20" fill="#CBD5E1" font-family="PingFang SC, Noto Sans SC, Arial">组织 · 连接 · 长期</text>
    </g>
  </g>

  <g transform="translate(88 820)">
    <text x="0" y="0" font-size="32" font-weight="850" fill="#F8FAFC" font-family="PingFang SC, Noto Sans SC, Arial">你将获得</text>
    <g transform="translate(0 50)">
      <circle cx="16" cy="15" r="8" fill="#FACC15"/>
      <text x="40" y="24" font-size="27" fill="#CBD5E1" font-family="PingFang SC, Noto Sans SC, Arial">创业者三大特质排序：如 FTH / TFH / HFT</text>
    </g>
    <g transform="translate(0 104)">
      <circle cx="16" cy="15" r="8" fill="#FACC15"/>
      <text x="40" y="24" font-size="27" fill="#CBD5E1" font-family="PingFang SC, Noto Sans SC, Arial">六大创业者画像：主分型、次分型、第三倾向</text>
    </g>
    <g transform="translate(0 158)">
      <circle cx="16" cy="15" r="8" fill="#FACC15"/>
      <text x="40" y="24" font-size="27" fill="#CBD5E1" font-family="PingFang SC, Noto Sans SC, Arial">适合行业、团队使用说明书与最佳搭档建议</text>
    </g>
  </g>

  <g filter="url(#shadow)">
    <rect x="672" y="1032" width="320" height="314" rx="32" fill="#101827" stroke="#334155" stroke-width="2"/>
    ${qrSvg(727, 1064, 210, URL)}
    <text x="832" y="1302" text-anchor="middle" font-size="27" font-weight="850" fill="#FACC15" font-family="PingFang SC, Noto Sans SC, Arial">扫码开始测评</text>
    <text x="832" y="1334" text-anchor="middle" font-size="18" fill="#94A3B8" font-family="PingFang SC, Noto Sans SC, Arial">${URL}</text>
  </g>

  <rect x="88" y="1258" width="500" height="88" rx="22" fill="#172033" stroke="#334155"/>
  <text x="128" y="1298" font-size="24" font-weight="800" fill="#F8FAFC" font-family="PingFang SC, Noto Sans SC, Arial">适合创始人分享 / 合伙人沟通 / 团队复盘</text>
  <text x="128" y="1330" font-size="18" fill="#94A3B8" font-family="PingFang SC, Noto Sans SC, Arial">结果用于自我理解与协作沟通，不用于简单贴标签</text>
</svg>`;

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, svg);
console.log(OUT);
