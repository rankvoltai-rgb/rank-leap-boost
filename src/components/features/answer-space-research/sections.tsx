/**
 * The sections of /features/answer-space-research, in the landing page's
 * frame: hairline rails, a hairline over every band, blank bands between
 * sections, white throughout. All copy comes from the feature's entry in
 * data/features.ts; these only decide how it's set.
 */
import { useRef, useState, type CSSProperties, type ComponentType } from "react";
import { Link } from "@tanstack/react-router";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import {
  ArrowRight,
  ArrowUpRight,
  Boxes,
  Check,
  ChevronRight,
  Crosshair,
  Gauge,
  HelpCircle,
  Layers,
  MessagesSquare,
  Plus,
  Target,
  Workflow,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Accordion, AccordionContent, AccordionItem } from "@/components/ui/accordion";
import { Reveal } from "@/components/landing/shared";
import { UrlForm } from "@/components/landing/Hero";
import { MarkDither } from "@/components/landing/hero-dither";
import {
  Accent,
  Band,
  GHOST_BUTTON,
  LINE,
  LINE_FILL,
  PANEL,
  Pill,
  SectionHead,
  Spacer,
} from "@/components/landing/frame";
import { TRIAL_NOTE } from "@/components/features/FeatureSections";
import { TRIAL_CTA } from "@/data/pricing";
import { ENGINE_ORDER, getFeature, type Feature } from "@/data/features";
import { AnswerSpaceWindow, BENEFIT_SCREENS, MapPeek, STEP_PICTURES } from "./visuals";

/* Staggers the CSS entrance (see animate-hero-rise in styles.css). */
const rise = (delay: number) => ({ "--rise-delay": `${delay}s` }) as CSSProperties;

/** A title with its last `words` words set in the blue accent. */
function accented(text: string, words: number) {
  const parts = text.split(" ");
  return (
    <>
      {parts.slice(0, -words).join(" ")} <Accent>{parts.slice(-words).join(" ")}</Accent>
    </>
  );
}

const SOLID_BUTTON =
  "group inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-cta px-5 text-[0.95rem] font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.16),0_1px_2px_rgba(16,24,40,0.14)] transition-[background-color,transform] duration-150 hover:bg-cta-hover active:scale-[0.985] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cta/25";

/* ---------- Hero ---------- */

/* The landing hero, retold for one feature: the same centred lockup over the
   dithered mark, the feature's icon standing where the landing's engine logo
   turns, and the feature's facts in the band that closes it. */
