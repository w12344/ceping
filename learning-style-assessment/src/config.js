export function loadConfig(env = process.env) {
  if (!env.ADMIN_EXPORT_TOKEN) throw new Error("ADMIN_EXPORT_TOKEN is required");
  if (!env.CONTACT_EXPORT_TOKEN) throw new Error("CONTACT_EXPORT_TOKEN is required");
  if (env.ADMIN_EXPORT_TOKEN === env.CONTACT_EXPORT_TOKEN) {
    throw new Error("ADMIN_EXPORT_TOKEN and CONTACT_EXPORT_TOKEN must be distinct");
  }
  return {
    port: Number(env.PORT || 3000),
    databasePath: env.DATABASE_PATH || "./data/assessment.sqlite",
    adminExportToken: env.ADMIN_EXPORT_TOKEN,
    contactExportToken: env.CONTACT_EXPORT_TOKEN,
    publicBaseUrl: env.PUBLIC_BASE_URL || "http://localhost:3000",
    assessmentVersion: env.ASSESSMENT_VERSION || "v2.7.1",
    oss: {
      region: env.OSS_REGION || "oss-cn-shanghai",
      bucket: env.OSS_BUCKET || "ceping-air",
      pathPrefix: env.OSS_PATH_PREFIX || "xxfg",
      accessKeyId: env.OSS_ACCESS_KEY_ID || "",
      accessKeySecret: env.OSS_ACCESS_KEY_SECRET || "",
      publicBaseUrl: env.OSS_PUBLIC_BASE_URL || `https://${env.OSS_BUCKET || "ceping-air"}.${env.OSS_REGION || "oss-cn-shanghai"}.aliyuncs.com`
    }
  };
}
