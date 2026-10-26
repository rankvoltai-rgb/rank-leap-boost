/**
 * "Which one fits you?" — the data's three questions, one per hairline
 * column, scored by the shared pure logic in data/compare/finder.ts. The
 * result band underneath updates on every answer and gives the chosen
 * answers' own reasons. Rankbox can only come out on top if it beats both
 * outright (the scorer's rule), and when it does the result says plainly
 * that we make it.
 */
import { useState } from "react";
import { ArrowDown, ArrowUpRight, Check, Compass, RotateCcw } from "lucide-react";
import {
  Accent,
  Band,
  CELL,
  CellGrid,
  LINE,
  PANEL,
  SectionHead,
  Spacer,
} from "@/components/landing/frame";
import { ProductMark, RankboxTile } from "@/components/compare/kit";
import { sidesOf, type Matchup } from "@/data/compare/matchups";
import { scoreFinder, type Pick } from "@/data/compare/finder";
import type { Product } from "@/data/compare/products";
import type { MatchupEntry, Side } from "@/data/compare/types";
import { cn } from "@/lib/utils";
import { jump } from "./util";

function PickSummary({ pick, sides }: { pick: Pick | null; sides: Record<Side, Product> }) {
  if (pick === null) {
    return (
      <div className="flex items-center gap-4">
        <div className="flex -space-x-2">
          <ProductMark product={sides.a} className="h-11 w-11 text-base ring-2 ring-white" />
          <ProductMark product={sides.b} className="h-11 w-11 text-base ring-2 ring-white" />
        </div>
        <p className="max-w-xs text-[0.9rem] leading-relaxed text-muted-foreground">
          Answer the questions above. The better fit shows here, with the reasons behind it.
        </p>
      </div>
    );
  }
  if (pick === "tie") {
    return (
      <div className="flex items-start gap-4">
        <div className="flex shrink-0 -space-x-2">
          <ProductMark product={sides.a} className="h-11 w-11 text-base ring-2 ring-white" />
          <ProductMark product={sides.b} className="h-11 w-11 text-base ring-2 ring-white" />
        </div>
        <div>
          <p className="font-display text-[1.6rem] font-medium leading-tight tracking-[-0.02em] text-ink">
            Either will do
          </p>
          <p className="mt-1.5 max-w-sm text-[0.88rem] leading-relaxed text-muted-foreground">
            Your answers fit both equally. Start with whichever trial suits you, and judge it on
            your own content.
          </p>
        </div>
      </div>
    );
  }
  if (pick === "rankbox") {
    return (
      <div className="flex items-start gap-4">
        <RankboxTile className="h-11 w-11" />
        <div>
          <p className="font-display text-[1.6rem] font-medium leading-tight tracking-[-0.02em] text-ink">
            Possibly neither
          </p>
          <p className="mt-1.5 max-w-sm text-[0.88rem] leading-relaxed text-muted-foreground">
            Both are platforms someone operates day to day. If nobody will, the third option below
            may fit better. We make it, so weigh that.
          </p>
          <a
            href="#third-option"
            onClick={(e) => jump(e, "third-option")}
            className="group mt-3 inline-flex items-center gap-1.5 text-[0.85rem] font-semibold text-cta"
          >
            See the third option
            <ArrowDown className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
          </a>
        </div>
      </div>
    );
  }
  const p = sides[pick];
  return (
    <div className="flex items-start gap-4">
      <ProductMark product={p} className="h-11 w-11 text-base" />
      <div>
        <p className="font-display text-[1.6rem] font-medium leading-tight tracking-[-0.02em] text-ink">
          {p.name}
        </p>
        <p className="mt-0.5 text-[0.85rem] text-muted-foreground">{p.kind}</p>
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[0.85rem] font-semibold">
          <a
            href="#pricing"
            onClick={(e) => jump(e, "pricing")}
            className="text-cta underline-offset-4 hover:underline"
          >
            See its plans
          </a>
          <a
            href={`https://${p.domain}`}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="inline-flex items-center gap-1 text-ink underline-offset-4 hover:underline"
          >
            {p.domain}
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
          </a>
        </div>
      </div>
    </div>
  );
}

