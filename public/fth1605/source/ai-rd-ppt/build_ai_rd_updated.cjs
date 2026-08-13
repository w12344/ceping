const pptxgen = require("/Users/chenpan/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/pptxgenjs");

const pptx = new pptxgen();
pptx.layout = "LAYOUT_WIDE";
pptx.author = "Codex";
pptx.subject = "FTH职业特质测评-1605";
pptx.title = "FTH职业特质测评-1605";
pptx.company = "1605";
pptx.lang = "zh-CN";
pptx.theme = {
  headFontFace: "PingFang SC",
  bodyFontFace: "PingFang SC",
  lang: "zh-CN",
};
pptx.defineLayout({ name: "CUSTOM_WIDE", width: 13.333, height: 7.5 });
pptx.layout = "CUSTOM_WIDE";

const C = {
  bg: "0B1220",
  bg2: "111827",
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
  ai: "FACC15",
};

const types = [
  {
    cn: "冲刺型",
    en: "Runner",
    parent: "进取者 Fighter",
    color: C.fighter,
    role: "把研发节奏跑起来",
    one: "擅长快速验证、快速迭代、快速交付可用版本。",
    carry: "原型验证、AI Demo、需求快速响应、小步快跑迭代、版本冲刺",
    jobs: "AI 产品经理、增长运营、前端/全栈原型工程师、Demo 工程师、项目推进、售前支持、快速交付工程师",
    risks: ["容易跳过必要设计", "可能技术债积累较快", "需要有人帮忙沉淀复盘"],
    ai: "适合用 AI 快速生成方案、样例、脚手架和实验版本。",
  },
  {
    cn: "攻坚型",
    en: "Climber",
    parent: "进取者 Fighter",
    color: C.fighter2,
    role: "啃复杂难题的人",
    one: "擅长在不确定、阻力大、长期卡点的技术问题里持续推进。",
    carry: "性能瓶颈、疑难 Bug、复杂迁移、稳定性攻坚、跨系统联调",
    jobs: "技术负责人、后端核心工程师、性能优化工程师、复杂 Bug 攻坚、架构迁移负责人、重点客户交付负责人、SRE",
    risks: ["容易个人硬扛", "可能忽略协同节奏", "需要拆解路径和资源支持"],
    ai: "适合把 AI 当作排查助手、方案对比器和边界条件枚举器。",
  },
  {
    cn: "分析型",
    en: "Analyzer",
    parent: "思辨者 Thinker",
    color: C.thinker,
    role: "把问题看清楚",
    one: "擅长从业务、数据、日志和系统行为里找根因、建判断。",
    carry: "需求澄清、数据分析、故障归因、方案评审、指标体系、风险识别",
    jobs: "数据分析师、数据科学家、模型评测工程师、需求分析师、产品策略、故障分析、算法评估、用户研究",
    risks: ["容易分析过久", "输出若不转成决策会被低估", "需要明确时间盒"],
    ai: "适合用 AI 做信息整理、日志归纳、假设清单和方案反证。",
  },
  {
    cn: "创构型",
    en: "Builder",
    parent: "思辨者 Thinker",
    color: C.thinker2,
    role: "搭系统和平台的人",
    one: "擅长把想法搭成架构、平台、工具、框架和可复用能力。",
    carry: "架构设计、平台建设、工程工具、AI Agent 工作流、组件化和中台能力",
    jobs: "架构师、AI 平台工程师、MLOps 工程师、RAG 工程师、后端平台工程师、工具链工程师、Agent 工作流设计",
    risks: ["容易过度设计", "可能离真实使用场景太远", "需要持续贴近反馈"],
    ai: "适合设计 AI 工具链、提示词模板、评测框架和自动化研发流程。",
  },
  {
    cn: "人际型",
    en: "Socializer",
    parent: "赋能者 Helper",
    color: C.helper,
    role: "让人协作顺起来",
    one: "擅长在产品、研发、测试、业务之间建立理解和信任。",
    carry: "跨团队协作、需求翻译、冲突协调、用户沟通、伙伴支持、团队氛围",
    jobs: "AI 产品经理、客户成功、售前解决方案、实施顾问、培训师、HRBP、Scrum Master、跨部门项目协调",
    risks: ["容易承担过多沟通成本", "可能回避强冲突", "需要边界和决策机制"],
    ai: "适合把 AI 用于会议纪要、信息同步、知识问答和沟通材料整理。",
  },
  {
    cn: "流程型",
    en: "Keeper",
    parent: "赋能者 Helper",
    color: C.helper2,
    role: "守住质量和秩序",
    one: "擅长让研发流程、质量标准、交付节奏和知识资产稳定运转。",
    carry: "项目管理、质量体系、发布流程、知识库、测试规范、安全合规、运维协同",
    jobs: "QA 测试、AI 评测 QA、项目管理、DevOps、SRE、发布管理、合规安全、知识库运营、流程运营",
    risks: ["可能显得保守", "流程若脱离目标会增加负担", "需要理解业务优先级"],
    ai: "适合用 AI 做规范检查、测试生成、文档维护和发布清单校验。",
  },
];

