/**
 * The steps, drawn as the line an article travels: written (or imported),
 * scored at the gate, published. The first and last stations are the
 * neighbouring features and link to them; the middle one is this page.
 *
 * While about half on screen the sample article moves down the line, one
 * station at a time: a draft, then 76 rising to 96 at the gate, then
 * published. With reduced motion every station shows its finished state.
 */
import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { ArrowRight, ArrowUpRight, FileText, Upload, Wand2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { getFeature, type Feature } from "@/data/features";
import { EASE, useStory } from "./clock";
import { ScoreRing, TextBar } from "./parts";
import { verdict } from "./bands";

const LINE_STORY = [2600, 3000, 3600] as const;

function Station({
  n,
  active,
  here,
  title,
  body,
  picture,
  footer,
}: {
  n: number;
  active: boolean;
  here?: string;
  title: string;
  body: string;
  picture: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex h-full flex-col overflow-hidden rounded-xl border bg-white transition-[border-color,box-shadow] duration-500 motion-reduce:transition-none",
        active
          ? "border-cta/35 shadow-[0_0_0_4px_rgba(22,111,229,0.07),0_24px_48px_-28px_rgba(16,24,40,0.32)]"
          : "border-ink/[0.07] shadow-[0_1px_2px_rgba(16,24,40,0.04),0_16px_36px_-26px_rgba(16,24,40,0.24)]",
      )}
    >
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <span
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-lg text-[0.85rem] font-semibold tabular-nums transition-colors duration-500",
              active ? "bg-cta text-white" : "bg-cta-soft text-cta",
            )}
          >
            {n}
          </span>
          {here && (
            <span
              aria-current="page"
              className="rounded-md bg-cta-soft px-1.5 py-0.5 text-[0.65rem] font-semibold text-cta"
            >
              {here}
            </span>
          )}
        </div>
        <h3 className="mt-5 text-[1.05rem] font-semibold tracking-tight text-ink">{title}</h3>
        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{body}</p>
        <div
          aria-hidden
          className="mt-6 flex-1 rounded-lg border border-ink/[0.06] bg-[color-mix(in_oklab,var(--surface)_70%,white)] p-3.5"
        >
          {picture}
        </div>
      </div>
      {footer}
    </div>
  );
}

function NeighbourLink({ feature, label }: { feature: Feature; label: string }) {
  const Icon = feature.icon;
  return (
    <Link
      to="/features/$slug"
      params={{ slug: feature.slug }}
      className="group flex items-center gap-3 border-t border-ink/[0.07] px-5 py-3.5 transition-colors duration-300 hover:bg-[color-mix(in_oklab,var(--surface)_40%,white)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-cta/40 sm:px-6"
    >
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-ink/[0.08] bg-white text-ink/70 transition-colors group-hover:text-brand-blue">
        <Icon className="h-3.5 w-3.5" />
      </span>
      <span className="min-w-0">
        <span className="block text-[0.68rem] text-muted-foreground">{label}</span>
        <span className="block truncate text-[0.85rem] font-semibold text-ink">{feature.name}</span>
      </span>
      <ArrowUpRight className="ml-auto h-4 w-4 shrink-0 text-muted-foreground/60 transition-[transform,color] duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-blue" />
    </Link>
  );
}

/* The joint between two stations; it pings as the article moves on. */
function Joint({ run, still }: { run: boolean; still: boolean }) {
  return (
    <span
      aria-hidden
      className="absolute left-1/2 top-full z-10 mt-3 flex h-6 w-6 -translate-x-1/2 items-center justify-center rounded-full border border-ink/[0.08] bg-white text-ink/50 shadow-[0_1px_2px_rgba(16,24,40,0.05)] lg:left-full lg:top-[2.35rem] lg:ml-2 lg:mt-0 lg:translate-x-0"
    >
      {run && !still && (
        <motion.span
          className="absolute inset-0 rounded-full bg-cta/30"
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: [0.6, 1.9], opacity: [0.9, 0] }}
          transition={{ duration: 1, ease: EASE }}
        />
      )}
      <ArrowRight className="relative h-3 w-3 rotate-90 lg:rotate-0" />
    </span>
  );
}

