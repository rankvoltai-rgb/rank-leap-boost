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
import { AnswerSpacePage } from "@/components/features/answer-space-research/AnswerSpacePage";
import { CitationWriterPage } from "@/components/features/citation-ready-writer/CitationWriterPage";
import { CitationTrackingPage } from "@/components/features/citation-tracking/CitationTrackingPage";
import { AuthorityBacklinksPage } from "@/components/features/authority-backlinks/AuthorityBacklinksPage";
import { RedditPresencePage } from "@/components/features/reddit-presence/RedditPresencePage";
import { BrandVoicePage } from "@/components/features/brand-voice/BrandVoicePage";
import { SeoGeoScorePage } from "@/components/features/seo-geo-score/SeoGeoScorePage";
import { ExploreMore } from "@/components/ExploreMore";
import { getFeature, type Feature } from "@/data/features";
import { featureHead } from "@/lib/feature-head";

/* Features with a layout of their own. Kept inside this route, not as a
   static route beside it, so every `/features/$slug` link resolves here and
   the head (featureHead) stays shared. A `framed` layout is drawn in the
   landing page's frame, so the page goes white and the navbar draws the
   hairline rails the layout continues. */
const LAYOUTS: Partial<
  Record<string, { Body: ComponentType<{ feature: Feature }>; framed?: boolean }>
> = {
  "answer-space-research": { Body: AnswerSpacePage, framed: true },
  "citation-ready-writer": { Body: CitationWriterPage, framed: true },
  "auto-publishing": { Body: AutoPublishingPage, framed: true },
  "citation-tracking": { Body: CitationTrackingPage, framed: true },
  "authority-backlinks": { Body: AuthorityBacklinksPage, framed: true },
  "reddit-presence": { Body: RedditPresencePage, framed: true },
  "brand-voice": { Body: BrandVoicePage, framed: true },
  "seo-geo-score": { Body: SeoGeoScorePage, framed: true },
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
  const layout = LAYOUTS[slug];
  if (layout) {
    const { Body, framed = false } = layout;
    return (
      <div className={framed ? "min-h-screen bg-white" : "min-h-screen bg-background"}>
        <Navbar framed={framed} />
        <main>
          <Body feature={feature} />
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
