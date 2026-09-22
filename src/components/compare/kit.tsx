/**
 * Primitives for the head-to-head pages.
 *
 * Products are drawn with their own favicon, fetched by domain — referring to
 * a company by its mark while comparing products is ordinary nominative use,
 * and a real logo is recognised at a glance where a letter isn't. The fetch
 * can fail or return a generic globe, so every mark keeps a tinted lettermark
 * fallback.
 *
 * Nothing here favours a side. Both contenders get the same tile, the same
 * weight and the same neutral surfaces; the only emphasis on the page is the
 * winner of each round, and that is earned per round, not per product.
 */
import { useCallback, useEffect, useState, type MouseEvent } from "react";
import { Check, Equal, Minus, Trophy, X } from "lucide-react";
import { Mark } from "@/components/brand/Mark";
import { brandIconUrlAt } from "@/lib/brand-icon";
import { cn } from "@/lib/utils";
import type { Product } from "@/data/compare/products";
import type { Cell, CellState, Side, Winner } from "@/data/compare/types";

/* ---------- product mark ---------- */

export function ProductMark({
  product,
  className,
  onDark = false,
}: {
  product: Product;
  className?: string;
  /** On the blue hero, so the tile keeps its own edge. */
  onDark?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  // One size everywhere keeps each mark in a single browser cache entry.
  const src = brandIconUrlAt(product.domain, 128);

  /* A server-rendered <img> can fail before React hydrates and attaches
     onError, so the error never reaches the handler. The ref callback runs at
     hydration and asks the element directly. */
  const catchAlreadyFailed = useCallback((img: HTMLImageElement | null) => {
    if (img?.complete && img.naturalWidth === 0) setFailed(true);
  }, []);

  if (!src || failed) {
    return (
      <span
        aria-hidden
        style={
          onDark
            ? {
                backgroundColor: `color-mix(in oklab, ${product.accent} 22%, rgba(255,255,255,0.18))`,
                color: "#fff",
                borderColor: "rgba(255,255,255,0.35)",
              }
            : {
                backgroundColor: `color-mix(in oklab, ${product.accent} 14%, transparent)`,
                color: product.accent,
                borderColor: `color-mix(in oklab, ${product.accent} 30%, transparent)`,
              }
        }
        className={cn(
          "flex shrink-0 items-center justify-center rounded-[26%] border font-bold",
          className,
        )}
      >
        {product.monogram}
      </span>
    );
  }

  return (
    <span
      aria-hidden
      className={cn(
        "flex shrink-0 items-center justify-center overflow-hidden rounded-[26%] border bg-white",
        onDark ? "border-white/25" : "border-border",
        className,
      )}
    >
      <img
        ref={catchAlreadyFailed}
        src={src}
        alt=""
        loading="lazy"
        onError={() => setFailed(true)}
        className="h-full w-full object-contain"
      />
    </span>
  );
}

/** Rankbox's mark on the same white tile, for the disclosed third option. */
export function RankboxTile({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "flex shrink-0 items-center justify-center rounded-[26%] border border-border bg-white text-ink",
        className,
      )}
    >
      <Mark className="h-[52%] w-[52%]" />
    </span>
  );
}

/* ---------- the face-off ---------- */

/**
 * Two tiles and a VS disc. On first paint the tiles slide in toward each
 * other — the one piece of motion on the page that means something (these two
 * are squaring up). It's CSS rather than JS so it runs from the server HTML
 * without a hydration flash, and `motion-safe` holds it still for anyone who
 * prefers reduced motion.
 */
const ENTER =
  "motion-safe:animate-in motion-safe:fade-in motion-safe:duration-700 motion-safe:ease-[cubic-bezier(0.22,1,0.36,1)]";

export function FaceOff({
  a,
  b,
  size = "lg",
  onDark = false,
  className,
}: {
  a: Product;
  b: Product;
  size?: "sm" | "lg";
  onDark?: boolean;
  className?: string;
}) {
  const lg = size === "lg";
  const tile = lg ? "h-16 w-16 text-2xl shadow-lg sm:h-20 sm:w-20" : "h-10 w-10 text-sm";
  const disc = lg ? "h-11 w-11 text-[0.72rem]" : "h-7 w-7 text-[0.55rem]";

  return (
    <div className={cn("flex items-center", lg ? "gap-4 sm:gap-5" : "gap-2", className)}>
      <div className={cn(lg && ENTER, lg && "motion-safe:slide-in-from-left-8")}>
        <ProductMark product={a} onDark={onDark} className={tile} />
      </div>
      <span
        aria-hidden
        className={cn(
          "flex shrink-0 items-center justify-center rounded-full font-display font-extrabold tracking-[0.08em]",
          disc,
          onDark
            ? "bg-white text-brand-blue ring-4 ring-white/15"
            : "bg-ink text-background ring-4 ring-ink/5",
        )}
      >
        VS
      </span>
      <div className={cn(lg && ENTER, lg && "motion-safe:slide-in-from-right-8")}>
        <ProductMark product={b} onDark={onDark} className={tile} />
      </div>
    </div>
  );
}

