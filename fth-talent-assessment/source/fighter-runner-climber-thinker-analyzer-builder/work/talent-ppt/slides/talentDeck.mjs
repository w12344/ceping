const COLORS = {
  bg: "#111827",
  bg2: "#0B1220",
  ink: "#F8FAFC",
  muted: "#CBD5E1",
  faint: "#94A3B8",
  line: "#334155",
  card: "#172033",
  fighter: "#F97316",
  fighter2: "#EF4444",
  thinker: "#60A5FA",
  thinker2: "#8B5CF6",
  helper: "#22C55E",
  helper2: "#14B8A6",
};

const TYPES = [
  {
    key: "runner",
    cn: "冲刺型",
    en: "Runner",
    parent: "Fighter",
    color: COLORS.fighter,
    icon: "Zap",
    one: "在明确目标下快速行动、快速反馈、快速拿结果。",
    keywords: ["快启动", "强执行", "短周期", "结果牵引"],
    strengths: ["能把机会窗口快速转成动作", "适合冲业绩、打活动、做转化", "能带动团队从讨论进入行动"],
    risks: ["容易重速度、轻复盘", "方向变化频繁时会消耗", "对慢节奏协同耐心不足"],
    fit: "销售冲刺、市场活动、增长实验、BD 拓展、短期项目推进",
    grow: "把每次冲刺沉淀成可复制打法：复盘、节奏管理、关键动作清单。",
  },
  {
    key: "climber",
    cn: "攻坚型",
    en: "Climber",
    parent: "Fighter",
    color: COLORS.fighter2,
    icon: "Mountain",
    one: "面对困难不退，能在阻力中持续推进、拿下硬仗。",
    keywords: ["高韧性", "抗压力", "破难题", "敢承担"],
    strengths: ["适合关键客户、复杂谈判和瓶颈突破", "能在局面卡住时顶上去", "面对失败更容易被激发斗志"],
    risks: ["可能过度硬扛、忽略借力", "长期高压容易透支", "对低挑战任务兴趣不足"],
    fit: "大客户销售、关键项目、危机处理、变革推进、复杂商务谈判",
    grow: "从个人硬冲升级为资源整合：拆路径、拉盟友、分阶段攻克。",
  },
  {
    key: "analyzer",
    cn: "分析型",
    en: "Analyzer",
    parent: "Thinker",
    color: COLORS.thinker,
    icon: "Search",
    one: "能从复杂信息中找到规律、根因和更可靠的判断。",
    keywords: ["重证据", "拆问题", "看根因", "控风险"],
    strengths: ["把混乱问题结构化", "帮助组织少凭感觉决策", "能识别关键变量和优先级"],
    risks: ["可能想得深但行动慢", "过度追求确定性", "表达太理性时会显得不够共情"],
    fit: "数据分析、经营分析、战略研究、产品策略、用户研究、流程诊断",
    grow: "把分析变成决策建议：结论、依据、优先级、下一步动作。",
  },
  {
    key: "builder",
    cn: "创构型",
    en: "Builder",
    parent: "Thinker",
    color: COLORS.thinker2,
    icon: "Blocks",
    one: "把想法搭成可运转的产品、系统、机制或方法论。",
    keywords: ["创造力", "架构感", "可复用", "系统化"],
    strengths: ["能从零到一搭东西", "把经验沉淀为系统能力", "关注扩展性和长期效率"],
    risks: ["可能过度理想化", "容易忽略当前资源和落地成本", "对重复执行兴趣不足"],
    fit: "产品、研发、业务中台、运营体系、知识库、培训体系、组织机制设计",
    grow: "持续贴近真实用户和业务现场，让设计被使用、被验证、被迭代。",
  },
  {
    key: "socializer",
    cn: "人际型",
    en: "Socializer",
    parent: "Helper",
    color: COLORS.helper,
    icon: "Users",
    one: "理解人、连接人、激发人，让团队更愿意一起完成事情。",
    keywords: ["共情力", "信任感", "会沟通", "促协作"],
    strengths: ["发现数据和流程看不到的人际问题", "协调冲突、恢复团队连接", "能营造安全感和投入感"],
    risks: ["可能过度照顾感受", "强冲突场景不够果断", "承担过多情绪劳动"],
    fit: "HRBP、培训、教练、员工关系、客户成功、文化建设、跨部门协调",
    grow: "建立边界和结果意识：不是无限满足，而是帮助他人更成熟。",
  },
  {
    key: "keeper",
    cn: "流程型",
    en: "Keeper",
    parent: "Helper",
    color: COLORS.helper2,
    icon: "ShieldCheck",
    one: "维护秩序、流程和细节，让组织稳定、可靠、长期运转。",
    keywords: ["稳定性", "标准化", "细致度", "可持续"],
    strengths: ["发现流程漏洞并补上", "保障交付质量和节奏", "让协作从靠人变成靠机制"],
    risks: ["可能灵活性不足", "面对模糊变化会不适应", "流程若脱离目标会变成负担"],
    fit: "项目管理、流程运营、人事运营、财务、行政、质量管理、合规、交付管理",
    grow: "理解流程背后的业务目的：减少混乱、提升效率、保障结果。",
  },
];

