/**
 * A slim notice on every page of a site that is leaving Studio: when it goes,
 * that nothing stops before then, and the one click that keeps it. Keeping it
 * costs nothing — the period is already paid for.
 */
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Clock, Loader2 } from "lucide-react";
import { Button } from "@/components/dashboard/primitives";
import { SITES_QUERY_KEY, useActiveSite } from "@/components/dashboard/site-context";
import { keepStudioSite } from "@/lib/data";
import { formatDate } from "@/lib/format-date";
import { siteName } from "./SiteMark";

export function RemovalBanner() {
  const { site } = useActiveSite();
  const queryClient = useQueryClient();
  const [keeping, setKeeping] = useState(false);

  if (site.kind !== "studio" || !site.removes_at) return null;

  async function keep() {
    setKeeping(true);
    try {
      await keepStudioSite({ siteId: site.id });
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: SITES_QUERY_KEY }),
        queryClient.invalidateQueries({ queryKey: ["subscription"] }),
      ]);
      toast.success(`${siteName(site)} stays in Studio.`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't keep the site.");
    } finally {
      setKeeping(false);
    }
  }

  return (
    <div
      role="status"
      className="mb-6 flex flex-wrap items-center gap-x-3 gap-y-2 rounded-card border border-warning/30 bg-warning/10 px-4 py-3"
    >
      <Clock className="h-4 w-4 shrink-0 text-ink" aria-hidden />
      <p className="min-w-0 flex-1 text-sm text-ink">
        <span className="font-medium">
          {siteName(site)} leaves Studio on {formatDate(site.removes_at)}.
        </span>{" "}
        <span className="text-muted-foreground">
          Everything keeps running until then, and its articles stay on your account after.
        </span>
      </p>
      <Button variant="ghost" onClick={keep} disabled={keeping} className="shrink-0">
        {keeping && <Loader2 className="h-4 w-4 animate-spin" />}
        Keep this site
      </Button>
    </div>
  );
}
