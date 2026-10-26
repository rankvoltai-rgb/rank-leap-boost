/**
 * The /tools hub and the pieces the tool pages share with it: the tool card,
 * the kind badge, the hero, the searchable grid, the toolkit paths and the
 * FAQ. Laid out in the landing page's frame: hairline rails, a hairline over
 * every band, tools as hairline cells rather than floating cards.
 */
import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { Link } from "@tanstack/react-router";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ArrowRight, HelpCircle, Plus, Route as RouteIcon, Search, Wrench, X } from "lucide-react";
import { Reveal } from "@/components/landing/shared";
import { MarkDither } from "@/components/landing/hero-dither";
import {
  Accent,
  Band,
  CELL,
  CellGrid,
  LINE,
  PANEL,
  Pill,
  SectionHead,
  Spacer,
} from "@/components/landing/frame";
import { Accordion, AccordionContent, AccordionItem } from "@/components/ui/accordion";
import { Md } from "@/components/ai-seo/kit";
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
  instant: "border-ink/[0.08] bg-white text-ink/70",
  ai: "border-cta/20 bg-cta-soft text-cta",
  live: "border-success/25 bg-success/10 text-success",
};

export function KindBadge({ kind, className }: { kind: ToolKind; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex h-5 items-center rounded-md border px-1.5 text-[0.62rem] font-semibold uppercase tracking-[0.08em]",
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
        "flex shrink-0 items-center justify-center rounded-lg bg-ink/[0.045] text-ink/75",
        className,
      )}
    >
      <Icon className={cn("h-[46%] w-[46%]", iconClassName)} strokeWidth={1.75} />
    </span>
  );
}

/* ---------- card ---------- */

/** A tool as one cell of a hairline grid: it lifts to faint grey on hover
 *  instead of casting a shadow, as the landing's cells do. */
