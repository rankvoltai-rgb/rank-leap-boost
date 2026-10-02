# /solutions/autonomous-geo — brief

## The page's one job

The visitor searched **"ai search optimization tools"** (1,600/mo, $17.53 CPC), or a neighbour in the
cluster: "llm seo tool" (1,000), "ai visibility tracker" (880), "ai rank tracking" (590). The SERP on
2026-10-02 is wall-to-wall listicles of trackers and suites. They've seen a dozen dashboards. Most of
those tools end the same way: a report, a score or a list of things for _them_ to do.

The job: make it clear in five seconds that Rankbox is the kind of AI search optimization tool that
**does the work the others point to**, show what "done" means, be straight about what it doesn't do
(it doesn't track), and get them to plan their first month (free).

What they want next: to see their own first month planned. That's what the CTA does
(`startSignup(url)` → onboarding, whose last step is literally titled "Your first month of content").

## Concept

**"The same 30 days, two endings."** Sharpened from the roadmap's "Two Mondays".

One focal visual in the hero: a month ledger for a fictional invoicing app (Tallyfold,
`tallyfold.example`). Thirty rows, one per day. A single segmented switch flips it:

- **Homework**: each row is a to-do item, phrased the way an audit export or a tracker's
  recommendations read ("Not named · Write a comparison for “best invoicing app for freelancers”").
  Empty checkboxes. "30 items on your list."
- **Done**: the _same rows_ become the articles Rankbox wrote and delivered that day. Blue checks.
  A 30-tick strip fills left to right. "30 answers, written and delivered."

The number stays 30 in both states. Only the owner changes. That is the whole argument, in one
gesture. The questions are the constant: both kinds of tool find the gaps; only one closes them.

Why it beats the roadmap's version: the roadmap had a 50-row checklist against 30 articles. A 1:1
morph of the _same_ rows makes the switch mean something, and it never claims how much of the list a
person would finish (no invented completion rate, no hour estimates).

## Section plan

| #   | Section                 | H2                                                          | What the visitor must take away                                                                                                                                                                                                                                                                                          |
| --- | ----------------------- | ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 0   | Hero + the month switch | (H1) The AI search optimization tool that does the homework | What it is, the idea, one action: plan my first month. Flipping the switch is the "aha".                                                                                                                                                                                                                                 |
| 1   | `stops`                 | Where each kind of tool stops                               | The category in one calm chart: trackers measure, suites find gaps, graders check drafts, Rankbox runs from question to delivered article, and has no bar under "measure". Then an H3 straight answer for the tracker queries: Rankbox doesn't track; here are trackers (named, sourced, dated) and the free prompt kit. |
| 2   | `finished`              | What a finished answer looks like                           | The quality bar. One sample article with five margin notes: answer first, takeaways, sources cited, FAQ, checked then delivered.                                                                                                                                                                                         |
| 3   | `yours`                 | The homework that's still yours                             | The honest payoff to the metaphor: a 3-item list (let AI crawlers in, connect your site once, read what you like). Echoes the hero's checklist.                                                                                                                                                                          |
| 4   | `hand-over`             | Hand over the homework                                      | Price, plan, trial terms from facts.ts, one blue CTA, link to /pricing.                                                                                                                                                                                                                                                  |
| 5   | `faq`                   | Before you hand it over                                     | FAQ for the cluster: what an AI search optimization tool is, what an LLM SEO tool is, tracking (no), autonomous GEO, CMS publishing (API today), suites, cost.                                                                                                                                                           |
| –   | ExploreMore             | (from the link graph)                                       | Internal links, once the main session places the page in TOPICS.                                                                                                                                                                                                                                                         |

## Design notes

- Light page under the blue sticky navbar. No PixelField, no blue hero chassis (the other two
  /solutions pages and /pricing use it). Calm, near-monochrome, blue spent on the switch's selected
  state, the Done checks, the strip, Rankbox's bar and the CTAs.
- Type: semibold display, tight tracking; mono for dates (the ledger reads like a log).
- Motion: rows cross-fade top to bottom on flip (~30 ms stagger), strip ticks fill left to right,
  chart bars draw once on view. All of it off under `prefers-reduced-motion`.
- 400px: the ledger header stacks, rows wrap to two lines with a fixed min-height so flipping never
  jumps the layout; the chart's column labels collapse into a numbered legend.

## Truth (what this page must and must not say)

- **No tracking claims.** `SHIPPED.citationTracking` is false. The tracker queries are answered with
  "Rankbox doesn't track AI visibility or rankings yet" and pointers to trackers and the free kit.
- **Publishing** = the publishing API today, via `PUBLISHING_TODAY` from facts.ts. Note: that
  sentence says plugins for Shopify, WordPress, Webflow, Square and Framer "are in development". The
  roadmap's Truth line says the Shopify and Webflow apps are "in review"; memory says their store
  submissions are still pending. The page uses the canonical sentence, so it updates when
  `addonLive` flips.
- **Cadence**: "up to one a day, on the cadence you set" (`RANKBOX_CELLS.autopilot`). 30 a month is
  `PLAN.articlesPerMonth`. The onboarding plan caps at 30 gap questions (`MAX_ARTICLES`), each one a
  question "the site doesn't cover" — that is what "questions your site doesn't answer yet" rests on.
- **The writer** (src/lib/article.server.ts): research of the live top-ranking pages, a direct
  2–3 sentence answer up top, key takeaways, cited sources, an FAQ, then optimize passes against the
  deterministic SEO checks. Prod runs one pass (memory), so the page says "checked and redrafted
  where it fails", never "until it scores 100".
- **No approval mode** exists in code. The page says articles sit in the editor where any section can
  be rewritten (rewrites aren't metered, `RANKBOX_CELLS.rewrites`) and autopilot can be paused.
- **Demand figures are AI estimates**, not a keyword database (`RANKBOX_CELLS.keywordData`), so the
  suites FAQ says keep the suite for data.
- No testimonials, logos, ratings, counts or results. Sample data uses a fictional brand and an
  `.example` domain and is labelled "sample".
- Price and trial from facts.ts only. A card is taken when the trial starts.

## Research (checked 2026-10-02)

| Fact                                                                                                                                                                                                                              | Source                                                           |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| Semrush AI Visibility Toolkit "shows you how brands appear in AI-generated answers" and "generates actionable recommendations to refine your brand's positioning"; tracks prompts "on platforms like Google AI Mode and ChatGPT". | https://www.semrush.com/kb/1493-ai-visibility-toolkit            |
| Ahrefs Brand Radar: "Track and grow your brand's visibility across AI answers, YouTube, and Reddit."                                                                                                                              | https://ahrefs.com/brand-radar                                   |
| Surfer AI Tracker: "See exactly how Gemini, ChatGPT, Google AI Overviews, AI Mode, and Perplexity talk about your brand"; section "Find & Fix Mention Gaps".                                                                      | https://surferseo.com/ai-tracker/                                |
| Google: "There are no additional requirements to appear in AI Overviews or AI Mode" and "The best practices for SEO remain relevant for AI features in Google Search" (page last updated 2025-12-10).                             | https://developers.google.com/search/docs/appearance/ai-features |
| OpenAI: "Sites that are opted out of OAI-SearchBot will not be shown in ChatGPT search answers, though can still appear as navigational links."                                                                                   | https://developers.openai.com/api/docs/bots                      |
| SERP for "ai search optimization tools": HubSpot, eesel, Mangools, Whatagraph, Profound, Semrush, ZipTie listicles and guides. Informational/commercial mix.                                                                      | Web search, 2026-10-02                                           |

Vendor facts are limited to what each product says it is for, in its own words. No vendor prices
(the blog post and /solutions/aeo-tools carry dated prices), and nothing says a vendor "can't" do
something. The category chart describes each kind of tool by its _main_ job and says so.

## How it differs from its neighbours

- **/solutions/aeo-tools** — blue hero with a live AEO scanner, a toolbox of free tools sorted by
  job, a vendor landscape with prices, an autopilot stat grid. This page has no tool directory, no
  prices for vendors, no scanner; its centrepiece is the month switch.
- **/solutions/ai-search-visibility** — blue hero with a citation X-ray, a four-gate lab, a two-column
  tracker vs Rankbox table, a vertical numbered loop beside a Rank panel, three "measure free" cards.
  This page has no gates, no two-column table, no numbered loop, no Rank panel; the tracker answer is
  a short H3 under a category chart, and it names suite trackers (Semrush, Ahrefs, Surfer), not
  Peec AI/Profound.
- **/features/auto-publishing** — the feature template (old way vs new way cards, benefits bento,
  steps). This page links to it but doesn't describe integrations; it states the API truth once.
- **Blog: /blog/ai-search-optimization-tools** — the informational guide (six types, dated prices,
  a 100-point scorecard). This page is the commercial answer and links there for the full breakdown.

Copy was written fresh; no headings or phrasing taken from those pages.
