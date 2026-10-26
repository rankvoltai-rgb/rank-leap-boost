/**
 * Rankbox, disclosed, once, after the whole comparison. The pitch is the
 * entry's own third-option copy; the list beside it is RANKBOX_SHIPS and
 * nothing else, drawn as the four steps it runs in order.
 */
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Band, LINE_FILL, PANEL, Spacer } from "@/components/landing/frame";
import { RankboxTile } from "@/components/compare/kit";
import { TRIAL_NOTE } from "@/components/features/FeatureSections";
import { RANKBOX_PRICE_LINE, RANKBOX_SHIPS } from "@/data/compare/matchups";
import type { MatchupEntry } from "@/data/compare/types";
import { cn } from "@/lib/utils";
import { Md } from "./md";

export function ThirdOption({ entry }: { entry: MatchupEntry }) {
  return (
    <section id="third-option" aria-labelledby="third-title" className="scroll-mt-16">
      <Spacer />
      <Band>
        <div className={cn("grid gap-px lg:grid-cols-[1.15fr_1fr]", LINE_FILL)}>
          <div className="bg-white px-6 py-10 sm:px-10 lg:px-12 lg:py-14">
            <p className="flex items-center gap-3 text-[0.8rem] font-medium text-muted-foreground">
              <RankboxTile className="h-9 w-9" />A third option · from the team that wrote this page
            </p>
            <h2
              id="third-title"
              className="mt-6 text-balance font-display text-[1.75rem] font-medium leading-[1.14] tracking-[-0.03em] text-ink sm:text-[2.15rem]"
            >
              {entry.thirdOption.title}
            </h2>
            <p className="mt-4 text-[0.98rem] leading-relaxed text-muted-foreground">
              <Md text={entry.thirdOption.body} />
            </p>
            <div className="mt-8">
              <Link
                to="/features"
                className="group inline-flex h-11 items-center gap-2 rounded-lg bg-cta px-5 text-[0.92rem] font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.16),0_1px_2px_rgba(16,24,40,0.14)] transition-[background-color,transform] duration-150 hover:bg-cta-hover active:scale-[0.985] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cta/25"
              >
                See how Rankbox works
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <p className="mt-3 text-[0.8rem] text-muted-foreground">{TRIAL_NOTE}</p>
            </div>
          </div>

          <div className={cn(PANEL, "px-6 py-10 sm:px-10 lg:px-12 lg:py-14")}>
            <p className="text-[0.8rem] font-medium text-muted-foreground">
              What Rankbox does, in order
            </p>
            <div className="relative mt-5">
              {/* The thread between the steps. */}
              <span
                aria-hidden
                className="absolute bottom-6 left-[1.5rem] top-6 w-px bg-[linear-gradient(to_bottom,var(--cta),color-mix(in_oklab,var(--cta)_25%,white))]"
              />
              <ol className="relative space-y-3">
                {RANKBOX_SHIPS.map((line, i) => (
                  <li
                    key={line}
                    className="relative flex items-center gap-3.5 rounded-xl border border-ink/[0.07] bg-white px-3 py-3 shadow-[0_1px_2px_rgba(16,24,40,0.04)]"
                  >
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-cta text-[0.72rem] font-semibold text-white tabular-nums">
                      {i + 1}
                    </span>
                    <span className="text-[0.88rem] leading-snug text-ink">{line}</span>
                  </li>
                ))}
              </ol>
            </div>
            <p className="mt-5 text-[0.84rem] font-medium text-ink">{RANKBOX_PRICE_LINE}</p>
          </div>
        </div>
      </Band>
    </section>
  );
}
