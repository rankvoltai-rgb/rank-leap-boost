import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { CoverArt } from "@/components/blog/CoverArt";
import { formatDate } from "@/lib/format-date";
import type { PostMeta } from "@/lib/notion.server";
import { cn } from "@/lib/utils";
import { Mark } from "@/components/brand/Mark";

/* ---------- byline ---------- */

export function AuthorMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-ink/[0.08] bg-white",
        className,
      )}
    >
      <Mark className="h-[55%] w-[55%] text-brand-blue" />
    </span>
  );
}

/** "September 18, 2026 · 14 min read" */
export function PostStamp({ post, className }: { post: PostMeta; className?: string }) {
  const parts = [
    post.date ? formatDate(post.date) : null,
    post.readingMinutes ? `${post.readingMinutes} min read` : null,
  ].filter(Boolean);
  if (!parts.length) return null;
  return <span className={className}>{parts.join(" · ")}</span>;
}

export function Byline({ post, className }: { post: PostMeta; className?: string }) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <AuthorMark className="h-9 w-9" />
      <div className="min-w-0 text-sm leading-tight">
        <p className="truncate font-semibold text-ink">{post.author}</p>
        <PostStamp post={post} className="mt-0.5 block truncate text-xs text-muted-foreground" />
      </div>
    </div>
  );
}

export function TopicLabel({ topic, className }: { topic?: string; className?: string }) {
  if (!topic) return null;
  return (
    <span
      className={cn("text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-cta", className)}
    >
      {topic}
    </span>
  );
}

/* ---------- grid card ---------- */

/* One cell of the blog's hairline grid: the cover inset in the cell, then
   topic, title, excerpt and date. The cell lifts to a faint grey on hover
   rather than casting a shadow, as the landing's cells do. */
export function PostCard({ post, className }: { post: PostMeta; className?: string }) {
  return (
    <Link
      to="/blog/$slug"
      params={{ slug: post.slug }}
      className={cn(
        "group flex h-full flex-col p-4 outline-none transition-colors duration-300 hover:bg-[color-mix(in_oklab,var(--surface)_35%,white)] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-cta/40 sm:p-5",
        className,
      )}
    >
      <div className="overflow-hidden rounded-lg border border-ink/[0.06]">
        <CoverArt
          post={post}
          className="aspect-[16/10] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
        />
      </div>
      <div className="flex flex-1 flex-col px-1 pt-5">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <TopicLabel topic={post.tags[0]} />
          {post.readingMinutes ? (
            <>
              <span aria-hidden className="h-0.5 w-0.5 rounded-full bg-muted-foreground" />
              <span>{post.readingMinutes} min read</span>
            </>
          ) : null}
        </div>
        <h3 className="mt-2.5 text-balance font-display text-[1.15rem] font-medium leading-snug tracking-[-0.015em] text-ink transition-colors group-hover:text-brand-blue">
          {post.title}
        </h3>
        {post.excerpt && (
          <p className="mt-2 line-clamp-3 text-[0.9rem] leading-relaxed text-muted-foreground">
            {post.excerpt}
          </p>
        )}
        {post.date && (
          <p className="mt-auto pt-5 text-xs text-muted-foreground">{formatDate(post.date)}</p>
        )}
      </div>
    </Link>
  );
}

/* ---------- lead story ---------- */

/* The lead story, filling one band of the blog's frame: the cover flush to
   the left rail with a hairline of white around it, the story beside it. */
export function FeaturedPost({ post }: { post: PostMeta }) {
  return (
    <Link
      to="/blog/$slug"
      params={{ slug: post.slug }}
      className="group grid outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-cta/40 lg:grid-cols-[1.12fr_1fr]"
    >
      <div className="p-3 lg:pr-0">
        <div className="relative h-full overflow-hidden rounded-lg border border-ink/[0.06]">
          <CoverArt
            post={post}
            className="aspect-[16/10] h-full w-full transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.02] lg:aspect-auto lg:min-h-[24rem]"
          />
        </div>
      </div>
      <div className="flex flex-col px-6 pb-8 pt-4 sm:px-10 lg:py-10 lg:pl-12">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="inline-flex items-center gap-1.5 rounded-md bg-cta-soft px-2 py-0.5 text-[0.72rem] font-semibold text-cta">
            <span className="h-1.5 w-1.5 rounded-full bg-cta" />
            Featured
          </span>
          <TopicLabel topic={post.tags[0]} className="text-muted-foreground" />
        </div>
        <h2 className="mt-5 text-balance font-display text-[1.75rem] font-medium leading-[1.12] tracking-[-0.025em] text-ink transition-colors group-hover:text-brand-blue sm:text-[2.1rem]">
          {post.title}
        </h2>
        {post.excerpt && (
          <p className="mt-4 text-[0.98rem] leading-relaxed text-muted-foreground sm:text-[1.02rem]">
            {post.excerpt}
          </p>
        )}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-5 lg:mt-auto lg:pt-8">
          <Byline post={post} />
          <span className="inline-flex h-10 items-center gap-2 rounded-lg bg-cta px-4 text-sm font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.16),0_1px_2px_rgba(16,24,40,0.14)] transition-colors group-hover:bg-cta-hover">
            Read the article
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
