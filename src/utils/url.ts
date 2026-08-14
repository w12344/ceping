/**
 * URL 参数提取与 FFCRM 上下文辅助工具
 */
import { decryptAssessmentContext } from "./crypto";

export const parseAssessmentContextFromUrl = decryptAssessmentContext;

/**
 * 智能提取第一个有效非空且非通用占位符的候选字符串
 */
export function pickFirstValid(...candidates: (string | null | undefined)[]): string {
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

export interface UnifiedContextData {
  advisor: {
    token: string;
    userId: string;
    name: string;
    mobile: string;
  };
  student: {
    name: string;
    mobile: string;
    profileId: string;
  };
}

/**
 * 全效提取当前 URL、URL Hash、localStorage 及 ctx 中的综合上下文数据
 */
export function getFFCRMContextFromUrl(): UnifiedContextData {
  const loc = typeof window !== "undefined" ? window.location : { search: "", hash: "" };
  const queryParams = new URLSearchParams(loc.search || "");
  const hashParams = loc.hash && loc.hash.includes("?")
    ? new URLSearchParams(loc.hash.split("?")[1] || "")
    : null;

  const getParam = (key: string) => queryParams.get(key) || hashParams?.get(key) || "";

  const ctxData = decryptAssessmentContext(getParam("ctx"));

  const advisorToken = pickFirstValid(
    getParam("ref"),
    getParam("token"),
    getParam("advisorToken"),
    ctxData?.advisor.token,
    typeof localStorage !== "undefined" ? localStorage.getItem("advisor_token") : null,
    typeof localStorage !== "undefined" ? localStorage.getItem("feifan_ref") : null
  );

  const advisorUserId = pickFirstValid(
    getParam("userId"),
    getParam("employeeId"),
    getParam("advisorUserId"),
    ctxData?.advisor.userId,
    typeof localStorage !== "undefined" ? localStorage.getItem("advisor_user_id") : null
  );

  const advisorName = pickFirstValid(
    getParam("employeeName"),
    getParam("advisorName"),
    ctxData?.advisor.name,
    typeof localStorage !== "undefined" ? localStorage.getItem("advisor_name") : null
  );

  const advisorMobile = pickFirstValid(
    getParam("advisorMobile"),
    getParam("employeeMobile"),
    ctxData?.advisor.mobile,
    typeof localStorage !== "undefined" ? localStorage.getItem("advisor_mobile") : null
  );

  const studentName = pickFirstValid(
    getParam("studentName"),
    getParam("name"),
    getParam("customerName"),
    ctxData?.student.name,
    typeof localStorage !== "undefined" ? localStorage.getItem("student_name") : null
  );

  const studentMobile = pickFirstValid(
    getParam("studentMobile"),
    getParam("mobile"),
    getParam("phone"),
    getParam("customerMobile"),
    ctxData?.student.mobile,
    typeof localStorage !== "undefined" ? localStorage.getItem("student_mobile") : null
  );

  const profileId = pickFirstValid(
    getParam("profileId"),
    getParam("customerId"),
    ctxData?.student.profileId,
    typeof localStorage !== "undefined" ? localStorage.getItem("profile_id") : null
  );

  // 安全写回 localStorage (过滤伪占位符)
  if (typeof localStorage !== "undefined") {
    try {
      if (advisorToken) {
        localStorage.setItem("advisor_token", advisorToken);
        localStorage.setItem("feifan_ref", advisorToken);
      }
      if (advisorUserId) localStorage.setItem("advisor_user_id", advisorUserId);
      if (advisorName) localStorage.setItem("advisor_name", advisorName);
      if (advisorMobile) localStorage.setItem("advisor_mobile", advisorMobile);
      if (studentName) localStorage.setItem("student_name", studentName);
      if (studentMobile) localStorage.setItem("student_mobile", studentMobile);
      if (profileId) localStorage.setItem("profile_id", profileId);
    } catch (e) {}
  }

  return {
    advisor: {
      token: advisorToken,
      userId: advisorUserId,
      name: advisorName,
      mobile: advisorMobile
    },
    student: {
      name: studentName,
      mobile: studentMobile,
      profileId: profileId
    }
  };
}

/**
 * 构建超短透传发牌链接 (优先仅透传 ?ctx=...)
 */
export function getShareUrl(baseUrl: string): string {
  const loc = typeof window !== "undefined" ? window.location : { search: "", hash: "" };
  const params = new URLSearchParams(loc.search || "");

  if (loc.hash && loc.hash.includes("?")) {
    const hp = new URLSearchParams(loc.hash.split("?")[1] || "");
    hp.forEach((val, key) => {
      if (!params.has(key)) params.set(key, val);
    });
  }

  // 1. 如果已包含 ctx，直接超短透传
  const ctx = params.get("ctx");
  if (ctx) {
    const sep = baseUrl.includes("?") ? "&" : "?";
    return `${baseUrl}${sep}ctx=${encodeURIComponent(ctx)}`;
  }

  // 2. 无 ctx 时拼接必备字段
  const ignoreKeys = new Set(["embed", "feishu_sso", "hide", "pure", "tab", "v", "code", "state"]);
  const queryObj = new URLSearchParams();

  params.forEach((val, key) => {
    if (!ignoreKeys.has(key) && val !== null && val !== undefined && val !== "") {
      queryObj.set(key, val);
    }
  });

  const ctxObj = getFFCRMContextFromUrl();
  if (ctxObj) {
    if (ctxObj.advisor.token && !queryObj.has("token")) queryObj.set("token", ctxObj.advisor.token);
    if (ctxObj.advisor.name && !["用户", "顾问", "未知"].includes(ctxObj.advisor.name.trim()) && !queryObj.has("employeeName") && !queryObj.has("advisorName")) {
      queryObj.set("employeeName", ctxObj.advisor.name);
    }
    if (ctxObj.student.name && !queryObj.has("studentName")) queryObj.set("studentName", ctxObj.student.name);
    if (ctxObj.student.mobile && !queryObj.has("studentMobile") && !queryObj.has("phone")) queryObj.set("studentMobile", ctxObj.student.mobile);
    if (ctxObj.student.profileId && !queryObj.has("profileId") && !queryObj.has("customerId")) queryObj.set("profileId", ctxObj.student.profileId);
  }

  const queryString = queryObj.toString();
  if (!queryString) return baseUrl;

  const sep = baseUrl.includes("?") ? "&" : "?";
  return `${baseUrl}${sep}${queryString}`;
}
