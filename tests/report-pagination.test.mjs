import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

// 无浏览器依赖的几何回归；真实行框另用浏览器生成 PDF 校验。
const source = readFileSync(new URL('../public/assets/admin.js', import.meta.url), 'utf8');
const start = source.indexOf('function calculateSmartPageBreaks(');
const end = source.indexOf('// 截图仅包含报告正文', start);
const paginate = vm.runInNewContext(`(${source.slice(start, end).trim()})`);
function fixture({ height = 3200, scroll = 0, lines = [], cards = [], graphics = [] } = {}) {
  const rect = ([top, bottom]) => ({ top: top - scroll, bottom: bottom - scroll, width: 600, height: bottom - top });
  const elements = bands => bands.map(band => ({ getBoundingClientRect: () => rect(band) }));
  let current;
  const doc = {
    documentElement: { scrollTop: scroll },
    defaultView: { getComputedStyle: () => ({ display: 'block', visibility: 'visible' }) },
    createTreeWalker: () => {
      let i = 0;
      return { nextNode: () => i < lines.length ? { textContent: '中文测试', parentElement: {}, band: lines[i++] } : null };
    },
    createRange: () => ({ selectNodeContents: n => { current = n; }, getClientRects: () => [rect(current.band)] })
  };
  const node = {
    offsetWidth: 600, ownerDocument: doc,
    getBoundingClientRect: () => ({ top: -scroll, width: 600 }),
    querySelectorAll: selector => selector.startsWith('img') ? elements(graphics) : selector.startsWith('.dimension') ? elements(cards) : []
  };
  return { node, canvas: { width: 600, height } };
}
const run = options => { const { node, canvas } = fixture(options); return Array.from(paginate(node, canvas, 600, 1000)); };
test('大卡片不应让当前页只填满三分之一', () => {
  assert.equal(run({ cards: [[350, 1100]] })[1], 1000);
});
test('长段落在行间分页，不切断中文字行', () => {
  assert.equal(run({ lines: [[980, 1010]], cards: [[350, 2100]] })[1], 980);
});
test('同一行不同字号的行框合并保护', () => {
  assert.equal(run({ lines: [[975, 998], [990, 1012]] })[1], 975);
});
test('滚动前后的分页坐标一致', () => {
  const options = { lines: [[980, 1010]], cards: [[900, 1100]] };
  assert.deepEqual(run(options), run({ ...options, scroll: 700 }));
});
test('短卡片接近页尾时保持完整，图表整体保护', () => {
  assert.equal(run({ cards: [[930, 1100]] })[1], 930);
  assert.equal(run({ graphics: [[750, 1100]] })[1], 750);
});
test('末页不超高，整页倍数不生成空白尾页', () => {
  assert.deepEqual(run({ height: 3000 }), [0, 1000, 2000]);
  assert.deepEqual(run({ height: 3020 }), [0, 1000, 2000, 3000]);
});
