export const DRAFT_KEY = "lsa:learning-mode:scenario-v2";
const DRAFT_VERSION = 7;
const TOTAL_QUESTIONS = 20;
const SUBJECTS = Object.freeze(["语文", "数学", "英语", "日语", "物理", "化学", "生物", "政治", "历史", "地理"]);
const FOREIGN_LANGUAGES = Object.freeze(["英语", "日语", "其他"]);

// 20 道情境化题库（完全对齐 v2.7 标准题库）
const option = (id, mode, specificMode, text) => Object.freeze({ id, mode, specificMode, text });
const question = (id, group, prompt, options) => Object.freeze({ id, group, prompt, options: Object.freeze(options) });

export const QUESTIONS = Object.freeze([
  question("Q01", "learn", "老师刚讲完一个新内容，你还没弄懂。你会——", [
    option("Q01-A", "V", "structure_mapping", "画出几个重点怎么连。"),
    option("Q01-B", "A", "interactive_clarification", "说出没懂的地方，去问清。"),
    option("Q01-C", "R", "reading_comprehension", "回到笔记，把这一段再读一遍。"),
    option("Q01-D", "K", "contextual_immersion", "找一道用到这个新内容的小题，看看它具体怎么用。")
  ]),
  question("Q02", "learn", "有几个新词要记。你会——", [
    option("Q02-A", "V", "image_association", "给每个词配一个记号或小图。"),
    option("Q02-B", "A", "sound_cues", "读出来，读到顺口为止。"),
    option("Q02-C", "R", "note_organization", "每个只记一个关键词。"),
    option("Q02-D", "K", "contextual_immersion", "用这个词自己造一句话。")
  ]),
  question("Q03", "learn", "一套方法有好几步，你想把顺序记清。你会——", [
    option("Q03-A", "V", "spatial_relationship", "用箭头把顺序排出来。"),
    option("Q03-B", "A", "sound_cues", "按顺序把这些步骤念几遍。"),
    option("Q03-C", "R", "note_organization", "把每一步要做什么，写下来。"),
    option("Q03-D", "K", "process_rehearsal", "找一道短题，照着步骤完整做一遍。")
  ]),
  question("Q04", "learn", "新学的内容和以前学过的很像，容易混。你会——", [
    option("Q04-A", "V", "image_association", "给新旧内容各配一个不同的小图或符号。"),
    option("Q04-B", "A", "interactive_clarification", "问别人：“它们到底差在哪？”"),
    option("Q04-C", "R", "written_synthesis", "用自己的话写一句它们最关键的区别。"),
    option("Q04-D", "K", "hands_on_operation", "各找一道小题，分别试一步。")
  ]),
  question("Q05", "learn", "看一张解题流程图时，有一步没看懂。你会——", [
    option("Q05-A", "A", "interactive_clarification", "指着这一步，请人讲讲。"),
    option("Q05-B", "R", "reading_comprehension", "读这一步旁边的说明。"),
    option("Q05-C", "K", "hands_on_operation", "在草稿上，照着前一步接着写。"),
    option("Q05-D", "V", "spatial_relationship", "看看这一步该接在哪一步后面。")
  ]),
  question("Q06", "remember", "一条规则配着一道例题，你想知道规则怎么用。你会——", [
    option("Q06-A", "A", "spoken_explanation", "听别人讲这条规则怎么用。"),
    option("Q06-B", "R", "reading_comprehension", "再读一遍规则和例题旁的说明。"),
    option("Q06-C", "K", "process_rehearsal", "盖住例题，照着规则完整做一遍。"),
    option("Q06-D", "V", "image_association", "用小图画出这条规则在例题里怎么用。")
  ]),
  question("Q07", "remember", "一个概念总记不住。你会——", [
    option("Q07-A", "A", "spoken_explanation", "听老师或同学讲讲，这个概念到底是什么意思。"),
    option("Q07-B", "R", "note_organization", "写下它的重要关键词。"),
    option("Q07-C", "K", "contextual_immersion", "拿刚才的例题，看看这个概念怎么用。"),
    option("Q07-D", "V", "image_association", "画一个和它有关的小图。")
  ]),
  question("Q08", "remember", "一道错题知道答案了，但不知道自己错在哪。你会——", [
    option("Q08-A", "A", "interactive_clarification", "说说自己当时怎么想，再问问错在哪。"),
    option("Q08-B", "R", "note_organization", "写下这次错的是哪一步。"),
    option("Q08-C", "K", "process_rehearsal", "盖住答案，按正确方法完整做一遍。"),
    option("Q08-D", "V", "structure_mapping", "把自己的做法和正确做法放一起看。")
  ]),
  question("Q09", "remember", "做题时条件很多，不知道先用哪一个。你会——", [
    option("Q09-A", "R", "reading_comprehension", "重读题目，弄清每个条件的意思。"),
    option("Q09-B", "K", "hands_on_operation", "挑一个条件，在草稿上试着用一用。"),
    option("Q09-C", "V", "structure_mapping", "看条件和问题怎么连。"),
    option("Q09-D", "A", "interactive_clarification", "把判断说给同学听，问问有没有漏。")
  ]),
  question("Q10", "remember", "你要把一个重点讲给同学听。你会——", [
    option("Q10-A", "R", "written_synthesis", "先用自己的话写下来。"),
    option("Q10-B", "K", "contextual_immersion", "找一道老师讲过的例题来说明。"),
    option("Q10-C", "V", "structure_mapping", "先画一张关系图。"),
    option("Q10-D", "A", "spoken_explanation", "先听老师或同学讲讲，这个重点怎么解释。")
  ]),
  question("Q11", "practice", "零散的内容很多，想整理好以后复习。你会——", [
    option("Q11-A", "R", "written_synthesis", "用自己的话，把这些内容分成几条写下来。"),
    option("Q11-B", "K", "contextual_immersion", "给每一类内容配一个具体例子。"),
    option("Q11-C", "V", "image_association", "给每一类内容画一个不同记号。"),
    option("Q11-D", "A", "spoken_explanation", "听同学把这些内容分成几类讲一讲。")
  ]),
  question("Q12", "practice", "老师教了一套检查答案的方法，你想下次自己也会用。你会——", [
    option("Q12-A", "R", "note_organization", "给每一步记一个提醒词。"),
    option("Q12-B", "K", "process_rehearsal", "拿一道做完的题，照着这套方法完整检查一遍。"),
    option("Q12-C", "V", "spatial_relationship", "用箭头把几个检查步骤按先后连起来。"),
    option("Q12-D", "A", "sound_cues", "把几个检查步骤按顺序念几遍。")
  ]),
  question("Q13", "practice", "准备课堂展示时，你想先把整个过程理清。你会——", [
    option("Q13-A", "K", "process_rehearsal", "从上台到结束，实际排练一遍。"),
    option("Q13-B", "V", "spatial_relationship", "把展示的几部分按先后排在纸上。"),
    option("Q13-C", "A", "sound_cues", "把开头和衔接的话小声念几遍。"),
    option("Q13-D", "R", "note_organization", "写下每一部分要说什么。")
  ]),
  question("Q14", "practice", "一道题有两种做法，不知道用哪一种。你会——", [
    option("Q14-A", "K", "hands_on_operation", "两种做法各试一步，看哪种接得上。"),
    option("Q14-B", "V", "structure_mapping", "看两种做法各适合哪些条件。"),
    option("Q14-C", "A", "interactive_clarification", "问问两种做法各适合什么题。"),
    option("Q14-D", "R", "reading_comprehension", "看笔记，找出两种做法各适合什么情况。")
  ]),
  question("Q15", "practice", "课本上有一段话比较抽象，你想把意思弄明白。你会——", [
    option("Q15-A", "K", "contextual_immersion", "找一个符合这段话的具体例子。"),
    option("Q15-B", "V", "image_association", "把这段话画成一个简单的小图。"),
    option("Q15-C", "A", "spoken_explanation", "听老师或同学讲讲，这段话在说什么。"),
    option("Q15-D", "R", "written_synthesis", "用自己的话，把这段话改写成一句好懂的话。")
  ]),
  question("Q16", "repair", "刚订正完一道题，你想记住这次错在哪里。你会——", [
    option("Q16-A", "K", "process_rehearsal", "不看答案，把这道题完整重做一遍。"),
    option("Q16-B", "V", "structure_mapping", "把“易错点”和“正确做法”连起来。"),
    option("Q16-C", "A", "sound_cues", "把正确做法顺着念几遍。"),
    option("Q16-D", "R", "reading_comprehension", "重读订正，找出自己这次漏了什么。")
  ]),
  question("Q17", "repair", "第一次去新考场或新教室，怕走错。你会——", [
    option("Q17-A", "V", "spatial_relationship", "看平面图，把沿路几个明显的位置按先后记住。"),
    option("Q17-B", "A", "interactive_clarification", "问人怎么走，再听一遍。"),
    option("Q17-C", "R", "note_organization", "写下楼层、方向和教室号。"),
    option("Q17-D", "K", "process_rehearsal", "提前走一遍，从门口找到教室。")
  ]),
  question("Q18", "repair", "老师示范了一道题的答案，你想下次自己也能写完整。你会——", [
    option("Q18-A", "A", "sound_cues", "把答案里的几个要点读出声。"),
    option("Q18-B", "R", "note_organization", "写下答案里必须写到的要点。"),
    option("Q18-C", "K", "hands_on_operation", "照着这个答案，在草稿上写一遍。"),
    option("Q18-D", "V", "spatial_relationship", "把答案的要点按顺序排在纸上。")
  ]),
  question("Q19", "repair", "几个知识点学完后，你想弄清它们怎么连。你会——", [
    option("Q19-A", "R", "written_synthesis", "写下每个知识点，再写它们怎么连。"),
    option("Q19-B", "K", "contextual_immersion", "给每个知识点配个例子，再看它们怎么连。"),
    option("Q19-C", "V", "structure_mapping", "用线把几个知识点连成一张图。"),
    option("Q19-D", "A", "spoken_explanation", "听别人讲讲，几个知识点是怎么连起来的。")
  ]),
  question("Q20", "repair", "复习完一页内容，你想看看自己是不是真的懂了。你会——", [
    option("Q20-A", "K", "hands_on_operation", "找一道相关小题，先试着做。"),
    option("Q20-B", "V", "structure_mapping", "画出这页几个重点怎么连。"),
    option("Q20-C", "A", "spoken_explanation", "找一段讲这页内容的讲解，听一遍。"),
    option("Q20-D", "R", "written_synthesis", "合上书，用自己的话写下这页内容。")
  ])
]);

