import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { PersonalAgent } from "@/components/landing/PersonalAgent";
import { SuccessStories } from "@/components/landing/SuccessStories";
import { GrowTraffic } from "@/components/landing/GrowTraffic";
import { EverythingYouNeed } from "@/components/landing/EverythingYouNeed";
import { ExampleArticles } from "@/components/landing/ExampleArticles";
import { Pricing } from "@/components/landing/Pricing";
import { Guarantee } from "@/components/landing/Guarantee";
import { Testimonials } from "@/components/landing/Testimonials";
import { FinalCTA } from "@/components/landing/FinalCTA";
import { FAQ, FAQS } from "@/components/landing/FAQ";
import { Footer } from "@/components/landing/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Rankvolt — Become the Answer AI Recommends" },
      {
        name: "description",
        content:
          "Rankvolt is the AI growth engine that researches, writes, and publishes daily articles engineered to get your brand cited by ChatGPT, Perplexity, and Google AI Overviews — and ranked on Google.",
      },
      { property: "og:title", content: "Rankvolt — Become the Answer AI Recommends" },
      {
        property: "og:description",
        content:
          "Daily AI-written articles engineered for AI search citations and Google rankings, fully on autopilot. Built for growth-minded founders.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://rankvolt.top/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Organization",
              "@id": "https://rankvolt.top/#organization",
              name: "Rankvolt",
              url: "https://rankvolt.top/",
            },
            {
              "@type": "WebSite",
              "@id": "https://rankvolt.top/#website",
              name: "Rankvolt",
              url: "https://rankvolt.top/",
              publisher: { "@id": "https://rankvolt.top/#organization" },
            },
            {
              "@type": "Product",
              name: "Rankvolt",
              description:
                "AI-powered growth engine that researches your buyers' questions, writes daily articles, publishes to your site, and builds backlinks to get your brand cited by AI search engines and ranked on Google.",
              brand: { "@id": "https://rankvolt.top/#organization" },
              offers: {
                "@type": "Offer",
                price: "99",
                priceCurrency: "USD",
                url: "https://rankvolt.top/",
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
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <PersonalAgent />
        <SuccessStories />
        <GrowTraffic />
        <EverythingYouNeed />
        <ExampleArticles />
        <Pricing />
        <Guarantee />
        <Testimonials />
        <FinalCTA />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
}
