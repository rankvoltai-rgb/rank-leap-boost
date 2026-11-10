/**
 * The sample topic map, drawn the way a studio plans a site: as a sitemap.
 * Home, then the blog collection the studio designed, then one branch per
 * stage of the client's buyer, with each question as a page and its path.
 *
 * Questions only: a volume or a score beside them would be invented data.
 * The client is fictional and the window says Sample. At lg the branches
 * hang from one bus; below it they stack as an indented tree. Hovering a
 * branch selects it in the landing's soft blue. Nothing moves on its own.
 */
import type { PersonaTopics } from "@/data/personas";
import { getIntegration } from "@/data/integrations";
import { studiosPage } from "@/data/persona-pages/web-design-studios";
import { cn } from "@/lib/utils";
import { House, Network } from "lucide-react";
import { PlatformMark, SampleTag } from "./parts";
import { slugify } from "./helpers";

const S = studiosPage.sitemap;
const WIRE = "bg-ink/[0.14]";

export function SitemapWindow({ topics }: { topics: PersonaTopics }) {
  const builtOn = getIntegration(topics.platforms[0]?.slug ?? "");
  const pages = topics.clusters.reduce((sum, c) => sum + c.questions.length, 0);

  return (
    <div className="overflow-hidden rounded-xl border border-ink/[0.08] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.05),0_30px_60px_-34px_rgba(16,24,40,0.28)]">
      {/* Window bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-ink/[0.07] px-4 py-3 sm:px-5">
        <div className="flex min-w-0 items-center gap-2">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-cta-soft text-brand-blue">
            <Network className="h-3.5 w-3.5" />
          </span>
          <span className="text-[0.86rem] font-semibold text-ink">{S.title}</span>
          <span className="truncate font-mono text-[0.68rem] text-muted-foreground">
            {topics.domain}
          </span>
        </div>
        <SampleTag />
      </div>

      <div className="bg-[radial-gradient(rgba(16,24,40,0.07)_1px,transparent_1px)] px-4 pb-6 pt-6 [background-size:16px_16px] sm:px-6 sm:pb-8 lg:px-8">
        {/* Home */}
        <div className="mx-auto flex w-fit max-w-full items-center gap-3 rounded-xl border border-ink/[0.1] bg-white px-3.5 py-2.5 shadow-[0_1px_2px_rgba(16,24,40,0.05)]">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-ink text-white">
            <House className="h-3.5 w-3.5" />
          </span>
          <div className="min-w-0">
            <p className="text-[0.82rem] font-semibold leading-tight text-ink">
              {topics.brand} · {S.root}
            </p>
            {builtOn?.platform && (
              <p className="mt-0.5 flex items-center gap-1 text-[0.66rem] text-muted-foreground">
                {S.builtOn}
                <PlatformMark id={builtOn.platform} className="h-3.5 w-3.5" />
                {builtOn.name}
              </p>
            )}
          </div>
        </div>
        <span aria-hidden className={cn("mx-auto block h-5 w-px", WIRE)} />

        {/* The collection the studio designed */}
        <div className="mx-auto flex w-fit max-w-full items-center gap-2.5 rounded-xl border border-cta/25 bg-cta-soft px-3.5 py-2 text-cta">
          <span className="font-mono text-[0.8rem] font-semibold">{S.collection}</span>
          <span className="text-[0.7rem] text-cta/80">{S.collectionLabel}</span>
          <span className="rounded-md bg-white px-1.5 py-px text-[0.62rem] font-semibold tabular-nums">
            {pages} {S.pages}
          </span>
        </div>
        <span aria-hidden className={cn("mx-auto block h-5 w-px lg:h-6", WIRE)} />

        {/* One branch per stage */}
        <div className="relative lg:pt-6">
          <span
            aria-hidden
            className={cn("absolute left-[12.5%] right-[12.5%] top-0 hidden h-px lg:block", WIRE)}
          />
          <ul className="grid grid-cols-[minmax(0,1fr)] gap-x-4 gap-y-5 sm:grid-cols-2 lg:grid-cols-4">
            {topics.clusters.map((c) => (
              <li key={c.stage} className="group/branch relative">
                <span
                  aria-hidden
                  className={cn("absolute -top-6 left-1/2 hidden h-6 w-px lg:block", WIRE)}
                />
                <div className="flex items-center justify-between gap-2 rounded-lg border border-ink/[0.1] bg-white px-3 py-2 transition-colors duration-200 group-hover/branch:border-cta/30 group-hover/branch:bg-cta-soft">
                  <span className="text-[0.8rem] font-semibold text-ink">{c.stage}</span>
                  <span className="shrink-0 rounded-md bg-ink/[0.05] px-1.5 py-0.5 text-[0.6rem] font-semibold text-ink/70 transition-colors duration-200 group-hover/branch:bg-white group-hover/branch:text-cta">
                    {c.intent}
                  </span>
                </div>
                <ul className="ml-3 mt-1.5 space-y-1.5 border-l border-ink/[0.12] pl-3 pt-1.5">
                  {c.questions.map((q) => (
                    <li key={q} className="relative">
                      <span
                        aria-hidden
                        className="absolute -left-3 top-1/2 h-px w-3 bg-ink/[0.12]"
                      />
                      <div className="rounded-lg border border-ink/[0.08] bg-white px-2.5 py-2 transition-colors duration-200 group-hover/branch:border-cta/20">
                        <p className="text-[0.76rem] leading-snug text-ink">{q}</p>
                        <p className="mt-1 truncate font-mono text-[0.6rem] text-muted-foreground">
                          {S.collection}/{slugify(q)}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
