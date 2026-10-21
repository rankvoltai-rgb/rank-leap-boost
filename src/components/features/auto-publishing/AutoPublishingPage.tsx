/**
 * /features/auto-publishing's own layout, in the landing page's frame.
 * /features/$slug renders it in place of the shared template (see LAYOUTS
 * there), so the URL, head, and every `/features/$slug` link stay exactly as
 * they were.
 *
 * The order answers the buyer's questions as they come up: what it does (the
 * handoff, running), what it is in one paragraph, where it can publish, what
 * exactly lands, what keeps it safe, how to start, and where it sits in the
 * engine. No testimonial block: the page makes no claim it can't back.
 * Reduced motion is honored for every reveal on the page.
 */
import { MotionConfig } from "motion/react";
import { PricingBand } from "@/components/landing/PricingBand";
import { ExploreMore } from "@/components/ExploreMore";
import type { Feature } from "@/data/features";
import { PublishingAnswer, PublishingDestinations, PublishingPayload } from "./PublishingSections";
import {
  PublishingCTA,
  PublishingEngine,
  PublishingFAQ,
  PublishingHero,
  PublishingRules,
  PublishingShowcase,
  PublishingSteps,
} from "./page-sections";

export function AutoPublishingPage({ feature }: { feature: Feature }) {
  return (
    <MotionConfig reducedMotion="user">
      <PublishingHero feature={feature} />
      <PublishingShowcase feature={feature} />
      <PublishingAnswer />
      <PublishingDestinations />
      <PublishingPayload />
      <PublishingRules feature={feature} />
      <PublishingSteps feature={feature} />
      <PublishingEngine feature={feature} />
      <ExploreMore path={`/features/${feature.slug}`} framed />
      <PricingBand />
      <PublishingFAQ feature={feature} />
      <PublishingCTA feature={feature} />
    </MotionConfig>
  );
}
