/**
 * /compare/surfer-seo-vs-clearscope, in the landing page's frame.
 *
 * Built around what decides this pair for most teams: headcount. Surfer
 * sells seats by plan, Clearscope includes unlimited users, so the focal
 * picture is the seat ladder (./cost), right after the short answer. The
 * rounds then say why, scored as they go; the spec sheet holds the facts;
 * the picker turns it into a pick; Rankbox appears once, disclosed, as the
 * third option.
 *
 *   hero (question + short answer, picks) → cost by team size (seat ladder,
 *   plan sheets, what the list prices leave out) → rounds → spec sheet →
 *   which one fits → third option → FAQ → sources → other pairs → explore →
 *   closing ask.
 */
import { ExploreMore } from "@/components/ExploreMore";
import type { Matchup } from "@/data/compare/matchups";
import type { MatchupEntry } from "@/data/compare/types";
import { ClosingCta, Faq, OtherComparisons, Sources, ThirdOption } from "./closing";
import { CostByTeamSize } from "./cost";
import { FitFinder } from "./fit-finder";
import { Hero } from "./hero";
import { Rounds } from "./rounds";
import { SpecSheet } from "./spec-sheet";

export function SurferSeoVsClearscopePage({
  matchup,
  entry,
}: {
  matchup: Matchup;
  entry: MatchupEntry;
}) {
  return (
    <>
      <Hero matchup={matchup} entry={entry} />
      <CostByTeamSize matchup={matchup} entry={entry} />
      <Rounds matchup={matchup} entry={entry} />
      <SpecSheet matchup={matchup} entry={entry} />
      <FitFinder matchup={matchup} entry={entry} />
      <ThirdOption matchup={matchup} entry={entry} />
      <Faq matchup={matchup} entry={entry} />
      <Sources matchup={matchup} entry={entry} />
      <OtherComparisons matchup={matchup} />
      <ExploreMore path={`/compare/${matchup.slug}`} framed />
      <ClosingCta />
    </>
  );
}
