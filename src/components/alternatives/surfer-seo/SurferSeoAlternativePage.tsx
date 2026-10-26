/**
 * /alternatives/surfer-seo, in the landing page's frame.
 *
 * Built around the one thing that makes this comparison unusual: the volume
 * is the same. Surfer's Standard plan comes to about 30 documents a month and
 * Rankbox's plan is 30 articles a month, so the page holds the number still
 * and shows what each one is — an editor document a person opens, or an
 * article that arrives written, checked, and delivered (month-strip.tsx).
 *
 * The order follows a Surfer user's questions: what's the difference, what
 * does each plan cost per article, prove it row by row, the three things that
 * decide it, when Surfer is the better buy, and how to run the two together.
 * Every fact is read from src/data/competitors/surfer.ts.
 */
import { ExploreMore } from "@/components/ExploreMore";
import type { Competitor } from "@/data/alternatives";
import { SurferHero } from "./hero";
import { MonthSection } from "./month-strip";
import {
  AlongsideSection,
  BattlegroundsSection,
  BetterWhenSection,
  CostSection,
  MatrixSection,
} from "./sections";
import { ClosingBand, FaqSection, OtherComparisons, SourcesSection } from "./closing";
import { comparisonPaths } from "./text";

export function SurferSeoAlternativePage({ competitor }: { competitor: Competitor }) {
  const linked = [
    ...comparisonPaths(competitor),
    ...competitor.battlegrounds.map((b) => `/features/${b.featureSlug}`),
  ];
  return (
    <>
      <SurferHero competitor={competitor} />
      <MonthSection competitor={competitor} />
      <CostSection competitor={competitor} />
      <MatrixSection competitor={competitor} />
      <BattlegroundsSection competitor={competitor} />
      <BetterWhenSection competitor={competitor} />
      <AlongsideSection competitor={competitor} />
      <FaqSection competitor={competitor} />
      <SourcesSection competitor={competitor} />
      <OtherComparisons competitor={competitor} />
      <ExploreMore path={`/alternatives/${competitor.slug}`} exclude={linked} framed />
      <ClosingBand competitor={competitor} />
    </>
  );
}
