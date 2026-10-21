/**
 * /use-cases/seo-agencies's own layout, in the landing page's style. The
 * persona route renders it through LAYOUTS, so the URL, head and JSON-LD
 * stay as they were; all copy is the persona's entry in data/personas.ts.
 *
 * Arranged for an agency reading it: a split hero with the client book
 * (client-deck.tsx) beside the promise and the facts under it, then what it
 * does per client and who keeps what, the calls it answers, onboarding an
 * account, the parts that repeat across a book, what comes off the delivery
 * cost, pricing, questions, the other seats, and the closing band. No
 * testimonial block, as on the landing since its redesign.
 */
import { PricingBand } from "@/components/landing/PricingBand";
import { ExploreMore } from "@/components/ExploreMore";
import type { Persona } from "@/data/personas";
import {
  AgencyBrief,
  AgencyCTA,
  AgencyCalls,
  AgencyCost,
  AgencyFAQ,
  AgencyHero,
  AgencyOnboarding,
  AgencyOtherSeats,
  AgencyPicks,
} from "./sections";

export function SeoAgenciesPage({ persona }: { persona: Persona }) {
  return (
    <>
      <AgencyHero persona={persona} />
      <AgencyBrief persona={persona} />
      <AgencyCalls persona={persona} />
      <AgencyOnboarding persona={persona} />
      <AgencyPicks persona={persona} />
      <AgencyCost persona={persona} />
      <PricingBand />
      <AgencyFAQ persona={persona} />
      <AgencyOtherSeats persona={persona} />
      <ExploreMore
        path={`/use-cases/${persona.slug}`}
        exclude={persona.picks.map((p) => `/features/${p.featureSlug}`)}
        framed
      />
      <AgencyCTA persona={persona} />
    </>
  );
}
