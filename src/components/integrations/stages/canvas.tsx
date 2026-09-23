/**
 * Automation and agent builders: a workflow runs. The trigger fires, Rankbox
 * runs (as a step, or as the tool an agent step calls), its output appears,
 * and the last step sends it on.
 *
 * Three shapes, after the tools themselves: steps across a canvas, round
 * modules across a canvas, or a list of steps read top to bottom.
 */
import type { CSSProperties, ReactNode } from "react";
import {
  Bot,
  CalendarClock,
  Check,
  ListChecks,
  Loader2,
  Mail,
  MessageCircle,
  MessageSquare,
  MessageSquareText,
  Play,
  Table2,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { TOOL_NAMES, type RankboxTool } from "@/data/ai-integration-samples";
import { RankboxTile } from "../visuals";
import {
  BriefResult,
  Chrome,
  ENTER,
  MetaResult,
  QuestionsResult,
  ToolMark,
  taskSummary,
} from "./parts";
import { APPLY, ASK, CALL, DONE, RESULT, type Phase, type Scene } from "./story";

type State = "idle" | "run" | "done";

interface Ends {
  name: string;
  trigger: { icon: LucideIcon; title: string; sub: string };
  out: { icon: LucideIcon; title: string; sub: string };
}

/** Automations start from something happening; agents from a message. */
const AUTOMATION: Record<RankboxTool, Ends> = {
  brief: {
    name: "New keyword → brief",
    trigger: { icon: Table2, title: "New keyword", sub: "Keyword sheet" },
    out: { icon: MessageSquare, title: "Post to team", sub: "#content" },
  },
  questions: {
    name: "Monday questions digest",
    trigger: { icon: CalendarClock, title: "Every Monday", sub: "9:00 AM" },
    out: { icon: Mail, title: "Weekly digest", sub: "Content team" },
  },
  meta: {
    name: "Meta descriptions in bulk",
    trigger: { icon: ListChecks, title: "For each URL", sub: "Page list" },
    out: { icon: Table2, title: "Update sheet", sub: "Meta column" },
  },
};

const AGENT: Ends = {
  name: "Content research agent",
  trigger: { icon: MessageCircle, title: "User message", sub: "Chat input" },
  out: { icon: MessageSquareText, title: "Answer", sub: "Chat output" },
};

const stateOf = (phase: Phase, runs: Phase, doneAt: Phase): State =>
  phase >= doneAt ? "done" : phase >= runs ? "run" : "idle";

export function CanvasStage({ scene }: { scene: Scene }) {
  const { tool, hero, task, phase } = scene;
  const ends = tool.category === "automation" ? AUTOMATION[task] : AGENT;
  const running = phase < DONE;
  const step = phase >= APPLY ? 3 : phase >= CALL ? 2 : 1;

  return (
    <div className="flex h-full flex-col bg-(--st-bg)">
      <Chrome
        right={
          <span className="inline-flex items-center gap-1.5 rounded-md bg-(--st-accent) px-2.5 py-1 text-[10.5px] font-semibold text-(--st-on-accent)">
            {running ? (
              <Loader2 className="h-3 w-3 animate-spin motion-reduce:animate-none" />
            ) : (
              <Play className="h-3 w-3 fill-current" />
            )}
            {running ? "Running" : "Run"}
          </span>
        }
      >
        <span className="flex min-w-0 items-center gap-2">
          <ToolMark tool={tool} className="h-[18px] w-[18px]" />
          <span className="truncate text-[12px] font-semibold">{ends.name}</span>
        </span>
      </Chrome>

      <div
        className="relative min-h-0 flex-1 overflow-hidden"
        style={{
          backgroundImage:
            "radial-gradient(color-mix(in oklab, var(--st-text) 13%, transparent) 1px, transparent 1px)",
          backgroundSize: "16px 16px",
        }}
      >
        {hero.flow === "column" ? (
          <Column scene={scene} ends={ends} />
        ) : (
          <Row scene={scene} ends={ends} />
        )}

        <div className="absolute inset-x-0 bottom-0 flex h-8 items-center gap-2 border-t border-(--st-border) bg-(--st-panel) px-3.5 text-[10px]">
          {running ? (
            <>
              <Loader2 className="h-3 w-3 animate-spin text-(--st-muted) motion-reduce:animate-none" />
              <span className="text-(--st-muted)">Running · step {step} of 3</span>
            </>
          ) : (
            <span className={cn(ENTER, "flex items-center gap-1.5 font-medium text-(--st-add)")}>
              <Check className="h-3 w-3" strokeWidth={3} /> Succeeded · 3 of 3 steps
            </span>
          )}
          <span className="ml-auto flex items-center gap-1.5 text-(--st-faint)">
            <span className="h-1.5 w-1.5 rounded-full bg-(--st-add)" /> Rankbox MCP
          </span>
        </div>
      </div>
    </div>
  );
}

/* ---------- Across the canvas ---------- */

function Row({ scene, ends }: { scene: Scene; ends: Ends }) {
  const { hero, task, sample, phase } = scene;
  const round = !!hero.round;
  const rankbox = (
    <RankboxTile
      tone="brand"
      className={cn("h-full w-full", round ? "rounded-full" : "rounded-[inherit]")}
    />
  );
  const out = phase >= RESULT;
  return (
    <div className="absolute inset-x-0 bottom-8 top-0 flex flex-col justify-center gap-6 px-3 @min-[25rem]:px-6">
      <div className="flex items-start justify-center">
        <Node
          round={round}
          icon={<Tile icon={ends.trigger.icon} round={round} />}
          title={ends.trigger.title}
          sub={ends.trigger.sub}
          state={stateOf(phase, ASK, CALL)}
        />
        <Wire active={phase === CALL} done={phase >= CALL} />
        {hero.agent ? (
          <Node
            round={round}
            icon={<Tile icon={Bot} round={round} neutral />}
            title="AI Agent"
            sub="Tools: Rankbox"
            state={stateOf(phase, CALL, APPLY)}
            below={
              <ToolPod task={task} state={stateOf(phase, CALL, RESULT)} active={phase === CALL} />
            }
          />
        ) : (
          <Node
            round={round}
            icon={rankbox}
            title="Rankbox"
            sub={TOOL_NAMES[task].label}
            state={stateOf(phase, CALL, RESULT)}
          />
        )}
        <Wire active={phase === APPLY} done={phase >= APPLY} />
        <Node
          round={round}
          icon={<Tile icon={ends.out.icon} round={round} />}
          title={ends.out.title}
          sub={ends.out.sub}
          state={stateOf(phase, APPLY, DONE)}
        />
      </div>

      {/* Held in place while hidden, so the canvas doesn't shift when it lands. */}
      <div
        key={out ? "out" : "waiting"}
        aria-hidden={!out}
        className={cn(
          "rounded-xl border border-(--st-border) bg-(--st-bg) p-3 shadow-[0_12px_32px_-12px_rgba(0,0,0,0.35)]",
          out ? ENTER : "invisible",
        )}
      >
        <OutputHeader task={task} summary={taskSummary(task, sample)} />
        <Result scene={scene} />
      </div>
    </div>
  );
}

function Node({
  icon,
  title,
  sub,
  state,
  round,
  below,
}: {
  icon: ReactNode;
  title: string;
  sub: string;
  state: State;
  round: boolean;
  below?: ReactNode;
}) {
  return (
    <div className="flex w-[5.4rem] shrink-0 flex-col items-center text-center @min-[25rem]:w-[6.4rem]">
      <div
        className={cn(
          "relative h-14 w-14 border bg-(--st-bg) p-1.5 shadow-[0_2px_6px_rgba(0,0,0,0.08)] transition-all duration-300",
          round ? "rounded-full" : "rounded-2xl",
          state === "run"
            ? "border-(--st-accent) ring-4 ring-(--st-accent)/20"
            : "border-(--st-border)",
        )}
      >
        <div className={cn("h-full w-full overflow-hidden", round ? "rounded-full" : "rounded-xl")}>
          {icon}
        </div>
        <Badge state={state} />
      </div>
      <p className="mt-2 max-w-full truncate text-[10.5px] font-semibold leading-tight">{title}</p>
      <p className="mt-0.5 max-w-full truncate text-[9.5px] text-(--st-muted)">{sub}</p>
      {below}
    </div>
  );
}

function Tile({
  icon: Icon,
  round,
  neutral,
}: {
  icon: LucideIcon;
  round: boolean;
  neutral?: boolean;
}) {
  return (
    <span
      className={cn(
        "grid h-full w-full place-items-center",
        neutral
          ? "bg-(--st-text)/8 text-(--st-text)"
          : round
            ? "bg-(--st-accent) text-(--st-on-accent)"
            : "bg-(--st-accent)/12 text-(--st-accent-ink)",
      )}
    >
      <Icon className="h-5 w-5" strokeWidth={1.9} />
    </span>
  );
}

function Badge({ state }: { state: State }) {
  if (state === "idle") return null;
  return (
    <span
      className={cn(
        "absolute -right-1.5 -top-1.5 grid h-[18px] w-[18px] place-items-center rounded-full border-2 border-(--st-bg)",
        state === "done" ? "bg-(--st-add) text-white" : "bg-(--st-accent) text-(--st-on-accent)",
      )}
    >
      {state === "done" ? (
        <Check className="h-2.5 w-2.5" strokeWidth={3.5} />
      ) : (
        <Loader2 className="h-2.5 w-2.5 animate-spin motion-reduce:animate-none" strokeWidth={3} />
      )}
    </span>
  );
}

/** A connection between two steps; a packet runs along it while it fires. */
function Wire({ active, done, vertical }: { active: boolean; done: boolean; vertical?: boolean }) {
  const line = vertical ? { x1: 1, y1: 0, x2: 1, y2: 100 } : { x1: 0, y1: 1, x2: 100, y2: 1 };
  return (
    <svg
      aria-hidden
      viewBox={vertical ? "0 0 2 100" : "0 0 100 2"}
      preserveAspectRatio="none"
      className={cn(
        "overflow-visible",
        vertical ? "mx-auto h-6 w-[2px]" : "mt-[27px] h-[2px] min-w-3 flex-1",
      )}
    >
      <line
        {...line}
        stroke={done ? "var(--st-accent)" : "var(--st-faint)"}
        strokeOpacity={done ? 0.55 : 0.9}
        strokeWidth={1.5}
        strokeDasharray={done ? undefined : "3 3"}
        vectorEffect="non-scaling-stroke"
      />
      {active && (
        <line
          {...line}
          pathLength={100}
          stroke="var(--st-accent)"
          strokeWidth={3.5}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          className="animate-packet"
          style={{ "--packet-duration": "1s" } as CSSProperties}
        />
      )}
    </svg>
  );
}

/** Rankbox hanging off an agent step, as the tool it calls. */
function ToolPod({ task, state, active }: { task: RankboxTool; state: State; active: boolean }) {
  return (
    <div className="flex flex-col items-center">
      <Wire vertical active={active} done={state !== "idle"} />
      <span
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full border bg-(--st-bg) py-[3px] pl-[3px] pr-2 text-[9.5px] font-semibold shadow-[0_2px_6px_rgba(0,0,0,0.08)] transition-colors duration-300",
          state === "run" ? "border-(--st-accent)" : "border-(--st-border)",
        )}
        title={TOOL_NAMES[task].mcp}
      >
        <RankboxTile tone="brand" className="h-4 w-4" />
        Rankbox
        {state === "done" && <Check className="h-2.5 w-2.5 text-(--st-add)" strokeWidth={3.5} />}
        {state === "run" && (
          <Loader2 className="h-2.5 w-2.5 animate-spin text-(--st-muted) motion-reduce:animate-none" />
        )}
      </span>
    </div>
  );
}

