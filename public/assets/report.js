import { drawRadar, RADAR_AXES } from "./radar.js";
import { generateReportFromAnswers } from "./report-generator.js";

const PREFERENCE_COLORS = Object.freeze({ V: "var(--teal)", A: "var(--coral)", R: "var(--green)", K: "var(--gold)" });
const SECTION_IDS = Object.freeze(["summary", "learningPattern", "strengths", "risks", "subjectPlan", "sevenDayAction"]);
const SUBJECT_PLAN_PROCESSES = new Set(["learning", "memory", "practice", "improve"]);
const CURRENT_SCHEMA_VERSION = "2.7.1";
const LEGACY_SECTION_IDS = Object.freeze(["recognition", "learningPattern", "strength", "risk", "subjectPlan", "actionCard"]);
const LEGACY_MISSING = Object.freeze({
  headline: "历史报告未保存画像结论",
  strategy: "可以先试什么",
  strategyReason: "历史报告未保存策略依据",
  strategyAction: "历史报告未保存具体做法",
  action: "历史报告未保存当前行动"
});
const STRATEGY_LEVEL_SEGMENTS = Object.freeze({
  "当前证据较少": 1,
  "在部分场景出现": 2,
  "表现较明显": 3
});

function collectStrings(value) {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(collectStrings);
  if (value && typeof value === "object") return Object.values(value).flatMap(collectStrings);
  return [];
}

export function reportCopyDomains(report) {
  return {
    learningPattern: collectStrings(report?.learningPattern),
    subjectPlan: collectStrings(report?.subjectPlan),
    sevenDayAction: collectStrings(report?.sevenDayAction)
  };
}

export function findCrossSectionDuplicates(domains) {
  const entries = Object.entries(domains);
  const duplicates = new Set();
  for (let left = 0; left < entries.length; left += 1) {
    for (let right = left + 1; right < entries.length; right += 1) {
      const rightValues = new Set(entries[right][1]);
      for (const value of entries[left][1]) if (value.length >= 8 && rightValues.has(value)) duplicates.add(value);
    }
  }
  return [...duplicates];
}

function element(id) {
  const node = document.getElementById(id);
  if (!node) {
    console.warn(`[Report] Element #${id} not found in DOM, creating fallback node.`);
    const fallback = document.createElement("div");
    fallback.id = id;
    return fallback;
  }
  return node;
}

function text(tag, value, className) {
  const node = document.createElement(tag);
  node.textContent = value ?? "";
  if (className) node.className = className;
  return node;
}

function setText(id, value, fallback = "--") {
  const node = document.getElementById(id);
  if (node) {
    node.textContent = value || fallback;
  }
}

function setOptionalText(id, value, fallback = "") {
  const node = document.getElementById(id);
  if (node) node.textContent = value || fallback;
}

function reportIdFromLocation() {
  return new URLSearchParams(window.location.search).get("id");
}

const BACKEND_BASE = (typeof window !== "undefined" && window.ASSESSMENT_API_BASE)
  || "https://ffcrm-api.1605ai.com";
const ASSESSMENT_SUBMIT_API = `${BACKEND_BASE}/api/assessment/submit`;
const ASSESSMENT_RESULT_API = `${BACKEND_BASE}/api/assessment/result`;
let currentAssessmentSubmitPayload = null;

const RAW_TARGET_SUBJECTS = new Set(["语文", "数学", "英语", "日语"]);
const SELECTIVE_TARGET_SUBJECTS = new Set(["物理", "化学", "生物", "历史", "政治", "地理", "技术"]);

function normalizeAssessmentDate(value) {
  if (!value) return new Date().toISOString().slice(0, 10);
  const str = String(value);
  const match = str.match(/^(\d{4}-\d{2}-\d{2})/);
  if (match) return match[1];
  const parsed = new Date(str);
  if (!Number.isNaN(parsed.getTime())) return parsed.toISOString().slice(0, 10);
  return new Date().toISOString().slice(0, 10);
}

function parseResultJson(raw) {
  if (!raw) return {};
  try {
    return typeof raw === "string" ? JSON.parse(raw) : raw;
  } catch {
    return {};
  }
}

function recordMatchesSession(parsed, item, sessionKey) {
  if (!sessionKey || sessionKey === "static") return true;
  const keys = new Set([String(sessionKey)]);
  if (sessionKey.startsWith("session_")) keys.add(sessionKey.slice("session_".length));
  else keys.add(`session_${sessionKey}`);

  const recordSession = String(parsed.session || parsed.reportSession || item?.session || "");
  if (!recordSession) return false;
  if (keys.has(recordSession)) return true;
  if (recordSession.startsWith("session_")) return keys.has(recordSession.slice("session_".length));
  return false;
}

function resolveTargetSubjectFullScore(subject, explicitFullScore) {
  const parsed = Number(explicitFullScore);
  if (Number.isFinite(parsed) && parsed > 0) return parsed;
  if (RAW_TARGET_SUBJECTS.has(subject)) return 150;
  if (SELECTIVE_TARGET_SUBJECTS.has(subject)) return 100;
  return 150;
}

function getAdvisorToken() {
  const urlParams = new URLSearchParams(window.location.search);
  const hashParams = window.location.hash.includes("?")
    ? new URLSearchParams(window.location.hash.split("?")[1] || "")
    : null;
  const token = urlParams.get("ref")
    || urlParams.get("token")
    || urlParams.get("advisorToken")
    || hashParams?.get("ref")
    || hashParams?.get("token")
    || hashParams?.get("advisorToken")
    || localStorage.getItem("advisor_token")
    || localStorage.getItem("feifan_ref")
    || "";
  if (token) {
    try {
      localStorage.setItem("advisor_token", token);
      localStorage.setItem("feifan_ref", token);
    } catch(e) {}
  }
  return token;
}

function buildAssessmentSubmitPayload(parsed, item, mobile) {
  const student = parsed?.studentInfo || {};
  const advisor = parsed?.advisorInfo || {};
  const assessment = parsed?.assessmentInfo || {};
  const userInfo = parsed?.userInfo || parsed?.basicInfo || {};
  return {
    studentInfo: {
      name: student.name || parsed.name || item?.customerName || userInfo.studentName || "",
      mobile: student.mobile || parsed.contact || item?.customerMobile || mobile || userInfo.phoneNumber || "",
      grade: student.grade || parsed.grade || userInfo.grade || "",
      specialtyDirection: student.specialtyDirection || userInfo.specialtyDirection || "",
      scoreBand: student.scoreBand || userInfo.scoreBand || "",
      foreignLanguage: student.foreignLanguage || userInfo.foreignLanguage || "",
      targetSubject: student.targetSubject || parsed.targetSubject || userInfo.targetSubject || "",
      targetSubjectScore: student.targetSubjectScore ?? parsed.targetSubjectScore ?? userInfo.targetSubjectScore,
      targetSubjectFullScore: student.targetSubjectFullScore ?? parsed.targetSubjectFullScore ?? userInfo.targetSubjectFullScore ?? 150,
      learningFocus: student.learningFocus || parsed.learningFocus || userInfo.learningFocus || "",
      profileId: student.profileId || parsed.profileId || userInfo.profileId || ""
    },
    advisorInfo: {
      token: advisor.token || parsed.token || getAdvisorToken(),
      name: advisor.name || parsed.advisorName || userInfo.advisorName || "",
      userId: advisor.userId || parsed.advisorUserId || userInfo.advisorUserId || "",
      mobile: advisor.mobile || parsed.advisorMobile || userInfo.advisorMobile || ""
    },
    assessmentInfo: {
      templateCode: assessment.templateCode || parsed.templateCode || item?.templateCode || "LEARNING_STYLE",
      templateName: assessment.templateName || parsed.templateName || "学习模式定位",
      templateType: assessment.templateType || parsed.templateType || "STUDENT_LEARNING",
      answers: assessment.answers || parsed.answers || [],
      durationSeconds: assessment.durationSeconds || parsed.durationSeconds || 0,
      submittedAt: assessment.submittedAt || parsed.submittedAt || item?.createdAt || new Date().toISOString()
    }
  };
}

function rememberAssessmentSubmitPayload(parsed, item, mobile) {
  if (!parsed || typeof parsed !== "object") return;
  currentAssessmentSubmitPayload = buildAssessmentSubmitPayload(parsed, item, mobile);
}

