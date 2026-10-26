/**
 * The closing band: blue, inside the rails, the ask beside the URL field.
 * Faint white rungs echo the price ladder. The trial takes a card, so the
 * note under the form is TRIAL_NOTE and nothing about cards.
 */
import { useState } from "react";
import { Band, Spacer } from "@/components/landing/frame";
import { UrlForm } from "@/components/landing/Hero";
import { TRIAL_NOTE } from "@/components/features/FeatureSections";

export function ClosingCta() {
  const [url, setUrl] = useState("");
  return (
    <section aria-labelledby="sva-cta-title">
      <Spacer />
      <Band inner="overflow-hidden bg-cta">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.09)_1px,transparent_1px)] bg-[size:100%_40px] [mask-image:linear-gradient(to_right,transparent_25%,#000_100%)]"
        />
        <div className="relative grid gap-9 px-6 py-14 sm:px-10 sm:py-16 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:gap-14 lg:px-12 lg:py-20">
          <div>
            <h2
              id="sva-cta-title"
              className="text-balance font-display text-[2rem] font-medium leading-[1.1] tracking-[-0.03em] text-white sm:text-[2.6rem]"
            >
              Rather have the articles than another tool?
            </h2>
            <p className="mt-4 max-w-lg text-[1rem] leading-relaxed text-white sm:text-[1.05rem]">
              Paste your URL. Rankbox reads your site and shows the content gaps, the competitors
              you&rsquo;re up against, and the topics it would write first.
            </p>
          </div>
          <div>
            <UrlForm url={url} onChange={setUrl} />
            <p className="mt-3.5 text-[0.86rem] text-white">{TRIAL_NOTE}</p>
          </div>
        </div>
      </Band>
      <Spacer closing />
    </section>
  );
}
