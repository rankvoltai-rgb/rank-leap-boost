/**
 * The focal picture of /alternatives/byword: one month on each tool, day by
 * day. It draws the one difference the whole comparison turns on — Byword
 * writes a batch you start and spreads it across the days; Rankbox writes
 * the next article from an approved plan, every day, with nobody starting
 * the next batch.
 *
 * Everything it counts comes from the data: Byword's compared plan and its
 * article allowance, Rankbox's plan and its allowance, and the two "Runs on
 * a schedule" cells quoted underneath. The day each Byword article lands on
 * is schematic (an even spread), and the caption says so.
 *
 * The story runs only while the strip is about half on screen and starts
 * over when it comes back (clock.ts). With reduced motion, and on the
 * server, it shows the finished month.
 */
import type { ReactNode } from "react";
import { ArrowRight, CalendarDays, MousePointerClick, Plus } from "lucide-react";
import { CompetitorMark, RankboxMark } from "@/components/alternatives/kit";
import { cn } from "@/lib/utils";
import { PLAN } from "@/data/pricing";
import { RANKBOX_CELLS, type Competitor } from "@/data/alternatives";
import { useSteps } from "./clock";
import { Kicker, SCREEN, StateMark, findRow } from "./parts";

const DAYS = 30;
const DAY_LIST = Array.from({ length: DAYS }, (_, i) => i + 1);

/* Step 0: an empty month. Step 1: Byword's batch is written. Steps 2–31: day
   1 to day 30. Step 32: what happens next. */
const BATCH_STEP = 1;
const FIRST_DAY_STEP = 2;
const END_STEP = FIRST_DAY_STEP + DAYS;
const DURATIONS = [900, 1500, ...Array<number>(DAYS).fill(210), 3200] as const;

/** `n` articles spread evenly across the month, as 1-based days. */
function spread(n: number): Set<number> {
  const days = new Set<number>();
  for (let i = 0; i < Math.min(n, DAYS); i++) days.add(Math.floor((i * DAYS) / n) + 1);
  return days;
}

const RANKBOX_DAYS = spread(PLAN.articlesPerMonth);

/* Tiles: square on every width, ten to a row on phones, the whole month in
   one row on desktop. */
const TILE =
  "aspect-square w-full rounded-[5px] transition-[background-color,border-color,box-shadow,transform] duration-300";
const GRID = "grid grid-cols-10 gap-1 sm:grid-cols-15 sm:gap-[5px] lg:grid-cols-30";

