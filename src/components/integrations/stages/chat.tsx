/**
 * AI assistants: a conversation. The prompt is typed into the composer (where
 * Rankbox shows as switched on), sent, the assistant calls Rankbox, the
 * research lands in the thread, and the assistant offers the next step.
 */
import { ArrowUp, ChevronDown, Plug, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import type { RankboxTool, ToolSample } from "@/data/ai-integration-samples";
import {
  BriefResult,
  CallPill,
  Caret,
  Chrome,
  ENTER,
  MetaResult,
  QuestionsResult,
  ToolMark,
} from "./parts";
import { APPLY, ASK, CALL, RESULT, useTyped, type Scene } from "./story";

const FOLLOW_UP: Record<RankboxTool, (s: ToolSample) => string> = {
  questions: () =>
    "The Commercial and Comparison groups make the strongest posts. Want a month of titles from them?",
  brief: () => "Want me to draft the introduction from this outline, in your voice?",
  meta: (s) => `Option 1 reads best at ${s.meta[0].length} characters. Want two in a warmer tone?`,
};

export function ChatStage({ scene }: { scene: Scene }) {
  const { tool, task, sample, prompt, phase } = scene;
  const { typed, typing } = useTyped(prompt, phase === ASK);
  const sent = phase >= CALL;

  return (
    <div className="flex h-full flex-col bg-(--st-bg)">
      <Chrome>
        <span className="flex min-w-0 items-center gap-2">
          <ToolMark tool={tool} className="h-[18px] w-[18px]" />
          <span className="truncate text-[12px] font-semibold">{tool.name}</span>
          <ChevronDown className="h-3 w-3 shrink-0 text-(--st-faint)" />
        </span>
      </Chrome>

      <div className="relative flex min-h-0 flex-1 flex-col justify-end gap-3.5 overflow-hidden px-4 pb-2 pt-4 [mask-image:linear-gradient(to_bottom,transparent,black_28px)] @min-[25rem]:px-5">
        {!sent && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 pb-6">
            <ToolMark tool={tool} className="h-10 w-10 shadow-sm" />
            <span className="inline-flex items-center gap-1.5 rounded-full border border-(--st-border) px-2.5 py-1 text-[10.5px] text-(--st-muted)">
              <span className="h-1.5 w-1.5 rounded-full bg-(--st-add)" /> Rankbox connected
            </span>
          </div>
        )}

        {sent && (
          <p
            className={cn(
              ENTER,
              "ml-auto max-w-[86%] rounded-2xl rounded-br-md bg-(--st-bubble) px-3.5 py-2.5 text-[12.5px] leading-snug",
            )}
          >
            {prompt}
          </p>
        )}

        {sent && (
          <div className="flex gap-2.5">
            <ToolMark tool={tool} className={cn(ENTER, "mt-0.5 h-6 w-6 shrink-0")} />
            <div className="min-w-0 flex-1 space-y-2.5">
              <CallPill task={task} done={phase >= RESULT} className={ENTER} />
              {phase >= RESULT && (
                <div className="rounded-xl border border-(--st-border) bg-(--st-panel) px-3 py-2.5">
                  {task === "questions" && <QuestionsResult sample={sample} />}
                  {task === "brief" && <BriefResult sample={sample} max={4} />}
                  {task === "meta" && (
                    <MetaResult sample={sample} pick={phase >= APPLY ? 0 : undefined} />
                  )}
                </div>
              )}
              {phase >= APPLY && (
                <p className={cn(ENTER, "text-[12.5px] leading-snug")}>{FOLLOW_UP[task](sample)}</p>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="px-3 pb-3 @min-[25rem]:px-4 @min-[25rem]:pb-4">
        <div className="rounded-2xl border border-(--st-border) bg-(--st-bg) px-3.5 pb-2.5 pt-3 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
          <p className="line-clamp-2 min-h-[2.5em] text-[12.5px] leading-[1.25]">
            {phase === ASK ? (
              <>
                {typed}
                <Caret className={typing ? "animate-none" : undefined} />
              </>
            ) : (
              <span className="text-(--st-faint)">Reply to {tool.name}…</span>
            )}
          </p>
          <div className="mt-2 flex items-center gap-1.5">
            <span className="grid h-6 w-6 place-items-center rounded-full border border-(--st-border) text-(--st-muted)">
              <Plus className="h-3.5 w-3.5" />
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-(--st-accent)/12 px-2 py-[3px] text-[10.5px] font-semibold text-(--st-accent-ink)">
              <Plug className="h-3 w-3" /> Rankbox
            </span>
            <span
              className={cn(
                "ml-auto grid h-7 w-7 place-items-center rounded-full bg-(--st-accent) text-(--st-on-accent) transition-all duration-300",
                phase === ASK && !typing ? "scale-110 opacity-100" : "opacity-35",
              )}
            >
              <ArrowUp className="h-3.5 w-3.5" strokeWidth={2.5} />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
