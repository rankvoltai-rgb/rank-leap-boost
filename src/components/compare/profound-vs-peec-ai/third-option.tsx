/**
 * Rankbox, disclosed, once, after the reader has had the whole comparison.
 * Drawn as an aside — a dashed card inside the rails, not a blue band — so it
 * reads as a note from the people who wrote the page. Both contenders are AI
 * visibility trackers and Rankbox is not one: the copy is the entry's own
 * third-option text, and the list is RANKBOX_SHIPS, nothing more.
 */
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { RankboxTile } from "@/components/compare/kit";
import { TRIAL_NOTE } from "@/components/features/FeatureSections";
import { Band, LINE, PANEL, Spacer } from "@/components/landing/frame";
import { Reveal } from "@/components/landing/shared";
import { COMPETITOR_SLUGS } from "@/data/alternatives";
import { RANKBOX_PRICE_LINE, RANKBOX_SHIPS, sidesOf, type Matchup } from "@/data/compare/matchups";
import type { MatchupEntry } from "@/data/compare/types";
import { cn } from "@/lib/utils";
import { Md } from "./parts";
import { SIDES, SOLID_BUTTON } from "./util";

export function ThirdOption({ matchup, entry }: { matchup: Matchup; entry: MatchupEntry }) {
  const sides = sidesOf(matchup);
  /* Our own head-to-heads, where one exists for either contender. */
  const ours = SIDES.map((s) => sides[s]).filter((p) =>
    (COMPETITOR_SLUGS as readonly string[]).includes(p.slug),
  );

  return (
    <section id="third-option" aria-labelledby="third-title" className="scroll-mt-16">
      <Spacer />
      <Band inner="px-3 py-3 sm:px-5 sm:py-5">
        <Reveal>
          <div className="overflow-hidden rounded-2xl border border-dashed border-ink/[0.16]">
            <div className="grid lg:grid-cols-[1.15fr_0.85fr]">
              <div className="px-5 py-9 sm:px-9 lg:px-11 lg:py-12">
                <div className="flex items-center gap-3">
                  <RankboxTile className="h-10 w-10" />
                  <p className="text-[0.8rem] text-muted-foreground">
                    A third option · from the team that wrote this page
                  </p>
                </div>
                <h2
                  id="third-title"
                  className="mt-7 text-balance font-display text-[1.75rem] font-medium leading-[1.15] tracking-[-0.03em] text-ink sm:text-[2.1rem]"
                >
                  {entry.thirdOption.title}
                </h2>
                <p className="mt-4 text-[0.98rem] leading-relaxed text-muted-foreground">
                  <Md text={entry.thirdOption.body} />
                </p>

                <div className="mt-8 flex flex-wrap items-start gap-x-6 gap-y-4">
                  <div>
                    <Link to="/features" className={SOLID_BUTTON}>
                      See how Rankbox works
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                    <p className="mt-2.5 text-[0.78rem] text-muted-foreground">{TRIAL_NOTE}</p>
                  </div>
                  {ours.map((p) => (
                    <Link
                      key={p.slug}
                      to="/alternatives/$slug"
                      params={{ slug: p.slug }}
                      className="group mt-3 inline-flex items-center gap-1.5 text-[0.88rem] font-medium text-ink hover:text-cta"
                    >
                      Rankbox vs {p.name}
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  ))}
                </div>
              </div>

              <div
                className={cn(
                  "flex flex-col justify-center border-t border-dashed border-ink/[0.16] px-5 py-9 sm:px-9 lg:border-l lg:border-t-0 lg:px-10",
                  PANEL,
                )}
              >
                <p className="text-[0.8rem] font-medium text-ink">What Rankbox does today</p>
                <ol
                  className={cn(
                    "mt-4 divide-y divide-ink/[0.07] overflow-hidden rounded-xl border bg-white",
                    LINE,
                  )}
                >
                  {RANKBOX_SHIPS.map((line, i) => (
                    <li
                      key={line}
                      className="flex gap-3.5 px-4 py-3.5 text-[0.88rem] leading-snug text-ink"
                    >
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-cta-soft text-[0.68rem] font-semibold tabular-nums text-cta">
                        {i + 1}
                      </span>
                      {line}
                    </li>
                  ))}
                </ol>
                <p className="mt-4 text-[0.8rem] text-muted-foreground">{RANKBOX_PRICE_LINE}</p>
              </div>
            </div>
          </div>
        </Reveal>
      </Band>
    </section>
  );
}
