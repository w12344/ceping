/**
 * 非凡测评平台 - 标准前端桥接 SDK (Feifan Assessment Bridge SDK)
 * 版本: v1.0.0 (2026-08-13)
 * 用途: 供任何自定义 HTML 测评页面嵌入使用，自动解析 URL 参数、持久化 Token 并将数据提交至统一数据库。
 */
(function (global) {
  "use strict";

  const SUBMIT_ENDPOINT = "https://ffcrm-api.1605ai.com/api/assessment/submit";

  function getUrlParams() {
    const params = new URLSearchParams(global.location ? global.location.search : "");
    const hashParams = new URLSearchParams((global.location && global.location.hash ? global.location.hash.split("?")[1] : "") || "");
    const get = (key) => params.get(key) || hashParams.get(key) || "";

    return {
      mobile: get("mobile") || get("phone") || get("customerMobile") || get("contact") || "",
      name: get("name") || get("customerName") || get("studentName") || "",
      token: get("token") || get("ref") || get("advisorToken") || localStorage.getItem("advisor_token") || localStorage.getItem("feifan_ref") || "",
      session: get("session") || get("sessionId") || `session_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      preview: get("preview") === "1" || get("embed") === "1",
      embed: get("embed") === "1"
    };
  }

  const initialParams = getUrlParams();

  // 自动持久化顾问 token
  if (initialParams.token) {
    try {
      localStorage.setItem("advisor_token", initialParams.token);
      localStorage.setItem("feifan_ref", initialParams.token);
    } catch (e) {}
  }

  const FeifanAssessment = {
    params: initialParams,
    getAdvisorToken: () => getUrlParams().token,
    getMobile: () => getUrlParams().mobile,
    getSession: () => getUrlParams().session,

    /**
     * 提交测评结果至非凡数据库
     * @param {Object} config
     * @param {string} config.templateCode 测评代码 (例如: "物理诊断")
     * @param {string} [config.name] 学员姓名
     * @param {string} [config.contact] 联系方式/手机号
     * @param {Object|Array} [config.answers] 原始答题数据
     * @param {Object} [config.resultData] 诊断分数/阶段结论/评语结构
     * @param {number} [config.durationSeconds] 答题用时秒数
     * @param {string} [config.redirectUrl] 提交成功后跳转的页面 (可选)
     * @param {Function} [config.onSuccess] 成功回调
     * @param {Function} [config.onError] 失败回调
     */
    submit: async function (config) {
      if (!config || typeof config !== "object") {
        throw new Error("[FeifanAssessment] 必须传入配置对象！");
      }

      const params = getUrlParams();
      const templateCode = config.templateCode || "自定义测评";
      const token = config.token || params.token || "";
      const name = config.name || params.name || "未填写姓名";
      const contact = config.contact || params.mobile || "";
      const session = config.session || params.session;

      const payload = {
        templateCode: templateCode,
        token: token,
        name: name,
        contact: contact,
        session: session,
        userInfo: {
          studentName: name,
          phoneNumber: contact,
          ...(config.userInfo || {})
        },
        answers: config.answers || {},
        resultData: config.resultData || config.result || {},
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

        const resJson = await response.json().catch(() => ({}));
        if (response.ok && (resJson.code === 0 || resJson.code === 200)) {
          console.log("[FeifanAssessment] 数据提交成功:", resJson);
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
        const tokenStr = token ? `&token=${encodeURIComponent(token)}` : "";
        const target = `${config.redirectUrl}${joiner}mobile=${encodeURIComponent(contact)}&session=${encodeURIComponent(session)}${tokenStr}`;
        global.location.assign(target);
      }
    }
  };

  global.FeifanAssessment = FeifanAssessment;
})(typeof window !== "undefined" ? window : globalThis);
