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
import { SourceList } from "@/components/ai-seo/sections";
import {
  AzPager,
  FurtherReading,
  OriginalBlock,
  ProductCard,
  QuestionSection,
  RelatedTerms,
  TermHero,
  WhyItMatters,
  originalAnchor,
} from "@/components/glossary/entry";
import { SITE, termUrl } from "@/components/glossary/shared";
import { ExploreMore } from "@/components/ExploreMore";
import { entryReadingMinutes, entryWordCount, hasEntry, loadEntry } from "@/data/glossary/entries";
import { getCategory, getTerm, type GlossaryTerm } from "@/data/glossary/terms";
import type { GlossaryEntry } from "@/data/glossary/types";
import { plainText } from "@/lib/inline-md";
import { AUTHOR_ORG } from "@/data/company";

/* The original element sits after this many question sections: far enough in
   that the basics come first, early enough that most readers reach it. */
const ORIGINAL_AFTER = 2;

export const Route = createFileRoute("/glossary/$term")({
  /* The entry's text is its own chunk, fetched here: the head only needs the
     light index, and sixty-odd entries don't belong in the shared bundle. */
  loader: async ({ params }) => {
    const term = getTerm(params.term);
    if (!term || !hasEntry(term.slug)) throw notFound();
    return { entry: await loadEntry(term.slug) };
  },
  head: ({ params, loaderData }) => {
    const entry = loaderData?.entry;
    const term = getTerm(params.term);
    if (!entry || !term) return { meta: [{ title: "Term not found — Rankbox" }] };

    const url = termUrl(term.slug);
    const definition = plainText(term.definition);
    const category = getCategory(term.category);
    const names = [term.abbr, ...(term.aliases ?? [])].filter((n): n is string => Boolean(n));
    return {
      meta: [
        { title: entry.metaTitle },
        { name: "description", content: entry.metaDescription },
        { name: "keywords", content: entry.keywords.join(", ") },
        { property: "og:title", content: entry.metaTitle },
        { property: "og:description", content: entry.metaDescription },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
        { property: "og:site_name", content: "Rankbox" },
        { property: "article:published_time", content: term.published },
        { property: "article:modified_time", content: term.updated },
        { property: "article:section", content: "AI Search Glossary" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: entry.metaTitle },
        { name: "twitter:description", content: entry.metaDescription },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "DefinedTerm",
                "@id": `${url}#term`,
                name: term.term,
                ...(names.length ? { alternateName: names } : {}),
                description: definition,
                url,
                inDefinedTermSet: { "@id": `${SITE}/glossary#set` },
              },
              {
                "@type": "Article",
                "@id": `${url}#article`,
                headline: `What is ${term.term}?`,
                name: entry.metaTitle,
                description: entry.metaDescription,
                /* The definition, handed to answer engines directly rather
                   than left to be scraped out of the layout. */
                abstract: definition,
                about: { "@id": `${url}#term` },
                datePublished: term.published,
                dateModified: term.updated,
                wordCount: entryWordCount(term, entry),
                keywords: entry.keywords.join(", "),
                articleSection: category.name,
                inLanguage: "en",
                mainEntityOfPage: { "@id": `${url}#webpage` },
                author: AUTHOR_ORG,
                publisher: { "@type": "Organization", name: "Rankbox", url: SITE },
                hasPart: {
                  "@type": "CreativeWork",
                  name: entry.original.name,
                  description: plainText(entry.original.summary),
                  url: `${url}#${originalAnchor(entry.original)}`,
                  creator: { "@type": "Organization", name: "Rankbox", url: SITE },
                },
                citation: entry.sources.map((s) => ({
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
                name: entry.metaTitle,
                inLanguage: "en",
                isPartOf: { "@id": `${SITE}/#website` },
                breadcrumb: { "@id": `${url}#breadcrumb` },
                mainEntity: { "@id": `${url}#term` },
              },
              {
                "@type": "FAQPage",
                "@id": `${url}#faq`,
                mainEntity: entry.questions.map((q) => ({
                  "@type": "Question",
                  name: q.question,
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: plainText(q.answer),
                    url: `${url}#${q.id}`,
                  },
                })),
              },
              {
                "@type": "BreadcrumbList",
                "@id": `${url}#breadcrumb`,
                itemListElement: [
                  { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
                  { "@type": "ListItem", position: 2, name: "Glossary", item: `${SITE}/glossary` },
                  { "@type": "ListItem", position: 3, name: term.term, item: url },
                ],
              },
            ],
          }),
        },
      ],
    };
  },
  component: TermPage,
  notFoundComponent: TermNotFound,
});

