import React, { useState } from "react";
import { User, Phone, ArrowRight, ArrowLeft, CheckCircle, Sparkles, Award } from "lucide-react";
import { RadarChart } from "../components/RadarChart";

const MOTIVATION_QUESTIONS = [
  { id: "M01", dim: "meaning", prompt: "对于现在学习的科目，我觉得它们对我的未来发展很有帮助。" },
  { id: "M02", dim: "meaning", prompt: "我相信在学习中获得的思维能力，能解决生活中的实际问题。" },
  { id: "M03", dim: "autonomy", prompt: "我可以自主安排每天的学习计划和优先级，而不是完全依赖督促。" },
  { id: "M04", dim: "autonomy", prompt: "面对感兴趣的难题，我会主动深入探索，而不是只做要求的作业。" },
  { id: "M05", dim: "efficacy", prompt: "遇到没学过的新知识时，我相信通过努力自己一定能掌握它。" },
  { id: "M06", dim: "efficacy", prompt: "以往通过克服困难取得好成绩的经历，让我对自己充满信心。" },
  { id: "M07", dim: "mastery", prompt: "我掌握了适合自己的复习方法与提分对策，知道怎样效率更高。" },
  { id: "M08", dim: "mastery", prompt: "做错题后，我有一套清楚的订正与错题归因复盘总结流程。" },
  { id: "M09", dim: "relation", prompt: "在学习遇到卡顿时，我可以随时得到老师或同学的有效指导和鼓励。" },
  { id: "M10", dim: "relation", prompt: "我感受到的学习氛围是充满正面支持和共同成长的。" },
  { id: "M11", dim: "action", prompt: "坐到书桌前之后，我能迅速进入专注的答题或思考状态。" },
  { id: "M12", dim: "action", prompt: "对于制定的学习任务，我能做到今日事今日毕，不拖延。" },
  { id: "M13", dim: "emotion", prompt: "在面对重大考试或高难度任务时，我能保持情绪平稳和清醒脑力。" },
  { id: "M14", dim: "emotion", prompt: "遭遇成绩波动时，我能迅速调整心态，重新找回节奏。" }
];

