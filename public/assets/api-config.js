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

  // 归属顾问排除黑名单
  if (!global.ASSESSMENT_EXCLUDED_ADVISORS) {
    global.ASSESSMENT_EXCLUDED_ADVISORS = ["用户", "顾问", "未知", "李老师", "杜雨龙"];
  }

  if (!global.buildAdvisorListUrl) {
    global.buildAdvisorListUrl = function buildAdvisorListUrl(base) {
      const isLocalUrl = (global.location && (global.location.hostname === "localhost" || global.location.hostname === "127.0.0.1" || global.location.hostname === "[::1]"));
      const apiBase = base || global.ASSESSMENT_API_BASE || (isLocalUrl ? "https://ffcrm-daily.1605ai.com" : "https://ffcrm-api.1605ai.com");
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

  // 返回学习中心：直接调用 CommonBridge.goBack()，若未注入则回退到上一页或分发中心
  if (!global.goLearningCenter) {
    global.goLearningCenter = function goLearningCenter() {
      if (global.CommonBridge?.goBack) {
        global.CommonBridge.goBack();
        return;
      }
      if (global.AndroidBridge?.goBack) {
        global.AndroidBridge.goBack();
        return;
      }
      if (typeof global.goBackOrFallback === "function") {
        global.goBackOrFallback("/portal.html");
        return;
      }
      if (global.history && global.history.length > 1) {
        global.history.back();
        return;
      }
      global.location.href = "/portal.html";
    };
  }

  if (typeof document !== "undefined") {
    document.addEventListener("click", function (e) {
      const btn = e.target && e.target.closest && e.target.closest('[data-action="go-learning-center"], .back-learning-center-btn');
      if (btn) {
        e.preventDefault();
        global.goLearningCenter();
      }
    });
  }

  // =========================================================================
  // 全局防复制保护机制（支持安卓 WebView / 移动端 H5 / 各类内置浏览器）
  // 彻底禁用复制、剪切、长按选中文本、长按呼出系统菜单与拖拽，保护测评与报告知识产权
  // =========================================================================
  if (typeof window !== "undefined" && typeof document !== "undefined" && !window.__anti_copy_installed__) {
    window.__anti_copy_installed__ = true;

    // 1. 注入强制 CSS 规则：除 input/textarea 外全部禁止文本选中与长按调用
    try {
      const styleEl = document.createElement("style");
      styleEl.type = "text/css";
      styleEl.id = "feifan-anti-copy-style";
      styleEl.innerHTML = `
        *, *::before, *::after {
          -webkit-user-select: none !important;
          -moz-user-select: none !important;
          -ms-user-select: none !important;
          user-select: none !important;
          -webkit-touch-callout: none !important;
          -webkit-user-drag: none !important;
        }
        input, textarea, [contenteditable="true"], select {
          -webkit-user-select: text !important;
          -moz-user-select: text !important;
          -ms-user-select: text !important;
          user-select: text !important;
          -webkit-touch-callout: default !important;
        }
        img {
          pointer-events: none !important;
          -webkit-user-drag: none !important;
        }
      `;
      (document.head || document.documentElement).appendChild(styleEl);
    } catch (e) {}

    // 2. 捕获阶段拦截 copy 复制事件
    document.addEventListener("copy", function (e) {
      const target = e.target;
      const isInput = target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable);
      if (!isInput) {
        e.preventDefault();
        e.stopPropagation();
        if (e.clipboardData) {
          e.clipboardData.clearData();
        }
        return false;
      }
    }, true);

    // 3. 捕获阶段拦截 cut 剪切事件
    document.addEventListener("cut", function (e) {
      const target = e.target;
      const isInput = target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable);
      if (!isInput) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    }, true);

    // 4. 拦截 selectstart 事件（防止手指长按滑选文字）
    document.addEventListener("selectstart", function (e) {
      const target = e.target;
      const isInput = target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable);
      if (!isInput) {
        e.preventDefault();
        return false;
      }
    }, true);

    // 5. 拦截 contextmenu 长按弹出右键/系统操作菜单事件
    document.addEventListener("contextmenu", function (e) {
      const target = e.target;
      const isInput = target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA");
      if (!isInput) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    }, true);

    // 6. 拦截 dragstart 图片或文本拖拽行为
    document.addEventListener("dragstart", function (e) {
      const target = e.target;
      const isInput = target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA");
      if (!isInput) {
        e.preventDefault();
        return false;
      }
    }, true);
  }

  // =========================================================================
  // 非凡教育 · 全局高可用测评提交与离线防丢同步引擎 (Guaranteed Delivery Submitter)
  // 机制：本地 Outbox 预写 -> 4次并发退避重试 -> 页面跳转 keepalive 保护 ->
  //       全页面生命周期 (online/visibilitychange/load) 后台自动静默补发 -> 收到 200 ACK 出队
  // =========================================================================
  const QUEUE_KEY = "feifan_pending_submit_queue";

  function getPendingQueue() {
    try {
      const raw = localStorage.getItem(QUEUE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  function savePendingQueue(queue) {
    try {
      localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
    } catch (e) {
      console.warn("保存待发送队列失败:", e);
    }
  }

  function enqueuePendingSubmit(payload, clientKey) {
    const queue = getPendingQueue();
    const existingIndex = queue.findIndex(item => item.clientKey === clientKey);
    const item = {
      clientKey: clientKey || "sub_" + Date.now() + "_" + Math.random().toString(36).slice(2, 7),
      payload: payload,
      enqueuedAt: Date.now(),
      retryCount: 0,
      lastAttempt: 0
    };
    if (existingIndex >= 0) {
      queue[existingIndex] = item;
    } else {
      queue.push(item);
    }
    savePendingQueue(queue);
    return item.clientKey;
  }

  function dequeuePendingSubmit(clientKey) {
    let queue = getPendingQueue();
    queue = queue.filter(item => item.clientKey !== clientKey);
    savePendingQueue(queue);
  }

  async function executeSingleSubmit(payload, timeoutMs = 8000) {
    const isLocal = typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" || window.location.hostname === "[::1]");
    const backendBase = global.ASSESSMENT_API_BASE || (isLocal ? "https://ffcrm-daily.1605ai.com" : "https://ffcrm-api.1605ai.com");
    const endpoint = `${backendBase}/api/assessment/submit`;

    const controller = typeof AbortController !== "undefined" ? new AbortController() : null;
    const timer = controller ? setTimeout(() => controller.abort(), timeoutMs) : null;

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller ? controller.signal : undefined,
        keepalive: true, // 确保页面跳转切页时请求不被浏览器强行终止
        body: JSON.stringify(payload)
      });
      if (timer) clearTimeout(timer);
      const resJson = await response.json().catch(() => ({}));
      if (response.ok && (resJson.code === 200 || resJson.code === 0)) {
        const recordId = resJson.data?.id || resJson.data?.savedId || (typeof resJson.data === "string" || typeof resJson.data === "number" ? String(resJson.data) : null);
        return { success: true, recordId, data: resJson.data };
      }
      return { success: false, message: resJson.message || `HTTP ${response.status}` };
    } catch (err) {
      if (timer) clearTimeout(timer);
      return { success: false, message: err.message || "Network Error" };
    }
  }

  async function submitWithGuaranteedDelivery(payload, options = {}) {
    const clientKey = options.clientKey || "sub_" + Date.now() + "_" + Math.random().toString(36).slice(2, 7);
    enqueuePendingSubmit(payload, clientKey);

    const maxRetries = options.maxRetries || 4;
    let lastError = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      const res = await executeSingleSubmit(payload, 8000);
      if (res.success && res.recordId) {
        dequeuePendingSubmit(clientKey);
        return { success: true, recordId: res.recordId, data: res.data, isLocalFallback: false };
      }
      lastError = res.message;
      if (attempt < maxRetries) {
        await new Promise(r => setTimeout(r, attempt * 400 + Math.random() * 200));
      }
    }

    // 若当前由于网络异常未能立即完成 API 确认，触发后台自动静默补发
    triggerBackgroundSync();

    return {
      success: true, // 本地已安全持久化，允许先进入报告页，后台持续补发送达 API
      recordId: null,
      clientKey: clientKey,
      isLocalFallback: true,
      error: lastError
    };
  }

  let isSyncing = false;
  async function triggerBackgroundSync() {
    if (isSyncing || typeof window === "undefined") return;
    const queue = getPendingQueue();
    if (!queue || queue.length === 0) return;

    isSyncing = true;
    try {
      for (const item of queue) {
        if (Date.now() - (item.lastAttempt || 0) < 3000) continue;
        item.lastAttempt = Date.now();
        item.retryCount = (item.retryCount || 0) + 1;

        const res = await executeSingleSubmit(item.payload, 10000);
        if (res.success && res.recordId) {
          dequeuePendingSubmit(item.clientKey);
        } else {
          savePendingQueue(getPendingQueue());
        }
      }
    } catch (e) {
      console.warn("后台补发异常:", e);
    } finally {
      isSyncing = false;
    }
  }

  global.FeifanAssessmentSubmitter = {
    submit: submitWithGuaranteedDelivery,
    syncPending: triggerBackgroundSync,
    getPendingCount: () => getPendingQueue().length
  };

  if (typeof window !== "undefined") {
    window.addEventListener("online", () => triggerBackgroundSync());
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") triggerBackgroundSync();
    });
    window.addEventListener("load", () => {
      setTimeout(triggerBackgroundSync, 1000);
    });
  }
})(typeof window !== "undefined" ? window : globalThis);
