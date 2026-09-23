import { RANKBOX_BAR, type PriceChart } from "./shared";

const chart: PriceChart = {
  title: "What each Byword alternative costs a month",
  subtitle: "The plan that covers about 30 articles a month, billed monthly",
  checkedOn: "2026-09-23",
  bars: [
    RANKBOX_BAR,
    { name: "Machined", value: 19, note: "Launch, 30 articles" },
    { name: "SEOWriting.ai", value: 19, note: "Starter, up to 50 articles" },
    { name: "ZimmWriter", value: 24.97, note: "no article cap, plus your own AI costs" },
    { name: "Koala AI", value: 49, note: "Professional, 100,000 words" },
    { name: "Autoblogging.ai", value: 49, note: "Regular, 120 credits" },
    { name: "Junia AI", value: 59, note: "Scale Starter, 68 articles" },
    { name: "Semrush Content Toolkit", value: 60, note: "unlimited standard articles" },
    { name: "SEObot", value: 199, note: "50 articles, the plan that covers 30" },
    { name: "Byword", value: 99, note: "Starter, 25 articles", reference: true },
  ],
};

export default chart;
