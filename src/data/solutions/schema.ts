/**
 * The head for a /solutions page: meta tags, canonical, and one JSON-LD graph
 * (WebPage, the Rankbox SoftwareApplication, breadcrumbs, FAQ, and an optional
 * ItemList). Both routes build theirs here so the two can't drift.
 */
import { PLAN } from "@/data/pricing";
import type { Faq } from "@/data/ai-seo/types";

const SITE = "https://rankbox.xyz";

export function solutionHead({
  slug,
  name,
  title,
  description,
  headline,
  keywords,
  faqs,
  featureList,
  itemList,
}: {
  slug: string;
  /** The breadcrumb name. */
  name: string;
  title: string;
  description: string;
  headline: string;
  keywords: string[];
  faqs: Faq[];
  featureList: string[];
  itemList?: { name: string; items: { name: string; url: string; description: string }[] };
}) {
  const url = `${SITE}/solutions/${slug}`;
  const graph: Record<string, unknown>[] = [
    {
      "@type": "WebPage",
      "@id": `${url}#webpage`,
      url,
      name: title,
      headline,
      description,
      inLanguage: "en",
      keywords: keywords.join(", "),
      isPartOf: { "@id": `${SITE}/#website` },
      breadcrumb: { "@id": `${url}#breadcrumb` },
      about: { "@id": `${url}#software` },
      ...(itemList ? { mainEntity: { "@id": `${url}#tools` } } : {}),
    },
    {
      "@type": "SoftwareApplication",
      "@id": `${url}#software`,
      name: "Rankbox",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      url: SITE,
      description,
      featureList,
      publisher: { "@id": `${SITE}/#organization` },
      offers: {
        "@type": "Offer",
        price: String(PLAN.monthly),
        priceCurrency: "USD",
        url: `${SITE}/pricing`,
      },
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${url}#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
        { "@type": "ListItem", position: 2, name, item: url },
      ],
    },
    {
      "@type": "FAQPage",
      "@id": `${url}#faq`,
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ];
  if (itemList) {
    graph.push({
      "@type": "ItemList",
      "@id": `${url}#tools`,
      name: itemList.name,
      numberOfItems: itemList.items.length,
      itemListElement: itemList.items.map((it, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: it.url,
        name: it.name,
        description: it.description,
      })),
    });
  }

  return {
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: url },
      { property: "og:site_name", content: "Rankbox" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
    ],
    links: [{ rel: "canonical", href: url }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({ "@context": "https://schema.org", "@graph": graph }),
      },
    ],
  };
}

export { SITE };
