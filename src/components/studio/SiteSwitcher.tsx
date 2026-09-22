/**
 * The site switcher at the top of the sidebar: which site you're looking at,
 * and every other one a click away.
 *
 * It is also where Studio introduces itself to a single-site account — quietly,
 * as the last item of a menu they opened themselves, never as a prompt. The
 * list shows live sites only; archived ones wait on Studio's own page.
 */
import { Link } from "@tanstack/react-router";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { StudioIcon } from "@/components/dashboard/icons";
import { useActiveSite, useSwitchSite } from "@/components/dashboard/site-context";
import { formatUsd, STUDIO } from "@/data/pricing";
import { formatShortDate } from "@/lib/format-date";
import { cn } from "@/lib/utils";
import { SiteMark, siteDomain, siteName } from "./SiteMark";

export function SiteSwitcher({
  collapsed,
  onNavigate,
}: {
  /** The sidebar's icon rail: the mark alone, with the menu opening to the side. */
  collapsed?: boolean;
  /** Called after any choice, so the mobile drawer can close itself. */
  onNavigate?: () => void;
}) {
  const { site, sites, siteId } = useActiveSite();
  const switchSite = useSwitchSite();
  const name = siteName(site);
  const domain = siteDomain(site);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          "group flex w-full items-center rounded-xl text-left outline-none",
          "transition-[background-color,box-shadow] duration-150",
          "focus-visible:ring-nav-accent focus-visible:ring-offset-nav focus-visible:ring-2 focus-visible:ring-offset-2",
          collapsed
            ? "hover:bg-nav-hover justify-center p-1.5"
            : "bg-nav-hover ring-nav-line hover:ring-nav-muted/40 gap-2.5 px-2 py-2 ring-1 ring-inset",
        )}
        aria-label={`Current site: ${name}. Switch site`}
        title={collapsed ? name : undefined}
      >
        <SiteMark site={site} className="ring-nav-line" />
        {!collapsed && (
          <>
            <span className="min-w-0 flex-1">
              <span className="text-nav-fg block truncate text-sm font-semibold">{name}</span>
              {domain && <span className="text-nav-muted block truncate text-xs">{domain}</span>}
            </span>
            <ChevronsUpDown className="text-nav-muted group-hover:text-nav-fg h-4 w-4 shrink-0 transition-colors" />
          </>
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        side={collapsed ? "right" : "bottom"}
        sideOffset={8}
        className="w-72 p-1.5"
      >
        <DropdownMenuLabel className="flex items-center justify-between px-2 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
          Your sites
          <span className="tabular-nums">{sites.length}</span>
        </DropdownMenuLabel>

        <div className="max-h-72 overflow-y-auto">
          {sites.map((s) => {
            const active = s.id === siteId;
            return (
              <DropdownMenuItem
                key={s.id}
                onSelect={() => {
                  if (!active) switchSite(s.id);
                  onNavigate?.();
                }}
                className="gap-2.5 rounded-md px-2 py-2"
              >
                <SiteMark site={s} size="sm" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-ink">{siteName(s)}</span>
                  <span className="block truncate text-xs text-muted-foreground">
                    {s.removes_at
                      ? `Leaves Studio ${formatShortDate(s.removes_at)}`
                      : siteDomain(s) || "No website yet"}
                  </span>
                </span>
                {active && <Check className="h-4 w-4 shrink-0 text-brand-blue" aria-label="Open" />}
              </DropdownMenuItem>
            );
          })}
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild className="gap-2.5 rounded-md px-2 py-2">
          <Link to="/dashboard/studio" onClick={onNavigate}>
            <span className="grid h-6 w-6 place-items-center">
              <StudioIcon className="h-4 w-4 text-muted-foreground" />
            </span>
            <span className="flex-1 text-sm text-ink">Studio overview</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="gap-2.5 rounded-md px-2 py-2">
          <Link to="/dashboard/studio/new" onClick={onNavigate}>
            <span className="grid h-6 w-6 place-items-center rounded-full border border-dashed border-border">
              <Plus className="h-3.5 w-3.5 text-muted-foreground" />
            </span>
            <span className="flex-1 text-sm text-ink">
              {sites.length > 1 ? "Add a site" : "Add another site"}
            </span>
            <span className="text-xs tabular-nums text-muted-foreground">
              {formatUsd(STUDIO.monthlyPerSite)}/mo
            </span>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
