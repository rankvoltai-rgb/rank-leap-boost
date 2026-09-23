/**
 * /integrations: a directory people search, not scroll.
 *
 *   hero       search first: type a tool, see it, press Enter, you're there
 *   directory  everything, grouped, with a category rail on desktop; fully
 *              server-rendered so every page is linked before any script runs
 *
 * The hero and the directory share one query, held by the route.
 */
import { useId, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Search, X } from "lucide-react";
import { Reveal } from "@/components/landing/shared";
import { PixelField } from "@/components/landing/Hero";
import { ConnectorLogo } from "@/components/dashboard/connector-logo";
import { cn } from "@/lib/utils";
import {
  CATEGORIES,
  CONNECTORS,
  getConnector,
  searchConnectors,
  unsupportedMatch,
  type Connector,
  type ConnectorCategory,
} from "@/data/connectors";
import { AI_TOOLS, publicSlug } from "@/data/ai-integrations";
import { Breadcrumb, Heading, TRIAL_NOTE, heroPrimary, heroSecondary } from "./IntegrationSections";
import { Orbit } from "./visuals";
import { ToolCard } from "./ToolPage";

export type DirectoryFilter = ConnectorCategory | "all";

const POPULAR = ["claude", "chatgpt", "lovable", "cursor", "wordpress", "shopify"]
  .map((id) => getConnector(id))
  .filter((c): c is Connector => c !== undefined);

const SITE_COUNT = CONNECTORS.filter((c) => c.kind === "site").length;

