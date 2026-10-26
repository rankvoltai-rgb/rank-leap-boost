/**
 * The opening: the question on the left, the answer on the right.
 *
 * The headline and the facts about the page sit in the left column; the
 * short answer — the paragraph answer engines lift — sits beside it on a
 * card, with the round score under it, so the page's verdict is above the
 * fold at every width. The "choose X if…" picks close the hero in a ruled
 * strip of their own, mirrored, so neither product leads.
 */
import { Link } from "@tanstack/react-router";
import { ArrowDown, Check, ChevronRight, Equal, Scale } from "lucide-react";
import { MarkDither } from "@/components/landing/hero-dither";
import { Accent, GHOST_BUTTON, LINE, LINE_FILL, PANEL, Pill } from "@/components/landing/frame";
import { ProductMark, jumpTo } from "@/components/compare/kit";
import { tallyOf } from "@/data/compare/entries";
import { getCategory, matchupTitle, sidesOf, type Matchup } from "@/data/compare/matchups";
import type { Product } from "@/data/compare/products";
import type { MatchupEntry, Round, Side, Winner } from "@/data/compare/types";
import { formatDate } from "@/lib/format-date";
import { cn } from "@/lib/utils";
import { Md, PairMarks } from "./parts";
import { SIDES, plural, rise } from "./util";

/** Wins for one side, then draws, then wins for the other: the score as marks. */
function ScoreMarks({ rounds, sides }: { rounds: Round[]; sides: Record<Side, Product> }) {
  const order: Winner[] = ["a", "draw", "b"];
  const sorted = [...rounds].sort((x, y) => order.indexOf(x.winner) - order.indexOf(y.winner));
  return (
    <span aria-hidden className="flex items-center gap-1">
      {sorted.map((r) =>
        r.winner === "draw" ? (
          <span
            key={r.id}
            className="flex h-5 w-5 items-center justify-center rounded-[26%] border border-ink/[0.1] bg-white text-muted-foreground"
          >
            <Equal className="h-3 w-3" />
          </span>
        ) : (
          <ProductMark key={r.id} product={sides[r.winner]} className="h-5 w-5 text-[0.5rem]" />
        ),
      )}
    </span>
  );
}

