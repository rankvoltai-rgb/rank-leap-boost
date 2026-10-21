/**
 * /features/citation-ready-writer's own layout, in the landing page's style.
 * /features/$slug renders it in place of the shared template (see LAYOUTS
 * there), so the URL, head, and every `/features/$slug` link stay as they
 * were. The copy is the feature's entry in data/features.ts, unchanged.
 *
 * The order follows the writer's story: the promise, then a draft being
 * written live with its spec sheet, what every draft carries, how that
 * differs from a generic AI draft, the three steps from topic to draft, the
 * questions people ask before their first one, then where drafts come from
 * and go, more to read, pricing, and the closing band. No testimonial block,
 * as on the landing since its redesign.
 */
import { PricingBand } from "@/components/landing/PricingBand";
import { ExploreMore } from "@/components/ExploreMore";
import type { Feature } from "@/data/features";
import {
  WriterBenefits,
  WriterConnects,
  WriterCTA,
  WriterFAQ,
  WriterHero,
  WriterProblem,
  WriterShowcase,
  WriterSteps,
} from "./sections";

export function CitationWriterPage({ feature }: { feature: Feature }) {
  return (
    <>
      <WriterHero feature={feature} />
      <WriterShowcase feature={feature} />
      <WriterBenefits feature={feature} />
      <WriterProblem feature={feature} />
      <WriterSteps feature={feature} />
      <WriterFAQ feature={feature} />
      <WriterConnects feature={feature} />
      <ExploreMore path={`/features/${feature.slug}`} framed />
      <PricingBand />
      <WriterCTA feature={feature} />
    </>
  );
}
