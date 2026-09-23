/**
 * AI app builders: the chat on the left, the site taking shape on the right.
 * The builder calls Rankbox, says what it will do with the research, and the
 * preview builds it: an FAQ from real questions, a post from a brief, or the
 * page's search snippet from a meta description.
 *
 * The site is Batchwell, a fictional meal-prep delivery service (the builder
 * sample's topic), in its own colors; the builder's accent marks what it just
 * built, the way a builder highlights a change.
 */
import { Check, FileCode2, Globe, Lock, RotateCw } from "lucide-react";
import { cn } from "@/lib/utils";
import type { RankboxTool, ToolSample } from "@/data/ai-integration-samples";
import { CallPill, Caret, Chrome, ENTER, SITE_SHIMMER, ToolMark, wait } from "./parts";
import { APPLY, ASK, CALL, DONE, RESULT, useTyped, type Phase, type Scene } from "./story";

const PAGE: Record<RankboxTool, string> = {
  questions: "/pricing",
  brief: "/guides/meal-prep-for-beginners",
  meta: "/pricing",
};

const REPLY: Record<RankboxTool, (s: ToolSample) => string> = {
  questions: (s) =>
    `Found ${s.questions.reduce((n, g) => n + g.questions.length, 0)} questions. I'll answer the Comparison and Transactional ones in a pricing FAQ.`,
  brief: (s) =>
    `Got a ${s.brief.outline.length}-section brief. Building the post, one section per heading.`,
  meta: () => "Got three options for each page. Setting the strongest one on each.",
};

const EDITS: Record<RankboxTool, [string, string][]> = {
  questions: [
    ["PricingFaq.tsx", "+38"],
    ["Pricing.tsx", "+2"],
  ],
  brief: [
    ["MealPrepGuide.tsx", "+64"],
    ["App.tsx", "+3"],
  ],
  meta: [
    ["index.html", "+2"],
    ["Pricing.tsx", "+6"],
  ],
};

