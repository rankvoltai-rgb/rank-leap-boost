import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

// Unit tests for the pure modules (no Supabase, no network). Kept apart from
// vite.config.ts: the app config pulls in TanStack Start, nitro and the
// Lovable plugins, none of which a test run needs.
export default defineConfig({
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  test: {
    include: ["src/**/*.test.ts"],
    environment: "node",
  },
});
