/**
 * "Which one fits you?" — the three-question picker, scored by the pure
 * scoreFinder in data/compare/finder.ts.
 *
 * The questions run down the left as hairline blocks; the answer sits in a
 * panel on the right as a small fork of its own — you at the top, a path to
 * each product, and a dashed middle path for "neither" — and the path your
 * answers lead down lights up. A tie lights both.
 */
import { useState, type ReactNode } from "react";
import { motion } from "motion/react";
import { ArrowDown, ArrowUpRight, Check, Compass, RotateCcw } from "lucide-react";
import { Accent, Band, LINE, PANEL, SectionHead, Spacer } from "@/components/landing/frame";
import { ProductMark, RankboxTile, jumpTo } from "@/components/compare/kit";
import { scoreFinder, type Pick } from "@/data/compare/finder";
import { sidesOf, type Matchup } from "@/data/compare/matchups";
import type { Product } from "@/data/compare/products";
import type { MatchupEntry, Side } from "@/data/compare/types";
import { cn } from "@/lib/utils";
import { CARD, DOTS, EASE } from "./lib";

/* The three paths, in the picture's 240 × 96 box: left to the first product,
   right to the second, and the dashed middle one for "neither". */
const PATHS = {
  a: "M120 10 C120 46 34 44 34 80",
  rankbox: "M120 10 L120 80",
  b: "M120 10 C120 46 206 44 206 80",
} as const;

function lights(pick: Pick | null): Record<keyof typeof PATHS, boolean> {
  return {
    a: pick === "a" || pick === "tie",
    b: pick === "b" || pick === "tie",
    rankbox: pick === "rankbox",
  };
}

function PathPicture({ pick, sides }: { pick: Pick | null; sides: Record<Side, Product> }) {
  const on = lights(pick);
  const end = (key: keyof typeof PATHS, children: ReactNode, left: string) => (
    <span
      className={cn(
        "absolute bottom-0 flex -translate-x-1/2 items-center justify-center rounded-[26%] transition-[box-shadow,opacity] duration-500",
        on[key]
          ? "opacity-100 shadow-[0_0_0_4px_color-mix(in_oklab,var(--cta)_16%,transparent)]"
          : pick
            ? "opacity-45"
            : "opacity-100",
      )}
      style={{ left }}
    >
      {children}
    </span>
  );
  return (
    <div aria-hidden className="relative mx-auto h-[7.25rem] w-full max-w-[16rem]">
      <svg viewBox="0 0 240 96" className="absolute inset-x-0 top-0 h-[5.6rem] w-full">
        {(Object.keys(PATHS) as (keyof typeof PATHS)[]).map((key) => (
          <g key={key}>
            <path
              d={PATHS[key]}
              fill="none"
              stroke="color-mix(in oklab, var(--ink) 14%, transparent)"
              strokeWidth={1.25}
              strokeDasharray="3 4"
            />
            <motion.path
              d={PATHS[key]}
              fill="none"
              stroke="var(--cta)"
              strokeWidth={2}
              strokeLinecap="round"
              initial={false}
              animate={{ pathLength: on[key] ? 1 : 0, opacity: on[key] ? 1 : 0 }}
              transition={{ duration: 0.6, ease: EASE }}
            />
          </g>
        ))}
        <circle cx={120} cy={8} r={5} fill="var(--cta)" />
      </svg>
      <span className="absolute left-1/2 top-[-0.2rem] -translate-x-1/2 -translate-y-full text-[0.66rem] font-medium uppercase tracking-[0.12em] text-muted-foreground">
        You
      </span>
      {end("a", <ProductMark product={sides.a} className="h-9 w-9 text-sm" />, "14.2%")}
      {end(
        "rankbox",
        on.rankbox ? (
          <RankboxTile className="h-9 w-9" />
        ) : (
          <span className="flex h-9 w-9 items-center justify-center rounded-[26%] border border-dashed border-ink/20 bg-white text-[0.6rem] font-medium text-muted-foreground">
            ?
          </span>
        ),
        "50%",
      )}
      {end("b", <ProductMark product={sides.b} className="h-9 w-9 text-sm" />, "85.8%")}
    </div>
  );
}

