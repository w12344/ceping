# 非凡教育测评平台 (ceping)

非凡教育全量无后端 API 依赖纯前端静态化测评与统一后台管理系统。

## 📦 项目组成模块

1. **统一管理后台 (`feifan-admin-portal`)**:
   - 包含学员测评记录数据拉取、自动分页、完整诊断报告预览（集成 HD 图片导出与打印）及数据导出。
2. **学习模式定位 (`learning-style-assessment`)**:
   - 涵盖视觉、听觉、读写、动觉四种学习入口诊断与行动建议。
3. **动力系统探索 (`motivation-assessment`)**:
   - 7 大维度评估（目标意义感、自主感、自我效能感、方法掌控感、关系支持感、执行启动感、情绪压力感）与双层雷达图。
4. **FTH 创业者职业特质测评 (`fth-boss-assessment`)**:
   - 创业者能力五维度评估与行动建议。
5. **FTH 微信版职业特质测评 (`fth-talent-assessment`)**:
   - 包含 Fighter、Runner、Climber、Thinker、Analyzer、Builder 人格角色分值与诊断卡片。
6. **FTH 1605版 (`fth-1605-assessment`)**:
   - 特质评估与自动生成专业分析报告。

## 🚀 阿里云 OSS 一键部署

运行部署脚本自动同步所有测评项目与统一后台至阿里云 OSS：

```bash
python3 deploy-all-to-oss.py
```
