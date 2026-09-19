/**
 * The platforms Rankbox publishes to, shown as logos on the dashboard and as
 * the choices in Integrations setup.
 *
 * Each logo is a brand tile drawn in src/components/dashboard/integration-logos
 * — vector, so it stays sharp at any size and needs no image assets.
 */
export type PlatformId = "shopify" | "wordpress" | "webflow" | "square" | "framer";

export interface Platform {
  id: PlatformId;
  name: string;
  /** What the user installs on that platform. */
  addon: "app" | "plugin";
  /**
   * Whether the add-on has shipped. Setup shows its install steps when true,
   * and routes to the API (which works for any site today) while false.
   */
  addonLive: boolean;
}

export const PUBLISH_PLATFORMS: Platform[] = [
  { id: "shopify", name: "Shopify", addon: "app", addonLive: false },
  { id: "wordpress", name: "WordPress", addon: "plugin", addonLive: false },
  { id: "webflow", name: "Webflow", addon: "app", addonLive: false },
  { id: "square", name: "Square", addon: "app", addonLive: false },
  { id: "framer", name: "Framer", addon: "plugin", addonLive: false },
];
