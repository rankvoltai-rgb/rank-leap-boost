// Builds the A8 data sheet (markdown) from analysis-q8.json and the corpus.
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { TOPICS, variants, TAIL } from "./corpus.mjs";

const a = JSON.parse(readFileSync("analysis-q8.json", "utf8"));
const fp = existsSync("analysis-fp32.json")
  ? JSON.parse(readFileSync("analysis-fp32.json", "utf8"))
  : null;
const docs = TOPICS.flatMap((t) => variants(t));
const EMB = Object.keys(a).filter((k) => !["bm25", "Xenova/bge-reranker-base"].includes(k));
const short = (m) => m.split("/").pop();
const f = (x, d = 3) => (x >= 0 ? "+" : "−") + Math.abs(x).toFixed(d);
const pct = (x) => `${Math.round(x * 100)}%`;
const median = (arr) => {
  const s = [...arr].sort((x, y) => x - y);
  const n = s.length;
  return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2;
};
const mean = (arr) => arr.reduce((s, x) => s + x, 0) / arr.length;

const L = [];
L.push("# A8 data sheet: Vector Distance vs. Keyword Density");
L.push("");
L.push(
  "Rankbox experiment, run 28 September 2026. Every number below is final. Copy them exactly.",
);
L.push("");
L.push("## What we built");
L.push("");
L.push(
  `- **8 topics**, each with a target keyword: ${TOPICS.map((t) => `${t.id.replace(/-/g, " ")} (\`${t.kw}\`)`).join("; ")}.`,
);
L.push(
  '- **32 user prompts**, 4 per topic. In each topic, 3 prompts contain the keyword (e.g. "What is a heat pump?") and 1 is an **intent prompt** that describes the need without the keyword (e.g. "What system can both heat and cool my house using only electricity?"). All 32:',
);
for (const t of TOPICS) L.push(`  - ${t.id}: ${t.prompts.map((p) => `"${p}"`).join(" · ")}`);
const words = docs.map((d) => d.words);
const kwd = docs.filter((d) => !d.tail).map((d) => d.kwDensity);
const kwdT = docs.filter((d) => d.tail).map((d) => d.kwDensity);
L.push(
  `- **${docs.length} paragraphs** (${Math.min(...words)}–${Math.max(...words)} words). Each paragraph is one fixed lead sentence that names the keyword (\"Here is a short guide to …\"), then 4 sentences. Each of those 4 sentences is either a **filler** sentence (vague, no facts, e.g. \"Many people who install one say they only wish they had done it years earlier.\") or a **definition** sentence (a concrete defining fact, e.g. \"It is an electric appliance that moves heat between indoors and outdoors instead of burning fuel.\"). Paragraphs have **0 to 4 definition sentences**.`,
);
L.push(
  `- **Keyword repetition** is varied inside the same sentences: pronouns such as \"it\" or \"one\" are swapped for the exact keyword, one slot at a time. So two paragraphs with the same sentences differ only in how often the keyword appears: from 1 mention (the lead only) up to 5–7 mentions. Keyword density ranges from ${Math.min(...kwd).toFixed(1)}% to ${Math.max(...kwd).toFixed(1)}%.`,
);
L.push(
  `- **Stuffing tail**: for each definition level, the most repetitive paragraph also appears with a classic keyword-stuffing tail appended: "${TAIL.join(" ")}" (with the keyword filled in). Density with the tail: ${Math.min(...kwdT).toFixed(1)}%–${Math.max(...kwdT).toFixed(1)}%.`,
);
const heat = docs.filter((d) => d.topic === "heat-pump");
const ex = (pred) => heat.find(pred);
L.push("- Example paragraphs (heat pump topic):");
L.push(`  - 0 definitions, 1 mention: "${ex((d) => d.k === 0 && d.m === 0 && !d.tail).text}"`);
L.push(`  - 4 definitions, 1 mention: "${ex((d) => d.k === 4 && d.m === 0 && !d.tail).text}"`);
L.push(`  - 0 definitions, stuffed with tail: "${ex((d) => d.k === 0 && d.tail).text}"`);
L.push("");
L.push("## How we scored them");
L.push("");
L.push(
  "- **8 open-source embedding models**, run locally with Transformers.js 3 (ONNX, 8-bit quantized weights), each with the query and document prefixes its model card specifies, and L2-normalized vectors. Score = **cosine similarity** between the prompt's vector and the paragraph's vector.",
);
L.push(`  - Models: ${EMB.map((m) => `\`${m}\``).join(", ")}.`);
if (fp) {
  const rows = Object.keys(fp).map(
    (m) =>
      `${short(m)}: ratio ${a[m].all.perDensityPoint.ratio.toFixed(1)}× (8-bit) vs ${fp[m].all.perDensityPoint.ratio.toFixed(1)}× (full precision); definition-dense beats stuffed on intent prompts ${pct(a[m].h2h.defBeatsStuffedIntent)} vs ${pct(fp[m].h2h.defBeatsStuffedIntent)}`,
  );
  L.push(
    `  - Quantization check: two models were re-run at full 32-bit precision. ${rows.join("; ")}. The head-to-head results held. MiniLM's per-mention keyword effect is close to zero at either precision (${f(a["Xenova/all-MiniLM-L6-v2"].all.perCount.kw, 4)} at 8-bit, ${f(fp["Xenova/all-MiniLM-L6-v2"].all.perCount.kw, 4)} at full precision), so its ratio is unstable; it is the highest ratio either way, so the median across models does not change. Report MiniLM's ratio as "very large / unstable", not as a precise number.`,
  );
}
L.push(
  "- **1 cross-encoder reranker**, `Xenova/bge-reranker-base` (BAAI bge-reranker-base), which reads the prompt and the paragraph together and outputs a relevance score. Rerankers are commonly used as a second stage after retrieval.",
);
L.push(
  "- **BM25** (k1 = 1.2, b = 0.75), the classic keyword-matching ranking formula used by search engines like Elasticsearch and Lucene, as a lexical baseline.",
);
L.push(
  '- Scores are compared **within the same prompt** (each prompt vs the 28–36 paragraphs of its own topic). "z" values are that score in standard deviations from the prompt\'s mean, so models with different score scales can be averaged.',
);
L.push(
  "- **Not tested:** OpenAI's text-embedding-3-small (the plan's example) or any other paid API model; we used open models only. Nothing here measures rankings inside ChatGPT, Perplexity, Google AI Overviews or any other product.",
);
L.push("");
L.push("## Result 1: per-sentence and per-mention effects (all 32 prompts)");
L.push("");
L.push(
  'Linear regression within each prompt, on the 223 paragraphs without the stuffing tail. "Per definition sentence" = change in cosine similarity when one filler sentence becomes a definition. "Per keyword mention" = change when one more pronoun becomes the keyword. "Ratio per density point" compares one percentage point of definition density (definition sentences per 100 words) with one percentage point of keyword density.',
);
L.push("");
L.push("| Model | Per definition sentence | Per keyword mention | Ratio per density point |");
L.push("| --- | --- | --- | --- |");
for (const m of EMB) {
  const r = a[m].all;
  const unstable = m === "Xenova/all-MiniLM-L6-v2" ? " (unstable: keyword effect near zero)" : "";
  L.push(
    `| ${short(m)} | ${f(r.perCount.def, 4)} | ${f(r.perCount.kw, 4)} | ${r.perDensityPoint.ratio.toFixed(1)}×${unstable} |`,
  );
}
const ratios = EMB.map((m) => a[m].all.perDensityPoint.ratio);
L.push("");
L.push(
  `- **Median ratio across the 8 models: ${median(ratios).toFixed(1)}×** (range ${Math.min(...ratios).toFixed(1)}× to ${Math.max(...ratios).toFixed(1)}×). The plan's hypothesis was ~3×.`,
);
L.push(
  `- Definition sentences raised similarity in all 8 models. Extra keyword mentions also raised average similarity across all 32 prompts, but mostly through the first repeat (see Result 3), and they lowered it for intent prompts (Result 2).`,
);
L.push("");
L.push("## Result 2: prompts that use the keyword vs intent prompts that don't");
L.push("");
L.push(
  "| Model | Keyword prompts: per definition | Keyword prompts: per mention | Intent prompts: per definition | Intent prompts: per mention |",
);
L.push("| --- | --- | --- | --- | --- |");
for (const m of EMB) {
  const k = a[m].keyword.perCount;
  const i = a[m].intent.perCount;
  L.push(`| ${short(m)} | ${f(k.def, 4)} | ${f(k.kw, 4)} | ${f(i.def, 4)} | ${f(i.kw, 4)} |`);
}
const negIntent = EMB.filter((m) => a[m].intent.perCount.kw < 0).length;
const posIntentDef = EMB.filter((m) => a[m].intent.perCount.def > 0).length;
L.push("");
L.push(
  `- On the 8 intent prompts, each extra keyword mention **lowered** similarity in **${negIntent} of 8** models, while each definition sentence raised it in **${posIntentDef} of 8**.`,
);
L.push("");
L.push("## Result 3: the keyword-repeat curve");
L.push("");
L.push(
  "Mean z-score (averaged over all 8 embedding models and all 32 prompts) by number of keyword mentions, for paragraphs with 0 definitions and with 4 definitions. Higher = closer to the prompt.",
);
L.push("");
const curve = (k, c) => mean(EMB.map((m) => a[m].grid[`${k}|${c}`]).filter((v) => v !== undefined));
const maxC = Math.max(...docs.filter((d) => !d.tail).map((d) => Math.min(d.kwCount, 7)));
const cols = Array.from({ length: maxC }, (_, i) => i + 1);
L.push(
  `| Definitions | ${cols.map((c) => `${c} mention${c > 1 ? "s" : ""}`).join(" | ")} | Most mentions + stuffing tail |`,
);
L.push(`| --- | ${cols.map(() => "---").join(" | ")} | --- |`);
for (const k of [0, 2, 4]) {
  L.push(
    `| ${k} | ${cols
      .map((c) => {
        const v = curve(k, c);
        return Number.isNaN(v) ? "n/a" : f(v, 2);
      })
      .join(" | ")} | ${f(curve(k, "tail"), 2)} |`,
  );
}
L.push("");
L.push(
  "Note: not every topic reaches 6 or 7 mentions, so the rightmost columns average fewer paragraphs.",
);
const tailLower = EMB.filter((m) => {
  const lastM = (k) => Math.max(...cols.filter((c) => a[m].grid[`${k}|${c}`] !== undefined));
  return a[m].grid["0|tail"] < a[m].grid[`0|${lastM(0)}`];
}).length;
L.push(
  `- Adding the stuffing tail to the most repetitive filler paragraph lowered its average score in **${tailLower} of 8** models.`,
);
L.push("");
L.push("## Result 4: head to head");
L.push("");
L.push(
  'For each prompt: the paragraph with **4 definitions and 1 keyword mention** ("definition-dense") vs the paragraph with **0 definitions and the most keyword mentions** ("keyword-stuffed"), and vs that same stuffed paragraph plus the tail.',
);
L.push("");
L.push(
  "| Scorer | Definition-dense beats keyword-stuffed (all prompts) | …on intent prompts | Beats stuffed + tail (all prompts) | Adding keyword repeats to the definition-dense paragraph raised its score (all prompts) | …on intent prompts |",
);
L.push("| --- | --- | --- | --- | --- | --- |");
for (const m of Object.keys(a)) {
  const h = a[m].h2h;
  L.push(
    `| ${short(m)} | ${pct(h.defBeatsStuffed)} | ${pct(h.defBeatsStuffedIntent)} | ${pct(h.defBeatsTail)} | ${pct(h.stuffingRaisesGoodCopy)} | ${pct(h.stuffingRaisesGoodCopyIntent)} |`,
  );
}
L.push("");
L.push("Each percentage is out of 32 prompts (all) or 8 prompts (intent).");
L.push("");
for (const extra of ["Xenova/bge-reranker-base", "bm25"]) {
  if (!a[extra]) continue;
  const r = a[extra];
  L.push(`### ${extra === "bm25" ? "BM25 (keyword baseline)" : "Reranker (bge-reranker-base)"}`);
  L.push("");
  L.push(
    `- Per definition sentence: ${f(r.all.perCount.def, 3)}; per keyword mention: ${f(r.all.perCount.kw, 3)} (${extra === "bm25" ? "BM25 score units" : "reranker logit units"}).`,
  );
  L.push(
    `- Intent prompts: per definition ${f(r.intent.perCount.def, 3)}, per mention ${f(r.intent.perCount.kw, 3)}.`,
  );
  L.push(
    `- Keyword-repeat curve (z, 0 definitions): ${cols
      .map((c) => r.grid[`0|${c}`])
      .filter((v) => v !== undefined)
      .map((v) => f(v, 2))
      .join(", ")}; with tail ${f(r.grid["0|tail"], 2)}. With 4 definitions: ${cols
      .map((c) => r.grid[`4|${c}`])
      .filter((v) => v !== undefined)
      .map((v) => f(v, 2))
      .join(", ")}; with tail ${f(r.grid["4|tail"], 2)}.`,
  );
  L.push(
    `- Top-ranked paragraph had all 4 definitions for ${pct(r.top.topHasAllDefs)} of prompts; it was a stuffing-tail paragraph for ${pct(r.top.topIsTail)}.`,
  );
  L.push("");
}
L.push("## Figure");
L.push("");
L.push(
  "- `study/embedding-map` exists. It shows the llms.txt topic with bge-base-en-v1.5: the 4 prompts and 28 paragraphs projected to 2D (PCA, 55% of variance shown). Paragraphs form five clusters by number of definitions (0 to 4). Within a cluster the dots differ only in keyword repeats and sit almost on top of each other; adding definitions moves the whole cluster across the map. The intent prompt sits apart from the others. Use it with alt text and a caption; say distances on a 2D projection are approximate.",
);
L.push(
  "- In that topic with bge-base, mean similarity to the 3 keyword prompts rose from 0.773 (0 definitions) to 0.820 (4 definitions), and to the intent prompt from 0.568 to 0.610.",
);
L.push("");
L.push("## What we could and couldn't show (use in Limitations)");
L.push("");
L.push(
  "- Similarity scores from open models are a proxy for the first retrieval stage. Production systems add other signals (freshness, authority, rerankers, user context), and none of the named AI search products publish which embedding model they use (check before saying otherwise).",
);
L.push(
  "- The paragraphs are short (70–108 words) and written for the test; long pages are chunked into passages before embedding, so results apply per passage.",
);
L.push(
  '- 8 topics and 32 prompts is a small test set; treat numbers as directional. The code and test set are Rankbox\'s; offer them on request (say "email us" only if BRIEF.md gives a contact route; otherwise leave it out).',
);
L.push("- English only.");
mkdirSync("../data", { recursive: true });
writeFileSync("../data/A8.md", L.join("\n") + "\n");
console.log("wrote", L.length, "lines");
