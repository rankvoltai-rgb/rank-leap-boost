# /features/auto-publishing — page spec and build record

Built 2026-10-02. This is the record of the nine-role pass that rebuilt the page: what each role decided, what the critic caught, and what still has to be true before it ships.

The short version: **the old page described a product that doesn't exist yet.** It promised one-click WordPress, Webflow, Shopify, Wix and Framer, "0 developers needed", a 9:00 AM schedule, approval mode, and images. The code has none of that available to customers today. The rebuild says only what the code does, and the claims that depend on what has shipped are derived from the `addonLive` flags in `src/data/platforms.ts`. When a flag flips, the page updates itself.

---

## 1. Orchestrator — brief

- **Purpose:** show founders exactly how Rankbox gets finished articles onto their site, as it works today, so the right visitors start a trial.
- **Primary action:** start the trial (URL form → `/auth?url=`).
- **Secondary actions:** read the API guide (`/integrations/api`); see pricing (`#pricing`).
- **Assumptions:**
  - Audience: solo founders and small SaaS or e-commerce marketers who have already looked at autopilots (Outrank, RankPill, SEObot).
  - Stack: the repo's TanStack Start + Tailwind v4 + Supabase + Vercel, not the template's Next.js.
  - Design system: the existing tokens. No new one.
- **Success metrics:**
  - Hero CTA click-through rate, measured against the old page's baseline.
  - Share of sessions that reach `#destinations`.
  - Trial starts attributed to this URL.
  - Mobile LCP under 2.5 s and CLS under 0.1 (field data in Vercel Speed Insights).

## 2. Strategist

**Primary persona: solo SaaS founder.**
- **Job to be done:** keep the blog shipping without hiring a writer or giving up evenings.
- **Awareness:** solution-aware.
- **Objections:**
  1. "Will it post junk to my live site?"
  2. "Does it work with my stack, or do I need a developer?"
  3. "If I fix a post, will the tool overwrite me?"

**Secondary persona: developer or technical marketer on a custom or headless site.**
- **Job to be done:** pipe articles into Next.js or Astro without a CMS plugin.
- **Awareness:** product-aware.
- **Objections:**
  1. "Is there a real API with incremental sync?"
  2. "Do I get Markdown and HTML, and can I report the URL back?"
  3. "What happens when an article changes after I've synced it?"

**Teardown.** Facts come from `src/data/competitors/*`, checked 2026-09-21.

| Competitor | Leads with | Gets wrong |
|---|---|---|
| Outrank ($99 / 30 articles) | "An article a day" + 10 integration logos | A logo wall. Nothing on what lands on the page or what happens to your edits |
| RankPill ($99) | WordPress/Shopify/Wix/Webflow/Framer connectors | Same logo-wall story |
| SEObot ($49 for 9; 30 needs $199) | Hands-off automation, 9 platforms | You approve headlines, then it publishes what it writes. No quality gate story |
| Byword ($99 for 25) | Bulk campaigns, programmatic SEO | Publishing is a checkbox, aimed at volume |

**The gap:** every competitor sells auto-publishing as a logo wall. None says what lands on your site, what isn't sent, or what happens when you edit a published post. Rankbox can't win on logo count, since no connector is generally available. It can win on being the one page that shows its plumbing: exact fields, real status, and edit safety.

**Positioning:** for founders who want their blog to keep shipping without babysitting it, Rankbox Auto-Publishing is the publishing step of an SEO autopilot that shows you exactly what reaches your site and never overwrites your edits.

**Pillars:**
1. Paced, not dumped: 1–7 a week, capped at 30 a month, every draft SEO-checked.
2. Your site, your rules: draft or live, your edits win, slugs stay fixed.
3. Honest plumbing: a documented API any stack can pull today, with each connector listed at its real status.

**Critic:**
- The gap rests partly on connectors that aren't live. Fix: "Your edits win" is phrased so it's true on both paths: connectors stop touching edited posts, and with the API your code decides.
- The price advantage ($49.50 vs $99) belongs on the comparison pages, not here; Pricing carries it.

**Gate 1: PASS.** The gap is specific and the objections come from real product limits.

## 3. Information architect + UX

URL `/features/auto-publishing`, kept for its existing equity.

