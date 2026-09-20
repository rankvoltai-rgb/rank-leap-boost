import { cn } from "@/lib/utils";

/**
 * The Rankbox mark: a square with all four sides drawn inward, leaving four
 * soft points. It inherits the current text colour, so it reads black on the
 * light chrome and white on the blue, with no second asset.
 */
export function Mark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      role="img"
      aria-label="Rankbox"
      className={cn("h-6 w-6", className)}
    >
      <path
        d="M2.6 2.6 Q12 6.9 21.4 2.6 Q17.1 12 21.4 21.4 Q12 17.1 2.6 21.4 Q6.9 12 2.6 2.6 Z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}
