import { useId, useState, type FormEvent } from "react";
import { useServerFn } from "@tanstack/react-start";
import { AlertCircle, ArrowRight, Check, CircleDashed, Globe, Loader2, X } from "lucide-react";
import { checkAiReadiness, type ReadinessCheck, type ReadinessReport } from "@/lib/tools.functions";
import { cn } from "@/lib/utils";
import { PROSPECT } from "./content";
import { Heading } from "./Heading";
import { PageLink } from "./PageLink";

type State =
  | { kind: "idle" }
  | { kind: "loading"; site: string }
  | { kind: "error"; message: string }
  | { kind: "done"; report: ReadinessReport };

/** The failed checks first, then the warnings: the openings for a pitch. */
export function openings(report: ReadinessReport, limit = 3): ReadinessCheck[] {
  const rank = { fail: 0, warn: 1, pass: 2, info: 3 } as const;
  return report.checks
    .filter((c) => c.status === "fail" || c.status === "warn")
    .sort((a, b) => rank[a.status] - rank[b.status])
    .slice(0, limit);
}

/** A readable message from a server-function error; validation dumps get the plain fallback. */
export function readError(err: unknown): string {
  const msg = err instanceof Error ? err.message.trim() : "";
  if (!msg || msg.startsWith("[") || msg.startsWith("{")) return PROSPECT.error;
  return msg;
}

function hostOf(input: string): string {
  return input.replace(/^https?:\/\//i, "").replace(/\/.*$/, "") || input;
}

/**
 * Section 2: the scope's first line, run live on a prospect's site with the
 * same server check as /tools/ai-search-readiness-check. Every state is drawn:
 * idle (what comes back), loading, error with a retry, and the result.
 */
export function ProspectCheck() {
  const run = useServerFn(checkAiReadiness);
  const inputId = useId();
  const hintId = useId();
  const [url, setUrl] = useState("");
  const [state, setState] = useState<State>({ kind: "idle" });
  const [emptyHint, setEmptyHint] = useState(false);

  async function check(e?: FormEvent) {
    e?.preventDefault();
    const value = url.trim();
    if (!value) {
      setEmptyHint(true);
      return;
    }
    if (state.kind === "loading") return;
    setEmptyHint(false);
    setState({ kind: "loading", site: hostOf(value) });
    try {
      setState({ kind: "done", report: await run({ data: { url: value } }) });
    } catch (err) {
      setState({ kind: "error", message: readError(err) });
    }
  }

  const loading = state.kind === "loading";

  return (
    <section
      id="prospect"
      aria-labelledby="prospect-title"
      className="scroll-mt-24 border-t border-border bg-surface/40 py-20 sm:py-28"
    >
      <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)] gap-10 px-4 sm:px-6 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16">
        <Heading id="prospect" intro={PROSPECT.intro} />

        <div className="min-w-0">
          <form
            onSubmit={check}
            noValidate
            className="flex w-full items-center gap-1.5 rounded-xl border border-border bg-card p-1.5 shadow-sm transition-shadow focus-within:border-cta/50 focus-within:shadow-md"
          >
            <label htmlFor={inputId} className="sr-only">
              {PROSPECT.label}
            </label>
            <Globe aria-hidden className="ml-2.5 h-4 w-4 shrink-0 text-muted-foreground" />
            <input
              id={inputId}
              type="text"
              inputMode="url"
              autoComplete="url"
              spellCheck={false}
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                if (emptyHint) setEmptyHint(false);
              }}
              placeholder={PROSPECT.placeholder}
              aria-invalid={emptyHint || undefined}
              aria-describedby={emptyHint ? hintId : undefined}
              className="min-w-0 flex-1 bg-transparent py-2.5 pr-1 text-sm text-ink outline-none placeholder:text-muted-foreground"
            />
            <button
              type="submit"
              aria-busy={loading}
              disabled={loading}
              className={cn(
                "inline-flex h-10 shrink-0 items-center justify-center gap-1.5 rounded-lg bg-cta px-3.5 text-sm font-semibold text-white transition-colors hover:bg-cta-hover sm:px-4",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta focus-visible:ring-offset-2 focus-visible:ring-offset-card",
                "disabled:cursor-progress disabled:opacity-90",
              )}
            >
              {loading && (
                <Loader2 aria-hidden className="h-4 w-4 animate-spin motion-reduce:animate-none" />
              )}
              {loading ? PROSPECT.running : PROSPECT.run}
            </button>
          </form>
          {emptyHint && (
            <p id={hintId} role="alert" className="mt-2 text-xs text-destructive">
              {PROSPECT.empty}
            </p>
          )}

          <div className="mt-5" aria-live="polite">
            {state.kind === "idle" && <Idle />}
            {state.kind === "loading" && <Loading site={state.site} />}
            {state.kind === "error" && <Failed message={state.message} onRetry={() => check()} />}
            {state.kind === "done" && <Result report={state.report} />}
          </div>
        </div>
      </div>
    </section>
  );
}

