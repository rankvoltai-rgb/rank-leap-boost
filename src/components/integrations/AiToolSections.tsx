/**
 * The AI tool pages (/integrations/lovable, /integrations/cursor…) and the
 * connector directory on /integrations.
 *
 * Same design language as the hand-written integration pages beside them:
 * blue pixel hero, bordered cards, alternating surfaces, dark closing CTA.
 * Everything a page states comes from src/data/connectors.ts (the verified
 * setup the dashboard uses) or src/data/ai-integrations.ts (the framing).
 */
import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight, Search, X } from "lucide-react";
import { Reveal } from "@/components/landing/shared";
import { PixelField, CARD_PIXELS } from "@/components/landing/Hero";
import { ConnectorLogo } from "@/components/dashboard/connector-logo";
import { StepSnippet } from "@/components/dashboard/connector-library";
import { cn } from "@/lib/utils";
import {
  CATEGORIES,
  CONNECTORS,
  CONNECTORS_CHECKED,
  MCP_URL,
  searchConnectors,
  unsupportedMatch,
  type Connector,
  type ConnectorCategory,
} from "@/data/connectors";
import {
  AI_TOOLS,
  anotherLabel,
  categoryLabel,
  publicSlug,
  relatedAiTools,
  type AiToolPage,
} from "@/data/ai-integrations";
import { formatShortDate } from "@/lib/format-date";
import {
  Breadcrumb,
  Heading,
  HeroButtons,
  TRIAL_NOTE,
  heroPrimary,
  heroSecondary,
} from "./IntegrationSections";
import { Connector as FlowLine, McpWindow, RankboxTile } from "./visuals";

const CHECKED = formatShortDate(`${CONNECTORS_CHECKED}T12:00:00`);

/** Rankbox → the tool, as on the other integration pages. */
function ToolLockup({ tool }: { tool: Connector }) {
  return (
    <span className="inline-flex items-center gap-1 text-white">
      <RankboxTile className="h-11 w-11 shadow-elevation-lg" />
      <FlowLine />
      <span aria-hidden className="rounded-[25%] shadow-elevation-lg">
        <ConnectorLogo connector={tool} className="h-11 w-11 ring-white/30" />
      </span>
    </span>
  );
}

/* ---------- 1. Hero ---------- */

