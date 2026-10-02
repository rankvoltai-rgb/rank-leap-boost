/**
 * Auto-Publishing's product visuals. Each one shows a mechanic the code has:
 * the API path that works for any site today, the connector ledger that never
 * overwrites a post edited in the CMS, the SEO checks every draft runs, and
 * the dashboard's real pace options. Nothing here shows a time-of-day setting,
 * an approval queue, images, or a connector as live before its flag says so.
 */
import { CalendarDays, CheckCircle2, Code2, Pencil, Send, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { BrandMark } from "@/components/landing/shared";
import {
  API_BASE,
  DESTINATIONS,
  PACE_OPTIONS,
  destinationsIn,
  paceOptionLabel,
} from "@/data/auto-publishing";
import { PLAN } from "@/data/pricing";
import {
  Chip,
  Label,
  LiveDot,
  Meter,
  Panel,
  ProductWindow,
  Row,
  Tick,
  useCycle,
  useInView,
  type Tone,
} from "./kit";

const WEEK = [
  { day: "Mon", date: "14", title: "Best Project Tools for Small Teams" },
  { day: "Tue", date: "15", title: "Kanban vs Scrum: Which to Pick" },
  { day: "Wed", date: "16", title: "How to Run a Sprint Without Chaos" },
  { day: "Thu", date: "17", title: "Free Planning Apps Worth Trying" },
  { day: "Fri", date: "18", title: "Async Standups That Actually Work" },
];

/* Wednesday's article walks the real pipeline; the rest hold still. "Live"
   is the moment the site reports the URL back through the API. */
const STAGES: { label: string; tone: Tone }[] = [
  { label: "Scheduled", tone: "muted" },
  { label: "Writing", tone: "volt" },
  { label: "Checking", tone: "warning" },
  { label: "Finished", tone: "volt" },
  { label: "Live", tone: "success" },
];
const LIVE = STAGES.length - 1;

export function PublishingHero({ className }: { className?: string }) {
  const [ref, inView] = useInView<HTMLDivElement>();
  // One extra beat on "Live" before the loop restarts.
  const stage = useCycle(STAGES.length + 1, 1400, LIVE, inView);
  const current = Math.min(stage, LIVE);
  const live = current === LIVE;
  const liveConnectors = destinationsIn("available").filter((d) => d.id !== "api");

  return (
    <div ref={ref} className={cn("flex flex-col", className)}>
      <ProductWindow title="Auto-Publishing" icon={Send} className="flex-1">
        <div className="flex flex-1 flex-col gap-4 p-5">
          {/* connection + pace */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-2 rounded-lg border border-border bg-surface px-2.5 py-1.5 text-xs font-medium text-ink">
              <span className="flex h-5 w-5 items-center justify-center rounded-md bg-hero-black text-white">
                <Code2 className="h-3 w-3" />
              </span>
              plannora.io
              <span className="flex items-center gap-1 text-[0.65rem] font-semibold text-success">
                <LiveDot /> API connected
              </span>
            </span>
            <span className="flex items-center gap-1.5 rounded-lg border border-border bg-surface px-2.5 py-1.5 text-xs font-medium text-ink">
              <CalendarDays className="h-3.5 w-3.5 text-muted-foreground" /> 5 a week
            </span>
          </div>

          {/* week */}
          <div className="space-y-1.5">
            <Label right="This week">Calendar</Label>
            {WEEK.map((a, i) => {
              const s = i < 2 ? STAGES[LIVE] : i === 2 ? STAGES[current] : STAGES[0];
              const today = i === 2;
              return (
                <div
                  key={a.day}
                  className={cn(
                    "flex items-center gap-3 rounded-lg border bg-card px-3 py-2.5 transition-all duration-300",
                    today ? "border-volt/40 shadow-sm ring-1 ring-volt/20" : "border-border",
                  )}
                >
                  <span className="flex w-9 shrink-0 flex-col items-center leading-none">
                    <span className="text-[0.6rem] font-semibold uppercase text-muted-foreground">
                      {a.day}
                    </span>
                    <span className="mt-1 text-sm font-semibold text-ink tabular-nums">
                      {a.date}
                    </span>
                  </span>
                  <span className="min-w-0 flex-1 truncate text-[0.8rem] font-medium text-ink">
                    {a.title}
                  </span>
                  <Chip tone={s.tone} dot>
                    {s.label}
                  </Chip>
                </div>
              );
            })}
          </div>

          {/* the site reports the live URL back */}
          <div
            className={cn(
              "mt-auto flex items-center gap-3 rounded-lg border border-success/30 bg-success/10 px-3 py-2.5 transition-all duration-500 motion-reduce:transition-none",
              live ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0",
            )}
            aria-hidden={!live}
          >
            <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />
            <span className="min-w-0 truncate text-xs text-ink">
              <span className="font-semibold">Live URL reported</span>{" "}
              <span className="font-mono text-muted-foreground">
                plannora.io/blog/how-to-run-a-sprint
              </span>
            </span>
          </div>

          <div className="flex items-center justify-between gap-3 border-t border-border pt-3.5">
            <span className="text-[0.65rem] text-muted-foreground">Delivered through</span>
            <span className="flex items-center gap-1.5">
              {liveConnectors.map((d) => (
                <BrandMark key={d.id} name={d.name} className="h-6 w-6" />
              ))}
              <span className="flex h-6 items-center gap-1 rounded-lg bg-hero-black px-1.5 text-[0.6rem] font-semibold text-white">
                <Code2 className="h-3 w-3" /> Publishing API
              </span>
            </span>
          </div>
        </div>
      </ProductWindow>
    </div>
  );
}

/* ---------- Benefits ---------- */

/** "Your edits win": the connector's record of each post it created. */
function EditsLedger() {
  const webflow = DESTINATIONS.find((d) => d.id === "webflow");
  const rows: { title: string; note: string; icon?: typeof Pencil; chip: string; tone: Tone }[] = [
    {
      title: "How to Run a Sprint Without Chaos",
      note: "Changed in Rankbox",
      chip: "Updated",
      tone: "success",
    },
    {
      title: "Best Project Tools for Small Teams",
      note: "No changes",
      chip: "In sync",
      tone: "success",
    },
    {
      title: "Kanban vs Scrum: Which to Pick",
      note: "Edited in Webflow",
      icon: Pencil,
      chip: "Left as is",
      tone: "muted",
    },
    {
      title: "Free Planning Apps Worth Trying",
      note: "Deleted in Webflow",
      icon: Trash2,
      chip: "Not re-created",
      tone: "muted",
    },
  ];
  return (
    <Panel>
      <div className="flex items-center justify-between gap-2">
        <span className="flex items-center gap-2 text-xs font-semibold text-ink">
          <BrandMark name="Webflow" className="h-5 w-5" /> Webflow sync
        </span>
        {webflow && webflow.stage !== "available" && (
          // Ink text on the amber wash: the kit's warning chip is under 4.5:1.
          <span className="rounded-md bg-warning/15 px-1.5 py-0.5 text-[0.6rem] font-semibold uppercase tracking-[0.06em] text-ink ring-1 ring-warning/30">
            Awaiting approval
          </span>
        )}
      </div>
      <div className="mt-3 space-y-1.5">
        {rows.map((r) => {
          const Icon = r.icon;
          return (
            <Row key={r.title}>
              <span className="min-w-0">
                <span className="block truncate text-xs font-medium text-ink">{r.title}</span>
                <span className="mt-0.5 flex items-center gap-1 text-[0.65rem] text-muted-foreground">
                  {Icon && <Icon aria-hidden className="h-3 w-3" />}
                  {r.note}
                </span>
              </span>
              <Chip tone={r.tone}>{r.chip}</Chip>
            </Row>
          );
        })}
      </div>
      <p className="mt-3 font-mono text-[0.65rem] text-muted-foreground">
        slug kept: /blog/kanban-vs-scrum-which-to-pick
      </p>
    </Panel>
  );
}

/** "Checked before it's finished": the real check names from seo-analysis.ts. */
const CHECKS = [
  "Keyword in title",
  "Keyword in introduction",
  "Section structure",
  "Scannable lists",
  "FAQ for AI engines",
  "Meta description",
];

function SeoChecks() {
  return (
    <Panel className="flex h-full flex-col">
      <Label right="1 revision">SEO checks</Label>
      <ul className="mt-3 space-y-1.5">
        {CHECKS.map((c) => (
          <li key={c}>
            <Row className="py-1.5">
              <span className="text-xs text-ink">{c}</span>
              <Tick ok />
            </Row>
          </li>
        ))}
      </ul>
      <p className="mt-auto pt-3 text-[0.7rem] text-muted-foreground">
        <span className="font-semibold text-ink">All checks pass</span> · marked finished
      </p>
    </Panel>
  );
}

/** "Paced and capped": the dashboard's pace options and the monthly cap. */
function PaceAndCap() {
  const used = 18;
  return (
    <Panel>
      <div className="flex flex-wrap gap-1.5" aria-hidden>
        {PACE_OPTIONS.map((n) => (
          <span
            key={n}
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-medium",
              n === 5
                ? "border-cta bg-cta text-white"
                : "border-border bg-card text-muted-foreground",
            )}
          >
            {paceOptionLabel(n)}
          </span>
        ))}
      </div>
      <div className="mt-4 rounded-lg bg-card p-3 ring-1 ring-border">
        <Label right={`${used} of ${PLAN.articlesPerMonth}`}>This month</Label>
        <Meter value={(used / PLAN.articlesPerMonth) * 100} className="mt-2.5" />
        <p className="mt-2.5 text-[0.7rem] text-muted-foreground">
          Autopilot stops at {PLAN.articlesPerMonth} and picks up again next month.
        </p>
      </div>
      <div className="mt-3 flex items-center justify-between rounded-lg bg-card px-3 py-2 ring-1 ring-border">
        <span className="text-xs font-medium text-ink">Write automatically</span>
        <span className="flex h-5 w-9 items-center rounded-full bg-cta p-0.5">
          <span className="ml-auto h-4 w-4 rounded-full bg-white shadow-sm" />
        </span>
      </div>
    </Panel>
  );
}