export function Hero({ matchup, entry }: { matchup: Matchup; entry: MatchupEntry }) {
  const sides = sidesOf(matchup);
  const category = getCategory(matchup.category);
  const tally = tallyOf(entry.rounds);
  const score = `${sides.a.name} ${tally.a}, ${sides.b.name} ${tally.b}${
    tally.draw ? `, ${plural(tally.draw, "draw")}` : ""
  }`;

  return (
    <section id="top" aria-labelledby="vs-title" className="relative bg-white">
      <div className={cn("relative mx-auto max-w-6xl border-x", LINE)}>
        <div className="grid lg:grid-cols-[minmax(0,1.06fr)_minmax(0,0.94fr)]">
          {/* The question. */}
          <div className="flex flex-col justify-center px-5 pb-12 pt-9 sm:px-10 sm:pb-14 sm:pt-12 lg:px-12 lg:pb-16 lg:pt-14">
            <nav aria-label="Breadcrumb" className="motion-safe:animate-hero-rise" style={rise(0)}>
              <ol className="flex flex-wrap items-center gap-1.5 text-[0.78rem] text-muted-foreground">
                <li>
                  <Link to="/" className="transition-colors hover:text-ink">
                    Home
                  </Link>
                </li>
                <li aria-hidden>
                  <ChevronRight className="h-3 w-3" />
                </li>
                <li>
                  <Link to="/compare" className="transition-colors hover:text-ink">
                    Compare
                  </Link>
                </li>
                <li aria-hidden>
                  <ChevronRight className="h-3 w-3" />
                </li>
                <li aria-current="page" className="text-ink">
                  {matchupTitle(matchup)}
                </li>
              </ol>
            </nav>

            <div className="mt-7 motion-safe:animate-hero-rise" style={rise(0.06)}>
              <Pill icon={Scale}>
                {category.name} · {matchup.updated.slice(0, 4)} head-to-head
              </Pill>
            </div>

            <h1
              id="vs-title"
              className="mt-5 text-balance font-display text-[2.45rem] font-medium leading-[1.04] tracking-[-0.035em] text-ink motion-safe:animate-hero-rise min-[400px]:text-[2.75rem] sm:text-[3.4rem] lg:text-[3.75rem]"
              style={rise(0.12)}
            >
              {sides.a.name} <Accent>vs</Accent> {sides.b.name}
            </h1>

            <p
              className="mt-5 max-w-[34rem] text-[1.02rem] leading-relaxed text-muted-foreground motion-safe:animate-hero-rise sm:text-[1.08rem]"
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
                onClick={(e) => jumpTo(e, "sources")}
                className="underline-offset-4 hover:text-ink hover:underline"
              >
                {plural(entry.sources.length, "cited source")}
              </a>
            </p>

            <div
              className="mt-8 flex flex-wrap items-center gap-3 motion-safe:animate-hero-rise"
              style={rise(0.32)}
            >
              <a
                href="#cost"
                onClick={(e) => jumpTo(e, "cost")}
                className="group inline-flex h-11 items-center gap-2 rounded-lg bg-cta px-5 text-[0.92rem] font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.16),0_1px_2px_rgba(16,24,40,0.14)] transition-colors hover:bg-cta-hover focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cta/25"
              >
                Cost by team size
                <ArrowDown className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
              </a>
              <a
                href="#fit"
                onClick={(e) => jumpTo(e, "fit")}
                className={cn(GHOST_BUTTON, "h-11 px-4 text-[0.9rem]")}
              >
                Which one fits you?
              </a>
            </div>
          </div>

          {/* The answer. */}
          <div
            className={cn(
              "relative overflow-hidden border-t px-4 py-10 sm:px-10 sm:py-12 lg:border-l lg:border-t-0 lg:px-10 lg:py-14",
              LINE,
              PANEL,
            )}
          >
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-[0.3] [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,#000_35%,transparent_100%)]"
            >
              <MarkDither />
            </div>
            <div
              className="relative flex h-full items-center motion-safe:animate-hero-rise"
              style={rise(0.3)}
            >
              <article
                aria-labelledby="short-answer-title"
                className="w-full overflow-hidden rounded-2xl border border-ink/[0.08] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.04),0_24px_48px_-28px_rgba(16,24,40,0.3)]"
              >
                <header
                  className={cn("flex items-center justify-between gap-3 border-b px-5 py-3", LINE)}
                >
                  <h2
                    id="short-answer-title"
                    className="flex items-center gap-2 text-[0.8rem] font-medium text-ink"
                  >
                    <span className="flex h-5 w-5 items-center justify-center rounded-md bg-cta-soft text-cta">
                      <Scale className="h-3 w-3" aria-hidden />
                    </span>
                    The short answer
                  </h2>
                  <PairMarks sides={sides} className="h-6 w-6 text-[0.6rem]" />
                </header>
                <p className="px-5 py-5 text-[0.95rem] leading-[1.72] text-ink/85 sm:px-6 sm:text-[1rem]">
                  <Md text={entry.shortAnswer} />
                </p>
                <footer
                  className={cn(
                    "flex flex-wrap items-center justify-between gap-3 border-t px-5 py-3.5 sm:px-6",
                    LINE,
                    PANEL,
                  )}
                >
                  <p className="flex flex-wrap items-center gap-x-3 gap-y-2">
                    <span className="text-[0.72rem] font-medium text-muted-foreground">
                      Rounds won
                    </span>
                    <span className="sr-only">{score}</span>
                    <span
                      aria-hidden
                      className="flex items-center gap-2 text-sm font-semibold tabular-nums text-ink"
                    >
                      {tally.a}
                      <ScoreMarks rounds={entry.rounds} sides={sides} />
                      {tally.b}
                    </span>
                  </p>
                  <a
                    href="#rounds"
                    onClick={(e) => jumpTo(e, "rounds")}
                    className="group inline-flex items-center gap-1 text-[0.82rem] font-medium text-ink transition-colors hover:text-cta"
                  >
                    Every round
                    <ArrowDown className="h-3.5 w-3.5 transition-transform group-hover:translate-y-0.5" />
                  </a>
                </footer>
              </article>
            </div>
          </div>
        </div>
      </div>

      {/* Who each one is for, mirrored. */}
      <div className={cn("border-t", LINE)}>
        <div
          className={cn("mx-auto grid max-w-6xl gap-px border-x md:grid-cols-2", LINE, LINE_FILL)}
        >
          {SIDES.map((side) => (
            <div key={side} className="bg-white px-5 py-7 sm:px-10 sm:py-8 lg:px-12">
              <h2 className="flex items-center gap-2.5 text-[0.95rem] font-semibold text-ink">
                <ProductMark product={sides[side]} className="h-7 w-7 text-xs" />
                Choose {sides[side].name} if&hellip;
              </h2>
              <ul className="mt-4 space-y-2.5">
                {entry.picks[side].map((p) => (
                  <li key={p} className="flex gap-2.5 text-[0.9rem] leading-snug text-ink/80">
                    <span className="mt-px flex h-[1.1rem] w-[1.1rem] shrink-0 items-center justify-center rounded-full bg-cta-soft text-cta">
                      <Check className="h-3 w-3" strokeWidth={3} aria-hidden />
                    </span>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
