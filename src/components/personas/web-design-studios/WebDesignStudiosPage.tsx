/**
 * /use-cases/web-design-studios's own layout, in the landing page's frame.
 * The route renders it through LAYOUTS, so the URL, head and JSON-LD stay
 * shared; every word is in src/data/persona-pages/web-design-studios.ts.
 *
 * Arranged for a studio owner whose revenue stops at launch: a centred
 * promise over the client roster (roster-scene.tsx, builds turning into
 * retainers), the facts, the quotable answer beside what it doesn't do, why
 * the work stops at launch (with The Admin Bar's survey figure), a client's
 * blog drawn as a sitemap (sitemap.tsx) and the CMSs it lands in, the
 * retainer's scope of work, where it sits in a project, the four features,
 * the cost side with a per-site price block, the white-label pages, the
 * questions, more to read, and the closing band. The call to action is the
 * Studio sign-up throughout. No testimonials: none exist for this seat.
 */
import { ExploreMore } from "@/components/ExploreMore";
import type { Persona } from "@/data/personas";
import {
  StudiosCTA,
  StudiosCost,
  StudiosFAQ,
  StudiosHero,
  StudiosInShort,
  StudiosPains,
  StudiosPicks,
  StudiosScope,
  StudiosTopics,
  StudiosWhiteLabel,
  StudiosWorkflow,
} from "./sections";

export function WebDesignStudiosPage({ persona }: { persona: Persona }) {
  return (
    <>
      <StudiosHero persona={persona} />
      <StudiosInShort persona={persona} />
      <StudiosPains persona={persona} />
      <StudiosTopics persona={persona} />
      <StudiosScope persona={persona} />
      <StudiosWorkflow persona={persona} />
      <StudiosPicks persona={persona} />
      <StudiosCost persona={persona} />
      <StudiosWhiteLabel />
      <StudiosFAQ persona={persona} />
      <ExploreMore
        path={`/use-cases/${persona.slug}`}
        exclude={persona.picks.map((p) => `/features/${p.featureSlug}`)}
        framed
      />
      <StudiosCTA persona={persona} />
    </>
  );
}
