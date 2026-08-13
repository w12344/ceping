const pptxgen = require("/Users/chenpan/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/pptxgenjs");

const pptx = new pptxgen();
pptx.layout = "LAYOUT_WIDE";
pptx.author = "Codex";
pptx.subject = "FTH职业特质测评-小凡";
pptx.title = "FTH职业特质测评-小凡";
pptx.company = "非凡教育";
pptx.lang = "zh-CN";
pptx.theme = { headFontFace: "PingFang SC", bodyFontFace: "PingFang SC", lang: "zh-CN" };
pptx.defineLayout({ name: "CUSTOM_WIDE", width: 13.333, height: 7.5 });
pptx.layout = "CUSTOM_WIDE";

const C = {
  bg: "0B1220",
  panel: "172033",
  panel2: "101827",
  ink: "F8FAFC",
  muted: "CBD5E1",
  faint: "94A3B8",
  line: "334155",
  fighter: "F97316",
  fighter2: "EF4444",
  thinker: "60A5FA",
  thinker2: "8B5CF6",
  helper: "22C55E",
  helper2: "14B8A6",
  gold: "FACC15",
};

const types = [
  {
    cn: "冲刺型", en: "Runner", parent: "进取者 Fighter", color: C.fighter, mark: "R",
    one: "在明确目标下快速行动、快速反馈、快速拿结果。",
    carry: "招生冲刺、市场活动、社群增长、短期项目推进、转化节点跟进",
    jobs: "用户运营部市场、招生/转化活动、社群增长、用户运营部顾问、短期项目推进、活动执行、渠道拓展",
    strengths: ["能把机会窗口快速转成动作", "适合目标明确、节奏紧的任务", "能带动团队从讨论进入行动"],
    risks: ["容易重速度、轻复盘", "对慢节奏协同耐心不足", "目标频繁变化时容易消耗"],
    grow: "把每次冲刺沉淀成可复制打法：复盘、节奏管理、关键动作清单。",
  },
  {
    cn: "攻坚型", en: "Climber", parent: "进取者 Fighter", color: C.fighter2, mark: "C",
    one: "面对困难不退，能在阻力中持续推进、拿下硬仗。",
    carry: "重点用户转化、续费攻坚、复杂客户沟通、投诉处理、关键项目推进",
    jobs: "用户运营部顾问、重点用户转化、复杂客户沟通、投诉/危机处理、重点项目攻坚、续费/转介绍推进",
    strengths: ["抗压和韧性强", "适合关键用户和复杂场景", "能在局面卡住时顶上去"],
    risks: ["可能过度硬扛", "长期高压容易透支", "容易忽略资源协同"],
    grow: "从个人硬冲升级为资源整合：拆路径、拉盟友、分阶段攻克。",
  },
  {
    cn: "分析型", en: "Analyzer", parent: "思辨者 Thinker", color: C.thinker, mark: "A",
    one: "能从复杂信息中找到规律、根因和更可靠的判断。",
    carry: "用户分析、学情分析、经营分析、转化复盘、课程效果评估、流程诊断",
    jobs: "用户数据分析、学情分析、转化/续费分析、经营分析、用户研究、课程效果评估、流程诊断",
    strengths: ["能把混乱问题结构化", "帮助组织少凭感觉决策", "能识别关键变量和优先级"],
    risks: ["可能想得深但行动慢", "过度追求确定性", "表达太理性时不易被听见"],
    grow: "把分析变成决策建议：结论、依据、优先级、下一步动作。",
  },
  {
    cn: "创构型", en: "Builder", parent: "思辨者 Thinker", color: C.thinker2, mark: "B",
    one: "把想法搭成可运转的课程、系统、机制或方法论。",
    carry: "课程体系、教研机制、运营体系、知识库、培训体系、用户成长路径",
    jobs: "课程体系设计、教研/培训体系、运营体系搭建、知识库建设、SOP 设计、用户成长路径设计、组织机制设计",
    strengths: ["能从零到一搭东西", "把经验沉淀为系统能力", "关注扩展性和长期效率"],
    risks: ["可能过度理想化", "容易低估落地成本", "对重复执行兴趣不足"],
    grow: "持续贴近真实用户和一线业务现场，让设计被使用、被验证、被迭代。",
  },
  {
    cn: "人际型", en: "Socializer", parent: "赋能者 Helper", color: C.helper, mark: "S",
    one: "理解人、连接人、激发人，让团队更愿意一起完成事情。",
    carry: "用户沟通、家校沟通、老师/教练支持、员工关系、跨部门协调",
    jobs: "老师、教练、用户运营部顾问、HRBP、家校沟通、社群运营、培训、员工关系、跨部门协调",
    strengths: ["共情和沟通敏感度高", "擅长协调冲突、恢复连接", "能营造安全感和投入感"],
    risks: ["可能过度照顾感受", "强冲突场景不够果断", "容易承担过多情绪劳动"],
    grow: "建立边界和结果意识：不是无限满足，而是帮助他人更成熟。",
  },
  {
    cn: "流程型", en: "Keeper", parent: "赋能者 Helper", color: C.helper2, mark: "K",
    one: "维护秩序、流程和细节，让组织稳定、可靠、长期运转。",
    carry: "教务排课、班务管理、流程运营、质量管理、交付管理、档案数据管理",
    jobs: "教务、排课/班务管理、流程运营、质量管理、交付管理、HRBP 运营支持、人事行政、数据/档案管理",
    strengths: ["发现流程漏洞并补上", "保障交付质量和节奏", "让协作从靠人变成靠机制"],
    risks: ["可能灵活性不足", "面对模糊变化会不适应", "流程若脱离目标会变成负担"],
    grow: "理解流程背后的业务目的：减少混乱、提升效率、保障结果。",
  },
];

