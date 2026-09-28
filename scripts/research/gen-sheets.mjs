// Builds the B4 and B2 data sheets from crawl-summary.json, hosts.json, linkcheck-summary.json.
import { readFileSync, writeFileSync, existsSync } from "node:fs";

const S = JSON.parse(readFileSync("crawl-summary.json", "utf8"));
const hosts = JSON.parse(readFileSync("hosts.json", "utf8"));
const domains = new Map(JSON.parse(readFileSync("domains.json", "utf8")).map((d) => [d.host, d]));
const LC = existsSync("linkcheck-summary.json")
  ? JSON.parse(readFileSync("linkcheck-summary.json", "utf8"))
  : null;
const pc = (a, b) => (b ? `${((100 * a) / b).toFixed(1)}%` : "n/a");
const live = hosts.filter((h) => !h.parked);
const byRank = (a, b) => (a.rank ?? 9e9) - (b.rank ?? 9e9);

const SEG_LABEL = {
  all: "All sites (deduplicated)",
  f500: "Fortune 500 (2026)",
  saas: "Software & SaaS companies (all)",
  "saas:devtools": "…developer tools (YC)",
  "saas:b2b-saas": "…B2B SaaS",
  "saas:software": "…other software & IT companies (Wikidata)",
  top10k: "Tranco top 10,000",
  "top10k:1-1k": "…ranks 1–1,000",
  "top10k:1k-10k": "…ranks 1,001–10,000",
  news: "News & media (top 500)",
  ecom: "E-commerce (top 500)",
  "news+ecom": "News, media & e-commerce (top 1,000)",
};

const COMMON_SAMPLE = [
  "## Sample (shared with the other crawl study)",
  "",
  "- Crawl date: **28 September 2026**. One pass, from one machine, HTTPS first (falling back to `https://www.` if the bare domain didn't connect), redirects followed, 15-second timeout per request, one request at a time per site.",
  '- User agent: `RankboxResearchBot/1.0 (+https://rankbox.xyz/blog; one-time study of robots.txt and llms.txt files)`. It is not on any allow list, so some firewalls challenged it (counted separately as "blocked").',
  "- Paths fetched per site: `/robots.txt`, `/llms.txt`, `/llms-full.txt`. Nothing else, no pages.",
  "- Domain lists:",
  "  - **Fortune 500 (2026)**: the 500 companies on Fortune's 2026 list, websites from each company's Fortune profile page.",
  '  - **Software & SaaS companies**: (a) Y Combinator\'s public company directory (via the yc-oss mirror, snapshot 28 September 2026): active or public companies in the B2B or Fintech industries or tagged SaaS, B2B or Developer Tools. "Developer tools" = tagged Developer Tools or in YC\'s "Engineering, Product and Design" subindustry. (b) Wikidata: organizations with an official website whose industry is software as a service, software industry, software development, cloud computing, information technology, software or computer security, or that are instances of software company, SaaS, technology company, internet company, web application or online service. "B2B SaaS" = YC B2B/Fintech companies not in developer tools, plus Wikidata items classed as SaaS. "Other software & IT" = the remaining Wikidata items.',
  "  - **Tranco top 10,000**: the top 10,000 domains of Tranco list 64X3X (generated 27 September 2026 from Chrome UX Report, Farsight, Majestic, Cloudflare Radar and Cisco Umbrella data; tranco-list.eu).",
  "  - **News & media top 500 / E-commerce top 500**: Wikidata items classed as newspapers, online newspapers, news websites, news agencies, news media, magazines, broadcasters, TV networks or TV stations (news & media), or online retailers, online shops, or organizations in the e-commerce, online retail or retail industries (e-commerce), whose official website's domain appears in the Tranco list; ranked by Tranco rank, top 500 each. Excluded: subdomain websites, platforms (social networks, blog hosts, app stores, file hosts, academic publishers), .gov/.edu sites, and a hand-checked list of misclassified domains (e.g. universities, sports leagues, corporate holding sites, e-commerce software vendors).",
  `- Totals: **${S.b4.all.sample.toLocaleString("en-US")} unique sites** after deduplication (a site in several groups is counted once in \"All sites\"). ${S.b4.all.reachable.toLocaleString("en-US")} answered over HTTP(S); the rest had DNS, TLS or timeout failures (many are defunct companies still listed in Wikidata or YC) and are excluded from every percentage.`,
  `- Parked domains: ${S.lintSummary.parked} sites served an llms.txt that says the domain is for sale (e.g. GoDaddy's aftermarket template). They were excluded from every count.`,
  "",
];

