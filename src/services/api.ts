import { AssessmentRecord, CustomTemplate } from "./types";
import { parseAssessmentContextFromUrl as parseCtx, getFFCRMContextFromUrl as getContext } from "../utils/url";
import { getAssessmentDataFromCtx as getDataFromCtx } from "../utils/crypto";

export const ASSESSMENT_API_BASE = "https://ceping.1605ai.com";

export const parseAssessmentContextFromUrl = parseCtx;
export const getFFCRMContextFromUrl = getContext;
export const getAssessmentDataFromCtx = getDataFromCtx;

export interface TemplateMeta {
  templateCode: string;
  templateName: string;
  templateType: "STUDENT_LEARNING" | "CAREER_TALENT" | string;
  templateTypeName: string;
  projectKey: string;
  projectName: string;
  projectTagClass: string;
}

export const TEMPLATE_META: Record<string, TemplateMeta> = {
  LEARNING_STYLE: {
    templateCode: "LEARNING_STYLE",
    templateName: "学习模式定位",
    templateType: "STUDENT_LEARNING",
    templateTypeName: "学生学习测评",
    projectKey: "learningStyle",
    projectName: "学习模式定位",
    projectTagClass: "bg-amber-100 text-amber-800 border-amber-200"
  },
  "学习风格": {
    templateCode: "LEARNING_STYLE",
    templateName: "学习模式定位",
    templateType: "STUDENT_LEARNING",
    templateTypeName: "学生学习测评",
    projectKey: "learningStyle",
    projectName: "学习模式定位",
    projectTagClass: "bg-amber-100 text-amber-800 border-amber-200"
  },
  MOTIVATION: {
    templateCode: "MOTIVATION",
    templateName: "动力系统探索",
    templateType: "STUDENT_LEARNING",
    templateTypeName: "学生学习测评",
    projectKey: "motivation",
    projectName: "动力系统探索",
    projectTagClass: "bg-sky-100 text-sky-800 border-sky-200"
  },
  "学习动机": {
    templateCode: "MOTIVATION",
    templateName: "动力系统探索",
    templateType: "STUDENT_LEARNING",
    templateTypeName: "学生学习测评",
    projectKey: "motivation",
    projectName: "动力系统探索",
    projectTagClass: "bg-sky-100 text-sky-800 border-sky-200"
  },
  FTH_BOSS: {
    templateCode: "FTH_BOSS",
    templateName: "FTH 创业者职业特质测评",
    templateType: "CAREER_TALENT",
    templateTypeName: "职业特质测评",
    projectKey: "fthBoss",
    projectName: "FTH 创业者职业特质测评",
    projectTagClass: "bg-rose-100 text-rose-800 border-rose-200"
  },
  "FTH创业者": {
    templateCode: "FTH_BOSS",
    templateName: "FTH 创业者职业特质测评",
    templateType: "CAREER_TALENT",
    templateTypeName: "职业特质测评",
    projectKey: "fthBoss",
    projectName: "FTH 创业者职业特质测评",
    projectTagClass: "bg-rose-100 text-rose-800 border-rose-200"
  },
  FTH_TALENT: {
    templateCode: "FTH_TALENT",
    templateName: "FTH 职业特质测评(微信版)",
    templateType: "CAREER_TALENT",
    templateTypeName: "职业特质测评",
    projectKey: "fthTalent",
    projectName: "FTH 职业特质测评(微信版)",
    projectTagClass: "bg-emerald-100 text-emerald-800 border-emerald-200"
  },
  "FTH微信版": {
    templateCode: "FTH_TALENT",
    templateName: "FTH 职业特质测评(微信版)",
    templateType: "CAREER_TALENT",
    templateTypeName: "职业特质测评",
    projectKey: "fthTalent",
    projectName: "FTH 职业特质测评(微信版)",
    projectTagClass: "bg-emerald-100 text-emerald-800 border-emerald-200"
  },
  FTH_1605: {
    templateCode: "FTH_1605",
    templateName: "FTH 职业特质测评(1605版)",
    templateType: "CAREER_TALENT",
    templateTypeName: "职业特质测评",
    projectKey: "fth1605",
    projectName: "FTH 职业特质测评(1605版)",
    projectTagClass: "bg-purple-100 text-purple-800 border-purple-200"
  },
  "FTH1605": {
    templateCode: "FTH_1605",
    templateName: "FTH 职业特质测评(1605版)",
    templateType: "CAREER_TALENT",
    templateTypeName: "职业特质测评",
    projectKey: "fth1605",
    projectName: "FTH 职业特质测评(1605版)",
    projectTagClass: "bg-purple-100 text-purple-800 border-purple-200"
  },
  "FTH 1605版": {
    templateCode: "FTH_1605",
    templateName: "FTH 职业特质测评(1605版)",
    templateType: "CAREER_TALENT",
    templateTypeName: "职业特质测评",
    projectKey: "fth1605",
    projectName: "FTH 职业特质测评(1605版)",
    projectTagClass: "bg-purple-100 text-purple-800 border-purple-200"
  }
};

