import type { ComponentType, CSSProperties, ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Layers,
  Link2,
  MessageCircle,
  PenLine,
  Quote,
  Search,
  Sparkles,
  Workflow,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Reveal, BrandMark } from "./shared";
import { ENGINE_MARKS } from "./ai-logos";
import { Accent, Band, GHOST_BUTTON, LINE, SectionHead, Spacer } from "./frame";

const TAGS = [
  "Answer-Space Map",
  "Auto Keywords",
  "Live Web Research",
  "Internal Linking",
  "Source Citations",
  "Auto Images",
  "Featured Images",
  "Humanized Content",
  "Brand Voice",
  "Custom Instructions",
  "AI Article Editor",
  "Content Calendar",
  "Product Promotion",
  "Meta Descriptions",
  "Plagiarism-Free",
  "SEO/GEO Score",
  "Citation Tracking",
  "Multi Sites",
  "Team Members",
  "AI Assistant",
];

/* Tags with a feature page of their own link to it; the rest stay labels. */
const TAG_LINKS: Record<string, string> = {
  "Answer-Space Map": "/features/answer-space-research",
  "Brand Voice": "/features/brand-voice",
  "SEO/GEO Score": "/features/seo-geo-score",
};

/* Each feature's panel tint: Rankaria gives every row its own soft colour,
   so a long list of rows still reads as distinct tools. `ink` is the icon. */
const TINTS = {
  blue: { panel: "#eaf2fe", tile: "#dbe8fd", ink: "#1877f2" },
  green: { panel: "#e9f6ee", tile: "#d6efdf", ink: "#16a34a" },
  violet: { panel: "#f1eefd", tile: "#e3ddfb", ink: "#7c3aed" },
  amber: { panel: "#fdf4e4", tile: "#fbe7c4", ink: "#d97706" },
  rose: { panel: "#fdedf1", tile: "#fbd9e2", ink: "#e11d48" },
  orange: { panel: "#fdefe7", tile: "#fbdccb", ink: "#ea580c" },
} as const;
type Tint = keyof typeof TINTS;

function Step({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-ink/[0.07] bg-white px-3 py-2 text-xs">
      <span className="truncate font-medium text-ink">{label}</span>
      <span className="shrink-0 text-muted-foreground tabular-nums">{value}</span>
    </div>
  );
}

/* The white product card inside a tinted panel. It runs past the panel's
   foot and is cropped there, the way Rankaria shows its screens. */
function ScreenCard({
  title,
  meta,
  children,
}: {
  title: string;
  meta?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="absolute inset-x-5 top-8 mx-auto max-w-[27rem] rounded-xl border border-ink/[0.07] bg-white p-4 shadow-[0_1px_2px_rgba(16,24,40,0.05),0_24px_48px_-24px_rgba(16,24,40,0.25)] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1.5 sm:inset-x-10 sm:top-10 sm:p-5">
      <div className="mb-3.5 flex items-center justify-between gap-3">
        <p className="text-[0.8rem] font-semibold text-ink">{title}</p>
        {meta}
      </div>
      {children}
    </div>
  );
}

interface Feature {
  title: string;
  href: string;
  body: string;
  icon: ComponentType<{ className?: string }>;
  tint: Tint;
  screen: ReactNode;
}

