/**
 * Onboarding's right column: the traffic the plan is projected to earn, updated
 * live as the user moves through the steps.
 *
 *   Step 1  nothing to project yet, so it says what unlocks the number.
 *   Step 2  previewed from the keyword set; it moves as keywords are edited.
 *   Step 3  the sum of the planned articles' own estimates.
 *
 * Both numbers come from one model (modeledTraffic), are labelled Modeled, and
 * the method is one click away. It is a projection, not measured traffic.
 */
import { useState } from "react";
import { ChevronDown, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { CountUp } from "@/components/ui/count-up";
import { modeledTraffic } from "@/lib/site-meta";
import type { DraftKeyword, DraftTitle } from "@/lib/data";
import { Burst, type Step } from "./shell";

const TICKS = 32;

function Stat({ label, value, sub }: { label: string; value: React.ReactNode; sub: string }) {
  return (
    <div className="px-4 py-3.5">
      <p className="text-[0.64rem] font-semibold uppercase tracking-[0.11em] text-muted-foreground">
        {label}
      </p>
      <p className="font-display mt-1 text-xl font-semibold tabular-nums text-ink">{value}</p>
      <p className="mt-0.5 text-xs text-muted-foreground">{sub}</p>
    </div>
  );
}

/** Setup progress as a tick scale with a moving readout. */
function ProgressTicks({ progress }: { progress: number }) {
  const filled = Math.round((progress / 100) * TICKS);
  return (
    <div
      role="progressbar"
      aria-label="Setup progress"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={progress}
      className="mt-8"
    >
      <div className="relative h-5">
        <span
          className="absolute -translate-x-1/2 rounded-md bg-white/15 px-1.5 py-0.5 text-[0.64rem] font-semibold tabular-nums transition-[left] duration-300"
          style={{ left: `${Math.min(90, Math.max(10, progress))}%` }}
        >
          {progress}%
        </span>
      </div>
      <div className="mt-1.5 flex h-3 items-end justify-between">
        {Array.from({ length: TICKS }, (_, i) => (
          <span
            key={i}
            className={cn(
              "w-px rounded-full transition-colors duration-300",
              i < filled ? "h-3 bg-white" : "h-2 bg-white/35",
            )}
          />
        ))}
      </div>
    </div>
  );
}

function Methodology() {
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-3 rounded-xl border border-border bg-card">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center gap-2 px-4 py-2.5 text-left"
      >
        <Info className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
        <span className="flex-1 text-xs font-medium text-ink">How we estimate this</span>
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform",
            open && "rotate-180",
          )}
        />
      </button>
      {open && (
        <p className="border-t border-border px-4 py-3 text-xs leading-relaxed text-muted-foreground">
          Each article's estimate is its keyword's monthly search volume multiplied by an assumed
          capture rate, which decays for articles further down the plan. Search volumes are
          estimates too. It's a projection, not a measurement — actual traffic depends on your
          domain, your competition, and how each article performs once it's live.
        </p>
      )}
    </div>
  );
}

export function TrafficProjection({
  step,
  domain,
  keywords,
  titles,
}: {
  step: Step;
  domain: string;
  keywords: DraftKeyword[];
  titles: DraftTitle[];
}) {
  const planned = step === 3 && titles.length > 0;
  const previewed = step >= 2 && keywords.length > 0;

  const searches = keywords.reduce((sum, k) => sum + k.search_volume, 0);
  const traffic = planned
    ? titles.reduce((sum, t) => sum + t.traffic_estimate, 0)
    : [...keywords]
        .sort((a, b) => b.search_volume - a.search_volume)
        .reduce((sum, k, i) => sum + modeledTraffic(k.search_volume, i), 0);
  const avgSignal = titles.length
    ? Math.round(titles.reduce((sum, t) => sum + t.ai_signal, 0) / titles.length)
    : 0;

  // Starts above zero so the finish reads as close; full only once confirmed.
  const progress = step === 1 ? 15 : step === 2 ? (previewed ? 60 : 40) : planned ? 90 : 75;

  const status =
    step === 1
      ? "Analyze your site to see what your content could earn."
      : step === 2 && !previewed
        ? "Finding the searches your buyers make…"
        : step === 3 && !planned
          ? "Sizing each article in your plan…"
          : planned
            ? `From ${titles.length} articles in your plan`
            : `From ${keywords.length} keywords you're targeting`;

  return (
    <div>
      <div className="relative overflow-hidden rounded-xl bg-brand-blue px-6 py-7 text-white shadow-2">
        {planned && <Burst key={titles.length} />}
        <p className="text-center text-sm font-medium text-white/80">
          {domain ? `Projected traffic for ${domain}` : "Projected monthly traffic"}
        </p>
        <p className="font-display mt-4 text-center text-5xl font-semibold tabular-nums tracking-tight">
          {previewed || planned ? <CountUp value={traffic} duration={900} /> : "—"}
        </p>
        <p className="mt-1.5 text-center text-xs text-white/70">
          visits / month ·{" "}
          <span className="font-semibold uppercase tracking-wide text-white/85">Modeled</span>
        </p>
        <p className="mt-5 text-center text-sm leading-snug text-white/90">{status}</p>
        <ProgressTicks progress={progress} />
      </div>

      {(previewed || planned) && (
        <div className="mt-3 grid grid-cols-2 divide-x divide-border rounded-xl border border-border bg-card">
          {planned ? (
            <>
              <Stat label="Articles" value={titles.length} sub="Published daily" />
              <Stat label="AI signal" value={avgSignal} sub="Avg. citability" />
            </>
          ) : (
            <>
              <Stat label="Keywords" value={keywords.length} sub="Targeted" />
              <Stat label="Searches" value={searches.toLocaleString()} sub="Per month" />
            </>
          )}
        </div>
      )}

      <Methodology />
    </div>
  );
}
