import { useState } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { Reveal, Stars, Avatar, Badge } from "./shared";
import { DashboardMockup } from "./DashboardMockup";
import { AI_MARKS } from "./ai-logos";
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
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[520px] bg-hero-glow" />
      <div className="relative mx-auto max-w-6xl px-5 pb-10 pt-14 sm:pt-20 md:pt-24">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <Badge className="mb-6">The AI search growth engine for founders</Badge>
          </Reveal>

          <Reveal delay={0.04}>
            <div className="mx-auto mb-6 flex w-fit items-center gap-3 rounded-2xl border border-border bg-card/70 px-4 py-2.5 shadow-elevation backdrop-blur">
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
            <h1 className="font-display text-balance text-4xl font-extrabold leading-[1.05] tracking-tight text-ink sm:text-5xl md:text-[4rem]">
              Become the Answer AI Recommends
            </h1>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
              Rankvolt researches, writes, and publishes a daily article to your site —
              engineered so ChatGPT, Perplexity, and Google AI Overviews quote your brand
              as the answer, and Google ranks you on page one.
            </p>
          </Reveal>

          <Reveal delay={0.22}>
            <div className="mt-8 flex flex-col items-center gap-3">
              <UrlForm />
              <p className="text-xs text-muted-foreground">
                No credit card required &middot; Free 7-day trial
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.3}>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
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

        <Reveal delay={0.36} className="mt-14">
          <DashboardMockup />
        </Reveal>
      </div>
    </section>
  );
}
