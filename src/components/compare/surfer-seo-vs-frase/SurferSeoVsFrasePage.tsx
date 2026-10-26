/**
 * /compare/surfer-seo-vs-frase, in the landing page's frame.
 *
 * The page is built around what sets this pair apart: both tools grade a
 * draft the same way, and they part at the ends of the pipeline — Surfer
 * deeper on keyword research, Frase further into publishing and refreshing.
 * So the focal visual is that pipeline, a track per tool (Pipeline.tsx), and
 * the rest follows the order a buyer's questions arrive in:
 *
 *   the call (hero, short answer, picks) → where they differ (pipeline)
 *   → why (seven rounds and the score) → the cost (one price ladder)
 *   → for me? (the picker) → the detail (tape and full matrix)
 *   → neither? (Rankbox, disclosed) → FAQ, method and sources
 *   → other pairs → explore → closing band.
 *
 * Every fact is read from the entry and the matchup; the stage names, pills
 * and captions are the only words added here.
 */
import { ExploreMore } from "@/components/ExploreMore";
import type { Matchup } from "@/data/compare/matchups";
import type { MatchupEntry } from "@/data/compare/types";
import { Closing } from "./Closing";
import { Faq } from "./Faq";
import { Finder } from "./Finder";
import { Hero } from "./Hero";
import { Pipeline } from "./Pipeline";
import { PriceLadder } from "./PriceLadder";
import { Related } from "./Related";
import { Rounds } from "./Rounds";
import { SpecSheet } from "./SpecSheet";
import { ThirdOption } from "./ThirdOption";

export function SurferSeoVsFrasePage({
  matchup,
  entry,
}: {
  matchup: Matchup;
  entry: MatchupEntry;
}) {
  return (
    <>
      <Hero matchup={matchup} entry={entry} />
      <Pipeline matchup={matchup} entry={entry} />
      <Rounds matchup={matchup} entry={entry} />
      <PriceLadder matchup={matchup} entry={entry} />
      <Finder matchup={matchup} entry={entry} />
      <SpecSheet matchup={matchup} entry={entry} />
      <ThirdOption matchup={matchup} entry={entry} />
      <Faq matchup={matchup} entry={entry} />
      <Related matchup={matchup} />
      <ExploreMore path={`/compare/${matchup.slug}`} framed />
      <Closing />
    </>
  );
}
