import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getExchangeOverview, getSubscription } from "@/lib/data";
import { PageHeader, Panel, Tabs } from "@/components/dashboard/primitives";
import { useArticleActions } from "@/components/dashboard/useArticleActions";
import { ExchangeGate } from "@/components/dashboard/exchange/ExchangeGate";
import { VerifyDomainCard } from "@/components/dashboard/exchange/VerifyDomainCard";
import { NetworkPulsePanel } from "@/components/dashboard/exchange/NetworkPulsePanel";
import { OverviewTab } from "@/components/dashboard/exchange/OverviewTab";
import { TargetsTab } from "@/components/dashboard/exchange/TargetsTab";
import { HostedTab } from "@/components/dashboard/exchange/HostedTab";
import { ExchangeSettings } from "@/components/dashboard/exchange/ExchangeSettings";

export const Route = createFileRoute("/_authenticated/dashboard/backlinks")({
  component: BacklinksPage,
});

type Tab = "overview" | "get" | "give" | "settings";

/**
 * The backlink exchange. Paid members only.
 *
 * Three gates before the tabs: no paid plan (trial or none) shows the pitch
 * over the live network; a paid member without a verified domain gets the
 * verification card; a lapsed member sees everything read-only, with their
 * links intact and their credits held.
 */
function BacklinksPage() {
  const queryClient = useQueryClient();
  const { data: overview } = useQuery({
    queryKey: ["exchange", "overview"],
    queryFn: getExchangeOverview,
    refetchInterval: 30_000,
  });
  const { data: subscription } = useQuery({ queryKey: ["subscription"], queryFn: getSubscription });
  const actions = useArticleActions({ openId: undefined, onOpen: () => undefined });
  const [tab, setTab] = useState<Tab>("overview");

  const refresh = () => void queryClient.invalidateQueries({ queryKey: ["exchange"] });

  const header = (
    <PageHeader
      title="Backlinks"
      description="Earn credits by hosting one relevant link in your articles; spend them on dofollow links from verified members in your niche. Credits move only when a link is verified live."
    />
  );

  if (!overview) {
    return (
      <div className="space-y-6">
        {header}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="skeleton h-32 w-full" />
          ))}
        </div>
        <div className="skeleton h-40 w-full" />
      </div>
    );
  }

  if (overview.access === "trial" || overview.access === "none") {
    return (
      <div className="space-y-6">
        {header}
        {actions.dialogs}
        <ExchangeGate
          access={overview.access}
          pulse={overview.pulse}
          trialEndsAt={subscription?.current_period_end ?? null}
          onStartTrial={actions.openTrial}
          onSimulated={refresh}
        />
      </div>
    );
  }

  const site = overview.site;
  const verified = site?.status === "verified";
  const lapsed = overview.access === "lapsed";

  if (!verified && !lapsed) {
    return (
      <div className="space-y-6">
        {header}
        <VerifyDomainCard site={site} onChange={refresh} />
        <NetworkPulsePanel pulse={overview.pulse} />
      </div>
    );
  }

  const tabs: { id: Tab; label: string; count?: number }[] = [
    { id: "overview", label: "Overview" },
    {
      id: "get",
      label: "Get links",
      count: overview.counts.inboundLive + overview.counts.inboundPending || undefined,
    },
    {
      id: "give",
      label: "Give links",
      count: overview.counts.hostedLive + overview.counts.hostedPending || undefined,
    },
    { id: "settings", label: "Settings" },
  ];

  return (
    <div className="space-y-6">
      {header}
      {lapsed && (
        <Panel className="border-warning/30 bg-warning/10 px-5 py-4">
          <p className="text-sm font-medium text-ink">Your plan has lapsed.</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Your links stay live and your {overview.balance.balance} credits are held, not lost.
            Nothing new is placed until you resubscribe.
          </p>
        </Panel>
      )}
      <Tabs
        tabs={lapsed ? tabs.filter((t) => t.id !== "settings") : tabs}
        value={tab}
        onChange={setTab}
      />
      {tab === "overview" && <OverviewTab overview={overview} />}
      {tab === "get" && <TargetsTab overview={overview} readOnly={lapsed} />}
      {tab === "give" && <HostedTab overview={overview} readOnly={lapsed} />}
      {tab === "settings" && site && !lapsed && (
        <ExchangeSettings site={site} onChanged={refresh} />
      )}
    </div>
  );
}
