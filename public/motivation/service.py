#!/usr/bin/env python3
"""XXDJ Learning Motivation Assessment — backend service.

Deployed at xxdj.msrtai.com, proxied by nginx.
"""
import base64
import csv
import hashlib
import json
import os
import secrets
import uuid
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from io import StringIO
from pathlib import Path
from urllib.parse import parse_qs, quote, urlparse


PORT = int(os.environ.get("PORT", "8791"))
DATA_DIR = Path(os.environ.get("DATA_DIR", "/var/lib/xxdj-talent-assessment"))
DB_FILE = DATA_DIR / "results.json"
ADMIN_PASSWORD = os.environ.get("ADMIN_PASSWORD", "change-this-password")
FRONTEND_HTML = Path(os.environ.get(
    "FRONTEND_HTML", "/var/www/xxdj.msrtai.com/index.html"
))
LOCAL_FRONTEND = Path("/Users/chenpan/Documents/Work/01-项目/测评项目/学习动机测评/outputs/motivation-assessment-link/index.html")


# ── OSS Config for XXDJ (学习动机测评) ─────────────────────────
OSS_REGION = os.environ.get("OSS_REGION", "oss-cn-shanghai")
OSS_BUCKET = os.environ.get("OSS_BUCKET", "ceping-air")
OSS_PATH_PREFIX = os.environ.get("OSS_PATH_PREFIX", "xxdj")
OSS_ACCESS_KEY_ID = os.environ.get("OSS_ACCESS_KEY_ID", "")
OSS_ACCESS_KEY_SECRET = os.environ.get("OSS_ACCESS_KEY_SECRET", "")

def upload_record_to_oss(record):
    if not (OSS_ACCESS_KEY_ID and OSS_ACCESS_KEY_SECRET):
        return
    try:
        import oss2
        auth = oss2.Auth(OSS_ACCESS_KEY_ID, OSS_ACCESS_KEY_SECRET)
        endpoint = f"https://{OSS_REGION}.aliyuncs.com"
        bucket = oss2.Bucket(auth, endpoint, OSS_BUCKET)

        name = str(record.get("name") or "匿名").strip()
        contact = str(record.get("contact") or "").strip()
        created_at = str(record.get("createdAt") or "")
        
        date_str = ""
        if created_at and len(created_at) >= 10:
            date_str = created_at[:10].replace("-", "")
        if not date_str:
            from datetime import datetime
            date_str = datetime.utcnow().strftime("%Y%m%d")

        filename = f"{name}_{contact}_{date_str}.json"
        object_key = f"{OSS_PATH_PREFIX}/reports/{filename}"

        headers = {
            "Content-Type": "application/json; charset=utf-8",
            "x-oss-object-acl": "public-read"
        }
        json_data = json.dumps(public_record(record), ensure_ascii=False, indent=2).encode("utf-8")
        bucket.put_object(object_key, json_data, headers=headers)
        
        if record.get("id"):
            token_key = f"{OSS_PATH_PREFIX}/reports/{record['id']}.json"
            bucket.put_object(token_key, json_data, headers=headers)

        print(f"[OSS] XXDJ Report uploaded to: {object_key}")
    except Exception as e:
        print(f"[OSS Error] Failed to upload XXDJ report: {e}")



# ── Dimension labels (for admin table) ─────────────────────────
LABELS = {
    "meaning": "目标意义感", "autonomy": "自主感", "efficacy": "自我效能感",
    "method": "方法掌控感", "support": "关系支持感", "execution": "执行启动感",
    "emotion": "情绪压力感",
}
POSITIVE_KEYS = ["meaning", "autonomy", "efficacy", "method", "support", "execution"]


# ── DB helpers ──────────────────────────────────────────────────
def ensure_db():
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    if not DB_FILE.exists():
        write_db({"records": []})

def read_db():
    ensure_db()
    return json.loads(DB_FILE.read_text("utf-8"))

def write_db(db):
    tmp = DB_FILE.with_suffix(".tmp")
    tmp.write_text(json.dumps(db, ensure_ascii=False, indent=2) + "\n", "utf-8")
    tmp.replace(DB_FILE)

def now_iso():
    from time import gmtime, strftime
    return strftime("%Y-%m-%dT%H:%M:%SZ", gmtime())

def contact_hash(contact):
    n = " ".join(str(contact or "").strip().lower().split())
    return hashlib.sha256(n.encode("utf-8")).hexdigest()

