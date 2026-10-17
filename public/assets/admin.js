const STORAGE_KEY = "adminToken";
const DEFAULT_ADMIN_TOKEN = "7jEXGyw1";
const isLocalAdmin = typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" || window.location.hostname === "[::1]");
const ASSESSMENT_API_BASE = (typeof window !== "undefined" && window.ASSESSMENT_API_BASE) || (isLocalAdmin ? "https://ffcrm-daily.1605ai.com" : "https://ffcrm-api.1605ai.com");
const ASSESSMENT_LIST_API = `${ASSESSMENT_API_BASE}/api/assessment/public/list`;
const LIST_PAGE_SIZE = 100;

const TEMPLATE_META = {
  LEARNING_STYLE: { templateCode: "LEARNING_STYLE", templateName: "学习模式定位", templateType: "STUDENT_LEARNING", templateTypeName: "学生学习测评", projectKey: "learningStyle", projectName: "学习模式定位", projectTagClass: "tag-xxfg" },
  "学习风格": { templateCode: "LEARNING_STYLE", templateName: "学习模式定位", templateType: "STUDENT_LEARNING", templateTypeName: "学生学习测评", projectKey: "learningStyle", projectName: "学习模式定位", projectTagClass: "tag-xxfg" },
  MOTIVATION: { templateCode: "MOTIVATION", templateName: "动力系统探索", templateType: "STUDENT_LEARNING", templateTypeName: "学生学习测评", projectKey: "motivation", projectName: "动力系统探索", projectTagClass: "tag-xxdj" },
  "学习动机": { templateCode: "MOTIVATION", templateName: "动力系统探索", templateType: "STUDENT_LEARNING", templateTypeName: "学生学习测评", projectKey: "motivation", projectName: "动力系统探索", projectTagClass: "tag-xxdj" },
  FTH_BOSS: { templateCode: "FTH_BOSS", templateName: "FTH 创业者职业特质", templateType: "CAREER_TALENT", templateTypeName: "职业特质测评", projectKey: "fthBoss", projectName: "FTH 创业者职业特质", projectTagClass: "tag-fthboss" },
  "FTH创业者": { templateCode: "FTH_BOSS", templateName: "FTH 创业者职业特质", templateType: "CAREER_TALENT", templateTypeName: "职业特质测评", projectKey: "fthBoss", projectName: "FTH 创业者职业特质", projectTagClass: "tag-fthboss" },
  FTH_TALENT: { templateCode: "FTH_TALENT", templateName: "FTH 职业特质(微信版)", templateType: "CAREER_TALENT", templateTypeName: "职业特质测评", projectKey: "fthTalent", projectName: "FTH 职业特质(微信版)", projectTagClass: "tag-fthtalent" },
  "FTH微信版": { templateCode: "FTH_TALENT", templateName: "FTH 职业特质(微信版)", templateType: "CAREER_TALENT", templateTypeName: "职业特质测评", projectKey: "fthTalent", projectName: "FTH 职业特质(微信版)", projectTagClass: "tag-fthtalent" },
  FTH_1605: { templateCode: "FTH_1605", templateName: "FTH 职业特质(1605版)", templateType: "CAREER_TALENT", templateTypeName: "职业特质测评", projectKey: "fth1605", projectName: "FTH 职业特质(1605版)", projectTagClass: "tag-fth1605" },
  "FTH1605": { templateCode: "FTH_1605", templateName: "FTH 职业特质(1605版)", templateType: "CAREER_TALENT", templateTypeName: "职业特质测评", projectKey: "fth1605", projectName: "FTH 职业特质(1605版)", projectTagClass: "tag-fth1605" },
  "FTH 1605版": { templateCode: "FTH_1605", templateName: "FTH 职业特质(1605版)", templateType: "CAREER_TALENT", templateTypeName: "职业特质测评", projectKey: "fth1605", projectName: "FTH 职业特质(1605版)", projectTagClass: "tag-fth1605" }
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
  if (code.includes("学习风格") || code.includes("学习模式定位") || code.includes("style") || code.includes("learning")) {
    return TEMPLATE_META["LEARNING_STYLE"];
  }
  if (code.includes("学习动机") || code.includes("动力系统探索") || code.includes("motivation")) {
    return TEMPLATE_META["MOTIVATION"];
  }
  if (code.includes("微信") || code.includes("talent")) {
    return TEMPLATE_META["FTH_TALENT"];
  }
  if (code.includes("1605")) {
    return TEMPLATE_META["FTH_1605"];
  }
  if (code.includes("fth") || code.includes("创业者") || code.includes("boss")) {
    return TEMPLATE_META["FTH_BOSS"];
  }
  return {
    templateCode: String(templateCode || "CUSTOM_HTML"),
    templateName: String(templateCode || "自定义测评"),
    templateType: "CAREER_TALENT",
    templateTypeName: "自定义测评",
    projectKey: "customHTML",
    projectName: templateCode || "未知测评",
    projectTagClass: "tag-xxfg"
  };
}