export function targetSubjectsForLanguage(language) {
  if (!FOREIGN_LANGUAGES.includes(language)) return SUBJECTS;
  return SUBJECTS.filter((subject) => subject !== "英语" && subject !== "日语").concat(language === "其他" ? [] : [language]);
}

const state = {
  sessionId: null,
  items: [...QUESTIONS],
  answers: [],
  currentIndex: 0,
  normalQuestionCount: TOTAL_QUESTIONS,
  startedAt: null,
  submitting: false,
  userInfo: null,
  questionOpenedAt: new Map()
};

const byId = (id) => document.getElementById(id);
let elements = null;

function getElements() {
  if (elements) return elements;
  elements = {
    startView: byId("startView"),
    basicView: byId("basicView"),
    assessmentView: byId("assessmentView"),
    submitErrorView: byId("submitErrorView"),
    contentLayoutWrapper: byId("contentLayoutWrapper"),
    startButton: byId("startButton"),
    resumeButton: byId("resumeButton"),
    basicForm: byId("basicForm"),
    basicBackButton: byId("basicBackButton"),
    targetSubject: byId("targetSubject"),
    basicError: byId("basicError"),
    questionList: byId("questionList"),
    completionText: byId("completionText"),
    pageText: byId("pageText"),
    progressBar: byId("progressBar"),
    progressFill: byId("progressFill"),
    pageError: byId("pageError"),
    previousButton: byId("previousButton"),
    nextButton: byId("nextButton"),
    retryButton: byId("retryButton"),
    loadingOverlay: byId("loadingOverlay"),
    loadingText: byId("loadingText")
  };
  return elements;
}

