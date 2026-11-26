/**
 * بذر البيانات المرجعية — مخطط الطبي المُنقل من المرجع كما هو.
 * القواعد كلها تبدأ DRAFT — لا يراها العميل إلا بعد اعتماد المسؤول الطبي.
 * مراكز سوهاج: 7 مراكز بأسماء مؤقتة + معمل واحد لكل مركز (غير مفعّل حتى توثيقه من الإدارة).
 * ممنوع التشغيل مع أي حساب ديمو في الإنتاج.
 */
import { PrismaClient } from "@prisma/client";

export const db = new PrismaClient();

// ---------------- كتالوج الفحوصات (26 فحصًا — كما في المرجع) ----------------
export const CATALOG = [
  { key: "HBA1C", nameAr: "السكر التراكمي HbA1c", nameEn: "HbA1c", unit: "%", refLow: 4.0, refHigh: 5.6, category: "METABOLIC", descriptionAr: "متوسط سكر الدم خلال آخر 2-3 أشهر. من 5.7 إلى 6.4 يعتبر ما قبل السكري، و6.5 فأكثر مع أعراض قد يشير للسكري." },
  { key: "GLUCOSE_FASTING", nameAr: "سكر الدم الصائم", nameEn: "Fasting Glucose", unit: "mg/dL", refLow: 70, refHigh: 100, category: "METABOLIC", descriptionAr: "من 100 إلى 125 يعتبر ما قبل السكري، و126 فأكثر (صائم) قد يشير للسكري مع تأكيد طبي." },
  { key: "CHOLESTEROL", nameAr: "الكوليسترول الكلي", nameEn: "Total Cholesterol", unit: "mg/dL", refLow: 0, refHigh: 200, category: "CARDIO", descriptionAr: "يُقيّم دائمًا مع LDL وHDL وعوامل الخطورة وليس منفردًا." },
  { key: "LDL", nameAr: "الكوليسترول الضار LDL", nameEn: "LDL Cholesterol", unit: "mg/dL", refLow: 0, refHigh: 100, category: "CARDIO", descriptionAr: "الهدف يختلف حسب عوامل الخطورة القلبية — قد يكون الهدف أقل من 70 لدى مرضى القلب." },
  { key: "HDL", nameAr: "الكوليسترول النافع HDL", nameEn: "HDL Cholesterol", unit: "mg/dL", refLow: 40, refHigh: 90, category: "CARDIO", descriptionAr: "أعلى من 40 للرجال و50 للنساء يعتبر وقائيًا بشكل عام." },
  { key: "TRIGLYCERIDES", nameAr: "الدهون الثلاثية", nameEn: "Triglycerides", unit: "mg/dL", refLow: 0, refHigh: 150, category: "CARDIO", descriptionAr: "تتأثر بالوجبة الأخيرة — يجب أن يكون التحليل صائمًا 9-12 ساعة." },
  { key: "CREATININE", nameAr: "الكرياتينين", nameEn: "Creatinine", unit: "mg/dL", refLow: 0.6, refHigh: 1.3, category: "KIDNEY", descriptionAr: "مؤشر لوظائف الكلى، يُقيّم مع معدل الترشيح eGFR." },
  { key: "EGFR", nameAr: "معدل الترشيح الكلوي eGFR", nameEn: "eGFR", unit: "mL/min/1.73m²", refLow: 90, refHigh: 120, category: "KIDNEY", descriptionAr: "أقل من 60 لمدة 3 أشهر فأكثر يشير لمرض كلوي مزمن — التقييم للطبيب." },
  { key: "UREA", nameAr: "اليوريا", nameEn: "Urea (BUN)", unit: "mg/dL", refLow: 15, refHigh: 45, category: "KIDNEY", descriptionAr: "يتأثر بالترطيب والنظام الغذائي وليس مؤشرًا وحيدًا لوظائف الكلى." },
  { key: "UACR", nameAr: "نسبة الألبومين للكرياتينين بالبول", nameEn: "Urine Albumin-Creatinine Ratio", unit: "mg/g", refLow: 0, refHigh: 30, category: "URINE", descriptionAr: "فحص مهم لمرضى السكري والضغط لاكتشاف تأثير الكلى مبكرًا." },
  { key: "ALT", nameAr: "إنزيم الكبد ALT", nameEn: "ALT (SGPT)", unit: "U/L", refLow: 7, refHigh: 45, category: "LIVER", descriptionAr: "ارتفاعه قد يعكس إجهادًا كبدي — يُفسّر مع AST والعوامل الأخرى." },
  { key: "AST", nameAr: "إنزيم الكبد AST", nameEn: "AST (SGOT)", unit: "U/L", refLow: 8, refHigh: 45, category: "LIVER" },
  { key: "ALP", nameAr: "الفسفاتيز القلوي ALP", nameEn: "Alkaline Phosphatase", unit: "U/L", refLow: 40, refHigh: 130, category: "LIVER" },
  { key: "BILIRUBIN", nameAr: "البيليروبين الكلي", nameEn: "Total Bilirubin", unit: "mg/dL", refLow: 0.2, refHigh: 1.2, category: "LIVER" },
  { key: "HGB", nameAr: "الهيموجلوبين", nameEn: "Hemoglobin", unit: "g/dL", refLow: 12, refHigh: 17, category: "CBC", descriptionAr: "يختلف المدى بين الرجال والنساء — انخفاضه يعكس أنيميا بدرجات متفاوتة." },
  { key: "WBC", nameAr: "كرات الدم البيضاء", nameEn: "WBC", unit: "10³/µL", refLow: 4, refHigh: 11, category: "CBC" },
  { key: "PLT", nameAr: "الصفائح الدموية", nameEn: "Platelets", unit: "10³/µL", refLow: 150, refHigh: 450, category: "CBC" },
  { key: "RBC", nameAr: "كرات الدم الحمراء", nameEn: "RBC", unit: "10⁶/µL", refLow: 4.2, refHigh: 5.9, category: "CBC" },
  { key: "HCT", nameAr: "الهيماتوكريت", nameEn: "Hematocrit", unit: "%", refLow: 36, refHigh: 50, category: "CBC" },
  { key: "VITAMIN_D", nameAr: "فيتامين د", nameEn: "Vitamin D (25-OH)", unit: "ng/mL", refLow: 30, refHigh: 100, category: "BONE", descriptionAr: "أقل من 20 يعتبر نقصًا، ومن 20-30 قصورًا نسبيًا. الجرعات يحددها الطبيب." },
  { key: "CALCIUM", nameAr: "الكالسيوم", nameEn: "Calcium", unit: "mg/dL", refLow: 8.5, refHigh: 10.5, category: "BONE" },
  { key: "FERRITIN", nameAr: "مخزون الحديد (الفيريتين)", nameEn: "Ferritin", unit: "ng/mL", refLow: 30, refHigh: 300, category: "BONE", descriptionAr: "يُطلب عند الاستحقاق لدراسات نقص الحديد وليس روتينيًا." },
  { key: "TSH", nameAr: "الهرمون المنبه للدرقية TSH", nameEn: "TSH", unit: "mIU/L", refLow: 0.4, refHigh: 4.5, category: "THYROID" },
  { key: "URIC_ACID", nameAr: "حمض اليوريك", nameEn: "Uric Acid", unit: "mg/dL", refLow: 3.5, refHigh: 7.2, category: "OTHER" },
  { key: "POTASSIUM", nameAr: "البوتاسيوم", nameEn: "Potassium", unit: "mmol/L", refLow: 3.5, refHigh: 5.1, category: "OTHER" },
  { key: "SODIUM", nameAr: "الصوديوم", nameEn: "Sodium", unit: "mmol/L", refLow: 135, refHigh: 145, category: "OTHER" },
] as const;

