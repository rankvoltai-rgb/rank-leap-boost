/**
 * The last word before a Studio site is charged: what it costs today, what it
 * costs from next month, what it comes with, and which card pays.
 *
 * Every number is Stripe's own preview (getStudioQuote), not arithmetic done
 * here, and the quote's timestamp travels with the payment, so the amount on
 * the button is the amount charged — to the cent. Shared by adding a new site
 * and restoring an archived one.
 */
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { CreditCard, Loader2, RefreshCw } from "lucide-react";
import { Button, Pill } from "@/components/dashboard/primitives";
import { formatUsd, PLAN } from "@/data/pricing";
import { getStudioQuote, type Site, type StudioQuote } from "@/lib/data";
import { formatDate, formatShortDate } from "@/lib/format-date";
import { cn } from "@/lib/utils";
import { SiteMark, siteDomain, siteName } from "./SiteMark";
import { StudioGate } from "./StudioGate";

export const STUDIO_QUOTE_KEY = ["studio", "quote"] as const;

const CARD_BRANDS: Record<string, string> = {
  visa: "Visa",
  mastercard: "Mastercard",
  amex: "American Express",
  discover: "Discover",
  jcb: "JCB",
  diners: "Diners Club",
  unionpay: "UnionPay",
};

function daysUntil(iso: string | null): number | null {
  if (!iso) return null;
  return Math.max(1, Math.ceil((Date.parse(iso) - Date.now()) / 86_400_000));
}

export function StudioCheckout({
  site,
  payLabel,
  onPay,
  onCancel,
}: {
  site: Pick<Site, "brand_name" | "website_url">;
  /** The verb on the button, e.g. "Add site". The amount is appended. */
  payLabel: string;
  /** Charges and creates (or restores) the site. Throws with a message to show. */
  onPay: (prorationDate: number | undefined) => Promise<void>;
  onCancel?: () => void;
}) {
  const {
    data: quote,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: STUDIO_QUOTE_KEY,
    queryFn: getStudioQuote,
    staleTime: 0,
    refetchOnWindowFocus: false,
  });
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function pay(q: StudioQuote) {
    setPaying(true);
    setError(null);
    try {
      await onPay(q.prorationDate ?? undefined);
    } catch (err) {
      setError(err instanceof Error ? err.message : "The payment didn't go through.");
      setPaying(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 py-10 text-sm text-muted-foreground" aria-busy="true">
        <Loader2 className="h-4 w-4 animate-spin" /> Checking the price with Stripe…
      </div>
    );
  }
  if (isError || !quote) {
    return (
      <div className="space-y-3 py-6 text-sm">
        <p className="text-ink">We couldn't get today's price from Stripe.</p>
        <Button variant="ghost" onClick={() => void refetch()}>
          <RefreshCw className={cn("h-3.5 w-3.5", isFetching && "animate-spin")} /> Try again
        </Button>
      </div>
    );
  }
  if (quote.block) return <StudioGate block={quote.block} message={quote.message} compact />;

  const dueToday = quote.dueToday ?? 0;
  const days = daysUntil(quote.renewsAt);
  const after = quote.studioSites + 1;
  const card = quote.card;
  const domain = siteDomain(site);

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <SiteMark site={site} size="lg" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-base font-semibold text-ink">{siteName(site)}</p>
          {domain && <p className="truncate text-sm text-muted-foreground">{domain}</p>}
        </div>
        <Pill tone="info">Studio site</Pill>
      </div>

      <dl className="divide-y divide-border rounded-card border border-border">
        <Line
          label="Due today"
          value={formatUsd(dueToday)}
          note={
            days && quote.renewsAt
              ? `This site's share of the ${days} day${days === 1 ? "" : "s"} left until ${formatDate(quote.renewsAt)}.`
              : "This site's share of your current billing period."
          }
          strong
        />
        <Line
          label="Then"
          value={`${formatUsd(quote.pricePerSite)}/month`}
          note="On the same invoice as your plan, renewing together."
        />
        <Line
          label="New monthly total"
          value={formatUsd(quote.monthlyAfter)}
          note={`${PLAN.name} plan ${formatUsd(PLAN.monthly)} + ${after} Studio site${after === 1 ? "" : "s"} × ${formatUsd(quote.pricePerSite)}.`}
        />
      </dl>

      <div>
        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
          The full plan, for this site
        </p>
        <ul className="mt-2 grid gap-2 sm:grid-cols-3">
          <Allowance
            label="articles a month"
            now={quote.allowance.articles}
            monthly={PLAN.articlesPerMonth}
            until={quote.renewsAt}
          />
          <Allowance
            label="backlink credits"
            now={quote.allowance.backlinkCredits}
            monthly={PLAN.backlinkCreditsPerMonth}
            until={quote.renewsAt}
          />
          <Allowance
            label="Reddit replies"
            now={quote.allowance.redditReplies}
            monthly={PLAN.redditRepliesPerMonth}
            until={quote.renewsAt}
          />
        </ul>
        <p className="mt-2 text-xs text-muted-foreground">
          Its own research, content plan, autopilot and publishing key — nothing is shared with your
          other sites.
        </p>
      </div>

      {error && (
        <p
          role="alert"
          className="rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive"
        >
          {error}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-3 border-t border-border pt-4">
        <p className="flex min-w-0 flex-1 items-center gap-1.5 text-xs text-muted-foreground">
          <CreditCard className="h-3.5 w-3.5 shrink-0" />
          {card
            ? `Charged to ${CARD_BRANDS[card.brand] ?? card.brand} ending ${card.last4}.`
            : "Charged to the card on your plan."}
        </p>
        {onCancel && (
          <Button variant="ghost" onClick={onCancel} disabled={paying}>
            Cancel
          </Button>
        )}
        <Button variant="brand" onClick={() => void pay(quote)} disabled={paying}>
          {paying && <Loader2 className="h-4 w-4 animate-spin" />}
          {paying ? "Charging…" : `${payLabel} · ${formatUsd(dueToday)}`}
        </Button>
      </div>
      <p className="text-xs leading-relaxed text-muted-foreground">
        Remove it any time from Studio: it keeps running to the end of the period you've paid for,
        then stops billing. Nothing is refunded, and nothing is cut short.
      </p>
    </div>
  );
}

function Line({
  label,
  value,
  note,
  strong,
}: {
  label: string;
  value: string;
  note: string;
  strong?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-4 px-4 py-3">
      <div className="min-w-0">
        <dt className={cn("text-sm", strong ? "font-semibold text-ink" : "text-ink")}>{label}</dt>
        <p className="mt-0.5 text-xs text-muted-foreground">{note}</p>
      </div>
      <dd
        className={cn(
          "shrink-0 tabular-nums text-ink",
          strong ? "text-xl font-semibold tracking-tight" : "text-sm font-medium",
        )}
      >
        {value}
      </dd>
    </div>
  );
}

/**
 * One part of the plan: the monthly number, and — when the site starts
 * part-way through a period — the share it gets until the first renewal.
 */
function Allowance({
  label,
  now,
  monthly,
  until,
}: {
  label: string;
  now: number;
  monthly: number;
  until: string | null;
}) {
  return (
    <li className="rounded-lg border border-border bg-secondary/40 px-3 py-2.5">
      <p className="text-lg font-semibold tabular-nums text-ink">{monthly}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
      {now < monthly && until && (
        <p className="mt-1 text-xs tabular-nums text-ink">
          {now} until {formatShortDate(until)}
        </p>
      )}
    </li>
  );
}