export function resolveTemplateMeta(templateCode: string): TemplateMeta {
  if (TEMPLATE_META[templateCode]) return TEMPLATE_META[templateCode];
  const code = String(templateCode || "").toLowerCase();
  if (code.includes("学习风格") || code.includes("学习模式定位") || code.includes("style") || code.includes("learning")) return TEMPLATE_META["LEARNING_STYLE"];
  if (code.includes("学习动机") || code.includes("动力系统探索") || code.includes("motivation")) return TEMPLATE_META["MOTIVATION"];
  if (code.includes("微信") || code.includes("talent")) return TEMPLATE_META["FTH_TALENT"];
  if (code.includes("1605")) return TEMPLATE_META["FTH_1605"];
  if (code.includes("fth") || code.includes("创业者") || code.includes("boss")) return TEMPLATE_META["FTH_BOSS"];

  return {
    templateCode: String(templateCode || "CUSTOM_HTML"),
    templateName: String(templateCode || "自定义测评"),
    templateType: "CAREER_TALENT",
    templateTypeName: "自定义测评",
    projectKey: "customHTML",
    projectName: String(templateCode || "自定义测评"),
    projectTagClass: "bg-violet-100 text-violet-800 border-violet-200"
  };
}

export function parseResultJson(raw: any) {
  if (!raw) return {};
  try {
    return typeof raw === "string" ? JSON.parse(raw) : raw;
  } catch {
    return {};
  }
}

/**
 * 根据记录 ID 单条查询测评明细
 */
export async function fetchAssessmentDetail(id: string | number) {
  try {
    let response = await fetch(`${ASSESSMENT_API_BASE}/api/assessment/result/${encodeURIComponent(id)}`);
    let resData = await response.json();
    if (resData.code === 200 || resData.code === 0) {
      return resData.data;
    }
    response = await fetch(`${ASSESSMENT_API_BASE}/api/assessment/detail?id=${encodeURIComponent(id)}`);
    resData = await response.json();
    if (resData.code === 200 || resData.code === 0) {
      return resData.data;
    }
  } catch (e) {
    console.warn("读取单条测评详情异常:", e);
  }
  return null;
}

/**
 * 根据学员手机号查询测评列表
 */
export async function fetchAssessmentByMobile(customerMobile: string) {
  try {
    const response = await fetch(`${ASSESSMENT_API_BASE}/api/assessment/result/page?customerMobile=${encodeURIComponent(customerMobile)}&pageSize=100`);
    const resData = await response.json();
    if (resData.code === 200 || resData.code === 0) {
      return resData.data?.list || resData.data || [];
    }
  } catch (e) {
    console.warn("按手机号查询测评记录异常:", e);
  }
  return [];
}

/**
 * 提交测评结果至 FFCRM 后端统一保存接口
 */
