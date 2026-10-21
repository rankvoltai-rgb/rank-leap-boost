/**
 * /features/brand-voice's own layout, in the landing page's style.
 * /features/$slug renders it in place of the shared template (see LAYOUTS
 * there), so the URL, head, and every `/features/$slug` link stay as they
 * were. The copy is the feature's entry in data/features.ts, unchanged.
 *
 * The order follows the feature's story rather than a template: the promise,
 * then the voice at work (a generic paragraph turning into yours), the
 * generic-AI habits it replaces line by line, how you set it up, what it
 * gives you, and where it sits in the engine; then the questions, the price,
 * and the closing band. No testimonial block, as on the landing since its
 * redesign.
 */
import { PricingBand } from "@/components/landing/PricingBand";
import { ExploreMore } from "@/components/ExploreMore";
import type { Feature } from "@/data/features";
import {
  BrandVoiceBenefits,
  BrandVoiceCTA,
  BrandVoiceFAQ,
  BrandVoiceFit,
  BrandVoiceHero,
  BrandVoiceProblem,
  BrandVoiceShowcase,
  BrandVoiceSteps,
} from "./sections";

export function BrandVoicePage({ feature }: { feature: Feature }) {
  return (
    <>
      <BrandVoiceHero feature={feature} />
      <BrandVoiceShowcase feature={feature} />
      <BrandVoiceProblem feature={feature} />
      <BrandVoiceSteps feature={feature} />
      <BrandVoiceBenefits feature={feature} />
      <BrandVoiceFit feature={feature} />
      <ExploreMore path={`/features/${feature.slug}`} framed />
      <BrandVoiceFAQ feature={feature} />
      <PricingBand />
      <BrandVoiceCTA feature={feature} />
    </>
  );
}
