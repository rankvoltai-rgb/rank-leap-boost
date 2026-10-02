import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowDown, ArrowRight, Search, X } from "lucide-react";
import { SOLUTIONS, SOLUTIONS_UPDATED } from "@/data/solutions";
import { cn } from "@/lib/utils";
import { BOARD, GROUPS, h2 } from "./content";
import {
  buildGroups,
  controlsFor,
  countLines,
  filterGroups,
  formatDay,
  pagesLabel,
  type Group,
  type HubGroup,
  type Line,
} from "./model";

/* Built once: the index is static data, so every render starts from the same
   full list and the server HTML carries every link. */
const GROUPED = buildGroups(SOLUTIONS);
const TOTAL = countLines(GROUPED);
const CONTROLS = controlsFor(GROUPED);
const SEARCH_WORDS = Object.fromEntries(
  Object.entries(GROUPS).map(([id, g]) => [id, `${g.label} ${g.chip} ${g.searchWords}`]),
) as Record<HubGroup, string>;

const FOCUS = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta";

/**
 * The focal piece: one panel, one line per live solutions page, grouped the
 * way a visitor describes their problem. Each line has a lamp that lights on
 * hover or focus. Filter chips and search only appear once the list is long
 * enough to need them (see FILTER_FROM and SEARCH_FROM in model.ts).
 */
