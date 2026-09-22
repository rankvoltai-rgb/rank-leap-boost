/**
 * Shared primitives for the comparison pages.
 *
 * Competitors are drawn with their own favicon, fetched by domain the same way
 * the hero's URL field and the "Used by" band already do it. Referring to a
 * company by its mark while comparing products is ordinary nominative use, and
 * a real logo is far easier to recognise at a glance than a letter.
 *
 * Two consequences the components have to handle. At 128px the service
 * generally returns the app-icon form of a mark — a full-bleed square with its
 * own background (Jasper's is a red tile, not a transparent glyph) — so the
 * image fills a clipped, rounded tile and the white tile beneath it only shows
 * through for the icons that *are* transparent. And the fetch can fail, or the
 * service can return its generic globe, so every mark keeps the tinted
 * lettermark as a fallback.
 */
import { useCallback, useState, type ReactNode } from "react";
import { Check, Minus, X } from "lucide-react";
import { Mark } from "@/components/brand/Mark";
import { brandIconUrlAt } from "@/lib/brand-icon";
import { cn } from "@/lib/utils";
import type { Cell, CellState, Competitor } from "@/data/alternatives";

/* ---------- competitor lettermark ---------- */

export function CompetitorMark({
  competitor,
  className,
  onDark = false,
}: {
  competitor: Competitor;
  className?: string;
  /** Set on the blue hero and the dark CTA, so the tile keeps its own edge. */
  onDark?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  // 128px even on a 24px tile: the same mark is used up to 48px at 2x, and one
  // size keeps it in a single browser cache entry across the page.
  const src = brandIconUrlAt(competitor.domain, 128);

  /**
   * `onError` alone is not enough for a server-rendered image. The browser
   * starts fetching as soon as it parses the tag, so an icon that fails does
   * so *before* React hydrates and attaches the handler — the error event has
   * already fired and will never fire again, leaving the broken-image glyph
   * sitting where the fallback should be. A ref callback runs at hydration, so
   * it can ask the element directly whether it finished loading with no pixels.
   */
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
                backgroundColor: `color-mix(in oklab, ${competitor.accent} 22%, rgba(255,255,255,0.18))`,
                color: "#fff",
                borderColor: "rgba(255,255,255,0.35)",
              }
            : {
                backgroundColor: `color-mix(in oklab, ${competitor.accent} 18%, transparent)`,
                color: competitor.accent,
                borderColor: `color-mix(in oklab, ${competitor.accent} 34%, transparent)`,
              }
        }
        className={cn(
          "flex shrink-0 items-center justify-center rounded-[26%] border text-sm font-bold",
          className,
        )}
      >
        {competitor.monogram}
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
        // object-contain, not cover: square marks fill the tile edge to edge,
        // and the rare non-square one is letterboxed rather than cropped.
        className="h-full w-full object-contain"
      />
    </span>
  );
}

/** Rankbox's own mark at the same size, for the two-up. */
export function RankboxMark({ className, onDark }: { className?: string; onDark?: boolean }) {
  return (
    <span
      className={cn(
        // White on both, so it sits level with the competitor's favicon tile
        // instead of reading as a translucent chip beside a real logo. The
        // radius is a percentage so the pair keeps one silhouette at every
        // size they are used at, from the 16px score rows to the 48px lockup.
        "flex shrink-0 items-center justify-center rounded-[26%] border bg-white text-ink",
        onDark ? "border-white/25" : "border-border",
        className,
      )}
    >
      <Mark className="h-[52%] w-[52%]" />
    </span>
  );
}

/* ---------- the vs lockup ---------- */

export function VsLockup({
  competitor,
  className,
  onDark = false,
  size = "md",
}: {
  competitor: Competitor;
  className?: string;
  onDark?: boolean;
  size?: "sm" | "md";
}) {
  const tile = size === "sm" ? "h-9 w-9" : "h-12 w-12";
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <RankboxMark className={tile} onDark={onDark} />
      <span
        className={cn(
          "text-[0.65rem] font-bold uppercase tracking-[0.18em]",
          onDark ? "text-white/55" : "text-muted-foreground",
        )}
      >
        vs
      </span>
      <CompetitorMark competitor={competitor} className={tile} onDark={onDark} />
    </div>
  );
}

/* ---------- matrix cell state ---------- */

const CELL_STYLE: Record<
  CellState,
  { icon: typeof Check; ring: string; label: string; strokeWidth: number }
> = {
  yes: {
    icon: Check,
    ring: "bg-success/12 text-success",
    label: "Included",
    strokeWidth: 3,
  },
  partial: {
    icon: Minus,
    ring: "bg-warning/30 text-ink",
    label: "Partly, or via an add-on",
    strokeWidth: 3,
  },
  no: {
    icon: X,
    ring: "bg-muted text-muted-foreground",
    label: "Not what it is for",
    strokeWidth: 2.5,
  },
};

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

/** One cell's badge and note, the shape used in both table and card layouts. */
export function CellBody({ cell, className }: { cell: Cell; className?: string }) {
  return (
    <div className={cn("flex gap-2.5", className)}>
      <CellBadge state={cell.state} />
      <p
        className={cn(
          "text-[0.8rem] leading-snug",
          cell.state === "no" ? "text-muted-foreground" : "text-ink/80",
        )}
      >
        {cell.note}
      </p>
    </div>
  );
}

/* ---------- compact state mark ---------- */

/**
 * The matrix badge at the size of a line of text, for the hero card and the
 * hub table. Same three states and the same screen-reader labels, so a cell
 * reads identically wherever it appears.
 */
export function FactDot({
  state,
  onDark = false,
  className,
}: {
  state: CellState;
  onDark?: boolean;
  className?: string;
}) {
  const s = CELL_STYLE[state];
  const Icon = s.icon;
  const tone = onDark
    ? {
        yes: "bg-white text-brand-blue",
        partial: "bg-white/25 text-white",
        no: "bg-white/10 text-white/60",
      }[state]
    : s.ring;
  return (
    <span
      title={s.label}
      className={cn(
        "mt-[0.1em] flex h-4 w-4 shrink-0 items-center justify-center rounded-full",
        tone,
        className,
      )}
    >
      <Icon className="h-2.5 w-2.5" strokeWidth={s.strokeWidth + 0.5} aria-hidden />
      <span className="sr-only">{s.label}</span>
    </span>
  );
}

/* ---------- small labelled pill ---------- */

export function Tag({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-1 text-[0.7rem] font-semibold text-muted-foreground",
        className,
      )}
    >
      {children}
    </span>
  );
}
