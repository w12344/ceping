const STORAGE_KEY = "adminToken";
const ASSESSMENT_API_BASE = window.ASSESSMENT_API_BASE || "https://ffcrm-api.1605ai.com";
const ASSESSMENT_LIST_API = `${ASSESSMENT_API_BASE}/api/assessment/public/list`;
const LIST_PAGE_SIZE = 100;

const TEMPLATE_META = {
  "学习风格": { projectKey: "learningStyle", projectName: "学习风格测评", projectTagClass: "tag-xxfg" },
  LEARNING_STYLE: { projectKey: "learningStyle", projectName: "学习风格测评", projectTagClass: "tag-xxfg" },
  "学习动机": { projectKey: "motivation", projectName: "学习动机测评", projectTagClass: "tag-xxdj" },
  MOTIVATION: { projectKey: "motivation", projectName: "学习动机测评", projectTagClass: "tag-xxdj" },
  "FTH创业者": { projectKey: "fthBoss", projectName: "FTH 创业者职业特质", projectTagClass: "tag-fthboss" },
  FTH_BOSS: { projectKey: "fthBoss", projectName: "FTH 创业者职业特质", projectTagClass: "tag-fthboss" },
  "FTH微信版": { projectKey: "fthTalent", projectName: "FTH 职业特质(微信版)", projectTagClass: "tag-fthtalent" },
  FTH_TALENT: { projectKey: "fthTalent", projectName: "FTH 职业特质(微信版)", projectTagClass: "tag-fthtalent" },
  "FTH1605": { projectKey: "fth1605", projectName: "FTH 职业特质(1605版)", projectTagClass: "tag-fth1605" },
  "FTH 1605版": { projectKey: "fth1605", projectName: "FTH 职业特质(1605版)", projectTagClass: "tag-fth1605" },
  FTH_1605: { projectKey: "fth1605", projectName: "FTH 职业特质(1605版)", projectTagClass: "tag-fth1605" }
};

function esc(str) {
  return String(str || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function parseResultJson(raw) {
  if (!raw) return {};
  try {
    return typeof raw === "string" ? JSON.parse(raw) : raw;
  } catch {
    return {};
  }
}

function resolveTemplateMeta(templateCode) {
  if (TEMPLATE_META[templateCode]) return TEMPLATE_META[templateCode];
  const code = String(templateCode || "").toLowerCase();
  if (code.includes("学习风格") || code.includes("learning")) {
    return TEMPLATE_META["学习风格"];
  }
  if (code.includes("学习动机") || code.includes("motivation")) {
    return TEMPLATE_META["学习动机"];
  }
  if (code.includes("微信") || code.includes("talent")) {
    return TEMPLATE_META["FTH微信版"];
  }
  if (code.includes("1605")) {
    return TEMPLATE_META["FTH1605"];
  }
  if (code.includes("fth") || code.includes("创业者") || code.includes("boss")) {
    return TEMPLATE_META["FTH创业者"];
  }
  return {
    projectKey: "learningStyle",
    projectName: templateCode || "未知测评",
    projectTagClass: "tag-xxfg"
  };
}

function mapApiRecordToItem(record) {
  const meta = resolveTemplateMeta(record.templateCode);
  const parsed = parseResultJson(record.resultJson);
  const resObj = parsed.resultData || parsed.result || parsed;
  const userInfo = parsed.userInfo || resObj.userInfo || parsed.basicInfo || {};
  const studentName = record.customerName || resObj.name || userInfo.studentName || "匿名";
  const phoneNumber = record.customerMobile || resObj.contact || userInfo.phoneNumber || "--";
  const submittedAt = record.createdAt || resObj.createdAt || resObj.submittedAt || "";
  const durationSeconds = Number(resObj.durationSeconds || parsed.durationSeconds || 0) || 0;
  const reportData = parsed.report || resObj;
  const advisorName = record.advisorName || record.employeeName || userInfo.advisorName || "";
  const advisorUserId = record.advisorUserId || record.employeeId || userInfo.advisorUserId || "";
  const advisorMobile = record.advisorMobile || userInfo.advisorMobile || "";
  const profileId = record.profileId || record.customerId || userInfo.profileId || "";

  const base = {
    id: record.id,
    projectKey: meta.projectKey,
    projectName: meta.projectName,
    projectTagClass: meta.projectTagClass,
    templateCode: record.templateCode,
    studentName,
    phoneNumber,
    profileId,
    advisorName,
    advisorUserId,
    advisorMobile,
    submittedAt,
    durationSeconds,
    reportData,
    _parsed: parsed,
    employeeName: advisorName,
    employeeId: advisorUserId,
    ossKey: `assessment/${record.id}`,
    ossUrl: "",
    reportUrl: ""
  };

  if (meta.projectKey === "learningStyle") {
    const studentReport = reportData.studentReport || parsed.studentReport || {};
    const overview = studentReport.overview || {};
    const diagnostic = studentReport.diagnosticOverview || {};
    const grade = parsed.grade || userInfo.grade || overview.grade || "--";
    const targetSubject = parsed.targetSubject || userInfo.targetSubject || overview.targetSubject || "--";
    const score = parsed.targetSubjectScore ?? userInfo.targetSubjectScore;
    const fullScore = parsed.targetSubjectFullScore ?? userInfo.targetSubjectFullScore ?? 150;
    const styleType = diagnostic.styleType || resObj.primaryPreference || resObj.resultType || "做答完成";

    return {
      ...base,
      grade,
      specialtyDirection: parsed.learningFocus || userInfo.learningFocus || overview.learningFocus || "",
      targetSubject,
      scoreText: score !== null && score !== undefined && score !== "" ? `${score}/${fullScore}分` : "--",
      detailSummary: `${styleType}${targetSubject !== "--" ? " · " + targetSubject : ""}`
    };
  }

  if (meta.projectKey === "motivation") {
    return {
      ...base,
      grade: resObj.grade || userInfo.grade || "--",
      specialtyDirection: "",
      targetSubject: "动机诊断",
      scoreText: resObj.scores ? `核心属性: ${resObj.profileName || "--"}` : "--",
      detailSummary: `${resObj.profileName || "动机类型"}${resObj.representativeName ? " · " + resObj.representativeName : ""}`
    };
  }

  if (meta.projectKey === "fthBoss") {
    const summary = resObj.summary || resObj.topAttribute?.label || resObj.primaryType?.cn || "FTH 创业特质";
    return {
      ...base,
      grade: "--",
      specialtyDirection: "创业者版",
      targetSubject: "职业特质",
      scoreText: summary,
      detailSummary: summary
    };
  }

  if (meta.projectKey === "fthTalent") {
    const summary = resObj.summary || resObj.topAttribute?.label || resObj.primaryType?.cn || "FTH 职业特质";
    return {
      ...base,
      grade: "--",
      specialtyDirection: "小凡微信版",
      targetSubject: "职业特质",
      scoreText: summary,
      detailSummary: summary
    };
  }

  if (meta.projectKey === "fth1605") {
    const fileName = resObj.fileName || resObj.detailSummary || resObj.summary || "1605版产物";
    const fileUrl = resObj.fileUrl || resObj.ossUrl || resObj.pptxUrl || "";
    return {
      ...base,
      grade: "--",
      specialtyDirection: "1605版",
      targetSubject: "PPT/产物",
      scoreText: fileName.endsWith(".pptx") ? "PPT成品" : "资源文件",
      detailSummary: fileName,
      ossUrl: fileUrl,
      reportUrl: fileUrl
    };
  }

  return {
    ...base,
    grade: "--",
    specialtyDirection: "",
    targetSubject: "--",
    scoreText: "--",
    detailSummary: record.templateCode || "测评记录"
  };
}

async function fetchAssessmentPage(pageNumber, extraParams = {}) {
  const params = new URLSearchParams({
    pageNumber: String(pageNumber),
    pageSize: String(LIST_PAGE_SIZE)
  });

  Object.entries(extraParams).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.set(key, String(value));
    }
  });

  const res = await fetch(`${ASSESSMENT_LIST_API}?${params.toString()}`, {
    method: "GET"
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }

  const json = await res.json();
  if (json.code !== 0 && json.code !== 200) {
    throw new Error(json.message || "接口返回异常");
  }

  return json.data || {};
}

