/**
 * The call, then the choice. The quotable paragraph gets a band of its own,
 * set large beside its label, and under it the two "choose this if" lists sit
 * as equal hairline cells — same mark, same weight, same white — each with
 * who the tool is for and a link to the vendor.
 */
import { ArrowUpRight, Check, Scale } from "lucide-react";
import { ProductMark } from "@/components/compare/kit";
import { Accent, Band, LINE, LINE_FILL, Pill, Spacer } from "@/components/landing/frame";
import { Reveal } from "@/components/landing/shared";
import { sidesOf, type Matchup } from "@/data/compare/matchups";
import type { MatchupEntry } from "@/data/compare/types";
import { cn } from "@/lib/utils";
import { Md } from "./parts";
import { SIDES } from "./util";

export function ShortAnswer({ matchup, entry }: { matchup: Matchup; entry: MatchupEntry }) {
  const sides = sidesOf(matchup);
  return (
    <section id="short-answer" aria-labelledby="answer-title" className="scroll-mt-16">
      <Spacer />
      <Band>
        <div className="grid lg:grid-cols-[0.72fr_1.28fr]">
          <Reveal
            className={cn(
              "flex flex-col justify-center border-b px-6 py-10 sm:px-10 lg:border-b-0 lg:border-r lg:px-12 lg:py-14",
              LINE,
            )}
          >
            <Pill icon={Scale} className="w-fit">
              The short answer
            </Pill>
            <h2
              id="answer-title"
              className="mt-5 font-display text-[1.9rem] font-medium leading-[1.12] tracking-[-0.03em] text-ink sm:text-[2.3rem]"
            >
              The call, <Accent>in one paragraph</Accent>
            </h2>
          </Reveal>
          <Reveal delay={0.06} className="px-6 py-10 sm:px-10 lg:px-12 lg:py-14">
            <p className="text-pretty text-[1.06rem] leading-[1.75] text-ink/85 sm:text-[1.15rem]">
              <Md text={entry.shortAnswer} />
            </p>
          </Reveal>
        </div>
      </Band>

      <Band>
        <div className={cn("grid gap-px md:grid-cols-2", LINE_FILL)}>
          {SIDES.map((side, i) => {
            const p = sides[side];
            return (
              <Reveal key={side} delay={i * 0.06} className="flex flex-col bg-white">
                <div className="flex flex-1 flex-col px-6 py-9 sm:px-10 lg:px-12">
                  <div className="flex items-center gap-3">
                    <ProductMark product={p} className="h-10 w-10 text-sm" />
                    <h3 className="text-[1.15rem] font-medium tracking-tight text-ink">
                      Choose {p.name} if&hellip;
                    </h3>
                  </div>
                  <ul className="mt-6 flex-1 space-y-3.5">
                    {entry.picks[side].map((pick) => (
                      <li key={pick} className="flex gap-3 text-[0.95rem] leading-snug text-ink/85">
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-cta-soft text-cta">
                          <Check className="h-3 w-3" strokeWidth={3} aria-hidden />
                        </span>
                        {pick}
                      </li>
                    ))}
                  </ul>
                </div>
                <div
                  className={cn(
                    "flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t px-6 py-4 sm:px-10 lg:px-12",
                    LINE,
                  )}
                >
                  <p className="text-[0.8rem] leading-snug text-muted-foreground">
                    <span className="font-medium text-ink">Best for:</span> {matchup.bestFor[side]}
                  </p>
                  <a
                    href={`https://${p.domain}`}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="inline-flex shrink-0 items-center gap-1 text-[0.8rem] font-medium text-ink underline-offset-4 hover:text-cta hover:underline"
                  >
                    {p.domain}
                    <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
                  </a>
                </div>
              </Reveal>
            );
          })}
        </div>
      </Band>
    </section>
  );
}
