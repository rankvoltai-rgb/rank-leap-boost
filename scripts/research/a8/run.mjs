// A8: scores every paragraph against every prompt with open embedding models, a cross-encoder
// reranker and BM25. Writes scores.json (one row per model x prompt x paragraph).
import { writeFileSync, existsSync, readFileSync } from "node:fs";
import {
  pipeline,
  AutoTokenizer,
  AutoModelForSequenceClassification,
  env,
} from "@huggingface/transformers";
import { TOPICS, variants } from "./corpus.mjs";

env.cacheDir = new URL("./.hf-cache/", import.meta.url).pathname;

const BGE_Q = "Represent this sentence for searching relevant passages: ";
const MODELS = [
  { id: "Xenova/all-MiniLM-L6-v2", pooling: "mean", q: "", d: "" },
  { id: "Supabase/gte-small", pooling: "mean", q: "", d: "" },
  { id: "Xenova/bge-small-en-v1.5", pooling: "cls", q: BGE_Q, d: "" },
  { id: "Xenova/bge-base-en-v1.5", pooling: "cls", q: BGE_Q, d: "" },
  { id: "Xenova/e5-base-v2", pooling: "mean", q: "query: ", d: "passage: " },
  {
    id: "nomic-ai/nomic-embed-text-v1.5",
    pooling: "mean",
    q: "search_query: ",
    d: "search_document: ",
  },
  { id: "Snowflake/snowflake-arctic-embed-m-v1.5", pooling: "cls", q: BGE_Q, d: "" },
  { id: "mixedbread-ai/mxbai-embed-large-v1", pooling: "cls", q: BGE_Q, d: "" },
];
const DTYPE = process.env.DTYPE ?? "q8";
const ONLY = process.env.ONLY ? process.env.ONLY.split(",") : null;
const EXTRAS = !ONLY;

const docs = TOPICS.flatMap((t) => variants(t));
const prompts = TOPICS.flatMap((t) =>
  t.prompts.map((p, i) => ({ topic: t.id, idx: i, intent: i === 3, text: p })),
);
console.log("docs", docs.length, "prompts", prompts.length);

const OUT = `scores-${DTYPE}.json`;
const rows = existsSync(OUT) ? JSON.parse(readFileSync(OUT, "utf8")) : [];
const doneModels = new Set(rows.map((r) => r.model));

const dot = (a, b) => a.reduce((s, x, i) => s + x * b[i], 0);

async function embedAll(extractor, texts, prefix, pooling) {
  const out = [];
  for (let i = 0; i < texts.length; i += 16) {
    const batch = texts.slice(i, i + 16).map((t) => prefix + t);
    const tensor = await extractor(batch, { pooling, normalize: true });
    out.push(...tensor.tolist());
  }
  return out;
}

for (const m of MODELS) {
  if (doneModels.has(m.id)) continue;
  if (ONLY && !ONLY.includes(m.id)) continue;
  const t0 = Date.now();
  let extractor;
  try {
    extractor = await pipeline("feature-extraction", m.id, { dtype: DTYPE });
  } catch (e) {
    console.log("SKIP", m.id, String(e).slice(0, 200));
    continue;
  }
  const P = await embedAll(
    extractor,
    prompts.map((p) => p.text),
    m.q,
    m.pooling,
  );
  const D = await embedAll(
    extractor,
    docs.map((d) => d.text),
    m.d,
    m.pooling,
  );
  for (let pi = 0; pi < prompts.length; pi++) {
    for (let di = 0; di < docs.length; di++) {
      if (docs[di].topic !== prompts[pi].topic) continue;
      rows.push({ model: m.id, kind: "embedding", p: pi, d: di, score: dot(P[pi], D[di]) });
    }
  }
  // cross-topic scores for the ranking test: best off-topic doc per prompt
  for (let pi = 0; pi < prompts.length; pi++) {
    let best = -1;
    for (let di = 0; di < docs.length; di++)
      if (docs[di].topic !== prompts[pi].topic) best = Math.max(best, dot(P[pi], D[di]));
    rows.push({ model: m.id, kind: "embedding-offtopic", p: pi, d: -1, score: best });
  }
  if (m.id === "Xenova/bge-base-en-v1.5") {
    writeFileSync(`vectors-${DTYPE}.json`, JSON.stringify({ P, D }));
  }
  writeFileSync(OUT, JSON.stringify(rows));
  console.log("done", m.id, Math.round((Date.now() - t0) / 1000) + "s");
  await extractor.dispose?.();
}

// Cross-encoder reranker
const RERANKER = "Xenova/bge-reranker-base";
if (EXTRAS && !doneModels.has(RERANKER)) {
  const t0 = Date.now();
  try {
    const tok = await AutoTokenizer.from_pretrained(RERANKER);
    const model = await AutoModelForSequenceClassification.from_pretrained(RERANKER, {
      dtype: DTYPE,
    });
    for (let pi = 0; pi < prompts.length; pi++) {
      const idx = docs.map((d, i) => i).filter((i) => docs[i].topic === prompts[pi].topic);
      const inputs = tok(
        idx.map(() => prompts[pi].text),
        { text_pair: idx.map((i) => docs[i].text), padding: true, truncation: true },
      );
      const { logits } = await model(inputs);
      const vals = logits.tolist().map((l) => l[0]);
      idx.forEach((di, j) =>
        rows.push({ model: RERANKER, kind: "reranker", p: pi, d: di, score: vals[j] }),
      );
    }
    writeFileSync(OUT, JSON.stringify(rows));
    console.log("done", RERANKER, Math.round((Date.now() - t0) / 1000) + "s");
  } catch (e) {
    console.log("SKIP reranker", String(e).slice(0, 300));
  }
}

// BM25 over all paragraphs (lexical baseline)
if (EXTRAS && !doneModels.has("bm25")) {
  const tokz = (s) => s.toLowerCase().match(/[a-z0-9.]+/g) ?? [];
  const D = docs.map((d) => tokz(d.text));
  const N = D.length;
  const avg = D.reduce((s, d) => s + d.length, 0) / N;
  const df = new Map();
  for (const d of D) for (const w of new Set(d)) df.set(w, (df.get(w) ?? 0) + 1);
  const idf = (w) => Math.log(1 + (N - (df.get(w) ?? 0) + 0.5) / ((df.get(w) ?? 0) + 0.5));
  const k1 = 1.2;
  const b = 0.75;
  for (let pi = 0; pi < prompts.length; pi++) {
    const q = tokz(prompts[pi].text);
    for (let di = 0; di < docs.length; di++) {
      if (docs[di].topic !== prompts[pi].topic) continue;
      const tf = new Map();
      for (const w of D[di]) tf.set(w, (tf.get(w) ?? 0) + 1);
      let s = 0;
      for (const w of q) {
        const f = tf.get(w) ?? 0;
        if (!f) continue;
        s += (idf(w) * f * (k1 + 1)) / (f + k1 * (1 - b + (b * D[di].length) / avg));
      }
      rows.push({ model: "bm25", kind: "bm25", p: pi, d: di, score: s });
    }
  }
  writeFileSync(OUT, JSON.stringify(rows));
  console.log("done bm25");
}
writeFileSync(
  "meta.json",
  JSON.stringify({ docs, prompts, models: MODELS.map((m) => m.id), dtype: DTYPE }),
);
