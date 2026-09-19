import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { createBlog, listKeywords, type Blog } from "@/lib/data";
import { analyzeArticle, type SeoAnalysis } from "@/lib/seo-analysis";
import {
  Button,
  EmptyState,
  PageHeader,
  Panel,
  Pill,
  Tabs,
} from "@/components/dashboard/primitives";
import { DataTable, Tr, Td, type Column } from "@/components/dashboard/data-table";
import { ArticleIcon, CalendarIcon, TargetIcon, VoltMark } from "@/components/dashboard/icons";
import { AI_ALGORITHM_MARKS } from "@/components/landing/ai-logos";
import { ArticlePanel } from "@/components/dashboard/ArticlePanel";
import { StagePill } from "@/components/dashboard/article-parts";
import { TrafficValue } from "@/components/dashboard/traffic";
import { VisitsChart } from "@/components/dashboard/VisitsChart";
import { isOverdue, type Stage } from "@/components/dashboard/article-stages";
import { isEntitled } from "@/components/dashboard/autopilot-state";
import { SubscriptionGate } from "@/components/dashboard/SubscriptionGate";
import {
  buildMarket,
  buildMoves,
  buildTrajectory,
  coverageOf,
  signalCoverage,
  titleFromKeyword,
  type MarketRow,
  type Move,
  type MoveKind,
} from "@/components/dashboard/rank-model";
import {
  useAllArticles,
  useArticleActions,
  useArticleRouting,
} from "@/components/dashboard/useArticleActions";
import { cn } from "@/lib/utils";

type RankSearch = { article?: string };

export const Route = createFileRoute("/_authenticated/dashboard/visibility")({
  head: () => ({
    meta: [
      { title: "Rank — Rankbox" },
      {
        name: "description",
        content:
          "How much of your market you answer, how ready those answers are for Google and AI engines, and the moves that grow both.",
      },
    ],
  }),
  validateSearch: (search: Record<string, unknown>): RankSearch => ({
    article: typeof search.article === "string" && search.article ? search.article : undefined,
  }),
  component: RankPage,
});

type MarketFilter = "all" | "gaps" | "scheduled" | "published";

const ENGINE_MARKS = AI_ALGORITHM_MARKS.filter((m) => m.name !== "Boundless");

function compact(n: number): string {
  if (n >= 10_000) return `${(n / 1000).toFixed(1).replace(/\.0$/, "")}k`;
  return n.toLocaleString();
}

function pct(part: number, total: number): number {
  return total > 0 ? Math.round((part / total) * 100) : 0;
}

/* ── Page ───────────────────────────────────────────────────────── */

