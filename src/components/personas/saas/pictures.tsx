/**
 * The small product screens on /use-cases/saas: one per step of the rollout
 * log, one per pick, and the API response that rises from the closing band.
 * All samples on the generic yoursite.com, all decorative (the text beside
 * each one says what it shows), and all still: the hero scene is the page's
 * one moving picture.
 */
import type { ReactNode } from "react";
import { Check, Copy, GitCommitHorizontal, Sparkles } from "lucide-react";
import { IntegrationGlyph } from "@/components/integrations/visuals";
import { RedditMark } from "@/components/landing/ai-logos";
import { cn } from "@/lib/utils";
import { SampleTag } from "./parts";
import { SAMPLE_DOMAIN, SCREEN } from "./tokens";

/* A white screen card with a title row, as the landing's ScreenCard. */
function Screen({
  title,
  meta,
  children,
  className,
}: {
  title: ReactNode;
  meta?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn(SCREEN, "p-4", className)}>
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="min-w-0 truncate text-[0.78rem] font-semibold text-ink">{title}</p>
        {meta ?? <SampleTag />}
      </div>
      {children}
    </div>
  );
}

const ROW =
  "flex items-center justify-between gap-2.5 rounded-lg border border-ink/[0.07] bg-white px-2.5 py-2";

function Bar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="flex items-center justify-between text-[0.68rem]">
        <span className="font-medium text-ink">{label}</span>
        <span className="tabular-nums text-muted-foreground">{value}/100</span>
      </div>
      <span className="mt-1 block h-1.5 overflow-hidden rounded-full bg-ink/[0.06]">
        <span className="block h-full rounded-full bg-cta" style={{ width: `${value}%` }} />
      </span>
    </div>
  );
}

function Tick({ on = true }: { on?: boolean }) {
  return (
    <span
      className={cn(
        "flex h-4 w-4 shrink-0 items-center justify-center rounded-[5px] border",
        on ? "border-cta bg-cta text-white" : "border-ink/[0.18] bg-white text-transparent",
      )}
    >
      <Check className="h-2.5 w-2.5" strokeWidth={3.2} />
    </span>
  );
}

/* ---------- The rollout log ---------- */

/* Day 1: the four ways in. The API is the one picked: it works on any build. */
export function ConnectPicture() {
  const options = [
    { integration: { platform: "webflow", kind: "app", name: "Webflow" }, label: "Webflow app" },
    {
      integration: { platform: "framer", kind: "plugin", name: "Framer" },
      label: "Framer plugin",
    },
    {
      integration: { platform: "wordpress", kind: "plugin", name: "WordPress" },
      label: "WordPress plugin",
    },
    { integration: { kind: "api", name: "REST API" }, label: "REST API", picked: true },
  ] as const;
  return (
    <Screen title={`Connect ${SAMPLE_DOMAIN}`}>
      <div className="grid grid-cols-2 gap-1.5">
        {options.map((o) => {
          const picked = "picked" in o && o.picked;
          return (
            <div
              key={o.label}
              className={cn(
                "flex items-center gap-2 rounded-lg border px-2.5 py-2 text-[0.7rem] font-medium",
                picked
                  ? "border-cta/25 bg-cta-soft text-cta"
                  : "border-ink/[0.07] bg-white text-ink",
              )}
            >
              <IntegrationGlyph integration={o.integration} className="h-5 w-5" />
              <span className="truncate">{o.label}</span>
            </div>
          );
        })}
      </div>
      <div className="mt-2.5 flex items-center gap-2 rounded-lg border border-ink/[0.07] bg-[color-mix(in_oklab,var(--surface)_55%,white)] px-2.5 py-2 font-mono text-[0.64rem] text-ink/70">
        <span className="rounded bg-cta-soft px-1.5 py-0.5 font-semibold text-cta">GET</span>
        /v1/articles
        <span className="ml-auto text-success">200</span>
      </div>
    </Screen>
  );
}

