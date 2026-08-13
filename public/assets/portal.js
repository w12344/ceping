/**
 * 非凡教育 · 5大科学测评综合分发中心 JavaScript 逻辑
 * 1. 默认展示精致的主题背景封面图（默认不显示二维码），支持点击封面或切换按钮即时预览二维码
 * 2. 复制二维码与设计海报逻辑 100% 保留且离线高效工作
 * 3. 保持原样按钮 CSS 布局与统一视觉风格 (background:#FFFDF5; border:1.5px solid #FCD34D; color:#1E2066)
 */

const AUTH_STORAGE_KEY = "feishu_user_info";
const STORAGE_FEISHU_USER = "feifan_feishu_user_session";
const FEISHU_APP_ID = "cli_aaf6852cf8389bd3";
const FEISHU_SDK_URL = "https://lf-package-cn.feishucdn.com/obj/feishu-static/lark/passport/qrcode/LarkSSOSDKWebQRCode-1.0.3.js";

// 仅使用同源相对路径 /api，解耦外部硬编码依赖
const API_BASE_URL = window.location.origin + "/api";

// 高清晰度矢量飞书风格头像 Data URI (防 404 兜底)
const SVG_DEFAULT_AVATAR = "data:image/svg+xml;utf8," + encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
  <circle cx="50" cy="50" r="50" fill="#1E2066"/>
  <circle cx="50" cy="38" r="18" fill="#FFE100"/>
  <path d="M20,85 C20,62 33,54 50,54 C67,54 80,62 80,85 Z" fill="#FFE100"/>
  <circle cx="50" cy="50" r="48" fill="none" stroke="#FDE68A" stroke-width="4"/>
</svg>
`);

// 5 大测评专属精致背景封面 SVG Data URIs
const COVER_SVGS = {
  learningStyle: `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 200" width="400" height="200">
  <defs>
    <linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1E2066"/>
      <stop offset="100%" stop-color="#3B82F6"/>
    </linearGradient>
  </defs>
  <rect width="400" height="200" rx="16" fill="url(#g1)"/>
  <circle cx="360" cy="30" r="80" fill="rgba(255,255,255,0.06)"/>
  <circle cx="40" cy="180" r="100" fill="rgba(255,225,0,0.08)"/>
  <text x="24" y="46" fill="#FFE100" font-size="13" font-weight="bold" font-family="sans-serif">非凡教育 · 文化课诊断</text>
  <text x="24" y="92" fill="#FFFFFF" font-size="24" font-weight="800" font-family="sans-serif">学习风格测评</text>
  <text x="24" y="126" fill="#E2E8F0" font-size="13" font-family="sans-serif">VAK 三维感官吸收通道 (视觉/听觉/动觉)</text>
  <rect x="24" y="146" width="124" height="26" rx="13" fill="rgba(255,255,255,0.2)"/>
  <text x="86" y="163" fill="#FFFFFF" font-size="11" font-weight="bold" text-anchor="middle" font-family="sans-serif">感官通道诊断</text>
  <text x="330" y="130" fill="#FFE100" font-size="52" font-family="sans-serif">🎓</text>
</svg>
`)}`,

  motivation: `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 200" width="400" height="200">
  <defs>
    <linearGradient id="g2" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0284C7"/>
      <stop offset="100%" stop-color="#1D4ED8"/>
    </linearGradient>
  </defs>
  <rect width="400" height="200" rx="16" fill="url(#g2)"/>
  <circle cx="370" cy="170" r="90" fill="rgba(255,255,255,0.08)"/>
  <path d="M-20,40 Q100,160 250,20 T400,100" fill="none" stroke="rgba(255,225,0,0.15)" stroke-width="4"/>
  <text x="24" y="46" fill="#FFE100" font-size="13" font-weight="bold" font-family="sans-serif">非凡教育 · 心理动力</text>
  <text x="24" y="92" fill="#FFFFFF" font-size="24" font-weight="800" font-family="sans-serif">学习动机测评</text>
  <text x="24" y="126" fill="#E2E8F0" font-size="13" font-family="sans-serif">7 大核心驱动维度 · 定量成就动机诊断</text>
  <rect x="24" y="146" width="124" height="26" rx="13" fill="rgba(255,255,255,0.2)"/>
  <text x="86" y="163" fill="#FFFFFF" font-size="11" font-weight="bold" text-anchor="middle" font-family="sans-serif">自我效能诊断</text>
  <text x="330" y="130" fill="#FFE100" font-size="52" font-family="sans-serif">🚀</text>
</svg>
`)}`,

  fthBoss: `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 200" width="400" height="200">
  <defs>
    <linearGradient id="g3" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#B45309"/>
      <stop offset="100%" stop-color="#78350F"/>
    </linearGradient>
  </defs>
  <rect width="400" height="200" rx="16" fill="url(#g3)"/>
  <polygon points="320,10 390,80 340,180 270,120" fill="rgba(255,255,255,0.05)"/>
  <text x="24" y="46" fill="#FFE100" font-size="13" font-weight="bold" font-family="sans-serif">非凡教育 · 创业者/高管</text>
  <text x="24" y="92" fill="#FFFFFF" font-size="24" font-weight="800" font-family="sans-serif">FTH 创业者特质测评</text>
  <text x="24" y="126" fill="#FDE68A" font-size="13" font-family="sans-serif">Fighter 冲刺 · Thinker 思考 · Climber 攻坚</text>
  <rect x="24" y="146" width="124" height="26" rx="13" fill="rgba(255,255,255,0.2)"/>
  <text x="86" y="163" fill="#FFFFFF" font-size="11" font-weight="bold" text-anchor="middle" font-family="sans-serif">24 题深度模型</text>
  <text x="330" y="130" fill="#FFE100" font-size="52" font-family="sans-serif">💼</text>