export async function submitAssessmentPayload(payload: Record<string, any>) {
  const response = await fetch(`${ASSESSMENT_API_BASE}/api/assessment/submit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  const resData = await response.json();
  if (!response.ok || (resData.code !== 200 && resData.code !== 0)) {
    throw new Error(resData.message || "提交测评结果失败");
  }
  return resData.data;
}

export async function fetchAssessmentList(token: string): Promise<AssessmentRecord[]> {
  let allRecords: any[] = [];
  let page = 1;
  const pageSize = 100;

  try {
    while (true) {
      const response = await fetch(
        `${ASSESSMENT_API_BASE}/api/assessment/public/list?page=${page}&pageSize=${pageSize}`,
        {
          headers: {
            "Admin-Export-Token": token,
            "Content-Type": "application/json"
          }
        }
      );
      const resData = await response.json();
      if (!response.ok || (resData.code !== 0 && resData.code !== 200)) {
        throw new Error(resData.message || "请求失败，请检查 Token 密钥");
      }

      const rawData = resData.data;
      const list = Array.isArray(rawData)
        ? rawData
        : (Array.isArray(rawData?.data)
          ? rawData.data
          : (Array.isArray(rawData?.list)
            ? rawData.list
            : (Array.isArray(rawData?.records) ? rawData.records : [])));

      if (Array.isArray(list) && list.length > 0) {
        allRecords = allRecords.concat(list);
        if (list.length < pageSize) break;
        page++;
      } else {
        break;
      }
    }
  } catch (err: any) {
    console.error("数据拉取异常:", err);
    throw err;
  }

  return allRecords.map((item, idx) => {
    const meta = resolveTemplateMeta(item.templateCode);
    const parsed = parseResultJson(item.resultJson);
    const resObj = parsed.resultData || parsed.result || parsed;

    const studentInfo = parsed.studentInfo || parsed.userInfo || parsed.basicInfo || resObj.userInfo || {};
    const studentName = item.customerName || studentInfo.name || studentInfo.studentName || parsed.name || resObj.name || item.employeeName || "匿名学员";
    const phoneNumber = item.customerMobile || studentInfo.mobile || studentInfo.phoneNumber || studentInfo.contact || parsed.contact || resObj.contact || "未填手机号";
    const grade = studentInfo.grade || parsed.grade || resObj.grade || "--";
    const specialtyDirection = studentInfo.specialtyDirection || parsed.specialtyDirection || resObj.specialtyDirection || "";
    const scoreBand = studentInfo.scoreBand || parsed.scoreBand || resObj.scoreBand || "";
    const foreignLanguage = studentInfo.foreignLanguage || parsed.foreignLanguage || resObj.foreignLanguage || "";
    const targetSubject = studentInfo.targetSubject || parsed.targetSubject || resObj.targetSubject || "--";
    const targetSubjectScore = studentInfo.targetSubjectScore ?? parsed.targetSubjectScore ?? resObj.targetSubjectScore;
    const targetSubjectFullScore = studentInfo.targetSubjectFullScore ?? parsed.targetSubjectFullScore ?? resObj.targetSubjectFullScore ?? 150;
    const learningFocus = studentInfo.learningFocus || parsed.learningFocus || resObj.learningFocus || "";
    const profileId = studentInfo.profileId || parsed.profileId || item.profileId || item.customerId || "";

    const advisorInfo = parsed.advisorInfo || {};
    const advisorName = item.employeeName || advisorInfo.name || item.advisorName || "";
    const advisorMobile = advisorInfo.mobile || item.advisorMobile || "";
    const advisorToken = advisorInfo.token || item.advisorToken || "";
    const advisorEmployeeId = item.employeeId || advisorInfo.employeeId || "";

    const assessmentInfo = parsed.assessmentInfo || {};
    const answers = assessmentInfo.answers || parsed.answers || [];
    const durationSeconds = Number(assessmentInfo.durationSeconds || parsed.durationSeconds || resObj.durationSeconds || 0) || 0;
    const submittedAt = item.createdAt || item.createdTime || assessmentInfo.submittedAt || parsed.submittedAt || resObj.submittedAt || new Date().toISOString();
    const reportUrl = item.reportUrl || assessmentInfo.reportUrl || (item.id ? `https://ceping.1605ai.com/report.html?id=${item.id}` : "");

    let vScore = 0, aScore = 0, rScore = 0, kScore = 0;
    if (Array.isArray(answers)) {
      answers.forEach((ans: any) => {
        const qId = String(ans.questionId || ans.id || "");
        const val = Number(ans.value || ans.score || 0);
        if (qId.startsWith("V")) vScore += val;
        else if (qId.startsWith("A")) aScore += val;
        else if (qId.startsWith("R")) rScore += val;
        else if (qId.startsWith("K")) kScore += val;
      });
    }

    let dominantModality = "";
    if (vScore > 0 || aScore > 0 || rScore > 0 || kScore > 0) {
      const maxVal = Math.max(vScore, aScore, rScore, kScore);
      const dominants = [];
      if (vScore === maxVal) dominants.push("视觉型 (V)");
      if (aScore === maxVal) dominants.push("听觉型 (A)");
      if (rScore === maxVal) dominants.push("读写型 (R)");
      if (kScore === maxVal) dominants.push("动觉型 (K)");
      dominantModality = dominants.join(" + ");
    }

    let scoreText = "--";
    if (targetSubjectScore !== null && targetSubjectScore !== undefined && targetSubjectScore !== "") {
      scoreText = `${targetSubjectScore}/${targetSubjectFullScore}分`;
    }

    return {
      ...item,
      id: item.id || idx + 1,
      projectKey: meta.projectKey,
      projectName: meta.projectName,
      projectTagClass: meta.projectTagClass,
      studentName,
      phoneNumber,
      profileId,
      grade,
      specialtyDirection,
      scoreBand,
      foreignLanguage,
      targetSubject,
      targetSubjectScore,
      targetSubjectFullScore,
      learningFocus,
      advisorName,
      advisorMobile,
      advisorToken,
      advisorEmployeeId,
      answers,
      answersCount: answers.length,
      vScore,
      aScore,
      rScore,
      kScore,
      dominantModality,
      scoreText,
      detailSummary: dominantModality || meta.projectName,
      submittedAt,
      durationSeconds,
      reportUrl,
      resultData: parsed
    };
  });
}

export function getCustomTemplates(): CustomTemplate[] {
  try {
    return JSON.parse(localStorage.getItem("feifan_custom_templates") || "[]");
  } catch {
    return [];
  }
}

export function saveCustomTemplate(template: CustomTemplate) {
  const existing = getCustomTemplates();
  existing.unshift(template);
  localStorage.setItem("feifan_custom_templates", JSON.stringify(existing));
}
