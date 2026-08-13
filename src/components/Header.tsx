import React from "react";
import { Upload, Smartphone, Key } from "lucide-react";

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
    <header className="bg-white border-b border-[#E5E6EB] sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-3">
          <img
            src="/assets/van_school_logo.png"
            alt="非凡 VAN SCHOOL Logo"
            className="h-9 w-auto rounded-lg object-contain border border-slate-100"
          />
          <div className="flex items-center gap-2">
            <h1 className="text-base font-bold text-[#1F2329] tracking-tight">
              非凡测评平台
            </h1>
            <span className="px-2 py-0.5 text-[11px] font-semibold bg-[#E8F3FF] text-[#3370FF] rounded-md">
              统一管理中心
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenUpload}
            className="feishu-button-secondary px-3.5 py-2 text-xs font-medium flex items-center gap-1.5"
          >
            <Upload className="w-3.5 h-3.5 text-[#646A73]" />
            <span>上传自定义 HTML 测评</span>
          </button>

          <button
            onClick={onNavigatePortal}
            className="feishu-button-primary px-4 py-2 text-xs font-semibold flex items-center gap-1.5 shadow-sm"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>{currentView === "admin" ? "测评分发中心与二维码" : "返回管理看板"}</span>
          </button>

          <button
            onClick={onSwitchToken}
            className="p-2 text-[#646A73] hover:text-[#1F2329] hover:bg-[#F2F3F5] rounded-lg transition-colors"
            title="设置密钥 Token"
          >
            <Key className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
