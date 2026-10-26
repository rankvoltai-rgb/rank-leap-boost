/**
 * /compare/koala-ai-vs-byword's own layout, in the landing page's frame.
 * The route renders it through LAYOUTS; the head, JSON-LD and loader stay
 * shared. Every fact on it is the matchup's entry in
 * data/compare/content/koala-ai-vs-byword.ts, unchanged.
 *
 * The page is built around what actually separates these two. Their seven
 * rounds end level, so the score isn't the answer; the unit each one sells
 * is. Koala meters words (twice or three times over on its premium models),
 * Byword sells articles. So after a split hero — the matchup and the short
 * answer, closed by the two "choose this if" lists — the focal picture is
 * the meter: set a month and both price ladders light the plan it needs.
 * Then the rounds (scoreboard, then one band each), the fit quiz, the spec
 * sheet (facts, then the capability table), Rankbox as the disclosed third
 * option, the FAQ beside how the page was made with every source, the other
 * head-to-heads, and the closing ask.
 */
import { ExploreMore } from "@/components/ExploreMore";
import { sidesOf, type Matchup } from "@/data/compare/matchups";
import type { MatchupEntry } from "@/data/compare/types";
import { FaqSection, KoalaBywordCta, OtherComparisons, ThirdOptionSection } from "./Closing";
import { FinderSection } from "./Finder";
import { KoalaBywordHero } from "./Hero";
import { MeterSection } from "./MeterBand";
import { RoundsSection } from "./Rounds";
import { SpecSection } from "./Spec";

export function KoalaAiVsBywordPage({ matchup, entry }: { matchup: Matchup; entry: MatchupEntry }) {
  const sides = sidesOf(matchup);
  return (
    <>
      <KoalaBywordHero matchup={matchup} entry={entry} sides={sides} />
      <MeterSection sides={sides} entry={entry} />
      <RoundsSection sides={sides} entry={entry} />
      <FinderSection matchup={matchup} sides={sides} entry={entry} />
      <SpecSection sides={sides} entry={entry} />
      <ThirdOptionSection sides={sides} entry={entry} />
      <FaqSection matchup={matchup} sides={sides} entry={entry} />
      <OtherComparisons matchup={matchup} />
      <ExploreMore path={`/compare/${matchup.slug}`} framed />
      <KoalaBywordCta />
    </>
  );
}
