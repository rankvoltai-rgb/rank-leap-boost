import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import type { Blog } from "@/lib/data";
import { Button, PageHeader, Tabs, EmptyState } from "@/components/dashboard/primitives";
import { DataTable, Tr, Td, type Column } from "@/components/dashboard/data-table";
import { AiSignalFlames, DifficultyBar } from "@/components/dashboard/signals";
import { ArticleIcon, VoltMark } from "@/components/dashboard/icons";
import { TrafficValue } from "@/components/dashboard/traffic";
import { ArticlePanel } from "@/components/dashboard/ArticlePanel";
import {
  useAllArticles,
  useArticleActions,
  useArticleRouting,
} from "@/components/dashboard/useArticleActions";
import { StagePill } from "@/components/dashboard/article-parts";
import {
  hasBody,
  inView,
  isOverdue,
  matchesQuery,
  sortArticles,
  stageOf,
  type ArticleView,
  type Stage,
} from "@/components/dashboard/article-stages";
import { formatShortDate } from "@/lib/format-date";
import { analyzeArticle } from "@/lib/seo-analysis";
import { cn } from "@/lib/utils";

type ArticlesSearch = {
  /** The article open in the slide-over. */
  article?: string;
  /** Omitted for "all", so the default view keeps a clean URL. */
  view?: Exclude<ArticleView, "all">;
};

export const Route = createFileRoute("/_authenticated/dashboard/blog-engine")({
  validateSearch: (search: Record<string, unknown>): ArticlesSearch => ({
    article: typeof search.article === "string" && search.article ? search.article : undefined,
    view:
      search.view === "ideas" || search.view === "scheduled" || search.view === "published"
        ? search.view
        : undefined,
  }),
  component: Articles,
});

/* ── Columns ────────────────────────────────────────────────────── */

type ColumnKey =
  | "article"
  | "status"
  | "date"
  | "traffic"
  | "seo"
  | "competition"
  | "signal"
  | "actions";

// Each view shows what its stage is decided on: ideas by opportunity, the
// schedule by date, published work by score. A column that would read "—" on
// every row is left out rather than shown empty.
const VIEW_COLUMNS: Record<ArticleView, ColumnKey[]> = {
  all: ["article", "status", "date", "traffic", "seo", "actions"],
  ideas: ["article", "competition", "signal", "traffic", "actions"],
  scheduled: ["article", "status", "date", "traffic", "actions"],
  published: ["article", "date", "traffic", "seo"],
};

const DATE_LABEL: Record<ArticleView, string> = {
  all: "Date",
  ideas: "Date",
  scheduled: "Writes on",
  published: "Updated",
};

function columnFor(key: ColumnKey, view: ArticleView): Column {
  switch (key) {
    case "article":
      return { label: "Article" };
    case "status":
      return { label: "Status", className: "w-36" };
    case "date":
      return { label: DATE_LABEL[view], className: "w-28" };
    case "traffic":
      return { label: "Est. traffic", className: "w-32" };
    case "seo":
      return { label: "SEO", className: "w-20" };
    case "competition":
      return { label: "Competition", className: "w-36" };
    case "signal":
      return { label: "AI signal", className: "w-28" };
    case "actions":
      // relative: the sr-only label is absolutely positioned, and without a
      // positioned cell it escapes the table's scroller and widens the page.
      return { label: <span className="sr-only">Actions</span>, className: "relative w-14" };
  }
}

const EMPTY_VIEW: Record<Exclude<ArticleView, "all">, { title: string; description: string }> = {
  ideas: {
    title: "No ideas waiting",
    description: "Autopilot adds ideas here as it finds content gaps on your site.",
  },
  scheduled: {
    title: "Nothing scheduled",
    description: "Schedule an idea and autopilot writes it on its date.",
  },
  published: {
    title: "Nothing published yet",
    description: "Articles land here the moment they're written.",
  },
};

function Dash() {
  return <span className="text-muted-foreground/60">—</span>;
}

/* ── Page ───────────────────────────────────────────────────────── */

