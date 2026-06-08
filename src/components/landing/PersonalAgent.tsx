import { Sparkles, PenLine, Send, Link2 } from "lucide-react";
import { Reveal } from "./shared";

const FEATURES = [
  {
    icon: Sparkles,
    title: "Personalized SEO plan",
    body: "AI analyzes your business and competitors to find your highest-potential keywords automatically.",
  },
  {
    icon: PenLine,
    title: "Writes articles daily",
    body: "Traffic-optimized content with images, internal links, and citations in your brand voice.",
  },
  {
    icon: Send,
    title: "Publishes to your site",
    body: "Direct to WordPress, Webflow, Shopify, Framer, Wix, or any platform via webhooks.",
  },
  {
    icon: Link2,
    title: "Builds backlinks for you",
    body: "Verified site exchanges in your niche grow your domain authority on autopilot.",
  },
];

export function PersonalAgent() {
  return (
    <section id="whats-inside" className="border-t border-border bg-surface/40 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-5">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="mb-4 inline-block rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
            SEO/GEO Expert
          </span>
          <h2 className="text-balance text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Your Personal Agent
          </h2>
          <p className="mt-4 text-balance text-lg text-muted-foreground">
            Researches keywords, writes daily articles, finds ranking opportunities,
            and builds backlinks for you.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={i * 0.06}>
              <div className="h-full rounded-2xl border border-border bg-card p-6 transition-shadow hover:shadow-md">
                <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-ink text-background">
                  <f.icon className="h-5 w-5" />
                </span>
                <h3 className="text-base font-semibold text-ink">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}