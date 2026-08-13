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
    <header className="bg-white border-b border-amber-200 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src="/assets/van_school_logo.png"
            alt="非凡 VAN SCHOOL Logo"
            className="h-10 w-auto rounded-lg shadow-sm border border-amber-100 object-contain"
          />
          <div>
            <h1 className="text-lg font-extrabold text-[#1E2066] leading-tight">
              非凡测评平台 · 统一管理中心
            </h1>
            <p className="text-xs text-amber-700 font-semibold">
              科学诊断与数据大屏管理系统
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenUpload}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-lg hover:bg-indigo-100 transition-all shadow-sm"
          >
            <Upload className="w-4 h-4" />
            <span>上传自定义 HTML 测评</span>
          </button>

          <button
            onClick={onNavigatePortal}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-amber-800 bg-amber-50 border border-amber-200 rounded-lg hover:bg-amber-100 transition-all shadow-sm"
          >
            <Smartphone className="w-4 h-4 text-amber-600" />
            <span>{currentView === "admin" ? "测评分发中心与二维码" : "返回管理数据看板"}</span>
          </button>

          <button
            onClick={onSwitchToken}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-700 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-all"
          >
            <Key className="w-3.5 h-3.5 text-gray-500" />
            <span>{token ? "设置密钥" : "未授权登录"}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