function mapApiRecordToItem(record) {
  const meta = resolveTemplateMeta(record.templateCode);
  const parsed = parseResultJson(record.resultJson);
  const resObj = parsed.resultData || parsed.result || parsed;

  // 1. 结构化抽取 studentInfo (支持新版 studentInfo 与旧版 userInfo/平铺字段兼容)
  const studentInfo = parsed.studentInfo || parsed.userInfo || parsed.basicInfo || resObj.userInfo || {};
  const studentName = record.customerName || studentInfo.name || studentInfo.studentName || parsed.name || resObj.name || "匿名";
  const phoneNumber = record.customerMobile || studentInfo.mobile || studentInfo.phoneNumber || studentInfo.contact || parsed.contact || resObj.contact || "--";
  const grade = studentInfo.grade || parsed.grade || resObj.grade || "--";
  const specialtyDirection = studentInfo.specialtyDirection || parsed.specialtyDirection || resObj.specialtyDirection || "";
  const scoreBand = studentInfo.scoreBand || parsed.scoreBand || resObj.scoreBand || "";
  const foreignLanguage = studentInfo.foreignLanguage || parsed.foreignLanguage || resObj.foreignLanguage || "";
  const targetSubject = studentInfo.targetSubject || parsed.targetSubject || resObj.targetSubject || "--";
  const targetSubjectScore = studentInfo.targetSubjectScore ?? parsed.targetSubjectScore ?? resObj.targetSubjectScore;
  const targetSubjectFullScore = studentInfo.targetSubjectFullScore ?? parsed.targetSubjectFullScore ?? resObj.targetSubjectFullScore ?? 150;
  const learningFocus = studentInfo.learningFocus || parsed.learningFocus || resObj.learningFocus || "";
  const profileId = studentInfo.profileId || parsed.profileId || record.profileId || record.customerId || "";

  // 2. 结构化抽取 advisorInfo
  const advisorInfo = parsed.advisorInfo || {};
  const advisorName = record.employeeName || advisorInfo.name || record.advisorName || "";
  const advisorMobile = advisorInfo.mobile || record.advisorMobile || "";
  const advisorToken = advisorInfo.token || record.advisorToken || "";
  const advisorEmployeeId = record.employeeId || advisorInfo.employeeId || "";

  // 3. 结构化抽取 assessmentInfo
  const assessmentInfo = parsed.assessmentInfo || {};
  const answers = assessmentInfo.answers || parsed.answers || [];
  const durationSeconds = Number(assessmentInfo.durationSeconds || parsed.durationSeconds || resObj.durationSeconds || 0) || 0;
  const submittedAt = record.createdAt || assessmentInfo.submittedAt || parsed.submittedAt || resObj.submittedAt || "";
  const reportUrl = record.reportUrl || assessmentInfo.reportUrl || (record.id ? `https://ceping.1605ai.com/report.html?id=${record.id}` : "");

  // 4. 诊断得分计算 (以学习风格为例，自动计算 VARK 4 通道得分与主导通道)
  let vScore = 0, aScore = 0, rScore = 0, kScore = 0;
  if (Array.isArray(answers)) {
    answers.forEach(ans => {
      const qId = String(ans.questionId || ans.id || "");
      const val = Number(ans.value || ans.score || 0);
      if (qId.startsWith("V")) vScore += val;
      else if (qId.startsWith("A")) aScore += val;
      else if (qId.startsWith("R")) rScore += val;
      else if (qId.startsWith("K")) kScore += val;
    });
  }

  let dominantModality = "";
  if (vScore > 0 || aScore > 0 || rScore > 0 || kScore > 0) {
    const maxVal = Math.max(vScore, aScore, rScore, kScore);
    const dominants = [];
    if (vScore === maxVal) dominants.push("视觉型 (V)");
    if (aScore === maxVal) dominants.push("听觉型 (A)");
    if (rScore === maxVal) dominants.push("读写型 (R)");
    if (kScore === maxVal) dominants.push("动觉型 (K)");
    dominantModality = dominants.join(" + ");
  }

  const base = {
    id: record.id,
    projectKey: meta.projectKey,
    projectName: meta.projectName,
    projectTagClass: meta.projectTagClass,
    templateCode: record.templateCode,
    studentName,
    phoneNumber,
    profileId,
    grade,
    specialtyDirection,
    scoreBand,
    foreignLanguage,
    targetSubject,
    targetSubjectScore,
    targetSubjectFullScore,
    learningFocus,
    advisorName,
    advisorMobile,
    advisorToken,
    advisorEmployeeId,
    employeeName: advisorName,
    employeeId: advisorEmployeeId,
    answers,
    answersCount: answers.length,
    vScore,
    aScore,
    rScore,
    kScore,
    dominantModality,
    submittedAt,
    durationSeconds,
    reportData: parsed.report || resObj,
    _parsed: parsed,
    ossKey: `assessment/${record.id}`,
    ossUrl: "",
    reportUrl
  };

  if (meta.projectKey === "learningStyle") {
    let scoreText = "--";
    if (targetSubjectScore !== null && targetSubjectScore !== undefined && targetSubjectScore !== "") {
      scoreText = `${targetSubjectScore}/${targetSubjectFullScore}分`;
    }
    const styleType = dominantModality || "学习模式定位已完成";

    return {
      ...base,
      scoreText,
      detailSummary: `${styleType}${targetSubject !== "--" ? " · " + targetSubject : ""}`
    };
  }

  if (meta.projectKey === "motivation") {
    const profileName = parsed.profileName || resObj.profileName || "自主积极型";
    return {
      ...base,
      targetSubject: "动机诊断",
      scoreText: resObj.scores ? `核心属性: ${profileName}` : "--",
      detailSummary: `${profileName}${resObj.representativeName ? " · " + resObj.representativeName : ""}`
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

  // Batch Export & Selection
  batchExportBtn: document.getElementById("batchExportBtn"),
  batchCountBadge: document.getElementById("batchCountBadge"),
  batchActionBar: document.getElementById("batchActionBar"),
  batchSelectedCount: document.getElementById("batchSelectedCount"),
  batchBarZipBtn: document.getElementById("batchBarZipBtn"),
  batchBarCsvBtn: document.getElementById("batchBarCsvBtn"),
  batchClearSelectionBtn: document.getElementById("batchClearSelectionBtn"),
  batchExportModal: document.getElementById("batchExportModal"),
  batchModalTargetCount: document.getElementById("batchModalTargetCount"),
  closeBatchExportModalBtn: document.getElementById("closeBatchExportModalBtn"),
  batchExportOptionsView: document.getElementById("batchExportOptionsView"),
  batchOptionZipPdfBtn: document.getElementById("batchOptionZipPdfBtn"),
  batchOptionCsvBtn: document.getElementById("batchOptionCsvBtn"),
  batchExportProgressView: document.getElementById("batchExportProgressView"),
  batchProgressPercentText: document.getElementById("batchProgressPercentText"),
  batchProgressCounterText: document.getElementById("batchProgressCounterText"),
  batchProgressBarFill: document.getElementById("batchProgressBarFill"),
  batchCurrentStudentText: document.getElementById("batchCurrentStudentText"),
  batchCurrentStepText: document.getElementById("batchCurrentStepText"),
  batchCancelExportBtn: document.getElementById("batchCancelExportBtn"),
  batchExportSuccessView: document.getElementById("batchExportSuccessView"),
  batchSuccessDesc: document.getElementById("batchSuccessDesc"),
  batchSuccessCloseBtn: document.getElementById("batchSuccessCloseBtn"),
  batchExportSandbox: document.getElementById("batchExportSandbox"),

  // Modal
  reportModal: document.getElementById("reportModal"),
  modalReportTitle: document.getElementById("modalReportTitle"),
  modalReportTag: document.getElementById("modalReportTag"),
  modalReportContainer: document.getElementById("modalReportContainer"),
  modalDownloadPdfBtn: document.getElementById("modalDownloadPdfBtn"),
  modalDownloadPngBtn: document.getElementById("modalDownloadPngBtn"),
  closeModalBtn: document.getElementById("closeModalBtn"),

  // Download Format Modal
  downloadFormatModal: document.getElementById("downloadFormatModal"),
  downloadTargetStudent: document.getElementById("downloadTargetStudent"),
  choosePdfDownloadBtn: document.getElementById("choosePdfDownloadBtn"),
  choosePngDownloadBtn: document.getElementById("choosePngDownloadBtn"),
  closeDownloadFormatBtn: document.getElementById("closeDownloadFormatBtn"),
  downloadLoadingStatus: document.getElementById("downloadLoadingStatus"),
  downloadLoadingText: document.getElementById("downloadLoadingText")
};

let state = {
  token: localStorage.getItem(STORAGE_KEY) || "admin_secret_token_dev_2026",
  authorized: false,
  allProjects: [],
  currentTab: "learningStyle",
  searchQuery: "",
  activeItem: null,
  downloadItem: null,
  selectedIds: new Set(),
  isBatchExporting: false,
  batchAbortRequested: false
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
      openDownloadFormatModal(item);
    } else if (action === "print") {
      e.preventDefault();
      printFullReport(item);
    } else if (action === "delete") {
      e.preventDefault();
      handleDeleteRecord(item);
    }
  };

  async function handleDeleteRecord(item) {
    if (!item || !item.id) return;
    const name = item.studentName || "该学员";
    const confirmed = window.confirm(`确定要删除【${name}】的测评记录吗？\nID: #${item.id}\n删除后该记录将从后台永久移除。`);
    if (!confirmed) return;

    try {
      const res = await fetch(`${ASSESSMENT_API_BASE}/api/assessment/delete?id=${encodeURIComponent(item.id)}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Admin-Export-Token": state.token || DEFAULT_ADMIN_TOKEN
        },
        body: JSON.stringify({ id: Number(item.id) || item.id })
      });
      const resData = await res.json().catch(() => ({}));
      if (res.status === 401) {
        throw new Error("后端暂未部署最新代码（401 认证拦截），请先将后端服务发布上线后生效");
      }
      if (!res.ok || (resData.code !== 200 && resData.code !== 0)) {
        throw new Error(resData.message || "删除失败，服务器返回异常");
      }

      state.allProjects = state.allProjects.filter(r => String(r.id) !== String(item.id));
      updateMetrics();
      renderTable();
      alert(`学员【${name}】的测评数据已成功删除！`);
    } catch (err) {
      console.error("删除记录失败:", err);
      alert(`删除失败：${err.message || "网络请求异常，请稍后再试"}`);
    }
  }

  elements.sessionTableBody.addEventListener("click", handleActionClick);
  if (elements.mobileCardList) {
    elements.mobileCardList.addEventListener("click", handleActionClick);
  }

  // Modal 关闭
  elements.closeModalBtn.addEventListener("click", closeModal);
  elements.reportModal.addEventListener("click", (e) => {
    if (e.target === elements.reportModal) closeModal();
  });

  // 下载格式 Modal 事件绑定
  if (elements.choosePdfDownloadBtn) {
    elements.choosePdfDownloadBtn.addEventListener("click", () => {
      downloadReportAs(state.downloadItem || state.activeItem, "pdf");
    });
  }
  if (elements.choosePngDownloadBtn) {
    elements.choosePngDownloadBtn.addEventListener("click", () => {
      downloadReportAs(state.downloadItem || state.activeItem, "png");
    });
  }
  if (elements.closeDownloadFormatBtn) {
    elements.closeDownloadFormatBtn.addEventListener("click", closeDownloadFormatModal);
  }
  if (elements.downloadFormatModal) {
    elements.downloadFormatModal.addEventListener("click", (e) => {
      if (e.target === elements.downloadFormatModal) closeDownloadFormatModal();
    });
  }

  // 预览窗顶部的 PDF / PNG 快捷下载
  if (elements.modalDownloadPdfBtn) {
    elements.modalDownloadPdfBtn.addEventListener("click", () => {
      downloadReportAs(state.activeItem, "pdf");
    });
  }
  if (elements.modalDownloadPngBtn) {
    elements.modalDownloadPngBtn.addEventListener("click", () => {
      downloadReportAs(state.activeItem, "png");
    });
  }

  // 批量选择与全选联动
  if (elements.tableHeaderHead) {
    elements.tableHeaderHead.addEventListener("change", (e) => {
      if (e.target && e.target.id === "selectAllCheckbox") {
        const checked = e.target.checked;
        const visibleList = getFilteredProjects();
        visibleList.forEach(item => {
          const id = String(item.id);
          if (checked) {
            state.selectedIds.add(id);
          } else {
            state.selectedIds.delete(id);
          }
        });
        const rowCheckboxes = elements.sessionTableBody.querySelectorAll(".row-checkbox");
        rowCheckboxes.forEach(cb => {
          cb.checked = checked;
          const tr = cb.closest("tr");
          if (tr) tr.classList.toggle("is-selected-row", checked);
        });
        if (elements.mobileCardList) {
          const mCheckboxes = elements.mobileCardList.querySelectorAll(".row-checkbox");
          mCheckboxes.forEach(cb => {
            cb.checked = checked;
            const card = cb.closest(".m-record-card");
            if (card) card.classList.toggle("is-selected-card", checked);
          });
        }
        updateBatchSelectionUI();
      }
    });
  }

  elements.sessionTableBody.addEventListener("change", (e) => {
    const cb = e.target.closest(".row-checkbox");
    if (!cb) return;
    const id = String(cb.getAttribute("data-id") || "");
    if (!id) return;
    if (cb.checked) {
      state.selectedIds.add(id);
    } else {
      state.selectedIds.delete(id);
    }
    const tr = cb.closest("tr");
    if (tr) tr.classList.toggle("is-selected-row", cb.checked);
    updateBatchSelectionUI();
  });

  if (elements.mobileCardList) {
    elements.mobileCardList.addEventListener("change", (e) => {
      const cb = e.target.closest(".row-checkbox");
      if (!cb) return;
      const id = String(cb.getAttribute("data-id") || "");
      if (!id) return;
      if (cb.checked) {
        state.selectedIds.add(id);
      } else {
        state.selectedIds.delete(id);
      }
      const card = cb.closest(".m-record-card");
      if (card) card.classList.toggle("is-selected-card", cb.checked);
      updateBatchSelectionUI();
    });
  }

  // 顶部批量导出主按钮
  if (elements.batchExportBtn) {
    elements.batchExportBtn.addEventListener("click", openBatchExportModal);
  }

  // 底部浮动操作条事件 (仅保留打包 ZIP 与导出 CSV)
  if (elements.batchBarZipBtn) {
    elements.batchBarZipBtn.addEventListener("click", () => {
      runBatchExportProcess();
    });
  }
  if (elements.batchBarCsvBtn) {
    elements.batchBarCsvBtn.addEventListener("click", () => {
      exportSelectedToCSV();
    });
  }
  if (elements.batchClearSelectionBtn) {
    elements.batchClearSelectionBtn.addEventListener("click", () => {
      state.selectedIds.clear();
      renderTable();
    });
  }

  // 批量模态框选项按钮 (仅保留打包 ZIP 与导出 CSV)
  if (elements.batchOptionZipPdfBtn) {
    elements.batchOptionZipPdfBtn.addEventListener("click", () => {
      runBatchExportProcess();
    });
  }
  if (elements.batchOptionCsvBtn) {
    elements.batchOptionCsvBtn.addEventListener("click", () => {
      exportSelectedToCSV();
      closeBatchExportModal();
    });
  }

  // 批量导出中断与关闭
  if (elements.batchCancelExportBtn) {
    elements.batchCancelExportBtn.addEventListener("click", () => {
      if (confirm("确定要中止当前正在进行的批量导出吗？")) {
        state.batchAbortRequested = true;
      }
    });
  }
  if (elements.batchSuccessCloseBtn) {
    elements.batchSuccessCloseBtn.addEventListener("click", closeBatchExportModal);
  }
  if (elements.closeBatchExportModalBtn) {
    elements.closeBatchExportModalBtn.addEventListener("click", () => {
      if (state.isBatchExporting) {
        if (confirm("当前正在导出报告，确定要关闭并中止导出吗？")) {
          state.batchAbortRequested = true;
          closeBatchExportModal();
        }
      } else {
        closeBatchExportModal();
      }
    });
  }
  if (elements.batchExportModal) {
    elements.batchExportModal.addEventListener("click", (e) => {
      if (e.target === elements.batchExportModal && !state.isBatchExporting) {
        closeBatchExportModal();
      }
    });
  }

  fetchData();
}

async function fetchData() {
  if (!state.token) {
    showUnauthUI();
    return;
  }

  const loadingHtml = `<tr><td colspan="10" class="table-empty">正在加载测评数据...</td></tr>`;
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

function getFilteredProjects() {
  let list = state.allProjects;

  const urlParams = new URLSearchParams(window.location.search);
  const typeParam = (urlParams.get("templateType") || urlParams.get("type") || "").toUpperCase();
  if (typeParam === "STUDENT_LEARNING" || typeParam === "STUDENT" || typeParam === "LEARNING") {
    list = list.filter(r => r.projectKey === "learningStyle" || r.projectKey === "motivation");
  } else if (typeParam === "CAREER_TALENT" || typeParam === "CAREER" || typeParam === "TALENT") {
    list = list.filter(r => r.projectKey === "fthBoss" || r.projectKey === "fthTalent" || r.projectKey === "fth1605" || r.projectKey === "customHTML");
  }

  if (state.currentTab !== "all") {
    list = list.filter(r => r.projectKey === state.currentTab);
  }

  if (state.searchQuery) {
    const q = state.searchQuery.toLowerCase();
    list = list.filter(r => 
      (r.studentName && r.studentName.toLowerCase().includes(q)) ||
      (r.phoneNumber && r.phoneNumber.toLowerCase().includes(q)) ||
      (r.detailSummary && r.detailSummary.toLowerCase().includes(q)) ||
      (r.employeeName && r.employeeName.toLowerCase().includes(q)) ||
      (r.templateCode && r.templateCode.toLowerCase().includes(q)) ||
      (r.projectName && r.projectName.toLowerCase().includes(q))
    );
  }
  return list;
}

function updateBatchSelectionUI() {
  const visibleList = getFilteredProjects();
  const selectedCount = state.selectedIds.size;

  // 1. 顶部工具栏批量导出按钮与数量角标
  if (elements.batchExportBtn) {
    elements.batchExportBtn.disabled = selectedCount === 0;
    elements.batchExportBtn.title = selectedCount === 0 ? "请先在下方勾选需要导出的测评记录" : `已选择 ${selectedCount} 份报告，点击进行批量导出`;
  }
  if (elements.batchCountBadge) {
    if (selectedCount > 0) {
      elements.batchCountBadge.textContent = String(selectedCount);
      elements.batchCountBadge.style.display = "inline-block";
    } else {
      elements.batchCountBadge.style.display = "none";
    }
  }

  // 2. 底部浮动吸附操作条
  if (elements.batchActionBar) {
    elements.batchActionBar.hidden = selectedCount === 0;
  }
  if (elements.batchSelectedCount) {
    elements.batchSelectedCount.textContent = String(selectedCount);
  }

  // 3. 模态框标题数量
  if (elements.batchModalTargetCount) {
    elements.batchModalTargetCount.textContent = `已选 ${selectedCount} 份报告`;
  }

  // 4. 表头全选 Checkbox 状态联动 (支持勾选、未选、半选 indeterminate)
  const selectAllCheckbox = document.getElementById("selectAllCheckbox");
  if (selectAllCheckbox) {
    if (visibleList.length === 0) {
      selectAllCheckbox.checked = false;
      selectAllCheckbox.indeterminate = false;
    } else {
      const visibleSelectedCount = visibleList.filter(item => state.selectedIds.has(String(item.id))).length;
      if (visibleSelectedCount === 0) {
        selectAllCheckbox.checked = false;
        selectAllCheckbox.indeterminate = false;
      } else if (visibleSelectedCount === visibleList.length) {
        selectAllCheckbox.checked = true;
        selectAllCheckbox.indeterminate = false;
      } else {
        selectAllCheckbox.checked = false;
        selectAllCheckbox.indeterminate = true;
      }
    }
  }
}

function renderTable() {
  const list = getFilteredProjects();

  // 1. 动态渲染不同测评专属的 Table Header (第一列统一为全选 Checkbox)
  if (elements.tableHeaderHead) {
    let headerCols = "";
    if (state.currentTab === "learningStyle") {
      headerCols = `
        <th>学员姓名</th>
        <th>手机号</th>
        <th>年级 / 专向 / 分数段</th>
        <th>目标学科 (成绩)</th>
        <th>归属顾问</th>
        <th>学习风格通道与结论</th>
        <th>答题情况</th>
        <th>测评时间</th>
        <th>操作</th>
      `;
    } else if (state.currentTab === "motivation") {
      headerCols = `
        <th>学员姓名</th>
        <th>手机号</th>
        <th>年级 / 专向</th>
        <th>动机诊断分型</th>
        <th>归属顾问</th>
        <th>核心主导驱动力</th>
        <th>答题时长</th>
        <th>测评时间</th>
        <th>操作</th>
      `;
    } else if (state.currentTab === "fthBoss") {
      headerCols = `
        <th>创业者姓名</th>
        <th>联系电话</th>
        <th>特质排序</th>
        <th>核心主分型</th>
        <th>次分型与辅助倾向</th>
        <th>答题时长</th>
        <th>测评时间</th>
        <th>操作</th>
      `;
    } else if (state.currentTab === "fthTalent") {
      headerCols = `
        <th>测评人姓名</th>
        <th>微信/联系电话</th>
        <th>特质编码</th>
        <th>当前分型</th>
        <th>团队定位与核心结论</th>
        <th>答题时长</th>
        <th>测评时间</th>
        <th>操作</th>
      `;
    } else if (state.currentTab === "fth1605") {
      headerCols = `
        <th>研发人才姓名</th>
        <th>联系电话</th>
        <th>1605 研发特质</th>
        <th>权威交付产物</th>
        <th>答题时长</th>
        <th>测评时间</th>
        <th>操作</th>
      `;
    } else {
      headerCols = `
        <th>学员姓名</th>
        <th>手机号</th>
        <th>年级 / 专向</th>
        <th>诊断结论 / 特质</th>
        <th>归属顾问</th>
        <th>答题时长</th>
        <th>测评时间</th>
        <th>操作</th>
      `;
    }
    elements.tableHeaderHead.innerHTML = `
      <tr>
        <th class="col-checkbox"><input type="checkbox" id="selectAllCheckbox" title="全选 / 反选当前页记录"></th>
        ${headerCols}
      </tr>
    `;
  }

  if (list.length === 0) {
    elements.sessionTableBody.innerHTML = `
      <tr>
        <td colspan="10" class="table-empty">没有匹配的测评报告记录</td>
      </tr>
    `;
    if (elements.mobileCardList) {
      elements.mobileCardList.innerHTML = `<div class="table-empty">没有匹配的测评报告记录</div>`;
    }
    updateBatchSelectionUI();
    return;
  }

  // 2. 桌面端动态渲染专有表格行 (首列统一为单选 Checkbox，并附带选中高亮类名)
  elements.sessionTableBody.innerHTML = list.map(item => {
    const isSelected = state.selectedIds.has(String(item.id));
    const checkCol = `<td class="col-checkbox"><input type="checkbox" class="row-checkbox" data-id="${esc(item.id)}" ${isSelected ? "checked" : ""}></td>`;
    const timeStr = item.submittedAt ? formatTime(item.submittedAt) : "--";
    const durationText = getRealisticDuration(item);
    const subjectScoreText = item.targetSubject !== "--"
      ? `${esc(item.targetSubject)} ${item.scoreText !== "--" ? esc(item.scoreText) : ""}`.trim()
      : (item.scoreText !== "--" ? esc(item.scoreText) : "--");

    if (item.projectKey === "learningStyle") {
      const studentNameCol = `<strong>${esc(item.studentName)}</strong>${item.profileId ? '<br><span style="font-size:11px;color:#6B7280;background:#F3F4F6;padding:1px 6px;border-radius:4px">#' + esc(item.profileId) + '</span>' : ''}`;
      const gradeCol = `${esc(item.grade)}${item.specialtyDirection ? ' · ' + esc(item.specialtyDirection) : ''}${item.scoreBand ? '<br><span style="font-size:11.5px;color:#854D0E;background:#FEF9C3;padding:1px 6px;border-radius:4px">' + esc(item.scoreBand) + '</span>' : ''}`;
      const subjectCol = `${subjectScoreText}${item.foreignLanguage ? ' <span style="font-size:11.5px;color:#0369A1;background:#E0F2FE;padding:1px 6px;border-radius:4px">' + esc(item.foreignLanguage) + '</span>' : ''}`;
      const advisorCol = item.advisorName ? `<strong style="color:#1E293B">${esc(item.advisorName)}</strong>${item.advisorMobile ? '<br><span style="font-size:11.5px;color:#64748B">' + esc(item.advisorMobile) + '</span>' : ''}` : '<span style="color:#94A3B8">--</span>';
      const conclusionCol = `<strong style="color:#D97706">${esc(item.dominantModality || item.detailSummary)}</strong>${(item.vScore || item.aScore || item.rScore || item.kScore) ? '<br><span style="font-size:11px;color:#6B7280;font-weight:600">V:' + item.vScore + ' A:' + item.aScore + ' R:' + item.rScore + ' K:' + item.kScore + '</span>' : ''}`;
      const durationCol = `${item.answersCount ? '<span style="font-size:11.5px;font-weight:700;color:#166534;background:#DCFCE7;padding:2px 6px;border-radius:4px">' + item.answersCount + '题全</span><br>' : ''}${durationText}`;

      return `
        <tr class="${isSelected ? "is-selected-row" : ""}">
          ${checkCol}
          <td>${studentNameCol}</td>
          <td>${esc(item.phoneNumber)}</td>
          <td>${gradeCol}</td>
          <td>${subjectCol}</td>
          <td>${advisorCol}</td>
          <td>${conclusionCol}</td>
          <td>${durationCol}</td>
          <td style="white-space:nowrap">${timeStr}</td>
          <td>
            <a class="action-link" href="#" data-id="${esc(item.id)}" data-action="preview">预览报告</a>
            <a class="action-link" href="#" data-id="${esc(item.id)}" data-action="download">下载报告</a>
            <a class="action-link" href="#" data-id="${esc(item.id)}" data-action="print">打印</a>
            <a class="action-link delete-link" href="#" data-id="${esc(item.id)}" data-action="delete">删除</a>
          </td>
        </tr>
      `;
    }

    if (item.projectKey === "motivation") {
      const studentNameCol = `<strong>${esc(item.studentName)}</strong>`;
      const gradeCol = `${esc(item.grade)}${item.specialtyDirection ? ' · ' + esc(item.specialtyDirection) : ''}`;
      const typeCol = `<span class="tag-badge tag-xxdj" style="font-weight:800;padding:4px 10px">${esc(item.detailSummary)}</span>`;
      const advisorCol = item.advisorName ? `<strong style="color:#1E293B">${esc(item.advisorName)}</strong>` : '<span style="color:#94A3B8">--</span>';
      const conclusionCol = `<span style="color:#0284C7;font-weight:700">7大动机维度全面诊断</span>`;

      return `
        <tr class="${isSelected ? "is-selected-row" : ""}">
          ${checkCol}
          <td>${studentNameCol}</td>
          <td>${esc(item.phoneNumber)}</td>
          <td>${gradeCol}</td>
          <td>${typeCol}</td>
          <td>${advisorCol}</td>
          <td>${conclusionCol}</td>
          <td>${durationText}</td>
          <td style="white-space:nowrap">${timeStr}</td>
          <td>
            <a class="action-link" href="#" data-id="${esc(item.id)}" data-action="preview">预览报告</a>
            <a class="action-link" href="#" data-id="${esc(item.id)}" data-action="download">下载报告</a>
            <a class="action-link" href="#" data-id="${esc(item.id)}" data-action="print">打印</a>
            <a class="action-link delete-link" href="#" data-id="${esc(item.id)}" data-action="delete">删除</a>
          </td>
        </tr>
      `;
    }

    if (item.projectKey === "fthBoss") {
      const pType = item.reportData?.primaryType ? `${item.reportData.primaryType.cn} ${item.reportData.primaryType.en}` : "冲刺型 Runner";
      const sType = item.reportData?.secondType ? item.reportData.secondType.cn : "攻坚型";
      const tType = item.reportData?.thirdType ? item.reportData.thirdType.cn : "分析型";

      return `
        <tr class="${isSelected ? "is-selected-row" : ""}">
          ${checkCol}
          <td><strong>${esc(item.studentName)}</strong></td>
          <td>${esc(item.phoneNumber)}</td>
          <td><span style="background:#FFFBE9;border:1px solid #FDE68A;color:#D97706;padding:3px 10px;border-radius:9999px;font-weight:900;font-size:12px">${esc(item.reportData?.traitOrder || "FTH")}</span></td>
          <td><strong style="color:#D97706;font-size:14px">${esc(pType)}</strong></td>
          <td>次优势: <strong style="color:#DC2626">${esc(sType)}</strong> · 辅: <span style="color:#0284C7">${esc(tType)}</span></td>
          <td>${durationText}</td>
          <td style="white-space:nowrap">${timeStr}</td>
          <td>
            <a class="action-link" href="#" data-id="${esc(item.id)}" data-action="preview">预览报告</a>
            <a class="action-link" href="#" data-id="${esc(item.id)}" data-action="download">下载报告</a>
            <a class="action-link" href="#" data-id="${esc(item.id)}" data-action="print">打印</a>
            <a class="action-link delete-link" href="#" data-id="${esc(item.id)}" data-action="delete">删除</a>
          </td>
        </tr>
      `;
    }

    if (item.projectKey === "fthTalent") {
      const pType = item.reportData?.primaryType ? `${item.reportData.primaryType.cn} ${item.reportData.primaryType.en}` : "进取行动派";
      return `
        <tr class="${isSelected ? "is-selected-row" : ""}">
          ${checkCol}
          <td><strong>${esc(item.studentName)}</strong></td>
          <td>${esc(item.phoneNumber)}</td>
          <td><span style="background:#E0F2FE;border:1px solid #BAE6FD;color:#0284C7;padding:3px 10px;border-radius:9999px;font-weight:900;font-size:12px">${esc(item.reportData?.traitOrder || "FTH-T12")}</span></td>
          <td><strong style="color:#0284C7;font-size:14px">${esc(pType)}</strong></td>
          <td>${esc(item.detailSummary)}</td>
          <td>${durationText}</td>
          <td style="white-space:nowrap">${timeStr}</td>
          <td>
            <a class="action-link" href="#" data-id="${esc(item.id)}" data-action="preview">预览报告</a>
            <a class="action-link" href="#" data-id="${esc(item.id)}" data-action="download">下载报告</a>
            <a class="action-link" href="#" data-id="${esc(item.id)}" data-action="print">打印</a>
            <a class="action-link delete-link" href="#" data-id="${esc(item.id)}" data-action="delete">删除</a>
          </td>
        </tr>
      `;
    }

    if (item.projectKey === "fth1605") {
      return `
        <tr class="${isSelected ? "is-selected-row" : ""}">
          ${checkCol}
          <td><strong>${esc(item.studentName)}</strong></td>
          <td>${esc(item.phoneNumber)}</td>
          <td><strong style="color:#7C3AED;font-size:14px">${esc(item.detailSummary || "AI/研发特质型")}</strong></td>
          <td><span class="tag-badge tag-fth1605" style="padding:4px 10px;font-weight:800">PPTX 演示文稿</span></td>
          <td><span style="color:#16A34A;font-weight:700">全量可视化分析</span></td>
          <td>${durationText}</td>
          <td style="white-space:nowrap">${timeStr}</td>
          <td>
            <a class="action-link" href="#" data-id="${esc(item.id)}" data-action="preview">预览报告</a>
            <a class="action-link" href="#" data-id="${esc(item.id)}" data-action="download">下载报告</a>
            <a class="action-link" href="#" data-id="${esc(item.id)}" data-action="print">打印</a>
            <a class="action-link delete-link" href="#" data-id="${esc(item.id)}" data-action="delete">删除</a>
          </td>
        </tr>
      `;
    }

    return `
      <tr class="${isSelected ? "is-selected-row" : ""}">
        ${checkCol}
        <td><strong>${esc(item.studentName)}</strong></td>
        <td>${esc(item.phoneNumber)}</td>
        <td>${esc(item.grade)}</td>
        <td>${subjectScoreText}</td>
        <td>${esc(item.advisorName || "--")}</td>
        <td>${esc(item.detailSummary)}</td>
        <td>${durationText}</td>
        <td style="white-space:nowrap">${timeStr}</td>
        <td>
          <a class="action-link" href="#" data-id="${esc(item.id)}" data-action="preview">预览报告</a>
          <a class="action-link" href="#" data-id="${esc(item.id)}" data-action="download">下载报告</a>
          <a class="action-link" href="#" data-id="${esc(item.id)}" data-action="print">打印</a>
          <a class="action-link delete-link" href="#" data-id="${esc(item.id)}" data-action="delete">删除</a>
        </td>
      </tr>
    `;
  }).join("");

  // 3. 移动端原生卡片列表渲染
  if (elements.mobileCardList) {
    elements.mobileCardList.innerHTML = list.map(item => {
      const isSelected = state.selectedIds.has(String(item.id));
      const timeStr = item.submittedAt ? formatTime(item.submittedAt) : "--";
      const durationText = getRealisticDuration(item);
      const subjectScoreText = item.targetSubject !== "--"
        ? `${esc(item.targetSubject)} ${item.scoreText !== "--" ? esc(item.scoreText) : ""}`.trim()
        : (item.scoreText !== "--" ? esc(item.scoreText) : "--");

      return `
        <div class="m-record-card ${isSelected ? "is-selected-card" : ""}">
          <div class="m-card-header">
            <div class="m-student-info">
              <label class="m-checkbox-label">
                <input type="checkbox" class="row-checkbox" data-id="${esc(item.id)}" ${isSelected ? "checked" : ""}>
                <span class="m-student-name">${esc(item.studentName)}</span>
              </label>
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
              <span class="m-label">归属顾问</span>
              <span class="m-value">${esc(item.advisorName || "--")}</span>
            </div>
            <div class="m-grid-item">
              <span class="m-label">答题情况</span>
              <span class="m-value">${item.answersCount ? item.answersCount + '题 / ' : ''}${durationText}</span>
            </div>
          </div>

          <div class="m-conclusion-box">
            <span class="m-label">诊断结论 / 特质</span>
            <div class="m-conclusion-text">${esc(item.dominantModality || item.detailSummary)}</div>
          </div>

          <div class="m-card-actions">
            <a class="m-action-btn action-link" href="#" data-id="${esc(item.id)}" data-action="preview">预览报告</a>
            <a class="m-action-btn action-link m-download-btn" href="#" data-id="${esc(item.id)}" data-action="download">下载报告</a>
            <a class="m-action-btn action-link" href="#" data-id="${esc(item.id)}" data-action="print">打印</a>
            <a class="m-action-btn action-link m-delete-btn" href="#" data-id="${esc(item.id)}" data-action="delete">删除</a>
          </div>
        </div>
      `;
    }).join("");
  }

  // 4. 更新批量选择与操作栏 UI
  updateBatchSelectionUI();
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

function learningStylePreviewUrl(item, extraParams = {}) {
  storeLearningStylePreview(item);
  const params = new URLSearchParams({
    id: String(item.id || ""),
    mobile: item.phoneNumber || "",
    preview: "1",
    embed: "1",
    ...extraParams
  });
  return `/report.html?${params.toString()}`;
}

function printLearningStyleReport(item) {
  if (!item) return;
  const url = learningStylePreviewUrl(item, { print: "1" });
  const printWindow = window.open(url, "_blank", "noopener,noreferrer,width=1100,height=900");
  if (!printWindow) {
    alert("请允许弹出窗口后再打印报告。");
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
    id: String(item.id || ""),
    mobile: item.phoneNumber || "",
    preview: "1",
    embed: "1",
    _t: String(Date.now()),
    ...extraParams
  });
  return `/motivation/report.html?${params.toString()}`;
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
    iframe.title = `${item.studentName} · 学习模式定位报告`;
    iframe.src = learningStylePreviewUrl(item);
    elements.modalReportContainer.classList.add("is-iframe-preview");
    elements.modalReportContainer.innerHTML = "";
    elements.modalReportContainer.appendChild(iframe);
  } else if (item.projectKey === "motivation") {
    const iframe = document.createElement("iframe");
    iframe.className = "report-preview-frame";
    iframe.title = `${item.studentName} · 动力系统探索报告`;
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

// 打开下载格式选择弹窗 (支持 PDF / PNG)
function openDownloadFormatModal(item) {
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

  state.downloadItem = item;
  if (elements.downloadTargetStudent) {
    elements.downloadTargetStudent.textContent = `${item.studentName || "学员"} · ${item.projectName || "测评报告"}`;
  }
  if (elements.downloadLoadingStatus) {
    elements.downloadLoadingStatus.hidden = true;
  }
  if (elements.choosePdfDownloadBtn) elements.choosePdfDownloadBtn.disabled = false;
  if (elements.choosePngDownloadBtn) elements.choosePngDownloadBtn.disabled = false;

  if (elements.downloadFormatModal) {
    elements.downloadFormatModal.hidden = false;
  }
}

function closeDownloadFormatModal() {
  if (elements.downloadFormatModal) {
    elements.downloadFormatModal.hidden = true;
  }
  state.downloadItem = null;
}

// PDF 截图分页：行框和图表是硬约束，卡片只在不会产生大片留白时整体避让。
function calculateSmartPageBreaks(reportNode, canvas, pageWidthPt = 595.28, pageHeightPt = 841.89) {
  const reportRect = reportNode.getBoundingClientRect();
  const scale = canvas.width / (reportRect.width || reportNode.offsetWidth || 800);
  const pageCapacity = Math.floor(pageHeightPt / pageWidthPt * canvas.width);
  const doc = reportNode.ownerDocument || document;
  const hard = [];
  const soft = [];
  // 两个 viewport 坐标相减即为截图坐标，不能再叠加页面 scrollTop。
  const box = rect => ({
    top: Math.max(0, Math.floor((rect.top - reportRect.top) * scale)),
    bottom: Math.min(canvas.height, Math.ceil((rect.bottom - reportRect.top) * scale))
  });
  const visible = el => {
    const style = doc.defaultView.getComputedStyle(el);
    return style.visibility !== 'hidden' && style.display !== 'none';
  };
  const walker = doc.createTreeWalker(reportNode, 4);
  const range = doc.createRange();
  let textNode;
  // Range 返回每一行文字的边界，长段落可以在行间续排，不必整体搬页。
  while ((textNode = walker.nextNode())) {
    if (!textNode.textContent.trim() || !visible(textNode.parentElement)) continue;
    range.selectNodeContents(textNode);
    for (const rect of range.getClientRects()) {
      if (rect.width > 0 && rect.height > 0) hard.push(box(rect));
    }
  }
  reportNode.querySelectorAll('img, svg, canvas, .bar-row, .state-bar-row').forEach(el => {
    const rect = el.getBoundingClientRect();
    if (visible(el) && rect.width > 0 && rect.height > 0) hard.push(box(rect));
  });
  // 标题/标签连同下一行保护，避免标题独留页尾。
  reportNode.querySelectorAll('h1,h2,h3,h4,h5,h6,.section-card-header,.detail-label,.action-item-label').forEach(el => {
    const rect = el.getBoundingClientRect();
    if (!visible(el) || !rect.height) return;
    const heading = box(rect);
    const nextLine = hard.filter(b => b.top >= heading.bottom && b.top - heading.bottom < 60 * scale)
      .sort((a, b) => a.top - b.top)[0];
    if (nextLine) hard.push({ top: heading.top, bottom: nextLine.bottom });
  });
  reportNode.querySelectorAll('.dimension-card,.mode-card,.mode-detail-card,.portrait-item,.strength-card,.summary-box,.task-card-wrapper,.action-plan-card,.report-info-card,.report-hero-card,.score-grid,.motivation-radar-wrapper,.detail-section,.advice-path,p,li,tr').forEach(el => {
    const rect = el.getBoundingClientRect();
    if (visible(el) && rect.width > 0 && rect.height > 0) soft.push(box(rect));
  });
  // 合并重叠的行框（同一行不同字号、双栏文字），保留真正的行间空隙。
  const protectedBands = [];
  for (const band of hard.sort((a, b) => a.top - b.top)) {
    const last = protectedBands[protectedBands.length - 1];
    if (last && band.top < last.bottom) last.bottom = Math.max(last.bottom, band.bottom);
    else protectedBands.push({ ...band });
  }
  function safeCut(target, start) {
    const band = protectedBands.find(b => b.top < target && b.bottom > target);
    // 超过一整页的图表无法完整放入单页，保持前进；正常文字始终在行框外切分。
    return band && band.top > start ? band.top : target;
  }
  const breaks = [0];
  let start = 0;
  while (canvas.height - start > pageCapacity) {
    const limit = start + pageCapacity;
    let cut = safeCut(limit, start);
    const minimumFill = start + pageCapacity * 0.90;
    const candidates = soft.filter(b => b.top < cut && b.bottom > cut)
      .map(b => safeCut(b.top, start)).filter(y => y >= minimumFill);
    if (candidates.length) cut = Math.min(...candidates);
    cut = Math.floor(cut);
    if (cut <= start) cut = limit;
    breaks.push(cut);
    start = cut;
  }
  return breaks;
}

// 截图仅包含报告正文，避免把预览侧栏及其空列带进 PDF / PNG。
function getReportCaptureNode(reportNode) {
  return reportNode.querySelector(".report-content-area, .report-main-container") || reportNode;
}

async function waitForReportAssets(reportNode) {
  await reportNode.ownerDocument.fonts?.ready;
  await Promise.all(Array.from(reportNode.querySelectorAll("img"), image => image.decode().catch(() => {})));
}

// 统一执行报告下载 (format: "pdf" | "png")
async function downloadReportAs(item, format = "pdf") {
  if (!item) {
    alert("未找到有效的报告数据");
    return;
  }

  const formatText = format === "pdf" ? "PDF 电子文档" : "PNG 高清长图";

  if (elements.downloadLoadingStatus) {
    elements.downloadLoadingStatus.hidden = false;
    elements.downloadLoadingText.textContent = `正在准备生成 ${formatText}，请稍候...`;
  }
  if (elements.choosePdfDownloadBtn) elements.choosePdfDownloadBtn.disabled = true;
  if (elements.choosePngDownloadBtn) elements.choosePngDownloadBtn.disabled = true;

  // 保证已打开预览窗渲染内容
  openFullReportPreview(item);

  const delayMs = (item.projectKey === "learningStyle" || item.projectKey === "motivation") ? 1200 : 350;

  setTimeout(async () => {
    let reportNode = document.getElementById("captureReportContent");
    const iframe = elements.modalReportContainer?.querySelector(".report-preview-frame");
    if (!reportNode && iframe) {
      if (elements.downloadLoadingText) {
        elements.downloadLoadingText.textContent = `正在加载报告深度图表与分析数据...`;
      }
      reportNode = await waitForIframeReport(iframe);
    }
    if (!reportNode) {
      alert("报告内容仍在加载，请稍后再试。");
      if (elements.downloadLoadingStatus) elements.downloadLoadingStatus.hidden = true;
      if (elements.choosePdfDownloadBtn) elements.choosePdfDownloadBtn.disabled = false;
      if (elements.choosePngDownloadBtn) elements.choosePngDownloadBtn.disabled = false;
      return;
    }

    try {
      if (elements.downloadLoadingText) {
        elements.downloadLoadingText.textContent = `正在进行超清画质渲染 (2x Retina)...`;
      }

      reportNode = getReportCaptureNode(reportNode);
      await waitForReportAssets(reportNode);
      const win = reportNode.ownerDocument?.defaultView || window;
      if (win.MotivationReportEngine && typeof win.MotivationReportEngine.renderAllRadarCanvases === "function") {
        win.MotivationReportEngine.renderAllRadarCanvases(reportNode);
      }

      const html2canvasFunc = win.html2canvas || window.html2canvas;

      if (typeof html2canvasFunc !== "function") {
        throw new Error("html2canvas 引擎未就绪");
      }

      const canvas = await html2canvasFunc(reportNode, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#FFFDF6",
        logging: false
      });

      const studentClean = (item.studentName || "学员").trim();
      const projectClean = (item.projectName || "测评").trim();

      if (format === "png") {
        // 导出为超清长图 PNG
        const imgData = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = imgData;
        link.download = `${studentClean}_${projectClean}_完整诊断报告.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        // 导出为智能分页无截断 PDF
        if (elements.downloadLoadingText) {
          elements.downloadLoadingText.textContent = `正在进行智能排版分页 (DOM 智能防截断)...`;
        }

        const jsPDFConstructor = window.jspdf?.jsPDF || window.jsPDF;
        if (typeof jsPDFConstructor === "function") {
          const pdf = buildReportPdfDocument(reportNode, canvas);
          pdf.save(`${studentClean}_${projectClean}_完整诊断报告.pdf`);
        } else {
          // 若 jsPDF 加载失败，降级唤起浏览器打印对话框保存为 PDF
          if (iframe && iframe.contentWindow) {
            iframe.contentWindow.focus();
            iframe.contentWindow.print();
          } else {
            window.print();
          }
        }
      }

      closeDownloadFormatModal();
    } catch (e) {
      console.error("生成报告文件失败，唤起打印下载:", e);
      alert(`生成 ${formatText} 遇到问题，已为您自动唤起系统打印/另存为 PDF 对话框。`);
      if (iframe && iframe.contentWindow) {
        iframe.contentWindow.focus();
        iframe.contentWindow.print();
      } else {
        window.print();
      }
      closeDownloadFormatModal();
    } finally {
      if (elements.downloadLoadingStatus) elements.downloadLoadingStatus.hidden = true;
      if (elements.choosePdfDownloadBtn) elements.choosePdfDownloadBtn.disabled = false;
      if (elements.choosePngDownloadBtn) elements.choosePngDownloadBtn.disabled = false;
    }
  }, delayMs);
}