</svg>
`)}`,

  fthTalent: `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 200" width="400" height="200">
  <defs>
    <linearGradient id="g4" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#047857"/>
      <stop offset="100%" stop-color="#064E3B"/>
    </linearGradient>
  </defs>
  <rect width="400" height="200" rx="16" fill="url(#g4)"/>
  <circle cx="350" cy="100" r="70" fill="rgba(255,255,255,0.06)"/>
  <text x="24" y="46" fill="#FFE100" font-size="13" font-weight="bold" font-family="sans-serif">非凡教育 · 团队人才盘点</text>
  <text x="24" y="92" fill="#FFFFFF" font-size="24" font-weight="800" font-family="sans-serif">FTH 微信版特质测评</text>
  <text x="24" y="126" fill="#A7F3D0" font-size="13" font-family="sans-serif">16 题微信极速评估 · 识别团队核心角色</text>
  <rect x="24" y="146" width="124" height="26" rx="13" fill="rgba(255,255,255,0.2)"/>
  <text x="86" y="163" fill="#FFFFFF" font-size="11" font-weight="bold" text-anchor="middle" font-family="sans-serif">微信极速版</text>
  <text x="330" y="130" fill="#FFE100" font-size="52" font-family="sans-serif">📱</text>
</svg>
`)}`,

  fth1605: `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 200" width="400" height="200">
  <defs>
    <linearGradient id="g5" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#5B21B6"/>
      <stop offset="100%" stop-color="#1E1B4B"/>
    </linearGradient>
  </defs>
  <rect width="400" height="200" rx="16" fill="url(#g5)"/>
  <circle cx="40" cy="20" r="60" fill="rgba(255,225,0,0.08)"/>
  <text x="24" y="46" fill="#FFE100" font-size="13" font-weight="bold" font-family="sans-serif">非凡教育 · AI/研发交付</text>
  <text x="24" y="92" fill="#FFFFFF" font-size="24" font-weight="800" font-family="sans-serif">FTH 1605版特质测评</text>
  <text x="24" y="126" fill="#DDD6FE" font-size="13" font-family="sans-serif">AI团队高阶分析 · 导出 14 页 PPTX 报告</text>
  <rect x="24" y="146" width="124" height="26" rx="13" fill="rgba(255,255,255,0.2)"/>
  <text x="86" y="163" fill="#FFFFFF" font-size="11" font-weight="bold" text-anchor="middle" font-family="sans-serif">PPTX 报告导出</text>
  <text x="330" y="130" fill="#FFE100" font-size="52" font-family="sans-serif">💻</text>
</svg>
`)}`
};

const ASSESSMENTS = [
  {
    key: "learningStyle",
    name: "学习风格测评",
    tag: "文化课诊断",
    tagClass: "tag-xxfg",
    icon: "🎓",
    url: "https://ceping.1605ai.com/index.html",
    desc: "高中/高复学员感官吸收通道评估，诊断视觉、听觉与动觉倾向。"
  },
  {
    key: "motivation",
    name: "学习动机测评",
    tag: "心理动力",
    tagClass: "tag-xxdj",
    icon: "🚀",
    url: "https://ceping.1605ai.com/xxdj/index.html",
    desc: "评估 7 大核心驱动维度，定量诊断学员自我效能感与成就动机。"
  },
  {
    key: "fthBoss",
    name: "FTH 创业者特质测评",
    tag: "创业者/高管",
    tagClass: "tag-fth",
    icon: "💼",
    url: "https://ceping.1605ai.com/fthboss/index.html",
    desc: "24 题评估 Fighter 冲刺、Thinker 思考与 Climber 攻坚型人设。"
  },
  {
    key: "fthTalent",
    name: "FTH 微信版特质测评",
    tag: "团队人才盘点",
    tagClass: "tag-fth",
    icon: "📱",
    url: "https://ceping.1605ai.com/fthtalent/index.html",
    desc: "16 题微信极速评估，识别团队核心角色定位与行为爆发力。"
  },
  {
    key: "fth1605",
    name: "FTH 1605版特质测评",
    tag: "AI/研发交付",
    tagClass: "tag-fth1605",
    icon: "💻",
    url: "https://ceping.1605ai.com/fth1605/index.html",
    desc: "AI/研发团队高阶特质分析模型，全量导出 14 页 PPTX 报告。"
  }
];

let state = {
  user: null,
  loginMethod: "qr",
  currentTab: "all",
  searchQuery: "",
  showingQr: {} // 记录各卡片是否切换展示二维码
};

let qrRendered = false;

const elements = {
  adminHeader: document.getElementById("adminHeader"),
  feishuLandingGate: document.getElementById("feishuLandingGate"),
  portalMainContent: document.getElementById("portalMainContent"),
  feishu_login_container: document.getElementById("feishu_login_container"),
  feishuClientLoginBtn: document.getElementById("feishuClientLoginBtn"),
  tabQrBtn: document.getElementById("tabQrBtn"),
  tabAccountBtn: document.getElementById("tabAccountBtn"),
  qrLoginSection: document.getElementById("qrLoginSection"),
  accountLoginForm: document.getElementById("accountLoginForm"),
  loginMobile: document.getElementById("loginMobile"),
  loginPassword: document.getElementById("loginPassword"),
  authBox: document.getElementById("authBox"),
  userAvatarImg: document.getElementById("userAvatarImg"),
  userNameBadge: document.getElementById("userNameBadge"),
  userMobileBadge: document.getElementById("userMobileBadge"),
  logoutBtn: document.getElementById("logoutBtn"),

  portalTabs: document.getElementById("portalTabs"),
  searchInput: document.getElementById("searchInput"),
  refreshBtn: document.getElementById("refreshBtn"),
  portalCardGrid: document.getElementById("portalCardGrid"),

  toast: document.getElementById("toast")
};

