/**
 * /use-cases/multi-brand-companies's own layout, in the landing page's frame.
 * The persona route renders it through LAYOUTS, so the URL, head and JSON-LD
 * stay shared; every word is in data/persona-pages/multi-brand-companies.ts.
 *
 * Arranged for someone running several brands: a centred promise over one
 * account window that switches between four brand sites (switcher-scene.tsx),
 * the short answer beside the facts, where a portfolio's content breaks, a
 * sample map with one row per brand, who does what (and what isn't in the
 * box), the rules that keep brands apart, the rollout from one brand to all
 * of them, the parts it leans on, the bill per brand with a price block
 * worked out from pricing.ts, the questions, related pages, and the closing
 * band. The call to action is the Studio sign-up throughout.
 */
import { MotionConfig } from "motion/react";
import { ExploreMore } from "@/components/ExploreMore";
import type { Persona } from "@/data/personas";
import { MultiBrandHero } from "./hero";
import {
  MultiBrandBill,
  MultiBrandClosing,
  MultiBrandFAQ,
  MultiBrandGuardrails,
  MultiBrandHandoff,
  MultiBrandInShort,
  MultiBrandPains,
  MultiBrandPicks,
  MultiBrandRollout,
  MultiBrandTopicMap,
} from "./sections";

export function MultiBrandCompaniesPage({ persona }: { persona: Persona }) {
  return (
    <MotionConfig reducedMotion="user">
      <MultiBrandHero persona={persona} />
      <MultiBrandInShort persona={persona} />
      <MultiBrandPains persona={persona} />
      <MultiBrandTopicMap persona={persona} />
      <MultiBrandHandoff persona={persona} />
      <MultiBrandGuardrails />
      <MultiBrandRollout persona={persona} />
      <MultiBrandPicks persona={persona} />
      <MultiBrandBill persona={persona} />
      <MultiBrandFAQ persona={persona} />
      <ExploreMore
        path={`/use-cases/${persona.slug}`}
        exclude={persona.picks.map((p) => `/features/${p.featureSlug}`)}
        framed
      />
      <MultiBrandClosing persona={persona} />
    </MotionConfig>
  );
}