/* Day 1: the map, ranked, waiting on a yes. */
export function ApprovePicture() {
  const rows = [
    ["Kanban vs Gantt for small teams", "Comparison", true],
    ["Alternatives to spreadsheet roadmaps", "Alternatives", true],
    ["How to estimate a project", "How-to", false],
  ] as const;
  return (
    <Screen title="Topic map · ranked">
      <div className="space-y-1.5">
        {rows.map(([q, kind, on], i) => (
          <div key={q} className={ROW}>
            <span className="flex min-w-0 items-center gap-2">
              <span className="w-3 shrink-0 text-[0.62rem] tabular-nums text-muted-foreground">
                {i + 1}
              </span>
              <span className="truncate text-[0.7rem] font-medium text-ink">{q}</span>
            </span>
            <span className="flex shrink-0 items-center gap-2">
              <span className="hidden rounded-md border border-ink/[0.07] px-1.5 py-0.5 text-[0.58rem] font-medium text-muted-foreground min-[400px]:inline">
                {kind}
              </span>
              <Tick on={on} />
            </span>
          </div>
        ))}
      </div>
    </Screen>
  );
}

/* Every day: a sourced draft, graded before anyone reads it. */
export function DraftPicture() {
  return (
    <Screen
      title="How to stop scope creep mid-project"
      meta={
        <span className="shrink-0 rounded-md bg-cta-soft px-1.5 py-0.5 text-[0.6rem] font-semibold text-cta">
          In the editor
        </span>
      }
    >
      <div className="space-y-2.5">
        <Bar label="SEO" value={93} />
        <Bar label="GEO" value={91} />
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {["Your voice", "9 sources", "Meta set"].map((t) => (
          <span
            key={t}
            className="inline-flex items-center gap-1 rounded-md border border-ink/[0.07] bg-white px-1.5 py-0.5 text-[0.62rem] font-medium text-ink/80"
          >
            <Check className="h-2.5 w-2.5 text-success" strokeWidth={3} />
            {t}
          </span>
        ))}
      </div>
    </Screen>
  );
}

/* Every release: the feature's use cases join the map and move up. */
export function ReleasePicture() {
  return (
    <Screen
      title="Writing queue"
      meta={
        <span className="inline-flex shrink-0 items-center gap-1 rounded-md bg-cta px-1.5 py-0.5 font-mono text-[0.6rem] font-semibold text-white">
          <GitCommitHorizontal className="h-3 w-3" />
          v2.4
        </span>
      }
    >
      <div className="space-y-1.5">
        <div className={cn(ROW, "border-cta/25 bg-cta-soft")}>
          <span className="truncate text-[0.7rem] font-medium text-ink">
            Use case: plan a launch on a shared timeline
          </span>
          <span className="shrink-0 rounded-md bg-white px-1.5 py-0.5 text-[0.58rem] font-semibold text-cta ring-1 ring-cta/20">
            New
          </span>
        </div>
        {["Kanban vs Gantt for small teams", "How to stop scope creep"].map((t) => (
          <div key={t} className={ROW}>
            <span className="truncate text-[0.7rem] font-medium text-ink/75">{t}</span>
            <span className="shrink-0 text-[0.6rem] font-medium text-muted-foreground">Queued</span>
          </div>
        ))}
      </div>
    </Screen>
  );
}

/* ---------- The picks ---------- */

export function ResearchScreen() {
  const rows = [
    ["Kanban vs Gantt for small teams", "X vs Y"],
    ["Alternatives to spreadsheet roadmaps", "Alternatives to"],
    ["How do I estimate a project?", "How do I"],
  ] as const;
  return (
    <Screen title="Shortlist questions">
      <div className="space-y-1.5">
        {rows.map(([q, pattern], i) => (
          <div key={q} className={ROW}>
            <span className="flex min-w-0 items-center gap-2">
              <span className="w-3 shrink-0 text-[0.62rem] tabular-nums text-muted-foreground">
                {i + 1}
              </span>
              <span className="truncate text-[0.72rem] font-medium text-ink">{q}</span>
            </span>
            <span className="shrink-0 rounded-md bg-[#f1eefd] px-1.5 py-0.5 text-[0.6rem] font-semibold text-[#6d28d9]">
              {pattern}
            </span>
          </div>
        ))}
      </div>
    </Screen>
  );
}

