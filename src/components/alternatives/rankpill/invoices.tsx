/**
 * The page's focal picture: one month of each product, printed as two
 * receipts side by side. RankPill and Rankbox sell the same shape of plan, so
 * the line items print in lockstep and pair off across the gutter; only the
 * totals differ. That is the whole argument of this comparison, shown rather
 * than claimed.
 *
 * Every line is read from the data: RankPill's from its plan's `covers` and
 * its matrix row, Rankbox's from PLAN. The gutter marks are worked out, not
 * written: if the two plans ever stop matching, a "=" turns into a "≠" on its
 * own.
 *
 * It prints while at least half of it is on screen, holds the finished
 * receipts, and rewinds when it leaves. With reduced motion it is the
 * finished receipts, still.
 */
import { Fragment, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { PLAN, formatUsd } from "@/data/pricing";
import {
  RANKBOX_COST,
  costPerArticle,
  formatCheckedOn,
  formatCheckedOnShort,
  startingPrice,
  type CellState,
  type Competitor,
} from "@/data/alternatives";
import { CompetitorMark, RankboxMark } from "@/components/alternatives/kit";
import { StateMark } from "./parts";
import { cents, displayUrl, sourceFor, useSteps } from "./lib";

const EASE = [0.16, 1, 0.3, 1] as const;

interface Line {
  them: { text: string; state: CellState } | null;
  ours: { text: string; state: CellState } | null;
}

/** The receipt lines, paired by position. */
function receiptLines(c: Competitor): Line[] {
  const theirs = c.pricing.covers.split(", ");
  const ours = [
    `${PLAN.articlesPerMonth} articles a month`,
    `${PLAN.sites} ${PLAN.sites === 1 ? "website" : "websites"}`,
    `${PLAN.backlinkCreditsPerMonth} backlink credits`,
  ];
  const lines: Line[] = Array.from({ length: Math.max(theirs.length, ours.length) }, (_, i) => ({
    them: theirs[i] ? { text: theirs[i], state: "yes" } : null,
    ours: ours[i] ? { text: ours[i], state: "yes" } : null,
  }));
  /* Reddit isn't in either plan's one-line summary, but both matrices
     include it, so it prints as the last line, with each side's own state. */
  const reddit = c.matrix.flatMap((g) => g.rows).find((r) => /reddit/i.test(r.label));
  if (reddit) {
    lines.push({
      them: { text: reddit.label, state: reddit.them.state },
      ours: { text: reddit.label, state: reddit.rankbox.state },
    });
  }
  return lines;
}

const same = (l: Line) =>
  Boolean(
    l.them &&
    l.ours &&
    l.them.state === l.ours.state &&
    l.them.text.toLowerCase() === l.ours.text.toLowerCase(),
  );

/* One printed line: fades up into place when its step arrives. */
function Printed({
  shown,
  reduce,
  className,
  children,
}: {
  shown: boolean;
  reduce: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <motion.div
      initial={false}
      animate={shown ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
      transition={reduce ? { duration: 0 } : { duration: 0.45, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* The mark between two paired lines. */
function Pair({
  match,
  shown,
  reduce,
  strong = false,
}: {
  match: boolean;
  shown: boolean;
  reduce: boolean;
  strong?: boolean;
}) {
  return (
    <div className="flex items-center justify-center">
      <motion.span
        initial={false}
        animate={shown ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
        transition={reduce ? { duration: 0 } : { duration: 0.4, ease: EASE, delay: 0.12 }}
        className={cn(
          "flex h-5 w-5 items-center justify-center rounded-full text-[0.8rem] font-semibold leading-none sm:h-6 sm:w-6",
          strong
            ? "bg-cta text-white shadow-[0_4px_12px_-4px_color-mix(in_oklab,var(--cta)_70%,transparent)]"
            : "border border-ink/[0.1] bg-white text-ink/60",
        )}
      >
        <span aria-hidden>{match ? "=" : "≠"}</span>
        <span className="sr-only">{match ? "Same on both" : "Differs"}</span>
      </motion.span>
    </div>
  );
}

/* Cell padding: the receipts' inner margin, on both sides of the gutter. */
const PAD = "px-3 sm:px-4";
const RULE = "mx-3 border-t border-dashed border-ink/[0.14] sm:mx-4";

export function TwinInvoices({ competitor: c }: { competitor: Competitor }) {
  const lines = receiptLines(c);
  const totalsStep = lines.length + 1;
  const last = totalsStep + 1;
  const { ref, step, reduce } = useSteps(last, { stepMs: 480, startMs: 700 });

  const plan = c.pricing.plans.find((p) => p.name === c.pricing.plan);
  const cheapest = c.pricing.plans.find((p) => p.monthly === startingPrice(c));
  const theirEach = costPerArticle(c);
  const pricingSource = sourceFor(c, "/pricing") ?? c.sources[0];
  const matching = lines.filter(same).length;
  const gap = cents(c.pricing.monthly - PLAN.monthly);

  return (
    <figure aria-labelledby="rp-invoices-caption" className="w-full">
      <figcaption
        id="rp-invoices-caption"
        className="mb-4 flex items-baseline justify-between gap-3 text-[0.75rem] text-muted-foreground"
      >
        <span className="font-medium text-ink">One month of each, itemised</span>
        <span>Prices checked {formatCheckedOnShort(c.pricing.checkedOn)}</span>
      </figcaption>

      <div
        ref={ref}
        className="relative grid grid-cols-[minmax(0,1fr)_var(--gut)_minmax(0,1fr)] [--gut:1.75rem] sm:[--gut:2.75rem]"
      >
        {/* The two sheets of paper, drawn behind the shared rows so every
            line sits level with its pair. The scalloped foot is a mask; the
            shadow is a drop-shadow on the wrapper, so it follows the cut. */}
        {(["them", "ours"] as const).map((side) => (
          <div
            key={side}
            aria-hidden
            className={cn(
              "pointer-events-none absolute inset-y-0 w-[calc((100%-var(--gut))/2)] drop-shadow-[0_10px_18px_rgba(16,24,40,0.1)]",
              side === "them" ? "left-0" : "right-0",
            )}
          >
            <div className="relative h-full overflow-hidden rounded-t-lg border border-b-0 border-ink/[0.06] bg-white [mask:radial-gradient(circle_5px_at_50%_100%,transparent_96%,#000)_0_100%/12px_100%_repeat-x]">
              <span
                className={cn(
                  "absolute inset-x-0 top-0 h-[3px]",
                  side === "ours" ? "bg-cta" : "bg-ink/[0.14]",
                )}
              />
            </div>
          </div>
        ))}

        {/* Header */}
        <div className={cn("relative pb-3 pt-5", PAD)}>
          <div className="flex items-center gap-2">
            <CompetitorMark competitor={c} className="h-6 w-6 text-[0.55rem]" />
            <span className="truncate text-[0.82rem] font-semibold text-ink sm:text-[0.9rem]">
              {c.name}
            </span>
          </div>
          <p className="mt-1.5 text-[0.66rem] leading-snug text-muted-foreground sm:text-[0.72rem]">
            {c.pricing.plan}
            {plan?.note ? ` · ${plan.note}` : ""}
          </p>
        </div>
        <div aria-hidden />
        <div className={cn("relative pb-3 pt-5", PAD)}>
          <div className="flex items-center gap-2">
            <RankboxMark className="h-6 w-6" />
            <span className="text-[0.82rem] font-semibold text-ink sm:text-[0.9rem]">Rankbox</span>
          </div>
          <p className="mt-1.5 text-[0.66rem] leading-snug text-muted-foreground sm:text-[0.72rem]">
            {PLAN.name} · Billed monthly
          </p>
        </div>

        <div className={RULE} />
        <div />
        <div className={RULE} />

        {/* Line items, printed one pair at a time. */}
        {lines.map((l, i) => {
          const shown = step >= i + 1;
          return (
            <Fragment key={i}>
              <Printed shown={shown} reduce={reduce} className={cn("relative py-2", PAD)}>
                {l.them && (
                  <span className="flex items-start justify-between gap-2 text-[0.7rem] leading-snug text-ink/80 sm:text-[0.8rem]">
                    {l.them.text}
                    <StateMark state={l.them.state} />
                  </span>
                )}
              </Printed>
              <Pair match={same(l)} shown={shown} reduce={reduce} />
              <Printed shown={shown} reduce={reduce} className={cn("relative py-2", PAD)}>
                {l.ours && (
                  <span className="flex items-start justify-between gap-2 text-[0.7rem] leading-snug text-ink sm:text-[0.8rem]">
                    {l.ours.text}
                    <StateMark state={l.ours.state} rankbox />
                  </span>
                )}
              </Printed>
            </Fragment>
          );
        })}

        <div className={cn(RULE, "mt-2")} />
        <div />
        <div className={cn(RULE, "mt-2")} />

        {/* Totals */}
        <Printed shown={step >= totalsStep} reduce={reduce} className={cn("relative pt-3", PAD)}>
          <p className="text-[0.62rem] font-medium uppercase tracking-[0.12em] text-muted-foreground">
            Per month
          </p>
          <p className="mt-0.5 font-display text-[1.45rem] font-medium leading-none tracking-[-0.03em] text-ink tabular-nums sm:text-[1.8rem]">
            {formatUsd(c.pricing.monthly)}
          </p>
        </Printed>
        <Pair
          match={c.pricing.monthly === PLAN.monthly}
          shown={step >= totalsStep}
          reduce={reduce}
          strong
        />
        <Printed shown={step >= totalsStep} reduce={reduce} className={cn("relative pt-3", PAD)}>
          <p className="text-[0.62rem] font-medium uppercase tracking-[0.12em] text-muted-foreground">
            Per month
          </p>
          <p
            className={cn(
              "-mx-1.5 mt-0.5 w-fit rounded-md px-1.5 font-display text-[1.45rem] font-medium leading-none tracking-[-0.03em] text-cta tabular-nums transition-colors duration-700 sm:text-[1.8rem]",
              step >= last && "bg-cta-soft",
            )}
          >
            {formatUsd(PLAN.monthly)}
          </p>
        </Printed>

        <Printed shown={step >= totalsStep} reduce={reduce} className={cn("relative pt-3", PAD)}>
          <p className="flex justify-between gap-2 text-[0.68rem] text-muted-foreground sm:text-[0.75rem]">
            Per article
            <span className="font-medium text-ink tabular-nums">
              {theirEach !== null ? formatUsd(theirEach) : "—"}
            </span>
          </p>
          {cheapest && cheapest.monthly !== null && cheapest.name !== c.pricing.plan && (
            <p className="mt-1.5 text-[0.62rem] leading-snug text-muted-foreground sm:text-[0.68rem]">
              {cheapest.name}: {formatUsd(cheapest.monthly)}/mo
            </p>
          )}
        </Printed>
        <div />
        <Printed shown={step >= totalsStep} reduce={reduce} className={cn("relative pt-3", PAD)}>
          <p className="flex justify-between gap-2 text-[0.68rem] text-muted-foreground sm:text-[0.75rem]">
            Per article
            <span className="font-medium text-ink tabular-nums">
              {formatUsd(RANKBOX_COST.perArticle)}
            </span>
          </p>
        </Printed>

        {/* The receipts' small print: where each price was read. */}
        <div className={cn("relative pb-7 pt-4", PAD)}>
          <a
            href={pricingSource.url}
            target="_blank"
            rel="noopener nofollow"
            title={`Checked on ${formatCheckedOn(c.pricing.checkedOn)}`}
            className="group inline-flex max-w-full items-center gap-1 font-mono text-[0.6rem] text-muted-foreground underline decoration-ink/15 underline-offset-2 hover:text-ink sm:text-[0.66rem]"
          >
            <span className="truncate">{displayUrl(pricingSource.url)}</span>
            <ArrowUpRight aria-hidden className="h-3 w-3 shrink-0" />
          </a>
        </div>
        <div />
        <div className={cn("relative pb-7 pt-4", PAD)}>
          <Link
            to="/pricing"
            className="inline-flex max-w-full items-center gap-1 font-mono text-[0.6rem] text-muted-foreground underline decoration-ink/15 underline-offset-2 hover:text-ink sm:text-[0.66rem]"
          >
            <span className="truncate">rankbox.xyz/pricing</span>
          </Link>
        </div>
      </div>

      {/* What the gutter adds up to. */}
      <motion.p
        initial={false}
        animate={step >= last ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
        transition={reduce ? { duration: 0 } : { duration: 0.5, ease: EASE }}
        className="mx-auto mt-5 flex w-fit items-center gap-2 rounded-full border border-ink/[0.08] bg-white px-3 py-1.5 text-[0.75rem] text-ink shadow-[0_1px_2px_rgba(16,24,40,0.04)]"
      >
        <span className="font-medium">
          {matching === lines.length
            ? `Same ${lines.length} lines`
            : `${matching} of ${lines.length} lines match`}
        </span>
        <span aria-hidden className="h-3 w-px bg-ink/15" />
        <span>
          <span className="font-semibold text-cta">{formatUsd(gap)}</span> a month apart
        </span>
      </motion.p>
    </figure>
  );
}
