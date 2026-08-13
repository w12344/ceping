#!/bin/sh
set -eu

install -m 0644 /tmp/fthboss-result-service.py /opt/fthboss-talent-assessment/service.py
python3 -m py_compile /opt/fthboss-talent-assessment/service.py
systemctl restart fthboss-talent-assessment.service
sleep 1
systemctl is-active fthboss-talent-assessment.service