function rememberAssessmentSubmitPayloadFromSession(sessionData, mobile) {
  if (!sessionData || typeof sessionData !== "object") return;
  const userInfo = sessionData.userInfo || {};
  const token = sessionData.token || sessionData.advisorToken || getAdvisorToken();
  currentAssessmentSubmitPayload = {
    templateCode: "学习风格",
    token: token,
    name: userInfo.studentName || "",
    contact: userInfo.phoneNumber || mobile || "",
    session: sessionData.session || sessionData.sessionId || "",
    userInfo,
    grade: sessionData.grade || userInfo.grade || "",
    targetSubject: sessionData.targetSubject || userInfo.targetSubject || "",
    learningFocus: sessionData.learningFocus || userInfo.learningFocus || "",
    targetSubjectScore: sessionData.targetSubjectScore ?? userInfo.targetSubjectScore,
    answers: sessionData.answers || [],
    durationSeconds: sessionData.durationSeconds || 0,
    submittedAt: sessionData.completedAt || sessionData.startedAt || new Date().toISOString(),
    assessmentId: sessionData.assessmentId || sessionData.session || sessionData.sessionId || null,
    session: sessionData.session || sessionData.sessionId || ""
  };
}

function getLocalSessionData(reportId) {
  const params = new URLSearchParams(window.location.search);
  const hashParams = window.location.hash.includes("?")
    ? new URLSearchParams(window.location.hash.split("?")[1] || "")
    : null;
  const key = reportId || params.get("session") || params.get("id") || hashParams?.get("session") || hashParams?.get("id");
  
  if (params.get("demo") === "1" || !key) {
    // Generate default demo assessment answers matching screenshot 1
    const questionIds = [
      'V01','V02','V03','V04','V05','V06','V07','V08',
      'A01','A02','A03','A04','A05','A06','A07','A08',
      'R01','R02','R03','R04','R05','R06','R07','R08',
      'K01','K02','K03','K04','K05','K06','K07','K08',
      'LS01','LS02','LS03','LS04','LS05','LS06','LS07','LS08','LS09','LS10'
    ];
    const defaultAnswers = questionIds.map((qid, idx) => ({
      questionId: qid,
      value: idx % 2 === 0 ? 4 : 3,
      responseTimeMs: 2200,
      answeredAt: new Date().toISOString()
    }));
    return {
      session: "demo-session",
      sessionId: "demo-session",
      userInfo: {
        studentName: "测试学员",
        phoneNumber: "15765778832",
        grade: "高三",
        targetSubject: "语文",
        targetSubjectScore: 110,
        targetSubjectFullScore: 150,
        learningFocus: "做题和应用"
      },
      answers: defaultAnswers,
      grade: "高三",
      targetSubject: "语文",
      learningFocus: "做题和应用",
      targetSubjectScore: 110,
      targetSubjectFullScore: 150,
      durationSeconds: 360,
      startedAt: new Date(Date.now() - 360000).toISOString(),
      completedAt: new Date().toISOString()
    };
  }

  const candidates = [
    `lsa_session_${key}`,
    `feifan_report_session_${key}`,
    `feifan_report_${key}`,
    key,
    localStorage.getItem("lsa_last_record")
  ];
  for (const k of candidates) {
    if (!k) continue;
    const raw = localStorage.getItem(k);
    if (!raw) continue;
    try {
      return JSON.parse(raw);
    } catch {
      continue;
    }
  }
  return null;
}

function normalizeAnswersArray(raw) {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  if (typeof raw === "object") {
    return Object.entries(raw).map(([k, v]) => {
      const qid = Number(k) || k;
      if (typeof v === "object" && v !== null && ("value" in v || "answer" in v)) {
        return { questionId: qid, value: Number(v.value ?? v.answer) };
      }
      return { questionId: qid, value: Number(v) };
    });
  }
  return [];
}

function buildReportPayloadFromAnswersData(parsed, item, mobile) {
  const student = parsed?.studentInfo || {};
  const advisor = parsed?.advisorInfo || {};
  const assessment = parsed?.assessmentInfo || {};
  const normAnswers = normalizeAnswersArray(assessment.answers || parsed?.answers || assessment.resultData?.answers || parsed?.resultData?.answers);
  if (!parsed || normAnswers.length === 0) {
    return null;
  }

  const userInfo = parsed.userInfo || parsed.basicInfo || {};
  const targetSubject = student.targetSubject || parsed.targetSubject || userInfo.targetSubject || "";
  const targetSubjectFullScore = resolveTargetSubjectFullScore(
    targetSubject,
    student.targetSubjectFullScore ?? parsed.targetSubjectFullScore ?? userInfo.targetSubjectFullScore
  );

  let generated;
  try {
    generated = generateReportFromAnswers({
      name: student.name || parsed.name || item?.customerName || userInfo.studentName || "",
      mobile: student.mobile || parsed.contact || item?.customerMobile || mobile || userInfo.phoneNumber || "",
      answers: normAnswers,
      submittedAt: item?.createdAt || assessment.submittedAt || parsed.submittedAt || parsed.completedAt,
      userInfo: { ...userInfo, ...student },
      grade: student.grade || parsed.grade || userInfo.grade || "",
      targetSubject,
      targetSubjectScore: student.targetSubjectScore ?? parsed.targetSubjectScore ?? userInfo.targetSubjectScore ?? 0,
      targetSubjectFullScore,
      learningFocus: student.learningFocus || parsed.learningFocus || userInfo.learningFocus || ""
    });
  } catch (error) {
    console.warn("生成报告失败，跳过该条记录:", error);
    return null;
  }
  if (!generated?.studentReport) return null;
  const repOverview = generated.studentReport.overview || {};

  return {
    report: {
      studentReport: generated.studentReport,
      studentName: student.name || parsed.name || item?.customerName || userInfo.studentName || repOverview.studentName || "",
      maskedPhone: student.mobile || parsed.contact || item?.customerMobile || mobile || userInfo.phoneNumber || "",
      grade: student.grade || parsed.grade || userInfo.grade || repOverview.grade || "",
      targetSubject: targetSubject || repOverview.targetSubject || "",
      learningFocus: student.learningFocus || parsed.learningFocus || userInfo.learningFocus || repOverview.learningFocus || "",
      assessmentDate: normalizeAssessmentDate(item?.createdAt || assessment.submittedAt || parsed.submittedAt || parsed.completedAt)
    },
    studentReport: generated.studentReport
  };
}

function buildReportPayloadFromParsedRecord(parsed, item, mobile) {
  const assessment = parsed?.assessmentInfo || {};
  if (parsed?.report?.studentReport) {
    return { report: parsed.report, studentReport: parsed.report.studentReport };
  }
  if (parsed?.resultData?.studentReport || parsed?.result?.studentReport || assessment?.resultData?.studentReport) {
    const reportData = parsed?.resultData || parsed?.result || assessment?.resultData;
    return { report: reportData, studentReport: reportData.studentReport };
  }
  return buildReportPayloadFromAnswersData(parsed, item, mobile);
}



async function loadReportFromApiById(id) {
  if (!id) return null;
  try {
    const controller = typeof AbortController !== "undefined" ? new AbortController() : null;
    const timeoutId = controller ? setTimeout(() => controller.abort(), 4000) : null;
    const apiRes = await fetch(`${ASSESSMENT_RESULT_API}/${encodeURIComponent(id)}`, {
      signal: controller ? controller.signal : undefined
    });
    if (timeoutId) clearTimeout(timeoutId);
    const apiJson = await apiRes.json().catch(() => ({}));
    if ((apiJson.code === 200 || apiJson.code === 0) && apiJson.data) {
      const item = apiJson.data;
      const parsed = item.resultJson ? parseResultJson(item.resultJson) : item;
      const normAnswers = normalizeAnswersArray(parsed.answers || parsed.resultData?.answers || item.answers);
      parsed.answers = normAnswers;
      rememberAssessmentSubmitPayload(parsed, item, item.customerMobile || parsed.contact || parsed.studentMobile);
      const payload = buildReportPayloadFromParsedRecord(parsed, item, item.customerMobile || parsed.contact || parsed.studentMobile);
      if (payload?.report?.studentReport) return payload;
    }
  } catch (e) {
    console.warn("API ID 查询异常，尝试本地缓存降级:", e);
  }

  try {
    const localStr = localStorage.getItem("lsa_record_" + id) || localStorage.getItem("lsa_session_" + id);
    if (localStr) {
      const sessionData = JSON.parse(localStr);
      rememberAssessmentSubmitPayloadFromSession(sessionData, sessionData.contact || "");
      return resolveReportPayload(sessionData, sessionData.contact || "");
    }
  } catch (e) {}

  return null;
}

function buildReportPayloadFromSession(sessionData, mobile) {
  const normAnswers = normalizeAnswersArray(sessionData?.answers);
  if (!sessionData || normAnswers.length === 0) {
    return null;
  }

  const userInfo = sessionData.userInfo || {};
  const targetSubject = sessionData.targetSubject || userInfo.targetSubject || "";
  const parsed = {
    name: userInfo.studentName || "",
    contact: userInfo.phoneNumber || mobile || "",
    userInfo,
    answers: normAnswers,
    grade: sessionData.grade || userInfo.grade || "",
    targetSubject,
    targetSubjectScore: sessionData.targetSubjectScore ?? userInfo.targetSubjectScore ?? 0,
    targetSubjectFullScore: resolveTargetSubjectFullScore(
      targetSubject,
      sessionData.targetSubjectFullScore ?? userInfo.targetSubjectFullScore
    ),
    learningFocus: sessionData.learningFocus || userInfo.learningFocus || "",
    submittedAt: sessionData.completedAt || sessionData.startedAt
  };

  return buildReportPayloadFromAnswersData(parsed, null, mobile);
}

