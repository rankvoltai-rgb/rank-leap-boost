/**
 * Switching, drawn as two lanes over the three steps. The data says the two
 * can run side by side ("Keep RankPill running until the first Rankbox
 * articles are live"), so the picture is an overlap rather than a cut-over:
 * Rankbox's lane starts at the first step, RankPill's runs on past the third
 * and fades out. No durations are drawn, because none are given.
 *
 * The lanes draw themselves while on screen and rewind when they leave; with
 * reduced motion they are simply drawn.
 */
import { motion } from "motion/react";
import { ArrowRightLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { Accent, Band, CELL, CellGrid, SectionHead, Spacer } from "@/components/landing/frame";
import { Reveal } from "@/components/landing/shared";
import { CompetitorMark, RankboxMark } from "@/components/alternatives/kit";
import type { Competitor } from "@/data/alternatives";
import { splitTail, useOnScreen } from "./lib";

const EASE = [0.16, 1, 0.3, 1] as const;

export function Switching({ competitor: c }: { competitor: Competitor }) {
  const m = c.migration;
  const [lead, tail] = splitTail(m.title, 2);
  const { ref, on, reduce } = useOnScreen(0.5);
  const n = m.steps.length;

  return (
    <section aria-labelledby="switch-title">
      <Spacer />
      <SectionHead
        icon={ArrowRightLeft}
        eyebrow="Switching"
        title={
          <span id="switch-title">
            {lead}
            <Accent>{tail}</Accent>
          </span>
        }
        subtitle={m.body}
      />

      {/* The lanes, on the same three columns as the steps below them. */}
      <Band>
        <div
          ref={ref}
          role="img"
          aria-label={`${c.name} keeps running while Rankbox starts at step 1, and stops once the first Rankbox articles are live.`}
          className="relative overflow-hidden py-8 sm:py-10"
        >
          {/* Column centres, as faint rules. */}
          <div
            aria-hidden
            className="absolute inset-0 grid"
            style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }}
          >
            {m.steps.map((s) => (
              <span
                key={s.title}
                className="mx-auto h-full border-l border-dashed border-ink/[0.08]"
              />
            ))}
          </div>

          <div aria-hidden className="relative space-y-3">
            <div className="relative h-8">
              <motion.span
                initial={false}
                animate={{ scaleX: on ? 1 : 0 }}
                transition={reduce ? { duration: 0 } : { duration: 1.2, ease: EASE }}
                className="absolute inset-y-0 left-0 right-[3%] origin-left rounded-r-full bg-[linear-gradient(to_right,color-mix(in_oklab,var(--ink)_12%,white)_0%,color-mix(in_oklab,var(--ink)_12%,white)_78%,transparent_100%)]"
              />
              <span className="absolute left-3 top-1/2 flex -translate-y-1/2 items-center gap-1.5 rounded-md bg-white px-1.5 py-0.5 text-[0.72rem] font-medium text-ink shadow-[0_1px_2px_rgba(16,24,40,0.06)] sm:left-5">
                <CompetitorMark competitor={c} className="h-4 w-4 rounded-[5px] text-[0.4rem]" />
                {c.name}
              </span>
            </div>

            <div className="relative h-8">
              <motion.span
                initial={false}
                animate={{ scaleX: on ? 1 : 0 }}
                transition={reduce ? { duration: 0 } : { duration: 1.1, ease: EASE, delay: 0.3 }}
                className="absolute inset-y-0 right-0 origin-left rounded-l-full bg-cta"
                style={{ left: `${100 / (2 * n)}%` }}
              />
              <motion.span
                initial={false}
                animate={{ opacity: on ? 1 : 0 }}
                transition={reduce ? { duration: 0 } : { duration: 0.4, delay: 0.45 }}
                className="absolute top-1/2 ml-1.5 flex -translate-y-1/2 items-center gap-1.5 rounded-md bg-white px-1.5 py-0.5 text-[0.72rem] font-medium text-cta"
                style={{ left: `${100 / (2 * n)}%` }}
              >
                <RankboxMark className="h-4 w-4 rounded-[5px]" />
                Rankbox
              </motion.span>
            </div>

            {/* One numbered tick per step, at its column's centre. */}
            <div
              className="grid pt-1"
              style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }}
            >
              {m.steps.map((s, i) => (
                <span key={s.title} className="flex justify-center">
                  <motion.span
                    initial={false}
                    animate={on ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.6 }}
                    transition={
                      reduce
                        ? { duration: 0 }
                        : { duration: 0.4, ease: EASE, delay: 0.5 + i * 0.25 }
                    }
                    className="flex h-6 w-6 items-center justify-center rounded-full border border-ink/[0.1] bg-white text-[0.72rem] font-semibold text-ink shadow-[0_1px_2px_rgba(16,24,40,0.05)]"
                  >
                    {i + 1}
                  </motion.span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </Band>

      <Band>
        <CellGrid className="md:grid-cols-3">
          {m.steps.map((s, i) => (
            <li key={s.title} className={cn(CELL, "p-6 sm:p-8")}>
              <Reveal delay={i * 0.06}>
                <span className="text-[0.75rem] font-semibold tabular-nums text-cta">
                  Step {i + 1}
                </span>
                <h3 className="mt-2 text-[1.05rem] font-semibold tracking-tight text-ink">
                  {s.title}
                </h3>
                <p className="mt-2 text-[0.88rem] leading-relaxed text-muted-foreground">
                  {s.body}
                </p>
              </Reveal>
            </li>
          ))}
        </CellGrid>
      </Band>
    </section>
  );
}
