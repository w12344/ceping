import React, { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { AdminDashboard } from "./pages/AdminDashboard";
import { AssessmentPortal } from "./pages/AssessmentPortal";
import { LearningStyleAssessment } from "./pages/LearningStyleAssessment";
import { AssessmentReport } from "./pages/AssessmentReport";
import { CustomUploadModal } from "./components/CustomUploadModal";
import { fetchAssessmentList } from "./services/api";
import { AssessmentRecord } from "./services/types";

export function App() {
  const [token, setToken] = useState<string>(() => localStorage.getItem("adminToken") || "");
  const [records, setRecords] = useState<AssessmentRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isUploadOpen, setIsUploadOpen] = useState<boolean>(false);

  // 路由状态管理: 'portal' | 'assessment' | 'report' | 'admin'
  const [route, setRoute] = useState<"portal" | "assessment" | "report" | "admin">("portal");

  // 监听 Hash 或 Path 变动
  useEffect(() => {
    const resolveRoute = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      const search = window.location.search;

      if (hash.includes("#/assessment") || hash.includes("#/xxfg") || path.includes("index.html")) {
        setRoute("assessment");
      } else if (hash.includes("#/report") || path.includes("report.html")) {
        setRoute("report");
      } else if (hash.includes("#/admin") || path.includes("admin.html")) {
        setRoute("admin");
      } else if (hash.includes("#/portal") || path.includes("portal.html")) {
        setRoute("portal");
      } else {
        // 默认根据参数智能选择
        if (search.includes("id=") || search.includes("session=")) {
          setRoute("report");
        } else {
          setRoute("portal");
        }
      }
    };

    resolveRoute();
    window.addEventListener("hashchange", resolveRoute);
    return () => window.removeEventListener("hashchange", resolveRoute);
  }, []);

  const loadData = async () => {
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
    if (route === "admin") {
      if (token) localStorage.setItem("adminToken", token);
      loadData();
    }
  }, [token, route]);

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

  const hideVal = getParam("hide");
  const embedVal = getParam("embed");
  const pureVal = getParam("pure");
  const simpleVal = getParam("simple");

  const isHideAll = hideVal === "1" || hideVal === "true" || embedVal === "1" || pureVal === "1" || simpleVal === "1";
  const shouldHideHeader = isHideAll || route === "assessment" || route === "report";

  return (
    <div className="min-h-screen bg-[#FFFDF6]">
      {!shouldHideHeader && (
        <Header
          token={token}
          currentView={route === "admin" ? "admin" : "portal"}
          onOpenUpload={() => setIsUploadOpen(true)}
          onSwitchToken={handleSwitchToken}
          onNavigatePortal={() => {
            const nextRoute = route === "admin" ? "portal" : "admin";
            window.location.hash = `#/${nextRoute}`;
            setRoute(nextRoute);
          }}
        />
      )}

      <main>
        {route === "assessment" && <LearningStyleAssessment />}
        {route === "report" && <AssessmentReport />}
        {route === "portal" && (
          <AssessmentPortal
            token={token}
            hideTabs={isHideAll}
            onUpdateToken={(newToken) => {
              setToken(newToken);
              localStorage.setItem("adminToken", newToken);
            }}
          />
        )}
        {route === "admin" && (
          <AdminDashboard
            records={records}
            isLoading={isLoading}
            onRefresh={loadData}
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