// ---------------- البروتوكولات (19 بروتوكولًا — مسودة كما في المرجع) ----------------
export const PROTOCOLS = [
  { key: "BP_CHECK", titleAr: "قياس ضغط الدم", titleEn: "Blood Pressure Check", category: "GENERAL", gender: null as string | null, minAge: 18, maxAge: null as number | null, intervalMonths: 12, riskFactors: [] as string[], requiresRisk: false, sourceOrg: "MOH_EG", guidelineVersion: "1.2", guidelineDate: "2024-06-01", doctorDiscussion: false, summaryAr: "قياس دوري لضغط الدم فئة أولى من الفحص الوقائي الأساسي.", summaryEn: "Routine blood pressure measurement." },
  { key: "BMI_ASSESSMENT", titleAr: "تقييم الوزن ومؤشر كتلة الجسم", titleEn: "Weight & BMI Assessment", category: "GENERAL", gender: null, minAge: 18, maxAge: null, intervalMonths: 12, riskFactors: [], requiresRisk: false, sourceOrg: "WHO", guidelineVersion: "2024", guidelineDate: "2024-03-01", doctorDiscussion: false, summaryAr: "تقييم الوزن ومؤشر كتلة الجسم دوريًا.", summaryEn: "Periodic weight and BMI assessment." },
  { key: "DIABETES_RISK", titleAr: "تقييم خطر السكري", titleEn: "Diabetes Risk Assessment", category: "METABOLIC", gender: null, minAge: 18, maxAge: null, intervalMonths: 24, riskFactors: ["OBESITY", "HYPERTENSION", "DIABETES", "DYSLIPIDEMIA"], requiresRisk: true, sourceOrg: "USPSTF", guidelineVersion: "2021", guidelineDate: "2021-08-24", doctorDiscussion: false, summaryAr: "تقييم خطر السكري عند وجود عوامل خطورة فقط — لا يُطلب للجميع.", summaryEn: "Diabetes risk assessment only with risk factors." },
  { key: "HBA1C_SCREEN", titleAr: "السكر التراكمي HbA1c", titleEn: "HbA1c Screening", category: "METABOLIC", gender: null, minAge: 35, maxAge: 70, intervalMonths: 12, riskFactors: ["DIABETES", "HYPERTENSION", "OBESITY", "DYSLIPIDEMIA"], requiresRisk: true, sourceOrg: "MOH_EG", guidelineVersion: "2023", guidelineDate: "2023-05-01", doctorDiscussion: false, summaryAr: "سكر تراكمي عند وجود عوامل خطورة للسكري.", summaryEn: "HbA1c when diabetes risk factors exist." },
  { key: "LIPIDS_PANEL", titleAr: "تقييم الدهون والكوليسترول", titleEn: "Lipid Panel", category: "CARDIO", gender: null, minAge: 20, maxAge: null, intervalMonths: 36, riskFactors: ["DIABETES", "HYPERTENSION", "DYSLIPIDEMIA", "HEART_DISEASE", "OBESITY", "SMOKING"], requiresRisk: true, sourceOrg: "USPSTF", guidelineVersion: "2022", guidelineDate: "2022-08-23", doctorDiscussion: false, summaryAr: "قياس الدهون حسب عوامل الخطورة وليس روتينيًا للجميع.", summaryEn: "Lipid panel per risk factors." },
  { key: "KIDNEY_FUNCTION", titleAr: "تقييم وظائف الكلى", titleEn: "Kidney Function Tests", category: "KIDNEY", gender: null, minAge: 30, maxAge: null, intervalMonths: 12, riskFactors: ["DIABETES", "HYPERTENSION", "CKD", "HEART_DISEASE"], requiresRisk: true, sourceOrg: "NICE", guidelineVersion: "NG203", guidelineDate: "2021-08-25", doctorDiscussion: false, summaryAr: "كرياتينين وeGFR عند وجود عوامل خطورة كلوية.", summaryEn: "Creatinine and eGFR with kidney risk factors." },
  { key: "LIVER_FUNCTION", titleAr: "تقييم وظائف الكبد", titleEn: "Liver Function Tests", category: "LIVER", gender: null, minAge: 18, maxAge: null, intervalMonths: 12, riskFactors: ["DIABETES", "LIVER_DISEASE", "DYSLIPIDEMIA", "OBESITY"], requiresRisk: true, sourceOrg: "NICE", guidelineVersion: "NG49", guidelineDate: "2016-04-20", doctorDiscussion: false, summaryAr: "ALT وAST عند وجود داعٍ طبي.", summaryEn: "ALT and AST when indicated." },
  { key: "BREAST_MAMMO", titleAr: "الماموجرام للكشف المبكر عن سرطان الثدي", titleEn: "Mammography — Breast Screening", category: "CANCER", gender: "FEMALE", minAge: 40, maxAge: 74, intervalMonths: 24, riskFactors: [], requiresRisk: false, sourceOrg: "USPSTF", guidelineVersion: "2024", guidelineDate: "2024-04-30", doctorDiscussion: false, summaryAr: "ماموجرام كل سنتين للنساء من 40 إلى 74 سنة.", summaryEn: "Biennial mammography for women 40–74." },
  { key: "BREAST_MAMMO_RISK", titleAr: "ماموجرام مبكر عند التاريخ العائلي", titleEn: "Earlier Mammography with Family History", category: "CANCER", gender: "FEMALE", minAge: 30, maxAge: 39, intervalMonths: 12, riskFactors: ["FAMILY_BREAST_CANCER"], requiresRisk: true, sourceOrg: "ACS", guidelineVersion: "2023", guidelineDate: "2023-01-01", doctorDiscussion: true, summaryAr: "من لديهن تاريخ عائلي لسرطان الثدي قد يستفدن من بدء مبكر — قرار يُناقش مع الطبيب.", summaryEn: "Family history may justify earlier start — discuss with your doctor." },
  { key: "COLORECTAL_FIT", titleAr: "اختبار FIT لسرطان القولون", titleEn: "FIT Test — Colorectal Screening", category: "CANCER", gender: null, minAge: 45, maxAge: 75, intervalMonths: 12, riskFactors: [], requiresRisk: false, sourceOrg: "USPSTF", guidelineVersion: "2021", guidelineDate: "2021-05-18", doctorDiscussion: false, summaryAr: "اختبار الدم الخفي في البراز سنويًا من سن 45.", summaryEn: "Annual FIT from age 45." },
  { key: "COLONOSCOPY_SCREEN", titleAr: "منظار القولون الوقائي", titleEn: "Screening Colonoscopy", category: "CANCER", gender: null, minAge: 45, maxAge: 75, intervalMonths: 120, riskFactors: ["FAMILY_COLORECTAL_CANCER"], requiresRisk: false, sourceOrg: "USPSTF", guidelineVersion: "2021", guidelineDate: "2021-05-18", doctorDiscussion: true, summaryAr: "بديل لـ FIT كل 10 سنوات — مع التاريخ العائلي قد يبدأ مبكرًا.", summaryEn: "Colonoscopy every 10 years — earlier with family history." },
  { key: "PAP_HPV", titleAr: "مسحة عنق الرحم واختبار HPV", titleEn: "Pap Smear & HPV Testing", category: "CANCER", gender: "FEMALE", minAge: 21, maxAge: 65, intervalMonths: 36, riskFactors: [], requiresRisk: false, sourceOrg: "USPSTF", guidelineVersion: "2020", guidelineDate: "2020-08-21", doctorDiscussion: false, summaryAr: "مسحة عنق الرحم كل 3 سنوات (أو HPV كل 5 سنوات من 30).", summaryEn: "Pap every 3 years (HPV every 5 from 30)." },
  { key: "LUNG_LDCT", titleAr: "الأشعة المقطعية منخفضة الجرعة (الرئة)", titleEn: "LDCT — Lung Cancer Screening", category: "CANCER", gender: null, minAge: 50, maxAge: 80, intervalMonths: 12, riskFactors: ["SMOKING"], requiresRisk: true, sourceOrg: "USPSTF", guidelineVersion: "2021", guidelineDate: "2021-03-09", doctorDiscussion: true, summaryAr: "للمدخنين بكثافة عالية (20 عبوة سنة) — قرار طبي مشترك.", summaryEn: "For heavy smokers (20 pack-years) — shared decision." },
  { key: "PSA_DISCUSSION", titleAr: "مناقشة فحص البروستاتا (PSA)", titleEn: "Prostate (PSA) Shared Decision", category: "CANCER", gender: "MALE", minAge: 50, maxAge: 69, intervalMonths: 12, riskFactors: [], requiresRisk: false, sourceOrg: "USPSTF", guidelineVersion: "2018", guidelineDate: "2018-05-08", doctorDiscussion: true, summaryAr: "قرار مشترك مع الطبيب — لا يُوصى به تلقائيًا للجميع.", summaryEn: "Individual shared decision — not automatic." },
  { key: "PSA_RISK", titleAr: "مناقشة PSA عند التاريخ العائلي", titleEn: "PSA Discussion with Family History", category: "CANCER", gender: "MALE", minAge: 45, maxAge: 49, intervalMonths: 12, riskFactors: ["FAMILY_PROSTATE_CANCER"], requiresRisk: true, sourceOrg: "ACS", guidelineVersion: "2023", guidelineDate: "2023-01-01", doctorDiscussion: true, summaryAr: "تاريخ عائلي للبروستاتا يستدعي مناقشة مبكرة مع الطبيب.", summaryEn: "Family history justifies earlier discussion." },
  { key: "DEXA_BONE", titleAr: "قياس كثافة العظام (DEXA)", titleEn: "Bone Density (DEXA)", category: "BONE", gender: "FEMALE", minAge: 65, maxAge: null, intervalMonths: 24, riskFactors: [], requiresRisk: false, sourceOrg: "USPSTF", guidelineVersion: "2018", guidelineDate: "2018-06-26", doctorDiscussion: false, summaryAr: "فحص هشاشة العظام للنساء من 65 سنة.", summaryEn: "Osteoporosis screening for women 65+." },
  { key: "DEXA_RISK", titleAr: "كثافة العظام عند عوامل الخطورة", titleEn: "DEXA with Risk Factors", category: "BONE", gender: null, minAge: 50, maxAge: 64, intervalMonths: 24, riskFactors: ["OSTEOPOROSIS_RISK"], requiresRisk: true, sourceOrg: "NICE", guidelineVersion: "NG146", guidelineDate: "2017-02-22", doctorDiscussion: true, summaryAr: "تقييم هشاشة العظام عند وجود عوامل خطورة قبل 65.", summaryEn: "Osteoporosis assessment with risk factors." },
  { key: "SENIOR_REVIEW", titleAr: "المراجعة الصحية الشاملة لكبار السن", titleEn: "Comprehensive Senior Review", category: "SENIOR", gender: null, minAge: 65, maxAge: null, intervalMonths: 12, riskFactors: [], requiresRisk: false, sourceOrg: "WHO", guidelineVersion: "2021", guidelineDate: "2021-10-04", doctorDiscussion: false, summaryAr: "مراجعة سنوية شاملة: مزمنة، نظر، سمع، سقوط، تغذية وحركة.", summaryEn: "Annual comprehensive review for seniors." },
  { key: "VITD_CHECK", titleAr: "فيتامين د", titleEn: "Vitamin D Test", category: "BONE", gender: null, minAge: 40, maxAge: null, intervalMonths: 24, riskFactors: [], requiresRisk: false, sourceOrg: "MOH_EG", guidelineVersion: "2022", guidelineDate: "2022-01-15", doctorDiscussion: false, summaryAr: "شائع النقص في مصر — فحص دوري من الأربعين.", summaryEn: "Common deficiency in Egypt — periodic check from 40." },
] as const;

