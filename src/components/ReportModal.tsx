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
        backgroundColor: "#FFFDF6",
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

  // 动态解构维度得分
  const resultObj = item.resultData || {};
  const radarDimensions = [
    { label: "视觉入口", value: resultObj.scores?.visual || resultObj.visual || 82 },
    { label: "听觉通道", value: resultObj.scores?.auditory || resultObj.auditory || 68 },
    { label: "读写习惯", value: resultObj.scores?.reading || resultObj.reading || 75 },
    { label: "动觉体感", value: resultObj.scores?.kinesthetic || resultObj.kinesthetic || 60 },
    { label: "自主掌控", value: resultObj.scores?.autonomy || resultObj.autonomy || 78 }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-4xl max-h-[92vh] rounded-3xl shadow-2xl border border-amber-100 flex flex-col overflow-hidden">
        {/* 顶部 Action Header */}
        <div className="px-6 py-4 border-b border-amber-100 bg-[#FFFDF5] flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 text-xs font-bold rounded-full border ${item.projectTagClass}`}>
              {item.projectName}
            </span>
            <h2 className="text-base font-extrabold text-[#1E2066]">
              {item.studentName} · 完整学情诊断分析报告
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all shadow-sm"
            >
              <Printer className="w-3.5 h-3.5 text-gray-500" />
              <span>打印报告</span>
            </button>
            <button
              onClick={handleDownloadImage}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-extrabold text-amber-950 bg-[#FFE100] hover:bg-amber-300 rounded-lg transition-all shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>高清长图导出</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 报告 Body 滚动区域 */}
        <div className="flex-1 overflow-y-auto p-6 bg-[#FFFDF6]">
          {isCustomHtml ? (
            <iframe
              src={customIframeSrc}
              className="w-full h-[75vh] border-0 rounded-2xl shadow-inner bg-white"
              title={`${item.studentName} · 自定义测评诊断`}
            />
          ) : (
            <div ref={reportRef} className="space-y-6 bg-white p-8 rounded-2xl border border-amber-200/70 shadow-sm">
              {/* 页头品牌 Header */}
              <div className="flex items-center justify-between pb-6 border-b border-amber-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FFE100] to-amber-400 flex items-center justify-center font-black text-lg text-[#1E2066] shadow-sm">
                    凡
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-[#1E2066]">非凡教育 · 科学学情诊断中心</h3>
                    <p className="text-xs text-amber-700 font-semibold tracking-wider">
                      MAKE SILENCE VOICE · 让沉默发声
                    </p>
                  </div>
                </div>
                <div className="text-right text-xs text-gray-400 font-mono">
                  提交时间: {new Date(item.submittedAt || "").toLocaleString()}
                </div>
              </div>

              {/* 档案信息 Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-amber-50/60 border border-amber-100">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-amber-600" />
                  <div>
                    <div className="text-[10px] text-gray-400 font-bold uppercase">学员姓名</div>
                    <div className="text-sm font-extrabold text-gray-900">{item.studentName}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-amber-600" />
                  <div>
                    <div className="text-[10px] text-gray-400 font-bold uppercase">联系电话</div>
                    <div className="text-sm font-extrabold text-gray-900">{item.phoneNumber}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-amber-600" />
                  <div>
                    <div className="text-[10px] text-gray-400 font-bold uppercase">测评学科</div>
                    <div className="text-sm font-extrabold text-gray-900">{item.targetSubject || "综合学情"}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-600" />
                  <div>
                    <div className="text-[10px] text-gray-400 font-bold uppercase">答题用时</div>
                    <div className="text-sm font-extrabold text-gray-900">{item.durationSeconds || 120} 秒</div>
                  </div>
                </div>
              </div>

              {/* 核心诊断结论高亮框 */}
              <div className="p-6 rounded-2xl bg-white border-2 border-[#FFE100] shadow-md relative overflow-hidden">
                <div className="absolute -right-4 -bottom-4 opacity-5 text-amber-500">
                  <Sparkles className="w-32 h-32" />
                </div>
                <div className="flex items-center gap-2 text-xs font-black text-amber-800 uppercase tracking-widest mb-1">
                  <Award className="w-4 h-4 text-amber-600" />
                  <span>DIAGNOSIS PROFILE RESULT</span>
                </div>
                <h4 className="text-2xl font-black text-amber-600 mb-3">
                  {resultObj.profileName || resultObj.type || "主导通道特质型"}
                </h4>
                <p className="text-sm text-gray-700 leading-relaxed bg-amber-50/50 p-4 rounded-xl border border-amber-100">
                  {resultObj.summary || resultObj.comment || `基于非凡教育评估体系，学员 ${item.studentName} 在 ${item.projectName} 测试中表现出高度清晰的认知通道特征。建议顾问在授课与刷题指导中，优先采用图解、结构思维导图及互动探讨方式进阶提升。`}
                </p>
              </div>

              {/* 矢量雷达图分析 */}
              <div className="p-6 rounded-2xl bg-amber-50/30 border border-amber-100 flex flex-col items-center justify-center">
                <h5 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">
                  多维能力与通道分布雷达图
                </h5>
                <RadarChart dimensions={radarDimensions} size={280} color="#D97706" />
              </div>

              {/* 页脚落款 */}
              <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
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