/* ---------- round winner ---------- */

export function WinnerChip({
  winner,
  sides,
  className,
}: {
  winner: Winner;
  sides: Record<Side, Product>;
  className?: string;
}) {
  if (winner === "draw") {
    return (
      <span
        className={cn(
          "inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full border border-border bg-surface px-3 text-xs font-semibold text-muted-foreground",
          className,
        )}
      >
        <Equal className="h-3.5 w-3.5" aria-hidden />
        Draw
      </span>
    );
  }
  const p = sides[winner];
  return (
    <span
      className={cn(
        "inline-flex h-8 shrink-0 items-center gap-2 rounded-full bg-ink py-1 pl-1 pr-3 text-xs font-semibold text-background",
        className,
      )}
    >
      <ProductMark product={p} className="h-6 w-6 text-[0.6rem]" />
      {p.name} wins
    </span>
  );
}

/** The tiny winner marker in the scorecard rail. */
export function WinnerDot({ winner, sides }: { winner: Winner; sides: Record<Side, Product> }) {
  if (winner === "draw") {
    return (
      <span
        title="Draw"
        className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-border bg-surface text-muted-foreground"
      >
        <Equal className="h-3 w-3" aria-hidden />
        <span className="sr-only">Draw</span>
      </span>
    );
  }
  return (
    <span title={`${sides[winner].name} wins`} className="shrink-0">
      <ProductMark product={sides[winner]} className="h-5 w-5 text-[0.5rem]" />
      <span className="sr-only">{sides[winner].name} wins</span>
    </span>
  );
}

export function TrophyTag() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-brand-blue/10 px-2 py-0.5 text-[0.62rem] font-bold uppercase tracking-[0.1em] text-brand-blue dark:text-volt">
      <Trophy className="h-3 w-3" aria-hidden />
      Round winner
    </span>
  );
}

/* ---------- matrix cells ---------- */

const CELL_STYLE: Record<
  CellState,
  { icon: typeof Check; ring: string; label: string; strokeWidth: number }
> = {
  yes: { icon: Check, ring: "bg-success/12 text-success", label: "Included", strokeWidth: 3 },
  partial: {
    icon: Minus,
    ring: "bg-warning/30 text-ink",
    label: "Partly, or as an add-on",
    strokeWidth: 3,
  },
  no: {
    icon: X,
    ring: "bg-muted text-muted-foreground",
    label: "Not what it's built for",
    strokeWidth: 2.5,
  },
};

export const CELL_LEGEND = (Object.keys(CELL_STYLE) as CellState[]).map((state) => ({
  state,
  label: CELL_STYLE[state].label,
}));

export function CellBadge({ state, className }: { state: CellState; className?: string }) {
  const s = CELL_STYLE[state];
  const Icon = s.icon;
  return (
    <span
      title={s.label}
      className={cn(
        "flex h-6 w-6 shrink-0 items-center justify-center rounded-full",
        s.ring,
        className,
      )}
    >
      <Icon className="h-3.5 w-3.5" strokeWidth={s.strokeWidth} aria-hidden />
      <span className="sr-only">{s.label}</span>
    </span>
  );
}

export function CellBody({ cell }: { cell: Cell }) {
  return (
    <div className="flex gap-2.5">
      <CellBadge state={cell.state} />
      <p
        className={cn(
          "text-[0.82rem] leading-snug",
          cell.state === "no" ? "text-muted-foreground" : "text-ink/85",
        )}
      >
        {cell.note}
      </p>
    </div>
  );
}

/* ---------- scroll-spy ---------- */

/* Clears the sticky navbar plus a little air. */
const OFFSET = 96;

/** The id of the last section whose top has scrolled past the offset. */
export function useActiveSection(ids: string[]): string | null {
  const [active, setActive] = useState<string | null>(null);
  const key = ids.join("|");
  useEffect(() => {
    const list = key.split("|");
    let frame = 0;
    const measure = () => {
      frame = 0;
      let current: string | null = null;
      for (const id of list) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= OFFSET + 40) current = id;
      }
      setActive(current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [key]);
  return active;
}

/** Smooth in-page jump that lands below the sticky navbar and keeps the hash. */
export function jumpTo(e: MouseEvent<HTMLAnchorElement>, id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  e.preventDefault();
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.scrollTo({
    top: el.getBoundingClientRect().top + window.scrollY - OFFSET + 8,
    behavior: reduce ? "auto" : "smooth",
  });
  history.replaceState(null, "", `#${id}`);
}
