/**
 * The <head> for a sublanding page: meta tags, canonical, and one JSON-LD
 * graph (WebPage, the Rankbox SoftwareApplication, breadcrumbs, FAQ).
 *
 * Invisible plumbing only. Every word passed in comes from the page's own
 * content.ts; nothing here renders on the page.
 */
import { PLAN } from "@/data/pricing";

export const SITE = "https://rankbox.xyz";

export interface HeadFaq {
  q: string;
  a: string;
}

/** The middle breadcrumb for each section a sublanding page can live in. */
const SECTION_CRUMB: Record<string, { name: string; path: string }> = {
  solutions: { name: "Solutions", path: "/solutions" },
  tools: { name: "Free tools", path: "/tools" },
  alternatives: { name: "Alternatives", path: "/alternatives" },
};

export function sublandingHead({
  path,
  name,
  title,
  description,
  headline,
  keywords,
  faqs,
  featureList,
  pageType = "WebPage",
  graph: extra = [],
}: {
  /** The route, e.g. "/solutions/autonomous-geo". */
  path: string;
  /** The last breadcrumb. */
  name: string;
  title: string;
  description: string;
  /** The page's H1 as text. */
  headline: string;
  keywords: string[];
  faqs: HeadFaq[];
  /** What Rankbox does, as SoftwareApplication.featureList. Shipped features only. */
  featureList: string[];
  /** "CollectionPage" for a hub that lists other pages. */
  pageType?: "WebPage" | "CollectionPage";
  /** Any further JSON-LD nodes the page needs (an ItemList, a HowTo). */
  graph?: Record<string, unknown>[];
}) {
  const url = `${SITE}${path}`;
  const section = path.split("/")[1] ?? "";
  const crumb = SECTION_CRUMB[section];
  const trail = [
    { name: "Home", item: `${SITE}/` },
    ...(crumb && crumb.path !== path ? [{ name: crumb.name, item: `${SITE}${crumb.path}` }] : []),
    { name, item: url },
  ];

  const graph: Record<string, unknown>[] = [
    {
      "@type": pageType,
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
    },
    {
      // No aggregateRating: there are no real reviews to cite yet.
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
      itemListElement: trail.map((t, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: t.name,
        item: t.item,
      })),
    },
    ...(faqs.length
      ? [
          {
            "@type": "FAQPage",
            "@id": `${url}#faq`,
            mainEntity: faqs.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          },
        ]
      : []),
    ...extra,
  ];

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