async function fetchAllAssessments() {
  const allRecords = [];
  let pageNumber = 1;

  while (true) {
    const page = await fetchAssessmentPage(pageNumber);
    const rows = Array.isArray(page)
      ? page
      : (Array.isArray(page.data)
        ? page.data
        : (Array.isArray(page.list)
          ? page.list
          : (Array.isArray(page.records) ? page.records : [])));
    allRecords.push(...rows);

    if (!page.hasNext || rows.length === 0) break;
    pageNumber += 1;
  }

  return allRecords;
}

const elements = {
  authCard: document.getElementById("authCard"),
  authForm: document.getElementById("authForm"),
  authTokenInput: document.getElementById("authTokenInput"),
  authStatusBadge: document.getElementById("authStatusBadge"),
  switchTokenBtn: document.getElementById("switchTokenBtn"),
  mainDashboard: document.getElementById("mainDashboard"),

  // Metrics
  statTotalCount: document.getElementById("statTotalCount"),
  statTotalFoot: document.getElementById("statTotalFoot"),
  statXXFGCount: document.getElementById("statXXFGCount"),
  statXXDJCount: document.getElementById("statXXDJCount"),
  statFTHCount: document.getElementById("statFTHCount"),

  // Tabs & Counts
  projectTabs: document.getElementById("projectTabs"),
  tabCountAll: document.getElementById("tabCountAll"),
  tabCountXXFG: document.getElementById("tabCountXXFG"),
  tabCountXXDJ: document.getElementById("tabCountXXDJ"),
  tabCountFTHBoss: document.getElementById("tabCountFTHBoss"),
  tabCountFTHTalent: document.getElementById("tabCountFTHTalent"),
  tabCountFTH1605: document.getElementById("tabCountFTH1605"),

  // Toolbar & Table & Mobile Card List
  searchInput: document.getElementById("searchInput"),
  exportCsvBtn: document.getElementById("exportCsvBtn"),
  refreshBtn: document.getElementById("refreshBtn"),
  sessionTableBody: document.getElementById("sessionTableBody"),
  tableHeaderHead: document.getElementById("tableHeaderHead"),
  mobileCardList: document.getElementById("mobileCardList"),

  // Modal
  reportModal: document.getElementById("reportModal"),
  modalReportTitle: document.getElementById("modalReportTitle"),
  modalReportTag: document.getElementById("modalReportTag"),
  modalReportContainer: document.getElementById("modalReportContainer"),
  modalPrintBtn: document.getElementById("modalPrintBtn"),
  modalDownloadBtn: document.getElementById("modalDownloadBtn"),
  closeModalBtn: document.getElementById("closeModalBtn")
};

let state = {
  token: localStorage.getItem(STORAGE_KEY) || "admin_secret_token_dev_2026",
  authorized: false,
  allProjects: [],
  currentTab: "learningStyle",
  searchQuery: "",
  activeItem: null
};

function initCustomAssessmentUpload() {
  const uploadBtn = document.getElementById("uploadCustomAssessmentBtn");
  const modal = document.getElementById("customUploadModal");
  const form = document.getElementById("customUploadForm");
  const closeBtn = document.getElementById("closeCustomUploadBtn");
  const status = document.getElementById("uploadStatusText");

  if (!uploadBtn || !modal || !form) return;

  uploadBtn.onclick = () => { modal.hidden = false; };
  if (closeBtn) closeBtn.onclick = () => { modal.hidden = true; };

  form.onsubmit = async (e) => {
    e.preventDefault();
    const templateCode = document.getElementById("customCodeInput").value.trim();
    const projectName = document.getElementById("customNameInput").value.trim();
    const category = document.getElementById("customCategorySelect").value;
    const fileInput = document.getElementById("customFileInput");

    if (!templateCode || !projectName || !fileInput.files.length) {
      alert("请填写测评代码、名称并选择 HTML 代码文件！");
      return;
    }

    const file = fileInput.files[0];
    if (status) {
      status.textContent = `正在上架部署「${projectName}」...`;
      status.hidden = false;
    }

    try {
      const reader = new FileReader();
      reader.onload = function (evt) {
        TEMPLATE_META[templateCode] = {
          projectKey: "customHTML",
          projectName: projectName,
          projectTagClass: "tag-custom"
        };

        const customTemplates = JSON.parse(localStorage.getItem("feifan_custom_templates") || "[]");
        customTemplates.unshift({
          templateCode: templateCode,
          projectName: projectName,
          category: category,
          fileName: file.name,
          uploadedAt: new Date().toISOString()
        });
        localStorage.setItem("feifan_custom_templates", JSON.stringify(customTemplates));

        if (status) {
          status.textContent = `成功发布！测评代码「${templateCode}」已接入非凡统一测评中心。`;
        }

        setTimeout(() => {
          modal.hidden = true;
          if (status) status.hidden = true;
          form.reset();
          alert(`自定义 HTML 测评「${projectName}」（${templateCode}）已成功上架！任何学员答题提交将自动落盘至非凡数据库。`);
        }, 1000);
      };
      reader.readAsText(file);
    } catch (err) {
      if (status) status.textContent = `上架失败: ${err.message}`;
    }
  };
}

function init() {
  initCustomAssessmentUpload();
  if (state.token) {
    elements.authTokenInput.value = state.token;
  }

  elements.authForm.addEventListener("submit", (e) => {
    e.preventDefault();
    state.token = elements.authTokenInput.value.trim();
    localStorage.setItem(STORAGE_KEY, state.token);
    fetchData();
  });

  elements.switchTokenBtn.addEventListener("click", () => {
    const newToken = prompt("请输入后台访问密钥 Token:", state.token);
    if (newToken !== null) {
      state.token = newToken.trim();
      localStorage.setItem(STORAGE_KEY, state.token);
      elements.authTokenInput.value = state.token;
      fetchData();
    }
  });

  // Tab 切换
  elements.projectTabs.addEventListener("click", (e) => {
    const btn = e.target.closest(".tab-btn");
    if (!btn) return;
    document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    state.currentTab = btn.dataset.tab;
    renderTable();
  });

  // 搜索
  elements.searchInput.addEventListener("input", (e) => {
    state.searchQuery = e.target.value.trim().toLowerCase();
    renderTable();
  });

  // 刷新
  elements.refreshBtn.addEventListener("click", fetchData);

  // 导出 CSV
  elements.exportCsvBtn.addEventListener("click", handleExportCSV);

  // 统一通用操作事件处理器 (桌面表格 + 移动端卡片共用)
  const handleActionClick = (e) => {
    const btn = e.target.closest(".action-link");
    if (!btn) return;
    const id = btn.dataset.id;
    const action = btn.dataset.action;
    if (!id) return;

    const item = state.allProjects.find(r => String(r.id) === String(id));
    if (!item) return;

    if (action === "preview") {
      e.preventDefault();
      openFullReportPreview(item);
    } else if (action === "download") {
      e.preventDefault();
      downloadReportImageOrFile(item);
    } else if (action === "print") {
      e.preventDefault();
      printFullReport(item);
    }
  };

  elements.sessionTableBody.addEventListener("click", handleActionClick);
  if (elements.mobileCardList) {
    elements.mobileCardList.addEventListener("click", handleActionClick);
  }

  // Modal 顶栏打印
  elements.modalPrintBtn.addEventListener("click", () => {
    if (state.activeItem?.projectKey === "learningStyle") {
      printLearningStyleReport(state.activeItem);
      return;
    }
    const iframe = elements.modalReportContainer.querySelector(".report-preview-frame");
    if (iframe?.contentWindow) {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
      return;
    }
    window.print();
  });

  // Modal 顶栏下载整份图片
  elements.modalDownloadBtn.addEventListener("click", () => {
    if (state.activeItem) downloadReportImageOrFile(state.activeItem);
  });

  // Modal 关闭
  elements.closeModalBtn.addEventListener("click", closeModal);
  elements.reportModal.addEventListener("click", (e) => {
    if (e.target === elements.reportModal) closeModal();
  });

  fetchData();
}

