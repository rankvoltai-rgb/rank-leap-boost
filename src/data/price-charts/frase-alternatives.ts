import { RANKBOX_BAR, type PriceChart } from "./shared";

const chart: PriceChart = {
  title: "What each Frase alternative costs a month",
  subtitle: "Cheapest published plan, billed monthly (MarketMuse publishes no prices)",
  checkedOn: "2026-09-23",
  bars: [
    RANKBOX_BAR,
    { name: "NeuronWriter", value: 23, note: "Bronze, 25 content analyses" },
    { name: "PageOptimizer Pro", value: 40, note: "Basic, 20 credits" },
    { name: "Content Harmony", value: 50, note: "5 briefs with keyword reports" },
    { name: "Surfer SEO", value: 59, note: "Discovery, 1 seat, no AI tracking" },
    { name: "Scalenut", value: 59, note: "Starter, 5 GEO articles" },
    { name: "Semrush Content Toolkit", value: 60, note: "drafts plus 5 SEO-boosted" },
    { name: "Clearscope", value: 129, note: "Essentials, 20 Drafts" },
    { name: "Frase", value: 49, note: "Starter, 10 articles", reference: true },
  ],
};

export default chart;
