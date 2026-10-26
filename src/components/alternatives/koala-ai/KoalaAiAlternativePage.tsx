/**
 * /alternatives/koala-ai's own layout, in the landing page's frame. The route
 * renders it through its LAYOUTS map; the head, JSON-LD and loader stay in
 * the route. Every visitor-facing fact is the competitor's entry in
 * src/data/competitors/koala.ts, read here, not retyped.
 *
 * The whole comparison turns on one thing: Koala sells words, and its default
 * model counts each word twice, while Rankbox sells articles. So the page is
 * built around measuring. The hero sets the two price tags side by side, a
 * meter runs one month of articles through both plans, and the short answer
 * follows straight after. Then the price ladder (the whole of it, not just
 * the plan that flatters us), what each product is, every row of the
 * matrix, where Koala is the better buy, the three places Rankbox differs,
 * and how to switch. It closes on the FAQ, its sources, the other
 * comparisons, and a blue band with the month's thirty articles at its foot.
 */
import { ExploreMore } from "@/components/ExploreMore";
import type { Competitor } from "@/data/alternatives";
import { KoalaHero } from "./hero";
import { WordMeterBand } from "./word-meter";
import { ShortAnswer } from "./answer";
import { PlanLadder } from "./ladder";
import { Matrix } from "./matrix";
import { Battlegrounds, BetterWhen, Migration, Positioning } from "./sections";
import { KoalaCTA, KoalaFAQ, KoalaSources, OtherComparisons } from "./closing";

export function KoalaAiAlternativePage({ competitor }: { competitor: Competitor }) {
  return (
    <>
      <KoalaHero competitor={competitor} />
      <WordMeterBand competitor={competitor} />
      <ShortAnswer competitor={competitor} />
      <PlanLadder competitor={competitor} />
      <Positioning competitor={competitor} />
      <Matrix competitor={competitor} />
      <BetterWhen competitor={competitor} />
      <Battlegrounds competitor={competitor} />
      <Migration competitor={competitor} />
      <KoalaFAQ competitor={competitor} />
      <KoalaSources competitor={competitor} />
      <OtherComparisons competitor={competitor} />
      <ExploreMore path={`/alternatives/${competitor.slug}`} framed />
      <KoalaCTA competitor={competitor} />
    </>
  );
}
