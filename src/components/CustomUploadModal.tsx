import React, { useState } from "react";
import { X, Upload, CheckCircle2 } from "lucide-react";
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-xl p-4 animate-in fade-in duration-200">
      <div className="apple-glass-card bg-white/95 w-full max-w-lg rounded-3xl shadow-2xl border border-white/80 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200/50 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <Upload className="w-5 h-5 text-amber-500" />
            <h2 className="text-base font-black text-slate-900">
              自定义 HTML 测评快速上架
            </h2>
          </div>
          <button
            onClick={onClose}
            className="apple-glass-pill p-1.5 rounded-full text-slate-400 hover:text-slate-900 transition-all active:scale-95"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              测评代码 (Template Code)
            </label>
            <input
              type="text"
              value={templateCode}
              onChange={(e) => setTemplateCode(e.target.value)}
              placeholder="例如: 物理诊断 或 MathQuiz"
              required
              className="apple-glass-input w-full px-4 py-2.5 rounded-2xl text-xs outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              测评名称 (Project Title)
            </label>
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="例如: 2026 高考物理提分障碍诊断"
              required
              className="apple-glass-input w-full px-4 py-2.5 rounded-2xl text-xs outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              业务场景分类
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="apple-glass-input w-full px-4 py-2.5 rounded-2xl text-xs outline-none bg-white/80"
            >
              <option value="PRE_SALE">🛒 成交前测评 (痛点唤醒 / 引流留存 / 顾问提分抓手)</option>
              <option value="POST_SALE">🎓 成交后测评 (深度学情 / 进门诊断 / 学练机推送)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              选择 HTML 测评文件 (.html)
            </label>
            <input
              type="file"
              accept=".html,.htm"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              required
              className="apple-glass-input w-full p-3 text-xs rounded-2xl border-dashed bg-slate-50/50"
            />
            <p className="text-[11px] text-slate-500 mt-2 leading-relaxed font-medium">
              提示: 请确保上传的 HTML 文件内部引入 <code className="text-amber-700 bg-amber-50 px-1 py-0.5 rounded font-mono">&lt;script src="assets/ceping-bridge.js"&gt;&lt;/script&gt;</code>，提交数据时调用 <code className="text-amber-700 bg-amber-50 px-1 py-0.5 rounded font-mono">FeifanAssessment.submit(...)</code> 即可自动落盘。
            </p>
          </div>

          {statusText && (
            <div className="flex items-center gap-2 p-3 rounded-2xl bg-amber-500/10 text-amber-800 text-xs font-semibold border border-amber-500/20">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-amber-600" />
              <span>{statusText}</span>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="apple-glass-pill px-4 py-2.5 text-xs font-semibold text-slate-600 rounded-full hover:bg-slate-100 transition-all active:scale-95"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 text-xs font-extrabold text-slate-950 bg-gradient-to-r from-[#FFE100] to-[#F5C518] rounded-full shadow-md hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
            >
              {isSubmitting ? "正在部署..." : "确认发布上线测评"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
