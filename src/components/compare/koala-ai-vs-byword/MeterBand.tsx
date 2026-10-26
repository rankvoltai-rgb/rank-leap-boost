/**
 * The page's focal picture: the two bills, side by side, as ladders of the
 * plans each product publishes.
 *
 * What actually separates Koala and Byword is the unit they sell. Koala's
 * meter counts words (and counts them twice or three times on its premium
 * models); Byword's counts articles. So the reader sets a month — how many
 * articles, how long, which Koala model, which billing — and each ladder
 * lights the cheapest published plan that covers it, with how full every
 * rung would be.
 *
 * Motion: when the meter is about half on screen it sweeps once from 5 to
 * 300 articles a month, so the two highlights climb their ladders at their
 * own pace, then settles on 25. Leaving the screen resets it; coming back
 * plays it again. Touching any control hands it over for good. With reduced
 * motion it simply shows the 25-article month. The first render is that same
 * month, so the server and client agree.
 */
import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, MotionConfig, motion, useInView, useReducedMotion } from "motion/react";
import { ArrowUpRight, CircleDollarSign, Gauge, RotateCcw } from "lucide-react";
import { Accent, Band, LINE, PANEL, SectionHead, Spacer } from "@/components/landing/frame";
import { Reveal } from "@/components/landing/shared";
import { ProductMark } from "@/components/compare/kit";
import type { Product } from "@/data/compare/products";
import type { MatchupEntry, ProductPricing, Side } from "@/data/compare/types";
import { formatUsd } from "@/data/pricing";
import { formatDate } from "@/lib/format-date";
import { cn } from "@/lib/utils";
import {
  DEFAULT_LENGTH,
  DEFAULT_MODEL,
  DEFAULT_VOLUME,
  LENGTHS,
  MODELS,
  SWEEP,
  VOLUMES,
  fmt,
  ladderFor,
  perArticle,
  wordsNeeded,
  type Billing,
  type Ladder,
  type ModelId,
  type Rung,
  type Unit,
} from "./bills";
import { KICKER } from "./tokens";
import { Md } from "./ui";

const STEP_MS = 1500;
const EASE = [0.16, 1, 0.3, 1] as const;

/* ---------- controls ---------- */

