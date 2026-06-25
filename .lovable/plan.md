# Redesign the Onboarding Flow

Rebuild `/onboarding` from the ground up using a Flux-inspired split layout (numbered step rail on the left, content panel on the right, top bar, footer) styled with Rankvolt's existing tokens (Cloud White + Blue, Poppins, semantic tokens only — light, clean). The underlying data/AI logic is reused; this is primarily a frontend/presentation rebuild with one new editable step.

## The new flow

```text
 1  Your website     →  name + website URL, then "Analyze my site"
 2  Review analysis  →  AI scans, then user confirms/edits profile + keywords
 3  Traffic forecast →  projected monthly traffic number + stat cards
 4  Start free trial →  Stripe embedded checkout → dashboard on success
```

## Layout (Flux-style, Rankvolt-branded)

- **Top bar:** Rankvolt logo + "Set up your engine" label on the left; "Restart" and "Leave" actions on the right (Restart resets to step 1; Leave returns to `/`).
- **Left rail:** vertical numbered steps (1–4) each with a title and one-line description. Current step highlighted (filled dark/volt chip), completed steps show a check, upcoming steps muted. Collapses above the content on mobile into a slim progress strip.
- **Right panel:** the active step's content, vertically centered with generous spacing.
- **Footer:** small muted links (Help Center, Status, Contact) + "© Rankvolt 2026".

## Step details

**Step 1 — Your website**
- Fields: Full name, Website URL (both validated; URL required to proceed).
- Primary CTA "Analyze my site" → triggers `analyzeWebsite` and advances to step 2 in its scanning state.

**Step 2 — Review analysis**
- While running: animated scan checklist (reuse the existing scan-step labels) inside the right panel.
- When complete: editable form the user confirms or changes:
  - **Profile:** Business name, Niche, Audience, Brand tone (text inputs/textarea, prefilled from analysis).
  - **Keywords:** the discovered keywords as removable chips, plus an input to add new ones.
- CTA "Looks good — see my forecast" persists edits and advances. Edits are merged back into the analysis object before persisting.

**Step 3 — Traffic forecast**
- Hero: projected monthly traffic as a large animated `CountUp` number.
- Supporting stat cards: number of articles, average AI signal, setup = "Auto" (redesigned card styling to match the new layout).
- A compact, scrollable list of the included article opportunities below the stats.
- CTA "Start free trial".

**Step 4 — Start free trial**
- Split: plan value/social proof on one side, `StripeEmbeddedCheckout` on the other (reuse existing component, `business_monthly`, `trialDays={2}`).
- `returnUrl` → `/dashboard?checkout=success&session_id={CHECKOUT_SESSION_ID}` (unchanged), so Stripe success lands on the dashboard.

## Data / logic (reused, minimal changes)

- `analyzeWebsite` (server fn) — unchanged.
- `persistOnboarding` — called after step 2 with the **edited** analysis (merged profile + keyword edits) instead of the raw result. Same signature; we pass the user-edited `WebsiteAnalysis` and the confirmed business name.
- On "Start free trial": keep current behavior — auto-queue opportunities (`addOpportunityToQueue`), `generateBlogStrategy`, `activateTrial`, then fetch user and mount Stripe checkout.
- No database/schema changes. No changes to AI prompts.

## Files

- **Rewrite** `src/components/auth/Onboarding.tsx` — new stepper shell + four step views and edit state (profile fields + editable keyword list). Keep the existing server-fn wiring and the Stripe checkout step.
- Likely **add** small presentational subcomponents in the same file (StepRail, TopBar, Footer, editable keyword chips) to keep it readable; no new routes.
- `src/routes/onboarding.tsx` — unchanged (still renders `<Onboarding />`); update the `head` description copy to match the new website-first flow.

## Technical notes

- Stage machine extends to: `form` → `scanning` → `review` (new editable step) → `forecast` → `checkout`.
- Keyword edits update a local copy of `analysis.keywords`; profile edits update local fields, merged into the `WebsiteAnalysis` passed to `persistOnboarding`.
- All colors via semantic tokens; Poppins; motion via the already-installed `motion/react`. Respect `prefers-reduced-motion` as the current implementation does.
- No business-logic changes beyond passing edited values into the existing persist call.
