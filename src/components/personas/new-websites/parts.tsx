/**
 * Small pieces the /use-cases/new-websites sections share: the accented
 * title, the Sample and Rolling-out tags, the sample site's tile, and the
 * footnote link every third-party fact carries.
 */
import type { ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { Accent } from "@/components/landing/frame";
import { cn } from "@/lib/utils";

/** A title with its last `words` words set in the blue accent. */
export function Accented({ text, words }: { text: string; words: number }) {
  const parts = text.split(" ");
  if (parts.length <= words) return <Accent>{text}</Accent>;
  return (
    <>
      {parts.slice(0, -words).join(" ")} <Accent>{parts.slice(-words).join(" ")}</Accent>
    </>
  );
}

/** Every product screen on this page is a sample, and says so. */
export function SampleTag({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "shrink-0 rounded-md border border-ink/[0.08] bg-white px-1.5 py-px text-[0.58rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground",
        className,
      )}
    >
      Sample
    </span>
  );
}

/** For allowances that exist on the plan but haven't finished shipping. */
export function StatusTag({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-md border border-dashed border-ink/[0.18] bg-white px-1.5 py-0.5 text-[0.66rem] font-semibold text-ink/70",
        className,
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-[#d97706]" />
      {children}
    </span>
  );
}

/** The sample site's letter tile. */
export function SiteTile({ letter, className }: { letter: string; className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#e9f6ee] text-[0.75rem] font-bold text-[#15803d] ring-1 ring-inset ring-[#15803d]/15",
        className,
      )}
    >
      {letter}
    </span>
  );
}

/** A third-party fact's source, opened in a new tab. */
export function SourceLink({
  href,
  children,
  className,
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "font-medium text-ink/70 underline decoration-ink/20 underline-offset-[3px] transition-colors hover:text-brand-blue hover:decoration-brand-blue/40",
        className,
      )}
    >
      {children}
      <ArrowUpRight className="ml-0.5 inline-block h-3 w-3 align-[-1px]" aria-hidden />
    </a>
  );
}
