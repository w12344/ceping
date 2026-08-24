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

  // 开启 VConsole 移动端调试面板
  if (typeof window !== "undefined" && !window.__vconsole_loaded__) {
    window.__vconsole_loaded__ = true;
    const cdns = [
      "https://unpkg.com/vconsole@latest/dist/vconsole.min.js",
      "https://cdn.jsdelivr.net/npm/vconsole@3.15.1/dist/vconsole.min.js",
      "https://cdnjs.cloudflare.com/ajax/libs/vConsole/3.15.1/vconsole.min.js"
    ];
    let cdnIndex = 0;

    function tryLoadVConsole() {
      if (cdnIndex >= cdns.length) return;
      const script = document.createElement("script");
      script.src = cdns[cdnIndex++];
      script.async = true;
      script.onload = function () {
        if (window.VConsole && !window.vConsole) {
          window.vConsole = new window.VConsole();
        }
      };
      script.onerror = function () {
        tryLoadVConsole();
      };
      (document.head || document.documentElement).appendChild(script);
    }

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", tryLoadVConsole);
    } else {
      tryLoadVConsole();
    }
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
})(typeof window !== "undefined" ? window : globalThis);
