import { loadConfig } from "../src/config.js";
import { openDatabase } from "../src/db/database.js";
import { createRepository } from "../src/db/repository.js";
import { publicReportView } from "../src/routes/report-view.js";
import { uploadReportToOSS } from "../src/lib/oss.js";

const config = loadConfig();
if (!config.oss.accessKeyId || !config.oss.accessKeySecret) {
  console.error("错误: 请先在 .env 中配置 OSS_ACCESS_KEY_ID 和 OSS_ACCESS_KEY_SECRET");
  process.exit(1);
}

const database = openDatabase(config.databasePath);
const repository = createRepository(database, { allowedAnswers: [] });

const sessions = database.prepare(`
  SELECT id, report_access_token, student_name, phone_number, submitted_at FROM assessment_sessions
  WHERE submitted_at IS NOT NULL AND report_json IS NOT NULL
`).all();

console.log(`找到 ${sessions.length} 条已完成的测评报告，准备同步至阿里云 OSS (${config.oss.bucket} -> ${config.oss.pathPrefix}/)...`);
let successCount = 0;
let failCount = 0;

for (const session of sessions) {
  const report = repository.getPublicReportByAccessToken(session.reportAccessToken);
  if (!report || !report.report) continue;
  const payload = publicReportView(report.report);
  const result = await uploadReportToOSS({
    studentName: session.student_name,
    phoneNumber: session.phone_number,
    submittedAt: session.submitted_at,
    reportAccessToken: session.report_access_token
  }, payload, config.oss);
  if (result.success) {
    successCount++;
    console.log(`[✓] 报告 ${session.student_name} (${session.report_access_token}) 上传成功: ${result.objectKey}`);
  } else {
    failCount++;
    console.error(`[✗] 报告 ${session.report_access_token} 上传失败: ${result.error}`);
  }
}

console.log(`\n========================================`);
console.log(`同步已完成！ 成功: ${successCount} 份，失败: ${failCount} 份`);
console.log(`========================================\n`);

database.close();
