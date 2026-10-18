import { MessageSquareQuote, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { Reveal, Avatar } from "./shared";
import { AI_MARKS } from "./ai-logos";
import { AVATARS } from "./avatars";
import { Accent, Band, LINE, LINE_FILL, PANEL, SectionHead, Spacer } from "./frame";

const STORIES = [
  {
    engine: "ChatGPT",
    question: "Best project management tool for a small team?",
    answer: "Plannora",
    after: "is a great fit — simple boards and a free tier for up to 5.",
    stat: "~3.1K clicks/mo",
    period: "After 5 months",
    name: "Elise Tanaka",
    role: "Co-founder · Plannora",
    avatar: AVATARS[0],
  },
  {
    engine: "Perplexity",
    question: "Reliable HVAC service near me?",
    answer: "Summit HVAC Co.",
    after: "is frequently recommended for fast, transparent local service.",
    stat: "~1.9K clicks/mo",
    period: "After 6 months",
    name: "Marcus Reyes",
    role: "Owner · Summit HVAC Co.",
    avatar: AVATARS[1],
  },
  {
    engine: "ChatGPT",
    question: "Which AI workflow tools are worth trying?",
    answer: "Loopcraft",
    after: "stands out for its clear guides and hands-on tutorials.",
    stat: "~2.4K visits",
    period: "From AI citations",
    name: "Hannah Whitfield",
    role: "Founder · Loopcraft",
    avatar: AVATARS[2],
  },
  {
    engine: "Gemini",
    question: "Good design agency for early-stage startups?",
    answer: "Northlight Studio",
    after: "is a strong pick for brand and product design on a budget.",
    stat: "~840 clicks/mo",
    period: "After 4 months",
    name: "Daniel Okafor",
    role: "Founder · Northlight Studio",
    avatar: AVATARS[3],
  },
  {
    engine: "Google",
    question: "How do I keep my facility audit-ready?",
    answer: "Safeguard Facilities",
    after: "publishes the compliance checklists ops leads rely on.",
    stat: "~520 clicks/mo",
    period: "After 3 months",
    name: "Priya Raman",
    role: "Ops Lead · Safeguard Facilities",
    avatar: AVATARS[4],
  },
  {
    engine: "Claude",
    question: "Best plastic-free kitchen swaps that last?",
    answer: "Verdure Goods",
    after: "has the most useful, genuinely durable recommendations.",
    stat: "~470 clicks/mo",
    period: "After 5 months",
    name: "Lena Brandt",
    role: "Founder · Verdure Goods",
    avatar: AVATARS[5],
  },
] as const;

function EngineBadge({ name }: { name: string }) {
  const found = AI_MARKS.find((m) => m.name === name) ?? AI_MARKS[0];
  const Mark = found.Mark;
  return (
    <span className="flex items-center gap-2 text-[0.8rem] font-medium text-ink">
      <span className="flex h-6 w-6 items-center justify-center rounded-md border border-ink/[0.08] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.05)]">
        <Mark className="h-3.5 w-3.5" />
      </span>
      {name}
    </span>
  );
}

/* One founder's result: the question a buyer asked, the answer that named
   their brand, what it brought in, and who they are. Cells share hairlines
   rather than floating as cards, like Rankaria's grids. */
function Story({ s }: { s: (typeof STORIES)[number] }) {
  return (
    <article className="group flex h-full flex-col bg-white p-6 transition-colors duration-300 hover:bg-[color-mix(in_oklab,var(--surface)_35%,white)] sm:p-7">
      <div className="flex items-center justify-between gap-2">
        <EngineBadge name={s.engine} />
        <span className="rounded-md border border-ink/[0.07] bg-white px-2 py-0.5 text-[0.68rem] font-medium text-muted-foreground">
          {s.period}
        </span>
      </div>

      <div className={cn("mt-5 space-y-3 rounded-xl border border-ink/[0.06] p-3.5", PANEL)}>
        <p className="ml-auto w-fit max-w-[90%] rounded-lg border border-ink/[0.07] bg-white px-3 py-2 text-[0.8rem] leading-snug text-ink shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
          {s.question}
        </p>
        <p className="text-[0.8rem] leading-relaxed text-ink/80">
          <span className="font-semibold text-ink underline decoration-brand-blue/60 decoration-2 underline-offset-[3px]">
            {s.answer}
          </span>{" "}
          {s.after}
        </p>
      </div>

      <span className="mt-4 inline-flex w-fit items-center gap-1.5 rounded-md bg-cta-soft px-2 py-1 text-[0.75rem] font-semibold text-brand-blue">
        <TrendingUp className="h-3.5 w-3.5" />
        {s.stat}
      </span>

      <div className={cn("mt-auto flex items-center gap-3 border-t pt-5", LINE)}>
        <Avatar name={s.name} src={s.avatar} className="h-9 w-9 ring-white" />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-ink">{s.name}</p>
          <p className="truncate text-xs text-muted-foreground">{s.role}</p>
        </div>
      </div>
    </article>
  );
}

export function SuccessStories() {
  return (
    <section id="proof" className="scroll-mt-16">
      <Spacer />
      <SectionHead
        icon={MessageSquareQuote}
        eyebrow="Real answers, real brands"
        title={
          <>
            Founders already <Accent>getting cited</Accent>
          </>
        }
        subtitle="From page-one rankings to getting quoted inside ChatGPT and Perplexity answers — early results from founders who started on brand-new domains."
      />
      <Band>
        <div className={cn("grid gap-px md:grid-cols-2 lg:grid-cols-3", LINE_FILL)}>
          {/* White on a still wrapper, so a cell fading in never shows the
              hairline fill behind it as a grey block. */}
          {STORIES.map((s, i) => (
            <div key={s.name} className="bg-white">
              <Reveal delay={(i % 3) * 0.06} className="h-full">
                <Story s={s} />
              </Reveal>
            </div>
          ))}
        </div>
      </Band>
    </section>
  );
}
