/**
 * /use-cases/professional-services's own layout, in the landing page's frame.
 * /use-cases/$slug renders it through LAYOUTS, so the URL, head and JSON-LD
 * stay the route's. The words are in data/persona-pages/professional-services.
 *
 * Ordered for a partner deciding whether the firm's expertise can go on the
 * site without going through the partner's weekend: the shortlist an AI
 * answer gives a client, the memo that says what this is, the research behind
 * it, the firm's own site as findings, the sample answer library, the
 * sign-off sheet, the scope with what's not in it, the timesheet it stands in
 * for, the four features, the fee schedule, every question answered, the
 * links onward, and the closing band.
 *
 * Each section is set as a document a firm already reads (memo, exhibits,
 * findings, workpaper, engagement scope, timesheet, fee schedule), so the
 * page shares the family's frame and none of its layouts. No testimonials:
 * there are none from firms to show.
 */
import { ExploreMore } from "@/components/ExploreMore";
import type { Persona } from "@/data/personas";
import { ProCTA, ProFAQ, ProFees, ProPicks, ProTimesheet } from "./closing";
import { ProEvidence, ProFindings } from "./evidence";
import { ProHero, ProShortAnswer } from "./hero";
import { ProScope, ProSignOff, ProTopics } from "./practice";

export function ProfessionalServicesPage({ persona }: { persona: Persona }) {
  return (
    <>
      <ProHero persona={persona} />
      <ProShortAnswer persona={persona} />
      <ProEvidence />
      <ProFindings persona={persona} />
      <ProTopics persona={persona} />
      <ProSignOff persona={persona} />
      <ProScope persona={persona} />
      <ProTimesheet persona={persona} />
      <ProPicks persona={persona} />
      <ProFees />
      <ProFAQ persona={persona} />
      <ExploreMore
        path={`/use-cases/${persona.slug}`}
        exclude={persona.picks.map((p) => `/features/${p.featureSlug}`)}
        framed
      />
      <ProCTA persona={persona} />
    </>
  );
}
