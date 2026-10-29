import { ArrowDown } from "lucide-react";
import { EMAIL } from "./content";

/**
 * The hero's picture: the question a client sends their agency, as an email.
 * A fictional client and agency, labelled as a sample. The reply chip jumps
 * to the scope, which is the answer.
 */
export function ClientEmail() {
  return (
    <figure
      aria-label={EMAIL.label}
      className="relative mx-auto w-full max-w-md lg:mx-0 lg:max-w-none"
    >
      <div className="relative">
        {/* A second message tucked behind, so it reads as an inbox, not a card. */}
        <div
          aria-hidden
          className="absolute inset-x-6 -top-3 bottom-3 rounded-2xl border border-border bg-card/70"
        />
        <div className="relative rounded-2xl border border-border bg-card p-5 shadow-lg shadow-ink/[0.04] sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <span
                aria-hidden
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-border bg-surface text-sm font-semibold text-ink"
              >
                {EMAIL.initial}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-ink">{EMAIL.from}</p>
                <p className="truncate text-xs text-muted-foreground">{EMAIL.to}</p>
              </div>
            </div>
            <span className="shrink-0 rounded-full border border-border px-2 py-0.5 text-[0.68rem] font-medium uppercase tracking-wide text-muted-foreground">
              {EMAIL.sample}
            </span>
          </div>

          <p className="mt-5 text-[1.05rem] font-semibold tracking-tight text-ink">
            {EMAIL.subject}
          </p>
          <p className="mt-2 text-pretty text-[0.94rem] leading-relaxed text-muted-foreground">
            {EMAIL.body}
          </p>
        </div>
      </div>

      <figcaption className="relative mt-4 flex justify-end">
        <a
          href="#scope"
          className="inline-flex items-center gap-1.5 rounded-full border border-cta/20 bg-cta-soft px-3.5 py-1.5 text-[0.8rem] font-medium text-cta transition-colors hover:border-cta/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta focus-visible:ring-offset-2"
        >
          {EMAIL.reply}
          <ArrowDown aria-hidden className="h-3.5 w-3.5" />
        </a>
      </figcaption>
    </figure>
  );
}
