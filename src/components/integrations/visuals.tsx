/**
 * Product visuals for the integration pages. Like the feature showcases, every
 * window is a labelled *sample*: fictional brands (Plannora and friends), and
 * UI that mirrors the real surfaces — the add-on's settings, the dashboard's
 * connection status, the API's actual request and response shapes.
 *
 * SSR-safe: animated windows start on a fixed first frame and only move in
 * effects (see the showcase kit), and computed positions are rounded so the
 * server and client write identical style strings.
 */
import { useState, type CSSProperties } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  Braces,
  Check,
  CheckCircle2,
  ChevronDown,
  Copy,
  KeyRound,
  Loader2,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Mark } from "@/components/brand/Mark";
import { IntegrationLogo } from "@/components/dashboard/integration-logos";
import {
  Chip,
  Label,
  LiveDot,
  ProductWindow,
  useCycle,
  useInView,
} from "@/components/features/showcase/kit";
import { useCopied } from "@/components/tools/shared";
import {
  INTEGRATIONS,
  KIND_LABEL,
  isAddon,
  type FieldMapping,
  type Integration,
} from "@/data/integrations";

/** The origin every snippet calls. Production, whichever environment renders it. */
export const API_ROOT = "https://rankbox.xyz/api/public/v1";
export const MCP_URL = "https://rankbox.xyz/mcp";

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/* ---------- Tiles ---------- */

/**
 * An integration's tile: the platform's own logo, or for the API and the MCP
 * server a tile of the same shape. Decorative wherever the name sits beside it.
 */
export function IntegrationGlyph({
  integration,
  className,
}: {
  integration: Pick<Integration, "platform" | "kind" | "name">;
  className?: string;
}) {
  if (integration.platform) {
    return <IntegrationLogo id={integration.platform} title={false} className={className} />;
  }
  const api = integration.kind === "api";
  const Icon = api ? Braces : Sparkles;
  return (
    <span
      role="img"
      aria-label={integration.name}
      className={cn(
        "grid h-5 w-5 shrink-0 place-items-center rounded-[25%] ring-1",
        api ? "bg-ink text-white ring-black/5" : "bg-white text-brand-blue ring-black/10",
        className,
      )}
    >
      <Icon className="h-[52%] w-[52%]" strokeWidth={2.3} />
    </span>
  );
}

/** The Rankbox mark on a tile the same shape as the platform logos. */
export function RankboxTile({
  className,
  tone = "light",
}: {
  className?: string;
  /** light: white tile, blue mark (on the blue hero). brand: the reverse. */
  tone?: "light" | "brand";
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "grid shrink-0 place-items-center rounded-[25%]",
        tone === "light"
          ? "bg-white text-brand-blue ring-1 ring-black/5"
          : "bg-brand-blue text-white",
        className,
      )}
    >
      <Mark className="h-[56%] w-[56%]" />
    </span>
  );
}

/** Dashed line with an article travelling along it, left to right. */
function Connector({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 56 12"
      width="56"
      height="12"
      aria-hidden
      className={cn("shrink-0", className)}
    >
      <line
        x1="4"
        y1="6"
        x2="52"
        y2="6"
        stroke="currentColor"
        strokeOpacity="0.4"
        strokeWidth="1.5"
        strokeDasharray="2 4"
      />
      <line
        x1="4"
        y1="6"
        x2="52"
        y2="6"
        pathLength={100}
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
        className="animate-packet"
      />
    </svg>
  );
}

/** Rankbox → platform: the integration pages' signature lockup. */
export function ConnectionLockup({
  integration,
  className,
}: {
  integration: Integration;
  className?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-1 text-white", className)}>
      <RankboxTile className="h-11 w-11 shadow-elevation-lg" />
      <Connector />
      <span aria-hidden className="rounded-[25%] shadow-elevation-lg">
        <IntegrationGlyph integration={integration} className="h-11 w-11 ring-white/30" />
      </span>
    </span>
  );
}

/* ---------- Hub hero: Rankbox at the centre, every integration around it ---------- */

const ORBIT_R = 38;

