/**
 * The sections of /features/reddit-presence below the showcase, in the
 * landing page's frame. All copy comes from the feature's entry in
 * data/features.ts; these decide how it's set, and what the pictures show.
 *
 * The order follows the questions a founder brings to this feature: who does
 * what (the hand-off, first, because "does it post for me?" comes first), why
 * Reddit at all, what you get in each thread, how it ties into the rest of
 * Rankbox, then the questions, the price and the way in.
 */
import type { ComponentType } from "react";
import { Link } from "@tanstack/react-router";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  Check,
  CircleHelp,
  History,
  Network,
  Plus,
  Radar,
  ShieldCheck,
  TrendingUp,
  UserRound,
  Waypoints,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Accordion, AccordionContent, AccordionItem } from "@/components/ui/accordion";
import { Mark } from "@/components/brand/Mark";
import { Reveal } from "@/components/landing/shared";
import { RedditMark } from "@/components/landing/ai-logos";
import {
  Accent,
  Band,
  GHOST_BUTTON,
  LINE,
  LINE_FILL,
  PANEL,
  Pill,
  SectionHead,
  Spacer,
} from "@/components/landing/frame";
import { TRIAL_NOTE } from "@/components/features/FeatureSections";
import { getFeature, type Feature } from "@/data/features";
import {
  DraftMini,
  EvidenceScreen,
  LinkMini,
  PathAnswer,
  PathSerp,
  PathThread,
  PickMini,
  PostMini,
  RecheckMini,
  RecordScreen,
  RulesScreen,
  SurfacedMini,
  ThreadPeek,
} from "./pictures";
import { SampleTag } from "./atoms";
import { CommentTree } from "./trees";

/** A title with its last `words` words set in the blue accent. */
function accented(text: string, words: number) {
  const parts = text.split(" ");
  return (
    <>
      {parts.slice(0, -words).join(" ")} <Accent>{parts.slice(-words).join(" ")}</Accent>
    </>
  );
}

/** A two-sentence title with its second sentence in the accent. */
function accentLastSentence(text: string) {
  const at = text.lastIndexOf(". ");
  if (at < 0) return accented(text, 3);
  return (
    <>
      {text.slice(0, at + 1)} <Accent>{text.slice(at + 2)}</Accent>
    </>
  );
}

const SOLID_BUTTON =
  "group inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-cta px-5 text-[0.95rem] font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.16),0_1px_2px_rgba(16,24,40,0.14)] transition-[background-color,transform] duration-150 hover:bg-cta-hover active:scale-[0.985] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cta/25";

/** The fact the trial note can't carry: this feature isn't in the trial. */
const PAID_NOTE = "Reddit Presence opens with your first paid invoice.";

/* ---------- Who does what ---------- */

type Lane = "rankbox" | "you";

interface LaneCell {
  lane: Lane;
  caption: string;
  Picture: ComponentType;
}

/* Each step's two cells, in the order the work happens. Step 3 starts with
   you: you paste the link to your comment, then Rankbox re-checks it. */
const HANDOFF: LaneCell[][] = [
  [
    { lane: "rankbox", caption: "Finds and ranks", Picture: SurfacedMini },
    { lane: "you", caption: "Picks one to answer", Picture: PickMini },
  ],
  [
    { lane: "rankbox", caption: "Drafts and checks", Picture: DraftMini },
    { lane: "you", caption: "Edits and posts", Picture: PostMini },
  ],
  [
    { lane: "you", caption: "Pastes the link back", Picture: LinkMini },
    { lane: "rankbox", caption: "Re-checks, with dates", Picture: RecheckMini },
  ],
];

/* Grid placement on wide screens: the steps across, the two lanes down. On
   phones the cells simply follow in the order the work happens. */
const COL = ["lg:col-start-2", "lg:col-start-3", "lg:col-start-4"];
const ROW: Record<Lane, string> = { rankbox: "lg:row-start-2", you: "lg:row-start-3" };
const YOU_TINT = "bg-[color-mix(in_oklab,var(--cta)_4%,white)]";

function LaneTag({ lane }: { lane: Lane }) {
  return lane === "rankbox" ? (
    <span className="inline-flex items-center gap-1.5 text-[0.72rem] font-semibold text-ink">
      <Mark className="h-3.5 w-3.5 text-brand-blue" />
      Rankbox
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 text-[0.72rem] font-semibold text-cta">
      <UserRound className="h-3.5 w-3.5" />
      You
    </span>
  );
}

