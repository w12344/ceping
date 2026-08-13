import React from "react";
import { Upload, Smartphone, Key, Sparkles } from "lucide-react";

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
    <header className="sticky top-0 z-50 apple-glass border-b border-white/60 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src="/assets/van_school_logo.png"
              alt="非凡 VAN SCHOOL Logo"
              className="h-9 w-auto rounded-xl shadow-md border border-white/80 object-contain"
            />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-black text-slate-900 tracking-tight">
                非凡测评平台
              </h1>
              <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-amber-500/10 text-amber-700 border border-amber-500/20 rounded-full">
                v2.0 Glass
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">
              Apple-Style Assessment & Intelligence Engine
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenUpload}
            className="apple-glass-pill px-3.5 py-2 text-xs font-semibold text-slate-800 hover:text-amber-700 hover:bg-white/90 transition-all active:scale-95 flex items-center gap-1.5 shadow-sm"
          >
            <Upload className="w-3.5 h-3.5 text-amber-500" />
            <span>上传 HTML 测评</span>
          </button>

          <button
            onClick={onNavigatePortal}
            className="px-4 py-2 text-xs font-extrabold text-slate-950 bg-gradient-to-r from-[#FFE100] to-[#F5C518] rounded-full shadow-md shadow-amber-500/15 hover:shadow-lg hover:shadow-amber-500/25 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-1.5"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>{currentView === "admin" ? "分发中心与二维码" : "返回管理数据看板"}</span>
          </button>

          <button
            onClick={onSwitchToken}
            className="apple-glass-pill p-2 text-slate-500 hover:text-slate-900 rounded-full transition-all active:scale-95"
            title="设置密钥 Token"
          >
            <Key className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
