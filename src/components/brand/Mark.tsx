import { cn } from "@/lib/utils";
import { MARK_PATH } from "./mark-path";

/**
 * The Rankbox mark: a square with all four sides drawn inward, leaving four
 * soft points. It inherits the current text colour, so it reads black on the
 * light chrome and white on the blue, with no second asset.
 */
export function Mark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" role="img" aria-label="Rankbox" className={cn("h-6 w-6", className)}>
      <path
        d={MARK_PATH}
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}