export function isCompleteAnswer(answer) {
  return Array.isArray(answer?.optionIds) && answer.optionIds.length > 0;
}

export function completionCount(answers) {
  return answers.filter(isCompleteAnswer).length;
}

export function replaceAnswer(answers, answer) {
  const remaining = answers.filter(({ questionId }) => questionId !== answer.questionId);
  if (!isCompleteAnswer(answer)) return remaining;
  const normalized = { ...answer, optionIds: [...answer.optionIds] };
  return [...remaining, normalized];
}

export function toggleOption(answers, questionId, optionId, openedAt, now) {
  const current = answers.find((answer) => answer.questionId === questionId);
  const selected = new Set(current?.optionIds ?? []);
  if (selected.has(optionId)) selected.delete(optionId);
  else selected.add(optionId);
  return replaceAnswer(answers, { questionId, optionIds: [...selected], responseTimeMs: Math.max(0, now - openedAt) });
}

function persistDraft() {
  if (state.sessionId) {
    localStorage.setItem(DRAFT_KEY, JSON.stringify({
      version: DRAFT_VERSION,
      sessionId: state.sessionId,
      items: state.items,
      answers: state.answers,
      currentIndex: state.currentIndex,
      normalQuestionCount: state.normalQuestionCount,
      startedAt: state.startedAt,
      userInfo: state.userInfo
    }));
  }
}

