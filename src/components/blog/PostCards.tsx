import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { CoverArt } from "@/components/blog/CoverArt";
import { formatDate } from "@/lib/format-date";
import type { PostMeta } from "@/lib/notion.server";
import { cn } from "@/lib/utils";
import rankvoltMark from "@/assets/rankvolt-mark.png.asset.json";

/* ---------- byline ---------- */

export function AuthorMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-card",
        className,
      )}
    >
      <img src={rankvoltMark.url} alt="" className="h-[55%] w-[55%] object-contain" />
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
      className={cn(
        "text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-volt",
        className,
      )}
    >
      {topic}
    </span>
  );
}

/* ---------- grid card ---------- */

export function PostCard({ post, className }: { post: PostMeta; className?: string }) {
  return (
    <Link
      to="/blog/$slug"
      params={{ slug: post.slug }}
      className={cn("group flex h-full flex-col rounded-2xl outline-none", className)}
    >
      <div className="overflow-hidden rounded-2xl border border-border shadow-1 transition-shadow duration-300 group-hover:shadow-3 group-focus-visible:ring-2 group-focus-visible:ring-volt">
        <CoverArt
          post={post}
          showTopic={false}
          className="aspect-[16/10] transition-transform duration-500 ease-out group-hover:scale-[1.035]"
        />
      </div>
      <div className="flex flex-1 flex-col pt-5">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <TopicLabel topic={post.tags[0]} />
          {post.readingMinutes ? (
            <>
              <span aria-hidden className="h-0.5 w-0.5 rounded-full bg-muted-foreground" />
              <span>{post.readingMinutes} min read</span>
            </>
          ) : null}
        </div>
        <h3 className="mt-2.5 text-balance font-display text-[1.2rem] font-semibold leading-snug tracking-tight text-ink decoration-ink/25 decoration-2 underline-offset-4 group-hover:underline">
          {post.title}
        </h3>
        {post.excerpt && (
          <p className="mt-2.5 line-clamp-3 text-[0.925rem] leading-relaxed text-muted-foreground">
            {post.excerpt}
          </p>
        )}
        {post.date && (
          <p className="mt-auto pt-5 text-xs font-medium text-muted-foreground">
            {formatDate(post.date)}
          </p>
        )}
      </div>
    </Link>
  );
}

/* ---------- lead story ---------- */

export function FeaturedPost({ post }: { post: PostMeta }) {
  return (
    <Link
      to="/blog/$slug"
      params={{ slug: post.slug }}
      className="group grid overflow-hidden rounded-3xl border border-border bg-card shadow-4 outline-none focus-visible:ring-2 focus-visible:ring-volt lg:grid-cols-[1.12fr_1fr]"
    >
      <div className="relative overflow-hidden border-b border-border lg:border-b-0 lg:border-r">
        <CoverArt
          post={post}
          className="aspect-[16/10] h-full w-full transition-transform duration-700 ease-out group-hover:scale-[1.025] lg:aspect-auto lg:min-h-[25rem]"
        />
      </div>
      <div className="flex flex-col p-7 sm:p-10">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-volt/25 bg-volt/10 px-2.5 py-0.5 text-[0.7rem] font-semibold text-volt">
            <span className="h-1.5 w-1.5 rounded-full bg-volt" />
            Featured
          </span>
          <TopicLabel topic={post.tags[0]} className="text-muted-foreground" />
        </div>
        <h2 className="mt-5 text-balance font-display text-[1.75rem] font-bold leading-[1.12] tracking-tight text-ink sm:text-[2.2rem]">
          {post.title}
        </h2>
        {post.excerpt && (
          <p className="mt-4 text-[1rem] leading-relaxed text-muted-foreground sm:text-[1.05rem]">
            {post.excerpt}
          </p>
        )}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-5 lg:mt-auto lg:pt-8">
          <Byline post={post} />
          <span className="inline-flex items-center gap-2 rounded-xl bg-ink px-5 py-3 text-sm font-semibold text-background shadow-sm transition-transform group-hover:-translate-y-0.5">
            Read the article
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
