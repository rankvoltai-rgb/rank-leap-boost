## Goal

Redesign the onboarding flow to reduce cognitive load and lift trial conversion. Widen the content area (~30/70 split), remove the dark plan card on the checkout step, and lean the final "Start Free Trial" step into a reassurance-first checkout.

## Scope

Single file: `src/components/auth/Onboarding.tsx`. No API, no Stripe, no pricing changes.

## Changes

### 1. Grid ratio — applies to every step

Change the main grid from `lg:grid-cols-[280px_1px_minmax(0,1fr)]` to a ~30/70 split with a narrower rail: `lg:grid-cols-[240px_1px_minmax(0,1fr)]` and bump `max-w-6xl` → `max-w-7xl`. The right column then owns ~70% of the container and content sections gain real breathing room. Widen the inner content wrappers (`max-w-xl` → `max-w-3xl` on Step 1/scanning, keep Step 2/3 already full-width, Step 4 becomes single column — see below).

### 2. Step 4 — "Start Free Trial" (checkout)

Remove the left dark plan card entirely. Collapse the two-column layout into a single focused column, reassurance-first:

```text
[chip] Free for 48 hours · No charge today
Start Free Trial
One-line subhead: cancel anytime before day 2 and you won't be billed.

[Trust strip — 3 pills]
Secured by Stripe · Cancel anytime · No charge today

[Compact plan summary card — light, not dark]
  Business plan · $49.50/mo after trial (small, muted)
  4–5 top plan bullets in two columns (condensed from PLAN_FEATURES)

[Stripe embedded checkout — full width, more prominent]

[Social proof footer row]
  Avatar stack + 5-star + "400+ founders growing with Rankvolt"
  + one short testimonial quote
```

Key decisions:
- Price is present but de-emphasized (small muted text next to plan name), not a giant $49.5.
- Trust cues appear *above* the Stripe form, not below.
- Social proof moves *below* the form as a reinforcement, not competing for attention.
- Primary CTA stays inside Stripe's embedded form. Header copy uses "Start Free Trial".
- Plan summary uses `bg-card`/`border-border` (light), matching the rest of onboarding — no more dark ink block.

### 3. Steps 1–3 breathing room

- Step 1 (form): widen input column, keep vertical rhythm.
- Step 2 (review analysis): the profile + keywords grid already spans full width; benefits from the wider column automatically.
- Step 3 (forecast): the two-column blogs + stats layout already spans full width; keep as-is inside the wider column.

No copy or logic changes to steps 1–3 — only the container width increases.

## Technical Details

- File: `src/components/auth/Onboarding.tsx`
- Change grid template + `max-w-*` on the body wrapper (~line 403).
- Rewrite the Step 4 JSX block (~lines 729–830) to a single-column layout. Drop the dark plan card (`bg-ink` block). Reuse `PLAN_FEATURES`, `PROOF_FACES`, `Avatar`, `Stars`, `StripeEmbeddedCheckout`, and the existing trust-pill pattern.
- Keep `checkout` state, `startTrial()`, and Stripe props unchanged.
- No new dependencies. Uses existing semantic tokens (`bg-card`, `border-border`, `text-ink`, `text-muted-foreground`, `text-success`, `bg-secondary`).
