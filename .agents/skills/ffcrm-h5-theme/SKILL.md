---
name: ffcrm-h5-theme
description: FFCRM-H5 (销销乐/老板看板) 专属 UI/UX 视觉设计语言与主题风格规范。在重构、扩展非凡测评平台、销销乐看板或相关 H5/Web 前端时使用此 Skill，保持高质感冷调熏衣草粉灰玻璃态 (Cool Lavender Mist Glassmorphism) 视觉一致性。
---

# FFCRM-H5 (销销乐 / 老板看板) 视觉设计系统与主题规范

本规范提炼自 FFCRM-H5 (销销乐 / 老板看板) 的真实 UI/UX 视觉设计语言，旨在打造高质感、科技感与现代感兼备的冷调熏衣草玻纤 (Cool Lavender Mist Glassmorphism) 界面。

---

## 🎨 1. 色彩 Token 系统 (Color Tokens)

### 1.1 画布与玻璃底色 (Canvas & Glass Backgrounds)
- **全局画布 (Page Canvas)**: `linear-gradient(135deg, #E2E4F0 0%, #ECEEF8 50%, #F0F2FA 100%)` (冷调熏衣草迷雾灰)
- **玻璃卡片 (Glass Card BG)**: `rgba(255, 255, 255, 0.82)` 配合 `backdrop-filter: blur(20px)`
- **悬浮与激活高亮 (Glass Hover)**: `rgba(255, 255, 255, 0.95)` 配合 `box-shadow: 0 12px 32px rgba(31, 35, 41, 0.08)`
- **分段控制槽 (Segmented Slot)**: `rgba(229, 231, 243, 0.7)`

### 1.2 品牌与功能发光色 (Brand & Accent Colors)
- **主功能蓝 (Primary Blue)**: `#3370FF` / `#4F46E5` (飞书蓝与深靛蓝)
- **核心紫色 (Vibrant Purple)**: `#7F3BF5` / `#8B5CF6` (AI 助手与核心进度)
- **成功绿 (Success Emerald)**: `#00B67A` / `#10B981`
- **预警橙 (Warning Orange)**: `#FF8800` / `#F59E0B`
- **高危红 (Alert Red)**: `#F54A45` / `#EF4444`

---

## 📐 2. 页面布局与 Header 结构

### 2.1 悬浮胶囊顶栏 (Floating Glass Header)
- **容器形态**: 悬浮顶部，`h-16` 或 `h-14`，`bg-white/80 backdrop-blur-xl border-b border-white/60`
- **品牌 Logo**: 多彩渐变圆环或发光节点 + 粗体品牌字 (`销销乐 / 非凡测评`)
- **控件流**:
  - 主主题/模式分段选择器 (`老板看板`, `星系模式`, `数据大屏`)
  - 下拉筛选胶囊 (如 `2027财年 ▾`)
  - 功能微型胶囊按钮: 绿/紫/红 状态圆点与带 Badge 数字 (`2`) 消息通知
  - 用户头像: 紫色渐变发光环形框 + 姓名

---

## 💳 3. 卡片与网格规范 (Card & Grid Architecture)

### 3.1 核心 KPI 汇总卡片 (KPI Summary Cards)
- **边框与阴影**: `rounded-2xl border border-white/80 shadow-[0_8px_30px_rgba(31,35,41,0.05)]`
- **数值与趋势**: 左侧超大粗体数值 + 环形进度仪表盘 (如蓝色/橙色弧形 `13.3%`, `2.5%`)

### 3.2 分段切页 Tabs (Segmented Control Bar)
- **背景**: `bg-[#E5E7F3]/70 backdrop-blur-md p-1.5 rounded-2xl`
- **Active 状态**: `bg-white text-slate-900 shadow-sm rounded-xl font-bold`
- **Inactive 状态**: `text-slate-500 hover:text-slate-800`

### 3.3 数据表格与行 (Data Table Grid)
- **表头**: `bg-slate-100/50 text-slate-500 font-bold uppercase`
- **表格行**: `hover:bg-indigo-50/40 transition-colors`
- **操作按钮**: 渐变蓝/紫圆角胶囊 (`bg-gradient-to-r from-[#4F46E5] to-[#3B82F6] text-white rounded-full py-1.5 px-4 font-bold shadow-sm hover:shadow-md`)

---

## 🛠️ 4. CSS 代码实操类名

```css
.ffcrm-canvas {
  background: linear-gradient(135deg, #E2E4F0 0%, #ECEEF8 50%, #F0F2FA 100%);
  background-attachment: fixed;
}

.ffcrm-glass-card {
  background: rgba(255, 255, 255, 0.82);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.7);
  box-shadow: 0 8px 30px 0 rgba(31, 35, 41, 0.05);
  border-radius: 20px;
}

.ffcrm-segmented-bar {
  background: rgba(229, 231, 243, 0.75);
  backdrop-filter: blur(12px);
  padding: 4px;
  border-radius: 16px;
}

.ffcrm-pill-active {
  background: #ffffff;
  color: #1f2329;
  box-shadow: 0 2px 8px rgba(31, 35, 41, 0.08);
  border-radius: 12px;
  font-weight: 700;
}
```
