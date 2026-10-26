/**
 * What the /alternatives/frase pictures are drawn from, worked out of the
 * competitor entry so nothing on the page is typed twice.
 *
 * The loops are the entry's own framing ("Frase closes the on-page loop.
 * Rankbox adds the off-page one."): the matrix groups that make and measure
 * an article sit on the on-page loop, the rows under "Growing authority" on
 * the off-page one, and "Shipping it" is where the two meet. Each station
 * carries one dot per matrix row, so the picture can never claim more than
 * the table under it.
 */
import type { LucideIcon } from "lucide-react";
import type { Competitor, MatrixRow, PricePlan } from "@/data/alternatives";

export type LoopId = "on" | "off";

export interface Station {
  key: string;
  title: string;
  icon: LucideIcon;
  /** Which loop it sits on; the junction sits on both. */
  loops: LoopId[];
  rows: MatrixRow[];
  /** Position in the 1000 × 500 drawing. */
  x: number;
  y: number;
}

/* The drawing: a figure of eight, the on-page loop larger on the left, the
   off-page loop on the right, crossing where an article is shipped. Both
   paths start and end at the junction, so a dash run along either one comes
   back to where it set out. */
export const VIEW = { w: 1000, h: 500 } as const;
export const JUNCTION = { x: 560, y: 250 } as const;
export const ON_PATH =
  "M560 250 C 505 170, 455 60, 335 60 C 200 60, 110 150, 110 250 C 110 350, 200 440, 335 440 C 455 440, 505 330, 560 250";
export const OFF_PATH =
  "M560 250 C 600 190, 640 115, 725 115 C 815 115, 880 175, 880 250 C 880 325, 815 385, 725 385 C 640 385, 600 310, 560 250";
export const LOOP_LABEL: Record<LoopId, { x: number; y: number; text: string }> = {
  on: { x: 335, y: 250, text: "On-page loop" },
  off: { x: 772, y: 250, text: "Off-page loop" },
};

/* Matrix group names, as the entry spells them. A group that is renamed or
   dropped simply leaves its station out. */
const ON_SLOTS = [
  { group: "Finding what to write", x: 110, y: 250 },
  { group: "Writing the article", x: 335, y: 440 },
  { group: "Measuring AI visibility", x: 335, y: 60 },
] as const;
const JUNCTION_GROUP = "Shipping it";
const OFF_GROUP = "Growing authority";
const OFF_SLOTS = [
  { x: 725, y: 115 },
  { x: 725, y: 385 },
] as const;

/**
 * Which matrix row each deep dive answers, by the feature page it links to.
 * Lets a deep dive show both products' cells for its row, verbatim.
 */
export const ROW_FOR_FEATURE: Record<string, string> = {
  "authority-backlinks": "Backlink building",
  "reddit-presence": "Reddit presence",
  "citation-ready-writer": "Price for 30 articles",
};

export function findRow(c: Competitor, label: string | undefined): MatrixRow | undefined {
  if (!label) return undefined;
  return c.matrix.flatMap((g) => g.rows).find((r) => r.label === label);
}

export function stations(c: Competitor): { on: Station[]; junction?: Station; off: Station[] } {
  const group = (name: string) => c.matrix.find((g) => g.group === name);

  const on = ON_SLOTS.flatMap((slot) => {
    const g = group(slot.group);
    return g
      ? [
          {
            key: slot.group,
            title: g.group,
            icon: g.icon,
            loops: ["on"] as LoopId[],
            rows: g.rows,
            x: slot.x,
            y: slot.y,
          },
        ]
      : [];
  });

  const j = group(JUNCTION_GROUP);
  const junction: Station | undefined = j && {
    key: j.group,
    title: j.group,
    icon: j.icon,
    loops: ["on", "off"],
    rows: j.rows,
    x: JUNCTION.x,
    y: JUNCTION.y,
  };

  const authority = group(OFF_GROUP);
  const off = (authority?.rows ?? []).slice(0, OFF_SLOTS.length).map((row, i) => {
    // The deep dive on the same row has the more specific icon.
    const dive = c.battlegrounds.find((b) => ROW_FOR_FEATURE[b.featureSlug] === row.label);
    return {
      key: row.label,
      title: row.label,
      icon: dive?.icon ?? authority!.icon,
      loops: ["off"] as LoopId[],
      rows: [row],
      x: OFF_SLOTS[i].x,
      y: OFF_SLOTS[i].y,
    };
  });

  return { on, junction, off };
}

/** Cost per article on one plan, where it is sold by the article. */
export function planPerArticle(p: Pick<PricePlan, "monthly" | "articles">): number | null {
  if (p.monthly === null || !p.articles) return null;
  return Math.round((p.monthly / p.articles) * 100) / 100;
}

/** Their cheapest plan sold by the article: the one priced like Rankbox's. */
export function entryPlan(c: Competitor): PricePlan | undefined {
  return c.pricing.plans
    .filter((p) => p.monthly !== null && p.articles)
    .sort((a, b) => (a.monthly ?? 0) - (b.monthly ?? 0))[0];
}
