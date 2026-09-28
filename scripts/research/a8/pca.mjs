import { readFileSync, writeFileSync } from "node:fs";
import { TOPICS, variants } from "./corpus.mjs";
const { P, D } = JSON.parse(readFileSync("vectors-q8.json", "utf8"));
const docs = TOPICS.flatMap((t) => variants(t));
const prompts = TOPICS.flatMap((t) => t.prompts.map((p, i) => ({ topic: t.id, idx: i, text: p })));
const topicId = process.argv[2] ?? "llms-txt";
const pi = prompts.map((p, i) => i).filter((i) => prompts[i].topic === topicId);
const di = docs.map((d, i) => i).filter((i) => docs[i].topic === topicId && !docs[i].tail);
const X = [...pi.map((i) => P[i]), ...di.map((i) => D[i])];
const n = X.length,
  dim = X[0].length;
const mu = Array(dim).fill(0);
for (const x of X) x.forEach((v, j) => (mu[j] += v / n));
const C = X.map((x) => x.map((v, j) => v - mu[j]));
// power iteration for top-2 PCs
function pc(exclude) {
  let v = Array.from({ length: dim }, (_, j) => Math.sin(j + 1 + exclude.length));
  for (let it = 0; it < 200; it++) {
    const s = C.map((r) => r.reduce((a, x, j) => a + x * v[j], 0));
    let w = Array(dim).fill(0);
    C.forEach((r, i) => r.forEach((x, j) => (w[j] += x * s[i])));
    for (const e of exclude) {
      const d = w.reduce((a, x, j) => a + x * e[j], 0);
      w = w.map((x, j) => x - d * e[j]);
    }
    const nrm = Math.hypot(...w);
    v = w.map((x) => x / nrm);
  }
  return v;
}
const v1 = pc([]),
  v2 = pc([v1]);
const proj = C.map((r) => [
  r.reduce((a, x, j) => a + x * v1[j], 0),
  r.reduce((a, x, j) => a + x * v2[j], 0),
]);
const tot = C.reduce((a, r) => a + r.reduce((b, x) => b + x * x, 0), 0);
const var1 = proj.reduce((a, p) => a + p[0] ** 2, 0) / tot,
  var2 = proj.reduce((a, p) => a + p[1] ** 2, 0) / tot;
const out = {
  topic: topicId,
  model: "bge-base-en-v1.5",
  explained: [var1, var2],
  prompts: pi.map((i, j) => ({ text: prompts[i].text, x: proj[j][0], y: proj[j][1] })),
  docs: di.map((i, j) => ({
    k: docs[i].k,
    m: docs[i].m,
    kwCount: docs[i].kwCount,
    x: proj[pi.length + j][0],
    y: proj[pi.length + j][1],
    cos: pi.map((p) => P[p].reduce((a, x, q) => a + x * D[i][q], 0)),
  })),
};
writeFileSync(`pca-${topicId}.json`, JSON.stringify(out, null, 1));
console.log(topicId, "explained", var1.toFixed(2), var2.toFixed(2));
for (const p of out.prompts) console.log("P", p.x.toFixed(3), p.y.toFixed(3), p.text);
for (const k of [0, 1, 2, 3, 4]) {
  const ds = out.docs.filter((d) => d.k === k);
  console.log(
    "k",
    k,
    ds.map((d) => `${d.kwCount}:(${d.x.toFixed(2)},${d.y.toFixed(2)})`).join(" "),
  );
}
