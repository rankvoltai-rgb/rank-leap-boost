/**
 * The first of the three differences, worked as arithmetic: both plans come
 * with the same allowance of backlink credits, and each exchange spends them
 * by its own published rule. The visitor sets the host site on each side and
 * sees the allowance split into links.
 *
 * The rules are read, not restated: RankPill's from its matrix note (a link
 * costs credits equal to the host site's Domain Rating), Rankbox's from the
 * exchange's own cost table (EXCHANGE_TIER_COST), so the options here are the
 * prices the exchange actually charges. The two sides are separate networks,
 * so the page doesn't pretend a RankPill DR maps to a Rankbox tier; each side
 * has its own control.
 */
import { useId, useState } from "react";
import { cn } from "@/lib/utils";
import { PLAN } from "@/data/pricing";
import type { Competitor } from "@/data/alternatives";
import { EXCHANGE_TIER_COST } from "@/lib/exchange/types";
import { CompetitorMark, RankboxMark } from "@/components/alternatives/kit";
import { CARD, theirCredits } from "./lib";

/* The distinct prices a Rankbox host can charge, cheapest first. */
const RANKBOX_COSTS = [...new Set(EXCHANGE_TIER_COST.filter((n) => n > 0))].sort((a, b) => a - b);

/* One allowance as a strip of tokens, each run of tokens one link. */
function Tokens({ total, cost, tone }: { total: number; cost: number; tone: "rankbox" | "them" }) {
  const links = Math.floor(total / cost);
  const spent = links * cost;
  return (
    <div aria-hidden className="grid grid-cols-[repeat(15,minmax(0,1fr))] gap-[3px]">
      {Array.from({ length: total }, (_, i) => {
        const used = i < spent;
        const odd = Math.floor(i / cost) % 2 === 1;
        return (
          <span
            key={i}
            style={{ transitionDelay: `${i * 12}ms` }}
            className={cn(
              "aspect-square rounded-[3px] border transition-[background-color,border-color] duration-300",
              !used && "border-dashed border-ink/20 bg-white",
              used &&
                tone === "rankbox" &&
                (odd ? "border-cta/0 bg-cta/55" : "border-cta/0 bg-cta"),
              used &&
                tone === "them" &&
                (odd ? "border-ink/0 bg-ink/35" : "border-ink/0 bg-ink/70"),
            )}
          />
        );
      })}
    </div>
  );
}

function Result({ links, spent, total }: { links: number; spent: number; total: number }) {
  return (
    <p className="flex items-baseline justify-between gap-3">
      <span className="font-display text-[1.6rem] font-medium leading-none tracking-[-0.03em] text-ink tabular-nums">
        {links} {links === 1 ? "link" : "links"}
      </span>
      <span className="text-right text-[0.75rem] text-muted-foreground tabular-nums">
        {spent} of {total} credits spent
      </span>
    </p>
  );
}

