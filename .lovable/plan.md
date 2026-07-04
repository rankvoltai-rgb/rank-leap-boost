## Get Recommended by ChatGPT — free B2C tool

A new free tool in the same system as your existing ones (`/tools/...`), matching the landing-page quality and layout. A "normal person" enters their name and what they do; Lovable AI generates a personalized plan to make them show up in ChatGPT answers. The full result is gated behind an email capture, and everything drives toward starting a Rankvolt trial.

### The experience
1. Fun hero + short form: **Your name**, **What you do / your role**, optional **Current LinkedIn headline or profile URL**.
2. Click "Show me how to get found" → Lovable AI generates a personalized plan.
3. A teaser is shown immediately (their new headline preview + a locked checklist behind a soft blur).
4. Email capture unlocks the full result. Email + name + role are stored as a lead.
5. Unlocked result is an interactive, checkable checklist with live progress, plus copy-ready content and a closing trial CTA.

### What the AI generates (personalized)
- **3 optimized LinkedIn headline/title options** — keyword-rich, human, ChatGPT-friendly.
- **An "About Me" draft** — ready to paste into their LinkedIn About section or a personal site, written to be quotable by AI.
- **A personalized visibility checklist**, grouped and each with a short "why it matters" note:
  - LinkedIn for SEO (headline, keywords, custom URL, featured links, consistency of name/title everywhere)
  - Optimize the profile (About section, skills, experience phrased as answers to questions)
  - Create an About-Me page (own domain/bio site so AI has a canonical source to cite)
  - Add a clear title + important notes (bio consistency, external mentions, structured claims)
- **Engagement hook** connecting their situation to how Rankvolt does this on autopilot.

### Look & feel
- Reuses the tool page shell (breadcrumb, eyebrow, H1, intro, "How to use it", FAQ, closing CTA) exactly like other tools, so it inherits landing-page quality automatically.
- Uses existing tool primitives (`Field`, `TextInput`, `RunButton`, `ErrorNote`, cards) plus a new interactive checklist with a progress bar and copy buttons, styled with the same semantic tokens (`ink`, `volt`, `border`, `card`).
- Fun, human ICP copy aimed at any professional ("You already Google yourself — now people ask ChatGPT about you").

### Engagement / lead capture
- Full checklist + About-Me draft are locked until the visitor enters an email.
- Email, name, and role are saved to a new `tool_leads` table via a public server function (validated, deduped by email).

```text
[ form ] -> [ generate ] -> [ teaser + locked result ]
                                      |
                              [ enter email ]
                                      |
                        [ unlock: checklist + About-Me + CTA ]
```

---

## Technical details

**New data entry** — add one `Tool` to `src/data/tools.ts` (`group: "ai"`), e.g. slug `get-recommended-by-chatgpt`, with name, tagline, eyebrow, h1, intro, `metaTitle`/`metaDescription`, `howto`, and `faqs`. This auto-lists it on `/tools` and gives it SEO head tags + FAQ/Breadcrumb JSON-LD via the existing `tools.$slug.tsx` route (no route changes needed).

**New AI server function** in `src/lib/tools.functions.ts`:
- `generatePersonalAiPlan` — `createServerFn({ method: "POST" })`, zod-validated input `{ name, role, current? }`, reuses the existing `generateJson` helper + `google/gemini-3-flash-preview`. Returns a typed object: `{ headlines: string[]; aboutMe: string; checklist: { section: string; items: { task: string; why: string }[] }[] }`. Same error-mapping pattern as other AI tools.

**New lead-capture server function** in a client-safe file (`src/lib/leads.functions.ts`):
- `captureToolLead` — `createServerFn({ method: "POST" })`, zod-validated `{ email, name?, role?, tool }`; inside the handler `await import("@/integrations/supabase/client.server")` and upsert into `public.tool_leads` (dedupe on email). Public endpoint, input length-capped.

**Migration** (via migration tool) — create the leads table with grants + RLS in the required order:
```sql
CREATE TABLE public.tool_leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  name text,
  role text,
  tool text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.tool_leads TO service_role;
ALTER TABLE public.tool_leads ENABLE ROW LEVEL SECURITY;
-- no anon/authenticated policies: only the service-role server fn writes; nothing reads it from the client
```

**New tool component** `src/components/tools/PersonalAiVisibility.tsx`:
- Form → calls `generatePersonalAiPlan` via `useServerFn`.
- Renders headline teaser immediately; locks checklist + About-Me behind an email input that calls `captureToolLead`, then reveals.
- Interactive checklist: local `useState` checkbox state + progress bar; copy buttons on headlines and About-Me using the existing clipboard pattern.

**Register** the component in `src/components/tools/registry.tsx` under the new slug.

**llms.txt** — optionally add the new tool page under a Pages/Tools section (minor).

### Notes
- Consistent with existing AI tools: public server functions, Lovable AI (no key handling needed), credit cost per generation.
- No landing-page or checkout changes.
- Honors brand memory: honest positioning, volt/white/grey tokens, Poppins, no RankPill mirroring.