function resolveReportPayload(sessionData, mobile) {
  if (!sessionData) return null;
  if (sessionData.report?.studentReport) return sessionData;
  return buildReportPayloadFromSession(sessionData, mobile);
}

async function requestJson(url, options) {
  const response = await fetch(url, {
    ...options,
    cache: "no-store",
    headers: { "content-type": "application/json", ...options?.headers }
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.error || "请求失败");
  return payload;
}

export function numericScore(value) {
  const parsed = typeof value === "symbol" ? Number.NaN : Number(value);
  return Number.isFinite(parsed) ? Math.min(100, Math.max(0, parsed)) : 0;
}

function record(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

function array(value) {
  return Array.isArray(value) ? value : [];
}

function string(value, fallback = "") {
  return typeof value === "string" && value.trim() ? value : fallback;
}

function formatScore(value) {
  return Number.isInteger(value) ? String(value) : String(value);
}

function formatStrategyLabel(strategy) {
  const formal = string(strategy?.label);
  const plain = string(strategy?.studentLabel);
  if (!formal) return plain;
  return plain && plain !== formal ? `${formal}：${plain}` : formal;
}

function entryHeadlineExplanation(headline) {
  const textValue = string(headline);
  if (textValue.includes("双重入口")) {
    const labels = textValue.replace("双重入口", "").trim();
    return `${labels}是你本次作答中较常出现的学习入口。面对新内容时，可以先从其中一种开始，再用另一种方式检查自己是否理解。`;
  }
  if (textValue.includes("主入口")) {
    const labels = textValue.replace("主入口", "").replace("辅助入口", "和").trim();
    return `${labels}是你本次作答中较常出现的学习入口。你可以先用主要入口找到切入点，再用辅助入口把内容说清、写清或做出来。`;
  }
  if (textValue.includes("主要入口")) {
    const label = textValue.replace("主要入口", "").trim();
    return `${label}是你本次作答中较常出现的学习入口。面对新内容时，可以先用这种方式找到切入点，再通过练习确认自己是否掌握。`;
  }
  if (textValue.includes("多通道")) {
    return "几种学习入口在本次作答中比较接近，没有明显集中在一种方式上。你可以根据任务选择顺手的方式开始，再用独立完成来检查效果。";
  }
  return "这表示你本次作答中更常从这种方式开始学习，不是固定标签。";
}

function normalizeScoreContext(value) {
  const source = record(value);
  const score = Number(source.score);
  const fullScore = Number(source.fullScore);
  const available = Number.isFinite(score) && Number.isFinite(fullScore) && fullScore > 0;
  return {
    score: available ? score : null,
    fullScore: available ? fullScore : null,
    studentLabel: string(source.studentLabel),
    available
  };
}

function firstRecord(...values) {
  return values.find((value) => (
    value && typeof value === "object" && !Array.isArray(value) && Object.keys(value).length > 0
  )) ?? {};
}

function hasOwnRecord(source, key) {
  return Object.hasOwn(source, key) && source[key] && typeof source[key] === "object" && !Array.isArray(source[key]);
}

function hasString(source, key) {
  return typeof source[key] === "string" && source[key].trim().length > 0;
}

function hasNonEmptyStrings(value) {
  return Array.isArray(value) && value.length > 0 && value.every((item) => typeof item === "string" && item.trim().length > 0);
}

function hasInsightItems(value) {
  return Array.isArray(value) && value.length > 0 && value.every((item) => (
    (typeof item === "string" && item.trim().length > 0)
    || (item && typeof item === "object" && !Array.isArray(item) && hasStrings(item, ["title", "text"]))
  ));
}

function hasStrings(source, keys) {
  return keys.every((key) => hasString(source, key));
}

function incompleteReport() {
  throw new TypeError("报告数据不完整");
}

function validateVersionedReport(report) {
  if (report.schemaVersion !== CURRENT_SCHEMA_VERSION) incompleteReport();

  const overview = hasOwnRecord(report, "overview") ? report.overview : incompleteReport();
  for (const key of ["title", "englishTitle", "studentName", "grade", "targetSubject", "learningFocus", "assessmentDate", "profileHeadline"]) {
    if (!hasString(overview, key)) incompleteReport();
  }
  if (!hasOwnRecord(overview, "priorityStrategy") || !hasStrings(overview.priorityStrategy, ["id", "label", "definition", "studentLabel"])) {
    incompleteReport();
  }
  if (!hasOwnRecord(overview, "firstAction") || !hasStrings(overview.firstAction, ["subject", "action"])) {
    incompleteReport();
  }
  if (!Array.isArray(overview.radar) || overview.radar.length !== RADAR_AXES.length) incompleteReport();
  overview.radar.forEach((entry, index) => {
    if (!entry || typeof entry !== "object" || Array.isArray(entry)) incompleteReport();
    if (entry.code !== RADAR_AXES[index].code || !hasString(entry, "label") || !Number.isFinite(entry.score)) incompleteReport();
  });

  if (!Array.isArray(report.sections) || report.sections.length !== SECTION_IDS.length) incompleteReport();
  if (report.sections.some((section, index) => section?.id !== SECTION_IDS[index])) incompleteReport();

  for (const key of ["oneSentence", "learningPattern", "strengths", "risks", "subjectPlan", "sevenDayAction"]) {
    if (!hasOwnRecord(report, key) || !hasString(report[key], "title")) incompleteReport();
  }
  if (!hasString(report.oneSentence, "text")) incompleteReport();

  if (!Array.isArray(report.learningPattern.entries) || report.learningPattern.entries.length === 0) incompleteReport();
  for (const entry of report.learningPattern.entries) {
    if (!entry || typeof entry !== "object" || Array.isArray(entry)) incompleteReport();
    if (!hasStrings(entry, ["code", "label", "role", "definition"])) incompleteReport();
    if (!Array.isArray(entry.mechanisms) || entry.mechanisms.length === 0) incompleteReport();
    for (const mechanism of entry.mechanisms) {
      if (!mechanism || typeof mechanism !== "object" || Array.isArray(mechanism)) incompleteReport();
      if (!hasStrings(mechanism, ["label", "level", "definition"]) || !hasNonEmptyStrings(mechanism.typicalBehaviors)) incompleteReport();
    }
  }
  if (!Array.isArray(report.learningPattern.allEntries) || report.learningPattern.allEntries.length !== RADAR_AXES.length) incompleteReport();
  report.learningPattern.allEntries.forEach((entry, index) => {
    if (!entry || typeof entry !== "object" || Array.isArray(entry)) incompleteReport();
    if (entry.code !== RADAR_AXES[index].code
      || !Number.isFinite(entry.score)
      || !hasStrings(entry, ["label", "role", "definition", "interpretation"])) incompleteReport();
    if (!Array.isArray(entry.mechanisms) || entry.mechanisms.length !== 4) incompleteReport();
    entry.mechanisms.forEach((mechanism) => {
      if (!mechanism || typeof mechanism !== "object" || Array.isArray(mechanism)) incompleteReport();
      if (!hasStrings(mechanism, ["label", "level", "definition"]) || !hasNonEmptyStrings(mechanism.typicalBehaviors)) incompleteReport();
    });
  });
  if (!hasInsightItems(report.strengths.items) || !hasNonEmptyStrings(report.risks.items)) incompleteReport();

  if (!hasOwnRecord(report.risks, "priorityStrategy")) incompleteReport();
  for (const key of ["id", "label", "definition", "studentLabel", "level", "reason", "action"]) {
    if (!hasString(report.risks.priorityStrategy, key)) incompleteReport();
  }
  if (overview.priorityStrategy.id !== report.risks.priorityStrategy.id
    || overview.priorityStrategy.label !== report.risks.priorityStrategy.label) incompleteReport();

  if (!hasOwnRecord(report.subjectPlan, "priorityStrategy")) incompleteReport();
  for (const key of ["id", "label", "action"]) {
    if (!hasString(report.subjectPlan.priorityStrategy, key)) incompleteReport();
  }
  if (report.subjectPlan.priorityStrategy.id !== report.risks.priorityStrategy.id
    || report.subjectPlan.priorityStrategy.label !== report.risks.priorityStrategy.label
    || report.subjectPlan.priorityStrategy.action !== report.risks.priorityStrategy.action) incompleteReport();
  if (!hasOwnRecord(report.subjectPlan, "strategyPractice")
    || !hasStrings(report.subjectPlan.strategyPractice, ["label", "action"])) incompleteReport();
  if (!hasStrings(report.subjectPlan, ["subject", "executionGuide", "example"]) || report.subjectPlan.subject !== overview.targetSubject) incompleteReport();
  if (!hasOwnRecord(report.subjectPlan, "focus") || !hasStrings(report.subjectPlan.focus, ["code", "label"])) incompleteReport();
  if (!SUBJECT_PLAN_PROCESSES.has(report.subjectPlan.focus.code) || report.subjectPlan.focus.label !== overview.learningFocus) incompleteReport();
  if (!Array.isArray(report.subjectPlan.scenes) || report.subjectPlan.scenes.length !== 1) incompleteReport();
  report.subjectPlan.scenes.forEach((scene) => {
    if (!scene || typeof scene !== "object" || Array.isArray(scene)) incompleteReport();
    if (scene.process !== report.subjectPlan.focus.code) incompleteReport();
    if (!hasStrings(scene, ["label", "material", "action", "evidence", "successCriterion"])) incompleteReport();
  });
  const expectedFirstAction = hasString(report.subjectPlan, "firstAction")
    ? report.subjectPlan.firstAction
    : report.subjectPlan.scenes[0].action;
  if (overview.firstAction.subject !== report.subjectPlan.subject
    || overview.firstAction.action !== expectedFirstAction) incompleteReport();

  const usesStages = Array.isArray(report.sevenDayAction.stages);
  if (usesStages) {
    if (!hasStrings(report.learningPattern, ["connection"])) incompleteReport();
    if (!hasStrings(report.risks, ["headline", "explanation"])) incompleteReport();
    if (!hasStrings(report.risks.priorityStrategy, ["whyFirst", "thisWeek", "successCriterion"])) incompleteReport();
    if (!hasStrings(report.subjectPlan, ["whyFirst", "firstAction", "support", "successCriterion"])) incompleteReport();
    if (!hasNonEmptyStrings(report.subjectPlan.steps) || report.subjectPlan.steps.length !== 3) incompleteReport();
    if (report.sevenDayAction.stages.length !== 3) incompleteReport();
    const stageIds = ["baseline", "trial", "retest"];
    report.sevenDayAction.stages.forEach((stage, index) => {
      if (!stage || typeof stage !== "object" || Array.isArray(stage) || stage.id !== stageIds[index]) incompleteReport();
      if (!hasStrings(stage, ["title", "action", "evidence", "support", "successCriterion"])) incompleteReport();
    });
  } else {
    if (!Array.isArray(report.sevenDayAction.days) || report.sevenDayAction.days.length !== 7) incompleteReport();
    report.sevenDayAction.days.forEach((day, index) => {
      if (!day || typeof day !== "object" || Array.isArray(day) || day.day !== index + 1) incompleteReport();
      if (!hasStrings(day, ["title", "action", "evidence", "support", "successCriterion"])) incompleteReport();
    });
  }
}

function isKnownLegacyStudentReport(report) {
  const hasTopLevelShape = hasOwnRecord(report, "overview")
    && ["oneSentence", "learningPattern", "strengths", "risks", "subjectPlan", "sevenDayAction"]
      .every((key) => hasOwnRecord(report, key));
  const legacySections = record(report.sections);
  const hasNestedSectionsShape = LEGACY_SECTION_IDS.every((key) => hasOwnRecord(legacySections, key));
  const hasHistoricalRootShape = Array.isArray(report.sections)
    && Array.isArray(report.preferenceExplanations)
    && [
      "overview", "judgment", "profile", "scienceEvidence", "strengths", "risks",
      "subjectApplication", "nextStep", "coachSupport"
    ].every((key) => hasOwnRecord(report, key));
  return hasTopLevelShape || hasNestedSectionsShape || hasHistoricalRootShape;
}

function normalizePriority(value) {
  const source = record(value);
  return {
    id: string(source.id),
    label: string(source.label, LEGACY_MISSING.strategy),
    definition: string(source.definition, string(source.action ?? source.actionImplication, LEGACY_MISSING.strategyAction)),
    studentLabel: string(source.studentLabel, string(source.label, LEGACY_MISSING.strategy)),
    level: string(source.level),
    reason: string(source.reason ?? source.explanation, LEGACY_MISSING.strategyReason),
    action: string(source.action ?? source.actionImplication, LEGACY_MISSING.strategyAction),
    whyFirst: string(source.whyFirst ?? source.reason ?? source.explanation, LEGACY_MISSING.strategyReason),
    thisWeek: string(source.thisWeek ?? source.action ?? source.actionImplication, LEGACY_MISSING.strategyAction),
    successCriterion: string(source.successCriterion ?? source.check, "用完成结果判断这个做法是否有效。")
  };
}

function normalizeStrategyProgress(value, priorityStrategy) {
  return array(value).map((rawStrategy) => {
    const strategy = record(rawStrategy);
    return {
      id: string(strategy.id),
      label: string(strategy.label, "学习方法"),
      total: Number.isFinite(Number(strategy.total)) ? Number(strategy.total) : null,
      level: string(strategy.level, "在部分场景出现"),
      isPriority: Boolean(strategy.isPriority) || string(strategy.id) === priorityStrategy.id
    };
  });
}

function normalizeRadar(report, overview) {
  const entries = array(overview.radar).length ? array(overview.radar) : array(report.radar);
  const indices = firstRecord(overview.indices, report.indices, report.preferenceIndices);
  return RADAR_AXES.map(({ code, label }) => {
    const entry = record(entries.find((candidate) => candidate?.code === code));
    const rawScore = Object.hasOwn(entry, "score") ? entry.score : indices[code];
    return {
      code,
      label: string(entry.label, label),
      score: numericScore(rawScore),
      available: rawScore !== undefined && rawScore !== null && rawScore !== ""
    };
  });
}

function normalizeLearningPattern(value) {
  const source = record(value);
  const entries = Array.isArray(value) ? value : source.entries ?? source.preferences ?? source.items;
  const normalizeEntry = (rawEntry) => {
    const entry = record(rawEntry);
    return {
      code: string(entry.code),
      label: string(entry.label, "未命名入口"),
      role: string(entry.role),
      score: numericScore(entry.score),
      definition: string(entry.definition),
      interpretation: string(entry.interpretation),
      mechanisms: array(entry.mechanisms ?? entry.mechanismEvidence).map((rawMechanism) => {
        const mechanism = record(rawMechanism);
        return {
          label: string(mechanism.label, "学习方式"),
          level: string(mechanism.level),
          definition: string(mechanism.definition),
          typicalBehaviors: array(mechanism.typicalBehaviors).filter((item) => typeof item === "string"),
          sceneExample: string(mechanism.sceneExample)
        };
      })
    };
  };
  return {
    title: string(source.title),
    intro: string(source.intro),
    connection: string(source.connection),
    entries: array(entries).map(normalizeEntry),
    allEntries: array(source.allEntries).map(normalizeEntry)
  };
}

function normalizeInsightItems(value) {
  return array(value).map((rawItem, index) => {
    if (typeof rawItem === "string") return { title: `你已经拥有的学习条件 ${index + 1}`, text: rawItem, example: "" };
    const item = record(rawItem);
    return { title: string(item.title, `学习优势 ${index + 1}`), text: string(item.text), example: string(item.example) };
  }).filter((item) => item.text);
}

function normalizeScenes(value, fallback = {}) {
  const source = record(value);
  const fallbackSource = record(fallback);
  const rawScenes = source.scenes
    ?? source.actions
    ?? (hasOwnRecord(fallbackSource, "priorityAction") ? [fallbackSource.priorityAction] : []);
  return array(rawScenes).map((rawScene) => {
    const scene = record(rawScene);
    return {
      label: string(scene.label, "历史行动"),
      material: string(scene.material ?? scene.scene),
      action: string(scene.action ?? scene.task),
      evidence: string(scene.evidence ?? scene.output ?? scene.independentOutput),
      successCriterion: string(scene.successCriterion ?? scene.check ?? scene.completionCriterion)
    };
  });
}

function normalizeDays(value) {
  const source = record(value);
  return array(source.days ?? source.sevenDayPlan).map((rawDay, index) => {
    const day = record(rawDay);
    return {
      day: Number.isInteger(day.day) ? day.day : index + 1,
      title: string(day.title, `第${index + 1}天`),
      action: string(day.action ?? day.task),
      evidence: string(day.evidence ?? day.output),
      support: string(day.support),
      successCriterion: string(day.successCriterion ?? day.check)
    };
  });
}

function stageFromDay(rawDay, id, title) {
  const day = record(rawDay);
  const periodById = { baseline: "第1天", trial: "第2—5天", retest: "第6—7天" };
  return {
    id,
    period: string(day.period, periodById[id]),
    title: string(day.title, title),
    strategy: string(day.strategy),
    action: string(day.action ?? day.task, LEGACY_MISSING.action),
    evidence: string(day.evidence ?? day.output, "保留一份可以前后比较的学习产出。"),
    support: string(day.support, "老师或教练只提供必要提示，并帮助核对产出。"),
    successCriterion: string(day.successCriterion ?? day.check, "能够比较前后完成结果，判断是否比原来更有效。")
  };
}

function normalizeWeekPlan(value) {
  const source = record(value);
  const rawStages = array(source.stages);
  const days = normalizeDays(source);
  const stages = rawStages.length === 3
    ? rawStages.map((rawStage, index) => stageFromDay(rawStage, ["baseline", "trial", "retest"][index], ["先按平时做一遍", "按新方式试几次", "换一组内容再做一遍"][index]))
    : [
      stageFromDay(days[0], "baseline", "先看原来的状态"),
      stageFromDay(days[1] ?? days[0], "trial", "试用新的学习方式"),
      stageFromDay(days.at(-1), "retest", "先不看提示再试一次")
    ];
  const defaultComparison = [
    { id: "independence", label: "自己开始", question: "不看提示时，能不能自己找到第一步？" },
    { id: "accuracy", label: "准确性", question: "与原来相比，关键错误是否减少？" },
    { id: "explanation", label: "解释能力", question: "能否用自己的话说明为什么这样做？" },
    { id: "transfer", label: "换题应用", question: "条件变化时，能否判断哪些做法需要调整？" }
  ];
  const comparison = array(source.comparison).length === 4
    ? source.comparison.map((rawItem, index) => {
      const item = record(rawItem);
      return {
        id: string(item.id, defaultComparison[index].id),
        label: string(item.label, defaultComparison[index].label),
        question: string(item.question, defaultComparison[index].question)
      };
    })
    : defaultComparison;
  const decisionSource = record(source.decision);
  return {
    title: string(source.title),
    intro: string(source.intro),
    stages,
    comparison,
    decision: {
      options: hasNonEmptyStrings(decisionSource.options) ? decisionSource.options : ["保留", "调整", "更换"],
      nextAction: string(decisionSource.nextAction, "根据前后产出选择保留、调整或更换；下一轮只改变一个步骤。")
    }
  };
}

export function normalizeStudentReport(value, publicView = {}) {
  const report = record(value);
  const versioned = Object.hasOwn(report, "schemaVersion");
  if (versioned) validateVersionedReport(report);
  else if (!isKnownLegacyStudentReport(report)) incompleteReport();
  const overviewSource = record(report.overview);
  const legacySections = record(report.sections);
  const oneSentenceSource = firstRecord(
    report.oneSentence,
    report.summary,
    report.judgment,
    legacySections.oneSentence,
    legacySections.summary,
    legacySections.recognition
  );
  const learningPatternSource = firstRecord(report.learningPattern, legacySections.learningPattern);
  const strengthsSource = firstRecord(report.strengths, report.strength, legacySections.strengths, legacySections.strength);
  const risksSource = firstRecord(report.risks, report.risk, legacySections.risks, legacySections.risk);
  const subjectPlanSource = firstRecord(report.subjectPlan, report.subjectApplication, legacySections.subjectPlan);
  const nextStepSource = record(report.nextStep);
  const sevenDaySource = firstRecord(
    report.sevenDayAction,
    report.actionCard,
    nextStepSource,
    legacySections.sevenDayAction,
    legacySections.actionCard
  );
  const scenes = normalizeScenes(subjectPlanSource, nextStepSource);
  const priorityBase = firstRecord(
    risksSource.priorityStrategy,
    subjectPlanSource.priorityStrategy,
    oneSentenceSource.priorityStrategy,
    record(report.scienceEvidence).priorityStrategy,
    overviewSource.priorityScience
  );
  const priorityOverview = record(overviewSource.priorityStrategy);
  const priorityStrategy = normalizePriority({
    ...priorityBase,
    id: string(priorityOverview.id, priorityBase.id),
    label: string(priorityOverview.label, priorityBase.label),
    definition: string(priorityOverview.definition, priorityBase.definition),
    studentLabel: string(priorityOverview.studentLabel, priorityBase.studentLabel)
  });
  const firstActionSource = firstRecord(overviewSource.firstAction, scenes[0]);
  const firstAction = {
    subject: string(firstActionSource.subject, string(subjectPlanSource.subject, string(overviewSource.targetSubject))),
    action: string(firstActionSource.action, LEGACY_MISSING.action)
  };
  const oneSentence = {
    title: string(oneSentenceSource.title),
    text: string(oneSentenceSource.text ?? oneSentenceSource.content, LEGACY_MISSING.headline)
  };
  const learningPattern = normalizeLearningPattern(
    Array.isArray(report.preferenceExplanations) ? report.preferenceExplanations : learningPatternSource
  );
  if (!learningPattern.intro) learningPattern.intro = string(record(report.profile).text);
  const scoreContext = normalizeScoreContext(overviewSource.scoreContext);
  const taskUnitSource = record(subjectPlanSource.taskUnit);
  const planSubject = string(subjectPlanSource.subject, string(overviewSource.targetSubject, string(report.targetSubject)));
  const taskTitle = string(subjectPlanSource.taskTitle, string(taskUnitSource.title, `${planSubject || "目标学科"}学习任务`));
  const sourceSteps = hasNonEmptyStrings(subjectPlanSource.practiceRounds)
    ? subjectPlanSource.practiceRounds
    : hasNonEmptyStrings(subjectPlanSource.steps)
      ? subjectPlanSource.steps
      : [scenes[0]?.material, scenes[0]?.action, scenes[0]?.evidence].filter(Boolean);
  const fallbackSteps = [
    `先独立完成一次${taskTitle}`,
    "对照结果，标出最先卡住的地方",
    "隔开一段时间，再完成一次比较变化"
  ];
  const taskActions = sourceSteps.slice(0, 3);
  while (taskActions.length < 3) taskActions.push(fallbackSteps[taskActions.length]);
  const entryStartSource = record(subjectPlanSource.entryStart);
  const strategyPracticeSource = record(subjectPlanSource.strategyPractice);
  const adapterSource = record(subjectPlanSource.executionAdapter);
  const adapterMechanisms = array(adapterSource.mechanisms)
    .map((mechanism) => string(record(mechanism).label))
    .filter(Boolean);

  return {
    ...(versioned ? { schemaVersion: report.schemaVersion } : {}),
    sections: SECTION_IDS.map((id) => ({ id })),
    overview: {
      title: string(overviewSource.title, "学习模式定位与行动报告"),
      englishTitle: string(overviewSource.englishTitle, "LEARNING ACTION REPORT"),
      studentName: string(overviewSource.studentName, string(report.studentName, string(publicView.studentName))),
      maskedPhone: string(publicView.maskedPhone),
      grade: string(overviewSource.grade, string(report.grade)),
      targetSubject: string(overviewSource.targetSubject, string(subjectPlanSource.subject, string(report.targetSubject))),
      learningFocus: string(overviewSource.learningFocus, string(record(subjectPlanSource.focus).label, "当前重点")),
      scoreContext,
      assessmentDate: string(overviewSource.assessmentDate, string(report.assessmentDate)),
      profileHeadline: string(overviewSource.profileHeadline, oneSentence.text),
      supportPath: string(overviewSource.supportPath, "先找到更容易开始的方式，再用有效方法练习，最后通过真实任务检查是否掌握。"),
      priorityStrategy,
      strategyProgress: normalizeStrategyProgress(overviewSource.strategyProgress, priorityStrategy),
      firstAction,
      radar: normalizeRadar(report, overviewSource)
    },
    oneSentence,
    learningPattern,
    strengths: {
      title: string(strengthsSource.title),
      items: normalizeInsightItems(strengthsSource.items),
      boundary: string(strengthsSource.boundary, "学习入口能帮你开始和理解，但最后还是要自己做一遍、写一遍或说一遍。")
    },
    risks: {
      title: string(risksSource.title),
      items: array(risksSource.items).filter((item) => typeof item === "string"),
      headline: string(risksSource.headline, array(risksSource.items).find((item) => typeof item === "string")),
      explanation: string(risksSource.explanation, "入口能帮助你开始，但真正掌握仍要通过独立输出、检查和修正来验证。"),
      sceneExample: string(risksSource.sceneExample),
      priorityStrategy
    },
    subjectPlan: {
      title: string(subjectPlanSource.title),
      subject: planSubject,
      focus: {
        code: string(record(subjectPlanSource.focus).code),
        label: string(record(subjectPlanSource.focus).label)
      },
      executionGuide: string(subjectPlanSource.executionGuide ?? subjectPlanSource.recommendationLogic ?? subjectPlanSource.context),
      priorityStrategy,
      scenes,
      taskUnit: {
        id: string(taskUnitSource.id),
        examSystemLabel: string(taskUnitSource.examSystemLabel, string(taskUnitSource.examSystem)),
        title: string(taskUnitSource.title),
        taskLabel: string(taskUnitSource.taskLabel),
        sourceGuide: string(taskUnitSource.sourceGuide),
        knowledgeTarget: record(taskUnitSource.knowledgeTarget)
      },
      examSystem: string(subjectPlanSource.examSystem, string(taskUnitSource.examSystemLabel, string(taskUnitSource.examSystem))),
      taskTitle,
      knowledgeTargetLabel: string(subjectPlanSource.knowledgeTargetLabel, string(record(taskUnitSource.knowledgeTarget).studentLabel)),
      problem: string(subjectPlanSource.problem, "这周能不能用新方法完成一项真实学习任务？"),
      whyTask: string(subjectPlanSource.whyTask, "先用更容易开始的方式进入，再收起提示自己完成，看看这次是不是真的学会。"),
      smartGoal: string(subjectPlanSource.smartGoal, `本周目标：围绕${taskTitle}，第1次按平时的方法；第2、4、5天按新方法；第6—7天再试一次。`),
      example: string(subjectPlanSource.example),
      entryStart: {
        label: string(entryStartSource.label, adapterMechanisms.join("＋"), "按当前方式开始"),
        action: string(entryStartSource.action, subjectPlanSource.firstAction, scenes[0]?.action ?? LEGACY_MISSING.action)
      },
      strategyPractice: {
        label: string(strategyPracticeSource.label, formatStrategyLabel(priorityStrategy)),
        action: string(strategyPracticeSource.action, priorityStrategy.action, LEGACY_MISSING.strategyAction)
      },
      taskLabel: string(taskUnitSource.taskLabel, string(subjectPlanSource.material, string(subjectPlanSource.weeklyAction, `完成${taskTitle}`))),
      taskSource: string(subjectPlanSource.sourceGuide, string(taskUnitSource.sourceGuide, "从老师提供的同类练习中选题。")),
      matchExplanation: string(
        subjectPlanSource.matchExplanation,
        `本次按“${string(record(subjectPlanSource.focus).label, string(overviewSource.learningFocus, "当前重点"))}”生成，并结合当前学习入口调整做法。`
      ),
      taskActions,
      whyFirst: string(subjectPlanSource.whyFirst, `当前先围绕${string(subjectPlanSource.subject, "目标学科")}完成一项可检查的任务。`),
      weeklyAction: string(subjectPlanSource.weeklyAction, subjectPlanSource.firstAction, scenes[0]?.action ?? LEGACY_MISSING.action),
      material: string(subjectPlanSource.material, scenes[0]?.material ?? "从本周学习材料中选一项真实任务。"),
      walkthrough: string(subjectPlanSource.walkthrough, `拿到任务后，先${string(subjectPlanSource.firstAction, scenes[0]?.action ?? LEGACY_MISSING.action)}；完成后先不看提示再检查。`),
      firstAction: string(subjectPlanSource.firstAction, scenes[0]?.action ?? LEGACY_MISSING.action),
      auxiliaryCheck: string(subjectPlanSource.auxiliaryCheck, "完成后先不看提示，检查自己能否独立完成。"),
      practiceRounds: taskActions,
      steps: taskActions,
      evidence: string(subjectPlanSource.evidence, scenes[0]?.evidence ?? "保留一份可以检查的学习产出。"),
      support: string(subjectPlanSource.support, "老师或教练只提供必要提示，学生先独立完成再核对。"),
      successCriterion: string(subjectPlanSource.successCriterion, scenes[0]?.successCriterion ?? "用一份可检查产出判断是否有效。")
    },
    sevenDayAction: normalizeWeekPlan(sevenDaySource)
  };
}

function renderOverview(overview) {
  setText("studentName", overview.studentName);
  setText("maskedPhone", overview.maskedPhone);
  setText("grade", overview.grade);
  setText("targetSubject", overview.targetSubject);
  setText("learningFocus", overview.learningFocus);
  setText("assessmentDate", overview.assessmentDate);
  setText("overviewHeadline", overview.profileHeadline, "");
  setOptionalText("overviewEntryExplanation", entryHeadlineExplanation(overview.profileHeadline), "");
  setText("overviewPriorityStrategy", formatStrategyLabel(overview.priorityStrategy), "");
  setText("overviewFirstAction", overview.firstAction.action, "");
  renderStrategyProgress(overview.strategyProgress);
  const scoreCard = element("scoreContextCard");
  scoreCard.hidden = !overview.scoreContext.available;
  if (overview.scoreContext.available) {
    setText("scoreContextLabel", `你填的最近${overview.targetSubject}成绩`, "你填的最近成绩");
    setText("targetSubjectScore", `${formatScore(overview.scoreContext.score)} / ${formatScore(overview.scoreContext.fullScore)}`, "");
    setText("taskLevelLabel", `建议先从${overview.scoreContext.studentLabel.replace(/^先/, "")}开始`, "");
  }

  const scores = Object.fromEntries(overview.radar.map(({ code, score }) => [code, numericScore(score)]));
  const canvas = element("preferenceRadar");
  canvas.setAttribute("aria-description", overview.radar.map(({ label, score, available }) => (
    available ? `${label}${Math.round(numericScore(score))}/100` : `${label}未保存`
  )).join("，"));

  element("preferenceIndices").replaceChildren(...overview.radar.map(({ code, label, score, available }) => {
    const normalizedScore = numericScore(score);
    const row = document.createElement("div");
    row.className = "state-bar-row";
    const labelSpan = text("span", `${label}入口`, "state-bar-label");
    const track = text("div", "", "state-bar-track");
    const fill = text("span", "", "state-bar-fill");
    fill.style.width = `${normalizedScore}%`;
    track.append(fill);
    const scoreVal = text("strong", available ? `${Math.round(normalizedScore)}/100` : "--/100", "state-bar-value");
    row.append(labelSpan, track, scoreVal);
    return row;
  }));
  return { canvas, scores };
}

function renderStrategyProgress(strategies) {
  const container = document.getElementById("strategyProgress");
  if (!container) return;
  if (!strategies.length) {
    container.replaceChildren(text("p", "本次未保存学习策略的具体表现。", "strategy-progress-empty"));
    return;
  }
  container.replaceChildren(...strategies.map((strategy) => {
    const row = text("div", "", `strategy-progress-row${strategy.isPriority ? " is-priority" : ""}`);
    const meter = text("span", "", "strategy-meter");
    const segments = STRATEGY_LEVEL_SEGMENTS[strategy.level] ?? 2;
    for (let index = 1; index <= 3; index += 1) {
      const segment = text("i", "", index <= segments ? "is-filled" : "");
      meter.append(segment);
    }
    row.append(
      text("strong", strategy.label),
      meter,
      text("span", strategy.isPriority ? "本周先练" : strategy.level, "strategy-status")
    );
    return row;
  }));
}

function renderDimensionDetails(entries) {
  const container = document.getElementById("dimensionDetails");
  if (!container || !entries.length) return;

  const VARK_CONFIG = {
    V: {
      name: "视觉入口",
      icon: "/assets/images/icon-vark-visual.png",
      desc: "先看文字、图形、表格，在脑海中形成画面和结构。"
    },
    A: {
      name: "听觉入口",
      icon: "/assets/images/icon-vark-auditory.png",
      desc: "先听例子、讲解或自述，在声音中理解和记忆。"
    },
    R: {
      name: "读写入口",
      icon: "/assets/images/icon-vark-readwrite.png",
      desc: "先读一遍、写下来，通过文字梳理和输出想法。"
    },
    K: {
      name: "动觉入口",
      icon: "/assets/images/icon-vark-kinesthetic.png",
      desc: "先动手做、演示或体验，在操作中理解原理。"
    }
  };

  container.replaceChildren(...entries.map((entry) => {
    const card = document.createElement("article");
    card.className = `vark-card vark-${entry.code.toLowerCase()}`;
    const cfg = VARK_CONFIG[entry.code] || {
      name: `${entry.label}入口`,
      icon: "/assets/images/icon-vark-visual.png",
      desc: entry.definition
    };

    const iconWrap = document.createElement("div");
    iconWrap.className = "vark-card-icon-wrap";
    const iconImg = document.createElement("img");
    iconImg.src = cfg.icon;
    iconImg.alt = cfg.name;
    iconImg.className = "vark-card-icon-img";
    iconWrap.append(iconImg);

    const title = text("h4", cfg.name, "vark-card-title");
    const desc = text("p", cfg.desc || entry.definition, "vark-card-desc");

    card.append(iconWrap, title, desc);
    return card;
  }));
}

function renderMechanismDetails(entries) {
  const container = document.getElementById("mechanismDetailGroups");
  if (!container || !entries.length) return;
  container.replaceChildren(...entries.map((entry) => {
    const group = document.createElement("section");
    group.className = `mechanism-detail-group preference-${entry.code.toLowerCase()}`;
    const heading = text("div", "", "mechanism-detail-heading");
    heading.append(text("h3", `${entry.label}｜${Math.round(numericScore(entry.score))}/100`), text("p", entry.interpretation));
    const list = text("div", "", "mechanism-detail-list");
    list.append(...entry.mechanisms.map((mechanism) => {
      const item = text("article", "", "mechanism-detail-item");
      const top = text("div", "", "mechanism-detail-top");
      const levelClass = {
        "表现较明显": "evidence-high",
        "在部分场景出现": "evidence-medium",
        "当前证据较少": "evidence-low"
      }[mechanism.level] ?? "";
      top.append(text("strong", mechanism.label), text("span", mechanism.level, `evidence-level ${levelClass}`));
      item.append(
        top,
        text("p", mechanism.definition, "mechanism-detail-copy")
      );
      return item;
    }));
    group.append(heading, list);
    return group;
  }));
}

function renderStrengths(section) {
  element("strengthItems").replaceChildren(...section.items.map((item) => {
    const card = text("article", "", "strength-card");
    card.append(text("h3", item.title), text("p", item.text));
    if (item.example) card.append(text("p", item.example, "strength-example"));
    return card;
  }));
  setText("strengthBoundary", section.boundary, "");
}

function renderRisks(section) {
  const strategy = section.priorityStrategy || {};
  setText("riskHeadline", section.headline, "");
  setText("riskExplanation", section.explanation, "");
  setText("riskSceneExample", section.sceneExample, "");
  setText("priorityStrategyFormal", formatStrategyLabel(strategy), "");
  setText("priorityStrategyDefinition", strategy.definition, "");
  setText("priorityStrategyWhy", strategy.whyFirst, "");
}

function renderSubjectPlan(section) {
  setText("taskExamSystem", section.focus.label ? `${section.subject}｜${section.focus.label}` : section.subject, "");
  setText("subjectProblem", section.problem, "");
  setText("subjectSmartTarget", section.taskLabel, "");
  setText("subjectSmartMeasure", "照新方式练 3 次", "");
  setText("subjectSmartTime", "本周内；隔一天后再试一次", "");
  setText("subjectTryMethod", `${section.entryStart.label} + ${section.strategyPractice.label}`, "");
  setText("subjectTryMethodAction", `${section.entryStart.action}；${section.strategyPractice.action}`, "");
  setText("subjectTaskExample", section.example, "");
  setText("subjectFirstStep", section.taskActions[0], "");
  setText("subjectPracticeStep", section.taskActions[1], "");
  setText("subjectCheckStep", section.taskActions[2], "");
}

function renderOneWeek(section) {
  setText("sevenDayIntro", section.intro, "");
  element("weekStages").replaceChildren(...section.stages.map((stage, index) => {
    const item = document.createElement("article");
    item.className = "week-stage";
    const heading = text("div", "", "stage-heading");
    heading.append(text("span", stage.period || `阶段 ${index + 1}`, "stage-number"), text("h3", stage.title));
    item.append(heading, text("p", stage.action, "stage-action"));
    return item;
  }));
}

function renderReport(report) {
  const { canvas, scores } = renderOverview(report.overview);
  setText("summaryContent", report.oneSentence.text, "");
  renderDimensionDetails(report.learningPattern.allEntries);
  renderMechanismDetails(report.learningPattern.allEntries);
  renderStrengths(report.strengths);
  renderRisks(report.risks);
  renderSubjectPlan(report.subjectPlan);
  return { canvas, scores };
}

let activeRadar = null;
let radarFrame = 0;
let resizeListenerInstalled = false;

function scheduleRadarDraw() {
  if (!activeRadar) return;
  if (radarFrame && typeof window.cancelAnimationFrame === "function") window.cancelAnimationFrame(radarFrame);
  const draw = () => {
    radarFrame = 0;
    if (activeRadar) drawRadar(activeRadar.canvas, activeRadar.scores);
  };
  if (typeof window.requestAnimationFrame === "function") radarFrame = window.requestAnimationFrame(draw);
  else draw();
}

function activateRadar(canvas, scores) {
  activeRadar = { canvas, scores };
  if (!resizeListenerInstalled) {
    window.addEventListener("resize", scheduleRadarDraw);
    resizeListenerInstalled = true;
  }
  scheduleRadarDraw();
}

export function renderStudentReport(value, publicView = {}) {
  const report = normalizeStudentReport(value, publicView);
  const { canvas, scores } = renderReport(report);
  element("reportError").hidden = true;
  element("reportLoading").hidden = true;
  element("reportDocument").hidden = false;
  activateRadar(canvas, scores);
  return report;
}

function loadAdminPreviewPayload(previewId, mobile) {
  if (!previewId) return null;
  let raw = null;
  try {
    raw = sessionStorage.getItem(`lsa_admin_preview_${previewId}`);
  } catch {
    return null;
  }
  if (!raw) return null;

  let cached;
  try {
    cached = JSON.parse(raw);
  } catch {
    return null;
  }

  const parsed = cached.parsed || {};
  const itemMeta = { createdAt: cached.submittedAt, id: cached.recordId };
  const phone = mobile || cached.mobile || parsed.contact || "";
  rememberAssessmentSubmitPayload(parsed, itemMeta, phone);

  if (parsed.report?.studentReport) {
    return { report: parsed.report, studentReport: parsed.report.studentReport };
  }
  return buildReportPayloadFromParsedRecord(parsed, itemMeta, phone);
}

function hideReportFeedbackSection() {
  document.querySelectorAll("[data-report-feedback]").forEach((node) => {
    node.hidden = true;
  });
  const feedbackForm = document.getElementById("feedbackForm");
  const feedbackSection = feedbackForm?.closest("section");
  if (feedbackSection) feedbackSection.hidden = true;
}

function applyEmbedMode() {
  const params = new URLSearchParams(window.location.search);
  const isEmbed = params.get("embed") === "1";
  const isPreview = params.get("preview") === "1";
  if (!isEmbed && !isPreview) {
    const feedback = document.querySelector("[data-report-feedback]");
    if (feedback) feedback.hidden = false;
    return;
  }
  if (isEmbed) {
    document.body.classList.add("report-embed");
    const brandBar = document.querySelector(".brand-bar");
    if (brandBar) brandBar.hidden = true;
  }
  hideReportFeedbackSection();
}

function showError(message) {
  element("reportLoading").hidden = true;
  element("reportDocument").hidden = true;
  setText("reportErrorText", message, "请检查报告链接，或稍后再试。");
  element("reportError").hidden = false;
}

export async function loadReport(reportId) {
  element("reportError").hidden = true;
  element("reportDocument").hidden = true;
  element("reportLoading").hidden = false;
  try {
    let payload = null;
    const params = new URLSearchParams(window.location.search);
    let mobile = params.get("mobile") || params.get("phone") || params.get("customerMobile") || "";
    const sessionKey = params.get("session") || "";
    const previewId = params.get("previewId") || "";
    if (!mobile && reportId && /^1[3-9]\d{9}$/.test(reportId)) mobile = reportId;
    if (!mobile) mobile = localStorage.getItem("lsa_last_mobile") || "";

    const queryId = params.get("id") || (reportId && !/^1[3-9]\d{9}$/.test(reportId) ? reportId : "");

    if (previewId) {
      payload = loadAdminPreviewPayload(previewId, mobile);
    }

    if (!payload && queryId) {
      try {
        payload = await loadReportFromApiById(queryId);
      } catch (e) {
        console.warn("读取唯一 ID 后台报告 API 异常:", e);
      }
    }

    if (!payload) {
      const sessionKey = params.get("session") || "";
      const localSessionData = getLocalSessionData(sessionKey || queryId || reportId);
      if (localSessionData) {
        rememberAssessmentSubmitPayloadFromSession(localSessionData, mobile);
        payload = resolveReportPayload(localSessionData, mobile);
      }
    }

    if (payload && payload.report?.studentReport) {
      renderStudentReport(payload.report.studentReport, payload.report);
      scheduleAutoPrintIfRequested();
      return;
    }

    showError("暂时无法生成报告，请稍后再试或重新读取。");
  } catch (error) {
    console.error("报告加载失败:", error);
    showError(error?.message || "报告加载失败，请稍后重试。");
  }
}

async function submitFeedback(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const data = new FormData(form);
  const fitRating = Number(data.get("fitRating"));
  if (!Number.isInteger(fitRating) || fitRating < 1 || fitRating > 5) {
    setText("feedbackError", "请先选择 1 至 5 的符合程度。", "");
    element("feedbackError").hidden = false;
    return;
  }

  if (!currentAssessmentSubmitPayload) {
    const mobile = getMobileNumber();
    const sessionKey = new URLSearchParams(window.location.search).get("session");
    const localDataStr = (sessionKey ? localStorage.getItem("lsa_session_" + sessionKey) : null)
      || localStorage.getItem("lsa_last_record");
    if (localDataStr) {
      try {
        rememberAssessmentSubmitPayloadFromSession(JSON.parse(localDataStr), mobile);
      } catch (e) {}
    }
  }

  if (!currentAssessmentSubmitPayload) {
    setText("feedbackError", "未找到测评记录，暂时无法提交反馈。", "");
    element("feedbackError").hidden = false;
    return;
  }

  element("submitFeedback").disabled = true;
  const selfIdentifiedPreference = String(data.get("selfIdentifiedPreference") || "").trim() || null;
  const comment = String(data.get("comment") || "").trim() || null;
  const feedbackJson = {
    fitRating,
    selfIdentifiedPreference,
    comment,
    submittedAt: new Date().toISOString()
  };
  const base = currentAssessmentSubmitPayload;

  try {
    const response = await fetch(ASSESSMENT_SUBMIT_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        templateCode: base.templateCode,
        token: base.token,
        name: base.name,
        contact: base.contact,
        id: base.assessmentId,
        assessmentId: base.assessmentId,
        feedbackJson: JSON.stringify(feedbackJson)
      })
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok || (payload.code !== 0 && payload.code !== 200)) {
      throw new Error(payload.message || "反馈提交失败");
    }
    element("feedbackSuccess").hidden = false;
    element("feedbackError").hidden = true;
    form.querySelectorAll("input, select, textarea, button").forEach((control) => { control.disabled = true; });
  } catch (error) {
    setText("feedbackError", error.message || "反馈暂时无法提交，请稍后再试。", "");
    element("feedbackError").hidden = false;
    element("submitFeedback").disabled = false;
  }
}

