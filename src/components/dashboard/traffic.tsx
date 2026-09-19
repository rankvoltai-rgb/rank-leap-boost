import { FlameIcon } from "@/components/dashboard/icons";
import { useTrafficTier } from "@/components/dashboard/useArticleActions";
import type { TrafficTier } from "@/lib/traffic-tier";
import { cn } from "@/lib/utils";

/** Bright for this account's biggest articles, paler for its smallest. */
const TIER_COLOR: Record<TrafficTier, string> = {
  high: "text-brand-blue",
  medium: "text-[color-mix(in_oklab,var(--brand-blue)_62%,white)]",
  low: "text-[color-mix(in_oklab,var(--brand-blue)_34%,white)]",
};

const TIER_LABEL: Record<TrafficTier, string> = {
  high: "High traffic for your site",
  medium: "Medium traffic for your site",
  low: "Low traffic for your site",
};

/** Projected monthly visits, with a flame whose shade ranks it among the account's articles. */
export function TrafficValue({ value, className }: { value: number; className?: string }) {
  const tier = useTrafficTier()(value);
  return (
    <span
      title={`${TIER_LABEL[tier]} — top, middle or bottom third of your projected traffic`}
      className={cn(
        // relative contains the sr-only label inside table scrollers.
        "relative inline-flex items-center gap-1 font-medium tabular-nums text-ink",
        className,
      )}
    >
      <FlameIcon className={cn("h-3.5 w-3.5 shrink-0 fill-current", TIER_COLOR[tier])} />
      {value.toLocaleString()}
      <span className="font-normal text-muted-foreground">/mo</span>
      <span className="sr-only">, {TIER_LABEL[tier].toLowerCase()}</span>
    </span>
  );
}