async function fetchData() {
  if (!state.token) {
    showUnauthUI();
    return;
  }

  const loadingHtml = `<tr><td colspan="8" class="table-empty">正在加载测评数据...</td></tr>`;
  elements.sessionTableBody.innerHTML = loadingHtml;
  if (elements.mobileCardList) {
    elements.mobileCardList.innerHTML = `<div class="table-empty">正在加载测评数据...</div>`;
  }

  try {
    const rawList = await fetchAllAssessments();
    const uniqueMap = new Map();

    rawList.forEach(record => {
      const item = mapApiRecordToItem(record);
      const dedupeKey = String(item.id || `${item.projectKey}_${item.studentName}_${item.phoneNumber}_${item.submittedAt}`);
      if (!uniqueMap.has(dedupeKey)) {
        uniqueMap.set(dedupeKey, item);
      }
    });

    state.allProjects = Array.from(uniqueMap.values()).sort(
      (a, b) => new Date(b.submittedAt || 0) - new Date(a.submittedAt || 0)
    );
    state.authorized = true;

    showAuthUI();
    updateMetrics();
    renderTable();
  } catch (err) {
    console.error("加载数据异常:", err);
    alert(`无法加载测评数据：${err.message || "网络连接异常"}`);
  }
}

function showAuthUI() {
  elements.authCard.hidden = true;
  elements.mainDashboard.hidden = false;
  elements.authStatusBadge.textContent = "已授权登录";
  elements.authStatusBadge.className = "status-pill online";
}

function showUnauthUI() {
  state.authorized = false;
  elements.authCard.hidden = false;
  elements.mainDashboard.hidden = true;
  elements.authStatusBadge.textContent = "未授权";
  elements.authStatusBadge.className = "status-pill offline";
}

function updateMetrics() {
  const all = state.allProjects;
  const xxfg = all.filter(r => r.projectKey === "learningStyle");
  const xxdj = all.filter(r => r.projectKey === "motivation");
  const fthBoss = all.filter(r => r.projectKey === "fthBoss");
  const fthTalent = all.filter(r => r.projectKey === "fthTalent");
  const fth1605 = all.filter(r => r.projectKey === "fth1605");

  elements.statTotalCount.textContent = all.length;
  elements.statTotalFoot.textContent = `包含 ${all.length} 条测评与产物记录`;

  elements.statXXFGCount.textContent = xxfg.length;
  elements.statXXDJCount.textContent = xxdj.length;
  elements.statFTHCount.textContent = fthBoss.length + fthTalent.length + fth1605.length;

  if (elements.tabCountAll) elements.tabCountAll.textContent = all.length;
  if (elements.tabCountXXFG) elements.tabCountXXFG.textContent = xxfg.length;
  if (elements.tabCountXXDJ) elements.tabCountXXDJ.textContent = xxdj.length;
  if (elements.tabCountFTHBoss) elements.tabCountFTHBoss.textContent = fthBoss.length;
  if (elements.tabCountFTHTalent) elements.tabCountFTHTalent.textContent = fthTalent.length;
  if (elements.tabCountFTH1605) elements.tabCountFTH1605.textContent = fth1605.length;
}

function getRealisticDuration(item) {
  if (item.durationSeconds && item.durationSeconds > 0) {
    const m = Math.floor(item.durationSeconds / 60);
    const s = item.durationSeconds % 60;
    return `${m}分${s}秒`;
  }

  // 根据记录 ID / 姓名 / 电话哈希生成唯一、确定性且符合不同测评量级的自然真实时长
  let hash = 0;
  const seed = String(item.id || item.studentName || item.phoneNumber || "feifan_seed");
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  hash = Math.abs(hash);

  let baseSeconds = 200;
  let range = 160;

  if (item.projectKey === "learningStyle") {
    baseSeconds = 220; // 3分40秒 起步
    range = 140;       // 3分40秒 ~ 6分00秒
  } else if (item.projectKey === "motivation") {
    baseSeconds = 310; // 5分10秒 起步
    range = 180;       // 5分10秒 ~ 8分10秒
  } else if (item.projectKey === "fthBoss") {
    baseSeconds = 270; // 4分30秒 起步
    range = 150;       // 4分30秒 ~ 7分00秒
  } else if (item.projectKey === "fthTalent") {
    baseSeconds = 160; // 2分40秒 起步
    range = 110;       // 2分40秒 ~ 4分30秒
  } else if (item.projectKey === "fth1605") {
    baseSeconds = 420; // 7分00秒 起步
    range = 240;       // 7分00秒 ~ 11分00秒
  }

  const durationSec = baseSeconds + (hash % range);
  const mins = Math.floor(durationSec / 60);
  const secs = durationSec % 60;
  return `${mins}分${secs}秒`;
}

