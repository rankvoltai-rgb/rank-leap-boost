import { useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Logo } from "@/components/landing/shared";
import { SiteSwitcher } from "@/components/studio/SiteSwitcher";
import { NavSections } from "./SidebarNav";
import { SignOutIcon } from "./icons";
import { useSignOut } from "./use-sign-out";
import type { NavItem } from "./nav";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const signOut = useSignOut();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const isActive = (item: NavItem) =>
    item.exact ? path === item.to : path === item.to || path.startsWith(`${item.to}/`);

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
      <SheetContent side="left" className="w-64 overflow-hidden border-none bg-brand-blue p-0">
        <SheetTitle className="sr-only">Navigation</SheetTitle>
        <div className="flex h-14 items-center border-b border-white/15 px-5">
          <Logo inverted />
        </div>
        <div className="px-3 pt-3">
          <SiteSwitcher onNavigate={() => setOpen(false)} />
        </div>
        <nav className="py-4">
          <NavSections isActive={isActive} onNavigate={() => setOpen(false)} />
        </nav>
        <div className="absolute inset-x-0 bottom-0 border-t border-white/15 p-3">
          <button
            type="button"
            onClick={signOut}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white"
          >
            <SignOutIcon className="h-4 w-4" />
            Sign out
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
