import assert from 'node:assert/strict';
import { parseInches, formatInches, formatFeetInches, formatCm, solveByCount, solveByGap, positions, packBoards, plan, STOCK_IMPERIAL } from '../src/lib/layout.mjs';

let n = 0;
const t = (name, fn) => { fn(); n++; console.log('ok', name); };
const near = (a, b, e = 1e-9) => assert.ok(Math.abs(a - b) < e, `${a} vs ${b}`);

t('parse inches', () => {
  assert.equal(parseInches('6'), 6);
  assert.equal(parseInches('6.5'), 6.5);
  assert.equal(parseInches('6 1/2'), 6.5);
  assert.equal(parseInches('6-1/2'), 6.5);
  assert.equal(parseInches('3/4'), 0.75);
  assert.equal(parseInches('2 1/2"'), 2.5);
  assert.ok(Number.isNaN(parseInches('abc')));
  assert.ok(Number.isNaN(parseInches('')));
  assert.ok(Number.isNaN(parseInches('1/0')));
});
t('format inches', () => {
  assert.equal(formatInches(13.25), '13 1/4"');
  assert.equal(formatInches(0.5), '1/2"');
  assert.equal(formatInches(4), '4"');
  assert.equal(formatInches(2.03125), '2 1/16"'); // 2 1/32 rounds up to 1/16
  assert.equal(formatInches(13.2222), '13 1/4"');
});
t('format feet and inches', () => {
  assert.equal(formatFeetInches(142.75), `11' 10 3/4"`);
  assert.equal(formatFeetInches(144), `12'`);
  assert.equal(formatFeetInches(1.25), `1 1/4"`);
  assert.equal(formatFeetInches(0), `0"`);
  assert.equal(formatFeetInches(155.5), `12' 11 1/2"`);
  assert.equal(formatFeetInches(144.5), `12' 1/2"`);
});
t('format cm', () => assert.equal(formatCm(10), '25.4 cm'));
t('solve by count with end battens', () => {
  const r = solveByCount(144, 2.5, 10, true);
  near(r.gap, 119 / 9);
  assert.equal(r.gaps, 9);
  assert.equal(formatInches(r.gap), '13 1/4"');
});
t('solve by count without end battens', () => {
  const r = solveByCount(144, 2.5, 10, false);
  near(r.gap, 119 / 11);
  assert.equal(r.gaps, 11);
  assert.equal(formatInches(r.gap), '10 13/16"');
});
t('layout always fills the wall exactly', () => {
  for (const ends of [true, false]) {
    const r = solveByCount(171.25, 3.5, 17, ends);
    const m = positions(171.25, 3.5, 17, r.gap, ends);
    const last = m[m.length - 1];
    near(last.right + (ends ? 0 : r.gap), 171.25);
    near(m[0].left, ends ? 0 : r.gap);
  }
});
t('solve by gap picks the closest count', () => {
  const r = solveByGap(144, 2.5, 3, true);
  assert.equal(r.count, 27);
  near(r.gap, 76.5 / 26);
  const r2 = solveByGap(144, 2.5, 10, false);
  assert.equal(r2.count, 11); // (144-10)/12.5 = 10.72
});
t('centre marks', () => {
  const r = solveByCount(144, 2.5, 10, true);
  const m = positions(144, 2.5, 10, r.gap, true);
  near(m[0].centre, 1.25);
  near(m[9].centre, 142.75);
  assert.equal(formatFeetInches(m[9].centre), `11' 10 3/4"`);
  near(m[1].centre - m[0].centre, 2.5 + r.gap);
});
t('packing boards', () => {
  const four = Array.from({ length: 4 }, () => ({ len: 36 }));
  assert.equal(packBoards(four, 96).boards, 2); // 36 + 1/8 + 36 fits, three do not
  const ten = Array.from({ length: 10 }, () => ({ len: 96 }));
  assert.equal(packBoards(ten, 96).boards, 10);
  assert.equal(packBoards(ten, 120).boards, 10);
  assert.equal(packBoards([{ len: 100, splice: false }], 96).tooLong, true);
  // a 12 ft rail on 8 ft stock: 96 + 48 -> 2 boards
  assert.equal(packBoards([{ len: 144, splice: true }], 96).boards, 2);
  // 2 pieces of 72 on 144 stock: 72 + 1/8 + 72 = 144.125 does not fit
  assert.equal(packBoards([{ len: 72 }, { len: 72 }], 144).boards, 2);
  near(packBoards([{ len: 48 }], 96).waste, 0.5);
});
t('plan: 12 ft wall, 8 ft tall, 10 battens, 3 rails', () => {
  const p = plan({ width: 144, height: 96, batten: 2.5, mode: 'count', count: 10, withEnds: true, metric: false,
    rails: { on: true, count: 2, width: 3.5 } });
  assert.ok(p.ok);
  assert.equal(p.count, 10);
  near(p.pitch, 2.5 + 119 / 9);
  near(p.linear, 10 * 96 + 2 * 144);
  // 10 battens + 2 rails of 144 (each 96 + 48). The two 48 in pieces cannot share a board: 48 + kerf + 48 > 96.
  assert.equal(p.buy[0].boards, 14);
  assert.equal(p.buy[2].boards, 10 + 2); // 12 ft stock: 10 battens (one each), 2 rails of 144 (one each)
  assert.equal(p.rails.marks.length, 2);
  near(p.rails.gap, 96 - 7);
});
t('plan: a single rail sits in the middle', () => {
  const p = plan({ width: 144, height: 96, batten: 2.5, mode: 'count', count: 10, withEnds: true, rails: { on: true, count: 1, width: 4 } });
  assert.ok(p.ok);
  near(p.rails.marks[0].centre, 48);
});
t('plan: errors', () => {
  assert.equal(plan({ width: 0, height: 96, batten: 2.5, mode: 'count', count: 5, withEnds: true }).ok, false);
  assert.equal(plan({ width: 20, height: 96, batten: 2.5, mode: 'count', count: 10, withEnds: true }).ok, false);
  assert.equal(plan({ width: 144, height: 96, batten: 2.5, mode: 'count', count: 2.5, withEnds: true }).ok, false);
  assert.equal(plan({ width: 144, height: 96, batten: 2.5, mode: 'gap', targetGap: 0, withEnds: true }).ok, false);
});
t('plan: one batten with end battens is not possible', () => {
  // 1 batten, withEnds: zero gaps, nothing to space
  const r = plan({ width: 144, height: 96, batten: 2.5, mode: 'count', count: 1, withEnds: true });
  assert.equal(r.ok, false);
});
t('metric stock sizes', () => {
  const p = plan({ width: 120 / 2.54 * 2.54, height: 94, batten: 2.5, mode: 'count', count: 6, withEnds: true, metric: true });
  assert.ok(p.ok);
  near(p.buy[0].stock, 2400 / 25.4);
});
console.log(`\n${n} test groups passed`);