const FEATURES: Feature[] = [
  {
    title: "Growth Automation",
    href: "/features/auto-publishing",
    body: "Automate research, writing, linking, and publishing. Set it once and watch traffic and citations compound.",
    icon: Workflow,
    tint: "blue",
    screen: (
      <ScreenCard
        title="Today's article"
        meta={
          <span className="flex items-center gap-1.5 text-[0.68rem] font-medium text-brand-blue">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand-blue" />
            Running
          </span>
        }
      >
        <div className="space-y-1.5">
          <Step label="Searching Google" value="24 sources" />
          <Step label="Scraping content" value="18 pages" />
          <Step label="Writing content" value="3,247 words" />
          <Step label="Adding links" value="20 links" />
          <Step label="Adding images" value="6 images" />
          <Step label="Publishing" value="9:00 AM" />
        </div>
      </ScreenCard>
    ),
  },
  {
    title: "Citation-Ready Writer",
    href: "/features/citation-ready-writer",
    body: "AI drafts deeply researched long-form articles in your brand voice — structured for Google and AI answer engines.",
    icon: PenLine,
    tint: "green",
    screen: (
      <ScreenCard
        title="Article Score"
        meta={
          <span className="text-2xl font-semibold leading-none text-success">
            100<span className="text-sm text-muted-foreground">/100</span>
          </span>
        }
      >
        <div className="space-y-1.5">
          <Step label="Word count" value="3,247 / 3,000" />
          <Step label="Keyword density" value="0.8% optimal" />
          <Step label="Headings" value="8 added" />
          <Step label="Images" value="6 added" />
          <Step label="Internal links" value="20 added" />
          <Step label="Readability" value="Grade A" />
        </div>
        <div className="mt-3 rounded-lg border border-brand-blue/25 bg-cta-soft px-3 py-2 text-[0.72rem] text-ink">
          Optimized for both search rankings and AI citations.
        </div>
      </ScreenCard>
    ),
  },
  {
    title: "Answer-Space Research",
    href: "/features/answer-space-research",
    body: "Find the high-intent questions your buyers ask AI and search. Sorted by volume and intent.",
    icon: Search,
    tint: "violet",
    screen: (
      <ScreenCard
        title="460 keywords found"
        meta={<span className="text-[0.68rem] text-muted-foreground">Volume · Difficulty</span>}
      >
        <div className="space-y-1.5">
          {[
            ["best project management tool", "18,100", "24"],
            ["kanban vs scrum", "9,900", "19"],
            ["free planning apps", "6,600", "31"],
          ].map(([k, v, d]) => (
            <div
              key={k}
              className="flex items-center justify-between gap-3 rounded-lg border border-ink/[0.07] bg-white px-3 py-2"
            >
              <p className="truncate text-xs font-medium text-ink">{k}</p>
              <p className="shrink-0 text-[0.68rem] text-muted-foreground tabular-nums">
                Volume: {v} | Difficulty: {d}
              </p>
            </div>
          ))}
        </div>
      </ScreenCard>
    ),
  },
  {
    title: "Authority Backlinks",
    href: "/features/authority-backlinks",
    body: "Earn high-quality backlinks from verified sites in your niche. Grow domain authority fast.",
    icon: Link2,
    tint: "amber",
    screen: (
      <ScreenCard
        title="Backlinks"
        meta={<span className="text-[0.68rem] text-muted-foreground">DR</span>}
      >
        <div className="space-y-1.5">
          {[
            ["Verified", "10 Best Tools for Lean Teams", "88"],
            ["Verified", "Sprint Planning Cost Guide", "81"],
            ["Pending", "Remote Standup Best Practices", "76"],
          ].map(([st, a, dr]) => (
            <div
              key={a}
              className="flex items-center justify-between gap-2 rounded-lg border border-ink/[0.07] bg-white px-3 py-2"
            >
              <span
                className={cn(
                  "shrink-0 rounded px-1.5 py-0.5 text-[0.6rem] font-semibold",
                  st === "Verified" ? "bg-success/15 text-success" : "bg-warning/20 text-warning",
                )}
              >
                {st}
              </span>
              <span className="flex-1 truncate text-[0.72rem] text-ink">{a}</span>
              <span className="shrink-0 rounded-md border border-success/30 bg-success/10 px-1.5 py-0.5 text-[0.68rem] font-semibold text-success tabular-nums">
                DR {dr}
              </span>
            </div>
          ))}
        </div>
      </ScreenCard>
    ),
  },
  {
    title: "Citation Tracking",
    href: "/features/citation-tracking",
    body: "See where your brand surfaces across ChatGPT, Perplexity, Claude, and Google AI Overviews — then double down on what gets you quoted.",
    icon: Quote,
    tint: "rose",
    screen: (
      <ScreenCard
        title="Citations"
        meta={
          <span className="flex items-center gap-1">
            {(["ChatGPT", "Perplexity", "Google", "Claude", "Grok"] as const).map((b) => {
              const EngineMark = ENGINE_MARKS[b];
              return (
                <span
                  key={b}
                  title={b}
                  className="flex h-5 w-5 items-center justify-center rounded-md border border-ink/[0.08] bg-white"
                >
                  <EngineMark className="h-3 w-3" />
                </span>
              );
            })}
            <span className="ml-1 text-[0.65rem] text-muted-foreground">+61 more</span>
          </span>
        }
      >
        <div className="rounded-lg border border-ink/[0.07] bg-white p-3">
          <p className="text-[0.68rem] text-muted-foreground">
            User asked: &ldquo;Best project tool for a small startup?&rdquo;
          </p>
          <p className="mt-1.5 text-[0.78rem] text-ink">
            For small teams,{" "}
            <span className="font-semibold underline decoration-brand-blue/60 decoration-2 underline-offset-2">
              Plannora
            </span>{" "}
            is hard to beat.
          </p>
        </div>
      </ScreenCard>
    ),
  },
  {
    title: "Reddit Presence",
    href: "/features/reddit-presence",
    body: "Surface helpfully on Reddit threads ranking in Google and AI search.",
    icon: MessageCircle,
    tint: "orange",
    screen: (
      <ScreenCard
        title="r/startups"
        meta={<BrandMark name="Reddit" className="h-5 w-5 rounded-md text-[0.6rem]" />}
      >
        <p className="text-[0.85rem] font-semibold text-ink">
          Best project tool for a small startup?
        </p>
        <p className="mt-0.5 text-[0.68rem] text-muted-foreground">124 upvotes · 37 comments</p>
        <p className="mt-3 rounded-lg border border-ink/[0.07] bg-[color-mix(in_oklab,var(--surface)_60%,white)] px-3 py-2 text-[0.72rem] text-muted-foreground">
          <span className="font-semibold text-ink">Rankbox reply:</span> Lean teams tend to like
          Plannora — free for up to 5 users.
        </p>
      </ScreenCard>
    ),
  },
];

