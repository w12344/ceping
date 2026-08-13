---
name: ffcrm-h5-glass-theme
description: FFCRM-H5 销销乐 Glassmorphism (高端薰衣草灰紫半透明玻璃态) UI/UX 设计系统规范。在开发、重构或优化测评中台、老板看板、BI 大屏与 AI 助手 Drawer 时使用，保持与 FFCRM-H5 销销乐原生界面 100% 视觉像素级对齐。
---

# FFCRM-H5 销销乐 Glassmorphism 设计系统规范

本 Skill 定义了 **FFCRM-H5 (销销乐)** 老板看板、BI 仪表盘与中台系统的核心 UI/UX 规范。任何在测评平台、CRM 模块或 BI 看板中构建新功能或重构页面时，必须严格遵守以下 Token 与布局法则。

---

## 🎨 1. 核心色彩 Token (Color Tokens)

### 页面画布底色 (Page Canvas Background)
- **Lavender-Gray Premium Gradient**:
  ```css
  background-image: linear-gradient(180deg, #e0e4f2 0%, #f5f7fa 50%, #eceff9 100%);
  background-attachment: fixed;
  ```
- **背景弥散微光斑**:
  - Top-Left: `rgba(99, 102, 241, 0.08)` (Indigo/Violet)
  - Top-Right: `rgba(51, 112, 255, 0.1)` (Feishu Blue)
  - Bottom: `rgba(236, 239, 249, 0.5)`

### 色彩体系 (Brand Palette)
- **FF Primary Blue**: `#3370ff` / `#2563eb` (主要按钮、选中项、数显强调)
- **Feifan Sun Gold**: `#FFE100` / `#F5C518` (测评品牌徽章、高亮标)
- **Neutral Dark Text**: `#1f2329` (标题与大数字)
- **Secondary Text**: `#475569` / `#4a4a4a` (正文与辅助描述)
- **Muted Text**: `#8f959e` / `#7a7a7a` (提示与小字)
- **Accent Purple**: `#7f3bf5` / `#8b5cf6` (AI 助手、高级状态)
- **Accent Emerald**: `#00b67a` / `#10b981` (完成、上升趋势)

---

## 💎 2. 玻璃态容器规范 (Glassmorphism Containers)

### 毛玻璃卡片 (`.card-glass`)
```css
background: rgba(255, 255, 255, 0.65);
backdrop-filter: blur(24px) saturate(180%);
-webkit-backdrop-filter: blur(24px) saturate(180%);
border: 1px solid rgba(255, 255, 255, 0.8);
box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.06), inset 0 1px 0 0 rgba(255, 255, 255, 0.9);
border-radius: 24px; /* 统一 24px 圆角 */
```

### 浮动悬浮效果 (Hover Elevation)
```css
&:hover {
  background: rgba(255, 255, 255, 0.82);
  box-shadow: 0 16px 40px 0 rgba(31, 38, 135, 0.1), inset 0 1px 0 0 rgba(255, 255, 255, 1);
  transform: translateY(-2px);
}
```

### 胶囊切页 Pill 按钮 (`.pill-button`)
- 高度: `32px` - `36px`
- 圆角: `rounded-full` (`9999px`)
- 激活态: `bg-[#3370ff] text-white shadow-md shadow-blue-500/20`
- 未激活态: `bg-white/50 border border-white/80 text-[#373c43] hover:bg-white/80`

---

## 📐 3. 布局与结构规范 (Layout Architecture)

1. **顶栏 Header (`.ds-header`)**:
   - 包含品牌彩色多重圆点 Logo、视图下拉菜单（"老板看板" / "测评中台"）、财年/年份选择器、通知圆点及用户 Profile 胶囊。
2. **主区域 2 栏式分栏**:
   - **左侧核心 BI 大屏区 (Width: 75% / 80%)**: KPI 达成卡片行、分层/多维数据盘、表格/星系分布。
   - **右侧侧边栏 AI 助手 Drawer (Width: 25% / 20%)**: 标题 "老板助手" / "学情 AI 导师"，结构化建议卡片（支持快捷操作词汇提示与底部输入框）。

---

## ⚡ 4. 性能与降级 (Lite Mode)

- 在弱机型或 URL 包含 `?perf=lite` 时，自动挂载 `html[data-perf="lite"]`。
- 关闭复杂 `backdrop-filter: blur` 与持续背景无限动画，改用单色透明度呈现，确保 60FPS 丝滑体验。
