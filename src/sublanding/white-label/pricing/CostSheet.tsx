import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { PER_ARTICLE, SHEET, SITE_PRICE } from "./content";
import { CARD, LedgerRow } from "./parts";

/**
 * The hero's visual: one client site, itemised the way an agency's own cost
 * sheet would list it. Every figure is read from pricing.ts through content.
 */
export function CostSheet({ className }: { className?: string }) {
  return (
    <figure aria-label={SHEET.alt} className={cn(CARD, "overflow-hidden", className)}>
      <div className="flex items-baseline justify-between gap-4 border-b border-border px-6 py-4">
        <span className="text-sm font-semibold text-ink">{SHEET.title}</span>
        <span className="text-xs text-muted-foreground">{SHEET.caption}</span>
      </div>

      <div className="px-6 pb-6 pt-6">
        <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-1">
          <span className="text-sm text-muted-foreground">{SHEET.siteLine}</span>
          <span className="font-display text-[2.6rem] font-semibold leading-none tracking-[-0.04em] text-ink">
            {SITE_PRICE}
            <span className="ml-1 font-sans text-base font-normal tracking-normal text-muted-foreground">
              {SHEET.siteUnit}
            </span>
          </span>
        </div>

        <p className="mt-6 text-xs font-medium text-muted-foreground">{SHEET.includedLabel}</p>
        <ul className="mt-3 space-y-2.5">
          {SHEET.included.map((item) => (
            <li key={item} className="flex gap-2.5 text-sm leading-snug text-ink">
              <Check aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-cta" />
              <span>{item}</span>
            </li>
          ))}
        </ul>

        <dl className="mt-6 space-y-2.5 border-t border-border pt-5">
          <LedgerRow label={SHEET.perArticleLabel} value={PER_ARTICLE} />
          {SHEET.nones.map((n) => (
            <LedgerRow key={n.label} label={n.label} value={n.value} />
          ))}
        </dl>
      </div>

      <figcaption className="border-t border-border bg-surface/70 px-6 py-3 text-xs text-muted-foreground">
        {SHEET.foot}
      </figcaption>
    </figure>
  );
}
