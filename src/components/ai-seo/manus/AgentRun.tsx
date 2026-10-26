/**
 * The Manus guide's focal visual: one task's path through a page, in the
 * agent's own window. It searches, opens the pricing page in its cloud
 * browser, reads it (text kept, image and link dropped), extracts Markdown,
 * and lists the page as source [1] in the file it delivers.
 *
 * The extraction step is the point: it's the Manus mechanic a site owner can
 * act on, so the still frame (reduced motion) is that step, fully drawn.
 * Animates only while at least half on screen and starts over when it
 * leaves; the phase chips let a reader step through it by hand.
 */
import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import {
  Check,
  FileSpreadsheet,
  FileText,
  Globe,
  ImageIcon,
  Link2,
  Lock,
  RotateCcw,
  Search,
  ShieldCheck,
} from "lucide-react";
import { ManusMark } from "@/components/landing/ai-logos";
import { LINE, PANEL } from "@/components/landing/frame";
import type { AnswerPreview } from "@/data/ai-seo/types";
import { parseInline } from "@/lib/inline-md";
import { cn } from "@/lib/utils";

const PHASES = [
  { label: "Search", ms: 3200 },
  { label: "Open", ms: 2400 },
  { label: "Read", ms: 3600 },
  { label: "Extract", ms: 3800 },
  { label: "Cite", ms: 4600 },
] as const;
/** The frame shown without motion: the page read, its text extracted. */
const STILL = 3;
const EASE = [0.16, 1, 0.3, 1] as const;

function Favicon({ domain, className }: { domain: string; className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "flex h-4 w-4 shrink-0 items-center justify-center rounded-[4px] bg-ink/[0.06] text-[0.55rem] font-semibold uppercase text-ink/60",
        className,
      )}
    >
      {domain.charAt(0)}
    </span>
  );
}

/** The cited brand: the bold span in the preview answer. */
function brandOf(answer: string): string {
  return parseInline(answer).find((s) => s.bold)?.text ?? "";
}

