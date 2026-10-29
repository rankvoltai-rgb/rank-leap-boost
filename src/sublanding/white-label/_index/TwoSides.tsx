/**
 * The hero's picture: the same work from both sides of the line. Behind, your
 * Studio, one row per client site. In front, that client's live post on
 * their domain, under their byline, with the three things a curious client
 * would check: who it's by, where it lives, whether Rankbox is named.
 *
 * Picking a row swaps the post. While at least half of the picture is on
 * screen it moves to the next client every few seconds; it pauses while
 * hovered or focused, starts over when it leaves the screen, and holds the
 * first client under reduced motion. The server renders the first client, so
 * hydration agrees.
 */
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { Check, Layers, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { BYLINE } from "./content";
import { CARD, FOCUS, LIFT, TONE_BG, TONE_TEXT } from "./ui";

const STEP_MS = 3800;

/** "How long do whole coffee…" → "how-long-do-whole-coffee-beans-stay" */
export function slugOf(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 34)
    .replace(/-$/, "");
}

export function TwoSides({ className }: { className?: string }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [inView, setInView] = useState(false);
  const [held, setHeld] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
        if (!entry.isIntersecting) setActive(0);
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (reduce || !inView || held) return;
    const t = window.setTimeout(() => setActive((i) => (i + 1) % BYLINE.clients.length), STEP_MS);
    return () => window.clearTimeout(t);
  }, [active, inView, held, reduce]);

  const client = BYLINE.clients[active];
  const checks = [
    { k: BYLINE.checks.byline, v: client.name, wide: false },
    { k: BYLINE.checks.livesOn, v: client.domain, wide: true },
    { k: BYLINE.checks.mentions, v: BYLINE.checks.none, wide: false },
  ];

  return (
    <div
      ref={ref}
      className={cn("relative w-full", className)}
      onMouseEnter={() => setHeld(true)}
      onMouseLeave={() => setHeld(false)}
      onFocus={() => setHeld(true)}
      onBlur={() => setHeld(false)}
    >
      {/* Your side: Studio, one row per client site. */}
      <div className={cn(CARD, LIFT, "relative z-0 w-full max-w-[22.5rem] p-3")}>
        <div className="flex items-center justify-between px-1.5 pb-2.5 pt-0.5">
          <span className="inline-flex items-center gap-1.5 text-[0.78rem] font-semibold text-ink">
            <Layers aria-hidden className="h-3.5 w-3.5 text-brand-blue" />
            {BYLINE.studio}
          </span>
          <span className="text-[0.68rem] font-medium text-muted-foreground">
            {BYLINE.yourSide}
          </span>
        </div>
        <ul className="space-y-1" aria-label={BYLINE.listLabel}>
          {BYLINE.clients.map((c, i) => {
            const on = i === active;
            return (
              <li key={c.domain}>
                <button
                  type="button"
                  onClick={() => setActive(i)}
                  aria-pressed={on}
                  className={cn(
                    "flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-left transition-colors duration-150",
                    FOCUS,
                    on ? "bg-cta-soft" : "hover:bg-surface",
                  )}
                >
                  <span
                    aria-hidden
                    className={cn(
                      "flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-[0.78rem] font-bold text-white",
                      TONE_BG[c.tone],
                    )}
                  >
                    {c.initial}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span
                      className={cn(
                        "block truncate text-[0.8rem] font-medium",
                        on ? "text-cta" : "text-ink",
                      )}
                    >
                      {c.name}
                    </span>
                    <span className="block truncate text-[0.68rem] text-muted-foreground">
                      {c.domain}
                    </span>
                  </span>
                  <span className="shrink-0 rounded-md border border-border bg-card px-1.5 py-0.5 text-[0.62rem] font-semibold text-muted-foreground">
                    {BYLINE.live}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Their side: the post as the client's readers get it. It overlaps the
          Studio card only below its last row, so every row stays clickable. */}
      <div className="relative z-10 -mt-3 ml-auto w-[94%] max-w-[25.5rem]">
        <span className="absolute -top-2.5 right-4 z-10 rounded-md border border-border bg-card px-1.5 py-0.5 text-[0.62rem] font-medium text-muted-foreground">
          {BYLINE.theirSide}
        </span>
        <div className={cn(CARD, LIFT, "overflow-hidden")} aria-live="polite">
          <div className="flex items-center gap-2 border-b border-border bg-surface px-3 py-2">
            <span className="flex gap-1" aria-hidden>
              <span className="h-2 w-2 rounded-full bg-border" />
              <span className="h-2 w-2 rounded-full bg-border" />
              <span className="h-2 w-2 rounded-full bg-border" />
            </span>
            <span className="flex min-w-0 flex-1 items-center gap-1 rounded-md border border-border bg-card px-2 py-0.5 text-[0.66rem] text-muted-foreground">
              <Lock aria-hidden className="h-2.5 w-2.5 shrink-0" />
              <span className="truncate">
                {client.domain}/blog/{slugOf(client.post)}
              </span>
            </span>
          </div>

          <div key={client.domain} className="px-4 pb-4 pt-3.5 motion-safe:animate-hero-rise">
            <div className="flex items-center gap-2">
              <span
                aria-hidden
                className={cn(
                  "flex h-5 w-5 items-center justify-center rounded text-[0.62rem] font-bold text-white",
                  TONE_BG[client.tone],
                )}
              >
                {client.initial}
              </span>
              <span className={cn("text-[0.74rem] font-semibold", TONE_TEXT[client.tone])}>
                {client.name}
              </span>
              <span className="ml-auto text-[0.62rem] uppercase tracking-[0.1em] text-muted-foreground">
                {client.section}
              </span>
            </div>
            <p className="mt-2.5 text-balance font-display text-[1.02rem] font-medium leading-snug tracking-[-0.01em] text-ink">
              {client.post}
            </p>
            <p className="mt-1.5 text-[0.68rem] text-muted-foreground">
              {BYLINE.byPrefix} {client.name} {BYLINE.bySuffix} · {BYLINE.readTime}
            </p>
            <div className="mt-3 space-y-1.5" aria-hidden>
              <span className="block h-1.5 w-full rounded-full bg-border/60" />
              <span className="block h-1.5 w-[94%] rounded-full bg-border/60" />
              <span className="block h-1.5 w-[78%] rounded-full bg-border/60" />
            </div>
          </div>

          {/* On a phone the address bar already shows the domain, so its cell goes. */}
          <dl className="grid grid-cols-[1.3fr_1fr] border-t border-border text-[0.62rem] sm:grid-cols-[0.95fr_1.2fr_1.05fr]">
            {checks.map((row, i) => (
              <div
                key={row.k}
                className={cn(
                  "min-w-0 px-2.5 py-2.5",
                  i > 0 && "border-l border-border",
                  row.wide && "hidden sm:block",
                )}
              >
                <dt className="text-muted-foreground">{row.k}</dt>
                <dd className="mt-0.5 flex items-center gap-1 font-semibold text-ink">
                  <Check aria-hidden className="h-3 w-3 shrink-0 text-cta" />
                  <span className="truncate">{row.v}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <p className="mt-3 text-right text-[0.68rem] text-muted-foreground">{BYLINE.caption}</p>
    </div>
  );
}
