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
      { title: "Rankvolt — Get Google & ChatGPT Traffic on Autopilot" },
      {
        name: "description",
        content:
          "Grow organic traffic on autopilot. AI researches keywords, writes daily SEO articles, publishes to your site, and builds backlinks while you sleep.",
      },
      { property: "og:title", content: "Rankvolt — Get Google & ChatGPT Traffic on Autopilot" },
      {
        property: "og:description",
        content:
          "Daily AI-written, SEO-optimized articles and backlink building, fully on autopilot. Trusted by 3,000+ businesses.",
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
                "AI-powered SEO automation that researches keywords, writes daily SEO articles, publishes to your site, and builds backlinks to grow organic traffic on Google and AI search engines.",
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