/* ------------------------------ B4 ------------------------------ */
const B = [];
B.push("# B4 data sheet: The State of llms.txt Adoption", "");
B.push("Rankbox crawl, 28 September 2026. Every number below is final. Copy them exactly.", "");
B.push(...COMMON_SAMPLE);
B.push("## What counted", "");
B.push(
  "- **Has llms.txt** = `/llms.txt` returned HTTP 200 with a non-empty body that is not an HTML page (not served as text/html and not starting with `<`). Redirects to another URL that serves such a file count.",
);
B.push(
  "- **Soft 404** = HTTP 200 but an HTML page (usually the site's homepage or a 404 page served with status 200). Not counted as having the file.",
);
B.push(
  "- **Blocked** = HTTP 401/403/429, or a bot-challenge page (e.g. Cloudflare `cf-mitigated: challenge`). We couldn't see whether a file exists.",
);
B.push(
  '- **Not a file** = catch-all responses that return 200 for any path: bodies under 20 characters without a heading ("OK", "1", an IP address), short "not found" messages, short JSON error objects, or non-text content such as a tracking GIF. Counted as no file.',
);
B.push("- Same rules for `/llms-full.txt`.");
B.push(
  "- Caveat for the Tranco group: the Tranco list ranks registrable domains by traffic signals, so it includes infrastructure domains that aren't websites (CDNs, API and ad-serving hosts such as gstatic.com or googleapis.com). Many of them answer with 404 for any path, which pulls the Tranco adoption rate down. Say so when quoting the Tranco numbers.",
  "",
);
B.push("## Adoption by group", "");
B.push(
  "| Group | Sites answering | Has llms.txt | % | Has llms-full.txt | % | Soft 404 (HTML at /llms.txt) | Blocked our bot |",
);
B.push("| --- | --- | --- | --- | --- | --- | --- | --- |");
for (const [k, lab] of Object.entries(SEG_LABEL)) {
  const r = S.b4[k];
  if (!r) continue;
  B.push(
    `| ${lab} | ${r.reachable.toLocaleString("en-US")} | ${r.llms.toLocaleString("en-US")} | ${pc(r.llms, r.reachable)} | ${r.full.toLocaleString("en-US")} | ${pc(r.full, r.reachable)} | ${pc(r.html200, r.reachable)} | ${pc(r.blocked, r.reachable)} |`,
  );
}
B.push("");
B.push("Plan's hypothesis for comparison: dev tools ~12%, B2B SaaS ~4%, e-commerce <1%.", "");
B.push("## Fortune 500 by sector", "");
B.push("| Sector | Sites answering | Has llms.txt | % |", "| --- | --- | --- | --- |");
for (const [sec, v] of Object.entries(S.bySector).sort(
  (a, b) => b[1].llms / b[1].n - a[1].llms / a[1].n,
))
  B.push(`| ${sec} | ${v.n} | ${v.llms} | ${pc(v.llms, v.n)} |`);
B.push("");
const ex = (pred, n = 15) =>
  live
    .filter(pred)
    .sort(byRank)
    .slice(0, n)
    .map((h) => h.host);
