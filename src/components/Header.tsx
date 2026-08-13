import React from "react";
import { Upload, Smartphone, Key, Layers, Sparkles } from "lucide-react";

interface HeaderProps {
  onOpenUpload: () => void;
  onSwitchToken: () => void;
  onNavigatePortal: () => void;
  currentView: "admin" | "portal" | string;
  token: string;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenUpload,
  onSwitchToken,
  onNavigatePortal,
  currentView,
  token
}) => {
  return (
    <header className="sticky top-0 z-50 ff-glass-header transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        {/* Left: FFCRM-H5 Brand Logo & Workspace Title */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#3370ff] to-[#2b58d9] text-white flex items-center justify-center font-black text-sm shadow-md shadow-blue-500/20">
              非
            </div>
            <img
              src="/assets/van_school_logo.png"
              alt="非凡 VAN SCHOOL Logo"
              className="h-8 w-auto rounded-lg border border-slate-200/80 object-contain shadow-sm"
            />
          </div>

          <div className="h-4 w-px bg-slate-200/80 mx-1" />

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-extrabold text-[#1f2329] tracking-tight">
                非凡测评平台 · BI 数据中台
              </h1>
              <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-blue-50 text-blue-600 border border-blue-200 rounded-md">
                FFCRM-H5
              </span>
            </div>
          </div>
        </div>

        {/* Right: Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenUpload}
            className="ff-glass-pill px-3.5 py-1.5 text-xs font-semibold text-[#373c43] hover:text-[#3370ff] flex items-center gap-1.5 shadow-sm"
          >
            <Upload className="w-3.5 h-3.5 text-[#3370ff]" />
            <span>上传 HTML 测评</span>
          </button>

          <button
            onClick={onNavigatePortal}
            className="px-3.5 py-1.5 text-xs font-bold text-white bg-[#3370ff] hover:bg-[#2b58d9] rounded-full shadow-md shadow-blue-500/20 hover:shadow-lg transition-all flex items-center gap-1.5 active:scale-95"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>{currentView === "admin" ? "发牌中心与二维码" : "返回 BI 数据看板"}</span>
          </button>

          <button
            onClick={onSwitchToken}
            className="ff-glass-pill p-1.5 text-slate-500 hover:text-slate-900 rounded-full transition-all active:scale-95"
            title="设置密钥 Token"
          >
            <Key className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