function clearDraft() {
  localStorage.removeItem(DRAFT_KEY);
}

function loadDraft() {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    const draft = JSON.parse(raw);
    return draft?.version === DRAFT_VERSION && draft.sessionId ? draft : null;
  } catch {
    return null;
  }
}

function answerFor(questionId) {
  return state.answers.find((answer) => answer.questionId === questionId);
}

function openedAtFor(questionId) {
  if (!state.questionOpenedAt.has(questionId)) state.questionOpenedAt.set(questionId, Date.now());
  return state.questionOpenedAt.get(questionId);
}

function updateStepIndicators(stepNum) {
  // 1. PC 端侧边栏步骤
  document.querySelectorAll(".sidebar-step-item").forEach((el, idx) => {
    const s = idx + 1;
    el.classList.toggle("is-active", s === stepNum);
    el.classList.toggle("is-completed", s < stepNum);
  });
  document.querySelectorAll(".sidebar-step-connector, .step-connector").forEach((el, idx) => {
    el.classList.toggle("is-completed", (idx + 1) < stepNum);
  });

  // 2. 移动端步骤条
  document.querySelectorAll(".mobile-step-item").forEach((el) => {
    const s = parseInt(el.getAttribute("data-step") || "0", 10);
    el.classList.toggle("is-active", s === stepNum);
    el.classList.toggle("is-completed", s < stepNum);
  });
  document.querySelectorAll(".mobile-step-line").forEach((el) => {
    const s = parseInt(el.getAttribute("data-step-line") || "0", 10);
    el.classList.toggle("is-completed", s < stepNum);
  });
}

function setupAndroidEnvironment() {
  if (typeof window === "undefined" || typeof navigator === "undefined") return;
  const ua = navigator.userAgent || "";
  const isAndroidUa = /Android/i.test(ua);
  const hasAndroidBridge = !!(window.AndroidBridge || window.CommonBridge || window.Android);
  const params = new URLSearchParams(window.location.search);
  const hash = window.location.hash || "";
  const hashParams = new URLSearchParams(hash.includes("?") ? hash.split("?")[1] : "");
  const hasAndroidParam = ["android", "app_android"].includes(params.get("platform") || params.get("env") || params.get("client") || hashParams.get("platform") || hashParams.get("env") || "");
  
  if (isAndroidUa || hasAndroidBridge || hasAndroidParam) {
    document.documentElement.classList.add("is-android");
    document.body?.classList.add("is-android");
  } else {
    document.documentElement.classList.remove("is-android");
    document.body?.classList.remove("is-android");
  }
}