// ---------------- قواعد القيم الحرجة (12 قاعدة — بيانات كما في المرجع) ----------------
export const CRITICAL_RULES_SEED = [
  { key: "GLUCOSE_CRITICAL_HIGH", testKey: "GLUCOSE_FASTING", op: ">", threshold: 400, severity: "URGENT", unit: "mg/dL", messageAr: "سكر دم صائم مرتفع بشكل خطير — يحتاج تقييمًا طبيًا فوريًا.", messageEn: "Critically high fasting glucose — needs immediate medical evaluation." },
  { key: "GLUCOSE_CRITICAL_LOW", testKey: "GLUCOSE_FASTING", op: "<", threshold: 50, severity: "URGENT", unit: "mg/dL", messageAr: "سكر دم منخفض بشكل خطير — احصل على رعاية طبية فورية، خاصة مع أي أعراض.", messageEn: "Critically low fasting glucose — seek immediate care, especially with symptoms." },
  { key: "HEMOGLOBIN_CRITICAL_LOW", testKey: "HGB", op: "<", threshold: 7, severity: "URGENT", unit: "g/dL", messageAr: "هيموجلوبين منخفض بشكل خطير (أنيميا شديدة) — يحتاج تقييمًا عاجلًا.", messageEn: "Critically low hemoglobin (severe anemia) — urgent evaluation needed." },
  { key: "PLATELETS_CRITICAL_LOW", testKey: "PLT", op: "<", threshold: 50, severity: "URGENT", unit: "10³/µL", messageAr: "عدد الصفائح الدموية منخفض جدًا — خطر نزيف، تقييم عاجل.", messageEn: "Very low platelet count — bleeding risk, urgent evaluation." },
  { key: "WBC_CRITICAL_HIGH", testKey: "WBC", op: ">", threshold: 30, severity: "URGENT", unit: "10³/µL", messageAr: "عدد كرات الدم البيضاء مرتفع بشكل خطير — يحتاج تقييمًا طبيًا عاجلًا.", messageEn: "Critically high white blood cell count — urgent evaluation needed." },
  { key: "CREATININE_CRITICAL_HIGH", testKey: "CREATININE", op: ">", threshold: 4, severity: "URGENT", unit: "mg/dL", messageAr: "الكرياتينين مرتفع بشكل خطير — يشير لضعف شديد في وظائف الكلى، تقييم عاجل.", messageEn: "Critically high creatinine — indicates severe kidney impairment, urgent evaluation." },
  { key: "POTASSIUM_CRITICAL_HIGH", testKey: "POTASSIUM", op: ">", threshold: 6.5, severity: "URGENT", unit: "mmol/L", messageAr: "البوتاسيوم مرتفع بشكل خطير — خطر على نظم القلب، توجّه للطوارئ.", messageEn: "Critically high potassium — cardiac risk, go to emergency care." },
  { key: "POTASSIUM_CRITICAL_LOW", testKey: "POTASSIUM", op: "<", threshold: 2.5, severity: "URGENT", unit: "mmol/L", messageAr: "البوتاسيوم منخفض بشكل خطير — يحتاج تصحيحًا طبيًا عاجلًا.", messageEn: "Critically low potassium — needs urgent medical correction." },
  { key: "EGFR_CRITICAL_LOW", testKey: "EGFR", op: "<", threshold: 15, severity: "URGENT", unit: "mL/min/1.73m²", messageAr: "معدل الترشيح الكلوي منخفض جدًا — حالة تحتاج تقييم أخصائي كلى عاجل.", messageEn: "Very low eGFR — needs urgent nephrology evaluation." },
  { key: "HBA1C_VERY_HIGH", testKey: "HBA1C", op: ">", threshold: 12, severity: "HIGH", unit: "%", messageAr: "السكر التراكمي مرتفع جدًا — تنظيم السكري يحتاج مراجعة عاجلة مع طبيبك.", messageEn: "Very high HbA1c — diabetes control needs urgent review with your doctor." },
  { key: "TSH_CRITICAL_LOW", testKey: "TSH", op: "<", threshold: 0.01, severity: "HIGH", unit: "mIU/L", messageAr: "TSH منخفض جدًا — احتمال فرط نشاط الغدة الدرقية الشديد، مراجعة مطلوبة.", messageEn: "Very low TSH — possible severe hyperthyroidism, review needed." },
  { key: "TSH_CRITICAL_HIGH", testKey: "TSH", op: ">", threshold: 20, severity: "HIGH", unit: "mIU/L", messageAr: "TSH مرتفع جدًا — احتمال قصور شديد في الغدة الدرقية، مراجعة مطلوبة.", messageEn: "Very high TSH — possible severe hypothyroidism, review needed." },
] as const;