function bg(slide, ctx) {
  ctx.addShape(slide, { x: 0, y: 0, w: ctx.W, h: ctx.H, fill: COLORS.bg2 });
  ctx.addShape(slide, { x: 0, y: 0, w: ctx.W, h: 720, fill: "gradient(135deg, #111827 0%, #0B1220 58%, #141B2F 100%)" });
  ctx.addShape(slide, { x: 70, y: 650, w: 1140, h: 1, fill: COLORS.line });
}

function slideNo(slide, ctx, n) {
  ctx.addText(slide, { text: String(n).padStart(2, "0"), x: 1156, y: 650, w: 52, h: 22, fontSize: 13, color: COLORS.faint, align: "right" });
}

function title(slide, ctx, eyebrow, heading, sub) {
  if (eyebrow) ctx.addText(slide, { text: eyebrow, x: 72, y: 48, w: 700, h: 24, fontSize: 15, bold: true, color: COLORS.faint });
  ctx.addText(slide, { text: heading, x: 70, y: eyebrow ? 82 : 58, w: 900, h: 62, fontSize: 35, bold: true, color: COLORS.ink, typeface: ctx.fonts.title });
  if (sub) ctx.addText(slide, { text: sub, x: 72, y: 143, w: 850, h: 32, fontSize: 18, color: COLORS.muted });
}

function pill(slide, ctx, text, x, y, w, color) {
  ctx.addShape(slide, { x, y, w, h: 34, fill: `${color}22`, line: ctx.line(`${color}66`, 1), geometry: "roundRect" });
  ctx.addText(slide, { text, x: x + 12, y: y + 7, w: w - 24, h: 18, fontSize: 13, bold: true, color });
}

async function iconCircle(slide, ctx, icon, x, y, color, size = 54) {
  ctx.addShape(slide, { x, y, w: size, h: size, fill: `${color}22`, line: ctx.line(`${color}66`, 1.4), geometry: "ellipse" });
  await ctx.addLucideIcon(slide, { icon, x: x + size * 0.28, y: y + size * 0.28, w: size * 0.44, h: size * 0.44, color, strokeWidth: 2.3 });
}

function card(slide, ctx, x, y, w, h, color = COLORS.line) {
  ctx.addShape(slide, { x, y, w, h, fill: COLORS.card, line: ctx.line(`${color}55`, 1), geometry: "roundRect" });
}

