/**
 * The integrations directory: one entry per way a site (or an assistant)
 * connects to Rankbox. /integrations lists them and /integrations/$slug renders
 * each one from the fields below, so a new integration is a new entry here.
 *
 * Copy rules, enforced by integrations.test.ts:
 *  - Every mechanic described is one the public API supports: the add-on checks
 *    its key (/ping), pulls finished articles changed since its last sync
 *    (/articles?since=), and reports each article's live URL back (PATCH).
 *  - Facts, not outcomes. No install counts, ratings, reviews or traffic
 *    promises. The sample windows use fictional brands and say "Sample".
 *  - No links to third-party store listings. The CTA is always sign-up.
 *
 * Whether each platform add-on has shipped lives in src/data/platforms.ts
 * (addonLive). The dashboard's setup screen and the comparison pages read that
 * flag; these pages describe the add-ons as available.
 */
import type { PlatformId } from "@/data/platforms";
import { AI_TOOLS } from "@/data/ai-integrations";

export type IntegrationKind = "plugin" | "app" | "api" | "mcp";

export type IntegrationCategory = "Website platforms" | "Commerce" | "Developers & AI";

/** Order the categories appear in the directory filter. */
export const INTEGRATION_CATEGORIES: IntegrationCategory[] = [
  "Website platforms",
  "Commerce",
  "Developers & AI",
];

export const KIND_LABEL: Record<IntegrationKind, string> = {
  plugin: "Plugin",
  app: "App",
  api: "API",
  mcp: "MCP",
};

/** A product fact for the band under the hero. Never a result we promise. */
export interface IntegrationSpec {
  value: string;
  label: string;
}

export interface IntegrationPoint {
  title: string;
  body: string;
}

/** One row of the "what lands where" table: a Rankbox field and its home. */
export interface FieldMapping {
  from: string;
  to: string;
  /** The field travels the other way: the site reports it back to Rankbox. */
  back?: boolean;
}

/** A control on the add-on's settings screen, shown in the setup visual. */
export interface IntegrationSetting {
  label: string;
  value: string;
  /** Rendered as a segmented control when set, otherwise as a picker. */
  options?: string[];
}

/** The fictional site the sample windows show articles landing on. */
export interface SampleSite {
  brand: string;
  domain: string;
  /** Where articles land inside the platform, in its own words. */
  location: string;
  /** Path articles publish under, e.g. "/blog/". */
  path: string;
  /** Newest first. The first is the one the hero shows arriving. */
  titles: string[];
  /** What the platform calls an arrived article. Defaults to "Published". */
  status?: string;
}

export interface IntegrationFAQ {
  q: string;
  a: string;
}

export interface Integration {
  slug: string;
  /** Set for the website platforms; it picks the logo and matches the dashboard. */
  platform?: PlatformId;
  name: string;
  kind: IntegrationKind;
  category: IntegrationCategory;
  /** One line for the directory card. */
  tagline: string;
  /** Beside the logos above the H1. Carries the page's primary keyword. */
  eyebrow: string;
  /**
   * The H1 in two parts: `lead` on the first line, `accent` on the second on
   * desktop. Keep each part to 22 characters so the lockup holds.
   */
  headline: { lead: string; accent: string };
  subhead: string;
  metaTitle: string;
  metaDescription: string;
  /** Where the add-on is installed from. Plain text, never a link. */
  source: string;
  specs: IntegrationSpec[];
  highlightsTitle: string;
  highlights: IntegrationPoint[];
  setup: IntegrationPoint[];
  fields: { title: string; intro: string; rows: FieldMapping[] };
  /** The add-on's settings screen. Platform add-ons only. */
  settings?: IntegrationSetting[];
  sample: SampleSite;
  faqs: IntegrationFAQ[];
}

/* Shared rows and answers, so the platform entries can't drift apart. */

const LIVE_URL_ROW: FieldMapping = { from: "Live URL", to: "Reported back to Rankbox", back: true };

