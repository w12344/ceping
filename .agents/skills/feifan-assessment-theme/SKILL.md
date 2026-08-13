---
name: feifan-assessment-theme
description: 非凡教育测评平台（包含学习风格测评、学习动机测评、FTH创业者特质测评、FTH微信版特质测评、FTH 1605版及统一后台管理系统）的 UI/UX 主题风格规范与设计系统。参考《于无声处起惊雷》品牌 PPT 视觉设计。在开发、重构或生成测评前端页面、诊断报告与后台 UI 时使用，保持全局视觉与品牌体验高度一致。
---

# 非凡教育测评平台 UI/UX 主题风格规范与设计系统 (Feifan Assessment Theme)

本规范定义了 **非凡教育 / 小凡教育科技（Feifan Education / XiaoFan EduTech）** 测评平台及旗下 5 大测评项目（学习风格测评、学习动机测评、FTH 创业者职业特质测评、FTH 微信版特质测评、FTH 1605版）以及统一后台管理系统的统一视觉设计语言（Design System）。

本设计系统参考 **《于无声处起惊雷》** 官方品牌视觉标准构建。

---

## 1. 品牌理念与视觉基调 (Brand Identity & Aesthetics)

- **品牌口号**: *"于无声处，起惊雷｜Make silence voice 让沉默发声；无声之地，可起惊雷；平凡之处，淬炼非凡。"*
- **核心定位**: 结合 **认知科学 (Science) + AI科技 (Technology) + 人本理念 (Human) + 真实教育 (Education)** 的四位一体一体化评测与诊断。
- **视觉四大支柱**:
  1. **暖奶油色温润底色 (Warm Cream Canvas)**: 全局背景使用温润护眼的暖奶油米白 (`#FFFBE9` / `#FFFDF6`) 渐变，营造人本温度与高质感沉浸体验。
  2. **非凡太阳明黄 (Sun Amber & Bright Gold)**: `#FFE100` / `#F5C518` 作为品牌主高亮色、主按钮、高光图标与激活 Tag 底色。
  3. **1605 科技靛蓝 (Royal Science Navy)**: `#2D3092` / `#34349A` 作为科技底座、结构化标题卡片、AI / 科学标语与对比线条。
  4. **高对比度碳黑字排版 (High-Contrast Carbon Typography)**: 主标题使用 `#1E1A1C` / `#111827` 深碳黑，副标题使用 `#374151`，辅助信息使用 `#6B7280`。

---

## 2. 标准调色板与 Design Tokens

### 2.1 全局色彩 Token
| Token 名称 | 颜色 Hex | 用途说明 |
| :--- | :--- | :--- |
| `--feifan-bg-canvas` | `linear-gradient(135deg, #FFFDF6 0%, #FFFBE9 50%, #FFFDF8 100%)` | 全局页面暖色底色 |
| `--feifan-card-bg` | `#FFFFFF` | 纯白卡片面板底色 |
| `--feifan-gold-primary` | `#FFE100` / `#F5C518` | 品牌太阳黄、主按钮、高亮 Tag |
| `--feifan-navy-science` | `#2D3092` / `#34349A` | 1605 科技靛蓝、结构徽章、科技边框 |
| `--feifan-text-dark` | `#1E1A1C` / `#111827` | 深碳黑主标题、正文强调 |
| `--feifan-text-muted` | `#6B7280` / `#94A3B8` | 辅助说明文字 |
| `--feifan-border-warm` | `#FDE68A` / `#E5E7EB` | 微卡片划线 |

### 2.2 5 大测评项目统一 Badge
| 测评项目 | 描述 | 标签样式类 | 推荐配色 |
| :--- | :--- | :--- | :--- |
| **学习风格测评** | 视觉/听觉/动觉 VAK 感应 | `.tag-xxfg` | 暖金底色 `#FEF3C7` + 深金字 `#D97706` |
| **学习动机测评** | 七维度学业自主力与动机 | `.tag-xxdj` | 靛蓝底色 `#E0F2FE` + 蓝字 `#0284C7` |
| **FTH 创业者特质** | 创始人驱动力与决策模式 | `.tag-fthboss` | 赤红底色 `#FEE2E2` + 橙红字 `#DC2626` |
| **FTH 微信版特质** | 小凡团队特质与合伙人匹配 | `.tag-fthtalent` | 翡翠绿底 `#DCFCE7` + 深绿字 `#16A34A` |
| **FTH 1605版** | AI 研发人才与产物包 | `.tag-fth1605` | 科技紫底 `#F3E8FF` + 紫字 `#9333EA` |

---

## 3. 页面排版与组件规范 (Typography & Components)

### 3.1 品牌抬头与 Header 规范
所有测评页面与报告页面抬头均应包含：
- **品牌 Icon**: 38x38px 方圆盒 (`border-radius: 10px`) 带有 `凡` 字，使用太阳黄渐变 `linear-gradient(135deg, #FFE600 0%, #F5C518 100%)`。
- **主标题**: `非凡教育 · [项目名称]` 或 `小凡教育科技 · [测评报告]`。
- **英文标语**: `Make silence voice 让沉默发声` 或 `NONORDINARY EDUCATION ASSESSMENT`。

### 3.2 胶囊按钮与 Badge 规范
- **所有按钮**: `border-radius: 9999px` 完全圆弧胶囊形。
- **主按钮**: `background: linear-gradient(135deg, #FFE600 0%, #F5C518 100%); color: #1E1A1C; font-weight: 700; border: none; box-shadow: 0 4px 12px rgba(245, 197, 24, 0.35);`

### 3.3 诊断报告 DOM 排版原则
1. **禁止修改测评内容**: 严禁改动任何评估题目、分值算法、得分指标、诊断结论文字等业务逻辑。
2. **结构化卡片分布**:
   - 顶部：品牌 Header + 学员基本档案卡片
   - 核心：诊断结论高亮卡片（太阳黄/靛蓝边框 + 深字）
   - 量化指标：多维雷达图（SVG Hexagon / Radar） + 横向分值进度条
   - 建议：专家行动指南 / 团队匹配建议
   - 页脚：官方落款 + 验证防伪码与云端存储 Key

---

## 4. CSS 组件代码速查表 (Quick Reference Snippets)

```css
/* 品牌主统一样式 */
body {
  background: linear-gradient(135deg, #FFFDF6 0%, #FFFBE9 50%, #FFFDF8 100%);
  color: #1E1A1C;
  font-family: -apple-system, BlinkMacSystemFont, "PingFang SC", "Inter", sans-serif;
  line-height: 1.6;
}

/* 品牌 Logo 盒 */
.feifan-brand-logo {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: linear-gradient(135deg, #FFE600 0%, #F5C518 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 900;
  font-size: 20px;
  color: #1E1A1C;
  box-shadow: 0 4px 12px rgba(245, 197, 24, 0.35);
}

/* 胶囊 Tag */
.feifan-pill-tag {
  display: inline-block;
  padding: 4px 14px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 700;
  background: #FFE100;
  color: #1E1A1C;
}

/* 卡片容器 */
.feifan-card {
  background: #FFFFFF;
  border: 1px solid #FDE68A;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(217, 119, 6, 0.05);
}
```
