# /white-label: the white-label program hub

Route `/white-label` (route id `/white-label/`, file `src/routes/white-label.index.tsx`). Group: hub. Facts checked 2026-10-29.

## The page's one job

An agency owner searched **"white label seo platform"** (or "white label seo software", "white label content platform") and wants to know, quickly, whether they can deliver SEO work to clients under their own name with this tool, what their clients will and won't see, and how running a book of clients actually works. What they want next: start a Studio account, or go deeper on one job (content production, AI search as a service line, or the pricing maths).

The page's job is to make the program legible in depth, honestly, so the agency can decide in one read and then either sign up (landing on Studio) or open the right deep dive.

## Query choice

Researched 2026-10-29 with WebSearch on all five candidates:

- "white label seo program" and "white label seo for agencies": the results are fulfillment and reseller services (Agency Platform, Semify, Ranked, Vendasta, LinkGraph) that do audits, local SEO, link building and reports for you. Wrong intent for Rankbox, and "reseller" framing breaks the Terms. Rejected.
- "white label seo software" and "white label seo platform": the results are tools. Most are reporting dashboards with the agency's logo and domain (SE Ranking, AgencyAnalytics, Vendasta, WebCEO). Rankbox is a tool, so the intent ("a platform I run under my brand") fits, as long as the page says plainly that it covers the content side of SEO and has no branded reports or client logins.
- "white label content platform": the closest product fit, but the results are mixed (ContentStudio, WriterAccess, Cloud Campaign) and it sits next to the content-writing page's "white label content writing".

**Primary: "white label seo platform".** Keywords also carry "white label seo software", "white label content platform" and "white label seo for agencies". No volume data was available to this agent; the choice is on intent. The scope line ("content side of SEO; no technical audits, local listings, outreach link building, client logins or branded reports") sits in the plain-text answer under the hero and again in the fit and gaps sections.

## Concept

**Two sides of one piece of work.** Everything the agency does sits on one side of a line, everything Rankbox does sits behind it, and the page keeps showing where that line is: in the hero (your Studio vs the client's live post), in the ledger (your column vs Rankbox's), and in the client's journey (where the Rankbox name could show up: one place, the integrations settings).

The old page's substance is kept and taken further:

- the BylineSwap idea becomes the hero's focal visual, rebuilt on tokens with `.example` domains;
- the "what isn't white-label yet" block becomes a full section with what agencies do instead of each missing piece;
- the four onboarding steps become a nine-step runbook (two once, seven per client) the visitor can copy into their own project tool;
- the FAQ facts are kept and rewritten, with new questions on disclosure, link rules between sites, and working without a developer.

