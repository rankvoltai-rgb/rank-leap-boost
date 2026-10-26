/**
 * "Which one fits you?" — the matchup's three questions, scored by the shared
 * pure logic in data/compare/finder, so a pick here can never disagree with
 * the test that proves each contender is reachable.
 *
 * The questions run down a ruled column; the pick sits beside them on a
 * card that stays in view on wide screens. On a phone a blue bar rides the
 * bottom of the screen while you answer and jumps to the result.
 */
import { useState } from "react";
import { ArrowDown, ArrowUpRight, Compass, RotateCcw } from "lucide-react";
import { Accent, Band, LINE, PANEL, SectionHead, Spacer } from "@/components/landing/frame";
import { ProductMark, RankboxTile, jumpTo } from "@/components/compare/kit";
import { sidesOf, type Matchup } from "@/data/compare/matchups";
import { scoreFinder, type Pick } from "@/data/compare/finder";
import type { Product } from "@/data/compare/products";
import type { MatchupEntry, Side } from "@/data/compare/types";
import { cn } from "@/lib/utils";
import { PairMarks } from "./parts";
import { plural } from "./util";

function PickBody({ pick, sides }: { pick: Pick | null; sides: Record<Side, Product> }) {
  if (pick === null) {
    return (
      <div className="flex flex-col items-center py-6 text-center">
        <PairMarks sides={sides} className="h-11 w-11 text-base" />
        <p className="mt-5 max-w-[16rem] text-sm leading-relaxed text-muted-foreground">
          Answer the questions and the better fit for your situation shows up here.
        </p>
      </div>
    );
  }
  if (pick === "tie") {
    return (
      <div className="mt-5">
        <PairMarks sides={sides} className="h-11 w-11 text-base" />
        <p className="mt-4 font-display text-[1.6rem] font-medium tracking-[-0.025em] text-ink">
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
        <RankboxTile className="h-11 w-11" />
        <p className="mt-4 font-display text-[1.6rem] font-medium tracking-[-0.025em] text-ink">
          Possibly neither
        </p>
        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
          Both are built around someone doing the work in the tool. If nobody will, a system that
          writes and delivers the articles fits better. We make one, so weigh that.
        </p>
        <a
          href="#third-option"
          onClick={(e) => jumpTo(e, "third-option")}
          className="group mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-cta"
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
      <ProductMark product={p} className="h-11 w-11 text-base" />
      <p className="mt-4 font-display text-[1.6rem] font-medium tracking-[-0.025em] text-ink">
        {p.name}
      </p>
      <p className="mt-0.5 text-sm text-muted-foreground">{p.kind}</p>
      <a
        href={`https://${p.domain}`}
        target="_blank"
        rel="noopener noreferrer nofollow"
        className="group mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-cta"
      >
        Visit {p.domain}
        <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </a>
    </div>
  );
}

export function FitFinder({ matchup, entry }: { matchup: Matchup; entry: MatchupEntry }) {
  const sides = sidesOf(matchup);
  const [answers, setAnswers] = useState<Record<string, number | undefined>>({});
  const result = scoreFinder(entry.finder, answers);
  const complete = result.answered === result.total;
  const pickName =
    result.pick === null
      ? ""
      : result.pick === "tie"
        ? "either one"
        : result.pick === "rankbox"
          ? "possibly neither"
          : sides[result.pick].name;

  return (
    <section id="fit" aria-labelledby="fit-title" className="scroll-mt-16">
      <Spacer />
      <SectionHead
        icon={Compass}
        eyebrow="Your situation"
        title={
          <span id="fit-title">
            Which one <Accent>fits you?</Accent>
          </span>
        }
        subtitle={`${plural(entry.finder.length, "question")}. The pick updates as you answer, and tells you why.`}
      />
      <Band>
        <div className="grid lg:grid-cols-[minmax(0,1fr)_24rem]">
          <div>
            {entry.finder.map((q, qi) => (
              <div
                key={q.id}
                className={cn("px-5 py-7 sm:px-10 lg:px-12 lg:py-9", qi > 0 && "border-t", LINE)}
              >
                <fieldset>
                  {/* Floated so the legend lays out as a block, not on the border. */}
                  <legend className="float-left w-full">
                    <span className="flex items-start gap-3 text-[1rem] font-semibold leading-snug text-ink sm:text-[1.05rem]">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-cta-soft text-[0.75rem] font-semibold tabular-nums text-cta">
                        {qi + 1}
                      </span>
                      {q.question}
                    </span>
                  </legend>
                  <div
                    className={cn(
                      "clear-left grid gap-2 pt-4 sm:pl-9",
                      q.options.length === 2 ? "sm:grid-cols-2" : "sm:grid-cols-3",
                    )}
                  >
                    {q.options.map((o, oi) => (
                      <label
                        key={o.label}
                        className="flex min-h-12 cursor-pointer items-center gap-3 rounded-lg border border-ink/[0.1] bg-white px-3.5 py-3 text-[0.86rem] font-medium leading-snug text-ink shadow-[0_1px_2px_rgba(16,24,40,0.04)] transition-[border-color,background-color,color] hover:border-ink/[0.2] has-[:checked]:border-cta/50 has-[:checked]:bg-cta-soft has-[:checked]:text-cta has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-cta/40"
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
              </div>
            ))}

            {result.pick && (
              <div className="sticky bottom-4 z-20 px-4 pb-5 lg:hidden">
                <a
                  href="#fit-result"
                  onClick={(e) => jumpTo(e, "fit-result")}
                  className="flex items-center justify-between gap-3 rounded-xl bg-cta px-4 py-3 text-sm font-semibold text-white shadow-[0_12px_32px_-12px_rgba(4,24,72,0.55)]"
                >
                  <span className="flex min-w-0 items-center gap-2.5">
                    {result.pick === "a" || result.pick === "b" ? (
                      <ProductMark product={sides[result.pick]} className="h-6 w-6 text-[0.6rem]" />
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
            className={cn(
              "scroll-mt-20 border-t px-4 py-8 sm:px-10 lg:border-l lg:border-t-0 lg:px-8 lg:py-9",
              LINE,
              PANEL,
            )}
          >
            <div
              aria-live="polite"
              className="rounded-2xl border border-ink/[0.08] bg-white p-6 shadow-[0_1px_2px_rgba(16,24,40,0.04),0_18px_40px_-24px_rgba(16,24,40,0.25)] lg:sticky lg:top-24"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-[0.75rem] font-medium text-muted-foreground">
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
                        answers[q.id] !== undefined ? "bg-cta" : "bg-ink/[0.08]",
                      )}
                    />
                  ))}
                </span>
              </div>

              <PickBody pick={result.pick} sides={sides} />

              {result.reasons.length > 0 && (
                <ul className={cn("mt-5 space-y-2.5 border-t pt-5", LINE)}>
                  {result.reasons.map((r) => (
                    <li key={r} className="flex gap-2.5 text-[0.86rem] leading-snug text-ink/85">
                      <span
                        aria-hidden
                        className="mt-[0.4rem] h-1.5 w-1.5 shrink-0 rounded-full bg-cta"
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
      </Band>
    </section>
  );
}