function bulletList(slide, ctx, items, x, y, w, color = COLORS.muted, size = 18, gap = 34) {
  items.forEach((item, i) => {
    const yy = y + i * gap;
    ctx.addShape(slide, { x, y: yy + 9, w: 6, h: 6, fill: color, line: ctx.line("#00000000", 0), geometry: "ellipse" });
    ctx.addText(slide, { text: item, x: x + 18, y: yy, w: w - 18, h: 28, fontSize: size, color });
  });
}

async function introSlide(presentation, ctx, n, cfg) {
  const slide = presentation.slides.add();
  bg(slide, ctx);
  slideNo(slide, ctx, n);
  title(slide, ctx, cfg.eyebrow, cfg.name, cfg.sub);
  await iconCircle(slide, ctx, cfg.icon, 956, 80, cfg.color, 96);
  ctx.addText(slide, { text: cfg.role, x: 70, y: 210, w: 520, h: 68, fontSize: 31, bold: true, color: cfg.color, typeface: ctx.fonts.title });
  ctx.addText(slide, { text: cfg.desc, x: 72, y: 292, w: 590, h: 92, fontSize: 21, color: COLORS.muted, insets: { left: 0, right: 0, top: 0, bottom: 0 } });
  const xs = [710, 890];
  cfg.children.forEach((child, i) => {
    const t = TYPES.find((it) => it.en === child);
    card(slide, ctx, xs[i], 260, 160, 210, t.color);
    ctx.addText(slide, { text: t.cn, x: xs[i] + 20, y: 286, w: 120, h: 30, fontSize: 23, bold: true, color: COLORS.ink });
    ctx.addText(slide, { text: t.en, x: xs[i] + 20, y: 323, w: 120, h: 26, fontSize: 17, color: t.color, bold: true });
    ctx.addText(slide, { text: t.one, x: xs[i] + 20, y: 374, w: 120, h: 74, fontSize: 15, color: COLORS.muted });
  });
  bulletList(slide, ctx, cfg.points, 72, 438, 520, COLORS.muted, 18, 34);
  return slide;
}

async function typeSlide(presentation, ctx, n, t) {
  const slide = presentation.slides.add();
  bg(slide, ctx);
  slideNo(slide, ctx, n);
  title(slide, ctx, `${t.parent} / ${t.en}`, `${t.cn} ${t.en}`, t.one);
  await iconCircle(slide, ctx, t.icon, 1016, 72, t.color, 88);
  t.keywords.forEach((k, i) => pill(slide, ctx, k, 72 + i * 128, 202, 104, t.color));

  const cols = [
    { label: "典型优势", items: t.strengths, x: 72 },
    { label: "可能短板", items: t.risks, x: 448 },
  ];
  cols.forEach((c) => {
    card(slide, ctx, c.x, 270, 330, 246, t.color);
    ctx.addText(slide, { text: c.label, x: c.x + 24, y: 294, w: 200, h: 28, fontSize: 22, bold: true, color: COLORS.ink });
    bulletList(slide, ctx, c.items, c.x + 24, 344, 280, COLORS.muted, 16, 44);
  });
  card(slide, ctx, 824, 270, 384, 246, t.color);
  ctx.addText(slide, { text: "适合场景", x: 848, y: 294, w: 200, h: 28, fontSize: 22, bold: true, color: COLORS.ink });
  ctx.addText(slide, { text: t.fit, x: 848, y: 338, w: 320, h: 78, fontSize: 18, color: COLORS.muted });
  ctx.addText(slide, { text: "成长提醒", x: 848, y: 438, w: 200, h: 24, fontSize: 18, bold: true, color: t.color });
  ctx.addText(slide, { text: t.grow, x: 848, y: 468, w: 320, h: 56, fontSize: 15.5, color: COLORS.muted });
  return slide;
}