function showView(active) {
  const els = getElements();
  for (const view of [els.startView, els.basicView, els.assessmentView, els.submitErrorView]) {
    if (!view) continue;
    const visible = view === active;
    view.hidden = !visible;
    view.classList.toggle("is-active", visible);
  }
  if (els.contentLayoutWrapper) {
    els.contentLayoutWrapper.style.display = (active === els.startView) ? "none" : "";
  }
  if (active === els.basicView) {
    updateStepIndicators(1);
  } else if (active === els.assessmentView) {
    updateStepIndicators(2);
  }
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function setLoading(active, message = "正在处理...") {
  const els = getElements();
  if (els.loadingText) els.loadingText.textContent = message;
  if (els.loadingOverlay) els.loadingOverlay.hidden = !active;
}

function optionCard(item, index) {
  const article = document.createElement("article");
  article.className = "question-card";
  article.setAttribute("role", "group");
  article.setAttribute("aria-labelledby", `question-prompt-${index}`);

  const number = document.createElement("div");
  number.className = "question-index-badge";
  number.textContent = `第 ${String(index).padStart(2, "0")} 题`;

  const prompt = document.createElement("h2");
  prompt.id = `question-prompt-${index}`;
  prompt.className = "question-prompt";
  prompt.textContent = item.prompt;

  const hint = document.createElement("span");
  hint.className = "question-answer-hint";
  hint.textContent = "多选题 · 可选1项或多项，选最贴近你平时会做的做法";

  const options = document.createElement("div");
  options.className = "question-options";
  const current = answerFor(item.id);
  const selected = new Set(current?.optionIds ?? []);

  for (const [optionIndex, opt] of item.options.entries()) {
    const label = document.createElement("label");
    label.className = "question-option";
    if (selected.has(opt.id)) label.classList.add("is-selected");

    const input = document.createElement("input");
    input.type = "checkbox";
    input.name = `answer-${item.id}`;
    input.value = opt.id;
    input.checked = selected.has(opt.id);

    const wrap = document.createElement("div");
    wrap.className = "option-content-wrap";

    const letter = document.createElement("span");
    letter.className = "option-letter";
    letter.textContent = String.fromCharCode(65 + optionIndex);

    const copy = document.createElement("span");
    copy.className = "option-copy";
    copy.textContent = opt.text;

    const checkIcon = document.createElement("span");
    checkIcon.className = "option-check-icon";
    checkIcon.innerHTML = `<svg viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

    wrap.append(letter, copy, checkIcon);

    input.addEventListener("change", () => {
      state.answers = toggleOption(state.answers, item.id, opt.id, openedAtFor(item.id), Date.now());
      persistDraft();
      updateProgress();
      label.classList.toggle("is-selected", input.checked);
    });

    label.append(input, wrap);
    options.append(label);
  }

  article.append(number, prompt, hint, options);
  return article;
}

function updateProgress() {
  const els = getElements();
  const total = state.normalQuestionCount || TOTAL_QUESTIONS;
  if (els.pageText) els.pageText.textContent = `第 ${state.currentIndex + 1} 题 / 共 ${total} 题`;
}

function renderQuestion() {
  const els = getElements();
  state.currentIndex = Math.max(0, Math.min(state.currentIndex, state.items.length - 1));
  const item = state.items[state.currentIndex];
  openedAtFor(item.id);

  if (els.questionList) {
    els.questionList.replaceChildren(optionCard(item, state.currentIndex + 1));
  }
  if (els.previousButton) els.previousButton.disabled = state.currentIndex === 0;
  if (els.nextButton) els.nextButton.textContent = state.currentIndex === state.items.length - 1 ? "生成报告 ➔" : "下一题 ➔";
  if (els.pageError) els.pageError.hidden = true;

  updateProgress();
  persistDraft();
}

function completeCurrent() {
  const els = getElements();
  const answer = answerFor(state.items[state.currentIndex].id);
  if (isCompleteAnswer(answer)) return true;
  if (els.pageError) {
    els.pageError.textContent = "请至少选一项最像你平时做法的选项。";
    els.pageError.hidden = false;
  }
  return false;
}

function durationSeconds() {
  return Math.max(0, Math.min(86400, Math.round((Date.now() - Date.parse(state.startedAt || new Date().toISOString())) / 1000)));
}

// 顾问黑名单与解析
const EXCLUDED_ADVISORS = ["用户", "顾问", "未知", "李老师", "杜雨龙"];
function parseAdvisorContext() {
  const params = new URLSearchParams(window.location.search);
  const hash = window.location.hash || "";
  const hashParams = new URLSearchParams(hash.includes("?") ? hash.split("?")[1] : "");
  return {
    advisorName: params.get("advisorName") || hashParams.get("advisorName") || params.get("employeeName") || localStorage.getItem("advisor_name") || "",
    advisorUserId: params.get("advisorUserId") || hashParams.get("advisorUserId") || params.get("employeeId") || localStorage.getItem("advisor_user_id") || "",
    advisorMobile: params.get("advisorMobile") || hashParams.get("advisorMobile") || params.get("employeeMobile") || localStorage.getItem("advisor_mobile") || "",
    token: params.get("token") || hashParams.get("token") || localStorage.getItem("assessment_token") || ""
  };
}

async function submitAssessment() {
  if (state.submitting) return;
  state.submitting = true;
  setLoading(true, "正在生成你的专属学习模式报告...");

  const adv = parseAdvisorContext();
  const formAdvisor = document.getElementById("advisorInput")?.value?.trim() || "";
  const advisorName = formAdvisor || adv.advisorName;
  const studentName = state.userInfo?.studentName || "学员";
  const contact = state.userInfo?.contact || state.userInfo?.phoneNumber || "";
  const reportSession = state.sessionId || "lsa_" + Date.now();

  const submitPayload = {
    studentInfo: {
      name: studentName,
      mobile: contact,
      grade: state.userInfo?.grade || "",
      specialtyDirection: state.userInfo?.specialtyDirection || "",
      foreignLanguage: state.userInfo?.foreignLanguage || "",
      targetSubject: state.userInfo?.targetSubject || "",
      learningLevel: state.userInfo?.learningLevel || "稳定提升"
    },
    advisorInfo: {
      token: adv.token,
      name: advisorName,
      userId: adv.advisorUserId,
      mobile: adv.advisorMobile
    },
    assessmentInfo: {
      templateCode: "LEARNING_STYLE",
      templateName: "学习模式定位",
      templateType: "STUDENT_LEARNING",
      answers: state.answers,
      durationSeconds: durationSeconds(),
      reportUrl: (typeof window !== "undefined" ? window.location.origin : "https://ceping.1605ai.com") + (typeof window !== "undefined" && window.location.pathname.includes("/learning/") ? "/learning/report.html" : "/report.html")
    }
  };

  let recordId = null;
  try {
    if (window.FeifanAssessmentSubmitter) {
      const submitRes = await window.FeifanAssessmentSubmitter.submit(submitPayload, {
        clientKey: `lsa_${reportSession}`
      });
      if (submitRes.recordId) recordId = submitRes.recordId;
    } else {
      const isLocal = typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" || window.location.hostname === "[::1]");
      const backendBase = window.ASSESSMENT_API_BASE || (isLocal ? "https://ffcrm-daily.1605ai.com" : "https://ffcrm-api.1605ai.com");
      const res = await fetch(`${backendBase}/api/assessment/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        keepalive: true,
        body: JSON.stringify(submitPayload)
      });
      const resData = await res.json().catch(() => ({}));
      if (res.ok && (resData.code === 0 || resData.code === 200) && resData.data) {
        recordId = resData.data.id || resData.data.savedId;
      }
    }
  } catch (e) {
    console.warn("保存结果异常，已由本地离线队列兜底:", e);
  }

  // 本地快照持久化
  clearDraft();
  if (contact) localStorage.setItem("lsa_last_mobile", contact);
  const snapshot = {
    session: reportSession,
    sessionId: reportSession,
    recordId: recordId,
    token: adv.token,
    userInfo: state.userInfo,
    studentName,
    contact,
    answers: state.answers,
    durationSeconds: durationSeconds(),
    startedAt: state.startedAt,
    completedAt: new Date().toISOString()
  };
  localStorage.setItem("lsa_session_" + reportSession, JSON.stringify(snapshot));
  if (recordId) localStorage.setItem("lsa_record_" + recordId, JSON.stringify(snapshot));
  localStorage.setItem("lsa_last_record", JSON.stringify(snapshot));

  await new Promise((r) => setTimeout(r, 600));

  const query = recordId
    ? `id=${encodeURIComponent(recordId)}&session=${encodeURIComponent(reportSession)}`
    : `session=${encodeURIComponent(reportSession)}`;
  const targetReportPath = (typeof window !== "undefined" && window.location.pathname.includes("/learning/")) ? "/learning/report.html" : "/report.html";
  window.location.assign(`${targetReportPath}?${query}`);
}