function LaneLabel({ lane, row }: { lane: Lane; row: string }) {
  const you = lane === "you";
  return (
    <div
      className={cn(
        "hidden flex-col justify-center gap-2 px-5 py-6 lg:col-start-1 lg:flex",
        row,
        you ? YOU_TINT : "bg-white",
      )}
    >
      <span
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-lg",
          you ? "bg-cta text-white" : "border border-ink/[0.08] bg-white text-brand-blue",
        )}
      >
        {you ? <UserRound className="h-4 w-4" /> : <Mark className="h-4 w-4" />}
      </span>
      <p className="text-[0.92rem] font-semibold text-ink">{you ? "You" : "Rankbox"}</p>
      <p className="text-[0.75rem] leading-snug text-muted-foreground">
        {you ? "Your judgement, your own Reddit account" : "No Reddit login, ever"}
      </p>
    </div>
  );
}

export function RedditHandoff({ feature }: { feature: Feature }) {
  return (
    <section>
      <Spacer />
      <SectionHead
        icon={Waypoints}
        eyebrow="Who does what"
        title={accented(feature.stepsTitle, 2)}
      />
      <Band>
        <div
          className={cn(
            "grid grid-cols-[minmax(0,1fr)] gap-px lg:grid-cols-[11rem_repeat(3,minmax(0,1fr))] lg:grid-rows-[auto_auto_auto]",
            LINE_FILL,
          )}
        >
          <div className="hidden flex-col justify-end gap-2 bg-white px-5 py-7 lg:col-start-1 lg:row-start-1 lg:flex">
            <SampleTag className="w-fit" />
            <p className="text-[0.75rem] leading-snug text-muted-foreground">
              The screens show sample threads.
            </p>
          </div>
          <LaneLabel lane="rankbox" row="lg:row-start-2" />
          <LaneLabel lane="you" row="lg:row-start-3" />

          {feature.steps.map((s, i) => {
            const cells = HANDOFF[i] ?? [];
            return [
              <div key={`h-${s.title}`} className={cn("bg-white lg:row-start-1", COL[i])}>
                <Reveal delay={i * 0.06} className="p-6 sm:p-7">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-cta-soft text-[0.85rem] font-semibold tabular-nums text-cta">
                    {i + 1}
                  </span>
                  <h3 className="mt-4 text-[1.05rem] font-semibold tracking-tight text-ink">
                    {s.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
                </Reveal>
              </div>,
              ...cells.map((c, j) => {
                const { Picture } = c;
                const next = cells[j + 1];
                return (
                  <div
                    key={`${s.title}-${c.lane}`}
                    className={cn(
                      "relative",
                      COL[i],
                      ROW[c.lane],
                      c.lane === "you" ? YOU_TINT : "bg-white",
                    )}
                  >
                    <Reveal delay={i * 0.06 + 0.05} className="px-5 pb-6 pt-5 sm:px-6">
                      <div className="mb-3 flex items-center gap-2">
                        <span className="lg:hidden">
                          <LaneTag lane={c.lane} />
                        </span>
                        <span aria-hidden className="text-muted-foreground/50 lg:hidden">
                          ·
                        </span>
                        <span className="text-[0.75rem] font-medium text-ink/80">{c.caption}</span>
                      </div>
                      <div aria-hidden>
                        <Picture />
                      </div>
                    </Reveal>
                    {/* A joint on the hairline between the two lanes, pointing
                        the way the work goes. */}
                    {next && c.lane === "rankbox" && (
                      <span
                        aria-hidden
                        className="absolute -bottom-3 left-1/2 z-10 hidden h-6 w-6 -translate-x-1/2 items-center justify-center rounded-full border border-ink/[0.08] bg-white text-cta shadow-[0_1px_2px_rgba(16,24,40,0.05)] lg:flex"
                      >
                        <ArrowDown className="h-3 w-3" />
                      </span>
                    )}
                    {next && c.lane === "you" && (
                      <span
                        aria-hidden
                        className="absolute -top-3 left-1/2 z-10 hidden h-6 w-6 -translate-x-1/2 items-center justify-center rounded-full border border-ink/[0.08] bg-white text-cta shadow-[0_1px_2px_rgba(16,24,40,0.05)] lg:flex"
                      >
                        <ArrowUp className="h-3 w-3" />
                      </span>
                    )}
                  </div>
                );
              }),
            ];
          })}
        </div>
      </Band>
    </section>
  );
}

/* ---------- Why Reddit ---------- */

const PATH = [
  { label: "A thread on Reddit", Picture: PathThread },
  { label: "On page one of Google", Picture: PathSerp },
  { label: "Quoted in an AI answer", Picture: PathAnswer },
];

export function RedditWhy({ feature }: { feature: Feature }) {
  const { problem } = feature;
  if (!problem) return null;
  return (
    <section>
      <Spacer />
      <SectionHead
        icon={TrendingUp}
        eyebrow="Why Reddit"
        title={accentLastSentence(problem.title)}
        subtitle={problem.body}
      />

      {/* The path one thread takes, as a sample. */}
      <Band inner={PANEL}>
        <ol className="grid lg:grid-cols-3">
          {PATH.map(({ label, Picture }, i) => (
            <li
              key={label}
              className={cn(
                "relative px-5 py-8 sm:px-8 lg:py-10",
                i > 0 && "border-t lg:border-l lg:border-t-0",
                LINE,
              )}
            >
              <Reveal delay={i * 0.08}>
                <p className="mb-4 flex items-center gap-2 text-[0.8rem] font-medium text-ink">
                  <span className="flex h-5 w-5 items-center justify-center rounded-md bg-white text-[0.68rem] font-semibold tabular-nums text-cta ring-1 ring-ink/[0.08]">
                    {i + 1}
                  </span>
                  {label}
                </p>
                <div aria-hidden className="mx-auto max-w-[22rem]">
                  <Picture />
                </div>
              </Reveal>
              {i < PATH.length - 1 && (
                <span
                  aria-hidden
                  className="absolute -right-3 top-1/2 z-10 hidden h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full border border-ink/[0.08] bg-white text-muted-foreground shadow-[0_1px_2px_rgba(16,24,40,0.05)] lg:flex"
                >
                  <ArrowRight className="h-3 w-3" />
                </span>
              )}
            </li>
          ))}
        </ol>
      </Band>

      {/* Before and after, as one ledger. Column by column in the markup, so
          on phones each side reads as its own list. */}
      <Band>
        <div
          className={cn(
            "grid gap-px lg:grid-flow-col lg:grid-cols-2 lg:grid-rows-[auto_repeat(4,auto)]",
            LINE_FILL,
          )}
        >
          <div className="flex items-center gap-3 bg-white px-6 py-5 sm:px-10">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#fdedf1] text-[#e11d48]">
              <X className="h-4 w-4" />
            </span>
            <h3 className="text-[1.02rem] font-medium tracking-tight text-ink">Doing it by hand</h3>
          </div>
          {problem.before.map((item, i) => (
            <div key={item} className="bg-white">
              <Reveal delay={i * 0.04} className="flex gap-3 px-6 py-4 sm:px-10">
                <X className="mt-0.5 h-4 w-4 shrink-0 text-[#e11d48]/60" />
                <p className="text-[0.92rem] leading-snug text-muted-foreground">{item}</p>
              </Reveal>
            </div>
          ))}
          <div className="flex items-center gap-3 bg-white px-6 py-5 sm:px-10">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-cta text-white">
              <RedditMark className="h-4 w-4 text-white" />
            </span>
            <h3 className="text-[1.02rem] font-medium tracking-tight text-ink">
              With {feature.name}
            </h3>
          </div>
          {problem.after.map((item, i) => (
            <div key={item} className={YOU_TINT}>
              <Reveal delay={i * 0.04} className="flex gap-3 px-6 py-4 sm:px-10">
                <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-cta-soft text-cta">
                  <Check className="h-2.5 w-2.5" strokeWidth={3} />
                </span>
                <p className="text-[0.92rem] leading-snug text-ink">{item}</p>
              </Reveal>
            </div>
          ))}
        </div>
      </Band>
    </section>
  );
}

/* ---------- In every thread ---------- */

const BENEFIT = [
  { icon: Radar, panel: "#eaf2fe", tile: "#dbe8fd", ink: "#1877f2", Screen: EvidenceScreen },
  { icon: ShieldCheck, panel: "#fdefe7", tile: "#fbdccb", ink: "#ea580c", Screen: RulesScreen },
  { icon: History, panel: "#e9f6ee", tile: "#d6efdf", ink: "#16a34a", Screen: RecordScreen },
] as const;

function BenefitText({
  index,
  title,
  body,
  className,
}: {
  index: number;
  title: string;
  body: string;
  className?: string;
}) {
  const style = BENEFIT[index % BENEFIT.length];
  const Icon = style.icon;
  return (
    <div className={className}>
      <span
        className="flex h-8 w-8 items-center justify-center rounded-lg"
        style={{ background: style.tile, color: style.ink }}
      >
        <Icon className="h-4 w-4" />
      </span>
      <h3 className="mt-4 font-display text-[1.4rem] font-medium leading-tight tracking-[-0.02em] text-ink sm:text-[1.55rem]">
        {title}
      </h3>
      <p className="mt-2 max-w-md text-[0.92rem] leading-relaxed text-muted-foreground">{body}</p>
    </div>
  );
}

function BenefitPanel({ index, className }: { index: number; className?: string }) {
  const style = BENEFIT[index % BENEFIT.length];
  const { Screen } = style;
  return (
    <div
      aria-hidden
      className={cn("relative overflow-hidden rounded-lg", className)}
      style={{ background: style.panel }}
    >
      <Screen />
    </div>
  );
}

export function RedditBenefits({ feature }: { feature: Feature }) {
  const [a, b, c] = feature.benefits;
  return (
    <section>
      <Spacer />
      <SectionHead
        icon={feature.icon}
        eyebrow="In every thread"
        title={accented(feature.benefitsTitle, 3)}
        subtitle={feature.benefitsIntro}
      />
      <Band>
        <div className={cn("grid gap-px lg:grid-cols-5", LINE_FILL)}>
          {a && (
            <div className="group bg-white lg:col-span-3">
              <Reveal className="flex h-full flex-col p-3 pb-6 sm:p-4 sm:pb-8">
                <BenefitPanel index={0} className="h-[17.5rem] sm:h-[18.5rem]" />
                <BenefitText
                  index={0}
                  title={a.title}
                  body={a.body}
                  className="px-3 pt-6 sm:px-5"
                />
              </Reveal>
            </div>
          )}
          {b && (
            <div className="group bg-white lg:col-span-2">
              <Reveal delay={0.06} className="flex h-full flex-col p-3 pb-6 sm:p-4 sm:pb-8">
                <BenefitPanel index={1} className="h-[17.5rem] sm:h-[18.5rem]" />
                <BenefitText
                  index={1}
                  title={b.title}
                  body={b.body}
                  className="px-3 pt-6 sm:px-5"
                />
              </Reveal>
            </div>
          )}
          {c && (
            <div className="group bg-white lg:col-span-5">
              <Reveal className="grid gap-2 p-3 pb-6 sm:p-4 sm:pb-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-center lg:gap-6 lg:pb-4">
                <BenefitText
                  index={2}
                  title={c.title}
                  body={c.body}
                  className="order-2 px-3 pt-6 sm:px-5 lg:order-1 lg:px-8 lg:pt-0"
                />
                <BenefitPanel index={2} className="order-1 h-[20rem] sm:h-[19.5rem] lg:order-2" />
              </Reveal>
            </div>
          )}
        </div>
      </Band>
      <Band inner="flex flex-col items-center gap-2.5 px-5 py-10 text-center">
        <a href="/auth" className={SOLID_BUTTON}>
          Get started
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </a>
        <p className="text-[0.82rem] text-muted-foreground">{TRIAL_NOTE}</p>
        <p className="text-[0.78rem] text-muted-foreground">{PAID_NOTE}</p>
      </Band>
    </section>
  );
}

/* ---------- Works with ---------- */

/* The two features the `connects` copy names, either side of this one. */
const NEIGHBOURS = ["auto-publishing", "citation-tracking"] as const;

export function RedditConnects({ feature }: { feature: Feature }) {
  const [left, right] = NEIGHBOURS.map((slug) => getFeature(slug));
  const node = (f: Feature | undefined) => {
    if (!f) return null;
    const Icon = f.icon;
    return (
      <Link
        to="/features/$slug"
        params={{ slug: f.slug }}
        className="group flex h-full flex-col rounded-xl border border-ink/[0.07] bg-white p-4 shadow-[0_1px_2px_rgba(16,24,40,0.04)] transition-[border-color,transform] duration-300 hover:-translate-y-0.5 hover:border-brand-blue/30"
      >
        <span className="flex items-center justify-between">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-ink/[0.08] bg-white text-ink/70 transition-colors group-hover:text-brand-blue">
            <Icon className="h-4 w-4" />
          </span>
          <ArrowUpRight className="h-4 w-4 text-muted-foreground/60 transition-[transform,color] duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-blue" />
        </span>
        <span className="mt-4 text-[0.9rem] font-semibold text-ink">{f.name}</span>
        <span className="mt-1 text-[0.78rem] leading-relaxed text-muted-foreground">
          {f.tagline}
        </span>
      </Link>
    );
  };

  /* A joint between two cards: down/right from the thread to where its
     pickup by AI is tracked, up/left to the article it sends buyers to. */
  const joint = (towards: "left" | "right") => (
    <span className="flex justify-center sm:self-center">
      <span
        aria-hidden
        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-ink/[0.08] bg-white text-muted-foreground shadow-[0_1px_2px_rgba(16,24,40,0.05)]"
      >
        <ArrowRight
          className={cn(
            "h-3 w-3",
            towards === "left" ? "-rotate-90 sm:rotate-180" : "rotate-90 sm:rotate-0",
          )}
        />
      </span>
    </span>
  );

  return (
    <section>
      <Spacer />
      <Band>
        <div className="grid lg:grid-cols-[0.85fr_1.15fr]">
          <Reveal
            className={cn(
              "flex flex-col justify-center border-b px-6 py-10 sm:px-10 lg:border-b-0 lg:border-r lg:px-12 lg:py-14",
              LINE,
            )}
          >
            <Pill icon={Network} className="w-fit">
              Works with
            </Pill>
            <h2 className="mt-5 text-balance font-display text-[1.75rem] font-medium leading-[1.14] tracking-[-0.03em] text-ink sm:text-[2.1rem]">
              Third-party proof for <Accent>your own content</Accent>
            </h2>
            <p className="mt-4 max-w-md text-[0.95rem] leading-relaxed text-muted-foreground">
              {feature.connects}
            </p>
            <Link to="/features" className={cn(GHOST_BUTTON, "group/btn mt-6 w-fit")}>
              All features
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-0.5" />
            </Link>
          </Reveal>

          <Reveal delay={0.06} className={cn("flex items-center px-5 py-10 sm:px-8", PANEL)}>
            <div className="mx-auto flex w-full max-w-2xl flex-col gap-3 sm:flex-row sm:items-stretch">
              <div className="sm:flex-1">{node(left)}</div>
              {joint("left")}
              <div
                aria-current="page"
                className="flex flex-col rounded-xl border border-cta/25 bg-white p-4 shadow-[0_0_0_4px_color-mix(in_oklab,var(--cta)_7%,transparent),0_12px_32px_-18px_rgba(16,24,40,0.22)] sm:flex-1"
              >
                <span className="flex items-center justify-between">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#fff1eb]">
                    <RedditMark className="h-4 w-4" />
                  </span>
                  <span className="rounded-md bg-cta-soft px-1.5 py-0.5 text-[0.62rem] font-semibold text-cta">
                    You&rsquo;re here
                  </span>
                </span>
                <span className="mt-4 text-[0.9rem] font-semibold text-ink">{feature.name}</span>
                <span className="mt-1 text-[0.78rem] leading-relaxed text-muted-foreground">
                  {feature.tagline}
                </span>
              </div>
              {joint("right")}
              <div className="sm:flex-1">{node(right)}</div>
            </div>
          </Reveal>
        </div>
      </Band>
    </section>
  );
}

/* ---------- FAQ ---------- */

/* Centred, numbered, and the spam question open from the start: it's the one
   every founder asks first. Answers stay in the server HTML (forceMount) for
   the FAQPage schema the head emits from them. */
export function RedditFAQ({ feature }: { feature: Feature }) {
  return (
    <section id="faq" className="scroll-mt-16">
      <Spacer />
      <SectionHead
        icon={CircleHelp}
        eyebrow="Questions"
        title={
          <>
            {feature.name}, <Accent>answered</Accent>
          </>
        }
      />
      <Band>
        <Reveal className="mx-auto max-w-3xl px-5 py-4 sm:px-8 sm:py-6">
          <Accordion
            type="single"
            collapsible
            defaultValue="item-0"
            className="divide-y divide-ink/[0.07]"
          >
            {feature.faqs.map((f, i) => (
              <AccordionItem key={f.q} value={`item-${i}`} className="border-b-0">
                <AccordionPrimitive.Header className="flex">
                  <AccordionPrimitive.Trigger className="group flex flex-1 cursor-pointer items-center gap-4 py-5 text-left text-[0.98rem] font-medium text-ink transition-colors hover:text-brand-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta/40 focus-visible:ring-offset-2 sm:gap-6">
                    <span className="w-6 shrink-0 font-mono text-[0.75rem] tabular-nums text-muted-foreground group-data-[state=open]:text-cta">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="flex-1">{f.q}</span>
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-ink/[0.08] bg-white text-ink transition-[transform,background-color,color,border-color] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:border-brand-blue/30 group-data-[state=open]:rotate-45 group-data-[state=open]:border-brand-blue group-data-[state=open]:bg-brand-blue group-data-[state=open]:text-white">
                      <Plus className="h-3.5 w-3.5" />
                    </span>
                  </AccordionPrimitive.Trigger>
                </AccordionPrimitive.Header>
                <AccordionContent
                  forceMount
                  className="pb-5 pl-10 pr-10 text-sm leading-relaxed text-muted-foreground sm:pl-12"
                >
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </Band>
      <Band inner="flex justify-center px-5 py-6">
        <a href="/#faq" className={cn(GHOST_BUTTON, "group/btn")}>
          More about Rankbox
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-0.5" />
        </a>
      </Band>
    </section>
  );
}

/* ---------- Closing ---------- */

/* A blue band split in two: the promise on the left, and on the right the
   payoff rising from the band's foot, your own reply in the thread, which
   Rankbox only found afterwards. The comment trees from the hero return in
   white behind it. The band is --cta rather than brand blue so the white
   body text passes AA. */
export function RedditCTA({ feature }: { feature: Feature }) {
  return (
    <section aria-labelledby="cta-title">
      <Spacer />
      <Band inner="overflow-hidden bg-cta">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          {/* In the top corner, clear of the copy and above the thread. */}
          <CommentTree
            tree="b"
            tone="white"
            className="absolute -right-3 -top-10 hidden w-[13rem] -scale-x-100 opacity-80 lg:block [mask-image:linear-gradient(to_right,#000_25%,transparent_90%),linear-gradient(to_bottom,#000_40%,transparent_85%)] [mask-composite:intersect] xl:w-[15rem]"
          />
        </div>

        <div className="relative grid gap-10 px-5 pt-14 sm:px-10 lg:grid-cols-[1fr_1.05fr] lg:items-end lg:gap-12 lg:px-14 lg:pt-16">
          <Reveal className="text-center lg:pb-16 lg:text-left">
            <span className="mx-auto mb-6 flex h-11 w-11 items-center justify-center rounded-xl bg-white shadow-[0_1px_2px_rgba(4,24,72,0.2),0_8px_24px_-12px_rgba(4,24,72,0.5)] lg:mx-0">
              <RedditMark className="h-6 w-6" />
            </span>
            <h2
              id="cta-title"
              className="mx-auto max-w-xl text-balance font-display text-[2rem] font-medium leading-[1.1] tracking-[-0.03em] text-white sm:text-[2.6rem] lg:mx-0"
            >
              {feature.ctaTitle}
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-balance text-[1rem] leading-relaxed text-white sm:text-[1.05rem] lg:mx-0">
              {feature.ctaBody}
            </p>
            <a
              href="/auth"
              className="group mt-8 inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-white px-5 text-[0.95rem] font-semibold text-cta shadow-[0_1px_2px_rgba(4,24,72,0.2),0_8px_24px_-12px_rgba(4,24,72,0.5)] transition-[transform,background-color] duration-200 hover:-translate-y-0.5 hover:bg-white/95 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/40"
            >
              Get started
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
            <p className="mt-3 text-[0.82rem] text-white">{TRIAL_NOTE}</p>
            <p className="mt-1 text-[0.78rem] text-white">{PAID_NOTE}</p>
          </Reveal>

          {/* The thread rises from the band's foot and is cut off by it. */}
          <Reveal
            delay={0.12}
            y={40}
            className="mx-auto h-[15rem] w-full max-w-xl overflow-hidden sm:h-[16.5rem] lg:mx-0"
          >
            <div aria-hidden>
              <ThreadPeek />
            </div>
          </Reveal>
        </div>
      </Band>
      <Spacer closing />
    </section>
  );
}
