/**
 * The smaller product pictures on /features/brand-voice: one per benefit, one
 * per setup step, and the stack of articles rising out of the closing band.
 * All drawn from the sample in ./sample, all decorative (the copy beside each
 * one carries the meaning), and each one still with reduced motion.
 */
import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { Check, FileText, Mic, PenLine, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { Mark } from "@/components/brand/Mark";
import { useTypewriter } from "@/components/features/showcase/kit";
import { ARTICLES, SITE, VOICE } from "./sample";

const EASE = [0.16, 1, 0.3, 1] as const;

/** The white card inside a tinted panel, running past the panel's foot. */
export function Sheet({
  title,
  meta,
  children,
  className,
}: {
  title: ReactNode;
  meta?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border border-ink/[0.07] bg-white p-4 shadow-[0_1px_2px_rgba(16,24,40,0.05),0_24px_48px_-24px_rgba(16,24,40,0.25)] sm:p-5",
        className,
      )}
    >
      <div className="mb-3.5 flex items-center justify-between gap-3">
        <p className="flex min-w-0 items-center gap-2 text-[0.8rem] font-semibold text-ink">
          {title}
        </p>
        {meta}
      </div>
      {children}
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <p className="mb-1 text-[0.66rem] font-medium text-muted-foreground">{label}</p>
      {children}
    </div>
  );
}

const INPUT =
  "rounded-lg border border-ink/[0.08] bg-white px-2.5 py-1.5 text-[0.75rem] text-ink shadow-[0_1px_2px_rgba(16,24,40,0.03)]";

function Caret({ on = true }: { on?: boolean }) {
  return (
    <span
      aria-hidden
      className={cn(
        "ml-px inline-block h-[0.95em] w-px translate-y-[0.12em] bg-cta",
        on ? "motion-safe:animate-pulse" : "opacity-0",
      )}
    />
  );
}

/* ---------- Benefit: custom instructions ---------- */

const TONES = ["Plain-spoken", "Practical", "Warm", "Formal", "Playful"];
const TYPED_RULE = "Say “clients”, never “customers”.";

/** The voice being written down: tone, audience, and rules in plain words. */
export function InstructionsScreen({ tall = false }: { tall?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.4 });
  const { typed, typing } = useTypewriter(TYPED_RULE, { speed: 45, hold: 3200, run: inView });

  return (
    <div ref={ref}>
      <Sheet
        title={
          <>
            <Mic className="h-3.5 w-3.5 text-cta" />
            Brand voice
          </>
        }
        meta={<span className="text-[0.68rem] text-muted-foreground">{SITE}</span>}
      >
        <div className="space-y-3">
          <Field label="Tone">
            <div className="flex flex-wrap gap-1.5">
              {TONES.map((t) => {
                const on = (VOICE.tone as readonly string[]).includes(t);
                return (
                  <span
                    key={t}
                    className={cn(
                      "inline-flex items-center gap-1 rounded-md px-2 py-1 text-[0.7rem] font-medium",
                      on ? "bg-cta text-white" : "border border-ink/[0.08] bg-white text-ink/70",
                    )}
                  >
                    {on && <Check className="h-3 w-3" strokeWidth={3} />}
                    {t}
                  </span>
                );
              })}
            </div>
          </Field>
          <Field label="Audience">
            <p className={INPUT}>{VOICE.audience}</p>
          </Field>
          <Field label="Instructions">
            <div className={cn(INPUT, "space-y-1 py-2 leading-relaxed")}>
              {VOICE.always.map((a) => (
                <p key={a}>{a}.</p>
              ))}
              <p>Never write {VOICE.never.slice(0, 3).join(", ")}, or exclamation marks.</p>
              <p className="text-ink">
                {typed}
                <Caret on={typing || typed.length === 0} />
              </p>
            </div>
          </Field>
          <div className="flex items-center justify-between rounded-lg bg-[color-mix(in_oklab,var(--surface)_60%,white)] px-2.5 py-2">
            <span className="text-[0.72rem] font-medium text-ink">Apply to every article</span>
            <span className="flex h-4 w-7 items-center rounded-full bg-cta p-0.5">
              <span className="ml-auto h-3 w-3 rounded-full bg-white shadow-sm" />
            </span>
          </div>
        </div>
      </Sheet>
      {tall && <ReadsLike />}
    </div>
  );
}