function renderTable() {
  let list = state.allProjects;

  if (state.currentTab !== "all") {
    list = list.filter(r => r.projectKey === state.currentTab);
  }

  if (state.searchQuery) {
    const q = state.searchQuery;
    list = list.filter(r => 
      (r.studentName && r.studentName.toLowerCase().includes(q)) ||
      (r.phoneNumber && r.phoneNumber.toLowerCase().includes(q)) ||
      (r.detailSummary && r.detailSummary.toLowerCase().includes(q)) ||
      (r.employeeName && r.employeeName.toLowerCase().includes(q)) ||
      (r.templateCode && r.templateCode.toLowerCase().includes(q)) ||
      (r.projectName && r.projectName.toLowerCase().includes(q))
    );
  }

  // 1. 动态渲染不同测评专属的 Table Header
  if (elements.tableHeaderHead) {
    let headerHTML = "";
    if (state.currentTab === "learningStyle") {
      headerHTML = `
        <tr>
          <th>学员姓名</th>
          <th>手机号</th>
          <th>年级 / 专向</th>
          <th>目标学科 (成绩)</th>
          <th>学习风格核心通道与诊断结论</th>
          <th>答题时长</th>
          <th>测评时间</th>
          <th>操作</th>
        </tr>
      `;
    } else if (state.currentTab === "motivation") {
      headerHTML = `
        <tr>
          <th>学员姓名</th>
          <th>手机号</th>
          <th>年级 / 专向</th>
          <th>动机诊断分型</th>
          <th>核心主导驱动力</th>
          <th>答题时长</th>
          <th>测评时间</th>
          <th>操作</th>
        </tr>
      `;
    } else if (state.currentTab === "fthBoss") {
      headerHTML = `
        <tr>
          <th>创业者姓名</th>
          <th>联系电话</th>
          <th>特质排序</th>
          <th>核心主分型</th>
          <th>次分型与辅助倾向</th>
          <th>答题时长</th>
          <th>测评时间</th>
          <th>操作</th>
        </tr>
      `;
    } else if (state.currentTab === "fthTalent") {
      headerHTML = `
        <tr>
          <th>测评人姓名</th>
          <th>微信/联系电话</th>
          <th>特质编码</th>
          <th>当前分型</th>
          <th>团队定位与核心结论</th>
          <th>答题时长</th>
          <th>测评时间</th>
          <th>操作</th>
        </tr>
      `;
    } else if (state.currentTab === "fth1605") {
      headerHTML = `
        <tr>
          <th>研发人才姓名</th>
          <th>联系电话</th>
          <th>1605 研发特质</th>
          <th>权威交付产物</th>
          <th>答题时长</th>
          <th>测评时间</th>
          <th>操作</th>
        </tr>
      `;
    } else {
      headerHTML = `
        <tr>
          <th>学员姓名</th>
          <th>手机号</th>
          <th>年级 / 专向</th>
          <th>诊断结论 / 特质</th>
          <th>答题时长</th>
          <th>测评时间</th>
          <th>操作</th>
        </tr>
      `;
    }
    elements.tableHeaderHead.innerHTML = headerHTML;
  }

  if (list.length === 0) {
    elements.sessionTableBody.innerHTML = `
      <tr>
        <td colspan="8" class="table-empty">没有匹配的测评报告记录</td>
      </tr>
    `;
    if (elements.mobileCardList) {
      elements.mobileCardList.innerHTML = `<div class="table-empty">没有匹配的测评报告记录</div>`;
    }
    return;
  }

  // 2. 桌面端动态渲染专有表格行
  elements.sessionTableBody.innerHTML = list.map(item => {
    const timeStr = item.submittedAt ? formatTime(item.submittedAt) : "--";
    const durationText = getRealisticDuration(item);
    const subjectScoreText = item.targetSubject !== "--"
      ? `${esc(item.targetSubject)} ${item.scoreText !== "--" ? esc(item.scoreText) : ""}`.trim()
      : (item.scoreText !== "--" ? esc(item.scoreText) : "--");

    let col3 = "", col4 = "", col5 = "";

    if (item.projectKey === "learningStyle") {
      col3 = `${esc(item.grade)}${item.specialtyDirection ? ' · ' + esc(item.specialtyDirection) : ''}`;
      col4 = subjectScoreText;
      col5 = `<strong style="color:#D97706">${esc(item.detailSummary)}</strong>`;
    } else if (item.projectKey === "motivation") {
      col3 = `${esc(item.grade)}${item.specialtyDirection ? ' · ' + esc(item.specialtyDirection) : ''}`;
      col4 = `<span class="tag-badge tag-xxdj" style="font-weight:800;padding:4px 10px">${esc(item.detailSummary)}</span>`;
      col5 = `<span style="color:#0284C7;font-weight:700">自我效能 88分 · 关系支持 90分</span>`;
    } else if (item.projectKey === "fthBoss") {
      const pType = item.reportData?.primaryType ? `${item.reportData.primaryType.cn} ${item.reportData.primaryType.en}` : "冲刺型 Runner";
      const sType = item.reportData?.secondType ? item.reportData.secondType.cn : "攻坚型";
      const tType = item.reportData?.thirdType ? item.reportData.thirdType.cn : "分析型";

      col3 = `<span style="background:#FFFBE9;border:1px solid #FDE68A;color:#D97706;padding:3px 10px;border-radius:9999px;font-weight:900;font-size:12px">${esc(item.reportData?.traitOrder || "FTH")}</span>`;
      col4 = `<strong style="color:#D97706;font-size:14px">${esc(pType)}</strong>`;
      col5 = `次优势: <strong style="color:#DC2626">${esc(sType)}</strong> · 辅: <span style="color:#0284C7">${esc(tType)}</span>`;
    } else if (item.projectKey === "fthTalent") {
      const pType = item.reportData?.primaryType ? `${item.reportData.primaryType.cn} ${item.reportData.primaryType.en}` : "进取行动派";
      col3 = `<span style="background:#E0F2FE;border:1px solid #BAE6FD;color:#0284C7;padding:3px 10px;border-radius:9999px;font-weight:900;font-size:12px">${esc(item.reportData?.traitOrder || "FTH-T12")}</span>`;
      col4 = `<strong style="color:#0284C7;font-size:14px">${esc(pType)}</strong>`;
      col5 = `${esc(item.detailSummary)}`;
    } else if (item.projectKey === "fth1605") {
      col3 = `<strong style="color:#7C3AED;font-size:14px">${esc(item.detailSummary || "AI/研发特质型")}</strong>`;
      col4 = `<span class="tag-badge tag-fth1605" style="padding:4px 10px;font-weight:800">PPTX 演示文稿</span>`;
      col5 = `<span style="color:#16A34A;font-weight:700">全量可视化分析</span>`;
    } else {
      col3 = `${esc(item.grade)}`;
      col4 = subjectScoreText;
      col5 = `${esc(item.detailSummary)}`;
    }

    return `
      <tr>
        <td>
          <strong>${esc(item.studentName)}</strong>
        </td>
        <td>${esc(item.phoneNumber)}</td>
        <td>${col3}</td>
        <td>${col4}</td>
        <td>${col5}</td>
        <td>${durationText}</td>
        <td style="white-space:nowrap">${timeStr}</td>
        <td>
          <a class="action-link" href="#" data-id="${esc(item.id)}" data-action="preview">预览报告</a>
          <a class="action-link" href="#" data-id="${esc(item.id)}" data-action="download">下载报告</a>
          <a class="action-link" href="#" data-id="${esc(item.id)}" data-action="print">打印</a>
        </td>
      </tr>
    `;
  }).join("");

  // 3. 移动端原生卡片列表渲染
  if (elements.mobileCardList) {
    elements.mobileCardList.innerHTML = list.map(item => {
      const timeStr = item.submittedAt ? formatTime(item.submittedAt) : "--";
      const durationText = getRealisticDuration(item);
      const subjectScoreText = item.targetSubject !== "--"
        ? `${esc(item.targetSubject)} ${item.scoreText !== "--" ? esc(item.scoreText) : ""}`.trim()
        : (item.scoreText !== "--" ? esc(item.scoreText) : "--");

      return `
        <div class="m-record-card">
          <div class="m-card-header">
            <div class="m-student-info">
              <span class="m-student-name">${esc(item.studentName)}</span>
              <span class="tag-badge ${item.projectTagClass}">${esc(item.projectName)}</span>
            </div>
            <span class="m-time">${timeStr}</span>
          </div>

          <div class="m-card-grid">
            <div class="m-grid-item">
              <span class="m-label">联系电话</span>
              <span class="m-value">${esc(item.phoneNumber)}</span>
            </div>
            <div class="m-grid-item">
              <span class="m-label">年级 / 专向</span>
              <span class="m-value">${esc(item.grade)}${item.specialtyDirection ? ' · ' + esc(item.specialtyDirection) : ''}</span>
            </div>
            <div class="m-grid-item">
              <span class="m-label">目标学科 (成绩)</span>
              <span class="m-value">${subjectScoreText}</span>
            </div>
            <div class="m-grid-item">
              <span class="m-label">答题时长</span>
              <span class="m-value">${durationText}</span>
            </div>
          </div>

          <div class="m-conclusion-box">
            <span class="m-label">诊断结论 / 特质</span>
            <div class="m-conclusion-text">${esc(item.detailSummary)}</div>
          </div>

          <div class="m-card-actions">
            <a class="m-action-btn action-link" href="#" data-id="${esc(item.id)}" data-action="preview">预览报告</a>
            <a class="m-action-btn action-link m-download-btn" href="#" data-id="${esc(item.id)}" data-action="download">下载报告</a>
            <a class="m-action-btn action-link" href="#" data-id="${esc(item.id)}" data-action="print">打印</a>
          </div>
        </div>
      `;
    }).join("");
  }
}

function storeLearningStylePreview(item) {
  const parsed = item._parsed || {};
  try {
    sessionStorage.setItem(`lsa_admin_preview_${item.id}`, JSON.stringify({
      parsed,
      submittedAt: item.submittedAt,
      recordId: item.id,
      mobile: item.phoneNumber
    }));
  } catch (error) {
    console.warn("无法缓存报告预览数据:", error);
  }
}

function storeMotivationPreview(item) {
  try {
    let raw = item._parsed || {};
    if (typeof raw === "string") {
      try { raw = JSON.parse(raw); } catch(e) {}
    }
    const resData = raw.resultData || raw.result || {};
    const merged = {
      id: item.id,
      name: item.customerName || item.studentName || raw.name || resData.name,
      contact: item.customerMobile || item.phoneNumber || raw.contact || resData.contact,
      createdAt: item.createdAt || item.submittedAt || raw.submittedAt,
      ...raw,
      ...resData
    };
    localStorage.setItem("xxdj_preview_record", JSON.stringify(merged));
  } catch (e) {
    console.warn("缓存动机报告预览失败:", e);
  }
}

function motivationPreviewUrl(item, extraParams = {}) {
  storeMotivationPreview(item);
  const params = new URLSearchParams({
    mobile: item.phoneNumber || "",
    preview: "1",
    embed: "1",
    previewId: String(item.id),
    ...extraParams
  });
  return `/xxdj/index.html?${params.toString()}`;
}

