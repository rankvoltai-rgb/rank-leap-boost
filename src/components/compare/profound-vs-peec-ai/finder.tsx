/**
 * "Which one fits you?", rebuilt as a scale. The questions run down the left
 * as stacked choices; on the right a balance beam with each tracker in a pan
 * tips toward whichever your answers favour, and the pick and its reasons
 * read out beneath it. Scoring is the shared, tested `scoreFinder`; the beam
 * only shows which way it fell.
 */
import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowDown, ArrowUpRight, Check, RotateCcw, SlidersHorizontal } from "lucide-react";
import { ProductMark, RankboxTile } from "@/components/compare/kit";
import { Accent, Band, LINE, PANEL, SectionHead, Spacer } from "@/components/landing/frame";
import { scoreFinder, type Pick } from "@/data/compare/finder";
import { sidesOf, type Matchup } from "@/data/compare/matchups";
import type { Product } from "@/data/compare/products";
import type { FinderQuestion, MatchupEntry, Side } from "@/data/compare/types";
import { cn } from "@/lib/utils";
import { CARD_SHADOW, jump } from "./util";

type Answers = Record<string, number | undefined>;

/** How far the beam leans: toward the pick, a little more the clearer it is. */
function tiltOf(questions: FinderQuestion[], answers: Answers, pick: Pick | null): number {
  if (pick !== "a" && pick !== "b") return 0;
  let a = 0;
  let b = 0;
  for (const q of questions) {
    const i = answers[q.id];
    const o = i === undefined ? undefined : q.options[i];
    a += o?.points.a ?? 0;
    b += o?.points.b ?? 0;
  }
  const lean = Math.min(12, 5 + 2 * Math.abs(a - b));
  return pick === "a" ? -lean : lean;
}

