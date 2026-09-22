import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Eyebrow, Reveal } from "@/components/landing/shared";
import { BlogCta } from "@/components/blog/ArticleChrome";
import { FaqList } from "@/components/ai-seo/sections";
import { ToolExplorer, ToolkitCard, ToolkitsSection, ToolsHero } from "@/components/tools/hub";
import { TOOLS, TOOL_CATEGORIES, type ToolCategoryId } from "@/data/tools";

const SITE = "https://rankbox.xyz";
const PAGE_URL = `${SITE}/tools`;

const TITLE = `${TOOLS.length} Free SEO & AI Search Tools — No Signup | Rankbox`;
const DESCRIPTION =
  "Free tools for Google and AI search: llms.txt and robots.txt generators, a robots.txt tester, an AI readiness check, schema, snippet preview, citation-readiness scoring, redirects and more.";

const FAQS = [
  {
    q: "Are these tools really free?",
    a: "Yes. Most run entirely in your browser and cost nothing to operate. The AI-powered tools call a model on our side and are free too, within fair-use limits. None require an account.",
  },
  {
    q: "Do you store what I paste in?",
    a: "Instant tools never send your text anywhere — the analysis happens in the tab. The AI tools send only the text you submit to generate a result, and we don't keep it. The readiness check fetches the URL you enter and keeps no copy of the page.",
  },
  {
    q: "Which tool should I start with?",
    a: "Run the AI Search Readiness Check on your homepage. It tells you in ten seconds whether AI engines can read you at all, and the failed checks link to the generator that fixes each one.",
  },
  {
    q: "What's the difference between these and Rankbox itself?",
    a: "The tools fix one thing at a time, by hand. Rankbox tracks your AI visibility daily, finds the questions you're losing, and researches, writes and publishes the content that wins them. The tools are the manual version of the first step.",
  },
];

function isCategory(v: unknown): v is ToolCategoryId {
  return TOOL_CATEGORIES.some((c) => c.id === v);
}

export const Route = createFileRoute("/tools/")({
  validateSearch: (search: Record<string, unknown>): { category?: ToolCategoryId } =>
    isCategory(search.category) ? { category: search.category } : {},
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: PAGE_URL },
      { property: "og:site_name", content: "Rankbox" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
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
              name: TITLE,
              description: DESCRIPTION,
              inLanguage: "en",
              isPartOf: { "@id": `${SITE}/#website` },
              publisher: { "@type": "Organization", name: "Rankbox", url: SITE },
              mainEntity: {
                "@type": "ItemList",
                itemListElement: TOOLS.map((t, i) => ({
                  "@type": "ListItem",
                  position: i + 1,
                  url: `${SITE}/tools/${t.slug}`,
                  name: t.name,
                })),
              },
            },
            {
              "@type": "FAQPage",
              "@id": `${PAGE_URL}#faq`,
              mainEntity: FAQS.map((f) => ({
                "@type": "Question",
                name: f.q,
                acceptedAnswer: { "@type": "Answer", text: f.a },
              })),
            },
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
                { "@type": "ListItem", position: 2, name: "Free Tools", item: PAGE_URL },
              ],
            },
          ],
        }),
      },
    ],
  }),
  component: ToolsIndex,
});

function ToolsIndex() {
  const { category } = Route.useSearch();
  const navigate = Route.useNavigate();
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <ToolsHero />
        <ToolExplorer
          category={category}
          onCategory={(c) =>
            navigate({ search: c ? { category: c } : {}, replace: true, resetScroll: false })
          }
        />

        <section aria-label="Start here" className="px-5 pb-16 lg:hidden">
          <ToolkitCard id="readable" className="mx-auto max-w-lg shadow-2" />
        </section>

        <ToolkitsSection />

        <section aria-labelledby="faq-title" className="py-20 sm:py-28">
          <div className="mx-auto max-w-3xl px-5">
            <Reveal className="text-center">
              <Eyebrow className="mb-4">FAQ</Eyebrow>
              <h2
                id="faq-title"
                className="font-display text-balance text-3xl font-semibold tracking-tight text-ink sm:text-4xl"
              >
                Questions about the tools
              </h2>
            </Reveal>
            <FaqList faqs={FAQS} />
          </div>
        </section>

        <BlogCta title="Put the tools on autopilot" />
      </main>
      <Footer />
    </div>
  );
}
