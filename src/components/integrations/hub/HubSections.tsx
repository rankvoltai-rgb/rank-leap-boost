/**
 * /integrations below the hero, in the landing's frame:
 *
 *   stats       four numbers from the connector data
 *   two ways    publishing (articles to your site) and research (the MCP URL,
 *               copyable), side by side
 *   directory   everything, grouped, with a sticky search and category rail;
 *               fully server-rendered so every page is linked before any
 *               script runs
 *   after       what happens once a site is connected, and what its key can do
 *   faq, close
 *
 * The individual integration pages keep their own sections
 * (IntegrationSections.tsx); nothing here is shared with them.
 */
import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Copy,
  KeyRound,
  LayoutGrid,
  MessageCircleQuestion,
  Plus,
  Route,
  Search,
  Workflow,
  X,
} from "lucide-react";
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
import { MarkDither } from "@/components/landing/hero-dither";
import { Reveal } from "@/components/landing/shared";
import { Accordion, AccordionContent, AccordionItem } from "@/components/ui/accordion";
import { ConnectorLogo } from "@/components/dashboard/connector-logo";
import {
  CATEGORIES,
  CONNECTORS,
  MCP_URL,
  searchConnectors,
  unsupportedMatch,
  type Connector,
  type ConnectorCategory,
} from "@/data/connectors";
import { AI_TOOLS, publicSlug } from "@/data/ai-integrations";
import { TRIAL_CTA, TRIAL_NOTE } from "@/data/pricing";
import { cn } from "@/lib/utils";
import { scrollToDirectory } from "./HubHero";

export type DirectoryFilter = ConnectorCategory | "all";

const SITES = CONNECTORS.filter((c) => c.kind === "site");

/* ---------- Stats ---------- */

export function HubStats({ specs }: { specs: { value: string; label: string }[] }) {
  return (
    <Band>
      <h2 className="sr-only">Integrations at a glance</h2>
      <CellGrid className="grid-cols-2 lg:grid-cols-4">
        {specs.map((s) => (
          <li key={s.label} className={cn(CELL, "px-5 py-6 sm:px-8 sm:py-7")}>
            <p className="font-display text-[1.7rem] font-medium tracking-[-0.02em] text-ink sm:text-[2rem]">
              {s.value}
            </p>
            <p className="mt-1 text-[0.82rem] leading-snug text-muted-foreground">{s.label}</p>
          </li>
        ))}
      </CellGrid>
    </Band>
  );
}

/* ---------- Two ways in ---------- */

function CopyUrl() {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  async function copy() {
    try {
      await navigator.clipboard.writeText(MCP_URL);
      setState("copied");
    } catch {
      setState("failed");
    }
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setState("idle"), 1800);
  }
  return (
    <div className="flex items-center gap-2 rounded-lg border border-ink/[0.08] bg-white py-1.5 pl-3 pr-1.5 shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
      <code className="min-w-0 flex-1 truncate font-mono text-[0.85rem] text-ink">{MCP_URL}</code>
      <button
        type="button"
        onClick={copy}
        className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-md bg-cta px-3 text-xs font-semibold text-white transition-colors hover:bg-cta-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta/40 focus-visible:ring-offset-1"
      >
        {state === "copied" ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
        <span aria-live="polite">
          {state === "copied" ? "Copied" : state === "failed" ? "Copy failed" : "Copy URL"}
        </span>
      </button>
    </div>
  );
}