const ORBIT = INTEGRATIONS.map((integration, i) => {
  const angle = ((-90 + (360 / INTEGRATIONS.length) * i) * Math.PI) / 180;
  return {
    integration,
    x: Number((50 + ORBIT_R * Math.cos(angle)).toFixed(2)),
    y: Number((50 + ORBIT_R * Math.sin(angle)).toFixed(2)),
  };
});

export function Orbit({ className }: { className?: string }) {
  return (
    <div className={cn("relative mx-auto aspect-square w-full max-w-[27rem]", className)}>
      <svg viewBox="0 0 100 100" aria-hidden className="absolute inset-0 h-full w-full">
        <circle
          cx="50"
          cy="50"
          r={ORBIT_R}
          fill="none"
          stroke="white"
          strokeOpacity="0.16"
          strokeWidth="0.3"
          strokeDasharray="0.6 1.4"
        />
        <circle
          cx="50"
          cy="50"
          r="22"
          fill="none"
          stroke="white"
          strokeOpacity="0.1"
          strokeWidth="0.3"
        />
        {ORBIT.map(({ integration, x, y }) => (
          <line
            key={integration.slug}
            x1="50"
            y1="50"
            x2={x}
            y2={y}
            stroke="white"
            strokeOpacity="0.22"
            strokeWidth="0.3"
          />
        ))}
        {ORBIT.map(({ integration, x, y }, i) => (
          <line
            key={`${integration.slug}-packet`}
            x1="50"
            y1="50"
            x2={x}
            y2={y}
            pathLength={100}
            stroke="white"
            strokeWidth="1.1"
            strokeLinecap="round"
            className="animate-packet"
            style={
              {
                "--packet-delay": `${((i * 0.41) % 2.8).toFixed(2)}s`,
                "--packet-duration": "2.8s",
              } as CSSProperties
            }
          />
        ))}
      </svg>

      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <RankboxTile className="h-20 w-20 shadow-elevation-lg ring-8 ring-white/10 sm:h-24 sm:w-24" />
      </div>

      {ORBIT.map(({ integration, x, y }) => (
        <Link
          key={integration.slug}
          to="/integrations/$slug"
          params={{ slug: integration.slug }}
          aria-label={`Rankbox for ${integration.name}`}
          style={{ left: `${x}%`, top: `${y}%` }}
          className="group absolute -translate-x-1/2 -translate-y-1/2 rounded-[30%] focus-visible:outline-none"
        >
          <span className="block rounded-[30%] bg-white/10 p-1.5 ring-1 ring-white/25 backdrop-blur transition-transform duration-300 group-hover:scale-110 group-focus-visible:ring-2 group-focus-visible:ring-white">
            <span aria-hidden>
              <IntegrationGlyph integration={integration} className="h-10 w-10 sm:h-12 sm:w-12" />
            </span>
          </span>
          <span
            aria-hidden
            className="absolute left-1/2 top-full mt-1 -translate-x-1/2 whitespace-nowrap rounded-md bg-brand-blue px-1.5 py-0.5 text-[0.68rem] font-semibold text-white/80 transition-colors group-hover:text-white"
          >
            {integration.name}
          </span>
        </Link>
      ))}
    </div>
  );
}

/* ---------- Hero windows ---------- */