function bg(slide, n) {
  slide.background = { color: C.bg };
  slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 13.333, h: 7.5, fill: { color: C.bg }, line: { color: C.bg } });
  slide.addShape(pptx.ShapeType.arc, { x: 9.8, y: -1.1, w: 4.6, h: 4.6, adjustPoint: 0.22, line: { color: C.thinker, transparency: 82, width: 1.2 }, fill: { color: C.thinker, transparency: 96 } });
  slide.addShape(pptx.ShapeType.rect, { x: 0.72, y: 6.78, w: 11.9, h: 0.01, fill: { color: C.line }, line: { color: C.line, transparency: 50 } });
  slide.addText(String(n).padStart(2, "0"), { x: 12.02, y: 6.72, w: 0.55, h: 0.18, fontFace: "PingFang SC", fontSize: 9, color: C.faint, align: "right", margin: 0 });
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
    breakLine: false,
    fit: opt.fit || "shrink",
    margin: opt.margin ?? 0.04,
    paraSpaceAfterPt: 0,
    breakLine: false,
  });
}

function title(slide, n, eyebrow, heading, sub) {
  bg(slide, n);
  if (eyebrow) text(slide, eyebrow, 0.75, 0.44, 7.8, 0.28, { size: 10, color: C.faint, bold: true });
  text(slide, heading, 0.72, eyebrow ? 0.84 : 0.58, 9.8, 0.62, { size: 26, color: C.ink, bold: true });
  if (sub) text(slide, sub, 0.75, 1.43, 9.3, 0.38, { size: 14, color: C.muted });
}

function card(slide, x, y, w, h, color = C.line, fill = C.panel) {
  slide.addShape(pptx.ShapeType.roundRect, {
    x, y, w, h,
    rectRadius: 0.08,
    fill: { color: fill, transparency: 5 },
    line: { color, transparency: 45, width: 1 },
  });
}

