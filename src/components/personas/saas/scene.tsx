/**
 * The /use-cases/saas hero scene: the sample topic map's questions arriving,
 * one by one, as items in a Webflow CMS collection on yoursite.com, with the
 * newest one beside it as the REST API returns it, for a custom build. Midway
 * a release ships and its use-case topic joins the queue, the page's "every
 * release, feed the map" step.
 *
 * Rebuilt from the old CmsScene (hero-scenes.tsx) in the landing's language:
 * white cards on a soft blue panel, hairlines, the arriving row held in soft
 * blue. The titles are the persona's own sample questions, so the hero and the
 * topic map further down show the same sample.
 *
 * It runs only while half of it is on screen, starts over when it leaves, and
 * with reduced motion holds its fullest frame. The first render is always the
 * opening frame, so server and client agree.
 */
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { Check, GitCommitHorizontal } from "lucide-react";
import { IntegrationGlyph } from "@/components/integrations/visuals";
import type { TopicCluster } from "@/data/personas";
import { cn } from "@/lib/utils";
import { IntentChip, SampleTag } from "./parts";
import { SAMPLE_DOMAIN, SCREEN, slugify } from "./tokens";

type Status = "Published" | "Scheduled" | "Draft";

interface Item {
  title: string;
  stage: number;
  intent: string;
  status: Status;
  score: number;
  /** Came in with the release, so it carries the version tag. */
  release?: boolean;
}

/* Which question of which stage each row is: six already in the collection
   (exactly the list's height), three arriving, then one that comes with the
   release. Each arrival pushes the oldest row out of view below. */
const BASE: [number, number, Status, number][] = [
  [0, 0, "Published", 95],
  [1, 0, "Published", 94],
  [2, 0, "Published", 96],
  [3, 0, "Published", 93],
  [0, 1, "Published", 94],
  [1, 2, "Published", 92],
];
const ARRIVALS: [number, number, Status, number][] = [
  [1, 1, "Published", 95],
  [3, 1, "Scheduled", 93],
  [0, 2, "Draft", 94],
];
const RELEASED: [number, number, Status, number] = [2, 1, "Draft", 96];
const RELEASE = "v2.4";

/* The loop, one entry per step: how long it holds, how many rows have
   arrived beyond the first three, whether the newest is still arriving, and
   whether the release has shipped. */
const STEPS = [
  { ms: 1500, arrived: 0, arriving: false, shipped: false },
  { ms: 1700, arrived: 1, arriving: true, shipped: false },
  { ms: 1100, arrived: 1, arriving: false, shipped: false },
  { ms: 1700, arrived: 2, arriving: true, shipped: false },
  { ms: 1100, arrived: 2, arriving: false, shipped: false },
  { ms: 1700, arrived: 3, arriving: true, shipped: false },
  { ms: 1100, arrived: 3, arriving: false, shipped: false },
  { ms: 1500, arrived: 3, arriving: false, shipped: true },
  { ms: 1700, arrived: 4, arriving: true, shipped: true },
  { ms: 3600, arrived: 4, arriving: false, shipped: true },
  { ms: 900, arrived: 0, arriving: false, shipped: false },
] as const;
/* The fullest frame, held under reduced motion. */
const REST = 9;
const EASE = [0.16, 1, 0.3, 1] as const;

function itemsFrom(clusters: TopicCluster[]) {
  const make = ([c, q, status, score]: [number, number, Status, number], release = false) => {
    const cluster = clusters[c % clusters.length];
    return {
      title: cluster.questions[q % cluster.questions.length],
      stage: c,
      intent: cluster.intent,
      status,
      score,
      release,
    } satisfies Item;
  };
  return {
    base: BASE.map((b) => make(b)),
    arrivals: [...ARRIVALS.map((a) => make(a)), make(RELEASED, true)],
  };
}

