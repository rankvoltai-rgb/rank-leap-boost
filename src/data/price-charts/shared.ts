/**
 * What every price chart shares: its shape, and Rankbox's bar, which reads
 * from src/data/pricing.ts so a price change moves every chart with it.
 * Kept apart from the registry (src/data/blog-figures.ts) because the chart
 * files import it and the registry imports the chart files.
 */
import { PLAN, formatUsd } from "../pricing";

export interface PriceBar {
  name: string;
  /** Monthly list price in USD, billed monthly. */
  value: number;
  /** What that price buys, in a few words. */
  note: string;
  /** Rankbox, drawn in the brand colour. */
  rankbox?: boolean;
  /** The tool the post is about, drawn as the reference bar. */
  reference?: boolean;
}

export interface PriceChart {
  title: string;
  subtitle: string;
  checkedOn: string;
  bars: PriceBar[];
}

export const RANKBOX_BAR: PriceBar = {
  name: "Rankbox",
  value: PLAN.monthly,
  note: `${PLAN.articlesPerMonth} articles, ${formatUsd(PLAN.monthly / PLAN.articlesPerMonth)} each`,
  rankbox: true,
};
