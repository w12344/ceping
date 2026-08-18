import React, { useState, useEffect, useMemo } from "react";
import { getFFCRMContextFromUrl } from "../utils/url";
import { submitAssessmentPayload } from "../services/api";

interface QuestionItem {
  id: string;
  prompt: string;
}

const STATIC_QUESTIONS: QuestionItem[] = [
  { id: "V01", prompt: "看书或资料时，我喜欢用不同颜色的笔划出重点。" },
  { id: "V02", prompt: "对于带有流程图、思维导图或表格的讲解，我更容易理解。" },
  { id: "V03", prompt: "记忆英文单词或语文诗词时，脑海里会浮现出文字的样子。" },
  { id: "V04", prompt: "老师讲课时如果配合黑板板书或 PPT，我听得更专注。" },
  { id: "V05", prompt: "复习时，我习惯先把整本书或章节的框架在脑海里过一遍。" },
  { id: "V06", prompt: "对于排版整洁、字迹工整的笔记，我的复习效率更高。" },
  { id: "V07", prompt: "做几何题或物理受力分析时，我必须先画出草图。" },
  { id: "V08", prompt: "做错题归因时，把错题用剪贴或扫描方式归类看图更容易记住。" },
  { id: "V09", prompt: "看到一段文字，我能很快从视觉上扫视出关键词。" },
  { id: "V10", prompt: "在没有图表辅助的情况下，纯听长篇大论容易走神。" },
  { id: "V11", prompt: "做笔记时，我会尝试使用箭头、框图等图形表示逻辑关系。" },
  { id: "V12", prompt: "遇到难题时，闭上眼睛脑海中能显现出相关公式或定理的页面布局。" },
  { id: "V13", prompt: "相比听录音讲解，我更愿意看书上的文字和解答步骤。" },
  { id: "V14", prompt: "对于新知识，只要给我看一份清晰的样例或范例，我就能明白。" },

  { id: "A01", prompt: "听老师口头讲解题目步骤比我自己看书理解得更快。" },
  { id: "A02", prompt: "背诵课文或公式时，大声朗读或小声念叨能让我记得更牢。" },
  { id: "A03", prompt: "我喜欢和同学或老师通过探讨、问答的方式复习知识点。" },
  { id: "A04", prompt: "做题卡住时，把题目要求小声读出来往往能带来思路。" },
  { id: "A05", prompt: "对于讲座、音频或课堂录音，我能准确记住其中的话语。" },
  { id: "A06", prompt: "如果周围有吵闹的声音，我的学习注意力会受到很大干扰。" },
  { id: "A07", prompt: "学习英语时，听力、口语对我的语感帮助比纯做语法题大。" },
  { id: "A08", prompt: "做错题复盘时，我喜欢口头向别人（或自己）讲解一遍这道题。" },
  { id: "A09", prompt: "我很擅长捕捉老师上课时强调的语调、重音和口头提示。" },
  { id: "A10", prompt: "听歌或环境音乐有助于我放松并进入解题状态。" },
  { id: "A11", prompt: "记忆复杂概念时，我会尝试把它编成口诀或顺口溜。" },
  { id: "A12", prompt: "比起文字报告，我更喜欢听别人口头汇报或说明。" },
  { id: "A13", prompt: "自我复习时，我会试着像老师一样给空气或自己讲课。" },
  { id: "A14", prompt: "对于讨论课或研讨会的形式，我参与度更高、收获更大。" },

  { id: "K01", prompt: "我很难长时间安静地坐着看书，隔一阵就想动一动或换个姿势。" },
  { id: "K02", prompt: "解题时我喜欢在草稿纸上不停地演算、画线或拿笔比划。" },
  { id: "K03", prompt: "通过动手做真题、做实验或解具体例题，我才能真正掌握知识点。" },
  { id: "K04", prompt: "纯看理论推导容易困倦，直接上手做题反而精神集中。" },
  { id: "K05", prompt: "思考难题时，我习惯转笔、踱步或用身体动作辅助思考。" },
  { id: "K06", prompt: "对于亲身体验或自己亲自踩过的坑，我的记忆最为深刻。" },
  { id: "K07", prompt: "学习新工具或新题型时，我喜欢先试错操作，而不是先把说明看透。" },
  { id: "K08", prompt: "我觉得做笔记的过程本身（手的动作）比事后看笔记更有助于记忆。" },
  { id: "K09", prompt: "复习时，我习惯把知识点抄写一遍或手写卡片来记忆。" },
  { id: "K10", prompt: "在有动手操作或互动演练的课堂上，我的吸收效率最高。" },
  { id: "K11", prompt: "做理化生实验或数学建模时，我的理解比纯听课深得多。" },
  { id: "K12", prompt: "我习惯用番茄工作法（学 25 分钟动一动），短时高频地学习。" },
  { id: "K13", prompt: "做完一道综合大题并独立解出答案，会带给我极大的踏实感。" },
  { id: "K14", prompt: "比起凭空想象，拿实际实物或具体题型作参考能让我快速上手。" }
];

