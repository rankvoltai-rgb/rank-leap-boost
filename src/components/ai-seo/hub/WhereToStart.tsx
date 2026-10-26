/**
 * "Where to start", as three steps down a left rail, each with the thing you
 * need for it on the right: one robots.txt for every engine that documents a
 * token, then reach and measurable referrals for the frontier five, then the
 * situations that make each of the other six worth a guide. A blue trial
 * band closes it.
 */
import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Compass, FileCode2 } from "lucide-react";
import { EngineMark, EngineTile, Md } from "@/components/ai-seo/kit";
import { Accent, Band, CELL, CellGrid, LINE, PANEL } from "@/components/landing/frame";
import { getEngine } from "@/data/ai-seo/engines";
import { OVERVIEW } from "@/data/ai-seo/overview";
import { cn } from "@/lib/utils";
import { HubHead, TrialButton } from "./shared";

const S = OVERVIEW.start;

function Step({
  n,
  children,
  aside,
}: {
  n: number;
  children: ReactNode;
  /** The step's title and body, on the left rail. */
  aside: { title: string; body: string };
}) {
  return (
    <Band>
      <div className="grid lg:grid-cols-[19rem_1fr]">
        <div
          className={cn(
            "border-b px-6 py-8 sm:px-10 lg:border-b-0 lg:border-r lg:px-10 lg:py-10",
            LINE,
          )}
        >
          <div className="lg:sticky lg:top-24">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-cta font-mono text-[0.8rem] font-semibold text-white">
              {n}
            </span>
            <h3 className="mt-4 font-display text-[1.3rem] font-medium leading-snug tracking-[-0.02em] text-ink">
              {aside.title}
            </h3>
            <p className="mt-2 text-[0.92rem] leading-relaxed text-muted-foreground">
              <Md text={aside.body} />
            </p>
          </div>
        </div>
        <div className="min-w-0">{children}</div>
      </div>
    </Band>
  );
}

/* ---------- step 1: one robots.txt ---------- */

function RobotsStarter() {
  return (
    <div className="px-6 py-8 sm:px-10 lg:px-10 lg:py-10">
      <figure className="overflow-hidden rounded-xl border border-ink/[0.08] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
        <figcaption
          className={cn(
            "flex items-center gap-2 border-b px-4 py-2.5 font-mono text-[0.74rem] text-muted-foreground",
            LINE,
            PANEL,
          )}
        >
          <FileCode2 aria-hidden className="h-3.5 w-3.5 text-cta" />
          {S.robots.caption}
        </figcaption>
        <pre className="overflow-x-auto px-4 py-4 font-mono text-[0.8rem] leading-[1.7] text-ink">
          <code>
            {S.robots.code.split("\n").map((line, i) => (
              <span
                key={i}
                className={cn(
                  "block",
                  line.startsWith("#") && "text-muted-foreground",
                  line.startsWith("Allow") && "text-cta",
                )}
              >
                {line || " "}
              </span>
            ))}
          </code>
        </pre>
      </figure>
      <p className="mt-4 max-w-2xl text-[0.88rem] leading-relaxed text-muted-foreground [&_code]:text-[0.78rem]">
        <Md text={S.robots.note} />
      </p>
    </div>
  );
}

/* ---------- step 2: reach and referrals ---------- */

