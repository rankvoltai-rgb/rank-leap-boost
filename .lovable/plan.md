# OmniRank Dashboard — Full Build Plan

A fully functional, light-mode SEO blog engine dashboard. Backend on Lovable Cloud, AI blog generation/editing via Lovable AI, and real credit purchases via Stripe. Design language stays Notion / Linear / Stripe: clean, monochrome, subtle borders, low radius, no gradients, no shadows — built on the existing light design tokens in `src/styles.css`.

## Prerequisites (one-time setup)

1. **Lovable Cloud** — enabled for auth + data persistence (blogs, keywords, credits, settings).
2. **Lovable AI** — `LOVABLE_API_KEY` for generation and AI edits.
3. **Stripe payments** — required for real credit purchases. Needs a Pro plan. If you'd rather not enable Stripe now, I'll stub the purchase flow (UI + simulated success that still updates the credit balance) and you can swap in real checkout later.

## Phase 0 — Auth & Account Foundation

- Wire the existing `/auth` screen to real signup/login (email/password + Google). Keep all current copy and the split-column layout.
- `profiles` table (brand name, website URL, product description, avatar) auto-created on signup via trigger; populated by the existing `/onboarding` flow, which becomes a real persisted step.
- Integration-managed `_authenticated` route gate; dashboard lives under it. Sign-out hygiene wired in.
- After onboarding → redirect into `/dashboard`.

## Phase 1 — Dashboard Shell

- Persistent left sidebar: System Console, Blog Engine, Calendar, Keyword Planner, Settings (Settings expands to its 3 sub-pages). Active-route highlighting via TanStack `Link`.
- Top bar: account avatar (dropdown: profile, sign out) + live credit-balance indicator.
- Main content area renders the active page. Collapsible sidebar.
- Shared dashboard primitives (StatCard, Panel, Pill, ghost/solid buttons, OverlayModal) matching the minimal aesthetic.

## Phase 2 — Database Schema

Tables (all RLS-scoped to `auth.uid()`, with grants):
- `blogs` — title, description, body (rich text/markdown), status (`opportunity` | `scheduled` | `generating` | `finished`), tags[], seo_score, traffic_estimate, keyword, competition, ai_signal, scheduled_date, queue_position, notes.
- `keywords` — name, tag, search_volume, traffic_estimate, intent, trend, source (`library` | `discovered`).
- `credit_accounts` — credits_used, credits_total.
- `credit_transactions` — package, amount, status (for purchase history).
- `content_settings` — tone, writing_style, audience, brand_voice.
- Seed each new account with realistic demo data (opportunities, blogs, keywords, 320/1000 credits).

## Phase 3 — System Console (Home)

- Stats bar: Estimated Traffic (large primary), Keyword Score, AI Algorithm Signals ("secret sauce"), Status toggle pill (Online/Offline).
- Content Radar grid of opportunity cards: Keyword, Est. Traffic, Competition, AI Signal Score, "Add to Queue" CTA.
- "Add to Queue" persists the opportunity as a scheduled blog AND increments the Estimated Traffic stat with an animated counter (the dopamine micro-interaction).

## Phase 4 — Blog Engine + Editor + AI

- Stats bar: Blogs Scheduled, Blogs Finished, Traffic Estimate, Total.
- **Generated Blogs**: 8 most recent + "Show All". Cards: title, description, tags, actions Details / Edit / Delete.
- **Scheduled Blogs**: 15 default + Show All. Cards: title, description, tags, actions Prioritize / Generate / Reschedule / Delete.
  - Prioritize → set queue_position to #1, displace others.
  - Generate → open editor, show generating indicator, stream AI-generated blog, then activate right sidebar.
  - Reschedule → navigate to Calendar with this blog pre-selected.
- **Google-Docs-style editor** (shared route, reused by Calendar):
  - Read mode by default, white document canvas, hover-revealed "Edit" button.
  - Edit mode: inline editing; floating toolbar on text selection with Rewrite / Expand / Shorten / Improve SEO / Change Tone / AI Suggest Edits (each calls Lovable AI on the selection). Autosave with "Saved" indicator.
  - Right sidebar: read mode → SEO Score, Est. Traffic, Tags, Regenerate, Leave Note; edit mode → the AI section actions.
- **Delete** (both sections): 2-phase — confirmation modal "This action cannot be undone" requiring the user to type "Delete", then hard-delete from backend.

## Phase 5 — Calendar

- Toggle tabs: Monthly (default) / Weekly / Today.
- Monthly grid: blog titles as stacked line items per date; overflow → "+N more" pill expanding into a scrollable day view.
- Weekly: 7-column blocks. Today: single-day list with status indicators.
- Click a blog → opens the shared Docs-style editor. Supports the "pre-selected blog" deep-link from Reschedule.

## Phase 6 — Keyword Planner

- Dominant full-width keyword search input + "AI Keyword Discovery" button (Lovable AI generates related keyword clusters from the account's business context, written into the results grid).
- "Discovered Keywords" results grid: 30 per page (toggle 100). Card: keyword, tag, search volume, traffic estimate, actions Add / Research / Delete.
- Click card → Keyword Detail Overlay: large keyword title, tag row (intent/volume/competition), trend indicator (High/Med/Low with arrow), close.

## Phase 7 — Settings (3 sub-pages)

- **/settings/keywords** — keyword library table (1 per row, Remove action), search + "Add Keyword" overlay (text input submit-on-Enter OR CSV upload).
- **/settings/credit-usage** — Credits Used / Remaining / "Add Credits"; progress bar color by usage (green <60%, yellow 60–85%, red >85%). Add Credits overlay with usage snapshot and 4 packages (Starter $99, Growth $185 ✦Recommended, Scale $370, Power $720) → Stripe checkout (or stubbed success) that updates the balance.
- **/settings/llm-style** — pill selectors (Tone, Writing Style w/ Balanced default, Audience), Brand Voice textarea, locked core-rules block ("Managed by OmniRank — cannot be overridden"), "Save Settings". Saved settings are injected into every generation/regeneration/AI-edit prompt.

## Technical Notes

- Routes under `src/routes/_authenticated/dashboard.*` (flat dot convention); editor as a shared route with a `blogId` param.
- AI calls via `createServerFn` (one-shot: generate, keyword discovery, section edits) using the Lovable AI gateway provider helper; streaming generation through a server route if needed. `content_settings` + profile context appended to all prompts server-side.
- Stripe credit packages created via the payments product flow; checkout + webhook updates `credit_accounts`.
- All data reads via `createServerFn` + TanStack Query (`ensureQueryData` / `useSuspenseQuery`); mutations invalidate queries.
- Light-mode only; reuse existing tokens, add minimal dashboard-specific component styles. No gradients/shadows on dashboard surfaces.

## Suggested order of delivery

Phase 0–2 first (auth, shell, schema) so there's a working signed-in dashboard, then build pages 3→7. Given the size, this will span several iterations.
