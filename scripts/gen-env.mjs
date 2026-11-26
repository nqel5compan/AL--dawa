#!/usr/bin/env node
/**
 * توليد .env للتطوير المحلي فقط — أسرار عشوائية قوية لا تدخل Git.
 * الاستخدام: node scripts/gen-env.mjs [--force]
 */
import crypto from "crypto";
import fs from "fs";
import path from "path";

const dir = process.cwd();
const envPath = path.join(dir, ".env");
if (fs.existsSync(envPath) && !process.argv.includes("--force")) {
  console.log("`.env` موجود بالفعل — استخدم --force لإعادة التوليد.");
  process.exit(0);
}
const secret = () => crypto.randomBytes(32).toString("hex");
const content = `# توليد تلقائي للتطوير المحلي — لا ترفع هذا الملف لأي مكان
DATABASE_URL="postgresql://aldawa:aldawa_dev_pw@localhost:5432/aldawa?schema=public"
REDIS_URL="redis://localhost:6379"
JWT_SECRET="${secret()}"
LAB_ENC_KEY="${secret()}"
NODE_ENV="development"
DEMO_MODE="true"
TRUSTED_PROXY="false"
PORT="3000"
PUBLIC_BASE_URL="http://localhost:3000"
STORAGE_PROVIDER="local"
STORAGE_LOCAL_DIR="uploads"
WORKER_CONCURRENCY="2"
`;
fs.writeFileSync(envPath, content, { mode: 0o600 });
console.log("تم توليد .env بصلاحيات 0600 — أسرار عشوائية (JWT_SECRET, LAB_ENC_KEY).");
