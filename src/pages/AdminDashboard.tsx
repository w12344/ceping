import React, { useState, useMemo } from "react";
import { Search, Download, RefreshCw, Eye, ExternalLink, FileText, Layers } from "lucide-react";
import { AssessmentRecord } from "../services/types";
import { ReportModal } from "../components/ReportModal";

interface AdminDashboardProps {
  records: AssessmentRecord[];
  isLoading: boolean;
  onRefresh: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  records,
  isLoading,
  onRefresh
}) => {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedRecord, setSelectedRecord] = useState<AssessmentRecord | null>(null);

  // Tab 统计与过滤
  const stats = useMemo(() => {
    const total = records.length;
    const learningStyle = records.filter((r) => r.projectKey === "learningStyle").length;
    const motivation = records.filter((r) => r.projectKey === "motivation").length;
    const fthBoss = records.filter((r) => r.projectKey === "fthBoss").length;
    const fthTalent = records.filter((r) => r.projectKey === "fthTalent").length;
    const fth1605 = records.filter((r) => r.projectKey === "fth1605").length;
    const customHTML = records.filter((r) => r.projectKey === "customHTML").length;

    return { total, learningStyle, motivation, fthBoss, fthTalent, fth1605, customHTML };
  }, [records]);

  // 过滤结果
  const filteredRecords = useMemo(() => {
    return records.filter((record) => {
      // 1. Tab 过滤
      if (activeTab !== "all" && record.projectKey !== activeTab) {
        return false;
      }
      // 2. 搜索框过滤
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const name = (record.studentName || "").toLowerCase();
        const mobile = (record.phoneNumber || "").toLowerCase();
        const template = (record.projectName || record.templateCode || "").toLowerCase();
        return name.includes(q) || mobile.includes(q) || template.includes(q);
      }
      return true;
    });
  }, [records, activeTab, searchQuery]);

  // 导出 CSV
  const handleExportCsv = () => {
    if (filteredRecords.length === 0) {
      alert("没有可导出的测评记录！");
      return;
    }

    const headers = ["ID", "学员姓名", "手机号", "测评类型", "提交时间", "诊断结论"];
    const rows = filteredRecords.map((r) => [
      r.id,
      r.studentName,
      r.phoneNumber,
      r.projectName || r.templateCode,
      new Date(r.submittedAt || "").toLocaleString(),
      r.resultData?.profileName || r.resultData?.styleType || "普通提交"
    ]);

    const csvContent = "\uFEFF" + [headers, ...rows].map((e) => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `非凡测评导出数据_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* 4 大核心指标卡片区 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-amber-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-800">全量测评总报告数</span>
            <span className="p-2 rounded-lg bg-amber-50 text-amber-600"><FileText className="w-4 h-4" /></span>
          </div>
          <div className="text-3xl font-black text-[#1E2066] mt-2">{stats.total}</div>
          <div className="text-[11px] text-gray-500 mt-1">包含全量测评与产物记录</div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-emerald-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-800">学习风格测评</span>
            <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-100 text-emerald-800">xxfg</span>
          </div>
          <div className="text-3xl font-black text-emerald-950 mt-2">{stats.learningStyle}</div>
          <div className="text-[11px] text-emerald-700 mt-1">目标学科与学习通道诊断</div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-amber-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-800">学习动机测评</span>
            <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-amber-100 text-amber-800">xxdj</span>
          </div>
          <div className="text-3xl font-black text-amber-950 mt-2">{stats.motivation}</div>
          <div className="text-[11px] text-amber-700 mt-1">七大维度与自主积极型分析</div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-indigo-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-800">FTH 职业特质系列</span>
            <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-indigo-100 text-indigo-800">fth</span>
          </div>
          <div className="text-3xl font-black text-indigo-950 mt-2">
            {stats.fthBoss + stats.fthTalent + stats.fth1605}
          </div>
          <div className="text-[11px] text-indigo-700 mt-1">创业者 + 微信版 + 1605版</div>
        </div>
      </div>

      {/* Tab 切换与工具栏 */}
      <div className="bg-white rounded-2xl p-5 border border-amber-100 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center gap-2 border-b border-gray-100 pb-3">
          {[
            { id: "all", label: `全部测评 (${stats.total})` },
            { id: "learningStyle", label: `学习风格 (${stats.learningStyle})` },
            { id: "motivation", label: `学习动机 (${stats.motivation})` },
            { id: "fthBoss", label: `FTH 创业者 (${stats.fthBoss})` },
            { id: "fthTalent", label: `FTH 微信版 (${stats.fthTalent})` },
            { id: "fth1605", label: `FTH 1605版 (${stats.fth1605})` },
            { id: "customHTML", label: `自定义 HTML 测评 (${stats.customHTML})` }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
                activeTab === tab.id
                  ? "bg-[#FFE100] text-amber-950 shadow-sm"
                  : "bg-gray-50 text-gray-600 hover:bg-gray-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索学员姓名、手机号、诊断结论..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={handleExportCsv}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-extrabold text-amber-950 bg-[#FFE100] hover:bg-amber-300 rounded-xl shadow-sm transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>导出 CSV</span>
            </button>
            <button
              onClick={onRefresh}
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-gray-600 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
              <span>刷新</span>
            </button>
          </div>
        </div>
      </div>

      {/* 测评数据主表格 */}
      <div className="bg-white rounded-2xl border border-amber-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-amber-50/50 border-b border-amber-100 text-gray-600 font-bold">
                <th className="p-3.5 pl-5">ID</th>
                <th className="p-3.5">学员姓名</th>
                <th className="p-3.5">联系电话</th>
                <th className="p-3.5">测评项目</th>
                <th className="p-3.5">提交时间</th>
                <th className="p-3.5">诊断结论</th>
                <th className="p-3.5 text-right pr-5">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-gray-400">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-amber-500" />
                    正在加载全量测评数据...
                  </td>
                </tr>
              ) : filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-gray-400">
                    <Layers className="w-8 h-8 mx-auto mb-2 text-amber-300" />
                    暂无匹配的测评数据记录
                  </td>
                </tr>
              ) : (
                filteredRecords.map((item) => (
                  <tr key={item.id} className="hover:bg-amber-50/30 transition-colors">
                    <td className="p-3.5 pl-5 font-mono text-gray-400">#{item.id}</td>
                    <td className="p-3.5 font-bold text-gray-900">{item.studentName}</td>
                    <td className="p-3.5 font-mono text-gray-600">{item.phoneNumber}</td>
                    <td className="p-3.5">
                      <span className={`px-2.5 py-0.5 text-[11px] font-bold rounded-full border ${item.projectTagClass}`}>
                        {item.projectName || item.templateCode}
                      </span>
                    </td>
                    <td className="p-3.5 text-gray-500">
                      {new Date(item.submittedAt || "").toLocaleString("zh-CN", {
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </td>
                    <td className="p-3.5 font-medium text-amber-800">
                      {item.resultData?.profileName || item.resultData?.styleType || "普通答题数据"}
                    </td>
                    <td className="p-3.5 text-right pr-5">
                      <button
                        onClick={() => setSelectedRecord(item)}
                        className="inline-flex items-center gap-1 px-3 py-1 text-xs font-bold text-amber-900 bg-amber-100 hover:bg-amber-200 rounded-lg transition-all"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>查看报告</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 报告预览弹窗 */}
      <ReportModal
        item={selectedRecord}
        isOpen={!!selectedRecord}
        onClose={() => setSelectedRecord(null)}
      />
    </div>
  );
};
