# Build out the rest of the dashboard

Complete the four outstanding areas of the Rankvolt dashboard using real data from the backend. No mock/seed fallbacks — each page reads live from the database and shows a clean empty state when there's nothing.

## What exists today
- Working pages: **System Console** (`/dashboard`), **Blog Engine** (`/dashboard/blog-engine`), **Billing** (`/dashboard/billing`, not linked in the sidebar).
- Sidebar lists Calendar, Keyword Planner, Settings as disabled "soon" buttons.
- The data layer (`src/lib/api.ts`) already exposes almost everything needed: `listBlogs`, `updateBlog`, `prioritizeBlog`, `deleteBlog`, `listKeywords`, `addKeyword`, `deleteKeyword`, `getProfile`, `getSettings`, `updateSettings`, `getCredits`, `purchaseCredits`.
- Reusable UI primitives: `Panel`, `StatCard`, `Pill`, `Button`, `PageHeader` (`src/components/dashboard/primitives.tsx`).

## 1. Sidebar nav (`src/components/dashboard/Sidebar.tsx`)
Replace the placeholder NAV with real, ready routes and correct active-state matching:
- System Console → `/dashboard`
- Blog Engine → `/dashboard/blog-engine`
- Calendar → `/dashboard/calendar`
- Keyword Planner → `/dashboard/keywords`
- Billing → `/dashboard/billing` (CreditCard icon)
- Settings → `/dashboard/settings`

Fix active highlighting so child routes (e.g. `/dashboard/blog-engine`) match correctly rather than only exact `===` on `/dashboard`.

## 2. Calendar (`src/routes/_authenticated/dashboard.calendar.tsx`)
A publishing schedule for queued content.
- Loads scheduled/generating blogs via `listBlogs("scheduled")` + `listBlogs("generating")`, grouped by `scheduled_date`.
- Header stat row: items in queue, next publish date, total estimated traffic in queue.
- A simple ordered timeline/agenda grouped by date (upcoming dates as sections, each showing the blogs with title, keyword pill, traffic pill).
- Per-item actions: **Prioritize** (calls `prioritizeBlog`, moves to top) and **Reschedule** date via a date picker (shadcn `Calendar` in a popover, writes `scheduled_date` through `updateBlog`).
- Empty state when nothing is queued, with a link to the Blog Engine opportunities.

## 3. Keyword Planner (`src/routes/_authenticated/dashboard.keywords.tsx`)
Manage the keyword library and review AI-discovered keywords.
- Two tabs: **Library** (`listKeywords("library")`) and **Discovered** (`listKeywords("discovered")`).
- Add-keyword input (adds to library via `addKeyword`), remove per row via `deleteKeyword`.
- Table/cards showing name, search volume, intent, trend (as pills), source.
- Stat row: total keywords, total tracked search volume, count of high-intent keywords.
- Empty states per tab.

## 4. Settings (`src/routes/_authenticated/dashboard.settings.tsx`)
- **Brand profile** form: brand name, website URL, product description — loaded from `getProfile`, saved via a new `updateProfile` helper (added to `api.ts`, upsert by `user_id`).
- **Content preferences** form: tone, writing style, audience, brand voice — loaded from `getSettings`, saved via existing `updateSettings`.
- **Credits**: show remaining/used from `getCredits`, plus a small "buy credits" section offering 2–3 packages that call existing `purchaseCredits`. (Note below on payments.)
- Save buttons with toast feedback and query invalidation.

## 5. Small API addition (`src/lib/api.ts`)
Add `updateProfile(patch)` (upsert profile row by `user_id`) since only an onboarding-time profile writer exists today. No other backend/schema changes — all required tables (`blogs`, `keywords`, `profiles`, `content_settings`, `credit_accounts`, `credit_transactions`) and RLS already exist.

## Technical notes
- Each route follows the existing pattern: `createFileRoute` + `useQuery`/`useQueryClient`, `useServerFn` only where needed (none of these need new server functions). Reuse `PageHeader`, `Panel`, `StatCard`, `Pill`, `Button`.
- Date picker uses the existing shadcn `Calendar` + `Popover` with `pointer-events-auto`.
- `purchaseCredits` currently writes a credit transaction and bumps the balance directly (no Stripe charge). This is the existing behavior; I'll wire the Settings "buy credits" UI to it as-is. If you want real Stripe-charged credit top-ups instead, tell me and I'll add a checkout flow — otherwise it stays as the current in-app grant.
- All new `<Link to="...">` targets correspond to the new route files, created in the same pass so the router type-checks.

## Out of scope
No changes to onboarding, landing pages, payments server functions, or database schema (beyond using existing tables).