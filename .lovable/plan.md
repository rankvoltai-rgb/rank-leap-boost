## Goal

Make the dashboard feel flat and clean like the reference (XDAT): cards defined by **crisp thin borders + generous whitespace**, not by drop shadows. Remove the "floaty" elevated look without adding, removing, or restructuring any UI.

## What the reference teaches

- Cards sit flat on a light grey canvas — separation comes from a 1px border and a near-white card fill, not shadow.
- Hover doesn't lift cards into the air; emphasis is subtle (border/tint), motion stays minimal.
- The only real "raised" element is the primary action button (a soft, contained shadow), and small floating menus.

## Changes

All work stays in presentation layer — token tweaks + the shared primitives. Because shadows are centralized, a small number of edits cascade across every dashboard screen.

### 1. `src/styles.css` — soften the elevation tokens
- `--shadow-elevation`: drop the large blurred drop shadow; reduce to a hairline/near-flat shadow (e.g. a single very subtle 1px hairline) so every `Panel` instantly reads flat.
- `--shadow-elevation-lg`: keep a *modest* contained shadow reserved for genuinely floating elements (dropdowns, popover menus) — clearly lighter than today.
- Leave color/border tokens untouched.

### 2. `src/components/dashboard/primitives.tsx` — border-led surfaces
- `Panel`: keep `border border-border bg-card`; shadow now comes from the softened token so it reads flat by default.
- `Panel` hover variant: remove the `-translate-y-0.5` lift and the jump to `shadow-elevation-lg`; replace with a quiet hover (e.g. `hover:border-ink/15` and/or a faint surface tint) so cards stay grounded.
- `Tabs`: drop `shadow-sm` on the container (border only); keep the active pill subtle.
- `Button` (solid): replace the lift + `shadow-md` hover with a flat, contained treatment (keep a soft shadow only on the primary solid button to match the reference's single raised CTA; remove the translate-on-hover).
- `MetricCard`/`StatCard` inherit `Panel`, so they flatten automatically — verify the top accent bar still reads well against the flatter surface.

### 3. Editor route `src/routes/_authenticated/dashboard.editor.$blogId.tsx`
- The inline `shadow-elevation` panels flatten automatically via the token change. The floating format toolbar (`shadow-elevation-lg`) stays as an intentionally raised element.

### 4. Small chips
- `dashboard.index.tsx` and `dashboard.visibility.tsx` icon chips use `shadow-sm` — drop to border-only so they match the flat language.

## Out of scope
- No new components, sections, columns, charts, or data.
- No color palette / font changes.
- No layout restructuring — only depth/shadow/hover refinement.

## Verification
- Run the dashboard in the preview (Playwright screenshot at desktop width) and confirm cards read as flat, bordered surfaces with the primary button as the only clearly raised element; check both default and hover states.
