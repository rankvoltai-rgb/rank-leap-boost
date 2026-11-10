/**
 * /use-cases/new-websites's own layout, in the landing page's frame (white,
 * hairline rails the framed navbar starts, a hairline over every band). The
 * route renders it through LAYOUTS; the head and JSON-LD stay shared there.
 *
 * Ordered for someone about to launch a site with no traffic, links or
 * history: the launch board and the short answer, what a brand-new site
 * starts with, the first month as a runway (with Google's clock drawn apart
 * from ours), who does what and what nobody can rush, the two allowances for
 * a footprint off the domain, the free launch-day checks Rankbox itself
 * doesn't run, the four features, what it replaces beside the price, the
 * questions, the other situations, more to read, and the closing band.
 *
 * No testimonial block: there's no proof from new sites to show, and a quote
 * from another kind of customer is never borrowed.
 */
import { ExploreMore } from "@/components/ExploreMore";
import type { Persona } from "@/data/personas";
import { NewSitesHero, NewSitesShortAnswer } from "./hero";
import {
  NewSitesCTA,
  NewSitesFAQ,
  NewSitesHandoff,
  NewSitesKit,
  NewSitesOffsite,
  NewSitesOthers,
  NewSitesPains,
  NewSitesPicks,
  NewSitesRunway,
  NewSitesStackPrice,
} from "./sections";

export function NewWebsitesPage({ persona }: { persona: Persona }) {
  return (
    <>
      <NewSitesHero persona={persona} />
      <NewSitesShortAnswer persona={persona} />
      <NewSitesPains persona={persona} />
      <NewSitesRunway persona={persona} />
      <NewSitesHandoff persona={persona} />
      <NewSitesOffsite />
      <NewSitesKit />
      <NewSitesPicks persona={persona} />
      <NewSitesStackPrice persona={persona} />
      <NewSitesFAQ persona={persona} />
      <NewSitesOthers persona={persona} />
      <ExploreMore
        path={`/use-cases/${persona.slug}`}
        exclude={persona.picks.map((p) => `/features/${p.featureSlug}`)}
        framed
      />
      <NewSitesCTA persona={persona} />
    </>
  );
}
