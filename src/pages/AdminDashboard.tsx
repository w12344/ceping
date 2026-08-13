import React, { useState, useMemo } from "react";
import { Search, Download, RefreshCw, FileText, CheckCircle, BarChart3, Layers, ChevronRight } from "lucide-react";
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
    link.setAttribute("download", `非凡测评数据导出_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7 space-y-6">
      {/* 4 大核心 Metrics Cards (飞书 + 苹果 简洁面板) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="feishu-card p-5 flex items-center justify-between">
          <div>
            <p className="text-xs text-[#646A73] font-medium">全量测评总报告</p>
            <h3 className="text-2xl font-bold text-[#1F2329] mt-1 tracking-tight">{stats.total}</h3>
            <p className="text-[11px] text-[#8F959E] mt-1">数据实时无缝落盘</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#3370FF]/10 text-[#3370FF] flex items-center justify-center">
            <BarChart3 className="w-5 h-5" />
          </div>
        </div>

        <div className="feishu-card p-5 flex items-center justify-between">
          <div>
            <p className="text-xs text-[#646A73] font-medium">学习风格测评</p>
            <h3 className="text-2xl font-bold text-[#1F2329] mt-1 tracking-tight">{stats.xxfg}</h3>
            <p className="text-[11px] text-[#8F959E] mt-1">VAK 感官通道分析</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-600 flex items-center justify-center">
            <FileText className="w-5 h-5" />
          </div>
        </div>

        <div className="feishu-card p-5 flex items-center justify-between">
          <div>
            <p className="text-xs text-[#646A73] font-medium">学习动机测评</p>
            <h3 className="text-2xl font-bold text-[#1F2329] mt-1 tracking-tight">{stats.xxdj}</h3>
            <p className="text-[11px] text-[#8F959E] mt-1">7 大维度自主积极力</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center">
            <CheckCircle className="w-5 h-5" />
          </div>
        </div>

        <div className="feishu-card p-5 flex items-center justify-between">
          <div>
            <p className="text-xs text-[#646A73] font-medium">FTH 特质与自定义</p>
            <h3 className="text-2xl font-bold text-[#1F2329] mt-1 tracking-tight">{stats.fth + stats.custom}</h3>
            <p className="text-[11px] text-[#8F959E] mt-1">创业者/微信/1605/自定义</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center">
            <Layers className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 控制栏 (飞书风格 Segmented Tab Control & 工具栏) */}
      <div className="feishu-card p-5 space-y-4">
        {/* Feishu Segment Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[#F2F3F5] rounded-xl">
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
              className={`px-3.5 py-1.5 text-xs transition-all ${
                activeTab === tab.id
                  ? "bg-white text-[#3370FF] font-semibold rounded-lg shadow-sm"
                  : "text-[#646A73] hover:text-[#1F2329] font-medium"
              }`}
            >
              {tab.label} <span className="opacity-75">({tab.count})</span>
            </button>
          ))}
        </div>

        {/* 搜索框与工具 */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#8F959E]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索学员姓名、手机号、测评项目..."
              className="feishu-input w-full pl-9 pr-3 py-1.5 text-xs"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={handleExportCsv}
              className="feishu-button-secondary px-3.5 py-1.5 text-xs font-semibold flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5 text-[#646A73]" />
              <span>导出 CSV</span>
            </button>
            <button
              onClick={onRefresh}
              className="feishu-button-secondary px-3 py-1.5 text-xs font-medium flex items-center gap-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#646A73] ${loading ? "animate-spin" : ""}`} />
              <span>刷新</span>
            </button>
          </div>
        </div>
      </div>

      {/* 极简飞书数据表格 */}
      <div className="feishu-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F7F8FA] border-b border-[#E5E6EB] text-[#646A73] font-semibold uppercase">
              <tr>
                <th className="px-6 py-3">ID</th>
                <th className="px-6 py-3">测评项目</th>
                <th className="px-6 py-3">学员姓名</th>
                <th className="px-6 py-3">手机号码</th>
                <th className="px-6 py-3">提交时间</th>
                <th className="px-6 py-3 text-right">操作诊断</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E6EB]/60">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-[#8F959E] font-medium">
                    正在加载全量测评数据...
                  </td>
                </tr>
              ) : filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-[#8F959E] font-medium">
                    暂无匹配的测评记录
                  </td>
                </tr>
              ) : (
                filteredRecords.map((r) => {
                  let tagStyle = "bg-[#F2F3F5] text-[#1F2329] border-[#E5E6EB]";
                  if (r.projectKey === "learningStyle") tagStyle = "bg-teal-50 text-teal-700 border-teal-200/60";
                  if (r.projectKey === "motivation") tagStyle = "bg-blue-50 text-blue-700 border-blue-200/60";
                  if (["fthBoss", "fthTalent", "fth1605"].includes(r.projectKey || "")) tagStyle = "bg-purple-50 text-purple-700 border-purple-200/60";

                  return (
                    <tr key={r.id} className="hover:bg-[#F7F8FA] transition-colors">
                      <td className="px-6 py-3.5 font-mono text-[#8F959E]">#{r.id}</td>
                      <td className="px-6 py-3.5">
                        <span className={`px-2.5 py-0.5 text-[11px] font-medium rounded border ${tagStyle}`}>
                          {r.projectName || r.templateCode}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 font-semibold text-[#1F2329]">{r.studentName}</td>
                      <td className="px-6 py-3.5 font-mono text-[#646A73]">{r.phoneNumber}</td>
                      <td className="px-6 py-3.5 text-[#8F959E] font-mono">
                        {new Date(r.submittedAt || "").toLocaleString()}
                      </td>
                      <td className="px-6 py-3.5 text-right">
                        <button
                          onClick={() => setSelectedRecord(r)}
                          className="feishu-button-ghost px-3 py-1 text-xs inline-flex items-center gap-0.5"
                        >
                          <span>查看报告</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  );
                })
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
