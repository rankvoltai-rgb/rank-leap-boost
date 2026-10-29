# /white-label/content-writing — brief

Facts checked 2026-10-29, against the code, the docs in `src/content/docs` and the sources below.

## The page's one job

The visitor searched **"white label content writing"**, or a neighbour: "white label blog writing",
"white label article writing", "white label seo content". No volumes were supplied for this section
(these four pages aren't in the Semrush roadmap), so the query was picked on intent: it is the
phrase agencies use when they need articles they can deliver to clients under the client's name.

Who they are: an SEO or content agency, a web studio with care plans, or a freelancer running
several clients. They already know the usual answer, a network of freelance writers briefed one
piece at a time, and they are here to find out:

1. what comes off the line for each client, and how good it is;
2. how it sounds like each client and not like the others;
3. where their own editor and their client get to say yes before anything goes live;
4. how much one client site can take, and what it costs them in editing time.

What they want next: to see it on a site they control. The CTA starts the agency sign-up that lands
on Studio (`startStudioSignup()`); the trial runs on their own site, and client sites open in Studio
once the plan is paid.

## Concept

**"A standing line per client, in place of an order queue."** The roadmap's hook: a content line for
every client without a writer pool, writing in each client's voice, scored before it ships,
published under the client's name. Sharpened: the writer-pool model is order by order (brief, wait,
revise). Rankbox gives each client site a line that is already planned and runs at a pace you set,
and your editor's time goes into the one pass that matters.

**Focal visual (hero): the article ticket.** One sample client article (Sablewood Dental, a
fictional practice on `sablewood-dental.example`) shown as a production docket: the six stations it
passed, what each station produced for _this_ article, and who did the work (Rankbox, your editor,
the client's site). It reads in five seconds: this is a line, these are its stops, your editor is one
of them, the client's name is on the end. Its score (96, 10 of 11 checks, meta description a
warning) is the editor's own arithmetic, and the page test runs the real scorer to prove it.

It is static on first paint: no entrance animation hides it from the server-rendered HTML.

## Section plan