function bg(slide, n) {
  slide.background = { color: C.bg };
  slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 13.333, h: 7.5, fill: { color: C.bg }, line: { color: C.bg } });
  slide.addShape(pptx.ShapeType.arc, { x: 9.8, y: -1.1, w: 4.6, h: 4.6, adjustPoint: 0.22, line: { color: C.thinker, transparency: 82, width: 1.2 }, fill: { color: C.thinker, transparency: 96 } });
  slide.addShape(pptx.ShapeType.rect, { x: 0.72, y: 6.78, w: 11.9, h: 0.01, fill: { color: C.line }, line: { color: C.line, transparency: 50 } });
  slide.addText(String(n + 1).padStart(2, "0"), { x: 12.02, y: 6.72, w: 0.55, h: 0.18, fontFace: "PingFang SC", fontSize: 9, color: C.faint, align: "right", margin: 0 });
}

function text(slide, value, x, y, w, h, opt = {}) {
  slide.addText(value, {
    x, y, w, h,
    fontFace: "PingFang SC",
    fontSize: opt.size || 15,
    bold: !!opt.bold,
    color: opt.color || C.muted,
    align: opt.align || "left",
    valign: opt.valign || "mid",
    fit: opt.fit || "shrink",
    margin: opt.margin ?? 0.04,
    paraSpaceAfterPt: 0,
  });
}

function title(slide, n, eyebrow, heading, sub) {
  bg(slide, n);
  if (eyebrow) text(slide, eyebrow, 0.75, 0.44, 7.8, 0.28, { size: 10, color: C.faint, bold: true });
  text(slide, heading, 0.72, eyebrow ? 0.84 : 0.58, 9.9, 0.62, { size: 26, color: C.ink, bold: true });
  if (sub) text(slide, sub, 0.75, 1.43, 9.4, 0.38, { size: 14, color: C.muted });
}

function card(slide, x, y, w, h, color = C.line, fill = C.panel) {
  slide.addShape(pptx.ShapeType.roundRect, { x, y, w, h, rectRadius: 0.08, fill: { color: fill, transparency: 5 }, line: { color, transparency: 45, width: 1 } });
}

