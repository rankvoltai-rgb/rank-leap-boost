/**
 * The dashboard's fixed navigation.
 *
 * Blue chrome, grouped sections, and a footer that answers "who am I and what
 * am I on" without a trip to billing. It collapses to an icon rail, and the
 * choice is remembered per browser.
 */
import { useEffect, useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ChevronsLeft, ChevronsRight } from "lucide-react";
import { Avatar, Logo } from "@/components/landing/shared";
import rankvoltMark from "@/assets/rankvolt-mark.png.asset.json";
import { getCurrentUser, getProfile, getSubscription, listBlogs } from "@/lib/data";
import { brandIconUrl } from "@/lib/brand-icon";
import { cn } from "@/lib/utils";
import { SignOutIcon } from "./icons";
import { NavSections } from "./SidebarNav";
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

/** What the account is on right now, from the subscription itself. */
function planLabel(status: string | undefined): string {
  if (status === "trialing") return "Pro plan · trial";
  if (status === "active") return "Pro plan";
  if (status === "past_due") return "Pro plan · payment due";
  return "No plan yet";
}

/**
 * The account's website favicon, contained on a white disc so dark marks
 * still read on the blue sidebar. Falls back to initials when there's no
 * website yet or the icon won't load.
 */
function SiteAvatar({ name, favicon }: { name: string; favicon: string | null }) {
  const [failed, setFailed] = useState(false);
  if (!favicon || failed) {
    return <Avatar name={name} className="h-8 w-8 shrink-0 ring-1 ring-white/25" />;
  }
  return (
    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white ring-1 ring-white/25">
      <img
        src={favicon}
        alt=""
        onError={() => setFailed(true)}
        className="h-5 w-5 rounded-sm object-contain"
      />
    </span>
  );
}

export function Sidebar() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [collapsed, setCollapsed] = useState(false);
  const signOut = useSignOut();

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

  const { data: blogs = [] } = useQuery({ queryKey: ["blogs"], queryFn: () => listBlogs() });
  const { data: user } = useQuery({ queryKey: ["auth", "user"], queryFn: getCurrentUser });
  const { data: subscription } = useQuery({ queryKey: ["subscription"], queryFn: getSubscription });
  const { data: profile } = useQuery({ queryKey: ["profile"], queryFn: getProfile });
  const favicon = profile?.website_url ? brandIconUrl(profile.website_url) : null;

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
        {collapsed ? (
          <img
            src={rankvoltMark.url}
            alt="Rankbox"
            /* brightness-0 invert turns the black source mark white, the same
               trick the inverted Logo uses. */
            className="h-6 w-6 object-contain brightness-0 invert"
          />
        ) : (
          <Logo inverted />
        )}
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        <NavSections isActive={isActive} collapsed={collapsed} queued={queued} />
      </nav>

      <div className="border-t border-white/15 p-3">
        <div className={cn("flex items-center gap-2.5", collapsed && "justify-center")}>
          {/* Keyed so a new website gets a fresh load instead of a stale failure. */}
          <SiteAvatar key={favicon ?? "none"} name={name} favicon={favicon} />
          {!collapsed && (
            <>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-white">{name}</p>
                <p className="truncate text-xs text-white/60">{planLabel(subscription?.status)}</p>
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