async function advance() {
  if (!completeCurrent()) return;
  if (state.currentIndex < state.items.length - 1) {
    state.currentIndex += 1;
    renderQuestion();
    return;
  }
  return submitAssessment();
}

function updateSubjects(language) {
  const els = getElements();
  if (!els.targetSubject) return;
  const prior = els.targetSubject.value;
  els.targetSubject.replaceChildren(
    new Option("请选择一门学科", ""),
    ...targetSubjectsForLanguage(language).map((subject) => new Option(subject, subject))
  );
  if ([...els.targetSubject.options].some(({ value }) => value === prior)) {
    els.targetSubject.value = prior;
  }
}

async function createSession(event) {
  event.preventDefault();
  const els = getElements();
  const form = new FormData(els.basicForm);
  const fields = ["studentName", "phoneNumber", "grade", "specialtyDirection", "foreignLanguage", "targetSubject", "learningLevel"];
  const labels = {
    studentName: "姓名",
    phoneNumber: "联系方式",
    grade: "年级",
    specialtyDirection: "专业方向",
    foreignLanguage: "外语科目",
    targetSubject: "目标学科",
    learningLevel: "学习阶段"
  };

  const body = Object.fromEntries(fields.map((key) => [key, String(form.get(key) || "").trim()]));
  body.contact = body.phoneNumber;

  const missing = fields.filter((key) => !body[key]);
  if (missing.length) {
    if (els.basicError) {
      els.basicError.textContent = `请先完善：${missing.map((key) => labels[key]).join("、")}。`;
      els.basicError.hidden = false;
    }
    return;
  }

  state.sessionId = "session_" + Date.now();
  state.userInfo = body;
  state.items = [...QUESTIONS];
  state.answers = [];
  state.currentIndex = 0;
  state.startedAt = new Date().toISOString();
  state.questionOpenedAt = new Map();

  showView(els.assessmentView);
  renderQuestion();
}

