/**
 * The split the hub exists to make: what you do once for every engine, and
 * what you have to look up per engine. Left, the six shared moves, each with
 * how sure the evidence is. Right, on the grey panel, the seven matrix rows,
 * so the "per engine" half points straight back at the table.
 */
import type { ComponentType } from "react";
import {
  ArrowUp,
  BarChart3,
  Bot,
  Code2,
  Database,
  Layers,
  Quote,
  ShieldOff,
  Target,
} from "lucide-react";
import { EvidenceBadge, Md } from "@/components/ai-seo/kit";
import { Accent, Band, LINE, PANEL } from "@/components/landing/frame";
import { OVERVIEW, PROFILE_ROWS } from "@/data/ai-seo/overview";
import type { EngineProfile } from "@/data/ai-seo/types";
import { cn } from "@/lib/utils";
import { HubHead } from "./shared";

const F = OVERVIEW.foundations;

/* Structural: one icon per matrix row. */
const ROW_ICON: Record<keyof EngineProfile, ComponentType<{ className?: string }>> = {
  retrieval: Database,
  searchCrawler: Bot,
  trainingCrawler: ShieldOff,
  rendersJs: Code2,
  referrer: BarChart3,
  citationStyle: Quote,
  biggestLever: Target,
};

export function Foundations() {
  return (
    <section id="foundations" aria-labelledby="foundations-title" className="scroll-mt-16">
      <HubHead
        id="foundations-title"
        icon={Layers}
        eyebrow="Shared and specific"
        title={
          <>
            {F.title.lead} <Accent>{F.title.accent}</Accent>
          </>
        }
        subtitle={<Md text={F.intro} />}
      />
      <Band>
        <div className="grid lg:grid-cols-[1.35fr_1fr]">
          <div className={cn("border-b lg:border-b-0 lg:border-r", LINE)}>
            <h3 className="px-6 pt-8 text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-cta sm:px-10 lg:px-12 lg:pt-10">
              {F.onceTitle}
            </h3>
            <ol className="px-6 pb-4 sm:px-10 lg:px-12">
              {F.once.map((item, i) => (
                <li
                  key={item.title}
                  className={cn(
                    "grid grid-cols-[2rem_1fr] gap-x-3 py-6",
                    i > 0 && "border-t",
                    LINE,
                  )}
                >
                  <span className="pt-0.5 font-mono text-[0.78rem] font-medium text-cta">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                      <h4 className="text-[1.02rem] font-semibold tracking-tight text-ink">
                        {item.title}
                      </h4>
                      <EvidenceBadge evidence={item.evidence} />
                    </div>
                    <p className="mt-2 text-[0.92rem] leading-relaxed text-muted-foreground [&_code]:text-[0.8rem]">
                      <Md text={item.body} />
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className={cn("px-6 py-8 sm:px-10 lg:px-10 lg:py-10", PANEL)}>
            <div className="lg:sticky lg:top-24">
              <h3 className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-cta">
                {F.perEngineTitle}
              </h3>
              <p className="mt-3 text-[0.92rem] leading-relaxed text-muted-foreground">
                <Md text={F.perEngineIntro} />
              </p>
              <ul className="mt-6 space-y-2">
                {PROFILE_ROWS.map((row) => {
                  const Icon = ROW_ICON[row.key];
                  return (
                    <li
                      key={row.key}
                      className="flex items-center gap-3 rounded-lg border border-ink/[0.07] bg-white px-3 py-2.5 shadow-[0_1px_2px_rgba(16,24,40,0.03)]"
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-cta-soft text-brand-blue">
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-[0.88rem] font-medium leading-snug text-ink">
                          {row.label}
                        </span>
                        <span className="block text-[0.78rem] leading-snug text-muted-foreground">
                          {row.why}
                        </span>
                      </span>
                    </li>
                  );
                })}
              </ul>
              <a
                href="#compare"
                className="group mt-6 inline-flex items-center gap-1.5 text-[0.88rem] font-semibold text-cta hover:text-cta-hover"
              >
                Look them up in the matrix
                <ArrowUp className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 motion-reduce:transition-none" />
              </a>
            </div>
          </div>
        </div>
      </Band>
    </section>
  );
}
