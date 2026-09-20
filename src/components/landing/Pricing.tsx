import { Check, ArrowRight } from "lucide-react";
import { Reveal, Eyebrow, Stars } from "./shared";
import { BrandTile } from "./used-by";
import { BRANDS } from "@/data/brands";
import { PLAN, TRIAL_DAYS, formatUsd } from "@/data/pricing";
import { BingMark, ChatGPTMark, ClaudeMark, GeminiMark, GoogleMark, PerplexityMark } from "./ai-logos";

const INCLUDED = [
  "Answer-space research plan",
  "30 GEO/SEO articles (1 daily)",
  "2,500+ word, source-backed articles",
  "Auto-publish to your website",
  "30 authority backlink credits monthly",
  "Auto images, links & promotion",
  "Unlimited rewrites & team members",
];

const HIGHLIGHTS = [
  ["Answer-Space Research", "Tailored to your buyers"],
  ["Daily Articles", "30 articles every month"],
  ["Authority Backlinks", "Verified dofollow links"],
  ["Auto-Publishing", "Zero manual work"],
  ["Cited by AI", "Built to be the answer"],
];

const PLATFORMS = [
  { name: "Google", Mark: GoogleMark },
  { name: "ChatGPT", Mark: ChatGPTMark },
  { name: "Claude", Mark: ClaudeMark },
  { name: "Gemini", Mark: GeminiMark },
  { name: "Perplexity", Mark: PerplexityMark },
  { name: "Bing", Mark: BingMark },
] as const;

export function Pricing() {
  return (
    <section id="pricing" className="py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5">
        <Reveal className="mx-auto max-w-2xl text-center">
          <Eyebrow className="mb-4">Simple pricing</Eyebrow>
          <h2 className="font-display text-balance text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            One plan, your whole growth loop
          </h2>
          <p className="mt-4 text-balance text-lg text-muted-foreground">
            Answer-space research, daily articles, auto-publishing, and authority backlinks in one
            simple plan — for less than you'd pay for a single freelance article.
          </p>
        </Reveal>

        <div className="mt-12 grid items-start gap-8 lg:grid-cols-2">
          {/* Plan card */}
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl border border-volt/40 bg-card p-8 shadow-[0_30px_80px_-50px_rgba(0,0,0,0.45)] ring-1 ring-volt/20">
              <p className="text-xs font-medium text-muted-foreground">1 website</p>
              <h3 className="mt-1 text-2xl font-semibold text-ink">Business</h3>
              <p className="text-sm text-muted-foreground">All-in-one growth package</p>
              <div className="mt-5 flex items-end gap-2">
                <span className="text-5xl font-bold tracking-tight text-ink">
                  {formatUsd(PLAN.monthly)}
                </span>
                <span className="mb-1 text-sm text-muted-foreground">/month</span>
              </div>
              <a
                href="#top"
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-ink px-6 py-3.5 text-sm font-semibold text-background transition-transform hover:-translate-y-0.5"
              >
                Get Traffic on Autopilot <ArrowRight className="h-4 w-4" />
              </a>
              <p className="mt-2 text-center text-xs text-muted-foreground">
                {TRIAL_DAYS} days free, then {formatUsd(PLAN.monthly)}/month. Cancel anytime.
              </p>

              <ul className="mt-6 space-y-3 border-t border-border pt-6">
                {INCLUDED.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-ink">
                    <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-brand-blue/10 text-brand-blue">
                      <Check className="h-3 w-3" />
                    </span>
                    {f}
                  </li>
                ))}
              </ul>

              <div className="mt-6 border-t border-border pt-5">
                <p className="mb-3 text-xs text-muted-foreground">Optimized for all major search platforms</p>
                <div className="flex flex-wrap gap-2">
                  {PLATFORMS.map(({ name, Mark }) => (
                    <span
                      key={name}
                      title={name}
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card"
                    >
                      <Mark className="h-5 w-5" />
                      <span className="sr-only">{name}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>

          {/* Highlights + social proof */}
          <Reveal delay={0.08} className="flex flex-col gap-4">
            {HIGHLIGHTS.map((h) => (
              <div key={h[0]} className="flex items-start gap-3 rounded-2xl border border-border bg-card p-5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-blue/10 text-brand-blue">
                  <Check className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-ink">{h[0]}</p>
                  <p className="text-sm text-muted-foreground">{h[1]}</p>
                </div>
              </div>
            ))}
            <div className="mt-1 flex items-center gap-3 rounded-2xl border border-border bg-surface/50 p-5">
              <div className="flex -space-x-2">
                {BRANDS.map((brand) => (
                  <BrandTile
                    key={brand.name}
                    brand={brand}
                    className="h-9 w-9 ring-2 ring-background"
                  />
                ))}
              </div>
              <div>
                <Stars />
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold text-ink">400+</span> brands growing with Rankbox
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}