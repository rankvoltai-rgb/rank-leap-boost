/**
 * "Which one fits you?" — the data's three questions, scored by the shared
 * picker logic in data/compare/finder.ts (the test walks every answer set,
 * so each contender is reachable). The questions run down the left as rows
 * of soft-blue chips; the pick sits on the grey panel to the right and
 * updates as you answer, with the reasons behind it.
 */
import { useState } from "react";
import { ArrowDown, ArrowUpRight, Check, ListChecks, RotateCcw } from "lucide-react";
import { Accent, Band, LINE, PANEL, SectionHead, Spacer } from "@/components/landing/frame";
import { ProductMark, RankboxTile } from "@/components/compare/kit";
import { scoreFinder, type Pick } from "@/data/compare/finder";
import type { Matchup } from "@/data/compare/matchups";
import type { Product } from "@/data/compare/products";
import type { MatchupEntry, Side } from "@/data/compare/types";
import { cn } from "@/lib/utils";
import { CARD, KICKER, plural } from "./tokens";

function ResultBody({ pick, sides }: { pick: Pick | null; sides: Record<Side, Product> }) {
  if (pick === null) {
    return (
      <div className="mt-6 flex flex-col items-center py-3 text-center">
        <span className="flex items-center gap-2">
          <ProductMark product={sides.a} className="h-10 w-10 text-sm" />
          <span className="text-[0.8rem] font-medium text-muted-foreground">or</span>
          <ProductMark product={sides.b} className="h-10 w-10 text-sm" />
        </span>
        <p className="mt-5 max-w-[16rem] text-sm leading-relaxed text-muted-foreground">
          Answer the questions and the better fit for your situation shows up here.
        </p>
      </div>
    );
  }

  if (pick === "tie") {
    return (
      <div className="mt-5">
        <div className="flex -space-x-2">
          <ProductMark product={sides.a} className="h-11 w-11 text-base ring-2 ring-white" />
          <ProductMark product={sides.b} className="h-11 w-11 text-base ring-2 ring-white" />
        </div>
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

export function FinderSection({
  matchup,
  sides,
  entry,
}: {
  matchup: Matchup;
  sides: Record<Side, Product>;
  entry: MatchupEntry;
}) {
  const [answers, setAnswers] = useState<Record<string, number | undefined>>({});
  const result = scoreFinder(entry.finder, answers);
  const complete = result.answered === result.total;
  const leaning =
    result.pick === null
      ? null
      : result.pick === "tie"
        ? "either one"
        : result.pick === "rankbox"
          ? "possibly neither"
          : sides[result.pick].name;

  return (
    <section id="fit" aria-labelledby="fit-title" className="scroll-mt-16">
      <Spacer />
      <SectionHead
        icon={ListChecks}
        eyebrow="Your situation"
        title={
          <span id="fit-title">
            Which one <Accent>fits you?</Accent>
          </span>
        }
        subtitle={`${plural(entry.finder.length, "question")}. The pick updates as you answer, and tells you why.`}
      />
      <Band>
        <div className="grid lg:grid-cols-[1.35fr_1fr]">
          <div className={cn("divide-y divide-ink/[0.07] lg:border-r", LINE)}>
            {entry.finder.map((q, qi) => (
              <fieldset key={q.id} className="px-5 py-7 sm:px-8 sm:py-8">
                <legend className="float-left flex w-full items-baseline gap-3 text-[1.02rem] font-medium text-ink">
                  <span className="font-display text-[0.9rem] tabular-nums text-cta">
                    {String(qi + 1).padStart(2, "0")}
                  </span>
                  {q.question}
                </legend>
                <div
                  className={cn(
                    "clear-both grid gap-2 pt-4",
                    q.options.length === 2 ? "sm:grid-cols-2" : "sm:grid-cols-3",
                  )}
                >
                  {q.options.map((o, oi) => {
                    const on = answers[q.id] === oi;
                    return (
                      <label
                        key={o.label}
                        className={cn(
                          "flex min-h-12 cursor-pointer items-center gap-3 rounded-lg border px-3.5 py-3 text-[0.86rem] font-medium leading-snug transition-[background-color,border-color,color] duration-200 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-cta/40",
                          on
                            ? "border-cta/35 bg-cta-soft text-cta"
                            : "border-ink/[0.1] bg-white text-ink shadow-[0_1px_2px_rgba(16,24,40,0.04)] hover:border-ink/[0.2]",
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
                          {on && <Check className="h-2.5 w-2.5 text-white" strokeWidth={3.5} />}
                        </span>
                        {o.label}
                      </label>
                    );
                  })}
                </div>
              </fieldset>
            ))}

            {/* On a phone the pick sits below the questions; this bar rides
                the foot of the screen while you answer and jumps to it. */}
            {leaning && (
              <div className="sticky bottom-3 z-10 border-t-0 px-4 pb-3 lg:hidden">
                <a
                  href="#fit-result"
                  className="flex items-center justify-between gap-3 rounded-xl bg-cta px-4 py-3 text-sm font-semibold text-white shadow-[0_12px_32px_-12px_rgba(4,24,72,0.6)]"
                >
                  <span className="truncate">
                    {complete ? "Your pick" : "Leaning"}: {leaning}
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
            className={cn("scroll-mt-20 border-t px-5 py-8 sm:px-8 lg:border-t-0", LINE, PANEL)}
          >
            <div aria-live="polite" className={cn(CARD, "p-6 sm:p-7 lg:sticky lg:top-24")}>
              <div className="flex items-center justify-between gap-3">
                <p className={KICKER}>
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
                        "h-1.5 w-5 rounded-full transition-colors duration-300",
                        answers[q.id] !== undefined ? "bg-cta" : "bg-ink/[0.1]",
                      )}
                    />
                  ))}
                </span>
              </div>

              <ResultBody pick={result.pick} sides={sides} />

              {result.reasons.length > 0 && (
                <ul className={cn("mt-5 space-y-2.5 border-t pt-5", LINE)}>
                  {result.reasons.map((r) => (
                    <li key={r} className="flex gap-2.5 text-sm leading-snug text-ink/85">
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
