/**
 * The illustration at the top of a changelog entry, one per ChangeVisual.
 *
 * Drawn in code rather than screenshotted, so they stay sharp, cost no image
 * bytes, and are built from the product's own data wherever the product has
 * it: the real connector icons and Claude's real setup steps, prices from
 * pricing.ts, tool names and a definition from the glossary. Where something
 * would be a customer's data (a site, a thread, an article), it's a neutral
 * placeholder, never an invented result.
 */
import type { CSSProperties, ReactNode } from "react";
import {
  ArrowLeftRight,
  ArrowRight,
  Check,
  ChevronDown,
  ChevronRight,
  Clock,
  Copy,
  Lock,
  Plus,
  RefreshCw,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/landing/shared";
import { RedditMark, ENGINE_MARKS } from "@/components/landing/ai-logos";
import { Mark } from "@/components/brand/Mark";
import { ConnectorLogo } from "@/components/dashboard/connector-logo";
import { IntegrationLogo } from "@/components/dashboard/integration-logos";
import { TOOL_ICONS } from "@/components/tools/icons";
import { CONNECTORS, MCP_URL, getConnector, type Connector } from "@/data/connectors";
import { PLAN, STUDIO, formatUsd } from "@/data/pricing";
import { getTool, type Tool } from "@/data/tools";
import { getEngine, type Engine } from "@/data/ai-seo/engines";
import { getTerm } from "@/data/glossary/terms";
import { plainText } from "@/lib/inline-md";
import type { ChangeVisual } from "@/data/changelog";

/* ---------- Primitives ---------- */

const DOTS: CSSProperties = {
  backgroundImage:
    "radial-gradient(color-mix(in oklab, var(--ink) 11%, transparent) 1px, transparent 1px)",
  backgroundSize: "18px 18px",
  maskImage: "radial-gradient(ellipse 80% 75% at 50% 40%, #000 25%, transparent 100%)",
  WebkitMaskImage: "radial-gradient(ellipse 80% 75% at 50% 40%, #000 25%, transparent 100%)",
};

const GLOW: CSSProperties = {
  backgroundImage:
    "radial-gradient(70% 90% at 50% 0%, color-mix(in oklab, var(--brand-blue) 13%, transparent), transparent 70%)",
};

/** The canvas every illustration sits on: a dotted field lit from above. */
function Stage({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div
      role="img"
      aria-label={label}
      className="relative isolate overflow-hidden rounded-2xl border border-border bg-surface px-4 py-9 sm:px-10 sm:py-12"
    >
      <div aria-hidden className="absolute inset-0 -z-10" style={GLOW} />
      <div aria-hidden className="absolute inset-0 -z-10" style={DOTS} />
      {children}
    </div>
  );
}

function Panel({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("rounded-xl border border-border bg-card shadow-3", className)}>
      {children}
    </div>
  );
}

/** A line of text that isn't the point: its shape, not its words. */
function Line({ w, className }: { w: string; className?: string }) {
  return (
    <span className={cn("block h-2 rounded-full bg-ink/[0.07]", className)} style={{ width: w }} />
  );
}

function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
      {children}
    </p>
  );
}

function Toggle() {
  return (
    <span className="relative h-4 w-7 shrink-0 rounded-full bg-cta">
      <span className="absolute right-0.5 top-0.5 h-3 w-3 rounded-full bg-white shadow-sm" />
    </span>
  );
}

const defined = <T,>(v: T | undefined): v is T => v !== undefined;

/* ---------- Connector library ---------- */

const GRID_CONNECTORS = [
  "claude",
  "chatgpt",
  "cursor",
  "lovable",
  "n8n",
  "perplexity",
  "bolt",
  "v0",
  "replit",
  "zapier",
  "github-copilot",
  "raycast",
  "make",
  "zed",
  "gemini-cli",
  "warp",
  "kiro",
  "figma-make",
]
  .map((id) => getConnector(id))
  .filter(defined);

