@echo off
chcp 65001 >nul
if not exist src\app (echo ناقص src - شغل الملف من فولدر المشروع & pause & exit /b 1)
if not exist scripts (echo ناقص scripts & pause & exit /b 1)
if not exist .git git init
git add -A
git commit -m "Add full project"
git branch -M main
git remote remove origin 2>nul
git remote add origin https://github.com/brns37472884-art/Al-dawa.git
git push -u origin main --force
echo Done. Check src and scripts on GitHub then Redeploy on Railway.
pause
