import React, { useRef } from "react";
import { X, Printer, Download, Sparkles, User, Phone, BookOpen, Clock, Award } from "lucide-react";
import { AssessmentRecord } from "../services/types";
import { RadarChart } from "./RadarChart";
import html2canvas from "html2canvas";

interface ReportModalProps {
  item: AssessmentRecord | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({ item, isOpen, onClose }) => {
  const reportRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !item) return null;

  const isCustomHtml = item.projectKey === "customHTML" || !!item.customUrl;
  const customIframeSrc = item.customUrl || `/custom/${encodeURIComponent(item.templateCode)}/index.html?mobile=${encodeURIComponent(item.phoneNumber || "")}&embed=1&preview=1`;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadImage = async () => {
    if (!reportRef.current) return;
    try {
      const currentY = window.scrollY;
      window.scrollTo(0, 0);

      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#F8FAFC",
        logging: false,
        scrollX: 0,
        scrollY: 0
      });

      window.scrollTo(0, currentY);

      const link = document.createElement("a");
      link.download = `${item.studentName}_${item.projectName}_完整诊断报告.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (err: any) {
      alert(`生成长图失败: ${err.message}`);
    }
  };

  const resultObj = item.resultData || {};
  const radarDimensions = [
    { label: "视觉通道", value: resultObj.scores?.visual || resultObj.visual || 82 },
    { label: "听觉通道", value: resultObj.scores?.auditory || resultObj.auditory || 68 },
    { label: "读写习惯", value: resultObj.scores?.reading || resultObj.reading || 75 },
    { label: "动觉体感", value: resultObj.scores?.kinesthetic || resultObj.kinesthetic || 60 },
    { label: "自主掌控", value: resultObj.scores?.autonomy || resultObj.autonomy || 78 }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-xl p-4 animate-in fade-in duration-200">
      <div className="apple-glass-card bg-white/90 w-full max-w-4xl max-h-[92vh] rounded-3xl shadow-2xl border border-white/80 flex flex-col overflow-hidden">
        {/* 顶部 Action Header */}
        <div className="px-6 py-4 border-b border-slate-200/50 bg-white/60 backdrop-blur-md flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 text-xs font-bold rounded-full border border-amber-500/20 bg-amber-500/10 text-amber-800">
              {item.projectName}
            </span>
            <h2 className="text-base font-black text-slate-900">
              {item.studentName} · 完整学情诊断报告
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="apple-glass-pill px-3.5 py-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 rounded-full transition-all active:scale-95 flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" />
              <span>打印报告</span>
            </button>
            <button
              onClick={handleDownloadImage}
              className="px-4 py-1.5 text-xs font-extrabold text-slate-950 bg-gradient-to-r from-[#FFE100] to-[#F5C518] rounded-full shadow-sm hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>导出高清长图</span>
            </button>
            <button
              onClick={onClose}
              className="apple-glass-pill p-1.5 rounded-full text-slate-400 hover:text-slate-900 transition-all active:scale-95"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 报告 Body 滚动区域 */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
          {isCustomHtml ? (
            <iframe
              src={customIframeSrc}
              className="w-full h-[75vh] border-0 rounded-2xl shadow-inner bg-white"
              title={`${item.studentName} · 自定义测评诊断`}
            />
          ) : (
            <div ref={reportRef} className="space-y-6 apple-glass-card p-8 rounded-3xl bg-white/95">
              {/* 页头品牌 Header */}
              <div className="flex items-center justify-between pb-6 border-b border-slate-200/60">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#FFE100] to-[#F5C518] flex items-center justify-center font-black text-lg text-slate-950 shadow-md">
                    凡
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900">非凡教育 · 科学诊断中心</h3>
                    <p className="text-xs text-slate-400 font-semibold tracking-wider">
                      MAKE SILENCE VOICE · 苹果风格玻璃态报告
                    </p>
                  </div>
                </div>
                <div className="text-right text-xs text-slate-400 font-mono">
                  提交时间: {new Date(item.submittedAt || "").toLocaleString()}
                </div>
              </div>

              {/* 档案信息 Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-50/70 border border-slate-200/50">
                <div className="flex items-center gap-2.5">
                  <User className="w-4 h-4 text-amber-500" />
                  <div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase">学员姓名</div>
                    <div className="text-sm font-extrabold text-slate-900">{item.studentName}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-amber-500" />
                  <div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase">联系电话</div>
                    <div className="text-sm font-extrabold text-slate-900">{item.phoneNumber}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <BookOpen className="w-4 h-4 text-amber-500" />
                  <div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase">测评学科</div>
                    <div className="text-sm font-extrabold text-slate-900">{item.targetSubject || "综合学情"}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-amber-500" />
                  <div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase">答题用时</div>
                    <div className="text-sm font-extrabold text-slate-900">{item.durationSeconds || 120} 秒</div>
                  </div>
                </div>
              </div>

              {/* 核心诊断结论高亮框 */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-500/10 via-amber-400/5 to-transparent border-2 border-[#FFE100] shadow-sm relative overflow-hidden">
                <div className="flex items-center gap-2 text-xs font-black text-amber-800 uppercase tracking-widest mb-1">
                  <Award className="w-4 h-4 text-amber-600" />
                  <span>DIAGNOSIS PROFILE RESULT</span>
                </div>
                <h4 className="text-2xl font-black text-amber-600 mb-3">
                  {resultObj.profileName || resultObj.type || "主导通道特质型"}
                </h4>
                <p className="text-sm text-slate-700 leading-relaxed bg-white/80 p-4 rounded-xl border border-amber-200/50 backdrop-blur-sm">
                  {resultObj.summary || resultObj.comment || `基于非凡教育评估体系，学员 ${item.studentName} 在 ${item.projectName} 测试中表现出高度清晰的认知通道特征。建议顾问在授课与刷题指导中，优先采用图解、结构思维导图及互动探讨方式进阶提升。`}
                </p>
              </div>

              {/* 矢量雷达图分析 */}
              <div className="p-6 rounded-2xl bg-slate-50/70 border border-slate-200/50 flex flex-col items-center justify-center">
                <h5 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">
                  多维能力与通道分布雷达图
                </h5>
                <RadarChart dimensions={radarDimensions} size={280} color="#F59E0B" />
              </div>

              {/* 页脚落款 */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                <div>小凡教育科技评估中心 · 让沉默发声</div>
                <div className="font-mono">RECORD ID: #{item.id}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
