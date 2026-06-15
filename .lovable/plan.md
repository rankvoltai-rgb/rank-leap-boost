# Rankvolt — Stripe + Onboarding/Dashboard Polish

Four pieces: Stripe payments, onboarding redesign + 48h-trial checkout, dashboard visual polish, and a Billing page. Existing design tokens in `src/styles.css` stay the source of truth (monochrome ink, subtle borders, low radius). No data-model rewrites.

## 1. Stripe payments

Use Lovable's built-in Stripe payments (no API keys, test mode immediately). This requires a **Pro plan**. Once enabled:

- Create one product from the landing page pricing — **Business**, $49.50/month (recurring). Tax handling set to full compliance handling (digital SaaS).
- The "Start 48-Hour Free Trial" CTA opens Stripe Checkout for the Business subscription with a **2-day (48h) free trial, card required upfront**. When the trial ends Stripe auto-charges $49.50/mo.
- After successful checkout, Stripe redirects back; a webhook (`/api/public/stripe-webhook`, signature-verified) records the subscription and flips the user to "active/trialing". Trial activation logic (generating the 30 opportunities) runs on return so the dashboard is populated.

```text
Onboarding results → "Start 48-Hour Free Trial"
   → activate trial in-app (queue + 30 blogs) → Stripe Checkout (48h trial, card upfront)
   → success return → /dashboard (subscription = trialing)
```

A `subscriptions` table (user_id, stripe ids, status, current_period_end, plan, trial_end) stores state, with RLS scoped to `auth.uid()` and the standard GRANTs. Webhook writes via the admin client.

## 2. Onboarding redesign (cleaner, Stripe-like; keep dopamine)

Rework `src/components/auth/Onboarding.tsx` visuals only — same 3 stages (form → scanning → results) and same server calls.

- **Cleaner surface:** flatter cards, hairline borders, more whitespace, tighter type scale, restrained use of the existing gradients (reserve the gradient for the hero traffic number and primary CTA only — Stripe-style restraint).
- **Form & scanning:** centered single column, refined inputs, calmer step list.
- **Results (keep dopamine):** keep the count-up traffic hero, the "Add to Queue" burst/pop animation, queued counter, and staggered card entrance — just lighter styling and better above-the-fold balance.
- **CTA copy:** change "Start 2-Day Free Trial" → **"Start 48-Hour Free Trial"**, and on click run the trial activation then redirect into Stripe Checkout (per section 1).
- Fix the brand-name inconsistency (Logo renders "RankPill" on server vs "Rankvolt" elsewhere) that is causing a hydration mismatch on `/onboarding` — standardize to **Rankvolt**.

## 3. Dashboard visual polish (no structural change)

Restyle existing pages and chrome; keep current nav/IA.

- `Sidebar.tsx` / `TopBar.tsx`: refined spacing, clearer active state, subtle Stripe-like section grouping; add the new **Billing** nav item (active).
- `primitives.tsx` (StatCard, Panel, Pill, Button, PageHeader): tighten radii/borders/typography for a more polished, consistent look.
- `dashboard.index.tsx` (System Console) and `dashboard.blog-engine.tsx`: apply the refreshed primitives; keep the count-up metric and reward feel on "Add to Queue".

## 4. Billing page

New route `src/routes/_authenticated/dashboard.billing.tsx`:

- Current plan & subscription status (trialing / active / canceled, trial end / next renewal date) from the `subscriptions` table.
- "Manage subscription" → Stripe Billing Portal (cancel/update card).
- Credits overview reusing `credit_accounts`, plus existing `purchaseCredits` surfaced as buy-credit options (kept as-is unless you want those on Stripe too).

## Technical notes

- Stripe enablement + product creation done via Lovable's built-in payments tooling.
- Checkout session + portal session created in server functions (`createServerFn`), called from the client with `useServerFn`; webhook is a public server route with signature verification, using the admin client only inside the handler.
- New `subscriptions` table migration with GRANTs + RLS.
- All onboarding/dashboard changes are presentation-layer except the new checkout wiring; AI functions and existing `api.ts` reads are untouched aside from adding subscription helpers.

## Prerequisites / confirmations

- Payments require a **Pro plan** — if not active, Stripe enable will prompt for it.
- Card-upfront trials mean users must enter a card before reaching the dashboard. Confirm that's intended (you selected "Card upfront, auto-converts").
