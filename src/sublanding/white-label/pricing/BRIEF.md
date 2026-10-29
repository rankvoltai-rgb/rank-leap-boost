# /white-label/pricing

Route `src/routes/white-label.pricing.tsx`, directory `src/sublanding/white-label/pricing/`.
Group: job. Facts checked 2026-10-29.

## The one job

The visitor runs an agency, a studio or a freelance practice with several clients. They searched
**"white label seo pricing"** (or "how to price white label seo", "white label content pricing")
because they want two numbers: what one client costs them wholesale, and what they can charge on
top. After that they want to know the billing won't surprise them when clients come and go.

The page gives them the first number in the hero, lets them work out the second on their own
inputs, and then explains every billing event. The one action is starting the agency account
(`startStudioSignup()`), which lands on Studio after onboarding.

## Concept: the cost sheet

An agency prices a service from a cost sheet: the fixed lines, its own time, and the price. The
page is that sheet. The visual language is a ledger: label on the left, amount on the right,
dotted leaders between them, tabular figures, hairline rules. Blue is spent on the numbers that
matter (the per-site price, the margin, the share of a period you pay for) and on the CTAs.

Focal visual: the **cost sheet card** in the hero, one client site itemised: the per-site price,
what's included at no extra charge, the cost per article if every credit is used, and the four
"None" lines (setup fee, minimum, contract, volume discount). Each later section has one visual:

- the margin calculator's results ledger (the page's main interaction);
- a single-series bar chart of SE Ranking's retainer distribution;
- a billing-period bar with a slider that prorates a new client's first charge using
  `periodRemaining` and `allowanceFor` from `src/lib/studio.ts`, the functions billing runs on.

## Section plan, in order

1. **Hero** (H1). States the per-site price, that it doesn't change with volume, and the scope
   (content and AI-search side of SEO only). Plain-text short answer for answer engines. CTA
   "Start your agency account", secondary "Run your numbers" anchor. Cost sheet card.
2. **Work out your margin on each client** (`#margin`). Calculator on the visitor's own inputs:
   clients, whether the plan's own site holds their agency or a client, retainer per client,
   team hours and hourly cost, setup fee and setup hours. Outputs: Rankbox bill
   (`monthlyTotal`), time cost, revenue, gross margin and %, break-even retainer, Rankbox cost per
   article. Empty state before a price is typed (shows the bill and break-even), field errors,
   a loss state, success. No default price, no suggested retail price.
3. **Three ways to package the retainer** (`#packaging`). Bundled in an SEO retainer, a
   standalone content retainer, a setup fee plus a monthly line. Each with "watch for": the fixed
   cost against a small retainer, credits that never move between sites (price the site, not the
   article), developer time to wire the API while the CMS apps await approval. Then what the
   per-site price doesn't cover, and the Terms §5 line on guarantees. Links across to the
   content-writing and AI SEO pages.
