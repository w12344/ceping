import React from "react";
import { Upload, Smartphone, Key, Bell, ChevronDown, LayoutGrid, FileSpreadsheet, BarChart2, Sparkles } from "lucide-react";

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
    <header className="px-6 py-3 border-b border-white/80 boss-glass-header sticky top-0 z-50">
      <div className="max-w-[1600px] mx-auto flex items-center justify-between">
        {/* Left: 销销乐 Brand Logo + Dropdown Badge */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5 cursor-pointer">
            <div className="flex items-center -space-x-1">
              <span className="w-3.5 h-3.5 rounded-full bg-[#3370ff] shadow-sm" />
              <span className="w-3.5 h-3.5 rounded-full bg-[#7f3bf5] opacity-90 shadow-sm" />
              <span className="w-3.5 h-3.5 rounded-full bg-[#00b67a] opacity-80 shadow-sm" />
            </div>
            <h1 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-1.5">
              销销乐 <span className="text-xs font-bold text-slate-400 font-mono">· 测评中台</span>
            </h1>
          </div>

          <div className="h-4 w-px bg-slate-300/60" />

          {/* View Dropdown Pill */}
          <div className="boss-glass-pill px-3.5 py-1.5 flex items-center gap-2 text-xs font-bold text-slate-800 shadow-sm cursor-pointer hover:bg-white/80">
            <LayoutGrid className="w-3.5 h-3.5 text-[#3370ff]" />
            <span>老板看板</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </div>
        </div>

        {/* Right: Year Picker, BI Icons, Notifications, User Pill & Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenUpload}
            className="boss-glass-pill px-3.5 py-1.5 text-xs font-bold text-slate-700 hover:text-[#3370ff] flex items-center gap-1.5 shadow-sm"
          >
            <Upload className="w-3.5 h-3.5 text-[#3370ff]" />
            <span>上传 HTML 测评</span>
          </button>

          <button
            onClick={onNavigatePortal}
            className="px-4 py-1.5 text-xs font-bold text-slate-950 bg-gradient-to-r from-[#FFE100] to-[#F5C518] rounded-full shadow-md shadow-amber-500/15 hover:shadow-lg transition-all active:scale-95 flex items-center gap-1.5"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>{currentView === "admin" ? "分发中心与二维码" : "返回老板看板"}</span>
          </button>

          <div className="boss-glass-pill px-3 py-1.5 text-xs font-bold text-slate-700 flex items-center gap-1.5 cursor-pointer">
            <span>2027财年</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </div>

          <div className="flex items-center gap-1">
            <button className="boss-glass-pill p-2 text-slate-600 hover:text-slate-900 rounded-full">
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            </button>
            <button className="boss-glass-pill p-2 text-slate-600 hover:text-slate-900 rounded-full">
              <BarChart2 className="w-4 h-4 text-[#3370ff]" />
            </button>
            <button className="boss-glass-pill p-2 text-slate-600 hover:text-slate-900 rounded-full relative">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
            </button>
          </div>

          {/* User Profile Pill */}
          <div
            onClick={onSwitchToken}
            className="boss-glass-pill pl-1.5 pr-3 py-1 flex items-center gap-2 text-xs font-bold text-slate-800 shadow-sm cursor-pointer hover:bg-white/80"
          >
            <div className="w-6 h-6 rounded-full bg-[#7f3bf5] text-white flex items-center justify-center font-bold text-[11px]">
              徐
            </div>
            <span>徐永杰</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </div>
        </div>
      </div>
    </header>
  );
};
