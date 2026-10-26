/**
 * The small sample screens on /alternatives/seobot: one per deep dive, the
 * hand-off between the two tools while you switch, and the month of articles
 * that rises from the closing band. All of them are Rankbox-side samples on
 * "yoursite.com", drawn as white cards with hairline borders; text that
 * would have to be invented (a thread, a reply) is drawn as grey lines.
 */
import type { ReactNode } from "react";
import { motion } from "motion/react";
import { Check, FileText, Pause, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { RedditMark } from "@/components/landing/ai-logos";
import { CompetitorMark, RankboxMark } from "@/components/alternatives/kit";
import { PLAN } from "@/data/pricing";
import type { Competitor, Step } from "@/data/alternatives";
import { CARD_SHADOW } from "./tokens";
import { EASE, useStill } from "./clock";

function SampleCard({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "w-full max-w-[20rem] rounded-xl border border-ink/[0.08] bg-white p-4",
        CARD_SHADOW,
        className,
      )}
    >
      {children}
    </div>
  );
}

function Lines({ widths, className }: { widths: string[]; className?: string }) {
  return (
    <span className={cn("block space-y-1.5", className)}>
      {widths.map((w, i) => (
        <span key={i} className="block h-1.5 rounded-full bg-ink/[0.08]" style={{ width: w }} />
      ))}
    </span>
  );
}

/* ---------- Deep dive 1: backlink credits ---------- */

export function CreditsPicture() {
  const total = PLAN.backlinkCreditsPerMonth;
  const spent = 1;
  const held = 3;
  return (
    <SampleCard>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[0.8rem] font-semibold text-ink">Backlink credits</p>
          <p className="text-[0.7rem] text-muted-foreground">yoursite.com · this month</p>
        </div>
        <p className="font-display text-[1.5rem] font-medium leading-none tracking-[-0.02em] text-ink tabular-nums">
          {total}
        </p>
      </div>
      <div className="mt-3 grid grid-cols-10 gap-1">
        {Array.from({ length: total }, (_, i) => (
          <span
            key={i}
            className={cn(
              "aspect-square rounded-[3px]",
              i < spent
                ? "bg-cta"
                : i < spent + held
                  ? "border border-cta/45 bg-cta-soft"
                  : "border border-ink/[0.1] bg-white",
            )}
          />
        ))}
      </div>
      <ul className="mt-3.5 space-y-1.5 text-[0.72rem]">
        <li className="flex items-center justify-between gap-2 rounded-lg border border-ink/[0.07] px-2.5 py-1.5">
          <span className="text-ink">Host site · tier 1</span>
          <span className="flex items-center gap-2">
            <span className="tabular-nums text-muted-foreground">1 credit</span>
            <span className="rounded-md bg-cta px-1.5 py-px text-[0.66rem] font-medium text-white">
              Verified
            </span>
          </span>
        </li>
        <li className="flex items-center justify-between gap-2 rounded-lg border border-ink/[0.07] px-2.5 py-1.5">
          <span className="text-ink">Host site · tier 3</span>
          <span className="flex items-center gap-2">
            <span className="tabular-nums text-muted-foreground">3 credits</span>
            <span className="rounded-md bg-cta-soft px-1.5 py-px text-[0.66rem] font-medium text-cta-hover">
              In escrow
            </span>
          </span>
        </li>
      </ul>
    </SampleCard>
  );
}

/* ---------- Deep dive 2: every draft checked ---------- */

const CHECKS = ["Direct answer up top", "Key takeaways", "Sources cited inline", "FAQ section"];

export function DraftPicture() {
  return (
    <SampleCard>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[0.8rem] font-semibold text-ink">Draft check</p>
          <p className="truncate text-[0.7rem] text-muted-foreground">yoursite.com/blog/…</p>
        </div>
        <span className="shrink-0 rounded-md border border-ink/[0.08] bg-white px-1.5 py-px text-[0.66rem] font-medium tabular-nums text-ink">
          Rewrite 2 of 3
        </span>
      </div>
      <ul className="mt-3 space-y-1.5 text-[0.74rem]">
        {CHECKS.map((c) => (
          <li key={c} className="flex items-center gap-2">
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-cta text-white">
              <Check className="h-2.5 w-2.5" strokeWidth={3.2} />
            </span>
            <span className="text-ink">{c}</span>
          </li>
        ))}
        <li className="flex items-center gap-2 rounded-lg border border-cta/40 bg-cta-soft px-2 py-1.5">
          <RefreshCw className="h-3.5 w-3.5 text-cta motion-safe:animate-[spin_3s_linear_infinite]" />
          <span className="text-cta-hover">Failing check · rewriting</span>
        </li>
      </ul>
      <p className="mt-3 border-t border-ink/[0.07] pt-2.5 text-[0.7rem] text-muted-foreground">
        Marked ready once every check passes
      </p>
    </SampleCard>
  );
}

/* ---------- Deep dive 3: Reddit ---------- */

export function RedditPicture() {
  return (
    <SampleCard>
      <div className="flex items-center gap-2">
        <span className="flex h-6 w-6 items-center justify-center rounded-md border border-ink/[0.08] bg-white">
          <RedditMark className="h-4 w-4" />
        </span>
        <p className="text-[0.8rem] font-semibold text-ink">A thread your buyers read</p>
      </div>
      <Lines widths={["92%", "78%", "54%"]} className="mt-3" />
      <div className="mt-3.5 rounded-lg border border-cta/35 bg-cta-soft/60 p-2.5">
        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.1em] text-cta-hover">
          Reply draft
        </p>
        <Lines widths={["96%", "88%", "70%"]} className="mt-2" />
      </div>
      <div className="mt-3 flex items-center justify-between gap-2">
        <span className="rounded-md border border-ink/[0.1] bg-white px-2 py-1 text-[0.7rem] font-medium text-ink">
          Copy reply
        </span>
        <span className="text-[0.7rem] text-muted-foreground">You post it yourself</span>
      </div>
    </SampleCard>
  );
}

