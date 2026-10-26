import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { AiSeoHub } from "@/components/ai-seo/hub/AiSeoHub";
import { plainText } from "@/lib/inline-md";
import { ENGINES } from "@/data/ai-seo/engines";
import { loadGuides } from "@/data/ai-seo/guides";
import { OVERVIEW } from "@/data/ai-seo/overview";

const SITE = "https://rankbox.xyz";
const PAGE_URL = `${SITE}/ai-seo`;
/* The newer of the hub's own copy and the newest guide. */
const UPDATED = [OVERVIEW.updated, ...ENGINES.map((e) => e.updated)].sort().at(-1)!;

export const Route = createFileRoute("/ai-seo/")({
  /* Only the matrix rows travel: the hub never needs a guide's body text. */
  loader: async () => ({
    profiles: (await loadGuides()).map((g) => ({ slug: g.slug, profile: g.profile })),
  }),
  head: () => ({
    meta: [
      { title: OVERVIEW.metaTitle },
      { name: "description", content: OVERVIEW.metaDescription },
      { name: "keywords", content: OVERVIEW.keywords.join(", ") },
      { property: "og:title", content: OVERVIEW.metaTitle },
      { property: "og:description", content: OVERVIEW.metaDescription },
      { property: "og:type", content: "website" },
      { property: "og:url", content: PAGE_URL },
      { property: "og:site_name", content: "Rankbox" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: OVERVIEW.metaTitle },
      { name: "twitter:description", content: OVERVIEW.metaDescription },
    ],
    links: [{ rel: "canonical", href: PAGE_URL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "CollectionPage",
              "@id": `${PAGE_URL}#webpage`,
              url: PAGE_URL,
              name: OVERVIEW.metaTitle,
              description: OVERVIEW.metaDescription,
              abstract: plainText(OVERVIEW.shortAnswer),
              dateModified: UPDATED,
              inLanguage: "en",
              isPartOf: { "@id": `${SITE}/#website` },
              mainEntity: { "@id": `${PAGE_URL}#list` },
              publisher: { "@type": "Organization", name: "Rankbox", url: SITE },
            },
            {
              "@type": "ItemList",
              "@id": `${PAGE_URL}#list`,
              itemListElement: ENGINES.map((e, i) => ({
                "@type": "ListItem",
                position: i + 1,
                name: `${e.name} SEO guide`,
                url: `${PAGE_URL}/${e.slug}`,
              })),
            },
            {
              "@type": "FAQPage",
              "@id": `${PAGE_URL}#faq`,
              mainEntity: OVERVIEW.faqs.map((f) => ({
                "@type": "Question",
                name: f.q,
                acceptedAnswer: { "@type": "Answer", text: plainText(f.a) },
              })),
            },
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
                { "@type": "ListItem", position: 2, name: "AI SEO guides", item: PAGE_URL },
              ],
            },
          ],
        }),
      },
    ],
  }),
  component: AiSeoIndex,
});

/* The body lives in src/components/ai-seo/hub: hero with the engine rail, the
   source map, the cross-engine matrix, shared vs per-engine, where to start,
   FAQ, sources and the closing band, all in the landing page's frame. */
function AiSeoIndex() {
  const { profiles } = Route.useLoaderData();
  return (
    // Pure white, like the landing: the frame's hairlines are drawn for it.
    <div className="min-h-screen bg-white">
      <Navbar framed />
      <main>
        <AiSeoHub profiles={profiles} updated={UPDATED} />
      </main>
      <Footer />
    </div>
  );
}
