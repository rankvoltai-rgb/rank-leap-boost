/**
 * Plain values and helpers the exchange tabs share. Kept apart from the
 * components in shared.tsx so fast refresh keeps working on both.
 */
import type { PlacementStatus } from "@/lib/data";

export const inputClass =
  "h-10 w-full rounded-lg border border-border bg-card px-3 text-sm text-ink outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring/20";

export const STATUS: Record<
  PlacementStatus,
  {
    label: string;
    tone: "neutral" | "success" | "warning" | "info" | "danger" | "ink";
    hint: string;
  }
> = {
  reserved: {
    label: "Reserved",
    tone: "info",
    hint: "Credits are held while the host article is written.",
  },
  placed: {
    label: "Placed",
    tone: "warning",
    hint: "The link is in the article. Waiting to see it live.",
  },
  live: { label: "Live", tone: "success", hint: "Verified on the host's page. Credits settled." },
  lost: { label: "Lost", tone: "danger", hint: "The link disappeared from the host's page." },
  expired: {
    label: "Expired",
    tone: "neutral",
    hint: "Never went live in time. Credits returned.",
  },
  cancelled: { label: "Cancelled", tone: "neutral", hint: "Credits returned." },
};

export function shortUrl(url: string): string {
  try {
    const u = new URL(url);
    const path = u.pathname.replace(/\/$/, "");
    return `${u.hostname.replace(/^www\./, "")}${path}`;
  } catch {
    return url;
  }
}

export function plural(n: number, one: string, many = `${one}s`): string {
  return `${n} ${n === 1 ? one : many}`;
}
