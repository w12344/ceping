export const DRAFT_KEY = "lsa:v2:draft";
const CACHE_KEY = "lsa:v2:cache";
const DRAFT_VERSION = 3;
const FIXED_COUNT = 42;
const FIXED_PAGE_SIZE = 2;
const PREFERENCE_COUNT = 32;
const CALIBRATION_COUNT = 4;
const CALIBRATION_PAGE_SIZE = 4;
const PHONE_PATTERN = /^1[3-9]\d{9}$/;
const SHARED_TARGET_SUBJECTS = Object.freeze(["语文", "数学", "物理", "化学", "生物", "历史", "政治", "地理", "技术"]);
const RAW_TARGET_SUBJECTS = new Set(["语文", "数学", "英语", "日语"]);
const FOREIGN_LANGUAGE_OPTIONS = new Set(["英语", "日语", "其他"]);
export const PREFERENCE_SCALE = Object.freeze([
  Object.freeze({ value: 1, label: "完全不像我" }),
  Object.freeze({ value: 2, label: "不太像我" }),
  Object.freeze({ value: 3, label: "有一点像我" }),
  Object.freeze({ value: 4, label: "比较像我" }),
  Object.freeze({ value: 5, label: "非常像我" })
]);
export const STRATEGY_SCALE = Object.freeze([
  Object.freeze({ value: 1, label: "完全不像我" }),
  Object.freeze({ value: 2, label: "不太像我" }),
  Object.freeze({ value: 3, label: "有一点像我" }),
  Object.freeze({ value: 4, label: "比较像我" }),
  Object.freeze({ value: 5, label: "非常像我" })
]);