| # | Section | Its job | Objection it answers |
|---|---|---|---|
| 1 | Hero | Promise + URL form | "What is this?" |
| 2 | Answer block + spec band | One quotable definition, four facts | "What exactly does it do?" |
| 3 | Where articles go | API (available) → connectors awaiting approval → planned | "Does it work with my stack?" |
| 4 | What arrives | Field-by-field table, including what isn't sent | "Will it post junk / what will I fix?" |
| 5 | Your site, your rules | Edits win · checked · paced and capped | "Will it overwrite me or spam?" |
| 6 | How it works | 3 steps + CTA | "How much work?" |
| 7 | One engine | Where it sits in the loop | Context; internal links |
| 8 | Keep exploring | Topic links (link graph) | — |
| 9 | Pricing | Shared landing pricing | "What does it cost?" |
| 10 | FAQ | 8 questions people actually ask | Remaining doubts |
| 11 | Closing CTA | URL form | — |

The testimonial block was dropped. The landing quotes and "400+ founders" are unverified (see `competitor-pages` precedent), and this page's pitch is honesty.

- **User flow:** nav Features menu, `/features`, the integrations pages, blog topic links, or search → this page → URL form → `/auth?url=` → onboarding → Settings → Autopilot (pace) → Integrations (API key).
- **States:**
  - The page is static and server-rendered.
  - URL form: an empty submit goes to `/auth` without a URL (existing behaviour).
  - An unknown slug shows `FeatureNotFound`; a route error shows `FeatureError`.
  - Logged-in vs logged-out is handled by the Navbar.
- **Breakpoints:**
  - 375: one column. The table scrolls sideways inside its frame with the field column pinned, under a swipe hint.
  - 768: two-column spec band and payload table in full.
  - 1280: hero split; API card split with the code sample.
  - 1536: same layout, wider margins (max-w-6xl).

## 4. Copy

- **Hero H1 variants:**
  - "Keep your blog shipping every week" ← **ship**: it names the outcome buyers want (consistency) and is true at the lowest pace.
  - "Publish up to 7 articles a week": specific, but reads as a cap.
  - "Auto-publishing you can audit": differentiating but abstract. The idea lives in the destinations and payload sections instead.
- **Keywords:**
  - Primary: *automated blog publishing*.
  - Secondary: auto publish blog posts, blog autopilot, publish articles via API, Webflow auto publish, Shopify blog automation.
- **Title (48 chars):** Automated Blog Publishing at Your Pace | Rankbox
- **Meta (147 chars):** Set a pace of 1 to 7 articles a week. Rankbox writes and SEO-checks each one, then delivers it to your site through an API any stack can pull from.
- **Where copy lives:**
  - `src/data/features.ts`: hero, specs, rules, steps, CTA.
  - `src/data/auto-publishing.ts`: answer, destinations, payload, FAQ.
- **Trial microcopy:** "7-day free trial · Cancel anytime". The trial runs through Stripe Checkout, which collects a card, so "No credit card required" was false; it's removed from every feature page.

**Critic:**
- "Hands-free" is gone from the page body, but it still appears as the publishing topic title in `src/data/link-graph.ts`, which renders as the Keep-exploring heading. Not fixed here, because a peer session owns that file.
- "Every draft" wrapped at 768 px. Changed to "Checked".

## 5. Design

The existing tokens are reused; no new ones. What changed, and why:

| Change | Where | Why |
|---|---|---|
| Hero field fades from `--brand-blue` to `--cta` within 3rem | FeatureHero (all feature pages) | White on #1877f2 is 4.24:1, under AA. White on `--cta` #166fe5 is 4.73:1. Starting in brand blue avoids a seam under the navbar |
| Small hero text solid white (was 65–80% white) | FeatureHero | Translucent white fell to ~3.2:1 |
| Eyebrow pill fill → `brand-blue-deep/25` | FeatureHero | A white wash dropped it to 4.0:1 |
| Step circles, current engine card, URL-form button → `bg-cta` | FeatureSections, `landing/Hero.tsx` UrlForm | 4.23:1 → 4.73:1, and your rule that CTAs are `--cta` |
| Benefit numbers, Keep-exploring label → `text-cta` | FeatureSections, ExploreMore | `--volt` is 4.34:1 on white |
| How-it-works button `bg-ink` → `bg-cta` | FeatureSections | CTA-blue rule |
| "1 website" pill → `text-cta-hover` | `landing/Pricing.tsx` | 4.26:1 → 5.16:1 |

