import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import {
  FeatureHero,
  FeatureBenefits,
  FeatureHowItWorks,
  FeatureProof,
  FeatureFAQ,
  FeatureCTA,
} from "@/components/features/FeatureSections";
import { getFeature } from "@/data/features";

export const Route = createFileRoute("/features/$slug")({
  loader: ({ params }) => {
    if (!getFeature(params.slug)) throw notFound();
  },
  head: ({ params }) => {
    const url = `https://rankvolt.top/features/${params.slug}`;
    const feature = getFeature(params.slug);
    if (!feature) {
      return { meta: [{ title: "Feature not found — Rankvolt" }] };
    }
    return {
      meta: [
        { title: feature.metaTitle },
        { name: "description", content: feature.metaDescription },
        { property: "og:title", content: feature.metaTitle },
        { property: "og:description", content: feature.metaDescription },
        { property: "og:type", content: "website" },
        { property: "og:url", content: url },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "FAQPage",
                mainEntity: feature.faqs.map((f) => ({
                  "@type": "Question",
                  name: f.q,
                  acceptedAnswer: { "@type": "Answer", text: f.a },
                })),
              },
              {
                "@type": "BreadcrumbList",
                itemListElement: [
                  { "@type": "ListItem", position: 1, name: "Home", item: "https://rankvolt.top/" },
                  { "@type": "ListItem", position: 2, name: "Features", item: "https://rankvolt.top/features" },
                  { "@type": "ListItem", position: 3, name: feature.name, item: url },
                ],
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

function FeaturePage() {
  const { slug } = Route.useParams();
  const feature = getFeature(slug)!;
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <FeatureHero feature={feature} />
        <FeatureBenefits feature={feature} />
        <FeatureHowItWorks feature={feature} />
        <FeatureProof />
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
      <h1 className="font-display text-3xl font-bold text-ink">Feature not found</h1>
      <p className="text-muted-foreground">That feature page doesn't exist.</p>
      <Link to="/features" className="rounded-xl bg-ink px-5 py-3 text-sm font-semibold text-background">
        Browse all features
      </Link>
    </div>
  );
}

function FeatureError() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-5 text-center">
      <h1 className="font-display text-3xl font-bold text-ink">Something went wrong</h1>
      <Link to="/features" className="rounded-xl bg-ink px-5 py-3 text-sm font-semibold text-background">
        Browse all features
      </Link>
    </div>
  );
}