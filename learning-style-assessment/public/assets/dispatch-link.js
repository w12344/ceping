/**
 * 非凡教育 · 测评一次性分发链接客户端
 * - 创建 / 校验 / 核销 dl= 参数链接
 */
(function (global) {
  const API_BASE = "https://ceping.1605ai.com/api/dispatch-links";
  const OSS_BASE = "https://ceping.1605ai.com/dispatch/links";

  function readTokenFromUrl() {
    const params = new URLSearchParams(global.location.search);
    return params.get("dl") || params.get("link") || "";
  }

  async function fetchJson(url, options) {
    const res = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options && options.headers ? options.headers : {})
      }
    });
    let data = null;
    try {
      data = await res.json();
    } catch (e) {
      data = null;
    }
    return { res, data };
  }

  async function readFromOss(token) {
    try {
      const res = await fetch(`${OSS_BASE}/${encodeURIComponent(token)}.json`, { cache: "no-store" });
      if (!res.ok) return null;
      return await res.json();
    } catch (e) {
      return null;
    }
  }

  async function createDispatchLink(payload) {
    const { res, data } = await fetchJson(API_BASE, {
      method: "POST",
      body: JSON.stringify(payload || {})
    });
    if (!res.ok || !data || !data.ok) {
      throw new Error((data && data.error) || `create_failed_${res.status}`);
    }
    return data;
  }

  async function validateDispatchLink(token) {
    if (!token) {
      return { ok: true, valid: true, noToken: true };
    }

    const ossRecord = await readFromOss(token);
    if (ossRecord) {
      if (ossRecord.status === "used") {
        return { ok: true, valid: false, reason: "used", record: ossRecord };
      }
      return { ok: true, valid: true, record: ossRecord };
    }

    const { res, data } = await fetchJson(`${API_BASE}/${encodeURIComponent(token)}`, { method: "GET" });
    if (res.status === 404) {
      return { ok: false, valid: false, reason: "not_found" };
    }
    if (!res.ok || !data || !data.ok) {
      return { ok: false, valid: false, reason: "check_failed" };
    }
    if (data.status === "used") {
      return { ok: true, valid: false, reason: "used", record: data };
    }
    return { ok: true, valid: true, record: data };
  }

  async function consumeDispatchLink(token, meta) {
    if (!token) return { ok: true, skipped: true };

    const { res, data } = await fetchJson(`${API_BASE}/${encodeURIComponent(token)}/consume`, {
      method: "POST",
      body: JSON.stringify(meta || {})
    });

    if (res.status === 409) {
      return { ok: false, error: "already_used", data };
    }
    if (!res.ok || !data || !data.ok) {
      return { ok: false, error: (data && data.error) || "consume_failed" };
    }
    return { ok: true, data };
  }

  function buildShareUrl(baseUrl, token, refCode) {
    const url = new URL(baseUrl, global.location.origin);
    if (refCode) url.searchParams.set("ref", refCode);
    if (token) url.searchParams.set("dl", token);
    return url.toString();
  }

  function renderBlockedPage(reason, record) {
    const distributor = record && record.distributorName ? record.distributorName : "老师";
    const usedAt = record && record.usedAt ? record.usedAt : "";
    const messages = {
      used: {
        title: "该测评链接已被使用",
        body: `这条专属链接只能填写一次，已于 ${usedAt ? new Date(usedAt).toLocaleString("zh-CN") : "此前"} 完成测评。请联系推荐人 <strong>${distributor}</strong> 重新获取新的测评链接。`
      },
      not_found: {
        title: "链接无效或已过期",
        body: "未找到对应的分发链接，请联系推荐人重新复制最新链接。"
      },
      check_failed: {
        title: "链接校验失败",
        body: "暂时无法验证测评链接，请检查网络后刷新重试，或联系推荐人重新获取链接。"
      }
    };
    const copy = messages[reason] || messages.check_failed;

    global.document.body.innerHTML = `
      <main style="min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px;background:linear-gradient(135deg,#FFFDF6 0%,#FFFBE9 100%);font-family:-apple-system,BlinkMacSystemFont,'PingFang SC',sans-serif;color:#1E1A1C">
        <section style="max-width:460px;width:100%;background:#FFFFFF;border:1.5px solid #FDE68A;border-radius:20px;padding:28px 24px;box-shadow:0 12px 36px rgba(45,48,146,0.06);text-align:center">
          <div style="width:56px;height:56px;border-radius:14px;background:linear-gradient(135deg,#FFE600 0%,#F5C518 100%);display:flex;align-items:center;justify-content:center;margin:0 auto 16px;font-size:24px">🔒</div>
          <h1 style="font-size:22px;font-weight:900;color:#1E2066;margin:0 0 10px">${copy.title}</h1>
          <p style="font-size:14px;line-height:1.7;color:#64748B;margin:0">${copy.body}</p>
          <p style="font-size:12px;color:#94A3B8;margin-top:18px">非凡教育 · 科学测评诊断平台</p>
        </section>
      </main>`;
  }

  async function guardAssessmentPage(options) {
    const token = readTokenFromUrl();
    if (!token) return { allowed: true, token: "" };

    const result = await validateDispatchLink(token);
    if (result.valid) {
      return { allowed: true, token, record: result.record };
    }

    renderBlockedPage(result.reason || "check_failed", result.record);
    return { allowed: false, token, reason: result.reason, record: result.record };
  }

  async function completeAssessment(meta) {
    const token = readTokenFromUrl();
    if (!token) return { ok: true, skipped: true };
    return consumeDispatchLink(token, meta);
  }

  global.FeifanDispatchLink = {
    API_BASE,
    OSS_BASE,
    readTokenFromUrl,
    createDispatchLink,
    validateDispatchLink,
    consumeDispatchLink,
    buildShareUrl,
    guardAssessmentPage,
    completeAssessment,
    renderBlockedPage
  };
})(typeof window !== "undefined" ? window : globalThis);
