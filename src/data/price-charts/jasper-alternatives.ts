import { RANKBOX_BAR, type PriceChart } from "./shared";

/* The least each pick costs a month on monthly billing. Seat products show
   their minimum purchase (ChatGPT Business and Claude Team sell 2 seats at $25
   minimum). WRITER publishes no price, so it has no bar. */
const chart: PriceChart = {
  title: "What each Jasper alternative costs a month",
  subtitle: "The least you can pay on monthly billing, entry plan",
  checkedOn: "2026-09-23",
  bars: [
    RANKBOX_BAR,
    { name: "Rytr", value: 9, note: "Unlimited, 1 user" },
    { name: "Copy.ai", value: 29, note: "Chat, 5 seats, no workflows" },
    { name: "Anyword", value: 49, note: "Starter, 1 seat" },
    { name: "Frase", value: 49, note: "Starter, 10 articles" },
    { name: "ChatGPT Business", value: 50, note: "2 seats at $25, the minimum" },
    { name: "Claude Team", value: 50, note: "2 seats at $25, the minimum" },
    { name: "Surfer", value: 59, note: "Discovery, 1 seat" },
    { name: "Writesonic", value: 99, note: "Starter, 15 articles" },
    { name: "Jasper", value: 69, note: "Pro, 1 seat", reference: true },
  ],
};

export default chart;
