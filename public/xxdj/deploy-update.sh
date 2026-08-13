#!/bin/sh
# deploy-xxdj-update.sh — 部署学习动机测评更新到 xxdj.msrtai.com
# 使用方法：
#   1. 把本文件和以下文件上传到服务器（scp 或 rsync）：
#      - index.html  (带 renderHistoryRecord 的前端页面)
#      - service.py  (新的后端服务)
#      - feifan-logo.png (可选)
#   2. 在服务器上以 root 执行: sh deploy-xxdj-update.sh

set -eu
DOMAIN=xxdj.msrtai.com
WEB_ROOT=/var/www/$DOMAIN
APP_DIR=/opt/xxdj-talent-assessment
DATA_DIR=/var/lib/xxdj-talent-assessment

echo "=== 部署 $DOMAIN ==="

# 1. 备份旧前端
if test -f "$WEB_ROOT/index.html"; then
  cp "$WEB_ROOT/index.html" "$WEB_ROOT/index.html.bak"
  echo "  已备份原 index.html"
fi

# 2. 部署新的前端（含 renderHistoryRecord 函数）
install -m 0644 index.html "$WEB_ROOT/index.html"
echo "  前端: $(wc -c < "$WEB_ROOT/index.html") 字节"

# 3. 部署 logo
if test -f feifan-logo.png; then
  install -m 0644 feifan-logo.png "$WEB_ROOT/feifan-logo.png"
  echo "  Logo 已复制"
fi

# 4. 部署新服务
install -m 0644 service.py "$APP_DIR/service.py"
python3 -m py_compile "$APP_DIR/service.py"
echo "  服务端: 语法检查通过"

# 5. 重启服务
systemctl restart xxdj-talent-assessment.service
sleep 1

# 6. 验证
if systemctl is-active xxdj-talent-assessment.service >/dev/null; then
  echo "  服务运行中 ✓"
else
  echo "  !! 服务启动失败 !!"
  systemctl status xxdj-talent-assessment.service
  exit 1
fi

echo ""
echo "=== 部署完成 ==="
echo "管理后台: https://$DOMAIN/admin"
echo "前端测评: https://$DOMAIN/"
echo ""
echo "注意: 查看报告时，后台会加载前端 index.html 并注入数据，"
echo "      调用 renderHistoryRecord() 渲染。输出应与测评者看到的完全一致。"