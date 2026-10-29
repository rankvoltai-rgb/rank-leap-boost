import type { SelectHTMLAttributes } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

/** A native select (keyboard and screen-reader behaviour for free) in the page's field style. */
export function SelectField({
  className,
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <span className={cn("relative block", className)}>
      <select
        {...props}
        className="h-9 w-full cursor-pointer appearance-none rounded-lg border border-ink/[0.12] bg-white pl-3 pr-8 text-[0.88rem] text-ink shadow-[0_1px_1px_rgba(16,24,40,0.03)] focus-visible:border-cta/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta/30"
      >
        {children}
      </select>
      <ChevronDown
        aria-hidden
        className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
      />
    </span>
  );
}
