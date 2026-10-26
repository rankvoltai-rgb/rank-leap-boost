/**
 * Rankbox, disclosed, once, after the reader has had the whole comparison:
 * the data's own title and body, then what Rankbox ships today
 * (RANKBOX_SHIPS) and nothing more. It sits on a dashed card so it reads as a
 * note from the people who wrote the page rather than the page's purpose.
 */
import { Link } from "@tanstack/react-router";
import { ArrowRight, Check } from "lucide-react";
import { Band, LINE, PANEL, Pill, Spacer } from "@/components/landing/frame";
import { Reveal } from "@/components/landing/shared";
import { Mark } from "@/components/brand/Mark";
import { RankboxTile } from "@/components/compare/kit";
import { TRIAL_NOTE } from "@/components/features/FeatureSections";
import { COMPETITOR_SLUGS } from "@/data/alternatives";
import { RANKBOX_PRICE_LINE, RANKBOX_SHIPS, sidesOf, type Matchup } from "@/data/compare/matchups";
import type { MatchupEntry } from "@/data/compare/types";
import { cn } from "@/lib/utils";
import { Rich } from "./parts";
import { SIDES } from "./util";

function RankboxGlyph({ className }: { className?: string }) {
  return <Mark className={cn("text-brand-blue", className)} />;
}

export function ThirdOption({ matchup, entry }: { matchup: Matchup; entry: MatchupEntry }) {
  const sides = sidesOf(matchup);
  const ours = SIDES.map((s) => sides[s]).filter((p) =>
    (COMPETITOR_SLUGS as readonly string[]).includes(p.slug),
  );

  return (
    <section id="third-option" aria-labelledby="third-title" className="scroll-mt-16">
      <Spacer />
      <Band inner={cn("px-4 py-10 sm:px-8 sm:py-14 lg:px-12", PANEL)}>
        <Reveal>
          <div className="grid overflow-hidden rounded-xl border border-dashed border-ink/20 bg-white lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
            <div className="p-6 sm:p-9">
              <Pill icon={RankboxGlyph}>A third option · from the publisher of this page</Pill>
              <h2
                id="third-title"
                className="mt-5 text-balance font-display text-[1.6rem] font-medium leading-[1.15] tracking-[-0.025em] text-ink sm:text-[2rem]"
              >
                {entry.thirdOption.title}
              </h2>
              <p className="mt-4 text-[0.93rem] leading-relaxed text-muted-foreground">
                <Rich text={entry.thirdOption.body} />
              </p>
              <div className="mt-7 flex flex-col items-start gap-2">
                <Link
                  to="/features"
                  className="group inline-flex h-11 items-center gap-2 rounded-lg bg-cta px-5 text-[0.92rem] font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.16),0_1px_2px_rgba(16,24,40,0.14)] transition-colors hover:bg-cta-hover focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cta/25"
                >
                  See how Rankbox works
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
                <p className="text-[0.78rem] text-muted-foreground">{TRIAL_NOTE}</p>
              </div>
            </div>

            <div className={cn("border-t p-6 sm:p-9 lg:border-l lg:border-t-0", LINE)}>
              <div className="flex items-center gap-3">
                <RankboxTile className="h-9 w-9" />
                <div>
                  <p className="text-[0.92rem] font-semibold text-ink">What Rankbox does today</p>
                  <p className="text-[0.78rem] text-muted-foreground">{RANKBOX_PRICE_LINE}</p>
                </div>
              </div>
              <ul className="mt-5 divide-y divide-ink/[0.07] border-y border-ink/[0.07]">
                {RANKBOX_SHIPS.map((line) => (
                  <li
                    key={line}
                    className="flex gap-2.5 py-3 text-[0.86rem] leading-snug text-ink/85"
                  >
                    <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-cta-soft text-cta">
                      <Check className="h-2.5 w-2.5" strokeWidth={3.5} aria-hidden />
                    </span>
                    {line}
                  </li>
                ))}
              </ul>
              {ours.length > 0 && (
                <ul className="mt-5 flex flex-wrap gap-2">
                  {ours.map((p) => (
                    <li key={p.slug}>
                      <Link
                        to="/alternatives/$slug"
                        params={{ slug: p.slug }}
                        className="group inline-flex items-center gap-1.5 rounded-lg border border-ink/[0.1] bg-white px-3 py-1.5 text-[0.8rem] font-medium text-ink transition-colors hover:border-ink/[0.2]"
                      >
                        Rankbox vs {p.name}
                        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </Reveal>
      </Band>
    </section>
  );
}
