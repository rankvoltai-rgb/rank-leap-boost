# Rankbox sublanding roadmap

Every sublanding page in *Rankbox - Sublanding Pages.pdf* (Semrush US data, supplied 2026-10-02): **101 new pages and 3 rebuilds of live pages, in 24 phases**, plus the /solutions hub. **There are no templates.** Every page is designed and built from scratch by its own agent, in its own directory, because these pages roll out in bulk and Google's spam policies target pages mass-produced from one template. 13 pages describe citation or rank tracking, which Rankbox doesn't ship yet, so they come last. Visual board: https://claude.ai/artifact/XT4UXS1bE45oqZcFcPQtGJ

Don't edit this file by hand. It is generated from `scripts/sublanding-roadmap/data.mjs` by `node scripts/sublanding-roadmap/gen.mjs . [board.html]`. To mark a page live, add its route to `DONE` in data.mjs and regenerate.

**To run a phase**, start a session with: `Run Phase N of docs/sublanding-roadmap.md`. Phase 0 comes first. After it, phases can run in any order; the order below is the recommended one (honest fit × commercial value).

## How each page is built

1. **One page, one agent.** Each page is built by its own sublanding-page-designer agent: a senior UI/UX designer and front-end engineer who owns that page alone, from research to the last pixel.
2. **One page, one directory.** Everything visible on the page lives in src/sublanding/<section>/<slug>/: BRIEF.md (concept, audience, sources, section plan, how it differs from its neighbours), content.ts (every word, the meta and the FAQ), Page.tsx and the page's own section components, and its own test. The route file in src/routes is a thin wrapper.
3. **Research before design.** The agent reads the page's roadmap entry, checks every competitor or industry fact on its primary source that day, and writes BRIEF.md before any code.
4. **Designed from a blank page.** Own layout, own focal visual, own section order and own copy. The concept in the roadmap is the starting idea; the agent may sharpen it but may not borrow another page's design.
5. **Checked against every other page.** sublanding.test.ts fails on more than 8% shared 8-word phrasing between any two pages, any shared H2 or FAQ question, a repeated title, description or H1, or an import from another page's directory.
6. **Reviewed, then wired.** The main session reviews each page in the browser at desktop and phone width, then wires it into the shared files (registry, link graph, sitemap, llms.txt) and ticks it off.

The agent is defined in `.claude/agents/sublanding-page-designer.md`. Run one agent per page, in parallel within a phase; each agent touches only its own directory and its route file.

| Shared by every page (brand and plumbing) | Never shared between pages |
| --- | --- |
| Brand: colour tokens, fonts, the blue-CTA rule, Navbar and Footer | Layout, composition and section order |
| shadcn/ui primitives (button, input, tabs) and lucide icons | The focal visual and every interactive piece |
| Internal links: <ExploreMore>, driven by the link graph | All copy: headings, body, FAQ, meta title and description |
| Facts: prices and trial length (pricing.ts), SHIPPED and addonLive | Research: prompts, schema types, rules and sources |
| Engines: real server checks such as checkAiReadiness and the robots parser | Illustrations, scenes and mock UI |
| Invisible plumbing: the head and JSON-LD helper, the registry, the tests |  |

## Rules for every page

1. **Build every page the PDF lists**, at its route, with its primary query in the H1 and title. Don't skip or merge a page because it's similar to another one: give it its own angle and link the two. Only the PDF's own repeats are built once (see *Folded and bundled*).
2. **Keep claims true.** The brand is Rankbox (rankbox.xyz), not Rankvolt. The trial is 7 days (`TRIAL_DAYS`), and a card is taken when it starts; signup and the content plan are free. Prices come from `src/data/pricing.ts`, never typed. Rankbox claims follow `SHIPPED` and `addonLive`. Where a PDF hook overstates, keep the angle and write the accurate version: each page's **Truth** line says what to change.
3. **Competitor and industry facts come from primary sources on the day of writing**, dated. The PDF's descriptions of competitors are starting points, and several are already out of date.
4. **Show no proof that isn't real**: no testimonials, customer logos, ratings, install counts or customer totals. No `aggregateRating` in JSON-LD until reviews are real.
5. **Stay on brand, never on template**: existing colour tokens and fonts, blue CTAs (`bg-cta`, never `bg-ink`), one primary action per screen, works at 400px wide (the public site is light-only), respects reduced motion. Everything else (layout, visuals, section order, copy) is the page's own. The landing hero and the `/ai-seo/<engine>` guide hero stay untouched.
6. **Wiring is done by the main session**, not the page agents: the registry entry, a `TOPICS` placement in `src/data/link-graph.ts`, the sitemap, a line in `src/content/llms.txt`. Then `npx vitest run` and a browser check at desktop and phone width.
7. **Shared working tree**: other sessions edit this checkout. Re-read files right before editing, don't switch branches or stash, and don't commit unless asked.

## The one decision that changes the order

13 pages (Phases 21 to 23, 12,360 searches a month in their clusters) are rank, citation, prompt or brand trackers. `SHIPPED.citationTracking` is false, so a page titled "Perplexity Rank Tracker" can't be honest today. There are two ways forward:

- **Build the tracker first** (a product build, not a page). It needs API keys and a monthly budget for each engine tracked (OpenAI, Perplexity, Anthropic, Gemini), a SERP API for AI Overviews, and a scheduler (the cron hooks are still unscheduled). When it ships, flip `SHIPPED.citationTracking` and move Phases 21 to 23 to the front.
- **Leave them for last**, as ordered here. One exception can ship early: the Gemini rank tracker can be a real free check using the Gemini key already in the project, with Google Search grounding, if you approve the API spend.

## Phases at a glance

| Phase | Theme | Pages | Cluster searches/mo | Needs |
| --- | --- | --- | --- | --- |
| 0 | Foundations, hub + pilot | 2/2 | 4,070 | Your call on /features/citation-tracking (the two FAQ overclaims are fixed in this phase). |
| 1 | Free scans | 5 | 2,570 | Nothing extra. |
| 2 | Category money pages | 4 | 6,910 | Dated agency price research for the cost calculator. |
| 3 | Alternatives: content & keyword tools | 5 | 2,870 | Vendor pages checked the day of writing. |
| 4 | Alternatives: SEO suites | 5 | 2,040 | Vendor pages checked the day of writing. |
| 5 | Alternatives: audit & reporting tools | 4 | 1,210 | Vendor pages checked the day of writing. |
| 6 | Alternatives: GEO trackers | 6 | 4,550 | Vendor pages checked the day of writing. Reads better after the tracking build. |
| 7 | Platforms | 6 | 7,360 | Nothing extra. Shopify and Webflow copy follows addonLive. |
| 8 | Engines & entities | 4 | 1,800 | Nothing extra. |
| 9 | SaaS & developers | 5 | 2,150 | Nothing extra. |
| 10 | Commerce & AI agents | 3 | 3,920 | OpenAI's current shopping and checkout docs checked the day of writing; these change monthly. |
| 11 | Legal | 5 | 3,490 | Nothing extra. Pages give general information, not legal advice. |
| 12 | Home services | 5 | 12,150 | Nothing extra. |
| 13 | Healthcare practices | 5 | 8,680 | Nothing extra. |
| 14 | Behavioral health & life sciences | 5 | 4,690 | Nothing extra. Highest-care copy on the site. |
| 15 | Finance | 5 | 5,600 | Nothing extra. |
| 16 | Multi-location & local | 5 | 14,550 | A decision on how per-site pricing reads to 300-location brands. |
| 17 | B2B services & education | 4 | 6,330 | Nothing extra. |
| 18 | Real estate & built environment | 3 | 3,940 | Nothing extra. Fair Housing rules apply. |
| 19 | Alternatives: off-category | 3 | 900 | Your call on whether to build them. |
| 20 | Refresh the live alternatives | 3 | 1,780 | Nothing extra. |
| 21 | Tracking I: engine trackers | 5 | 990 | Citation tracking shipped: API keys and a monthly budget for each engine, plus a scheduler. |
| 22 | Tracking II: citations, prompts & AI Overviews | 5 | 5,450 | Phase 21's engine, plus a SERP API key for AI Overviews. |
| 23 | Brand & AI search console | 3 | 5,920 | Phase 21's engine. |

Cluster searches add up every query the PDF lists for a page, so related queries overlap and the totals overstate unique demand. Use them to rank phases, not to forecast traffic.

## Folded and bundled

