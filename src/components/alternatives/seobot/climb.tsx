/**
 * The page's focal picture: climbing SEObot's credit ladder to the volume
 * you need, beside Rankbox's single step.
 *
 * SEObot sells article credits in six plans; Rankbox sells one. So the most
 * telling thing about this comparison is not a feature, it's a climb: start
 * at the volume you need (30 a month by default, Rankbox's allowance), try
 * each SEObot plan from the bottom, and stop at the first that covers it.
 * Each step shows its own price, allowance and cost per article, and a gauge
 * of how far its allowance gets you. Then Rankbox's one step lights.
 *
 * It is fair by construction: pick 100 or 300 a month and Rankbox's step
 * comes up short, and the readout points to where SEObot is the better buy.
 * Every number comes from the plan ladder in the competitor's data file.
 *
 * Steps rise one notch per plan, in price order. The heights are a ladder,
 * not a scale: each step carries its own price.
 *
 * Motion: the story runs while the card is about half on screen and starts
 * over when it comes back; picking a volume replays it once and holds. With
 * reduced motion it shows the finished frame for the chosen volume.
 */
import { useMemo, useState, type CSSProperties } from "react";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { LINE } from "@/components/landing/frame";
import { CompetitorMark, RankboxMark } from "@/components/alternatives/kit";
import { PLAN, formatUsd } from "@/data/pricing";
import { RANKBOX_COST, type Competitor } from "@/data/alternatives";
import { CARD_SHADOW } from "./tokens";
import { EASE, useStory } from "./clock";
import { coveringIndex, rungsOf, volumesOf, type Rung } from "./math";

type StepState = "idle" | "short" | "covers" | "beyond";

const NEED_MS = 1500;
const CHECK_MS = 1150;
const COVER_MS = 1900;
const HOLD_MS = 5600;

/* Height of step i, as a share of the stair: one notch per plan. The first
   step is tall enough to hold its own price, allowance and gauge. */
const BASE = 41;

function notch(i: number, n: number) {
  return `${BASE + (n > 1 ? (i * (96 - BASE)) / (n - 1) : 0)}%`;
}

function Token({ need, still }: { need: number; still: boolean }) {
  return (
    <motion.span
      layoutId="seobot-need-token"
      transition={still ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 34 }}
      className="inline-flex items-center whitespace-nowrap rounded-full bg-cta px-2 py-0.5 text-[0.7rem] font-semibold tabular-nums text-white shadow-[0_1px_2px_rgba(16,24,40,0.2),0_6px_14px_-6px_rgba(22,111,229,0.6)]"
    >
      Need {need}
    </motion.span>
  );
}

function Gauge({
  have,
  need,
  state,
  onBlue = false,
  still,
}: {
  have: number;
  need: number;
  state: StepState | "lit";
  onBlue?: boolean;
  still: boolean;
}) {
  const shown = state !== "idle";
  const pct = shown ? Math.min(have / need, 1) * 100 : 0;
  return (
    <span
      aria-hidden
      className={cn(
        "mt-2.5 block h-1 overflow-hidden rounded-full",
        onBlue ? "bg-white/25" : "bg-ink/[0.07]",
      )}
    >
      <motion.span
        className={cn(
          "block h-full rounded-full",
          onBlue ? "bg-white" : state === "covers" ? "bg-cta" : "bg-ink/30",
        )}
        initial={false}
        animate={{ width: `${pct}%` }}
        transition={still ? { duration: 0 } : { duration: 0.7, ease: EASE }}
      />
    </span>
  );
}

function stepLabel(state: StepState, have: number, need: number, spareRollsOver: boolean) {
  if (state === "short") return `${need - have} short`;
  if (state === "covers") {
    const spare = have - need;
    if (spare <= 0) return `Covers ${need}`;
    return spareRollsOver ? `Covers ${need} · ${spare} spare` : `Covers ${need}`;
  }
  if (state === "beyond") return "More than you need";
  return " ";
}

