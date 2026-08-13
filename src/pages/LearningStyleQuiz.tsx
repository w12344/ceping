import React, { useState } from "react";
import { User, Phone, ArrowRight, ArrowLeft, CheckCircle, Sparkles, Award, Printer, Download } from "lucide-react";
import { RadarChart } from "../components/RadarChart";
import staticQuestions from "../../learning-style-assessment/public/assets/static-questions.json";

export const LearningStyleQuiz: React.FC = () => {
  const [step, setStep] = useState<"info" | "quiz" | "report">("info");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reportResult, setReportResult] = useState<any>(null);

  const questions = staticQuestions.slice(0, 24); // 24 题核心测评

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
      // 答题结束，计算并提交
      finishAssessment(newAnswers);
    }
  };

  const finishAssessment = async (finalAnswers: Record<string, number>) => {
    setIsSubmitting(true);

    // 计算 VAK 分数
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
    <div className="min-h-screen bg-[#FFFDF6] flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl border border-amber-200 overflow-hidden">
        {/* 页头 */}
        <div className="bg-gradient-to-r from-[#1E2066] to-[#2D3092] p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#FFE100] text-amber-950 flex items-center justify-center font-black text-lg">
              凡
            </div>
            <div>
              <h2 className="text-lg font-black">非凡教育 · 学习风格测评</h2>
              <p className="text-xs text-amber-300 font-semibold">VAK 认知感知通道诊断系统</p>
            </div>
          </div>
          {step === "quiz" && (
            <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-mono font-bold text-[#FFE100]">
              {currentIndex + 1} / {questions.length}
            </span>
          )}
        </div>

        {/* 步骤 1: 录入学员基本档案 */}
        {step === "info" && (
          <form onSubmit={handleStart} className="p-8 space-y-6">
            <div className="space-y-2 text-center">
              <h3 className="text-xl font-black text-[#1E2066]">填写基本信息开启科学诊断</h3>
              <p className="text-xs text-gray-500">只需 2 分钟，即可发现最适合您的专属提分与学习路径</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-extrabold text-gray-700 uppercase mb-1">学员姓名</label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="请输入学员姓名"
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-gray-700 uppercase mb-1">联系电话</label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-400" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="请输入手机号码"
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-[#FFE100] hover:bg-amber-300 text-amber-950 font-black text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>开始回答诊断题目</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* 步骤 2: 答题控制 */}
        {step === "quiz" && (
          <div className="p-8 space-y-6">
            {/* 进度条 */}
            <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#FFE100] h-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="space-y-4">
              <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                题目 {currentIndex + 1}
              </span>
              <h3 className="text-lg font-black text-gray-900 leading-relaxed min-h-[56px]">
                {questions[currentIndex].prompt}
              </h3>
            </div>

            {/* 5 点量表按钮 */}
            <div className="space-y-2.5 pt-2">
              {[
                { label: "非常符合", score: 5, color: "bg-emerald-50 text-emerald-900 border-emerald-300 hover:bg-emerald-100" },
                { label: "比较符合", score: 4, color: "bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100" },
                { label: "一般 / 偶尔", score: 3, color: "bg-gray-50 text-gray-800 border-gray-300 hover:bg-gray-100" },
                { label: "不太符合", score: 2, color: "bg-gray-50 text-gray-800 border-gray-300 hover:bg-gray-100" },
                { label: "完全不符合", score: 1, color: "bg-rose-50 text-rose-900 border-rose-300 hover:bg-rose-100" }
              ].map((opt) => (
                <button
                  key={opt.score}
                  onClick={() => handleSelectOption(opt.score)}
                  className={`w-full py-3 px-4 rounded-xl border text-sm font-extrabold transition-all text-left flex items-center justify-between shadow-sm ${opt.color}`}
                >
                  <span>{opt.label}</span>
                  <CheckCircle className="w-4 h-4 opacity-40" />
                </button>
              ))}
            </div>

            {currentIndex > 0 && (
              <button
                onClick={() => setCurrentIndex(currentIndex - 1)}
                className="inline-flex items-center gap-1.5 text-xs text-gray-500 font-bold hover:text-gray-800 transition-all pt-2"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>返回上一题</span>
              </button>
            )}
          </div>
        )}

        {/* 步骤 3: 报告展现 */}
        {step === "report" && reportResult && (
          <div className="p-8 space-y-6">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-amber-100 text-amber-700 rounded-2xl flex items-center justify-center mx-auto">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-black text-[#1E2066]">诊断报告已即时生成</h3>
              <p className="text-xs text-gray-500">提交学员: {name} ({phone})</p>
            </div>

            <div className="p-6 bg-amber-50/50 border-2 border-[#FFE100] rounded-2xl space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-800 uppercase">
                <Award className="w-4 h-4 text-amber-600" />
                <span>学习风格主导类型</span>
              </div>
              <h4 className="text-3xl font-black text-amber-600">{reportResult.profileName}</h4>
              <p className="text-xs text-gray-700 leading-relaxed bg-white p-4 rounded-xl border border-amber-100">
                {reportResult.summary}
              </p>
            </div>

            {/* 雷达图 */}
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 flex flex-col items-center">
              <h5 className="text-xs font-bold text-gray-500 mb-3">VAK 四维得分图谱</h5>
              <RadarChart
                dimensions={[
                  { label: "视觉型", value: reportResult.scores.visual },
                  { label: "听觉型", value: reportResult.scores.auditory },
                  { label: "读写型", value: reportResult.scores.reading },
                  { label: "动觉型", value: reportResult.scores.kinesthetic }
                ]}
                size={260}
              />
            </div>

            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => window.print()}
                className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-extrabold rounded-xl transition-all"
              >
                打印诊断报告
              </button>
              <button
                onClick={() => setStep("info")}
                className="px-5 py-2.5 bg-[#FFE100] hover:bg-amber-300 text-amber-950 text-xs font-extrabold rounded-xl transition-all"
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