function TermPage() {
  const { entry } = Route.useLoaderData();
  const term = getTerm(entry.slug)!;
  // Keyed so moving between terms starts each page fresh (scroll-spy, progress).
  return <Term key={entry.slug} term={term} entry={entry} />;
}

function Term({ term, entry }: { term: GlossaryTerm; entry: GlossaryEntry }) {
  const bodyRef = useRef<HTMLDivElement>(null);
  const url = termUrl(term.slug);
  const before = entry.questions.slice(0, ORIGINAL_AFTER);
  const after = entry.questions.slice(ORIGINAL_AFTER);

  const toc = useMemo(
    () => [
      { id: "why-it-matters", text: "Why it matters" },
      ...entry.questions.slice(0, ORIGINAL_AFTER).map((q) => ({ id: q.id, text: q.question })),
      { id: originalAnchor(entry.original), text: entry.original.name },
      ...entry.questions.slice(ORIGINAL_AFTER).map((q) => ({ id: q.id, text: q.question })),
      { id: "related-terms", text: "Related terms" },
    ],
    [entry],
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <ReadingProgress target={bodyRef} />
        <TermHero term={term} entry={entry} readingMinutes={entryReadingMinutes(term, entry)} />

        <div className="mx-auto grid max-w-6xl gap-12 px-5 py-12 lg:grid-cols-[minmax(0,1fr)_17rem] lg:gap-16 lg:py-16">
          <article ref={bodyRef} className="min-w-0 max-w-[43rem] [overflow-wrap:anywhere]">
            <TableOfContents entries={toc} variant="inline" className="mb-10 lg:hidden" />
            <WhyItMatters id="why-it-matters" text={entry.whyItMatters} />

            {before.map((q) => (
              <QuestionSection key={q.id} q={q} />
            ))}
            <OriginalBlock original={entry.original} slug={term.slug} />
            {after.map((q) => (
              <QuestionSection key={q.id} q={q} />
            ))}

            <ProductCard entry={entry} />
            <RelatedTerms id="related-terms" slugs={entry.related} />
            {entry.further && <FurtherReading items={entry.further} />}
            <SourceList id="sources" sources={entry.sources} />

            <footer className="mt-14 space-y-8 border-t border-border pt-10">
              <div className="flex flex-wrap items-center justify-between gap-5">
                <p className="text-sm text-muted-foreground">
                  Know someone who&rsquo;d find this useful? Send it their way.
                </p>
                <ShareButtons url={url} title={`What is ${term.term}?`} />
              </div>
              <AuthorCard author="Rankbox Team" />
              <AzPager slug={term.slug} />
            </footer>
          </article>

          <aside className="hidden lg:block">
            <div className="sticky top-24 max-h-[calc(100dvh-7rem)] space-y-8 overflow-y-auto pb-6 [scrollbar-width:none]">
              <TableOfContents entries={toc} variant="rail" />
              <RailCta />
            </div>
          </aside>
        </div>

        <ExploreMore
          path={`/glossary/${term.slug}`}
          exclude={[
            `/features/${entry.product.feature}`,
            ...(entry.tool ? [`/tools/${entry.tool}`] : []),
            ...(entry.further ?? []).map((f) => f.href),
          ]}
        />
        <BlogCta title="See which AI answers cite you today" />
      </main>
      <Footer />
    </div>
  );
}

function TermNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-5 text-center">
      <h1 className="font-display text-3xl font-semibold text-ink">Term not found</h1>
      <p className="text-muted-foreground">That term isn&rsquo;t in the glossary yet.</p>
      <Link
        to="/glossary"
        className="rounded-xl bg-ink px-5 py-3 text-sm font-semibold text-background"
      >
        Browse the glossary
      </Link>
    </div>
  );
}
