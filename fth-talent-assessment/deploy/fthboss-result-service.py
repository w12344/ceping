import base64
import csv
import hashlib
import html
import json
import os
import secrets
import time
import uuid
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import parse_qs, urlparse


PORT = int(os.environ.get("PORT", "8790"))
DATA_DIR = Path(os.environ.get("DATA_DIR", "/var/lib/fth-talent-assessment"))
DB_FILE = DATA_DIR / "results.json"
ADMIN_PASSWORD = os.environ.get("ADMIN_PASSWORD", "change-this-password")
FRONTEND_HTML_PATH = Path(os.environ.get("FRONTEND_HTML_PATH", "/var/www/fthboss.msrtai.com/index.html"))
LOCAL_FRONTEND_HTML_PATH = Path("/Users/chenpan/Documents/FTH/outputs/founder-talent-assessment.html")


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
    return time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())


def contact_hash(contact):
    normalized = " ".join(str(contact or "").strip().lower().split())
    return hashlib.sha256(normalized.encode("utf-8")).hexdigest()


def public_record(record):
    result = dict(record)
    result.pop("answers", None)
    result.pop("userAgent", None)
    result.pop("ip", None)
    result.pop("contactHash", None)
    return result


class Handler(BaseHTTPRequestHandler):
    server_version = "FTHBossFounderResults/1.0"

    def do_HEAD(self):
        self.send_response(200)
        self.end_headers()

    def do_GET(self):
        parsed = urlparse(self.path)
        if parsed.path == "/admin":
            if not self.is_admin():
                self.require_auth()
                return
            self.html_response(200, admin_page())
            return

        if parsed.path == "/admin/result":
            if not self.is_admin():
                self.require_auth()
                return
            params = parse_qs(parsed.query)
            record_id = params.get("id", [""])[0]
            record = next((item for item in read_db()["records"] if item.get("id") == record_id), None)
            if not record:
                self.html_response(404, not_found_page())
                return
            self.html_response(200, report_page(record))
            return

        if parsed.path == "/api/my-results":
            params = parse_qs(parsed.query)
            contact = params.get("contact", [""])[0].strip()
            if not contact:
                self.json_response(400, {"error": "contact_required"})
                return
            key = contact_hash(contact)
            records = [
                public_record(record)
                for record in read_db()["records"]
                if record.get("contactHash") == key
            ]
            records.sort(key=lambda item: item.get("createdAt", ""), reverse=True)
            self.json_response(200, {"records": records})
            return

        if parsed.path == "/api/admin/results":
            if not self.is_admin():
                self.json_response(401, {"error": "unauthorized"})
                return
            records = read_db()["records"]
            records = sorted(records, key=lambda item: item.get("createdAt", ""), reverse=True)
            self.json_response(200, {"records": records, "count": len(records)})
            return

        if parsed.path == "/admin.csv":
            if not self.is_admin():
                self.require_auth()
                return
            self.csv_response()
            return

        self.json_response(404, {"error": "not_found"})

    def do_POST(self):
        parsed = urlparse(self.path)
        if parsed.path != "/api/results":
            self.json_response(404, {"error": "not_found"})
            return

        try:
            length = int(self.headers.get("content-length", "0"))
            payload = json.loads(self.rfile.read(length).decode("utf-8"))
        except Exception:
            self.json_response(400, {"error": "invalid_json"})
            return

        tester = payload.get("tester") or {}
        name = str(tester.get("name") or "").strip()
        contact = str(tester.get("contact") or "").strip()
        if not name or not contact:
            self.json_response(400, {"error": "name_and_contact_required"})
            return

        record = {
            "id": str(uuid.uuid4()),
            "createdAt": now_iso(),
            "name": name,
            "contact": contact,
            "contactHash": contact_hash(contact),
            "assessmentKind": payload.get("assessmentKind", "founder"),
            "assessmentName": payload.get("assessmentName", "FTH创业者职业特质测评"),
            "summary": payload.get("summary", ""),
            "traitOrder": payload.get("traitOrder", ""),
            "topAttribute": payload.get("topAttribute", {}),
            "currentType": payload.get("currentType", {}),
            "primaryType": payload.get("primaryType", {}),
            "secondType": payload.get("secondType", {}),
            "thirdType": payload.get("thirdType", {}),
            "personalizedReport": payload.get("personalizedReport", {}),
            "partnerGuide": payload.get("partnerGuide", []),
            "teamManual": payload.get("teamManual", []),
            "innerScores": payload.get("innerScores", {}),
            "outerScores": payload.get("outerScores", {}),
            "partialScores": payload.get("partialScores", {}),
            "rankedTypes": payload.get("rankedTypes", []),
            "answers": payload.get("answers", []),
            "submittedAt": payload.get("submittedAt", ""),
            "userAgent": self.headers.get("user-agent", ""),
            "ip": self.headers.get("x-forwarded-for", self.client_address[0]).split(",")[0].strip(),
        }
        db = read_db()
        db["records"].append(record)
        write_db(db)
        self.json_response(200, {"ok": True, "id": record["id"], "createdAt": record["createdAt"]})

    def is_admin(self):
        auth = self.headers.get("authorization", "")
        if not auth.startswith("Basic "):
            return False
        try:
            decoded = base64.b64decode(auth[6:]).decode("utf-8")
        except Exception:
            return False
        _, _, password = decoded.partition(":")
        return secrets.compare_digest(password, ADMIN_PASSWORD)

    def require_auth(self):
        self.send_response(401)
        self.send_header("www-authenticate", 'Basic realm="FTH Admin"')
        self.send_header("content-type", "text/plain; charset=utf-8")
        self.end_headers()
        self.wfile.write("Unauthorized".encode("utf-8"))

    def json_response(self, status, payload):
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
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

    def csv_response(self):
        rows = sorted(read_db()["records"], key=lambda item: item.get("createdAt", ""), reverse=True)
        out = []
        header = ["createdAt", "name", "contact", "traitOrder", "primaryType", "secondType", "thirdType", "summary"]
        out.append(",".join(header))
        for record in rows:
            values = [
                record.get("createdAt", ""),
                record.get("name", ""),
                record.get("contact", ""),
                record.get("traitOrder", ""),
                (record.get("primaryType") or {}).get("cn", ""),
                (record.get("secondType") or {}).get("cn", ""),
                (record.get("thirdType") or {}).get("cn", ""),
                record.get("summary", ""),
            ]
            out_row = []
            for value in values:
                text = str(value).replace('"', '""')
                out_row.append(f'"{text}"')
            out.append(",".join(out_row))
        data = ("\ufeff" + "\n".join(out) + "\n").encode("utf-8")
        self.send_response(200)
        self.send_header("content-type", "text/csv; charset=utf-8")
        self.send_header("content-disposition", 'attachment; filename="fthboss-results.csv"')
        self.send_header("cache-control", "no-store")
        self.send_header("content-length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)

    def log_message(self, fmt, *args):
        return


def admin_page():
    return """<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>FTH创业者测评后台</title>
  <style>
    *{box-sizing:border-box}
    body{margin:0;background:#f6f8fb;color:#17202a;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;font-size:14px}
    main{width:min(1500px,calc(100% - 24px));margin:0 auto;padding:28px 0}
    header{display:flex;align-items:center;justify-content:space-between;gap:16px;margin-bottom:18px}
    h1{margin:0;font-size:26px;line-height:1.2}
    button,a.btn{border:0;border-radius:6px;background:#17202a;color:white;padding:9px 13px;text-decoration:none;cursor:pointer;font-size:14px;line-height:1;white-space:nowrap;display:inline-flex;align-items:center;justify-content:center}
    a.btn.compact{padding:7px 10px;font-size:13px;min-width:96px}
    .summary{padding:12px 14px;background:white;border:1px solid #dbe2ec;border-radius:8px;margin-bottom:12px;color:#5c6978}
    .table{overflow:auto;background:white;border:1px solid #dbe2ec;border-radius:8px;box-shadow:0 1px 2px rgba(16,24,40,.04)}
    table{width:100%;min-width:1360px;border-collapse:collapse;table-layout:fixed}
    th,td{padding:10px;border-bottom:1px solid #e7ecf3;text-align:left;vertical-align:top}
    th{font-size:12px;color:#5c6978;background:#f8fafc;position:sticky;top:0;z-index:1;font-weight:700}
    th:nth-child(1),td:nth-child(1){width:136px}
    th:nth-child(2),td:nth-child(2){width:88px}
    th:nth-child(3),td:nth-child(3){width:126px}
    th:nth-child(4),td:nth-child(4){width:72px}
    th:nth-child(5),td:nth-child(5){width:150px}
    th:nth-child(6),td:nth-child(6){width:310px}
    th:nth-child(7),td:nth-child(7){width:360px}
    th:nth-child(8),td:nth-child(8){width:128px}
    .cell-clip{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;min-width:0}
    .summary-text{max-height:106px;overflow:auto;line-height:1.55;color:#344054;font-size:13px;padding-right:4px;word-break:break-word}
    .tag{display:inline-block;padding:4px 8px;border-radius:999px;background:#e9f8ef;color:#078d45;font-weight:700;font-size:12px;line-height:1.4}
    .score-block{font-size:12px;line-height:1.55;color:#243142;min-width:0}
    .score-block strong{display:block;margin:0 0 4px;color:#17202a;font-size:12px}
    .score-block strong:not(:first-child){margin-top:8px}
    .score-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:2px 10px}
    .score-line{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;min-width:0}
    @media (max-width:900px){main{width:calc(100% - 16px);padding:16px 0}header{display:block}.table{border-radius:6px}table{min-width:1280px}}
  </style>
</head>
<body>
<main>
  <header>
    <h1>FTH创业者测评后台</h1>
    <div><a class="btn" href="/admin.csv">导出 CSV</a> <button id="refresh">刷新</button></div>
  </header>
  <div class="summary" id="summary">正在读取...</div>
  <div class="table"><table><thead><tr><th>时间</th><th>姓名</th><th>联系方式</th><th>排序</th><th>主/次/三</th><th>摘要</th><th>得分</th><th>完整报告</th></tr></thead><tbody id="rows"></tbody></table></div>
</main>
<script>
const rows = document.getElementById("rows");
const summary = document.getElementById("summary");
async function load(){
  const res = await fetch("/api/admin/results");
  if(!res.ok){summary.textContent="没有权限或读取失败";return;}
  const data = await res.json();
  summary.textContent = `共 ${data.count} 条测评记录`;
  rows.innerHTML = data.records.map(r => `<tr>
    <td>${esc(fmt(r.createdAt))}</td>
    <td><div class="cell-clip" title="${esc(r.name)}">${esc(r.name)}</div></td>
    <td><div class="cell-clip" title="${esc(r.contact)}">${esc(r.contact)}</div></td>
    <td><span class="tag">${esc(r.traitOrder)}</span></td>
    <td><div class="cell-clip" title="${esc(r.primaryType?.cn||"")} / ${esc(r.secondType?.cn||"")} / ${esc(r.thirdType?.cn||"")}">${esc(r.primaryType?.cn||"")} / ${esc(r.secondType?.cn||"")} / ${esc(r.thirdType?.cn||"")}</div></td>
    <td><div class="summary-text">${esc(r.summary||"")}</div></td>
    <td>${formatScores(r)}</td>
    <td><a class="btn compact" href="/admin/result?id=${encodeURIComponent(r.id)}" target="_blank">查看完整报告</a></td>
  </tr>`).join("");
}
const typeMeta = {
  runner: { cn: "冲刺型", en: "Runner", attr: "fighter" },
  climber: { cn: "攻坚型", en: "Climber", attr: "fighter" },
  analyzer: { cn: "分析型", en: "Analyzer", attr: "thinker" },
  builder: { cn: "创构型", en: "Builder", attr: "thinker" },
  socializer: { cn: "人际型", en: "Socializer", attr: "helper" },
  keeper: { cn: "流程型", en: "Keeper", attr: "helper" }
};
const attrMeta = {
  fighter: { cn: "进取者", en: "Fighter", types: ["runner", "climber"] },
  thinker: { cn: "思辨者", en: "Thinker", types: ["analyzer", "builder"] },
  helper: { cn: "赋能者", en: "Helper", types: ["socializer", "keeper"] }
};
const typeMax = 35;
const attrMax = 70;
function formatScores(r){
  const inner = r.innerScores || {};
  const outer = r.outerScores || {};
  const attrLines = Object.entries(attrMeta).map(([key, meta]) => {
    const score = meta.types.reduce((sum, type) => sum + Number(outer[type] || 0), 0);
    return `<div class="score-line">${esc(meta.cn)} ${esc(meta.en)}：总分 ${score}/${attrMax}</div>`;
  }).join("");
  const typeLines = Object.entries(typeMeta).map(([key, meta]) => {
    return `<div class="score-line">${esc(meta.cn)} ${esc(meta.en)}：内核 ${Number(inner[key] || 0)}/${typeMax}，外延 ${Number(outer[key] || 0)}/${typeMax}</div>`;
  }).join("");
  return `<div class="score-block"><strong>三大特质</strong><div class="score-grid">${attrLines}</div><strong>六大分型</strong><div class="score-grid">${typeLines}</div></div>`;
}
function esc(v){return String(v ?? "").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;")}
function fmt(v){try{return new Date(v).toLocaleString("zh-CN",{hour12:false})}catch{return v||""}}
document.getElementById("refresh").onclick = load;
load();
</script>
</body>
</html>"""


def not_found_page():
    return """<!doctype html>
<html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>记录不存在</title><style>body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;background:#f6f8fb;color:#17202a;margin:0}main{width:min(760px,calc(100% - 32px));margin:60px auto;background:white;border:1px solid #dbe2ec;border-radius:8px;padding:28px}a{color:#176b70}</style></head>
<body><main><h1>记录不存在</h1><p>没有找到这条测评记录。</p><p><a href="/admin">返回后台</a></p></main></body></html>"""


def report_page(record, frontend_html=None):
    page = frontend_html if frontend_html is not None else read_frontend_html()
    record_json = json.dumps(record, ensure_ascii=False)
    title_json = json.dumps(f"{record.get('name') or '未命名'}的FTH创业者完整测评报告", ensure_ascii=False)
    injection = f"""
<script>
(function() {{
  const adminRecord = {record_json};
  const adminTitle = {title_json};

  function openAdminReport() {{
    if (typeof renderHistoryRecord !== "function") {{
      document.body.innerHTML = "<main style=\\"max-width:760px;margin:48px auto;font-family:sans-serif\\"><h1>报告加载失败</h1><p>前端报告渲染函数不可用，请联系管理员。</p><p><a href=\\"/admin\\">返回后台</a></p></main>";
      return;
    }}

    const loginScreen = document.getElementById("loginScreen");
    const app = document.querySelector(".app");
    if (loginScreen) loginScreen.style.display = "none";
    if (app) app.style.display = "block";

    renderHistoryRecord(adminRecord);
    document.title = adminTitle;

    if (loginScreen) loginScreen.style.display = "none";
    if (app) app.style.display = "block";

    const loginStatus = document.getElementById("loginStatus");
    if (loginStatus) loginStatus.textContent = `后台查看：${{adminRecord.name || "未命名"}}`;

    const backBtn = document.getElementById("backBtn");
    if (backBtn) {{
      const cleanBackBtn = backBtn.cloneNode(true);
      cleanBackBtn.textContent = "返回后台";
      cleanBackBtn.onclick = () => {{ window.location.href = "/admin"; }};
      backBtn.replaceWith(cleanBackBtn);
    }}

    ["historyBtn", "topHistoryBtn", "logoutBtn"].forEach((id) => {{
      const el = document.getElementById(id);
      if (el) el.style.display = "none";
    }});
  }}

  if (document.readyState === "loading") {{
    document.addEventListener("DOMContentLoaded", openAdminReport);
  }} else {{
    openAdminReport();
  }}
}})();
</script>
"""
    if "</body>" in page:
        return page.replace("</body>", injection + "\n</body>", 1)
    return page + injection


def read_frontend_html():
    for path in (FRONTEND_HTML_PATH, LOCAL_FRONTEND_HTML_PATH):
        if path.exists():
            return path.read_text("utf-8")
    return """<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><title>报告加载失败</title></head>
<body><main><h1>报告加载失败</h1><p>没有找到前端测评页面模板。</p><p><a href="/admin">返回后台</a></p></main></body></html>"""


if __name__ == "__main__":
    ensure_db()
    server = ThreadingHTTPServer(("127.0.0.1", PORT), Handler)
    print(f"FTH result service listening on 127.0.0.1:{PORT}", flush=True)
    server.serve_forever()
