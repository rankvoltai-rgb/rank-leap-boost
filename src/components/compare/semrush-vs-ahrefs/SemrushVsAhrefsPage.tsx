/**
 * /compare/semrush-vs-ahrefs, in the landing page's frame.
 *
 * What decides this pair for most buyers is what each price buys: the two
 * keyword databases are close to the same size, so the split is in the
 * plans — where AI prompt tracking, the API, daily rankings and free access
 * sit on each price list. So the page is built around a price ladder, both
 * lists on one dollar scale with a budget line rising through them, right
 * after the call and the short answer:
 *
 *   the call (hero + score by winner) → the short answer and who each is for
 *   → the price ladder, the full price sheet and what it leaves out
 *   → the seven rounds as a ledger → the spec sheet (tape + matrix, one table)
 *   → the fit quiz → the disclosed third option → FAQ → method and sources
 *   → the other head-to-heads → keep exploring → the closing ask.
 */
import { ExploreMore } from "@/components/ExploreMore";
import type { Matchup } from "@/data/compare/matchups";
import type { MatchupEntry } from "@/data/compare/types";
import { ClosingCta } from "./cta";
import { Faq, Sources } from "./faq";
import { FitQuiz } from "./fit";
import { Hero } from "./hero";
import { PriceLadderSection } from "./price-ladder";
import { Related } from "./related";
import { Rounds } from "./rounds";
import { SpecSheet } from "./spec-sheet";
import { ThirdOption } from "./third-option";

export function SemrushVsAhrefsPage({ matchup, entry }: { matchup: Matchup; entry: MatchupEntry }) {
  return (
    <>
      <Hero matchup={matchup} entry={entry} />
      <PriceLadderSection matchup={matchup} entry={entry} />
      <Rounds matchup={matchup} entry={entry} />
      <SpecSheet matchup={matchup} entry={entry} />
      <FitQuiz matchup={matchup} entry={entry} />
      <ThirdOption entry={entry} />
      <Faq matchup={matchup} entry={entry} />
      <Sources matchup={matchup} entry={entry} />
      <Related matchup={matchup} />
      <ExploreMore path={`/compare/${matchup.slug}`} framed />
      <ClosingCta />
    </>
  );
}