export function GateLine({ feature }: { feature: Feature }) {
  const { ref, phase, still } = useStory<HTMLOListElement>(LINE_STORY, 0.35);
  const writer = getFeature("citation-ready-writer");
  const publisher = getFeature("auto-publishing");
  const [write, score, publish] = feature.steps;
  const scored = phase >= 1 ? 96 : 76;
  const live = phase >= 2;

  return (
    <ol ref={ref} className="grid grid-cols-1 gap-12 lg:grid-cols-3 lg:gap-10">
      <li className="relative min-w-0">
        <Station
          n={1}
          active={phase === 0}
          title={write.title}
          body={write.body}
          picture={
            <div>
              <div className="grid grid-cols-2 gap-1 rounded-lg bg-ink/[0.05] p-0.5 text-[0.68rem] font-medium">
                <span className="flex items-center justify-center gap-1 rounded-md bg-white py-1 text-ink shadow-[0_1px_2px_rgba(16,24,40,0.06)]">
                  <Wand2 className="h-3 w-3 text-brand-blue" /> Generate
                </span>
                <span className="flex items-center justify-center gap-1 py-1 text-muted-foreground">
                  <Upload className="h-3 w-3" /> Import
                </span>
              </div>
              <div className="mt-3 rounded-lg border border-ink/[0.07] bg-white p-3">
                <div className="flex items-center gap-1.5">
                  <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="truncate text-[0.72rem] font-semibold text-ink">
                    Kanban vs Scrum: Which Should a…
                  </span>
                </div>
                <TextBar w="92%" className="mt-2.5" />
                <TextBar w="70%" className="mt-1.5" />
                <span className="mt-2.5 inline-flex rounded-md border border-ink/[0.08] px-1.5 py-0.5 text-[0.6rem] font-semibold text-muted-foreground">
                  Draft
                </span>
              </div>
            </div>
          }
          footer={writer && <NeighbourLink feature={writer} label="Drafts come from" />}
        />
        <Joint run={phase === 1} still={still} />
      </li>

      <li className="relative min-w-0">
        <Station
          n={2}
          active={phase === 1}
          here="You're here"
          title={score.title}
          body={score.body}
          picture={
            <div className="flex h-full flex-col justify-center rounded-lg border border-ink/[0.07] bg-white p-3">
              <div className="flex items-center gap-3">
                <ScoreRing score={scored} size={52} still={still} />
                <div className="min-w-0">
                  <p className="truncate text-[0.74rem] font-medium text-ink">{verdict(scored)}</p>
                  <p className="text-[0.66rem] tabular-nums text-muted-foreground">
                    {scored === 96 ? "10" : "6"} of 11 checks passed
                  </p>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-6 gap-1">
                {Array.from({ length: 6 }, (_, i) => (
                  <span
                    key={i}
                    className={cn(
                      "h-1.5 rounded-full transition-colors duration-500",
                      scored === 96 || i >= 4 ? "bg-cta" : "bg-ink/[0.08]",
                    )}
                  />
                ))}
              </div>
              <p className="mt-1.5 text-[0.62rem] tabular-nums text-muted-foreground">
                {scored === 96 ? 6 : 2} of 6 AI signals
              </p>
            </div>
          }
          footer={
            <div className="flex items-center gap-3 border-t border-ink/[0.07] bg-[color-mix(in_oklab,var(--cta)_5%,white)] px-5 py-3.5 sm:px-6">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-cta text-white">
                <feature.icon className="h-3.5 w-3.5" />
              </span>
              <span className="min-w-0">
                <span className="block text-[0.68rem] text-muted-foreground">The gate</span>
                <span className="block truncate text-[0.85rem] font-semibold text-ink">
                  {feature.name}
                </span>
              </span>
            </div>
          }
        />
        <Joint run={phase === 2} still={still} />
      </li>

      <li className="relative min-w-0">
        <Station
          n={3}
          active={phase === 2}
          title={publish.title}
          body={publish.body}
          picture={
            <div className="space-y-1.5">
              {[
                ["kanban-vs-scrum", live ? "Published" : "Scheduled", 96],
                ["async-standups", "Published", 92],
                ["sprint-planning", "Scheduled", 88],
              ].map(([slug, stage, s]) => (
                <div
                  key={slug}
                  className="flex items-center gap-2 rounded-lg border border-ink/[0.07] bg-white px-2.5 py-2"
                >
                  <span className="min-w-0 flex-1 truncate text-[0.7rem] text-ink">
                    <span className="text-muted-foreground">yoursite.com/blog/</span>
                    {slug}
                  </span>
                  <motion.span
                    key={stage as string}
                    initial={
                      still || slug !== "kanban-vs-scrum" || stage !== "Published"
                        ? false
                        : { scale: 0.7, opacity: 0 }
                    }
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 480, damping: 24 }}
                    className={cn(
                      "shrink-0 rounded-md px-1.5 py-0.5 text-[0.6rem] font-semibold",
                      stage === "Published"
                        ? "bg-success/12 text-success"
                        : "border border-ink/[0.08] text-muted-foreground",
                    )}
                  >
                    {stage}
                  </motion.span>
                  <span className="flex shrink-0 items-center gap-1 text-[0.68rem] font-semibold tabular-nums text-ink">
                    <span className="h-1.5 w-1.5 rounded-full bg-success" />
                    {s}
                  </span>
                </div>
              ))}
            </div>
          }
          footer={publisher && <NeighbourLink feature={publisher} label="Then goes live with" />}
        />
      </li>
    </ol>
  );
}
