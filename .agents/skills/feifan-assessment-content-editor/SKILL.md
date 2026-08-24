---
name: feifan-assessment-content-editor
description: 非凡教育测评平台“纯内容编辑与文案修改”绝对准则。当需求包含修改测评题目、选项文案、心理机制描述、学科落地案例、行动任务卡说明、报告诊断文字等任何内容调整意图时全自动触发。指导 AI 100% 冻结所有 UI 样式、排版布局、SVG雷达图、进度条与底层计分逻辑，实现零破坏的纯文本编辑。
---

# 非凡教育测评平台 · 内容编辑与防破坏准则 (Feifan Assessment Content Editor Rule)

> **⚡ 自动生效声明**：无需用户显式调用本 Skill 名称。凡是在非凡教育测评平台中进行任何文字、文案、题干、选项、建议、任务卡内容的修改与调整，所有 AI 助手（Cursor, Windsurf, Claude Code, Trae, Antigravity, GitHub Copilot 等）**必须强制全自动执行本准则**！

---

## 🚫 一、绝对禁令 (Zero Tolerance / 严禁触碰)

1. ❌ **严禁修改任何 CSS 样式与类名**
   - 严禁改动 `public/assets/styles.css`、`public/assets/motivation.css`、Tailwind classes 或任何组件中的 class 类名；
   - 严禁随意更改颜色、内边距（padding）、外边距（margin）、圆角、阴影、字体大小等；
   - 严禁改动 `@media print` 打印专用样式与 `@media (max-width: ...)` 响应式断点。

2. ❌ **严禁改动 DOM 节点结构与布局排版**
   - 严禁更改任何 HTML/TSX 标签层级、栅格系统（`grid` / `flex`）、卡片容器结构；
   - 严禁重构雷达图（SVG Radar）、四维进度条（Progress Bar）、任务卡片栅格的生成逻辑；
   - 严禁移除已有的 DOM 节点 ID、容器属性或状态标签（如 `is-hidden`, `is-selected` 等）。

3. ❌ **严禁改动核心打分算法、状态机与接口协议**
   - 严禁修改计分规则、权重计算、雷达图百分比归一化算法；
   - 严禁改动数据持久化（localStorage Draft）、跨步骤状态机（Session State Machine）；
   - 严禁修改免登录公开接口链路（`/api/assessment/result/{id}`、`/api/assessment/detail?id={id}`）及鉴权逻辑。

4. ❌ **严禁删除/更改核心数据字段契约**
   - 题库中的数据键名（如 `id`, `prompt`, `mode`, `dimension`, `options`, `materials`, `task`, `firstStep`, `secondStep`, `completionCheck` 等）**一个字母都不能改动或删除**；
   - 四大模式代码 `V` (视觉)、`A` (听觉)、`R` (读写)、`K` (动觉) 及 12 种底层机制 ID 必须保持原样。

5. ❌ **严禁在修改内容时“顺手重构”或添加未经允许的第三方库**
   - 不允许随意引入新的 UI 框架、图表库（如 ECharts/Chart.js）来替换原生的轻量流光 SVG 架构；
   - 每次修改必须遵循“最小侵入原则”，仅替换对应的文本字符串。

---

## ✅ 二、允许修改的白名单范围 (Safe Edit Scope)

| 内容模块 | 允许编辑的字段 | 文件位置 | 说明 |
| :--- | :--- | :--- | :--- |
| **题目与选项** | `prompt` (题干), `options[].text` (选项文案) | `learning-style-assessment2/.../question-bank.json`<br>`public/assets/assessment.js`<br>`public/assets/motivation-questions.js` | 保持选项数量与模式代码对应 |
| **底层机制文案** | `definition` (心理学解释), `description` (模式导语) | `src/domain/report-builder.js`<br>`public/assets/report.js` | 模式与机制对应描述 |
| **学科真实案例** | `subjectExample` (各学科落地例子) | `src/domain/learning-task-cards.js`<br>`public/assets/report.js` | 区分语文/数学/物理等 10 门学科 |
| **学科行动任务卡** | `materials` (材料), `quantity` (数量), `task` (任务), `firstStep` (第一步), `secondStep` (下一步), `completionCheck` (完成标准) | `src/domain/learning-task-cards.js`<br>`public/assets/report.js` | 针对基础巩固/稳定提升/冲刺提高 |
| **引导与提示语** | `hero-lead`, `eyebrow`, `notice-block` | `public/index.html`<br>`public/motivation/index.html` | 欢迎语、作答须知等文案 |

---

## 🔍 三、AI 修改后强制自检清单 (Checklist)
- [ ] 1. 运行 `npm run build` 确认 0 错误、0 警告；
- [ ] 2. 确认仅改动纯文本字符串，未动任何 CSS、HTML 结构与计分逻辑；
- [ ] 3. 确认雷达图、进度条与卡片在屏幕与打印时 100% 保持完整。
