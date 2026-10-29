import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import type { Target } from "./content";

/**
 * An internal link from this page's copy, typed per route so the router can
 * check it. ai-seo.test.ts checks every target resolves to a real page.
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
    case "page":
      return (
        <Link to={target.to} className={className}>
          {children}
        </Link>
      );
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
    case "feature":
      return (
        <Link to="/features/$slug" params={{ slug: target.slug }} className={className}>
          {children}
        </Link>
      );
    case "engine":
      return (
        <Link to="/ai-seo/$engine" params={{ engine: target.slug }} className={className}>
          {children}
        </Link>
      );
    case "anchor":
      return (
        <a href={`#${target.id}`} className={className}>
          {children}
        </a>
      );
  }
}

/** The href a target resolves to, for tests and for anything that needs a string. */
export function hrefOf(target: Target): string {
  switch (target.kind) {
    case "page":
      return target.to;
    case "tool":
      return `/tools/${target.slug}`;
    case "blog":
      return `/blog/${target.slug}`;
    case "feature":
      return `/features/${target.slug}`;
    case "engine":
      return `/ai-seo/${target.slug}`;
    case "anchor":
      return `#${target.id}`;
  }
}
