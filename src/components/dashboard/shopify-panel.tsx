/**
 * The Shopify overlay for a site that already publishes to a store. Setup
 * lives in the Rankbox app inside the Shopify admin (blog, visibility,
 * author), so this says where articles go, links there, and can unlink the
 * store for someone who can't open its admin anymore.
 */
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { disconnectShopify, type ShopifyStatus } from "@/lib/data";
import { shopifyStatusKey } from "@/components/dashboard/shopify-status";
import { timeAgo } from "@/components/dashboard/connection-model";
import { Button } from "@/components/dashboard/primitives";
import { ConfirmDialog } from "@/components/dashboard/article-parts";
import { cn } from "@/lib/utils";

type Connection = NonNullable<ShopifyStatus["connection"]>;

export function ShopifyPanel({
  siteId,
  connection: conn,
}: {
  siteId: string;
  connection: Connection;
}) {
  const queryClient = useQueryClient();
  const [confirm, setConfirm] = useState(false);
  const [busy, setBusy] = useState(false);
  const store = conn.shopName ?? conn.shop;

  const { title, detail, tone } = !conn.connected
    ? {
        title: "The Rankbox app was removed from this store",
        detail: `Nothing is published to ${store} until the app is added back.`,
        tone: "warning" as const,
      }
    : conn.status === "error"
      ? {
          title: "Publishing to Shopify needs attention",
          detail: conn.lastError ?? "The last article couldn't be published.",
          tone: "warning" as const,
        }
      : conn.status === "setup"
        ? {
            title: "One step left in Shopify",
            detail: `Open Rankbox in ${store}'s admin and pick the blog articles go to.`,
            tone: "neutral" as const,
          }
        : {
            title: `Publishing to ${store}`,
            detail: `New articles go into ${conn.blogTitle ?? "your blog"} the moment they're written.${
              conn.lastPublishedAt ? ` Last article ${timeAgo(conn.lastPublishedAt)}.` : ""
            }`,
            tone: "success" as const,
          };

  async function disconnect() {
    setBusy(true);
    try {
      await disconnectShopify(siteId);
      await queryClient.invalidateQueries({ queryKey: shopifyStatusKey(siteId) });
      setConfirm(false);
      toast.success(`Stopped publishing to ${store}.`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't disconnect the store.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      <div
        role="status"
        className={cn(
          "space-y-1 rounded-card border p-5",
          tone === "warning"
            ? "border-warning/30 bg-warning/10"
            : tone === "success"
              ? "border-success/25 bg-success/10"
              : "border-border bg-secondary/50",
        )}
      >
        <p className="text-sm font-semibold text-ink">{title}</p>
        <p className="text-sm text-muted-foreground">{detail}</p>
        <p className="text-xs text-muted-foreground">{conn.shop}</p>
      </div>
      <p className="text-sm text-muted-foreground">
        The blog, whether posts go up visible or hidden, and the author name are set in the Rankbox
        app inside Shopify.
      </p>
      <div className="flex flex-wrap items-center gap-3">
        <a
          href={conn.adminUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-cta px-3.5 py-2 text-sm font-medium text-white transition-colors hover:bg-cta-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          Open Rankbox in Shopify <ExternalLink className="h-3.5 w-3.5" aria-hidden />
        </a>
        <Button variant="danger" onClick={() => setConfirm(true)}>
          Disconnect store
        </Button>
      </div>
      <ConfirmDialog
        open={confirm}
        onOpenChange={setConfirm}
        title={`Stop publishing to ${store}?`}
        description="New articles stop going to this store. Posts already in its blog stay exactly as they are. To connect it again, paste a key in the Rankbox app inside Shopify."
      >
        <Button variant="ghost" data-autofocus onClick={() => setConfirm(false)}>
          Cancel
        </Button>
        <Button
          className="bg-destructive text-white hover:bg-destructive/90"
          disabled={busy}
          onClick={() => void disconnect()}
        >
          Disconnect
        </Button>
      </ConfirmDialog>
    </div>
  );
}
