/**
 * The dashboard's fixed navigation.
 *
 * A white rail that answers two questions without a trip anywhere
 * else: at the top, which site you're looking at (and every other one a click
 * away — see SiteSwitcher); at the bottom, who you are and what you're on. It
 * collapses to an icon rail from the handle on its own edge or with ⌘\, and
 * the choice is remembered per browser.
 *
 * The panel used to be a solid #1877f2 field. It is white chrome now, and
 * the brand blue marks the current page and nothing else — see the note on
 * --nav in styles.css for why, and for the tokens that pitch this surface.
 */
import { useCallback, useEffect, useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Avatar } from "@/components/landing/shared";
import { Mark } from "@/components/brand/Mark";
import { SiteSwitcher } from "@/components/studio/SiteSwitcher";
import { PLAN } from "@/data/pricing";
import { getCurrentUser, getSubscription, listBlogs } from "@/lib/data";
import { cn } from "@/lib/utils";
import { SignOutIcon } from "./icons";
import { NAV_FOCUS, NavScroller, NavSections, RailTooltip } from "./SidebarNav";
import { useActiveSite } from "./site-context";
import { useSignOut } from "./use-sign-out";
import type { NavItem } from "./nav";

const COLLAPSE_KEY = "rankvolt.sidebar.collapsed";

/** Reads the remembered state; storage can throw in a locked-down browser. */
function storedCollapsed(): boolean {
  try {
    return window.localStorage.getItem(COLLAPSE_KEY) === "1";
  } catch {
    return false;
  }
}

/**
 * What the account is on right now, from the subscription itself — and, once
 * it runs more than one, how many sites (the ones you can open, leaving or not).
 */
function planLabel(status: string | undefined, sites = 1): string {
  if (status === "trialing") return `${PLAN.name} · trial`;
  if (status === "active") {
    return sites > 1 ? `${PLAN.name} · ${sites} sites` : `${PLAN.name} plan`;
  }
  if (status === "past_due") return `${PLAN.name} · payment due`;
  return "No plan yet";
}

/**
 * The brand at rail width. The mark stands alone here, untiled, so collapsing
 * the rail crops the wordmark rather than changing how the mark itself reads.
 */
function RailMark() {
  return <Mark className="text-nav-fg h-6 w-6" />;
}

/** The brand at full width: the same bare mark, plus the wordmark. */
function RailBrand() {
  return (
    <div className="flex items-center gap-2.5">
      <Mark className="text-nav-fg h-6 w-6" />
      <span className="text-nav-fg text-[1.2rem] font-semibold tracking-tight">Rankbox</span>
    </div>
  );
}

/** Sign out, styled for the rail. Icon-only, so it always carries a label. */
function SignOutButton({ onClick }: { onClick: () => void }) {
  return (
    <RailTooltip label="Sign out">
      <button
        type="button"
        onClick={onClick}
        aria-label="Sign out"
        className={cn(
          "text-nav-muted grid h-8 w-8 shrink-0 place-items-center rounded-lg outline-none",
          "hover:bg-nav-hover hover:text-nav-fg transition-colors",
          NAV_FOCUS,
        )}
      >
        <SignOutIcon className="h-4 w-4" />
      </button>
    </RailTooltip>
  );
}

