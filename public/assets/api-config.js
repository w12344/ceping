(function (global) {
  "use strict";

  if (!global.ASSESSMENT_API_BASE) {
    const host = (global.location && global.location.hostname) || "";
    const isLocal = host === "localhost" || host === "127.0.0.1" || host === "[::1]";

    global.ASSESSMENT_API_BASE = isLocal
      ? "https://ffcrm-daily.1605ai.com"
      : "https://ffcrm-api.1605ai.com";
  }

  // 归属顾问下拉：销售 + 市场人员
  if (!global.ASSESSMENT_ADVISOR_ROLE_CODES) {
    global.ASSESSMENT_ADVISOR_ROLE_CODES = "SALES,MARKET";
  }

  if (!global.buildAdvisorListUrl) {
    global.buildAdvisorListUrl = function buildAdvisorListUrl(base) {
      const apiBase = base || global.ASSESSMENT_API_BASE || "https://ffcrm-api.1605ai.com";
      const roleCodes = global.ASSESSMENT_ADVISOR_ROLE_CODES || "SALES,MARKET";
      return `${apiBase}/api/assessment/advisors?roleCode=${encodeURIComponent(roleCodes)}`;
    };
  }

  if (!global.goBack) {
    global.goBack = function goBack() {
      if (global.CommonBridge?.goBack) {
        global.CommonBridge.goBack();
        return;
      }
      if (global.AndroidBridge?.goBack) {
        global.AndroidBridge.goBack();
        return;
      }
      global.history.back();
    };
  }

  if (!global.goBackOrFallback) {
    global.goBackOrFallback = function goBackOrFallback(fallbackUrl) {
      if (global.CommonBridge?.goBack) {
        global.CommonBridge.goBack();
        return;
      }
      if (global.AndroidBridge?.goBack) {
        global.AndroidBridge.goBack();
        return;
      }
      const fallback = fallbackUrl || "/portal.html";
      if (global.history && global.history.length > 1) {
        global.history.back();
        return;
      }
      global.location.href = fallback;
    };
  }
})(typeof window !== "undefined" ? window : globalThis);
