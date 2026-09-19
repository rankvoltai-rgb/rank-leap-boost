import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
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
      { title: "Rankbox — Get Found by ChatGPT, Gemini & AI Search" },
      {
        name: "description",
        content:
          "Rankbox is the AI growth engine that researches, writes, and publishes daily articles engineered to get your brand cited by ChatGPT, Perplexity, and Google AI Overviews — and ranked on Google.",
      },
      { property: "og:title", content: "Rankbox — Get Found by ChatGPT, Gemini & AI Search" },
      {
        property: "og:description",
        content:
          "Daily AI-written articles engineered for AI search citations and Google rankings, fully on autopilot. Built for growth-minded founders.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://rankbox.xyz/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Organization",
              "@id": "https://rankbox.xyz/#organization",
              name: "Rankbox",
              url: "https://rankbox.xyz/",
            },
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
                price: "99",
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
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
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