/* ---------- Top to bottom ---------- */

function Column({ scene, ends }: { scene: Scene; ends: Ends }) {
  const { task, sample, phase } = scene;
  return (
    <div className="mx-auto flex w-[88%] max-w-[21rem] flex-col pt-5">
      <Card
        n={1}
        icon={<Tile icon={ends.trigger.icon} round={false} />}
        title={ends.trigger.title}
        sub={ends.trigger.sub}
        state={stateOf(phase, ASK, CALL)}
      />
      <Wire vertical active={phase === CALL} done={phase >= CALL} />
      <Card
        n={2}
        icon={<RankboxTile tone="brand" className="h-full w-full rounded-[inherit]" />}
        title="Rankbox"
        sub={`Run tool · ${TOOL_NAMES[task].mcp}`}
        state={stateOf(phase, CALL, RESULT)}
      >
        {phase >= RESULT && (
          <div className="mt-2.5 border-t border-(--st-border) pt-2.5">
            <OutputHeader task={task} summary={taskSummary(task, sample)} />
            <Result scene={scene} compact />
          </div>
        )}
      </Card>
      <Wire vertical active={phase === APPLY} done={phase >= APPLY} />
      <Card
        n={3}
        icon={<Tile icon={ends.out.icon} round={false} />}
        title={ends.out.title}
        sub={ends.out.sub}
        state={stateOf(phase, APPLY, DONE)}
      />
    </div>
  );
}

