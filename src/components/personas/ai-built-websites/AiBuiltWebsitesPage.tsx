/**
 * /use-cases/ai-built-websites's own layout, in the landing page's frame. The
 * route renders it through LAYOUTS; the head and JSON-LD stay shared there,
 * and every word is the page's data file (src/data/persona-pages/
 * ai-built-websites.ts).
 *
 * Ordered for someone whose site came out of an AI builder: the hero with the
 * builder's window beside what a crawler gets, the short answer as a chat
 * reply, then the check that decides whether any article counts (rendering),
 * what the builder didn't build, how Rankbox works from the builder's chat
 * and through the API, the four steps across the two places, who does what,
 * the four features, what it replaces beside the price, the questions, the
 * sources behind the page's facts, the other situations, and the closing
 * band.
 *
 * No testimonial block: this page has no proof of its own to show.
 */
import { ExploreMore } from "@/components/ExploreMore";
import type { Persona } from "@/data/personas";
import { AiBuiltHero, AiBuiltShortAnswer } from "./hero";
import {
  AiBuiltCTA,
  AiBuiltFAQ,
  AiBuiltHandoff,
  AiBuiltLanes,
  AiBuiltOthers,
  AiBuiltPains,
  AiBuiltPicks,
  AiBuiltRendering,
  AiBuiltSources,
  AiBuiltStackPrice,
  AiBuiltTools,
} from "./sections";

export function AiBuiltWebsitesPage({ persona }: { persona: Persona }) {
  return (
    <>
      <AiBuiltHero persona={persona} />
      <AiBuiltShortAnswer persona={persona} />
      <AiBuiltRendering />
      <AiBuiltPains persona={persona} />
      <AiBuiltTools />
      <AiBuiltLanes persona={persona} />
      <AiBuiltHandoff persona={persona} />
      <AiBuiltPicks persona={persona} />
      <AiBuiltStackPrice persona={persona} />
      <AiBuiltFAQ persona={persona} />
      <AiBuiltSources />
      <AiBuiltOthers persona={persona} />
      <ExploreMore
        path={`/use-cases/${persona.slug}`}
        exclude={persona.picks.map((p) => `/features/${p.featureSlug}`)}
        framed
      />
      <AiBuiltCTA persona={persona} />
    </>
  );
}
