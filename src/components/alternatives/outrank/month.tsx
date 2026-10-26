/**
 * The page's focal picture: one month on each plan.
 *
 * Outrank and Rankbox run the same loop, an article a day on one site, so
 * the telling thing about this comparison is not a feature list but what the
 * same month costs. Two calendars fill in lockstep, day by day, while the
 * bars underneath grow toward each plan's monthly price; when the month is
 * full the difference is stated. Outrank's annual billing is one tap away,
 * because picking the dearer billing to compare against is the easiest way
 * for a comparison to cheat.
 *
 * Every price, plan name and note is read from the competitor entry and from
 * data/pricing. The server renders the finished month (see clock.ts).
 */
import { useState } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { PLAN, formatUsd } from "@/data/pricing";
import { formatCheckedOnShort, type Competitor, type PricePlan } from "@/data/alternatives";
import { CompetitorMark, RankboxMark } from "@/components/alternatives/kit";
import { LINE } from "@/components/landing/frame";
import { useMonth } from "./clock";
import { OURS_TINT, cents, perArticle } from "./lib";

type Billing = "monthly" | "annual";

interface LaneData {
  name: string;
  plan: string;
  monthly: number;
  articles: number;
  note?: string;
  ours: boolean;
}

/** The compared plan and, where they sell one, its annual twin. */
function theirPlans(c: Competitor): { base: PricePlan; annual?: PricePlan } {
  const p = c.pricing;
  const base: PricePlan = p.plans.find((pl) => pl.name === p.plan) ?? {
    name: p.plan,
    monthly: p.monthly,
    articles: p.articles,
  };
  const annual = p.plans.find(
    (pl) =>
      pl !== base &&
      /annual/i.test(pl.name) &&
      pl.articles === base.articles &&
      pl.monthly !== null,
  );
  return { base, annual };
}

