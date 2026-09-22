import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { RefreshCw } from "lucide-react";
import { getRedditOverview, getSubscription, IS_MOCK, runRedditSweep } from "@/lib/data";
import { Button, MetricStat, PageHeader, Panel, Tabs } from "@/components/dashboard/primitives";
import { useActiveSite } from "@/components/dashboard/site-context";
import { useArticleActions } from "@/components/dashboard/useArticleActions";
import { MentionsTab } from "@/components/dashboard/reddit/MentionsTab";
import { MockSwitches } from "@/components/dashboard/reddit/MockSwitches";
import { OpportunitiesTab } from "@/components/dashboard/reddit/OpportunitiesTab";
import { RedditGate } from "@/components/dashboard/reddit/RedditGate";
import { RedditSettings } from "@/components/dashboard/reddit/RedditSettings";
import {
  RedditSetupCard,
  RedditUnconfiguredCard,
} from "@/components/dashboard/reddit/RedditSetupCard";
import { ThreadDetail } from "@/components/dashboard/reddit/ThreadDetail";
import { plural, timeAgo } from "@/components/dashboard/reddit/format";
import { formatShortDate } from "@/lib/format-date";
import { cn } from "@/lib/utils";

type RedditSearch = { thread?: string };

export const Route = createFileRoute("/_authenticated/dashboard/reddit")({
  head: () => ({
    meta: [
      { title: "Reddit — Rankbox" },
      {
        name: "description",
        content:
          "The Reddit threads your buyers and AI engines read, with a reply draft you review and post yourself.",
      },
    ],
  }),
  validateSearch: (search: Record<string, unknown>): RedditSearch => ({
    thread: typeof search.thread === "string" && search.thread ? search.thread : undefined,
  }),
  component: RedditPage,
});

type Tab = "opportunities" | "mentions" | "settings";

const SWEEP_REFUSALS: Record<string, string> = {
  already_running: "A sweep is already running.",
  too_soon: "You ran a sweep a moment ago. Give it a little while.",
  not_paid: "Sweeps are part of the paid plan.",
  unconfigured: "Reddit discovery isn't switched on for this workspace yet.",
};

/**
 * Reddit presence, for the site on screen. Paid members only.
 *
 * The gates, in order: no paid plan (trial or none) shows the pitch over a
 * static preview and asks the server for nothing; no discovery provider says
 * so rather than showing an empty table; a paid site that hasn't started gets
 * the setup card; a lapsed plan shows the site's history read-only.
 *
 * Each site has its own settings, threads, drafts and credits. The one thing
 * that spans them is the owner's one-reply-per-thread rule, which the server
 * enforces across every site they run.
 */
