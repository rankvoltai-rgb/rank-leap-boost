# Sublanding pages

Every page from the Semrush sublanding PDF is built here, one directory per page. The plan is in `docs/sublanding-roadmap.md`.

**There are no templates.** These pages roll out in bulk, and Google's spam policies target pages mass-produced from one template. So each page is designed and written from scratch by its own agent (`.claude/agents/sublanding-page-designer.md`), and nothing visible is shared between two pages.

## One page, one directory

```
src/routes/solutions.autonomous-geo.tsx    thin wrapper: head + component, nothing else
src/sublanding/solutions/autonomous-geo/   everything visible on the page
  BRIEF.md                 concept, audience, research with sources, section plan,
                           and how this page differs from its neighbours
  content.ts               every word: META, FAQS, OUTLINE and all other copy
  head.ts                  the route's head(), built with _shared/head.ts
  Page.tsx                 the page, composed from this directory's own sections
  <Section>.tsx …          its own sections, visuals and interactions
  autonomous-geo.test.ts   page-specific checks (maths, links, states)
```

The directory mirrors the URL: `/tools/aeo-checker` lives in `src/sublanding/tools/aeo-checker/`. The `/solutions` hub lives in `src/sublanding/solutions/_index/`.

### content.ts contract

Copy lives in `content.ts`, not in components (the test flags a JSX text run of seven or more words). It must export:

- `META`: `{ query, title, description, h1, keywords }`. `query` is the primary query from the roadmap and `keywords[0]`. The title (≤ 65 characters) and H1 contain it. The description is 110–165 characters.
- `FAQS`: `{ q, a }[]`. They also feed the FAQPage JSON-LD.
- `OUTLINE`: `{ id, h2 }[]`, the page's sections in order, with each H2 as rendered.

Anything else (section copy, sample data, labels) is up to the page.

## What a page may import

- **Its own directory**, nothing from another page's directory.
- **Brand**: `@/components/ui/*` (shadcn primitives), `@/components/landing/Navbar`, `Footer`, `ai-logos` (engine marks), `@/components/ExploreMore` (internal links), lucide icons, `motion`.
- **Facts**: `@/sublanding/_shared/facts` (price, trial, what ships, `startSignup`). Never type a price or trial length.
- **Plumbing**: `@/sublanding/_shared/head`, `@/data/*` (except `@/data/solutions/*` and personas, which hold other pages' copy), `@/lib/*` (real checks such as `checkAiReadiness`), `@/hooks/*`, `@/assets/*`.

Everything else, including the old `@/components/solutions/*` kit and other sections' components, is off limits. `sublanding.test.ts` enforces the list.

## Who edits what

- **A page agent** edits only its own directory and its own route file.
- **The main session** edits the shared files after reviewing a page: `registry.ts`, `src/data/link-graph.ts` (TOPICS), `src/content/llms.txt`, and the roadmap's `DONE` list. The sitemap and footer read the registry through `src/data/solutions`.

## Checks

`npx vitest run src/sublanding` runs:

- the directory contract;
- the import whitelist;
- SEO basics;
- claims: nothing beyond `SHIPPED` and `addonLive`, no typed prices, no "Rankvolt", the trial stated correctly;
- uniqueness across every page: under 8% shared 8-word phrasing with any other page, no repeated H2 or FAQ question, and a unique title, description and H1.
