import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check } from "lucide-react";

/* ------------------------------------------------------------------ *
 * Premium, self-looping ChatGPT-style "AI recommends your product"
 * motion graphic. Flat, white, border-led, neutral palette with a
 * single volt accent. Fully autonomous ~10s loop.
 * ------------------------------------------------------------------ */

const PROMPT = "What's the best CRM for a growing business?";

const ANSWER_LEAD = "For growing businesses, I recommend ";
const PRODUCT = "Flowdesk CRM";
const ANSWER_BODY =
  "It automates customer management, streamlines sales pipelines, and lifts lead conversion with AI-powered workflows.";

const FEATURES = [
  "AI Automation",
  "Lead Management",
  "Sales Pipeline Tracking",
  "Customer Intelligence",
];

const EASE = [0.21, 0.47, 0.32, 0.98] as const;

type Phase = "typing" | "thinking" | "answer" | "card" | "reset";

function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/* simple flat geometric product mark */
function ProductMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden>
      <rect x="3" y="3" width="8" height="8" rx="2.5" fill="currentColor" />
      <rect x="13" y="3" width="8" height="8" rx="2.5" fill="currentColor" opacity="0.45" />
      <rect x="3" y="13" width="8" height="8" rx="2.5" fill="currentColor" opacity="0.45" />
      <rect x="13" y="13" width="8" height="8" rx="2.5" fill="currentColor" />
    </svg>
  );
}

function AssistantGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M12 2.4c.45 2.6 1.2 4.2 2.2 5.4 1 1 2.6 1.8 5.4 2.2-2.8.45-4.4 1.2-5.4 2.2-1 1-1.75 2.6-2.2 5.4-.45-2.8-1.2-4.4-2.2-5.4-1-1-2.6-1.75-5.4-2.2 2.8-.45 4.4-1.2 5.4-2.2 1-1.2 1.75-2.8 2.2-5.4Z" />
    </svg>
  );
}