export function MonthStrip({ competitor }: { competitor: Competitor }) {
  const { ref, step } = useSteps<HTMLDivElement>(DURATIONS);

  const theirArticles = competitor.pricing.articles ?? 0;
  const theirDays = spread(theirArticles);
  const batched = step >= BATCH_STEP;
  const day = step < FIRST_DAY_STEP ? 0 : Math.min(step - FIRST_DAY_STEP + 1, DAYS);
  const ended = step === END_STEP;

  const theirPublished = [...theirDays].filter((d) => d <= day).length;
  const oursWritten = [...RANKBOX_DAYS].filter((d) => d <= day).length;

  const schedule = findRow(competitor, "Runs on a schedule");
  const label = [
    `Illustration of one month.`,
    `${competitor.name} ${competitor.pricing.plan}, ${theirArticles} articles a month${schedule ? `: ${schedule.them.note}.` : "."}`,
    `Rankbox ${PLAN.name}, ${PLAN.articlesPerMonth} articles a month: ${RANKBOX_CELLS.autopilot.note}.`,
  ].join(" ");

  return (
    <figure ref={ref} className={cn(SCREEN, "mx-auto w-full max-w-5xl overflow-hidden")}>
      {/* Card header: what this is, and the day the month has reached. */}
      <div className="flex items-center justify-between gap-3 border-b border-ink/[0.07] px-4 py-3 sm:px-6">
        <span className="flex items-center gap-2 text-[0.82rem] font-medium text-ink">
          <CalendarDays className="h-4 w-4 text-brand-blue" aria-hidden />
          One month on each
        </span>
        <span
          aria-hidden
          className="rounded-md border border-ink/[0.08] bg-white px-2 py-0.5 text-[0.72rem] font-medium tabular-nums text-muted-foreground"
        >
          {day === 0 ? "Day –" : `Day ${day}`}{" "}
          <span className="text-muted-foreground/60">/ {DAYS}</span>
        </span>
      </div>

      <div role="img" aria-label={label} className="px-4 pb-2 pt-5 sm:px-6 sm:pt-6">
        {/* Day numbers, desktop only, aligned over the tiles. */}
        <div
          aria-hidden
          className="mb-2 hidden lg:grid lg:grid-cols-[13rem_minmax(0,1fr)_6rem] lg:gap-6"
        >
          <span />
          <div className={GRID}>
            {DAY_LIST.map((d) => (
              <span
                key={d}
                className={cn(
                  "text-center text-[0.6rem] tabular-nums transition-colors duration-200",
                  d === day ? "font-semibold text-cta" : "text-muted-foreground/70",
                )}
              >
                {d}
              </span>
            ))}
          </div>
          <span />
        </div>

        {/* Byword: a batch you start, spread across the days. */}
        <Lane
          mark={<CompetitorMark competitor={competitor} className="h-8 w-8" />}
          name={competitor.name}
          plan={`${competitor.pricing.plan} · ${theirArticles} a month`}
          event={
            <EventChip on={batched} icon={MousePointerClick}>
              Campaign started · {theirArticles} written
            </EventChip>
          }
          status={
            !batched
              ? "Waiting for a campaign"
              : day === 0
                ? `${theirArticles} written at once, scheduled across the month`
                : ended
                  ? `${theirPublished} of ${theirArticles} published · the next campaign is yours to start`
                  : `${theirPublished} of ${theirArticles} published`
          }
          next={
            <NextSlot on={ended} label="Next campaign" tone="them">
              <Plus className="h-3.5 w-3.5" />
            </NextSlot>
          }
        >
          {DAY_LIST.map((d, i) => {
            const scheduled = theirDays.has(d);
            const published = scheduled && d <= day;
            return (
              <span
                key={d}
                className={cn(
                  TILE,
                  !scheduled || !batched
                    ? "bg-ink/[0.035]"
                    : published
                      ? "border border-transparent bg-ink/[0.24]"
                      : "border border-ink/[0.2] bg-white",
                  d === day && "ring-2 ring-ink/15 ring-offset-1",
                )}
                // The batch lands as one quick cascade, not day by day.
                style={{ transitionDelay: step === BATCH_STEP ? `${i * 22}ms` : "0ms" }}
              />
            );
          })}
        </Lane>

        <div className="my-5 border-t border-dashed border-ink/[0.08]" />

        {/* Rankbox: the next article from the plan, each day. */}
        <Lane
          mark={<RankboxMark className="h-8 w-8" />}
          name="Rankbox"
          plan={`${PLAN.name} · ${PLAN.articlesPerMonth} a month`}
          rankbox
          event={
            <EventChip on={batched} icon={CalendarDays} rankbox>
              Plan approved
            </EventChip>
          }
          status={
            day === 0
              ? "The plan is approved once"
              : ended
                ? `${oursWritten} of ${PLAN.articlesPerMonth} written · the next comes from the plan`
                : `${oursWritten} of ${PLAN.articlesPerMonth} written, one a day`
          }
          next={
            <NextSlot on={ended} label="Next, from the plan" tone="rankbox">
              <ArrowRight className="h-3.5 w-3.5" />
            </NextSlot>
          }
        >
          {DAY_LIST.map((d) => {
            const written = RANKBOX_DAYS.has(d) && d <= day;
            return (
              <span
                key={d}
                className={cn(
                  TILE,
                  written
                    ? "bg-cta shadow-[inset_0_1px_0_rgba(255,255,255,0.18)]"
                    : "bg-ink/[0.035]",
                  d === day && "scale-[1.08] ring-2 ring-cta/30 ring-offset-1",
                )}
              />
            );
          })}
        </Lane>
      </div>

      {/* The two cells this picture draws, quoted from the comparison. */}
      <figcaption className="mt-4 grid border-t border-ink/[0.07] text-[0.82rem] leading-snug sm:grid-cols-2">
        {schedule && (
          <div className="flex gap-2.5 border-b border-ink/[0.07] px-4 py-4 sm:border-b-0 sm:border-r sm:px-6">
            <StateMark state={schedule.them.state} />
            <p className="text-muted-foreground">
              <span className="font-medium text-ink">{competitor.name}:</span> {schedule.them.note}
            </p>
          </div>
        )}
        <div className="flex gap-2.5 px-4 py-4 sm:px-6">
          <StateMark state={RANKBOX_CELLS.autopilot.state} rankbox />
          <p className="text-muted-foreground">
            <span className="font-medium text-ink">Rankbox:</span> {RANKBOX_CELLS.autopilot.note}
          </p>
        </div>
        <p className="border-t border-ink/[0.07] bg-[color-mix(in_oklab,var(--surface)_45%,white)] px-4 py-2.5 text-[0.72rem] text-muted-foreground sm:col-span-2 sm:px-6">
          Schematic. Article counts are each plan&rsquo;s monthly allowance; the days Byword&rsquo;s
          articles land on are an even spread.
        </p>
      </figcaption>
    </figure>
  );
}

