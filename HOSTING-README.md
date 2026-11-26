# AL-DAWA v2 — حزمة الهوستنج

هذه الحزمة جاهزة للنشر على VPS بنطاق موثّق. الخطوات المختصرة (التفصيل في DEPLOY.md):

```bash
cp .env.example .env      # واملأ الأسرار — لا سر في الكود أو Git
docker compose -f docker-compose.prod.yml up -d --build
docker compose -f docker-compose.prod.yml exec app npx prisma migrate deploy
docker compose -f docker-compose.prod.yml exec app npx tsx prisma/seed-production.ts
docker compose -f docker-compose.prod.yml exec app npx tsx scripts/init-production.ts
# التحقق: curl https://DOMAIN/api/ready
# ثم: اعتماد البروتوكولات وقواعد القيم الحرجة من شاشة المسؤول الطبي قبل أي عميل حقيقي
```

النسخ الاحتياطي: scripts/backup.sh (يومي) + scripts/restore-test.sh (أسبوعيًا) — انظر DEPLOY.md §4.
