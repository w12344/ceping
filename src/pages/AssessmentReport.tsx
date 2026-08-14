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
        <p className="text-sm font-bold text-gray-600">正在生成个人学习风格诊断报告...</p>
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
    <div className="min-h-screen pb-16">
      {/* 暖黄 Header */}
      <header className="feifan-header sticky top-0 z-50 px-4 py-3 no-print">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="feifan-brand-logo-box">凡</div>
            <div>
              <div className="font-bold text-base text-[#1E1A1C]">非凡教育 · 学习风格诊断报告</div>
              <div className="text-xs text-amber-700 font-medium">MAKE SILENCE VOICE</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              className="px-3 py-1.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 hover:bg-amber-200"
            >
              复制链接
            </button>
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#FFE100] text-[#1E1A1C] shadow-sm hover:scale-105"
            >
              打印/导出
            </button>
          </div>
        </div>
      </header>

      {/* 报告主体 */}
      <main className="max-w-3xl mx-auto px-4 pt-8 space-y-6">
        {/* 顶部 Header Card */}
        <div className="feifan-card p-6 md:p-8 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-amber-100 pb-4">
            <div>
              <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">DIAGNOSIS REPORT</span>
              <h1 className="text-2xl md:text-3xl font-black text-[#1E1A1C] mt-1">
                {overview.studentName} 的文化课学习风格报告
              </h1>
            </div>
            <div className="px-4 py-2 rounded-2xl bg-amber-100/70 text-amber-900 font-extrabold text-sm border border-amber-200">
              {vakScores.dominantLabel}
            </div>
          </div>

          {/* 学员档案 Pills */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-amber-50/50 border border-amber-200/60">
              <span className="text-gray-500 block">年级阶段</span>
              <strong className="text-sm font-bold text-[#1E1A1C]">{overview.grade}</strong>
            </div>
            <div className="p-3 rounded-xl bg-amber-50/50 border border-amber-200/60">
              <span className="text-gray-500 block">最想提分科目</span>
              <strong className="text-sm font-bold text-[#1E1A1C]">{overview.targetSubject}</strong>
            </div>
            <div className="p-3 rounded-xl bg-amber-50/50 border border-amber-200/60">
              <span className="text-gray-500 block">当前成绩</span>
              <strong className="text-sm font-bold text-[#1E1A1C]">{overview.targetSubjectScore} / {overview.targetSubjectFullScore} 分</strong>
            </div>
            <div className="p-3 rounded-xl bg-amber-50/50 border border-amber-200/60">
              <span className="text-gray-500 block">绑定手机</span>
              <strong className="text-sm font-bold text-[#1E1A1C]">{overview.phoneNumber || "未提供"}</strong>
            </div>
          </div>
        </div>

        {/* 核心 VAK 三维测评雷达卡片 */}
        <div className="feifan-card p-6 md:p-8 space-y-6">
          <h2 className="text-xl font-extrabold text-[#1E1A1C] flex items-center gap-2">
            <span>📊</span> VAK 信息吸收通道诊断
          </h2>

          {/* VAK 进度对比 */}
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-center space-y-1">
              <span className="text-xs font-bold text-amber-800">视觉 Visual (V)</span>
              <div className="text-2xl font-black text-[#1E1A1C]">{vakScores.V} %</div>
              <div className="w-full h-2 bg-amber-200 rounded-full overflow-hidden">
                <div className="h-full bg-[#F5C518]" style={{ width: `${vakScores.V}%` }} />
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200 text-center space-y-1">
              <span className="text-xs font-bold text-sky-800">听觉 Auditory (A)</span>
              <div className="text-2xl font-black text-[#1E1A1C]">{vakScores.A} %</div>
              <div className="w-full h-2 bg-sky-200 rounded-full overflow-hidden">
                <div className="h-full bg-sky-500" style={{ width: `${vakScores.A}%` }} />
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-1">
              <span className="text-xs font-bold text-emerald-800">动觉 Kinesthetic (K)</span>
              <div className="text-2xl font-black text-[#1E1A1C]">{vakScores.K} %</div>
              <div className="w-full h-2 bg-emerald-200 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500" style={{ width: `${vakScores.K}%` }} />
              </div>
            </div>
          </div>

          {/* 诊断结论卡片 */}
          <div className="p-5 rounded-2xl bg-amber-100/60 border border-amber-300/80 space-y-2">
            <h3 className="text-base font-extrabold text-[#1E1A1C]">{diagnosisTitle}</h3>
            <p className="text-sm text-gray-700 leading-relaxed">{diagnosisSummary}</p>
          </div>
        </div>

        {/* 提分建议卡片 */}
        <div className="feifan-card p-6 md:p-8 space-y-4">
          <h2 className="text-xl font-extrabold text-[#1E1A1C] flex items-center gap-2">
            <span>🎯</span> 核心学习习惯改进建议
          </h2>
          <div className="space-y-3">
            {keyRecommendations.map((rec, index) => (
              <div key={index} className="flex items-start gap-3 p-3.5 rounded-xl bg-amber-50/50 border border-amber-200/60">
                <span className="w-6 h-6 rounded-full bg-[#FFE100] text-[#1E1A1C] font-extrabold text-xs flex items-center justify-center shrink-0">
                  {index + 1}
                </span>
                <p className="text-sm font-semibold text-[#1E1A1C]">{rec}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 目标学科定制建议 */}
        <div className="feifan-card p-6 md:p-8 space-y-4">
          <h2 className="text-xl font-extrabold text-[#1E1A1C] flex items-center gap-2">
            <span>📘</span> 目标学科 [{subjectAdvice.subject}] 针对性突破
          </h2>
          <div className="space-y-2.5">
            {subjectAdvice.suggestions.map((sug, index) => (
              <div key={index} className="flex items-center gap-2 text-sm font-bold text-gray-800">
                <span className="text-[#F5C518]">✔</span>
                <span>{sug}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 底部按钮 */}
        <div className="flex gap-4 pt-4 no-print">
          <button
            onClick={() => (window.location.hash = "#/assessment")}
            className="feifan-btn-secondary flex-1 py-3.5"
          >
            重新测评
          </button>
          <button
            onClick={handlePrint}
            className="feifan-btn-primary flex-1 py-3.5 text-base"
          >
            导出 / 打印完整报告
          </button>
        </div>
      </main>
    </div>
  );
};

export default AssessmentReport;
