/**
 * /alternatives/outrank's own layout, in the landing page's frame. The route
 * renders it through its LAYOUTS map; the head, JSON-LD and loader stay in
 * the route. Every fact is the Outrank entry in data/competitors/outrank.ts.
 *
 * Outrank and Rankbox run the same loop, an article a day on one site, so
 * the page is built around what the same month costs on each: the hero's
 * focal picture is two calendars filling in lockstep with each plan's price
 * beneath (month.tsx). From there it follows a buyer weighing two tools that
 * do one job: the short answer and the shortlist facts, what really differs
 * and the three places it shows, every plan priced per article, then
 * straight after, when Outrank is the better buy. Then every row, how to
 * switch (run both, then pause), the questions, and the sources. It closes
 * on blue, with the month's thirty squares along the foot.
 */
import { ExploreMore } from "@/components/ExploreMore";
import type { Competitor } from "@/data/alternatives";
import { OutrankHero } from "./hero";
import {
  BetterWhen,
  ClosingBand,
  DeepDives,
  Matrix,
  OtherComparisons,
  Positioning,
  PriceLadder,
  Questions,
  ShortAnswer,
  Sources,
  Switching,
} from "./sections";

export function OutrankAlternativePage({ competitor }: { competitor: Competitor }) {
  // The deep dives already link their feature pages, so the cross-links
  // block offers somewhere new instead.
  const linked = competitor.battlegrounds.map((b) => `/features/${b.featureSlug}`);
  return (
    <>
      <OutrankHero competitor={competitor} />
      <ShortAnswer competitor={competitor} />
      <Positioning competitor={competitor} />
      <DeepDives competitor={competitor} />
      <PriceLadder competitor={competitor} />
      <BetterWhen competitor={competitor} />
      <Matrix competitor={competitor} />
      <Switching competitor={competitor} />
      <Questions competitor={competitor} />
      <Sources competitor={competitor} />
      <OtherComparisons competitor={competitor} />
      <ExploreMore path={`/alternatives/${competitor.slug}`} exclude={linked} framed />
      <ClosingBand competitor={competitor} />
    </>
  );
}