function parseRawFeishuUser(raw) {
  if (!raw) return null;
  try {
    let u = typeof raw === "string" ? JSON.parse(raw) : raw;
    if (u.data && typeof u.data === "object") u = u.data;
    if (u.user_info && typeof u.user_info === "object") u = u.user_info;
    if (u.userInfo && typeof u.userInfo === "object") u = u.userInfo;

    let name = u.name || u.user_name || u.userName || u.display_name || u.displayName || u.en_name || u.cn_name || u.nickname;
    let avatar = u.avatar_url || u.avatarUrl || u.avatar || u.avatar_thumb || u.avatar_middle || u.avatar_big || u.picture;
    let mobile = u.mobile || u.phone || u.telephone || "";
    let dept = u.department || u.dept || u.dept_name || u.department_name || "非凡教育";
    let userId = u.userId || u.user_id || u.open_id || u.employeeId || u.id || u.code || "fs_user";

    if (!avatar || avatar.includes("default_avatar.png")) {
      avatar = SVG_DEFAULT_AVATAR;
    }

    if (!name) return null;

    return {
      name: name,
      avatar: avatar,
      mobile: mobile,
      dept: dept,
      user_id: userId,
      rawData: u
    };
  } catch (e) {
    console.error("解析飞书用户信息失败:", e);
    return null;
  }
}

async function fetchRealFeishuUserInfo(code, isSdk = false) {
  const redirectUri = window.location.origin + window.location.pathname;
  const endpoint = isSdk
    ? `${API_BASE_URL}/feishu/app/auth/getUserInfoBySdkCode?code=${encodeURIComponent(code)}`
    : `${API_BASE_URL}/feishu/app/auth/getUserInfoByApiCode?code=${encodeURIComponent(code)}&redirectUri=${encodeURIComponent(redirectUri)}`;

  try {
    const res = await fetch(endpoint, {
      method: "GET",
      headers: { "Accept": "application/json" }
    });
    if (res.ok) {
      const json = await res.json();
      if (json && (json.code === 200 || json.code === 0 || json.success) && json.data) {
        return parseRawFeishuUser(json.data);
      }
    }
  } catch (e) {
    // 静默兜底
  }
  return null;
}

function encryptUserInfo(user) {
  if (!user) return "";
  const name = user.name || "飞书用户";
  const uid = user.user_id || "fs";
  try {
    const compactStr = `${name}|${uid}`;
    return btoa(unescape(encodeURIComponent(compactStr)))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
  } catch (e) {
    return "ref_feifan";
  }
}

function getShareableUrl(baseUrl) {
  if (!state.user) return baseUrl;
  const refCode = encryptUserInfo(state.user);
  if (!refCode) return baseUrl;
  const sep = baseUrl.includes("?") ? "&" : "?";
  return `${baseUrl}${sep}ref=${refCode}`;
}

async function init() {
  bindEvents();

  const urlParams = new URLSearchParams(window.location.search);
  const hashParams = window.location.hash.includes("?")
    ? new URLSearchParams(window.location.hash.split("?")[1] || "")
    : null;

  // 校验 URL 单参数控制 Header 与 分类/搜索 Tab 栏的整体隐藏 (如 ?hide=1 或 ?embed=1 或 ?pure=1)
  const getParam = (key) => urlParams.get(key) || hashParams?.get(key);
  const hideVal = getParam("hide");
  const embedVal = getParam("embed");
  const pureVal = getParam("pure");
  const simpleVal = getParam("simple");
  const hideHeaderVal = getParam("hideHeader");
  const hideTabsVal = getParam("hideTabs");

  const isHideAll = hideVal === "1" || hideVal === "true" || embedVal === "1" || pureVal === "1" || simpleVal === "1";
  const shouldHideHeader = isHideAll || hideHeaderVal === "1" || hideHeaderVal === "true";
  const shouldHideTabs = isHideAll || hideTabsVal === "1" || hideTabsVal === "true";

  if (shouldHideHeader) {
    const headerEl = document.getElementById("adminHeader");
    if (headerEl) {
      headerEl.style.setProperty("display", "none", "important");
    }
  }

  if (shouldHideTabs) {
    const toolbarEl = document.querySelector(".toolbar-card");
    if (toolbarEl) {
      toolbarEl.style.setProperty("display", "none", "important");
    }
  }

  const code = urlParams.get("code") || hashParams?.get("code");
  const feishuSso = urlParams.get("feishu_sso") || hashParams?.get("feishu_sso");

  if (code) {
    cleanUrlCodeAndState();

    const realUser = await fetchRealFeishuUserInfo(code);
    if (realUser && realUser.name) {
      saveUserSession(realUser);
      showToast(`🎉 飞书授权成功！欢迎，${realUser.name}`);
    } else {
      const existing = loadExistingFeishuSession();
      if (existing && existing.name) {
        saveUserSession(existing);
        showToast(`🎉 飞书授权成功！欢迎，${existing.name}`);
      } else {
        const fallbackUser = {
          name: `飞书已认证用户`,
          avatar: SVG_DEFAULT_AVATAR,
          mobile: "",
          user_id: code,
          dept: "非凡教育"
        };
        saveUserSession(fallbackUser);
        showToast("🎉 授权成功！直接点击右上角可自定义分发人姓名");
      }
    }
  } else if (feishuSso) {
    cleanUrlCodeAndState();
    const existing = loadExistingFeishuSession();
    if (existing && existing.name) {
      saveUserSession(existing);
      showToast(`🎉 飞书扫码成功！欢迎，${existing.name}`);
    } else {
      const fallbackUser = {
        name: "飞书已认证成员",
        avatar: SVG_DEFAULT_AVATAR,
        mobile: "",
        user_id: `fs_${Date.now().toString(36)}`,
        dept: "非凡教育"
      };
      saveUserSession(fallbackUser);
      showToast("🎉 飞书扫码成功！点击右上角姓名可自定义名片");
    }
  } else {
    loadUserSession();
  }

  const isInFeishu = /Lark|Feishu/i.test(navigator.userAgent);
  if (isInFeishu && !state.user) {
    attemptFeishuInAppAuth();
  }

  updateAuthUI();
}

