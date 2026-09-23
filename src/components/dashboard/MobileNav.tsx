/**
 * The same rail, as a drawer, for screens with no room for one.
 *
 * It is laid out as a column rather than a page with a pinned footer: on a
 * short phone the list scrolls under the header and the account corner — the
 * site switcher and the sign-out row — stays reachable, instead of the last
 * item hiding behind it.
 */
import { useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SiteSwitcher } from "@/components/studio/SiteSwitcher";
import { NAV_FOCUS, NavBrand, NavScroller, NavSections } from "./SidebarNav";
import { SignOutIcon } from "./icons";
import { useSignOut } from "./use-sign-out";
import type { NavItem } from "./nav";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const signOut = useSignOut();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const isActive = (item: NavItem) =>
    item.exact ? path === item.to : path === item.to || path.startsWith(`${item.to}/`);
  const close = () => setOpen(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          type="button"
          aria-label="Open navigation"
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-ink transition-colors hover:bg-secondary md:hidden"
        >
          <Menu className="h-4 w-4" />
        </button>
      </SheetTrigger>
      <SheetContent side="left" className="bg-nav-sheen w-[17rem] border-none p-0 sm:max-w-[17rem]">
        <SheetTitle className="sr-only">Navigation</SheetTitle>
        <TooltipProvider>
          <div className="flex h-full flex-col">
            <div className="flex h-14 shrink-0 items-center border-nav-line border-b px-4">
              <NavBrand />
            </div>
            <NavScroller className="pb-4 pt-3">
              <NavSections id="drawer" isActive={isActive} onNavigate={close} />
            </NavScroller>
            {/* The same account corner as the rail: the site you're in, then
                the way out. */}
            <div className="shrink-0 space-y-2.5 border-nav-line border-t p-3">
              <SiteSwitcher onNavigate={close} />
              <button
                type="button"
                onClick={signOut}
                className={cn(
                  "text-nav-fg-idle flex w-full items-center gap-3 rounded-[10px] px-3 py-2 text-sm font-medium outline-none",
                  "hover:bg-nav-hover hover:text-nav-fg transition-colors",
                  NAV_FOCUS,
                )}
              >
                <SignOutIcon className="text-nav-muted h-4 w-4" />
                Sign out
              </button>
            </div>
          </div>
        </TooltipProvider>
      </SheetContent>
    </Sheet>
  );
}