// 顾问下拉列表初始化与交互治理
async function setupAdvisorDropdown() {
  const advisorContainer = byId("advisorContainer");
  const advisorInput = byId("advisorInput");
  const advisorDropdownList = byId("advisorDropdownList");
  if (!advisorContainer || !advisorInput || !advisorDropdownList) return;

  let advisorRecords = [];

  const adv = parseAdvisorContext();
  if (adv.advisorName && !EXCLUDED_ADVISORS.includes(adv.advisorName)) {
    advisorInput.value = adv.advisorName;
  }

  function renderAdvisorItems() {
    if (!advisorRecords || advisorRecords.length === 0) {
      advisorDropdownList.innerHTML = `
        <li class="advisor-empty-hint" style="padding:12px;text-align:center;color:#9CA3AF;font-size:13px;">
          <div>暂无可选顾问</div>
        </li>
      `;
    } else {
      advisorDropdownList.innerHTML = advisorRecords.map((item) => {
        const name = item.employeeName || item.name;
        const initial = name.slice(0, 1) || "顾";
        const isSelected = advisorInput.value.trim() === name;
        const employeeId = item.employeeId || item.id || item.userId || "";
        const roleLabel = name.includes("总监") ? "市场总监" : "指导老师";
        return `
          <li class="advisor-item ${isSelected ? "is-selected" : ""}" data-name="${name}" data-employee-id="${employeeId}" data-token="${item.token || ''}" data-mobile="${item.mobile || ''}">
            <div class="advisor-item-main" style="display:flex;align-items:center;gap:8px;">
              <div class="advisor-avatar-badge" style="width:24px;height:24px;border-radius:50%;background:#FEF3C7;color:#D97706;font-size:11px;font-weight:bold;display:flex;align-items:center;justify-content:center;">${initial}</div>
              <span class="advisor-name-text" style="font-size:13.5px;font-weight:600;color:#1F2937;">${name}</span>
            </div>
            <span class="advisor-role-pill" style="font-size:11px;color:#6B7280;background:#F3F4F6;padding:2px 6px;border-radius:4px;">${roleLabel}</span>
          </li>
        `;
      }).join("");

      advisorDropdownList.querySelectorAll(".advisor-item").forEach((item) => {
        const selectAction = (e) => {
          e.preventDefault();
          e.stopPropagation();
          const name = item.getAttribute("data-name");
          if (name) {
            advisorInput.value = name;
            localStorage.setItem("advisor_name", name);
            const empId = item.getAttribute("data-employee-id");
            if (empId) localStorage.setItem("advisor_user_id", empId);
            const token = item.getAttribute("data-token");
            if (token) localStorage.setItem("advisor_token", token);
            const mob = item.getAttribute("data-mobile");
            if (mob) localStorage.setItem("advisor_mobile", mob);
          }
          closeDropdown();
        };
        item.addEventListener("pointerdown", selectAction);
        item.addEventListener("click", selectAction);
      });
    }
  }

  function openDropdown() {
    renderAdvisorItems();
    advisorDropdownList.style.display = "block";
    advisorContainer.classList.add("is-open");
    if (window.FeifanAdvisorDropdown) {
      window.FeifanAdvisorDropdown.open(advisorContainer, advisorDropdownList);
    }
  }

  function closeDropdown() {
    advisorDropdownList.style.display = "none";
    advisorContainer.classList.remove("is-open");
    if (window.FeifanAdvisorDropdown) {
      window.FeifanAdvisorDropdown.close(advisorDropdownList);
    }
  }

  function toggleDropdown(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (advisorDropdownList.style.display === "block") {
      closeDropdown();
    } else {
      openDropdown();
    }
  }

  advisorInput.addEventListener("click", toggleDropdown);
  byId("advisorToggleBtn")?.addEventListener("click", toggleDropdown);

  document.addEventListener("click", (e) => {
    if (!advisorContainer.contains(e.target) && !advisorDropdownList.contains(e.target)) {
      closeDropdown();
    }
  });

  try {
    const isLocal = typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" || window.location.hostname === "[::1]");
    const backendBase = window.ASSESSMENT_API_BASE || (isLocal ? "https://ffcrm-daily.1605ai.com" : "https://ffcrm-api.1605ai.com");
    const targetUrl = window.buildAdvisorListUrl ? window.buildAdvisorListUrl(backendBase) : `${backendBase}/api/assessment/advisors?roleCode=SALES,MARKET`;
    
    const res = await fetch(targetUrl);
    const json = await res.json().catch(() => ({}));
    const list = Array.isArray(json.data) ? json.data : (json.data?.list || (Array.isArray(json) ? json : []));
    
    advisorRecords = list
      .map((r) => ({
        employeeId: r.employeeId || r.id || r.userId,
        employeeName: (r.employeeName || r.name || r.advisorName || "").trim(),
        name: (r.employeeName || r.name || r.advisorName || "").trim(),
        token: r.token || "",
        mobile: r.mobile || ""
      }))
      .filter((a) => a.employeeName && !EXCLUDED_ADVISORS.includes(a.employeeName));

    if (advisorContainer.classList.contains("is-open")) {
      renderAdvisorItems();
    }
  } catch (e) {
    console.warn("读取顾问列表异常:", e);
  }
}

