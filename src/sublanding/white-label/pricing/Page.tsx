import { MotionConfig } from "motion/react";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { ExploreMore } from "@/components/ExploreMore";
import { Billing } from "./Billing";
import { Closing } from "./Closing";
import { LINKED, PATH } from "./content";
import { Hero } from "./Hero";
import { MarginSection } from "./MarginSection";
import { MarketRates } from "./MarketRates";
import { Packaging } from "./Packaging";
import { Questions } from "./Questions";

/**
 * /white-label/pricing, read like a cost sheet: the per-site price (hero), the
 * visitor's own margin, how to package it, what the market reports, how the
 * invoice moves, the questions, and the close.
 */
export function WhiteLabelPricingPage() {
  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-background">
        <Navbar />
        <main>
          <Hero />
          <MarginSection />
          <Packaging />
          <MarketRates />
          <Billing />
          <Questions />
          <Closing />
          <ExploreMore path={PATH} exclude={LINKED} />
        </main>
        <Footer />
      </div>
    </MotionConfig>
  );
}
