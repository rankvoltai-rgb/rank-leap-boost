# Free Tools — AI Search SEO Toolkit

Build a free-tools hub designed to pull Google traffic and earn AI-search citations. A clean, Notion-style index page lists every tool; clicking one opens its own dedicated, interactive page. Each tool page is SEO-optimized (unique title, meta, JSON-LD) so it can rank on its own.

## What we're building

**Footer:** Add a new "Free Tools" column linking to `/tools` and to each individual tool.

**Index page (`/tools`):** Notion-style — generous whitespace, refined type, no icon clutter. A short hero, then tools grouped into two simple lists ("Instant tools" and "AI-powered tools") rendered as clean text-forward rows with name + one-line description + a quiet "Open →" affordance. No heavy cards or busy graphics.

**Tool detail pages (`/tools/$slug`):** Each is a real, working tool with a consistent layout: title, one-paragraph intro, the interactive tool itself, a short "How to use" + FAQ section (great for SEO/JSON-LD), and a soft CTA to Rankvolt.

## Tools (7 total)

**Instant — client-side, no credits, instant results:**
1. **llms.txt Generator** — fill in site name, description, key URLs → generates a valid `llms.txt` file with copy/download.
2. **AI Crawler robots.txt Generator** — toggle allow/block for GPTBot, ClaudeBot, PerplexityBot, Google-Extended, CCBot, etc. → outputs robots.txt.
3. **Schema / JSON-LD Generator** — pick a type (FAQ, Article, Organization, Product), fill fields → outputs ready-to-paste JSON-LD `<script>`.
4. **SERP & AI Snippet Preview** — type title + meta description + URL → live Google-style preview with real-time length/pixel warnings.

**AI-powered (uses Lovable AI credits, runs server-side):**
5. **AI Question Generator** — topic → the real questions people ask AI engines, grouped by intent.
6. **Content Brief Generator** — keyword → outline, questions to answer, entities/terms to cover.
7. **Meta Description Writer** — page topic/URL → 3 length-optimized meta descriptions.

## How it works (technical)

```text
src/routes/
  tools.index.tsx        -> /tools (Notion-style hub)
  tools.$slug.tsx        -> /tools/<slug> (loads tool by slug, renders its component)
src/data/tools.ts        -> tool registry: slug, name, group, tagline, meta, faqs, howto
src/components/tools/
  ToolLayout.tsx         -> shared page shell (intro, body slot, howto, FAQ, CTA, JSON-LD)
  ToolField.tsx, CopyBox.tsx -> shared inputs + copy/download output box
  LlmsTxtGenerator.tsx
  RobotsTxtGenerator.tsx
  SchemaGenerator.tsx
  SnippetPreview.tsx
  AiQuestionGenerator.tsx
  ContentBriefGenerator.tsx
  MetaWriter.tsx
```

- Mirrors the existing `features.index.tsx` / `features.$slug.tsx` + `src/data/features.ts` pattern, including `head()` meta, canonical tags, and FAQ + Breadcrumb JSON-LD per page.
- The `$slug` route maps each slug to its tool component via the registry; unknown slugs throw `notFound()` with a friendly fallback (same as features).
- **Styling:** semantic tokens only (`bg-background`, `text-ink`, `border-border`, `--volt` accent), Poppins, `Reveal`/`Eyebrow` from `shared.tsx`. Notion vibe = lots of whitespace, hairline borders, minimal icons.
- **AI tools:** add three server functions in `src/lib/ai.functions.ts` (reusing the existing `ai-gateway.server.ts` Lovable AI provider) returning structured output. Each AI tool page shows loading, results, and surfaces credit-exhausted (402) / rate-limit (429) errors clearly. No API key needed.
- **SEO:** add all `/tools` URLs to `src/routes/sitemap[.]xml.ts`. Each tool page gets distinct title/description and JSON-LD so it ranks independently.

## Notes
- Instant tools require no backend and cost nothing to run — safe for unlimited traffic.
- AI tools consume Lovable AI credits per use; I'll keep prompts tight and outputs compact to control cost.
- I'll ship all 7 in this build unless you'd rather start with the 4 instant tools and add the AI ones in a follow-up.