// ---------------- مصادر الإرشادات ----------------
export const KNOWLEDGE = [
  { org: "MOH_EG", titleAr: "الدليل العلاجي المصري — وزارة الصحة والسكان", version: "2023", publishedAt: "2023", notesAr: "المرجع الأساسي للسوق المصري." },
  { org: "WHO", titleAr: "إرشادات منظمة الصحة العالمية للأمراض غير السارية", version: "2021", publishedAt: "2021", notesAr: "الوقاية الأولية للأمراض المزمنة." },
  { org: "USPSTF", titleAr: "توصيات USPSTF للفحوصات الوقائية", version: "2024", publishedAt: "2024", notesAr: "المرجع الرئيسي للكشف المبكر عن الأورام." },
  { org: "IARC", titleAr: "دليل IARC/WHO لاستراتيجيات الكشف المبكر عن السرطان", version: "2022", publishedAt: "2022" },
  { org: "ACS", titleAr: "إرشادات الجمعية الأمريكية للسرطان", version: "2023", publishedAt: "2023" },
  { org: "NICE", titleAr: "إرشادات NICE للمرض المزمن", version: "NG203", publishedAt: "2021" },
] as const;

// ---------------- الباقات — 0 / 250 / 500 جنيه (قرار صاحب المشروع) ----------------
export const PLANS = [
  {
    key: "FREE", nameAr: "الباقة المجانية", nameEn: "Free Plan", priceEgp: 0, reportsLimit: 3, sortOrder: 1, includesReview: false,
    featuresAr: JSON.stringify(["إنشاء الملف الصحي", "3 تقارير شهريًا", "شرح أساسي للنتائج", "سجل صحي أساسي", "خطة فحوصات وقائية"]),
    featuresEn: JSON.stringify(["Health profile", "3 reports/month", "Basic results explanation", "Basic health record", "Preventive screening plan"]),
  },
  {
    key: "PLUS", nameAr: "الباقة المتقدمة", nameEn: "Plus Plan", priceEgp: 250, reportsLimit: -1, sortOrder: 2, includesReview: true,
    featuresAr: JSON.stringify(["تقارير غير محدودة", "مقارنة تاريخية متقدمة", "متابعة صحية مستمرة", "تذكيرات شخصية", "مراجعة طبية شهرية", "أولوية في التنبيهات"]),
    featuresEn: JSON.stringify(["Unlimited reports", "Advanced comparisons", "Continuous follow-up", "Personal reminders", "Monthly medical review", "Alert priority"]),
  },
  {
    key: "FAMILY", nameAr: "باقة العائلة", nameEn: "Family Plan", priceEgp: 500, reportsLimit: -1, sortOrder: 3, includesReview: true,
    featuresAr: JSON.stringify(["كل مزايا المتقدمة", "ملفات صحية لأفراد الأسرة", "متابعة أفراد الأسرة بتفويض", "فصل خصوصية كامل لكل فرد", "حتى 5 أفراد", "مراجعة طبية شهرية"]),
    featuresEn: JSON.stringify(["All Plus features", "Family member profiles", "Delegated family follow-up", "Full privacy per member", "Up to 5 members", "Monthly medical review"]),
  },
] as const;