function Segmented<T extends string | number>({
  label,
  hint,
  options,
  value,
  onChange,
}: {
  label: string;
  hint?: ReactNode;
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <fieldset className="px-5 py-4 sm:px-7">
      <legend className="sr-only">{label}</legend>
      <div className="flex items-baseline justify-between gap-3">
        <span aria-hidden className="text-[0.82rem] font-medium text-ink">
          {label}
        </span>
        {hint && <span className="text-[0.72rem] text-muted-foreground">{hint}</span>}
      </div>
      <div className="mt-2.5 grid auto-cols-fr grid-flow-col gap-1 rounded-lg border border-ink/[0.08] bg-[color-mix(in_oklab,var(--surface)_60%,white)] p-1">
        {options.map((o) => (
          <label
            key={String(o.value)}
            className={cn(
              "flex h-8 cursor-pointer items-center justify-center whitespace-nowrap rounded-md px-2 text-[0.8rem] font-medium transition-[background-color,color,box-shadow] duration-200 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-cta/40",
              value === o.value
                ? "bg-white text-cta shadow-[0_1px_2px_rgba(16,24,40,0.08)] ring-1 ring-cta/20"
                : "text-muted-foreground hover:text-ink",
            )}
          >
            <input
              type="radio"
              name={`meter-${label}`}
              className="sr-only"
              checked={value === o.value}
              onChange={() => onChange(o.value)}
            />
            {o.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

/* ---------- one ladder ---------- */

function capLabel(r: Rung, unit: Unit, need: number): string | null {
  if (r.state === "trial") return "One-time allowance";
  if (r.cap === null) return r.state === "fit" ? "No allowance cap listed" : null;
  if (r.state === "short") return `${fmt(need)} won’t fit in ${fmt(r.cap)}`;
  if (r.state === "fit") return `${fmt(need)} of ${fmt(r.cap)} ${unit}`;
  return null;
}

function priceText(price: number | null): string {
  if (price === null) return "Custom";
  if (price === 0) return "Free";
  return `${formatUsd(price)}/mo`;
}

function RungRow({ rung, unit, need }: { rung: Rung; unit: Unit; need: number }) {
  const fit = rung.state === "fit";
  const short = rung.state === "short";
  const trial = rung.state === "trial";
  const label = capLabel(rung, unit, need);
  return (
    <li
      className={cn(
        "relative border-t py-3.5 pl-10 pr-5 transition-colors duration-500 sm:pl-12 sm:pr-7",
        LINE,
        fit && "bg-[color-mix(in_oklab,var(--cta)_6%,white)]",
      )}
    >
      {/* The ladder's rail: a dot per rung, filled on the one that fits. */}
      <span
        aria-hidden
        className={cn(
          "absolute left-[1.15rem] top-[1.15rem] h-2.5 w-2.5 rounded-full border-2 transition-colors duration-500 sm:left-[1.4rem]",
          fit
            ? "border-cta bg-cta shadow-[0_0_0_4px_color-mix(in_oklab,var(--cta)_16%,transparent)]"
            : short
              ? "border-ink/20 bg-ink/20"
              : "border-ink/20 bg-white",
        )}
      />
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p
            className={cn(
              "text-[0.92rem] font-medium transition-colors duration-500",
              fit ? "text-cta" : short || trial ? "text-ink/55" : "text-ink",
            )}
          >
            {rung.plan.name}
            {fit && (
              <span className="ml-2 rounded bg-cta px-1.5 py-px align-[0.08em] text-[0.62rem] font-semibold uppercase tracking-[0.08em] text-white">
                Fits
              </span>
            )}
          </p>
          <p className="mt-0.5 text-[0.78rem] leading-snug text-muted-foreground">
            {rung.plan.includes}
          </p>
        </div>
        <div className="shrink-0 text-right">
          <p
            className={cn(
              "text-[0.92rem] font-semibold tabular-nums transition-colors duration-500",
              fit ? "text-cta" : short || trial ? "text-ink/55" : "text-ink",
            )}
          >
            {priceText(rung.price)}
          </p>
          {rung.monthlyOnly && (
            <p className="text-[0.68rem] text-muted-foreground">no yearly price</p>
          )}
        </div>
      </div>

      {!trial && (
        <div className="mt-2.5 flex items-center gap-3">
          <div
            aria-hidden
            className={cn(
              "relative h-1.5 flex-1 overflow-hidden rounded-full",
              rung.cap === null
                ? "bg-[repeating-linear-gradient(90deg,var(--color-cta)_0_6px,transparent_6px_11px)] opacity-30"
                : "bg-ink/[0.06]",
            )}
          >
            {rung.cap !== null && (
              <span
                className={cn(
                  "absolute inset-y-0 left-0 rounded-full transition-[width,background-color] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
                  fit ? "bg-cta" : short ? "bg-ink/25" : "bg-cta/30",
                )}
                style={{ width: `${Math.max(rung.fill * 100, rung.fill > 0 ? 2 : 0)}%` }}
              />
            )}
          </div>
        </div>
      )}
      {label && (
        <p
          className={cn(
            "mt-1.5 text-[0.72rem] tabular-nums",
            fit ? "font-medium text-cta" : "text-muted-foreground",
          )}
        >
          {label}
        </p>
      )}
    </li>
  );
}

function LadderColumn({
  product,
  pricing,
  ladder,
  unit,
  articles,
  className,
}: {
  product: Product;
  pricing: ProductPricing;
  ladder: Ladder;
  unit: Unit;
  articles: number;
  className?: string;
}) {
  const fit = ladder.fit;
  const price = fit?.price ?? null;
  return (
    <div className={cn("flex min-w-0 flex-col", className)}>
      <div className="flex items-start justify-between gap-3 px-5 pt-6 sm:px-7">
        <div className="flex min-w-0 items-center gap-3">
          <ProductMark product={product} className="h-9 w-9 text-sm" />
          <div className="min-w-0">
            <h3 className="text-[1rem] font-semibold tracking-tight text-ink">{product.name}</h3>
            <p className="text-[0.78rem] leading-snug text-muted-foreground">{pricing.model}</p>
          </div>
        </div>
        <a
          href={pricing.url}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="inline-flex shrink-0 items-center gap-1 rounded-md py-1 text-[0.75rem] font-medium text-muted-foreground transition-colors hover:text-cta"
        >
          Pricing page
          <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
        </a>
      </div>

      {/* The month's bill: the answer first, the ladder under it. */}
      <div className="px-5 pb-5 pt-5 sm:px-7" aria-live="polite">
        <p className={KICKER}>Your month on {product.name}</p>
        <div className="mt-1.5 flex min-h-[3.1rem] flex-wrap items-baseline gap-x-2.5">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={fit ? `${fit.plan.name}-${price}` : "over"}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35, ease: EASE }}
              className="font-display text-[2.4rem] font-medium leading-none tracking-[-0.03em] text-ink tabular-nums"
            >
              {fit ? priceText(price).replace("/mo", "") : "—"}
            </motion.span>
          </AnimatePresence>
          {fit && price !== null && price > 0 && (
            <span className="text-sm text-muted-foreground">/month · {fit.plan.name}</span>
          )}
        </div>
        <p className="mt-2 text-[0.82rem] tabular-nums text-muted-foreground">
          {fit && price ? (
            <>
              About{" "}
              <span className="font-medium text-ink">{formatUsd(perArticle(price, articles))}</span>{" "}
              an article · {fmt(ladder.need)} {unit} counted
            </>
          ) : (
            <>
              {fmt(ladder.need)} {unit} is beyond the plans listed here — see the note below.
            </>
          )}
        </p>
      </div>

      <ol aria-label={`${product.name} plans`} className="flex flex-col-reverse">
        {ladder.rungs.map((r) => (
          <RungRow key={r.plan.name} rung={r} unit={unit} need={ladder.need} />
        ))}
      </ol>

      <p
        className={cn(
          "mt-auto flex items-center gap-2 border-t px-5 py-4 text-[0.78rem] text-muted-foreground sm:px-7",
          LINE,
        )}
      >
        <CircleDollarSign className="h-4 w-4 shrink-0" aria-hidden />
        {pricing.trial}
      </p>
    </div>
  );
}

/* ---------- the section ---------- */

export function MeterSection({
  sides,
  entry,
}: {
  sides: Record<Side, Product>;
  entry: MatchupEntry;
}) {
  const [volume, setVolume] = useState(DEFAULT_VOLUME);
  const [length, setLength] = useState(DEFAULT_LENGTH);
  const [model, setModel] = useState<ModelId>(DEFAULT_MODEL);
  const [billing, setBilling] = useState<Billing>("monthly");
  /* `auto` until the reader touches a control; `run` replays the sweep. */
  const [auto, setAuto] = useState(true);
  const [run, setRun] = useState(0);
  const [playing, setPlaying] = useState(false);

  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.45 });
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!auto) return;
    // Reduced motion holds the still month, unless the reader asked for a replay.
    if (!inView || (reduce && run === 0)) {
      setVolume(DEFAULT_VOLUME);
      setPlaying(false);
      return;
    }
    let i = 0;
    let id = 0;
    setVolume(SWEEP[0]);
    setPlaying(true);
    const step = () => {
      i += 1;
      setVolume(SWEEP[i]);
      if (i < SWEEP.length - 1) id = window.setTimeout(step, STEP_MS);
      else setPlaying(false);
    };
    id = window.setTimeout(step, STEP_MS);
    return () => window.clearTimeout(id);
  }, [auto, inView, reduce, run]);

  /* Any control hands the meter to the reader. */
  const take = <T,>(set: (v: T) => void) => {
    return (v: T) => {
      setAuto(false);
      setPlaying(false);
      set(v);
    };
  };

  const words = wordsNeeded(volume, length, model);
  const a = ladderFor(entry.pricing.a, "words", words, billing);
  const b = ladderFor(entry.pricing.b, "articles", volume, billing);
  const index = VOLUMES.indexOf(volume);
  const pct = (index / (VOLUMES.length - 1)) * 100;

  return (
    <section id="pricing" aria-labelledby="meter-title" className="scroll-mt-16">
      <Spacer />
      <SectionHead
        icon={Gauge}
        eyebrow="How each one bills"
        title={
          <span id="meter-title">
            {sides.a.name} meters words. {sides.b.name} <Accent>sells articles.</Accent>
          </span>
        }
        subtitle={`Set your month and each ladder lights the cheapest published plan that covers it. List prices, read from both pricing pages on ${formatDate(entry.pricing.checkedOn)}.`}
      />

      <MotionConfig reducedMotion="user">
        <div ref={ref}>
          {/* The month: volume on the left, the rest of the setup on the right. */}
          <Band inner={PANEL}>
            <div className="grid lg:grid-cols-[1.2fr_1fr]">
              <div
                className={cn("border-b px-5 py-7 sm:px-8 sm:py-9 lg:border-b-0 lg:border-r", LINE)}
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <label htmlFor="meter-volume" className={KICKER}>
                    Articles a month
                  </label>
                  {playing ? (
                    <button
                      type="button"
                      onClick={() => {
                        setAuto(false);
                        setPlaying(false);
                      }}
                      className="inline-flex items-center gap-2 rounded-md border border-ink/[0.08] bg-white px-2.5 py-1 text-[0.72rem] font-medium text-ink"
                    >
                      <span className="relative flex h-2 w-2">
                        <span className="absolute inset-0 animate-ping rounded-full bg-cta/50" />
                        <span className="relative h-2 w-2 rounded-full bg-cta" />
                      </span>
                      Sweeping · stop
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setAuto(true);
                        setRun((n) => n + 1);
                      }}
                      className="inline-flex items-center gap-1.5 rounded-md border border-ink/[0.08] bg-white px-2.5 py-1 text-[0.72rem] font-medium text-muted-foreground transition-colors hover:text-ink"
                    >
                      <RotateCcw className="h-3 w-3" aria-hidden />
                      Replay the sweep
                    </button>
                  )}
                </div>

                <p className="mt-3 flex items-baseline gap-3">
                  <span className="font-display text-[3.6rem] font-medium leading-none tracking-[-0.04em] text-ink tabular-nums sm:text-[4.4rem]">
                    {volume}
                  </span>
                  <span className="text-[0.95rem] text-muted-foreground">articles</span>
                </p>

                {/* The native range, drawn as the landing's hairline track. */}
                <div className="relative mt-6">
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-ink/[0.08]"
                  >
                    <span
                      className="absolute inset-y-0 left-0 rounded-full bg-cta transition-[width] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <input
                    id="meter-volume"
                    type="range"
                    min={0}
                    max={VOLUMES.length - 1}
                    step={1}
                    value={index}
                    aria-valuetext={`${volume} articles a month`}
                    onChange={(e) => take(setVolume)(VOLUMES[Number(e.target.value)])}
                    className="relative z-10 h-6 w-full cursor-pointer appearance-none bg-transparent focus-visible:outline-none [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-cta [&::-moz-range-thumb]:bg-white [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-cta [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-[0_1px_3px_rgba(16,24,40,0.2)] [&::-webkit-slider-thumb]:transition-transform focus-visible:[&::-webkit-slider-thumb]:ring-4 focus-visible:[&::-webkit-slider-thumb]:ring-cta/25"
                  />
                  <div
                    aria-hidden
                    className="mt-1.5 flex justify-between text-[0.7rem] tabular-nums text-muted-foreground"
                  >
                    <span>{VOLUMES[0]}</span>
                    <span>{VOLUMES[Math.floor(VOLUMES.length / 2)]}</span>
                    <span>{VOLUMES[VOLUMES.length - 1]}</span>
                  </div>
                </div>

                {/* The same month in each meter's own unit — the whole difference. */}
                <dl className="mt-7 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-ink/[0.07] bg-ink/[0.07]">
                  <div className="bg-white px-4 py-3">
                    <dt className="flex items-center gap-2 text-[0.75rem] text-muted-foreground">
                      <ProductMark product={sides.a} className="h-4 w-4 text-[0.45rem]" />
                      {sides.a.name} counts
                    </dt>
                    <dd className="mt-1 text-[1.05rem] font-semibold tabular-nums text-ink">
                      {fmt(words)} words
                    </dd>
                  </div>
                  <div className="bg-white px-4 py-3">
                    <dt className="flex items-center gap-2 text-[0.75rem] text-muted-foreground">
                      <ProductMark product={sides.b} className="h-4 w-4 text-[0.45rem]" />
                      {sides.b.name} counts
                    </dt>
                    <dd className="mt-1 text-[1.05rem] font-semibold tabular-nums text-ink">
                      {plural2(volume, "credit")}
                    </dd>
                  </div>
                </dl>
              </div>

              <div className={cn("divide-y bg-white/60", "divide-ink/[0.07]")}>
                <Segmented
                  label="Average length"
                  options={LENGTHS.map((l) => ({ value: l, label: `${fmt(l)}` }))}
                  hint="words an article"
                  value={length}
                  onChange={take(setLength)}
                />
                <Segmented
                  label={`${sides.a.name}'s model`}
                  hint="premium models count 2–3x"
                  options={MODELS.map((m) => ({
                    value: m.id,
                    label:
                      m.id === "base" ? m.label : `${m.label.replace("Claude ", "")} · ${m.short}`,
                  }))}
                  value={model}
                  onChange={take(setModel)}
                />
                <Segmented
                  label="Billing"
                  options={[
                    { value: "monthly" as Billing, label: "Monthly" },
                    { value: "yearly" as Billing, label: "Yearly, per month" },
                  ]}
                  value={billing}
                  onChange={take(setBilling)}
                />
              </div>
            </div>
          </Band>

          {/* The two ladders. */}
          <Band>
            <div className="grid md:grid-cols-2">
              <LadderColumn
                product={sides.a}
                pricing={entry.pricing.a}
                ladder={a}
                unit="words"
                articles={volume}
                className={cn("border-b md:border-b-0 md:border-r", LINE)}
              />
              <LadderColumn
                product={sides.b}
                pricing={entry.pricing.b}
                ladder={b}
                unit="articles"
                articles={volume}
              />
            </div>
          </Band>
        </div>
      </MotionConfig>

      {/* What the list prices leave out, verbatim, and how the meter counts. */}
      <Band inner="px-5 py-7 sm:px-8">
        <Reveal className="grid gap-5 lg:grid-cols-[1fr_1.3fr] lg:gap-10">
          <p className="text-[0.82rem] leading-relaxed text-muted-foreground">
            <span className="font-medium text-ink">How the meter counts.</span> Articles × length ×{" "}
            {sides.a.name}&rsquo;s model multiplier, against each plan&rsquo;s published allowance
            of words or articles. It counts article words only. Prices checked on{" "}
            <time dateTime={entry.pricing.checkedOn} className="font-medium text-ink">
              {formatDate(entry.pricing.checkedOn)}
            </time>
            .
          </p>
          <p className="text-[0.86rem] leading-relaxed text-ink/80">
            <Md text={entry.pricing.note} />
          </p>
        </Reveal>
      </Band>
    </section>
  );
}

function plural2(n: number, one: string) {
  return `${fmt(n)} ${n === 1 ? one : `${one}s`}`;
}
