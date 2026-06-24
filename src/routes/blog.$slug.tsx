import { createFileRoute, Link, useRouter, notFound } from "@tanstack/react-router";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Reveal, Eyebrow, PrimaryButton } from "@/components/landing/shared";
import { NotionBlocks } from "@/components/blog/NotionBlocks";
import { getPost } from "@/lib/notion.functions";
import { formatDate } from "@/lib/format-date";
import type { PostFull } from "@/lib/notion.server";

const SITE = "https://rankvolt.top";

export const Route = createFileRoute("/blog/$slug")({
  loader: async ({ params }) => {
    const { post, error } = await getPost({ data: { slug: params.slug } });
    if (error) throw new Error("Failed to load post");
    if (!post) throw notFound();
    return { post };
  },
  head: ({ loaderData }) => {
    const post = loaderData?.post as PostFull | undefined;
    if (!post) return {};
    const url = `${SITE}/blog/${post.slug}`;
    const desc = post.excerpt || `${post.title} — a Rankvolt guide.`;
    return {
      meta: [
        { title: `${post.title} | Rankvolt` },
        { name: "description", content: desc },
        { property: "og:title", content: post.title },
        { property: "og:description", content: desc },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
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
                "@type": "Article",
                headline: post.title,
                description: desc,
                ...(post.cover ? { image: post.cover } : {}),
                ...(post.date ? { datePublished: post.date, dateModified: post.date } : {}),
                author: { "@type": "Organization", name: post.author || "Rankvolt" },
                publisher: { "@type": "Organization", name: "Rankvolt" },
                mainEntityOfPage: url,
              },
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
  const { post } = Route.useLoaderData();

  return (
    <Shell>
      <article className="mx-auto max-w-3xl px-5 pb-20 pt-28 sm:pt-32">
        <Reveal>
          <nav aria-label="Breadcrumb" className="text-xs text-muted-foreground">
            <Link to="/" className="transition-colors hover:text-ink">
              Home
            </Link>
            <span className="mx-1.5">/</span>
            <Link to="/blog" className="transition-colors hover:text-ink">
              Blog
            </Link>
          </nav>
          {post.tags.length > 0 && <Eyebrow className="mt-5">{post.tags[0]}</Eyebrow>}
          <h1 className="mt-5 font-display text-3xl font-semibold tracking-tight text-ink sm:text-[2.6rem] sm:leading-[1.08]">
            {post.title}
          </h1>
          {post.excerpt && (
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground">{post.excerpt}</p>
          )}
          <p className="mt-5 text-xs font-medium text-muted-foreground">
            {post.author}
            {post.date && <> · {formatDate(post.date)}</>}
          </p>
        </Reveal>

        {post.cover && (
          <Reveal delay={0.05}>
            <img
              src={post.cover}
              alt={post.title}
              className="mt-8 aspect-[16/9] w-full rounded-2xl border border-border object-cover"
            />
          </Reveal>
        )}

        <Reveal delay={0.05}>
          <div className="mt-6">
            <NotionBlocks blocks={post.blocks} />
          </div>
        </Reveal>

        <Reveal>
          <div className="mt-14 rounded-3xl border border-border bg-card p-8 text-center">
            <p className="font-display text-2xl font-semibold tracking-tight text-ink">
              Let Rankvolt get you cited by AI
            </p>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
              Rankvolt publishes citation-ready articles daily and tracks where ChatGPT, Perplexity,
              and Google AI Overviews mention your brand.
            </p>
            <PrimaryButton className="mt-6">Start getting cited</PrimaryButton>
          </div>
        </Reveal>
      </article>
    </Shell>
  );
}