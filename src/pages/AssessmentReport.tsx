import React, { useEffect, useState } from "react";
import { fetchAssessmentDetail, fetchAssessmentByMobile } from "../services/api";
import { scoreLearningModeAssessment, buildLearningModeReport } from "../utils/reportEngine";

export const AssessmentReport: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setErrorMsg("");

      const params = new URLSearchParams(window.location.search);
      const hash = window.location.hash || "";
      const hashParams = new URLSearchParams(hash.includes("?") ? hash.split("?")[1] : "");

      const id = params.get("id") || hashParams.get("id");
      const mobile = params.get("mobile") || hashParams.get("mobile") || params.get("customerMobile") || localStorage.getItem("lsa_last_mobile");
      const session = params.get("session") || hashParams.get("session");

      try {
        let rawRecord: any = null;

        // 1. 如果有 ID，进行最多 3 次带退避的重试查询
        if (id) {
          for (let attempt = 1; attempt <= 3; attempt++) {
            rawRecord = await fetchAssessmentDetail(id);
            if (rawRecord) break;
            if (attempt < 3) await new Promise((r) => setTimeout(r, attempt * 600));
          }
        }

        // 2. 如果 ID 查询失败但有手机号，按手机号查最新一条
        if (!rawRecord && mobile) {
          const list = await fetchAssessmentByMobile(mobile);
          if (list && list.length > 0) {
            rawRecord = list[0];
          }
        }

        // 3. 从本地 Storage 读取快照兜底
        if (!rawRecord) {
          const candidates = [
            session ? `lsa_session_${session}` : null,
            id ? `lsa_record_${id}` : null,
            id ? `lsa_session_${id}` : null,
            localStorage.getItem("lsa_last_record")
          ];
          for (const c of candidates) {
            if (!c) continue;
            const localRaw = localStorage.getItem(c) || (c.startsWith("{") ? c : null);
            if (localRaw) {
              try {
                const sessionData = JSON.parse(localRaw);
                if (sessionData && (sessionData.answers || sessionData.report)) {
                  rawRecord = {
                    customerName: sessionData.userInfo?.studentName || sessionData.name || "学员",
                    customerMobile: sessionData.userInfo?.phoneNumber || sessionData.contact || mobile || "",
                    resultJson: sessionData
                  };
                  break;
                }
              } catch (e) {}
            }
          }
        }

        if (rawRecord) {
          const resultData = typeof rawRecord.resultJson === "string" ? JSON.parse(rawRecord.resultJson) : rawRecord.resultJson || {};

          const rawAnswers = resultData.answers || rawRecord.answers || [];
          const userInfo = resultData.userInfo || resultData.studentInfo || {};
          const targetSubject = userInfo.targetSubject || resultData.targetSubject || "语文";
          const learningLevel = userInfo.learningLevel || resultData.learningLevel || "稳定提升";

          let report: any = null;
          if (resultData.radar && resultData.conclusion) {
            report = resultData;
          } else {
            const scored = scoreLearningModeAssessment(rawAnswers);
            report = buildLearningModeReport({
              scored,
              targetSubject,
              learningLevel
            });
          }

          report.studentInfo = {
            name: rawRecord.customerName || userInfo.studentName || userInfo.name || "学员",
            contact: rawRecord.customerMobile || userInfo.phoneNumber || userInfo.mobile || userInfo.contact || "--",
            grade: userInfo.grade || resultData.grade || "高三",
            targetSubject,
            learningLevel,
            anonymousCode: rawRecord.id || id || session || "LSA-SAMPLE"
          };

          setReportData(report);
        } else {
          setErrorMsg("未找到该测评报告记录。请检查报告链接或重新测评。");
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

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4 bg-slate-900 text-white">
        <div className="w-10 h-10 border-4 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-bold text-slate-300">正在生成个人学习模式定位报告...</p>
      </div>
    );
  }

  if (errorMsg || !reportData) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-slate-900">
        <div className="bg-slate-800 border border-slate-700 max-w-md w-full p-6 text-center space-y-4 rounded-2xl">
          <div className="text-4xl">⚠️</div>
          <h2 className="text-xl font-extrabold text-white">报告获取失败</h2>
          <p className="text-sm text-slate-400">{errorMsg || "未找到测评记录"}</p>
          <button
            onClick={() => (window.location.hash = "#/assessment")}
            className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-sm"
          >
            重新进行测评
          </button>
        </div>
      </div>
    );
  }

  const { studentInfo, conclusion, modeCounts, modeDetails, modeCards, learningPath, taskCard, radar } = reportData;

  const modeKeys = [
    { key: "V", name: "视觉", color: "#60A5FA" },
    { key: "A", name: "听觉", color: "#F472B6" },
    { key: "R", name: "读写", color: "#34D399" },
    { key: "K", name: "动觉", color: "#FBBF24" }
  ];

  const totalCount = Object.values(modeCounts || {}).reduce((a: any, b: any) => a + Number(b), 0) || 1;

  return (
    <div className="report-page min-h-screen bg-slate-950 text-slate-100 font-sans pb-12">
      {/* Top Header */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-30 px-4 py-3 flex items-center justify-between no-print">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center font-bold text-slate-950">凡</div>
          <div>
            <div className="text-sm font-bold text-slate-200">非凡教育 · 学习模式定位报告</div>
            <div className="text-xs text-slate-400">专属诊断分析报告</div>
          </div>
        </div>
        <button
          onClick={handlePrint}
          className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs flex items-center space-x-1.5 cursor-pointer shadow"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
          <span>打印报告</span>
        </button>
      </header>

      {/* Main Report Body */}
      <main className="max-w-6xl mx-auto p-4 md:p-6 space-y-6">
        {/* Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-700/80 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 text-center md:text-left">
            <span className="inline-block px-3 py-1 bg-amber-500/10 text-amber-400 text-xs font-semibold rounded-full border border-amber-500/20">
              LEARNING MODE POSITIONING REPORT
            </span>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white">学习模式定位报告</h1>
            <p className="text-sm text-slate-300">看清更顺手的起步方式，把它用进眼前这一门课。</p>
          </div>
        </div>

        {/* Basic Info Card */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 shadow-sm">
          <h2 className="text-xs font-bold text-slate-400 tracking-wider mb-3">基本信息</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 text-xs">
            <div className="bg-slate-800/50 p-2.5 rounded-xl border border-slate-700/50">
              <span className="text-slate-400 block mb-0.5">姓名</span>
              <strong className="text-white text-sm">{studentInfo?.name}</strong>
            </div>
            <div className="bg-slate-800/50 p-2.5 rounded-xl border border-slate-700/50">
              <span className="text-slate-400 block mb-0.5">联系方式</span>
              <strong className="text-white">{studentInfo?.contact}</strong>
            </div>
            <div className="bg-slate-800/50 p-2.5 rounded-xl border border-slate-700/50">
              <span className="text-slate-400 block mb-0.5">年级</span>
              <strong className="text-white">{studentInfo?.grade}</strong>
            </div>
            <div className="bg-slate-800/50 p-2.5 rounded-xl border border-slate-700/50">
              <span className="text-slate-400 block mb-0.5">本次学科</span>
              <strong className="text-amber-400">{studentInfo?.targetSubject}</strong>
            </div>
            <div className="bg-slate-800/50 p-2.5 rounded-xl border border-slate-700/50">
              <span className="text-slate-400 block mb-0.5">当前阶段</span>
              <strong className="text-emerald-400">{studentInfo?.learningLevel}</strong>
            </div>
            <div className="bg-slate-800/50 p-2.5 rounded-xl border border-slate-700/50">
              <span className="text-slate-400 block mb-0.5">报告编号</span>
              <strong className="text-slate-300">{studentInfo?.anonymousCode}</strong>
            </div>
          </div>
        </div>

        {/* Section 01: 先看结论 */}
        <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div className="flex items-center space-x-3 border-b border-slate-800 pb-3">
            <span className="px-2.5 py-1 bg-amber-500/20 text-amber-400 text-xs font-bold rounded-md">01</span>
            <div>
              <h2 className="text-base font-bold text-white">先看结论</h2>
              <p className="text-xs text-slate-400">定位你最顺手的信息加工通道</p>
            </div>
          </div>

          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 space-y-2">
            <span className="text-xs font-semibold text-amber-400 px-2 py-0.5 bg-amber-500/20 rounded">主要学习入口</span>
            <h3 className="text-lg font-bold text-white">{conclusion?.headline}</h3>
            <p className="text-sm text-slate-300 leading-relaxed">{conclusion?.interpretation}</p>
          </div>

          {/* Mode Bar Distribution */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {modeKeys.map((m) => {
              const val = Number(modeCounts?.[m.key] || 0);
              const pct = Math.round((val / Number(totalCount)) * 100);
              return (
                <div key={m.key} className="bg-slate-800/50 border border-slate-700/60 rounded-xl p-3 space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-slate-200">{m.name}入口</span>
                    <span className="text-slate-400">{val}次 ({pct}%)</span>
                  </div>
                  <div className="h-2 bg-slate-900 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: m.color }} />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Section 02: 学科里的学习画面 */}
        <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div className="flex items-center space-x-3 border-b border-slate-800 pb-3">
            <span className="px-2.5 py-1 bg-amber-500/20 text-amber-400 text-xs font-bold rounded-md">02</span>
            <div>
              <h2 className="text-base font-bold text-white">学科里的学习画面</h2>
              <p className="text-xs text-slate-400">用这门课里的材料和题目，看看这几种方式实际会是什么样</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {modeCards && Array.isArray(modeCards) ? modeCards.map((card: any) => (
              <div key={card.code} className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-5 space-y-3">
                <div className="flex justify-between items-start border-b border-slate-700/40 pb-2.5">
                  <div>
                    <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">{card.role || "本次学习方式"}</span>
                    <h3 className="text-base font-bold text-white mt-1.5">{card.label}</h3>
                  </div>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{card.description}</p>
                <ul className="space-y-2.5 pt-1">
                  {(card.mechanisms || []).map((sm: any) => (
                    <li key={sm.id || sm.label} className="bg-slate-900/60 border border-slate-800/80 rounded-lg p-3 space-y-1.5">
                      <div className="flex justify-between items-center">
                        <strong className="text-xs font-bold text-slate-200">{sm.label}</strong>
                        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded ${sm.status === "这次选得更多" ? "bg-amber-500/20 text-amber-300 border border-amber-500/30" : (sm.status === "这次也选到过" ? "bg-blue-500/20 text-blue-300" : "bg-slate-800 text-slate-500")}`}>
                          {sm.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300">{sm.definition}</p>
                      <p className="text-xs text-slate-400 border-t border-slate-800/60 pt-1 mt-1">{sm.subjectExample}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )) : (modeDetails && Object.entries(modeDetails).map(([key, item]: [string, any]) => (
              <div key={key} className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-4 space-y-3">
                <div className="flex justify-between items-center border-b border-slate-700/40 pb-2">
                  <h3 className="text-sm font-bold text-white">{item.name} · {item.shortSummary}</h3>
                  <span className="text-xs text-amber-400 font-semibold bg-amber-500/10 px-2 py-0.5 rounded">选过 {item.count || 0} 次</span>
                </div>
                <div className="space-y-2">
                  {(item.specificMechanisms || []).map((sm: any) => (
                    <div key={sm.name} className="text-xs space-y-1">
                      <div className="font-semibold text-slate-200">
                        {sm.name} <span className="text-slate-500 font-normal">({sm.count}次)</span>
                      </div>
                      <p className="text-slate-400 bg-slate-900/60 p-2 rounded-lg leading-relaxed">{sm.subjectExample}</p>
                    </div>
                  ))}
                </div>
              </div>
            )))}
          </div>
        </section>

        {/* Section 03: 先选学习入口 */}
        <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center space-x-3 border-b border-slate-800 pb-3">
            <span className="px-2.5 py-1 bg-amber-500/20 text-amber-400 text-xs font-bold rounded-md">03</span>
            <div>
              <h2 className="text-base font-bold text-white">先选学习入口</h2>
              <p className="text-xs text-slate-400">面对这门学科的具体任务时，可以从哪里切入</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-800/80 to-slate-800/40 border border-slate-700/70 rounded-xl p-4 space-y-2">
            <h3 className="text-sm font-bold text-amber-300">{learningPath?.title || "从顺手的入口切入"}</h3>
            <p className="text-xs text-slate-300 leading-relaxed">{learningPath?.copy}</p>
          </div>
        </section>

        {/* Section 04: 把第一步做出来 */}
        {taskCard && (
          <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center space-x-3 border-b border-slate-800 pb-3">
              <span className="px-2.5 py-1 bg-amber-500/20 text-amber-400 text-xs font-bold rounded-md">04</span>
              <div>
                <h2 className="text-base font-bold text-white">把第一步做出来</h2>
                <p className="text-xs text-slate-400">为你量身制定的学科落地行动任务卡</p>
              </div>
            </div>

            <div className="bg-slate-800/60 border border-amber-500/40 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
                <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-bold rounded">
                  {studentInfo?.learningLevel || "阶段目标"}
                </span>
                <h3 className="text-sm font-bold text-white">{taskCard.title}</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="bg-slate-900/70 p-3 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block mb-1">准备材料</span>
                  <strong className="text-slate-200">{taskCard.materials}</strong>
                </div>
                <div className="bg-slate-900/70 p-3 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block mb-1">留出时间</span>
                  <strong className="text-slate-200">{taskCard.minutes ? `${taskCard.minutes} 分钟` : "--"}</strong>
                </div>
                <div className="bg-slate-900/70 p-3 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block mb-1">完成多少</span>
                  <strong className="text-slate-200">{taskCard.quantity}</strong>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="bg-slate-900/70 p-3 rounded-lg border border-slate-800 space-y-1">
                  <span className="text-amber-400 font-semibold block">先怎么开始</span>
                  <p className="text-slate-200 leading-relaxed">{taskCard.firstStep}</p>
                </div>
                <div className="bg-slate-900/70 p-3 rounded-lg border border-slate-800 space-y-1">
                  <span className="text-slate-400 font-semibold block">接着怎么做</span>
                  <p className="text-slate-200 leading-relaxed">{taskCard.secondStep}</p>
                </div>
                {taskCard.choices && taskCard.choices.length > 0 && (
                  <div className="bg-slate-900/70 p-3 rounded-lg border border-slate-800 space-y-1">
                    <span className="text-slate-400 font-semibold block">任选一种开始</span>
                    <p className="text-slate-200 leading-relaxed">{taskCard.choices.join("；")}</p>
                  </div>
                )}
                <div className="bg-emerald-500/10 border border-emerald-500/30 p-3 rounded-lg space-y-1">
                  <span className="text-emerald-400 font-semibold block">做到什么算完成</span>
                  <p className="text-emerald-200 leading-relaxed">{taskCard.check}</p>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
};
export default AssessmentReport;
