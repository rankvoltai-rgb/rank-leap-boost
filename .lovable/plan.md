## Goal

Make Rankvolt feel like a smart autopilot that's effortless to navigate. The app's promise — "content that gets cited by AI and drives traffic" — should be visible from the first scan and require almost no manual work. Sequenced per your priorities: Onboarding → Dashboard → Navigation → Content & Calendar. Real Semrush data replaces simulated metrics. Reward moments are engineered into every meaningful action.

---

## 1. Onboarding (keep card-first, kill the friction)

Keep the credit-card-before-dashboard gate, but make every step feel inevitable and rewarding.

- **Clearer 4-step rhythm.** Keep Details → Analysis → Growth plan → Activate, but tighten copy so each step says what just happened and what's next ("We found 24 gaps AI isn't answering yet").
- **Value before the card.** The "Growth plan" step becomes the hero moment: animated traffic projection, top opportunities, and an "AI visibility" readout — so the card step feels like unlocking something already built.
- **Real numbers from Semrush.** The scan pulls real search volume, difficulty, and competitor gaps (see §5) instead of AI guesses, shown with source attribution.
- **Calmer checkout.** Reassurance row ("48h free · cancel anytime · no charge today"), a plain-language "what happens after you activate" mini-timeline, and clear trial-end date.
- **Reward beats.** Confetti/particle burst when the plan is revealed; a satisfying "Plan activated" state on checkout success.
- **Mobile pass.** The whole flow audited for small screens (the checkout split already handles it; the card steps get the grid/min-w-0/truncate treatment).

## 2. Dashboard — autopilot by default, with override

The Overview becomes an autopilot cockpit, not a to-do list.

- **Autopilot engine.** On trial activation, top opportunities are auto-queued and auto-scheduled (1/day by default). A daily background job generates the next queued article automatically. No manual "Add to Queue" / "Generate" required.
- **Autopilot control card.** A prominent toggle (On/Paused) plus a cadence selector (e.g. 1, 3, 5, 7 articles/week). This is the single most important control on the page.
- **Override everywhere.** Users can still pause autopilot, reorder the queue, remove an article, or generate one immediately — manual actions become optional power-ups, not chores.
- **Status-first layout.** "What autopilot is doing right now" (next publish, what's writing, last published) sits at the top. Stat cards (traffic, opportunity strength, credits) stay but read as outcomes.
- **Dopamine layer.** Animated count-ups on traffic, a weekly growth sparkline, milestone toasts ("🎉 10th article published"), a publishing streak indicator, and a subtle progress ring toward the monthly goal.

## 3. Navigation — consistent and mobile-complete

- **Mobile navigation (currently missing entirely).** Add a hamburger + slide-over nav for the dashboard so the sidebar's links are reachable below `md`.
- **One vocabulary.** Align sidebar labels, page titles, and tab names so a section is called the same thing everywhere. Proposed: **Overview, Articles, Calendar, Keyword Lab** (+ Plan & Billing, Settings). Removes today's mismatch (sidebar "Content Studio" vs page "Content Studio" vs tabs "Ideas/Scheduled/Published"; "Keyword Research" vs "Keyword Planner").
- **TopBar upgrade.** Show the current page name, keep the credits pill (make it a quick link to billing when low), and turn the avatar into an account menu (Settings, Billing, Sign out) instead of a bare logout icon.
- **Smart empty states.** Every empty list gets a one-line explanation + a single primary action that routes the user to the next logical step.

## 4. Content & Calendar polish

- **Articles (studio).** Clearer tabs (Ideas / Scheduled / Published), status badges that reflect autopilot ("Auto-writing", "Auto-published"), and consistent primary actions.
- **Calendar.** Reads as the autopilot schedule; reschedule/prioritize stay as overrides. Empty state points back to autopilot.
- **Publish reward.** Confetti + a shareable "published" confirmation when an article goes live.

## 5. Real Semrush data

- Connect the Semrush connector (you'll get a one-click authorize prompt).
- Add server functions that call the Semrush gateway for: keyword volume/difficulty/CPC, related + question keywords, and competitor gap keywords.
- Surface this in the onboarding scan and the Keyword Lab (real metrics, "Source: Semrush" labels, graceful fallback to current AI estimates if the quota is hit or the account isn't connected).

---

## Technical notes

- **Autopilot scheduling:** add an `autopilot_enabled` flag and a `weekly_cadence` value (on the existing `content_settings` or `credit_accounts`-adjacent settings; migration with GRANTs + RLS scoped to `auth.uid()`). A `pg_cron` job hits a secured `/api/public/hooks/autopilot-run` route daily that, per active user, generates the next due queued article via the existing `generateBlogArticle` pipeline. Respects credits.
- **Semrush:** new `src/lib/semrush.server.ts` (gateway calls, reads `LOVABLE_API_KEY` + `SEMRUSH_API_KEY` server-side) and `src/lib/semrush.functions.ts` (`createServerFn` wrappers). Wire into `research.server.ts`/onboarding and Keyword Lab. Connector linked via the connect flow.
- **Navigation:** extend `Sidebar.tsx` content into a shared nav config reused by a new mobile slide-over (shadcn `Sheet`); update `TopBar.tsx` with page title + account dropdown; rename labels in `Sidebar`, page headers, and tab arrays.
- **Dashboard:** reorganize `dashboard.index.tsx` around the autopilot status + control card; add reward primitives (count-up, streak, milestone toasts, confetti) using existing tokens. No hardcoded colors — semantic tokens only.
- **Reward engineering:** lightweight confetti/particle component (reuse the existing `Burst` pattern), milestone detection on publish, streak from published-article dates.
- All new tables/columns get GRANTs + RLS in the same migration; no secrets exposed to the client; Semrush + autopilot logic stays server-side.

## Out of scope (unless you want it)

Rewriting the AI article generation prompts, new billing tiers, team/multi-user features, and email notifications. I can fold any of these in if you'd like.
