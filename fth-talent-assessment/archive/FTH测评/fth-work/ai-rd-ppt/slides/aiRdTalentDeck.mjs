const COLORS = {
  bg: "#0B1220",
  bg2: "#111827",
  panel: "#172033",
  panel2: "#101827",
  ink: "#F8FAFC",
  muted: "#CBD5E1",
  faint: "#94A3B8",
  line: "#334155",
  fighter: "#F97316",
  fighter2: "#EF4444",
  thinker: "#60A5FA",
  thinker2: "#8B5CF6",
  helper: "#22C55E",
  helper2: "#14B8A6",
  ai: "#FACC15",
};

const TYPES = [
  {
    cn: "冲刺型",
    en: "Runner",
    parent: "进取者 Fighter",
    color: COLORS.fighter,
    icon: "Rocket",
    role: "把研发节奏跑起来",
    one: "擅长快速验证、快速迭代、快速交付可用版本。",
    fit: "AI 产品经理、增长运营、前端/全栈原型工程师、Demo 工程师、项目推进、售前支持、快速交付工程师",
    risks: ["容易跳过必要设计", "可能技术债积累较快", "需要有人帮忙沉淀复盘"],
    ai: "适合用 AI 快速生成方案、样例、脚手架和实验版本。",
  },
  {
    cn: "攻坚型",
    en: "Climber",
    parent: "进取者 Fighter",
    color: COLORS.fighter2,
    icon: "Mountain",
    role: "啃复杂难题的人",
    one: "擅长在不确定、阻力大、长期卡点的技术问题里持续推进。",
    fit: "技术负责人、后端核心工程师、性能优化工程师、复杂 Bug 攻坚、架构迁移负责人、重点客户交付负责人、SRE",
    risks: ["容易个人硬扛", "可能忽略协同节奏", "需要拆解路径和资源支持"],
    ai: "适合把 AI 当作排查助手、方案对比器和边界条件枚举器。",
  },
  {
    cn: "分析型",
    en: "Analyzer",
    parent: "思辨者 Thinker",
    color: COLORS.thinker,
    icon: "SearchCode",
    role: "把问题看清楚",
    one: "擅长从业务、数据、日志和系统行为里找根因、建判断。",
    fit: "数据分析师、数据科学家、模型评测工程师、需求分析师、产品策略、故障分析、算法评估、用户研究",
    risks: ["容易分析过久", "输出若不转成决策会被低估", "需要明确时间盒"],
    ai: "适合用 AI 做信息整理、日志归纳、假设清单和方案反证。",
  },
  {
    cn: "创构型",
    en: "Builder",
    parent: "思辨者 Thinker",
    color: COLORS.thinker2,
    icon: "Blocks",
    role: "搭系统和平台的人",
    one: "擅长把想法搭成架构、平台、工具、框架和可复用能力。",
    fit: "架构师、AI 平台工程师、MLOps 工程师、RAG 工程师、后端平台工程师、工具链工程师、Agent 工作流设计",
    risks: ["容易过度设计", "可能离真实使用场景太远", "需要持续贴近反馈"],
    ai: "适合设计 AI 工具链、提示词模板、评测框架和自动化研发流程。",
  },
  {
    cn: "人际型",
    en: "Socializer",
    parent: "赋能者 Helper",
    color: COLORS.helper,
    icon: "MessagesSquare",
    role: "让人协作顺起来",
    one: "擅长在产品、研发、测试、业务之间建立理解和信任。",
    fit: "AI 产品经理、客户成功、售前解决方案、实施顾问、培训师、HRBP、Scrum Master、跨部门项目协调",
    risks: ["容易承担过多沟通成本", "可能回避强冲突", "需要边界和决策机制"],
    ai: "适合把 AI 用于会议纪要、信息同步、知识问答和沟通材料整理。",
  },
  {
    cn: "流程型",
    en: "Keeper",
    parent: "赋能者 Helper",
    color: COLORS.helper2,
    icon: "ShieldCheck",
    role: "守住质量和秩序",
    one: "擅长让研发流程、质量标准、交付节奏和知识资产稳定运转。",
    fit: "QA 测试、AI 评测 QA、项目管理、DevOps、SRE、发布管理、合规安全、知识库运营、流程运营",
    risks: ["可能显得保守", "流程若脱离目标会增加负担", "需要理解业务优先级"],
    ai: "适合用 AI 做规范检查、测试生成、文档维护和发布清单校验。",
  },
];

