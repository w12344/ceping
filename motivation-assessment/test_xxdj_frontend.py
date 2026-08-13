import unittest
from pathlib import Path


FRONTEND_PATHS = [
    Path(__file__).parent / "xxdj-deploy" / "index.html",
    Path(__file__).parent
    / "Documents"
    / "Work"
    / "01-项目"
    / "测评项目"
    / "学习动机测评"
    / "outputs"
    / "motivation-assessment-link"
    / "index.html",
]


class XxdjFrontendTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.pages = [(path, path.read_text("utf-8")) for path in FRONTEND_PATHS]

    def test_report_print_buttons_use_shared_handler(self):
        for path, html in self.pages:
            with self.subTest(path=str(path)):
                self.assertIn('data-action="print-report"', html)
                self.assertIn("function printReport()", html)
                self.assertIn('addEventListener("click", printReport)', html)
                self.assertNotIn('onclick="window.print()"', html)

    def test_record_button_opens_full_record_page(self):
        for path, html in self.pages:
            with self.subTest(path=str(path)):
                self.assertIn('section id="records"', html)
                self.assertIn("async function openRecord()", html)
                self.assertIn("async function showRecords()", html)
                self.assertIn("async function loadServerRecords()", html)
                self.assertIn("function renderRecords(records)", html)
                self.assertIn('fetch(`/api/my-results?contact=${encodeURIComponent(contact)}`)', html)
                self.assertIn("function serverRecordState(record)", html)
                self.assertIn("renderHistoryRecord(record)", html)
                self.assertIn("查看完整报告", html)

    def test_record_history_shows_brief_report_cards_first(self):
        for path, html in self.pages:
            with self.subTest(path=str(path)):
                self.assertIn("我的测试记录", html)
                self.assertIn("function recordBriefMetrics(record)", html)
                self.assertIn("record-mini-grid", html)
                self.assertIn("支持指数", html)
                self.assertIn("情绪压力", html)
                self.assertIn("动机状态", html)
                self.assertIn("优先关注", html)

    def test_frontend_saves_complete_records_to_existing_backend(self):
        for path, html in self.pages:
            with self.subTest(path=str(path)):
                self.assertIn("function currentReportPayload()", html)
                self.assertIn("function saveServerResult()", html)
                self.assertIn("fetch('/api/results'", html)
                self.assertIn("answerState:{basic:cloneState(basicAnswers),answers:cloneState(answers),situation:cloneState(situationAnswers)}", html)
                self.assertIn("answers:{core:cloneState(answers),situation:cloneState(situationAnswers)}", html)

    def test_admin_record_can_render_from_core_answers_without_basic(self):
        for path, html in self.pages:
            with self.subTest(path=str(path)):
                self.assertIn("if(record.answers&&record.answers.core)return {basic:{name:record.name||'',phone:record.contact||''},answers:record.answers.core,situation:record.answers.situation||{}};", html)

    def test_basic_multi_select_closes_only_after_max_selected(self):
        for path, html in self.pages:
            with self.subTest(path=str(path)):
                self.assertIn("if(checked.length===max)grid.open=false;", html)
                self.assertIn("if(checked.length>max){e.target.checked=false;return;}", html)

    def test_survey_page_navigation_scrolls_to_top(self):
        for path, html in self.pages:
            with self.subTest(path=str(path)):
                self.assertIn("function scrollSurveyPageTop()", html)
                self.assertIn("show('survey');scrollSurveyPageTop();", html)
                self.assertIn("pageIndex--;renderSurvey();scrollSurveyPageTop();", html)
                self.assertIn("pageIndex++;renderSurvey();scrollSurveyPageTop();", html)

    def test_emotion_recovery_question_does_not_duplicate_execution_restart(self):
        for path, html in self.pages:
            with self.subTest(path=str(path)):
                self.assertIn('q(56,"emotion","recovery","当压力影响学习时，我能先把情绪和任务分开，做一件小事让自己稳下来。",true)', html)
                self.assertNotIn("学不进去或情绪不好的时候，我通常能调整过来，重新进入状态。", html)

    def test_execution_restart_reverse_question_is_not_duplicate(self):
        for path, html in self.pages:
            with self.subTest(path=str(path)):
                self.assertIn('q(48,"execution","restart","遇到卡住的题或任务时，我容易停在那里，不知道怎么拆出一个能继续做的小步骤。",true)', html)
                self.assertNotIn("如果学习计划被打断或状态掉线，我很难重新开始。", html)
                self.assertNotIn("被打断以后，我常常不知道先接着做哪一步，只能把任务拖到后面。", html)

    def test_print_downloads_pdf_report(self):
        for path, html in self.pages:
            with self.subTest(path=str(path)):
                self.assertIn('id="printStatus"', html)
                self.assertIn("async function printReport()", html)
                self.assertIn("fetch('/api/report-pdf'", html)
                self.assertIn("reportDocumentHtml()", html)
                self.assertIn("downloadReportPdf(blob)", html)
                self.assertIn(".pdf", html)
                self.assertNotIn("function downloadReportHtml()", html)

    def test_pdf_report_snapshot_excludes_transient_print_status(self):
        for path, html in self.pages:
            with self.subTest(path=str(path)):
                self.assertIn("const reportNode=$('report').cloneNode(true);", html)
                self.assertIn("const transient=reportNode.querySelector('#printStatus');", html)
                self.assertIn("if(transient)transient.remove();", html)
                self.assertIn("reportNode.querySelectorAll('[data-action=\"print-report\"],#restart').forEach(el=>el.remove());", html)
                self.assertIn("const status=$('printStatus'),html=reportDocumentHtml();", html)
                self.assertIn("JSON.stringify({html,filename:reportFileName()})", html)

    def test_header_title_matches_updated_learning_motivation_app(self):
        for path, html in self.pages:
            with self.subTest(path=str(path)):
                self.assertIn("<title>学习动机测评</title>", html)
                self.assertIn("学习动机测评报告", html)
                self.assertNotIn("艺考生文化课学习动机测评", html)

    def test_print_layout_flows_continuously_without_forced_page_breaks(self):
        for path, html in self.pages:
            with self.subTest(path=str(path)):
                self.assertNotIn("break-after: page", html)
                self.assertNotIn("break-before: page", html)


if __name__ == "__main__":
    unittest.main()
