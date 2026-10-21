/**
 * /features/citation-tracking's own layout, in the landing page's style.
 * /features/$slug renders it in place of the shared template (see LAYOUTS
 * there), so the URL, head, and every `/features/$slug` link stay as they
 * were. The copy is the feature's entry in data/features.ts, unchanged.
 *
 * The order follows what tracking is for: the hero, then the tracker itself
 * (four engines answering one prompt, a ledger recording each answer) with
 * the feature's facts as its legend; the blind spot it removes; the three
 * steps; what the numbers show; where it closes the engine's loop; then
 * pricing, FAQ, and the closing band. No testimonial block, as on the
 * landing since its redesign.
 */
import { MotionConfig } from "motion/react";
import { PricingBand } from "@/components/landing/PricingBand";
import { ExploreMore } from "@/components/ExploreMore";
import type { Feature } from "@/data/features";
import {
  TrackingBenefits,
  TrackingBlindSpot,
  TrackingCTA,
  TrackingFAQ,
  TrackingHero,
  TrackingLoop,
  TrackingShowcase,
  TrackingSteps,
} from "./sections";

export function CitationTrackingPage({ feature }: { feature: Feature }) {
  return (
    // Visitors who ask for reduced motion get transforms without movement.
    <MotionConfig reducedMotion="user">
      <TrackingHero feature={feature} />
      <TrackingShowcase feature={feature} />
      <TrackingBlindSpot feature={feature} />
      <TrackingSteps feature={feature} />
      <TrackingBenefits feature={feature} />
      <TrackingLoop feature={feature} />
      <ExploreMore path={`/features/${feature.slug}`} framed />
      <PricingBand />
      <TrackingFAQ feature={feature} />
      <TrackingCTA feature={feature} />
    </MotionConfig>
  );
}