const STATIC_QUESTIONS = Object.freeze([
  {"id":"V01","kind":"preference","form":"core","preference":"V","subdimension":"information_location","process":"learning","scenarioType":"academic","direction":"positive","prompt":"老师讲新课时，我会先看标题、加粗字和题目里的关键条件。","scale":[1,2,3,4,5]},
  {"id":"V02","kind":"preference","form":"core","preference":"V","subdimension":"information_location","process":"memory","scenarioType":"life","direction":"reverse","prompt":"学习内容比较多时，就算有标记和提示，我有时也分不清哪些内容最重要。","scale":[1,2,3,4,5]},
  {"id":"V03","kind":"preference","form":"core","preference":"V","subdimension":"graphic_representation","process":"learning","scenarioType":"academic","direction":"positive","prompt":"碰到难懂的内容时，有图、有箭头或示意图，我通常会更容易理解。","scale":[1,2,3,4,5]},
  {"id":"V04","kind":"preference","form":"core","preference":"V","subdimension":"graphic_representation","process":"practice","scenarioType":"life","direction":"positive","prompt":"内容比较复杂时，画表格、列结构图，会让我更容易理清它们之间的关系。","scale":[1,2,3,4,5]},
  {"id":"V05","kind":"preference","form":"core","preference":"V","subdimension":"relationship_organization","process":"memory","scenarioType":"academic","direction":"positive","prompt":"复习一章内容时，如果知道知识点之间怎么联系，我更容易想起这一章讲了什么。","scale":[1,2,3,4,5]},
  {"id":"V06","kind":"preference","form":"core","preference":"V","subdimension":"relationship_organization","process":"improve","scenarioType":"academic","direction":"reverse","prompt":"几个知识点之间有联系时，就算整理过它们的关系，我有时还是不容易理解整体。","scale":[1,2,3,4,5]},
  {"id":"V07","kind":"preference","form":"core","preference":"V","subdimension":"difference_identification","process":"practice","scenarioType":"academic","direction":"positive","prompt":"两个知识点或题目很像时，放在一起比较，我更容易发现它们的区别。","scale":[1,2,3,4,5]},
  {"id":"V08","kind":"preference","form":"core","preference":"V","subdimension":"difference_identification","process":"improve","scenarioType":"academic","direction":"positive","prompt":"遇到看起来很像的题时，我会留意它和以前做过的题哪里不一样。","scale":[1,2,3,4,5]},
  {"id":"A01","kind":"preference","form":"core","preference":"A","subdimension":"explanation_comprehension","process":"learning","scenarioType":"life","direction":"positive","prompt":"第一次学一个新方法时，别人一步一步讲，我会更容易明白。","scale":[1,2,3,4,5]},
  {"id":"A02","kind":"preference","form":"core","preference":"A","subdimension":"explanation_comprehension","process":"improve","scenarioType":"academic","direction":"reverse","prompt":"别人只是口头讲错误原因时，我有时还是不容易真正弄懂。","scale":[1,2,3,4,5]},
  {"id":"A03","kind":"preference","form":"core","preference":"A","subdimension":"sound_cues","process":"memory","scenarioType":"academic","direction":"positive","prompt":"要记重要内容时，读出来或听到自己的声音，会让我更容易记住。","scale":[1,2,3,4,5]},
  {"id":"A04","kind":"preference","form":"core","preference":"A","subdimension":"sound_cues","process":"practice","scenarioType":"academic","direction":"positive","prompt":"老师上课强调过的关键词或总结的话，之后遇到类似问题时，会帮助我想起来。","scale":[1,2,3,4,5]},
  {"id":"A05","kind":"preference","form":"core","preference":"A","subdimension":"language_expression","process":"learning","scenarioType":"academic","direction":"positive","prompt":"学完一个内容后，用自己的话讲一遍，我更容易发现哪里还没懂。","scale":[1,2,3,4,5]},
  {"id":"A06","kind":"preference","form":"core","preference":"A","subdimension":"language_expression","process":"improve","scenarioType":"life","direction":"reverse","prompt":"有些时候，我自己感觉懂了，但一解释自己的想法，就不知道该怎么说。","scale":[1,2,3,4,5]},
  {"id":"A07","kind":"preference","form":"core","preference":"A","subdimension":"question_answer_interaction","process":"memory","scenarioType":"academic","direction":"positive","prompt":"复习时，如果有人问我几个问题，我更容易发现自己漏掉了什么。","scale":[1,2,3,4,5]},
  {"id":"A08","kind":"preference","form":"core","preference":"A","subdimension":"question_answer_interaction","process":"practice","scenarioType":"academic","direction":"positive","prompt":"讲题时，如果别人追问“为什么”，我更容易发现自己的思路哪里没想清楚。","scale":[1,2,3,4,5]},
  {"id":"R01","kind":"preference","form":"core","preference":"R","subdimension":"text_comprehension","process":"learning","scenarioType":"academic","direction":"positive","prompt":"学习一个新概念时，看到清楚的定义、条件和例子，我会更容易明白。","scale":[1,2,3,4,5]},
  {"id":"R02","kind":"preference","form":"core","preference":"R","subdimension":"text_comprehension","process":"memory","scenarioType":"life","direction":"reverse","prompt":"看完一段文字说明后，我有时还是抓不到里面最重要的信息。","scale":[1,2,3,4,5]},
  {"id":"R03","kind":"preference","form":"core","preference":"R","subdimension":"structure_organization","process":"learning","scenarioType":"academic","direction":"positive","prompt":"学完一部分内容后，把重点重新整理一下，我会觉得思路更清楚。","scale":[1,2,3,4,5]},
  {"id":"R04","kind":"preference","form":"core","preference":"R","subdimension":"structure_organization","process":"improve","scenarioType":"academic","direction":"positive","prompt":"订正错误时，把题目要求、自己的做法和错误原因写清楚，会帮助我找到问题。","scale":[1,2,3,4,5]},
  {"id":"R05","kind":"preference","form":"core","preference":"R","subdimension":"written_expression","process":"memory","scenarioType":"academic","direction":"positive","prompt":"不用看资料，把自己记得的内容写下来，有时能让我发现遗漏。","scale":[1,2,3,4,5]},
  {"id":"R06","kind":"preference","form":"core","preference":"R","subdimension":"written_expression","process":"practice","scenarioType":"academic","direction":"reverse","prompt":"做完一道题后，就算写过步骤，我有时还是不清楚自己的思路是否完整。","scale":[1,2,3,4,5]},
  {"id":"R07","kind":"preference","form":"core","preference":"R","subdimension":"rule_presentation","process":"practice","scenarioType":"life","direction":"positive","prompt":"学会一个方法后，我会想想这种方法什么时候能用。","scale":[1,2,3,4,5]},
  {"id":"R08","kind":"preference","form":"core","preference":"R","subdimension":"rule_presentation","process":"improve","scenarioType":"academic","direction":"positive","prompt":"做完一道比较复杂的题后，我会留意这类题有哪些条件和规律。","scale":[1,2,3,4,5]},
  {"id":"K01","kind":"preference","form":"core","preference":"K","subdimension":"case_entry","process":"learning","scenarioType":"academic","direction":"positive","prompt":"碰到抽象内容时，先看一个具体例子，我通常更容易理解。","scale":[1,2,3,4,5]},
  {"id":"K02","kind":"preference","form":"core","preference":"K","subdimension":"case_entry","process":"practice","scenarioType":"academic","direction":"reverse","prompt":"遇到没接触过的问题时，就算看过例子，我有时还是不知道第一步该怎么做。","scale":[1,2,3,4,5]},
  {"id":"K03","kind":"preference","form":"core","preference":"K","subdimension":"hands_on_trial","process":"learning","scenarioType":"life","direction":"positive","prompt":"刚学一个新方法时，我通常想先自己试一下，再慢慢理解。","scale":[1,2,3,4,5]},
  {"id":"K04","kind":"preference","form":"core","preference":"K","subdimension":"hands_on_trial","process":"memory","scenarioType":"academic","direction":"positive","prompt":"学过一种方法后，自己重新做一遍，会让我更清楚每一步应该怎么操作。","scale":[1,2,3,4,5]},
  {"id":"K05","kind":"preference","form":"core","preference":"K","subdimension":"process_rehearsal","process":"memory","scenarioType":"academic","direction":"positive","prompt":"学习一个步骤比较多的方法时，自己完整做一遍，会让我更容易掌握。","scale":[1,2,3,4,5]},
  {"id":"K06","kind":"preference","form":"core","preference":"K","subdimension":"process_rehearsal","process":"practice","scenarioType":"academic","direction":"reverse","prompt":"只看别人完成一个过程后，我自己重新做时，有时还是不知道下一步怎么进行。","scale":[1,2,3,4,5]},
  {"id":"K07","kind":"preference","form":"core","preference":"K","subdimension":"contextual_presentation","process":"improve","scenarioType":"academic","direction":"positive","prompt":"订正一道错题时，把正确方法重新放回题目里做一遍，会帮助我理解。","scale":[1,2,3,4,5]},
  {"id":"K08","kind":"preference","form":"core","preference":"K","subdimension":"contextual_presentation","process":"improve","scenarioType":"life","direction":"positive","prompt":"学一个知识后，如果能拿它解决实际问题，我会更容易明白它有什么用。","scale":[1,2,3,4,5]},
  {"id":"LS01","kind":"science","strategy":"active_recall","direction":"positive","prompt":"学习完一个内容后，我有试过不看资料，先想想自己记得什么。","scale":[1,2,3,4,5]},
  {"id":"LS02","kind":"science","strategy":"active_recall","direction":"reverse","prompt":"复习时，我通常直接看笔记，很少先回忆自己还记得多少。","scale":[1,2,3,4,5]},
  {"id":"LS03","kind":"science","strategy":"spaced_repetition","direction":"positive","prompt":"学过的内容，我有试过过几天再回来复习。","scale":[1,2,3,4,5]},
  {"id":"LS04","kind":"science","strategy":"spaced_repetition","direction":"reverse","prompt":"复习旧内容时，我更多是在考试前才重新看。","scale":[1,2,3,4,5]},
  {"id":"LS05","kind":"science","strategy":"deliberate_practice","direction":"positive","prompt":"遇到总是做错的问题，我有试过专门找类似问题再练几次。","scale":[1,2,3,4,5]},
  {"id":"LS06","kind":"science","strategy":"deliberate_practice","direction":"reverse","prompt":"做了很多题之后，我有时说不清这些题到底是在解决什么问题。","scale":[1,2,3,4,5]},
  {"id":"LS07","kind":"science","strategy":"timely_feedback","direction":"positive","prompt":"做错题后，我有试过先找原因，再重新做一次。","scale":[1,2,3,4,5]},
  {"id":"LS08","kind":"science","strategy":"timely_feedback","direction":"reverse","prompt":"看到答案知道错了之后，我有时会直接看过去，不再自己尝试。","scale":[1,2,3,4,5]},
  {"id":"LS09","kind":"science","strategy":"metacognition","direction":"positive","prompt":"发现一种学习方法不太有效时，我会试着换一种方式。","scale":[1,2,3,4,5]},
  {"id":"LS10","kind":"science","strategy":"metacognition","direction":"reverse","prompt":"即使现在的学习方式效果一般，我也经常继续按照原来的方式进行。","scale":[1,2,3,4,5]}
]);

