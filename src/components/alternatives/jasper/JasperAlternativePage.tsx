/**
 * /alternatives/jasper, in the landing page's frame.
 *
 * Jasper is a different kind of tool (a platform a marketing team writes in,
 * across every channel), so the page is built around the data's own line:
 * "the difference is everything either side of the writing". It opens on the
 * relay board, one article's trip from a buyer's question to the site with
 * both products' lanes beside each step, then answers in the order a Jasper
 * user's questions arrive: what each is for, what each price buys, every row
 * side by side, where Jasper is the better buy, where Rankbox goes further,
 * how switching works, and the sources it was all checked against.
 */
import { ExploreMore } from "@/components/ExploreMore";
import type { Competitor } from "@/data/alternatives";
import { JasperHero, SpecStrip } from "./hero";
import { ShortAnswer } from "./answer";
import { TwoJobs } from "./jobs";
import { WhatItBuys } from "./cost";
import { FullMatrix } from "./matrix";
import { BetterWhen, RankboxGoesFurther } from "./wins";
import { ClosingBand, JasperFAQ, OtherComparisons, Sources, Switching } from "./closing";

export function JasperAlternativePage({ competitor }: { competitor: Competitor }) {
  return (
    <>
      <JasperHero competitor={competitor} />
      <SpecStrip competitor={competitor} />
      <ShortAnswer competitor={competitor} />
      <TwoJobs competitor={competitor} />
      <WhatItBuys competitor={competitor} />
      <FullMatrix competitor={competitor} />
      <BetterWhen competitor={competitor} />
      <RankboxGoesFurther competitor={competitor} />
      <Switching competitor={competitor} />
      <JasperFAQ competitor={competitor} />
      <Sources competitor={competitor} />
      <OtherComparisons competitor={competitor} />
      <ExploreMore path={`/alternatives/${competitor.slug}`} framed />
      <ClosingBand competitor={competitor} />
    </>
  );
}
