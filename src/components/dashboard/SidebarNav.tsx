/**
 * The dashboard navigation list, shared by the fixed rail and the mobile
 * drawer so both stay identical.
 *
 * The rail is white and almost silent — hairlines, grey labels, grey icons.
 * The brand blue is spent on two things: the mark at the head, and the page
 * you're on, as a filled key that glides from item to item, ticked by a lit
 * bar on the rail's edge. Ten destinations, one of them speaking.
 *
 * Nothing here names a colour. Every surface comes from the --nav-* tokens in
 * styles.css, so the rail can be re-pitched there without touching this file.
 */
import { useEffect, useRef, useState, type ReactElement, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { LayoutGroup, motion, useReducedMotion } from "motion/react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Mark } from "@/components/brand/Mark";
import { cn } from "@/lib/utils";
import { NAV_SECTIONS, type NavItem } from "./nav";

// Fast enough to feel attached to the click, damped enough not to wobble.
const GLIDE = { type: "spring", stiffness: 520, damping: 44, mass: 0.85 } as const;
const INSTANT = { duration: 0 } as const;

/** The ring drawn on a focused control anywhere on the rail. */
export const NAV_FOCUS =
  "focus-visible:ring-2 focus-visible:ring-nav-accent focus-visible:ring-offset-2 focus-visible:ring-offset-nav";

/**
 * The brand at the head of the rail and the drawer. The mark carries the blue;
 * the wordmark stays in the rail's own ink, so the two never compete.
 *
 * `markOnly` is the collapsed icon rail, where the mark stands alone, untiled,
 * so collapsing crops the wordmark rather than changing how the mark reads.
 */
export function NavBrand({ markOnly = false }: { markOnly?: boolean }) {
  if (markOnly) return <Mark className="text-brand-blue h-6 w-6" />;
  return (
    <div className="flex items-center gap-2.5">
      <Mark className="text-brand-blue h-6 w-6" />
      <span className="text-nav-fg text-[1.2rem] font-semibold tracking-tight">Rankbox</span>
    </div>
  );
}

/**
 * The label for an icon-only control. A collapsed rail is unreadable without
 * one, and the browser's own `title` takes a second to appear — too slow to
 * be the only way to find out what a glyph means.
 *
 * Renders the child untouched when there's nothing to explain, so the
 * expanded rail carries no tooltip machinery at all.
 */
export function RailTooltip({
  label,
  hint,
  side = "right",
  enabled = true,
  children,
}: {
  label: string;
  /** A trailing note in a quieter tone, e.g. a keyboard shortcut. */
  hint?: string;
  side?: "right" | "top";
  enabled?: boolean;
  children: ReactElement;
}) {
  if (!enabled) return children;
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      {/* Dark on a white rail: a pale tooltip would vanish into it. */}
      <TooltipContent
        side={side}
        sideOffset={12}
        className="bg-ink px-2.5 py-1.5 text-xs font-medium text-background shadow-3"
      >
        {label}
        {hint && <span className="ml-2 text-background/50">{hint}</span>}
      </TooltipContent>
    </Tooltip>
  );
}

export function NavLink({
  item,
  active,
  collapsed,
  badge,
  onNavigate,
}: {
  item: NavItem;
  active: boolean;
  collapsed?: boolean;
  /** A live count, e.g. how many articles are queued. Hidden when zero. */
  badge?: number;
  onNavigate?: () => void;
}) {
  const still = useReducedMotion();
  const glide = still ? INSTANT : GLIDE;

  return (
    <RailTooltip label={item.title} enabled={Boolean(collapsed)}>
      <Link
        to={item.to}
        onClick={onNavigate}
        aria-current={active ? "page" : undefined}
        className={cn(
          "group relative flex items-center rounded-[10px] text-sm font-medium outline-none",
          "transition-colors duration-150",
          NAV_FOCUS,
          collapsed ? "justify-center px-0 py-2.5" : "gap-3 px-3 py-2",
          active ? "text-nav-key-fg" : "text-nav-fg-idle hover:bg-nav-hover hover:text-nav-fg",
        )}
      >
        {active && (
          <>
            <motion.span
              aria-hidden
              layoutId="key"
              transition={glide}
              className="nav-key absolute inset-0 rounded-[10px]"
            />
            {/* Sits on the rail's own edge, outside the key's padding — the
                eye scans that edge for "you are here" before it reads a word. */}
            <motion.span
              aria-hidden
              layoutId="edge"
              transition={glide}
              className={cn(
                "nav-edge-glow absolute inset-y-1.5 w-[3px] rounded-r-full bg-nav-accent",
                collapsed ? "-left-2" : "-left-3",
              )}
            />
          </>
        )}
        <item.icon
          className={cn(
            "relative h-[1.05rem] w-[1.05rem] shrink-0 transition-colors duration-150",
            active ? "text-nav-key-fg" : "text-nav-muted group-hover:text-nav-fg",
          )}
        />
        {/* Always rendered: it is the link's accessible name, and a tooltip
            is not a name. Collapsed, it is hidden from the eye only. */}
        <span
          className={cn(
            collapsed ? "sr-only" : "relative min-w-0 flex-1 truncate whitespace-nowrap",
            active && "font-semibold",
          )}
        >
          {item.title}
        </span>
        {badge ? (
          <span
            className={cn(
              collapsed
                ? "sr-only"
                : "relative rounded-full px-1.5 py-0.5 text-[0.68rem] font-semibold tabular-nums transition-colors duration-150",
              !collapsed &&
                (active
                  ? "bg-nav-key-fg/25 text-nav-key-fg"
                  : "bg-nav-hover text-nav-muted group-hover:text-nav-fg"),
            )}
          >
            {badge}
          </span>
        ) : null}
      </Link>
    </RailTooltip>
  );
}

