/**
 * "Try it": Rankbox's three MCP tools, on the page, before anyone signs up.
 *
 * It opens on a worked sample so the answer is there the instant the section
 * is, then runs the same tools live on the visitor's own input. Live runs go
 * through the free-tool endpoints (rate-limited per IP on the server), and a
 * browser gets a few before the panel suggests the trial instead: enough to
 * judge the output, not a free research service.
 */
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Check, Copy, Loader2, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  generateAiQuestions,
  generateContentBrief,
  writeMetaDescriptions,
  type ContentBrief,
  type QuestionGroup,
} from "@/lib/tools";
import { readAiError, useCopied } from "@/components/tools/shared";
import {
  SAMPLES,
  TOOL_NAMES,
  type AiCategory,
  type RankboxTool,
} from "@/data/ai-integration-samples";

type Result =
  | { tool: "questions"; data: QuestionGroup[] }
  | { tool: "brief"; data: ContentBrief }
  | { tool: "meta"; data: string[] };

const TABS: RankboxTool[] = ["questions", "brief", "meta"];
const RUNS_KEY = "rankbox.try.runs";
const FREE_RUNS = 3;

const PLACEHOLDER: Record<RankboxTool, string> = {
  questions: "A topic, product, or niche",
  brief: "A keyword you want to rank for",
  meta: "What the page is about",
};

function readRuns(): number {
  try {
    return Number(window.sessionStorage.getItem(RUNS_KEY)) || 0;
  } catch {
    return 0;
  }
}

function sampleResult(category: AiCategory, tool: RankboxTool): Result {
  const s = SAMPLES[category];
  if (tool === "questions") return { tool, data: s.questions };
  if (tool === "brief") return { tool, data: s.brief };
  return { tool, data: s.meta };
}

