import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Reveal, Eyebrow } from "@/components/landing/shared";
import { listPosts } from "@/lib/notion.functions";
import { formatDate } from "@/lib/format-date";

const URL = "https://rankvolt.top/blog";
const TITLE = "Resources & Blog | Rankvolt";
const DESCRIPTION =
  "Guides, playbooks, and resources on generative engine optimization, AI search visibility, and getting cited by ChatGPT, Perplexity, and Google AI Overviews.";

const postsQuery = queryOptions({
  queryKey: ["blog", "posts"],
  queryFn: () => listPosts(),
});

export const Route = createFileRoute("/blog/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: URL },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
    ],
    links: [{ rel: "canonical", href: URL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Blog",
          name: "Rankvolt Blog",
          description: DESCRIPTION,
          url: URL,
          publisher: { "@type": "Organization", name: "Rankvolt" },
        }),
      },
    ],
  }),
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(postsQuery);
  },
  component: BlogIndex,
  errorComponent: BlogError,
});

function BlogError() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-3xl px-5 py-32 text-center">
        <h1 className="font-display text-2xl font-semibold text-ink">Couldn't load resources</h1>
        <p className="mt-3 text-muted-foreground">Please try again in a moment.</p>
        <button
          onClick={() => router.invalidate()}
          className="mt-6 rounded-xl bg-ink px-5 py-2.5 text-sm font-semibold text-background"
        >
          Retry
        </button>
      </main>
      <Footer />
    </div>
  );
}

function BlogIndex() {
  const { data } = useSuspenseQuery(postsQuery);
  const posts = data.posts;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <section className="mx-auto max-w-6xl px-5 pb-20 pt-28 sm:pt-32">
          <Reveal className="mx-auto max-w-2xl text-center">
            <Eyebrow className="mb-4">Resources</Eyebrow>
            <h1 className="font-display text-balance text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
              The Rankvolt blog
            </h1>
            <p className="mt-4 text-balance text-lg text-muted-foreground">
              Playbooks and guides on getting your brand cited across ChatGPT, Perplexity, and Google
              AI Overviews.
            </p>
          </Reveal>

          {posts.length === 0 ? (
            <Reveal className="mx-auto mt-16 max-w-md rounded-2xl border border-border bg-card p-10 text-center">
              <p className="font-display text-lg font-semibold text-ink">No posts yet</p>
              <p className="mt-2 text-sm text-muted-foreground">
                New articles are on the way — check back soon.
              </p>
            </Reveal>
          ) : (
            <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((p, i) => (
                <Reveal key={p.id} delay={(i % 3) * 0.06}>
                  <Link
                    to="/blog/$slug"
                    params={{ slug: p.slug }}
                    className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-elevation transition-all hover:-translate-y-1 hover:shadow-elevation-lg"
                  >
                    {p.cover ? (
                      <div className="aspect-[16/9] overflow-hidden bg-secondary">
                        <img
                          src={p.cover}
                          alt={p.title}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                    ) : (
                      <div className="aspect-[16/9] bg-gradient-to-br from-secondary to-card" />
                    )}
                    <div className="flex flex-1 flex-col p-6">
                      {p.tags.length > 0 && (
                        <div className="mb-3 flex flex-wrap gap-1.5">
                          {p.tags.slice(0, 2).map((t) => (
                            <span
                              key={t}
                              className="rounded-full border border-border bg-surface/60 px-2.5 py-0.5 text-[0.7rem] font-medium text-muted-foreground"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                      <h2 className="text-lg font-semibold leading-snug text-ink">{p.title}</h2>
                      {p.excerpt && (
                        <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                          {p.excerpt}
                        </p>
                      )}
                      <p className="mt-5 text-xs font-medium text-muted-foreground">
                        {p.author}
                        {p.date && <> · {formatDate(p.date)}</>}
                      </p>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}