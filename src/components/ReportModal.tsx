import React from "react";
import { X } from "lucide-react";
import { AssessmentRecord } from "../services/types";

interface ReportModalProps {
  item: AssessmentRecord | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({ item, isOpen, onClose }) => {
  if (!isOpen || !item) return null;

  const isCustomHtml = item.projectKey === "customHTML" || !!item.customUrl;
  const customPath = item.customUrl || `/custom/${encodeURIComponent(item.templateCode)}/index.html`;
  const iframeSrc = `${customPath}?mobile=${encodeURIComponent(item.phoneNumber || "")}&preview=1&embed=1&previewId=${item.id}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-amber-100">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-amber-50/60">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold text-[#1E2066]">
              {item.studentName} · 测评诊断报告
            </h2>
            <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full border ${item.projectTagClass}`}>
              {item.projectName || item.templateCode}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-[#FFFDF6]">
          {isCustomHtml ? (
            <iframe
              src={iframeSrc}
              className="w-full h-[75vh] border-0 rounded-xl shadow-inner bg-white"
              title={`${item.studentName} · 自定义测评诊断报告`}
            />
          ) : (
            <div className="space-y-6">
              {/* 学员档案卡 */}
              <div className="bg-white border border-amber-200 rounded-xl p-5 shadow-sm">
                <h3 className="text-xs font-bold text-amber-800 mb-3 flex items-center gap-1.5">
                  <span>📋</span> 学员基本档案
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-xs text-gray-700">
                  <div><span className="text-gray-400">学员姓名:</span> <strong className="text-gray-900">{item.studentName}</strong></div>
                  <div><span className="text-gray-400">联系电话:</span> <strong className="text-gray-900">{item.phoneNumber}</strong></div>
                  <div><span className="text-gray-400">年级/专向:</span> <strong className="text-gray-900">{item.grade || "通用年级"}</strong></div>
                  <div><span className="text-gray-400">测评模板:</span> <strong className="text-amber-700">{item.projectName}</strong></div>
                  <div><span className="text-gray-400">提交时间:</span> <strong className="text-gray-900">{new Date(item.submittedAt || "").toLocaleString()}</strong></div>
                  <div><span className="text-gray-400">记录 ID:</span> <code className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-600">#{item.id}</code></div>
                </div>
              </div>

              {/* 核心诊断结论 */}
              <div className="bg-white border-2 border-[#FFE100] rounded-xl p-6 shadow-md">
                <div className="text-[11px] font-bold text-amber-800 tracking-wider uppercase mb-1">DIAGNOSIS CONCLUSION</div>
                <div className="text-xl font-black text-[#1E2066] mb-3">
                  {item.resultData?.profileName || item.resultData?.styleType || "标准化诊断分析完成"}
                </div>
                <p className="text-xs text-gray-700 leading-relaxed bg-amber-50/50 p-4 rounded-lg border-l-4 border-[#FFE100]">
                  {item.resultData?.summary || item.resultData?.suggestion || `基于非凡教育科学测评体系，学员 ${item.studentName} 的测评结果已成功归因落盘。更多细分维度请查看原始答题记录与多端数据流动分析。`}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
