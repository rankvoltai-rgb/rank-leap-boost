/**
 * The landing page's pricing, in the page frame: the price on white on the
 * left, one month of the plan on the grey panel on the right, split by a
 * hairline instead of sitting in a floating card.
 *
 * Same content and pieces as <Pricing>, which other pages still use in its
 * card form.
 */
import { ArrowRight, Check, Tag } from "lucide-react";
import { cn } from "@/lib/utils";
import { Reveal, Stars } from "./shared";
import { BrandTile } from "./used-by";
import { BRANDS } from "@/data/brands";
import { PLAN, TRIAL_DAYS, formatUsd, priceFor } from "@/data/pricing";
import { INCLUDED, MonthGrid, MonthStat, PLATFORMS } from "./Pricing";
import { Accent, Band, LINE, PANEL, SectionHead, Spacer } from "./frame";

export function PricingBand() {
  const price = priceFor();

  return (
    <section id="pricing" className="scroll-mt-16">
      <Spacer />
      <SectionHead
        icon={Tag}
        eyebrow="Simple pricing"
        title={
          <>
            One plan, <Accent>your whole growth loop</Accent>
          </>
        }
        subtitle="Research, a new article every day, auto-publishing and authority backlinks, for less than you'd pay for a single freelance article."
      />
      <Band>
        <div className="grid lg:grid-cols-[1fr_1.1fr]">
          {/* LEFT — the price and the one decision */}
          <Reveal className="flex flex-col px-6 py-10 sm:px-10 sm:py-12 lg:px-14">
            <div className="flex items-center gap-2.5">
              <h3 className="text-xl font-semibold tracking-tight text-ink">{PLAN.name}</h3>
              <span className="rounded-md bg-cta-soft px-2 py-0.5 text-xs font-medium text-cta-hover">
                {PLAN.sites} website
              </span>
            </div>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Everything Rankbox does, in one plan.
            </p>

            <div className="mt-7 flex items-end gap-2">
              <span className="font-display text-6xl font-semibold leading-none tracking-[-0.04em] text-ink sm:text-7xl">
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
              className="group mt-7 inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-cta px-6 text-[0.95rem] font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.16),0_1px_2px_rgba(16,24,40,0.14)] transition-[background-color,transform] duration-150 hover:bg-cta-hover active:scale-[0.99] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cta/25"
            >
              Get Started Free
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
            <p className="mt-3 text-center text-xs text-muted-foreground">
              No card to sign up. {TRIAL_DAYS} days free, then {formatUsd(PLAN.monthly)}/month.
              Cancel anytime.
            </p>

            <ul className={cn("mt-8 space-y-3 border-t pt-7", LINE)}>
              {INCLUDED.map((f) => (
                <li key={f} className="flex items-start gap-3 text-sm text-ink">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-cta-soft text-brand-blue">
                    <Check className="h-3 w-3" strokeWidth={3} />
                  </span>
                  {f}
                </li>
              ))}
            </ul>

            <div className="mt-auto pt-8">
              <div
                className={cn(
                  "flex flex-col items-start gap-3 border-t pt-6 min-[420px]:flex-row min-[420px]:items-center",
                  LINE,
                )}
              >
                <div className="flex -space-x-2">
                  {BRANDS.map((brand) => (
                    <BrandTile
                      key={brand.name}
                      brand={brand}
                      label={null}
                      className="h-9 w-9 ring-2 ring-white"
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
            </div>
          </Reveal>

          {/* RIGHT — what one month of the plan looks like */}
          <div
            className={cn(
              "flex flex-col border-t px-6 py-10 sm:px-10 sm:py-12 lg:border-l lg:border-t-0 lg:px-12",
              LINE,
              PANEL,
            )}
          >
            <p className="text-sm font-semibold text-ink">Your month on Rankbox</p>
            <p className="mt-1 text-sm text-muted-foreground">
              A new article researched, written and published every day.
            </p>

            <div className="mt-5">
              <MonthGrid />
            </div>

            <dl className="mt-5 grid grid-cols-2 divide-x divide-ink/[0.07] rounded-xl border border-ink/[0.07] bg-white">
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
                    className="inline-flex items-center gap-1.5 rounded-md border border-ink/[0.08] bg-white py-1 pl-1.5 pr-2.5 text-xs font-medium text-ink"
                  >
                    <Mark className="h-4 w-4" />
                    {name}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Band>
    </section>
  );
}
