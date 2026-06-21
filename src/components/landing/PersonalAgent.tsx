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
    <section id="how-it-works" className="border-t border-border bg-surface/40 py-20 sm:py-24">
      <div className="mx-auto max-w-5xl px-5">
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

        <div className="relative mt-14">
          <div className="absolute left-[27px] top-2 bottom-2 hidden w-px bg-border sm:block" />
          <div className="space-y-4">
            {STEPS.map((s, i) => (
              <Reveal key={s.title} delay={i * 0.06}>
                <div className="group relative flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 shadow-elevation transition-all hover:shadow-elevation-lg sm:flex-row sm:items-center sm:gap-6 sm:p-6">
                  <div className="flex items-center gap-4 sm:gap-6">
                    <span className="font-display text-sm font-bold tabular-nums text-muted-foreground">
                      0{i + 1}
                    </span>
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-ink text-background ring-4 ring-surface/40">
                      <s.icon className="h-5 w-5" />
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base font-semibold text-ink">{s.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
                  </div>
                  <span className="w-fit shrink-0 rounded-lg border border-volt/30 bg-volt/10 px-3 py-1.5 text-xs font-medium text-ink">
                    {s.chip}
                  </span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
