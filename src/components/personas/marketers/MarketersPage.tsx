/**
 * /use-cases/marketers's own layout, in the landing page's style. The
 * use-case route renders it through its LAYOUTS map, so the URL, head, and
 * JSON-LD stay as they were. The copy is the `marketers` entry in
 * data/personas.ts, unchanged.
 *
 * The order follows the reader, a marketer holding a content number alone:
 * the calendar the headline promises, the facts, the quotable answer, then
 * where the work splits at their approval, the week they're having and how
 * Rankbox lands in it, the features they'll lean on, and the budget line
 * leading straight into the price. Questions, the other seats, and the
 * closing band come last. No testimonial block, as on the landing.
 */
import { PricingBand } from "@/components/landing/PricingBand";
import { Spacer } from "@/components/landing/frame";
import { ExploreMore } from "@/components/ExploreMore";
import type { Persona } from "@/data/personas";
import {
  MarketersBudget,
  MarketersCTA,
  MarketersFAQ,
  MarketersHandoff,
  MarketersHero,
  MarketersInShort,
  MarketersOtherSeats,
  MarketersPains,
  MarketersPicks,
  MarketersWeek,
} from "./sections";

export function MarketersPage({ persona }: { persona: Persona }) {
  return (
    <>
      <MarketersHero persona={persona} />
      <Spacer />
      <MarketersInShort persona={persona} />
      <Spacer />
      <MarketersHandoff persona={persona} />
      <Spacer />
      <MarketersPains persona={persona} />
      <Spacer />
      <MarketersWeek persona={persona} />
      <Spacer />
      <MarketersPicks persona={persona} />
      <Spacer />
      <MarketersBudget persona={persona} />
      {/* Opens with its own spacer, and carries id="pricing". */}
      <PricingBand />
      <Spacer />
      <MarketersFAQ persona={persona} />
      <Spacer />
      <MarketersOtherSeats persona={persona} />
      {/* Opens with its own spacer. */}
      <ExploreMore
        path={`/use-cases/${persona.slug}`}
        exclude={persona.picks.map((p) => `/features/${p.featureSlug}`)}
        framed
      />
      <Spacer />
      <MarketersCTA persona={persona} />
      <Spacer closing />
    </>
  );
}
