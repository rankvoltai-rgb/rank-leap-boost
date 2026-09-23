import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArrowRight, MoreHorizontal, Plus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button, PageHeader, Panel, Pill, StatCard } from "@/components/dashboard/primitives";
import { useActiveSite, useSwitchSite, SITES_QUERY_KEY } from "@/components/dashboard/site-context";
import { SiteMark, siteDomain, siteName } from "@/components/studio/SiteMark";
import { RemoveSiteDialog, RestoreSiteDialog } from "@/components/studio/SiteDialogs";
import { StudioGate } from "@/components/studio/StudioGate";
import { formatUsd, PLAN, STUDIO } from "@/data/pricing";
import {
  getSubscription,
  keepStudioSite,
  listAllSettings,
  listBlogStatuses,
  listCreditAccounts,
  type ContentSettings,
  type CreditAccount,
  type Site,
} from "@/lib/data";
import { formatDate, formatShortDate } from "@/lib/format-date";
import { monthlyTotal, siteIsBilled, studioBlockFor } from "@/lib/studio";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/dashboard/studio/")({
  component: StudioPage,
});

interface SiteCounts {
  finished: number;
  queued: number;
}

/**
 * Studio: every site on the account at a glance, and the one place sites are
 * added, removed and restored. Account-wide, so it reads every site at once
 * rather than the one in the switcher.
 */
function StudioPage() {
  const { allSites, sites: liveSites, siteId } = useActiveSite();
  const [removing, setRemoving] = useState<Site | null>(null);
  const [restoring, setRestoring] = useState<Site | null>(null);
  const switchSite = useSwitchSite();

  const { data: subscription } = useQuery({ queryKey: ["subscription"], queryFn: getSubscription });
  const { data: credits = [] } = useQuery({
    queryKey: ["credits", "all"],
    queryFn: listCreditAccounts,
  });
  const { data: statuses = [] } = useQuery({
    queryKey: ["blogs", "statuses"],
    queryFn: listBlogStatuses,
  });
  const { data: settings = [] } = useQuery({
    queryKey: ["settings", "all"],
    queryFn: listAllSettings,
  });

  const block = studioBlockFor(subscription);
  const archived = allSites.filter((s) => s.status === "archived");
  const billed = allSites.filter(siteIsBilled).length;
  const studioLive = liveSites.filter((s) => s.kind === "studio").length;

  const bySite = useMemo(() => {
    const counts = new Map<string, SiteCounts>();
    for (const b of statuses) {
      const c = counts.get(b.site_id) ?? { finished: 0, queued: 0 };
      if (b.status === "finished") c.finished += 1;
      if (b.status === "scheduled" || b.status === "generating") c.queued += 1;
      counts.set(b.site_id, c);
    }
    return counts;
  }, [statuses]);
  const creditsBySite = useMemo(() => new Map(credits.map((c) => [c.site_id, c])), [credits]);
  const settingsBySite = useMemo(() => new Map(settings.map((s) => [s.site_id, s])), [settings]);

  const liveIds = new Set(liveSites.map((s) => s.id));
  const liveCredits = credits.filter((c) => liveIds.has(c.site_id));
  const used = liveCredits.reduce((n, c) => n + c.credits_used, 0);
  const total = liveCredits.reduce((n, c) => n + c.credits_total, 0);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Studio"
        description={`Every site you run, in one account. Each one after your first is ${formatUsd(STUDIO.monthlyPerSite)} a month, with the full plan of its own.`}
        action={
          block ? undefined : (
            <Link
              to="/dashboard/studio/new"
              className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-cta px-3.5 py-2 text-sm font-medium text-white transition-colors hover:bg-cta-hover"
            >
              <Plus className="h-4 w-4" /> Add a site
            </Link>
          )
        }
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Sites"
          value={liveSites.length}
          hint={
            studioLive ? `1 on your plan, ${studioLive} in Studio` : "Your plan covers one site"
          }
        />
        <StatCard
          label="Monthly total"
          value={formatUsd(monthlyTotal(billed))}
          hint={
            billed
              ? `${formatUsd(PLAN.monthly)} plan + ${billed} × ${formatUsd(STUDIO.monthlyPerSite)}`
              : `${PLAN.name} plan`
          }
        />
        <StatCard
          label="Articles this cycle"
          value={total ? `${used} / ${total}` : "—"}
          hint="Across every live site"
        />
        <StatCard
          label="Next invoice"
          value={
            subscription?.current_period_end
              ? formatShortDate(subscription.current_period_end)
              : "—"
          }
          hint="One invoice for every site"
        />
      </div>

      {block && <StudioGate block={block} message={null} />}

      <section aria-labelledby="studio-sites">
        <h2 id="studio-sites" className="sr-only">
          Your sites
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {liveSites.map((site) => (
            <SiteCard
              key={site.id}
              site={site}
              viewing={site.id === siteId}
              credits={creditsBySite.get(site.id)}
              counts={bySite.get(site.id)}
              settings={settingsBySite.get(site.id)}
              onOpen={(to) => switchSite(site.id, to)}
              onRemove={() => setRemoving(site)}
            />
          ))}
          <AddSiteCard blocked={Boolean(block)} />
        </div>
      </section>

      {archived.length > 0 && (
        <section aria-labelledby="studio-archived" className="space-y-3">
          <div>
            <h2 id="studio-archived" className="text-sm font-semibold text-ink">
              Archived
            </h2>
            <p className="text-sm text-muted-foreground">
              No longer billed. Everything they had is kept, ready to restore.
            </p>
          </div>
          <Panel className="divide-y divide-border">
            {archived.map((site) => (
              <div key={site.id} className="flex flex-wrap items-center gap-3 px-4 py-3">
                <SiteMark site={site} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-ink">{siteName(site)}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {[
                      siteDomain(site),
                      site.archived_at && `Archived ${formatDate(site.archived_at)}`,
                    ]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  disabled={Boolean(block)}
                  onClick={() => setRestoring(site)}
                >
                  Restore · {formatUsd(STUDIO.monthlyPerSite)}/mo
                </Button>
              </div>
            ))}
          </Panel>
        </section>
      )}

      <HowStudioBills />

      {removing && (
        <RemoveSiteDialog
          site={removing}
          periodEnd={subscription?.current_period_end ?? null}
          open
          onOpenChange={(open) => !open && setRemoving(null)}
        />
      )}
      {restoring && (
        <RestoreSiteDialog
          site={restoring}
          open
          onOpenChange={(open) => !open && setRestoring(null)}
          onRestored={(id) => switchSite(id, "/dashboard")}
        />
      )}
    </div>
  );
}