const f500Adopters = live.filter((h) => h.segs.includes("f500") && h.llms === "file");
const f500Name = (h) => domains.get(h.host)?.segs.f500;
B.push("## Named examples (only these may be named in the post)", "");
B.push(
  `- Fortune 500 companies whose site served an llms.txt (Fortune rank, company, domain): ${f500Adopters
    .map((h) => f500Name(h))
    .filter(Boolean)
    .sort((a, b) => a.rank - b.rank)
    .slice(0, 30)
    .map((f) => `#${f.rank} ${f.name}`)
    .join("; ")}${f500Adopters.length > 30 ? ` (and ${f500Adopters.length - 30} more)` : ""}.`,
);
B.push(
  `- Top-1,000 Tranco sites with llms.txt (highest ranked first): ${ex((h) => h.segs.includes("top10k:1-1k") && h.llms === "file", 25).join(", ")}.`,
);
B.push(
  `- Top-1,000 Tranco sites answering with no llms.txt (404) (highest ranked first): ${ex((h) => h.segs.includes("top10k:1-1k") && h.llms === "none", 20).join(", ")}.`,
);
B.push(
  `- News & media sites with llms.txt (highest ranked first): ${ex((h) => h.segs.includes("news") && h.llms === "file", 15).join(", ")}.`,
);
B.push(
  `- E-commerce sites with llms.txt (highest ranked first): ${ex((h) => h.segs.includes("ecom") && h.llms === "file", 15).join(", ")}.`,
);
B.push(
  `- Sites with llms-full.txt (highest ranked first): ${ex((h) => h.full === "file", 15).join(", ")}.`,
);
B.push("");
const L = S.lintSummary;
const n = L.adopters;
B.push("## What the files look like (all sites with llms.txt, parked domains excluded)", "");
B.push(
  `- Files analysed: **${n.toLocaleString("en-US")}**. Median size ${(L.bytesMedian / 1024).toFixed(1)} KB; 90th percentile ${(L.bytesP90 / 1024).toFixed(1)} KB; ${L.over100k} files (${pc(L.over100k, n)}) over 100 KB. Median ${L.linksMedian} Markdown links per file.`,
);
B.push(`- Content-Type: ${L.ctBreakdown.map(([k, v]) => `${k} ${v} (${pc(v, n)})`).join("; ")}.`);
B.push("");
B.push("### Against the llmstxt.org format", "");
B.push("| Check | Files | % of files |", "| --- | --- | --- |");
const rows = [
  ["First non-empty line is an H1 (`# Name`), as the spec requires", L.h1First],
  ["No H1 anywhere", L.noH1],
  ["More than one H1", L.multiH1],
  ["Has a blockquote summary (`> …`)", L.blockquote],
  ["Has H2 sections", L.h2],
  ["Has a Markdown link list (`- [name](url)`)", L.listLinks],
  ["No Markdown links at all", L.noLinks],
  ["…of which list bare URLs instead of Markdown links", L.bareUrlsOnly],
  ["Uses relative links (spec examples use absolute URLs)", L.relativeLinksFiles],
  ["Links to .md versions of pages", L.mdLinksFiles],
  ["Has an `## Optional` section", L.optional],
  ["Contains robots.txt directives (User-agent/Allow/Disallow)", L.robotsSyntax],
  ["Contains HTML tags", L.htmlTags],
  ["No headings and no links (plain text)", L.noStructure],
  ["Uses only H3+ headings, no H2", L.h3Only],
  ["Reached only through a redirect to a different path", L.redirectedAway],
];
for (const [k, v] of rows) B.push(`| ${k} | ${v} | ${pc(v, n)} |`);
B.push("");
if (LC) {
  B.push("### Broken links (random sample)", "");
  B.push(
    `- Random sample of **${LC.files}** llms.txt files that contain links; up to 3 random absolute links checked per file (${LC.links} links), same user agent, 28 September 2026.`,
  );
  B.push(
    `- Results: ${LC.ok2xx} returned 2xx (${pc(LC.ok2xx, LC.links)}); ${LC.notFound} returned 404/410 (${pc(LC.notFound, LC.links)}); ${LC.otherClientErr} other 4xx (${pc(LC.otherClientErr, LC.links)}, mostly bot blocking); ${LC.serverErr} 5xx; ${LC.netErr} network errors.`,
  );
  B.push(
    `- Files with at least one 404/410 among the checked links: **${LC.filesWithBroken} of ${LC.files} (${pc(LC.filesWithBroken, LC.files)})**.`,
  );
  B.push(
    `- Links to .md files: ${LC.mdLinks} checked, ${LC.mdBroken} returned 404/410 (${pc(LC.mdBroken, LC.mdLinks)}).`,
  );
  B.push("");
}
B.push(
  "- Of the files containing robots.txt directives, 17 are the same 65-byte template (`User-agent: *` / `Allow: /` / `Disallow-Training: /` / `Sitemap: /sitemap.xml`), served by unrelated domains with no identifying server header; its origin is unknown. `Disallow-Training` is not a robots.txt or llms.txt directive.",
);
B.push("");
B.push("### Who generated them", "");
B.push(
  'Only files carrying an explicit signature were attributed; everything else is "no signature" (hand-written, built by a site\'s own code, or a tool that leaves no mark).',
  "",
);
B.push("| Signature | Files | % |", "| --- | --- | --- |");
for (const [g, v] of L.generators)
  B.push(`| ${g === "none" ? "No signature" : g} | ${v} | ${pc(v, n)} |`);