def public_record(rec):
    r = dict(rec)
    for k in ("userAgent", "ip", "contactHash"):
        r.pop(k, None)
    return r

def esc(v):
    return (str(v or "").replace("&","&amp;").replace("<","&lt;")
            .replace(">","&gt;").replace('"',"&quot;").replace("'","&#039;"))


def render_pdf_from_html(html):
    """Render the submitted report HTML as an A4 PDF with print CSS applied."""
    from playwright.sync_api import sync_playwright

    executable = os.environ.get("PLAYWRIGHT_CHROMIUM_EXECUTABLE", "")
    fallback = Path("/root/.cache/ms-playwright/chromium-1217/chrome-linux64/chrome")
    launch_args = {"headless": True}
    if executable:
        launch_args["executable_path"] = executable
    elif fallback.exists():
        launch_args["executable_path"] = str(fallback)

    with sync_playwright() as p:
        browser = p.chromium.launch(**launch_args)
        try:
            page = browser.new_page(viewport={"width": 1120, "height": 1600})
            page.set_content(html, wait_until="networkidle")
            page.emulate_media(media="print")
            return page.pdf(
                format="A4",
                print_background=True,
                prefer_css_page_size=True,
                margin={"top": "10mm", "right": "10mm", "bottom": "10mm", "left": "10mm"},
            )
        finally:
            browser.close()


# ── Admin list page ─────────────────────────────────────────────
def admin_page():
    return """<!doctype html>
<html lang="zh-CN">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>学习动机测评后台</title>
<style>
body{margin:0;background:#f6f8fb;color:#17202a;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;font-size:14px}
main{width:min(1560px,calc(100% - 24px));margin:0 auto;padding:28px 0}
header{display:flex;align-items:center;justify-content:space-between;gap:16px;margin-bottom:18px}
h1{margin:0;font-size:26px}
button,a.btn{border:0;border-radius:6px;background:#17202a;color:white;padding:9px 13px;text-decoration:none;cursor:pointer;font-size:14px;line-height:1;white-space:nowrap}
a.btn.compact{padding:7px 10px;font-size:13px;min-width:44px;display:inline-flex;align-items:center;justify-content:center}
.summary{padding:12px 14px;background:white;border:1px solid #dbe2ec;border-radius:8px;margin-bottom:12px;color:#5c6978}
.table{overflow:auto;background:white;border:1px solid #dbe2ec;border-radius:8px}
table{width:100%;min-width:1040px;border-collapse:collapse;table-layout:fixed}
th,td{padding:10px;border-bottom:1px solid #e7ecf3;text-align:left;vertical-align:top}
th{font-size:12px;color:#5c6978;background:#f8fafc;position:sticky;top:0;font-weight:700}
th:nth-child(1),td:nth-child(1){width:130px}
th:nth-child(2),td:nth-child(2){width:68px}
th:nth-child(3),td:nth-child(3){width:110px}
th:nth-child(4),td:nth-child(4){width:auto}
th:nth-child(5),td:nth-child(5){width:200px}
th:nth-child(6),td:nth-child(6){width:86px}
.tag{display:inline-block;padding:3px 8px;border-radius:999px;background:#e9f8ef;color:#078d45;font-weight:700;font-size:12px}
.muted{color:#697586;font-size:12px}.nowrap{white-space:nowrap}.clip{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
</style>
</head>
<body>
<main>
<header>
<h1>学习动机测评后台</h1>
<div><a class="btn" href="/admin.csv">导出CSV</a> <button id="refresh">刷新</button></div>
</header>
<div class="summary" id="summary">正在读取...</div>
<div class="table"><table><thead><tr>
<th>时间</th><th>姓名</th><th>联系方式</th><th>动机画像</th><th>维度得分</th><th>报告</th>
</tr></thead><tbody id="rows"></tbody></table></div>
</main>
<script>
var rows=document.getElementById("rows"),summary=document.getElementById("summary");
var L=""" + json.dumps(LABELS, ensure_ascii=False) + """;
var PK=""" + json.dumps(POSITIVE_KEYS) + """;
function load(){
  fetch("/api/admin/results").then(function(r){
    if(!r.ok){summary.textContent="权限不足或读取失败";throw new Error("admin_results_failed")}
    return r.json();
  }).then(function(d){
  var latest=d.records&&d.records.length?d.records[0].createdAt:"";
  summary.textContent="共 "+d.count+" 条记录"+(latest?"，最新："+fmt(latest):"");
  var l=L,pk=PK;
  rows.innerHTML=(d.records||[]).map(function(r2){
    var s=r2.scores||{},nm=r2.name||"",ct=r2.contact||"";
    var sp=pk.map(function(k){return l[k]+" "+(s[k]||0)+"/25"}).concat(["情绪 "+(s.emotion||0)+"/25"]).join(" \\u00b7 ");
    var pn=r2.profileName||"",pc=r2.profileCode||"",rn=r2.representativeName||"",risk=r2.risk||"";
    var rc=risk.indexOf("\\u9ad8")>-1?"\\u2716":risk.indexOf("\\u4e2d")>-1?"\\u26a0":"\\u2714";
    return "<tr><td class=\\"nowrap\\">"+esc(fmt(r2.createdAt))+"</td>"+
      "<td><div class=\\"clip\\" title=\\"'"+esc(nm)+"'\\">"+esc(nm)+"</div></td>"+
      "<td><div class=\\"clip\\" title=\\"'"+esc(ct)+"'\\">"+esc(ct)+"</div></td>"+
      "<td><div>"+(pn?"<span class=\\"tag\\">"+esc(pn)+"</span> ":"")+
        (pc?"<div class=\\"muted\\">"+esc(pc)+"</div>":"")+
        (rn?"<div class=\\"muted\\">代表人物\\uff1a"+esc(rn)+"</div>":"")+
        "</div></td>"+
      "<td><div class=\\"muted\\">"+esc(sp)+"</div></td>"+
      "<td><a class=\\"btn compact\\" href=\\"/admin/result?id="+encodeURIComponent(r2.id)+"\\">\\u67e5\\u770b\\u62a5\\u544a</a></td>"+
    "</tr>";
  }).join("");
  }).catch(function(){ if(!summary.textContent){summary.textContent="读取失败，请刷新重试";} });
}
function esc(v){return String(v==null?"":v).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}
function fmt(v){try{return new Date(v).toLocaleString("zh-CN",{hour12:false})}catch(e){return v||""}}
document.getElementById("refresh").onclick=load;load();
</script>
</body>
</html>"""


