#!/bin/sh
set -eu

install -d -m 0755 /opt/fth-talent-assessment
install -m 0644 /tmp/fth-result-service.py /opt/fth-talent-assessment/service.py
python3 -m py_compile /opt/fth-talent-assessment/service.py

install -d -m 0755 /var/lib/fth-talent-assessment
if [ ! -f /var/lib/fth-talent-assessment/results.json ]; then
  printf '{"records": []}\n' > /var/lib/fth-talent-assessment/results.json
fi

cat > /etc/systemd/system/fth-talent-assessment.service <<'EOF'
[Unit]
Description=FTH Talent Assessment Result Service
After=network.target

[Service]
Type=simple
Environment=PORT=8790
Environment=DATA_DIR=/var/lib/fth-talent-assessment
Environment=ADMIN_PASSWORD=REPLACE_WITH_ADMIN_PASSWORD
WorkingDirectory=/opt/fth-talent-assessment
ExecStart=/usr/bin/python3 /opt/fth-talent-assessment/service.py
Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable --now fth-talent-assessment.service
sleep 1
systemctl is-active fth-talent-assessment.service
curl -sS -I http://127.0.0.1:8790/admin | sed -n '1,8p'
