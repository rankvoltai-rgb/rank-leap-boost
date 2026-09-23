import { RANKBOX_BAR, type PriceChart } from "./shared";

const chart: PriceChart = {
  title: "What each Koala AI alternative costs a month",
  subtitle: "Plan covering about 30 articles a month, billed monthly",
  checkedOn: "2026-09-23",
  bars: [
    RANKBOX_BAR,
    { name: "SEOWriting.ai", value: 19, note: "Starter, up to 50 articles" },
    { name: "Machined", value: 19, note: "Launch, 30 articles" },
    { name: "ZimmWriter", value: 24.97, note: "licence, plus your AI bill" },
    { name: "Autoblogging.ai", value: 49, note: "Regular, 120 credits" },
    { name: "Junia AI", value: 59, note: "Scale Starter, 68 articles" },
    { name: "Semrush", value: 60, note: "Content Toolkit, 5 boosted" },
    { name: "Scalenut", value: 89, note: "Plus, 30 GEO articles" },
    { name: "Byword", value: 99, note: "Starter, 25 articles" },
    { name: "Koala AI", value: 99, note: "Boost, 30+ on any model", reference: true },
  ],
};

export default chart;
