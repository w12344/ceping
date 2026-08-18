import React, { useEffect, useState } from "react";
import { fetchAssessmentDetail, fetchAssessmentByMobile } from "../services/api";
import { generateStudentReport, StudentReportData, QuestionAnswer } from "../utils/reportEngine";

export const AssessmentReport: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState<StudentReportData | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setErrorMsg("");

      const params = new URLSearchParams(window.location.search);
      const hash = window.location.hash || "";
      const hashParams = new URLSearchParams(hash.includes("?") ? hash.split("?")[1] : "");

      const id = params.get("id") || hashParams.get("id");
      const mobile = params.get("mobile") || hashParams.get("mobile") || params.get("customerMobile");

      try {
        let rawRecord: any = null;

        if (id) {
          rawRecord = await fetchAssessmentDetail(id);
        }

        if (!rawRecord && mobile) {
          const list = await fetchAssessmentByMobile(mobile);
          if (list && list.length > 0) {
            rawRecord = list[0];
          }
        }

        if (rawRecord) {
          const resultData = typeof rawRecord.resultJson === "string"
            ? JSON.parse(rawRecord.resultJson)
            : rawRecord.resultJson || {};

          const answers: QuestionAnswer[] = resultData.answers || [];
          const userInfo = resultData.userInfo || {};

          const report = generateStudentReport(answers, {
            studentName: rawRecord.customerName || userInfo.studentName || resultData.name || "学员",
            phoneNumber: rawRecord.customerMobile || userInfo.phoneNumber || resultData.contact || "",
            grade: userInfo.grade || resultData.grade || "高三",
            specialtyDirection: userInfo.specialtyDirection || "美术设计",
            scoreBand: userInfo.scoreBand || "400至450",
            foreignLanguage: userInfo.foreignLanguage || "英语",
            targetSubject: userInfo.targetSubject || resultData.targetSubject || "英语",
            targetSubjectScore: userInfo.targetSubjectScore ?? resultData.targetSubjectScore ?? 110,
            targetSubjectFullScore: userInfo.targetSubjectFullScore ?? 150,
            learningFocus: userInfo.learningFocus || resultData.learningFocus || "practice"
          });

          setReportData(report);
        } else {
          setErrorMsg("未找到该测评报告记录。请检查报告 ID 或手机号。");
        }
      } catch (err: any) {
        console.error("加载诊断报告失败:", err);
        setErrorMsg("加载报告失败: " + (err.message || "网络异常"));
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("报告链接已成功复制到剪贴板！");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-4 border-[#F5C518] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-bold text-gray-600">正在生成个人学习模式定位报告...</p>
      </div>
    );
  }

  if (errorMsg || !reportData) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="feifan-card max-w-md w-full p-6 text-center space-y-4">
          <div className="text-4xl">⚠️</div>
          <h2 className="text-xl font-extrabold text-[#1E1A1C]">报告获取失败</h2>
          <p className="text-sm text-gray-600">{errorMsg || "未找到测评记录"}</p>
          <button
            onClick={() => (window.location.hash = "#/assessment")}
            className="feifan-btn-primary px-6 py-2.5 text-sm"
          >
            重新进行测评
          </button>
        </div>
      </div>
    );
  }

  const { overview, vakScores, diagnosisTitle, diagnosisSummary, keyRecommendations, subjectAdvice } = reportData;

  return (
    <div className="report-page min-h-screen">
      {/* Desktop Branded Navigation Bar */}
      <header className="brand-bar no-print">
        <div className="brand-bar-inner">
          <a href="/" className="brand-lockup-link">
            <div className="brand-badge-box">凡</div>
            <div className="brand-titles">
              <span className="brand-cn">非凡教育</span>
              <span className="brand-sub">点亮每一个孩子的未来</span>
            </div>
          </a>
          <button onClick={handlePrint} className="primary-button autofill-pill-btn print-btn-pill" type="button">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
            <span>打印报告</span>
          </button>
        </div>
      </header>

      {/* Mobile Header Bar */}
      <div className="mobile-report-header no-print">
        <a href="/" className="mobile-back-link">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        </a>
        <span className="mobile-report-title">非凡教育 · 专属诊断分析报告</span>
        <button onClick={handlePrint} className="mobile-print-btn" type="button">打印报告</button>
      </div>

      {/* Main Report Container */}
      <main className="report-shell">
        <div className="report-two-col-layout">
          {/* Sticky Left Sidebar */}
          <aside className="report-sidebar no-print">
            <div className="report-sidebar-inner">
              <div className="report-sidebar-steps">
                {/* Step 1: 基本信息 */}
                <div className="sidebar-step-item is-completed">
                  <div className="step-badge-wrap">
                    <span className="step-num-badge">01</span>
                  </div>
                  <div className="step-text-wrap">
                    <span className="step-main-title">基本信息</span>
                  </div>
                  <span className="step-check-mark">✓</span>
                </div>
                <div className="step-connect-line is-completed"></div>

                {/* Step 2: 学习状况 */}
                <div className="sidebar-step-item is-active">
                  <div className="step-badge-wrap">
                    <span className="step-num-badge">02</span>
                  </div>
                  <div className="step-text-wrap">
                    <span className="step-main-title">学习状况</span>
                  </div>
                </div>
                <div className="step-connect-line"></div>

                {/* Step 3: 学习特点 */}
                <div className="sidebar-step-item">
                  <div className="step-badge-wrap">
                    <span className="step-num-badge">03</span>
                  </div>
                  <div className="step-text-wrap">
                    <span className="step-main-title">学习特点</span>
                  </div>
                </div>
                <div className="step-connect-line"></div>

                {/* Step 4: 学习策略 */}
                <div className="sidebar-step-item">
                  <div className="step-badge-wrap">
                    <span className="step-num-badge">04</span>
                  </div>
                  <div className="step-text-wrap">
                    <span className="step-main-title">学习策略</span>
                  </div>
                </div>
                <div className="step-connect-line"></div>

                {/* Step 5: 学习建议 */}
                <div className="sidebar-step-item">
                  <div className="step-badge-wrap">
                    <span className="step-num-badge">05</span>
                  </div>
                  <div className="step-text-wrap">
                    <span className="step-main-title">学习建议</span>
                  </div>
                </div>
                <div className="step-connect-line"></div>

                {/* Step 6: 行动计划 */}
                <div className="sidebar-step-item">
                  <div className="step-badge-wrap">
                    <span className="step-num-badge">06</span>
                  </div>
                  <div className="step-text-wrap">
                    <span className="step-main-title">行动计划</span>
                  </div>
                </div>
              </div>

              {/* Mascot Footer */}
              <div className="report-sidebar-footer">
                <p className="sidebar-motto-text">每一次发现，<br />都是成长的开始！</p>
                <div className="sidebar-mascot-wrap">
                  <img src="/assets/images/mascot-magnifier-owl.png" alt="非凡助教" className="sidebar-mascot-img" />
                </div>
              </div>
            </div>
          </aside>

          {/* Right Main Report Content Cards */}
          <div className="report-content-area">
            {/* Hero Header Banner Card */}
            <section className="report-hero-card">
              <div className="report-hero-info">
                <span className="report-hero-pill">LEARNING ACTION REPORT</span>
                <p className="report-hero-eyebrow">非凡教育 · 学习模式定位</p>
                <h1 className="report-hero-title">学习模式定位与行动报告</h1>
                <p className="report-hero-desc">看看你平时更容易从哪里开始学习，再把这个入口用到目标学科里。</p>
              </div>
              <div className="report-hero-visual-wrap">
                <img src="/assets/images/report-hero-visual.png" alt="学习模式定位与行动报告" className="report-hero-3d-img" />
              </div>
            </section>

            {/* Card 1: 你的信息 */}
            <section className="report-card report-info-card">
              <h2 className="report-card-heading">你的信息</h2>
              <div className="report-meta-grid">
                <div className="meta-field-item">
                  <span className="meta-field-label">姓名</span>
                  <strong className="meta-field-value">{overview.studentName || "测试学员"}</strong>
                </div>
                <div className="meta-field-item">
                  <span className="meta-field-label">手机号</span>
                  <strong className="meta-field-value">{overview.phoneNumber || "15765778832"}</strong>
                </div>
                <div className="meta-field-item">
                  <span className="meta-field-label">年级</span>
                  <strong className="meta-field-value">{overview.grade || "高三"}</strong>
                </div>
                <div className="meta-field-item">
                  <span className="meta-field-label">目标学科</span>
                  <strong className="meta-field-value">{overview.targetSubject || "语文"}</strong>
                </div>
                <div className="meta-field-item">
                  <span className="meta-field-label">本次重点</span>
                  <strong className="meta-field-value">做题和应用</strong>
                </div>
                <div className="meta-field-item">
                  <span className="meta-field-label">测评日期</span>
                  <strong className="meta-field-value">{new Date().toISOString().slice(0, 10)}</strong>
                </div>
              </div>
            </section>

            {/* Card 2: 01 你的学习状态 */}
            <section className="report-card report-section-card">
              <div className="section-card-header">
                <span className="section-order-badge">01</span>
                <div className="section-card-titles">
                  <h2>你的学习状态</h2>
                  <p>你已经具备什么资源，下一步可以先补什么。</p>
                </div>
              </div>

              <div className="state-data-layout">
                {/* Visual Channels Progress */}
                <div className="state-bars-container w-full">
                  <div className="state-bar-row">
                    <span className="state-bar-label">视觉入口</span>
                    <div className="state-bar-track">
                      <span className="state-bar-fill" style={{ width: `${vakScores.V}%` }}></span>
                    </div>
                    <strong className="state-bar-value">{vakScores.V}/100</strong>
                  </div>
                  <div className="state-bar-row">
                    <span className="state-bar-label">听觉入口</span>
                    <div className="state-bar-track">
                      <span className="state-bar-fill" style={{ width: `${vakScores.A}%` }}></span>
                    </div>
                    <strong className="state-bar-value">{vakScores.A}/100</strong>
                  </div>
                  <div className="state-bar-row">
                    <span className="state-bar-label">读写入口</span>
                    <div className="state-bar-track">
                      <span className="state-bar-fill" style={{ width: `${Math.round((vakScores.V + vakScores.A) / 2)}%` }}></span>
                    </div>
                    <strong className="state-bar-value">{Math.round((vakScores.V + vakScores.A) / 2)}/100</strong>
                  </div>
                  <div className="state-bar-row">
                    <span className="state-bar-label">动觉入口</span>
                    <div className="state-bar-track">
                      <span className="state-bar-fill" style={{ width: `${vakScores.K}%` }}></span>
                    </div>
                    <strong className="state-bar-value">{vakScores.K}/100</strong>
                  </div>
                </div>
              </div>

              {/* Bottom 2 Highlight Action Boxes */}
              <div className="state-action-boxes">
                <div className="state-action-box box-yellow">
                  <span className="action-box-tag">本周先练什么</span>
                  <p className="action-box-text">刻意练习：盯住一个卡点，练到会</p>
                </div>
                <div className="state-action-box box-green">
                  <span className="action-box-tag">可以先这样做</span>
                  <p className="action-box-text">从{overview.targetSubject || "现代文"}主观题开始：把关系画成简图；然后先不看提示再回想</p>
                </div>
              </div>
            </section>

            {/* Card 3: 02 我看见了你的学习特点 */}
            <section className="report-card report-section-card">
              <div className="section-card-header">
                <span className="section-order-badge">02</span>
                <div className="section-card-titles">
                  <h2>我看见了你的学习特点</h2>
                  <p>四种方式都可能用得上。这里先看看，哪几种更常出现在你的真实学习里。</p>
                </div>
              </div>

              {/* 一句话认识你 Highlight Box */}
              <div className="judgment-highlight-box">
                <span className="judgment-tag">一句话认识你</span>
                <p className="judgment-text">{diagnosisSummary}</p>
              </div>

              {/* 四种学习方式，简单说是什么 */}
              <div className="vark-explanation-section">
                <h3 className="vark-explanation-title">四种学习方式，简单说是什么</h3>
                <div className="vark-cards-grid">
                  <div className="vark-card">
                    <div className="vark-card-icon-wrap">
                      <img src="/assets/images/icon-vark-visual.png" alt="视觉入口" className="vark-card-icon-img" />
                    </div>
                    <h4 className="vark-card-title">视觉入口</h4>
                    <p className="vark-card-desc">先看文字、图形、表格，在脑海中形成画面和结构。</p>
                  </div>
                  <div className="vark-card">
                    <div className="vark-card-icon-wrap">
                      <img src="/assets/images/icon-vark-auditory.png" alt="听觉入口" className="vark-card-icon-img" />
                    </div>
                    <h4 className="vark-card-title">听觉入口</h4>
                    <p className="vark-card-desc">先听例子、讲解或自述，在声音中理解和记忆。</p>
                  </div>
                  <div className="vark-card">
                    <div className="vark-card-icon-wrap">
                      <img src="/assets/images/icon-vark-readwrite.png" alt="读写入口" className="vark-card-icon-img" />
                    </div>
                    <h4 className="vark-card-title">读写入口</h4>
                    <p className="vark-card-desc">先读一遍、写下来，通过文字梳理和输出想法。</p>
                  </div>
                  <div className="vark-card">
                    <div className="vark-card-icon-wrap">
                      <img src="/assets/images/icon-vark-kinesthetic.png" alt="动觉入口" className="vark-card-icon-img" />
                    </div>
                    <h4 className="vark-card-title">动觉入口</h4>
                    <p className="vark-card-desc">先动手做、演示或体验，在操作中理解原理。</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Card 4: 03 核心学习习惯改进建议 */}
            <section className="report-card report-section-card">
              <div className="section-card-header">
                <span className="section-order-badge">03</span>
                <div className="section-card-titles">
                  <h2>核心学习习惯改进建议</h2>
                  <p>根据你的入口组合，为你定制的提分突破策略。</p>
                </div>
              </div>
              <div className="space-y-3">
                {keyRecommendations.map((rec, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 rounded-xl bg-[#FFFDF0] border border-[#FDE68A]">
                    <span className="w-6 h-6 rounded-full bg-[#FFE600] text-[#1E1A1C] font-black text-xs flex items-center justify-center shrink-0 shadow-sm">
                      {index + 1}
                    </span>
                    <p className="text-sm font-bold text-[#1E1A1C] leading-relaxed">{rec}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Card 5: 04 目标学科针对性突破 */}
            <section className="report-card report-section-card">
              <div className="section-card-header">
                <span className="section-order-badge">04</span>
                <div className="section-card-titles">
                  <h2>目标学科 [{subjectAdvice.subject}] 针对性突破</h2>
                  <p>结合学科特点与你的学习入口，实现高效提分。</p>
                </div>
              </div>
              <div className="space-y-3">
                {subjectAdvice.suggestions.map((sug, index) => (
                  <div key={index} className="flex items-center gap-3 p-3.5 rounded-xl bg-white border border-[#FDE68A]/60">
                    <span className="text-amber-500 font-bold text-base">✔</span>
                    <span className="text-sm font-bold text-gray-800">{sug}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AssessmentReport;
