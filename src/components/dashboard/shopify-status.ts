import { useQuery } from "@tanstack/react-query";
import { getShopifyStatus } from "@/lib/data";

/** One query for the site's Shopify store, shared by the dashboard home and Integrations. */
export const shopifyStatusKey = (siteId: string) => ["shopify-status", siteId] as const;

/**
 * `waitForLink` keeps checking until a store is linked: set while someone is
 * making a key to paste into the Shopify app, so the page moves on by itself.
 */
export function useShopifyStatus(siteId: string, { waitForLink = false } = {}) {
  return useQuery({
    queryKey: shopifyStatusKey(siteId),
    queryFn: () => getShopifyStatus(siteId),
    refetchInterval: (q) => (waitForLink && !q.state.data?.connection ? 5000 : false),
  });
}
