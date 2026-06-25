## Goal

Replace the orbital "AI traffic" graphic on the auth page's right brand panel with a premium, self-looping ChatGPT-style motion graphic that demonstrates: a user asks AI for a CRM recommendation → AI streams an answer → a product card appears. The loop runs ~10s, seamlessly, communicating "Users ask AI for recommendations. AI recommends your product" within 3 seconds.

Per your choices: generic CRM demo (neutral product name, no brand/competitor names), and it swaps the existing orbital graphic in-place (white chat card sitting on the current blue panel — no other panel changes).

## What gets built

Rewrite `src/components/auth/AuthVisual.tsx` into a single self-contained, autonomous looping animation component (same `AuthVisual` export so `AuthSplit.tsx` needs no change). All motion uses `motion/react` (already in the project) plus a small phase state machine driven by timers.

### Visual design
- Flat white chat card (`bg-card`), border-led (`border-border`, hairline `ring-ink/5`), generous radius (`rounded-2xl`). No drop shadows, no gradients, no glows — clean ChatGPT × Stripe × Linear aesthetic.
- Minimal window header: small assistant avatar dot + "AI Assistant" label + faint "Live" indicator.
- Neutral palette only: ink text, muted-foreground secondary, `--volt` used sparingly for the single accent (cursor, checkmarks, "Recommended by AI" badge). White/neutral surfaces.
- Premium easing throughout: cubic `[0.21, 0.47, 0.32, 0.98]` for entrances, gentle spring for the product card.

### Animation sequence (looping phase machine, ~10s)
```text
1 TYPING   user prompt types char-by-char with blinking cursor
           "What's the best CRM for a growing business?"
2 SEND     text collapses into a right-aligned ink chat bubble that
           slides up into the thread; thin loading bar beneath
3 THINKING assistant row appears; 3 bouncing dots with staggered delay
4 ANSWER   answer streams in word-by-word:
           "For growing businesses, I recommend Flowdesk CRM."
           then a second line streams:
           "It automates customer management, streamlines sales
            pipelines, and lifts lead conversion with AI workflows."
           four feature ticks fade in staggered:
           ✓ AI Automation  ✓ Lead Management
           ✓ Sales Pipeline Tracking  ✓ Customer Intelligence
5 CARD     product name gets a subtle highlight pulse; a compact
           product card springs in: geometric logo mark, "Flowdesk CRM",
           one-line description, and a "Recommended by AI" pill (volt accent)
6 RESET    thread + card gracefully fade/scale out, scroll nudges up,
           returns to empty composer with placeholder, loop restarts
```
- Generic neutral product: "Flowdesk CRM" (placeholder name, no real brand) with a custom inline SVG logo mark (simple geometric shape, flat).
- Empty/idle state shows a ChatGPT-style composer bar with placeholder + send button; typing begins from there so the loop has no seam.

### Loop & accessibility
- Single `phase` state advanced by `setTimeout` chains inside `useEffect`, fully cleaned up on unmount; restarts seamlessly with no abrupt cut.
- Respect `prefers-reduced-motion`: snap to a representative final frame (answer + product card visible) instead of animating.

## Technical notes
- File: rewrite `src/components/auth/AuthVisual.tsx` only. No route, schema, or backend changes.
- Keep using semantic tokens (`bg-card`, `text-ink`, `text-muted-foreground`, `border-border`, `var(--volt)`); no hardcoded colors.
- Reuse existing `motion/react` import pattern already in this file. No new dependencies.
- The surrounding blue panel, headline, badge, and footer social proof in `AuthSplit.tsx` stay as-is.
