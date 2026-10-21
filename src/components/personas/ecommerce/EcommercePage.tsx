/**
 * /use-cases/ecommerce's own layout, in the landing page's style. The route
 * renders it through its LAYOUTS map, so the URL, head, and JSON-LD stay as
 * they were; every word comes from the `ecommerce` entry in data/personas.ts.
 *
 * The order follows a store owner's questions: what is it (the hero, a
 * shopper's question answered on the store's own blog), what would it write
 * for a shop like mine (the sample map, early and large), will it touch my
 * store (the boundary), why the blog stalled, how setup goes, which parts do
 * the work, what it replaces, then pricing, FAQ, the other use cases, and the
 * closing band. No testimonial block, as on the landing since its redesign.
 */
import { PricingBand } from "@/components/landing/PricingBand";
import { ExploreMore } from "@/components/ExploreMore";
import type { Persona } from "@/data/personas";
import {
  EcommerceBoundary,
  EcommerceCTA,
  EcommerceFAQ,
  EcommerceHero,
  EcommerceOtherSeats,
  EcommercePains,
  EcommercePicks,
  EcommerceShortAnswer,
  EcommerceStack,
  EcommerceTopics,
  EcommerceWorkflow,
} from "./sections";

export function EcommercePage({ persona }: { persona: Persona }) {
  return (
    <>
      <EcommerceHero persona={persona} />
      <EcommerceShortAnswer persona={persona} />
      <EcommerceTopics persona={persona} />
      <EcommerceBoundary persona={persona} />
      <EcommercePains persona={persona} />
      <EcommerceWorkflow persona={persona} />
      <EcommercePicks persona={persona} />
      <EcommerceStack persona={persona} />
      <PricingBand />
      <EcommerceFAQ persona={persona} />
      <EcommerceOtherSeats persona={persona} />
      <ExploreMore
        path={`/use-cases/${persona.slug}`}
        exclude={persona.picks.map((p) => `/features/${p.featureSlug}`)}
        framed
      />
      <EcommerceCTA persona={persona} />
    </>
  );
}
