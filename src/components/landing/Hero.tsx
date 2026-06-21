import { useState } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { Reveal, Stars, Avatar } from "./shared";
import { ChatAnswerCard } from "./chat";
import { AI_MARKS } from "./ai-logos";
import { RotatingEngine } from "./RotatingEngine";
import { AVATARS } from "./avatars";

const FACES = [
  { name: "Priya Raman", src: AVATARS[3] },
  { name: "Marco Silva", src: AVATARS[4] },
  { name: "Hannah Whitfield", src: AVATARS[5] },
  { name: "Daniel Okafor", src: AVATARS[6] },
  { name: "Lena Brandt", src: AVATARS[1] },
];

function UrlForm() {
  const [url, setUrl] = useState("");
  const go = () => {
    const q = url.trim() ? `?url=${encodeURIComponent(url.trim())}` : "";
    window.location.href = `/auth${q}`;
  };
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        go();
      }}
      className="group flex w-full max-w-xl flex-col gap-2 rounded-2xl border border-border bg-card p-2 shadow-elevation transition-all focus-within:shadow-elevation-lg sm:flex-row sm:items-center sm:rounded-full"
    >
      <div className="flex flex-1 items-center gap-2.5 px-3">
        <Sparkles className="h-4 w-4 shrink-0 text-muted-foreground" />
        <input
          type="text"
          inputMode="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter your website URL"
          className="w-full bg-transparent py-2.5 text-sm text-ink outline-none placeholder:text-muted-foreground"
          aria-label="Website URL"
        />
      </div>
      <button
        type="submit"
        className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-ink px-6 py-3 text-sm font-semibold text-background shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 sm:rounded-full"
      >
        Get Started Free
        <ArrowRight className="h-4 w-4 transition-transform group-focus-within:translate-x-0.5" />
      </button>
    </form>
  );
}

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-dotgrid opacity-60 [mask-image:radial-gradient(60%_50%_at_50%_0%,black,transparent)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[520px] bg-hero-glow" />
      <div className="relative mx-auto max-w-7xl px-5 pb-16 pt-14 sm:pt-20 lg:pt-28">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-12 xl:gap-16">
          {/* LEFT — copy */}
          <div className="mx-auto max-w-2xl text-center lg:mx-0 lg:max-w-xl lg:text-left">
            <Reveal delay={0.04}>
              <div className="mx-auto mb-6 flex w-fit items-center gap-3 rounded-2xl border border-border bg-card/70 px-4 py-2.5 shadow-elevation backdrop-blur lg:mx-0">
                <span className="text-xs font-medium text-muted-foreground">Cited across</span>
                <div className="flex items-center gap-2.5">
                  {AI_MARKS.map(({ name, Mark }) => (
                    <span
                      key={name}
                      title={name}
                      className="flex h-7 w-7 items-center justify-center rounded-lg border border-border bg-background transition-transform hover:-translate-y-0.5"
                    >
                      <Mark className="h-4 w-4" />
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.08}>
              <h1 className="font-display text-balance text-4xl font-semibold leading-[1.08] tracking-tight text-ink sm:text-5xl lg:text-[3.5rem] xl:text-[3.85rem]">
                {/* Visually-hidden, crawler + screen-reader friendly full sentence */}
                <span className="sr-only">
                  Get AI Traffic from ChatGPT, Claude, Gemini and other AI on Autopilot
                </span>
                {/* Visual headline: the rotating glass logo stands in for the engine names */}
                <span aria-hidden className="inline">
                  Get <span className="text-[oklch(0_0_0)]">AI Traffic</span> from{" "}
                  <RotatingEngine className="mx-0.5" /> on Autopilot
                </span>
              </h1>
            </Reveal>

            <Reveal delay={0.16}>
              <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground lg:mx-0">
                Publishes daily articles engineered to get your brand cited when buyers ask
                ChatGPT, Claude, Perplexity, and Google AI Overviews — fully on autopilot.
              </p>
            </Reveal>

            <Reveal delay={0.22}>
              <div className="mt-8 flex flex-col items-center gap-3 lg:items-start">
                <UrlForm />
                <p className="text-xs text-muted-foreground">
                  No credit card required &middot; Free 7-day trial
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.3}>
              <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
                <div className="flex -space-x-2">
                  {FACES.map((f) => (
                    <Avatar key={f.name} name={f.name} src={f.src} className="h-9 w-9" />
                  ))}
                </div>
                <div className="flex flex-col items-center sm:items-start">
                  <Stars />
                  <p className="text-sm text-muted-foreground">
                    <span className="font-semibold text-ink">400+</span> founders growing with Rankvolt
                  </p>
                </div>
              </div>
            </Reveal>
          </div>

          {/* RIGHT — chat answer card */}
          <Reveal delay={0.36} y={28} className="mx-auto w-full max-w-xl lg:mx-0">
            <div className="relative">
              {/* layered backdrop */}
              <div className="pointer-events-none absolute -inset-6 -z-10 rounded-[2rem] bg-volt/10 blur-3xl" />
              <div className="pointer-events-none absolute inset-x-6 -bottom-4 top-8 -z-10 rounded-3xl border border-border bg-card/60 shadow-elevation" />
              <div className="animate-hero-float">
                <ChatAnswerCard
                  engine="ChatGPT"
                  prompt="What's the best project management tool for a small startup team?"
                  meta="Searched 24 sources · writing answer"
                  answer={
                    <>
                      For lean startup teams,{" "}
                      <span className="font-semibold text-ink underline decoration-volt decoration-2 underline-offset-2">
                        Plannora
                      </span>{" "}
                      is widely recommended — simple boards, built-in automations, and a free tier for
                      up to 5 people. It's frequently cited as the easiest tool to set up.
                    </>
                  }
                  sources={["plannora.io", "loopcraft.ai", "yardstick.team"]}
                />
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
