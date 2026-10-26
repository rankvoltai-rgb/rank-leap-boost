/**
 * The page's focal visual: one Perplexity answer, taken apart. Each claim in
 * the answer ends in a source chip (the first source's site name, +N for the
 * rest); the chip's card pages through those sources; the sources panel
 * numbers them; and the footer shows the same answer as the Agent API returns
 * it, with [n] markers pointing at the numbered results.
 *
 * It steps through claim → source pairs while at least half of it is on
 * screen, resets when it leaves, and holds the first pair as a still frame
 * under reduced motion. The answer and sources come from the guide's
 * `preview`, whose answer text carries the [n] markers itself.
 */
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { ChevronLeft, ChevronRight, Images, Link2, Search } from "lucide-react";
import { EngineMark } from "@/components/ai-seo/kit";
import type { AnswerPreview } from "@/data/ai-seo/types";
import { parseInline } from "@/lib/inline-md";
import { cn } from "@/lib/utils";

interface Claim {
  text: string;
  /** 1-based source numbers, in the order the answer attaches them. */
  refs: number[];
}

/* Splits "First claim.[2][1] Second claim.[3][1]" into claims and their
   source numbers. Without markers, the whole answer cites every source. */
function parseClaims(answer: string, sourceCount: number): Claim[] {
  const claims: Claim[] = [];
  const re = /((?:\[\d+\])+)/g;
  let last = 0;
  for (let m = re.exec(answer); m; m = re.exec(answer)) {
    const refs = [...m[1].matchAll(/\[(\d+)\]/g)]
      .map((x) => Number(x[1]))
      .filter((n) => n >= 1 && n <= sourceCount);
    claims.push({ text: answer.slice(last, m.index), refs });
    last = m.index + m[1].length;
  }
  const rest = answer.slice(last);
  if (rest.trim()) claims.push({ text: rest, refs: [] });
  if (claims.every((c) => c.refs.length === 0)) {
    return [
      {
        text: claims.map((c) => c.text).join(""),
        refs: Array.from({ length: sourceCount }, (_, i) => i + 1),
      },
    ];
  }
  return claims;
}

/** "docs.perplexity.ai" → "perplexity": the name Perplexity prints on a chip. */
function siteName(domain: string): string {
  const parts = domain.replace(/^www\./, "").split(".");
  return parts.length >= 2 ? parts[parts.length - 2] : parts[0];
}

function Favicon({ domain, className }: { domain: string; className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full bg-ink/[0.07] font-semibold uppercase leading-none text-ink/60",
        className,
      )}
    >
      {siteName(domain).charAt(0)}
    </span>
  );
}

/** The last few words of a claim, for the API strip. */
function tail(text: string, words = 3): string {
  const plain = parseInline(text)
    .map((s) => s.text)
    .join("")
    .trim();
  const w = plain.split(/\s+/);
  return (w.length > words ? "…" : "") + w.slice(-words).join(" ");
}

const STEP_MS = 2100;

