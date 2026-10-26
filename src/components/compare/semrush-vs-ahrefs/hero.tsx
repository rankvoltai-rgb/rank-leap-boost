/**
 * The opening of /compare/semrush-vs-ahrefs: the matchup, the score by
 * winner (each round title a jump link), then the quotable short answer with
 * both "choose it if" lists beside it. Both suites get the same tile, the
 * same cell and the same weight; nothing here leans either way.
 */
import type { CSSProperties } from "react";
import { Link } from "@tanstack/react-router";
import { Check, ChevronRight, Equal, Scale, Swords } from "lucide-react";
import { Band, GHOST_BUTTON, LINE, LINE_FILL, Pill } from "@/components/landing/frame";
import { ProductMark, jumpTo } from "@/components/compare/kit";
import { tallyOf } from "@/data/compare/entries";
import { getCategory, matchupTitle, sidesOf, type Matchup } from "@/data/compare/matchups";
import type { MatchupEntry, Side, Winner } from "@/data/compare/types";
import { formatDate } from "@/lib/format-date";
import { cn } from "@/lib/utils";
import { Md } from "./md";

const SIDES: Side[] = ["a", "b"];

/* Staggers the CSS entrance (animate-hero-rise in styles.css). */
const rise = (delay: number) => ({ "--rise-delay": `${delay}s` }) as CSSProperties;

