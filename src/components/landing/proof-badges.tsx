/**
 * The laurel proof badges: where Rankbox content gets cited, how much has
 * shipped, and where it ranks. Each is a claim the site already makes
 * elsewhere — nothing here is an invented metric.
 *
 * Shared by the landing hero (white on the blue field) and onboarding's proof
 * column (ink on the page background).
 */
import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { engineForMark } from "@/data/ai-seo/engines";
import { AI_MARKS, GoogleMark } from "./ai-logos";

type Tone = "onBlue" | "onLight";

/* One wing: a curved stem with lens-shaped leaves, generated from the stem's
   Bezier so the leaves sit on the curve. The right wing is this one mirrored. */
function Laurel({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 52" aria-hidden className={className}>
      <path
        d="M18 50C1 40 1 12 18 2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M14.2 47.3Q16.8 44.6 15.3 41.2Q12.7 43.9 14.2 47.3ZM14.2 47.3Q10.7 46.1 8.3 49.0Q11.9 50.2 14.2 47.3ZM9.8 42.1Q12.9 40.3 12.4 36.7Q9.3 38.6 9.8 42.1ZM9.8 42.1Q6.8 40.2 3.9 42.2Q6.9 44.2 9.8 42.1ZM6.9 36.1Q10.2 35.1 10.5 31.6Q7.2 32.6 6.9 36.1ZM6.9 36.1Q4.6 33.5 1.3 34.8Q3.7 37.3 6.9 36.1ZM5.4 29.4Q8.7 29.2 9.7 26.0Q6.4 26.3 5.4 29.4ZM5.4 29.4Q3.8 26.6 0.5 27.0Q2.2 29.9 5.4 29.4ZM5.4 22.6Q8.5 23.1 10.1 20.3Q7.0 19.9 5.4 22.6ZM5.4 22.6Q4.5 19.6 1.3 19.4Q2.3 22.4 5.4 22.6ZM6.9 15.9Q9.7 17.0 11.7 14.8Q8.9 13.7 6.9 15.9ZM6.9 15.9Q6.7 13.0 3.8 12.1Q4.0 15.1 6.9 15.9ZM9.8 9.9Q12.2 11.5 14.5 9.9Q12.2 8.3 9.8 9.9ZM9.8 9.9Q10.3 7.1 7.8 5.6Q7.4 8.4 9.8 9.9ZM13.8 5.1Q15.6 7.2 18.1 6.3Q16.4 4.2 13.8 5.1ZM13.8 5.1Q14.9 2.6 13.0 0.7Q11.9 3.2 13.8 5.1Z"
        fill="currentColor"
      />
    </svg>
  );
}

type Mark = (typeof AI_MARKS)[number]["Mark"];

/* Small white tile so the coloured engine marks read on either background. */
function MarkTile({ Mark, title, tone }: { Mark: Mark; title: string; tone: Tone }) {
  return (
    <span
      title={title}
      className={cn(
        "flex h-5 w-5 items-center justify-center rounded-md bg-white",
        tone === "onLight" && "ring-1 ring-border",
      )}
    >
      <Mark className="h-3.5 w-3.5" />
    </span>
  );
}

/**
 * The same tile as a way in: each engine's logo opens its SEO guide. The tile
 * is drawn at 20px to sit inside the badge, so its hit area is widened with an
 * invisible pseudo-element (to the gap on each side, and well above and below)
 * rather than by growing the tile. A small label names the destination.
 */
function MarkLink({ Mark, name, tone }: { Mark: Mark; name: string; tone: Tone }) {
  const engine = engineForMark(name);
  if (!engine) return <MarkTile Mark={Mark} title={name} tone={tone} />;
  return (
    <Link
      to="/ai-seo/$engine"
      params={{ engine: engine.slug }}
      aria-label={`${engine.name} SEO guide`}
      className={cn(
        "group/mark relative flex h-5 w-5 items-center justify-center rounded-md bg-white transition-transform duration-200 before:absolute before:-inset-x-0.5 before:-inset-y-3 before:content-[''] hover:-translate-y-0.5 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        tone === "onBlue"
          ? "focus-visible:ring-white focus-visible:ring-offset-brand-blue"
          : "ring-1 ring-border focus-visible:ring-volt",
      )}
    >
      <Mark className="h-3.5 w-3.5" />
      <span
        aria-hidden
        className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 translate-y-1 whitespace-nowrap rounded-md bg-ink px-2 py-1 text-[0.65rem] font-semibold normal-case tracking-normal text-white opacity-0 shadow-lg transition-all duration-150 group-hover/mark:translate-y-0 group-hover/mark:opacity-100 group-focus-visible/mark:translate-y-0 group-focus-visible/mark:opacity-100"
      >
        {engine.shortName} SEO guide
      </span>
    </Link>
  );
}

function LaurelBadge({ value, label, tone }: { value: ReactNode; label: string; tone: Tone }) {
  return (
    <div className={cn("flex items-center gap-1", tone === "onBlue" ? "text-white" : "text-ink")}>
      <Laurel className="h-11 w-5 shrink-0" />
      <div className="flex flex-col items-center px-0.5">
        <div className="flex items-center gap-1.5 font-display text-lg font-bold leading-none tracking-tight">
          {value}
        </div>
        <span
          className={cn(
            "mt-1 whitespace-nowrap text-[0.58rem] font-semibold uppercase tracking-[0.2em]",
            tone === "onBlue" ? "text-white/85" : "text-muted-foreground",
          )}
        >
          {label}
        </span>
      </div>
      <Laurel className="h-11 w-5 shrink-0 -scale-x-100" />
    </div>
  );
}

export type ProofBadge = "cited" | "articles" | "google";

export function ProofBadges({
  tone = "onBlue",
  badges = ["cited", "articles", "google"],
  linked = false,
  className,
}: {
  tone?: Tone;
  /** Which badges to show, in order. Onboarding shows the citation one alone. */
  badges?: ProofBadge[];
  /**
   * Make each engine logo a link to its SEO guide. The landing hero does;
   * onboarding doesn't, since leaving mid-setup would lose the visitor.
   */
  linked?: boolean;
  /** Layout; defaults to the hero's wrapping row. */
  className?: string;
}) {
  const byId: Record<ProofBadge, { label: string; value: ReactNode }> = {
    cited: {
      label: "Cited across",
      value: (
        <span className="flex items-center gap-1">
          {AI_MARKS.map(({ name, Mark }) =>
            linked ? (
              <MarkLink key={name} Mark={Mark} name={name} tone={tone} />
            ) : (
              <MarkTile key={name} Mark={Mark} title={name} tone={tone} />
            ),
          )}
        </span>
      ),
    },
    articles: { label: "Articles", value: "12K+" },
    google: {
      label: "Ranked on",
      value: (
        <>
          <MarkTile Mark={GoogleMark} title="Google" tone={tone} />
          Google
        </>
      ),
    },
  };

  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-center gap-x-5 gap-y-3 lg:flex-nowrap lg:justify-between lg:gap-x-0",
        className,
      )}
    >
      {badges.map((id) => (
        <LaurelBadge key={id} tone={tone} label={byId[id].label} value={byId[id].value} />
      ))}
    </div>
  );
}
