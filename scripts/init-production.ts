/**
 * init-production — أدمن واحد + بيانات مرجعية، بلا أي حسابات ديمو.
 * المتغيرات من .env: ADMIN_EMAIL + ADMIN_PASSWORD (12+ حرفًا) — تُضعها بنفسك.
 * الاستخدام: npm run init-production  (بعد db:migrate + db:seed-production)
 */
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { PrismaClient } from "@prisma/client";

// تحميل .env يدويًا (tsx لا يحمّله)
const envPath = path.join(process.cwd(), ".env");
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*"?([^"\n]*)"?\s*$/);
    if (m && process.env[m[1]] === undefined) process.env[m[1]] = m[2];
  }
}

const db = new PrismaClient();
const email = (process.env.ADMIN_EMAIL ?? "").trim().toLowerCase();
const password = process.env.ADMIN_PASSWORD ?? "";

if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
  console.error("ADMIN_EMAIL مطلوب في .env (بريد صالح)");
  process.exit(1);
}
if (password.length < 12 || !/[a-zA-Z]/.test(password) || !/\d/.test(password)) {
  console.error("ADMIN_PASSWORD مطلوب في .env — 12+ حرفًا مع حرف ورقم. ضعه بنفسك ولا تشاركه.");
  process.exit(1);
}

async function main() {
  console.log("⚙️  init-production…");
  const existing = await db.user.findUnique({ where: { email } });
  if (existing) {
    console.log("الأدمن موجود بالفعل — لا تغيير.");
    return;
  }
  const salt = crypto.randomBytes(16).toString("hex");
  const key = crypto.scryptSync(password, salt, 64);
  await db.user.create({
    data: {
      email,
      fullName: "مدير النظام",
      role: "ADMIN",
      passwordHash: `${salt}:${key.toString("hex")}`,
    },
  });
  console.log(`✅ أنشئ حساب الأدمن (${email}) — سجل الدخول ثم فعّل MFA أولًا.`);
  console.log("⚠️  لا كلمات مرور تُطبع ولا تُحفظ في أي مكان آخر.");
}

main()
  .catch((e) => {
    console.error("فشل init-production:", e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
