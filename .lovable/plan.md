# 100% SEO, AI-citable article engine

Rebuild `generateBlogContent` into a research-grounded, multi-step pipeline that mirrors your blueprint and self-corrects until every article hits a verified 100 SEO score. Generation stays inside the existing flow (Content Studio "Generate" + the editor), so nothing in the UI breaks.

## 1. Live web research (Firecrawl)

- Link the **Firecrawl** connector to this project (already in your workspace; uses Firecrawl credits per article).
- New server helper `src/lib/research.server.ts`:
  - `firecrawl.search(keyword, { limit: 10, scrapeOptions: { formats: ['markdown'] } })` to pull the **top 10 ranking pages** for the focus keyword.
  - Scrape the top 3–5 results to extract their **heading structure, sub-topics, and gaps**, plus 3–5 **authoritative source URLs** for a real References section.
  - Returns a compact research brief (competitor headings, common subtopics, content gaps, citable sources). If Firecrawl is unavailable or out of credits, it degrades gracefully to model-only research so generation never hard-fails.

## 2. Multi-step generation prompt (your blueprint)

Rework the `generateBlogContent` handler in `src/lib/ai.functions.ts` to run as a structured pipeline using the research brief + your brand/style context. The prompt enforces, in order:

1. Analyze the top-10 competitor structure & key points (from research brief).
2. Build a detailed outline: **15+ headings/subheadings** (H1–H4), logical flow, full intent coverage.
3. Research **10–15 long-tail / LSI terms** and weave them in naturally.
4. SEO **H1 under 60 chars** that includes the keyword and speaks to the audience.
5. Intro **150–200 words**, hooks + keyword.
6. Each H2 = **300–500 words**, with examples/data, 1–2 long-tails, conversational tone for the audience, plus a unique insight.
7. **2–3 image/infographic concepts** described inline with keyword-optimized alt text.
8. **Quick Takeaways** (5–7 bullets).
9. **Conclusion 200–250 words** with audience-relevant CTA.
10. **5 FAQs** (schema-friendly `###` questions + concise answers with long-tails).
11. Reader-feedback / social-share engagement line with a question.
12. **In-text citations + a References section** from the real sources gathered.
13. Keyword density **1–2%**, proper heading use, high perplexity/burstiness.
14. Clean **Markdown** (bold key phrases, italics for emphasis).
15. Meet/exceed the target word count (default **2,750**, configurable).

Inputs: topic = blog title, keyword = focus keyword, audience pulled from `content_settings`, wordcount default 2,750. `maxOutputTokens` raised to fit full-length output; robust JSON extraction + fallbacks stay intact.

## 3. Guaranteed 100 SEO score (self-correcting loop)

- Move the scoring logic so the server can reuse it: `src/lib/seo-analysis.ts` stays the single source of truth, imported by both the editor and the generator. Markdown→text/HTML conversion uses the existing `markdown.ts` (`marked`), which is Worker-safe.
- After generation, the server runs `analyzeContent` on the produced article. If score < 100, it sends the **exact failing/warning checks** back to the model with targeted fix instructions (e.g. "add keyword to title", "add another H2", "tighten meta description to 120–160 chars", "add 2 reference links", "raise readability"), then re-scores. Loop up to **3 passes**.
- The generator may **rewrite the title** into the SEO H1 (you approved this) — required to pass keyword-in-title and reach 100. The new title is saved back to the blog.
- The **verified** computed score (not a model-claimed number) is written to `seo_score`, so the editor's gauge and Content Studio cards reflect the true score.

## 4. Wiring & persistence

- `generateBlogArticle` in `src/lib/api.ts` saves the optimized `title`, `body`, `description` (120–160 char meta), verified `seo_score`, `traffic_estimate`, and `tags`, then marks the blog `finished` — same call sites in Content Studio and the editor, no route changes.
- Surface AI gateway / Firecrawl errors clearly (rate limit, credits) via existing toasts.

## Technical notes

- Firecrawl runs server-side only (`FIRECRAWL_API_KEY` from `process.env`), inside the `createServerFn` handler — never client-side.
- No DB/schema changes: `title`, `body`, `description`, `keyword`, `seo_score`, `traffic_estimate`, `tags`, `status` all already exist.
- Generation is slower (research + scrape + up to 3 optimization passes) — the existing "Writing…" state covers it; expect ~30–90s per article.
- Reaching a literal 100 every time depends on the readability check; the loop explicitly targets it, and the score writeback is always the real measured value.

## Out of scope

No changes to onboarding, payments, calendar, the editor UI, or DB schema. Bulk/scheduled auto-generation continues to use the same upgraded function.