function Step({
  rung,
  i,
  n,
  state,
  need,
  token,
  still,
}: {
  rung: Rung;
  i: number;
  n: number;
  state: StepState;
  need: number;
  token: boolean;
  still: boolean;
}) {
  return (
    <li
      className="relative md:flex md:h-full md:flex-col md:justify-end"
      style={{ "--h": notch(i, n) } as CSSProperties}
    >
      <div
        className={cn(
          "relative flex flex-col rounded-lg border px-3.5 py-3 transition-[background-color,border-color,box-shadow] duration-500 md:h-[var(--h)] md:rounded-b-none md:border-b-0 md:px-3 md:py-3.5",
          state === "covers"
            ? "border-cta/60 bg-cta-soft shadow-[0_0_0_1px_color-mix(in_oklab,var(--cta)_35%,transparent)]"
            : state === "short"
              ? "border-ink/[0.09] bg-[color-mix(in_oklab,var(--surface)_55%,white)]"
              : state === "beyond"
                ? "border-dashed border-ink/[0.16] bg-white"
                : "border-ink/[0.09] bg-white",
        )}
      >
        {token && (
          <span className="absolute right-3 top-3 z-10 md:-top-3 md:left-1/2 md:right-auto md:-translate-x-1/2">
            <Token need={need} still={still} />
          </span>
        )}
        <p
          className={cn(
            "text-[0.66rem] font-semibold uppercase tracking-[0.12em]",
            state === "covers" ? "text-cta-hover" : "text-muted-foreground",
          )}
        >
          {rung.name}
        </p>
        <p className="mt-1 font-display text-[1.2rem] font-medium leading-none tracking-[-0.02em] text-ink tabular-nums md:mt-1.5">
          {formatUsd(rung.monthly)}
          <span className="ml-0.5 text-[0.72rem] font-normal tracking-normal text-muted-foreground">
            /mo
          </span>
        </p>
        <p className="mt-1.5 text-[0.74rem] leading-snug text-ink/75">
          <span className="tabular-nums">{rung.articles}</span> articles{" "}
          <span className="md:block">
            <span className="text-muted-foreground md:hidden">· </span>
            <span className="tabular-nums">{formatUsd(rung.each)}</span> each
          </span>
        </p>
        {rung.note && (
          <p className="mt-1 text-[0.68rem] leading-snug text-muted-foreground">{rung.note}</p>
        )}
        <Gauge have={rung.articles} need={need} state={state} still={still} />
        <p
          className={cn(
            "mt-1.5 text-[0.7rem] font-medium leading-snug",
            state === "covers" ? "text-cta-hover" : "text-muted-foreground",
          )}
        >
          {stepLabel(state, rung.articles, need, true)}
        </p>
      </div>
    </li>
  );
}

