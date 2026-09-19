import { useMemo, useRef } from "react";
import { createFileRoute, Link, useRouter, notFound } from "@tanstack/react-router";
import { ArrowRight, ChevronRight } from "lucide-react";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Reveal } from "@/components/landing/shared";
import { ArticleBody } from "@/components/blog/ArticleBody";
import {
  AuthorCard,
  BlogCta,
  RailCta,
  ReadingProgress,
  ShareButtons,
  TableOfContents,
} from "@/components/blog/ArticleChrome";
import { CoverArt } from "@/components/blog/CoverArt";
import { AuthorMark, PostCard, PostStamp } from "@/components/blog/PostCards";
import { getPost, postsQuery, relatedPosts } from "@/lib/blog";
import {
  countWords,
  faqForSchema,
  outlineArticle,
  readingMinutes,
  tableOfContents,
} from "@/lib/article-outline";
import { formatDate } from "@/lib/format-date";
import type { PostFull, PostMeta } from "@/lib/notion.server";

const SITE = "https://rankbox.xyz";

export const Route = createFileRoute("/blog/$slug")({
  loader: async ({ params, context }) => {
    const [{ post, error }, list] = await Promise.all([
      getPost(params.slug),
      // "Keep reading" is a nice-to-have: never fail the article over it.
      context.queryClient
        .ensureQueryData(postsQuery)
        .catch(() => ({ posts: [] as PostMeta[], error: true })),
    ]);
    if (error) throw new Error("Failed to load post");
    if (!post) throw notFound();
    return { post, related: relatedPosts(post, list.posts) };
  },
  head: ({ loaderData }) => {
    const post = loaderData?.post as PostFull | undefined;
    if (!post) return {};
    const url = `${SITE}/blog/${post.slug}`;
    const desc = post.excerpt || `${post.title} — a Rankbox guide.`;
    const modified = post.updated ?? post.date;
    const faq = faqForSchema(post.blocks);
    return {
      meta: [
        { title: `${post.title} | Rankbox` },
        { name: "description", content: desc },
        { property: "og:title", content: post.title },
        { property: "og:description", content: desc },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
        ...(post.date ? [{ property: "article:published_time", content: post.date }] : []),
        ...(modified ? [{ property: "article:modified_time", content: modified }] : []),
        ...post.tags.map((t) => ({ property: "article:tag", content: t })),
        ...(post.cover ? [{ property: "og:image", content: post.cover }] : []),
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: post.title },
        { name: "twitter:description", content: desc },
        ...(post.cover ? [{ name: "twitter:image", content: post.cover }] : []),
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "BlogPosting",
                "@id": `${url}#article`,
                headline: post.title,
                description: desc,
                ...(post.cover ? { image: post.cover } : {}),
                ...(post.date ? { datePublished: post.date } : {}),
                ...(modified ? { dateModified: modified } : {}),
                wordCount: countWords(post.blocks),
                ...(post.tags.length
                  ? { keywords: post.tags.join(", "), articleSection: post.tags[0] }
                  : {}),
                inLanguage: "en",
                author: { "@type": "Organization", name: post.author || "Rankbox", url: SITE },
                publisher: { "@type": "Organization", name: "Rankbox", url: SITE },
                mainEntityOfPage: url,
              },
              ...(faq.length
                ? [
                    {
                      "@type": "FAQPage",
                      "@id": `${url}#faq`,
                      mainEntity: faq.map((f) => ({
                        "@type": "Question",
                        name: f.q,
                        acceptedAnswer: { "@type": "Answer", text: f.a },
                      })),
                    },
                  ]
                : []),
              {
                "@type": "BreadcrumbList",
                itemListElement: [
                  { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
                  { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE}/blog` },
                  { "@type": "ListItem", position: 3, name: post.title, item: url },
                ],
              },
            ],
          }),
        },
      ],
    };
  },
  component: PostPage,
  errorComponent: PostError,
  notFoundComponent: PostNotFound,
});

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
}

function PostError() {
  const router = useRouter();
  return (
    <Shell>
      <div className="mx-auto max-w-3xl px-5 py-32 text-center">
        <h1 className="font-display text-2xl font-semibold text-ink">Couldn't load this post</h1>
        <p className="mt-3 text-muted-foreground">Please try again in a moment.</p>
        <button
          onClick={() => router.invalidate()}
          className="mt-6 rounded-xl bg-ink px-5 py-2.5 text-sm font-semibold text-background"
        >
          Retry
        </button>
      </div>
    </Shell>
  );
}

function PostNotFound() {
  return (
    <Shell>
      <div className="mx-auto max-w-3xl px-5 py-32 text-center">
        <h1 className="font-display text-2xl font-semibold text-ink">Post not found</h1>
        <p className="mt-3 text-muted-foreground">
          This article may have been moved or unpublished.
        </p>
        <Link
          to="/blog"
          className="mt-6 inline-block rounded-xl bg-ink px-5 py-2.5 text-sm font-semibold text-background"
        >
          Back to the blog
        </Link>
      </div>
    </Shell>
  );
}

function PostPage() {
  const { post, related } = Route.useLoaderData();
  // Keyed so moving between articles starts each one fresh (scroll-spy, progress).
  return <Article key={post.slug} post={post} related={related} />;
}

function Article({ post, related }: { post: PostFull; related: PostMeta[] }) {
  const outline = useMemo(() => outlineArticle(post.blocks), [post.blocks]);
  const toc = useMemo(() => tableOfContents(outline), [outline]);
  const bodyRef = useRef<HTMLDivElement>(null);
  const meta: PostMeta = {
    ...post,
    readingMinutes: post.readingMinutes ?? readingMinutes(countWords(post.blocks)),
  };
  const url = `${SITE}/blog/${post.slug}`;
  const topic = post.tags[0];

  return (
    <Shell>
      <ReadingProgress target={bodyRef} />
      <article>
        {/* ---------- header ---------- */}
        <header className="relative overflow-hidden border-b border-border bg-surface/60">
          <div className="pointer-events-none absolute inset-0 bg-hero-glow" aria-hidden />
          <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-5 pb-12 pt-10 sm:pt-14 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:gap-14 lg:pb-16">
            <Reveal>
              <nav aria-label="Breadcrumb">
                <ol className="flex items-center gap-1.5 text-[0.8rem] font-medium text-muted-foreground">
                  <li>
                    <Link to="/blog" className="transition-colors hover:text-ink">
                      Blog
                    </Link>
                  </li>
                  {topic && (
                    <>
                      <ChevronRight aria-hidden className="h-3.5 w-3.5 text-ink/25" />
                      <li>
                        <Link
                          to="/blog"
                          search={{ topic }}
                          className="font-semibold text-volt transition-colors hover:text-ink"
                        >
                          {topic}
                        </Link>
                      </li>
                    </>
                  )}
                </ol>
              </nav>
              <h1 className="mt-5 text-balance font-display text-[2.1rem] font-bold leading-[1.08] tracking-tight text-ink sm:text-[2.9rem] lg:text-[3.1rem]">
                {post.title}
              </h1>
              {post.excerpt && (
                <p className="mt-5 max-w-2xl text-[1.1rem] leading-relaxed text-muted-foreground sm:text-[1.2rem]">
                  {post.excerpt}
                </p>
              )}
              <div className="mt-8 flex flex-wrap items-center justify-between gap-5">
                <div className="flex items-center gap-3">
                  <AuthorMark className="h-10 w-10" />
                  <div className="text-sm leading-tight">
                    <p className="font-semibold text-ink">{post.author}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      <PostStamp post={meta} />
                      {post.updated && <> · Updated {formatDate(post.updated)}</>}
                    </p>
                  </div>
                </div>
                <ShareButtons url={url} title={post.title} />
              </div>
            </Reveal>
            <Reveal delay={0.08}>
              <div className="overflow-hidden rounded-3xl border border-border shadow-3">
                <CoverArt post={post} className="aspect-[16/11]" />
              </div>
            </Reveal>
          </div>
        </header>

        {/* ---------- body + rail ---------- */}
        <div className="mx-auto grid max-w-6xl gap-12 px-5 py-12 lg:grid-cols-[minmax(0,1fr)_17rem] lg:gap-16 lg:py-16">
          <div ref={bodyRef} className="min-w-0 max-w-[43rem]">
            <TableOfContents entries={toc} variant="inline" className="mb-10 lg:hidden" />
            <ArticleBody
              outline={outline}
              blocks={post.blocks}
              share={{ url, title: post.title }}
            />

            <footer className="mt-14 space-y-8 border-t border-border pt-10">
              <div className="flex flex-wrap items-center justify-between gap-5">
                {post.tags.length > 0 && (
                  <ul aria-label="Topics" className="flex flex-wrap gap-2">
                    {post.tags.map((t) => (
                      <li key={t}>
                        <Link
                          to="/blog"
                          search={{ topic: t }}
                          className="inline-flex h-8 items-center rounded-full border border-border bg-card px-3.5 text-xs font-semibold text-ink/75 transition-colors hover:border-ink/25 hover:text-ink"
                        >
                          {t}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
                <ShareButtons url={url} title={post.title} />
              </div>
              <AuthorCard author={post.author} />
            </footer>
          </div>

          <aside className="hidden lg:block">
            <div className="sticky top-24 max-h-[calc(100dvh-7rem)] space-y-8 overflow-y-auto pb-6 [scrollbar-width:none]">
              <TableOfContents entries={toc} variant="rail" />
              <RailCta />
            </div>
          </aside>
        </div>
      </article>

      {/* ---------- keep reading ---------- */}
      {related.length > 0 && (
        <section aria-labelledby="related-title" className="border-t border-border bg-surface/60">
          <div className="mx-auto max-w-6xl px-5 py-16 sm:py-20">
            <div className="flex items-end justify-between gap-4">
              <h2
                id="related-title"
                className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl"
              >
                Keep reading
              </h2>
              <Link
                to="/blog"
                className="group inline-flex items-center gap-1.5 text-sm font-semibold text-ink"
              >
                All articles
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
            <div className="mt-10 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p, i) => (
                <Reveal key={p.id} delay={i * 0.06} className="h-full">
                  <PostCard post={p} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      <BlogCta />
    </Shell>
  );
}
