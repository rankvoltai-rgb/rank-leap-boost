import { useMemo, useRef } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import {
  AuthorCard,
  BlogCta,
  RailCta,
  ReadingProgress,
  ShareButtons,
  TableOfContents,
} from "@/components/blog/ArticleChrome";
import { GuideBlocks } from "@/components/ai-seo/blocks";
import { plainText } from "@/lib/inline-md";
import {
  Checklist,
  EngineHero,
  FactBand,
  FaqList,
  GuideHeading,
  OtherGuides,
  ShortAnswer,
  SourceList,
  Takeaways,
} from "@/components/ai-seo/sections";
import { ExploreMore } from "@/components/ExploreMore";
import { getEngine } from "@/data/ai-seo/engines";
import { guideReadingMinutes, guideWordCount, loadGuide } from "@/data/ai-seo/guides";
import type { EngineGuide } from "@/data/ai-seo/types";

const SITE = "https://rankbox.xyz";

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
  // Keyed so switching engines starts each guide fresh (scroll-spy, progress, checklist).
  return <Guide key={guide.slug} guide={guide} />;
}

function Guide({ guide }: { guide: EngineGuide }) {
  const engine = getEngine(guide.slug)!;
  const bodyRef = useRef<HTMLDivElement>(null);
  const url = `${SITE}/ai-seo/${engine.slug}`;
  const shareTitle = `${guide.headline.lead} ${guide.headline.accent}`;

  const toc = useMemo(
    () => [
      { id: "takeaways", text: "Key takeaways" },
      ...guide.sections.map((s) => ({ id: s.id, text: s.title })),
      { id: "checklist", text: "The action checklist" },
      { id: "faq", text: "FAQ" },
    ],
    [guide],
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <ReadingProgress target={bodyRef} />
        <EngineHero engine={engine} guide={guide} readingMinutes={guideReadingMinutes(guide)} />
        <FactBand engine={engine} guide={guide} />

        <div className="mx-auto grid max-w-6xl gap-12 px-5 py-12 lg:grid-cols-[minmax(0,1fr)_17rem] lg:gap-16 lg:py-16">
          {/* Long tokens (user agents, IP-list URLs) may break mid-word rather
              than push a phone-width column sideways; normal words still wrap
              at spaces. Code blocks keep their own horizontal scroll. */}
          <article ref={bodyRef} className="min-w-0 max-w-[43rem] [overflow-wrap:anywhere]">
            <TableOfContents entries={toc} variant="inline" className="mb-10 lg:hidden" />
            <ShortAnswer text={guide.shortAnswer} />
            <Takeaways id="takeaways" items={guide.takeaways} />

            {guide.sections.map((s) => (
              <section key={s.id} aria-labelledby={s.id}>
                <GuideHeading id={s.id}>{s.title}</GuideHeading>
                <GuideBlocks blocks={s.blocks} idPrefix={s.id} />
              </section>
            ))}

            <section aria-labelledby="checklist">
              <GuideHeading id="checklist">The action checklist</GuideHeading>
              <p className="mt-6 text-[1.0625rem] leading-[1.8] text-ink/80 sm:text-[1.125rem]">
                Everything above, in the order we&rsquo;d do it. Tick items off as you go — your
                progress is saved in this browser.
              </p>
              <Checklist slug={engine.slug} items={guide.checklist} />
            </section>

            <section aria-labelledby="faq">
              <GuideHeading id="faq">{`${engine.name} SEO: frequently asked questions`}</GuideHeading>
              <FaqList faqs={guide.faqs} />
            </section>

            <SourceList id="sources" sources={guide.sources} />

            <footer className="mt-14 space-y-8 border-t border-border pt-10">
              <div className="flex flex-wrap items-center justify-between gap-5">
                <p className="text-sm text-muted-foreground">
                  Found this useful? Share it with whoever owns your SEO.
                </p>
                <ShareButtons url={url} title={shareTitle} />
              </div>
              <AuthorCard author="Rankbox Team" />
            </footer>
          </article>

          <aside className="hidden lg:block">
            <div className="sticky top-24 max-h-[calc(100dvh-7rem)] space-y-8 overflow-y-auto pb-6 [scrollbar-width:none]">
              <TableOfContents entries={toc} variant="rail" />
              <RailCta />
            </div>
          </aside>
        </div>

        <OtherGuides current={engine} guide={guide} />
        <ExploreMore
          path={`/ai-seo/${engine.slug}`}
          exclude={guide.furtherReading.map((r) => r.href)}
        />
        <BlogCta
          title={
            engine.tier === "frontier"
              ? `See if ${engine.shortName} cites you today`
              : "See where AI answers cite you today"
          }
        />
      </main>
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
