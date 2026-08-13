#!/bin/sh
set -eu

install -m 0644 /tmp/fth-result-service.py /opt/fth-talent-assessment/service.py
python3 -m py_compile /opt/fth-talent-assessment/service.py
python3 - <<'PY'
import json
from pathlib import Path

p = Path("/var/lib/fth-talent-assessment/results.json")
db = json.loads(p.read_text("utf-8"))
db["records"] = [
    r for r in db.get("records", [])
    if r.get("id") != "5ae97066-cb79-406f-b688-18a0232fced5"
    and r.get("contact") != "__codex_test__"
]
p.write_text(json.dumps(db, ensure_ascii=False, indent=2) + "\n", "utf-8")
print(len(db["records"]))
PY
systemctl restart fth-talent-assessment.service
sleep 1
systemctl is-active fth-talent-assessment.service