const PASTE_KEY: IntegrationPoint = {
  title: "Paste your Rankbox key",
  body: "Create a key under Integrations in your Rankbox dashboard and paste it in. The add-on checks it straight away and shows your brand name, so you know it's the right account.",
};

const INCLUDED_FAQ = (what: string): IntegrationFAQ => ({
  q: `Does the ${what} cost extra?`,
  a: `No. The ${what} is included with every Rankbox plan, including the free trial. Your site syncs while your account has an active trial or plan.`,
});

const INCLUDED_SPEC: IntegrationSpec = { value: "Included", label: "with every Rankbox plan" };

export const INTEGRATIONS: Integration[] = [
  {
    slug: "wordpress",
    platform: "wordpress",
    name: "WordPress",
    kind: "plugin",
    category: "Website platforms",
    tagline: "Every article lands as a native WordPress post, in your theme.",
    eyebrow: "WordPress auto-publishing plugin",
    headline: { lead: "Auto-publish to", accent: "WordPress" },
    subhead:
      "Install the Rankbox plugin, paste your key, and every article autopilot writes arrives in WordPress as a native post, in your theme, with its slug, excerpt, and tags already filled in.",
    metaTitle: "WordPress Auto-Publishing Plugin | Rankbox",
    metaDescription:
      "Install the Rankbox plugin for WordPress and publish a fresh, SEO- and GEO-optimized article to your blog every day as a native post. Set up in minutes.",
    source: "the WordPress plugin directory",
    specs: [
      { value: "Plugin", label: "from the WordPress plugin directory" },
      { value: "Native", label: "posts that inherit your theme" },
      { value: "1 key", label: "per site, revocable any time" },
      INCLUDED_SPEC,
    ],
    highlightsTitle: "A WordPress blog that keeps itself current",
    highlights: [
      {
        title: "Real posts, not embeds",
        body: "Articles are saved as ordinary WordPress posts, so your theme, menus, and comments treat them like anything you wrote by hand.",
      },
      {
        title: "Publish now or hold as drafts",
        body: "Choose whether new articles go live straight away or wait in Drafts for a final read. Change it any time in the plugin's settings.",
      },
      {
        title: "Edits follow on their own",
        body: "Update an article in Rankbox and the change reaches the same post on the next sync. No re-uploading, and never a duplicate.",
      },
    ],
    setup: [
      {
        title: "Install the plugin",
        body: "In WordPress, open Plugins → Add New, search for Rankbox, then install and activate it.",
      },
      PASTE_KEY,
      {
        title: "Choose where posts go",
        body: "Pick the post status, author, and category. New articles arrive from then on, and your Rankbox dashboard shows the site as Live.",
      },
    ],
    fields: {
      title: "What lands in WordPress",
      intro:
        "Each finished article maps onto post fields WordPress already has, so there's nothing to set up.",
      rows: [
        { from: "Title", to: "Post title" },
        { from: "Slug", to: "Permalink" },
        { from: "Article body", to: "Post content, with headings, lists, and links intact" },
        { from: "Meta description", to: "Excerpt" },
        { from: "Tags", to: "Post tags" },
        LIVE_URL_ROW,
      ],
    },
    settings: [
      { label: "Post status", value: "Published", options: ["Published", "Draft"] },
      { label: "Author", value: "Plannora Team" },
      { label: "Category", value: "Guides" },
    ],
    sample: {
      brand: "Plannora",
      domain: "plannora.io",
      location: "Posts",
      path: "/blog/",
      titles: [
        "How to Run a Sprint Without Chaos",
        "Kanban vs Scrum: Which to Pick",
        "Async Standups That Actually Work",
        "Free Planning Apps Worth Trying",
      ],
    },
    faqs: [
      {
        q: "Does it work with my theme?",
        a: "Yes. Articles are saved as standard WordPress posts, so they render with whatever theme you use, exactly like a post you wrote yourself.",
      },
      {
        q: "Can I review articles before they go live?",
        a: "Yes. Set the post status to Draft and new articles wait in Drafts until you publish them. Only articles you've finished in Rankbox are ever sent.",
      },
      {
        q: "What happens when I edit an article in Rankbox?",
        a: "The plugin asks for everything changed since its last sync, so the edit updates the existing post. It never creates a duplicate.",
      },
      {
        q: "Can the plugin change anything else on my site?",
        a: "No. It only creates and updates the posts Rankbox sends. The key it holds can fetch your articles and report where they went live, and nothing more.",
      },
      {
        q: "Does it work on WordPress.com?",
        a: "It works on any WordPress site that can install plugins, including WordPress.com plans that allow them.",
      },
      INCLUDED_FAQ("plugin"),
    ],
  },
  {
    slug: "shopify",
    platform: "shopify",
    name: "Shopify",
    kind: "app",
    category: "Commerce",
    tagline: "A steady blog for your store, published as native Shopify blog posts.",
    eyebrow: "Shopify blog auto-publishing app",
    headline: { lead: "Daily blog posts for", accent: "Shopify stores" },
    subhead:
      "Add the Rankbox app and every article autopilot writes appears in your store's blog with its URL handle, excerpt, and tags set, so your store keeps publishing between product launches.",
    metaTitle: "Shopify Blog Auto-Publishing App | Rankbox",
    metaDescription:
      "Add the Rankbox app to Shopify and publish fresh, SEO- and GEO-optimized posts to your store's blog automatically, with handles, excerpts, and tags set.",
    source: "the Shopify App Store",
    specs: [
      { value: "App", label: "from the Shopify App Store" },
      { value: "Native", label: "blog posts in your store's theme" },
      { value: "Blog only", label: "never your products, orders, or customers" },
      INCLUDED_SPEC,
    ],
    highlightsTitle: "Content that sits right beside your products",
    highlights: [
      {
        title: "Built for your store's blog",
        body: "Articles land in the Shopify blog you choose, so they share your theme, navigation, and cart with the rest of your store.",
      },
      {
        title: "Visible or hidden",
        body: "Publish articles as visible straight away, or add them hidden and switch them on when you're ready.",
      },
      {
        title: "Search listing filled in",
        body: "Each post arrives with its URL handle, excerpt, and search listing description set from the article, ready the moment it's live.",
      },
    ],
    setup: [
      {
        title: "Add the app",
        body: "Find Rankbox in the Shopify App Store and add it to your store.",
      },
      PASTE_KEY,
      {
        title: "Pick a blog",
        body: "Choose which blog receives articles and whether they publish visible or hidden. New articles arrive from then on.",
      },
    ],
    fields: {
      title: "What lands in Shopify",
      intro:
        "Every article becomes a blog post with the fields Shopify already shows in its editor.",
      rows: [
        { from: "Title", to: "Blog post title" },
        { from: "Slug", to: "URL handle" },
        { from: "Article body", to: "Content" },
        { from: "Meta description", to: "Excerpt and search listing description" },
        { from: "Tags", to: "Tags" },
        LIVE_URL_ROW,
      ],
    },
    settings: [
      { label: "Blog", value: "News" },
      { label: "Visibility", value: "Visible", options: ["Visible", "Hidden"] },
      { label: "Author", value: "Fernwood Team" },
    ],
    sample: {
      brand: "Fernwood Coffee",
      domain: "fernwoodcoffee.com",
      location: "Blog posts",
      path: "/blogs/news/",
      status: "Visible",
      titles: [
        "How to Dial In a Pour-Over at Home",
        "Light vs Dark Roast: What Actually Changes",
        "The Best Beans for Cold Brew",
        "How to Store Coffee So It Stays Fresh",
      ],
    },
    faqs: [
      {
        q: "Which blog do articles go to?",
        a: "The one you pick in the app. Most stores use the default News blog, but any blog in your store works, and you can switch later.",
      },
      {
        q: "Will posts match my theme?",
        a: "Yes. They're ordinary Shopify blog posts, so your theme's article template lays them out.",
      },
      {
        q: "Can I check posts before customers see them?",
        a: "Yes. Set visibility to Hidden and articles arrive unpublished until you make them visible.",
      },
      {
        q: "Does the app touch my products or orders?",
        a: "No. It only creates and updates the blog posts Rankbox sends. It never reads your products, customers, or orders.",
      },
      INCLUDED_FAQ("app"),
    ],
  },
  {
    slug: "webflow",
    platform: "webflow",
    name: "Webflow",
    kind: "app",
    category: "Website platforms",
    tagline: "Articles arrive as items in the Webflow CMS collection you choose.",
    eyebrow: "Webflow CMS auto-publishing app",
    headline: { lead: "Autopilot content for", accent: "Webflow CMS" },
    subhead:
      "Install the Rankbox app, point it at your blog collection, and every article autopilot writes arrives as a CMS item, laid out by the template you already designed.",
    metaTitle: "Webflow CMS Auto-Publishing App | Rankbox",
    metaDescription:
      "Connect Rankbox to Webflow and publish fresh, SEO- and GEO-optimized articles into your CMS collection automatically, laid out by your own template.",
    source: "the Webflow Marketplace",
    specs: [
      { value: "App", label: "from the Webflow Marketplace" },
      { value: "Any", label: "CMS collection, with fields mapped once" },
      { value: "Yours", label: "collection template, left untouched" },
      INCLUDED_SPEC,
    ],
    highlightsTitle: "Your design, filled in every day",
    highlights: [
      {
        title: "Your template does the layout",
        body: "Rankbox fills the fields and your collection template handles the look. Nothing about your design changes.",
      },
      {
        title: "Map fields once",
        body: "Tell the app which fields hold the body, the summary, and the tags. Every article after that fills them the same way.",
      },
      {
        title: "Live or draft",
        body: "Publish items to your live site as they arrive, or save them as drafts to review in Webflow first.",
      },
    ],
    setup: [
      {
        title: "Install the app",
        body: "Add Rankbox from the Webflow Marketplace and authorize it for your site.",
      },
      PASTE_KEY,
      {
        title: "Map your collection",
        body: "Choose your blog collection and match its fields. New articles arrive as CMS items from then on.",
      },
    ],
    fields: {
      title: "What lands in Webflow",
      intro: "You match these once during setup, and the app remembers them for every article.",
      rows: [
        { from: "Title", to: "Name" },
        { from: "Slug", to: "Slug" },
        { from: "Article body", to: "The rich text field you choose" },
        { from: "Meta description", to: "The summary field you choose" },
        { from: "Tags", to: "The text field you choose" },
        LIVE_URL_ROW,
      ],
    },
    settings: [
      { label: "Collection", value: "Blog Posts" },
      { label: "Body field", value: "Post Body" },
      { label: "Publish to", value: "Live site", options: ["Live site", "Draft"] },
    ],
    sample: {
      brand: "Loomwise",
      domain: "loomwise.io",
      location: "CMS · Blog Posts",
      path: "/blog/",
      titles: [
        "What Is a Design System, Really?",
        "Figma to Code: A Practical Handoff",
        "Accessible Color Contrast, Explained",
        "How to Write UX Microcopy",
      ],
    },
    faqs: [
      {
        q: "Does it work with my existing blog collection?",
        a: "Yes. Pick any CMS collection and match its fields. You don't need to rebuild anything.",
      },
      {
        q: "Do I need to republish my site?",
        a: "Not when you publish to the live site: items go live as they arrive. Choose Draft instead and they wait in the CMS for you.",
      },
      {
        q: "What if my collection has extra fields?",
        a: "They're left as they are. The app only fills the fields you mapped.",
      },
      {
        q: "Does it count toward my CMS item limit?",
        a: "Yes. Each article is one CMS item, so it counts toward your Webflow plan's item limit like any other.",
      },
      INCLUDED_FAQ("app"),
    ],
  },
  {
    slug: "framer",
    platform: "framer",
    name: "Framer",
    kind: "plugin",
    category: "Website platforms",
    tagline: "Articles sync into a Framer CMS collection, laid out by your own page.",
    eyebrow: "Framer CMS plugin",
    headline: { lead: "Articles that sync to", accent: "Framer CMS" },
    subhead:
      "Run the Rankbox plugin in your Framer project and every article autopilot writes syncs into a CMS collection, ready for the page you designed.",
    metaTitle: "Framer CMS Auto-Publishing Plugin | Rankbox",
    metaDescription:
      "Sync fresh, SEO- and GEO-optimized articles from Rankbox into your Framer CMS with the Rankbox plugin, laid out by the collection page you designed.",
    source: "the Framer Marketplace",
    specs: [
      { value: "Plugin", label: "from the Framer Marketplace" },
      { value: "Managed", label: "CMS collection, kept in step for you" },
      { value: "Yours", label: "collection page does the layout" },
      INCLUDED_SPEC,
    ],
    highlightsTitle: "A CMS collection that keeps itself current",
    highlights: [
      {
        title: "Created and kept in step",
        body: "The plugin creates a Rankbox collection and keeps it matched to your finished articles, adding new ones and updating edited ones.",
      },
      {
        title: "Designed by you",
        body: "Bind the collection's fields to your own collection page. Rankbox supplies the words and Framer handles the look.",
      },
      {
        title: "Ship on your terms",
        body: "New articles sync into the CMS. Publish your site whenever you're ready, the same way you ship any change in Framer.",
      },
    ],
    setup: [
      {
        title: "Open the plugin",
        body: "Find Rankbox in the Framer Marketplace and open it in your project.",
      },
      PASTE_KEY,
      {
        title: "Sync and publish",
        body: "The plugin creates your collection and syncs every finished article. Publish your site to put them live.",
      },
    ],
    fields: {
      title: "What lands in Framer",
      intro: "The plugin creates these fields in its collection for you.",
      rows: [
        { from: "Title", to: "Title" },
        { from: "Slug", to: "Slug" },
        { from: "Article body", to: "Content, as formatted text" },
        { from: "Meta description", to: "Description" },
        { from: "Tags", to: "Tags" },
        LIVE_URL_ROW,
      ],
    },
    settings: [
      { label: "Collection", value: "Articles" },
      { label: "Page path", value: "/blog/:slug" },
      { label: "Sync", value: "Finished only", options: ["Finished only"] },
    ],
    sample: {
      brand: "Brightloop",
      domain: "brightloop.app",
      location: "CMS · Articles",
      path: "/blog/",
      status: "Synced",
      titles: [
        "How to Price a SaaS Product",
        "What Is Product-Led Growth?",
        "Churn vs Retention: The Metrics That Matter",
        "Writing Onboarding Emails People Read",
      ],
    },
    faqs: [
      {
        q: "Does the plugin need to stay open?",
        a: "Only while it syncs. Open it and it brings the collection up to date with everything you've finished in Rankbox since the last sync.",
      },
      {
        q: "Can I use my own collection page design?",
        a: "Yes. Bind the Rankbox collection to any collection page and style it however you like.",
      },
      {
        q: "What happens to articles I've edited?",
        a: "The next sync updates the matching CMS items. Nothing is duplicated.",
      },
      {
        q: "Do new articles go live on their own?",
        a: "They land in your CMS and go live when you publish the site, so nothing ships without you.",
      },
      INCLUDED_FAQ("plugin"),
    ],
  },
  {
    slug: "square",
    platform: "square",
    name: "Square",
    kind: "app",
    category: "Commerce",
    tagline: "A blog for your Square Online site, kept fresh with native posts.",
    eyebrow: "Square Online blog app",
    headline: { lead: "Keep a fresh blog on", accent: "Square Online" },
    subhead:
      "Add the Rankbox app and every article autopilot writes appears on your Square Online site's blog, so your shop keeps publishing while you run the business.",
    metaTitle: "Square Online Blog Auto-Publishing App | Rankbox",
    metaDescription:
      "Publish fresh, SEO- and GEO-optimized articles to your Square Online site's blog automatically with the Rankbox app. Native posts, set up in minutes.",
    source: "the Square App Marketplace",
    specs: [
      { value: "App", label: "from the Square App Marketplace" },
      { value: "Native", label: "posts on your Square Online blog" },
      { value: "Blog only", label: "never your items, orders, or customers" },
      INCLUDED_SPEC,
    ],
    highlightsTitle: "Your shop's blog, handled",
    highlights: [
      {
        title: "Posts that belong on your site",
        body: "Articles appear as regular Square Online blog posts, in your site's theme, next to the pages customers already visit.",
      },
      {
        title: "Publish or hold",
        body: "Let new articles go live on their own, or keep them as drafts for a quick read first.",
      },
      {
        title: "Nothing else touched",
        body: "The app only works with your blog. It never reads your items, orders, or customers.",
      },
    ],
    setup: [
      {
        title: "Connect the app",
        body: "Find Rankbox in the Square App Marketplace and connect it to your Square account.",
      },
      PASTE_KEY,
      {
        title: "Choose your site",
        body: "Pick the Square Online site whose blog should receive articles. New posts arrive from then on.",
      },
    ],
    fields: {
      title: "What lands in Square Online",
      intro: "Each finished article becomes a blog post on the site you picked.",
      rows: [
        { from: "Title", to: "Post title" },
        { from: "Slug", to: "Post URL" },
        { from: "Article body", to: "Post content" },
        { from: "Meta description", to: "SEO description" },
        LIVE_URL_ROW,
      ],
    },
    settings: [
      { label: "Site", value: "ryeandrise.com" },
      { label: "Post status", value: "Published", options: ["Published", "Draft"] },
    ],
    sample: {
      brand: "Rye & Rise Bakery",
      domain: "ryeandrise.com",
      location: "Blog",
      path: "/blog/",
      titles: [
        "How Long Does Sourdough Keep?",
        "Rye vs Whole Wheat: What's the Difference?",
        "How to Revive a Stale Loaf",
        "What Makes a Croissant Flaky",
      ],
    },
    faqs: [
      {
        q: "Do I need a Square Online site?",
        a: "Yes. The app publishes to the blog on a Square Online site. If you sell with Square but your site runs elsewhere, connect that platform instead, or use the API.",
      },
      {
        q: "Will posts match my site's look?",
        a: "Yes. They're ordinary Square Online blog posts, so your site's theme lays them out.",
      },
      {
        q: "Can I read posts before they go live?",
        a: "Yes. Set the post status to Draft and new articles wait for you to publish them.",
      },
      {
        q: "Does the app see my sales data?",
        a: "No. It only creates and updates blog posts. It never reads your items, orders, or customers.",
      },
      INCLUDED_FAQ("app"),
    ],
  },
  {
    slug: "api",
    name: "REST API",
    kind: "api",
    category: "Developers & AI",
    tagline: "Pull finished articles into any stack with one revocable key.",
    eyebrow: "Content API for any website",
    headline: { lead: "Pull articles into", accent: "any stack" },
    subhead:
      "Next.js, Astro, Hugo, Rails, or a CMS you built yourself: if it can make an HTTPS request, it can fetch finished articles from Rankbox as clean HTML or Markdown.",
    metaTitle: "Content API to Auto-Publish on Any Site | Rankbox",
    metaDescription:
      "Fetch finished, SEO- and GEO-optimized articles from the Rankbox REST API as HTML or Markdown, with slugs, tags, and meta descriptions. Works with any stack.",
    source: "your Rankbox dashboard",
    specs: [
      { value: "3", label: "endpoints, all JSON over HTTPS" },
      { value: "HTML + MD", label: "every article in both formats" },
      { value: "100", label: "articles per request, with a cursor" },
      { value: "Any", label: "stack that can make an HTTPS request" },
    ],
    highlightsTitle: "Everything a build step needs",
    highlights: [
      {
        title: "Only what changed",
        body: "Pass since= and get only articles published or edited after your last sync. Save next_since and send it back next time.",
      },
      {
        title: "Ready to render",
        body: "Every article comes as HTML and as Markdown, with its slug, meta description, tags, and SEO score.",
      },
      {
        title: "Close the loop",
        body: "Report an article's live URL and Rankbox knows where it lives. The backlink exchange uses it to verify links placed on the page.",
      },
    ],
    setup: [
      {
        title: "Create a key",
        body: "In Rankbox, open Integrations, choose Any site, and create a key. It's shown once, so keep it with your other secrets.",
      },
      {
        title: "Fetch your articles",
        body: "Call GET /articles at build time or on a schedule. Your dashboard shows the site as Live from its first request.",
      },
      {
        title: "Report the live URL",
        body: "Once a page is up, PATCH /articles/{id} with its published_url. The URL must be on your own site.",
      },
    ],
    fields: {
      title: "What every article includes",
      intro:
        "One JSON shape across every endpoint, so a single type covers your whole integration.",
      rows: [
        { from: "id", to: "Stable identifier. Update by it, never duplicate." },
        { from: "slug", to: "URL-safe, ready for your routes" },
        { from: "title", to: "The article headline" },
        { from: "description", to: "Meta description" },
        { from: "body_html", to: "Rendered HTML: headings, lists, and links" },
        { from: "body_markdown", to: "The same article as Markdown" },
        { from: "tags", to: "Topic tags, as an array" },
        { from: "seo_score", to: "Rankbox's SEO/GEO score, 0 to 100" },
        { from: "published_url", to: "The live URL you reported, or null" },
        { from: "updated_at", to: "The last change. Drives since=" },
      ],
    },
    sample: {
      brand: "Plannora",
      domain: "plannora.io",
      location: "API",
      path: "/blog/",
      titles: ["How to Run a Sprint Without Chaos"],
    },
    faqs: [
      {
        q: "How often should my site call the API?",
        a: "Whatever fits your build. You only get what changed since your last call, so hourly or daily is plenty. Rankbox marks a site Idle after 48 hours without a request.",
      },
      {
        q: "What can a key do?",
        a: "Fetch your finished articles and report where each one went live, on your own domain. It can't read or change anything else in your account.",
      },
      {
        q: "Do drafts show up in the API?",
        a: "No. Only finished articles are returned. Drafts stay in Rankbox until you finish them.",
      },
      {
        q: "What happens when I revoke a key?",
        a: "Requests with it fail straight away. Create a new key, swap it in, and your site picks up from its saved since= cursor.",
      },
      {
        q: "Do I need a plan?",
        a: "Keys work while your account has an active trial or plan. If a plan lapses, requests return an error until it's active again, and your dashboard says syncing is paused.",
      },
    ],
  },
  {
    slug: "mcp",
    name: "MCP server",
    kind: "mcp",
    category: "Developers & AI",
    tagline: `Research and plan content with Rankbox from Claude, ChatGPT, Lovable, Cursor, and ${AI_TOOLS.length - 4} more AI tools.`,
    eyebrow: "Rankbox MCP server",
    headline: { lead: "Use Rankbox in", accent: "your AI assistant" },
    subhead:
      "Add the Rankbox MCP server as a custom connector, then ask your assistant for AI search questions, content briefs, and meta descriptions without leaving the chat.",
    metaTitle: "Rankbox MCP Server for Claude, ChatGPT, Lovable & More",
    metaDescription:
      "Connect the Rankbox MCP server to Claude, ChatGPT, Lovable, Cursor, or any MCP client for AI search questions, SEO content briefs, and meta descriptions.",
    source: "a custom connector in your assistant",
    specs: [
      { value: "3", label: "tools your assistant can call" },
      { value: "1 URL", label: "to add as a custom connector" },
      { value: "Remote", label: "server, nothing to install locally" },
      { value: String(AI_TOOLS.length), label: "AI tools with a setup guide" },
    ],
    highlightsTitle: "Your research desk, inside the chat",
    highlights: [
      {
        title: "Find the questions",
        body: "Ask for the questions people put to AI about a topic, and get a list you can plan content around.",
      },
      {
        title: "Brief an article",
        body: "Name a keyword and get a working title, an H2 outline with talking points, questions to answer, and entities to mention.",
      },
      {
        title: "Write meta descriptions",
        body: "Describe a page and get three meta descriptions, each between 120 and 160 characters.",
      },
    ],
    setup: [
      {
        title: "Copy the server URL",
        body: "It's the same for everyone: https://rankbox.xyz/mcp",
      },
      {
        title: "Add a custom connector",
        body: "In Claude, ChatGPT, Lovable, Cursor, or any tool that takes a remote MCP server, add it and paste the URL. Each tool has its own guide.",
      },
      {
        title: "Ask for what you need",
        body: "Ask for a brief, the questions people ask AI, or meta descriptions. Your assistant calls the right Rankbox tool.",
      },
    ],
    fields: {
      title: "Tools your assistant gets",
      intro: "You don't call these by name. Your assistant picks the right one from what you ask.",
      rows: [
        { from: "Generate AI search questions", to: "The questions people ask AI about a topic" },
        {
          from: "Generate SEO content brief",
          to: "A title, an H2 outline, questions, and entities for a keyword",
        },
        { from: "Write meta descriptions", to: "Three options, 120 to 160 characters each" },
      ],
    },
    sample: {
      brand: "Plannora",
      domain: "plannora.io",
      location: "Assistant",
      path: "/blog/",
      titles: ["Kanban vs Scrum: Which Should Your Team Pick?"],
    },
    faqs: [
      {
        q: "Which assistants work with it?",
        a: `Any tool that can add a remote MCP server by URL. ${AI_TOOLS.length} have step-by-step guides, including Claude, ChatGPT, Lovable, Bolt, v0, Replit, Cursor, and n8n.`,
      },
      {
        q: "Does it publish to my site?",
        a: "No. The MCP server is for research and planning. Publishing runs through your site's integration or the REST API.",
      },
      {
        q: "Does it cost extra?",
        a: "No. The MCP server comes with every Rankbox plan, including the free trial.",
      },
      {
        q: "Is it different from autopilot?",
        a: "Autopilot researches, writes, and publishes on its own. The MCP server hands you the research tools directly, for when you want to plan something by hand.",
      },
    ],
  },
];

export const INTEGRATION_SLUGS = INTEGRATIONS.map((i) => i.slug);

export function getIntegration(slug: string): Integration | undefined {
  return INTEGRATIONS.find((i) => i.slug === slug);
}

/** The platform add-ons: the integrations that publish through an app or plugin. */
export function isAddon(i: Integration): boolean {
  return i.kind === "plugin" || i.kind === "app";
}

/** Integrations that publish articles to a site (everything but the MCP server). */
export function publishes(i: Integration): boolean {
  return i.kind !== "mcp";
}

/** The label on the hero's primary button. */
export function ctaLabel(i: Integration): string {
  if (i.kind === "api") return "Get your API key";
  if (i.kind === "mcp") return "Connect your assistant";
  return `Connect ${i.name}`;
}

/** Same category first, then the rest, in directory order. */
export function relatedIntegrations(i: Integration, count = 3): Integration[] {
  const others = INTEGRATIONS.filter((o) => o.slug !== i.slug);
  return [
    ...others.filter((o) => o.category === i.category),
    ...others.filter((o) => o.category !== i.category),
  ].slice(0, count);
}