def not_found_page():
    return """<!doctype html>
<html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>\\u8bb0\\u5f55\\u4e0d\\u5b58\\u5728</title>
<style>body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;background:#f6f8fb;color:#17202a;margin:0}
main{width:min(760px,calc(100% - 32px));margin:60px auto;background:white;border:1px solid #dbe2ec;border-radius:8px;padding:28px}
a{color:#176b70}</style></head>
<body><main><h1>\\u8bb0\\u5f55\\u4e0d\\u5b58\\u5728</h1>
<p>\\u6ca1\\u6709\\u627e\\u5230\\u8fd9\\u6761\\u6d4b\\u8bc4\\u8bb0\\u5f55\\u3002</p>
<p><a href="/admin">\\u8fd4\\u56de\\u540e\\u53f0</a></p></main></body></html>"""


def _read_frontend_html():
    """Try deployed path first, then local."""
    for p in (FRONTEND_HTML, LOCAL_FRONTEND):
        if p.exists():
            return p.read_text("utf-8")
    return None


def frontend_page():
    page = _read_frontend_html()
    if page:
        return page
    return """<!doctype html>
<html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>学习动机测评</title></head><body><main>
<h1>学习动机测评</h1><p>前端页面文件未找到。</p>
</main></body></html>"""


def report_page(record):
    """Inject record into frontend HTML so the full-styled report renders."""
    page = _read_frontend_html()
    if not page:
        return _fallback_report(record)

    record_json = json.dumps(record, ensure_ascii=False)
    title_json = json.dumps(
        (record.get("name") or "\\u672a\\u547d\\u540d") + "\\u7684\\u5b66\\u4e60\\u52a8\\u673a\\u5b8c\\u6574\\u6d4b\\u8bc4\\u62a5\\u544a",
        ensure_ascii=False,
    )

    injection = """
<script>
(function() {
  var adminRecord = %s;
  var adminTitle = %s;

  function openAdminReport() {
    if (typeof renderHistoryRecord !== "function") {
      document.body.innerHTML = '<main style="max-width:760px;margin:48px auto;font-family:sans-serif"><h1>\\u62a5\\u544a\\u52a0\\u8f7d\\u5931\\u8d25</h1><p>\\u524d\\u7aef\\u6e32\\u67d3\\u51fd\\u6570\\u4e0d\\u53ef\\u7528\\u3002</p><p><a href="/admin">\\u8fd4\\u56de\\u540e\\u53f0</a></p></main>';
      return;
    }
    var el; el=document.getElementById("login"); if(el) el.classList.remove("active");
    el=document.getElementById("intro"); if(el) el.classList.remove("active");
    el=document.getElementById("survey"); if(el) el.classList.remove("active");
    el=document.getElementById("report"); if(el) el.classList.add("active");

    renderHistoryRecord(adminRecord);
    document.title = adminTitle;

    var btn=document.getElementById("restartBtn");
    if(btn){var b=btn.cloneNode(true);b.textContent="\\u8fd4\\u56de\\u540e\\u53f0";b.onclick=function(){window.location.href="/admin";};btn.replaceWith(b);}
  }
  if(document.readyState==="loading"){document.addEventListener("DOMContentLoaded",openAdminReport)}
  else{openAdminReport()}
})();
</script>
""" % (record_json, title_json)

    if "</body>" in page:
        head, sep, tail = page.rpartition("</body>")
        return head + injection + "\\n" + sep + tail
    return page + injection