export function CitationMap({
  preview,
  className,
}: {
  preview: AnswerPreview;
  className?: string;
}) {
  const claims = useMemo(
    () => parseClaims(preview.answer, preview.sources.length),
    [preview.answer, preview.sources.length],
  );
  /* Every (claim, source) pair the card can show, in reading order. */
  const steps = useMemo(
    () => claims.flatMap((c, ci) => c.refs.map((_, ri) => ({ claim: ci, ref: ri }))),
    [claims],
  );

  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.5 });
  const reduce = useReducedMotion();
  const [step, setStep] = useState(0);
  const [pinned, setPinned] = useState(false);

  useEffect(() => {
    if (!inView) {
      setStep(0);
      setPinned(false);
      return;
    }
    if (reduce || pinned || steps.length < 2) return;
    const t = window.setInterval(() => setStep((s) => (s + 1) % steps.length), STEP_MS);
    return () => window.clearInterval(t);
  }, [inView, reduce, pinned, steps.length]);

  const current = steps[step] ?? { claim: 0, ref: 0 };
  const claim = claims[current.claim];
  const activeSource = claim.refs[current.ref] ?? 1;
  const card = preview.sources[activeSource - 1];

  const pick = (ci: number) => {
    const at = steps.findIndex((s) => s.claim === ci);
    if (at >= 0) setStep(at);
    setPinned(true);
  };
  const page = (dir: 1 | -1) => {
    const n = claim.refs.length;
    const next = (current.ref + dir + n) % n;
    const at = steps.findIndex((s) => s.claim === current.claim && s.ref === next);
    if (at >= 0) setStep(at);
    setPinned(true);
  };

  return (
    <div
      ref={ref}
      className={cn(
        "overflow-hidden rounded-xl border border-ink/[0.08] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.05),0_24px_48px_-28px_rgba(16,24,40,0.28)]",
        className,
      )}
    >
      {/* ---- app bar ---- */}
      <div className="flex items-center justify-between gap-3 border-b border-ink/[0.07] px-4 py-2.5">
        <div className="flex items-center gap-3">
          <span className="flex h-6 w-6 items-center justify-center rounded-md border border-ink/[0.08] bg-white">
            <EngineMark mark="Perplexity" className="h-3.5 w-3.5" />
          </span>
          <ul aria-hidden className="flex items-center gap-3 text-[0.72rem] font-medium">
            <li className="flex items-center gap-1 border-b-2 border-ink pb-0.5 text-ink">
              <Search className="h-3 w-3" />
              Answer
            </li>
            <li className="flex items-center gap-1 pb-0.5 text-muted-foreground">
              <Link2 className="h-3 w-3" />
              Links
            </li>
            <li className="hidden items-center gap-1 pb-0.5 text-muted-foreground sm:flex">
              <Images className="h-3 w-3" />
              Images
            </li>
          </ul>
        </div>
        <span className="flex items-center gap-1.5 text-[0.7rem] text-muted-foreground">
          <span aria-hidden className="flex -space-x-1">
            {preview.sources.slice(0, 3).map((s) => (
              <Favicon
                key={s.domain}
                domain={s.domain}
                className="h-4 w-4 text-[0.5rem] ring-2 ring-white"
              />
            ))}
          </span>
          {preview.sources.length} sources
        </span>
      </div>

      <div className="space-y-4 p-4 sm:p-5">
        {/* ---- the question ---- */}
        <p className="ml-auto w-fit max-w-[88%] rounded-2xl rounded-br-md bg-ink/[0.045] px-3.5 py-2 text-[0.84rem] leading-snug text-ink">
          {preview.prompt}
        </p>

        {/* ---- the answer, claim by claim ---- */}
        <div>
          <p className="text-[0.7rem] text-muted-foreground">{preview.status}</p>
          <p className="mt-1.5 font-serif text-[0.98rem] leading-[1.7] text-ink sm:text-[1.02rem]">
            {claims.map((c, ci) => {
              const on = ci === current.claim;
              const first = preview.sources[(c.refs[0] ?? 1) - 1];
              return (
                <span key={ci}>
                  <span
                    className={cn(
                      "rounded-[3px] transition-colors duration-500 [box-decoration-break:clone] [-webkit-box-decoration-break:clone]",
                      on ? "bg-cta-soft text-ink" : "text-ink/70",
                    )}
                  >
                    {parseInline(c.text.trim()).map((s, i) =>
                      s.bold ? (
                        <strong key={i} className="font-semibold text-ink">
                          {s.text}
                        </strong>
                      ) : (
                        <span key={i}>{s.text}</span>
                      ),
                    )}
                  </span>
                  {c.refs.length > 0 && first && (
                    <button
                      type="button"
                      onClick={() => pick(ci)}
                      aria-pressed={on}
                      aria-label={`Claim ${ci + 1}: sources ${c.refs.join(" and ")}`}
                      className={cn(
                        "mx-1 inline-flex translate-y-[-1px] items-center gap-1 rounded-md border px-1.5 py-px align-middle font-sans text-[0.66rem] font-medium leading-4 transition-colors duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta/40",
                        on
                          ? "border-cta bg-cta text-white"
                          : "border-ink/[0.1] bg-ink/[0.03] text-ink/60 hover:border-ink/20",
                      )}
                    >
                      {siteName(first.domain)}
                      {c.refs.length > 1 && (
                        <span className={on ? "text-white/75" : "text-ink/40"}>
                          +{c.refs.length - 1}
                        </span>
                      )}
                    </button>
                  )}{" "}
                </span>
              );
            })}
          </p>
        </div>

        {/* ---- the chip's card ---- */}
        {card && (
          <div className="rounded-lg border border-ink/[0.09] bg-white p-3 shadow-[0_10px_30px_-18px_rgba(16,24,40,0.35)]">
            <div className="flex items-center justify-between text-[0.68rem] text-muted-foreground">
              <span className="flex items-center gap-0.5">
                <button
                  type="button"
                  onClick={() => page(-1)}
                  aria-label="Previous source"
                  className="rounded p-0.5 transition-colors hover:bg-ink/[0.05] hover:text-ink"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                </button>
                <span className="min-w-[2.2rem] text-center font-mono tabular-nums text-ink">
                  {current.ref + 1}/{claim.refs.length}
                </span>
                <button
                  type="button"
                  onClick={() => page(1)}
                  aria-label="Next source"
                  className="rounded p-0.5 transition-colors hover:bg-ink/[0.05] hover:text-ink"
                >
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </span>
              <span>
                Source {activeSource} of {preview.sources.length}
              </span>
            </div>
            <div className="relative mt-2 h-[3.4rem] overflow-hidden">
              <AnimatePresence initial={false} mode="popLayout">
                <motion.div
                  key={`${current.claim}-${current.ref}`}
                  initial={reduce ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduce ? undefined : { opacity: 0, y: -8 }}
                  transition={{ duration: 0.35, ease: [0.21, 0.47, 0.32, 0.98] }}
                >
                  <p className="flex items-center gap-1.5 text-[0.7rem] text-muted-foreground">
                    <Favicon domain={card.domain} className="h-4 w-4 text-[0.5rem]" />
                    {card.domain}
                  </p>
                  <p className="mt-1 line-clamp-2 text-[0.8rem] font-medium leading-snug text-ink">
                    {card.title}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* ---- the numbered sources ---- */}
        <div>
          <p className="mb-1.5 text-[0.66rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Sources
          </p>
          <ol className="space-y-1">
            {preview.sources.map((s, i) => {
              const n = i + 1;
              const inClaim = claim.refs.includes(n);
              const isCard = n === activeSource;
              return (
                <li
                  key={s.domain + s.title}
                  className={cn(
                    "flex items-center gap-2.5 rounded-lg border px-2 py-1.5 transition-colors duration-500",
                    isCard
                      ? "border-cta/40 bg-cta-soft"
                      : inClaim
                        ? "border-cta/20 bg-white"
                        : "border-transparent bg-white",
                  )}
                >
                  <span
                    className={cn(
                      "flex h-5 w-5 shrink-0 items-center justify-center rounded font-mono text-[0.66rem] font-semibold transition-colors duration-500",
                      isCard
                        ? "bg-cta text-white"
                        : inClaim
                          ? "bg-cta-soft text-cta"
                          : "bg-ink/[0.05] text-ink/45",
                    )}
                  >
                    {n}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span
                      className={cn(
                        "block truncate text-[0.75rem] font-medium leading-snug",
                        inClaim ? "text-ink" : "text-ink/55",
                      )}
                    >
                      {s.title}
                    </span>
                    <span className="block truncate text-[0.66rem] text-muted-foreground">
                      {s.domain}
                    </span>
                  </span>
                </li>
              );
            })}
          </ol>
        </div>
      </div>

      {/* ---- the same answer, as the API returns it ---- */}
      <div className="border-t border-ink/[0.07] bg-[color-mix(in_oklab,var(--surface)_70%,white)] px-4 py-3 sm:px-5">
        <p className="text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          Same answer in the Agent API
        </p>
        <p className="mt-1.5 break-words font-mono text-[0.7rem] leading-relaxed text-ink/60">
          &quot;text&quot;: &quot;
          {claims.map((c, ci) => (
            <span key={ci}>
              {ci > 0 && " "}
              {tail(c.text)}
              {c.refs.map((n) => (
                <span
                  key={n}
                  className={cn(
                    "rounded-[3px] px-px transition-colors duration-500",
                    ci === current.claim
                      ? n === activeSource
                        ? "bg-cta text-white"
                        : "bg-cta-soft text-cta"
                      : "text-ink/60",
                  )}
                >
                  [{n}]
                </span>
              ))}
            </span>
          ))}
          &quot;
        </p>
      </div>
    </div>
  );
}
