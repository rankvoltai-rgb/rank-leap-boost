import { RANKBOX_BAR, type PriceChart } from "./shared";

const chart: PriceChart = {
  title: "What each Surfer SEO alternative costs a month",
  subtitle: "Entry plan, billed monthly. Units differ: most sell an editor or report, not an article",
  checkedOn: "2026-09-23",
  bars: [
    RANKBOX_BAR,
    { name: "NeuronWriter", value: 23, note: "Bronze, 25 content analyses" },
    { name: "PageOptimizer Pro", value: 40, note: "Basic, 20 credits" },
    { name: "Frase", value: 49, note: "Starter, 10 articles" },
    { name: "Content Harmony", value: 50, note: "5 content workflows" },
    { name: "Scalenut", value: 59, note: "Starter, 5 GEO articles" },
    { name: "Semrush Content Toolkit", value: 60, note: "5 SEO-boosted articles" },
    { name: "Dashword", value: 99, note: "Startup, 30 content reports" },
    { name: "Clearscope", value: 129, note: "Essentials, 20 Drafts" },
    { name: "Surfer SEO", value: 59, note: "Discovery, 10 Documents", reference: true },
  ],
};

export default chart;