function RankPage() {
  const { article } = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const queryClient = useQueryClient();
  const routing = useArticleRouting(article, (id, replace) =>
    navigate({ search: (prev) => ({ ...prev, article: id }), replace }),
  );
  const actions = useArticleActions({ openId: article, onOpen: routing.open });

  const { data: blogs = [], isLoading: loadingBlogs } = useAllArticles();
  const { data: kwLibrary = [], isLoading: loadingLibrary } = useQuery({
    queryKey: ["keywords", "library"],
    queryFn: () => listKeywords("library"),
  });
  const { data: kwDiscovered = [], isLoading: loadingDiscovered } = useQuery({
    queryKey: ["keywords", "discovered"],
    queryFn: () => listKeywords("discovered"),
  });
  const loading = loadingBlogs || loadingLibrary || loadingDiscovered;

  const analyses = useMemo(
    () =>
      new Map<string, SeoAnalysis>(
        blogs.filter((b) => b.status === "finished").map((b) => [b.id, analyzeArticle(b)]),
      ),
    [blogs],
  );
  const market = useMemo(
    () => buildMarket(blogs, [...kwLibrary, ...kwDiscovered], analyses),
    [blogs, kwLibrary, kwDiscovered, analyses],
  );
  const coverage = coverageOf(market);
  const trajectory = useMemo(() => buildTrajectory(blogs), [blogs]);
  const signals = signalCoverage([...analyses.values()]);
  const moves = buildMoves(market, blogs, analyses, { canWrite: actions.remaining > 0 });

  const published = blogs.filter((b) => b.status === "finished");
  const visitsNow = published.reduce((s, b) => s + (b.traffic_estimate ?? 0), 0);
  const visitsPlanned =
    visitsNow +
    blogs
      .filter((b) => b.status === "scheduled" || b.status === "generating")
      .reduce((s, b) => s + (b.traffic_estimate ?? 0), 0);
  const avgScore = analyses.size
    ? Math.round([...analyses.values()].reduce((s, a) => s + a.score, 0) / analyses.size)
    : null;
  const weakestSignal = analyses.size
    ? [...signals].sort((a, b) => a.passing - b.passing)[0]
    : null;

  // Plan an article for a keyword nobody answers yet, then open it so the user
  // can write it now or put it on the schedule.
  const [planning, setPlanning] = useState<string | null>(null);
  async function plan(row: MarketRow) {
    setPlanning(row.key);
    try {
      const blog = await createBlog({
        title: titleFromKeyword(row.keyword),
        keyword: row.keyword,
        description: "",
        status: "opportunity",
        traffic_estimate: row.traffic,
        tags: [],
      });
      await queryClient.invalidateQueries({ queryKey: ["blogs"] });
      routing.open(blog.id);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't plan this article.");
    } finally {
      setPlanning(null);
    }
  }

  function runMove(move: Move) {
    if (move.kind === "cover" && move.row) void plan(move.row);
    else if (move.kind === "schedule" && move.blog) void actions.schedule(move.blog);
    else if (move.kind === "accelerate" && move.blog) void actions.write(move.blog);
    else if (move.blog) routing.open(move.blog.id);
  }

  const nothingYet = !loading && market.length === 0 && blogs.length === 0;
  // Unknown while the subscription loads, so paying users never see the gate flash.
  const locked = actions.subscription !== undefined && !isEntitled(actions.subscription);

  return (
    <div className="space-y-6">
      {actions.dialogs}
      <PageHeader
        title="Rank"
        description="How much of your market you answer, how ready those answers are for Google and AI engines, and the moves that grow both."
      />

      <SubscriptionGate
        locked={locked}
        className="space-y-6"
        title="See where you rank — and what to do next"
        description="How much of your market you answer, how ready each article is for Google and AI engines, and the moves that grow your traffic."
        points={[
          "Market coverage across every keyword you track",
          "Next best moves, ranked by the traffic they add",
          "What AI engines look for, and which articles have it",
        ]}
        onStartTrial={actions.openTrial}
      >
        {nothingYet ? (
          <EmptyState
            icon={<TargetIcon className="h-6 w-6" />}
            title="Your market isn't mapped yet"
            description="Rankbox maps the searches your customers make when you connect your site, then tracks how many you answer."
            action={
              <Link to="/dashboard">
                <Button>Go to Overview</Button>
              </Link>
            }
          />
        ) : (
          <>
            <Headline
              loading={loading}
              coverage={coverage}
              visitsNow={visitsNow}
              visitsPlanned={visitsPlanned}
              publishedCount={published.length}
              avgScore={avgScore}
              weakestSignal={weakestSignal?.label ?? null}
            />

            <Panel className="p-5 sm:p-6">
              <div className="mb-4 flex flex-wrap items-start justify-between gap-x-6 gap-y-2">
                <div className="min-w-0">
                  <h2 className="text-sm font-semibold text-ink">Projected monthly visits</h2>
                  <p className="mt-1 max-w-xl text-xs leading-relaxed text-muted-foreground">
                    Each article's traffic projection, counted from the day it goes live. Real
                    traffic builds over the weeks after, as search engines index the page.
                  </p>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <LineKey label="Published" />
                  <LineKey label="Scheduled" dashed />
                </div>
              </div>
              {loading ? (
                <div className="skeleton h-[232px] w-full" />
              ) : trajectory ? (
                <VisitsChart points={trajectory} />
              ) : (
                <p className="py-16 text-center text-sm text-muted-foreground">
                  Your curve starts with your first scheduled or published article.
                </p>
              )}
            </Panel>

            <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
              <NextMoves
                moves={moves}
                loading={loading}
                busyKey={planning}
                creditsLeft={actions.remaining}
                onRun={runMove}
              />
              <AiSignals signals={signals} loading={loading} />
            </div>

            <MarketTable
              rows={market}
              loading={loading}
              openId={article}
              planning={planning}
              onOpen={routing.open}
              onPlan={(row) => void plan(row)}
              onSchedule={(blog) => void actions.schedule(blog)}
            />
          </>
        )}
      </SubscriptionGate>

      <ArticlePanel
        articleId={article}
        blog={article ? blogs.find((b) => b.id === article) : undefined}
        loading={loadingBlogs}
        writing={!!article && actions.writingIds.has(article)}
        nav={{ onClose: routing.close }}
        actions={{
          creditsLeft: actions.remaining,
          onWrite: (b) => void actions.write(b),
          onSchedule: actions.schedule,
          onDelete: (b) => actions.remove(b, routing.close),
          onReschedule: actions.reschedule,
        }}
      />
    </div>
  );
}

