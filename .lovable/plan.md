## Goal

Turn the subscription step of onboarding into a polished split-screen, keep the existing CTA → subscribe → dashboard flow, and harden the logic so payment reliably lands the user in the dashboard.

## Current behavior

The onboarding component (`src/components/auth/Onboarding.tsx`) has four stages: `form → scanning → results → checkout`. All four render inside one narrow centered card (`max-w-xl`/`max-w-3xl`) with a progress header.

- On the `results` stage, the **"Start 48-hour free trial"** button (`startTrial`) queues articles, generates the strategy, activates the trial, fetches the user, then switches to the `checkout` stage.
- The `checkout` stage renders `<StripeEmbeddedCheckout priceId="business_monthly" trialDays={2} .../>` squeezed inside the small card.
- Stripe `return_url` is already `/dashboard?checkout=success&session_id={CHECKOUT_SESSION_ID}`. The `/dashboard` route is under `_authenticated`, which redirects to `/auth` if not logged in (the user is logged in here, so it resolves).

So the CTA → subscribe → dashboard chain already exists — the work is the **split-screen redesign** plus tightening the logic.

## What I'll build

### 1. Split-screen checkout layout
When `stage === "checkout"`, break out of the narrow onboarding card and render a full-height two-column layout (single column stacked on mobile):

```text
+---------------------------+----------------------------+
|  PLAN / VALUE PANEL       |  STRIPE CHECKOUT PANEL     |
|  - Logo                   |  - "Activate your trial"   |
|  - "Business" plan        |  - trust badges            |
|  - $49.5/mo (was $99)     |  - <StripeEmbeddedCheckout>|
|  - included features list |    (embedded Stripe form)  |
|  - trust badges + social  |                            |
|    proof (stars, faces)   |                            |
+---------------------------+----------------------------+
```

- **Left panel:** dark `bg-ink` brand panel (consistent with the existing `AuthSplit` brand side) showing the plan name, price with strikethrough, the included-features checklist (reuse the list already in `Pricing.tsx`), trust badges (Secured by Stripe / Cancel anytime / 48h free), and social proof (avatars + stars). This is original creative material inspired by — not copied from — the reference screenshot.
- **Right panel:** clean `bg-card`/`bg-background` panel with the heading + the existing `StripeEmbeddedCheckout` component mounted in a roomy container so the Stripe form has full width.
- Other stages (`form`, `scanning`, `results`) keep the current centered-card layout and progress header unchanged.

All colors use existing semantic tokens (`ink`, `card`, `success`, `muted-foreground`, etc.) — no hardcoded colors, dark-mode safe.

### 2. Subscribe CTA → subscribe flow
Keep the `results` "Start 48-hour free trial" button as the subscribe CTA. No change to its async logic; it transitions into the new split-screen checkout. (Optionally relabel to "Continue to checkout" — I'll keep the current copy unless you prefer otherwise.)

### 3. Post-subscribe → dashboard redirect (make it 100% reliable)
- Keep Stripe `return_url = ${origin}/dashboard?checkout=success&session_id={CHECKOUT_SESSION_ID}`. With `ui_mode: "embedded_page"`, Stripe performs a full-page redirect there after successful payment — this is the canonical post-payment redirect and needs no extra client logic.
- Verify the `_authenticated` guard resolves the session before rendering `/dashboard` (it does: `beforeLoad` calls `supabase.auth.getUser()`), so the authenticated user lands on the dashboard cleanly.
- Add a small success toast on `/dashboard` when `?checkout=success` is present (and strip the query params from the URL afterward) so the return feels finished.

## Technical notes

- File touched primarily: `src/components/auth/Onboarding.tsx` (extract the checkout stage into a full-screen split layout; the early `return` for the checkout stage renders the split screen instead of the card).
- Reuse `StripeEmbeddedCheckout`, `Logo`, `Avatar`, `Stars` (from `shared`) — no new dependencies.
- Light edit to `src/routes/_authenticated/dashboard.index.tsx` (or the dashboard layout) to read `checkout=success` and show a one-time success toast, then clean the URL via `router.navigate`.
- No changes to `payments.functions.ts`, the Stripe server utility, or pricing/products — the `business_monthly` price and 2-day trial stay as configured.

## Out of scope
- No new payment provider, products, or price changes.
- No change to the analysis/scanning/results logic.
