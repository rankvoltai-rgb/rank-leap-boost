/**
 * The opening of /compare/koala-ai-vs-byword: a split hero (the matchup and
 * what the choice is really between on the left, the short answer and the
 * round-by-round score on the right), closed by a band of the two "choose
 * this if" lists. The rounds end level, which is the hero's point: the
 * score doesn't decide this one, the way you scale does — so the first
 * button goes to the meter.
 */
import { Link } from "@tanstack/react-router";
import { ArrowDown, Check, ChevronRight, Scale } from "lucide-react";
import { Band, GHOST_BUTTON, LINE, PANEL, Pill } from "@/components/landing/frame";
import { ProductMark } from "@/components/compare/kit";
import { tallyOf } from "@/data/compare/entries";
import { getCategory, matchupTitle, type Matchup } from "@/data/compare/matchups";
import type { Product } from "@/data/compare/products";
import type { MatchupEntry, Round, Side } from "@/data/compare/types";
import { formatDate } from "@/lib/format-date";
import { cn } from "@/lib/utils";
import { KICKER, SIDES, SOLID_BUTTON, plural, rise } from "./tokens";
import { Md } from "./ui";

/** The rounds in order, each as its winner's mark (or an equals sign for a draw). */
function ScoreRow({ rounds, sides }: { rounds: Round[]; sides: Record<Side, Product> }) {
  return (
    <ol className="flex items-center gap-1.5">
      {rounds.map((r, i) => (
        <li key={r.id}>
          <a
            href={`#${r.id}`}
            title={`Round ${i + 1}: ${r.title} — ${r.winner === "draw" ? "draw" : `${sides[r.winner].name} wins`}`}
            className="block rounded-[26%] transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta/40"
          >
            {r.winner === "draw" ? (
              <span className="flex h-7 w-7 items-center justify-center rounded-[26%] border border-dashed border-ink/25 bg-white text-[0.8rem] font-semibold text-muted-foreground">
                =
              </span>
            ) : (
              <ProductMark product={sides[r.winner]} className="h-7 w-7 text-[0.6rem]" />
            )}
            <span className="sr-only">
              Round {i + 1}, {r.title}:{" "}
              {r.winner === "draw" ? "draw" : `${sides[r.winner].name} wins`}
            </span>
          </a>
        </li>
      ))}
    </ol>
  );
}

