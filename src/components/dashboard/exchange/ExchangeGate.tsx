/**
 * What a member without a paid plan sees instead of the exchange.
 *
 * The same frosted-card treatment as SubscriptionGate, with the one thing
 * that gate can't say: this feature is not part of the trial. Under the card
 * the live network panel stays fully readable — the numbers are real, and
 * seeing them is the honest pitch.
 */
import { Link } from "@tanstack/react-router";
import { CheckIcon, LinkIcon } from "@/components/dashboard/icons";
import { BillingFixButton } from "@/components/dashboard/billing-context";
import { IS_MOCK, simulatePaidPlan, type ExchangeAccess, type NetworkPulse } from "@/lib/data";
import { formatShortDate } from "@/lib/format-date";
import { NetworkPulsePanel } from "./NetworkPulsePanel";

const POINTS = [
  "Dofollow links from verified, paying members in your niche",
  "Earn a credit for every link you host; spend credits to receive them",
  "Credits move only when a link is verified live — never for a link that never publishes",
  "No direct swaps, one link per article, and every domain verified",
];

export function ExchangeGate({
  access,
  pulse,
  trialEndsAt,
  onSimulated,
}: {
  access: Exclude<ExchangeAccess, "paid">;
  pulse: NetworkPulse;
  trialEndsAt: string | null;
  onSimulated: () => void;
}) {
  const trial = access === "trial";
  return (
    <div className="space-y-6">
      <section
        aria-labelledby="exchange-gate-title"
        className="glass mx-auto w-full max-w-lg rounded-card p-7 text-center shadow-elevation-lg"
      >
        <span className="mx-auto grid h-11 w-11 place-items-center rounded-card bg-brand-blue text-white">
          <LinkIcon className="h-5 w-5" />
        </span>
        <h2 id="exchange-gate-title" className="mt-4 text-lg font-semibold tracking-tight text-ink">
          {trial
            ? "Part of the paid plan"
            : access === "lapsed"
              ? "Your plan has lapsed"
              : "Backlinks come with the plan"}
        </h2>
        <p className="mt-1.5 text-sm text-muted-foreground">
          {trial
            ? `The exchange opens with your first invoice${trialEndsAt ? `, on ${formatShortDate(trialEndsAt)}` : ""}. It isn't part of the free trial, so nobody can mint links out of a throwaway account.`
            : access === "lapsed"
              ? "Your links stay live and your credits are held, not lost. Resubscribe to start placing again."
              : "The exchange is part of the paid plan. It opens as soon as billing is sorted and your plan is paid."}
        </p>
        <ul className="mt-5 space-y-2 text-left">
          {POINTS.map((p) => (
            <li key={p} className="flex gap-2.5 text-sm text-ink">
              <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-success" />
              {p}
            </li>
          ))}
        </ul>
        {access === "none" ? (
          <BillingFixButton className="mt-6 w-full" />
        ) : (
          <Link
            to="/dashboard/billing"
            className="mt-6 inline-flex w-full items-center justify-center rounded-lg bg-cta px-3.5 py-2 text-sm font-medium text-white transition-colors hover:bg-cta-hover"
          >
            {trial ? "See your plan" : "Manage your plan"}
          </Link>
        )}
        {IS_MOCK && (
          <button
            type="button"
            onClick={() => void simulatePaidPlan().then(onSimulated)}
            className="mt-3 text-xs font-medium text-muted-foreground underline underline-offset-2 hover:text-ink"
          >
            Mock: simulate the first paid invoice
          </button>
        )}
      </section>
      <NetworkPulsePanel pulse={pulse} />
    </div>
  );
}
