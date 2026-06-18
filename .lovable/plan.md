# Onboarding Polish — Bigger Card, No Scroll Friction, 2026 Reward-Loop UX

The onboarding (`src/components/auth/Onboarding.tsx`) is a single 4-stage card (Details → Analysis → Growth plan → Activate). The card is cramped (`max-w-lg`), and on the "Growth plan" (results) and "Activate" (checkout) stages the user is forced to scroll to see all content. We'll widen and re-balance the card, remove scroll friction, and layer in 2026-style motion, momentum and reward cues.

## 1. Larger, more breathing-room card

- Widen the shell from `max-w-lg` to a responsive `max-w-xl` on form/scanning/checkout and `max-w-3xl` on the dense results stage (width adapts per stage so simple steps stay focused and the plan step gets room).
- Increase internal padding (header + body) and vertical rhythm between elements so content no longer feels crowded.
- Soften/upgrade the card shadow and corner treatment for a more premium 2026 feel.

## 2. Kill the scroll friction

**Results ("Growth plan") stage**
- Replace the current stacked layout (hero metric block on top, then a separately-scrolling `max-h-[34vh]` article list, then CTA) with a **two-column layout on desktop**: left = hero metric + stats + CTA (sticky, always visible), right = the article plan list.
- Make only the article list scroll inside its own bounded panel with a fade mask at the edges, so the headline, hero traffic number, and the primary CTA are always on screen without page scrolling.
- On mobile it gracefully stacks (single column) with a sensibly capped list height.

**Checkout ("Activate") stage**
- Give the Stripe embedded checkout enough width/height within the wider card and place trust signals (Stripe lock, "cancel anytime", 48h free) in a compact reassurance row so the embed isn't pushed below the fold.

## 3. 2026 dopamine / reward-loop polish

- **Momentum in the progress header**: animated gradient fill on the active segment, a subtle pulse when a step completes, and a small "X of Y" with a checkmark on completed steps.
- **Anticipation → payoff on scan**: keep the live step list but add a slim animated progress bar and a "building your plan" shimmer so the wait feels productive, then a satisfying transition into results.
- **Reward moment on results**: keep/enhance the particle `Burst`, animate the projected-traffic `CountUp` with a spring, stagger the stat tiles in, and add a brief glow pulse on the hero metric when it lands. Add a small "unlocked" micro-label to reinforce achievement.
- **Tactile CTA**: primary buttons get a refined hover lift, subtle gradient/sheen, and a satisfying press state. Loading states keep their spinner copy.
- Respect `prefers-reduced-motion` everywhere (the existing `reducedMotion()` guard is extended to new animations).

## Technical notes

- All changes are confined to `src/components/auth/Onboarding.tsx` (presentation only) plus, if needed, small semantic token additions in `src/styles.css` (e.g. a soft glow/shadow token). No data, server-function, or business-logic changes — `analyze`, `startTrial`, Stripe checkout, and persistence stay exactly as they are.
- Layout uses Tailwind responsive utilities and existing semantic tokens (`ink`, `border`, `card`, `success`, `gradient-surface`, `text-gradient-traffic`); no hardcoded colors.
- Animations use the already-installed `motion/react`.
- Verify visually at desktop and mobile widths after implementation to confirm no scroll is needed on results/checkout above the fold.