function getMobileNumber() {
  const params = new URLSearchParams(window.location.search);
  let mobile = params.get("mobile") || params.get("phone") || params.get("customerMobile") || "";
  if (!mobile) mobile = localStorage.getItem("lsa_last_mobile") || "";
  return mobile ? mobile.trim() : "";
}

function isWeChatBrowser() {
  const ua = navigator.userAgent || "";
  return /MicroMessenger|Lark|Feishu|DingTalk|QQ\//i.test(ua) || (typeof window !== "undefined" && window.navigator && window.navigator.standalone === true);
}

function optionalElement(id) {
  return document.getElementById(id);
}

function showWeChatPrintGuide() {
  const guide = optionalElement("wechatPrintGuide");
  const status = optionalElement("wechatPrintStatus");
  if (!guide) return;
  if (status) status.hidden = true;
  guide.hidden = false;
}

function hideWeChatPrintGuide() {
  const guide = optionalElement("wechatPrintGuide");
  if (guide) guide.hidden = true;
}

function showWeChatImagePreview(dataUrl) {
  const preview = optionalElement("wechatImagePreview");
  const image = optionalElement("wechatSavedImage");
  if (!preview || !image) return;
  image.src = dataUrl;
  preview.hidden = false;
  hideWeChatPrintGuide();
}

