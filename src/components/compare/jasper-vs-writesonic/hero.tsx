/**
 * The opening of /compare/jasper-vs-writesonic: the matchup and its subhead on
 * the left, the fork (the page's focal picture) on a dotted panel to the
 * right, then the short answer and "choose X if…" ruled off underneath as the
 * hero's second band.
 */
import { Link } from "@tanstack/react-router";
import { ArrowDown, ArrowRight, Check, ChevronRight, Scale, Swords } from "lucide-react";
import { Accent, Band, LINE, PANEL, Pill } from "@/components/landing/frame";
import { ProductMark, jumpTo } from "@/components/compare/kit";
import { getCategory, matchupTitle, sidesOf, type Matchup } from "@/data/compare/matchups";
import type { Product } from "@/data/compare/products";
import type { MatchupEntry } from "@/data/compare/types";
import { formatDate } from "@/lib/format-date";
import { cn } from "@/lib/utils";
import { Md } from "./atoms";
import { DOTS, SIDES, SOLID_BUTTON, plural, rise } from "./lib";
import { ForkCard } from "./fork";

const OUTLINE_BUTTON =
  "group inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-ink/[0.1] bg-white px-5 text-[0.95rem] font-medium text-ink shadow-[0_1px_2px_rgba(16,24,40,0.04)] transition-[border-color,background-color] hover:border-ink/[0.18] hover:bg-ink/[0.02] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cta/20";

/* A product's mark set into the headline, sized to the type. */
function InlineMark({ product }: { product: Product }) {
  return (
    <span
      aria-hidden
      className="inline-flex h-[0.8em] w-[0.8em] shrink-0 -translate-y-[0.04em] items-center justify-center"
    >
      <ProductMark product={product} className="h-full w-full text-[0.4em] shadow-sm" />
    </span>
  );
}

export function Hero({ matchup, entry }: { matchup: Matchup; entry: MatchupEntry }) {
  const sides = sidesOf(matchup);
  const category = getCategory(matchup.category);
  const year = matchup.updated.slice(0, 4);

  return (
    <section id="top" aria-labelledby="vs-title" className="relative bg-white">
      <div className={cn("relative mx-auto max-w-6xl border-x", LINE)}>
        <div className="grid lg:grid-cols-[1.06fr_1fr]">
          <div className="flex flex-col px-5 pb-12 pt-7 sm:px-10 sm:pb-16 sm:pt-9 lg:pb-16 lg:pl-14 lg:pr-12">
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

            <div className="mt-10 motion-safe:animate-hero-rise sm:mt-14" style={rise(0.05)}>
              <Pill icon={Swords}>
                {category.name} · {year} head-to-head
              </Pill>
            </div>

            <h1
              id="vs-title"
              className="mt-6 font-display text-[2.7rem] font-medium leading-[1.04] tracking-[-0.04em] text-ink motion-safe:animate-hero-rise min-[400px]:text-[3rem] sm:text-[3.7rem] lg:text-[4.1rem]"
              style={rise(0.12)}
            >
              <span className="flex items-center gap-[0.22em]">
                <InlineMark product={sides.a} />
                {sides.a.name}
              </span>{" "}
              <span className="mt-[0.04em] flex flex-wrap items-center gap-x-[0.22em]">
                <Accent>vs</Accent> <InlineMark product={sides.b} />
                {sides.b.name}
              </span>
            </h1>

            <p
              className="mt-6 max-w-[34rem] text-[1.05rem] leading-relaxed text-muted-foreground motion-safe:animate-hero-rise sm:text-[1.12rem]"
              style={rise(0.2)}
            >
              {entry.subhead}
            </p>

            <p
              className="mt-5 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[0.8rem] text-muted-foreground motion-safe:animate-hero-rise"
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
                className="underline-offset-4 transition-colors hover:text-ink hover:underline"
              >
                {plural(entry.sources.length, "cited source")}
              </a>
            </p>

            <div
              className="mt-9 flex flex-col gap-2.5 motion-safe:animate-hero-rise min-[440px]:flex-row"
              style={rise(0.32)}
            >
              <a href="#fit" onClick={(e) => jumpTo(e, "fit")} className={SOLID_BUTTON}>
                Which one fits you?
                <ArrowDown className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
              </a>
              <a href="#rounds" onClick={(e) => jumpTo(e, "rounds")} className={OUTLINE_BUTTON}>
                See every round
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </a>
            </div>
          </div>

          <div
            className={cn(
              "flex items-center border-t px-3 py-10 sm:px-10 lg:border-l lg:border-t-0 lg:px-10 lg:py-12",
              LINE,
              PANEL,
            )}
            style={DOTS}
          >
            <div
              className="mx-auto w-full max-w-[30rem] motion-safe:animate-hero-rise"
              style={rise(0.3)}
            >
              <ForkCard matchup={matchup} entry={entry} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* The quotable verdict, and each side's three "choose it if" lines. */
export function ShortAnswer({ matchup, entry }: { matchup: Matchup; entry: MatchupEntry }) {
  const sides = sidesOf(matchup);
  return (
    <section id="short-answer" aria-labelledby="answer-title" className="scroll-mt-20">
      <Band>
        <div className="grid lg:grid-cols-[1.18fr_1fr]">
          <div
            className={cn(
              "border-b px-6 py-10 sm:px-10 lg:border-b-0 lg:border-r lg:px-12 lg:py-14",
              LINE,
            )}
          >
            <Pill icon={Scale}>The short answer</Pill>
            <h2 id="answer-title" className="sr-only">
              The short answer
            </h2>
            <p className="mt-6 text-[1.08rem] leading-[1.7] text-ink/80 sm:text-[1.2rem]">
              <Md text={entry.shortAnswer} />
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-1">
            {SIDES.map((side, i) => (
              <div
                key={side}
                className={cn(
                  "px-6 py-8 sm:px-10 lg:px-10 lg:py-10",
                  i === 0 && "border-b sm:border-b-0 sm:border-r lg:border-b lg:border-r-0",
                  LINE,
                )}
              >
                <div className="flex items-center gap-2.5">
                  <ProductMark product={sides[side]} className="h-8 w-8 text-xs" />
                  <h3 className="text-[1.02rem] font-semibold tracking-tight text-ink">
                    Choose {sides[side].name} if&hellip;
                  </h3>
                </div>
                <ul className="mt-4 space-y-2.5">
                  {entry.picks[side].map((p) => (
                    <li key={p} className="flex gap-2.5 text-[0.92rem] leading-snug text-ink/85">
                      <Check
                        aria-hidden
                        className="mt-0.5 h-4 w-4 shrink-0 text-cta"
                        strokeWidth={2.75}
                      />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </Band>
    </section>
  );
}
