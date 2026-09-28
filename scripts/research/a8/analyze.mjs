// A8 analysis: how definition density and keyword density move retrieval scores.
import { readFileSync, writeFileSync } from "node:fs";
import { TOPICS, variants } from "./corpus.mjs";

const DTYPE = process.env.DTYPE ?? "q8";
const rows = JSON.parse(readFileSync(`scores-${DTYPE}.json`, "utf8"));
const docs = TOPICS.flatMap((t) => variants(t));
const prompts = TOPICS.flatMap((t) =>
  t.prompts.map((p, i) => ({ topic: t.id, idx: i, intent: i === 3, text: p })),
);
const scorers = [...new Set(rows.map((r) => r.model))];
const mean = (a) => a.reduce((s, x) => s + x, 0) / a.length;
const sd = (a) => {
  const m = mean(a);
  return Math.sqrt(a.reduce((s, x) => s + (x - m) ** 2, 0) / (a.length - 1));
};

// OLS y ~ x1 + x2 on centered data (within-prompt), returns betas and SEs
function ols2(y, x1, x2) {
  const n = y.length;
  const c = (a) => {
    const m = mean(a);
    return a.map((v) => v - m);
  };
  const Y = c(y),
    A = c(x1),
    B = c(x2);
  const saa = A.reduce((s, v) => s + v * v, 0),
    sbb = B.reduce((s, v) => s + v * v, 0),
    sab = A.reduce((s, v, i) => s + v * B[i], 0);
  const say = A.reduce((s, v, i) => s + v * Y[i], 0),
    sby = B.reduce((s, v, i) => s + v * Y[i], 0);
  const det = saa * sbb - sab * sab;
  const b1 = (sbb * say - sab * sby) / det;
  const b2 = (saa * sby - sab * say) / det;
  const res = Y.map((v, i) => v - b1 * A[i] - b2 * B[i]);
  const s2 = res.reduce((s, v) => s + v * v, 0) / (n - 3);
  const se1 = Math.sqrt((s2 * sbb) / det);
  const se2 = Math.sqrt((s2 * saa) / det);
  const sst = Y.reduce((s, v) => s + v * v, 0);
  const r2 = 1 - res.reduce((s, v) => s + v * v, 0) / sst;
  return { b1, b2, se1, se2, r2 };
}