function bg(slide, ctx) {
  ctx.addShape(slide, { x: 0, y: 0, w: ctx.W, h: ctx.H, fill: "gradient(135deg, #0B1220 0%, #101827 58%, #151C31 100%)" });
  ctx.addShape(slide, { x: 70, y: 650, w: 1140, h: 1, fill: COLORS.line });
}

function slideNo(slide, ctx, n) {
  ctx.addText(slide, { text: String(n).padStart(2, "0"), x: 1156, y: 650, w: 52, h: 22, fontSize: 13, color: COLORS.faint, align: "right" });
}

function title(slide, ctx, eyebrow, heading, sub) {
  if (eyebrow) ctx.addText(slide, { text: eyebrow, x: 72, y: 46, w: 760, h: 24, fontSize: 14, bold: true, color: COLORS.faint });
  ctx.addText(slide, { text: heading, x: 70, y: eyebrow ? 82 : 56, w: 920, h: 58, fontSize: 34, bold: true, color: COLORS.ink, typeface: ctx.fonts.title });
  if (sub) ctx.addText(slide, { text: sub, x: 72, y: 143, w: 900, h: 34, fontSize: 18, color: COLORS.muted });
}

function card(slide, ctx, x, y, w, h, color = COLORS.line, fill = COLORS.panel) {
  ctx.addShape(slide, { x, y, w, h, fill, line: ctx.line(`${color}55`, 1), geometry: "roundRect" });
}

async function iconCircle(slide, ctx, icon, x, y, color, size = 54) {
  ctx.addShape(slide, { x, y, w: size, h: size, fill: `${color}22`, line: ctx.line(`${color}66`, 1.4), geometry: "ellipse" });
  await ctx.addLucideIcon(slide, { icon, x: x + size * 0.28, y: y + size * 0.28, w: size * 0.44, h: size * 0.44, color, strokeWidth: 2.3 });
}

function pill(slide, ctx, text, x, y, w, color) {
  ctx.addShape(slide, { x, y, w, h: 32, fill: `${color}22`, line: ctx.line(`${color}66`, 1), geometry: "roundRect" });
  ctx.addText(slide, { text, x: x + 11, y: y + 7, w: w - 22, h: 18, fontSize: 12.5, bold: true, color });
}

function bullets(slide, ctx, items, x, y, w, color = COLORS.muted, size = 16, gap = 30) {
  items.forEach((item, index) => {
    const yy = y + index * gap;
    ctx.addShape(slide, { x, y: yy + 9, w: 6, h: 6, fill: color, line: ctx.line("#00000000", 0), geometry: "ellipse" });
    ctx.addText(slide, { text: item, x: x + 18, y: yy, w: w - 18, h: 26, fontSize: size, color });
  });
}

async function typeSlide(presentation, ctx, n, t) {
  const slide = presentation.slides.add();
  bg(slide, ctx);
  slideNo(slide, ctx, n);
  title(slide, ctx, t.parent, `${t.cn} ${t.en}`, t.one);
  await iconCircle(slide, ctx, t.icon, 1010, 70, t.color, 86);
  ctx.addText(slide, { text: t.role, x: 72, y: 202, w: 520, h: 40, fontSize: 27, bold: true, color: t.color, typeface: ctx.fonts.title });

  card(slide, ctx, 72, 280, 340, 232, t.color);
  ctx.addText(slide, { text: "岗位建议", x: 96, y: 304, w: 220, h: 28, fontSize: 21, bold: true, color: COLORS.ink });
  ctx.addText(slide, { text: t.fit, x: 96, y: 348, w: 270, h: 124, fontSize: 15.2, color: COLORS.muted });

  card(slide, ctx, 470, 280, 310, 232, t.color);
  ctx.addText(slide, { text: "需要留意", x: 494, y: 304, w: 220, h: 28, fontSize: 21, bold: true, color: COLORS.ink });
  bullets(slide, ctx, t.risks, 494, 352, 250, COLORS.muted, 15.5, 39);

  card(slide, ctx, 838, 280, 370, 232, COLORS.ai);
  ctx.addText(slide, { text: "AI 协作方式", x: 862, y: 304, w: 220, h: 28, fontSize: 21, bold: true, color: COLORS.ink });
  ctx.addText(slide, { text: t.ai, x: 862, y: 352, w: 300, h: 92, fontSize: 17, color: COLORS.muted });
  return slide;
}