export function Playground({ category, toolName }: { category: AiCategory; toolName: string }) {
  const [tab, setTab] = useState<RankboxTool>("questions");
  const [inputs, setInputs] = useState<Record<RankboxTool, string>>({
    questions: "",
    brief: "",
    meta: "",
  });
  // What each live result was run on, for the call line above it.
  const [ranOn, setRanOn] = useState<Partial<Record<RankboxTool, string>>>({});
  const [results, setResults] = useState<Partial<Record<RankboxTool, Result>>>({});
  const [loading, setLoading] = useState<RankboxTool | null>(null);
  const [error, setError] = useState("");
  const [runs, setRuns] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => setRuns(readRuns()), []);
  useEffect(() => {
    if (!loading) return;
    setElapsed(0);
    const t = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [loading]);

  const live = results[tab];
  const shown = live ?? sampleResult(category, tab);
  const isSample = !live;
  const outOfRuns = runs >= FREE_RUNS;
  const value = inputs[tab];
  const meta = TOOL_NAMES[tab];
  const shownInput = live ? (ranOn[tab] ?? "") : SAMPLES[category].input[tab];

  async function run(e: React.FormEvent) {
    e.preventDefault();
    const input = value.trim();
    if (!input || loading || outOfRuns) return;
    setLoading(tab);
    setError("");
    try {
      const next: Result =
        tab === "questions"
          ? { tool: tab, data: await generateAiQuestions({ topic: input }) }
          : tab === "brief"
            ? { tool: tab, data: await generateContentBrief({ keyword: input }) }
            : { tool: tab, data: await writeMetaDescriptions({ topic: input }) };
      setResults((r) => ({ ...r, [tab]: next }));
      setRanOn((r) => ({ ...r, [tab]: input }));
      const used = readRuns() + 1;
      try {
        window.sessionStorage.setItem(RUNS_KEY, String(used));
      } catch {
        /* private mode: the server-side limit still applies */
      }
      setRuns(used);
    } catch (err) {
      setError(readAiError(err));
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-elevation-lg">
      {/* Tool tabs */}
      <div
        role="tablist"
        aria-label="Rankbox tools"
        className="flex gap-1 overflow-x-auto border-b border-border bg-surface/60 p-1.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            role="tab"
            id={`try-tab-${t}`}
            aria-selected={tab === t}
            aria-controls="try-panel"
            onClick={() => {
              setTab(t);
              setError("");
            }}
            className={cn(
              "shrink-0 rounded-lg px-3.5 py-2 text-sm font-medium transition-colors",
              tab === t
                ? "bg-card text-ink shadow-1 ring-1 ring-border"
                : "text-muted-foreground hover:text-ink",
            )}
          >
            {TOOL_NAMES[t].label}
          </button>
        ))}
      </div>

      <div id="try-panel" role="tabpanel" aria-labelledby={`try-tab-${tab}`} className="p-5 sm:p-6">
        {/* Input */}
        <form onSubmit={run} className="flex flex-col gap-2 sm:flex-row">
          <label className="sr-only" htmlFor="try-input">
            {meta.arg}
          </label>
          <input
            ref={inputRef}
            id="try-input"
            value={value}
            maxLength={200}
            onChange={(e) => setInputs((v) => ({ ...v, [tab]: e.target.value }))}
            placeholder={`${PLACEHOLDER[tab]}, e.g. ${SAMPLES[category].input[tab]}`}
            disabled={outOfRuns}
            className="h-11 w-full min-w-0 rounded-xl border border-border bg-background px-4 sm:flex-1 text-sm text-ink outline-none transition-shadow placeholder:text-muted-foreground/80 focus:border-cta/50 focus:ring-4 focus:ring-cta/10 disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={!!loading || !value.trim() || outOfRuns}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-cta px-5 text-sm font-semibold text-white transition-colors hover:bg-cta-hover disabled:opacity-60"
          >
            {loading === tab ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Play className="h-4 w-4" />
            )}
            Run it
          </button>
        </form>

        {/* The call, as the AI tool would make it */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
          <code className="min-w-0 truncate font-mono text-[12px] text-muted-foreground">
            rankbox.{meta.mcp}({"{ "}
            {meta.arg}: &ldquo;{shownInput}&rdquo;
            {" }"})
          </code>
          <span
            className={cn(
              "shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide",
              isSample ? "bg-secondary text-muted-foreground" : "bg-success/10 text-success",
            )}
          >
            {isSample ? "Sample" : "Live result"}
          </span>
        </div>

        {/* Output */}
        <div
          aria-live="polite"
          aria-busy={loading === tab}
          className="relative mt-3 min-h-[16rem] rounded-xl border border-border bg-background p-4 sm:p-5"
        >
          {loading === tab ? (
            <Researching seconds={elapsed} tool={tab} />
          ) : (
            <ResultView result={shown} />
          )}
        </div>

        {error && (
          <p role="alert" className="mt-3 text-sm text-destructive">
            {error}
          </p>
        )}

        <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
          {outOfRuns ? (
            <>
              That&rsquo;s the free preview.{" "}
              <a href="/auth" className="font-semibold text-cta underline-offset-4 hover:underline">
                Start your free trial
              </a>{" "}
              to use all three tools inside {toolName}, as often as you need.
            </>
          ) : (
            <>
              The same tools {toolName} calls.{" "}
              {FREE_RUNS - runs === FREE_RUNS
                ? `Try ${FREE_RUNS} of your own here, free.`
                : `${FREE_RUNS - runs} free ${FREE_RUNS - runs === 1 ? "run" : "runs"} left here.`}
            </>
          )}
        </p>
      </div>
    </div>
  );
}

/* ── Output views ──────────────────────────────────────────────── */

const INTENT_TONE: Record<string, string> = {
  Informational: "bg-cta-soft text-cta",
  Commercial: "bg-success/10 text-success",
  Comparison: "bg-warning/15 text-ink",
  Transactional: "bg-secondary text-ink",
};

function ResultView({ result }: { result: Result }) {
  if (result.tool === "questions") return <QuestionsView groups={result.data} />;
  if (result.tool === "brief") return <BriefView brief={result.data} />;
  return <MetaView options={result.data} />;
}

