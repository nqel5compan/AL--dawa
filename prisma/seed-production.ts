/**
 * بذر بيانات الإنتاج — البيانات المرجعية فقط (بلا أي حساب أو بيانات ديمو).
 * الاستخدام: npm run db:seed-production  (بعد db:migrate)
 */
import { seedReferenceData, seedSohagNetwork, db } from "./reference-data";

async function main() {
  console.log("🌱 بذر البيانات المرجعية (إنتاج)…");
  await seedReferenceData();
  const labs = await db.lab.count();
  if (labs === 0) {
    await seedSohagNetwork();
    console.log("🌐 7 مراكز — سوهاج + معمل لكل مركز (غير مفعّل حتى توثيقه من الإدارة)");
  }
  console.log("✅ اكتمل — لا حسابات ديمو في الإنتاج. أنشئ الأدمن عبر: npm run init-production");
}

main()
  .catch((e) => {
    console.error("❌ فشل البذر:", e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
