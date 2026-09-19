/**
 * Everything around an article's text: reading progress, the table of
 * contents, sharing, the side-rail offer, the author card and the closing CTA.
 */
import { useEffect, useMemo, useState, type MouseEvent, type RefObject } from "react";
import { ArrowRight, Check, ChevronDown, Link2 } from "lucide-react";
import { PixelField, UrlForm } from "@/components/landing/Hero";
import { AI_MARKS } from "@/components/landing/ai-logos";
import { Reveal } from "@/components/landing/shared";
import { AuthorMark } from "@/components/blog/PostCards";
import type { TocEntry } from "@/lib/article-outline";
import { TRIAL_DAYS } from "@/data/pricing";
import { cn } from "@/lib/utils";

/* Clearance for the sticky navbar (h-16) plus breathing room, used both for
   scroll-spy and for jumping to a heading. Matches scroll-mt-28 on headings. */
const HEADING_OFFSET = 112;

/* ---------- reading progress ---------- */

export function ReadingProgress({ target }: { target: RefObject<HTMLElement | null> }) {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    let frame = 0;
    const measure = () => {
      frame = 0;
      const el = target.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight + HEADING_OFFSET;
      const read = HEADING_OFFSET - rect.top;
      setProgress(total > 0 ? Math.min(1, Math.max(0, read / total)) : 0);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [target]);
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-[var(--top-chrome)] z-40 h-[3px]"
    >
      <div
        className="h-full origin-left bg-brand-blue transition-transform duration-150 ease-out"
        style={{ transform: `scaleX(${progress})` }}
      />
    </div>
  );
}

/* ---------- table of contents ---------- */