function ResultBody({ pick, sides }: { pick: Pick | null; sides: Record<Side, Product> }) {
  if (pick === null) {
    return (
      <p className="mt-5 text-center text-sm leading-relaxed text-muted-foreground">
        Answer the questions and the better fit for your situation shows up here.
      </p>
    );
  }
  if (pick === "tie") {
    return (
      <div className="mt-5">
        <p className="font-display text-[1.6rem] font-medium tracking-[-0.03em] text-ink">
          Either will do
        </p>
        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
          What you&rsquo;ve told us fits both equally. Start with whichever trial is easier to get,
          and judge it on your own content.
        </p>
      </div>
    );
  }
  if (pick === "rankbox") {
    return (
      <div className="mt-5">
        <p className="font-display text-[1.6rem] font-medium tracking-[-0.03em] text-ink">
          Possibly neither
        </p>
        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
          Both are built around someone doing the work in the tool. If nobody will, a system that
          writes and delivers the articles fits better. We make one, so weigh that.
        </p>
        <a
          href="#third-option"
          onClick={(e) => jumpTo(e, "third-option")}
          className="group mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-cta hover:text-cta-hover"
        >
          See the third option
          <ArrowDown className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
        </a>
      </div>
    );
  }
  const p = sides[pick];
  return (
    <div className="mt-5">
      <p className="font-display text-[1.6rem] font-medium tracking-[-0.03em] text-ink">{p.name}</p>
      <p className="mt-0.5 text-sm text-muted-foreground">{p.kind}</p>
      <a
        href={`https://${p.domain}`}
        target="_blank"
        rel="noopener noreferrer nofollow"
        className="group mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-cta hover:text-cta-hover"
      >
        Visit {p.domain}
        <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </a>
    </div>
  );
}

