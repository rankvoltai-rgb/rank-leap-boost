// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, nitro (build-only using cloudflare as a default target),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { mcpPlugin } from "@lovable.dev/mcp-js/stacks/tanstack/vite";

// Image assets live in Lovable's asset store, not in the repo — src/assets/*.asset.json
// only holds pointers to /__l5e/assets-v1/<id>/<file>. The config's asset proxy serves
// those in dev, but only when LOVABLE_PREVIEW_HOST is set, so without this every image
// 404s locally. Read from process.env directly (Vite's loadEnv only exposes VITE_*),
// and leave any externally-set value alone so a preview host can still override it.
process.env.LOVABLE_PREVIEW_HOST ||= "rankvolt.top";

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  plugins: [mcpPlugin()],
});