function Lane({
  mark,
  name,
  plan,
  event,
  status,
  next,
  rankbox = false,
  children,
}: {
  mark: ReactNode;
  name: string;
  plan: string;
  event: ReactNode;
  status: string;
  next: ReactNode;
  rankbox?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="grid gap-3 lg:grid-cols-[13rem_minmax(0,1fr)_6rem] lg:items-center lg:gap-6">
      <div className="flex items-center gap-3">
        {mark}
        <div className="min-w-0">
          <p className="text-[0.92rem] font-semibold leading-tight text-ink">{name}</p>
          <p className="mt-0.5 text-[0.75rem] text-muted-foreground">{plan}</p>
        </div>
      </div>

      <div className="min-w-0">
        <div className="mb-2 flex min-h-6 flex-wrap items-center justify-between gap-x-3 gap-y-1">
          {event}
          <span
            className={cn(
              "text-[0.72rem] tabular-nums",
              rankbox ? "font-medium text-cta" : "text-muted-foreground",
            )}
          >
            {status}
          </span>
        </div>
        <div className={GRID}>{children}</div>
      </div>

      <div className="flex justify-end lg:justify-center">{next}</div>
    </div>
  );
}

function EventChip({
  on,
  icon: Icon,
  rankbox = false,
  children,
}: {
  on: boolean;
  icon: typeof Plus;
  rankbox?: boolean;
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-[0.7rem] font-medium transition-[opacity,transform,background-color,border-color,color] duration-500",
        on ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0",
        rankbox ? "border-cta/25 bg-cta-soft text-cta" : "border-ink/[0.12] bg-white text-ink",
      )}
    >
      <Icon className="h-3 w-3" />
      {children}
    </span>
  );
}

function NextSlot({
  on,
  label,
  tone,
  children,
}: {
  on: boolean;
  label: string;
  tone: "them" | "rankbox";
  children: ReactNode;
}) {
  return (
    <span className="flex items-center gap-2 lg:flex-col lg:gap-1.5">
      <span
        className={cn(
          "flex h-8 w-8 items-center justify-center rounded-md transition-[background-color,border-color,color,box-shadow] duration-500",
          tone === "them"
            ? cn(
                "border border-dashed",
                on
                  ? "border-ink/40 bg-white text-ink shadow-[0_0_0_4px_rgba(16,24,40,0.05)]"
                  : "border-ink/15 text-ink/30",
              )
            : on
              ? "bg-cta text-white shadow-[0_0_0_4px_color-mix(in_oklab,var(--cta)_14%,transparent)]"
              : "bg-cta-soft text-cta/50",
        )}
      >
        {children}
      </span>
      <span
        className={cn(
          "text-[0.68rem] font-medium leading-tight transition-colors duration-500 lg:text-center",
          on ? (tone === "rankbox" ? "text-cta" : "text-ink") : "text-muted-foreground/70",
        )}
      >
        {label}
      </span>
    </span>
  );
}
