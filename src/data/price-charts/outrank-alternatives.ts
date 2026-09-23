import { RANKBOX_BAR, type PriceChart } from "./shared";

const chart: PriceChart = {
  title: "What each Outrank alternative costs a month",
  subtitle: "Entry plan for about 30 articles on one site, billed monthly",
  checkedOn: "2026-09-23",
  bars: [
    RANKBOX_BAR,
    { name: "Soro", value: 39, note: "a post every morning" },
    { name: "RightBlogger", value: 59, note: "Solo, 30-post queue" },
    { name: "SEOTakeoff", value: 69, note: "30 articles, $9 first month" },
    { name: "Arvow", value: 69, note: "Solo, 1,000 credits" },
    { name: "RankYak", value: 99, note: "30 articles, up to 5,000 words" },
    { name: "RankPill", value: 99, note: "30 articles" },
    { name: "BabyLoveGrowth", value: 99, note: "30 articles, 10 AI prompts" },
    { name: "Byword", value: 99, note: "Starter, 25 articles" },
    { name: "SEObot", value: 199, note: "50 articles, the plan that covers 30" },
    { name: "Outrank", value: 99, note: "30 articles", reference: true },
  ],
};

export default chart;