export function TwoWays() {
  const platforms = SITES.map((c) => (c.id === "square" ? "Square Online" : c.name));
  const platformList = `${platforms.slice(0, -1).join(", ")} and ${platforms.at(-1)}`;
  const tools = ["claude", "chatgpt", "cursor", "lovable"]
    .map((id) => AI_TOOLS.find((t) => t.id === id)?.name)
    .filter(Boolean);
  return (
    <section aria-labelledby="two-ways-title">
      <Spacer />
      <SectionHead
        icon={Route}
        eyebrow="How Rankbox connects"
        title={
          <span id="two-ways-title">
            Two connections, <Accent>two jobs</Accent>
          </span>
        }
        subtitle="Your site receives the articles. Your AI tools get Rankbox's research. Connect either, or both."
      />
      <Band>
        <CellGrid className="lg:grid-cols-2">
          <li className={cn(CELL, "flex flex-col px-6 py-9 sm:px-10")}>
            <span className="text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-cta">
              Publishing
            </span>
            <h3 className="mt-3 font-display text-[1.45rem] font-medium tracking-[-0.02em] text-ink">
              Articles, to your site
            </h3>
            <p className="mt-2 max-w-md text-[0.92rem] leading-relaxed text-muted-foreground">
              {platformList} each have a Rankbox app or plugin. Any other site pulls finished
              articles from the REST API.
            </p>
            <ul className="mt-6 flex flex-wrap gap-2">
              {[...SITES, ...CONNECTORS.filter((c) => c.id === "api")].map((c) => (
                <li key={c.id}>
                  <Link
                    to="/integrations/$slug"
                    params={{ slug: publicSlug(c) }}
                    className="inline-flex h-9 items-center gap-2 rounded-lg border border-ink/[0.08] bg-white pl-1.5 pr-3 text-[0.82rem] font-medium text-ink transition-colors hover:border-cta/40 hover:text-cta"
                  >
                    <ConnectorLogo connector={c} className="h-6 w-6" />
                    {c.id === "api" ? "REST API" : c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </li>
          <li className={cn(CELL, "flex flex-col px-6 py-9 sm:px-10")}>
            <span className="text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-cta">
              Research
            </span>
            <h3 className="mt-3 font-display text-[1.45rem] font-medium tracking-[-0.02em] text-ink">
              Rankbox, inside your AI tools
            </h3>
            <p className="mt-2 max-w-md text-[0.92rem] leading-relaxed text-muted-foreground">
              Add one URL to {tools.join(", ")} or any of {AI_TOOLS.length - tools.length} more,
              then ask for the questions people ask AI engines, an SEO content brief, or meta
              descriptions.
            </p>
            <div className="mt-6 max-w-md">
              <CopyUrl />
            </div>
            <Link
              to="/integrations/$slug"
              params={{ slug: "mcp" }}
              className="group mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-cta hover:text-cta-hover"
            >
              Set up any MCP client
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </li>
        </CellGrid>
      </Band>
    </section>
  );
}

/* ---------- Directory ---------- */

function ToolCell({ c }: { c: Connector }) {
  return (
    <li className={cn(CELL, "min-w-0")}>
      <Link
        to="/integrations/$slug"
        params={{ slug: publicSlug(c) }}
        className="group flex h-full items-start gap-3.5 px-5 py-5 transition-colors hover:bg-ink/[0.02] focus-visible:bg-ink/[0.02] focus-visible:outline-none sm:px-6"
      >
        <ConnectorLogo connector={c} className="h-10 w-10 shrink-0" />
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[0.95rem] font-semibold text-ink transition-colors group-hover:text-cta">
            {c.name}
          </span>
          <span className="mt-1 line-clamp-2 text-[0.82rem] leading-snug text-muted-foreground">
            {c.tagline}
          </span>
        </span>
        <ArrowUpRight
          aria-hidden
          className="mt-0.5 h-4 w-4 shrink-0 text-ink/25 transition-colors group-hover:text-cta"
        />
      </Link>
    </li>
  );
}

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

  return (
    <section id="directory" aria-labelledby="directory-title" className="scroll-mt-16">
      <Spacer />
      <SectionHead
        icon={LayoutGrid}
        eyebrow="Directory"
        title={
          <span id="directory-title">
            Every <Accent>integration</Accent>
          </span>
        }
        subtitle={`${CONNECTORS.length} ways to connect Rankbox, each with its own page and setup guide.`}
      />
      <Band>
        <div className="grid grid-cols-[minmax(0,1fr)] lg:grid-cols-[15rem_minmax(0,1fr)]">
          {/* Rail: search and categories. Chips on small screens. */}
          <aside
            className={cn(
              "min-w-0 border-b px-5 py-5 sm:px-6 lg:border-b-0 lg:border-r lg:py-8",
              LINE,
            )}
          >
            <div className="lg:sticky lg:top-24">
              <label className="relative block">
                <span className="sr-only">Search integrations</span>
                <Search
                  aria-hidden
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => onQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Escape" && onQuery("")}
                  placeholder="Search integrations"
                  autoComplete="off"
                  spellCheck={false}
                  className="h-10 w-full rounded-lg border border-ink/[0.1] bg-white pl-9 pr-8 text-sm text-ink outline-none transition-[border-color,box-shadow] placeholder:text-muted-foreground focus:border-cta/50 focus:shadow-[0_0_0_4px_color-mix(in_oklab,var(--cta)_12%,transparent)] [&::-webkit-search-cancel-button]:hidden"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => onQuery("")}
                    aria-label="Clear search"
                    className="absolute right-1.5 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-md text-muted-foreground hover:bg-ink/[0.04] hover:text-ink"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </label>
              <div
                role="group"
                aria-label="Filter integrations"
                className="-mx-1 mt-3 flex gap-1 overflow-x-auto px-1 pb-1 [scrollbar-width:none] lg:mx-0 lg:mt-4 lg:flex-col lg:gap-0.5 lg:overflow-visible lg:px-0 [&::-webkit-scrollbar]:hidden"
              >
                {filters.map((f) => {
                  const on = filter === f.id;
                  const n = count(f.id);
                  return (
                    <button
                      key={f.id}
                      type="button"
                      aria-pressed={on}
                      onClick={() => onFilter(f.id)}
                      className={cn(
                        "flex shrink-0 items-center justify-between gap-3 whitespace-nowrap rounded-lg px-3 py-1.5 text-[0.85rem] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta/40 lg:py-2",
                        on ? "bg-cta-soft text-cta" : "text-ink hover:bg-ink/[0.04]",
                        n === 0 && !on && "opacity-50",
                      )}
                    >
                      {f.label}
                      <span
                        className={cn(
                          "text-xs tabular-nums",
                          on ? "text-cta/70" : "text-muted-foreground",
                        )}
                      >
                        {n}
                      </span>
                    </button>
                  );
                })}
              </div>
              <p className="mt-6 hidden text-xs leading-relaxed text-muted-foreground lg:block">
                Not listed? Anything that takes a remote MCP server works, and any site can use the{" "}
                <Link
                  to="/integrations/$slug"
                  params={{ slug: "api" }}
                  className="font-semibold text-cta hover:underline"
                >
                  REST API
                </Link>
                .
              </p>
            </div>
          </aside>

          <div className="min-w-0">
            <p className="sr-only" role="status">
              {shown.length} {shown.length === 1 ? "integration" : "integrations"}
            </p>
            {unsupported && (
              <div className={cn("border-b px-5 py-4 text-sm sm:px-6", LINE, PANEL)}>
                <p className="font-semibold text-ink">{unsupported.name} can&rsquo;t connect yet</p>
                <p className="mt-1 text-muted-foreground">{unsupported.reason}</p>
              </div>
            )}

            {browsing ? (
              CATEGORIES.map((cat, i) => {
                const items = matches.filter((c) => c.category === cat.id);
                return (
                  <div
                    key={cat.id}
                    id={`dir-${cat.id}`}
                    className={cn("scroll-mt-24", i > 0 && cn("border-t", LINE))}
                  >
                    <div className="flex flex-col gap-0.5 px-5 pb-1 pt-6 sm:flex-row sm:items-baseline sm:gap-3 sm:px-6">
                      <h3 className="text-[1.02rem] font-semibold text-ink">{cat.label}</h3>
                      <p className="text-[0.82rem] text-muted-foreground">
                        {cat.blurb} · {items.length}
                      </p>
                    </div>
                    <CellGrid className="sm:grid-cols-2 xl:grid-cols-3">
                      {items.map((c) => (
                        <ToolCell key={c.id} c={c} />
                      ))}
                    </CellGrid>
                  </div>
                );
              })
            ) : shown.length > 0 ? (
              <CellGrid className="sm:grid-cols-2 xl:grid-cols-3">
                {shown.map((c) => (
                  <ToolCell key={c.id} c={c} />
                ))}
              </CellGrid>
            ) : (
              <div className="px-6 py-14 text-center">
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
                    className="inline-flex h-10 items-center gap-1.5 rounded-lg bg-cta px-4 text-sm font-semibold text-white hover:bg-cta-hover"
                  >
                    Any MCP client <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    to="/integrations/$slug"
                    params={{ slug: "api" }}
                    className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-ink/[0.1] bg-white px-4 text-sm font-semibold text-ink hover:border-ink/[0.18]"
                  >
                    The REST API
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </Band>
    </section>
  );
}

/* ---------- After you connect ---------- */

/* The same facts the platform pages state, in their words. */
const LOOP = [
  {
    title: "Rankbox finishes an article",
    body: "Researched, written in your voice, and scored. Only finished articles are ever sent.",
  },
  {
    title: "Your site asks for it",
    body: "The app or plugin checks in with its key and collects everything new or edited since its last visit.",
  },
  {
    title: "It lands as a native post",
    body: "In your theme or template, with its slug, excerpt, and tags set. Live straight away, or held as a draft.",
  },
  {
    title: "The live URL comes back",
    body: "So Rankbox knows where every article lives, and your dashboard shows it arrived.",
  },
];

const KEY_FACTS = [
  {
    title: "Limited by design",
    body: "A key can fetch your finished articles and report where they went live, on your own domain. Nothing else in your account.",
  },
  {
    title: "No passwords shared",
    body: "Rankbox never logs into your site. Your site pulls articles in with a key you can see, replace, and revoke.",
  },
  {
    title: "Stored as a hash",
    body: "A key is shown once. Rankbox keeps only its SHA-256 hash, so a database leak never exposes a usable key.",
  },
  {
    title: "Revoke in one click",
    body: "Replace a key that may have leaked, or revoke one you no longer use. Syncing with it stops the moment you do.",
  },
];

export function AfterConnect() {
  return (
    <section aria-labelledby="after-title">
      <Spacer />
      <SectionHead
        icon={Workflow}
        eyebrow="After you connect a site"
        title={
          <span id="after-title">
            One loop, <Accent>every platform</Accent>
          </span>
        }
        subtitle="The whole path an article takes from Rankbox to your site, then it repeats on your schedule. Edits you make in Rankbox travel the same path."
      />
      <Band>
        <CellGrid className="sm:grid-cols-2 lg:grid-cols-4">
          {LOOP.map((s, i) => (
            <li key={s.title} className={cn(CELL, "px-6 py-8 sm:px-7")}>
              <Reveal delay={i * 0.05}>
                <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-ink/[0.08] bg-white text-[0.85rem] font-semibold text-cta shadow-[0_1px_2px_rgba(16,24,40,0.05)]">
                  {i + 1}
                </span>
                <h3 className="mt-5 text-[1rem] font-semibold tracking-tight text-ink">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
              </Reveal>
            </li>
          ))}
        </CellGrid>
      </Band>
      <Band inner={cn("px-5 py-10 sm:px-8 lg:px-12", PANEL)}>
        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,2fr)] lg:gap-12">
          <div>
            <span className="inline-flex items-center gap-2 text-[0.78rem] font-semibold text-ink">
              <KeyRound className="h-4 w-4 text-cta" aria-hidden />
              One key per site
            </span>
            <h3 className="mt-3 font-display text-[1.45rem] font-medium leading-tight tracking-[-0.02em] text-ink">
              Your site holds the key
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Everything that key can and can&rsquo;t do.
            </p>
          </div>
          <ul className="grid gap-px overflow-hidden rounded-xl border border-ink/[0.07] bg-ink/[0.07] sm:grid-cols-2">
            {KEY_FACTS.map((f) => (
              <li key={f.title} className="bg-white p-5">
                <p className="text-[0.92rem] font-semibold text-ink">{f.title}</p>
                <p className="mt-1.5 text-[0.85rem] leading-relaxed text-muted-foreground">
                  {f.body}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </Band>
    </section>
  );
}

/* ---------- FAQ ---------- */

export function HubFaq({ faqs }: { faqs: { q: string; a: string }[] }) {
  return (
    <section id="faq" aria-labelledby="faq-title" className="scroll-mt-16">
      <Spacer />
      <Band>
        <div className="grid lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.4fr)]">
          <Reveal
            className={cn(
              "border-b px-6 py-12 sm:px-10 lg:border-b-0 lg:border-r lg:px-12 lg:py-16",
              LINE,
            )}
          >
            <Pill icon={MessageCircleQuestion}>Questions</Pill>
            <h2
              id="faq-title"
              className="mt-5 font-display text-[1.9rem] font-medium leading-[1.12] tracking-[-0.03em] text-ink sm:text-[2.3rem]"
            >
              Integration <Accent>questions</Accent>
            </h2>
            <p className="mt-4 max-w-sm text-[0.95rem] leading-relaxed text-muted-foreground">
              How connecting works, what it costs, and what Rankbox can touch.
            </p>
          </Reveal>
          <div className="px-6 py-4 sm:px-10 lg:px-12 lg:py-8">
            <Accordion type="single" collapsible className="divide-y divide-ink/[0.07]">
              {faqs.map((f, i) => (
                <AccordionItem key={f.q} value={`q-${i}`} className="border-b-0">
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
                    {f.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </Band>
    </section>
  );
}

/* ---------- Closing ---------- */

export function HubClosing() {
  return (
    <section aria-labelledby="integrations-cta-title">
      <Spacer />
      <Band inner="overflow-hidden bg-cta">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.14] [mask-image:radial-gradient(ellipse_70%_90%_at_50%_50%,#000_35%,transparent_100%)]"
        >
          <MarkDither className="text-white" />
        </div>
        <Reveal className="relative mx-auto max-w-2xl px-6 py-14 text-center sm:px-10 sm:py-16">
          <h2
            id="integrations-cta-title"
            className="text-balance font-display text-[2rem] font-medium leading-[1.1] tracking-[-0.03em] text-white sm:text-[2.6rem]"
          >
            Connect once, and every article finds its way home
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-balance text-[1rem] leading-relaxed text-white">
            Pick your platform, add Rankbox to the AI tools you use, and each finished article
            publishes to your site.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="/auth"
              className="group inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-white px-5 text-[0.95rem] font-semibold text-cta shadow-[0_1px_2px_rgba(4,24,72,0.2),0_8px_24px_-12px_rgba(4,24,72,0.5)] transition-[transform,background-color] duration-200 hover:-translate-y-0.5 hover:bg-white/95 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/40"
            >
              {TRIAL_CTA}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
            <button
              type="button"
              onClick={scrollToDirectory}
              className="inline-flex h-11 items-center justify-center rounded-lg border border-white/40 px-5 text-[0.95rem] font-semibold text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/40"
            >
              Browse integrations
            </button>
          </div>
          <p className="mt-3.5 text-[0.82rem] text-white">{TRIAL_NOTE}</p>
        </Reveal>
      </Band>
      <Spacer closing />
    </section>
  );
}