export function Climb({ competitor }: { competitor: Competitor }) {
  const rungs = useMemo(() => rungsOf(competitor), [competitor]);
  const volumes = useMemo(() => volumesOf(rungs), [rungs]);
  const [need, setNeed] = useState<number>(PLAN.articlesPerMonth);
  const [picked, setPicked] = useState(false);

  const k = coveringIndex(rungs, need);
  const top = k === -1 ? rungs.length - 1 : k;
  const durations = useMemo(
    () => [
      NEED_MS,
      ...rungs.slice(0, top + 1).map((_, i) => (i === top ? COVER_MS : CHECK_MS)),
      HOLD_MS,
    ],
    [rungs, top],
  );
  const { ref, phase, still } = useStory<HTMLDivElement>(durations, { loop: !picked });
  const last = durations.length - 1;
  const final = phase === last;
  const reached = phase === 0 ? -1 : Math.min(phase - 1, top);

  const stateOf = (i: number): StepState => {
    if (reached < 0) return "idle";
    if (i < reached) return "short";
    if (i === reached) return rungs[i].articles >= need ? "covers" : "short";
    return final && k !== -1 ? "beyond" : "idle";
  };

  const rankboxCovers = need <= PLAN.articlesPerMonth;
  const rankboxState: StepState = !final ? "idle" : rankboxCovers ? "covers" : "short";
  const lit = rankboxState === "covers";
  const theirs = rungs[top];

  let caption: string;
  if (reached < 0) caption = `Climbing ${competitor.name}'s plans to ${need} articles a month`;
  else if (!final) {
    const r = rungs[reached];
    caption =
      r.articles >= need
        ? `${r.name} covers it: ${r.articles} credits for ${formatUsd(r.monthly)} a month`
        : `${r.name}: ${r.articles} articles a month, ${need - r.articles} short`;
  } else if (rankboxCovers) {
    caption = `At ${need} a month: ${competitor.name} ${theirs.name} at ${formatUsd(theirs.monthly)}, or Rankbox ${PLAN.name} at ${formatUsd(PLAN.monthly)}`;
  } else {
    caption = `At ${need} a month: ${competitor.name} ${theirs.name}. Rankbox's plan stops at ${PLAN.articlesPerMonth}.`;
  }

  const summary = rankboxCovers
    ? `At ${need} articles a month, the cheapest ${competitor.name} plan that covers it is ${theirs.name}: ${formatUsd(theirs.monthly)} a month for ${theirs.articles} articles. Rankbox ${PLAN.name} is ${formatUsd(PLAN.monthly)} a month for ${PLAN.articlesPerMonth}.`
    : `At ${need} articles a month, the cheapest ${competitor.name} plan that covers it is ${theirs.name}: ${formatUsd(theirs.monthly)} a month for ${theirs.articles} articles. Rankbox's plan is ${PLAN.articlesPerMonth} articles a month.`;

  const betterAtVolume = competitor.betterWhen[0];

  return (
    <LayoutGroup id="seobot-climb">
      <figure
        aria-labelledby="climb-caption"
        className={cn(
          "mx-auto w-full max-w-5xl overflow-hidden rounded-xl border border-ink/[0.08] bg-white",
          CARD_SHADOW,
        )}
      >
        <figcaption id="climb-caption" className="sr-only">
          {competitor.name}&rsquo;s plans as a ladder beside Rankbox&rsquo;s one plan. {summary}
        </figcaption>

        {/* The volume you need. */}
        <div
          className={cn(
            "flex flex-col gap-2.5 border-b px-4 py-3.5 sm:flex-row sm:items-center sm:gap-4 sm:px-6",
            LINE,
          )}
        >
          <p id="climb-need" className="shrink-0 text-[0.8rem] font-medium text-ink">
            Articles you need a month
          </p>
          <div role="group" aria-labelledby="climb-need" className="flex flex-wrap gap-1.5">
            {volumes.map((v) => (
              <button
                key={v}
                type="button"
                aria-pressed={v === need}
                onClick={() => {
                  setNeed(v);
                  setPicked(true);
                }}
                className={cn(
                  "h-8 min-w-[2.4rem] rounded-md px-2 sm:min-w-[2.75rem] sm:px-2.5 text-[0.8rem] font-medium tabular-nums transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta/40",
                  v === need
                    ? "bg-cta text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.16)]"
                    : "border border-ink/[0.1] bg-white text-ink hover:border-ink/[0.2]",
                )}
              >
                {v}
              </button>
            ))}
          </div>
          <p aria-live="polite" className="sr-only">
            {picked ? summary : ""}
          </p>
        </div>

        <div ref={ref} className="grid md:grid-cols-[minmax(0,1fr)_13.5rem]">
          {/* SEObot's ladder. */}
          <div aria-hidden className="px-4 pb-5 pt-4 sm:px-6 sm:pb-6">
            <div className="flex items-start justify-between gap-3 md:h-[3.25rem]">
              <div className="flex min-w-0 items-center gap-2.5">
                <CompetitorMark competitor={competitor} className="h-7 w-7 text-[0.6rem]" />
                <div className="min-w-0">
                  <p className="text-[0.9rem] font-semibold leading-tight text-ink">
                    {competitor.name}
                  </p>
                  <p className="text-[0.75rem] leading-snug text-muted-foreground">
                    {competitor.oneLiner}
                  </p>
                </div>
              </div>
              <span className="flex h-6 min-w-[4.5rem] shrink-0 items-center justify-end">
                {reached < 0 && <Token need={need} still={still} />}
              </span>
            </div>

            <ol className="mt-5 flex flex-col gap-2 md:mt-7 md:grid md:h-[23.5rem] md:grid-cols-6 md:items-end md:gap-2">
              {rungs.map((r, i) => (
                <Step
                  key={r.name}
                  rung={r}
                  i={i}
                  n={rungs.length}
                  state={stateOf(i)}
                  need={need}
                  token={reached === i}
                  still={still}
                />
              ))}
            </ol>
            <div aria-hidden className="hidden h-px bg-ink/[0.14] md:block" />
          </div>

          {/* Rankbox's one step. */}
          <div
            aria-hidden
            className={cn(
              "border-t bg-[color-mix(in_oklab,var(--cta)_3%,white)] px-4 pb-5 pt-4 sm:px-6 sm:pb-6 md:border-l md:border-t-0",
              LINE,
            )}
          >
            <div className="flex items-start gap-2.5 md:h-[3.25rem]">
              <RankboxMark className="h-7 w-7" />
              <div>
                <p className="text-[0.9rem] font-semibold leading-tight text-ink">Rankbox</p>
                <p className="text-[0.75rem] leading-snug text-muted-foreground">
                  One plan, {PLAN.articlesPerMonth} articles a month
                </p>
              </div>
            </div>

            <div
              className="mt-5 md:mt-7 md:flex md:h-[23.5rem] md:flex-col md:justify-end"
              style={{ "--h": notch(0, rungs.length) } as CSSProperties}
            >
              <div
                className={cn(
                  "relative flex flex-col rounded-lg border px-3.5 py-3 transition-[background-color,border-color,color] duration-500 md:h-[var(--h)] md:rounded-b-none md:border-b-0 md:py-3.5",
                  lit
                    ? "border-cta bg-cta text-white"
                    : rankboxState === "short"
                      ? "border-ink/[0.09] bg-[color-mix(in_oklab,var(--surface)_55%,white)]"
                      : "border-ink/[0.09] bg-white",
                )}
              >
                {lit && (
                  <span className="absolute right-3 top-3 z-10 md:-top-3 md:left-1/2 md:right-auto md:-translate-x-1/2">
                    <motion.span
                      initial={still ? false : { opacity: 0, y: 6, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.45, ease: EASE }}
                      className="inline-flex items-center whitespace-nowrap rounded-full bg-white px-2 py-0.5 text-[0.7rem] font-semibold tabular-nums text-cta shadow-[0_1px_2px_rgba(16,24,40,0.2)] ring-1 ring-cta/30"
                    >
                      Need {need}
                    </motion.span>
                  </span>
                )}
                <p
                  className={cn(
                    "text-[0.66rem] font-semibold uppercase tracking-[0.12em]",
                    lit ? "text-white/85" : "text-muted-foreground",
                  )}
                >
                  {PLAN.name}
                </p>
                <p
                  className={cn(
                    "mt-1 font-display text-[1.2rem] font-medium leading-none tracking-[-0.02em] tabular-nums md:mt-1.5",
                    lit ? "text-white" : "text-ink",
                  )}
                >
                  {formatUsd(PLAN.monthly)}
                  <span
                    className={cn(
                      "ml-0.5 text-[0.72rem] font-normal tracking-normal",
                      lit ? "text-white/80" : "text-muted-foreground",
                    )}
                  >
                    /mo
                  </span>
                </p>
                <p
                  className={cn(
                    "mt-1.5 text-[0.74rem] leading-snug",
                    lit ? "text-white/90" : "text-ink/75",
                  )}
                >
                  <span className="tabular-nums">{PLAN.articlesPerMonth}</span> articles ·{" "}
                  <span className="tabular-nums">{formatUsd(RANKBOX_COST.perArticle)}</span> each
                </p>
                <Gauge
                  have={PLAN.articlesPerMonth}
                  need={need}
                  state={rankboxState}
                  onBlue={lit}
                  still={still}
                />
                <p
                  className={cn(
                    "mt-1.5 text-[0.7rem] font-medium leading-snug",
                    lit ? "text-white" : "text-muted-foreground",
                  )}
                >
                  {stepLabel(rankboxState, PLAN.articlesPerMonth, need, false)}
                </p>
              </div>
            </div>
            <div aria-hidden className="hidden h-px bg-ink/[0.14] md:block" />
          </div>
        </div>

        {/* The readout: the step being tried, then the answer. */}
        <div className={cn("grid border-t md:grid-cols-[minmax(0,1fr)_auto]", LINE)}>
          <div className="flex min-h-[4.25rem] items-center px-4 py-3.5 sm:px-6">
            <AnimatePresence mode="wait" initial={false}>
              <motion.p
                key={caption}
                aria-hidden
                initial={still ? false : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={still ? undefined : { opacity: 0, y: -6 }}
                transition={{ duration: 0.28, ease: EASE }}
                className="text-[0.88rem] leading-snug text-ink"
              >
                {caption}
              </motion.p>
            </AnimatePresence>
          </div>
          <dl
            className={cn(
              "grid grid-cols-2 border-t md:min-w-[25rem] md:border-l md:border-t-0",
              LINE,
            )}
          >
            <div className="px-4 py-3.5 sm:px-6">
              <dt className="text-[0.66rem] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
                {competitor.name} {theirs.name}
              </dt>
              <dd className="mt-1 font-display text-[1.45rem] font-medium leading-none tracking-[-0.02em] text-ink tabular-nums">
                {formatUsd(theirs.monthly)}
                <span className="ml-0.5 text-[0.75rem] font-normal tracking-normal text-muted-foreground">
                  /mo
                </span>
              </dd>
            </div>
            <div
              className={cn(
                "border-l px-4 py-3.5 transition-colors duration-500 sm:px-6",
                LINE,
                lit && "bg-cta-soft",
              )}
            >
              <dt className="text-[0.66rem] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
                Rankbox {PLAN.name}
              </dt>
              {rankboxCovers ? (
                <dd className="mt-1 font-display text-[1.45rem] font-medium leading-none tracking-[-0.02em] text-cta tabular-nums">
                  {formatUsd(PLAN.monthly)}
                  <span className="ml-0.5 text-[0.75rem] font-normal tracking-normal text-muted-foreground">
                    /mo
                  </span>
                </dd>
              ) : (
                <dd className="mt-1 text-[0.8rem] leading-snug">
                  <a
                    href="#better-when"
                    className="group inline-flex items-start gap-1 font-medium text-ink underline decoration-ink/20 underline-offset-2 hover:decoration-ink"
                  >
                    {betterAtVolume?.title ?? `More than ${PLAN.articlesPerMonth} a month`}
                    <ArrowRight className="mt-0.5 h-3.5 w-3.5 shrink-0 transition-transform group-hover:translate-x-0.5" />
                  </a>
                </dd>
              )}
            </div>
          </dl>
        </div>
      </figure>
    </LayoutGroup>
  );
}