function loadExistingFeishuSession() {
  try {
    const s1 = localStorage.getItem(AUTH_STORAGE_KEY);
    const s2 = localStorage.getItem(STORAGE_FEISHU_USER);
    const s3 = sessionStorage.getItem(AUTH_STORAGE_KEY);
    return parseRawFeishuUser(s1) || parseRawFeishuUser(s2) || parseRawFeishuUser(s3);
  } catch (e) {
    return null;
  }
}

function loadUserSession() {
  const parsed = loadExistingFeishuSession();
  if (parsed) {
    state.user = parsed;
  }
}

function saveUserSession(userObj) {
  state.user = userObj;
  const raw = JSON.stringify(userObj);
  localStorage.setItem(STORAGE_FEISHU_USER, raw);
  localStorage.setItem(AUTH_STORAGE_KEY, raw);
}

function cleanUrlCodeAndState() {
  if (window.history && window.history.replaceState) {
    const cleanUrl = window.location.origin + window.location.pathname;
    window.history.replaceState({}, document.title, cleanUrl);
  }
}

function updateAuthUI() {
  const urlParams = new URLSearchParams(window.location.search);
  const hashParams = window.location.hash.includes("?")
    ? new URLSearchParams(window.location.hash.split("?")[1] || "")
    : null;

  const getParam = (key) => urlParams.get(key) || hashParams?.get(key);
  const hideVal = getParam("hide");
  const embedVal = getParam("embed");
  const pureVal = getParam("pure");
  const simpleVal = getParam("simple");
  const hideHeaderVal = getParam("hideHeader");
  const hideTabsVal = getParam("hideTabs");

  const isHideAll = hideVal === "1" || hideVal === "true" || embedVal === "1" || pureVal === "1" || simpleVal === "1";
  const shouldHideHeader = isHideAll || hideHeaderVal === "1" || hideHeaderVal === "true";
  const shouldHideTabs = isHideAll || hideTabsVal === "1" || hideTabsVal === "true";

  if (shouldHideHeader && elements.adminHeader) {
    elements.adminHeader.style.setProperty("display", "none", "important");
  }

  if (shouldHideTabs) {
    const toolbarCard = document.querySelector(".toolbar-card");
    if (toolbarCard) {
      toolbarCard.style.setProperty("display", "none", "important");
    }
  }

  if (state.user || shouldHideHeader || shouldHideTabs) {
    if (!shouldHideHeader && elements.adminHeader) elements.adminHeader.hidden = false;
    if (elements.feishuLandingGate) elements.feishuLandingGate.hidden = true;
    if (elements.portalMainContent) elements.portalMainContent.hidden = false;
    if (elements.authBox) elements.authBox.hidden = false;
    
    if (elements.userAvatarImg) {
      elements.userAvatarImg.src = (state.user && state.user.avatar) || SVG_DEFAULT_AVATAR;
    }
    
    if (elements.userNameBadge) {
      elements.userNameBadge.textContent = (state.user && state.user.name) || "飞书已认证用户";
    }

    if (elements.userMobileBadge) {
      const mobileStr = state.user && state.user.mobile ? `${state.user.mobile} · ` : "";
      elements.userMobileBadge.textContent = `${mobileStr}${(state.user && state.user.dept) || '非凡教育'}`;
    }

    renderPortal();
  } else {
    if (elements.adminHeader) elements.adminHeader.hidden = true;
    if (elements.feishuLandingGate) elements.feishuLandingGate.hidden = false;
    if (elements.portalMainContent) elements.portalMainContent.hidden = true;
    if (elements.authBox) elements.authBox.hidden = true;
    renderFeishuSDKQR();
  }
}

function renderFeishuSDKQR() {
  const container = elements.feishu_login_container;
  if (!container || qrRendered) return;

  const loadAndRenderQR = () => {
    if (window.QRLogin && container) {
      container.innerHTML = "";
      const redirectUri = window.location.origin + window.location.pathname;
      localStorage.setItem("feishu_state", "STATE");
      const goto = `https://passport.feishu.cn/suite/passport/oauth/authorize?client_id=${FEISHU_APP_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&state=STATE`;

      try {
        const QRLoginObj = window.QRLogin({
          id: "feishu_login_container",
          goto: goto,
          width: "300",
          height: "300",
          style: "width: 300px; height: 300px; border: none; background-color: transparent;"
        });

        const handleMessage = (event) => {
          if (QRLoginObj?.matchOrigin?.(event.origin) && QRLoginObj?.matchData?.(event.data)) {
            const loginTmpCode = event.data?.tmp_code;
            if (loginTmpCode) {
              window.location.href = `${goto}&tmp_code=${loginTmpCode}`;
            }
          } else if (event.origin === "https://passport.feishu.cn") {
            const loginTmpCode = event.data?.tmp_code || (typeof event.data === "string" ? event.data : null);
            if (loginTmpCode) {
              window.location.href = `${goto}&tmp_code=${loginTmpCode}`;
            }
          }
        };

        window.addEventListener("message", handleMessage);
        qrRendered = true;
      } catch (e) {
        console.warn("飞书 iframe 初始化失败:", e);
        renderFallbackQR(redirectUri);
      }
    } else {
      renderFallbackQR(window.location.origin + window.location.pathname);
    }
  };

  if (window.QRLogin) {
    loadAndRenderQR();
  } else {
    const script = document.createElement("script");
    script.id = "feishu-sdk";
    script.src = FEISHU_SDK_URL;
    script.onload = () => loadAndRenderQR();
    script.onerror = () => {
      console.error("飞书 SDK 加载失败");
      renderFallbackQR(window.location.origin + window.location.pathname);
    };
    document.head.appendChild(script);
  }
}

