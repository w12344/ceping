# FTH职业特质测评-1605 源码包

本包整理自本机现有文件，用于保存 1605 版本的 FTH 职业特质测评资料和生成源码。

## 目录

- `output/FTH职业特质测评-1605.pptx`
  - 1605 版本 PPT 成品。
- `output/ai-rd-talent-attributes-types.pptx`
  - 同主题相关输出版本。
- `source/ai-rd-ppt/`
  - 1605 版本 PPT 的生成脚本、分页面源码、布局 JSON、预览图。
  - 主要入口：`source/ai-rd-ppt/build_ai_rd_updated.cjs`
  - 模块化页面入口：`source/ai-rd-ppt/slides/aiRdTalentDeck.mjs`
- `context/talent-assessment-memory.md`
  - FTH 测评相关背景记录。

## 来源位置

- 生成源码：
  - `/Users/chenpan/Documents/Codex/2026-06-09/fighter-runner-climber-thinker-analyzer-builder/work/ai-rd-ppt`
- PPT 成品：
  - `/Users/chenpan/Documents/Work/01-项目/测评项目/FTH测评/FTH职业特质测评-1605.pptx`
- 相关输出：
  - `/Users/chenpan/Documents/Codex/2026-06-09/fighter-runner-climber-thinker-analyzer-builder/outputs/ai-rd-talent-attributes-types.pptx`

## 注意

`build_ai_rd_updated.cjs` 中的 `pptxgenjs` 依赖路径是本机生成时使用的绝对路径。如果要在其他电脑重新生成，需要安装 `pptxgenjs` 并把第一行依赖路径改成常规引用方式。
