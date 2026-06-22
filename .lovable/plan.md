# Navbar Features Dropdown

Give the homepage navigation a hover dropdown so the **Features** item reveals quick links to every individual feature page (Answer-Space Research, Citation-Ready Writer, Auto-Publishing, Citation Tracking, Authority Backlinks, Reddit Presence, Brand Voice, SEO/GEO Score), plus a link to the Features overview page.

All work stays in `src/components/landing/Navbar.tsx` — no new UI library, no backend, no design-system changes. The dropdown reuses existing tokens (`bg-card`, `border-border`, `shadow-elevation`, `text-ink`, `text-volt`, `text-muted-foreground`) and the feature data already defined in `src/data/features.ts`.

## Desktop behavior

- Wrap the **Features** nav item in a group container that toggles a dropdown panel on hover and on keyboard focus.
- The panel is an absolutely-positioned card anchored under the Features link, with a small invisible hover bridge so the menu doesn't close when the cursor crosses the gap.
- Content: a 2-column grid of the 8 features, each row showing its lucide icon (from `FEATURES[].icon`), the feature `name`, and the `tagline` as muted helper text. Each row is a TanStack `Link` to `/features/$slug`.
- A footer row inside the panel links to the full **Features overview** (`/features`) → "View all features →".
- Smooth fade/translate transition using existing transition utilities; add a chevron next to "Features" that rotates when open.
- Convert the Features item from a plain `<a>` to a TanStack `Link` (clicking the label still navigates to `/features`); the other nav items (Proof, Sample Articles, Pricing, FAQ) remain in-page anchor links unchanged.

## Mobile behavior

- In the existing mobile menu, turn **Features** into an expandable accordion: tapping it expands an indented list of the same feature links (to `/features/$slug`) plus the overview link. All other mobile links stay as-is and tapping any link closes the menu.

## Accessibility

- Trigger gets `aria-haspopup`, `aria-expanded`, and the panel opens on focus-within as well as hover so keyboard users can reach it.

## Technical notes

- Import `FEATURES` from `@/data/features` and `Link` from `@tanstack/react-router`.
- Use a local `useState` for the desktop dropdown (driven by hover/focus handlers) and a separate state for the mobile accordion.
- Keep the icon rendering identical to the features index pattern (`const Icon = f.icon`).