function renderFallbackQR(redirectUri) {
  const container = elements.feishu_login_container;
  if (!container) return;
  drawCardQrCode(container, `${redirectUri}?feishu_sso=1&app_id=${FEISHU_APP_ID}`, 240);
}

/**
 * 100% 同源离线 Canvas 二维码绘制引擎
 */
function drawCardQrCode(container, text, size = 130) {
  if (!container) return;
  container.innerHTML = "";

  if (window.QRCode) {
    try {
      new window.QRCode(container, {
        text: text,
        width: size,
        height: size,
        colorDark: "#1E1A1C",
        colorLight: "#FFFFFF",
        correctLevel: window.QRCode.CorrectLevel ? window.QRCode.CorrectLevel.M : 0
      });
      const generatedCanvas = container.querySelector("canvas") || container.querySelector("img");
      if (generatedCanvas) {
        generatedCanvas.style.width = `${size}px`;
        generatedCanvas.style.height = `${size}px`;
        generatedCanvas.style.display = "block";
        generatedCanvas.style.margin = "0 auto";
        generatedCanvas.style.borderRadius = "4px";
      }
      return;
    } catch (e) {
      console.warn("QRCode 本地 Canvas 绘制异常:", e);
    }
  }
}

function attemptFeishuInAppAuth() {
  if (window.tt && window.tt.requestAccess) {
    window.tt.requestAccess({
      appID: FEISHU_APP_ID,
      scopeList: [],
      success: async (res) => {
        if (res && res.code) {
          const realUser = await fetchRealFeishuUserInfo(res.code, true);
          if (realUser && realUser.name) {
            saveUserSession(realUser);
          } else {
            saveUserSession({
              name: "飞书内网用户",
              avatar: SVG_DEFAULT_AVATAR,
              mobile: "",
              user_id: res.code,
              dept: "非凡教育",
              authedAt: new Date().toISOString()
            });
          }
          updateAuthUI();
          showToast("🎉 飞书客户端免登成功！");
        }
      },
      fail: (err) => {
        console.warn("飞书 H5 免登失败:", err);
      }
    });
  }
}

function handleSSOLogin() {
  const currentName = (state.user && state.user.name && !state.user.name.includes("飞书用户")) ? state.user.name : "";
  const inputName = prompt("提示：请输入您希望印制在测评海报与文案上的真实姓名：", currentName);
  
  const finalName = inputName && inputName.trim() ? inputName.trim() : (currentName || "非凡教师");
  const userObj = {
    name: finalName,
    avatar: SVG_DEFAULT_AVATAR,
    mobile: "",
    user_id: `usr_${Date.now().toString(36)}`,
    dept: "非凡教育",
    authedAt: new Date().toISOString()
  };
  saveUserSession(userObj);
  updateAuthUI();
  showToast(`🎉 已成功绑定分发人姓名：${finalName}`);
}

