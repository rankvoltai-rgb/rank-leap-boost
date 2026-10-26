/**
 * The hero, split: the matchup and its framing on the left, and on the right
 * the whole result as a ledger — which rounds each tracker took. Here the
 * score is level, so the ledger is the argument: Profound takes the depth
 * rounds, Peec AI the access rounds, and the reader picks by situation.
 */
import { Link } from "@tanstack/react-router";
import { ArrowDown, ChevronRight, Equal, Radar } from "lucide-react";
import { ProductMark } from "@/components/compare/kit";
import { LINE, LINE_FILL, Pill } from "@/components/landing/frame";
import { tallyOf } from "@/data/compare/entries";
import { getCategory, matchupTitle, sidesOf, type Matchup } from "@/data/compare/matchups";
import type { MatchupEntry, Round, Winner } from "@/data/compare/types";
import { formatDate } from "@/lib/format-date";
import { cn } from "@/lib/utils";
import { jump, plural, rise } from "./util";

const GHOST =
  "group inline-flex h-10 items-center gap-1.5 rounded-lg border border-ink/[0.1] bg-white px-3.5 text-[0.85rem] font-medium text-ink shadow-[0_1px_2px_rgba(16,24,40,0.04)] transition-[border-color,background-color] hover:border-ink/[0.18] hover:bg-ink/[0.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta/40";

