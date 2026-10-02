// node scripts/sublanding-roadmap/gen.mjs . [board-out.html]
// Writes docs/sublanding-roadmap.md, and the visual board when an output path is given.
import { writeFileSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { PAGES, PHASES, WORKFLOW, UPDATED, DONE } from "./data.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const repo = process.argv[2];
const boardOut = process.argv[3];
const BOARD_URL = "https://claude.ai/artifact/XT4UXS1bE45oqZcFcPQtGJ";
const isDone = (p) => DONE.includes(p.route);

const FLAG_LABEL = {
  tracking: "Needs citation tracking",
  call: "Needs your call",
  weak: "Weak product fit",
  verify: "Verify vendor facts",
};

const vol = (p) => p.q.reduce((s, r) => s + (r[1] || 0), 0);
const fmt = (n) => (n == null ? "–" : n.toLocaleString("en-US"));
const cpc = (n) => (n == null ? "–" : `$${n.toFixed(2)}`);
const kd = (n) => (n == null ? "–" : String(n));
const section = (p) => (p.route.split("/")[1] || "solutions");

const pagesIn = (n) => PAGES.filter((p) => p.phase === n);
const pdfPages = PAGES.filter((p) => !p.extra);
const newPages = pdfPages.filter((p) => p.status === "new");
const refresh = pdfPages.filter((p) => p.status === "refresh");
const tracking = PAGES.filter((p) => p.flag === "tracking");
const totalVol = PAGES.reduce((s, p) => s + vol(p), 0);

// sanity
const seen = new Set();
const dirs = new Set();
for (const p of PAGES) {
  if (seen.has(p.route)) throw new Error(`duplicate route ${p.route}`);
  if (dirs.has(p.dir)) throw new Error(`duplicate dir ${p.dir}`);
  seen.add(p.route);
  dirs.add(p.dir);
  if (!p.concept) throw new Error(`no concept on ${p.route}`);
  if (!PHASES.find((ph) => ph.n === p.phase)) throw new Error(`bad phase on ${p.route}`);
}
for (const d of DONE) if (!seen.has(d)) throw new Error(`DONE lists unknown route ${d}`);
const concepts = PAGES.map((p) => p.concept);
if (new Set(concepts).size !== concepts.length) throw new Error("two pages share a concept");

/* ------------------------------------------------------------ markdown */
const md = [];
md.push(`# Rankbox sublanding roadmap`);
md.push("");
md.push(
  `Every sublanding page in *Rankbox - Sublanding Pages.pdf* (Semrush US data, supplied ${UPDATED}): **${newPages.length} new pages and ${refresh.length} rebuilds of live pages, in ${PHASES.length} phases**, plus the /solutions hub. **There are no templates.** Every page is designed and built from scratch by its own agent, in its own directory, because these pages roll out in bulk and Google's spam policies target pages mass-produced from one template. ${tracking.length} pages describe citation or rank tracking, which Rankbox doesn't ship yet, so they come last. Visual board: ${BOARD_URL}`
);
md.push("");
md.push(`Don't edit this file by hand. It is generated from \`scripts/sublanding-roadmap/data.mjs\` by \`node scripts/sublanding-roadmap/gen.mjs . [board.html]\`. To mark a page live, add its route to \`DONE\` in data.mjs and regenerate.`);
md.push("");
md.push(`**To run a phase**, start a session with: \`Run Phase N of docs/sublanding-roadmap.md\`. Phase 0 comes first. After it, phases can run in any order; the order below is the recommended one (honest fit × commercial value).`);
md.push("");
md.push(`## How each page is built`);
md.push("");
WORKFLOW.steps.forEach(([t, b], i) => md.push(`${i + 1}. **${t}.** ${b}`));
md.push("");
md.push(`The agent is defined in \`${WORKFLOW.agent}\`. Run one agent per page, in parallel within a phase; each agent touches only its own directory and its route file.`);
md.push("");
md.push(`| Shared by every page (brand and plumbing) | Never shared between pages |`);
md.push(`| --- | --- |`);
const rows = Math.max(WORKFLOW.shared.length, WORKFLOW.bespoke.length);
for (let i = 0; i < rows; i++) md.push(`| ${WORKFLOW.shared[i] ?? ""} | ${WORKFLOW.bespoke[i] ?? ""} |`);
md.push("");
md.push(`## Rules for every page`);
md.push("");
[
  "**Build every page the PDF lists**, at its route, with its primary query in the H1 and title. Don't skip or merge a page because it's similar to another one: give it its own angle and link the two. Only the PDF's own repeats are built once (see *Folded and bundled*).",
  "**Keep claims true.** The brand is Rankbox (rankbox.xyz), not Rankvolt. The trial is 7 days (`TRIAL_DAYS`), and a card is taken when it starts; signup and the content plan are free. Prices come from `src/data/pricing.ts`, never typed. Rankbox claims follow `SHIPPED` and `addonLive`. Where a PDF hook overstates, keep the angle and write the accurate version: each page's **Truth** line says what to change.",
  "**Competitor and industry facts come from primary sources on the day of writing**, dated. The PDF's descriptions of competitors are starting points, and several are already out of date.",
  "**Show no proof that isn't real**: no testimonials, customer logos, ratings, install counts or customer totals. No `aggregateRating` in JSON-LD until reviews are real.",
  "**Stay on brand, never on template**: existing colour tokens and fonts, blue CTAs (`bg-cta`, never `bg-ink`), one primary action per screen, works at 400px wide (the public site is light-only), respects reduced motion. Everything else (layout, visuals, section order, copy) is the page's own. The landing hero and the `/ai-seo/<engine>` guide hero stay untouched.",
  "**Wiring is done by the main session**, not the page agents: the registry entry, a `TOPICS` placement in `src/data/link-graph.ts`, the sitemap, a line in `src/content/llms.txt`. Then `npx vitest run` and a browser check at desktop and phone width.",
  "**Shared working tree**: other sessions edit this checkout. Re-read files right before editing, don't switch branches or stash, and don't commit unless asked.",
].forEach((r, i) => md.push(`${i + 1}. ${r}`));
md.push("");
md.push(`## The one decision that changes the order`);
md.push("");
md.push(
  `${tracking.length} pages (Phases 21 to 23, ${fmt(tracking.reduce((s, p) => s + vol(p), 0))} searches a month in their clusters) are rank, citation, prompt or brand trackers. \`SHIPPED.citationTracking\` is false, so a page titled "Perplexity Rank Tracker" can't be honest today. There are two ways forward:`
);
md.push("");
md.push(`- **Build the tracker first** (a product build, not a page). It needs API keys and a monthly budget for each engine tracked (OpenAI, Perplexity, Anthropic, Gemini), a SERP API for AI Overviews, and a scheduler (the cron hooks are still unscheduled). When it ships, flip \`SHIPPED.citationTracking\` and move Phases 21 to 23 to the front.`);
md.push(`- **Leave them for last**, as ordered here. One exception can ship early: the Gemini rank tracker can be a real free check using the Gemini key already in the project, with Google Search grounding, if you approve the API spend.`);
md.push("");
md.push(`## Phases at a glance`);
md.push("");
md.push(`| Phase | Theme | Pages | Cluster searches/mo | Needs |`);
md.push(`| --- | --- | --- | --- | --- |`);
for (const ph of PHASES) {
  const ps = pagesIn(ph.n);
  const live = ps.filter(isDone).length;
  md.push(`| ${ph.n} | ${ph.title} | ${live ? `${live}/` : ""}${ps.length} | ${fmt(ps.reduce((s, p) => s + vol(p), 0))} | ${ph.needs} |`);
}
md.push("");
md.push(`Cluster searches add up every query the PDF lists for a page, so related queries overlap and the totals overstate unique demand. Use them to rank phases, not to forecast traffic.`);
md.push("");
md.push(`## Folded and bundled`);
md.push("");
[
  "**Listed twice in the PDF, built once:** AI search console (at /solutions and /tools → /solutions/ai-search-console); Mangools (under SpyFu and on its own → /alternatives/mangools).",
  "**Bundled by the PDF, covered inside the page they sit under:** Conductor (BrightEdge), ContentKing (Screaming Frog), Whatagraph (AgencyAnalytics), BrightLocal (Yext), Birdeye (Podium), Seamless.AI (Cognism), BigCommerce (Magento).",
  "**Routes moved to the PDF's own alternates:** /features/semantic-seo-tool → /tools/semantic-seo-tool and /features/entity-seo → /solutions/knowledge-graph-seo. /features/* renders shipped Rankbox features from src/data/features.ts, and neither is one.",
  "**Already live, rebuilt as their own pages:** /alternatives/frase, /alternatives/surfer-seo, /alternatives/jasper use the shared /alternatives template today. Phase 20 gives each its own design at the same route.",
  "**Close to live pages, built anyway with their own angle:** /solutions/ai-brand-visibility (vs /solutions/ai-search-visibility), /solutions/grok-ai-seo (vs /ai-seo/grok), /solutions/searchgpt-seo (vs /ai-seo/chatgpt), /solutions/local-ai-seo (vs /use-cases/local-businesses), the three SaaS pages (vs /use-cases/saas), /solutions/shopify-ai-seo and /solutions/webflow-ai-seo (vs /integrations/*).",
].forEach((r) => md.push(`- ${r}`));
md.push("");
md.push(`## Watch for`);
md.push("");
md.push(`- **Search intent.** Many industry queries ("hvac seo agency", "dental seo agency", "personal injury lawyer marketing") are people looking for an agency. Each industry page positions Rankbox as the software alternative to that agency, and says plainly what an agency does that software doesn't.`);
md.push(`- **Bulk rollout.** Even with bespoke pages, publishing 40+ industry pages at once invites scrutiny. After the first industry phase, check Search Console for "Crawled – currently not indexed" before running the next one.`);
md.push(`- **Regulated industries.** Legal, health, finance, real estate and franchise pages state the advertising rules that bind the industry, with primary sources, and say Rankbox drafts while the business approves. They give general information, not legal, medical or financial advice.`);
md.push("");

for (const ph of PHASES) {
  const ps = pagesIn(ph.n);
  md.push(`## Phase ${ph.n}: ${ph.title}`);
  md.push("");
  md.push(`${ph.why}`);
  md.push("");
  md.push(`**Needs:** ${ph.needs}`);
  md.push("");
  if (ph.work) {
    md.push(`**Build once:**`);
    md.push("");
    ph.work.forEach((w) => md.push(`- ${w}`));
    md.push("");
  }
  for (const p of ps) {
    const flag = p.flag ? ` · ⚑ ${FLAG_LABEL[p.flag]}` : "";
    const status = p.status === "refresh" ? " · live today, rebuilt" : p.extra ? " · not in the PDF" : "";
    md.push(`### [${isDone(p) ? "x" : " "}] ${p.route}`);
    md.push("");
    md.push(`**${p.name}**${status}${flag}`);
    md.push("");
    md.push(`- **Directory:** \`${p.dir}\` · **Agent:** one sublanding-page-designer, this page only`);
    md.push(`- **Concept:** ${p.concept}`);
    if (p.q.length) {
      md.push("");
      md.push(`| Query | Vol/mo | KD | CPC |`);
      md.push(`| --- | --- | --- | --- |`);
      p.q.forEach((r) => md.push(`| ${r[0]} | ${fmt(r[1])} | ${kd(r[2])} | ${cpc(r[3])} |`));
      md.push("");
    }
    md.push(`- **Hook:** ${p.hook}`);
    md.push(`- **Build:** ${p.build}`);
    md.push(`- **Truth:** ${p.truth}`);
    if (p.overlap.length) md.push(`- **Link and differentiate:** ${p.overlap.join("; ")}`);
    md.push("");
  }
}

writeFileSync(join(repo, "docs/sublanding-roadmap.md"), md.join("\n"));

/* ------------------------------------------------------------ html */
const data = {
  UPDATED,
  WORKFLOW,
  PHASES: PHASES.map((ph) => ({ ...ph, vol: pagesIn(ph.n).reduce((s, p) => s + vol(p), 0) })),
  PAGES: PAGES.map((p) => ({ ...p, vol: vol(p), done: isDone(p), section: section(p) })),
  FLAG_LABEL,
  totals: {
    newPages: newPages.length,
    refresh: refresh.length,
    phases: PHASES.length,
    tracking: tracking.length,
    totalVol,
    ready: PAGES.filter((p) => p.flag !== "tracking").length,
    live: DONE.length,
  },
};
const tpl = readFileSync(join(here, "board.html"), "utf8");
if (boardOut) writeFileSync(boardOut, tpl.replace("/*__DATA__*/null", JSON.stringify(data)));
console.log(`live ${DONE.length}, pages ${PAGES.length} (new ${newPages.length}, rebuild ${refresh.length}, extra ${PAGES.length - pdfPages.length}), tracking ${tracking.length}, vol ${totalVol}`);
