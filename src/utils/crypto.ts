/**
 * 极简测评上下文 Base64 加解密工具模块
 */

export interface AssessmentContextData {
  advisor: {
    token: string;
    userId: string;
    name: string;
    mobile: string;
  };
  student: {
    name: string;
    mobile: string;
    profileId: string;
  };
}

export interface EncryptParams {
  advisorToken?: string;
  advisorUserId?: string;
  advisorName?: string;
  advisorMobile?: string;
  studentName?: string;
  studentMobile?: string;
  profileId?: string;
}

/**
 * 将 7 项常用身份参数压包加密为极简 Base64 字符串 (ctx)
 */
export function encryptAssessmentContext(params: EncryptParams): string {
  const d = {
    at: params.advisorToken || "",
    au: params.advisorUserId || "",
    an: params.advisorName || "",
    am: params.advisorMobile || "",
    sn: params.studentName || "",
    sm: params.studentMobile || "",
    sp: params.profileId || ""
  };

  try {
    const jsonStr = JSON.stringify(d);
    // 转换为 UTF-8 字节并转成 URL 安全 Base64
    const utf8Bytes = encodeURIComponent(jsonStr).replace(/%([0-9A-F]{2})/g, (_, p1) =>
      String.fromCharCode(parseInt(p1, 16))
    );
    const base64 = btoa(utf8Bytes);
    return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  } catch (e) {
    console.warn("[AssessmentCrypto] 加密上下文失败:", e);
    return "";
  }
}

/**
 * 解密 URL 中的 ?ctx= 加密串为结构化对象
 */
export function decryptAssessmentContext(ctx: string | null | undefined): AssessmentContextData | null {
  if (!ctx || typeof ctx !== "string") return null;

  try {
    let base64 = ctx.replace(/-/g, "+").replace(/_/g, "/");
    while (base64.length % 4) base64 += "=";

    const jsonStr = decodeURIComponent(
      Array.prototype.map.call(atob(base64), (c: string) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)).join("")
    );
    const d = JSON.parse(jsonStr);

    return {
      advisor: {
        token: d.at || "",
        userId: d.au || "",
        name: d.an || "",
        mobile: d.am || ""
      },
      student: {
        name: d.sn || "",
        mobile: d.sm || "",
        profileId: d.sp || ""
      }
    };
  } catch (e) {
    console.warn("[AssessmentCrypto] 解密 ctx 上下文异常:", e);
    return null;
  }
}

/**
 * 从当前 URL 的 ?ctx= 参数中直接解析解密
 */
export function getAssessmentDataFromCtx(): AssessmentContextData | null {
  if (typeof window === "undefined") return null;
  const urlParams = new URLSearchParams(window.location.search);
  const ctx = urlParams.get("ctx");
  return decryptAssessmentContext(ctx);
}
