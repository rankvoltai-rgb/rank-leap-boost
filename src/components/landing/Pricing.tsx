import { MotionConfig, motion } from "motion/react";
import { Check, ArrowRight } from "lucide-react";
import { Reveal, Eyebrow, Stars } from "./shared";
import { BrandTile } from "./used-by";
import { BRANDS } from "@/data/brands";
import { PLAN, TRIAL_DAYS, formatUsd, priceFor } from "@/data/pricing";
import {
  BingMark,
  ChatGPTMark,
  ClaudeMark,
  GeminiMark,
  GoogleMark,
  PerplexityMark,
} from "./ai-logos";

// The daily articles and the backlink credits are shown on the month panel,
// so this list holds only what the panel doesn't.
const INCLUDED = [
  "Answer-space research plan, tailored to your buyers",
  "2,500+ word, source-backed articles",
  "Auto-published to your website",
  "Images, links and promotion handled for you",
  "Unlimited rewrites and team members",
];

const PLATFORMS = [
  { name: "Google", Mark: GoogleMark },
  { name: "ChatGPT", Mark: ChatGPTMark },
  { name: "Claude", Mark: ClaudeMark },
  { name: "Gemini", Mark: GeminiMark },
  { name: "Perplexity", Mark: PerplexityMark },
  { name: "Bing", Mark: BingMark },
] as const;

/* Title and body line widths per day, so the month reads as thirty different
   articles rather than one tile repeated. Fixed rather than random, so the
   server and the client render the same grid. Six columns because 30 fills
   six by five exactly; a seven-day week leaves days 29 and 30 on a row alone. */
const DAYS = Array.from({ length: PLAN.articlesPerMonth }, (_, i) => ({
  day: i + 1,
  title: 55 + ((i * 37) % 35),
  body: 35 + ((i * 53) % 40),
}));

const EASE = [0.21, 0.47, 0.32, 0.98] as const;

/* The section's one moment of motion: the month publishes itself, day 1 to
   day 30, when the card scrolls into view. With reduced motion the tiles
   fade in without moving. */
function MonthGrid() {
  return (
    <MotionConfig reducedMotion="user">
      <motion.div
        role="img"
        aria-label={`${PLAN.articlesPerMonth} days, with one article published on each`}
        className="grid grid-cols-6 gap-1.5 sm:gap-2"
        initial="hidden"
        whileInView="shown"
        viewport={{ once: true, margin: "-120px" }}
        variants={{
          hidden: {},
          shown: { transition: { staggerChildren: 0.035, delayChildren: 0.3 } },
        }}
      >
        {DAYS.map((d) => (
          <div
            key={d.day}
            aria-hidden
            className="relative aspect-square rounded-lg border border-dashed border-border sm:aspect-[3/2]"
          >
            <motion.div
              variants={{
                hidden: { opacity: 0, scale: 0.85 },
                shown: { opacity: 1, scale: 1 },
              }}
              transition={{ duration: 0.35, ease: EASE }}
              className="absolute -inset-px flex flex-col justify-between rounded-lg border border-border bg-card p-1.5 shadow-1 sm:p-2"
            >
              <span className="text-[0.625rem] font-medium leading-none text-muted-foreground tabular-nums">
                {d.day}
              </span>
              <span className="flex flex-col gap-1">
                <span
                  className="block h-1 rounded-full bg-brand-blue"
                  style={{ width: `${d.title}%` }}
                />
                <span
                  className="block h-1 rounded-full bg-brand-blue/20"
                  style={{ width: `${d.body}%` }}
                />
              </span>
            </motion.div>
          </div>
        ))}
      </motion.div>
    </MotionConfig>
  );
}

function MonthStat({ value, label }: { value: number; label: string }) {
  return (
    <div className="px-4 py-3.5 sm:px-5">
      <dt className="sr-only">{label}</dt>
      <dd>
        <span className="font-display block text-3xl font-semibold leading-none tracking-tight text-ink tabular-nums">
          {value}
        </span>
        <span className="mt-1.5 block text-xs leading-snug text-muted-foreground" aria-hidden>
          {label}
        </span>
      </dd>
    </div>
  );
}

