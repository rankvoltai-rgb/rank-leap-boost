import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Flat, border-led data table primitives in the premium SaaS language
 * (Stripe / Linear / Vercel): hairline row dividers, an uppercase header
 * rail, and a single soft hover state. Shared across dashboard surfaces.
 */

export type Column = { label: ReactNode; className?: string };

export function DataTable({
  columns,
  children,
  className,
  minWidth = 720,
}: {
  columns: Column[];
  children: ReactNode;
  className?: string;
  minWidth?: number;
}) {
  return (
    <div className={cn("overflow-hidden rounded-xl border border-border bg-card", className)}>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm" style={{ minWidth }}>
          <thead>
            <tr className="border-b border-border bg-secondary/30">
              {columns.map((c, i) => (
                <th
                  key={i}
                  className={cn(
                    "px-4 py-2.5 text-left text-[0.64rem] font-semibold uppercase tracking-[0.09em] text-muted-foreground",
                    c.className,
                  )}
                >
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>{children}</tbody>
        </table>
      </div>
    </div>
  );
}

export function Tr({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <tr
      className={cn(
        "border-b border-border transition-colors last:border-b-0 hover:bg-secondary/40",
        className,
      )}
    >
      {children}
    </tr>
  );
}

export function Td({ children, className }: { children: ReactNode; className?: string }) {
  return <td className={cn("px-4 py-3 align-middle", className)}>{children}</td>;
}

/** Right-aligned action cell that keeps inline controls tidy. */
export function TdActions({ children }: { children: ReactNode }) {
  return (
    <td className="px-4 py-3 align-middle">
      <div className="flex items-center justify-end gap-1.5">{children}</div>
    </td>
  );
}
