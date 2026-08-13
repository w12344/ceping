import { getCoreQuestions, getScienceQuestions } from "./question-bank.js";
import { scoreAssessment } from "./scoring.js";
import { classifyProfile } from "./classification.js";
import { buildReport } from "./report-builder.js";
import { selectTaskUnit } from "./zhejiang-task-bank.js";
import { fullScoreForSubject } from "./score-levels.js";

export function generateReportFromAnswers({
  name,
  mobile,
  answers,
  submittedAt,
  userInfo = {},
  grade,
  targetSubject,
  targetSubjectScore,
  targetSubjectFullScore,
  learningFocus
}) {
  const questions = [...getCoreQuestions(), ...getScienceQuestions()];
  const scoreResult = scoreAssessment({ questions, answers: answers || [] });
  const profile = classifyProfile(scoreResult);

  const realGrade = grade || userInfo.grade || "";
  const realSubject = targetSubject || userInfo.targetSubject || userInfo.subject || "";
  const realScore = Number(targetSubjectScore || userInfo.targetSubjectScore || userInfo.score || 0);
  let realFullScore = Number(targetSubjectFullScore || userInfo.targetSubjectFullScore || userInfo.fullScore || 0);
  if (!realFullScore && realSubject) {
    try {
      realFullScore = fullScoreForSubject(realSubject);
    } catch {
      realFullScore = 150;
    }
  }
  if (!realFullScore) realFullScore = 150;
  const rawFocus = learningFocus || userInfo.learningFocus || "";

  const validFocuses = new Set(["learning", "memory", "practice", "improve"]);
  const realFocus = validFocuses.has(rawFocus) ? rawFocus : (
    rawFocus.includes("记忆") || rawFocus.includes("背") ? "memory" :
    rawFocus.includes("做题") || rawFocus.includes("练") ? "practice" :
    rawFocus.includes("错题") || rawFocus.includes("补") ? "improve" :
    rawFocus ? "learning" : ""
  );

  const taskSubject = realSubject || "数学";
  const taskFocus = realFocus || "learning";
  const taskScore = realScore || 90;

  const taskUnit = selectTaskUnit({ subject: taskSubject, learningFocus: taskFocus, score: taskScore });

  const fullReport = buildReport({
    studentName: name || userInfo.studentName || "",
    anonymousCode: "FEIFAN",
    grade: realGrade,
    targetSubject: realSubject || taskSubject,
    learningFocus: realFocus || "learning",
    learningTask: taskUnit.taskLabel,
    targetSubjectScore: realScore || 90,
    targetSubjectFullScore: realFullScore,
    scoreLevel: taskUnit.scoreLevel,
    taskUnit,
    assessmentDate: (submittedAt || new Date().toISOString()).slice(0, 10),
    scoreResult,
    profile
  });
  return fullReport;
}
