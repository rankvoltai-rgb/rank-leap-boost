import { Sparkles, MapPin } from "lucide-react";

export function EventBanner() {
  return (
    <div className="relative w-full overflow-hidden bg-brand-blue px-4 py-2 text-white">
      <div className="relative mx-auto flex max-w-6xl items-center justify-center gap-2.5 text-xs sm:text-sm">
        <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white sm:text-[11px]">
          <Sparkles className="h-3 w-3 shrink-0" />
          Event
        </span>
        <span className="font-medium">Join us at the Rankbox AI Event</span>
        <span className="hidden items-center gap-1 text-white/70 sm:inline-flex">
          <span className="text-white/30">·</span>
          <MapPin className="h-3.5 w-3.5 shrink-0" />
          San Francisco
        </span>
        <span className="hidden items-center gap-1 text-white/70 md:inline-flex">
          <span className="text-white/30">·</span>
          Coming soon
        </span>
      </div>
    </div>
  );
}
