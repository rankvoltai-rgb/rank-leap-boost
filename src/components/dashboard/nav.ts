import type { ComponentType } from "react";
import {
  PulseIcon,
  ArticleIcon,
  CalendarIcon,
  BeamIcon,
  CardIcon,
  ControlsIcon,
  RadarIcon,
  ChartIcon,
} from "@/components/dashboard/icons";

type IconComponent = ComponentType<{ className?: string }>;

export interface NavItem {
  title: string;
  icon: IconComponent;
  to: string;
  exact?: boolean;
}

// Primary workspace navigation. Labels here are the single source of truth —
// page headers reuse the same vocabulary so a section is named identically
// everywhere in the app.
export const NAV: NavItem[] = [
  { title: "Overview", icon: PulseIcon, to: "/dashboard", exact: true },
  { title: "Answer Engine Rank", icon: RadarIcon, to: "/dashboard/visibility" },
  { title: "Articles", icon: ArticleIcon, to: "/dashboard/blog-engine" },
  { title: "Calendar", icon: CalendarIcon, to: "/dashboard/calendar" },
  { title: "Keyword Lab", icon: BeamIcon, to: "/dashboard/keywords" },
  { title: "Insights", icon: ChartIcon, to: "/dashboard/insights" },
];

export const NAV_FOOTER: NavItem[] = [
  { title: "Plan & Billing", icon: CardIcon, to: "/dashboard/billing" },
  { title: "Settings", icon: ControlsIcon, to: "/dashboard/settings" },
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