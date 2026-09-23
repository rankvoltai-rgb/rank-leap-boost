import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import framer from "vite-plugin-framer";
import { fileURLToPath } from "node:url";

// `vite-plugin-framer` is not optional. It copies framer.json into the build,
// pins the browser target Framer Studio supports, inlines small CSS, and strips
// the `crossorigin` attributes that would otherwise be CORS-blocked inside the
// plugin's opaque-origin iframe.
const apiClientSrc = fileURLToPath(new URL("../../api-client/src/index.ts", import.meta.url));

export default defineConfig({
  plugins: [react(), framer()],
  // Aliased to source so the plugin needs no separate build of the shared client.
  resolve: { alias: { "@rankbox/api-client": apiClientSrc } },
});