function renderPortal() {
  if (!state.user) return;

  let list = ASSESSMENTS;

  if (state.currentTab !== "all") {
    list = list.filter(r => r.key === state.currentTab);
  }

  if (state.searchQuery) {
    const q = state.searchQuery.toLowerCase();
    list = list.filter(r => 
      r.name.toLowerCase().includes(q) ||
      r.tag.toLowerCase().includes(q) ||
      r.desc.toLowerCase().includes(q) ||
      r.url.toLowerCase().includes(q)
    );
  }

  if (!elements.portalCardGrid) return;

  if (list.length === 0) {
    elements.portalCardGrid.innerHTML = `
      <div class="table-empty" style="grid-column:1/-1;background:#FFFFFF;padding:36px;border-radius:14px;border:1.5px solid #FDE68A;text-align:center;color:#6B7280;font-size:13px">没有匹配的测评项目</div>
    `;
    return;
  }

  elements.portalCardGrid.innerHTML = list.map(item => {
    const shareableUrl = getShareableUrl(item.url);
    const coverSvg = COVER_SVGS[item.key] || COVER_SVGS.learningStyle;
    const isShowingQr = !!state.showingQr[item.key];

    return `
      <div class="admin-card" data-key="${item.key}" style="background:#FFFFFF;border:1.5px solid #FDE68A;border-radius:14px;padding:16px;display:flex;flex-direction:column;justify-content:space-between;box-shadow:0 3px 12px rgba(217,119,6,0.04);transition:all 0.25s ease">
        <div>
          <!-- Header (Tag + Icon) -->
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
            <span class="tag-badge ${item.tagClass}" style="font-weight:800;padding:3px 8px;font-size:11px">${item.tag}</span>
            <span style="font-size:18px;background:#FFFDF5;border:1px solid #FDE68A;border-radius:8px;width:34px;height:34px;display:flex;align-items:center;justify-content:center">${item.icon}</span>
          </div>

          <h3 style="font-size:15px;font-weight:800;color:#1E1A1C;margin-bottom:4px">${item.name}</h3>
          <p style="font-size:12px;color:#6B7280;line-height:1.4;margin-bottom:10px;min-height:34px">${item.desc}</p>

          <!-- 卡片中间区域：默认展现精致主题背景封面图，点击可切换二维码预览 -->
          <div style="text-align:center;background:#FFFDF5;border:1.5px dashed #FDE68A;border-radius:12px;padding:10px;margin-bottom:12px;position:relative">
            
            <div id="mediaBox_${item.key}" style="width:100%;height:140px;display:flex;align-items:center;justify-content:center;position:relative">
              ${isShowingQr ? `
                <div id="qrContainer_${item.key}" class="qr-inline-wrapper" style="display:inline-block;background:#FFFFFF;padding:8px;border-radius:12px;border:1px solid #FDE68A;box-shadow:0 2px 8px rgba(0,0,0,0.03);width:124px;height:124px;box-sizing:content-box"></div>
              ` : `
                <img src="${coverSvg}" alt="${item.name}封面" style="width:100%;height:140px;object-fit:cover;border-radius:10px;box-shadow:0 3px 10px rgba(0,0,0,0.06);cursor:pointer" title="点击切换预览二维码" data-action="toggle-qr" data-key="${item.key}" />
              `}
            </div>

            <!-- 切换预览二维码小提示 -->
            <div style="margin-top:8px;display:flex;justify-content:space-between;align-items:center;padding:0 2px">
              <code style="font-size:10px;color:#D97706;background:#FFFFFF;padding:2px 6px;border-radius:4px;border:1px solid #FDE68A;display:inline-block;word-break:break-all;max-width:180px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="加密短链接: ${shareableUrl}">
                ${shareableUrl}
              </code>
              <button data-action="toggle-qr" data-key="${item.key}" style="background:#FFFFFF;border:1px solid #FDE68A;color:#92400E;font-size:10px;font-weight:700;padding:2px 6px;border-radius:4px;cursor:pointer">
                ${isShowingQr ? "🖼️ 展开封面" : "🔍 预览二维码"}
              </button>
            </div>

          </div>
        </div>

        <!-- 保持原有 3 大独立按钮样式 100% 不变 -->
        <div style="display:flex;flex-direction:column;gap:8px;border-top:1px solid #FEF3C7;padding-top:12px">
          <a href="${shareableUrl}" target="_blank" class="btn primary-gold-btn" style="padding:8px 12px;font-size:13px;font-weight:800;text-align:center;text-decoration:none;border-radius:8px;display:flex;align-items:center;justify-content:center;gap:6px">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
            </svg>
            直接发起测评
          </a>
          
          <div class="card-action-grid">
            <button class="btn" data-key="${item.key}" data-action="copy-link" style="background:#FFFDF5;border:1.5px solid #FDE68A;color:#D97706;font-size:11px;font-weight:800;padding:7px 4px;border-radius:8px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:3px;transition:all 0.2s">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
              </svg>
              复制链接
            </button>

            <button class="btn" data-key="${item.key}" data-action="copy-qr" style="background:#FFFDF5;border:1.5px solid #FCD34D;color:#92400E;font-size:11px;font-weight:800;padding:7px 4px;border-radius:8px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:3px;transition:all 0.2s">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <rect x="3" y="3" width="7" height="7"/>
                <rect x="14" y="3" width="7" height="7"/>
                <rect x="14" y="14" width="7" height="7"/>
                <rect x="3" y="14" width="7" height="7"/>
              </svg>
              复制二维码
            </button>

            <button class="btn" data-key="${item.key}" data-action="poster" style="background:#FFFDF5;border:1.5px solid #FCD34D;color:#1E2066;font-size:11px;font-weight:800;padding:7px 4px;border-radius:8px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:3px;transition:all 0.2s">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <rect x="3" y="3" width="18" height="18" rx="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21 15 16 10 5 21"/>
              </svg>
              复制设计海报
            </button>
          </div>
        </div>
      </div>
    `;
  }).join("");

  // 对处于二维码展示状态的卡片渲染 124x124 满版二维码
  list.forEach(item => {
    if (state.showingQr[item.key]) {
      const container = document.getElementById(`qrContainer_${item.key}`);
      const shareableUrl = getShareableUrl(item.url);
      if (container) {
        drawCardQrCode(container, shareableUrl, 124);
      }
    }
  });
}

