import { AssessmentRecord, CustomTemplate } from "./types";
import { parseAssessmentContextFromUrl as parseCtx, getFFCRMContextFromUrl as getContext } from "../utils/url";
import { getAssessmentDataFromCtx as getDataFromCtx } from "../utils/crypto";

export const ASSESSMENT_API_BASE = "https://ffcrm-api.1605ai.com";

export const parseAssessmentContextFromUrl = parseCtx;
export const getFFCRMContextFromUrl = getContext;
export const getAssessmentDataFromCtx = getDataFromCtx;

export const TEMPLATE_META: Record<string, { projectKey: string; projectName: string; projectTagClass: string }> = {
  "学习风格": { projectKey: "learningStyle", projectName: "学习风格测评", projectTagClass: "bg-amber-100 text-amber-800 border-amber-200" },
  LEARNING_STYLE: { projectKey: "learningStyle", projectName: "学习风格测评", projectTagClass: "bg-amber-100 text-amber-800 border-amber-200" },
  "学习动机": { projectKey: "motivation", projectName: "学习动机测评", projectTagClass: "bg-sky-100 text-sky-800 border-sky-200" },
  MOTIVATION: { projectKey: "motivation", projectName: "学习动机测评", projectTagClass: "bg-sky-100 text-sky-800 border-sky-200" },
  "FTH创业者": { projectKey: "fthBoss", projectName: "FTH 创业者职业特质", projectTagClass: "bg-rose-100 text-rose-800 border-rose-200" },
  FTH_BOSS: { projectKey: "fthBoss", projectName: "FTH 创业者职业特质", projectTagClass: "bg-rose-100 text-rose-800 border-rose-200" },
  "FTH微信版": { projectKey: "fthTalent", projectName: "FTH 职业特质(微信版)", projectTagClass: "bg-emerald-100 text-emerald-800 border-emerald-200" },
  FTH_TALENT: { projectKey: "fthTalent", projectName: "FTH 职业特质(微信版)", projectTagClass: "bg-emerald-100 text-emerald-800 border-emerald-200" },
  "FTH1605": { projectKey: "fth1605", projectName: "FTH 职业特质(1605版)", projectTagClass: "bg-purple-100 text-purple-800 border-purple-200" },
  "FTH 1605版": { projectKey: "fth1605", projectName: "FTH 职业特质(1605版)", projectTagClass: "bg-purple-100 text-purple-800 border-purple-200" },
  FTH_1605: { projectKey: "fth1605", projectName: "FTH 职业特质(1605版)", projectTagClass: "bg-purple-100 text-purple-800 border-purple-200" }
};

export function resolveTemplateMeta(templateCode: string) {
  if (TEMPLATE_META[templateCode]) return TEMPLATE_META[templateCode];
  const code = String(templateCode || "").toLowerCase();
  if (code.includes("学习风格") || code.includes("learning")) return TEMPLATE_META["学习风格"];
  if (code.includes("学习动机") || code.includes("motivation")) return TEMPLATE_META["学习动机"];
  if (code.includes("微信") || code.includes("talent")) return TEMPLATE_META["FTH微信版"];
  if (code.includes("1605")) return TEMPLATE_META["FTH1605"];
  if (code.includes("fth") || code.includes("创业者") || code.includes("boss")) return TEMPLATE_META["FTH创业者"];

  return {
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
    const studentName = item.customerName || parsed.name || parsed.studentName || item.employeeName || "匿名学员";
    const phoneNumber = item.customerMobile || parsed.contact || parsed.phone || parsed.phoneNumber || "未填手机号";

    return {
      ...item,
      id: item.id || idx + 1,
      projectKey: meta.projectKey,
      projectName: meta.projectName,
      projectTagClass: meta.projectTagClass,
      studentName,
      phoneNumber,
      submittedAt: item.createdTime || item.submittedAt || parsed.submittedAt || new Date().toISOString(),
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