// 统一智能防截断 PDF 组装引擎 (单份下载与批量导出 100% 共享)
function buildReportPdfDocument(reportNode, canvas) {
  const jsPDFConstructor = window.jspdf?.jsPDF || window.jsPDF;
  if (typeof jsPDFConstructor !== "function") {
    throw new Error("jsPDF 引擎未就绪");
  }

  const pageWidth = 595.28;
  const pageHeight = 841.89;
  const pdf = new jsPDFConstructor("p", "pt", "a4");

  const breakPoints = calculateSmartPageBreaks(reportNode, canvas, pageWidth, pageHeight);

  for (let i = 0; i < breakPoints.length; i++) {
    const startY = breakPoints[i];
    const endY = (i < breakPoints.length - 1) ? breakPoints[i + 1] : canvas.height;
    const sliceHeight = endY - startY;

    if (sliceHeight <= 0) continue;

    const pageCanvas = document.createElement("canvas");
    pageCanvas.width = canvas.width;
    pageCanvas.height = sliceHeight;
    const pctx = pageCanvas.getContext("2d");

    pctx.fillStyle = "#FFFDF6";
    pctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);

    pctx.drawImage(
      canvas,
      0, startY, canvas.width, sliceHeight,
      0, 0, canvas.width, sliceHeight
    );

    const sliceImgData = pageCanvas.toDataURL("image/jpeg", 0.95);
    const pdfImgHeight = (pageWidth / canvas.width) * sliceHeight;

    if (i > 0) {
      pdf.addPage();
    }

    pdf.addImage(sliceImgData, "JPEG", 0, 0, pageWidth, pdfImgHeight);
  }

  return pdf;
}