def _fallback_report(record):
    """Compact standalone report when frontend HTML is missing."""
    scores = record.get("scores") or {}
    rows = ""
    for k in POSITIVE_KEYS + ["emotion"]:
        rows += "<tr><td>" + LABELS.get(k, k) + "</td><td>" + str(scores.get(k, "\\u2014")) + "/25</td></tr>"
    nm = esc(record.get("name", "\\u672a\\u547d\\u540d"))
    dt_str = str(record.get("createdAt", ""))[:16]
    si = str(record.get("supportIndex", "\\u2014"))
    si100 = str(record.get("supportIndex100", "\\u2014"))
    risk = esc(record.get("risk", "\\u2014"))
    pn = esc(record.get("profileName", "\\u2014"))
    rn = esc(record.get("representativeName", "\\u2014"))
    sh = record.get("summaryHTML", "\\u6682\\u65e0\\u62a5\\u544a\\u6458\\u8981")
    return """<!doctype html>
<html lang="zh-CN">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>%s\\u7684\\u5b66\\u4e60\\u52a8\\u673a\\u6d4b\\u8bc4\\u62a5\\u544a</title>
<style>
*{box-sizing:border-box}
body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;background:#f6f8fb;color:#17202a;margin:0;padding:24px}
main{max-width:800px;margin:0 auto}h1{font-size:26px}
.card{background:white;border:1px solid #dbe2ec;border-radius:8px;padding:20px;margin-bottom:16px}
.meta{color:#5c6978;font-size:14px}
table{width:100%;border-collapse:collapse}
td{padding:8px 10px;border-bottom:1px solid #e7ecf3}
td:first-child{font-weight:700;color:#5c6978;width:140px}
.summary{line-height:1.7;color:#344054;font-size:14px}
.btn{display:inline-block;border:0;border-radius:6px;background:#17202a;color:#fff;padding:9px 13px;text-decoration:none;font-size:14px;cursor:pointer}
</style>
</head>
<body>
<main>
<h1>%s\\u7684\\u5b66\\u4e60\\u52a8\\u673a\\u6d4b\\u8bc4\\u62a5\\u544a</h1>
<p class="meta">%s</p>
<div class="card"><h2>\\u5206\\u6570\\u6982\\u89c8</h2>
<p>\\u5b66\\u4e60\\u52a8\\u673a\\u652f\\u6301\\u6307\\u6570: %s/150 (%s/100)</p>
<p>\\u60c5\\u7eea\\u538b\\u529b\\u98ce\\u9669: %s</p>
<p>\\u52a8\\u673a\\u753b\\u50cf: %s</p>
<p>\\u4ee3\\u8868\\u4eba\\u7269: %s</p></div>
<div class="card"><h2>\\u7ef4\\u5ea6\\u5f97\\u5206</h2><table>%s</table></div>
<div class="card"><h2>\\u62a5\\u544a\\u6458\\u8981</h2><div class="summary">%s</div></div>
<a class="btn" href="/admin">\\u8fd4\\u56de\\u540e\\u53f0</a>
</main>
</body>
</html>""" % (nm, nm, dt_str, si, si100, risk, pn, rn, rows, sh)