export function paginateItems(items, pageSize) {
  if (!Array.isArray(items) || !Number.isInteger(pageSize) || pageSize < 2 || pageSize > 4) {
    throw new TypeError("分页参数无效");
  }
  if (items.length % pageSize !== 0) throw new RangeError("题目无法形成完整分页");
  const pages = [];
  for (let index = 0; index < items.length; index += pageSize) pages.push(items.slice(index, index + pageSize));
  return pages;
}

export function orderFixedItems(items) {
  if (!Array.isArray(items)) throw new TypeError("题目数据无效");
  return items.slice();
}

export function fixedPartHeading(pageIndex) {
  if (pageIndex === 0) return "第一部分 · 学习风格";
  if (pageIndex === PREFERENCE_COUNT / FIXED_PAGE_SIZE) return "第二部分 · 学习策略";
  return "";
}

export function fixedPartGuidance(pageIndex) {
  if (pageIndex === 0) return "请按平时最常出现的学习情况作答。";
  if (pageIndex === PREFERENCE_COUNT / FIXED_PAGE_SIZE) {
    return "下面只回想这些情况在之前学习时发生得多不多，没有正确答案。";
  }
  return "";
}

export function scaleForFixedIndex(index, preferenceScale = PREFERENCE_SCALE, strategyScale = STRATEGY_SCALE) {
  if (!Number.isInteger(index) || index < 0 || index >= FIXED_COUNT) throw new RangeError("题目序号无效");
  return index < PREFERENCE_COUNT ? preferenceScale : strategyScale;
}

export function targetSubjectsForLanguage(language) {
  if (!FOREIGN_LANGUAGE_OPTIONS.has(language)) throw new RangeError("外语科目无效");
  const sharedSubjects = ["语文", "数学", ...SHARED_TARGET_SUBJECTS.slice(2)];
  return language === "其他" ? ["语文", "数学", "英语", "日语", ...SHARED_TARGET_SUBJECTS.slice(2)] : ["语文", "数学", language, ...SHARED_TARGET_SUBJECTS.slice(2)];
}

export function fullScoreForTargetSubject(subject) {
  if (RAW_TARGET_SUBJECTS.has(subject)) return 150;
  if (SHARED_TARGET_SUBJECTS.slice(2).includes(subject)) return 100;
  throw new RangeError("目标学科无效");
}

export function questionGroupAccessibility(displayIndex) {
  if (!Number.isInteger(displayIndex) || displayIndex < 1) throw new RangeError("题目序号无效");
  const promptId = `question-prompt-${displayIndex}`;
  return { promptId, role: "radiogroup", labelledBy: promptId };
}

export function makeDraft({ sessionId, currentPage, answers, startedAt, itemOrder }) {
  return {
    version: DRAFT_VERSION,
    sessionId,
    currentPage,
    answers: Array.isArray(answers) ? answers : [],
    startedAt,
    itemOrder: Array.isArray(itemOrder) ? itemOrder : []
  };
}

function initialState() {
  return {
    sessionId: null,
    anonymousCode: null,
    currentPage: 0,
    answers: [],
    startedAt: null,
    itemOrder: [],
    fixedItems: [],
    calibrationItems: [],
    preferenceScale: PREFERENCE_SCALE,
    strategyScale: STRATEGY_SCALE,
    stage: "fixed",
    renderedAt: Date.now(),
    creatingSession: null,
    submitting: false
  };
}

let state = initialState();
let elements = null;

function byId(id) {
  return document.getElementById(id);
}

