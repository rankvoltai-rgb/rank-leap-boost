/**
 * The site the dashboard is showing.
 *
 * A Studio account runs several sites, and every workspace page — articles,
 * calendar, rank, backlinks, Reddit, integrations, settings — shows one of
 * them at a time. Which one is carried in the URL (`?site=`), so a refresh, a
 * bookmark or a shared link opens on the same site, and two tabs can show two
 * sites side by side. No `site` means the primary site, which keeps a
 * single-site account's URLs exactly as they always were.
 *
 * Every per-site query key includes the site id (`["blogs", siteId]`), so
 * switching sites never shows one site's data under another's name, and
 * switching back is instant from cache.
 */
import { createContext, useContext, useEffect, useMemo, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useRouter } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { listSites, type Site } from "@/lib/data";
import { siteIsLive, sortSites } from "@/lib/studio";

export const SITES_QUERY_KEY = ["sites"] as const;

export interface ActiveSite {
  /** The site on screen. */
  site: Site;
  siteId: string;
  /** Sites the switcher can open: live ones, primary first. */
  sites: Site[];
  /** Everything on the account, archived and pending included. */
  allSites: Site[];
  /** The account runs more than one site. */
  isStudio: boolean;
}

const ActiveSiteContext = createContext<ActiveSite | null>(null);

/** Every site on the account. Shared by the switcher, Studio and billing. */
export function useSites() {
  return useQuery({ queryKey: SITES_QUERY_KEY, queryFn: listSites });
}

/** Resolves `?site=` against the account's live sites. Pure, for the provider and tests. */
export function resolveActiveSite(allSites: Site[], requested: string | undefined) {
  const live = sortSites(allSites.filter((s) => siteIsLive(s)));
  const primary = live.find((s) => s.kind === "primary") ?? live[0] ?? null;
  const match = requested ? live.find((s) => s.id === requested) : undefined;
  return { live, site: match ?? primary, stale: Boolean(requested) && !match };
}

export function ActiveSiteProvider({
  requested,
  children,
}: {
  /** The `site` search param, if any. */
  requested: string | undefined;
  children: ReactNode;
}) {
  const navigate = useNavigate();
  const { data: allSites, isLoading, isError, refetch } = useSites();

  const resolved = useMemo(
    () => (allSites ? resolveActiveSite(allSites, requested) : null),
    [allSites, requested],
  );

  // A link to a site that left, or was never this account's, lands on the
  // primary with the address corrected rather than on an error.
  useEffect(() => {
    if (!resolved?.stale) return;
    void navigate({
      to: ".",
      search: (prev: Record<string, unknown>) => ({ ...prev, site: undefined }),
      replace: true,
    });
  }, [resolved?.stale, navigate]);

  // No site at all means onboarding never finished.
  useEffect(() => {
    if (allSites && allSites.length === 0) void navigate({ to: "/onboarding", replace: true });
  }, [allSites, navigate]);

  const value = useMemo<ActiveSite | null>(() => {
    if (!allSites || !resolved?.site) return null;
    return {
      site: resolved.site,
      siteId: resolved.site.id,
      sites: resolved.live,
      allSites,
      isStudio: allSites.some((s) => s.kind === "studio" && s.status !== "pending"),
    };
  }, [allSites, resolved]);

  if (isError) {
    return (
      <div className="grid h-screen place-items-center bg-card px-6 text-center">
        <div className="space-y-3">
          <p className="text-sm text-ink">We couldn't load your sites.</p>
          <button
            type="button"
            onClick={() => void refetch()}
            className="rounded-lg border border-border bg-card px-3.5 py-2 text-sm font-medium text-ink hover:bg-secondary"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }
  if (isLoading || !value) {
    return (
      <div className="grid h-screen place-items-center bg-card" aria-busy="true">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" aria-label="Loading" />
      </div>
    );
  }
  return <ActiveSiteContext.Provider value={value}>{children}</ActiveSiteContext.Provider>;
}

export function useActiveSite(): ActiveSite {
  const value = useContext(ActiveSiteContext);
  if (!value) throw new Error("useActiveSite() must be used inside the dashboard.");
  return value;
}

/** The id every per-site query and write is scoped to. */
export function useSiteId(): string {
  return useActiveSite().siteId;
}

/**
 * Opens another site on the page you're on. Page-specific search (an open
 * article, a filter) belonged to the last site, so only `site` carries over.
 */
export function useSwitchSite() {
  const router = useRouter();
  const { sites } = useActiveSite();
  return (siteId: string, to?: string) => {
    const target = sites.find((s) => s.id === siteId);
    const path = to ?? router.state.location.pathname;
    const href = target && target.kind !== "primary" ? `${path}?site=${siteId}` : path;
    void router.navigate({ href });
  };
}

/** The search to hand a <Link> that should open a given site. */
export function siteSearch(site: Pick<Site, "id" | "kind">): { site?: string } {
  return site.kind === "primary" ? { site: undefined } : { site: site.id };
}