export function AiToolHero({ tool, page }: { tool: Connector; page: AiToolPage }) {
  return (
    <section
      id="top"
      aria-labelledby="integration-title"
      className="relative flex min-h-[calc(100svh-var(--top-chrome))] items-center overflow-hidden bg-brand-blue text-white"
    >
      <PixelField />
      <div className="relative mx-auto w-full max-w-6xl px-5 py-12 lg:py-10">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] xl:gap-16">
          <div className="mx-auto min-w-0 max-w-2xl text-center lg:mx-0 lg:max-w-none lg:text-left">
            <Reveal>
              <Breadcrumb current={tool.name} />
            </Reveal>
            <Reveal delay={0.05}>
              <div className="mb-7 flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:justify-start">
                <ToolLockup tool={tool} />
                <span className="inline-flex items-center rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur">
                  {page.eyebrow}
                </span>
              </div>
            </Reveal>
            <Reveal delay={0.12}>
              <h1
                id="integration-title"
                className="font-display text-balance text-[2.35rem] font-bold leading-[1.06] tracking-tight text-white sm:text-[3.25rem] xl:text-[3.6rem]"
              >
                <span className="lg:block">{page.headline.lead}</span>{" "}
                <span className="lg:block">{page.headline.accent}</span>
              </h1>
            </Reveal>
            <Reveal delay={0.19}>
              <p className="mx-auto mt-6 max-w-lg text-[1.05rem] leading-relaxed text-white/80 lg:mx-0">
                {page.subhead}
              </p>
            </Reveal>
            <Reveal delay={0.26} className="mt-8 flex flex-col items-center gap-3 lg:items-start">
              <HeroButtons
                primary={
                  <a href="/auth" className={heroPrimary}>
                    Get started free <ArrowRight className="h-4 w-4" />
                  </a>
                }
                secondary={
                  <a href="#setup" className={heroSecondary}>
                    See the setup
                  </a>
                }
              />
              <p className="text-sm text-white/70">{TRIAL_NOTE}</p>
            </Reveal>
          </div>

          <Reveal delay={0.34} y={28} className="mx-auto w-full min-w-0 max-w-lg lg:mx-0">
            <div className="relative">
              <div className="pointer-events-none absolute -inset-12">
                <PixelField pixels={CARD_PIXELS} seed={7} />
              </div>
              <McpWindow appName={tool.name} className="relative lg:min-h-[28.5rem]" />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ---------- 2. What it does, with prompts to try ---------- */

export function AiToolUses({ tool, page }: { tool: Connector; page: AiToolPage }) {
  return (
    <section aria-labelledby="uses-title" className="py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5">
        <Heading
          id="uses-title"
          eyebrow={`Rankbox for ${tool.name}`}
          title={`What ${tool.name} can do with Rankbox`}
          intro={`You don't call the tools by name. Ask ${tool.name} in plain words and it picks the right one.`}
        />
        <div className="mt-16 grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
          <ol className="self-start divide-y divide-border border-y border-border">
            {page.uses.map((u, i) => (
              <li key={u.title}>
                <Reveal delay={i * 0.06} className="flex gap-5 py-6">
                  <span className="text-xs font-semibold tabular-nums text-volt">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold text-ink">{u.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{u.body}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
          <Reveal delay={0.1} className="min-w-0">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-elevation">
              <p className="text-xs font-semibold uppercase tracking-wide text-volt">
                Try asking {tool.name}
              </p>
              <ul className="mt-4 space-y-3">
                {page.prompts.map((p) => (
                  <li
                    key={p}
                    className="rounded-xl rounded-br-md bg-secondary px-4 py-3 text-sm leading-relaxed text-ink"
                  >
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ---------- 3. Setup: the verified steps ---------- */

export function AiToolSetup({ tool }: { tool: Connector }) {
  return (
    <section
      id="setup"
      aria-labelledby="setup-title"
      className="scroll-mt-20 border-t border-border bg-surface/40 py-24 sm:py-32"
    >
      <div className="mx-auto grid max-w-6xl items-start gap-14 px-5 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
        <div className="min-w-0">
          <Heading
            id="setup-title"
            eyebrow="Setup"
            title={`Connect Rankbox to ${tool.name}`}
            intro={`${tool.steps.length} ${tool.steps.length === 1 ? "step" : "steps"}, using the menus ${tool.maker} documents.`}
            align="left"
          />
          <ol className="relative mt-10">
            {tool.steps.map((s, i) => (
              <li key={s.text} className="relative pb-8 last:pb-0">
                {i < tool.steps.length - 1 && (
                  <span aria-hidden className="absolute bottom-0 left-5 top-10 w-px bg-border" />
                )}
                <Reveal delay={i * 0.06} className="flex gap-5">
                  <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-blue text-sm font-semibold text-white ring-8 ring-surface">
                    {i + 1}
                  </span>
                  <div className="min-w-0 flex-1 space-y-3 pt-2">
                    <p className="text-base text-ink">{s.text}</p>
                    {s.snippet && <StepSnippet snippet={s.snippet} />}
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
          {tool.alternative && (
            <Reveal className="mt-8 space-y-3 border-t border-border pt-6">
              <p className="text-sm text-muted-foreground">{tool.alternative.text}</p>
              {tool.alternative.snippet && <StepSnippet snippet={tool.alternative.snippet} />}
            </Reveal>
          )}
        </div>

        <Reveal delay={0.12} y={24} className="min-w-0 space-y-4 lg:sticky lg:top-24">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-elevation">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Server URL
            </p>
            <p className="mt-2 break-all font-mono text-sm text-ink">{MCP_URL}</p>
            <dl className="mt-6 space-y-4 border-t border-border pt-5 text-sm">
              {tool.plan && (
                <div>
                  <dt className="font-semibold text-ink">{tool.name} plan</dt>
                  <dd className="mt-1 leading-relaxed text-muted-foreground">{tool.plan}</dd>
                </div>
              )}
              <div>
                <dt className="font-semibold text-ink">Rankbox plan</dt>
                <dd className="mt-1 leading-relaxed text-muted-foreground">{TRIAL_NOTE}</dd>
              </div>
              {tool.note && (
                <div className="rounded-lg border border-warning/30 bg-warning/5 px-3 py-2.5 text-ink">
                  {tool.note}
                </div>
              )}
            </dl>
            <a
              href={tool.docsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-ink underline decoration-border underline-offset-4 hover:decoration-ink"
            >
              {tool.maker}&rsquo;s MCP docs <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
            <p className="mt-1.5 text-xs text-muted-foreground">Steps checked {CHECKED}.</p>
          </div>
          <a
            href="/auth"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-cta px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-cta-hover hover:shadow-md"
          >
            Get started free <ArrowRight className="h-4 w-4" />
          </a>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- 4. Related tools, and the closing CTA ---------- */

export function ToolCard({ tool }: { tool: Connector }) {
  const tag = tool.kind === "mcp" ? "MCP" : tool.kind === "api" ? "API" : "Publishing";
  return (
    <Link
      to="/integrations/$slug"
      params={{ slug: publicSlug(tool) }}
      className="group flex h-full items-start gap-4 rounded-2xl border border-border bg-card p-4 shadow-elevation transition-all hover:-translate-y-0.5 hover:border-cta/30 hover:shadow-elevation-lg sm:p-5"
    >
      <ConnectorLogo connector={tool} className="h-11 w-11" />
      <div className="min-w-0 flex-1">
        <h3 className="flex items-center gap-2 text-base font-semibold text-ink">
          <span className="truncate">{tool.name}</span>
          <span className="shrink-0 rounded-full border border-border px-2 py-px text-[0.62rem] font-semibold text-muted-foreground">
            {tag}
          </span>
        </h3>
        <p className="mt-1 line-clamp-1 text-sm leading-relaxed text-muted-foreground sm:line-clamp-2">
          {tool.tagline}
        </p>
      </div>
      <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-cta" />
    </Link>
  );
}

export function RelatedAiTools({ tool }: { tool: Connector }) {
  const related = relatedAiTools(tool);
  if (!related.length) return null;
  return (
    <section
      aria-labelledby="related-title"
      className="border-t border-border bg-surface/40 py-24 sm:py-28"
    >
      <div className="mx-auto max-w-6xl px-5">
        <Heading
          id="related-title"
          eyebrow={categoryLabel(tool)}
          title={`Using another ${anotherLabel(tool)}?`}
          intro="Same server, same three tools. Each one has its own setup guide."
        />
        <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((r, i) => (
            <li key={r.id}>
              <Reveal delay={i * 0.04} className="h-full">
                <ToolCard tool={r} />
              </Reveal>
            </li>
          ))}
        </ul>
        <Reveal delay={0.1} className="mt-10 text-center">
          <Link
            to="/integrations"
            hash="directory"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink transition-colors hover:text-volt"
          >
            See all {CONNECTORS.length} integrations <ArrowRight className="h-4 w-4" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

export function AiToolCTA({ tool }: { tool: Connector }) {
  return (
    <section aria-labelledby="cta-title" className="py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-border bg-ink px-6 py-14 text-center sm:px-12 sm:py-16">
            <div className="pointer-events-none absolute inset-0 bg-gridlines opacity-[0.07]" />
            <div className="relative">
              <div className="mb-7 flex justify-center">
                <ToolLockup tool={tool} />
              </div>
              <h2
                id="cta-title"
                className="font-display mx-auto max-w-2xl text-balance text-3xl font-semibold tracking-tight text-background sm:text-4xl"
              >
                Bring Rankbox into {tool.name}
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-balance text-base text-background/70">
                Add one URL and {tool.name} can find the questions, brief the article, and write the
                meta descriptions. Autopilot writes and publishes the rest.
              </p>
              <a
                href="/auth"
                className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-cta px-6 py-3.5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-cta-hover"
              >
                Get started free <ArrowRight className="h-4 w-4" />
              </a>
              <p className="mt-3 text-sm text-background/60">{TRIAL_NOTE}</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ================================================================== */
/* The directory on /integrations                                     */
/* ================================================================== */

type Filter = ConnectorCategory | "all";

/**
 * Every connector, searchable. The server renders the full grid, grouped by
 * category, so every page is linked and indexable before any script runs;
 * search and the filters only narrow what's on screen.
 */
export function ConnectorDirectory() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const matches = useMemo(() => searchConnectors(query), [query]);
  const shown = filter === "all" ? matches : matches.filter((c) => c.category === filter);
  const browsing = !query.trim() && filter === "all";
  const unsupported = unsupportedMatch(query);
  const count = (f: Filter) =>
    f === "all" ? matches.length : matches.filter((c) => c.category === f).length;

  return (
    <section
      id="directory"
      aria-labelledby="directory-title"
      className="scroll-mt-16 py-24 sm:py-28"
    >
      <div className="mx-auto max-w-6xl px-5">
        <Heading
          id="directory-title"
          eyebrow="Directory"
          title="Find your platform or AI tool"
          intro={`${CONNECTORS.length} integrations: publish to your site, or add Rankbox's research to the AI tools you already use.`}
        />

        <Reveal delay={0.06} className="mx-auto mt-10 max-w-xl">
          <label className="relative block">
            <span className="sr-only">Search integrations</span>
            <Search
              aria-hidden
              className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Escape" && setQuery("")}
              placeholder="Search Lovable, Cursor, WordPress, n8n…"
              autoComplete="off"
              spellCheck={false}
              className="h-12 w-full rounded-xl border border-border bg-card pl-11 pr-11 text-sm text-ink shadow-elevation outline-none transition-shadow placeholder:text-muted-foreground/80 focus:border-cta/50 focus:ring-4 focus:ring-cta/10 [&::-webkit-search-cancel-button]:hidden"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-lg text-muted-foreground hover:bg-secondary hover:text-ink"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </label>
        </Reveal>

        <Reveal delay={0.1} className="mt-5 flex justify-center">
          <div
            role="group"
            aria-label="Filter integrations"
            className="flex max-w-full gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {([{ id: "all", label: "All" }, ...CATEGORIES] as { id: Filter; label: string }[]).map(
              (f) => (
                <button
                  key={f.id}
                  type="button"
                  aria-pressed={filter === f.id}
                  onClick={() => setFilter(f.id)}
                  className={cn(
                    "flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
                    filter === f.id
                      ? "border-cta bg-cta text-white"
                      : "border-border bg-card text-muted-foreground hover:border-ink/15 hover:text-ink",
                  )}
                >
                  {f.label}
                  <span
                    className={cn(
                      "text-xs tabular-nums",
                      filter === f.id ? "text-white/75" : "text-muted-foreground/70",
                    )}
                  >
                    {count(f.id)}
                  </span>
                </button>
              ),
            )}
          </div>
        </Reveal>

        <p className="sr-only" role="status">
          {shown.length} {shown.length === 1 ? "integration" : "integrations"}
        </p>

        {unsupported && (
          <div className="mx-auto mt-10 max-w-xl rounded-2xl border border-warning/30 bg-warning/5 px-5 py-4 text-sm">
            <p className="font-semibold text-ink">{unsupported.name} can&rsquo;t connect yet</p>
            <p className="mt-1 text-muted-foreground">{unsupported.reason}</p>
          </div>
        )}

        {browsing ? (
          <div className="mt-12 space-y-14">
            {CATEGORIES.map((cat) => {
              const items = matches.filter((c) => c.category === cat.id);
              return (
                <div key={cat.id}>
                  <div className="mb-5 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-3">
                    <h3 className="text-lg font-semibold text-ink">{cat.label}</h3>
                    <p className="text-sm text-muted-foreground">{cat.blurb}</p>
                  </div>
                  <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {shown.map((c) => (
              <li key={c.id}>
                <ToolCard tool={c} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="mx-auto mt-10 max-w-xl rounded-2xl border border-dashed border-border bg-card px-6 py-8 text-center">
            <p className="text-base font-semibold text-ink">
              {unsupported ? "Try one of these instead" : `Nothing matches “${query.trim()}”`}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Anything that can add a remote MCP server by URL works with Rankbox, and any site can
              pull articles from the REST API.
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
    </section>
  );
}

/** The hub's AI band: what the MCP server adds, over a wall of the tools it works in. */
export function AiToolsBand() {
  const wall = [...AI_TOOLS.filter((t) => t.popular), ...AI_TOOLS.filter((t) => !t.popular)].slice(
    0,
    24,
  );
  return (
    <section
      aria-labelledby="ai-band-title"
      className="border-t border-border bg-surface/40 py-24 sm:py-32"
    >
      <div className="mx-auto max-w-6xl px-5">
        <Heading
          id="ai-band-title"
          eyebrow="AI tools"
          title={`Rankbox inside ${AI_TOOLS.length} AI tools`}
          intro="Add one URL to the assistant, app builder, coding agent, or automation you already use, and it can research and plan content with Rankbox."
        />
        <Reveal delay={0.06}>
          <ul className="mx-auto mt-12 grid max-w-3xl grid-cols-6 gap-3 sm:grid-cols-8 sm:gap-4">
            {wall.map((t) => (
              <li key={t.id}>
                <Link
                  to="/integrations/$slug"
                  params={{ slug: publicSlug(t) }}
                  title={t.name}
                  className="block rounded-[25%] transition-transform hover:-translate-y-0.5"
                >
                  <ConnectorLogo connector={t} className="h-full w-full" />
                </Link>
              </li>
            ))}
          </ul>
        </Reveal>
        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {[
            {
              title: "Find the questions",
              body: "What people ask ChatGPT, Perplexity, and Gemini about a topic, grouped by intent.",
            },
            {
              title: "Brief the article",
              body: "A working title, an H2 outline, questions to answer, and entities to mention.",
            },
            {
              title: "Write meta descriptions",
              body: "Three options for any page, each 120 to 160 characters.",
            },
          ].map((f, i) => (
            <Reveal key={f.title} delay={i * 0.06} className="h-full">
              <div className="h-full rounded-2xl border border-border bg-card p-6 shadow-elevation">
                <h3 className="text-base font-semibold text-ink">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.1} className="mt-10 text-center">
          <Link
            to="/integrations/$slug"
            params={{ slug: "mcp" }}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink transition-colors hover:text-volt"
          >
            How the MCP server works <ArrowRight className="h-4 w-4" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
