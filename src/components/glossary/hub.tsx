/**
 * The glossary hub: a reading path for newcomers, and a fast way to find one
 * term for everyone else.
 *
 * Every term is in the server-rendered HTML, grouped A–Z, so crawlers see the
 * whole index; search and the category filter narrow it in place on the
 * client. The category lives in the URL (?category=) so a filtered view can
 * be linked to — the entry pages' breadcrumbs do exactly that.
 */
import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Search, X } from "lucide-react";
import { PixelField } from "@/components/landing/Hero";
import { Reveal } from "@/components/landing/shared";
import {
  CATEGORIES,
  GLOSSARY_UPDATED,
  TERMS,
  TERMS_AZ,
  getCategory,
  getTerm,
  letterOf,
  type GlossaryCategoryId,
  type GlossaryTerm,
} from "@/data/glossary/terms";
import { formatDate } from "@/lib/format-date";
import { plainText } from "@/lib/inline-md";
import { cn } from "@/lib/utils";
import { TermCard } from "./shared";

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

/* ---------- the reading path ---------- */

/* Six ideas, in the order they build on each other. The glossary is A–Z; this
   is the one place it tells a story. */
const START_HERE: { slug: string; why: string }[] = [
  { slug: "search-engine-optimization", why: "The index every AI engine retrieves from" },
  { slug: "generative-engine-optimization", why: "Earning a place inside the answer" },
  { slug: "retrieval-augmented-generation", why: "How engines fetch sources before writing" },
  { slug: "query-fan-out", why: "Why one question becomes many searches" },
  { slug: "ai-citation", why: "What winning looks like" },
  { slug: "ai-share-of-voice", why: "How to measure it against competitors" },
];