function Card({
  n,
  icon,
  title,
  sub,
  state,
  children,
}: {
  n: number;
  icon: ReactNode;
  title: string;
  sub: string;
  state: State;
  children?: ReactNode;
}) {
  return (
    <div
      className={cn(
        "relative rounded-xl border bg-(--st-bg) px-3 py-2.5 shadow-[0_2px_6px_rgba(0,0,0,0.06)] transition-all duration-300",
        state === "run"
          ? "border-(--st-accent) ring-4 ring-(--st-accent)/15"
          : "border-(--st-border)",
      )}
    >
      <div className="flex items-center gap-2.5">
        <span className="h-8 w-8 shrink-0 overflow-hidden rounded-lg">{icon}</span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[11px] font-semibold leading-tight">
            <span className="mr-1 text-(--st-faint)">{n}.</span>
            {title}
          </p>
          <p className="mt-0.5 truncate font-mono text-[9.5px] text-(--st-muted)">{sub}</p>
        </div>
        {state !== "idle" && (
          <span
            className={cn(
              "grid h-[18px] w-[18px] shrink-0 place-items-center rounded-full",
              state === "done"
                ? "bg-(--st-add) text-white"
                : "bg-(--st-accent) text-(--st-on-accent)",
            )}
          >
            {state === "done" ? (
              <Check className="h-2.5 w-2.5" strokeWidth={3.5} />
            ) : (
              <Loader2
                className="h-2.5 w-2.5 animate-spin motion-reduce:animate-none"
                strokeWidth={3}
              />
            )}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}

/* ---------- Output ---------- */

function OutputHeader({ task, summary }: { task: RankboxTool; summary: string }) {
  return (
    <p className="mb-2 flex items-center justify-between gap-2 text-[9.5px] font-semibold uppercase tracking-[0.08em] text-(--st-muted)">
      <span>Output · {TOOL_NAMES[task].label}</span>
      <span className="truncate font-normal normal-case tracking-normal text-(--st-faint)">
        {summary}
      </span>
    </p>
  );
}

/** `compact`: inside a step card, where the list has less room. */
function Result({ scene, compact = false }: { scene: Scene; compact?: boolean }) {
  const { task, sample, phase } = scene;
  if (task === "questions") return <QuestionsResult sample={sample} />;
  if (task === "brief") return <BriefResult sample={sample} max={3} entities={false} />;
  return <MetaResult sample={sample} max={compact ? 2 : 3} pick={phase >= APPLY ? 0 : undefined} />;
}
