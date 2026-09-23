import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { toast } from "sonner";
import { ArrowUpRight, ChevronRight, Search, X } from "lucide-react";
import {
  CATEGORIES,
  CONNECTORS,
  CONNECTORS_CHECKED,
  MCP_URL,
  searchConnectors,
  unsupportedMatch,
  type Connector,
  type ConnectorCategory,
  type Snippet,
  type Step,
} from "@/data/connectors";
import { Button, Pill } from "@/components/dashboard/primitives";
import { CheckIcon } from "@/components/dashboard/icons";
import { ConnectorLogo } from "@/components/dashboard/connector-logo";
import { formatShortDate } from "@/lib/format-date";
import { cn } from "@/lib/utils";

/* ── Copy ───────────────────────────────────────────────────────── */

export function useCopy() {
  const [copied, setCopied] = useState(false);
  async function copy(value: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      toast.error("Couldn't copy to the clipboard.");
    }
  }
  return { copied, copy };
}

export function CopyField({ value }: { value: string }) {
  const { copied, copy } = useCopy();
  return (
    <div className="flex items-stretch gap-2">
      <code className="min-w-0 flex-1 truncate rounded-lg border border-border bg-secondary px-3 py-2 font-mono text-xs text-ink">
        {value}
      </code>
      <Button variant="ghost" onClick={() => void copy(value)} className="w-[4.5rem] shrink-0">
        {copied ? <CheckIcon className="h-4 w-4 text-success" /> : "Copy"}
      </Button>
    </div>
  );
}

/** A command or config file: dark, monospaced, with its file name and a copy button. */
function CodeBlock({ snippet }: { snippet: Snippet }) {
  const { copied, copy } = useCopy();
  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <div className="flex items-center justify-between gap-3 border-b border-white/10 bg-hero-black px-3 py-1.5">
        <span className="truncate font-mono text-[11px] text-white/55">
          {snippet.file ?? (snippet.kind === "command" ? "Terminal" : "Config")}
        </span>
        <button
          type="button"
          onClick={() => void copy(snippet.value)}
          className="shrink-0 rounded-md px-2 py-0.5 text-xs font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="overflow-x-auto bg-hero-black px-3.5 py-3 font-mono text-[12px] leading-relaxed text-white/90">
        <code>
          {snippet.kind === "command" && <span className="select-none text-white/40">$ </span>}
          {snippet.value}
        </code>
      </pre>
    </div>
  );
}

export function StepSnippet({ snippet }: { snippet: Snippet }) {
  return snippet.kind === "url" ? (
    <CopyField value={snippet.value} />
  ) : (
    <CodeBlock snippet={snippet} />
  );
}

/* ── Library ────────────────────────────────────────────────────── */

export type TileStatus = { tone: "success" | "warning" | "neutral"; label: string } | null;

const KIND_LABEL: Record<Connector["kind"], string> = {
  site: "Publishing",
  api: "API",
  mcp: "MCP",
};

type Filter = ConnectorCategory | "all";

/** Named AI tools, not counting the catch-all "Any MCP client". */
const AI_TOOL_COUNT = CONNECTORS.filter((c) => c.kind === "mcp" && c.id !== "any-mcp").length;

/**
 * Every connector in one searchable grid. With no search and no filter it
 * leads with the popular ones, then lists each category; a search or a
 * filter flattens it into one ranked grid.
 */
