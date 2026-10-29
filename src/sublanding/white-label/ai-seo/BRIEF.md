# /white-label/ai-seo — brief

Facts checked 2026-10-29. Route `src/routes/white-label.ai-seo.tsx`, directory `src/sublanding/white-label/ai-seo/`. Group: job.

## The page's one job

**Visitor.** Someone who runs an SEO agency, a web studio or a freelance practice. A client has asked "why doesn't ChatGPT recommend us?" and they searched **white label ai seo** (or "white label geo", "white label generative engine optimization", "white label aeo services") to find something to sell in reply. The search results they see are fulfilment shops that do the work for a cut and send an agency-branded "AI visibility report".

**What they want next.** A clear picture of what an AI search service line contains, who does each part, how to explain it to a client without overpromising, and how to report on it. Then a way to start.

**The job.** Make the agency confident it can sell AI search (GEO) as its own monthly deliverable, run on Rankbox behind the scenes, with reporting it can stand behind. Then start Studio (`startStudioSignup()`).

**Primary query.** `white label ai seo`. No Semrush numbers were available to this agent, so the pick is on fit: it matches the route, it's the plainest wording, and the brief lists it first. "white label geo", "white label generative engine optimization" and "white label aeo services" go in `keywords` and the FAQ answers GEO vs AEO.

## Concept

**"The scope you send back."** The client's question arrives as an email (hero, sample). The page answers it with the deliverable itself: a one-page scope of an AI search retainer from a fictional agency (Brindlework) to a fictional client (Plotbright, a garden-planning app, `plotbright.example`).

**Focal visual: the scope sheet with a two-way switch.** "Your client's copy" shows the sheet the way the client reads it: the agency's name, nine lines in client language, no Rankbox. "Who does each line" flips every line to the behind-the-scenes version: who runs it (Rankbox, a free tool, your team, the client's developer) and how. A thin bar in the header colours each line by who does it, and the summary is computed from the rows. It makes the white-label idea concrete and keeps the honest part visible: Rankbox runs the research, the writing and the scoring; the prompt checks, the analytics and the report stay with the agency, because Rankbox doesn't track citations.

Everything else on the page serves the scope: a live check to run its first line on a prospect, answers for the client meeting, where each report number comes from, and what to set per engine.

## Section plan

| #   | id        | H2                                                           | The visitor must understand or do                                                                                                                                                                                                                                                    |
| --- | --------- | ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 0   | top       | (H1) Sell white label AI SEO to clients asking about ChatGPT | What white label AI SEO is, in one plain paragraph (the answer near the top), and the one action: start Studio. A sample client email states the hook.                                                                                                                               |
| 1   | scope     | One AI search retainer, line by line                         | The deliverable, line by line, and who does each line. Focal visual: the scope sheet with the switch.                                                                                                                                                                                |
| 2   | prospect  | Check a prospect's site before the pitch                     | The first line of the scope runs here, live (`checkAiReadiness`), on any URL: score, which AI search crawlers robots.txt blocks, the worst failures as pitch openings. Loading, error, empty and success states.                                                                     |
| 3   | explain   | How to explain AI search to a client                         | Five client questions with answers they can use in a meeting, each tied to a primary source (OpenAI, SparkToro, Google). No guarantee language.                                                                                                                                      |
| 4   | reporting | Reporting without a citation tracker                         | Rankbox doesn't track citations. The report comes from Search Console's generative AI view, Bing Webmaster Tools' AI Performance, GA4's AI Assistant channel, and a manual prompt check. A planner works out how many answers the team reads a month from the visitor's own numbers. |
| 5   | engines   | Engine notes for client sites                                | One line per engine: the crawler to let in and what the vendor shows the site owner, linking each /ai-seo guide instead of restating it.                                                                                                                                             |
| 6   | more      | More for agencies selling AI search                          | Up to the hub, across to content writing and pricing, out to /ai-seo, /solutions/autonomous-geo and /features/answer-space-research.                                                                                                                                                 |
| 7   | faq       | White label AI SEO questions                                 | Seven questions of its own (none from the hub), also in FAQPage JSON-LD.                                                                                                                                                                                                             |
| 8   | start     | Put AI search on your next proposal                          | Start Studio. Trial terms from facts. Per-client maths deferred to /white-label/pricing.                                                                                                                                                                                             |

## Research notes (all read 2026-10-29)