function bubble(slide, label, x, y, color, size = 0.58) {
  slide.addShape(pptx.ShapeType.ellipse, { x, y, w: size, h: size, fill: { color, transparency: 86 }, line: { color, transparency: 40, width: 1.1 } });
  text(slide, label, x + size * 0.18, y + size * 0.1, size * 0.64, size * 0.64, { size: 18, color, bold: true, align: "center" });
}

function pill(slide, value, x, y, w, color) {
  slide.addShape(pptx.ShapeType.roundRect, { x, y, w, h: 0.34, rectRadius: 0.08, fill: { color, transparency: 84 }, line: { color, transparency: 45, width: 1 } });
  text(slide, value, x + 0.08, y + 0.07, w - 0.16, 0.16, { size: 9.5, color, bold: true, align: "center" });
}

function bullets(slide, items, x, y, w, color = C.muted, size = 12.2, gap = 0.35) {
  items.forEach((item, i) => {
    const yy = y + i * gap;
    slide.addShape(pptx.ShapeType.ellipse, { x, y: yy + 0.09, w: 0.06, h: 0.06, fill: { color }, line: { color } });
    text(slide, item, x + 0.16, yy, w - 0.16, 0.24, { size, color });
  });
}

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
  finder(3, 3); finder(size - 4, 3); finder(3, size - 4);
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

  const bytes = Array.from(Buffer.from(url, 'utf8'));
  let bits = [];
  const appendBits = (val, len) => { for (let i = len - 1; i >= 0; i -= 1) bits.push((val >>> i) & 1); };
  appendBits(0x4, 4);
  appendBits(bytes.length, 8);
  bytes.forEach(b => appendBits(b, 8));
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
    div.forEach((coef, i) => { rem[i] ^= gfMul(coef, factor); });
  });
  const all = data.concat(rem);
  const dataBits = [];
  all.forEach(b => appendDataBits(b, 8));
  function appendDataBits(val, len) { for (let i = len - 1; i >= 0; i -= 1) dataBits.push((val >>> i) & 1); }

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

function drawQr(slide, url, x, y, size) {
  const matrix = qrMatrixForUrl(url);
  const n = matrix.length;
  const cell = size / n;
  slide.addShape(pptx.ShapeType.rect, { x, y, w: size, h: size, fill: { color: "FFFFFF" }, line: { color: C.ai, width: 1.4 } });
  const pad = cell * 1.4;
  const inner = size - pad * 2;
  const c = inner / n;
  matrix.forEach((row, r) => row.forEach((dark, col) => {
    if (dark) slide.addShape(pptx.ShapeType.rect, { x: x + pad + col * c, y: y + pad + r * c, w: c * 1.04, h: c * 1.04, fill: { color: "111827" }, line: { color: "111827", transparency: 100 } });
  }));
}