function AnswerText({ text }: { text: string }) {
  return (
    <>
      {parseInline(text).map((s, i) =>
        s.bold ? (
          <span
            key={i}
            className="font-semibold text-ink underline decoration-brand-blue/50 decoration-2 underline-offset-2"
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

/* ---------- the views ---------- */

function SearchView({ p, still }: { p: AnswerPreview; still: boolean }) {
  const reveal = (delay: number) =>
    still
      ? { initial: false as const }
      : {
          initial: { opacity: 0, y: 6 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.4, delay, ease: EASE },
        };
  return (
    <div className="flex h-full flex-col p-3.5 sm:p-4">
      <div className="flex items-center gap-2 rounded-lg border border-ink/[0.1] bg-white px-3 py-2 shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
        <Search aria-hidden className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
        <span className="truncate font-mono text-[0.72rem] text-ink">
          agency bookkeeping software pricing
        </span>
        <span className="ml-auto shrink-0 rounded bg-ink/[0.05] px-1.5 py-0.5 font-mono text-[0.58rem] text-muted-foreground">
          past year
        </span>
      </div>
      <ol className="mt-3 space-y-1.5">
        {p.sources.slice(0, 3).map((s, i) => (
          <motion.li
            key={s.domain}
            {...reveal(0.25 + i * 0.18)}
            className={cn(
              "relative rounded-lg border px-3 py-2",
              i === 0 ? "border-cta/30 bg-white" : "border-ink/[0.06] bg-white/70",
            )}
          >
            <span className="flex items-center gap-1.5 text-[0.62rem] text-muted-foreground">
              <Favicon domain={s.domain} className="h-3.5 w-3.5" />
              {s.domain}
            </span>
            <span className="mt-0.5 block truncate text-[0.74rem] font-medium text-ink">
              {s.title}
            </span>
            <span aria-hidden className="mt-1.5 block h-1 w-4/5 rounded-full bg-ink/[0.07]" />
            {i === 0 && (
              <motion.span
                {...(still
                  ? { initial: false as const }
                  : {
                      initial: { opacity: 0, scale: 0.9 },
                      animate: { opacity: 1, scale: 1 },
                      transition: { duration: 0.35, delay: 1.7, ease: EASE },
                    })}
                className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-md bg-cta px-1.5 py-0.5 text-[0.58rem] font-semibold text-white"
              >
                <Globe aria-hidden className="h-2.5 w-2.5" />
                Open page
              </motion.span>
            )}
          </motion.li>
        ))}
      </ol>
      <p className="mt-auto pt-2 text-[0.62rem] text-muted-foreground">
        Snippets aren't sources: the page has to be opened.
      </p>
    </div>
  );
}

/** A kept/omitted marker beside a page element while the agent reads it. */
function Mark({
  kept,
  children,
  show,
  delay,
  still,
}: {
  kept: boolean;
  children: ReactNode;
  show: boolean;
  delay: number;
  still: boolean;
}) {
  if (!show) return null;
  return (
    <motion.span
      {...(still
        ? { initial: false as const }
        : {
            initial: { opacity: 0, x: 6 },
            animate: { opacity: 1, x: 0 },
            transition: { duration: 0.35, delay, ease: EASE },
          })}
      className={cn(
        "absolute right-2 top-1/2 inline-flex -translate-y-1/2 items-center gap-1 whitespace-nowrap rounded-md px-1.5 py-0.5 text-[0.56rem] font-semibold shadow-[0_1px_2px_rgba(16,24,40,0.08)]",
        kept ? "bg-cta text-white" : "border border-ink/[0.12] bg-white text-ink/60",
      )}
    >
      {kept ? (
        <Check aria-hidden className="h-2.5 w-2.5" />
      ) : (
        <span aria-hidden className="text-[0.7rem] leading-none">
          ×
        </span>
      )}
      {children}
    </motion.span>
  );
}

function BrowserView({ p, phase, still }: { p: AnswerPreview; phase: number; still: boolean }) {
  const [cited] = p.sources;
  const brand = brandOf(p.answer);
  const reading = phase >= 2;
  const extracting = phase >= 3;
  /* Marks drawn during Read are already there by Extract. */
  const markStill = still || phase > 2;
  const lines: { text: string; omitted?: boolean }[] = [
    { text: `# ${brand} pricing` },
    { text: "Updated October 2026" },
    { text: "| Solo | $9 |" },
    { text: "| Studio | $14 |" },
    { text: "[image omitted]", omitted: true },
    { text: "[link omitted]", omitted: true },
  ];
  return (
    <div className="flex h-full flex-col">
      {/* browser chrome */}
      <div className={cn("flex items-center gap-2 border-b px-3 py-2", LINE, PANEL)}>
        <span aria-hidden className="flex gap-1">
          <span className="h-2 w-2 rounded-full bg-ink/[0.12]" />
          <span className="h-2 w-2 rounded-full bg-ink/[0.12]" />
          <span className="h-2 w-2 rounded-full bg-ink/[0.12]" />
        </span>
        <span className="flex min-w-0 flex-1 items-center gap-1.5 rounded-md border border-ink/[0.08] bg-white px-2 py-1">
          <Lock aria-hidden className="h-2.5 w-2.5 shrink-0 text-muted-foreground" />
          <span className="truncate font-mono text-[0.64rem] text-ink">{cited.domain}/pricing</span>
        </span>
        <motion.span
          {...(still
            ? { initial: false as const }
            : {
                initial: { opacity: 0, y: -4 },
                animate: { opacity: 1, y: 0 },
                transition: { duration: 0.35, delay: 0.5, ease: EASE },
              })}
          className="hidden shrink-0 items-center gap-1 rounded-md bg-cta-soft px-1.5 py-1 font-mono text-[0.56rem] font-medium text-cta min-[400px]:inline-flex"
        >
          <ShieldCheck aria-hidden className="h-2.5 w-2.5" />
          Manus-User/1.0 · signed
        </motion.span>
      </div>

      {/* the page */}
      <div className="relative flex-1 overflow-hidden bg-white">
        {/* By Extract the agent has scrolled: the read elements and their
            marks sit above the Markdown, so the still frame shows both. */}
        <motion.div
          initial={still ? false : { y: 0 }}
          animate={{ y: extracting ? -90 : 0 }}
          transition={{ duration: 0.5, ease: EASE }}
          className="px-4 pt-3.5"
        >
          <div className="flex items-center gap-1.5">
            <Favicon domain={cited.domain} />
            <span className="text-[0.66rem] font-semibold text-ink">{brand}</span>
            <span className="ml-auto flex gap-2" aria-hidden>
              <span className="h-1 w-6 rounded-full bg-ink/[0.08]" />
              <span className="h-1 w-6 rounded-full bg-ink/[0.08]" />
            </span>
          </div>
          <p className="mt-3 font-display text-[1.05rem] font-medium leading-tight tracking-[-0.02em] text-ink">
            {brand} pricing
          </p>
          <p className="mt-0.5 text-[0.58rem] text-muted-foreground">Updated October 2026</p>

          <div className="relative mt-2.5">
            <table className="w-full max-w-[11.5rem] sm:max-w-[18rem] border-collapse text-[0.62rem]">
              <tbody>
                {[
                  ["Solo", "$9"],
                  ["Studio", "$14"],
                  ["Agency", "$22"],
                ].map(([plan, price]) => (
                  <tr key={plan} className={cn("border-b", LINE)}>
                    <td className="py-1 text-ink/70">{plan}</td>
                    <td className="py-1 text-right font-semibold text-ink">
                      {price}
                      <span className="font-normal text-muted-foreground"> /seat</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Mark kept show={reading} delay={0.7} still={markStill}>
              text · kept
            </Mark>
          </div>

          <div className="relative mt-2">
            <div
              aria-hidden
              className="flex h-9 w-full max-w-[11.5rem] sm:max-w-[18rem] items-center gap-2 rounded-md bg-gradient-to-r from-brand-blue/15 to-brand-blue/5 px-2.5"
            >
              <ImageIcon className="h-3.5 w-3.5 text-brand-blue/70" />
              <span className="font-display text-[0.8rem] font-semibold text-brand-blue/80">
                Payroll included
              </span>
            </div>
            <Mark kept={false} show={reading} delay={1.4} still={markStill}>
              image · omitted
            </Mark>
          </div>

          <div className="relative mt-2 pb-3">
            <span className="inline-flex items-center gap-1 text-[0.64rem] font-medium text-cta underline underline-offset-2">
              <Link2 aria-hidden className="h-2.5 w-2.5" />
              Compare plans
            </span>
            <Mark kept={false} show={reading} delay={1.95} still={markStill}>
              link · omitted
            </Mark>
          </div>
        </motion.div>

        {/* the read: a scan line down the page, once */}
        {phase === 2 && !still && (
          <motion.span
            aria-hidden
            initial={{ top: "-12%" }}
            animate={{ top: "105%" }}
            transition={{ duration: 2.4, ease: "linear", delay: 0.15 }}
            className="pointer-events-none absolute inset-x-0 h-10 bg-gradient-to-b from-transparent to-brand-blue/[0.12]"
          >
            <span className="absolute inset-x-0 bottom-0 h-px bg-brand-blue/60" />
          </motion.span>
        )}

        {/* the extraction: Markdown, with what it leaves out */}
        <AnimatePresence>
          {extracting && (
            <motion.div
              key="drawer"
              {...(still
                ? { initial: false as const }
                : {
                    initial: { y: "100%" },
                    animate: { y: 0 },
                    exit: { y: "100%" },
                    transition: { duration: 0.45, ease: EASE },
                  })}
              className="absolute inset-x-0 bottom-0 h-[47%] border-t border-cta/25 bg-white/[0.97] shadow-[0_-12px_32px_-18px_rgba(16,24,40,0.35)] backdrop-blur"
            >
              <p
                className={cn(
                  "flex items-center gap-1.5 border-b px-3.5 py-1.5 text-[0.6rem] font-semibold text-ink/80",
                  LINE,
                )}
              >
                <FileText aria-hidden className="h-3 w-3 text-brand-blue" />
                extracted.md
                <span className="ml-auto font-normal text-muted-foreground">
                  text kept · images & links dropped
                </span>
              </p>
              <ul className="px-3.5 py-2 font-mono text-[0.6rem] leading-[1.4]">
                {lines.map((l, i) => (
                  <motion.li
                    key={l.text}
                    {...(still
                      ? { initial: false as const }
                      : {
                          initial: { opacity: 0 },
                          animate: { opacity: 1 },
                          transition: { duration: 0.25, delay: 0.45 + i * 0.22 },
                        })}
                    className={cn(
                      "truncate",
                      l.omitted ? "text-ink/35 line-through" : "text-ink",
                      i === 3 && "rounded-sm bg-cta-soft text-cta",
                    )}
                  >
                    {l.text}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function CiteView({ p, still }: { p: AnswerPreview; still: boolean }) {
  const refs = p.sources.slice(0, 3);
  const rise = (delay: number) =>
    still
      ? { initial: false as const }
      : {
          initial: { opacity: 0, y: 8 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.45, delay, ease: EASE },
        };
  return (
    <div className="flex h-full flex-col p-3.5 sm:p-4">
      <motion.div
        {...rise(0.1)}
        className="flex flex-1 flex-col overflow-hidden rounded-lg border border-ink/[0.08] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.05)]"
      >
        <p
          className={cn(
            "flex items-center gap-1.5 border-b px-3 py-1.5 text-[0.64rem] font-semibold text-ink/80",
            LINE,
            PANEL,
          )}
        >
          <FileSpreadsheet aria-hidden className="h-3 w-3 text-brand-blue" />
          shortlist.xlsx
          <span className="ml-auto font-normal text-muted-foreground">
            {p.sources.length} sources
          </span>
        </p>
        <p className="px-3 pt-2.5 text-[0.74rem] leading-relaxed text-ink/80">
          <AnswerText text={p.answer} />
          <motion.span
            {...(still
              ? { initial: false as const }
              : {
                  initial: { boxShadow: "0 0 0 0px rgba(24,119,242,0)" },
                  animate: {
                    boxShadow: [
                      "0 0 0 0px rgba(24,119,242,0)",
                      "0 0 0 5px rgba(24,119,242,0.22)",
                      "0 0 0 2px rgba(24,119,242,0.18)",
                    ],
                  },
                  transition: { duration: 1.1, delay: 0.9 },
                })}
            className="ml-1 inline-flex h-4 min-w-4 -translate-y-px items-center justify-center rounded-full bg-cta px-1 align-middle font-mono text-[0.56rem] font-semibold text-white"
          >
            1
          </motion.span>
        </p>
        {/* the sheet the answer summarises, each row tied to its source */}
        <motion.table
          {...rise(0.35)}
          className="mx-3 mt-2.5 w-[calc(100%-1.5rem)] border-collapse text-[0.62rem]"
        >
          <thead>
            <tr className={cn("border-b text-left text-muted-foreground", LINE)}>
              <th className="py-1 font-medium">Tool</th>
              <th className="py-1 font-medium">Per seat</th>
              <th className="py-1 font-medium">Payroll</th>
              <th className="py-1 text-right font-medium">Source</th>
            </tr>
          </thead>
          <tbody>
            {[
              [brandOf(p.answer), "$14", "Included", "1"],
              [p.sources[2]?.title.split(" ")[0] ?? "", "$11", "Add-on", "3"],
            ].map(([tool, price, payroll, src], i) => (
              <tr
                key={tool}
                className={cn("border-b", LINE, i === 0 && "bg-cta-soft/60 font-medium text-ink")}
              >
                <td className="py-1">{tool}</td>
                <td className="py-1">{price}</td>
                <td className="py-1">{payroll}</td>
                <td className="py-1 text-right font-mono text-cta">[{src}]</td>
              </tr>
            ))}
          </tbody>
        </motion.table>
        <ol className={cn("mt-auto space-y-1 border-t px-3 py-2.5", LINE)}>
          {refs.map((s, i) => (
            <motion.li
              key={s.domain}
              {...rise(0.55 + i * 0.15)}
              className={cn(
                "flex items-center gap-1.5 text-[0.62rem] leading-snug",
                i === 0 ? "font-medium text-ink" : "text-muted-foreground",
              )}
            >
              <span
                className={cn(
                  "w-5 shrink-0 font-mono",
                  i === 0 ? "font-semibold text-cta" : "text-muted-foreground",
                )}
              >
                [{i + 1}]
              </span>
              <span className="min-w-0 truncate">{s.title}</span>
              <span className="ml-auto shrink-0 font-mono text-[0.56rem] text-muted-foreground">
                {s.domain}
              </span>
            </motion.li>
          ))}
        </ol>
      </motion.div>
      <p className="pt-2 text-[0.62rem] text-muted-foreground">
        Opened, used, listed: the page that supplied the price is source [1].
      </p>
    </div>
  );
}

/* ---------- the window ---------- */

export function AgentRun({ preview, className }: { preview: AnswerPreview; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.5 });
  const reduce = useReducedMotion() ?? false;
  const [phase, setPhase] = useState(0);
  const [manual, setManual] = useState(false);

  useEffect(() => {
    if (reduce) {
      if (!manual) setPhase(STILL);
      return;
    }
    if (!inView) {
      setPhase(0);
      setManual(false);
      return;
    }
    if (manual) return;
    const t = window.setTimeout(() => setPhase((n) => (n + 1) % PHASES.length), PHASES[phase].ms);
    return () => window.clearTimeout(t);
  }, [phase, inView, reduce, manual]);

  const still = reduce;
  const view = phase === 0 ? "search" : phase === 4 ? "cite" : "browser";
  const status =
    phase === 0
      ? "Manus is using Search"
      : phase === 4
        ? "Manus is writing shortlist.xlsx"
        : preview.status;

  return (
    <figure ref={ref} className={cn("w-full", className)}>
      <div className="overflow-hidden rounded-xl border border-ink/[0.08] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.05),0_24px_48px_-30px_rgba(16,24,40,0.35)]">
        {/* window bar */}
        <div className={cn("flex items-center gap-2 border-b px-3.5 py-2.5", LINE)}>
          <ManusMark className="h-4 w-4 shrink-0" />
          <span className="truncate text-[0.74rem] font-semibold text-ink">
            Bookkeeping shortlist
          </span>
          <span className="ml-auto shrink-0 rounded-md border border-ink/[0.08] px-1.5 py-0.5 font-mono text-[0.6rem] text-muted-foreground">
            Step {phase + 1}/{PHASES.length}
          </span>
        </div>

        <div className={cn("space-y-2.5 px-3.5 pb-3 pt-3", PANEL)}>
          {/* the task */}
          <p className="ml-auto max-w-[92%] rounded-xl rounded-br-sm bg-white px-3 py-2 text-[0.72rem] leading-snug text-ink shadow-[0_1px_2px_rgba(16,24,40,0.06)] ring-1 ring-ink/[0.06]">
            {preview.prompt}
          </p>
          <p className="flex items-center gap-1.5 text-[0.66rem] text-muted-foreground" aria-hidden>
            <span className="relative flex h-1.5 w-1.5">
              {inView && !reduce && (
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-blue/40" />
              )}
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-brand-blue" />
            </span>
            {status}
          </p>

          {/* phase chips: the walk-through, and a way to step it by hand */}
          <div className="flex items-center gap-1">
            <ol className="flex min-w-0 flex-1 gap-1">
              {PHASES.map((ph, i) => {
                const done = i < phase;
                const on = i === phase;
                return (
                  <li key={ph.label} className="min-w-0 flex-1">
                    <button
                      type="button"
                      onClick={() => {
                        setManual(true);
                        setPhase(i);
                      }}
                      aria-pressed={on}
                      className={cn(
                        "flex h-7 w-full items-center justify-center gap-1 rounded-md px-1 text-[0.64rem] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta/40",
                        on
                          ? "bg-cta text-white"
                          : done
                            ? "bg-cta-soft text-cta"
                            : "bg-white text-muted-foreground ring-1 ring-inset ring-ink/[0.07] hover:text-ink",
                      )}
                    >
                      {done && <Check aria-hidden className="hidden h-2.5 w-2.5 sm:block" />}
                      <span className="truncate">{ph.label}</span>
                    </button>
                  </li>
                );
              })}
            </ol>
            {manual && !reduce && (
              <button
                type="button"
                onClick={() => {
                  setManual(false);
                  setPhase(0);
                }}
                aria-label="Replay the walk-through"
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-white text-muted-foreground ring-1 ring-inset ring-ink/[0.07] transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta/40"
              >
                <RotateCcw className="h-3 w-3" />
              </button>
            )}
          </div>

          {/* the stage */}
          <div
            aria-hidden
            className="relative h-[20.5rem] overflow-hidden rounded-lg border border-ink/[0.08] bg-[color-mix(in_oklab,var(--surface)_40%,white)] sm:h-[21rem]"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={view}
                initial={still ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="absolute inset-0"
              >
                {view === "search" && <SearchView p={preview} still={still} />}
                {view === "browser" && <BrowserView p={preview} phase={phase} still={still} />}
                {view === "cite" && <CiteView p={preview} still={still} />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
      <figcaption className="mt-3 text-[0.72rem] leading-relaxed text-muted-foreground">
        Illustration of one Manus task: search, open the page in its cloud browser, read, extract
        the text, cite. Brands and prices are invented.
      </figcaption>
    </figure>
  );
}
