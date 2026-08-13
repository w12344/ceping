import { Router } from "express";
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { resolve, join } from "node:path";
import { buildContactCsv, buildCsv } from "../lib/csv.js";
import { NotFoundError } from "../lib/http-errors.js";
import { hasValidBearerToken } from "../lib/security.js";
import { publicReportView } from "./report-view.js";

function getAllProjectsSessions(repository, ossBaseUrl) {
  const baseCepingDir = resolve("..");
  const results = [];

  // 1. 学习风格测评 (learning-style-assessment)
  const lsSessions = repository.listAdminSessions();
  for (const s of lsSessions) {
    const cleanName = String(s.studentName || "匿名").replace(/[\/\\:\*\?"<>\|]/g, "_").trim();
    const cleanPhone = String(s.phoneNumber || "").replace(/\D/g, "");
    let dateStr = "";
    if (s.submittedAt) {
      const d = new Date(s.submittedAt);
      if (!isNaN(d.getTime())) dateStr = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
    }
    if (!dateStr) {
      const now = new Date();
      dateStr = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`;
    }
    const ossKey = `xxfg/reports/${cleanName}_${cleanPhone}_${dateStr}.json`;

    results.push({
      id: s.id,
      projectKey: "learningStyle",
      projectName: "学习风格测评",
      projectTagClass: "tag-xxfg",
      studentName: s.studentName || "匿名",
      phoneNumber: s.phoneNumber || "--",
      grade: s.grade || "--",
      specialtyDirection: s.specialtyDirection || "",
      targetSubject: s.targetSubject || "--",
      scoreText: s.targetSubjectScore !== null && s.targetSubjectScore !== undefined ? `${s.targetSubjectScore}/${s.targetSubjectFullScore || 150}分` : "--",
      detailSummary: `${s.primaryPreference || s.resultType || "做答完成"}${s.targetSubject ? " · " + s.targetSubject : ""}`,
      submittedAt: s.submittedAt || s.startedAt || "",
      durationSeconds: s.durationSeconds || 0,
      ossKey,
      ossUrl: `${ossBaseUrl}/${ossKey.split('/').map(encodeURIComponent).join('/')}`,
      reportUrl: `/report.html?id=${encodeURIComponent(s.reportAccessToken)}`
    });
  }

  // 2. 学习动机测评 (motivation-assessment)
  try {
    const path2 = join(baseCepingDir, "motivation-assessment", "xxdj-deploy", "results.json");
    if (existsSync(path2)) {
      const data2 = JSON.parse(readFileSync(path2, "utf-8"));
      const records2 = data2.records || [];
      for (const r of records2) {
        const cleanName = String(r.name || "匿名").replace(/[\/\\:\*\?"<>\|]/g, "_").trim();
        const cleanPhone = String(r.contact || "").replace(/\D/g, "");
        let dateStr = r.createdAt ? r.createdAt.slice(0, 10).replace(/-/g, "") : "";
        const ossKey = `xxdj/reports/${cleanName}_${cleanPhone}_${dateStr}.json`;
        results.push({
          id: r.id,
          projectKey: "motivation",
          projectName: "学习动机测评",
          projectTagClass: "tag-xxdj",
          studentName: r.name || "匿名",
          phoneNumber: r.contact || "--",
          grade: "--",
          specialtyDirection: "",
          targetSubject: "动机诊断",
          scoreText: r.scores ? `核心属性: ${r.profileName || "--"}` : "--",
          detailSummary: `${r.profileName || "动机类型"}${r.representativeName ? " · " + r.representativeName : ""}`,
          submittedAt: r.createdAt || "",
          durationSeconds: 0,
          ossKey,
          ossUrl: `${ossBaseUrl}/${ossKey.split('/').map(encodeURIComponent).join('/')}`,
          reportUrl: `${ossBaseUrl}/${ossKey.split('/').map(encodeURIComponent).join('/')}`
        });
      }
    }
  } catch (e) {
    console.error("读取动机测评数据失败:", e.message);
  }

  // 3. FTH 创业者职业特质测评 (fth-boss-assessment)
  try {
    const path3 = join(baseCepingDir, "fth-boss-assessment", "deploy", "results.json");
    if (existsSync(path3)) {
      const data3 = JSON.parse(readFileSync(path3, "utf-8"));
      const records3 = data3.records || [];
      for (const r of records3) {
        const cleanName = String(r.name || "匿名").replace(/[\/\\:\*\?"<>\|]/g, "_").trim();
        const cleanPhone = String(r.contact || "").replace(/\D/g, "");
        let dateStr = r.createdAt ? r.createdAt.slice(0, 10).replace(/-/g, "") : "";
        const ossKey = `fthboss/reports/${cleanName}_${cleanPhone}_${dateStr}.json`;
        results.push({
          id: r.id,
          projectKey: "fthBoss",
          projectName: "FTH 创业者职业特质",
          projectTagClass: "tag-fthboss",
          studentName: r.name || "匿名",
          phoneNumber: r.contact || "--",
          grade: "--",
          specialtyDirection: "创业者版",
          targetSubject: "职业特质",
          scoreText: r.summary || "创业型",
          detailSummary: r.summary || (r.topAttribute?.label ? r.topAttribute.label : "FTH 创业特质"),
          submittedAt: r.createdAt || "",
          durationSeconds: 0,
          ossKey,
          ossUrl: `${ossBaseUrl}/${ossKey.split('/').map(encodeURIComponent).join('/')}`,
          reportUrl: `${ossBaseUrl}/${ossKey.split('/').map(encodeURIComponent).join('/')}`
        });
      }
    }
  } catch (e) {
    console.error("读取 FTH Boss 数据失败:", e.message);
  }

  // 4. FTH 职业特质测评 (微信版) (fth-talent-assessment)
  try {
    const path4 = join(baseCepingDir, "fth-talent-assessment", "deploy", "results.json");
    if (existsSync(path4)) {
      const data4 = JSON.parse(readFileSync(path4, "utf-8"));
      const records4 = data4.records || [];
      for (const r of records4) {
        const cleanName = String(r.name || "匿名").replace(/[\/\\:\*\?"<>\|]/g, "_").trim();
        const cleanPhone = String(r.contact || "").replace(/\D/g, "");
        let dateStr = r.createdAt ? r.createdAt.slice(0, 10).replace(/-/g, "") : "";
        const ossKey = `fthtalent/reports/${cleanName}_${cleanPhone}_${dateStr}.json`;
        results.push({
          id: r.id,
          projectKey: "fthTalent",
          projectName: "FTH 职业特质(微信版)",
          projectTagClass: "tag-fthtalent",
          studentName: r.name || "匿名",
          phoneNumber: r.contact || "--",
          grade: "--",
          specialtyDirection: "小凡微信版",
          targetSubject: "职业特质",
          scoreText: r.summary || "人才主属性",
          detailSummary: r.summary || (r.topAttribute?.label ? r.topAttribute.label : "FTH 职业特质"),
          submittedAt: r.createdAt || "",
          durationSeconds: 0,
          ossKey,
          ossUrl: `${ossBaseUrl}/${ossKey.split('/').map(encodeURIComponent).join('/')}`,
          reportUrl: `${ossBaseUrl}/${ossKey.split('/').map(encodeURIComponent).join('/')}`
        });
      }
    }
  } catch (e) {
    console.error("读取 FTH Talent 数据失败:", e.message);
  }

  // 5. FTH 职业特质测评 1605版 (fth-1605-assessment)
  try {
    const path5Dir = join(baseCepingDir, "fth-1605-assessment", "output");
    if (existsSync(path5Dir)) {
      const files5 = readdirSync(path5Dir);
      for (const f of files5) {
        if (f.startsWith(".")) continue;
        const ossKey = `fth1605/reports/${f}`;
        results.push({
          id: `fth1605-${f}`,
          projectKey: "fth1605",
          projectName: "FTH 职业特质(1605版)",
          projectTagClass: "tag-fth1605",
          studentName: "1605版产物包",
          phoneNumber: "--",
          grade: "--",
          specialtyDirection: "1605版",
          targetSubject: "PPT/产物",
          scoreText: f.endsWith(".pptx") ? "PPT成品" : "资源文件",
          detailSummary: f,
          submittedAt: "2026-08-12T08:00:00Z",
          durationSeconds: 0,
          ossKey,
          ossUrl: `${ossBaseUrl}/${ossKey.split('/').map(encodeURIComponent).join('/')}`,
          reportUrl: `${ossBaseUrl}/${ossKey.split('/').map(encodeURIComponent).join('/')}`
        });
      }
    }
  } catch (e) {
    console.error("读取 FTH 1605 数据失败:", e.message);
  }

  results.sort((a, b) => new Date(b.submittedAt || 0) - new Date(a.submittedAt || 0));
  return results;
}

export function createAdminRouter({ repository, config, adminExportToken, contactExportToken }) {
  const router = Router();

  function isAuthorized(request) {
    const auth = request.get("authorization");
    return hasValidBearerToken(auth, adminExportToken) || hasValidBearerToken(auth, contactExportToken);
  }

  router.get("/sessions", (request, response) => {
    if (!isAuthorized(request)) {
      return response.status(401).json({ error: "未授权" });
    }
    const ossBaseUrl = config?.oss?.publicBaseUrl || "https://ceping-air.oss-cn-shanghai.aliyuncs.com";
    const allRecords = getAllProjectsSessions(repository, ossBaseUrl);
    
    return response.json({
      sessions: repository.listAdminSessions(),
      allProjects: allRecords,
      ossBaseUrl
    });
  });

  router.post("/sync-oss", async (request, response) => {
    if (!hasValidBearerToken(request.get("authorization"), adminExportToken)) {
      return response.status(401).json({ error: "未授权" });
    }
    if (!config?.oss?.accessKeyId || !config?.oss?.accessKeySecret) {
      return response.status(400).json({ error: "OSS 密钥未配置" });
    }

    const { uploadReportToOSS } = await import("../lib/oss.js");
    const sessions = repository.listAdminSessions().filter((s) => s.submittedAt && s.hasReport);
    let successCount = 0;
    let failCount = 0;

    for (const session of sessions) {
      const record = repository.getPublicReportByAccessToken(session.reportAccessToken);
      if (!record || !record.report) continue;
      const payload = publicReportView(record.report, {
        studentName: record.studentName,
        phoneNumber: record.phoneNumber
      });
      const result = await uploadReportToOSS({
        studentName: session.studentName,
        phoneNumber: session.phoneNumber,
        submittedAt: session.submittedAt,
        reportAccessToken: session.reportAccessToken
      }, payload, config.oss);
      if (result.success) successCount++;
      else failCount++;
    }

    return response.json({
      message: "OSS 同步完成",
      total: sessions.length,
      successCount,
      failCount
    });
  });

  router.get("/reports/:token.json", (request, response) => {
    if (!hasValidBearerToken(request.get("authorization"), adminExportToken)) {
      return response.status(401).json({ error: "未授权" });
    }
    const record = repository.getPublicReportByAccessToken(request.params.token);
    if (!record) throw new NotFoundError("assessment report not found");
    const report = publicReportView(record.report, {
      studentName: record.studentName,
      phoneNumber: record.phoneNumber
    });
    response.set({
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": "attachment; filename=learning-style-report.json",
      "Cache-Control": "no-store"
    });
    return response.json({ report });
  });

  router.get("/export.csv", (request, response) => {
    if (!hasValidBearerToken(request.get("authorization"), adminExportToken)) {
      return response.status(401).json({ error: "未授权" });
    }
    const csv = buildCsv(repository.listExportRows());
    response.set({
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": "attachment; filename=learning-style-assessment.csv",
      "Cache-Control": "no-store"
    });
    return response.send(csv);
  });

  router.get("/contacts.csv", (request, response) => {
    if (!hasValidBearerToken(request.get("authorization"), contactExportToken)) {
      return response.status(401).json({ error: "未授权" });
    }
    const csv = buildContactCsv(repository.listContactExportRows());
    response.set({
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": "attachment; filename=learning-style-contacts.csv",
      "Cache-Control": "no-store"
    });
    return response.send(csv);
  });

  return router;
}
