import type { ComponentType } from "react";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Pricing } from "@/components/landing/Pricing";
import {
  FeatureHero,
  FeatureSpecs,
  FeatureProblem,
  FeatureBenefits,
  FeatureHowItWorks,
  FeatureEngine,
  FeatureProof,
  FeatureFAQ,
  FeatureCTA,
  FeatureNotFound,
  FeatureError,
} from "@/components/features/FeatureSections";
import { AutoPublishingPage } from "@/components/features/auto-publishing/AutoPublishingPage";
import { ExploreMore } from "@/components/ExploreMore";
import { getFeature, type Feature } from "@/data/features";
import { featureHead } from "@/lib/feature-head";

/* Features with a layout of their own. Kept inside this route, not as a
   static route beside it, so every `/features/$slug` link resolves here and
   the head (featureHead) stays shared. */
const LAYOUTS: Partial<Record<string, ComponentType<{ feature: Feature }>>> = {
  "auto-publishing": AutoPublishingPage,
};

export const Route = createFileRoute("/features/$slug")({
  loader: ({ params }) => {
    if (!getFeature(params.slug)) throw notFound();
  },
  head: ({ params }) => {
    const feature = getFeature(params.slug);
    if (!feature) {
      return { meta: [{ title: "Feature not found — Rankbox" }] };
    }
    return featureHead(feature);
  },
  component: FeaturePage,
  notFoundComponent: FeatureNotFound,
  errorComponent: FeatureError,
});

/* The landing page's rhythm, rebuilt around one feature: blue hero, proof of
   what it does, how it works, where it sits in the engine, then the same
   pricing, FAQ, and closing CTA the landing ends on. Section ids (top, proof,
   pricing, faq) match the landing so the shared navbar's anchors work here.
   A feature listed in LAYOUTS swaps the body for its own. */
function FeaturePage() {
  const { slug } = Route.useParams();
  const feature = getFeature(slug)!;
  const Layout = LAYOUTS[slug];
  if (Layout) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main>
          <Layout feature={feature} />
        </main>
        <Footer />
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <FeatureHero feature={feature} />
        <FeatureSpecs feature={feature} />
        <FeatureProblem feature={feature} />
        <FeatureBenefits feature={feature} />
        <FeatureHowItWorks feature={feature} />
        <FeatureEngine feature={feature} />
        <FeatureProof feature={feature} />
        <ExploreMore path={`/features/${feature.slug}`} />
        <div className="border-t border-border bg-surface/40">
          <Pricing />
        </div>
        <FeatureFAQ feature={feature} />
        <FeatureCTA feature={feature} />
      </main>
      <Footer />
    </div>
  );
}
