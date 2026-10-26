/**
 * The opening: the two names squared up in the H1, the subhead, and the
 * page's answer on a white card beside them, with the round-by-round score
 * under it. The band that closes the hero holds the two "choose it if" lists,
 * so the whole call is above the fold before any detail.
 */
import type { CSSProperties } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowDown, ArrowRight, Check, ChevronRight, Equal, Scale, Swords } from "lucide-react";
import { CELL, CellGrid, GHOST_BUTTON, LINE, PANEL, Pill } from "@/components/landing/frame";
import { ProductMark } from "@/components/compare/kit";
import { tallyOf } from "@/data/compare/entries";
import { getCategory, matchupTitle, sidesOf, type Matchup } from "@/data/compare/matchups";
import type { MatchupEntry } from "@/data/compare/types";
import { formatDate } from "@/lib/format-date";
import { cn } from "@/lib/utils";
import { Rich } from "./parts";
import { SIDES, jump, plural } from "./util";

/* The product tiles set into the H1, sized by the wrapper's em. */
const H1_MARK =
  "h-full w-full text-[0.35em] shadow-[0_1px_2px_rgba(16,24,40,0.06),0_10px_24px_-12px_rgba(16,24,40,0.3)]";

/* Staggers the CSS entrance (see animate-hero-rise in styles.css). */
const rise = (delay: number) => ({ "--rise-delay": `${delay}s` }) as CSSProperties;