function addSelectionStandard() {
  const slide = pptx.addSlide();
  bg(slide, 0);
  slide.addShape(pptx.ShapeType.rect, { x: 0.72, y: 0.58, w: 8.95, h: 0.78, fill: { color: "3A3036" }, line: { color: "3A3036" } });
  slide.addShape(pptx.ShapeType.chevron, { x: 9.32, y: 0.58, w: 1.35, h: 0.78, rotate: 0, fill: { color: C.gold }, line: { color: C.gold } });
  slide.addShape(pptx.ShapeType.rect, { x: 10.02, y: 0.58, w: 2.4, h: 0.78, fill: { color: C.gold }, line: { color: C.gold } });
  bubble(slide, "✓", 0.98, 0.72, C.gold, 0.38);
  text(slide, "选人三角形标准", 1.45, 0.76, 4.2, 0.34, { size: 25, color: C.gold, bold: true });

  const cx = 4.4;
  slide.addShape(pptx.ShapeType.triangle, { x: cx - 0.55, y: 1.78, w: 1.1, h: 1.16, fill: { color: "FFD600" }, line: { color: "FFD600" } });
  slide.addShape(pptx.ShapeType.trapezoid, { x: cx - 1.25, y: 3.16, w: 2.5, h: 1.0, fill: { color: "F8B400" }, line: { color: "F8B400" } });
  slide.addShape(pptx.ShapeType.trapezoid, { x: cx - 1.95, y: 4.45, w: 3.9, h: 1.0, fill: { color: "E9A400" }, line: { color: "E9A400" } });

  const labels = [
    ["技能", "决定个人价值与薪酬水平，需要持续提升", 5.65, 2.12],
    ["特质", "岗位适配性：如顾问需目标感强、教练需热爱育人", 6.2, 3.45],
    ["底色", "价值观、世界观：决定是否适配公司，优先选择同频者", 6.75, 4.76],
  ];
  labels.forEach(([h, b, x, y], i) => {
    const color = [C.gold, C.fighter, C.helper][i];
    slide.addShape(pptx.ShapeType.roundRect, { x: x - 0.18, y: y - 0.1, w: 4.55, h: 0.72, rectRadius: 0.08, fill: { color: "FFFFFF", transparency: 92 }, line: { color: C.line, transparency: 70 } });
    text(slide, h, x, y, 1.05, 0.28, { size: 21, color: C.ink, bold: true });
    text(slide, b, x + 1.05, y + 0.03, 3.15, 0.24, { size: 11.6, color: C.muted });
    slide.addShape(pptx.ShapeType.line, { x: x - 0.95 - i * 0.55, y: y + 0.27, w: 0.75 + i * 0.55, h: 0, line: { color, transparency: 20, width: 1.2 } });
  });

  card(slide, 0.88, 6.02, 11.0, 0.56, C.gold, C.panel2);
  text(slide, "我们之前已经做过底色相关培训，这次重点展开的是“特质”：看见一个人更自然的工作方式，以及他更适合在哪类岗位和任务中发挥价值。", 1.12, 6.14, 10.45, 0.24, { size: 13, color: C.muted, align: "center" });
}

function addCover() {
  const slide = pptx.addSlide();
  bg(slide, 1);
  bubble(slide, "F", 0.72, 0.72, C.fighter, 0.62);
  bubble(slide, "T", 1.52, 0.72, C.thinker, 0.62);
  bubble(slide, "H", 2.32, 0.72, C.helper, 0.62);
  text(slide, "FTH职业特质测评-小凡", 0.72, 1.72, 9.5, 0.78, { size: 34, color: C.ink, bold: true });
  text(slide, "面向用户运营、老师、教练、教务、HRBP 等团队岗位", 0.76, 2.62, 9.4, 0.38, { size: 19, color: C.gold, bold: true });
  text(slide, "用三大特质与六大分型，帮助员工识别优势、理解差异、优化协作、找到更合适的岗位与成长路径。", 0.76, 3.22, 9.2, 0.58, { size: 16, color: C.muted });
  pill(slide, "用户增长", 0.76, 4.18, 1.15, C.fighter);
  pill(slide, "课程与分析", 2.07, 4.18, 1.25, C.thinker);
  pill(slide, "教务与赋能", 3.48, 4.18, 1.25, C.helper);
  pill(slide, "岗位建议", 4.89, 4.18, 1.15, C.gold);
  text(slide, "非凡教育团队宣讲版｜岗位建议统一版", 0.76, 6.08, 4.6, 0.28, { size: 13, color: C.faint });
}

