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
import { FAQ } from "@/components/landing/FAQ";
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
