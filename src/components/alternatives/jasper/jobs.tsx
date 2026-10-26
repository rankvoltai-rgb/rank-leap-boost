/**
 * The real difference, drawn as two shapes. Rankbox's list is a chain, one
 * job carried from start to finish; Jasper's is a spread of tiles, many
 * formats a team works across. Both lists are the data's own, verbatim; the
 * shape is the only thing this section adds.
 */
import { Scale } from "lucide-react";
import { cn } from "@/lib/utils";
import { Band, LINE_FILL, SectionHead, Spacer } from "@/components/landing/frame";
import { Reveal } from "@/components/landing/shared";
import { CompetitorMark, RankboxMark } from "@/components/alternatives/kit";
import type { Competitor } from "@/data/alternatives";
import { AccentTail } from "./parts";

export function TwoJobs({ competitor }: { competitor: Competitor }) {
  const p = competitor.positioning;
  return (
    <section aria-labelledby="jobs-title">
      <Spacer />
      <SectionHead
        icon={Scale}
        eyebrow="The real difference"
        title={
          <span id="jobs-title">
            <AccentTail text={p.title} />
          </span>
        }
        subtitle={p.body}
      />
      <Band>
        <div className={cn("grid gap-px lg:grid-cols-2", LINE_FILL)}>
          {/* Rankbox: a chain */}
          <div className="bg-[color-mix(in_oklab,var(--cta)_4%,white)]">
            <Reveal className="h-full px-6 py-10 sm:px-10 lg:px-12 lg:py-12">
              <div className="flex items-center gap-3.5">
                <RankboxMark className="h-10 w-10" />
                <div>
                  <h3 className="text-[1rem] font-semibold tracking-tight text-ink">
                    {p.rankboxTitle}
                  </h3>
                  <p className="text-[0.8rem] text-muted-foreground">
                    {p.rankboxTag ?? "An engine, not an editor"}
                  </p>
                </div>
              </div>
              <ol className="relative mt-8">
                {/* The thread the steps hang on. */}
                <span
                  aria-hidden
                  className="absolute bottom-4 left-[0.9rem] top-4 w-[2px] rounded-full bg-cta/20"
                />
                {p.rankbox.map((item, i) => (
                  <li key={item} className="relative flex gap-4 py-2.5">
                    <span className="relative z-10 flex h-[1.85rem] w-[1.85rem] shrink-0 items-center justify-center rounded-full border-2 border-white bg-cta text-[0.75rem] font-semibold tabular-nums text-white shadow-[0_1px_2px_rgba(22,111,229,0.3)]">
                      {i + 1}
                    </span>
                    <span className="pt-1 text-[0.95rem] leading-snug text-ink">{item}</span>
                  </li>
                ))}
              </ol>
            </Reveal>
          </div>

          {/* Jasper: a spread */}
          <div className="bg-white">
            <Reveal delay={0.06} className="h-full px-6 py-10 sm:px-10 lg:px-12 lg:py-12">
              <div className="flex items-center gap-3.5">
                <CompetitorMark competitor={competitor} className="h-10 w-10" />
                <div>
                  <h3 className="text-[1rem] font-semibold tracking-tight text-ink">
                    {p.themTitle}
                  </h3>
                  <p className="text-[0.8rem] text-muted-foreground">{competitor.category}</p>
                </div>
              </div>
              <ul className="mt-8 grid gap-2.5 sm:grid-cols-2">
                {p.them.map((item, i) => (
                  <li
                    key={item}
                    className={cn(
                      "flex gap-3 rounded-lg border border-ink/[0.08] bg-white px-3.5 py-3 text-[0.9rem] leading-snug text-ink/85 shadow-[0_1px_2px_rgba(16,24,40,0.04)]",
                      // An odd count leaves the first tile spanning, so the
                      // spread never ends on a lone half-width tile.
                      p.them.length % 2 === 1 && i === 0 && "sm:col-span-2",
                    )}
                  >
                    <span
                      aria-hidden
                      className="mt-[0.45em] h-1.5 w-1.5 shrink-0 rounded-full bg-ink/25"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </Band>
    </section>
  );
}