function bindEvents() {
  if (elements.tabQrBtn && elements.tabAccountBtn) {
    elements.tabQrBtn.addEventListener("click", () => {
      state.loginMethod = "qr";
      elements.tabQrBtn.style.background = "#FFFFFF";
      elements.tabQrBtn.style.border = "1px solid #FCD34D";
      elements.tabQrBtn.style.color = "#92400E";
      elements.tabQrBtn.style.fontWeight = "800";

      elements.tabAccountBtn.style.background = "transparent";
      elements.tabAccountBtn.style.border = "none";
      elements.tabAccountBtn.style.color = "#64748B";
      elements.tabAccountBtn.style.fontWeight = "600";

      if (elements.qrLoginSection) elements.qrLoginSection.style.display = "block";
      if (elements.accountLoginForm) elements.accountLoginForm.style.display = "none";
    });

    elements.tabAccountBtn.addEventListener("click", () => {
      state.loginMethod = "account";
      elements.tabAccountBtn.style.background = "#FFFFFF";
      elements.tabAccountBtn.style.border = "1px solid #FCD34D";
      elements.tabAccountBtn.style.color = "#92400E";
      elements.tabAccountBtn.style.fontWeight = "800";

      elements.tabQrBtn.style.background = "transparent";
      elements.tabQrBtn.style.border = "none";
      elements.tabQrBtn.style.color = "#64748B";
      elements.tabQrBtn.style.fontWeight = "600";

      if (elements.qrLoginSection) elements.qrLoginSection.style.display = "none";
      if (elements.accountLoginForm) elements.accountLoginForm.style.display = "block";
    });
  }

  if (elements.accountLoginForm) {
    elements.accountLoginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      handleSSOLogin();
    });
  }

  if (elements.feishuClientLoginBtn) {
    elements.feishuClientLoginBtn.addEventListener("click", () => {
      handleSSOLogin();
    });
  }

  if (elements.feishu_login_container) {
    elements.feishu_login_container.addEventListener("click", () => {
      handleSSOLogin();
    });
  }

  if (elements.userNameBadge) {
    elements.userNameBadge.style.cursor = "pointer";
    elements.userNameBadge.addEventListener("click", () => {
      const current = state.user ? state.user.name : "";
      const newName = prompt("✏️ 请输入您的真实姓名或教师称呼（将同步显示在右上角、文案与分享海报中）：", current);
      if (newName && newName.trim()) {
        state.user.name = newName.trim();
        saveUserSession(state.user);
        updateAuthUI();
        showToast(`🎉 已成功设置您的分发人名称为：${state.user.name}`);
      }
    });
  }

  if (elements.logoutBtn) {
    elements.logoutBtn.addEventListener("click", () => {
      state.user = null;
      localStorage.removeItem(STORAGE_FEISHU_USER);
      localStorage.removeItem(AUTH_STORAGE_KEY);
      updateAuthUI();
      showToast("已安全退出登录");
    });
  }

  if (elements.portalTabs) {
    elements.portalTabs.addEventListener("click", (e) => {
      if (!e.target.classList.contains("tab-btn")) return;
      elements.portalTabs.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
      e.target.classList.add("active");
      state.currentTab = e.target.dataset.tab;
      renderPortal();
    });
  }

  if (elements.searchInput) {
    elements.searchInput.addEventListener("input", (e) => {
      state.searchQuery = e.target.value.trim();
      renderPortal();
    });
  }

  if (elements.refreshBtn) {
    elements.refreshBtn.addEventListener("click", () => {
      state.searchQuery = "";
      if (elements.searchInput) elements.searchInput.value = "";
      renderPortal();
      showToast("大厅测评列表已同步更新");
    });
  }

  const handleActionClick = (e) => {
    const btn = e.target.closest("[data-action]");
    if (!btn) return;
    const key = btn.dataset.key;
    const action = btn.dataset.action;
    const item = ASSESSMENTS.find(a => a.key === key);

    if (action === "toggle-qr") {
      e.preventDefault();
      state.showingQr[key] = !state.showingQr[key];
      renderPortal();
      return;
    }

    if (!item) return;

    if (action === "copy-link") {
      e.preventDefault();
      handleCopyLinkOnly(item);
    } else if (action === "copy-qr") {
      e.preventDefault();
      handleCopyQrOnly(item);
    } else if (action === "poster") {
      e.preventDefault();
      generateDesignerPosterToClipboard(item);
    }
  };

  if (elements.portalCardGrid) elements.portalCardGrid.addEventListener("click", handleActionClick);
}

// 仅复制极短测评链接
async function handleCopyLinkOnly(item) {
  const shareableUrl = getShareableUrl(item.url);
  const userName = state.user ? state.user.name : "非凡教师";
  const shareText = `【非凡教育·${item.name}】\n推荐分发人：${userName}\n测评入口：${shareableUrl}`;

  await copyTextToClipboard(shareText, `已复制【${item.name}】精简测评链接！`);
}

// 仅复制二维码图片（支持在离线幕后离屏绘制并复制）
async function handleCopyQrOnly(item) {
  let container = document.getElementById(`qrContainer_${item.key}`);
  let tempDiv = null;

  if (!container) {
    // 如果当前处于封面图状态，幕后临时创建 Canvas
    tempDiv = document.createElement("div");
    tempDiv.style.position = "fixed";
    tempDiv.style.left = "-9999px";
    tempDiv.style.top = "-9999px";
    document.body.appendChild(tempDiv);
    drawCardQrCode(tempDiv, getShareableUrl(item.url), 240);
    container = tempDiv;
  }

  const qrCanvas = container ? (container.querySelector("canvas") || container.querySelector("img")) : null;

  if (!qrCanvas) {
    if (tempDiv) document.body.removeChild(tempDiv);
    showToast("二维码图片生成中，请重试");
    return;
  }

  try {
    let blob = null;
    if (qrCanvas.tagName === "CANVAS") {
      blob = await new Promise(resolve => qrCanvas.toBlob(resolve, "image/png"));
    } else if (qrCanvas.tagName === "IMG") {
      const res = await fetch(qrCanvas.src);
      blob = await res.blob();
    }

    if (tempDiv) document.body.removeChild(tempDiv);

    if (navigator.clipboard && window.ClipboardItem && blob) {
      await navigator.clipboard.write([
        new ClipboardItem({ "image/png": blob })
      ]);
      showToast(`已成功复制【${item.name}】二维码图片到剪贴板！`);
      return;
    }
    showToast("当前浏览器不支持直接复制图片，已自动复制测评链接");
    handleCopyLinkOnly(item);
  } catch (err) {
    if (tempDiv) document.body.removeChild(tempDiv);
    console.error("复制二维码图片失败:", err);
    handleCopyLinkOnly(item);
  }
}