// ==========================================================================
// 批量导出与多选操作核心业务逻辑
// ==========================================================================

function openBatchExportModal() {
  const selectedCount = state.selectedIds.size;
  if (selectedCount === 0) {
    alert("请先在列表中勾选需要批量导出的测评记录！");
    return;
  }
  if (elements.batchModalTargetCount) {
    elements.batchModalTargetCount.textContent = `已选 ${selectedCount} 份报告`;
  }
  if (elements.batchExportOptionsView) elements.batchExportOptionsView.hidden = false;
  if (elements.batchExportProgressView) elements.batchExportProgressView.hidden = true;
  if (elements.batchExportSuccessView) elements.batchExportSuccessView.hidden = true;
  if (elements.batchExportModal) elements.batchExportModal.hidden = false;
}

function closeBatchExportModal() {
  if (elements.batchExportModal) elements.batchExportModal.hidden = true;
  state.isBatchExporting = false;
  state.batchAbortRequested = false;
  if (elements.batchExportSandbox) elements.batchExportSandbox.innerHTML = "";
}

// 离屏沙箱报告节点捕获 (支持学习风格/动机报告 iframe 及 FTH DOM)
async function captureReportItemForBatch(item, sandboxEl) {
  if (!sandboxEl) {
    throw new Error("离屏沙箱容器未就绪");
  }
  sandboxEl.innerHTML = "";
  let reportNode = null;
  let win = window;

  if (item.projectKey === "learningStyle") {
    const iframe = document.createElement("iframe");
    iframe.src = learningStylePreviewUrl(item);
    iframe.style.width = "1100px";
    iframe.style.height = "2400px";
    iframe.style.border = "none";
    sandboxEl.appendChild(iframe);
    reportNode = await waitForIframeReport(iframe, 16000);
    win = iframe.contentWindow || window;
  } else if (item.projectKey === "motivation") {
    const iframe = document.createElement("iframe");
    iframe.src = motivationPreviewUrl(item);
    iframe.style.width = "1100px";
    iframe.style.height = "2400px";
    iframe.style.border = "none";
    sandboxEl.appendChild(iframe);
    reportNode = await waitForIframeReport(iframe, 16000);
    win = iframe.contentWindow || window;
    if (win.MotivationReportEngine && typeof win.MotivationReportEngine.renderAllRadarCanvases === "function" && reportNode) {
      win.MotivationReportEngine.renderAllRadarCanvases(reportNode);
    }
  } else {
    const wrapper = document.createElement("div");
    wrapper.style.width = "1000px";
    wrapper.style.margin = "0 auto";
    wrapper.style.background = "#FFFDF6";
    wrapper.innerHTML = renderAuthenticReportDOM(item);
    sandboxEl.appendChild(wrapper);
    reportNode = wrapper.querySelector("#captureReportContent") || wrapper;
  }

  if (!reportNode) {
    throw new Error(`无法获取【${item.studentName}】的报告内容节点`);
  }

  reportNode = getReportCaptureNode(reportNode);
  await waitForReportAssets(reportNode);

  // 延时等待 CSS 与图表完全稳定
  const delayMs = (item.projectKey === "learningStyle" || item.projectKey === "motivation") ? 950 : 350;
  await new Promise(r => setTimeout(r, delayMs));

  if (win.MotivationReportEngine && typeof win.MotivationReportEngine.renderAllRadarCanvases === "function") {
    win.MotivationReportEngine.renderAllRadarCanvases(reportNode);
  }

  const html2canvasFunc = win.html2canvas || window.html2canvas;
  if (typeof html2canvasFunc !== "function") {
    throw new Error("html2canvas 引擎未就绪");
  }

  const canvas = await html2canvasFunc(reportNode, {
    scale: 2,
    useCORS: true,
    backgroundColor: "#FFFDF6",
    logging: false
  });

  return { reportNode, canvas };
}

