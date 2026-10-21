import { useMemo, useRef, type CSSProperties, type ReactNode } from "react";
import { createFileRoute, Link, useRouter, notFound } from "@tanstack/react-router";
import { ArrowRight, ChevronRight } from "lucide-react";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Reveal } from "@/components/landing/shared";
import { Band, CELL, CellGrid, GHOST_BUTTON, LINE, Spacer } from "@/components/landing/frame";
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
import { cn } from "@/lib/utils";
import { AUTHOR_ORG, isTeamAuthor } from "@/data/company";
import { BLOG_VIDEOS, isoDuration } from "@/data/blog-videos";
import { youtubeId } from "@/components/blog/NotionBlocks";
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

function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-white">
      <Navbar framed />
      <main>{children}</main>
      <Footer />
    </div>
  );
}

const SOLID =
  "mt-6 inline-flex h-10 items-center rounded-lg bg-cta px-5 text-sm font-semibold text-white transition-colors hover:bg-cta-hover";

function PostError() {
  const router = useRouter();
  return (
    <Shell>
      <Band inner="px-5 py-32 text-center">
        <h1 className="font-display text-2xl font-medium tracking-[-0.02em] text-ink">
          Couldn't load this post
        </h1>
        <p className="mt-3 text-muted-foreground">Please try again in a moment.</p>
        <button onClick={() => router.invalidate()} className={SOLID}>
          Retry
        </button>
      </Band>
      <Spacer closing />
    </Shell>
  );
}

function PostNotFound() {
  return (
    <Shell>
      <Band inner="px-5 py-32 text-center">
        <h1 className="font-display text-2xl font-medium tracking-[-0.02em] text-ink">
          Post not found
        </h1>
        <p className="mt-3 text-muted-foreground">
          This article may have moved or been unpublished.
        </p>
        <Link to="/blog" className={SOLID}>
          Back to the blog
        </Link>
      </Band>
      <Spacer closing />
    </Shell>
  );
}

function PostPage() {
  const { post, related } = Route.useLoaderData();
  // Keyed so moving between articles starts each one fresh (scroll-spy, progress).
  return <Article key={post.slug} post={post} related={related} />;
}

/* The article in the landing page's frame: the header split by a hairline,
   the cover inset in its own cell; the text column beside a rail that holds
   the contents and the offer; then more reading in hairline cells. */
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
        <header className="relative bg-white">
          <div
            className={cn(
              "relative mx-auto grid max-w-6xl border-x lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]",
              LINE,
            )}
          >
            <div className="flex flex-col justify-center px-5 pb-10 pt-8 motion-safe:animate-hero-rise sm:px-10 lg:py-14 lg:pl-12 lg:pr-10">
              <nav aria-label="Breadcrumb">
                <ol className="flex items-center gap-1.5 text-[0.8rem] text-muted-foreground">
                  <li>
                    <Link to="/blog" className="py-2 transition-colors hover:text-ink">
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
                          className="py-2 font-medium text-cta transition-colors hover:text-cta-hover"
                        >
                          {topic}
                        </Link>
                      </li>
                    </>
                  )}
                </ol>
              </nav>
              <h1 className="mt-5 text-balance font-display text-[2.05rem] font-medium leading-[1.1] tracking-[-0.03em] text-ink sm:text-[2.7rem] lg:text-[2.9rem]">
                {post.title}
              </h1>
              {post.excerpt && (
                <p className="mt-5 max-w-2xl text-[1.05rem] leading-relaxed text-muted-foreground sm:text-[1.15rem]">
                  {post.excerpt}
                </p>
              )}
              <div className="mt-8 flex flex-wrap items-center justify-between gap-5">
                <div className="flex items-center gap-3">
                  <AuthorMark className="h-10 w-10" />
                  <div className="text-sm leading-tight">
                    {isTeamAuthor(post.author) ? (
                      <Link
                        to="/about"
                        className="font-semibold text-ink underline decoration-ink/20 underline-offset-4 transition-colors hover:decoration-ink"
                      >
                        {post.author}
                      </Link>
                    ) : (
                      <p className="font-semibold text-ink">{post.author}</p>
                    )}
                    <p className="mt-1 text-xs text-muted-foreground">
                      <PostStamp post={meta} />
                      {post.updated && <> · Updated {formatDate(post.updated)}</>}
                    </p>
                  </div>
                </div>
                <ShareButtons url={url} title={post.title} />
              </div>
            </div>
            {/* The cover, inset in its own cell with a hairline of white
                around it, like the landing's feature panels. */}
            <div
              className={cn(
                "border-t p-3 motion-safe:animate-hero-rise lg:border-l lg:border-t-0",
                LINE,
              )}
              style={{ "--rise-delay": "0.08s" } as CSSProperties}
            >
              <div className="h-full overflow-hidden rounded-lg border border-ink/[0.06]">
                <CoverArt
                  post={post}
                  className="aspect-[16/11] h-full w-full lg:aspect-auto lg:min-h-[22rem]"
                />
              </div>
            </div>
          </div>
        </header>

        {/* ---------- body + rail ---------- */}
        <Band inner="grid lg:grid-cols-[minmax(0,1fr)_18rem]">
          <div ref={bodyRef} className="min-w-0 px-5 py-10 sm:px-10 lg:py-14 lg:pl-12 lg:pr-14">
            <div className="max-w-[43rem]">
              <TableOfContents entries={toc} variant="inline" className="mb-10 lg:hidden" />
              <ArticleBody
                outline={outline}
                blocks={post.blocks}
                share={{ url, title: post.title }}
              />

              <footer className={cn("mt-14 space-y-8 border-t pt-10", LINE)}>
                <div className="flex flex-wrap items-center justify-between gap-5">
                  {post.tags.length > 0 && (
                    <ul aria-label="Topics" className="flex flex-wrap gap-2">
                      {post.tags.map((t) => (
                        <li key={t}>
                          <Link
                            to="/blog"
                            search={{ topic: t }}
                            className="inline-flex h-8 items-center rounded-lg border border-ink/[0.08] bg-white px-3 text-[0.8rem] font-medium text-ink/75 transition-colors hover:border-cta/30 hover:text-cta"
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
          </div>

          <aside className={cn("hidden border-l lg:block", LINE)}>
            <div className="sticky top-24 max-h-[calc(100dvh-7rem)] space-y-8 overflow-y-auto px-6 py-14 [scrollbar-width:none]">
              <TableOfContents entries={toc} variant="rail" />
              <RailCta />
            </div>
          </aside>
        </Band>
      </article>

      {/* ---------- keep reading ---------- */}
      {related.length > 0 && (
        <section aria-labelledby="related-title">
          <Spacer />
          <Band inner="flex items-end justify-between gap-4 px-6 py-8 sm:px-10 lg:px-12">
            <h2
              id="related-title"
              className="font-display text-[1.6rem] font-medium leading-tight tracking-[-0.025em] text-ink sm:text-[1.9rem]"
            >
              Keep reading
            </h2>
            <Link to="/blog" className={cn(GHOST_BUTTON, "group/btn shrink-0")}>
              All articles
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-0.5" />
            </Link>
          </Band>
          <Band>
            <CellGrid className="sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p, i) => (
                <li key={p.id} className={CELL}>
                  <Reveal delay={i * 0.06} className="h-full">
                    <PostCard post={p} />
                  </Reveal>
                </li>
              ))}
            </CellGrid>
          </Band>
        </section>
      )}

      <ExploreMore path={`/blog/${post.slug}`} framed />
      <BlogCta framed />
    </Shell>
  );
}
