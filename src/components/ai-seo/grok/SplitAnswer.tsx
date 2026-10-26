/**
 * The Grok guide's focal visual: one answer built from two live sources at
 * once. The prompt forks into an X lane and a web lane, each fills the way
 * grok.com's own status lines describe ("Searching 𝕏", "Reading thread",
 * "Searching the web"), and the two merge into an answer whose chips say
 * which half each claim came from — an @handle for a post, a site name for a
 * page.
 *
 * It plays only while about half of it is on screen and starts over when it
 * leaves. With reduced motion it sits on the finished answer. The server
 * renders the opening frame — the prompt, both lanes "searching" with
 * placeholder rows — so hydration matches and the frame reads as a state of
 * the product rather than an empty box.
 */
import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { Check, Globe } from "lucide-react";
import { GrokMark } from "@/components/landing/ai-logos";
import type { AnswerPreview } from "@/data/ai-seo/types";
import { parseInline } from "@/lib/inline-md";
import { cn } from "@/lib/utils";

type Source = AnswerPreview["sources"][number];

export function XGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

const isPost = (s: Source) => s.domain === "x.com" && s.title.startsWith("@");

/** "@brand: the post text" → ["@brand", "the post text"]. */
function splitPost(s: Source): [string, string] {
  const i = s.title.indexOf(":");
  return i === -1 ? [s.title, ""] : [s.title.slice(0, i), s.title.slice(i + 1).trim()];
}

/* grok.com labels a web chip with the site's name from its domain:
   "reddit.com" shows as "Reddit". */
function siteName(domain: string) {
  const parts = domain.replace(/^www\./, "").split(".");
  const name = parts.length > 1 ? parts[parts.length - 2] : parts[0];
  return name.charAt(0).toUpperCase() + name.slice(1);
}

const EASE = [0.21, 0.47, 0.32, 0.98] as const;

/* Phases: 0 lanes searching · 1–2 results land · 3 lanes done · then one
   sentence per phase, each followed by its chips. */
function delayFor(phase: number) {
  return phase <= 3 ? phase * 560 : 1800 + (phase - 3) * 700;
}

