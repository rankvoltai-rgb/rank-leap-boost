# Two-column hero + page-wide breathing room

## 1. Hero → two-column layout

Restructure `Hero.tsx` from one centered column into a 2-column grid on desktop, stacking on mobile/tablet.

```text
┌─────────────────────────┬──────────────────────────┐
│  LEFT (text, left-align) │  RIGHT                    │
│  • Badge                  │  ChatGPT answer card      │
│  • "Cited across" row     │  (vertically centered,    │
│  • H1 (rotating logo)     │   slightly larger,        │
│  • Subhead                │   polished)               │
│  • URL form               │                           │
│  • social proof row       │                           │
└─────────────────────────┴──────────────────────────┘
```

- Desktop (`lg:`): `grid-cols-2`, left column text left-aligned, right column holds the `ChatAnswerCard`, vertically centered.
- Below `lg`: single column, content center-aligned (current look), card stacked under the text.
- Headline scales down slightly so it fits a half-width column cleanly; rotating glass logo stays inline.
- Social proof (avatars + "400+ founders") and the URL form left-align on desktop, stay centered on mobile.
- Widen the hero container to `max-w-7xl` so two columns have room.

## 2. Polish the ChatGPT card (right side)

Refine `ChatAnswerCard` / `chat.tsx` so it reads cleanly in the narrower right column:

- Add a soft layered backdrop behind the card (subtle Volt glow + faint offset card) so it feels like a floating, premium product shot rather than a flat block.
- Tighten internal spacing and ensure the engine tabs row scrolls/condenses gracefully at column width.
- Keep the streaming caret, shimmer line, source pills, and composer bar; just balance padding and font sizes for the smaller width.
- Add a gentle entrance/float so the card has presence.

## 3. Page-wide "less crowded" polish

A consistent rhythm + whitespace pass across sections (visual/spacing only, no copy or logic changes):

- **Consistent section padding**: standardize vertical spacing (e.g. `py-24 sm:py-28`) and consistent max-widths so sections breathe evenly.
- **EverythingYouNeed (bento)**: this is the most crowded — increase grid gaps (`gap-5`/`gap-6`), add more internal tile padding, increase spacing between the bento grid and the "plus everything else" tag cloud, and calm the tag cloud (more gap, lighter chips).
- **PersonalAgent (how it works)**: more space between the heading and the step list, slightly larger gaps between step cards, softer borders.
- **SuccessStories / GrowTraffic / Pricing / Testimonials / FAQ**: increase heading-to-content spacing, card gaps, and internal padding; soften borders/shadows for a calmer, more Notion-like feel.
- Lighten heavy 1px borders to softer tones where they stack densely, and lean on whitespace over dividers.

## Scope / files
- `src/components/landing/Hero.tsx` — 2-column grid, alignment, container width.
- `src/components/landing/chat.tsx` — card backdrop/glow, spacing balance for narrow column.
- `src/components/landing/EverythingYouNeed.tsx`, `PersonalAgent.tsx`, `SuccessStories.tsx`, `GrowTraffic.tsx`, `Pricing.tsx`, `Testimonials.tsx`, `FAQ.tsx`, `Guarantee.tsx`, `shared.tsx` — spacing/padding/gap refinements.
- Possibly a small token/utility in `src/styles.css` for the card backdrop glow.

No copy strategy, metrics, backend, pricing logic, or routing changes. Volt stays a subtle accent; Poppins font and Cloud White + Volt palette unchanged.