export function WriterScreen() {
  return (
    <Screen title="Kanban vs Gantt: which fits a small team?">
      <div className="rounded-lg border border-success/25 bg-success/[0.06] px-3 py-2.5">
        <p className="text-[0.6rem] font-semibold uppercase tracking-[0.1em] text-success">
          Direct answer
        </p>
        <p className="mt-1 text-[0.72rem] leading-snug text-ink">
          Kanban suits small teams whose work shifts week to week. Gantt suits fixed deadlines.
        </p>
      </div>
      <div className="mt-2.5 space-y-1.5 px-0.5">
        {[
          ["w-[92%]", "1"],
          ["w-[78%]", "2"],
        ].map(([w, n]) => (
          <div key={n} className="flex items-center gap-2">
            <span className={cn("block h-1.5 rounded-full bg-ink/[0.08]", w)} />
            <span className="shrink-0 rounded bg-cta-soft px-1 text-[0.56rem] font-semibold text-cta">
              [{n}]
            </span>
          </div>
        ))}
      </div>
    </Screen>
  );
}

export function ScoreScreen() {
  return (
    <Screen title="Before it publishes">
      <div className="space-y-2.5">
        <Bar label="SEO score" value={94} />
        <Bar label="GEO score" value={92} />
      </div>
      <div className="mt-3 space-y-1">
        {["Direct answer up top", "Claims linked to sources", "Meta description set"].map((t) => (
          <p key={t} className="flex items-center gap-2 text-[0.7rem] text-ink/80">
            <Check className="h-3 w-3 text-success" strokeWidth={3} />
            {t}
          </p>
        ))}
      </div>
    </Screen>
  );
}

export function RedditScreen() {
  return (
    <Screen
      title={
        <span className="flex items-center gap-1.5">
          <RedditMark className="h-4 w-4" />
          r/SaaS
        </span>
      }
    >
      <p className="text-[0.78rem] font-semibold leading-snug text-ink">
        What do small teams actually use for planning?
      </p>
      <div className="mt-2.5 rounded-lg border border-ink/[0.07] bg-[color-mix(in_oklab,var(--surface)_60%,white)] px-3 py-2.5">
        <p className="flex items-center gap-1.5 text-[0.6rem] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
          <Sparkles className="h-3 w-3 text-brand-blue" />
          Draft reply · disclosed
        </p>
        <p className="mt-1 text-[0.7rem] leading-snug text-ink/80">
          Full disclosure, I work on {SAMPLE_DOMAIN}. For a team your size…
        </p>
      </div>
      <div className="mt-2.5 flex items-center justify-between gap-2">
        <span className="text-[0.62rem] text-muted-foreground">You post it yourself</span>
        <span className="inline-flex items-center gap-1 rounded-md border border-ink/[0.1] bg-white px-2 py-1 text-[0.62rem] font-medium text-ink">
          <Copy className="h-3 w-3" />
          Copy draft
        </span>
      </div>
    </Screen>
  );
}

/* ---------- The closing band ---------- */

/* The feed a custom build reads: what it pulls on its next sync. */
export function FeedPeek({ titles }: { titles: string[] }) {
  return (
    <div
      className={cn(
        SCREEN,
        "rounded-b-none text-left shadow-[0_-12px_48px_-16px_rgba(4,24,72,0.55)]",
      )}
    >
      <div className="flex items-center gap-2 border-b border-ink/[0.07] px-4 py-3 font-mono text-[0.66rem] sm:text-[0.7rem]">
        <span className="rounded bg-cta-soft px-1.5 py-0.5 font-semibold text-cta">GET</span>
        <span className="truncate text-ink/70">/api/public/v1/articles?since=…</span>
        <span className="ml-auto font-semibold text-success">200</span>
        <SampleTag className="hidden sm:inline" />
      </div>
      <div className="space-y-px px-4 py-3 font-mono text-[0.66rem] leading-relaxed text-ink/55 sm:text-[0.7rem]">
        <p>{'{ "articles": ['}</p>
        {titles.map((t, i) => (
          <p key={t} className="truncate pl-4">
            {"{ "}&quot;title&quot;: <span className="text-[#1563d6]">&quot;{t}&quot;</span>,
            &quot;seo_score&quot;: <span className="text-[#b45309]">{94 - i}</span> {"}"}
            {i < titles.length - 1 ? "," : ""}
          </p>
        ))}
        <p>{"],"}</p>
        <p className="pl-4">
          &quot;next_since&quot;: <span className="text-[#1563d6]">&quot;…&quot;</span>
        </p>
      </div>
    </div>
  );
}
