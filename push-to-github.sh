#!/usr/bin/env bash
# شغّله من جوه فولدر المشروع (اللي فيه Dockerfile و src): bash push-to-github.sh
set -e
for p in Dockerfile package.json src/app src/lib src/worker scripts prisma/migrations public; do
  [ -e "$p" ] || { echo "ناقص: $p — أنت مش في فولدر المشروع الصحيح"; exit 1; }
done
echo "عدد الملفات: $(find . -type f -not -path './.git/*' -not -path './node_modules/*' | wc -l) (المفروض ~150)"
[ -d .git ] || git init
git add -A
git commit -m "Add full project" || true
git branch -M main
git remote remove origin 2>/dev/null || true
git remote add origin https://github.com/brns37472884-art/Al-dawa.git
git push -u origin main --force
echo "تم. افحص GitHub إن src و scripts موجودين، وبعدها Redeploy على Railway."
