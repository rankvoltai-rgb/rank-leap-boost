/**
 * The hub's focal picture: every head-to-head on one board, each row a page,
 * each square a round on that page. The rows are the links, so the board is
 * also the table of contents (as the old hero's row of face-offs was).
 *
 * As each row comes more than half on screen, its rounds get called: the
 * draws on the centre line first, then a win each side in turn, working
 * outward. Off screen it empties again, so it replays on the way back. With
 * reduced motion every round is called at once and nothing moves.
 */
import { useEffect, useRef, useState, type CSSProperties, type RefObject } from "react";
import { Link } from "@tanstack/react-router";
import { useInView, useReducedMotion } from "motion/react";
import { ArrowRight, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import { Band, LINE, PANEL } from "@/components/landing/frame";
import { CATEGORIES, MATCHUPS, matchupTitle, sidesOf, type Matchup } from "@/data/compare/matchups";
import type { Product } from "@/data/compare/products";
import { ProductMark } from "@/components/compare/kit";
import { plural } from "./copy";
import { RoundStrip, StripLegend, Tally, type StripPlay } from "./parts";

/* Grouped by what the buyer is shopping for, in the filter's order. */
const GROUPS = CATEGORIES.map((category) => ({
  category,
  rows: MATCHUPS.filter((m) => m.category === category.id),
})).filter((g) => g.rows.length > 0);

const GRAPH: CSSProperties = {
  backgroundImage:
    "linear-gradient(to right, rgba(16,24,40,0.045) 1px, transparent 1px), linear-gradient(to bottom, rgba(16,24,40,0.045) 1px, transparent 1px)",
  backgroundSize: "28px 28px",
  backgroundPosition: "center top",
};

/* A contender's name beside its mark. On the board the marks sit against the
   strip, so side A reads name-then-mark and side B mark-then-name; stacked on
   a phone, the pair spreads to the row's two ends instead. */
function Contender({ product, side }: { product: Product; side: "a" | "b" }) {
  return (
    <span
      className={cn(
        "flex min-w-0 items-center gap-2.5",
        side === "a" ? "md:flex-row-reverse" : "flex-row-reverse md:flex-row",
      )}
    >
      <ProductMark product={product} className="h-8 w-8 text-xs md:h-9 md:w-9" />
      <span className={cn("min-w-0", side === "a" ? "md:text-right" : "text-right md:text-left")}>
        <span className="block truncate text-[0.95rem] font-semibold tracking-[-0.01em] text-ink">
          {product.name}
        </span>
        <span className="hidden truncate text-[0.74rem] text-muted-foreground lg:block">
          {product.kind}
        </span>
      </span>
    </span>
  );
}

/* Each row calls its rounds once it is more than half on screen, and empties
   again only once it has left entirely, so a row never flickers at the edge
   and a phone (where the board is taller than the screen) sees every row
   called as it scrolls up. */
function useCalled(ref: RefObject<HTMLElement | null>) {
  const half = useInView(ref, { amount: 0.6 });
  const present = useInView(ref);
  const [on, setOn] = useState(false);
  useEffect(() => {
    if (half) setOn(true);
    else if (!present) setOn(false);
  }, [half, present]);
  return on;
}

function BoardRow({ matchup, reduce }: { matchup: Matchup; reduce: boolean }) {
  const ref = useRef<HTMLLIElement>(null);
  const on = useCalled(ref);
  const play: StripPlay = { on, reduce, start: 0.12 };
  const sides = sidesOf(matchup);
  const { a, b, draw } = matchup.tally;
  return (
    <li ref={ref}>
      <Link
        to="/compare/$slug"
        params={{ slug: matchup.slug }}
        aria-label={`${matchupTitle(matchup)}, rounds won ${a}–${b}${draw ? `, ${plural(draw, "draw")}` : ""}`}
        className="group grid grid-cols-2 items-center gap-x-3 gap-y-3.5 px-4 py-4 transition-colors duration-200 hover:bg-cta-soft/60 focus-visible:bg-cta-soft/60 focus-visible:outline-none md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_6.5rem_1rem] md:gap-x-5 md:px-6 md:py-3.5"
      >
        <Contender product={sides.a} side="a" />
        <RoundStrip
          matchup={matchup}
          play={play}
          className="col-span-2 row-start-2 justify-self-center md:col-span-1 md:row-start-auto"
        />
        <Contender product={sides.b} side="b" />
        <span className="col-span-2 flex items-center justify-center gap-1.5 md:col-span-1 md:justify-end">
          <Tally matchup={matchup} />
          <ArrowRight className="h-3.5 w-3.5 text-cta transition-transform group-hover:translate-x-0.5 md:hidden" />
        </span>
        <ArrowRight
          aria-hidden
          className="hidden h-4 w-4 text-ink/30 transition-[transform,color] group-hover:translate-x-0.5 group-hover:text-cta md:block"
        />
      </Link>
    </li>
  );
}

function Scoreboard() {
  const reduce = useReducedMotion() ?? false;

  return (
    <div className="mx-auto max-w-5xl overflow-hidden rounded-2xl border border-ink/[0.08] bg-white text-left shadow-[0_1px_2px_rgba(16,24,40,0.04),0_28px_64px_-32px_rgba(16,24,40,0.32)]">
      <div
        className={cn(
          "flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-b px-4 py-3 md:px-6",
          LINE,
        )}
      >
        <span className="flex items-center gap-2.5 text-[0.85rem] font-medium text-ink">
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-cta-soft text-brand-blue">
            <Trophy aria-hidden className="h-3.5 w-3.5" />
          </span>
          Rounds won on each page
        </span>
        <StripLegend />
      </div>

      <div className="divide-y divide-ink/[0.07]">
        {GROUPS.map((g) => (
          <div key={g.category.id}>
            <p
              className={cn(
                "border-b px-4 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground md:px-6",
                LINE,
                PANEL,
              )}
            >
              {g.category.name}
            </p>
            <ul className="divide-y divide-ink/[0.06]">
              {g.rows.map((m) => (
                <BoardRow key={m.slug} matchup={m} reduce={reduce} />
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

/* The board on a grey panel ruled like graph paper, rising in after the
   hero copy. */
export function ScoreboardBand({ style }: { style?: CSSProperties }) {
  return (
    <section aria-label="Every head-to-head, round by round">
      <Band inner={cn("overflow-hidden", PANEL)}>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_75%_80%_at_50%_40%,#000_35%,transparent_100%)]"
          style={GRAPH}
        />
        <div
          className="relative px-3 pb-12 pt-10 motion-safe:animate-hero-rise sm:px-8 sm:pb-16 sm:pt-14 lg:px-14"
          style={style}
        >
          <Scoreboard />
        </div>
      </Band>
    </section>
  );
}
