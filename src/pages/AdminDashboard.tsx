import React, { useState, useMemo } from "react";
import { Search, Download, RefreshCw, FileText, CheckCircle, BarChart3, Layers, Sparkles, ChevronRight, MessageSquare, Send } from "lucide-react";
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
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRecord, setSelectedRecord] = useState<AssessmentRecord | null>(null);

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* FFCRM-H5 销销乐 Boss Summary Cards Grid (with Circular Progress Arc Gauges) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI Card 1: Total Reports */}
        <div className="ffcrm-glass-card p-5 flex items-center justify-between relative overflow-hidden group">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">全量测评总报告</span>
            <div className="flex items-baseline gap-2 mt-1">
              <h3 className="text-3xl font-black text-slate-900 font-mono tracking-tight">{stats.total}</h3>
              <span className="text-xs text-slate-400 font-medium">/ 1000 份</span>
            </div>
            <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-100 text-[11px] font-semibold text-slate-600">
              <span>完成度</span>
              <span className="text-blue-600 font-bold">13.3%</span>
            </div>
          </div>
          {/* Blue Circular Arc Progress Gauge */}
          <div className="relative w-14 h-14 flex items-center justify-center">
            <svg className="w-14 h-14 -rotate-90" viewBox="0 0 36 36">
              <path className="text-slate-200" strokeWidth="3.5" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              <path className="text-blue-500" strokeDasharray="65, 100" strokeWidth="3.5" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            </svg>
            <span className="absolute text-[10px] font-mono font-black text-blue-600">13.3%</span>
          </div>
        </div>

        {/* KPI Card 2: Learning Style */}
        <div className="ffcrm-glass-card p-5 flex items-center justify-between relative overflow-hidden group">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">学习风格测评</span>
            <div className="flex items-baseline gap-2 mt-1">
              <h3 className="text-3xl font-black text-slate-900 font-mono tracking-tight">{stats.xxfg}</h3>
              <span className="text-xs text-slate-400 font-medium">/ 500 份</span>
            </div>
            <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-50 text-[11px] font-semibold text-emerald-700">
              <span>VAK 认知通道</span>
            </div>
          </div>
          <div className="relative w-14 h-14 flex items-center justify-center">
            <svg className="w-14 h-14 -rotate-90" viewBox="0 0 36 36">
              <path className="text-slate-200" strokeWidth="3.5" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              <path className="text-emerald-500" strokeDasharray="45, 100" strokeWidth="3.5" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            </svg>
            <span className="absolute text-[10px] font-mono font-black text-emerald-600">62.5%</span>
          </div>
        </div>

        {/* KPI Card 3: Motivation */}
        <div className="ffcrm-glass-card p-5 flex items-center justify-between relative overflow-hidden group">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">学习动机测评</span>
            <div className="flex items-baseline gap-2 mt-1">
              <h3 className="text-3xl font-black text-slate-900 font-mono tracking-tight">{stats.xxdj}</h3>
              <span className="text-xs text-slate-400 font-medium">/ 500 份</span>
            </div>
            <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-amber-50 text-[11px] font-semibold text-amber-700">
              <span>目标感达成</span>
              <span className="text-amber-600 font-bold">2.5%</span>
            </div>
          </div>
          {/* Orange Circular Arc Gauge */}
          <div className="relative w-14 h-14 flex items-center justify-center">
            <svg className="w-14 h-14 -rotate-90" viewBox="0 0 36 36">
              <path className="text-slate-200" strokeWidth="3.5" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              <path className="text-amber-500" strokeDasharray="30, 100" strokeWidth="3.5" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            </svg>
            <span className="absolute text-[10px] font-mono font-black text-amber-600">2.5%</span>
          </div>
        </div>

        {/* KPI Card 4: FTH Talent */}
        <div className="ffcrm-glass-card p-5 flex items-center justify-between relative overflow-hidden group">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">FTH 特质与自定义</span>
            <div className="flex items-baseline gap-2 mt-1">
              <h3 className="text-3xl font-black text-slate-900 font-mono tracking-tight">{stats.fth + stats.custom}</h3>
              <span className="text-xs text-slate-400 font-medium">/ 300 份</span>
            </div>
            <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-purple-50 text-[11px] font-semibold text-purple-700">
              <span>创业者/微信/1605</span>
            </div>
          </div>
          <div className="relative w-14 h-14 flex items-center justify-center">
            <svg className="w-14 h-14 -rotate-90" viewBox="0 0 36 36">
              <path className="text-slate-200" strokeWidth="3.5" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              <path className="text-purple-500" strokeDasharray="50, 100" strokeWidth="3.5" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            </svg>
            <span className="absolute text-[10px] font-mono font-black text-purple-600">50.0%</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Data Table & Right AI Assistant Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left 3 Columns: Table & Controls */}
        <div className="lg:col-span-3 space-y-5">
          {/* FFCRM Segmented Filter Tabs & Search */}
          <div className="ffcrm-glass-card p-5 space-y-4">
            <div className="flex flex-wrap gap-2 pb-3 border-b border-slate-200/60">
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
                  className={`px-3.5 py-1.5 text-xs transition-all duration-200 ${
                    activeTab === tab.id
                      ? "ffcrm-pill-active bg-gradient-to-r from-[#7F3BF5] to-[#3370FF] text-white shadow-md shadow-purple-500/20"
                      : "px-3.5 py-1.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-white/60"
                  }`}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="搜索学员姓名、手机号、测评项目..."
                  className="ffcrm-glass-input w-full pl-9 pr-4 py-2 text-xs outline-none"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  onClick={handleExportCsv}
                  className="px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-[#7F3BF5] to-[#3370FF] hover:shadow-md rounded-full shadow-sm transition-all active:scale-95 flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>导出 CSV</span>
                </button>
                <button
                  onClick={onRefresh}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white/80 border border-slate-200/80 hover:bg-white rounded-full transition-all active:scale-95 flex items-center gap-1.5"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
                  <span>刷新</span>
                </button>
              </div>
            </div>
          </div>

          {/* Bitable Style Data Table */}
          <div className="ffcrm-glass-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100/70 border-b border-slate-200/80 text-slate-500 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-3.5">ID</th>
                    <th className="px-6 py-3.5">测评项目</th>
                    <th className="px-6 py-3.5">学员姓名</th>
                    <th className="px-6 py-3.5">手机号码</th>
                    <th className="px-6 py-3.5">提交时间</th>
                    <th className="px-6 py-3.5 text-right">操作诊断</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/60">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-slate-400 font-medium">
                        正在加载全量测评数据...
                      </td>
                    </tr>
                  ) : filteredRecords.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-slate-400 font-medium">
                        暂无匹配的测评记录
                      </td>
                    </tr>
                  ) : (
                    filteredRecords.map((r) => (
                      <tr key={r.id} className="hover:bg-purple-50/40 transition-all duration-150">
                        <td className="px-6 py-4 font-mono font-bold text-slate-400">#{r.id}</td>
                        <td className="px-6 py-4">
                          <span className="px-2.5 py-1 text-[11px] font-bold rounded-md border border-purple-500/20 bg-purple-50 text-purple-700">
                            {r.projectName || r.templateCode}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-bold text-slate-900">{r.studentName}</td>
                        <td className="px-6 py-4 font-mono text-slate-600">{r.phoneNumber}</td>
                        <td className="px-6 py-4 text-slate-500 font-mono">
                          {new Date(r.submittedAt || "").toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => setSelectedRecord(r)}
                            className="px-3.5 py-1.5 text-xs font-extrabold text-white bg-gradient-to-r from-[#7F3BF5] to-[#3370FF] hover:shadow-md rounded-full shadow-sm transition-all flex items-center gap-1 ml-auto active:scale-95"
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

        {/* Right 1 Column: FFCRM-H5 "老板助手" AI Drawer Panel */}
        <div className="lg:col-span-1 space-y-4">
          <div className="ffcrm-glass-card p-5 h-full flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200/60 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-pulse" />
                  <h4 className="text-sm font-black text-slate-900">老板助手 AI</h4>
                </div>
                <Sparkles className="w-4 h-4 text-purple-600" />
              </div>

              <p className="text-xs text-slate-600 leading-relaxed bg-white/80 p-3.5 rounded-2xl border border-slate-200/60">
                您好，我是学情诊断助手。您可以通过自然语言指令查询全量学员提分瓶颈或学情提效建议。
              </p>

              {/* Prompt Suggestion Pills */}
              <div className="space-y-2 pt-1">
                {[
                  "如何根据 VAK 风格优化课程安排？",
                  "如何针对待激活学员做动机复盘？",
                  "导出高风险学员名单并分析归因"
                ].map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => alert(`AI 助手思考中: ${prompt}`)}
                    className="w-full text-left p-2.5 rounded-xl bg-slate-100/70 hover:bg-purple-50 text-slate-700 hover:text-purple-700 text-[11px] font-semibold transition-all border border-slate-200/50 flex items-center justify-between group"
                  >
                    <span className="truncate">{prompt}</span>
                    <ChevronRight className="w-3 h-3 text-slate-400 group-hover:text-purple-600 flex-shrink-0" />
                  </button>
                ))}
              </div>
            </div>

            {/* Input Box */}
            <div className="pt-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="输入您的问题或指令..."
                  className="ffcrm-glass-input w-full pl-3.5 pr-10 py-2 text-xs outline-none"
                />
                <button className="absolute right-2 top-1.5 p-1 rounded-lg bg-gradient-to-r from-[#7F3BF5] to-[#3370FF] text-white hover:opacity-90 transition-opacity">
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
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
