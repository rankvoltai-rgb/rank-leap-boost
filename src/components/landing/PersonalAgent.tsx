import { Radar, PenLine, Send, Quote } from "lucide-react";
import { Reveal, Eyebrow } from "./shared";

const STEPS = [
  {
    icon: Radar,
    title: "Maps your answer space",
    body: "Rankvolt studies what your buyers ask AI assistants and search engines, then builds a topic map you can actually win.",
    chip: "460 questions mapped",
  },
  {
    icon: PenLine,
    title: "Writes citation-ready articles",
    body: "Deeply researched, structured, and source-backed content in your brand voice — the kind AI models love to quote.",
    chip: "Score 100/100",
  },
  {
    icon: Send,
    title: "Publishes on autopilot",
    body: "Goes live daily on WordPress, Webflow, Shopify, Framer, Wix, or anywhere via webhooks — zero manual steps.",
    chip: "Published 9:00 AM",
  },
  {
    icon: Quote,
    title: "Earns the citation",
    body: "Tracks where you surface across AI answers and search, then doubles down on what gets you quoted and ranked.",
    chip: "Cited in ChatGPT",
  },
];

export function PersonalAgent() {
  return (
    <section id="how-it-works" className="border-t border-border bg-surface/40 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5">
        <Reveal className="mx-auto max-w-2xl text-center">
          <Eyebrow className="mb-4">Your GEO + SEO engine</Eyebrow>
          <h2 className="font-display text-balance text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            One agent, built to get you cited
          </h2>
          <p className="mt-4 text-balance text-lg text-muted-foreground">
            From answer-space research to writing, publishing, and tracking citations —
            Rankvolt runs your entire AI-search growth loop.
          </p>
        </Reveal>

        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:gap-6">
          {STEPS.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.06}>
              <div className="group relative h-full overflow-hidden rounded-3xl border border-border bg-card p-7 shadow-elevation transition-all duration-300 hover:-translate-y-1 hover:border-volt/40 hover:shadow-elevation-lg sm:p-8">
                {/* Volt glow on hover */}
                <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-volt/10 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />

                <div className="relative flex items-start justify-between gap-4">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-ink text-background shadow-sm transition-transform duration-300 group-hover:scale-105">
                    <s.icon className="h-5 w-5" />
                  </span>
                  <span className="font-display text-4xl font-bold tabular-nums text-border transition-colors duration-300 group-hover:text-volt/50">
                    0{i + 1}
                  </span>
                </div>

                <h3 className="relative mt-6 text-lg font-semibold text-ink">{s.title}</h3>
                <p className="relative mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>

                <div className="relative mt-6 flex items-center gap-2 border-t border-border pt-5">
                  <span className="h-1.5 w-1.5 rounded-full bg-volt" />
                  <span className="text-xs font-semibold tracking-tight text-ink">{s.chip}</span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
