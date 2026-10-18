/**
 * The strip under the landing hero, after Rankaria's "As seen on" band: a
 * full-width hairline band inside the page rails, framed by a laurel wing at
 * each end, holding the hero's three proof points (where Rankbox content is
 * cited, how many articles have shipped, where they rank).
 *
 * The logos rest in greyscale like a press strip and take their colour on
 * hover. Each engine logo opens that engine's SEO guide; these are the
 * keyboard route to the guides, since the headline's rotating name is not
 * in the tab order.
 */
import type { ComponentType, CSSProperties } from "react";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { engineForMark } from "@/data/ai-seo/engines";
import { AI_MARKS, GoogleMark } from "./ai-logos";
import { Laurel } from "./proof-badges";

const LINE = "border-ink/[0.07]";

function Label({ children }: { children: string }) {
  return (
    <span className="whitespace-nowrap text-[0.62rem] font-semibold uppercase tracking-[0.15em] text-muted-foreground/85 sm:text-[0.64rem] sm:tracking-[0.2em]">
      {children}
    </span>
  );
}

function EngineLink({ name, Mark }: { name: string; Mark: ComponentType<{ className?: string }> }) {
  const engine = engineForMark(name);
  const body = <Mark className="h-[18px] w-[18px]" />;
  const look =
    "group/mark relative flex h-8 w-8 items-center justify-center rounded-lg grayscale opacity-60 transition-[filter,opacity,transform,background-color] duration-200 hover:-translate-y-0.5 hover:bg-ink/[0.035] hover:opacity-100 hover:grayscale-0 focus-visible:opacity-100 focus-visible:grayscale-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta/40";
  if (!engine) {
    return (
      <span title={name} className={look}>
        {body}
      </span>
    );
  }
  return (
    <Link
      to="/ai-seo/$engine"
      params={{ engine: engine.slug }}
      aria-label={`${engine.name} SEO guide`}
      className={look}
    >
      {body}
      <span
        aria-hidden
        className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 translate-y-1 whitespace-nowrap rounded-md bg-ink px-2 py-1 text-[0.68rem] font-semibold text-white opacity-0 shadow-lg transition-[opacity,transform] duration-150 group-hover/mark:translate-y-0 group-hover/mark:opacity-100 group-focus-visible/mark:translate-y-0 group-focus-visible/mark:opacity-100"
      >
        {engine.shortName} SEO guide
      </span>
    </Link>
  );
}

export function HeroProofBand({ style, className }: { style?: CSSProperties; className?: string }) {
  return (
    // Top hairline only: the band that follows draws the line under this one.
    <div className={cn("border-t", LINE, className)} style={style}>
      <div className={cn("relative mx-auto max-w-6xl border-x", LINE)}>
        <Laurel className="pointer-events-none absolute left-5 top-1/2 hidden h-[68px] w-auto -translate-y-1/2 text-ink/[0.1] md:block" />
        <Laurel className="pointer-events-none absolute right-5 top-1/2 hidden h-[68px] w-auto -translate-y-1/2 -scale-x-100 text-ink/[0.1] md:block" />

        <div className="grid grid-cols-2 md:mx-16 md:grid-cols-[1.5fr_1fr_1fr]">
          <div
            className={cn(
              "col-span-2 flex h-[72px] items-center justify-center gap-3 border-b md:col-span-1 md:border-b-0 md:border-r",
              LINE,
            )}
          >
            <Label>Cited across</Label>
            <span className="flex items-center gap-0.5">
              {AI_MARKS.map(({ name, Mark }) => (
                <EngineLink key={name} name={name} Mark={Mark} />
              ))}
            </span>
          </div>

          <div
            className={cn(
              "flex h-[72px] items-center justify-center gap-2 border-r sm:gap-2.5",
              LINE,
            )}
          >
            <span className="font-display text-[1.3rem] font-bold leading-none tracking-tight text-ink/75">
              12K+
            </span>
            <Label>Articles</Label>
          </div>

          <div className="group/google flex h-[72px] items-center justify-center gap-2 sm:gap-2.5">
            <Label>Ranked on</Label>
            <span className="flex items-center gap-1.5 text-[1.05rem] font-semibold tracking-tight text-ink/70 transition-colors group-hover/google:text-ink">
              <GoogleMark className="h-[18px] w-[18px] grayscale opacity-60 transition-[filter,opacity] duration-200 group-hover/google:opacity-100 group-hover/google:grayscale-0" />
              Google
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