export const publishingBenefits = [EditsLedger, SeoChecks, PaceAndCap];

/* ---------- The API, as a request and its response ---------- */

export function ApiSnippet({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-border bg-hero-black text-[0.7rem] leading-relaxed text-white/85",
        className,
      )}
    >
      <div className="flex items-center gap-2 border-b border-white/10 px-4 py-2.5">
        <span className="rounded bg-success/20 px-1.5 py-0.5 font-mono text-[0.6rem] font-semibold text-emerald-300">
          GET
        </span>
        <span className="truncate font-mono text-white/80">
          {API_BASE}/articles?since=2026-09-15T00:00:00Z
        </span>
      </div>
      <pre
        className="overflow-x-auto px-4 py-3.5 font-mono"
        tabIndex={0}
        aria-label="Sample API response"
      >
        <code>
          <span className="text-white/60">Authorization: Bearer rv_live_a1b2c3…</span>
          {"\n\n"}
          <span className="text-emerald-300">200 OK</span>
          {"\n"}
          {"{\n"}
          {'  "articles": [{\n'}
          {'    "id": '}
          <span className="text-sky-300">&quot;8f3c2a91-…&quot;</span>
          {",\n"}
          {'    "title": '}
          <span className="text-sky-300">&quot;How to Run a Sprint Without Chaos&quot;</span>
          {",\n"}
          {'    "slug": '}
          <span className="text-sky-300">&quot;how-to-run-a-sprint-without-chaos&quot;</span>
          {",\n"}
          {'    "description": '}
          <span className="text-sky-300">&quot;Plan a two-week sprint in…&quot;</span>
          {",\n"}
          {'    "body_html": '}
          <span className="text-sky-300">
            &quot;&lt;h2&gt;Start with one goal&lt;/h2&gt;…&quot;
          </span>
          {",\n"}
          {'    "body_markdown": '}
          <span className="text-sky-300">&quot;## Start with one goal…&quot;</span>
          {",\n"}
          {'    "tags": ['}
          <span className="text-sky-300">&quot;sprints&quot;</span>
          {"],\n"}
          {'    "published_url": '}
          <span className="text-amber-300">null</span>
          {"\n  }],\n"}
          {'  "next_since": '}
          <span className="text-sky-300">&quot;2026-09-16T09:12:04Z&quot;</span>
          {"\n}"}
        </code>
      </pre>
    </div>
  );
}
