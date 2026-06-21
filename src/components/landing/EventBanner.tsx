import { Sparkles, MapPin } from "lucide-react";

export function EventBanner() {
  return (
    <div className="relative w-full overflow-hidden bg-gradient-to-r from-volt via-volt to-volt/90 px-4 py-2 text-white">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.18),transparent_60%)]"
      />
      <div className="relative mx-auto flex max-w-6xl items-center justify-center gap-2.5 text-xs sm:text-sm">
        <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide sm:text-[11px]">
          <Sparkles className="h-3 w-3 shrink-0" />
          Event
        </span>
        <span className="font-medium">
          Join us at the Rankvolt AI Event
        </span>
        <span className="hidden items-center gap-1 text-white/85 sm:inline-flex">
          <span className="text-white/40">·</span>
          <MapPin className="h-3.5 w-3.5 shrink-0" />
          San Francisco
        </span>
        <span className="hidden items-center gap-1 text-white/70 md:inline-flex">
          <span className="text-white/40">·</span>
          Coming soon
        </span>
      </div>
    </div>
  );
}