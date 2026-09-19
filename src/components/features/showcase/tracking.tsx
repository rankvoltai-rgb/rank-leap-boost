import { TrendingUp } from "lucide-react";
import { AI_MARKS } from "@/components/landing/ai-logos";
import { AnswerMonitor } from "@/components/landing/AnswerMonitor";
import { AreaChart } from "@/components/landing/charts";
import { Chip, Label, Meter, Panel, useCountUp, useInView } from "./kit";

/* The landing's Answer Monitor is this feature, running: a buyer asks, the
   answer streams, and the visitor's domain flips from "not cited" to cited. */
export function TrackingHero({ className }: { className?: string }) {
  return <AnswerMonitor domain="yourbrand.com" className={className} />;
}

/* ---------- Benefits ---------- */

const SHARE = [
  { name: "Perplexity", pct: 46 },
  { name: "ChatGPT", pct: 38 },
  { name: "Google", pct: 31, label: "Google AI Overviews" },
  { name: "Claude", pct: 24 },
  { name: "Gemini", pct: 19 },
] as const;

function EngineCoverage() {
  const [ref, inView] = useInView<HTMLDivElement>("-40px");
  return (
    <div ref={ref}>
      <Panel>
        <Label right="Last 30 days">Cited in tracked prompts</Label>
        <div className="mt-3 space-y-2.5">
          {SHARE.map((s) => {
            const Mark = AI_MARKS.find((m) => m.name === s.name)!.Mark;
            return (
              <div key={s.name} className="flex items-center gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-white ring-1 ring-border">
                  <Mark className="h-3.5 w-3.5" />
                </span>
                <span className="w-32 shrink-0 truncate text-xs font-medium text-ink">
                  {"label" in s ? s.label : s.name}
                </span>
                <Meter value={inView ? s.pct * 1.6 : 0} />
                <span className="w-9 shrink-0 text-right text-xs font-semibold tabular-nums text-ink">
                  {s.pct}%
                </span>
              </div>
            );
          })}
        </div>
      </Panel>
    </div>
  );
}

const WINNERS = [
  { t: "Kanban vs Scrum: Which Fits a Small Team?", n: 41, e: ["ChatGPT", "Perplexity"] },
  { t: "Best Project Tools for Small Teams", n: 33, e: ["Perplexity", "Google"] },
  { t: "How to Run Async Standups", n: 18, e: ["Claude"] },
  { t: "Free Planning Apps Worth Trying", n: 7, e: ["Gemini"] },
] as const;

function WhatWorks() {
  return (
    <Panel className="h-full">
      <Label right="Citations">Top cited articles</Label>
      <div className="mt-3 space-y-1.5">
        {WINNERS.map((w, i) => (
          <div
            key={w.t}
            className="flex items-center gap-2.5 rounded-lg bg-card px-3 py-2 ring-1 ring-border"
          >
            <span className="w-3 shrink-0 text-[0.65rem] font-semibold text-muted-foreground">
              {i + 1}
            </span>
            <span className="min-w-0 flex-1 truncate text-xs font-medium text-ink">{w.t}</span>
            <span className="flex -space-x-1">
              {w.e.map((e) => {
                const Mark = AI_MARKS.find((m) => m.name === e)!.Mark;
                return (
                  <span
                    key={e}
                    className="flex h-4 w-4 items-center justify-center rounded bg-white ring-1 ring-border"
                  >
                    <Mark className="h-2.5 w-2.5" />
                  </span>
                );
              })}
            </span>
            <span className="w-6 text-right text-xs font-semibold tabular-nums text-ink">
              {w.n}
            </span>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function Impact() {
  const [ref, inView] = useInView<HTMLDivElement>("-40px");
  const total = useCountUp(148, { run: inView });
  return (
    <div ref={ref} className="h-full">
      <Panel className="flex h-full flex-col">
        <div className="grid grid-cols-3 gap-3">
          <div>
            <p className="text-[0.65rem] text-muted-foreground">AI citations</p>
            <p className="flex items-baseline gap-1.5 text-xl font-semibold tracking-tight text-ink tabular-nums">
              {total}
              <span className="flex items-center gap-0.5 text-[0.65rem] font-semibold text-success">
                <TrendingUp className="h-3 w-3" /> 62%
              </span>
            </p>
          </div>
          <div>
            <p className="text-[0.65rem] text-muted-foreground">Prompts won</p>
            <p className="text-xl font-semibold tracking-tight text-ink tabular-nums">
              23<span className="text-sm text-muted-foreground">/40</span>
            </p>
          </div>
          <div>
            <p className="text-[0.65rem] text-muted-foreground">Top engine</p>
            <p className="text-xl font-semibold tracking-tight text-ink">Perplexity</p>
          </div>
        </div>
        <AreaChart
          points={[4, 6, 5, 9, 12, 11, 15, 19, 18, 24, 29, 36]}
          className="mt-4 h-28 w-full flex-1"
          stroke="var(--volt)"
          fill="var(--volt)"
        />
        <div className="mt-2 flex items-center justify-between text-[0.6rem] text-muted-foreground">
          <span>12 weeks ago</span>
          <Chip tone="volt">Weekly citations</Chip>
          <span>This week</span>
        </div>
      </Panel>
    </div>
  );
}

export const trackingBenefits = [EngineCoverage, WhatWorks, Impact];