export function Sidebar() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [collapsed, setCollapsed] = useState(false);
  const signOut = useSignOut();
  const { siteId, sites } = useActiveSite();

  // Read after mount: the server render has no localStorage, and disagreeing
  // with it would trip a hydration mismatch.
  useEffect(() => setCollapsed(storedCollapsed()), []);

  const toggle = useCallback(() => {
    setCollapsed((prev) => {
      const next = !prev;
      try {
        window.localStorage.setItem(COLLAPSE_KEY, next ? "1" : "0");
      } catch {
        // A browser that refuses storage still gets the toggle, just not the memory.
      }
      return next;
    });
  }, []);

  // ⌘\ / Ctrl+\ — the one chord no browser has claimed, and the one every
  // editor uses for exactly this. The label is resolved after mount so the
  // server's guess never has to match the machine's.
  const [chord, setChord] = useState("Ctrl \\");
  useEffect(() => {
    if (/Mac|iPhone|iPad|iPod/.test(navigator.platform || navigator.userAgent)) setChord("⌘\\");
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "\\" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        toggle();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [toggle]);

  const { data: blogs = [] } = useQuery({
    queryKey: ["blogs", siteId],
    queryFn: () => listBlogs(siteId),
  });
  const { data: user } = useQuery({ queryKey: ["auth", "user"], queryFn: getCurrentUser });
  const { data: subscription } = useQuery({ queryKey: ["subscription"], queryFn: getSubscription });

  const queued = blogs.filter((b) => b.status === "scheduled" || b.status === "generating").length;
  const isActive = (item: NavItem) =>
    item.exact ? path === item.to : path === item.to || path.startsWith(`${item.to}/`);
  const name = user?.fullName?.trim() || user?.email || "Your account";
  const plan = planLabel(subscription?.status, sites.length);

  return (
    <TooltipProvider delayDuration={150} skipDelayDuration={400}>
      <aside
        className={cn(
          "group/rail relative hidden shrink-0 md:block",
          "transition-[width] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-none",
          collapsed ? "w-[4.5rem]" : "w-[15.5rem]",
        )}
      >
        <div className="bg-nav-sheen flex h-full w-full flex-col overflow-hidden">
          <div
            className={cn(
              "border-nav-line flex h-14 shrink-0 items-center border-b",
              collapsed ? "justify-center px-0" : "px-4",
            )}
          >
            {collapsed ? <RailMark /> : <RailBrand />}
          </div>

          <div className={cn("shrink-0 pb-1 pt-3", collapsed ? "px-2" : "px-3")}>
            <SiteSwitcher collapsed={collapsed} />
          </div>

          <NavScroller className="py-4">
            <NavSections id="rail" isActive={isActive} collapsed={collapsed} queued={queued} />
          </NavScroller>

          <div className={cn("border-nav-line shrink-0 border-t", collapsed ? "px-2 py-3" : "p-3")}>
            {collapsed ? (
              <div className="flex flex-col items-center gap-1.5">
                <RailTooltip label={name} hint={plan}>
                  <span className="block">
                    <Avatar name={name} className="ring-nav-line h-8 w-8 ring-1" />
                    <span className="sr-only">{`${name} — ${plan}`}</span>
                  </span>
                </RailTooltip>
                <SignOutButton onClick={signOut} />
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <Avatar name={name} className="ring-nav-line h-8 w-8 shrink-0 ring-1" />
                <div className="min-w-0 flex-1">
                  <p className="text-nav-fg truncate text-sm font-medium">{name}</p>
                  <p className="text-nav-muted truncate text-xs">{plan}</p>
                </div>
                <SignOutButton onClick={signOut} />
              </div>
            )}
          </div>
        </div>

        {/* On the seam, half on the rail and half on the page — the one place
            a width control belongs. Always there, but pitched low enough to
            read as part of the edge until the rail is hovered. It is anchored
            to the aside, so it holds still while the rail animates past it. */}
        <RailTooltip label={collapsed ? "Expand" : "Collapse"} hint={chord}>
          <button
            type="button"
            onClick={toggle}
            aria-label={collapsed ? "Expand navigation" : "Collapse navigation"}
            aria-expanded={!collapsed}
            className={cn(
              "absolute -right-3 top-4 z-30 grid h-6 w-6 place-items-center rounded-full",
              "border-nav-line text-nav-muted/70 border bg-card shadow-1 outline-none",
              "transition-[color,border-color,box-shadow] duration-200",
              "hover:border-nav-accent/40 hover:text-nav-accent hover:shadow-2",
              "group-hover/rail:text-nav-muted",
              "focus-visible:ring-nav-accent/60 focus-visible:ring-offset-background focus-visible:ring-2 focus-visible:ring-offset-2",
            )}
          >
            {collapsed ? (
              <ChevronRight className="h-3.5 w-3.5" />
            ) : (
              <ChevronLeft className="h-3.5 w-3.5" />
            )}
          </button>
        </RailTooltip>
      </aside>
    </TooltipProvider>
  );
}
