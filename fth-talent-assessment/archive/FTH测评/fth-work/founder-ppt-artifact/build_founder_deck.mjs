import fs from "node:fs/promises";
import path from "node:path";
import { Presentation, PresentationFile } from "@oai/artifact-tool";

const ROOT = path.resolve(new URL("../..", import.meta.url).pathname);
const OUT = path.join(ROOT, "outputs/FTH创业者职业特质测评.pptx");
const WORK_DIR = path.join(ROOT, "work/founder-ppt-artifact");
const PREVIEW_DIR = path.join(WORK_DIR, "preview");
const LAYOUT_DIR = path.join(WORK_DIR, "layout");
const QA_DIR = path.join(WORK_DIR, "qa");
const POSTER = path.join(ROOT, "outputs/FTH创业者职业特质测评-海报.png");

const W = 1280;
const H = 720;
const C = {
  bg: "#0B1220",
  panel: "#101827",
  panel2: "#172033",
  line: "#334155",
  ink: "#F8FAFC",
  muted: "#CBD5E1",
  faint: "#94A3B8",
  gold: "#FACC15",
  fighter: "#F97316",
  thinker: "#60A5FA",
  helper: "#22C55E",
  red: "#EF4444",
  purple: "#8B5CF6",
  teal: "#14B8A6",
};

async function writeBlob(file, blob) {
  await fs.writeFile(file, new Uint8Array(await blob.arrayBuffer()));
}

async function imageBytes(file) {
  const bytes = await fs.readFile(file);
  return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
}

function addText(slide, text, x, y, w, h, opts = {}) {
  const box = slide.shapes.add({
    geometry: "textbox",
    position: { left: x, top: y, width: w, height: h },
    fill: "none",
    line: { style: "solid", fill: "none", width: 0 },
  });
  box.text = text;
  box.text.style = {
    fontSize: opts.size ?? 22,
    bold: opts.bold ?? false,
    color: opts.color ?? C.ink,
    alignment: opts.align ?? "left",
    typeface: "PingFang SC",
  };
  return box;
}

function addBox(slide, x, y, w, h, opts = {}) {
  return slide.shapes.add({
    geometry: opts.geometry ?? "roundRect",
    position: { left: x, top: y, width: w, height: h },
    fill: opts.fill ?? C.panel,
    line: { style: "solid", fill: opts.line ?? C.line, width: opts.lineWidth ?? 1 },
    borderRadius: opts.radius ?? "rounded-lg",
  });
}

function addRule(slide, x, y, w, color = C.line) {
  slide.shapes.add({
    geometry: "rect",
    position: { left: x, top: y, width: w, height: 2 },
    fill: color,
    line: { style: "solid", fill: color, width: 0 },
  });
}

function addDot(slide, x, y, color, label) {
  slide.shapes.add({
    geometry: "ellipse",
    position: { left: x, top: y, width: 52, height: 52 },
    fill: `${color}24`,
    line: { style: "solid", fill: `${color}AA`, width: 2 },
  });
  addText(slide, label, x, y + 7, 52, 34, { size: 26, bold: true, color, align: "center" });
}

function addHeader(slide, no, title, kicker = "FTH 创业者职业特质测评") {
  addText(slide, String(no).padStart(2, "0"), 72, 42, 52, 28, { size: 16, bold: true, color: C.gold });
  addText(slide, kicker, 128, 42, 430, 28, { size: 16, bold: true, color: C.faint });
  addText(slide, title, 72, 86, 880, 56, { size: 38, bold: true });
  addRule(slide, 72, 156, 1136, "#263244");
}

function baseSlide(presentation) {
  const slide = presentation.slides.add();
  slide.background.fill = C.bg;
  slide.shapes.add({
    geometry: "ellipse",
    position: { left: 870, top: -160, width: 420, height: 420 },
    fill: "#1D4ED820",
    line: { style: "solid", fill: "none", width: 0 },
  });
  slide.shapes.add({
    geometry: "ellipse",
    position: { left: -170, top: 520, width: 360, height: 360 },
    fill: "#FACC1518",
    line: { style: "solid", fill: "none", width: 0 },
  });
  return slide;
}

function bulletList(slide, items, x, y, w, gap = 58, opts = {}) {
  items.forEach((item, i) => {
    const top = y + i * gap;
    slide.shapes.add({
      geometry: "ellipse",
      position: { left: x, top: top + 8, width: 12, height: 12 },
      fill: opts.dot ?? C.gold,
      line: { style: "solid", fill: "none", width: 0 },
    });
    addText(slide, item, x + 28, top, w - 28, gap - 4, { size: opts.size ?? 24, color: opts.color ?? C.muted });
  });
}