**Focal visual per section:** hero, the two-sided byline swap; split, a ledger with a seam; journey, a touchpoint timeline with a "Rankbox visible" badge per step and a derived count; Studio, an interactive dashboard diorama (pick a site, the address bar's `?site=` and the per-site panel change, account-wide items stay put); onboarding, the copyable runbook. The rest stay typographic and calm.

## Section plan, in order

1. **Hero.** H1 with the query, one sentence of what the program is, one action (Start your Studio, via `startStudioSignup`), a text link to the gaps. The trial note says the trial covers one site and client sites open once the plan is paid. Under it, the plain-text answer (quotable, with the scope line) and an "on this page" row of anchors.
2. **Who it's for.** SEO agencies, web design studios adding content to care plans, freelancers with several clients, in-house teams with several brands: what each sells and where Rankbox sits. Then "not the right fit if" for full-service SEO needs, so a mismatched visitor leaves early and correctly.
3. **What you sell, what Rankbox does.** The ledger: seven stages (relationship, strategy, writing, quality, delivery, reporting, billing), your side vs Rankbox's. The visitor should understand the agency keeps the client and the editorial call.
4. **The client's side, start to finish.** Six touchpoints from kickoff to a client leaving, each with who's involved, what they see, and whether the Rankbox name is visible. The count is derived from the data.
5. **One account, a site per client.** The operating model: per-site (brand, voice, plan, pace, credits, keys) vs account-wide (login, Studio, Plan & Billing, Account), credits never move, and the two rules that follow the owner (no exchange links between your own sites, one Reddit reply per thread).
6. **Adding a new client.** The runbook, with the real UI labels (Start paid plan now, Add a site, Pick the searches to win, Review & add site) and who does each step (you, Rankbox, the client's developer). Copy as a checklist, with copied and failed states.
7. **The controls you keep.** Six levers, program-level only (voice, what gets written, editor, score, sign-off at the destination, pace and pause), plus the responsibility line from Rankbox's Terms §5 and Google's guidance. Production detail is left to /white-label/content-writing.
8. **What isn't white-label yet.** Client logins and seats, branded reports and custom domain, tracking, the Rankbox-named connection, CMS apps awaiting approval, full-service SEO. Each with what to do instead.
9. **Billing, in brief.** The per-site price, one invoice, proration, removal, no minimum, Studio needs a paid plan. Links to /white-label/pricing for the maths and /pricing for the plan.
10. **Three deep dives.** Cards to /white-label/content-writing, /white-label/ai-seo, /white-label/pricing, each with the questions it answers.
11. **FAQ.** Ten questions, visible as `<details>` (no JS needed) and in FAQPage JSON-LD.
12. **Closing.** One action and `TRIAL_TERMS`.
13. **ExploreMore** for the link graph.

## Research notes (all checked 2026-10-29)

Product, from the code and docs in this repo:

- Studio rules: `src/data/pricing.ts` (`PLAN`, `STUDIO`), `src/lib/studio.ts` (`monthlyTotal`, proration), `src/content/docs/account/studio.md` (updated 2026-10-28): per-site allowance, prorated add, removal to period end with no refund, archive keeps everything, restore charged like a new site, trial covers one site and "Start paid plan now" converts it, account-wide sections, the site switcher's `?site=` parameter, exchange and Reddit rules that follow the owner.
- Labels verified in code: "Start paid plan now", "Add a site", "Pick the searches to win", "Your first month of content", "Review & add site", "Monthly total".
- What the client and readers see: `src/content/docs/publishing/overview.md` (no approve step; drafts or hidden at the destination), `src/content/docs/api/articles.md` (fields; no author, no credit; `published_url`), `src/content/docs/api/authentication.md` (one key per site; base URL on rankbox.xyz), `src/content/docs/publishing/framer.md` (JSON-LD names the site's organization; the "Rankbox Articles" collection name when "Articles" is taken), `src/lib/shopify/publish.server.ts` (author is the setting, else the store name).
- What isn't built: `SHIPPED` in `src/data/competitors/shared.ts` (`citationTracking: false`, `teamInvites: false`); `PUBLISH_PLATFORMS` (every `addonLive` false).
- Score: `src/content/docs/content/scoring.md`: one 0 to 100 score from 11 checks; drafts revised against them.
- Voice settings: `src/content/docs/content/brand-voice.md`: audience, tone, writing style, house rules, per site.
- Terms: `/legal/terms` §5 (the customer reviews and fact-checks before publishing; no guaranteed rankings, traffic or citations) and §6 (the customer owns content created and published through the Service; no copying, reselling or reverse engineering the Service). `/legal/acceptable-use` bans reselling or sublicensing without written permission. So the page frames the agency as selling its own service and content; clients never get access, and the page never says "resell" or "reseller".

Outside sources:

- Google Search Central, "Google Search's Guidance on Generative AI Content on Your Website", https://developers.google.com/search/docs/fundamentals/using-gen-ai-content (page last updated 2026-10-01, read 2026-10-29): fact-check and review AI-generated content before publishing; many pages without added value can be scaled content abuse; telling readers how content was made can give them context. Quoted once, under 15 words.
- SERP research for the query (WebSearch, 2026-10-29): SE Ranking, https://seranking.com/white-label.html (branding, custom domain, read-only client seats, branded reports; in its Agency Success Kit); AgencyAnalytics, https://agencyanalytics.com/features/white-label (branded domain, client logins, branded reports and emails, some on select plans). Used only to understand what searchers expect; neither is named on the page.

## How this page differs from its neighbours

- **/white-label/content-writing** owns the production line (research, plan, draft, score, review, delivery), article anatomy, approval workflows and volume per site. The hub mentions the controls as six one-line levers and links there; it never walks through the line or shows an article.
- **/white-label/ai-seo** owns GEO as a service line, deliverables, explaining AI search, honest reporting and the engine guides. The hub says only that tracking isn't built and points there.
- **/white-label/pricing** owns cost per site, retainer packaging, the margin calculator and billing mechanics in depth. The hub's billing section is five rules and one number, with no calculator.
- **/use-cases/seo-agencies** is a persona page for SEO agencies in general (and still claims citation reporting and unlimited team members, which `SHIPPED` contradicts). The hub doesn't repeat its copy, doesn't make those claims, and covers four kinds of teams.
- **The old /white-label** (src/components/white-label, src/data/white-label.ts) is replaced. Its byline visual, gaps, steps and FAQ facts are carried into this directory and rewritten; nothing imports from the old files.
