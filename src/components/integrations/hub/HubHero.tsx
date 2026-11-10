/**
 * The /integrations hero, in the landing's frame: search first (type a tool,
 * see it, press Enter, you're there), the popular ones as chips under the
 * field, and the switchboard beside it showing Rankbox's two jobs.
 *
 * The hero and the directory share one query, held by the route.
 */
import { useId, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, ChevronRight, Plug, Search, X } from "lucide-react";
import { Accent, LINE, Pill } from "@/components/landing/frame";
import { ConnectorLogo } from "@/components/dashboard/connector-logo";
import {
  CONNECTORS,
  getConnector,
  searchConnectors,
  unsupportedMatch,
  type Connector,
} from "@/data/connectors";
import { AI_TOOLS, publicSlug } from "@/data/ai-integrations";
import { cn } from "@/lib/utils";
import { Switchboard } from "./Switchboard";

const POPULAR = ["claude", "chatgpt", "lovable", "cursor", "wordpress", "shopify"]
  .map((id) => getConnector(id))
  .filter((c): c is Connector => c !== undefined);

const SITE_COUNT = CONNECTORS.filter((c) => c.kind === "site").length;

export function scrollToDirectory() {
  document.getElementById("directory")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

const rise = (s: number) => ({ animationDelay: `${s}s` });

export function HubHero({ query, onQuery }: { query: string; onQuery: (q: string) => void }) {
  return (
    <section
      id="top"
      aria-labelledby="integrations-title"
      className="relative scroll-mt-16 bg-white"
    >
      <div className={cn("relative mx-auto max-w-6xl border-x", LINE)}>
        <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
          <div className="flex min-w-0 flex-col justify-center px-5 pb-12 pt-7 sm:px-8 sm:pb-14 lg:py-16 lg:pl-12 lg:pr-8">
            <nav aria-label="Breadcrumb" className="motion-safe:animate-hero-rise">
              <ol className="flex items-center gap-1.5 text-[0.78rem] text-muted-foreground">
                <li>
                  <Link to="/" className="py-2 transition-colors hover:text-ink">
                    Home
                  </Link>
                </li>
                <li aria-hidden>
                  <ChevronRight className="h-3 w-3" />
                </li>
                <li aria-current="page" className="font-medium text-ink">
                  Integrations
                </li>
              </ol>
            </nav>

            <div className="mt-9 motion-safe:animate-hero-rise lg:mt-12" style={rise(0.05)}>
              <Pill icon={Plug}>
                {SITE_COUNT} platforms · {AI_TOOLS.length} AI tools · REST API
              </Pill>
            </div>

            <h1
              id="integrations-title"
              className="mt-5 text-balance font-display text-[2.3rem] font-medium leading-[1.08] tracking-[-0.035em] text-ink motion-safe:animate-hero-rise sm:text-[3.1rem] lg:text-[2.95rem] xl:text-[3.35rem]"
              style={rise(0.12)}
            >
              Your site and your AI tools, <Accent>connected</Accent>
            </h1>

            <p
              className="mt-5 max-w-[32rem] text-[1.02rem] leading-relaxed text-muted-foreground motion-safe:animate-hero-rise sm:text-[1.08rem]"
              style={rise(0.2)}
            >
              Every article Rankbox finishes publishes to your site as a native post, and
              Rankbox&rsquo;s research works inside the AI tools you already use.
            </p>

            <div
              className="mt-8 w-full max-w-[32rem] motion-safe:animate-hero-rise"
              style={rise(0.28)}
            >
              <HeroSearch query={query} onQuery={onQuery} />
              <div className="mt-4 flex flex-wrap items-center gap-1.5">
                <span className="mr-1 text-[0.75rem] text-muted-foreground">Popular</span>
                {POPULAR.map((c) => (
                  <Link
                    key={c.id}
                    to="/integrations/$slug"
                    params={{ slug: publicSlug(c) }}
                    className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-ink/[0.08] bg-white pl-1 pr-2.5 text-[0.78rem] font-medium text-ink shadow-[0_1px_2px_rgba(16,24,40,0.04)] transition-colors hover:border-cta/40 hover:text-cta"
                  >
                    <ConnectorLogo connector={c} className="h-6 w-6" />
                    {c.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Flush to the right rail, with a hairline of white around it. */}
          <div
            className="min-w-0 px-3 pb-3 motion-safe:animate-hero-rise lg:py-3 lg:pl-0 lg:pr-3"
            style={rise(0.36)}
          >
            <div className="relative flex h-full items-center justify-center overflow-hidden bg-[#eef4fe] px-4 py-10 sm:px-8 sm:py-12">
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 [background-image:radial-gradient(color-mix(in_oklab,var(--brand-blue)_26%,transparent)_1px,transparent_1.2px)] [background-size:20px_20px] [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,#000_20%,transparent_80%)]"
              />
              <Switchboard className="relative max-w-[30rem]" />
            </div>
          </div>
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
    <div className="relative">
      <label className="relative block">
        <span className="sr-only">Search integrations</span>
        <Search
          aria-hidden
          className="pointer-events-none absolute left-4 top-1/2 h-[1.1rem] w-[1.1rem] -translate-y-1/2 text-muted-foreground"
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
          className="h-12 w-full rounded-xl border border-ink/[0.1] bg-white pl-11 pr-11 text-[0.95rem] text-ink shadow-[0_1px_2px_rgba(16,24,40,0.04)] outline-none transition-[border-color,box-shadow] placeholder:text-muted-foreground hover:border-ink/[0.16] focus:border-cta/50 focus:shadow-[0_0_0_4px_color-mix(in_oklab,var(--cta)_12%,transparent)] [&::-webkit-search-cancel-button]:hidden"
        />
        {query && (
          <button
            type="button"
            onClick={() => onQuery("")}
            aria-label="Clear search"
            className="absolute right-2.5 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-lg text-muted-foreground hover:bg-ink/[0.04] hover:text-ink"
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
          className="absolute inset-x-0 top-full z-30 mt-2 overflow-hidden rounded-xl border border-ink/[0.08] bg-white text-ink shadow-[0_24px_56px_-24px_rgba(16,24,40,0.35)]"
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
                    active === i && "bg-cta-soft/60",
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
                  "cursor-pointer border-t border-ink/[0.06] px-4 py-2.5 text-sm font-medium text-cta",
                  active === top.length && "bg-cta-soft/60",
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