export const MotivationQuiz: React.FC = () => {
  const [step, setStep] = useState<"info" | "quiz" | "report">("info");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [reportResult, setReportResult] = useState<any>(null);

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      alert("请填写学员姓名和联系电话！");
      return;
    }
    setStep("quiz");
  };

  const handleSelectOption = (value: number) => {
    const q = MOTIVATION_QUESTIONS[currentIndex];
    const newAnswers = { ...answers, [q.id]: value };
    setAnswers(newAnswers);

    if (currentIndex < MOTIVATION_QUESTIONS.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      finishAssessment(newAnswers);
    }
  };

  const finishAssessment = async (finalAnswers: Record<string, number>) => {
    let meaning = 0, autonomy = 0, efficacy = 0, mastery = 0, relation = 0, action = 0, emotion = 0;
    MOTIVATION_QUESTIONS.forEach((q) => {
      const v = (finalAnswers[q.id] || 3) * 10;
      if (q.dim === "meaning") meaning += v;
      if (q.dim === "autonomy") autonomy += v;
      if (q.dim === "efficacy") efficacy += v;
      if (q.dim === "mastery") mastery += v;
      if (q.dim === "relation") relation += v;
      if (q.dim === "action") action += v;
      if (q.dim === "emotion") emotion += v;
    });

    const scores = { meaning, autonomy, efficacy, mastery, relation, action, emotion };
    const avgScore = Math.round(Object.values(scores).reduce((a, b) => a + b, 0) / 7);

    let profileName = "自主积极型 (高动机)";
    if (avgScore < 60) profileName = "蓄能提升型 (待激活)";
    else if (avgScore < 75) profileName = "稳健进阶型 (平稳态)";

    const payload = {
      templateCode: "学习动机",
      name,
      contact: phone,
      answers: finalAnswers,
      resultData: {
        scores,
        avgScore,
        profileName,
        summary: `学员 ${name} 在学习动机测试中综合得分为 ${avgScore} 分，展现出【${profileName}】特征。建议在教学中强化目标意义感引导，并给予及时的过程性反馈。`
      }
    };

    setReportResult(payload.resultData);

    try {
      await fetch("https://ffcrm-api.1605ai.com/api/assessment/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
    } catch (e) {
      console.warn("提交提示:", e);
    } finally {
      setStep("report");
    }
  };

  const progress = Math.round(((currentIndex + 1) / MOTIVATION_QUESTIONS.length) * 100);

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 flex items-center justify-center">
      <div className="w-full max-w-2xl apple-glass-card rounded-3xl overflow-hidden shadow-2xl transition-all duration-300">
        {/* Header */}
        <div className="bg-slate-900/90 backdrop-blur-md p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-[#FFE100] to-[#F5C518] text-slate-950 flex items-center justify-center font-black text-base shadow-sm">
              凡
            </div>
            <div>
              <h2 className="text-base font-black">非凡教育 · 学习动机测评</h2>
              <p className="text-xs text-amber-400 font-medium">7 大维度自主积极力评估系统</p>
            </div>
          </div>
          {step === "quiz" && (
            <span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-mono font-bold text-amber-300">
              {currentIndex + 1} / {MOTIVATION_QUESTIONS.length}
            </span>
          )}
        </div>

        {step === "info" && (
          <form onSubmit={handleStart} className="p-8 space-y-6">
            <div className="space-y-2 text-center">
              <h3 className="text-xl font-black text-slate-900">填写学员信息开启动机诊断</h3>
              <p className="text-xs text-slate-500 font-medium">深入诊断目标感、自信心、方法掌控力与压力调试表现</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">学员姓名</label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="请输入学员姓名"
                    required
                    className="apple-glass-input w-full pl-10 pr-4 py-3 rounded-2xl text-xs outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">联系电话</label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="请输入手机号码"
                    required
                    className="apple-glass-input w-full pl-10 pr-4 py-3 rounded-2xl text-xs outline-none"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-[#FFE100] to-[#F5C518] text-slate-950 font-black text-xs rounded-full shadow-md hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <span>开始动机评估</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {step === "quiz" && (
          <div className="p-8 space-y-6">
            <div className="w-full bg-slate-200/60 h-2 rounded-full overflow-hidden">
              <div className="bg-gradient-to-r from-[#FFE100] to-[#F5C518] h-full transition-all duration-300" style={{ width: `${progress}%` }} />
            </div>

            <div className="space-y-4">
              <span className="text-xs font-bold text-amber-800 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                题目 {currentIndex + 1}
              </span>
              <h3 className="text-lg font-black text-slate-900 leading-relaxed min-h-[56px]">
                {MOTIVATION_QUESTIONS[currentIndex].prompt}
              </h3>
            </div>

            <div className="space-y-3 pt-2">
              {[
                { label: "非常符合", score: 5, color: "bg-emerald-500/10 text-emerald-900 border-emerald-500/20 hover:bg-emerald-500/20" },
                { label: "比较符合", score: 4, color: "bg-amber-500/10 text-amber-900 border-amber-500/20 hover:bg-amber-500/20" },
                { label: "一般 / 偶尔", score: 3, color: "apple-glass-pill text-slate-800 hover:bg-white/90" },
                { label: "不太符合", score: 2, color: "apple-glass-pill text-slate-800 hover:bg-white/90" },
                { label: "完全不符合", score: 1, color: "bg-rose-500/10 text-rose-900 border-rose-500/20 hover:bg-rose-500/20" }
              ].map((opt) => (
                <button
                  key={opt.score}
                  onClick={() => handleSelectOption(opt.score)}
                  className={`w-full py-3.5 px-5 rounded-2xl border text-xs font-extrabold transition-all text-left flex items-center justify-between active:scale-[0.99] ${opt.color}`}
                >
                  <span>{opt.label}</span>
                  <CheckCircle className="w-4 h-4 opacity-40" />
                </button>
              ))}
            </div>

            {currentIndex > 0 && (
              <button
                onClick={() => setCurrentIndex(currentIndex - 1)}
                className="inline-flex items-center gap-1.5 text-xs text-slate-400 font-bold hover:text-slate-900 transition-all pt-2"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>返回上一题</span>
              </button>
            )}
          </div>
        )}

        {step === "report" && reportResult && (
          <div className="p-8 space-y-6">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-amber-500/10 text-amber-600 rounded-2xl flex items-center justify-center mx-auto border border-amber-500/20">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-black text-slate-900">学习动机诊断报告已就绪</h3>
              <p className="text-xs text-slate-500 font-medium">学员: {name} ({phone})</p>
            </div>

            <div className="p-6 bg-gradient-to-br from-amber-500/10 via-amber-400/5 to-transparent border-2 border-[#FFE100] rounded-3xl space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-800 uppercase">
                <Award className="w-4 h-4 text-amber-600" />
                <span>动机驱动力类型</span>
              </div>
              <h4 className="text-3xl font-black text-amber-600">{reportResult.profileName}</h4>
              <p className="text-xs text-slate-700 leading-relaxed bg-white/80 p-4 rounded-2xl border border-amber-200/50 backdrop-blur-sm">
                {reportResult.summary}
              </p>
            </div>

            <div className="p-4 bg-slate-50/70 rounded-3xl border border-slate-200/50 flex flex-col items-center">
              <h5 className="text-xs font-bold text-slate-500 mb-3">7 大维度动机分布雷达图</h5>
              <RadarChart
                dimensions={[
                  { label: "目标感", value: reportResult.scores.meaning },
                  { label: "自主感", value: reportResult.scores.autonomy },
                  { label: "效能感", value: reportResult.scores.efficacy },
                  { label: "掌控感", value: reportResult.scores.mastery },
                  { label: "关系支持", value: reportResult.scores.relation },
                  { label: "执行力", value: reportResult.scores.action },
                  { label: "情绪压力", value: reportResult.scores.emotion }
                ]}
                size={270}
                color="#F59E0B"
              />
            </div>

            <div className="flex items-center justify-center gap-3">
              <button onClick={() => window.print()} className="apple-glass-pill px-5 py-2.5 text-slate-800 text-xs font-extrabold rounded-full hover:bg-white transition-all active:scale-95">
                打印诊断报告
              </button>
              <button onClick={() => setStep("info")} className="px-6 py-2.5 bg-gradient-to-r from-[#FFE100] to-[#F5C518] text-slate-950 text-xs font-extrabold rounded-full shadow-md hover:scale-[1.02] active:scale-95 transition-all">
                重新测试
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