B.push("");
B.push(
  '- Signatures used: "Generated by Yoast SEO", "Generated by Rank Math SEO", "Generated by All in One SEO" (WordPress plugins); "This site is powered by Wix and supports the Model Context Protocol (MCP)" (Wix); a file titled "# Agent Instructions" pointing agents to shop.app/SKILL.md or a commerce protocol section (a template seen on Shopify stores). **Verify from each vendor\'s own docs or changelog before saying the vendor generates the file automatically, and when that shipped.**',
);
B.push("");
B.push("### llms-full.txt", "");
B.push(
  `- Sites with both files: ${L.fullAndLlms}. Sites with llms-full.txt but no llms.txt: ${L.fullWithoutLlms}.`,
);
B.push("");
B.push("### robots.txt and llms.txt", "");
B.push(
  `- Sites whose robots.txt mentions llms.txt: ${S.b2.all.mentionsLlmsTxt} of ${S.b2.all.robotsFile} robots.txt files (${pc(S.b2.all.mentionsLlmsTxt, S.b2.all.robotsFile)}). (There's no standard directive for this.)`,
);
B.push("");
B.push("## Figure", "");
B.push(
  '- `study/llms-txt-adoption` exists: bars for /llms.txt and /llms-full.txt adoption by group (developer tools 50.4%, B2B SaaS 46.5%, other software & IT 42.9%, e-commerce 16.4%, Fortune 500 15.7%, Tranco 1–1,000 15.3%, Tranco 1,001–10,000 12.1%, news & media 5.2%). Place it with `![alt](figure:study/llms-txt-adoption "Caption.")`.',
  "",
);
B.push("## Not measured (say so in Limitations)", "");
B.push(
  '- **"Do llms.txt sites get cited more accurately?"** We did not test citation accuracy in this crawl. It needs a prompt panel run against AI assistants for adopters vs matched non-adopters, scored for factual accuracy. Give the best public evidence on whether AI crawlers and assistants read llms.txt at all (vendor statements, log studies), sourced and dated, and say Rankbox plans to test it.',
);
B.push(
  "- A single crawl from one location can't see files that are served only to some user agents or regions; firewall-blocked sites are reported separately, not guessed.",
);
B.push(
  "- Wikidata and YC lists include some companies that have shut down; unreachable sites are excluded, and parked domains that still answer are excluded when their llms.txt says the domain is for sale, but other parked pages without an llms.txt may remain in the denominators.",
);
B.push(
  '- The Wikidata and YC samples are not "the top 10,000 SaaS sites" by traffic: there\'s no public ranking of SaaS companies. Say what the sample is.',
);
writeFileSync("data/B4.md", B.join("\n") + "\n");

