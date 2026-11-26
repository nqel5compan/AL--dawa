/**
 * بذر بيانات العرض التوضيحي — حسابات ديمو + نتائج معمل تجريبية.
 * ممنوع في الإنتاج: يُرفض إلا عند ALLOW_DEMO_SEED=true صراحةً.
 * الاستخدام: npm run db:seed
 */
import crypto from "crypto";
import fs from "fs";
import path from "path";
import { seedReferenceData, seedSohagNetwork, CATALOG, CRITICAL_RULES_SEED, db } from "./reference-data";

// تحميل .env يدويًا (بلا تبعيات) — tsx لا يحمّله تلقائيًا
function loadEnvFile(): void {
  const envPath = path.join(process.cwd(), ".env");
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*"?([^"\n]*)"?\s*$/);
    if (m && process.env[m[1]] === undefined) process.env[m[1]] = m[2];
  }
}
loadEnvFile();

if (process.env.NODE_ENV === "production" && process.env.ALLOW_DEMO_SEED !== "true") {
  console.error("رفض البذر: NODE_ENV=production. اضبط ALLOW_DEMO_SEED=true إذا كنت متأكدًا (ممنوع على بيانات حقيقية).");
  process.exit(1);
}

function hashPw(pw: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  return `${salt}:${crypto.scryptSync(pw, salt, 64).toString("hex")}`;
}

const DEMO_PASSWORD = "Demo1234!";

function cat(key: string) {
  return CATALOG.find((c) => c.key === key)!;
}

async function createLabReport(opts: {
  userId: string; labId: string; labName: string; name: string; testDate: Date;
  rows: Array<{ key: string; value: number; flag?: string }>;
  reportNo: string;
}) {
  const report = await db.medicalReport.create({
    data: {
      ownerUserId: opts.userId,
      fileName: `${opts.name}.json`, filePath: "", fileType: "json", mimeType: "application/json", fileSize: 100,
      reportType: "LAB", labName: opts.labName, testDate: opts.testDate, issuedAt: opts.testDate,
      status: "CONFIRMED_LAB", processedAt: new Date(),
      source: "LAB_DIRECT", labId: opts.labId, labReportNo: opts.reportNo,
      labVerifiedAt: new Date(), deliveredAt: new Date(),
      demo: true,
      extractionMeta: JSON.stringify({ engine: "lab-direct", pages: 1, reportType: "LAB", demo: true }),
      notes: "بيانات تجريبية لأغراض الاستعراض فقط",
    },
  });
  for (const r of opts.rows) {
    const c = cat(r.key);
    let flag = r.flag;
    if (!flag) {
      flag = c.refHigh !== undefined && r.value > c.refHigh ? "HIGH" : c.refLow !== undefined && r.value < c.refLow ? "LOW" : "NORMAL";
    }
    await db.extractedValue.create({
      data: {
        reportId: report.id, canonicalKey: c.key, rawName: c.nameAr, value: r.value, unit: c.unit,
        refLow: c.refLow ?? null, refHigh: c.refHigh ?? null, flag, confidence: 1,
        verification: "VERIFIED_LAB", section: c.category, testDate: opts.testDate, demo: true, confirmedAt: new Date(),
      },
    });
  }
  return report;
}