- **Listed twice in the PDF, built once:** AI search console (at /solutions and /tools → /solutions/ai-search-console); Mangools (under SpyFu and on its own → /alternatives/mangools).
- **Bundled by the PDF, covered inside the page they sit under:** Conductor (BrightEdge), ContentKing (Screaming Frog), Whatagraph (AgencyAnalytics), BrightLocal (Yext), Birdeye (Podium), Seamless.AI (Cognism), BigCommerce (Magento).
- **Routes moved to the PDF's own alternates:** /features/semantic-seo-tool → /tools/semantic-seo-tool and /features/entity-seo → /solutions/knowledge-graph-seo. /features/* renders shipped Rankbox features from src/data/features.ts, and neither is one.
- **Already live, rebuilt as their own pages:** /alternatives/frase, /alternatives/surfer-seo, /alternatives/jasper use the shared /alternatives template today. Phase 20 gives each its own design at the same route.
- **Close to live pages, built anyway with their own angle:** /solutions/ai-brand-visibility (vs /solutions/ai-search-visibility), /solutions/grok-ai-seo (vs /ai-seo/grok), /solutions/searchgpt-seo (vs /ai-seo/chatgpt), /solutions/local-ai-seo (vs /use-cases/local-businesses), the three SaaS pages (vs /use-cases/saas), /solutions/shopify-ai-seo and /solutions/webflow-ai-seo (vs /integrations/*).

## Watch for

- **Search intent.** Many industry queries ("hvac seo agency", "dental seo agency", "personal injury lawyer marketing") are people looking for an agency. Each industry page positions Rankbox as the software alternative to that agency, and says plainly what an agency does that software doesn't.
- **Bulk rollout.** Even with bespoke pages, publishing 40+ industry pages at once invites scrutiny. After the first industry phase, check Search Console for "Crawled – currently not indexed" before running the next one.
- **Regulated industries.** Legal, health, finance, real estate and franchise pages state the advertising rules that bind the industry, with primary sources, and say Rankbox drafts while the business approves. They give general information, not legal, medical or financial advice.

## Phase 0: Foundations, hub + pilot

Set up the per-page system once: the agent, the directory contract and the tests that keep 100 pages from looking or reading alike. Then two pages prove it.

**Needs:** Your call on /features/citation-tracking (the two FAQ overclaims are fixed in this phase).

**Build once:**

- The page agent: .claude/agents/sublanding-page-designer.md, a senior UI/UX designer and engineer that builds one page in one directory.
- The directory contract: src/sublanding/README.md. Each page owns src/sublanding/<section>/<slug>/ with BRIEF.md, content.ts, Page.tsx, its own sections and its own test.
- Invisible plumbing only, in src/sublanding/_shared/: the head and JSON-LD helper for any route (SoftwareApplication with offers from PLAN and no aggregateRating, FAQPage, BreadcrumbList), and a facts module that reads price, trial and SHIPPED from their sources.
- src/sublanding/sublanding.test.ts: every page has its directory, brief, content and route; imports stay inside the whitelist; no claim beyond SHIPPED / addonLive; no "Rankvolt", "2-day" or "no credit card"; no typed prices; and the cross-page uniqueness checks.
- Pre-flight fixes: the pricing FAQ no longer says citation tracking works in the trial, and the Prompt Kit FAQ no longer says Rankbox tracks prompts daily. /features/citation-tracking still describes an unshipped feature: your call.
- The /solutions hub (its own agent and directory) replaces today's 301 to /features.
- Pilot page: /solutions/autonomous-geo, built by its own agent.

### [x] /solutions

**Solutions hub** · not in the PDF

- **Directory:** `src/sublanding/solutions/_index/` · **Agent:** one sublanding-page-designer, this page only
- **Concept:** A switchboard: every solution page as one searchable index, grouped by the job, the platform or the industry, that grows as each phase ships.
- **Hook:** Find the page for your job, your platform or your industry.
- **Build:** Not in the PDF. Needed now that three /solutions pages exist; replaces the 301 to /features. Reads the light SOLUTIONS index, so new pages appear without editing the hub.
- **Truth:** Lists only live pages.
- **Link and differentiate:** /features; /use-cases

### [x] /solutions/autonomous-geo

**Autonomous GEO**

- **Directory:** `src/sublanding/solutions/autonomous-geo/` · **Agent:** one sublanding-page-designer, this page only
- **Concept:** "Two Mondays": the same 30 days drawn as an audit to-do list on one side and as published answers on the other. One switch flips the page between homework and done.

| Query | Vol/mo | KD | CPC |
| --- | --- | --- | --- |
| ai search optimization tools | 1,600 | – | $17.53 |
| llm seo tool | 1,000 | – | $9.38 |
| ai visibility tracker | 880 | – | $12.42 |
| ai rank tracking | 590 | – | $11.73 |

- **Hook:** Legacy SEO tools give you homework. Rankbox does the work: it finds the questions engines answer without you and publishes the answers.
- **Build:** Concept module: an "Audit vs autopilot" toggle. One side is a 50-row audit checklist, the other is the same 30 days as published articles. Then a fair matrix against suites (Ahrefs, Semrush, Surfer) and the loop.
- **Truth:** The tracker queries in this cluster (ai visibility tracker, ai rank tracking) must not be answered with a tracking claim. "Publishes to your CMS" means the API today; the Shopify and Webflow apps are in review.
- **Link and differentiate:** /solutions/aeo-tools; /solutions/ai-search-visibility; /features/auto-publishing; blog: ai-search-optimization-tools (peer session)

## Phase 1: Free scans

Highest-converting format in the PDF, and every check can run for real today.

**Needs:** Nothing extra.

### [ ] /tools/ai-search-audit

**AI Search Audit**

- **Directory:** `src/sublanding/tools/ai-search-audit/` · **Agent:** one sublanding-page-designer, this page only
- **Concept:** Report first: the page opens on a finished audit of rankbox.xyz (a real run), laid out like a document, with the URL bar as its header. Your URL redraws the document.

| Query | Vol/mo | KD | CPC |
| --- | --- | --- | --- |
| ai search audit | 390 | 16 | $12.32 |

- **Hook:** Free AI search visibility audit: one input bar, an instant citation-readiness report.
- **Build:** Site-level audit: every AI bot's access in robots.txt, llms.txt, sitemap, schema on the home page, then five sampled pages scored with the citation-readiness rules. Uses checkAiReadiness plus the CitationReadinessChecker rules on fetched HTML.
- **Truth:** It measures readiness to be cited, not citations. Say so in the hero subline.
- **Link and differentiate:** /tools/ai-search-readiness-check (the quick one-URL sibling); blog: aeo-audit; blog: ai-seo-checklist-pre-publish-audit

### [ ] /tools/aeo-checker

**AEO Checker**

- **Directory:** `src/sublanding/tools/aeo-checker/` · **Agent:** one sublanding-page-designer, this page only
- **Concept:** An X-ray of one page: your URL loads as a wireframe of its own headings, each lit green, amber or red for how answer-ready the passage under it is.

| Query | Vol/mo | KD | CPC |
| --- | --- | --- | --- |
| aeo checker | 390 | 10 | $6.10 |

- **Hook:** One-click URL check for question headings, answer-ready schema and entity clarity.
- **Build:** Page-level lens: question-style headings, an answer in the first 40–60 words under each, FAQ/HowTo/Article schema, Organization with sameAs, passage length. Fetches the URL; the existing checker only takes pasted text.
- **Truth:** Nothing to correct.
- **Link and differentiate:** /tools/ai-citation-readiness-checker (paste version); /solutions/aeo-tools hero scan

### [ ] /solutions/geo-audit

**GEO Audit**

- **Directory:** `src/sublanding/solutions/geo-audit/` · **Agent:** one sublanding-page-designer, this page only
- **Concept:** A scoreboard: five engine columns side by side, each with its crawler's name, an access verdict and a read verdict. The page is the scoreboard.

| Query | Vol/mo | KD | CPC |
| --- | --- | --- | --- |
| geo audit | 210 | 15 | $6.68 |

- **Hook:** A GEO scorecard across ChatGPT, Perplexity, Claude, Gemini and Copilot.
- **Build:** One column per engine scoring what that engine needs to reach and read you: OAI-SearchBot and GPTBot, PerplexityBot, ClaudeBot and Claude-SearchBot, Google-Extended, Bingbot. Each column ends with that engine's Prompt Kit prompts to check presence by hand.
- **Truth:** The PDF says it benchmarks brand presence. Presence needs tracking, so the v1 scorecard is access and readiness; it upgrades to live presence when tracking ships.
- **Link and differentiate:** /ai-seo/* engine guides; /tools/ai-visibility-prompt-generator

### [ ] /tools/aeo-audit

**AEO Audit**

- **Directory:** `src/sublanding/tools/aeo-audit/` · **Agent:** one sublanding-page-designer, this page only
- **Concept:** A structured-data inspector: your JSON-LD as a tree on the left, the entity card an engine would build from it on the right, gaps marked.

| Query | Vol/mo | KD | CPC |
| --- | --- | --- | --- |
| aeo audit | 50 | 9 | $7.36 |

- **Hook:** A technical answer engine optimization health check: structured data and the entity graph.
- **Build:** Schema lens: JSON-LD parse errors, @types found, Organization / WebSite / sameAs completeness, and a Wikidata lookup for the brand (free public API).
- **Truth:** Nothing to correct.
- **Link and differentiate:** blog: aeo-audit (the method; the tool links to it and back); /tools/schema-generator

### [ ] /solutions/ai-traffic-analytics

**AI Traffic Analytics**

- **Directory:** `src/sublanding/solutions/ai-traffic-analytics/` · **Agent:** one sublanding-page-designer, this page only
- **Concept:** A GA4-style channel table where an "AI assistants" row appears as you tick engines, and the regex builds live underneath, ready to copy.

| Query | Vol/mo | KD | CPC |
| --- | --- | --- | --- |
| ai traffic analytics | 480 | – | – |
| track chatgpt traffic | 320 | – | – |
| chatgpt source tracking tools | 260 | – | – |
| track gemini traffic | 260 | – | – |
| ai traffic analysis | 210 | – | $35.83 |

- **Hook:** Stop letting GA4 hide your AI search traffic.
- **Build:** Free builder: pick engines, get the GA4 channel-group regex and the steps, check it against sample referrers. Then how Rankbox grows that line.
- **Truth:** "Reveal the exact ChatGPT prompts" is impossible for any tool; cut it. GA4 has shipped an AI assistant channel since 2026-05-13, so the page explains what it covers and what it misses instead of saying GA4 hides everything.
- **Link and differentiate:** blog: how-to-measure-ai-referral-traffic-in-ga4; blog: how-to-track-ai-referral-traffic-in-ga4; blog: chatgpt-traffic-analysis

## Phase 2: Category money pages

Large clusters with $15–20 CPCs that describe exactly what Rankbox does.

**Needs:** Dated agency price research for the cost calculator.

### [ ] /solutions/geo-agency-alternative

**GEO agency alternative**

- **Directory:** `src/sublanding/solutions/geo-agency-alternative/` · **Agent:** one sublanding-page-designer, this page only
- **Concept:** A month ledger: a retainer invoice beside a Rankbox month, line by line, with one slider for retainer size.

| Query | Vol/mo | KD | CPC |
| --- | --- | --- | --- |
| generative engine optimization services | 1,900 | – | $18.23 |
| generative engine optimization agency | 1,300 | 25 | $20.51 |
| geo agency | 590 | – | $16.47 |
| how to evaluate generative engine optimization geo agency tech stack | 10 | 0 | – |

- **Hook:** Agency retainer vs software that does the daily work for the plan price.
- **Build:** Concept module: retainer vs Rankbox cost calculator fed by dated, published agency price ranges. Fair section on what agencies do that software doesn't (PR, outreach, strategy), and a "Run an agency? Use Rankbox under your retainer" band linking /use-cases/seo-agencies.
- **Truth:** No "$10,000/mo" unless a dated source says so. No citation tracking claim. Agencies are also Rankbox customers (Studio), so the tone compares jobs, it doesn't mock agencies.
- **Link and differentiate:** /use-cases/seo-agencies

### [ ] /solutions/geo-tools-comparison

**GEO tools comparison**

- **Directory:** `src/sublanding/solutions/geo-tools-comparison/` · **Agent:** one sublanding-page-designer, this page only
- **Concept:** A field guide: a filterable landscape (track, fix, or both × self-serve or sales-led) with each vendor as a dated card. Rankbox is one card among them.

| Query | Vol/mo | KD | CPC |
| --- | --- | --- | --- |
| generative engine optimization tools | 880 | – | $16.05 |
| geo tools | 390 | 20 | $4.89 |
| which other geo tools are like athena | 40 | 0 | – |
| which other geo tools are like scrunch ai | 40 | 0 | – |
| how to evaluate effectiveness of geo tool before purchasing | 40 | 0 | – |
| how is profound different from other geo/aeo tools | 30 | 0 | – |

- **Hook:** A transparent matrix: enterprise-only tools, developer APIs and self-serve platforms, with who sells self-serve and who publishes.
- **Build:** Concept module: a tool finder (track / fix / both, budget, self-serve or sales call). The matrix reads products.ts and starting-price.ts; Rankbox is one row with its real cells.
- **Truth:** Rankbox's tracking cell says No until it ships. Athena and Scrunch facts checked on their own pages that day.
- **Link and differentiate:** /solutions/aeo-tools; blog: geo-tools-list; blog: evaluate-geo-tool-before-purchasing; /compare/profound-vs-peec-ai

### [ ] /solutions/saas-citation-building

**SaaS citation building** · ⚑ Needs your call

- **Directory:** `src/sublanding/solutions/saas-citation-building/` · **Agent:** one sublanding-page-designer, this page only
- **Concept:** Two trails side by side: a guest post nobody quotes, and a reference page that keeps getting cited, drawn as their citations accumulate.

| Query | Vol/mo | KD | CPC |
| --- | --- | --- | --- |
| press release seo | 720 | 28 | $9.50 |
| saas link building | 590 | 19 | $12.46 |

- **Hook:** Stop buying dead backlinks. Build reference pages that earn links and AI citations.
- **Build:** Concept module: guest post vs reference page, side by side, with what each gets cited for. Then the loop.
- **Truth:** Rankbox doesn't produce original benchmark studies or proprietary data; it writes cited articles. Your call needed: the link-building posts deliberately leave out the backlink exchange because they quote Google's link spam policy. Decide whether this page sells the exchange.
- **Link and differentiate:** /features/authority-backlinks; blog: link-building-ai-visibility-co-citation; blog: does-link-building-help-ai-visibility

### [ ] /solutions/agentic-seo

**Agentic SEO**

- **Directory:** `src/sublanding/solutions/agentic-seo/` · **Agent:** one sublanding-page-designer, this page only
- **Concept:** Agent's-eye view: one product page shown twice, as people see it and as the stripped text an agent reads, with a toggle between the two.

| Query | Vol/mo | KD | CPC |
| --- | --- | --- | --- |
| generative engine optimization tool | 210 | 35 | $15.38 |
| agentic seo | 170 | 32 | $7.53 |

- **Hook:** Optimize for the AI agents that research and buy for your customers.
- **Build:** Concept module: the same product page seen by a person and by an agent (what the agent can and can't read). Then the machine-readable checklist and how Rankbox writes for it.
- **Truth:** OpenAI Operator became ChatGPT agent, which is no longer available; Atlas stopped on 2026-08-09 (both verified 2026-09-30). Name agents that are current on the day of writing.
- **Link and differentiate:** blog: what-is-agentic-seo; blog: agentic-seo-autonomous-ai-buyers; blog: prompt-zero-purchase-ai-agents-buy-software

## Phase 3: Alternatives: content & keyword tools

Moz alone is 1,600/mo at $28.75. These buyers already pay for a tool.

**Needs:** Vendor pages checked the day of writing.

### [ ] /alternatives/moz

**Moz alternative** · ⚑ Verify vendor facts

- **Directory:** `src/sublanding/alternatives/moz/` · **Agent:** one sublanding-page-designer, this page only
- **Concept:** A sorting board: Moz Pro's features dealt into "keep a suite for this" and "Rankbox does this", with the DA badge retired.

| Query | Vol/mo | KD | CPC |
| --- | --- | --- | --- |
| moz alternatives | 1,600 | 15 | $28.75 |

- **Hook:** Stop paying to watch DA. Get named in ChatGPT, Perplexity and Claude, with articles published on autopilot.
- **Build:** What Moz still does that Rankbox doesn't (rank tracking, link index, DA), so suite buyers know to keep one; dated Moz prices; switching steps.
- **Truth:** PDF says Moz has zero AI search tracking; check Moz's current product pages before writing. Rankbox has no rank tracker, link index or authority metric.
- **Link and differentiate:** /compare/semrush-vs-ahrefs

### [ ] /alternatives/clearscope

**Clearscope alternative** · ⚑ Verify vendor facts

- **Directory:** `src/sublanding/alternatives/clearscope/` · **Agent:** one sublanding-page-designer, this page only
- **Concept:** One paragraph, two scores: a content-grade dial and a citation-readiness checklist run on the same text, visibly disagreeing.

| Query | Vol/mo | KD | CPC |
| --- | --- | --- | --- |
| clearscope alternatives | 260 | 19 | $20.26 |
| surfer seo vs clearscope | 210 | – | – |
| clearscope alternative | 170 | 0 | $20.26 |

- **Hook:** Stop grading keyword density. Write pages engines can lift an answer from, and publish them.
- **Build:** Both scores run on one paragraph with the real CitationReadinessChecker rules; dated Clearscope prices; a link to the Surfer vs Clearscope head-to-head.
- **Truth:** PDF price range $170–350+ must be re-checked; Clearscope may have added AI search features since.
- **Link and differentiate:** /compare/surfer-seo-vs-clearscope; /alternatives/surfer-seo

### [ ] /alternatives/marketmuse

**MarketMuse alternative** · ⚑ Verify vendor facts

- **Directory:** `src/sublanding/alternatives/marketmuse/` · **Agent:** one sublanding-page-designer, this page only
- **Concept:** A topic model's score bubbles dissolving into the five questions engines actually get asked about that topic.

| Query | Vol/mo | KD | CPC |
| --- | --- | --- | --- |
| marketmuse alternatives | 210 | 11 | – |

- **Hook:** Optimize for what AI engines quote instead of topic-score targets.
- **Build:** Dated MarketMuse plans, what topic modelling is good for, and where Rankbox's question research differs.
- **Truth:** "Vector proximity" isn't something Rankbox measures; don't claim it. MarketMuse was acquired by Siteimprove; check current plans and prices.
- **Link and differentiate:** /alternatives/frase

### [ ] /alternatives/copy-ai

**Copy.ai alternative** · ⚑ Verify vendor facts

- **Directory:** `src/sublanding/alternatives/copy-ai/` · **Agent:** one sublanding-page-designer, this page only
- **Concept:** A blank writing box that fills, then keeps going: sources, a score and a publish step appear, the gap between writing and shipping.

| Query | Vol/mo | KD | CPC |
| --- | --- | --- | --- |
| copy ai alternatives | 210 | 8 | – |

- **Hook:** Beyond a blank-box writer: research, cited drafts and publishing in one loop.
- **Build:** What Copy.ai sells today (checked that day), the gap between writing and publishing, and a fair matrix.
- **Truth:** Copy.ai repositioned toward go-to-market workflows; describe what it sells today.
- **Link and differentiate:** /alternatives/jasper; /alternatives/writesonic

### [ ] /alternatives/ubersuggest

**Ubersuggest alternative** · ⚑ Verify vendor facts

- **Directory:** `src/sublanding/alternatives/ubersuggest/` · **Agent:** one sublanding-page-designer, this page only
- **Concept:** A keyword list that unfolds: each keyword row opens into the AI questions people ask behind it.

| Query | Vol/mo | KD | CPC |
| --- | --- | --- | --- |
| ubersuggest alternatives | 210 | 17 | $9.57 |

- **Hook:** Graduate from keyword lists to answers engines quote.
- **Build:** Plan limits from Ubersuggest's own page, dated; the keyword-to-questions idea run on a sample keyword.
- **Truth:** "Frequent crawler blocks" and "severe data limits" are opinions from the PDF; state plan limits from Ubersuggest's own page instead.

## Phase 4: Alternatives: SEO suites

$13–16 CPCs from teams on enterprise and mid-market suites.

**Needs:** Vendor pages checked the day of writing.

### [ ] /alternatives/brightedge

**BrightEdge alternative** · ⚑ Verify vendor facts

- **Directory:** `src/sublanding/alternatives/brightedge/` · **Agent:** one sublanding-page-designer, this page only
- **Concept:** A procurement memo: requirements down the left, BrightEdge, Conductor and Rankbox answers across, "price on request" shown plainly.

| Query | Vol/mo | KD | CPC |
| --- | --- | --- | --- |
| brightedge competitors | 590 | – | $15.64 |
| brightedge alternatives | 260 | 16 | $13.40 |
| conductor alternatives | 40 | 5 | $8.19 |

- **Hook:** The generative-engine alternative to BrightEdge, self-serve at the plan price. Conductor gets its own section.
- **Build:** The memo with BrightEdge and Conductor columns from their own pages, a Conductor section, and what enterprise suites do that Rankbox doesn't.
- **Truth:** BrightEdge and Conductor both sell AI search features now; don't say they only report blue links. Their prices aren't published: say that, don't print "$40,000/year".

### [ ] /alternatives/spyfu

**SpyFu alternative** · ⚑ Verify vendor facts

- **Directory:** `src/sublanding/alternatives/spyfu/` · **Agent:** one sublanding-page-designer, this page only
- **Concept:** A competitor dossier with two folders: their Google ads, and the sources AI cites for them.

| Query | Vol/mo | KD | CPC |
| --- | --- | --- | --- |
| spyfu alternatives | 590 | 22 | $14.26 |

- **Hook:** From spying on Google Ads to seeing which sites AI engines cite instead of you.
- **Build:** Dossier sections for ads, keywords and AI sources. The PDF's AI competitor gap scanner waits for tracking; v1 links the Prompt Kit.
- **Truth:** Rankbox has no ad or keyword-spy data.

### [ ] /alternatives/se-ranking

**SE Ranking alternative** · ⚑ Verify vendor facts

- **Directory:** `src/sublanding/alternatives/se-ranking/` · **Agent:** one sublanding-page-designer, this page only
- **Concept:** An agency client report: Google positions on top, and the AI search section the client keeps asking about below.

| Query | Vol/mo | KD | CPC |
| --- | --- | --- | --- |
| se ranking alternatives | 70 | 12 | $13.48 |

- **Hook:** For teams whose clients now ask about ChatGPT, not just Google positions.
- **Build:** A fair comparison that includes SE Ranking's own AI tracker, and where Rankbox's writing and publishing loop sits beside it.
- **Truth:** SE Ranking sells an AI results tracker; the PDF's premise that it lacks AI visibility is likely wrong. Check and compare fairly.

### [ ] /alternatives/mangools

**Mangools alternative** · ⚑ Verify vendor facts

- **Directory:** `src/sublanding/alternatives/mangools/` · **Agent:** one sublanding-page-designer, this page only
- **Concept:** A toolbox shelf: each Mangools tool on a shelf with its Rankbox counterpart or a "keep it" tag. Light, friendly, compact.

| Query | Vol/mo | KD | CPC |
| --- | --- | --- | --- |
| mangools alternatives | 170 | 15 | $16.55 |

- **Hook:** The clean, affordable feel of Mangools, aimed at AI answers and publishing.
- **Build:** Tool-by-tool shelf with dated prices. Listed twice in the PDF (under SpyFu and on its own); built once, here.
- **Truth:** Rankbox has no SERP tracker like SERPWatcher.

### [ ] /alternatives/serpstat

**Serpstat alternative** · ⚑ Verify vendor facts

- **Directory:** `src/sublanding/alternatives/serpstat/` · **Agent:** one sublanding-page-designer, this page only
- **Concept:** A migration checklist: export, map, replace, with each Serpstat module ticked or flagged.

| Query | Vol/mo | KD | CPC |
| --- | --- | --- | --- |
| serpstat alternatives | 320 | 3 | – |

- **Hook:** Next-generation AI search alternative to Serpstat.
- **Build:** A module-by-module migration checklist with dated Serpstat prices.
- **Truth:** PDF says "monitor legacy SERPs and AI engines from one platform": Rankbox does neither today. Drop that line.

## Phase 5: Alternatives: audit & reporting tools

Pairs with Phase 1: the free scans are the switching hook.

**Needs:** Vendor pages checked the day of writing.

### [ ] /alternatives/screaming-frog

**Screaming Frog alternative** · ⚑ Verify vendor facts

- **Directory:** `src/sublanding/alternatives/screaming-frog/` · **Agent:** one sublanding-page-designer, this page only
- **Concept:** A desktop crawler window that becomes a cloud check: the AI Search Audit runs live on your URL in a crawler-style table.

| Query | Vol/mo | KD | CPC |
| --- | --- | --- | --- |
| screaming frog alternatives | 170 | 19 | $5.95 |
| contentking alternatives | 50 | 2 | – |

- **Hook:** A cloud check of what AI crawlers can reach, with no desktop crawl. ContentKing gets its own section.
- **Build:** The Phase 1 AI Search Audit runs inside the page; a ContentKing section; what a desktop crawler still does better.
- **Truth:** Screaming Frog can crawl as GPTBot by setting the user agent; don't say it can't simulate AI bots. ContentKing is now part of Conductor.
- **Link and differentiate:** /tools/ai-search-audit; /tools/robots-txt-tester

### [ ] /alternatives/woorank

**WooRank alternative** · ⚑ Verify vendor facts

- **Directory:** `src/sublanding/alternatives/woorank/` · **Agent:** one sublanding-page-designer, this page only
- **Concept:** Two report cards stapled together for the same URL: the HTML audit card and the answer-readiness card.

| Query | Vol/mo | KD | CPC |
| --- | --- | --- | --- |
| woorank alternatives | 320 | 9 | – |

- **Hook:** Move past basic HTML audits to answer readiness.
- **Build:** Both cards for the visitor's URL: WooRank-style HTML checks described, Rankbox's answer-readiness checks run live.
- **Truth:** Drop "vector proximity" and "entity graph completeness" scores; Rankbox doesn't compute them.
- **Link and differentiate:** /tools/aeo-checker

### [ ] /alternatives/seobility

**Seobility alternative** · ⚑ Verify vendor facts

- **Directory:** `src/sublanding/alternatives/seobility/` · **Agent:** one sublanding-page-designer, this page only
- **Concept:** A severity ladder: crawl issues at the bottom, AI access and answer issues at the top, each rung marked with the tools that cover it.

| Query | Vol/mo | KD | CPC |
| --- | --- | --- | --- |
| seobility alternatives | 140 | 15 | $9.92 |

- **Hook:** From crawl checklists to AI crawler access and answer-ready pages.
- **Build:** The ladder, with each tool's coverage taken from its own feature pages.
- **Truth:** "Citation gap analysis" isn't shipped; leave it out.
- **Link and differentiate:** /tools/ai-search-audit

### [ ] /alternatives/agencyanalytics

**AgencyAnalytics alternative** · ⚑ Weak product fit

- **Directory:** `src/sublanding/alternatives/agencyanalytics/` · **Agent:** one sublanding-page-designer, this page only
- **Concept:** A client dashboard with an empty "AI search" widget, and how an agency fills it with Studio and the free scans.

| Query | Vol/mo | KD | CPC |
| --- | --- | --- | --- |
| agencyanalytics alternatives | 480 | 20 | $14.58 |
| whatagraph alternatives | 50 | 0 | $31.72 |

- **Hook:** When clients ask for their AI search report. Whatagraph gets its own section.
- **Build:** The dashboard, a Whatagraph section, and a plain line that Rankbox is not a reporting tool.
- **Truth:** Rankbox has no white-label reporting, share-of-model tracking or AI referral attribution. Weak fit: it doesn't replace a reporting tool.
- **Link and differentiate:** /use-cases/seo-agencies

## Phase 6: Alternatives: GEO trackers

Buyers who already understand GEO. Stronger once tracking ships, workable now with the build-not-track argument.

**Needs:** Vendor pages checked the day of writing. Reads better after the tracking build.

### [ ] /alternatives/peec-ai

**Peec AI alternative** · ⚑ Verify vendor facts

- **Directory:** `src/sublanding/alternatives/peec-ai/` · **Agent:** one sublanding-page-designer, this page only
- **Concept:** A diptych: a tracker chart with a lost prompt on the left, the article that answers it on the right.

| Query | Vol/mo | KD | CPC |
| --- | --- | --- | --- |
| peec ai | 1,600 | – | – |
| peec ai alternatives | 110 | 11 | $21.17 |
| peec ai competitors | 110 | – | $20.80 |

- **Hook:** Don't just watch the gap: publish the reference articles engines cite.
- **Build:** The diptych, plus the "trackers show the gap, Rankbox closes it" argument; dated Peec prices.
- **Truth:** Until tracking ships, Rankbox's tracking row reads No. Check whether Peec now offers content actions before saying it has none.
- **Link and differentiate:** /compare/profound-vs-peec-ai; /solutions/ai-search-visibility

### [ ] /alternatives/profound

**Profound alternative** · ⚑ Verify vendor facts

- **Directory:** `src/sublanding/alternatives/profound/` · **Agent:** one sublanding-page-designer, this page only
- **Concept:** A calendar: weeks of "book a demo" on one side, the first useful day with Rankbox marked on the other.

| Query | Vol/mo | KD | CPC |
| --- | --- | --- | --- |
| best alternatives to profound | 40 | – | – |
| profound alternative | 20 | 0 | $16.76 |
| cheaper alternatives to profound aeo | – | – | – |

- **Hook:** Self-serve GEO: no sales call, start today.
- **Build:** Profound's access model and prices as published (or "on request"), and the first week with Rankbox, day by day.
- **Truth:** PDF says "tracking in 60 seconds" and a "2-day trial": the trial is 7 days and Rankbox doesn't track. Check whether Profound now sells a self-serve tier.
- **Link and differentiate:** /compare/profound-vs-peec-ai

### [ ] /alternatives/scrunch-ai

**Scrunch AI alternative** · ⚑ Verify vendor facts

- **Directory:** `src/sublanding/alternatives/scrunch-ai/` · **Agent:** one sublanding-page-designer, this page only
- **Concept:** A job lens: toggle monitor, optimize or publish and each tool lights up for the jobs it does.

| Query | Vol/mo | KD | CPC |
| --- | --- | --- | --- |
| scrunch ai | 1,900 | – | $14.74 |
| scrunch ai alternatives | 70 | 6 | – |
| which other geo tools are like scrunch ai | 40 | 0 | – |
| are there any other aeo tools like scrunch ai | 20 | 0 | – |

- **Hook:** The self-serve alternative to Scrunch, with publishing on autopilot.
- **Build:** The job lens across Scrunch and Rankbox, with facts dated from Scrunch's own pages.
- **Truth:** Same tracking caveat as Peec.
- **Link and differentiate:** /solutions/geo-tools-comparison

### [ ] /alternatives/otterly-ai

**Otterly AI alternative** · ⚑ Verify vendor facts

- **Directory:** `src/sublanding/alternatives/otterly-ai/` · **Agent:** one sublanding-page-designer, this page only
- **Concept:** An alert feed ("you lost a citation") where each alert carries the action Rankbox takes next.

| Query | Vol/mo | KD | CPC |
| --- | --- | --- | --- |
| otterly ai | 480 | – | – |
| otterly ai alternatives | 50 | 0 | – |

- **Hook:** From monitoring to fixing: Otterly reports who got cited, Rankbox writes the page to take the spot.
- **Build:** The alert feed, with Otterly's current features checked that day.
- **Truth:** Check Otterly's current features; "only reports mentions" may be out of date.

### [ ] /alternatives/ziptie

**Ziptie alternative** · ⚑ Verify vendor facts

- **Directory:** `src/sublanding/alternatives/ziptie/` · **Agent:** one sublanding-page-designer, this page only
- **Concept:** An AI Overview source carousel, with your site sliding into one slot as the page explains how that slot is earned.

| Query | Vol/mo | KD | CPC |
| --- | --- | --- | --- |
| ziptie ai | 50 | 12 | $12.03 |
| ziptie alternatives | 20 | 0 | – |
| ziptie dev | 20 | 0 | – |

- **Hook:** Beyond auditing AI Overviews: publish the reference pages that win citations.
- **Build:** The carousel explainer, with Ziptie's engine coverage checked that day.
- **Truth:** PDF says Ziptie covers only AI Overviews; check, it may track ChatGPT and Perplexity too.

### [ ] /alternatives/brand24

**Brand24 alternative** · ⚑ Verify vendor facts

- **Directory:** `src/sublanding/alternatives/brand24/` · **Agent:** one sublanding-page-designer, this page only
- **Concept:** Two streams: social mentions on one side, an AI answer about the same brand on the other, showing where each tool listens.

| Query | Vol/mo | KD | CPC |
| --- | --- | --- | --- |
| brand24 alternative | 20 | 0 | $10.90 |

- **Hook:** From social listening to shaping what AI answers say.
- **Build:** Listening vs answering, with Brand24's AI features checked that day.
- **Truth:** Brand24 has added AI features; check before saying it can't see AI answers. Rankbox doesn't do social listening.

## Phase 7: Platforms

Magento + BigCommerce is a 6,500/mo cluster; headless CMS fits the API exactly.

**Needs:** Nothing extra. Shopify and Webflow copy follows addonLive.

### [ ] /solutions/magento-ai-seo

**Magento AI SEO**

- **Directory:** `src/sublanding/solutions/magento-ai-seo/` · **Agent:** one sublanding-page-designer, this page only
- **Concept:** A Magento admin with layered navigation, marking the crawl traps AI bots fall into, and an article arriving through the API.

| Query | Vol/mo | KD | CPC |
| --- | --- | --- | --- |
| magento seo | 3,600 | 28 | $25.94 |
| bigcommerce seo | 2,900 | 31 | $9.55 |

- **Hook:** AI search optimization for Adobe Commerce and Magento without custom module work. BigCommerce gets its own section.
- **Build:** Platform scene: Magento admin with a Rankbox article arriving through the API. Checklist: faceted-navigation canonicals, layered nav crawl traps, Product schema, rendering for AI bots.
- **Truth:** No Magento or BigCommerce app exists; articles arrive through the API a developer wires once. No "schema syndication" or "faceted catalog entity mapping" claims.
- **Link and differentiate:** /integrations/api; /use-cases/ecommerce

### [ ] /solutions/headless-cms-seo

**Headless CMS SEO**

- **Directory:** `src/sublanding/solutions/headless-cms-seo/` · **Agent:** one sublanding-page-designer, this page only
- **Concept:** Code and content split: a Next.js/Sanity file tree on the left, the HTML an AI bot actually receives on the right, plus a live llms.txt validator.

| Query | Vol/mo | KD | CPC |
| --- | --- | --- | --- |
| headless cms seo | 720 | 19 | – |

- **Hook:** Turn Sanity, Contentful, Strapi or Next.js into a source AI engines can read and cite.
- **Build:** Platform scene: a Sanity-style studio receiving an article from the pull API. Checklist: server rendering for AI bots (most don't run JavaScript), JSON-LD, llms.txt. Adds a small real llms.txt validator to the free tools.
- **Truth:** The API is pull-based (/articles?since=), not webhooks. Say exactly that.
- **Link and differentiate:** /integrations/api; /tools/llms-txt-generator; blog: dynamic-rendering-prerendering-ai-crawlers

### [ ] /solutions/shopify-ai-seo

**Shopify AI SEO**

- **Directory:** `src/sublanding/solutions/shopify-ai-seo/` · **Agent:** one sublanding-page-designer, this page only
- **Concept:** A phone-sized storefront under a ChatGPT shopping question; the blog post that answers it slides into the store.

| Query | Vol/mo | KD | CPC |
| --- | --- | --- | --- |
| shopify ai seo | 20 | 0 | $8.58 |

- **Hook:** Get your store named when shoppers ask ChatGPT for the best product under a budget.
- **Build:** Platform scene: Shopify admin blog with the article arriving. Status pill follows addonLive (app tested on a dev store, App Store review pending).
- **Truth:** The app publishes blog articles; it doesn't scan the catalog or write product spec pages. Say "in review" until addonLive flips.
- **Link and differentiate:** /integrations/shopify (presents the app as shipped); /use-cases/ecommerce

### [ ] /solutions/webflow-ai-seo

**Webflow AI SEO**

- **Directory:** `src/sublanding/solutions/webflow-ai-seo/` · **Agent:** one sublanding-page-designer, this page only
- **Concept:** The Webflow CMS panel with a collection item appearing, beside a ledger showing your own edits are never overwritten.

| Query | Vol/mo | KD | CPC |
| --- | --- | --- | --- |
| webflow ai seo | 20 | 0 | $14.24 |

- **Hook:** Turn your Webflow CMS into a source AI engines cite.
- **Build:** Platform scene: Webflow CMS collection receiving an item. Status pill follows addonLive (app deployed, Marketplace approval pending).
- **Truth:** The app pushes server-side over OAuth; it isn't a webhook. Items edited in Webflow are never overwritten: a real selling point.
- **Link and differentiate:** /integrations/webflow; /use-cases/saas (Webflow scene)

### [ ] /solutions/hubspot-ai-seo

**HubSpot AI SEO** · ⚑ Weak product fit

- **Directory:** `src/sublanding/solutions/hubspot-ai-seo/` · **Agent:** one sublanding-page-designer, this page only
- **Concept:** A HubSpot blog editor beside a topic-cluster map, with the honest route an article takes to get in (API or paste).

| Query | Vol/mo | KD | CPC |
| --- | --- | --- | --- |
| hubspot ai seo | 20 | 0 | $8.75 |

- **Hook:** Make your HubSpot blog a source AI engines can read and quote.
- **Build:** Platform scene: HubSpot blog editor. Checklist: HubSpot's own AI crawler settings, schema, topic clusters.
- **Truth:** There's no HubSpot integration. Publishing means wiring the API into HubSpot's blog API, or pasting. Weak fit until a HubSpot app exists.
- **Link and differentiate:** /integrations/api

### [ ] /solutions/no-code-ai-seo

**No-code AI SEO**

- **Directory:** `src/sublanding/solutions/no-code-ai-seo/` · **Agent:** one sublanding-page-designer, this page only
- **Concept:** Three device frames for Ghost, Bubble and Notion, each showing what an AI bot can and can't read there.

| Query | Vol/mo | KD | CPC |
| --- | --- | --- | --- |
| notion seo | 40 | 29 | – |
| bubble seo | 20 | 0 | – |
| ghost cms seo | 20 | 0 | – |

- **Hook:** AI search for apps and sites built on Ghost, Bubble and Notion.
- **Build:** Three columns, one per platform, each with what AI bots can and can't read there and how articles get in.
- **Truth:** "Inject server-rendered pages into Bubble without touching your database" isn't real. Ghost has an Admin API (a fit); Bubble and Notion need a developer.
- **Link and differentiate:** /integrations/api

## Phase 8: Engines & entities

Engine and knowledge-graph searchers with real free checks to offer.

**Needs:** Nothing extra.

### [ ] /solutions/searchgpt-seo

**SearchGPT SEO**

- **Directory:** `src/sublanding/solutions/searchgpt-seo/` · **Agent:** one sublanding-page-designer, this page only
- **Concept:** A rename strip (SearchGPT → ChatGPT search) as the hero, then the OAI-SearchBot readability scan.

| Query | Vol/mo | KD | CPC |
| --- | --- | --- | --- |
| searchgpt seo | 170 | 17 | – |
| searchgpt optimization | 50 | 19 | $8.09 |

- **Hook:** Optimize for OpenAI's search, with a free OAI-SearchBot readability scan.
- **Build:** Scan: robots.txt rules for OAI-SearchBot and GPTBot, schema and server-rendered text, using the real robots tester.
- **Truth:** SearchGPT became ChatGPT search in late 2024; keep the query in the H1 and explain the rename in the first paragraph. Drop "vector proximity scoring".
- **Link and differentiate:** /ai-seo/chatgpt (guide hero is frozen; link to it); blog: what-is-oai-searchbot

### [ ] /solutions/grok-ai-seo

**Grok AI SEO**

- **Directory:** `src/sublanding/solutions/grok-ai-seo/` · **Agent:** one sublanding-page-designer, this page only
- **Concept:** A real-time feed: posts streaming into an answer, showing the kinds of sources a real-time engine leans on.

| Query | Vol/mo | KD | CPC |
| --- | --- | --- | --- |
| grok seo | 20 | 0 | – |

- **Hook:** Win citations in Grok's real-time answers.
- **Build:** Facts reuse src/data/ai-seo/content/grok.ts; the page is about what Rankbox does for real-time engines.
- **Truth:** "Grok 2 & 3" is out of date and xAI rebranded to SpaceXAI. No free Grok simulation without API budget. Similar to /ai-seo/grok: give it the commercial angle (what Rankbox does about it).
- **Link and differentiate:** /ai-seo/grok

### [ ] /tools/semantic-seo-tool

**Semantic SEO tool**

- **Directory:** `src/sublanding/tools/semantic-seo-tool/` · **Agent:** one sublanding-page-designer, this page only
- **Concept:** A highlighter: your page's copy with entities underlined by type, each linked in a margin to its Wikidata match.

| Query | Vol/mo | KD | CPC |
| --- | --- | --- | --- |
| what is entity seo | 140 | – | – |
| semantic seo tool | 30 | 0 | $9.69 |

- **Hook:** Entity-first SEO: see the entities a page names and whether engines can connect them to you.
- **Build:** Real free tool: entities in headings and copy, schema @types, sameAs links, and a Wikidata match for the brand.
- **Truth:** PDF route /features/semantic-seo-tool is reserved for shipped Rankbox features, so this uses the PDF's own alternate, /tools/semantic-seo-tool. Nobody can "map your brand into LLM vector databases".
- **Link and differentiate:** blog: entity-seo-strategy; blog: wikidata-seo; glossary entity pages

### [ ] /solutions/knowledge-graph-seo

**Knowledge graph SEO**

- **Directory:** `src/sublanding/solutions/knowledge-graph-seo/` · **Agent:** one sublanding-page-designer, this page only
- **Concept:** A graph you build: add a fact about your brand and a node and edge appear, until the entity is unambiguous.

| Query | Vol/mo | KD | CPC |
| --- | --- | --- | --- |
| knowledge graph seo | 1,300 | 36 | – |
| topical map generator | 50 | 26 | – |
| entity seo tool | 40 | 21 | – |

- **Hook:** Make your brand the unambiguous entity engines connect to your topics.
- **Build:** Concept module: an entity relationship view built from the semantic tool's output plus Rankbox's topic map.
- **Truth:** PDF route /features/entity-seo uses the PDF's alternate, /solutions/knowledge-graph-seo. Google's Knowledge Graph can't be written to; say what influences it.
- **Link and differentiate:** blog: seo-knowledge-graph; blog: knowledge-graph-for-ai; blog: entity-authority-seo

## Phase 9: SaaS & developers

Closest to Rankbox's buyers today. The dev page can use the real llms.txt study data.

**Needs:** Nothing extra.

### [ ] /solutions/ai-seo-for-saas

**AI SEO for SaaS**

- **Directory:** `src/sublanding/solutions/ai-seo-for-saas/` · **Agent:** one sublanding-page-designer, this page only
- **Concept:** A "best X software" answer with five slots, and a walk through what puts a product into each slot.

| Query | Vol/mo | KD | CPC |
| --- | --- | --- | --- |
| ai seo for saas | 30 | 0 | – |

- **Hook:** Win the "best [category] software" answer in ChatGPT.
- **Build:** Angle: the shortlist answer. Comparison, alternatives and pricing-clarity pages that engines quote when buyers ask for the best tool.
- **Truth:** Three SaaS pages plus /use-cases/saas: each needs its own angle (this one = the shortlist).
- **Link and differentiate:** /use-cases/saas; blog: how-saas-companies-use-ai-for-seo-content-creation

### [ ] /solutions/saas-aeo

**SaaS AEO**

- **Directory:** `src/sublanding/solutions/saas-aeo/` · **Agent:** one sublanding-page-designer, this page only
- **Concept:** Docs before and after: a dense docs page transformed, section by section, into answer-ready blocks.

| Query | Vol/mo | KD | CPC |
| --- | --- | --- | --- |
| saas aeo | 40 | 0 | – |
| ai search visibility service | 40 | 0 | – |
| b2b aeo | 10 | 0 | – |

- **Hook:** Win the "best [category] software" answer in ChatGPT and Claude with comparison tables, citable docs and a clear entity.
- **Build:** Angle: answer-engine formatting of product content: docs, integration pages, pricing and changelog that engines can lift answers from.
- **Truth:** No claim that Rankbox builds "entity graphs".
- **Link and differentiate:** /solutions/ai-seo-for-saas; /use-cases/saas

### [ ] /solutions/b2b-saas-content

**B2B SaaS content**

- **Directory:** `src/sublanding/solutions/b2b-saas-content/` · **Agent:** one sublanding-page-designer, this page only
- **Concept:** An inverted funnel: top-of-funnel posts shrinking into AI summaries while bottom-of-funnel assets keep getting cited.

| Query | Vol/mo | KD | CPC |
| --- | --- | --- | --- |
| b2b saas content marketing | 320 | 15 | – |

- **Hook:** Turn your SaaS into the source LLMs cite.
- **Build:** Angle: the content strategy shift from top-of-funnel glossaries (now summarised by AI Overviews) to bottom-of-funnel reference assets.
- **Truth:** "Organic traffic dropping 30–50%" needs a cited study or goes.
- **Link and differentiate:** /solutions/ai-seo-for-saas; /solutions/saas-aeo

### [ ] /solutions/developer-marketing-ai-seo

**Developer marketing AI SEO**

- **Directory:** `src/sublanding/solutions/developer-marketing-ai-seo/` · **Agent:** one sublanding-page-designer, this page only
- **Concept:** An IDE: a coding assistant recommending a library, with docs and llms.txt as the levers and the real llms.txt adoption figures beside it.

| Query | Vol/mo | KD | CPC |
| --- | --- | --- | --- |
| developer marketing agency | 210 | 4 | $13.41 |

- **Hook:** Get your API or SDK recommended inside Cursor, Claude and ChatGPT.
- **Build:** Unique content: the real Phase 3 study (llms.txt adoption is 50% among dev tools), the MCP server, llms.txt and API docs as the levers.
- **Truth:** Rankbox doesn't generate API references or benchmarks; it writes the cited articles around them.
- **Link and differentiate:** /integrations/mcp; blog: state-of-llms-txt-adoption; blog: github-readme-ai-seo

### [ ] /solutions/cybersecurity-ai-seo

**Cybersecurity AI SEO**

- **Directory:** `src/sublanding/solutions/cybersecurity-ai-seo/` · **Agent:** one sublanding-page-designer, this page only
- **Concept:** A CISO's vendor evaluation sheet (controls, certifications, integrations) and the answer an engine assembles from it.

| Query | Vol/mo | KD | CPC |
| --- | --- | --- | --- |
| cybersecurity seo | 590 | 13 | – |
| cyber security seo | 480 | – | – |
| seo for cybersecurity | 320 | – | – |
| seo for cyber security | 110 | – | $18.35 |

- **Hook:** Get your security product into the answer when a CISO asks Perplexity to compare vendors.
- **Build:** Prompt map for security buyers; entity facts that matter (certifications such as SOC 2 and ISO 27001 stated plainly and sourced).
- **Truth:** The PDF's "scan for hallucinated certifications" needs tracking; v1 gives the Prompt Kit preset.

## Phase 10: Commerce & AI agents

1,600 + 1,300 + 880/mo around ChatGPT shopping and checkout.

**Needs:** OpenAI's current shopping and checkout docs checked the day of writing; these change monthly.

### [ ] /solutions/ecommerce-aeo

**E-commerce AEO**

- **Directory:** `src/sublanding/solutions/ecommerce-aeo/` · **Agent:** one sublanding-page-designer, this page only
- **Concept:** An annotated buyer's guide: each annotation names what makes that part of the page quotable.

| Query | Vol/mo | KD | CPC |
| --- | --- | --- | --- |
| ecommerce aeo | 30 | 0 | – |
| ai seo for ecommerce | 30 | 0 | – |
| how to get recommended by chatgpt | 20 | 0 | $5.03 |

- **Hook:** Win product recommendations in ChatGPT and Perplexity with buyer guides and comparison pages built for AI shopping.
- **Build:** Angle: buyer-guide and comparison content for stores. Product schema checklist.
- **Truth:** "Structured product entity mapping" isn't a Rankbox feature; the free schema generator is.
- **Link and differentiate:** /use-cases/ecommerce; /tools/get-recommended-by-chatgpt

### [ ] /solutions/chatgpt-shopping

**ChatGPT shopping** · ⚑ Verify vendor facts

- **Directory:** `src/sublanding/solutions/chatgpt-shopping/` · **Agent:** one sublanding-page-designer, this page only
- **Concept:** A product card from a shopping answer, dissected: title, price, merchant, reviews, and which of them a store controls.

| Query | Vol/mo | KD | CPC |
| --- | --- | --- | --- |
| how to optimize for chatgpt shopping | 50 | 0 | – |
| chatgpt shopping optimization | 10 | 0 | – |

- **Hook:** Get your products recommended in ChatGPT shopping answers.
- **Build:** Angle: the how-to. What ChatGPT's shopping results draw on, per OpenAI's own docs, and what a store controls.
- **Truth:** Drop "vector proximity matching". Similar to /solutions/agentic-commerce: this page is the merchant how-to, that one is the protocol and checkout.
- **Link and differentiate:** /solutions/agentic-commerce

### [ ] /solutions/agentic-commerce

**Agentic commerce** · ⚑ Verify vendor facts

- **Directory:** `src/sublanding/solutions/agentic-commerce/` · **Agent:** one sublanding-page-designer, this page only
- **Concept:** A checkout drawn from the agent's side, step by step, with a readiness checklist against OpenAI's published spec.

| Query | Vol/mo | KD | CPC |
| --- | --- | --- | --- |
| openai instant checkout chatgpt | 1,600 | – | – |
| chatgpt shopping | 1,300 | – | – |
| agentic commerce protocol | 880 | – | $7.95 |

- **Hook:** Prepare your catalog for AI buyers.
- **Build:** Real ACP readiness checklist from OpenAI's published spec, plus the content side Rankbox does.
- **Truth:** Rankbox doesn't integrate ACP or product feeds. Check Instant Checkout's current status first; OpenAI's agent products changed twice in 2026.
- **Link and differentiate:** blog: prompt-zero-purchase-ai-agents-buy-software; /use-cases/ecommerce

## Phase 11: Legal

$73–92 CPCs. Bar advertising rules make each page genuinely different.

**Needs:** Nothing extra. Pages give general information, not legal advice.

### [ ] /solutions/personal-injury-ai-seo

**Personal injury AI SEO**

- **Directory:** `src/sublanding/solutions/personal-injury-ai-seo/` · **Agent:** one sublanding-page-designer, this page only
- **Concept:** A 72-hour timeline after a crash: the questions a victim asks AI at each hour, and where a firm's pages answer them.

| Query | Vol/mo | KD | CPC |
| --- | --- | --- | --- |
| personal injury lawyer marketing | 1,900 | 29 | $91.65 |

- **Hook:** Get cited when accident victims ask ChatGPT who to call, instead of paying hundreds per click.
- **Build:** Prompt map (urgent, compare, choose). Schema: LegalService, Attorney, Person with credentials. Rules: ABA Model Rules 7.1–7.3, state rules on results and "specialist".
- **Truth:** "$800/click" needs a dated source. Verdict pages carry each state's past-results disclaimer.

### [ ] /solutions/family-law-ai-seo

**Family law AI SEO**

- **Directory:** `src/sublanding/solutions/family-law-ai-seo/` · **Agent:** one sublanding-page-designer, this page only
- **Concept:** A quiet reading room with a state picker: the same divorce question answered differently by jurisdiction.

| Query | Vol/mo | KD | CPC |
| --- | --- | --- | --- |
| family law seo | 880 | 19 | $73.53 |

- **Hook:** Be on the shortlist when a spouse researches divorce in ChatGPT before calling anyone.
- **Build:** Angle: private, research-heavy prompts by jurisdiction (equitable distribution, custody factors).
- **Truth:** Content explains the law in general; it never advises a reader.

### [ ] /solutions/criminal-defense-ai-seo

**Criminal defense AI SEO**

- **Directory:** `src/sublanding/solutions/criminal-defense-ai-seo/` · **Agent:** one sublanding-page-designer, this page only
- **Concept:** 2 a.m.: a dark, calm page of the urgent questions after an arrest, and what a firm's page needs to answer them.

| Query | Vol/mo | KD | CPC |
| --- | --- | --- | --- |
| criminal defense seo | 260 | 9 | $79.34 |

- **Hook:** Find out what ChatGPT says when someone asks for the top defense lawyer in your county.
- **Build:** Angle: emergency prompts (arrest, DUI) and white-collar research prompts.
- **Truth:** Same advertising rules as PI; no outcome promises.

### [ ] /solutions/immigration-law-ai-seo

**Immigration law AI SEO**

- **Directory:** `src/sublanding/solutions/immigration-law-ai-seo/` · **Agent:** one sublanding-page-designer, this page only
- **Concept:** A visa explorer: pick O-1, EB-1A, H-1B or L-1 and see the criteria questions founders ask about it.

| Query | Vol/mo | KD | CPC |
| --- | --- | --- | --- |
| immigration lawyer marketing | 390 | 11 | $20.62 |

- **Hook:** Get cited when founders ask how to file an EB-1A or O-1.
- **Build:** Angle: corporate immigration (H-1B, L-1, EB-1, O-1) criteria explainers that engines quote.
- **Truth:** USCIS criteria change; every explainer carries a reviewed-on date.

### [ ] /solutions/legal-ai-seo

**Law firm AI SEO**

- **Directory:** `src/sublanding/solutions/legal-ai-seo/` · **Agent:** one sublanding-page-designer, this page only
- **Concept:** A floor plan of a firm: each practice area a room that opens its AI questions, linking down to the four practice pages.

| Query | Vol/mo | KD | CPC |
| --- | --- | --- | --- |
| how to use ai for your law firm's seo | 30 | 0 | – |
| law firm ai seo | 20 | 0 | – |
| can seo improve a law firm's ai visibility | 10 | 0 | – |

- **Hook:** Protect your practice in AI search.
- **Build:** The hub for the four practice-area pages: what all firms share, and links down to each.
- **Truth:** Rules box generalised across practice areas.
- **Link and differentiate:** the four practice-area pages above

## Phase 12: Home services

HVAC alone is 5,300/mo with a $63 CPC; self-storage is KD 2.

**Needs:** Nothing extra.

### [ ] /solutions/hvac-ai-seo

**HVAC AI SEO**

- **Directory:** `src/sublanding/solutions/hvac-ai-seo/` · **Agent:** one sublanding-page-designer, this page only
- **Concept:** A thermostat dial: drag the outdoor temperature and the questions change from "AC blowing warm" to "furnace won't light".

| Query | Vol/mo | KD | CPC |
| --- | --- | --- | --- |
| hvac marketing agency | 2,400 | 21 | $25.75 |
| plumber marketing | 1,600 | 22 | $25.95 |
| hvac seo agency | 1,300 | 26 | $63.08 |

- **Hook:** HVAC SEO without the agency: get named when the AC dies and someone asks AI who's open now.
- **Build:** Schema: HVACBusiness, Plumber, areaServed, openingHours. Prompt map by season. A free "does AI name you" Prompt Kit preset.
- **Truth:** Siri's local answers come from Apple Maps and its partners; Rankbox can't change them. No "brand certification schemas".
- **Link and differentiate:** /use-cases/local-businesses; blog: local-seo-in-chatgpt

### [ ] /solutions/roofing-ai-seo

**Roofing AI SEO**

- **Directory:** `src/sublanding/solutions/roofing-ai-seo/` · **Agent:** one sublanding-page-designer, this page only
- **Concept:** A material swatch board (TPO, EPDM, metal, tile, shingle); each swatch opens the buyer questions and the specs engines quote.

| Query | Vol/mo | KD | CPC |
| --- | --- | --- | --- |
| roofing seo agency | 720 | 18 | $23.43 |
| commercial roofing marketing (cluster) | 2,400 | – | – |

- **Hook:** Be the contractor AI names for TPO, metal or storm-damage jobs.
- **Build:** Schema: RoofingContractor. Material-by-material topic map (TPO, EPDM, metal, tile, insurance restoration).
- **Truth:** Nothing beyond the house rules.

### [ ] /solutions/solar-ai-seo

**Solar AI SEO**

- **Directory:** `src/sublanding/solutions/solar-ai-seo/` · **Agent:** one sublanding-page-designer, this page only
- **Concept:** A state picker for net metering and incentives, each answer dated, with the questions homeowners ask in that state.

| Query | Vol/mo | KD | CPC |
| --- | --- | --- | --- |
| solar marketing | 880 | 17 | $8.57 |
| solar company seo | 390 | 16 | – |

- **Hook:** Be the installer AI cites when homeowners research going solar.
- **Build:** Angle: policy-heavy questions (net metering by state, incentives) answered with dated sources.
- **Truth:** Incentive and net-metering facts expire; every one is dated. "Utility rebate schemas" don't exist.

### [ ] /solutions/landscaping-ai-seo

**Landscaping AI SEO**

- **Directory:** `src/sublanding/solutions/landscaping-ai-seo/` · **Agent:** one sublanding-page-designer, this page only
- **Concept:** A four-season wheel of commercial contracts (snow, mowing, hardscape, irrigation) with what property managers ask each season.

| Query | Vol/mo | KD | CPC |
| --- | --- | --- | --- |
| landscaping seo | 1,900 | 23 | $13.76 |

- **Hook:** Turn a portfolio of photos into answers that win commercial grounds contracts.
- **Build:** Angle: commercial contracts (HOA, campuses, snow removal) where the buyer asks AI for a shortlist.
- **Truth:** Nothing beyond the house rules.

### [ ] /solutions/self-storage-ai-seo

**Self-storage AI SEO**

- **Directory:** `src/sublanding/solutions/self-storage-ai-seo/` · **Agent:** one sublanding-page-designer, this page only
- **Concept:** The commission calculator is the hero: enter unit rent and aggregator fee, see what a direct renter is worth.

| Query | Vol/mo | KD | CPC |
| --- | --- | --- | --- |
| self storage seo | 390 | 2 | $44.40 |
| self storage marketing agency | 170 | 4 | $42.46 |

- **Hook:** Get renters sent to your site, not an aggregator.
- **Build:** Schema: SelfStorage with amenities. A commission calculator where the operator enters their own rates.
- **Truth:** No aggregator commission figure unless it comes from the aggregator's own published terms.

## Phase 13: Healthcare practices

$21–43 CPCs with low KD; HIPAA and board rules give each page real substance.

**Needs:** Nothing extra.

### [ ] /solutions/aesthetic-ai-seo

**Plastic surgery & med spa AI SEO**

- **Directory:** `src/sublanding/solutions/aesthetic-ai-seo/` · **Agent:** one sublanding-page-designer, this page only
- **Concept:** A procedure menu card (rhinoplasty, Morpheus8, fillers): each item shows the patient questions and the rules on photos and claims.

| Query | Vol/mo | KD | CPC |
| --- | --- | --- | --- |
| plastic surgery seo | 2,400 | 21 | $21.42 |
| medspa seo | 480 | 13 | $23.85 |

- **Hook:** Be the practice AI names for a procedure in your city.
- **Build:** Schema: MedicalClinic, Physician with hasCredential. Rules: HIPAA authorization for photos and testimonials, FTC health claims, state board rules on before-and-after images.
- **Truth:** "Apple Intelligence recommends your practice" can't be promised.

### [ ] /solutions/dso-ai-seo

**DSO AI SEO**

- **Directory:** `src/sublanding/solutions/dso-ai-seo/` · **Agent:** one sublanding-page-designer, this page only
- **Concept:** A grid of practice cards whose hours, insurance and dentists drift out of sync, then snap back once the facts are published.

| Query | Vol/mo | KD | CPC |
| --- | --- | --- | --- |
| dental seo agency | 2,400 | 33 | $26.02 |
| dso marketing | 320 | 7 | $10.50 |

- **Hook:** Keep 50 practices' insurance networks, hours and dentists straight in AI answers.
- **Build:** Schema: Dentist per location, accepted insurance stated in plain text. Studio pricing per site, shown honestly.
- **Truth:** Rankbox doesn't sync data to engines; it publishes pages engines read.

### [ ] /solutions/chiropractic-ai-seo

**Chiropractic AI SEO**

- **Directory:** `src/sublanding/solutions/chiropractic-ai-seo/` · **Agent:** one sublanding-page-designer, this page only
- **Concept:** A body map: tap a pain area to see the condition questions patients ask AI, with claims kept inside FTC rules.

| Query | Vol/mo | KD | CPC |
| --- | --- | --- | --- |
| chiropractic seo | 1,900 | 25 | $24.34 |

- **Hook:** Be the specialist AI names for a condition, not just a clinic on a map.
- **Build:** Angle: condition-specific prompts (sciatica, decompression) with FTC-safe claims.
- **Truth:** Treatment claims need evidence; the rules box says what can't be claimed.

### [ ] /solutions/orthodontist-ai-seo

**Orthodontist AI SEO**

- **Directory:** `src/sublanding/solutions/orthodontist-ai-seo/` · **Agent:** one sublanding-page-designer, this page only
- **Concept:** A decision tree a parent walks (age, bite, budget, aligners or braces) with the questions at each branch.

| Query | Vol/mo | KD | CPC |
| --- | --- | --- | --- |
| orthodontist seo | 590 | 14 | $28.89 |

- **Hook:** Get cited when parents ask AI which aligner fits and who offers it nearby.
- **Build:** Angle: treatment-comparison prompts (aligners vs braces) answered neutrally.
- **Truth:** Aligner brand names are trademarks; compare without implying endorsement.

### [ ] /solutions/veterinary-ai-seo

**Veterinary AI SEO**

- **Directory:** `src/sublanding/solutions/veterinary-ai-seo/` · **Agent:** one sublanding-page-designer, this page only
- **Concept:** A 24-hour emergency clock: what pet owners ask at each hour, and the opening-hours facts engines need.

| Query | Vol/mo | KD | CPC |
| --- | --- | --- | --- |
| veterinary seo | 590 | 6 | $43.49 |

- **Hook:** Be the clinic AI names in an emergency.
- **Build:** Schema: VeterinaryCare with openingHours and emergency services. Emergency and specialty prompt map.
- **Truth:** Siri and Maps answers aren't Rankbox's to change.

## Phase 14: Behavioral health & life sciences

Rehab is the PDF's $50 CPC; FDA and LegitScript rules shape what can be said.

**Needs:** Nothing extra. Highest-care copy on the site.

### [ ] /solutions/therapy-ai-seo

**Therapy practice AI SEO**

- **Directory:** `src/sublanding/solutions/therapy-ai-seo/` · **Agent:** one sublanding-page-designer, this page only
- **Concept:** A calm, low-contrast directory of modalities (EMDR, CBT, couples, ADHD) in plain words, ethics rules up front, nothing salesy.

| Query | Vol/mo | KD | CPC |
| --- | --- | --- | --- |
| therapist seo | 1,300 | 27 | $16.02 |

- **Hook:** Help people find the right care when they ask AI.
- **Build:** Angle: modality and specialization pages (EMDR, ADHD, couples) and insurance networks in plain text.
- **Truth:** APA and ACA ethics codes restrict soliciting client testimonials; the page must not suggest reviews from clients.

### [ ] /solutions/rehab-ai-seo

**Addiction treatment AI SEO**

- **Directory:** `src/sublanding/solutions/rehab-ai-seo/` · **Agent:** one sublanding-page-designer, this page only
- **Concept:** A family's question journey from first worry to admission, with accreditation and insurance facts as checkable cards.

| Query | Vol/mo | KD | CPC |
| --- | --- | --- | --- |
| addiction treatment marketing | 1,000 | 16 | – |
| rehab seo | 480 | 20 | $50.00 |

- **Hook:** Be accurately represented when families ask AI for treatment options.
- **Build:** Rules: LegitScript certification for ads, patient-brokering law (EKRA), SAMHSA resources. Accreditation (CARF, Joint Commission) stated with sources.
- **Truth:** Highest-care page on the site: no outcome claims and no urgency tactics.

### [ ] /solutions/concierge-medicine-ai-seo

**Concierge medicine AI SEO**

- **Directory:** `src/sublanding/solutions/concierge-medicine-ai-seo/` · **Agent:** one sublanding-page-designer, this page only
- **Concept:** A membership card, with the executive-health questions and the credential facts engines look for.

| Query | Vol/mo | KD | CPC |
| --- | --- | --- | --- |
| concierge medicine marketing | 260 | 9 | $8.45 |

- **Hook:** Be the physician AI names when executives ask for concierge care nearby.
- **Build:** Schema: Physician with hospital affiliation and credentials.
- **Truth:** Nothing beyond the house rules.

### [ ] /solutions/biotech-ai-seo

**Biotech & pharma AI SEO**

- **Directory:** `src/sublanding/solutions/biotech-ai-seo/` · **Agent:** one sublanding-page-designer, this page only
- **Concept:** A regulatory traffic light: what a page can say pre-approval, on-label, and never, each with its FDA source.

| Query | Vol/mo | KD | CPC |
| --- | --- | --- | --- |
| pharma seo | 390 | 14 | – |
| biotech seo | 260 | 8 | – |
| medical device seo | 260 | 10 | – |

- **Hook:** Get accurate retrieval of your clinical data, devices and papers in AI answers.
- **Build:** Rules: FDA promotional rules (OPDP), no off-label claims, fair balance.
- **Truth:** Similar to medtech: this page is pharma and biotech brands, medtech is device and CRO commercial teams.
- **Link and differentiate:** /solutions/medtech-ai-seo

### [ ] /solutions/medtech-ai-seo

**Medtech AI SEO**

- **Directory:** `src/sublanding/solutions/medtech-ai-seo/` · **Agent:** one sublanding-page-designer, this page only
- **Concept:** A 510(k) record turned into a readable product page: clearance number, indication and device class laid out for engines.

| Query | Vol/mo | KD | CPC |
| --- | --- | --- | --- |
| medtech marketing agency | 480 | 16 | $15.68 |
| cro marketing agency | 260 | 16 | – |

- **Hook:** Find out whether AI cites your 510(k) clearances and publications.
- **Build:** Angle: procurement and trial-sponsor prompts; clearances stated with FDA database links.
- **Truth:** The PDF's clinical retrieval audit needs tracking; v1 is the Prompt Kit preset.
- **Link and differentiate:** /solutions/biotech-ai-seo

## Phase 15: Finance

Private equity is KD 1 at $56.90; SEC, FINRA and Reg D rules are the differentiator.

**Needs:** Nothing extra.

### [ ] /solutions/fintech-ai-seo

**Fintech AI SEO**

- **Directory:** `src/sublanding/solutions/fintech-ai-seo/` · **Agent:** one sublanding-page-designer, this page only
- **Concept:** A B2B buyer's comparison table (fees, limits, licences, integrations) and the answer an engine builds from it, with fictional products.

| Query | Vol/mo | KD | CPC |
| --- | --- | --- | --- |
| fintech seo | 1,300 | 18 | $12.17 |
| seo for the finance industry | 390 | – | $19.21 |
| seo for fintech | 320 | – | – |
| fintech seo services | 210 | – | – |

- **Hook:** Win citations when B2B buyers ask AI for financial tools.
- **Build:** Angle: B2B buyer prompts (alternatives to a named tool, best for a team size). Yield and rate claims follow the regulators' rules.
- **Truth:** Named rivals in examples (Brex, Ramp) are real companies; use fictional ones.

### [ ] /solutions/insurance-ai-seo

**Insurance AI SEO**

- **Directory:** `src/sublanding/solutions/insurance-ai-seo/` · **Agent:** one sublanding-page-designer, this page only
- **Concept:** A coverage-line selector (cyber, general liability, E&O, workers' comp) with the business-owner questions for each.

| Query | Vol/mo | KD | CPC |
| --- | --- | --- | --- |
| insurance seo | 1,000 | 12 | $11.04 |
| insurance agency seo | 720 | 6 | $13.21 |

- **Hook:** Be the agency AI recommends for commercial coverage questions.
- **Build:** Schema: InsuranceAgency. Rules: state insurance advertising rules (NAIC model).
- **Truth:** Nothing beyond the house rules.

### [ ] /solutions/financial-advisor-ai-seo

**Financial advisor AI SEO**

- **Directory:** `src/sublanding/solutions/financial-advisor-ai-seo/` · **Agent:** one sublanding-page-designer, this page only
- **Concept:** Fee-only vs commission as a card pair, and a "near me" answer showing which advisor facts it pulls.

| Query | Vol/mo | KD | CPC |
| --- | --- | --- | --- |
| financial advisor seo | 480 | 18 | $22.07 |
| cpa seo | 260 | 14 | $14.34 |
| wealth management seo | 140 | 15 | – |

- **Hook:** Get your firm named when clients ask AI for a fee-only fiduciary nearby.
- **Build:** Angle: individual advisors and CPAs in local prompts. Rules: SEC Marketing Rule 206(4)-1, FINRA 2210, AICPA advertising.
- **Truth:** Similar to wealth management: this page is the advisor or CPA, that one is the firm's brand.
- **Link and differentiate:** /solutions/wealth-management-ai-seo

### [ ] /solutions/wealth-management-ai-seo

**Wealth management AI SEO**

- **Directory:** `src/sublanding/solutions/wealth-management-ai-seo/` · **Agent:** one sublanding-page-designer, this page only
- **Concept:** A liquidity-event timeline (offer, sale, close, after) with the planning questions clients ask at each stage.

| Query | Vol/mo | KD | CPC |
| --- | --- | --- | --- |
| wealth management marketing | 390 | 5 | $10.63 |

- **Hook:** Be the firm AI quotes on liquidity events and estate planning.
- **Build:** Angle: firm-level thought leadership for RIAs and multi-family offices.
- **Truth:** Performance and testimonial rules under the SEC Marketing Rule.
- **Link and differentiate:** /solutions/financial-advisor-ai-seo

### [ ] /solutions/private-equity-ai-seo

**Private equity AI SEO**

- **Directory:** `src/sublanding/solutions/private-equity-ai-seo/` · **Agent:** one sublanding-page-designer, this page only
- **Concept:** A founder's exit questions by sector, with the Reg D guardrail pinned beside them.

| Query | Vol/mo | KD | CPC |
| --- | --- | --- | --- |
| private equity marketing | 390 | 1 | $56.90 |

- **Hook:** Win inbound deal flow when founders ask AI which funds back businesses like theirs.
- **Build:** Angle: deal-flow prompts from founders and M&A advisors. Rules: Reg D 506(b) vs 506(c) general solicitation; the page markets to sellers, never to investors.
- **Truth:** Fund-marketing rules are the reason this page needs care; say it up front.

## Phase 16: Multi-location & local

Franchise and automotive are 4,300 and 5,500/mo clusters.

**Needs:** A decision on how per-site pricing reads to 300-location brands.

### [ ] /solutions/franchise-ai-seo

**Franchise AI SEO** · ⚑ Needs your call

- **Directory:** `src/sublanding/solutions/franchise-ai-seo/` · **Agent:** one sublanding-page-designer, this page only
- **Concept:** A table of twelve locations whose facts drift (hours, phone, services), what an AI answer gets wrong, and how brand pages fix it.

| Query | Vol/mo | KD | CPC |
| --- | --- | --- | --- |
| franchise seo | 2,400 | 30 | $24.91 |
| multi location seo | 1,900 | 26 | $11.46 |

- **Hook:** Keep every location cited accurately across AI answers.
- **Build:** Angle: brand-level content and location facts. Pricing reality: Rankbox is priced per site, not per location.
- **Truth:** "50 to 5,000+ locations" overstates fit. Your call: how per-site pricing should read to multi-location brands.
- **Link and differentiate:** /use-cases/local-businesses

### [ ] /solutions/automotive-ai-seo

**Automotive AI SEO**

- **Directory:** `src/sublanding/solutions/automotive-ai-seo/` · **Agent:** one sublanding-page-designer, this page only
- **Concept:** A showroom selector (certified pre-owned, EV, service) with the buyer questions and the dealership facts engines need.

| Query | Vol/mo | KD | CPC |
| --- | --- | --- | --- |
| automotive seo | 3,600 | 20 | $9.96 |
| car dealership seo | 1,900 | 17 | $18.32 |

- **Hook:** Get your dealership named when buyers ask AI where to buy.
- **Build:** Schema: AutoDealer, Vehicle. Prompt map for CPO, EV and service.
- **Truth:** Rankbox doesn't handle inventory feeds or VIN-level data; drop those claims.

### [ ] /solutions/hotel-ai-seo

**Hotel AI SEO**

- **Directory:** `src/sublanding/solutions/hotel-ai-seo/` · **Agent:** one sublanding-page-designer, this page only
- **Concept:** An itinerary-style travel conversation where the hotel appears as a stop, with the amenity facts that put it there.

| Query | Vol/mo | KD | CPC |
| --- | --- | --- | --- |
| travel seo | 2,400 | 22 | – |
| hotel seo | 1,900 | 27 | $7.18 |

- **Hook:** Win direct bookings from conversational travel planning.
- **Build:** Schema: Hotel / LodgingBusiness with amenityFeature. Destination-guide topic map.
- **Truth:** OTA commission figures need a source.

### [ ] /solutions/local-ai-seo

**Local AI SEO**

- **Directory:** `src/sublanding/solutions/local-ai-seo/` · **Agent:** one sublanding-page-designer, this page only
- **Concept:** A neighbourhood map with business pins, each opening its industry page.

| Query | Vol/mo | KD | CPC |
| --- | --- | --- | --- |
| how ai helps small businesses with local seo | 90 | 0 | – |
| does ai help with local seo for small businesses | 70 | 0 | – |
| can ai seo tools help with local seo optimization | 20 | 0 | – |
| local ai seo | 10 | 0 | – |

- **Hook:** Local generative engine optimization for regional and multi-location services.
- **Build:** The hub for local verticals; links down to the industry pages.
- **Truth:** Similar to /use-cases/local-businesses and the local-SEO posts; this one is the commercial solution page.
- **Link and differentiate:** /use-cases/local-businesses; blog: how-ai-helps-small-businesses-with-local-seo; blog: local-seo-in-chatgpt

### [ ] /solutions/franchise-development-ai-seo

**Franchise development AI SEO**

- **Directory:** `src/sublanding/solutions/franchise-development-ai-seo/` · **Agent:** one sublanding-page-designer, this page only
- **Concept:** The FDD rule laid out plainly: Item 19, and what can and can't be said outside it.

| Query | Vol/mo | KD | CPC |
| --- | --- | --- | --- |
| franchise development marketing | 260 | 16 | $19.90 |

- **Hook:** Be the brand AI names when investors research franchise opportunities.
- **Build:** Rules: the FTC Franchise Rule allows financial performance representations only through Item 19 of the FDD. That rule shapes every page.
- **Truth:** The PDF's "format Item 19 into structured data" must stay inside the FTC rule; no earnings claims outside the FDD.
- **Link and differentiate:** /solutions/franchise-ai-seo

## Phase 17: B2B services & education

Manufacturing is a $33 CPC with no software ranking; MSP's top result says SEO isn't worth it.

**Needs:** Nothing extra.

### [ ] /solutions/manufacturing-ai-seo

**Manufacturing AI SEO**

- **Directory:** `src/sublanding/solutions/manufacturing-ai-seo/` · **Agent:** one sublanding-page-designer, this page only
- **Concept:** An RFQ spec sheet (material, tolerance, certifications, volume) that turns into a quotable capability page.

| Query | Vol/mo | KD | CPC |
| --- | --- | --- | --- |
| manufacturing seo | 1,900 | 31 | $33.12 |
| industrial seo | 1,300 | 19 | $20.64 |

- **Hook:** Get your facility cited during AI-assisted RFQ discovery.
- **Build:** Angle: capability, tolerance and certification pages (ISO 9001, AS9100) written as plain, quotable facts.
- **Truth:** Nothing beyond the house rules.

### [ ] /solutions/msp-ai-seo

**MSP AI SEO**

- **Directory:** `src/sublanding/solutions/msp-ai-seo/` · **Agent:** one sublanding-page-designer, this page only
- **Concept:** An incident-response timeline after a breach: what a CTO asks AI at each step and the compliance facts that answer.

| Query | Vol/mo | KD | CPC |
| --- | --- | --- | --- |
| msp marketing agency | 1,000 | 16 | $14.04 |
| msp seo | 720 | 18 | $11.55 |

- **Hook:** Why traditional SEO failed MSPs, and how answer engines win contracts.
- **Build:** Angle: compliance-led prompts (HIPAA, CMMC, SOC 2) from buyers after an incident or audit.
- **Truth:** Nothing beyond the house rules.

### [ ] /solutions/executive-search-ai-seo

**Executive search AI SEO**

- **Directory:** `src/sublanding/solutions/executive-search-ai-seo/` · **Agent:** one sublanding-page-designer, this page only
- **Concept:** A board briefing document, with the market questions boards ask AI before a search.

| Query | Vol/mo | KD | CPC |
| --- | --- | --- | --- |
| executive search marketing | 590 | 12 | $5.45 |

- **Hook:** Be the firm AI names for C-suite searches in your niche.
- **Build:** Angle: market-intelligence content (compensation, governance) boards and VCs quote.
- **Truth:** Compensation data must be sourced.

### [ ] /solutions/private-school-ai-seo

**Private school AI SEO**

- **Directory:** `src/sublanding/solutions/private-school-ai-seo/` · **Agent:** one sublanding-page-designer, this page only
- **Concept:** An admissions calendar (open house, applications, decisions) with the parent questions in each month.

| Query | Vol/mo | KD | CPC |
| --- | --- | --- | --- |
| private school marketing | 480 | 18 | $6.44 |
| private school seo | 170 | 1 | – |
| independent school marketing | 170 | 6 | – |

- **Hook:** Find out whether ChatGPT names your school when parents ask.
- **Build:** Schema: School / EducationalOrganization. Admissions prompt map.
- **Truth:** Nothing beyond the house rules.

## Phase 18: Real estate & built environment

Architect SEO is 1,600/mo at KD 1.

**Needs:** Nothing extra. Fair Housing rules apply.

### [ ] /solutions/architecture-ai-seo

**Architecture AI SEO**

- **Directory:** `src/sublanding/solutions/architecture-ai-seo/` · **Agent:** one sublanding-page-designer, this page only
- **Concept:** A project photo with a readable caption layer sliding over it: typology, area, awards and materials as text.

| Query | Vol/mo | KD | CPC |
| --- | --- | --- | --- |
| architect seo | 1,600 | 1 | – |
| construction seo | 1,600 | 27 | $12.21 |

- **Hook:** Turn a visual portfolio into text engines can cite.
- **Build:** Angle: project pages with typology, awards and specs as text, because engines can't read the photos.
- **Truth:** Nothing beyond the house rules.

### [ ] /solutions/commercial-real-estate-ai-seo

**Commercial real estate AI SEO**

- **Directory:** `src/sublanding/solutions/commercial-real-estate-ai-seo/` · **Agent:** one sublanding-page-designer, this page only
- **Concept:** An offering memorandum PDF unfolding, section by section, into a structured listing page.

| Query | Vol/mo | KD | CPC |
| --- | --- | --- | --- |
| commercial real estate marketing | 720 | 7 | $5.55 |

- **Hook:** Make listings and market reports discoverable in AI search.
- **Build:** Angle: PDF offering memorandums turned into readable building specs and market pages.
- **Truth:** Nothing beyond the house rules.

### [ ] /solutions/real-estate-ai-seo

**Real estate AI SEO**

- **Directory:** `src/sublanding/solutions/real-estate-ai-seo/` · **Agent:** one sublanding-page-designer, this page only
- **Concept:** A neighbourhood guide with a Fair Housing phrasing check beside each paragraph.

| Query | Vol/mo | KD | CPC |
| --- | --- | --- | --- |
| real estate ai seo | 20 | 0 | – |
| ai seo for real estate | – | – | – |

- **Hook:** Be the agent AI recommends in your market.
- **Build:** Rules: Fair Housing Act advertising (no preference language), state license disclosures. Schema: RealEstateAgent.
- **Truth:** Neighbourhood content must follow Fair Housing; the rules box is required.

## Phase 19: Alternatives: off-category

$25–34 CPCs, but these tools do a different job. Lowest product fit in the PDF.

**Needs:** Your call on whether to build them.

### [ ] /alternatives/yext

**Yext alternative** · ⚑ Weak product fit

- **Directory:** `src/sublanding/alternatives/yext/` · **Agent:** one sublanding-page-designer, this page only
- **Concept:** A coverage map in two layers: listing directories, and the pages AI answers quote; shows which layer each tool works on.

| Query | Vol/mo | KD | CPC |
| --- | --- | --- | --- |
| yext alternatives | 260 | 16 | $33.88 |
| brightlocal alternatives | 90 | 7 | $14.28 |

- **Hook:** The AI search half that listing sync doesn't cover. BrightLocal gets its own section.
- **Build:** Honest framing: keep a listings tool for listings; Rankbox for the pages engines quote.
- **Truth:** Rankbox doesn't sync listings. "80% of citations ignored" needs a source or goes.

### [ ] /alternatives/podium

**Podium alternative** · ⚑ Weak product fit

- **Directory:** `src/sublanding/alternatives/podium/` · **Agent:** one sublanding-page-designer, this page only
- **Concept:** A review stream beside an AI summary of the same business: what the summary keeps and what it drops.

| Query | Vol/mo | KD | CPC |
| --- | --- | --- | --- |
| podium alternatives | 210 | 15 | $31.55 |
| birdeye alternatives | 110 | 17 | $25.33 |

- **Hook:** Beyond star ratings: how AI reads your reputation. Birdeye gets its own section.
- **Build:** Honest framing: keep a review tool for reviews, Rankbox for the pages AI summaries draw on. A Birdeye section.
- **Truth:** Rankbox doesn't collect reviews or send SMS. No "sentiment engineering".

### [ ] /alternatives/cognism

**Cognism alternative** · ⚑ Weak product fit

- **Directory:** `src/sublanding/alternatives/cognism/` · **Agent:** one sublanding-page-designer, this page only
- **Concept:** A budget slider between outbound data and inbound content, with what each side buys.

| Query | Vol/mo | KD | CPC |
| --- | --- | --- | --- |
| cognism alternatives | 140 | 14 | $29.14 |
| seamless ai alternatives | 90 | 6 | $20.08 |

- **Hook:** From cold outbound to inbound from AI search. Seamless.AI gets its own section.
- **Build:** Honest framing: a budget shift, not a feature swap. A Seamless.AI section.
- **Truth:** Rankbox has no contact data. A visitor wanting a data tool should leave knowing that.

## Phase 20: Refresh the live alternatives

Frase, Surfer and Jasper pages exist. Add the PDF's angles and re-check prices (due quarterly).

**Needs:** Nothing extra.

### [ ] /alternatives/frase

**Frase alternative** · live today, rebuilt

- **Directory:** `src/sublanding/alternatives/frase/` · **Agent:** one sublanding-page-designer, this page only
- **Concept:** A conveyor from brief to published: Frase's brief at one end, a cited, live article at the other, each step labelled with who does it.

| Query | Vol/mo | KD | CPC |
| --- | --- | --- | --- |
| frase alternatives | 210 | 14 | – |
| frase alternative | 170 | 16 | – |

- **Hook:** From manual briefs to publishing on autopilot.
- **Build:** Rebuilt as its own page at the same route (today it uses the shared /alternatives template): the PDF angle, re-checked prices.
- **Truth:** Frase sells AI search tracking now; the matrix must show it.
- **Link and differentiate:** blog: frase-alternatives

### [ ] /alternatives/surfer-seo

**Surfer SEO alternative** · live today, rebuilt

- **Directory:** `src/sublanding/alternatives/surfer-seo/` · **Agent:** one sublanding-page-designer, this page only
- **Concept:** Two receipts: the cost of one article on each tool, from both price pages, with content score vs citation readiness beneath.

| Query | Vol/mo | KD | CPC |
| --- | --- | --- | --- |
| surfer seo alternatives | 880 | 21 | $10.72 |

- **Hook:** Beyond keyword density.
- **Build:** Rebuilt as its own page at the same route: a per-article cost comparison from both price pages, re-checked prices.
- **Truth:** The PDF's "$29/article on Surfer" must come from Surfer's current price page. Surfer tracks AI citations.
- **Link and differentiate:** blog: surfer-seo-alternatives; /compare/surfer-seo-vs-clearscope

### [ ] /alternatives/jasper

**Jasper alternative** · live today, rebuilt

- **Directory:** `src/sublanding/alternatives/jasper/` · **Agent:** one sublanding-page-designer, this page only
- **Concept:** A brand-voice document, then what happens after the draft: sources, score, publish.

| Query | Vol/mo | KD | CPC |
| --- | --- | --- | --- |
| jasper alternatives | 260 | 26 | $8.31 |
| jasper ai alternatives | 260 | 17 | $4.89 |

- **Hook:** Don't just generate text; get it published and cited.
- **Build:** Rebuilt as its own page at the same route: the PDF angle, re-checked prices.
- **Truth:** Jasper tracks AI citations now; keep the matrix fair.
- **Link and differentiate:** blog: jasper-alternatives

## Phase 21: Tracking I: engine trackers

The PDF's Tier 1 "instant wins" (KD 0). They need a tracker to exist first.

**Needs:** Citation tracking shipped: API keys and a monthly budget for each engine, plus a scheduler.

### [ ] /solutions/chatgpt-brand-tracking

**ChatGPT brand tracking** · ⚑ Needs citation tracking

- **Directory:** `src/sublanding/solutions/chatgpt-brand-tracking/` · **Agent:** one sublanding-page-designer, this page only
- **Concept:** A ChatGPT answer with competitor names highlighted and your brand's slot shown empty or filled.

| Query | Vol/mo | KD | CPC |
| --- | --- | --- | --- |
| chatgpt brand tracking | 90 | 3 | – |

- **Hook:** Is ChatGPT recommending your competitors?
- **Build:** Live brand recommendation check.
- **Truth:** API answers differ from the ChatGPT app; the page says which one it measures.
- **Link and differentiate:** blog: monitor-brand-mentions-in-chatgpt

### [ ] /tools/perplexity-rank-tracker

**Perplexity rank tracker** · ⚑ Needs citation tracking

- **Directory:** `src/sublanding/tools/perplexity-rank-tracker/` · **Agent:** one sublanding-page-designer, this page only
- **Concept:** Perplexity's numbered source pills as the hero, with your domain located among them.

| Query | Vol/mo | KD | CPC |
| --- | --- | --- | --- |
| perplexity rank tracker | 300 | 0 | – |
| track perplexity rankings | – | – | – |

- **Hook:** See whether Perplexity cites you for your buyers' questions.
- **Build:** Free check on /tools, full tracking in the product.
- **Truth:** Check the Perplexity API's status first; Sonar support changed in September 2026.
- **Link and differentiate:** /ai-seo/perplexity; blog: track-brand-mentions-in-perplexity

### [ ] /tools/claude-rank-tracker

**Claude rank tracker** · ⚑ Needs citation tracking

- **Directory:** `src/sublanding/tools/claude-rank-tracker/` · **Agent:** one sublanding-page-designer, this page only
- **Concept:** A Claude web-search answer with its source list, and a run-history strip beneath.

| Query | Vol/mo | KD | CPC |
| --- | --- | --- | --- |
| claude rank tracker | 140 | 0 | – |

- **Hook:** Check Claude's web-search presence for your category.
- **Build:** Free check via the Anthropic API with web search.
- **Truth:** "Claude 3.5/3.7" is out of date; name current models on the day.
- **Link and differentiate:** /ai-seo/claude

### [ ] /tools/gemini-rank-tracker

**Gemini rank tracker** · ⚑ Needs citation tracking

- **Directory:** `src/sublanding/tools/gemini-rank-tracker/` · **Agent:** one sublanding-page-designer, this page only
- **Concept:** Grounding sources as a stack of cards behind a Gemini answer.

| Query | Vol/mo | KD | CPC |
| --- | --- | --- | --- |
| gemini rank tracker | 70 | 0 | – |

- **Hook:** Track the sources Gemini and Google's AI answers ground on.
- **Build:** Could ship early as a real free check: the unused Gemini key supports Google Search grounding. Needs your OK on API spend.
- **Truth:** Gemini API grounding is not the same as AI Overviews; say which is measured.
- **Link and differentiate:** /ai-seo/gemini

### [ ] /solutions/llm-rank-tracker

**LLM rank tracker** · ⚑ Needs citation tracking

- **Directory:** `src/sublanding/solutions/llm-rank-tracker/` · **Agent:** one sublanding-page-designer, this page only
- **Concept:** A heatmap of prompts × engines × days.

| Query | Vol/mo | KD | CPC |
| --- | --- | --- | --- |
| llm rank tracker | 390 | 27 | $13.74 |

- **Hook:** Daily automated prompt testing across engines.
- **Build:** Multi-model dashboard preview from real runs.
- **Truth:** Ships with the tracker.
- **Link and differentiate:** blog: chatgpt-rank-tracker

## Phase 22: Tracking II: citations, prompts & AI Overviews

AI Overview tracking alone is a 3,500/mo cluster.

**Needs:** Phase 21's engine, plus a SERP API key for AI Overviews.

### [ ] /solutions/ai-citation-tracker

**AI citation tracker** · ⚑ Needs citation tracking

- **Directory:** `src/sublanding/solutions/ai-citation-tracker/` · **Agent:** one sublanding-page-designer, this page only
- **Concept:** An alert timeline: citations gained, lost and replaced, each with the competitor URL that took the spot.

| Query | Vol/mo | KD | CPC |
| --- | --- | --- | --- |
| ai citation tracker | 120 | 0 | $4.13 |
| perplexity citation tracker | – | – | – |

- **Hook:** Get an alert when a competitor replaces your link.
- **Build:** Citation-loss alerts from tracked runs.
- **Truth:** Ships with the tracker.
- **Link and differentiate:** /features/citation-tracking

### [ ] /solutions/ai-overview-tracker

**AI Overview tracker** · ⚑ Needs citation tracking

- **Directory:** `src/sublanding/solutions/ai-overview-tracker/` · **Agent:** one sublanding-page-designer, this page only
- **Concept:** A results page with an AI Overview and its source carousel, tracked over weeks as a strip.

| Query | Vol/mo | KD | CPC |
| --- | --- | --- | --- |
| ai search tracker | 1,000 | – | $14.23 |
| ai overview tracking | 880 | – | $10.20 |
| ai overview checker | 880 | – | $4.77 |
| ai overview tracker | 590 | 23 | $10.20 |
| how to track ai overviews | 480 | – | $11.30 |

- **Hook:** Know when Google's AI summarises your queries and who it cites.
- **Build:** Free check of the top AI Overview citation gaps, then continuous tracking.
- **Truth:** Needs a SERP API; "real-time" means per run.
- **Link and differentiate:** blog: how-to-show-up-in-google-ai-overviews

### [ ] /solutions/ai-prompt-tracking

**AI prompt tracking** · ⚑ Needs citation tracking

- **Directory:** `src/sublanding/solutions/ai-prompt-tracking/` · **Agent:** one sublanding-page-designer, this page only
- **Concept:** A prompt library grouped by buyer stage, each prompt with its appearance rate.

| Query | Vol/mo | KD | CPC |
| --- | --- | --- | --- |
| prompt tracking | 70 | 19 | $6.60 |
| ai prompt tracking | 50 | 0 | $10.38 |
| llm prompt monitoring | 50 | 20 | – |

- **Hook:** Find the questions buyers ask AI about your category, and whether you're in the answer.
- **Build:** Prompt simulator: category in, buyer prompts out (real today via the Prompt Kit), then tracked.
- **Truth:** Nobody can see what people actually type into ChatGPT; prompts are modelled. Say so.
- **Link and differentiate:** /tools/ai-visibility-prompt-generator; /tools/ai-question-generator

### [ ] /tools/citation-gap-analysis

**Citation gap analysis** · ⚑ Needs citation tracking

- **Directory:** `src/sublanding/tools/citation-gap-analysis/` · **Agent:** one sublanding-page-designer, this page only
- **Concept:** Three sets of cited sources (yours, competitors', the gap) as a sortable list.

| Query | Vol/mo | KD | CPC |
| --- | --- | --- | --- |
| llm citation tracking | 140 | 5 | – |
| citation gap analysis | 70 | 5 | – |
| chatgpt citation tracker | 50 | 0 | – |

- **Hook:** The content-gap report for AI search: what's cited for rivals but not for you.
- **Build:** Your domain vs three competitors.
- **Truth:** Ships with the tracker.
- **Link and differentiate:** blog: how-to-benchmark-ai-citations-against-competitors

### [ ] /tools/ai-source-inspector

**AI source inspector** · ⚑ Needs citation tracking

- **Directory:** `src/sublanding/tools/ai-source-inspector/` · **Agent:** one sublanding-page-designer, this page only
- **Concept:** A source graph: domains as nodes sized by how often engines cite them in your category.

| Query | Vol/mo | KD | CPC |
| --- | --- | --- | --- |
| ai visibility tracking | 720 | – | $12.42 |
| track ai results | 320 | 0 | – |
| how do you track visibility in llm results | 30 | 0 | – |

- **Hook:** See which sources AI engines lean on for your competitors.
- **Build:** Source graph from tracked citations.
- **Truth:** Ships with the tracker.

## Phase 23: Brand & AI search console

1,600/mo × 3 at $14–19 CPC: the biggest cluster in the PDF.

**Needs:** Phase 21's engine.

### [ ] /solutions/ai-search-console

**AI search console** · ⚑ Needs citation tracking

- **Directory:** `src/sublanding/solutions/ai-search-console/` · **Agent:** one sublanding-page-designer, this page only
- **Concept:** A Search Console-style chart with an AI tab, explaining what Google's generative AI report shows and what it doesn't.

| Query | Vol/mo | KD | CPC |
| --- | --- | --- | --- |
| how to track ai mode in google search console | 40 | – | – |
| ai search console | 20 | 0 | – |
| does google search console show ai overviews data | 10 | – | – |

- **Hook:** The Search Console for AI answers.
- **Build:** Listed twice in the PDF (/solutions and /tools); built once, at /solutions.
- **Truth:** Search Console rolled out a generative AI report on 2026-08-31, so the PDF's "GSC hides it all" is out of date; explain what it shows (impressions only).

### [ ] /solutions/ai-brand-visibility

**AI brand visibility** · ⚑ Needs citation tracking

- **Directory:** `src/sublanding/solutions/ai-brand-visibility/` · **Agent:** one sublanding-page-designer, this page only
- **Concept:** A share-of-voice ring: your brand against three competitors across engines, from real runs.

| Query | Vol/mo | KD | CPC |
| --- | --- | --- | --- |
| llm visibility tool | 1,600 | – | $19.11 |
| ai brand visibility tool | 1,600 | – | $14.33 |
| ai visibility platform | 1,600 | – | $18.55 |
| track chatgpt mentions | 390 | 0 | – |
| how to monitor if ai answer engines recommend my brand | 320 | – | – |

- **Hook:** Brand vs top three competitors across ChatGPT, Claude and Perplexity.
- **Build:** Live 10-prompt audit.
- **Truth:** Close to /solutions/ai-search-visibility; this one is the monitoring side.
- **Link and differentiate:** /solutions/ai-search-visibility

### [ ] /solutions/llm-reputation-management

**LLM reputation management** · ⚑ Needs citation tracking

- **Directory:** `src/sublanding/solutions/llm-reputation-management/` · **Agent:** one sublanding-page-designer, this page only
- **Concept:** A fact sheet with a wrong claim struck through, the source that caused it, and the page that corrects it.

| Query | Vol/mo | KD | CPC |
| --- | --- | --- | --- |
| ai reputation management | 320 | 26 | $14.48 |
| llm reputation management | 20 | 0 | – |

- **Hook:** Find and correct what AI says about your brand.
- **Build:** Detection needs tracking; the correction half (fact pages, sources) is real today.
- **Truth:** No "automated corrective citation syndication".
- **Link and differentiate:** blog: how-to-fix-incorrect-brand-facts-in-llm-citations; blog: brand-sentiment-chatgpt
