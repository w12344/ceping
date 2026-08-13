import React, { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Copy, ExternalLink, QrCode, Sparkles, Check } from "lucide-react";
import { getCustomTemplates } from "../services/api";

interface AssessmentPortalProps {
  token: string;
  onUpdateToken: (token: string) => void;
  hideTabs?: boolean;
}

export const AssessmentPortal: React.FC<AssessmentPortalProps> = ({
  token,
  onUpdateToken,
  hideTabs = false
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [advisorTokenInput, setAdvisorTokenInput] = useState<string>(token);
  const customTemplates = getCustomTemplates();

  const builtInAssessments = [
    {
      id: "learningStyle",
      title: "学习风格诊断测评",
      category: "POST_SALE",
      categoryName: "🎓 成交后 · 进门学情诊断",
      desc: "四大学习通道与目标学科深度匹配",
      url: "https://ceping.1605ai.com/index.html"
    },
    {
      id: "motivation",
      title: "学习动机诊断测评",
      category: "POST_SALE",
      categoryName: "🎓 成交后 · 状态与动机归因",
      desc: "七大维度与自主积极型行为诊断",
      url: "https://ceping.1605ai.com/motivation/index.html"
    },
    {
      id: "fthBoss",
      title: "FTH 创业者特质测评",
      category: "PRE_SALE",
      categoryName: "🛒 成交前 · 痛点唤醒与引流",
      desc: "创业者 / 领导者潜能剖析与团队匹配",
      url: "https://ceping.1605ai.com/fthboss/index.html"
    },
    {
      id: "fthTalent",
      title: "FTH 职业特质 (微信版)",
      category: "PRE_SALE",
      categoryName: "🛒 成交前 · 痛点唤醒与引流",
      desc: "轻量卡片化人际与思维模式测评",
      url: "https://ceping.1605ai.com/fthtalent/index.html"
    },
    {
      id: "fth1605",
      title: "FTH 1605 深度专向版",
      category: "POST_SALE",
      categoryName: "🎓 成交后 · 教学方案匹配",
      desc: "1605 强效能力与性格特征建模",
      url: "https://ceping.1605ai.com/fth1605/index.html"
    }
  ];

  const allCards = [
    ...builtInAssessments,
    ...customTemplates.map((t) => ({
      id: `custom_${t.templateCode}`,
      title: t.projectName,
      category: t.category,
      categoryName: t.category === "PRE_SALE" ? "🛒 成交前测评" : "🎓 成交后测评",
      desc: `自定义 HTML 测评 (代码: ${t.templateCode})`,
      url: `https://ceping.1605ai.com/custom/${encodeURIComponent(t.templateCode)}/index.html`
    }))
  ];

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const getShareUrl = (baseUrl: string) => {
    return advisorTokenInput ? `${baseUrl}?token=${encodeURIComponent(advisorTokenInput)}` : baseUrl;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 顾问 Token 绑定卡片 */}
      {!hideTabs && (
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-2xl p-6 text-amber-950 shadow-lg relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-amber-900 bg-amber-300/60 px-3 py-1 rounded-full w-fit mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>顾问个人专属 Token 绑定</span>
              </div>
              <h2 className="text-xl font-black text-amber-950">
                科学测评综合分发中心
              </h2>
              <p className="text-xs text-amber-900/80 mt-1">
                绑定顾问 Token 后，生成的测评链接与二维码将自动归集客户线索至您的【销销乐】顾问名下。
              </p>
            </div>

            <div className="flex items-center gap-2 bg-white/90 p-1.5 rounded-xl shadow-inner border border-amber-300/50 w-full md:w-auto">
              <input
                type="text"
                value={advisorTokenInput}
                onChange={(e) => {
                  setAdvisorTokenInput(e.target.value);
                  onUpdateToken(e.target.value);
                }}
                placeholder="输入顾问 Token (如: AQT6pTj1)..."
                className="bg-transparent px-3 py-1.5 text-xs font-mono font-bold text-gray-900 focus:outline-none w-full md:w-52"
              />
            </div>
          </div>
        </div>
      )}

      {/* 测评卡片网格 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allCards.map((card) => {
          const shareUrl = getShareUrl(card.url);
          return (
            <div
              key={card.id}
              className="bg-white rounded-2xl p-6 border border-amber-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-all space-y-4"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                    {card.categoryName}
                  </span>
                </div>
                <h3 className="text-base font-extrabold text-[#1E2066]">
                  {card.title}
                </h3>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                  {card.desc}
                </p>
              </div>

              {/* 二维码展示区 */}
              <div className="bg-[#FFFDF6] p-4 rounded-xl border border-amber-100 flex items-center justify-center">
                <QRCodeSVG value={shareUrl} size={140} level="M" />
              </div>

              {/* 操作按钮区 */}
              <div className="space-y-2 pt-2 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => copyToClipboard(shareUrl, card.id)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold text-amber-950 bg-[#FFE100] hover:bg-amber-300 rounded-xl shadow-sm transition-all"
                  >
                    {copiedId === card.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-800" />
                        <span>已复制带参链接</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>复制发牌链接</span>
                      </>
                    )}
                  </button>
                  <a
                    href={shareUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 text-gray-500 hover:text-amber-700 bg-gray-50 hover:bg-amber-50 rounded-xl border border-gray-200 transition-all"
                    title="在浏览器直接打开"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
