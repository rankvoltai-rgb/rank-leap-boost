import { useQuery } from "@tanstack/react-query";
import { getShopifyStatus } from "@/lib/data";

/** One query for the site's Shopify store, shared by the dashboard home and Integrations. */
export const shopifyStatusKey = (siteId: string) => ["shopify-status", siteId] as const;

export function useShopifyStatus(siteId: string) {
  return useQuery({
    queryKey: shopifyStatusKey(siteId),
    queryFn: () => getShopifyStatus(siteId),
  });
}
