import React, { useState } from "react";
import { QrCode, Copy, ExternalLink, Check, Sparkles, Smartphone, UserCheck } from "lucide-react";
import QRCode from "qrcode";

interface AssessmentPortalProps {
  onBackToAdmin: () => void;
}

const ASSESSMENT_LIST = [
  {
    id: "learningStyle",
    title: "学习风格测评 (VAK 感官通道)",
    path: "/report.html",
    tag: "成交前 / 成交后通用",
    tagClass: "bg-emerald-100 text-emerald-800 border-emerald-200",
    desc: "诊断学生视觉记忆、听觉理解与动觉体感主导模式，精准匹配辅导策略。"
  },
  {
    id: "motivation",
    title: "学习动机测评 (7维度自主力)",
    path: "/xxdj/index.html",
    tag: "成交后深度学情",
    tagClass: "bg-amber-100 text-amber-800 border-amber-200",
    desc: "从目标意义感、自我效能感与心理压力等 7 大机制深入诊断自主积极型。"
  },
  {
    id: "fthBoss",
    title: "FTH 创业者特质测评 (创始人版)",
    path: "/fthboss/index.html",
    tag: "成交前痛点唤醒",
    tagClass: "bg-indigo-100 text-indigo-800 border-indigo-200",
    desc: "评估创业者在开拓力、执行力、分析力及抗压力方面的综合商业特质。"
  },
  {
    id: "fthTalent",
    title: "FTH 微信版特质测评 (合伙人版)",
    path: "/fthtalent/index.html",
    tag: "成交前裂变引流",
    tagClass: "bg-blue-100 text-blue-800 border-blue-200",
    desc: "包含 Fighter、Runner、Climber、Thinker、Analyzer、Builder 6大角色模式。"
  },
  {
    id: "fth1605",
    title: "FTH 1605版 AI 研发特质",
    path: "/fth1605/index.html",
    tag: "高阶人才诊断",
    tagClass: "bg-purple-100 text-purple-800 border-purple-200",
    desc: "针对高阶 AI / 研发人才进行潜质分析并生成 PPT 风格产物诊断。"
  }
];

export const AssessmentPortal: React.FC<AssessmentPortalProps> = ({ onBackToAdmin }) => {
  const [advisorToken, setAdvisorToken] = useState<string>("AQT6pTj1");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [qrModalUrl, setQrModalUrl] = useState<string | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);

  const getFullUrl = (path: string) => {
    const origin = window.location.origin;
    const tokenStr = advisorToken.trim() ? `?token=${encodeURIComponent(advisorToken.trim())}` : "";
    return `${origin}${path}${tokenStr}`;
  };

  const handleCopy = (id: string, path: string) => {
    const url = getFullUrl(path);
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleShowQr = async (path: string) => {
    const url = getFullUrl(path);
    setQrModalUrl(url);
    try {
      const dataUrl = await QRCode.toDataURL(url, { width: 280, margin: 2 });
      setQrDataUrl(dataUrl);
    } catch {
      setQrDataUrl(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 顶栏顾问 Token 绑定 Banner */}
      <div className="bg-gradient-to-r from-[#1E2066] to-[#2D3092] rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 opacity-10 translate-x-8 -translate-y-8">
          <Sparkles className="w-64 h-64 text-[#FFE100]" />
        </div>
        <div className="relative z-10 space-y-4 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#FFE100] text-xs font-bold border border-white/20">
            <UserCheck className="w-3.5 h-3.5" />
            <span>顾问个人识别码 (Advisor Token) 绑定引擎</span>
          </div>
          <h2 className="text-3xl font-black tracking-tight">非凡科学测评 · 智能分发中心</h2>
          <p className="text-sm text-gray-200 leading-relaxed">
            输入您的专属顾问 Token，生成的链接与二维码将自动带上该标志。学员答题提交后数据将自动归属至您的名下并写入统一数据库。
          </p>

          <div className="flex items-center gap-3 pt-2">
            <input
              type="text"
              value={advisorToken}
              onChange={(e) => setAdvisorToken(e.target.value)}
              placeholder="请输入您的顾问 Token (例如: AQT6pTj1)..."
              className="px-4 py-2.5 rounded-xl bg-white/10 border border-white/30 text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#FFE100] w-64 font-mono font-bold"
            />
            <button
              onClick={onBackToAdmin}
              className="px-5 py-2.5 rounded-xl bg-[#FFE100] hover:bg-amber-300 text-amber-950 font-extrabold text-xs shadow-md transition-all"
            >
              返回数据看板
            </button>
          </div>
        </div>
      </div>

      {/* 5 大测评卡片网格 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ASSESSMENT_LIST.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-3xl p-6 border border-amber-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className={`px-2.5 py-1 text-xs font-extrabold rounded-lg border ${item.tagClass}`}>
                  {item.tag}
                </span>
                <Smartphone className="w-4 h-4 text-gray-400" />
              </div>
              <h3 className="text-lg font-black text-[#1E2066]">{item.title}</h3>
              <p className="text-xs text-gray-600 leading-relaxed">{item.desc}</p>
            </div>

            <div className="pt-4 border-t border-gray-100 space-y-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopy(item.id, item.path)}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold text-amber-950 bg-[#FFE100] hover:bg-amber-300 rounded-xl transition-all shadow-sm"
                >
                  {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-emerald-800" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedId === item.id ? "已复制带参链接" : "复制测评发牌链接"}</span>
                </button>
                <button
                  onClick={() => handleShowQr(item.path)}
                  className="p-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all"
                  title="生成二维码"
                >
                  <QrCode className="w-4 h-4" />
                </button>
                <a
                  href={getFullUrl(item.path)}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all"
                  title="在新窗口打开测试"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 二维码生成 Modal */}
      {qrModalUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white p-6 rounded-3xl max-w-sm w-full text-center space-y-4 shadow-2xl border border-amber-100">
            <h3 className="text-base font-black text-[#1E2066]">测评专属二维码</h3>
            <div className="p-4 bg-amber-50 rounded-2xl inline-block border border-amber-200">
              {qrDataUrl && <img src={qrDataUrl} alt="测评二维码" className="w-48 h-48 mx-auto" />}
            </div>
            <p className="text-xs text-gray-500 font-mono break-all px-2">{qrModalUrl}</p>
            <button
              onClick={() => setQrModalUrl(null)}
              className="w-full py-2.5 bg-[#FFE100] hover:bg-amber-300 text-amber-950 text-xs font-extrabold rounded-xl transition-all shadow-sm"
            >
              关闭
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
