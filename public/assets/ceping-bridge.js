/**
 * 非凡测评平台 - 标准前端桥接 SDK (Feifan Assessment Bridge SDK)
 * 版本: v1.2.0 (2026-08-13)
 * 用途: 供任何自定义 HTML 测评与内置测评嵌入使用，支持解密 ctx 加密串与 URL 明文参数、自动持久化 Token、自动回显输入框并将数据提交至统一数据库。
 */
(function (global) {
  "use strict";

  const BACKEND_BASE = "https://ffcrm-api.1605ai.com";
  const SUBMIT_ENDPOINT = `${BACKEND_BASE}/api/assessment/submit`;

  /**
   * 解密 ctx 加密串，还原 7 项顾问与学生全量数据
   */
  function parseAssessmentContextFromUrl() {
    const loc = typeof global !== "undefined" && global.location ? global.location : { search: "", hash: "" };
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
        // 🔑 顾问 4 项
        advisor: {
          token:  data.at || "",
          userId: data.au || "",
          name:   data.an || "",
          mobile: data.am || "",
        },
        // 🎓 学生 3 项
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

  /**
   * 读取 URL Query 参数 (优先解析 ctx 加密串，降级为 URL 明文参数与本地缓存)
   */
  function getFFCRMContextFromUrl() {
    const ctxData = parseAssessmentContextFromUrl();
    const loc = typeof global !== "undefined" && global.location ? global.location : { search: "", hash: "" };
    const params = new URLSearchParams(loc.search || "");
    const hashParams = new URLSearchParams((loc.hash && loc.hash.includes("?") ? loc.hash.split("?")[1] : "") || "");
    const get = (key) => params.get(key) || hashParams.get(key) || "";

    const advisorToken = pickFirstValid(get("token"), get("ref"), get("advisorToken"), ctxData?.advisor.token, localStorage.getItem("advisor_token"), localStorage.getItem("feifan_ref"));
    const advisorUserId = pickFirstValid(get("userId"), get("employeeId"), get("advisorUserId"), ctxData?.advisor.userId, localStorage.getItem("advisor_user_id"));
    const advisorName = pickFirstValid(get("employeeName"), get("advisorName"), ctxData?.advisor.name, localStorage.getItem("advisor_name"));
    const advisorMobile = pickFirstValid(get("advisorMobile"), get("employeeMobile"), ctxData?.advisor.mobile, localStorage.getItem("advisor_mobile"));

    const studentName = pickFirstValid(get("studentName"), get("name"), get("customerName"), ctxData?.student.name, localStorage.getItem("student_name"));
    const studentMobile = pickFirstValid(get("studentMobile"), get("mobile"), get("phone"), get("customerMobile"), ctxData?.student.mobile, localStorage.getItem("student_mobile"));
    const profileId = pickFirstValid(get("profileId"), get("customerId"), ctxData?.student.profileId, localStorage.getItem("profile_id"));

    // 自动持久化存储
    try {
      if (advisorToken) {
        localStorage.setItem("advisor_token", advisorToken);
        localStorage.setItem("feifan_ref", advisorToken);
      }
      if (advisorUserId) localStorage.setItem("advisor_user_id", advisorUserId);
      if (advisorName && !["用户", "顾问", "未知"].includes(advisorName.trim())) localStorage.setItem("advisor_name", advisorName);
      if (advisorMobile) localStorage.setItem("advisor_mobile", advisorMobile);

      if (studentName) localStorage.setItem("student_name", studentName);
      if (studentMobile) localStorage.setItem("student_mobile", studentMobile);
      if (profileId) localStorage.setItem("profile_id", profileId);
    } catch (e) {}

    return {
      // 🔑 顾问信息
      advisor: {
        token: advisorToken,
        userId: advisorUserId,
        name: advisorName,
        mobile: advisorMobile
      },
      // 🎓 学生信息
      student: {
        name: studentName,
        mobile: studentMobile,
        profileId: profileId
      }
    };
  }

  /**
   * 自动在测评页面中回显学员姓名与手机号
   */
  function autoFillInputs() {
    const ctx = getFFCRMContextFromUrl();
    const student = ctx.student;

    if (student.name) {
      const nameSelectors = [
        'input[placeholder*="姓名"]',
        "#studentName",
        'input[name="studentName"]',
        "#nameInput",
        "#name",
        "#username",
        'input[name="name"]',
        "#userName"
      ];
      for (const sel of nameSelectors) {
        const el = document.querySelector(sel);
        if (el && !el.value) {
          el.value = student.name;
          el.dispatchEvent(new Event("input", { bubbles: true }));
          el.dispatchEvent(new Event("change", { bubbles: true }));
        }
      }
    }

    if (student.mobile) {
      const mobileSelectors = [
        'input[placeholder*="手机"]',
        "#phoneNumber",
        'input[name="phoneNumber"]',
        "#phoneInput",
        "#mobile",
        "#phone",
        "#contact",
        'input[name="mobile"]',
        'input[name="phone"]',
        "#userPhone"
      ];
      for (const sel of mobileSelectors) {
        const el = document.querySelector(sel);
        if (el && !el.value) {
          el.value = student.mobile;
          el.dispatchEvent(new Event("input", { bubbles: true }));
          el.dispatchEvent(new Event("change", { bubbles: true }));
        }
      }
    }
  }

  // DOM Ready 时自动执行回显
  if (typeof document !== "undefined") {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", autoFillInputs);
    } else {
      setTimeout(autoFillInputs, 100);
    }
  }

  const initialContext = getFFCRMContextFromUrl();

  const FeifanAssessment = {
    parseAssessmentContextFromUrl: parseAssessmentContextFromUrl,
    getFFCRMContextFromUrl: getFFCRMContextFromUrl,
    autoFillInputs: autoFillInputs,
    context: initialContext,
    params: {
      name: initialContext.student.name,
      mobile: initialContext.student.mobile,
      token: initialContext.advisor.token,
      profileId: initialContext.student.profileId
    },
    getAdvisorToken: () => getFFCRMContextFromUrl().advisor.token,
    getMobile: () => getFFCRMContextFromUrl().student.mobile,
    getSession: () => `session_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,

    /**
     * 提交测评结果至非凡数据库
     * @param {Object} config
     */
    submit: async function (config) {
      if (!config || typeof config !== "object") {
        throw new Error("[FeifanAssessment] 必须传入配置对象！");
      }

      const ctx = getFFCRMContextFromUrl();
      const templateCode = config.templateCode || "CUSTOM_HTML";
      const templateName = config.templateName || config.projectName || "自定义 HTML 测评";
      const templateType = config.templateType || "CAREER_TALENT";
      const token = config.token || ctx.advisor.token || "";
      const name = config.name || ctx.student.name || "未填写姓名";
      const contact = config.contact || config.mobile || ctx.student.mobile || "";
      const session = config.session || `session_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

      const payload = {
        templateCode: templateCode,
        templateName: templateName,
        templateType: templateType,
        token: token,
        name: name,
        contact: contact,
        session: session,

        // 标准 🔑 顾问 & 🎓 学员透传字段
        advisorUserId: ctx.advisor.userId,
        advisorName: ctx.advisor.name,
        advisorMobile: ctx.advisor.mobile,

        profileId: ctx.student.profileId,
        customerId: ctx.student.profileId,
        studentName: name,
        studentMobile: contact,

        userInfo: {
          studentName: name,
          phoneNumber: contact,
          profileId: ctx.student.profileId,
          advisorToken: token,
          advisorUserId: ctx.advisor.userId,
          advisorName: ctx.advisor.name,
          advisorMobile: ctx.advisor.mobile,
          ...(config.userInfo || {})
        },
        answers: config.answers || {},
        resultData: config.resultData || config.result || {},
        reportUrl: config.redirectUrl || "https://ceping.1605ai.com/report.html",
        durationSeconds: Number(config.durationSeconds) || 60,
        submittedAt: new Date().toISOString()
      };

      try {
        console.log("[FeifanAssessment] 正在提交测评数据至统一数据库:", payload);
        const response = await fetch(SUBMIT_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        let recordId = null;
        const resJson = await response.json().catch(() => ({}));
        if (response.ok && (resJson.code === 0 || resJson.code === 200)) {
          console.log("[FeifanAssessment] 数据提交成功:", resJson);
          if (resJson.data && (resJson.data.id || resJson.data.savedId)) {
            recordId = resJson.data.id || resJson.data.savedId;
          }
          if (typeof config.onSuccess === "function") {
            config.onSuccess(resJson);
          }
        } else {
          console.warn("[FeifanAssessment] 接口提醒:", resJson);
          if (typeof config.onError === "function") {
            config.onError(resJson);
          }
        }
      } catch (err) {
        console.error("[FeifanAssessment] 数据提交网络异常:", err);
        if (typeof config.onError === "function") {
          config.onError(err);
        }
      }

      // 等待 1 秒确保持续化落地
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (config.redirectUrl) {
        const joiner = config.redirectUrl.includes("?") ? "&" : "?";
        if (recordId) {
          global.location.assign(`${config.redirectUrl}${joiner}id=${encodeURIComponent(recordId)}`);
        } else {
          const tokenStr = token ? `&token=${encodeURIComponent(token)}` : "";
          const profileStr = ctx.student.profileId ? `&profileId=${encodeURIComponent(ctx.student.profileId)}` : "";
          const target = `${config.redirectUrl}${joiner}mobile=${encodeURIComponent(contact)}&session=${encodeURIComponent(session)}${tokenStr}${profileStr}`;
          global.location.assign(target);
        }
      }
    }
  };

  FeifanAssessment.getAssessmentDataFromCtx = parseAssessmentContextFromUrl;

  global.getAssessmentDataFromCtx = parseAssessmentContextFromUrl;
  global.parseAssessmentContextFromUrl = parseAssessmentContextFromUrl;
  global.getFFCRMContextFromUrl = getFFCRMContextFromUrl;
  global.FeifanAssessment = FeifanAssessment;
})(typeof window !== "undefined" ? window : globalThis);
