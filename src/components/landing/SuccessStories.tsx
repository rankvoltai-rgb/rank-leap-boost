import { Reveal, Avatar, SectionHeading } from "./shared";
import { MiniLine } from "./charts";
import { AVATARS } from "./avatars";

const STORIES = [
  {
    niche: "B2B SaaS",
    stat: "~3.1K clicks/month",
    period: "After 5 months on Rankvolt",
    body: "A small project-management tool that couldn't out-spend incumbents on ads. Rankvolt covered every comparison and how-to their buyers search, and the steady articles compounded into reliable signups.",
    name: "Elise Tanaka",
    role: "Co-founder at Plannora",
    avatar: AVATARS[3],
    pts: [3, 6, 5, 11, 15, 22, 27, 34, 48],
  },
  {
    niche: "Local services",
    stat: "~1.9K clicks/month",
    period: "After 6 months on Rankvolt",
    body: "A founder who kept putting off content because consistency felt impossible. Six months in, publishing runs itself and steady local traffic finally turned the blog into a real lead channel.",
    name: "Marcus Reyes",
    role: "Owner at Summit HVAC Co.",
    avatar: AVATARS[4],
    pts: [6, 9, 14, 12, 22, 30, 41, 48, 60],
  },
  {
    niche: "AI tools",
    stat: "~2.4K visits",
    period: "From articles cited in AI answers",
    body: "We set Rankvolt up once and almost forgot about it. A few months later a handful of our guides were getting quoted directly inside ChatGPT and Perplexity answers — visitors arrived already convinced.",
    name: "Hannah Whitfield",
    role: "Founder at Loopcraft",
    avatar: AVATARS[5],
    pts: [1, 2, 4, 7, 14, 28, 45, 68, 90],
  },
  {
    niche: "Design agency",
    stat: "~840 clicks/month",
    period: "After 4 months on Rankvolt",
    body: "A young agency with thin content and zero domain authority used Rankvolt to publish consistently for the first time. Search clicks climbed past 800 a month and inbound finally started trickling in.",
    name: "Daniel Okafor",
    role: "Founder at Northlight Studio",
    avatar: AVATARS[6],
    pts: [1, 3, 3, 7, 11, 17, 22, 29, 34],
  },
  {
    niche: "B2B services",
    stat: "~520 clicks/month",
    period: "After 3 months on Rankvolt",
    body: "Rankvolt took over the blog and shipped well-structured, service-focused articles that lifted visibility across their key offerings — without adding anything to the team's plate.",
    name: "Priya Raman",
    role: "Ops Lead at Safeguard Facilities",
    avatar: AVATARS[1],
    pts: [2, 5, 9, 16, 24, 33, 44, 50, 52],
  },
  {
    niche: "E-commerce",
    stat: "~470 clicks/month",
    period: "After 5 months on Rankvolt",
    body: "Rankvolt ran the whole content lifecycle on autopilot — answer-space research, daily publishing, and long-form buying guides that actually rank and pull in product-ready shoppers.",
    name: "Lena Brandt",
    role: "Founder at Verdure Goods",
    avatar: AVATARS[2],
    pts: [1, 4, 7, 11, 18, 27, 38, 44, 47],
  },
];

export function SuccessStories() {
  return (
    <section id="proof" className="py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-5">
        <SectionHeading
          title="Founders Already Getting Cited"
          subtitle="From page-one rankings to getting quoted inside ChatGPT and Perplexity answers. Early results from founders who started on brand-new domains with zero authority."
        />
        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {STORIES.map((s, i) => (
            <Reveal key={s.name} delay={(i % 3) * 0.06}>
              <article className="flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-elevation transition-all hover:-translate-y-1 hover:shadow-elevation-lg">
                <span className="text-xs font-medium text-muted-foreground">{s.niche}</span>
                <p className="mt-1 text-2xl font-bold tracking-tight text-ink">{s.stat}</p>
                <p className="text-xs text-muted-foreground">{s.period}</p>
                <div className="my-4 rounded-xl border border-border bg-surface/60 p-3">
                  <MiniLine points={s.pts} className="h-16 w-full" stroke="var(--success)" />
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">{s.body}</p>
                <div className="mt-5 flex items-center gap-3 border-t border-border pt-4">
                  <Avatar name={s.name} src={s.avatar} className="h-9 w-9" />
                  <div>
                    <p className="text-sm font-semibold text-ink">{s.name}</p>
                    <p className="text-xs text-muted-foreground">{s.role}</p>
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