/* ---------- Switching: the hand-off ---------- */

/**
 * The two tools over the three steps of switching. SEObot keeps running
 * until the last step, where it is paused; Rankbox sets up over the first
 * two (dotted) and publishes from the third (solid). The bars draw in once,
 * left to right, as the card comes on screen.
 */
export function Handoff({ competitor, steps }: { competitor: Competitor; steps: Step[] }) {
  const n = steps.length;
  const still = useStill();
  const draw = (delay: number) =>
    still
      ? { initial: false as const, animate: { scaleX: 1 }, transition: { duration: 0 } }
      : {
          initial: { scaleX: 0 },
          whileInView: { scaleX: 1 },
          viewport: { once: true, amount: 0.6 },
          transition: { duration: 0.9, delay, ease: EASE },
        };

  return (
    <div
      role="img"
      aria-label={`While you switch, ${competitor.name} keeps running through the first ${n - 1} steps and is paused at step ${n}; Rankbox sets up during the first ${n - 1} and publishes from step ${n}.`}
      className={cn(
        "mx-auto w-full max-w-4xl overflow-hidden rounded-xl border border-ink/[0.08] bg-white",
        CARD_SHADOW,
      )}
    >
      <div className="grid grid-cols-[6.6rem_minmax(0,1fr)] sm:grid-cols-[8.5rem_minmax(0,1fr)]">
        <div className="border-b border-r border-ink/[0.07]" />
        <div
          className="grid border-b border-ink/[0.07]"
          style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }}
        >
          {steps.map((s, i) => (
            <div
              key={s.title}
              className={cn("px-3 py-3 sm:px-4", i > 0 && "border-l border-ink/[0.07]")}
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-md bg-cta-soft text-[0.68rem] font-semibold text-brand-blue">
                {i + 1}
              </span>
              <p className="mt-1.5 hidden text-[0.78rem] font-medium leading-snug text-ink sm:block">
                {s.title}
              </p>
            </div>
          ))}
        </div>

        {/* SEObot lane */}
        <div className="flex items-center gap-2 border-b border-r border-ink/[0.07] px-3 py-4 sm:px-4">
          <CompetitorMark competitor={competitor} className="h-5 w-5 text-[0.45rem]" />
          <span className="truncate text-[0.75rem] font-medium text-ink">{competitor.name}</span>
        </div>
        <div className="relative flex items-center border-b border-ink/[0.07] px-3 py-4 sm:px-4">
          <motion.span
            {...draw(0.1)}
            style={{ originX: 0, width: `${((n - 0.5) / n) * 100}%` }}
            className="block h-2 rounded-full bg-ink/[0.16]"
          />
          <span className="ml-2 flex shrink-0 items-center gap-1 text-[0.7rem] font-medium text-muted-foreground">
            <Pause className="h-3 w-3" />
            Paused
          </span>
        </div>

        {/* Rankbox lane */}
        <div className="flex items-center gap-2 border-r border-ink/[0.07] px-3 py-4 sm:px-4">
          <RankboxMark className="h-5 w-5" />
          <span className="text-[0.75rem] font-medium text-ink">Rankbox</span>
        </div>
        <div className="relative flex items-center px-3 py-4 sm:px-4">
          <motion.span
            {...draw(0.35)}
            style={{ originX: 0, width: `${((n - 1) / n) * 100}%` }}
            className="block h-0 border-t-2 border-dotted border-cta/50"
          />
          <motion.span
            {...draw(1.05)}
            style={{ originX: 0 }}
            className="block h-2 flex-1 rounded-full bg-cta"
          />
          <span className="ml-2 shrink-0 text-[0.7rem] font-medium text-cta-hover">Live</span>
        </div>
      </div>
      <p className="border-t border-ink/[0.07] px-4 py-2.5 text-[0.7rem] text-muted-foreground">
        Dotted: setting up · Solid: running
      </p>
    </div>
  );
}

/* ---------- Closing band: a month of articles ---------- */

export function MonthCard() {
  const days = PLAN.articlesPerMonth;
  const still = useStill();
  return (
    <div
      aria-hidden
      className="rounded-t-xl border border-b-0 border-white/60 bg-white p-4 text-left shadow-[0_-12px_48px_-16px_rgba(4,24,72,0.55)] sm:p-5"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <RankboxMark className="h-6 w-6" />
          <div>
            <p className="text-[0.8rem] font-semibold text-ink">yoursite.com</p>
            <p className="text-[0.68rem] text-muted-foreground">Sample month</p>
          </div>
        </div>
        <span className="rounded-md bg-cta-soft px-2 py-0.5 text-[0.7rem] font-medium tabular-nums text-cta-hover">
          {days} articles
        </span>
      </div>
      <ol className="mt-4 grid grid-cols-6 gap-1.5 sm:grid-cols-10">
        {Array.from({ length: days }, (_, i) => (
          <motion.li
            key={i}
            initial={still ? false : { opacity: 0, scale: 0.85 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={
              still ? { duration: 0 } : { duration: 0.35, delay: 0.25 + i * 0.03, ease: EASE }
            }
            className="flex aspect-square flex-col items-center justify-center gap-0.5 rounded-md border border-cta/25 bg-cta-soft text-cta"
          >
            <FileText className="h-3 w-3" />
            <span className="text-[0.55rem] font-medium tabular-nums text-cta-hover">{i + 1}</span>
          </motion.li>
        ))}
      </ol>
    </div>
  );
}
