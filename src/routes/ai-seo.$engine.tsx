import type { ComponentType } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { plainText } from "@/lib/inline-md";
import { ChatgptGuidePage } from "@/components/ai-seo/chatgpt/ChatgptGuidePage";
import { GoogleAiOverviewsGuidePage } from "@/components/ai-seo/google-ai-overviews/GoogleAiOverviewsGuidePage";
import { GeminiGuidePage } from "@/components/ai-seo/gemini/GeminiGuidePage";
import { ClaudeGuidePage } from "@/components/ai-seo/claude/ClaudeGuidePage";
import { PerplexityGuidePage } from "@/components/ai-seo/perplexity/PerplexityGuidePage";
import { CopilotGuidePage } from "@/components/ai-seo/copilot/CopilotGuidePage";
import { GrokGuidePage } from "@/components/ai-seo/grok/GrokGuidePage";
import { MetaAiGuidePage } from "@/components/ai-seo/meta-ai/MetaAiGuidePage";
import { DeepseekGuidePage } from "@/components/ai-seo/deepseek/DeepseekGuidePage";
import { MistralGuidePage } from "@/components/ai-seo/mistral/MistralGuidePage";
import { ManusGuidePage } from "@/components/ai-seo/manus/ManusGuidePage";
import { getEngine } from "@/data/ai-seo/engines";
import { guideReadingMinutes, guideWordCount, loadGuide } from "@/data/ai-seo/guides";
import type { EngineGuide } from "@/data/ai-seo/types";

const SITE = "https://rankbox.xyz";

/* Every guide has a layout of its own, drawn in the landing page's frame, so
   no two are one template with the engine swapped. The head below stays
   shared. */
const LAYOUTS: Record<string, ComponentType<{ guide: EngineGuide }>> = {
  chatgpt: ChatgptGuidePage,
  "google-ai-overviews": GoogleAiOverviewsGuidePage,
  gemini: GeminiGuidePage,
  claude: ClaudeGuidePage,
  perplexity: PerplexityGuidePage,
  copilot: CopilotGuidePage,
  grok: GrokGuidePage,
  "meta-ai": MetaAiGuidePage,
  deepseek: DeepseekGuidePage,
  mistral: MistralGuidePage,
  manus: ManusGuidePage,
};

export const Route = createFileRoute("/ai-seo/$engine")({
  /* The guide's text is its own chunk, fetched here rather than imported at
     the top: anything the route's head needs stays in the shared bundle, and
     five long guides don't belong in every visitor's first download. */
  loader: async ({ params }) => {
    const engine = getEngine(params.engine);
    if (!engine) throw notFound();
    return { guide: await loadGuide(engine.slug) };
  },
  head: ({ params, loaderData }) => {
    const guide = loaderData?.guide;
    const engine = getEngine(params.engine);
    if (!guide || !engine) return { meta: [{ title: "Guide not found — Rankbox" }] };

    const url = `${SITE}/ai-seo/${engine.slug}`;
    const headline = `${guide.headline.lead} ${guide.headline.accent}`;
    return {
      meta: [
        { title: guide.metaTitle },
        { name: "description", content: guide.metaDescription },
        { name: "keywords", content: guide.keywords.join(", ") },
        { property: "og:title", content: guide.metaTitle },
        { property: "og:description", content: guide.metaDescription },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
        { property: "og:site_name", content: "Rankbox" },
        { property: "article:published_time", content: engine.published },
        { property: "article:modified_time", content: engine.updated },
        { property: "article:section", content: "AI SEO" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: guide.metaTitle },
        { name: "twitter:description", content: guide.metaDescription },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "TechArticle",
                "@id": `${url}#article`,
                headline,
                name: guide.metaTitle,
                description: guide.metaDescription,
                /* The quotable answer, handed to answer engines directly
                   rather than left to be scraped out of the layout. */
                abstract: plainText(guide.shortAnswer),
                datePublished: engine.published,
                dateModified: engine.updated,
                wordCount: guideWordCount(guide),
                keywords: guide.keywords.join(", "),
                articleSection: "AI SEO",
                inLanguage: "en",
                mainEntityOfPage: { "@id": `${url}#webpage` },
                author: { "@type": "Organization", name: "Rankbox", url: SITE },
                publisher: { "@type": "Organization", name: "Rankbox", url: SITE },
                about: {
                  "@type": "SoftwareApplication",
                  name: engine.name,
                  applicationCategory: "AI assistant",
                  author: { "@type": "Organization", name: engine.vendor },
                  ...(guide.sameAs.length ? { sameAs: guide.sameAs } : {}),
                },
                citation: guide.sources.map((s) => ({
                  "@type": "CreativeWork",
                  name: s.title,
                  url: s.href,
                  publisher: { "@type": "Organization", name: s.publisher },
                })),
              },
              {
                "@type": "WebPage",
                "@id": `${url}#webpage`,
                url,
                name: guide.metaTitle,
                inLanguage: "en",
                isPartOf: { "@id": `${SITE}/#website` },
                breadcrumb: { "@id": `${url}#breadcrumb` },
              },
              {
                "@type": "HowTo",
                "@id": `${url}#howto`,
                name: `How to optimize your site for ${engine.name}`,
                description: plainText(guide.shortAnswer),
                step: guide.checklist.map((c, i) => ({
                  "@type": "HowToStep",
                  position: i + 1,
                  name: c.title,
                  text: plainText(c.detail),
                  url: `${url}#checklist`,
                })),
              },
              {
                "@type": "FAQPage",
                "@id": `${url}#faq`,
                mainEntity: guide.faqs.map((f) => ({
                  "@type": "Question",
                  name: f.q,
                  acceptedAnswer: { "@type": "Answer", text: plainText(f.a) },
                })),
              },
              {
                "@type": "BreadcrumbList",
                "@id": `${url}#breadcrumb`,
                itemListElement: [
                  { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
                  {
                    "@type": "ListItem",
                    position: 2,
                    name: "AI SEO guides",
                    item: `${SITE}/ai-seo`,
                  },
                  { "@type": "ListItem", position: 3, name: `${engine.name} SEO`, item: url },
                ],
              },
            ],
          }),
        },
      ],
    };
  },
  component: GuidePage,
  notFoundComponent: GuideNotFound,
});

function GuidePage() {
  const { guide } = Route.useLoaderData();
  const Layout = LAYOUTS[guide.slug];
  // Keyed so switching engines starts each guide fresh (scroll-spy, progress, checklist).
  return (
    <div className="min-h-screen bg-white">
      <Navbar framed />
      <main>{Layout && <Layout key={guide.slug} guide={guide} />}</main>
      <Footer />
    </div>
  );
}

function GuideNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-5 text-center">
      <h1 className="font-display text-3xl font-semibold text-ink">Guide not found</h1>
      <p className="text-muted-foreground">We haven&rsquo;t written a guide for that engine yet.</p>
      <Link
        to="/ai-seo"
        className="rounded-xl bg-ink px-5 py-3 text-sm font-semibold text-background"
      >
        See all AI SEO guides
      </Link>
    </div>
  );
}
