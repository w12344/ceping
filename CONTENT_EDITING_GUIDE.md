# 📖 非凡教育测评平台 · 内容编辑与教研维护指南 (Content Editing Guide)

本文档专为**教研老师、业务人员及协助编辑的 AI 助手**编写。用于指导如何在不破坏系统排版、样式与计分逻辑的前提下，安全、快速地调整测评文案与学科建议。

---

## 🎯 核心原则
> **“改文案不改骨架，调描述不碰逻辑”**
> 测评系统的视觉排版、流光晶态卡片、雷达图、进度条与打分算法均经过深度工程化封装。编辑时只需关注具体的**文字表述**即可。

---

## 📂 核心文案修改路径对照

| 业务场景 | 对应文件路径 | 关键字段说明 |
| :--- | :--- | :--- |
| **学习模式定位题目** | `learning-style-assessment2/学习风格测评-腾讯云部署源码-v2.7/src/domain/question-bank.json` | `prompt`(题干)、`options[].text`(选项) |
| **学习模式底层机制解释** | `src/domain/report-builder.js` | `MECHANISM_COACH_COPY`(机制心理学解读) |
| **10 大学科落地案例** | `src/domain/learning-task-cards.js` | `SUBJECT_MECHANISM_EXAMPLES`(各学科案例) |
| **10 大学科行动任务卡** | `src/domain/learning-task-cards.js` | `BASE_TASKS`(准备材料、第一步、完成标准) |
| **动力系统探索题目** | `public/assets/motivation-questions.js` | `MOTIVATION_QUESTIONS`(28道题目题干) |
| **动力系统诊断建议** | `public/assets/motivation-report-engine.js` | `DIMENSION_INTERPRETATIONS`(各维度诊断语) |

---

## ⚠️ 严禁触碰的红线
1. ❌ **严禁修改 CSS 文件**（如 `public/assets/styles.css`）；
2. ❌ **严禁改动 HTML 标签结构与 class 类名**；
3. ❌ **严禁修改数据中的英文代号与 ID**（如 `V/A/R/K`、`q01_a`、`achievement` 等）；
4. ❌ **严禁改动打分算法与接口**。

---

## 🛠️ 教研老师如何向 AI 提需求（推荐话术模板）
> *“请帮我将【学习模式定位】中物理学科【稳定提升】阶段的任务卡材料修改为：‘2道近三年高考同类情境真题’，完成标准修改为：‘两题过程图完整且关系式推导无误’。请严格遵守 `feifan-assessment-content-editor` 规则，仅修改文案字符串，严禁改动任何排版与样式。”*
