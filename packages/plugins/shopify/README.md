# Rankbox for Shopify

This folder is only the app's **configuration in Shopify** (`shopify.app.toml`).
The app itself runs inside the main Rankbox app:

- `https://rankbox.xyz/shopify`: the App URL. Shopify shows it inside the store's
  admin. The merchant pastes a Rankbox API key there, then picks a blog, whether
  posts go up visible or hidden, and the author name.
- `/api/public/shopify/{app,link,settings,sync}`: the page's API. Every call is
  authenticated by the App Bridge ID token alone.
- `/api/public/shopify/webhooks`: `app/uninstalled`, `app/scopes_update`, and the
  three compliance topics. Each request is HMAC-verified.
- `src/lib/shopify/`: the token lifecycle (expiring offline tokens, refreshed
  server-side), the GraphQL client, and the publisher that autopilot, the
  dashboard, and "Publish missing articles" all go through.

## Deploying config changes

```sh
cd packages/plugins/shopify
SHOPIFY_APP_AUTOMATION_TOKEN=… npm run deploy
```

Run `npx @shopify/cli@latest app config pull` first if anyone changed settings
in the Dev Dashboard, so this file doesn't overwrite them.

## Server environment

`SHOPIFY_API_KEY` (client ID), `SHOPIFY_API_SECRET` (client secret) and
`INTEGRATIONS_ENCRYPTION_KEY` (shared with Webflow; never rotate it casually,
because that orphans every stored token).