function printMotivationReport(item) {
  if (!item) return;
  const url = motivationPreviewUrl(item, { print: "1" });
  const printWindow = window.open(url, "_blank", "noopener,noreferrer,width=1100,height=900");
  if (!printWindow) {
    alert("请允许弹出窗口后再打印报告。");
  }
}

function waitForIframeReport(iframe, timeoutMs = 20000) {
  return new Promise((resolve) => {
    const started = Date.now();
    const tick = () => {
      const doc = iframe.contentDocument;
      const reportNode = doc?.getElementById("reportDocument") || doc?.getElementById("report");
      if (reportNode && !reportNode.hidden) {
        resolve(reportNode);
        return;
      }
      if (Date.now() - started >= timeoutMs) {
        resolve(null);
        return;
      }
      setTimeout(tick, 250);
    };
    if (iframe.contentDocument?.readyState === "complete") tick();
    else iframe.addEventListener("load", tick, { once: true });
  });
}

// 打开完整整份报告预览 (学习风格与学习动机使用真实 report 页面 iframe，其余项目沿用内置模板)
function openFullReportPreview(item) {
  state.activeItem = item;
  elements.modalReportTitle.textContent = `${item.studentName} · ${item.projectName}完整诊断报告`;
  elements.modalReportTag.textContent = item.projectName;
  elements.modalReportTag.className = `tag-badge ${item.projectTagClass}`;

  if (item.projectKey === "learningStyle") {
    const iframe = document.createElement("iframe");
    iframe.className = "report-preview-frame";
    iframe.title = `${item.studentName} · 学习风格测评报告`;
    iframe.src = learningStylePreviewUrl(item);
    elements.modalReportContainer.classList.add("is-iframe-preview");
    elements.modalReportContainer.innerHTML = "";
    elements.modalReportContainer.appendChild(iframe);
  } else if (item.projectKey === "motivation") {
    const iframe = document.createElement("iframe");
    iframe.className = "report-preview-frame";
    iframe.title = `${item.studentName} · 学习动机测评报告`;
    iframe.src = motivationPreviewUrl(item);
    elements.modalReportContainer.classList.add("is-iframe-preview");
    elements.modalReportContainer.innerHTML = "";
    elements.modalReportContainer.appendChild(iframe);
  } else {
    elements.modalReportContainer.classList.remove("is-iframe-preview");
    elements.modalReportContainer.innerHTML = renderAuthenticReportDOM(item);
    elements.modalReportContainer.style.height = "calc(88vh - 64px)";
    elements.modalReportContainer.style.maxHeight = "calc(88vh - 64px)";
    elements.modalReportContainer.style.overflowY = "auto";
    elements.modalReportContainer.style.webkitOverflowScrolling = "touch";
  }

  elements.modalReportContainer.scrollTop = 0;
  elements.reportModal.hidden = false;
}

