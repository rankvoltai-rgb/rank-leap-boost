/**
 * /features/auto-publishing's own layout. /features/$slug renders it in place
 * of the shared template (see LAYOUTS there), so the URL, head, and every
 * `/features/$slug` link across the site stay exactly as they were.
 */
import { MotionConfig } from "motion/react";
import { Pricing } from "@/components/landing/Pricing";
import {
  FeatureHero,
  FeatureSpecs,
  FeatureBenefits,
  FeatureHowItWorks,
  FeatureEngine,
  FeatureFAQ,
  FeatureCTA,
} from "@/components/features/FeatureSections";
import { ExploreMore } from "@/components/ExploreMore";
import type { Feature } from "@/data/features";
import { PublishingAnswer, PublishingDestinations, PublishingPayload } from "./PublishingSections";

/* The order answers the buyer's questions as they come up: what is it, where
   can it publish, what exactly lands, what keeps it safe, how to start. No
   testimonial block: the page makes no claim it can't back. Reduced motion
   is honored for every reveal on the page. */
export function AutoPublishingPage({ feature }: { feature: Feature }) {
  return (
    <MotionConfig reducedMotion="user">
      <FeatureHero feature={feature} trust={false} />
      <PublishingAnswer />
      <FeatureSpecs feature={feature} />
      <PublishingDestinations />
      <PublishingPayload />
      <FeatureBenefits feature={feature} />
      <FeatureHowItWorks feature={feature} />
      <FeatureEngine feature={feature} />
      <ExploreMore path={`/features/${feature.slug}`} />
      <div className="border-t border-border bg-surface/40">
        <Pricing />
      </div>
      <FeatureFAQ feature={feature} />
      <FeatureCTA feature={feature} />
    </MotionConfig>
  );
}
