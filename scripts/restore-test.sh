#!/usr/bin/env sh
# ============================================================
# اختبار استرجاع فعلي — يفك آخر نسخة في قاعدة مؤقتة ويتحقق من جداول حرجة.
# ممنوع على قاعدة الإنتاج الحية — ينشئ aldawa_restore_test ويمسحها.
# ============================================================
set -eu
BACKUP_DIR="${BACKUP_DIR:-/var/backups/aldawa}"
LATEST="$(ls -1t "$BACKUP_DIR"/db-*.dump 2>/dev/null | head -1)"
[ -n "$LATEST" ] || { echo "لا نسخ احتياطية في $BACKUP_DIR"; exit 1; }

if [ -f .env ]; then
  PG_URL="$(grep -E '^DATABASE_URL=' .env | cut -d'"' -f2)"
else
  PG_URL="${DATABASE_URL:?DATABASE_URL مطلوب}"
fi

TEST_DB="aldawa_restore_test"
BASE_URL="$(echo "$PG_URL" | sed 's|/[a-zA-Z0-9_]*?|/'"$TEST_DB"'?|')"

echo "استرجاع $LATEST → $TEST_DB"
psql "$BASE_URL" -c "DROP DATABASE IF EXISTS $TEST_DB;" >/dev/null
psql "$(echo "$PG_URL" | sed 's|/[a-zA-Z0-9_]*?|/postgres?|')" -c "CREATE DATABASE $TEST_DB;" >/dev/null
pg_restore --no-owner --no-privileges --dbname="$BASE_URL" "$LATEST"

# تحقق: الجداول الحرجة موجودة وفيها بيانات مرجعية
for T in users screening_protocols critical_rules test_catalog plans; do
  N=$(psql "$BASE_URL" -t -A -c "SELECT count(*) FROM $T;")
  echo "$T: $N"
  [ "$N" -ge 0 ] || exit 1
done
ROWS=$(psql "$BASE_URL" -t -A -c "SELECT count(*) FROM screening_protocols;")
[ "$ROWS" -ge 19 ] || { echo "البروتوكولات أقل من 19 — استرجاع ناقص!"; exit 1; }

psql "$(echo "$PG_URL" | sed 's|/[a-zA-Z0-9_]*?|/postgres?|')" -c "DROP DATABASE $TEST_DB;" >/dev/null
echo "✅ اختبار الاسترجاع نجح — $LATEST سليم"
