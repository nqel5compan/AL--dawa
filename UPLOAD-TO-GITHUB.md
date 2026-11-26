# رفع المشروع كاملًا إلى GitHub (حل خطأ `"/src": not found` على Railway)

## ليه حصل الخطأ؟
المشروع فيه 149 ملف، ورفع GitHub من المتصفح ("Add files via upload") بيقبل حوالي 100 ملف في المرة، وبيتجاهل الملفات الفاضية. فوصل جزء بس من الملفات وضاع مجلد `src/` ومجلد `public/`.
الحل: ارفع بـ **GitHub Desktop** أو **git** بدل المتصفح.

## الطريقة 1 — GitHub Desktop (الأسهل)
1. نزّل GitHub Desktop وسجّل دخول بحسابك.
2. File ← Clone repository ← اختر `brns37472884-art/Al-dawa` ← Clone.
3. افتح فولدر الـ clone، **امسح كل الملفات اللي فيه ما عدا فولدر `.git` المخفي.**
4. فك ضغط الـ zip، وانسخ **كل اللي جوه فولدر `Al-dawa`** (مش الفولدر نفسه) داخل فولدر الـ clone. لازم تنسخ الملفات المخفية كمان (`.gitignore` و`.dockerignore` و`.env.example`).
5. GitHub Desktop هيعرض حوالي 149 ملف متغيّر. اكتب Summary: `Add full project` ثم **Commit to main** ثم **Push origin**.

## الطريقة 2 — git من الـ terminal
```bash
cd Al-dawa            # الفولدر بعد فك الضغط
git init
git add -A
git commit -m "Add full project"
git branch -M main
git remote add origin https://github.com/brns37472884-art/Al-dawa.git
git push -u origin main --force
```
(`--force` هتستبدل المحتوى الناقص الحالي. محتاج تسجيل دخول GitHub أو Personal Access Token.)

## تأكد قبل ما ترجع Railway
افتح الريبو على GitHub وشوف:
- `src/` موجود وفيه `app` و`components` و`lib` و`worker` و`middleware.ts` و`env.ts`.
- `public/robots.txt` موجود.
- `Dockerfile` و`package.json` و`prisma/migrations` في الجذر.
بعدها Railway هيعيد النشر لوحده، أو اضغط Redeploy.

## المفتاح السري (Gemini)
- **لا تضعه في أي ملف في الريبو.** حطه في Railway ← Variables فقط: `EXTERNAL_AI_API_KEY`، ومعاه `EXTERNAL_AI_ENABLED=true` و`EXTERNAL_AI_BASE_URL` و`EXTERNAL_AI_MODEL` (انظر `.env.example`). الخدمتين app وworker يحتاجوا نفس المتغيرات.
- باقي متغيرات Railway وخطوات أول تشغيل: DEPLOY.md قسم 8.
- لحد ما يخلص الإجراء القانوني (DEPLOY.md)، خلي `EXTERNAL_AI_ENABLED=false` لو فيه بيانات مرضى حقيقية، لأن إرسالها لـ Google نقل بيانات خارج مصر.