function addWhy() {
  const slide = pptx.addSlide();
  title(slide, 2, "WHY", "教育团队更需要看见“人”的工作方式", "同样是服务用户和推动结果，不同岗位需要不同的能量来源、判断方式和协作方式。");
  [
    ["用户转化更依赖节奏", "市场、顾问、社群和续费场景，需要有人快速行动、持续推进。", "→", C.fighter],
    ["教学服务更依赖判断", "学情、用户需求、课程效果和经营数据，需要有人拆解和判断。", "∑", C.thinker],
    ["长期交付更依赖稳定", "老师、教练、教务、HRBP 都在帮助人和系统更好地运转。", "✓", C.helper],
    ["岗位匹配不是贴标签", "测评用于发展对话，让人更好地理解自己适合在哪些场景发力。", "◎", C.gold],
  ].forEach(([h, b, ic, color], i) => {
    const x = 0.76 + (i % 2) * 5.86;
    const y = 2.35 + Math.floor(i / 2) * 1.75;
    card(slide, x, y, 5.3, 1.25, color);
    bubble(slide, ic, x + 0.26, y + 0.3, color, 0.54);
    text(slide, h, x + 1.05, y + 0.27, 3.1, 0.3, { size: 17, color: C.ink, bold: true });
    text(slide, b, x + 1.05, y + 0.68, 3.65, 0.38, { size: 12, color: C.muted });
  });
}

function addFramework() {
  const slide = pptx.addSlide();
  title(slide, 3, "FRAMEWORK", "三大特质对应教育团队的三种核心能力", "不是判断谁更好，而是识别每个人更自然的贡献方式。");
  [
    ["进取者", "Fighter / 结果推进力", "让目标进入真实行动：招生转化、活动推进、关键问题攻坚。", C.fighter, "F"],
    ["思辨者", "Thinker / 结构判断力", "把复杂问题想清楚：用户分析、课程体系、方法沉淀。", C.thinker, "T"],
    ["赋能者", "Helper / 服务协同力", "让人和流程更稳定：老师教练支持、教务流程、HRBP 赋能。", C.helper, "H"],
  ].forEach(([cn, en, desc, color, ic], i) => {
    const x = 0.76 + i * 4.02;
    card(slide, x, 2.42, 3.45, 2.88, color);
    bubble(slide, ic, x + 0.28, 2.73, color, 0.6);
    text(slide, cn, x + 0.28, 3.5, 1.9, 0.35, { size: 20, color: C.ink, bold: true });
    text(slide, en, x + 0.28, 3.9, 2.75, 0.24, { size: 11.3, color, bold: true });
    text(slide, desc, x + 0.28, 4.4, 2.76, 0.6, { size: 12.2, color: C.muted });
  });
}

function addMap() {
  const slide = pptx.addSlide();
  title(slide, 4, "MAP", "六大分型：教育公司里的六种贡献模式", "三大特质决定底层驱动力，六大分型帮助识别更具体的岗位建议。");
  [
    ["推进结果", C.fighter, ["Runner", "Climber"], "F"],
    ["构建认知", C.thinker, ["Analyzer", "Builder"], "T"],
    ["赋能系统", C.helper, ["Socializer", "Keeper"], "H"],
  ].forEach(([name, color, ens, ic], gi) => {
    const x = 1.28 + gi * 3.78;
    bubble(slide, ic, x + 0.73, 2.3, color, 0.78);
    text(slide, name, x, 3.38, 2.2, 0.3, { size: 19, color: C.ink, bold: true, align: "center" });
    ens.forEach((en, i) => {
      const t = types.find((v) => v.en === en);
      card(slide, x + i * 1.28, 4.28, 1.04, 0.92, t.color);
      text(slide, t.cn, x + 0.09 + i * 1.28, 4.45, 0.86, 0.2, { size: 12.6, color: C.ink, bold: true, align: "center" });
      text(slide, t.en, x + 0.09 + i * 1.28, 4.74, 0.86, 0.18, { size: 9, color: t.color, bold: true, align: "center" });
    });
  });
}

