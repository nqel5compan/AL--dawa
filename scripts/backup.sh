#!/usr/bin/env sh
# ============================================================
# نسخ احتياطي يومي: pg_dump + ملفات التخزين المحلية (إن وجدت)
# cron مقترح: 0 2 * * * /app/scripts/backup.sh >> /var/log/aldawa-backup.log 2>&1
# المتغيرات: BACKUP_DIR (افتراضي /var/backups/aldawa)، PG عبر env
# ============================================================
set -eu
BACKUP_DIR="${BACKUP_DIR:-/var/backups/aldawa}"
STAMP="$(date +%Y%m%d-%H%M%S)"
mkdir -p "$BACKUP_DIR"

# قاعدة البيانات — PG_URL من بيئة الحاوية أو .env
if [ -f .env ]; then
  PG_URL="$(grep -E '^DATABASE_URL=' .env | cut -d'"' -f2)"
else
  PG_URL="${DATABASE_URL:?DATABASE_URL مطلوب}"
fi

echo "[$STAMP] pg_dump…"
PGPASSWORD="" pg_dump --no-owner --no-privileges --format=custom "$PG_URL" > "$BACKUP_DIR/db-$STAMP.dump"

# الملفات المحلية (STORAGE_PROVIDER=local فقط — عند s3/MinIO خذ لقطة الحجم)
if [ -d uploads ] && [ "$(ls -A uploads 2>/dev/null)" ]; then
  echo "[$STAMP] ملفات التخزين…"
  tar czf "$BACKUP_DIR/files-$STAMP.tgz" uploads
fi

# دورة احتفاظ: 30 يومًا
find "$BACKUP_DIR" -name "db-*.dump" -mtime +30 -delete
find "$BACKUP_DIR" -name "files-*.tgz" -mtime +30 -delete

echo "[$STAMP] تم — $(ls -lh "$BACKUP_DIR" | tail -n +2 | wc -l) ملفًا في $BACKUP_DIR"