- **OpenAI crawlers.** https://developers.openai.com/api/docs/bots. OAI-SearchBot surfaces sites in ChatGPT search: "Sites that are opted out of OAI-SearchBot will not be shown in ChatGPT search answers, though can still appear as navigational links." GPTBot is training; ChatGPT-User is user-initiated. robots.txt changes take about 24 hours.
- **Anthropic crawlers.** https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler. Claude-SearchBot improves search results; blocking it "may reduce your site's visibility and accuracy in user search results". ClaudeBot is training, Claude-User is user-initiated.
- **Perplexity crawlers.** https://docs.perplexity.ai/guides/bots. "PerplexityBot is designed to surface and link websites in search results on Perplexity." Perplexity-User "generally ignores robots.txt rules".
- **Google-Extended.** https://developers.google.com/search/docs/crawling-indexing/google-common-crawlers. "Google-Extended does not impact a site's inclusion in Google Search" and isn't a ranking signal. It controls Gemini training and grounding in Gemini Apps.
- **Google AI features.** https://developers.google.com/search/docs/appearance/ai-features (page updated 2025-12-10). A page "must be indexed and eligible to be shown in Google Search with a snippet"; "There are no additional technical requirements"; "You don't need to create new machine readable files, AI text files, or markup to appear in these features."
- **Search Console generative AI reports.** https://developers.google.com/search/blog/2026/06/gen-ai-performance-reports. Published 3 June 2026; impressions in AI Overviews, AI Mode and Discover's generative AI features; "As of August 31, 2026, we've rolled out these insights to all websites worldwide."
- **Bing AI Performance.** https://blogs.bing.com/webmaster/February-2026/Introducing-AI-Performance-in-Bing-Webmaster-Tools-Public-Preview. Public preview, 10 February 2026. Total citations, cited pages, a sample of grounding queries, across Copilot, AI summaries in Bing and select partners.
- **Copilot and Bing's index.** https://about.ads.microsoft.com/en/blog/post/october-2025/optimizing-your-content-for-inclusion-in-ai-search-answers (8 October 2025): "Powered by Bing's search index, experiences like Microsoft Copilot…". The crawler is Bingbot. The repo's Copilot guide (checked October 2026) agrees.
- **GA4 AI Assistant channel.** Definition: https://support.google.com/analytics/answer/9756891. It names ChatGPT, Gemini, DeepSeek, Copilot and Grok and "excludes Google's AI Overviews and AI Mode". Release note: https://support.google.com/analytics/answer/9164320, 13 May 2026, naming ChatGPT, Gemini and Claude. Neither names Perplexity.
- **Answer variance.** https://sparktoro.com/blog/new-research-ais-are-highly-inconsistent-when-recommending-brands-or-products-marketers-should-take-care-when-tracking-ai-visibility/ (28 January 2026, SparkToro with Gumshoe): "<1 in 100 chance that ChatGPT or Google's AI, if asked 100X, will give you the same list of brands in any two responses". 600 volunteers, 12 prompts, 2,961 runs.
- **Publisher citation reports from OpenAI, Anthropic, Perplexity.** None found (web search 2026-10-29; third-party trackers only). The page says "none of the three offers site owners a citation report" with the date.
- **Market scan (context only, no vendor named on the page).** Wildnet's white label AI SEO page lists audit, keyword research, content optimisation, GEO, AEO, technical SEO, entity work and "AI SEO Reporting & Performance Monitoring". A Searchless article (dev.to, June 2026) describes white-label GEO as citation audits, monitoring and agency-branded reports. Its price tiers cite no source, so the page doesn't use them. This is why the page opens with "audit, content, report" and shows what each becomes on Rankbox.
- **Product facts.** These come from facts.ts, pricing.ts, SHIPPED, features.ts and tools.ts. Studio is a site per client at `STUDIO.monthlyPerSite`. `PLAN.articlesPerMonth` articles a site. SEO and GEO scores. Demand figures are AI estimates (`RANKBOX_CELLS.keywordData`). Publishing goes through the API while every add-on is `addonLive: false`; the sentence is derived from `LIVE_ADDONS`. There's no citation tracking, one login, and no branded reports. The free tools used are ai-search-readiness-check, robots-txt-tester, ai-citation-readiness-checker and ai-visibility-prompt-generator (the prompt kit has a built-in scorecard).

## Truth lines kept

- No citation, mention or ranking tracking. Reporting is manual prompt checks, the free tools, Search Console, Bing Webmaster Tools and GA4.
- No guaranteed citations, said plainly in the scope, the meeting answers and the FAQ.
- The agency sells its own service and the content. No "resell Rankbox", "reseller" or "sublicense" wording, and clients never get Rankbox access.
- No "one-click". Publishing runs through the API until an add-on's `addonLive` flips, and the line is derived from facts.
- No branded reports, client logins or custom dashboard domain. The report is the agency's own document.
- Autopilot is described as "on a schedule you set", up to `PLAN.articlesPerMonth`, never as daily unattended publishing.

## How this page differs

- **/white-label (hub).** The hub owns the programme: who it's for, the operating model, the byline story, onboarding steps, billing and what isn't white-label. This page doesn't explain Studio's mechanics or billing beyond one FAQ and the closing line. Its visual is a scope of work, not a byline swap.
- **/white-label/content-writing.** That page owns the article production line and article anatomy. Here the articles are one line of the scope ("Answer articles") with a link across.
- **/white-label/pricing.** That page owns the money maths. This page's only calculator counts answers and hours for the manual prompt check, never dollars.
- **/ai-seo and the engine guides.** One row per engine (crawler and owner report), then a link to the guide. Nothing about how each engine ranks sources is restated.
- **/solutions/autonomous-geo.** That page is for a single site owner: "where tools stop" and a sample month of articles. This one is for agencies selling a service. It avoids that page's Google "no additional requirements to appear" quote and quotes a different line from the same doc.
- **/features/answer-space-research.** Named only as the "question map" line, in new words, with a link.

## Sample names

Brindlework (agency) comes from the role's examples. Plotbright (client) is on the brief's web-checked list. The domain is `plotbright.example`. The sheet and the email are labelled "Sample".