export function Finder({ matchup, entry }: { matchup: Matchup; entry: MatchupEntry }) {
  const sides = sidesOf(matchup);
  const [answers, setAnswers] = useState<Record<string, number | undefined>>({});
  const result = scoreFinder(entry.finder, answers);
  const complete = result.answered === result.total;
  const pickName =
    result.pick === "tie"
      ? "either one"
      : result.pick === "rankbox"
        ? "possibly neither"
        : result.pick
          ? sides[result.pick].name
          : "";

  return (
    <section id="fit" aria-labelledby="fit-title" className="scroll-mt-20">
      <Spacer />
      <SectionHead
        icon={Compass}
        eyebrow="Your situation"
        title={
          <span id="fit-title">
            Which one <Accent>fits you?</Accent>
          </span>
        }
        subtitle={`${entry.finder.length} questions. The pick updates as you answer, and tells you why.`}
      />
      <Band>
        <div className="grid lg:grid-cols-[minmax(0,1fr)_24rem]">
          <div>
            {entry.finder.map((q, qi) => (
              <fieldset
                key={q.id}
                className={cn("border-b px-6 py-8 sm:px-10 lg:px-12", LINE, "last:border-b-0")}
              >
                <legend className="float-left flex w-full items-baseline gap-3 text-[1.08rem] font-medium tracking-tight text-ink">
                  <span className="font-display text-[0.95rem] font-medium tabular-nums text-cta">
                    {String(qi + 1).padStart(2, "0")}
                  </span>
                  {q.question}
                </legend>
                <div
                  className={cn(
                    "clear-both grid gap-2.5 pt-4",
                    q.options.length === 2 ? "sm:grid-cols-2" : "sm:grid-cols-3",
                  )}
                >
                  {q.options.map((o, oi) => (
                    <label
                      key={o.label}
                      className="flex min-h-[3.25rem] cursor-pointer items-center gap-3 rounded-lg border border-ink/[0.09] bg-white px-3.5 py-3 text-[0.88rem] leading-snug text-ink shadow-[0_1px_2px_rgba(16,24,40,0.03)] transition-[border-color,background-color,color] hover:border-ink/20 has-[:checked]:border-cta/45 has-[:checked]:bg-cta-soft has-[:checked]:font-medium has-[:checked]:text-cta-hover has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-cta/40"
                    >
                      <input
                        type="radio"
                        name={`${matchup.slug}-${q.id}`}
                        checked={answers[q.id] === oi}
                        onChange={() => setAnswers((prev) => ({ ...prev, [q.id]: oi }))}
                        className="peer sr-only"
                      />
                      <span
                        aria-hidden
                        className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-ink/25 bg-white transition-colors peer-checked:border-cta peer-checked:bg-cta"
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-white" />
                      </span>
                      {o.label}
                    </label>
                  ))}
                </div>
              </fieldset>
            ))}

            {/* On a phone the answer sits below the questions, out of sight
                while you answer: this bar rides along and jumps to it. */}
            {result.pick && (
              <div className="sticky bottom-4 z-10 px-5 pb-5 lg:hidden">
                <a
                  href="#fit-result"
                  onClick={(e) => jumpTo(e, "fit-result")}
                  className="flex items-center justify-between gap-3 rounded-xl bg-cta px-4 py-3 text-sm font-semibold text-white shadow-[0_12px_32px_-12px_rgba(4,24,72,0.5)]"
                >
                  <span className="flex min-w-0 items-center gap-2.5">
                    {result.pick === "a" || result.pick === "b" ? (
                      <ProductMark
                        product={sides[result.pick]}
                        className="h-6 w-6 text-[0.6rem] border-white/30"
                      />
                    ) : result.pick === "rankbox" ? (
                      <RankboxTile className="h-6 w-6" />
                    ) : null}
                    <span className="truncate">
                      {complete ? "Your pick" : "Leaning"}: {pickName}
                    </span>
                  </span>
                  <span className="flex shrink-0 items-center gap-1 text-white/80">
                    Why
                    <ArrowDown className="h-4 w-4" aria-hidden />
                  </span>
                </a>
              </div>
            )}
          </div>

          <div
            id="fit-result"
            className={cn("scroll-mt-24 border-t lg:border-l lg:border-t-0", LINE, PANEL)}
            style={DOTS}
          >
            <div className="px-5 py-8 sm:px-10 lg:sticky lg:top-20 lg:px-8 lg:py-10">
              <div aria-live="polite" className={cn(CARD, "p-6")}>
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[0.8rem] font-medium text-ink">
                    {complete ? "Your pick" : result.pick ? "Leaning toward" : "Your pick"}
                  </p>
                  <span
                    className="flex items-center gap-1"
                    role="img"
                    aria-label={`${result.answered} of ${result.total} answered`}
                  >
                    {entry.finder.map((q) => (
                      <span
                        key={q.id}
                        className={cn(
                          "h-1.5 w-5 rounded-full transition-colors",
                          answers[q.id] !== undefined ? "bg-cta" : "bg-ink/[0.1]",
                        )}
                      />
                    ))}
                  </span>
                </div>

                <div className="mt-8">
                  <PathPicture pick={result.pick} sides={sides} />
                </div>

                <ResultBody pick={result.pick} sides={sides} />

                {result.reasons.length > 0 && (
                  <ul className={cn("mt-5 space-y-2.5 border-t pt-5", LINE)}>
                    {result.reasons.map((r) => (
                      <li key={r} className="flex gap-2.5 text-sm leading-snug text-ink/85">
                        <Check
                          aria-hidden
                          className="mt-0.5 h-4 w-4 shrink-0 text-cta"
                          strokeWidth={2.75}
                        />
                        {r}
                      </li>
                    ))}
                  </ul>
                )}

                {result.answered > 0 && (
                  <button
                    type="button"
                    onClick={() => setAnswers({})}
                    className="mt-6 inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:text-ink"
                  >
                    <RotateCcw className="h-3.5 w-3.5" aria-hidden />
                    Start over
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </Band>
    </section>
  );
}