/* What those instructions sound like in a draft, for the tall cell only: the
   "clients" rule above, already followed. */
function ReadsLike() {
  const article = ARTICLES[1];
  const [before, after] = article.lead.split("a client");
  return (
    <Sheet
      className="mt-4 hidden lg:block"
      title={
        <>
          <FileText className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          <span className="truncate">{article.title}</span>
        </>
      }
      meta={
        <span className="inline-flex shrink-0 items-center gap-1 rounded-md bg-cta-soft px-1.5 py-0.5 text-[0.62rem] font-semibold text-cta">
          <Mic className="h-3 w-3" />
          Your voice
        </span>
      }
    >
      <p className="text-[0.8rem] leading-relaxed text-ink/80">
        {before}
        <span className="rounded-[3px] bg-cta-soft px-0.5 font-medium text-ink">a client</span>
        {after}
      </p>
      <div className="mt-3.5 space-y-2">
        {[100, 92, 96, 74].map((w, j) => (
          <span
            key={j}
            className="block h-1.5 rounded-full bg-ink/[0.06]"
            style={{ width: `${w}%` }}
          />
        ))}
      </div>
    </Sheet>
  );
}

/* ---------- Benefit: product-aware writing ---------- */

const MENTIONS = [
  { title: "Late invoice fees: what’s fair to charge", on: true },
  { title: "Best desks for a home office", on: false },
] as const;

/** One article's product mention, highlighted, and two more decided on fit. */
export function ProductScreen() {
  return (
    <Sheet
      title={
        <>
          <FileText className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="truncate">{ARTICLES[0].title}</span>
        </>
      }
    >
      <p className="text-[0.78rem] leading-relaxed text-ink/80">
        &hellip;put the tax share aside the day the money lands,{" "}
        <span className="rounded-[3px] bg-cta-soft px-0.5 font-medium text-ink underline decoration-cta/60 decoration-2 underline-offset-[3px] [box-decoration-break:clone]">
          and our invoices can work that share out for you
        </span>
        . If you already use a spreadsheet, keep it; the habit matters more than the tool.
      </p>
      <p className="mt-2.5 inline-flex items-center gap-1.5 rounded-md bg-cta-soft px-2 py-1 text-[0.66rem] font-semibold text-cta">
        <Check className="h-3 w-3" strokeWidth={3} />
        Product mentioned where it helps
      </p>
      <div className="mt-3.5 space-y-1.5 border-t border-ink/[0.06] pt-3">
        {MENTIONS.map((m) => (
          <div
            key={m.title}
            className="flex items-center justify-between gap-3 rounded-lg border border-ink/[0.07] bg-white px-3 py-2"
          >
            <span className="truncate text-[0.72rem] font-medium text-ink">{m.title}</span>
            <span
              className={cn(
                "shrink-0 rounded-md px-1.5 py-0.5 text-[0.62rem] font-semibold",
                m.on ? "bg-cta-soft text-cta" : "bg-ink/[0.05] text-muted-foreground",
              )}
            >
              {m.on ? "Mentioned" : "Not a fit"}
            </span>
          </div>
        ))}
      </div>
    </Sheet>
  );
}

/* ---------- Benefit: consistent at scale ---------- */

const VOLUMES = [5, 50] as const;

