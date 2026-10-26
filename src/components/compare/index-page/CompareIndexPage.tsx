/**
 * /compare's body, in the landing page's style. The route keeps the head
 * (title, description, canonical, JSON-LD) and the frame (framed navbar,
 * footer); this is everything between.
 *
 * The hub's own picture is the scoreboard: every head-to-head as a row, every
 * round on that page as a square, wins running outward from a centre line on
 * which the draws sit. It sits straight under the hero and doubles as the
 * table of contents. Then how every page is judged, the full library with its
 * category filter, where the Rankbox-vs pages live, and a blue close.
 */
import { ScoreboardBand } from "./scoreboard";
import { ClosingBand, HubHero, LibrarySection, MethodSection, OursBand } from "./sections";
import { rise } from "./copy";

export function CompareIndexPage() {
  return (
    <>
      <HubHero />
      <ScoreboardBand style={rise(0.42)} />
      <MethodSection />
      <LibrarySection />
      <OursBand />
      <ClosingBand />
    </>
  );
}
