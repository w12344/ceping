#!/bin/sh
set -eu

cp /etc/nginx/sites-available/fth.msrtai.com "/etc/nginx/sites-available/fth.msrtai.com.bak-$(date +%Y%m%d-%H%M%S)"

python3 - <<'PY'
from pathlib import Path

p = Path("/etc/nginx/sites-available/fth.msrtai.com")
s = p.read_text()
old = """    root /var/www/fth.msrtai.com;
    index index.html;

    location /api/ {
"""
new = """    root /var/www/fth.msrtai.com;
    index index.html;
    access_log /var/log/nginx/fth.access.log combined;
    error_log /var/log/nginx/fth.error.log;

    location = /favicon.ico {
        access_log off;
        return 204;
    }

    location /api/ {
"""
if "fth.access.log" not in s:
    s = s.replace(old, new)
p.write_text(s)
PY

nginx -t
systemctl reload nginx
sed -n '1,130p' /etc/nginx/sites-available/fth.msrtai.com