/** A platform add-on at work: its connection, then an article arriving. */
function SyncWindow({ integration, className }: { integration: Integration; className?: string }) {
  const [ref, inView] = useInView<HTMLDivElement>();
  // 0 checking → 1 syncing → 2 arrived. Reduced motion rests on "arrived".
  const stage = useCycle(3, 1700, 2, inView);
  const { sample } = integration;
  const [fresh, ...older] = sample.titles;
  const arrived = sample.status ?? "Published";
  const url = `${sample.domain}${sample.path}${slugify(fresh)}`;

  return (
    <div ref={ref} className={cn("flex flex-col", className)}>
      <ProductWindow title={`${integration.name} · ${sample.location}`} className="flex-1">
        <div className="flex flex-1 flex-col gap-4 p-5">
          <div className="flex items-center gap-3 rounded-xl border border-border bg-surface px-3.5 py-3">
            <RankboxTile tone="brand" className="h-9 w-9" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-ink">
                Rankbox {KIND_LABEL[integration.kind].toLowerCase()}
              </p>
              <p className="truncate text-xs text-muted-foreground">Connected to {sample.brand}</p>
            </div>
            <span className="flex items-center gap-1.5 text-[0.7rem] font-semibold text-success">
              <LiveDot /> Live
            </span>
          </div>

          <div className="space-y-1.5">
            <Label right={`${sample.titles.length} from Rankbox`}>{sample.location}</Label>

            {/* The newest article. Its row keeps its height through every stage. */}
            <div
              className={cn(
                "flex min-h-[3.25rem] items-center gap-3 rounded-lg border bg-card px-3 py-2 transition-all duration-300",
                stage === 0
                  ? "border-dashed border-border"
                  : "border-volt/40 shadow-sm ring-1 ring-volt/20",
              )}
            >
              {stage === 0 ? (
                <span className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Loader2 className="h-3.5 w-3.5 animate-spin motion-reduce:animate-none" />
                  Checking Rankbox for new articles…
                </span>
              ) : (
                <>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[0.8rem] font-semibold text-ink">
                      {fresh}
                    </span>
                    <span className="block truncate font-mono text-[0.62rem] text-muted-foreground">
                      {sample.path}
                      {slugify(fresh)}
                    </span>
                  </span>
                  <Chip tone={stage === 1 ? "volt" : "success"} dot>
                    {stage === 1 ? "Syncing" : arrived}
                  </Chip>
                </>
              )}
            </div>

            {older.map((title) => (
              <div
                key={title}
                className="flex items-center gap-3 rounded-lg border border-border bg-card px-3 py-2"
              >
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[0.8rem] font-medium text-ink">{title}</span>
                  <span className="block truncate font-mono text-[0.62rem] text-muted-foreground">
                    {sample.path}
                    {slugify(title)}
                  </span>
                </span>
                <Chip tone="success">{arrived}</Chip>
              </div>
            ))}
          </div>

          <div
            aria-hidden={stage !== 2}
            className={cn(
              "mt-auto flex items-center gap-3 rounded-lg border border-success/30 bg-success/10 px-3 py-2.5 transition-all duration-500",
              stage === 2 ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0",
            )}
          >
            <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />
            <span className="min-w-0 truncate text-xs text-ink">
              <span className="font-semibold">Live URL reported to Rankbox</span>{" "}
              <span className="text-muted-foreground">{url}</span>
            </span>
          </div>
        </div>
      </ProductWindow>
    </div>
  );
}

/** The API's real request and response, trimmed to one article. */
function ApiWindow({ className }: { className?: string }) {
  const title = "How to Run a Sprint Without Chaos";
  const str = (s: string) => <span className="text-sky-300">&quot;{s}&quot;</span>;
  return (
    <div
      className={cn(
        "flex flex-col overflow-hidden rounded-xl border border-white/10 bg-hero-black text-white/85 shadow-elevation-lg",
        className,
      )}
    >
      <div className="flex items-center gap-2 border-b border-white/10 px-4 py-2.5">
        <span className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <span key={i} className="h-2.5 w-2.5 rounded-full bg-white/15" />
          ))}
        </span>
        <span className="ml-2 truncate font-mono text-[0.7rem] text-white/60">
          <span className="mr-1.5 rounded bg-success/25 px-1.5 py-0.5 font-semibold text-emerald-300">
            GET
          </span>
          /api/public/v1/articles?since=…
        </span>
        <span className="ml-auto rounded-full border border-white/15 px-2 py-0.5 text-[0.58rem] font-semibold uppercase tracking-[0.1em] text-white/50">
          Sample
        </span>
      </div>
      <pre className="flex-1 overflow-x-auto px-4 py-4 font-mono text-[0.72rem] leading-relaxed">
        <code>
          <span className="text-white/45">Authorization: Bearer rv_live_••••••••</span>
          {"\n\n"}
          <span className="text-emerald-300">200 OK</span>
          {"\n{\n"}
          {'  "articles": [{\n'}
          {'    "id": '}
          {str("8f14e45f-…")}
          {",\n"}
          {'    "slug": '}
          {str(slugify(title))}
          {",\n"}
          {'    "title": '}
          {str(title)}
          {",\n"}
          {'    "description": '}
          {str("A sprint plan that survives Monday…")}
          {",\n"}
          {'    "body_html": '}
          {str("<h2>Plan the sprint in…")}
          {",\n"}
          {'    "body_markdown": '}
          {str("## Plan the sprint in…")}
          {",\n"}
          {'    "tags": ['}
          {str("sprints")}
          {", "}
          {str("agile")}
          {"],\n"}
          {'    "seo_score": '}
          <span className="text-amber-300">94</span>
          {",\n"}
          {'    "published_url": '}
          <span className="text-violet-300">null</span>
          {"\n  }],\n"}
          {'  "count": '}
          <span className="text-amber-300">1</span>
          {",\n"}
          {'  "next_since": '}
          {str("2026-09-21T09:00:12Z")}
          {"\n}"}
        </code>
      </pre>
    </div>
  );
}

