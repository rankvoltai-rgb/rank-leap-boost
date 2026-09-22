import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { flushSync } from "react-dom";
import { ChevronDown, Menu, X } from "lucide-react";
import { Link, useRouterState } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { Logo } from "./shared";
import { MENU_SECTIONS, inSection, type MenuId } from "@/data/nav";
import { FeaturesMenu, ResourcesMenu } from "./nav-menus";
import { MobileNav, type TopLink } from "./nav-mobile";

/* Sections of the landing page. The navbar is shared by every public page,
   so these always target "/" rather than a bare hash on the current page.
   Pricing is the exception: it has its own page. */
const LINKS: readonly (TopLink & { section?: string[] })[] = [
  { label: "Proof", to: "/", hash: "proof" },
  { label: "Pricing", to: "/pricing", section: ["/pricing"] },
  { label: "FAQ", to: "/", hash: "faq" },
];

const MENUS: { id: MenuId; label: string; width: string }[] = [
  { id: "features", label: "Features", width: "w-[min(60rem,calc(100vw-2rem))]" },
  { id: "resources", label: "Resources", width: "w-[min(56rem,calc(100vw-2rem))]" },
];

/* Long enough that sweeping the pointer across the bar doesn't flash a menu
   open; short enough that reaching for one feels instant. */
const OPEN_DELAY = 90;
/* Long enough to cut the corner from a trigger to the far side of its panel. */
const CLOSE_DELAY = 200;

/* Where the panel sits: centred under the bar, just below it. The surface
   behind the menus and the hairline over them share it. */
const STAGE = "absolute inset-x-0 top-[calc(100%+0.5rem)] mx-auto";

/* The panel's surface: the brand blue taken a step deeper, so white text on it
   clears AA and the open menu separates from the hero it opens over. */
const MENU_SURFACE = "bg-[color-mix(in_oklab,var(--brand-blue)_72%,var(--brand-blue-deep))]";

const EASE = "ease-[cubic-bezier(0.22,1,0.36,1)]";

const TOP_ITEM =
  "relative flex h-9 items-center gap-1 whitespace-nowrap rounded-full px-3 text-sm font-medium text-white/80 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 md:px-2 lg:px-3.5";

/* On the landing page itself the router treats "/" → "/" as a no-op, so the
   logo scrolls back to the top instead. */
