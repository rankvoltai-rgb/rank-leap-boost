/**
 * /alternatives/byword — Rankbox vs Byword, in the landing page's frame.
 *
 * Its own layout, built around the one thing that separates the two: Byword
 * is a bulk engine sold by volume, Rankbox writes for one site every day.
 * The focal picture is a month on each (month-strip.tsx); the rest is in the
 * order a buyer weighing volume asks it — the short answer, what each plan
 * buys, when Byword is the better buy, every row, where they part ways,
 * switching, questions, and the sources everything was checked against.
 */
import { ExploreMore } from "@/components/ExploreMore";
import type { Competitor } from "@/data/alternatives";
import { BywordHero } from "./hero";
import {
  Battlegrounds,
  BetterWhen,
  BulkOrDaily,
  BywordFAQ,
  ClosingCTA,
  CostLadder,
  Matrix,
  OtherComparisons,
  ShortAnswer,
  Sources,
  Switching,
} from "./sections";

export function BywordAlternativePage({ competitor }: { competitor: Competitor }) {
  return (
    <>
      <BywordHero competitor={competitor} />
      <BulkOrDaily competitor={competitor} />
      <ShortAnswer competitor={competitor} />
      <CostLadder competitor={competitor} />
      <BetterWhen competitor={competitor} />
      <Matrix competitor={competitor} />
      <Battlegrounds competitor={competitor} />
      <Switching competitor={competitor} />
      <BywordFAQ competitor={competitor} />
      <Sources competitor={competitor} />
      <OtherComparisons competitor={competitor} />
      <ExploreMore path={`/alternatives/${competitor.slug}`} framed />
      <ClosingCTA competitor={competitor} />
    </>
  );
}
