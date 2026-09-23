import { RANKBOX_BAR, type PriceChart } from "./shared";

const chart: PriceChart = {
  title: "What each Writesonic alternative costs a month",
  subtitle: "Cheapest paid plan, billed monthly (Profound sells brands a free trial, then custom pricing)",
  checkedOn: "2026-09-23",
  bars: [
    RANKBOX_BAR,
    { name: "Otterly.AI", value: 29, note: "Lite, 15 prompts in 4 engines" },
    { name: "Frase", value: 49, note: "Starter, 10 articles, 50 prompts" },
    { name: "Ahrefs Brand Radar", value: 50, note: "custom prompt package, 2,500 checks" },
    { name: "Surfer SEO", value: 59, note: "Discovery, 1 seat, no AI tracking" },
    { name: "Jasper", value: 69, note: "Pro, 1 seat" },
    { name: "Peec AI", value: 95, note: "Starter, 50 prompts on 3 models" },
    { name: "Semrush AI Visibility Toolkit", value: 99, note: "25 prompts, 1 domain" },
    { name: "AthenaHQ", value: 295, note: "Starter, 3,600 credits (free tier below it)" },
    { name: "Writesonic", value: 99, note: "Starter, 50 prompts, 15 articles", reference: true },
  ],
};

export default chart;
