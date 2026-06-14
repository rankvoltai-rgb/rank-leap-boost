# Onboarding Polish & Dopamine Loops

Goal: make the `/onboarding` results step feel alive and rewarding without breaking the clean light aesthetic. All work stays in frontend/presentation code — no backend or AI logic changes.

## 1. Fix the "above the fold" problem

The results step (`stage === "results"`) currently stacks a header, a long list of opportunity cards, and a CTA panel vertically, forcing a scroll before the user sees the value.

Changes in `src/components/auth/Onboarding.tsx`:
- Convert the results view into a tighter, two-region layout that fits in the viewport on common laptop sizes:
  - Compact header (badge + headline + one-line summary) with reduced top/bottom margins.
  - A scrollable inner list region (`max-h` with overflow) for the opportunity cards so the **header and the sticky CTA stay visible** while the cards scroll inside.
  - Make the "Start 2-Day Free Trial" CTA a sticky/pinned footer bar within the card column instead of a separate panel pushed far down.
- Tighten card density (smaller padding, condensed meta row) so 3–4 cards are visible at once.

## 2. Dopamine reward loop on "Add to Queue"

When `addToQueue` fires:
- Button morphs Plus → Check with a spring pop (scale bounce) via `motion/react`.
- A short burst micro-confetti / sparkle ping anchored on the clicked button (lightweight CSS/`motion` particles — no new heavy library).
- The queued card gets a brief success highlight (ring/tint flash) then settles into an "Added" state.
- A live "queued counter" near the CTA increments with a quick bounce, reinforcing progress ("2 articles queued").
- Optional subtle haptic-style scale nudge on the CTA each time the count grows.

## 3. Animated count-up traffic numbers

- Add a small reusable `CountUp` component (using `motion/react` `animate`/`useMotionValue` + `useTransform`, or a simple rAF tween) — no new dependency.
- Apply it to each card's `traffic_estimate` (`/mo`) so numbers roll up when results appear.
- Add an aggregate "total opportunity traffic" stat at the top of the results step that count-ups as cards mount and increments further each time one is added to the queue — the core dopamine metric.
- Reuse the same `CountUp` in the dashboard `StatCard` "Estimated Traffic" (`dashboard.index.tsx`) for consistency.

## 4. Gradient & visual polish

Note: the original build spec was strictly monochrome/no-gradient. This request explicitly overrides that for accent moments only — kept tasteful and subtle, not the purple-on-white AI look.

- Add 2–3 gradient tokens to `src/styles.css` (e.g. `--gradient-accent`, `--gradient-success`, `--gradient-surface`) built from existing `--ink` / `--success` / `--info` so they stay on-brand.
- Apply gradients selectively:
  - The aggregate traffic stat number / its container.
  - The primary CTA button (subtle ink gradient + hover sheen).
  - Success pills and the "Added" state.
- Add soft entrance stagger to opportunity cards (fade + rise) and a gentle scanning-complete celebration when transitioning from `scanning` → `results`.

## Technical notes
- Files touched: `src/components/auth/Onboarding.tsx` (primary), `src/styles.css` (gradient tokens + helper utility classes), `src/routes/_authenticated/dashboard.index.tsx` (reuse CountUp), and a new small `src/components/ui/count-up.tsx`.
- Animations use the already-installed `motion/react`; confetti is hand-rolled with motion particles to avoid adding dependencies.
- Respects `prefers-reduced-motion`: count-ups snap to final value and particle bursts are skipped.
- No changes to server functions, schema, or `api.ts` logic.
