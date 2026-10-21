/**
 * The hero of /features/reddit-presence: the landing's centred lockup, set
 * between two faint comment trees instead of the landing's dithered mark, with
 * one reply in each tree in brand blue: yours, joining the conversation. The
 * H1 leads with Reddit's own mark (the feature's `heroMark`).
 *
 * Under the form, the feature's status and who it's for, read from the
 * changelog so the line changes when the feature does.
 */
import { useState, type CSSProperties } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { UrlForm } from "@/components/landing/Hero";
import { LINE, Pill } from "@/components/landing/frame";
import { TRIAL_NOTE } from "@/components/features/FeatureSections";
import { CHANGELOG, STATUSES } from "@/data/changelog";
import type { Feature } from "@/data/features";
import { CommentTree } from "./trees";

/* Staggers the CSS entrance (see animate-hero-rise in styles.css). */
const rise = (delay: number) => ({ "--rise-delay": `${delay}s` }) as CSSProperties;

/* ---------- Hero ---------- */

export function RedditHero({ feature }: { feature: Feature }) {
  const [url, setUrl] = useState("");
  const Icon = feature.icon;
  const HeadMark = feature.heroMark ?? feature.icon;
  const entry = CHANGELOG.find((e) => e.slug === feature.slug);
  const status = entry && entry.status !== "live" ? STATUSES[entry.status].label : null;

  return (
    <section id="top" aria-labelledby="feature-title" className="relative bg-white">
      <div className={cn("relative mx-auto max-w-6xl overflow-hidden border-x", LINE)}>
        {/* Two conversations in the margins, fading toward the copy. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 hidden w-[15rem] items-center motion-safe:animate-hero-rise lg:flex xl:w-[17rem]"
          style={rise(0.5)}
        >
          <CommentTree
            tree="a"
            className="ml-6 w-full [mask-image:linear-gradient(to_right,#000_35%,transparent_95%)]"
          />
        </div>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 hidden w-[15rem] items-center motion-safe:animate-hero-rise lg:flex xl:w-[17rem]"
          style={rise(0.6)}
        >
          <CommentTree
            tree="b"
            className="ml-auto mr-2 w-full -scale-x-100 [mask-image:linear-gradient(to_right,#000_35%,transparent_95%)]"
          />
        </div>

        <div className="relative flex flex-col items-center px-5 pb-14 pt-7 text-center sm:px-8 sm:pb-16 sm:pt-9 lg:pb-[4.5rem]">
          <nav aria-label="Breadcrumb" className="motion-safe:animate-hero-rise" style={rise(0)}>
            <ol className="flex items-center gap-1.5 text-[0.78rem] text-muted-foreground">
              <li>
                <Link to="/" className="py-2 transition-colors hover:text-ink">
                  Home
                </Link>
              </li>
              <li aria-hidden>
                <ChevronRight className="h-3 w-3" />
              </li>
              <li>
                <Link to="/features" className="py-2 transition-colors hover:text-ink">
                  Features
                </Link>
              </li>
              <li aria-hidden>
                <ChevronRight className="h-3 w-3" />
              </li>
              <li aria-current="page" className="font-medium text-ink">
                {feature.name}
              </li>
            </ol>
          </nav>

          <div className="mt-10 motion-safe:animate-hero-rise sm:mt-12" style={rise(0.05)}>
            <Pill icon={Icon}>{feature.eyebrow}</Pill>
          </div>

          <h1
            id="feature-title"
            className="mt-6 font-display text-[2.3rem] font-medium leading-[1.08] tracking-[-0.035em] text-ink motion-safe:animate-hero-rise min-[400px]:text-[2.6rem] sm:text-[3.5rem] lg:text-[4.15rem]"
            style={rise(0.12)}
          >
            <span className="block">{feature.headline.lead}</span>{" "}
            <span className="mt-[0.04em] inline-flex items-center gap-[0.22em] whitespace-nowrap">
              <span
                aria-hidden
                className="inline-flex h-[0.84em] w-[0.84em] shrink-0 items-center justify-center rounded-[0.2em] border border-ink/[0.08] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.06)]"
              >
                <HeadMark className="h-[56%] w-[56%]" />
              </span>
              <span className="font-bold text-brand-blue">{feature.headline.accent}</span>
            </span>
          </h1>

          <p
            className="mt-6 max-w-[40rem] text-balance text-[1.05rem] leading-relaxed text-muted-foreground motion-safe:animate-hero-rise sm:text-[1.15rem]"
            style={rise(0.22)}
          >
            {feature.subhead}
          </p>

          <div
            className="mt-9 w-full max-w-[37rem] motion-safe:animate-hero-rise"
            style={rise(0.32)}
          >
            <UrlForm url={url} onChange={setUrl} variant="split" />
            <p className="mt-3.5 text-[0.82rem] text-muted-foreground">{TRIAL_NOTE}</p>
          </div>

          {/* The trial doesn't include it, and it's still being switched on:
              said here, not left for the FAQ. */}
          <p
            className="mt-5 inline-flex flex-col items-center gap-x-2 gap-y-0.5 rounded-lg border border-ink/[0.07] bg-white/80 px-3 py-1.5 text-[0.78rem] text-muted-foreground motion-safe:animate-hero-rise sm:flex-row"
            style={rise(0.4)}
          >
            {status && (
              <span className="inline-flex items-center gap-1.5 font-medium text-ink">
                <span className="h-1.5 w-1.5 rounded-full bg-[#f59e0b]" />
                {status}
                <span aria-hidden className="hidden font-normal text-muted-foreground sm:inline">
                  ·
                </span>
              </span>
            )}
            <span>Paid plans only: it opens with your first paid invoice</span>
          </p>
        </div>
      </div>
    </section>
  );
}