export function Hero({ matchup, entry }: { matchup: Matchup; entry: MatchupEntry }) {
  const sides = sidesOf(matchup);
  const category = getCategory(matchup.category);

  return (
    <section id="top" aria-labelledby="vs-title" className="relative scroll-mt-20 bg-white">
      <div className={cn("relative mx-auto max-w-6xl border-x", LINE)}>
        <div className="grid lg:grid-cols-[1.32fr_1fr]">
          <div className="relative overflow-hidden px-5 pb-14 pt-7 sm:px-10 sm:pb-16 sm:pt-9 lg:pb-20 lg:pl-14 lg:pr-12">
            {/* A faint hairline grid behind the copy, fading out to the right. */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(16,24,40,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(16,24,40,0.05)_1px,transparent_1px)] bg-[size:28px_28px] [mask-image:radial-gradient(ellipse_70%_65%_at_15%_60%,#000_10%,transparent_75%)]"
            />

            <div className="relative">
              <nav
                aria-label="Breadcrumb"
                className="motion-safe:animate-hero-rise"
                style={rise(0)}
              >
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

              <div className="mt-10 motion-safe:animate-hero-rise sm:mt-14" style={rise(0.05)}>
                <Pill icon={Radar}>{category.name} · 2026 head-to-head</Pill>
              </div>

              <h1
                id="vs-title"
                className="mt-6 font-display text-[2.4rem] font-medium leading-[1.06] tracking-[-0.035em] text-ink motion-safe:animate-hero-rise min-[400px]:text-[2.7rem] sm:text-[3.4rem] xl:text-[3.75rem]"
                style={rise(0.12)}
              >
                <span className="flex items-center gap-x-[0.24em]">
                  <InlineMark product={sides.a} />
                  <span>{sides.a.name}</span>
                </span>{" "}
                <span className="mt-[0.08em] flex flex-wrap items-center gap-x-[0.24em]">
                  <span className="font-bold text-brand-blue">vs</span>{" "}
                  <InlineMark product={sides.b} />
                  <span>{sides.b.name}</span>
                </span>
              </h1>

              <p
                className="mt-6 max-w-[36rem] text-[1.05rem] leading-relaxed text-muted-foreground motion-safe:animate-hero-rise sm:text-[1.12rem]"
                style={rise(0.22)}
              >
                {entry.subhead}
              </p>

              <p
                className="mt-6 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[0.8rem] text-muted-foreground motion-safe:animate-hero-rise"
                style={rise(0.28)}
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
                  onClick={(e) => jump(e, "sources")}
                  className="underline-offset-4 hover:text-ink hover:underline"
                >
                  {plural(entry.sources.length, "cited source")}
                </a>
              </p>

              <div
                className="mt-8 flex flex-wrap gap-2.5 motion-safe:animate-hero-rise"
                style={rise(0.34)}
              >
                <a href="#rounds" onClick={(e) => jump(e, "rounds")} className={GHOST}>
                  See every round
                  <ArrowDown className="h-3.5 w-3.5 transition-transform group-hover:translate-y-0.5" />
                </a>
                <a href="#fit" onClick={(e) => jump(e, "fit")} className={GHOST}>
                  Which one fits you?
                  <ArrowDown className="h-3.5 w-3.5 transition-transform group-hover:translate-y-0.5" />
                </a>
              </div>
            </div>
          </div>

          <div
            className={cn("border-t motion-safe:animate-hero-rise lg:border-l lg:border-t-0", LINE)}
            style={rise(0.42)}
          >
            <RoundLedger matchup={matchup} rounds={entry.rounds} />
          </div>
        </div>
      </div>
    </section>
  );
}

/** A product's mark, sized to the headline's cap height. */
function InlineMark({ product }: { product: Parameters<typeof ProductMark>[0]["product"] }) {
  return (
    <ProductMark
      product={product}
      className="h-[0.86em] w-[0.86em] rounded-[0.22em] text-[0.4em] shadow-[0_1px_2px_rgba(16,24,40,0.08)]"
    />
  );
}

/* Wins for A, then the draws, then wins for B, so the level score reads as
   two equal columns either side of the middle. */
const ORDER: Winner[] = ["a", "draw", "b"];

function RoundLedger({ matchup, rounds }: { matchup: Matchup; rounds: Round[] }) {
  const sides = sidesOf(matchup);
  const tally = tallyOf(rounds);
  const label = `Rounds won: ${sides.a.name} ${tally.a}, ${sides.b.name} ${tally.b}${
    tally.draw ? `, ${plural(tally.draw, "draw")}` : ""
  }`;

  return (
    <div className="flex h-full flex-col">
      {/* The rounds in order, each marked with whoever took it. */}
      <div className="px-5 pb-5 pt-7 sm:px-8 lg:px-9 lg:pt-9">
        <p className="text-[0.8rem] font-medium text-ink">Round by round</p>
        <ol aria-label={label} className="mt-3.5 grid grid-cols-7 gap-1.5">
          {rounds.map((r, i) => (
            <li key={r.id}>
              <a
                href={`#${r.id}`}
                onClick={(e) => jump(e, r.id)}
                title={`Round ${i + 1}: ${r.title} — ${
                  r.winner === "draw" ? "draw" : `${sides[r.winner].name} wins`
                }`}
                className="group flex flex-col items-center gap-1.5 rounded-lg border border-ink/[0.07] bg-white py-2 transition-colors hover:border-cta/30 hover:bg-cta-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta/40"
              >
                <span className="text-[0.66rem] tabular-nums text-muted-foreground">{i + 1}</span>
                {r.winner === "draw" ? (
                  <span className="flex h-5 w-5 items-center justify-center rounded-[26%] border border-ink/[0.1] bg-white text-muted-foreground">
                    <Equal className="h-3 w-3" aria-hidden />
                  </span>
                ) : (
                  <ProductMark product={sides[r.winner]} className="h-5 w-5 text-[0.5rem]" />
                )}
                <span className="sr-only">
                  {r.title}: {r.winner === "draw" ? "draw" : `${sides[r.winner].name} wins`}
                </span>
              </a>
            </li>
          ))}
        </ol>
      </div>

      <div className={cn("grid flex-1 gap-px border-t", LINE, LINE_FILL)}>
        {ORDER.map((w) => {
          const won = rounds.filter((r) => r.winner === w);
          if (won.length === 0) return null;
          const name = w === "draw" ? "Draw" : sides[w].name;
          return (
            <div key={w} className="flex gap-5 bg-white px-5 py-5 sm:px-8 lg:px-9">
              <div className="w-[4.5rem] shrink-0">
                <p className="font-display text-[2.4rem] font-medium leading-none tracking-[-0.03em] text-ink tabular-nums">
                  {tally[w]}
                </p>
                <p className="mt-1.5 flex items-center gap-1.5 text-[0.78rem] text-muted-foreground">
                  {w === "draw" ? (
                    <Equal className="h-3.5 w-3.5" aria-hidden />
                  ) : (
                    <ProductMark product={sides[w]} className="h-4 w-4 text-[0.45rem]" />
                  )}
                  <span className="truncate">{name}</span>
                </p>
              </div>
              <div className="min-w-0 flex-1">
                <ul
                  aria-label={w === "draw" ? "Drawn rounds" : `Rounds ${name} won`}
                  className="space-y-1"
                >
                  {won.map((r) => (
                    <li key={r.id}>
                      <a
                        href={`#${r.id}`}
                        onClick={(e) => jump(e, r.id)}
                        className="group flex items-baseline gap-2 rounded text-[0.88rem] leading-snug text-ink transition-colors hover:text-cta"
                      >
                        <span className="w-4 shrink-0 text-[0.7rem] tabular-nums text-muted-foreground">
                          {rounds.indexOf(r) + 1}
                        </span>
                        <span className="underline-offset-4 group-hover:underline">{r.title}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
