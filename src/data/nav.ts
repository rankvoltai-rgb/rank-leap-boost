/**
 * Navigation data the navbar's desktop menus and its mobile sheet share, so
 * the two can't drift apart. The menus themselves are in
 * src/components/landing/nav-menus.tsx and nav-mobile.tsx.
 */
import {
  BookA,
  BookOpen,
  FileText,
  GitCompare,
  Swords,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { TOOLKITS, TOOLS, getTool, type Tool } from "@/data/tools";

export type MenuId = "features" | "resources";

/** Paths each menu covers, so its trigger can mark the section you're in. */
export const MENU_SECTIONS: Record<MenuId, string[]> = {
  features: ["/features", "/use-cases", "/integrations"],
  resources: ["/blog", "/glossary", "/tools", "/alternatives", "/compare", "/ai-seo"],
};

export function inSection(pathname: string, paths: readonly string[]) {
  return paths.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

export type NavTarget = { to: string; params?: Record<string, string> } | { href: string };

export interface NavEntry {
  icon: LucideIcon;
  title: string;
  description: string;
  target: NavTarget;
}

export const LEARN_LINKS: NavEntry[] = [
  {
    icon: BookOpen,
    title: "Blog",
    description: "Guides & GEO playbooks",
    target: { to: "/blog" },
  },
  {
    icon: BookA,
    title: "Glossary",
    description: "Every SEO & GEO term, defined",
    target: { to: "/glossary" },
  },
  {
    icon: Wrench,
    title: "Free Tools",
    description: `${TOOLS.length} free SEO & AI search tools`,
    target: { to: "/tools" },
  },
  {
    icon: FileText,
    title: "Sample Output",
    description: "Example AI articles",
    target: { href: "/#examples" },
  },
];

export const COMPARE_LINKS: NavEntry[] = [
  {
    icon: GitCompare,
    title: "All comparisons",
    description: "Honest side-by-sides",
    target: { to: "/alternatives" },
  },
  {
    icon: Swords,
    title: "Head-to-head",
    description: "Surfer vs Clearscope & more",
    target: { to: "/compare" },
  },
];

/** The first toolkit on /tools is the setup every site needs, so it's the one
 *  the nav points at: its steps, in order, as a path of chips. */
export const NAV_TOOLKIT = TOOLKITS[0];
export const NAV_TOOLKIT_TOOLS = NAV_TOOLKIT.steps
  .map((s) => getTool(s.slug))
  .filter((t): t is Tool => t !== undefined);

/** Chip labels for that path; the full name stays on the chip's title. A step
 *  with no entry here falls back to its full name. */
export const TOOL_CHIP_LABELS: Record<string, string> = {
  "ai-search-readiness-check": "Readiness check",
  "ai-robots-txt-generator": "robots.txt",
  "llms-txt-generator": "llms.txt",
  "schema-generator": "Schema",
};
