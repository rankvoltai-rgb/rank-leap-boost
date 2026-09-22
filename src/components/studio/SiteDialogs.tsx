/**
 * The two decisions Studio asks for about an existing site: taking it off the
 * invoice, and bringing an archived one back. Both say, before anything
 * happens, exactly what changes and when.
 */
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/dashboard/primitives";
import { SITES_QUERY_KEY } from "@/components/dashboard/site-context";
import { formatUsd, STUDIO } from "@/data/pricing";
import { removeStudioSite, restoreStudioSite, type Site } from "@/lib/data";
import { formatDate } from "@/lib/format-date";
import { siteName } from "./SiteMark";
import { StudioCheckout } from "./StudioCheckout";

/**
 * Schedules a Studio site to leave at the end of the period already paid for.
 * The wording is the policy: it keeps running, it stops billing from the next
 * invoice, nothing is refunded, nothing is deleted.
 */
export function RemoveSiteDialog({
  site,
  periodEnd,
  open,
  onOpenChange,
  onRemoved,
}: {
  site: Site;
  /** The current billing period's end — when the site would leave. */
  periodEnd: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRemoved?: () => void;
}) {
  const queryClient = useQueryClient();
  const [busy, setBusy] = useState(false);
  const name = siteName(site);
  const when = periodEnd ? formatDate(periodEnd) : "the end of this billing period";

  async function remove() {
    setBusy(true);
    try {
      const { removesAt } = await removeStudioSite({ siteId: site.id });
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: SITES_QUERY_KEY }),
        queryClient.invalidateQueries({ queryKey: ["subscription"] }),
      ]);
      toast.success(`${name} leaves Studio on ${formatDate(removesAt)}.`);
      onOpenChange(false);
      onRemoved?.();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't remove the site.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={(next) => !busy && onOpenChange(next)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remove {name} from Studio?</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <span className="font-medium text-ink">It keeps running until {when}</span> —
                articles, autopilot, backlinks and Reddit, exactly as now.
              </li>
              <li>
                From your next invoice you stop paying {formatUsd(STUDIO.monthlyPerSite)}/month for
                it. This period isn't refunded.
              </li>
              <li>
                After that it's archived: its articles and settings stay on your account, and you
                can restore it from Studio whenever you like.
              </li>
            </ul>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={busy}>Keep it</AlertDialogCancel>
          <Button variant="danger" onClick={() => void remove()} disabled={busy}>
            {busy && <Loader2 className="h-4 w-4 animate-spin" />}
            Remove on {periodEnd ? formatDate(periodEnd) : "renewal"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

/** Brings an archived site back with everything it had, charged like a new one. */
export function RestoreSiteDialog({
  site,
  open,
  onOpenChange,
  onRestored,
}: {
  site: Site;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRestored?: (siteId: string) => void;
}) {
  const queryClient = useQueryClient();
  const name = siteName(site);

  async function pay(prorationDate: number | undefined) {
    await restoreStudioSite({ siteId: site.id, prorationDate });
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: SITES_QUERY_KEY }),
      queryClient.invalidateQueries({ queryKey: ["subscription"] }),
      queryClient.invalidateQueries({ queryKey: ["credits"] }),
    ]);
    toast.success(`${name} is back in Studio.`);
    onOpenChange(false);
    onRestored?.(site.id);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Restore {name}</DialogTitle>
          <DialogDescription>
            It comes back with every article, keyword and setting it had.
          </DialogDescription>
        </DialogHeader>
        {open && (
          <StudioCheckout
            site={site}
            payLabel="Restore site"
            onPay={pay}
            onCancel={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