async function attributeSlide(presentation, ctx, n, cfg) {
  const slide = presentation.slides.add();
  bg(slide, ctx);
  slideNo(slide, ctx, n);
  title(slide, ctx, cfg.eyebrow, cfg.title, cfg.sub);
  await iconCircle(slide, ctx, cfg.icon, 1000, 82, cfg.color, 88);
  ctx.addText(slide, { text: cfg.claim, x: 72, y: 212, w: 620, h: 46, fontSize: 29, bold: true, color: cfg.color, typeface: ctx.fonts.title });
  ctx.addText(slide, { text: cfg.body, x: 74, y: 285, w: 610, h: 104, fontSize: 19, color: COLORS.muted });
  bullets(slide, ctx, cfg.points, 76, 432, 590, COLORS.muted, 17, 34);
  cfg.types.forEach((name, i) => {
    const t = TYPES.find((item) => item.en === name);
    const x = 760 + i * 190;
    card(slide, ctx, x, 306, 164, 206, t.color);
    ctx.addText(slide, { text: t.cn, x: x + 20, y: 332, w: 120, h: 28, fontSize: 22, bold: true, color: COLORS.ink });
    ctx.addText(slide, { text: t.en, x: x + 20, y: 366, w: 120, h: 22, fontSize: 15, bold: true, color: t.color });
    ctx.addText(slide, { text: t.role, x: x + 20, y: 414, w: 118, h: 58, fontSize: 15, color: COLORS.muted });
  });
  return slide;
}

