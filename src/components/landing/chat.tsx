import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { AI_MARKS } from "./ai-logos";

type EngineName = (typeof AI_MARKS)[number]["name"];

function EngineIcon({ name, className }: { name: EngineName; className?: string }) {
  const found = AI_MARKS.find((m) => m.name === name) ?? AI_MARKS[0];
  const Mark = found.Mark;
  return <Mark className={className} />;
}

/* ---------- Volt-accented citation chip ---------- */
export function CitationChip({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md border border-volt/40 bg-volt/10 px-2.5 py-0.5 text-[0.7rem] font-medium text-ink">
      <span className="h-1.5 w-1.5 rounded-full bg-volt" />
      {children}
    </span>
  );
}

/* ---------- Source pill with a favicon-style dot ---------- */
function SourcePill({ domain }: { domain: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-2 py-0.5 text-[0.7rem] font-medium text-muted-foreground transition-colors hover:border-ink/20 hover:text-ink">
      <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-secondary text-[0.55rem] font-semibold uppercase text-muted-foreground">
        {domain.charAt(0)}
      </span>
      {domain}
    </span>
  );
}

/* ---------- Expanded citation row ---------- */
function SourceRow({ domain }: { domain: string }) {
  return (
    <div className="flex items-center gap-2.5 rounded-lg border border-border bg-background px-2.5 py-1.5">
      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-secondary text-[0.6rem] font-semibold uppercase text-muted-foreground">
        {domain.charAt(0)}
      </span>
      <span className="min-w-0 flex-1 truncate text-xs font-medium text-ink">{domain}</span>
      <span className="shrink-0 text-[0.65rem] font-medium text-volt">cited</span>
    </div>
  );
}

function SourcePills({ sources }: { sources: string[] }) {
  return (
    <div className="flex flex-wrap items-center gap-1.5 pt-1">
      <span className="text-[0.7rem] font-medium text-muted-foreground">Sources</span>
      {sources.map((s) => (
        <SourcePill key={s} domain={s} />
      ))}
    </div>
  );
}

function SourceRows({ sources }: { sources: string[] }) {
  return (
    <div className="space-y-1.5 pt-1">
      <span className="text-[0.7rem] font-medium text-muted-foreground">Sources</span>
      <div className="space-y-1.5">
        {sources.map((s) => (
          <SourceRow key={s} domain={s} />
        ))}
      </div>
    </div>
  );
}

/* ---------- Engine switcher tab row (ChatGPT-style chrome) ---------- */
export function EngineTabs({ active = "ChatGPT" }: { active?: EngineName }) {
  return (
    <div className="flex items-center gap-1 overflow-x-auto border-b border-border bg-surface/70 px-2.5 py-2">
      {AI_MARKS.map(({ name, Mark }) => {
        const isActive = name === active;
        return (
          <span
            key={name}
            className={cn(
              "flex shrink-0 items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-all",
              isActive
                ? "-translate-y-px bg-card text-ink shadow-sm ring-1 ring-border"
                : "text-muted-foreground/70 hover:text-muted-foreground",
            )}
          >
            <Mark className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{name}</span>
          </span>
        );
      })}
    </div>
  );
}

/* ---------- Right-aligned user message ---------- */
function PromptBubble({ children }: { children: ReactNode }) {
  return (
    <div className="flex justify-end">
      <div className="max-w-[88%] rounded-lg rounded-br-sm bg-ink px-4 py-2.5 text-sm leading-relaxed text-background">
        {children}
      </div>
    </div>
  );
}

/* ---------- Full prompt -> answer card with citation ---------- */
export function ChatAnswerCard({
  engine = "ChatGPT",
  prompt,
  meta = "Searched 24 sources · writing answer",
  answer,
  sources = [],
  className,
  tabs = true,
  sourceStyle = "pills",
}: {
  engine?: EngineName;
  prompt: ReactNode;
  meta?: string;
  answer: ReactNode;
  sources?: string[];
  className?: string;
  tabs?: boolean;
  /* "rows" gives each citation its own line — for a card with a fixed height,
     where pills would leave the panel looking empty. Only use it where the
     card has the room: rows are ~130px taller than pills. */
  sourceStyle?: "pills" | "rows";
}) {
  return (
    <div
      className={cn(
        // Column layout so a min-height on the card is absorbed by the
        // conversation body rather than stretching the chrome.
        "flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-elevation-lg ring-1 ring-ink/5",
        className,
      )}
    >
      {/* Window chrome — the engine label is absolutely centred so it stays
          centred regardless of what sits beside it. */}
      <div className="relative flex items-center gap-2 border-b border-border bg-surface/70 px-4 py-2.5">
        <span className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <span key={i} className="h-2.5 w-2.5 rounded-full bg-border" />
          ))}
        </span>
        <span className="absolute left-1/2 flex -translate-x-1/2 items-center gap-1.5 text-[0.7rem] font-medium text-muted-foreground">
          <EngineIcon name={engine} className="h-3.5 w-3.5" />
          {engine}
        </span>
      </div>
      {tabs && <EngineTabs active={engine} />}
      {/* Centred, not bottom-anchored: where the card is given a height beyond
          its content, splitting the slack above and below reads as a framed
          exchange rather than a conversation that has fallen to the floor. */}
      <div className="flex flex-1 flex-col justify-center gap-4 p-5 sm:p-6">
        <PromptBubble>{prompt}</PromptBubble>

        <div className="flex gap-3">
          <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border bg-background">
            <EngineIcon name={engine} className="h-4 w-4" />
          </span>
          <div className="min-w-0 flex-1 space-y-3">
            <div className="flex items-center gap-2 text-[0.7rem] font-medium text-muted-foreground">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-volt/70" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-volt" />
              </span>
              {meta}
            </div>
            <p className="text-[0.95rem] leading-relaxed text-ink">
              {answer}
              <span className="ml-0.5 inline-block h-[1.05em] w-[2px] translate-y-[0.18em] animate-pulse rounded-full bg-volt align-middle" />
            </p>
            {/* shimmer line suggesting the answer is still streaming */}
            <div className="h-2.5 w-2/5 rounded-full bg-shimmer" />
            {sources.length > 0 &&
              (sourceStyle === "rows" ? (
                <SourceRows sources={sources} />
              ) : (
                <SourcePills sources={sources} />
              ))}
          </div>
        </div>
      </div>
      {/* Composer bar (visual only) */}
      <div className="border-t border-border bg-surface/50 px-4 py-3">
        <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 shadow-sm">
          <span className="flex-1 truncate text-sm text-muted-foreground">Ask a follow-up…</span>
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-ink text-background">
            <svg
              viewBox="0 0 24 24"
              className="h-3.5 w-3.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M12 19V5M5 12l7-7 7 7" />
            </svg>
          </span>
        </div>
      </div>
    </div>
  );
}