/* ------------------------------ B2 ------------------------------ */
const BOTS = Object.keys(S.b2.all.bots);
const C = [];
C.push("# B2 data sheet: The AI Bot Crawler Census", "");
C.push("Rankbox crawl, 28 September 2026. Every number below is final. Copy them exactly.", "");
C.push(...COMMON_SAMPLE);
C.push("## What counted", "");
C.push(
  "- robots.txt parsed with the open-source `robots-parser` library (v3), which follows RFC 9309 matching: a bot obeys the group that names it most specifically, else the `*` group; longest matching rule wins.",
);
C.push(
  "- **Fully blocked** for a bot = both the homepage (`/`) and an arbitrary deep page are disallowed for that bot's user-agent token.",
);
C.push("- **Partially blocked** = one of those two is disallowed but not the other (rare).");
C.push(
  "- **Named** = the robots.txt has a `User-agent:` line for that bot's token. A bot can be fully blocked without being named, through `User-agent: *` + `Disallow: /`.",
);
C.push(
  "- Percentages are of sites that served a parseable robots.txt (HTTP 200, not HTML). Sites with no robots.txt (404) allow everything; they are counted in the fetch table but not in the block-rate denominators.",
  "",
);
C.push("## robots.txt fetch results", "");
C.push(
  "| Group | Sites answering | robots.txt parsed | No robots.txt (404/410) | Blocked our bot on robots.txt (401/403/429/challenge) | HTML instead of robots.txt |",
  "| --- | --- | --- | --- | --- | --- |",
);
for (const [k, lab] of Object.entries(SEG_LABEL)) {
  const r = S.b2[k];
  if (!r) continue;
  C.push(
    `| ${lab} | ${r.reachable} | ${r.robotsFile} | ${r.robotsNone} | ${r.robotsBlocked} (${pc(r.robotsBlocked, r.reachable)}) | ${r.robotsHtml} |`,
  );
}
C.push("");
C.push("## Block rates by bot (fully blocked, % of parsed robots.txt files)", "");
const SEGS2 = ["news", "ecom", "news+ecom", "f500", "top10k", "saas", "all"];
C.push(
  `| Bot | ${SEGS2.map((s) => SEG_LABEL[s]).join(" | ")} |`,
  `| --- | ${SEGS2.map(() => "---").join(" | ")} |`,
);
for (const b of BOTS)
  C.push(`| ${b} | ${SEGS2.map((s) => `${S.b2[s].bots[b].fullPct}%`).join(" | ")} |`);
C.push("");
C.push(
  "Denominators (parsed robots.txt files): " +
    SEGS2.map((s) => `${SEG_LABEL[s]} ${S.b2[s].robotsFile}`).join("; ") +
    ".",
);
C.push("");
C.push("Plan's hypothesis for comparison: GPTBot ~35%, ClaudeBot ~25%, PerplexityBot ~18%.", "");
C.push(
  "## Named vs wildcard, and how many are named at all (news, media & e-commerce top 1,000)",
  "",
);
C.push(
  "| Bot | Fully blocked | …by a rule naming it | Named anywhere in robots.txt | Partially blocked |",
  "| --- | --- | --- | --- | --- |",
);
for (const b of BOTS) {
  const v = S.b2["news+ecom"].bots[b];
  C.push(`| ${b} | ${v.full} | ${v.fullNamed} | ${v.named} | ${v.partial} |`);
}
C.push("");
C.push("## Split policies (count of sites)", "");
C.push(
  `| Policy | ${SEGS2.map((s) => SEG_LABEL[s]).join(" | ")} |`,
  `| --- | ${SEGS2.map(() => "---").join(" | ")} |`,
);
const SPL = {
  gptNotSearch: "Blocks GPTBot but not OAI-SearchBot",
  gptAndSearch: "Blocks both GPTBot and OAI-SearchBot",
  searchNotGpt: "Blocks OAI-SearchBot but not GPTBot",
  claudeNotSearch: "Blocks ClaudeBot but not Claude-SearchBot",
  blocksGoogleExtNotGooglebot: "Blocks Google-Extended but not Googlebot",
  anyAI: "Fully blocks at least one AI bot (any listed except Googlebot/Bingbot)",
  anyAINamed: "…by a rule naming it",
};
for (const [k, lab] of Object.entries(SPL))
  C.push(
    `| ${lab} | ${SEGS2.map((s) => `${S.b2[s].splits[k]} (${pc(S.b2[s].splits[k], S.b2[s].robotsFile)})`).join(" | ")} |`,
  );
