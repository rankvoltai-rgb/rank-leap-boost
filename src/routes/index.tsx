import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { DashboardShowcase } from "@/components/landing/DashboardShowcase";
import { SuccessStories } from "@/components/landing/SuccessStories";
import { GrowTraffic } from "@/components/landing/GrowTraffic";
import { EverythingYouNeed } from "@/components/landing/EverythingYouNeed";
import { ExampleArticles } from "@/components/landing/ExampleArticles";
import { PricingBand } from "@/components/landing/PricingBand";
import { Guarantee } from "@/components/landing/Guarantee";
import { ClosingCTA } from "@/components/landing/ClosingCTA";
import { FAQ, FAQS } from "@/components/landing/FAQ";
import { Footer } from "@/components/landing/Footer";
import { organizationNode } from "@/data/company";
import { PLAN } from "@/data/pricing";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Rankbox — Get Found by ChatGPT, Gemini & AI Search" },
      {
        name: "description",
        content:
          "Built for founders: Rankbox researches, writes and publishes daily articles on autopilot to get you cited by ChatGPT, Perplexity and Google AI Overviews.",
      },
      { property: "og:title", content: "Rankbox — Get Found by ChatGPT, Gemini & AI Search" },
      {
        property: "og:description",
        content:
          "Daily AI-written articles engineered for AI search citations and Google rankings, fully on autopilot. Built for growth-minded founders.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      // Without these the homepage inherits the root's older "AI Traffic on Autopilot" card.
      { name: "twitter:title", content: "Rankbox — Get Found by ChatGPT, Gemini & AI Search" },
      {
        name: "twitter:description",
        content:
          "Daily AI-written articles engineered for AI search citations and Google rankings, fully on autopilot. Built for growth-minded founders.",
      },
    ],
    links: [{ rel: "canonical", href: "https://rankbox.xyz/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            organizationNode(),
            {
              "@type": "WebSite",
              "@id": "https://rankbox.xyz/#website",
              name: "Rankbox",
              url: "https://rankbox.xyz/",
              publisher: { "@id": "https://rankbox.xyz/#organization" },
            },
            {
              "@type": "Product",
              name: "Rankbox",
              description:
                "AI-powered growth engine that researches your buyers' questions, writes daily articles, publishes to your site, and builds backlinks to get your brand cited by AI search engines and ranked on Google.",
              brand: { "@id": "https://rankbox.xyz/#organization" },
              offers: {
                "@type": "Offer",
                price: String(PLAN.monthly),
                priceCurrency: "USD",
                url: "https://rankbox.xyz/",
              },
            },
            {
              "@type": "FAQPage",
              mainEntity: FAQS.map((f) => ({
                "@type": "Question",
                name: f.q,
                acceptedAnswer: { "@type": "Answer", text: f.a },
              })),
            },
          ],
        }),
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    // Pure white, like Rankaria: the page frame's hairlines are drawn for it.
    <div className="min-h-screen bg-white">
      {/* Framed: the bar's rails run on into the hero's. */}
      <Navbar framed />
      <main>
        <Hero />
        <DashboardShowcase />
        <SuccessStories />
        <GrowTraffic />
        <EverythingYouNeed />
        <ExampleArticles />
        <PricingBand />
        <Guarantee />
        <FAQ />
        <ClosingCTA />
      </main>
      <Footer />
    </div>
  );
}