const plural = (n: number, one: string, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;

/** In-page jumps from the hero, in the order the page runs. */
function jumps(entry: MatchupEntry) {
  return [
    { id: "price-ladder", label: "Price ladder" },
    { id: "rounds", label: plural(entry.rounds.length, "round") },
    { id: "spec-sheet", label: "Spec sheet" },
    { id: "fit", label: "Fit quiz" },
    { id: "faq", label: "FAQ" },
  ];
}

export function Hero({ matchup, entry }: { matchup: Matchup; entry: MatchupEntry }) {
  const sides = sidesOf(matchup);
  const category = getCategory(matchup.category);

  return (
    <section id="top" aria-labelledby="sva-title" className="relative scroll-mt-16 bg-white">
      <div className={cn("relative mx-auto max-w-6xl overflow-hidden border-x", LINE)}>
        {/* Faint rungs, the price ladder's motif, fading out toward the copy. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(16,24,40,0.06)_1px,transparent_1px)] bg-[size:100%_44px] [mask-image:radial-gradient(ellipse_75%_90%_at_50%_55%,transparent_30%,#000_95%)]"
        />

        <div className="relative px-5 pb-14 pt-7 sm:px-8 sm:pb-16 lg:px-12 lg:pt-9">
          <nav aria-label="Breadcrumb" className="motion-safe:animate-hero-rise" style={rise(0)}>
            <ol className="flex flex-wrap items-center gap-1.5 text-[0.8rem] text-muted-foreground">
              <li>
                <Link to="/" className="transition-colors hover:text-ink">
                  Home
                </Link>
              </li>
              <li aria-hidden>
                <ChevronRight className="h-3.5 w-3.5" />
              </li>
              <li>
                <Link to="/compare" className="transition-colors hover:text-ink">
                  Compare
                </Link>
              </li>
              <li aria-hidden>
                <ChevronRight className="h-3.5 w-3.5" />
              </li>
              <li aria-current="page" className="text-ink">
                {matchupTitle(matchup)}
              </li>
            </ol>
          </nav>

          <div className="mt-12 flex flex-col items-center text-center sm:mt-14">
            <div className="motion-safe:animate-hero-rise" style={rise(0.04)}>
              <Pill icon={Swords}>{category.name} · 2026 head-to-head</Pill>
            </div>

            <h1
              id="sva-title"
              className="mt-6 flex flex-wrap items-center justify-center gap-x-[0.28em] font-display text-[2.6rem] font-medium leading-[1.06] tracking-[-0.035em] text-ink motion-safe:animate-hero-rise min-[400px]:text-[2.9rem] sm:text-[4rem] lg:text-[4.5rem]"
              style={rise(0.1)}
            >
              <span className="inline-flex items-center gap-[0.2em]">
                <ProductMark
                  product={sides.a}
                  className="hidden h-12 w-12 text-lg shadow-[0_10px_28px_-14px_rgba(16,24,40,0.45)] sm:flex lg:h-14 lg:w-14"
                />
                {sides.a.name}
              </span>
              <span className="font-bold text-brand-blue">vs</span>
              <span className="inline-flex items-center gap-[0.2em]">
                {sides.b.name}
                <ProductMark
                  product={sides.b}
                  className="hidden h-12 w-12 text-lg shadow-[0_10px_28px_-14px_rgba(16,24,40,0.45)] sm:flex lg:h-14 lg:w-14"
                />
              </span>
            </h1>

            <p
              className="mt-6 max-w-[44rem] text-balance text-[1.02rem] leading-relaxed text-muted-foreground motion-safe:animate-hero-rise sm:text-[1.12rem]"
              style={rise(0.18)}
            >
              {entry.subhead}
            </p>

            <p
              className="mt-6 flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 text-[0.82rem] text-muted-foreground motion-safe:animate-hero-rise"
              style={rise(0.24)}
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

            <nav
              aria-label="On this page"
              className="mt-8 flex flex-wrap justify-center gap-2 motion-safe:animate-hero-rise"
              style={rise(0.3)}
            >
              {jumps(entry).map((j) => (
                <a
                  key={j.id}
                  href={`#${j.id}`}
                  onClick={(e) => jumpTo(e, j.id)}
                  className={GHOST_BUTTON}
                >
                  {j.label}
                </a>
              ))}
            </nav>
          </div>
        </div>
      </div>

      <Scoreboard matchup={matchup} entry={entry} />
      <ShortAnswer matchup={matchup} entry={entry} />
    </section>
  );
}

/* ---------- the score, by winner ---------- */

const ORDER: Winner[] = ["a", "draw", "b"];

function Scoreboard({ matchup, entry }: { matchup: Matchup; entry: MatchupEntry }) {
  const sides = sidesOf(matchup);
  const tally = tallyOf(entry.rounds);
  const numbered = entry.rounds.map((r, i) => ({ ...r, n: i + 1 }));

  return (
    <Band>
      <nav aria-label="Rounds won" className="motion-safe:animate-hero-rise" style={rise(0.36)}>
        <div className={cn("grid gap-px sm:grid-cols-3", LINE_FILL)}>
          {ORDER.map((w) => {
            const won = numbered.filter((r) => r.winner === w);
            const label = w === "draw" ? "Draws" : `${sides[w].name} wins`;
            return (
              <div key={w} className="flex flex-col bg-white px-6 py-6 sm:px-7 lg:px-9 lg:py-7">
                <div className="flex items-center justify-between gap-3">
                  <span className="flex items-center gap-2.5 text-[0.9rem] font-medium text-ink">
                    {w === "draw" ? (
                      <span className="flex h-7 w-7 items-center justify-center rounded-[26%] border border-ink/[0.1] bg-white text-muted-foreground">
                        <Equal className="h-3.5 w-3.5" aria-hidden />
                      </span>
                    ) : (
                      <ProductMark product={sides[w]} className="h-7 w-7 text-xs" />
                    )}
                    {label}
                  </span>
                  <span className="font-display text-[2.4rem] font-medium leading-none tracking-[-0.04em] text-ink tabular-nums">
                    {tally[w]}
                    <span className="sr-only"> {tally[w] === 1 ? "round" : "rounds"}</span>
                  </span>
                </div>
                <ul className={cn("mt-4 space-y-1 border-t pt-3", LINE)}>
                  {won.map((r) => (
                    <li key={r.id}>
                      <a
                        href={`#${r.id}`}
                        onClick={(e) => jumpTo(e, r.id)}
                        className="group flex items-baseline gap-2.5 rounded-md py-1 text-[0.86rem] leading-snug text-muted-foreground transition-colors hover:text-cta"
                      >
                        <span className="w-4 shrink-0 text-[0.72rem] tabular-nums text-ink/35 group-hover:text-cta">
                          {r.n}
                        </span>
                        {r.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </nav>
    </Band>
  );
}

/* ---------- the short answer ---------- */

function ShortAnswer({ matchup, entry }: { matchup: Matchup; entry: MatchupEntry }) {
  const sides = sidesOf(matchup);
  return (
    <Band>
      <div className={cn("grid gap-px lg:grid-cols-[1.3fr_1fr]", LINE_FILL)}>
        <div className="bg-white px-6 py-10 sm:px-10 lg:px-12 lg:py-12">
          <span aria-hidden>
            <Pill icon={Scale}>The short answer</Pill>
          </span>
          <h2 className="sr-only">The short answer</h2>
          <p className="mt-6 text-[1.06rem] leading-[1.75] text-ink/75 sm:text-[1.14rem]">
            <Md text={entry.shortAnswer} />
          </p>
        </div>
        <div className={cn("grid gap-px", LINE_FILL)}>
          {SIDES.map((side) => (
            <div key={side} className="bg-white px-6 py-8 sm:px-10 lg:px-10">
              <h3 className="flex items-center gap-2.5 text-[0.98rem] font-semibold text-ink">
                <ProductMark product={sides[side]} className="h-8 w-8 text-xs" />
                Choose {sides[side].name} if&hellip;
              </h3>
              <ul className="mt-4 space-y-2.5">
                {entry.picks[side].map((p) => (
                  <li key={p} className="flex gap-2.5 text-[0.92rem] leading-snug text-ink/80">
                    <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-cta-soft text-cta">
                      <Check className="h-2.5 w-2.5" strokeWidth={3.5} aria-hidden />
                    </span>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </Band>
  );
}
