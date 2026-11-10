/**
 * Small pieces the studio page's sections share: the Studio sign-up link,
 * the Sample tag, the platform logo beside its name, and the blue accent on
 * a title's last words. Hooks and string helpers live in helpers.ts.
 */
import type { MouseEvent } from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Accent } from "@/components/landing/frame";
import { IntegrationLogo } from "@/components/dashboard/integration-logos";
import { STUDIO_SIGNUP_HREF, startStudioSignup } from "@/sublanding/_shared/facts";
import { studiosPage } from "@/data/persona-pages/web-design-studios";
import type { PlatformId } from "@/data/platforms";

/**
 * The page's call to action: sign up and land on Studio once onboarding is
 * done. A real link to /auth?intent=studio, so it works before hydration and
 * in a new tab; a plain click goes through startStudioSignup, which also
 * remembers the intent across the OAuth round trip.
 */
export function StudioLink({
  tone = "blue",
  className,
}: {
  tone?: "blue" | "white";
  className?: string;
}) {
  const go = (e: MouseEvent<HTMLAnchorElement>) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
      return;
    }
    e.preventDefault();
    startStudioSignup();
  };
  return (
    <a
      href={STUDIO_SIGNUP_HREF}
      onClick={go}
      className={cn(
        "group inline-flex h-11 items-center justify-center gap-2 rounded-lg px-5 text-[0.95rem] font-semibold transition-[background-color,transform] duration-200 focus-visible:outline-none focus-visible:ring-4 active:scale-[0.985] motion-reduce:transition-none",
        tone === "blue"
          ? "bg-cta text-white shadow-[0_1px_2px_rgba(16,24,40,0.08),0_8px_20px_-10px_rgba(22,111,229,0.55)] hover:bg-cta-hover focus-visible:ring-cta/25"
          : "bg-white text-cta shadow-[0_1px_2px_rgba(4,24,72,0.2),0_8px_24px_-12px_rgba(4,24,72,0.5)] hover:bg-white/95 focus-visible:ring-white/40",
        className,
      )}
    >
      {studiosPage.cta.primary}
      <ArrowRight
        aria-hidden
        className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none"
      />
    </a>
  );
}

export function SampleTag({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "rounded-md border border-ink/[0.08] bg-white px-1.5 py-px text-[0.58rem] font-semibold uppercase tracking-[0.1em] text-muted-foreground",
        className,
      )}
    >
      {studiosPage.roster.sample}
    </span>
  );
}

/** A platform's logo where its name is written beside it: decorative. */
export function PlatformMark({ id, className }: { id: PlatformId; className?: string }) {
  return (
    <span aria-hidden="true" className="inline-flex shrink-0">
      <IntegrationLogo id={id} title={false} className={className} />
    </span>
  );
}

/** A title with its last `words` words in the blue accent. */
export function AccentLast({ text, words = 2 }: { text: string; words?: number }) {
  const parts = text.split(" ");
  const head = parts.slice(0, -words).join(" ");
  const tail = parts.slice(-words).join(" ");
  return (
    <>
      {head && `${head} `}
      <Accent>{tail}</Accent>
    </>
  );
}