function addAttribute(n, cfg) {
  const slide = pptx.addSlide();
  title(slide, n, cfg.eyebrow, cfg.title, cfg.sub);
  bubble(slide, cfg.icon, 10.42, 0.84, cfg.color, 0.88);
  text(slide, cfg.claim, 0.76, 2.15, 6.3, 0.42, { size: 22, color: cfg.color, bold: true });
  text(slide, cfg.body, 0.78, 2.9, 6.3, 0.78, { size: 14.3, color: C.muted });
  bullets(slide, cfg.points, 0.8, 4.35, 6.2, C.muted, 12.4, 0.36);
  cfg.types.forEach((en, i) => {
    const t = types.find((v) => v.en === en);
    const x = 7.92 + i * 1.98;
    card(slide, x, 3.0, 1.68, 2.05, t.color);
    text(slide, t.cn, x + 0.2, 3.28, 1.15, 0.25, { size: 17, color: C.ink, bold: true });
    text(slide, t.en, x + 0.2, 3.68, 1.15, 0.2, { size: 11, color: t.color, bold: true });
    text(slide, t.one, x + 0.2, 4.1, 1.18, 0.5, { size: 10.2, color: C.muted });
  });
}

function addType(n, t) {
  const slide = pptx.addSlide();
  title(slide, n, t.parent, `${t.cn} ${t.en}`, t.one);
  bubble(slide, t.mark, 10.55, 0.72, t.color, 0.9);
  t.strengths.slice(0, 3).forEach((k, i) => pill(slide, k.replace(/，.*/, ""), 0.76 + i * 1.55, 2.03, 1.38, t.color));

  card(slide, 0.76, 2.7, 5.55, 1.48, t.color);
  text(slide, "适合承担", 1.0, 2.92, 1.7, 0.25, { size: 15.5, color: C.ink, bold: true });
  text(slide, t.carry, 1.0, 3.28, 4.75, 0.48, { size: 12.2, color: C.muted });

  card(slide, 6.74, 2.7, 5.55, 1.48, t.color);
  text(slide, "岗位建议", 6.98, 2.92, 1.7, 0.25, { size: 15.5, color: C.ink, bold: true });
  text(slide, t.jobs, 6.98, 3.26, 4.78, 0.58, { size: 11.1, color: C.muted });

  card(slide, 0.76, 4.55, 5.55, 1.34, t.color);
  text(slide, "需要留意", 1.0, 4.76, 1.7, 0.25, { size: 15.5, color: C.ink, bold: true });
  bullets(slide, t.risks, 1.0, 5.08, 4.7, C.muted, 11.2, 0.3);

  card(slide, 6.74, 4.55, 5.55, 1.34, C.gold);
  text(slide, "成长提醒", 6.98, 4.76, 1.9, 0.25, { size: 15.5, color: C.ink, bold: true });
  text(slide, t.grow, 6.98, 5.12, 4.72, 0.44, { size: 12.2, color: C.muted });
}

function addTeamPlaybook() {
  const slide = pptx.addSlide();
  title(slide, 14, "COLLABORATION", "最强团队不是同类相加，而是三种能力互补", "Fighter 打开增长和推进，Thinker 判断方向和方法，Helper 托住服务与系统。");
  [
    ["用户触达与转化", "Runner 推活动\nClimber 攻重点用户", C.fighter, "Step 01"],
    ["课程与服务设计", "Analyzer 看数据\nBuilder 搭体系", C.thinker, "Step 02"],
    ["长期交付与成长", "Keeper 守流程\nSocializer 促信任", C.helper, "Step 03"],
  ].forEach(([h, b, color, step], i) => {
    const x = 0.94 + i * 3.9;
    card(slide, x, 2.52, 3.22, 2.45, color);
    text(slide, step, x + 0.24, 2.82, 1.1, 0.2, { size: 10.4, color, bold: true });
    text(slide, h, x + 0.24, 3.22, 2.45, 0.32, { size: 19, color: C.ink, bold: true });
    text(slide, b, x + 0.24, 3.86, 2.45, 0.72, { size: 15.2, color: C.muted });
  });
  text(slide, "好团队不是所有人都一样强，而是关键任务上有人推进、有人判断、有人托底。", 1.48, 5.86, 10.1, 0.38, { size: 18, color: C.ink, bold: true, align: "center" });
}

