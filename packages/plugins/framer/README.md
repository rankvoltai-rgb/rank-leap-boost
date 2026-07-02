# Rankvolt — Framer plugin

Pulls your finished Rankvolt articles and syncs them into a Framer **CMS
collection**. First of the three CMS plugins (Webflow and Shopify follow the
same shape, swapping only the write-back).

## Flow

1. **Connect** — paste a Rankvolt API key (dashboard → Integrations). The plugin
   validates it via `GET /api/public/v1/ping` and shows the connected brand.
2. **List** — fetches finished articles via `GET /api/public/v1/articles`.
3. **Sync** — writes the selected articles into a Framer CMS collection
   (`src/cms.ts`, managed-collection API). Item id = article id, so re-syncing
   updates rather than duplicates.

## Develop

```bash
npm install
npm run dev     # opens the plugin inside Framer via hot-reload
```

In Framer: **Plugins → Develop → New Plugin**, point it at the dev server. To
sync, open the plugin **from a CMS collection** (managed-collection mode). Set
`VITE_RANKVOLT_BASE_URL` if your app isn't at `https://rankvolt.top`.

## Package & submit

```bash
npm run build
npm run pack    # produces plugin.zip → submit via the Framer Creator Dashboard
```

Test in **light and dark** mode (Framer requires it).

## Notes

- Shared logic (`ping`, `listArticles`) lives in `@rankvolt/api-client`; only the
  CMS write-back in `src/cms.ts` is Framer-specific.
- The managed-collection field-data shape targets **framer-plugin v3**. If your
  installed version differs, adjust `setFields` / `addItems` in `src/cms.ts` —
  the call is guarded so a mismatch shows a notice instead of crashing.
