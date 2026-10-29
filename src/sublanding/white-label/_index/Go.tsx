import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";

/**
 * An internal link from this page's copy. white-label.test.ts checks every
 * href the page uses resolves to a real route or docs page.
 */
export function Go({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Link to={href} className={className}>
      {children}
    </Link>
  );
}