export function Hero({ matchup, entry }: { matchup: Matchup; entry: MatchupEntry }) {
  const sides = sidesOf(matchup);
  const category = getCategory(matchup.category);
  const tally = tallyOf(entry.rounds);
  const score = `${sides.a.name} ${tally.a}, ${sides.b.name} ${tally.b}, ${plural(tally.draw, "draw")}`;

  return (
    <section id="top" aria-labelledby="sf-title" className="relative scroll-mt-16 bg-white">
      <div className={cn("relative mx-auto max-w-6xl overflow-hidden border-x", LINE)}>
        <div className="grid lg:grid-cols-[1.12fr_0.88fr]">
          <div className="relative px-5 pb-12 pt-8 sm:px-10 sm:pb-14 lg:px-14 lg:pb-16 lg:pt-10">
            {/* A faint dot field behind the title, faded toward the edges. */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 [background-image:radial-gradient(rgba(16,24,40,0.1)_1px,transparent_1.3px)] [background-size:18px_18px] [mask-image:radial-gradient(ellipse_60%_55%_at_30%_45%,#000_20%,transparent_100%)]"
            />
            <div className="relative">
              <nav
                aria-label="Breadcrumb"
                className="motion-safe:animate-hero-rise"
                style={rise(0)}
              >
                <ol className="flex flex-wrap items-center gap-1.5 text-[0.82rem] text-muted-foreground">
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

              <div className="mt-9 motion-safe:animate-hero-rise sm:mt-11" style={rise(0.06)}>
                <Pill icon={Swords}>{category.name} · 2026 head-to-head</Pill>
              </div>

              <h1
                id="sf-title"
                className="mt-6 font-display text-[2.6rem] font-medium leading-[1.06] tracking-[-0.035em] text-ink sm:text-[3.5rem] lg:text-[3.9rem]"
              >
                <span
                  className="flex items-center gap-[0.28em] motion-safe:animate-hero-rise"
                  style={rise(0.12)}
                >
                  <span className="inline-flex h-[0.82em] w-[0.82em] shrink-0">
                    <ProductMark product={sides.a} className={H1_MARK} />
                  </span>
                  {sides.a.name}
                </span>{" "}
                <span
                  className="mt-[0.06em] flex items-center gap-[0.28em] motion-safe:animate-hero-rise"
                  style={rise(0.2)}
                >
                  <span className="font-bold text-brand-blue">vs</span>{" "}
                  <span className="inline-flex h-[0.82em] w-[0.82em] shrink-0">
                    <ProductMark product={sides.b} className={H1_MARK} />
                  </span>
                  {sides.b.name}
                </span>
              </h1>

              <p
                className="mt-6 max-w-[36rem] text-pretty text-[1.04rem] leading-relaxed text-muted-foreground motion-safe:animate-hero-rise sm:text-[1.1rem]"
                style={rise(0.28)}
              >
                {entry.subhead}
              </p>

              <div
                className="mt-8 flex flex-wrap items-center gap-3 motion-safe:animate-hero-rise"
                style={rise(0.36)}
              >
                <a
                  href="#fit"
                  onClick={(e) => jump(e, "fit")}
                  className="group inline-flex h-11 items-center gap-2 rounded-lg bg-cta px-5 text-[0.92rem] font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.16),0_1px_2px_rgba(16,24,40,0.14)] transition-colors hover:bg-cta-hover focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cta/25"
                >
                  Which one fits you?
                  <ArrowDown className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
                </a>
                <a
                  href="#rounds"
                  onClick={(e) => jump(e, "rounds")}
                  className={cn(GHOST_BUTTON, "h-11 px-4 text-[0.88rem]")}
                >
                  All {entry.rounds.length} rounds
                  <ArrowRight className="h-3.5 w-3.5" />
                </a>
              </div>

              <p
                className="mt-7 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[0.8rem] text-muted-foreground motion-safe:animate-hero-rise"
                style={rise(0.42)}
              >
                <span>
                  Updated{" "}
                  <time dateTime={matchup.updated} className="text-ink">
                    {formatDate(matchup.updated)}
                  </time>
                </span>
                <span aria-hidden>·</span>
                <span>
                  Prices checked{" "}
                  <time dateTime={entry.pricing.checkedOn} className="text-ink">
                    {formatDate(entry.pricing.checkedOn)}
                  </time>
                </span>
                <span aria-hidden>·</span>
                <a
                  href="#sources"
                  onClick={(e) => jump(e, "sources")}
                  className="underline decoration-ink/20 underline-offset-4 transition-colors hover:text-ink hover:decoration-ink/50"
                >
                  {plural(entry.sources.length, "cited source")}
                </a>
              </p>
            </div>
          </div>

          {/* The answer, on a card on the grey panel. */}
          <div
            className={cn(
              "flex items-center border-t px-4 py-8 sm:px-10 sm:py-12 lg:border-l lg:border-t-0 lg:px-9",
              LINE,
              PANEL,
            )}
          >
            <div
              className="w-full overflow-hidden rounded-xl border border-ink/[0.07] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.04),0_18px_44px_-22px_rgba(16,24,40,0.28)] motion-safe:animate-hero-rise"
              style={rise(0.3)}
            >
              <div className="p-5 sm:p-6">
                <h2 className="flex items-center gap-2 text-[0.8rem] font-medium text-ink">
                  <span className="flex h-6 w-6 items-center justify-center rounded-md bg-cta-soft text-cta">
                    <Scale className="h-3.5 w-3.5" aria-hidden />
                  </span>
                  The short answer
                </h2>
                <p className="mt-4 text-[0.95rem] leading-[1.7] text-ink/85">
                  <Rich text={entry.shortAnswer} />
                </p>
              </div>

              <div className={cn("border-t bg-ink/[0.015] px-5 py-4 sm:px-6", LINE)}>
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[0.72rem] font-medium uppercase tracking-[0.12em] text-muted-foreground">
                    Rounds won
                  </p>
                  <p className="sr-only">{score}</p>
                  <p aria-hidden className="flex items-center gap-3 text-[0.82rem] text-ink">
                    {SIDES.map((side) => (
                      <span key={side} className="flex items-center gap-1.5">
                        <ProductMark product={sides[side]} className="h-4 w-4 text-[0.45rem]" />
                        <span className="font-semibold tabular-nums">{tally[side]}</span>
                      </span>
                    ))}
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Equal className="h-3.5 w-3.5" />
                      <span className="font-semibold tabular-nums">{tally.draw}</span>
                    </span>
                  </p>
                </div>
                {/* One square per round, in the order they're fought. */}
                <ol aria-label="Each round's call" className="mt-3 grid grid-cols-7 gap-1">
                  {entry.rounds.map((r, i) => (
                    <li key={r.id}>
                      <a
                        href={`#${r.id}`}
                        onClick={(e) => jump(e, r.id)}
                        title={`Round ${i + 1}: ${r.title}`}
                        className={cn(
                          "flex h-8 items-center justify-center rounded-md border transition-colors",
                          r.winner === "draw"
                            ? "border-ink/[0.08] bg-white text-muted-foreground hover:border-ink/20"
                            : "border-cta/25 bg-cta-soft hover:border-cta/50",
                        )}
                      >
                        <span className="sr-only">
                          Round {i + 1}, {r.title}:{" "}
                          {r.winner === "draw" ? "draw" : `${sides[r.winner].name} wins`}
                        </span>
                        {r.winner === "draw" ? (
                          <Equal className="h-3.5 w-3.5" aria-hidden />
                        ) : (
                          <ProductMark
                            product={sides[r.winner]}
                            className="h-4 w-4 text-[0.45rem]"
                          />
                        )}
                      </a>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Closing the hero: who each one is for, in the reader's words. */}
      <div className={cn("border-t motion-safe:animate-hero-rise", LINE)} style={rise(0.48)}>
        <div className={cn("mx-auto max-w-6xl border-x", LINE)}>
          <CellGrid className="md:grid-cols-2">
            {SIDES.map((side) => (
              <li key={side} className={cn(CELL, "px-5 py-7 sm:px-10 sm:py-8 lg:px-14")}>
                <h2 className="flex items-center gap-2.5 text-[0.98rem] font-medium text-ink">
                  <ProductMark product={sides[side]} className="h-7 w-7 text-[0.7rem]" />
                  Choose {sides[side].name} if&hellip;
                </h2>
                <ul className="mt-4 space-y-2.5">
                  {entry.picks[side].map((p) => (
                    <li key={p} className="flex gap-2.5 text-[0.9rem] leading-snug text-ink/80">
                      <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-cta-soft text-cta">
                        <Check className="h-2.5 w-2.5" strokeWidth={3.5} aria-hidden />
                      </span>
                      {p}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </CellGrid>
        </div>
      </div>
    </section>
  );
}
