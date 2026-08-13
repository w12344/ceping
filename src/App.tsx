import React, { useState, useEffect, useCallback } from "react";
import { Header } from "./components/Header";
import { AdminDashboard } from "./pages/AdminDashboard";
import { AssessmentPortal } from "./pages/AssessmentPortal";
import { CustomUploadModal } from "./components/CustomUploadModal";
import { fetchAssessmentList } from "./services/api";
import { AssessmentRecord } from "./services/types";

export const App: React.FC = () => {
  const [token, setToken] = useState<string>(() => localStorage.getItem("adminToken") || "feifan2026admin");
  const [currentView, setCurrentView] = useState<"admin" | "portal">("admin");
  const [records, setRecords] = useState<AssessmentRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isUploadOpen, setIsUploadOpen] = useState<boolean>(false);

  const loadData = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const data = await fetchAssessmentList(token);
      setRecords(data);
    } catch (err: any) {
      console.warn("读取后端数据告警:", err.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSwitchToken = () => {
    const newToken = prompt("请输入后台访问密钥 Token:", token);
    if (newToken !== null) {
      const trimmed = newToken.trim();
      setToken(trimmed);
      localStorage.setItem("adminToken", trimmed);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFDF6] flex flex-col text-gray-900 selection:bg-[#FFE100] selection:text-amber-950">
      <Header
        onOpenUpload={() => setIsUploadOpen(true)}
        onSwitchToken={handleSwitchToken}
        onNavigatePortal={() => setCurrentView(currentView === "admin" ? "portal" : "admin")}
        currentView={currentView}
        token={token}
      />

      <main className="flex-1">
        {currentView === "admin" ? (
          <AdminDashboard
            records={records}
            loading={loading}
            onRefresh={loadData}
          />
        ) : (
          <AssessmentPortal
            onBackToAdmin={() => setCurrentView("admin")}
          />
        )}
      </main>

      <CustomUploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onSuccess={loadData}
      />

      <footer className="py-6 border-t border-amber-100 bg-white text-center text-xs text-gray-400">
        <div>非凡教育 · 科学测评综合平台 &copy; 2026 小凡教育科技</div>
      </footer>
    </div>
  );
};
