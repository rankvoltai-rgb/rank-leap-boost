/**
 * The numbers behind the price charts in the "best X alternatives" posts,
 * placed with `![alt](figure:price-chart/<post-slug> "caption")`.
 *
 * Each chart lives in src/data/price-charts/<post-slug>.ts, so one post's
 * numbers can change without touching another's. Every bar is a published
 * list price, billed monthly, from the vendor's own pricing page on the
 * chart's `checkedOn` date, and the post's own price table says the same
 * thing. alternatives-posts.test.ts checks that each chart's tools are named
 * in its post.
 */
import type { PriceChart } from "./price-charts/shared";

export type { PriceBar, PriceChart } from "./price-charts/shared";

const FILES = import.meta.glob<PriceChart>("./price-charts/*-alternatives.ts", {
  import: "default",
  eager: true,
});

/** Every chart, keyed by the post slug its file is named after. */
export const PRICE_CHARTS: Record<string, PriceChart> = Object.fromEntries(
  Object.entries(FILES).map(([path, chart]) => [
    path.split("/").pop()!.replace(/\.ts$/, ""),
    chart,
  ]),
);
