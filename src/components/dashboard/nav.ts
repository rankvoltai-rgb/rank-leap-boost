import { Radar, FileText, CalendarDays, Search, CreditCard, Settings, type LucideIcon } from "lucide-react";

export interface NavItem {
  title: string;
  icon: LucideIcon;
  to: string;
  exact?: boolean;
}

// Primary workspace navigation. Labels here are the single source of truth —
// page headers reuse the same vocabulary so a section is named identically
// everywhere in the app.
export const NAV: NavItem[] = [
  { title: "Overview", icon: Radar, to: "/dashboard", exact: true },
  { title: "Articles", icon: FileText, to: "/dashboard/blog-engine" },
  { title: "Calendar", icon: CalendarDays, to: "/dashboard/calendar" },
  { title: "Keyword Lab", icon: Search, to: "/dashboard/keywords" },
];

export const NAV_FOOTER: NavItem[] = [
  { title: "Plan & Billing", icon: CreditCard, to: "/dashboard/billing" },
  { title: "Settings", icon: Settings, to: "/dashboard/settings" },
];

const ALL_NAV = [...NAV, ...NAV_FOOTER];

/** Resolve the human label for the current pathname (used by the top bar). */
export function currentPageTitle(pathname: string): string {
  // Editor is a detail view that isn't in the nav.
  if (pathname.startsWith("/dashboard/editor")) return "Article Editor";
  const match = ALL_NAV.filter((n) =>
    n.exact ? pathname === n.to : pathname === n.to || pathname.startsWith(`${n.to}/`),
  ).sort((a, b) => b.to.length - a.to.length)[0];
  return match?.title ?? "Overview";
}