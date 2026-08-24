# 🚨 非凡教育测评平台 · 全局 AI 自动感知与内容编辑绝对准则 (AUTO-ACTIVATING DIRECTIVE)

> ⚡ **AUTO-TRIGGER MANDATE (自动触发指令)**:
> 凡是用户的需求涉及到**修改/添加/调整测评题目、选项文案、心理学机制解释、10大学科案例、行动任务卡、诊断结论文字、或任何页面说明**（无需用户显式提及 skill 名称），所有 AI 必须**立即全自动激活并 100% 严格遵循 `feifan-assessment-content-editor` 准则**！
>
> 🔒 **核心红线 (ZERO TOLERANCE)**:
> 1. **严禁修改任何 CSS/样式**（包括 `styles.css`、`motivation.css`、Tailwind classes、内联样式、圆角、内边距、外边距等）；
> 2. **严禁改动任何 DOM 结构与排版**（包括 HTML/TSX 标签层级、卡片容器、SVG 雷达图、四维进度条、打印排版 `@media print`）；
> 3. **严禁改动打分算法与业务逻辑**（包括计分引擎、数据聚合、百分比归一化、Session 状态流转、免登录接口）；
> 4. **严禁删除/更改字段契约与ID**（所有 `V/A/R/K`、`id`、`prompt`、`options`、`materials`、`task`、`firstStep`、`secondStep`、`completionCheck` 键名必须原样保留）。

---

## 🎯 自动触发关键词 (AUTO-ACTIVATE KEYWORDS)
当用户输入包含以下任意意图或关键词时，立即自动执行纯内容编辑准则：
- “修改题目 / 调整题目 / 改题干 / 改选项 / 换个说法”
- “修改文案 / 优化文案 / 改一下描述 / 调整文字 / 润色一下”
- “修改学科案例 / 调整语文/数学/物理...建议”
- “修改任务卡 / 改第一步/第二步/材料/完成标准”
- “调整诊断结果 / 修改结论 / 优化报告内容”

---

## ✅ 允许修改的白名单 (SAFE EDIT LIST)
- **题干与选项文本**：仅修改 `prompt` 和 `options[].text` 中的中文文字。
- **心理机制文案**：仅修改 `definition` 和 `description` 的描述文本。
- **学科真实案例**：仅修改 `subjectExample` 中语文/数学/物理等 10 门学科的举例文案。
- **行动任务卡文案**：仅修改 `materials`, `quantity`, `task`, `firstStep`, `secondStep`, `completionCheck` 中的说明文字。

---

## 📂 核心文案文件映射 (CONTENT MAP)
1. **学习模式定位题库**：`learning-style-assessment2/学习风格测评-腾讯云部署源码-v2.7/src/domain/question-bank.json`
2. **学习模式机制心理学描述**：`src/domain/report-builder.js`
3. **10大学科案例与落地任务卡**：`src/domain/learning-task-cards.js`
4. **动力系统题目**：`public/assets/motivation-questions.js`
5. **动力系统维度诊断语**：`public/assets/motivation-report-engine.js`

---

## 🔍 修改后强制自检 (MANDATORY VERIFICATION)
修改完纯文本后，必须运行 `npm run build` 确保 0 错误、0 警告，并确认 UI 样式、雷达图、进度条与排版 100% 毫无变形。