export function Finder({ matchup, entry }: { matchup: Matchup; entry: MatchupEntry }) {
  const sides = sidesOf(matchup);
  const [answers, setAnswers] = useState<Answers>({});
  const result = scoreFinder(entry.finder, answers);
  const complete = result.answered === result.total;
  const tilt = tiltOf(entry.finder, answers, result.pick);

  return (
    <section id="fit" aria-labelledby="fit-title" className="scroll-mt-16">
      <Spacer />
      <SectionHead
        icon={SlidersHorizontal}
        eyebrow="Your situation"
        title={
          <span id="fit-title">
            Which one <Accent>fits you?</Accent>
          </span>
        }
        subtitle={`${entry.finder.length} questions. The pick updates as you answer, and tells you why.`}
      />
      <Band>
        <div className="grid lg:grid-cols-[1.2fr_1fr]">
          <div className={cn("divide-y divide-ink/[0.07]")}>
            {entry.finder.map((q, qi) => (
              <fieldset key={q.id} className="px-6 py-8 sm:px-10 lg:px-12">
                <legend className="float-left flex w-full gap-2.5 text-[1rem] font-medium text-ink">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-cta-soft text-[0.75rem] font-semibold tabular-nums text-cta">
                    {qi + 1}
                  </span>
                  {q.question}
                </legend>
                <div className="clear-left grid gap-2 pt-4">
                  {q.options.map((o, oi) => {
                    const on = answers[q.id] === oi;
                    return (
                      <label
                        key={o.label}
                        className={cn(
                          "flex min-h-12 cursor-pointer items-center gap-3 rounded-lg border px-3.5 py-2.5 text-[0.9rem] leading-snug transition-[background-color,border-color,color] has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-cta/40",
                          on
                            ? "border-cta/30 bg-cta-soft text-ink"
                            : "border-ink/[0.08] bg-white text-ink/85 hover:border-ink/[0.16]",
                        )}
                      >
                        <input
                          type="radio"
                          name={`${matchup.slug}-${q.id}`}
                          checked={on}
                          onChange={() => setAnswers((prev) => ({ ...prev, [q.id]: oi }))}
                          className="sr-only"
                        />
                        <span
                          aria-hidden
                          className={cn(
                            "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-colors",
                            on ? "border-cta bg-cta" : "border-ink/25 bg-white",
                          )}
                        >
                          <span
                            className={cn(
                              "h-1.5 w-1.5 rounded-full",
                              on ? "bg-white" : "bg-transparent",
                            )}
                          />
                        </span>
                        {o.label}
                      </label>
                    );
                  })}
                </div>
              </fieldset>
            ))}

            {/* On a phone the result sits below the questions, out of sight
                while you answer; this bar rides along and jumps to it. */}
            {result.pick && (
              <div className="sticky bottom-4 z-10 px-4 py-3 lg:hidden">
                <a
                  href="#fit-result"
                  onClick={(e) => jump(e, "fit-result")}
                  className="flex items-center justify-between gap-3 rounded-xl bg-cta px-4 py-3 text-[0.88rem] font-semibold text-white shadow-[0_10px_30px_-12px_rgba(22,111,229,0.6)]"
                >
                  <span className="truncate">
                    {complete ? "Your pick" : "Leaning"}: {pickName(result.pick, sides)}
                  </span>
                  <span className="flex shrink-0 items-center gap-1 text-white/85">
                    Why
                    <ArrowDown className="h-4 w-4" aria-hidden />
                  </span>
                </a>
              </div>
            )}
          </div>

          <div
            id="fit-result"
            className={cn(
              "scroll-mt-20 border-t px-4 py-8 sm:px-8 lg:border-l lg:border-t-0 lg:px-10 lg:py-10",
              LINE,
              PANEL,
            )}
          >
            <div className="lg:sticky lg:top-24">
              <div
                aria-live="polite"
                className={cn("rounded-2xl border border-ink/[0.07] bg-white", CARD_SHADOW)}
              >
                <div
                  className={cn(
                    "flex items-center justify-between gap-3 border-b px-5 py-3.5",
                    LINE,
                  )}
                >
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
                          answers[q.id] !== undefined ? "bg-cta" : "bg-ink/10",
                        )}
                      />
                    ))}
                  </span>
                </div>

                <Beam a={sides.a} b={sides.b} tilt={tilt} />

                <div className={cn("border-t px-5 pb-6 pt-5", LINE)}>
                  <ResultBody pick={result.pick} sides={sides} />

                  {result.reasons.length > 0 && (
                    <ul className={cn("mt-5 space-y-2.5 border-t pt-5", LINE)}>
                      {result.reasons.map((r) => (
                        <li
                          key={r}
                          className="flex gap-2.5 text-[0.86rem] leading-snug text-ink/85"
                        >
                          <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-cta-soft text-cta">
                            <Check className="h-2.5 w-2.5" strokeWidth={3.5} aria-hidden />
                          </span>
                          {r}
                        </li>
                      ))}
                    </ul>
                  )}

                  {result.answered > 0 && (
                    <button
                      type="button"
                      onClick={() => setAnswers({})}
                      className="mt-6 inline-flex items-center gap-1.5 text-[0.78rem] font-medium text-muted-foreground transition-colors hover:text-ink"
                    >
                      <RotateCcw className="h-3.5 w-3.5" aria-hidden />
                      Start over
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Band>
    </section>
  );
}

function pickName(pick: Pick, sides: Record<Side, Product>): string {
  if (pick === "tie") return "either one";
  if (pick === "rankbox") return "possibly neither";
  return sides[pick].name;
}

/* The beam is 224px between its pans; a pan's rise or fall is half that
   times the sine of the tilt, so the pans hang straight while it turns. */
const HALF = 112;

