import { Reveal, Avatar, Eyebrow } from "./shared";
import { CitationChip } from "./chat";
import { AI_MARKS } from "./ai-logos";
import { AVATARS } from "./avatars";

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
    avatar: AVATARS[3],
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
    avatar: AVATARS[4],
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
    avatar: AVATARS[5],
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
    avatar: AVATARS[6],
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
    avatar: AVATARS[1],
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
    avatar: AVATARS[2],
  },
] as const;

function EngineBadge({ name }: { name: string }) {
  const found = AI_MARKS.find((m) => m.name === name) ?? AI_MARKS[0];
  const Mark = found.Mark;
  return (
    <span className="flex items-center gap-1.5 text-[0.7rem] font-medium text-muted-foreground">
      <span className="flex h-5 w-5 items-center justify-center rounded-md border border-border bg-background">
        <Mark className="h-3 w-3" />
      </span>
      {name}
    </span>
  );
}

export function SuccessStories() {
  return (
    <section id="proof" className="py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5">
        <Reveal className="mx-auto max-w-2xl text-center">
          <Eyebrow className="mb-4">Real answers, real brands</Eyebrow>
          <h2 className="font-display text-balance text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Founders already getting cited
          </h2>
          <p className="mt-4 text-balance text-lg text-muted-foreground">
            From page-one rankings to getting quoted inside ChatGPT and Perplexity answers —
            early results from founders who started on brand-new domains.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {STORIES.map((s, i) => (
            <Reveal key={s.name} delay={(i % 3) * 0.06}>
              <article className="flex h-full flex-col rounded-2xl border border-border bg-card p-5 shadow-elevation transition-all hover:-translate-y-1 hover:shadow-elevation-lg">
                <div className="flex items-center justify-between gap-2">
                  <EngineBadge name={s.engine} />
                  <span className="rounded-full bg-secondary px-2 py-0.5 text-[0.65rem] font-medium text-muted-foreground">
                    {s.period}
                  </span>
                </div>

                <div className="mt-4 space-y-2.5 rounded-xl border border-border bg-surface/50 p-3.5">
                  <p className="ml-auto w-fit max-w-[90%] rounded-2xl rounded-br-sm bg-ink px-3 py-1.5 text-xs leading-snug text-background">
                    {s.question}
                  </p>
                  <p className="text-xs leading-relaxed text-ink">
                    <span className="font-semibold underline decoration-volt decoration-2 underline-offset-2">
                      {s.answer}
                    </span>{" "}
                    {s.after}
                  </p>
                </div>

                <div className="mt-4">
                  <CitationChip>{s.stat}</CitationChip>
                </div>

                <div className="mt-5 flex items-center gap-3 border-t border-border pt-4">
                  <Avatar name={s.name} src={s.avatar} className="h-9 w-9" />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-ink">{s.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{s.role}</p>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
