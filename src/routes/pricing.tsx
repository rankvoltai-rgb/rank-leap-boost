import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import {
  IncludedFeatures,
  MobileStickyCTA,
  PlanCard,
  PricingFAQ,
  PricingFinalCTA,
  PricingHero,
  PricingProof,
  TheMath,
  TrialTimeline,
} from "@/components/pricing/PricingSections";
import { PLAN, PRICING_FAQS, TRIAL_DAYS, formatUsd } from "@/data/pricing";

const SITE = "https://rankbox.xyz";
const TITLE = "Pricing — One Plan, Everything Included | Rankbox";
const DESCRIPTION = `Rankbox is ${formatUsd(PLAN.monthly)}/month, with a ${TRIAL_DAYS}-day free trial. ${PLAN.articlesPerMonth} AI-optimized articles a month, authority backlinks, auto-publishing, and AI citation tracking. Cancel anytime.`;

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE}/pricing` },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
    ],
    links: [{ rel: "canonical", href: `${SITE}/pricing` }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "WebPage",
              "@id": `${SITE}/pricing#webpage`,
              url: `${SITE}/pricing`,
              name: TITLE,
              description: DESCRIPTION,
              isPartOf: { "@id": `${SITE}/#website` },
            },
            {
              "@type": "Product",
              name: `Rankbox ${PLAN.name}`,
              description:
                "AI growth engine that researches your buyers' questions, writes and publishes daily articles, builds backlinks, and tracks AI citations.",
              brand: { "@id": `${SITE}/#organization` },
              offers: [
                {
                  "@type": "Offer",
                  name: "Monthly",
                  price: String(PLAN.monthly),
                  priceCurrency: "USD",
                  url: `${SITE}/pricing`,
                  priceSpecification: {
                    "@type": "UnitPriceSpecification",
                    price: String(PLAN.monthly),
                    priceCurrency: "USD",
                    billingDuration: "P1M",
                  },
                },
              ],
            },
            {
              "@type": "FAQPage",
              mainEntity: PRICING_FAQS.map((f) => ({
                "@type": "Question",
                name: f.q,
                acceptedAnswer: { "@type": "Answer", text: f.a },
              })),
            },
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
                { "@type": "ListItem", position: 2, name: "Pricing", item: `${SITE}/pricing` },
              ],
            },
          ],
        }),
      },
    ],
  }),
  component: PricingPage,
});

function PricingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <PricingHero />
        <PlanCard />
        <TrialTimeline />
        <TheMath />
        <IncludedFeatures />
        <PricingProof />
        <PricingFAQ />
        <PricingFinalCTA />
      </main>
      <Footer />
      <MobileStickyCTA />
    </div>
  );
}