function useActiveHeading(ids: string[]): string | null {
  const [active, setActive] = useState<string | null>(ids[0] ?? null);
  useEffect(() => {
    let frame = 0;
    const measure = () => {
      frame = 0;
      let current = ids[0] ?? null;
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= HEADING_OFFSET + 8) current = id;
      }
      setActive(current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, [ids]);
  return active;
}

function jumpTo(e: MouseEvent<HTMLAnchorElement>, id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  e.preventDefault();
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.scrollTo({
    top: el.getBoundingClientRect().top + window.scrollY - HEADING_OFFSET + 4,
    behavior: reduce ? "auto" : "smooth",
  });
  history.replaceState(null, "", `#${id}`);
}

export function TableOfContents({
  entries,
  variant,
  className,
}: {
  entries: TocEntry[];
  variant: "rail" | "inline";
  className?: string;
}) {
  const key = entries.map((e) => e.id).join("|");
  const ids = useMemo(() => (key ? key.split("|") : []), [key]);
  const active = useActiveHeading(ids);
  if (entries.length < 2) return null;

  const list = (
    <ol className="border-l border-border">
      {entries.map((entry) => {
        const on = variant === "rail" && active === entry.id;
        return (
          <li key={entry.id}>
            <a
              href={`#${entry.id}`}
              onClick={(e) => jumpTo(e, entry.id)}
              aria-current={on ? "location" : undefined}
              className={cn(
                "-ml-px block border-l-2 py-[0.3rem] pl-4 text-[0.82rem] leading-snug transition-colors",
                on
                  ? "border-volt font-semibold text-ink"
                  : "border-transparent text-muted-foreground hover:border-ink/20 hover:text-ink",
              )}
            >
              {entry.text}
            </a>
          </li>
        );
      })}
    </ol>
  );

  if (variant === "inline") {
    return (
      <details className={cn("group rounded-2xl border border-border bg-card shadow-1", className)}>
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-4 text-sm font-semibold text-ink [&::-webkit-details-marker]:hidden">
          <span>
            On this page
            <span className="ml-2 font-medium text-muted-foreground">
              {entries.length} sections
            </span>
          </span>
          <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform group-open:rotate-180" />
        </summary>
        <div className="px-5 pb-5">{list}</div>
      </details>
    );
  }

  return (
    <nav aria-label="On this page" className={className}>
      <p className="mb-3 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        On this page
      </p>
      {list}
    </nav>
  );
}

/* ---------- sharing ---------- */

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.125 2.062 2.062 0 0 1 0 4.125zM7.119 20.452H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

const SHARE_BUTTON =
  "inline-flex h-9 items-center justify-center gap-1.5 rounded-full border border-border bg-card px-3 text-xs font-semibold text-ink shadow-1 transition-all hover:-translate-y-0.5 hover:border-ink/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-volt";

export function ShareButtons({
  url,
  title,
  className,
}: {
  url: string;
  title: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable */
    }
  };
  const enc = encodeURIComponent;
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <a
        href={`https://twitter.com/intent/tweet?text=${enc(title)}&url=${enc(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on X"
        className={cn(SHARE_BUTTON, "w-9 px-0")}
      >
        <XIcon className="h-3.5 w-3.5" />
      </a>
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on LinkedIn"
        className={cn(SHARE_BUTTON, "w-9 px-0")}
      >
        <LinkedInIcon className="h-3.5 w-3.5" />
      </a>
      <button type="button" onClick={copy} className={SHARE_BUTTON}>
        {copied ? (
          <Check className="h-3.5 w-3.5 text-success" />
        ) : (
          <Link2 className="h-3.5 w-3.5" />
        )}
        <span aria-live="polite">{copied ? "Copied" : "Copy link"}</span>
      </button>
    </div>
  );
}

/* ---------- side-rail offer ---------- */

export function RailCta() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-2">
      <div className="pointer-events-none absolute inset-0 volt-glow" aria-hidden />
      <div className="relative">
        <div className="flex -space-x-1.5">
          {AI_MARKS.slice(0, 4).map(({ name, Mark }) => (
            <span
              key={name}
              className="flex h-7 w-7 items-center justify-center rounded-full border border-border bg-card shadow-1"
            >
              <Mark className="h-3.5 w-3.5" />
            </span>
          ))}
        </div>
        <p className="mt-4 font-display text-[1.05rem] font-bold leading-snug tracking-tight text-ink">
          Get cited by AI, on autopilot
        </p>
        <p className="mt-1.5 text-[0.8rem] leading-relaxed text-muted-foreground">
          Rankbox finds your buyers' questions, publishes answer-first articles daily, and tracks
          every citation.
        </p>
        <a
          href="/auth"
          className="group mt-5 flex items-center justify-center gap-2 rounded-xl bg-ink px-4 py-2.5 text-sm font-semibold text-background transition-transform hover:-translate-y-0.5"
        >
          Start free trial
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </a>
        <p className="mt-2.5 text-center text-[0.7rem] text-muted-foreground">
          {TRIAL_DAYS}-day free trial · Cancel anytime
        </p>
      </div>
    </div>
  );
}

/* ---------- author ---------- */

const TEAM_BIO =
  "The team behind Rankbox. We study how ChatGPT, Perplexity, Gemini, and Google AI Overviews choose their sources, and publish what we learn so you can put it to work.";

export function AuthorCard({ author }: { author: string }) {
  // Posts written before the rename still carry the old brand as their author.
  const team = /^(rankbox|rankvolt)( team)?$/i.test(author.trim());
  return (
    <div className="flex gap-4 rounded-2xl border border-border bg-card p-5 shadow-1 sm:p-6">
      <AuthorMark className="h-12 w-12" />
      <div className="min-w-0">
        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          Written by
        </p>
        <p className="mt-1 font-semibold text-ink">{author}</p>
        {team && <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{TEAM_BIO}</p>}
      </div>
    </div>
  );
}

/* ---------- closing CTA ---------- */

export function BlogCta({ title = "See where AI cites you today" }: { title?: string }) {
  const [url, setUrl] = useState("");
  return (
    <section aria-labelledby="blog-cta-title" className="px-5 pb-24 pt-16 sm:pb-28 sm:pt-20">
      <Reveal className="mx-auto max-w-6xl">
        <div className="relative overflow-hidden rounded-3xl bg-brand-blue px-6 py-14 text-center sm:px-12 sm:py-16">
          <PixelField seed={5} />
          <div className="relative mx-auto flex max-w-2xl flex-col items-center">
            <div className="flex -space-x-2">
              {AI_MARKS.map(({ name, Mark }) => (
                <span
                  key={name}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-sm ring-2 ring-brand-blue"
                >
                  <Mark className="h-4.5 w-4.5" />
                </span>
              ))}
            </div>
            <h2
              id="blog-cta-title"
              className="mt-6 text-balance font-display text-3xl font-bold tracking-tight text-white sm:text-[2.6rem] sm:leading-[1.08]"
            >
              {title}
            </h2>
            <p className="mt-4 max-w-xl text-balance text-base leading-relaxed text-white/80">
              Enter your site to see how often ChatGPT, Perplexity, Gemini, and Google cite your
              brand, and exactly what to publish next.
            </p>
            <div className="mt-8 flex w-full flex-col items-center gap-3">
              <UrlForm url={url} onChange={setUrl} />
              <p className="text-sm text-white/70">
                No credit card required · Free {TRIAL_DAYS}-day trial
              </p>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