function safeParse(value) {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function cacheState() {
  return {
    version: DRAFT_VERSION,
    anonymousCode: state.anonymousCode,
    fixedItems: state.fixedItems,
    calibrationItems: state.calibrationItems,
    preferenceScale: state.preferenceScale,
    strategyScale: state.strategyScale,
    stage: state.stage
  };
}

function persistDraft() {
  if (!state.sessionId) return;
  const draft = makeDraft({
    sessionId: state.sessionId,
    currentPage: state.currentPage,
    answers: state.answers,
    startedAt: state.startedAt,
    itemOrder: state.itemOrder
  });
  localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  localStorage.setItem(CACHE_KEY, JSON.stringify(cacheState()));
}

function clearDraft() {
  localStorage.removeItem(DRAFT_KEY);
  localStorage.removeItem(CACHE_KEY);
}

function recoverDraft() {
  const draft = safeParse(localStorage.getItem(DRAFT_KEY));
  const cache = safeParse(localStorage.getItem(CACHE_KEY));
  if (!draft || !cache || draft.version !== DRAFT_VERSION || cache.version !== DRAFT_VERSION) return false;
  if (typeof draft.sessionId !== "string" || !Array.isArray(draft.answers) || !Array.isArray(cache.fixedItems)) return false;
  const itemById = new Map(cache.fixedItems.map((item) => [item.id, item]));
  const ordered = draft.itemOrder.map((id) => itemById.get(id)).filter(Boolean);
  if (ordered.length !== FIXED_COUNT) return false;

  state = {
    ...initialState(),
    sessionId: draft.sessionId,
    anonymousCode: cache.anonymousCode ?? null,
    currentPage: Number.isInteger(draft.currentPage) ? draft.currentPage : 0,
    answers: draft.answers,
    startedAt: draft.startedAt,
    itemOrder: draft.itemOrder,
    fixedItems: ordered,
    calibrationItems: Array.isArray(cache.calibrationItems) ? cache.calibrationItems : [],
    preferenceScale: Array.isArray(cache.preferenceScale) && cache.preferenceScale.length === 5
      ? cache.preferenceScale
      : PREFERENCE_SCALE,
    strategyScale: Array.isArray(cache.strategyScale) && cache.strategyScale.length === 5
      ? cache.strategyScale
      : STRATEGY_SCALE,
    stage: cache.stage === "calibration" ? "calibration" : "fixed"
  };
  return true;
}

function showView(target) {
  for (const view of [elements.startView, elements.basicView, elements.assessmentView, elements.submitErrorView]) {
    const active = view === target;
    view.hidden = !active;
    view.classList.toggle("is-active", active);
  }
  window.scrollTo({ top: 0, behavior: "auto" });
}

function setLoading(active, text = "正在准备测评...") {
  elements.loadingText.textContent = text;
  elements.loadingOverlay.hidden = !active;
}

async function requestJson(url, options) {
  const response = await fetch(url, {
    ...options,
    headers: { "content-type": "application/json", ...options?.headers }
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.error || "请求失败");
  return payload;
}

export function sessionPayload(form) {
  const targetSubject = form.targetSubject.value;
  const targetSubjectScore = form.targetSubjectScore.value === "" ? null : Number(form.targetSubjectScore.value);
  const targetSubjectFullScore = targetSubject ? fullScoreForTargetSubject(targetSubject) : null;
  return {
    studentName: form.studentName.value.trim(),
    phoneNumber: form.phoneNumber.value.trim(),
    privacyConsentedAt: new Date().toISOString(),
    grade: form.grade.value,
    scoreBand: form.scoreBand.value,
    specialtyDirection: form.specialtyDirection.value,
    foreignLanguage: form.foreignLanguage.value,
    targetSubject,
    targetSubjectScore,
    targetSubjectFullScore,
    learningFocus: form.learningFocus.value,
  };
}

export function validateSessionPayload(info) {
  if (info.studentName.length < 2 || info.studentName.length > 30) return "请填写 2 至 30 个字符的姓名。";
  if (!PHONE_PATTERN.test(info.phoneNumber)) return "请填写 11 位有效手机号。";
  if (!info.grade || !info.scoreBand || !info.specialtyDirection || !info.foreignLanguage || !info.targetSubject) {
    return "请完成全部单选信息，并选择一门目标学科。";
  }
  const fullScore = fullScoreForTargetSubject(info.targetSubject);
  if (
    typeof info.targetSubjectScore !== "number" ||
    !Number.isFinite(info.targetSubjectScore) ||
    Math.round(info.targetSubjectScore * 10) !== info.targetSubjectScore * 10 ||
    info.targetSubjectScore < 0 ||
    info.targetSubjectScore > fullScore
  ) {
    return `请填写 0 至 ${fullScore} 分的目标学科成绩，最多保留一位小数。`;
  }
  if (!["learning", "memory", "practice", "improve"].includes(info.learningFocus)) {
    return "请选择当前改善环节。";
  }
  return "";
}

export async function runSessionCreation({ state: lockState, button, setBusy, task }) {
  if (lockState.creatingSession) return false;
  const owner = {};
  lockState.creatingSession = owner;
  button.disabled = true;
  setBusy(true);
  try {
    await task(owner);
    return true;
  } finally {
    if (lockState.creatingSession === owner) {
      lockState.creatingSession = null;
      button.disabled = false;
      setBusy(false);
    }
  }
}

function updateTargetSubjects() {
  const language = elements.basicForm.querySelector('input[name="foreignLanguage"]:checked')?.value;
  const previous = elements.targetSubject.value;
  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = language ? "请选择一门目标学科" : "请先选择外语科目";
  elements.targetSubject.replaceChildren(placeholder);
  if (!language) {
    updateTargetSubjectScoreLimit();
    return;
  }
  const subjects = targetSubjectsForLanguage(language);
  for (const subject of subjects) {
    const option = document.createElement("option");
    option.value = subject;
    option.textContent = subject;
    elements.targetSubject.append(option);
  }
  elements.targetSubject.value = subjects.includes(previous) ? previous : "";
  updateTargetSubjectScoreLimit();
}

function updateTargetSubjectScoreLimit() {
  const subject = elements.targetSubject.value;
  if (!subject) {
    elements.targetSubjectScore.value = "";
    elements.targetSubjectScore.removeAttribute("max");
    elements.targetSubjectScoreHelp.textContent = "请先选择目标学科。";
    elements.targetSubjectScoreUnit.textContent = "/ -- 分";
    return;
  }

  const fullScore = fullScoreForTargetSubject(subject);
  elements.targetSubjectScore.max = String(fullScore);
  elements.targetSubjectScoreHelp.textContent = `填写最近一次较完整的阶段考试或模拟考试成绩，满分${fullScore}分。`;
  elements.targetSubjectScoreUnit.textContent = `/ ${fullScore} 分`;
  if (elements.targetSubjectScore.value !== "" && Number(elements.targetSubjectScore.value) > fullScore) {
    elements.targetSubjectScore.value = "";
  }
}

function answerFor(questionId) {
  return state.answers.find((answer) => answer.questionId === questionId);
}

function saveAnswer(answer) {
  state.answers = state.answers.filter(({ questionId }) => questionId !== answer.questionId);
  state.answers.push(answer);
  persistDraft();
  updateProgress();
}

function createScaleOption(item, scaleItem, questionIndex) {
  const label = document.createElement("label");
  label.className = "scale-option";
  const input = document.createElement("input");
  input.type = "radio";
  input.name = `response-${questionIndex}`;
  input.value = String(scaleItem.value);
  input.checked = answerFor(item.id)?.value === scaleItem.value;
  const display = document.createElement("span");
  const number = document.createElement("strong");
  number.textContent = String(scaleItem.value);
  const text = document.createElement("span");
  text.textContent = scaleItem.label;
  display.append(number, text);
  input.addEventListener("change", () => {
    saveAnswer({
      questionId: item.id,
      value: scaleItem.value,
      responseTimeMs: Math.max(0, Date.now() - state.renderedAt),
      answeredAt: new Date().toISOString()
    });
    elements.pageError.hidden = true;
  });
  label.append(input, display);
  return label;
}

function createBinaryOption(item, option, questionIndex) {
  const label = document.createElement("label");
  label.className = "binary-option";
  const input = document.createElement("input");
  input.type = "radio";
  input.name = `response-${questionIndex}`;
  input.checked = answerFor(item.id)?.optionId === option.id;
  const display = document.createElement("span");
  display.textContent = option.text;
  input.addEventListener("change", () => {
    saveAnswer({
      questionId: item.id,
      optionId: option.id,
      responseTimeMs: Math.max(0, Date.now() - state.renderedAt),
      answeredAt: new Date().toISOString()
    });
    elements.pageError.hidden = true;
  });
  label.append(input, display);
  return label;
}

function createQuestionCard(item, displayIndex) {
  const accessibility = questionGroupAccessibility(displayIndex);
  const article = document.createElement("article");
  article.className = "question-card";
  const index = document.createElement("p");
  index.className = "question-index";
  index.textContent = `Q${displayIndex}`;
  const prompt = document.createElement("p");
  prompt.className = "question-prompt";
  prompt.id = accessibility.promptId;
  prompt.textContent = item.prompt;
  const options = document.createElement("div");
  options.setAttribute("role", accessibility.role);
  options.setAttribute("aria-labelledby", accessibility.labelledBy);

  if (state.stage === "calibration") {
    options.className = "binary-list";
    item.options.forEach((option) => options.append(createBinaryOption(item, option, displayIndex)));
  } else {
    options.className = "scale-list";
    const scale = scaleForFixedIndex(displayIndex - 1, state.preferenceScale, state.strategyScale);
    scale.forEach((scaleItem) => options.append(createScaleOption(item, scaleItem, displayIndex)));
  }
  article.append(index, prompt, options);
  return article;
}

function currentPages() {
  return state.stage === "calibration"
    ? paginateItems(state.calibrationItems, CALIBRATION_PAGE_SIZE)
    : paginateItems(state.fixedItems, FIXED_PAGE_SIZE);
}

function currentPageItems() {
  return currentPages()[state.currentPage] ?? [];
}

function updateProgress() {
  const calibration = state.stage === "calibration";
  const total = calibration ? FIXED_COUNT + CALIBRATION_COUNT : FIXED_COUNT;
  const completed = state.answers.length;
  elements.completionText.textContent = `已完成 ${completed} / ${total}`;
  elements.progressBar.setAttribute("aria-valuemax", String(total));
  elements.progressBar.setAttribute("aria-valuenow", String(completed));
  elements.progressFill.style.width = `${Math.min(100, (completed / total) * 100)}%`;
}

function renderPage() {
  const pages = currentPages();
  state.currentPage = Math.max(0, Math.min(state.currentPage, pages.length - 1));
  const page = pages[state.currentPage];
  elements.questionList.replaceChildren();
  const partHeading = state.stage === "fixed" ? fixedPartHeading(state.currentPage) : "";
  if (partHeading) {
    const heading = document.createElement("h2");
    heading.className = "assessment-part-heading";
    heading.textContent = partHeading;
    elements.questionList.append(heading);
    const guidance = fixedPartGuidance(state.currentPage);
    if (guidance) {
      const description = document.createElement("p");
      description.className = "assessment-part-guidance";
      description.textContent = guidance;
      elements.questionList.append(description);
    }
  }
  const offset = state.stage === "calibration" ? FIXED_COUNT : state.currentPage * FIXED_PAGE_SIZE;
  page.forEach((item, index) => elements.questionList.append(createQuestionCard(item, offset + state.currentPage * (state.stage === "calibration" ? CALIBRATION_PAGE_SIZE : 0) + index + 1)));
  elements.previousButton.disabled = state.currentPage === 0;
  elements.nextButton.textContent = state.currentPage === pages.length - 1 ? (state.stage === "calibration" ? "生成报告" : "完成作答") : "下一页";
  elements.pageError.hidden = true;
  state.renderedAt = Date.now();
  persistDraft();
  updateProgress();
}

function pageComplete() {
  return currentPageItems().every((item) => Boolean(answerFor(item.id)));
}

function durationSeconds() {
  const start = Date.parse(state.startedAt);
  if (!Number.isFinite(start)) return 0;
  return Math.min(86_400, Math.max(0, Math.round((Date.now() - start) / 1000)));
}

function pickFirstValid(...candidates) {
  const genericPlaceholders = new Set(["", "用户", "顾问", "未知", "null", "undefined"]);
  for (const val of candidates) {
    if (val && typeof val === "string") {
      const trimmed = val.trim();
      if (trimmed && !genericPlaceholders.has(trimmed)) {
        return trimmed;
      }
    }
  }
  for (const val of candidates) {
    if (val && typeof val === "string" && val.trim()) {
      return val.trim();
    }
  }
  return "";
}

function parseAssessmentContextFromUrl() {
  const loc = typeof window !== "undefined" ? window.location : { search: "", hash: "" };
  const params = new URLSearchParams(loc.search || "");
  const hashParams = new URLSearchParams((loc.hash && loc.hash.includes("?") ? loc.hash.split("?")[1] : "") || "");
  const ctx = params.get("ctx") || hashParams.get("ctx");
  if (!ctx) return null;

  try {
    let base64 = ctx.replace(/-/g, "+").replace(/_/g, "/");
    while (base64.length % 4) base64 += "=";
    
    const jsonStr = decodeURIComponent(
      Array.prototype.map.call(atob(base64), c => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)).join("")
    );
    const data = JSON.parse(jsonStr);

    return {
      advisor: {
        token:  data.at || "",
        userId: data.au || "",
        name:   data.an || "",
        mobile: data.am || "",
      },
      student: {
        name:      data.sn || "",
        mobile:    data.sm || "",
        profileId: data.sp || "",
      }
    };
  } catch (e) {
    console.warn("解析 ctx 加密串失败:", e);
    return null;
  }
}

async function finalSubmit() {
  if (state.submitting) return;
  state.submitting = true;
  setLoading(true, "正在生成测评报告...");
  try {
    const ctxData = parseAssessmentContextFromUrl();
    const loc = typeof window !== "undefined" ? window.location : { search: "", hash: "" };
    const searchParams = new URLSearchParams(loc.search || "");
    const hashParamsObj = new URLSearchParams((loc.hash && loc.hash.includes("?") ? loc.hash.split("?")[1] : "") || "");
    const getParam = (k) => searchParams.get(k) || hashParamsObj.get(k) || "";

    const token = pickFirstValid(getParam("ref"), getParam("token"), getParam("advisorToken"), ctxData?.advisor.token, localStorage.getItem("advisor_token"), localStorage.getItem("feifan_ref"));

    if (token) {
      try {
        localStorage.setItem("advisor_token", token);
        localStorage.setItem("feifan_ref", token);
      } catch (e) {}
    }

    const studentName = pickFirstValid(getParam("studentName"), getParam("name"), getParam("customerName"), ctxData?.student.name, state.studentName, state.userInfo?.studentName, localStorage.getItem("student_name"));
    const phoneNumber = pickFirstValid(getParam("studentMobile"), getParam("mobile"), getParam("phone"), getParam("customerMobile"), ctxData?.student.mobile, state.phoneNumber, state.userInfo?.phoneNumber, localStorage.getItem("student_mobile"));

    const userInfo = state.userInfo || {
      studentName,
      phoneNumber,
      grade: state.grade,
      targetSubject: state.targetSubject,
      learningFocus: state.learningFocus,
      targetSubjectScore: state.targetSubjectScore,
      targetSubjectFullScore: state.targetSubject ? fullScoreForTargetSubject(state.targetSubject) : null
    };
    if (!userInfo.targetSubjectFullScore && userInfo.targetSubject) {
      userInfo.targetSubjectFullScore = fullScoreForTargetSubject(userInfo.targetSubject);
    }

    const reportSession = state.sessionId || String(Date.now());

    const advisorToken = token;
    const advisorUserId = pickFirstValid(getParam("userId"), getParam("employeeId"), getParam("advisorUserId"), ctxData?.advisor.userId, localStorage.getItem("advisor_user_id"));
    const advisorName = pickFirstValid(getParam("employeeName"), getParam("advisorName"), ctxData?.advisor.name, localStorage.getItem("advisor_name"));
    const advisorMobile = pickFirstValid(getParam("advisorMobile"), getParam("employeeMobile"), ctxData?.advisor.mobile, localStorage.getItem("advisor_mobile"));
    const profileId = pickFirstValid(getParam("profileId"), getParam("customerId"), ctxData?.student.profileId, localStorage.getItem("profile_id"));

    // 提交测评结果至 FFCRM 后端统一保存接口，并等待调用成功
    let recordId = null;
    try {
      const backendBase = "https://ffcrm-api.1605ai.com";
      const response = await fetch(`${backendBase}/api/assessment/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          templateCode: "学习风格",
          token: advisorToken,
          advisorToken: advisorToken,
          advisorUserId: advisorUserId,
          advisorName: advisorName,
          advisorMobile: advisorMobile,
          profileId: profileId,
          customerId: profileId,
          studentName: studentName,
          studentMobile: phoneNumber,
          name: studentName,
          contact: phoneNumber,
          session: reportSession,
          userInfo: {
            ...userInfo,
            advisorToken,
            advisorUserId,
            advisorName,
            advisorMobile,
            profileId
          },
          grade: userInfo.grade || state.grade,
          targetSubject: userInfo.targetSubject || state.targetSubject,
          learningFocus: userInfo.learningFocus || state.learningFocus,
          targetSubjectScore: userInfo.targetSubjectScore || state.targetSubjectScore,
          targetSubjectFullScore: userInfo.targetSubjectFullScore,
          reportUrl: (typeof window !== "undefined" ? window.location.origin : "https://ceping.1605ai.com") + "/report.html",
          answers: state.answers,
          durationSeconds: durationSeconds(),
          submittedAt: new Date().toISOString()
        })
      });
      const resData = await response.json().catch(() => ({}));
      if (response.ok && (resData.code === 0 || resData.code === 200)) {
        if (resData.data && (resData.data.id || resData.data.savedId)) {
          recordId = resData.data.id || resData.data.savedId;
        }
      } else {
        console.warn("后端保存结果接口返回提示:", resData);
      }
    } catch (e) {
      console.warn("后端保存结果接口调用异常:", e);
    }

    clearDraft();
    if (phoneNumber) localStorage.setItem("lsa_last_mobile", phoneNumber);
    localStorage.setItem("lsa_session_" + reportSession, JSON.stringify({
      session: reportSession,
      sessionId: reportSession,
      token: token,
      advisorToken: token,
      userInfo: userInfo,
      answers: state.answers,
      grade: userInfo.grade || state.grade,
      targetSubject: userInfo.targetSubject || state.targetSubject,
      learningFocus: userInfo.learningFocus || state.learningFocus,
      targetSubjectScore: userInfo.targetSubjectScore ?? state.targetSubjectScore,
      targetSubjectFullScore: userInfo.targetSubjectFullScore ?? state.targetSubjectFullScore,
      durationSeconds: durationSeconds(),
      startedAt: state.startedAt,
      completedAt: new Date().toISOString()
    }));

    // 接口调用成功/完成后，等待 1 秒再跳转到 report 页面
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (recordId) {
      window.location.assign(`/report.html?id=${encodeURIComponent(recordId)}`);
    } else {
      persistDraft();
      showView(elements.submitErrorView);
    }
  } catch {
    persistDraft();
    showView(elements.submitErrorView);
  } finally {
    state.submitting = false;
    setLoading(false);
  }
}

async function advancePage() {
  if (!pageComplete()) {
    elements.pageError.hidden = false;
    elements.pageError.scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }
  const pages = currentPages();
  if (state.currentPage < pages.length - 1) {
    state.currentPage += 1;
    renderPage();
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }
  await finalSubmit();
}

async function createSession(event) {
  event.preventDefault();
  if (state.creatingSession) return;
  const info = sessionPayload(elements.basicForm);
  const error = validateSessionPayload(info);
  if (error) {
    elements.basicError.textContent = error;
    elements.basicError.hidden = false;
    return;
  }
  elements.basicError.hidden = true;

  const sessionId = "session_" + Date.now();
  const ordered = orderFixedItems(STATIC_QUESTIONS);

  state.studentName = info.studentName;
  state.phoneNumber = info.phoneNumber;
  state.userInfo = info;

  Object.assign(state, {
    ...initialState(),
    studentName: info.studentName,
    phoneNumber: info.phoneNumber,
    userInfo: info,
    creatingSession: false,
    sessionId: sessionId,
    anonymousCode: null,
    startedAt: new Date().toISOString(),
    itemOrder: ordered.map(({ id }) => id),
    fixedItems: ordered,
    preferenceScale: PREFERENCE_SCALE,
    strategyScale: STRATEGY_SCALE
  });

  persistDraft();
  showView(elements.assessmentView);
  renderPage();
}

function bindEvents() {
  elements.startButton.addEventListener("click", () => showView(elements.basicView));
  elements.basicBackButton.addEventListener("click", () => showView(elements.startView));
  elements.basicForm.addEventListener("submit", createSession);
  for (const input of elements.basicForm.querySelectorAll('input[name="foreignLanguage"]')) {
    input.addEventListener("change", updateTargetSubjects);
  }
  elements.targetSubject.addEventListener("change", updateTargetSubjectScoreLimit);
  for (const control of elements.basicForm.querySelectorAll("input, select")) {
    const refreshError = () => {
      if (elements.basicError.hidden) return;
      const error = validateSessionPayload(sessionPayload(elements.basicForm));
      elements.basicError.textContent = error;
      elements.basicError.hidden = !error;
    };
    control.addEventListener("input", refreshError);
    control.addEventListener("change", refreshError);
  }
  elements.previousButton.addEventListener("click", () => {
    if (state.currentPage > 0) {
      state.currentPage -= 1;
      renderPage();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  });
  elements.nextButton.addEventListener("click", advancePage);
  elements.retryButton.addEventListener("click", () => {
    if (state.stage === "calibration" && state.answers.length < FIXED_COUNT + CALIBRATION_COUNT) {
      showView(elements.assessmentView);
      renderPage();
    } else if (state.answers.length === FIXED_COUNT && state.stage === "fixed") {
      prepareResult();
    } else {
      finalSubmit();
    }
  });
  elements.resumeButton.addEventListener("click", () => {
    showView(elements.assessmentView);
    renderPage();
  });
}

function autoFillInputsFromUrlContext() {
  const ctxData = parseAssessmentContextFromUrl();
  const loc = typeof window !== "undefined" ? window.location : { search: "", hash: "" };
  const searchParams = new URLSearchParams(loc.search || "");
  const hashParamsObj = new URLSearchParams((loc.hash && loc.hash.includes("?") ? loc.hash.split("?")[1] : "") || "");
  const getParam = (k) => searchParams.get(k) || hashParamsObj.get(k) || "";

  const studentName = (ctxData && ctxData.student.name) || getParam("studentName") || getParam("name") || localStorage.getItem("student_name") || "";
  const phoneNumber = (ctxData && ctxData.student.mobile) || getParam("studentMobile") || getParam("mobile") || getParam("phone") || localStorage.getItem("student_mobile") || "";

  if (elements.basicForm) {
    if (studentName && elements.basicForm.studentName && !elements.basicForm.studentName.value) {
      elements.basicForm.studentName.value = studentName;
      elements.basicForm.studentName.dispatchEvent(new Event("input", { bubbles: true }));
      elements.basicForm.studentName.dispatchEvent(new Event("change", { bubbles: true }));
    }

    if (phoneNumber && elements.basicForm.phoneNumber && !elements.basicForm.phoneNumber.value) {
      elements.basicForm.phoneNumber.value = phoneNumber;
      elements.basicForm.phoneNumber.dispatchEvent(new Event("input", { bubbles: true }));
      elements.basicForm.phoneNumber.dispatchEvent(new Event("change", { bubbles: true }));
    }
  }
}

function bootstrap() {
  elements = {
    startView: byId("startView"),
    basicView: byId("basicView"),
    assessmentView: byId("assessmentView"),
    submitErrorView: byId("submitErrorView"),
    startButton: byId("startButton"),
    resumeButton: byId("resumeButton"),
    basicForm: byId("basicForm"),
    basicBackButton: byId("basicBackButton"),
    createSessionButton: byId("createSessionButton"),
    basicError: byId("basicError"),
    targetSubject: byId("targetSubject"),
    targetSubjectScore: byId("targetSubjectScore"),
    targetSubjectScoreHelp: byId("targetSubjectScoreHelp"),
    targetSubjectScoreUnit: byId("targetSubjectScoreUnit"),
    questionList: byId("questionList"),
    completionText: byId("completionText"),
    progressBar: byId("progressBar"),
    progressFill: byId("progressFill"),
    previousButton: byId("previousButton"),
    nextButton: byId("nextButton"),
    pageError: byId("pageError"),
    retryButton: byId("retryButton"),
    loadingOverlay: byId("loadingOverlay"),
    loadingText: byId("loadingText")
  };
  bindEvents();
  autoFillInputsFromUrlContext();
  if (recoverDraft()) elements.resumeButton.hidden = false;
}

window.oneClickAutoFillAndAnswer = async function () {
  console.log("⚡ [一键自动填表 & 自动答题] 启动中...");

  if (!elements.basicView.classList.contains("is-active") && !elements.assessmentView.classList.contains("is-active")) {
    showView(elements.basicView);
  }

  if (elements.basicView.classList.contains("is-active")) {
    const form = elements.basicForm;
    if (!form.studentName.value) form.studentName.value = "测试学员";
    if (!form.phoneNumber.value) form.phoneNumber.value = "15765778832";

    const setRadio = (name, val) => {
      const radio = form.querySelector(`input[name="${name}"][value="${val}"]`) || form.querySelector(`input[name="${name}"]`);
      if (radio) radio.checked = true;
    };
    setRadio("grade", "高三");
    setRadio("specialtyDirection", "美术设计");
    setRadio("scoreBand", "400至450");
    setRadio("foreignLanguage", "英语");
    setRadio("learningFocus", "practice");

    updateTargetSubjects();
    if (elements.targetSubject.options.length > 1) {
      elements.targetSubject.selectedIndex = 1;
      updateTargetSubjectScoreLimit();
    }
    if (!elements.targetSubjectScore.value) {
      elements.targetSubjectScore.value = "110";
    }

    for (const input of form.querySelectorAll("input, select")) {
      input.dispatchEvent(new Event("input", { bubbles: true }));
      input.dispatchEvent(new Event("change", { bubbles: true }));
    }

    const submitBtn = elements.createSessionButton;
    if (submitBtn) submitBtn.click();
    await new Promise((r) => setTimeout(r, 200));
  }

  if (elements.assessmentView.classList.contains("is-active")) {
    const pages = currentPages();
    for (let p = 0; p < pages.length; p++) {
      state.currentPage = p;
      const pageItems = pages[p];
      for (const item of pageItems) {
        if (!state.answers.some((a) => a.questionId === item.id)) {
          state.answers.push({
            questionId: item.id,
            value: 4,
            responseTimeMs: 300,
            answeredAt: new Date().toISOString()
          });
        }
      }
    }
    state.currentPage = pages.length - 1;
    renderPage();
    console.log("✅ 全部 42 道题目已完成！点击【下一页】或【提交】直接生成报告！");
  }
};

if (typeof document !== "undefined") {
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", bootstrap, { once: true });
  else bootstrap();
}