export function NavSections({
  id,
  isActive,
  collapsed,
  queued,
  onNavigate,
}: {
  /**
   * Scopes the gliding indicator to this copy of the list. The rail and the
   * drawer can both be mounted at once, and two indicators sharing one name
   * would animate towards each other.
   */
  id: string;
  isActive: (item: NavItem) => boolean;
  collapsed?: boolean;
  /** Articles waiting in the autopilot queue. */
  queued?: number;
  onNavigate?: () => void;
}) {
  return (
    <LayoutGroup id={id}>
      <div className={cn("space-y-6", collapsed ? "px-2" : "px-3")}>
        {NAV_SECTIONS.map((section, index) => (
          <div key={section.label}>
            {/* The first group needs no name — it's the work, and the rail
                opens on it. Naming only what follows lets the eye start on an
                item instead of a heading, and makes the break to "Account"
                mean something. Collapsed, the break itself does that job. */}
            {index > 0 &&
              (collapsed ? (
                <div className="bg-nav-line mx-3 mb-3 h-px" aria-hidden />
              ) : (
                <p className="text-nav-muted px-3 pb-2 text-[0.625rem] font-semibold uppercase tracking-[0.16em]">
                  {section.label}
                </p>
              ))}
            <div className="space-y-1">
              {section.items.map((item) => (
                <NavLink
                  key={item.title}
                  item={item}
                  active={isActive(item)}
                  collapsed={collapsed}
                  badge={item.showsQueueCount ? queued : undefined}
                  onNavigate={onNavigate}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </LayoutGroup>
  );
}

/**
 * The list's own scroller, for the short windows where ten items don't fit.
 *
 * The scrollbar is hidden — a grey thumb beside grey labels is noise — so the
 * edge softens instead, and only on the side there is actually more to see.
 */
export function NavScroller({ className, children }: { className?: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ top: false, bottom: false });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      const top = el.scrollTop > 2;
      const bottom = el.scrollTop + el.clientHeight < el.scrollHeight - 2;
      setEdges((prev) => (prev.top === top && prev.bottom === bottom ? prev : { top, bottom }));
    };
    measure();
    el.addEventListener("scroll", measure, { passive: true });
    // Both the window and the list can change height — collapsing the rail
    // restacks every item.
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    for (const child of Array.from(el.children)) observer.observe(child);
    return () => {
      el.removeEventListener("scroll", measure);
      observer.disconnect();
    };
  }, []);

  return (
    <div className="relative min-h-0 flex-1">
      <div
        ref={ref}
        className={cn(
          "h-full overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          className,
        )}
      >
        {children}
      </div>
      <ScrollEdge side="top" show={edges.top} />
      <ScrollEdge side="bottom" show={edges.bottom} />
    </div>
  );
}

function ScrollEdge({ side, show }: { side: "top" | "bottom"; show: boolean }) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-x-0 h-8 transition-opacity duration-200",
        side === "top"
          ? "from-nav top-0 bg-gradient-to-b to-transparent"
          : "from-nav bottom-0 bg-gradient-to-t to-transparent",
        show ? "opacity-100" : "opacity-0",
      )}
    />
  );
}