export function Switchboard() {
  const [group, setGroup] = useState<HubGroup | "all">("all");
  const [query, setQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);

  const visible = useMemo(
    () => filterGroups(GROUPED, { group, query }, SEARCH_WORDS),
    [group, query],
  );
  const shown = countLines(visible);
  const filtering = group !== "all" || query.trim() !== "";

  // "/" jumps to the search field, as it does in most product indexes. Never
  // while the visitor is typing somewhere else.
  useEffect(() => {
    if (!CONTROLS.search) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "/" || e.metaKey || e.ctrlKey || e.altKey) return;
      const t = e.target as HTMLElement | null;
      if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
      e.preventDefault();
      searchRef.current?.focus();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const reset = () => {
    setGroup("all");
    setQuery("");
  };

  return (
    <section id="index" aria-labelledby="index-title" className="scroll-mt-20 pb-20 sm:pb-28">
      <div className="mx-auto max-w-5xl px-4 sm:px-5">
        <div className="overflow-clip rounded-2xl border border-border bg-card shadow-2">
          <header className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-border px-4 py-4 sm:px-6">
            <h2 id="index-title" className="text-[0.98rem] font-semibold tracking-tight text-ink">
              {h2("index")}
            </h2>
            <p className="text-xs text-muted-foreground tabular-nums">
              {pagesLabel(TOTAL)}
              <span aria-hidden className="mx-1.5">
                ·
              </span>
              {BOARD.checked}{" "}
              <time dateTime={SOLUTIONS_UPDATED}>{formatDay(SOLUTIONS_UPDATED)}</time>
            </p>
          </header>

          {(CONTROLS.filter || CONTROLS.search) && (
            <Controls
              group={group}
              onGroup={setGroup}
              query={query}
              onQuery={setQuery}
              searchRef={searchRef}
            />
          )}

          <p aria-live="polite" className="sr-only">
            {filtering ? BOARD.showing(shown, TOTAL) : ""}
          </p>

          {TOTAL === 0 ? (
            <p className="px-4 py-12 text-center text-sm text-muted-foreground sm:px-6">
              {BOARD.noneLive}
            </p>
          ) : shown === 0 ? (
            <Empty query={query.trim()} onReset={reset} />
          ) : (
            visible.map((g) => <GroupBlock key={g.id} group={g} />)
          )}

          <footer className="flex flex-wrap items-center gap-x-2 gap-y-1 border-t border-border bg-surface px-4 py-3.5 text-sm sm:px-6">
            <span className="text-muted-foreground">{BOARD.footer}</span>
            <a
              href="#other-ways"
              className={cn(
                "group inline-flex items-center gap-1 rounded-sm font-medium text-cta hover:text-cta-hover",
                FOCUS,
              )}
            >
              {BOARD.footerLink}
              <ArrowDown
                aria-hidden
                className="size-3.5 transition-transform group-hover:translate-y-0.5 motion-reduce:transition-none"
              />
            </a>
          </footer>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

function Controls({
  group,
  onGroup,
  query,
  onQuery,
  searchRef,
}: {
  group: HubGroup | "all";
  onGroup: (g: HubGroup | "all") => void;
  query: string;
  onQuery: (q: string) => void;
  searchRef: RefObject<HTMLInputElement | null>;
}) {
  const chips: { id: HubGroup | "all"; label: string; count: number }[] = [
    { id: "all", label: BOARD.allChip, count: TOTAL },
    ...GROUPED.map((g) => ({ id: g.id, label: GROUPS[g.id].chip, count: g.lines.length })),
  ];
  return (
    <div className="flex flex-col gap-3 border-b border-border px-4 py-3 sm:px-6 md:flex-row md:items-center md:justify-between">
      {CONTROLS.filter ? (
        <div role="group" aria-label={BOARD.filterLabel} className="flex flex-wrap gap-1.5">
          {chips.map((c) => {
            const on = group === c.id;
            return (
              <button
                key={c.id}
                type="button"
                aria-pressed={on}
                onClick={() => onGroup(c.id)}
                className={cn(
                  "inline-flex h-8 items-center gap-1.5 rounded-full border px-3 text-sm font-medium transition-colors motion-reduce:transition-none",
                  on
                    ? "border-cta bg-cta text-white"
                    : "border-border bg-background text-ink/80 hover:border-ink/20 hover:text-ink",
                  FOCUS,
                  "focus-visible:ring-offset-2 focus-visible:ring-offset-card",
                )}
              >
                {c.label}
                <span
                  className={cn(
                    "tabular-nums text-xs",
                    on ? "text-white/80" : "text-muted-foreground",
                  )}
                >
                  {c.count}
                </span>
              </button>
            );
          })}
        </div>
      ) : (
        <span />
      )}

      {CONTROLS.search && (
        <div className="relative w-full md:w-72">
          <label htmlFor="solutions-search" className="sr-only">
            {BOARD.searchLabel}
          </label>
          <Search
            aria-hidden
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          />
          <input
            ref={searchRef}
            id="solutions-search"
            type="search"
            autoComplete="off"
            spellCheck={false}
            value={query}
            placeholder={BOARD.searchPlaceholder}
            onChange={(e) => onQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Escape" && query) {
                e.preventDefault();
                onQuery("");
              }
            }}
            className="h-9 w-full rounded-lg border border-input bg-background pl-9 pr-9 text-sm text-ink placeholder:text-muted-foreground focus-visible:border-cta focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta/25 [&::-webkit-search-cancel-button]:hidden"
          />
          {query ? (
            <button
              type="button"
              onClick={() => {
                onQuery("");
                searchRef.current?.focus();
              }}
              aria-label={BOARD.clear}
              className={cn(
                "absolute right-1.5 top-1/2 grid size-6 -translate-y-1/2 place-items-center rounded-md text-muted-foreground hover:bg-secondary hover:text-ink",
                FOCUS,
              )}
            >
              <X aria-hidden className="size-3.5" />
            </button>
          ) : (
            <kbd
              aria-hidden
              className="pointer-events-none absolute right-2 top-1/2 hidden -translate-y-1/2 rounded border border-border bg-surface px-1.5 font-mono text-[0.7rem] leading-5 text-muted-foreground sm:block"
            >
              {BOARD.searchKey}
            </kbd>
          )}
        </div>
      )}
    </div>
  );
}

function GroupBlock({ group }: { group: Group }) {
  const copy = GROUPS[group.id];
  const id = `group-${group.id}`;
  return (
    <section aria-labelledby={id} className="border-b border-border last-of-type:border-b-0">
      {/* Sticks under the navbar while its lines scroll past. */}
      <div className="sticky top-16 z-10 flex flex-wrap items-baseline gap-x-3 gap-y-0.5 border-b border-border bg-card/95 px-4 py-2.5 backdrop-blur sm:px-6">
        <h3
          id={id}
          className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground"
        >
          {copy.label}
          <span className="ml-2 font-medium tabular-nums text-muted-foreground/70">
            {group.lines.length}
          </span>
        </h3>
        <p className="text-xs text-muted-foreground">{copy.line}</p>
      </div>
      <ul className="divide-y divide-border">
        {group.lines.map((line) => (
          <li key={line.slug}>
            <Row line={line} />
          </li>
        ))}
      </ul>
    </section>
  );
}

function Row({ line }: { line: Line }) {
  return (
    <Link
      to={line.path}
      className={cn(
        "group grid grid-cols-[auto_1fr_auto] items-start gap-x-4 px-4 py-4 transition-colors hover:bg-surface sm:px-6 sm:py-5 motion-reduce:transition-none",
        "focus-visible:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-cta",
      )}
    >
      <Lamp />
      <span className="min-w-0">
        <span className="block text-[1.02rem] font-semibold leading-snug tracking-tight text-ink">
          {line.title}
        </span>
        <span className="mt-1 block text-[0.92rem] leading-relaxed text-muted-foreground">
          {line.tagline}
        </span>
      </span>
      <span className="flex items-center gap-3 self-center">
        <span className="hidden max-w-[16rem] truncate font-mono text-xs text-muted-foreground lg:block">
          {line.path}
        </span>
        <ArrowRight
          aria-hidden
          className="size-4 text-muted-foreground transition-all group-hover:translate-x-0.5 group-hover:text-cta group-focus-visible:text-cta motion-reduce:transition-none"
        />
      </span>
    </Link>
  );
}

/** The switchboard lamp: dark until the line is pointed at, then blue. */
function Lamp() {
  return (
    <span
      aria-hidden
      className="mt-[0.4rem] grid size-3 place-items-center rounded-full border border-border bg-background transition-[border-color,box-shadow] group-hover:border-cta group-hover:shadow-[0_0_0_4px_var(--cta-soft)] group-focus-visible:border-cta group-focus-visible:shadow-[0_0_0_4px_var(--cta-soft)] motion-reduce:transition-none"
    >
      <span className="size-1.5 rounded-full bg-border transition-colors group-hover:bg-cta group-focus-visible:bg-cta motion-reduce:transition-none" />
    </span>
  );
}

function Empty({ query, onReset }: { query: string; onReset: () => void }) {
  return (
    <div className="px-4 py-12 text-center sm:px-6">
      <p className="text-[0.98rem] font-semibold text-ink">{BOARD.emptyTitle(query)}</p>
      <p className="mx-auto mt-1.5 max-w-sm text-sm text-muted-foreground">{BOARD.emptyBody}</p>
      <button
        type="button"
        onClick={onReset}
        className={cn(
          "mt-5 inline-flex h-9 items-center rounded-lg bg-cta px-4 text-sm font-semibold text-white transition-colors hover:bg-cta-hover",
          FOCUS,
          "focus-visible:ring-offset-2 focus-visible:ring-offset-card",
        )}
      >
        {BOARD.emptyReset}
      </button>
    </div>
  );
}
