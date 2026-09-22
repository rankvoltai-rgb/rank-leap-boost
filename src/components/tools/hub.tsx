/**
 * The /tools hub and the pieces the tool pages share with it: the tool card,
 * the kind badge, the hero, the searchable grid and the toolkit paths.
 */
import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Search, X } from "lucide-react";
import { PixelField } from "@/components/landing/Hero";
import { Reveal } from "@/components/landing/shared";
import {
  KIND_LABEL,
  TOOLKITS,
  TOOLS,
  TOOL_CATEGORIES,
  getTool,
  getToolCategory,
  type Tool,
  type ToolCategoryId,
  type ToolKind,
} from "@/data/tools";
import { cn } from "@/lib/utils";
import { TOOL_ICONS } from "./icons";

/* ---------- badges ---------- */

const KIND_TONE: Record<ToolKind, string> = {
  instant: "border-border bg-surface text-ink/70",
  ai: "border-volt/30 bg-volt/10 text-volt",
  live: "border-success/30 bg-success/10 text-success",
};

export function KindBadge({ kind, className }: { kind: ToolKind; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex h-5 items-center rounded-full border px-2 text-[0.62rem] font-semibold uppercase tracking-[0.1em]",
        KIND_TONE[kind],
        className,
      )}
    >
      {KIND_LABEL[kind].label}
    </span>
  );
}

export function ToolIconTile({
  tool,
  className,
  iconClassName,
}: {
  tool: Tool;
  className?: string;
  iconClassName?: string;
}) {
  const Icon = TOOL_ICONS[tool.icon];
  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center rounded-xl border border-border bg-surface text-ink",
        className,
      )}
    >
      <Icon className={cn("h-[46%] w-[46%]", iconClassName)} strokeWidth={1.75} />
    </span>
  );
}

/* ---------- card ---------- */

export function ToolCard({ tool, className }: { tool: Tool; className?: string }) {
  return (
    <Link
      to="/tools/$slug"
      params={{ slug: tool.slug }}
      className={cn(
        "group relative flex h-full flex-col rounded-2xl border border-border bg-card p-5 shadow-1 transition-all hover:-translate-y-0.5 hover:border-ink/15 hover:shadow-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-volt",
        className,
      )}
    >
      <span className="flex items-start justify-between gap-3">
        <ToolIconTile
          tool={tool}
          className="h-11 w-11 transition-colors group-hover:border-ink/20 group-hover:bg-card"
        />
        <KindBadge kind={tool.kind} />
      </span>
      <span className="mt-4 font-display text-[1.05rem] font-semibold leading-snug tracking-tight text-ink">
        {tool.name}
      </span>
      <span className="mt-1.5 flex-1 text-[0.88rem] leading-relaxed text-muted-foreground">
        {tool.tagline}
      </span>
      <span className="mt-4 flex items-center justify-between">
        <span className="text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          {getToolCategory(tool.category).name}
        </span>
        <span className="inline-flex items-center gap-1 text-[0.8rem] font-semibold text-ink/70 transition-colors group-hover:text-volt">
          Open
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </span>
      </span>
    </Link>
  );
}

/* ---------- toolkit (reading path) ---------- */