/** Five a month or fifty: every tile is an article, every tile the same blue. */
export function ScaleScreen() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.5 });
  const reduce = useReducedMotion();
  const [at, setAt] = useState(1);

  useEffect(() => {
    if (reduce) {
      setAt(1);
      return;
    }
    if (!inView) {
      setAt(0);
      return;
    }
    const id = window.setInterval(() => setAt((n) => (n + 1) % VOLUMES.length), 2800);
    return () => window.clearInterval(id);
  }, [inView, reduce]);

  const count = VOLUMES[at];

  return (
    <div ref={ref}>
      <Sheet
        title="Articles this month"
        meta={
          <span className="flex rounded-md bg-ink/[0.045] p-0.5 text-[0.66rem] font-medium">
            {VOLUMES.map((v, i) => (
              <span
                key={v}
                className={cn(
                  "rounded-[5px] px-2 py-0.5 tabular-nums transition-colors duration-300",
                  i === at
                    ? "bg-white text-cta shadow-[0_1px_2px_rgba(16,24,40,0.08)]"
                    : "text-muted-foreground",
                )}
              >
                {v} a month
              </span>
            ))}
          </span>
        }
      >
        <div className="grid grid-cols-10 gap-1">
          {Array.from({ length: 50 }, (_, i) => {
            const on = i < count;
            return (
              <span
                key={i}
                className={cn(
                  "aspect-[2/1] rounded-[3px] border transition-[background-color,border-color] duration-500",
                  on ? "border-cta/30 bg-cta/85" : "border-ink/[0.07] bg-white",
                )}
                style={{ transitionDelay: on && !reduce ? `${(i % 50) * 14}ms` : "0ms" }}
              />
            );
          })}
        </div>
        <p className="mt-3 flex items-center gap-1.5 text-[0.7rem] font-medium text-ink">
          <Mic className="h-3.5 w-3.5 text-cta" />
          <span className="tabular-nums">{count}</span> articles, one voice
        </p>
      </Sheet>
    </div>
  );
}

/* ---------- Step: describe your voice ---------- */

const PRODUCT_LINE = VOICE.product;

export function DescribeStep({ active }: { active: boolean }) {
  const { typed, typing } = useTypewriter(PRODUCT_LINE, { speed: 32, hold: 6000, run: active });
  return (
    <Sheet
      title={
        <>
          <Mic className="h-3.5 w-3.5 text-cta" />
          Set up your voice
        </>
      }
      meta={<span className="text-[0.68rem] text-muted-foreground">Step 1 of 3</span>}
      className="w-full max-w-[30rem]"
    >
      <div className="space-y-3">
        <Field label="Tone">
          <div className="flex flex-wrap gap-1.5">
            {VOICE.tone.map((t) => (
              <span
                key={t}
                className="rounded-md bg-cta px-2 py-1 text-[0.7rem] font-medium text-white"
              >
                {t}
              </span>
            ))}
          </div>
        </Field>
        <Field label="Style guidelines">
          <div className={cn(INPUT, "space-y-0.5 leading-relaxed")}>
            <p>Short sentences. Talk to one reader.</p>
            <p>Advice before the pitch.</p>
          </div>
        </Field>
        <Field label="Product details">
          <p
            className={cn(
              INPUT,
              "min-h-[2.15rem] border-cta/40 shadow-[0_0_0_3px_color-mix(in_oklab,var(--cta)_10%,transparent)]",
            )}
          >
            {typed}
            <Caret on={typing} />
          </p>
        </Field>
      </div>
    </Sheet>
  );
}

/* ---------- Step: generate on-brand ---------- */

const QUEUE_STATES = ["Written", "Written", "Writing", "Queued"] as const;

export function GenerateStep() {
  return (
    <Sheet
      title={
        <>
          <PenLine className="h-3.5 w-3.5 text-cta" />
          Articles
        </>
      }
      meta={
        <span className="flex items-center gap-1.5 text-[0.68rem] font-medium text-cta">
          <Mic className="h-3 w-3" />
          Your voice on all
        </span>
      }
      className="w-full max-w-[30rem]"
    >
      <div className="space-y-1.5">
        {ARTICLES.map((a, i) => {
          const st = QUEUE_STATES[i];
          return (
            <motion.div
              key={a.title}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.08, ease: EASE }}
              className="flex items-center justify-between gap-3 rounded-lg border border-ink/[0.07] bg-white px-3 py-2"
            >
              <span className="min-w-0">
                <span className="block truncate text-[0.74rem] font-medium text-ink">
                  {a.title}
                </span>
                <span className="mt-0.5 block truncate text-[0.66rem] text-muted-foreground">
                  {a.lead}
                </span>
              </span>
              <span
                className={cn(
                  "inline-flex shrink-0 items-center gap-1 rounded-md px-1.5 py-0.5 text-[0.62rem] font-semibold",
                  st === "Written" && "bg-success/10 text-success",
                  st === "Writing" && "bg-cta-soft text-cta",
                  st === "Queued" && "border border-ink/[0.08] text-muted-foreground",
                )}
              >
                {st === "Written" && <Check className="h-2.5 w-2.5" strokeWidth={3} />}
                {st === "Writing" && (
                  <span className="h-1.5 w-1.5 rounded-full bg-cta motion-safe:animate-pulse" />
                )}
                {st}
              </span>
            </motion.div>
          );
        })}
      </div>
    </Sheet>
  );
}

