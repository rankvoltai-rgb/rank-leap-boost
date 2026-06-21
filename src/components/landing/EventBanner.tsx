import { Sparkles } from "lucide-react";

export function EventBanner() {
  return (
    <div className="w-full bg-volt px-4 py-1.5 text-center text-xs font-medium text-white sm:text-sm">
      <span className="inline-flex items-center justify-center gap-2">
        <Sparkles className="h-3.5 w-3.5 shrink-0" />
        <span>
          Join us at the Rankvolt AI Event in San Francisco — coming soon.
        </span>
      </span>
    </div>
  );
}