export async function addSlideByIndex(presentation, ctx, index) {
  ctx.fonts.title = "PingFang SC";
  ctx.fonts.body = "PingFang SC";
  if (index === 1) {
    const slide = presentation.slides.add();
    bg(slide, ctx);
    await iconCircle(slide, ctx, "Swords", 72, 76, COLORS.fighter, 58);
    await iconCircle(slide, ctx, "Sparkles", 148, 76, COLORS.thinker, 58);
    await iconCircle(slide, ctx, "Handshake", 224, 76, COLORS.helper, 58);
    ctx.addText(slide, { text: "人才三大主属性与六大分型", x: 72, y: 178, w: 900, h: 72, fontSize: 43, bold: true, color: COLORS.ink, typeface: ctx.fonts.title });
    ctx.addText(slide, { text: "用一套更容易理解的职业语言，帮助员工识别优势、理解差异、优化协作、设计成长路径。", x: 76, y: 270, w: 820, h: 58, fontSize: 23, color: COLORS.muted });
    ["Fighter 进取者", "Thinker 思辨者", "Helper 赋能者"].forEach((t, i) => pill(slide, ctx, t, 76 + i * 178, 390, 150, [COLORS.fighter, COLORS.thinker, COLORS.helper][i]));
    ctx.addText(slide, { text: "内部宣讲版", x: 76, y: 584, w: 220, h: 28, fontSize: 18, color: COLORS.faint });
    slideNo(slide, ctx, 1);
    return slide;
  }
  if (index === 2) {
    const slide = presentation.slides.add();
    bg(slide, ctx); slideNo(slide, ctx, 2);
    title(slide, ctx, "WHY", "这个模型不是贴标签，而是建立协作语言", "每个人都不只属于一种类型；模型的价值在于看见优势、场景和补位方向。");
    const items = [
      ["识别优势", "知道自己在哪些任务里最容易创造价值。", "BadgeCheck", COLORS.fighter],
      ["理解差异", "理解别人为什么用不同节奏、语言和标准工作。", "MessagesSquare", COLORS.thinker],
      ["优化协作", "把不同类型组合成更完整的团队能力。", "Network", COLORS.helper],
      ["设计成长", "从主属性出发，补上下一阶段所需能力。", "TrendingUp", "#FACC15"],
    ];
    for (let i = 0; i < items.length; i++) {
      const [h, body, icon, color] = items[i];
      const x = 72 + (i % 2) * 568, y = 238 + Math.floor(i / 2) * 178;
      card(slide, ctx, x, y, 510, 132, color);
      await iconCircle(slide, ctx, icon, x + 24, y + 28, color, 56);
      ctx.addText(slide, { text: h, x: x + 100, y: y + 28, w: 230, h: 30, fontSize: 24, bold: true, color: COLORS.ink });
      ctx.addText(slide, { text: body, x: x + 100, y: y + 70, w: 350, h: 38, fontSize: 17, color: COLORS.muted });
    }
    return slide;
  }
  if (index === 3) {
    const slide = presentation.slides.add();
    bg(slide, ctx); slideNo(slide, ctx, 3);
    title(slide, ctx, "OVERVIEW", "三大主属性：攻击力、认知力、协同力", "一个高效组织，需要有人打开战场、有人判断方向、有人托住系统。");
    const attrs = [
      ["进取者", "Fighter", "武士", "执行力强、进攻性猛，适合做销售、市场、拓展和关键推进。", COLORS.fighter, "Swords"],
      ["思辨者", "Thinker", "法师", "脑子聪明、擅长分析和架构，适合参谋、中台、运营、产品、研发。", COLORS.thinker, "Sparkles"],
      ["赋能者", "Helper", "道士", "擅长协作赋能、稳定团队，适合教师、教练、HRBP、流程治理。", COLORS.helper, "Handshake"],
    ];
    for (let i = 0; i < attrs.length; i++) {
      const [cn, en, role, desc, color, icon] = attrs[i];
      const x = 72 + i * 388;
      card(slide, ctx, x, 236, 336, 284, color);
      await iconCircle(slide, ctx, icon, x + 28, 266, color, 60);
      ctx.addText(slide, { text: cn, x: x + 28, y: 344, w: 190, h: 36, fontSize: 27, bold: true, color: COLORS.ink });
      ctx.addText(slide, { text: `${en} / ${role}`, x: x + 28, y: 385, w: 190, h: 24, fontSize: 16, bold: true, color });
      ctx.addText(slide, { text: desc, x: x + 28, y: 432, w: 270, h: 72, fontSize: 16, color: COLORS.muted });
    }
    return slide;
  }
  if (index === 4) {
    const slide = presentation.slides.add();
    bg(slide, ctx); slideNo(slide, ctx, 4);
    title(slide, ctx, "MAP", "六大分型：从主属性到具体工作风格", "三大属性决定底层驱动力，六个分型帮助我们识别更具体的优势场景。");
    const centers = [
      { x: 210, y: 266, name: "Fighter", cn: "进取者", color: COLORS.fighter, icon: "Swords", children: ["Runner", "Climber"] },
      { x: 570, y: 266, name: "Thinker", cn: "思辨者", color: COLORS.thinker, icon: "Sparkles", children: ["Analyzer", "Builder"] },
      { x: 930, y: 266, name: "Helper", cn: "赋能者", color: COLORS.helper, icon: "Handshake", children: ["Socializer", "Keeper"] },
    ];
    for (const c of centers) {
      await iconCircle(slide, ctx, c.icon, c.x, c.y, c.color, 96);
      ctx.addText(slide, { text: c.cn, x: c.x - 50, y: c.y + 112, w: 196, h: 32, fontSize: 25, bold: true, color: COLORS.ink, align: "center" });
      ctx.addText(slide, { text: c.name, x: c.x - 50, y: c.y + 148, w: 196, h: 24, fontSize: 16, bold: true, color: c.color, align: "center" });
      c.children.forEach((child, i) => {
        const t = TYPES.find((it) => it.en === child);
        card(slide, ctx, c.x - 72 + i * 150, 500, 132, 78, t.color);
        ctx.addText(slide, { text: t.cn, x: c.x - 58 + i * 150, y: 517, w: 104, h: 22, fontSize: 18, bold: true, color: COLORS.ink, align: "center" });
        ctx.addText(slide, { text: t.en, x: c.x - 58 + i * 150, y: 544, w: 104, h: 18, fontSize: 13, bold: true, color: t.color, align: "center" });
      });
    }
    return slide;
  }
  if (index === 5) return introSlide(presentation, ctx, 5, {
    eyebrow: "ATTRIBUTE 01", name: "进取者 Fighter", sub: "为结果而战的人：目标、行动、突破、竞争、结果。",
    icon: "Swords", color: COLORS.fighter, role: "组织的攻击力", children: ["Runner", "Climber"],
    desc: "他们喜欢把事情推向真实战场，在压力和目标中被激发。适合外部突破、强推动、强结果导向的任务。",
    points: ["目标越清晰，战斗力越强", "不等条件完美，先行动起来", "需要用复盘和资源协同提升上限"],
  });
  if (index >= 6 && index <= 7) return typeSlide(presentation, ctx, index, TYPES[index - 6]);
  if (index === 8) return introSlide(presentation, ctx, 8, {
    eyebrow: "ATTRIBUTE 02", name: "思辨者 Thinker", sub: "用认知改变结果的人：分析、结构、洞察、创造、系统。",
    icon: "Sparkles", color: COLORS.thinker, role: "组织的认知力", children: ["Analyzer", "Builder"],
    desc: "他们关注问题背后的逻辑和规律，依靠判断、建模、设计和创造产生价值。",
    points: ["把复杂问题变清楚", "把一次经验变成方法和系统", "需要用真实业务反馈校准思考"],
  });
  if (index >= 9 && index <= 10) return typeSlide(presentation, ctx, index, TYPES[index - 7]);
  if (index === 11) return introSlide(presentation, ctx, 11, {
    eyebrow: "ATTRIBUTE 03", name: "赋能者 Helper", sub: "让人和系统更好运转的人：连接、支持、协调、稳定、成长。",
    icon: "Handshake", color: COLORS.helper, role: "组织的协同力", children: ["Socializer", "Keeper"],
    desc: "他们的价值不只体现在个人产出上，更体现在帮助他人变强、让团队更稳、让组织更顺畅。",
    points: ["让人愿意一起完成事情", "把协作从靠感觉变成靠机制", "需要边界感和业务目标牵引"],
  });
  if (index >= 12 && index <= 13) return typeSlide(presentation, ctx, index, TYPES[index - 8]);
  if (index === 14) {
    const slide = presentation.slides.add();
    bg(slide, ctx); slideNo(slide, ctx, 14);
    title(slide, ctx, "COLLABORATION", "最强团队不是同类相加，而是三种能力互补", "Fighter 打开战场，Thinker 判断方向，Helper 托住团队和系统。");
    const loop = [
      ["Fighter", "把目标打出去", COLORS.fighter, "Swords", 150, 316],
      ["Thinker", "把问题想清楚", COLORS.thinker, "Brain", 550, 204],
      ["Helper", "让团队跑得久", COLORS.helper, "HeartHandshake", 850, 394],
    ];
    for (const [name, body, color, icon, x, y] of loop) {
      card(slide, ctx, x, y, 240, 132, color);
      await iconCircle(slide, ctx, icon, x + 22, y + 32, color, 58);
      ctx.addText(slide, { text: name, x: x + 94, y: y + 32, w: 120, h: 26, fontSize: 22, bold: true, color: COLORS.ink });
      ctx.addText(slide, { text: body, x: x + 94, y: y + 70, w: 124, h: 24, fontSize: 17, color: COLORS.muted });
    }
    ctx.addShape(slide, { x: 395, y: 377, w: 140, h: 2, fill: COLORS.line });
    ctx.addShape(slide, { x: 683, y: 337, w: 140, h: 2, fill: COLORS.line });
    ctx.addText(slide, { text: "攻击力 + 认知力 + 协同力 = 既能打、又能想、还能长期运转", x: 200, y: 570, w: 820, h: 38, fontSize: 25, bold: true, color: COLORS.ink, align: "center" });
    return slide;
  }
  if (index === 15) {
    const slide = presentation.slides.add();
    bg(slide, ctx); slideNo(slide, ctx, 15);
    title(slide, ctx, "PLAYBOOK", "如何在组织里使用这套模型", "把它用于自我理解、岗位匹配、团队配置和成长对话。");
    const rows = [
      ["员工个人", "我最自然的优势是什么？在哪些场景最容易发挥价值？下一阶段要补哪种能力？", COLORS.thinker, "UserRound"],
      ["管理者", "把合适的人放到合适的位置，用不同方式激励不同类型的人。", COLORS.fighter, "BriefcaseBusiness"],
      ["团队协作", "项目启动时先看三种能力是否齐备：有人冲、有人想、有人托住。", COLORS.helper, "UsersRound"],
    ];
    for (let i = 0; i < rows.length; i++) {
      const [h, b, color, icon] = rows[i];
      const y = 230 + i * 130;
      card(slide, ctx, 96, y, 1010, 96, color);
      await iconCircle(slide, ctx, icon, 128, y + 22, color, 52);
      ctx.addText(slide, { text: h, x: 208, y: y + 25, w: 150, h: 28, fontSize: 22, bold: true, color: COLORS.ink });
      ctx.addText(slide, { text: b, x: 384, y: y + 25, w: 650, h: 34, fontSize: 18, color: COLORS.muted });
    }
    ctx.addText(slide, { text: "识别优势，理解差异，优化协作，设计成长路径。", x: 96, y: 606, w: 760, h: 34, fontSize: 25, bold: true, color: COLORS.ink });
    return slide;
  }
  throw new Error(`Unknown slide index: ${index}`);
}
