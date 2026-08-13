import importlib.util
import unittest
from pathlib import Path


MODULE_PATH = Path(__file__).with_name("fthboss-result-service.py")


def load_service_module():
    spec = importlib.util.spec_from_file_location("fthboss_result_service", MODULE_PATH)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


class FthBossAdminPageTest(unittest.TestCase):
    def test_admin_list_has_full_report_link(self):
        service = load_service_module()
        page = service.admin_page()

        self.assertIn("<th>完整报告</th>", page)
        self.assertIn("summary-text", page)
        self.assertIn("score-grid", page)
        self.assertIn("查看完整报告", page)
        self.assertIn('href="/admin/result?id=${encodeURIComponent(r.id)}"', page)
        self.assertIn('class="btn compact"', page)

    def test_report_page_reuses_frontend_renderer(self):
        service = load_service_module()
        frontend_html = """<!doctype html>
<html lang="zh-CN">
<head><meta charset="utf-8"><title>FTH创业者职业特质测评</title></head>
<body>
  <section class="login-screen" id="loginScreen"></section>
  <main class="app" style="display:none">
    <section class="result" id="resultPanel">
      <svg class="radar-svg" id="radarSvg" viewBox="0 0 360 360"></svg>
      <button id="backBtn" type="button">重新测一次</button>
      <button id="historyBtn" type="button">我的历史</button>
      <span id="loginStatus"></span>
    </section>
  </main>
  <script>
    function renderHistoryRecord(record) { window.renderedRecord = record; }
  </script>
</body>
</html>"""
        page = service.report_page({
            "id": "record-1",
            "name": "创业者",
            "contact": "wechat",
            "summary": "FTH创业者职业特质测评结果",
        }, frontend_html=frontend_html)

        self.assertIn("radarSvg", page)
        self.assertIn("renderHistoryRecord(adminRecord)", page)
        self.assertIn("loginScreen.style.display = \"none\"", page)
        self.assertIn("app.style.display = \"block\"", page)
        self.assertIn("创业者的FTH创业者完整测评报告", page)


if __name__ == "__main__":
    unittest.main()
