/**
 * /alternatives/writesonic's own layout, in the landing page's frame. The
 * route renders it through LAYOUTS; the head, JSON-LD and loader stay there.
 *
 * Writesonic isn't a like-for-like rival: its entry concedes that it is the
 * deeper analytics platform and that plenty of teams could run both. So the
 * page is built around that, not around a winner. After the hero and the
 * short answer comes the focal chart, the two products working from
 * opposite ends of the same rows; then the case for Writesonic, the three
 * places Rankbox does the work itself, what each plan buys, every row in
 * full, and how the two run together. FAQ, the paper trail and the closing
 * band finish it.
 */
import { ExploreMore } from "@/components/ExploreMore";
import type { Competitor } from "@/data/alternatives";
import { WritesonicHero, WritesonicShortAnswer } from "./hero";
import { WritesonicOppositeEnds } from "./opposite-ends";
import { WritesonicCost } from "./cost";
import { WritesonicMatrix } from "./matrix";
import {
  WritesonicBattlegrounds,
  WritesonicBetterWhen,
  WritesonicCTA,
  WritesonicFAQ,
  WritesonicOtherComparisons,
  WritesonicRunningBoth,
  WritesonicSources,
} from "./sections";

export function WritesonicAlternativePage({ competitor }: { competitor: Competitor }) {
  return (
    <>
      <WritesonicHero competitor={competitor} />
      <WritesonicShortAnswer competitor={competitor} />
      <WritesonicOppositeEnds competitor={competitor} />
      <WritesonicBetterWhen competitor={competitor} />
      <WritesonicBattlegrounds competitor={competitor} />
      <WritesonicCost competitor={competitor} />
      <WritesonicMatrix competitor={competitor} />
      <WritesonicRunningBoth competitor={competitor} />
      <WritesonicFAQ competitor={competitor} />
      <WritesonicSources competitor={competitor} />
      <WritesonicOtherComparisons competitor={competitor} />
      <ExploreMore path={`/alternatives/${competitor.slug}`} framed />
      <WritesonicCTA competitor={competitor} />
    </>
  );
}
