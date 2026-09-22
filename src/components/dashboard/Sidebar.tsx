/**
 * The dashboard's fixed navigation.
 *
 * Blue chrome, grouped sections, and two answers without a trip anywhere
 * else: at the top, which site you're looking at (and every other one a click
 * away — see SiteSwitcher); at the bottom, who you are and what you're on. It
 * collapses to an icon rail, and the choice is remembered per browser.
 */
import { useEffect, useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ChevronsLeft, ChevronsRight } from "lucide-react";
import { Avatar, Logo } from "@/components/landing/shared";
import { Mark } from "@/components/brand/Mark";
import { SiteSwitcher } from "@/components/studio/SiteSwitcher";
import { PLAN } from "@/data/pricing";
import { getCurrentUser, getSubscription, listBlogs } from "@/lib/data";
import { cn } from "@/lib/utils";
import { SignOutIcon } from "./icons";
import { NavSections } from "./SidebarNav";
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

export function Sidebar() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [collapsed, setCollapsed] = useState(false);
  const signOut = useSignOut();
  const { siteId, sites } = useActiveSite();

  // Read after mount: the server render has no localStorage, and disagreeing
  // with it would trip a hydration mismatch.
  useEffect(() => setCollapsed(storedCollapsed()), []);

  const toggle = () => {
    setCollapsed((prev) => {
      const next = !prev;
      try {
        window.localStorage.setItem(COLLAPSE_KEY, next ? "1" : "0");
      } catch {
        // A browser that refuses storage still gets the toggle, just not the memory.
      }
      return next;
    });
  };

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

  return (
    <aside
      className={cn(
        "hidden shrink-0 flex-col overflow-hidden bg-brand-blue transition-[width] duration-200 md:flex",
        collapsed ? "w-[4.5rem]" : "w-60",
      )}
    >
      <div
        className={cn(
          "flex h-14 shrink-0 items-center border-b border-white/15",
          collapsed ? "justify-center px-0" : "px-5",
        )}
      >
        {collapsed ? <Mark className="h-6 w-6 text-white" /> : <Logo inverted />}
      </div>

      <div className={cn("shrink-0 pt-3", collapsed ? "px-2" : "px-3")}>
        <SiteSwitcher collapsed={collapsed} />
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        <NavSections isActive={isActive} collapsed={collapsed} queued={queued} />
      </nav>

      <div className="border-t border-white/15 p-3">
        <div className={cn("flex items-center gap-2.5", collapsed && "justify-center")}>
          <Avatar name={name} className="h-8 w-8 shrink-0 ring-1 ring-white/25" />
          {!collapsed && (
            <>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-white">{name}</p>
                <p className="truncate text-xs text-white/60">
                  {planLabel(subscription?.status, sites.length)}
                </p>
              </div>
              <button
                type="button"
                onClick={signOut}
                aria-label="Sign out"
                title="Sign out"
                className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-white/60 transition-colors hover:bg-white/10 hover:text-white"
              >
                <SignOutIcon className="h-4 w-4" />
              </button>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={toggle}
          aria-label={collapsed ? "Expand navigation" : "Collapse navigation"}
          className={cn(
            "mt-2 flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-white/60 transition-colors hover:bg-white/10 hover:text-white",
            collapsed && "justify-center px-0",
          )}
        >
          {collapsed ? (
            <ChevronsRight className="h-4 w-4" />
          ) : (
            <>
              <ChevronsLeft className="h-4 w-4" />
              Collapse
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