const BRIEF_OUTLINE = [
  "What Kanban and Scrum each optimise for",
  "Roles, rituals, and the work in between",
  "Which fits a team that ships continuously",
  "How to switch without losing a sprint",
];

/** An assistant calling the Rankbox MCP server for a brief. */
function McpWindow({ className }: { className?: string }) {
  const [ref, inView] = useInView<HTMLDivElement>();
  // 0 asked → 1 tool running → 2 brief back.
  const stage = useCycle(3, 1800, 2, inView);
  return (
    <div ref={ref} className={cn("flex flex-col", className)}>
      <ProductWindow title="Assistant · Rankbox connector" className="flex-1">
        <div className="flex flex-1 flex-col gap-3.5 p-5">
          <p className="ml-auto max-w-[85%] rounded-2xl rounded-br-md bg-secondary px-3.5 py-2.5 text-[0.8rem] text-ink">
            Build me a content brief for &ldquo;kanban vs scrum&rdquo;.
          </p>

          <div className="flex items-center gap-2.5 rounded-lg border border-border bg-surface px-3 py-2">
            <RankboxTile tone="brand" className="h-6 w-6" />
            <span className="min-w-0 flex-1 truncate text-xs text-ink">
              <span className="font-semibold">Rankbox</span>{" "}
              <span className="text-muted-foreground">· Generate SEO content brief</span>
            </span>
            <Chip tone={stage === 0 ? "volt" : "success"} dot>
              {stage === 0 ? "Running" : "Done"}
            </Chip>
          </div>

          <div
            aria-hidden={stage !== 2}
            className={cn(
              "flex-1 rounded-xl border border-border bg-card p-4 transition-all duration-500",
              stage === 2 ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0",
            )}
          >
            <Label>Working title</Label>
            <p className="mt-1.5 text-sm font-semibold text-ink">
              Kanban vs Scrum: Which Should Your Team Pick?
            </p>
            <Label className="mt-4">Outline</Label>
            <ol className="mt-1.5 space-y-1.5">
              {BRIEF_OUTLINE.map((h, i) => (
                <li key={h} className="flex gap-2 text-[0.78rem] text-ink">
                  <span className="font-mono text-[0.65rem] leading-5 text-volt">H2</span>
                  <span className="sr-only">{i + 1}.</span>
                  {h}
                </li>
              ))}
            </ol>
            <Label className="mt-4">Entities to mention</Label>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {["WIP limits", "Sprint review", "Cycle time", "Backlog"].map((e) => (
                <Chip key={e}>{e}</Chip>
              ))}
            </div>
          </div>
        </div>
      </ProductWindow>
    </div>
  );
}

/** The hero's right-hand window, by kind. */
export function HeroVisual({
  integration,
  className,
}: {
  integration: Integration;
  className?: string;
}) {
  if (integration.kind === "api") return <ApiWindow className={className} />;
  if (integration.kind === "mcp") return <McpWindow className={className} />;
  return <SyncWindow integration={integration} className={className} />;
}

