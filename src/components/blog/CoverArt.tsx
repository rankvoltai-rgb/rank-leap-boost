/**
 * A post's cover. Posts with a cover image show it; the rest get a generated
 * one in the style of Webflow's blog covers (see covers/). The scene is
 * picked from what the title is about, so the grid reads as a set of
 * subjects rather than 80 copies of one picture.
 *
 * Everything is derived from the slug and title, so a post always gets the
 * same cover and server and client renders match. The art is one SVG canvas
 * scaled to cover its box, so it reads the same as a card thumbnail and as a
 * hero.
 */
import { useId } from "react";
import { AI_MARKS } from "@/components/landing/ai-logos";
import type { PostMeta } from "@/lib/notion.server";
import { cn } from "@/lib/utils";
import { CoverScene } from "./covers/CoverScene";
import { hash, type Engine, type SceneName } from "./covers/kit";

/* How a title names each engine. Google counts only as Google's AI search:
   "Google Analytics" or "Google Search Console" is not an AI engine. */
const ENGINE_NAMES: Record<Engine["name"], RegExp> = {
  ChatGPT: /\bchatgpt\b/i,
  Google: /\bgoogle ai\b|\bai overviews?\b|\bai mode\b/i,
  Gemini: /\bgemini\b/i,
  Claude: /\bclaude\b/i,
  Perplexity: /\bperplexity\b/i,
};

/* The engine the title names, if any. */
function namedEngine(title: string): Engine | null {
  return AI_MARKS.find((m) => ENGINE_NAMES[m.name].test(title)) ?? null;
}

/* First match wins, so the more specific subjects come first: an llms.txt
   post about indexing is a file post, a bot post about tracking is a crawl
   post, a post about tracking competitors is a leaderboard. */
const SUBJECTS: [SceneName, RegExp][] = [
  ["file", /llms\.txt|schema/i],
  ["bots", /census|directory|user agent/i],
  [
    "crawl",
    /crawl|\bbots?\b|gptbot|claudebot|perplexitybot|searchbot|cloudflare|robots|webmaster|index/i,
  ],
  ["leaderboard", /benchmark|competitor|rank tracker|rankings/i],
  ["traffic", /traffic|ga4|referral/i],
  ["feed", /(track|monitor)\w* brand mentions/i],
  ["analytics", /track|measur|metric|analytic|monitor/i],
  ["compare", /alternative|compar(e|ing)\b.*\b(tools|software|options)|optimization tools/i],
  ["graph", /knowledge graph|entit|\brag\b|vector|intent|\bmcp\b|model collapse|rank brands/i],
  ["answer", /brand|mention|hallucinat|\bfacts?\b|defensive|drift|say when/i],
];

const WRITING =
  /writ|content|blog post|rewrite|template|comparison page|prompt|playbook|formula|optimi[sz]e/i;

function sceneFor(post: Pick<PostMeta, "title" | "tags">, engine: Engine | null, seed: number) {
  if (post.tags.includes("Alternatives")) return "compare";
  const subject = SUBJECTS.find(([, test]) => test.test(post.title));
  if (subject) return subject[0];
  if (engine) return "lockup";
  if (WRITING.test(post.title)) return "write";
  return seed % 2 ? "write" : "lockup";
}

export function CoverArt({
  post,
  className,
  onBlue,
}: {
  post: Pick<PostMeta, "slug" | "title" | "tags" | "cover">;
  className?: string;
  /** Set where the cover sits on the brand-blue article header. */
  onBlue?: boolean;
}) {
  // Gradient and filter ids must be unique per cover: a grid shows dozens.
  const uid = `cover${useId().replace(/[^\w-]/g, "")}`;

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

  const seed = hash(post.slug);
  const engine = namedEngine(post.title);
  return (
    <div aria-hidden className={cn("relative overflow-hidden bg-brand-blue", className)}>
      <CoverScene
        scene={sceneFor(post, engine, seed)}
        seed={seed}
        engine={engine}
        title={post.title}
        uid={uid}
        onBlue={onBlue}
      />
    </div>
  );
}
