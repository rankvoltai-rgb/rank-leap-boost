/**
 * /use-cases/losing-traffic-to-ai-overviews's own layout, in the landing
 * page's frame. The route renders it through LAYOUTS; the head and JSON-LD
 * stay shared there, read from the page's data file.
 *
 * Ordered for someone looking at a clicks line that fell while the rankings
 * held: the hero names what happened (the answer moved above their link) and
 * shows it on a sample results page, then the short answer, what the studies
 * say, the drop as symptoms, the parts of Rankbox aimed at being quoted, the
 * first month with who does each step, who keeps what (ending on where the
 * result is measured, since Rankbox doesn't measure it), what it takes off
 * the recovery plan beside what it doesn't replace, the price, the
 * questions, further links, and the closing band.
 *
 * No testimonial block: the page has no proof of its own to show. Keep
 * exploring leaves out the picks and anything unshipped (see explore.ts).
 */
import { ExploreMore } from "@/components/ExploreMore";
import type { Persona } from "@/data/personas";
import { exploreExclude } from "./explore";
import { LosingTrafficHero, LosingTrafficShortAnswer } from "./hero";
import {
  LosingTrafficCTA,
  LosingTrafficEvidence,
  LosingTrafficFAQ,
  LosingTrafficHandoff,
  LosingTrafficMonth,
  LosingTrafficPains,
  LosingTrafficPicks,
  LosingTrafficPrice,
  LosingTrafficStack,
} from "./sections";

export function LosingTrafficPage({ persona }: { persona: Persona }) {
  return (
    <>
      <LosingTrafficHero persona={persona} />
      <LosingTrafficShortAnswer persona={persona} />
      <LosingTrafficEvidence />
      <LosingTrafficPains persona={persona} />
      <LosingTrafficPicks persona={persona} />
      <LosingTrafficMonth persona={persona} />
      <LosingTrafficHandoff persona={persona} />
      <LosingTrafficStack persona={persona} />
      <LosingTrafficPrice />
      <LosingTrafficFAQ persona={persona} />
      <ExploreMore path={`/use-cases/${persona.slug}`} exclude={exploreExclude(persona)} framed />
      <LosingTrafficCTA persona={persona} />
    </>
  );
}