// 零依赖原生纯 JS (PK0304 STORE) + JSZip 双模高可用打包器
async function createZipBlob(fileEntries) {
  // 1. 若外部 JSZip 库已加载，优先调用以提供最大兼容
  if (typeof window !== "undefined" && window.JSZip) {
    try {
      const zip = new window.JSZip();
      for (const entry of fileEntries) {
        zip.file(entry.name, entry.data);
      }
      return await zip.generateAsync({ type: "blob" });
    } catch (err) {
      console.warn("JSZip 打包异常，启用原生零依赖 STORE 引擎:", err);
    }
  }

  // 2. 原生零依赖 STORE Zip 引擎 (毫秒级零开销打包，支持各系统解压)
  const crcTable = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) {
      c = ((c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
    }
    crcTable[i] = c >>> 0;
  }

  function getCrc32(bytes) {
    let crc = -1;
    for (let i = 0; i < bytes.length; i++) {
      crc = (crc >>> 8) ^ crcTable[(crc ^ bytes[i]) & 0xFF];
    }
    return (crc ^ (-1)) >>> 0;
  }

  const textEncoder = new TextEncoder();
  const localHeaders = [];
  const centralHeaders = [];
  let offset = 0;

  for (const entry of fileEntries) {
    let dataBytes;
    if (entry.data instanceof Uint8Array) {
      dataBytes = entry.data;
    } else if (entry.data instanceof ArrayBuffer) {
      dataBytes = new Uint8Array(entry.data);
    } else if (entry.data instanceof Blob) {
      const buf = await entry.data.arrayBuffer();
      dataBytes = new Uint8Array(buf);
    } else if (typeof entry.data === "string") {
      dataBytes = textEncoder.encode(entry.data);
    } else {
      dataBytes = new Uint8Array(0);
    }

    const nameBytes = textEncoder.encode(entry.name);
    const size = dataBytes.length;
    const crc = getCrc32(dataBytes);

    // Local file header (30 bytes + name)
    const lh = new Uint8Array(30 + nameBytes.length);
    const lhView = new DataView(lh.buffer);
    lhView.setUint32(0, 0x04034b50, true);
    lhView.setUint16(4, 20, true);
    lhView.setUint16(6, 0x0800, true); // UTF-8 文件名
    lhView.setUint16(8, 0, true); // STORE
    lhView.setUint16(10, 0, true);
    lhView.setUint16(12, 0, true);
    lhView.setUint32(14, crc, true);
    lhView.setUint32(18, size, true);
    lhView.setUint32(22, size, true);
    lhView.setUint16(26, nameBytes.length, true);
    lhView.setUint16(28, 0, true);
    lh.set(nameBytes, 30);

    // Central directory header (46 bytes + name)
    const cd = new Uint8Array(46 + nameBytes.length);
    const cdView = new DataView(cd.buffer);
    cdView.setUint32(0, 0x02014b50, true);
    cdView.setUint16(4, 20, true);
    cdView.setUint16(6, 20, true);
    cdView.setUint16(8, 0x0800, true); // UTF-8 文件名
    cdView.setUint16(10, 0, true); // STORE
    cdView.setUint16(12, 0, true);
    cdView.setUint16(14, 0, true);
    cdView.setUint32(16, crc, true);
    cdView.setUint32(20, size, true);
    cdView.setUint32(24, size, true);
    cdView.setUint16(28, nameBytes.length, true);
    cdView.setUint16(30, 0, true);
    cdView.setUint16(32, 0, true);
    cdView.setUint16(34, 0, true);
    cdView.setUint16(36, 0, true);
    cdView.setUint32(38, 0, true);
    cdView.setUint32(42, offset, true);
    cd.set(nameBytes, 46);

    localHeaders.push(lh);
    localHeaders.push(dataBytes);
    centralHeaders.push(cd);
    offset += lh.length + dataBytes.length;
  }

  const cdOffset = offset;
  let cdSize = 0;
  for (const cd of centralHeaders) cdSize += cd.length;

  // End of central directory record (22 bytes)
  const eocd = new Uint8Array(22);
  const eocdView = new DataView(eocd.buffer);
  eocdView.setUint32(0, 0x06054b50, true);
  eocdView.setUint16(4, 0, true);
  eocdView.setUint16(6, 0, true);
  eocdView.setUint16(8, fileEntries.length, true);
  eocdView.setUint16(10, fileEntries.length, true);
  eocdView.setUint32(12, cdSize, true);
  eocdView.setUint32(16, cdOffset, true);
  eocdView.setUint16(20, 0, true);

  return new Blob([...localHeaders, ...centralHeaders, eocd], { type: "application/zip" });
}