function addAssessmentIntro() {
  const slide = pptx.addSlide();
  const assessmentUrl = "https://test.msrtai.com/";
  title(slide, 15, "ASSESSMENT", "FTH职业特质测评-小凡", "完成测评后，用主分型、次分型、第三倾向开启岗位建议和成长对话。");
  card(slide, 0.86, 2.28, 6.3, 2.9, C.gold);
  text(slide, "测评怎么读", 1.16, 2.6, 2.2, 0.34, { size: 20, color: C.ink, bold: true });
  bullets(slide, [
    "主分型：用于判断首选岗位方向",
    "次分型：用于判断复合岗位和工作风格",
    "第三倾向：用于判断补充能力、协作角色和培养方向",
    "结果不用于给人贴标签，只用于发展对话和团队搭配",
  ], 1.18, 3.15, 5.25, C.muted, 12.8, 0.42);
  card(slide, 7.78, 2.18, 3.5, 3.55, C.gold, C.panel2);
  drawQr(slide, assessmentUrl, 8.22, 2.48, 2.62);
  text(slide, "扫码开始测评", 7.92, 5.52, 3.18, 0.22, { size: 12, color: C.gold, bold: true, align: "center" });
  text(slide, assessmentUrl, 1.0, 6.08, 10.9, 0.26, { size: 12, color: C.faint, align: "center" });
  text(slide, "建议现场完成后，以主分型、次分型、第三倾向作为岗位建议和团队搭配的讨论起点。", 1.0, 6.42, 10.9, 0.24, { size: 10.5, color: C.faint, align: "center" });
}
function addSimonFormula() {
  const slide = pptx.addSlide();
  title(slide, 16, "LEARNING METHOD", "西蒙学习法：有效学习的三个要素", "特质测评帮助我们看见适合的发力方式，学习法帮助我们把优势持续练出来。");

  card(slide, 3.55, 1.92, 6.24, 0.78, C.thinker, C.panel2);
  text(slide, "西蒙学习法", 3.75, 2.08, 5.84, 0.32, { size: 22, color: C.ink, bold: true, align: "center" });
  text(slide, "=", 6.35, 2.85, 0.6, 0.42, { size: 34, color: C.ink, bold: true, align: "center" });

  const factors = [
    ["积极的\n学习动机", C.thinker, "愿意学，是启动学习的第一推动力。"],
    ["有效的\n学习方法", C.gold, "会学，能让努力转化为真实进步。"],
    ["必要的\n时间投入", C.helper, "持续投入，才能让能力稳定长出来。"],
  ];
  factors.forEach(([label, color, desc], i) => {
    const x = 1.15 + i * 4.05;
    slide.addShape(pptx.ShapeType.ellipse, { x, y: 3.55, w: 2.15, h: 2.15, fill: { color, transparency: 10 }, line: { color: "111827", width: 1.4 } });
    text(slide, label, x + 0.22, 4.05, 1.72, 0.68, { size: 19, color: "111827", bold: true, align: "center" });
    text(slide, desc, x - 0.25, 5.88, 2.65, 0.38, { size: 11.5, color: C.muted, align: "center" });
    if (i < 2) text(slide, "×", x + 2.6, 4.18, 0.5, 0.5, { size: 34, color: C.ink, bold: true, align: "center" });
  });

  card(slide, 1.25, 6.42, 10.65, 0.45, C.thinker2, C.panel2);
  text(slide, "学习效果不是单点决定的：有动机、有方法、有时间，三者相乘，才会产生持续成长。", 1.5, 6.52, 10.15, 0.2, { size: 12.5, color: C.muted, align: "center" });
}

