import importlib.util
import unittest
from pathlib import Path


MODULE_PATH = Path(__file__).with_name("fth-result-service.py")


def load_service_module():
    spec = importlib.util.spec_from_file_location("fth_result_service", MODULE_PATH)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


class AdminPageTest(unittest.TestCase):
    def test_admin_list_has_full_report_column(self):
        service = load_service_module()
        page = service.admin_page()

        self.assertIn("FTH职业特质测评后台", page)
        self.assertIn("<th>FTH画像</th>", page)
        self.assertIn("<th>六型得分</th>", page)
        self.assertIn("<th>完整报告</th>", page)
        self.assertIn("查看完整报告", page)
        self.assertIn('href="/admin/result?id=${encodeURIComponent(r.id)}"', page)
        self.assertNotIn("${formatAnswers(r)}", page)
        self.assertNotIn("答题", page)
        self.assertNotIn("XXDJ", page)
        self.assertNotIn("目标意义感", page)

    def test_report_page_reuses_frontend_report_renderer(self):
        service = load_service_module()
        frontend_html = """<!doctype html>
<html lang="zh-CN">
<head><meta charset="utf-8"><title>FTH职业特质测评-小凡微信版</title></head>
<body>
  <section class="result" id="resultPanel">
    <svg class="radar-svg" id="radarSvg" viewBox="0 0 360 360"></svg>
    <button id="backBtn" type="button">重新测一次</button>
    <button id="historyBtn" type="button">我的历史</button>
    <span id="loginStatus"></span>
  </section>
  <script>
    function renderHistoryRecord(record) { window.renderedRecord = record; }
  </script>
</body>
</html>"""
        page = service.report_page({
            "name": "测试用户",
            "contact": "wechat",
            "createdAt": "2026-07-05T01:56:57Z",
            "traitOrder": "TFH",
            "topAttribute": {"cn": "思辨者", "en": "Thinker"},
            "currentType": {"cn": "创构型", "en": "Builder"},
            "primaryType": {"cn": "创构型", "en": "Builder"},
            "secondType": {"cn": "分析型", "en": "Analyzer"},
            "thirdType": {"cn": "冲刺型", "en": "Runner"},
            "innerScores": {"builder": 25, "analyzer": 21},
            "outerScores": {"builder": 28, "analyzer": 27},
            "rankedTypes": [
                {"cn": "创构型", "en": "Builder", "score": 28},
                {"cn": "分析型", "en": "Analyzer", "score": 27},
            ],
            "summary": "FTH职业特质测评结果",
            "answers": [],
        }, frontend_html=frontend_html)

        self.assertIn("radarSvg", page)
        self.assertIn("function renderHistoryRecord(record)", page)
        self.assertIn("const adminRecord", page)
        self.assertIn("renderHistoryRecord(adminRecord)", page)
        self.assertIn("测试用户的FTH完整测评报告", page)
        self.assertNotIn("目标意义感", page)


if __name__ == "__main__":
    unittest.main()
