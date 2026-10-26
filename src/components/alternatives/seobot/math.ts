/**
 * The arithmetic behind /alternatives/seobot, kept pure so the pictures and
 * the tables can never disagree. Every number is worked out from the
 * competitor's own plan ladder (src/data/competitors/seobot.ts) and from
 * PLAN, never typed in here.
 */
import { PLAN } from "@/data/pricing";
import type { Competitor } from "@/data/alternatives";

/** One plan SEObot sells by the article, with its cost per article worked out. */
export interface Rung {
  name: string;
  monthly: number;
  articles: number;
  note?: string;
  /** Price over articles, to the cent. */
  each: number;
}

export function perArticle(monthly: number, articles: number): number {
  return Math.round((monthly / articles) * 100) / 100;
}

/** The plans sold by the article, cheapest first, as the ladder shows them. */
export function rungsOf(c: Competitor): Rung[] {
  return c.pricing.plans.flatMap((p) =>
    p.monthly !== null && p.articles
      ? [
          {
            name: p.name,
            monthly: p.monthly,
            articles: p.articles,
            note: p.note,
            each: perArticle(p.monthly, p.articles),
          },
        ]
      : [],
  );
}

/** The cheapest rung that covers `need` articles a month, or -1. */
export function coveringIndex(rungs: Rung[], need: number): number {
  return rungs.findIndex((r) => r.articles >= need);
}

/** The volumes worth trying: every rung's allowance, plus Rankbox's. */
export function volumesOf(rungs: Rung[]): number[] {
  return [...new Set([...rungs.map((r) => r.articles), PLAN.articlesPerMonth])].sort(
    (a, b) => a - b,
  );
}

/** "Same idea. Different maths." → lead and accent, split after the first sentence. */
export function splitSentence(text: string): { lead: string; accent: string } {
  const at = text.indexOf(". ");
  if (at !== -1) return { lead: text.slice(0, at + 1), accent: text.slice(at + 2) };
  const words = text.split(" ");
  return { lead: words.slice(0, -2).join(" "), accent: words.slice(-2).join(" ") };
}

/** "https://docs.example.com/en/articles/1-x" → "docs.example.com/en/articles/1-x". */
export function displayUrl(url: string): string {
  try {
    const u = new URL(url);
    const path = u.pathname === "/" ? "" : u.pathname.replace(/\/$/, "");
    return `${u.hostname.replace(/^www\./, "")}${path}`;
  } catch {
    return url;
  }
}