function Beam({ a, b, tilt }: { a: Product; b: Product; tilt: number }) {
  const reduce = useReducedMotion();
  const drop = HALF * Math.sin((tilt * Math.PI) / 180);
  const spring = reduce
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 140, damping: 14, mass: 0.8 };

  return (
    <div aria-hidden className="relative mx-auto h-[9.5rem] w-[16rem]">
      {/* The stand. */}
      <span className="absolute bottom-3 left-1/2 h-[4.75rem] w-px -translate-x-1/2 bg-ink/15" />
      <span className="absolute bottom-3 left-1/2 h-1 w-20 -translate-x-1/2 rounded-full bg-ink/10" />
      <span className="absolute left-1/2 top-[3.6rem] z-10 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-cta bg-white" />

      {/* The beam. */}
      <motion.span
        className="absolute left-4 right-4 top-[3.6rem] h-[3px] -translate-y-1/2 rounded-full bg-ink/30"
        initial={false}
        animate={{ rotate: tilt }}
        transition={spring}
      />

      {/* The pans, each hanging from its end of the beam. */}
      {(
        [
          ["left-4", a, -drop],
          ["right-4", b, drop],
        ] as const
      ).map(([at, product, y]) => (
        <motion.span
          key={product.slug}
          className={cn("absolute top-[3.6rem] flex w-0 flex-col items-center", at)}
          initial={false}
          animate={{ y }}
          transition={spring}
        >
          <span className="h-4 w-px bg-ink/20" />
          <span className="flex flex-col items-center rounded-lg border border-ink/[0.08] bg-white px-2 pb-1.5 pt-2 shadow-[0_1px_2px_rgba(16,24,40,0.06)]">
            <ProductMark product={product} className="h-8 w-8 text-xs" />
            <span className="mt-1 whitespace-nowrap text-[0.66rem] font-medium text-ink">
              {product.name}
            </span>
          </span>
        </motion.span>
      ))}
    </div>
  );
}

function ResultBody({ pick, sides }: { pick: Pick | null; sides: Record<Side, Product> }) {
  if (pick === null) {
    return (
      <p className="text-[0.88rem] leading-relaxed text-muted-foreground">
        Answer the questions and the better fit for your situation shows up here.
      </p>
    );
  }

  if (pick === "tie") {
    return (
      <div>
        <p className="font-display text-[1.5rem] font-medium tracking-[-0.02em] text-ink">
          Either will do
        </p>
        <p className="mt-1.5 text-[0.88rem] leading-relaxed text-muted-foreground">
          What you&rsquo;ve told us fits both equally. Start with whichever trial is easier to get,
          and judge it on your own content.
        </p>
      </div>
    );
  }

  if (pick === "rankbox") {
    return (
      <div>
        <div className="flex items-center gap-3">
          <RankboxTile className="h-10 w-10" />
          <p className="font-display text-[1.5rem] font-medium tracking-[-0.02em] text-ink">
            Possibly neither
          </p>
        </div>
        <p className="mt-3 text-[0.88rem] leading-relaxed text-muted-foreground">
          Your answers point past tracking, to the content itself. Rankbox, which publishes this
          comparison, makes a tool for that, so weigh it accordingly.
        </p>
        <a
          href="#third-option"
          onClick={(e) => jump(e, "third-option")}
          className="group mt-4 inline-flex items-center gap-1.5 text-[0.88rem] font-medium text-cta"
        >
          See the third option
          <ArrowDown className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
        </a>
      </div>
    );
  }

  const p = sides[pick];
  return (
    <div>
      <div className="flex items-center gap-3">
        <ProductMark product={p} className="h-10 w-10 text-sm" />
        <div>
          <p className="font-display text-[1.5rem] font-medium leading-tight tracking-[-0.02em] text-ink">
            {p.name}
          </p>
          <p className="text-[0.8rem] text-muted-foreground">{p.kind}</p>
        </div>
      </div>
      <a
        href={`https://${p.domain}`}
        target="_blank"
        rel="noopener noreferrer nofollow"
        className="group mt-4 inline-flex items-center gap-1.5 text-[0.88rem] font-medium text-cta"
      >
        Visit {p.domain}
        <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </a>
    </div>
  );
}
