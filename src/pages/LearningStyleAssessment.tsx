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

  const pageSize = 6;
  const totalPages = Math.ceil(STATIC_QUESTIONS.length / pageSize);

  // 初始化 URL / ctx 自动回填
  useEffect(() => {
    const ctx = getFFCRMContextFromUrl();
    if (ctx.student.name && !studentName) setStudentName(ctx.student.name);
    if (ctx.student.mobile && !phoneNumber) setPhoneNumber(ctx.student.mobile);
  }, []);

  const currentQuestions = useMemo(() => {
    const start = currentPage * pageSize;
    return STATIC_QUESTIONS.slice(start, start + pageSize);
  }, [currentPage]);

  const progressPercent = useMemo(() => {
    const answeredCount = Object.keys(answers).length;
    return Math.min(100, Math.round((answeredCount / STATIC_QUESTIONS.length) * 100));
  }, [answers]);

  // 一键秒填辅助函数
  const handleOneClickAutoFill = async () => {
    setStudentName((prev) => prev || "测试学员");
    setPhoneNumber((prev) => prev || "15765778832");
    setGrade("高三");
    setSpecialtyDirection("美术设计");
    setScoreBand("400至450");
    setForeignLanguage("英语");
    setTargetSubject("英语");
    setTargetSubjectScore("110");
    setLearningFocus("practice");

    const autoAnswers: Record<string, number> = {};
    STATIC_QUESTIONS.forEach((q) => {
      autoAnswers[q.id] = 4;
    });
    setAnswers(autoAnswers);
    setViewStep("questions");
    setCurrentPage(totalPages - 1);
  };

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

    const userInfo = {
      studentName,
      phoneNumber,
      grade,
      specialtyDirection,
      scoreBand,
      foreignLanguage,
      targetSubject,
      targetSubjectScore: Number(targetSubjectScore) || 0,
      targetSubjectFullScore: 150,
      learningFocus,
      advisorToken: ctx.advisor.token,
      advisorUserId: ctx.advisor.userId,
      advisorName: ctx.advisor.name,
      advisorMobile: ctx.advisor.mobile,
      profileId: ctx.student.profileId
    };

    const payload = {
      templateCode: "学习风格",
      token: ctx.advisor.token,
      advisorToken: ctx.advisor.token,
      advisorUserId: ctx.advisor.userId,
      advisorName: ctx.advisor.name,
      advisorMobile: ctx.advisor.mobile,
      profileId: ctx.student.profileId,
      customerId: ctx.student.profileId,
      studentName,
      studentMobile: phoneNumber,
      name: studentName,
      contact: phoneNumber,
      session: sessionId,
      userInfo,
      grade,
      targetSubject,
      learningFocus,
      targetSubjectScore: Number(targetSubjectScore) || 0,
      targetSubjectFullScore: 150,
      answers: formattedAnswers,
      durationSeconds: 45,
      submittedAt: new Date().toISOString()
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
      {/* 暖黄顶部 Header Bar */}
      <header className="feifan-header sticky top-0 z-50 px-4 py-3">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="feifan-brand-logo-box">凡</div>
            <div>
              <div className="font-bold text-base text-[#1E1A1C]">非凡教育 · 文化课学习风格测评</div>
              <div className="text-xs text-amber-700 font-medium">MAKE SILENCE VOICE · 让沉默发声</div>
            </div>
          </div>
          <button
            type="button"
            onClick={handleOneClickAutoFill}
            className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#FFE100] text-[#1E1A1C] shadow-sm hover:scale-105 transition-transform"
          >
            ⚡ 极速秒填全卷
          </button>
        </div>
      </header>

      {/* 主体 Container */}
      <main className="max-w-3xl mx-auto px-4 pt-8">
        {/* Step 1: Start 引导页 */}
        {viewStep === "start" && (
          <div className="feifan-card p-6 md:p-10 space-y-6">
            <div className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900">
              LEARNING STYLE ASSESSMENT
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-[#1E1A1C] leading-tight">
              文化课学习风格<br />诊断测评
            </h1>
            <p className="text-gray-600 text-base md:text-lg leading-relaxed">
              回顾真实学习场景，看清你通常怎样接收、整理和运用信息，并获得目标学科的具体建议。
            </p>

            {/* Metrics Pills */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex items-center gap-3">
                <span className="text-2xl">⏱️</span>
                <div>
                  <div className="font-extrabold text-[#1E1A1C] text-base">8 - 10 分钟</div>
                  <div className="text-xs text-gray-500">预计完成时长</div>
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex items-center gap-3">
                <span className="text-2xl">📝</span>
                <div>
                  <div className="font-extrabold text-[#1E1A1C] text-base">42 题情境诊断</div>
                  <div className="text-xs text-gray-500">做题不评判优劣</div>
                </div>
              </div>
            </div>

            {/* Notice Block */}
            <div className="p-4 rounded-xl bg-amber-50/50 border-l-4 border-[#F5C518] text-sm text-gray-700 space-y-1.5">
              <div className="font-bold text-[#1E1A1C] flex items-center gap-1.5 mb-1">
                <span>💡</span> 作答前须知
              </div>
              <p>• 本测评没有标准答案，请按平时最常出现的真实情况作答。</p>
              <p>• 结果描述的是您当前的接收与处理信息入口，不评价个人能力。</p>
            </div>

            <button
              type="button"
              onClick={() => setViewStep("basic")}
              className="feifan-btn-primary w-full py-4 text-lg"
            >
              开始测评
            </button>
          </div>
        )}

        {/* Step 2: Basic Info 表单 */}
        {viewStep === "basic" && (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-full bg-[#FFE100] text-[#1E1A1C] font-extrabold flex items-center justify-center text-lg">01</span>
              <div>
                <h2 className="text-2xl font-extrabold text-[#1E1A1C]">基本信息</h2>
                <p className="text-sm text-gray-500">用于生成更贴近当前阶段和目标学科的诊断建议。</p>
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
                    placeholder="请输入姓名"
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
                    placeholder="请输入 11 位手机号"
                    className="w-full px-4 py-3 rounded-xl border border-amber-200 focus:border-[#F5C518] focus:ring-2 focus:ring-amber-200 outline-none transition-all text-sm"
                  />
                </div>
              </div>

              {/* 年级 Pill 选择 */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2">你现在读几年级？ *</label>
                <div className="flex flex-wrap gap-2.5">
                  {["高一", "高二", "高三", "高复"].map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setGrade(g)}
                      className={`pill-radio-label ${grade === g ? "is-active" : ""}`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              {/* 专业方向 Pill 选择 */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2">专业方向 *</label>
                <div className="flex flex-wrap gap-2.5">
                  {["美术设计", "音乐", "舞蹈", "播音表演", "书法", "体育", "其他"].map((dir) => (
                    <button
                      key={dir}
                      type="button"
                      onClick={() => setSpecialtyDirection(dir)}
                      className={`pill-radio-label ${specialtyDirection === dir ? "is-active" : ""}`}
                    >
                      {dir}
                    </button>
                  ))}
                </div>
              </div>

              {/* 文化课分数段 Pill 选择 */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2">最近一次文化课成绩 *</label>
                <div className="flex flex-wrap gap-2">
                  {["350以下", "350至400", "400至450", "450至500", "500至550", "600以上"].map((sb) => (
                    <button
                      key={sb}
                      type="button"
                      onClick={() => setScoreBand(sb)}
                      className={`pill-radio-label text-xs ${scoreBand === sb ? "is-active" : ""}`}
                    >
                      {sb}
                    </button>
                  ))}
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

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setViewStep("start")}
                  className="feifan-btn-secondary px-6 py-3"
                >
                  返回
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
                  className="feifan-btn-primary flex-1 py-3"
                >
                  进入测评
                </button>
              </div>
              {errorMessage && <p className="text-xs font-bold text-red-500">{errorMessage}</p>}
            </div>
          </div>
        )}

        {/* Step 3: Questions 答题页 */}
        {viewStep === "questions" && (
          <div className="space-y-6">
            {/* Progress Bar */}
            <div className="feifan-card p-4 space-y-2">
              <div className="flex justify-between items-center text-xs font-bold text-[#1E1A1C]">
                <span>第 {currentPage + 1} / {totalPages} 页</span>
                <span>已完成 {Object.keys(answers).length} / {STATIC_QUESTIONS.length} 题</span>
              </div>
              <div className="w-full h-3 bg-amber-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#FFE100] to-[#F5C518] transition-all duration-300 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
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
                    <div className="grid grid-cols-5 gap-1.5 pt-2">
                      {LIKERT_OPTIONS.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => handleAnswerSelect(q.id, opt.value)}
                          className={`py-2.5 px-1 rounded-xl border text-xs font-semibold flex flex-col items-center justify-center gap-1 transition-all ${
                            currentVal === opt.value
                              ? "bg-[#FFE100] border-[#F5C518] text-[#1E1A1C] font-bold shadow-md scale-105"
                              : "bg-amber-50/40 border-amber-200/80 text-gray-700 hover:bg-amber-100/50"
                          }`}
                        >
                          <span className="text-sm font-black">{opt.value}</span>
                          <span className="text-[11px] hidden sm:inline">{opt.label}</span>
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

            {/* Navigation Actions */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                disabled={currentPage === 0 || isSubmitting}
                onClick={() => {
                  setCurrentPage((prev) => Math.max(0, prev - 1));
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="feifan-btn-secondary px-6 py-3.5 disabled:opacity-40"
              >
                上一页
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleNextPage}
                className="feifan-btn-primary flex-1 py-3.5 text-base"
              >
                {isSubmitting
                  ? "提交诊断中..."
                  : currentPage === totalPages - 1
                  ? "完成作答并生成报告"
                  : "下一页"}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default LearningStyleAssessment;
