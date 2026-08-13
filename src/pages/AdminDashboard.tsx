import React, { useState, useMemo } from "react";
import { Search, Download, RefreshCw, FileText, CheckCircle, BarChart3, Layers, Sparkles, ChevronRight } from "lucide-react";
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

  // 核心统计指标计算
  const stats = useMemo(() => {
    const total = records.length;
    const xxfg = records.filter((r) => r.projectKey === "learningStyle").length;
    const xxdj = records.filter((r) => r.projectKey === "motivation").length;
    const fth = records.filter((r) => ["fthBoss", "fthTalent", "fth1605"].includes(r.projectKey || "")).length;
    const custom = records.filter((r) => r.projectKey === "customHTML").length;
    return { total, xxfg, xxdj, fth, custom };
  }, [records]);

  // 过滤记录列表
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

  // 导出 CSV
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* 概览卡片区 (4 大 Apple Glass 核心 Card) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="apple-glass-card p-5 rounded-3xl transition-all duration-300 flex items-center justify-between group">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">全量测评总报告</p>
            <h3 className="text-3xl font-black text-slate-900 mt-1 tracking-tight">{stats.total}</h3>
            <p className="text-[11px] text-amber-600 font-medium mt-1 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> 全量数据大屏实时收录
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 group-hover:scale-110 transition-transform">
            <BarChart3 className="w-6 h-6" />
          </div>
        </div>

        <div className="apple-glass-card p-5 rounded-3xl transition-all duration-300 flex items-center justify-between group">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">学习风格测评</p>
            <h3 className="text-3xl font-black text-slate-900 mt-1 tracking-tight">{stats.xxfg}</h3>
            <p className="text-[11px] text-emerald-600 font-medium mt-1">VAK 感官通道分析</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
            <FileText className="w-6 h-6" />
          </div>
        </div>

        <div className="apple-glass-card p-5 rounded-3xl transition-all duration-300 flex items-center justify-between group">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">学习动机测评</p>
            <h3 className="text-3xl font-black text-slate-900 mt-1 tracking-tight">{stats.xxdj}</h3>
            <p className="text-[11px] text-indigo-600 font-medium mt-1">7 大维度自主积极力</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
            <CheckCircle className="w-6 h-6" />
          </div>
        </div>

        <div className="apple-glass-card p-5 rounded-3xl transition-all duration-300 flex items-center justify-between group">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">FTH 特质与自定义</p>
            <h3 className="text-3xl font-black text-slate-900 mt-1 tracking-tight">{stats.fth + stats.custom}</h3>
            <p className="text-[11px] text-purple-600 font-medium mt-1">创业者/微信/1605/自定义</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-600 group-hover:scale-110 transition-transform">
            <Layers className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* 控制栏与项目 Filter */}
      <div className="apple-glass-card p-6 rounded-3xl space-y-4">
        {/* Apple Glass Pill Tabs */}
        <div className="flex flex-wrap gap-2 pb-4 border-b border-slate-200/50">
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
              className={`px-4 py-2 text-xs font-semibold rounded-full transition-all duration-300 ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-[#FFE100] to-[#F5C518] text-slate-950 shadow-md shadow-amber-500/20 scale-[1.03]"
                  : "apple-glass-pill text-slate-600 hover:text-slate-900 hover:bg-white/80"
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {/* 搜索与工具按钮 */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索学员姓名、手机号、测评项目..."
              className="apple-glass-input w-full pl-10 pr-4 py-2.5 rounded-full text-xs transition-all outline-none"
            />
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <button
              onClick={handleExportCsv}
              className="px-4 py-2.5 text-xs font-bold text-slate-950 bg-gradient-to-r from-[#FFE100] to-[#F5C518] rounded-full shadow-md shadow-amber-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>导出 CSV</span>
            </button>
            <button
              onClick={onRefresh}
              className="apple-glass-pill px-4 py-2.5 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-white/90 rounded-full transition-all active:scale-95 flex items-center gap-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
              <span>刷新</span>
            </button>
          </div>
        </div>
      </div>

      {/* 数据表格区 */}
      <div className="apple-glass-card rounded-3xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/50 border-b border-slate-200/50 text-slate-500 font-semibold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">测评项目</th>
                <th className="px-6 py-4">学员姓名</th>
                <th className="px-6 py-4">手机号码</th>
                <th className="px-6 py-4">提交时间</th>
                <th className="px-6 py-4 text-right">操作诊断</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/60">
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
                  <tr key={r.id} className="hover:bg-white/60 transition-all duration-200">
                    <td className="px-6 py-4 font-mono font-bold text-slate-400">#{r.id}</td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 text-[11px] font-bold rounded-full border border-amber-500/20 bg-amber-500/10 text-amber-800">
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
                        className="px-3.5 py-1.5 text-xs font-extrabold text-slate-950 bg-gradient-to-r from-[#FFE100] to-[#F5C518] hover:shadow-md hover:scale-[1.03] active:scale-95 rounded-full transition-all flex items-center gap-1 ml-auto shadow-sm"
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

      {/* 报告预览 Modal */}
      <ReportModal
        item={selectedRecord}
        isOpen={!!selectedRecord}
        onClose={() => setSelectedRecord(null)}
      />
    </div>
  );
};