function addSimonSteps() {
  const slide = pptx.addSlide();
  title(slide, 17, "IMPLEMENTATION", "实施学习法的 4 个步骤", "从选择开始，到目标、拆分和集中，形成一套可执行的学习闭环。");

  const steps = [
    ["01", "做选择", "先选定真正值得投入的学习主题，减少分散消耗。", C.fighter],
    ["02", "设目标", "把学习变成清晰目标：学到什么、做到什么、何时完成。", C.gold],
    ["03", "会拆分", "把大目标拆成小模块、小任务、小反馈，降低启动难度。", C.thinker],
    ["04", "能集中", "留出不被打扰的时间块，集中注意力完成关键练习。", C.helper],
  ];

  steps.forEach(([num, h, body, color], i) => {
    const y = 1.95 + i * 1.08;
    card(slide, 1.25, y, 10.7, 0.82, color, C.panel);
    slide.addShape(pptx.ShapeType.roundRect, { x: 1.55, y: y + 0.17, w: 0.72, h: 0.48, rectRadius: 0.08, fill: { color, transparency: 0 }, line: { color, transparency: 0 } });
    text(slide, num, 1.68, y + 0.28, 0.46, 0.16, { size: 11.5, color: "111827", bold: true, align: "center" });
    text(slide, h, 2.55, y + 0.2, 1.35, 0.28, { size: 20, color: C.ink, bold: true });
    text(slide, body, 4.08, y + 0.22, 6.85, 0.24, { size: 13.4, color: C.muted });
  });

  card(slide, 1.25, 6.38, 10.7, 0.5, C.gold, C.panel2);
  text(slide, "这 4 步可以作为员工后续成长计划的通用方法：选择方向、设定目标、拆解路径、集中训练。", 1.55, 6.5, 10.1, 0.2, { size: 12.5, color: C.muted, align: "center" });
}

addSelectionStandard();
addCover();
addWhy();
addFramework();
addMap();
addAttribute(5, {
  eyebrow: "ATTRIBUTE 01", title: "进取者 Fighter", sub: "为结果而战的人：目标、行动、突破、竞争、结果。",
  icon: "F", color: C.fighter, claim: "组织的结果推进力",
  body: "他们喜欢把事情推向真实战场，在压力和目标中被激发。适合招生转化、市场活动、关键推进和复杂问题攻坚。",
  points: ["目标越清晰，战斗力越强", "不等条件完美，先行动起来", "需要用复盘和资源协同提升上限"],
  types: ["Runner", "Climber"],
});
addType(6, types[0]);
addType(7, types[1]);
addAttribute(8, {
  eyebrow: "ATTRIBUTE 02", title: "思辨者 Thinker", sub: "用认知改变结果的人：分析、结构、洞察、创造、系统。",
  icon: "T", color: C.thinker, claim: "组织的结构判断力",
  body: "他们关注问题背后的逻辑和规律，依靠判断、建模、设计和创造产生价值。",
  points: ["把复杂问题变清楚", "把一次经验变成方法和系统", "需要用真实业务反馈校准思考"],
  types: ["Analyzer", "Builder"],
});
addType(9, types[2]);
addType(10, types[3]);
addAttribute(11, {
  eyebrow: "ATTRIBUTE 03", title: "赋能者 Helper", sub: "让人和系统更好运转的人：连接、支持、协调、稳定、成长。",
  icon: "H", color: C.helper, claim: "组织的服务协同力",
  body: "他们的价值不只体现在个人产出上，更体现在帮助他人变强、让团队更稳、让组织更顺畅。",
  points: ["让人愿意一起完成事情", "把协作从靠感觉变成靠机制", "需要边界感和业务目标牵引"],
  types: ["Socializer", "Keeper"],
});
addType(12, types[4]);
addType(13, types[5]);
addTeamPlaybook();
addAssessmentIntro();
addSimonFormula();
addSimonSteps();

pptx.writeFile({ fileName: "/Users/chenpan/Documents/Codex/2026-06-09/fighter-runner-climber-thinker-analyzer-builder/outputs/FTH职业特质测评-小凡.pptx" });
