import { useMemo, useState } from "react";
import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import {
  ArrowRight,
  Bot,
  Braces,
  MessageSquareText,
  Search,
  X,
  type LucideIcon,
} from "lucide-react";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { PixelField } from "@/components/landing/Hero";
import { AI_MARKS } from "@/components/landing/ai-logos";
import { Reveal } from "@/components/landing/shared";
import { FeaturedPost, PostCard } from "@/components/blog/PostCards";
import { BlogCta } from "@/components/blog/ArticleChrome";
import { postsQuery } from "@/lib/blog";
import { getTool } from "@/data/tools";
import type { PostMeta } from "@/lib/notion.server";
import { cn } from "@/lib/utils";

const SITE = "https://rankbox.xyz";
const URL = `${SITE}/blog`;
const TITLE = "AI Search Playbooks & Guides | Rankbox Blog";
const DESCRIPTION =
  "Guides, playbooks, and resources on generative engine optimization, AI search visibility, and getting cited by ChatGPT, Perplexity, and Google AI Overviews.";

interface BlogSearch {
  topic?: string;
}

export const Route = createFileRoute("/blog/")({
  validateSearch: (search: Record<string, unknown>): BlogSearch => ({
    topic: typeof search.topic === "string" && search.topic.trim() ? search.topic : undefined,
  }),
  loader: async ({ context }) => {
    const { posts } = await context.queryClient.ensureQueryData(postsQuery);
    return { posts };
  },
  head: ({ loaderData }) => ({
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
          name: "Rankbox Blog",
          description: DESCRIPTION,
          url: URL,
          publisher: { "@type": "Organization", name: "Rankbox", url: SITE },
          blogPost: (loaderData?.posts ?? []).slice(0, 20).map((p) => ({
            "@type": "BlogPosting",
            headline: p.title,
            url: `${URL}/${p.slug}`,
            ...(p.date ? { datePublished: p.date } : {}),
            ...(p.excerpt ? { description: p.excerpt } : {}),
          })),
        }),
      },
    ],
  }),
  component: BlogIndex,
  errorComponent: BlogError,
});

function BlogError() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-3xl px-5 py-32 text-center">
        <h1 className="font-display text-2xl font-semibold text-ink">Couldn't load the blog</h1>
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

/* ---------- hero ---------- */