function featureCard(slide, x, y, w, h, title, body, color) {
  addBox(slide, x, y, w, h, { fill: `${color}18`, line: `${color}66` });
  addText(slide, title, x + 24, y + 22, w - 48, 34, { size: 28, bold: true, color });
  addText(slide, body, x + 24, y + 70, w - 48, h - 82, { size: 20, color: C.muted });
}

function addTitleSlide(presentation) {
  const slide = baseSlide(presentation);
  addDot(slide, 88, 86, C.fighter, "F");
  addDot(slide, 158, 86, C.thinker, "T");
  addDot(slide, 228, 86, C.helper, "H");
  addText(slide, "FTH创业者职业特质测评", 88, 198, 920, 82, { size: 58, bold: true });
  addText(slide, "看见创始人的创业驱动力、决策方式与团队协作说明书", 92, 302, 850, 44, { size: 27, color: C.muted });
  addBox(slide, 88, 430, 760, 120, { fill: "#111827CC", line: "#334155" });
  addText(slide, "适合创始人分享 / 合伙人沟通 / 团队复盘", 124, 460, 700, 34, { size: 25, bold: true });
  addText(slide, "结果用于自我理解与协作沟通，不用于简单贴标签。", 124, 504, 680, 30, { size: 19, color: C.faint });
  addText(slide, "2026", 1110, 630, 100, 40, { size: 28, bold: true, color: C.gold, align: "right" });
}

function addWhySlide(presentation) {
  const slide = baseSlide(presentation);
  addHeader(slide, 1, "为什么创始人更需要理解自己的特质");
  addText(slide, "创始人的优势会放大成公司的风格，也会放大成团队的压力源。", 72, 190, 1080, 52, { size: 32, bold: true });
  bulletList(slide, [
    "早期公司最稀缺的不是完美能力，而是创始人把自己用对。",
    "同样是强势，有人适合前线破局，有人适合系统设计，有人适合组织凝聚。",
    "测评的价值不是判断好坏，而是把“我怎么工作”翻译成团队能使用的说明书。"
  ], 86, 292, 700, 82, { size: 23 });
  addBox(slide, 850, 315, 300, 230, { fill: "#FACC1514", line: "#FACC1566" });
  addText(slide, "不是标签", 890, 355, 220, 42, { size: 31, bold: true, color: C.gold, align: "center" });
  addText(slide, "而是协作语言", 882, 420, 236, 42, { size: 31, bold: true, color: C.ink, align: "center" });
  addText(slide, "让创始人、合伙人和核心团队知道如何互相补位。", 900, 492, 200, 42, { size: 18, color: C.muted, align: "center" });
}

function addModelSlide(presentation) {
  const slide = baseSlide(presentation);
  addHeader(slide, 2, "FTH：三种创业底层驱动力");
  featureCard(slide, 88, 210, 330, 280, "Fighter 进取者", "目标、进攻、破局、拿结果。\n更适合市场开拓、关键客户、增长突破和逆境翻盘。", C.fighter);
  featureCard(slide, 475, 210, 330, 280, "Thinker 思辨者", "判断、结构、产品、系统。\n更适合战略选择、商业模式、产品架构和复杂决策。", C.thinker);
  featureCard(slide, 862, 210, 330, 280, "Helper 赋能者", "连接、组织、文化、稳定。\n更适合团队凝聚、客户关系、合伙人协同和长期经营。", C.helper);
  addText(slide, "三大特质不是三种人，而是每个创始人身上的三组能力配比。", 120, 570, 1040, 36, { size: 26, bold: true, color: C.gold, align: "center" });
}

function addAttributeSlide(presentation, no, attr) {
  const slide = baseSlide(presentation);
  addHeader(slide, no, attr.title, attr.kicker);
  addText(slide, attr.big, 88, 210, 480, 70, { size: 50, bold: true, color: attr.color });
  addText(slide, attr.copy, 90, 300, 500, 110, { size: 25, color: C.muted });
  addBox(slide, 675, 200, 460, 310, { fill: `${attr.color}16`, line: `${attr.color}66` });
  addText(slide, "适合场景", 715, 236, 280, 32, { size: 27, bold: true, color: attr.color });
  bulletList(slide, attr.scenes, 725, 296, 360, 48, { size: 22, dot: attr.color });
  addText(slide, attr.warn, 92, 520, 940, 52, { size: 23, color: C.faint });
}

