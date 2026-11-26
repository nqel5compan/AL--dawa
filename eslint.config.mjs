import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";

export default tseslint.config(
  { ignores: [".next/**", "node_modules/**", "out/**", "next-env.d.ts", "prisma/migrations/**"] },
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{ts,tsx}"],
    plugins: { "react-hooks": reactHooks },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
      // السجلات التشغيلية مسموحة في الخادم (pino/mock providers) — ممنوعة في الواجهة
      "no-console": "off",
    },
  },
  {
    files: ["src/components/**/*.tsx", "src/hooks/**/*.ts*", "src/app/**/page.tsx", "src/app/layout.tsx", "src/lib/i18n/**"],
    rules: { "no-console": ["error", { allow: ["warn", "error"] }] },
  }
);
