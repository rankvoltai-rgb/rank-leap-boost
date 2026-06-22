# Google Calendar–style Calendar

Rebuild `/dashboard/calendar` so it looks and behaves like Google Calendar, while staying wired to the existing `blogs` data (scheduled + generating articles). No backend/schema changes — only the calendar UI and the reads/writes it already uses (`listBlogs`, `updateBlog`, `prioritizeBlog`).

## What it will look like

```text
┌──────────────────────────────────────────────────────────────┐
│  [Today] [‹] [›]   June 2026            [ Month | Week | List ]│
├──────┬──────┬──────┬──────┬──────┬──────┬──────────────────────┤
│ SUN  │ MON  │ TUE  │ WED  │ THU  │ FRI  │ SAT                   │
├──────┼──────┼──────┼──────┼──────┼──────┼──────────────────────┤
│  31  │  1   │  2   │  3   │  4   │  5   │  6                    │
│      │ ▦evt │      │ ▦evt │      │      │                       │
│      │ ▦evt │      │      │      │      │                       │
├──────┼──────┼──────┼──────┼──────┼──────┼──────────────────────┤
│  7   │ [8]  │  9   │ ...  (today highlighted with volt ring)    │
└──────┴──────┴──────┴──────┴──────┴──────┴──────────────────────┘
```

- **Top toolbar:** `Today` button, prev/next month arrows (chevrons), the current period label (e.g. "June 2026"), and a segmented **Month / Week / List** view switcher on the right.
- **Month grid:** classic 7-column layout with weekday headers and 5–6 week rows. Each day cell shows the date number; today gets a filled volt circle on the number; days outside the current month are dimmed. Each cell stacks up to ~3 event chips with a "+N more" overflow that opens that day's list.
- **Event chips:** colored pills with a status dot — scheduled (volt/info) vs generating (animated pulse, "Writing"). Show the article title, truncated.
- **Week view:** the same 7 columns for the current week with taller cells so every event is visible without overflow.
- **List (agenda) view:** the current grouped-by-date layout, kept as a familiar fallback for dense queues.

## Interactions (the "functional" part)

- **Navigate:** prev/next moves by month (month view) or week (week view); `Today` jumps back to the current period and is disabled when already there.
- **Drag to reschedule:** drag an event chip onto another day cell → calls `updateBlog(id, { scheduled_date })`, optimistic UI, toast confirm, and `queryClient.invalidateQueries(["blogs"])`. Drop target highlights on drag-over. (Native HTML5 drag-and-drop — no new dependency.)
- **Click an event:** opens a Popover/detail card anchored to the chip with: title, traffic estimate, keyword, status; and actions **Reschedule** (date picker), **Prioritize** (existing `prioritizeBlog`), and **Open in editor** (link to `/dashboard/editor/$blogId`). The existing reschedule Popover/Calendar is reused inside this card.
- **Click an empty day:** opens that day's agenda list (and, when the queue is empty, shows a CTA pointing to Overview, same as today).
- **Unscheduled items:** a slim "Unscheduled" strip/column above or below the grid holds articles with no `scheduled_date`; dragging one onto a day schedules it.

## Stats row

Keep the three stat cards (In Queue / Next Publish / Queued Traffic) above the calendar, restyled to sit cleanly with the new toolbar.

## Technical details

- File: rewrite `src/routes/_authenticated/dashboard.calendar.tsx`. Optionally extract the grid into `src/components/dashboard/CalendarBoard.tsx` to keep the route readable.
- Data: unchanged — `useQuery(["blogs","calendar"])` fetching `scheduled` + `generating`; mutations via `updateBlog` / `prioritizeBlog` with `useQueryClient` invalidation.
- Dates: use `date-fns` (already installed) — `startOfMonth`, `endOfMonth`, `startOfWeek`, `endOfWeek`, `eachDayOfInterval`, `addMonths`, `addWeeks`, `isSameDay`, `isSameMonth`, `format`. Date keys stay `yyyy-MM-dd` to match `scheduled_date`.
- State: `viewDate` (anchor), `view` ("month" | "week" | "list"), `selectedEvent`, `dragId`. Light entrance/transition polish with `motion` (already installed); respect reduced motion.
- Styling: semantic tokens only (`bg-card`, `border-border`, `text-ink`, `text-muted-foreground`, `volt`, `info`, `success`, `shadow-elevation`). No hardcoded colors. Responsive: month grid on desktop; on small screens default to the List/agenda view since a 7-column grid is cramped on mobile.
- No schema, RLS, or server-function changes.

## Out of scope

- Recurring events, multi-day spanning bars, external Google Calendar sync, and time-of-day hourly grids (articles are day-scheduled, not time-scheduled) — unless you want them as a follow-up.
