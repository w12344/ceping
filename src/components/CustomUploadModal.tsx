import React, { useState } from "react";
import { X, Upload, CheckCircle2, AlertCircle } from "lucide-react";
import { saveCustomTemplate } from "../services/api";

interface CustomUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const CustomUploadModal: React.FC<CustomUploadModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [templateCode, setTemplateCode] = useState("");
  const [projectName, setProjectName] = useState("");
  const [category, setCategory] = useState<"PRE_SALE" | "POST_SALE">("PRE_SALE");
  const [file, setFile] = useState<File | null>(null);
  const [statusText, setStatusText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!templateCode || !projectName || !file) {
      alert("请填写测评代码、名称并选择 HTML 文件！");
      return;
    }

    setIsSubmitting(true);
    setStatusText(`正在上架部署「${projectName}」...`);

    try {
      saveCustomTemplate({
        templateCode,
        projectName,
        category,
        fileName: file.name,
        customUrl: `/custom/${encodeURIComponent(templateCode)}/index.html`,
        uploadedAt: new Date().toISOString()
      });

      setStatusText(`成功发布！测评「${projectName}」（${templateCode}）已接入非凡统一测评平台！`);
      setTimeout(() => {
        setIsSubmitting(false);
        setStatusText("");
        onSuccess();
        onClose();
      }, 1000);
    } catch (err: any) {
      setIsSubmitting(false);
      setStatusText(`发布异常: ${err.message}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-amber-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-amber-50/50">
          <div className="flex items-center gap-2">
            <Upload className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-bold text-[#1E2066]">
              自定义 HTML 测评快速上架
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              测评代码 (Template Code)
            </label>
            <input
              type="text"
              value={templateCode}
              onChange={(e) => setTemplateCode(e.target.value)}
              placeholder="例如: 物理诊断 或 MathQuiz"
              required
              className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              测评名称 (Project Title)
            </label>
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="例如: 2026 高考物理提分障碍诊断"
              required
              className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              业务场景分类
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm"
            >
              <option value="PRE_SALE">🛒 成交前测评 (痛点唤醒 / 引流留存 / 顾问提分抓手)</option>
              <option value="POST_SALE">🎓 成交后测评 (深度学情 / 进门诊断 / 学练机推送)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              选择 HTML 测评文件 (.html)
            </label>
            <input
              type="file"
              accept=".html,.htm"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              required
              className="w-full p-2 text-xs border border-dashed border-gray-300 rounded-lg bg-gray-50 focus:outline-none"
            />
            <p className="text-[11px] text-gray-500 mt-1.5 leading-relaxed">
              提示: 请确保上传的 HTML 文件内部已引入 <code className="text-amber-800 bg-amber-50 px-1 py-0.5 rounded">&lt;script src="assets/ceping-bridge.js"&gt;&lt;/script&gt;</code>，提交数据时调用 <code className="text-amber-800 bg-amber-50 px-1 py-0.5 rounded">FeifanAssessment.submit(...)</code> 即可自动写入统一数据库。
            </p>
          </div>

          {statusText && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-medium border border-indigo-100">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>{statusText}</span>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 text-xs font-extrabold text-amber-950 bg-[#FFE100] hover:bg-amber-300 rounded-lg shadow-sm transition-all disabled:opacity-50"
            >
              {isSubmitting ? "正在部署..." : "确认发布上线测评"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
