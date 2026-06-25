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

const SOURCES = [
  { letter: "F", domain: "flowdesk.io" },
  { letter: "L", domain: "loopcraft.ai" },
  { letter: "Y", domain: "yardstick.team" },
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
      <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z" />
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
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: EASE }}
      className="relative w-full"
    >
      {/* screen */}
      <div className="relative overflow-hidden rounded-[2rem] border border-ink/[0.06] bg-card ring-1 ring-ink/[0.03]">
        {/* header */}
        <div className="flex items-center gap-2.5 border-b border-border/70 px-5 py-4">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-ink text-background">
            <AssistantGlyph className="h-3.5 w-3.5" />
          </span>
          <span className="text-sm font-semibold text-ink">ChatGPT</span>
          <span className="ml-auto inline-flex items-center gap-1.5 text-[0.65rem] font-medium uppercase tracking-[0.1em] text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: "var(--volt)" }} />
            Live
          </span>
        </div>

        {/* conversation thread */}
        <div className="flex min-h-[400px] flex-col gap-4 px-4 py-5">
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
                  {/* status line */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4, ease: EASE }}
                    className="flex items-center gap-2 text-[0.72rem] font-medium text-muted-foreground"
                  >
                    <span
                      className="h-1.5 w-1.5 shrink-0 rounded-full"
                      style={{ background: "var(--volt)" }}
                    />
                    Searched 24 sources ·{" "}
                    {phase === "card" ? "answer ready" : "writing answer"}
                  </motion.div>

                  <p className="text-[0.9rem] leading-relaxed text-ink">
                    <AnswerStream text={answerText} highlighted={productHighlighted} />
                    {phase === "answer" && answerChars < fullAnswer.length && (
                      <span
                        className="ml-0.5 inline-block h-[1em] w-[2px] translate-y-[0.15em] animate-pulse rounded-full align-middle"
                        style={{ background: "var(--volt)" }}
                      />
                    )}
                  </p>

                  {/* shimmer loading bar (while streaming) */}
                  {phase === "answer" && answerChars < fullAnswer.length && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1, backgroundPosition: ["0% 0%", "200% 0%"] }}
                      exit={{ opacity: 0 }}
                      transition={{
                        opacity: { duration: 0.3 },
                        backgroundPosition: { duration: 1.3, repeat: Infinity, ease: "linear" },
                      }}
                      className="h-1.5 w-2/3 rounded-full"
                      style={{
                        backgroundImage:
                          "linear-gradient(90deg, color-mix(in oklab, var(--ink) 8%, transparent) 0%, color-mix(in oklab, var(--ink) 16%, transparent) 50%, color-mix(in oklab, var(--ink) 8%, transparent) 100%)",
                        backgroundSize: "200% 100%",
                      }}
                    />
                  )}

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

                  {/* sources row */}
                  <AnimatePresence>
                    {phase === "card" && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4, ease: EASE }}
                        className="flex flex-wrap items-center gap-2 pt-0.5"
                      >
                        <span className="text-[0.72rem] font-medium text-muted-foreground">
                          Sources
                        </span>
                        {SOURCES.map((s, i) => (
                          <motion.span
                            key={s.domain}
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.35, ease: EASE, delay: 0.1 + i * 0.1 }}
                            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface py-1 pl-1 pr-2.5 text-[0.72rem] text-ink"
                          >
                            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-card text-[0.58rem] font-semibold text-muted-foreground">
                              {s.letter}
                            </span>
                            {s.domain}
                          </motion.span>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* composer */}
        <div className="border-t border-border/70 px-5 py-4">
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
      </div>
    </motion.div>
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
        animate={highlighted ? { opacity: 1 } : { opacity: 1 }}
        transition={{ duration: 0.5, ease: EASE }}
        className="font-bold text-ink underline decoration-2 underline-offset-[3px]"
        style={{
          textDecorationColor: "var(--volt)",
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