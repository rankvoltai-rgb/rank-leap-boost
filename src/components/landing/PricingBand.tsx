/**
 * The landing page's pricing, built around one number.
 *
 * The plan is a single price, so the section gives it the whole stage: a
 * toggle between "per month" and "per article", and the figure counts between
 * $49.50 and $1.65 as it switches, so the per-article value is felt rather
 * than footnoted. Under it, the month the price buys is one strip of 30
 * days that fill as the section scrolls in; per article, they dim to the one
 * day a single price pays for.
 *
 * What's included follows as six hairline cells, then one band of proof.
 * Every figure comes from data/pricing; the inclusions and platforms are the
 * same lists <Pricing> shows on other pages.
 */
import { useEffect, useRef, useState, type ComponentType } from "react";
import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import { ArrowRight, FileText, ImageIcon, Link2, Search, Send, Tag, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { Reveal, Stars } from "./shared";
import { BrandTile } from "./used-by";
import { BRANDS } from "@/data/brands";
import { PLAN, TRIAL_DAYS, formatUsd, priceFor } from "@/data/pricing";
import { INCLUDED, PLATFORMS } from "./Pricing";
import { Accent, Band, LINE, LINE_FILL, SectionHead, Spacer } from "./frame";

type Mode = "month" | "article";

const EASE = [0.16, 1, 0.3, 1] as const;

/* An icon per inclusion, in INCLUDED's order (research, articles, publishing,
   images and links, rewrites and team). Search stands in if the list grows. */
const INCLUDED_ICONS: ComponentType<{ className?: string }>[] = [
  Search,
  FileText,
  Send,
  ImageIcon,
  Users,
];

/* The price, counting to its new value when the mode switches: down from the
   month to the article, back up again. */
function Price({ value, still }: { value: number; still: boolean }) {
  const spring = useSpring(value, { stiffness: 90, damping: 20, mass: 0.9 });
  const text = useTransform(spring, (v) => formatUsd(Math.round(v * 100) / 100));
  useEffect(() => {
    if (still) spring.jump(value);
    else spring.set(value);
  }, [value, still, spring]);
  return <motion.span className="tabular-nums">{text}</motion.span>;
}

function ModeToggle({ mode, onChange }: { mode: Mode; onChange: (m: Mode) => void }) {
  const options: { id: Mode; label: string }[] = [
    { id: "month", label: "Per month" },
    { id: "article", label: "Per article" },
  ];
  return (
    <div
      role="group"
      aria-label="Show the price"
      className="inline-flex gap-1 rounded-lg border border-ink/[0.08] bg-white p-1 shadow-[0_1px_2px_rgba(16,24,40,0.04)]"
    >
      {options.map((o) => {
        const on = mode === o.id;
        return (
          <button
            key={o.id}
            type="button"
            aria-pressed={on}
            onClick={() => onChange(o.id)}
            className={cn(
              "relative rounded-md px-3.5 py-1.5 text-[0.85rem] font-medium transition-colors",
              on ? "text-cta" : "text-muted-foreground hover:text-ink",
            )}
          >
            {on && (
              <motion.span
                layoutId="pricing-mode"
                transition={{ type: "spring", stiffness: 420, damping: 34 }}
                className="absolute inset-0 rounded-md bg-cta-soft shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--cta)_16%,transparent)]"
              />
            )}
            <span className="relative">{o.label}</span>
          </button>
        );
      })}
    </div>
  );
}

/* The month the plan buys: one bar a day. They fill in order when the strip
   scrolls into view. Per article, all but the first dim, and the first
   carries the per-article price. */
function MonthStrip({ mode, perArticle }: { mode: Mode; perArticle: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { once: true, margin: "-80px" });
  const still = useReducedMotion();
  const days = PLAN.articlesPerMonth;

  return (
    <div ref={ref}>
      <div className="flex flex-col gap-1 text-left sm:flex-row sm:items-end sm:justify-between sm:gap-4">
        <div>
          <p className="text-sm font-semibold text-ink">Your month on Rankbox</p>
          <p className="mt-0.5 text-[0.82rem] text-muted-foreground">
            A new article researched, written and published every day.
          </p>
        </div>
        <p className="shrink-0 text-[0.82rem] text-muted-foreground sm:text-right">
          <span className="font-semibold text-ink tabular-nums">{days}</span> articles published to
          your site
        </p>
      </div>

      <div
        role="img"
        aria-label={`${days} days, with one article published on each`}
        className="relative mt-6 flex h-14 items-end gap-[3px] sm:gap-1"
      >
        {Array.from({ length: days }, (_, i) => {
          const lit = mode === "month" || i === 0;
          return (
            <span key={i} className="relative h-full flex-1">
              <span className="absolute inset-0 rounded-[3px] bg-ink/[0.05]" />
              <motion.span
                className={cn(
                  "absolute inset-0 origin-bottom rounded-[3px] transition-colors duration-500",
                  lit ? "bg-brand-blue" : "bg-brand-blue/15",
                )}
                initial={still ? false : { scaleY: 0 }}
                animate={seen || still ? { scaleY: 1 } : { scaleY: 0 }}
                transition={{ duration: 0.5, delay: still ? 0 : 0.15 + i * 0.035, ease: EASE }}
              />
              {i === 0 && (
                <AnimatePresence>
                  {mode === "article" && (
                    <motion.span
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      transition={{ duration: 0.3, ease: EASE }}
                      className="absolute bottom-full left-0 mb-2 whitespace-nowrap rounded-md bg-ink px-2 py-1 text-[0.7rem] font-semibold text-white shadow-lg"
                    >
                      {formatUsd(perArticle)}
                    </motion.span>
                  )}
                </AnimatePresence>
              )}
            </span>
          );
        })}
      </div>
      <div className="mt-2 flex justify-between text-[0.7rem] font-medium text-muted-foreground/80 tabular-nums">
        <span>Day 1</span>
        <span>Day {Math.ceil(days / 2)}</span>
        <span>Day {days}</span>
      </div>
    </div>
  );
}

export function PricingBand() {
  const price = priceFor();
  const [mode, setMode] = useState<Mode>("month");
  const still = useReducedMotion() ?? false;
  const perMonth = mode === "month";

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

      {/* The focal band: the price, and the month it buys. */}
      <Band inner="px-5 py-14 sm:px-10 sm:py-16">
        <Reveal className="mx-auto max-w-3xl text-center">
          <div className="flex items-center justify-center gap-2.5">
            <h3 className="text-lg font-semibold tracking-tight text-ink">{PLAN.name}</h3>
            <span className="rounded-md bg-cta-soft px-2 py-0.5 text-xs font-medium text-cta-hover">
              {PLAN.sites} website
            </span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Everything Rankbox does, in one plan.
          </p>

          <div className="mt-7">
            <ModeToggle mode={mode} onChange={setMode} />
          </div>

          <div className="mt-6 flex items-end justify-center gap-2">
            <span className="font-display text-[4.25rem] font-medium leading-[0.9] tracking-[-0.05em] text-ink sm:text-[6rem]">
              <Price value={perMonth ? price.perMonth : price.perArticle} still={still} />
            </span>
            <span className="relative mb-2 inline-flex h-7 min-w-[5.5rem] overflow-hidden text-left text-lg text-muted-foreground sm:mb-3">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={mode}
                  initial={{ y: "100%", opacity: 0 }}
                  animate={{ y: "0%", opacity: 1 }}
                  exit={{ y: "-100%", opacity: 0 }}
                  transition={{ duration: 0.4, ease: EASE }}
                  className="block"
                >
                  {perMonth ? "/month" : "/article"}
                </motion.span>
              </AnimatePresence>
            </span>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            {perMonth ? (
              <>
                Works out to{" "}
                <span className="font-semibold text-ink tabular-nums">
                  {formatUsd(price.perArticle)}
                </span>{" "}
                an article, all-in.
              </>
            ) : (
              <>
                {PLAN.articlesPerMonth} articles a month, for{" "}
                <span className="font-semibold text-ink tabular-nums">
                  {formatUsd(price.perMonth)}
                </span>
                .
              </>
            )}
          </p>

          <div className="mt-10 rounded-xl border border-ink/[0.07] bg-[color-mix(in_oklab,var(--surface)_40%,white)] px-5 pb-4 pt-5 sm:px-6">
            <MonthStrip mode={mode} perArticle={price.perArticle} />
          </div>

          <div className="mt-10 flex flex-col items-center">
            <a
              href="/auth"
              className="group inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-cta px-8 text-[0.95rem] font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.16),0_1px_2px_rgba(16,24,40,0.14)] transition-[background-color,transform] duration-150 hover:bg-cta-hover active:scale-[0.99] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cta/25"
            >
              Get Started Free
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
            <p className="mt-3 text-xs text-muted-foreground">
              No card to sign up. {TRIAL_DAYS} days free, then {formatUsd(PLAN.monthly)}/month.
              Cancel anytime.
            </p>
          </div>
        </Reveal>
      </Band>

      {/* What the plan includes, one cell each. White sits on still wrappers
          so a fading cell never shows the hairline fill behind it. */}
      <Band>
        <ul className={cn("grid gap-px sm:grid-cols-2 lg:grid-cols-3", LINE_FILL)}>
          {[
            ...INCLUDED.map((text, i) => ({ text, Icon: INCLUDED_ICONS[i] ?? Search })),
            {
              text: `${PLAN.backlinkCreditsPerMonth} backlink credits, from your first paid month`,
              Icon: Link2,
            },
          ].map(({ text, Icon }, i) => (
            <li key={text} className="bg-white">
              <Reveal
                delay={(i % 3) * 0.05}
                className="flex h-full items-start gap-3.5 px-6 py-6 sm:px-8"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cta-soft text-brand-blue">
                  <Icon className="h-4 w-4" />
                </span>
                <span className="pt-1 text-[0.92rem] leading-snug text-ink">{text}</span>
              </Reveal>
            </li>
          ))}
        </ul>
      </Band>

      {/* Proof: where the articles are built to rank, and who's using it. */}
      <Band>
        <div className="grid items-center md:grid-cols-[1fr_auto]">
          <div className="flex flex-col gap-3 px-6 py-6 sm:flex-row sm:items-center sm:gap-5 sm:px-8">
            <span className="shrink-0 text-[0.64rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground/85">
              Optimized for
            </span>
            <ul className="flex flex-wrap items-center gap-x-5 gap-y-2">
              {PLATFORMS.map(({ name, Mark }) => (
                <li
                  key={name}
                  className="group/p flex items-center gap-1.5 text-[0.85rem] font-medium text-ink/60 transition-colors hover:text-ink"
                >
                  <Mark className="h-4 w-4 opacity-70 grayscale transition-[filter,opacity] group-hover/p:opacity-100 group-hover/p:grayscale-0" />
                  {name}
                </li>
              ))}
            </ul>
          </div>
          <div
            className={cn(
              "flex items-center gap-3 border-t px-6 py-5 sm:px-8 md:border-l md:border-t-0",
              LINE,
            )}
          >
            <div className="flex -space-x-2">
              {BRANDS.map((brand) => (
                <BrandTile
                  key={brand.name}
                  brand={brand}
                  label={null}
                  className="h-8 w-8 ring-2 ring-white"
                />
              ))}
            </div>
            <div>
              <Stars className="[&_svg]:h-3.5 [&_svg]:w-3.5" />
              <p className="text-[0.8rem] text-muted-foreground">
                <span className="font-semibold text-ink">400+</span> brands growing with Rankbox
              </p>
            </div>
          </div>
        </div>
      </Band>
    </section>
  );
}
