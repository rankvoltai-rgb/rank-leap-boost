/**
 * The page's small pictures: one per pain (in the order of persona.pains) and
 * one per rollout step (in the order of persona.steps). Each is decorative
 * and hidden from assistive tech; the words beside it carry the meaning.
 * Every number is the plan's own (articles a month, the Studio price), never
 * a result.
 */
import type { ReactNode } from "react";
import { ArrowRight, Check, Plus, Search, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { PLAN, STUDIO, TRIAL_ARTICLE_CREDITS, formatUsd } from "@/data/pricing";
import { BRANDS, LOOKS } from "./looks";
import { BrandMark } from "./ui";

const CARD = "rounded-lg border border-ink/[0.07] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.04)]";

/* ---------- Pains ---------- */

/* 1. The flagship takes the content: a shared pool, then a plan per site. */
function ShareBars() {
  const shared = [92, 30, 14, 8];
  return (
    <div className="grid w-full grid-cols-2 gap-3">
      {[
        { label: "Shared", bars: shared, tone: "bg-ink/[0.16]" },
        { label: "Per site", bars: [62, 62, 62, 62], tone: "" },
      ].map((g) => (
        <div key={g.label} className={cn(CARD, "px-2.5 pb-2 pt-2.5")}>
          <div className="flex h-16 items-end justify-between gap-1.5">
            {g.bars.map((h, i) => (
              <span
                key={i}
                className={cn("block w-full rounded-t-[3px]", g.tone)}
                style={{ height: `${h}%`, background: g.tone ? undefined : LOOKS[i].ink }}
              />
            ))}
          </div>
          <p className="mt-1.5 text-center text-[0.58rem] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
            {g.label}
          </p>
        </div>
      ))}
    </div>
  );
}

/* 2. Four voices, kept four. */
function Voices() {
  return (
    <div className="grid w-full grid-cols-2 gap-2">
      {BRANDS.map((b, i) => (
        <div
          key={b.domain}
          className="rounded-lg rounded-bl-sm px-2.5 py-2"
          style={{ background: LOOKS[i].wash }}
        >
          <span className="flex gap-1">
            <span
              className="h-1 rounded-full"
              style={{ width: `${40 + i * 9}%`, background: LOOKS[i].ink, opacity: 0.55 }}
            />
            <span
              className="h-1 flex-1 rounded-full"
              style={{ background: LOOKS[i].ink, opacity: 0.2 }}
            />
          </span>
          <p
            className="mt-1.5 truncate text-[0.62rem] font-semibold"
            style={{ color: LOOKS[i].ink }}
          >
            {b.tone}
          </p>
        </div>
      ))}
    </div>
  );
}

/* 3. Four retainers become one invoice. */
function Invoices() {
  return (
    <div className="flex w-full items-center justify-center gap-3">
      <div className="relative h-[4.6rem] w-[4.2rem] shrink-0">
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className={cn(CARD, "absolute inset-0 p-2")}
            style={{ transform: `translate(${i * 4}px, ${i * -4}px) rotate(${(i - 1.5) * 3}deg)` }}
          >
            <span className="block h-1 w-6 rounded-full bg-ink/[0.14]" />
            <span className="mt-1.5 block h-1 w-9 rounded-full bg-ink/[0.08]" />
            <span className="mt-1 block h-1 w-7 rounded-full bg-ink/[0.08]" />
          </span>
        ))}
      </div>
      <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />
      <div className={cn(CARD, "w-[7.5rem] shrink-0 border-cta/25 p-2.5")}>
        <p className="text-[0.56rem] font-semibold uppercase tracking-[0.1em] text-cta">
          1 invoice
        </p>
        <ul className="mt-1.5 space-y-1">
          {BRANDS.map((b, i) => (
            <li key={b.domain} className="flex items-center gap-1.5">
              <BrandMark index={i} className="h-3 w-3 rounded-[3px]" />
              <span className="h-1 flex-1 rounded-full bg-ink/[0.1]" />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* 4. A new brand joins the account. */
function NewBrand() {
  return (
    <div className="flex w-full items-center justify-center gap-2">
      {BRANDS.slice(0, 3).map((b, i) => (
        <BrandMark key={b.domain} index={i} className="h-10 w-10 rounded-xl" />
      ))}
      <span className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-dashed border-cta/50 bg-cta-soft text-cta">
        <Plus className="h-4 w-4" />
        <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-cta px-1.5 py-px text-[0.52rem] font-semibold text-white">
          New
        </span>
      </span>
    </div>
  );
}

const PAIN_PICTURES = [ShareBars, Voices, Invoices, NewBrand];

export function PainPicture({ index }: { index: number }) {
  const Picture = PAIN_PICTURES[index];
  return Picture ? <Picture /> : null;
}

/* ---------- Rollout steps ---------- */

function Shell({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="w-full max-w-[25rem] overflow-hidden rounded-xl border border-ink/[0.08] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.05),0_24px_48px_-28px_rgba(16,24,40,0.35)]">
      <div className="flex items-center justify-between border-b border-ink/[0.07] px-4 py-2.5">
        <p className="text-[0.72rem] font-semibold text-ink">{title}</p>
        <span className="rounded-md border border-ink/[0.08] px-1.5 py-px text-[0.56rem] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
          Sample
        </span>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

/* Step 1: Rankbox reads the first brand's site and proposes searches. */
function ReadSite({ questions }: { questions: readonly string[] }) {
  const b = BRANDS[0];
  return (
    <Shell title="Set up your site">
      <div className="flex items-center gap-3 rounded-lg bg-[color-mix(in_oklab,var(--surface)_70%,white)] p-3">
        <BrandMark index={0} className="h-9 w-9 rounded-lg" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[0.8rem] font-semibold text-ink">{b.name}</p>
          <p className="truncate font-mono text-[0.64rem] text-muted-foreground">{b.domain}</p>
        </div>
        <span className="inline-flex items-center gap-1 rounded-md bg-[#e9f6ee] px-1.5 py-0.5 text-[0.6rem] font-semibold text-success">
          <Check className="h-2.5 w-2.5" strokeWidth={3} />
          Read
        </span>
      </div>
      <p className="mt-4 flex items-center gap-1.5 text-[0.62rem] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
        <Search className="h-3 w-3" />
        Pick the searches to win
      </p>
      <ul className="mt-2 space-y-1.5">
        {questions.map((q, i) => (
          <li
            key={q}
            className={cn(
              "flex items-center gap-2 rounded-lg border px-2.5 py-2 text-[0.7rem]",
              i < 2 ? "border-cta/25 bg-cta-soft text-ink" : "border-ink/[0.07] text-ink/70",
            )}
          >
            <span
              className={cn(
                "flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-[4px]",
                i < 2 ? "bg-cta text-white" : "border border-ink/[0.2]",
              )}
            >
              {i < 2 && <Check className="h-2.5 w-2.5" strokeWidth={3} />}
            </span>
            <span className="min-w-0 truncate">{q}</span>
          </li>
        ))}
      </ul>
    </Shell>
  );
}

/* Step 2: the first brand's voice, set and tested on the trial. */
function TuneVoice() {
  const b = BRANDS[0];
  const used = 4;
  return (
    <Shell title="How it writes">
      <dl className="space-y-2.5 text-[0.72rem]">
        {[
          ["Audience", b.audience],
          ["Tone", b.tone],
          ["House rules", b.rule],
        ].map(([k, v]) => (
          <div key={k}>
            <dt className="text-[0.62rem] font-medium text-muted-foreground">{k}</dt>
            <dd className="mt-1 rounded-md border border-ink/[0.08] bg-white px-2.5 py-1.5 font-medium text-ink">
              {v}
            </dd>
          </div>
        ))}
      </dl>
      <div className="mt-4 rounded-lg bg-[color-mix(in_oklab,var(--surface)_70%,white)] p-3">
        <div className="flex items-baseline justify-between text-[0.66rem]">
          <span className="text-muted-foreground">Trial articles</span>
          <span className="font-semibold tabular-nums text-ink">
            {used} / {TRIAL_ARTICLE_CREDITS}
          </span>
        </div>
        <span className="mt-1.5 block h-1.5 overflow-hidden rounded-full bg-ink/[0.07]">
          <span
            className="block h-full rounded-full bg-cta"
            style={{ width: `${(used / TRIAL_ARTICLE_CREDITS) * 100}%` }}
          />
        </span>
      </div>
    </Shell>
  );
}

/* Step 3: the add-site price check, as the dialog lays it out. */
function AddSite() {
  const b = BRANDS[1];
  const total = PLAN.monthly + STUDIO.monthlyPerSite;
  return (
    <Shell title={`Add ${b.name} to ${STUDIO.name}`}>
      <div className="flex items-center gap-3">
        <BrandMark index={1} className="h-9 w-9 rounded-lg" />
        <div className="min-w-0">
          <p className="truncate text-[0.8rem] font-semibold text-ink">{b.name}</p>
          <p className="truncate font-mono text-[0.64rem] text-muted-foreground">{b.domain}</p>
        </div>
      </div>
      <dl className="mt-4 divide-y divide-ink/[0.07] border-y border-ink/[0.07] text-[0.7rem]">
        {[
          ["Due today", "This period's share"],
          ["Then", `${formatUsd(STUDIO.monthlyPerSite)}/month`],
          ["New monthly total", formatUsd(total)],
          ["The full plan, for this site", `${PLAN.articlesPerMonth} articles a month`],
        ].map(([k, v]) => (
          <div key={k} className="flex items-center justify-between gap-3 py-2">
            <dt className="text-muted-foreground">{k}</dt>
            <dd className="text-right font-semibold tabular-nums text-ink">{v}</dd>
          </div>
        ))}
      </dl>
      <span className="mt-4 flex h-9 w-full items-center justify-center rounded-lg bg-cta text-[0.74rem] font-semibold text-white">
        Add site
      </span>
    </Shell>
  );
}

/* Step 4: every brand on a pace of its own. */
const WEEK = ["M", "T", "W", "T", "F", "S", "S"];
const PACES = [
  [0, 3],
  [1, 2, 4],
  [2, 5],
  [0, 2, 4],
];

function OwnSchedules() {
  return (
    <Shell title="This week, by site">
      <div className="grid grid-cols-[minmax(0,1fr)_repeat(7,1.15rem)] items-center gap-x-1 gap-y-2.5">
        <span />
        {WEEK.map((d, i) => (
          <span key={i} className="text-center text-[0.56rem] font-semibold text-muted-foreground">
            {d}
          </span>
        ))}
        {BRANDS.map((b, i) => (
          <div key={b.domain} className="contents">
            <span className="flex min-w-0 items-center gap-2">
              <BrandMark index={i} className="h-6 w-6 rounded-md" />
              <span className="truncate text-[0.7rem] font-medium text-ink">{b.name}</span>
            </span>
            {WEEK.map((_, d) => (
              <span key={d} className="flex h-5 items-center justify-center">
                {PACES[i].includes(d) ? (
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: LOOKS[i].ink }} />
                ) : (
                  <span className="h-1 w-1 rounded-full bg-ink/[0.12]" />
                )}
              </span>
            ))}
          </div>
        ))}
      </div>
      <p className="mt-4 flex items-center gap-1.5 border-t border-ink/[0.07] pt-3 text-[0.66rem] text-muted-foreground">
        <Sparkles className="h-3 w-3 text-cta" />
        Up to {PLAN.articlesPerMonth} a month each
      </p>
    </Shell>
  );
}

export function StepPicture({ index, questions }: { index: number; questions: readonly string[] }) {
  if (index === 0) return <ReadSite questions={questions} />;
  if (index === 1) return <TuneVoice />;
  if (index === 2) return <AddSite />;
  return <OwnSchedules />;
}
