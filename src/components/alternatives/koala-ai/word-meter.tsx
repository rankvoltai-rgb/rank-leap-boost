/**
 * The page's focal picture: one month of articles run through both plans.
 *
 * Koala sells a word allowance, and its default model counts every word
 * written twice, so its side is a meter: an odometer of words counted and a
 * bar of the allowance, one notch per article. Rankbox sells articles, so
 * its side is thirty tiles, one per article, with nothing to meter. Both run
 * on one clock, an article a step, and the plan switch lets the reader put
 * any of Koala's word plans on the meter — including Boost, where Koala
 * writes more articles than Rankbox's thirty, because that's what the
 * numbers say.
 *
 * Every number comes from meter-data.ts, which reads the comparison's data.
 * The run starts when half the card is on screen, stops at the end of the
 * month, and starts over once the card has left the screen. The server, and
 * anyone with reduced motion, gets the finished month as a still.
 */
import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { CalendarClock, FileText, Gauge, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { Band } from "@/components/landing/frame";
import { Reveal } from "@/components/landing/shared";
import { CompetitorMark, RankboxMark } from "@/components/alternatives/kit";
import { PLAN, formatUsd } from "@/data/pricing";
import { formatCheckedOn, type Competitor } from "@/data/alternatives";
import { formatWords, readMeter, type Meter, type MeterPlan } from "./meter-data";
import { RulerTicks } from "./parts";
import { displayUrl } from "./tokens";

/* ---------- the odometer ---------- */

/* One wheel of the odometer: a strip of 0–9 slid to the digit. */
function Wheel({ digit, dim }: { digit: number; dim: boolean }) {
  return (
    <span className="relative inline-block h-[1em] w-[0.6em] overflow-hidden">
      <span
        className={cn(
          "absolute inset-x-0 top-0 flex flex-col motion-safe:transition-transform motion-safe:duration-300 motion-safe:ease-out",
          dim ? "text-ink/[0.16]" : "text-ink",
        )}
        style={{ transform: `translateY(${-digit}em)` }}
      >
        {Array.from({ length: 10 }, (_, n) => (
          <span key={n} className="block h-[1em] text-center leading-none">
            {n}
          </span>
        ))}
      </span>
    </span>
  );
}

/** `value` padded to as many digits as `max`, comma-grouped, leading zeros dimmed. */
function Odometer({ value, max, className }: { value: number; max: number; className?: string }) {
  const width = String(max).length;
  const digits = String(value).padStart(width, "0");
  const firstReal = digits.search(/[1-9]/);
  const lead = firstReal === -1 ? width - 1 : firstReal;
  const out: React.ReactNode[] = [];
  for (let i = 0; i < width; i++) {
    if (i > 0 && (width - i) % 3 === 0) {
      out.push(
        <span
          key={`c${i}`}
          className={cn("w-[0.28em] text-center", i <= lead && "text-ink/[0.16]")}
        >
          ,
        </span>,
      );
    }
    out.push(<Wheel key={i} digit={Number(digits[i])} dim={i < lead} />);
  }
  return (
    <span
      aria-hidden
      className={cn(
        "inline-flex items-end font-display font-medium leading-none tracking-[-0.02em] tabular-nums",
        className,
      )}
    >
      {out}
    </span>
  );
}

/* ---------- pieces of each side ---------- */

function Chip({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border border-ink/[0.08] bg-white px-2 py-1 text-[0.72rem] font-medium text-ink shadow-[0_1px_1px_rgba(16,24,40,0.03)]",
        className,
      )}
    >
      {children}
    </span>
  );
}

const OP = "px-0.5 text-[0.8rem] font-medium text-muted-foreground";

function SideHead({
  mark,
  name,
  unit,
  plan,
}: {
  mark: React.ReactNode;
  name: string;
  unit: string;
  plan: string;
}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="flex min-w-0 items-center gap-2.5">
        {mark}
        <div className="min-w-0">
          <p className="text-[0.95rem] font-semibold leading-tight text-ink">{name}</p>
          <p className="mt-0.5 text-[0.75rem] text-muted-foreground">{unit}</p>
        </div>
      </div>
      <span className="shrink-0 rounded-md bg-[color-mix(in_oklab,var(--ink)_5%,white)] px-2 py-1 text-[0.72rem] font-medium tabular-nums text-ink">
        {plan}
      </span>
    </div>
  );
}