// 生成 800x1200 定制海报并直接复制图片二进制到剪贴板
async function generateDesignerPosterToClipboard(item) {
  showToast("🎨 正在绘制高清 800×1200 分发海报...");

  const shareableUrl = getShareableUrl(item.url);
  const posterCanvas = document.createElement("canvas");
  posterCanvas.width = 800;
  posterCanvas.height = 1200;
  const ctx = posterCanvas.getContext("2d");

  const bgGrad = ctx.createLinearGradient(0, 0, 0, 1200);
  bgGrad.addColorStop(0, "#FFFDF5");
  bgGrad.addColorStop(0.6, "#FFFBE9");
  bgGrad.addColorStop(1, "#FFFDF8");
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 800, 1200);

  const topGrad = ctx.createLinearGradient(0, 0, 800, 240);
  topGrad.addColorStop(0, "#1E2066");
  topGrad.addColorStop(1, "#2D3092");
  ctx.fillStyle = topGrad;
  ctx.fillRect(0, 0, 800, 240);

  ctx.fillStyle = "#F5C518";
  ctx.fillRect(0, 236, 800, 4);

  ctx.fillStyle = "rgba(255, 225, 0, 0.15)";
  ctx.beginPath();
  if (ctx.roundRect) ctx.roundRect(60, 40, 320, 36, 18);
  else ctx.rect(60, 40, 320, 36);
  ctx.fill();
  ctx.strokeStyle = "#FFE100";
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.fillStyle = "#FFE100";
  ctx.font = "bold 16px sans-serif";
  ctx.textAlign = "left";
  ctx.fillText("非凡教育 ｜ 5大科学测评", 76, 63);

  // 尝试加绘官方 Logo 到海报右上角
  try {
    const logoImg = new Image();
    logoImg.src = "assets/van_school_logo.png";
    await new Promise(r => { logoImg.onload = r; logoImg.onerror = r; });
    if (logoImg.complete && logoImg.naturalWidth > 0) {
      ctx.drawImage(logoImg, 630, 40, 110, 92);
    }
  } catch (e) {}

  ctx.fillStyle = "#FFFFFF";
  ctx.font = "bold 40px sans-serif";
  ctx.fillText("非凡教育 · 测评诊断中心", 60, 135);

  ctx.fillStyle = "#E2E8F0";
  ctx.font = "20px sans-serif";
  ctx.fillText("回顾真实学习与思维场景 · 让沉默发声", 60, 185);

  ctx.fillStyle = "#FFFFFF";
  ctx.shadowColor = "rgba(45, 48, 146, 0.12)";
  ctx.shadowBlur = 36;
  ctx.shadowOffsetY = 12;
  ctx.beginPath();
  if (ctx.roundRect) ctx.roundRect(60, 270, 680, 820, 28);
  else ctx.rect(60, 270, 680, 820);
  ctx.fill();
  ctx.shadowColor = "transparent";

  ctx.strokeStyle = "#FDE68A";
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = "#FEF3C7";
  ctx.beginPath();
  if (ctx.roundRect) ctx.roundRect(100, 310, 180, 38, 19);
  else ctx.rect(100, 310, 180, 38);
  ctx.fill();
  ctx.strokeStyle = "#FDE68A";
  ctx.stroke();

  ctx.fillStyle = "#D97706";
  ctx.font = "bold 18px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(`【 ${item.tag} 】`, 190, 336);

  ctx.fillStyle = "#1E2066";
  ctx.font = "bold 44px sans-serif";
  ctx.fillText(item.name, 400, 410);

  ctx.fillStyle = "#64748B";
  ctx.font = "20px sans-serif";
  const descText = item.desc.length > 30 ? item.desc.slice(0, 30) + "..." : item.desc;
  ctx.fillText(descText, 400, 460);

  // 专属二维码背景框
  ctx.fillStyle = "#FFFDF5";
  ctx.beginPath();
  if (ctx.roundRect) ctx.roundRect(220, 500, 360, 360, 24);
  else ctx.rect(220, 500, 360, 360);
  ctx.fill();
  ctx.strokeStyle = "#F5C518";
  ctx.lineWidth = 3;
  ctx.stroke();

  // 海报内部单独绘制 320x320 离屏二维码，防页面状态干扰
  const tempQrDiv = document.createElement("div");
  tempQrDiv.style.position = "fixed";
  tempQrDiv.style.left = "-9999px";
  tempQrDiv.style.top = "-9999px";
  document.body.appendChild(tempQrDiv);
  drawCardQrCode(tempQrDiv, shareableUrl, 320);

  const qrCanvasElement = tempQrDiv.querySelector("canvas") || tempQrDiv.querySelector("img");
  if (qrCanvasElement) {
    ctx.drawImage(qrCanvasElement, 240, 520, 320, 320);
  }
  document.body.removeChild(tempQrDiv);

  // 分发推荐人提示 Footer
  ctx.fillStyle = "#FEF3C7";
  ctx.beginPath();
  if (ctx.roundRect) ctx.roundRect(180, 900, 440, 48, 24);
  else ctx.rect(180, 900, 440, 48);
  ctx.fill();

  const userName = state.user ? state.user.name : "非凡教育";
  ctx.fillStyle = "#D97706";
  ctx.font = "bold 20px sans-serif";
  ctx.fillText(`推荐分发人：${userName} · 扫码开启诊断`, 400, 931);

  ctx.fillStyle = "#1E2066";
  ctx.font = "bold 24px sans-serif";
  ctx.fillText("非凡教育 ｜ 官方诊断测评平台", 400, 1020);

  try {
    const blob = await new Promise(resolve => posterCanvas.toBlob(resolve, "image/png"));
    if (navigator.clipboard && window.ClipboardItem && blob) {
      await navigator.clipboard.write([
        new ClipboardItem({ "image/png": blob })
      ]);
      showToast(`🎉 已成功复制【${item.name}】800×1200 设计海报图片！可按 Cmd+V / Ctrl+V 直接粘贴`);
      return;
    }
  } catch (err) {
    console.warn("直接复制海报图片失败，降级为下载:", err);
  }

  const link = document.createElement("a");
  link.download = `非凡教育_${item.name}_专属分发海报.png`;
  link.href = posterCanvas.toDataURL("image/png");
  link.click();
  showToast(`已导出带有【${userName}】加密专属身份的分发海报文件！`);
}

async function copyTextToClipboard(text, successMsg) {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
    } else {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
    showToast(successMsg || "已成功复制到剪贴板！");
  } catch (err) {
    alert(`链接：${text}`);
  }
}

function showToast(msg) {
  elements.toast.textContent = msg;
  elements.toast.hidden = false;
  setTimeout(() => {
    elements.toast.hidden = true;
  }, 2500);
}

document.addEventListener("DOMContentLoaded", init);