C.push(
  `| Blocks every crawler (\`User-agent: *\` + \`Disallow: /\`) | ${SEGS2.map((s) => `${S.b2[s].wildcardFull} (${pc(S.b2[s].wildcardFull, S.b2[s].robotsFile)})`).join(" | ")} |`,
);
C.push("");
C.push("## Content signals and managed robots.txt", "");
C.push(
  `- \`Content-Signal:\` lines (Cloudflare's Content Signals Policy): ${SEGS2.map((s) => `${SEG_LABEL[s]} ${S.b2[s].contentSignal} (${pc(S.b2[s].contentSignal, S.b2[s].robotsFile)})`).join("; ")}.`,
);
C.push(
  `- Most common Content-Signal values: ${S.contentSignalLines.map(([v, c]) => `\`${v}\` ${c}`).join("; ")}.`,
);
C.push(
  `- robots.txt files containing Cloudflare's \"BEGIN Cloudflare Managed content\" block: ${SEGS2.map((s) => `${SEG_LABEL[s]} ${S.b2[s].cfManaged}`).join("; ")}.`,
);
C.push("");
const newsEcom = live.filter((h) => (h.segs.includes("news") || h.segs.includes("ecom")) && h.rb);
const exB = (pred, n = 15) =>
  newsEcom
    .filter(pred)
    .sort(byRank)
    .slice(0, n)
    .map((h) => h.host);
const F = (b) => (h) => h.rb.facts[b].full;
C.push("## Named examples (only these may be named in the post; highest Tranco rank first)", "");
C.push(
  `- News & media sites that fully block GPTBot: ${exB((h) => h.segs.includes("news") && F("GPTBot")(h), 20).join(", ")}.`,
);
C.push(
  `- News & media sites that do not block GPTBot: ${exB((h) => h.segs.includes("news") && !F("GPTBot")(h), 15).join(", ")}.`,
);
C.push(
  `- Sites (news/e-commerce) blocking GPTBot but allowing OAI-SearchBot: ${exB((h) => F("GPTBot")(h) && !F("OAI-SearchBot")(h), 15).join(", ")}.`,
);
C.push(
  `- Sites (news/e-commerce) blocking OAI-SearchBot: ${exB(F("OAI-SearchBot"), 15).join(", ")}.`,
);
C.push(
  `- E-commerce sites that fully block GPTBot: ${exB((h) => h.segs.includes("ecom") && F("GPTBot")(h), 15).join(", ")}.`,
);
C.push(
  `- Sites (news/e-commerce) blocking PerplexityBot: ${exB(F("PerplexityBot"), 15).join(", ")}.`,
);
C.push("");
C.push("## Figure", "");
C.push(
  '- `study/ai-bot-blocking` exists: grouped bars, % fully blocking each of GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-SearchBot, PerplexityBot, Perplexity-User, Google-Extended, CCBot and Googlebot, for news & media, e-commerce and the Tranco top 10,000 (numbers rounded to one decimal from the block-rate table). Place it with `![alt](figure:study/ai-bot-blocking "Caption.")`.',
  "",
);
C.push("## Not measured (say so; give sourced public data instead)", "");
C.push(
  "- **Server logs** (crawl frequency, page priorities, response codes, bandwidth): Rankbox's own hosting logs (Vercel request logs) record path and status but not the user agent, so we can't attribute requests to bots from them. Rankbox plans to log AI bot requests on its own site for a future edition (not live yet). Use sourced public data (Cloudflare Radar AI Insights, Cloudflare and Vercel crawler studies, Fastly/Akamai reports), each dated and linked, and explain how site owners can run the analysis on their own logs.",
);
C.push(
  "- **The citation penalty** (do blockers vanish from ChatGPT Search?): not tested. Give OpenAI's, Anthropic's and Perplexity's documented behaviour for sites that block their search bots, sourced, and describe the test.",
);
C.push(
  "- robots.txt is a request, not enforcement: it shows intent, not whether bots obey it or whether a firewall blocks them anyway. Firewall blocking of our own bot is reported above as a separate number.",
);
C.push(
  "- Some sites serve different robots.txt files to different user agents; we fetched it once with our research bot's user agent.",
);
writeFileSync("data/B2.md", C.join("\n") + "\n");
console.log("wrote data/B4.md and data/B2.md");
