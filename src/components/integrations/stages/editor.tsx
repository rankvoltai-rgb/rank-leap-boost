/**
 * Coding agents in an editor: the file on one side, the agent on the other
 * (on the left for agents that live in the sidebar). The agent calls Rankbox,
 * then edits the file: a diff arriving line by line, then applied.
 *
 * The codebase is Plannora's, the coding sample's project management app.
 */
import { Check, FileCode2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  BriefResult,
  CallPill,
  Caret,
  Chrome,
  CodeView,
  ENTER,
  MetaResult,
  QuestionsResult,
  ToolMark,
  codeChange,
} from "./parts";
import { APPLY, ASK, CALL, DONE, RESULT, useTyped, type Scene } from "./story";

export function EditorStage({ scene }: { scene: Scene }) {
  const { tool, hero, task, sample, prompt, phase } = scene;
  const change = codeChange(task, sample);
  const left = hero.sidebar === "left";
  const { typed, typing } = useTyped(prompt, phase === ASK);
  const adds = change.lines.filter((l) => l.kind === "add").length;
  const dels = change.lines.filter((l) => l.kind === "del").length;

  return (
    <div className="flex h-full flex-col bg-(--st-bg)">
      <Chrome
        center={
          <span className="inline-flex items-center gap-1.5">
            <ToolMark tool={tool} className="h-3.5 w-3.5" />
            plannora
          </span>
        }
      />
      <div
        className={cn(
          "flex min-h-0 flex-1 flex-col",
          left ? "@min-[25rem]:flex-row-reverse" : "@min-[25rem]:flex-row",
        )}
      >
        {/* The file */}
        <section className="flex min-h-0 min-w-0 flex-1 flex-col">
          <div className="flex h-8 shrink-0 border-b border-(--st-border) bg-(--st-panel)">
            <span className="relative -mb-px flex items-center gap-1.5 border-r border-(--st-border) bg-(--st-bg) px-3 text-[10.5px]">
              <span className="absolute inset-x-0 top-0 h-[1.5px] bg-(--st-accent)" />
              <FileCode2 className="h-3 w-3 text-(--st-tag)" />
              {change.file}
              {phase >= APPLY && (
                <span className={cn(ENTER, "font-mono text-[9px] font-semibold text-(--st-add)")}>
                  {change.isNew ? "U" : "M"}
                </span>
              )}
            </span>
            <span className="hidden items-center gap-1.5 px-3 text-[10.5px] text-(--st-faint) @min-[25rem]:flex">
              <FileCode2 className="h-3 w-3" />
              layout.tsx
            </span>
          </div>
          <p className="truncate px-3 py-1.5 text-[9.5px] text-(--st-faint)">
            {change.path.split("/").join(" › ")}
          </p>
          <div className="min-h-0 flex-1 overflow-hidden pb-2">
            <CodeView change={change} phase={phase} />
          </div>
        </section>

        {/* The agent */}
        <aside
          className={cn(
            "flex h-[50%] shrink-0 flex-col border-t border-(--st-border) bg-(--st-panel) @min-[25rem]:h-auto @min-[25rem]:w-[43%] @min-[25rem]:border-t-0",
            left ? "@min-[25rem]:border-r" : "@min-[25rem]:border-l",
          )}
        >
          <div className="flex h-8 shrink-0 items-center gap-2 border-b border-(--st-border) px-3 text-[10.5px]">
            <ToolMark tool={tool} className="h-4 w-4" />
            <span className="truncate font-semibold">{tool.name}</span>
            <span className="ml-auto rounded bg-(--st-accent)/15 px-1.5 py-px text-[9px] font-semibold text-(--st-accent-ink)">
              Agent
            </span>
          </div>

          <div className="flex min-h-0 flex-1 flex-col justify-end gap-2 overflow-hidden p-3 [mask-image:linear-gradient(to_bottom,transparent,black_24px)]">
            {phase >= CALL && (
              <p
                className={cn(
                  ENTER,
                  "rounded-lg bg-(--st-bubble) px-2.5 py-2 text-[11px] leading-snug",
                )}
              >
                {prompt}
              </p>
            )}
            {phase >= CALL && (
              <CallPill task={task} done={phase >= RESULT} className={cn(ENTER, "self-start")} />
            )}
            {phase >= RESULT && (
              <div className="rounded-lg border border-(--st-border) bg-(--st-bg) px-2.5 py-2">
                {task === "questions" && <QuestionsResult sample={sample} labels={false} />}
                {task === "brief" && <BriefResult sample={sample} entities={false} />}
                {task === "meta" && (
                  <MetaResult sample={sample} pick={phase >= APPLY ? 0 : undefined} />
                )}
              </div>
            )}
            {phase >= APPLY && (
              <div
                className={cn(
                  ENTER,
                  "flex items-center gap-1.5 rounded-lg border border-(--st-border) bg-(--st-bg) px-2.5 py-1.5 text-[10px]",
                )}
              >
                <FileCode2 className="h-3 w-3 shrink-0 text-(--st-muted)" />
                <span className="min-w-0 flex-1 truncate font-mono">{change.file}</span>
                <span className="font-mono text-(--st-add)">+{adds}</span>
                {dels > 0 && <span className="font-mono text-(--st-del)">−{dels}</span>}
                {phase >= DONE && (
                  <span
                    className={cn(
                      ENTER,
                      "ml-1 flex items-center gap-0.5 font-semibold text-(--st-add)",
                    )}
                  >
                    <Check className="h-3 w-3" strokeWidth={3} /> Applied
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="p-2.5 pt-0">
            <div className="rounded-lg border border-(--st-border) bg-(--st-bg) px-2.5 py-2 text-[11px] leading-snug">
              <p className="line-clamp-2 min-h-[2.5em]">
                {phase === ASK ? (
                  <>
                    {typed}
                    <Caret className={typing ? "animate-none" : undefined} />
                  </>
                ) : (
                  <span className="text-(--st-faint)">Ask {tool.name} to build…</span>
                )}
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
