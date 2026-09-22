/**
 * How a site is named and pictured everywhere Studio shows one: the switcher,
 * Studio's grid, billing. One place, so a site reads the same in all of them.
 */
import { useState } from "react";
import { Avatar } from "@/components/landing/shared";
import { brandIconUrl } from "@/lib/brand-icon";
import { domainOf } from "@/lib/site-meta";
import { cn } from "@/lib/utils";
import type { Site } from "@/lib/data";

type Named = Pick<Site, "brand_name" | "website_url">;

/** The site's domain, bare. Empty when it has no website yet. */
export function siteDomain(site: Named): string {
  return site.website_url ? domainOf(site.website_url) : "";
}

/** The name to show: the brand, else the domain, else a placeholder. */
export function siteName(site: Named): string {
  return site.brand_name?.trim() || siteDomain(site) || "Untitled site";
}

const SIZES = {
  sm: { disc: "h-6 w-6", icon: "h-3.5 w-3.5" },
  md: { disc: "h-8 w-8", icon: "h-5 w-5" },
  lg: { disc: "h-11 w-11", icon: "h-6 w-6" },
} as const;

/**
 * The site's favicon, contained on a white disc so dark marks still read on
 * the blue sidebar. Falls back to initials when there's no website yet or the
 * icon won't load. Keyed by the icon, so a new website gets a fresh load
 * instead of inheriting an old failure.
 */
export function SiteMark({
  site,
  size = "md",
  className,
}: {
  site: Named;
  size?: keyof typeof SIZES;
  className?: string;
}) {
  const favicon = site.website_url ? brandIconUrl(site.website_url) : null;
  return (
    <Mark
      key={favicon ?? "none"}
      name={siteName(site)}
      favicon={favicon}
      size={size}
      className={className}
    />
  );
}

function Mark({
  name,
  favicon,
  size,
  className,
}: {
  name: string;
  favicon: string | null;
  size: keyof typeof SIZES;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  const s = SIZES[size];
  if (!favicon || failed) {
    return <Avatar name={name} className={cn(s.disc, "shrink-0", className)} />;
  }
  return (
    <span
      className={cn(
        "grid shrink-0 place-items-center rounded-full bg-white ring-1 ring-border",
        s.disc,
        className,
      )}
    >
      <img
        src={favicon}
        alt=""
        onError={() => setFailed(true)}
        className={cn("rounded-sm object-contain", s.icon)}
      />
    </span>
  );
}