export function AnswerSpaceHero({ feature }: { feature: Feature }) {
  const [url, setUrl] = useState("");
  const Icon = feature.icon;

  return (
    <section id="top" aria-labelledby="feature-title" className="relative bg-white">
      <div className={cn("relative mx-auto max-w-6xl overflow-hidden border-x", LINE)}>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.42] [mask-image:radial-gradient(ellipse_66%_82%_at_50%_50%,#000_50%,transparent_100%)]"
        >
          <MarkDither />
        </div>

        <div className="relative flex flex-col items-center px-5 pb-16 pt-7 text-center sm:px-8 sm:pb-20 sm:pt-9 lg:pb-[5.5rem]">
          <nav aria-label="Breadcrumb" className="motion-safe:animate-hero-rise" style={rise(0)}>
            <ol className="flex items-center gap-1.5 text-[0.78rem] text-muted-foreground">
              <li>
                <Link to="/" className="py-2 transition-colors hover:text-ink">
                  Home
                </Link>
              </li>
              <li aria-hidden>
                <ChevronRight className="h-3 w-3" />
              </li>
              <li>
                <Link to="/features" className="py-2 transition-colors hover:text-ink">
                  Features
                </Link>
              </li>
              <li aria-hidden>
                <ChevronRight className="h-3 w-3" />
              </li>
              <li aria-current="page" className="font-medium text-ink">
                {feature.name}
              </li>
            </ol>
          </nav>

          <div className="mt-10 motion-safe:animate-hero-rise sm:mt-12" style={rise(0.05)}>
            <Pill icon={Icon}>{feature.eyebrow}</Pill>
          </div>

          <h1
            id="feature-title"
            className="mt-6 font-display text-[2.3rem] font-medium leading-[1.08] tracking-[-0.035em] text-ink motion-safe:animate-hero-rise min-[400px]:text-[2.6rem] sm:text-[3.5rem] lg:text-[4.15rem]"
            style={rise(0.12)}
          >
            <span className="block">{feature.headline.lead}</span>{" "}
            <span className="mt-[0.04em] inline-flex items-center gap-[0.22em] whitespace-nowrap">
              <span
                aria-hidden
                className="inline-flex h-[0.84em] w-[0.84em] shrink-0 items-center justify-center rounded-[0.2em] border border-ink/[0.08] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.06)]"
              >
                <Icon className="h-[48%] w-[48%] text-brand-blue" strokeWidth={2.4} />
              </span>
              <span className="font-bold text-brand-blue">{feature.headline.accent}</span>
            </span>
          </h1>

          <p
            className="mt-6 max-w-[41rem] text-balance text-[1.05rem] leading-relaxed text-muted-foreground motion-safe:animate-hero-rise sm:text-[1.15rem]"
            style={rise(0.22)}
          >
            {feature.subhead}
          </p>

          <div
            className="mt-9 w-full max-w-[37rem] motion-safe:animate-hero-rise"
            style={rise(0.32)}
          >
            <UrlForm url={url} onChange={setUrl} variant="split" />
            <p className="mt-3.5 text-[0.82rem] text-muted-foreground">{TRIAL_NOTE}</p>
          </div>
        </div>
      </div>

      {/* The facts band. Top hairline only: the showcase under it draws the
          line beneath. */}
      <div className={cn("border-t motion-safe:animate-hero-rise", LINE)} style={rise(0.42)}>
        <dl
          aria-label={`${feature.name} at a glance`}
          className={cn(
            "mx-auto grid max-w-6xl grid-cols-2 gap-px border-x md:grid-cols-4",
            LINE,
            LINE_FILL,
          )}
        >
          {feature.specs.map((s) => (
            <div
              key={s.label}
              className="flex flex-col-reverse items-center justify-center bg-white px-4 py-6 text-center sm:py-7"
            >
              <dt className="mt-1 max-w-[13rem] text-balance text-[0.8rem] leading-snug text-muted-foreground">
                {s.label}
              </dt>
              <dd className="font-display text-[1.45rem] font-medium leading-none tracking-[-0.02em] text-ink sm:text-[1.6rem]">
                {s.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

/* ---------- The feature, running ---------- */

/* The landing's showcase, with this feature in the frame: the research window
   on the painted sky. It rises and tips upright as it comes up the screen
   while the painting drifts the other way; with reduced motion it sits flat. */
export function AnswerSpaceShowcase({ feature }: { feature: Feature }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress: rise } = useScroll({ target: ref, offset: ["start end", "start 0.2"] });
  const p = useSpring(rise, { stiffness: 120, damping: 28, mass: 0.6 });
  const rotateX = useTransform(p, [0, 1], [16, 0]);
  const scale = useTransform(p, [0, 1], [0.92, 1]);
  const y = useTransform(p, [0, 1], [72, 0]);

  const { scrollYProgress: pass } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const bgY = useTransform(pass, [0, 1], ["-7%", "7%"]);

  return (
    <section aria-label={`${feature.name}, running`}>
      <Band inner="overflow-hidden">
        <div
          ref={ref}
          className="relative bg-[#1563d6] px-3 pb-14 pt-12 [perspective:1800px] sm:px-10 sm:pb-20 sm:pt-16 lg:px-16"
        >
          <motion.img
            src="/assets/painting-sky.webp"
            alt="Painted blue sky with soft white clouds"
            aria-hidden
            width={2200}
            height={1400}
            loading="lazy"
            decoding="async"
            draggable={false}
            className="pointer-events-none absolute inset-0 h-full w-full scale-[1.16] select-none object-cover"
            style={reduce ? undefined : { y: bgY }}
          />
          <motion.div
            className="relative mx-auto max-w-5xl will-change-transform"
            style={reduce ? undefined : { rotateX, scale, y, transformOrigin: "50% 0%" }}
          >
            <AnswerSpaceWindow />
          </motion.div>
        </div>
      </Band>
    </section>
  );
}

/* ---------- Why it matters ---------- */

function ProblemCard({
  fresh,
  icon: Icon,
  title,
  sub,
  items,
}: {
  fresh: boolean;
  icon: ComponentType<{ className?: string }>;
  title: string;
  sub: string;
  items: string[];
}) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-[28rem] rounded-xl border bg-white p-5 sm:p-6",
        fresh
          ? "border-cta/25 shadow-[0_0_0_4px_color-mix(in_oklab,var(--cta)_7%,transparent),0_12px_32px_-18px_rgba(16,24,40,0.22)]"
          : "border-ink/[0.07] shadow-[0_1px_2px_rgba(16,24,40,0.04),0_12px_32px_-18px_rgba(16,24,40,0.18)]",
      )}
    >
      <div className="flex items-center gap-3">
        <span
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-lg",
            fresh ? "bg-cta text-white" : "bg-[#fdedf1] text-[#e11d48]",
          )}
        >
          <Icon className="h-4 w-4" />
        </span>
        <div>
          <h3 className="text-[1.05rem] font-medium tracking-tight text-ink">{title}</h3>
          <p className="text-[0.78rem] text-muted-foreground">{sub}</p>
        </div>
      </div>
      <ul className={cn("mt-5 divide-y border-t", LINE, "divide-ink/[0.07]")}>
        {items.map((item) => (
          <li
            key={item}
            className={cn(
              "flex gap-3 py-3 text-[0.9rem] leading-snug",
              fresh ? "text-ink" : "text-muted-foreground",
            )}
          >
            {fresh ? (
              <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-success/15 text-success">
                <Check className="h-2.5 w-2.5" strokeWidth={3} />
              </span>
            ) : (
              <X className="mt-0.5 h-4 w-4 shrink-0 text-[#e11d48]/60" />
            )}
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function AnswerSpaceProblem({ feature }: { feature: Feature }) {
  const { problem } = feature;
  if (!problem) return null;
  return (
    <section>
      <Spacer />
      <SectionHead
        icon={Target}
        eyebrow="Why it matters"
        title={accented(problem.title, 3)}
        subtitle={problem.body}
      />
      <Band inner={PANEL}>
        <div className="grid lg:grid-cols-2">
          <Reveal className="flex items-center px-5 py-10 sm:px-10 sm:py-14">
            <ProblemCard
              fresh={false}
              icon={X}
              title="The old way"
              sub="Manual, slow, and easy to skip"
              items={problem.before}
            />
          </Reveal>
          <Reveal
            delay={0.08}
            className={cn(
              "flex items-center border-t px-5 py-10 sm:px-10 sm:py-14 lg:border-l lg:border-t-0",
              LINE,
            )}
          >
            <ProblemCard
              fresh
              icon={feature.icon}
              title="With Rankbox"
              sub={`${feature.name}, on autopilot`}
              items={problem.after}
            />
          </Reveal>
        </div>
      </Band>
    </section>
  );
}

/* ---------- Inside the feature ---------- */

/* Each benefit's panel tint, from the landing's feature rows. */
const BENEFIT_STYLE = [
  { icon: Crosshair, panel: "#eaf2fe", tile: "#dbe8fd", ink: "#1877f2" },
  { icon: Gauge, panel: "#f1eefd", tile: "#e3ddfb", ink: "#7c3aed" },
  { icon: MessagesSquare, panel: "#e9f6ee", tile: "#d6efdf", ink: "#16a34a" },
] as const;

export function AnswerSpaceBenefits({ feature }: { feature: Feature }) {
  return (
    <section>
      <Spacer />
      <SectionHead
        icon={Layers}
        eyebrow={`Inside ${feature.name}`}
        title={accented(feature.benefitsTitle, 4)}
        subtitle={feature.benefitsIntro}
      />
      {feature.benefits.map((b, i) => {
        const style = BENEFIT_STYLE[i % BENEFIT_STYLE.length];
        const Icon = style.icon;
        const Screen = BENEFIT_SCREENS[i];
        return (
          <Band key={b.title}>
            <div className="group grid lg:grid-cols-[0.85fr_1fr]">
              <Reveal className="flex flex-col justify-center px-6 py-10 sm:px-10 lg:py-12 lg:pl-14 lg:pr-10">
                <div className="flex items-center gap-3">
                  <span
                    className="flex h-8 w-8 items-center justify-center rounded-lg"
                    style={{ background: style.tile, color: style.ink }}
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="text-[0.75rem] font-medium tabular-nums text-muted-foreground">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="mt-5 font-display text-[1.6rem] font-medium leading-tight tracking-[-0.025em] text-ink sm:text-[1.85rem]">
                  {b.title}
                </h3>
                <p className="mt-3 max-w-sm text-[0.95rem] leading-relaxed text-muted-foreground">
                  {b.body}
                </p>
              </Reveal>
              {/* Flush to the right rail, with a hairline of white around it. */}
              <div className="px-3 pb-3 lg:py-3 lg:pl-0 lg:pr-3">
                <div
                  aria-hidden
                  className="relative h-[17rem] overflow-hidden sm:h-[18.5rem]"
                  style={{ background: style.panel }}
                >
                  {Screen && <Screen />}
                </div>
              </div>
            </div>
          </Band>
        );
      })}
    </section>
  );
}

/* ---------- How it works ---------- */

export function AnswerSpaceSteps({ feature }: { feature: Feature }) {
  return (
    <section>
      <Spacer />
      <SectionHead icon={Workflow} eyebrow="How it works" title={accented(feature.stepsTitle, 2)} />
      <Band>
        <ol className={cn("grid gap-px lg:grid-cols-3", LINE_FILL)}>
          {feature.steps.map((s, i) => {
            const Picture = STEP_PICTURES[i];
            const last = i === feature.steps.length - 1;
            return (
              <li key={s.title} className="relative bg-white">
                <Reveal delay={i * 0.06} className="flex h-full flex-col p-6 sm:p-8">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-cta-soft text-[0.85rem] font-semibold tabular-nums text-cta">
                    {i + 1}
                  </span>
                  <h3 className="mt-5 text-[1.05rem] font-semibold tracking-tight text-ink">
                    {s.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
                  {Picture && (
                    <div
                      aria-hidden
                      className={cn("mt-6 flex-1 rounded-xl border border-ink/[0.06] p-3.5", PANEL)}
                    >
                      <Picture />
                    </div>
                  )}
                </Reveal>
                {/* A joint on the hairline between two steps. */}
                {!last && (
                  <span
                    aria-hidden
                    className="absolute -right-3 top-[2.6rem] z-10 hidden h-6 w-6 items-center justify-center rounded-full border border-ink/[0.08] bg-white text-muted-foreground shadow-[0_1px_2px_rgba(16,24,40,0.05)] lg:flex"
                  >
                    <ArrowRight className="h-3 w-3" />
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </Band>
      <Band inner="flex flex-col items-center gap-3 px-5 py-10 text-center">
        <a href="/auth" className={SOLID_BUTTON}>
          Start your free trial
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </a>
        <p className="text-[0.82rem] text-muted-foreground">{TRIAL_NOTE}</p>
      </Band>
    </section>
  );
}

/* ---------- One engine ---------- */

export function AnswerSpaceEngine({ feature }: { feature: Feature }) {
  return (
    <section>
      <Spacer />
      <SectionHead
        icon={Boxes}
        eyebrow="One engine"
        title={
          <>
            Better with <Accent>the whole engine</Accent>
          </>
        }
        subtitle={feature.connects}
      />
      <Band>
        <ol className={cn("grid gap-px sm:grid-cols-2 lg:grid-cols-4", LINE_FILL)}>
          {ENGINE_ORDER.map((slug, i) => {
            const f = getFeature(slug);
            if (!f) return null;
            const Icon = f.icon;
            const step = String(i + 1).padStart(2, "0");
            if (slug === feature.slug) {
              return (
                <li key={slug} className="bg-white">
                  <div
                    aria-current="page"
                    className="flex h-full flex-col bg-[color-mix(in_oklab,var(--cta)_5%,white)] p-5 sm:p-6"
                  >
                    <div className="flex items-center justify-between">
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-cta text-white">
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="rounded-md bg-cta-soft px-1.5 py-0.5 text-[0.65rem] font-semibold text-cta">
                        You&rsquo;re here
                      </span>
                    </div>
                    <p className="mt-5 text-[0.68rem] font-medium tabular-nums text-cta">{step}</p>
                    <p className="mt-0.5 text-[0.92rem] font-semibold text-ink">{f.name}</p>
                    <p className="mt-1 text-[0.8rem] leading-relaxed text-muted-foreground">
                      {f.tagline}
                    </p>
                  </div>
                </li>
              );
            }
            return (
              <li key={slug} className="bg-white">
                <Link
                  to="/features/$slug"
                  params={{ slug }}
                  className="group flex h-full flex-col p-5 transition-colors duration-300 hover:bg-[color-mix(in_oklab,var(--surface)_35%,white)] sm:p-6"
                >
                  <div className="flex items-center justify-between">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-ink/[0.08] bg-white text-ink/70 shadow-[0_1px_2px_rgba(16,24,40,0.04)] transition-colors group-hover:text-brand-blue">
                      <Icon className="h-4 w-4" />
                    </span>
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground/60 transition-[transform,color] duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-blue" />
                  </div>
                  <p className="mt-5 text-[0.68rem] font-medium tabular-nums text-muted-foreground">
                    {step}
                  </p>
                  <p className="mt-0.5 text-[0.92rem] font-semibold text-ink">{f.name}</p>
                  <p className="mt-1 text-[0.8rem] leading-relaxed text-muted-foreground">
                    {f.tagline}
                  </p>
                </Link>
              </li>
            );
          })}
        </ol>
      </Band>
      <Band inner="flex justify-center px-5 py-6">
        <Link to="/features" className={cn(GHOST_BUTTON, "group/btn")}>
          Explore all features
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-0.5" />
        </Link>
      </Band>
    </section>
  );
}

/* ---------- FAQ ---------- */

/* The landing's FAQ: the title on the left, the questions down the right. */
export function AnswerSpaceFAQ({ feature }: { feature: Feature }) {
  return (
    <section id="faq" className="scroll-mt-16">
      <Spacer />
      <Band>
        <div className="grid lg:grid-cols-[0.8fr_1.2fr]">
          <Reveal
            className={cn(
              "flex flex-col justify-center border-b px-6 py-10 sm:px-10 lg:border-b-0 lg:border-r lg:px-12 lg:py-14",
              LINE,
            )}
          >
            <Pill icon={HelpCircle} className="w-fit">
              FAQ
            </Pill>
            <h2 className="mt-5 font-display text-[1.9rem] font-medium leading-[1.12] tracking-[-0.03em] text-ink sm:text-[2.4rem]">
              {feature.name} questions
            </h2>
            <p className="mt-4 max-w-sm text-[0.98rem] leading-relaxed text-muted-foreground">
              Everything you need to know about {feature.name} and how it fits into Rankbox.
            </p>
            <a href="/#faq" className={cn(GHOST_BUTTON, "group/btn mt-6 w-fit")}>
              Read the full FAQ
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-0.5" />
            </a>
          </Reveal>

          <Reveal delay={0.06} className="px-6 py-4 sm:px-10 lg:px-12 lg:py-8">
            <Accordion type="single" collapsible className="divide-y divide-ink/[0.07]">
              {feature.faqs.map((f, i) => (
                <AccordionItem key={f.q} value={`item-${i}`} className="border-b-0">
                  <AccordionPrimitive.Header className="flex">
                    <AccordionPrimitive.Trigger className="group flex flex-1 cursor-pointer items-center justify-between gap-6 py-5 text-left text-[0.98rem] font-medium text-ink transition-colors hover:text-brand-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta/40 focus-visible:ring-offset-2">
                      {f.q}
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-ink/[0.08] bg-white text-ink transition-[transform,background-color,color,border-color] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:border-brand-blue/30 group-data-[state=open]:rotate-45 group-data-[state=open]:border-brand-blue group-data-[state=open]:bg-brand-blue group-data-[state=open]:text-white">
                        <Plus className="h-3.5 w-3.5" />
                      </span>
                    </AccordionPrimitive.Trigger>
                  </AccordionPrimitive.Header>
                  <AccordionContent
                    forceMount
                    className="max-w-2xl pb-5 pr-10 text-sm leading-relaxed text-muted-foreground"
                  >
                    {f.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Reveal>
        </div>
      </Band>
    </section>
  );
}

/* ---------- Closing ---------- */

/* The landing's closing band: blue inside the rails, the white mark dithered
   behind, one button, and the product rising from the band's foot. The band
   is --cta rather than brand blue so the white body text passes AA. */
export function AnswerSpaceCTA({ feature }: { feature: Feature }) {
  const Icon = feature.icon;
  return (
    <section aria-labelledby="cta-title">
      <Spacer />
      <Band inner="overflow-hidden bg-cta">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.16] [mask-image:radial-gradient(ellipse_70%_80%_at_50%_45%,#000_40%,transparent_100%)]"
        >
          <MarkDither className="text-white" />
        </div>

        <div className="relative px-5 pt-16 text-center sm:px-8 sm:pt-20">
          <Reveal>
            <span className="mx-auto mb-6 flex h-11 w-11 items-center justify-center rounded-xl bg-white text-brand-blue shadow-[0_1px_2px_rgba(4,24,72,0.2),0_8px_24px_-12px_rgba(4,24,72,0.5)]">
              <Icon className="h-5 w-5" strokeWidth={2.4} />
            </span>
            <h2
              id="cta-title"
              className="mx-auto max-w-2xl text-balance font-display text-[2rem] font-medium leading-[1.1] tracking-[-0.03em] text-white sm:text-[2.75rem]"
            >
              {feature.ctaTitle}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-balance text-[1rem] leading-relaxed text-white sm:text-[1.05rem]">
              {feature.ctaBody}
            </p>
            <a
              href="/auth"
              className="group mt-8 inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-white px-5 text-[0.95rem] font-semibold text-cta shadow-[0_1px_2px_rgba(4,24,72,0.2),0_8px_24px_-12px_rgba(4,24,72,0.5)] transition-[transform,background-color] duration-200 hover:-translate-y-0.5 hover:bg-white/95 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/40"
            >
              {TRIAL_CTA}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
            <p className="mt-3 text-[0.82rem] text-white">{TRIAL_NOTE}</p>
          </Reveal>

          {/* The map rises from the band's foot and is cut off by it. */}
          <Reveal
            delay={0.12}
            y={40}
            className="mx-auto mt-12 h-[11.5rem] max-w-xl overflow-hidden sm:mt-14 sm:h-[12.5rem]"
          >
            <MapPeek />
          </Reveal>
        </div>
      </Band>
      <Spacer closing />
    </section>
  );
}