- **Motion:**
  - Reveals fade and rise over 550 ms.
  - The hero window cycles one article through Scheduled → Writing → Checking → Finished → Live, every 1.4 s.
  - `MotionConfig reducedMotion="user"` wraps this page.
  - The kit hooks jump to their final frame under reduced motion.
  - The H1 and subhead no longer fade in at all (see LCP below).
- **Assets:** none new. Logos come from the dashboard's `IntegrationLogo`. The OG image is the site default, `og-rankbox.png`; a page-specific card is backlogged.

**Gate 2: PASS.** Every section has final copy and a visual spec. The measured contrast audit fails only on 4 inactive tab labels in the closing CTA's sample chat mockup, which WCAG 1.4.3 exempts.

## 6–7. Frontend and backend

- **Rendering:** the page renders from `/features/$slug` through `LAYOUTS["auto-publishing"]`, not a static route. A static route made TanStack warn on every `/features/$slug` link site-wide.
- **Backend: the page itself is static.** One backend defect blocked an honest claim and was fixed. The public API sent article bodies raw, so any site rendering `body_html` showed `[Image: …]` notes and links to `#internal: …`.
  - `src/lib/publish-body.ts` → `stripWriterNotes()` is now shared by the API, Webflow and Shopify.
  - Side effect: the Framer plugin's content hash changes once, so it re-syncs each article one time. It isn't installable yet, so no users are affected.
- **Env vars:** none new.

**Gate 3: PASS.**
- tsc: 1,289 errors before and after, all from the known Supabase types regression, none in touched files.
- eslint: 0 errors.
- prettier: clean.
- vitest: 2,923 pass. The 2 failures are a peer's in-progress `src/sublanding` and the pre-existing `entitlement.test.ts`, whose files are unchanged from HEAD.

## 8. Search and performance

- **Head:** `src/lib/feature-head.ts`, shared by all feature pages. It sets title, description, a self-referencing canonical, OG and Twitter tags, and one JSON-LD graph: WebPage, SoftwareApplication, BreadcrumbList, and FAQPage, which equals the visible FAQ (tested).
- **Price bug fixed for all 8 feature pages:** the JSON-LD offered `"99"`; it now reads `PLAN.monthly` → `"49.50"`.
- **AEO:** a 40–110-word answer block that starts "Rankbox Auto-Publishing is…" (tested), plus 8 FAQs written as standalone answers.
- **LCP element:** the hero H1. It used to sit inside a `Reveal` that started at opacity 0, so it couldn't paint until hydration. It now renders straight from the SSR HTML.
- **Not measured:** per-route JS. The site ships one ~1.4 MB bundle (see memory `compression-handled-by-vercel`), well over a 150 KB route budget. That's a site-wide issue; see risks.

## 9. QA, security, compliance — audit table

| Check | Status | Fix / note |
|---|---|---|
| One H1, logical H2→H3→H4 | Pass | Verified in Chrome at 4 widths |
| No horizontal scroll at 375/768/1280/1536 | Pass | `scrollWidth == clientWidth` at each |
| Text contrast ≥ 4.5:1 (3:1 large) | Pass* | 16 failures fixed; 4 sample-mockup tabs exempt (WCAG 1.4.3, inactive UI) |
| Touch targets ≥ 44px | Pass | Breadcrumb and "Explore all features" hit areas enlarged; "Read the full FAQ" is an inline link (2.5.8 exception) |
| Status not by color alone | Pass | Each status is text plus an icon |
| Keyboard: scrollable table and code sample focusable | Pass | `tabIndex=0` + focus ring on the table region; `<pre>` focusable |
| Reduced motion | Pass | `MotionConfig reducedMotion="user"`, kit hooks, pixel CSS |
| Console errors or warnings | Pass | None after the static route was removed |
| Claims tied to shipped flags | Pass | `auto-publishing.test.ts`, including a simulated Webflow launch |
| No Wix/Ghost/webhook/one-click/approval-mode/clock-time/no-card claims | Pass | Tested |
| JSON-LD FAQ = visible FAQ; real price | Pass | Tested |
| XSS | Pass | No user input is rendered; the URL form only builds `/auth?url=` with `encodeURIComponent` |
| Secrets exposure | Pass | Sample key is `rv_live_a1b2c3…`, a placeholder |
| Cookie consent | N/A | The page sets no cookies of its own |
| PII | N/A | The URL field is a website, not personal data |
| Policy links | Pass | Footer links to privacy, terms and cookies |

