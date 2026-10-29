import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import type { Target } from "./content";

/**
 * An internal link from this page's copy, typed per route so the router can
 * check it. The page test checks every target resolves to a real route
 * file or docs page.
 */
export function PageLink({
  target,
  className,
  children,
}: {
  target: Target;
  className?: string;
  children: ReactNode;
}) {
  switch (target.kind) {
    case "feature":
      return (
        <Link to="/features/$slug" params={{ slug: target.slug }} className={className}>
          {children}
        </Link>
      );
    case "tool":
      return (
        <Link to="/tools/$slug" params={{ slug: target.slug }} className={className}>
          {children}
        </Link>
      );
    case "doc":
      return (
        <Link
          to="/docs/$section/$page"
          params={{ section: target.section, page: target.page }}
          className={className}
        >
          {children}
        </Link>
      );
    case "static":
      return (
        <Link to={target.to} className={className}>
          {children}
        </Link>
      );
    case "sibling":
      return (
        <Link to={target.href} className={className}>
          {children}
        </Link>
      );
  }
}
