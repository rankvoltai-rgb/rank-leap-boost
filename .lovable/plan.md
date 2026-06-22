## Goal

Bring every feature up to the Overview's quality bar (rich panels, count-up stats, progress rings, custom icons, reward moments, smart empty states), then add new "answer-engine-first" features that make Rankvolt feel genuinely intelligent.

## Part 1 — Shared UI foundation (do first)

Centralize the Overview's enrichment so every page reuses it instead of re-implementing:

- `src/components/dashboard/primitives.tsx`: add a reusable **`Tabs`** (pill segmented control), **`EmptyState`** (icon + title + body + action), and a **`MetricCard`** variant of StatCard with built-in `CountUp` + trend delta + optional `ProgressRing`/sparkline.
- `src/components/dashboard/signals.tsx`: extract `AiSignalFlames`, a `DifficultyBar`, and a small `Sparkline` (inline SVG) from the Overview so they're shared.
- Reuse existing `rewards.tsx` (Confetti, ProgressRing, StreakBadge) and the new engineered icon set everywhere.

## Part 2 — Rebuild existing features

**Articles** (`dashboard.blog-engine.tsx`)
- Header row of MetricCards: Ideas / Scheduled / Published counts, total est. traffic (count-up), avg SEO score (ring).
- Shared `Tabs`, richer rows: AI-signal flames, difficulty bar, status-aware pills + engineered icons, autopilot badge on auto-written drafts.
- Smart empty states per tab; confetti + toast when an article reaches Published.

**Calendar** (`dashboard.calendar.tsx`)
- Real month grid: each day shows scheduled-article dots; today highlighted; click a day to see/reschedule its articles.
- "This week" summary strip + a queued-traffic ramp visual; keep grouped list below the grid.
- Cadence indicator tying back to autopilot settings.

**Keyword Lab** (`dashboard.keywords.tsx`)
- Add an **opportunity score** + difficulty bars; one-click **"Draft article"** that turns a keyword into a queued opportunity.
- Intent/trend pills with engineered icons (started); cluster grouping for discovered keywords.

**Settings** (`dashboard.settings.tsx`)
- Sectioned layout with a **brand-profile completeness meter** (ring), one-tap **voice presets** (chips that fill tone/style/audience), and mirrored autopilot controls (toggle + cadence) so users can manage it here too.

**Billing** (`dashboard.billing.tsx`)
- Credit **usage ring** (used vs total), plan card polish, and a credit-activity list.

**Editor** (`dashboard.editor.$blogId.tsx`)
- Swap remaining lucide glyphs for the engineered set, add a **publish reward** (confetti + success state), polish the AI bubble menu and "back to Articles" label (currently says "Content Studio").

## Part 3 — New features (the "400 IQ" layer)

1. **Answer Engine Rank** (new route `/dashboard/visibility`) — the GEO differentiator. Shows, per AI engine (ChatGPT, Gemini, Perplexity, Google AI), whether the brand is being cited for its target topics, with a visibility score, trend, and "topics you own / topics to win." Backed by AI estimation now, with a graceful real-data path later (Semrush connector). Added to nav with a custom icon.

2. **Insights** (new route `/dashboard/insights`) — traffic trajectory sparkline/area chart, published-per-week cadence, SEO-score distribution, projected vs. delivered. All derived from existing blog data.

3. **Content Gap Radar** (section, surfaced on Overview + Articles) — highlights gaps "AI isn't answering yet" with one-click queue, reinforcing the core promise.

Nav (`nav.ts`) updated to include Answer Engine Rank + Insights with engineered icons; labels stay consistent across sidebar, mobile nav, and page headers.

## Honesty & data
Keep marketing/metric honesty per project rules. New-feature numbers are clearly derived/estimated from real account data or AI; no fabricated hard stats. Real Semrush wiring stays an optional enhancement with AI fallback.

## Technical notes
- No schema changes required for Part 1–2. Part 3 "Answer Engine Rank" can start fully client/AI-derived; if we later persist visibility snapshots, that's an additive table (with GRANTs + RLS) in a follow-up.
- New AI estimation uses the existing Lovable AI gateway via a `*.functions.ts` server function, mirroring `ai.functions.ts`.
- All new routes live under `_authenticated/`, reuse shared primitives, and define their own `head()` metadata.

## Suggested order
1. Shared primitives (Part 1) → 2. Articles + Calendar → 3. Keyword Lab + Settings + Billing + Editor → 4. Answer Engine Rank → 5. Insights → 6. Content Gap Radar.