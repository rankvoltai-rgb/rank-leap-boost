import { useQuery } from "@tanstack/react-query";
import { getWebflowStatus } from "@/lib/data";

/** One query for the site's Webflow connection, shared by the page and the overlay. */
export const webflowStatusKey = (siteId: string) => ["webflow-status", siteId] as const;

export function useWebflowStatus(siteId: string) {
  return useQuery({
    queryKey: webflowStatusKey(siteId),
    queryFn: () => getWebflowStatus(siteId),
  });
}