export function ConnectorLibrary({
  category,
  onCategory,
  statusFor,
  onOpen,
}: {
  category: Filter;
  onCategory: (c: Filter) => void;
  statusFor: (c: Connector) => TileStatus;
  onOpen: (c: Connector) => void;
}) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // "/" jumps to search from anywhere on the page, as in most libraries.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key !== "/" || e.metaKey || e.ctrlKey || e.altKey) return;
      const t = e.target as HTMLElement | null;
      if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
      e.preventDefault();
      inputRef.current?.focus();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const matches = useMemo(() => searchConnectors(query), [query]);
  const counts = useMemo(() => {
    const out = new Map<Filter, number>([["all", matches.length]]);
    for (const c of matches) out.set(c.category, (out.get(c.category) ?? 0) + 1);
    return out;
  }, [matches]);
  const results = category === "all" ? matches : matches.filter((c) => c.category === category);
  const browsing = !query.trim() && category === "all";
  const unsupported = unsupportedMatch(query);

  return (
    <section aria-labelledby="library-title" className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 id="library-title" className="text-base font-semibold tracking-tight text-ink">
            Connector library
          </h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Publish to your site, or add Rankbox's research to {AI_TOOL_COUNT} AI tools.
          </p>
        </div>
        <label className="relative block w-full sm:w-80">
          <span className="sr-only">Search connectors</span>
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Escape" && setQuery("")}
            placeholder="Search Lovable, Cursor, WordPress…"
            autoComplete="off"
            spellCheck={false}
            className="h-10 w-full rounded-lg border border-border bg-card pl-9 pr-9 text-sm text-ink shadow-1 outline-none transition-shadow placeholder:text-muted-foreground/80 focus:border-cta/50 focus:ring-4 focus:ring-cta/10 [&::-webkit-search-cancel-button]:hidden"
          />
          {query ? (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                inputRef.current?.focus();
              }}
              className="absolute right-2 top-1/2 grid h-6 w-6 -translate-y-1/2 place-items-center rounded-md text-muted-foreground hover:bg-secondary hover:text-ink"
              aria-label="Clear search"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          ) : (
            <kbd
              aria-hidden
              className="pointer-events-none absolute right-2.5 top-1/2 hidden -translate-y-1/2 rounded border border-border bg-secondary px-1.5 font-mono text-[10px] text-muted-foreground sm:block"
            >
              /
            </kbd>
          )}
        </label>
      </div>

      <div
        role="tablist"
        aria-label="Categories"
        className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {([{ id: "all", label: "All" }, ...CATEGORIES] as { id: Filter; label: string }[]).map(
          (cat) => {
            const active = category === cat.id;
            const n = counts.get(cat.id) ?? 0;
            return (
              <button
                key={cat.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => onCategory(cat.id)}
                className={cn(
                  "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  active
                    ? "border-cta bg-cta text-white"
                    : "border-border bg-card text-muted-foreground hover:border-ink/15 hover:text-ink",
                  !active && n === 0 && "opacity-50",
                )}
              >
                {cat.label}
                <span
                  className={cn(
                    "tabular-nums",
                    active ? "text-white/75" : "text-muted-foreground/70",
                  )}
                >
                  {n}
                </span>
              </button>
            );
          },
        )}
      </div>

      <p className="sr-only" role="status">
        {results.length} {results.length === 1 ? "connector" : "connectors"}
      </p>

      {unsupported && (
        <div className="rounded-card border border-warning/30 bg-warning/5 px-4 py-3 text-sm">
          <p className="font-medium text-ink">{unsupported.name} can't connect yet</p>
          <p className="mt-0.5 text-muted-foreground">{unsupported.reason}</p>
        </div>
      )}

      {browsing ? (
        <div className="space-y-8">
          <TileGroup title="Popular" connectors={matches.filter((c) => c.popular)}>
            {(c) => <Tile key={c.id} c={c} status={statusFor(c)} onOpen={onOpen} />}
          </TileGroup>
          {CATEGORIES.map((cat) => (
            <TileGroup
              key={cat.id}
              title={cat.label}
              blurb={cat.blurb}
              connectors={matches.filter((c) => c.category === cat.id)}
            >
              {(c) => <Tile key={c.id} c={c} status={statusFor(c)} onOpen={onOpen} />}
            </TileGroup>
          ))}
        </div>
      ) : results.length > 0 ? (
        <Grid>
          {results.map((c) => (
            <Tile key={c.id} c={c} status={statusFor(c)} onOpen={onOpen} />
          ))}
        </Grid>
      ) : unsupported ? (
        <TileGroup
          title="These AI app builders work with Rankbox"
          connectors={CONNECTORS.filter((c) => c.category === "builder" && c.popular)}
        >
          {(c) => <Tile key={c.id} c={c} status={statusFor(c)} onOpen={onOpen} />}
        </TileGroup>
      ) : (
        <NoMatch
          query={query}
          onAnyClient={() => {
            const any = CONNECTORS.find((c) => c.id === "any-mcp");
            if (any) onOpen(any);
          }}
        />
      )}
    </section>
  );
}

function Grid({ children }: { children: ReactNode }) {
  return <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">{children}</div>;
}

function TileGroup({
  title,
  blurb,
  connectors,
  children,
}: {
  title: string;
  blurb?: string;
  connectors: Connector[];
  children: (c: Connector) => ReactNode;
}) {
  if (!connectors.length) return null;
  return (
    <div className="space-y-3">
      <div className="flex items-baseline gap-2">
        <h3 className="text-sm font-semibold text-ink">{title}</h3>
        {blurb && <p className="text-xs text-muted-foreground">{blurb}</p>}
      </div>
      <Grid>{connectors.map(children)}</Grid>
    </div>
  );
}

