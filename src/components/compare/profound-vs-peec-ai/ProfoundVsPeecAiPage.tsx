/**
 * /compare/profound-vs-peec-ai, drawn in the landing page's frame.
 *
 * Two AI search trackers that report much the same numbers and split on how
 * you buy them, so the page is built around that split: the hero's ledger
 * shows the level score (Profound takes the depth rounds, Peec AI the access
 * rounds), and the focal band puts both price lists on one dollar ruler,
 * where Profound's brand lane runs from a free trial straight to a quote.
 *
 *   the score (hero ledger) → the call (short answer, who each is for)
 *   → how you get in (price ruler, plan sheets) → the facts (spec sheet)
 *   → why (seven rounds) → for me? (the scale) → the detail (matrix)
 *   → neither? (the disclosed third option) → FAQ → method and sources
 *   → other head-to-heads → explore → closing band.
 */
import { ExploreMore } from "@/components/ExploreMore";
import type { Matchup } from "@/data/compare/matchups";
import type { MatchupEntry } from "@/data/compare/types";
import { ClosingCta, Faq, OtherMatchups, Sources } from "./end";
import { FactSheet } from "./fact-sheet";
import { Finder } from "./finder";
import { Hero } from "./hero";
import { Matrix } from "./matrix";
import { PriceLine } from "./price-line";
import { Rounds } from "./rounds";
import { ThirdOption } from "./third-option";
import { ShortAnswer } from "./verdict";

export function ProfoundVsPeecAiPage({
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
      <PriceLine matchup={matchup} entry={entry} />
      <FactSheet matchup={matchup} entry={entry} />
      <Rounds matchup={matchup} entry={entry} />
      <Finder matchup={matchup} entry={entry} />
      <Matrix matchup={matchup} entry={entry} />
      <ThirdOption matchup={matchup} entry={entry} />
      <Faq matchup={matchup} entry={entry} />
      <Sources matchup={matchup} entry={entry} />
      <OtherMatchups matchup={matchup} />
      <ExploreMore path={`/compare/${matchup.slug}`} framed />
      <ClosingCta />
    </>
  );
}