function hideWeChatImagePreview() {
  const preview = optionalElement("wechatImagePreview");
  const image = optionalElement("wechatSavedImage");
  if (preview) preview.hidden = true;
  if (image) image.removeAttribute("src");
}

function loadHtml2Canvas() {
  if (typeof window.html2canvas === "function") {
    return Promise.resolve(window.html2canvas);
  }
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js";
    script.async = true;
    script.onload = () => {
      if (typeof window.html2canvas === "function") resolve(window.html2canvas);
      else reject(new Error("图片组件加载失败"));
    };
    script.onerror = () => reject(new Error("图片组件加载失败"));
    document.head.appendChild(script);
  });
}

async function captureReportLongImage() {
  const reportNode = optionalElement("reportDocument");
  if (!reportNode || reportNode.hidden) {
    throw new Error("报告尚未加载完成，请稍后再试。");
  }
  const guide = optionalElement("wechatPrintGuide");
  const wasGuideHidden = guide ? guide.hidden : true;
  if (guide) guide.hidden = true;

  const currentScrollY = window.scrollY;
  const currentScrollX = window.scrollX;
  window.scrollTo(0, 0);

  try {
    const html2canvas = await loadHtml2Canvas();
    const canvas = await html2canvas(reportNode, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#fbf7ef",
      logging: false,
      scrollX: 0,
      scrollY: 0,
      x: 0,
      y: 0,
      width: reportNode.offsetWidth,
      height: reportNode.offsetHeight
    });
    return canvas.toDataURL("image/png");
  } finally {
    window.scrollTo(currentScrollX, currentScrollY);
    if (guide && !wasGuideHidden) guide.hidden = false;
  }
}

