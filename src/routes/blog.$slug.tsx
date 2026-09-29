import { useMemo, useRef } from "react";
import { createFileRoute, Link, useRouter, notFound } from "@tanstack/react-router";
import { ArrowRight, ChevronRight } from "lucide-react";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Reveal } from "@/components/landing/shared";
import { PixelField, type Pixel } from "@/components/landing/Hero";
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
import { ExploreMore } from "@/components/ExploreMore";
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
import { AUTHOR_ORG, isTeamAuthor } from "@/data/company";
import { BLOG_VIDEOS, isoDuration } from "@/data/blog-videos";
import { youtubeId } from "@/components/blog/NotionBlocks";
import type { PostFull, PostMeta } from "@/lib/notion.server";

const SITE = "https://rankbox.xyz";

/* White squares over the blue article header. Denser than the landing hero's
   field, and heaviest in the page margins: the few that fall behind the copy
   are kept faint so the title stays crisp. The cover card is opaque, so its
   area is left empty. */
const HEADER_PIXELS: Pixel[] = [
  // top edge
  { top: "9%", left: "4%", size: 18, opacity: 0.15 },
  { top: "4%", left: "14%", size: 12, opacity: 0.12 },
  { top: "2%", left: "27%", size: 8, opacity: 0.1 },
  { top: "6%", left: "41%", size: 16, opacity: 0.1 },
  { top: "3%", left: "58%", size: 10, opacity: 0.12 },
  { top: "5%", left: "71%", size: 18, opacity: 0.14 },
  { top: "1%", left: "84%", size: 14, opacity: 0.13 },
  { top: "8%", left: "93%", size: 10, opacity: 0.11 },
  // left margin
  { top: "15%", left: "10%", size: 22, opacity: 0.16 },
  { top: "21%", left: "1.5%", size: 12, opacity: 0.12 },
  { top: "28%", left: "17%", size: 10, opacity: 0.1 },
  { top: "34%", left: "6%", size: 26, opacity: 0.18 },
  { top: "43%", left: "13%", size: 14, opacity: 0.12 },
  { top: "50%", left: "2%", size: 18, opacity: 0.15 },
  { top: "57%", left: "19%", size: 12, opacity: 0.1 },
  { top: "63%", left: "8%", size: 20, opacity: 0.16 },
  { top: "71%", left: "15%", size: 10, opacity: 0.11 },
  { top: "76%", left: "3%", size: 24, opacity: 0.17 },
  { top: "82%", left: "11%", size: 14, opacity: 0.13 },
  // right margin
  { top: "14%", left: "88%", size: 20, opacity: 0.15 },
  { top: "19%", left: "97%", size: 14, opacity: 0.13 },
  { top: "26%", left: "81%", size: 10, opacity: 0.1 },
  { top: "33%", left: "92%", size: 26, opacity: 0.18 },
  { top: "41%", left: "85%", size: 12, opacity: 0.12 },
  { top: "48%", left: "98%", size: 18, opacity: 0.15 },
  { top: "55%", left: "80%", size: 16, opacity: 0.13 },
  { top: "61%", left: "90%", size: 10, opacity: 0.1 },
  { top: "68%", left: "95%", size: 22, opacity: 0.17 },
  { top: "74%", left: "84%", size: 12, opacity: 0.12 },
  { top: "81%", left: "91%", size: 16, opacity: 0.14 },
  // behind the copy — faint
  { top: "12%", left: "52%", size: 12, opacity: 0.09 },
  { top: "18%", left: "38%", size: 10, opacity: 0.07 },
  { top: "37%", left: "49%", size: 12, opacity: 0.07 },
  { top: "58%", left: "33%", size: 8, opacity: 0.06 },
  { top: "72%", left: "46%", size: 14, opacity: 0.08 },
  // between the copy and the cover
  { top: "44%", left: "53%", size: 10, opacity: 0.1 },
  { top: "66%", left: "54%", size: 14, opacity: 0.11 },
  // bottom edge
  { top: "88%", left: "6%", size: 12, opacity: 0.13 },
  { top: "93%", left: "18%", size: 20, opacity: 0.16 },
  { top: "90%", left: "30%", size: 10, opacity: 0.1 },
  { top: "95%", left: "39%", size: 16, opacity: 0.13 },
  { top: "89%", left: "51%", size: 12, opacity: 0.11 },
  { top: "94%", left: "62%", size: 22, opacity: 0.16 },
  { top: "91%", left: "74%", size: 10, opacity: 0.11 },
  { top: "96%", left: "86%", size: 18, opacity: 0.15 },
  { top: "92%", left: "97%", size: 12, opacity: 0.12 },
];

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
    // Only videos in src/data/blog-videos.ts get markup: it has the upload
    // date and length Google needs, checked on YouTube rather than guessed.
    const videos = post.blocks.flatMap((b) => {
      const id = b.type === "video" && b.url ? youtubeId(b.url) : null;
      const video = id ? BLOG_VIDEOS[id] : undefined;
      return id && video ? [{ id, ...video }] : [];
    });
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
                // Brand-signed posts credit the company, pointing at the page
                // that says who it is; a named author is a person.
                author:
                  !post.author || isTeamAuthor(post.author)
                    ? AUTHOR_ORG
                    : { "@type": "Person", name: post.author },
                publisher: { "@type": "Organization", name: "Rankbox", url: SITE },
                mainEntityOfPage: url,
                ...(videos.length
                  ? { video: videos.map((v) => ({ "@id": `${url}#video-${v.id}` })) }
                  : {}),
              },
              ...videos.map((v) => ({
                "@type": "VideoObject",
                "@id": `${url}#video-${v.id}`,
                name: v.title,
                description: v.summary,
                thumbnailUrl: `https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`,
                uploadDate: v.uploadDate,
                duration: isoDuration(v.seconds),
                embedUrl: `https://www.youtube.com/embed/${v.id}`,
                url: `https://www.youtube.com/watch?v=${v.id}`,
              })),
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
        <header className="relative overflow-hidden bg-brand-blue text-white">
          <PixelField pixels={HEADER_PIXELS} seed={3} />
          <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-5 pb-12 pt-10 sm:pt-14 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:gap-14 lg:pb-16">
            <Reveal>
              <nav aria-label="Breadcrumb">
                <ol className="flex items-center gap-1.5 text-[0.8rem] font-medium text-white/70">
                  <li>
                    <Link to="/blog" className="transition-colors hover:text-white">
                      Blog
                    </Link>
                  </li>
                  {topic && (
                    <>
                      <ChevronRight aria-hidden className="h-3.5 w-3.5 text-white/40" />
                      <li>
                        <Link
                          to="/blog"
                          search={{ topic }}
                          className="font-semibold text-white transition-colors hover:text-white/75"
                        >
                          {topic}
                        </Link>
                      </li>
                    </>
                  )}
                </ol>
              </nav>
              <h1 className="mt-5 text-balance font-display text-[2.1rem] font-bold leading-[1.08] tracking-tight text-white sm:text-[2.9rem] lg:text-[3.1rem]">
                {post.title}
              </h1>
              {post.excerpt && (
                <p className="mt-5 max-w-2xl text-[1.1rem] leading-relaxed text-white/80 sm:text-[1.2rem]">
                  {post.excerpt}
                </p>
              )}
              <div className="mt-8 flex flex-wrap items-center justify-between gap-5">
                <div className="flex items-center gap-3">
                  <AuthorMark className="h-10 w-10 border-white/30" />
                  <div className="text-sm leading-tight">
                    {isTeamAuthor(post.author) ? (
                      <Link
                        to="/about"
                        className="font-semibold text-white underline decoration-white/35 underline-offset-4 transition-colors hover:decoration-white"
                      >
                        {post.author}
                      </Link>
                    ) : (
                      <p className="font-semibold text-white">{post.author}</p>
                    )}
                    <p className="mt-1 text-xs text-white/70">
                      <PostStamp post={meta} />
                      {post.updated && <> · Updated {formatDate(post.updated)}</>}
                    </p>
                  </div>
                </div>
                <ShareButtons url={url} title={post.title} tone="inverse" />
              </div>
            </Reveal>
            <Reveal delay={0.08}>
              {/* The ring keeps blue-toned covers from melting into the header. */}
              <div className="overflow-hidden rounded-3xl shadow-3 ring-1 ring-white/25">
                <CoverArt post={post} onBlue className="aspect-[16/11]" />
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

      <ExploreMore path={`/blog/${post.slug}`} />
      <BlogCta />
    </Shell>
  );
}
