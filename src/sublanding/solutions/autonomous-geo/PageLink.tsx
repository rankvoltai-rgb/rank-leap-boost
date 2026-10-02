import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import type { Target } from "./content";

/**
 * An internal link from this page's copy, typed per route so the router can
 * check it. autonomous-geo.test.ts checks every slug resolves to a real page.
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
    case "tool":
      return (
        <Link to="/tools/$slug" params={{ slug: target.slug }} className={className}>
          {children}
        </Link>
      );
    case "blog":
      return (
        <Link to="/blog/$slug" params={{ slug: target.slug }} className={className}>
          {children}
        </Link>
      );
    case "integration":
      return (
        <Link to="/integrations/$slug" params={{ slug: target.slug }} className={className}>
          {children}
        </Link>
      );
    case "feature":
      return (
        <Link to="/features/$slug" params={{ slug: target.slug }} className={className}>
          {children}
        </Link>
      );
    case "solution":
      return (
        <Link to={target.to} className={className}>
          {children}
        </Link>
      );
  }
}