export function Pricing() {
  const price = priceFor();

  return (
    <section id="pricing" className="py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5">
        <Reveal className="mx-auto max-w-2xl text-center">
          <Eyebrow className="mb-4">Simple pricing</Eyebrow>
          <h2 className="font-display text-balance text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            One plan, your whole growth loop
          </h2>
          <p className="mt-4 text-balance text-lg text-muted-foreground">
            Research, a new article every day, auto-publishing and authority backlinks, for less
            than you'd pay for a single freelance article.
          </p>
        </Reveal>

        <Reveal delay={0.05} className="mx-auto mt-12 max-w-5xl">
          <div className="grid overflow-hidden rounded-3xl border border-border bg-card shadow-4 lg:grid-cols-[1fr_1.1fr]">
            {/* LEFT — the price and the one decision */}
            <div className="flex flex-col p-6 sm:p-10">
              <div className="flex items-center gap-2.5">
                <h3 className="text-xl font-semibold tracking-tight text-ink">{PLAN.name}</h3>
                <span className="rounded-full bg-cta-soft px-2.5 py-0.5 text-xs font-medium text-cta-hover">
                  {PLAN.sites} website
                </span>
              </div>
              <p className="mt-1.5 text-sm text-muted-foreground">
                Everything Rankbox does, in one plan.
              </p>

              <div className="mt-7 flex items-end gap-2">
                <span className="font-display text-6xl font-bold leading-none tracking-tight text-ink sm:text-7xl">
                  {formatUsd(price.perMonth)}
                </span>
                <span className="mb-1.5 text-base text-muted-foreground">/month</span>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">
                Works out to{" "}
                <span className="font-semibold text-ink tabular-nums">
                  {formatUsd(price.perArticle)}
                </span>{" "}
                an article, all-in.
              </p>

              <a
                href="/auth"
                className="group mt-7 inline-flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-cta px-6 text-base font-semibold text-white shadow-2 transition-all hover:-translate-y-0.5 hover:bg-cta-hover hover:shadow-3 focus-visible:outline-none focus-visible:ring-focus"
              >
                Get Started Free
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </a>
              <p className="mt-3 text-center text-xs text-muted-foreground">
                No card to sign up. {TRIAL_DAYS} days free, then {formatUsd(PLAN.monthly)}/month.
                Cancel anytime.
              </p>

              <ul className="mt-8 space-y-3 border-t border-border pt-7">
                {INCLUDED.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm text-ink">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-blue/10 text-brand-blue">
                      <Check className="h-3 w-3" strokeWidth={3} />
                    </span>
                    {f}
                  </li>
                ))}
              </ul>

              <div className="mt-auto pt-8">
                <div className="flex flex-col items-start gap-3 border-t border-border pt-6 min-[420px]:flex-row min-[420px]:items-center">
                  <div className="flex -space-x-2">
                    {BRANDS.map((brand) => (
                      <BrandTile
                        key={brand.name}
                        brand={brand}
                        className="h-9 w-9 ring-2 ring-card"
                      />
                    ))}
                  </div>
                  <div>
                    <Stars />
                    <p className="text-sm text-muted-foreground">
                      <span className="font-semibold text-ink">400+</span> brands growing with
                      Rankbox
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT — what one month of the plan looks like */}
            <div className="flex flex-col border-t border-border bg-surface/70 p-6 sm:p-10 lg:border-l lg:border-t-0">
              <p className="text-sm font-semibold text-ink">Your month on Rankbox</p>
              <p className="mt-1 text-sm text-muted-foreground">
                A new article researched, written and published every day.
              </p>

              <div className="mt-5">
                <MonthGrid />
              </div>

              <dl className="mt-5 grid grid-cols-2 divide-x divide-border rounded-2xl border border-border bg-card">
                <MonthStat value={PLAN.articlesPerMonth} label="articles published to your site" />
                <MonthStat
                  value={PLAN.backlinkCreditsPerMonth}
                  label="backlink credits, from your first paid month"
                />
              </dl>

              <div className="mt-auto pt-7">
                <p className="text-xs text-muted-foreground">
                  Optimized for every major search platform
                </p>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {PLATFORMS.map(({ name, Mark }) => (
                    <li
                      key={name}
                      className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card py-1 pl-1.5 pr-2.5 text-xs font-medium text-ink"
                    >
                      <Mark className="h-4 w-4" />
                      {name}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
