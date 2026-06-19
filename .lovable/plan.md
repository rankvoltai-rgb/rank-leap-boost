# Dashboard refinement + modern redesign

## 1. Estimated Traffic never shows 0 after onboarding

Today the stat only sums `finished` blogs, so a fresh account (everything is `opportunity` / `scheduled`) reads **0**. Fix by summing `traffic_estimate` across **all** of the user's blogs.

- In `dashboard.index.tsx`, replace the `finished`-only query with a single `listBlogs()` (no status filter) query keyed `["blogs","all"]`.
- `estimatedTraffic = allBlogs.reduce((s,b) => s + (b.traffic_estimate ?? 0), 0)`.
- Remove the now-unused `bonus` state and the `+bonus` math (the total is status-independent, so queuing an item no longer changes it). `addOpportunityToQueue` still invalidates `["blogs"]`, which refreshes everything.

## 2. Content Radar → single-column list with Selected + Add to Queue

Convert the radar from a multi-column card grid into **one card per row, stacked vertically**, split into two labeled sections:

```text
Content Radar
  ── Selected ─────────────────────  (already queued)
   [ card row ]  [ card row ]  ...
  ── Add to Queue ─────────────────  (opportunities)
   [ card row + "Add to Queue" btn ]
```

- **Selected** = `listBlogs("scheduled")` + `listBlogs("generating")` (already added to the queue). Cards are read-only (show a "Queued" pill instead of the button).
- **Add to Queue** = `listBlogs("opportunity")`. Cards keep the `Add to Queue` action wired to `addOpportunityToQueue`.
- Each section renders its own count and an empty state ("Nothing queued yet" / "No new opportunities right now").
- Row layout: title + keyword on the left, traffic/competition/AI-signal pills and the action on the right, using the responsive `grid-cols-[minmax(0,1fr)_auto]` → `sm:flex` pattern so it survives mobile.

## 3. "AI Signals" → "AI Algorithms" with engine logos

- Rename the stat card label `AI Signals` to **AI Algorithms**.
- Instead of a bare count, this card displays a **row of AI engine logos** (the algorithms the content is optimized to be cited by) with a short caption ("Optimized for citation across leading AI engines").
- Logos shown: ChatGPT, Claude, Gemini, Google, Perplexity (already in `ai-logos.tsx`) plus the provided geometric "Boundless" mark, which I'll add as a new `BoundlessMark` component (inline SVG from the uploaded file, using `currentColor`/ink). Each logo gets an accessible label.

## 4. Modernize the whole dashboard UI (Stripe / Notion clean-modern)

Refresh the shared dashboard chrome and primitives so every page (Console, Blog Engine, Calendar, Keywords, Billing, Settings) inherits the new look. All changes use existing semantic tokens — no hardcoded colors.

- **Sidebar**: lighter surface, refined spacing, grouped nav with a subtle muted section label. Active item becomes a soft `secondary` fill with bold `ink` text and a slim left accent bar (Notion-style) rather than a heavy solid-black pill. Add a compact workspace/brand row at top and push Settings/Billing visually distinct at the bottom.
- **TopBar**: thinner, calmer hairline border, credits shown as a quiet chip, cleaner avatar + sign-out grouping.
- **Primitives** (`primitives.tsx`):
  - `Panel`: softer hairline border, refined `shadow-elevation`, slightly larger radius for the Stripe/Notion feel.
  - `StatCard`: tighter uppercase label, larger tabular number, optional logo-row body (for the AI Algorithms card), restrained accent line only on the emphasis card.
  - `Pill` / `Button`: keep variants, tune padding/weight for a crisper, more refined rhythm.
  - `PageHeader`: more generous spacing and clearer hierarchy.
- Apply consistent vertical rhythm/spacing across the route pages so the redesign reads as one unified system.

## Technical notes

- Files: `src/routes/_authenticated/dashboard.index.tsx` (traffic calc, radar restructure, AI Algorithms card), `src/components/dashboard/primitives.tsx` (StatCard logo support + visual polish), `src/components/dashboard/Sidebar.tsx`, `src/components/dashboard/TopBar.tsx`, `src/components/landing/ai-logos.tsx` (add `BoundlessMark`).
- No DB/schema or server-function changes; all reads use existing `listBlogs` / `getCredits`. Data stays 100% real.
- Reuse `useQuery` + `queryClient.invalidateQueries(["blogs"])` patterns already in place.

## Open item

The 4th uploaded logo ("Boundless Book") had no engine name provided — I'll render it labeled "Boundless"; tell me the correct name if it should read differently.
