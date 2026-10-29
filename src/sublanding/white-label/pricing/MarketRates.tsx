import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { MARKET } from "./content";
import { CARD, FOCUS, Lead, Section, SectionTitle } from "./parts";

const MAX_SHARE = Math.max(...MARKET.chart.bands.map((b) => b.share));

/**
 * Market context, never advice: one survey's retainer distribution drawn as a
 * single-series bar chart (it's a real table underneath, so the numbers read
 * without the bars), then three dated figures from other published sources.
 */
export function MarketRates() {
  const { chart } = MARKET;
  return (
    <Section id="market-rates">
      <SectionTitle id="market-rates" />
      <Lead>{MARKET.intro}</Lead>

      <div className="mt-12 grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-10">
        <figure className={cn(CARD, "p-6 sm:p-8 lg:self-start")}>
          <table className="w-full border-collapse">
            <caption className="sr-only">{chart.tableCaption}</caption>
            <thead className="sr-only">
              <tr>
                <th scope="col">{chart.columns.band}</th>
                <th scope="col">{chart.columns.share}</th>
              </tr>
            </thead>
            <tbody>
              {chart.bands.map((b) => (
                <tr key={b.band} className="group">
                  <th
                    scope="row"
                    className="w-[7.5rem] py-2 pr-3 text-left align-middle text-sm font-normal text-ink sm:w-[9rem]"
                  >
                    {b.band}
                  </th>
                  <td className="py-2 align-middle">
                    <div className="relative flex items-center gap-2.5">
                      <span
                        aria-hidden
                        className={cn(
                          "block h-5 rounded-r-[4px] transition-opacity group-hover:opacity-80",
                          b.stated ? "bg-cta" : "bg-cta/35",
                        )}
                        style={{ width: `${(b.share / MAX_SHARE) * 80}%`, minWidth: "0.5rem" }}
                      />
                      <span className="text-sm font-medium tabular-nums text-ink">
                        {b.share}%
                        <span className="sr-only">
                          {" "}
                          ({b.stated ? chart.statedLabel : chart.derivedLabel})
                        </span>
                      </span>
                      <span
                        aria-hidden
                        className="pointer-events-none absolute bottom-full left-0 z-10 mb-1.5 hidden max-w-[16rem] rounded-md border border-border bg-white px-2.5 py-1.5 text-xs leading-snug text-ink shadow-[0_8px_24px_-12px_rgba(16,24,40,0.3)] group-hover:block"
                      >
                        {b.stated ? chart.statedLabel : chart.derivedLabel}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <figcaption className="mt-6 border-t border-border pt-5">
            <p className="text-sm font-semibold text-ink">{chart.title}</p>
            <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted-foreground">
              <li className="flex items-center gap-2">
                <span aria-hidden className="h-2.5 w-2.5 rounded-[2px] bg-cta" />
                {chart.statedLabel}
              </li>
              <li className="flex items-center gap-2">
                <span aria-hidden className="h-2.5 w-2.5 rounded-[2px] bg-cta/35" />
                {chart.derivedLabel}
              </li>
            </ul>
            <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{chart.sample}</p>
            <SourceLink {...chart.source} className="mt-3" />
          </figcaption>
        </figure>

        <div className="flex flex-col">
          <ul className="divide-y divide-border border-y border-border">
            {MARKET.notes.map((n) => (
              <li key={n.figure} className="py-6">
                <p className="font-display text-[1.9rem] font-semibold leading-none tracking-[-0.03em] text-ink">
                  {n.figure}
                </p>
                <p className="mt-2.5 text-sm leading-relaxed text-ink/80">{n.text}</p>
                <SourceLink {...n.source} className="mt-3" />
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-muted-foreground">{MARKET.opened}</p>
        </div>
      </div>
    </Section>
  );
}

function SourceLink({
  name,
  url,
  published,
  className,
}: {
  name: string;
  url: string;
  published: string;
  className?: string;
}) {
  return (
    <p className={cn("text-xs text-muted-foreground", className)}>
      <span className="sr-only">{MARKET.sourceLabel}: </span>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "inline-flex items-center gap-1 rounded-sm font-medium text-ink underline decoration-ink/20 underline-offset-4 transition-colors hover:decoration-ink/60",
          FOCUS,
        )}
      >
        {name}
        <ExternalLink aria-hidden className="h-3 w-3" />
      </a>
      <span>, {published}</span>
    </p>
  );
}