function Idle() {
  return (
    <div className="rounded-xl border border-dashed border-border bg-card/60 p-5 sm:p-6">
      <p className="text-sm font-semibold text-ink">{PROSPECT.idleTitle}</p>
      <ul className="mt-3 space-y-2">
        {PROSPECT.idle.map((item) => (
          <li key={item} className="flex items-start gap-2.5 text-sm text-muted-foreground">
            <CircleDashed
              aria-hidden
              className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground/60"
            />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Loading({ site }: { site: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 sm:p-6">
      <p className="text-sm text-muted-foreground">{PROSPECT.loading(site)}</p>
      <div aria-hidden className="mt-4 space-y-3">
        {[72, 92, 58, 80].map((w) => (
          <div
            key={w}
            className="h-3 animate-pulse rounded-full bg-surface motion-reduce:animate-none"
            style={{ width: `${w}%` }}
          />
        ))}
      </div>
    </div>
  );
}

function Failed({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div
      role="alert"
      className="flex flex-col gap-4 rounded-xl border border-destructive/25 bg-destructive/[0.04] p-5 sm:flex-row sm:items-center sm:justify-between"
    >
      <p className="flex items-start gap-2.5 text-sm text-ink">
        <AlertCircle aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
        {message}
      </p>
      <button
        type="button"
        onClick={onRetry}
        className="shrink-0 self-start rounded-lg border border-border bg-card px-3.5 py-2 text-sm font-medium text-ink transition-colors hover:border-cta/40 hover:text-cta focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta sm:self-auto"
      >
        {PROSPECT.retry}
      </button>
    </div>
  );
}

function Result({ report }: { report: ReadinessReport }) {
  // Search and live-fetch crawlers only: training bots are the client's call.
  const bots = report.snapshot.bots;
  const blocked = bots.filter((b) => !b.allowed).map((b) => b.token);
  const scored = report.checks.filter((c) => c.status !== "info");
  const top = openings(report);
  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="border-b border-border p-5 sm:p-6">
        <p className="font-mono text-xs text-muted-foreground">
          {hostOf(report.finalUrl || report.url)}
        </p>
        <p className="mt-2 text-pretty text-[1.02rem] font-semibold leading-snug text-ink">
          {PROSPECT.headline(report.score, blocked)}
        </p>
        <div className="mt-5 flex items-end gap-4">
          <p className="font-display text-[2.4rem] font-semibold leading-none tracking-[-0.03em] text-ink">
            {report.score}
            <span className="ml-1 text-base font-medium text-muted-foreground">/100</span>
          </p>
          <div className="mb-1.5 flex-1">
            <p className="flex justify-between text-xs text-muted-foreground">
              <span>{PROSPECT.scoreLabel}</span>
              <span>{PROSPECT.passed(report.passed, scored.length)}</span>
            </p>
            <div
              role="meter"
              aria-label={PROSPECT.scoreLabel}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={report.score}
              className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-surface"
            >
              <div className="h-full rounded-full bg-cta" style={{ width: `${report.score}%` }} />
            </div>
          </div>
        </div>
      </div>

      {bots.length > 0 && (
        <div className="border-b border-border p-5 sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
            {PROSPECT.botsLabel}
          </p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {bots.map((b) => (
              <li
                key={b.token}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[0.75rem]",
                  b.allowed
                    ? "border-border text-ink"
                    : "border-destructive/30 bg-destructive/[0.05] text-destructive",
                )}
              >
                {b.allowed ? (
                  <Check aria-hidden className="h-3.5 w-3.5 text-success" />
                ) : (
                  <X aria-hidden className="h-3.5 w-3.5" />
                )}
                {b.token}
                <span className="sr-only">{b.allowed ? PROSPECT.allowed : PROSPECT.blocked}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="p-5 sm:p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
          {PROSPECT.openingsLabel}
        </p>
        {top.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">{PROSPECT.noOpenings}</p>
        ) : (
          <ol className="mt-3 space-y-4">
            {top.map((c) => (
              <li key={c.id} className="flex gap-3">
                <span
                  aria-hidden
                  className={cn(
                    "mt-1.5 h-2 w-2 shrink-0 rounded-full",
                    c.status === "fail" ? "bg-destructive" : "bg-warning",
                  )}
                />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-ink">{c.label}</p>
                  {c.fix && (
                    <p className="mt-0.5 text-pretty text-sm leading-relaxed text-muted-foreground">
                      {c.fix}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ol>
        )}
        <PageLink
          target={{ kind: "tool", slug: "ai-search-readiness-check" }}
          className="mt-5 inline-flex items-center gap-1 rounded-sm text-sm font-medium text-cta hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta"
        >
          {PROSPECT.full}
          <ArrowRight aria-hidden className="h-3.5 w-3.5" />
        </PageLink>
      </div>
    </div>
  );
}
