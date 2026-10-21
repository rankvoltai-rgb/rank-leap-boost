/**
 * /features/reddit-presence's own layout, in the landing page's frame.
 * /features/$slug renders it in place of the shared template (see LAYOUTS
 * there), so the URL, head and every `/features/$slug` link stay as they were.
 * The copy is the feature's entry in data/features.ts, unchanged.
 *
 * Its own order, for its own reader: the hero; the product running, with its
 * four facts annotated on the screen; who does what (Rankbox finds, drafts and
 * checks; you post, from your own account); why Reddit at all; what you get in
 * every thread; how it ties into the rest of Rankbox; the questions; pricing;
 * related reading; and the way in.
 *
 * The page never shows Rankbox posting, because it can't: it holds no Reddit
 * login. It says up front that the feature is paid-only and still rolling out.
 * No testimonial block.
 */
import { PricingBand } from "@/components/landing/PricingBand";
import { ExploreMore } from "@/components/ExploreMore";
import type { Feature } from "@/data/features";
import { RedditHero } from "./hero";
import { RedditShowcase } from "./monitor";
import {
  RedditBenefits,
  RedditConnects,
  RedditCTA,
  RedditFAQ,
  RedditHandoff,
  RedditWhy,
} from "./sections";

export function RedditPresencePage({ feature }: { feature: Feature }) {
  return (
    <>
      <RedditHero feature={feature} />
      <RedditShowcase feature={feature} />
      <RedditHandoff feature={feature} />
      <RedditWhy feature={feature} />
      <RedditBenefits feature={feature} />
      <RedditConnects feature={feature} />
      <RedditFAQ feature={feature} />
      <PricingBand />
      <ExploreMore path={`/features/${feature.slug}`} framed />
      <RedditCTA feature={feature} />
    </>
  );
}