function RedditPage() {
  const queryClient = useQueryClient();
  const navigate = useNavigate({ from: Route.fullPath });
  const { thread } = Route.useSearch();
  const { site, siteId } = useActiveSite();
  const brandName = site.brand_name?.trim() || "your product";
  const { data: overview, isError } = useQuery({
    queryKey: ["reddit", siteId, "overview"],
    queryFn: () => getRedditOverview(siteId),
    refetchInterval: 30_000,
    retry: false,
  });
  const { data: subscription } = useQuery({ queryKey: ["subscription"], queryFn: getSubscription });
  const actions = useArticleActions({ openId: undefined, onOpen: () => undefined });
  const [tab, setTab] = useState<Tab>("opportunities");
  const [sweeping, setSweeping] = useState(false);

  const refresh = () => void queryClient.invalidateQueries({ queryKey: ["reddit"] });
  const open = (id: string | undefined) =>
    void navigate({ search: { thread: id }, replace: id === undefined });

  async function sweep() {
    setSweeping(true);
    try {
      const result = await runRedditSweep(siteId);
      if (result.started)
        toast.success(
          result.sweep.opportunitiesCreated > 0
            ? `Sweep done — ${plural(result.sweep.opportunitiesCreated, "new thread")}.`
            : "Sweep done. Nothing new since last time.",
        );
      else toast.message(SWEEP_REFUSALS[result.reason] ?? "The sweep didn't start.");
      refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "The sweep failed.");
    } finally {
      setSweeping(false);
    }
  }

  const header = (
    <PageHeader
      title="Reddit"
      description="Find the Reddit threads your buyers and AI engines read, draft a reply that discloses who you are, and post it yourself. Rankbox never posts to Reddit — the account, the words you send, and the judgement call stay yours."
    />
  );
  const switches = IS_MOCK && <MockSwitches onChanged={refresh} />;

  // If the overview can't be loaded, say so. A skeleton that never resolves
  // reads as "still working", which would be untrue.
  if (isError && !overview) {
    return (
      <div className="space-y-6">
        {header}
        <RedditUnconfiguredCard />
      </div>
    );
  }

  if (!overview) {
    return (
      <div className="space-y-6">
        {header}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="skeleton h-28 w-full" />
          ))}
        </div>
        <div className="skeleton h-72 w-full" />
      </div>
    );
  }

  if (overview.access === "trial" || overview.access === "none") {
    return (
      <div className="space-y-6">
        {header}
        {switches}
        {actions.dialogs}
        <RedditGate
          access={overview.access}
          trialEndsAt={subscription?.current_period_end ?? null}
          onStartTrial={actions.openTrial}
          onSimulated={refresh}
        />
      </div>
    );
  }

  const lapsed = overview.access === "lapsed";

  if (!overview.providerConfigured && !lapsed) {
    return (
      <div className="space-y-6">
        {header}
        {switches}
        <RedditUnconfiguredCard />
      </div>
    );
  }

  if (!overview.settings?.enabled && !lapsed) {
    return (
      <div className="space-y-6">
        {header}
        {switches}
        <RedditSetupCard
          key={siteId}
          brandName={brandName}
          defaultNiche={overview.settings?.niche ?? ""}
          onDone={refresh}
        />
      </div>
    );
  }

  const { counts, balance, lastSweep } = overview;
  const tabs: { id: Tab; label: string; count?: number }[] = [
    { id: "opportunities", label: "Opportunities", count: counts.open || undefined },
    { id: "mentions", label: "Mentions", count: counts.posted || undefined },
    { id: "settings", label: "Settings" },
  ];

  const sweepButton = !lapsed && (
    <Button variant="ghost" onClick={() => void sweep()} disabled={sweeping}>
      <RefreshCw className={cn("h-3.5 w-3.5", sweeping && "animate-spin")} />
      {sweeping ? "Searching…" : "Run a sweep"}
    </Button>
  );

  return (
    <div className="space-y-6">
      {header}
      {switches}
      {lapsed && (
        <Panel className="border-warning/30 bg-warning/10 px-5 py-4">
          <p className="text-sm font-medium text-ink">Your plan has lapsed.</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Your history stays here and the replies you posted are still yours. No new sweeps run
            and no replies are drafted until you resubscribe.
          </p>
        </Panel>
      )}

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <MetricStat
          label="Open threads"
          value={counts.open}
          hint={
            lastSweep
              ? `Last sweep ${timeAgo(lastSweep.finishedAt ?? lastSweep.startedAt)}`
              : "No sweep yet"
          }
        />
        <MetricStat
          label="Drafts waiting"
          value={counts.drafted}
          hint="Reviewed and posted by you"
        />
        <MetricStat
          label="Live mentions"
          value={counts.liveMentions}
          hint={
            counts.posted > counts.liveMentions
              ? `${plural(counts.posted - counts.liveMentions, "reply", "replies")} not verified`
              : "Comments we've confirmed are there"
          }
        />
        <MetricStat
          label="Reply credits"
          value={balance.balance}
          hint={
            balance.periodEnd ? `Resets ${formatShortDate(balance.periodEnd)}` : "Resets monthly"
          }
        />
      </div>

      <Tabs
        tabs={lapsed ? tabs.filter((t) => t.id !== "settings") : tabs}
        value={tab}
        onChange={setTab}
      />
      {tab === "opportunities" && (
        <OpportunitiesTab action={sweepButton || undefined} onOpen={(id) => open(id)} />
      )}
      {tab === "mentions" && <MentionsTab onOpen={(id) => open(id)} />}
      {tab === "settings" && overview.settings && !lapsed && (
        <RedditSettings
          key={siteId}
          settings={overview.settings}
          brandName={brandName}
          onChanged={refresh}
        />
      )}

      <ThreadDetail
        opportunityId={thread ?? null}
        balance={balance.balance}
        readOnly={lapsed}
        onClose={() => open(undefined)}
      />
    </div>
  );
}