const out = {};
for (const sc of scorers) {
  const R = rows.filter((r) => r.model === sc && r.d >= 0);
  const byPrompt = new Map();
  for (const r of R) {
    if (!byPrompt.has(r.p)) byPrompt.set(r.p, []);
    byPrompt.get(r.p).push(r);
  }
  const res = { scorer: sc };
  for (const subset of ["all", "keyword", "intent"]) {
    const ys = [],
      defD = [],
      kwD = [],
      kC = [],
      kwC = [],
      zs = [];
    for (const [p, list] of byPrompt) {
      const pr = prompts[p];
      if (subset === "keyword" && pr.intent) continue;
      if (subset === "intent" && !pr.intent) continue;
      const L = list.filter((r) => !docs[r.d].tail);
      const m = mean(L.map((r) => r.score));
      const s = sd(L.map((r) => r.score));
      for (const r of L) {
        const d = docs[r.d];
        ys.push(r.score - m);
        zs.push((r.score - m) / s);
        defD.push(d.defDensity);
        kwD.push(d.kwDensity);
        kC.push(d.k);
        kwC.push(d.kwCount);
      }
    }
    const dens = ols2(ys, defD, kwD);
    const counts = ols2(ys, kC, kwC);
    const z = ols2(zs, kC, kwC);
    res[subset] = {
      n: ys.length,
      perDensityPoint: {
        def: dens.b1,
        defSE: dens.se1,
        kw: dens.b2,
        kwSE: dens.se2,
        r2: dens.r2,
        ratio: dens.b1 / dens.b2,
      },
      perCount: {
        def: counts.b1,
        defSE: counts.se1,
        kw: counts.b2,
        kwSE: counts.se2,
        r2: counts.r2,
      },
      perCountZ: { def: z.b1, kw: z.b2 },
    };
  }
  // Head-to-head within each prompt
  const pick = (topic, pred) => docs.findIndex((d) => d.topic === topic && pred(d));
  const maxM = (topic, k) =>
    Math.max(...docs.filter((d) => d.topic === topic && d.k === k && !d.tail).map((d) => d.m));
  const h2h = { defVsStuffed: [], defVsTail: [], stuffGood: [], stuffBad: [], defGainPlain: [] };
  const top = [];
  for (const [p, list] of byPrompt) {
    const pr = prompts[p];
    const s = new Map(list.map((r) => [r.d, r.score]));
    const A = pick(pr.topic, (d) => d.k === 4 && d.m === 0 && !d.tail);
    const B = pick(pr.topic, (d) => d.k === 0 && d.m === maxM(pr.topic, 0) && !d.tail);
    const C = pick(pr.topic, (d) => d.k === 0 && d.tail);
    const G0 = A;
    const G1 = pick(pr.topic, (d) => d.k === 4 && d.m === maxM(pr.topic, 4) && !d.tail);
    const F0 = pick(pr.topic, (d) => d.k === 0 && d.m === 0 && !d.tail);
    h2h.defVsStuffed.push({
      intent: pr.intent,
      win: s.get(A) > s.get(B),
      diff: s.get(A) - s.get(B),
    });
    h2h.defVsTail.push({ intent: pr.intent, win: s.get(A) > s.get(C), diff: s.get(A) - s.get(C) });
    h2h.stuffGood.push({
      intent: pr.intent,
      up: s.get(G1) > s.get(G0),
      diff: s.get(G1) - s.get(G0),
    });
    h2h.stuffBad.push({ intent: pr.intent, up: s.get(B) > s.get(F0), diff: s.get(B) - s.get(F0) });
    h2h.defGainPlain.push({ intent: pr.intent, diff: s.get(A) - s.get(F0) });
    const best = [...list].sort((a, b) => b.score - a.score)[0];
    top.push({
      p,
      k: docs[best.d].k,
      m: docs[best.d].m,
      tail: docs[best.d].tail,
      kwCount: docs[best.d].kwCount,
    });
  }
  const rate = (arr, key) => arr.filter((x) => x[key]).length / arr.length;
  res.h2h = {
    defBeatsStuffed: rate(h2h.defVsStuffed, "win"),
    defBeatsStuffedIntent: rate(
      h2h.defVsStuffed.filter((x) => x.intent),
      "win",
    ),
    defBeatsTail: rate(h2h.defVsTail, "win"),
    stuffingRaisesGoodCopy: rate(h2h.stuffGood, "up"),
    stuffingRaisesGoodCopyIntent: rate(
      h2h.stuffGood.filter((x) => x.intent),
      "up",
    ),
    stuffingRaisesFiller: rate(h2h.stuffBad, "up"),
    meanDefGain: mean(h2h.defGainPlain.map((x) => x.diff)),
    meanStuffGainFiller: mean(h2h.stuffBad.map((x) => x.diff)),
    meanStuffGainGood: mean(h2h.stuffGood.map((x) => x.diff)),
    meanDefMinusStuffed: mean(h2h.defVsStuffed.map((x) => x.diff)),
  };
  res.top = {
    topHasAllDefs: top.filter((t) => t.k === 4).length / top.length,
    topIsTail: top.filter((t) => t.tail).length / top.length,
    topKwCountMean: mean(top.map((t) => t.kwCount)),
    topKDist: [0, 1, 2, 3, 4].map((k) => top.filter((t) => t.k === k).length),
  };
  // Grid: mean z-score by (k, keyword count bucket)
  const grid = {};
  for (const [p, list] of byPrompt) {
    const L = list.filter((r) => !docs[r.d].tail);
    const m = mean(L.map((r) => r.score));
    const s = sd(L.map((r) => r.score));
    for (const r of list) {
      const d = docs[r.d];
      const key = `${d.k}|${d.tail ? "tail" : Math.min(d.kwCount, 7)}`;
      (grid[key] ??= []).push((r.score - m) / s);
    }
  }
  res.grid = Object.fromEntries(Object.entries(grid).map(([k, v]) => [k, +mean(v).toFixed(3)]));
  out[sc] = res;
}
writeFileSync(`analysis-${DTYPE}.json`, JSON.stringify(out, null, 1));

const f = (x, d = 3) => (x >= 0 ? " " : "") + x.toFixed(d);
console.log(
  "scorer".padEnd(40),
  "def/pt   kw/pt   ratio | def/sent  kw/mention | defWin  defWinI tailWin stuffUpGood stuffUpGoodI stuffUpFiller | top k=4",
);
for (const [sc, r] of Object.entries(out)) {
  const a = r.all;
  console.log(
    sc.padEnd(40),
    f(a.perDensityPoint.def, 4),
    f(a.perDensityPoint.kw, 4),
    f(a.perDensityPoint.ratio, 1),
    "|",
    f(a.perCount.def, 4),
    f(a.perCount.kw, 4),
    "|",
    r.h2h.defBeatsStuffed.toFixed(2),
    r.h2h.defBeatsStuffedIntent.toFixed(2),
    r.h2h.defBeatsTail.toFixed(2),
    r.h2h.stuffingRaisesGoodCopy.toFixed(2),
    r.h2h.stuffingRaisesGoodCopyIntent.toFixed(2),
    r.h2h.stuffingRaisesFiller.toFixed(2),
    "|",
    r.top.topHasAllDefs.toFixed(2),
  );
}