export function ToolkitCard({
  id,
  className,
  dark = false,
}: {
  id: string;
  className?: string;
  dark?: boolean;
}) {
  const kit = TOOLKITS.find((k) => k.id === id);
  if (!kit) return null;
  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-border bg-card text-ink",
        dark && "shadow-2xl shadow-brand-blue-deep/30",
        className,
      )}
    >
      <div className="border-b border-border px-5 py-4">
        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-volt">Toolkit</p>
        <p className="mt-1 font-display text-[1.05rem] font-semibold tracking-tight">{kit.title}</p>
        <p className="mt-1 text-sm text-muted-foreground">{kit.description}</p>
      </div>
      <ol className="divide-y divide-border">
        {kit.steps.map((s, i) => {
          const tool = getTool(s.slug);
          if (!tool) return null;
          return (
            <li key={s.slug}>
              <Link
                to="/tools/$slug"
                params={{ slug: s.slug }}
                className="group flex items-center gap-3.5 px-5 py-3 transition-colors hover:bg-surface/70"
              >
                <span className="font-mono text-[0.72rem] font-semibold text-muted-foreground group-hover:text-volt">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <ToolIconTile tool={tool} className="h-8 w-8" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[0.92rem] font-semibold leading-snug">
                    {tool.name}
                  </span>
                  <span className="block truncate text-xs text-muted-foreground">{s.why}</span>
                </span>
                <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-all group-hover:translate-x-0.5 group-hover:text-ink" />
              </Link>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

/* ---------- hero ---------- */

export function ToolsHero() {
  const instant = TOOLS.filter((t) => t.kind === "instant").length;
  return (
    <section
      aria-labelledby="tools-title"
      className="relative overflow-hidden bg-brand-blue text-white"
    >
      <PixelField seed={3} />
      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-5 pb-14 pt-12 sm:pb-16 sm:pt-16 lg:grid-cols-[1.15fr_0.85fr] lg:pb-20">
        <div className="text-center lg:text-left">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur">
              {TOOLS.length} free tools · No signup · {instant} run in your browser
            </span>
          </Reveal>
          <Reveal delay={0.06}>
            <h1
              id="tools-title"
              className="mt-6 font-display text-balance text-[2.5rem] font-bold leading-[1.04] tracking-tight sm:text-[3.4rem] xl:text-[3.75rem]"
            >
              Free tools for Google and AI search
            </h1>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mx-auto mt-6 max-w-xl text-balance text-[1.05rem] leading-relaxed text-white/80 lg:mx-0">
              Generate the files AI crawlers look for, check what they can see, and tighten pages
              until they're the answer ChatGPT, Perplexity and Google quote. Built by the team that
              does this daily.
            </p>
          </Reveal>
          <Reveal delay={0.18}>
            <a
              href="#all-tools"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-brand-blue shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              <Search className="h-4 w-4" aria-hidden />
              Browse all {TOOLS.length} tools
            </a>
          </Reveal>
        </div>
        <Reveal delay={0.22} y={24} className="hidden lg:block">
          <ToolkitCard id="readable" dark />
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- explorer ---------- */

function score(tool: Tool, q: string): number {
  const name = tool.name.toLowerCase();
  if (name === q) return 100;
  if (name.startsWith(q)) return 80;
  if (name.includes(q)) return 60;
  if (tool.keywords.some((k) => k.includes(q))) return 40;
  if (tool.tagline.toLowerCase().includes(q)) return 20;
  return 0;
}

type KindFilter = "all" | ToolKind;

export function ToolExplorer({
  category,
  onCategory,
}: {
  category?: ToolCategoryId;
  onCategory: (c?: ToolCategoryId) => void;
}) {
  const [query, setQuery] = useState("");
  const [kind, setKind] = useState<KindFilter>("all");
  const inputRef = useRef<HTMLInputElement>(null);
  const q = query.trim().toLowerCase();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "/" || e.metaKey || e.ctrlKey || e.altKey) return;
      const el = e.target as HTMLElement | null;
      if (el && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName))) return;
      e.preventDefault();
      inputRef.current?.focus();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const results = useMemo(() => {
    const base = TOOLS.filter(
      (t) => (!category || t.category === category) && (kind === "all" || t.kind === kind),
    );
    if (!q) return base;
    return base
      .map((t) => ({ t, s: score(t, q) }))
      .filter((r) => r.s > 0)
      .sort((a, b) => b.s - a.s)
      .map((r) => r.t);
  }, [category, kind, q]);

  const grouped = useMemo(() => {
    if (q || category) return null;
    return TOOL_CATEGORIES.map((c) => ({
      c,
      tools: results.filter((t) => t.category === c.id),
    })).filter((g) => g.tools.length);
  }, [results, q, category]);

  const chip = (on: boolean) =>
    cn(
      "inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full border px-3 text-[0.8rem] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-volt",
      on
        ? "border-ink bg-ink text-background"
        : "border-border bg-card text-ink/75 hover:border-ink/25 hover:text-ink",
    );

  return (
    <section id="all-tools" aria-label="All tools" className="scroll-mt-16">
      <div className="z-30 border-b border-border bg-background/90 backdrop-blur-md md:sticky md:top-16">
        <div className="mx-auto max-w-6xl space-y-3 px-5 py-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <label className="relative flex h-11 items-center md:w-80 md:shrink-0">
              <span className="sr-only">Search tools</span>
              <Search
                className="pointer-events-none absolute left-3.5 h-4 w-4 text-muted-foreground"
                aria-hidden
              />
              <input
                ref={inputRef}
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Escape" && setQuery("")}
                placeholder="Search tools, e.g. robots, schema"
                className="h-full w-full rounded-xl border border-border bg-card pl-10 pr-10 text-sm text-ink shadow-1 outline-none transition-shadow placeholder:text-muted-foreground focus:border-volt/50 focus:ring-2 focus:ring-volt/20 [&::-webkit-search-cancel-button]:hidden"
              />
              {query ? (
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    inputRef.current?.focus();
                  }}
                  aria-label="Clear search"
                  className="absolute right-2.5 flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary hover:text-ink"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              ) : (
                <kbd className="pointer-events-none absolute right-3 hidden h-5 items-center rounded border border-border bg-surface px-1.5 font-mono text-[0.68rem] text-muted-foreground md:inline-flex">
                  /
                </kbd>
              )}
            </label>
            <div
              role="group"
              aria-label="Filter by category"
              className="-mx-5 flex gap-1.5 overflow-x-auto px-5 pb-0.5 [scrollbar-width:none] md:mx-0 md:px-0"
            >
              <button
                type="button"
                aria-pressed={!category}
                onClick={() => onCategory(undefined)}
                className={chip(!category)}
              >
                All <span className="font-medium opacity-60">{TOOLS.length}</span>
              </button>
              {TOOL_CATEGORIES.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  aria-pressed={category === c.id}
                  onClick={() => onCategory(category === c.id ? undefined : c.id)}
                  className={chip(category === c.id)}
                >
                  {c.name}{" "}
                  <span className="font-medium opacity-60">
                    {TOOLS.filter((t) => t.category === c.id).length}
                  </span>
                </button>
              ))}
            </div>
          </div>
          <div role="group" aria-label="Filter by type" className="flex flex-wrap gap-1.5">
            {(["all", "instant", "ai", "live"] as KindFilter[]).map((k) => (
              <button
                key={k}
                type="button"
                aria-pressed={kind === k}
                onClick={() => setKind(k)}
                className={cn(
                  "inline-flex h-7 items-center rounded-full border px-2.5 text-[0.72rem] font-semibold transition-colors",
                  kind === k
                    ? "border-ink/30 bg-secondary text-ink"
                    : "border-transparent text-muted-foreground hover:text-ink",
                )}
              >
                {k === "all" ? "All types" : KIND_LABEL[k].label}
                {k !== "all" && (
                  <span className="ml-1.5 font-normal opacity-70">· {KIND_LABEL[k].note}</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-5 py-12 sm:py-14">
        <p aria-live="polite" className="text-sm text-muted-foreground">
          {q ? (
            <>
              {results.length} {results.length === 1 ? "tool matches" : "tools match"} &ldquo;
              {query.trim()}&rdquo;
            </>
          ) : category ? (
            <>
              <span className="font-semibold text-ink">{getToolCategory(category).name}</span> ·{" "}
              {getToolCategory(category).description}
            </>
          ) : (
            <>All {results.length} tools, by category</>
          )}
        </p>

        {results.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-border bg-card px-6 py-14 text-center">
            <p className="font-display text-lg font-semibold text-ink">No tool matches that yet</p>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              Try a shorter word, or clear the filters. If a tool you need is missing, tell us — we
              build the ones people ask for.
            </p>
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setKind("all");
                onCategory(undefined);
              }}
              className="mt-6 rounded-xl bg-ink px-5 py-2.5 text-sm font-semibold text-background"
            >
              Clear search and filters
            </button>
          </div>
        ) : grouped ? (
          <div className="mt-8 space-y-14">
            {grouped.map(({ c, tools }) => (
              <section
                key={c.id}
                aria-label={c.name}
                className="grid gap-5 lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-8"
              >
                <div className="lg:sticky lg:top-40 lg:self-start">
                  <h2 className="font-display text-xl font-semibold tracking-tight text-ink">
                    {c.name}
                  </h2>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {c.description}
                  </p>
                </div>
                <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {tools.map((t) => (
                    <li key={t.slug}>
                      <ToolCard tool={t} />
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        ) : (
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((t) => (
              <li key={t.slug}>
                <ToolCard tool={t} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

/* ---------- toolkits ---------- */

export function ToolkitsSection() {
  return (
    <section aria-labelledby="toolkits-title" className="border-y border-border bg-surface/60">
      <div className="mx-auto max-w-6xl px-5 py-20 sm:py-24">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2
            id="toolkits-title"
            className="font-display text-balance text-3xl font-semibold tracking-tight text-ink sm:text-4xl"
          >
            Three jobs, in order
          </h2>
          <p className="mt-4 text-balance text-lg text-muted-foreground">
            Not sure where to start? Each toolkit is a job to be done, with the tools that do it, in
            the order they help.
          </p>
        </Reveal>
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {TOOLKITS.map((k, i) => (
            <Reveal key={k.id} delay={i * 0.05}>
              <ToolkitCard id={k.id} className="h-full shadow-1" />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
