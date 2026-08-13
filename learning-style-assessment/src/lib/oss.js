import OSS from "ali-oss";

let clientInstance = null;

function createClient(ossConfig) {
  if (!ossConfig?.accessKeyId || !ossConfig?.accessKeySecret) {
    return null;
  }
  if (!clientInstance) {
    clientInstance = new OSS({
      region: ossConfig.region || "oss-cn-shanghai",
      accessKeyId: ossConfig.accessKeyId,
      accessKeySecret: ossConfig.accessKeySecret,
      bucket: ossConfig.bucket || "ceping-air"
    });
  }
  return clientInstance;
}

export function formatOSSKey({ studentName, phoneNumber, submittedAt, pathPrefix = "xxfg" }) {
  const prefix = pathPrefix.replace(/^\/+|\/+$/g, "");
  const cleanName = String(studentName || "匿名").replace(/[\/\\:\*\?"<>\|]/g, "_").trim();
  const cleanPhone = String(phoneNumber || "").replace(/\D/g, "");
  
  let dateStr = "";
  if (submittedAt) {
    const d = new Date(submittedAt);
    if (!isNaN(d.getTime())) {
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const dd = String(d.getDate()).padStart(2, "0");
      dateStr = `${yyyy}${mm}${dd}`;
    }
  }
  if (!dateStr) {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");
    dateStr = `${yyyy}${mm}${dd}`;
  }

  const filename = `${cleanName}_${cleanPhone}_${dateStr}.json`;
  return `${prefix}/reports/${filename}`;
}

export async function uploadReportToOSS(sessionInfo, reportPayload, ossConfig) {
  if (!ossConfig?.accessKeyId || !ossConfig?.accessKeySecret) {
    return { success: false, reason: "OSS credentials not provided" };
  }

  try {
    const client = createClient(ossConfig);
    const prefix = (ossConfig.pathPrefix || "xxfg").replace(/^\/+|\/+$/g, "");

    let studentName = "";
    let phoneNumber = "";
    let submittedAt = "";
    let reportAccessToken = "";

    if (typeof sessionInfo === "object" && sessionInfo !== null) {
      studentName = sessionInfo.studentName || sessionInfo.student_name || reportPayload?.studentReport?.studentName || "";
      phoneNumber = sessionInfo.phoneNumber || sessionInfo.phone_number || "";
      submittedAt = sessionInfo.submittedAt || sessionInfo.submitted_at || "";
      reportAccessToken = sessionInfo.reportAccessToken || sessionInfo.report_access_token || sessionInfo.token || "";
    } else {
      reportAccessToken = String(sessionInfo || "");
      studentName = reportPayload?.studentReport?.studentName || "";
    }

    // 主文件名：xxfg/reports/姓名_手机号_YYYYMMDD.json
    const formattedKey = formatOSSKey({
      studentName,
      phoneNumber,
      submittedAt,
      pathPrefix: prefix
    });

    const jsonBuffer = Buffer.from(JSON.stringify(reportPayload, null, 2), "utf8");

    // 1. 上传可读文件至 xxfg/reports/ 文件夹（如 xxfg/reports/张三_13800138000_20260811.json）
    await client.put(formattedKey, jsonBuffer, {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "x-oss-object-acl": "public-read"
      }
    });

    // 2. 如果提供 reportAccessToken，同时保存一份以 token 命名的文件 (xxfg/reports/{token}.json)，便于前端直接按 ID 读取
    if (reportAccessToken) {
      const tokenKey = `${prefix}/reports/${reportAccessToken}.json`;
      await client.put(tokenKey, jsonBuffer, {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "x-oss-object-acl": "public-read"
        }
      });
    }

    const publicBase = (ossConfig.publicBaseUrl || `https://${ossConfig.bucket || "ceping-air"}.${ossConfig.region || "oss-cn-shanghai"}.aliyuncs.com`).replace(/\/+$/, "");
    const publicUrl = `${publicBase}/${formattedKey.split('/').map(encodeURIComponent).join('/')}`;

    console.log(`[OSS] 报告已成功同步至: ${formattedKey}`);
    return { success: true, objectKey: formattedKey, publicUrl };
  } catch (error) {
    console.error(`[OSS] 报告同步失败:`, error?.message || error);
    return { success: false, error: error?.message || String(error) };
  }
}
