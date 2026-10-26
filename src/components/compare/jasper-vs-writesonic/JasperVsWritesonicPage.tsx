/**
 * /compare/jasper-vs-writesonic, in the landing page's frame.
 *
 * Built around what's most telling about this pair: they started as the same
 * thing and grew apart, and the rounds split along the same line. So the hero
 * is the fork (both began as AI writers; each round hangs on the branch of the
 * product that won it), and the order follows a buyer who now knows the two
 * are different products:
 *
 *   the fork and the short answer → which one fits you (the picker, early,
 *   because the choice is about your problem) → the rounds, side against side
 *   → the price ladder (cheaper to start vs. tracking included) → the spec
 *   sheet → the disclosed third option → questions and sources → the other
 *   head-to-heads → the closing band.
 *
 * Every visitor-facing fact is read from the entry and the matchup index;
 * Rankbox appears once, as the third option, within RANKBOX_SHIPS.
 */
import { ExploreMore } from "@/components/ExploreMore";
import type { Matchup } from "@/data/compare/matchups";
import type { MatchupEntry } from "@/data/compare/types";
import { ClosingBand, OtherMatchups, Questions, ThirdOption } from "./closing";
import { Finder } from "./finder";
import { Hero, ShortAnswer } from "./hero";
import { Pricing } from "./pricing";
import { Rounds } from "./rounds";
import { Specs } from "./specs";

export function JasperVsWritesonicPage({
  matchup,
  entry,
}: {
  matchup: Matchup;
  entry: MatchupEntry;
}) {
  return (
    <>
      <Hero matchup={matchup} entry={entry} />
      <ShortAnswer matchup={matchup} entry={entry} />
      <Finder matchup={matchup} entry={entry} />
      <Rounds matchup={matchup} entry={entry} />
      <Pricing matchup={matchup} entry={entry} />
      <Specs matchup={matchup} entry={entry} />
      <ThirdOption matchup={matchup} entry={entry} />
      <Questions matchup={matchup} entry={entry} />
      <OtherMatchups matchup={matchup} />
      <ExploreMore path={`/compare/${matchup.slug}`} framed />
      <ClosingBand />
    </>
  );
}
