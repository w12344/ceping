import React, { useState } from "react";
import { User, Phone, ArrowRight, ArrowLeft, CheckCircle, Sparkles, Award } from "lucide-react";
import { RadarChart } from "../components/RadarChart";
import staticQuestions from "../assets/static-questions.json";

export const LearningStyleQuiz: React.FC = () => {
  const [step, setStep] = useState<"info" | "quiz" | "report">("info");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reportResult, setReportResult] = useState<any>(null);

  const questions = staticQuestions.slice(0, 24);

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      alert("请填写学员姓名和联系电话！");
      return;
    }
    setStep("quiz");
  };

  const handleSelectOption = (value: number) => {
    const q = questions[currentIndex];
    const newAnswers = { ...answers, [q.id]: value };
    setAnswers(newAnswers);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      finishAssessment(newAnswers);
    }
  };

  const finishAssessment = async (finalAnswers: Record<string, number>) => {
    setIsSubmitting(true);

    let vScore = 0, aScore = 0, rScore = 0, kScore = 0;
    questions.forEach((q) => {
      const val = finalAnswers[q.id] || 3;
      if (q.preference === "V") vScore += val * 5;
      if (q.preference === "A") aScore += val * 5;
      if (q.preference === "R") rScore += val * 5;
      if (q.preference === "K") kScore += val * 5;
    });

    const maxVal = Math.max(vScore, aScore, rScore, kScore);
    let profileName = "视觉主导型";
    if (maxVal === aScore) profileName = "听觉倾听型";
    if (maxVal === rScore) profileName = "读写逻辑型";
    if (maxVal === kScore) profileName = "动觉体验型";

    const resultPayload = {
      templateCode: "学习风格",
      name: name,
      contact: phone,
      answers: finalAnswers,
      resultData: {
        scores: {
          visual: vScore,
          auditory: aScore,
          reading: rScore,
          kinesthetic: kScore
        },
        profileName,
        summary: `根据测试，学员 ${name} 在学习信息吸收中展现出高度显著的【${profileName}】特征。建议授课老师优先使用结构图解、声音探讨与例题演练等匹配策略。`
      }
    };

    setReportResult(resultPayload.resultData);

    try {
      await fetch("https://ffcrm-api.1605ai.com/api/assessment/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(resultPayload)
      });
    } catch (e) {
      console.warn("网络提交落盘提示:", e);
    } finally {
      setIsSubmitting(false);
      setStep("report");
    }
  };

  const progress = Math.round(((currentIndex + 1) / questions.length) * 100);

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
              <h2 className="text-base font-black">非凡教育 · 学习风格测评</h2>
              <p className="text-xs text-amber-400 font-medium">VAK 认知感知通道诊断系统</p>
            </div>
          </div>
          {step === "quiz" && (
            <span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-mono font-bold text-amber-300">
              {currentIndex + 1} / {questions.length}
            </span>
          )}
        </div>

        {/* Step 1: Info */}
        {step === "info" && (
          <form onSubmit={handleStart} className="p-8 space-y-6">
            <div className="space-y-2 text-center">
              <h3 className="text-xl font-black text-slate-900">填写基本信息开启科学诊断</h3>
              <p className="text-xs text-slate-500 font-medium">只需 2 分钟，即可发现最适合您的专属提分与学习路径</p>
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
              <span>开始回答诊断题目</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* Step 2: Quiz */}
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
                {questions[currentIndex].prompt}
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

        {/* Step 3: Report */}
        {step === "report" && reportResult && (
          <div className="p-8 space-y-6">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-amber-500/10 text-amber-600 rounded-2xl flex items-center justify-center mx-auto border border-amber-500/20">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-black text-slate-900">诊断报告已即时生成</h3>
              <p className="text-xs text-slate-500 font-medium">提交学员: {name} ({phone})</p>
            </div>

            <div className="p-6 bg-gradient-to-br from-amber-500/10 via-amber-400/5 to-transparent border-2 border-[#FFE100] rounded-3xl space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-800 uppercase">
                <Award className="w-4 h-4 text-amber-600" />
                <span>学习风格主导类型</span>
              </div>
              <h4 className="text-3xl font-black text-amber-600">{reportResult.profileName}</h4>
              <p className="text-xs text-slate-700 leading-relaxed bg-white/80 p-4 rounded-2xl border border-amber-200/50 backdrop-blur-sm">
                {reportResult.summary}
              </p>
            </div>

            <div className="p-4 bg-slate-50/70 rounded-3xl border border-slate-200/50 flex flex-col items-center">
              <h5 className="text-xs font-bold text-slate-500 mb-3">VAK 四维得分图谱</h5>
              <RadarChart
                dimensions={[
                  { label: "视觉型", value: reportResult.scores.visual },
                  { label: "听觉型", value: reportResult.scores.auditory },
                  { label: "读写型", value: reportResult.scores.reading },
                  { label: "动觉型", value: reportResult.scores.kinesthetic }
                ]}
                size={260}
                color="#F59E0B"
              />
            </div>

            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => window.print()}
                className="apple-glass-pill px-5 py-2.5 text-slate-800 text-xs font-extrabold rounded-full hover:bg-white transition-all active:scale-95"
              >
                打印诊断报告
              </button>
              <button
                onClick={() => setStep("info")}
                className="px-6 py-2.5 bg-gradient-to-r from-[#FFE100] to-[#F5C518] text-slate-950 text-xs font-extrabold rounded-full shadow-md hover:scale-[1.02] active:scale-95 transition-all"
              >
                重新测试
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