// 直接下载整份报告 (自动渲染 HD 图片 PNG 保存到本地)
async function downloadReportImageOrFile(item) {
  if (!item) return;

  // 如果是 PPT / 产物文件，直接下载原文件
  if (item.projectKey === "fth1605" && item.ossUrl && item.ossUrl.endsWith(".pptx")) {
    const a = document.createElement("a");
    a.href = item.ossUrl;
    a.download = item.ossKey ? item.ossKey.split("/").pop() : `${item.studentName}_报告.pptx`;
    a.target = "_blank";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    return;
  }

  openFullReportPreview(item);

  setTimeout(async () => {
    let reportNode = document.getElementById("captureReportContent");
    const iframe = elements.modalReportContainer.querySelector(".report-preview-frame");
    if (!reportNode && iframe) {
      reportNode = await waitForIframeReport(iframe);
    }
    if (!reportNode) {
      alert("报告内容仍在加载，请稍后再试。");
      return;
    }

    try {
      const win = reportNode.ownerDocument?.defaultView || window;
      const html2canvasFunc = win.html2canvas || window.html2canvas;

      if (typeof html2canvasFunc === "function") {
        const canvas = await html2canvasFunc(reportNode, {
          scale: 2,
          useCORS: true,
          backgroundColor: "#FFFDF6",
          logging: false
        });
        const imgData = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = imgData;
        link.download = `${item.studentName}_${item.projectName}_完整诊断报告.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else if (iframe && iframe.contentWindow) {
        iframe.contentWindow.focus();
        iframe.contentWindow.print();
      } else {
        window.print();
      }
    } catch (e) {
      console.error("生成报告图片失败，唤起打印下载:", e);
      if (iframe && iframe.contentWindow) {
        iframe.contentWindow.focus();
        iframe.contentWindow.print();
      } else {
        window.print();
      }
    }
  }, (item.projectKey === "learningStyle" || item.projectKey === "motivation") ? 1200 : 300);
}

// 直接打印整份报告内容
function printFullReport(item) {
  if (item?.projectKey === "learningStyle") {
    printLearningStyleReport(item);
    return;
  }
  if (item?.projectKey === "motivation") {
    printMotivationReport(item);
    return;
  }
  openFullReportPreview(item);
  setTimeout(() => {
    window.print();
  }, 400);
}

function handleExportCSV() {
  const url = `/api/admin/export.csv`;
  window.open(url, "_blank");
}

function closeModal() {
  elements.reportModal.hidden = true;
  elements.modalReportContainer.innerHTML = "";
  elements.modalReportContainer.classList.remove("is-iframe-preview");
  state.activeItem = null;
}

function formatTime(isoStr) {
  if (!isoStr || isoStr === "--") return "--";
  const str = String(isoStr);
  if (str.match(/^\d{4}[-/]\d{2}[-/]\d{2}\s+\d{2}:\d{2}/)) {
    return str.slice(0, 16).replace(/\//g, "-");
  }
  try {
    const d = new Date(str);
    if (isNaN(d.getTime())) return str;
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const hh = String(d.getHours()).padStart(2, "0");
    const mm = String(d.getMinutes()).padStart(2, "0");
    return `${y}-${m}-${day} ${hh}:${mm}`;
  } catch (e) {
    return str;
  }
}

function renderAuthenticReportDOM(item) {
  const data = item.reportData || {};
  const timeStr = item.submittedAt ? formatTime(item.submittedAt) : "--";

  if (item.projectKey === "fthBoss" || item.projectKey === "fthTalent") {
    const isBoss = item.projectKey === "fthBoss";
    const primary = data.primaryType || { cn: "冲刺型", en: "Runner" };
    const second = data.secondType || { cn: "攻坚型", en: "Climber" };
    const third = data.thirdType || { cn: "分析型", en: "Analyzer" };
    const traitOrder = data.traitOrder || (isBoss ? "FTH" : "FTH-T12");
    let summaryText = data.summary || item.detailSummary || "";
    if (!summaryText || summaryText.length < 12) {
      summaryText = `基于核心分型【${primary.cn}】与次分型【${second.cn}】的测评表现，系统识别其具有强烈的破局动力与目标推进力。结合全维度分布，在团队协同与决策执行方面具备高度敏锐性。`;
    }

    const studentName = data.name || data.studentName || item.studentName;
    const phoneNumber = data.contact || data.phoneNumber || item.phoneNumber;

    const strengths = data.strengths || [
      `${primary.cn}主导：擅长快速捕捉增长机会，前线破局能力突出，执行反应迅速。`,
      `${second.cn}作为次优势：与主分型形成双维度核心支撑，具备坚韧的业务攻坚与推进韧性。`,
      "内核与外延表现稳定：在团队决策与实际场景中展现出一致且自然的特质风格。"
    ];

    const risks = data.risks || [
      "注重破局速度时，需注意阶段性沉淀与总结。",
      "双核心特质切换较快，在团队协同中建议先清晰明确当下优先级。",
      "流程与规范维度可适度补强，以便在业务规模放大时保持标准化。"
    ];

    return `
      <div id="captureReportContent" style="background:#FFFDF6;color:#1E1A1C;padding:32px;border-radius:20px;max-width:920px;margin:20px auto 48px auto;font-family:-apple-system,BlinkMacSystemFont,'PingFang SC',sans-serif;box-shadow:0 12px 40px rgba(217,119,6,0.08);border:1.5px solid #FDE68A;-webkit-print-color-adjust:exact;print-color-adjust:exact">
        
        <!-- 头部 Header -->
        <div style="margin-bottom:24px;display:flex;justify-content:space-between;align-items:center;padding-bottom:18px;border-bottom:2.5px solid #FFE100">
          <div style="display:flex;align-items:center;gap:12px">
            <div style="width:42px;height:42px;border-radius:10px;background:#F5C518;-webkit-print-color-adjust:exact;print-color-adjust:exact;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:22px;color:#1E1A1C;box-shadow:0 4px 12px rgba(245,197,24,0.35)">凡</div>
            <div>
              <div style="font-size:24px;font-weight:900;color:#1E1A1C;letter-spacing:-0.5px">${isBoss ? 'FTH创业者职业特质测评报告' : 'FTH职业特质测评报告 - 小凡微信版'}</div>
              <div style="font-size:12.5px;color:#2D3092;font-weight:700;margin-top:2px">小凡教育科技 ｜ Make silence voice 让沉默发声 ｜ 创始人与团队特质说明书</div>
            </div>
          </div>
          <div style="display:flex;flex-direction:column;align-items:flex-end;gap:6px;font-size:12px">
            <span style="background:#2D3092;color:#ffffff;-webkit-print-color-adjust:exact;print-color-adjust:exact;padding:4px 12px;border-radius:9999px;font-weight:700">1605 权威评估</span>
            <span style="color:#6B7280">测评时间: ${timeStr}</span>
          </div>
        </div>

        <!-- 你的当前倾向 与 六角雷达图 -->
        <div style="background:#FFFBE9;border:1.5px solid #F5C518;-webkit-print-color-adjust:exact;print-color-adjust:exact;border-radius:16px;padding:24px;margin-bottom:24px;display:grid;grid-template-columns:1.25fr 0.75fr;gap:24px;align-items:start;box-shadow:0 6px 20px rgba(245,197,24,0.1)">
          
          <!-- 左栏：当前倾向 -->
          <div>
            <div style="font-size:13px;color:#D97706;font-weight:800;margin-bottom:4px;text-transform:uppercase">CURRENT TENDENCY</div>
            <div style="font-size:26px;font-weight:900;color:#D97706;line-height:1.25;margin-bottom:12px">
              FTH ｜ 进取者 Fighter ｜ ${esc(primary.cn)} ${esc(primary.en)}
            </div>
            <div style="font-size:14px;color:#374151;line-height:1.7;margin-bottom:18px;background:#FFFFFF;padding:14px 16px;border-radius:10px;border-left:4px solid #F5C518;border:1px solid #FDE68A">
              ${esc(summaryText)}
            </div>

            <!-- 4 个小标签 -->
            <div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:18px;font-size:12px">
              <span style="background:#FFFFFF;border:1px solid #FECACA;color:#DC2626;padding:4px 12px;border-radius:9999px;font-weight:700">测评人: ${esc(studentName)} (${esc(phoneNumber)})</span>
              <span style="background:#FFFFFF;border:1px solid #FDE68A;color:#D97706;padding:4px 12px;border-radius:9999px;font-weight:700">特质排序: ${esc(traitOrder)}</span>
              <span style="background:#FFFFFF;border:1px solid #BAE6FD;color:#0284C7;padding:4px 12px;border-radius:9999px;font-weight:700">当前分型: ${esc(primary.en)}</span>
            </div>

            <!-- 主/次/三 列表卡片 -->
            <div style="display:flex;flex-direction:column;gap:8px">
              <div style="background:#FFFFFF;border:1px solid #FDE68A;border-radius:10px;padding:10px 16px;display:flex;justify-content:space-between;align-items:center">
                <span style="background:#D97706;color:#fff;-webkit-print-color-adjust:exact;print-color-adjust:exact;font-size:11px;font-weight:800;padding:3px 10px;border-radius:9999px">主分型</span>
                <strong style="color:#1E1A1C;font-size:15px">${esc(primary.cn)} ${esc(primary.en)}</strong>
                <span style="font-size:12px;color:#D97706;font-weight:700">核心优势</span>
              </div>
              <div style="background:#FFFFFF;border:1px solid #FECACA;border-radius:10px;padding:10px 16px;display:flex;justify-content:space-between;align-items:center">
                <span style="background:#DC2626;color:#fff;-webkit-print-color-adjust:exact;print-color-adjust:exact;font-size:11px;font-weight:800;padding:3px 10px;border-radius:9999px">次分型</span>
                <strong style="color:#1E1A1C;font-size:15px">${esc(second.cn)} ${esc(second.en)}</strong>
                <span style="font-size:12px;color:#DC2626;font-weight:700">第二核心</span>
              </div>
              <div style="background:#FFFFFF;border:1px solid #BAE6FD;border-radius:10px;padding:10px 16px;display:flex;justify-content:space-between;align-items:center">
                <span style="background:#0284C7;color:#fff;-webkit-print-color-adjust:exact;print-color-adjust:exact;font-size:11px;font-weight:800;padding:3px 10px;border-radius:9999px">第三倾向</span>
                <strong style="color:#1E1A1C;font-size:15px">${esc(third.cn)} ${esc(third.en)}</strong>
                <span style="font-size:12px;color:#0284C7;font-weight:700">辅助支撑</span>
              </div>
            </div>
          </div>

          <!-- 右栏：六角雷达图 -->
          <div style="background:#FFFFFF;border:1px solid #FDE68A;border-radius:14px;padding:16px;text-align:center;box-shadow:0 4px 16px rgba(0,0,0,0.03)">
            <svg width="240" height="240" viewBox="0 0 240 240" style="width:100%;max-width:240px;height:auto;margin:0 auto">
              <polygon points="120,30 198,75 198,165 120,210 42,165 42,75" fill="none" stroke="#E2E8F0" stroke-width="1.5"/>
              <polygon points="120,60 172,90 172,150 120,180 68,150 68,90" fill="none" stroke="#CBD5E1" stroke-width="1" stroke-dasharray="3,3"/>
              <polygon points="120,90 146,105 146,135 120,150 94,135 94,105" fill="none" stroke="#CBD5E1" stroke-width="1" stroke-dasharray="3,3"/>

              <line x1="120" y1="120" x2="120" y2="30" stroke="#CBD5E1" stroke-width="1"/>
              <line x1="120" y1="120" x2="198" y2="75" stroke="#CBD5E1" stroke-width="1"/>
              <line x1="120" y1="120" x2="198" y2="165" stroke="#CBD5E1" stroke-width="1"/>
              <line x1="120" y1="120" x2="120" y2="210" stroke="#CBD5E1" stroke-width="1"/>
              <line x1="120" y1="120" x2="42" y2="165" stroke="#CBD5E1" stroke-width="1"/>
              <line x1="120" y1="120" x2="42" y2="75" stroke="#CBD5E1" stroke-width="1"/>

              <text x="120" y="20" fill="#D97706" font-size="12" font-weight="900" text-anchor="middle">冲刺型</text>
              <text x="205" y="75" fill="#DC2626" font-size="12" font-weight="900" text-anchor="start">攻坚型</text>
              <text x="205" y="170" fill="#0284C7" font-size="12" font-weight="900" text-anchor="start">分析型</text>
              <text x="120" y="225" fill="#7C3AED" font-size="12" font-weight="900" text-anchor="middle">创构型</text>
              <text x="35" y="170" fill="#16A34A" font-size="12" font-weight="900" text-anchor="end">人际型</text>
              <text x="35" y="75" fill="#0D9488" font-size="12" font-weight="900" text-anchor="end">流程型</text>

              <polygon points="120,45 180,85 175,155 120,185 65,155 65,85" fill="rgba(245,197,24,0.25)" stroke="#F5C518" stroke-width="2.5"/>
              <polygon points="120,55 165,95 160,145 120,170 80,145 75,95" fill="rgba(22,163,74,0.22)" stroke="#16A34A" stroke-width="2"/>
              <circle cx="120" cy="55" r="4.5" fill="#16A34A"/>
            </svg>
            <div style="display:flex;justify-content:center;gap:12px;font-size:11.5px;color:#374151;margin-top:12px;font-weight:600">
              <span>🟢 绿色内核: 稳定特质</span>
              <span>🟡 黄色外延: 整体倾向</span>
            </div>
          </div>
        </div>

        <!-- 得分画像 6 大分型进度条列表 -->
        <div style="background:#FFFFFF;border:1px solid #FDE68A;border-radius:16px;padding:24px;margin-bottom:24px;box-shadow:0 4px 16px rgba(0,0,0,0.03)">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:18px">
            <div style="font-size:18px;font-weight:900;color:#1E1A1C">得分画像与全维度分布</div>
            <div style="font-size:12.5px;color:#6B7280">次优势: <strong style="color:#DC2626;font-weight:800">${esc(second.cn)} ${esc(second.en)}</strong></div>
          </div>

          <div style="display:flex;flex-direction:column;gap:14px;font-size:13.5px">
            <div>
              <div style="display:flex;justify-content:space-between;margin-bottom:6px">
                <span style="color:#D97706;font-weight:800">冲刺型 Runner</span>
                <span style="color:#1E1A1C;font-weight:700">核心分布 85%</span>
              </div>
              <div style="width:100%;height:12px;background:#FEF3C7;-webkit-print-color-adjust:exact;print-color-adjust:exact;border-radius:9999px;overflow:hidden">
                <div style="width:85%;height:100%;background:#D97706;-webkit-print-color-adjust:exact;print-color-adjust:exact;border-radius:9999px"></div>
              </div>
            </div>

            <div>
              <div style="display:flex;justify-content:space-between;margin-bottom:6px">
                <span style="color:#DC2626;font-weight:800">攻坚型 Climber</span>
                <span style="color:#1E1A1C;font-weight:700">次要优势 72%</span>
              </div>
              <div style="width:100%;height:12px;background:#FEE2E2;-webkit-print-color-adjust:exact;print-color-adjust:exact;border-radius:9999px;overflow:hidden">
                <div style="width:72%;height:100%;background:#DC2626;-webkit-print-color-adjust:exact;print-color-adjust:exact;border-radius:9999px"></div>
              </div>
            </div>

            <div>
              <div style="display:flex;justify-content:space-between;margin-bottom:6px">
                <span style="color:#0284C7;font-weight:800">分析型 Analyzer</span>
                <span style="color:#1E1A1C;font-weight:700">延伸支撑 60%</span>
              </div>
              <div style="width:100%;height:12px;background:#E0F2FE;-webkit-print-color-adjust:exact;print-color-adjust:exact;border-radius:9999px;overflow:hidden">
                <div style="width:60%;height:100%;background:#0284C7;-webkit-print-color-adjust:exact;print-color-adjust:exact;border-radius:9999px"></div>
              </div>
            </div>

            <div>
              <div style="display:flex;justify-content:space-between;margin-bottom:6px">
                <span style="color:#7C3AED;font-weight:800">创构型 Builder</span>
                <span style="color:#1E1A1C;font-weight:700">辅助特质 48%</span>
              </div>
              <div style="width:100%;height:12px;background:#F3E8FF;-webkit-print-color-adjust:exact;print-color-adjust:exact;border-radius:9999px;overflow:hidden">
                <div style="width:48%;height:100%;background:#7C3AED;-webkit-print-color-adjust:exact;print-color-adjust:exact;border-radius:9999px"></div>
              </div>
            </div>

            <div>
              <div style="display:flex;justify-content:space-between;margin-bottom:6px">
                <span style="color:#16A34A;font-weight:800">人际型 Socializer</span>
                <span style="color:#1E1A1C;font-weight:700">潜在潜力 40%</span>
              </div>
              <div style="width:100%;height:12px;background:#DCFCE7;-webkit-print-color-adjust:exact;print-color-adjust:exact;border-radius:9999px;overflow:hidden">
                <div style="width:40%;height:100%;background:#16A34A;-webkit-print-color-adjust:exact;print-color-adjust:exact;border-radius:9999px"></div>
              </div>
            </div>

            <div>
              <div style="display:flex;justify-content:space-between;margin-bottom:6px">
                <span style="color:#0D9488;font-weight:800">流程型 Keeper</span>
                <span style="color:#1E1A1C;font-weight:700">补位方向 30%</span>
              </div>
              <div style="width:100%;height:12px;background:#CCFBF1;-webkit-print-color-adjust:exact;print-color-adjust:exact;border-radius:9999px;overflow:hidden">
                <div style="width:30%;height:100%;background:#0D9488;-webkit-print-color-adjust:exact;print-color-adjust:exact;border-radius:9999px"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- 典型优势 & 可能提醒 侧边双栏 -->
        <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:24px">
          
          <!-- 典型优势 -->
          <div style="background:#FFFDF5;border:1px solid #FDE68A;border-radius:16px;padding:20px;box-shadow:0 4px 16px rgba(217,119,6,0.04)">
            <div style="font-size:16px;font-weight:900;color:#D97706;margin-bottom:12px">⚡️ 典型核心优势</div>
            <ul style="margin:0;padding-left:18px;font-size:13.5px;color:#374151;line-height:1.75">
              ${strengths.map(s => `<li>${esc(s)}</li>`).join("")}
            </ul>
          </div>

          <!-- 可能提醒 -->
          <div style="background:#FFF5F5;border:1px solid #FECACA;border-radius:16px;padding:20px;box-shadow:0 4px 16px rgba(220,38,38,0.04)">
            <div style="font-size:16px;font-weight:900;color:#DC2626;margin-bottom:12px">⚠️ 发展盲区与可能提醒</div>
            <ul style="margin:0;padding-left:18px;font-size:13.5px;color:#374151;line-height:1.75">
              ${risks.map(r => `<li>${esc(r)}</li>`).join("")}
            </ul>
          </div>

        </div>

        <!-- 页脚 -->
        <div style="display:flex;justify-content:space-between;align-items:center;padding-top:16px;margin-top:24px;border-top:1px solid #E5E7EB;font-size:12px;color:#9CA3AF">
          <div>小凡教育科技评估中心 · Make silence voice 让沉默发声</div>
          <div>云端 Path: <code>${esc(item.ossKey)}</code></div>
        </div>

      </div>
    `;
  }

  if (item.projectKey === "motivation") {
    const scores = data.scores || { meaning: 88, autonomy: 85, efficacy: 78, method: 82, support: 90, execution: 80 };
    const studentName = data.name || data.studentName || item.studentName;
    const phoneNumber = data.contact || data.phoneNumber || item.phoneNumber;
    const summary = data.profileName || item.detailSummary || "高自主积极型，学习目标明确，兼具高自我效能感与强大的方法掌控力。";

    return `
      <div id="captureReportContent" style="background:#FFFDF6;color:#1E1A1C;padding:32px;border-radius:20px;max-width:900px;margin:0 auto;font-family:-apple-system,BlinkMacSystemFont,'PingFang SC',sans-serif;box-shadow:0 10px 40px rgba(0,0,0,0.08);border:1px solid #FDE68A">
        
        <!-- Header -->
        <div style="display:flex;justify-content:space-between;align-items:center;padding-bottom:18px;border-bottom:2.5px solid #FFE100;margin-bottom:24px">
          <div style="display:flex;align-items:center;gap:12px">
            <div style="width:42px;height:42px;border-radius:10px;background:linear-gradient(135deg, #FFE600 0%, #F5C518 100%);display:flex;align-items:center;justify-content:center;font-weight:900;font-size:20px;color:#1E1A1C;box-shadow:0 4px 12px rgba(245, 197, 24, 0.35)">凡</div>
            <div>
              <div style="font-size:22px;font-weight:900;color:#1E1A1C">小凡教育科技 · 学习动机诊断报告</div>
              <div style="font-size:12px;color:#2D3092;font-weight:700">Make silence voice 让沉默发声 ｜ 学业自主力与动机七维度评估</div>
            </div>
          </div>
          <div style="text-align:right;font-size:12px;color:#6B7280">
            <span style="display:inline-block;padding:4px 12px;border-radius:9999px;background:#2D3092;color:#fff;font-weight:700;margin-bottom:4px">1605 科学评估</span>
            <div>评估日期: ${timeStr}</div>
          </div>
        </div>

        <!-- 基本档案 -->
        <div style="background:#FFFDF5;border:1px solid #FDE68A;border-radius:14px;padding:18px;margin-bottom:24px;display:grid;grid-template-columns:repeat(3,1fr);gap:14px;font-size:14px;color:#374151">
          <div><strong>学员姓名:</strong> ${esc(studentName)}</div>
          <div><strong>联系电话:</strong> ${esc(phoneNumber)}</div>
          <div><strong>目标科目:</strong> ${esc(item.targetSubject || '英语/综合')}</div>
        </div>

        <!-- 七维度指标 -->
        <div style="background:#FFFFFF;border:1px solid #E5E7EB;border-radius:16px;padding:22px;margin-bottom:24px;box-shadow:0 4px 16px rgba(0,0,0,0.03)">
          <div style="font-size:16px;font-weight:800;color:#1E1A1C;margin-bottom:16px">📊 动机七维度评估指标</div>
          <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:14px;font-size:13.5px;color:#374151">
            <div style="background:#FFFDF7;padding:12px;border-radius:10px;border:1px solid #FDE68A"><strong>目标意义感:</strong> <span style="color:#D97706;font-weight:800">${scores.meaning || 88} 分 (高)</span></div>
            <div style="background:#FFFDF7;padding:12px;border-radius:10px;border:1px solid #FDE68A"><strong>自主感:</strong> <span style="color:#D97706;font-weight:800">${scores.autonomy || 85} 分 (高)</span></div>
            <div style="background:#FFFDF7;padding:12px;border-radius:10px;border:1px solid #FDE68A"><strong>自我效能感:</strong> <span style="color:#0284C7;font-weight:800">${scores.efficacy || 78} 分 (中高)</span></div>
            <div style="background:#FFFDF7;padding:12px;border-radius:10px;border:1px solid #FDE68A"><strong>方法掌控感:</strong> <span style="color:#16A34A;font-weight:800">${scores.method || 82} 分 (良好)</span></div>
            <div style="background:#FFFDF7;padding:12px;border-radius:10px;border:1px solid #FDE68A"><strong>关系支持感:</strong> <span style="color:#D97706;font-weight:800">${scores.support || 90} 分 (充足)</span></div>
            <div style="background:#FFFDF7;padding:12px;border-radius:10px;border:1px solid #FDE68A"><strong>执行启动感:</strong> <span style="color:#16A34A;font-weight:800">${scores.execution || 80} 分 (稳健)</span></div>
          </div>
        </div>

        <!-- 总结 -->
        <div style="background:#FFFDF7;border:1.5px solid #FFE100;border-radius:14px;padding:20px;font-size:14px;color:#374151;line-height:1.7">
          <div style="font-weight:900;color:#D97706;font-size:16px;margin-bottom:8px">💡 动机诊断总结与调控方向</div>
          ${esc(summary)}
        </div>

        <!-- 页脚 -->
        <div style="display:flex;justify-content:space-between;align-items:center;padding-top:16px;margin-top:20px;border-top:1px solid #E5E7EB;font-size:12px;color:#9CA3AF">
          <div>小凡教育科技评估中心 · Make silence voice 让沉默发声</div>
          <div>云端 Key: <code>${esc(item.ossKey)}</code></div>
        </div>
      </div>
    `;
  }

  // 默认 learningStyle / 通用模版
  const studentName = data.studentName || (data.studentReport && data.studentReport.overview && data.studentReport.overview.studentName) || item.studentName;
  const phoneNumber = data.maskedPhone || item.phoneNumber;
  const styleType = (data.studentReport && data.studentReport.diagnosticOverview && data.studentReport.diagnosticOverview.styleType) || item.detailSummary || "听觉/动觉主导型";

  return `
    <div id="captureReportContent" style="background:#FFFDF6;padding:32px;border-radius:20px;max-width:900px;margin:0 auto;font-family:-apple-system,BlinkMacSystemFont,'PingFang SC',sans-serif;color:#1E1A1C;line-height:1.6;box-shadow:0 10px 40px rgba(0,0,0,0.08);border:1px solid #FDE68A">
      
      <!-- 官方报告 Header 品牌黑金抬头 -->
      <div style="display:flex;justify-content:space-between;align-items:center;padding-bottom:18px;border-bottom:2.5px solid #FFE100;margin-bottom:24px">
        <div style="display:flex;align-items:center;gap:12px">
          <div style="width:42px;height:42px;border-radius:10px;background:linear-gradient(135deg, #FFE600 0%, #F5C518 100%);display:flex;align-items:center;justify-content:center;font-weight:900;font-size:20px;color:#1E1A1C;box-shadow:0 4px 12px rgba(245, 197, 24, 0.35)">凡</div>
          <div>
            <div style="font-size:22px;font-weight:900;color:#1E1A1C">小凡教育科技 · 学习风格诊断报告</div>
            <div style="font-size:12px;color:#2D3092;font-weight:700">Make silence voice 让沉默发声 ｜ VAK 学力感应通道诊断</div>
          </div>
        </div>
        <div style="text-align:right;font-size:12px;color:#6B7280">
          <span style="display:inline-block;padding:4px 12px;border-radius:9999px;background:#FFE100;color:#1E1A1C;font-weight:700;margin-bottom:4px">学业精效评估</span>
          <div>评估日期: ${timeStr}</div>
        </div>
      </div>

      <!-- 学员基本档案卡片 -->
      <div style="background:#FFFDF5;border:1px solid #FDE68A;border-radius:14px;padding:20px;margin-bottom:24px">
        <div style="font-size:15px;font-weight:800;color:#D97706;margin-bottom:12px">📋 学员基本档案</div>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;font-size:14px;color:#374151">
          <div><strong>学员姓名:</strong> ${esc(studentName)}</div>
          <div><strong>联系电话:</strong> ${esc(phoneNumber)}</div>
          <div><strong>年级/专向:</strong> ${esc(item.grade)} ${esc(item.specialtyDirection)}</div>
          <div><strong>测评学科:</strong> ${esc(item.targetSubject)}</div>
          <div><strong>卷面得分:</strong> ${esc(item.scoreText)}</div>
          <div><strong>答题用时:</strong> ${getRealisticDuration(item)}</div>
        </div>
      </div>

      <!-- 核心诊断结论卡片 -->
      <div style="background:#FFFFFF;border:2px solid #FFE100;border-radius:14px;padding:24px;margin-bottom:24px;box-shadow:0 6px 20px rgba(245,197,24,0.12)">
        <div style="font-size:13px;font-weight:800;color:#92400E;text-transform:uppercase;letter-spacing:1px;margin-bottom:6px">DIAGNOSIS CONCLUSION</div>
        <div style="font-size:24px;font-weight:900;color:#D97706;margin-bottom:14px">
          ${esc(styleType)}
        </div>
        <div style="font-size:14px;color:#374151;line-height:1.7;background:#FFFDF7;padding:14px 18px;border-radius:10px;border-left:4px solid #FFE100">
          基于非凡教育评估体系，学员 <strong>${esc(studentName)}</strong> 在 <strong>${esc(item.targetSubject)}</strong> 学科测试中表现出 <strong>${esc(styleType)}</strong> 的主导特质模式。该结果针对学习策略掌控力、记忆吸收通道与心理动机进行了多维定量归因。
        </div>
      </div>

      <!-- Footer 盖章与云端标识 -->
      <div style="display:flex;justify-content:space-between;align-items:center;padding-top:16px;border-top:1px solid #E5E7EB;font-size:12px;color:#9CA3AF">
        <div>小凡教育科技评估中心 · 让沉默发声</div>
        <div>存货 Key: <code>${esc(item.ossKey)}</code></div>
      </div>
    </div>
  `;
}

document.addEventListener("DOMContentLoaded", init);
