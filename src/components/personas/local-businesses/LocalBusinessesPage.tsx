/**
 * /use-cases/local-businesses's own layout, in the landing page's style.
 * /use-cases/$slug renders it through LAYOUTS, so the URL, head and JSON-LD
 * stay the route's. The copy is the persona's entry in data/personas.ts.
 *
 * The order is the owner's: their working day with the post going out at
 * nine, the paragraph that says what this is, what it would write for a shop
 * like theirs, why the site went quiet, how little time it asks, what stays
 * theirs, what they don't have to hire, the four features that matter, then
 * the other use cases, pricing, questions, and the closing band. No
 * testimonial block, as on the landing since its redesign.
 */
import { PricingBand } from "@/components/landing/PricingBand";
import { ExploreMore } from "@/components/ExploreMore";
import type { Persona } from "@/data/personas";
import {
  LocalCTA,
  LocalFAQ,
  LocalHandoff,
  LocalHero,
  LocalOtherPages,
  LocalPains,
  LocalPicks,
  LocalShortAnswer,
  LocalStack,
  LocalTopics,
  LocalWorkflow,
} from "./sections";

export function LocalBusinessesPage({ persona }: { persona: Persona }) {
  return (
    <>
      <LocalHero persona={persona} />
      <LocalShortAnswer persona={persona} />
      <LocalTopics persona={persona} />
      <LocalPains persona={persona} />
      <LocalWorkflow persona={persona} />
      <LocalHandoff persona={persona} />
      <LocalStack persona={persona} />
      <LocalPicks persona={persona} />
      <LocalOtherPages persona={persona} />
      <ExploreMore
        path={`/use-cases/${persona.slug}`}
        exclude={persona.picks.map((p) => `/features/${p.featureSlug}`)}
        framed
      />
      <PricingBand />
      <LocalFAQ persona={persona} />
      <LocalCTA persona={persona} />
    </>
  );
}
