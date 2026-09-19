import { Logo } from "@/components/landing/shared";
import { MobileNav } from "@/components/dashboard/MobileNav";

/**
 * The phone-only bar: the menu button and the brand.
 *
 * Desktop has no top bar — the sidebar carries navigation, the account and
 * sign out, and the Overview's stats panel carries credits. A phone has no
 * sidebar, so this is the one way into the navigation there.
 */
export function TopBar() {
  return (
    <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-3 border-b border-border bg-card/70 px-4 backdrop-blur-xl md:hidden">
      <MobileNav />
      <Logo />
    </header>
  );
}
