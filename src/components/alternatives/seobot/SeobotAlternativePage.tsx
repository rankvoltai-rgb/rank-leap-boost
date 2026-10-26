/**
 * /alternatives/seobot's own layout, in the landing page's frame.
 * /alternatives/$slug renders it through LAYOUTS, so the URL, head, JSON-LD
 * and loader stay as they were. Every competitor fact is the entry in
 * src/data/competitors/seobot.ts, unchanged.
 *
 * Both tools are autopilots, so this comparison turns on arithmetic, not
 * features: SEObot sells article credits on a six-plan ladder, Rankbox sells
 * one plan. The page opens on the facts (a split hero with the at-a-glance
 * sheet), then climbs that ladder to the volume you need beside Rankbox's
 * single step, with the whole plan table under it to check the picture
 * against. Then the short answer and where each differs, every row of the
 * matrix as the pipeline it is, the three places the choice is decided,
 * when SEObot is the better buy, the hand-off while switching, every FAQ
 * answered in the open, the sources, and the other comparisons. It closes
 * on blue with a month of articles. No testimonial block.
 */
import { ExploreMore } from "@/components/ExploreMore";
import type { Competitor } from "@/data/alternatives";
import { SeobotHero } from "./hero";
import { Arithmetic } from "./arithmetic";
import { Rows } from "./rows";
import {
  BetterWhen,
  ClosingBand,
  Decided,
  OtherComparisons,
  SeobotFAQ,
  ShortAnswer,
  Sources,
  Switching,
} from "./sections";

export function SeobotAlternativePage({ competitor }: { competitor: Competitor }) {
  return (
    <>
      <SeobotHero competitor={competitor} />
      <Arithmetic competitor={competitor} />
      <ShortAnswer competitor={competitor} />
      <Rows competitor={competitor} />
      <Decided competitor={competitor} />
      <BetterWhen competitor={competitor} />
      <Switching competitor={competitor} />
      <SeobotFAQ competitor={competitor} />
      <Sources competitor={competitor} />
      <OtherComparisons competitor={competitor} />
      <ExploreMore path={`/alternatives/${competitor.slug}`} framed />
      <ClosingBand competitor={competitor} />
    </>
  );
}
