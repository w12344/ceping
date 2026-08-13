import React from "react";
import { Upload, Smartphone, Key, Bell, FileText, BarChart2, ChevronDown, UserCheck, Sparkles } from "lucide-react";

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
    <header className="sticky top-0 z-50 ffcrm-glass-header transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Brand Logo (销销乐 / 非凡测评) & Segmented Switcher */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5">
            {/* Glowing Gradient Multi-color Logo Bubble */}
            <div className="relative w-9 h-9 rounded-2xl bg-gradient-to-br from-[#FF4580] via-[#7F3BF5] to-[#3370FF] p-0.5 shadow-md shadow-purple-500/20 flex items-center justify-center">
              <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center font-black text-sm text-transparent bg-clip-text bg-gradient-to-br from-[#7F3BF5] to-[#3370FF]">
                销
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-black tracking-tight text-slate-900">
                  销销乐 · 测评平台
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-extrabold bg-purple-500/10 text-purple-600 rounded-md border border-purple-500/20">
                  BI
                </span>
              </div>
            </div>
          </div>

          {/* Segmented Mode Switcher */}
          <div className="hidden md:flex items-center ffcrm-segmented-bar text-xs">
            <button
              onClick={() => currentView !== "admin" && onNavigatePortal()}
              className={`px-3.5 py-1.5 font-bold transition-all flex items-center gap-1.5 ${
                currentView === "admin" ? "ffcrm-pill-active" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <div className="w-2 h-2 rounded-full bg-purple-500" />
              <span>老板看板</span>
            </button>
            <button
              onClick={() => currentView !== "portal" && onNavigatePortal()}
              className={`px-3.5 py-1.5 font-bold transition-all flex items-center gap-1.5 ${
                currentView === "portal" ? "ffcrm-pill-active" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Smartphone className="w-3.5 h-3.5 text-blue-500" />
              <span>发牌中心</span>
            </button>
          </div>
        </div>

        {/* Right: Actions, Year Selector, Notifications & User Avatar */}
        <div className="flex items-center gap-3">
          {/* 2027财年 Dropdown Pill */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/80 border border-slate-200/80 text-xs font-bold text-slate-700 shadow-sm">
            <span>2027财年</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </div>

          {/* Quick Upload Action */}
          <button
            onClick={onOpenUpload}
            className="px-3.5 py-1.5 text-xs font-bold text-purple-700 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 rounded-full transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
          >
            <Upload className="w-3.5 h-3.5 text-purple-600" />
            <span className="hidden sm:inline">上传 HTML 测评</span>
          </button>

          {/* Action Icon Badges */}
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-full bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 transition-all">
              <FileText className="w-4 h-4" />
            </button>
            <button className="p-2 rounded-full bg-purple-500/10 text-purple-600 hover:bg-purple-500/20 transition-all">
              <BarChart2 className="w-4 h-4" />
            </button>
            {/* Bell Notification with Red Badge 2 */}
            <div className="relative">
              <button className="p-2 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all">
                <Bell className="w-4 h-4" />
              </button>
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-mono font-black flex items-center justify-center shadow-sm">
                2
              </span>
            </div>
          </div>

          {/* User Avatar with Purple Ring */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200/80">
            <button
              onClick={onSwitchToken}
              className="flex items-center gap-2 p-1 rounded-full hover:bg-white/80 transition-all group"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 via-pink-500 to-amber-400 p-0.5 shadow-sm">
                <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center text-white text-xs font-black">
                  徐
                </div>
              </div>
              <span className="text-xs font-extrabold text-slate-800 hidden lg:inline">徐永杰</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden lg:inline" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
