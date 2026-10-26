/**
 * The other head-to-heads, as hairline cells: the same shortlist first (the
 * order relatedMatchups gives), each with its score and who each side is for,
 * and a last cell for the hub.
 */
import { Link } from "@tanstack/react-router";
import { ArrowRight, Swords } from "lucide-react";
import {
  Accent,
  Band,
  CELL,
  CellGrid,
  GHOST_BUTTON,
  Pill,
  Spacer,
} from "@/components/landing/frame";
import { ProductMark } from "@/components/compare/kit";
import {
  MATCHUPS,
  getCategory,
  matchupTitle,
  relatedMatchups,
  sidesOf,
  type Matchup,
} from "@/data/compare/matchups";
import { cn } from "@/lib/utils";
import { SIDES, plural } from "./util";

/** "Teams that…" → "teams that…", but "SEOs who…" stays as written. */
const lowerFirst = (s: string) => (/^[A-Z][a-z]/.test(s) ? s[0].toLowerCase() + s.slice(1) : s);

const HOVER =
  "transition-colors duration-300 hover:bg-[color-mix(in_oklab,var(--surface)_35%,white)]";

export function Related({ matchup }: { matchup: Matchup }) {
  const related = relatedMatchups(matchup, MATCHUPS.length - 1);
  if (related.length === 0) return null;

  return (
    <section aria-labelledby="related-title">
      <Spacer />
      <Band inner="flex flex-wrap items-end justify-between gap-4 px-5 py-10 sm:px-10 lg:px-12">
        <div>
          <Pill icon={Swords}>More head-to-heads</Pill>
          <h2
            id="related-title"
            className="mt-4 font-display text-[1.7rem] font-medium leading-tight tracking-[-0.025em] text-ink sm:text-[2rem]"
          >
            Still <Accent>shortlisting?</Accent>
          </h2>
          <p className="mt-2 max-w-lg text-[0.92rem] text-muted-foreground">
            The same rounds, run on the other pairs people weigh.
          </p>
        </div>
        <Link to="/compare" className={GHOST_BUTTON}>
          All head-to-heads
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </Band>
      <Band>
        <CellGrid className="sm:grid-cols-2 lg:grid-cols-3">
          {related.map((m) => {
            const s = sidesOf(m);
            const { a, b, draw } = m.tally;
            return (
              <li key={m.slug} className={CELL}>
                <Link
                  to="/compare/$slug"
                  params={{ slug: m.slug }}
                  className={cn(
                    "group flex h-full flex-col p-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-cta/40 sm:p-7",
                    HOVER,
                  )}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="flex -space-x-1.5">
                      <ProductMark product={s.a} className="h-8 w-8 text-xs ring-2 ring-white" />
                      <ProductMark product={s.b} className="h-8 w-8 text-xs ring-2 ring-white" />
                    </span>
                    <span
                      title={`Rounds won: ${s.a.name} ${a}, ${s.b.name} ${b}${draw ? `, ${plural(draw, "draw")}` : ""}`}
                      className="rounded-md border border-ink/[0.08] px-2 py-0.5 text-[0.72rem] font-medium tabular-nums text-ink"
                    >
                      {a}&ndash;{b}
                      {draw > 0 && (
                        <span className="text-muted-foreground"> · {plural(draw, "draw")}</span>
                      )}
                    </span>
                  </div>
                  <p className="mt-5 text-[0.7rem] font-medium uppercase tracking-[0.12em] text-cta">
                    {getCategory(m.category).name}
                  </p>
                  <h3 className="mt-1 text-[1.05rem] font-semibold tracking-tight text-ink">
                    {matchupTitle(m)}
                  </h3>
                  <ul className="mt-3 flex-1 space-y-2">
                    {SIDES.map((side) => (
                      <li key={side} className="text-[0.82rem] leading-snug text-muted-foreground">
                        <span className="font-medium text-ink">{s[side].name}</span> for{" "}
                        {lowerFirst(m.bestFor[side])}
                      </li>
                    ))}
                  </ul>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-[0.82rem] font-medium text-ink transition-colors group-hover:text-cta">
                    Read the verdict
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Link>
              </li>
            );
          })}
          <li className={CELL}>
            <Link
              to="/compare"
              className={cn(
                "group flex h-full min-h-[10rem] flex-col justify-between p-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-cta/40 sm:p-7",
                HOVER,
              )}
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-cta-soft text-cta">
                <Swords className="h-4 w-4" aria-hidden />
              </span>
              <span>
                <span className="block text-[1.05rem] font-semibold tracking-tight text-ink">
                  Every head-to-head
                </span>
                <span className="mt-1 inline-flex items-center gap-1.5 text-[0.82rem] font-medium text-ink/70 transition-colors group-hover:text-cta">
                  {plural(MATCHUPS.length, "comparison")}, by category
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </span>
            </Link>
          </li>
        </CellGrid>
      </Band>
    </section>
  );
}
