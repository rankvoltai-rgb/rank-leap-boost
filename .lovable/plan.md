# Landing + Dashboard UI Polish

Three scoped, frontend-only changes. No backend, data, or logic touched.

## 1. Hero — remove "View Demo"

`src/components/landing/Hero.tsx`
- Delete the `SecondaryButton` "View Demo" block (the Play-icon button under the URL form).
- Remove now-unused `Play` and `SecondaryButton` imports.
- Tighten the CTA wrapper spacing so the URL form sits cleanly without the secondary action.

## 2. Hero dashboard mockup — polish + de-emoji

`src/components/landing/DashboardMockup.tsx`

Currently the mockup uses raw emoji (⚡ 📄 🔗 📈 📊 ●) and has a flat look.
- Replace every emoji with crisp `lucide-react` icons:
  - Footer stats `⚡ 27 / 📄 120 / 🔗 3` → `Zap`, `FileText`, `Link2` icons with labels.
  - `📈 Domain Rating` → `TrendingUp` icon.
  - `📊 {v}/mo` traffic line → `BarChart3` icon.
  - The bare `●` status dots → small rounded color dots already styled via spans (keep, they aren't emoji).
- Visual polish to read as a premium product shot:
  - Add subtle gradient header bar / window chrome (three dots) at the top of the card frame.
  - Soften card with layered border + ring, refine the active sidebar item and queued-card hover states.
  - Improve typographic hierarchy and spacing in the calendar cards (status pill, title, keyword, traffic).
- Keep all copy and structure; this is a styling pass only.

## 3. Dashboard app pages — UI elevation

Shared primitives `src/components/dashboard/primitives.tsx`
- `Panel`: add soft elevation shadow + hover lift option, subtle ring.
- `StatCard`: refine to a more premium card — uppercase label, larger value, optional accent top-border for `emphasis`, consistent min-height.
- `Button`: add focus-visible ring and slight hover elevation for the solid variant.
- `PageHeader`: tighten spacing, add a thin divider option.

Layout & chrome
- `src/routes/_authenticated/dashboard.tsx`: give `<main>` a max-width container and a faint page background (surface tint) for depth.
- `src/components/dashboard/Sidebar.tsx`: refine active/hover states, add an icon accent and section grouping spacing; polish the "soon" badge.
- `src/components/dashboard/TopBar.tsx`: refine the credits pill and avatar/sign-out grouping; add subtle separation.

Pages (styling only — queries and handlers untouched)
- `dashboard.index.tsx` (System Console): polish StatCard grid, Content Radar card hover, pills, and the Add-to-Queue button.
- `dashboard.blog-engine.tsx`: refine the tab switcher, list rows, and the article modal spacing/typography.
- `dashboard.billing.tsx`: polish the status panel and stat grid.

## Technical notes
- All changes are presentation-only: JSX/className edits plus new `lucide-react` icon imports (already a dependency).
- No new packages, no token changes required, but I may add 1–2 design tokens to `src/styles.css` (e.g. a dashboard surface tint / elevation shadow) if needed for consistency, derived from existing `--ink`/`--border` tokens.
- No data, server functions, routes, or business logic modified.