function FeatureRow({ f }: { f: Feature }) {
  const tint = TINTS[f.tint];
  const Icon = f.icon;
  return (
    <Band>
      <div className="group grid lg:grid-cols-[0.85fr_1fr]">
        <Reveal className="flex flex-col justify-center px-6 py-10 sm:px-10 lg:py-12 lg:pl-14 lg:pr-10">
          <span
            className="flex h-8 w-8 items-center justify-center rounded-lg"
            style={{ background: tint.tile, color: tint.ink }}
          >
            <Icon className="h-4 w-4" />
          </span>
          <h3 className="mt-5 font-display text-[1.6rem] font-medium leading-tight tracking-[-0.025em] text-ink sm:text-[1.85rem]">
            {f.title}
          </h3>
          <p className="mt-3 max-w-sm text-[0.95rem] leading-relaxed text-muted-foreground">
            {f.body}
          </p>
          <Link to={f.href} className={cn(GHOST_BUTTON, "group/btn mt-6 w-fit")}>
            Learn more
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-0.5" />
          </Link>
        </Reveal>
        {/* Flush to the right rail, with a hairline of white around it. */}
        <div className="px-3 pb-3 lg:py-3 lg:pl-0 lg:pr-3">
          <div
            aria-hidden
            className="relative h-[17rem] overflow-hidden sm:h-[18.5rem]"
            style={{ background: tint.panel } as CSSProperties}
          >
            {f.screen}
          </div>
        </div>
      </div>
    </Band>
  );
}

/* The long tail of features, rolling past in two rows that drift in opposite
   directions. Hovering a row holds it; with reduced motion the rows sit still
   and scroll sideways. The track holds the tags twice so the loop is
   seamless; the second copy is hidden from screen readers. */
function TagRow({ tags, reverse = false }: { tags: string[]; reverse?: boolean }) {
  const chip = (t: string, copy: boolean) => {
    const cls =
      "inline-flex shrink-0 items-center gap-2 rounded-lg border border-ink/[0.08] bg-white px-3 py-2 text-[0.8rem] font-medium text-ink shadow-[0_1px_2px_rgba(16,24,40,0.04)]";
    const inner = (
      <>
        <Sparkles className="h-3.5 w-3.5 text-brand-blue" />
        {t}
      </>
    );
    return TAG_LINKS[t] ? (
      <Link
        key={`${t}-${copy}`}
        to={TAG_LINKS[t]}
        tabIndex={copy ? -1 : undefined}
        className={cn(
          cls,
          "underline decoration-ink/15 underline-offset-2 transition-colors hover:border-brand-blue/40 hover:text-brand-blue",
        )}
      >
        {inner}
      </Link>
    ) : (
      <span key={`${t}-${copy}`} className={cls}>
        {inner}
      </span>
    );
  };
  return (
    <div className="group/row overflow-hidden motion-reduce:overflow-x-auto">
      <div
        className={cn(
          "flex w-max py-1 motion-safe:animate-marquee group-hover/row:[animation-play-state:paused]",
          reverse && "[animation-direction:reverse]",
        )}
        style={{ "--marquee-duration": "55s" } as CSSProperties}
      >
        {/* Spacing inside each copy, so half the track is exactly one copy. */}
        <div className="flex gap-2.5 pr-2.5">{tags.map((t) => chip(t, false))}</div>
        <div aria-hidden className="flex gap-2.5 pr-2.5 motion-reduce:hidden">
          {tags.map((t) => chip(t, true))}
        </div>
      </div>
    </div>
  );
}

export function EverythingYouNeed() {
  const half = Math.ceil(TAGS.length / 2);
  return (
    <section>
      <Spacer />
      <SectionHead
        icon={Layers}
        eyebrow="One platform, end to end"
        title={
          <>
            Everything you need <Accent>to get cited</Accent>
          </>
        }
        subtitle="Answer-space research, AI-written articles, citation tracking, and auto-publishing — so you get found by buyers searching on Google, ChatGPT, Perplexity, and beyond."
      />

      {FEATURES.map((f) => (
        <FeatureRow key={f.title} f={f} />
      ))}

      <Band inner="py-10 sm:py-12">
        <p className="mb-6 px-5 text-center text-sm font-medium text-muted-foreground">
          Plus everything else you need to scale your content
        </p>
        <div className="space-y-2.5 [mask-image:linear-gradient(to_right,transparent,#000_8%,#000_92%,transparent)]">
          <TagRow tags={TAGS.slice(0, half)} />
          <TagRow tags={[...TAGS.slice(half), "+ much more"]} reverse />
        </div>
      </Band>
    </section>
  );
}
