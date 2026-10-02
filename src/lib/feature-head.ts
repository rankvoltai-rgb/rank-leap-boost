/**
 * The <head> every feature page shares: title, description, canonical, Open
 * Graph, Twitter card, and one JSON-LD graph (WebPage, SoftwareApplication,
 * BreadcrumbList, FAQPage). Used by /features/$slug and by any feature with
 * its own route, so the structured data can't drift between them.
 *
 * The FAQPage entries are the page's visible FAQ, never a separate list:
 * structured data that says something the page doesn't is a policy violation.
 */
import { featureH1, type Feature } from "@/data/features";
import { PLAN } from "@/data/pricing";

export const SITE = "https://rankbox.xyz";

export function featureUrl(slug: string): string {
  return `${SITE}/features/${slug}`;
}

/** The JSON-LD graph, exported so tests can check it against the page. */
export function featureGraph(feature: Feature): Record<string, unknown>[] {
  const url = featureUrl(feature.slug);
  return [
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
        // The plan's real list price, from the one place prices live.
        price: PLAN.monthly.toFixed(2),
        priceCurrency: "USD",
        url: `${SITE}/pricing`,
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
  ];
}

export function featureHead(feature: Feature) {
  const url = featureUrl(feature.slug);
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
          "@graph": featureGraph(feature),
        }),
      },
    ],
  };
}