function Reach() {
  return (
    <div className="px-6 py-8 sm:px-10 lg:px-10 lg:py-10">
      <h4 className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        Reach
      </h4>
      <ul className="mt-4">
        {S.reach.map((r, i) => {
          const e = getEngine(r.slug)!;
          return (
            <li
              key={r.slug}
              className={cn("flex items-start gap-3 py-3.5", i > 0 && "border-t", LINE)}
            >
              <EngineTile engine={e} className="mt-0.5 h-8 w-8 rounded-lg" />
              <div className="min-w-0">
                <p className="text-[0.9rem] leading-snug text-ink">
                  <span className="font-display text-[1.25rem] font-semibold tracking-tight">
                    {r.value}
                  </span>{" "}
                  <span className="text-muted-foreground">{r.label}</span>
                </p>
                <a
                  href={r.source.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-0.5 inline-block text-[0.74rem] text-muted-foreground underline decoration-ink/20 underline-offset-2 hover:text-cta"
                >
                  {e.shortName} · {r.source.name}
                </a>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function Referrals() {
  const r = S.referrals;
  return (
    <figure className="px-6 py-8 sm:px-10 lg:px-10 lg:py-10">
      <figcaption className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        {r.title}
      </figcaption>
      <ul className="mt-5 space-y-4">
        {r.rows.map((row) => {
          const e = getEngine(row.slug)!;
          return (
            <li key={row.slug} className="group" title={`${e.name}: ${row.share}%`}>
              <div className="flex items-center justify-between gap-3 text-[0.84rem]">
                <span className="flex items-center gap-2 font-medium text-ink">
                  <EngineMark mark={e.mark} className="h-3.5 w-3.5" />
                  {e.shortName}
                </span>
                <span className="font-mono text-[0.8rem] tabular-nums text-ink">
                  {row.share.toFixed(1)}%
                </span>
              </div>
              <div className="mt-1.5 h-2 w-full bg-ink/[0.05]">
                <div
                  className="h-full rounded-r-[4px] bg-cta transition-[filter] group-hover:brightness-110"
                  style={{ width: `${row.share}%` }}
                />
              </div>
            </li>
          );
        })}
      </ul>
      <p className="mt-5 text-[0.8rem] leading-relaxed text-muted-foreground">
        <Md text={r.note} />{" "}
        <a
          href={r.source.href}
          target="_blank"
          rel="noopener noreferrer"
          className="underline decoration-ink/20 underline-offset-2 hover:text-cta"
        >
          Source: {r.source.name}
        </a>
      </p>
    </figure>
  );
}

/* ---------- step 3: the other six ---------- */

function Situations() {
  return (
    <CellGrid className="sm:grid-cols-2">
      {S.situations.map((s) => {
        const e = getEngine(s.slug)!;
        return (
          <li key={s.slug} className={CELL}>
            <Link
              to="/ai-seo/$engine"
              params={{ engine: s.slug }}
              className="group flex h-full flex-col p-6 transition-colors duration-300 hover:bg-[color-mix(in_oklab,var(--surface)_35%,white)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-cta/40 sm:p-7"
            >
              <span className="flex items-center gap-2.5">
                <EngineTile engine={e} className="h-8 w-8 rounded-lg" />
                <span className="text-[0.95rem] font-semibold text-ink">{e.name}</span>
              </span>
              <span className="mt-4 text-[0.72rem] font-medium uppercase tracking-[0.12em] text-cta">
                If
              </span>
              <span className="mt-1 text-[0.98rem] font-medium leading-snug text-ink">
                {s.when}
              </span>
              <span className="mt-2 flex-1 text-[0.88rem] leading-relaxed text-muted-foreground [&_code]:text-[0.78rem]">
                <Md text={s.why} />
              </span>
              <span className="mt-4 inline-flex items-center gap-1.5 text-[0.84rem] font-semibold text-cta">
                Read the {e.shortName} guide
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" />
              </span>
            </Link>
          </li>
        );
      })}
    </CellGrid>
  );
}

export function WhereToStart() {
  return (
    <section id="start" aria-labelledby="start-title" className="scroll-mt-16">
      <HubHead
        id="start-title"
        icon={Compass}
        eyebrow="Where to start"
        title={
          <>
            {S.title.lead} <Accent>{S.title.accent}</Accent>
          </>
        }
        subtitle={<Md text={S.intro} />}
      />
      <Step n={1} aside={S.steps[0]}>
        <RobotsStarter />
      </Step>
      <Step n={2} aside={S.steps[1]}>
        <div className="grid xl:grid-cols-2">
          <div className={cn("border-b xl:border-b-0 xl:border-r", LINE)}>
            <Reach />
          </div>
          <Referrals />
        </div>
      </Step>
      <Step n={3} aside={S.steps[2]}>
        <Situations />
      </Step>
      <Band
        inner={cn(
          "flex flex-col items-center gap-6 px-6 py-10 text-center sm:px-10 lg:flex-row lg:justify-between lg:px-12 lg:text-left",
          PANEL,
        )}
      >
        <div className="max-w-xl">
          <p className="font-display text-[1.35rem] font-medium leading-snug tracking-[-0.02em] text-ink">
            {S.rankbox.title}
          </p>
          <p className="mt-2 text-[0.94rem] leading-relaxed text-muted-foreground">
            {S.rankbox.body}
          </p>
        </div>
        <TrialButton className="lg:items-end" />
      </Band>
    </section>
  );
}