function QuestionsView({ groups }: { groups: QuestionGroup[] }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      {groups.map((g) => (
        <div key={g.intent} className="min-w-0">
          <span
            className={cn(
              "inline-flex rounded-md px-2 py-0.5 text-[11px] font-semibold",
              INTENT_TONE[g.intent] ?? "bg-secondary text-ink",
            )}
          >
            {g.intent}
          </span>
          <ul className="mt-2 space-y-1.5">
            {g.questions.slice(0, 4).map((q) => (
              <li key={q} className="text-sm leading-snug text-ink">
                {q}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function BriefView({ brief }: { brief: ContentBrief }) {
  return (
    <div className="space-y-4">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
          Working title
        </p>
        <p className="mt-1 text-base font-semibold text-ink">{brief.title}</p>
      </div>
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
          Outline
        </p>
        <ol className="mt-1.5 space-y-1.5">
          {brief.outline.slice(0, 7).map((s) => (
            <li key={s.heading} className="flex gap-2.5 text-sm text-ink">
              <span className="mt-0.5 font-mono text-[10px] font-semibold text-cta">H2</span>
              {s.heading}
            </li>
          ))}
        </ol>
      </div>
      {brief.entities.length > 0 && (
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            Entities to mention
          </p>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {brief.entities.slice(0, 8).map((e) => (
              <span
                key={e}
                className="rounded-md border border-border bg-card px-2 py-0.5 text-xs text-ink"
              >
                {e}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function MetaView({ options }: { options: string[] }) {
  const [copied, copy] = useCopied();
  return (
    <ol className="space-y-3">
      {options.map((o, i) => (
        <li key={o} className="flex items-start gap-3 rounded-lg border border-border bg-card p-3">
          <span className="mt-0.5 font-mono text-xs font-semibold text-muted-foreground">
            {i + 1}
          </span>
          <p className="min-w-0 flex-1 text-sm leading-relaxed text-ink">{o}</p>
          <div className="flex shrink-0 flex-col items-end gap-1.5">
            <span
              className={cn(
                "rounded px-1.5 py-0.5 font-mono text-[10px] tabular-nums",
                o.length >= 120 && o.length <= 160
                  ? "bg-success/10 text-success"
                  : "bg-warning/15 text-ink",
              )}
            >
              {o.length} chars
            </span>
            <button
              type="button"
              onClick={() => copy(o, o)}
              aria-label={`Copy option ${i + 1}`}
              className="grid h-7 w-7 place-items-center rounded-md text-muted-foreground hover:bg-secondary hover:text-ink"
            >
              {copied === o ? (
                <Check className="h-3.5 w-3.5 text-success" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
            </button>
          </div>
        </li>
      ))}
    </ol>
  );
}

function Researching({ seconds, tool }: { seconds: number; tool: RankboxTool }) {
  const lines = tool === "meta" ? 3 : 6;
  return (
    <div>
      <p className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin text-cta" />
        Rankbox is researching
        {seconds > 2 && <span className="tabular-nums">· {seconds}s</span>}
      </p>
      <div className="mt-5 space-y-3" aria-hidden>
        {Array.from({ length: lines }, (_, i) => (
          <div
            key={i}
            className="skeleton h-3.5 rounded"
            style={{ width: `${88 - ((i * 17) % 40)}%` }}
          />
        ))}
      </div>
      {seconds > 12 && (
        <p className="mt-5 text-xs text-muted-foreground">
          Briefs take a little longer: it&rsquo;s researching the whole topic.
        </p>
      )}
    </div>
  );
}

/** A compact call-to-action under the panel, for pages that want one. */
export function PlaygroundFooter({ toolName }: { toolName: string }) {
  return (
    <a
      href="/auth"
      className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink transition-colors hover:text-cta"
    >
      Use all three inside {toolName} <ArrowRight className="h-4 w-4" />
    </a>
  );
}
