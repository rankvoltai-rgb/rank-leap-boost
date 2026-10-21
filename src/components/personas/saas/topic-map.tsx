/**
 * The sample topic map, the centre of a business page: the four stages of a
 * buyer's path laid left to right as one window on the grey panel, each
 * question a row the visitor can approve or hold, because nothing is written
 * until someone approves it. Under it, the persona's own note saying whose
 * map this is, and the three places the articles ship to.
 *
 * Every question is plain text in the server HTML. The approvals are local
 * state with a fixed first frame, so server and client agree.
 */
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Check, ChevronRight, Map as MapIcon } from "lucide-react";
import { Reveal } from "@/components/landing/shared";
import { Band, LINE, LINE_FILL, PANEL, SectionHead, Spacer } from "@/components/landing/frame";
import { IntegrationGlyph } from "@/components/integrations/visuals";
import { getIntegration } from "@/data/integrations";
import type { Persona, PersonaTopics } from "@/data/personas";
import { cn } from "@/lib/utils";
import { TRIAL_NOTE } from "@/components/features/FeatureSections";
import { Accented, IntentChip, SampleTag, SiteTile } from "./parts";
import { SAMPLE_DOMAIN, SCREEN, SOLID_BUTTON, stageTint } from "./tokens";

/* Approved on first paint: the first question of each stage, and one more
   where buyers start, so the window opens part-way through a review. */
const FIRST_APPROVED = new Set(["0-0", "0-1", "1-0", "2-0", "3-0"]);

