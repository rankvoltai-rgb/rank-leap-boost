/**
 * Voice agents: a test call. You ask out loud (transcribed as you speak), the
 * agent looks it up with Rankbox, and answers. The waveform shows whose turn
 * it is: yours, the agent thinking, or the agent speaking.
 */
import type { CSSProperties } from "react";
import { Mic, PhoneOff, Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { RankboxTool } from "@/data/ai-integration-samples";
import { CallPill, Caret, Chrome, ENTER, ToolMark, taskSummary } from "./parts";
import { APPLY, ASK, CALL, RESULT, useTyped, type Scene } from "./story";

/** The call, on the builder sample (meal-prep delivery). */
export const VOICE_SCRIPT: Record<RankboxTool, { you: string; agent: string }> = {
  questions: {
    you: "What are people asking AI about meal-prep delivery?",
    agent:
      "Mostly cost and freshness. The top three: what weekly delivery costs, how long meals stay fresh, and whether it beats meal kits.",
  },
  brief: {
    you: "Give me an outline for a post on meal prep for beginners.",
    agent:
      "Five sections. Start with what meal prep is and isn't, then the containers you need, then a first-week menu.",
  },
  meta: {
    you: "Write a meta description for our pricing page.",
    agent:
      "Here's the strongest: see exactly what weekly meal-prep delivery costs, with no hidden fees.",
  },
};

const BARS = Array.from({ length: 36 }, (_, i) => {
  // A bell-shaped envelope with some texture, fixed so server and client agree.
  const envelope = Math.sin((Math.PI * (i + 0.5)) / 36);
  const texture = 0.55 + 0.45 * Math.abs(Math.sin(i * 1.7));
  return {
    h: Math.round(14 + 76 * envelope * texture),
    delay: `${(i * 97) % 700}ms`,
    duration: `${720 + ((i * 131) % 480)}ms`,
  };
});

export function VoiceStage({ scene }: { scene: Scene }) {
  const { tool, task, sample, phase } = scene;
  const script = VOICE_SCRIPT[task];
  const you = useTyped(script.you, phase === ASK, 34);
  const agent = useTyped(script.agent, phase === APPLY, 16);
  const turn =
    phase === ASK ? "you" : phase === APPLY ? "agent" : phase < APPLY ? "thinking" : "idle";
  const status = {
    you: "Listening…",
    thinking: "Looking it up with Rankbox…",
    agent: "Speaking…",
    idle: "Your turn",
  }[turn];

  return (
    <div className="flex h-full flex-col bg-(--st-bg)">
      <Chrome
        right={
          <span className="flex items-center gap-1.5 text-[10.5px] font-medium text-(--st-muted)">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#EF4444] motion-reduce:animate-none" />
            Live
          </span>
        }
      >
        <span className="flex min-w-0 items-center gap-2 text-[12px]">
          <ToolMark tool={tool} className="h-[18px] w-[18px]" />
          <span className="truncate font-semibold">{tool.name}</span>
          <span className="text-(--st-faint)">·</span>
          <span className="truncate text-(--st-muted)">Test call</span>
        </span>
      </Chrome>

      <div
        className="relative flex min-h-0 flex-1 flex-col items-center px-4 pb-4 pt-5 @min-[25rem]:px-6"
        style={{
          backgroundImage:
            "radial-gradient(70% 45% at 50% 18%, color-mix(in oklab, var(--st-accent) 16%, transparent), transparent 70%)",
        }}
      >
        <p className="flex items-center gap-2 text-[11px] font-semibold">
          Meal-prep research agent
          <span className="rounded-full bg-(--st-accent)/15 px-2 py-px text-[9.5px] text-(--st-accent-ink)">
            Rankbox tools on
          </span>
        </p>

        <div aria-hidden className="mt-3 flex h-24 items-center gap-[3.5px]">
          {BARS.map((b, i) => (
            <span
              key={i}
              className={cn(
                "w-[3.5px] origin-center rounded-full transition-[background-color,transform] duration-500",
                (turn === "you" || turn === "agent") &&
                  "animate-voice-bar motion-reduce:animate-none",
                turn === "agent"
                  ? "bg-(--st-accent)"
                  : turn === "you"
                    ? "bg-(--st-text)/70"
                    : "bg-(--st-text)/25",
              )}
              style={
                {
                  height: b.h,
                  // Thinking: a flat line. Idle: the wave at rest.
                  transform:
                    turn === "thinking"
                      ? "scaleY(0.1)"
                      : turn === "idle"
                        ? "scaleY(0.5)"
                        : undefined,
                  "--bar-delay": b.delay,
                  "--bar-duration": b.duration,
                } as CSSProperties
              }
            />
          ))}
        </div>
        <p className="mt-2 text-[10px] font-medium uppercase tracking-[0.12em] text-(--st-muted)">
          {status}
        </p>

        <div className="mt-3 flex min-h-0 w-full flex-1 flex-col justify-end gap-2.5 overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_24px)]">
          <Line who="You" className={phase <= ASK ? undefined : "opacity-70"}>
            {you.typed}
            {phase === ASK && <Caret />}
          </Line>
          {phase >= CALL && (
            <div className={cn(ENTER, "flex flex-wrap items-center gap-2 pl-[3.25rem]")}>
              <CallPill task={task} done={phase >= RESULT} />
              {phase >= RESULT && (
                <span className={cn(ENTER, "text-[10.5px] text-(--st-muted)")}>
                  {taskSummary(task, sample)}
                </span>
              )}
            </div>
          )}
          {phase >= APPLY && (
            <Line who="Agent" accent>
              {agent.typed}
              {phase === APPLY && agent.typing && <Caret />}
            </Line>
          )}
        </div>

        <div className="mt-4 flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-(--st-text)/8 text-(--st-text)">
            <Mic className="h-4 w-4" />
          </span>
          <span className="grid h-11 w-11 place-items-center rounded-full bg-[#EF4444] text-white shadow-[0_6px_16px_-6px_rgba(239,68,68,0.8)]">
            <PhoneOff className="h-4.5 w-4.5" />
          </span>
          <span className="grid h-9 w-9 place-items-center rounded-full bg-(--st-text)/8 text-(--st-text)">
            <Volume2 className="h-4 w-4" />
          </span>
        </div>
      </div>
    </div>
  );
}

function Line({
  who,
  accent,
  className,
  children,
}: {
  who: string;
  accent?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <p
      className={cn(
        "flex gap-3 text-[12px] leading-snug transition-opacity duration-500",
        className,
      )}
    >
      <span
        className={cn(
          "w-10 shrink-0 pt-px text-right text-[9.5px] font-semibold uppercase tracking-[0.08em]",
          accent ? "text-(--st-accent-ink)" : "text-(--st-muted)",
        )}
      >
        {who}
      </span>
      <span className="min-w-0 flex-1">{children}</span>
    </p>
  );
}
