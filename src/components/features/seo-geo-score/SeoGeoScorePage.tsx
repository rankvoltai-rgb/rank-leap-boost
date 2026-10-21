/**
 * /features/seo-geo-score's own layout, in the landing page's style.
 * /features/$slug renders it in place of the shared template (see LAYOUTS
 * there), so the URL, head, and every `/features/$slug` link stay as they
 * were. The copy is the feature's entry in data/features.ts, unchanged.
 *
 * The page reads like a proof being checked. A split hero (the promise on
 * the left, the four facts ruled down the right), then the draft on the
 * proofing table being scored and fixed. Then the problem as a search box
 * split in half, what the score gives you as a bento, the line from writer
 * to gate to publishing (the steps and the engine in one), and the FAQ
 * before pricing, since "what's GEO?" is the question most visitors bring.
 * It closes on blue with every article's score in a list. No testimonial
 * block, as on the landing since its redesign.
 */
import { PricingBand } from "@/components/landing/PricingBand";
import { ExploreMore } from "@/components/ExploreMore";
import type { Feature } from "@/data/features";
import {
  ScoreBenefits,
  ScoreCTA,
  ScoreDeskBand,
  ScoreFAQ,
  ScoreGate,
  ScoreHero,
  ScoreProblem,
} from "./sections";

export function SeoGeoScorePage({ feature }: { feature: Feature }) {
  return (
    <>
      <ScoreHero feature={feature} />
      <ScoreDeskBand feature={feature} />
      <ScoreProblem feature={feature} />
      <ScoreBenefits feature={feature} />
      <ScoreGate feature={feature} />
      <ScoreFAQ feature={feature} />
      <PricingBand />
      <ExploreMore path={`/features/${feature.slug}`} framed />
      <ScoreCTA feature={feature} />
    </>
  );
}
