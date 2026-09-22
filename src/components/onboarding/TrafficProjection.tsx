/**
 * The onboarding rail: the traffic the plan is projected to earn, what has
 * been confirmed so far, and one customer quote.
 *
 *   Step 1  nothing to project yet, so it says what unlocks the number.
 *   Step 2  previewed from the keyword set; it moves as keywords are edited.
 *   Step 3  the sum of the planned articles' own estimates.
 *
 * Both numbers come from one model (modeledTraffic), are labelled Modeled, and
 * the method is one click away. It is a projection, not measured traffic.
 *
 * Below lg the rail is hidden and ProjectionStrip carries the number instead.
 */
import { useState } from "react";
import { CalendarClock, Search } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { CountUp } from "@/components/ui/count-up";
import { modeledTraffic } from "@/lib/site-meta";
import type { DraftKeyword, DraftTitle } from "@/lib/data";
import { Burst, type Step } from "./shell";
import { ProofQuote } from "./ProofColumn";

export interface ProjectionInput {
  step: Step;
  domain: string;
  keywords: DraftKeyword[];
  titles: DraftTitle[];
}

function useProjection({ step, keywords, titles }: ProjectionInput) {
  const planned = step === 3 && titles.length > 0;
  const previewed = step >= 2 && keywords.length > 0;
  const traffic = planned
    ? titles.reduce((sum, t) => sum + t.traffic_estimate, 0)
    : [...keywords]
        .sort((a, b) => b.search_volume - a.search_volume)
        .reduce((sum, k, i) => sum + modeledTraffic(k.search_volume, i), 0);
  return { planned, shown: previewed || planned, traffic };
}

function Methodology() {
  const [open, setOpen] = useState(false);
  return (
    <div className="px-1">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="text-xs font-medium text-muted-foreground underline decoration-border underline-offset-4 transition-colors hover:text-ink hover:decoration-ink/40"
      >
        How we estimate this
      </button>
      {open && (
        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
          Each article's estimate is its keyword's monthly search volume multiplied by an assumed
          capture rate, which decays for articles further down the plan. Search volumes are
          estimates too. It's a projection, not a measurement: actual traffic depends on your
          domain, your competition, and how each article performs once it's live.
        </p>
      )}
    </div>
  );
}

function SummaryItem({
  icon,
  title,
  sub,
  state,
  onEdit,
}: {
  icon: ReactNode;
  title: string;
  sub: string;
  state: "done" | "current" | "pending";
  onEdit?: () => void;
}) {
  return (
    <li className="flex items-center gap-3 px-4 py-3.5">
      <span
        className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-xl border",
          state === "pending"
            ? "border-dashed border-border text-muted-foreground/60"
            : "border-border bg-surface text-ink",
        )}
      >
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <p
          className={cn(
            "truncate text-sm font-semibold",
            state === "pending" ? "text-muted-foreground" : "text-ink",
          )}
        >
          {title}
        </p>
        <p className="truncate text-xs text-muted-foreground">{sub}</p>
      </div>
      {state === "done" && onEdit ? (
        <button
          type="button"
          onClick={onEdit}
          className="shrink-0 rounded-md px-1.5 py-1 text-xs font-semibold text-muted-foreground transition-colors hover:bg-secondary hover:text-ink"
        >
          Edit
        </button>
      ) : state === "current" ? (
        <span
          className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand-blue"
          aria-label="In progress"
        />
      ) : null}
    </li>
  );
}

export function PlanRail({
  step,
  domain,
  brandName,
  logoUrl,
  keywords,
  titles,
  onStep,
  proof = true,
}: ProjectionInput & {
  brandName: string;
  logoUrl: string | null;
  onStep: (step: Step) => void;
  /** The customer quote under the summary. Studio, inside a paid account, leaves it out. */
  proof?: boolean;
}) {
  const { planned, shown, traffic } = useProjection({ step, domain, keywords, titles });
  const searches = keywords.reduce((sum, k) => sum + k.search_volume, 0);
  const stateOf = (n: Step) => (n < step ? "done" : n === step ? "current" : "pending");

  const status =
    step === 1
      ? "Appears once we've analyzed your site."
      : !shown
        ? step === 2
          ? "Sizing the searches your buyers make…"
          : "Sizing each article in your plan…"
        : planned
          ? `From ${titles.length} articles in your plan.`
          : `From the ${keywords.length} keywords you're targeting.`;

  return (
    <div className="space-y-5">
      <div className="relative overflow-hidden rounded-2xl bg-brand-blue p-6 text-white shadow-2">
        {planned && <Burst key={titles.length} />}
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-medium text-white/85">
            {domain ? `Projected visits to ${domain}` : "Projected monthly visits"}
          </p>
          <span className="shrink-0 rounded-full bg-white/15 px-2 py-0.5 text-[0.6rem] font-semibold uppercase tracking-[0.1em]">
            Modeled
          </span>
        </div>
        <p
          className={cn(
            "font-display mt-3 text-[2.75rem] font-semibold leading-none tabular-nums tracking-tight",
            !shown && "text-white/35",
          )}
        >
          {shown ? <CountUp value={traffic} duration={900} /> : "—"}
        </p>
        <p className="mt-1 text-xs text-white/70">visits a month</p>
        <p className="mt-4 border-t border-white/15 pt-3.5 text-sm leading-snug text-white/85">
          {status}
        </p>
      </div>
      <Methodology />

      <ul className="divide-y divide-border rounded-2xl border border-border bg-card">
        <SummaryItem
          icon={
            logoUrl ? (
              <img src={logoUrl} alt="" className="h-full w-full object-contain p-1" />
            ) : (
              <span className="text-sm font-semibold">
                {(brandName.trim()[0] || "?").toUpperCase()}
              </span>
            )
          }
          title={brandName.trim() || "Your brand"}
          sub={domain || "Add your website"}
          state={stateOf(1)}
          onEdit={() => onStep(1)}
        />
        <SummaryItem
          icon={<Search className="h-4 w-4" />}
          title={step >= 2 && keywords.length ? `${keywords.length} keywords` : "Keywords"}
          sub={
            step >= 2 && keywords.length
              ? `${searches.toLocaleString()} searches a month`
              : "Found from your site"
          }
          state={stateOf(2)}
          onEdit={() => onStep(2)}
        />
        <SummaryItem
          icon={<CalendarClock className="h-4 w-4" />}
          title={planned ? `${titles.length} articles` : "Content plan"}
          sub={planned ? "One a day on autopilot" : "Built from your keywords"}
          state={stateOf(3)}
        />
      </ul>

      {proof && <ProofQuote />}
    </div>
  );
}

/** The projection for small screens, where the rail is hidden. */
export function ProjectionStrip(input: ProjectionInput) {
  const { shown, traffic } = useProjection(input);
  if (!shown) return null;
  return (
    <div className="mb-6 flex items-center justify-between gap-3 rounded-xl bg-brand-blue px-4 py-3 text-white lg:hidden">
      <div className="min-w-0">
        <p className="truncate text-xs text-white/80">Projected visits a month</p>
        <p className="mt-0.5 text-[0.65rem] font-semibold uppercase tracking-[0.1em] text-white/70">
          Modeled
        </p>
      </div>
      <p className="font-display text-2xl font-semibold tabular-nums tracking-tight">
        <CountUp value={traffic} duration={900} />
      </p>
    </div>
  );
}
