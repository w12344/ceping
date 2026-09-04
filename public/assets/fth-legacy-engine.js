/**
 * FTH 42题原版计分引擎（内核/外延 + 反向题）
 * 仅逻辑，不含 UI。内容来自各产品 content.js。
 */
(function (global) {
  "use strict";

  function scoreAnswer(value, reverse) {
    const raw = Number(value);
    if (!Number.isFinite(raw)) return 0;
    return reverse ? 6 - raw : raw;
  }

  function shuffleQuestions(source) {
    const items = source.map((item, index) => ({ item, sort: randomSortValue(index) }));
    items.sort((a, b) => a.sort - b.sort);
    return items.map((entry) => entry.item);
  }

  function randomSortValue(index) {
    if (global.crypto?.getRandomValues) {
      const value = new Uint32Array(1);
      global.crypto.getRandomValues(value);
      return value[0] + index / 1000;
    }
    return Math.random() + index / 1000;
  }

  function selectTopAttribute(rankedAttrs, rankedTypes, types) {
    if (!rankedAttrs.length) return "fighter";
    const topScore = rankedAttrs[0][1];
    const tiedAttrs = rankedAttrs.filter(([, score]) => score === topScore).map(([key]) => key);
    if (tiedAttrs.length === 1) return tiedAttrs[0];
    const highestRankedTypeInTie = rankedTypes.find(([typeKey]) => tiedAttrs.includes(types[typeKey].attr));
    return highestRankedTypeInTie ? types[highestRankedTypeInTie[0]].attr : tiedAttrs[0];
  }

  function selectTopTypeWithinAttribute(attrKey, outerScores, innerScores, types) {
    const candidates = Object.entries(types)
      .filter(([, t]) => t.attr === attrKey)
      .map(([key]) => key);
    if (!candidates.length) return "runner";
    return candidates.sort((a, b) => {
      const outerDelta = (outerScores[b] || 0) - (outerScores[a] || 0);
      if (outerDelta !== 0) return outerDelta;
      return (innerScores[b] || 0) - (innerScores[a] || 0);
    })[0];
  }

  function cleanPhrase(text) {
    return String(text || "")
      .replace(/\s+/g, " ")
      .trim()
      .replace(/[。！？!?；;，,、\s]+$/u, "");
  }

  function cleanSentence(text) {
    const phrase = cleanPhrase(text);
    return phrase ? `${phrase}。` : "";
  }

  function signalText(typeSignals, typeKey, field, fallback) {
    return cleanPhrase(typeSignals?.[typeKey]?.[field] || fallback || "");
  }

  function shortlistFit(fit, limit) {
    return cleanPhrase(fit)
      .split(/[、，,]/u)
      .map(cleanPhrase)
      .filter(Boolean)
      .slice(0, limit || 4)
      .join("、");
  }

  function scoreTone(score) {
    if (score >= 25) return "很明显";
    if (score >= 20) return "比较明显";
    if (score >= 16) return "有一定表现";
    return "相对偏低";
  }

  function uniqueItems(items, limit) {
    const normalized = items.map(cleanSentence).filter(Boolean);
    return [...new Set(normalized)].slice(0, limit || 4);
  }

  function buildPersonalizedReport(primaryKey, rankedTypes, innerScores, outerScores, topAttrKey, types, typeSignals, comboPhrases, partnerGuides) {
    const primary = types[primaryKey];
    const secondKey = rankedTypes[1]?.[0];
    const thirdKey = rankedTypes[2]?.[0];
    const lowestKey = rankedTypes[rankedTypes.length - 1]?.[0];
    const primaryOuter = Number(outerScores[primaryKey] || 0);
    const secondOuter = Number(outerScores[secondKey] || 0);
    const primaryInner = Number(innerScores[primaryKey] || 0);
    const outerInnerGap = primaryOuter - primaryInner;
    const secondGap = primaryOuter - secondOuter;
    const second = types[secondKey] || primary;
    const third = types[thirdKey] || primary;
    const lowest = types[lowestKey] || primary;
    const secondGift = signalText(typeSignals, secondKey, "gift", second.one);
    const lowestRisk = signalText(typeSignals, lowestKey, "risk", "这部分需要团队补位");
    const lowestPartner = signalText(typeSignals, lowestKey, "partner", partnerGuides?.[topAttrKey]?.[0] || "优先配置能补足你低偏好能力的伙伴");
    const isDoubleCore = secondGap <= 3;
    const isStablePrimary = outerInnerGap <= 4;
    const lowScore = Number(outerScores[lowestKey] || 0);

    const combo = cleanSentence(
      comboPhrases?.[primaryKey]?.[secondKey] || `${primary.cn}是你的主分型，${second.cn}会明显影响你的表达方式`
    );
    const primaryMode = isStablePrimary
      ? `${primary.cn}内核和外延接近，说明这是比较自然、稳定的工作方式`
      : `${primary.cn}外延高于内核，说明这类能力更多是在压力和场景中被激发出来`;
    const secondMode = isDoubleCore
      ? `${second.cn}和主分型分差很小，更像你的第二核心，而不是普通辅助项`
      : `${second.cn}是你的关键补充，会影响你拿结果的方式，但不宜把它当成主角色`;
    const lowMode = lowScore <= 16
      ? `${lowest.cn}偏低：${lowestRisk}`
      : `${lowest.cn}相对靠后，重要项目里这部分不要只靠自己硬补`;

    return {
      strengths: uniqueItems([`${primary.cn}主导：${cleanPhrase(primary.one)}`, secondMode, primaryMode], 3),
      risks: uniqueItems([
        isStablePrimary ? primary.risks[0] : `${primary.cn}更多来自场景激发，连续高强度输出时要留意精力消耗`,
        isDoubleCore ? `双核心会带来弹性，也可能让你在${primary.cn}和${second.cn}之间切换过快，团队需要先确认当下优先级` : primary.risks[1],
        lowMode
      ], 3),
      industry: cleanSentence(`优先看${shortlistFit(primary.fit)}这类场景；判断标准不是行业名本身，而是这个岗位或业务是否同时需要${primary.cn}的主战场能力，以及${second.cn}带来的“${secondGift}”`),
      teamManual: uniqueItems([
        `角色安排上，先让你负责${primary.cn}最擅长的主战场，再给${second.cn}留出发挥空间`,
        isDoubleCore ? `把你当作${primary.cn}+${second.cn}双核心来分工，目标、边界和决策权要提前说清楚` : `不要把${second.cn}相关任务全部压给你，它更适合作为关键时刻的补充能力`,
        `团队需要有人补上${lowest.cn}相关工作，避免你长期承担低偏好角色`
      ], 3),
      partnerGuide: uniqueItems([
        lowestPartner,
        `如果找合伙人，优先补${lowest.cn}，其次找能把${second.cn}优势转成落地节奏的人`,
        `最佳组合方式：你负责${primary.cn}主战场，对方补${lowest.cn}和团队稳定性`
      ], 3),
      combo,
      focus: `${primary.cn}${scoreTone(primaryOuter)}，${second.cn}${scoreTone(secondOuter)}，${lowest.cn}${scoreTone(lowScore)}`
    };
  }

  function calculateLegacyReport(questions, answers, types, attributes, options) {
    options = options || {};
    const typeKeys = Object.keys(types);
    const perTypeCount = {};
    questions.forEach((q) => {
      perTypeCount[q.facet] = (perTypeCount[q.facet] || 0) + 1;
    });
    const maxTypeScore = Math.max(...Object.values(perTypeCount), 1) * 5;

    const innerScores = Object.fromEntries(typeKeys.map((k) => [k, 0]));
    const outerScores = Object.fromEntries(typeKeys.map((k) => [k, 0]));
    const partialScores = Object.fromEntries(typeKeys.map((k) => [k, 0]));
    const answerDetails = [];

    questions.forEach((q) => {
      const raw = answers[q.id];
      const score = scoreAnswer(raw, Boolean(q.reverse));
      answerDetails.push({
        questionId: q.id,
        type: q.facet,
        text: q.prompt,
        reverse: Boolean(q.reverse),
        value: Number(raw),
        score
      });
      if (score >= 4) {
        innerScores[q.facet] += score;
        outerScores[q.facet] += score;
      } else if (score >= 2 && score <= 3) {
        partialScores[q.facet] += score;
        outerScores[q.facet] += score;
      }
    });

    const attrScores = { fighter: 0, thinker: 0, helper: 0 };
    Object.entries(outerScores).forEach(([typeKey, score]) => {
      attrScores[types[typeKey].attr] += score;
    });

    const rankedTypes = Object.entries(outerScores).sort((a, b) => {
      const outerDelta = b[1] - a[1];
      if (outerDelta !== 0) return outerDelta;
      return innerScores[b[0]] - innerScores[a[0]];
    });

    const rankedAttrs = Object.entries(attrScores).sort((a, b) => {
      const scoreDelta = b[1] - a[1];
      if (scoreDelta !== 0) return scoreDelta;
      const bestTypeForB = rankedTypes.find(([typeKey]) => types[typeKey].attr === b[0]);
      const bestTypeForA = rankedTypes.find(([typeKey]) => types[typeKey].attr === a[0]);
      return rankedTypes.indexOf(bestTypeForA) - rankedTypes.indexOf(bestTypeForB);
    });

    const primaryAttr = selectTopAttribute(rankedAttrs, rankedTypes, types);
    const primaryTypeKey = selectTopTypeWithinAttribute(primaryAttr, outerScores, innerScores, types);
    const primaryType = types[primaryTypeKey];
    const secondaryTypeKey = rankedTypes.find(([k]) => k !== primaryTypeKey)?.[0] || rankedTypes[1]?.[0];
    const secondaryType = types[secondaryTypeKey];
    const primaryAttribute = attributes[primaryAttr];
    const traitOrder = rankedAttrs.map(([key]) => attributes[key].initial || attributes[key].en?.[0] || "").join("");

    const dimScores = {
      fighter: attrScores.fighter,
      thinker: attrScores.thinker,
      helper: attrScores.helper
    };

    let personalized = null;
    if (options.typeSignals || options.comboPhrases) {
      personalized = buildPersonalizedReport(
        primaryTypeKey,
        rankedTypes,
        innerScores,
        outerScores,
        primaryAttr,
        types,
        options.typeSignals,
        options.comboPhrases,
        options.partnerGuides
      );
    }

    const innerRadar = {};
    const outerRadar = {};
    typeKeys.forEach((k) => {
      innerRadar[k] = innerScores[k] / maxTypeScore;
      outerRadar[k] = outerScores[k] / maxTypeScore;
    });

    return {
      innerScores,
      outerScores,
      partialScores,
      facetScores: outerScores,
      innerRadar,
      outerRadar,
      maxTypeScore,
      dimScores,
      primaryAttr,
      primaryAttribute,
      primaryTypeKey,
      primaryType,
      secondaryTypeKey,
      secondaryType,
      traitOrder,
      rankedTypes,
      rankedAttrs,
      answerDetails,
      personalized,
      comboSummary: personalized?.combo || ""
    };
  }

  function drawLegacyRadarSvg(svgEl, innerScores, outerScores, types, maxTypeScore) {
    if (!svgEl) return;
    const facetKeys = ["runner", "climber", "analyzer", "builder", "socializer", "keeper"];
    const cx = 180;
    const cy = 180;
    const r = 110;
    const total = facetKeys.length;

    let gridHtml = "";
    [0.33, 0.66, 1.0].forEach((ratio, gridIdx) => {
      const pts = [];
      for (let i = 0; i < total; i++) {
        const angle = -Math.PI / 2 + (i * 2 * Math.PI) / total;
        pts.push(`${(cx + r * ratio * Math.cos(angle)).toFixed(1)},${(cy + r * ratio * Math.sin(angle)).toFixed(1)}`);
      }
      gridHtml += `<polygon points="${pts.join(" ")}" fill="${gridIdx === 2 ? "rgba(254, 243, 199, 0.25)" : "none"}" stroke="#FDE68A" stroke-width="1.2" stroke-dasharray="${gridIdx < 2 ? "3,3" : "none"}" />`;
    });

    let axesHtml = "";
    let labelsHtml = "";
    for (let i = 0; i < total; i++) {
      const angle = -Math.PI / 2 + (i * 2 * Math.PI) / total;
      const x = cx + r * Math.cos(angle);
      const y = cy + r * Math.sin(angle);
      axesHtml += `<line x1="${cx}" y1="${cy}" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}" stroke="#FDE68A" stroke-width="1" />`;
      const lx = cx + (r + 26) * Math.cos(angle);
      const ly = cy + (r + 26) * Math.sin(angle);
      const tObj = types[facetKeys[i]] || { cn: facetKeys[i], en: "" };
      labelsHtml += `<text x="${lx.toFixed(1)}" y="${(ly - 4).toFixed(1)}" text-anchor="middle" font-size="11" font-weight="800" fill="#1E2066">${tObj.cn}</text>`;
      labelsHtml += `<text x="${lx.toFixed(1)}" y="${(ly + 10).toFixed(1)}" text-anchor="middle" font-size="9" fill="#92400E">${tObj.en || ""}</text>`;
    }

    const outerPts = [];
    const innerPts = [];
    facetKeys.forEach((key, i) => {
      const angle = -Math.PI / 2 + (i * 2 * Math.PI) / total;
      const outerRatio = (outerScores[key] || 0) / maxTypeScore;
      const innerRatio = (innerScores[key] || 0) / maxTypeScore;
      outerPts.push(`${(cx + r * outerRatio * Math.cos(angle)).toFixed(1)},${(cy + r * outerRatio * Math.sin(angle)).toFixed(1)}`);
      innerPts.push(`${(cx + r * innerRatio * Math.cos(angle)).toFixed(1)},${(cy + r * innerRatio * Math.sin(angle)).toFixed(1)}`);
    });

    svgEl.innerHTML = `
      ${gridHtml}
      ${axesHtml}
      <polygon points="${outerPts.join(" ")}" fill="rgba(245, 158, 11, 0.28)" stroke="#F59E0B" stroke-width="2.5" stroke-linejoin="round" />
      <polygon points="${innerPts.join(" ")}" fill="rgba(34, 197, 94, 0.32)" stroke="#22C55E" stroke-width="2" stroke-linejoin="round" />
      ${outerPts.map((p) => `<circle cx="${p.split(",")[0]}" cy="${p.split(",")[1]}" r="3.5" fill="#F59E0B" stroke="#FFFFFF" stroke-width="1.5" />`).join("")}
      ${innerPts.map((p) => `<circle cx="${p.split(",")[0]}" cy="${p.split(",")[1]}" r="3" fill="#22C55E" stroke="#FFFFFF" stroke-width="1" />`).join("")}
      ${labelsHtml}
    `;
  }

  global.FTHLegacyEngine = {
    scoreAnswer,
    shuffleQuestions,
    calculateLegacyReport,
    drawLegacyRadarSvg,
    buildPersonalizedReport
  };
})(typeof window !== "undefined" ? window : globalThis);