export function BuilderStage({ scene }: { scene: Scene }) {
  const { tool, task, sample, prompt, phase } = scene;
  const { typed, typing } = useTyped(prompt, phase === ASK);

  return (
    <div className="flex h-full flex-col bg-(--st-bg)">
      <Chrome
        right={
          <span className="rounded-md bg-(--st-accent) px-2.5 py-1 text-[10.5px] font-semibold text-(--st-on-accent)">
            Publish
          </span>
        }
      >
        <span className="flex min-w-0 items-center gap-2 text-[12px]">
          <ToolMark tool={tool} className="h-[18px] w-[18px]" />
          <span className="font-semibold">batchwell</span>
          <span className="hidden text-(--st-faint) @min-[25rem]:inline">/</span>
          <span className="hidden truncate text-(--st-muted) @min-[25rem]:inline">
            {task === "brief" ? "guides" : "pricing"}
          </span>
        </span>
      </Chrome>

      <div className="flex min-h-0 flex-1">
        {/* The builder's chat */}
        <aside className="hidden w-[39%] shrink-0 flex-col border-r border-(--st-border) bg-(--st-panel) @min-[25rem]:flex">
          <div className="flex min-h-0 flex-1 flex-col justify-end gap-2.5 overflow-hidden p-3 [mask-image:linear-gradient(to_bottom,transparent,black_24px)]">
            {phase >= CALL && (
              <p
                className={cn(
                  ENTER,
                  "ml-auto rounded-xl rounded-br-sm bg-(--st-bubble) px-2.5 py-2 text-[11px] leading-snug",
                )}
              >
                {prompt}
              </p>
            )}
            {phase >= CALL && (
              <CallPill
                task={task}
                done={phase >= RESULT}
                short
                className={cn(ENTER, "self-start")}
              />
            )}
            {phase >= RESULT && (
              <p className={cn(ENTER, "text-[11px] leading-snug")}>{REPLY[task](sample)}</p>
            )}
            {phase >= APPLY && (
              <ul className="space-y-1">
                {EDITS[task].map(([file, lines], i) => (
                  <li
                    key={file}
                    style={wait(i, 140)}
                    className={cn(
                      ENTER,
                      "flex items-center gap-1.5 rounded-md border border-(--st-border) bg-(--st-bg) px-2 py-1 text-[10px]",
                    )}
                  >
                    <FileCode2 className="h-3 w-3 shrink-0 text-(--st-muted)" />
                    <span className="min-w-0 flex-1 truncate font-mono">{file}</span>
                    <span className="font-mono text-(--st-add)">{lines}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="p-2.5 pt-0">
            <div className="rounded-xl border border-(--st-border) bg-(--st-bg) px-2.5 py-2 text-[11px] leading-snug">
              <p className="line-clamp-3 min-h-[2.6em]">
                {phase === ASK ? (
                  <>
                    {typed}
                    <Caret className={typing ? "animate-none" : undefined} />
                  </>
                ) : (
                  <span className="text-(--st-faint)">Ask {tool.name}…</span>
                )}
              </p>
            </div>
          </div>
        </aside>

        {/* The preview */}
        <div className="flex min-w-0 flex-1 flex-col gap-2 bg-(--st-sunken) p-2.5">
          <NarrowStrip scene={scene} typed={typed} />
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg bg-white text-[#15201A] shadow-[0_1px_3px_rgba(0,0,0,0.12)] ring-1 ring-black/5">
            <div className="flex items-center gap-2 border-b border-[#EDF0EE] px-2.5 py-1.5 text-[9.5px] text-[#6B7A71]">
              <RotateCw
                className={cn(
                  "h-3 w-3 shrink-0",
                  phase === APPLY &&
                    "animate-spin [animation-duration:1.2s] motion-reduce:animate-none",
                )}
              />
              <span className="flex min-w-0 flex-1 items-center gap-1 rounded-md bg-[#F2F5F3] px-2 py-0.5">
                <Lock className="h-2.5 w-2.5 shrink-0" />
                <span className="truncate">batchwell.app{PAGE[task]}</span>
              </span>
            </div>
            <div className="relative min-h-0 flex-1 overflow-hidden">
              <SiteNav />
              {task === "brief" ? (
                <PostPage sample={sample} phase={phase} />
              ) : (
                <PricingPage sample={sample} phase={phase} faq={task === "questions"} />
              )}
              {task === "meta" && <SearchPreview sample={sample} phase={phase} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** On a phone the chat column folds into one line above the preview. */
function NarrowStrip({ scene, typed }: { scene: Scene; typed: string }) {
  const { tool, task, phase } = scene;
  return (
    <div className="flex h-9 shrink-0 items-center gap-2 rounded-lg border border-(--st-border) bg-(--st-panel) px-2 @min-[25rem]:hidden">
      <ToolMark tool={tool} className="h-5 w-5" />
      {phase === ASK ? (
        <span className="min-w-0 flex-1 truncate text-[11px]">
          {typed}
          <Caret />
        </span>
      ) : (
        <>
          <CallPill task={task} done={phase >= RESULT} short />
          <span className="min-w-0 flex-1 truncate text-[10.5px] text-(--st-muted)">
            {phase >= DONE ? "Built" : phase >= RESULT ? "Building…" : "Researching…"}
          </span>
        </>
      )}
    </div>
  );
}

/* ---------- Batchwell ---------- */

const GREEN = "#1F6F4A";

function SiteNav() {
  return (
    <div className="flex items-center gap-3 px-3 py-2">
      <span className="flex items-center gap-1.5 text-[10.5px] font-bold tracking-tight">
        <span className="h-3 w-3 rounded-full" style={{ background: GREEN }} />
        Batchwell
      </span>
      <span className="ml-auto hidden gap-2.5 text-[9px] text-[#6B7A71] @min-[25rem]:flex">
        <span>Menu</span>
        <span>Plans</span>
        <span>Guides</span>
      </span>
      <span
        className="ml-auto rounded-[5px] px-2 py-[3px] text-[9px] font-semibold text-white @min-[25rem]:ml-0"
        style={{ background: GREEN }}
      >
        Order
      </span>
    </div>
  );
}

/** What the builder just made: its selection outline and a label. */
function Built({
  label,
  on,
  children,
  className,
}: {
  label: string;
  on: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative rounded-md outline-2 outline-offset-2 transition-[outline-color] duration-500",
        on ? "outline-(--st-accent)" : "outline-transparent",
        className,
      )}
    >
      {on && (
        <span
          className={cn(
            ENTER,
            "absolute -top-[15px] left-0 z-10 rounded-t-[4px] bg-(--st-accent) px-1.5 py-px text-[8.5px] font-semibold text-(--st-on-accent)",
          )}
        >
          {label}
        </span>
      )}
      {children}
    </div>
  );
}

function Bar({ w, className }: { w: string; className?: string }) {
  return (
    <span
      className={cn("block h-[5px] rounded-full bg-[#15201A]/10", className)}
      style={{ width: w }}
    />
  );
}

function PricingPage({ sample, phase, faq }: { sample: ToolSample; phase: Phase; faq: boolean }) {
  const plans: [string, string, boolean][] = [
    ["6 meals", "$59", false],
    ["10 meals", "$89", true],
    ["14 meals", "$119", false],
  ];
  const [, commercial, comparison, transactional] = sample.questions;
  const questions = [
    comparison.questions[0],
    transactional.questions[0],
    transactional.questions[1],
    comparison.questions[2] ?? commercial.questions[2],
  ];
  return (
    <div className="px-3 pb-3">
      <p
        className="mt-1 text-[8.5px] font-semibold uppercase tracking-[0.1em]"
        style={{ color: GREEN }}
      >
        Plans & pricing
      </p>
      <p className="mt-1 text-[14px] font-bold leading-tight tracking-tight">
        Chef-made meals, delivered weekly
      </p>
      <div className="mt-2.5 grid grid-cols-3 gap-1.5">
        {plans.map(([name, price, popular]) => (
          <div
            key={name}
            className={cn(
              "rounded-md border px-2 py-1.5",
              popular ? "border-[#1F6F4A] bg-[#F2F7F4]" : "border-[#E6EAE7]",
            )}
          >
            <p className="text-[8.5px] text-[#6B7A71]">{name}</p>
            <p className="text-[11px] font-bold">
              {price}
              <span className="text-[8px] font-normal text-[#6B7A71]">/wk</span>
            </p>
          </div>
        ))}
      </div>

      {faq && phase >= RESULT && (
        <Built label="PricingFaq" on={phase === RESULT || phase === APPLY} className="mt-5">
          <p className="text-[11px] font-bold">Questions people ask</p>
          <ul className="mt-1.5 divide-y divide-[#EDF0EE] border-y border-[#EDF0EE]">
            {questions.map((q, i) => (
              <li key={q} className="flex h-[23px] items-center gap-2 text-[9.5px]">
                {phase >= APPLY ? (
                  <span
                    style={wait(i, 150)}
                    className={cn(ENTER, "flex min-w-0 flex-1 items-center gap-2")}
                  >
                    <span className="min-w-0 flex-1 truncate">{q}</span>
                    <span className="text-[11px] leading-none text-[#6B7A71]">+</span>
                  </span>
                ) : (
                  <span
                    className={cn("h-[5px] flex-1 rounded-full", SITE_SHIMMER)}
                    style={{ maxWidth: `${88 - i * 9}%` }}
                  />
                )}
              </li>
            ))}
          </ul>
        </Built>
      )}

      {!faq && (
        <div className="mt-4 space-y-1.5">
          <Bar w="42%" className="h-[6px] bg-[#15201A]/15" />
          <Bar w="92%" />
          <Bar w="78%" />
        </div>
      )}
    </div>
  );
}

function PostPage({ sample, phase }: { sample: ToolSample; phase: Phase }) {
  const { brief } = sample;
  if (phase < RESULT) {
    return (
      <div className="space-y-2 px-3 pt-2">
        <Bar w="18%" className={phase >= CALL ? SITE_SHIMMER : undefined} />
        <Bar w="82%" className={cn("h-[9px]", phase >= CALL && SITE_SHIMMER)} />
        <Bar w="64%" className={cn("h-[9px]", phase >= CALL && SITE_SHIMMER)} />
        <div className="space-y-1.5 pt-3">
          {[92, 86, 90, 70].map((w) => (
            <Bar key={w} w={`${w}%`} />
          ))}
        </div>
      </div>
    );
  }
  return (
    <div className="px-3 pb-3">
      <p
        className="mt-1 text-[8.5px] font-semibold uppercase tracking-[0.1em]"
        style={{ color: GREEN }}
      >
        Guides
      </p>
      <p className={cn(ENTER, "mt-1 text-[14px] font-bold leading-tight tracking-tight")}>
        {brief.title}
      </p>
      <p className="mt-1 text-[8.5px] text-[#6B7A71]">6 min read</p>
      <Built label="MealPrepGuide" on={phase === RESULT || phase === APPLY} className="mt-3">
        <div className="space-y-2">
          {brief.outline.slice(0, 5).map((o, i) => (
            <div key={o.heading}>
              {phase >= APPLY ? (
                <p
                  style={wait(i, 140)}
                  className={cn(ENTER, "text-[10.5px] font-semibold leading-snug")}
                >
                  {o.heading}
                </p>
              ) : (
                <span className={cn("block h-[7px] w-[60%] rounded-full", SITE_SHIMMER)} />
              )}
              <div className="mt-1 space-y-1">
                <Bar w="94%" />
                <Bar w={`${72 - (i % 3) * 9}%`} />
              </div>
            </div>
          ))}
        </div>
      </Built>
    </div>
  );
}

/** The page as it will look in search, once the builder sets the description. */
function SearchPreview({ sample, phase }: { sample: ToolSample; phase: Phase }) {
  if (phase < RESULT) return null;
  const description = sample.meta[0];
  return (
    <div className={cn(ENTER, "absolute inset-x-2.5 bottom-2.5")}>
      <Built label="Search preview" on={phase === APPLY}>
        <div className="rounded-md border border-[#E6EAE7] bg-white p-2.5 shadow-[0_8px_24px_-8px_rgba(0,0,0,0.25)]">
          <div className="flex items-center gap-1.5 text-[8.5px] text-[#4B5A52]">
            <span
              className="grid h-3.5 w-3.5 place-items-center rounded-full text-[7px] font-bold text-white"
              style={{ background: GREEN }}
            >
              B
            </span>
            <span className="font-medium">Batchwell</span>
            <span className="text-[#8A968F]">batchwell.app › pricing</span>
            <Globe className="ml-auto h-3 w-3 text-[#8A968F]" />
          </div>
          {phase >= APPLY ? (
            <>
              <p className={cn(ENTER, "mt-1 text-[11px] font-medium leading-snug text-[#1A4DB8]")}>
                Meal-Prep Delivery Plans & Pricing | Batchwell
              </p>
              <p
                style={wait(1, 160)}
                className={cn(
                  ENTER,
                  "mt-0.5 line-clamp-2 text-[9.5px] leading-snug text-[#4B5A52]",
                )}
              >
                {description}
              </p>
              <p
                style={wait(2, 160)}
                className={cn(
                  ENTER,
                  "mt-1.5 flex items-center gap-1 text-[8.5px] font-medium text-[#1A7F37]",
                )}
              >
                <Check className="h-2.5 w-2.5" strokeWidth={3} />
                Meta description · {description.length} characters
              </p>
            </>
          ) : (
            <div className="mt-1.5 space-y-1.5">
              <span className={cn("block h-[7px] w-[70%] rounded-full", SITE_SHIMMER)} />
              <span className={cn("block h-[5px] w-[96%] rounded-full", SITE_SHIMMER)} />
              <span className={cn("block h-[5px] w-[80%] rounded-full", SITE_SHIMMER)} />
            </div>
          )}
        </div>
      </Built>
    </div>
  );
}
