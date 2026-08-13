import React, { useState } from "react";
import { QrCode, Copy, ExternalLink, Check, Sparkles, Smartphone, UserCheck, ArrowLeft } from "lucide-react";
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
    tagClass: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20",
    desc: "诊断学生视觉记忆、听觉理解与动觉体感主导模式，精准匹配辅导策略。"
  },
  {
    id: "motivation",
    title: "学习动机测评 (7维度自主力)",
    path: "/xxdj/index.html",
    tag: "成交后深度学情",
    tagClass: "bg-amber-500/10 text-amber-700 border-amber-500/20",
    desc: "从目标意义感、自我效能感与心理压力等 7 大机制深入诊断自主积极型。"
  },
  {
    id: "fthBoss",
    title: "FTH 创业者特质测评 (创始人版)",
    path: "/fthboss/index.html",
    tag: "成交前痛点唤醒",
    tagClass: "bg-indigo-500/10 text-indigo-700 border-indigo-500/20",
    desc: "评估创业者在开拓力、执行力、分析力及抗压力方面的综合商业特质。"
  },
  {
    id: "fthTalent",
    title: "FTH 微信版特质测评 (合伙人版)",
    path: "/fthtalent/index.html",
    tag: "成交前裂变引流",
    tagClass: "bg-blue-500/10 text-blue-700 border-blue-500/20",
    desc: "包含 Fighter、Runner、Climber、Thinker、Analyzer、Builder 6大角色模式。"
  },
  {
    id: "fth1605",
    title: "FTH 1605版 AI 研发特质",
    path: "/fth1605/index.html",
    tag: "高阶人才诊断",
    tagClass: "bg-purple-500/10 text-purple-700 border-purple-500/20",
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
      {/* 顶栏顾问 Token 绑定 Banner (Apple Glass Frost Banner) */}
      <div className="relative rounded-3xl p-8 apple-glass-card overflow-hidden">
        <div className="relative z-10 space-y-4 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 text-amber-800 text-xs font-bold border border-amber-500/20 shadow-sm">
            <UserCheck className="w-3.5 h-3.5" />
            <span>顾问识别码 (Advisor Token) 智能引擎</span>
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">非凡科学测评 · 智能分发中心</h2>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            输入您的专属顾问 Token，生成的发牌链接与二维码将自动携带识别码。学员答题提交后数据将自动写入数据库并实时落盘归属。
          </p>

          <div className="flex items-center gap-3 pt-2">
            <div className="relative">
              <input
                type="text"
                value={advisorToken}
                onChange={(e) => setAdvisorToken(e.target.value)}
                placeholder="输入顾问 Token"
                className="apple-glass-input px-4 py-2.5 rounded-full text-xs font-mono font-bold text-slate-900 focus:outline-none w-64 shadow-sm"
              />
            </div>
            <button
              onClick={onBackToAdmin}
              className="apple-glass-pill px-4 py-2.5 text-xs font-semibold text-slate-700 hover:text-slate-900 rounded-full transition-all active:scale-95 flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>返回管理大屏</span>
            </button>
          </div>
        </div>
      </div>

      {/* 5 大测评卡片 Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ASSESSMENT_LIST.map((item) => (
          <div
            key={item.id}
            className="apple-glass-card rounded-3xl p-6 flex flex-col justify-between transition-all duration-300 group hover:-translate-y-1"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <span className={`px-3 py-1 text-[11px] font-bold rounded-full border shadow-sm ${item.tagClass}`}>
                  {item.tag}
                </span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm animate-pulse" />
              </div>
              <h3 className="text-lg font-extrabold text-slate-900 group-hover:text-amber-600 transition-colors leading-snug">
                {item.title}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                {item.desc}
              </p>
            </div>

            <div className="pt-6 space-y-3 border-t border-slate-100/80 mt-6">
              <div className="p-2.5 bg-slate-50/70 rounded-2xl border border-slate-200/50 font-mono text-[11px] text-slate-500 truncate">
                {getFullUrl(item.path)}
              </div>

              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => handleCopy(item.id, item.path)}
                  className="apple-glass-pill py-2 px-3 text-xs font-bold text-slate-700 hover:text-slate-900 rounded-full transition-all active:scale-95 flex items-center justify-center gap-1"
                >
                  {copiedId === item.id ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 text-slate-400" />
                  )}
                  <span>{copiedId === item.id ? "已复制" : "复制"}</span>
                </button>

                <button
                  onClick={() => handleShowQr(item.path)}
                  className="apple-glass-pill py-2 px-3 text-xs font-bold text-slate-700 hover:text-slate-900 rounded-full transition-all active:scale-95 flex items-center justify-center gap-1"
                >
                  <QrCode className="w-3.5 h-3.5 text-amber-500" />
                  <span>码图</span>
                </button>

                <a
                  href={getFullUrl(item.path)}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-2 text-xs font-extrabold text-slate-950 bg-gradient-to-r from-[#FFE100] to-[#F5C518] rounded-full shadow-sm hover:shadow-md transition-all active:scale-95 flex items-center justify-center gap-1"
                >
                  <span>打开</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Apple Glass 二维码 Modal */}
      {qrModalUrl && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-md flex items-center justify-center p-4">
          <div className="apple-glass-card bg-white/90 rounded-3xl p-8 max-w-sm w-full space-y-6 text-center shadow-2xl relative border border-white/80">
            <h3 className="text-lg font-black text-slate-900">扫码立即体验测评</h3>
            <p className="text-xs text-slate-500 font-medium">支持微信、学练机或浏览器直接扫描开考</p>

            {qrDataUrl ? (
              <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-md inline-block">
                <img src={qrDataUrl} alt="测评发牌二维码" className="w-56 h-56 mx-auto rounded-lg" />
              </div>
            ) : (
              <div className="w-56 h-56 mx-auto bg-slate-100 rounded-2xl flex items-center justify-center text-xs text-slate-400">
                生成二维码中...
              </div>
            )}

            <button
              onClick={() => setQrModalUrl(null)}
              className="w-full py-3 bg-gradient-to-r from-[#FFE100] to-[#F5C518] text-slate-950 font-black text-xs rounded-full shadow-md hover:scale-[1.02] active:scale-95 transition-all"
            >
              关闭弹窗
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
