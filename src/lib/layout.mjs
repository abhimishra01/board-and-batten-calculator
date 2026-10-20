// Core logic for board and batten spacing. Plain JS, no dependencies, so Node tests can import it.
// All lengths inside are inches (decimal). The UI converts metric to inches and back.

export const MM_PER_IN = 25.4;
export const STOCK_IMPERIAL = [96, 120, 144]; // 8, 10, 12 ft
export const STOCK_METRIC = [2400 / MM_PER_IN, 3000 / MM_PER_IN, 3600 / MM_PER_IN]; // 2.4, 3.0, 3.6 m
export const KERF = 0.125; // saw cut, 1/8 in

// Parse text like "6", "6.5", "6 1/2", "6-1/2", "1/2", "6 1/2\"". Returns number or NaN.
export function parseInches(text) {
  if (typeof text === 'number') return text;
  const s = String(text ?? '').replace(/["”″in]/gi, ' ').replace(/,/g, '.').trim();
  if (!s) return NaN;
  let m = s.match(/^(\d*\.?\d+)$/);
  if (m) return parseFloat(m[1]);
  m = s.match(/^(\d+)\s*[-\s]\s*(\d+)\s*\/\s*(\d+)$/);
  if (m && +m[3] !== 0) return +m[1] + +m[2] / +m[3];
  m = s.match(/^(\d+)\s*\/\s*(\d+)$/);
  if (m && +m[2] !== 0) return +m[1] / +m[2];
  return NaN;
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

// Metric: centimetres with 1 mm steps. Example: 12.34 -> 12.3 cm
export function formatCm(inches) {
  const mm = Math.round(inches * MM_PER_IN);
  return `${(mm / 10).toFixed(1)} cm`;
}

// Space `count` strips of width `w` along `length`.
// withEnds true: a strip at each end, count-1 gaps. false: a gap at each end, count+1 gaps.
export function solveByCount(length, w, count, withEnds) {
  const gaps = withEnds ? count - 1 : count + 1;
  const gap = gaps > 0 ? (length - count * w) / gaps : NaN;
  return { count, gap, gaps };
}

// Pick the count whose gap is closest to the target gap.
export function solveByGap(length, w, target, withEnds) {
  const raw = withEnds ? (length + target) / (w + target) : (length - target) / (w + target);
  const a = Math.max(withEnds ? 1 : 0, Math.floor(raw));
  const b = a + 1;
  const ra = solveByCount(length, w, a, withEnds);
  const rb = solveByCount(length, w, b, withEnds);
  const okA = Number.isFinite(ra.gap) && ra.gap >= 0;
  const okB = Number.isFinite(rb.gap) && rb.gap >= 0;
  if (okA && okB) return Math.abs(ra.gap - target) <= Math.abs(rb.gap - target) ? ra : rb;
  return okA ? ra : rb;
}

// Positions of each strip along the length (left edge and centre), unrounded.
export function positions(length, w, count, gap, withEnds) {
  const out = [];
  const start = withEnds ? 0 : gap;
  for (let i = 0; i < count; i++) {
    const left = start + i * (w + gap);
    out.push({ n: i + 1, left, centre: left + w / 2, right: left + w });
  }
  return out;
}

// Cut list packing. pieces: [{len, label}]. Stock lengths: one length per plan.
// Pieces longer than stock: allowed to splice only if spliceable true (rails). Otherwise flagged.
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
export function plan(input) {
  const { width, height, batten, mode, withEnds } = input;
  const errors = [];
  if (!(width > 0)) errors.push('Enter the wall width.');
  if (!(batten > 0)) errors.push('Enter the batten width.');
  if (!(height > 0)) errors.push('Enter the wall height.');
  if (errors.length) return { ok: false, errors };

  let v;
  if (mode === 'gap') {
    if (!(input.targetGap > 0)) return { ok: false, errors: ['Enter the gap you want.'] };
    v = solveByGap(width, batten, input.targetGap, withEnds);
  } else {
    if (!(input.count >= 1) || !Number.isInteger(input.count)) return { ok: false, errors: ['Enter how many battens you want (a whole number).'] };
    v = solveByCount(width, batten, input.count, withEnds);
  }
  if (!Number.isFinite(v.gap)) return { ok: false, errors: ['With one batten and no end gaps there is nothing to space. Add a batten or turn on end battens.'] };
  if (v.gap < 0) {
    const max = Math.floor(withEnds ? (width + 0) / batten : width / batten);
    return { ok: false, errors: [`Those battens are wider than the wall. The most that fit side by side is ${max}.`] };
  }
  const marks = positions(width, batten, v.count, v.gap, withEnds);
  const pitch = batten + v.gap;

  let rails = null;
  if (input.rails && input.rails.on) {
    const r = input.rails;
    if (!(r.width > 0) || !(r.count >= 1) || !Number.isInteger(r.count)) {
      return { ok: false, errors: ['Enter the rail width and a whole number of rails.'] };
    }
    const railEnds = withEnds && r.count > 1; // one rail sits in the middle
    const rv = solveByCount(height, r.width, r.count, railEnds);
    if (!Number.isFinite(rv.gap) || rv.gap < 0) return { ok: false, errors: ['The rails do not fit in the wall height. Use fewer or narrower rails.'] };
    const rm = positions(height, r.width, r.count, rv.gap, railEnds); // from the floor up
    rails = { count: r.count, width: r.width, gap: rv.gap, marks: rm };
  }

  const pieces = [];
  for (let i = 0; i < v.count; i++) pieces.push({ len: height, label: 'batten', splice: false });
  if (rails) for (let i = 0; i < rails.count; i++) pieces.push({ len: width, label: 'rail', splice: true });
  const linear = v.count * height + (rails ? rails.count * width : 0);
  const stocks = input.metric ? STOCK_METRIC : STOCK_IMPERIAL;
  const buy = stocks.map((s) => ({ stock: s, ...packBoards(pieces, s) }));

  const warnings = [];
  if (v.gap < batten * 0.5 && v.gap > 0) warnings.push('The gap is narrower than half a batten. The wall will look dense.');
  if (v.gap === 0) warnings.push('The gap is zero. The battens touch.');
  return { ok: true, count: v.count, gap: v.gap, gapCount: v.gaps, pitch, marks, rails, linear, buy, warnings, errors: [] };
}
