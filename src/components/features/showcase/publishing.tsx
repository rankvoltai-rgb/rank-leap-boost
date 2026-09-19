import { CheckCircle2, Clock, Code2, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { BrandMark } from "@/components/landing/shared";
import { Chip, Label, LiveDot, Panel, ProductWindow, useCycle, useInView, type Tone } from "./kit";

const WEEK = [
  { day: "Mon", date: "14", title: "Best Project Tools for Small Teams" },
  { day: "Tue", date: "15", title: "Kanban vs Scrum: Which to Pick" },
  { day: "Wed", date: "16", title: "How to Run a Sprint Without Chaos" },
  { day: "Thu", date: "17", title: "Free Planning Apps Worth Trying" },
  { day: "Fri", date: "18", title: "Async Standups That Actually Work" },
];

/* Wednesday's article walks through the pipeline; the rest hold still. */
const STAGES: { label: string; tone: Tone }[] = [
  { label: "Queued", tone: "muted" },
  { label: "Writing", tone: "volt" },
  { label: "Scoring", tone: "warning" },
  { label: "Published", tone: "success" },
];

export function PublishingHero({ className }: { className?: string }) {
  const [ref, inView] = useInView<HTMLDivElement>();
  const stage = useCycle(STAGES.length + 1, 1500, 3, inView);
  const live = Math.min(stage, STAGES.length - 1);
  const published = live === STAGES.length - 1;

  return (
    <div ref={ref} className={cn("flex flex-col", className)}>
      <ProductWindow title="Auto-Publishing" icon={Send} className="flex-1">
        <div className="flex flex-1 flex-col gap-4 p-5">
          {/* connection */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-2 rounded-lg border border-border bg-surface px-2.5 py-1.5 text-xs font-medium text-ink">
              <BrandMark name="WordPress" className="h-5 w-5" />
              plannora.io/blog
              <span className="flex items-center gap-1 text-[0.65rem] font-semibold text-success">
                <LiveDot /> Connected
              </span>
            </span>
            <span className="flex items-center gap-1.5 rounded-lg border border-border bg-surface px-2.5 py-1.5 text-xs font-medium text-ink">
              <Clock className="h-3.5 w-3.5 text-muted-foreground" /> Daily · 9:00 AM
            </span>
          </div>

          {/* week */}
          <div className="space-y-1.5">
            <Label right="This week">Schedule</Label>
            {WEEK.map((a, i) => {
              const s = i < 2 ? STAGES[3] : i === 2 ? STAGES[live] : STAGES[0];
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

          {/* toast */}
          <div
            className={cn(
              "mt-auto flex items-center gap-3 rounded-lg border border-success/30 bg-success/10 px-3 py-2.5 transition-all duration-500",
              published ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0",
            )}
            aria-hidden={!published}
          >
            <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />
            <span className="min-w-0 text-xs text-ink">
              <span className="font-semibold">Published</span>{" "}
              <span className="text-muted-foreground">
                to plannora.io/blog/how-to-run-a-sprint · 9:00 AM
              </span>
            </span>
          </div>

          <div className="flex items-center justify-between gap-3 border-t border-border pt-3.5">
            <span className="text-[0.65rem] text-muted-foreground">Publishes to</span>
            <span className="flex items-center gap-1.5">
              {["WordPress", "Webflow", "Shopify", "Wix", "Framer"].map((p) => (
                <BrandMark key={p} name={p} className="h-6 w-6" />
              ))}
              <span className="flex h-6 items-center gap-1 rounded-lg bg-ink px-1.5 text-[0.6rem] font-semibold text-background">
                <Code2 className="h-3 w-3" /> API
              </span>
            </span>
          </div>
        </div>
      </ProductWindow>
    </div>
  );
}

/* ---------- Benefits ---------- */

const PLATFORMS = [
  ["WordPress", true],
  ["Webflow", false],
  ["Shopify", false],
  ["Wix", false],
  ["Framer", false],
] as const;

function Integrations() {
  return (
    <Panel>
      <div className="grid gap-1.5 sm:grid-cols-2">
        {PLATFORMS.map(([p, on]) => (
          <div
            key={p}
            className="flex items-center gap-2.5 rounded-lg bg-card px-3 py-2 ring-1 ring-border"
          >
            <BrandMark name={p} className="h-6 w-6" />
            <span className="flex-1 text-xs font-medium text-ink">{p}</span>
            {on ? (
              <Chip tone="success" dot>
                Connected
              </Chip>
            ) : (
              <span className="rounded-md border border-border px-2 py-0.5 text-[0.65rem] font-semibold text-ink">
                Connect
              </span>
            )}
          </div>
        ))}
        <div className="flex items-center gap-2.5 rounded-lg bg-card px-3 py-2 ring-1 ring-border">
          <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-ink text-background">
            <Code2 className="h-3.5 w-3.5" />
          </span>
          <span className="flex-1 text-xs font-medium text-ink">REST API</span>
          <span className="rounded-md border border-border px-2 py-0.5 text-[0.65rem] font-semibold text-ink">
            Get key
          </span>
        </div>
      </div>

      <div className="mt-4 rounded-lg bg-card p-3 ring-1 ring-border">
        <Label right="2 min ago">Latest post</Label>
        <div className="mt-2 flex items-start gap-2.5">
          <BrandMark name="WordPress" className="mt-0.5 h-6 w-6 shrink-0" />
          <div className="min-w-0">
            <p className="truncate text-xs font-semibold text-ink">
              How to Run a Sprint Without Chaos
            </p>
            <p className="truncate font-mono text-[0.65rem] text-muted-foreground">
              plannora.io/blog/how-to-run-a-sprint-without-chaos
            </p>
          </div>
        </div>
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          <Chip tone="success">Native post</Chip>
          <Chip>Your theme</Chip>
          <Chip>Featured image</Chip>
          <Chip>Meta description</Chip>
        </div>
      </div>
    </Panel>
  );
}

/* September 2026 starts on a Tuesday. */
const MONTH_OFFSET = 1;
const TODAY = 16;

function Schedule() {
  return (
    <Panel className="flex h-full flex-col">
      <div className="flex items-center gap-1 rounded-lg bg-card p-1 ring-1 ring-border">
        {["Daily", "3× a week", "Weekly"].map((c, i) => (
          <span
            key={c}
            className={cn(
              "flex-1 rounded-md py-1 text-center text-[0.7rem] font-medium",
              i === 0 ? "bg-ink text-background" : "text-muted-foreground",
            )}
          >
            {c}
          </span>
        ))}
      </div>
      <div className="mt-3 grid grid-cols-7 gap-1 text-center text-[0.55rem] font-semibold uppercase text-muted-foreground">
        {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
          <span key={i}>{d}</span>
        ))}
      </div>
      <div className="mt-1 grid grid-cols-7 gap-1">
        {Array.from({ length: MONTH_OFFSET }).map((_, i) => (
          <span key={`o${i}`} />
        ))}
        {Array.from({ length: 30 }).map((_, i) => {
          const d = i + 1;
          const done = d < TODAY;
          const today = d === TODAY;
          return (
            <span
              key={d}
              className={cn(
                "flex h-6 items-center justify-center rounded-md text-[0.6rem] font-medium tabular-nums",
                done && "bg-success/15 text-success",
                today && "bg-volt text-white",
                !done && !today && "bg-card text-muted-foreground ring-1 ring-border",
              )}
            >
              {d}
            </span>
          );
        })}
      </div>
      <p className="mt-3 text-[0.65rem] text-muted-foreground">
        <span className="font-semibold text-ink">15 published</span> · next at 9:00 AM
      </p>
    </Panel>
  );
}

function ApiSnippet() {
  return (
    <div className="h-full overflow-hidden rounded-xl border border-border bg-hero-black text-[0.7rem] leading-relaxed text-white/80">
      <div className="flex items-center gap-2 border-b border-white/10 px-4 py-2.5">
        <span className="rounded bg-success/20 px-1.5 py-0.5 font-mono text-[0.6rem] font-semibold text-emerald-300">
          GET
        </span>
        <span className="truncate font-mono text-white/70">
          /api/public/v1/articles?since=2026-09-15
        </span>
      </div>
      <pre className="overflow-x-auto px-4 py-3.5 font-mono">
        <code>
          <span className="text-white/45">Authorization: Bearer rv_live_••••••••</span>
          {"\n\n"}
          <span className="text-emerald-300">200 OK</span>
          {"\n"}
          {"{\n"}
          {'  "articles": [{\n'}
          {'    "title": '}
          <span className="text-sky-300">&quot;How to Run a Sprint Without Chaos&quot;</span>
          {",\n"}
          {'    "slug": '}
          <span className="text-sky-300">&quot;how-to-run-a-sprint-without-chaos&quot;</span>
          {",\n"}
          {'    "body_html": '}
          <span className="text-sky-300">&quot;&lt;h2&gt;Plan the sprint in…&quot;</span>
          {",\n"}
          {'    "tags": ['}
          <span className="text-sky-300">&quot;sprints&quot;</span>
          {"],\n"}
          {'    "seo_score": '}
          <span className="text-amber-300">94</span>
          {"\n  }]\n}"}
        </code>
      </pre>
    </div>
  );
}

export const publishingBenefits = [Integrations, Schedule, ApiSnippet];
