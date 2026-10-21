/**
 * /features/authority-backlinks's own layout, in the landing page's frame.
 * /features/$slug renders it in place of the shared template (see LAYOUTS
 * there), so the URL, head, and every `/features/$slug` link stay as they
 * were. The copy is the feature's entry in data/features.ts, unchanged.
 *
 * The order follows how the backlink exchange is understood: the promise,
 * then one link followed from match to verified live (the focal picture, on
 * graph paper) with the four facts under it; why authority matters, as a
 * row-for-row swap of old habits; how the exchange works; what makes a link
 * count; the trust questions; pricing; how it feeds the rest of Rankbox; and
 * the closing band. No testimonial block, as on the landing since its
 * redesign.
 */
import { PricingBand } from "@/components/landing/PricingBand";
import { ExploreMore } from "@/components/ExploreMore";
import type { Feature } from "@/data/features";
import {
  BacklinksBenefits,
  BacklinksConnects,
  BacklinksCTA,
  BacklinksFAQ,
  BacklinksHero,
  BacklinksProblem,
  BacklinksRelay,
  BacklinksSteps,
} from "./sections";

export function AuthorityBacklinksPage({ feature }: { feature: Feature }) {
  return (
    <>
      <BacklinksHero feature={feature} />
      <BacklinksRelay feature={feature} />
      <BacklinksProblem feature={feature} />
      <BacklinksSteps feature={feature} />
      <BacklinksBenefits feature={feature} />
      <BacklinksFAQ feature={feature} />
      <PricingBand />
      <BacklinksConnects feature={feature} />
      <ExploreMore path={`/features/${feature.slug}`} framed />
      <BacklinksCTA feature={feature} />
    </>
  );
}
