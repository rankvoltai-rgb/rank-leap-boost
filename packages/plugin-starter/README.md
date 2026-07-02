# @rankvolt/plugin-starter

The shared React + Vite shell every Rankvolt CMS plugin forks. It handles the
parts that are identical across Framer / Webflow / Shopify:

- API-key entry + validation (via `ping`)
- Listing the account's finished articles (via `@rankvolt/api-client`)
- Selecting articles and a `publish()` action

Each platform fork keeps all of that and only replaces `publish()` with the
platform's CMS write-back (page/CMS item creation).

## Run

```bash
npm install
npm run dev   # http://localhost:5180
```

Set the API base URL to your app (`https://rankvolt.top`) and paste a key from
dashboard → Integrations. The SDK is resolved from `../api-client/src`, so no
build step is needed in dev.