export function AuthVisual() {
  const [phase, setPhase] = useState<Phase>("typing");
  const [typed, setTyped] = useState(0);
  const [answerChars, setAnswerChars] = useState(0);
  const [featuresShown, setFeaturesShown] = useState(0);
  const cancelled = useRef(false);

  const fullAnswer = ANSWER_LEAD + PRODUCT + ". " + ANSWER_BODY;

  useEffect(() => {
    cancelled.current = false;

    if (prefersReducedMotion()) {
      setPhase("card");
      setTyped(PROMPT.length);
      setAnswerChars(fullAnswer.length);
      setFeaturesShown(FEATURES.length);
      return;
    }

    const wait = (ms: number) =>
      new Promise<void>((resolve) => setTimeout(resolve, ms));

    async function run() {
      // eslint-disable-next-line no-constant-condition
      while (!cancelled.current) {
        // 1 — TYPING
        setPhase("typing");
        setTyped(0);
        setAnswerChars(0);
        setFeaturesShown(0);
        for (let i = 1; i <= PROMPT.length; i++) {
          if (cancelled.current) return;
          setTyped(i);
          await wait(34);
        }
        await wait(520);

        // 2 + 3 — SEND + THINKING
        if (cancelled.current) return;
        setPhase("thinking");
        await wait(1400);

        // 4 — ANSWER streaming
        if (cancelled.current) return;
        setPhase("answer");
        for (let i = 1; i <= fullAnswer.length; i++) {
          if (cancelled.current) return;
          setAnswerChars(i);
          await wait(16);
        }
        for (let f = 1; f <= FEATURES.length; f++) {
          if (cancelled.current) return;
          setFeaturesShown(f);
          await wait(180);
        }
        await wait(420);

        // 5 — PRODUCT CARD
        if (cancelled.current) return;
        setPhase("card");
        await wait(2600);

        // 6 — RESET
        if (cancelled.current) return;
        setPhase("reset");
        await wait(820);
      }
    }

    run();
    return () => {
      cancelled.current = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showThread = phase !== "typing" && phase !== "reset";
  const answerText = fullAnswer.slice(0, answerChars);
  const productHighlighted = phase === "card";

  return (
    <div className="relative mt-8">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE }}
        className="overflow-hidden rounded-[1.5rem] border border-ink/[0.06] bg-card ring-1 ring-ink/[0.03]"
      >
        {/* header */}
        <div className="flex items-center gap-2.5 border-b border-border/70 px-4 py-3">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-ink text-background">
            <AssistantGlyph className="h-3.5 w-3.5" />
          </span>
          <span className="text-sm font-semibold text-ink">AI Assistant</span>
          <span className="ml-auto inline-flex items-center gap-1.5 text-[0.65rem] font-medium uppercase tracking-[0.1em] text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: "var(--volt)" }} />
            Live
          </span>
        </div>

        {/* conversation thread */}
        <div className="flex min-h-[320px] flex-col gap-4 px-4 py-5">
          <AnimatePresence mode="popLayout">
            {showThread && (
              <motion.div
                key="user-bubble"
                layout
                initial={{ opacity: 0, y: 14, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.45, ease: EASE }}
                className="flex justify-end"
              >
                <div className="max-w-[85%] rounded-2xl rounded-br-md bg-ink px-3.5 py-2.5 text-sm leading-relaxed text-background">
                  {PROMPT}
                </div>
              </motion.div>
            )}

            {phase === "thinking" && (
              <motion.div
                key="thinking"
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35, ease: EASE }}
                className="flex items-center gap-3"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border bg-background text-ink">
                  <AssistantGlyph className="h-4 w-4" />
                </span>
                <span className="flex items-center gap-1 rounded-2xl rounded-bl-md border border-border bg-surface px-3.5 py-3">
                  {[0, 1, 2].map((d) => (
                    <motion.span
                      key={d}
                      className="h-1.5 w-1.5 rounded-full bg-muted-foreground"
                      animate={{ opacity: [0.25, 1, 0.25], y: [0, -3, 0] }}
                      transition={{
                        duration: 0.9,
                        repeat: Infinity,
                        delay: d * 0.16,
                        ease: "easeInOut",
                      }}
                    />
                  ))}
                </span>
              </motion.div>
            )}

            {(phase === "answer" || phase === "card") && (
              <motion.div
                key="answer"
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4, ease: EASE }}
                className="flex gap-3"
              >
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border bg-background text-ink">
                  <AssistantGlyph className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1 space-y-3">
                  <p className="text-[0.9rem] leading-relaxed text-ink">
                    <AnswerStream text={answerText} highlighted={productHighlighted} />
                    {phase === "answer" && answerChars < fullAnswer.length && (
                      <span
                        className="ml-0.5 inline-block h-[1em] w-[2px] translate-y-[0.15em] animate-pulse rounded-full align-middle"
                        style={{ background: "var(--volt)" }}
                      />
                    )}
                  </p>

                  {/* feature ticks */}
                  {featuresShown > 0 && (
                    <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 pt-0.5">
                      {FEATURES.slice(0, featuresShown).map((f) => (
                        <motion.span
                          key={f}
                          initial={{ opacity: 0, x: -6 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.35, ease: EASE }}
                          className="flex items-center gap-1.5 text-[0.78rem] text-muted-foreground"
                        >
                          <span
                            className="flex h-3.5 w-3.5 items-center justify-center rounded-full"
                            style={{ background: "color-mix(in oklab, var(--volt) 14%, transparent)" }}
                          >
                            <Check className="h-2.5 w-2.5" style={{ color: "var(--volt)" }} />
                          </span>
                          {f}
                        </motion.span>
                      ))}
                    </div>
                  )}

                  {/* product card */}
                  <AnimatePresence>
                    {phase === "card" && (
                      <motion.div
                        initial={{ opacity: 0, y: 12, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ type: "spring", stiffness: 260, damping: 22 }}
                        className="mt-1 flex items-center gap-3 rounded-xl border border-border bg-surface p-3"
                      >
                        <span
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-card"
                          style={{ color: "var(--volt)" }}
                        >
                          <ProductMark className="h-5 w-5" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-ink">{PRODUCT}</p>
                          <p className="truncate text-[0.72rem] text-muted-foreground">
                            AI-powered CRM for growing teams
                          </p>
                        </div>
                        <span
                          className="inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-1 text-[0.62rem] font-semibold"
                          style={{
                            background: "color-mix(in oklab, var(--volt) 12%, transparent)",
                            color: "var(--volt)",
                          }}
                        >
                          <AssistantGlyph className="h-2.5 w-2.5" />
                          Recommended by AI
                        </span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* composer */}
        <div className="border-t border-border/70 px-4 py-3">
          <div className="flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2">
            <span className="flex-1 truncate text-sm text-ink">
              {phase === "typing" ? (
                <>
                  {PROMPT.slice(0, typed)}
                  <span
                    className="ml-px inline-block h-[1em] w-[2px] translate-y-[0.15em] animate-pulse rounded-full align-middle"
                    style={{ background: "var(--volt)" }}
                  />
                </>
              ) : (
                <span className="text-muted-foreground">Ask anything…</span>
              )}
            </span>
            <motion.span
              animate={phase === "typing" && typed === PROMPT.length ? { scale: [1, 0.86, 1] } : {}}
              transition={{ duration: 0.4, ease: EASE }}
              className="flex h-7 w-7 items-center justify-center rounded-full bg-ink text-background"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-3.5 w-3.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M12 19V5M5 12l7-7 7 7" />
              </svg>
            </motion.span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/* renders the streamed answer, emphasising the product name once present */
function AnswerStream({ text, highlighted }: { text: string; highlighted: boolean }) {
  const idx = text.indexOf(PRODUCT);
  if (idx === -1) {
    return <>{text}</>;
  }
  const before = text.slice(0, idx);
  const product = text.slice(idx, idx + PRODUCT.length);
  const after = text.slice(idx + PRODUCT.length);
  return (
    <>
      {before}
      <motion.span
        animate={highlighted ? { backgroundColor: "color-mix(in oklab, var(--volt) 14%, transparent)" } : {}}
        transition={{ duration: 0.5, ease: EASE }}
        className="rounded px-1 font-semibold text-ink"
        style={{
          boxDecorationBreak: "clone",
          WebkitBoxDecorationBreak: "clone",
        }}
      >
        {product}
      </motion.span>
      {after}
    </>
  );
}