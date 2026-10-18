import type { CSSProperties } from "react";
import { BadgeCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { Reveal, Avatar, Stars } from "./shared";
import { AVATARS } from "./avatars";
import { Accent, Band, LINE_FILL, SectionHead, Spacer } from "./frame";

export const TESTIMONIALS = [
  {
    q: "About a month in, a couple of our guides started showing up as the cited source inside ChatGPT answers. We didn't even know that was possible — now it's our most qualified traffic.",
    n: "Owen Carter",
    r: "Founder",
    c: "Briefly",
    a: AVATARS[0],
  },
  {
    q: "Rankbox got us quoted in Perplexity for our core questions. Steady visibility, real signups, and all of it runs without me touching a thing.",
    n: "Priya Raman",
    r: "Growth Lead",
    c: "Safeguard",
    a: AVATARS[1],
  },
  {
    q: "We filled a thin site with genuinely good, source-backed articles in weeks. The structure is clearly built for how AI models read content — it shows in where we surface.",
    n: "Aman Desai",
    r: "Founder",
    c: "Yardstick",
    a: AVATARS[2],
  },
  {
    q: "Setup took minutes and it plugged into our store cleanly. The answer-space research is the part that surprised me — it finds questions our buyers actually ask AI.",
    n: "Elise Tanaka",
    r: "Co-founder",
    c: "Plannora",
    a: AVATARS[3],
  },
  {
    q: "I was paying a writer and an SEO tool subscription. Rankbox replaced both, writes better, and I'm finally ranking for terms I'd given up on.",
    n: "Marco Silva",
    r: "Marketing Lead",
    c: "Northwind Labs",
    a: AVATARS[4],
  },
  {
    q: "The consistency is the whole game. A strong article goes live every day without me thinking about outlines, keywords, or publishing. It just compounds.",
    n: "Hannah Whitfield",
    r: "Founder",
    c: "Loopcraft",
    a: AVATARS[5],
  },
];

const STATS = [
  ["400+", "Active founders"],
  ["4.8/5", "Average rating"],
  ["60K+", "Articles published"],
  ["Daily", "Auto-published content"],
] as const;

/* The phrase in each quote set in blue, as Rankaria marks the line that
   matters. Each is a verbatim substring of that person's quote. */
const HIGHLIGHT: Record<string, string> = {
  "Owen Carter": "the cited source inside ChatGPT answers",
  "Priya Raman": "quoted in Perplexity",
  "Aman Desai": "genuinely good, source-backed articles",
  "Elise Tanaka": "finds questions our buyers actually ask AI",
  "Marco Silva": "Rankbox replaced both",
  "Hannah Whitfield": "It just compounds.",
};

function Quote({ text, phrase }: { text: string; phrase?: string }) {
  const at = phrase ? text.indexOf(phrase) : -1;
  if (!phrase || at === -1) return <>&ldquo;{text}&rdquo;</>;
  return (
    <>
      &ldquo;{text.slice(0, at)}
      <span className="font-semibold text-brand-blue">{phrase}</span>
      {text.slice(at + phrase.length)}&rdquo;
    </>
  );
}

function Card({ t }: { t: (typeof TESTIMONIALS)[number] }) {
  return (
    <figure className="flex w-[19rem] shrink-0 flex-col rounded-xl border border-ink/[0.08] bg-white p-5 shadow-[0_1px_2px_rgba(16,24,40,0.04)] transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-1 hover:border-ink/[0.14] hover:shadow-[0_18px_40px_-24px_rgba(16,24,40,0.3)] sm:w-[22rem]">
      <figcaption className="flex items-center gap-3">
        <Avatar name={t.n} src={t.a} className="h-10 w-10 ring-white" />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-ink">{t.n}</p>
          <p className="truncate text-xs text-muted-foreground">
            {t.r}
            {t.c ? ` · ${t.c}` : ""}
          </p>
        </div>
        <Stars className="ml-auto shrink-0 [&_svg]:h-3 [&_svg]:w-3" />
      </figcaption>
      {/* The quote sits in its own dashed box, after Rankaria's cards. */}
      <blockquote className="mt-4 flex-1 rounded-lg border border-dashed border-ink/[0.12] p-3.5 text-[0.88rem] leading-relaxed text-ink/90">
        <Quote text={t.q} phrase={HIGHLIGHT[t.n]} />
      </blockquote>
    </figure>
  );
}

export function Testimonials() {
  return (
    <section>
      <Spacer />
      <SectionHead
        icon={BadgeCheck}
        eyebrow="Loved by founders"
        title={
          <>
            Growth-minded teams, <Accent>real results</Accent>
          </>
        }
        subtitle="See how teams across SaaS, e-commerce, and agencies use Rankbox to grow organic traffic and get their brand cited by AI assistants."
      />

      <Band>
        <dl className={cn("grid grid-cols-2 gap-px sm:grid-cols-4", LINE_FILL)}>
          {STATS.map(([value, label], i) => (
            <div key={label} className="bg-white">
              <Reveal delay={i * 0.05} className="px-5 py-7 text-center sm:py-9">
                <dt className="sr-only">{label}</dt>
                <dd>
                  <span className="block font-display text-[1.9rem] font-semibold leading-none tracking-[-0.03em] text-ink">
                    {value}
                  </span>
                  <span
                    className="mt-2 block text-xs font-medium text-muted-foreground sm:text-sm"
                    aria-hidden
                  >
                    {label}
                  </span>
                </dd>
              </Reveal>
            </div>
          ))}
        </dl>
      </Band>

      {/* The quotes roll slowly past, edge to edge of the rails. Hover holds
          them; with reduced motion they sit still and scroll sideways. The
          track holds the cards twice for a seamless loop, and the copy is
          hidden from screen readers. */}
      <Band inner="overflow-hidden py-8 sm:py-10">
        <div className="group/row [mask-image:linear-gradient(to_right,transparent,#000_6%,#000_94%,transparent)] motion-reduce:overflow-x-auto">
          <div
            className="flex w-max motion-safe:animate-marquee group-hover/row:[animation-play-state:paused]"
            style={{ "--marquee-duration": "70s" } as CSSProperties}
          >
            {/* Spacing lives inside each copy (gap + trailing pad), so half
                the track is exactly one copy and the loop has no seam. */}
            <div className="flex gap-4 pr-4">
              {TESTIMONIALS.map((t) => (
                <Card key={t.n} t={t} />
              ))}
            </div>
            <div aria-hidden className="flex gap-4 pr-4 motion-reduce:hidden">
              {TESTIMONIALS.map((t) => (
                <Card key={t.n} t={t} />
              ))}
            </div>
          </div>
        </div>
      </Band>
    </section>
  );
}
