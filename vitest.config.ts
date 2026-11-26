import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  esbuild: { jsx: "automatic" },
  test: {
    environment: "node",
    include: ["tests/unit/**/*.test.ts"],
    testTimeout: 15000,
    passWithNoTests: true,
  },
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
});
