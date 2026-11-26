#!/usr/bin/env node
/**
 * التحقق من تطابق مفاتيح القاموسين (عربي/إنجليزي) — يفشل عند أي مفتاح ناقص أو قيمة فارغة.
 * الاستخدام: node scripts/i18n-check.mjs
 */
import { execFileSync } from "child_process";
import path from "path";
import fs from "fs";

const arFile = path.join(process.cwd(), "src/lib/i18n/ar.ts");
const enFile = path.join(process.cwd(), "src/lib/i18n/en.ts");
for (const f of [arFile, enFile]) {
  if (!fs.existsSync(f)) {
    console.error("i18n-check: ملف مفقود:", f);
    process.exit(1);
  }
}

// تحويل TS إلى CJS عبر tsx مع تسجيل محمّل الاستيراد
let out;
try {
  out = execFileSync(process.execPath, ["--import", "tsx", "--input-type=module", "-e",
    `import { createRequire } from "module";\n` +
    `import { pathToFileURL } from "url";\n` +
    `const require2 = createRequire(import.meta.url);\n` +
    `const m1 = await import(pathToFileURL(process.argv[1]).href);\n` +
    `const m2 = await import(pathToFileURL(process.argv[2]).href);\n` +
    `const ar = m1.ar;\nconst en = m2.en;\n` +
    `const a = new Set(Object.keys(ar));\nconst e = new Set(Object.keys(en));\n` +
    `const missingInEn = [...a].filter((k) => !e.has(k));\n` +
    `const missingInAr = [...e].filter((k) => !a.has(k));\n` +
    `const empty = [...a].filter((k) => !String(ar[k] ?? "").trim() || !String(en[k] ?? "").trim());\n` +
    `console.log(JSON.stringify({ arCount: a.size, enCount: e.size, missingInEn, missingInAr, empty }));`,
    arFile, enFile], { encoding: "utf8", stdio: ["ignore", "pipe", "inherit"] });
} catch {
  console.error("i18n-check فشل في تحميل القواميس — راجع الأخطاء أعلاه");
  process.exit(1);
}

const line = out.trim().split("\n").find((l) => l.startsWith("{"));
let data;
try {
  data = JSON.parse(line ?? "{}");
} catch {
  console.error("i18n-check: مخرجات غير متوقعة:", out.slice(-300));
  process.exit(1);
}
const problems = data.missingInEn.length + data.missingInAr.length + data.empty.length;
console.log(`i18n-check: عربي ${data.arCount} مفتاحًا · إنجليزي ${data.enCount} مفتاحًا`);
if (problems > 0) {
  console.error("ناقص/فارغ:", JSON.stringify({ missingInEn: data.missingInEn.slice(0, 40), missingInAr: data.missingInAr.slice(0, 40), empty: data.empty.slice(0, 40) }, null, 2));
  process.exit(1);
}
console.log("i18n-check: ✓ القاموسان متطابقان — 0 ناقصًا");
