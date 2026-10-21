/**
 * The /use-cases/ecommerce hero scene: a shopper asks ChatGPT which beans
 * suit cold brew, and the store's own buying guide, open on a phone, is the
 * paragraph that answers it. The owner's card below holds the post hidden
 * until they switch it on.
 *
 * Rebuilt from PhoneScene in personas/hero-scenes.tsx in the landing's
 * language: a white phone with hairline edges, white cards with soft
 * shadows, soft blue for whatever is selected, one thin blue thread.
 *
 * The store is "your store", never a real shop: the old scene's roaster is a
 * real company. No platform logo sits on the owner's card, so the picture
 * says no more about the store add-ons than the copy around it does.
 *
 * Motion: one 13-second timeline that runs only while half the scene is on
 * screen and starts over when it leaves. The first render is its first frame,
 * so server and client agree. With reduced motion it holds the frame that
 * tells the whole story: the question asked, the thread drawn, the answer lit,
 * and the post still hidden.
 */
import { useEffect, useLayoutEffect, useRef, useState, type RefObject } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { Coffee, Loader2, Menu, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";
import { ChatGPTMark } from "@/components/landing/ai-logos";

const QUESTION = "Which beans are best for cold brew?";
const PERIOD = 13000;
const TYPE_START = 500;
const TYPE_MS = 45;
const TYPED_AT = TYPE_START + QUESTION.length * TYPE_MS;
/** The reduced-motion frame: typed, linked, answered, still hidden. */
const REST = TYPED_AT + 2000;
const TICK = 45;

const EASE = "ease-[cubic-bezier(0.16,1,0.3,1)]";

/** Milliseconds into the loop while the scene is half on screen; 0 otherwise. */
function useSceneClock(ref: RefObject<HTMLElement | null>) {
  const inView = useInView(ref, { amount: 0.5 });
  const reduce = useReducedMotion();
  const [ms, setMs] = useState(0);

  useEffect(() => {
    if (reduce) {
      setMs(REST);
      return;
    }
    if (!inView) {
      setMs(0);
      return;
    }
    const t0 = performance.now();
    const id = window.setInterval(() => setMs((performance.now() - t0) % PERIOD), TICK);
    return () => window.clearInterval(id);
  }, [inView, reduce]);

  return ms;
}

/* A placeholder line of body copy inside the phone. */
function TextBar({ w }: { w: string }) {
  return <span className="block h-[0.28rem] rounded-full bg-ink/[0.08]" style={{ width: w }} />;
}

function Switch({ on }: { on: boolean }) {
  return (
    <span
      className={cn(
        "relative inline-flex h-[1.05rem] w-[1.9rem] shrink-0 items-center rounded-full transition-colors duration-300",
        on ? "bg-cta" : "bg-ink/[0.14]",
      )}
    >
      <span
        className={cn(
          "absolute left-[0.15rem] h-[0.75rem] w-[0.75rem] rounded-full bg-white shadow-[0_1px_2px_rgba(16,24,40,0.2)] transition-transform duration-300",
          EASE,
          on ? "translate-x-[0.85rem]" : "translate-x-0",
        )}
      />
    </span>
  );
}

const CARD =
  "rounded-xl border border-ink/[0.07] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.05),0_18px_40px_-20px_rgba(16,24,40,0.32)]";

/**
 * The thread from the question to the paragraph that answers it, measured
 * from the two elements rather than guessed, so it lands on the box at every
 * width. Drawn only from sm up: on a phone the card sits over the screen.
 */
function useThread(
  stage: RefObject<HTMLElement | null>,
  from: RefObject<HTMLElement | null>,
  to: RefObject<HTMLElement | null>,
  active: boolean,
) {
  const [line, setLine] = useState<{ d: string; x: number; y: number } | null>(null);
  useLayoutEffect(() => {
    if (!active) return;
    const measure = () => {
      const s = stage.current?.getBoundingClientRect();
      const a = from.current?.getBoundingClientRect();
      const b = to.current?.getBoundingClientRect();
      if (!s || !a || !b) return;
      const ax = a.left + a.width * 0.62 - s.left;
      const ay = a.bottom - s.top + 2;
      const bx = b.left - s.left - 3;
      const by = b.top + Math.min(26, b.height / 2) - s.top;
      if (bx - ax < 24 || by - ay < 24) return setLine(null);
      const r = 12;
      setLine({
        d: `M ${ax} ${ay} L ${ax} ${by - r} Q ${ax} ${by} ${ax + r} ${by} L ${bx} ${by}`,
        x: bx,
        y: by,
      });
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (stage.current) ro.observe(stage.current);
    return () => ro.disconnect();
  }, [active, stage, from, to]);
  return line;
}

export function StorefrontScene() {
  const stage = useRef<HTMLDivElement>(null);
  const bubble = useRef<HTMLParagraphElement>(null);
  const answer = useRef<HTMLDivElement>(null);
  const ms = useSceneClock(stage);

  const chars = Math.max(0, Math.min(QUESTION.length, Math.floor((ms - TYPE_START) / TYPE_MS)));
  const typing = chars < QUESTION.length;
  const searching = ms > TYPED_AT + 150;
  const reading = ms > TYPED_AT + 1100;
  const linked = ms > TYPED_AT + 500 && ms < 5900;
  const answered = ms > TYPED_AT + 1300 && ms < 11400;
  const scroll = ms > 11400 ? 0 : ms > 8300 ? 2 : ms > 5900 ? 1 : 0;
  const productLit = ms > 6500 && ms < 11400;
  const visible = ms > 9200 && ms < 12400;
  /* On a phone the owner's card would cover the answer box, so there it
     waits until the article has scrolled past it. */
  const ownerOnPhone = ms > 5900 && ms < 12400;

  const thread = useThread(stage, bubble, answer, linked);

  return (
    <div
      ref={stage}
      role="img"
      aria-label="Sample: a shopper asks ChatGPT which coffee beans are best for cold brew. A buying guide on your store's own blog answers it, and the post stays hidden until you switch it on."
      className="relative h-full w-full"
    >
      {/* The storefront, on the phone the shopper is holding. */}
      <div className="absolute right-3 top-1/2 h-[28.5rem] w-[12.75rem] -translate-y-1/2 rounded-[2.4rem] bg-white p-[0.35rem] shadow-[0_2px_6px_rgba(4,24,72,0.06),0_40px_80px_-32px_rgba(4,24,72,0.42)] ring-1 ring-ink/[0.08] sm:right-[6%] sm:h-[33.5rem] sm:w-[15.5rem] lg:h-[32rem] lg:w-[14.75rem] xl:h-[33.5rem] xl:w-[15.5rem]">
        <div className="relative flex h-full flex-col overflow-hidden rounded-[2.05rem] bg-white ring-1 ring-ink/[0.06]">
          <div className="relative flex items-center justify-between px-5 pb-1 pt-2.5 text-[0.56rem] font-semibold text-ink">
            <span>9:41</span>
            <span className="absolute left-1/2 top-2 h-[0.95rem] w-[3.6rem] -translate-x-1/2 rounded-full bg-ink/90" />
            <span className="flex items-center gap-[2px]">
              <span className="h-[0.32rem] w-[0.12rem] rounded-sm bg-ink/70" />
              <span className="h-[0.42rem] w-[0.12rem] rounded-sm bg-ink/70" />
              <span className="ml-1 h-[0.42rem] w-[0.85rem] rounded-[2px] border border-ink/60 p-px">
                <span className="block h-full w-3/4 rounded-[1px] bg-ink/70" />
              </span>
            </span>
          </div>

          <div className="flex items-center justify-between border-b border-ink/[0.06] px-4 py-2">
            <Menu className="h-3.5 w-3.5 text-ink" />
            <span className="text-[0.62rem] font-semibold uppercase tracking-[0.26em] text-ink">
              Your store
            </span>
            <span className="relative">
              <ShoppingBag className="h-3.5 w-3.5 text-ink" />
              <span className="absolute -right-1 -top-1 flex h-[0.6rem] w-[0.6rem] items-center justify-center rounded-full bg-cta text-[0.4rem] font-bold text-white">
                1
              </span>
            </span>
          </div>
          <div className="flex gap-1 border-b border-ink/[0.06] px-3 py-1.5 text-[0.52rem] font-medium">
            {["Shop", "Journal", "About"].map((tab) => (
              <span
                key={tab}
                className={cn(
                  "rounded-md px-1.5 py-0.5",
                  tab === "Journal" ? "bg-cta-soft text-cta" : "text-muted-foreground",
                )}
              >
                {tab}
              </span>
            ))}
          </div>

          <div className="relative flex-1 overflow-hidden">
            <div
              className={cn("px-4 pb-6 pt-3.5 transition-transform duration-[1400ms]", EASE)}
              style={{ transform: `translateY(${-[0, 8.75, 14.25][scroll]}rem)` }}
            >
              <p className="text-[0.5rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                Journal · Brewing guides
              </p>
              <p className="mt-1.5 font-display text-[1rem] font-semibold leading-[1.15] tracking-[-0.01em] text-ink">
                The best beans for cold brew, ranked
              </p>
              <p className="mt-1 text-[0.52rem] text-muted-foreground">6 min read</p>

              <div className="relative mt-3 flex h-[5.5rem] items-center justify-center overflow-hidden rounded-xl bg-[linear-gradient(140deg,#eadbc6,#c39a73_58%,#93694a)]">
                {[
                  "left-[12%] top-[22%] rotate-[25deg]",
                  "left-[70%] top-[16%] -rotate-12",
                  "left-[22%] top-[64%] -rotate-[30deg]",
                  "left-[80%] top-[60%] rotate-45",
                  "left-[50%] top-[76%] rotate-12",
                ].map((pos) => (
                  <span
                    key={pos}
                    className={cn("absolute h-3 w-2 rounded-[50%] bg-[#4a2c1a]/45", pos)}
                  />
                ))}
                <Coffee className="relative h-7 w-7 text-white/90" strokeWidth={1.6} />
              </div>

              <div
                ref={answer}
                className={cn(
                  "mt-3 rounded-lg border p-2.5 transition-[background-color,border-color,box-shadow] duration-700",
                  answered
                    ? "border-cta/40 bg-cta-soft shadow-[0_0_0_3px_color-mix(in_oklab,var(--cta)_8%,transparent)]"
                    : "border-ink/[0.07] bg-[color-mix(in_oklab,var(--surface)_70%,white)]",
                )}
              >
                <p
                  className={cn(
                    "text-[0.5rem] font-semibold uppercase tracking-[0.12em] transition-colors duration-700",
                    answered ? "text-cta" : "text-muted-foreground",
                  )}
                >
                  Quick answer
                </p>
                <p className="mt-1 text-[0.62rem] leading-snug text-ink">
                  Go medium-dark and grind coarse. Chocolatey, low-acid roasts hold up best to a
                  long, cold steep.
                </p>
              </div>

              <p className="mt-3.5 text-[0.7rem] font-semibold text-ink">1. Medium-dark blends</p>
              <div className="mt-2 space-y-1.5">
                <TextBar w="100%" />
                <TextBar w="92%" />
                <TextBar w="64%" />
              </div>

              <div
                className={cn(
                  "mt-3 flex items-center gap-2.5 rounded-lg border bg-white p-2 transition-[border-color,box-shadow] duration-700",
                  productLit
                    ? "border-cta/40 shadow-[0_10px_24px_-12px_rgba(22,111,229,0.45)]"
                    : "border-ink/[0.07]",
                )}
              >
                <span className="h-9 w-9 shrink-0 rounded-md bg-[linear-gradient(160deg,#d8b893,#8a5f40)]" />
                <span className="min-w-0">
                  <span className="block text-[0.64rem] font-semibold text-ink">
                    Cold Brew Blend
                  </span>
                  <span className="block text-[0.52rem] text-muted-foreground">
                    Medium-dark · whole bean
                  </span>
                  <span className="mt-0.5 block text-[0.56rem] font-semibold text-cta">
                    Shop the roast →
                  </span>
                </span>
              </div>

              <p className="mt-3.5 text-[0.7rem] font-semibold text-ink">2. Single-origin Brazil</p>
              <div className="mt-2 space-y-1.5">
                <TextBar w="100%" />
                <TextBar w="88%" />
                <TextBar w="95%" />
                <TextBar w="52%" />
              </div>
              <p className="mt-3.5 text-[0.7rem] font-semibold text-ink">
                3. A decaf that holds up
              </p>
              <div className="mt-2 space-y-1.5">
                <TextBar w="97%" />
                <TextBar w="80%" />
                <TextBar w="90%" />
              </div>
            </div>
          </div>
          <span className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-white to-transparent" />
          <span className="absolute bottom-1.5 left-1/2 h-1 w-20 -translate-x-1/2 rounded-full bg-ink/20" />
        </div>
      </div>

      {/* The thread: question to the paragraph that answers it. */}
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-0 z-20 hidden h-full w-full overflow-visible sm:block"
      >
        {thread && (
          <>
            <motion.path
              d={thread.d}
              fill="none"
              stroke="var(--cta)"
              strokeWidth={1.5}
              strokeLinecap="round"
              initial={false}
              animate={{ pathLength: linked ? 1 : 0, opacity: linked ? 0.85 : 0 }}
              transition={{
                pathLength: { duration: linked ? 0.9 : 0.3, ease: [0.16, 1, 0.3, 1] },
                opacity: { duration: 0.3 },
              }}
            />
            <motion.circle
              r={4}
              fill="var(--cta)"
              stroke="white"
              strokeWidth={2}
              cx={thread.x}
              cy={thread.y}
              initial={false}
              animate={{ scale: linked ? 1 : 0 }}
              transition={{ delay: linked ? 0.75 : 0, duration: 0.25 }}
            />
          </>
        )}
      </svg>

      {/* Where the shopper starts: asking an AI, not browsing the shop. */}
      <div className="absolute left-3 top-[12%] z-10 w-[10.5rem] sm:left-[5%] sm:top-[14%] sm:w-[15rem] lg:w-[13.5rem] xl:w-[15rem]">
        <div className={cn(CARD, "p-3")}>
          <div className="flex items-center gap-1.5">
            <span className="flex h-5 w-5 items-center justify-center rounded-md border border-ink/[0.08] bg-white">
              <ChatGPTMark className="h-3 w-3" />
            </span>
            <span className="text-[0.68rem] font-semibold text-ink">ChatGPT</span>
            <span className="ml-auto rounded-md border border-ink/[0.08] px-1.5 py-px text-[0.52rem] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
              Sample
            </span>
          </div>
          <div className="mt-2.5 flex justify-end">
            <p
              ref={bubble}
              className="min-h-[2.15rem] max-w-[95%] rounded-lg rounded-br-sm border border-ink/[0.07] bg-[color-mix(in_oklab,var(--surface)_80%,white)] px-2.5 py-1.5 text-[0.7rem] leading-snug text-ink"
            >
              {QUESTION.slice(0, chars)}
              {typing && (
                <span className="ml-px inline-block h-3 w-px translate-y-0.5 bg-ink motion-safe:animate-pulse" />
              )}
            </p>
          </div>
          <p
            className={cn(
              "mt-2 flex items-center gap-1.5 text-[0.6rem] text-muted-foreground transition-opacity duration-500",
              searching ? "opacity-100" : "opacity-0",
            )}
          >
            <Loader2 className="h-3 w-3 text-cta motion-safe:animate-spin" />
            {reading ? "Reading buying guides…" : "Searching the web…"}
          </p>
        </div>
      </div>

      {/* The owner's side: blog only, and nothing visible until they say so. */}
      <div
        className={cn(
          "absolute bottom-[7%] left-3 z-10 w-[11.5rem] transition-[opacity,translate] duration-500 sm:bottom-[11%] sm:left-[9%] sm:w-[15rem] lg:w-[13.75rem] xl:w-[15rem]",
          !ownerOnPhone && "max-sm:translate-y-2 max-sm:opacity-0",
        )}
      >
        <div className={cn(CARD, "p-3")}>
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-cta-soft text-cta">
              <ShoppingBag className="h-3.5 w-3.5" />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-[0.68rem] font-semibold text-ink">
                yourstore.com
              </span>
              <span className="block truncate text-[0.58rem] text-muted-foreground">
                Journal · blog post, in your theme
              </span>
            </span>
          </div>
          <div
            className={cn(
              "mt-2.5 flex items-center justify-between gap-2 rounded-lg border px-2.5 py-2 transition-colors duration-300",
              visible
                ? "border-cta/30 bg-cta-soft"
                : "border-ink/[0.07] bg-[color-mix(in_oklab,var(--surface)_70%,white)]",
            )}
          >
            <span className="text-[0.62rem] font-medium text-ink">
              {visible ? "Visible on your store" : "Published hidden"}
            </span>
            <Switch on={visible} />
          </div>
        </div>
      </div>
    </div>
  );
}
