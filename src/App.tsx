import React, { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { AdminDashboard } from "./pages/AdminDashboard";
import { AssessmentPortal } from "./pages/AssessmentPortal";
import { CustomUploadModal } from "./components/CustomUploadModal";
import { fetchAssessmentList } from "./services/api";
import { AssessmentRecord } from "./services/types";

export function App() {
  const [token, setToken] = useState<string>(() => localStorage.getItem("adminToken") || "");
  const [currentView, setCurrentView] = useState<"admin" | "portal">("admin");
  const [records, setRecords] = useState<AssessmentRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isUploadOpen, setIsUploadOpen] = useState<boolean>(false);

  const loadData = async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const data = await fetchAssessmentList(token);
      setRecords(data);
    } catch (err: any) {
      console.warn("数据加载提示:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      localStorage.setItem("adminToken", token);
      loadData();
    }
  }, [token]);

  const handleSwitchToken = () => {
    const input = prompt("请输入后台访问密钥 Token:", token);
    if (input !== null) {
      const trimmed = input.trim();
      setToken(trimmed);
      localStorage.setItem("adminToken", trimmed);
    }
  };

  const params = new URLSearchParams(window.location.search);
  const getParam = (key: string) => params.get(key);

  const hideHeaderVal = getParam("hideHeader");
  const headerVal = getParam("header");
  const hideTabsVal = getParam("hideTabs");
  const tabsVal = getParam("tabs");
  const embedVal = getParam("embed");
  const simpleVal = getParam("simple");
  const pureVal = getParam("pure");

  const shouldHideHeader = hideHeaderVal === "1" || hideHeaderVal === "true" || headerVal === "0" || headerVal === "false" || embedVal === "1" || simpleVal === "1" || pureVal === "1";
  const shouldHideTabs = hideTabsVal === "1" || hideTabsVal === "true" || tabsVal === "0" || tabsVal === "false" || embedVal === "1" || simpleVal === "1" || pureVal === "1";

  return (
    <div className="min-h-screen bg-[#FFFDF6]">
      {!shouldHideHeader && (
        <Header
          token={token}
          currentView={currentView}
          onOpenUpload={() => setIsUploadOpen(true)}
          onSwitchToken={handleSwitchToken}
          onNavigatePortal={() => setCurrentView(currentView === "admin" ? "portal" : "admin")}
        />
      )}

      <main>
        {currentView === "admin" ? (
          <AdminDashboard
            records={records}
            isLoading={isLoading}
            onRefresh={loadData}
          />
        ) : (
          <AssessmentPortal
            token={token}
            hideTabs={shouldHideTabs}
            onUpdateToken={(newToken) => {
              setToken(newToken);
              localStorage.setItem("adminToken", newToken);
            }}
          />
        )}
      </main>

      <CustomUploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onSuccess={() => {
          loadData();
        }}
      />
    </div>
  );
}

export default App;