function Tile({
  c,
  status,
  onOpen,
}: {
  c: Connector;
  status: TileStatus;
  onOpen: (c: Connector) => void;
}) {
  return (
    <button
      type="button"
      aria-haspopup="dialog"
      onClick={() => onOpen(c)}
      className="group flex items-start gap-3.5 rounded-card border border-border bg-card p-4 text-left transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-px hover:border-cta/35 hover:shadow-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:hover:translate-y-0"
    >
      <ConnectorLogo connector={c} className="h-11 w-11" />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate text-sm font-semibold text-ink">{c.name}</p>
          {status && (
            <Pill tone={status.tone} className="shrink-0 px-1.5 py-0 text-[10px]">
              {status.label}
            </Pill>
          )}
        </div>
        <p className="mt-0.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground/80">
          {KIND_LABEL[c.kind]}
          {c.maker !== c.name && c.maker !== "Rankbox" && ` · ${c.maker}`}
        </p>
        <p className="mt-1.5 line-clamp-2 text-sm leading-snug text-muted-foreground">
          {c.tagline}
        </p>
      </div>
      <ChevronRight
        aria-hidden
        className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground/40 transition-[color,transform] group-hover:translate-x-0.5 group-hover:text-cta motion-reduce:group-hover:translate-x-0"
      />
    </button>
  );
}

function NoMatch({ query, onAnyClient }: { query: string; onAnyClient: () => void }) {
  return (
    <div className="rounded-card border border-dashed border-border bg-card px-5 py-8 text-center sm:px-8">
      <p className="text-sm font-semibold text-ink">No connector matches “{query.trim()}”</p>
      <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
        If it can add a remote MCP server by URL, it works with Rankbox. Paste this in its MCP or
        connector settings:
      </p>
      <div className="mx-auto mt-4 max-w-sm text-left">
        <CopyField value={MCP_URL} />
      </div>
      <Button variant="ghost" className="mt-3" onClick={onAnyClient}>
        Setup for any MCP client
      </Button>
    </div>
  );
}

/* ── Overlay ────────────────────────────────────────────────────── */

/**
 * One connector's overlay: a bottom sheet on phones, a centered panel from
 * `sm` up. The header and footer stay put while the steps scroll.
 */
export function ConnectorSheet({
  connector,
  open,
  onOpenChange,
  status,
  wide,
  footer,
  children,
}: {
  connector: Connector | undefined;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  status?: TileStatus;
  /** Room for code samples and the key flow. */
  wide?: boolean;
  footer?: ReactNode;
  children: ReactNode;
}) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-ink/40 backdrop-blur-[2px] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content
          aria-describedby={connector ? "connector-tagline" : undefined}
          onOpenAutoFocus={(e) => {
            e.preventDefault();
            (e.currentTarget as HTMLElement | null)?.focus();
          }}
          className={cn(
            "fixed inset-x-0 bottom-0 z-50 flex max-h-[92dvh] flex-col overflow-hidden rounded-t-2xl border border-border bg-background shadow-elevation-lg outline-none",
            "sm:inset-x-auto sm:bottom-auto sm:left-1/2 sm:top-1/2 sm:max-h-[min(88dvh,52rem)] sm:w-[calc(100vw-2rem)] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-2xl",
            wide ? "sm:max-w-2xl" : "sm:max-w-xl",
            "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-bottom-6 sm:data-[state=open]:slide-in-from-bottom-2 sm:data-[state=open]:zoom-in-[0.98] motion-reduce:animate-none",
          )}
        >
          {connector && (
            <>
              <div className="flex items-start gap-4 border-b border-border px-5 pb-4 pt-5 sm:px-6">
                {/* The grab handle says "swipe me" on phones. */}
                <span
                  aria-hidden
                  className="absolute left-1/2 top-2 h-1 w-9 -translate-x-1/2 rounded-full bg-border sm:hidden"
                />
                <ConnectorLogo connector={connector} className="h-12 w-12" />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <DialogPrimitive.Title className="text-lg font-semibold tracking-tight text-ink">
                      {connector.name}
                    </DialogPrimitive.Title>
                    {status && <Pill tone={status.tone}>{status.label}</Pill>}
                  </div>
                  <DialogPrimitive.Description
                    id="connector-tagline"
                    className="mt-0.5 text-sm text-muted-foreground"
                  >
                    {connector.tagline}
                  </DialogPrimitive.Description>
                </div>
                <DialogPrimitive.Close
                  className="-mr-1.5 -mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  aria-label="Close"
                >
                  <X className="h-4 w-4" />
                </DialogPrimitive.Close>
              </div>
              <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-5 sm:px-6">
                {children}
              </div>
              {footer && (
                <div className="flex flex-col-reverse gap-3 border-t border-border bg-card px-5 py-3.5 pb-[max(0.875rem,env(safe-area-inset-bottom))] sm:flex-row sm:items-center sm:justify-between sm:px-6 [&>button]:w-full sm:[&>button]:w-auto">
                  {footer}
                </div>
              )}
            </>
          )}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

