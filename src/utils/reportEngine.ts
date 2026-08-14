/**
 * 学习风格 VAK 诊断报告计算与分析引擎
 */

export interface QuestionAnswer {
  questionId: string;
  value: number;
  responseTimeMs?: number;
  answeredAt?: string;
}

export interface UserAssessmentInfo {
  studentName?: string;
  phoneNumber?: string;
  grade?: string;
  specialtyDirection?: string;
  scoreBand?: string;
  foreignLanguage?: string;
  targetSubject?: string;
  targetSubjectScore?: number;
  targetSubjectFullScore?: number;
  learningFocus?: string;
}

export interface VAKScores {
  V: number;
  A: number;
  K: number;
  dominantType: "V" | "A" | "K" | "VA" | "VK" | "AK" | "VAK";
  dominantLabel: string;
}

export interface StudentReportData {
  overview: {
    studentName: string;
    phoneNumber: string;
    grade: string;
    targetSubject: string;
    targetSubjectScore: number;
    targetSubjectFullScore: number;
    learningFocus: string;
  };
  vakScores: VAKScores;
  radarData: { label: string; score: number }[];
  diagnosisTitle: string;
  diagnosisSummary: string;
  keyRecommendations: string[];
  subjectAdvice: {
    subject: string;
    focus: string;
    suggestions: string[];
  };
}

/**
 * 依据答题分值计算 VAK 维度得分
 */
export function calculateVAKScores(answers: QuestionAnswer[]): VAKScores {
  let vSum = 0, aSum = 0, kSum = 0;
  let vCount = 0, aCount = 0, kCount = 0;

  answers.forEach((ans) => {
    const qid = ans.questionId || "";
    const val = Number(ans.value) || 0;
    if (qid.startsWith("V")) {
      vSum += val;
      vCount++;
    } else if (qid.startsWith("A")) {
      aSum += val;
      aCount++;
    } else if (qid.startsWith("K")) {
      kSum += val;
      kCount++;
    }
  });

  const V = vCount > 0 ? Math.round((vSum / (vCount * 5)) * 100) : 70;
  const A = aCount > 0 ? Math.round((aSum / (aCount * 5)) * 100) : 65;
  const K = kCount > 0 ? Math.round((kSum / (kCount * 5)) * 100) : 60;

  let dominantType: VAKScores["dominantType"] = "V";
  let dominantLabel = "视觉主导型 (Visual)";

  const maxVal = Math.max(V, A, K);
  if (V === maxVal) {
    dominantType = "V";
    dominantLabel = "视觉敏锐型 (Visual)";
  } else if (A === maxVal) {
    dominantType = "A";
    dominantLabel = "听觉语感型 (Auditory)";
  } else {
    dominantType = "K";
    dominantLabel = "动觉体验型 (Kinesthetic)";
  }

  return { V, A, K, dominantType, dominantLabel };
}

/**
 * 根据学生作答数据与元信息生成完整诊断报告
 */
export function generateStudentReport(answers: QuestionAnswer[], userInfo: UserAssessmentInfo): StudentReportData {
  const vak = calculateVAKScores(answers);
  const studentName = userInfo.studentName || "学员";
  const phoneNumber = userInfo.phoneNumber || "";
  const grade = userInfo.grade || "高中";
  const targetSubject = userInfo.targetSubject || "文化课";
  const targetSubjectScore = userInfo.targetSubjectScore || 0;
  const targetSubjectFullScore = userInfo.targetSubjectFullScore || 150;
  const learningFocus = userInfo.learningFocus || "practice";

  let diagnosisTitle = "";
  let diagnosisSummary = "";
  let keyRecommendations: string[] = [];

  if (vak.dominantType === "V") {
    diagnosisTitle = "视觉图形建构型：善于图表总结与结构化思维";
    diagnosisSummary = `${studentName} 同学在图像、颜色、框架和结构化卡片上的吸收效率最高。倾向于看清整体框架后再深入细节，文字转化为思维导图时记忆效率提升 200%。`;
    keyRecommendations = [
      "使用三色荧光笔标注核心考点与错题归因",
      "将文科知识点或理科公式整理为思维导图与框架卡片",
      "建立错题视觉档案，重点看图总结和一错一图"
    ];
  } else if (vak.dominantType === "A") {
    diagnosisTitle = "听觉逻辑复述型：善于朗读讲解与对谈内化";
    diagnosisSummary = `${studentName} 同学对声音、讲解、节奏和口头复述最为敏感。听老师讲解或自己小声复述时，理解与理解深度达到最高峰。`;
    keyRecommendations = [
      "采用费曼学习法，尝试小声将题目步骤解说给自己听",
      "把易错点或英语/语文高频考点录音后在通勤时反复听",
      "积极参与课堂互动与老师答疑，口头确认理解无误"
    ];
  } else {
    diagnosisTitle = "动觉实践体感型：善于动手演练与真题实操";
    diagnosisSummary = `${studentName} 同学在动手刷题、真题实操和实践演练中吸收最快。纯粹看书易疲劳，必须边动手写、边做题才能保持专注。`;
    keyRecommendations = [
      "控制单次看书时间，采用 25 分钟番茄钟 + 5 分钟动手练习",
      "边看题边在草稿纸上勾画关键条件与流程图",
      "通过做题暴露漏洞，再针对性翻书查漏补缺"
    ];
  }

  return {
    overview: {
      studentName,
      phoneNumber,
      grade,
      targetSubject,
      targetSubjectScore,
      targetSubjectFullScore,
      learningFocus
    },
    vakScores: vak,
    radarData: [
      { label: "视觉通道 (Visual)", score: vak.V },
      { label: "听觉通道 (Auditory)", score: vak.A },
      { label: "动觉通道 (Kinesthetic)", score: vak.K }
    ],
    diagnosisTitle,
    diagnosisSummary,
    keyRecommendations,
    subjectAdvice: {
      subject: targetSubject,
      focus: learningFocus,
      suggestions: [
        `针对 ${targetSubject} (目前 ${targetSubjectScore}/${targetSubjectFullScore}分)，建立专属阶段提升卡`,
        `优先解决【${learningFocus === 'memory' ? '记忆复习' : learningFocus === 'practice' ? '解题应用' : '错题突破'}】环节，避免重复无效刷题`,
        `匹配 ${vak.dominantLabel} 学习策略，大幅缩短复习耗时`
      ]
    }
  };
}