function Hero({ overlap }: { overlap: boolean }) {
  return (
    <section
      aria-labelledby="blog-title"
      className="relative overflow-hidden bg-brand-blue text-white"
    >
      <PixelField />
      <div
        className={cn(
          "relative mx-auto flex max-w-4xl flex-col items-center px-5 pt-14 text-center sm:pt-16",
          overlap ? "pb-40 sm:pb-48" : "pb-20",
        )}
      >
        <Reveal>
          <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-white" />
            The Rankbox blog
          </span>
        </Reveal>
        <Reveal delay={0.08}>
          <h1
            id="blog-title"
            className="text-balance font-display text-[2.35rem] font-bold leading-[1.06] tracking-tight sm:text-[3.25rem] xl:text-[3.6rem]"
          >
            Get your brand into the answer
          </h1>
        </Reveal>
        <Reveal delay={0.14}>
          <p className="mx-auto mt-5 max-w-2xl text-balance text-[1.05rem] leading-relaxed text-white/80">
            Practical, sourced playbooks for getting cited by ChatGPT, Perplexity, Gemini, and
            Google AI Overviews. Built to be used this week, not bookmarked.
          </p>
        </Reveal>
        <Reveal delay={0.2}>
          <ul
            aria-label="Answer engines we cover"
            className="mt-8 flex flex-wrap items-center justify-center gap-2"
          >
            {AI_MARKS.map(({ name, Mark }) => (
              <li
                key={name}
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 py-1 pl-1 pr-3 text-xs font-semibold text-white backdrop-blur"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white">
                  <Mark className="h-3.5 w-3.5" />
                </span>
                {name}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- library controls ---------- */

function topicCounts(posts: PostMeta[]): { topic: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const p of posts) for (const t of p.tags) counts.set(t, (counts.get(t) ?? 0) + 1);
  return [...counts]
    .map(([topic, count]) => ({ topic, count }))
    .sort((a, b) => b.count - a.count || a.topic.localeCompare(b.topic));
}

function TopicFilter({
  topics,
  total,
  active,
}: {
  topics: { topic: string; count: number }[];
  total: number;
  active?: string;
}) {
  const chip = (on: boolean) =>
    cn(
      "inline-flex h-9 shrink-0 items-center gap-2 whitespace-nowrap rounded-full border px-4 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-volt",
      on
        ? "border-ink bg-ink text-background"
        : "border-border bg-card text-ink/75 hover:border-ink/25 hover:text-ink",
    );
  const count = (on: boolean) =>
    cn("text-xs font-medium tabular-nums", on ? "text-background/60" : "text-muted-foreground");
  return (
    <nav aria-label="Topics" className="-mx-5 overflow-x-auto px-5 [scrollbar-width:none]">
      <ul className="flex gap-2">
        <li>
          <Link
            to="/blog"
            search={{}}
            resetScroll={false}
            aria-current={!active ? "page" : undefined}
            className={chip(!active)}
          >
            All <span className={count(!active)}>{total}</span>
          </Link>
        </li>
        {topics.map(({ topic, count: n }) => {
          const on = active === topic;
          return (
            <li key={topic}>
              <Link
                to="/blog"
                search={{ topic }}
                resetScroll={false}
                aria-current={on ? "page" : undefined}
                className={chip(on)}
              >
                {topic} <span className={count(on)}>{n}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function SearchField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <label className="relative block w-full md:w-72">
      <span className="sr-only">Search articles</span>
      <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search articles"
        className="h-11 w-full rounded-xl border border-border bg-card pl-10 pr-9 text-sm text-ink shadow-1 outline-none transition-shadow placeholder:text-muted-foreground focus:border-volt/50 focus:ring-4 focus:ring-volt/15 [&::-webkit-search-cancel-button]:hidden"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Clear search"
          className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary hover:text-ink"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </label>
  );
}

/* ---------- free tools band ---------- */

const TOOL_PICKS: { slug: string; icon: LucideIcon }[] = [
  { slug: "ai-robots-txt-generator", icon: Bot },
  { slug: "ai-question-generator", icon: MessageSquareText },
  { slug: "schema-generator", icon: Braces },
];

function ToolsBand() {
  const tools = TOOL_PICKS.map((t) => ({ ...t, tool: getTool(t.slug) })).filter((t) => t.tool);
  if (!tools.length) return null;
  return (
    <section aria-labelledby="tools-title" className="border-y border-border bg-surface/60">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:py-20">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-volt">
              Free tools
            </p>
            <h2
              id="tools-title"
              className="mt-2 font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl"
            >
              Put the playbooks to work
            </h2>
            <p className="mt-2 max-w-xl text-[0.95rem] text-muted-foreground">
              Free, no-signup tools for the steps these guides walk through.
            </p>
          </div>
          <Link
            to="/tools"
            className="group inline-flex items-center gap-1.5 text-sm font-semibold text-ink"
          >
            All free tools
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {tools.map(({ slug, icon: Icon, tool }, i) => (
            <Reveal key={slug} delay={i * 0.06}>
              <Link
                to="/tools/$slug"
                params={{ slug }}
                className="group flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-1 transition-all hover:-translate-y-0.5 hover:shadow-3"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-surface text-ink transition-colors group-hover:border-brand-blue group-hover:bg-brand-blue group-hover:text-white">
                  <Icon className="h-[1.1rem] w-[1.1rem]" />
                </span>
                <p className="mt-5 font-semibold text-ink">{tool!.name}</p>
                <p className="mt-1.5 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {tool!.tagline}
                </p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-volt">
                  Open tool
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- page ---------- */

function BlogIndex() {
  const { posts } = Route.useLoaderData();
  const { topic } = Route.useSearch();
  const [query, setQuery] = useState("");

  const featured = posts.find((p) => p.featured) ?? posts[0];
  const topics = useMemo(() => topicCounts(posts), [posts]);
  const q = query.trim().toLowerCase();
  const filtering = !!topic || !!q;
  const results = posts.filter(
    (p) =>
      (!topic || p.tags.includes(topic)) &&
      (!q || `${p.title} ${p.excerpt} ${p.tags.join(" ")}`.toLowerCase().includes(q)),
  );
  // Unfiltered, the lead story sits above; the grid holds everything else.
  const grid = filtering ? results : results.filter((p) => p !== featured);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero overlap={!!featured} />

        {featured && (
          <section aria-label="Featured article" className="relative z-10 -mt-32 px-5 sm:-mt-40">
            <Reveal y={28} className="mx-auto max-w-6xl">
              <FeaturedPost post={featured} />
            </Reveal>
          </section>
        )}

        <section
          id="articles"
          aria-labelledby="articles-title"
          className="mx-auto max-w-6xl scroll-mt-20 px-5 pb-20 pt-20 sm:pb-24 sm:pt-24"
        >
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <h2
                id="articles-title"
                className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl"
              >
                {topic ?? (filtering ? "Search results" : "Latest articles")}
              </h2>
              <p className="mt-1.5 text-sm text-muted-foreground" aria-live="polite">
                {filtering
                  ? `${results.length} ${results.length === 1 ? "article" : "articles"}${q ? ` matching “${query.trim()}”` : ""}`
                  : "Playbooks, research, and how-tos from the Rankbox team."}
              </p>
            </div>
            <SearchField value={query} onChange={setQuery} />
          </div>

          {topics.length > 1 && (
            <div className="mt-6">
              <TopicFilter topics={topics} total={posts.length} active={topic} />
            </div>
          )}

          {grid.length > 0 ? (
            <div className="mt-10 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
              {grid.map((p, i) => (
                <Reveal key={p.id} delay={(i % 3) * 0.06} className="h-full">
                  <PostCard post={p} />
                </Reveal>
              ))}
            </div>
          ) : (
            <div className="mt-10 rounded-2xl border border-dashed border-border bg-surface/50 px-6 py-14 text-center">
              <p className="font-display text-lg font-semibold text-ink">
                {posts.length === 0
                  ? "New articles are on the way"
                  : filtering
                    ? "No articles match that yet"
                    : "More articles are on the way"}
              </p>
              <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
                {filtering
                  ? "Try a different word, or browse every topic."
                  : "We publish new playbooks regularly. Check back soon."}
              </p>
              {filtering && (
                <Link
                  to="/blog"
                  search={{}}
                  resetScroll={false}
                  onClick={() => setQuery("")}
                  className="mt-6 inline-flex rounded-xl bg-ink px-5 py-2.5 text-sm font-semibold text-background"
                >
                  Clear filters
                </Link>
              )}
            </div>
          )}
        </section>

        <ToolsBand />
        <BlogCta />
      </main>
      <Footer />
    </div>
  );
}