/* ── Headline ───────────────────────────────────────────────────── */

function Headline({
  loading,
  coverage,
  visitsNow,
  visitsPlanned,
  publishedCount,
  avgScore,
  weakestSignal,
}: {
  loading: boolean;
  coverage: ReturnType<typeof coverageOf>;
  visitsNow: number;
  visitsPlanned: number;
  publishedCount: number;
  avgScore: number | null;
  weakestSignal: string | null;
}) {
  const { total, published, planned, open, basis } = coverage;
  const share = pct(published, total);
  const segments = [
    { key: "published", label: "Published", value: published, className: "bg-volt" },
    { key: "planned", label: "Scheduled", value: planned, className: "bg-volt/35" },
    { key: "open", label: "Open", value: open, className: "bg-border" },
  ];

  return (
    <Panel className="overflow-hidden">
      <div className="grid gap-px bg-border lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,1fr)]">
        {/* The one number this page leads with. */}
        <div className="flex flex-col gap-3 bg-card p-6">
          <p className="text-sm font-medium text-muted-foreground">Market coverage</p>
          {loading ? (
            <div className="skeleton h-12 w-28" />
          ) : (
            <p className="text-5xl font-semibold leading-none tracking-tight text-ink">{share}%</p>
          )}
          <p className="text-sm text-muted-foreground">
            {basis === "searches"
              ? `of the ${compact(total)} monthly searches in your market have a published answer.`
              : `of the ${total} topics you target have a published answer.`}
          </p>
          {!loading && total > 0 && (
            <div className="mt-1 space-y-2">
              <div
                className="flex h-2 gap-[2px] overflow-hidden rounded-full"
                role="img"
                aria-label={segments.map((s) => `${s.label} ${pct(s.value, total)}%`).join(", ")}
              >
                {segments
                  .filter((s) => s.value > 0)
                  .map((s) => (
                    <span
                      key={s.key}
                      className={cn("h-full first:rounded-l-full last:rounded-r-full", s.className)}
                      style={{ width: `${(s.value / total) * 100}%` }}
                    />
                  ))}
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                {segments.map((s) => (
                  <span key={s.key} className="inline-flex items-center gap-1.5">
                    <span aria-hidden className={cn("h-2 w-2 rounded-full", s.className)} />
                    {s.label}
                    <span className="font-medium tabular-nums text-ink">
                      {pct(s.value, total)}%
                    </span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2.5 bg-card p-6">
          <p className="text-sm font-medium text-muted-foreground">Est. monthly visits</p>
          {loading ? (
            <div className="skeleton h-8 w-24" />
          ) : (
            <p className="text-[1.9rem] font-semibold leading-none tracking-tight text-ink">
              {visitsNow.toLocaleString()}
            </p>
          )}
          <p className="text-xs text-muted-foreground">
            From {publishedCount} published {publishedCount === 1 ? "article" : "articles"}.
          </p>
          {visitsPlanned > visitsNow && (
            <p className="mt-auto text-xs text-muted-foreground">
              <span className="font-semibold tabular-nums text-ink">
                {visitsPlanned.toLocaleString()}
              </span>{" "}
              once your schedule is written.
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2.5 bg-card p-6">
          <p className="text-sm font-medium text-muted-foreground">Avg. SEO score</p>
          {loading ? (
            <div className="skeleton h-8 w-16" />
          ) : (
            <p className="text-[1.9rem] font-semibold leading-none tracking-tight text-ink">
              {avgScore ?? "—"}
              {avgScore !== null && (
                <span className="text-lg font-medium text-muted-foreground"> / 100</span>
              )}
            </p>
          )}
          <p className="text-xs text-muted-foreground">
            {avgScore === null
              ? "Publish an article to see how ready it is to rank."
              : avgScore >= 80
                ? "Strong across your published articles."
                : avgScore >= 55
                  ? "Good — a few fixes would lift it."
                  : "Most articles need work to rank."}
          </p>
          {weakestSignal && (
            <p className="mt-auto text-xs text-muted-foreground">
              Most common gap: <span className="font-medium text-ink">{weakestSignal}</span>
            </p>
          )}
        </div>
      </div>
    </Panel>
  );
}

function LineKey({ label, dashed }: { label: string; dashed?: boolean }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <svg width="16" height="2" aria-hidden>
        <line
          x1="0"
          x2="16"
          y1="1"
          y2="1"
          stroke="var(--volt)"
          strokeWidth={2}
          strokeDasharray={dashed ? "4 3" : undefined}
        />
      </svg>
      {label}
    </span>
  );
}

/* ── Next best moves ────────────────────────────────────────────── */

const MOVE_ICON: Record<MoveKind, React.ReactNode> = {
  cover: <TargetIcon className="h-4 w-4" />,
  schedule: <CalendarIcon className="h-4 w-4" />,
  strengthen: <ArticleIcon className="h-4 w-4" />,
  accelerate: <VoltMark className="h-4 w-4" />,
};

const MOVE_ACTION: Record<MoveKind, string> = {
  cover: "Plan it",
  schedule: "Schedule",
  strengthen: "Improve",
  accelerate: "Write now",
};

function NextMoves({
  moves,
  loading,
  busyKey,
  creditsLeft,
  onRun,
}: {
  moves: Move[];
  loading: boolean;
  busyKey: string | null;
  creditsLeft: number;
  onRun: (move: Move) => void;
}) {
  return (
    <section className="space-y-3">
      <div>
        <h2 className="text-sm font-semibold text-ink">Next best moves</h2>
        <p className="mt-0.5 text-xs text-muted-foreground">
          What would grow your traffic most right now — new demand first, then fixes, then timing.
        </p>
      </div>
      <Panel className="divide-y divide-border">
        {loading ? (
          Array.from({ length: 3 }, (_, i) => (
            <div key={i} className="flex items-center gap-3 p-4">
              <div className="skeleton h-9 w-9" />
              <div className="flex-1 space-y-1.5">
                <div className="skeleton h-3.5 w-3/4" />
                <div className="skeleton h-3 w-1/2" />
              </div>
            </div>
          ))
        ) : moves.length === 0 ? (
          <p className="p-6 text-center text-sm text-muted-foreground">
            Nothing pressing. Every keyword you track has an answer on the way — autopilot adds new
            gaps as it finds them.
          </p>
        ) : (
          moves.map((move, i) => {
            const busy = move.row && busyKey === move.row.key;
            return (
              <div key={move.id} className="flex items-center gap-3 p-4">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-card border border-border bg-secondary text-muted-foreground">
                  {MOVE_ICON[move.kind]}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-2 text-sm font-medium text-ink">{move.title}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{move.reason}</p>
                </div>
                <div className="hidden shrink-0 text-right sm:block">
                  <TrafficValue value={move.impact} className="text-sm" />
                  <p className="text-[0.68rem] text-muted-foreground">
                    {move.kind === "strengthen"
                      ? "riding on it"
                      : move.kind === "accelerate"
                        ? "arrives sooner"
                        : "est. added"}
                  </p>
                </div>
                <Button
                  // The biggest move gets the solid button: do this one first.
                  variant={i === 0 ? (move.kind === "accelerate" ? "brand" : "solid") : "ghost"}
                  className="shrink-0"
                  disabled={!!busy}
                  onClick={() => onRun(move)}
                >
                  {busy && <Loader2 className="h-4 w-4 animate-spin" />}
                  {move.kind === "accelerate" && creditsLeft <= 0
                    ? "Upgrade"
                    : MOVE_ACTION[move.kind]}
                </Button>
              </div>
            );
          })
        )}
      </Panel>
    </section>
  );
}

/* ── What AI engines look for ───────────────────────────────────── */

function AiSignals({
  signals,
  loading,
}: {
  signals: ReturnType<typeof signalCoverage>;
  loading: boolean;
}) {
  const total = signals[0]?.total ?? 0;
  return (
    <section className="space-y-3">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-ink">What AI engines look for</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            How many of your published articles have each.
          </p>
        </div>
        <div className="flex items-center gap-1" aria-label="ChatGPT, Claude, Gemini and Google">
          {ENGINE_MARKS.map(({ name, Mark }) => (
            <span
              key={name}
              title={name}
              className="grid h-6 w-6 place-items-center rounded-md border border-border bg-card"
            >
              <Mark className="h-3.5 w-3.5" />
            </span>
          ))}
        </div>
      </div>
      <Panel className="p-5">
        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }, (_, i) => (
              <div key={i} className="skeleton h-8 w-full" />
            ))}
          </div>
        ) : total === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            Publish an article and you'll see which of these it gets right.
          </p>
        ) : (
          <ul className="space-y-4">
            {signals.map((s) => {
              const ratio = s.passing / s.total;
              const tone = ratio >= 0.7 ? "volt" : ratio >= 0.4 ? "warning" : "destructive";
              return (
                <li key={s.id}>
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="text-sm font-medium text-ink">{s.label}</p>
                    <p className="shrink-0 text-xs tabular-nums text-muted-foreground">
                      <span className="font-semibold text-ink">{s.passing}</span> of {s.total}
                    </p>
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">{s.why}</p>
                  <div
                    className={cn(
                      "mt-2 h-1.5 overflow-hidden rounded-full",
                      tone === "volt" && "bg-volt/10",
                      tone === "warning" && "bg-warning/15",
                      tone === "destructive" && "bg-destructive/10",
                    )}
                    role="meter"
                    aria-valuemin={0}
                    aria-valuemax={s.total}
                    aria-valuenow={s.passing}
                    aria-label={`${s.label}: ${s.passing} of ${s.total} articles`}
                  >
                    <div
                      className={cn(
                        "h-full rounded-full",
                        tone === "volt" && "bg-volt",
                        tone === "warning" && "bg-warning",
                        tone === "destructive" && "bg-destructive",
                      )}
                      style={{ width: `${ratio * 100}%` }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </Panel>
    </section>
  );
}

/* ── Your market ────────────────────────────────────────────────── */

const MARKET_COLUMNS: Column[] = [
  { label: "Keyword" },
  { label: "Searches", className: "w-28 text-right" },
  { label: "Est. traffic", className: "w-32" },
  { label: "Your article" },
  { label: "Status", className: "w-32" },
  { label: "SEO", className: "w-16" },
  // relative keeps the sr-only label inside the table's scroller.
  { label: <span className="sr-only">Actions</span>, className: "relative w-28" },
];

function inFilter(row: MarketRow, filter: MarketFilter): boolean {
  if (filter === "all") return true;
  if (filter === "gaps") return row.status === "gap" || row.status === "idea";
  if (filter === "scheduled") return row.status === "scheduled" || row.status === "writing";
  return row.status === "published";
}

function MarketTable({
  rows,
  loading,
  openId,
  planning,
  onOpen,
  onPlan,
  onSchedule,
}: {
  rows: MarketRow[];
  loading: boolean;
  openId?: string;
  planning: string | null;
  onOpen: (id: string) => void;
  onPlan: (row: MarketRow) => void;
  onSchedule: (blog: Blog) => void;
}) {
  const [filter, setFilter] = useState<MarketFilter>("all");
  const count = (f: MarketFilter) => rows.filter((r) => inFilter(r, f)).length;
  const visible = rows.filter((r) => inFilter(r, filter));

  return (
    <section className="space-y-3">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-ink">Your market</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Every keyword you track, biggest first, and the article that answers it.
          </p>
        </div>
        <Tabs
          tabs={[
            { id: "all" as const, label: "All", count: count("all") },
            { id: "gaps" as const, label: "Gaps", count: count("gaps") },
            { id: "scheduled" as const, label: "Scheduled", count: count("scheduled") },
            { id: "published" as const, label: "Published", count: count("published") },
          ]}
          value={filter}
          onChange={setFilter}
          className="w-full overflow-x-auto [scrollbar-width:none] sm:w-auto"
        />
      </div>

      {loading ? (
        <div className="skeleton h-64 w-full" />
      ) : visible.length === 0 ? (
        <Panel className="p-10 text-center text-sm text-muted-foreground">
          {filter === "gaps"
            ? "No gaps — every keyword you track has an article."
            : filter === "published"
              ? "Nothing published yet. Your first articles will show here."
              : "Nothing here yet."}
        </Panel>
      ) : (
        <DataTable columns={MARKET_COLUMNS} minWidth={880}>
          {visible.map((row) => {
            const a = row.article;
            return (
              <Tr
                key={row.key}
                onClick={(e) => {
                  if ((e.target as HTMLElement).closest("a, button")) return;
                  if (a) onOpen(a.id);
                }}
                className={cn(a && "cursor-pointer", a && a.id === openId && "bg-secondary/60")}
              >
                <Td>
                  <p className="font-medium text-ink">{row.keyword}</p>
                  {(row.intent || row.trend) && (
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {[row.intent, row.trend].filter(Boolean).join(" · ")}
                    </p>
                  )}
                </Td>
                <Td className="text-right tabular-nums text-ink">
                  {row.searches !== null ? (
                    row.searches.toLocaleString()
                  ) : (
                    <span className="text-muted-foreground/60">—</span>
                  )}
                </Td>
                <Td>
                  <TrafficValue value={row.traffic} />
                </Td>
                <Td>
                  {a ? (
                    <button
                      type="button"
                      data-article-link={a.id}
                      onClick={() => onOpen(a.id)}
                      title={a.title}
                      className="block max-w-[18rem] truncate text-left text-ink hover:underline focus-visible:underline focus-visible:outline-none"
                    >
                      {a.title}
                    </button>
                  ) : (
                    <span className="text-muted-foreground">No article yet</span>
                  )}
                </Td>
                <Td>
                  {a ? (
                    // With an article, a row's status is the article's stage.
                    <StagePill stage={row.status as Stage} overdue={isOverdue(a)} />
                  ) : (
                    <Pill tone="warning">Gap</Pill>
                  )}
                </Td>
                <Td>
                  {row.score !== null ? (
                    <span className="inline-flex items-center gap-1.5 font-medium tabular-nums text-ink">
                      <span
                        aria-hidden
                        className={cn(
                          "h-1.5 w-1.5 rounded-full",
                          row.score >= 80
                            ? "bg-success"
                            : row.score >= 55
                              ? "bg-warning"
                              : "bg-destructive",
                        )}
                      />
                      {row.score}
                    </span>
                  ) : (
                    <span className="text-muted-foreground/60">—</span>
                  )}
                </Td>
                <Td className="text-right">
                  {row.status === "gap" && (
                    <Button
                      variant="ghost"
                      className="h-8 px-3 text-xs"
                      disabled={planning === row.key}
                      onClick={() => onPlan(row)}
                    >
                      {planning === row.key && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                      Plan it
                    </Button>
                  )}
                  {row.status === "idea" && a && (
                    <Button
                      variant="ghost"
                      className="h-8 px-3 text-xs"
                      onClick={() => onSchedule(a)}
                    >
                      Schedule
                    </Button>
                  )}
                </Td>
              </Tr>
            );
          })}
        </DataTable>
      )}
    </section>
  );
}