export async function addSlideByIndex(presentation, ctx, index) {
  ctx.fonts.title = "PingFang SC";
  ctx.fonts.body = "PingFang SC";

  if (index === 1) {
    const slide = presentation.slides.add();
    bg(slide, ctx);
    await iconCircle(slide, ctx, "BrainCircuit", 72, 76, COLORS.ai, 62);
    await iconCircle(slide, ctx, "Code2", 150, 76, COLORS.thinker, 62);
    await iconCircle(slide, ctx, "GitBranch", 228, 76, COLORS.helper, 62);
    ctx.addText(slide, { text: "FTH职业特质测评-1605", x: 72, y: 174, w: 960, h: 70, fontSize: 44, bold: true, color: COLORS.ink, typeface: ctx.fonts.title });
    ctx.addText(slide, { text: "AI 研发团队的人才三大特质与六大分型", x: 76, y: 254, w: 850, h: 34, fontSize: 25, bold: true, color: COLORS.ai });
    ctx.addText(slide, { text: "把人放进合适的岗位、协作位置和成长路径里，让 AI 能力真正转化为团队产能。", x: 76, y: 316, w: 850, h: 62, fontSize: 21, color: COLORS.muted });
    pill(slide, ctx, "研发交付", 76, 398, 112, COLORS.fighter);
    pill(slide, ctx, "技术判断", 204, 398, 112, COLORS.thinker);
    pill(slide, ctx, "工程赋能", 332, 398, 112, COLORS.helper);
    pill(slide, ctx, "AI 协作", 460, 398, 104, COLORS.ai);
    ctx.addText(slide, { text: "软件研发团队宣讲版｜岗位建议统一版", x: 76, y: 584, w: 360, h: 28, fontSize: 18, color: COLORS.faint });
    slideNo(slide, ctx, 1);
    return slide;
  }

  if (index === 2) {
    const slide = presentation.slides.add();
    bg(slide, ctx);
    slideNo(slide, ctx, 2);
    title(slide, ctx, "WHY", "AI 研发团队更需要看见“人”的结构", "AI 提高了单点产出，但团队真正的瓶颈仍然在判断、协作、质量和系统化。");
    const items = [
      ["AI 让个体更快", "但更快不等于方向更准，需要有人判断问题、边界和优先级。", "Zap", COLORS.ai],
      ["研发任务更复合", "同一件事里同时有需求、架构、数据、模型、测试、发布和运维。", "Workflow", COLORS.thinker],
      ["协作成本更隐形", "提示词、上下文、代码评审、模型输出质量，都需要共享标准。", "Network", COLORS.helper],
      ["人才不是一种模板", "有人适合冲刺验证，有人适合系统设计，有人适合守住流程质量。", "UsersRound", COLORS.fighter],
    ];
    for (let i = 0; i < items.length; i += 1) {
      const [h, b, icon, color] = items[i];
      const x = 72 + (i % 2) * 568;
      const y = 238 + Math.floor(i / 2) * 178;
      card(slide, ctx, x, y, 510, 132, color);
      await iconCircle(slide, ctx, icon, x + 24, y + 28, color, 56);
      ctx.addText(slide, { text: h, x: x + 100, y: y + 28, w: 280, h: 30, fontSize: 23, bold: true, color: COLORS.ink });
      ctx.addText(slide, { text: b, x: x + 100, y: y + 68, w: 350, h: 44, fontSize: 16, color: COLORS.muted });
    }
    return slide;
  }

  if (index === 3) {
    const slide = presentation.slides.add();
    bg(slide, ctx);
    slideNo(slide, ctx, 3);
    title(slide, ctx, "FRAMEWORK", "三大特质对应研发团队的三种核心能力", "不是给人贴标签，而是识别每个人更自然的贡献方式。");
    const attrs = [
      ["进取者", "Fighter", "交付推进力", "让想法进入真实环境：快速验证、推进版本、突破卡点。", COLORS.fighter, "Rocket"],
      ["思辨者", "Thinker", "技术判断力", "把复杂问题想清楚：分析根因、设计系统、建立方法。", COLORS.thinker, "Brain"],
      ["赋能者", "Helper", "工程赋能力", "让团队稳定变强：连接协作、维护流程、沉淀标准。", COLORS.helper, "Handshake"],
    ];
    attrs.forEach(async () => {});
    for (let i = 0; i < attrs.length; i += 1) {
      const [cn, en, cap, desc, color, icon] = attrs[i];
      const x = 72 + i * 388;
      card(slide, ctx, x, 236, 336, 286, color);
      await iconCircle(slide, ctx, icon, x + 28, 266, color, 60);
      ctx.addText(slide, { text: cn, x: x + 28, y: 344, w: 190, h: 36, fontSize: 26, bold: true, color: COLORS.ink });
      ctx.addText(slide, { text: `${en} / ${cap}`, x: x + 28, y: 385, w: 250, h: 24, fontSize: 15, bold: true, color });
      ctx.addText(slide, { text: desc, x: x + 28, y: 432, w: 270, h: 72, fontSize: 16, color: COLORS.muted });
    }
    return slide;
  }

  if (index === 4) {
    const slide = presentation.slides.add();
    bg(slide, ctx);
    slideNo(slide, ctx, 4);
    title(slide, ctx, "MAP", "六大分型：研发团队里的六种贡献模式", "同样写代码或用 AI，每个人最自然的价值切入点并不一样。");
    const groups = [
      { x: 122, title: "推进结果", color: COLORS.fighter, types: ["Runner", "Climber"], icon: "Rocket" },
      { x: 486, title: "构建认知", color: COLORS.thinker, types: ["Analyzer", "Builder"], icon: "BrainCircuit" },
      { x: 850, title: "赋能系统", color: COLORS.helper, types: ["Socializer", "Keeper"], icon: "ShieldCheck" },
    ];
    for (const group of groups) {
      await iconCircle(slide, ctx, group.icon, group.x + 70, 238, group.color, 76);
      ctx.addText(slide, { text: group.title, x: group.x, y: 336, w: 216, h: 30, fontSize: 24, bold: true, color: COLORS.ink, align: "center" });
      group.types.forEach((name, i) => {
        const t = TYPES.find((item) => item.en === name);
        card(slide, ctx, group.x + i * 122, 430, 102, 92, t.color);
        ctx.addText(slide, { text: t.cn, x: group.x + 10 + i * 122, y: 448, w: 82, h: 22, fontSize: 17, bold: true, color: COLORS.ink, align: "center" });
        ctx.addText(slide, { text: t.en, x: group.x + 10 + i * 122, y: 476, w: 82, h: 18, fontSize: 12.5, bold: true, color: t.color, align: "center" });
      });
    }
    return slide;
  }

  if (index === 5) return attributeSlide(presentation, ctx, 5, {
    eyebrow: "ATTRIBUTE 01",
    title: "进取者 Fighter",
    sub: "在研发团队里，进取者负责把不确定性推向可验证结果。",
    icon: "Rocket",
    color: COLORS.fighter,
    claim: "组织的交付推进力",
    body: "他们不一定是最爱讨论的人，但往往能把需求、想法和问题推进到真实环境里，用结果换反馈。",
    points: ["适合目标明确、节奏紧、需要突破的任务", "AI 对他们是加速器：更快产出草案、代码和实验", "需要搭配 Thinker 和 Helper，避免方向偏移和技术债失控"],
    types: ["Runner", "Climber"],
  });
  if (index === 6) return typeSlide(presentation, ctx, 6, TYPES[0]);
  if (index === 7) return typeSlide(presentation, ctx, 7, TYPES[1]);

  if (index === 8) return attributeSlide(presentation, ctx, 8, {
    eyebrow: "ATTRIBUTE 02",
    title: "思辨者 Thinker",
    sub: "在研发团队里，思辨者负责把复杂问题变成清晰判断和可复用结构。",
    icon: "BrainCircuit",
    color: COLORS.thinker,
    claim: "组织的技术判断力",
    body: "他们关注问题定义、技术路径、系统边界和长期演进，能让团队避免只靠试错前进。",
    points: ["适合需求澄清、架构设计、故障归因和平台建设", "AI 对他们是认知放大器：帮助整理信息、比较方案、发现盲点", "需要搭配 Fighter 推动落地，避免停留在方案层"],
    types: ["Analyzer", "Builder"],
  });
  if (index === 9) return typeSlide(presentation, ctx, 9, TYPES[2]);
  if (index === 10) return typeSlide(presentation, ctx, 10, TYPES[3]);

  if (index === 11) return attributeSlide(presentation, ctx, 11, {
    eyebrow: "ATTRIBUTE 03",
    title: "赋能者 Helper",
    sub: "在研发团队里，赋能者负责让人、流程、标准和知识资产稳定运转。",
    icon: "Handshake",
    color: COLORS.helper,
    claim: "组织的工程赋能力",
    body: "他们不一定总在最前台，但能显著降低协作摩擦、交付风险和知识断层。",
    points: ["适合跨团队协作、研发流程、质量体系和知识沉淀", "AI 对他们是组织助手：帮助维护文档、清单、规范和知识问答", "需要连接业务目标，避免流程变成额外负担"],
    types: ["Socializer", "Keeper"],
  });
  if (index === 12) return typeSlide(presentation, ctx, 12, TYPES[4]);
  if (index === 13) return typeSlide(presentation, ctx, 13, TYPES[5]);

  if (index === 14) {
    const slide = presentation.slides.add();
    bg(slide, ctx);
    slideNo(slide, ctx, 14);
    title(slide, ctx, "RESULT READING", "测评结果如何转化为岗位建议", "和网页测评保持一致：主分型、次分型、第三倾向共同决定发展建议。");
    const lanes = [
      ["首选岗位", "由主分型决定\n代表稳定优势和主要能量来源", COLORS.fighter, "主分型"],
      ["复合岗位", "由主分型 + 次分型决定\n判断更适合业务、技术、组织或稳定交付", COLORS.thinker, "次分型"],
      ["成长补充", "由第三倾向决定\n作为协作角色、能力补位和培养方向", COLORS.helper, "第三倾向"],
    ];
    lanes.forEach((lane, i) => {
      const [h, b, color, step] = lane;
      const x = 90 + i * 374;
      card(slide, ctx, x, 246, 310, 250, color);
      ctx.addText(slide, { text: step, x: x + 24, y: 274, w: 110, h: 22, fontSize: 14, bold: true, color });
      ctx.addText(slide, { text: h, x: x + 24, y: 314, w: 220, h: 34, fontSize: 25, bold: true, color: COLORS.ink });
      ctx.addText(slide, { text: b, x: x + 24, y: 376, w: 240, h: 80, fontSize: 19, color: COLORS.muted });
    });
    ctx.addText(slide, { text: "岗位建议不是一次性定岗，而是帮助员工找到更适合发挥价值的任务入口、协作位置和成长路径。", x: 142, y: 568, w: 900, h: 44, fontSize: 23, bold: true, color: COLORS.ink, align: "center" });
    return slide;
  }

  throw new Error(`Unknown slide index: ${index}`);
}