function addSixTypesSlide(presentation) {
  const slide = baseSlide(presentation);
  addHeader(slide, 6, "六大创业者分型：更具体的贡献模式");
  const items = [
    ["冲刺型 Runner", "机会捕手 / 增长冲刺者", C.fighter],
    ["攻坚型 Climber", "硬仗型创始人 / 关键突破者", C.red],
    ["分析型 Analyzer", "战略判断者 / 问题拆解者", C.thinker],
    ["创构型 Builder", "系统搭建者 / 产品机制设计者", C.purple],
    ["人际型 Socializer", "关系经营者 / 组织凝聚者", C.helper],
    ["流程型 Keeper", "秩序守护者 / 稳定运营者", C.teal],
  ];
  items.forEach(([title, body, color], i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = 96 + col * 560;
    const y = 206 + row * 124;
    addBox(slide, x, y, 500, 92, { fill: `${color}16`, line: `${color}55` });
    addText(slide, title, x + 24, y + 16, 430, 28, { size: 24, bold: true, color });
    addText(slide, body, x + 24, y + 52, 430, 24, { size: 19, color: C.muted });
  });
}

function addReadResultSlide(presentation) {
  const slide = baseSlide(presentation);
  addHeader(slide, 7, "如何读懂测评结果");
  const steps = [
    ["1", "三大特质排序", "例如 FTH / TFH / HFT，代表创业中的主驱动力顺序。"],
    ["2", "当前创业倾向", "先看三大特质，再看该特质内部更高的具体分型。"],
    ["3", "六大分型排名", "主分型、次分型、第三倾向共同构成你的创业者画像。"],
    ["4", "内核与外延", "内核代表稳定显现，外延代表情境性、过渡性或潜在倾向。"],
  ];
  steps.forEach(([num, title, body], i) => {
    const x = 86 + (i % 2) * 555;
    const y = 208 + Math.floor(i / 2) * 170;
    addBox(slide, x, y, 500, 122, { fill: "#111827DD", line: "#334155" });
    addText(slide, num, x + 24, y + 23, 54, 50, { size: 42, bold: true, color: C.gold, align: "center" });
    addText(slide, title, x + 96, y + 24, 360, 30, { size: 25, bold: true });
    addText(slide, body, x + 96, y + 64, 360, 44, { size: 18, color: C.muted });
  });
  addText(slide, "重点：结果要用于发展对话，而不是给创始人或团队贴固定标签。", 120, 602, 1040, 36, { size: 24, color: C.gold, bold: true, align: "center" });
}

function addReportSlide(presentation) {
  const slide = baseSlide(presentation);
  addHeader(slide, 8, "报告会给创始人什么");
  const rows = [
    ["典型优势", "看见天然强项，以及最容易形成势能的场景"],
    ["可能提醒", "识别高压或失衡时容易出现的经营盲区"],
    ["适合行业 / 业务场景", "把特质翻译成更适合发挥的业务类型"],
    ["团队使用说明书", "告诉团队如何汇报、沟通、协同和补位"],
    ["适合搭档类型", "识别最需要的合伙人、二把手或核心补位角色"],
  ];
  rows.forEach(([title, body], i) => {
    const y = 204 + i * 78;
    addText(slide, title, 112, y, 260, 32, { size: 25, bold: true, color: i === 3 ? C.gold : C.ink });
    addText(slide, body, 390, y + 2, 700, 32, { size: 22, color: C.muted });
    addRule(slide, 112, y + 50, 990, "#263244");
  });
}

function addManualSlide(presentation) {
  const slide = baseSlide(presentation);
  addHeader(slide, 9, "团队使用说明书：把创始人优势用对");
  featureCard(slide, 96, 210, 330, 270, "如何汇报", "先说结论、卡点和下一步。\n不同特质的创始人关注点不同。", C.gold);
  featureCard(slide, 475, 210, 330, 270, "如何决策", "F 看结果窗口，T 看逻辑结构，H 看人和协作影响。", C.thinker);
  featureCard(slide, 854, 210, 330, 270, "如何补位", "不要要求创始人全能。\n让团队承担他不天然擅长的那一块。", C.helper);
  addText(slide, "好团队不是复制创始人，而是补足创始人。", 120, 575, 1040, 42, { size: 31, bold: true, color: C.gold, align: "center" });
}

