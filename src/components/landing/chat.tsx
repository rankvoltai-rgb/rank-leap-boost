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
              "flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition-colors",
              isActive
                ? "bg-card text-ink shadow-sm ring-1 ring-border"
                : "text-muted-foreground/70",
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
            <p className="text-sm leading-relaxed text-ink">{answer}</p>
            {sources.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[0.7rem] font-medium text-muted-foreground">Sources</span>
                {sources.map((s) => (
                  <CitationChip key={s}>{s}</CitationChip>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