export function SplitAnswer({
  preview,
  className,
}: {
  preview: AnswerPreview;
  className?: string;
}) {
  const posts = preview.sources.filter(isPost);
  const pages = preview.sources.filter((s) => !isPost(s));
  const sentences = preview.answer.split(/(?<=[.!?])\s+/).filter(Boolean);
  const last = 4 + sentences.length;

  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.5 });
  const reduce = useReducedMotion();
  const [phase, setPhase] = useState(0);
  const [hot, setHot] = useState<string | null>(null);

  useEffect(() => {
    if (reduce) {
      setPhase(last);
      return;
    }
    if (!inView) {
      setPhase(0);
      return;
    }
    const timers = Array.from({ length: last }, (_, i) =>
      window.setTimeout(() => setPhase(i + 1), delayFor(i + 1)),
    );
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [inView, reduce, last]);

  const done = phase >= 3;
  const answering = phase >= 4;
  const xStatus = done
    ? "Searched"
    : phase >= 2 && posts[1]?.title.toLowerCase().includes("thread")
      ? "Reading thread"
      : "Searching";

  /* Which chips follow which sentence: the first carries the lead page (with
     the rest of the web grouped as +N, the way grok.com folds them) and the
     lead post; later posts follow the sentences after it. */
  const chipsFor = (i: number): { source: Source; extra?: number }[] => {
    if (i === 0)
      return [
        ...(pages[0] ? [{ source: pages[0], extra: pages.length - 1 }] : []),
        ...(posts[0] ? [{ source: posts[0] }] : []),
      ];
    return posts[i] ? [{ source: posts[i] }] : [];
  };

  return (
    <div ref={ref} className={cn("relative", className)}>
      <figure
        aria-label="Illustration: a Grok answer that cites an X post and a web page"
        className="overflow-hidden rounded-2xl border border-ink/[0.08] bg-white text-left shadow-[0_1px_2px_rgba(16,24,40,0.05),0_24px_48px_-28px_rgba(16,24,40,0.28)]"
      >
        {/* chrome */}
        <div className="flex items-center justify-between border-b border-ink/[0.07] px-4 py-2.5">
          <span className="flex items-center gap-2 text-[0.75rem] font-medium text-ink">
            <GrokMark className="h-3.5 w-3.5" />
            Grok
          </span>
          <span className="rounded-md border border-ink/[0.08] px-1.5 py-0.5 text-[0.62rem] font-medium uppercase tracking-[0.12em] text-muted-foreground">
            Illustrative
          </span>
        </div>

        <div className="space-y-4 p-4 sm:p-5">
          <div className="flex justify-end">
            <p className="max-w-[88%] rounded-[1.25rem] rounded-br-md bg-ink/[0.05] px-4 py-2.5 text-[0.85rem] leading-relaxed text-ink">
              {preview.prompt}
            </p>
          </div>

          {/* the fork: one prompt, two searches */}
          <Fork drawn={phase >= 1} />

          <div className="-mt-1 grid gap-3 sm:grid-cols-2">
            <Lane
              icon={<XGlyph className="h-3 w-3" />}
              status={
                <>
                  {xStatus}
                  {xStatus !== "Reading thread" && <XGlyph className="ml-1 inline h-2.5 w-2.5" />}
                </>
              }
              done={done}
              label="X posts"
            >
              {posts.map((s, i) => {
                const [handle, text] = splitPost(s);
                return (
                  <LaneItem
                    key={s.title}
                    shown={phase >= i + 1}
                    hot={hot === s.title}
                    onHot={(on) => setHot(on ? s.title : null)}
                  >
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ink text-[0.6rem] font-semibold uppercase text-white">
                      {handle.charAt(1)}
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[0.72rem] font-semibold text-ink">{handle}</span>
                      <span className="line-clamp-2 block text-[0.72rem] leading-snug text-ink/65">
                        {text}
                      </span>
                    </span>
                  </LaneItem>
                );
              })}
            </Lane>

            <Lane
              icon={<Globe className="h-3 w-3" />}
              status={done ? "Searched the web" : "Searching the web"}
              done={done}
              label="Web pages"
            >
              {pages.map((s, i) => (
                <LaneItem
                  key={s.title}
                  shown={phase >= i + 1}
                  hot={hot === s.title}
                  onHot={(on) => setHot(on ? s.title : null)}
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-cta-soft text-[0.6rem] font-semibold uppercase text-cta">
                    {s.domain.charAt(0)}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-[0.72rem] font-semibold text-ink">
                      {s.domain}
                    </span>
                    <span className="line-clamp-2 block text-[0.72rem] leading-snug text-ink/65">
                      {s.title}
                    </span>
                  </span>
                </LaneItem>
              ))}
            </Lane>
          </div>

          {/* the merge: both halves into one answer */}
          <Merge drawn={answering} />

          <div className="-mt-1">
            <motion.p
              initial={false}
              animate={{ opacity: answering ? 1 : 0 }}
              transition={{ duration: 0.3 }}
              className="mb-1.5 text-[0.7rem] font-medium text-muted-foreground"
            >
              {preview.status}
            </motion.p>
            <div className="relative">
              {/* Placeholder lines until both lanes are done. */}
              <motion.span
                aria-hidden
                initial={false}
                animate={{ opacity: answering ? 0 : 1 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-x-0 top-1.5 space-y-3"
              >
                <span className="block h-2 w-full rounded-full bg-ink/[0.05]" />
                <span className="block h-2 w-11/12 rounded-full bg-ink/[0.05]" />
                <span className="block h-2 w-3/5 rounded-full bg-ink/[0.05]" />
              </motion.span>
              <p className="relative text-[0.88rem] leading-[1.7] text-ink/85">
                {sentences.map((sentence, i) => (
                  <motion.span
                    key={sentence}
                    initial={false}
                    animate={{ opacity: phase >= 4 + i ? 1 : 0 }}
                    transition={{ duration: 0.45, ease: EASE }}
                  >
                    <Sentence text={sentence} />{" "}
                    {chipsFor(i).map(({ source, extra }) => (
                      <Chip
                        key={source.title}
                        source={source}
                        extra={extra}
                        shown={phase >= 5 + i}
                        hot={hot === source.title}
                        onHot={(on) => setHot(on ? source.title : null)}
                      />
                    ))}
                  </motion.span>
                ))}
              </p>
            </div>
          </div>
        </div>
      </figure>

      <div
        aria-hidden
        className="mt-3 flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5 text-[0.7rem] text-muted-foreground"
      >
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-flex items-center gap-1 rounded-md bg-ink/[0.06] px-1.5 py-0.5 font-medium text-ink/80">
            <XGlyph className="h-2.5 w-2.5" />
            @handle
          </span>
          an X post
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="rounded-md bg-cta-soft px-1.5 py-0.5 font-medium text-cta">
            Site name
          </span>
          a web page
        </span>
      </div>
    </div>
  );
}

/* ---------- pieces ---------- */

function Sentence({ text }: { text: string }) {
  return (
    <>
      {parseInline(text).map((s, i) =>
        s.bold ? (
          <span
            key={i}
            className="font-semibold text-ink underline decoration-cta decoration-2 underline-offset-[3px]"
          >
            {s.text}
          </span>
        ) : (
          <span key={i}>{s.text}</span>
        ),
      )}
    </>
  );
}

function Lane({
  icon,
  status,
  done,
  label,
  children,
}: {
  icon: ReactNode;
  status: ReactNode;
  done: boolean;
  label: string;
  children: ReactNode;
}) {
  return (
    <section
      aria-label={label}
      className="rounded-xl border border-ink/[0.08] bg-[color-mix(in_oklab,var(--surface)_55%,white)] p-2.5"
    >
      <p className="flex items-center gap-1.5 px-1 pb-2 text-[0.68rem] font-medium text-ink/70">
        <span className="flex h-4 w-4 items-center justify-center rounded bg-white text-ink shadow-[0_0_0_1px_rgba(16,24,40,0.08)]">
          {icon}
        </span>
        <span className="flex items-center">{status}</span>
        <span className="ml-auto flex h-3.5 w-3.5 items-center justify-center">
          {done ? (
            <Check className="h-3 w-3 text-cta" strokeWidth={3} />
          ) : (
            <span className="h-1.5 w-1.5 rounded-full bg-cta motion-safe:animate-pulse" />
          )}
        </span>
      </p>
      <ul className="space-y-1.5">{children}</ul>
    </section>
  );
}

function LaneItem({
  shown,
  hot,
  onHot,
  children,
}: {
  shown: boolean;
  hot: boolean;
  onHot: (on: boolean) => void;
  children: ReactNode;
}) {
  return (
    <li
      onMouseEnter={() => onHot(true)}
      onMouseLeave={() => onHot(false)}
      className={cn(
        "relative rounded-lg border bg-white p-2 transition-[border-color,box-shadow] duration-200",
        hot
          ? "border-cta/40 shadow-[0_0_0_3px_color-mix(in_oklab,var(--cta)_14%,transparent)]"
          : "border-ink/[0.07]",
      )}
    >
      {/* A placeholder row while the lane is still searching. */}
      <motion.span
        aria-hidden
        initial={false}
        animate={{ opacity: shown ? 0 : 1 }}
        transition={{ duration: 0.25 }}
        className="absolute inset-2 flex items-start gap-2"
      >
        <span className="h-6 w-6 shrink-0 rounded-full bg-ink/[0.06]" />
        <span className="flex-1 space-y-1.5 pt-1">
          <span className="block h-1.5 w-2/5 rounded-full bg-ink/[0.08]" />
          <span className="block h-1.5 w-4/5 rounded-full bg-ink/[0.05]" />
        </span>
      </motion.span>
      <motion.span
        initial={false}
        animate={{ opacity: shown ? 1 : 0, y: shown ? 0 : 4 }}
        transition={{ duration: 0.4, ease: EASE }}
        className="relative flex items-start gap-2"
      >
        {children}
      </motion.span>
    </li>
  );
}

function Chip({
  source,
  extra,
  shown,
  hot,
  onHot,
}: {
  source: Source;
  extra?: number;
  shown: boolean;
  hot: boolean;
  onHot: (on: boolean) => void;
}) {
  const post = isPost(source);
  return (
    <motion.span
      initial={false}
      animate={{ opacity: shown ? 1 : 0, scale: shown ? 1 : 0.85 }}
      transition={{ duration: 0.3, ease: EASE }}
      onMouseEnter={() => onHot(true)}
      onMouseLeave={() => onHot(false)}
      className={cn(
        "mr-1 inline-flex translate-y-[-1px] cursor-default items-center gap-1 whitespace-nowrap rounded-md px-1.5 py-0.5 align-middle text-[0.66rem] font-medium transition-shadow duration-200",
        post ? "bg-ink/[0.06] text-ink/80" : "bg-cta-soft text-cta",
        hot && "shadow-[0_0_0_2px_color-mix(in_oklab,var(--cta)_35%,transparent)]",
      )}
    >
      {post ? (
        <>
          <XGlyph className="h-2.5 w-2.5" />
          {splitPost(source)[0]}
        </>
      ) : (
        <>
          {siteName(source.domain)}
          {extra ? <span className="opacity-70">+{extra}</span> : null}
        </>
      )}
    </motion.span>
  );
}

/* Hairline brackets from the prompt down into each lane, and from the lanes
   into the answer — drawn as hairline boxes rather than SVG so they stay one
   crisp pixel at any width. Desktop only; on a phone the lanes stack. Lane
   centres sit at 25% and 75%, nudged by half the 12px gap between lanes. */
const STEM = "absolute w-px bg-cta/45";

function Bracket({ drawn, flip = false }: { drawn: boolean; flip?: boolean }) {
  return (
    <motion.div
      aria-hidden
      initial={false}
      animate={{ opacity: drawn ? 1 : 0 }}
      transition={{ duration: 0.4, ease: EASE }}
      className={cn("relative -my-1 hidden h-6 sm:block", flip && "rotate-180")}
    >
      <span className={cn(STEM, "left-1/2 top-0 h-3")} />
      <span className="absolute left-[calc(25%-3px)] right-[calc(25%-3px)] top-3 h-px bg-cta/45" />
      <span className={cn(STEM, "left-[calc(25%-3px)] top-3 h-3")} />
      <span className={cn(STEM, "right-[calc(25%-3px)] top-3 h-3")} />
    </motion.div>
  );
}

function Fork({ drawn }: { drawn: boolean }) {
  return <Bracket drawn={drawn} />;
}

function Merge({ drawn }: { drawn: boolean }) {
  return <Bracket drawn={drawn} flip />;
}
