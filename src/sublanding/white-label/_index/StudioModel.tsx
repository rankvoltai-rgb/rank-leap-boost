import { cn } from "@/lib/utils";
import { MODEL } from "./content";
import { Diorama } from "./Diorama";
import { SectionHead } from "./SectionHead";
import { SECTION, WRAP } from "./ui";

/**
 * One account, one site per client: the clickable dashboard, then three
 * short lists of what's per site, what's shared, and the rules that follow
 * the account owner across every site.
 */
export function StudioModel() {
  const lists = [
    { title: MODEL.perSiteTitle, items: MODEL.perSite },
    { title: MODEL.sharedTitle, items: MODEL.shared },
    { title: MODEL.rulesTitle, items: MODEL.rules },
  ];
  return (
    <section id="studio" aria-labelledby="studio-title" className={cn(SECTION, "bg-surface")}>
      <div className={WRAP}>
        <SectionHead id="studio" kicker={MODEL.kicker} intro={MODEL.intro} />
        <div className="mt-12">
          <Diorama />
        </div>
        <p className="mt-6 max-w-2xl text-[0.92rem] leading-relaxed text-muted-foreground">
          {MODEL.addressNote}
        </p>

        <div className="mt-12 grid gap-10 border-t border-border pt-10 md:grid-cols-3 md:gap-8">
          {lists.map((l) => (
            <div key={l.title}>
              <h3 className="text-[0.98rem] font-semibold text-ink">{l.title}</h3>
              <ul className="mt-3 space-y-2.5">
                {l.items.map((item) => (
                  <li key={item} className="flex gap-2.5 text-[0.9rem] leading-relaxed text-ink/80">
                    <span aria-hidden className="mt-[0.6em] h-1 w-1 shrink-0 rounded-full bg-cta" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
