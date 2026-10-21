import { useMemo, useState, type CSSProperties } from "react";
import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import {
  ArrowRight,
  BookOpen,
  Bot,
  Braces,
  MessageSquareText,
  Search,
  Wrench,
  X,
  type LucideIcon,
} from "lucide-react";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { MarkDither } from "@/components/landing/hero-dither";
import { AI_MARKS } from "@/components/landing/ai-logos";
import { Reveal } from "@/components/landing/shared";
import {
  Accent,
  Band,
  CELL,
  CellGrid,
  GHOST_BUTTON,
  LINE,
  Pill,
  Spacer,
} from "@/components/landing/frame";
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
    <div className="min-h-screen bg-white">
      <Navbar framed />
      <main>
        <Band inner="px-5 py-32 text-center">
          <h1 className="font-display text-2xl font-medium tracking-[-0.02em] text-ink">
            Couldn't load the blog
          </h1>
          <p className="mt-3 text-muted-foreground">Please try again in a moment.</p>
          <button
            onClick={() => router.invalidate()}
            className="mt-6 inline-flex h-10 items-center rounded-lg bg-cta px-5 text-sm font-semibold text-white transition-colors hover:bg-cta-hover"
          >
            Retry
          </button>
        </Band>
        <Spacer closing />
      </main>
      <Footer />
    </div>
  );
}

/* Staggers the CSS entrance (see animate-hero-rise in styles.css). */
const rise = (delay: number) => ({ "--rise-delay": `${delay}s` }) as CSSProperties;

/* ---------- hero ---------- */

/* The landing hero's frame and dithered mark, holding the blog's promise and
   the engines its playbooks cover. */