async function main() {
  console.log("🌱 بدء بذر البيانات التجريبية…");
  const existing = await db.user.findUnique({ where: { email: "admin@demo.aldawa.health" } });
  if (existing) {
    console.log("✅ البيانات مزروعة مسبقًا — لا حاجة للتكرار");
    return;
  }

  // ---------- بيانات مرجعية + شبكة سوهاج ----------
  await seedReferenceData();
  await seedSohagNetwork();

  // ---------- الحسابات ----------
  await db.user.create({
    data: { email: "admin@demo.aldawa.health", fullName: "مدير النظام", passwordHash: hashPw(DEMO_PASSWORD), role: "ADMIN", phone: "+201000000001" },
  });
  const doctor = await db.user.create({
    data: {
      email: "doctor@demo.aldawa.health", fullName: "د. أحمد سامي حسن", passwordHash: hashPw(DEMO_PASSWORD), role: "DOCTOR", phone: "+201000000002",
      doctorProfile: { create: { specialty: "طب الباطنة والتغذية الطبية", licenseNumber: "EG-MOH-123456", bio: "استشاري باطنة — خبرة 18 عامًا في الوقاية ومتابعة الأمراض المزمنة", isVerified: true, mfaEnabled: true } },
    },
  });
  const officer = await db.user.create({
    data: { email: "officer@demo.aldawa.health", fullName: "د. المسؤول الطبي", passwordHash: hashPw(DEMO_PASSWORD), role: "MEDICAL_OFFICER", phone: "+201000000015" },
  });

  const patient = await db.user.create({
    data: {
      email: "patient@demo.aldawa.health", fullName: "سارة أحمد محمود", passwordHash: hashPw(DEMO_PASSWORD), role: "PATIENT", phone: "+201000000003",
      patientProfile: {
        create: {
          dateOfBirth: new Date("1978-04-12"), gender: "FEMALE", gov: "سوهاج", city: "سوهاج", emergencyContact: "+201000000099",
          heightCm: 162, weightKg: 78, bpSystolic: 135, bpDiastolic: 85,
          chronicConditions: JSON.stringify([{ key: "HYPERTENSION", name: "ارتفاع ضغط الدم", since: "2021" }, { key: "PREDIABETES", name: "ما قبل السكري", since: "2024" }]),
          medications: JSON.stringify(["أملوديبين 5 ملغ يوميًا", "فيتامين د مكمل"]),
          allergies: JSON.stringify(["البنسلين"]),
          surgeries: JSON.stringify([{ name: "ولادة قيصرية", year: 2009 }]),
          smokingStatus: "FORMER", quitYearsAgo: 8, activityLevel: "LIGHT",
          familyHistory: JSON.stringify([{ condition: "BREAST_CANCER", relation: "MOTHER" }, { condition: "DIABETES", relation: "FATHER" }]),
          personalCancerHistory: false,
          reproductiveInfo: JSON.stringify({ pregnant: false, pregnancies: 2, lastPap: "2025-06-10", lastMammogram: "2025-11-02" }),
          completion: 100,
        },
      },
    },
  });
  await db.subscription.create({ data: { userId: patient.id, planKey: "PLUS", expiresAt: new Date(Date.now() + 300 * 24 * 3600 * 1000) } });
  await db.payment.create({ data: { userId: patient.id, amount: 250, planKey: "PLUS", note: "اشتراك تجريبي — تفعيل يدوي" } });
  for (const t of ["DATA_PROCESSING", "AI_ANALYSIS", "DOCTOR_SHARE", "NOTIFICATIONS", "LAB_RESULT_SHARING"]) {
    await db.consent.create({ data: { userId: patient.id, type: t as never, granted: true, source: "REGISTER" } });
  }

  const p2 = await db.user.create({
    data: {
      email: "ahmed@demo.aldawa.health", fullName: "أحمد سمير علي", passwordHash: hashPw(DEMO_PASSWORD), role: "PATIENT", phone: "+201000000004",
      patientProfile: {
        create: {
          dateOfBirth: new Date("1974-01-20"), gender: "MALE", gov: "سوهاج", heightCm: 174, weightKg: 96, bpSystolic: 140, bpDiastolic: 90,
          chronicConditions: JSON.stringify([{ key: "DIABETES", name: "السكري", since: "2019" }, { key: "DYSLIPIDEMIA", name: "ارتفاع الدهون", since: "2020" }]),
          medications: JSON.stringify(["ميتفورمين 1000 ملغ مرتين", "أتورفاستاتين 20 ملغ"]),
          smokingStatus: "CURRENT", activityLevel: "SEDENTARY",
          familyHistory: JSON.stringify([{ condition: "HEART_DISEASE", relation: "FATHER" }]),
          completion: 90,
        },
      },
    },
  });
  await db.subscription.create({ data: { userId: p2.id, planKey: "FAMILY", expiresAt: new Date(Date.now() + 200 * 24 * 3600 * 1000) } });
  for (const t of ["DATA_PROCESSING", "AI_ANALYSIS", "DOCTOR_SHARE", "NOTIFICATIONS", "LAB_RESULT_SHARING"]) {
    await db.consent.create({ data: { userId: p2.id, type: t as never, granted: true, source: "REGISTER" } });
  }

  const p3 = await db.user.create({
    data: {
      email: "mona@demo.aldawa.health", fullName: "منى خالد إبراهيم", passwordHash: hashPw(DEMO_PASSWORD), role: "PATIENT", phone: "+201000000005",
      patientProfile: { create: { dateOfBirth: new Date("1992-09-01"), gender: "FEMALE", gov: "سوهاج", heightCm: 165, weightKg: 60, smokingStatus: "NEVER", activityLevel: "MODERATE", completion: 70 } },
    },
  });
  await db.subscription.create({ data: { userId: p3.id, planKey: "FREE" } });
  for (const t of ["DATA_PROCESSING", "DOCTOR_SHARE"]) {
    await db.consent.create({ data: { userId: p3.id, type: t as never, granted: true, source: "REGISTER" } });
  }
  // منى بدون موافقة LAB_RESULT_SHARING — لسيناريو «بانتظار الموافقة»

  const daughter = await db.familyMember.create({
    data: { ownerUserId: patient.id, name: "نهى (ابنة)", relation: "DAUGHTER", dateOfBirth: new Date("2011-03-30"), gender: "FEMALE", heightCm: 155, weightKg: 45, healthData: JSON.stringify({ smokingStatus: "NEVER", chronicConditions: [] }) },
  });
  void daughter;

  // ---------- المعامل (تفعيل معملين للديمو بحسابين) ----------
  const labs = await db.lab.findMany({ orderBy: { name: "asc" } });
  const lab1 = labs[0];
  const lab2 = labs[1];
  await db.lab.update({ where: { id: lab1.id }, data: { isVerified: true, isActive: true, licenseNumber: "EG-LAB-DEMO-001", contactName: "أ. محمد عبد الله", contactPhone: "+201000000011" } });
  await db.lab.update({ where: { id: lab2.id }, data: { isVerified: true, isActive: true, licenseNumber: "EG-LAB-DEMO-002", contactName: "أ. هدى إبراهيم", contactPhone: "+201000000012" } });
  await db.user.create({ data: { email: "lab@demo.aldawa.health", fullName: "موظف المعمل الأول", passwordHash: hashPw(DEMO_PASSWORD), role: "LAB", phone: "+201000000011", labId: lab1.id } });
  await db.user.create({ data: { email: "lab-supervisor@demo.aldawa.health", fullName: "مشرف المعمل الأول", passwordHash: hashPw(DEMO_PASSWORD), role: "LAB_SUPERVISOR", phone: "+201000000016", labId: lab1.id } });
  await db.user.create({ data: { email: "lab2@demo.aldawa.health", fullName: "موظف المعمل الثاني", passwordHash: hashPw(DEMO_PASSWORD), role: "LAB", phone: "+201000000012", labId: lab2.id } });
  void officer;

  // ---------- نتائج معمل تجريبية ----------
  const labReport1 = await createLabReport({
    userId: patient.id, labId: lab1.id, labName: lab1.name,
    name: "نتيجة معمل — وظائف ودهون", testDate: new Date(Date.now() - 2 * 24 * 3600 * 1000),
    rows: [
      { key: "GLUCOSE_FASTING", value: 108 }, { key: "HBA1C", value: 6.0 }, { key: "CHOLESTEROL", value: 210 },
      { key: "LDL", value: 132 }, { key: "HDL", value: 48 }, { key: "CREATININE", value: 0.92 }, { key: "HGB", value: 12.6 },
    ],
    reportNo: "ORD-DEMO-000001",
  });
  await db.medicalReport.update({ where: { id: labReport1.id }, data: { patientOpenedAt: new Date(Date.now() - 1 * 24 * 3600 * 1000) } });

  const labReport2 = await createLabReport({
    userId: p2.id, labId: lab2.id, labName: lab2.name,
    name: "نتيجة معمل — سكري حرجة", testDate: new Date(Date.now() - 1 * 24 * 3600 * 1000),
    rows: [
      { key: "GLUCOSE_FASTING", value: 452, flag: "CRITICAL_HIGH" }, { key: "HBA1C", value: 9.4 },
      { key: "CREATININE", value: 1.5, flag: "HIGH" }, { key: "POTASSIUM", value: 5.4, flag: "HIGH" },
    ],
    reportNo: "ORD-DEMO-000002",
  });
  const glucoseRule = CRITICAL_RULES_SEED.find((r) => r.key === "GLUCOSE_CRITICAL_HIGH")!;
  await db.criticalAlert.create({
    data: {
      userId: p2.id, reportId: labReport2.id, ruleKey: glucoseRule.key, severity: "URGENT",
      messageAr: "ظهرت في نتائجك قيمة تحتاج تقييمًا طبيًا سريعًا. إذا كنت تعاني أعراضًا حادة الآن: اتصل بالإسعاف 123 فورًا أو توجه لأقرب طوارئ.",
      messageEn: "A value in your results needs urgent medical evaluation. For acute symptoms: call emergency 123 immediately.",
    },
  });
  await db.medicalReport.update({ where: { id: labReport2.id }, data: { assignedDoctorId: doctor.id, status: "UNDER_REVIEW" } });
  await db.doctorReview.create({
    data: {
      reportId: labReport2.id, doctorId: doctor.id, status: "PENDING", urgency: "URGENT",
      log: JSON.stringify([{ action: "AUTO_ESCALATED", at: new Date().toISOString(), note: "تصعيد تلقائي: قيمة حرجة في نتيجة معمل مباشرة" }]),
    },
  });

  // سارة: تقريران عبر الزمن (بلا ملفات — قيم فقط للعرض التجريبي)
  const r1 = await createLabReport({
    userId: patient.id, labId: lab1.id, labName: lab1.name,
    name: "تحاليل شاملة مارس", testDate: new Date("2026-03-10"),
    rows: [
      { key: "GLUCOSE_FASTING", value: 112 }, { key: "HBA1C", value: 6.1 }, { key: "CHOLESTEROL", value: 235 },
      { key: "LDL", value: 155 }, { key: "HDL", value: 46 }, { key: "TRIGLYCERIDES", value: 180 },
      { key: "CREATININE", value: 0.9 }, { key: "EGFR", value: 95 }, { key: "ALT", value: 28 },
      { key: "HGB", value: 12.4 }, { key: "WBC", value: 6.8 }, { key: "PLT", value: 280 },
      { key: "VITAMIN_D", value: 18 }, { key: "TSH", value: 2.1 },
    ],
    reportNo: "ORD-DEMO-000003",
  });
  const r2 = await createLabReport({
    userId: patient.id, labId: lab1.id, labName: lab1.name,
    name: "متابعة سكر ودهون يونيو", testDate: new Date("2026-06-05"),
    rows: [
      { key: "GLUCOSE_FASTING", value: 118 }, { key: "HBA1C", value: 6.9 }, { key: "CHOLESTEROL", value: 208 },
      { key: "LDL", value: 128 }, { key: "TRIGLYCERIDES", value: 150 }, { key: "CREATININE", value: 0.98 },
      { key: "EGFR", value: 92 }, { key: "ALT", value: 30 }, { key: "HGB", value: 12.2 },
      { key: "VITAMIN_D", value: 34 },
    ],
    reportNo: "ORD-DEMO-000004",
  });
  await db.medicalReport.update({ where: { id: r1.id }, data: { assignedDoctorId: doctor.id, status: "REVIEWED" } });
  await db.doctorReview.create({
    data: {
      reportId: r1.id, doctorId: doctor.id, status: "COMPLETED", urgency: "ATTENTION",
      notes: "النتائج تعكس نمط متلازمة أيضية مبكرة: سكر تراكمي في نطاق ما قبل السكري مع ارتفاع الدهون وفيتامين د منخفض. التوصية بتعديل نمط الحياة مع إعادة تقييم الدهون بعد 3 أشهر.",
      recommendation: "متابعة مع أخصائي باطنة أو تغذية طبية لتنظيم الدهون والسكر",
      log: JSON.stringify([{ action: "COMPLETE_REVIEW", at: new Date().toISOString(), note: "اكتملت المراجعة الطبية" }]),
      completedAt: new Date(),
    },
  });
  void r2;

  // ---------- نتيجة «بانتظار الاستلام» لمريض غير مسجل (ملف مشفّر) ----------
  const pendingContent = JSON.stringify([
    { name: "الهيموجلوبين", value: 13.2, unit: "g/dL", ref: "12 - 17" },
    { name: "كرات الدم البيضاء", value: 7.4, unit: "10³/µL", ref: "4 - 11" },
  ]);
  const { encryptBuffer, claimToken } = await import("../src/lib/crypto-file");
  const envelope = encryptBuffer(Buffer.from(pendingContent, "utf-8"));
  const { mkdir, writeFile } = await import("fs/promises");
  const pendingPath = path.join(process.cwd(), "uploads", "pending", `seed-${Date.now()}.enc`);
  await mkdir(path.dirname(pendingPath), { recursive: true });
  await writeFile(pendingPath, envelope, "utf-8");
  await db.pendingLabResult.create({
    data: {
      labId: lab1.id,
      patientPhone: "+201000000077",
      phoneHash: crypto.createHmac("sha256", crypto.createHash("sha256").update(`aldawa-v2-phone-pepper:${process.env.LAB_ENC_KEY || process.env.JWT_SECRET}`).digest()).update("+201000000077").digest("hex"),
      patientName: "محمود سعيد",
      fileName: "صورة_دم_كاملة.png",
      filePath: pendingPath,
      mimeType: "application/json",
      fileSize: pendingContent.length,
      reportType: "LAB",
      labReportNo: "ORD-PENDING-001",
      testDate: new Date(),
      status: "PENDING",
      claimToken: claimToken(),
      expiresAt: new Date(Date.now() + 30 * 24 * 3600 * 1000),
    },
  });

  // ---------- طلب فحص تجريبي (سارة → معمل 1) ----------
  await db.labOrder.create({
    data: {
      orderNumber: `DW-${new Date().getFullYear().toString().slice(2)}${String(new Date().getMonth() + 1).padStart(2, "0")}-000001`,
      qrToken: crypto.randomBytes(18).toString("base64url"),
      status: "CREATED",
      patientId: patient.id,
      labId: lab1.id,
      testKeys: JSON.stringify(["HBA1C", "LIPIDS_PANEL"]),
      note: "طلب تجريبي — فحوصات متابعة",
    },
  });

  // ---------- إشعارات ----------
  await db.notification.createMany({
    data: [
      {
        userId: patient.id, type: "REVIEW_COMPLETED", severity: "INFO",
        titleAr: "اكتملت المراجعة الطبية", titleEn: "Medical review completed",
        bodyAr: "راجع د. أحمد سامي تقرير تحاليل مارس — اطّلع على الرأي الطبي والتوصيات.",
        bodyEn: "Dr. Ahmed Sami reviewed your March report — see the medical opinion.",
        link: `/app/records/${r1.id}`,
      },
      {
        userId: patient.id, type: "SCREENING_REMINDER", severity: "WARNING",
        titleAr: "فحص وقائي مستحق", titleEn: "Preventive screening due",
        bodyAr: "حان موعد أحد الفحوصات الوقائية وفق الإرشادات المعتمدة — راجع خطتك.",
        bodyEn: "A preventive screening is due per approved guidelines — check your plan.",
        link: "/app/screenings",
      },
    ],
  });

  console.log("✅ تم بذر البيانات التجريبية بنجاح");
  if (process.env.NODE_ENV !== "production") {
    console.log("👤 مريض: patient@demo.aldawa.health / Demo1234!");
    console.log("👤 مريض 2 (حرج): ahmed@demo.aldawa.health / Demo1234!");
    console.log("👤 مريض 3 (بلا موافقة معمل): mona@demo.aldawa.health / Demo1234!");
    console.log("🩺 طبيب: doctor@demo.aldawa.health / Demo1234! (MFA)");
    console.log("🧪 معمل: lab@demo.aldawa.health / Demo1234! (MFA)");
    console.log("🧪 مشرف معمل: lab-supervisor@demo.aldawa.health / Demo1234! (MFA)");
    console.log("🧪 معمل 2: lab2@demo.aldawa.health / Demo1234! (MFA)");
    console.log("🛡️  المسؤول الطبي: officer@demo.aldawa.health / Demo1234! (MFA)");
    console.log("⚙️  أدمن: admin@demo.aldawa.health / Demo1234! (MFA)");
    console.log("⚠️  جميع البروتوكولات وقواعد القيم الحرجة DRAFT — لا يرى العميل أي توصية حتى اعتماد المسؤول الطبي.");
  }
}

main()
  .catch((e) => {
    console.error("❌ فشل البذر:", e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