export function CreditSplit({ competitor: c }: { competitor: Competitor }) {
  const ids = useId();
  const total = theirCredits(c);
  const [dr, setDr] = useState(10);
  const [cost, setCost] = useState(RANKBOX_COSTS[0] ?? 1);
  if (total === null) return null;

  const rule = c.matrix.flatMap((g) => g.rows).find((r) => /backlink/i.test(r.label));
  const addOn = c.positioning.them.find((t) => /credits/i.test(t));
  const ours = PLAN.backlinkCreditsPerMonth;
  /* The data's own sentence for Rankbox's rule where it has one; otherwise
     the same rule, read off the exchange's cost table. */
  const ourRule =
    c.positioning.rankbox.find((t) => /credits/i.test(t) && /tier/i.test(t)) ??
    `A link costs ${RANKBOX_COSTS[0]}–${RANKBOX_COSTS.at(-1)} credits, set by the host site's tier`;

  const theirLinks = Math.floor(total / dr);
  const ourLinks = Math.floor(ours / cost);

  return (
    <div className={cn(CARD, "overflow-hidden")}>
      <div className="flex items-center justify-between gap-3 border-b border-ink/[0.06] px-4 py-3 sm:px-5">
        <span className="text-[0.8rem] font-semibold text-ink">
          {total} credits, spent by each exchange&rsquo;s rule
        </span>
        <span className="rounded-md bg-cta-soft px-2 py-0.5 text-[0.66rem] font-semibold text-cta">
          Try it
        </span>
      </div>

      {/* Their side */}
      <div className="px-4 py-5 sm:px-5">
        <div className="flex items-start gap-2.5">
          <CompetitorMark competitor={c} className="h-6 w-6 text-[0.55rem]" />
          <div className="min-w-0">
            <p className="text-[0.85rem] font-semibold text-ink">{c.name}</p>
            {rule && (
              <p className="mt-0.5 text-[0.75rem] leading-snug text-muted-foreground">
                {rule.them.note}
              </p>
            )}
          </div>
        </div>
        <label htmlFor={`${ids}-dr`} className="mt-4 flex items-center justify-between gap-3">
          <span className="text-[0.75rem] text-muted-foreground">
            Host site&rsquo;s Domain Rating
          </span>
          <span className="rounded-md border border-ink/[0.08] bg-white px-2 py-0.5 text-[0.75rem] font-semibold text-ink tabular-nums">
            DR {dr}
          </span>
        </label>
        <input
          id={`${ids}-dr`}
          type="range"
          min={1}
          max={total * 2}
          value={dr}
          onChange={(e) => setDr(Number(e.target.value))}
          aria-valuetext={`Domain Rating ${dr}: ${theirLinks} ${theirLinks === 1 ? "link" : "links"}`}
          className="mt-2 w-full cursor-pointer accent-cta"
        />
        <div className="mt-4">
          <Tokens total={total} cost={dr} tone="them" />
        </div>
        <div className="mt-3" aria-live="polite">
          <Result links={theirLinks} spent={theirLinks * dr} total={total} />
        </div>
      </div>

      {/* Rankbox */}
      <div className="border-t border-ink/[0.06] bg-[color-mix(in_oklab,var(--cta)_3%,white)] px-4 py-5 sm:px-5">
        <div className="flex items-start gap-2.5">
          <RankboxMark className="h-6 w-6" />
          <div className="min-w-0">
            <p className="text-[0.85rem] font-semibold text-ink">Rankbox</p>
            <p className="mt-0.5 text-[0.75rem] leading-snug text-muted-foreground">{ourRule}</p>
          </div>
        </div>
        <fieldset className="mt-4">
          <legend className="text-[0.75rem] text-muted-foreground">
            Host site&rsquo;s cost per link
          </legend>
          <div className="mt-2 grid grid-cols-3 gap-1 rounded-lg border border-ink/[0.08] bg-white p-1">
            {RANKBOX_COSTS.map((n) => (
              <label
                key={n}
                className={cn(
                  "flex cursor-pointer items-center justify-center rounded-md px-2 py-1.5 text-[0.75rem] font-medium transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-cta/40",
                  cost === n ? "bg-cta-soft text-cta" : "text-muted-foreground hover:text-ink",
                )}
              >
                <input
                  type="radio"
                  name={`${ids}-cost`}
                  value={n}
                  checked={cost === n}
                  onChange={() => setCost(n)}
                  className="sr-only"
                />
                {n} {n === 1 ? "credit" : "credits"}
              </label>
            ))}
          </div>
        </fieldset>
        <div className="mt-4">
          <Tokens total={ours} cost={cost} tone="rankbox" />
        </div>
        <div className="mt-3" aria-live="polite">
          <Result links={ourLinks} spent={ourLinks * cost} total={ours} />
        </div>
      </div>

      {addOn && (
        <p className="border-t border-ink/[0.06] px-4 py-3 text-[0.72rem] leading-relaxed text-muted-foreground sm:px-5">
          <span className="font-medium text-ink">Also on {c.name}:</span> {addOn}
        </p>
      )}
    </div>
  );
}
