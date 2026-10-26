/**
 * Every other head-to-head, as hairline cells: the pair's marks, its score,
 * and who each side is for. The last cell is the hub, so the grid closes
 * full whatever the count.
 */
import { Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight, Shuffle } from "lucide-react";
import { Band, CELL, CellGrid, GHOST_BUTTON, Pill, Spacer } from "@/components/landing/frame";
import { ProductMark } from "@/components/compare/kit";
import {
  CATEGORIES,
  MATCHUPS,
  getCategory,
  matchupTitle,
  relatedMatchups,
  sidesOf,
  type Matchup,
} from "@/data/compare/matchups";
import type { Side } from "@/data/compare/types";
import { cn } from "@/lib/utils";

const SIDES: Side[] = ["a", "b"];

/** "Teams that…" → "teams that…", but "SEOs who…" stays as written. */
const lowerFirst = (s: string) => (/^[A-Z][a-z]/.test(s) ? s[0].toLowerCase() + s.slice(1) : s);

const HOVER =
  "transition-colors duration-300 hover:bg-[color-mix(in_oklab,var(--surface)_35%,white)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-cta/40";

export function Related({ matchup }: { matchup: Matchup }) {
  const related = relatedMatchups(matchup, MATCHUPS.length - 1);
  if (related.length === 0) return null;

  return (
    <section aria-labelledby="related-title">
      <Spacer />
      <Band inner="flex flex-wrap items-end justify-between gap-5 px-6 py-10 sm:px-10 lg:px-12">
        <div>
          <Pill icon={Shuffle}>More head-to-heads</Pill>
          <h2
            id="related-title"
            className="mt-4 font-display text-[1.6rem] font-medium leading-tight tracking-[-0.025em] text-ink sm:text-[1.9rem]"
          >
            Still shortlisting?
          </h2>
          <p className="mt-2 max-w-xl text-[0.92rem] text-muted-foreground">
            The same rounds, run on the other pairs people weigh.
          </p>
        </div>
        <Link to="/compare" className={GHOST_BUTTON}>
          All head-to-heads
          <ArrowRight className="h-3.5 w-3.5" aria-hidden />
        </Link>
      </Band>

      <Band>
        <CellGrid className="sm:grid-cols-2 lg:grid-cols-3">
          {related.map((m) => {
            const sides = sidesOf(m);
            const { a, b, draw } = m.tally;
            return (
              <li key={m.slug} className={CELL}>
                <Link
                  to="/compare/$slug"
                  params={{ slug: m.slug }}
                  className={cn("group flex h-full flex-col p-6 sm:p-7", HOVER)}
                >
                  <span className="flex items-center justify-between gap-3">
                    <span className="flex items-center -space-x-1.5" aria-hidden>
                      <ProductMark
                        product={sides.a}
                        className="h-8 w-8 text-xs ring-2 ring-white"
                      />
                      <ProductMark
                        product={sides.b}
                        className="h-8 w-8 text-xs ring-2 ring-white"
                      />
                    </span>
                    <span className="text-[0.75rem] font-medium text-muted-foreground">
                      {getCategory(m.category).name}
                    </span>
                  </span>
                  <span className="mt-5 text-[1.05rem] font-semibold leading-snug tracking-tight text-ink">
                    {matchupTitle(m)}
                  </span>
                  <span className="mt-1 text-[0.78rem] tabular-nums text-muted-foreground">
                    Rounds won: {sides.a.name} {a}, {sides.b.name} {b}
                    {draw > 0 && `, ${draw} ${draw === 1 ? "draw" : "draws"}`}
                  </span>
                  <span className="mt-4 flex-1 space-y-2">
                    {SIDES.map((s) => (
                      <span key={s} className="flex gap-2 text-[0.84rem] leading-snug">
                        <ProductMark product={sides[s]} className="mt-px h-4 w-4 text-[0.45rem]" />
                        <span className="text-muted-foreground">
                          <span className="font-medium text-ink">{sides[s].name}</span> for{" "}
                          {lowerFirst(m.bestFor[s])}
                        </span>
                      </span>
                    ))}
                  </span>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-[0.84rem] font-semibold text-cta">
                    Read the verdict
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Link>
              </li>
            );
          })}
          <li className={CELL}>
            <Link
              to="/compare"
              className={cn("group flex h-full flex-col justify-between p-6 sm:p-7", HOVER)}
            >
              <span className="flex items-center justify-between text-[0.75rem] font-medium text-muted-foreground">
                The hub
                <ArrowUpRight
                  aria-hidden
                  className="h-4 w-4 text-muted-foreground/60 transition-[transform,color] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-blue"
                />
              </span>
              <span className="mt-6 font-display text-[1.5rem] font-medium leading-tight tracking-[-0.025em] text-ink">
                Every head-to-head, <span className="font-bold text-brand-blue">in one place</span>
              </span>
              <span className="mt-3 text-[0.84rem] text-muted-foreground">
                {MATCHUPS.length} pairs in {CATEGORIES.length} categories, each scored round by
                round.
              </span>
            </Link>
          </li>
        </CellGrid>
      </Band>
    </section>
  );
}