export function StartHere({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-border bg-card text-ink shadow-2xl shadow-brand-blue-deep/30",
        className,
      )}
    >
      <div className="border-b border-border px-5 py-4">
        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-volt">
          Start here
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          New to AI search? Read these six, in order.
        </p>
      </div>
      <ol className="divide-y divide-border">
        {START_HERE.map((s, i) => {
          const term = getTerm(s.slug);
          if (!term) return null;
          return (
            <li key={s.slug}>
              <Link
                to="/glossary/$term"
                params={{ term: s.slug }}
                className="group flex items-center gap-3.5 px-5 py-3 transition-colors hover:bg-surface/70"
              >
                <span className="font-mono text-[0.72rem] font-semibold text-muted-foreground group-hover:text-volt">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[0.92rem] font-semibold leading-snug">
                    {term.term}
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

export function HubHero() {
  return (
    <section
      id="top"
      aria-labelledby="glossary-title"
      className="relative overflow-hidden bg-brand-blue text-white"
    >
      <PixelField />
      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-5 pb-14 pt-12 sm:pb-16 sm:pt-16 lg:grid-cols-[1.15fr_0.85fr] lg:pb-20">
        <div className="text-center lg:text-left">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur">
              {TERMS.length} terms · Updated {formatDate(GLOSSARY_UPDATED)}
            </span>
          </Reveal>
          <Reveal delay={0.06}>
            <h1
              id="glossary-title"
              className="mt-6 font-display text-balance text-[2.5rem] font-bold leading-[1.04] tracking-tight sm:text-[3.4rem] xl:text-[3.75rem]"
            >
              The AI search glossary
            </h1>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mx-auto mt-6 max-w-xl text-balance text-[1.05rem] leading-relaxed text-white/80 lg:mx-0">
              Every term you need for SEO, GEO and AI visibility — defined in one sentence, then
              explained for teams that have to act on it. Sourced, dated, and written to be quoted.
            </p>
          </Reveal>
          <Reveal delay={0.18}>
            <a
              href="#terms"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-brand-blue shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              <Search className="h-4 w-4" aria-hidden />
              Search all {TERMS.length} terms
            </a>
          </Reveal>
        </div>
        <Reveal delay={0.22} y={24} className="hidden lg:block">
          <StartHere />
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- search ---------- */

/* Name matches outrank definition matches, and a whole-name match (typing
   "geo" or "rag") goes straight to the top. */
function score(term: GlossaryTerm, q: string): number {
  const names = [term.term, term.abbr ?? "", ...(term.aliases ?? [])].map((n) => n.toLowerCase());
  if (names.some((n) => n === q)) return 100;
  if (names.some((n) => n.startsWith(q))) return 80;
  if (names.some((n) => n.includes(q))) return 60;
  if (plainText(term.definition).toLowerCase().includes(q)) return 20;
  return 0;
}

/* ---------- explorer ---------- */

export function Explorer({
  category,
  onCategory,
}: {
  category?: GlossaryCategoryId;
  onCategory: (c?: GlossaryCategoryId) => void;
}) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const q = query.trim().toLowerCase();

  // "/" jumps to search from anywhere on the page, as on most docs sites.
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

  const inCategory = useMemo(
    () => TERMS_AZ.filter((t) => !category || t.category === category),
    [category],
  );

  const results = useMemo(() => {
    if (!q) return inCategory;
    return inCategory
      .map((t) => ({ t, s: score(t, q) }))
      .filter((r) => r.s > 0)
      .sort((a, b) => b.s - a.s)
      .map((r) => r.t);
  }, [inCategory, q]);

  const groups = useMemo(() => {
    const map = new Map<string, GlossaryTerm[]>();
    for (const t of results) {
      const l = letterOf(t);
      map.set(l, [...(map.get(l) ?? []), t]);
    }
    return map;
  }, [results]);

  const counts = useMemo(() => {
    const c = new Map<GlossaryCategoryId, number>();
    for (const t of TERMS) c.set(t.category, (c.get(t.category) ?? 0) + 1);
    return c;
  }, []);

  const active = category ? getCategory(category) : undefined;
  const chip = (on: boolean) =>
    cn(
      "inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full border px-3 text-[0.8rem] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-volt",
      on
        ? "border-ink bg-ink text-background"
        : "border-border bg-card text-ink/75 hover:border-ink/25 hover:text-ink",
    );

  return (
    <section id="terms" aria-label="All terms" className="scroll-mt-16">
      {/* Sticky from tablet up; on a phone a pinned toolbar would eat a third
          of the screen, so it scrolls away with the page. */}
      <div className="z-30 border-b border-border bg-background/90 backdrop-blur-md md:sticky md:top-16">
        <div className="mx-auto max-w-6xl space-y-3 px-5 py-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <label className="relative flex h-11 items-center md:w-80 md:shrink-0">
              <span className="sr-only">Search the glossary</span>
              <Search
                className="pointer-events-none absolute left-3.5 h-4 w-4 text-muted-foreground"
                aria-hidden
              />
              <input
                ref={inputRef}
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Escape") setQuery("");
                }}
                placeholder="Search terms, e.g. RAG, llms.txt"
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

            {!q && (
              <nav
                aria-label="Jump to letter"
                className="-mx-5 overflow-x-auto px-5 [scrollbar-width:none] md:mx-0 md:px-0"
              >
                <ol className="flex min-w-max gap-0.5">
                  {LETTERS.map((l) => {
                    const has = groups.has(l);
                    return (
                      <li key={l}>
                        {has ? (
                          <a
                            href={`#letter-${l.toLowerCase()}`}
                            className="flex h-7 w-7 items-center justify-center rounded-md font-mono text-[0.78rem] font-semibold text-ink/75 transition-colors hover:bg-ink hover:text-background"
                          >
                            {l}
                          </a>
                        ) : (
                          <span className="flex h-7 w-7 items-center justify-center font-mono text-[0.78rem] text-ink/20">
                            {l}
                          </span>
                        )}
                      </li>
                    );
                  })}
                </ol>
              </nav>
            )}
          </div>

          <div
            role="group"
            aria-label="Filter by topic"
            className="-mx-5 flex gap-1.5 overflow-x-auto px-5 pb-0.5 [scrollbar-width:none] md:mx-0 md:flex-wrap md:overflow-visible md:px-0"
          >
            <button
              type="button"
              aria-pressed={!category}
              onClick={() => onCategory(undefined)}
              className={chip(!category)}
            >
              All
              <span className="font-medium opacity-60">{TERMS.length}</span>
            </button>
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                type="button"
                aria-pressed={category === c.id}
                onClick={() => onCategory(category === c.id ? undefined : c.id)}
                className={chip(category === c.id)}
              >
                {c.name}
                <span className="font-medium opacity-60">{counts.get(c.id)}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-5 py-12 sm:py-14">
        <p aria-live="polite" className="text-sm text-muted-foreground">
          {q ? (
            <>
              {results.length} {results.length === 1 ? "term matches" : "terms match"} &ldquo;
              {query.trim()}&rdquo;{active && <> in {active.name}</>}
            </>
          ) : active ? (
            <>
              <span className="font-semibold text-ink">{active.name}</span> · {active.description}
            </>
          ) : (
            <>All {TERMS.length} terms, A to Z</>
          )}
        </p>

        {results.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-border bg-card px-6 py-14 text-center">
            <p className="font-display text-lg font-semibold text-ink">No terms match that yet</p>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              Try a shorter word or an abbreviation, or clear the filters and browse A to Z.
            </p>
            <button
              type="button"
              onClick={() => {
                setQuery("");
                onCategory(undefined);
              }}
              className="mt-6 rounded-xl bg-ink px-5 py-2.5 text-sm font-semibold text-background"
            >
              Clear search and filters
            </button>
          </div>
        ) : q ? (
          <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((t) => (
              <li key={t.slug}>
                <TermCard term={t} compact />
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-8 space-y-12">
            {[...groups.entries()].map(([letter, terms]) => (
              <section
                key={letter}
                id={`letter-${letter.toLowerCase()}`}
                aria-label={`Terms starting with ${letter}`}
                className="grid scroll-mt-16 gap-4 md:scroll-mt-48 lg:grid-cols-[4.5rem_minmax(0,1fr)] lg:gap-6"
              >
                <h2 className="self-start font-display text-[2.6rem] font-bold leading-none tracking-tight text-ink/15 lg:sticky lg:top-52">
                  {letter}
                </h2>
                <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {terms.map((t) => (
                    <li key={t.slug}>
                      <TermCard term={t} compact />
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/* ---------- browse by topic ---------- */

/* The same terms again, by subject: a map of the field for someone scanning,
   and one more crawl path grouping each topic's pages together. */
export function TopicGrid() {
  return (
    <section aria-labelledby="topics-title" className="border-y border-border bg-surface/60">
      <div className="mx-auto max-w-6xl px-5 py-20 sm:py-24">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2
            id="topics-title"
            className="font-display text-balance text-3xl font-semibold tracking-tight text-ink sm:text-4xl"
          >
            Browse by topic
          </h2>
          <p className="mt-4 text-balance text-lg text-muted-foreground">
            Seven areas, from how answer engines work to how you measure them.
          </p>
        </Reveal>
        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((c, i) => {
            const terms = TERMS_AZ.filter((t) => t.category === c.id);
            return (
              <Reveal
                key={c.id}
                delay={(i % 3) * 0.05}
                className="flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-1"
              >
                <h3 className="font-display text-lg font-semibold tracking-tight text-ink">
                  <Link
                    to="/glossary"
                    search={{ category: c.id }}
                    hash="terms"
                    className="hover:text-volt"
                  >
                    {c.name}
                  </Link>
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {c.description}
                </p>
                <ul className="mt-5 flex flex-wrap gap-1.5">
                  {terms.map((t) => (
                    <li key={t.slug}>
                      <Link
                        to="/glossary/$term"
                        params={{ term: t.slug }}
                        className="inline-flex rounded-lg border border-border px-2.5 py-1 text-[0.8rem] font-medium text-ink/80 transition-colors hover:border-ink/25 hover:bg-surface hover:text-ink"
                      >
                        {t.term}
                      </Link>
                    </li>
                  ))}
                </ul>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
