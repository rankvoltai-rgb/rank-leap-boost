# Make credits real: 30 articles/month + out-of-credits paywall

Today credits are cosmetic — only autopilot decrements them, manual generation never does, defaults are inconsistent (200 in onboarding, 1000 in seed/billing), there's no monthly cap or reset, and nothing blocks a user who's "out." This wires the whole loop to a hard **30 articles per month** with an "out of credits → upgrade" gate modeled on Lovable.

## Decisions locked in
- 1 article = 1 credit. Manual generation **and** autopilot draw from the same 30/month pool.
- Credits refill to 30 on subscription renewal (Stripe webhook), tracked by billing period.
- Trial users start with 30 (the amount the onboarding already advertises).
- Out-of-credits = upgrade/inform prompt only (no à-la-carte credit packs).

## 1. Database (migration)
- Change `credit_accounts.credits_total` default `1000 → 30`.
- Add `period_end timestamptz` to `credit_accounts` to track which billing cycle the current credits belong to (drives idempotent resets).
- Add a `SECURITY DEFINER` function `public.consume_article_credit(_user_id uuid) returns boolean` that **atomically** does `UPDATE credit_accounts SET credits_used = credits_used + 1 WHERE user_id = _user_id AND credits_used < credits_total` and returns whether a credit was actually consumed. This is the single source of truth both client and autopilot call, so the 30 cap can't be raced past.
- Add `public.reset_article_credits(_user_id uuid, _period_end timestamptz)` (SECURITY DEFINER) that sets `credits_used = 0, credits_total = 30, period_end = _period_end` only when the incoming period differs — used by the webhook.
- Grant execute on both functions to `authenticated` (consume) and `service_role` (both).

## 2. Standardize credit grants in code (`src/lib/api.ts`)
- `ensureAccountBase`, `seedAccount`: new accounts insert `credits_used: 0, credits_total: 30` (drop the 200 / 1000 / 320 values).
- `generateBlogArticle`: before calling the AI, call the `consume_article_credit` RPC. If it returns `false`, throw a typed `CreditsExhaustedError` (no generation, no status flip). On success continue as today; the credit is already counted, so remove any ad-hoc increment.
- Add a small `hasCreditsRemaining()` helper derived from `getCredits()` for the UI.

## 3. Autopilot parity (`src/lib/autopilot.server.ts`)
- Replace the read-then-increment-after pattern with a call to `consume_article_credit` **before** generating (reserve the credit), and refund it (decrement) only if generation throws and the article is rolled back to `scheduled`. Keeps manual + autopilot honest against one 30/month pool.

## 4. Webhook refill (`src/routes/api/public/payments/webhook.ts`)
- In `handleSubscriptionCreated`: upsert the user's `credit_accounts` row and call `reset_article_credits(userId, current_period_end)` so a new/trialing subscriber starts at 30.
- In `handleSubscriptionUpdated`: call `reset_article_credits(userId, current_period_end)` — the function no-ops unless the period actually advanced, so a renewal refills to 30 while unrelated updates don't.

## 5. Out-of-credits paywall UI (the "like Lovable" part)
- New `src/components/dashboard/CreditPaywallDialog.tsx`: a branded modal (uses existing primitives + bespoke icons) — headline "You've used all 30 articles this month", a credit meter, contextual subcopy (trial users: "confirm your plan to keep publishing"; active users: "credits refill on {renewal date}"), and a primary **Upgrade / Manage plan** button that routes to `/dashboard/billing` (or opens the Stripe portal/checkout already wired there). No purchase-pack UI.
- `dashboard.blog-engine.tsx`: when remaining ≤ 0, the per-row **Generate** button becomes an **Upgrade** button that opens the dialog; the generate handler also catches `CreditsExhaustedError` and opens the dialog as a fallback. Confetti/reward path unchanged on success.
- `dashboard.index.tsx` (Overview): add a dismissible "Out of credits" banner when remaining ≤ 0 linking to billing.
- `TopBar.tsx`: turn the existing `X credits` readout into a small meter that goes amber at ≤ 3 and red at 0, clickable through to billing.

## Technical notes
- `consume_article_credit` / `reset_article_credits` are `SECURITY DEFINER` with `SET search_path = public`; the consume function is safe for `authenticated` because it only ever touches the caller's own row via `_user_id = auth.uid()` (the client passes `auth.uid()`), and the atomic guard enforces the cap regardless of client behavior.
- No changes to Stripe products/prices — the existing `business_monthly` price and trial flow stay as-is; we only react to its webhook events for refills.
- Types regenerate after the migration is approved, so all `api.ts` / webhook code touching the new RPCs lands after that step.

## What the user will see
- Generating articles (manually or via autopilot) burns down a real 30/month balance shown in the top bar.
- Hitting 0 blocks further generation and pops an upgrade modal instead of silently failing.
- A new billing cycle refills the balance to 30 automatically.