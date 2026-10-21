/**
 * /use-cases/saas's own layout, in the landing page's frame (white, hairline
 * rails the framed navbar starts, a hairline over every band). The route
 * renders it through LAYOUTS; the head and JSON-LD stay shared there.
 *
 * Ordered for a product team deciding whether content can run without a
 * content hire: the shipping scene and the short answer, why content keeps
 * slipping (as a diff), the sample topic map at the centre, who owns what,
 * how it rolls out across a week, the parts that matter in a crowded
 * category, what it replaces on the budget straight into the price, then the
 * questions, the other use cases, and the closing band.
 *
 * No testimonial block: the landing dropped them, and this page has no proof
 * of its own to show.
 */
import { PricingBand } from "@/components/landing/PricingBand";
import { ExploreMore } from "@/components/ExploreMore";
import type { Persona } from "@/data/personas";
import { SaasHero, SaasShortAnswer } from "./hero";
import { SaasTopicMap } from "./topic-map";
import {
  SaasCTA,
  SaasFAQ,
  SaasOtherUseCases,
  SaasOwnership,
  SaasPains,
  SaasPicks,
  SaasStack,
  SaasWeek,
} from "./sections";

export function SaasPage({ persona }: { persona: Persona }) {
  return (
    <>
      <SaasHero persona={persona} />
      <SaasShortAnswer persona={persona} />
      <SaasPains persona={persona} />
      <SaasTopicMap persona={persona} />
      <SaasOwnership persona={persona} />
      <SaasWeek persona={persona} />
      <SaasPicks persona={persona} />
      <SaasStack persona={persona} />
      <PricingBand />
      <SaasFAQ persona={persona} />
      <SaasOtherUseCases persona={persona} />
      <ExploreMore
        path={`/use-cases/${persona.slug}`}
        exclude={persona.picks.map((p) => `/features/${p.featureSlug}`)}
        framed
      />
      <SaasCTA persona={persona} />
    </>
  );
}
