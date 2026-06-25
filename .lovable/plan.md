## Goal

Enrich the ChatGPT-style chat mockup in `src/components/auth/AuthVisual.tsx` with four design details from the reference screenshot, while keeping the existing feature checklist and recommended-product card.

## What gets added

```text
┌───────────────────────────────────────┐
│ ◎ ChatGPT                       • Live │  (unchanged header)
├───────────────────────────────────────┤
│                  ┌──────────────────┐  │
│                  │ user prompt …    │  │  (unchanged dark bubble)
│                  └──────────────────┘  │
│  ◎  • Searched 24 sources · writing…   │  ← NEW status line
│     For lean teams, Flowdesk CRM is …  │  ← product name now bold+underline
│     ▓▓▓▓▓▓▓░░░░░░  (shimmer bar)        │  ← NEW shimmer while streaming
│     ✓ AI Automation   ✓ Lead Mgmt       │  (kept checklist)
│     ✓ Pipeline        ✓ Intelligence    │
│     ┌─ Flowdesk CRM ── Recommended ─┐   │  (kept product card)
│     Sources  [P plannora] [L loop] [Y …]│  ← NEW source chips row
├───────────────────────────────────────┤
│  Ask a follow-up…                   ↑  │  (composer)
└───────────────────────────────────────┘
```

### 1. "Searched 24 sources · writing answer" status line
Add a small row at the top of the assistant answer block: a blue dot (`var(--volt)`) + muted text. During the `answer` phase it reads `Searched 24 sources · writing answer`; once the `card` phase is reached it switches to `Searched 24 sources · answer ready`. Fades in with the answer.

### 2. Underlined product name
Change the `AnswerStream` emphasis from the current highlighted background pill to **bold + underline** (underline offset for legibility), matching the screenshot. Underline color uses the volt accent.

### 3. Shimmer loading bar
Add a thin rounded grey bar (`h-1.5 w-2/3 rounded-full`) beneath the streamed text that shows only while `phase === "answer"` and the answer is still streaming. It animates with a left-to-right moving gradient highlight (Motion `backgroundPosition` loop), then disappears when streaming completes.

### 4. Source chips row
Add a `SOURCES` array (3 fictional, non-real-company domains consistent with the brand — e.g. `plannora.io`, `loopcraft.ai`, `yardstick.team`). Render a "Sources" label followed by pill chips, each with a small circular letter avatar + domain text. Chips appear during the `card` phase, staggered in with a small fade/slide. Styled with `border-border`, `bg-surface`, rounded-full, using semantic tokens only.

## Ordering inside the answer block
Status line → answer text → shimmer bar (while streaming) → feature checklist → product card → sources row.

## Loop timing
The existing autonomous loop (`typing → thinking → answer → card → reset`) stays intact. The new elements key off the existing `phase`/`answerChars`/`featuresShown` state plus a small staggered reveal for source chips, so no timing logic is restructured.

## Technical notes
- All work stays in `src/components/auth/AuthVisual.tsx` (presentation only; no logic/backend changes).
- Semantic tokens only (`text-muted-foreground`, `bg-surface`, `border-border`, `var(--volt)`); no hardcoded colors.
- Respects `prefersReducedMotion` (shimmer/animations skipped, final state shown) like the existing component.
- Verify with a Playwright screenshot of the `/auth` right panel after the change.
