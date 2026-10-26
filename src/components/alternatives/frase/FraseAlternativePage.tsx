/**
 * /alternatives/frase's own layout, in the landing page's frame. The route
 * renders it through LAYOUTS; the head, JSON-LD and loader stay shared.
 *
 * The page is built around the entry's own argument, "Frase closes the
 * on-page loop. Rankbox adds the off-page one.", drawn as a figure of eight
 * right under the hero. Then the quotable short answer beside the facts at a
 * glance, and straight after it the cases where Frase is the better buy
 * (it is ahead on tracking and editing, and the page says so before it makes
 * its own case). Then the three places Rankbox differs, each with its row
 * from the matrix, the cost as receipts and a per-article ladder, every row,
 * how to run both, the FAQ, and the sources the facts were checked against.
 * It closes on blue with the same figure of eight in white.
 */
import { MotionConfig } from "motion/react";
import { Spacer } from "@/components/landing/frame";
import { ExploreMore } from "@/components/ExploreMore";
import type { Competitor } from "@/data/alternatives";
import { FraseHero } from "./hero";
import { LoopsSection } from "./loops";
import { CostSection } from "./cost";
import {
  BetterWhen,
  ClosingBand,
  Differences,
  FraseFAQ,
  KeepComparing,
  RowByRow,
  RunningBoth,
  ShortAnswer,
  SourcesBand,
} from "./sections";

export function FraseAlternativePage({ competitor }: { competitor: Competitor }) {
  return (
    <MotionConfig reducedMotion="user">
      <FraseHero competitor={competitor} />
      <Spacer />
      <LoopsSection competitor={competitor} />
      <Spacer />
      <ShortAnswer competitor={competitor} />
      <Spacer />
      <BetterWhen competitor={competitor} />
      <Spacer />
      <Differences competitor={competitor} />
      <Spacer />
      <CostSection competitor={competitor} />
      <Spacer />
      <RowByRow competitor={competitor} />
      <Spacer />
      <RunningBoth competitor={competitor} />
      <Spacer />
      <FraseFAQ competitor={competitor} />
      <Spacer />
      <SourcesBand competitor={competitor} />
      <Spacer />
      <KeepComparing competitor={competitor} />
      <ExploreMore path={`/alternatives/${competitor.slug}`} framed />
      <ClosingBand competitor={competitor} />
    </MotionConfig>
  );
}