function iconBubble(slide, icon, x, y, color, size = 0.58) {
  slide.addShape(pptx.ShapeType.ellipse, { x, y, w: size, h: size, fill: { color, transparency: 86 }, line: { color, transparency: 40, width: 1.1 } });
  text(slide, icon, x + size * 0.18, y + size * 0.1, size * 0.64, size * 0.64, { size: 20, color, bold: true, align: "center" });
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

function addCover() {
  const slide = pptx.addSlide();
  bg(slide, 1);
  iconBubble(slide, "AI", 5.34, 0.72, C.ai, 0.62);
  iconBubble(slide, "</>", 6.14, 0.72, C.thinker, 0.62);
  iconBubble(slide, "FTH", 6.94, 0.72, C.helper, 0.62);
  text(slide, "FTH职业特质测评-1605", 0.72, 1.72, 9.5, 0.78, { size: 34, color: C.ink, bold: true });
  text(slide, "AI 研发团队的人才三大特质与六大分型", 0.76, 2.62, 8.8, 0.38, { size: 19, color: C.ai, bold: true });
  text(slide, "把人放进合适的岗位、协作位置和成长路径里，让 AI 能力真正转化为团队产能。", 0.76, 3.22, 8.9, 0.58, { size: 16, color: C.muted });
  pill(slide, "研发交付", 0.76, 4.18, 1.15, C.fighter);
  pill(slide, "技术判断", 2.07, 4.18, 1.15, C.thinker);
  pill(slide, "工程赋能", 3.38, 4.18, 1.15, C.helper);
  pill(slide, "岗位建议", 4.69, 4.18, 1.15, C.ai);
  text(slide, "软件研发团队宣讲版｜岗位建议统一版", 0.76, 6.08, 4.2, 0.28, { size: 13, color: C.faint });
}

function addWhy() {
  const slide = pptx.addSlide();
  title(slide, 2, "WHY", "AI 研发团队更需要看见“人”的结构", "AI 提高了单点产出，但团队真正的瓶颈仍然在判断、协作、质量和系统化。");
  [
    ["AI 让个体更快", "但更快不等于方向更准，需要有人判断问题、边界和优先级。", "⚡", C.ai],
    ["研发任务更复合", "同一件事里同时有需求、架构、数据、模型、测试、发布和运维。", "⌘", C.thinker],
    ["协作成本更隐形", "提示词、上下文、代码评审、模型输出质量，都需要共享标准。", "↔", C.helper],
    ["人才不是一种模板", "有人适合冲刺验证，有人适合系统设计，有人适合守住流程质量。", "◎", C.fighter],
  ].forEach(([h, b, ic, color], i) => {
    const x = 0.76 + (i % 2) * 5.86;
    const y = 2.35 + Math.floor(i / 2) * 1.75;
    card(slide, x, y, 5.3, 1.25, color);
    iconBubble(slide, ic, x + 0.26, y + 0.3, color, 0.54);
    text(slide, h, x + 1.05, y + 0.27, 2.9, 0.3, { size: 17, color: C.ink, bold: true });
    text(slide, b, x + 1.05, y + 0.68, 3.65, 0.38, { size: 12, color: C.muted });
  });
}

function addFramework() {
  const slide = pptx.addSlide();
  title(slide, 3, "FRAMEWORK", "三大特质对应研发团队的三种核心能力", "不是给人贴标签，而是识别每个人更自然的贡献方式。");
  [
    ["进取者", "Fighter / 交付推进力", "让想法进入真实环境：快速验证、推进版本、突破卡点。", C.fighter, "→"],
    ["思辨者", "Thinker / 技术判断力", "把复杂问题想清楚：分析根因、设计系统、建立方法。", C.thinker, "∑"],
    ["赋能者", "Helper / 工程赋能力", "让团队稳定变强：连接协作、维护流程、沉淀标准。", C.helper, "✓"],
  ].forEach(([cn, en, desc, color, ic], i) => {
    const x = 0.76 + i * 4.02;
    card(slide, x, 2.42, 3.45, 2.88, color);
    iconBubble(slide, ic, x + 0.28, 2.73, color, 0.6);
    text(slide, cn, x + 0.28, 3.5, 1.9, 0.35, { size: 20, color: C.ink, bold: true });
    text(slide, en, x + 0.28, 3.9, 2.55, 0.24, { size: 11.3, color, bold: true });
    text(slide, desc, x + 0.28, 4.4, 2.76, 0.6, { size: 12.2, color: C.muted });
  });
}

function addMap() {
  const slide = pptx.addSlide();
  title(slide, 4, "MAP", "六大分型：研发团队里的六种贡献模式", "同样写代码或用 AI，每个人最自然的价值切入点并不一样。");
  [
    ["推进结果", C.fighter, ["Runner", "Climber"], "→"],
    ["构建认知", C.thinker, ["Analyzer", "Builder"], "∑"],
    ["赋能系统", C.helper, ["Socializer", "Keeper"], "✓"],
  ].forEach(([name, color, ens, ic], gi) => {
    const x = 1.28 + gi * 3.78;
    iconBubble(slide, ic, x + 0.73, 2.3, color, 0.78);
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
  iconBubble(slide, cfg.icon, 10.42, 0.84, cfg.color, 0.88);
  text(slide, cfg.claim, 0.76, 2.15, 6.3, 0.42, { size: 22, color: cfg.color, bold: true });
  text(slide, cfg.body, 0.78, 2.9, 6.3, 0.78, { size: 14.3, color: C.muted });
  bullets(slide, cfg.points, 0.8, 4.35, 6.2, C.muted, 12.4, 0.36);
  cfg.types.forEach((en, i) => {
    const t = types.find((v) => v.en === en);
    const x = 7.92 + i * 1.98;
    card(slide, x, 3.0, 1.68, 2.05, t.color);
    text(slide, t.cn, x + 0.2, 3.28, 1.15, 0.25, { size: 17, color: C.ink, bold: true });
    text(slide, t.en, x + 0.2, 3.68, 1.15, 0.2, { size: 11, color: t.color, bold: true });
    text(slide, t.role, x + 0.2, 4.16, 1.18, 0.42, { size: 11.3, color: C.muted });
  });
}

function addType(n, t) {
  const slide = pptx.addSlide();
  title(slide, n, t.parent, `${t.cn} ${t.en}`, t.one);
  iconBubble(slide, t.en.slice(0, 1), 10.55, 0.72, t.color, 0.9);
  text(slide, t.role, 0.76, 2.04, 5.4, 0.42, { size: 21, color: t.color, bold: true });

  card(slide, 0.76, 2.7, 5.55, 1.48, t.color);
  text(slide, "适合承担", 1.0, 2.92, 1.7, 0.25, { size: 15.5, color: C.ink, bold: true });
  text(slide, t.carry, 1.0, 3.28, 4.75, 0.48, { size: 12.2, color: C.muted });

  card(slide, 6.74, 2.7, 5.55, 1.48, t.color);
  text(slide, "岗位建议", 6.98, 2.92, 1.7, 0.25, { size: 15.5, color: C.ink, bold: true });
  text(slide, t.jobs, 6.98, 3.26, 4.78, 0.58, { size: 11.1, color: C.muted });

  card(slide, 0.76, 4.55, 5.55, 1.34, t.color);
  text(slide, "需要留意", 1.0, 4.76, 1.7, 0.25, { size: 15.5, color: C.ink, bold: true });
  bullets(slide, t.risks, 1.0, 5.08, 4.7, C.muted, 11.2, 0.3);

  card(slide, 6.74, 4.55, 5.55, 1.34, C.ai);
  text(slide, "AI 协作方式", 6.98, 4.76, 1.9, 0.25, { size: 15.5, color: C.ink, bold: true });
  text(slide, t.ai, 6.98, 5.12, 4.72, 0.44, { size: 12.2, color: C.muted });
}
function addTeamPlaybook() {
  const slide = pptx.addSlide();
  title(slide, 14, "TEAM PLAYBOOK", "AI 研发团队如何用这套模型组队", "一次完整交付，通常需要三种能力同时在场。");
  const lanes = [
    ["需求到原型", "Runner 快速验证\nAnalyzer 澄清判断", C.fighter, "Step 01"],
    ["原型到系统", "Builder 搭架构\nClimber 攻瓶颈", C.thinker, "Step 02"],
    ["系统到稳定", "Keeper 守质量\nSocializer 促协作", C.helper, "Step 03"],
  ];
  lanes.forEach(([h, b, color, step], i) => {
    const x = 0.94 + i * 3.9;
    card(slide, x, 2.52, 3.22, 2.45, color);
    text(slide, step, x + 0.24, 2.82, 1.1, 0.2, { size: 10.4, color, bold: true });
    text(slide, h, x + 0.24, 3.22, 2.25, 0.32, { size: 19.5, color: C.ink, bold: true });
    text(slide, b, x + 0.24, 3.86, 2.45, 0.72, { size: 15.2, color: C.muted });
  });
  text(slide, "好团队不是所有人都一样强，而是关键任务上有人推进、有人判断、有人托底。", 1.48, 5.86, 10.1, 0.38, { size: 18, color: C.ink, bold: true, align: "center" });
}

function drawQrPlaceholder(slide, x, y, size) {
  slide.addShape(pptx.ShapeType.rect, { x, y, w: size, h: size, fill: { color: "FFFFFF" }, line: { color: C.ai, width: 1.4 } });
  const cells = 25;
  const gap = size / cells;
  const finder = (cx, cy) => {
    slide.addShape(pptx.ShapeType.rect, { x: x + cx * gap, y: y + cy * gap, w: gap * 7, h: gap * 7, fill: { color: "111827" }, line: { color: "111827" } });
    slide.addShape(pptx.ShapeType.rect, { x: x + (cx + 1) * gap, y: y + (cy + 1) * gap, w: gap * 5, h: gap * 5, fill: { color: "FFFFFF" }, line: { color: "FFFFFF" } });
    slide.addShape(pptx.ShapeType.rect, { x: x + (cx + 2) * gap, y: y + (cy + 2) * gap, w: gap * 3, h: gap * 3, fill: { color: "111827" }, line: { color: "111827" } });
  };
  finder(2, 2); finder(16, 2); finder(2, 16);
  for (let r = 2; r < cells - 2; r += 1) {
    for (let c = 2; c < cells - 2; c += 1) {
      const inFinder = (c >= 2 && c < 9 && r >= 2 && r < 9) || (c >= 16 && c < 23 && r >= 2 && r < 9) || (c >= 2 && c < 9 && r >= 16 && r < 23);
      if (inFinder) continue;
      const on = ((r * 7 + c * 11 + r * c) % 5 === 0) || ((r + c) % 9 === 0);
      if (on) slide.addShape(pptx.ShapeType.rect, { x: x + c * gap, y: y + r * gap, w: gap * 0.92, h: gap * 0.92, fill: { color: "111827" }, line: { color: "111827" } });
    }
  }
  text(slide, "二维码位", x + 0.38, y + size + 0.08, size - 0.76, 0.18, { size: 10, color: C.faint, align: "center" });
}

function addAssessmentIntro() {
  const slide = pptx.addSlide();
  const assessmentUrl = "https://1605.msrtai.com/";
  title(slide, 15, "ASSESSMENT", "FTH职业特质测评-1605", "现场扫码完成测评，用结果开启岗位适配、团队协作和个人成长对话。");
  card(slide, 0.86, 2.28, 6.3, 2.9, C.ai);
  text(slide, "测评怎么读", 1.16, 2.6, 2.2, 0.34, { size: 20, color: C.ink, bold: true });
  bullets(slide, [
    "主分型：用于判断首选岗位方向",
    "次分型：用于判断复合岗位和工作风格",
    "第三倾向：用于判断补充能力、协作角色和培养方向",
    "结果不用于给人贴标签，只用于发展对话和团队搭配",
  ], 1.18, 3.15, 5.25, C.muted, 12.8, 0.42);

  card(slide, 7.78, 2.18, 3.5, 3.55, C.ai, C.panel2);
  drawQr(slide, assessmentUrl, 8.22, 2.48, 2.62);
  text(slide, "扫码开始测评", 7.92, 5.52, 3.18, 0.22, { size: 12, color: C.ai, bold: true, align: "center" });
  text(slide, assessmentUrl, 1.0, 6.08, 10.9, 0.26, { size: 12, color: C.faint, align: "center" });
  text(slide, "建议现场完成后，以主分型、次分型、第三倾向作为岗位建议和团队搭配的讨论起点。", 1.0, 6.42, 10.9, 0.24, { size: 10.5, color: C.faint, align: "center" });
}

addCover();
addWhy();
addFramework();
addMap();
addAttribute(5, {
  eyebrow: "ATTRIBUTE 01",
  title: "进取者 Fighter",
  sub: "在研发团队里，进取者负责把不确定性推向可验证结果。",
  icon: "→",
  color: C.fighter,
  claim: "组织的交付推进力",
  body: "他们不一定是最爱讨论的人，但往往能把需求、想法和问题推进到真实环境里，用结果换反馈。",
  points: ["适合目标明确、节奏紧、需要突破的任务", "AI 对他们是加速器：更快产出草案、代码和实验", "需要搭配 Thinker 和 Helper，避免方向偏移和技术债失控"],
  types: ["Runner", "Climber"],
});
addType(6, types[0]);
addType(7, types[1]);
addAttribute(8, {
  eyebrow: "ATTRIBUTE 02",
  title: "思辨者 Thinker",
  sub: "在研发团队里，思辨者负责把复杂问题变成清晰判断和可复用结构。",
  icon: "∑",
  color: C.thinker,
  claim: "组织的技术判断力",
  body: "他们关注问题定义、技术路径、系统边界和长期演进，能让团队避免只靠试错前进。",
  points: ["适合需求澄清、架构设计、故障归因和平台建设", "AI 对他们是认知放大器：帮助整理信息、比较方案、发现盲点", "需要搭配 Fighter 推动落地，避免停留在方案层"],
  types: ["Analyzer", "Builder"],
});
addType(9, types[2]);
addType(10, types[3]);
addAttribute(11, {
  eyebrow: "ATTRIBUTE 03",
  title: "赋能者 Helper",
  sub: "在研发团队里，赋能者负责让人、流程、标准和知识资产稳定运转。",
  icon: "✓",
  color: C.helper,
  claim: "组织的工程赋能力",
  body: "他们不一定总在最前台，但能显著降低协作摩擦、交付风险和知识断层。",
  points: ["适合跨团队协作、研发流程、质量体系和知识沉淀", "AI 对他们是组织助手：帮助维护文档、清单、规范和知识问答", "需要连接业务目标，避免流程变成额外负担"],
  types: ["Socializer", "Keeper"],
});
addType(12, types[4]);
addType(13, types[5]);
addTeamPlaybook();
addAssessmentIntro();

pptx.writeFile({ fileName: "/Users/chenpan/Documents/Codex/2026-06-09/fighter-runner-climber-thinker-analyzer-builder/outputs/FTH职业特质测评-1605.pptx" });