export function ToolCard({ tool, className }: { tool: Tool; className?: string }) {
  return (
    <Link
      to="/tools/$slug"
      params={{ slug: tool.slug }}
      className={cn(
        "group relative flex h-full flex-col p-5 transition-colors duration-300 hover:bg-[color-mix(in_oklab,var(--surface)_35%,white)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-cta/40 sm:p-6",
        className,
      )}
    >
      <span className="flex items-start justify-between gap-3">
        <ToolIconTile
          tool={tool}
          className="h-10 w-10 transition-colors group-hover:bg-cta-soft group-hover:text-cta"
        />
        <KindBadge kind={tool.kind} />
      </span>
      <span className="mt-4 text-[1rem] font-semibold leading-snug tracking-tight text-ink">
        {tool.name}
      </span>
      <span className="mt-1.5 flex-1 text-[0.86rem] leading-relaxed text-muted-foreground">
        {tool.tagline}
      </span>
      <span className="mt-4 flex items-center justify-between">
        <span className="text-[0.72rem] text-muted-foreground">
          {getToolCategory(tool.category).name}
        </span>
        <span className="inline-flex items-center gap-1 text-[0.8rem] font-medium text-ink/70 transition-colors group-hover:text-cta">
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
        "overflow-hidden rounded-xl border border-ink/[0.08] bg-white text-ink",
        dark && "shadow-[0_1px_2px_rgba(16,24,40,0.05),0_24px_48px_-24px_rgba(16,24,40,0.25)]",
        className,
      )}
    >
      <div className="border-b border-ink/[0.07] px-5 py-4">
        <p className="text-[0.75rem] font-medium text-cta">Toolkit</p>
        <p className="mt-1 text-[1.02rem] font-semibold tracking-tight">{kit.title}</p>
        <p className="mt-1 text-sm text-muted-foreground">{kit.description}</p>
      </div>
      <ol className="divide-y divide-ink/[0.07]">
        {kit.steps.map((s, i) => {
          const tool = getTool(s.slug);
          if (!tool) return null;
          return (
            <li key={s.slug}>
              <Link
                to="/tools/$slug"
                params={{ slug: s.slug }}
                className="group flex items-center gap-3.5 px-5 py-3 transition-colors hover:bg-[color-mix(in_oklab,var(--surface)_35%,white)]"
              >
                <span className="font-mono text-[0.72rem] font-medium text-muted-foreground group-hover:text-cta">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <ToolIconTile tool={tool} className="h-8 w-8" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[0.9rem] font-medium leading-snug">
                    {tool.name}
                  </span>
                  <span className="block truncate text-xs text-muted-foreground">{s.why}</span>
                </span>
                <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-all group-hover:translate-x-0.5 group-hover:text-cta" />
              </Link>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

/* ---------- hero ---------- */

/* Staggers the CSS entrance (see animate-hero-rise in styles.css). */
const rise = (delay: number) => ({ "--rise-delay": `${delay}s` }) as CSSProperties;

/* The landing hero's frame, split: the promise on the left over the dithered
   mark, the first toolkit on a soft panel flush to the right rail. */
export function ToolsHero() {
  const instant = TOOLS.filter((t) => t.kind === "instant").length;
  return (
    <section aria-labelledby="tools-title" className="relative bg-white">
      <div
        className={cn(
          "relative mx-auto grid max-w-6xl overflow-hidden border-x lg:grid-cols-[1.1fr_0.9fr]",
          LINE,
        )}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 w-full opacity-[0.3] [mask-image:radial-gradient(ellipse_60%_80%_at_30%_50%,#000_45%,transparent_100%)] lg:w-[55%]"
        >
          <MarkDither />
        </div>
        <div className="relative flex flex-col items-center px-5 py-14 text-center sm:px-10 sm:py-16 lg:items-start lg:py-20 lg:pl-12 lg:text-left">
          <div className="motion-safe:animate-hero-rise" style={rise(0)}>
            <Pill icon={Wrench}>
              {TOOLS.length} free tools · No signup · {instant} run in your browser
            </Pill>
          </div>
          <h1
            id="tools-title"
            className="mt-6 text-balance font-display text-[2.3rem] font-medium leading-[1.08] tracking-[-0.035em] text-ink motion-safe:animate-hero-rise sm:text-[3.2rem] xl:text-[3.6rem]"
            style={rise(0.08)}
          >
            Free tools for Google <Accent>and AI search</Accent>
          </h1>
          <p
            className="mt-6 max-w-xl text-balance text-[1.05rem] leading-relaxed text-muted-foreground motion-safe:animate-hero-rise lg:text-pretty"
            style={rise(0.16)}
          >
            Generate the files AI crawlers look for, check what they can see, and tighten pages
            until they're the answer ChatGPT, Perplexity and Google quote. Built by the team that
            does this daily.
          </p>
          <a
            href="#all-tools"
            className="mt-8 inline-flex h-11 items-center gap-2 rounded-lg bg-cta px-5 text-sm font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.16),0_1px_2px_rgba(16,24,40,0.14)] transition-colors hover:bg-cta-hover motion-safe:animate-hero-rise"
            style={rise(0.24)}
          >
            <Search className="h-4 w-4" aria-hidden />
            Browse all {TOOLS.length} tools
          </a>
        </div>
        <div
          className={cn("relative hidden items-center border-l p-8 lg:flex xl:p-10", LINE, PANEL)}
        >
          <Reveal delay={0.2} y={20} className="w-full">
            <ToolkitCard id="readable" dark />
          </Reveal>
        </div>
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
      "inline-flex h-8 shrink-0 items-center gap-1.5 rounded-lg border px-3 text-[0.8rem] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta/40",
      on
        ? "border-cta/25 bg-cta-soft text-cta"
        : "border-ink/[0.08] bg-white text-ink/75 hover:border-ink/[0.16] hover:text-ink",
    );

  return (
    <section id="all-tools" aria-label="All tools" className="scroll-mt-16">
      <div className={cn("z-30 border-t bg-white/90 backdrop-blur-md md:sticky md:top-16", LINE)}>
        <div className={cn("mx-auto max-w-6xl space-y-3 border-x px-5 py-4 sm:px-8", LINE)}>
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
                className="h-full w-full rounded-lg border border-ink/[0.1] bg-white pl-10 pr-10 text-sm text-ink shadow-[0_1px_2px_rgba(16,24,40,0.04)] outline-none transition-[border-color,box-shadow] placeholder:text-muted-foreground hover:border-ink/[0.16] focus:border-cta/50 focus:shadow-[0_0_0_4px_color-mix(in_oklab,var(--cta)_12%,transparent)] [&::-webkit-search-cancel-button]:hidden"
              />
              {query ? (
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    inputRef.current?.focus();
                  }}
                  aria-label="Clear search"
                  className="absolute right-2.5 flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground hover:bg-ink/[0.04] hover:text-ink"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              ) : (
                <kbd className="pointer-events-none absolute right-3 hidden h-5 items-center rounded border border-ink/[0.1] bg-white px-1.5 font-mono text-[0.68rem] text-muted-foreground md:inline-flex">
                  /
                </kbd>
              )}
            </label>
            <div
              role="group"
              aria-label="Filter by category"
              className="-mx-5 flex gap-1.5 overflow-x-auto px-5 pb-0.5 [scrollbar-width:none] sm:-mx-8 sm:px-8 md:mx-0 md:px-0"
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
                  "inline-flex h-7 items-center rounded-md border px-2.5 text-[0.72rem] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta/40",
                  kind === k
                    ? "border-ink/[0.1] bg-white text-ink shadow-[0_1px_2px_rgba(16,24,40,0.05)]"
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

      <Band inner="px-5 py-4 sm:px-8">
        <p aria-live="polite" className="text-sm text-muted-foreground">
          {q ? (
            <>
              {results.length} {results.length === 1 ? "tool matches" : "tools match"} &ldquo;
              {query.trim()}&rdquo;
            </>
          ) : category ? (
            <>
              <span className="font-medium text-ink">{getToolCategory(category).name}</span> ·{" "}
              {getToolCategory(category).description}
            </>
          ) : (
            <>All {results.length} tools, by category</>
          )}
        </p>
      </Band>

      {results.length === 0 ? (
        <Band inner="px-6 py-16 text-center">
          <p className="font-display text-lg font-medium text-ink">No tool matches that yet</p>
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
            className="mt-6 inline-flex h-10 items-center rounded-lg bg-cta px-5 text-sm font-semibold text-white transition-colors hover:bg-cta-hover"
          >
            Clear search and filters
          </button>
        </Band>
      ) : grouped ? (
        grouped.map(({ c, tools }) => (
          <Band key={c.id}>
            <section aria-label={c.name} className="grid lg:grid-cols-[15rem_minmax(0,1fr)]">
              <div
                className={cn(
                  "border-b px-6 py-6 sm:px-8 lg:border-b-0 lg:border-r lg:px-7 lg:py-8",
                  LINE,
                )}
              >
                <div className="lg:sticky lg:top-44">
                  <h2 className="font-display text-[1.25rem] font-medium tracking-[-0.02em] text-ink">
                    {c.name}
                  </h2>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {c.description}
                  </p>
                  <p className="mt-3 text-xs text-muted-foreground/80">
                    {tools.length} {tools.length === 1 ? "tool" : "tools"}
                  </p>
                </div>
              </div>
              <CellGrid className="sm:grid-cols-2 xl:grid-cols-3">
                {tools.map((t) => (
                  <li key={t.slug} className={CELL}>
                    <ToolCard tool={t} />
                  </li>
                ))}
              </CellGrid>
            </section>
          </Band>
        ))
      ) : (
        <Band>
          <CellGrid className="sm:grid-cols-2 lg:grid-cols-3">
            {results.map((t) => (
              <li key={t.slug} className={CELL}>
                <ToolCard tool={t} />
              </li>
            ))}
          </CellGrid>
        </Band>
      )}
    </section>
  );
}

/* ---------- toolkits ---------- */

export function ToolkitsSection() {
  return (
    <section aria-labelledby="toolkits-title">
      <Spacer />
      <SectionHead
        icon={RouteIcon}
        eyebrow="Toolkits"
        title={
          <span id="toolkits-title">
            Three jobs, <Accent>in order</Accent>
          </span>
        }
        subtitle="Not sure where to start? Each toolkit is a job to be done, with the tools that do it, in the order they help."
      />
      <Band inner={cn("px-5 py-10 sm:px-8 sm:py-12", PANEL)}>
        <div className="grid gap-5 md:grid-cols-3">
          {TOOLKITS.map((k, i) => (
            <Reveal key={k.id} delay={i * 0.05}>
              <ToolkitCard id={k.id} className="h-full" />
            </Reveal>
          ))}
        </div>
      </Band>
    </section>
  );
}

/* ---------- FAQ ---------- */

/** The landing's FAQ, for the hub and every tool page: the title on the
 *  left, the questions down the right, answers in the server HTML for the
 *  FAQPage markup. */
export function ToolFaq({
  title,
  intro,
  faqs,
}: {
  title: string;
  intro?: string;
  faqs: { q: string; a: string }[];
}) {
  return (
    <section id="faq" className="scroll-mt-16">
      <Spacer />
      <Band>
        <div className="grid lg:grid-cols-[0.8fr_1.2fr]">
          <Reveal
            className={cn(
              "flex flex-col justify-center border-b px-6 py-10 sm:px-10 lg:border-b-0 lg:border-r lg:px-12 lg:py-14",
              LINE,
            )}
          >
            <Pill icon={HelpCircle} className="w-fit">
              FAQ
            </Pill>
            <h2 className="mt-5 font-display text-[1.9rem] font-medium leading-[1.12] tracking-[-0.03em] text-ink sm:text-[2.2rem]">
              {title}
            </h2>
            {intro && (
              <p className="mt-4 max-w-sm text-[0.98rem] leading-relaxed text-muted-foreground">
                {intro}
              </p>
            )}
          </Reveal>
          <Reveal delay={0.06} className="px-6 py-4 sm:px-10 lg:px-12 lg:py-8">
            <Accordion
              type="single"
              collapsible
              defaultValue="item-0"
              className="divide-y divide-ink/[0.07]"
            >
              {faqs.map((f, i) => (
                <AccordionItem key={f.q} value={`item-${i}`} className="border-b-0">
                  <AccordionPrimitive.Header className="flex">
                    <AccordionPrimitive.Trigger className="group flex flex-1 cursor-pointer items-center justify-between gap-6 py-5 text-left text-[0.98rem] font-medium text-ink transition-colors hover:text-brand-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta/40 focus-visible:ring-offset-2">
                      {f.q}
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-ink/[0.08] bg-white text-ink transition-[transform,background-color,color,border-color] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:border-brand-blue/30 group-data-[state=open]:rotate-45 group-data-[state=open]:border-brand-blue group-data-[state=open]:bg-brand-blue group-data-[state=open]:text-white">
                        <Plus className="h-3.5 w-3.5" />
                      </span>
                    </AccordionPrimitive.Trigger>
                  </AccordionPrimitive.Header>
                  <AccordionContent
                    forceMount
                    className="max-w-2xl pb-5 pr-10 text-sm leading-relaxed text-muted-foreground"
                  >
                    <Md text={f.a} />
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Reveal>
        </div>
      </Band>
    </section>
  );
}