| #   | id          | H2                                                      | What the visitor must take away                                                                                                                                                                              | Focal visual                                                                                 |
| --- | ----------- | ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------- |
| 0   | hero        | (H1) White label content writing without a writer pool  | What it is, who does what, one action. Then the plain-text answer to "what is white label content writing".                                                                                                  | The article ticket                                                                           |
| 1   | `stations`  | Six stations from a client's homepage to a live article | Exactly what Rankbox does at each step, what the agency does, and what the client (or the client's site) does. Nothing at any station claims more than ships.                                                | The owner matrix: six rows, three lanes                                                      |
| 2   | `voice`     | A separate writer's brief for every client              | Each client site carries its own brief; this is the literal text the writer reads. House rules guide, they don't filter. Research doesn't read the brief.                                                    | The brief composer: three sample clients, editable, output from the real `composeStyleBrief` |
| 3   | `anatomy`   | The spec each client article is written to              | What one article contains, block by block, from the writer's blueprint; and what changes on the way to the client's site.                                                                                    | A document skeleton with the spec beside each block                                          |
| 4   | `checks`    | What the checks catch and what your editor reads for    | The 11 automatic checks and the revision pass; then the editor's pass Rankbox can't do (facts, sources, compliance wording, images, real links). Google's own lines on AI content and scaled content, dated. | Two columns, with a copyable editor checklist                                                |
| 5   | `sign-off`  | Two points where a client can say yes                   | No approve step inside Rankbox and no client login, so sign-off happens at two gates: topics before writing, articles at the destination.                                                                    | A track with two gates                                                                       |
| 6   | `pace`      | Articles per client and the editing hours behind them   | Pace per site, the monthly cap per site, and editor hours on the visitor's own numbers. No money (that's /white-label/pricing).                                                                              | The roster planner (arithmetic on the visitor's inputs)                                      |
| 7   | `scope`     | What the line writes and what stays with your team      | Articles only; no images, no page copy, no fact-check, no client contact.                                                                                                                                    | A two-column ledger                                                                          |
| 8   | `faq`       | Content writing questions from agencies                 | Nine questions of this page's own.                                                                                                                                                                           | Accordion-free list (always visible, crawlable)                                              |
| 9   | `next`      | Start the line on your own site first                   | Trial terms from facts.ts, Studio after the first paid invoice, one CTA, then the three deep dives.                                                                                                          | —                                                                                            |
| –   | ExploreMore | from the link graph                                     | Once the main session places the page in TOPICS.                                                                                                                                                             | —                                                                                            |

## Design notes

- Light page under the light navbar. Left-aligned, document-like: at `lg` every section has a narrow
  index column (station number and label, sticky) beside the content, like a spec sheet. No centred
  landing bands, no rails, no blue hero field.
- Near-monochrome: ink text, hairline borders, white cards on `bg-background`. Brand blue is spent on
  the CTA, selected tabs, the "Rankbox" lane, focus rings and the one number that matters in each
  visual.
- Type: semibold display with tight tracking for H1/H2, `font-mono` only for the writer's brief and
  the ticket's ids.
- Motion: only the selected-tab indicator and the copy confirmation, under `MotionConfig
reducedMotion="user"`.
- 400px: the ticket stacks its lane chips under each station; the owner matrix becomes one card per
  station; the skeleton's spec moves above each block; the planner rows wrap to two lines.

## Truth (what this page must and must not say)

- Writers aren't involved. A language model drafts from live research and the client's brief; the
  agency's editor reviews on top. Never "our writers".
- No approve step inside Rankbox (`docs/publishing/overview.md`): finished means ready to publish.
  Sign-off happens before writing (topics) or at the destination (drafts, hidden posts, or the
  agency's own code deciding draft or live).
- Clients get no login (`SHIPPED.teamInvites` false). No branded reports, no custom dashboard domain.
- Length and structure as the docs and features.ts state: typically 2,000 to 3,500 words, a target of
  2,750, depth check at 1,500. The blueprint numbers come from `docs/content/writing.md`.
- `features.ts` says articles "ship with images" and are "plagiarism-checked". The docs (updated
  2026-10-28) say no images are generated or sent and the score does not check originality. The page
  follows the docs: no images, no originality claim. Language support isn't claimed either (the
  blueprint and readability formula are English).
- The score is one 0-100 number from 11 checks, six of which are the GEO signals. It isn't a ranking
  or citation prediction, and nothing is tracked (`SHIPPED.citationTracking` false).
- Pace: "up to about N a month at the pace you set"; never daily unattended publishing as a promise.
- Publishing: the REST API today; Webflow and Shopify apps are built and awaiting approval, derived
  from `PENDING_ADDONS`. Never "one-click".
- No resell / reseller / sublicense wording. The agency sells its own service and the content.
- No rankings, traffic or citation results. No testimonials, logos or counts.
- Samples: Sablewood Dental, Driftmoor Coffee, Mossbark BBQ (web-checked safe list in the section
  brief), all on `.example` domains and labelled as samples.

## Research notes

| Source                                                                                                                                                                                | What it says                                                                                                                                                                                                                                                                                  | Read       |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| Google Search Central, "Google Search's guidance about AI-generated content" — https://developers.google.com/search/blog/2023/02/google-search-and-ai-content (published 2023-02-08)  | "Appropriate use of AI or automation is not against our guidelines." On bylines: "You should consider having accurate author bylines when readers would reasonably expect it." "Giving AI an author byline is probably not the best way to follow our recommendation."                        | 2026-10-29 |
| Google Search Central, "Spam policies for Google web search" — https://developers.google.com/search/docs/essentials/spam-policies#scaled-content (last updated 2026-08-28)            | Scaled content abuse "is when many pages are generated for the primary purpose of manipulating search rankings and not helping users", "no matter how it's created". First example: "Using generative AI tools or other similar tools to generate many pages without adding value for users". | 2026-10-29 |
| Google Search Central, "Creating helpful, reliable, people-first content" — https://developers.google.com/search/docs/fundamentals/creating-helpful-content (last updated 2026-10-05) | Who: "Do pages carry a byline, where one might be expected?" How: "Is the use of automation, including AI-generation, self-evident to visitors through disclosures or in other ways?"                                                                                                         | 2026-10-29 |
| AgencyAnalytics, "White label content writing services" — https://agencyanalytics.com/blog/white-label-content-writing-services (published 2025-02-27)                                | White label content is content "outsourced to external writers but branded as your own work"; the agency sets the brief, "the drafts come back to you", then it's handed to the client.                                                                                                       | 2026-10-29 |
| Verblio, "White label content writing for agencies" — https://www.verblio.com/blog/white-label-content-writing-service-agencies (published 2024-05-09)                                | A marketplace of freelance writers; a brief per request; a draft "typically within 4 to 6 business days"; edits go back and forth before purchase. Used only to describe the usual model in general terms; no competitor is named or priced on the page.                                      | 2026-10-29 |
| SERP for "white label content writing services for agencies"                                                                                                                          | Results are writer networks (Verblio, E2M) and guides about them. Confirms the visitor arrives expecting a writer pool.                                                                                                                                                                       | 2026-10-29 |

Product sources: `src/content/docs/content/{writing,scoring,editor,brand-voice,research,content-plan,autopilot}.md`,
`src/content/docs/publishing/overview.md`, `src/content/docs/account/studio.md`,
`src/lib/style-brief.ts` (`composeStyleBrief`), `src/lib/seo-analysis.ts` (11 checks, weights),
`src/lib/publish-body.ts` (writer notes stripped), `src/lib/public-api.server.ts` (no author field),
`src/data/auto-publishing.ts` (`PACE_OPTIONS`), `dashboard.settings.tsx` (pace maths
`round(pace × 52 / 12)`, tone and style options), `src/data/pricing.ts`, `SHIPPED`.

## How this page differs from its neighbours

- **/white-label (hub)** owns the program: who it's for, the client's experience, the site switcher,
  onboarding a client, billing in brief, what isn't white-label. This page doesn't explain Studio or
  onboarding; it starts once a client site exists and follows one article down the line.
- **/white-label/ai-seo** owns GEO as a service line and what can be reported. This page mentions the
  GEO checks only as part of the score and never discusses AI engines' behaviour or reporting.
- **/white-label/pricing** owns money. This page has no price maths: its planner counts articles and
  editing hours, never dollars. The one price mention is a link-out line in the close.
- **/features/citation-ready-writer** shows a live drafting animation for one site and sells
  "built to get cited". This page shows the spec as a skeleton and puts the editor's pass next to it.
- **/features/brand-voice** shows one paragraph turning from generic to on-voice. This page shows the
  brief itself, per client, editable, built by the same function the writer uses.
- **/features/seo-geo-score** animates a draft's score climbing. This page lists the checks only to
  separate them from what a human editor must read for.
