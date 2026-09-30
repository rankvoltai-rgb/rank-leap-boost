/**
 * Diagrams an article can place with `![alt](figure:<id> "caption")`.
 *
 * Built from the site's own tokens rather than exported images, so they stay
 * sharp at any size, match the product UI, and cost nothing to load. Each is
 * exposed to assistive tech as one image described by the markdown alt text.
 */
import type { ReactNode } from "react";
import {
  ArrowRight,
  Bot,
  Brain,
  Check,
  CircleDollarSign,
  ListChecks,
  ListOrdered,
  MousePointerClick,
  Quote,
  RefreshCw,
  Search,
  Zap,
} from "lucide-react";
import { ChatGPTMark, GoogleMark } from "@/components/landing/ai-logos";
import { cn } from "@/lib/utils";
import { PRICE_CHARTS, type PriceChart } from "@/data/blog-figures";
import { formatUsd } from "@/data/pricing";
import { STUDY_CHARTS, type EmbeddingMap, type StudyBarChart } from "@/data/study-charts";

/* ---------- shared bits ---------- */

function Callout({ n, className }: { n: number; className?: string }) {
  return (
    <span
      className={cn(
        "flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-blue text-[0.65rem] font-bold text-white shadow-sm",
        className,
      )}
    >
      {n}
    </span>
  );
}

function Bar({ w, className }: { w: string; className?: string }) {
  return (
    <span className={cn("block h-1.5 rounded-full bg-ink/10", className)} style={{ width: w }} />
  );
}

/* ---------- 1. How a question becomes a cited answer ---------- */

function Step({
  n,
  title,
  body,
  children,
}: {
  n: number;
  title: string;
  body: string;
  children: ReactNode;
}) {
  return (
    <div className="flex min-w-0 flex-col rounded-2xl border border-border bg-card p-4 shadow-1">
      <div className="flex items-center gap-2">
        <Callout n={n} />
        <p className="text-sm font-semibold text-ink">{title}</p>
      </div>
      <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{body}</p>
      <div className="mt-4 flex flex-1 flex-col justify-end">{children}</div>
    </div>
  );
}

function CitationPipeline() {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <Step n={1} title="Ask" body="A buyer asks a full question, with context.">
        <div className="ml-auto max-w-[85%] rounded-2xl rounded-br-md bg-ink px-3 py-2 text-[0.72rem] leading-snug text-white">
          What's the best CRM for a 5-person real estate team?
        </div>
      </Step>
      <Step n={2} title="Search" body="ChatGPT searches the web for fresh sources.">
        <div className="space-y-1.5">
          {[
            { icon: Bot, label: "OAI-SearchBot index" },
            { icon: Search, label: "Search providers (Bing)" },
          ].map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-2 rounded-lg border border-border bg-surface px-2.5 py-1.5 text-[0.68rem] font-medium text-ink"
            >
              <Icon className="h-3.5 w-3.5 text-brand-blue" />
              {label}
            </div>
          ))}
        </div>
      </Step>
      <Step n={3} title="Read" body="It reads the top pages and pulls out passages.">
        <div className="space-y-1.5">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={cn(
                "space-y-1 rounded-lg border px-2.5 py-2",
                i === 1 ? "border-volt/40 bg-volt/5" : "border-border bg-surface opacity-60",
              )}
            >
              <Bar w="70%" />
              {i === 1 ? (
                <span className="block h-1.5 w-[92%] rounded-full bg-volt/60" />
              ) : (
                <Bar w="85%" />
              )}
            </div>
          ))}
        </div>
      </Step>
      <Step n={4} title="Answer" body="The reply quotes that passage and links the source.">
        <div className="rounded-lg border border-border bg-surface p-2.5">
          <div className="flex items-center gap-1.5">
            <ChatGPTMark className="h-3.5 w-3.5" />
            <span className="text-[0.65rem] font-semibold text-ink">ChatGPT</span>
          </div>
          <div className="mt-2 space-y-1">
            <Bar w="95%" />
            <div className="flex items-center gap-1">
              <Bar w="55%" />
              <span className="rounded bg-volt/15 px-1 text-[0.55rem] font-bold text-volt">1</span>
            </div>
          </div>
          <div className="mt-2 inline-flex items-center gap-1 rounded-md border border-volt/40 bg-volt/10 px-1.5 py-0.5 text-[0.6rem] font-semibold text-ink">
            <span className="h-1 w-1 rounded-full bg-volt" />
            yoursite.com
          </div>
        </div>
      </Step>
    </div>
  );
}

/* ---------- 2. Anatomy of a citable page ---------- */

const ANATOMY = [
  { title: "A question-shaped heading", body: "Worded the way a buyer asks it." },
  { title: "The answer, first", body: "Two or three sentences that stand alone." },
  { title: "Numbers with named sources", body: "Specific facts the model can credit." },
  { title: "Lists and tables", body: "Steps and comparisons that are easy to lift." },
  { title: "An FAQ", body: "Short answers to the follow-up questions." },
];