function scrollToDirectory(anchor = "directory") {
  document.getElementById(anchor)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

/* ---------- Hero ---------- */

export function HubSearchHero({ query, onQuery }: { query: string; onQuery: (q: string) => void }) {
  return (
    <section
      id="top"
      aria-labelledby="integrations-title"
      className="relative overflow-hidden bg-brand-blue text-white"
    >
      <PixelField />
      <div className="relative mx-auto w-full max-w-6xl px-5 pb-20 pt-12 sm:pb-24 lg:pt-16">
        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] xl:gap-16">
          <div className="mx-auto min-w-0 max-w-2xl text-center lg:mx-0 lg:max-w-none lg:text-left">
            <Reveal>
              <Breadcrumb />
            </Reveal>
            <Reveal delay={0.05}>
              <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur">
                {SITE_COUNT} platforms · {AI_TOOLS.length} AI tools · REST API
              </span>
            </Reveal>
            <Reveal delay={0.1}>
              <h1
                id="integrations-title"
                className="font-display text-balance text-[2.35rem] font-bold leading-[1.06] tracking-tight sm:text-[3.25rem] xl:text-[3.6rem]"
              >
                Your site and your AI tools, connected
              </h1>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="mx-auto mt-6 max-w-lg text-[1.05rem] leading-relaxed text-white/80 lg:mx-0">
                Every article autopilot writes publishes to your site as a native post, and
                Rankbox&rsquo;s research works inside the AI tools you already use.
              </p>
            </Reveal>
            <Reveal delay={0.22} className="mx-auto mt-8 max-w-xl lg:mx-0">
              <HeroSearch query={query} onQuery={onQuery} />
              <div className="mt-4 flex flex-wrap items-center justify-center gap-2 lg:justify-start">
                <span className="text-xs font-medium text-white/60">Popular</span>
                {POPULAR.map((c) => (
                  <Link
                    key={c.id}
                    to="/integrations/$slug"
                    params={{ slug: publicSlug(c) }}
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 py-1 pl-1 pr-3 text-xs font-semibold text-white backdrop-blur transition-colors hover:bg-white/20"
                  >
                    <ConnectorLogo connector={c} className="h-5 w-5" />
                    {c.name}
                  </Link>
                ))}
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.3} y={24} className="min-w-0 px-6 pb-6 sm:px-10">
            <Orbit />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/**
 * The hero search, as a combobox: live matches with logos under the field,
 * arrows to move, Enter to open. "See all" hands the query to the directory.
 */
function HeroSearch({ query, onQuery }: { query: string; onQuery: (q: string) => void }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const listId = useId();
  const blurTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const matches = useMemo(() => (query.trim() ? searchConnectors(query) : []), [query]);
  const top = matches.slice(0, 6);
  const unsupported = unsupportedMatch(query);
  const expanded = open && query.trim().length > 0;

  function go(c: Connector) {
    setOpen(false);
    void navigate({ to: "/integrations/$slug", params: { slug: publicSlug(c) } });
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setActive((i) => Math.min(i + 1, top.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (active < top.length && top[active]) go(top[active]);
      else {
        setOpen(false);
        scrollToDirectory();
      }
    } else if (e.key === "Escape") {
      if (query) onQuery("");
      else setOpen(false);
    }
  }

  return (
    <div className="relative text-left">
      <label className="relative block">
        <span className="sr-only">Search integrations</span>
        <Search
          aria-hidden
          className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground"
        />
        <input
          type="search"
          role="combobox"
          aria-expanded={expanded}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={expanded && top[active] ? `${listId}-${active}` : undefined}
          value={query}
          onChange={(e) => {
            onQuery(e.target.value);
            setActive(0);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => {
            blurTimer.current = setTimeout(() => setOpen(false), 120);
          }}
          onKeyDown={onKeyDown}
          placeholder="Search Lovable, Cursor, WordPress, n8n…"
          autoComplete="off"
          spellCheck={false}
          className="h-14 w-full rounded-2xl border border-white/30 bg-white pl-12 pr-12 text-base text-ink shadow-elevation-lg outline-none placeholder:text-muted-foreground/80 focus:ring-4 focus:ring-white/30 [&::-webkit-search-cancel-button]:hidden"
        />
        {query && (
          <button
            type="button"
            onClick={() => onQuery("")}
            aria-label="Clear search"
            className="absolute right-3 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-lg text-muted-foreground hover:bg-secondary hover:text-ink"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </label>

      {expanded && (
        <div
          id={listId}
          role="listbox"
          aria-label="Matching integrations"
          onMouseDown={() => clearTimeout(blurTimer.current)}
          className="absolute inset-x-0 top-full z-30 mt-2 overflow-hidden rounded-2xl border border-border bg-card text-ink shadow-elevation-lg"
        >
          {top.length === 0 ? (
            <div className="px-4 py-4 text-sm">
              {unsupported ? (
                <>
                  <p className="font-semibold">{unsupported.name} can&rsquo;t connect yet</p>
                  <p className="mt-1 text-muted-foreground">{unsupported.reason}</p>
                </>
              ) : (
                <p className="text-muted-foreground">
                  No match. Anything that takes a remote MCP server URL works.{" "}
                  <Link
                    to="/integrations/$slug"
                    params={{ slug: "mcp" }}
                    className="font-semibold text-cta"
                  >
                    See how
                  </Link>
                </p>
              )}
            </div>
          ) : (
            <ul>
              {top.map((c, i) => (
                <li
                  key={c.id}
                  id={`${listId}-${i}`}
                  role="option"
                  aria-selected={active === i}
                  onMouseEnter={() => setActive(i)}
                  onClick={() => go(c)}
                  className={cn(
                    "flex cursor-pointer items-center gap-3 px-4 py-2.5",
                    active === i && "bg-secondary",
                  )}
                >
                  <ConnectorLogo connector={c} className="h-8 w-8" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{c.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{c.tagline}</p>
                  </div>
                  {active === i && <ArrowRight className="h-4 w-4 shrink-0 text-cta" />}
                </li>
              ))}
              <li
                id={`${listId}-${top.length}`}
                role="option"
                aria-selected={active === top.length}
                onMouseEnter={() => setActive(top.length)}
                onClick={() => {
                  setOpen(false);
                  scrollToDirectory();
                }}
                className={cn(
                  "cursor-pointer border-t border-border px-4 py-2.5 text-sm font-medium text-cta",
                  active === top.length && "bg-secondary",
                )}
              >
                See all {matches.length} {matches.length === 1 ? "result" : "results"}
              </li>
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

/* ---------- Directory ---------- */

export function Directory({
  query,
  onQuery,
  filter,
  onFilter,
}: {
  query: string;
  onQuery: (q: string) => void;
  filter: DirectoryFilter;
  onFilter: (f: DirectoryFilter) => void;
}) {
  const matches = useMemo(() => searchConnectors(query), [query]);
  const shown = filter === "all" ? matches : matches.filter((c) => c.category === filter);
  const browsing = !query.trim() && filter === "all";
  const unsupported = unsupportedMatch(query);
  const count = (f: DirectoryFilter) =>
    f === "all" ? matches.length : matches.filter((c) => c.category === f).length;
  const filters = [{ id: "all", label: "All" }, ...CATEGORIES] as {
    id: DirectoryFilter;
    label: string;
  }[];

  const search = (
    <label className="relative block">
      <span className="sr-only">Search integrations</span>
      <Search
        aria-hidden
        className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
      />
      <input
        type="search"
        value={query}
        onChange={(e) => onQuery(e.target.value)}
        onKeyDown={(e) => e.key === "Escape" && onQuery("")}
        placeholder="Search integrations"
        autoComplete="off"
        spellCheck={false}
        className="h-11 w-full rounded-xl border border-border bg-card pl-10 pr-9 text-sm text-ink shadow-1 outline-none transition-shadow placeholder:text-muted-foreground/80 focus:border-cta/50 focus:ring-4 focus:ring-cta/10 [&::-webkit-search-cancel-button]:hidden"
      />
      {query && (
        <button
          type="button"
          onClick={() => onQuery("")}
          aria-label="Clear search"
          className="absolute right-2 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-lg text-muted-foreground hover:bg-secondary hover:text-ink"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </label>
  );

  return (
    <section
      id="directory"
      aria-labelledby="directory-title"
      className="scroll-mt-20 border-t border-border bg-surface/40 py-24 sm:py-28"
    >
      <div className="mx-auto max-w-6xl px-5">
        <Heading
          id="directory-title"
          eyebrow="Directory"
          title="Every integration"
          intro={`${CONNECTORS.length} ways to connect Rankbox, each with its own page and setup guide.`}
        />

        <div className="mt-14 grid gap-8 lg:grid-cols-[13.5rem_1fr] lg:gap-10">
          {/* Rail: search and categories. Chips on small screens. */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            {search}
            <div
              role="group"
              aria-label="Filter integrations"
              className="-mx-1 mt-4 flex gap-1.5 overflow-x-auto px-1 pb-1 [scrollbar-width:none] lg:mx-0 lg:flex-col lg:gap-0.5 lg:overflow-visible lg:px-0 [&::-webkit-scrollbar]:hidden"
            >
              {filters.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  aria-pressed={filter === f.id}
                  onClick={() => onFilter(f.id)}
                  className={cn(
                    "flex shrink-0 items-center justify-between gap-3 whitespace-nowrap rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors lg:rounded-lg lg:border-0 lg:px-3 lg:py-2",
                    filter === f.id
                      ? "border-cta bg-cta text-white lg:bg-cta-soft lg:text-cta"
                      : "border-border bg-card text-muted-foreground hover:text-ink lg:bg-transparent lg:hover:bg-secondary",
                    count(f.id) === 0 && filter !== f.id && "opacity-50",
                  )}
                >
                  {f.label}
                  <span
                    className={cn(
                      "text-xs tabular-nums",
                      filter === f.id ? "text-white/75 lg:text-cta/70" : "text-muted-foreground/70",
                    )}
                  >
                    {count(f.id)}
                  </span>
                </button>
              ))}
            </div>
            <p className="mt-6 hidden text-xs leading-relaxed text-muted-foreground lg:block">
              Not listed? Anything that takes a remote MCP server works, and any site can use the{" "}
              <Link
                to="/integrations/$slug"
                params={{ slug: "api" }}
                className="font-semibold text-ink underline decoration-border underline-offset-4"
              >
                REST API
              </Link>
              .
            </p>
          </aside>

          <div className="min-w-0">
            <p className="sr-only" role="status">
              {shown.length} {shown.length === 1 ? "integration" : "integrations"}
            </p>
            {unsupported && (
              <div className="mb-6 rounded-2xl border border-warning/30 bg-warning/5 px-5 py-4 text-sm">
                <p className="font-semibold text-ink">{unsupported.name} can&rsquo;t connect yet</p>
                <p className="mt-1 text-muted-foreground">{unsupported.reason}</p>
              </div>
            )}

            {browsing ? (
              <div className="space-y-12">
                {CATEGORIES.map((cat) => {
                  const items = matches.filter((c) => c.category === cat.id);
                  return (
                    <div key={cat.id} id={`dir-${cat.id}`} className="scroll-mt-24">
                      <div className="mb-4 flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:gap-3">
                        <h3 className="text-lg font-semibold text-ink">{cat.label}</h3>
                        <p className="text-sm text-muted-foreground">{cat.blurb}</p>
                      </div>
                      <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                        {items.map((c) => (
                          <li key={c.id}>
                            <ToolCard tool={c} />
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            ) : shown.length > 0 ? (
              <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {shown.map((c) => (
                  <li key={c.id}>
                    <ToolCard tool={c} />
                  </li>
                ))}
              </ul>
            ) : (
              <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-10 text-center">
                <p className="text-base font-semibold text-ink">
                  {unsupported ? "Try one of these instead" : `Nothing matches “${query.trim()}”`}
                </p>
                <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
                  Anything that can add a remote MCP server by URL works with Rankbox, and any site
                  can pull articles from the REST API.
                </p>
                <div className="mt-5 flex flex-wrap justify-center gap-3">
                  <Link
                    to="/integrations/$slug"
                    params={{ slug: "mcp" }}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-cta px-4 py-2.5 text-sm font-semibold text-white hover:bg-cta-hover"
                  >
                    Any MCP client <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    to="/integrations/$slug"
                    params={{ slug: "api" }}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-semibold text-ink hover:bg-secondary"
                  >
                    The REST API
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/** The closing band for the hub, in the pages' blue. */
export function HubCTA() {
  return (
    <section aria-labelledby="cta-title" className="py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-brand-blue px-6 py-14 text-center text-white sm:px-12 sm:py-16">
            <PixelField />
            <div className="relative">
              <h2
                id="cta-title"
                className="font-display mx-auto max-w-2xl text-balance text-3xl font-semibold tracking-tight sm:text-4xl"
              >
                Connect once. Publish every day.
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-balance text-base text-white/80">
                Pick your platform, add Rankbox to your AI tools, and let autopilot research, write,
                and publish on its own.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <a href="/auth" className={heroPrimary}>
                  Get started free <ArrowRight className="h-4 w-4" />
                </a>
                <button type="button" onClick={() => scrollToDirectory()} className={heroSecondary}>
                  Browse integrations
                </button>
              </div>
              <p className="mt-4 text-sm text-white/70">{TRIAL_NOTE}</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
