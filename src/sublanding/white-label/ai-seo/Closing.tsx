import { CLOSING, h2 } from "./content";
import { PageLink } from "./PageLink";
import { StudioButton } from "./StudioButton";

/** Section 8: the close. One action, the trial terms, and where the maths lives. */
export function Closing() {
  return (
    <section
      id="start"
      aria-labelledby="start-title"
      className="scroll-mt-24 border-t border-border px-4 py-20 sm:px-6 sm:py-24"
    >
      <div className="mx-auto max-w-5xl rounded-3xl border border-cta/15 bg-cta-soft px-6 py-14 text-center sm:px-12 sm:py-16">
        <h2
          id="start-title"
          className="mx-auto max-w-2xl text-balance font-display text-[1.9rem] font-semibold leading-[1.1] tracking-[-0.03em] text-ink sm:text-[2.4rem]"
        >
          {h2("start")}
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-pretty leading-relaxed text-muted-foreground">
          {CLOSING.body}
        </p>
        <div className="mt-8 flex justify-center">
          <StudioButton label={CLOSING.cta} pending={CLOSING.pending} />
        </div>
        <p className="mx-auto mt-4 max-w-lg text-pretty text-xs leading-relaxed text-muted-foreground">
          {CLOSING.terms}
        </p>
        <ul className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2">
          {CLOSING.links.map((l) => (
            <li key={l.label}>
              <PageLink
                target={l.target}
                className="rounded-sm text-sm font-medium text-cta hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta"
              >
                {l.label}
              </PageLink>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
