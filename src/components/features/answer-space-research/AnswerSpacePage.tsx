/**
 * /features/answer-space-research's own layout, in the landing page's style.
 * /features/$slug renders it in place of the shared template (see LAYOUTS
 * there), so the URL, head, and every `/features/$slug` link stay as they
 * were. The copy is the feature's entry in data/features.ts, unchanged.
 *
 * The order follows the landing: hero and facts, the product on the painted
 * sky, then why it matters, what's inside, how it works, where it sits in the
 * engine, pricing, FAQ, and the closing band. No testimonial block, as on the
 * landing since its redesign.
 */
import { PricingBand } from "@/components/landing/PricingBand";
import { ExploreMore } from "@/components/ExploreMore";
import type { Feature } from "@/data/features";
import {
  AnswerSpaceBenefits,
  AnswerSpaceCTA,
  AnswerSpaceEngine,
  AnswerSpaceFAQ,
  AnswerSpaceHero,
  AnswerSpaceProblem,
  AnswerSpaceShowcase,
  AnswerSpaceSteps,
} from "./sections";

export function AnswerSpacePage({ feature }: { feature: Feature }) {
  return (
    <>
      <AnswerSpaceHero feature={feature} />
      <AnswerSpaceShowcase feature={feature} />
      <AnswerSpaceProblem feature={feature} />
      <AnswerSpaceBenefits feature={feature} />
      <AnswerSpaceSteps feature={feature} />
      <AnswerSpaceEngine feature={feature} />
      <ExploreMore path={`/features/${feature.slug}`} framed />
      <PricingBand />
      <AnswerSpaceFAQ feature={feature} />
      <AnswerSpaceCTA feature={feature} />
    </>
  );
}