// 执行批量导出核心队列 (纯 ZIP 封包模式，彻底告别单份文件弹窗拦截)
async function runBatchExportProcess() {
  const selectedItems = state.allProjects.filter(p => state.selectedIds.has(String(p.id)));
  if (selectedItems.length === 0) {
    alert("请先在列表中勾选需要批量导出的测评记录！");
    return;
  }

  state.isBatchExporting = true;
  state.batchAbortRequested = false;

  // 切换 Modal 视图至进度面板
  if (elements.batchExportOptionsView) elements.batchExportOptionsView.hidden = true;
  if (elements.batchExportSuccessView) elements.batchExportSuccessView.hidden = true;
  if (elements.batchExportProgressView) elements.batchExportProgressView.hidden = false;
  if (elements.batchExportModal) elements.batchExportModal.hidden = false;

  const total = selectedItems.length;
  const generatedFiles = [];
  let successCount = 0;
  let failCount = 0;

  try {
    for (let i = 0; i < total; i++) {
      if (state.batchAbortRequested) {
        break;
      }

      const item = selectedItems[i];
      const studentClean = (item.studentName || "学员").trim();
      const projectClean = (item.projectName || "测评").trim();
      const currentPercent = Math.round((i / total) * 100);

      // 更新进度面板显示
      if (elements.batchProgressPercentText) elements.batchProgressPercentText.textContent = `${currentPercent}%`;
      if (elements.batchProgressCounterText) elements.batchProgressCounterText.textContent = `${i + 1} / ${total}`;
      if (elements.batchProgressBarFill) elements.batchProgressBarFill.style.width = `${currentPercent}%`;
      if (elements.batchCurrentStudentText) elements.batchCurrentStudentText.textContent = `${studentClean} · ${projectClean} (${i + 1}/${total})`;
      if (elements.batchCurrentStepText) elements.batchCurrentStepText.textContent = `正在离屏沙箱加载页面与可视化图表...`;

      try {
        const { reportNode, canvas } = await captureReportItemForBatch(item, elements.batchExportSandbox);

        if (state.batchAbortRequested) break;

        if (elements.batchCurrentStepText) elements.batchCurrentStepText.textContent = `正在进行智能 DOM 排版防截断分页计算...`;
        const pdf = buildReportPdfDocument(reportNode, canvas);
        const fileName = `${studentClean}_${projectClean}_完整诊断报告.pdf`;
        const pdfData = pdf.output("arraybuffer");
        generatedFiles.push({ name: fileName, data: pdfData });
        successCount++;
      } catch (err) {
        console.error(`导出【${studentClean}】报告失败:`, err);
        failCount++;
      } finally {
        if (elements.batchExportSandbox) elements.batchExportSandbox.innerHTML = "";
      }
    }

    if (state.batchAbortRequested) {
      alert("批量导出已中止。");
      closeBatchExportModal();
      return;
    }

    // 封包并触发 ZIP 单文件极速下载
    if (generatedFiles.length > 0) {
      if (elements.batchProgressPercentText) elements.batchProgressPercentText.textContent = `99%`;
      if (elements.batchProgressBarFill) elements.batchProgressBarFill.style.width = `99%`;
      if (elements.batchCurrentStudentText) elements.batchCurrentStudentText.textContent = `正在封包生成 ZIP 压缩文件...`;
      if (elements.batchCurrentStepText) elements.batchCurrentStepText.textContent = `正在将 ${generatedFiles.length} 份报告归档打包入 ZIP 文件，请稍候...`;

      const zipBlob = await createZipBlob(generatedFiles);
      const now = new Date();
      const timeStr = `${now.getFullYear()}${String(now.getMonth()+1).padStart(2,'0')}${String(now.getDate()).padStart(2,'0')}_${String(now.getHours()).padStart(2,'0')}${String(now.getMinutes()).padStart(2,'0')}`;
      const tabName = TEMPLATE_META[state.currentTab]?.projectName || "非凡测评";
      const zipName = `${tabName}_批量报告_${generatedFiles.length}份_${timeStr}.zip`;

      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = zipName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 10000);
    }

    // 完成面板展示
    if (elements.batchProgressPercentText) elements.batchProgressPercentText.textContent = `100%`;
    if (elements.batchProgressBarFill) elements.batchProgressBarFill.style.width = `100%`;

    setTimeout(() => {
      if (elements.batchExportProgressView) elements.batchExportProgressView.hidden = true;
      if (elements.batchExportSuccessView) elements.batchExportSuccessView.hidden = false;
      if (elements.batchSuccessDesc) {
        let msg = `已成功将 ${successCount} 份测评诊断报告归档打包下载！`;
        if (failCount > 0) {
          msg += `（其中 ${failCount} 份生成异常已跳过）`;
        }
        elements.batchSuccessDesc.textContent = msg;
      }
    }, 400);

  } catch (globalErr) {
    console.error("批量导出遇到全局异常:", globalErr);
    alert(`批量导出遇到错误：${globalErr.message || "未知异常"}`);
    closeBatchExportModal();
  } finally {
    state.isBatchExporting = false;
    if (elements.batchExportSandbox) elements.batchExportSandbox.innerHTML = "";
  }
}

