/**
 * The network as it actually is. Every number is a count of what a member can
 * trade with today — verified, opted-in, paying sites — never registrations.
 * If there are six, it says six.
 */
import { Panel } from "@/components/dashboard/primitives";
import type { NetworkPulse } from "@/lib/data";
import { plural } from "./format";

function Stat({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="min-w-0">
      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 text-2xl font-semibold tracking-tight text-ink tabular-nums">{value}</p>
      {hint && <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

export function NetworkPulsePanel({ pulse, compact }: { pulse: NetworkPulse; compact?: boolean }) {
  const thin = pulse.eligibleSites < 30;
  return (
    <Panel className="p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-ink">The network right now</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Live counts of the sites you can actually trade with. Nothing here is projected.
          </p>
        </div>
        {thin && (
          <span className="rounded-full border border-warning/30 bg-warning/15 px-2.5 py-0.5 text-xs font-medium text-ink">
            Early days — matches take longer
          </span>
        )}
      </div>
      <div
        className={
          compact
            ? "mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3"
            : "mt-5 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-6"
        }
      >
        <Stat
          label="Sites trading"
          value={String(pulse.eligibleSites)}
          hint="verified, opted in, paying"
        />
        <Stat label="In your niche" value={String(pulse.sitesInYourNiche)} hint="by your topics" />
        <Stat
          label="Open targets"
          value={String(pulse.openTargets)}
          hint="pages waiting for links"
        />
        <Stat label="Links live" value={String(pulse.liveLinks)} hint="verified on real pages" />
        <Stat
          label="Verified sites"
          value={String(pulse.verifiedSites)}
          hint="including not yet opted in"
        />
        <Stat
          label="First link takes"
          value={pulse.medianDaysToFirstLink === null ? "—" : `${pulse.medianDaysToFirstLink}d`}
          hint={pulse.medianDaysToFirstLink === null ? "no data yet" : "median, target to live"}
        />
      </div>
      {pulse.eligibleSites < 3 && (
        <p className="mt-4 rounded-lg border border-border bg-secondary/60 px-3.5 py-2.5 text-xs leading-relaxed text-muted-foreground">
          A trade needs three sites: links never go straight back to where they came from, so two
          sites alone can't exchange. {plural(pulse.eligibleSites, "site is", "sites are")} trading
          today. Verify and opt in now and you're first in the queue when the third arrives.
        </p>
      )}
    </Panel>
  );
}
