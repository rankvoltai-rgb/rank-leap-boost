import { SCOPE } from "./content";
import { Heading } from "./Heading";
import { ScopeSheet, ViewSwitch, useScopeView } from "./ScopeSheet";

/** Section 1: the deliverable itself, the answer to the hero's email. */
export function Scope() {
  const [view, setView] = useScopeView();
  return (
    <section
      id="scope"
      aria-labelledby="scope-title"
      className="scroll-mt-24 border-t border-border py-20 sm:py-28"
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <Heading id="scope" intro={SCOPE.intro} />
          <ViewSwitch view={view} onChange={setView} />
        </div>
        <div className="mt-10 sm:mt-12">
          <ScopeSheet view={view} />
        </div>
        <p className="mt-4 text-center text-xs text-muted-foreground">{SCOPE.caption}</p>
      </div>
    </section>
  );
}