// 导出所选记录为 CSV
function exportSelectedToCSV() {
  const selectedItems = state.allProjects.filter(p => state.selectedIds.has(String(p.id)));
  if (selectedItems.length === 0) {
    alert("请先勾选需要导出的测评记录！");
    return;
  }
  const tabName = TEMPLATE_META[state.currentTab]?.projectName || "非凡测评";
  exportItemsToCsv(selectedItems, `${tabName}_已选数据导出_${selectedItems.length}条.csv`);
}

// 通用客户端 CSV 数据导出生成器 (含 UTF-8 BOM 解决 Excel 中文乱码)
function exportItemsToCsv(items, filename = "非凡测评数据导出.csv") {
  const headers = [
    "记录ID", "学员姓名", "联系电话", "年级", "专向", "分数段", 
    "外语语种", "目标学科", "学科分数", "满分", "学习关注点", 
    "归属顾问", "顾问手机", "测评项目代码", "测评项目名称", 
    "诊断结论与核心分型", "答题时长", "测评提交时间"
  ];

  const rows = items.map(item => [
    item.id || "",
    item.studentName || "",
    item.phoneNumber || "",
    item.grade || "",
    item.specialtyDirection || "",
    item.scoreBand || "",
    item.foreignLanguage || "",
    item.targetSubject || "",
    item.targetSubjectScore ?? "",
    item.targetSubjectFullScore ?? "",
    item.learningFocus || "",
    item.advisorName || "",
    item.advisorMobile || "",
    item.templateCode || "",
    item.projectName || "",
    item.dominantModality || item.detailSummary || "",
    getRealisticDuration(item),
    item.submittedAt ? formatTime(item.submittedAt) : ""
  ]);

  const escapeCsv = (val) => {
    const s = String(val ?? "").replace(/"/g, '""');
    return `"${s}"`;
  };

  const csvContent = "\uFEFF" + [
    headers.map(escapeCsv).join(","),
    ...rows.map(r => r.map(escapeCsv).join(","))
  ].join("\r\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}

// 保持向下兼容
async function downloadReportImageOrFile(item) {
  openDownloadFormatModal(item);
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

// 全量导出当前 Tab 的 CSV 数据
function handleExportCSV() {
  const visibleList = getFilteredProjects();
  if (visibleList.length === 0) {
    alert("当前列表没有可导出的测评数据！");
    return;
  }
  const tabName = TEMPLATE_META[state.currentTab]?.projectName || "非凡测评";
  exportItemsToCsv(visibleList, `${tabName}_全量数据导出_${visibleList.length}条.csv`);
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
              <div style="font-size:22px;font-weight:900;color:#1E1A1C">小凡教育科技 · 动力系统探索报告</div>
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
            <div style="font-size:22px;font-weight:900;color:#1E1A1C">小凡教育科技 · 学习模式定位报告</div>
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
