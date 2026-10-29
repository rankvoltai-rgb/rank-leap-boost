import { useId, useState } from "react";
import { formatUsd } from "@/sublanding/_shared/facts";
import { cn } from "@/lib/utils";
import { BILLING } from "./content";
import { EXAMPLE_PERIOD_DAYS, firstChargeOnDay } from "./calc";
import { CARD, LedgerRow } from "./parts";

const S = BILLING.slider;

/**
 * A new client part-way through a billing period: drag the day, and the bar
 * shows the share you pay for, worked out with Studio's own share-of-period
 * and allowance functions. It's an example period; Stripe's preview in Studio
 * has the exact figure.
 */
export function FirstCharge() {
  const [day, setDay] = useState(Math.ceil(EXAMPLE_PERIOD_DAYS / 2) + 1);
  const id = useId();
  const charge = firstChargeOnDay(day);
  const used = 1 - charge.share;

  return (
    <div className={cn(CARD, "grid lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]")}>
      <div className="p-6 sm:p-8">
        <h3 className="text-[1.05rem] font-semibold tracking-tight text-ink">{S.title}</h3>

        <div className="mt-8">
          <div aria-hidden className="flex h-4 gap-[2px] overflow-hidden rounded-[4px]">
            {used > 0 && (
              <span
                className="h-full bg-ink/10 motion-safe:transition-[flex-grow] motion-safe:duration-200"
                style={{ flexGrow: used, flexBasis: 0 }}
              />
            )}
            <span
              className="h-full bg-cta motion-safe:transition-[flex-grow] motion-safe:duration-200"
              style={{ flexGrow: charge.share, flexBasis: 0 }}
            />
          </div>
          <div aria-hidden className="mt-2 flex justify-between text-xs text-muted-foreground">
            <span>{S.start}</span>
            <span>{S.end}</span>
          </div>
        </div>

        <label htmlFor={id} className="mt-7 block text-sm font-medium text-ink">
          {S.label}
        </label>
        <div className="mt-3 flex items-center gap-4">
          <input
            id={id}
            type="range"
            min={1}
            max={EXAMPLE_PERIOD_DAYS}
            step={1}
            value={day}
            onChange={(e) => setDay(Number(e.target.value))}
            aria-valuetext={S.valueText(day)}
            className="h-6 w-full cursor-pointer accent-cta focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta/40 focus-visible:ring-offset-2 rounded-full"
          />
          <output
            htmlFor={id}
            className="w-24 shrink-0 text-right text-sm font-medium tabular-nums text-ink"
          >
            {S.valueText(day)}
          </output>
        </div>

        <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted-foreground">
          <li className="flex items-center gap-2">
            <span aria-hidden className="h-2.5 w-2.5 rounded-[2px] bg-ink/10" />
            {S.used}
          </li>
          <li className="flex items-center gap-2">
            <span aria-hidden className="h-2.5 w-2.5 rounded-[2px] bg-cta" />
            {S.paid}
          </li>
        </ul>
      </div>

      <div className="flex flex-col justify-center border-t border-border bg-surface/60 p-6 sm:p-8 lg:border-l lg:border-t-0">
        <div aria-live="polite" aria-atomic="true">
          <p className="text-sm text-muted-foreground">{S.due}</p>
          <p className="mt-1 font-display text-[2.5rem] font-semibold leading-none tracking-[-0.035em] text-ink">
            {formatUsd(charge.dueToday)}
          </p>
        </div>
        <dl className="mt-6 space-y-4">
          <LedgerRow label={S.shareLeft} value={`${Math.round(charge.share * 100)}%`} />
          <div>
            <dt className="text-sm text-muted-foreground">{S.allowance}</dt>
            <dd className="mt-1 text-sm font-medium text-ink">
              {S.allowanceText(charge.allowance)}
            </dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">{S.then}</dt>
            <dd className="mt-1 text-sm font-medium text-ink">{S.thenText}</dd>
          </div>
        </dl>
        <p className="mt-6 text-xs leading-relaxed text-muted-foreground">{S.caveat}</p>
      </div>
    </div>
  );
}