function addPartnerSlide(presentation) {
  const slide = baseSlide(presentation);
  addHeader(slide, 10, "适合搭档类型：创始人的最佳组合方式");
  const rows = [
    ["Fighter 主导", "优先搭配 Thinker 帮你拆清打法，再搭配 Helper 稳住团队和关系。", C.fighter],
    ["Thinker 主导", "优先搭配 Fighter 把判断推向市场，再搭配 Helper 处理共识和组织动员。", C.thinker],
    ["Helper 主导", "优先搭配 Fighter 增强破局与拍板，再搭配 Thinker 把经验沉淀成系统。", C.helper],
  ];
  rows.forEach(([title, body, color], i) => {
    const y = 212 + i * 132;
    addBox(slide, 112, y, 1020, 92, { fill: `${color}16`, line: `${color}66` });
    addText(slide, title, 148, y + 24, 240, 32, { size: 27, bold: true, color });
    addText(slide, body, 420, y + 23, 650, 42, { size: 22, color: C.muted });
  });
}

function addScanSlide(presentation, posterBytes) {
  const slide = baseSlide(presentation);
  addHeader(slide, 11, "扫码完成测评", "现场使用");
  addText(slide, "FTH创业者职业特质测评", 88, 210, 570, 60, { size: 45, bold: true });
  addText(slide, "建议现场完成后，用结果开启三类对话：自我理解、合伙人互补、团队协作方式。", 90, 292, 560, 94, { size: 25, color: C.muted });
  bulletList(slide, [
    "测评链接：https://fthboss.msrtai.com",
    "结果包含：特质排序、六型画像、适合行业、团队说明书。",
    "建议不要现场互相贴标签，而是讨论如何协作得更顺。"
  ], 102, 430, 590, 68, { size: 21 });
  slide.images.add({
    blob: posterBytes,
    contentType: "image/png",
    alt: "FTH创业者职业特质测评海报",
    fit: "contain",
    position: { left: 780, top: 96, width: 315, height: 420 },
    geometry: "roundRect",
    borderRadius: "rounded-lg",
  });
  addText(slide, "https://fthboss.msrtai.com", 752, 548, 370, 34, { size: 22, bold: true, color: C.gold, align: "center" });
}

async function main() {
  await fs.mkdir(path.dirname(OUT), { recursive: true });
  await fs.mkdir(PREVIEW_DIR, { recursive: true });
  await fs.mkdir(LAYOUT_DIR, { recursive: true });
  await fs.mkdir(QA_DIR, { recursive: true });

  const presentation = Presentation.create({ slideSize: { width: W, height: H } });
  addTitleSlide(presentation);
  addModelSlide(presentation);
  addAttributeSlide(presentation, 3, {
    title: "Fighter 进取者：前线破局与增长推进",
    kicker: "三大特质之一",
    big: "破局型能量",
    color: C.fighter,
    copy: "更适合把机会变成行动，把压力变成推进力，在不确定中抢出结果。",
    scenes: ["市场开拓", "融资冲刺", "关键客户", "增长突破"],
    warn: "提醒：速度和强度是优势，但团队也需要节奏、复盘和组织承压能力。",
  });
  addAttributeSlide(presentation, 4, {
    title: "Thinker 思辨者：战略判断与系统设计",
    kicker: "三大特质之一",
    big: "架构型能量",
    color: C.thinker,
    copy: "更适合看清问题本质，搭建产品、机制和长期可复用的经营系统。",
    scenes: ["战略选择", "商业模式", "产品架构", "复杂决策"],
    warn: "提醒：判断和结构是优势，但也需要真实市场反馈和执行节奏。",
  });
  addAttributeSlide(presentation, 5, {
    title: "Helper 赋能者：组织连接与长期经营",
    kicker: "三大特质之一",
    big: "组织型能量",
    color: C.helper,
    copy: "更适合建立信任、凝聚团队、经营客户关系，让组织持续协作和成长。",
    scenes: ["团队凝聚", "客户关系", "合伙人协同", "文化建设"],
    warn: "提醒：关系和稳定是优势，但关键窗口也需要果断拍板和外部突破。",
  });
  addSixTypesSlide(presentation);
  addReadResultSlide(presentation);
  addReportSlide(presentation);
  addManualSlide(presentation);
  addPartnerSlide(presentation);
  addScanSlide(presentation, await imageBytes(POSTER));

  for (const [index, slide] of presentation.slides.items.entries()) {
    const stem = `slide-${String(index + 1).padStart(2, "0")}`;
    await writeBlob(path.join(PREVIEW_DIR, `${stem}.png`), await presentation.export({ slide, format: "png", scale: 1 }));
    const layout = await slide.export({ format: "layout" });
    await fs.writeFile(path.join(LAYOUT_DIR, `${stem}.layout.json`), await layout.text());
  }

  await writeBlob(path.join(QA_DIR, "contact-sheet.webp"), await presentation.export({ format: "webp", montage: true, scale: 1 }));
  const pptx = await PresentationFile.exportPptx(presentation);
  await pptx.save(OUT);
  console.log(OUT);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
