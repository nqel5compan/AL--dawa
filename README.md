# الدواء | Al Dawa — v2

منصة طبية للكشف المبكر عن الأورام ومتابعة الحالات الصحية — انطلاقًا من محافظة **سوهاج**.
أربعة أطراف على نفس النظام لحظيًا (العميل · المعمل · الطبيب المشرف · الإدارة) وبجوارها **المسؤول الطبي** الذي يعتمد كل قاعدة طبية قبل أن تصل لأي عميل.

> «قد تكون مؤهلًا لفحص كذا» — لا «ستتحمى من المرض».
> اللي بيكشف هو الفحص، واللي بيشخّص هو الدكتور — المنصة توصّل للفحص الصح في الوقت الصح وتتابع بعد النتيجة.

## المعمارية

| الطبقة | التقنية |
|---|---|
| الواجهة | React 19 + Next.js 16 (App Router, standalone) + Tailwind 4 + shadcn/ui + TanStack Query + Cairo (RTL/LTR + i18n-check) |
| الخادم | Route Handlers بطبقات (route ← service ← data-access) + zod + صلاحيات مركزية |
| القاعدة | PostgreSQL 16 + Prisma (migrations حقيقية) |
| التزامن | Redis 7: OTP + rate-limit + BullMQ worker + pub/sub للبث بين النسخ |
| الملفات | تخزين مجرد: محلي أو S3/MinIO (SigV4 بلا مكتبات إضافية) + AES-256-GCM للنتائج المعلقة |
| الأمان | JWT httpOnly + tokenVersion + scrypt async + MFA بالبريد + AuditLog + rate-limit |
| اللحظي | Outbox (DomainEvent بنفس الـ transaction) + SSE + Redis pub/sub + polling بـ ETag |
| النشر | Docker (non-root) + compose تطوير/إنتاج + Caddy HTTPS + pino بلا PII |

## التشغيل السريع (تطوير — Docker)

```bash
cp .env.example .env        # أو: node scripts/gen-env.mjs
docker compose -f docker-compose.dev.yml up -d --build
docker compose -f docker-compose.dev.yml exec app npx prisma migrate deploy
docker compose -f docker-compose.dev.yml exec app npm run db:seed
# → http://localhost:3000
```

حسابات العرض (DEMO_MODE فقط): `patient@demo.aldawa.health` · `doctor@…` · `lab@…` · `lab-supervisor@…` · `officer@…` · `admin@…` — كلمة المرور `Demo1234!` (MFA بالبريد/الشاشة في الديمو).

## الفحوص

```bash
npm run typecheck    # tsc --noEmit
npm run lint         # eslint
npm run i18n:check   # تطابق القاموسين — يفشل عند أي مفتاح ناقص
npm test             # Vitest وحدة
# على بيئة كاملة (postgres+redis+app):
npx vitest run tests/integration --config vitest.int.config.ts
npx playwright test tests/e2e   # السيناريوهات السبعة + قياس زمن الوصول
```

## الحدود الطبية (مضمّنة في الكود والاختبارات)

- لا تشخيص ولا استبعاد للسرطان — الكشف المبكر ≠ تشخيص، والنتيجة الطبيعية لا تنفي المرض.
- التوصية من **قواعد مخزنة كبيانات** معتمدة من المسؤول الطبي فقط (DRAFT→IN_REVIEW→APPROVED→RETIRED) — الذكاء الاصطناعي يشرح فقط.
- لا نسب احتمال — عوامل الخطورة عوامل فقط.
- تحاليل الأورام في الدم (CEA/CA-125/CA19-9) غير موجودة في مسار فحص الأصحاء إطلاقًا.
- لا قيمة طبية في أي إشعار أو حدث أو log أو رسالة صادرة.
- الـ19 بروتوكولًا وقواعد القيم الحرجة الـ12 مسودة منقولة من المرجع كما هي — **تنتظر مراجعة مسؤول طبي مصري حقيقي قبل أي استخدام فعلي**.

## النشر

انظر [DEPLOY.md](./DEPLOY.md) — والسجل الكامل في [CHANGELOG.md](./CHANGELOG.md).
