import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";

const apiClientSrc = fileURLToPath(new URL("../../api-client/src/index.ts", import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: { alias: { "@rankvolt/api-client": apiClientSrc } },
});