const LABEL = "text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground";

function KoalaSide({
  competitor,
  meter,
  plan,
  done,
}: {
  competitor: Competitor;
  meter: Meter;
  plan: MeterPlan;
  /** Articles written so far this month. */
  done: number;
}) {
  const used = done * meter.counted;
  const full = done >= plan.articles;
  return (
    <div className="flex flex-col p-5 sm:p-7">
      <SideHead
        mark={<CompetitorMark competitor={competitor} className="h-9 w-9" />}
        name={competitor.name}
        unit="Sold by the word"
        plan={`${plan.name} · ${formatUsd(plan.monthly)}/mo`}
      />

      <p className={cn(LABEL, "mt-7")}>Words counted</p>
      <div className="mt-2 flex flex-wrap items-end gap-x-3 gap-y-1">
        <Odometer value={used} max={plan.words} className="text-[2.3rem] sm:text-[2.8rem]" />
        <span className="pb-1 text-[0.85rem] tabular-nums text-muted-foreground">
          of {formatWords(plan.words)}
        </span>
      </div>

      {/* The allowance, one notch per article at the meter's arithmetic. */}
      <div
        aria-hidden
        className="mt-5 grid h-[4.75rem] gap-[3px]"
        style={{ gridTemplateColumns: `repeat(${plan.articles}, minmax(0, 1fr))` }}
      >
        {Array.from({ length: plan.articles }, (_, i) => (
          <span
            key={i}
            className={cn(
              "rounded-[2px] transition-colors duration-200",
              i < done
                ? i === done - 1 && !full
                  ? "bg-[color-mix(in_oklab,var(--ink)_62%,white)]"
                  : "bg-[color-mix(in_oklab,var(--ink)_38%,white)]"
                : "bg-ink/[0.06]",
            )}
          />
        ))}
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-1.5">
        <Chip>{formatWords(meter.articleWords)} words written</Chip>
        <span className={OP}>×</span>
        <Chip>
          {meter.multiplier}x · {meter.model}
        </Chip>
        <span className={OP}>=</span>
        <Chip className="bg-[color-mix(in_oklab,var(--ink)_5%,white)]">
          {formatWords(meter.counted)} counted
        </Chip>
      </div>

      <div className="mt-auto pt-6">
        <div className="flex items-center justify-between gap-3 border-t border-ink/[0.07] pt-4 text-[0.8rem]">
          {full ? (
            <span className="rounded-md bg-warning/25 px-2 py-0.5 font-medium text-ink">
              Allowance used · about {plan.articles} articles
            </span>
          ) : (
            <span className="font-medium tabular-nums text-ink">
              {done === 0 ? "Start of the month" : `Article ${done}`}
            </span>
          )}
          <span className="tabular-nums text-muted-foreground">
            {formatWords(plan.words - used)} left
          </span>
        </div>
        <p className="mt-3 flex items-center gap-2 text-[0.78rem] text-muted-foreground">
          <CalendarClock className="h-3.5 w-3.5 shrink-0" aria-hidden />
          {plan.autopilot
            ? "Content Calendar Autopilot on this plan"
            : meter.autopilotFrom
              ? `Autopilot starts at ${meter.autopilotFrom}`
              : "No autopilot on this plan"}
        </p>
      </div>
    </div>
  );
}

