/**
 * The smaller pictures on /features/auto-publishing: the API's response as a
 * developer sees it, the three rules' screens, the steps' sketches, and the
 * peek under the closing band. Each shows a mechanic the code has; none shows
 * a time of day, an approval queue, images, or a connector as live before its
 * flag says so. Articles are samples on "yoursite.com".
 */
import { Check, CodeXml, Link2, Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { IntegrationLogo } from "@/components/dashboard/integration-logos";
import { API_BASE, DESTINATIONS, PACE_OPTIONS, paceOptionLabel } from "@/data/auto-publishing";
import { PLAN } from "@/data/pricing";

const CARD =
  "rounded-xl border border-ink/[0.07] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.05),0_24px_48px_-24px_rgba(16,24,40,0.25)]";

function SampleTag() {
  return (
    <span className="rounded-md border border-ink/[0.08] px-1.5 py-0.5 text-[0.56rem] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
      Sample
    </span>
  );
}

/* ---------- The API, as a request and its response ---------- */

const S = ({ children }: { children: string }) => (
  <span className="text-cta">&quot;{children}&quot;</span>
);

export function ApiSample({ className }: { className?: string }) {
  return (
    <div className={cn("overflow-hidden", CARD, className)}>
      <div className="flex items-center gap-2 border-b border-ink/[0.06] px-4 py-2.5">
        <span className="rounded bg-success/12 px-1.5 py-0.5 font-mono text-[0.6rem] font-semibold text-success">
          GET
        </span>
        <span className="min-w-0 truncate font-mono text-[0.68rem] text-ink/80">
          {API_BASE}/articles?since=2026-10-12T00:00:00Z
        </span>
        <span className="ml-auto shrink-0">
          <SampleTag />
        </span>
      </div>
      <pre
        tabIndex={0}
        aria-label="Sample API response"
        className="overflow-x-auto px-4 py-3.5 font-mono text-[0.68rem] leading-[1.7] text-ink/75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-cta/40"
      >
        <code>
          <span className="text-muted-foreground">Authorization: Bearer rv_live_a1b2c3…</span>
          {"\n\n"}
          <span className="font-semibold text-success">200 OK</span>
          {"\n{\n"}
          {'  "articles": [{\n'}
          {'    "id": '}
          <S>8f3c2a91-…</S>
          {",\n"}
          {'    "title": '}
          <S>How to Price a SaaS Product in Year One</S>
          {",\n"}
          {'    "slug": '}
          <S>how-to-price-a-saas-product-in-year-one-8f3c2a91</S>
          {",\n"}
          {'    "description": '}
          <S>Pick a value metric, set three tiers…</S>
          {",\n"}
          {'    "body_html": '}
          <S>&lt;h2&gt;Start with the value metric&lt;/h2&gt;…</S>
          {",\n"}
          {'    "body_markdown": '}
          <S>## Start with the value metric…</S>
          {",\n"}
          {'    "tags": ['}
          <S>pricing</S>
          {", "}
          <S>saas</S>
          {"],\n"}
          {'    "seo_score": '}
          <span className="text-[oklch(0.5_0.14_300)]">94</span>
          {",\n"}
          {'    "published_url": '}
          <span className="text-[oklch(0.52_0.14_60)]">null</span>
          {"\n  }],\n"}
          {'  "count": '}
          <span className="text-[oklch(0.5_0.14_300)]">1</span>
          {",\n"}
          {'  "next_since": '}
          <S>2026-10-13T08:41:07Z</S>
          {"\n}"}
        </code>
      </pre>
    </div>
  );
}

/* ---------- Rule 1: your edits win ---------- */

/** The connector's record of each post it created, as it treats your edits. */
export function EditsLedger() {
  const webflow = DESTINATIONS.find((d) => d.id === "webflow");
  const rows: {
    title: string;
    note: string;
    icon?: typeof Pencil;
    chip: string;
    kept: boolean;
  }[] = [
    {
      title: "How to Price a SaaS Product in Year One",
      note: "Changed in Rankbox",
      chip: "Updated",
      kept: false,
    },
    {
      title: "What to Put on a Pricing Page",
      note: "No changes",
      chip: "In sync",
      kept: false,
    },
    {
      title: "Onboarding Emails That Turn Trials into Customers",
      note: "Edited in Webflow",
      icon: Pencil,
      chip: "Left as is",
      kept: true,
    },
    {
      title: "How to Write a Changelog People Read",
      note: "Deleted in Webflow",
      icon: Trash2,
      chip: "Not re-created",
      kept: true,
    },
  ];
  return (
    <div className={cn("p-4 sm:p-5", CARD)}>
      <div className="mb-3.5 flex flex-wrap items-center justify-between gap-2">
        <span className="flex items-center gap-2 whitespace-nowrap text-[0.8rem] font-semibold text-ink">
          <IntegrationLogo id="webflow" title={false} className="h-5 w-5" />
          Webflow sync
        </span>
        <span className="flex items-center gap-1.5 whitespace-nowrap">
          {webflow && webflow.stage !== "available" && (
            <span className="rounded-md bg-warning/15 px-1.5 py-0.5 text-[0.58rem] font-semibold uppercase tracking-[0.06em] text-ink ring-1 ring-warning/30">
              Awaiting approval
            </span>
          )}
          <SampleTag />
        </span>
      </div>
      <div className="space-y-1.5">
        {rows.map((r) => {
          const Icon = r.icon;
          return (
            <div
              key={r.title}
              className={cn(
                "flex items-center justify-between gap-3 rounded-lg border px-3 py-2",
                r.kept
                  ? "border-cta/20 bg-[color-mix(in_oklab,var(--cta)_3.5%,white)]"
                  : "border-ink/[0.07] bg-white",
              )}
            >
              <span className="min-w-0">
                <span className="block truncate text-[0.74rem] font-medium text-ink">
                  {r.title}
                </span>
                <span className="mt-0.5 flex items-center gap-1 text-[0.64rem] text-muted-foreground">
                  {Icon && <Icon aria-hidden className="h-3 w-3" />}
                  {r.note}
                </span>
              </span>
              <span
                className={cn(
                  "shrink-0 whitespace-nowrap rounded-md px-1.5 py-0.5 text-[0.62rem] font-semibold",
                  r.kept ? "bg-cta-soft text-cta" : "bg-success/12 text-success",
                )}
              >
                {r.chip}
              </span>
            </div>
          );
        })}
      </div>
      <p className="mt-3 font-mono text-[0.62rem] text-muted-foreground">
        slug kept: /blog/onboarding-emails-that-turn-trials-into-customers
      </p>
    </div>
  );
}

/* ---------- Rule 2: checked before it's finished ---------- */

/** The real check names, from seo-analysis.ts. */
const CHECKS = [
  "Keyword in title",
  "Keyword in introduction",
  "Section structure",
  "Scannable lists",
  "FAQ for AI engines",
  "Meta description",
];

export function ChecksCard() {
  return (
    <div className={cn("p-4 sm:p-5", CARD)}>
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="text-[0.8rem] font-semibold text-ink">SEO checks</p>
        <span className="text-[0.66rem] text-muted-foreground">1 revision</span>
      </div>
      <ul className="space-y-1.5">
        {CHECKS.map((c) => (
          <li
            key={c}
            className="flex items-center justify-between gap-3 rounded-lg border border-ink/[0.07] bg-white px-3 py-1.5"
          >
            <span className="text-[0.74rem] text-ink">{c}</span>
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-success/15 text-success">
              <Check className="h-2.5 w-2.5" strokeWidth={3} />
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------- Rule 3: paced and capped ---------- */

export function PaceCard() {
  const used = 18;
  return (
    <div className={cn("p-4 sm:p-5", CARD)}>
      <p className="mb-3 text-[0.8rem] font-semibold text-ink">Pace</p>
      <div className="flex flex-wrap gap-1.5">
        {PACE_OPTIONS.map((n) => (
          <span
            key={n}
            className={cn(
              "rounded-lg px-2.5 py-1 text-[0.72rem] font-medium",
              n === 5 ? "bg-cta text-white" : "border border-ink/[0.08] bg-white text-ink/70",
            )}
          >
            {paceOptionLabel(n)}
          </span>
        ))}
      </div>
      <div className="mt-3.5 rounded-lg border border-ink/[0.07] p-3">
        <div className="flex items-center justify-between text-[0.68rem]">
          <span className="font-medium text-ink">This month</span>
          <span className="tabular-nums text-muted-foreground">
            {used} of {PLAN.articlesPerMonth}
          </span>
        </div>
        <span className="mt-2 block h-1.5 overflow-hidden rounded-full bg-ink/[0.06]">
          <span
            className="block h-full rounded-full bg-cta"
            style={{ width: `${(used / PLAN.articlesPerMonth) * 100}%` }}
          />
        </span>
        <p className="mt-2 text-[0.66rem] text-muted-foreground">
          Autopilot stops at {PLAN.articlesPerMonth} and picks up again next month.
        </p>
      </div>
      <div className="mt-2 flex items-center justify-between rounded-lg border border-ink/[0.07] px-3 py-2">
        <span className="text-[0.72rem] font-medium text-ink">Write automatically</span>
        <span className="flex h-5 w-9 items-center rounded-full bg-cta p-0.5">
          <span className="ml-auto h-4 w-4 rounded-full bg-white shadow-sm" />
        </span>
      </div>
    </div>
  );
}

/* ---------- The steps' sketches ---------- */

const WEEK = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

/** Step 1: a week at 5 a week, five days holding a topic. */
export function WeekSketch() {
  return (
    <div>
      <div className="grid grid-cols-7 gap-1">
        {WEEK.map((d, i) => {
          const on = i < 5;
          return (
            <div key={d} className="flex flex-col items-center gap-1.5">
              <span className="text-[0.58rem] font-medium text-muted-foreground">{d}</span>
              <span
                className={cn(
                  "flex h-9 w-full items-end justify-center rounded-md border p-1",
                  on ? "border-cta/25 bg-white" : "border-dashed border-ink/[0.1]",
                )}
              >
                {on && <span className="h-1 w-3/4 rounded-full bg-cta/70" />}
              </span>
            </div>
          );
        })}
      </div>
      <p className="mt-2.5 text-[0.66rem] text-muted-foreground">
        <span className="font-semibold text-ink">{paceOptionLabel(5)}</span> · topics from your
        content plan
      </p>
    </div>
  );
}

/** Step 2: research, write, check, in that order. */
export function PipelineSketch() {
  const stages = ["Research", "Write", "Check"];
  return (
    <div className="flex items-center gap-1.5">
      {stages.map((s, i) => (
        <div key={s} className="flex flex-1 items-center gap-1.5">
          <span
            className={cn(
              "flex flex-1 items-center justify-center gap-1 rounded-md border px-1.5 py-2 text-[0.68rem] font-medium",
              i === stages.length - 1
                ? "border-cta/25 bg-cta-soft text-cta"
                : "border-ink/[0.08] bg-white text-ink",
            )}
          >
            <Check className="h-3 w-3" strokeWidth={3} />
            {s}
          </span>
          {i < stages.length - 1 && <span className="h-px w-2 shrink-0 bg-ink/20" />}
        </div>
      ))}
    </div>
  );
}

/** Step 3: the two calls a site makes. */
export function CallsSketch() {
  return (
    <div className="space-y-1.5 font-mono text-[0.64rem]">
      <div className="flex items-center gap-2 rounded-md border border-ink/[0.08] bg-white px-2 py-1.5">
        <span className="w-10 font-semibold text-success">GET</span>
        <span className="truncate text-ink/80">/articles?since=</span>
      </div>
      <div className="flex items-center gap-2 rounded-md border border-ink/[0.08] bg-white px-2 py-1.5">
        <span className="w-10 font-semibold text-cta">PATCH</span>
        <span className="truncate text-ink/80">/articles/:id</span>
      </div>
    </div>
  );
}

/* ---------- The closing band's peek ---------- */

const REPORTED = [
  "how-to-price-a-saas-product-in-year-one",
  "onboarding-emails-that-turn-trials-into-customers",
  "what-to-put-on-a-pricing-page",
  "how-to-write-a-changelog-people-read",
];

/** Live URLs reported back through the API, newest first. */
export function ReportedPeek() {
  return (
    <div className="rounded-t-xl border border-b-0 border-white/20 bg-white p-4 text-left shadow-[0_-12px_48px_-16px_rgba(4,24,72,0.55)] sm:p-5">
      <div className="mb-3 flex items-center justify-between gap-3">
        <span className="flex items-center gap-2 text-[0.8rem] font-semibold text-ink">
          <span className="flex h-5 w-5 items-center justify-center rounded-md bg-cta text-white">
            <CodeXml className="h-3 w-3" />
          </span>
          Live URLs reported
        </span>
        <SampleTag />
      </div>
      <ul className="space-y-1.5">
        {REPORTED.map((slug) => (
          <li
            key={slug}
            className="flex items-center gap-2.5 rounded-lg border border-ink/[0.07] px-3 py-2"
          >
            <Link2 className="h-3.5 w-3.5 shrink-0 text-success" />
            <span className="min-w-0 flex-1 truncate font-mono text-[0.68rem] text-ink/80">
              yoursite.com/blog/{slug}
            </span>
            <span className="inline-flex shrink-0 items-center gap-1 rounded-md bg-success/12 px-1.5 py-0.5 text-[0.62rem] font-semibold text-success">
              <Check className="h-3 w-3" strokeWidth={3} />
              Live
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