/* ── MCP setup ──────────────────────────────────────────────────── */

const MCP_TOOLS = [
  {
    title: "AI search questions",
    body: "What people ask ChatGPT, Perplexity, and Gemini about a topic, grouped by intent.",
  },
  {
    title: "Content briefs",
    body: "A title, H2 outline, questions to answer, and entities to mention for any keyword.",
  },
  {
    title: "Meta descriptions",
    body: "Three click-worthy options, 120–160 characters each.",
  },
];

const TRY_PROMPT = "Use Rankbox to build a content brief for “best running shoes for flat feet”.";

export function McpSetup({ connector }: { connector: Connector }) {
  const { copied, copy } = useCopy();
  return (
    <div className="space-y-6">
      <div>
        <p className="mb-2 text-xs font-medium text-muted-foreground">What you get</p>
        <ul className="grid grid-cols-1 divide-y divide-border rounded-lg border border-border bg-card sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {MCP_TOOLS.map((t) => (
            <li key={t.title} className="px-3.5 py-2.5 sm:py-3">
              <p className="text-[13px] font-semibold text-ink">{t.title}</p>
              <p className="mt-0.5 text-xs leading-snug text-muted-foreground">{t.body}</p>
            </li>
          ))}
        </ul>
      </div>

      {(connector.plan || connector.note) && (
        <div className="space-y-2">
          {connector.plan && (
            <p className="flex gap-2 text-sm text-muted-foreground">
              <span className="shrink-0 font-medium text-ink">Needs</span>
              {connector.plan}
            </p>
          )}
          {connector.note && (
            <p className="rounded-lg border border-warning/30 bg-warning/5 px-3 py-2 text-sm text-ink">
              {connector.note}
            </p>
          )}
        </div>
      )}

      <div>
        <h3 className="mb-3 text-sm font-semibold text-ink">Set it up</h3>
        <StepList steps={connector.steps} />
        {connector.alternative && (
          <div className="mt-5 space-y-2 border-t border-border pt-4">
            <p className="text-sm text-muted-foreground">{connector.alternative.text}</p>
            {connector.alternative.snippet && (
              <StepSnippet snippet={connector.alternative.snippet} />
            )}
          </div>
        )}
      </div>

      <div className="rounded-card border border-cta/20 bg-cta-soft p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-cta">Try it</p>
        <p className="mt-1.5 text-sm text-ink">{TRY_PROMPT}</p>
        <button
          type="button"
          onClick={() => void copy(TRY_PROMPT)}
          className="mt-2 text-xs font-medium text-cta underline-offset-4 hover:underline"
        >
          {copied ? "Copied" : "Copy prompt"}
        </button>
      </div>
    </div>
  );
}

function StepList({ steps }: { steps: Step[] }) {
  return (
    <ol className="space-y-4">
      {steps.map((step, i) => (
        <li key={step.text} className="flex gap-3">
          <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-cta text-xs font-semibold text-white">
            {i + 1}
          </span>
          <div className="min-w-0 flex-1 space-y-2 pt-0.5">
            <p className="text-sm text-ink">{step.text}</p>
            {step.snippet && <StepSnippet snippet={step.snippet} />}
          </div>
        </li>
      ))}
    </ol>
  );
}

/** The footer every MCP overlay shares: where the steps came from, and the one thing to copy. */
export function McpFooter({ connector }: { connector: Connector }) {
  const { copied, copy } = useCopy();
  return (
    <>
      <a
        href={connector.docsUrl}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-1 text-xs text-muted-foreground underline-offset-4 hover:text-ink hover:underline"
      >
        {connector.maker === "Rankbox" ? "About MCP" : `${connector.maker} docs`}
        <ArrowUpRight className="h-3 w-3" aria-hidden />
        <span className="ml-1 text-muted-foreground/70">
          · Checked {formatShortDate(`${CONNECTORS_CHECKED}T12:00:00`)}
        </span>
      </a>
      <Button onClick={() => void copy(MCP_URL)} className="min-w-[10.5rem]">
        {copied ? (
          <>
            <CheckIcon className="h-4 w-4" /> Copied
          </>
        ) : (
          "Copy server URL"
        )}
      </Button>
    </>
  );
}
