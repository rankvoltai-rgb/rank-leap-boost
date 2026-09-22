import { useQuery } from "@tanstack/react-query";
import { MetricCard, Panel } from "@/components/dashboard/primitives";
import { LinkIcon, TrendIcon, PublishIcon, TargetIcon } from "@/components/dashboard/icons";
import { listExchangeLedger, tierCost, type ExchangeOverview, type LedgerEntry } from "@/lib/data";
import { formatShortDate } from "@/lib/format-date";
import { useSiteId } from "@/components/dashboard/site-context";
import { NetworkPulsePanel } from "./NetworkPulsePanel";
import { plural } from "./format";

const KIND_LABEL: Record<LedgerEntry["kind"], string> = {
  grant: "Monthly grant",
  escrow: "Held for a link",
  settle_spend: "Link went live",
  settle_earn: "Hosted link went live",
  refund: "Returned",
  clawback: "Charged back",
  bonus: "Bonus",
  adjust: "Adjustment",
};

export function OverviewTab({ overview }: { overview: ExchangeOverview }) {
  const siteId = useSiteId();
  const { data: ledger = [] } = useQuery({
    queryKey: ["exchange", siteId, "ledger"],
    queryFn: () => listExchangeLedger(siteId),
  });
  const { balance, counts, site } = overview;
  const tier = site?.tier ?? 1;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <MetricCard
          label="Credits to spend"
          value={balance.balance}
          emphasis
          accentValue
          icon={<TrendIcon className="h-4 w-4" />}
          hint={
            balance.escrowed > 0
              ? `${balance.escrowed} held for links in progress`
              : "Held credits show here while a link is in progress"
          }
        />
        <MetricCard
          label="Links pointing at you"
          value={counts.inboundLive}
          icon={<LinkIcon className="h-4 w-4" />}
          hint={
            counts.inboundPending > 0
              ? `${plural(counts.inboundPending, "more")} on the way`
              : "verified live"
          }
        />
        <MetricCard
          label="Links you host"
          value={counts.hostedLive}
          icon={<PublishIcon className="h-4 w-4" />}
          hint={
            counts.hostedPending > 0
              ? `${plural(counts.hostedPending, "more")} waiting to be seen live`
              : `${balance.lifetimeEarned} credits earned all time`
          }
        />
        <MetricCard
          label="Your tier"
          value={tier}
          format={(n) => `T${n}`}
          icon={<TargetIcon className="h-4 w-4" />}
          hint={`Hosting on your site earns ${plural(tierCost(tier), "credit")} per link · reputation ${site?.reputation ?? 100}`}
        />
      </div>

      <NetworkPulsePanel pulse={overview.pulse} />

      <Panel className="divide-y divide-border">
        <div className="px-5 py-4 sm:px-6">
          <h2 className="text-sm font-semibold text-ink">Recent activity</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Every credit movement, in order. Credits only move when a link is verified live.
          </p>
        </div>
        {ledger.length === 0 ? (
          <p className="px-5 py-8 text-center text-sm text-muted-foreground sm:px-6">
            Nothing yet. Your first entry is the monthly grant.
          </p>
        ) : (
          ledger.slice(0, 10).map((e) => (
            <div key={e.id} className="flex items-center justify-between gap-4 px-5 py-3 sm:px-6">
              <div className="min-w-0">
                <p className="text-sm text-ink">{KIND_LABEL[e.kind] ?? e.kind}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {e.note} · {formatShortDate(e.createdAt)}
                </p>
              </div>
              <div className="text-right">
                <p
                  className={
                    e.credits > 0
                      ? "text-sm font-semibold text-success tabular-nums"
                      : e.credits < 0
                        ? "text-sm font-semibold text-ink tabular-nums"
                        : "text-sm text-muted-foreground tabular-nums"
                  }
                >
                  {e.credits > 0 ? `+${e.credits}` : e.credits === 0 ? "—" : e.credits}
                </p>
                <p className="text-xs text-muted-foreground tabular-nums">
                  balance {e.balanceAfter}
                </p>
              </div>
            </div>
          ))
        )}
      </Panel>
    </div>
  );
}
