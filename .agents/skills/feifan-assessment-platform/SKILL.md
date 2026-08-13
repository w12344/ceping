---
name: feifan-assessment-platform
description: 非凡教育通用测评平台 (Feifan Assessment Platform) 的前端架构、响应式设计系统、组件工程化规范、低代码上传与数据总线对接准则。在开发、重构或扩充测评项目、构建后台 UI 及对接第三方向应用时使用。
---

# 🚀 非凡教育通用测评平台前端架构与设计系统规范 (Feifan Assessment Platform Guidelines)

本规范为 **非凡教育 / 小凡教育科技 (Feifan Education / XiaoFan EduTech)** 通用测评平台及旗下所有测评子模块（学习风格、学习动机、FTH 特质系列及自定义 HTML 模块）的**最高级前端架构指导准则与 UI/UX 视觉系统规范**。

---

## 1. 架构理念与设计语言 (Architectural & Design Language)

### 1.1 品牌视觉基调
- **品牌口号**: *"于无声处，起惊雷｜Make silence voice 让沉默发声；无声之地，可起惊雷；平凡之处，淬炼非凡。"*
- **核心色彩**:
  - **暖奶油画框底色 (Warm Paper Canvas)**: `#FFFDF6` / `#FFFBE9`
  - **非凡太阳明黄 (Primary Gold)**: `#FFE100` / `#F5C518`（主高亮、激活按钮、品牌徽章）
  - **1605 科技深靛蓝 (Science Navy)**: `#1E2066` / `#2D3092`（结构卡片、科技标题、黑夜高对比）
  - **精质琥珀深调 (Amber Accent)**: `#D97706` / `#92400E`（深层数值、主警示标签）
- **圆角与投影规范**:
  - 大卡片容器: `border-radius: 20px / 1.25rem`，微柔和阴影 `box-shadow: 0 10px 30px rgba(45, 48, 146, 0.05)`
  - 胶囊按钮: `border-radius: 9999px`
  - 微量边框: `border: 1px solid #FDE68A` (金边) 或 `border: 1px solid #E5E7EB`

---

## 2. 模块分层与代码架构 (Layered Architecture)

采用 **React + Vite + TypeScript + TailwindCSS** 响应式工程架构：

```
src/
├── components/               # 原子与复合 UI 组件 (通用极高复用)
│   ├── Header.tsx            # 全局品牌顶部栏
│   ├── CustomUploadModal.tsx # 第三方 HTML 上传浮窗
│   ├── ReportModal.tsx       # 完整诊断报告弹窗 (原生+Iframe)
│   ├── PrintGuideModal.tsx   # 飞书/微信内保存与长图生成导向
│   └── RadarChart.tsx        # 7维度/多维度矢量雷达图
├── pages/                    # 业务页面路由
│   ├── AdminDashboard.tsx    # 全量数据流转大屏与搜索过滤
│   ├── AssessmentPortal.tsx  # 测评分发中心与二维码生成
│   └── [Assessment].tsx      # 各场景测评答题与诊断
├── services/                 # 数据总线与底层接口
│   ├── api.ts                # RESTful 数据落盘与列表拉取
│   └── types.ts              # TypeScript 全局接口定义
└── assets/                   # 全局样式与静态多媒体
```

---

## 3. 第三方 HTML 零门槛上传与 SDK 桥接规范

所有非技术人员上传的外部 HTML 测评文件，**必须且仅需**在 HTML 内部引入 SDK 桥接脚本：

```html
<!-- 1. 引入标准 SDK 桥接 -->
<script src="https://ceping.1605ai.com/assets/ceping-bridge.js"></script>

<!-- 2. 答题提交事件调用 -->
<script>
  FeifanAssessment.submit({
    templateCode: "物理诊断",                 // 测评代码标识
    name: "张三",                             // 学员姓名
    contact: "18771233333",                    // 手机号
    answers: { "1": 4, "2": 5 },              // 答题原始对象
    resultData: {                             // 量化诊断数据
      scores: { concept: 90, calculation: 75 },
      profileName: "基础扎实型",
      summary: "概念理解深刻，计算步骤仍需练习"
    }
  });
</script>
```

---

## 4. UI/UX 响应式与防爆死守则 (Defensive Frontend Rules)

1. **绝对防爆防空值 (Zero Crash Rule)**:
   - 任何由后端或用户输入的变量，如 `studentName`、`phoneNumber`、`scoreText`，必须提供优雅回退（例如 `studentName || "匿名学员"`），严禁出现 `undefined` 或 `null` 导致界面崩塌。
2. **多端移动适应与内嵌 Browser 支持**:
   - 针对飞书（Lark）、微信（WeChat）、钉钉等 App 内置 Webview，打印/生成长图需智能识别并引导至保存与长图模式，杜绝 `window.print()` 在内建浏览器中的死锁无反应。
3. **长图导出 0 空白算法**:
   - 在 `html2canvas` 截取报告长图时，必须在 capture 瞬间保存滚动位，平滑滚动至 `(0, 0)` 并设置 `scrollX: 0, scrollY: 0, x: 0, y: 0`，以彻底消除手机端垂直留白现象。

---

## 5. 质量校验与重构验收清单 (Checklist)

- [ ] UI 颜色与 Design Tokens 严格匹配非凡品牌色彩标准；
- [ ] 所有列表与数据传输场景均自带 TypeScript 强类型校验；
- [ ] 自定义 HTML 上传功能可通过管理后台零代码部署并实时预览；
- [ ] 导出 CSV、打印长图、防伪落款等细节流畅无缝。
