import importlib.util
import unittest
from pathlib import Path


MODULE_PATH = Path(__file__).parent / "xxdj-deploy" / "service.py"


def load_service_module():
    spec = importlib.util.spec_from_file_location("xxdj_service", MODULE_PATH)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


class XxdjServiceTest(unittest.TestCase):
    def test_public_record_keeps_answers_for_report_recovery(self):
        service = load_service_module()
        record = {
            "name": "陈盼",
            "contact": "18580045034",
            "contactHash": "secret",
            "ip": "127.0.0.1",
            "userAgent": "UA",
            "answers": [{"key": "meaning", "answer": 5}],
        }

        public = service.public_record(record)

        self.assertEqual(public["answers"], [{"key": "meaning", "answer": 5}])
        self.assertNotIn("contactHash", public)
        self.assertNotIn("ip", public)
        self.assertNotIn("userAgent", public)

    def test_report_pdf_endpoint_is_available(self):
        source = MODULE_PATH.read_text("utf-8")

        self.assertIn('"/api/report-pdf"', source)
        self.assertIn("def render_pdf_from_html", source)
        self.assertIn("page.pdf(", source)
        self.assertIn('prefer_css_page_size=True', source)
        self.assertNotIn("scale=0.86", source)
        self.assertIn('"application/pdf"', source)

    def test_service_serves_frontend_for_local_root_paths(self):
        source = MODULE_PATH.read_text("utf-8")

        self.assertIn('if parsed.path in ("/", "/index.html"):', source)
        self.assertIn("return self.html_response(200, frontend_page())", source)

    def test_results_endpoint_keeps_full_report_recovery_fields(self):
        source = MODULE_PATH.read_text("utf-8")

        self.assertIn('"basic": payload.get("basic", {})', source)
        self.assertIn('"answerState": payload.get("answerState", {})', source)
        self.assertIn('"rawScores": payload.get("rawScores", {})', source)
        self.assertIn('"mechScores": payload.get("mechScores", {})', source)
        self.assertIn('"reportVersion": payload.get("reportVersion", "")', source)

    def test_admin_page_uses_legacy_safe_javascript(self):
        service = load_service_module()
        page = service.admin_page()

        self.assertIn('var latest=d.records&&d.records.length?d.records[0].createdAt:"";', page)
        self.assertIn("function esc(v){return String(v==null?\"\":v)", page)
        self.assertNotIn("?.", page)
        self.assertNotIn("??", page)

    def test_admin_report_injects_after_real_body_close(self):
        service = load_service_module()
        original_reader = service._read_frontend_html
        service._read_frontend_html = lambda: (
            "<!doctype html><html><body><script>"
            "function renderHistoryRecord(){};"
            "const html = '</body>';"
            "</script></body></html>"
        )
        try:
            page = service.report_page({"id": "r1", "name": "测试", "answers": []})
        finally:
            service._read_frontend_html = original_reader

        self.assertIn("const html = '</body>';</script>\n<script>\n(function() {", page)


if __name__ == "__main__":
    unittest.main()
