/**
 * The guide's contents: a sticky rail on desktop that follows the reader, a
 * collapsible list at the top of the text on phones, and the small Rankbox
 * offer that sits under the rail.
 */
import { useEffect, useMemo, useState, type MouseEvent } from "react";
import { ArrowRight, ChevronDown } from "lucide-react";
import { TRIAL_NOTE } from "@/components/features/FeatureSections";
import { cn } from "@/lib/utils";

export interface ContentsEntry {
  id: string;
  text: string;
}

/* Sticky navbar (h-16) plus breathing room; headings carry scroll-mt-28. */
const OFFSET = 112;

function useActive(ids: string[]): string | null {
  const [active, setActive] = useState<string | null>(ids[0] ?? null);
  useEffect(() => {
    let frame = 0;
    const measure = () => {
      frame = 0;
      let current = ids[0] ?? null;
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= OFFSET + 8) current = id;
      }
      setActive(current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [ids]);
  return active;
}

function jumpTo(e: MouseEvent<HTMLAnchorElement>, id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  e.preventDefault();
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.scrollTo({
    top: el.getBoundingClientRect().top + window.scrollY - OFFSET + 4,
    behavior: reduce ? "auto" : "smooth",
  });
  history.replaceState(null, "", `#${id}`);
}

export function ContentsRail({
  entries,
  className,
}: {
  entries: ContentsEntry[];
  className?: string;
}) {
  const key = entries.map((e) => e.id).join("|");
  const ids = useMemo(() => key.split("|"), [key]);
  const active = useActive(ids);
  return (
    <nav aria-label="In this guide" className={className}>
      <p className="mb-3 text-[0.8rem] font-semibold text-ink">In this guide</p>
      <ol className="space-y-px">
        {entries.map((entry) => {
          const on = active === entry.id;
          return (
            <li key={entry.id}>
              <a
                href={`#${entry.id}`}
                onClick={(e) => jumpTo(e, entry.id)}
                aria-current={on ? "location" : undefined}
                className={cn(
                  "block rounded-md px-2.5 py-1.5 text-[0.8rem] leading-snug transition-colors",
                  on
                    ? "bg-cta-soft font-medium text-cta"
                    : "text-muted-foreground hover:bg-ink/[0.03] hover:text-ink",
                )}
              >
                {entry.text}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export function ContentsInline({
  entries,
  className,
}: {
  entries: ContentsEntry[];
  className?: string;
}) {
  return (
    <details className={cn("group rounded-xl border border-ink/[0.08] bg-white", className)}>
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3.5 text-[0.9rem] font-semibold text-ink [&::-webkit-details-marker]:hidden">
        <span>
          In this guide
          <span className="ml-2 font-medium text-muted-foreground">{entries.length} parts</span>
        </span>
        <ChevronDown
          aria-hidden
          className="h-4 w-4 text-muted-foreground transition-transform group-open:rotate-180"
        />
      </summary>
      <ol className="space-y-px px-2 pb-3">
        {entries.map((entry) => (
          <li key={entry.id}>
            <a
              href={`#${entry.id}`}
              onClick={(e) => jumpTo(e, entry.id)}
              className="block rounded-md px-2.5 py-2 text-[0.86rem] leading-snug text-ink/75 hover:bg-ink/[0.03] hover:text-ink"
            >
              {entry.text}
            </a>
          </li>
        ))}
      </ol>
    </details>
  );
}

/* Under the rail. Says what Rankbox does, and nothing it doesn't. */
export function RailOffer() {
  return (
    <div className="rounded-xl border border-ink/[0.08] bg-white p-4">
      <p className="font-display text-[0.98rem] font-medium leading-snug tracking-[-0.015em] text-ink">
        Write the pages Claude can quote
      </p>
      <p className="mt-1.5 text-[0.78rem] leading-relaxed text-muted-foreground">
        Rankbox researches your buyers' questions and publishes source-backed, answer-first articles
        on a schedule.
      </p>
      <a
        href="/auth"
        className="group mt-4 flex h-9 items-center justify-center gap-1.5 rounded-lg bg-cta px-3 text-[0.82rem] font-semibold text-white transition-colors hover:bg-cta-hover focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cta/25"
      >
        Start free trial
        <ArrowRight
          aria-hidden
          className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
        />
      </a>
      <p className="mt-2 text-center text-[0.7rem] text-muted-foreground">{TRIAL_NOTE}</p>
    </div>
  );
}
