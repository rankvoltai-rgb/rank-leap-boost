# Natural-language copy + a real Blog Editor (Google-Docs style)

## 1. Apply natural-language naming across the app

Replace the "machine/console" jargon with human, benefit-led section names. Proposed map (tell me to tweak any — easy to adjust):

| Location | Current | New |
| --- | --- | --- |
| Sidebar group | Workspace | Your Workspace |
| Nav | System Console | Overview |
| Nav | Blog Engine | Content Studio |
| Nav | Keyword Planner | Keyword Research |
| Nav | Billing | Plan & Billing |
| Console page title | System Console | Your SEO Overview |
| Console section | Content Radar | Content Opportunities |
| Console sub | Selected | In Your Queue |
| Console sub | Add to Queue | Recommended for You |
| Stat | Estimated Traffic | Projected Monthly Traffic |
| Stat | Keyword Score | Opportunity Strength |
| Stat | Credits | Article Credits |
| Studio tabs | Opportunities / In Queue / Published | Ideas / Scheduled / Published |

Calendar, Settings, AI Algorithms stay. Only display copy changes — routes/keys/logic untouched.

## 2. Make generated articles longer, better, and AI-engine-optimized

Upgrade the `generateBlogContent` server function prompt (`src/lib/ai.functions.ts`) so every article is built to be cited by AI answer engines and to rank:

- Target **2,500–3,500+ words**, raise `maxOutputTokens` so long bodies aren't truncated.
- Enforced structure: a one-paragraph **direct answer** up top (answer-engine friendly), a **TL;DR / Key Takeaways** block, logical `##`/`###` hierarchy, bullet & numbered lists, a comparison or steps section where relevant, and a **FAQ** section of 4–6 real Q&A pairs (schema-friendly phrasing).
- Strong semantic coverage of the primary keyword + related entities, natural keyword usage (no stuffing), scannable short paragraphs, and inline **internal-link suggestion** cues.
- Return a realistic computed `seo_score`, tags, and a <160-char meta description (already in the JSON shape; keep robust JSON extraction + fallbacks intact).

## 3. Content Studio list → opens the new editor

Rework `dashboard.blog-engine.tsx`:
- Keep tabs (renamed) and the generate action.
- Replace the read-only "View" modal with an **Open** button that navigates to the full editor for any article (finished or draft). Generate-then-open flow for unwritten ones.
- Apply the modernized card styling already used on Overview.

## 4. New Google-Docs-style editor (left content / right analytics)

New route `src/routes/_authenticated/dashboard.editor.$blogId.tsx` → `/dashboard/editor/:blogId`, rendered inside the existing dashboard shell.

```text
┌───────────────────────────────┬───────────────────────┐
│  Title (editable)             │  SEO Score  87 / 100  │
│  ── formatting toolbar ──     │  ◐ circular gauge     │
│                               │                       │
│  Rich document editor         │  Optimization checks  │
│  (WYSIWYG, Google-Docs feel)  │   ✓ Keyword in title  │
│  H1/H2/H3, bold, lists, links │   ✓ 2,800 words       │
│  AI bubble menu on selection  │   ⚠ Add 1 more H2     │
│                               │                       │
│                               │  Analytics            │
│                               │   Words · Read time   │
│                               │   Keyword density     │
│                               │   Headings · Links    │
│                               │   Readability grade   │
│  [Autosaving…]   [Publish]    │  Target keyword ____  │
└───────────────────────────────┴───────────────────────┘
```

**Left — editor**
- TipTap WYSIWYG (StarterKit + Link + Placeholder) styled to look like a clean Google-Docs page (paper card, generous margins, document typography).
- Editable **title**, plus body. Existing markdown bodies load into the editor; saves convert back to markdown so storage stays consistent with AI output and seeds.
- **AI assist** bubble menu on text selection: Rewrite / Expand / Shorten / Improve SEO — wired to the existing `editBlogSection` server function, replacing the selection in place.
- Debounced **autosave** to `updateBlog` (body, title, description, keyword, tags, seo_score) + a Publish button that sets `status: "finished"`. Toasts + query invalidation.

**Right — SEO score & analytics (real, computed live)**
- New deterministic client util `src/lib/seo-analysis.ts` computing from the live document + target keyword:
  - **SEO score 0–100** (gauge) from weighted checks.
  - **Checklist** (pass/warn/fail): keyword in title, keyword in first paragraph, keyword density in range, word count ≥ target, ≥3 H2s, has lists, has FAQ, meta description length, internal/external links present, readability.
  - **Analytics**: word count, reading time, keyword density %, H2/H3 counts, link count, Flesch readability grade.
- Editable **target keyword** and **meta description** fields feed the analysis and persist.
- Score writes back to `seo_score` on save, so the list/cards reflect the real edited score.

## Technical notes

- Add deps: `@tiptap/react @tiptap/starter-kit @tiptap/extension-link @tiptap/extension-placeholder`, plus `marked` (md→html on load) and `turndown` (html→md on save) — all Worker/SSR-safe pure JS.
- TipTap touches `window`, so the editor mounts **client-only** (render after mount / guarded) to avoid SSR crashes; the route shell SSRs fine.
- Editor route uses TanStack Query: `getBlog(blogId)` to load, `useServerFn(editBlogSection)` for AI edits, `updateBlog` for saves. New `getBlog` already exists in `api.ts`.
- Two-column layout via existing `react-resizable-panels` (already installed) for the draggable splitter.
- No database/schema changes — all fields (`body`, `description`, `keyword`, `tags`, `seo_score`, `status`) already exist. Data stays 100% real.
- Naming changes are display-only; query keys, route paths, and status enums are unchanged to avoid regressions.

## Out of scope
No changes to onboarding, payments, calendar logic, or DB schema. The SEO score is computed in-app (no external SEO API) unless you want SEMrush wired in later.