async function copyReportLink() {
  const url = window.location.href;
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(url);
    return;
  }
  const input = document.createElement("textarea");
  input.value = url;
  input.setAttribute("readonly", "");
  input.style.position = "fixed";
  input.style.left = "-9999px";
  document.body.appendChild(input);
  input.select();
  const copied = document.execCommand("copy");
  input.remove();
  if (!copied) throw new Error("复制失败，请手动复制地址栏链接。");
}

async function saveReportImageInWeChat() {
  const status = optionalElement("wechatPrintStatus");
  const button = optionalElement("wechatSaveImage");
  if (button) button.disabled = true;
  if (status) {
    status.hidden = false;
    status.textContent = "正在生成长图，请稍候…";
  }
  try {
    const dataUrl = await captureReportLongImage();
    showWeChatImagePreview(dataUrl);
  } catch (error) {
    if (status) {
      status.hidden = false;
      status.textContent = error?.message || "生成长图失败，请稍后再试。";
    }
  } finally {
    if (button) button.disabled = false;
  }
}

async function copyReportLinkInWeChat() {
  const status = optionalElement("wechatPrintStatus");
  try {
    await copyReportLink();
    if (status) {
      status.hidden = false;
      status.textContent = "链接已复制。请粘贴到 Safari 或 Chrome 打开后再打印。";
    }
  } catch (error) {
    if (status) {
      status.hidden = false;
      status.textContent = error?.message || "复制失败，请手动复制地址栏链接。";
    }
  }
}