function Articles() {
  const { article, view = "all" } = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });

  const [query, setQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);
  const articleRef = useRef(article);
  articleRef.current = article;

  const routing = useArticleRouting(article, (id, replace) =>
    navigate({ search: (prev) => ({ ...prev, article: id }), replace }),
  );
  const actions = useArticleActions({ openId: article, onOpen: routing.open });
  const { remaining, isWriting, writingIds } = actions;

  const { data: all = [], isLoading } = useAllArticles();
  const sorted = useMemo(() => sortArticles(all, isWriting), [all, isWriting]);
  const stageById = useMemo(
    () => new Map(sorted.map((b) => [b.id, stageOf(b, isWriting(b.id))] as const)),
    [sorted, isWriting],
  );
  const stage = (b: Blog): Stage => stageById.get(b.id) ?? stageOf(b);

  const counts = useMemo(() => {
    const c = { all: sorted.length, ideas: 0, scheduled: 0, published: 0 };
    for (const s of stageById.values()) {
      if (inView(s, "ideas")) c.ideas += 1;
      else if (inView(s, "scheduled")) c.scheduled += 1;
      else c.published += 1;
    }
    return c;
  }, [sorted, stageById]);

  const inTab = useMemo(
    () => sorted.filter((b) => inView(stageById.get(b.id) ?? stageOf(b), view)),
    [sorted, stageById, view],
  );
  const visible = useMemo(() => inTab.filter((b) => matchesQuery(b, query)), [inTab, query]);

  // Scored the way the editor scores, so a row and its open article agree.
  const seoById = useMemo(
    () =>
      new Map(
        all.filter((b) => b.status === "finished").map((b) => [b.id, analyzeArticle(b).score]),
      ),
    [all],
  );

  /* ── Panel navigation ── */

  function setView(next: ArticleView) {
    navigate({
      search: (prev) => ({ ...prev, view: next === "all" ? undefined : next }),
      replace: true,
    });
  }

  const openBlog = article ? all.find((b) => b.id === article) : undefined;
  // The arrows walk what the user is looking at; if the article isn't in it
  // (opened from elsewhere), they walk everything.
  const walk = article && visible.some((b) => b.id === article) ? visible : sorted;
  const index = article ? walk.findIndex((b) => b.id === article) : -1;
  const prevId = index > 0 ? walk[index - 1].id : undefined;
  const nextId = index >= 0 && index < walk.length - 1 ? walk[index + 1].id : undefined;

  // "/" jumps to search, the way every list with a search box works.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key !== "/" || e.metaKey || e.ctrlKey || e.altKey || articleRef.current) return;
      const target = e.target as HTMLElement | null;
      if (target?.closest("input, textarea, select, [contenteditable='true']")) return;
      e.preventDefault();
      searchRef.current?.focus();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function onRowClick(e: React.MouseEvent, id: string) {
    // Links and buttons inside the row do their own thing.
    if ((e.target as HTMLElement).closest("a, button")) return;
    routing.open(id);
  }

  /* ── Render ── */

  const TABS: { id: ArticleView; label: string; count: number }[] = [
    { id: "all", label: "All", count: counts.all },
    { id: "ideas", label: "Ideas", count: counts.ideas },
    { id: "scheduled", label: "Scheduled", count: counts.scheduled },
    { id: "published", label: "Published", count: counts.published },
  ];
  const columnKeys = VIEW_COLUMNS[view];
  const columns = columnKeys.map((k) => columnFor(k, view));

  function cell(key: ColumnKey, b: Blog) {
    const s = stage(b);
    switch (key) {
      case "article":
        return (
          <div className="flex min-w-0 items-center gap-3">
            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg border border-border bg-secondary text-muted-foreground">
              <ArticleIcon className="h-3.5 w-3.5" />
            </span>
            <div className="min-w-0">
              <Link
                from={Route.fullPath}
                to="."
                search={(prev) => ({ ...prev, article: b.id })}
                onClick={routing.markOpenedHere}
                data-article-link={b.id}
                title={b.title}
                className="block max-w-52 truncate font-medium text-ink outline-none focus-visible:underline sm:max-w-[26rem]"
              >
                {b.title || "Untitled article"}
              </Link>
              {b.keyword && (
                <p className="mt-0.5 max-w-52 truncate text-xs text-muted-foreground sm:max-w-[26rem]">
                  {b.keyword}
                </p>
              )}
            </div>
          </div>
        );
      case "status":
        return <StagePill stage={s} overdue={isOverdue(b)} />;
      case "date": {
        const iso =
          s === "published" ? b.updated_at : s === "idea" ? null : (b.scheduled_date ?? null);
        const text = formatShortDate(iso);
        return text ? <span className="tabular-nums text-ink">{text}</span> : <Dash />;
      }
      case "traffic":
        return <TrafficValue value={b.traffic_estimate ?? 0} />;
      case "seo": {
        const score = seoById.get(b.id);
        if (s !== "published" || score === undefined) return <Dash />;
        return (
          <span className="inline-flex items-center gap-1.5 font-medium tabular-nums text-ink">
            <span
              aria-hidden
              className={cn(
                "h-1.5 w-1.5 rounded-full",
                score >= 80 ? "bg-success" : score >= 55 ? "bg-warning" : "bg-destructive",
              )}
            />
            {score}
          </span>
        );
      }
      case "competition":
        return <DifficultyBar label={b.competition} />;
      case "signal":
        return <AiSignalFlames signal={b.ai_signal ?? 0} label={false} />;
      case "actions": {
        // A quick write for articles nobody has written — never over a draft.
        if ((s !== "scheduled" && s !== "idea") || hasBody(b)) return null;
        const label = remaining > 0 ? "Write now" : "Upgrade to write";
        return (
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => void actions.write(b)}
              aria-label={`${label}: ${b.title}`}
              title={label}
              className="grid h-8 w-8 place-items-center rounded-lg border border-border bg-card text-ink opacity-0 transition hover:bg-secondary focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring group-hover:opacity-100 pointer-coarse:opacity-100"
            >
              <VoltMark className="h-4 w-4" />
            </button>
          </div>
        );
      }
    }
  }

  let content: React.ReactNode;
  if (isLoading) {
    content = (
      <DataTable columns={columns}>
        {Array.from({ length: 6 }, (_, i) => (
          <Tr key={i}>
            <Td>
              <div className="flex items-center gap-3">
                <div className="skeleton h-7 w-7" />
                <div className="space-y-1.5">
                  <div className="skeleton h-3.5 w-56" />
                  <div className="skeleton h-3 w-28" />
                </div>
              </div>
            </Td>
            {columnKeys.slice(1).map((k) => (
              <Td key={k}>{k !== "actions" && <div className="skeleton h-3.5 w-16" />}</Td>
            ))}
          </Tr>
        ))}
      </DataTable>
    );
  } else if (all.length === 0) {
    content = (
      <EmptyState
        icon={<ArticleIcon className="h-6 w-6" />}
        title="No articles yet"
        description="Autopilot plans articles from the content gaps on your site. Claim one on the Overview to get started."
        action={
          <Link to="/dashboard">
            <Button>Go to Overview</Button>
          </Link>
        }
      />
    );
  } else if (visible.length === 0 && query.trim()) {
    content = (
      <EmptyState
        icon={<Search className="h-6 w-6" />}
        title={`Nothing matches “${query.trim()}”`}
        description="Search looks at titles and keywords."
        action={
          <Button variant="ghost" onClick={() => setQuery("")}>
            Clear search
          </Button>
        }
      />
    );
  } else if (visible.length === 0 && view !== "all") {
    content = (
      <EmptyState
        icon={<ArticleIcon className="h-6 w-6" />}
        title={EMPTY_VIEW[view].title}
        description={EMPTY_VIEW[view].description}
        action={
          view !== "ideas" && counts.ideas > 0 ? (
            <Button variant="ghost" onClick={() => setView("ideas")}>
              Browse {counts.ideas} {counts.ideas === 1 ? "idea" : "ideas"}
            </Button>
          ) : (
            <Link to="/dashboard">
              <Button variant="ghost">Go to Overview</Button>
            </Link>
          )
        }
      />
    );
  } else {
    content = (
      <DataTable columns={columns}>
        {visible.map((b) => (
          <Tr
            key={b.id}
            onClick={(e) => onRowClick(e, b.id)}
            className={cn("group cursor-pointer", b.id === article && "bg-secondary/60")}
          >
            {columnKeys.map((k) => (
              <Td key={k}>{cell(k, b)}</Td>
            ))}
          </Tr>
        ))}
      </DataTable>
    );
  }

  return (
    <div className="space-y-6">
      {actions.dialogs}
      <PageHeader
        title="Articles"
        description="Everything autopilot writes for you, from first idea to published."
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Tabs
          tabs={TABS}
          value={view}
          onChange={setView}
          className="w-full overflow-x-auto [scrollbar-width:none] sm:w-auto"
        />
        {all.length > 0 && (
          <label className="relative block w-full sm:w-72">
            <span className="sr-only">Search articles</span>
            <Search
              aria-hidden
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            />
            <input
              ref={searchRef}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  setQuery("");
                  e.currentTarget.blur();
                }
              }}
              placeholder="Search articles"
              className="h-[2.625rem] w-full rounded-card border border-border bg-card pl-9 pr-9 text-sm text-ink outline-none transition-shadow placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring/30 [&::-webkit-search-cancel-button]:hidden"
            />
            {query ? (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  searchRef.current?.focus();
                }}
                aria-label="Clear search"
                className="absolute right-2 top-1/2 grid h-6 w-6 -translate-y-1/2 place-items-center rounded-md text-muted-foreground hover:bg-secondary hover:text-ink"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            ) : (
              <kbd className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 rounded-sm border border-border bg-secondary px-1.5 font-sans text-[0.65rem] font-medium text-muted-foreground">
                /
              </kbd>
            )}
          </label>
        )}
      </div>

      {content}

      <ArticlePanel
        articleId={article}
        blog={openBlog}
        loading={isLoading}
        writing={!!article && writingIds.has(article)}
        nav={{
          onClose: routing.close,
          onPrev: prevId ? () => routing.show(prevId) : undefined,
          onNext: nextId ? () => routing.show(nextId) : undefined,
          position: index >= 0 ? { index, total: walk.length } : null,
        }}
        actions={{
          creditsLeft: remaining,
          onWrite: (b) => void actions.write(b),
          onSchedule: actions.schedule,
          // Close before the list drops the row, so the panel never flashes "missing".
          onDelete: (b) => actions.remove(b, routing.close),
          onReschedule: actions.reschedule,
        }}
      />
    </div>
  );
}
