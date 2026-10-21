/**
 * /use-cases/solo-founders's own layout, in the landing page's style. The
 * persona route renders it through its LAYOUTS map, so the URL, head and
 * JSON-LD stay shared; the copy is the page's entry in data/personas.ts,
 * unchanged.
 *
 * Its focal picture is the founder's own code editor, with Rankbox working
 * in the corner of the screen (editor-scene.tsx), and the band under it
 * reads that picture out as the split between what runs itself and what
 * stays the founder's. No testimonial block, as on the landing since its
 * redesign.
 */
import { PricingBand } from "@/components/landing/PricingBand";
import { ExploreMore } from "@/components/ExploreMore";
import type { Persona } from "@/data/personas";
import {
  FounderCTA,
  FounderDesk,
  FounderFAQ,
  FounderFirstWeek,
  FounderHero,
  FounderOtherSeats,
  FounderPicks,
  FounderPostMortem,
  FounderShortVersion,
  FounderStack,
} from "./sections";

export function SoloFoundersPage({ persona }: { persona: Persona }) {
  return (
    <>
      <FounderHero persona={persona} />
      <FounderDesk persona={persona} />
      <FounderShortVersion persona={persona} />
      <FounderPostMortem persona={persona} />
      <FounderFirstWeek persona={persona} />
      <FounderStack persona={persona} />
      <FounderPicks persona={persona} />
      <PricingBand />
      <FounderFAQ persona={persona} />
      <FounderOtherSeats persona={persona} />
      <ExploreMore
        path={`/use-cases/${persona.slug}`}
        exclude={persona.picks.map((p) => `/features/${p.featureSlug}`)}
        framed
      />
      <FounderCTA persona={persona} />
    </>
  );
}