function boot() {
  const els = getElements();
  const draft = loadDraft();
  if (els.resumeButton) els.resumeButton.hidden = !draft;

  els.startButton?.addEventListener("click", () => showView(els.basicView));
  els.resumeButton?.addEventListener("click", () => {
    Object.assign(state, draft);
    state.questionOpenedAt = new Map();
    showView(els.assessmentView);
    renderQuestion();
  });
  els.basicBackButton?.addEventListener("click", () => showView(els.startView));
  els.basicForm?.addEventListener("submit", createSession);

  els.basicForm?.querySelectorAll('input[name="foreignLanguage"]').forEach((input) => {
    input.addEventListener("change", () => updateSubjects(input.value));
  });

  els.previousButton?.addEventListener("click", () => {
    if (state.currentIndex > 0) {
      state.currentIndex -= 1;
      renderQuestion();
    }
  });
  els.nextButton?.addEventListener("click", advance);
  els.retryButton?.addEventListener("click", submitAssessment);

  document.querySelectorAll('[data-home-back]').forEach((btn) => {
    btn.addEventListener("click", () => showView(els.startView));
  });

  setupAdvisorDropdown();
  setupAndroidEnvironment();

  // 绑定 type=test 快速填入按钮
  document.querySelectorAll('[data-action="autofill-test"], #autofillBtn').forEach((btn) => {
    btn.addEventListener("click", () => {
      window.oneClickAutoFillAndAnswer();
    });
  });
}

window.oneClickAutoFillAndAnswer = function () {
  console.log("⚡ [学习模式定位 - 一键填表与作答] 触发...");
  const els = getElements();

  // 1. 如果在首页，进入基本信息页
  if (els.startView && (els.startView.classList.contains("is-active") || !els.startView.hidden)) {
    showView(els.basicView);
  }

  // 2. 如果在基本信息页，快速填充表单
  if (els.basicView && (els.basicView.classList.contains("is-active") || !els.basicView.hidden)) {
    const studentNameInput = document.getElementById("studentName");
    const phoneNumberInput = document.getElementById("phoneNumber");
    if (studentNameInput && !studentNameInput.value) studentNameInput.value = "测试学员";
    if (phoneNumberInput && !phoneNumberInput.value) phoneNumberInput.value = "13800138000";

    const setRadio = (name, val) => {
      const radio = document.querySelector(`input[name="${name}"][value="${val}"]`);
      if (radio) radio.checked = true;
    };
    setRadio("grade", "高三");
    setRadio("specialtyDirection", "美术设计");
    setRadio("foreignLanguage", "英语");
    setRadio("learningLevel", "稳定提升");

    updateSubjects("英语");
    setRadio("targetSubject", "语文");

    const form = els.basicForm;
    if (form) {
      const submitBtn = document.getElementById("basicSubmitButton");
      if (submitBtn) submitBtn.click();
    }
  }

  // 3. 如果在答题页，为所有题目生成答案并跳到最后一题
  if (els.assessmentView && (els.assessmentView.classList.contains("is-active") || !els.assessmentView.hidden)) {
    state.items.forEach((item, idx) => {
      if (!state.answers.some((a) => a.questionId === item.id)) {
        const opt = item.options[idx % item.options.length] || item.options[0];
        state.answers.push({
          questionId: item.id,
          optionIds: [opt.id],
          responseTimeMs: 600
        });
      }
    });
    state.currentIndex = state.items.length - 1;
    renderQuestion();
    updateProgress();
    persistDraft();
  }
};

if (typeof window !== "undefined" && typeof document !== "undefined") {
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot, { once: true });
  else boot();
}

