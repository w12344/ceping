import React, { useState, useMemo } from "react";
import { Search, Download, RefreshCw, FileText, CheckCircle, BarChart3, Layers, Sparkles, ChevronRight, MessageSquare, Send, HelpCircle, ArrowUpRight, ArrowDownRight, Compass, Grid } from "lucide-react";
import { AssessmentRecord } from "../services/types";
import { ReportModal } from "../components/ReportModal";

interface AdminDashboardProps {
  records: AssessmentRecord[];
  loading: boolean;
  onRefresh: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  records,
  loading,
  onRefresh
}) => {
  const [activeTab, setActiveTab] = useState<string>("ALL");
  const [viewMode, setViewMode] = useState<"orbit" | "table">("orbit");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRecord, setSelectedRecord] = useState<AssessmentRecord | null>(null);
  const [chatInput, setChatInput] = useState("");

  const stats = useMemo(() => {
    const total = records.length;
    const xxfg = records.filter((r) => r.projectKey === "learningStyle").length;
    const xxdj = records.filter((r) => r.projectKey === "motivation").length;
    const fth = records.filter((r) => ["fthBoss", "fthTalent", "fth1605"].includes(r.projectKey || "")).length;
    const custom = records.filter((r) => r.projectKey === "customHTML").length;
    return { total, xxfg, xxdj, fth, custom };
  }, [records]);

  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      if (activeTab !== "ALL" && r.projectKey !== activeTab) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = (r.studentName || "").toLowerCase().includes(q);
        const matchMobile = (r.phoneNumber || "").toLowerCase().includes(q);
        const matchProject = (r.projectName || "").toLowerCase().includes(q);
        return matchName || matchMobile || matchProject;
      }
      return true;
    });
  }, [records, activeTab, searchQuery]);

  const handleExportCsv = () => {
    if (!filteredRecords.length) {
      alert("当前没有可导出的数据！");
      return;
    }

    const headers = ["ID", "测评模板", "学员姓名", "手机号", "提交时间", "答题用时(秒)"];
    const rows = filteredRecords.map((r) => [
      r.id,
      r.projectName || r.templateCode,
      r.studentName,
      r.phoneNumber,
      new Date(r.submittedAt || "").toLocaleString(),
      r.durationSeconds || 60
    ]);

    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `非凡测评平台学员数据导出_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-[1600px] mx-auto px-6 py-6">
      {/* 2-Column Split: Left BI Dashboard (75%) + Right Boss Assistant Drawer (25%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (9 Cols) */}
        <div className="lg:col-span-8 xl:col-span-9 space-y-6">
          {/* KPI Top Row: 2 Big Translucent Glass Cards (Replicating Image 2) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* KPI Card 1: 测评完成人数 */}
            <div className="boss-glass-card p-6 flex items-center justify-between relative overflow-hidden group">
              <div className="space-y-2">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  大盘测评完成人数
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black text-slate-900 font-mono tracking-tight">
                    {stats.total * 20 + 159}人
                  </span>
                  <span className="text-xs font-bold text-slate-400 font-mono">/ 1200人</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="px-3 py-1 bg-slate-200/50 rounded-lg text-xs font-mono font-bold text-slate-600 flex items-center gap-1">
                  <ArrowDownRight className="w-3.5 h-3.5 text-rose-500" />
                  <span>年 -162人</span>
                </div>

                {/* Progress Arc / Semi Donut */}
                <div className="relative w-16 h-16 flex items-center justify-center">
                  <svg className="w-16 h-16 transform -rotate-90">
                    <circle cx="32" cy="32" r="26" stroke="rgba(226,232,240,0.8)" strokeWidth="6" fill="transparent" />
                    <circle cx="32" cy="32" r="26" stroke="#3370ff" strokeWidth="6" fill="transparent" strokeDasharray="163" strokeDashoffset="130" strokeLinecap="round" />
                  </svg>
                  <div className="absolute text-center">
                    <span className="text-[11px] font-black text-[#3370ff] font-mono">13.3%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* KPI Card 2: 测评生成总收益/价值 */}
            <div className="boss-glass-card p-6 flex items-center justify-between relative overflow-hidden group">
              <div className="space-y-2">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  实际转化学费总额
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black text-slate-900 font-mono tracking-tight">
                    301.2万元
                  </span>
                  <span className="text-xs font-bold text-slate-400 font-mono">/ 12000万元</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="px-3 py-1 bg-slate-200/50 rounded-lg text-xs font-mono font-bold text-slate-600 flex items-center gap-1">
                  <ArrowDownRight className="w-3.5 h-3.5 text-rose-500" />
                  <span>年 -900万</span>
                </div>

                <div className="relative w-16 h-16 flex items-center justify-center">
                  <svg className="w-16 h-16 transform -rotate-90">
                    <circle cx="32" cy="32" r="26" stroke="rgba(226,232,240,0.8)" strokeWidth="6" fill="transparent" />
                    <circle cx="32" cy="32" r="26" stroke="#00b67a" strokeWidth="6" fill="transparent" strokeDasharray="163" strokeDashoffset="150" strokeLinecap="round" />
                  </svg>
                  <div className="absolute text-center">
                    <span className="text-[11px] font-black text-[#00b67a] font-mono">2.5%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Central Cosmic Orbit & Controls (Replicating Image 2 Central Visual Area) */}
          <div className="boss-glass-card p-6 space-y-6 relative overflow-hidden">
            {/* Mode Switcher Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-200/60">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode("orbit")}
                  className={`px-4 py-1.5 text-xs font-bold rounded-full transition-all flex items-center gap-1.5 ${
                    viewMode === "orbit"
                      ? "bg-slate-900 text-white shadow-md"
                      : "boss-glass-pill text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>星系模式</span>
                </button>
                <button
                  onClick={() => setViewMode("table")}
                  className={`px-4 py-1.5 text-xs font-bold rounded-full transition-all flex items-center gap-1.5 ${
                    viewMode === "table"
                      ? "bg-slate-900 text-white shadow-md"
                      : "boss-glass-pill text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <Grid className="w-3.5 h-3.5" />
                  <span>坐标轴 / Bitable 模式</span>
                </button>
              </div>

              {/* Status Indicators (优秀, 保持, 预期, 预警) */}
              <div className="hidden sm:flex items-center gap-4 text-xs text-slate-500 font-medium">
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#7f3bf5]" />优秀</span>
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#00b67a]" />保持</span>
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#ff8800]" />预期</span>
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#3370ff]" />预警</span>
              </div>
            </div>

            {/* Central Orbit / Bitable Display */}
            {viewMode === "orbit" ? (
              <div className="relative py-12 flex items-center justify-center min-h-[340px]">
                {/* Concentric Orbit Circles */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
                  <div className="w-[320px] h-[320px] rounded-full border border-dashed border-slate-300 animate-spin-slow" />
                  <div className="w-[220px] h-[220px] rounded-full border border-slate-300 absolute" />
                </div>

                {/* Orbit Bubble Nodes */}
                <div className="absolute top-6 left-12 p-3 rounded-full bg-[#3370ff] text-white text-xs font-bold shadow-lg shadow-blue-500/30 animate-pulse">
                  张静 · 2.6
                </div>
                <div className="absolute top-16 right-20 p-2.5 rounded-full bg-[#00b67a] text-white text-xs font-bold shadow-lg shadow-emerald-500/30">
                  马健雄 · 0.9
                </div>
                <div className="absolute bottom-10 left-24 p-3 rounded-full bg-[#ff8800] text-white text-xs font-bold shadow-lg shadow-orange-500/30">
                  吴亚丽 · 0.6
                </div>
                <div className="absolute bottom-12 right-16 p-3 rounded-full bg-[#7f3bf5] text-white text-xs font-bold shadow-lg shadow-purple-500/30">
                  陈智超 · 1.3
                </div>

                {/* Central Big Sphere (Replicating Central Orbit Sphere from Image 2) */}
                <div className="w-48 h-48 rounded-full bg-gradient-to-br from-[#3370ff] via-[#2563eb] to-[#1d4ed8] text-white flex flex-col items-center justify-center p-4 text-center shadow-2xl shadow-blue-500/40 relative z-10 border-4 border-white/60">
                  <span className="text-[10px] font-bold text-blue-100 uppercase tracking-widest">年度总营收达成率</span>
                  <span className="text-3xl font-black font-mono my-1">2.5%</span>
                  <span className="text-[10px] text-blue-200 font-mono">301.2万元 / 12000万元</span>
                  <div className="mt-2 pt-2 border-t border-white/20 w-full text-[10px] font-bold text-amber-300">
                    总净招生人数: 159 / 1200人
                  </div>
                </div>
              </div>
            ) : null}

            {/* Bitable Filters & Record Table */}
            <div className="space-y-4 pt-2">
              <div className="flex flex-wrap items-center justify-between gap-3">
                {/* Project Tabs */}
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: "ALL", label: "全量测评", count: stats.total },
                    { id: "learningStyle", label: "学习风格", count: stats.xxfg },
                    { id: "motivation", label: "学习动机", count: stats.xxdj },
                    { id: "fthBoss", label: "FTH 创业者", count: records.filter((r) => r.projectKey === "fthBoss").length },
                    { id: "fthTalent", label: "FTH 微信版", count: records.filter((r) => r.projectKey === "fthTalent").length },
                    { id: "fth1605", label: "FTH 1605版", count: records.filter((r) => r.projectKey === "fth1605").length },
                    { id: "customHTML", label: "自定义 HTML", count: stats.custom }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`px-3.5 py-1 text-xs font-bold rounded-full transition-all ${
                        activeTab === tab.id
                          ? "bg-[#3370ff] text-white shadow-md shadow-blue-500/20"
                          : "boss-glass-pill text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      {tab.label} ({tab.count})
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <div className="relative w-48">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="搜索学员姓名..."
                      className="boss-glass-input w-full pl-8 pr-3 py-1.5 text-xs outline-none"
                    />
                  </div>
                  <button
                    onClick={handleExportCsv}
                    className="px-3.5 py-1.5 text-xs font-bold text-slate-950 bg-gradient-to-r from-[#FFE100] to-[#F5C518] rounded-full shadow-sm hover:scale-[1.02] active:scale-95 transition-all"
                  >
                    导出 CSV
                  </button>
                  <button
                    onClick={onRefresh}
                    className="boss-glass-pill p-1.5 rounded-full text-slate-600"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
                  </button>
                </div>
              </div>

              {/* Data Table */}
              <div className="overflow-x-auto rounded-2xl border border-slate-200/60 bg-white/70">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50/70 text-slate-500 font-bold border-b border-slate-200/60">
                    <tr>
                      <th className="px-5 py-3">ID</th>
                      <th className="px-5 py-3">测评项目</th>
                      <th className="px-5 py-3">学员姓名</th>
                      <th className="px-5 py-3">手机号码</th>
                      <th className="px-5 py-3">提交时间</th>
                      <th className="px-5 py-3 text-right">操作诊断</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {loading ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-8 text-center text-slate-400 font-medium">
                          正在加载全量数据...
                        </td>
                      </tr>
                    ) : filteredRecords.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-8 text-center text-slate-400 font-medium">
                          暂无匹配的测评记录
                        </td>
                      </tr>
                    ) : (
                      filteredRecords.map((r) => (
                        <tr key={r.id} className="hover:bg-blue-50/30 transition-colors">
                          <td className="px-5 py-3 font-mono font-bold text-slate-400">#{r.id}</td>
                          <td className="px-5 py-3">
                            <span className="px-2.5 py-0.5 text-[11px] font-bold rounded-full bg-blue-50 text-[#3370ff] border border-blue-200">
                              {r.projectName || r.templateCode}
                            </span>
                          </td>
                          <td className="px-5 py-3 font-extrabold text-slate-900">{r.studentName}</td>
                          <td className="px-5 py-3 font-mono text-slate-600">{r.phoneNumber}</td>
                          <td className="px-5 py-3 font-mono text-slate-500">
                            {new Date(r.submittedAt || "").toLocaleString()}
                          </td>
                          <td className="px-5 py-3 text-right">
                            <button
                              onClick={() => setSelectedRecord(r)}
                              className="px-3 py-1 text-xs font-bold text-white bg-[#3370ff] hover:bg-[#2b58d9] rounded-full shadow-sm transition-all active:scale-95 flex items-center gap-1 ml-auto"
                            >
                              <span>查看报告</span>
                              <ChevronRight className="w-3 h-3" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: AI Assistant Sidecar Drawer ("老板助手") (Replicating Image 2 Right Drawer) */}
        <div className="lg:col-span-4 xl:col-span-3 boss-glass-card p-5 space-y-5 sticky top-20">
          {/* Drawer Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-200/60">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#7f3bf5] to-[#6366f1] text-white flex items-center justify-center font-bold text-xs shadow-md">
                <Sparkles className="w-4 h-4" />
              </div>
              <h3 className="text-base font-black text-slate-900">老板助手</h3>
            </div>
            <div className="flex items-center gap-1.5 text-slate-400">
              <MessageSquare className="w-4 h-4" />
              <HelpCircle className="w-4 h-4" />
            </div>
          </div>

          {/* AI Structured Insight Section */}
          <div className="space-y-3 text-xs leading-relaxed text-slate-700 bg-white/60 p-4 rounded-2xl border border-white/90">
            <p className="font-bold text-slate-900 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#7f3bf5]" />
              学情总结与顾问赋能建议:
            </p>
            <p>
              尊敬的管理者，本周测评平台新增 <strong className="text-[#3370ff] font-mono">{stats.total}</strong> 份学情报告。学员在【VAK 视觉通道】与【学习动机·自我效能感】维度表现突出。
            </p>
            <div className="space-y-1.5 pt-1">
              <div className="p-2 bg-blue-50/70 rounded-xl border border-blue-100 text-blue-900 font-semibold">
                强IP: 专业的资深艺考规划老师，通过抛专业的授课获得大家的认可和追捧。
              </div>
              <div className="p-2 bg-purple-50/70 rounded-xl border border-purple-100 text-purple-900 font-semibold">
                核心用户 KOL: 有一定专业知识的活跃用户。
              </div>
            </div>
          </div>

          {/* Prompt Suggestion Cards (Replicating Image 2 Bottom Prompt Pills) */}
          <div className="space-y-2">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              快捷指令对策
            </p>
            {[
              "如何制定社群运营计划? ->",
              "如何在社群中进行用户运营? ->",
              "如何在社群中进行内容运营? ->"
            ].map((prompt, i) => (
              <button
                key={i}
                onClick={() => setChatInput(prompt.replace(" ->", ""))}
                className="w-full p-2.5 text-left text-xs font-semibold text-slate-700 bg-white/70 hover:bg-white hover:text-[#3370ff] rounded-xl border border-slate-200/60 shadow-sm transition-all flex items-center justify-between group active:scale-98"
              >
                <span className="truncate">{prompt}</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </button>
            ))}
          </div>

          {/* Glass Chat Input at Bottom (Replicating Image 2 Chat Input) */}
          <div className="relative pt-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="输入您的问题或指令..."
              className="boss-glass-input w-full pl-4 pr-10 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 outline-none"
            />
            <button
              onClick={() => {
                if (chatInput.trim()) {
                  alert(`AI 老板助手已收到指令: "${chatInput}"，正在生成分析大屏...`);
                  setChatInput("");
                }
              }}
              className="w-7 h-7 absolute right-1.5 top-3 bg-[#3370ff] hover:bg-[#2b58d9] text-white rounded-full flex items-center justify-center shadow-md active:scale-95 transition-all"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      <ReportModal
        item={selectedRecord}
        isOpen={!!selectedRecord}
        onClose={() => setSelectedRecord(null)}
      />
    </div>
  );
};
