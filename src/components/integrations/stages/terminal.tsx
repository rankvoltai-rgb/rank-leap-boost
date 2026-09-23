/**
 * Coding agents in the terminal: the request at the prompt, the Rankbox call
 * as a step in the agent's transcript, then the edit as a diff hunk.
 */
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { TOOL_NAMES, type RankboxTool } from "@/data/ai-integration-samples";
import { Caret, Chrome, CodeView, ENTER, codeChange, taskSummary } from "./parts";
import { APPLY, ASK, CALL, DONE, RESULT, useTyped, type Scene } from "./story";

const DONE_LINE: Record<RankboxTool, (chars: number) => string> = {
  meta: (chars) => `Set the ${chars}-character option as the pricing page's description.`,
  brief: () => "Scaffolded the post with a section for each heading in the brief.",
  questions: () => "Added an FAQ with the five questions buyers ask most.",
};

export function TerminalStage({ scene }: { scene: Scene }) {
  const { tool, hero, task, sample, prompt, phase } = scene;
  const { typed, typing } = useTyped(prompt, phase === ASK);
  const change = codeChange(task, sample);
  const cli = hero.cli ?? tool.name.toLowerCase();
  const input = sample.input[task];

  return (
    <div className="flex h-full flex-col bg-(--st-bg) font-mono text-[11px] leading-[1.55]">
      <Chrome center={`plannora — ${cli}`} />
      <div className="flex min-h-0 flex-1 flex-col px-4 pb-3 pt-3">
        <p className="shrink-0 text-(--st-faint)">
          <span className="text-(--st-add)">●</span> rankbox connected · 3 tools
        </p>

        <div className="mt-3 flex min-h-0 flex-1 flex-col justify-end gap-3 overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_20px)]">
          {phase >= CALL && (
            <p className={cn(ENTER, "border-l-2 border-(--st-accent) pl-2.5 text-(--st-text)")}>
              {prompt}
            </p>
          )}

          {phase >= CALL && (
            <Step
              busy={phase === CALL}
              title={
                <>
                  rankbox · <span className="text-(--st-accent-ink)">{TOOL_NAMES[task].mcp}</span>
                </>
              }
            >
              {phase >= RESULT ? (
                <span className={ENTER}>⎿ {taskSummary(task, sample)}</span>
              ) : (
                <span className="block truncate">
                  ⎿ {TOOL_NAMES[task].arg}: &ldquo;{input}&rdquo;
                </span>
              )}
            </Step>
          )}

          {phase >= APPLY && (
            <Step busy={false} title={`${change.isNew ? "Create" : "Update"} ${change.path}`}>
              <div className="mt-1 overflow-hidden rounded-md border border-(--st-border) py-1">
                <CodeView change={change} phase={phase} hunk max={8} />
              </div>
            </Step>
          )}

          {phase >= DONE && (
            <p className={cn(ENTER, "text-(--st-muted)")}>
              <span className="text-(--st-add)">✓</span> {DONE_LINE[task](sample.meta[0].length)}
            </p>
          )}
        </div>

        <div className="mt-3 shrink-0 rounded-md border border-(--st-border) px-3 py-2">
          <p className="line-clamp-2 min-h-[1.55em]">
            <span className="mr-2 text-(--st-accent-ink)">›</span>
            {phase === ASK && typed}
            <Caret className={cn(typing && "animate-none", phase !== ASK && "opacity-40")} />
          </p>
        </div>
        <p className="mt-1.5 flex shrink-0 justify-between text-[9.5px] text-(--st-faint)">
          <span>~/plannora</span>
          <span>{phase > ASK && phase < DONE ? "working…" : "ready"}</span>
        </p>
      </div>
    </div>
  );
}

function Step({
  busy,
  title,
  children,
}: {
  busy: boolean;
  title: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className={ENTER}>
      <p className="flex items-center gap-2">
        {busy ? (
          <Loader2 className="h-3 w-3 shrink-0 animate-spin text-(--st-accent-ink) motion-reduce:animate-none" />
        ) : (
          <span className="w-3 shrink-0 text-center text-(--st-accent-ink)">●</span>
        )}
        <span className="min-w-0 truncate font-semibold">{title}</span>
      </p>
      <div className="pl-5 text-(--st-muted)">{children}</div>
    </div>
  );
}
