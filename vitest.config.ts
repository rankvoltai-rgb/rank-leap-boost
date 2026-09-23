import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

// Unit tests for the pure modules (no Supabase, no network). Kept apart from
// vite.config.ts: the app config pulls in TanStack Start, nitro and the
// Lovable plugins, none of which a test run needs.
export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      // The plugin packages import the shared client by name; point it at
      // source so a test run needs no build step.
      "@rankbox/api-client": fileURLToPath(
        new URL("./packages/api-client/src/index.ts", import.meta.url),
      ),
    },
  },
  test: {
    // packages/** covers the CMS plugins, whose logic is written DOM-free
    // precisely so it can run here rather than needing a Framer runtime.
    include: ["src/**/*.test.ts", "packages/**/src/**/*.test.ts"],
    exclude: ["**/node_modules/**", "**/dist/**"],
    environment: "node",
  },
});