export function MonthCard({ competitor }: { competitor: Competitor }) {
  const { base, annual } = theirPlans(competitor);
  const [billing, setBilling] = useState<Billing>("monthly");
  const chosen = billing === "annual" && annual ? annual : base;
  const days = PLAN.articlesPerMonth;
  const { ref, day, playing } = useMonth<HTMLDivElement>(days);

  const lanes: LaneData[] = [
    {
      name: "Rankbox",
      plan: PLAN.name,
      monthly: PLAN.monthly,
      articles: PLAN.articlesPerMonth,
      ours: true,
    },
    {
      name: competitor.name,
      plan: chosen.name,
      monthly: chosen.monthly ?? competitor.pricing.monthly,
      articles: chosen.articles ?? competitor.pricing.articles ?? days,
      note: chosen.note,
      ours: false,
    },
  ];
  const max = Math.max(...lanes.map((l) => l.monthly));
  const gap = Math.abs(lanes[1].monthly - lanes[0].monthly);
  const done = day >= days;

  return (
    <div
      ref={ref}
      className={cn(
        "w-full overflow-hidden rounded-2xl border bg-white shadow-[0_1px_2px_rgba(16,24,40,0.04),0_24px_56px_-28px_rgba(16,24,40,0.28)]",
        LINE,
      )}
    >
      <div
        className={cn("flex items-start justify-between gap-3 border-b px-4 py-3.5 sm:px-5", LINE)}
      >
        <div className="min-w-0">
          <p className="text-[0.95rem] font-medium tracking-tight text-ink">
            One month on each plan
          </p>
          <p className="mt-0.5 text-[0.75rem] text-muted-foreground">
            {days} articles, one a day, one site
          </p>
        </div>
        <span
          className={cn(
            "shrink-0 rounded-md border bg-white px-2 py-0.5 text-[0.62rem] font-semibold uppercase tracking-[0.1em] text-muted-foreground",
            LINE,
          )}
        >
          Checked {formatCheckedOnShort(competitor.pricing.checkedOn)}
        </span>
      </div>

      <div className={cn("grid grid-cols-2 divide-x", "divide-ink/[0.07]")}>
        {lanes.map((lane) => (
          <Lane key={lane.name} lane={lane} competitor={competitor} day={day} playing={playing} />
        ))}
      </div>

      <div className={cn("border-t px-4 py-4 sm:px-5", LINE)}>
        <p className="text-[0.68rem] font-medium uppercase tracking-[0.12em] text-muted-foreground">
          What the month costs
        </p>
        <div className="mt-3 space-y-2.5">
          {lanes.map((lane) => (
            <div
              key={lane.name}
              className="grid grid-cols-[4.75rem_minmax(0,1fr)_auto] items-center gap-3"
            >
              <span className="truncate text-[0.78rem] font-medium text-ink">{lane.name}</span>
              <span aria-hidden className="h-2 overflow-hidden rounded-full bg-ink/[0.05]">
                <span
                  className={cn(
                    "block h-full rounded-full transition-[width] ease-out",
                    lane.ours ? "bg-cta" : "bg-ink/30",
                    day === 0 ? "duration-300" : "duration-150",
                  )}
                  style={{ width: `${((lane.monthly / max) * 100 * Math.min(day, days)) / days}%` }}
                />
              </span>
              <span className="text-[0.78rem] font-medium tabular-nums text-ink">
                {formatUsd(lane.monthly)}
                <span className="font-normal text-muted-foreground">/mo</span>
              </span>
            </div>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-x-3 gap-y-2.5">
          {annual ? (
            <div
              role="group"
              aria-label={`${competitor.name} billing`}
              className={cn("inline-flex rounded-lg border bg-white p-0.5", LINE)}
            >
              {(["monthly", "annual"] as const).map((b) => (
                <button
                  key={b}
                  type="button"
                  aria-pressed={billing === b}
                  onClick={() => setBilling(b)}
                  className={cn(
                    "rounded-md px-2.5 py-1 text-[0.72rem] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta/40",
                    billing === b ? "bg-cta-soft text-cta" : "text-muted-foreground hover:text-ink",
                  )}
                >
                  {competitor.name} {b === "monthly" ? "monthly" : "annual"}
                </button>
              ))}
            </div>
          ) : (
            <span />
          )}
          <span
            className={cn(
              "rounded-md bg-cta-soft px-2 py-1 text-[0.72rem] font-semibold tabular-nums text-cta transition-opacity duration-300",
              done ? "opacity-100" : "opacity-0",
            )}
          >
            Same {days} articles · {formatUsd(gap)} a month apart
          </span>
        </div>
      </div>
    </div>
  );
}

function Lane({
  lane,
  competitor,
  day,
  playing,
}: {
  lane: LaneData;
  competitor: Competitor;
  day: number;
  playing: boolean;
}) {
  const shipped = Math.min(day, lane.articles);
  const each = perArticle(lane.monthly, lane.articles);
  return (
    <div className={cn("min-w-0 p-3.5 sm:p-5", lane.ours && OURS_TINT)}>
      <div className="flex items-center gap-2">
        {lane.ours ? (
          <RankboxMark className="h-7 w-7" />
        ) : (
          <CompetitorMark competitor={competitor} className="h-7 w-7 text-[0.65rem]" />
        )}
        <div className="min-w-0">
          <p className="text-[0.82rem] font-semibold leading-tight text-ink">{lane.name}</p>
          <p className="truncate text-[0.68rem] leading-tight text-muted-foreground">{lane.plan}</p>
        </div>
      </div>

      {/* The calendar. Decorative: the text below says what it shows. */}
      <ol aria-hidden className="mt-4 grid grid-cols-6 gap-1 sm:gap-1.5">
        {Array.from({ length: lane.articles }, (_, i) => {
          const filled = i < shipped;
          const writing = playing && i === shipped && day < lane.articles;
          return (
            <li
              key={i}
              className={cn(
                "flex aspect-square items-center justify-center rounded-[5px] border text-[0.52rem] tabular-nums transition-[background-color,border-color,color,transform] duration-300 sm:text-[0.58rem]",
                filled
                  ? lane.ours
                    ? "scale-100 border-transparent bg-cta text-white"
                    : "scale-100 border-transparent bg-[color-mix(in_oklab,var(--ink)_13%,white)] text-ink/70"
                  : "scale-[0.94] border-ink/[0.08] bg-white text-ink/30",
                writing && "border-cta/60 text-cta ring-2 ring-cta/15",
              )}
            >
              {filled ? <Check className="h-2.5 w-2.5" strokeWidth={3} /> : i + 1}
            </li>
          );
        })}
      </ol>
      <p aria-hidden className="mt-2 text-[0.68rem] tabular-nums text-muted-foreground">
        {shipped} of {lane.articles} published
      </p>

      <p className="mt-3 flex items-baseline gap-1">
        <span className="font-display text-[1.45rem] font-medium leading-none tracking-[-0.03em] text-ink tabular-nums sm:text-[1.7rem]">
          {formatUsd(lane.monthly)}
        </span>
        <span className="text-[0.72rem] text-muted-foreground">/month</span>
      </p>
      {each !== null && (
        <p
          className={cn(
            "mt-1.5 text-[0.75rem] tabular-nums",
            lane.ours ? "font-medium text-cta" : "text-muted-foreground",
          )}
        >
          {cents(each)} an article
        </p>
      )}
      <p className="mt-0.5 min-h-[1rem] text-[0.68rem] text-muted-foreground">
        {lane.note ?? `${lane.articles} articles a month`}
      </p>
    </div>
  );
}