**Gate 4: PASS,** with the 4 exempt mockup labels noted.

---

## Ship checklist

- [ ] **Autopilot runs in production.** `/api/public/hooks/autopilot-run` has no scheduler and no `AUTOPILOT_CRON_SECRET` in prod. It processes every site in one sequential loop, which won't fit a 300 s function. It needs a fan-out (one site per invocation) before a cron line is safe. Until then, "on a pace you set" describes the code, not production.
- [ ] Decide on "400+" in the landing Pricing card and the Navbar's white-on-#1877f2 contrast (4.24:1). Both are site-wide and both are your call.
- [ ] Confirm the link-graph publishing topic now reads "Publish on a schedule". The sublanding session agreed on 2026-10-02 to rename it from "…, hands-free".
- [ ] Flip `addonLive` per platform only on marketplace approval. The page, FAQ and comparison pages follow automatically.
- [ ] Review the diff, commit, and push (pushing from this machine 403s).

## Files

```
docs/auto-publishing-page.md                                   new
src/data/auto-publishing.ts                                    new — status-derived copy
src/data/auto-publishing.test.ts                               new — page rules
src/lib/publish-body.ts                                        new — shared note stripper
src/lib/publish-body.test.ts                                   new
src/lib/feature-head.ts                                        new — shared head + JSON-LD
src/components/features/auto-publishing/AutoPublishingPage.tsx new
src/components/features/auto-publishing/PublishingSections.tsx new
src/data/features.ts                                           auto-publishing entry; optional `problem`
src/routes/features.$slug.tsx                                  LAYOUTS, shared head, blue fallbacks
src/components/features/FeatureSections.tsx                    contrast, LCP, trial note, optional sections
src/components/features/showcase/publishing.tsx                honest visuals
src/lib/public-api.server.ts, webflow/body.ts, shopify/body.ts use stripWriterNotes
src/components/landing/Hero.tsx, landing/Pricing.tsx, ExploreMore.tsx  one-class contrast fixes
```

## Experiment backlog

1. **Status table above the fold for developers.**
   - Hypothesis: visitors from `/integrations/api` and dev queries convert better when they see the API card first.
   - Variant: a hero subhead + secondary link "See the API →" anchoring `#destinations`.
   - Metric: trial starts from API-referred sessions.
2. **Hero H1.**
   - Hypothesis: a number beats an outcome for solution-aware buyers.
   - Variant: "Publish up to 30 articles a month" against "Keep your blog shipping every week".
   - Metric: hero CTA click-through rate.
3. **Payload table placement.**
   - Hypothesis: showing "Not sent" rows early lowers trial starts but raises trial-to-paid conversion (fewer surprised churners).
   - Variant: move the table below the rules section.
   - Metric: trial-to-paid at day 7, not just trial starts.

## Known risks

- **Autopilot isn't scheduled in prod** (ship checklist #1). This is the largest gap between the page and production.
- **Site-wide contrast:** the Navbar and landing hero still use white on #1877f2 (4.24:1). Feature heroes are fixed; the rest is a brand-token decision.
- **Site-wide trial copy:** "No credit card required" still appears in 7 places outside the feature-page template: landing Hero, the `/features` and `/use-cases` hubs, persona pages, and blog chrome. The trial takes a card.
- **Other surfaces still overclaim:**
  - `PricingSections.tsx` says "Optional approval before publishing".
  - `HostingPicker.tsx` lists Wix and Webhooks.
  - The landing copy says articles are "published every day".
- **The connectors are untested on real sites:**
  - Webflow: not tested against a live Webflow site.
  - Shopify: tested on a dev store only.
  - Framer: never run in the editor.
  - The page lists them as "awaiting approval", not as available.
- **JS weight:** a ~1.4 MB bundle on every route. The LCP fix helps paint, but INP and total blocking time depend on splitting the bundle.
- **Re-verify** competitor facts and connector status quarterly, matching the comparison pages' `checkedOn`.
