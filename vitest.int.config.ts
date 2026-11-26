import { defineConfig } from "vitest/config";
import path from "path";

/** إعدادات اختبارات التكامل — تعمل ضد خادم شغال + PostgreSQL + Redis */
export default defineConfig({
  test: {
    environment: "node",
    include: ["tests/integration/**/*.test.ts"],
    testTimeout: 60_000,
    hookTimeout: 60_000,
    fileParallelism: false,
  },
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
});
