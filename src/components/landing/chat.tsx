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
    <span className="inline-flex items-center gap-1.5 rounded-full border border-volt/40 bg-volt/10 px-2.5 py-0.5 text-[0.7rem] font-medium text-ink">
      <span className="h-1.5 w-1.5 rounded-full bg-volt" />
      {children}
    </span>
  );
}

/* ---------- Source pill with a favicon-style dot ---------- */
function SourcePill({ domain }: { domain: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-2 py-0.5 text-[0.7rem] font-medium text-muted-foreground transition-colors hover:border-ink/20 hover:text-ink">
      <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-secondary text-[0.55rem] font-bold uppercase text-muted-foreground">
        {domain.charAt(0)}
      </span>
      {domain}
    </span>
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
              "flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition-all",
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

/* ---------- Full prompt -> answer card with citation ---------- */
export function ChatAnswerCard({
  engine = "ChatGPT",
  prompt,
  meta = "Searched 24 sources · writing answer",
  answer,
  sources = [],
  className,
  tabs = true,
}: {
  engine?: EngineName;
  prompt: ReactNode;
  meta?: string;
  answer: ReactNode;
  sources?: string[];
  className?: string;
  tabs?: boolean;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-3xl border border-border bg-card shadow-elevation-lg ring-1 ring-ink/5",
        className,
      )}
    >
      {/* Window chrome */}
      <div className="flex items-center gap-2 border-b border-border bg-surface/70 px-4 py-2.5">
        <span className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-border" />
          <span className="h-2.5 w-2.5 rounded-full bg-border" />
          <span className="h-2.5 w-2.5 rounded-full bg-border" />
        </span>
        <span className="mx-auto flex items-center gap-1.5 text-[0.7rem] font-medium text-muted-foreground">
          <EngineIcon name={engine} className="h-3.5 w-3.5" />
          {engine}
        </span>
        <span className="hidden items-center gap-1.5 text-[0.65rem] font-medium text-muted-foreground sm:flex">
          <span className="h-1.5 w-1.5 rounded-full bg-success" />
          Live
        </span>
      </div>
      {tabs && <EngineTabs active={engine} />}
      <div className="space-y-4 p-5 sm:p-6">
        <div className="flex justify-end">
          <div className="max-w-[88%] rounded-2xl rounded-br-md bg-ink px-4 py-2.5 text-sm leading-relaxed text-background">
            {prompt}
          </div>
        </div>

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
            {sources.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[0.7rem] font-medium text-muted-foreground">Sources</span>
                {sources.map((s) => (
                  <SourcePill key={s} domain={s} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Composer bar (visual only) */}
      <div className="border-t border-border bg-surface/50 px-4 py-3">
        <div className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 shadow-sm">
          <span className="flex-1 truncate text-sm text-muted-foreground">
            Ask a follow-up…
          </span>
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-ink text-background">
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M12 19V5M5 12l7-7 7 7" />
            </svg>
          </span>
        </div>
      </div>
    </div>
  );
}