/* ---------- Step: refine over time ---------- */

export function RefineStep() {
  return (
    <Sheet
      title={
        <>
          <RefreshCw className="h-3.5 w-3.5 text-cta" />
          Instructions updated
        </>
      }
      meta={<span className="text-[0.68rem] text-muted-foreground">Just now</span>}
      className="w-full max-w-[30rem]"
    >
      <div className="space-y-1 rounded-lg border border-ink/[0.07] bg-[color-mix(in_oklab,var(--surface)_50%,white)] p-2.5 font-mono text-[0.7rem] leading-relaxed">
        <p className="rounded px-1.5 text-muted-foreground">Tone: Plain-spoken, practical, warm</p>
        <motion.p
          initial={{ opacity: 0, x: -6 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.15, ease: EASE }}
          className="rounded bg-success/10 px-1.5 text-success"
        >
          + Use UK spelling and £ in examples.
        </motion.p>
      </div>
      <p className="mb-1.5 mt-3.5 text-[0.66rem] font-medium text-muted-foreground">
        Every new article follows
      </p>
      <div className="space-y-1.5">
        {ARTICLES.slice(1, 4).map((a, i) => (
          <motion.div
            key={a.title}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 + i * 0.08, ease: EASE }}
            className="flex items-center justify-between gap-3 rounded-lg border border-ink/[0.07] bg-white px-3 py-2"
          >
            <span className="truncate text-[0.74rem] font-medium text-ink">{a.title}</span>
            <span className="inline-flex shrink-0 items-center gap-1 rounded-md bg-cta-soft px-1.5 py-0.5 text-[0.62rem] font-semibold text-cta">
              <Check className="h-2.5 w-2.5" strokeWidth={3} />
              Updated voice
            </span>
          </motion.div>
        ))}
      </div>
    </Sheet>
  );
}

/* ---------- Closing band: articles in one voice ---------- */

/** Three articles fanned out, rising from the closing band's foot. */
export function ArticleStack({ className }: { className?: string }) {
  const cards = ARTICLES.slice(0, 3);
  return (
    <div aria-hidden className={cn("relative", className)}>
      {cards.map((a, i) => {
        const back = cards.length - 1 - i;
        const front = back === 0;
        return (
          <div
            key={a.title}
            className={cn(
              "absolute inset-x-0 top-14 rounded-t-xl border border-b-0 p-4 text-left sm:p-5",
              front
                ? "border-white/25 bg-white shadow-[0_-12px_48px_-16px_rgba(4,24,72,0.55)]"
                : "h-full border-white/30 bg-[color-mix(in_oklab,white_86%,var(--cta))] shadow-[0_-8px_24px_-12px_rgba(4,24,72,0.4)]",
            )}
            style={{
              transform: `translateY(${back * -22}px) scale(${1 - back * 0.05})`,
              transformOrigin: "50% 0%",
              zIndex: i,
            }}
          >
            {/* Only the front card is written out; the ones behind are just
                their edges, so no text reads through. */}
            {front && (
              <>
                <div className="flex items-center justify-between gap-3">
                  <span className="flex min-w-0 items-center gap-2 text-[0.8rem] font-semibold text-ink">
                    <Mark className="h-4 w-4 shrink-0 text-brand-blue" />
                    <span className="truncate">{a.title}</span>
                  </span>
                  <span className="inline-flex shrink-0 items-center gap-1 rounded-md bg-cta-soft px-1.5 py-0.5 text-[0.62rem] font-semibold text-cta">
                    <Mic className="h-3 w-3" />
                    Your voice
                  </span>
                </div>
                <p className="mt-3 text-[0.82rem] leading-relaxed text-ink/80">{a.lead}</p>
                <div className="mt-3 space-y-1.5">
                  {[96, 88, 70].map((w, j) => (
                    <span
                      key={j}
                      className="block h-1.5 rounded-full bg-ink/[0.06]"
                      style={{ width: `${w}%` }}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}
