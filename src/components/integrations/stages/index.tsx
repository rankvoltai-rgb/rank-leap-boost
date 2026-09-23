/**
 * The hero scene on an AI tool's page: Rankbox at work inside that tool.
 *
 * Which screen, palette and task each tool gets is in src/data/tool-heroes.ts;
 * the topic is the page's own sample (src/data/ai-integration-samples.ts), so
 * the hero, "How it works" and "Try it" all tell the same story. Above the
 * window, a status line says what Rankbox is doing at each step.
 */
import { useMemo, type ComponentType } from "react";
import { Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Connector } from "@/data/connectors";
import { aiCategoryOf } from "@/data/ai-integrations";
import { SAMPLES, SCENARIOS, TOOL_NAMES } from "@/data/ai-integration-samples";
import { toolHero, type HeroStage } from "@/data/tool-heroes";
import { RankboxTile } from "../visuals";
import { BuilderStage } from "./builder";
import { CanvasStage } from "./canvas";
import { ChatStage } from "./chat";
import { EditorStage } from "./editor";
import { stageStyle, taskSummary } from "./parts";
import {
  ASK,
  CALL,
  OUT,
  RESULT,
  TYPE_MS,
  useOnScreen,
  useStory,
  type Phase,
  type Scene,
} from "./story";
import { TerminalStage } from "./terminal";
import { VOICE_SCRIPT, VoiceStage } from "./voice";

const STAGES: Record<HeroStage, ComponentType<{ scene: Scene }>> = {
  chat: ChatStage,
  builder: BuilderStage,
  editor: EditorStage,
  terminal: TerminalStage,
  canvas: CanvasStage,
  voice: VoiceStage,
};

/** How long each stage lets the tool put the research to work. */
const APPLY_MS: Record<HeroStage, number> = {
  chat: 2200,
  builder: 2700,
  editor: 2500,
  terminal: 2400,
  canvas: 2200,
  voice: 2600,
};

export function ToolHeroVisual({ tool, className }: { tool: Connector; className?: string }) {
  const hero = toolHero(tool);
  const category = aiCategoryOf(tool);
  const sample = SAMPLES[category];
  const task = hero.task;

  // What the user asks: the page's own use case for this task. A workflow
  // isn't asked anything, it starts; a voice agent is asked out loud.
  const prompt =
    hero.stage === "canvas"
      ? ""
      : hero.stage === "voice"
        ? VOICE_SCRIPT[task].you
        : (SCENARIOS[category].find((s) => s.tool === task)?.prompt ?? "").replaceAll(
            "{name}",
            tool.name,
          );

  const durations = useMemo(() => {
    const perChar = hero.stage === "voice" ? 34 : TYPE_MS;
    const ask = Math.max(1400, prompt.length * perChar + 700);
    return [ask, 1500, 1800, APPLY_MS[hero.stage], 4200, 450] as const;
  }, [hero.stage, prompt]);

  const [ref, onScreen] = useOnScreen<HTMLDivElement>();
  const { phase, loop } = useStory(durations, onScreen);
  const { glow, ...vars } = useMemo(() => stageStyle(hero), [hero]);
  const Stage = STAGES[hero.stage];

  return (
    <div
      ref={ref}
      role="img"
      aria-label={`Sample scene: ${tool.name} using Rankbox's ${TOOL_NAMES[task].label} tool`}
      className={cn("relative", className)}
    >
      <Status tool={tool} phase={phase} task={task} summary={taskSummary(task, sample)} />

      <div className="relative">
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-8 rounded-[3rem] opacity-45 blur-3xl"
          style={{ background: `radial-gradient(55% 60% at 62% 58%, ${glow}, transparent 72%)` }}
        />
        <div
          aria-hidden
          style={vars}
          className="@container relative h-[27rem] overflow-hidden rounded-2xl text-(--st-text) shadow-[0_36px_90px_-30px_rgba(3,15,50,0.7)] ring-1 ring-(--st-ring) sm:h-[29.5rem]"
        >
          <div
            key={loop}
            className={cn("h-full transition-opacity duration-300", phase === OUT && "opacity-0")}
          >
            <Stage scene={{ tool, hero, task, sample, prompt, phase }} />
          </div>
        </div>
      </div>
    </div>
  );
}

/** Above the window: what Rankbox is doing right now, and the sample label. */
function Status({
  tool,
  phase,
  task,
  summary,
}: {
  tool: Connector;
  phase: Phase;
  task: keyof typeof TOOL_NAMES;
  summary: string;
}) {
  const step = phase === ASK ? "ready" : phase === CALL ? "call" : "back";
  return (
    <div aria-hidden className="mb-3.5 flex items-center justify-between gap-3">
      <span className="inline-flex h-8 min-w-0 items-center gap-2 rounded-full border border-white/20 bg-white/10 pl-1 pr-3 text-[12px] font-medium text-white shadow-[0_8px_24px_-12px_rgba(0,0,0,0.4)] backdrop-blur-md">
        <RankboxTile className="h-6 w-6" />
        <span
          key={step}
          className="flex min-w-0 animate-in items-center gap-1.5 truncate fade-in slide-in-from-bottom-1 duration-300 motion-reduce:animate-none"
        >
          {step === "ready" && (
            <>
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-300" />
              <span className="truncate">Connected to {tool.name}</span>
            </>
          )}
          {step === "call" && (
            <>
              <Loader2 className="h-3 w-3 shrink-0 animate-spin motion-reduce:animate-none" />
              <span className="truncate">
                Running{" "}
                <span className="font-mono text-[11px] text-white/85">{TOOL_NAMES[task].mcp}</span>
              </span>
            </>
          )}
          {step === "back" && (
            <>
              <Check className="h-3 w-3 shrink-0 text-emerald-300" strokeWidth={3} />
              <span className="truncate">Returned {phase >= RESULT ? summary : ""}</span>
            </>
          )}
        </span>
      </span>
      <span className="shrink-0 rounded-full border border-white/20 px-2 py-0.5 text-[9.5px] font-semibold uppercase tracking-[0.14em] text-white/70">
        Sample
      </span>
    </div>
  );
}