4. **What agencies report charging, with dates** (`#market-rates`). SE Ranking's retainer
   distribution as a bar chart, plus three sourced notes (Ahrefs retainer share and common band,
   SE Ranking's AI Overview optimisation average, EFA per-word blog rates). Each carries its
   source, publication date and the date we opened it. Framed as context, never a recommendation.
5. **How the Studio invoice changes as clients come and go** (`#billing`). The proration slider,
   then each billing event: trial conversion, adding, renewal, removing, keeping, restoring,
   failed payment. Practical notes on matching client notice periods to the renewal date. Links
   to the Studio and Billing docs and the refund policy.
6. **Pricing questions agencies ask before adding clients** (`#faq`). Nine questions, none
   shared with the hub.
7. **Price your first client, then add the site** (`#start`). CTA, trial terms, the Studio
   note, and links up to the hub and across to the two other deep dives.
8. ExploreMore.

## Research notes (all opened 2026-10-29)

Rankbox facts, from the code and docs:

- Per-site price, plan price, allowances: `STUDIO.monthlyPerSite`, `PLAN` in `src/data/pricing.ts`.
- `monthlyTotal`, `periodRemaining`, `prorateAllowance`, `allowanceFor` in `src/lib/studio.ts`:
  the calculator and the slider call them directly.
- Adding a site uses Stripe `proration_behavior: "always_invoice"` and an invoice preview
  (`src/lib/studio.server.ts`); removal and "keep this site" use `proration_behavior: "none"`.
- Studio docs (`src/content/docs/account/studio.md`, updated 2026-10-28): no cap on sites; prorated
  first charge and first allowance (rounded up, never below 1); removal runs to period end with no
  refund, then archive with everything kept; restore is charged like a new site; the plan's own site
  can't be removed on its own; trial covers one site; "Start paid plan now".
- Billing docs (`src/content/docs/account/billing.md`): one invoice, one card, no contracts or setup
  fees; a failed payment stops writing on every site with no grace period; a restarted plan is paid
  from day one, one trial per account.
- Terms (`/legal/terms`): §5 no guarantee of ranking, traffic or citation; §6 the customer owns the
  content it publishes, and may not resell the Service. Acceptable Use bans reselling or
  sublicensing without permission. So the page talks about the agency's own service and content,
  never reselling Rankbox.
- Stripe prorations, https://docs.stripe.com/billing/subscriptions/prorations (opened 2026-10-29):
  "By default, Stripe calculates prorations down to the second", and `always_invoice`
  "calculates the proration, then immediately generates an invoice."

Market sources, each opened 2026-10-29:

- SE Ranking, "SEO pricing survey insights: How much does SEO cost in 2025?", Svitlana Shchehel,
  published 2024-12-13, https://seranking.com/blog/seo-pricing/. 260 responses (survey plus their
  agency catalog), mostly agencies serving small and local businesses; the article says the sample
  may not be large enough for statistical significance. Stated: 64% of agencies offer monthly
  retainers below $1,000, 30% charge less than $500, 20% $1,000–$2,000, 13% $2,000–$5,000, 2% more
  than $5,000. The $500–$1,000 share (34%) is not stated; it's 64% minus 30%, and the page says so.
  Agencies that had finalised pricing charge or plan to charge an average of $937 a month for AIO
  optimisation services (subset size not stated).
- Ahrefs, "SEO Pricing: How Much Does SEO Cost? 439 People Polled", updated 2024-08-15,
  https://ahrefs.com/blog/seo-pricing/. 78.2% of providers charge a monthly retainer; $501–$1,000 a
  month is the most popular band, at 20.4% of respondents. (Its averages assume the top of each
  tier, so the page doesn't quote them.)
- Editorial Freelancers Association, Editorial Rates (2026 chart), https://www.the-efa.org/rates/.
  Rates members charged in 2025, surveyed November 2025 to mid-January 2026, 1,100+ respondents.
  Blog posts, work for hire: 25¢–45¢ a word. The EFA doesn't set or advise on rates.

Left out: vendor blog posts quoting "wholesale white-label SEO" ranges (Clicks Geek, Enrich Labs),
because they're sellers' figures without a method; the /pricing page's unsourced agency ranges.

## How this page differs from its neighbours

- **/pricing** sells the one plan to a single site: plan card, trial timeline, a freelance-rate
  slider against one site's 30 articles, a comparison table. This page never shows the plan card or
  that slider. Its maths is the agency's: many clients, the plan-site choice, team time, setup,
  margin and break-even. Its billing section covers Studio events (proration, removal, restore,
  failed card across every client), which /pricing doesn't.
- **/white-label (hub)** owns the program overview, the client's experience, onboarding and what
  isn't white-label. This page mentions those only as they change a price (no client logins means
  reporting is your time) and links up for the rest.
- **/white-label/content-writing** owns the production line; this page links to it from the
  packaging section and never describes drafting, scoring or review steps.
- **/white-label/ai-seo** owns AI search as a service line and what you can report; this page only
  quotes SE Ranking's price point for AIO services and links across.
