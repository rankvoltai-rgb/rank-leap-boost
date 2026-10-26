/**
 * "Which one fits you?" — three questions, scored by the shared pure logic in
 * data/compare/finder (Rankbox never wins a tie there). The questions run
 * down the left in hairline rows; the pick sits on the grey panel to the
 * right and follows you down on wide screens. On a phone, a blue bar rides
 * the bottom of the questions with the current lean and jumps to the reasons.
 */
import { useState } from "react";
import { ArrowDown, ArrowUpRight, Check, RotateCcw, SlidersHorizontal } from "lucide-react";
import { Accent, Band, LINE, PANEL, SectionHead, Spacer } from "@/components/landing/frame";
import { ProductMark, RankboxTile, jumpTo } from "@/components/compare/kit";
import { scoreFinder, type Pick } from "@/data/compare/finder";
import { sidesOf, type Matchup } from "@/data/compare/matchups";
import type { Product } from "@/data/compare/products";
import type { MatchupEntry, Side } from "@/data/compare/types";
import { cn } from "@/lib/utils";

const SIDES: Side[] = ["a", "b"];

export function FitQuiz({ matchup, entry }: { matchup: Matchup; entry: MatchupEntry }) {
  const sides = sidesOf(matchup);
  const [answers, setAnswers] = useState<Record<string, number | undefined>>({});
  const result = scoreFinder(entry.finder, answers);
  const complete = result.answered === result.total;

  return (
    <section id="fit" aria-labelledby="fit-title" className="scroll-mt-16">
      <Spacer />
      <SectionHead
        icon={SlidersHorizontal}
        eyebrow="Fit quiz"
        title={
          <span id="fit-title">
            Which one <Accent>fits you?</Accent>
          </span>
        }
        subtitle={`${entry.finder.length} questions. The pick updates as you answer, and says why.`}
      />

      <Band>
        <div className="grid lg:grid-cols-[minmax(0,1fr)_25rem]">
          <div className={cn("lg:border-r", LINE)}>
            {entry.finder.map((q, qi) => (
              <div
                key={q.id}
                className={cn("px-6 py-8 sm:px-10 lg:px-12", qi > 0 && "border-t", LINE)}
              >
                <fieldset>
                  <legend className="flex items-baseline gap-3 text-[1.05rem] font-medium text-ink sm:text-[1.12rem]">
                    <span className="font-display text-[0.95rem] tabular-nums text-cta">
                      {String(qi + 1).padStart(2, "0")}
                    </span>
                    {q.question}
                  </legend>
                  <div
                    className={cn(
                      "mt-4 grid gap-2",
                      q.options.length === 2 ? "sm:grid-cols-2" : "sm:grid-cols-3",
                    )}
                  >
                    {q.options.map((o, oi) => (
                      <label
                        key={o.label}
                        className="flex min-h-14 cursor-pointer items-center gap-3 rounded-lg border border-ink/[0.1] bg-white px-3.5 py-3 text-[0.88rem] font-medium leading-snug text-ink shadow-[0_1px_2px_rgba(16,24,40,0.04)] transition-[border-color,background-color,color] hover:border-ink/[0.2] has-[:checked]:border-cta has-[:checked]:bg-cta-soft has-[:checked]:text-cta has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-cta/40"
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
                          className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-ink/25 transition-colors peer-checked:border-cta peer-checked:bg-cta"
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
              <div className="sticky bottom-4 z-10 px-4 pb-4 lg:hidden">
                <a
                  href="#fit-result"
                  onClick={(e) => jumpTo(e, "fit-result")}
                  className="flex items-center justify-between gap-3 rounded-xl bg-cta px-4 py-3 text-[0.9rem] font-semibold text-white shadow-[0_12px_32px_-12px_rgba(22,111,229,0.7)]"
                >
                  <span className="flex min-w-0 items-center gap-2.5">
                    <PickMark pick={result.pick} sides={sides} className="h-6 w-6 text-[0.6rem]" />
                    <span className="truncate">
                      {complete ? "Your pick" : "Leaning"}: {pickName(result.pick, sides)}
                    </span>
                  </span>
                  <span className="flex shrink-0 items-center gap-1 text-white">
                    Why
                    <ArrowDown className="h-4 w-4" aria-hidden />
                  </span>
                </a>
              </div>
            )}
          </div>

          <div
            className={cn(
              PANEL,
              "border-t px-5 py-8 sm:px-10 lg:border-t-0 lg:px-8 lg:py-10",
              LINE,
            )}
          >
            <div id="fit-result" className="scroll-mt-24 lg:sticky lg:top-24">
              <div
                aria-live="polite"
                className="rounded-xl border border-ink/[0.07] bg-white p-6 shadow-[0_1px_2px_rgba(16,24,40,0.04),0_18px_40px_-24px_rgba(16,24,40,0.28)]"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[0.8rem] font-medium text-muted-foreground">
                    {result.pick && !complete ? "Leaning toward" : "Your pick"}
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

                <PickBody pick={result.pick} sides={sides} entry={entry} />

                {result.reasons.length > 0 && (
                  <ul className={cn("mt-5 space-y-2.5 border-t pt-5", LINE)}>
                    {result.reasons.map((r) => (
                      <li key={r} className="flex gap-2.5 text-[0.86rem] leading-snug text-ink/80">
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
      </Band>
    </section>
  );
}

function pickName(pick: Pick, sides: Record<Side, Product>): string {
  if (pick === "tie") return "either one";
  if (pick === "rankbox") return "possibly neither";
  return sides[pick].name;
}

function PickMark({
  pick,
  sides,
  className,
}: {
  pick: Pick;
  sides: Record<Side, Product>;
  className?: string;
}) {
  if (pick === "a" || pick === "b")
    return <ProductMark product={sides[pick]} className={className} />;
  if (pick === "rankbox") return <RankboxTile className={className} />;
  return null;
}

function PickBody({
  pick,
  sides,
  entry,
}: {
  pick: Pick | null;
  sides: Record<Side, Product>;
  entry: MatchupEntry;
}) {
  if (pick === null) {
    return (
      <div className="mt-6 flex flex-col items-center py-4 text-center">
        <div className="flex items-center gap-2" aria-hidden>
          <ProductMark product={sides.a} className="h-10 w-10 text-sm" />
          <span className="text-[0.75rem] font-bold text-brand-blue">vs</span>
          <ProductMark product={sides.b} className="h-10 w-10 text-sm" />
        </div>
        <p className="mt-5 max-w-[16rem] text-[0.86rem] leading-relaxed text-muted-foreground">
          Answer the questions and the better fit for your situation shows up here.
        </p>
      </div>
    );
  }

  if (pick === "tie") {
    return (
      <div className="mt-5">
        <div className="flex -space-x-2">
          {SIDES.map((s) => (
            <ProductMark
              key={s}
              product={sides[s]}
              className="h-12 w-12 text-lg ring-2 ring-white"
            />
          ))}
        </div>
        <p className="mt-4 font-display text-[1.6rem] font-medium tracking-[-0.025em] text-ink">
          Either will do
        </p>
        <p className="mt-1.5 text-[0.86rem] leading-relaxed text-muted-foreground">
          What you&rsquo;ve told us fits both equally. Try each on your own site before you pay:
        </p>
        <ul className="mt-3 space-y-2">
          {SIDES.map((s) => (
            <li key={s} className="flex gap-2 text-[0.8rem] leading-snug text-ink/75">
              <ProductMark product={sides[s]} className="mt-px h-4 w-4 text-[0.45rem]" />
              {entry.pricing[s].trial}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (pick === "rankbox") {
    return (
      <div className="mt-5">
        <RankboxTile className="h-12 w-12" />
        <p className="mt-4 font-display text-[1.6rem] font-medium tracking-[-0.025em] text-ink">
          Possibly neither
        </p>
        <p className="mt-1.5 text-[0.86rem] leading-relaxed text-muted-foreground">
          Both are research suites: they show what to write, and someone still writes it. If what
          you need is the articles, a system that writes and delivers them fits better. We make one,
          so weigh that.
        </p>
        <a
          href="#third-option"
          onClick={(e) => jumpTo(e, "third-option")}
          className="group mt-4 inline-flex items-center gap-1.5 text-[0.86rem] font-semibold text-cta"
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
      <ProductMark product={p} className="h-12 w-12 text-lg" />
      <p className="mt-4 font-display text-[1.6rem] font-medium tracking-[-0.025em] text-ink">
        {p.name}
      </p>
      <p className="mt-0.5 text-[0.84rem] text-muted-foreground">{p.kind}</p>
      <a
        href={`https://${p.domain}`}
        target="_blank"
        rel="noopener noreferrer nofollow"
        className="group mt-4 inline-flex items-center gap-1.5 text-[0.86rem] font-semibold text-cta"
      >
        Visit {p.domain}
        <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </a>
    </div>
  );
}