const LIKERT_OPTIONS = [
  { value: 1, label: "非常不符合" },
  { value: 2, label: "较不符合" },
  { value: 3, label: "一般" },
  { value: 4, label: "比较符合" },
  { value: 5, label: "非常符合" }
];

export const LearningStyleAssessment: React.FC = () => {
  const [viewStep, setViewStep] = useState<"start" | "basic" | "questions">("start");

  // 表单状态
  const [studentName, setStudentName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [grade, setGrade] = useState("高三");
  const [specialtyDirection, setSpecialtyDirection] = useState("美术设计");
  const [scoreBand, setScoreBand] = useState("400至450");
  const [foreignLanguage, setForeignLanguage] = useState("英语");
  const [targetSubject, setTargetSubject] = useState("英语");
  const [targetSubjectScore, setTargetSubjectScore] = useState("110");
  const [learningFocus, setLearningFocus] = useState("practice");

  // 答题状态
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [currentPage, setCurrentPage] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // 顾问下拉框状态 (当 URL 无 ctx 时展示)
  const [advisorName, setAdvisorName] = useState(() => {
    const raw = (typeof localStorage !== "undefined" ? localStorage.getItem("advisor_name") : "") || "";
    return (raw.trim() === "李老师" || ["用户", "顾问", "未知"].includes(raw.trim())) ? "" : raw.trim();
  });
  const [advisorDropdownOpen, setAdvisorDropdownOpen] = useState(false);
  const [advisorList, setAdvisorList] = useState<string[]>([]);

  const hasCtx = useMemo(() => {
    const search = window.location.search || "";
    const hash = window.location.hash || "";
    return search.includes("ctx=") || hash.includes("ctx=");
  }, []);

  const pageSize = 6;
  const totalPages = Math.ceil(STATIC_QUESTIONS.length / pageSize);

  // 初始化 URL / ctx 自动回填
  useEffect(() => {
    const ctx = getFFCRMContextFromUrl();
    if (ctx.student.name && !studentName) setStudentName(ctx.student.name);
    if (ctx.student.mobile && !phoneNumber) setPhoneNumber(ctx.student.mobile);

    if (!hasCtx) {
      const apiBase = (typeof window !== "undefined" && (window as any).ASSESSMENT_API_BASE) || "https://ffcrm-api.1605ai.com";
      fetch(`${apiBase}/api/assessment/advisors?roleCode=SALES,MARKET`)
        .then(res => res.json())
        .then(json => {
          const records = Array.isArray(json.data) ? json.data : (json.data?.list || (Array.isArray(json) ? json : []));
          if (Array.isArray(records) && records.length > 0) {
            const fetchedNames = records
              .map((r: any) => typeof r === "string" ? r : (r.employeeName || r.name || r.advisorName))
              .filter((name: any) => name && typeof name === "string" && !["用户", "未知"].includes(name.trim()));
            if (fetchedNames.length > 0) setAdvisorList(fetchedNames);
          }
        })
        .catch(() => {});
    }
  }, [hasCtx]);

  const currentQuestions = useMemo(() => {
    const start = currentPage * pageSize;
    return STATIC_QUESTIONS.slice(start, start + pageSize);
  }, [currentPage]);

  const progressPercent = useMemo(() => {
    const answeredCount = Object.keys(answers).length;
    return Math.min(100, Math.round((answeredCount / STATIC_QUESTIONS.length) * 100));
  }, [answers]);

  const handleAnswerSelect = (questionId: string, value: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
    setErrorMessage("");
  };

  const handleNextPage = () => {
    // 校验本页是否完成
    const unAnswered = currentQuestions.some((q) => !answers[q.id]);
    if (unAnswered) {
      setErrorMessage("请先完成本页全部题目再进行下一页。");
      return;
    }
    setErrorMessage("");

    if (currentPage < totalPages - 1) {
      setCurrentPage((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setErrorMessage("");

    const ctx = getFFCRMContextFromUrl();
    const sessionId = `session_${Date.now()}`;

    const formattedAnswers = Object.entries(answers).map(([qid, val]) => ({
      questionId: qid,
      value: val,
      responseTimeMs: 300,
      answeredAt: new Date().toISOString()
    }));

    const finalAdvisorName = ctx.advisor.name || advisorName || localStorage.getItem("advisor_name") || "";

    const payload = {
      studentInfo: {
        name: studentName,
        mobile: phoneNumber,
        grade,
        specialtyDirection,
        scoreBand,
        foreignLanguage,
        targetSubject,
        targetSubjectScore: Number(targetSubjectScore) || 0,
        targetSubjectFullScore: 150,
        learningFocus,
        profileId: ctx.student.profileId
      },
      advisorInfo: {
        token: ctx.advisor.token,
        name: finalAdvisorName,
        userId: ctx.advisor.userId,
        mobile: ctx.advisor.mobile
      },
      assessmentInfo: {
        templateCode: "LEARNING_STYLE",
        templateName: "学习模式定位",
        templateType: "STUDENT_LEARNING",
        answers: formattedAnswers,
        durationSeconds: 45,
        submittedAt: new Date().toISOString(),
        reportUrl: (typeof window !== "undefined" ? window.location.origin : "https://ceping.1605ai.com") + "/report.html"
      }
    };

    try {
      const savedData = await submitAssessmentPayload(payload);
      const savedId = savedData?.id || savedData?.savedId;
      if (savedId) {
        window.location.hash = `#/report?id=${savedId}`;
      } else {
        window.location.hash = `#/report?mobile=${encodeURIComponent(phoneNumber)}&session=${encodeURIComponent(sessionId)}`;
      }
    } catch (err: any) {
      console.warn("提交测评结果失败:", err);
      setErrorMessage(err.message || "提交失败，请检查网络后重试。");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pb-16">
      {/* 顶部 Header Bar */}
      <header className="brand-bar sticky top-0 z-50">
        <div className="brand-lockup">
          <div className="brand-left">
            <div className="brand-badge-box">凡</div>
            <div className="brand-text">
              <span className="brand-cn">非凡教育</span>
              <span className="brand-sub">点亮每一个孩子的未来</span>
            </div>
          </div>
        </div>
      </header>

      {/* 主体 Container */}
      <main className="page-shell">
        {/* Step 1: Start 引导页 */}
        {viewStep === "start" && (
          <div className="hero-panel">
            <div className="hero-top-grid">
              <div className="hero-intro-col">
                <div className="hero-header-tag">
                  <span className="pill-badge">✨ 非凡教育 · 官方科学诊断量表</span>
                </div>
                <h1 className="hero-main-title">学习模式<span className="title-highlight">定位</span></h1>
                <p className="hero-lead">
                  回顾真实学习场景，看清你通常怎样接收、整理和运用信息，并获得目标学科的具体建议。
                </p>
              </div>
              <div className="hero-visual-col">
                <div className="hero-visual-wrapper">
                  <img src="/assets/images/hero-podium.png" alt="非凡教育学习模式定位" className="hero-podium-img" />
                </div>
              </div>
            </div>

            {/* Metrics Pills */}
            <div className="fact-row" aria-label="测评概况">
              <div className="fact-card fact-card-time">
                <img src="/assets/images/icon-timer.png" alt="时间" className="fact-icon-img" />
                <div className="fact-text">
                  <strong>8-10 分钟</strong>
                  <span>预计完成时间</span>
                </div>
              </div>
              <div className="fact-card fact-card-count">
                <img src="/assets/images/icon-paper-pencil.png" alt="题量" className="fact-icon-img" />
                <div className="fact-text">
                  <strong>42 + 可选 4 题</strong>
                  <span>作答题目总量</span>
                </div>
              </div>
            </div>

            {/* Notice Block with Mascot Owl */}
            <div className="notice-block-wrapper">
              <div className="notice-block">
                <div className="notice-header">
                  <span className="notice-badge-dot">◇</span>
                  <h2>作答前请知道</h2>
                </div>
                <div className="notice-item">
                  <img src="/assets/images/icon-shield-check.png" alt="规则" className="notice-bullet-icon" />
                  <p><strong>没有标准答案</strong>：请按平时最常出现的真实情况作答，无需选择“看起来更正确”的选项。</p>
                </div>
                <div className="notice-item">
                  <img src="/assets/images/icon-bulb.png" alt="说明" className="notice-bullet-icon" />
                  <p><strong>客观看待结果</strong>：结果描述的是当前学习入口与信息偏好，不评价学习能力的高低。</p>
                </div>
              </div>
              <div className="notice-mascot">
                <img src="/assets/images/mascot-owl.png" alt="非凡猫头鹰" className="mascot-img" />
              </div>
            </div>

            {/* Actions */}
            <div className="hero-action-buttons">
              <button
                type="button"
                onClick={() => setViewStep("basic")}
                className="primary-button hero-start-btn"
              >
                开始测评 →
              </button>
              <button
                type="button"
                onClick={() => setViewStep("basic")}
                className="secondary-button hero-resume-btn"
              >
                继续上次作答
              </button>
            </div>

            {/* Bottom Trust Badges */}
            <div className="hero-trust-badges">
              <div className="trust-badge-item">
                <img src="/assets/images/icon-shield-check.png" alt="科学量表" className="trust-icon" />
                <div className="trust-info">
                  <strong>科学量表</strong>
                  <span>权威量表，专业认证</span>
                </div>
              </div>
              <div className="trust-badge-item">
                <img src="/assets/images/icon-lock.png" alt="严格保密" className="trust-icon" />
                <div className="trust-info">
                  <strong>严格保密</strong>
                  <span>数据加密，隐私保护</span>
                </div>
              </div>
              <div className="trust-badge-item">
                <img src="/assets/images/icon-check-circle.png" alt="个性化报告" className="trust-icon" />
                <div className="trust-info">
                  <strong>个性化报告</strong>
                  <span>定制建议，精准提升</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Basic Info 表单 & Questions Page wrapped in two-column layout */}
        {viewStep !== "start" && (
          <div className="content-two-col-layout">
            {/* Left Sidebar for PC */}
            <aside className="assessment-sidebar">
              <div className="sidebar-step-card">
                <div className="sidebar-step-list">
                  <div className={`sidebar-step-item ${viewStep === 'basic' ? 'is-active' : 'is-completed'}`} data-step="1">
                    <span className="step-num-badge">01</span>
                    <div className="step-label-group">
                      <strong>基本信息</strong>
                      <span>填写个人基本信息</span>
                    </div>
                  </div>
                  <div className="step-connector"></div>
                  <div className={`sidebar-step-item ${viewStep === 'questions' ? 'is-active' : ''}`} data-step="2">
                    <span className="step-num-badge">02</span>
                    <div className="step-label-group">
                      <strong>学习情况</strong>
                      <span>学习习惯与风格</span>
                    </div>
                  </div>
                  <div className="step-connector"></div>
                  <div className="sidebar-step-item" data-step="3">
                    <span className="step-num-badge">03</span>
                    <div className="step-label-group">
                      <strong>兴趣与动机</strong>
                      <span>兴趣与学习动力</span>
                    </div>
                  </div>
                  <div className="step-connector"></div>
                  <div className="sidebar-step-item" data-step="4">
                    <span className="step-num-badge">04</span>
                    <div className="step-label-group">
                      <strong>学科基础</strong>
                      <span>各学科掌握情况</span>
                    </div>
                  </div>
                  <div className="step-connector"></div>
                  <div className="sidebar-step-item" data-step="5">
                    <span className="step-num-badge">05</span>
                    <div className="step-label-group">
                      <strong>提交完成</strong>
                      <span>生成专属报告</span>
                    </div>
                  </div>
                </div>

                <div className="sidebar-mascot-box">
                  <div className="sidebar-speech-bubble">
                    认真填写信息<br />将获得更准确的分析哦！
                  </div>
                  <img src="/assets/images/mascot-pencil-owl.png" alt="非凡猫头鹰助教" className="sidebar-owl-img" />
                </div>
              </div>
            </aside>

            {/* Right Main Area */}
            <div className="assessment-content-area">
              {/* Mobile Horizontal Step Indicator */}
              <div className="mobile-step-indicator">
                <div className={`mobile-step-item ${viewStep === 'basic' ? 'is-active' : 'is-completed'}`}>01</div>
                <div className="mobile-step-line"></div>
                <div className={`mobile-step-item ${viewStep === 'questions' ? 'is-active' : ''}`}>02</div>
                <div className="mobile-step-line"></div>
                <div className="mobile-step-item">03</div>
                <div className="mobile-step-line"></div>
                <div className="mobile-step-item">04</div>
                <div className="mobile-step-line"></div>
                <div className="mobile-step-item">05</div>
              </div>

              {viewStep === "basic" && (
                <div className="space-y-6">
                  <div className="section-heading-card">
                    <div className="heading-left-content">
                      <span className="section-number-pill">01</span>
                      <div className="heading-titles">
                        <h1>基本信息</h1>
                        <p>用于生成更贴近当前阶段和目标学科的建议。</p>
                      </div>
                    </div>
                    <div className="heading-right-visual">
                      <img src="/assets/images/icon-id-card.png" alt="基本信息" className="heading-id-card-img" />
                    </div>
                  </div>

                  <div className="feifan-card p-6 space-y-6">
                    {/* 姓名与手机号 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1.5">学员姓名 *</label>
                        <input
                          type="text"
                          value={studentName}
                          onChange={(e) => setStudentName(e.target.value)}
                          placeholder="请输入你的姓名"
                          className="w-full px-4 py-3 rounded-xl border border-amber-200 focus:border-[#F5C518] focus:ring-2 focus:ring-amber-200 outline-none transition-all text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1.5">手机号 *</label>
                        <input
                          type="tel"
                          maxLength={11}
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          placeholder="请输入手机号"
                          className="w-full px-4 py-3 rounded-xl border border-amber-200 focus:border-[#F5C518] focus:ring-2 focus:ring-amber-200 outline-none transition-all text-sm"
                        />
                      </div>
                    </div>

                    {/* 归属顾问 (链接未带 ctx 时展示) */}
                    {!hasCtx && (
                      <div className="relative">
                        <div className="flex justify-between items-center mb-1.5">
                          <label className="text-xs font-bold text-gray-700">归属顾问</label>
                          <span className="text-[11px] font-medium text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                            请从列表中选择
                          </span>
                        </div>
                        <div className="relative">
                          <input
                            type="text"
                            readOnly
                            value={advisorName}
                            onFocus={() => setAdvisorDropdownOpen(true)}
                            onClick={() => setAdvisorDropdownOpen(true)}
                            onKeyDown={(e) => {
                              if (e.key === "Escape") {
                                setAdvisorDropdownOpen(false);
                                return;
                              }
                              if (e.key !== "Tab") {
                                e.preventDefault();
                              }
                            }}
                            placeholder="请选择归属顾问"
                            className="w-full px-4 py-3 pr-10 rounded-xl border border-amber-200 focus:border-[#F5C518] focus:ring-2 focus:ring-amber-200 outline-none transition-all text-sm bg-white font-medium cursor-pointer caret-transparent"
                          />
                          <div className={`absolute right-3 top-1/2 -translate-y-1/2 text-amber-600 pointer-events-none transition-transform duration-200 ${advisorDropdownOpen ? 'rotate-180' : ''}`}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="6 9 12 15 18 9"></polyline>
                            </svg>
                          </div>
                        </div>

                        {advisorDropdownOpen && (
                          <div 
                            className="absolute left-0 right-0 top-[calc(100%+4px)] bg-white border border-amber-200/80 rounded-2xl shadow-xl max-h-56 overflow-y-auto z-50 p-1.5 animate-in fade-in duration-150"
                            onMouseDown={(e) => e.preventDefault()}
                          >
                            {advisorList.length === 0 ? (
                              <div className="p-3 text-center bg-gray-50 rounded-xl m-1">
                                <div className="text-xs text-gray-500 font-medium">暂无可选顾问</div>
                                <div className="text-[11px] text-gray-400 mt-1">请稍后再试或联系老师协助</div>
                              </div>
                            ) : (
                              advisorList.map((name) => {
                                const initial = name.slice(0, 1) || "顾";
                                const isSelected = advisorName.trim() === name;
                                return (
                                  <div
                                    key={name}
                                    onClick={() => {
                                      setAdvisorName(name);
                                      localStorage.setItem("advisor_name", name);
                                      setAdvisorDropdownOpen(false);
                                    }}
                                    className={`px-3 py-2.5 rounded-xl cursor-pointer transition-all flex items-center justify-between group mb-0.5 ${
                                      isSelected ? "bg-amber-50 text-amber-900" : "hover:bg-amber-50/70 text-gray-800"
                                    }`}
                                  >
                                    <div className="flex items-center gap-2.5">
                                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 text-amber-800 font-extrabold text-sm flex items-center justify-center shadow-sm flex-shrink-0">
                                        {initial}
                                      </div>
                                      <span className="text-sm font-bold text-gray-800 group-hover:text-amber-900">{name}</span>
                                    </div>
                                    <span className="text-[11px] font-semibold text-amber-800 bg-amber-100/70 border border-amber-200 px-2 py-0.5 rounded-lg">
                                      指导老师
                                    </span>
                                  </div>
                                );
                              })
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {/* 年级 2x2 选择 */}
                    <div>
                      <h2 className="text-sm font-bold text-gray-800 mb-2">✨ 你现在读几年级？ *</h2>
                      <div className="choice-grid grid-2x2">
                        {["高一", "高二", "高三", "高复"].map((g) => (
                          <label key={g} className={grade === g ? "is-checked" : ""}>
                            <input
                              type="radio"
                              name="grade"
                              checked={grade === g}
                              onChange={() => setGrade(g)}
                            />
                            <span>{g}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* 专业方向 2x2 选择 */}
                    <div>
                      <h2 className="text-sm font-bold text-gray-800 mb-2">✨ 你学的是什么专业方向？ *</h2>
                      <div className="choice-grid grid-2x2">
                        {["文科", "理科", "艺术", "体育"].map((dir) => (
                          <label key={dir} className={specialtyDirection === dir ? "is-checked" : ""}>
                            <input
                              type="radio"
                              name="specialtyDirection"
                              checked={specialtyDirection === dir}
                              onChange={() => setSpecialtyDirection(dir)}
                            />
                            <span>{dir}</span>
                          </label>
                        ))}
                        <label className={`grid-full-row ${specialtyDirection === "其他" ? "is-checked" : ""}`}>
                          <input
                            type="radio"
                            name="specialtyDirection"
                            checked={specialtyDirection === "其他"}
                            onChange={() => setSpecialtyDirection("其他")}
                          />
                          <span>其他（请填写）</span>
                        </label>
                      </div>
                    </div>

                    {/* 文化课分数段 2x2 选择 */}
                    <div>
                      <h2 className="text-sm font-bold text-gray-800 mb-2">✨ 你最近一次文化课考了多少分？ *</h2>
                      <div className="choice-grid grid-2x2">
                        {["350以下", "350至400", "400至450", "450至500", "500至550", "550至600"].map((sb) => (
                          <label key={sb} className={scoreBand === sb ? "is-checked" : ""}>
                            <input
                              type="radio"
                              name="scoreBand"
                              checked={scoreBand === sb}
                              onChange={() => setScoreBand(sb)}
                            />
                            <span>{sb}</span>
                          </label>
                        ))}
                        <label className={`grid-full-row ${scoreBand === "600以上" ? "is-checked" : ""}`}>
                          <input
                            type="radio"
                            name="scoreBand"
                            checked={scoreBand === "600以上"}
                            onChange={() => setScoreBand("600以上")}
                          />
                          <span>600以上</span>
                        </label>
                      </div>
                    </div>

                    {/* 目标学科与分数 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1.5">最想提分的科目 *</label>
                        <select
                          value={targetSubject}
                          onChange={(e) => setTargetSubject(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-amber-200 focus:border-[#F5C518] focus:ring-2 focus:ring-amber-200 outline-none transition-all text-sm bg-white"
                        >
                          {["英语", "数学", "语文", "日语", "物理", "化学", "生物", "历史", "政治", "地理"].map((sub) => (
                            <option key={sub} value={sub}>{sub}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1.5">该科目当前分数 *</label>
                        <input
                          type="number"
                          value={targetSubjectScore}
                          onChange={(e) => setTargetSubjectScore(e.target.value)}
                          placeholder="如 110"
                          className="w-full px-4 py-3 rounded-xl border border-amber-200 focus:border-[#F5C518] focus:ring-2 focus:ring-amber-200 outline-none transition-all text-sm"
                        />
                      </div>
                    </div>

                    <div className="form-actions-wrapper">
                      <div className="actions-row">
                        <button
                          type="button"
                          onClick={() => setViewStep("start")}
                          className="secondary-button action-btn-half"
                        >
                          返回上一步
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (!studentName || !phoneNumber) {
                              setErrorMessage("请填写姓名与手机号。");
                              return;
                            }
                            setErrorMessage("");
                            setViewStep("questions");
                          }}
                          className="primary-button hero-start-btn action-btn-half"
                        >
                          下一步 ➔
                        </button>
                      </div>
                      <div className="form-security-note">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                        <span>信息仅用于测评分析，我们将严格保密</span>
                      </div>
                    </div>
                    {errorMessage && <p className="text-xs font-bold text-red-500 text-center">{errorMessage}</p>}
                  </div>
                </div>
              )}

              {/* Step 3: Questions 答题页 */}
              {viewStep === "questions" && (
                <div className="space-y-6">
                  <div className="section-heading-card">
                    <div className="heading-left-content">
                      <span className="section-number-pill">02</span>
                      <div className="heading-titles">
                        <h1>学习情况</h1>
                        <p>学习习惯与风格诊断，没有对错之分，请根据真实情况作答。</p>
                      </div>
                    </div>
                    <div className="heading-right-visual">
                      <img src="/assets/images/icon-id-card.png" alt="学习情况" className="heading-id-card-img" />
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="progress-panel">
                    <div className="progress-copy">
                      <span>第 {currentPage + 1} / {totalPages} 页</span>
                      <span>已完成 {Object.keys(answers).length} / {STATIC_QUESTIONS.length} 题</span>
                    </div>
                    <div className="progress-track" role="progressbar" aria-label="测评完成进度">
                      <span id="progressFill" style={{ width: `${progressPercent}%` }}></span>
                    </div>
                  </div>

                  {/* Question List */}
                  <div className="space-y-4">
                    {currentQuestions.map((q, idx) => {
                      const globalIndex = currentPage * pageSize + idx + 1;
                      const currentVal = answers[q.id];
                      return (
                        <div key={q.id} className="feifan-card p-5 md:p-6 space-y-3">
                          <div className="flex items-start gap-3">
                            <span className="px-2.5 py-1 rounded-md bg-amber-100 text-amber-900 font-extrabold text-xs">
                              Q{globalIndex}
                            </span>
                            <p className="font-bold text-[#1E1A1C] text-base leading-relaxed">{q.prompt}</p>
                          </div>

                          {/* Likert 5 Pills Choice */}
                          <div className="grid grid-cols-5 gap-2 pt-2">
                            {LIKERT_OPTIONS.map((opt) => (
                              <button
                                key={opt.value}
                                type="button"
                                onClick={() => handleAnswerSelect(q.id, opt.value)}
                                className={`py-2 px-1 rounded-xl border text-xs font-semibold flex flex-col items-center justify-center gap-0.5 transition-all ${
                                  currentVal === opt.value
                                    ? "bg-[#FFE100] border-[#F5C518] text-[#1E1A1C] font-extrabold shadow-md scale-105"
                                    : "bg-[#FFFDF8] border-[#FDE68A] text-gray-700 hover:bg-[#FFFBE9]"
                                }`}
                              >
                                <span className="text-sm font-black">{opt.value}</span>
                                <span className="text-[11px] hidden sm:inline opacity-80">{opt.label}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {errorMessage && (
                    <p className="text-sm font-bold text-red-500 bg-red-50 p-3 rounded-xl border border-red-200">
                      {errorMessage}
                    </p>
                  )}

                  {/* Navigation Actions - Same row display */}
                  <div className="form-actions-wrapper">
                    <div className="actions-row">
                      <button
                        type="button"
                        disabled={currentPage === 0 || isSubmitting}
                        onClick={() => {
                          setCurrentPage((prev) => Math.max(0, prev - 1));
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        className="secondary-button action-btn-half"
                      >
                        上一页
                      </button>
                      <button
                        type="button"
                        disabled={isSubmitting}
                        onClick={handleNextPage}
                        className="primary-button hero-start-btn action-btn-half"
                      >
                        {isSubmitting
                          ? "提交诊断中..."
                          : currentPage === totalPages - 1
                          ? "完成作答 ➔"
                          : "下一页 ➔"}
                      </button>
                    </div>
                    <div className="form-security-note">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                      <span>信息仅用于测评分析，我们将严格保密</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default LearningStyleAssessment;
