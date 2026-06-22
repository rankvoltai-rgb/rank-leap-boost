# Rankvolt Publishing API — Phase 1 Infrastructure

## Goal
Give each user a Rankvolt API key they paste into a CMS plugin (Framer, Shopify, WordPress, etc.). The plugin then pulls their finished articles from a secure Rankvolt API and posts them to their site. We build the **Rankvolt side only**; the plugins themselves live on each platform and are separate deliverables.

Model: **plugin pulls from Rankvolt** (one universal API for every platform, no CMS passwords stored here). Articles become available **automatically when finished**.

```text
  Rankvolt engine ──► blogs (status=finished)
                          │
        Rankvolt Publishing API  (key-authenticated, read-only)
                          │
   ┌──────────────┬───────┴────────┬───────────────┐
 Framer plugin  Shopify app   WordPress plugin   (future)
   each pastes the user's Rankvolt API key, fetches articles, posts to the site
```

## 1. Database (one migration)
**New table `api_keys`**
- `user_id` — owner
- `name` — user label (e.g. "WordPress site")
- `key_prefix` — first chars shown in UI (e.g. `rv_live_a1b2…`)
- `key_hash` — SHA-256 of the full key (the raw key is never stored)
- `last_used_at`, `revoked_at`
- standard `id`, `created_at`

RLS: a user can view/create/revoke only their own keys (`auth.uid() = user_id`). The public API reads keys with the service-role client, so no `anon` grant. GRANTs: `authenticated` (select/insert/update/delete), `service_role` (all). Includes the `updated_at` trigger pattern.

No change to `blogs` is required — "finished" already means publishable. The API derives a stable URL **slug** from the title + short id at response time.

## 2. Key authentication helper (`src/lib/api-keys.server.ts`)
- `generateApiKey()` → returns `{ raw, prefix, hash }`. Raw format: `rv_live_<32 random hex>` via crypto.
- `resolveApiKey(request)` → reads `Authorization: Bearer <key>` or `x-api-key`, hashes it, looks up a non-revoked row, bumps `last_used_at`, returns `user_id` or `null`.

## 3. Public read API (`src/routes/api/public/v1/*`)
All under the auth-bypassing `/api/public/` prefix, each secured by the API key check inside the handler. CORS headers + `OPTIONS` handlers so browser-based plugins (Framer) can call them.

- `GET /api/public/v1/ping` — validates the key, returns brand name + account status. Plugins call this to confirm setup.
- `GET /api/public/v1/articles` — lists the caller's finished articles. Supports `?since=<iso>` (cursor on `updated_at`), `?limit` / pagination. Each item returns: `id`, `slug`, `title`, `description`, `body_markdown`, `body_html` (rendered via existing `src/lib/markdown.ts`), `tags`, `seo_score`, `published_at`, `updated_at`.
- `GET /api/public/v1/articles/$id` — single article, same shape.

Plugins track their own last-sync cursor and pass `?since=` to avoid re-importing (standard pull pattern; no server-side delivery state needed in phase 1).

## 4. Key management server functions (`src/lib/api-keys.functions.ts`)
Authenticated via `requireSupabaseAuth`:
- `createApiKey({ name })` — generates a key, stores only the hash, returns the **full raw key once** (shown a single time in the UI).
- `listApiKeys()` — returns prefixes + metadata only (never the full key).
- `revokeApiKey({ id })` — sets `revoked_at`.

## 5. Dashboard "Integrations" page (`src/routes/_authenticated/dashboard.integrations.tsx`)
- New nav item **Integrations** in `nav.ts` (with an existing bespoke icon).
- **API keys panel**: list keys (prefix, name, last used, revoke); "Create key" dialog that surfaces the new key once with a copy button and a "store it now, you won't see it again" warning.
- **Connect your site** cards for Framer, Shopify, and WordPress: each shows the API base URL, where to paste the key, and short step-by-step setup copy (matching brand voice — Cloud White + Blue, Poppins). Honest early-stage tone, no fabricated metrics.

## 6. Verify
- Run the dev server, create a key in the UI, then `curl` `ping` and `articles` with the key to confirm auth + payload, and confirm a revoked/invalid key returns 401.

## Out of scope (later phases)
- The actual Framer/Shopify/WordPress plugin code (ships and is reviewed on those platforms).
- Direct push into a CMS and per-delivery tracking/idempotency on the server.

## Technical notes
- Hashing/random via crypto inside server code only (worker-safe).
- API key never returned after creation; only prefix is stored for display.
- All new endpoints validate input and return JSON errors with correct status codes; never leak PII.
