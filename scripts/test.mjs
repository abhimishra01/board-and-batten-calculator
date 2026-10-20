import assert from 'node:assert/strict';
import { parseInches, parseFeet, splitFeetEntry, parseNumber, MAX_COUNT, formatInches, formatFeetInches, formatCm, solveByCount, solveByGap, positions, anchoredMarks, packBoards, plan, STOCK_IMPERIAL } from '../src/lib/layout.mjs';

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
t('center marks', () => {
  const r = solveByCount(144, 2.5, 10, true);
  const m = positions(144, 2.5, 10, r.gap, true);
  near(m[0].center, 1.25);
  near(m[9].center, 142.75);
  assert.equal(formatFeetInches(m[9].center), `11' 10 3/4"`);
  near(m[1].center - m[0].center, 2.5 + r.gap);
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
t('plan: 12 ft wall, 8 ft tall, 10 battens, 2 rails', () => {
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
  near(p.rails.marks[0].center, 48);
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
  const p = plan({ width: 120, height: 94, batten: 2.5, mode: 'count', count: 6, withEnds: true, metric: true });
  assert.ok(p.ok);
  near(p.buy[0].stock, 2400 / 25.4);
});


t('parse inches: trailing dot and junk', () => {
  assert.equal(parseInches('5.'), 5);
  assert.ok(Number.isNaN(parseInches('12abc')));
  assert.ok(Number.isNaN(parseInches('1e2')));
});
t('parse feet box: plain numbers and 12\'6 shortcuts', () => {
  assert.equal(parseFeet('12'), 144);
  assert.equal(parseFeet(''), 0);
  assert.equal(parseFeet("12'6"), 150);
  assert.equal(parseFeet(`12' 6 1/2"`), 150.5);
  assert.equal(parseFeet("12'"), 144);
  assert.ok(Number.isNaN(parseFeet('12abc')));
  assert.ok(Number.isNaN(parseFeet('1/2')));
  assert.equal(parseNumber('30,5'), 30.5);
  assert.ok(Number.isNaN(parseNumber('3 0')));
});
t('plan: gap mode, no end battens, huge gap never gives zero battens', () => {
  const r = plan({ width: 144, height: 96, batten: 2.5, mode: 'gap', targetGap: 200, withEnds: false });
  assert.ok(!r.ok || r.count >= 1);
  const r2 = plan({ width: 144, height: 96, batten: 2.5, mode: 'gap', targetGap: 60, withEnds: false });
  assert.ok(r2.ok);
  assert.equal(r2.count, 1);
  near(r2.gap, 70.75);
  assert.equal(r2.marks.length, 1);
});
t('plan: limits on batten and rail counts', () => {
  const a = plan({ width: 1200, height: 96, batten: 0.5, mode: 'count', count: MAX_COUNT + 1, withEnds: true });
  assert.equal(a.ok, false);
  assert.equal(a.field, 'count');
  const b = plan({ width: 144, height: 96, batten: 0.01, mode: 'gap', targetGap: 0.01, withEnds: true });
  assert.equal(b.ok, false);
  const c = plan({ width: 144, height: 96, batten: 2.5, mode: 'count', count: 5, withEnds: true, rails: { on: true, count: 99, width: 3.5 } });
  assert.equal(c.ok, false);
  assert.equal(c.field, 'rail-count');
});
t('plan: exact fits are not errors', () => {
  const a = plan({ width: 3.3, height: 96, batten: 1.1, mode: 'count', count: 3, withEnds: true });
  assert.ok(a.ok);
  assert.equal(a.gap, 0);
  const b = plan({ width: 30 / 2.54, height: 90, batten: 3 / 2.54, mode: 'count', count: 10, withEnds: true, metric: true });
  assert.ok(b.ok);
  assert.equal(b.gap, 0);
  assert.ok(b.warnings.some((w) => w.includes('zero')));
});
t('plan: error names the field', () => {
  assert.equal(plan({ width: NaN, height: 96, batten: 2.5, mode: 'count', count: 5, withEnds: true }).field, 'width');
  assert.equal(plan({ width: 20, height: 96, batten: 2.5, mode: 'count', count: 10, withEnds: true }).field, 'count');
  const w = plan({ width: 2, height: 96, batten: 2.5, mode: 'count', count: 1, withEnds: false });
  assert.match(w.errors[0], /wider than the wall/);
});
t('plan: absurd wall sizes get a message naming the field', () => {
  const a = plan({ width: 1201, height: 96, batten: 2.5, mode: 'count', count: 10, withEnds: true });
  assert.equal(a.ok, false); assert.equal(a.field, 'width'); assert.match(a.errors[0], /100 feet/);
  const b = plan({ width: 144, height: 481, batten: 2.5, mode: 'count', count: 10, withEnds: true, metric: true });
  assert.equal(b.field, 'height'); assert.match(b.errors[0], /12 m/);
  assert.ok(plan({ width: 1200, height: 480, batten: 2.5, mode: 'count', count: 10, withEnds: true }).ok);
});
t('plan: rails sit flush with floor and ceiling even without end battens', () => {
  const p = plan({ width: 144, height: 96, batten: 2.5, mode: 'count', count: 10, withEnds: false, rails: { on: true, count: 3, width: 3.5 } });
  assert.ok(p.ok);
  near(p.rails.marks[0].left, 0);
  near(p.rails.marks[2].right, 96);
  near(p.rails.gap, (96 - 10.5) / 2);
});
t('plan: best board length', () => {
  const p = plan({ width: 144, height: 96, batten: 2.5, mode: 'count', count: 10, withEnds: true, metric: false });
  assert.equal(p.best.stock, 96); // ten 96 in battens: 10 boards of 8 ft waste nothing
  assert.equal(p.best.boards, 10);
  const q = plan({ width: 144, height: 100, batten: 2.5, mode: 'count', count: 4, withEnds: true });
  assert.equal(q.buy[0].boards, null);
  assert.equal(q.best.stock, 120);
});
t('end battens with their own width fill the wall', () => {
  const p = plan({ width: 144, height: 96, batten: 2.5, mode: 'count', count: 10, withEnds: true, endWidth: 3.5 });
  assert.ok(p.ok);
  near(p.gap, (144 - 8 * 2.5 - 7) / 9);
  near(p.marks[0].right - p.marks[0].left, 3.5);
  near(p.marks[1].right - p.marks[1].left, 2.5);
  near(p.marks[9].right, 144);
  near(p.marks[1].left - p.marks[0].right, p.gap);
  const g = plan({ width: 144, height: 96, batten: 2.5, mode: 'gap', targetGap: 12, withEnds: true, endWidth: 3.5 });
  assert.ok(g.ok);
  near(g.marks[g.count - 1].right, 144);
});
t('end width is ignored without end battens', () => {
  const a = plan({ width: 144, height: 96, batten: 2.5, mode: 'count', count: 10, withEnds: false, endWidth: 3.5 });
  const b = plan({ width: 144, height: 96, batten: 2.5, mode: 'count', count: 10, withEnds: false });
  near(a.gap, b.gap);
});
t('anchored layout: a batten centered on the window', () => {
  const m = anchoredMarks(144, 2.5, 13.25, 64, 'batten');
  assert.ok(m.some((x) => Math.abs(x.center - 64) < 1e-9));
  for (const x of m) assert.ok(x.left >= 0 && x.right <= 144 + 1e-9);
  for (let i = 1; i < m.length; i++) near(m[i].left - m[i - 1].right, 13.25);
});
t('anchored layout: a gap centered on the window', () => {
  const m = anchoredMarks(144, 2.5, 13.25, 72, 'gap');
  const mid = m.findIndex((x) => x.center > 72);
  near((m[mid].left + m[mid - 1].right) / 2, 72);
});
t('plan: anchor keeps the gap and reports end spaces', () => {
  const base = plan({ width: 144, height: 96, batten: 2.5, mode: 'count', count: 10, withEnds: true });
  const p = plan({ width: 144, height: 96, batten: 2.5, mode: 'count', count: 10, withEnds: true, anchor: { on: true, x: 64, kind: 'gap' } });
  assert.ok(p.ok);
  near(p.gap, base.gap);
  assert.ok(p.anchor.left >= 0 && p.anchor.right >= 0);
  near(p.anchor.left + p.anchor.right + p.count * 2.5 + (p.count - 1) * p.gap, 144);
  assert.equal(plan({ width: 144, height: 96, batten: 2.5, mode: 'count', count: 10, withEnds: true, anchor: { on: true, x: 200, kind: 'gap' } }).field, 'anchor');
});
t('plan: anchor warns about a sliver at the end', () => {
  const p = plan({ width: 144, height: 96, batten: 2.5, mode: 'count', count: 10, withEnds: true, anchor: { on: true, x: 64, kind: 'batten' } });
  assert.ok(p.ok);
  const small = Math.min(p.anchor.left, p.anchor.right) < 1.25;
  assert.equal(p.warnings.some((w) => w.includes('end space')), small);
});

t('plan: anchor reports the count before centering', () => {
  const p = plan({ width: 144, height: 96, batten: 2.5, mode: 'count', count: 10, withEnds: true, anchor: { on: true, x: 64, kind: 'gap' } });
  assert.equal(p.baseCount, 10);
  assert.equal(p.count, 9);
  assert.ok(p.anchor.left > 0 && p.anchor.right > 0);
});
t('splitFeetEntry: one-field entry', () => {
  assert.deepEqual(splitFeetEntry("12'6 1/2"), { ft: 12, inch: 6, fr: 8 });
  assert.deepEqual(splitFeetEntry("8'"), { ft: 8, inch: 0, fr: 0 });
  assert.equal(splitFeetEntry('12'), null);
  assert.equal(splitFeetEntry("12'abc"), null);
});

console.log(`\n${n} tests passed`);
