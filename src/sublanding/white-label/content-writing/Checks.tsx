import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, Copy, ExternalLink, Square } from "lucide-react";
import { CHECKS } from "./content";
import { checklistText } from "./checklist";
import { MoreLinks } from "./MoreLinks";
import { SectionShell } from "./SectionShell";

type CopyState = "idle" | "copied" | "failed";

/**
 * 04. Two columns that split the work: what Rankbox checks on every draft
 * (the 11 checks behind the score) and what only your editor can read for.
 * The editor's list copies as plain text for an agency's own process, with a
 * visible confirmation or a fallback line if the clipboard is refused. Under
 * both, Google's own words on AI content and on scaled content, dated.
 */
export function Checks() {
  const [state, setState] = useState<CopyState>("idle");

  useEffect(() => {
    if (state !== "copied") return;
    const t = window.setTimeout(() => setState("idle"), 2400);
    return () => window.clearTimeout(t);
  }, [state]);

  const copy = async () => {
    try {
      if (!navigator.clipboard?.writeText) throw new Error("no clipboard");
      await navigator.clipboard.writeText(checklistText());
      setState("copied");
    } catch {
      setState("failed");
    }
  };

  return (
    <SectionShell id="checks" intro={CHECKS.intro}>
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Rankbox's side. */}
        <div className="rounded-2xl border border-ink/[0.08] bg-white p-5 shadow-[0_1px_2px_rgba(16,24,40,0.04)] sm:p-6">
          <h3 className="text-[1rem] font-semibold tracking-tight text-ink">{CHECKS.autoTitle}</h3>
          <p className="mt-1.5 text-[0.86rem] leading-relaxed text-muted-foreground">
            {CHECKS.autoLead}
          </p>
          <ol className="mt-5 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-1">
            {CHECKS.auto.map((c) => (
              <li
                key={c}
                className="flex items-start gap-2.5 text-[0.85rem] leading-snug text-ink/80"
              >
                <span
                  aria-hidden
                  className="mt-px flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-cta-soft text-brand-blue"
                >
                  <Check className="h-2.5 w-2.5" strokeWidth={3} />
                </span>
                {c}
              </li>
            ))}
          </ol>
          <p className="mt-5 border-t border-ink/[0.07] pt-4 text-[0.8rem] leading-relaxed text-muted-foreground">
            {CHECKS.autoNote}
          </p>
        </div>

        {/* Your editor's side. */}
        <div className="flex flex-col rounded-2xl border border-ink/[0.08] bg-white p-5 shadow-[0_1px_2px_rgba(16,24,40,0.04)] sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="text-[1rem] font-semibold tracking-tight text-ink">
                {CHECKS.editorTitle}
              </h3>
              <p className="mt-1.5 text-[0.86rem] leading-relaxed text-muted-foreground">
                {CHECKS.editorLead}
              </p>
            </div>
            <button
              type="button"
              onClick={copy}
              className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-lg border border-ink/[0.12] bg-white px-3 text-[0.8rem] font-medium text-ink shadow-[0_1px_2px_rgba(16,24,40,0.04)] transition-colors hover:border-ink/[0.2] hover:bg-ink/[0.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta/40"
            >
              {state === "copied" ? (
                <Check aria-hidden className="h-3.5 w-3.5 text-brand-blue" />
              ) : (
                <Copy aria-hidden className="h-3.5 w-3.5" />
              )}
              {state === "copied" ? CHECKS.copied : CHECKS.copy}
            </button>
          </div>
          <ul className="mt-5 grid gap-2.5">
            {CHECKS.editor.map((item) => (
              <li
                key={item}
                className="flex items-start gap-2.5 text-[0.86rem] leading-relaxed text-ink/80"
              >
                <Square aria-hidden className="mt-[0.2rem] h-3.5 w-3.5 shrink-0 text-ink/30" />
                {item}
              </li>
            ))}
          </ul>
          <div aria-live="polite" className="min-h-[1.25rem]">
            <AnimatePresence>
              {state === "failed" && (
                <motion.p
                  initial={{ opacity: 0, y: -2 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-4 text-[0.8rem] text-destructive"
                >
                  {CHECKS.copyFailed}
                </motion.p>
              )}
              {state === "copied" && <span className="sr-only">{CHECKS.copied}</span>}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Google, in its own words. */}
      <div className="mt-10 max-w-4xl">
        <h3 className="text-[1rem] font-semibold tracking-tight text-ink">{CHECKS.googleTitle}</h3>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {CHECKS.google.map((g) => (
            <figure key={g.href} className="border-l-2 border-brand-blue/30 pl-4">
              <blockquote className="text-[0.95rem] leading-relaxed text-ink">
                “{g.quote}”
              </blockquote>
              <figcaption className="mt-2 text-[0.78rem] leading-relaxed text-muted-foreground">
                <a
                  href={g.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded underline decoration-ink/20 underline-offset-4 transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta/40"
                >
                  {g.source}
                  <ExternalLink aria-hidden className="h-3 w-3" />
                </a>
              </figcaption>
            </figure>
          ))}
        </div>
        <p className="mt-5 text-[0.88rem] leading-relaxed text-ink/75">{CHECKS.googleTake}</p>
      </div>
      <MoreLinks links={CHECKS.links} />
    </SectionShell>
  );
}
