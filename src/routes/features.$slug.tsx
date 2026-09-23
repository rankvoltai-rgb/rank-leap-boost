import { createFileRoute, notFound, Link } from "@tanstack/react-router";
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
} from "@/components/features/FeatureSections";
import { ExploreMore } from "@/components/ExploreMore";
import { featureH1, getFeature } from "@/data/features";

const SITE = "https://rankbox.xyz";

export const Route = createFileRoute("/features/$slug")({
  loader: ({ params }) => {
    if (!getFeature(params.slug)) throw notFound();
  },
  head: ({ params }) => {
    const url = `${SITE}/features/${params.slug}`;
    const feature = getFeature(params.slug);
    if (!feature) {
      return { meta: [{ title: "Feature not found — Rankbox" }] };
    }
    return {
      meta: [
        { title: feature.metaTitle },
        { name: "description", content: feature.metaDescription },
        { property: "og:title", content: feature.metaTitle },
        { property: "og:description", content: feature.metaDescription },
        { property: "og:type", content: "website" },
        { property: "og:url", content: url },
        { property: "og:site_name", content: "Rankbox" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: feature.metaTitle },
        { name: "twitter:description", content: feature.metaDescription },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "WebPage",
                "@id": `${url}#webpage`,
                url,
                name: feature.metaTitle,
                headline: featureH1(feature),
                description: feature.metaDescription,
                inLanguage: "en",
                isPartOf: { "@id": `${SITE}/#website` },
                breadcrumb: { "@id": `${url}#breadcrumb` },
                about: { "@id": `${url}#software` },
              },
              {
                "@type": "SoftwareApplication",
                "@id": `${url}#software`,
                name: `Rankbox ${feature.name}`,
                applicationCategory: "BusinessApplication",
                operatingSystem: "Web",
                url,
                description: feature.subhead,
                featureList: feature.benefits.map((b) => `${b.title}: ${b.body}`),
                publisher: { "@id": `${SITE}/#organization` },
                offers: {
                  "@type": "Offer",
                  price: "99",
                  priceCurrency: "USD",
                  url: `${url}#pricing`,
                },
              },
              {
                "@type": "BreadcrumbList",
                "@id": `${url}#breadcrumb`,
                itemListElement: [
                  { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
                  { "@type": "ListItem", position: 2, name: "Features", item: `${SITE}/features` },
                  { "@type": "ListItem", position: 3, name: feature.name, item: url },
                ],
              },
              {
                "@type": "FAQPage",
                "@id": `${url}#faq`,
                mainEntity: feature.faqs.map((f) => ({
                  "@type": "Question",
                  name: f.q,
                  acceptedAnswer: { "@type": "Answer", text: f.a },
                })),
              },
            ],
          }),
        },
      ],
    };
  },
  component: FeaturePage,
  notFoundComponent: FeatureNotFound,
  errorComponent: FeatureError,
});

/* The landing page's rhythm, rebuilt around one feature: blue hero, proof of
   what it does, how it works, where it sits in the engine, then the same
   pricing, FAQ, and closing CTA the landing ends on. Section ids (top, proof,
   pricing, faq) match the landing so the shared navbar's anchors work here. */
function FeaturePage() {
  const { slug } = Route.useParams();
  const feature = getFeature(slug)!;
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

function FeatureNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-5 text-center">
      <h1 className="font-display text-3xl font-semibold text-ink">Feature not found</h1>
      <p className="text-muted-foreground">That feature page doesn't exist.</p>
      <Link
        to="/features"
        className="rounded-xl bg-ink px-5 py-3 text-sm font-semibold text-background"
      >
        Browse all features
      </Link>
    </div>
  );
}

function FeatureError() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-5 text-center">
      <h1 className="font-display text-3xl font-semibold text-ink">Something went wrong</h1>
      <Link
        to="/features"
        className="rounded-xl bg-ink px-5 py-3 text-sm font-semibold text-background"
      >
        Browse all features
      </Link>
    </div>
  );
}
