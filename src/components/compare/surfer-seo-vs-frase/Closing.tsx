/**
 * The closing band: blue inside the rails, the dithered mark in white behind
 * it, one ask (paste a URL and see what Rankbox would write), and the trial
 * terms under the form. A white band closes the frame above the footer.
 */
import { useState } from "react";
import { Band, Spacer } from "@/components/landing/frame";
import { Reveal } from "@/components/landing/shared";
import { UrlForm } from "@/components/landing/Hero";
import { MarkDither } from "@/components/landing/hero-dither";
import { TRIAL_NOTE } from "@/components/features/FeatureSections";
import { RANKBOX_PRICE_LINE } from "@/data/compare/matchups";

export function Closing() {
  const [url, setUrl] = useState("");
  return (
    <section aria-labelledby="sf-cta-title">
      <Spacer />
      <Band inner="overflow-hidden bg-cta">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.16] [mask-image:radial-gradient(ellipse_70%_80%_at_50%_50%,#000_40%,transparent_100%)]"
        >
          <MarkDither className="text-white" />
        </div>
        <Reveal className="relative mx-auto flex max-w-2xl flex-col items-center px-5 py-16 text-center sm:px-8 sm:py-20">
          <h2
            id="sf-cta-title"
            className="text-balance font-display text-[2rem] font-medium leading-[1.1] tracking-[-0.03em] text-white sm:text-[2.6rem]"
          >
            Rather have the articles than another tool to run?
          </h2>
          <p className="mt-4 max-w-xl text-balance text-[1rem] leading-relaxed text-white sm:text-[1.05rem]">
            Paste your URL. Rankbox reads your site and shows the content gaps, the competitors
            you&rsquo;re up against, and the topics it would write first.
          </p>
          <div className="mt-8 flex w-full justify-center">
            <UrlForm url={url} onChange={setUrl} />
          </div>
          <p className="mt-4 text-[0.82rem] text-white">
            {TRIAL_NOTE} · {RANKBOX_PRICE_LINE}
          </p>
        </Reveal>
      </Band>
      <Spacer closing />
    </section>
  );
}