function SiteBadge({ site }: { site: Site }) {
  if (site.removes_at) return <Pill tone="warning">Leaves {formatShortDate(site.removes_at)}</Pill>;
  if (site.kind === "primary") return <Pill>On your plan</Pill>;
  return <Pill tone="info">Studio</Pill>;
}

function SiteCard({
  site,
  viewing,
  credits,
  counts,
  settings,
  onOpen,
  onRemove,
}: {
  site: Site;
  viewing: boolean;
  credits: CreditAccount | undefined;
  counts: SiteCounts | undefined;
  settings: ContentSettings | undefined;
  onOpen: (to: string) => void;
  onRemove: () => void;
}) {
  const queryClient = useQueryClient();
  const used = credits?.credits_used ?? 0;
  const total = credits?.credits_total ?? 0;
  const pct = total > 0 ? Math.min(100, Math.round((used / total) * 100)) : 0;
  const autopilot = settings?.autopilot_enabled ? `On · ${settings.weekly_cadence}/week` : "Off";

  async function keep() {
    try {
      await keepStudioSite({ siteId: site.id });
      await queryClient.invalidateQueries({ queryKey: SITES_QUERY_KEY });
      toast.success(`${siteName(site)} stays in Studio.`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't keep the site.");
    }
  }

  return (
    <Panel className={cn("flex flex-col p-5", viewing && "border-brand-blue/40")}>
      <div className="flex items-start gap-3">
        <SiteMark site={site} size="lg" />
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold text-ink">{siteName(site)}</p>
          <p className="truncate text-sm text-muted-foreground">
            {siteDomain(site) || "No website yet"}
          </p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger
            aria-label={`More for ${siteName(site)}`}
            className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-muted-foreground outline-none transition-colors hover:bg-secondary hover:text-ink focus-visible:ring-2 focus-visible:ring-ring"
          >
            <MoreHorizontal className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuItem onSelect={() => onOpen("/dashboard")}>Open overview</DropdownMenuItem>
            <DropdownMenuItem onSelect={() => onOpen("/dashboard/blog-engine")}>
              Open articles
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => onOpen("/dashboard/settings")}>
              Site settings
            </DropdownMenuItem>
            {site.kind === "studio" && (
              <>
                <DropdownMenuSeparator />
                {site.removes_at ? (
                  <DropdownMenuItem onSelect={() => void keep()}>Keep this site</DropdownMenuItem>
                ) : (
                  <DropdownMenuItem
                    onSelect={onRemove}
                    className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                  >
                    Remove from Studio…
                  </DropdownMenuItem>
                )}
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="mt-3">
        <SiteBadge site={site} />
      </div>

      <dl className="mt-5 space-y-3 text-sm">
        <div>
          <div className="flex items-baseline justify-between gap-2">
            <dt className="text-muted-foreground">Articles this cycle</dt>
            <dd className="font-medium tabular-nums text-ink">
              {total ? `${used} / ${total}` : "—"}
            </dd>
          </div>
          <div
            className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-secondary"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={total}
            aria-valuenow={used}
            aria-label="Articles used this cycle"
          >
            <div className="h-full rounded-full bg-brand-blue" style={{ width: `${pct}%` }} />
          </div>
        </div>
        <Stat label="Published" value={counts?.finished ?? 0} />
        <Stat label="In the queue" value={counts?.queued ?? 0} />
        <Stat label="Autopilot" value={autopilot} />
      </dl>

      <div className="mt-5 flex items-center gap-2 border-t border-border pt-4">
        {viewing ? (
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-success" aria-hidden />
            Open now
          </span>
        ) : null}
        <Button
          variant={viewing ? "ghost" : "solid"}
          onClick={() => onOpen("/dashboard")}
          className="ml-auto"
        >
          {viewing ? "Go to overview" : "Open site"} <ArrowRight className="h-3.5 w-3.5" />
        </Button>
      </div>
    </Panel>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex items-baseline justify-between gap-2">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-medium tabular-nums text-ink">{value}</dd>
    </div>
  );
}

function AddSiteCard({ blocked }: { blocked: boolean }) {
  const inner = (
    <>
      <span
        className={cn(
          "grid h-11 w-11 place-items-center rounded-full border border-dashed border-border text-muted-foreground transition-colors",
          !blocked && "group-hover:border-brand-blue/50 group-hover:text-brand-blue",
        )}
      >
        <Plus className="h-5 w-5" />
      </span>
      <div className="space-y-1">
        <p className="font-semibold text-ink">Add a site</p>
        <p className="mx-auto max-w-[16rem] text-sm text-muted-foreground">
          {blocked
            ? "Opens once your plan is paid."
            : `${formatUsd(STUDIO.monthlyPerSite)}/month — the full plan, for another brand.`}
        </p>
      </div>
    </>
  );
  const base =
    "group flex min-h-[18rem] flex-col items-center justify-center gap-3 rounded-card border border-dashed border-border bg-card p-6 text-center";
  if (blocked) return <div className={cn(base, "opacity-70")}>{inner}</div>;
  return (
    <Link
      to="/dashboard/studio/new"
      className={cn(
        base,
        "transition-colors hover:border-brand-blue/40 hover:bg-brand-blue/[0.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
      )}
    >
      {inner}
    </Link>
  );
}

/** The billing rules in three sentences, so nobody has to find them in an FAQ. */
function HowStudioBills() {
  const items = [
    {
      title: "Billed from the day you add it",
      body: `You pay the site's share of the current period on the spot, then ${formatUsd(STUDIO.monthlyPerSite)} a month on the same invoice as your plan.`,
    },
    {
      title: "The full plan, per site",
      body: `Every site gets its own ${PLAN.articlesPerMonth} articles, ${PLAN.backlinkCreditsPerMonth} backlink credits and ${PLAN.redditRepliesPerMonth} Reddit replies a month. Your sites never trade backlinks with each other — the exchange only links you with other members.`,
    },
    {
      title: "Remove any time",
      body: "A removed site runs to the end of the period you've paid for, then it's archived with everything kept. Restore it whenever you like.",
    },
  ];
  return (
    <Panel className="grid gap-6 p-6 md:grid-cols-3">
      {items.map((item) => (
        <div key={item.title} className="space-y-1.5">
          <p className="text-sm font-semibold text-ink">{item.title}</p>
          <p className="text-sm leading-relaxed text-muted-foreground">{item.body}</p>
        </div>
      ))}
    </Panel>
  );
}