// ---------------- مراكز سوهاج — أسماء مؤقتة تُستبدل من لوحة الإدارة ----------------
export async function seedSohagNetwork(): Promise<Record<number, string>> {
  const markazIds: Record<number, string> = {};
  for (let i = 1; i <= 7; i++) {
    const m = await db.markaz.create({
      data: { gov: "سوهاج", name: `مركز (${i}) — سوهاج`, nameEn: `Markaz ${i} - Sohag` },
    });
    markazIds[i] = m.id;
    await db.lab.create({
      data: {
        name: `معمل مركز (${i}) — سوهاج`,
        licenseNumber: null,
        markazId: m.id,
        isVerified: false,
        isActive: false, // لا يعمل حتى توثيقه وتفعيله من الإدارة
        pricingModel: "NONE",
      },
    });
  }
  return markazIds;
}

// ---------------- البيانات المرجعية المشتركة ----------------
export async function seedReferenceData(): Promise<void> {
  for (const p of PLANS) {
    await db.plan.upsert({ where: { key: p.key }, create: { ...p }, update: { ...p } });
  }
  for (const c of CATALOG) {
    await db.testCatalog.upsert({ where: { key: c.key }, create: { ...c }, update: { ...c } });
  }
  const SCREENING_EXCLUSIONS_AR = "لا ينطبق كفحص وقائي على من لديه أعراض حالية — وجود أعراض يستدعي تقييمًا طبيًا مباشرًا وليس فحصًا وقائيًا، والقرار النهائي للطبيب.";
  const SCREENING_EXCLUSIONS_EN = "Not applicable as preventive screening for people with current symptoms — symptoms call for direct medical evaluation, not routine screening. The final decision belongs to your doctor.";
  const MONITOR_EXCLUSIONS_AR = "يتعلق بمتابعة حالة صحية معروفة وفق توجيه الطبيب — لا يُستخدم كفحص عام لمن لا توجد لديهم مؤشرات طبية تدعو إليه.";
  const MONITOR_EXCLUSIONS_EN = "Intended for monitoring a known condition under medical guidance — not a general test without a medical indication.";
  const SEE_DOCTOR_AR = "إذا ظهرت عليك أعراض مقلقة قبل موعد الفحص، راجع طبيبك مباشرة ولا تنتظر الموعد الدوري، وإن كان الفحص قرارًا مشتركًا ناقشه مع طبيبك أولًا.";
  const SEE_DOCTOR_EN = "If concerning symptoms appear before the screening date, see your doctor directly — do not wait for the periodic appointment. If this is a shared decision, discuss it with your doctor first.";
  const MONITORING_KEYS = new Set(["KIDNEY_FUNCTION", "LIVER_FUNCTION"]);
  for (const p of PROTOCOLS) {
    const monitoring = MONITORING_KEYS.has(p.key);
    await db.screeningProtocol.upsert({
      where: { key: p.key },
      create: {
        ...p,
        riskFactors: JSON.stringify(p.riskFactors),
        testKeys: "[]",
        protocolType: monitoring ? "ROUTINE_MONITORING" : "SCREENING",
        exclusionsAr: monitoring ? MONITOR_EXCLUSIONS_AR : SCREENING_EXCLUSIONS_AR,
        exclusionsEn: monitoring ? MONITOR_EXCLUSIONS_EN : SCREENING_EXCLUSIONS_EN,
        seeDoctorAr: SEE_DOCTOR_AR,
        seeDoctorEn: SEE_DOCTOR_EN,
        status: "DRAFT",
        active: true,
      },
      update: {},
    });
  }
  for (const r of CRITICAL_RULES_SEED) {
    await db.criticalRule.upsert({ where: { key: r.key }, create: { ...r, status: "DRAFT" }, update: {} });
  }
  for (const k of KNOWLEDGE) {
    const exists = await db.knowledgeSource.findFirst({ where: { org: k.org, version: k.version } });
    if (!exists) await db.knowledgeSource.create({ data: { ...k } });
  }
}
