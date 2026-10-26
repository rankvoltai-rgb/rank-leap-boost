/**
 * The row of engine marks at the top of every AI SEO guide: the way between
 * guides. The engine you're reading opens out into a labelled soft-blue pill;
 * the others in its tier sit beside it as marks, and the other tier follows
 * after a hairline, smaller, so all eleven guides are one click away without
 * the row turning into a menu. On the hub, with nothing active, it's simply
 * every engine in order.
 *
 * Below md the row would wrap into ragged lines, so it becomes one line that
 * scrolls sideways instead: the lists dissolve (display: contents) so every
 * mark is a flex item of the nav, the current pill is pinned at the left, and
 * the right edge fades while there's more to swipe to.
 *
 * Shared by every guide on purpose: it's navigation, like the navbar, and it
 * should behave the same on every page.
 */
import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { enginesInTier, getEngine, type Engine, type EngineSlug } from "@/data/ai-seo/engines";
import { EngineMark } from "./kit";

function Tile({ engine, small = false }: { engine: Engine; small?: boolean }) {
  return (
    <li className="shrink-0">
      <Link
        to="/ai-seo/$engine"
        params={{ engine: engine.slug }}
        aria-label={`${engine.name} SEO guide`}
        className={cn(
          "group relative flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:bg-ink/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-cta/40",
          small && "md:h-8 md:w-8",
        )}
      >
        <span
          className={cn(
            "flex h-7 w-7 items-center justify-center rounded-md border border-ink/[0.08] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.05)] transition-transform duration-200 group-hover:-translate-y-0.5 motion-reduce:transition-none",
            small && "md:h-6 md:w-6",
          )}
        >
          <EngineMark
            mark={engine.mark}
            className={small ? "h-4 w-4 md:h-3.5 md:w-3.5" : "h-4 w-4"}
          />
        </span>
        {/* Hover label: desktop only, where the row doesn't clip it. */}
        <span
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-full z-20 mt-1.5 hidden -translate-x-1/2 translate-y-1 whitespace-nowrap rounded-md border border-ink/[0.08] bg-white px-2 py-1 text-[0.7rem] font-medium text-ink opacity-0 shadow-[0_8px_24px_-12px_rgba(16,24,40,0.3)] transition-all duration-150 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 md:block"
        >
          {engine.shortName}
        </span>
      </Link>
    </li>
  );
}

function Current({ engine }: { engine: Engine }) {
  return (
    <li className="sticky left-0 z-10 order-first shrink-0 bg-white pr-1 md:static md:order-none md:bg-transparent md:pr-0">
      <span
        aria-current="page"
        className="inline-flex h-9 items-center gap-2 whitespace-nowrap rounded-lg bg-cta-soft py-1 pl-1 pr-3 text-[0.85rem] font-medium text-cta"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-md bg-white shadow-[0_1px_2px_rgba(16,24,40,0.06)]">
          <EngineMark mark={engine.mark} className="h-4 w-4" />
        </span>
        {engine.shortName} SEO guide
      </span>
    </li>
  );
}

const LIST = "contents md:flex md:flex-wrap md:items-center md:gap-0.5";

export function EngineRail({ active, className }: { active?: EngineSlug; className?: string }) {
  const current = active ? getEngine(active) : undefined;
  const tier = current?.tier ?? "frontier";
  const other = tier === "frontier" ? "more" : "frontier";

  // Fade the right edge only while there's more row to scroll to.
  const ref = useRef<HTMLDivElement>(null);
  const [more, setMore] = useState(true);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const check = () => setMore(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
    check();
    el.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    return () => {
      el.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, []);

  return (
    <nav
      aria-label="SEO guides by answer engine"
      className={cn(
        // Phone: the frame spans its strip; contain:inline-size keeps the
        // row's length out of its parent's sizing, so a grid or flex wrapper
        // can't widen to fit it.
        "flex w-full max-w-full rounded-xl border border-ink/[0.08] bg-white p-1 shadow-[0_1px_2px_rgba(16,24,40,0.04)] [contain:inline-size]",
        "md:inline-flex md:w-auto md:bg-white/90 md:backdrop-blur md:[contain:none]",
        className,
      )}
    >
      {/* The scroller sits inside the frame, so only the marks fade at the edge. */}
      <div
        ref={ref}
        className={cn(
          // Phone: one line that scrolls sideways.
          "flex min-w-0 flex-1 items-center gap-0.5 overflow-x-auto overscroll-x-contain rounded-lg [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          more && "[mask-image:linear-gradient(to_right,#000_calc(100%-2.5rem),transparent)]",
          // md and up: the row as it was, wrapping if it ever has to.
          "md:flex-wrap md:gap-1 md:overflow-visible md:[mask-image:none]",
        )}
      >
        <ul role="list" className={LIST}>
          {enginesInTier(tier).map((e) =>
            e.slug === active ? (
              <Current key={e.slug} engine={e} />
            ) : (
              <Tile key={e.slug} engine={e} />
            ),
          )}
        </ul>
        <span aria-hidden className="mx-1 h-5 w-px shrink-0 bg-ink/[0.1]" />
        <ul role="list" className={LIST}>
          {enginesInTier(other).map((e) => (
            <Tile key={e.slug} engine={e} small />
          ))}
        </ul>
      </div>
    </nav>
  );
}