/* ---------- Setup visuals ---------- */

/** The add-on's settings screen: the key, checked, then where articles go. */
function SettingsPanel({ integration }: { integration: Integration }) {
  return (
    <ProductWindow title={`${integration.name} · Rankbox settings`}>
      <div className="space-y-5 p-5">
        <div>
          <p className="mb-1.5 text-xs font-medium text-muted-foreground">Rankbox key</p>
          <div className="flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2.5">
            <KeyRound className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
            <span className="truncate font-mono text-xs text-ink">
              rv_live_a1b2c3••••••••••••••••
            </span>
          </div>
          <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-success">
            <CheckCircle2 className="h-3.5 w-3.5" /> Connected to {integration.sample.brand}
          </p>
        </div>

        <div className="divide-y divide-border rounded-xl border border-border">
          {integration.settings?.map((s) => (
            <div key={s.label} className="flex items-center justify-between gap-4 px-3.5 py-3">
              <span className="text-xs font-medium text-muted-foreground">{s.label}</span>
              {s.options && s.options.length > 1 ? (
                <span className="flex gap-1 rounded-lg bg-secondary p-0.5">
                  {s.options.map((o) => (
                    <span
                      key={o}
                      className={cn(
                        "rounded-md px-2.5 py-1 text-[0.7rem] font-semibold",
                        o === s.value ? "bg-card text-ink shadow-1" : "text-muted-foreground",
                      )}
                    >
                      {o}
                    </span>
                  ))}
                </span>
              ) : (
                <span className="flex min-w-0 items-center gap-2 rounded-lg border border-border bg-card px-2.5 py-1 text-xs font-medium text-ink">
                  <span className="truncate">{s.value}</span>
                  <ChevronDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                </span>
              )}
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between gap-3">
          <p className="text-[0.7rem] text-muted-foreground">Only finished articles are sent.</p>
          <span className="rounded-lg bg-ink px-3.5 py-1.5 text-xs font-semibold text-background">
            Save
          </span>
        </div>
      </div>
    </ProductWindow>
  );
}

/** Code on the dark field, one tab per snippet, with a working copy button. */
function CodeTabs({ tabs }: { tabs: { id: string; label: string; code: string }[] }) {
  const [active, setActive] = useState(tabs[0].id);
  const [copied, copy] = useCopied();
  const tab = tabs.find((t) => t.id === active) ?? tabs[0];
  return (
    <div className="overflow-hidden rounded-xl border border-border shadow-elevation-lg">
      <div className="flex items-center justify-between gap-3 border-b border-white/10 bg-hero-black px-3 py-2">
        <div className="flex gap-1 overflow-x-auto" role="tablist" aria-label="Code sample">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={t.id === active}
              onClick={() => setActive(t.id)}
              className={cn(
                "whitespace-nowrap rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                t.id === active ? "bg-white/15 text-white" : "text-white/55 hover:text-white",
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => copy(tab.id, tab.code)}
          className="flex shrink-0 items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white"
        >
          {copied === tab.id ? (
            <Check className="h-3.5 w-3.5 text-emerald-300" strokeWidth={3} />
          ) : (
            <Copy className="h-3.5 w-3.5" />
          )}
          <span aria-live="polite">{copied === tab.id ? "Copied" : "Copy"}</span>
        </button>
      </div>
      <pre
        role="tabpanel"
        className="min-h-[12.5rem] overflow-x-auto bg-hero-black p-4 font-mono text-[12.5px] leading-relaxed text-white/90"
      >
        <code>{tab.code}</code>
      </pre>
    </div>
  );
}

const API_TABS = [
  {
    id: "curl",
    label: "cURL",
    code: `curl "${API_ROOT}/articles?since=2026-01-01T00:00:00Z" \\\n  -H "Authorization: Bearer $RANKBOX_KEY"`,
  },
  {
    id: "js",
    label: "JavaScript",
    code: `const res = await fetch(\n  \`${API_ROOT}/articles?since=\${lastSync}\`,\n  { headers: { Authorization: \`Bearer \${process.env.RANKBOX_KEY}\` } },\n);\nconst { articles, next_since } = await res.json();\n// Save next_since and send it as ?since= next time.`,
  },
  {
    id: "report",
    label: "Report live URL",
    code: `await fetch(\`${API_ROOT}/articles/\${article.id}\`, {\n  method: "PATCH",\n  headers: {\n    Authorization: \`Bearer \${process.env.RANKBOX_KEY}\`,\n    "Content-Type": "application/json",\n  },\n  body: JSON.stringify({\n    published_url: \`https://plannora.io/blog/\${article.slug}\`,\n  }),\n});`,
  },
];

const ENDPOINTS = [
  { method: "GET", path: "/ping", what: "Checks a key and returns your brand name" },
  { method: "GET", path: "/articles", what: "Finished articles, oldest change first" },
  { method: "GET", path: "/articles/{id}", what: "One finished article" },
  { method: "PATCH", path: "/articles/{id}", what: "Report where it went live" },
];

function ApiSetupPanel() {
  return (
    <div className="space-y-4">
      <CodeTabs tabs={API_TABS} />
      <ul className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-card">
        {ENDPOINTS.map((e) => (
          <li
            key={`${e.method} ${e.path}`}
            className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-center sm:gap-4"
          >
            <span className="shrink-0 font-mono text-xs text-ink sm:w-44">
              <span
                className={cn(
                  "mr-2 rounded-sm px-1.5 py-0.5 font-semibold",
                  e.method === "GET" ? "bg-success/10 text-success" : "bg-volt/10 text-volt",
                )}
              >
                {e.method}
              </span>
              {e.path}
            </span>
            <span className="text-sm text-muted-foreground">{e.what}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** The assistant's "add a connector" dialog, with the real URL to copy. */
function ConnectorPanel() {
  const [copied, copy] = useCopied();
  return (
    <ProductWindow title="Add custom connector">
      <div className="space-y-4 p-5">
        <div>
          <p className="mb-1.5 text-xs font-medium text-muted-foreground">Name</p>
          <div className="rounded-lg border border-border bg-surface px-3 py-2.5 text-xs font-medium text-ink">
            Rankbox
          </div>
        </div>
        <div>
          <p className="mb-1.5 text-xs font-medium text-muted-foreground">Remote MCP server URL</p>
          <div className="flex items-stretch gap-2">
            <code className="min-w-0 flex-1 truncate rounded-lg border border-brand-blue/40 bg-brand-blue/5 px-3 py-2.5 font-mono text-xs text-ink">
              {MCP_URL}
            </code>
            <button
              type="button"
              onClick={() => copy("url", MCP_URL)}
              className="flex shrink-0 items-center gap-1.5 rounded-lg bg-brand-blue px-3 text-xs font-semibold text-white transition-colors hover:bg-brand-blue/85"
            >
              {copied ? (
                <Check className="h-3.5 w-3.5" strokeWidth={3} />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
              <span aria-live="polite">{copied ? "Copied" : "Copy"}</span>
            </button>
          </div>
        </div>
        <div className="flex items-center justify-between gap-3 border-t border-border pt-4">
          <p className="text-[0.7rem] text-muted-foreground">Claude · ChatGPT · Cursor</p>
          <span className="rounded-lg bg-ink px-3.5 py-1.5 text-xs font-semibold text-background">
            Add
          </span>
        </div>
      </div>
    </ProductWindow>
  );
}

/** The setup section's visual, by kind. */
export function SetupVisual({ integration }: { integration: Integration }) {
  if (integration.kind === "api") return <ApiSetupPanel />;
  if (integration.kind === "mcp") return <ConnectorPanel />;
  return <SettingsPanel integration={integration} />;
}

/* ---------- Field map ---------- */

export function FieldMap({ integration }: { integration: Integration }) {
  const reference = integration.kind === "api" || integration.kind === "mcp";
  const heads =
    integration.kind === "api"
      ? ["Field", "What it holds"]
      : integration.kind === "mcp"
        ? ["Tool", "What you get back"]
        : ["In Rankbox", `In ${integration.name}`];

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-elevation">
      <div className="grid grid-cols-[minmax(0,0.8fr)_1.5rem_minmax(0,1.2fr)] items-center gap-3 border-b border-border bg-surface/70 px-5 py-3 text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground sm:px-6">
        <span>{heads[0]}</span>
        <span aria-hidden />
        <span>{heads[1]}</span>
      </div>
      <ul className="divide-y divide-border">
        {integration.fields.rows.map((row) => (
          <FieldRow
            key={row.from}
            row={row}
            mono={integration.kind === "api"}
            reference={reference}
          />
        ))}
      </ul>
    </div>
  );
}

function FieldRow({
  row,
  mono,
  reference,
}: {
  row: FieldMapping;
  mono: boolean;
  reference: boolean;
}) {
  const Arrow = row.back ? ArrowLeft : ArrowRight;
  return (
    <li
      className={cn(
        "grid grid-cols-[minmax(0,0.8fr)_1.5rem_minmax(0,1.2fr)] items-center gap-3 px-5 py-3.5 sm:px-6",
        row.back && "bg-volt/[0.04]",
      )}
    >
      <span
        className={cn(
          "min-w-0 break-words text-sm font-semibold text-ink",
          mono && "font-mono text-[0.8rem] font-medium",
        )}
      >
        {row.from}
      </span>
      <Arrow
        aria-label={row.back ? "reported back from" : reference ? "holds" : "lands in"}
        className={cn("h-4 w-4", row.back ? "text-volt" : "text-muted-foreground/60")}
      />
      <span className={cn("text-sm", row.back ? "font-medium text-volt" : "text-muted-foreground")}>
        {row.to}
      </span>
    </li>
  );
}

/* ---------- Connection status (the dashboard's, as a sample) ---------- */

export function StatusSample({ integration }: { integration?: Integration }) {
  const site = integration && isAddon(integration) ? integration : undefined;
  const brand = integration?.sample.brand ?? "Plannora";
  const name = site ? `${brand} · ${site.name}` : `${brand} · API`;
  return (
    <ProductWindow title="Rankbox · Integrations">
      <div className="flex items-start gap-3.5 px-5 py-4">
        <span className="relative mt-[5px] flex h-2.5 w-2.5 shrink-0" aria-hidden>
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-50 motion-reduce:animate-none" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-success" />
        </span>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-ink">Your site is connected</p>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Last synced 4 min ago. Every published article has reached it.
          </p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-px border-y border-border bg-border">
        {[
          ["Last sync", "4 min ago", ""],
          ["Delivered", "28 of 28", "published"],
          ["On the way", "0", "all caught up"],
        ].map(([label, value, hint]) => (
          <div key={label} className="bg-card px-4 py-3 sm:px-5">
            <p className="text-[0.7rem] text-muted-foreground">{label}</p>
            <p className="mt-1 text-sm font-semibold tabular-nums text-ink sm:text-base">{value}</p>
            {hint && <p className="text-[0.65rem] text-muted-foreground">{hint}</p>}
          </div>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 px-5 py-4">
        <span aria-hidden>
          {site ? (
            <IntegrationGlyph integration={site} className="h-9 w-9" />
          ) : (
            <IntegrationGlyph integration={{ kind: "api", name: "API" }} className="h-9 w-9" />
          )}
        </span>
        <div className="min-w-0 flex-1 basis-40">
          <div className="flex items-center gap-2">
            <p className="truncate text-sm font-medium text-ink">{name}</p>
            <Chip tone="success">Live</Chip>
          </div>
          <p className="mt-0.5 truncate font-mono text-[0.7rem] text-muted-foreground">
            rv_live_a1b2c3…
          </p>
        </div>
        <div className="text-right text-xs">
          <p className="text-ink">Synced 4 min ago</p>
          <p className="text-muted-foreground">Up to date</p>
        </div>
      </div>
    </ProductWindow>
  );
}
