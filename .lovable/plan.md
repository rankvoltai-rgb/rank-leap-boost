## Goal
Make the auth page's right visual panel feel crafted and on-brand, removing the generic "AI-generated dashboard mock" feel.

## What reads as "vibe coded" today
- Three near-identical translucent glass cards stacked vertically with the same border, radius, and padding — no hierarchy.
- Everything is the same size and rhythm, so nothing leads the eye.
- Generic dark-on-dark with low contrast; the brand blue (`--volt`) barely appears.
- The mock looks like a stock dashboard rather than a moment in the Rankvolt story (sign in → connect → done).

## Plan

### 1. Establish a clear visual hierarchy
- Make the live "Agent working" pipeline the single hero element — larger, with more presence and a subtle volt-blue accent on the active step instead of a plain white bar.
- Demote the stats to a compact, quieter inline row (smaller, less chrome) so they support rather than compete.
- Reduce the number of separate "cards" — unify related content into fewer, more deliberate surfaces with varied weight (one feature surface + one quiet strip) rather than 3 equal boxes.

### 2. Tie it back to the brand narrative
- Reintroduce the "sign in → connect → done" arc as a thin progress spine connecting the steps, so the panel tells the product story instead of showing random metrics.
- Use the volt accent purposefully (active pipeline node, the ranking line endpoint, the "#1" badge) and keep everything else restrained.

### 3. Tighten craft details
- Consistent, intentional radii and border treatment (slightly tighter, less "glassy blur everywhere").
- Better typographic scale: clearer labels, aligned baselines, tighter number/eyebrow pairing.
- Calmer, more deliberate motion — stagger the reveal as a single choreographed sequence, smooth the pipeline loop, and ease the counters so it feels designed rather than busy.
- Improve contrast of secondary text for legibility on the dark panel.

### 4. Verify
- Screenshot the `/auth` panel at desktop width and confirm hierarchy, brand accent usage, and motion read as polished.

## Technical notes
- Edits scoped to `src/components/auth/AuthVisual.tsx` (visual structure + motion) and minor layout tweaks in `src/components/auth/AuthSplit.tsx` for the right panel container.
- Continue using `motion/react` and existing semantic tokens (`--volt`, `background`, `ink`); no new dependencies.
- Frontend-only; no auth logic or data changes.
