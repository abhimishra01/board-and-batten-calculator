// Core logic for board and batten spacing. Plain JS, no dependencies, so Node tests can import it.
// All lengths inside are inches (decimal). The UI converts metric to inches and back.

export const MM_PER_IN = 25.4;
export const STOCK_IMPERIAL = [96, 120, 144]; // 8, 10, 12 ft
export const STOCK_METRIC = [2400 / MM_PER_IN, 3000 / MM_PER_IN, 3600 / MM_PER_IN]; // 2.4, 3.0, 3.6 m
export const KERF = 0.125; // saw cut, 1/8 in
export const MAX_COUNT = 300; // most battens we draw; stops a typo from freezing the page
export const MAX_RAILS = 20;
const EPS = 1e-9;

// Parse text like "6", "6.5", "5.", "6 1/2", "6-1/2", "1/2", "6 1/2\"". Returns number or NaN.
// Any text left over (for example "12abc") gives NaN.
export function parseInches(text) {
  if (typeof text === 'number') return text;
  const s = String(text ?? '').replace(/["”″]|\bin\b/gi, ' ').replace(/,/g, '.').trim();
  if (!s) return NaN;
  let m = s.match(/^(\d+\.?\d*|\.\d+)$/);
  if (m) return parseFloat(m[1]);
  m = s.match(/^(\d+)\s*[-\s]\s*(\d+)\s*\/\s*(\d+)$/);
  if (m && +m[3] !== 0) return +m[1] + +m[2] / +m[3];
  m = s.match(/^(\d+)\s*\/\s*(\d+)$/);
  if (m && +m[2] !== 0) return +m[1] / +m[2];
  return NaN;
}

// Parse the "feet" box. A plain number is feet ("12", "12.5"). Shortcuts such as 12'6 or 12' 6 1/2"
// also work: the part after the foot mark is inches. Returns inches, or NaN when the text makes no sense.
export function parseFeet(text) {
  const s = String(text ?? '').replace(/,/g, '.').replace(/[’′]/g, "'").trim();
  if (!s) return 0;
  const m = s.match(/^(\d+\.?\d*|\.\d+)\s*'\s*(.*)$/);
  if (m) {
    const rest = m[2].trim();
    return parseFloat(m[1]) * 12 + (rest ? parseInches(rest) : 0);
  }
  return /^(\d+\.?\d*|\.\d+)$/.test(s) ? parseFloat(s) * 12 : NaN;
}

// Parse a plain decimal number (centimeters). Returns NaN for anything else.
export function parseNumber(text) {
  const s = String(text ?? '').replace(/,/g, '.').trim();
  return /^(\d+\.?\d*|\.\d+)$/.test(s) ? parseFloat(s) : NaN;
}

// Format inches as a tape-measure fraction, rounded to 1/denom. Example: 13.25 -> 13 1/4"
export function formatInches(x, denom = 16) {
  let n = Math.round(x * denom);
  const neg = n < 0;
  n = Math.abs(n);
  let whole = Math.floor(n / denom);
  let num = n % denom;
  let den = denom;
  while (num && num % 2 === 0) { num /= 2; den /= 2; }
  let out;
  if (!num) out = `${whole}"`;
  else if (!whole) out = `${num}/${den}"`;
  else out = `${whole} ${num}/${den}"`;
  return (neg ? '-' : '') + out;
}

// Feet and inches. Example: 142.75 -> 11' 10 3/4"
export function formatFeetInches(x, denom = 16) {
  let n = Math.round(x * denom);
  const neg = n < 0;
  n = Math.abs(n);
  const totalIn = Math.floor(n / denom);
  const rem = n % denom;
  const ft = Math.floor(totalIn / 12);
  const inch = totalIn % 12;
  let num = rem, den = denom;
  while (num && num % 2 === 0) { num /= 2; den /= 2; }
  let inPart = '';
  if (num) inPart = inch ? `${inch} ${num}/${den}"` : `${num}/${den}"`;
  else if (inch || !ft) inPart = `${inch}"`;
  const out = ft ? (inPart ? `${ft}' ${inPart}` : `${ft}'`) : inPart;
  return (neg ? '-' : '') + out;
}

// Metric: centimeters with 1 mm steps. Example: 12.34 -> 12.3 cm
export function formatCm(inches) {
  const mm = Math.round(inches * MM_PER_IN);
  return `${(mm / 10).toFixed(1)} cm`;
}

// Space `count` strips of width `w` along `length`.
// withEnds true: a strip at each end, count-1 gaps. false: a gap at each end, count+1 gaps.
// `endW` is an optional width for the two end battens (used only with end battens and 2 or more battens).
export function solveByCount(length, w, count, withEnds, endW = w) {
  const gaps = withEnds ? count - 1 : count + 1;
  const extra = withEnds && count >= 2 ? 2 * (endW - w) : 0;
  const gap = gaps > 0 ? (length - count * w - extra) / gaps : NaN;
  return { count, gap, gaps };
}

// Pick the count whose gap is closest to the target gap.
export function solveByGap(length, w, target, withEnds, endW = w) {
  const extra = withEnds ? 2 * (endW - w) : 0;
  const raw = withEnds ? (length + target - extra) / (w + target) : (length - target) / (w + target);
  const a = Math.max(1, Math.floor(raw));
  const b = a + 1;
  const ra = solveByCount(length, w, a, withEnds, endW);
  const rb = solveByCount(length, w, b, withEnds, endW);
  const okA = Number.isFinite(ra.gap) && ra.gap >= -EPS;
  const okB = Number.isFinite(rb.gap) && rb.gap >= -EPS;
  if (okA && okB) return Math.abs(ra.gap - target) <= Math.abs(rb.gap - target) ? ra : rb;
  return okA ? ra : rb;
}

// Positions of each strip along an axis, measured from 0, unrounded. Walls use left to right.
// Rails use the same fields from the floor up: `left` is the bottom edge, `right` the top edge.
export function positions(length, w, count, gap, withEnds, endW = w) {
  const out = [];
  let left = withEnds ? 0 : gap;
  for (let i = 0; i < count; i++) {
    const bw = withEnds && count >= 2 && (i === 0 || i === count - 1) ? endW : w;
    out.push({ n: i + 1, left, center: left + bw / 2, right: left + bw });
    left += bw + gap;
  }
  return out;
}

// Anchored layout: keep the gap and batten width, and fix one batten (kind 'batten') or one gap
// (kind 'gap') on the point `x` from the left edge. Only whole battens that fit inside the wall are kept.
// The two end spaces are usually not equal.
export function anchoredMarks(length, w, gap, x, kind) {
  const pitch = w + gap;
  const shift = kind === 'gap' ? pitch / 2 : 0;
  const out = [];
  const kMin = Math.floor((0 - x + shift) / pitch) - 1;
  const kMax = Math.ceil((length - x + shift) / pitch) + 1;
  for (let k = kMin; k <= kMax; k++) {
    const center = x - shift + k * pitch;
    const left = center - w / 2;
    if (left >= -EPS && left + w <= length + EPS) out.push({ n: out.length + 1, left: Math.max(0, left), center, right: left + w });
  }
  return out;
}

// Cut list packing for one stock length. pieces: [{len, splice}].
// A piece longer than the stock is cut into stock-length parts only when `splice` is true (rails).
// Otherwise the result is { tooLong: true }.
export function packBoards(pieces, stock, kerf = KERF) {
  const items = [];
  let tooLong = false;
  for (const p of pieces) {
    if (p.len <= stock + 1e-9) items.push(p.len);
    else if (p.splice) {
      let left = p.len;
      while (left > stock + 1e-9) { items.push(stock); left -= stock; }
      if (left > 1e-9) items.push(left);
    } else tooLong = true;
  }
  if (tooLong) return { boards: null, tooLong: true, waste: null };
  items.sort((a, b) => b - a);
  const bins = []; // each: used length, count
  for (const len of items) {
    let placed = false;
    for (const b of bins) {
      if (b.used + kerf + len <= stock + 1e-9) { b.used += kerf + len; placed = true; break; }
    }
    if (!placed) bins.push({ used: len });
  }
  const usedTotal = items.reduce((s, x) => s + x, 0);
  const boards = bins.length;
  const waste = boards ? 1 - usedTotal / (boards * stock) : 0;
  return { boards, tooLong: false, waste };
}

// Whole plan. input: {width, height, batten, mode:'count'|'gap', count, targetGap, withEnds,
// rails:{on, count, width}, metric}
// Returns { ok:false, errors:[text], field } or
// { ok:true, count, gap, gapCount, pitch, marks, rails, linear, buy, best, warnings, anchor, endWidth }.
// Optional input: endWidth (end battens wider or narrower than the rest), anchor {on, x, kind:'batten'|'gap'}.
// `field` names the input to blame (width, height, batten, gap, count, rail-count, rail).
// `best` is the entry of `buy` with the fewest boards, then the least waste (null if none fits).
// Rails always sit flush with the floor and the ceiling (one rail sits in the middle).
export function plan(input) {
  const { width, height, batten, mode, withEnds } = input;
  const endW = withEnds && input.endWidth > 0 ? input.endWidth : batten;
  const fail = (text, field) => ({ ok: false, errors: [text], field });
  if (!(width > 0)) return fail('Enter the wall width.', 'width');
  if (!(batten > 0)) return fail('Enter the batten width.', 'batten');
  if (!(height > 0)) return fail('Enter the wall height.', 'height');

  let v;
  if (mode === 'gap') {
    if (!(input.targetGap > 0)) return fail('Enter the gap you want.', 'gap');
    v = solveByGap(width, batten, input.targetGap, withEnds, endW);
  } else {
    if (!(input.count >= 1) || !Number.isInteger(input.count)) return fail('Enter how many battens you want (a whole number).', 'count');
    if (input.count > MAX_COUNT) return fail(`This tool handles up to ${MAX_COUNT} battens.`, 'count');
    v = solveByCount(width, batten, input.count, withEnds, endW);
  }
  if (!Number.isFinite(v.gap)) return fail('With one batten and no end gaps there is nothing to space. Add a batten or turn on end battens.', 'count');
  if (Math.abs(v.gap) < EPS) v.gap = 0;
  if (v.gap < 0) {
    const max = Math.floor(width / batten + EPS);
    return fail(max < 1 ? 'The batten is wider than the wall.' : `Those battens are wider than the wall. The most that fit side by side is ${max}.`, mode === 'gap' ? 'gap' : 'count');
  }
  if (v.count > MAX_COUNT) return fail(`That gap needs more than ${MAX_COUNT} battens. Try a larger gap.`, 'gap');
  let marks = positions(width, batten, v.count, v.gap, withEnds, endW);
  const pitch = batten + v.gap;
  let anchor = null;
  if (input.anchor && input.anchor.on) {
    const x = input.anchor.x;
    if (!(x > 0) || x >= width) return fail('The feature position must be inside the wall width.', 'anchor');
    marks = anchoredMarks(width, batten, v.gap, x, input.anchor.kind === 'gap' ? 'gap' : 'batten');
    if (!marks.length) return fail('No whole batten fits with the layout anchored there. Try another position.', 'anchor');
    v = { ...v, count: marks.length, gaps: marks.length - 1 };
    anchor = { left: marks[0].left, right: width - marks[marks.length - 1].right, kind: input.anchor.kind === 'gap' ? 'gap' : 'batten' };
  }

  let rails = null;
  if (input.rails && input.rails.on) {
    const r = input.rails;
    if (!(r.width > 0)) return fail('Enter the rail width.', 'rail');
    if (!(r.count >= 1) || !Number.isInteger(r.count) || r.count > MAX_RAILS) return fail(`Enter a whole number of rails, from 1 to ${MAX_RAILS}.`, 'rail-count');
    const rv = solveByCount(height, r.width, r.count, r.count > 1);
    if (!Number.isFinite(rv.gap) || rv.gap < -EPS) return fail('The rails do not fit in the wall height. Use fewer or narrower rails.', 'rail-count');
    const rm = positions(height, r.width, r.count, Math.max(0, rv.gap), r.count > 1); // from the floor up
    rails = { count: r.count, width: r.width, gap: Math.max(0, rv.gap), marks: rm };
  }

  const pieces = [];
  for (let i = 0; i < v.count; i++) pieces.push({ len: height, splice: false });
  if (rails) for (let i = 0; i < rails.count; i++) pieces.push({ len: width, splice: true });
  const linear = v.count * height + (rails ? rails.count * width : 0);
  const stocks = input.metric ? STOCK_METRIC : STOCK_IMPERIAL;
  const buy = stocks.map((s) => ({ stock: s, ...packBoards(pieces, s) }));
  let best = null;
  for (const b of buy) {
    if (b.boards === null) continue;
    if (!best || b.boards < best.boards || (b.boards === best.boards && b.waste < best.waste)) best = b;
  }

  const warnings = [];
  if (v.gap < batten * 0.5 && v.gap > 0) warnings.push('The gap is narrower than half a batten. The wall will look dense.');
  if (v.gap === 0) warnings.push('The gap is zero. The battens touch.');
  if (anchor && Math.min(anchor.left, anchor.right) < batten * 0.5) warnings.push('One end space is narrower than half a batten. Move the feature position a little, or change the batten count.');
  return { ok: true, count: v.count, gap: v.gap, gapCount: v.gaps, pitch, marks, rails, linear, buy, best, warnings, anchor, endWidth: endW };
}
