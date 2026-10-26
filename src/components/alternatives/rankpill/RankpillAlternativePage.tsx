/**
 * /alternatives/rankpill's own layout, in the landing page's frame.
 * /alternatives/$slug renders it through LAYOUTS, so the head, JSON-LD and
 * loader stay in the route, unchanged.
 *
 * RankPill is the one competitor built to do the same job, so the page is
 * built around that: two receipts in the hero that print the same lines and
 * different totals; the quotable answer; every row tagged Same or Differs;
 * the three places they really differ (the backlink credits worked as a
 * calculator); every way RankPill bills, on one scale with Rankbox; when
 * RankPill is the better buy; how to switch with both running; the questions;
 * the sources; the other comparisons; and the closing band.
 */
import { ExploreMore } from "@/components/ExploreMore";
import type { Competitor } from "@/data/alternatives";
import { RankpillHero } from "./hero";
import { RowForRow } from "./matrix";
import { CostLadder } from "./ladder";
import { Switching } from "./switching";
import {
  BetterWhen,
  ClosingBand,
  Differences,
  OtherComparisons,
  Questions,
  ShortAnswer,
  Sources,
} from "./sections";

export function RankpillAlternativePage({ competitor }: { competitor: Competitor }) {
  return (
    <>
      <RankpillHero competitor={competitor} />
      <ShortAnswer competitor={competitor} />
      <RowForRow competitor={competitor} />
      <Differences competitor={competitor} />
      <CostLadder competitor={competitor} />
      <BetterWhen competitor={competitor} />
      <Switching competitor={competitor} />
      <Questions competitor={competitor} />
      <Sources competitor={competitor} />
      <OtherComparisons competitor={competitor} />
      <ExploreMore path={`/alternatives/${competitor.slug}`} framed />
      <ClosingBand competitor={competitor} />
    </>
  );
}
