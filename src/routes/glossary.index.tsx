import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Eyebrow, Reveal } from "@/components/landing/shared";
import { BlogCta } from "@/components/blog/ArticleChrome";
import { FaqList } from "@/components/ai-seo/sections";
import { Explorer, HubHero, StartHere, TopicGrid } from "@/components/glossary/hub";
import { SITE, termUrl } from "@/components/glossary/shared";
import { HUB } from "@/data/glossary/hub";
import {
  CATEGORIES,
  GLOSSARY_UPDATED,
  TERMS_AZ,
  type GlossaryCategoryId,
} from "@/data/glossary/terms";
import { plainText } from "@/lib/inline-md";

const PAGE_URL = `${SITE}/glossary`;

function isCategory(v: unknown): v is GlossaryCategoryId {
  return CATEGORIES.some((c) => c.id === v);
}

export const Route = createFileRoute("/glossary/")({
  validateSearch: (search: Record<string, unknown>): { category?: GlossaryCategoryId } =>
    isCategory(search.category) ? { category: search.category } : {},
  head: () => ({
    meta: [
      { title: HUB.metaTitle },
      { name: "description", content: HUB.metaDescription },
      { name: "keywords", content: HUB.keywords.join(", ") },
      { property: "og:title", content: HUB.metaTitle },
      { property: "og:description", content: HUB.metaDescription },
      { property: "og:type", content: "website" },
      { property: "og:url", content: PAGE_URL },
      { property: "og:site_name", content: "Rankbox" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: HUB.metaTitle },
      { name: "twitter:description", content: HUB.metaDescription },
    ],
    /* Filtered views (?category=) are the same page narrowed, so they all
       point here. */
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
              name: HUB.metaTitle,
              description: HUB.metaDescription,
              dateModified: GLOSSARY_UPDATED,
              inLanguage: "en",
              isPartOf: { "@id": `${SITE}/#website` },
              mainEntity: { "@id": `${PAGE_URL}#set` },
              publisher: { "@type": "Organization", name: "Rankbox", url: SITE },
            },
            {
              "@type": "DefinedTermSet",
              "@id": `${PAGE_URL}#set`,
              name: "Rankbox AI Search Glossary",
              description:
                "Definitions of SEO, GEO, AEO and large-language-model search terms, each with sources and examples.",
              url: PAGE_URL,
              hasDefinedTerm: TERMS_AZ.map((t) => ({
                "@type": "DefinedTerm",
                "@id": `${termUrl(t.slug)}#term`,
                name: t.term,
                description: plainText(t.definition),
                url: termUrl(t.slug),
              })),
            },
            {
              "@type": "FAQPage",
              "@id": `${PAGE_URL}#faq`,
              mainEntity: HUB.faqs.map((f) => ({
                "@type": "Question",
                name: f.q,
                acceptedAnswer: { "@type": "Answer", text: plainText(f.a) },
              })),
            },
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
                { "@type": "ListItem", position: 2, name: "Glossary", item: PAGE_URL },
              ],
            },
          ],
        }),
      },
    ],
  }),
  component: GlossaryIndex,
});

function GlossaryIndex() {
  const { category } = Route.useSearch();
  const navigate = Route.useNavigate();
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HubHero />
        <Explorer
          category={category}
          onCategory={(c) =>
            navigate({ search: c ? { category: c } : {}, replace: true, resetScroll: false })
          }
        />

        <section aria-label="Start here" className="px-5 pb-16 lg:hidden">
          <StartHere className="mx-auto max-w-lg shadow-2" />
        </section>

        <TopicGrid />

        <section aria-labelledby="faq-title" className="py-20 sm:py-28">
          <div className="mx-auto max-w-3xl px-5">
            <Reveal className="text-center">
              <Eyebrow className="mb-4">FAQ</Eyebrow>
              <h2
                id="faq-title"
                className="font-display text-balance text-3xl font-semibold tracking-tight text-ink sm:text-4xl"
              >
                Questions about the vocabulary
              </h2>
            </Reveal>
            <FaqList faqs={HUB.faqs} />
          </div>
        </section>

        <BlogCta title="Put the glossary to work on your site" />
      </main>
      <Footer />
    </div>
  );
}
