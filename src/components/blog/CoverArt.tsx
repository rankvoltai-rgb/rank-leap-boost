/**
 * A post's cover. Posts with a cover image show it; the rest get a generated
 * one in the site's language: a pixel field like the hero's, with an AI answer
 * card citing "yoursite.com" — the outcome every article is about.
 *
 * Everything is derived from the slug and first tag, so a post always gets the
 * same cover and server and client renders match. Sizes are in container
 * units, so one cover reads the same as a card thumbnail and as a hero.
 */
import type { CSSProperties } from "react";
import { AI_MARKS } from "@/components/landing/ai-logos";
import type { PostMeta } from "@/lib/notion.server";
import { cn } from "@/lib/utils";

type Engine = (typeof AI_MARKS)[number];

/* One tone per topic, so a topic reads the same everywhere on the blog. */
const TONES = [
  {
    field: "bg-brand-blue",
    pixel: "bg-white",
    label: "text-white/75",
    bubble: "bg-white/20",
    card: "bg-white",
  },
  {
    field: "bg-hero-black",
    pixel: "bg-brand-blue",
    label: "text-white/60",
    bubble: "bg-white/12",
    card: "bg-white",
  },
  {
    field: "bg-[color-mix(in_oklab,var(--brand-blue)_9%,white)]",
    pixel: "bg-brand-blue",
    label: "text-brand-blue/80",
    bubble: "bg-brand-blue",
    card: "bg-white ring-1 ring-ink/5",
  },
  {
    field: "bg-[linear-gradient(140deg,var(--brand-blue-deep),var(--hero-black))]",
    pixel: "bg-brand-blue",
    label: "text-white/60",
    bubble: "bg-white/12",
    card: "bg-white",
  },
] as const;

function hash(text: string): number {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/* Small seeded PRNG (mulberry32): the same slug always draws the same cover. */
function random(seed: number) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* The engine the post is about when its title names one, else a seeded pick. */
function engineFor(title: string, rand: () => number): Engine {
  const named = AI_MARKS.find((m) => new RegExp(`\\b${m.name}\\b`, "i").test(title));
  return named ?? AI_MARKS[Math.floor(rand() * AI_MARKS.length)];
}

export function CoverArt({
  post,
  className,
  showTopic = true,
}: {
  post: Pick<PostMeta, "slug" | "title" | "tags" | "cover">;
  className?: string;
  showTopic?: boolean;
}) {
  if (post.cover) {
    return (
      <div className={cn("relative overflow-hidden bg-secondary", className)}>
        <img
          src={post.cover}
          alt=""
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
    );
  }

  const topic = post.tags[0] ?? "";
  const tone = TONES[hash(topic || post.slug) % TONES.length];
  const rand = random(hash(post.slug));
  const engine = engineFor(post.title, rand);
  const pixels = Array.from({ length: 16 }, () => ({
    top: rand() * 92,
    left: rand() * 94,
    size: 1.2 + rand() * 2.6,
    opacity: 0.08 + rand() * 0.2,
  }));
  const lines = [88 + rand() * 12, 70 + rand() * 24, 45 + rand() * 25];
  const Mark = engine.Mark;

  return (
    <div aria-hidden className={cn("@container relative overflow-hidden", tone.field, className)}>
      {pixels.map((p, i) => (
        <span
          key={i}
          className={cn("absolute", tone.pixel)}
          style={
            {
              top: `${p.top}%`,
              left: `${p.left}%`,
              width: `${p.size}cqw`,
              height: `${p.size}cqw`,
              opacity: p.opacity,
            } as CSSProperties
          }
        />
      ))}

      {/* The buyer's question, then the answer that cites them. */}
      <div
        className={cn(
          "absolute right-[8%] top-[12%] w-[34%] space-y-[1cqw] rounded-[1.6cqw] rounded-br-[0.4cqw] px-[2cqw] py-[1.8cqw]",
          tone.bubble,
        )}
      >
        <div className="h-[1.2cqw] rounded-full bg-white/80" />
        <div className="h-[1.2cqw] w-3/5 rounded-full bg-white/80" />
      </div>
      <div
        className={cn(
          "absolute left-[14%] top-[34%] w-[58%] rounded-[1.6cqw] p-[3cqw] shadow-[0_2cqw_5cqw_-2cqw_rgb(0_0_0/0.35)]",
          tone.card,
        )}
      >
        <div className="flex items-center gap-[1.2cqw]">
          <span className="flex h-[4.4cqw] w-[4.4cqw] items-center justify-center rounded-full border border-border bg-background">
            <Mark className="h-[2.6cqw] w-[2.6cqw]" />
          </span>
          <span className="text-[2.2cqw] font-semibold text-ink">{engine.name}</span>
          <span className="ml-auto h-[1.2cqw] w-[1.2cqw] rounded-full bg-volt" />
        </div>
        <div className="mt-[2.6cqw] space-y-[1.3cqw]">
          {lines.map((w, i) => (
            <div key={i} className="h-[1.4cqw] rounded-full bg-ink/10" style={{ width: `${w}%` }} />
          ))}
        </div>
        <div className="mt-[2.8cqw] flex items-center gap-[1.2cqw]">
          <span className="inline-flex items-center gap-[0.8cqw] rounded-[0.9cqw] border border-volt/40 bg-volt/10 px-[1.3cqw] py-[0.6cqw] text-[1.7cqw] font-semibold text-ink">
            <span className="h-[0.9cqw] w-[0.9cqw] rounded-full bg-volt" />
            yoursite.com
          </span>
          <span className="rounded-full bg-success/15 px-[1.3cqw] py-[0.6cqw] text-[1.6cqw] font-semibold text-success">
            Cited
          </span>
        </div>
      </div>

      {showTopic && topic && (
        <span
          className={cn(
            "absolute bottom-[5cqw] left-[5cqw] text-[1.9cqw] font-semibold uppercase tracking-[0.2em]",
            tone.label,
          )}
        >
          {topic}
        </span>
      )}
    </div>
  );
}
