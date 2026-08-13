# FTH职业特质测评源码包

打包时间：2026-08-08

## 目录说明

- `source/fighter-runner-climber-thinker-analyzer-builder/`
  - 当前主源码项目。
  - 包含小凡微信版、创业者版、飞书网页应用包、PPT/海报构建脚本和主要输出文件。

- `archive/FTH测评/`
  - 工作归档目录。
  - 包含历史交付物、工作脚本、海报工具、PDF/PPT 成品和相关资产。

- `deploy/`
  - 线上后台和部署相关文件。
  - `fth-result-service.py`：`https://fth.msrtai.com` 小凡微信版后台服务。
  - `fthboss-result-service.py`：`https://fthboss.msrtai.com` 创业者版后台服务。
  - `fth-nginx.conf` / `fthboss-nginx.conf`：对应 Nginx 配置。
  - `test_fth_result_service.py` / `test_fthboss_result_service.py`：后台服务回归测试。

## 主要测评版本

1. `FTH职业特质测评-小凡微信版`
   - 前端源码：`source/fighter-runner-climber-thinker-analyzer-builder/outputs/wechat-talent-assessment.html`
   - 后台服务：`deploy/fth-result-service.py`

2. `FTH创业者职业特质测评`
   - 前端源码：`source/fighter-runner-climber-thinker-analyzer-builder/outputs/founder-talent-assessment.html`
   - 后台服务：`deploy/fthboss-result-service.py`

3. `人才三大主属性测评` 飞书网页应用包
   - 前端源码：`source/fighter-runner-climber-thinker-analyzer-builder/outputs/feishu-talent-app/index.html`

## 安全说明

部署脚本里的后台密码已在本源码包副本中替换为 `REPLACE_WITH_ADMIN_PASSWORD`。线上真实密码不要放进可转发的源码包里。