function scrollHomeToTop(e: MouseEvent) {
  if (window.location.pathname !== "/" || window.location.hash) return;
  e.preventDefault();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/* Marks the top-level item for the section you're in. */
function CurrentDot() {
  return (
    <span
      aria-hidden
      className="absolute bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-white"
    />
  );
}

/* Hover belongs to mice and pens; a tap goes through click instead. */
const hoverOnly = (fn: () => void) => (e: ReactPointerEvent) => {
  if (e.pointerType !== "touch") fn();
};

interface MenuState {
  active: MenuId | null;
  /* The menu shown last, so the surface keeps its size while it fades out. */
  last: MenuId;
  /* True while switching between two open menus: the only time the surface
     animates its size. Opening from closed sizes it at once. */
  morph: boolean;
}

interface Pill {
  x: number;
  y: number;
  w: number;
  h: number;
  visible: boolean;
  /* False when it appears from hidden, so it fades in where it lands instead
     of sliding over from wherever it last was. */
  slide: boolean;
}

export function Navbar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [menu, setMenu] = useState<MenuState>({ active: null, last: "features", morph: false });
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const [pill, setPill] = useState<Pill | null>(null);
  const [sizes, setSizes] = useState<Partial<Record<MenuId, { w: number; h: number }>>>({});
  const [primed, setPrimed] = useState(false);

  const headerRef = useRef<HTMLElement>(null);
  const triggerRefs = useRef<Partial<Record<MenuId, HTMLButtonElement | null>>>({});
  const panelRefs = useRef<Partial<Record<MenuId, HTMLDivElement | null>>>({});
  const itemRefs = useRef<Record<string, HTMLElement | null>>({});
  const timers = useRef<{ open?: number; close?: number }>({});
  const lastPointer = useRef("mouse");

  const active = menu.active;

  const show = useCallback((id: MenuId | null) => {
    setMenu((m) =>
      m.active === id
        ? m
        : { active: id, last: id ?? m.last, morph: m.active !== null && id !== null },
    );
  }, []);

  // Navigating closes everything.
  const [seenPath, setSeenPath] = useState(pathname);
  if (seenPath !== pathname) {
    setSeenPath(pathname);
    setMenu((m) => ({ ...m, active: null, morph: false }));
    setMobileOpen(false);
  }

  const clearTimers = () => {
    window.clearTimeout(timers.current.open);
    window.clearTimeout(timers.current.close);
  };
  useEffect(() => {
    const t = timers.current;
    return () => {
      window.clearTimeout(t.open);
      window.clearTimeout(t.close);
    };
  }, []);

  // Once a menu is open, moving to the other trigger switches at once; only
  // the first opening waits out the intent delay.
  const hoverOpen = (id: MenuId) => {
    clearTimers();
    setPrimed(true);
    if (active) show(id);
    else timers.current.open = window.setTimeout(() => show(id), OPEN_DELAY);
  };
  const scheduleClose = () => {
    clearTimers();
    timers.current.close = window.setTimeout(() => show(null), CLOSE_DELAY);
  };
  const cancelClose = () => window.clearTimeout(timers.current.close);

  // Escape closes (handing focus back to the trigger if it was in the menu);
  // so does pressing anywhere outside the header.
  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      const focusInside = headerRef.current?.contains(document.activeElement);
      show(null);
      if (focusInside) triggerRefs.current[active]?.focus();
    };
    const onDown = (e: PointerEvent) => {
      if (!headerRef.current?.contains(e.target as Node)) show(null);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [active, show]);

  // The surface takes the size of whichever menu is showing, so each menu is
  // measured as it lays out.
  useEffect(() => {
    const measure = () => {
      const next: Partial<Record<MenuId, { w: number; h: number }>> = {};
      for (const { id } of MENUS) {
        const el = panelRefs.current[id];
        if (el) next[id] = { w: el.offsetWidth, h: el.offsetHeight };
      }
      setSizes(next);
    };
    const observer = new ResizeObserver(measure);
    for (const { id } of MENUS) {
      const el = panelRefs.current[id];
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);

  // The pill follows the pointer across the bar, and rests on the open
  // menu's trigger while the pointer is inside that menu.
  const pillKey = hovered ?? active;
  useLayoutEffect(() => {
    const el = pillKey ? itemRefs.current[pillKey] : null;
    setPill((prev) =>
      el
        ? {
            x: el.offsetLeft,
            y: el.offsetTop,
            w: el.offsetWidth,
            h: el.offsetHeight,
            visible: true,
            slide: !!prev?.visible,
          }
        : prev && { ...prev, visible: false },
    );
  }, [pillKey]);

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  const order = (id: MenuId) => MENUS.findIndex((m) => m.id === id);

  // An open menu sits in place; the others wait off to the side they'd slide
  // in from, so moving between menus reads as moving along the bar.
  // Visibility flips at once on the way in, so a link can take focus in the
  // same frame, and waits for the fade on the way out.
  const panelState = (id: MenuId) => {
    if (active === id) {
      return "visible translate-x-0 translate-y-0 opacity-100 transition-[opacity,translate]";
    }
    return cn(
      "invisible pointer-events-none opacity-0 transition-[opacity,translate,visibility]",
      !active ? "-translate-y-1" : order(id) < order(active) ? "-translate-x-6" : "translate-x-6",
    );
  };

  // Up and down arrows walk the menu's links; up from the first returns to
  // the trigger.
  const walkLinks = (e: ReactKeyboardEvent<HTMLDivElement>, id: MenuId) => {
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    const links = Array.from(e.currentTarget.querySelectorAll<HTMLElement>("a[href]"));
    const i = links.indexOf(document.activeElement as HTMLElement);
    if (i === -1) return;
    e.preventDefault();
    if (e.key === "ArrowUp" && i === 0) triggerRefs.current[id]?.focus();
    else links[e.key === "ArrowDown" ? Math.min(i + 1, links.length - 1) : i - 1]?.focus();
  };

  const size = sizes[menu.last];
  const stageStyle = size ? { width: size.w, height: size.h } : undefined;
  const stageMotion = cn(
    menu.morph
      ? "transition-[opacity,translate,width,height] duration-300"
      : "transition-[opacity,translate] duration-200",
    EASE,
    "motion-reduce:transition-none",
    active ? "translate-y-0 opacity-100" : "-translate-y-1 opacity-0",
  );

  return (
    <header ref={headerRef} className="sticky top-0 z-50 bg-brand-blue">
      {/* Frosted scrim over the page while a menu is open, lifting the menu
          off the hero it opens over. Purely visual — never takes the pointer. */}
      <div
        aria-hidden
        className={cn(
          "pointer-events-none fixed inset-x-0 bottom-0 top-16 hidden bg-brand-blue-deep/30 backdrop-blur-sm transition-opacity duration-300 md:block",
          active ? "opacity-100" : "opacity-0",
        )}
      />
      <nav
        aria-label="Main"
        className="relative mx-auto flex h-16 max-w-6xl items-center justify-between px-5"
      >
        {/* The panel's surface, behind both menus: one card that reshapes
            between them rather than two cards that swap. */}
        <div
          aria-hidden
          style={stageStyle}
          className={cn(
            STAGE,
            MENU_SURFACE,
            "pointer-events-none hidden rounded-2xl shadow-[0_28px_70px_-20px_rgba(4,24,72,0.7)] md:block",
            stageMotion,
          )}
        />
        <Link to="/" onClick={scrollHomeToTop} className="relative shrink-0">
          <Logo inverted />
        </Link>
        <div
          className="hidden items-center gap-0.5 md:flex"
          onPointerLeave={() => setHovered(null)}
        >
          <span
            aria-hidden
            style={
              pill
                ? {
                    transform: `translate(${pill.x}px, ${pill.y}px)`,
                    width: pill.w,
                    height: pill.h,
                  }
                : undefined
            }
            className={cn(
              "pointer-events-none absolute left-0 top-0 rounded-full bg-white/[0.13]",
              pill?.slide
                ? cn("transition-[transform,width,opacity] duration-300", EASE)
                : "transition-opacity duration-150",
              "motion-reduce:transition-none",
              pill?.visible ? "opacity-100" : "opacity-0",
            )}
          />
          {/* Bridges the gap between the bar and the panel. */}
          <div
            aria-hidden
            onPointerEnter={hoverOnly(cancelClose)}
            onPointerLeave={hoverOnly(scheduleClose)}
            className={cn(
              "absolute inset-x-0 top-full h-2",
              active ? "pointer-events-auto" : "pointer-events-none",
            )}
          />
          {MENUS.map(({ id, label, width }) => {
            const open = active === id;
            return (
              <div
                key={id}
                onBlur={(e) => {
                  if (open && !e.currentTarget.contains(e.relatedTarget as Node)) show(null);
                }}
              >
                <button
                  ref={(el) => {
                    triggerRefs.current[id] = el;
                    itemRefs.current[id] = el;
                  }}
                  type="button"
                  aria-expanded={open}
                  aria-controls={`nav-menu-${id}`}
                  onPointerDown={(e) => {
                    lastPointer.current = e.pointerType;
                  }}
                  onPointerEnter={(e) => {
                    setHovered(id);
                    if (e.pointerType !== "touch") hoverOpen(id);
                  }}
                  onPointerLeave={hoverOnly(scheduleClose)}
                  onFocus={() => setPrimed(true)}
                  onClick={(e) => {
                    clearTimers();
                    // Hover already opened it: clicking the label the pointer
                    // rests on shouldn't slam it shut. Taps and keys toggle.
                    if (open && e.detail > 0 && lastPointer.current !== "touch") return;
                    show(open ? null : id);
                  }}
                  onKeyDown={(e) => {
                    if (e.key !== "ArrowDown") return;
                    e.preventDefault();
                    flushSync(() => show(id));
                    panelRefs.current[id]?.querySelector<HTMLElement>("a[href]")?.focus();
                  }}
                  className={cn(TOP_ITEM, open && "text-white")}
                >
                  {label}
                  <ChevronDown
                    className={cn(
                      "h-3.5 w-3.5 opacity-70 transition-transform duration-300 motion-reduce:transition-none",
                      open && "rotate-180",
                    )}
                  />
                  {inSection(pathname, MENU_SECTIONS[id]) && <CurrentDot />}
                </button>
                <div
                  id={`nav-menu-${id}`}
                  ref={(el) => {
                    panelRefs.current[id] = el;
                  }}
                  onPointerEnter={hoverOnly(cancelClose)}
                  onPointerLeave={hoverOnly(scheduleClose)}
                  onClick={(e) => {
                    if (!(e.target as HTMLElement).closest("a")) return;
                    clearTimers();
                    show(null);
                  }}
                  onKeyDown={(e) => walkLinks(e, id)}
                  className={cn(
                    STAGE,
                    width,
                    "max-h-[calc(100dvh-5.5rem)] overflow-y-auto overflow-x-hidden rounded-2xl duration-200 ease-out motion-reduce:transition-none",
                    panelState(id),
                  )}
                >
                  {id === "features" ? <FeaturesMenu /> : <ResourcesMenu primed={primed} />}
                </div>
              </div>
            );
          })}
          {LINKS.map((l) => (
            <Link
              key={l.label}
              ref={(el) => {
                itemRefs.current[l.label] = el;
              }}
              to={l.to}
              hash={l.hash}
              onPointerEnter={() => setHovered(l.label)}
              className={cn(TOP_ITEM, l.section && inSection(pathname, l.section) && "text-white")}
            >
              {l.label}
              {l.section && inSection(pathname, l.section) && <CurrentDot />}
            </Link>
          ))}
        </div>
        {/* Hairline and top highlight over the menus, so their tinted zones
            can run right to the panel's edge without covering its border. */}
        <div
          aria-hidden
          style={stageStyle}
          className={cn(
            STAGE,
            "pointer-events-none hidden rounded-2xl border border-white/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.14)] md:block",
            stageMotion,
          )}
        />
        <div className="flex items-center gap-2">
          <a
            href="/auth"
            className="hidden whitespace-nowrap rounded-xl border border-white/30 bg-white/10 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/20 md:inline-flex lg:px-4"
          >
            Sign In
          </a>
          <a
            href="/auth"
            className="hidden whitespace-nowrap rounded-xl bg-white px-3 py-2 text-sm font-semibold text-brand-blue shadow-sm transition-all hover:-translate-y-0.5 hover:bg-white/90 hover:shadow-md md:inline-flex lg:px-4"
          >
            Get Started Free
          </a>
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/30 bg-white/10 text-white md:hidden"
          >
            <Menu
              className={cn(
                "absolute h-5 w-5 transition-all duration-200 motion-reduce:transition-none",
                mobileOpen && "rotate-90 scale-50 opacity-0",
              )}
            />
            <X
              className={cn(
                "absolute h-5 w-5 transition-all duration-200 motion-reduce:transition-none",
                !mobileOpen && "-rotate-90 scale-50 opacity-0",
              )}
            />
          </button>
        </div>
      </nav>
      {mobileOpen && <MobileNav links={LINKS} onClose={closeMobile} />}
    </header>
  );
}