function Hero() {
  return (
    <section aria-labelledby="blog-title" className="relative bg-white">
      <div className={cn("relative mx-auto max-w-6xl overflow-hidden border-x", LINE)}>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.32] [mask-image:radial-gradient(ellipse_66%_82%_at_50%_50%,#000_50%,transparent_100%)]"
        >
          <MarkDither />
        </div>
        <div className="relative flex flex-col items-center px-5 pb-14 pt-14 text-center sm:px-8 sm:pb-16 sm:pt-16">
          <div className="motion-safe:animate-hero-rise" style={rise(0)}>
            <Pill icon={BookOpen}>The Rankbox blog</Pill>
          </div>
          <h1
            id="blog-title"
            className="mt-6 text-balance font-display text-[2.3rem] font-medium leading-[1.08] tracking-[-0.035em] text-ink motion-safe:animate-hero-rise sm:text-[3.3rem] lg:text-[3.8rem]"
            style={rise(0.08)}
          >
            Get your brand <Accent>into the answer</Accent>
          </h1>
          <p
            className="mx-auto mt-5 max-w-2xl text-balance text-[1.05rem] leading-relaxed text-muted-foreground motion-safe:animate-hero-rise sm:text-[1.12rem]"
            style={rise(0.16)}
          >
            Practical, sourced playbooks for getting cited by ChatGPT, Perplexity, Gemini, and
            Google AI Overviews. Built to be used this week, not bookmarked.
          </p>
          <ul
            aria-label="Answer engines we cover"
            className="mt-8 flex flex-wrap items-center justify-center gap-2 motion-safe:animate-hero-rise"
            style={rise(0.24)}
          >
            {AI_MARKS.map(({ name, Mark }) => (
              <li
                key={name}
                className="inline-flex items-center gap-2 rounded-lg border border-ink/[0.08] bg-white py-1 pl-1 pr-2.5 text-[0.8rem] font-medium text-ink shadow-[0_1px_2px_rgba(16,24,40,0.04)]"
              >
                <span className="flex h-5 w-5 items-center justify-center rounded-md border border-ink/[0.06]">
                  <Mark className="h-3 w-3" />
                </span>
                {name}
              </li>
            ))}
          </ul>
        </div>
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
      "inline-flex h-8 shrink-0 items-center gap-2 whitespace-nowrap rounded-lg border px-3 text-[0.82rem] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta/40",
      on
        ? "border-cta/25 bg-cta-soft text-cta"
        : "border-ink/[0.08] bg-white text-ink/75 hover:border-ink/[0.16] hover:text-ink",
    );
  const count = (on: boolean) =>
    cn("text-xs tabular-nums", on ? "text-cta/70" : "text-muted-foreground");
  return (
    <nav
      aria-label="Topics"
      className="-mx-6 overflow-x-auto px-6 [scrollbar-width:none] sm:-mx-10 sm:px-10 lg:-mx-12 lg:px-12"
    >
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
        className="h-10 w-full rounded-lg border border-ink/[0.1] bg-white pl-10 pr-9 text-sm text-ink shadow-[0_1px_2px_rgba(16,24,40,0.04)] outline-none transition-[border-color,box-shadow] placeholder:text-muted-foreground hover:border-ink/[0.16] focus:border-cta/50 focus:shadow-[0_0_0_4px_color-mix(in_oklab,var(--cta)_12%,transparent)] [&::-webkit-search-cancel-button]:hidden"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Clear search"
          className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground hover:bg-ink/[0.04] hover:text-ink"
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
    <section aria-labelledby="tools-title">
      <Spacer />
      <Band inner="flex flex-col gap-5 px-6 py-10 sm:px-10 md:flex-row md:items-end md:justify-between lg:px-12">
        <div>
          <Pill icon={Wrench}>Free tools</Pill>
          <h2
            id="tools-title"
            className="mt-4 font-display text-[1.6rem] font-medium leading-tight tracking-[-0.025em] text-ink sm:text-[1.9rem]"
          >
            Put the playbooks <Accent>to work</Accent>
          </h2>
          <p className="mt-2 max-w-xl text-[0.95rem] text-muted-foreground">
            Free, no-signup tools for the steps these guides walk through.
          </p>
        </div>
        <Link to="/tools" className={cn(GHOST_BUTTON, "group/btn w-fit")}>
          All free tools
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-0.5" />
        </Link>
      </Band>
      <Band>
        <CellGrid className="md:grid-cols-3">
          {tools.map(({ slug, icon: Icon, tool }, i) => (
            <li key={slug} className={CELL}>
              <Reveal delay={i * 0.06} className="h-full">
                <Link
                  to="/tools/$slug"
                  params={{ slug }}
                  className="group flex h-full flex-col p-6 transition-colors duration-300 hover:bg-[color-mix(in_oklab,var(--surface)_35%,white)] sm:p-8"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-ink/[0.08] bg-white text-ink/75 shadow-[0_1px_2px_rgba(16,24,40,0.04)] transition-colors group-hover:border-cta group-hover:bg-cta group-hover:text-white">
                    <Icon className="h-4 w-4" />
                  </span>
                  <p className="mt-5 text-[1.02rem] font-semibold tracking-tight text-ink">
                    {tool!.name}
                  </p>
                  <p className="mt-1.5 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {tool!.tagline}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-cta">
                    Open tool
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Link>
              </Reveal>
            </li>
          ))}
        </CellGrid>
      </Band>
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
    <div className="min-h-screen bg-white">
      <Navbar framed />
      <main>
        <Hero />

        {featured && (
          <section aria-label="Featured article">
            <Band>
              <Reveal y={20}>
                <FeaturedPost post={featured} />
              </Reveal>
            </Band>
          </section>
        )}

        <section id="articles" aria-labelledby="articles-title" className="scroll-mt-16">
          <Spacer />
          <Band inner="flex flex-col gap-5 px-6 py-8 sm:px-10 md:flex-row md:items-end md:justify-between lg:px-12">
            <div>
              <h2
                id="articles-title"
                className="font-display text-[1.6rem] font-medium leading-tight tracking-[-0.025em] text-ink sm:text-[1.9rem]"
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
          </Band>

          {topics.length > 1 && (
            <Band inner="px-6 py-3.5 sm:px-10 lg:px-12">
              <TopicFilter topics={topics} total={posts.length} active={topic} />
            </Band>
          )}

          <Band>
            {grid.length > 0 ? (
              <CellGrid className="sm:grid-cols-2 lg:grid-cols-3">
                {grid.map((p, i) => (
                  <li key={p.id} className={CELL}>
                    <Reveal delay={(i % 3) * 0.05} className="h-full">
                      <PostCard post={p} />
                    </Reveal>
                  </li>
                ))}
              </CellGrid>
            ) : (
              <div className="px-6 py-16 text-center">
                <p className="font-display text-lg font-medium text-ink">
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
                    className="mt-6 inline-flex h-10 items-center rounded-lg bg-cta px-5 text-sm font-semibold text-white transition-colors hover:bg-cta-hover"
                  >
                    Clear filters
                  </Link>
                )}
              </div>
            )}
          </Band>
        </section>

        <ToolsBand />
        <BlogCta framed />
      </main>
      <Footer />
    </div>
  );
}