# ── HTTP Handler ────────────────────────────────────────────────
class Handler(BaseHTTPRequestHandler):
    server_version = "XXDJMotivation/1.0"

    def do_HEAD(self):
        self.send_response(200)
        self.end_headers()

    def do_GET(self):
        parsed = urlparse(self.path)
        if parsed.path in ("/", "/index.html"):
            return self.html_response(200, frontend_page())

        if parsed.path == "/admin":
            if not self.is_admin():
                return self.require_auth()
            return self.html_response(200, admin_page())

        if parsed.path == "/admin/result":
            if not self.is_admin():
                return self.require_auth()
            rec_id = parse_qs(parsed.query).get("id", [""])[0]
            rec = next((r for r in read_db()["records"] if r.get("id") == rec_id), None)
            if not rec:
                return self.html_response(404, not_found_page())
            return self.html_response(200, report_page(rec))

        if parsed.path == "/api/admin/results":
            if not self.is_admin():
                return self.json_response(401, {"error": "unauthorized"})
            rows = sorted(read_db()["records"], key=lambda r: r.get("createdAt", ""), reverse=True)
            return self.json_response(200, {"records": rows, "count": len(rows)})

        if parsed.path == "/api/my-results":
            contact = parse_qs(parsed.query).get("contact", [""])[0].strip()
            if not contact:
                return self.json_response(400, {"error": "contact_required"})
            key = contact_hash(contact)
            matched = sorted(
                [public_record(r) for r in read_db()["records"] if r.get("contactHash") == key],
                key=lambda r: r.get("createdAt", ""), reverse=True,
            )
            return self.json_response(200, {"records": matched})

        if parsed.path == "/admin.csv":
            if not self.is_admin():
                return self.require_auth()
            return self.csv_response()

        return self.json_response(404, {"error": "not_found"})

    def do_POST(self):
        parsed = urlparse(self.path)
        if parsed.path == "/api/report-pdf":
            return self.handle_report_pdf()

        if parsed.path != "/api/results":
            return self.json_response(404, {"error": "not_found"})

        try:
            length = int(self.headers.get("content-length", "0"))
            payload = json.loads(self.rfile.read(length).decode("utf-8"))
        except Exception:
            return self.json_response(400, {"error": "invalid_json"})

        name = str(payload.get("name") or "").strip()
        contact = str(payload.get("contact") or "").strip()
        if not name or not contact:
            return self.json_response(400, {"error": "name_and_contact_required"})

        record = {
            "id": str(uuid.uuid4()),
            "createdAt": now_iso(),
            "name": name,
            "contact": contact,
            "contactHash": contact_hash(contact),
            "scores": payload.get("scores", {}),
            "supportIndex": payload.get("supportIndex"),
            "supportIndex100": payload.get("supportIndex100"),
            "risk": payload.get("risk", ""),
            "profileName": payload.get("profileName", ""),
            "profileCode": payload.get("profileCode", ""),
            "profileKeywords": payload.get("profileKeywords", ""),
            "profileText": payload.get("profileText", ""),
            "profileFocus": payload.get("profileFocus", ""),
            "representativeName": payload.get("representativeName", ""),
            "representativeType": payload.get("representativeType", ""),
            "representativeReason": payload.get("representativeReason", ""),
            "isAdvancedStudent": bool(payload.get("isAdvancedStudent", False)),
            "summaryHTML": payload.get("summaryHTML", ""),
            "diagnosticSentence": payload.get("diagnosticSentence", ""),
            "adviceHTML": payload.get("adviceHTML", ""),
            "emotionBadgeColor": payload.get("emotionBadgeColor", ""),
            "emotionBadgeBg": payload.get("emotionBadgeBg", ""),
            "basic": payload.get("basic", {}),
            "answerState": payload.get("answerState", {}),
            "rawScores": payload.get("rawScores", {}),
            "mechScores": payload.get("mechScores", {}),
            "representativeDimension": payload.get("representativeDimension", ""),
            "priorityPoint": payload.get("priorityPoint", ""),
            "reportVersion": payload.get("reportVersion", ""),
            "answers": payload.get("answers", {}),
            "userAgent": self.headers.get("user-agent", ""),
            "ip": self.headers.get("x-forwarded-for", self.client_address[0]).split(",")[0].strip(),
        }
        db = read_db()
        db["records"].append(record)
        write_db(db)
        upload_record_to_oss(record)
        return self.json_response(200, {"ok": True, "id": record["id"], "createdAt": record["createdAt"]})

    def handle_report_pdf(self):
        try:
            length = int(self.headers.get("content-length", "0"))
            if length <= 0 or length > 5 * 1024 * 1024:
                return self.json_response(400, {"error": "invalid_report_size"})
            payload = json.loads(self.rfile.read(length).decode("utf-8"))
        except Exception:
            return self.json_response(400, {"error": "invalid_json"})

        html = str(payload.get("html") or "")
        filename = str(payload.get("filename") or "学习动机测评报告.pdf").strip()
        if not filename.lower().endswith(".pdf"):
            filename += ".pdf"
        if "<html" not in html.lower() or "学习动机测评报告" not in html:
            return self.json_response(400, {"error": "invalid_report_html"})

        try:
            pdf = render_pdf_from_html(html)
        except Exception:
            return self.json_response(500, {"error": "pdf_render_failed"})
        return self.pdf_response(pdf, filename)

    # ── auth & response helpers ────────────────────────────────
    def is_admin(self):
        auth = self.headers.get("authorization", "")
        if not auth.startswith("Basic "):
            return False
        try:
            decoded = base64.b64decode(auth[6:]).decode("utf-8")
        except Exception:
            return False
        return secrets.compare_digest(decoded.partition(":")[2], ADMIN_PASSWORD)

    def require_auth(self):
        self.send_response(401)
        self.send_header("www-authenticate", 'Basic realm="XXDJ Admin"')
        self.send_header("content-type", "text/plain; charset=utf-8")
        self.end_headers()
        self.wfile.write(b"Unauthorized")

    def json_response(self, status, data):
        body = json.dumps(data, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("content-type", "application/json; charset=utf-8")
        self.send_header("cache-control", "no-store")
        self.send_header("content-length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def html_response(self, status, body):
        data = body.encode("utf-8")
        self.send_response(status)
        self.send_header("content-type", "text/html; charset=utf-8")
        self.send_header("cache-control", "no-store")
        self.send_header("content-length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)

    def pdf_response(self, data, filename):
        safe = filename.replace('"', "").replace("\r", "").replace("\n", "") or "report.pdf"
        encoded = quote(safe)
        self.send_response(200)
        self.send_header("content-type", "application/pdf")
        self.send_header("content-disposition", f"attachment; filename*=UTF-8''{encoded}")
        self.send_header("cache-control", "no-store")
        self.send_header("content-length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)

    def csv_response(self):
        out = StringIO()
        w = csv.writer(out)
        w.writerow(["createdAt", "name", "contact", "supportIndex", "supportIndex100",
                     "risk", "profileName", "profileCode",
                     "meaning", "autonomy", "efficacy", "method", "support", "execution", "emotion",
                     "isAdvancedStudent", "representativeName"])
        for r in sorted(read_db()["records"], key=lambda x: x.get("createdAt", ""), reverse=True):
            s = r.get("scores") or {}
            w.writerow([
                r.get("createdAt", ""), r.get("name", ""), r.get("contact", ""),
                r.get("supportIndex", ""), r.get("supportIndex100", ""),
                r.get("risk", ""), r.get("profileName", ""), r.get("profileCode", ""),
                s.get("meaning", ""), s.get("autonomy", ""), s.get("efficacy", ""),
                s.get("method", ""), s.get("support", ""), s.get("execution", ""),
                s.get("emotion", ""),
                "是" if r.get("isAdvancedStudent") else "否",
                r.get("representativeName", ""),
            ])
        data = ("\\ufeff" + out.getvalue()).encode("utf-8")
        self.send_response(200)
        self.send_header("content-type", "text/csv; charset=utf-8")
        self.send_header("content-disposition", 'attachment; filename="xxdj-results.csv"')
        self.send_header("cache-control", "no-store")
        self.send_header("content-length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)

    def log_message(self, fmt, *args):
        pass


if __name__ == "__main__":
    ensure_db()
    server = ThreadingHTTPServer(("127.0.0.1", PORT), Handler)
    print(f"XXDJ motivation service: http://127.0.0.1:{PORT}", flush=True)
    print(f"Admin: http://127.0.0.1:{PORT}/admin", flush=True)
    server.serve_forever()
