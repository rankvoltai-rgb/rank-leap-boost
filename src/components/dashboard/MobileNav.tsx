/**
 * The same rail, as a drawer, for screens with no room for one.
 *
 * It is laid out as a column rather than a page with a pinned footer: on a
 * short phone the list scrolls under the header and the sign-out row stays
 * reachable, instead of the last item hiding behind it.
 */
import { useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Logo } from "@/components/landing/shared";
import { SiteSwitcher } from "@/components/studio/SiteSwitcher";
import { NavScroller, NavSections } from "./SidebarNav";
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
      {/* text-white: the sheet's own close button inherits its colour, and on
          ink the default ink-on-ink glyph is invisible. */}
      <SheetContent
        side="left"
        className="bg-nav-sheen w-[17rem] border-none p-0 text-white sm:max-w-[17rem]"
      >
        <SheetTitle className="sr-only">Navigation</SheetTitle>
        <TooltipProvider>
          <div className="flex h-full flex-col">
            <div className="flex h-14 shrink-0 items-center border-b border-white/[0.07] px-4">
              <Logo inverted />
            </div>
            <div className="shrink-0 px-3 pb-1 pt-3">
              <SiteSwitcher onNavigate={close} />
            </div>
            <NavScroller className="py-4">
              <NavSections id="drawer" isActive={isActive} onNavigate={close} />
            </NavScroller>
            <div className="shrink-0 border-t border-white/[0.07] p-3">
              <button
                type="button"
                onClick={signOut}
                className="flex w-full items-center gap-3 rounded-[10px] px-3 py-2 text-sm font-medium text-white/60 outline-none transition-colors hover:bg-white/[0.055] hover:text-white focus-visible:ring-2 focus-visible:ring-nav-accent focus-visible:ring-offset-2 focus-visible:ring-offset-nav"
              >
                <SignOutIcon className="h-4 w-4 text-white/45" />
                Sign out
              </button>
            </div>
          </div>
        </TooltipProvider>
      </SheetContent>
    </Sheet>
  );
}
