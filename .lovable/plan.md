# Auth page: full-screen iPhone chat animation

Redesign the right-hand brand panel of the Auth/Login page so the looping ChatGPT-style chat animation becomes the hero — framed inside an iPhone, with the marketing copy removed and only the testimonial strip kept.

## Changes

### `src/components/auth/AuthSplit.tsx` (right panel)
- Remove the badge ("Sign in → connect site → done"), the headline ("Get AI traffic on Autopilot, while you sleep"), and the supporting paragraph.
- Restructure the panel to a vertical flex column that centers the iPhone-framed animation and takes up almost the full panel height.
- Keep the avatar + stars + "400+ founders growing with Rankvolt" testimonial row pinned at the bottom.
- Keep the blue gradient background, ambient glows, and dot texture.

### `src/components/auth/AuthVisual.tsx` (the animation)
- Wrap the existing chat card in an **iPhone mockup**: dark rounded bezel (`rounded-[2.75rem]`), thin frame, a centered Dynamic-Island pill near the top, and a home-indicator bar at the bottom. The chat UI becomes the phone's screen (`bg-card`, inset rounded corners).
- Size the phone so it nearly fills the panel height (responsive `max-h`/aspect ratio), centered.
- Replace the generic `AssistantGlyph` next to "AI Assistant" (header) with a **ChatGPT-style mark**: a flat monochrome SVG of the OpenAI knot glyph rendered in `bg-ink`/`text-background` so it stays on-token. The same mark replaces the assistant avatars in the thinking/answer rows and the "Recommended by AI" pill for consistency.
- Keep all existing animation timing, phases, streaming, feature ticks, product card, and reduced-motion handling unchanged.
- Adjust internal spacing/heights so the thread fits the taller phone screen without layout shift.

## Technical notes
- No new dependencies; continue using `motion/react` and semantic tokens only (no hardcoded colors).
- The OpenAI/ChatGPT glyph is drawn as an inline SVG path (single-color, uses `currentColor`) so it inherits theme tokens and stays flat.
- Phone frame uses `border`/`bg-ink` tokens for the bezel; screen content sits in an inset container with `overflow-hidden`.
- Animation stays self-contained inside `AuthVisual`; `AuthSplit` only changes layout/markup around it.
