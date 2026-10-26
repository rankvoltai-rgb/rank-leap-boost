/**
 * The numbers behind the word meter, read out of the comparison's own data
 * (src/data/competitors/koala.ts) rather than typed again here, so the
 * picture can never drift from the plan ladder and the footnote it
 * illustrates.
 *
 * - The article length, the model and its multiplier come from the ladder's
 *   footnote ("articles of 2,500 words on the default Claude Sonnet 5 model,
 *   which counts words at 2x").
 * - Each plan's word allowance and article estimate come from its note
 *   ("100,000 words · about 20 articles*").
 *
 * A plan is only drawn when its own estimate agrees with that arithmetic, and
 * the meter is left out entirely if the footnote can't be read: a wrong
 * number in a picture is worse than no picture.
 */
import type { Competitor } from "@/data/alternatives";

export interface MeterPlan {
  name: string;
  monthly: number;
  /** The plan's word allowance a month. */
  words: number;
  /** The data's own "about N" estimate, at the footnote's article length. */
  articles: number;
  /** The plan's note mentions autopilot. */
  autopilot: boolean;
}

export interface Meter {
  /** Words in one article of the footnote's length. */
  articleWords: number;
  /** How many words the default model counts for each word written. */
  multiplier: number;
  /** The default model's name, as the footnote spells it. */
  model: string;
  /** Words one article takes off the allowance. */
  counted: number;
  plans: MeterPlan[];
  /** The plan the page compares against, when it's on the meter. */
  defaultPlan: string;
  /** The first plan whose note mentions autopilot. */
  autopilotFrom?: string;
}

const toNumber = (s: string) => Number(s.replace(/,/g, ""));

export function readMeter(c: Competitor): Meter | null {
  const note = c.pricing.ladderNote ?? "";
  const length = note.match(/articles of ([\d,]+) words/);
  const model = note.match(/default (.+?) model/);
  const mult = note.match(/counts words at (\d+(?:\.\d+)?)x/);
  if (!length || !model || !mult) return null;

  const articleWords = toNumber(length[1]);
  const multiplier = Number(mult[1]);
  const counted = articleWords * multiplier;
  if (!counted) return null;

  const plans = c.pricing.plans.flatMap((p): MeterPlan[] => {
    const words = p.note?.match(/^([\d,]+) words/);
    const about = p.note?.match(/about (\d+)/);
    if (!words || !about || p.monthly === null) return [];
    const allowance = toNumber(words[1]);
    const articles = Number(about[1]);
    if (Math.round(allowance / counted) !== articles) return [];
    return [
      {
        name: p.name,
        monthly: p.monthly,
        words: allowance,
        articles,
        autopilot: /autopilot/i.test(p.note ?? ""),
      },
    ];
  });
  if (plans.length === 0) return null;

  const compared = plans.find((p) => p.name === c.pricing.plan);
  return {
    articleWords,
    multiplier,
    model: model[1],
    counted,
    plans,
    defaultPlan: (compared ?? plans[plans.length - 1]).name,
    autopilotFrom: c.pricing.plans.find((p) => /autopilot/i.test(p.note ?? ""))?.name,
  };
}

/** 45000 → "45,000". */
export function formatWords(n: number): string {
  return n.toLocaleString("en-US");
}