function StatusChip({ status }: { status: Status }) {
  if (status === "Published") {
    return (
      <span className="inline-flex items-center gap-1 rounded-md bg-success/12 px-1.5 py-0.5 text-[0.62rem] font-semibold text-success">
        <Check className="h-3 w-3" strokeWidth={2.6} />
        Published
      </span>
    );
  }
  if (status === "Scheduled") {
    return (
      <span className="inline-flex items-center rounded-md bg-cta-soft px-1.5 py-0.5 text-[0.62rem] font-semibold text-cta">
        Scheduled
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-md border border-ink/[0.08] bg-white px-1.5 py-0.5 text-[0.62rem] font-medium text-muted-foreground">
      Draft
    </span>
  );
}

function Arriving() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md bg-white px-1.5 py-0.5 text-[0.62rem] font-semibold text-cta ring-1 ring-cta/20">
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cta/60 motion-reduce:animate-none" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-cta" />
      </span>
      Arriving
    </span>
  );
}

const COLS = "grid-cols-[1fr_auto] sm:grid-cols-[1fr_5.75rem_5.5rem]";

export function ShippingScene({ clusters }: { clusters: TopicCluster[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.5 });
  const reduce = useReducedMotion();
  const [step, setStep] = useState(0);

  // Reduced motion: the fullest frame, still. Off screen: back to the top.
  useEffect(() => {
    if (reduce) setStep(REST);
    else if (!inView) setStep(0);
  }, [reduce, inView]);

  useEffect(() => {
    if (reduce || !inView) return;
    const id = window.setTimeout(() => setStep((s) => (s + 1) % STEPS.length), STEPS[step].ms);
    return () => window.clearTimeout(id);
  }, [step, inView, reduce]);

  const run = inView && !reduce;
  const frame = STEPS[step];
  const { base, arrivals } = itemsFrom(clusters);
  const rows = [...base, ...arrivals.slice(0, frame.arrived)].reverse();
  const newest = rows[0];

  return (
    <div
      ref={ref}
      role="img"
      aria-label={`Sample: questions from the topic map arriving as items in the Webflow CMS collection of ${SAMPLE_DOMAIN}, with the newest one as the Rankbox REST API returns it for a custom-built site.`}
      className="relative mx-auto flex w-full max-w-[34rem] flex-col"
    >
      {/* The release that adds a topic to the map, halfway through. */}
      <div className="mb-3 flex h-8 items-center justify-end sm:mb-4">
        <AnimatePresence initial={false}>
          {frame.shipped && (
            <motion.span
              key="release"
              initial={run ? { opacity: 0, y: 8, scale: 0.96 } : false}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, transition: { duration: 0.3 } }}
              transition={{ duration: 0.55, ease: EASE }}
              className="inline-flex items-center gap-2 rounded-lg border border-ink/[0.08] bg-white py-1 pl-1 pr-2.5 text-[0.72rem] font-medium text-ink shadow-[0_1px_2px_rgba(16,24,40,0.05),0_8px_20px_-12px_rgba(16,24,40,0.25)]"
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-md bg-cta text-white">
                <GitCommitHorizontal className="h-3 w-3" />
              </span>
              <span className="font-mono text-[0.68rem] font-semibold text-cta">{RELEASE}</span>
              shipped · use-case topic added
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* The CMS collection. */}
      <div className={cn(SCREEN, "relative overflow-hidden")}>
        <div className="flex items-center justify-between gap-3 border-b border-ink/[0.07] px-3.5 py-3 sm:px-4">
          <div className="flex min-w-0 items-center gap-2.5">
            <IntegrationGlyph
              integration={{ platform: "webflow", kind: "app", name: "Webflow" }}
              className="h-6 w-6"
            />
            <div className="min-w-0 leading-tight">
              <p className="truncate text-[0.8rem] font-semibold text-ink">Blog posts</p>
              <p className="truncate text-[0.64rem] text-muted-foreground">
                {SAMPLE_DOMAIN} · CMS collection
              </p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <span className="hidden text-[0.66rem] tabular-nums text-muted-foreground min-[400px]:inline">
              {rows.length} items
            </span>
            <SampleTag />
          </div>
        </div>

        <div
          className={cn(
            "grid gap-3 border-b border-ink/[0.06] bg-[color-mix(in_oklab,var(--surface)_55%,white)] px-3.5 py-1.5 text-[0.6rem] font-medium text-muted-foreground sm:px-4",
            COLS,
          )}
        >
          <span>Name</span>
          <span className="hidden sm:block">Intent</span>
          <span className="text-right sm:text-left">Status</span>
        </div>

        {/* Fixed at six rows, so arrivals never move the page. */}
        <ul className="relative h-[13.5rem] overflow-hidden">
          <AnimatePresence initial={false} mode="popLayout">
            {rows.map((r, i) => {
              const arriving = i === 0 && frame.arriving;
              return (
                <motion.li
                  key={r.title}
                  layout={run ? "position" : false}
                  initial={run ? { opacity: 0, y: -12 } : false}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, transition: { duration: 0.35 } }}
                  transition={{ duration: 0.6, ease: EASE }}
                  className={cn(
                    "relative grid h-9 items-center gap-3 border-b border-ink/[0.05] px-3.5 transition-colors duration-700 sm:px-4",
                    COLS,
                    arriving ? "bg-cta-soft" : "bg-white",
                  )}
                >
                  {arriving && (
                    <span aria-hidden className="absolute inset-y-0 left-0 w-[2px] bg-cta" />
                  )}
                  <span className="flex min-w-0 items-center gap-1.5">
                    <span className="truncate text-[0.74rem] font-medium text-ink">{r.title}</span>
                    {r.release && (
                      <span className="shrink-0 rounded border border-cta/25 bg-white px-1 font-mono text-[0.56rem] font-semibold text-cta">
                        {RELEASE}
                      </span>
                    )}
                  </span>
                  <span className="hidden sm:block">
                    <IntentChip index={r.stage}>{r.intent}</IntentChip>
                  </span>
                  <span className="flex justify-end sm:justify-start">
                    {arriving ? <Arriving /> : <StatusChip status={r.status} />}
                  </span>
                  {arriving && run && (
                    <motion.span
                      aria-hidden
                      className="absolute inset-x-0 bottom-0 h-[2px] origin-left bg-cta/60"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: frame.ms / 1000, ease: "linear" }}
                    />
                  )}
                </motion.li>
              );
            })}
          </AnimatePresence>
        </ul>
      </div>

      {/* The same article, for a site built in-house. */}
      <div
        className={cn(
          SCREEN,
          "relative z-10 -mt-12 ml-auto mr-2 w-[14.5rem] overflow-hidden sm:-mr-4 sm:w-[18rem]",
        )}
      >
        <div className="flex items-center gap-2 border-b border-ink/[0.07] px-3 py-2 font-mono text-[0.6rem] sm:text-[0.64rem]">
          <span className="rounded bg-cta-soft px-1.5 py-0.5 font-semibold text-cta">GET</span>
          <span className="truncate text-ink/70">/v1/articles?since=…</span>
          <span className="ml-auto font-semibold text-success">200</span>
        </div>
        <motion.div
          key={newest.title}
          initial={run ? { opacity: 0.2 } : false}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, ease: EASE }}
          className="space-y-px px-3 py-2.5 font-mono text-[0.6rem] leading-relaxed text-ink/55 sm:text-[0.64rem]"
        >
          <p>{"{"}</p>
          <p className="truncate pl-3">
            &quot;title&quot;: <span className="text-[#1563d6]">&quot;{newest.title}&quot;</span>,
          </p>
          <p className="truncate pl-3">
            &quot;slug&quot;:{" "}
            <span className="text-[#1563d6]">&quot;{slugify(newest.title)}&quot;</span>,
          </p>
          <p className="truncate pl-3">
            &quot;tags&quot;: [
            <span className="text-[#1563d6]">&quot;{newest.intent.toLowerCase()}&quot;</span>],
          </p>
          <p className="pl-3">
            &quot;seo_score&quot;: <span className="text-[#b45309]">{newest.score}</span>
          </p>
          <p>{"}"}</p>
        </motion.div>
      </div>
    </div>
  );
}
