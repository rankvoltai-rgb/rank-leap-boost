/**
 * The small components /use-cases/multi-brand-companies is built from: a
 * sample brand's mark, the Sample tag, and the Studio sign-up as a link and
 * as a URL form. Words come from the page's data file; these only set them.
 */
import { useState, type FormEvent, type MouseEvent } from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Accent } from "@/components/landing/frame";
import { STUDIO_SIGNUP_HREF, startStudioSignup } from "@/sublanding/_shared/facts";
import { multiBrand } from "@/data/persona-pages/multi-brand-companies";
import { LOOKS } from "./looks";

/** A title with its last `words` words in the blue accent. */
export function Accented({ text, words }: { text: string; words: number }) {
  const parts = text.split(" ");
  if (parts.length <= words) return <Accent>{text}</Accent>;
  return (
    <>
      {parts.slice(0, -words).join(" ")} <Accent>{parts.slice(-words).join(" ")}</Accent>
    </>
  );
}

export function BrandMark({ index, className }: { index: number; className?: string }) {
  const look = LOOKS[index % LOOKS.length];
  const Icon = look.icon;
  return (
    <span
      aria-hidden
      className={cn("flex shrink-0 items-center justify-center rounded-lg", className)}
      style={{ background: look.tile, color: look.ink }}
    >
      <Icon className="h-[48%] w-[48%]" strokeWidth={2.2} />
    </span>
  );
}

export function SampleTag({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 rounded-md border border-ink/[0.08] bg-white px-1.5 py-px text-[0.58rem] font-semibold uppercase tracking-[0.1em] text-muted-foreground",
        className,
      )}
    >
      Sample
    </span>
  );
}

/* ---------- The Studio sign-up ---------- */

const SOLID =
  "group inline-flex h-12 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-cta px-6 text-[0.95rem] font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.16),0_1px_2px_rgba(16,24,40,0.14)] transition-[background-color,transform] duration-150 hover:bg-cta-hover active:scale-[0.985] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cta/25 motion-reduce:transition-none";

const WHITE =
  "group inline-flex h-12 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-white px-6 text-[0.95rem] font-semibold text-cta shadow-[0_1px_2px_rgba(4,24,72,0.2),0_12px_30px_-14px_rgba(4,24,72,0.6)] transition-[background-color,transform] duration-150 hover:bg-[#f2f7ff] active:scale-[0.985] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/40 motion-reduce:transition-none";

/**
 * The page's call to action: sign up and land on Studio after onboarding. A
 * real link to /auth?intent=studio, so it works before hydration and in a new
 * tab; a plain click goes through startStudioSignup, which also remembers the
 * intent across the OAuth round trip.
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
      className={cn(tone === "white" ? WHITE : SOLID, className)}
    >
      {multiBrand.cta.label}
      <ArrowRight
        aria-hidden
        className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none"
      />
    </a>
  );
}

/**
 * The same sign-up with the first brand's site carried through, the way the
 * landing hero carries a URL. Without JavaScript the form still submits to
 * /auth?intent=studio&url=….
 */
export function StudioForm({ className }: { className?: string }) {
  const [url, setUrl] = useState("");
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    startStudioSignup(url);
  };
  return (
    <form
      action="/auth"
      method="get"
      onSubmit={submit}
      className={cn("group flex w-full flex-col gap-2.5 sm:flex-row", className)}
    >
      <input type="hidden" name="intent" value="studio" />
      <label className="flex h-12 min-w-0 cursor-text items-center gap-2.5 rounded-lg border border-ink/[0.1] bg-white px-3.5 shadow-[0_1px_2px_rgba(16,24,40,0.04)] transition-[border-color,box-shadow] duration-200 focus-within:border-cta/50 focus-within:shadow-[0_0_0_4px_color-mix(in_oklab,var(--cta)_12%,transparent)] hover:border-ink/[0.16] sm:flex-1">
        <span aria-hidden className="flex h-5 w-5 shrink-0 items-center justify-center">
          <span className="h-2 w-2 rounded-full bg-cta shadow-[0_0_0_3px_var(--cta-soft)]" />
        </span>
        <input
          type="text"
          name="url"
          inputMode="url"
          autoComplete="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder={multiBrand.cta.field}
          aria-label={multiBrand.cta.field}
          className="w-full min-w-0 text-ellipsis bg-transparent text-[0.95rem] text-ink outline-none placeholder:text-muted-foreground"
        />
      </label>
      <button type="submit" className={SOLID}>
        {multiBrand.cta.label}
        <ArrowRight
          aria-hidden
          className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none"
        />
      </button>
    </form>
  );
}
