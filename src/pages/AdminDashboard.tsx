import React, { useState, useMemo } from "react";
import { Search, Download, RefreshCw, FileText, CheckCircle, BarChart3, Layers, Sparkles, ChevronRight, TrendingUp } from "lucide-react";
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
      {/* FFCRM-H5 KPI Cards Grid (4 大 Card) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="ff-glass-card p-5 flex items-center justify-between group">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">全量测评总报告</p>
            <h3 className="text-3xl font-black text-[#1f2329] mt-1 font-mono tracking-tight">{stats.total}</h3>
            <p className="text-[11px] text-blue-600 font-semibold mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> FFCRM-H5 数据洞察大屏
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-[#3370ff] group-hover:scale-110 transition-transform">
            <BarChart3 className="w-6 h-6" />
          </div>
        </div>

        <div className="ff-glass-card p-5 flex items-center justify-between group">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">学习风格测评</p>
            <h3 className="text-3xl font-black text-[#1f2329] mt-1 font-mono tracking-tight">{stats.xxfg}</h3>
            <p className="text-[11px] text-emerald-600 font-semibold mt-1">VAK 感官通道诊断</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
            <FileText className="w-6 h-6" />
          </div>
        </div>

        <div className="ff-glass-card p-5 flex items-center justify-between group">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">学习动机测评</p>
            <h3 className="text-3xl font-black text-[#1f2329] mt-1 font-mono tracking-tight">{stats.xxdj}</h3>
            <p className="text-[11px] text-amber-600 font-semibold mt-1">7 大维度自主积极力</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 group-hover:scale-110 transition-transform">
            <CheckCircle className="w-6 h-6" />
          </div>
        </div>

        <div className="ff-glass-card p-5 flex items-center justify-between group">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">FTH 特质与自定义</p>
            <h3 className="text-3xl font-black text-[#1f2329] mt-1 font-mono tracking-tight">{stats.fth + stats.custom}</h3>
            <p className="text-[11px] text-purple-600 font-semibold mt-1">创业者/微信/1605/自定义</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-600 group-hover:scale-110 transition-transform">
            <Layers className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* 控制栏与项目 Filter */}
      <div className="ff-glass-card p-5 space-y-4">
        {/* Bitable Style Tabs */}
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
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all duration-200 ${
                activeTab === tab.id
                  ? "bg-[#3370ff] text-white shadow-md shadow-blue-500/20 scale-[1.02]"
                  : "ff-glass-pill text-slate-600 hover:text-slate-900"
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {/* 搜索与工具按钮 */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索学员姓名、手机号、测评项目..."
              className="ff-glass-input w-full pl-9 pr-4 py-2 text-xs outline-none"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={handleExportCsv}
              className="px-4 py-2 text-xs font-bold text-white bg-[#3370ff] hover:bg-[#2b58d9] rounded-full shadow-sm hover:shadow-md transition-all active:scale-95 flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>导出 CSV</span>
            </button>
            <button
              onClick={onRefresh}
              className="ff-glass-pill px-3.5 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 rounded-full transition-all active:scale-95 flex items-center gap-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
              <span>刷新</span>
            </button>
          </div>
        </div>
      </div>

      {/* 数据表格区 (FFCRM-H5 Bitable Grid) */}
      <div className="ff-glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/70 border-b border-slate-200/80 text-slate-600 font-extrabold uppercase tracking-wider">
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
                  <tr key={r.id} className="hover:bg-blue-50/40 transition-all duration-150">
                    <td className="px-6 py-4 font-mono font-bold text-slate-400">#{r.id}</td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 text-[11px] font-bold rounded-md border border-blue-500/20 bg-blue-50 text-blue-600">
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
                        className="px-3 py-1.5 text-xs font-extrabold text-white bg-[#3370ff] hover:bg-[#2b58d9] rounded-full shadow-sm transition-all flex items-center gap-1 ml-auto active:scale-95"
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

      <ReportModal
        item={selectedRecord}
        isOpen={!!selectedRecord}
        onClose={() => setSelectedRecord(null)}
      />
    </div>
  );
};
