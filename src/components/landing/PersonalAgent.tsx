import { Radar, PenLine, Send, Quote } from "lucide-react";
import { Reveal } from "./shared";

const FEATURES = [
  {
    icon: Radar,
    title: "Maps your answer space",
    body: "Rankvolt studies what your buyers ask AI assistants and search engines, then builds a topic map you can actually win.",
  },
  {
    icon: PenLine,
    title: "Writes citation-ready articles",
    body: "Deeply researched, structured, and source-backed content in your brand voice — the kind AI models love to quote.",
  },
  {
    icon: Send,
    title: "Publishes on autopilot",
    body: "Goes live daily on WordPress, Webflow, Shopify, Framer, Wix, or anywhere via webhooks — zero manual steps.",
  },
  {
    icon: Quote,
    title: "Earns the citation",
    body: "Tracks where you surface across AI answers and search, then doubles down on what gets you quoted and ranked.",
  },
];

export function PersonalAgent() {
  return (
    <section id="how-it-works" className="border-t border-border bg-surface/40 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-5">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="mb-4 inline-block rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
            Your GEO + SEO Engine
          </span>
          <h2 className="font-display text-balance text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            One Agent, Built to Get You Cited
          </h2>
          <p className="mt-4 text-balance text-lg text-muted-foreground">
            From answer-space research to writing, publishing, and tracking citations —
            Rankvolt runs your entire AI-search growth loop.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={i * 0.06}>
              <div className="h-full rounded-2xl border border-border bg-card p-6 shadow-elevation transition-all hover:-translate-y-1 hover:shadow-elevation-lg">
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