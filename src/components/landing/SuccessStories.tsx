import { Reveal, Avatar, SectionHeading } from "./shared";
import { MiniLine } from "./charts";

const STORIES = [
  {
    niche: "Catholic media / E-commerce",
    stat: "~12K clicks/month",
    period: "After 6 months on RankPill",
    body: "A niche Catholic media Shopify store covering Eucharistic Miracles, Marian Apparitions, and the Saints. RankPill set up in minutes and started covering every topic their audience searches for.",
    name: "Raymond Joseph Freyaldenhoven",
    role: "President at Journeys of Faith",
    pts: [4, 8, 6, 14, 18, 26, 30, 42, 60],
  },
  {
    niche: "Local business",
    stat: "~6K clicks/month",
    period: "After 8 months on RankPill",
    body: "A founder who used to procrastinate on content because consistency felt daunting. Eight months on RankPill: traffic up roughly 7x and the mental load of publishing gone.",
    name: "Matt Wentzell",
    role: "Founder at MountainHP",
    pts: [10, 14, 22, 18, 40, 60, 120, 160, 200],
  },
  {
    niche: "SaaS / AI tools",
    stat: "~4.6K clicks",
    period: "From one article cited by ChatGPT",
    body: "We set up RankPill once, forgot about it, and came back to find one article had pulled in 4.6K visitors from ChatGPT alone — before counting Google and every other AI engine.",
    name: "Modest Mitkus",
    role: "Founder at CreateSell",
    pts: [2, 3, 5, 9, 20, 45, 80, 130, 180],
  },
  {
    niche: "Design agency",
    stat: "~1K clicks/month",
    period: "After 6 months on RankPill",
    body: "A startup that couldn't outbid established players on paid keywords used RankPill to fix their thin content problem. Search Console clicks climbed to roughly 1,000 a month at peak.",
    name: "Gethin",
    role: "Founder at Futur Web",
    pts: [1, 4, 3, 8, 12, 20, 26, 33, 40],
  },
  {
    niche: "Fire safety / B2B services",
    stat: "~558 clicks/month",
    period: "After 2 months on RankPill",
    body: "RankPill automated the blog at Firesurv Group Ltd and delivered well-optimised, service-focused content that improved visibility across key services without adding to the team's workload.",
    name: "Daniel Watson",
    role: "Operations Director at Firesurv",
    pts: [3, 6, 10, 18, 28, 40, 52, 55, 56],
  },
  {
    niche: "Beauty / Hair salon",
    stat: "~530 clicks/month",
    period: "After 7 months on RankPill",
    body: "RankPill handled the entire content lifecycle on autopilot. Deep competitor analysis, daily publishing, and 3,000-word articles that actually rank.",
    name: "MG Hair Studios",
    role: "Owner",
    pts: [2, 5, 8, 12, 20, 30, 44, 50, 53],
  },
];

export function SuccessStories() {
  return (
    <section id="success-stories" className="py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-5">
        <SectionHeading
          title="Success Stories From Our Customers"
          subtitle="From ranking on Google to getting cited by ChatGPT. Real numbers from real businesses, many starting from a brand new domain with zero authority."
        />
        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {STORIES.map((s, i) => (
            <Reveal key={s.name} delay={(i % 3) * 0.06}>
              <article className="flex h-full flex-col rounded-2xl border border-border bg-card p-6 transition-shadow hover:shadow-md">
                <span className="text-xs font-medium text-muted-foreground">{s.niche}</span>
                <p className="mt-1 text-2xl font-bold tracking-tight text-ink">{s.stat}</p>
                <p className="text-xs text-muted-foreground">{s.period}</p>
                <div className="my-4 rounded-xl border border-border bg-surface/60 p-3">
                  <MiniLine points={s.pts} className="h-16 w-full" stroke="var(--success)" />
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">{s.body}</p>
                <div className="mt-5 flex items-center gap-3 border-t border-border pt-4">
                  <Avatar name={s.name} className="h-9 w-9" />
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