/**
 * /use-cases, the list of all six use-case pages, in the landing page's
 * style. The route (src/routes/use-cases.index.tsx) keeps the head and wraps
 * this in the framed navbar and the footer.
 *
 * Order: the hero with the engine and its six seats; the seats as cards, by
 * role and by business; how the pages are written; what Rankbox is in one
 * line; pricing; the closing band. No proof row or testimonials, as on the
 * landing since its redesign.
 */
import { PricingBand } from "@/components/landing/PricingBand";
import { Method, OneLine, SeatList, UseCasesClosing, UseCasesHero } from "./sections";

export function UseCasesIndexPage() {
  return (
    <>
      <UseCasesHero />
      <SeatList />
      <Method />
      <OneLine />
      <PricingBand />
      <UseCasesClosing />
    </>
  );
}
