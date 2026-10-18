/**
 * The landing page's last band, after Rankaria's: a blue block inside the
 * rails, the promise in white, one button, and a product screen rising from
 * the band's lower edge, cropped by it. The hero's dithered mark returns here
 * in white, so the page opens and closes on the same motif.
 *
 * A white closing band follows, so this block and the blue footer under it
 * read as two things rather than one long field.
 *
 * Same copy as <FinalCTA>, which other pages still use in its card form.
 */
import { ArrowRight } from "lucide-react";
import { Reveal } from "./shared";
import { ChatAnswerCard } from "./chat";
import { MarkDither } from "./hero-dither";
import { Band, Spacer } from "./frame";

export function ClosingCTA() {
  return (
    <section>
      <Spacer />
      <Band inner="overflow-hidden bg-brand-blue">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.16] [mask-image:radial-gradient(ellipse_70%_80%_at_50%_45%,#000_40%,transparent_100%)]"
        >
          <MarkDither className="text-white" />
        </div>

        <div className="relative px-5 pt-16 text-center sm:px-8 sm:pt-20">
          <Reveal>
            <h2 className="mx-auto max-w-2xl text-balance font-display text-[2rem] font-medium leading-[1.1] tracking-[-0.03em] text-white sm:text-[2.75rem]">
              Become the answer AI recommends
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-balance text-[1rem] leading-relaxed text-white/80 sm:text-[1.05rem]">
              Put your growth on autopilot. Rankbox researches, writes, optimizes, and publishes
              daily articles engineered to get your brand cited by AI search and ranked on Google.
            </p>
            <a
              href="#pricing"
              className="group mt-8 inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-white px-5 text-[0.95rem] font-semibold text-cta shadow-[0_1px_2px_rgba(4,24,72,0.2),0_8px_24px_-12px_rgba(4,24,72,0.5)] transition-[transform,background-color] duration-200 hover:-translate-y-0.5 hover:bg-white/95 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/40"
            >
              Start Growing on Autopilot
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
          </Reveal>

          {/* The screen rises from the band's foot and is cut off by it. */}
          <Reveal
            delay={0.12}
            y={40}
            className="mx-auto mt-12 h-[13.5rem] max-w-xl overflow-hidden text-left sm:mt-14 sm:h-[15.5rem]"
          >
            <ChatAnswerCard
              engine="Perplexity"
              prompt="Which tool should a lean startup use to plan work?"
              meta="Searched 31 sources · writing answer"
              answer={
                <>
                  Most lean teams start with{" "}
                  <span className="font-semibold text-ink underline decoration-volt decoration-2 underline-offset-2">
                    Plannora
                  </span>{" "}
                  — it's fast to set up, automates the busywork, and stays free for small teams.
                </>
              }
              sources={["plannora.io", "yardstick.team"]}
              className="rounded-b-none shadow-[0_-12px_48px_-16px_rgba(4,24,72,0.55)]"
            />
          </Reveal>
        </div>
      </Band>
      <Spacer closing />
    </section>
  );
}