export function KoalaBywordHero({
  matchup,
  entry,
  sides,
}: {
  matchup: Matchup;
  entry: MatchupEntry;
  sides: Record<Side, Product>;
}) {
  const category = getCategory(matchup.category);
  const tally = tallyOf(entry.rounds);

  return (
    <section id="top" aria-labelledby="vs-title" className="relative bg-white">
      <div className={cn("relative mx-auto max-w-6xl border-x", LINE)}>
        <div className="grid lg:grid-cols-[1.12fr_1fr]">
          {/* Left: the matchup. */}
          <div className="relative px-5 pb-12 pt-7 sm:px-10 sm:pb-14 sm:pt-9 lg:pb-16 lg:pl-14 lg:pr-12">
            <nav aria-label="Breadcrumb" className="motion-safe:animate-hero-rise" style={rise(0)}>
              <ol className="flex flex-wrap items-center gap-1.5 text-[0.78rem] text-muted-foreground">
                <li>
                  <Link to="/" className="py-2 transition-colors hover:text-ink">
                    Home
                  </Link>
                </li>
                <li aria-hidden>
                  <ChevronRight className="h-3 w-3" />
                </li>
                <li>
                  <Link to="/compare" className="py-2 transition-colors hover:text-ink">
                    Compare
                  </Link>
                </li>
                <li aria-hidden>
                  <ChevronRight className="h-3 w-3" />
                </li>
                <li aria-current="page" className="font-medium text-ink">
                  {matchupTitle(matchup)}
                </li>
              </ol>
            </nav>

            <div className="mt-9 motion-safe:animate-hero-rise sm:mt-12" style={rise(0.05)}>
              <Pill icon={Scale}>{category.name} · 2026 head-to-head</Pill>
            </div>

            <h1
              id="vs-title"
              className="mt-6 font-display text-[2.45rem] font-medium leading-[1.06] tracking-[-0.035em] text-ink motion-safe:animate-hero-rise min-[400px]:text-[2.7rem] sm:text-[3.5rem] xl:text-[3.85rem]"
              style={rise(0.12)}
            >
              <span className="flex flex-wrap items-center gap-x-[0.24em] gap-y-1">
                <span className="inline-flex items-center gap-[0.22em]">
                  <ProductMark
                    product={sides.a}
                    className="h-[0.86em] w-[0.86em] text-[0.4em] shadow-[0_1px_2px_rgba(16,24,40,0.08)]"
                  />
                  {sides.a.name}
                </span>
                <span className="font-normal text-ink/35">vs</span>
                <span className="inline-flex items-center gap-[0.22em]">
                  <ProductMark
                    product={sides.b}
                    className="h-[0.86em] w-[0.86em] text-[0.4em] shadow-[0_1px_2px_rgba(16,24,40,0.08)]"
                  />
                  {sides.b.name}
                </span>
              </span>
            </h1>

            <p
              className="mt-6 max-w-[34rem] text-[1.05rem] leading-relaxed text-muted-foreground motion-safe:animate-hero-rise sm:text-[1.12rem]"
              style={rise(0.2)}
            >
              {entry.subhead}
            </p>

            <p
              className="mt-6 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[0.8rem] text-muted-foreground motion-safe:animate-hero-rise"
              style={rise(0.26)}
            >
              <span>
                Updated{" "}
                <time dateTime={matchup.updated} className="font-medium text-ink">
                  {formatDate(matchup.updated)}
                </time>
              </span>
              <span aria-hidden>·</span>
              <span>{plural(entry.rounds.length, "round")}</span>
              <span aria-hidden>·</span>
              <a
                href="#sources"
                className="underline decoration-ink/20 underline-offset-4 transition-colors hover:text-ink"
              >
                {plural(entry.sources.length, "cited source")}
              </a>
            </p>

            <div
              className="mt-8 flex flex-col gap-2.5 motion-safe:animate-hero-rise sm:flex-row sm:items-center"
              style={rise(0.32)}
            >
              <a href="#pricing" className={SOLID_BUTTON}>
                Price your month on both
                <ArrowDown className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
              </a>
              <a
                href="#rounds"
                className={cn(GHOST_BUTTON, "h-11 justify-center px-4 text-[0.9rem]")}
              >
                Read the {plural(entry.rounds.length, "round")}
              </a>
            </div>
          </div>

          {/* Right: the short answer, on the grey panel, with the score. */}
          <div
            className={cn(
              "flex items-center border-t px-5 py-10 sm:px-10 lg:border-l lg:border-t-0 lg:px-10 lg:py-12",
              LINE,
              PANEL,
            )}
          >
            <article
              aria-labelledby="short-answer-title"
              className="w-full overflow-hidden rounded-xl border border-ink/[0.07] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.04),0_18px_44px_-22px_rgba(16,24,40,0.28)] motion-safe:animate-hero-rise"
              style={rise(0.24)}
            >
              <div className="px-6 pb-6 pt-5 sm:px-7">
                <h2
                  id="short-answer-title"
                  className={cn(KICKER, "flex items-center gap-2 text-cta")}
                >
                  <Scale className="h-3.5 w-3.5" aria-hidden />
                  The short answer
                </h2>
                <p className="mt-3.5 text-[0.98rem] leading-[1.7] text-ink/85">
                  <Md text={entry.shortAnswer} />
                </p>
              </div>
              <div
                className={cn(
                  "flex flex-wrap items-center justify-between gap-x-4 gap-y-3 border-t px-6 py-4 sm:px-7",
                  LINE,
                  "bg-[color-mix(in_oklab,var(--surface)_55%,white)]",
                )}
              >
                <div>
                  <p className={KICKER}>Rounds won</p>
                  <p className="mt-1 text-[0.9rem] font-semibold tabular-nums text-ink">
                    {sides.a.name} {tally.a}
                    <span className="mx-1.5 font-normal text-muted-foreground">·</span>
                    {sides.b.name} {tally.b}
                    {tally.draw > 0 && (
                      <>
                        <span className="mx-1.5 font-normal text-muted-foreground">·</span>
                        <span className="font-medium text-muted-foreground">
                          {plural(tally.draw, "draw")}
                        </span>
                      </>
                    )}
                  </p>
                </div>
                <ScoreRow rounds={entry.rounds} sides={sides} />
              </div>
            </article>
          </div>
        </div>
      </div>

      {/* The two "choose this if" lists, closing the hero's frame. */}
      <Band>
        <div className="grid md:grid-cols-2">
          {SIDES.map((side) => (
            <div
              key={side}
              className={cn(
                "px-5 py-8 sm:px-10 sm:py-9 lg:px-14",
                side === "a" && cn("border-b md:border-b-0 md:border-r", LINE),
              )}
            >
              <h2 className="flex items-center gap-3 text-[1.05rem] font-semibold tracking-tight text-ink">
                <ProductMark product={sides[side]} className="h-8 w-8 text-xs" />
                Choose {sides[side].name} if&hellip;
              </h2>
              <ul className="mt-5 space-y-3">
                {entry.picks[side].map((p) => (
                  <li key={p} className="flex gap-3 text-[0.94rem] leading-snug text-ink/85">
                    <span className="mt-0.5 flex h-[1.15rem] w-[1.15rem] shrink-0 items-center justify-center rounded-full bg-cta-soft text-cta">
                      <Check className="h-3 w-3" strokeWidth={3} aria-hidden />
                    </span>
                    {p}
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-[0.8rem] text-muted-foreground">
                <span className="font-medium text-ink">Best for</span>
                <span aria-hidden> · </span>
                {matchup.bestFor[side]}
              </p>
            </div>
          ))}
        </div>
      </Band>
    </section>
  );
}