function CitablePage() {
  return (
    <div className="grid gap-5 md:grid-cols-[1.25fr_1fr] md:items-center">
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-2">
        <div className="flex items-center gap-2 border-b border-border bg-surface px-3 py-2">
          <span className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <span key={i} className="h-2 w-2 rounded-full bg-border" />
            ))}
          </span>
          <span className="mx-auto truncate rounded-md bg-background px-3 py-0.5 text-[0.62rem] text-muted-foreground">
            yoursite.com/blog/crm-for-real-estate-teams
          </span>
        </div>
        <div className="space-y-3.5 p-4 sm:p-5">
          <div className="flex items-start gap-2">
            <Callout n={1} className="mt-0.5" />
            <p className="text-sm font-bold leading-snug text-ink">
              What's the best CRM for a small real estate team?
            </p>
          </div>
          <div className="flex items-start gap-2">
            <Callout n={2} className="mt-0.5" />
            <div className="flex-1 space-y-1.5 rounded-lg border-l-2 border-volt bg-volt/5 py-2 pl-3 pr-2">
              <Bar w="96%" className="bg-ink/20" />
              <Bar w="88%" className="bg-ink/20" />
              <Bar w="60%" className="bg-ink/20" />
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Callout n={3} className="mt-0.5" />
            <div className="flex flex-1 flex-wrap items-center gap-1.5">
              <Bar w="38%" />
              <span className="rounded bg-ink px-1.5 py-0.5 text-[0.6rem] font-bold text-white">
                stat
              </span>
              <Bar w="22%" />
              <span className="text-[0.62rem] font-semibold text-volt underline underline-offset-2">
                source ↗
              </span>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Callout n={4} className="mt-0.5" />
            <div className="flex-1 space-y-1.5">
              {["74%", "62%", "68%"].map((w) => (
                <div key={w} className="flex items-center gap-2">
                  <Check className="h-3 w-3 text-success" strokeWidth={3} />
                  <Bar w={w} />
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Callout n={5} className="mt-0.5" />
            <div className="flex-1 divide-y divide-border rounded-lg border border-border">
              {["How much does it cost?", "Does it sync with Gmail?"].map((q) => (
                <div key={q} className="flex items-center justify-between px-2.5 py-1.5">
                  <span className="text-[0.66rem] font-semibold text-ink">{q}</span>
                  <span className="text-[0.66rem] text-muted-foreground">+</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <ol className="space-y-3">
        {ANATOMY.map((a, i) => (
          <li key={a.title} className="flex gap-3">
            <Callout n={i + 1} className="mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-ink">{a.title}</p>
              <p className="text-xs leading-relaxed text-muted-foreground">{a.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

/* ---------- 3. A weekly prompt panel ---------- */

type Mark = "cited" | "mentioned" | "absent";

const PANEL: { prompt: string; weeks: Mark[]; page: string }[] = [
  {
    prompt: "best crm for a small real estate team",
    weeks: ["absent", "mentioned", "cited", "cited"],
    page: "/blog/best-crm-real-estate",
  },
  {
    prompt: "crm that syncs with gmail for agents",
    weeks: ["absent", "absent", "mentioned", "cited"],
    page: "/features/gmail-sync",
  },
  {
    prompt: "how to follow up with open house leads",
    weeks: ["mentioned", "cited", "cited", "cited"],
    page: "/blog/open-house-follow-up",
  },
  {
    prompt: "is a crm worth it for 5 agents",
    weeks: ["absent", "absent", "absent", "mentioned"],
    page: "—",
  },
  {
    prompt: "hubspot vs pipedrive for realtors",
    weeks: ["absent", "absent", "absent", "absent"],
    page: "—",
  },
];

function Dot({ mark, className }: { mark: Mark; className?: string }) {
  return (
    <span
      className={cn(
        "block h-3 w-3 shrink-0 rounded-full",
        className,
        mark === "cited" && "bg-volt",
        mark === "mentioned" && "border-2 border-volt bg-volt/20",
        mark === "absent" && "border border-ink/15",
      )}
    />
  );
}

function PromptPanel() {
  const cited = [0, 1, 2, 3].map((w) => PANEL.filter((r) => r.weeks[w] === "cited").length);
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-1">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border bg-surface px-4 py-2.5">
        <div className="flex items-center gap-2">
          <ChatGPTMark className="h-4 w-4" />
          <span className="text-xs font-semibold text-ink">Prompt panel · ChatGPT</span>
        </div>
        <span className="text-[0.65rem] font-medium uppercase tracking-[0.14em] text-muted-foreground">
          Example
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[34rem] text-left text-xs">
          <thead>
            <tr className="border-b border-border text-[0.65rem] uppercase tracking-[0.1em] text-muted-foreground">
              <th className="px-4 py-2 font-semibold">Prompt</th>
              {["Wk 1", "Wk 2", "Wk 3", "Wk 4"].map((w) => (
                <th key={w} className="w-14 px-1 py-2 text-center font-semibold">
                  {w}
                </th>
              ))}
              <th className="px-4 py-2 font-semibold">Cited page</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {PANEL.map((row) => (
              <tr key={row.prompt}>
                <td className="px-4 py-2.5 font-medium text-ink">{row.prompt}</td>
                {row.weeks.map((m, i) => (
                  <td key={i} className="px-1 py-2.5">
                    <Dot mark={m} className="mx-auto" />
                  </td>
                ))}
                <td className="px-4 py-2.5 font-mono text-[0.68rem] text-muted-foreground">
                  {row.page}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t border-border bg-surface/60">
              <td className="px-4 py-2.5 text-[0.7rem] font-semibold text-ink">
                Prompts citing you
              </td>
              {cited.map((n, i) => (
                <td
                  key={i}
                  className="px-1 py-2.5 text-center text-[0.7rem] font-bold tabular-nums text-ink"
                >
                  {n}/{PANEL.length}
                </td>
              ))}
              <td />
            </tr>
          </tfoot>
        </table>
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1 border-t border-border px-4 py-2.5 text-[0.68rem] text-muted-foreground">
        {(
          [
            ["cited", "Cited with a link"],
            ["mentioned", "Named, not linked"],
            ["absent", "Not in the answer"],
          ] as const
        ).map(([m, label]) => (
          <span key={m} className="inline-flex items-center gap-1.5">
            <Dot mark={m} />
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ---------- 4. How one question fans out into many searches ---------- */

/**
 * Google's own docs describe "query fan-out": one question becomes several
 * background searches across subtopics, each pulling its own sources. The
 * figure shows why a page that owns one subtopic outright can be cited even
 * when it does not rank for the question the buyer typed.
 */
const FAN_OUT: { q: string; source: string; mine: boolean }[] = [
  { q: "crm pricing for small teams", source: "yoursite.com/pricing", mine: true },
  { q: "crm that syncs with gmail", source: "yoursite.com/blog/gmail-sync", mine: true },
  { q: "best crm for realtors 2026", source: "review-site.com/best-crm", mine: false },
  { q: "is a crm worth it for 5 agents", source: "reddit.com/r/realtors", mine: false },
];

function QueryFanOut() {
  return (
    <div className="grid gap-4 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] md:items-center">
      <div className="rounded-2xl border border-border bg-card p-4 shadow-1">
        <div className="flex items-center gap-2">
          <Callout n={1} />
          <p className="text-sm font-semibold text-ink">What the buyer types</p>
        </div>
        <div className="mt-3 flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-2">
          <Search className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          <span className="truncate text-[0.72rem] text-ink">
            best crm for a small real estate team
          </span>
        </div>
        <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
          One query in. Google does not answer it from one page.
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-4 shadow-1">
        <div className="flex items-center gap-2">
          <Callout n={2} />
          <p className="text-sm font-semibold text-ink">What Google actually searches</p>
        </div>
        <ul className="mt-3 space-y-1.5">
          {FAN_OUT.map(({ q, source, mine }) => (
            <li
              key={q}
              className={cn(
                "rounded-lg border px-2.5 py-2",
                mine ? "border-volt/40 bg-volt/5" : "border-border bg-surface",
              )}
            >
              <div className="flex items-center gap-1.5">
                <span
                  className={cn(
                    "h-1.5 w-1.5 shrink-0 rounded-full",
                    mine ? "bg-volt" : "bg-ink/20",
                  )}
                />
                <span className="truncate text-[0.68rem] font-medium text-ink">{q}</span>
              </div>
              <p
                className={cn(
                  "mt-1 truncate pl-3 font-mono text-[0.62rem]",
                  mine ? "text-ink" : "text-muted-foreground",
                )}
              >
                {source}
              </p>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-2xl border border-border bg-card p-4 shadow-1 md:col-span-2">
        <div className="flex items-center gap-2">
          <Callout n={3} />
          <p className="text-sm font-semibold text-ink">What the buyer sees</p>
        </div>
        <div className="mt-3 rounded-xl border border-border bg-surface p-3">
          <div className="flex items-center gap-1.5">
            <GoogleMark className="h-3.5 w-3.5" />
            <span className="text-[0.65rem] font-semibold text-ink">AI Overview</span>
          </div>
          <div className="mt-2 space-y-1.5">
            <Bar w="94%" />
            <div className="flex items-center gap-1">
              <Bar w="48%" />
              <span className="rounded bg-volt/15 px-1 text-[0.55rem] font-bold text-volt">1</span>
              <Bar w="30%" />
            </div>
            <Bar w="76%" />
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {FAN_OUT.map(({ source, mine }) => (
              <span
                key={source}
                className={cn(
                  "inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[0.6rem] font-semibold",
                  mine
                    ? "border-volt/40 bg-volt/10 text-ink"
                    : "border-border bg-background text-muted-foreground",
                )}
              >
                <span className={cn("h-1 w-1 rounded-full", mine ? "bg-volt" : "bg-ink/20")} />
                {source.split("/")[0]}
              </span>
            ))}
          </div>
        </div>
        <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
          Two of the four subtopics were answered by pages on one site, so that site is cited twice,
          even though it never ranked first for the question the buyer typed.
        </p>
      </div>
    </div>
  );
}

/* ---------- 5. What a cheap SEO retainer buys, in hours ---------- */

/**
 * Average hourly rates from Ahrefs' survey of 439 SEO providers. The hours
 * are the budget divided by the rate, nothing more, so the figure can't drift
 * from its source: change a rate here and the bar follows.
 */
const BUDGET = 300;
const RATES: { who: string; rate: number }[] = [
  { who: "Freelancer", rate: 71.59 },
  { who: "Agency", rate: 98.9 },
  { who: "Consultant", rate: 171.18 },
];

function RetainerHours() {
  const rows = RATES.map((r) => ({ ...r, hours: BUDGET / r.rate }));
  const max = Math.max(...rows.map((r) => r.hours));
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-1 sm:p-5">
      <p className="text-sm font-semibold text-ink">Hours of work a ${BUDGET}/month budget buys</p>
      <p className="mt-0.5 text-xs text-muted-foreground">
        At each provider type's average hourly rate
      </p>
      <div className="mt-5 space-y-4">
        {rows.map((r) => (
          <div
            key={r.who}
            title={`${r.who}: ${r.hours.toFixed(1)} hours at $${r.rate.toFixed(2)}/hour`}
            className="grid grid-cols-[5.5rem_minmax(0,1fr)] items-center gap-3"
          >
            <div>
              <p className="text-xs font-semibold text-ink">{r.who}</p>
              <p className="text-[0.65rem] tabular-nums text-muted-foreground">
                ${r.rate.toFixed(2)}/hr
              </p>
            </div>
            <div className="flex items-center gap-2 border-l border-ink/15">
              <span
                className="block h-5 rounded-r bg-volt"
                style={{ width: `${(r.hours / max) * 82}%` }}
              />
              <span className="shrink-0 text-xs font-bold tabular-nums text-ink">
                {r.hours.toFixed(1)} h
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- 6. What each alternative costs a month ---------- */

/**
 * One chart per "best X alternatives" post, drawn from src/data/blog-figures.ts
 * and placed with `figure:price-chart/<post-slug>`. Rankbox is drawn in the
 * brand colour and the tool the post is about as the reference bar.
 */
function PriceChartFigure({ chart }: { chart: PriceChart }) {
  const max = Math.max(...chart.bars.map((b) => b.value));
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-1 sm:p-5">
      <p className="text-sm font-semibold text-ink">{chart.title}</p>
      <p className="mt-0.5 text-xs text-muted-foreground">{chart.subtitle}</p>
      <div className="mt-5 space-y-3.5">
        {chart.bars.map((b) => (
          <div
            key={b.name}
            title={`${b.name}: ${formatUsd(b.value)} a month, ${b.note}`}
            className="grid grid-cols-[6.5rem_minmax(0,1fr)] items-center gap-3 sm:grid-cols-[8rem_minmax(0,1fr)]"
          >
            <div className="min-w-0">
              <p
                className={cn(
                  "text-xs font-semibold leading-tight",
                  b.rankbox ? "text-brand-blue" : "text-ink",
                )}
              >
                {b.name}
              </p>
              <p className="mt-0.5 line-clamp-2 text-[0.65rem] leading-tight text-muted-foreground">
                {b.note}
              </p>
            </div>
            <div className="flex items-center gap-2 border-l border-ink/15">
              <span
                className={cn(
                  "block h-4 rounded-r",
                  b.rankbox ? "bg-brand-blue" : b.reference ? "bg-ink/45" : "bg-ink/15",
                )}
                style={{ width: `${Math.max(2, (b.value / max) * 78)}%` }}
              />
              <span className="shrink-0 text-xs font-bold tabular-nums text-ink">
                {formatUsd(b.value)}
              </span>
            </div>
          </div>
        ))}
      </div>
      <p className="mt-4 text-[0.65rem] text-muted-foreground">
        List prices billed monthly, from each vendor's pricing page on{" "}
        {new Date(`${chart.checkedOn}T12:00:00`).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })}
        .
      </p>
    </div>
  );
}

/* ---------- 7. The four Cs of GEO measurement ---------- */

/**
 * Four questions in the order a result moves through them. The early rungs
 * move first and prove least; the late ones move last and prove most, which
 * is why a report needs all four.
 */
const RUNGS = [
  {
    name: "Crawled",
    icon: Bot,
    question: "Can AI engines fetch your pages?",
    metric: "User-triggered fetches per page",
    source: "Server or CDN logs",
    moves: "Days",
  },
  {
    name: "Cited",
    icon: Quote,
    question: "Do AI answers name or link you?",
    metric: "Visibility rate, citation rate, share of voice",
    source: "Prompt panel, Search Console, Bing Webmaster Tools",
    moves: "Weeks",
  },
  {
    name: "Clicked",
    icon: MousePointerClick,
    question: "Do those answers send visits?",
    metric: "AI referral sessions and landing pages",
    source: "GA4, with a custom AI channel",
    moves: "Weeks to months",
  },
  {
    name: "Converted",
    icon: CircleDollarSign,
    question: "Are those visits worth money?",
    metric: "Signups, pipeline, self-reported source",
    source: "GA4 key events, CRM, signup form",
    moves: "Months",
  },
];

function GeoScorecard() {
  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-2">
        {RUNGS.map(({ name, icon: Icon, question, metric, source, moves }, i) => (
          <div key={name} className="rounded-2xl border border-border bg-card p-4 shadow-1">
            <div className="flex items-center gap-2">
              <Callout n={i + 1} />
              <p className="text-sm font-semibold text-ink">{name}</p>
              <Icon className="ml-auto h-4 w-4 text-brand-blue" />
            </div>
            <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{question}</p>
            <dl className="mt-3 space-y-1.5 border-t border-border pt-3 text-[0.68rem] leading-snug">
              {(
                [
                  ["Metric", metric],
                  ["Read it in", source],
                  ["Moves in", moves],
                ] as const
              ).map(([term, value]) => (
                <div key={term} className="grid grid-cols-[4.25rem_minmax(0,1fr)] gap-2">
                  <dt className="font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                    {term}
                  </dt>
                  <dd className="font-medium text-ink">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center gap-3 px-1 text-[0.68rem] font-medium text-muted-foreground">
        <span className="shrink-0">Moves first, proves least</span>
        <span className="relative h-px flex-1 bg-ink/15">
          <ArrowRight className="absolute -right-1 -top-[7px] h-3.5 w-3.5 text-ink/30" />
        </span>
        <span className="shrink-0 text-right">Moves last, proves most</span>
      </div>
    </div>
  );
}

/* ---------- 8. A control-prompt test ---------- */

/**
 * The worked example in the GEO measurement guide: the weekly visibility rate
 * of the prompts whose pages changed, against prompts left alone. Illustrative
 * numbers for a fictional brand. The lift in the footer is computed from these
 * arrays, so the chart and its arithmetic can't disagree.
 */
const CONTROL_TEST = {
  changed: [21, 23, 22, 22, 24, 29, 34, 37, 39, 38],
  control: [25, 23, 24, 24, 25, 26, 27, 26, 28, 27],
  /** Weeks 1–4 before the change ships, weeks 7–10 after two weeks of crawl lag. */
  before: [0, 4] as const,
  after: [6, 10] as const,
  answersPerWeek: 120,
  yMax: 50,
};

function meanOf(values: number[], [from, to]: readonly [number, number]): number {
  const slice = values.slice(from, to);
  return slice.reduce((s, v) => s + v, 0) / slice.length;
}

function ControlTest() {
  const { changed, control, before, after, answersPerWeek, yMax } = CONTROL_TEST;
  const weeks = changed.length;
  const x = (i: number) => ((i + 0.5) / weeks) * 100;
  const y = (v: number) => 100 - (v / yMax) * 100;
  const line = (values: number[]) => values.map((v, i) => `${x(i)},${y(v)}`).join(" ");
  const cb = meanOf(changed, before);
  const ca = meanOf(changed, after);
  const kb = meanOf(control, before);
  const ka = meanOf(control, after);
  const lift = ca - cb - (ka - kb);
  const band = (from: number, to: number) => ({
    left: `${(from / weeks) * 100}%`,
    width: `${((to - from) / weeks) * 100}%`,
  });
  const series = [
    { key: "changed", label: "Changed pages", values: changed, solid: true },
    { key: "control", label: "Control", values: control, solid: false },
  ];

  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-1 sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-ink">Visibility rate by week</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Share of answers that name the brand, {answersPerWeek} answers per group each week
          </p>
        </div>
        <span className="text-[0.65rem] font-medium uppercase tracking-[0.14em] text-muted-foreground">
          Example
        </span>
      </div>

      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[0.68rem] text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <span className="block h-0.5 w-5 rounded-full bg-brand-blue" />
          Prompts whose pages you changed
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="block w-5 border-t-2 border-dashed border-muted-foreground" />
          Control prompts, left alone
        </span>
      </div>

      <div className="mt-4 grid grid-cols-[2.25rem_minmax(0,1fr)] gap-x-2">
        <div className="relative h-48 sm:h-56">
          {[yMax, yMax / 2, 0].map((v) => (
            <span
              key={v}
              className="absolute right-0 -translate-y-1/2 text-[0.62rem] tabular-nums text-muted-foreground"
              style={{ top: `${y(v)}%` }}
            >
              {v}%
            </span>
          ))}
        </div>

        <div className="relative h-48 sm:h-56">
          {(
            [
              [before, "Before"],
              [[before[1], after[0]], "Crawl lag"],
              [after, "After"],
            ] as const
          ).map(([[from, to], label]) => (
            <div
              key={label}
              className={cn(
                "absolute inset-y-0 border-x border-card",
                label === "Crawl lag" ? "bg-transparent" : "bg-ink/[0.035]",
              )}
              style={band(from, to)}
            >
              <span className="absolute inset-x-0 top-1.5 whitespace-nowrap text-center text-[0.6rem] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
                {label === "Crawl lag" ? (
                  <>
                    <span className="sm:hidden">Lag</span>
                    <span className="hidden sm:inline">{label}</span>
                  </>
                ) : (
                  label
                )}
              </span>
            </div>
          ))}

          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="absolute inset-0 h-full w-full overflow-visible"
          >
            {[yMax, yMax / 2, 0].map((v) => (
              <line
                key={v}
                x1="0"
                x2="100"
                y1={y(v)}
                y2={y(v)}
                stroke="currentColor"
                className="text-ink/10"
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
              />
            ))}
            <line
              x1={(before[1] / weeks) * 100}
              x2={(before[1] / weeks) * 100}
              y1="0"
              y2="100"
              stroke="currentColor"
              className="text-ink/35"
              strokeWidth="1"
              strokeDasharray="3 3"
              vectorEffect="non-scaling-stroke"
            />
            {series.map((s) => (
              <polyline
                key={s.key}
                points={line(s.values)}
                fill="none"
                stroke="currentColor"
                className={s.solid ? "text-brand-blue" : "text-muted-foreground"}
                strokeWidth="2"
                strokeDasharray={s.solid ? undefined : "5 4"}
                strokeLinejoin="round"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
              />
            ))}
          </svg>

          {series.map((s) =>
            s.values.map((v, i) => (
              <span
                key={`${s.key}-${i}`}
                className={cn(
                  "absolute h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-card",
                  s.solid ? "bg-brand-blue" : "border-2 border-muted-foreground bg-card",
                )}
                style={{ left: `${x(i)}%`, top: `${y(v)}%` }}
              />
            )),
          )}

          {series.map((s) => (
            <span
              key={`${s.key}-label`}
              className="absolute right-0 -translate-y-[160%] text-[0.62rem] font-semibold text-ink"
              style={{ top: `${y(s.values[weeks - 1])}%` }}
            >
              {s.label}
            </span>
          ))}

          <span
            className="absolute bottom-1.5 -translate-x-1/2 whitespace-nowrap rounded bg-card px-1 text-[0.6rem] font-semibold text-ink"
            style={{ left: `${(before[1] / weeks) * 100}%` }}
          >
            Pages shipped
          </span>

          {changed.map((v, i) => (
            <div
              key={`hit-${i}`}
              title={`Week ${i + 1}: changed pages ${v}%, control ${control[i]}%`}
              className="absolute inset-y-0"
              style={{ left: `${(i / weeks) * 100}%`, width: `${100 / weeks}%` }}
            />
          ))}
        </div>

        <div />
        <div className="mt-1.5 grid" style={{ gridTemplateColumns: `repeat(${weeks}, 1fr)` }}>
          {changed.map((_, i) => (
            <span key={i} className="text-center text-[0.6rem] tabular-nums text-muted-foreground">
              W{i + 1}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-border bg-surface px-3 py-2.5 text-[0.7rem] leading-relaxed text-ink">
        <span className="font-semibold">Lift</span> = changed ({ca} − {cb}) − control ({ka} − {kb})
        = <span className="font-bold tabular-nums">{lift} points</span>
        <span className="text-muted-foreground">
          {" "}
          · the control's {ka - kb}-point rise happened without you, so it comes off the top.
        </span>
      </div>
    </div>
  );
}

/* ---------- 9. The shortlist loop ---------- */

/**
 * How ChatGPT builds a recommendation list, from the "rank on ChatGPT" post:
 * five stages inside one answer, and a slower loop through the web back into
 * what future models recall. The stage figures are one researcher's captures
 * (Search Engine Journal, August 2026); the slow loop is our model, drawn
 * dashed so it never reads as a documented OpenAI mechanism.
 */
const SHORTLIST_STAGES = [
  { name: "Trigger", icon: Zap, body: "Decides to search. Buying questions usually do." },
  {
    name: "Recall",
    icon: Brain,
    body: "Writes a first query, often naming brands from memory.",
    stat: "68.9% of brands named here make the answer",
    sub: "Only fetched: 2.1%",
  },
  {
    name: "Probe",
    icon: Search,
    body: "Checks vendor sites, roundups, reviews and Reddit.",
    tags: ["site:vendor.com", "best X 2026", "reviews", "reddit"],
  },
  {
    name: "Tally",
    icon: ListChecks,
    body: "Reads excerpts and keeps the brands that recur.",
    stat: "3.1% of pages read get cited",
  },
  {
    name: "Order",
    icon: ListOrdered,
    body: "Writes the list. Fit to the buyer's needs moves brands up or down.",
  },
];

function ShortlistLoop() {
  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[0.65rem] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
          Buyer prompt
        </span>
        <span className="rounded-2xl rounded-bl-md bg-ink px-3 py-1.5 text-[0.72rem] leading-snug text-white">
          Best project management tool for a 12-person startup?
        </span>
      </div>

      <div className="mt-4 hidden grid-cols-5 gap-2 sm:grid">
        <span className="col-span-2" />
        <span className="col-span-3 border-x-2 border-t-2 border-brand-blue/40 pt-1 text-center text-[0.62rem] font-semibold text-brand-blue">
          Fast loop: the pages it reads for this answer
        </span>
      </div>
      <ol className="mt-1.5 grid gap-2 sm:grid-cols-5">
        {SHORTLIST_STAGES.map(({ name, icon: Icon, body, stat, sub, tags }, i) => (
          <li
            key={name}
            className="flex min-w-0 flex-col rounded-2xl border border-border bg-card p-3 shadow-1"
          >
            <div className="flex items-center gap-1.5">
              <Callout n={i + 1} />
              <p className="text-[0.78rem] font-semibold text-ink">{name}</p>
              <Icon className="ml-auto h-3.5 w-3.5 text-brand-blue" />
            </div>
            <p className="mt-1.5 text-[0.68rem] leading-snug text-muted-foreground">{body}</p>
            {tags && (
              <div className="mt-2 flex flex-wrap gap-1">
                {tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full bg-ink/5 px-1.5 py-0.5 font-mono text-[0.58rem] text-ink"
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}
            {stat && (
              <div className="mt-auto pt-2">
                <p className="rounded-lg bg-brand-blue/10 px-2 py-1 text-[0.62rem] font-semibold leading-snug text-brand-blue">
                  {stat}
                </p>
                {sub && <p className="mt-1 px-2 text-[0.6rem] text-muted-foreground">{sub}</p>}
              </div>
            )}
          </li>
        ))}
      </ol>

      <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-stretch">
        <div className="flex flex-1 items-center gap-3 rounded-2xl border-2 border-dashed border-ink/20 px-3 py-2.5">
          <RefreshCw className="h-4 w-4 shrink-0 text-muted-foreground" />
          <div className="min-w-0">
            <p className="text-[0.72rem] font-semibold text-ink">
              Slow loop: the web shapes what future models recall
            </p>
            <p className="mt-0.5 text-[0.66rem] leading-snug text-muted-foreground">
              Roundups, reviews, Reddit, YouTube and your own site feed back into stage 2. Our
              model, not confirmed by OpenAI.
            </p>
          </div>
        </div>
        <div className="shrink-0 rounded-2xl border border-border bg-card px-3 py-2.5 shadow-1 sm:w-44">
          <p className="text-[0.62rem] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
            Ranked answer
          </p>
          <ol className="mt-1 space-y-0.5 text-[0.72rem] font-medium text-ink">
            <li>1. Loopcraft</li>
            <li>2. Taskmeadow</li>
            <li>3. Crewboard</li>
          </ol>
          <p className="mt-1 text-[0.6rem] text-muted-foreground">Changes every run</p>
        </div>
      </div>

      <p className="mt-3 px-1 text-[0.6rem] leading-snug text-muted-foreground">
        Stage 2 and 4 figures: one researcher's ChatGPT captures (Search Engine Journal, August
        2026). Brands are made up.
      </p>
    </div>
  );
}

/* ---------- 9. Study charts (Rankbox research posts) ---------- */

/** Blue, light gray, dark ink: three series that stay apart in both themes. */
const SERIES_BAR = ["bg-brand-blue", "bg-ink/30", "bg-ink/80"];
const SERIES_DOT = SERIES_BAR;

function StudyBarsFigure({ chart }: { chart: StudyBarChart }) {
  const max = chart.max ?? Math.max(...chart.rows.flatMap((r) => Object.values(r.values)));
  const multi = chart.series.length > 1;
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-1 sm:p-5">
      <p className="text-sm font-semibold text-ink">{chart.title}</p>
      <p className="mt-0.5 text-xs text-muted-foreground">{chart.subtitle}</p>
      {multi && (
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
          {chart.series.map((s, i) => (
            <span key={s.key} className="flex items-center gap-1.5 text-[0.68rem] text-ink">
              <span className={cn("h-2.5 w-2.5 rounded-sm", SERIES_DOT[i])} />
              {s.label}
            </span>
          ))}
        </div>
      )}
      <div className={cn("mt-4", multi ? "space-y-4" : "space-y-3")}>
        {chart.rows.map((row) => (
          <div
            key={row.name}
            className="grid grid-cols-[6.5rem_minmax(0,1fr)] items-center gap-3 sm:grid-cols-[9rem_minmax(0,1fr)]"
          >
            <div className="min-w-0">
              <p className="text-xs font-semibold leading-tight text-ink">{row.name}</p>
              {row.note && (
                <p className="mt-0.5 line-clamp-2 text-[0.65rem] leading-tight text-muted-foreground">
                  {row.note}
                </p>
              )}
            </div>
            <div className="space-y-1 border-l border-ink/15">
              {chart.series.map((s, i) => {
                const v = row.values[s.key];
                if (v === undefined) return null;
                return (
                  <div
                    key={s.key}
                    className="flex items-center gap-2"
                    title={`${row.name}, ${s.label}: ${v}%`}
                  >
                    <span
                      className={cn("block rounded-r", multi ? "h-2.5" : "h-4", SERIES_BAR[i])}
                      style={{ width: `${Math.max(1, (v / max) * 78)}%` }}
                    />
                    <span className="shrink-0 text-[0.68rem] font-bold tabular-nums text-ink">
                      {v.toFixed(1)}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <p className="mt-4 text-[0.65rem] leading-snug text-muted-foreground">{chart.source}</p>
    </div>
  );
}

/** Opacity steps for 0–4 definition sentences, light to dark. */
const K_SHADE = ["opacity-25", "opacity-40", "opacity-60", "opacity-80", "opacity-100"];

function EmbeddingMapFigure({ map }: { map: EmbeddingMap }) {
  const xs = [
    ...map.prompts.map((p) => p.x),
    ...map.clusters.flatMap((c) => c.points.map((p) => p.x)),
  ];
  const ys = [
    ...map.prompts.map((p) => p.y),
    ...map.clusters.flatMap((c) => c.points.map((p) => p.y)),
  ];
  const [x0, x1, y0, y1] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
  // 8% padding each side; y grows upward
  const px = (x: number) => 8 + ((x - x0) / (x1 - x0)) * 84;
  const py = (y: number) => 8 + ((y1 - y) / (y1 - y0)) * 84;
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-1 sm:p-5">
      <p className="text-sm font-semibold text-ink">{map.title}</p>
      <p className="mt-0.5 text-xs text-muted-foreground">{map.subtitle}</p>
      <div className="relative mt-4 aspect-square w-full rounded-xl border border-border bg-surface sm:aspect-[16/9]">
        {map.clusters.map((c) => {
          const cx = c.points.reduce((s, p) => s + px(p.x), 0) / c.points.length;
          const below = c.labelPlace === "below";
          const cy = below
            ? Math.max(...c.points.map((p) => py(p.y)))
            : Math.min(...c.points.map((p) => py(p.y)));
          return (
            <div key={c.k}>
              {c.points.map((p, i) => (
                <span
                  key={i}
                  className={cn(
                    "absolute h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-blue",
                    K_SHADE[c.k],
                  )}
                  style={{ left: `${px(p.x)}%`, top: `${py(p.y)}%` }}
                />
              ))}
              <span
                className={cn(
                  "absolute -translate-x-1/2 whitespace-nowrap text-[0.6rem] font-semibold text-brand-blue sm:text-[0.68rem]",
                  below ? "pt-1.5" : "-translate-y-full pb-1.5",
                )}
                style={{ left: `${cx}%`, top: `${cy}%` }}
              >
                {c.label}
              </span>
            </div>
          );
        })}
        {map.prompts.map((p) => {
          const place = p.place ?? "below";
          const at = { left: `${px(p.x)}%`, top: `${py(p.y)}%` };
          return (
            <div key={p.label}>
              <span
                className="absolute h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-ink"
                style={at}
              />
              <span
                className={cn(
                  "absolute w-max max-w-[6.5rem] text-[0.58rem] leading-tight text-ink sm:max-w-[9rem] sm:text-[0.65rem]",
                  place === "below" && "-translate-x-1/2 pt-2.5 text-center",
                  place === "above" && "-translate-x-1/2 -translate-y-full pb-2.5 text-center",
                  place === "left" && "-translate-x-full -translate-y-1/2 pr-3 text-right",
                  place === "right" && "-translate-y-1/2 pl-3 text-left",
                )}
                style={at}
              >
                {p.label}
              </span>
            </div>
          );
        })}
      </div>
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[0.68rem] text-ink">
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 shrink-0 rotate-45 bg-ink" /> User prompt
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 shrink-0 rounded-full bg-brand-blue" /> Paragraph (darker = more
          definitions; dots in a cluster differ only in keyword repeats)
        </span>
      </div>
      <p className="mt-3 text-[0.65rem] leading-snug text-muted-foreground">{map.source}</p>
    </div>
  );
}

/* ---------- 11. One chart, two designs, through OCR ---------- */

/**
 * The Tallyfold chart from the multimodal GEO post, in the two designs its OCR
 * check compared (fictional data). The "before" panel copies the weak design
 * on purpose: faint pastel bars, rotated labels, no printed values. The badges
 * are the recorded results from Apple's Vision text recognizer, accurate mode,
 * on the 512 px renders.
 */
const REMINDER_DAYS = [
  { label: "No reminders", days: 38 },
  { label: "Manual email reminders", days: 31 },
  { label: "Automatic reminders", days: 24 },
  { label: "Automatic reminders + card link", days: 17 },
];

function OcrBadge({ children, good }: { children: ReactNode; good?: boolean }) {
  return (
    <p
      className={cn(
        "mt-2 rounded-md px-2 py-1 text-center text-[0.65rem] font-semibold tabular-nums",
        good ? "bg-brand-blue/10 text-brand-blue" : "bg-ink/5 text-muted-foreground",
      )}
    >
      {children}
    </p>
  );
}

function TwoLayerChart() {
  const top = 62;
  const base = 202;
  const perDay = (base - top) / 40;
  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <p className="mb-1.5 text-[0.7rem] font-semibold uppercase tracking-wide text-muted-foreground">
            Before
          </p>
          <svg viewBox="0 0 400 290" className="w-full rounded-xl">
            <defs>
              <linearGradient id="tlc-bg" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#f6f2fd" />
                <stop offset="1" stopColor="#ece6f7" />
              </linearGradient>
              <linearGradient id="tlc-bar" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#dccdf6" />
                <stop offset="1" stopColor="#c7b3ee" />
              </linearGradient>
            </defs>
            <rect width="400" height="290" fill="url(#tlc-bg)" />
            <text x="24" y="30" fontSize="15" fontWeight="300" fill="#b9aed0">
              How smarter reminders speed up payments
            </text>
            <text x="24" y="46" fontSize="10" fill="#cdc4de">
              Tallyfold agency benchmark
            </text>
            {[0, 10, 20, 30, 40].map((v) => (
              <g key={v}>
                <line
                  x1="60"
                  x2="380"
                  y1={base - v * perDay}
                  y2={base - v * perDay}
                  stroke="#e4dcf1"
                />
                <text x="52" y={base - v * perDay + 3} fontSize="8" fill="#c4bcd3" textAnchor="end">
                  {v}
                </text>
              </g>
            ))}
            <text
              transform={`translate(22 ${(top + base) / 2}) rotate(-90)`}
              fontSize="8"
              fill="#c4bcd3"
              textAnchor="middle"
            >
              avg. days
            </text>
            {REMINDER_DAYS.map((r, i) => {
              const cx = 100 + i * 78;
              const h = r.days * perDay;
              return (
                <g key={r.label}>
                  <rect
                    x={cx - 22}
                    y={base - h}
                    width="44"
                    height={h}
                    rx="4"
                    fill="url(#tlc-bar)"
                  />
                  <text
                    transform={`translate(${cx + 10} ${base + 12}) rotate(-30)`}
                    fontSize="8"
                    fill="#c4bcd3"
                    textAnchor="end"
                  >
                    {r.label}
                  </text>
                </g>
              );
            })}
            <text x="380" y="280" fontSize="10" fill="#ddd5eb" textAnchor="end">
              tallyfold
            </text>
          </svg>
          <OcrBadge>OCR at 512 px: 0 of 4 labels, 0 of 4 values</OcrBadge>
        </div>
        <div>
          <p className="mb-1.5 text-[0.7rem] font-semibold uppercase tracking-wide text-brand-blue">
            After: Two-Layer Chart
          </p>
          <div className="rounded-xl bg-white p-4 text-[#111]">
            <p className="text-sm font-bold leading-snug">
              Automatic reminders plus a card link cut payment time to 17 days
            </p>
            <p className="mt-0.5 text-[0.7rem] text-[#333]">
              Average days from invoice to payment, by reminder setup
            </p>
            <div className="mt-4 space-y-3">
              {REMINDER_DAYS.map((r) => (
                <div key={r.label}>
                  <p className="text-[0.7rem] font-bold leading-tight">{r.label}</p>
                  <div className="mt-1 flex items-center gap-2">
                    <span
                      className="block h-3.5 rounded-r bg-brand-blue-deep"
                      style={{ width: `${(r.days / 38) * 72}%` }}
                    />
                    <span className="shrink-0 text-xs font-bold tabular-nums">{r.days} days</span>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-4 text-[0.6rem] text-[#333]">
              Source: Tallyfold (fictional example data), September 2026
            </p>
          </div>
          <OcrBadge good>OCR at 512 px: 4 of 4 labels, 4 of 4 values</OcrBadge>
        </div>
      </div>
      <p className="mt-3 text-center text-[0.65rem] text-muted-foreground">
        Fictional example data. OCR results from Apple's Vision text recognizer, accurate mode,
        exact matches.
      </p>
    </div>
  );
}

/* ---------- 12. The death of 10 blue links, 1998 to 2026 ---------- */

/**
 * The timeline from the "Death of 10 Blue Links" study. Every date, label and
 * description is copied from the post's tables, where each one links to the
 * company's announcement or the original paper. Spacing is by order, not to
 * scale. The 2027 block is Rankbox's forecast and is drawn apart from the
 * record: dashed, hatched and tagged, so it doesn't rely on colour.
 */
const BLUE_LINK_ERAS = [
  {
    title: "Era 1: Indexing",
    years: "1998 to 2006",
    line: "The 10 blue links: a list of URLs.",
    tint: "bg-brand-blue/[0.04]",
    items: [
      [
        "Apr 1998",
        "PageRank",
        "Brin and Page describe a search engine that indexes 24 million pages and weighs them by the links pointing to them.",
        "Stanford paper",
      ],
      [
        "Oct 2000",
        "AdWords",
        "Self-serve keyword ads launch on the results page, so paid links share the screen.",
        "Google press release",
      ],
      [
        "Nov 2006",
        "Sitemap protocol",
        "Google, Yahoo! and Microsoft back one Sitemap format, so sites can list pages for indexing.",
        "Google Webmaster Central",
      ],
    ],
  },
  {
    title: "Era 2: Ranking",
    years: "2007 to 2021",
    line: "The 10 blue links plus boxes: images, news, facts, snippets.",
    tint: "bg-brand-blue/[0.08]",
    items: [
      [
        "May 2007",
        "Universal Search",
        "Google blends news, video, images, maps and books into one ranked list.",
        "Google press release",
      ],
      [
        "May 2012",
        "Knowledge Graph",
        '"Things, not strings": facts about 500 million entities appear next to the links.',
        "Google blog",
      ],
      [
        "Jan 2014",
        "Featured snippets",
        "An extracted answer starts appearing above the organic results.",
        "Google blog, 2018",
      ],
      [
        "2015",
        "RankBrain",
        "Google's first deep learning system in Search starts helping to rank results.",
        "Google blog",
      ],
      [
        "Jun 2017",
        "Transformer",
        "Researchers at Google publish the model design behind today's chat assistants.",
        "Vaswani et al.",
      ],
      [
        "Oct 2019",
        "BERT in Search",
        "Better language understanding helps Search read one in ten US English searches.",
        "Google blog",
      ],
      [
        "May 2020",
        "RAG",
        "Researchers pair a language model with a document retriever: the blueprint for grounded answers.",
        "Lewis et al.",
      ],
      [
        "May 2021",
        "Rethinking Search",
        'Google researchers argue engines should answer directly, not just point to "references."',
        "Metzler et al.",
      ],
      [
        "Dec 2021",
        "WebGPT",
        "OpenAI trains a model to run searches, quote pages and cite its sources.",
        "OpenAI",
      ],
    ],
  },
  {
    title: "Era 3: Synthesis",
    years: "2022 to September 2026",
    line: "A written answer with a few sources.",
    tint: "bg-brand-blue/[0.12]",
    items: [
      [
        "Nov 2022",
        "ChatGPT",
        'A chat model that can "answer followup questions" reaches the public.',
        "OpenAI",
      ],
      [
        "Feb 2023",
        "Bing chat",
        'Microsoft puts chat beside search, estimating that half of 10 billion daily queries "go unanswered."',
        "Microsoft",
      ],
      [
        "Nov 2023",
        "GEO",
        "Researchers name generative engine optimization: visibility inside AI answers.",
        "Aggarwal et al.",
      ],
      [
        "May 2024",
        "AI Overviews",
        "After a year of testing in Search Labs, AI summaries roll out to everyone in the US.",
        "Google blog",
      ],
      [
        "Oct 2024",
        "ChatGPT search",
        'ChatGPT answers with web sources from "third-party search providers" and partners.',
        "OpenAI",
      ],
      [
        "Jan 2025",
        "Operator",
        "An OpenAI agent uses its own browser to click, type and scroll through sites.",
        "OpenAI",
      ],
      [
        "Feb 2025",
        "Deep research",
        'ChatGPT reads "hundreds of online sources" to write one report.',
        "OpenAI",
      ],
      [
        "May 2025",
        "AI Mode",
        'Google\'s chat-style mode, built on "query fan-out," opens to everyone in the US.',
        "Google blog",
      ],
      [
        "Jul 2025",
        "ChatGPT agent",
        'OpenAI merges browsing and research into one agent that asks before "actions of consequence."',
        "OpenAI",
      ],
      [
        "Sep 2025",
        "Instant Checkout",
        "Shoppers can buy inside ChatGPT through the Agentic Commerce Protocol. OpenAI scaled it back in March 2026.",
        "OpenAI",
      ],
      [
        "Feb 2026",
        "Ads in ChatGPT",
        "OpenAI starts testing ads in the US, labelled and kept apart from the answer.",
        "OpenAI",
      ],
      [
        "May 2026",
        "Search agents",
        "AI Mode passes one billion monthly users, and Google announces agents that search in the background.",
        "Google blog",
      ],
    ],
  },
] as const;

const BLUE_LINK_OUTLOOK = [
  "The 10 blue links survive as the fallback and proof layer.",
  "AI answers take the first screen for complex questions.",
  "Agents become a visible share of site visits.",
  "Ads settle inside answers on ad-funded engines, not everywhere.",
  "Ranking still decides who gets cited.",
];

/** Index within Era 3 where the agentic-retrieval frontier starts (Operator). */
const FRONTIER_FROM = 5;

function TimelineCard({ item }: { item: readonly [string, string, string, string] }) {
  const [date, label, desc, src] = item;
  return (
    <li className="relative pl-6">
      <span className="absolute left-[-5px] top-1.5 block h-2.5 w-2.5 rounded-full border-2 border-brand-blue bg-card" />
      <p className="text-[0.65rem] font-semibold uppercase tracking-wide text-muted-foreground tabular-nums">
        {date}
      </p>
      <p className="text-sm font-bold leading-snug text-ink">{label}</p>
      <p className="text-xs leading-snug text-ink/80">{desc}</p>
      <p className="mt-0.5 text-[0.6rem] text-muted-foreground">{src}</p>
    </li>
  );
}

function BlueLinksTimeline() {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-1 sm:p-5">
      <p className="text-base font-bold text-ink">The Death of 10 Blue Links, 1998 to 2026</p>
      <p className="mt-0.5 text-xs text-muted-foreground">
        From finding pages to writing answers: how search moved through three eras
      </p>
      <div className="mt-5 space-y-3">
        {BLUE_LINK_ERAS.map((era, e) => (
          <section key={era.title} className={cn("rounded-xl p-3 sm:p-4", era.tint)}>
            <p className="text-sm font-bold text-ink">
              {era.title} <span className="font-medium text-muted-foreground">· {era.years}</span>
            </p>
            <p className="text-xs text-ink/80">{era.line}</p>
            {e < 2 ? (
              <ol className="mt-3 ml-2 space-y-3 border-l-2 border-brand-blue/40">
                {era.items.map((item) => (
                  <TimelineCard key={item[1]} item={item} />
                ))}
              </ol>
            ) : (
              <div className="mt-3 ml-2">
                <ol className="space-y-3 border-l-2 border-brand-blue/40 pb-3">
                  {era.items.slice(0, FRONTIER_FROM).map((item) => (
                    <TimelineCard key={item[1]} item={item} />
                  ))}
                </ol>
                <div className="rounded-r-lg border-y border-r border-ink/25 py-2 pr-2">
                  <p className="pl-6 text-[0.7rem] font-bold uppercase tracking-wide text-ink">
                    Frontier: agentic retrieval
                  </p>
                  <p className="mb-3 pl-6 text-[0.65rem] text-muted-foreground">
                    Models plan their own searches, read the results and sometimes act.
                  </p>
                  <ol className="space-y-3 border-l-2 border-brand-blue/40">
                    {era.items.slice(FRONTIER_FROM).map((item) => (
                      <TimelineCard key={item[1]} item={item} />
                    ))}
                  </ol>
                </div>
              </div>
            )}
          </section>
        ))}
        <section className="relative rounded-xl border-2 border-dashed border-ink/30 bg-[repeating-linear-gradient(135deg,transparent_0_7px,rgba(127,127,127,0.09)_7px_14px)] p-3 sm:p-4">
          <span className="absolute right-3 top-3 rounded bg-ink px-1.5 py-0.5 text-[0.6rem] font-bold tracking-widest text-card">
            FORECAST
          </span>
          <p className="text-sm font-bold text-ink">2027 outlook</p>
          <p className="text-xs text-muted-foreground">Rankbox forecast, not a record</p>
          <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-xs text-ink/85">
            {BLUE_LINK_OUTLOOK.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ol>
        </section>
      </div>
      <p className="mt-4 text-[0.6rem] leading-snug text-muted-foreground">
        Sources: each milestone's company announcement or original paper, as linked in the post.
        Dates as stated by each source. Spacing is by order, not to scale.
      </p>
      <p className="mt-1 text-[0.6rem] text-muted-foreground">
        Rankbox · rankbox.xyz/blog/death-of-10-blue-links · September 2026
      </p>
    </div>
  );
}

/* ---------- registry ---------- */

const FIGURES: Record<string, () => ReactNode> = {
  "citation-pipeline": CitationPipeline,
  "citable-page": CitablePage,
  "prompt-panel": PromptPanel,
  "query-fan-out": QueryFanOut,
  "retainer-hours": RetainerHours,
  "geo-scorecard": GeoScorecard,
  "control-test": ControlTest,
  "shortlist-loop": ShortlistLoop,
  "two-layer-chart": TwoLayerChart,
  "blue-links-timeline": BlueLinksTimeline,
};

/**
 * A fixed figure by id, or a data-driven one: "price-chart/<post-slug>" or
 * "study/<chart-id>".
 */
function figureFor(id: string): (() => ReactNode) | undefined {
  if (FIGURES[id]) return FIGURES[id];
  const [kind, key] = id.split("/");
  if (kind === "study" && key && STUDY_CHARTS[key]) {
    const study = STUDY_CHARTS[key];
    return study.kind === "map"
      ? () => <EmbeddingMapFigure map={study} />
      : () => <StudyBarsFigure chart={study} />;
  }
  const chart = kind === "price-chart" && key ? PRICE_CHARTS[key] : undefined;
  return chart ? () => <PriceChartFigure chart={chart} /> : undefined;
}

export function ArticleFigure({
  id,
  alt,
  caption,
  number,
}: {
  id: string;
  alt?: string;
  caption?: ReactNode;
  number?: number;
}) {
  const Figure = figureFor(id);
  if (!Figure) return null;
  return (
    <figure className="my-10">
      <div
        role="img"
        aria-label={alt}
        className="rounded-3xl border border-border bg-surface/70 bg-dotgrid p-4 sm:p-6"
      >
        <div aria-hidden>
          <Figure />
        </div>
      </div>
      {caption && (
        <figcaption className="mt-3 text-center text-[0.8rem] text-muted-foreground">
          {number !== undefined && (
            <span className="font-semibold text-ink">Figure {number}. </span>
          )}
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
