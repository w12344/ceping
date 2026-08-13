import OSS from "ali-oss";
import fs from "node:fs";
import path from "node:path";

const ossConfig = {
  region: process.env.OSS_REGION || "oss-cn-shanghai",
  bucket: process.env.OSS_BUCKET || "ceping-air",
  accessKeyId: process.env.OSS_ACCESS_KEY_ID || "",
  accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET || "",
  prefix: process.env.OSS_PATH_PREFIX || "fth1605"
};

const client = new OSS({
  region: ossConfig.region,
  accessKeyId: ossConfig.accessKeyId,
  accessKeySecret: ossConfig.accessKeySecret,
  bucket: ossConfig.bucket
});

try {
  const outputDir = path.resolve("output");
  if (fs.existsSync(outputDir)) {
    const files = fs.readdirSync(outputDir);
    console.log(`在 output 目录找到 ${files.length} 个文件，开始同步至阿里云 OSS (${ossConfig.bucket} -> ${ossConfig.prefix}/reports/)...`);
    for (const file of files) {
      const filePath = path.join(outputDir, file);
      if (fs.statSync(filePath).isFile() && !file.startsWith(".")) {
        const objectKey = `${ossConfig.prefix}/reports/${file}`;
        await client.put(objectKey, filePath, {
          headers: { "x-oss-object-acl": "public-read" }
        });
        console.log(`[✓] 报告产物 ${file} 上传成功 -> ${objectKey}`);
      }
    }
  } else {
    console.log("未找到 output 目录");
  }
} catch (err) {
  console.error("OSS 上传失败:", err.message);
}