function MapWindow({ topics }: { topics: PersonaTopics }) {
  const [approved, setApproved] = useState<Set<string>>(() => new Set(FIRST_APPROVED));
  const count = topics.clusters.reduce((n, c) => n + c.questions.length, 0);
  const toggle = (id: string) =>
    setApproved((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  return (
    <div className={cn(SCREEN, "overflow-hidden")}>
      {/* Window header: the sample site, and where the review stands. */}
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-ink/[0.07] px-4 py-3.5 sm:px-5">
        <div className="flex min-w-0 items-center gap-2.5">
          <SiteTile />
          <div className="min-w-0 leading-tight">
            <p className="truncate text-[0.85rem] font-semibold text-ink">{SAMPLE_DOMAIN}</p>
            <p className="truncate text-[0.7rem] text-muted-foreground">
              Answer-space map · {count} questions · {topics.clusters.length} stages
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <span
            aria-live="polite"
            className="rounded-md bg-cta-soft px-2 py-0.5 text-[0.7rem] font-semibold tabular-nums text-cta"
          >
            {approved.size} of {count} approved
          </span>
          <SampleTag />
        </div>
      </div>

      {/* The path, left to right. */}
      {/* Always four stages (personas.test.ts), so the hairline fill never
          shows through an empty cell: a column on phones, two by two on
          tablets, one row on desktop. */}
      <ol className={cn("grid gap-px md:grid-cols-2 lg:grid-cols-4", LINE_FILL)}>
        {topics.clusters.map((c, ci) => {
          const tint = stageTint(ci);
          const last = ci === topics.clusters.length - 1;
          return (
            <li key={c.stage} className="relative flex flex-col bg-white">
              <span aria-hidden className="h-[2px] opacity-80" style={{ background: tint.dot }} />
              <div className="px-4 pb-3 pt-4 sm:px-5">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[0.68rem] font-medium tabular-nums text-muted-foreground">
                    {String(ci + 1).padStart(2, "0")}
                  </span>
                  <IntentChip index={ci}>{c.intent}</IntentChip>
                </div>
                <h3 className="mt-2 text-[0.98rem] font-semibold tracking-tight text-ink">
                  {c.stage}
                </h3>
              </div>
              <ul className="flex-1 space-y-1.5 px-3 pb-4 sm:px-4 sm:pb-5">
                {c.questions.map((q, qi) => {
                  const id = `${ci}-${qi}`;
                  const on = approved.has(id);
                  return (
                    <li key={q}>
                      <button
                        type="button"
                        aria-pressed={on}
                        onClick={() => toggle(id)}
                        className={cn(
                          "group flex w-full cursor-pointer items-start gap-2.5 rounded-lg border px-2.5 py-2.5 text-left text-[0.82rem] leading-snug transition-[background-color,border-color,color] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta/40",
                          on
                            ? "border-cta/20 bg-[color-mix(in_oklab,var(--cta)_6%,white)] text-ink"
                            : "border-ink/[0.07] bg-white text-ink/75 hover:border-ink/[0.14] hover:text-ink",
                        )}
                      >
                        <span
                          aria-hidden
                          className={cn(
                            "mt-px flex h-4 w-4 shrink-0 items-center justify-center rounded-[5px] border transition-colors duration-200",
                            on
                              ? "border-cta bg-cta text-white"
                              : "border-ink/[0.18] bg-white text-transparent group-hover:border-cta/50",
                          )}
                        >
                          <Check className="h-2.5 w-2.5" strokeWidth={3.2} />
                        </span>
                        {q}
                      </button>
                    </li>
                  );
                })}
              </ul>
              {/* A joint on the hairline to the next stage. */}
              {!last && (
                <span
                  aria-hidden
                  className="absolute -right-3 top-[1.55rem] z-10 hidden h-6 w-6 items-center justify-center rounded-full border border-ink/[0.08] bg-white text-muted-foreground shadow-[0_1px_2px_rgba(16,24,40,0.05)] lg:flex"
                >
                  <ChevronRight className="h-3 w-3" />
                </span>
              )}
            </li>
          );
        })}
      </ol>

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-ink/[0.07] bg-[color-mix(in_oklab,var(--surface)_55%,white)] px-4 py-2.5 text-[0.72rem] text-muted-foreground sm:px-5">
        <span>Select a question to approve it or hold it back.</span>
        <span className="tabular-nums">
          {count - approved.size} held · {approved.size} approved
        </span>
      </div>
    </div>
  );
}

export function SaasTopicMap({ persona }: { persona: Persona }) {
  const topics = persona.topics;
  if (!topics) return null;

  return (
    <section id="topics" className="scroll-mt-16">
      <Spacer />
      <SectionHead
        icon={MapIcon}
        eyebrow="Sample topic map"
        title={<Accented text={topics.title} words={4} />}
        subtitle={topics.intro}
      />

      <Band inner={PANEL}>
        <div className="px-3 py-8 sm:px-8 sm:py-12 lg:px-10 lg:py-14">
          <Reveal y={24}>
            <MapWindow topics={topics} />
          </Reveal>
          <p className="mx-auto mt-5 max-w-2xl text-balance text-center text-[0.8rem] leading-relaxed text-muted-foreground">
            {topics.note}
          </p>
        </div>
      </Band>

      {/* Where the approved questions ship to. */}
      <Band>
        <div className="grid sm:grid-cols-3 lg:grid-cols-[1.2fr_repeat(3,1fr)]">
          <div
            className={cn(
              "flex flex-col justify-center border-b px-6 py-6 sm:col-span-3 sm:px-8 lg:col-span-1 lg:border-b-0 lg:border-r",
              LINE,
            )}
          >
            <h3 className="text-[1.05rem] font-semibold tracking-tight text-ink">
              {topics.platformsTitle}
            </h3>
          </div>
          {topics.platforms.map(({ slug, why }, i) => {
            const integration = getIntegration(slug);
            if (!integration) return null;
            const lastCell = i === topics.platforms.length - 1;
            return (
              <Link
                key={slug}
                to="/integrations/$slug"
                params={{ slug }}
                className={cn(
                  "group flex items-start gap-3.5 px-6 py-6 transition-colors duration-300 hover:bg-[color-mix(in_oklab,var(--surface)_35%,white)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-cta/40 sm:flex-col sm:px-7",
                  !lastCell && "border-b sm:border-b-0 sm:border-r",
                  LINE,
                )}
              >
                <IntegrationGlyph integration={integration} className="h-9 w-9 shrink-0" />
                <div className="min-w-0">
                  <p className="flex items-center gap-1.5 text-[0.92rem] font-semibold text-ink">
                    {integration.name}
                    <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/70 transition-[transform,color] duration-200 group-hover:translate-x-0.5 group-hover:text-brand-blue" />
                  </p>
                  <p className="mt-1 text-[0.84rem] leading-snug text-muted-foreground">{why}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </Band>

      <Band inner="flex flex-col items-center gap-3 px-5 py-10 text-center">
        <a href="/auth" className={SOLID_BUTTON}>
          Start your free trial
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </a>
        <p className="text-[0.82rem] text-muted-foreground">{TRIAL_NOTE}</p>
      </Band>
    </section>
  );
}
