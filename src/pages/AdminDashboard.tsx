import React, { useState, useMemo } from "react";
import { Search, Download, RefreshCw, FileText, CheckCircle, BarChart3, Layers } from "lucide-react";
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
      // Tab 匹配
      if (activeTab !== "ALL" && r.projectKey !== activeTab) {
        return false;
      }
      // 搜索过滤
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
      {/* 概览卡片区 (4 大核心 Card) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-amber-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">全量测评总报告</p>
            <h3 className="text-3xl font-black text-[#1E2066] mt-1">{stats.total}</h3>
            <p className="text-[11px] text-amber-700 font-semibold mt-1">包含全量测评与第三方上架产物</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700">
            <BarChart3 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-emerald-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-emerald-800 uppercase tracking-wider">学习风格测评</p>
            <h3 className="text-3xl font-black text-emerald-900 mt-1">{stats.xxfg}</h3>
            <p className="text-[11px] text-emerald-700 font-semibold mt-1">VAK 目标通道与习惯归因</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700">
            <FileText className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-amber-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-amber-800 uppercase tracking-wider">学习动机测评</p>
            <h3 className="text-3xl font-black text-amber-900 mt-1">{stats.xxdj}</h3>
            <p className="text-[11px] text-amber-700 font-semibold mt-1">7 大维度自主积极力分析</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700">
            <CheckCircle className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-indigo-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-indigo-800 uppercase tracking-wider">FTH 特质与自定义</p>
            <h3 className="text-3xl font-black text-indigo-900 mt-1">{stats.fth + stats.custom}</h3>
            <p className="text-[11px] text-indigo-700 font-semibold mt-1">创业者/微信/1605/自定义测评</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-700">
            <Layers className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* 控制栏与项目 Filter */}
      <div className="bg-white p-5 rounded-2xl border border-amber-200 shadow-sm space-y-4">
        {/* Project Tabs */}
        <div className="flex flex-wrap gap-2 pb-3 border-b border-gray-100">
          {[
            { id: "ALL", label: "全量测评", count: stats.total },
            { id: "learningStyle", label: "学习风格", count: stats.xxfg },
            { id: "motivation", label: "学习动机", count: stats.xxdj },
            { id: "fthBoss", label: "FTH 创业者", count: records.filter((r) => r.projectKey === "fthBoss").length },
            { id: "fthTalent", label: "FTH 微信版", count: records.filter((r) => r.projectKey === "fthTalent").length },
            { id: "fth1605", label: "FTH 1605版", count: records.filter((r) => r.projectKey === "fth1605").length },
            { id: "customHTML", label: "自定义 HTML 上传", count: stats.custom }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-xs font-extrabold rounded-xl transition-all ${
                activeTab === tab.id
                  ? "bg-[#FFE100] text-amber-950 shadow-sm"
                  : "bg-gray-50 text-gray-600 hover:bg-gray-100"
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {/* 搜索与工具按钮 */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索学员姓名、手机号、测评项目..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={handleExportCsv}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-extrabold text-amber-950 bg-[#FFE100] hover:bg-amber-300 rounded-xl transition-all shadow-sm"
            >
              <Download className="w-4 h-4" />
              <span>导出 CSV</span>
            </button>
            <button
              onClick={onRefresh}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              <span>刷新</span>
            </button>
          </div>
        </div>
      </div>

      {/* 数据表格区 */}
      <div className="bg-white rounded-2xl border border-amber-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-amber-50/70 border-b border-amber-100 text-gray-700 font-extrabold uppercase">
              <tr>
                <th className="px-6 py-3.5">ID</th>
                <th className="px-6 py-3.5">测评项目</th>
                <th className="px-6 py-3.5">学员姓名</th>
                <th className="px-6 py-3.5">手机号码</th>
                <th className="px-6 py-3.5">提交时间</th>
                <th className="px-6 py-3.5 text-right">操作诊断</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-400 font-medium">
                    正在加载全量测评数据...
                  </td>
                </tr>
              ) : filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-400 font-medium">
                    暂无匹配的测评记录
                  </td>
                </tr>
              ) : (
                filteredRecords.map((r) => (
                  <tr key={r.id} className="hover:bg-amber-50/40 transition-all">
                    <td className="px-6 py-4 font-mono font-bold text-gray-400">#{r.id}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 text-[11px] font-extrabold rounded-md border ${r.projectTagClass}`}>
                        {r.projectName || r.templateCode}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-900">{r.studentName}</td>
                    <td className="px-6 py-4 font-mono text-gray-600">{r.phoneNumber}</td>
                    <td className="px-6 py-4 text-gray-500 font-mono">
                      {new Date(r.submittedAt || "").toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setSelectedRecord(r)}
                        className="px-3 py-1.5 text-xs font-extrabold text-amber-950 bg-[#FFE100] hover:bg-amber-300 rounded-lg shadow-sm transition-all"
                      >
                        查看报告
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
