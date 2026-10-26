/**
 * /alternatives — the hub every comparison page hangs from, in the landing
 * page's frame: hairline rails, a hairline over every band, blank bands
 * between sections.
 *
 * Read top to bottom, it narrows a shortlist: a switchboard to jump straight
 * to one comparison, the whole field on one price axis (the focal map) and
 * in one table, the jobs each tool is best at, then every comparison shelved
 * by kind, how the pages are written, and Rankbox in one line.
 *
 * All copy and numbers come from src/data/alternatives.ts and
 * src/data/competitors/*, or from ./data.ts, which derives from them.
 */
import { Link } from "@tanstack/react-router";
import { ArrowRight, BookOpenCheck, Columns3, LayoutGrid, Route as RouteIcon } from "lucide-react";
import { Reveal } from "@/components/landing/shared";
import {
  Accent,
  Band,
  CELL,
  CellGrid,
  GHOST_BUTTON,
  LINE,
  Pill,
  SectionHead,
  Spacer,
} from "@/components/landing/frame";
import { Mark } from "@/components/brand/Mark";
import { COMPETITORS, RANKBOX_COST, RANKBOX_PUBLISHING } from "@/data/alternatives";
import { PLAN, formatUsd } from "@/data/pricing";
import { cn } from "@/lib/utils";
import { HubHero } from "./hero";
import { FieldMap } from "./field-map";
import { FieldTable } from "./field-table";
import { FitsBoard } from "./fits";
import { Shelves } from "./shelf";
import { HubClosing } from "./closing";
import { PILLARS } from "./data";

/* ---------- the field ---------- */

function FieldSection() {
  return (
    <section aria-labelledby="field-title">
      <Spacer />
      <SectionHead
        id="field"
        icon={Columns3}
        eyebrow="The field at a glance"
        title={
          <span id="field-title">
            {COMPETITORS.length + 1} tools, <Accent>the same five questions</Accent>
          </span>
        }
        subtitle="What it costs, what one article works out at, how it reaches your site, whether it builds links, and whether it tracks AI answers."
      />
      <Band>
        <FieldMap />
      </Band>
      <Band>
        <Reveal>
          <FieldTable />
        </Reveal>
      </Band>
      <Band inner="px-5 py-4 text-center sm:px-8">
        <p className="mx-auto max-w-3xl text-xs leading-relaxed text-muted-foreground">
          Prices are monthly list prices on the plan closest to 30 articles a month for one site,
          taken from each tool&rsquo;s pricing page; every page links its sources. Rankbox rows
          describe what ships today. {RANKBOX_PUBLISHING.sentence}.
        </p>
      </Band>
    </section>
  );
}

/* ---------- which one fits ---------- */

function FitsSection() {
  return (
    <section aria-labelledby="fits-title">
      <Spacer />
      <SectionHead
        icon={RouteIcon}
        eyebrow="Which one fits"
        title={
          <span id="fits-title">
            Start from the job, <Accent>not the tool</Accent>
          </span>
        }
        subtitle={
          <>
            The short version of every page below, including the jobs where we&rsquo;d send you
            somewhere else.
          </>
        }
      />
      <Band>
        <FitsBoard />
      </Band>
    </section>
  );
}

/* ---------- every comparison ---------- */

function ListSection() {
  return (
    <section aria-labelledby="list-title">
      <Spacer />
      <SectionHead
        icon={LayoutGrid}
        eyebrow="Side by side"
        title={
          <span id="list-title">
            Pick the tool you&rsquo;re <Accent>weighing us against</Accent>
          </span>
        }
        subtitle="Each page runs the full matrix, every plan they sell, and the honest case for the other side."
      />
      <Shelves />
    </section>
  );
}

/* ---------- how we write these ---------- */

const ROW_COUNT = COMPETITORS.reduce((n, c) => n + c.matrix.flatMap((g) => g.rows).length, 0);
const SOURCE_COUNT = COMPETITORS.reduce((n, c) => n + c.sources.length, 0);
const BETTER_COUNT = COMPETITORS.reduce((n, c) => n + c.betterWhen.length, 0);

/* One count per promise, each read from the pages themselves. */
const TALLIES = [
  { value: ROW_COUNT, label: `rows asked of both products, across ${COMPETITORS.length} pages` },
  { value: SOURCE_COUNT, label: "sources linked, each on the tool's own site" },
  { value: BETTER_COUNT, label: "cases named where the other tool is the better buy" },
];

function MethodSection() {
  return (
    <section aria-labelledby="method-title">
      <Spacer />
      <SectionHead
        icon={BookOpenCheck}
        eyebrow="How we write these"
        title={
          <span id="method-title">
            A comparison <Accent>you can check</Accent>
          </span>
        }
      />
      <Band>
        <CellGrid className="md:grid-cols-3">
          {PILLARS.map((p, i) => (
            <li key={p.title} className={cn(CELL, "bg-white")}>
              <Reveal className="flex h-full flex-col p-6 sm:p-8" delay={i * 0.06}>
                <span className="text-[0.75rem] font-semibold tabular-nums text-cta">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 text-[1.05rem] font-semibold tracking-tight text-ink">
                  {p.title}
                </h3>
                <p className="mb-7 mt-2 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
                <div className={cn("mt-auto border-t pt-5", LINE)}>
                  <p className="font-display text-[2.4rem] font-medium leading-none tracking-[-0.04em] text-ink tabular-nums">
                    {TALLIES[i].value}
                  </p>
                  <p className="mt-2 text-[0.8rem] leading-snug text-muted-foreground">
                    {TALLIES[i].label}
                  </p>
                </div>
              </Reveal>
            </li>
          ))}
        </CellGrid>
      </Band>
    </section>
  );
}

/* ---------- the one-line answer ---------- */

/* The mark as a pill icon; the pill's own label names it. */
function MarkIcon({ className }: { className?: string }) {
  return (
    <span aria-hidden className="contents">
      <Mark className={className} />
    </span>
  );
}

function SummarySection() {
  return (
    <section aria-labelledby="summary-title">
      <Spacer />
      <Band inner="px-5 py-14 sm:px-8 sm:py-20">
        <Reveal className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <Pill icon={MarkIcon}>Rankbox</Pill>
          <h2
            id="summary-title"
            className="mt-5 text-balance font-display text-[1.9rem] font-medium leading-[1.12] tracking-[-0.03em] text-ink sm:text-[2.4rem]"
          >
            What Rankbox is, <Accent>in one line</Accent>
          </h2>
          <p className="mt-5 text-balance text-[1.05rem] leading-relaxed text-muted-foreground sm:text-[1.15rem]">
            Rankbox is an AI search growth engine for one site: it finds the questions your buyers
            ask ChatGPT, Perplexity, and Google, writes source-backed articles in your brand voice,
            checks them for SEO, delivers them on your cadence, trades backlinks, and drafts your
            Reddit replies, for {formatUsd(PLAN.monthly)} a month and {PLAN.articlesPerMonth}{" "}
            articles, about {formatUsd(RANKBOX_COST.perArticle)} each.
          </p>
          <Link to="/features" className={cn(GHOST_BUTTON, "group mt-8")}>
            See how the engine works
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </Reveal>
      </Band>
    </section>
  );
}

export function AlternativesHubPage() {
  return (
    <>
      <HubHero />
      <FieldSection />
      <FitsSection />
      <ListSection />
      <MethodSection />
      <SummarySection />
      <HubClosing />
    </>
  );
}
