import { RANKBOX_BAR, type PriceChart } from "./shared";

const chart: PriceChart = {
  title: "What each SEObot alternative costs a month",
  subtitle: "Plan for about 30 articles on one site, billed monthly",
  checkedOn: "2026-09-23",
  bars: [
    RANKBOX_BAR,
    { name: "Autoblogging.ai", value: 49, note: "Regular, 120 credits, 2 per full article" },
    { name: "SEOTakeoff", value: 69, note: "30 articles, $9 first month" },
    { name: "Arvow", value: 69, note: "Solo, 1,000 credits" },
    { name: "Outrank", value: 99, note: "30 articles" },
    { name: "RankYak", value: 99, note: "30 articles" },
    { name: "RankPill", value: 99, note: "30 articles" },
    { name: "BabyLoveGrowth", value: 99, note: "30 articles" },
    { name: "Byword", value: 99, note: "Starter, 25 articles" },
    { name: "SEObot", value: 199, note: "50 articles, the plan that covers 30", reference: true },
  ],
};

export default chart;