export function Finder({ matchup, entry }: { matchup: Matchup; entry: MatchupEntry }) {
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
        subtitle={`${entry.finder.length} questions. The pick updates as you answer, and shows the reason behind each answer.`}
      />

      <Band>
        <div className="relative">
          <CellGrid className="lg:grid-cols-3">
            {entry.finder.map((q, qi) => (
              <li key={q.id} className={cn(CELL, "px-5 py-7 sm:px-8")}>
                <fieldset>
                  <legend className="flex items-baseline gap-2.5 text-[1rem] font-medium text-ink">
                    <span className="text-[0.75rem] font-medium tabular-nums text-cta">
                      {String(qi + 1).padStart(2, "0")}
                    </span>
                    {q.question}
                  </legend>
                  <div className="mt-4 space-y-2">
                    {q.options.map((o, oi) => {
                      const on = answers[q.id] === oi;
                      return (
                        <label
                          key={o.label}
                          className={cn(
                            "flex min-h-12 cursor-pointer items-center gap-3 rounded-lg border px-3.5 py-2.5 text-[0.86rem] leading-snug transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-cta/40",
                            on
                              ? "border-cta/35 bg-cta-soft font-medium text-cta"
                              : "border-ink/[0.08] bg-white text-ink hover:border-ink/[0.18]",
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
                            {on && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                          </span>
                          {o.label}
                        </label>
                      );
                    })}
                  </div>
                </fieldset>
              </li>
            ))}
          </CellGrid>

          {/* On a phone the result is below all three questions. This bar
              rides the bottom of the screen until the result comes up. */}
          {result.pick && (
            <div className="pointer-events-none sticky bottom-3 z-10 px-4 pb-3 pt-1 lg:hidden">
              <a
                href="#fit-result"
                onClick={(e) => jump(e, "fit-result")}
                className="pointer-events-auto flex w-full items-center justify-between gap-3 rounded-xl bg-cta px-4 py-3 text-[0.86rem] font-semibold text-white shadow-[0_12px_32px_-12px_rgba(4,24,72,0.6)]"
              >
                <span className="truncate">
                  {complete ? "Your pick" : "Leaning"}: {pickName}
                </span>
                <span className="flex shrink-0 items-center gap-1 text-white/85">
                  Why
                  <ArrowDown className="h-4 w-4" aria-hidden />
                </span>
              </a>
            </div>
          )}
        </div>
      </Band>

      <Band inner={PANEL}>
        <div id="fit-result" className="scroll-mt-20 px-4 py-6 sm:px-8 sm:py-8">
          <div
            aria-live="polite"
            className="grid gap-6 rounded-xl border border-ink/[0.07] bg-white p-5 shadow-[0_1px_2px_rgba(16,24,40,0.04),0_18px_44px_-24px_rgba(16,24,40,0.25)] sm:p-7 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-10"
          >
            <div>
              <div className="mb-4 flex items-center justify-between gap-3">
                <p className="text-[0.7rem] font-medium uppercase tracking-[0.12em] text-muted-foreground">
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
              <PickSummary pick={result.pick} sides={sides} />
            </div>

            <div className={cn("lg:border-l lg:pl-10", LINE)}>
              <p className="text-[0.7rem] font-medium uppercase tracking-[0.12em] text-muted-foreground">
                Why
              </p>
              {result.reasons.length > 0 ? (
                <ul className="mt-4 space-y-3">
                  {result.reasons.map((r) => (
                    <li key={r} className="flex gap-2.5 text-[0.88rem] leading-snug text-ink/85">
                      <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-cta-soft text-cta">
                        <Check className="h-2.5 w-2.5" strokeWidth={3.5} aria-hidden />
                      </span>
                      {r}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-4 text-[0.88rem] text-muted-foreground">
                  Each answer you pick adds its reason here.
                </p>
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
      </Band>
    </section>
  );
}
