import React, { useState, useEffect, useMemo, useRef } from "react";
import { getFFCRMContextFromUrl } from "../utils/url";
import { submitAssessmentPayload } from "../services/api";
import { QUESTIONS } from "../utils/reportEngine";

const FOREIGN_LANGUAGES = ["英语", "日语", "其他"];
const ALL_SUBJECTS = ["语文", "数学", "英语", "日语", "物理", "化学", "生物", "政治", "历史", "地理"];

export const LearningStyleAssessment: React.FC = () => {
  const [viewStep, setViewStep] = useState<"start" | "basic" | "questions">("start");

  // 表单状态
  const [studentName, setStudentName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [grade, setGrade] = useState("高三");
  const [specialtyDirection, setSpecialtyDirection] = useState("美术设计");
  const [foreignLanguage, setForeignLanguage] = useState("英语");
  const [targetSubject, setTargetSubject] = useState("语文");
  const [learningLevel, setLearningLevel] = useState("稳定提升");

  // 答题状态：questionId -> optionIds[]
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // 顾问下拉框状态
  const [advisorName, setAdvisorName] = useState(() => {
    if (typeof window === "undefined") return "";
    const params = new URLSearchParams(window.location.search || "");
    const hash = window.location.hash || "";
    const hashParams = new URLSearchParams(hash.includes("?") ? hash.split("?")[1] : "");
    const fromUrl = (params.get("advisorName") || params.get("employeeName") || hashParams.get("advisorName") || hashParams.get("employeeName") || "").trim();
    return fromUrl;
  });
  const [advisorDropdownOpen, setAdvisorDropdownOpen] = useState(false);
  const [advisorList, setAdvisorList] = useState<string[]>([]);
  const advisorWrapperRef = useRef<HTMLDivElement>(null);

  const availableSubjects = useMemo(() => {
    if (!FOREIGN_LANGUAGES.includes(foreignLanguage)) return ALL_SUBJECTS;
    return ALL_SUBJECTS.filter((s) => s !== "英语" && s !== "日语").concat(foreignLanguage === "其他" ? [] : [foreignLanguage]);
  }, [foreignLanguage]);

  useEffect(() => {
    if (!availableSubjects.includes(targetSubject)) {
      setTargetSubject(availableSubjects[0] || "语文");
    }
  }, [availableSubjects, targetSubject]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent | TouchEvent) {
      if (advisorWrapperRef.current && !advisorWrapperRef.current.contains(e.target as Node)) {
        setAdvisorDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    async function loadAdvisors() {
      try {
        const isLocal = typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" || window.location.hostname === "[::1]");
        const backendBase = (window as any).ASSESSMENT_API_BASE || (isLocal ? "https://ffcrm-daily.1605ai.com" : "https://ffcrm-api.1605ai.com");
        const res = await fetch(`${backendBase}/api/assessment/advisors`);
        const json = await res.json().catch(() => ({}));
        const EXCLUDED_ADVISORS = ["用户", "顾问", "未知", "李老师", "杜雨龙"];
        const list = (json.code === 200 || json.code === 0) && Array.isArray(json.data) ? json.data : [];
        const validNames = list
          .map((a: any) => a?.name?.trim())
          .filter((name: string) => name && !EXCLUDED_ADVISORS.includes(name));
        const unique = Array.from(new Set(validNames)) as string[];
        setAdvisorList(unique);
      } catch (e) {
        console.warn("加载顾问列表失败:", e);
      }
    }
    loadAdvisors();
  }, []);

  const totalQuestions = QUESTIONS.length;
  const currentQuestion = QUESTIONS[currentIndex];
  const currentSelectedOptions = answers[currentQuestion?.id] || [];

  const completedCount = useMemo(() => {
    return Object.values(answers).filter((opts) => Array.isArray(opts) && opts.length > 0).length;
  }, [answers]);

  const handleToggleOption = (optId: string) => {
    const qid = currentQuestion.id;
    const current = new Set(answers[qid] || []);
    if (current.has(optId)) current.delete(optId);
    else current.add(optId);
    setAnswers({ ...answers, [qid]: Array.from(current) });
    setErrorMessage("");
  };

  const handleStart = () => {
    setViewStep("basic");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBasicSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim()) {
      setErrorMessage("请填写学员姓名");
      return;
    }
    if (!phoneNumber.trim()) {
      setErrorMessage("请填写联系方式");
      return;
    }
    setErrorMessage("");
    setViewStep("questions");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNext = () => {
    if (currentSelectedOptions.length === 0) {
      setErrorMessage("请至少选一项最像你平时做法的选项。");
      return;
    }
    setErrorMessage("");
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      handleSubmit();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setErrorMessage("");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    const ffcrm = getFFCRMContextFromUrl();
    const finalAdvisorName = advisorName.trim() || ffcrm?.advisor?.name || "";
    const sessionToken = "session_" + Date.now();

    const formattedAnswers = Object.entries(answers).map(([questionId, optionIds]) => ({
      questionId,
      optionIds,
      responseTimeMs: 2500
    }));

    const payload = {
      studentInfo: {
        name: studentName.trim(),
        mobile: phoneNumber.trim(),
        grade,
        specialtyDirection,
        foreignLanguage,
        targetSubject,
        learningLevel
      },
      advisorInfo: {
        token: ffcrm?.advisor?.token || "",
        name: finalAdvisorName,
        userId: ffcrm?.advisor?.userId || "",
        mobile: ffcrm?.advisor?.mobile || ""
      },
      assessmentInfo: {
        templateCode: "LEARNING_STYLE",
        templateName: "学习模式定位",
        templateType: "STUDENT_LEARNING",
        answers: formattedAnswers,
        durationSeconds: 300,
        submittedAt: new Date().toISOString(),
        reportUrl: (typeof window !== "undefined" ? window.location.origin : "https://ceping.1605ai.com") + "/report.html"
      }
    };

    let recordId: string | null = null;
    try {
      const res = await submitAssessmentPayload(payload);
      if (res && res.data) {
        recordId = res.data.id || res.data.savedId || null;
      }
    } catch (err) {
      console.warn("提交数据异常，由离线队列/本地兜底:", err);
    }

    const snapshot = {
      session: sessionToken,
      recordId,
      userInfo: {
        studentName: studentName.trim(),
        phoneNumber: phoneNumber.trim(),
        grade,
        specialtyDirection,
        foreignLanguage,
        targetSubject,
        learningLevel
      },
      answers: formattedAnswers,
      submittedAt: new Date().toISOString()
    };
    localStorage.setItem("lsa_session_" + sessionToken, JSON.stringify(snapshot));
    if (recordId) localStorage.setItem("lsa_record_" + recordId, JSON.stringify(snapshot));
    localStorage.setItem("lsa_last_record", JSON.stringify(snapshot));

    const query = recordId
      ? `id=${encodeURIComponent(recordId)}&session=${encodeURIComponent(sessionToken)}`
      : `session=${encodeURIComponent(sessionToken)}`;
    window.location.assign(`/report.html?${query}`);
  };

  const [isTestMode, setIsTestMode] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const hash = window.location.hash || "";
    const hashParams = new URLSearchParams(hash.includes("?") ? hash.split("?")[1] : "");
    if (params.get("type") === "test" || hashParams.get("type") === "test" || params.get("test") === "1" || hashParams.get("test") === "1") {
      setIsTestMode(true);
    }
  }, []);

  const handleTestAutoFill = () => {
    setStudentName("测试学员");
    setPhoneNumber("13800138000");
    setGrade("高三");
    setSpecialtyDirection("美术设计");
    setForeignLanguage("英语");
    setTargetSubject("语文");
    setLearningLevel("稳定提升");

    const mockAns: Record<string, string[]> = {};
    QUESTIONS.forEach((q: any, idx: number) => {
      const opt = q.options[idx % q.options.length] || q.options[0];
      mockAns[q.id] = [opt.id];
    });
    setAnswers(mockAns);
    setCurrentIndex(QUESTIONS.length - 1);
    setViewStep("questions");
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      {/* Brand Header */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-30 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center font-bold text-slate-950">凡</div>
          <div>
            <div className="text-sm font-bold text-slate-200">非凡教育 · 学习模式定位</div>
            <div className="text-xs text-slate-400">定位最顺手的学习入口</div>
          </div>
        </div>
        {isTestMode && (
          <button
            type="button"
            onClick={handleTestAutoFill}
            className="px-3 py-1 bg-amber-500/20 border border-amber-500 text-amber-300 hover:bg-amber-500/30 text-xs font-bold rounded-lg cursor-pointer flex items-center space-x-1"
          >
            <span>⚡ 快速填入</span>
          </button>
        )}
      </header>

      {/* Main View Flow */}
      <main className="flex-1 max-w-3xl w-full mx-auto p-4 md:p-6 flex flex-col justify-center">
        {viewStep === "start" && (
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6 md:p-8 backdrop-blur text-center space-y-6">
            <span className="inline-block px-3 py-1 bg-amber-500/10 text-amber-400 text-xs font-semibold rounded-full border border-amber-500/20">
              精准诊断 · 科学赋能
            </span>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white">学习模式定位测评</h1>
            <p className="text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
              从平时真实的学习反应出发，找到自己更顺手的学习优势；遇到学习任务时，知道可以从哪儿下手。
            </p>

            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto py-2">
              <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                <div className="text-lg font-bold text-amber-400">6–8 分钟</div>
                <div className="text-xs text-slate-400">预计完成时间</div>
              </div>
              <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                <div className="text-lg font-bold text-amber-400">20 题</div>
                <div className="text-xs text-slate-400">每题可多选</div>
              </div>
            </div>

            <div className="text-left bg-slate-900/40 p-4 rounded-xl border border-slate-800/80 space-y-2 text-xs text-slate-300">
              <div className="font-semibold text-slate-200">作答前请知道：</div>
              <div>• <strong>没有标准答案</strong>：每题可以选一个，也可以选几个。选最贴近你平时会做的。</div>
              <div>• <strong>客观描述</strong>：结果描述的是当前顺手入口，不评价学习能力高低。</div>
            </div>

            <button
              onClick={handleStart}
              className="w-full max-w-xs mx-auto py-3 px-6 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl shadow-lg transition-transform active:scale-98 cursor-pointer"
            >
              开始定位测评 →
            </button>
          </div>
        )}

        {viewStep === "basic" && (
          <form onSubmit={handleBasicSubmit} className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6 md:p-8 backdrop-blur space-y-6">
            <div className="border-b border-slate-700/60 pb-4">
              <h2 className="text-xl font-bold text-white">01 先确定这次要解决什么</h2>
              <p className="text-xs text-slate-400 mt-1">一次只生成一门学科的报告，为您量身定制行动建议。</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">姓名 <span className="text-rose-400">*</span></label>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="请输入你的姓名"
                  className="w-full bg-slate-900/80 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">联系方式 <span className="text-rose-400">*</span></label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="请输入手机号或微信号"
                  className="w-full bg-slate-900/80 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                  required
                />
              </div>
            </div>

            <div ref={advisorWrapperRef} className="relative">
              <label className="block text-xs font-medium text-slate-300 mb-1">
                归属顾问 <span className="text-slate-500">(选填)</span>
              </label>
              <div
                onClick={() => setAdvisorDropdownOpen(!advisorDropdownOpen)}
                className="w-full bg-slate-900/80 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white flex items-center justify-between cursor-pointer"
              >
                <span className={advisorName ? "text-white" : "text-slate-500"}>
                  {advisorName || "请选择归属顾问（选填）"}
                </span>
                <span className="text-slate-400 text-xs">▼</span>
              </div>
              {advisorDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 max-h-48 overflow-y-auto bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-20">
                  <div
                    onClick={() => { setAdvisorName(""); setAdvisorDropdownOpen(false); }}
                    className="px-3 py-2 text-xs text-slate-400 hover:bg-slate-700 cursor-pointer"
                  >
                    不选择顾问
                  </div>
                  {advisorList.length > 0 ? (
                    advisorList.map((adv) => (
                      <div
                        key={adv}
                        onClick={() => { setAdvisorName(adv); setAdvisorDropdownOpen(false); }}
                        className="px-3 py-2 text-xs text-white hover:bg-amber-500/20 hover:text-amber-300 cursor-pointer"
                      >
                        {adv}
                      </div>
                    ))
                  ) : (
                    <div className="px-3 py-2 text-xs text-slate-500 text-center">暂无可选择顾问</div>
                  )}
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-2">年级 <span className="text-rose-400">*</span></label>
              <div className="grid grid-cols-4 gap-2">
                {["高一", "高二", "高三", "高复"].map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setGrade(g)}
                    className={`py-2 text-xs font-medium rounded-lg border transition ${grade === g ? "bg-amber-500/20 border-amber-500 text-amber-300" : "bg-slate-900/50 border-slate-700 text-slate-300 hover:border-slate-600"}`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-2">专业方向 <span className="text-rose-400">*</span></label>
              <div className="grid grid-cols-4 gap-2">
                {["美术设计", "音乐", "舞蹈", "播音表演", "书法", "体育", "其他"].map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setSpecialtyDirection(d)}
                    className={`py-2 text-xs font-medium rounded-lg border transition ${specialtyDirection === d ? "bg-amber-500/20 border-amber-500 text-amber-300" : "bg-slate-900/50 border-slate-700 text-slate-300 hover:border-slate-600"}`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-2">外语科目 <span className="text-rose-400">*</span></label>
                <div className="grid grid-cols-3 gap-2">
                  {FOREIGN_LANGUAGES.map((fl) => (
                    <button
                      key={fl}
                      type="button"
                      onClick={() => setForeignLanguage(fl)}
                      className={`py-2 text-xs font-medium rounded-lg border transition ${foreignLanguage === fl ? "bg-amber-500/20 border-amber-500 text-amber-300" : "bg-slate-900/50 border-slate-700 text-slate-300 hover:border-slate-600"}`}
                    >
                      {fl}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-2">目标学科 <span className="text-rose-400">*</span></label>
                <select
                  value={targetSubject}
                  onChange={(e) => setTargetSubject(e.target.value)}
                  className="w-full bg-slate-900/80 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                >
                  {availableSubjects.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-2">这门学科现在处于哪个阶段？ <span className="text-rose-400">*</span></label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                {[
                  { level: "基础巩固", desc: "基础知识还有缺口，基础题容易丢分" },
                  { level: "稳定提升", desc: "基础题大多会做，想突破中档题" },
                  { level: "冲刺提高", desc: "基础和中档题稳定，想冲刺高分" }
                ].map((item) => (
                  <button
                    key={item.level}
                    type="button"
                    onClick={() => setLearningLevel(item.level)}
                    className={`p-3 text-left rounded-lg border transition ${learningLevel === item.level ? "bg-amber-500/20 border-amber-500 text-amber-300" : "bg-slate-900/50 border-slate-700 text-slate-300 hover:border-slate-600"}`}
                  >
                    <div className="font-bold text-xs">{item.level}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {errorMessage && <p className="text-xs text-rose-400">{errorMessage}</p>}

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setViewStep("start")}
                className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 font-semibold rounded-xl text-sm"
              >
                返回
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold rounded-xl text-sm shadow-md"
              >
                进入作答 ➔
              </button>
            </div>
          </form>
        )}

        {viewStep === "questions" && currentQuestion && (
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6 md:p-8 backdrop-blur space-y-6">
            {/* Progress Header */}
            <div className="flex justify-end items-center text-xs text-slate-400 font-semibold">
              <span>第 {currentIndex + 1} 题 / 共 {totalQuestions} 题</span>
            </div>

            {/* Question Card */}
            <div className="space-y-4">
              <div className="space-y-1">
                <span className="text-amber-400 font-bold text-xs tracking-wider">QUESTION {String(currentIndex + 1).padStart(2, "0")}</span>
                <h2 className="text-lg md:text-xl font-bold text-white leading-snug">
                  {currentQuestion.prompt}
                </h2>
                <p className="text-xs text-slate-400">可以选一个，也可以选几个。选最贴近你平时会做的。</p>
              </div>

              {/* Options */}
              <div className="space-y-2.5 pt-2">
                {currentQuestion.options.map((opt: any, optIdx: number) => {
                  const isChecked = currentSelectedOptions.includes(opt.id);
                  const letter = String.fromCharCode(65 + optIdx);
                  return (
                    <div
                      key={opt.id}
                      onClick={() => handleToggleOption(opt.id)}
                      className={`p-3.5 rounded-xl border flex items-start space-x-3 cursor-pointer transition ${isChecked ? "bg-amber-500/20 border-amber-500 text-white shadow-sm" : "bg-slate-900/60 border-slate-700/70 text-slate-300 hover:border-slate-600"}`}
                    >
                      <div className={`w-5 h-5 rounded flex items-center justify-center font-bold text-xs mt-0.5 border ${isChecked ? "bg-amber-500 text-slate-950 border-amber-500" : "bg-slate-800 text-slate-400 border-slate-700"}`}>
                        {letter}
                      </div>
                      <div className="flex-1 text-sm leading-relaxed">{opt.text}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {errorMessage && <p className="text-xs text-rose-400">{errorMessage}</p>}

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t border-slate-700/60">
              <button
                type="button"
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:pointer-events-none border border-slate-700 text-slate-300 font-semibold rounded-xl text-sm"
              >
                上一题
              </button>
              <button
                type="button"
                onClick={handleNext}
                disabled={isSubmitting}
                className="flex-1 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl text-sm shadow-md transition"
              >
                {isSubmitting ? "正在生成报告..." : currentIndex === totalQuestions - 1 ? "完成并生成报告 ➔" : "下一题 ➔"}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
export default LearningStyleAssessment;
