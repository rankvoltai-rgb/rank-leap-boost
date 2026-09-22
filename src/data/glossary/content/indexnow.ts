import type { GlossaryEntry } from "../types";

export const entry: GlossaryEntry = {
  slug: "indexnow",
  metaTitle: "What Is IndexNow? How It Works, Who Supports It, and AI Search",
  metaDescription:
    "IndexNow pings Bing and other engines the moment a URL changes. Who supports it, why Google doesn't, what it does for Copilot and ChatGPT, and how to set it up.",
  keywords: [
    "IndexNow",
    "IndexNow protocol",
    "what is IndexNow",
    "does Google support IndexNow",
    "IndexNow API key",
    "IndexNow Bing",
    "IndexNow AI search",
  ],

  whyItMatters:
    "When you fix a price, update a stat or publish a new article, a crawler can take days or weeks to notice on its own — and until Bing does, Copilot and the Bing results ChatGPT search can draw on may keep working from the old version. IndexNow tells participating engines immediately, it's free, and on many platforms it's a setting rather than a project, which makes it one of the few freshness levers a small team can pull without a developer.",

  questions: [
    {
      id: "how-it-works",
      question: "How does IndexNow work?",
      answer:
        "IndexNow works by having your site send a simple HTTP request — one URL, or a batch of up to 10,000 — to a participating search engine whenever a page is added, updated or deleted, authenticated by a key file you host; that engine then shares the notification with every other participant.",
      blocks: [
        {
          kind: "pipeline",
          steps: [
            {
              title: "Generate a key and host it",
              body: "The key is 8–128 characters of letters, numbers and hyphens. Save it as `{key}.txt` at your site's root, containing only the key.",
              lever:
                "Skip this step if your CMS, SEO plugin or CDN supports IndexNow natively — it manages the key for you.",
            },
            {
              title: "Something changes on your site",
              body: "A new post, a substantive update, a price change, a deleted page or a redirect.",
              lever: "Fire pings from real content changes, never from cosmetic edits.",
            },
            {
              title: "Your site pings one endpoint",
              body: "A GET for a single URL or a JSON POST for a batch, sent to `api.indexnow.org` or any participant's endpoint. A 200 means received; a 202 means received with key verification pending.",
            },
            {
              title: "Participants share it, then decide",
              body: 'Engines that adopt the protocol "agree that submitted URLs will be automatically shared with all other participating search engines." Each still decides whether and when to crawl — a ping is a strong hint, not an indexing guarantee.',
            },
          ],
        },
        {
          kind: "code",
          lang: "bash",
          code: '# One URL (GET) — the submitted URL must be URL-encoded\ncurl -s -o /dev/null -w "%{http_code}\\n" \\\n  "https://api.indexnow.org/indexnow?url=https%3A%2F%2Fwww.example.com%2Fpricing&key=YOUR_KEY"\n\n# A batch of up to 10,000 URLs (POST)\ncurl -s -o /dev/null -w "%{http_code}\\n" -X POST "https://api.indexnow.org/indexnow" \\\n  -H "Content-Type: application/json; charset=utf-8" \\\n  -d \'{\n    "host": "www.example.com",\n    "key": "YOUR_KEY",\n    "keyLocation": "https://www.example.com/YOUR_KEY.txt",\n    "urlList": [\n      "https://www.example.com/pricing",\n      "https://www.example.com/blog/new-post"\n    ]\n  }\'\n\n# 200 received · 202 received, key check pending · 403 key not found\n# 422 URL doesn\'t match the host or key · 429 too many requests',
        },
      ],
    },
    {
      id: "who-supports",
      question: "Which search engines support IndexNow?",
      answer:
        "IndexNow's participants are Microsoft Bing, Yandex, Seznam, Naver, Yep, the Internet Archive and Amazon's Amazonbot, per the protocol's published list in September 2026. Google is not a participant, and neither are Brave or Perplexity — the indexes behind Claude's and Perplexity's answers.",
      blocks: [
        {
          kind: "table",
          head: ["Engine or index", "Uses IndexNow?", "What that means for AI search"],
          rows: [
            [
              "Microsoft Bing",
              "Yes — co-launched it in 2021",
              "Reaches Copilot and Bing's AI answers; Microsoft is a named ChatGPT search provider",
            ],
            ["Yandex, Seznam, Naver, Yep", "Yes", "Reaches their own search engines"],
            ["Amazon (Amazonbot)", "Yes", "Amazon's crawler; how it uses pings isn't documented"],
            ["Internet Archive", "Yes", "Web archiving, not answers"],
            [
              "Google — Search, [AI Overviews](/glossary/ai-overviews), AI Mode, Gemini",
              "No",
              "Relies on its own crawling, sitemaps and Search Console",
            ],
            ["Brave — Claude's search provider", "No", "No push option; a re-fetch form only"],
            ["Perplexity", "No", "Its own crawler decides when to revisit a URL"],
          ],
        },
        {
          kind: "p",
          text: 'Microsoft Bing and Yandex introduced the protocol in October 2021. Google said a month later that it would be "testing the potential benefits of this protocol," but it has never joined the participant list. For Google, keep an [XML sitemap](/glossary/xml-sitemap) with accurate `lastmod` values and use URL Inspection in [Search Console](/glossary/google-search-console) for the few pages that can\'t wait.',
        },
      ],
    },
    {
      id: "ai-search",
      question: "Does IndexNow help with AI search?",
      answer:
        "IndexNow helps AI search mainly through Bing: it gets changed pages recrawled sooner, so Microsoft Copilot, Bing's AI summaries and the Bing results ChatGPT search can draw on work from your current version. It does nothing for Google's AI features, Claude or Perplexity.",
      blocks: [
        {
          kind: "p",
          text: "Microsoft makes the case itself. Its February 2026 post launching AI Performance in Bing Webmaster Tools says IndexNow \"helps keep information fresh across search and AI experiences by notifying participating search engines whenever content is added, updated, or removed.\" That matters because AI answers reward [content freshness](/glossary/content-freshness): an answer grounded on last month's copy of your pricing page quotes last month's price.",
        },
        {
          kind: "p",
          text: "The ChatGPT link is real but partial. OpenAI names Microsoft among its search providers, and independent analysis points to an OpenAI-built index alongside it, so a faster Bing recrawl helps one of ChatGPT's paths, not all of them. Allowing [OAI-SearchBot](/glossary/oai-searchbot) covers the other.",
        },
        {
          kind: "callout",
          tone: "tip",
          title: "Watch the effect in Bing's AI Performance report",
          text: "Bing Webmaster Tools' AI Performance report (public preview since February 2026) shows total citations, average cited pages per day, the grounding queries its AI used, and citations per URL across Copilot, Bing's AI summaries and select partners. It doesn't cover ChatGPT.",
        },
      ],
    },
    {
      id: "setup",
      question: "How do you set up IndexNow?",
      answer:
        "Set up IndexNow by first checking whether your CMS, SEO plugin or CDN already supports it — WordPress, Shopify, Wix and Duda do natively or through plugins, and Cloudflare has a native integration — and only otherwise hosting a key file and calling the API from your publishing workflow.",
      blocks: [
        {
          kind: "list",
          ordered: true,
          items: [
            "**Check for built-in support.** IndexNow's FAQ lists WordPress, Shopify, Wix, Duda, Drupal, Joomla and ten other platforms with native or plugin support, plus Cloudflare's native integration. When the platform handles it, you don't need a key file at all.",
            "**Otherwise, generate a key** (a UUID works), save it as `{key}.txt` in the site root, and confirm it loads publicly — no login, firewall or IP rule in front of it.",
            "**Ping on real changes only**: publish, substantive update, price or availability change, deletion and redirect. IndexNow asks sites not to resubmit unchanged URLs and to wait at least five minutes between submissions of the same URL.",
            "**Keep your sitemap.** IndexNow recommends both: pings for what just changed, and a sitemap for the full inventory and for changes made before you started pinging.",
            "**Log the responses.** A run of 403s usually means the key file moved; 429s mean you've hit an engine's rate limit, which none of them publish.",
          ],
        },
        {
          kind: "callout",
          tone: "note",
          title: "Each subdomain is its own host",
          text: "`blog.example.com` and `www.example.com` each need their own key file. A key file placed in a subfolder only covers URLs under that folder, which is why the root is recommended.",
        },
      ],
    },
    {
      id: "common-mistakes",
      question: "Common mistakes with IndexNow",
      answer:
        "The most common IndexNow mistakes are expecting it to reach Google, pinging every URL on every deploy, and reading a 200 response as proof of indexing, when it only confirms the engine received the URL.",
      blocks: [
        {
          kind: "myths",
          items: [
            {
              myth: "IndexNow gets pages into Google faster.",
              reality:
                "Google isn't a participant. For Google, use sitemaps, internal links and Search Console's URL Inspection.",
            },
            {
              myth: "Ping everything, every day, to look fresh.",
              reality:
                "IndexNow is for URLs that changed. Every submitted URL counts toward your crawl quota, so resubmitting unchanged pages spends it on nothing — see [crawl budget](/glossary/crawl-budget).",
            },
            {
              myth: "A 200 response means the page is indexed.",
              reality:
                'IndexNow: a 200 "only indicates that the search engine has received your URL." Each engine still applies its own quality and scheduling checks — see [indexing](/glossary/indexing).',
            },
            {
              myth: "A new date counts as an update.",
              reality:
                "Ping after substantive changes. A bumped date on unchanged copy gives engines a reason to crawl and nothing to find — the same pattern that, Google says, eventually makes it stop trusting a sitemap's `lastmod`.",
            },
          ],
        },
      ],
    },
  ],

  original: {
    kind: "framework",
    name: "The Four Ping Triggers",
    summary:
      "A rule for what should fire an IndexNow ping, so submissions track real change and never turn into noise. Wire these four events into your CMS or deploy pipeline and ignore everything else.",
    items: [
      {
        label: "Publish",
        body: "A new URL goes live. Ping it once it returns 200 — and make sure it's already in your sitemap and linked from a hub page, so every engine can find it without the ping.",
      },
      {
        label: "Substantive update",
        body: "The answer changed: a price, a spec, a statistic, a rewritten section, new links. Not a typo fix, a sidebar tweak or next year's date in the footer.",
      },
      {
        label: "Move",
        body: "A URL now redirects. Submit the old URL, which IndexNow explicitly supports, and the new one together, so engines swap them in one pass.",
      },
      {
        label: "Delete",
        body: "A page now returns 404 or 410. Ping it so engines drop the dead URL instead of rediscovering it on their next crawl.",
      },
    ],
    outcome:
      "Everything outside the four triggers — redesigns that leave the copy alone, date bumps, bulk resubmits — stays out of the queue. The one exception is a migration or site-wide rewrite, where IndexNow says submitting every URL once is acceptable.",
  },

  related: [
    "xml-sitemap",
    "content-freshness",
    "indexing",
    "crawl-budget",
    "google-search-console",
  ],
  product: {
    feature: "auto-publishing",
    pitch:
      "IndexNow tells engines a page changed; you still need pages worth recrawling. Rankbox publishes a new optimized article every day to WordPress, Webflow, Shopify, Wix or Framer, or to any stack through the Rankbox API, with optional approval before anything goes live.",
  },
  further: [
    {
      title: "ChatGPT SEO: the technical guide",
      href: "/ai-seo/chatgpt",
      description: "Bing's role in ChatGPT search, and why IndexNow sits on the ChatGPT checklist.",
    },
    {
      title: "AI SEO guides for every engine",
      href: "/ai-seo",
      description: "Which index each AI engine searches — and which of them accept pings at all.",
    },
  ],
  sources: [
    {
      title: "IndexNow documentation",
      publisher: "IndexNow.org",
      href: "https://www.indexnow.org/documentation",
    },
    {
      title: "IndexNow FAQ",
      publisher: "IndexNow.org",
      href: "https://www.indexnow.org/faq",
    },
    {
      title: "Participating search engines",
      publisher: "IndexNow.org",
      href: "https://www.indexnow.org/searchengines.json",
    },
    {
      title: "Introducing AI Performance in Bing Webmaster Tools (public preview)",
      publisher: "Microsoft Bing",
      href: "https://blogs.bing.com/webmaster/February-2026/Introducing-AI-Performance-in-Bing-Webmaster-Tools-Public-Preview",
    },
    {
      title: "ChatGPT search",
      publisher: "OpenAI Help Center",
      href: "https://help.openai.com/en/articles/9237897-chatgpt-search",
    },
    {
      title: "Google will be testing IndexNow",
      publisher: "Search Engine Journal",
      href: "https://www.searchenginejournal.com/google-will-be-testing-indexnow/426602/",
    },
  ],
};