function RankboxSide({ done }: { done: number }) {
  const goal = PLAN.articlesPerMonth;
  const full = done >= goal;
  return (
    <div className="flex flex-col p-5 sm:p-7">
      <SideHead
        mark={<RankboxMark className="h-9 w-9" />}
        name="Rankbox"
        unit="Sold by the article"
        plan={`${PLAN.name} · ${formatUsd(PLAN.monthly)}/mo`}
      />

      <p className={cn(LABEL, "mt-7")}>Articles</p>
      <div className="mt-2 flex flex-wrap items-end gap-x-3 gap-y-1">
        <Odometer value={done} max={goal} className="text-[2.3rem] sm:text-[2.8rem]" />
        <span className="pb-1 text-[0.85rem] tabular-nums text-muted-foreground">of {goal}</span>
      </div>

      {/* One tile per article; nothing to meter. */}
      <div aria-hidden className="mt-5 grid h-[4.75rem] grid-cols-10 grid-rows-3 gap-[3px]">
        {Array.from({ length: goal }, (_, i) => (
          <span
            key={i}
            className={cn(
              "flex items-center justify-center rounded-[3px] border transition-colors duration-200",
              i < done
                ? "border-cta bg-cta text-white"
                : "border-ink/[0.07] bg-white text-ink/[0.12]",
            )}
          >
            <FileText className="h-3 w-3" strokeWidth={2.25} />
          </span>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-1.5">
        <Chip>1 article written</Chip>
        <span className={OP}>=</span>
        <Chip className="border-cta/25 bg-cta-soft text-cta">1 of {goal}</Chip>
      </div>

      <div className="mt-auto pt-6">
        <div className="flex items-center justify-between gap-3 border-t border-ink/[0.07] pt-4 text-[0.8rem]">
          {full ? (
            <span className="rounded-md bg-cta-soft px-2 py-0.5 font-medium text-cta">
              All {goal} articles this month
            </span>
          ) : (
            <span className="font-medium tabular-nums text-ink">
              {done === 0 ? "Start of the month" : `Article ${done} of ${goal}`}
            </span>
          )}
          <span className="tabular-nums text-muted-foreground">No word meter</span>
        </div>
        <p className="mt-3 flex items-center gap-2 text-[0.78rem] text-muted-foreground">
          <CalendarClock className="h-3.5 w-3.5 shrink-0" aria-hidden />
          Autopilot on the {PLAN.name} plan
        </p>
      </div>
    </div>
  );
}

/* ---------- the instrument ---------- */

/** Slower steps for a short month, quicker ones for a long one: about six seconds a run. */
const stepMs = (steps: number) => Math.round(Math.min(240, Math.max(110, 6400 / steps)));

function WordMeter({ competitor, meter }: { competitor: Competitor; meter: Meter }) {
  const [planName, setPlanName] = useState(meter.defaultPlan);
  const plan = meter.plans.find((p) => p.name === planName) ?? meter.plans[0];
  const goal = PLAN.articlesPerMonth;
  const total = Math.max(plan.articles, goal);

  const ref = useRef<HTMLDivElement>(null);
  // Half the card on screen before the month starts; fully off it before it
  // starts over, so it never visibly snaps back while being read.
  const inView = useInView(ref, { amount: 0.5 });
  const onScreen = useInView(ref);
  const reduce = useReducedMotion();
  const [hydrated, setHydrated] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => setHydrated(true), []);

  useEffect(() => {
    if (!onScreen) setStep(0);
  }, [onScreen]);

  const run = hydrated && !reduce && inView && step < total;
  useEffect(() => {
    if (!run) return;
    const id = window.setTimeout(() => setStep((s) => s + 1), stepMs(total));
    return () => window.clearTimeout(id);
  }, [run, step, total]);

  // The server render and reduced motion both show the finished month.
  const shown = !hydrated || reduce ? total : step;
  const koalaDone = Math.min(shown, plan.articles);
  const rankboxDone = Math.min(shown, goal);

  return (
    <div
      ref={ref}
      className="overflow-hidden rounded-2xl bg-white text-left shadow-[0_2px_4px_rgba(4,24,72,0.08),0_32px_80px_-24px_rgba(4,24,72,0.55)] ring-1 ring-black/5"
    >
      <div className="flex flex-col gap-3 border-b border-ink/[0.07] bg-[color-mix(in_oklab,var(--surface)_45%,white)] px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p className="flex items-center gap-2 text-[0.8rem] text-muted-foreground">
          <Globe className="h-3.5 w-3.5 shrink-0" aria-hidden />
          <span className="font-medium text-ink">yoursite.com</span>
          <span aria-hidden>·</span>
          one month of articles
        </p>
        <div
          role="group"
          aria-label={`${competitor.name} plan on the meter`}
          className="flex w-full items-center gap-0.5 rounded-lg border border-ink/[0.08] bg-white p-0.5 sm:w-auto"
        >
          {meter.plans.map((p) => {
            const on = p.name === plan.name;
            return (
              <button
                key={p.name}
                type="button"
                aria-pressed={on}
                onClick={() => {
                  setPlanName(p.name);
                  setStep(0);
                }}
                className={cn(
                  "flex-1 whitespace-nowrap rounded-md px-2.5 py-1.5 text-[0.75rem] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta/40 sm:flex-none sm:px-3",
                  on ? "bg-cta-soft text-cta" : "text-muted-foreground hover:text-ink",
                )}
              >
                {p.name}{" "}
                <span className={cn("tabular-nums", on ? "text-cta/80" : "text-muted-foreground")}>
                  {formatUsd(p.monthly)}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid lg:grid-cols-2">
        <div className="border-b border-ink/[0.07] lg:border-b-0 lg:border-r">
          <KoalaSide competitor={competitor} meter={meter} plan={plan} done={koalaDone} />
        </div>
        <div className="bg-[color-mix(in_oklab,var(--cta)_3%,white)]">
          <RankboxSide done={rankboxDone} />
        </div>
      </div>

      {/* The picture's numbers, said once for screen readers. */}
      <p className="sr-only">
        {competitor.name} {plan.name}, {formatUsd(plan.monthly)} a month: {formatWords(plan.words)}{" "}
        words, about {plan.articles} articles of {formatWords(meter.articleWords)} words on{" "}
        {meter.model}, which counts words at {meter.multiplier}x. Rankbox {PLAN.name},{" "}
        {formatUsd(PLAN.monthly)} a month: {goal} articles.
      </p>
    </div>
  );
}

/* ---------- the band ---------- */

export function WordMeterBand({ competitor }: { competitor: Competitor }) {
  const meter = readMeter(competitor);
  if (!meter) return null;
  const pricingSource = competitor.sources.find((s) => /pricing/.test(s.url));
  return (
    <section id="meter" aria-labelledby="meter-title" className="scroll-mt-[var(--top-chrome)]">
      <Band inner="overflow-hidden bg-cta">
        <RulerTicks edge="top" onBlue />
        <RulerTicks edge="bottom" onBlue />
        <div className="relative px-3 pb-12 pt-14 sm:px-10 sm:pb-14 sm:pt-16 lg:px-14">
          <Reveal className="mx-auto max-w-2xl px-2 text-center">
            <span className="inline-flex items-center gap-2 rounded-lg border border-white/25 bg-white/10 py-1 pl-1 pr-2.5 text-[0.8rem] font-medium text-white">
              <span className="flex h-5 w-5 items-center justify-center rounded-md bg-white text-cta">
                <Gauge className="h-3 w-3" aria-hidden />
              </span>
              The word meter
            </span>
            <h2
              id="meter-title"
              className="mt-5 text-balance font-display text-[1.9rem] font-medium leading-[1.12] tracking-[-0.03em] text-white sm:text-[2.4rem]"
            >
              {competitor.name} counts words.{" "}
              <span className="font-bold">Rankbox counts articles.</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-balance text-[0.98rem] leading-relaxed text-white/85 sm:text-[1.05rem]">
              One month of {formatWords(meter.articleWords)}-word articles, run through both plans.
              Switch the {competitor.name} plan to see where each allowance ends.
            </p>
          </Reveal>

          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="mx-auto mt-10 max-w-5xl sm:mt-12"
          >
            <WordMeter competitor={competitor} meter={meter} />
          </motion.div>

          <p className="mx-auto mt-6 max-w-3xl px-2 text-center text-[0.78rem] leading-relaxed text-white/80">
            {competitor.pricing.ladderNote} {competitor.name} prices checked{" "}
            {formatCheckedOn(competitor.pricing.checkedOn)}
            {pricingSource && (
              <>
                {" "}
                on{" "}
                <a
                  href={pricingSource.url}
                  target="_blank"
                  rel="noopener nofollow"
                  className="font-medium text-white underline decoration-white/40 underline-offset-2 hover:decoration-white"
                >
                  {displayUrl(pricingSource.url)}
                </a>
              </>
            )}
            .
          </p>
        </div>
      </Band>
    </section>
  );
}