function ConnectorsVisual() {
  const claude = getConnector("claude") as Connector;
  const url = MCP_URL.replace(/^https:\/\//, "");
  return (
    <Stage label="Illustration: the connector library, searchable, with Claude's setup steps open">
      <div className="mx-auto grid max-w-3xl items-start gap-5 md:grid-cols-[minmax(0,1fr)_16.5rem]">
        <div className="min-w-0">
          <Panel className="flex h-11 items-center gap-2.5 px-3.5 shadow-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Search {CONNECTORS.length} connectors
            </span>
          </Panel>
          <div
            className="mt-3 grid grid-cols-6 gap-2 sm:gap-2.5"
            style={{
              maskImage: "linear-gradient(to bottom, #000 50%, transparent)",
              WebkitMaskImage: "linear-gradient(to bottom, #000 50%, transparent)",
            }}
          >
            {GRID_CONNECTORS.map((c) => (
              <span
                key={c.id}
                className={cn(
                  "rounded-[27%]",
                  c.id === "claude" && "p-[3px] ring-2 ring-inset ring-cta",
                )}
              >
                <ConnectorLogo connector={c} className="aspect-square h-auto w-full shadow-1" />
              </span>
            ))}
          </div>
          <p className="mt-1 flex items-center justify-center gap-2 font-mono text-[0.7rem] text-ink md:hidden">
            {url}
          </p>
        </div>

        <Panel className="hidden p-4 md:block">
          <div className="flex items-center gap-2.5">
            <ConnectorLogo connector={claude} className="h-8 w-8" />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-ink">{claude.name}</p>
              <p className="text-xs text-muted-foreground">Add a custom connector</p>
            </div>
          </div>
          <ol className="mt-4 space-y-2.5">
            {claude.steps.map((s, i) => (
              <li key={s.text} className="flex gap-2.5 text-xs leading-snug text-muted-foreground">
                <span className="grid h-[1.125rem] w-[1.125rem] shrink-0 place-items-center rounded-full bg-cta-soft text-[0.6rem] font-semibold text-cta">
                  {i + 1}
                </span>
                <span>{s.text}</span>
              </li>
            ))}
          </ol>
          <div className="mt-4 flex items-center justify-between gap-2 rounded-lg border border-border bg-surface px-2.5 py-2 font-mono text-[0.7rem] text-ink">
            {url}
            <Copy className="h-3 w-3 text-muted-foreground" />
          </div>
        </Panel>
      </div>
    </Stage>
  );
}

/* ---------- Studio ---------- */

const STUDIO_SITES = [
  { name: "Your brand", domain: "yoursite.com", note: "Plan", active: true },
  { name: "Second brand", domain: "secondbrand.com", note: "Studio" },
  { name: "Client site", domain: "clientsite.com", note: "Studio" },
];

function StudioVisual() {
  const perSite = formatUsd(STUDIO.monthlyPerSite);
  const extra = STUDIO_SITES.length - 1;
  return (
    <Stage
      label={`Illustration: Studio's site switcher with three sites, and a monthly invoice with two extra sites at ${perSite} each`}
    >
      <div className="mx-auto flex max-w-2xl items-start justify-center gap-5 sm:gap-6">
        <Panel className="w-full max-w-[18rem] overflow-hidden">
          <div className="px-4 pb-2 pt-3.5">
            <Eyebrow>Your sites</Eyebrow>
          </div>
          <ul className="px-1.5 pb-1.5">
            {STUDIO_SITES.map((s) => (
              <li
                key={s.domain}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-2.5 py-2",
                  s.active && "bg-cta-soft",
                )}
              >
                <Avatar name={s.name} className="h-8 w-8" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold text-ink">{s.name}</span>
                  <span className="block truncate text-xs text-muted-foreground">{s.domain}</span>
                </span>
                {s.active ? (
                  <Check className="h-4 w-4 shrink-0 text-cta" />
                ) : (
                  <span className="shrink-0 text-[0.65rem] font-medium text-muted-foreground">
                    {s.note}
                  </span>
                )}
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-3 border-t border-dashed border-border px-4 py-3">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-dashed border-cta/40 text-cta">
              <Plus className="h-4 w-4" />
            </span>
            <span className="flex-1 text-sm font-semibold text-ink">Add a site</span>
            <span className="text-xs font-semibold text-cta">{perSite}/mo</span>
          </div>
        </Panel>

        <Panel className="mt-12 hidden w-60 p-4 sm:block">
          <Eyebrow>Monthly invoice</Eyebrow>
          <dl className="mt-3 space-y-2 text-sm">
            <div className="flex items-baseline justify-between gap-3">
              <dt className="text-muted-foreground">{PLAN.name} plan</dt>
              <dd className="tabular-nums text-ink">{formatUsd(PLAN.monthly)}</dd>
            </div>
            <div className="flex items-baseline justify-between gap-3">
              <dt className="text-muted-foreground">Studio · {extra} sites</dt>
              <dd className="tabular-nums text-ink">{formatUsd(STUDIO.monthlyPerSite * extra)}</dd>
            </div>
          </dl>
          <div className="mt-3 flex items-baseline justify-between border-t border-border pt-3">
            <span className="text-sm font-semibold text-ink">Total</span>
            <span className="font-semibold tabular-nums text-ink">
              {formatUsd(PLAN.monthly + STUDIO.monthlyPerSite * extra)}
            </span>
          </div>
          <p className="mt-2 text-[0.7rem] text-muted-foreground">One card, one invoice</p>
        </Panel>
      </div>
    </Stage>
  );
}

/* ---------- Framer plugin ---------- */

const CMS_ROWS: [string, "Added" | "Updated" | "Unchanged"][] = [
  ["78%", "Added"],
  ["64%", "Updated"],
  ["86%", "Added"],
  ["58%", "Unchanged"],
];

function FramerVisual() {
  return (
    <Stage label="Illustration: the Rankbox plugin inside the Framer editor, syncing articles into a CMS collection">
      <div className="mx-auto flex max-w-2xl items-start justify-center gap-5 sm:gap-6">
        <Panel className="w-full max-w-[16.5rem] overflow-hidden">
          <div className="flex items-center gap-2 border-b border-border px-3.5 py-2.5">
            <IntegrationLogo id="framer" title={false} className="h-5 w-5" />
            <span className="text-sm font-semibold text-ink">Rankbox</span>
            <span className="ml-auto rounded-md bg-secondary px-1.5 py-0.5 text-[0.6rem] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
              Plugin
            </span>
          </div>
          <div className="space-y-3 p-3.5">
            <div>
              <Eyebrow>Collection</Eyebrow>
              <span className="mt-1.5 flex h-8 items-center justify-between rounded-lg border border-border px-2.5 text-xs font-medium text-ink">
                Articles
                <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
              </span>
            </div>
            <div>
              <Eyebrow>API key</Eyebrow>
              <span className="mt-1.5 flex h-8 items-center rounded-lg border border-border bg-surface px-2.5 font-mono text-[0.7rem] text-ink">
                rv_live_••••••••
              </span>
            </div>
            <ul className="space-y-2 pt-1">
              {["Sync articles", "Structured data", "Report live URLs"].map((t) => (
                <li
                  key={t}
                  className="flex items-center justify-between gap-3 text-xs font-medium text-ink"
                >
                  {t}
                  <Toggle />
                </li>
              ))}
            </ul>
            <span className="flex h-9 items-center justify-center gap-1.5 rounded-lg bg-cta text-sm font-semibold text-white">
              <RefreshCw className="h-3.5 w-3.5" />
              Sync
            </span>
          </div>
        </Panel>

        <Panel className="mt-10 hidden w-64 overflow-hidden sm:block">
          <div className="flex items-center justify-between border-b border-border px-3.5 py-2.5">
            <span className="text-xs font-semibold text-ink">Articles</span>
            <span className="text-[0.65rem] text-muted-foreground">CMS collection</span>
          </div>
          <ul className="divide-y divide-border">
            {CMS_ROWS.map(([w, state], i) => (
              <li key={i} className="flex items-center gap-3 px-3.5 py-2.5">
                <span className="flex-1 space-y-1.5">
                  <Line w={w} />
                  <Line w="40%" className="h-1.5" />
                </span>
                <span
                  className={cn(
                    "shrink-0 rounded-md px-1.5 py-0.5 text-[0.6rem] font-semibold",
                    state === "Unchanged"
                      ? "bg-secondary text-muted-foreground"
                      : "bg-success/10 text-success",
                  )}
                >
                  {state}
                </span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </Stage>
  );
}

/* ---------- Reddit Presence ---------- */

function Steps({ items }: { items: { label: string; icon: ReactNode }[] }) {
  return (
    <ol className="mt-7 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
      {items.map((s, i) => (
        <li key={s.label} className="flex items-center gap-1.5 sm:gap-2">
          {i > 0 && <ChevronRight aria-hidden className="h-3.5 w-3.5 text-muted-foreground/70" />}
          <span className="inline-flex h-7 items-center gap-1.5 rounded-full border border-border bg-card px-2.5 text-[0.7rem] font-semibold text-ink shadow-1">
            {s.icon}
            {s.label}
          </span>
        </li>
      ))}
    </ol>
  );
}

function RedditVisual() {
  return (
    <Stage label="Illustration: a Reddit thread, the reply Rankbox drafted for it with its required disclosure line, and the steps from draft to a checked link">
      <div className="mx-auto max-w-2xl">
        <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
          <Panel className="p-4">
            <div className="flex items-center gap-2 text-xs">
              <RedditMark className="h-5 w-5" />
              <span className="font-semibold text-ink">r/yourniche</span>
            </div>
            <p className="mt-3 text-sm font-semibold leading-snug text-ink">
              What do you all use to get your site cited in AI answers?
            </p>
            <div className="mt-3 space-y-1.5">
              <Line w="95%" />
              <Line w="88%" />
              <Line w="56%" />
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-md bg-success/10 px-1.5 py-0.5 text-[0.65rem] font-semibold text-success">
                <Check className="h-3 w-3" strokeWidth={3} />
                Worth answering
              </span>
              <span className="text-[0.65rem] text-muted-foreground">Rules allow it</span>
            </div>
          </Panel>

          <Panel className="p-4 sm:mt-8">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-ink">Draft reply</span>
              <span className="rounded-md bg-cta-soft px-1.5 py-0.5 text-[0.65rem] font-semibold text-cta">
                1 credit
              </span>
            </div>
            <div className="mt-3 space-y-1.5">
              <Line w="100%" />
              <Line w="92%" />
              <Line w="97%" />
              <Line w="64%" />
            </div>
            <p className="mt-3 flex items-center gap-1.5 rounded-md border border-dashed border-cta/40 bg-cta-soft px-2 py-1.5 text-[0.7rem] font-medium text-ink">
              <Lock className="h-3 w-3 shrink-0 text-cta" />
              Disclosure: I work on Yourbrand.
            </p>
          </Panel>
        </div>
        <Steps
          items={[
            { label: "Drafted", icon: <Check className="h-3 w-3 text-cta" strokeWidth={3} /> },
            { label: "You post it", icon: <RedditMark className="h-3.5 w-3.5" /> },
            {
              label: "Link checked",
              icon: <Check className="h-3 w-3 text-success" strokeWidth={3} />,
            },
          ]}
        />
      </div>
    </Stage>
  );
}

/* ---------- Backlink exchange ---------- */

/* Node centres in the network's 300 × 220 box; the HTML nodes sit on the
   same points as percentages, so the arrows meet them at any width. */
const NODES = [
  { id: "you", label: "You", avatar: "Your site", x: 150, y: 34 },
  { id: "b", label: "Member", avatar: "Member B", x: 50, y: 178 },
  { id: "c", label: "Member", avatar: "Member C", x: 250, y: 178 },
];

function NodeChip({ label, avatar, x, y }: (typeof NODES)[number]) {
  return (
    <span
      className="absolute flex -translate-x-1/2 -translate-y-1/2 items-center gap-1.5 rounded-full border border-border bg-card py-1 pl-1 pr-2.5 shadow-2"
      style={{ left: `${(x / 300) * 100}%`, top: `${(y / 220) * 100}%` }}
    >
      <Avatar name={avatar} className="h-6 w-6" />
      <span className="text-xs font-semibold text-ink">{label}</span>
    </span>
  );
}

function ExchangeVisual() {
  return (
    <Stage label="Illustration: links running around three member sites instead of a direct swap, and a credit ledger where credits move only once a link is verified live">
      <div className="mx-auto flex max-w-2xl flex-col items-center justify-center gap-7 sm:flex-row sm:gap-10">
        <div className="relative aspect-[300/220] w-full max-w-[18rem] shrink-0">
          <svg viewBox="0 0 300 220" aria-hidden className="absolute inset-0 h-full w-full">
            <defs>
              <marker
                id="changelog-arrow"
                viewBox="0 0 10 10"
                refX="8"
                refY="5"
                markerWidth="7"
                markerHeight="7"
                orient="auto-start-reverse"
              >
                <path d="M0 1 L9 5 L0 9 z" fill="var(--cta)" />
              </marker>
            </defs>
            <g
              fill="none"
              stroke="var(--cta)"
              strokeWidth="1.6"
              strokeDasharray="4 5"
              strokeLinecap="round"
              markerEnd="url(#changelog-arrow)"
            >
              <path d="M118 46 Q 62 78 52 150" />
              <path d="M88 190 Q 150 214 212 190" />
              <path d="M248 150 Q 238 78 182 46" />
            </g>
          </svg>
          {NODES.map((n) => (
            <NodeChip key={n.id} {...n} />
          ))}
          <span className="absolute left-1/2 top-[58%] inline-flex -translate-x-1/2 -translate-y-1/2 items-center gap-1 whitespace-nowrap rounded-full border border-dashed border-border bg-surface px-2 py-0.5 text-[0.62rem] font-semibold text-muted-foreground">
            <ArrowLeftRight className="h-3 w-3" />
            No direct swaps
          </span>
        </div>

        <Panel className="w-full max-w-[16rem] p-4">
          <Eyebrow>Credits</Eyebrow>
          <ul className="mt-3 space-y-2.5 text-xs">
            <li className="flex items-center gap-2">
              <Check className="h-3.5 w-3.5 shrink-0 text-success" strokeWidth={3} />
              <span className="flex-1 text-ink">Link you host, verified live</span>
              <span className="font-semibold text-success">Earned</span>
            </li>
            <li className="flex items-center gap-2">
              <Clock className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
              <span className="flex-1 text-ink">Link you host, not live yet</span>
              <span className="font-semibold text-muted-foreground">Held</span>
            </li>
            <li className="flex items-center gap-2">
              <ArrowRight className="h-3.5 w-3.5 shrink-0 text-cta" />
              <span className="flex-1 text-ink">Link to you, verified live</span>
              <span className="font-semibold text-cta">Spent</span>
            </li>
          </ul>
        </Panel>
      </div>
    </Stage>
  );
}

/* ---------- Comparisons & engine guides ---------- */

const NEW_ENGINES = ["copilot", "grok", "meta-ai", "deepseek", "mistral", "manus"]
  .map((slug) => getEngine(slug))
  .filter(defined);

function Initial({ letter }: { letter: string }) {
  return (
    <span className="mx-auto grid h-9 w-9 place-items-center rounded-xl bg-ink/[0.06] text-sm font-bold text-ink">
      {letter}
    </span>
  );
}

function EngineChip({ engine }: { engine: Engine }) {
  const EngineMark = ENGINE_MARKS[engine.mark];
  return (
    <span className="flex flex-col items-center gap-1.5 rounded-xl border border-border bg-card px-1 py-2.5 shadow-1">
      <EngineMark className="h-5 w-5" />
      <span className="text-[0.65rem] font-medium text-ink">{engine.shortName}</span>
    </span>
  );
}

function GuidesVisual() {
  return (
    <Stage label="Illustration: a head-to-head comparison of Surfer SEO and Clearscope, and the six new AI engine guides">
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 sm:flex-row sm:items-start sm:justify-center">
        <Panel className="w-full max-w-[18rem] overflow-hidden">
          <div className="grid grid-cols-2 divide-x divide-border border-b border-border">
            {["Surfer SEO", "Clearscope"].map((n) => (
              <div key={n} className="p-3.5 text-center">
                <Initial letter={n[0]} />
                <p className="mt-2 text-sm font-semibold text-ink">{n}</p>
              </div>
            ))}
          </div>
          <div className="space-y-2.5 p-3.5">
            {["Pricing", "Scoring", "Best for"].map((row, i) => (
              <div
                key={row}
                className="grid grid-cols-[4.25rem_1fr_1fr] items-center gap-2 text-[0.7rem] text-muted-foreground"
              >
                {row}
                <Line w={`${82 - i * 9}%`} />
                <Line w={`${64 + i * 8}%`} />
              </div>
            ))}
          </div>
          <div className="flex items-center gap-1.5 border-t border-border bg-surface px-3.5 py-2.5 text-[0.7rem] font-semibold text-ink">
            <Check className="h-3 w-3 text-cta" strokeWidth={3} />
            Verdict: a winner for each use case
          </div>
        </Panel>

        <div className="w-full max-w-[14.5rem]">
          <Eyebrow>New AI engine guides</Eyebrow>
          <div className="mt-2.5 grid grid-cols-3 gap-2">
            {NEW_ENGINES.map((e) => (
              <EngineChip key={e.slug} engine={e} />
            ))}
          </div>
        </div>
      </div>
    </Stage>
  );
}

/* ---------- Free tools & glossary ---------- */

const NEW_TOOLS = [
  "ai-crawler-log-analyzer",
  "robots-txt-tester",
  "ai-citation-readiness-checker",
  "ai-search-readiness-check",
  "open-graph-generator",
  "hreflang-generator",
]
  .map((slug) => getTool(slug))
  .filter(defined);

function ToolChip({ tool, active }: { tool: Tool; active?: boolean }) {
  const Icon = TOOL_ICONS[tool.icon];
  return (
    <Panel
      className={cn(
        "flex items-center gap-2.5 p-2.5 shadow-1",
        active && "border-cta ring-2 ring-cta/20",
      )}
    >
      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-cta-soft text-cta">
        <Icon className="h-4 w-4" />
      </span>
      <span className="line-clamp-2 min-w-0 text-xs font-semibold leading-tight text-ink">
        {tool.name}
      </span>
    </Panel>
  );
}

function ToolsVisual() {
  const term = getTerm("generative-engine-optimization");
  return (
    <Stage label="Illustration: six of the new free tools, and the glossary's definition of generative engine optimization">
      <div className="mx-auto grid max-w-3xl items-center gap-5 md:grid-cols-[minmax(0,1fr)_15rem]">
        <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
          {NEW_TOOLS.map((t, i) => (
            <ToolChip key={t.slug} tool={t} active={i === 2} />
          ))}
        </div>
        {term && (
          <Panel className="p-4">
            <Eyebrow>Glossary</Eyebrow>
            <p className="mt-2 text-sm font-semibold text-ink">
              {term.term}
              {term.abbr && <span className="text-muted-foreground"> ({term.abbr})</span>}
            </p>
            <p className="mt-1.5 line-clamp-4 text-xs leading-relaxed text-muted-foreground">
              {plainText(term.definition)}
            </p>
          </Panel>
        )}
      </div>
    </Stage>
  );
}

/* ---------- Rename ---------- */

function RenameVisual() {
  return (
    <Stage label="Illustration: the Rankvolt name replaced by Rankbox, with the new domain, crawler name and MCP server name">
      <div className="flex flex-col items-center">
        <div className="flex items-center gap-3 sm:gap-6">
          <span className="text-xl font-semibold tracking-tight text-muted-foreground/70 line-through decoration-2 sm:text-4xl">
            Rankvolt
          </span>
          <ArrowRight className="h-5 w-5 shrink-0 text-muted-foreground sm:h-6 sm:w-6" />
          <span className="flex items-center gap-2 sm:gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-cta text-white shadow-2 sm:h-12 sm:w-12">
              <Mark className="h-5 w-5 sm:h-7 sm:w-7" />
            </span>
            <span className="text-xl font-bold tracking-tight text-ink sm:text-4xl">Rankbox</span>
          </span>
        </div>
        <div className="mt-7 flex flex-wrap justify-center gap-2">
          {["rankbox.xyz", "User-agent: RankboxBot", "rankbox-mcp"].map((t) => (
            <span
              key={t}
              className="rounded-md border border-border bg-card px-2 py-1 font-mono text-[0.7rem] text-ink shadow-1"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </Stage>
  );
}

/* ---------- Registry ---------- */

const VISUALS: Record<ChangeVisual, () => ReactNode> = {
  connectors: ConnectorsVisual,
  studio: StudioVisual,
  framer: FramerVisual,
  reddit: RedditVisual,
  exchange: ExchangeVisual,
  guides: GuidesVisual,
  tools: ToolsVisual,
  rename: RenameVisual,
};

export function EntryVisual({ visual }: { visual: ChangeVisual }) {
  const Visual = VISUALS[visual];
  return <Visual />;
}
