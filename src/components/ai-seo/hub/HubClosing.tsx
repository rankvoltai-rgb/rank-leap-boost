/**
 * The hub's last band: blue inside the rails, all eleven engine marks in a
 * row (the hub's own motif), the promise in white and the white trial
 * button, which only ever appears on this band. Rankbox is described by what
 * it does: research, writing, scoring, publishing. Nothing here implies it
 * tracks citations.
 */
import { MarkDither } from "@/components/landing/hero-dither";
import { Reveal } from "@/components/landing/shared";
import { EngineMark } from "@/components/ai-seo/kit";
import { Band, Spacer } from "@/components/landing/frame";
import { ENGINES } from "@/data/ai-seo/engines";
import { OVERVIEW } from "@/data/ai-seo/overview";
import { TrialButton } from "./shared";

export function HubClosing() {
  return (
    <section aria-labelledby="hub-cta-title">
      <Spacer />
      <Band inner="overflow-hidden bg-cta">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.14] [mask-image:radial-gradient(ellipse_70%_80%_at_50%_45%,#000_40%,transparent_100%)]"
        >
          <MarkDither className="text-white" />
        </div>
        <Reveal className="relative mx-auto flex max-w-2xl flex-col items-center px-5 py-16 text-center sm:px-8 sm:py-20">
          <ul aria-hidden className="flex flex-wrap justify-center gap-1.5">
            {ENGINES.map((e) => (
              <li
                key={e.slug}
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-white shadow-[0_1px_2px_rgba(4,24,72,0.2)]"
              >
                <EngineMark mark={e.mark} className="h-4 w-4" />
              </li>
            ))}
          </ul>
          <h2
            id="hub-cta-title"
            className="mt-7 text-balance font-display text-[2rem] font-medium leading-[1.1] tracking-[-0.03em] text-white sm:text-[2.6rem]"
          >
            {OVERVIEW.cta.title}
          </h2>
          <p className="mt-4 max-w-xl text-balance text-[1rem] leading-relaxed text-white/90 sm:text-[1.05rem]">
            {OVERVIEW.cta.body}
          </p>
          <TrialButton onBlue className="mt-8 sm:items-center" />
        </Reveal>
      </Band>
      <Spacer closing />
    </section>
  );
}