function handlePrintReport() {
  try {
    window.print();
  } catch (e) {
    console.warn("window.print exception:", e);
    showWeChatPrintGuide();
  }
}

function bindWeChatPrintGuide() {
  optionalElement("wechatPrintGuideBackdrop")?.addEventListener("click", hideWeChatPrintGuide);
  optionalElement("wechatPrintGuideClose")?.addEventListener("click", hideWeChatPrintGuide);
  optionalElement("wechatImagePreviewBackdrop")?.addEventListener("click", hideWeChatImagePreview);
  optionalElement("wechatImagePreviewClose")?.addEventListener("click", hideWeChatImagePreview);
  optionalElement("wechatSaveImage")?.addEventListener("click", () => {
    saveReportImageInWeChat();
  });
  optionalElement("wechatCopyLink")?.addEventListener("click", () => {
    copyReportLinkInWeChat();
  });
}

function scheduleAutoPrintIfRequested() {
  const params = new URLSearchParams(window.location.search);
  if (params.get("print") !== "1") return;
  window.setTimeout(() => {
    if (isWeChatBrowser()) {
      showWeChatPrintGuide();
      return;
    }
    window.print();
  }, 600);
}

function bindPrintButtons() {
  const printBtn = optionalElement("printReport");
  const mobilePrintBtn = optionalElement("mobilePrintBtn");
  if (printBtn) {
    printBtn.addEventListener("click", handlePrintReport);
    if (isWeChatBrowser()) {
      printBtn.textContent = "保存报告";
    }
  }
  if (mobilePrintBtn) {
    mobilePrintBtn.addEventListener("click", handlePrintReport);
    if (isWeChatBrowser()) {
      mobilePrintBtn.textContent = "保存报告";
    }
  }
}

function boot() {
  applyEmbedMode();
  element("retryReport").addEventListener("click", () => {
    let mobile = getMobileNumber();
    if (!mobile) {
      mobile = window.prompt("请输入测评时填写的手机号以调取报告：", "");
      if (mobile && mobile.trim()) {
        mobile = mobile.trim();
        localStorage.setItem("lsa_last_mobile", mobile);
      }
    }
    if (mobile) {
      loadReport(mobile);
    } else {
      showError("未输入手机号，无法调取后台报告。");
    }
  });

  bindPrintButtons();
  bindWeChatPrintGuide();

  element("feedbackForm").addEventListener("submit", submitFeedback);
  loadReport(reportIdFromLocation() || getMobileNumber());
}

if (typeof window !== "undefined" && typeof document !== "undefined") {
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot, { once: true });
  else boot();
}
